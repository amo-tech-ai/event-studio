-- migration: operations tables for event planning and management
-- purpose: adds 7 tables for organizer profiles, payments, budgets, tasks, vendors, and event sessions
-- tables: organizers, payments, budgets, tasks, vendors, event_vendors, event_sessions
-- priority: HIGH - essential for full event operations management
-- reference: /home/sk/event-studio/supabase/plan/08-MVP-DATABASE.md

-- ============================================================================
-- 1) ORGANIZERS - Enhanced organizer profiles (extends profiles)
-- ============================================================================

create table public.organizers (
  id uuid primary key references public.profiles(id) on delete cascade,

  -- Business details
  organization_name varchar(255) not null,
  organization_type varchar(50) check (organization_type in (
    'INDIVIDUAL', 'COMPANY', 'NONPROFIT', 'GOVERNMENT', 'EDUCATION', 'OTHER'
  )),
  business_registration_number varchar(100),
  tax_id varchar(100),

  -- Verification
  is_verified boolean default false not null,
  verification_status varchar(50) default 'PENDING' check (verification_status in (
    'PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED'
  )),
  verified_at timestamptz,
  verified_by uuid references auth.users(id) on delete set null,

  -- Stripe integration
  stripe_account_id text unique,
  stripe_account_status varchar(50) check (stripe_account_status in (
    'NOT_CONNECTED', 'PENDING', 'ACTIVE', 'RESTRICTED', 'DISABLED'
  )),
  stripe_charges_enabled boolean default false,
  stripe_payouts_enabled boolean default false,

  -- Business information
  website_url text,
  description text,
  logo_url text,

  -- Contact details
  support_email varchar(255),
  support_phone varchar(50),

  -- Address
  business_address_line1 text,
  business_address_line2 text,
  business_city varchar(100),
  business_state varchar(100),
  business_postal_code varchar(20),
  business_country varchar(2) default 'US',

  -- Settings
  timezone varchar(50) default 'America/Toronto',
  currency varchar(3) default 'USD',

  -- Statistics
  total_events integer default 0,
  total_revenue decimal(14,2) default 0,
  total_tickets_sold integer default 0,

  -- Metadata
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.organizers is 'Enhanced organizer profiles with business details and Stripe integration';
comment on column public.organizers.stripe_account_id is 'Stripe Connect account ID for receiving payments';

-- Indexes
create index idx_organizers_stripe_account on public.organizers(stripe_account_id) where stripe_account_id is not null;
create index idx_organizers_verified on public.organizers(is_verified);

-- RLS Policies
alter table public.organizers enable row level security;

create policy "Organizers manage their own profile"
  on public.organizers
  for all
  using (id = (select auth.uid()));

create policy "Public can view verified organizers"
  on public.organizers
  for select
  using (is_verified = true);

-- Trigger for updated_at
create trigger update_organizers_updated_at
  before update on public.organizers
  for each row
  execute function public.handle_updated_at();

-- ============================================================================
-- 2) PAYMENTS - Payment tracking and reconciliation
-- ============================================================================

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  organizer_id uuid not null references public.organizers(id) on delete cascade,

  -- Payment details
  amount decimal(14,2) not null check (amount > 0),
  currency varchar(3) default 'USD' not null,

  -- Provider details
  payment_provider varchar(50) default 'STRIPE' not null,
  provider_payment_id text not null,
  provider_charge_id text,
  provider_transfer_id text,

  -- Status
  status varchar(50) default 'PENDING' not null check (status in (
    'PENDING', 'AUTHORIZED', 'CAPTURED', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED'
  )),

  -- Fees
  platform_fee_amount decimal(14,2) default 0 check (platform_fee_amount >= 0),
  payment_processing_fee decimal(14,2) default 0 check (payment_processing_fee >= 0),
  net_amount decimal(14,2) generated always as (amount - platform_fee_amount - payment_processing_fee) stored,

  -- Timing
  authorized_at timestamptz,
  captured_at timestamptz,
  completed_at timestamptz,
  failed_at timestamptz,

  -- Error handling
  failure_code varchar(100),
  failure_message text,

  -- Metadata
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.payments is 'Payment transaction tracking with provider integration and fee calculation';
comment on column public.payments.net_amount is 'Amount after platform and processing fees';

-- Indexes
create index idx_payments_order_id on public.payments(order_id);
create index idx_payments_organizer_id on public.payments(organizer_id);
create index idx_payments_status on public.payments(status);
create index idx_payments_provider_payment_id on public.payments(provider_payment_id);
create index idx_payments_created_at on public.payments(created_at desc);

-- RLS Policies
alter table public.payments enable row level security;

create policy "Organizers view their own payments"
  on public.payments
  for select
  using (organizer_id = (select auth.uid()));

-- Trigger for updated_at
create trigger update_payments_updated_at
  before update on public.payments
  for each row
  execute function public.handle_updated_at();

-- ============================================================================
-- 3) BUDGETS - Event budget line items
-- ============================================================================

create table public.budgets (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  organizer_id uuid not null references public.organizers(id) on delete cascade,

  -- Budget item details
  category varchar(100) not null check (category in (
    'VENUE', 'CATERING', 'MARKETING', 'EQUIPMENT', 'STAFFING', 'ENTERTAINMENT',
    'SUPPLIES', 'TECHNOLOGY', 'INSURANCE', 'TRANSPORTATION', 'OTHER'
  )),
  subcategory varchar(150),
  description text not null,

  -- Amounts
  estimated_amount decimal(14,2) not null check (estimated_amount >= 0),
  actual_amount decimal(14,2) default 0 check (actual_amount >= 0),
  variance decimal(14,2) generated always as (actual_amount - estimated_amount) stored,
  currency varchar(3) default 'USD',

  -- Status
  status varchar(50) default 'PLANNED' check (status in (
    'PLANNED', 'APPROVED', 'COMMITTED', 'PAID', 'CANCELLED'
  )),

  -- Vendor linkage (will be added later when vendors table exists)
  -- vendor_id uuid references public.vendors(id) on delete set null,

  -- Payment tracking
  payment_due_date date,
  paid_at timestamptz,

  -- Notes
  notes text,

  -- Metadata
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.budgets is 'Event budget line items for financial planning and tracking';
comment on column public.budgets.variance is 'Actual - Estimated (positive = over budget, negative = under budget)';

-- Indexes
create index idx_budgets_event_id on public.budgets(event_id);
create index idx_budgets_organizer_id on public.budgets(organizer_id);
create index idx_budgets_category on public.budgets(event_id, category);
-- create index idx_budgets_vendor_id on public.budgets(vendor_id) where vendor_id is not null;

-- RLS Policies
alter table public.budgets enable row level security;

create policy "Organizers manage their event budgets"
  on public.budgets
  for all
  using (organizer_id = (select auth.uid()));

-- Trigger for updated_at
create trigger update_budgets_updated_at
  before update on public.budgets
  for each row
  execute function public.handle_updated_at();

-- ============================================================================
-- 4) TASKS - Event planning tasks and checklist
-- ============================================================================

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  organizer_id uuid not null references public.organizers(id) on delete cascade,

  -- Task details
  title varchar(255) not null,
  description text,
  category varchar(100) check (category in (
    'PLANNING', 'VENUE', 'MARKETING', 'LOGISTICS', 'STAFFING', 'FOLLOW_UP', 'OTHER'
  )),

  -- Priority and status
  priority varchar(20) default 'MEDIUM' check (priority in ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
  status varchar(50) default 'TODO' check (status in (
    'TODO', 'IN_PROGRESS', 'BLOCKED', 'COMPLETED', 'CANCELLED'
  )),

  -- Assignment
  assigned_to uuid references auth.users(id) on delete set null,

  -- Timing
  due_date date,
  reminder_date date,
  completed_at timestamptz,

  -- Dependencies
  depends_on_task_ids uuid[] default array[]::uuid[],

  -- Metadata
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.tasks is 'Event planning tasks and checklists with dependencies';
comment on column public.tasks.depends_on_task_ids is 'Array of task IDs that must be completed first';

-- Indexes
create index idx_tasks_event_id on public.tasks(event_id);
create index idx_tasks_organizer_id on public.tasks(organizer_id);
create index idx_tasks_assigned_to on public.tasks(assigned_to) where assigned_to is not null;
create index idx_tasks_status on public.tasks(event_id, status);
create index idx_tasks_due_date on public.tasks(due_date) where status != 'COMPLETED';

-- RLS Policies
alter table public.tasks enable row level security;

create policy "Organizers manage their event tasks"
  on public.tasks
  for all
  using (organizer_id = (select auth.uid()));

-- Trigger for updated_at
create trigger update_tasks_updated_at
  before update on public.tasks
  for each row
  execute function public.handle_updated_at();

-- ============================================================================
-- 5) VENDORS - Service provider directory
-- ============================================================================

create table public.vendors (
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid not null references public.organizers(id) on delete cascade,

  -- Vendor details
  business_name varchar(255) not null,
  contact_name varchar(150),
  email varchar(255) not null,
  phone varchar(50),
  website_url text,

  -- Service information
  service_category varchar(100) not null check (service_category in (
    'CATERING', 'AV_EQUIPMENT', 'PHOTOGRAPHY', 'VIDEOGRAPHY', 'ENTERTAINMENT',
    'TRANSPORTATION', 'SECURITY', 'CLEANING', 'FLORIST', 'DECORATOR', 'OTHER'
  )),
  services_offered text[] default array[]::text[],
  description text,

  -- Location
  address_line1 text,
  city varchar(100),
  state_province varchar(100),
  postal_code varchar(20),
  country varchar(2) default 'US',

  -- Rating and reviews
  rating decimal(3,2) check (rating >= 0 and rating <= 5),
  total_reviews integer default 0,

  -- Business details
  business_registration varchar(100),
  insurance_verified boolean default false,

  -- Performance tracking
  total_events_serviced integer default 0,
  total_spent_with_vendor decimal(14,2) default 0,
  last_used_date date,

  -- Status
  is_preferred boolean default false,
  status varchar(50) default 'ACTIVE' check (status in ('ACTIVE', 'INACTIVE', 'BLACKLISTED')),

  -- Notes
  notes text,

  -- Metadata
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.vendors is 'Service provider directory for event planning';
comment on column public.vendors.is_preferred is 'Preferred vendor for this organizer';

-- Indexes
create index idx_vendors_organizer_id on public.vendors(organizer_id);
create index idx_vendors_service_category on public.vendors(service_category);
create index idx_vendors_status on public.vendors(organizer_id, status);
create index idx_vendors_preferred on public.vendors(organizer_id, is_preferred) where is_preferred = true;

-- RLS Policies
alter table public.vendors enable row level security;

create policy "Organizers manage their own vendors"
  on public.vendors
  for all
  using (organizer_id = (select auth.uid()));

-- Trigger for updated_at
create trigger update_vendors_updated_at
  before update on public.vendors
  for each row
  execute function public.handle_updated_at();

-- ============================================================================
-- 6) EVENT_VENDORS - Vendor assignments to specific events
-- ============================================================================

create table public.event_vendors (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  organizer_id uuid not null references public.organizers(id) on delete cascade,

  -- Contract details
  service_description text not null,
  contract_amount decimal(14,2) check (contract_amount >= 0),
  currency varchar(3) default 'USD',

  -- Status
  status varchar(50) default 'PROPOSED' check (status in (
    'PROPOSED', 'CONTRACTED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'
  )),

  -- Timing
  service_date date,
  start_time time,
  end_time time,

  -- Payment
  payment_status varchar(50) default 'UNPAID' check (payment_status in (
    'UNPAID', 'DEPOSIT_PAID', 'PAID', 'OVERDUE'
  )),
  payment_due_date date,
  paid_at timestamptz,

  -- Documents
  contract_url text,
  invoice_url text,

  -- Notes
  notes text,

  -- Metadata
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Constraints
  constraint unique_event_vendor unique (event_id, vendor_id)
);

comment on table public.event_vendors is 'Vendor assignments to specific events with contract tracking';

-- Indexes
create index idx_event_vendors_event_id on public.event_vendors(event_id);
create index idx_event_vendors_vendor_id on public.event_vendors(vendor_id);
create index idx_event_vendors_organizer_id on public.event_vendors(organizer_id);
create index idx_event_vendors_status on public.event_vendors(event_id, status);

-- RLS Policies
alter table public.event_vendors enable row level security;

create policy "Organizers manage their event vendors"
  on public.event_vendors
  for all
  using (organizer_id = (select auth.uid()));

-- Trigger for updated_at
create trigger update_event_vendors_updated_at
  before update on public.event_vendors
  for each row
  execute function public.handle_updated_at();

-- ============================================================================
-- 7) EVENT_SESSIONS - Individual sessions within multi-session events
-- ============================================================================

create table public.event_sessions (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,

  -- Session details
  name varchar(255) not null,
  description text,
  session_type varchar(50) check (session_type in (
    'KEYNOTE', 'PANEL', 'WORKSHOP', 'NETWORKING', 'BREAKOUT', 'GENERAL', 'OTHER'
  )),

  -- Timing
  start_time timestamptz not null,
  end_time timestamptz not null,
  duration_minutes integer generated always as (
    extract(epoch from (end_time - start_time)) / 60
  ) stored,

  -- Location
  room_name varchar(150),
  room_capacity integer check (room_capacity > 0),

  -- Speakers/hosts
  speakers jsonb default '[]'::jsonb,

  -- Capacity
  max_attendees integer check (max_attendees > 0),
  current_attendees integer default 0 check (current_attendees >= 0),

  -- Status
  status varchar(50) default 'SCHEDULED' check (status in (
    'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'
  )),

  -- Display
  display_order integer default 1,

  -- Metadata
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Constraints
  constraint valid_session_time check (start_time < end_time)
);

comment on table public.event_sessions is 'Individual sessions within multi-session events (conferences, workshops)';
comment on column public.event_sessions.speakers is 'JSONB array: [{name, title, bio, photo_url}]';

-- Indexes
create index idx_event_sessions_event_id on public.event_sessions(event_id);
create index idx_event_sessions_time on public.event_sessions(event_id, start_time);
create index idx_event_sessions_status on public.event_sessions(event_id, status);

-- RLS Policies
alter table public.event_sessions enable row level security;

create policy "Organizers manage their event sessions"
  on public.event_sessions
  for all
  using (
    event_id in (
      select id from public.events
      where organizer_id = (select auth.uid())
    )
  );

create policy "Public can view sessions for published events"
  on public.event_sessions
  for select
  using (
    event_id in (
      select id from public.events
      where status = 'published'
    )
  );

-- Trigger for updated_at
create trigger update_event_sessions_updated_at
  before update on public.event_sessions
  for each row
  execute function public.handle_updated_at();

-- ============================================================================
-- HELPER VIEWS FOR OPERATIONS
-- ============================================================================

-- View: Event budget summary
create or replace view public.event_budget_summary as
select
  event_id,
  organizer_id,
  sum(estimated_amount) as total_estimated,
  sum(actual_amount) as total_actual,
  sum(variance) as total_variance,
  count(*) as total_line_items,
  count(*) filter (where status = 'PAID') as paid_items,
  sum(actual_amount) filter (where status = 'PAID') as total_paid
from public.budgets
group by event_id, organizer_id;

comment on view public.event_budget_summary is 'Budget summary per event for financial tracking';

-- View: Event task progress
create or replace view public.event_task_progress as
select
  event_id,
  organizer_id,
  count(*) as total_tasks,
  count(*) filter (where status = 'COMPLETED') as completed_tasks,
  count(*) filter (where status = 'TODO') as pending_tasks,
  count(*) filter (where status = 'BLOCKED') as blocked_tasks,
  count(*) filter (where due_date < current_date and status != 'COMPLETED') as overdue_tasks,
  round(count(*) filter (where status = 'COMPLETED')::numeric / nullif(count(*), 0) * 100, 2) as completion_percentage
from public.tasks
group by event_id, organizer_id;

comment on view public.event_task_progress is 'Task completion progress per event';

-- ============================================================================
-- COMPLETION
-- ============================================================================

do $$
begin
  raise notice '✅ Operations tables migration completed successfully';
  raise notice '📊 Added 7 tables: organizers, payments, budgets, tasks, vendors, event_vendors, event_sessions';
  raise notice '📈 Added 2 analytics views for operations dashboards';
  raise notice '🎯 Full event operations management capability';
  raise notice '📈 Next: Apply all migrations to database';
end $$;
