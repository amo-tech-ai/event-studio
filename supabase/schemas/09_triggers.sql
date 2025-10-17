-- triggers (added after all tables, foreign keys, and RLS policies exist)

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

-- tickets: maintain tickets_sold counter
create trigger maintain_tickets_sold_insert
  after insert on public.tickets
  for each row
  execute function public.update_tickets_sold();

create trigger maintain_tickets_sold_delete
  after delete on public.tickets
  for each row
  execute function public.update_tickets_sold();

-- tickets: auto-update updated_at
create trigger set_updated_at
  before update on public.tickets
  for each row
  execute function public.handle_updated_at();
