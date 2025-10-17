-- venues table: event locations in toronto

create table public.venues (
  id uuid primary key default gen_random_uuid(),
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
