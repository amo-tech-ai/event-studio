-- ============================================================================
-- CLEANUP: Remove old RLS policies with incorrect 'public' role
-- ============================================================================
--
-- Issue: Old policies with different names still exist using 'public' role
-- This migration removes the old policies to prevent conflicts
--
-- ============================================================================

-- Remove old companies policies
drop policy if exists "Organizers manage their own companies" on public.companies;

-- Remove old contacts policies
drop policy if exists "Organizers manage their own contacts" on public.contacts;

-- Remove old event_settings policies
drop policy if exists "Organizers manage their event settings" on public.event_settings;
drop policy if exists "Public can view settings for published events" on public.event_settings;

-- Remove old interactions policies
drop policy if exists "Organizers manage their own interactions" on public.interactions;

-- Remove old organizers policies
drop policy if exists "Organizers manage their own profile" on public.organizers;
drop policy if exists "Public can view verified organizers" on public.organizers;

-- Remove old promo_codes policies
drop policy if exists "Organizers manage their event promo codes" on public.promo_codes;
drop policy if exists "Public can view active promo codes for validation" on public.promo_codes;

-- ============================================================================
-- VERIFICATION QUERY
-- ============================================================================
--
-- Run this to verify only new policies exist:
--
-- SELECT
--   tablename,
--   policyname,
--   roles::text,
--   CASE WHEN 'public' = ANY(roles) THEN '❌ BAD' ELSE '✓ GOOD' END
-- FROM pg_policies
-- WHERE schemaname = 'public'
--   AND tablename IN ('companies', 'contacts', 'event_settings',
--                     'interactions', 'organizers', 'promo_codes')
-- ORDER BY tablename, policyname;
--
-- Expected: All rows should show '✓ GOOD'
--
-- ============================================================================
