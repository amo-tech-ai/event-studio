-- ============================================================================
-- EventOS Core Tables Schema
-- ============================================================================
-- Description: Schema for 8 core EventOS tables (budgets, companies, contacts,
--              event_settings, interactions, promo_codes, tasks, vendors)
-- Version: 1.0.0
-- Created: 2025-10-19
-- Dependencies: profiles, events, organizers, auth.users
-- ============================================================================

-- ============================================================================
-- FUNCTIONS (Idempotent)
-- ============================================================================

-- Function: handle_updated_at
-- Purpose: Automatically update updated_at timestamp on row modification
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

comment on function public.handle_updated_at() is 'Trigger function to automatically update updated_at timestamp';

-- Function: generate_company_slug
-- Purpose: Auto-generate URL-friendly slug from company name
create or replace function public.generate_company_slug()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.slug is null or new.slug = '' then
    new.slug := lower(regexp_replace(new.name, '[^a-zA-Z0-9]+', '-', 'g'));
    new.slug := regexp_replace(new.slug, '^-|-$', '', 'g');
  end if;
  return new;
end;
$$;

comment on function public.generate_company_slug() is 'Trigger function to generate URL-friendly slug from company name';

-- Function: update_last_interaction_timestamp
-- Purpose: Update last_interaction_at on related contact/company
create or replace function public.update_last_interaction_timestamp()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Update contact if present
  if new.contact_id is not null then
    update public.contacts
    set last_interaction_at = new.interaction_date
    where id = new.contact_id;
  end if;

  -- Update company if present
  if new.company_id is not null then
    update public.companies
    set last_interaction_at = new.interaction_date
    where id = new.company_id;
  end if;

  return new;
end;
$$;

comment on function public.update_last_interaction_timestamp() is 'Trigger function to update last_interaction_at on contacts/companies';

-- ============================================================================
-- TABLE: budgets
-- ============================================================================

create table if not exists public.budgets (
  id uuid not null default gen_random_uuid(),
  event_id uuid not null,
  organizer_id uuid not null,
  category character varying(100) not null,
  subcategory character varying(150) null,
  description text not null,
  estimated_amount numeric(14, 2) not null,
  actual_amount numeric(14, 2) null default 0,
  variance numeric(14, 2) generated always as ((actual_amount - estimated_amount)) stored,
  currency character varying(3) null default 'USD'::character varying,
  status character varying(50) null default 'PLANNED'::character varying,
  vendor_id uuid null,
  payment_due_date date null,
  paid_at timestamp with time zone null,
  notes text null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint budgets_pkey primary key (id),
  constraint budgets_vendor_id_fkey foreign key (vendor_id) references public.vendors (id) on delete set null,
  constraint budgets_event_id_fkey foreign key (event_id) references public.events (id) on delete cascade,
  constraint budgets_organizer_id_fkey foreign key (organizer_id) references public.organizers (id) on delete cascade,
  constraint budgets_actual_amount_check check ((actual_amount >= (0)::numeric)),
  constraint budgets_category_check check (
    (
      (category)::text = any (
        (
          array[
            'VENUE'::character varying,
            'CATERING'::character varying,
            'MARKETING'::character varying,
            'EQUIPMENT'::character varying,
            'STAFFING'::character varying,
            'ENTERTAINMENT'::character varying,
            'SUPPLIES'::character varying,
            'TECHNOLOGY'::character varying,
            'INSURANCE'::character varying,
            'TRANSPORTATION'::character varying,
            'OTHER'::character varying
          ]
        )::text[]
      )
    )
  ),
  constraint budgets_estimated_amount_check check ((estimated_amount >= (0)::numeric)),
  constraint budgets_status_check check (
    (
      (status)::text = any (
        (
          array[
            'PLANNED'::character varying,
            'APPROVED'::character varying,
            'COMMITTED'::character varying,
            'PAID'::character varying,
            'CANCELLED'::character varying
          ]
        )::text[]
      )
    )
  )
) tablespace pg_default;

comment on table public.budgets is 'Event budget tracking with category-based organization and variance calculation';

create index if not exists idx_budgets_event_id on public.budgets using btree (event_id) tablespace pg_default;
create index if not exists idx_budgets_organizer_id on public.budgets using btree (organizer_id) tablespace pg_default;
create index if not exists idx_budgets_category on public.budgets using btree (event_id, category) tablespace pg_default;
create index if not exists idx_budgets_vendor_id on public.budgets using btree (vendor_id) tablespace pg_default where (vendor_id is not null);

drop trigger if exists update_budgets_updated_at on public.budgets;
create trigger update_budgets_updated_at before update on public.budgets for each row execute function public.handle_updated_at();

-- ============================================================================
-- TABLE: companies
-- ============================================================================

create table if not exists public.companies (
  id uuid not null default gen_random_uuid(),
  organizer_id uuid not null,
  name character varying(255) not null,
  slug character varying(255) null,
  industry character varying(100) null,
  company_size character varying(50) null,
  website_url text null,
  phone character varying(50) null,
  email character varying(255) null,
  address_line1 text null,
  address_line2 text null,
  city character varying(100) null,
  state_province character varying(100) null,
  postal_code character varying(20) null,
  country character varying(2) null default 'US'::character varying,
  annual_revenue numeric(14, 2) null,
  currency character varying(3) null default 'USD'::character varying,
  linkedin_url text null,
  twitter_handle character varying(100) null,
  lead_source character varying(100) null,
  status character varying(50) null default 'ACTIVE'::character varying,
  tags text[] null default array[]::text[],
  custom_fields jsonb null default '{}'::jsonb,
  total_events_attended integer null default 0,
  total_revenue numeric(14, 2) null default 0,
  last_interaction_at timestamp with time zone null,
  notes text null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint companies_pkey primary key (id),
  constraint companies_slug_key unique (slug),
  constraint companies_organizer_id_fkey foreign key (organizer_id) references public.profiles (id) on delete cascade,
  constraint companies_company_size_check check (
    (
      (company_size)::text = any (
        (
          array[
            '1-10'::character varying,
            '11-50'::character varying,
            '51-200'::character varying,
            '201-500'::character varying,
            '501-1000'::character varying,
            '1000+'::character varying
          ]
        )::text[]
      )
    )
  ),
  constraint companies_status_check check (
    (
      (status)::text = any (
        (
          array[
            'ACTIVE'::character varying,
            'PROSPECT'::character varying,
            'CUSTOMER'::character varying,
            'INACTIVE'::character varying
          ]
        )::text[]
      )
    )
  )
) tablespace pg_default;

comment on table public.companies is 'CRM company records with auto-generated slugs and interaction tracking';

create index if not exists idx_companies_organizer_id on public.companies using btree (organizer_id) tablespace pg_default;
create index if not exists idx_companies_slug on public.companies using btree (slug) tablespace pg_default;
create index if not exists idx_companies_status on public.companies using btree (organizer_id, status) tablespace pg_default;
create index if not exists idx_companies_tags on public.companies using gin (tags) tablespace pg_default;
create index if not exists idx_companies_name_search on public.companies using gin (to_tsvector('english'::regconfig, (name)::text)) tablespace pg_default;

drop trigger if exists generate_company_slug_trigger on public.companies;
create trigger generate_company_slug_trigger before insert or update on public.companies for each row execute function public.generate_company_slug();

drop trigger if exists update_companies_updated_at on public.companies;
create trigger update_companies_updated_at before update on public.companies for each row execute function public.handle_updated_at();

-- ============================================================================
-- TABLE: contacts
-- ============================================================================

create table if not exists public.contacts (
  id uuid not null default gen_random_uuid(),
  organizer_id uuid not null,
  company_id uuid null,
  first_name character varying(100) not null,
  last_name character varying(100) not null,
  full_name character varying(255) generated always as (((first_name)::text || ' '::text) || (last_name)::text) stored,
  email character varying(255) not null,
  phone character varying(50) null,
  mobile_phone character varying(50) null,
  job_title character varying(150) null,
  department character varying(100) null,
  linkedin_url text null,
  twitter_handle character varying(100) null,
  address_line1 text null,
  address_line2 text null,
  city character varying(100) null,
  state_province character varying(100) null,
  postal_code character varying(20) null,
  country character varying(2) null default 'US'::character varying,
  lead_source character varying(100) null,
  status character varying(50) null default 'ACTIVE'::character varying,
  tags text[] null default array[]::text[],
  custom_fields jsonb null default '{}'::jsonb,
  total_events_attended integer null default 0,
  total_spent numeric(14, 2) null default 0,
  last_interaction_at timestamp with time zone null,
  last_event_attended_at timestamp with time zone null,
  email_consent boolean null default true,
  sms_consent boolean null default false,
  whatsapp_consent boolean null default false,
  notes text null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint contacts_pkey primary key (id),
  constraint contacts_company_id_fkey foreign key (company_id) references public.companies (id) on delete set null,
  constraint contacts_organizer_id_fkey foreign key (organizer_id) references public.profiles (id) on delete cascade,
  constraint contacts_status_check check (
    (
      (status)::text = any (
        (
          array[
            'ACTIVE'::character varying,
            'PROSPECT'::character varying,
            'LEAD'::character varying,
            'CUSTOMER'::character varying,
            'INACTIVE'::character varying
          ]
        )::text[]
      )
    )
  ),
  constraint email_format check ((email)::text ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
) tablespace pg_default;

comment on table public.contacts is 'CRM contact records with full_name generation and consent tracking';

create index if not exists idx_contacts_organizer_id on public.contacts using btree (organizer_id) tablespace pg_default;
create index if not exists idx_contacts_company_id on public.contacts using btree (company_id) tablespace pg_default where (company_id is not null);
create index if not exists idx_contacts_email on public.contacts using btree (email) tablespace pg_default;
create index if not exists idx_contacts_status on public.contacts using btree (organizer_id, status) tablespace pg_default;
create index if not exists idx_contacts_tags on public.contacts using gin (tags) tablespace pg_default;
create index if not exists idx_contacts_name_search on public.contacts using gin (to_tsvector('english'::regconfig, (full_name)::text)) tablespace pg_default;

drop trigger if exists update_contacts_updated_at on public.contacts;
create trigger update_contacts_updated_at before update on public.contacts for each row execute function public.handle_updated_at();

-- ============================================================================
-- TABLE: event_settings
-- ============================================================================

create table if not exists public.event_settings (
  id uuid not null default gen_random_uuid(),
  event_id uuid not null,
  pre_checkout_message text null,
  post_checkout_message text null,
  order_timeout_minutes integer not null default 15,
  seo_title character varying(255) null,
  seo_description text null,
  seo_image_url text null,
  website_url text null,
  social_links jsonb null default '{}'::jsonb,
  is_online_event boolean not null default false,
  online_event_url text null,
  primary_color character varying(20) null default '#3B82F6'::character varying,
  show_remaining_tickets boolean null default false,
  homepage_display_weight integer null default 0,
  email_footer_text text null,
  require_attendee_info boolean not null default true,
  collect_special_requests boolean null default false,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint event_settings_pkey primary key (id),
  constraint event_settings_event_id_key unique (event_id),
  constraint event_settings_event_id_fkey foreign key (event_id) references public.events (id) on delete cascade,
  constraint event_settings_order_timeout_minutes_check check (
    (
      (order_timeout_minutes >= 5)
      and (order_timeout_minutes <= 60)
    )
  )
) tablespace pg_default;

comment on table public.event_settings is 'Per-event configuration including SEO, display, and checkout settings';

create index if not exists idx_event_settings_event_id on public.event_settings using btree (event_id) tablespace pg_default;

drop trigger if exists update_event_settings_updated_at on public.event_settings;
create trigger update_event_settings_updated_at before update on public.event_settings for each row execute function public.handle_updated_at();

-- ============================================================================
-- TABLE: interactions
-- ============================================================================

create table if not exists public.interactions (
  id uuid not null default gen_random_uuid(),
  organizer_id uuid not null,
  contact_id uuid null,
  company_id uuid null,
  event_id uuid null,
  interaction_type character varying(50) not null,
  subject character varying(255) not null,
  description text null,
  outcome character varying(100) null,
  interaction_date timestamp with time zone not null default now(),
  duration_minutes integer null,
  requires_follow_up boolean null default false,
  follow_up_date date null,
  follow_up_notes text null,
  created_by uuid null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint interactions_pkey primary key (id),
  constraint interactions_contact_id_fkey foreign key (contact_id) references public.contacts (id) on delete cascade,
  constraint interactions_organizer_id_fkey foreign key (organizer_id) references public.profiles (id) on delete cascade,
  constraint interactions_created_by_fkey foreign key (created_by) references auth.users (id) on delete set null,
  constraint interactions_company_id_fkey foreign key (company_id) references public.companies (id) on delete cascade,
  constraint interactions_event_id_fkey foreign key (event_id) references public.events (id) on delete set null,
  constraint interactions_duration_minutes_check check ((duration_minutes > 0)),
  constraint contact_or_company_required check (
    (
      (contact_id is not null)
      or (company_id is not null)
    )
  ),
  constraint interactions_interaction_type_check check (
    (
      (interaction_type)::text = any (
        (
          array[
            'EMAIL'::character varying,
            'CALL'::character varying,
            'MEETING'::character varying,
            'EVENT_ATTENDANCE'::character varying,
            'TICKET_PURCHASE'::character varying,
            'WEBSITE_VISIT'::character varying,
            'DEMO_REQUEST'::character varying,
            'SUPPORT'::character varying,
            'NOTE'::character varying,
            'OTHER'::character varying
          ]
        )::text[]
      )
    )
  )
) tablespace pg_default;

comment on table public.interactions is 'CRM interaction tracking with automatic last_interaction_at updates';

create index if not exists idx_interactions_organizer_id on public.interactions using btree (organizer_id) tablespace pg_default;
create index if not exists idx_interactions_contact_id on public.interactions using btree (contact_id) tablespace pg_default where (contact_id is not null);
create index if not exists idx_interactions_company_id on public.interactions using btree (company_id) tablespace pg_default where (company_id is not null);
create index if not exists idx_interactions_event_id on public.interactions using btree (event_id) tablespace pg_default where (event_id is not null);
create index if not exists idx_interactions_date on public.interactions using btree (interaction_date desc) tablespace pg_default;
create index if not exists idx_interactions_follow_up on public.interactions using btree (follow_up_date) tablespace pg_default where (requires_follow_up = true);

drop trigger if exists update_interactions_updated_at on public.interactions;
create trigger update_interactions_updated_at before update on public.interactions for each row execute function public.handle_updated_at();

drop trigger if exists update_last_interaction_trigger on public.interactions;
create trigger update_last_interaction_trigger after insert on public.interactions for each row execute function public.update_last_interaction_timestamp();

-- ============================================================================
-- TABLE: promo_codes
-- ============================================================================

create table if not exists public.promo_codes (
  id uuid not null default gen_random_uuid(),
  event_id uuid not null,
  code character varying(50) not null,
  discount_type character varying(20) not null,
  discount_value numeric(10, 2) not null,
  max_uses integer null,
  max_uses_per_customer integer not null default 1,
  times_used integer not null default 0,
  valid_from timestamp with time zone null,
  valid_until timestamp with time zone null,
  applicable_ticket_ids uuid[] null default array[]::uuid[],
  minimum_quantity integer null default 1,
  minimum_purchase_amount numeric(10, 2) null default 0,
  is_active boolean not null default true,
  description text null,
  created_by uuid null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint promo_codes_pkey primary key (id),
  constraint unique_event_code unique (event_id, code),
  constraint promo_codes_event_id_fkey foreign key (event_id) references public.events (id) on delete cascade,
  constraint promo_codes_created_by_fkey foreign key (created_by) references auth.users (id) on delete set null,
  constraint promo_codes_max_uses_per_customer_check check ((max_uses_per_customer > 0)),
  constraint promo_codes_minimum_purchase_amount_check check ((minimum_purchase_amount >= (0)::numeric)),
  constraint promo_codes_minimum_quantity_check check ((minimum_quantity > 0)),
  constraint promo_codes_times_used_check check ((times_used >= 0)),
  constraint usage_limit_check check (
    (
      (max_uses is null)
      or (times_used <= max_uses)
    )
  ),
  constraint valid_date_range check (
    (
      (valid_from is null)
      or (valid_until is null)
      or (valid_from < valid_until)
    )
  ),
  constraint promo_codes_discount_type_check check (
    (
      (discount_type)::text = any (
        (
          array[
            'PERCENTAGE'::character varying,
            'FIXED_AMOUNT'::character varying
          ]
        )::text[]
      )
    )
  ),
  constraint promo_codes_discount_value_check check ((discount_value > (0)::numeric)),
  constraint promo_codes_max_uses_check check ((max_uses > 0))
) tablespace pg_default;

comment on table public.promo_codes is 'Event discount codes with usage tracking and validation rules';

create index if not exists idx_promo_codes_event_id on public.promo_codes using btree (event_id) tablespace pg_default;
create index if not exists idx_promo_codes_code on public.promo_codes using btree (upper((code)::text)) tablespace pg_default;
create index if not exists idx_promo_codes_validity on public.promo_codes using btree (valid_from, valid_until) tablespace pg_default where (is_active = true);

drop trigger if exists update_promo_codes_updated_at on public.promo_codes;
create trigger update_promo_codes_updated_at before update on public.promo_codes for each row execute function public.handle_updated_at();

-- ============================================================================
-- TABLE: tasks
-- ============================================================================

create table if not exists public.tasks (
  id uuid not null default gen_random_uuid(),
  event_id uuid not null,
  organizer_id uuid not null,
  title character varying(255) not null,
  description text null,
  category character varying(100) null,
  priority character varying(20) null default 'MEDIUM'::character varying,
  status character varying(50) null default 'TODO'::character varying,
  assigned_to uuid null,
  due_date date null,
  reminder_date date null,
  completed_at timestamp with time zone null,
  depends_on_task_ids uuid[] null default array[]::uuid[],
  notes text null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint tasks_pkey primary key (id),
  constraint tasks_event_id_fkey foreign key (event_id) references public.events (id) on delete cascade,
  constraint tasks_assigned_to_fkey foreign key (assigned_to) references auth.users (id) on delete set null,
  constraint tasks_organizer_id_fkey foreign key (organizer_id) references public.organizers (id) on delete cascade,
  constraint tasks_category_check check (
    (
      (category)::text = any (
        (
          array[
            'PLANNING'::character varying,
            'VENUE'::character varying,
            'MARKETING'::character varying,
            'LOGISTICS'::character varying,
            'STAFFING'::character varying,
            'FOLLOW_UP'::character varying,
            'OTHER'::character varying
          ]
        )::text[]
      )
    )
  ),
  constraint tasks_priority_check check (
    (
      (priority)::text = any (
        (
          array[
            'LOW'::character varying,
            'MEDIUM'::character varying,
            'HIGH'::character varying,
            'URGENT'::character varying
          ]
        )::text[]
      )
    )
  ),
  constraint tasks_status_check check (
    (
      (status)::text = any (
        (
          array[
            'TODO'::character varying,
            'IN_PROGRESS'::character varying,
            'BLOCKED'::character varying,
            'COMPLETED'::character varying,
            'CANCELLED'::character varying
          ]
        )::text[]
      )
    )
  )
) tablespace pg_default;

comment on table public.tasks is 'Event task management with dependencies and assignment tracking';

create index if not exists idx_tasks_event_id on public.tasks using btree (event_id) tablespace pg_default;
create index if not exists idx_tasks_organizer_id on public.tasks using btree (organizer_id) tablespace pg_default;
create index if not exists idx_tasks_assigned_to on public.tasks using btree (assigned_to) tablespace pg_default where (assigned_to is not null);
create index if not exists idx_tasks_status on public.tasks using btree (event_id, status) tablespace pg_default;
create index if not exists idx_tasks_due_date on public.tasks using btree (due_date) tablespace pg_default where ((status)::text <> 'COMPLETED'::text);

drop trigger if exists update_tasks_updated_at on public.tasks;
create trigger update_tasks_updated_at before update on public.tasks for each row execute function public.handle_updated_at();

-- ============================================================================
-- TABLE: vendors
-- ============================================================================

create table if not exists public.vendors (
  id uuid not null default gen_random_uuid(),
  organizer_id uuid not null,
  business_name character varying(255) not null,
  contact_name character varying(150) null,
  email character varying(255) not null,
  phone character varying(50) null,
  website_url text null,
  service_category character varying(100) not null,
  services_offered text[] null default array[]::text[],
  description text null,
  address_line1 text null,
  city character varying(100) null,
  state_province character varying(100) null,
  postal_code character varying(20) null,
  country character varying(2) null default 'US'::character varying,
  rating numeric(3, 2) null,
  total_reviews integer null default 0,
  business_registration character varying(100) null,
  insurance_verified boolean null default false,
  total_events_serviced integer null default 0,
  total_spent_with_vendor numeric(14, 2) null default 0,
  last_used_date date null,
  is_preferred boolean null default false,
  status character varying(50) null default 'ACTIVE'::character varying,
  notes text null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint vendors_pkey primary key (id),
  constraint vendors_organizer_id_fkey foreign key (organizer_id) references public.organizers (id) on delete cascade,
  constraint vendors_rating_check check (
    (
      (rating >= (0)::numeric)
      and (rating <= (5)::numeric)
    )
  ),
  constraint vendors_service_category_check check (
    (
      (service_category)::text = any (
        (
          array[
            'CATERING'::character varying,
            'AV_EQUIPMENT'::character varying,
            'PHOTOGRAPHY'::character varying,
            'VIDEOGRAPHY'::character varying,
            'ENTERTAINMENT'::character varying,
            'TRANSPORTATION'::character varying,
            'SECURITY'::character varying,
            'CLEANING'::character varying,
            'FLORIST'::character varying,
            'DECORATOR'::character varying,
            'OTHER'::character varying
          ]
        )::text[]
      )
    )
  ),
  constraint vendors_status_check check (
    (
      (status)::text = any (
        (
          array[
            'ACTIVE'::character varying,
            'INACTIVE'::character varying,
            'BLACKLISTED'::character varying
          ]
        )::text[]
      )
    )
  )
) tablespace pg_default;

comment on table public.vendors is 'Vendor directory with ratings, service categories, and usage tracking';

create index if not exists idx_vendors_organizer_id on public.vendors using btree (organizer_id) tablespace pg_default;
create index if not exists idx_vendors_service_category on public.vendors using btree (service_category) tablespace pg_default;
create index if not exists idx_vendors_status on public.vendors using btree (organizer_id, status) tablespace pg_default;
create index if not exists idx_vendors_preferred on public.vendors using btree (organizer_id, is_preferred) tablespace pg_default where (is_preferred = true);

drop trigger if exists update_vendors_updated_at on public.vendors;
create trigger update_vendors_updated_at before update on public.vendors for each row execute function public.handle_updated_at();

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
