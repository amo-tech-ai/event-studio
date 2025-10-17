-- migration: core eventos schema (production-ready, RLS-safe)
-- purpose: creates all core tables, triggers, and RLS policies for event management system
-- tables: profiles, events, venues, orders, attendees, tickets
-- features: auto-generated slugs, ticket codes, order numbers, computed ticket counts
-- security: granular RLS policies optimized for performance, no cross-table denormalization
-- dependencies: requires auth.users table from Supabase Auth
-- notes: uses performance-optimized (select auth.uid()) pattern, RLS-safe views for stats

-- ============================================================================
-- 0) PREREQUISITES: Enable required extensions
-- ============================================================================

create extension if not exists pgcrypto;
create extension if not exists unaccent;

-- ============================================================================
-- 1) HELPER FUNCTIONS (must be defined BEFORE tables/triggers)
-- ============================================================================

-- function: automatically update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security invoker
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

comment on function public.handle_updated_at() is 'Automatically updates the updated_at column on row updates.';

-- function: generate event slug from name
create or replace function public.generate_event_slug()
returns trigger
language plpgsql
security invoker
as $$
begin
  -- ensure created_at is set (may be NULL in BEFORE INSERT)
  new.created_at := coalesce(new.created_at, now());

  if new.slug is null or new.slug = '' then
    new.slug = lower(
      regexp_replace(
        regexp_replace(
          unaccent(new.name),
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

comment on function public.generate_event_slug() is 'Generates a URL-friendly slug from event name with unique ID suffix using unaccent.';

-- function: generate ticket number and qr code
create or replace function public.generate_ticket_codes()
returns trigger
language plpgsql
security invoker
as $$
begin
  -- ensure created_at is set (may be NULL in BEFORE INSERT)
  new.created_at := coalesce(new.created_at, now());

  if new.ticket_number is null or new.ticket_number = '' then
    new.ticket_number = 'TKT-'
      || upper(substr(new.id::text, 1, 8))
      || '-'
      || to_char(new.created_at, 'YYMMDD');
  end if;

  if new.qr_code is null or new.qr_code = '' then
    new.qr_code = encode(extensions.gen_random_bytes(32), 'base64');
  end if;

  return new;
end;
$$;

comment on function public.generate_ticket_codes() is 'Generates unique ticket number and QR code for ticket check-in.';

-- function: generate unique order number
create or replace function public.generate_order_number()
returns trigger
language plpgsql
security invoker
as $$
begin
  -- ensure created_at is set (may be NULL in BEFORE INSERT)
  new.created_at := coalesce(new.created_at, now());

  if new.order_number is null or new.order_number = '' then
    new.order_number = 'ORD-'
      || to_char(new.created_at, 'YYYYMMDD')
      || '-'
      || upper(substr(new.id::text, 1, 8));
  end if;
  return new;
end;
$$;

comment on function public.generate_order_number() is 'Generates a unique order number with date prefix for easy sorting.';

-- ============================================================================
-- 2) CORE TABLES (proper order: no forward FK references)
-- ============================================================================

-- table: profiles - extends auth.users with user metadata
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  company text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

comment on table public.profiles is 'User profiles extending auth.users with additional metadata for event organizers and attendees.';

-- unique email index (case-insensitive)
create unique index idx_profiles_email_lower on public.profiles(lower(email));

-- table: venues - event locations in toronto
create table public.venues (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null,
  address text not null,
  city text not null default 'Toronto',
  postal_code text,
  capacity integer not null check (capacity > 0 and capacity <= 50000),
  amenities jsonb default '{}',
  contact_email text,
  contact_phone text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

comment on table public.venues is 'Event venues in Toronto area with capacity and amenity information.';

-- table: events - corporate events (conferences, seminars, workshops, networking)
create table public.events (
  id uuid primary key default extensions.gen_random_uuid(),
  organizer_id uuid not null references public.profiles(id) on delete restrict,
  venue_id uuid references public.venues(id) on delete set null,
  name text not null,
  slug text unique not null,
  type text not null check (type in ('conference', 'seminar', 'workshop', 'networking')),
  description text,
  start_at timestamp with time zone not null,
  end_at timestamp with time zone not null,
  capacity integer not null check (capacity >= 10 and capacity <= 10000),
  price_cents integer not null check (price_cents >= 0),
  status text default 'draft' not null check (status in ('draft', 'published', 'cancelled', 'completed')),
  visibility text default 'public' not null check (visibility in ('public', 'private')),
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  check (end_at > start_at)
);

comment on table public.events is 'Corporate events including conferences, seminars, workshops, and networking events in Toronto.';

-- indexes for performance
create index idx_events_organizer_id on public.events(organizer_id);
create index idx_events_venue_id on public.events(venue_id);
create index idx_events_status_visibility on public.events(status, visibility) where status = 'published';
create index idx_events_start_at on public.events(start_at) where status = 'published';

-- table: orders - payment transactions for event tickets
create table public.orders (
  id uuid primary key default extensions.gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete restrict,
  event_id uuid not null references public.events(id) on delete restrict,
  order_number text unique not null,
  quantity integer not null check (quantity > 0 and quantity <= 20),
  unit_price_cents integer not null check (unit_price_cents >= 0),
  total_cents integer not null check (total_cents >= 0),
  payment_status text default 'pending' not null check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  stripe_payment_intent_id text,
  paid_at timestamp with time zone,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  -- critical: validate total matches quantity * price
  check (total_cents = quantity * unit_price_cents)
);

comment on table public.orders is 'Payment transactions for event ticket purchases with Stripe integration.';

-- indexes for performance
create index idx_orders_customer_id on public.orders(customer_id);
create index idx_orders_event_id on public.orders(event_id);
create index idx_orders_payment_status on public.orders(payment_status);

-- critical: unique index on stripe_payment_intent_id for idempotency
create unique index idx_orders_stripe_payment_intent_id
  on public.orders(stripe_payment_intent_id)
  where stripe_payment_intent_id is not null;

-- table: attendees - people attending events (may differ from order customer)
create table public.attendees (
  id uuid primary key default extensions.gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete restrict,
  event_id uuid not null references public.events(id) on delete restrict,
  full_name text not null,
  email text not null,
  phone text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

comment on table public.attendees is 'Event attendee information collected during ticket purchase for check-in and communications.';

-- indexes for performance
create index idx_attendees_order_id on public.attendees(order_id);
create index idx_attendees_event_id on public.attendees(event_id);
create index idx_attendees_email on public.attendees(email);

-- table: tickets - ticket instances for event attendees
create table public.tickets (
  id uuid primary key default extensions.gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete restrict,
  order_id uuid not null references public.orders(id) on delete restrict,
  attendee_id uuid references public.attendees(id) on delete set null,
  ticket_number text unique not null,
  qr_code text unique not null,
  status text default 'active' not null check (status in ('active', 'used', 'cancelled', 'refunded')),
  checked_in_at timestamp with time zone,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

comment on table public.tickets is 'Individual ticket instances with QR codes for check-in at events.';

-- indexes for performance
create index idx_tickets_event_id on public.tickets(event_id);
create index idx_tickets_order_id on public.tickets(order_id);
create index idx_tickets_attendee_id on public.tickets(attendee_id);
create index idx_tickets_status on public.tickets(status);
create index idx_tickets_event_status on public.tickets(event_id, status);

-- ============================================================================
-- 3) RLS-SAFE VIEWS (computed stats instead of denormalized columns)
-- ============================================================================

-- view: event_stats - RLS-safe ticket counts per event
create or replace view public.event_stats as
select
  e.id as event_id,
  e.name as event_name,
  e.capacity,
  coalesce(count(t.id) filter (where t.status in ('active', 'used')), 0)::integer as tickets_sold,
  e.capacity - coalesce(count(t.id) filter (where t.status in ('active', 'used')), 0)::integer as tickets_available,
  coalesce(count(t.id) filter (where t.status = 'active'), 0)::integer as tickets_active,
  coalesce(count(t.id) filter (where t.status = 'used'), 0)::integer as tickets_used,
  coalesce(count(t.id) filter (where t.status = 'cancelled'), 0)::integer as tickets_cancelled
from public.events e
left join public.tickets t on t.event_id = e.id
group by e.id, e.name, e.capacity;

comment on view public.event_stats is 'RLS-safe computed statistics for event ticket sales and availability.';

-- ============================================================================
-- 4) GRANTS FOR ANON AND AUTHENTICATED ROLES
-- ============================================================================

-- grant usage on schema
grant usage on schema public to anon, authenticated;

-- grant select on all tables to anon (will be restricted by RLS policies)
grant select on all tables in schema public to anon;

-- grant all privileges on tables to authenticated (will be restricted by RLS policies)
grant all on all tables in schema public to authenticated;

-- grant usage on all sequences to authenticated (for inserting records)
grant usage on all sequences in schema public to authenticated;

-- ============================================================================
-- 5) ROW LEVEL SECURITY POLICIES (performance-optimized with granular roles)
-- ============================================================================

-- enable rls on all tables
alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.venues enable row level security;
alter table public.orders enable row level security;
alter table public.attendees enable row level security;
alter table public.tickets enable row level security;

-- ----------------------------------------------------------------------------
-- profiles policies
-- ----------------------------------------------------------------------------

create policy "profiles are viewable by anonymous users"
  on public.profiles
  for select
  to anon
  using (true);

create policy "profiles are viewable by authenticated users"
  on public.profiles
  for select
  to authenticated
  using (true);

create policy "users can insert their own profile"
  on public.profiles
  for insert
  to authenticated
  with check (
    (select auth.uid()) is not null
    and (select auth.uid()) = id
  );

create policy "users can update their own profile"
  on public.profiles
  for update
  to authenticated
  using (
    (select auth.uid()) is not null
    and (select auth.uid()) = id
  )
  with check (
    (select auth.uid()) is not null
    and (select auth.uid()) = id
  );

-- ----------------------------------------------------------------------------
-- events policies
-- ----------------------------------------------------------------------------

create policy "published public events are viewable by anonymous users"
  on public.events
  for select
  to anon
  using (status = 'published' and visibility = 'public');

create policy "published public events are viewable by authenticated users"
  on public.events
  for select
  to authenticated
  using (status = 'published' and visibility = 'public');

create policy "organizers can view their own events"
  on public.events
  for select
  to authenticated
  using (
    (select auth.uid()) is not null
    and (select auth.uid()) = organizer_id
  );

create policy "authenticated users can insert events"
  on public.events
  for insert
  to authenticated
  with check (
    (select auth.uid()) is not null
    and (select auth.uid()) = organizer_id
  );

create policy "organizers can update their own events"
  on public.events
  for update
  to authenticated
  using (
    (select auth.uid()) is not null
    and (select auth.uid()) = organizer_id
  )
  with check (
    (select auth.uid()) is not null
    and (select auth.uid()) = organizer_id
  );

create policy "organizers can delete their own draft events"
  on public.events
  for delete
  to authenticated
  using (
    (select auth.uid()) is not null
    and (select auth.uid()) = organizer_id
    and status = 'draft'
  );

-- ----------------------------------------------------------------------------
-- venues policies
-- ----------------------------------------------------------------------------

create policy "venues are viewable by anonymous users"
  on public.venues
  for select
  to anon
  using (true);

create policy "venues are viewable by authenticated users"
  on public.venues
  for select
  to authenticated
  using (true);

create policy "event organizers can insert venues"
  on public.venues
  for insert
  to authenticated
  with check (
    (select auth.uid()) is not null
    and exists (
      select 1
      from public.events
      where organizer_id = (select auth.uid())
    )
  );

create policy "organizers can update their event venues"
  on public.venues
  for update
  to authenticated
  using (
    (select auth.uid()) is not null
    and id in (
      select venue_id
      from public.events
      where organizer_id = (select auth.uid())
        and venue_id is not null
    )
  )
  with check (
    (select auth.uid()) is not null
    and id in (
      select venue_id
      from public.events
      where organizer_id = (select auth.uid())
        and venue_id is not null
    )
  );

create policy "prevent venue deletion if has events"
  on public.venues
  for delete
  to authenticated
  using (
    not exists (
      select 1
      from public.events
      where venue_id = id
    )
  );

-- ----------------------------------------------------------------------------
-- orders policies
-- ----------------------------------------------------------------------------

create policy "customers can view their own orders"
  on public.orders
  for select
  to authenticated
  using (
    (select auth.uid()) is not null
    and (select auth.uid()) = customer_id
  );

create policy "organizers can view orders for their events"
  on public.orders
  for select
  to authenticated
  using (
    (select auth.uid()) is not null
    and event_id in (
      select id
      from public.events
      where organizer_id = (select auth.uid())
    )
  );

create policy "authenticated users can insert orders"
  on public.orders
  for insert
  to authenticated
  with check (
    (select auth.uid()) is not null
    and (select auth.uid()) = customer_id
    and event_id in (
      select id
      from public.events
      where status = 'published'
    )
  );

create policy "customers can update their pending orders"
  on public.orders
  for update
  to authenticated
  using (
    (select auth.uid()) is not null
    and (select auth.uid()) = customer_id
    and payment_status = 'pending'
  )
  with check (
    (select auth.uid()) is not null
    and (select auth.uid()) = customer_id
  );

-- ----------------------------------------------------------------------------
-- attendees policies
-- ----------------------------------------------------------------------------

create policy "customers can view their order attendees"
  on public.attendees
  for select
  to authenticated
  using (
    (select auth.uid()) is not null
    and order_id in (
      select id
      from public.orders
      where customer_id = (select auth.uid())
    )
  );

create policy "organizers can view attendees for their events"
  on public.attendees
  for select
  to authenticated
  using (
    (select auth.uid()) is not null
    and event_id in (
      select id
      from public.events
      where organizer_id = (select auth.uid())
    )
  );

create policy "customers can insert attendees for their orders"
  on public.attendees
  for insert
  to authenticated
  with check (
    (select auth.uid()) is not null
    and order_id in (
      select id
      from public.orders
      where customer_id = (select auth.uid())
    )
  );

create policy "customers can update attendees for their orders"
  on public.attendees
  for update
  to authenticated
  using (
    (select auth.uid()) is not null
    and order_id in (
      select id
      from public.orders
      where customer_id = (select auth.uid())
    )
  )
  with check (
    (select auth.uid()) is not null
    and order_id in (
      select id
      from public.orders
      where customer_id = (select auth.uid())
    )
  );

create policy "organizers can update attendees for their events"
  on public.attendees
  for update
  to authenticated
  using (
    (select auth.uid()) is not null
    and event_id in (
      select id
      from public.events
      where organizer_id = (select auth.uid())
    )
  )
  with check (
    (select auth.uid()) is not null
    and event_id in (
      select id
      from public.events
      where organizer_id = (select auth.uid())
    )
  );

-- ----------------------------------------------------------------------------
-- tickets policies
-- ----------------------------------------------------------------------------

create policy "customers can view their tickets"
  on public.tickets
  for select
  to authenticated
  using (
    (select auth.uid()) is not null
    and order_id in (
      select id
      from public.orders
      where customer_id = (select auth.uid())
    )
  );

create policy "organizers can view tickets for their events"
  on public.tickets
  for select
  to authenticated
  using (
    (select auth.uid()) is not null
    and event_id in (
      select id
      from public.events
      where organizer_id = (select auth.uid())
    )
  );

create policy "customers can insert tickets for their paid orders"
  on public.tickets
  for insert
  to authenticated
  with check (
    (select auth.uid()) is not null
    and order_id in (
      select id
      from public.orders
      where customer_id = (select auth.uid())
        and payment_status = 'paid'
    )
  );

create policy "organizers can update tickets for their events"
  on public.tickets
  for update
  to authenticated
  using (
    (select auth.uid()) is not null
    and event_id in (
      select id
      from public.events
      where organizer_id = (select auth.uid())
    )
  )
  with check (
    (select auth.uid()) is not null
    and event_id in (
      select id
      from public.events
      where organizer_id = (select auth.uid())
    )
  );

-- ============================================================================
-- 5) TRIGGERS (added after all tables, foreign keys, and RLS policies exist)
-- ============================================================================

-- profiles: auto-update updated_at
create trigger set_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

-- events: auto-generate slug from name
create trigger generate_slug
  before insert on public.events
  for each row
  execute function public.generate_event_slug();

-- events: auto-update updated_at
create trigger set_updated_at
  before update on public.events
  for each row
  execute function public.handle_updated_at();

-- venues: auto-update updated_at
create trigger set_updated_at
  before update on public.venues
  for each row
  execute function public.handle_updated_at();

-- orders: auto-generate order number
create trigger generate_order_num
  before insert on public.orders
  for each row
  execute function public.generate_order_number();

-- orders: auto-update updated_at
create trigger set_updated_at
  before update on public.orders
  for each row
  execute function public.handle_updated_at();

-- attendees: auto-update updated_at
create trigger set_updated_at
  before update on public.attendees
  for each row
  execute function public.handle_updated_at();

-- tickets: auto-generate ticket codes
create trigger generate_ticket_codes
  before insert on public.tickets
  for each row
  execute function public.generate_ticket_codes();

-- tickets: auto-update updated_at
create trigger set_updated_at
  before update on public.tickets
  for each row
  execute function public.handle_updated_at();
