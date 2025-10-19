-- ============================================================================
-- SECURITY FIX: Replace 'public' role with correct roles in RLS policies
-- ============================================================================
--
-- Issue: RLS policies using 'public' role instead of 'anon'/'authenticated'
-- Risk: MEDIUM - Incorrect role assignment can cause security/access issues
-- Impact: 9 policies updated with correct role assignments
--
-- References:
-- - .cursor/rules/create-rls-policies.mdc (lines 22-25)
-- - docs/PRODUCTION_READINESS_AUDIT.md (lines 135-165)
--
-- Policy Types:
-- 1. Management policies → Use 'authenticated' (requires login)
-- 2. Public read policies → Use 'anon, authenticated' (anyone can view)
--
-- ============================================================================

-- ============================================================================
-- COMPANIES TABLE - Replace 'public' with 'authenticated'
-- ============================================================================

drop policy if exists "Organizers manage companies" on public.companies;

create policy "Organizers manage companies"
  on public.companies
  for all
  to authenticated  -- ✓ SECURITY FIX: Changed from 'public' to 'authenticated'
  using ((select auth.uid()) = organizer_id)
  with check ((select auth.uid()) = organizer_id);

comment on policy "Organizers manage companies" on public.companies is
  'Organizers can manage their own companies. SECURITY: Requires authentication.';

-- ============================================================================
-- CONTACTS TABLE - Replace 'public' with 'authenticated'
-- ============================================================================

drop policy if exists "Organizers manage contacts" on public.contacts;

create policy "Organizers manage contacts"
  on public.contacts
  for all
  to authenticated  -- ✓ SECURITY FIX: Changed from 'public' to 'authenticated'
  using ((select auth.uid()) = organizer_id)
  with check ((select auth.uid()) = organizer_id);

comment on policy "Organizers manage contacts" on public.contacts is
  'Organizers can manage their own contacts. SECURITY: Requires authentication.';

-- ============================================================================
-- EVENT_SETTINGS TABLE - Fix both policies
-- ============================================================================

-- Management policy: authenticated only
drop policy if exists "Organizers manage event settings" on public.event_settings;

create policy "Organizers manage event settings"
  on public.event_settings
  for all
  to authenticated  -- ✓ SECURITY FIX: Changed from 'public' to 'authenticated'
  using (
    event_id in (
      select id from public.events
      where organizer_id = (select auth.uid())
    )
  )
  with check (
    event_id in (
      select id from public.events
      where organizer_id = (select auth.uid())
    )
  );

comment on policy "Organizers manage event settings" on public.event_settings is
  'Organizers can manage settings for their events. SECURITY: Requires authentication.';

-- Public read policy: anon + authenticated
drop policy if exists "Public view published event settings" on public.event_settings;

create policy "Public view published event settings"
  on public.event_settings
  for select
  to anon, authenticated  -- ✓ SECURITY FIX: Changed from 'public' to 'anon, authenticated'
  using (
    event_id in (
      select id from public.events
      where status = 'published'
    )
  );

comment on policy "Public view published event settings" on public.event_settings is
  'Anyone can view settings for published events. SECURITY: Public read access.';

-- ============================================================================
-- INTERACTIONS TABLE - Replace 'public' with 'authenticated'
-- ============================================================================

drop policy if exists "Organizers manage interactions" on public.interactions;

create policy "Organizers manage interactions"
  on public.interactions
  for all
  to authenticated  -- ✓ SECURITY FIX: Changed from 'public' to 'authenticated'
  using ((select auth.uid()) = organizer_id)
  with check ((select auth.uid()) = organizer_id);

comment on policy "Organizers manage interactions" on public.interactions is
  'Organizers can manage their own CRM interactions. SECURITY: Requires authentication.';

-- ============================================================================
-- ORGANIZERS TABLE - Fix both policies
-- ============================================================================

-- Management policy: authenticated only
drop policy if exists "Organizers manage own profile" on public.organizers;

create policy "Organizers manage own profile"
  on public.organizers
  for all
  to authenticated  -- ✓ SECURITY FIX: Changed from 'public' to 'authenticated'
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

comment on policy "Organizers manage own profile" on public.organizers is
  'Organizers can manage their own organizer profile. SECURITY: Requires authentication.';

-- Public read policy: anon + authenticated
drop policy if exists "Public view verified organizers" on public.organizers;

create policy "Public view verified organizers"
  on public.organizers
  for select
  to anon, authenticated  -- ✓ SECURITY FIX: Changed from 'public' to 'anon, authenticated'
  using (is_verified = true);

comment on policy "Public view verified organizers" on public.organizers is
  'Anyone can view verified organizer profiles. SECURITY: Public read access.';

-- ============================================================================
-- PROMO_CODES TABLE - Fix both policies
-- ============================================================================

-- Management policy: authenticated only
drop policy if exists "Organizers manage event promo codes" on public.promo_codes;

create policy "Organizers manage event promo codes"
  on public.promo_codes
  for all
  to authenticated  -- ✓ SECURITY FIX: Changed from 'public' to 'authenticated'
  using (
    event_id in (
      select id from public.events
      where organizer_id = (select auth.uid())
    )
  )
  with check (
    event_id in (
      select id from public.events
      where organizer_id = (select auth.uid())
    )
  );

comment on policy "Organizers manage event promo codes" on public.promo_codes is
  'Organizers can manage promo codes for their events. SECURITY: Requires authentication.';

-- Public read policy: anon + authenticated
drop policy if exists "Public view active promo codes" on public.promo_codes;

create policy "Public view active promo codes"
  on public.promo_codes
  for select
  to anon, authenticated  -- ✓ SECURITY FIX: Changed from 'public' to 'anon, authenticated'
  using (
    is_active = true
    and (valid_from is null or valid_from <= now())
    and (valid_until is null or valid_until >= now())
  );

comment on policy "Public view active promo codes" on public.promo_codes is
  'Anyone can view active promo codes. SECURITY: Public read access.';

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
--
-- Run this query after migration to verify no policies use 'public' role:
--
-- SELECT
--   tablename,
--   policyname,
--   roles::text as roles,
--   CASE
--     WHEN 'public' = ANY(roles) THEN '❌ Uses public role'
--     WHEN 'authenticated' = ANY(roles) THEN '✓ Management policy'
--     WHEN 'anon' = ANY(roles) THEN '✓ Public read policy'
--     ELSE '⚠ Other role'
--   END as status
-- FROM pg_policies
-- WHERE schemaname = 'public'
--   AND tablename IN (
--     'companies', 'contacts', 'event_settings',
--     'interactions', 'organizers', 'promo_codes'
--   )
-- ORDER BY tablename, policyname;
--
-- Expected: No policies should have status '❌ Uses public role'
--
-- ============================================================================
