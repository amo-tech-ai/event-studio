-- =====================================================
-- migration: sponsorships and deliverable tracking
-- purpose: track confirmed sponsorships and automated deliverable management
-- affected tables: sponsorships, sponsor_deliverables (new)
-- dependencies: sponsors, events, auth.users must exist
-- special considerations: integrates with operations agent for deadline tracking
-- =====================================================

-- =============================================================================
-- 1. sponsorships table
-- =============================================================================

-- create sponsorships table
-- represents confirmed sponsor partnerships (converted from proposals)
create table public.sponsorships (
  id uuid primary key default uuid_generate_v4(),

  -- relationships
  event_id uuid not null references public.events(id) on delete cascade,
  sponsor_id uuid not null references public.sponsors(id) on delete restrict,
  -- restrict to prevent accidental deletion of sponsor with active sponsorships
  proposal_id uuid references public.sponsor_proposals(id) on delete set null,

  -- sponsorship details
  package_level text not null check (package_level in (
    'platinum', 'gold', 'silver', 'bronze', 'custom'
  )),
  package_name text, -- e.g., "Diamond Sponsor", "Presenting Sponsor"

  -- financial details
  amount numeric(10,2) not null check (amount >= 0),
  currency text default 'USD',
  payment_terms text, -- e.g., "net 30", "50% upfront, 50% post-event"

  -- status tracking
  status text default 'pending' check (status in (
    'pending',      -- awaiting contract signature
    'active',       -- contract signed, deliverables in progress
    'completed',    -- event finished, all deliverables fulfilled
    'cancelled',    -- cancelled before event
    'refunded'      -- refunded after cancellation
  )),

  -- contract details
  contract_url text,
  contract_signed_at timestamptz,
  contract_signed_by text, -- sponsor contact who signed

  -- payment tracking
  payment_status text default 'unpaid' check (payment_status in (
    'unpaid', 'partial', 'paid', 'refunded'
  )),
  amount_paid numeric(10,2) default 0,
  payment_date date,
  payment_method text, -- e.g., "wire transfer", "credit card", "check"

  -- renewal tracking
  renewal_eligible boolean default false,
  renewal_offer_sent boolean default false,
  renewal_offer_sent_at timestamptz,

  -- performance tracking
  sponsor_satisfaction_score integer check (sponsor_satisfaction_score >= 1 and sponsor_satisfaction_score <= 5),
  -- 1-5 rating from post-event survey
  would_sponsor_again boolean,
  post_event_feedback text,

  -- metadata
  metadata jsonb default '{}'::jsonb,
  -- {
  --   "booth_number": "A-15",
  --   "contact_person": "...",
  --   "special_requirements": "...",
  --   "invoice_number": "INV-2025-001"
  -- }

  -- ownership
  created_by uuid references auth.users(id) on delete set null,

  -- timestamps
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  completed_at timestamptz,
  cancelled_at timestamptz
);

-- add comments
comment on table public.sponsorships is 'confirmed sponsor partnerships for events';
comment on column public.sponsorships.amount is 'total sponsorship value in specified currency';
comment on column public.sponsorships.payment_status is 'tracking payment: unpaid, partial, paid, refunded';
comment on column public.sponsorships.sponsor_satisfaction_score is 'post-event satisfaction rating 1-5';
comment on column public.sponsorships.renewal_eligible is 'whether sponsor can renew for next event';

-- create indexes
create index idx_sponsorships_event on public.sponsorships(event_id);
create index idx_sponsorships_sponsor on public.sponsorships(sponsor_id);
create index idx_sponsorships_proposal on public.sponsorships(proposal_id) where proposal_id is not null;
create index idx_sponsorships_status on public.sponsorships(status);
create index idx_sponsorships_payment_status on public.sponsorships(payment_status);
create index idx_sponsorships_package_level on public.sponsorships(package_level);
create index idx_sponsorships_created on public.sponsorships(created_at desc);
create index idx_sponsorships_renewal on public.sponsorships(renewal_eligible)
  where renewal_eligible = true;

-- enable rls
alter table public.sponsorships enable row level security;

-- rls policy: organizers can view sponsorships for their events
create policy "organizers view sponsorships for their events"
  on public.sponsorships
  for select
  to authenticated
  using (
    exists (
      select 1 from public.events
      where events.id = sponsorships.event_id
      and events.organizer_id = auth.uid()
    )
  );

-- rls policy: organizers can create sponsorships for their events
create policy "organizers create sponsorships for their events"
  on public.sponsorships
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.events
      where events.id = sponsorships.event_id
      and events.organizer_id = auth.uid()
    )
  );

-- rls policy: organizers can update sponsorships for their events
create policy "organizers update sponsorships for their events"
  on public.sponsorships
  for update
  to authenticated
  using (
    exists (
      select 1 from public.events
      where events.id = sponsorships.event_id
      and events.organizer_id = auth.uid()
    )
  );

-- =============================================================================
-- 2. sponsor_deliverables table
-- =============================================================================

-- create sponsor_deliverables table
-- tracks required deliverables from sponsors with automated reminder system
create table public.sponsor_deliverables (
  id uuid primary key default uuid_generate_v4(),

  -- relationships
  sponsorship_id uuid not null references public.sponsorships(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,

  -- deliverable details
  name text not null,
  description text,
  deliverable_type text not null check (deliverable_type in (
    'logo',                -- company logo
    'banner',              -- banner image
    'video',               -- promotional video
    'speaker_bio',         -- speaker information
    'booth_materials',     -- booth/exhibitor materials
    'promotional_items',   -- swag, giveaways
    'content_approval',    -- approval of marketing content
    'payment',             -- payment milestone
    'contract',            -- signed contract
    'insurance',           -- insurance certificate
    'other'               -- custom deliverable
  )),

  -- timeline
  due_date date not null,
  submitted_date date,

  -- status tracking
  status text default 'pending' check (status in (
    'pending',       -- not yet submitted
    'in_progress',   -- sponsor working on it
    'submitted',     -- sponsor submitted
    'approved',      -- organizer approved
    'rejected',      -- organizer rejected, needs revision
    'overdue'        -- past due date, not submitted
  )),

  -- file tracking
  file_url text,
  file_type text, -- e.g., "image/png", "application/pdf", "video/mp4"
  file_size_bytes integer,

  -- approval workflow
  requires_approval boolean default true,
  approved_by uuid references auth.users(id) on delete set null,
  approved_at timestamptz,
  rejection_reason text,
  revision_notes text,

  -- automation tracking
  workflow_id uuid,
  -- references automation_workflows(id) - will be added in next migration
  reminders_sent integer default 0,
  last_reminder_sent_at timestamptz,
  auto_escalated boolean default false,

  -- metadata
  metadata jsonb default '{}'::jsonb,
  -- {
  --   "dimensions": "1920x1080",
  --   "file_format": "PNG with transparency",
  --   "submission_instructions": "..."
  -- }

  -- timestamps
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- add comments
comment on table public.sponsor_deliverables is 'tracks sponsor deliverables with automated reminders';
comment on column public.sponsor_deliverables.deliverable_type is 'type of deliverable: logo, banner, video, etc.';
comment on column public.sponsor_deliverables.due_date is 'deadline for deliverable submission';
comment on column public.sponsor_deliverables.reminders_sent is 'count of automated reminders sent';
comment on column public.sponsor_deliverables.workflow_id is 'associated automation workflow for tracking';

-- create indexes
create index idx_deliverables_sponsorship on public.sponsor_deliverables(sponsorship_id);
create index idx_deliverables_event on public.sponsor_deliverables(event_id);
create index idx_deliverables_type on public.sponsor_deliverables(deliverable_type);
create index idx_deliverables_status on public.sponsor_deliverables(status);
create index idx_deliverables_due_date on public.sponsor_deliverables(due_date);
create index idx_deliverables_workflow on public.sponsor_deliverables(workflow_id)
  where workflow_id is not null;

-- index for finding overdue deliverables
create index idx_deliverables_overdue on public.sponsor_deliverables(due_date, status)
  where status not in ('submitted', 'approved') and due_date < current_date;

-- enable rls
alter table public.sponsor_deliverables enable row level security;

-- rls policy: organizers can view deliverables for their events
create policy "organizers view deliverables for their events"
  on public.sponsor_deliverables
  for select
  to authenticated
  using (
    exists (
      select 1 from public.events
      where events.id = sponsor_deliverables.event_id
      and events.organizer_id = auth.uid()
    )
  );

-- rls policy: organizers can create deliverables for their events
create policy "organizers create deliverables for their events"
  on public.sponsor_deliverables
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.events
      where events.id = sponsor_deliverables.event_id
      and events.organizer_id = auth.uid()
    )
  );

-- rls policy: organizers can update deliverables for their events
create policy "organizers update deliverables for their events"
  on public.sponsor_deliverables
  for update
  to authenticated
  using (
    exists (
      select 1 from public.events
      where events.id = sponsor_deliverables.event_id
      and events.organizer_id = auth.uid()
    )
  );

-- =============================================================================
-- functions
-- =============================================================================

-- function: auto-update updated_at for sponsorships
create or replace function public.handle_sponsorship_updated_at()
returns trigger
language plpgsql
security definer
as $$
begin
  new.updated_at = now();

  -- mark completed when status changes to completed
  if old.status != 'completed' and new.status = 'completed' then
    new.completed_at = now();
  end if;

  -- mark cancelled when status changes to cancelled
  if old.status != 'cancelled' and new.status = 'cancelled' then
    new.cancelled_at = now();
  end if;

  -- update sponsor relationship stats
  update public.sponsors
  set total_sponsorships = (
    select count(*) from public.sponsorships
    where sponsor_id = new.sponsor_id
    and status = 'completed'
  ),
  last_sponsorship_date = case
    when new.status = 'completed' then new.completed_at::date
    else last_sponsorship_date
  end
  where id = new.sponsor_id;

  return new;
end;
$$;

comment on function public.handle_sponsorship_updated_at is 'auto-updates timestamps and sponsor stats';

-- trigger for sponsorships
create trigger set_sponsorship_updated_at
  before update on public.sponsorships
  for each row
  execute function public.handle_sponsorship_updated_at();

-- function: auto-update updated_at for deliverables
create or replace function public.handle_deliverable_updated_at()
returns trigger
language plpgsql
security definer
as $$
begin
  new.updated_at = now();

  -- auto-mark as overdue if past due date and not submitted
  if new.due_date < current_date
     and new.status not in ('submitted', 'approved')
     and old.status != 'overdue' then
    new.status = 'overdue';
  end if;

  return new;
end;
$$;

comment on function public.handle_deliverable_updated_at is 'auto-updates timestamps and marks overdue';

-- trigger for deliverables
create trigger set_deliverable_updated_at
  before update on public.sponsor_deliverables
  for each row
  execute function public.handle_deliverable_updated_at();

-- function: check all overdue deliverables
-- called by cron job or operations agent daily
create or replace function public.check_overdue_deliverables()
returns table(
  deliverable_id uuid,
  deliverable_name text,
  sponsor_name text,
  event_name text,
  days_overdue integer
)
language plpgsql
security definer
as $$
begin
  return query
  select
    sd.id,
    sd.name,
    s.company_name,
    e.name,
    (current_date - sd.due_date)::integer
  from public.sponsor_deliverables sd
  join public.sponsorships sp on sp.id = sd.sponsorship_id
  join public.sponsors s on s.id = sp.sponsor_id
  join public.events e on e.id = sd.event_id
  where sd.status not in ('submitted', 'approved')
    and sd.due_date < current_date
  order by sd.due_date asc;
end;
$$;

comment on function public.check_overdue_deliverables is 'finds all overdue deliverables for operations agent';

-- function: calculate sponsorship roi
create or replace function public.calculate_sponsorship_roi(
  p_sponsorship_id uuid
)
returns numeric
language plpgsql
security definer
as $$
declare
  v_amount numeric;
  v_estimated_value numeric := 0;
  v_roi numeric;
begin
  -- get sponsorship amount
  select amount into v_amount
  from public.sponsorships
  where id = p_sponsorship_id;

  -- calculate estimated value (placeholder logic - would be more sophisticated)
  -- based on: attendee count, brand impressions, leads generated, etc.
  select
    (e.capacity * 20) + -- $20 per attendee impression
    (100 * 50) -- assume 100 qualified leads at $50 each
  into v_estimated_value
  from public.sponsorships sp
  join public.events e on e.id = sp.event_id
  where sp.id = p_sponsorship_id;

  -- calculate roi as percentage
  if v_amount > 0 then
    v_roi = ((v_estimated_value - v_amount) / v_amount) * 100;
  else
    v_roi = 0;
  end if;

  return round(v_roi, 2);
end;
$$;

comment on function public.calculate_sponsorship_roi is 'calculates estimated roi for sponsorship';

-- =============================================================================
-- grant permissions
-- =============================================================================

grant usage on schema public to anon, authenticated;
grant select, insert, update on public.sponsorships to authenticated;
grant select, insert, update on public.sponsor_deliverables to authenticated;
grant execute on function public.check_overdue_deliverables to authenticated;
grant execute on function public.calculate_sponsorship_roi to authenticated;

-- =============================================================================
-- sample data (commented out - uncomment for testing)
-- =============================================================================

-- insert into public.sponsorships (
--   event_id,
--   sponsor_id,
--   package_level,
--   amount,
--   status,
--   payment_status
-- )
-- select
--   (select id from public.events limit 1),
--   (select id from public.sponsors where company_name = 'NVIDIA Corporation'),
--   'platinum',
--   80000.00,
--   'active',
--   'paid'
-- where exists (select 1 from public.events) and exists (select 1 from public.sponsors);

-- insert into public.sponsor_deliverables (
--   sponsorship_id,
--   event_id,
--   name,
--   deliverable_type,
--   due_date,
--   status
-- )
-- select
--   (select id from public.sponsorships limit 1),
--   (select event_id from public.sponsorships limit 1),
--   'High-resolution logo',
--   'logo',
--   current_date + interval '14 days',
--   'pending'
-- where exists (select 1 from public.sponsorships);
