-- foreign key constraints (added after all tables exist)

-- events.venue_id references venues
alter table public.events
  add constraint events_venue_id_fkey
  foreign key (venue_id)
  references public.venues(id)
  on delete set null;
