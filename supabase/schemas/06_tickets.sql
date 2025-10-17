-- tickets table: ticket instances for event attendees

create table public.tickets (
  id uuid primary key default gen_random_uuid(),
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

-- indexes
create index idx_tickets_event_id on public.tickets(event_id);
create index idx_tickets_order_id on public.tickets(order_id);
create index idx_tickets_attendee_id on public.tickets(attendee_id);
create index idx_tickets_status on public.tickets(status);
