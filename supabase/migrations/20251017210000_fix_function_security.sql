-- ============================================================================
-- SECURITY FIX: Add search_path protection to all functions
-- ============================================================================
--
-- Issue: Functions missing `set search_path = ''` security parameter
-- Risk: HIGH - Functions vulnerable to search_path injection attacks
-- Impact: All functions re-created with proper security settings
--
-- References:
-- - .cursor/rules/create-db-functions.mdc (lines 18-22)
-- - docs/PRODUCTION_READINESS_AUDIT.md (lines 58-109)
--
-- Functions Fixed:
-- 1. handle_updated_at() - Auto-update timestamps (used by ALL tables)
-- 2. generate_event_slug() - Generate URL-friendly event slugs
-- 3. generate_ticket_codes() - Generate ticket numbers and QR codes
-- 4. generate_order_number() - Generate unique order numbers
-- 5. generate_company_slug() - Generate URL-friendly company slugs
-- 6. validate_promo_code() - Validate and apply promo codes
-- 7. validate_question_answer_attendee() - Validate form responses
-- 8. update_last_interaction_timestamp() - Update CRM engagement tracking
--
-- ============================================================================

-- ============================================================================
-- 1. handle_updated_at() - Auto-update timestamps
-- ============================================================================

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''  -- ✓ SECURITY FIX
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

comment on function public.handle_updated_at() is
  'Automatically updates the updated_at column on row updates. SECURITY: Uses search_path protection.';

-- ============================================================================
-- 2. generate_event_slug() - Generate URL-friendly event slugs
-- ============================================================================

create or replace function public.generate_event_slug()
returns trigger
language plpgsql
security invoker
set search_path = ''  -- ✓ SECURITY FIX
as $$
begin
  -- ensure created_at is set (may be NULL in BEFORE INSERT)
  new.created_at := coalesce(new.created_at, now());

  if new.slug is null or new.slug = '' then
    new.slug = lower(
      regexp_replace(
        regexp_replace(
          unaccent(new.name),
          '[^a-zA-Z0-9]+',
          '-',
          'g'
        ),
        '^-+|-+$',
        '',
        'g'
      )
    ) || '-' || substr(new.id::text, 1, 8);
  end if;
  return new;
end;
$$;

comment on function public.generate_event_slug() is
  'Generates a URL-friendly slug from event name with unique ID suffix using unaccent. SECURITY: Uses search_path protection.';

-- ============================================================================
-- 3. generate_ticket_codes() - Generate ticket numbers and QR codes
-- ============================================================================

create or replace function public.generate_ticket_codes()
returns trigger
language plpgsql
security invoker
set search_path = ''  -- ✓ SECURITY FIX
as $$
begin
  -- ensure created_at is set (may be NULL in BEFORE INSERT)
  new.created_at := coalesce(new.created_at, now());

  if new.ticket_number is null or new.ticket_number = '' then
    new.ticket_number = 'TKT-'
      || upper(substr(new.id::text, 1, 8))
      || '-'
      || to_char(new.created_at, 'YYMMDD');
  end if;

  if new.qr_code is null or new.qr_code = '' then
    new.qr_code = encode(extensions.gen_random_bytes(32), 'base64');
  end if;

  return new;
end;
$$;

comment on function public.generate_ticket_codes() is
  'Generates unique ticket number and QR code for ticket check-in. SECURITY: Uses search_path protection.';

-- ============================================================================
-- 4. generate_order_number() - Generate unique order numbers
-- ============================================================================

create or replace function public.generate_order_number()
returns trigger
language plpgsql
security invoker
set search_path = ''  -- ✓ SECURITY FIX
as $$
begin
  -- ensure created_at is set (may be NULL in BEFORE INSERT)
  new.created_at := coalesce(new.created_at, now());

  if new.order_number is null or new.order_number = '' then
    new.order_number = 'ORD-'
      || to_char(new.created_at, 'YYYYMMDD')
      || '-'
      || upper(substr(new.id::text, 1, 8));
  end if;
  return new;
end;
$$;

comment on function public.generate_order_number() is
  'Generates a unique order number with date prefix for easy sorting. SECURITY: Uses search_path protection.';

-- ============================================================================
-- 5. generate_company_slug() - Generate URL-friendly company slugs
-- ============================================================================

create or replace function public.generate_company_slug()
returns trigger
language plpgsql
security invoker
set search_path = ''  -- ✓ SECURITY FIX
as $$
begin
  if new.slug is null or new.slug = '' then
    new.slug = lower(
      regexp_replace(
        regexp_replace(
          new.name,
          '[^a-zA-Z0-9]+',
          '-',
          'g'
        ),
        '^-+|-+$',
        '',
        'g'
      )
    ) || '-' || substr(new.id::text, 1, 8);
  end if;
  return new;
end;
$$;

comment on function public.generate_company_slug() is
  'Generates a URL-friendly slug from company name with unique ID suffix. SECURITY: Uses search_path protection.';

-- ============================================================================
-- 6. validate_promo_code() - Validate and apply promo codes
-- ============================================================================

create or replace function public.validate_promo_code(
  p_event_id uuid,
  p_code text,
  p_ticket_tier_id uuid default null
)
returns table (
  is_valid boolean,
  promo_code_id uuid,
  discount_type varchar(20),
  discount_value decimal(10,2),
  error_message text
)
language plpgsql
security invoker
set search_path = ''  -- ✓ SECURITY FIX
as $$
declare
  v_promo record;  -- Changed from public.promo_codes to record
  v_error text;
begin
  -- Find promo code (case-insensitive) - NOW WITH FULLY QUALIFIED NAME
  select * into v_promo
  from public.promo_codes  -- ✓ Fully qualified
  where event_id = p_event_id
    and upper(code) = upper(p_code)
  limit 1;

  -- Check if code exists
  if v_promo.id is null then
    return query select false, null::uuid, null::varchar(20), null::decimal(10,2), 'Promo code not found';
    return;
  end if;

  -- Check if active
  if not v_promo.is_active then
    return query select false, v_promo.id, null::varchar(20), null::decimal(10,2), 'Promo code is inactive';
    return;
  end if;

  -- Check validity dates
  if v_promo.valid_from is not null and v_promo.valid_from > now() then
    return query select false, v_promo.id, null::varchar(20), null::decimal(10,2), 'Promo code not yet valid';
    return;
  end if;

  if v_promo.valid_until is not null and v_promo.valid_until < now() then
    return query select false, v_promo.id, null::varchar(20), null::decimal(10,2), 'Promo code expired';
    return;
  end if;

  -- Check usage limits
  if v_promo.max_uses is not null and v_promo.times_used >= v_promo.max_uses then
    return query select false, v_promo.id, null::varchar(20), null::decimal(10,2), 'Promo code usage limit reached';
    return;
  end if;

  -- Check ticket tier applicability
  if p_ticket_tier_id is not null and
     array_length(v_promo.applicable_ticket_ids, 1) > 0 and
     not (p_ticket_tier_id = any(v_promo.applicable_ticket_ids)) then
    return query select false, v_promo.id, null::varchar(20), null::decimal(10,2), 'Promo code not applicable to this ticket';
    return;
  end if;

  -- Valid!
  return query select
    true,
    v_promo.id,
    v_promo.discount_type,
    v_promo.discount_value,
    null::text;
end;
$$;

comment on function public.validate_promo_code is
  'Validates promo code and returns discount details or error message. SECURITY: Uses search_path protection and fully qualified table names.';

-- ============================================================================
-- 7. validate_question_answer_attendee() - Validate form responses
-- ============================================================================

create or replace function public.validate_question_answer_attendee()
returns trigger
language plpgsql
security invoker
set search_path = ''  -- ✓ SECURITY FIX
as $$
declare
  v_belongs_to varchar(50);
begin
  -- Get the belongs_to value from the question - NOW WITH FULLY QUALIFIED NAME
  select belongs_to into v_belongs_to
  from public.questions  -- ✓ Fully qualified
  where id = new.question_id;

  -- If question belongs to ATTENDEE, attendee_id is required
  if v_belongs_to = 'ATTENDEE' and new.attendee_id is null then
    raise exception 'attendee_id is required for ATTENDEE questions';
  end if;

  return new;
end;
$$;

comment on function public.validate_question_answer_attendee() is
  'Validates that attendee_id is provided for ATTENDEE-type questions. SECURITY: Uses search_path protection and fully qualified table names.';

-- ============================================================================
-- 8. update_last_interaction_timestamp() - Update CRM engagement tracking
-- ============================================================================

create or replace function public.update_last_interaction_timestamp()
returns trigger
language plpgsql
security invoker
set search_path = ''  -- ✓ SECURITY FIX
as $$
begin
  -- Update contact - NOW WITH FULLY QUALIFIED NAME
  if new.contact_id is not null then
    update public.contacts  -- ✓ Fully qualified
    set last_interaction_at = new.interaction_date
    where id = new.contact_id;
  end if;

  -- Update company - NOW WITH FULLY QUALIFIED NAME
  if new.company_id is not null then
    update public.companies  -- ✓ Fully qualified
    set last_interaction_at = new.interaction_date
    where id = new.company_id;
  end if;

  return new;
end;
$$;

comment on function public.update_last_interaction_timestamp() is
  'Updates last_interaction_at timestamp on related contacts and companies. SECURITY: Uses search_path protection and fully qualified table names.';

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
--
-- Run these queries after migration to verify all functions have search_path:
--
-- SELECT
--   p.proname as function_name,
--   pg_get_function_arguments(p.oid) as arguments,
--   p.prosecdef as security_definer,
--   pg_get_functiondef(p.oid) LIKE '%search_path%' as has_search_path
-- FROM pg_proc p
-- JOIN pg_namespace n ON p.pronamespace = n.oid
-- WHERE n.nspname = 'public'
--   AND p.proname IN (
--     'handle_updated_at',
--     'generate_event_slug',
--     'generate_ticket_codes',
--     'generate_order_number',
--     'generate_company_slug',
--     'validate_promo_code',
--     'validate_question_answer_attendee',
--     'update_last_interaction_timestamp'
--   )
-- ORDER BY p.proname;
--
-- Expected: All 8 functions should have has_search_path = true
--
-- ============================================================================
