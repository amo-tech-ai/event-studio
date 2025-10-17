-- orders table: payment transactions for event tickets

create table public.orders (
  id uuid primary key default gen_random_uuid(),
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
  updated_at timestamp with time zone default now() not null
);

comment on table public.orders is 'Payment transactions for event ticket purchases with Stripe integration.';

-- indexes
create index idx_orders_customer_id on public.orders(customer_id);
create index idx_orders_event_id on public.orders(event_id);
create index idx_orders_payment_status on public.orders(payment_status);

-- critical: unique index on stripe_payment_intent_id for idempotency
create unique index idx_orders_stripe_payment_intent_id
  on public.orders(stripe_payment_intent_id)
  where stripe_payment_intent_id is not null;
