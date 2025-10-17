-- row level security policies (added after all tables and foreign keys exist)

-- enable rls on all tables
alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.venues enable row level security;
alter table public.orders enable row level security;
alter table public.attendees enable row level security;
alter table public.tickets enable row level security;

-- profiles policies
create policy "profiles are viewable by everyone"
  on public.profiles
  for select
  to anon, authenticated
  using (true);

create policy "users can insert their own profile"
  on public.profiles
  for insert
  to authenticated
  with check (
    auth.uid() is not null
    and auth.uid() = id
  );

create policy "users can update their own profile"
  on public.profiles
  for update
  to authenticated
  using (
    auth.uid() is not null
    and auth.uid() = id
  )
  with check (
    auth.uid() is not null
    and auth.uid() = id
  );

-- events policies
create policy "published public events are viewable by everyone"
  on public.events
  for select
  to anon, authenticated
  using (status = 'published' and visibility = 'public');

create policy "organizers can view their own events"
  on public.events
  for select
  to authenticated
  using (
    auth.uid() is not null
    and auth.uid() = organizer_id
  );

create policy "authenticated users can insert events"
  on public.events
  for insert
  to authenticated
  with check (
    auth.uid() is not null
    and auth.uid() = organizer_id
  );

create policy "organizers can update their own events"
  on public.events
  for update
  to authenticated
  using (
    auth.uid() is not null
    and auth.uid() = organizer_id
  )
  with check (
    auth.uid() is not null
    and auth.uid() = organizer_id
  );

create policy "organizers can delete their own draft events"
  on public.events
  for delete
  to authenticated
  using (
    auth.uid() is not null
    and auth.uid() = organizer_id
    and status = 'draft'
  );

-- venues policies
create policy "venues are viewable by everyone"
  on public.venues
  for select
  to anon, authenticated
  using (true);

create policy "organizers can insert venues"
  on public.venues
  for insert
  to authenticated
  with check (
    auth.uid() is not null
    and exists (
      select 1
      from public.events
      where organizer_id = auth.uid()
    )
  );

create policy "organizers can update their event venues"
  on public.venues
  for update
  to authenticated
  using (
    auth.uid() is not null
    and id in (
      select venue_id
      from public.events
      where organizer_id = auth.uid()
        and venue_id is not null
    )
  )
  with check (
    auth.uid() is not null
    and id in (
      select venue_id
      from public.events
      where organizer_id = auth.uid()
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

-- orders policies
create policy "customers can view their own orders"
  on public.orders
  for select
  to authenticated
  using (
    auth.uid() is not null
    and auth.uid() = customer_id
  );

create policy "organizers can view orders for their events"
  on public.orders
  for select
  to authenticated
  using (
    auth.uid() is not null
    and event_id in (
      select id from public.events
      where organizer_id = auth.uid()
    )
  );

create policy "authenticated users can insert orders"
  on public.orders
  for insert
  to authenticated
  with check (
    auth.uid() is not null
    and auth.uid() = customer_id
    and event_id in (
      select id from public.events
      where status = 'published'
    )
  );

create policy "customers can update their pending orders"
  on public.orders
  for update
  to authenticated
  using (
    auth.uid() is not null
    and auth.uid() = customer_id
    and payment_status = 'pending'
  )
  with check (
    auth.uid() is not null
    and auth.uid() = customer_id
  );

-- attendees policies
create policy "customers can view their order attendees"
  on public.attendees
  for select
  to authenticated
  using (
    auth.uid() is not null
    and order_id in (
      select id from public.orders
      where customer_id = auth.uid()
    )
  );

create policy "organizers can view attendees for their events"
  on public.attendees
  for select
  to authenticated
  using (
    auth.uid() is not null
    and event_id in (
      select id from public.events
      where organizer_id = auth.uid()
    )
  );

create policy "customers can insert attendees for their orders"
  on public.attendees
  for insert
  to authenticated
  with check (
    auth.uid() is not null
    and order_id in (
      select id from public.orders
      where customer_id = auth.uid()
    )
  );

create policy "customers and organizers can update attendees"
  on public.attendees
  for update
  to authenticated
  using (
    auth.uid() is not null
    and (
      order_id in (
        select id from public.orders
        where customer_id = auth.uid()
      )
      or event_id in (
        select id from public.events
        where organizer_id = auth.uid()
      )
    )
  )
  with check (
    auth.uid() is not null
    and (
      order_id in (
        select id from public.orders
        where customer_id = auth.uid()
      )
      or event_id in (
        select id from public.events
        where organizer_id = auth.uid()
      )
    )
  );

-- tickets policies
create policy "customers can view their tickets"
  on public.tickets
  for select
  to authenticated
  using (
    auth.uid() is not null
    and order_id in (
      select id from public.orders
      where customer_id = auth.uid()
    )
  );

create policy "organizers can view tickets for their events"
  on public.tickets
  for select
  to authenticated
  using (
    auth.uid() is not null
    and event_id in (
      select id from public.events
      where organizer_id = auth.uid()
    )
  );

create policy "customers can insert tickets for their paid orders"
  on public.tickets
  for insert
  to authenticated
  with check (
    auth.uid() is not null
    and order_id in (
      select id from public.orders
      where customer_id = auth.uid()
        and payment_status = 'paid'
    )
  );

create policy "organizers can update tickets for their events"
  on public.tickets
  for update
  to authenticated
  using (
    auth.uid() is not null
    and event_id in (
      select id from public.events
      where organizer_id = auth.uid()
    )
  )
  with check (
    auth.uid() is not null
    and event_id in (
      select id from public.events
      where organizer_id = auth.uid()
    )
  );
