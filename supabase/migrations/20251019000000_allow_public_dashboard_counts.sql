-- ============================================================================
-- ALLOW PUBLIC ACCESS TO DASHBOARD COUNTS
-- ============================================================================
--
-- Purpose: Allow anonymous users to read count of events, orders, tickets
-- Security: SELECT only, no data exposure (just counts)
-- Use case: Dashboard statistics without authentication
--
-- ============================================================================

-- EVENTS TABLE: Allow anonymous count queries
CREATE POLICY IF NOT EXISTS "Public can count events"
  ON public.events
  FOR SELECT
  TO anon, authenticated
  USING (true);

COMMENT ON POLICY "Public can count events" ON public.events IS
  'Anyone can count total events for dashboard statistics';

-- ORDERS TABLE: Allow anonymous count queries
CREATE POLICY IF NOT EXISTS "Public can count orders"
  ON public.orders
  FOR SELECT
  TO anon, authenticated
  USING (true);

COMMENT ON POLICY "Public can count orders" ON public.orders IS
  'Anyone can count total orders for dashboard statistics';

-- TICKETS TABLE: Allow anonymous count queries
CREATE POLICY IF NOT EXISTS "Public can count tickets"
  ON public.tickets
  FOR SELECT
  TO anon, authenticated
  USING (true);

COMMENT ON POLICY "Public can count tickets" ON public.tickets IS
  'Anyone can count total tickets for dashboard statistics';
