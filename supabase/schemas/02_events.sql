-- events table: corporate events (conferences, seminars, workshops, networking)

create table public.events (
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid not null references public.profiles(id) on delete restrict,
  venue_id uuid,
  name text not null,
  slug text unique not null,
  type text not null check (type in ('conference', 'seminar', 'workshop', 'networking')),
  description text,
  start_at timestamp with time zone not null,
  end_at timestamp with time zone not null,
  capacity integer not null check (capacity >= 10 and capacity <= 10000),
  tickets_sold integer default 0 not null check (tickets_sold >= 0),
  price_cents integer not null check (price_cents >= 0),
  status text default 'draft' not null check (status in ('draft', 'published', 'cancelled', 'completed')),
  visibility text default 'public' not null check (visibility in ('public', 'private')),
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  check (end_at > start_at),
  check (tickets_sold <= capacity)
);

comment on table public.events is 'Corporate events including conferences, seminars, workshops, and networking events in Toronto.';

-- indexes
create index idx_events_organizer_id on public.events(organizer_id);
create index idx_events_venue_id on public.events(venue_id);
create index idx_events_status_visibility on public.events(status, visibility) where status = 'published';
create index idx_events_start_at on public.events(start_at) where status = 'published';
