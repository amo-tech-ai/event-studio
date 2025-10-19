-- =====================================================
-- Migration: venue_bookings table
-- Purpose: Venue marketplace booking system for Event Wizard Stage 3
-- Affected tables: venue_bookings (new)
-- Dependencies: events and venues tables must exist
-- Special considerations: Supports booking requests before auth, availability checking, status tracking
-- =====================================================

-- Create venue_bookings table
-- Tracks venue booking requests and confirmations from marketplace
-- Created during Event Wizard Stage 3: Venue Selection
create table public.venue_bookings (
  id uuid primary key default uuid_generate_v4(),

  -- Event relationship
  event_id uuid not null references public.events(id) on delete cascade,

  -- Venue relationship
  venue_id uuid not null references public.venues(id) on delete restrict,

  -- Event date for booking
  event_date date not null,
  event_date_range daterange, -- For multi-day events

  -- Booking details
  attendee_count integer not null check (attendee_count > 0),
  event_type text, -- Copy from events table for reference

  -- Requestor information (before auth)
  requested_by text not null, -- Email address
  requestor_name text,
  requestor_company text,
  requestor_phone text,

  -- Booking source
  booking_source text default 'manual' not null check (booking_source in (
    'wizard',        -- Created via Event Wizard
    'manual',        -- Manual booking
    'api',           -- API booking
    'import'         -- Imported from external system
  )),

  -- Booking status
  status text default 'pending' not null check (status in (
    'pending',       -- Waiting for venue owner review
    'confirmed',     -- Booking confirmed by venue
    'rejected',      -- Booking rejected by venue
    'cancelled',     -- Cancelled by organizer
    'completed'      -- Event completed
  )),

  -- Pricing (optional - for marketplace venues)
  quoted_price numeric(10,2),
  final_price numeric(10,2),
  currency text default 'USD',

  -- Communication
  notes text,
  rejection_reason text,
  special_requests text,

  -- Response tracking
  responded_at timestamptz,
  responded_by uuid references auth.users(id) on delete set null,

  -- Payment tracking (optional)
  payment_status text default 'unpaid' check (payment_status in ('unpaid', 'deposit_paid', 'paid', 'refunded')),
  payment_due_date date,

  -- Metadata
  metadata jsonb default '{}'::jsonb,
  -- {
  --   "wizard_session_id": "uuid",
  --   "event_type": "conference",
  --   "amenities_requested": ["projector", "wifi", "catering"]
  -- }

  -- Timestamps
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  confirmed_at timestamptz,
  cancelled_at timestamptz
);

-- Add comments for documentation
comment on table public.venue_bookings is 'Venue booking requests and confirmations for marketplace venues';
comment on column public.venue_bookings.event_date is 'Single date for booking';
comment on column public.venue_bookings.event_date_range is 'Date range for multi-day events (optional)';
comment on column public.venue_bookings.requested_by is 'Email address of organizer (may not have account yet)';
comment on column public.venue_bookings.booking_source is 'Source of booking: wizard, manual, api, import';
comment on column public.venue_bookings.status is 'Booking status: pending, confirmed, rejected, cancelled, completed';

-- Create indexes for performance
create index idx_venue_bookings_event_id on public.venue_bookings(event_id);
create index idx_venue_bookings_venue_id on public.venue_bookings(venue_id);
create index idx_venue_bookings_status on public.venue_bookings(status);
create index idx_venue_bookings_event_date on public.venue_bookings(event_date);
create index idx_venue_bookings_requested_by on public.venue_bookings(requested_by);
create index idx_venue_bookings_booking_source on public.venue_bookings(booking_source);
create index idx_venue_bookings_created_at on public.venue_bookings(created_at desc);

-- GIN index for JSONB metadata
create index idx_venue_bookings_metadata on public.venue_bookings using gin(metadata);

-- Index for availability checking (date range overlap)
create index idx_venue_bookings_venue_date_range on public.venue_bookings(venue_id, event_date_range)
  where status = 'confirmed';

-- Enable Row Level Security
alter table public.venue_bookings enable row level security;

-- RLS Policy: Event organizers can view bookings for their events
create policy "organizers can view bookings for their events"
  on public.venue_bookings
  for select
  to authenticated
  using (
    exists (
      select 1 from public.events
      where events.id = venue_bookings.event_id
      and events.organizer_id = auth.uid()
    )
  );

-- RLS Policy: Venue owners can view bookings for their venues
-- NOTE: Requires venue ownership tracking (venue.owner_id field)
-- create policy "venue owners can view bookings for their venues"
--   on public.venue_bookings
--   for select
--   to authenticated
--   using (
--     exists (
--       select 1 from public.venues
--       where venues.id = venue_bookings.venue_id
--       and venues.owner_id = auth.uid()
--     )
--   );

-- RLS Policy: Event organizers can create bookings
create policy "organizers can create bookings for their events"
  on public.venue_bookings
  for insert
  to authenticated
  with check (
    auth.uid() is not null
    and exists (
      select 1 from public.events
      where events.id = venue_bookings.event_id
      and events.organizer_id = auth.uid()
    )
  );

-- RLS Policy: Anonymous can create bookings (wizard before auth)
create policy "anonymous can create bookings via wizard"
  on public.venue_bookings
  for insert
  to anon
  with check (
    booking_source = 'wizard'
    and requested_by is not null
  );

-- RLS Policy: Event organizers can update their bookings
create policy "organizers can update their bookings"
  on public.venue_bookings
  for update
  to authenticated
  using (
    exists (
      select 1 from public.events
      where events.id = venue_bookings.event_id
      and events.organizer_id = auth.uid()
    )
  );

-- RLS Policy: Venue owners can update booking status
-- create policy "venue owners can update booking status"
--   on public.venue_bookings
--   for update
--   to authenticated
--   using (
--     exists (
--       select 1 from public.venues
--       where venues.id = venue_bookings.venue_id
--       and venues.owner_id = auth.uid()
--     )
--   );

-- =============================================================================
-- FUNCTIONS
-- =============================================================================

-- Function: Check venue availability for a date/date range
create or replace function public.check_venue_availability(
  p_venue_id uuid,
  p_event_date date,
  p_event_date_range daterange default null
)
returns boolean
language plpgsql
security definer
as $$
declare
  conflict_count integer;
begin
  -- Check for conflicts with confirmed bookings
  if p_event_date_range is not null then
    -- Multi-day event: check date range overlap
    select count(*) into conflict_count
    from public.venue_bookings
    where venue_id = p_venue_id
    and status = 'confirmed'
    and event_date_range && p_event_date_range; -- Overlaps operator
  else
    -- Single day event: check exact date
    select count(*) into conflict_count
    from public.venue_bookings
    where venue_id = p_venue_id
    and status = 'confirmed'
    and event_date = p_event_date;
  end if;

  -- Return true if no conflicts (available)
  return conflict_count = 0;
end;
$$;

comment on function public.check_venue_availability is 'Checks if venue is available for specified date or date range';

-- Function: Auto-update updated_at timestamp
create or replace function public.update_venue_booking_updated_at()
returns trigger
language plpgsql
security definer
as $$
begin
  new.updated_at = now();

  -- Update confirmed_at when status changes to confirmed
  if old.status != 'confirmed' and new.status = 'confirmed' then
    new.confirmed_at = now();
    new.responded_at = coalesce(new.responded_at, now());
  end if;

  -- Update cancelled_at when status changes to cancelled
  if old.status != 'cancelled' and new.status = 'cancelled' then
    new.cancelled_at = now();
  end if;

  return new;
end;
$$;

comment on function public.update_venue_booking_updated_at() is 'Auto-updates timestamps on venue booking changes';

-- Trigger: Auto-update timestamps
create trigger set_venue_booking_updated_at
  before update on public.venue_bookings
  for each row
  execute function public.update_venue_booking_updated_at();

-- Function: Link venue to event when booking is confirmed
create or replace function public.link_venue_on_booking_confirmed()
returns trigger
language plpgsql
security definer
as $$
begin
  -- When booking is confirmed, update event.venue_id
  if old.status != 'confirmed' and new.status = 'confirmed' then
    update public.events
    set venue_id = new.venue_id,
        updated_at = now()
    where id = new.event_id
    and venue_id is null; -- Only update if not already set
  end if;

  return new;
end;
$$;

comment on function public.link_venue_on_booking_confirmed() is 'Automatically links venue to event when booking is confirmed';

-- Trigger: Auto-link venue to event
create trigger link_venue_on_booking_confirmed_trigger
  after update on public.venue_bookings
  for each row
  execute function public.link_venue_on_booking_confirmed();

-- =============================================================================
-- GRANT PERMISSIONS
-- =============================================================================

grant usage on schema public to anon, authenticated;
grant select, insert on public.venue_bookings to anon;
grant select, insert, update on public.venue_bookings to authenticated;

-- Grant execute on availability function
grant execute on function public.check_venue_availability to anon, authenticated;

-- =============================================================================
-- SAMPLE DATA (optional - remove in production)
-- =============================================================================

-- insert into public.venue_bookings (
--   event_id,
--   venue_id,
--   event_date,
--   attendee_count,
--   event_type,
--   requested_by,
--   requestor_name,
--   booking_source,
--   status
-- )
-- select
--   events.id,
--   venues.id,
--   events.start_at::date,
--   events.capacity,
--   events.type,
--   'sarah.johnson@techcorp.com',
--   'Sarah Johnson',
--   'wizard',
--   'pending'
-- from public.events
-- cross join public.venues
-- where events.slug = 'ai-summit-2025'
-- and venues.name = 'TechHub Convention Center'
-- limit 1;
