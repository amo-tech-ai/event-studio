-- migration: CRM tables for customer relationship management
-- purpose: adds 4 core CRM tables for contact and company management
-- tables: contacts, companies, interactions, notes
-- priority: HIGH - differentiator vs basic event platforms
-- reference: /home/sk/event-studio/supabase/docs/CRM_EVENT_SCHEMA_SUMMARY.md

-- ============================================================================
-- 1) COMPANIES - Business entities (B2B customers)
-- ============================================================================

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid not null references public.profiles(id) on delete cascade,

  -- Company details
  name varchar(255) not null,
  slug varchar(255) unique,
  industry varchar(100),
  company_size varchar(50) check (company_size in ('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+')),

  -- Contact information
  website_url text,
  phone varchar(50),
  email varchar(255),

  -- Address
  address_line1 text,
  address_line2 text,
  city varchar(100),
  state_province varchar(100),
  postal_code varchar(20),
  country varchar(2) default 'US',

  -- Business
  annual_revenue decimal(14,2),
  currency varchar(3) default 'USD',

  -- Social
  linkedin_url text,
  twitter_handle varchar(100),

  -- CRM data
  lead_source varchar(100),
  status varchar(50) default 'ACTIVE' check (status in ('ACTIVE', 'PROSPECT', 'CUSTOMER', 'INACTIVE')),
  tags text[] default array[]::text[],
  custom_fields jsonb default '{}'::jsonb,

  -- Engagement
  total_events_attended integer default 0,
  total_revenue decimal(14,2) default 0,
  last_interaction_at timestamptz,

  -- Metadata
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.companies is 'B2B companies for corporate event sales and relationship management';
comment on column public.companies.slug is 'URL-friendly identifier auto-generated from name';
comment on column public.companies.tags is 'Array of tags for segmentation and filtering';

-- Indexes
create index idx_companies_organizer_id on public.companies(organizer_id);
create index idx_companies_slug on public.companies(slug);
create index idx_companies_status on public.companies(organizer_id, status);
create index idx_companies_tags on public.companies using gin(tags);
create index idx_companies_name_search on public.companies using gin(to_tsvector('english', name));

-- Auto-generate slug from name
create or replace function public.generate_company_slug()
returns trigger
language plpgsql
security invoker
as $$
begin
  if new.slug is null or new.slug = '' then
    new.slug = lower(
      regexp_replace(
        regexp_replace(
          new.name,
          '[^a-zA-Z0-9]+',
          '-',
          'g'
        ),
        '^-+|-+$',
        '',
        'g'
      )
    ) || '-' || substr(new.id::text, 1, 8);
  end if;
  return new;
end;
$$;

create trigger generate_company_slug_trigger
  before insert or update on public.companies
  for each row
  execute function public.generate_company_slug();

-- RLS Policies
alter table public.companies enable row level security;

create policy "Organizers manage their own companies"
  on public.companies
  for all
  using (organizer_id = (select auth.uid()));

-- Trigger for updated_at
create trigger update_companies_updated_at
  before update on public.companies
  for each row
  execute function public.handle_updated_at();

-- ============================================================================
-- 2) CONTACTS - Individual people (B2B and B2C)
-- ============================================================================

create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid not null references public.profiles(id) on delete cascade,
  company_id uuid references public.companies(id) on delete set null,

  -- Personal details
  first_name varchar(100) not null,
  last_name varchar(100) not null,
  full_name varchar(255) generated always as (first_name || ' ' || last_name) stored,
  email varchar(255) not null,
  phone varchar(50),
  mobile_phone varchar(50),

  -- Professional
  job_title varchar(150),
  department varchar(100),
  linkedin_url text,
  twitter_handle varchar(100),

  -- Address
  address_line1 text,
  address_line2 text,
  city varchar(100),
  state_province varchar(100),
  postal_code varchar(20),
  country varchar(2) default 'US',

  -- CRM data
  lead_source varchar(100),
  status varchar(50) default 'ACTIVE' check (status in ('ACTIVE', 'PROSPECT', 'LEAD', 'CUSTOMER', 'INACTIVE')),
  tags text[] default array[]::text[],
  custom_fields jsonb default '{}'::jsonb,

  -- Engagement tracking
  total_events_attended integer default 0,
  total_spent decimal(14,2) default 0,
  last_interaction_at timestamptz,
  last_event_attended_at timestamptz,

  -- Communication preferences
  email_consent boolean default true,
  sms_consent boolean default false,
  whatsapp_consent boolean default false,

  -- Metadata
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Constraints
  constraint email_format check (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

comment on table public.contacts is 'Individual contacts for CRM - both B2B (company employees) and B2C customers';
comment on column public.contacts.full_name is 'Auto-generated from first_name + last_name';
comment on column public.contacts.company_id is 'Optional link to company for B2B contacts';

-- Indexes
create index idx_contacts_organizer_id on public.contacts(organizer_id);
create index idx_contacts_company_id on public.contacts(company_id) where company_id is not null;
create index idx_contacts_email on public.contacts(email);
create index idx_contacts_status on public.contacts(organizer_id, status);
create index idx_contacts_tags on public.contacts using gin(tags);
create index idx_contacts_name_search on public.contacts using gin(to_tsvector('english', full_name));

-- RLS Policies
alter table public.contacts enable row level security;

create policy "Organizers manage their own contacts"
  on public.contacts
  for all
  using (organizer_id = (select auth.uid()));

-- Trigger for updated_at
create trigger update_contacts_updated_at
  before update on public.contacts
  for each row
  execute function public.handle_updated_at();

-- ============================================================================
-- 3) INTERACTIONS - Contact/company interactions and touchpoints
-- ============================================================================

create table public.interactions (
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid not null references public.profiles(id) on delete cascade,

  -- Related entities
  contact_id uuid references public.contacts(id) on delete cascade,
  company_id uuid references public.companies(id) on delete cascade,
  event_id uuid references public.events(id) on delete set null,

  -- Interaction details
  interaction_type varchar(50) not null check (interaction_type in (
    'EMAIL', 'CALL', 'MEETING', 'EVENT_ATTENDANCE', 'TICKET_PURCHASE',
    'WEBSITE_VISIT', 'DEMO_REQUEST', 'SUPPORT', 'NOTE', 'OTHER'
  )),
  subject varchar(255) not null,
  description text,
  outcome varchar(100),

  -- Timing
  interaction_date timestamptz not null default now(),
  duration_minutes integer check (duration_minutes > 0),

  -- Follow-up
  requires_follow_up boolean default false,
  follow_up_date date,
  follow_up_notes text,

  -- Metadata
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Constraints
  constraint contact_or_company_required check (contact_id is not null or company_id is not null)
);

comment on table public.interactions is 'Log of all interactions with contacts and companies for relationship tracking';
comment on column public.interactions.interaction_type is 'Type of interaction: email, call, meeting, event attendance, etc.';
comment on column public.interactions.outcome is 'Result of interaction: scheduled demo, closed deal, no interest, etc.';

-- Indexes
create index idx_interactions_organizer_id on public.interactions(organizer_id);
create index idx_interactions_contact_id on public.interactions(contact_id) where contact_id is not null;
create index idx_interactions_company_id on public.interactions(company_id) where company_id is not null;
create index idx_interactions_event_id on public.interactions(event_id) where event_id is not null;
create index idx_interactions_date on public.interactions(interaction_date desc);
create index idx_interactions_follow_up on public.interactions(follow_up_date) where requires_follow_up = true;

-- RLS Policies
alter table public.interactions enable row level security;

create policy "Organizers manage their own interactions"
  on public.interactions
  for all
  using (organizer_id = (select auth.uid()));

-- Trigger for updated_at
create trigger update_interactions_updated_at
  before update on public.interactions
  for each row
  execute function public.handle_updated_at();

-- Trigger to update last_interaction_at on contacts/companies
create or replace function public.update_last_interaction_timestamp()
returns trigger
language plpgsql
security invoker
as $$
begin
  -- Update contact
  if new.contact_id is not null then
    update public.contacts
    set last_interaction_at = new.interaction_date
    where id = new.contact_id;
  end if;

  -- Update company
  if new.company_id is not null then
    update public.companies
    set last_interaction_at = new.interaction_date
    where id = new.company_id;
  end if;

  return new;
end;
$$;

create trigger update_last_interaction_trigger
  after insert on public.interactions
  for each row
  execute function public.update_last_interaction_timestamp();

-- ============================================================================
-- 4) NOTES - Quick notes attached to contacts, companies, or events
-- ============================================================================

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid not null references public.profiles(id) on delete cascade,

  -- Related entities (at least one required)
  contact_id uuid references public.contacts(id) on delete cascade,
  company_id uuid references public.companies(id) on delete cascade,
  event_id uuid references public.events(id) on delete cascade,

  -- Note content
  title varchar(255),
  content text not null,
  note_type varchar(50) default 'GENERAL' check (note_type in (
    'GENERAL', 'CALL', 'MEETING', 'EMAIL', 'FOLLOW_UP', 'REMINDER', 'OTHER'
  )),

  -- Pinning
  is_pinned boolean default false,

  -- Metadata
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Constraints
  constraint at_least_one_entity check (
    contact_id is not null or company_id is not null or event_id is not null
  )
);

comment on table public.notes is 'Quick notes and reminders attached to contacts, companies, or events';
comment on column public.notes.is_pinned is 'Pinned notes appear at the top of the timeline';

-- Indexes
create index idx_notes_organizer_id on public.notes(organizer_id);
create index idx_notes_contact_id on public.notes(contact_id) where contact_id is not null;
create index idx_notes_company_id on public.notes(company_id) where company_id is not null;
create index idx_notes_event_id on public.notes(event_id) where event_id is not null;
create index idx_notes_created_at on public.notes(created_at desc);
create index idx_notes_pinned on public.notes(is_pinned) where is_pinned = true;
create index idx_notes_content_search on public.notes using gin(to_tsvector('english', content));

-- RLS Policies
alter table public.notes enable row level security;

create policy "Organizers manage their own notes"
  on public.notes
  for all
  using (organizer_id = (select auth.uid()));

-- Trigger for updated_at
create trigger update_notes_updated_at
  before update on public.notes
  for each row
  execute function public.handle_updated_at();

-- ============================================================================
-- HELPER VIEWS FOR CRM ANALYTICS
-- ============================================================================

-- View: Contact engagement summary
create or replace view public.contact_engagement_summary as
select
  c.id as contact_id,
  c.organizer_id,
  c.full_name,
  c.email,
  c.company_id,
  c.total_events_attended,
  c.total_spent,
  c.last_interaction_at,
  count(distinct i.id) as total_interactions,
  count(distinct i.id) filter (where i.interaction_type = 'EMAIL') as email_count,
  count(distinct i.id) filter (where i.interaction_type = 'CALL') as call_count,
  count(distinct i.id) filter (where i.interaction_type = 'MEETING') as meeting_count,
  count(distinct n.id) as total_notes,
  max(i.interaction_date) as last_interaction_date
from public.contacts c
left join public.interactions i on i.contact_id = c.id
left join public.notes n on n.contact_id = c.id
group by c.id, c.organizer_id, c.full_name, c.email, c.company_id,
         c.total_events_attended, c.total_spent, c.last_interaction_at;

comment on view public.contact_engagement_summary is 'Summary of contact engagement metrics for CRM dashboard';

-- View: Company engagement summary
create or replace view public.company_engagement_summary as
select
  co.id as company_id,
  co.organizer_id,
  co.name as company_name,
  co.industry,
  co.company_size,
  co.total_events_attended,
  co.total_revenue,
  co.last_interaction_at,
  count(distinct c.id) as total_contacts,
  count(distinct i.id) as total_interactions,
  count(distinct n.id) as total_notes,
  max(i.interaction_date) as last_interaction_date
from public.companies co
left join public.contacts c on c.company_id = co.id
left join public.interactions i on i.company_id = co.id
left join public.notes n on n.company_id = co.id
group by co.id, co.organizer_id, co.name, co.industry, co.company_size,
         co.total_events_attended, co.total_revenue, co.last_interaction_at;

comment on view public.company_engagement_summary is 'Summary of company engagement metrics for CRM dashboard';

-- ============================================================================
-- COMPLETION
-- ============================================================================

do $$
begin
  raise notice '✅ CRM tables migration completed successfully';
  raise notice '📊 Added 4 tables: companies, contacts, interactions, notes';
  raise notice '📈 Added 2 analytics views for CRM dashboards';
  raise notice '🎯 CRM capability: B2B and B2C relationship management';
  raise notice '📈 Next: Add operations tables (organizers, payments, budgets, tasks, vendors)';
end $$;
