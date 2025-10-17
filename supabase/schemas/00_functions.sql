-- helper functions for triggers and automation

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
  if new.slug is null or new.slug = '' then
    new.slug = lower(
      regexp_replace(
        regexp_replace(new.name, '[^a-zA-Z0-9]+', '-', 'g'),
        '^-+|-+$',
        '',
        'g'
      )
    ) || '-' || substr(new.id::text, 1, 8);
  end if;
  return new;
end;
$$;

comment on function public.generate_event_slug() is 'Generates a URL-friendly slug from event name with unique ID suffix.';

-- function: generate ticket number and qr code
create or replace function public.generate_ticket_codes()
returns trigger
language plpgsql
security invoker
as $$
begin
  if new.ticket_number is null or new.ticket_number = '' then
    new.ticket_number = 'TKT-'
      || upper(substr(new.id::text, 1, 8))
      || '-'
      || to_char(new.created_at, 'YYMMDD');
  end if;

  if new.qr_code is null or new.qr_code = '' then
    new.qr_code = encode(gen_random_bytes(32), 'base64');
  end if;

  return new;
end;
$$;

comment on function public.generate_ticket_codes() is 'Generates unique ticket number and QR code for ticket check-in.';

-- function: maintain tickets_sold counter on events table
create or replace function public.update_tickets_sold()
returns trigger
language plpgsql
security invoker
as $$
begin
  if tg_op = 'INSERT' then
    update public.events
    set tickets_sold = tickets_sold + 1
    where id = new.event_id;
  elsif tg_op = 'DELETE' then
    update public.events
    set tickets_sold = greatest(0, tickets_sold - 1)
    where id = old.event_id;
  end if;
  return null;
end;
$$;

comment on function public.update_tickets_sold() is 'Maintains the denormalized tickets_sold counter on events table.';

-- function: generate unique order number
create or replace function public.generate_order_number()
returns trigger
language plpgsql
security invoker
as $$
begin
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
