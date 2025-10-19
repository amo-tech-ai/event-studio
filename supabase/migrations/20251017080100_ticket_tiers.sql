-- =====================================================
-- Migration: ticket_tiers table
-- Purpose: Ticket pricing tiers for Event Wizard Stage 4 (Ticketing)
-- Affected tables: ticket_tiers (new)
-- Dependencies: events table must exist
-- Special considerations: Separates tier configuration from individual ticket instances
-- IMPORTANT: This is different from individual ticket instances (which track QR codes, check-ins, etc.)
-- =====================================================

-- Create ticket_tiers table
-- Defines pricing levels for events (Early Bird, Regular, VIP, etc.)
-- Configured during Event Wizard Stage 4
create table public.ticket_tiers (
  id uuid primary key default uuid_generate_v4(),

  -- Event relationship
  event_id uuid not null references public.events(id) on delete cascade,

  -- Tier identification
  name text not null, -- "Early Bird", "Regular", "VIP", "Student", etc.
  slug text not null, -- URL-friendly: "early-bird", "regular", "vip"
  description text,

  -- Tier classification
  tier_type text default 'regular' not null check (tier_type in (
    'early_bird',
    'regular',
    'vip',
    'student',
    'group',
    'free',
    'sponsor',
    'speaker'
  )),

  -- Pricing
  price numeric(10,2) not null default 0 check (price >= 0),
  currency text default 'USD' not null,

  -- Quantity management
  quantity_total integer not null check (quantity_total > 0),
  quantity_sold integer default 0 check (quantity_sold >= 0),
  quantity_available integer generated always as (quantity_total - quantity_sold) stored,

  -- Sales period (optional)
  sale_start_date timestamptz,
  sale_end_date timestamptz,

  -- Tier status
  status text default 'active' not null check (status in ('active', 'inactive', 'sold_out', 'cancelled')),

  -- Display options
  display_order integer default 0,
  is_featured boolean default false,
  is_hidden boolean default false,

  -- Metadata
  custom_fields jsonb default '{}'::jsonb,

  -- Timestamps
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,

  -- Constraints
  constraint unique_event_tier_slug unique (event_id, slug),
  constraint valid_sale_dates check (
    sale_start_date is null or sale_end_date is null or sale_start_date <= sale_end_date
  ),
  constraint valid_quantity_sold check (quantity_sold <= quantity_total)
);

-- Add comments for documentation
comment on table public.ticket_tiers is 'Ticket pricing tiers for events (configured during Event Wizard Stage 4)';
comment on column public.ticket_tiers.tier_type is 'Classification: early_bird, regular, vip, student, group, free, sponsor, speaker';
comment on column public.ticket_tiers.quantity_available is 'Computed column: quantity_total - quantity_sold';
comment on column public.ticket_tiers.sale_start_date is 'Optional: When this tier becomes available for purchase';
comment on column public.ticket_tiers.sale_end_date is 'Optional: When this tier stops being available';
comment on column public.ticket_tiers.display_order is 'Order for displaying tiers (lower numbers first)';

-- Create indexes for performance
create index idx_ticket_tiers_event_id on public.ticket_tiers(event_id);
create index idx_ticket_tiers_tier_type on public.ticket_tiers(tier_type);
create index idx_ticket_tiers_status on public.ticket_tiers(status);
create index idx_ticket_tiers_display_order on public.ticket_tiers(display_order);
create index idx_ticket_tiers_sale_dates on public.ticket_tiers(sale_start_date, sale_end_date);
create index idx_ticket_tiers_slug on public.ticket_tiers(event_id, slug);

-- Enable Row Level Security
alter table public.ticket_tiers enable row level security;

-- RLS Policy: Public can view active tiers for published events
create policy "public can view active tiers for published events"
  on public.ticket_tiers
  for select
  to anon
  using (
    status = 'active'
    and is_hidden = false
    and exists (
      select 1 from public.events
      where events.id = ticket_tiers.event_id
      and events.status = 'published'
      and events.visibility = 'public'
    )
  );

-- RLS Policy: Authenticated users can view active tiers
create policy "authenticated can view active tiers"
  on public.ticket_tiers
  for select
  to authenticated
  using (
    status = 'active'
    and is_hidden = false
    and exists (
      select 1 from public.events
      where events.id = ticket_tiers.event_id
      and events.status = 'published'
    )
  );

-- RLS Policy: Event organizers can view all tiers for their events
create policy "organizers can view all tiers for their events"
  on public.ticket_tiers
  for select
  to authenticated
  using (
    exists (
      select 1 from public.events
      where events.id = ticket_tiers.event_id
      and events.organizer_id = auth.uid()
    )
  );

-- RLS Policy: Event organizers can create tiers for their events
create policy "organizers can create tiers for their events"
  on public.ticket_tiers
  for insert
  to authenticated
  with check (
    auth.uid() is not null
    and exists (
      select 1 from public.events
      where events.id = ticket_tiers.event_id
      and events.organizer_id = auth.uid()
    )
  );

-- RLS Policy: Event organizers can update tiers for their events
create policy "organizers can update tiers for their events"
  on public.ticket_tiers
  for update
  to authenticated
  using (
    exists (
      select 1 from public.events
      where events.id = ticket_tiers.event_id
      and events.organizer_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.events
      where events.id = ticket_tiers.event_id
      and events.organizer_id = auth.uid()
    )
  );

-- RLS Policy: Event organizers can delete tiers (if no tickets sold)
create policy "organizers can delete tiers with no sales"
  on public.ticket_tiers
  for delete
  to authenticated
  using (
    quantity_sold = 0
    and exists (
      select 1 from public.events
      where events.id = ticket_tiers.event_id
      and events.organizer_id = auth.uid()
    )
  );

-- Function: Automatically update updated_at timestamp
create or replace function public.update_ticket_tier_updated_at()
returns trigger
language plpgsql
security definer
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

comment on function public.update_ticket_tier_updated_at() is 'Automatically updates updated_at on ticket tier updates';

-- Trigger: Auto-update timestamp
create trigger set_ticket_tier_updated_at
  before update on public.ticket_tiers
  for each row
  execute function public.update_ticket_tier_updated_at();

-- Function: Generate slug from name
create or replace function public.generate_ticket_tier_slug()
returns trigger
language plpgsql
security definer
as $$
declare
  base_slug text;
  counter integer := 1;
begin
  -- Only generate if slug is null or empty
  if new.slug is null or new.slug = '' then
    -- Create base slug from name
    base_slug := lower(
      regexp_replace(
        regexp_replace(new.name, '[^a-zA-Z0-9\s]', '', 'g'),
        '\s+', '-', 'g'
      )
    );

    new.slug := base_slug;

    -- Ensure uniqueness within event
    while exists (
      select 1 from public.ticket_tiers
      where event_id = new.event_id
      and slug = new.slug
      and id != coalesce(new.id, '00000000-0000-0000-0000-000000000000'::uuid)
    ) loop
      new.slug := base_slug || '-' || counter;
      counter := counter + 1;
    end loop;
  end if;

  return new;
end;
$$;

comment on function public.generate_ticket_tier_slug() is 'Generates URL-friendly slug from tier name, ensuring uniqueness within event';

-- Trigger: Auto-generate slug
create trigger generate_ticket_tier_slug_trigger
  before insert or update on public.ticket_tiers
  for each row
  execute function public.generate_ticket_tier_slug();

-- Function: Auto-mark tier as sold_out when quantity_sold >= quantity_total
create or replace function public.check_ticket_tier_sold_out()
returns trigger
language plpgsql
security definer
as $$
begin
  if new.quantity_sold >= new.quantity_total and new.status = 'active' then
    new.status := 'sold_out';
  elsif new.quantity_sold < new.quantity_total and new.status = 'sold_out' then
    -- Reactivate if quantity becomes available (e.g., refund)
    new.status := 'active';
  end if;

  return new;
end;
$$;

comment on function public.check_ticket_tier_sold_out() is 'Automatically marks tier as sold_out when quantity_sold reaches quantity_total';

-- Trigger: Auto-check sold out status
create trigger check_ticket_tier_sold_out_trigger
  before insert or update on public.ticket_tiers
  for each row
  execute function public.check_ticket_tier_sold_out();

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant select on public.ticket_tiers to anon;
grant select, insert, update, delete on public.ticket_tiers to authenticated;

-- Sample data for development (optional - remove in production)
-- insert into public.ticket_tiers (
--   event_id,
--   name,
--   description,
--   tier_type,
--   price,
--   currency,
--   quantity_total
-- )
-- select
--   events.id,
--   'Early Bird',
--   'Save 30% with early registration',
--   'early_bird',
--   199.00,
--   'USD',
--   150
-- from public.events
-- where events.slug = 'ai-summit-2025'
-- limit 1;
