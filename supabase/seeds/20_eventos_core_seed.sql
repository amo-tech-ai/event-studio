-- ============================================================================
-- EventOS Core Tables - Seed Data
-- ============================================================================
-- Description: Minimal, realistic seed data for 8 core tables
-- Version: 1.0.0
-- Created: 2025-10-19
-- Prerequisites: profiles, events, organizers, auth.users must exist
-- ============================================================================

begin;

-- ============================================================================
-- PREREQUISITES CHECK & SETUP
-- ============================================================================

-- Verify or create sample auth user, profile, organizer
do $$
declare
  v_profile_id uuid := '11111111-1111-1111-1111-111111111111';
  v_event_id uuid := 'e1111111-1111-1111-1111-111111111111';
begin
  -- Ensure auth.users record exists first (required by profiles FK)
  if not exists (select 1 from auth.users where id = v_profile_id) then
    raise notice 'Creating sample auth user...';
    insert into auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      aud,
      role
    ) values (
      v_profile_id,
      '00000000-0000-0000-0000-000000000000',
      'organizer@eventos.com',
      crypt('sample_password_123', gen_salt('bf')),
      now(),
      now(),
      now(),
      'authenticated',
      'authenticated'
    ) on conflict (id) do nothing;
  end if;

  -- Ensure profile exists (used as organizer_id in companies, contacts, interactions)
  if not exists (select 1 from profiles where id = v_profile_id) then
    raise notice 'Creating sample profile...';
    insert into profiles (id, email, full_name)
    values (v_profile_id, 'organizer@eventos.com', 'Sample Organizer')
    on conflict (id) do nothing;
  end if;

  -- Ensure organizer exists (used in budgets, tasks, vendors)
  if not exists (select 1 from organizers where id = v_profile_id) then
    raise notice 'Creating sample organizer...';
    insert into organizers (
      id,
      organization_name,
      organization_type,
      is_verified,
      support_email,
      business_city,
      business_country
    )
    values (
      v_profile_id,
      'EventOS Organizer',
      'COMPANY',
      true,
      'organizer@eventos.com',
      'Toronto',
      'CA'
    )
    on conflict (id) do nothing;
  end if;

  -- Ensure sample event exists
  if not exists (select 1 from events where id = v_event_id) then
    raise notice 'Creating sample event...';
    insert into events (
      id,
      organizer_id,
      name,
      slug,
      type,
      status,
      visibility,
      start_at,
      end_at,
      capacity,
      price_cents
    ) values (
      v_event_id,
      v_profile_id,
      'EventOS Sample Conference 2025',
      'eventos-sample-conference-2025',
      'conference',
      'published',
      'public',
      now() + interval '30 days',
      now() + interval '31 days',
      500,
      9900
    ) on conflict (id) do nothing;
  end if;

  raise notice 'Prerequisites verified/created';
end $$;

-- ============================================================================
-- SEED DATA: vendors (must come before budgets due to FK)
-- ============================================================================

insert into vendors (
  id,
  organizer_id,
  business_name,
  contact_name,
  email,
  phone,
  service_category,
  services_offered,
  description,
  rating,
  status
) values
  (
    'a1111111-1111-1111-1111-111111111111'::uuid,
    '11111111-1111-1111-1111-111111111111',
    'Premium Catering Co',
    'Jane Smith',
    'contact@premiumcatering.com',
    '+1-555-0100',
    'CATERING',
    array['Full service catering', 'Bar services', 'Dessert tables'],
    'Award-winning catering service specializing in corporate events',
    4.5,
    'ACTIVE'
  )
on conflict (id) do nothing;

-- ============================================================================
-- SEED DATA: companies
-- ============================================================================

insert into companies (
  id,
  organizer_id,
  name,
  industry,
  company_size,
  website_url,
  phone,
  email,
  city,
  state_province,
  country,
  status
) values
  (
    'c1111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'TechVentures Inc',
    'Technology',
    '51-200',
    'https://techventures.com',
    '+1-555-0101',
    'info@techventures.com',
    'San Francisco',
    'CA',
    'US',
    'ACTIVE'
  )
on conflict (id) do nothing;

-- ============================================================================
-- SEED DATA: contacts
-- ============================================================================

insert into contacts (
  id,
  organizer_id,
  company_id,
  first_name,
  last_name,
  email,
  phone,
  job_title,
  status
) values
  (
    'd1111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'c1111111-1111-1111-1111-111111111111',
    'John',
    'Smith',
    'john.smith@techventures.com',
    '+1-555-0201',
    'Event Coordinator',
    'ACTIVE'
  )
on conflict (id) do nothing;

-- ============================================================================
-- SEED DATA: event_settings
-- ============================================================================

insert into event_settings (
  id,
  event_id,
  pre_checkout_message,
  post_checkout_message,
  order_timeout_minutes,
  seo_title,
  seo_description,
  is_online_event,
  show_remaining_tickets,
  require_attendee_info
) values
  (
    'e1111111-1111-1111-1111-111111111111',
    'e1111111-1111-1111-1111-111111111111',
    'Thank you for choosing our event!',
    'Check your email for confirmation and event details.',
    15,
    'EventOS Sample Conference 2025 - Register Now',
    'Join us for the premier EventOS conference featuring industry leaders and networking opportunities.',
    false,
    true,
    true
  )
on conflict (event_id) do nothing;

-- ============================================================================
-- SEED DATA: interactions
-- ============================================================================

insert into interactions (
  id,
  organizer_id,
  contact_id,
  event_id,
  interaction_type,
  subject,
  description,
  outcome,
  interaction_date,
  duration_minutes
) values
  (
    'f1111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'd1111111-1111-1111-1111-111111111111',
    'e1111111-1111-1111-1111-111111111111',
    'EMAIL',
    'Event sponsorship inquiry',
    'Initial outreach regarding platinum sponsorship package',
    'Interested - scheduled follow-up call',
    now() - interval '7 days',
    null
  ),
  (
    'f2222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'd1111111-1111-1111-1111-111111111111',
    'e1111111-1111-1111-1111-111111111111',
    'MEETING',
    'Sponsorship package review',
    'Met with decision makers to discuss custom sponsorship options',
    'Proposal sent - awaiting approval',
    now() - interval '3 days',
    60
  )
on conflict (id) do nothing;

-- Update last_interaction_at via interaction_date
update contacts
set last_interaction_at = (select max(interaction_date) from interactions where contact_id = contacts.id)
where id = 'd1111111-1111-1111-1111-111111111111';

update companies
set last_interaction_at = (select max(interaction_date) from interactions where company_id = companies.id)
where id = 'c1111111-1111-1111-1111-111111111111';

-- ============================================================================
-- SEED DATA: promo_codes
-- ============================================================================

insert into promo_codes (
  id,
  event_id,
  code,
  discount_type,
  discount_value,
  max_uses,
  max_uses_per_customer,
  valid_from,
  valid_until,
  minimum_quantity,
  is_active,
  description
) values
  (
    'd2222222-2222-2222-2222-222222222222',
    'e1111111-1111-1111-1111-111111111111',
    'EARLY20',
    'PERCENTAGE',
    20.00,
    100,
    1,
    now() - interval '7 days',
    now() + interval '23 days',
    1,
    true,
    'Early bird 20% discount for first 100 registrants'
  ),
  (
    'd3333333-3333-3333-3333-333333333333',
    'e1111111-1111-1111-1111-111111111111',
    'SAVE50',
    'FIXED_AMOUNT',
    50.00,
    null,
    2,
    now(),
    now() + interval '30 days',
    2,
    true,
    '$50 off when purchasing 2 or more tickets'
  )
on conflict (event_id, code) do nothing;

-- ============================================================================
-- SEED DATA: tasks
-- ============================================================================

insert into tasks (
  id,
  event_id,
  organizer_id,
  title,
  description,
  category,
  priority,
  status,
  due_date
) values
  (
    'a2222222-2222-2222-2222-222222222222',
    'e1111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'Finalize venue contract',
    'Review and sign venue rental agreement including insurance requirements',
    'VENUE',
    'URGENT',
    'TODO',
    now() + interval '5 days'
  ),
  (
    'a3333333-3333-3333-3333-333333333333',
    'e1111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'Send sponsor invoices',
    'Generate and send invoices to confirmed platinum and gold sponsors',
    'MARKETING',
    'MEDIUM',
    'IN_PROGRESS',
    now() + interval '10 days'
  )
on conflict (id) do nothing;

-- ============================================================================
-- SEED DATA: budgets
-- ============================================================================

insert into budgets (
  id,
  event_id,
  organizer_id,
  category,
  subcategory,
  description,
  estimated_amount,
  actual_amount,
  currency,
  status
) values
  (
    'b1111111-1111-1111-1111-111111111111',
    'e1111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'VENUE',
    'Rental and setup',
    'Conference center rental for 2 days including AV equipment',
    15000.00,
    14500.00,
    'USD',
    'PAID'
  ),
  (
    'b2222222-2222-2222-2222-222222222222',
    'e1111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'CATERING',
    'Lunch and breaks',
    'Full catering service for 500 attendees over 2 days',
    25000.00,
    27500.00,
    'USD',
    'COMMITTED'
  )
on conflict (id) do nothing;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

do $$
declare
  v_budgets_count int;
  v_companies_count int;
  v_contacts_count int;
  v_event_settings_count int;
  v_interactions_count int;
  v_promo_codes_count int;
  v_tasks_count int;
  v_vendors_count int;
begin
  select count(*) into v_budgets_count from budgets;
  select count(*) into v_companies_count from companies;
  select count(*) into v_contacts_count from contacts;
  select count(*) into v_event_settings_count from event_settings;
  select count(*) into v_interactions_count from interactions;
  select count(*) into v_promo_codes_count from promo_codes;
  select count(*) into v_tasks_count from tasks;
  select count(*) into v_vendors_count from vendors;

  raise notice '';
  raise notice '============================================================================';
  raise notice 'SEED DATA SUMMARY';
  raise notice '============================================================================';
  raise notice 'budgets:        % rows', v_budgets_count;
  raise notice 'companies:      % rows', v_companies_count;
  raise notice 'contacts:       % rows', v_contacts_count;
  raise notice 'event_settings: % rows', v_event_settings_count;
  raise notice 'interactions:   % rows', v_interactions_count;
  raise notice 'promo_codes:    % rows', v_promo_codes_count;
  raise notice 'tasks:          % rows', v_tasks_count;
  raise notice 'vendors:        % rows', v_vendors_count;
  raise notice '============================================================================';
  raise notice '';

  if v_budgets_count < 2 or v_companies_count < 1 or v_contacts_count < 1 or
     v_event_settings_count < 1 or v_interactions_count < 2 or v_promo_codes_count < 2 or
     v_tasks_count < 2 or v_vendors_count < 1 then
    raise exception 'Seed data verification failed: insufficient rows';
  end if;

  raise notice '✅ All seed data inserted successfully';
end $$;

commit;
