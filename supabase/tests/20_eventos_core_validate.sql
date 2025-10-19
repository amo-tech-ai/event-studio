-- ============================================================================
-- EventOS Core Tables - Validation Tests
-- ============================================================================
-- Description: Comprehensive validation tests with fail-fast assertions
-- Version: 1.0.0
-- Created: 2025-10-19
-- Purpose: Verify schema, data integrity, constraints, and relationships
-- ============================================================================

\set ON_ERROR_STOP on

begin;

-- ============================================================================
-- TEST 1: ROW EXISTENCE (All tables must have >= 1 row)
-- ============================================================================

do $$
declare
  v_count int;
begin
  raise notice '';
  raise notice '============================================================================';
  raise notice 'TEST 1: ROW EXISTENCE';
  raise notice '============================================================================';

  -- budgets
  select count(*) into v_count from budgets;
  if v_count < 1 then
    raise exception '❌ FAIL: budgets table is empty (expected >= 1 row)';
  end if;
  raise notice '✅ budgets: % rows', v_count;

  -- companies
  select count(*) into v_count from companies;
  if v_count < 1 then
    raise exception '❌ FAIL: companies table is empty (expected >= 1 row)';
  end if;
  raise notice '✅ companies: % rows', v_count;

  -- contacts
  select count(*) into v_count from contacts;
  if v_count < 1 then
    raise exception '❌ FAIL: contacts table is empty (expected >= 1 row)';
  end if;
  raise notice '✅ contacts: % rows', v_count;

  -- event_settings
  select count(*) into v_count from event_settings;
  if v_count < 1 then
    raise exception '❌ FAIL: event_settings table is empty (expected >= 1 row)';
  end if;
  raise notice '✅ event_settings: % rows', v_count;

  -- interactions
  select count(*) into v_count from interactions;
  if v_count < 1 then
    raise exception '❌ FAIL: interactions table is empty (expected >= 1 row)';
  end if;
  raise notice '✅ interactions: % rows', v_count;

  -- promo_codes
  select count(*) into v_count from promo_codes;
  if v_count < 1 then
    raise exception '❌ FAIL: promo_codes table is empty (expected >= 1 row)';
  end if;
  raise notice '✅ promo_codes: % rows', v_count;

  -- tasks
  select count(*) into v_count from tasks;
  if v_count < 1 then
    raise exception '❌ FAIL: tasks table is empty (expected >= 1 row)';
  end if;
  raise notice '✅ tasks: % rows', v_count;

  -- vendors
  select count(*) into v_count from vendors;
  if v_count < 1 then
    raise exception '❌ FAIL: vendors table is empty (expected >= 1 row)';
  end if;
  raise notice '✅ vendors: % rows', v_count;

  raise notice '✅ TEST 1 PASSED: All tables have data';
end $$;

-- ============================================================================
-- TEST 2: FOREIGN KEY INTEGRITY (No orphaned records)
-- ============================================================================

do $$
declare
  v_orphans int;
begin
  raise notice '';
  raise notice '============================================================================';
  raise notice 'TEST 2: FOREIGN KEY INTEGRITY';
  raise notice '============================================================================';

  -- budgets → events
  select count(*) into v_orphans from budgets b where not exists (select 1 from events e where e.id = b.event_id);
  if v_orphans > 0 then
    raise exception '❌ FAIL: budgets has % orphaned records (event_id)', v_orphans;
  end if;
  raise notice '✅ budgets → events: no orphans';

  -- budgets → organizers
  select count(*) into v_orphans from budgets b where not exists (select 1 from organizers o where o.id = b.organizer_id);
  if v_orphans > 0 then
    raise exception '❌ FAIL: budgets has % orphaned records (organizer_id)', v_orphans;
  end if;
  raise notice '✅ budgets → organizers: no orphans';

  -- companies → profiles
  select count(*) into v_orphans from companies c where not exists (select 1 from profiles p where p.id = c.organizer_id);
  if v_orphans > 0 then
    raise exception '❌ FAIL: companies has % orphaned records (organizer_id)', v_orphans;
  end if;
  raise notice '✅ companies → profiles: no orphans';

  -- contacts → profiles
  select count(*) into v_orphans from contacts c where not exists (select 1 from profiles p where p.id = c.organizer_id);
  if v_orphans > 0 then
    raise exception '❌ FAIL: contacts has % orphaned records (organizer_id)', v_orphans;
  end if;
  raise notice '✅ contacts → profiles: no orphans';

  -- contacts → companies (nullable FK)
  select count(*) into v_orphans from contacts c where c.company_id is not null and not exists (select 1 from companies co where co.id = c.company_id);
  if v_orphans > 0 then
    raise exception '❌ FAIL: contacts has % orphaned records (company_id)', v_orphans;
  end if;
  raise notice '✅ contacts → companies: no orphans';

  -- event_settings → events
  select count(*) into v_orphans from event_settings es where not exists (select 1 from events e where e.id = es.event_id);
  if v_orphans > 0 then
    raise exception '❌ FAIL: event_settings has % orphaned records (event_id)', v_orphans;
  end if;
  raise notice '✅ event_settings → events: no orphans';

  -- interactions → profiles
  select count(*) into v_orphans from interactions i where not exists (select 1 from profiles p where p.id = i.organizer_id);
  if v_orphans > 0 then
    raise exception '❌ FAIL: interactions has % orphaned records (organizer_id)', v_orphans;
  end if;
  raise notice '✅ interactions → profiles: no orphans';

  -- promo_codes → events
  select count(*) into v_orphans from promo_codes pc where not exists (select 1 from events e where e.id = pc.event_id);
  if v_orphans > 0 then
    raise exception '❌ FAIL: promo_codes has % orphaned records (event_id)', v_orphans;
  end if;
  raise notice '✅ promo_codes → events: no orphans';

  -- tasks → events
  select count(*) into v_orphans from tasks t where not exists (select 1 from events e where e.id = t.event_id);
  if v_orphans > 0 then
    raise exception '❌ FAIL: tasks has % orphaned records (event_id)', v_orphans;
  end if;
  raise notice '✅ tasks → events: no orphans';

  -- tasks → organizers
  select count(*) into v_orphans from tasks t where not exists (select 1 from organizers o where o.id = t.organizer_id);
  if v_orphans > 0 then
    raise exception '❌ FAIL: tasks has % orphaned records (organizer_id)', v_orphans;
  end if;
  raise notice '✅ tasks → organizers: no orphans';

  -- vendors → organizers
  select count(*) into v_orphans from vendors v where not exists (select 1 from organizers o where o.id = v.organizer_id);
  if v_orphans > 0 then
    raise exception '❌ FAIL: vendors has % orphaned records (organizer_id)', v_orphans;
  end if;
  raise notice '✅ vendors → organizers: no orphans';

  raise notice '✅ TEST 2 PASSED: All foreign keys valid';
end $$;

-- ============================================================================
-- TEST 3: CHECK CONSTRAINTS (Enum values, ranges, logic)
-- ============================================================================

do $$
declare
  v_invalid int;
begin
  raise notice '';
  raise notice '============================================================================';
  raise notice 'TEST 3: CHECK CONSTRAINTS';
  raise notice '============================================================================';

  -- budgets: estimated_amount >= 0
  select count(*) into v_invalid from budgets where estimated_amount < 0;
  if v_invalid > 0 then
    raise exception '❌ FAIL: budgets has % rows with estimated_amount < 0', v_invalid;
  end if;
  raise notice '✅ budgets.estimated_amount >= 0';

  -- budgets: actual_amount >= 0
  select count(*) into v_invalid from budgets where actual_amount < 0;
  if v_invalid > 0 then
    raise exception '❌ FAIL: budgets has % rows with actual_amount < 0', v_invalid;
  end if;
  raise notice '✅ budgets.actual_amount >= 0';

  -- budgets: variance = actual - estimated
  select count(*) into v_invalid from budgets where variance != (actual_amount - estimated_amount);
  if v_invalid > 0 then
    raise exception '❌ FAIL: budgets has % rows with incorrect variance calculation', v_invalid;
  end if;
  raise notice '✅ budgets.variance calculation correct';

  -- budgets: category enum
  select count(*) into v_invalid from budgets where category not in ('VENUE', 'CATERING', 'MARKETING', 'EQUIPMENT', 'STAFFING', 'ENTERTAINMENT', 'SUPPLIES', 'TECHNOLOGY', 'INSURANCE', 'TRANSPORTATION', 'OTHER');
  if v_invalid > 0 then
    raise exception '❌ FAIL: budgets has % rows with invalid category', v_invalid;
  end if;
  raise notice '✅ budgets.category valid';

  -- budgets: status enum
  select count(*) into v_invalid from budgets where status not in ('PLANNED', 'APPROVED', 'COMMITTED', 'PAID', 'CANCELLED');
  if v_invalid > 0 then
    raise exception '❌ FAIL: budgets has % rows with invalid status', v_invalid;
  end if;
  raise notice '✅ budgets.status valid';

  -- companies: company_size enum
  select count(*) into v_invalid from companies where company_size is not null and company_size not in ('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+');
  if v_invalid > 0 then
    raise exception '❌ FAIL: companies has % rows with invalid company_size', v_invalid;
  end if;
  raise notice '✅ companies.company_size valid';

  -- companies: status enum
  select count(*) into v_invalid from companies where status not in ('ACTIVE', 'PROSPECT', 'CUSTOMER', 'INACTIVE');
  if v_invalid > 0 then
    raise exception '❌ FAIL: companies has % rows with invalid status', v_invalid;
  end if;
  raise notice '✅ companies.status valid';

  -- contacts: status enum
  select count(*) into v_invalid from contacts where status not in ('ACTIVE', 'PROSPECT', 'LEAD', 'CUSTOMER', 'INACTIVE');
  if v_invalid > 0 then
    raise exception '❌ FAIL: contacts has % rows with invalid status', v_invalid;
  end if;
  raise notice '✅ contacts.status valid';

  -- contacts: email format
  select count(*) into v_invalid from contacts where email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
  if v_invalid > 0 then
    raise exception '❌ FAIL: contacts has % rows with invalid email format', v_invalid;
  end if;
  raise notice '✅ contacts.email format valid';

  -- contacts: full_name generation
  select count(*) into v_invalid from contacts where full_name != (first_name || ' ' || last_name);
  if v_invalid > 0 then
    raise exception '❌ FAIL: contacts has % rows with incorrect full_name', v_invalid;
  end if;
  raise notice '✅ contacts.full_name generation correct';

  -- event_settings: order_timeout_minutes 5-60
  select count(*) into v_invalid from event_settings where order_timeout_minutes < 5 or order_timeout_minutes > 60;
  if v_invalid > 0 then
    raise exception '❌ FAIL: event_settings has % rows with order_timeout_minutes out of range', v_invalid;
  end if;
  raise notice '✅ event_settings.order_timeout_minutes in range [5,60]';

  -- interactions: duration_minutes > 0 (if set)
  select count(*) into v_invalid from interactions where duration_minutes is not null and duration_minutes <= 0;
  if v_invalid > 0 then
    raise exception '❌ FAIL: interactions has % rows with duration_minutes <= 0', v_invalid;
  end if;
  raise notice '✅ interactions.duration_minutes > 0';

  -- interactions: contact_id OR company_id required
  select count(*) into v_invalid from interactions where contact_id is null and company_id is null;
  if v_invalid > 0 then
    raise exception '❌ FAIL: interactions has % rows with both contact_id and company_id null', v_invalid;
  end if;
  raise notice '✅ interactions: contact_id OR company_id present';

  -- interactions: interaction_type enum
  select count(*) into v_invalid from interactions where interaction_type not in ('EMAIL', 'CALL', 'MEETING', 'EVENT_ATTENDANCE', 'TICKET_PURCHASE', 'WEBSITE_VISIT', 'DEMO_REQUEST', 'SUPPORT', 'NOTE', 'OTHER');
  if v_invalid > 0 then
    raise exception '❌ FAIL: interactions has % rows with invalid interaction_type', v_invalid;
  end if;
  raise notice '✅ interactions.interaction_type valid';

  -- promo_codes: discount_type enum
  select count(*) into v_invalid from promo_codes where discount_type not in ('PERCENTAGE', 'FIXED_AMOUNT');
  if v_invalid > 0 then
    raise exception '❌ FAIL: promo_codes has % rows with invalid discount_type', v_invalid;
  end if;
  raise notice '✅ promo_codes.discount_type valid';

  -- promo_codes: discount_value > 0
  select count(*) into v_invalid from promo_codes where discount_value <= 0;
  if v_invalid > 0 then
    raise exception '❌ FAIL: promo_codes has % rows with discount_value <= 0', v_invalid;
  end if;
  raise notice '✅ promo_codes.discount_value > 0';

  -- promo_codes: max_uses_per_customer > 0
  select count(*) into v_invalid from promo_codes where max_uses_per_customer <= 0;
  if v_invalid > 0 then
    raise exception '❌ FAIL: promo_codes has % rows with max_uses_per_customer <= 0', v_invalid;
  end if;
  raise notice '✅ promo_codes.max_uses_per_customer > 0';

  -- promo_codes: times_used >= 0
  select count(*) into v_invalid from promo_codes where times_used < 0;
  if v_invalid > 0 then
    raise exception '❌ FAIL: promo_codes has % rows with times_used < 0', v_invalid;
  end if;
  raise notice '✅ promo_codes.times_used >= 0';

  -- promo_codes: valid_from < valid_until (if both set)
  select count(*) into v_invalid from promo_codes where valid_from is not null and valid_until is not null and valid_from >= valid_until;
  if v_invalid > 0 then
    raise exception '❌ FAIL: promo_codes has % rows with valid_from >= valid_until', v_invalid;
  end if;
  raise notice '✅ promo_codes: valid_from < valid_until';

  -- promo_codes: times_used <= max_uses (if max_uses set)
  select count(*) into v_invalid from promo_codes where max_uses is not null and times_used > max_uses;
  if v_invalid > 0 then
    raise exception '❌ FAIL: promo_codes has % rows with times_used > max_uses', v_invalid;
  end if;
  raise notice '✅ promo_codes: times_used <= max_uses';

  -- tasks: priority enum
  select count(*) into v_invalid from tasks where priority not in ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
  if v_invalid > 0 then
    raise exception '❌ FAIL: tasks has % rows with invalid priority', v_invalid;
  end if;
  raise notice '✅ tasks.priority valid';

  -- tasks: status enum
  select count(*) into v_invalid from tasks where status not in ('TODO', 'IN_PROGRESS', 'BLOCKED', 'COMPLETED', 'CANCELLED');
  if v_invalid > 0 then
    raise exception '❌ FAIL: tasks has % rows with invalid status', v_invalid;
  end if;
  raise notice '✅ tasks.status valid';

  -- tasks: category enum
  select count(*) into v_invalid from tasks where category is not null and category not in ('PLANNING', 'VENUE', 'MARKETING', 'LOGISTICS', 'STAFFING', 'FOLLOW_UP', 'OTHER');
  if v_invalid > 0 then
    raise exception '❌ FAIL: tasks has % rows with invalid category', v_invalid;
  end if;
  raise notice '✅ tasks.category valid';

  -- vendors: rating 0-5
  select count(*) into v_invalid from vendors where rating is not null and (rating < 0 or rating > 5);
  if v_invalid > 0 then
    raise exception '❌ FAIL: vendors has % rows with rating out of range [0,5]', v_invalid;
  end if;
  raise notice '✅ vendors.rating in range [0,5]';

  -- vendors: service_category enum
  select count(*) into v_invalid from vendors where service_category not in ('CATERING', 'AV_EQUIPMENT', 'PHOTOGRAPHY', 'VIDEOGRAPHY', 'ENTERTAINMENT', 'TRANSPORTATION', 'SECURITY', 'CLEANING', 'FLORIST', 'DECORATOR', 'OTHER');
  if v_invalid > 0 then
    raise exception '❌ FAIL: vendors has % rows with invalid service_category', v_invalid;
  end if;
  raise notice '✅ vendors.service_category valid';

  -- vendors: status enum
  select count(*) into v_invalid from vendors where status not in ('ACTIVE', 'INACTIVE', 'BLACKLISTED');
  if v_invalid > 0 then
    raise exception '❌ FAIL: vendors has % rows with invalid status', v_invalid;
  end if;
  raise notice '✅ vendors.status valid';

  raise notice '✅ TEST 3 PASSED: All CHECK constraints satisfied';
end $$;

-- ============================================================================
-- TEST 4: UNIQUE CONSTRAINTS
-- ============================================================================

do $$
declare
  v_duplicates int;
begin
  raise notice '';
  raise notice '============================================================================';
  raise notice 'TEST 4: UNIQUE CONSTRAINTS';
  raise notice '============================================================================';

  -- companies: slug unique
  select count(*) - count(distinct slug) into v_duplicates from companies where slug is not null;
  if v_duplicates > 0 then
    raise exception '❌ FAIL: companies has % duplicate slugs', v_duplicates;
  end if;
  raise notice '✅ companies.slug unique';

  -- event_settings: event_id unique
  select count(*) - count(distinct event_id) into v_duplicates from event_settings;
  if v_duplicates > 0 then
    raise exception '❌ FAIL: event_settings has % duplicate event_id', v_duplicates;
  end if;
  raise notice '✅ event_settings.event_id unique';

  -- promo_codes: (event_id, code) unique
  select count(*) - count(distinct (event_id, code)) into v_duplicates from promo_codes;
  if v_duplicates > 0 then
    raise exception '❌ FAIL: promo_codes has % duplicate (event_id, code) pairs', v_duplicates;
  end if;
  raise notice '✅ promo_codes.(event_id, code) unique';

  raise notice '✅ TEST 4 PASSED: All unique constraints satisfied';
end $$;

-- ============================================================================
-- TEST 5: DERIVED COLUMNS & TRIGGERS
-- ============================================================================

do $$
declare
  v_invalid int;
begin
  raise notice '';
  raise notice '============================================================================';
  raise notice 'TEST 5: DERIVED COLUMNS & TRIGGERS';
  raise notice '============================================================================';

  -- companies: slug auto-generated (should not be null)
  select count(*) into v_invalid from companies where slug is null;
  if v_invalid > 0 then
    raise exception '❌ FAIL: companies has % rows with null slug (auto-generation failed)', v_invalid;
  end if;
  raise notice '✅ companies.slug auto-generated';

  -- contacts: full_name derived from first_name + last_name
  select count(*) into v_invalid from contacts where full_name != (first_name || ' ' || last_name);
  if v_invalid > 0 then
    raise exception '❌ FAIL: contacts has % rows with incorrect full_name derivation', v_invalid;
  end if;
  raise notice '✅ contacts.full_name derived correctly';

  -- budgets: variance derived from actual - estimated
  select count(*) into v_invalid from budgets where variance != (actual_amount - estimated_amount);
  if v_invalid > 0 then
    raise exception '❌ FAIL: budgets has % rows with incorrect variance derivation', v_invalid;
  end if;
  raise notice '✅ budgets.variance derived correctly';

  raise notice '✅ TEST 5 PASSED: All derived columns correct';
end $$;

-- ============================================================================
-- FINAL SUMMARY
-- ============================================================================

do $$
begin
  raise notice '';
  raise notice '============================================================================';
  raise notice '✅ ALL VALIDATION TESTS PASSED';
  raise notice '============================================================================';
  raise notice '';
  raise notice 'Summary:';
  raise notice '  ✅ TEST 1: Row existence';
  raise notice '  ✅ TEST 2: Foreign key integrity';
  raise notice '  ✅ TEST 3: CHECK constraints';
  raise notice '  ✅ TEST 4: Unique constraints';
  raise notice '  ✅ TEST 5: Derived columns & triggers';
  raise notice '';
  raise notice '🎉 Database is valid and ready for use!';
  raise notice '';
end $$;

commit;
