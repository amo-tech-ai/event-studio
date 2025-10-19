-- ============================================================================
-- FIX DASHBOARD COUNTS SECURITY VULNERABILITY (BEST PRACTICES VERSION)
-- ============================================================================
--
-- purpose: fix critical rls vulnerability in dashboard counts
-- previous migration (20251019000000) granted full select access with using (true)
-- this migration reverts those policies and creates a secure function instead
--
-- security issue: using (true) allows reading all columns and rows, not just counts
-- fix: use security definer function that only returns aggregated counts
--
-- rationale for security definer:
-- - function must bypass rls to count all records (not just user's records)
-- - only returns aggregated data (no individual record access)
-- - prevents anonymous users from querying sensitive fields
--
-- ============================================================================

-- step 1: drop the insecure policies
drop policy if exists "Public can count events" on public.events;
drop policy if exists "Public can count orders" on public.orders;
drop policy if exists "Public can count tickets" on public.tickets;

-- step 2: create secure security definer function for dashboard stats
-- note: using security definer to bypass rls and count all records
-- note: search_path = '' for security (prevents schema injection)
-- note: all table references are fully qualified (public.table_name)
create or replace function public.get_dashboard_stats()
returns json
security definer
set search_path = ''
language plpgsql
stable
as $$
declare
  total_events_count integer;
  total_orders_count integer;
  total_tickets_count integer;
begin
  -- count only published events (fully qualified name: public.events)
  select count(*) into total_events_count
  from public.events
  where status = 'published';

  -- count all orders (fully qualified name: public.orders)
  select count(*) into total_orders_count
  from public.orders;

  -- count all tickets (fully qualified name: public.tickets)
  select count(*) into total_tickets_count
  from public.tickets;

  -- return as json object
  return json_build_object(
    'total_events', total_events_count,
    'total_orders', total_orders_count,
    'total_tickets', total_tickets_count
  );
end;
$$;

-- step 3: grant execute permission to anon and authenticated roles
grant execute on function public.get_dashboard_stats() to anon, authenticated;

-- step 4: add helpful comments
comment on function public.get_dashboard_stats() is
  'secure function to retrieve dashboard statistics. returns only aggregated counts, no individual record access. uses security definer to bypass rls for counting all records.';

-- ============================================================================
-- verification
-- ============================================================================
--
-- test as anonymous user:
-- select * from public.get_dashboard_stats();
--
-- expected result: {"total_events": n, "total_orders": m, "total_tickets": p}
--
-- verify no direct table access:
-- select * from public.events; -- should fail with rls error
-- select * from public.orders; -- should fail with rls error
-- select * from public.tickets; -- should fail with rls error
--
-- ============================================================================
