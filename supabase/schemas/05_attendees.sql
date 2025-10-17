-- attendees table: people attending events (may differ from order customer)

create table public.attendees (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete restrict,
  event_id uuid not null references public.events(id) on delete restrict,
  full_name text not null,
  email text not null,
  phone text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

comment on table public.attendees is 'Event attendee information collected during ticket purchase for check-in and communications.';

-- indexes
create index idx_attendees_order_id on public.attendees(order_id);
create index idx_attendees_event_id on public.attendees(event_id);
create index idx_attendees_email on public.attendees(email);
