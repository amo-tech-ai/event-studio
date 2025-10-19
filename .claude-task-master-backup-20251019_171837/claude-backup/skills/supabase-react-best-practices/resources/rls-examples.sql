-- ============================================================================
-- Row Level Security (RLS) Policy Examples for React Apps
-- ============================================================================
-- These policies work with Supabase Auth and the anon/authenticated roles
-- used by React applications
-- ============================================================================

-- ============================================================================
-- PATTERN 1: Public Read, Authenticated Write
-- Use for: Events, blog posts, public content
-- ============================================================================

-- Enable RLS on table
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Anyone can view published events
CREATE POLICY "Public events are viewable by everyone"
  ON events
  FOR SELECT
  USING (visibility = 'public' AND status = 'published');

-- Authenticated users can create events (as organizers)
CREATE POLICY "Authenticated users can create events"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = organizer_id);

-- Users can update their own events
CREATE POLICY "Users can update their own events"
  ON events
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = organizer_id)
  WITH CHECK (auth.uid() = organizer_id);

-- Users can delete their own events
CREATE POLICY "Users can delete their own events"
  ON events
  FOR DELETE
  TO authenticated
  USING (auth.uid() = organizer_id);

-- ============================================================================
-- PATTERN 2: Private User Data
-- Use for: Profiles, user settings, personal data
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can only view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- PATTERN 3: Relational Access (FK-based)
-- Use for: Orders, tickets, bookings
-- ============================================================================

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Users can view their own orders
CREATE POLICY "Users can view their own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can create orders for themselves
CREATE POLICY "Users can create orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Event organizers can view all orders for their events
CREATE POLICY "Organizers can view orders for their events"
  ON orders
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = orders.event_id
      AND events.organizer_id = auth.uid()
    )
  );

-- ============================================================================
-- PATTERN 4: Anonymous Read Access (Dashboard Stats)
-- Use for: Public dashboards, metrics
-- ============================================================================

-- Allow anonymous users to count events (for dashboard)
CREATE POLICY "Anyone can count published events"
  ON events
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

-- Allow counting orders (anonymized)
CREATE POLICY "Public dashboard counts"
  ON orders
  FOR SELECT
  TO anon, authenticated
  USING (true); -- Anyone can count, but RLS on events/tickets limits what they see

-- ============================================================================
-- PATTERN 5: Team/Organization Access
-- Use for: Multi-tenant apps
-- ============================================================================

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Users can view companies they're members of
CREATE POLICY "Users can view their companies"
  ON companies
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM company_members
      WHERE company_members.company_id = companies.id
      AND company_members.user_id = auth.uid()
    )
  );

-- Only company admins can update
CREATE POLICY "Admins can update companies"
  ON companies
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM company_members
      WHERE company_members.company_id = companies.id
      AND company_members.user_id = auth.uid()
      AND company_members.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM company_members
      WHERE company_members.company_id = companies.id
      AND company_members.user_id = auth.uid()
      AND company_members.role = 'admin'
    )
  );

-- ============================================================================
-- PATTERN 6: Time-Based Access
-- Use for: Scheduled content, embargoes
-- ============================================================================

-- Events visible only after publication date
CREATE POLICY "Events visible after publish date"
  ON events
  FOR SELECT
  USING (
    status = 'published'
    AND publish_at <= NOW()
  );

-- Early access for organizers
CREATE POLICY "Organizers can view unpublished events"
  ON events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = organizer_id);

-- ============================================================================
-- PATTERN 7: Role-Based Access Control (RBAC)
-- Use for: Admin panels, moderation
-- ============================================================================

-- Function to check user role
CREATE OR REPLACE FUNCTION auth.user_has_role(role_name TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = role_name
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- Admins can view all events
CREATE POLICY "Admins can view all events"
  ON events
  FOR SELECT
  TO authenticated
  USING (auth.user_has_role('admin'));

-- Admins can update any event
CREATE POLICY "Admins can update any event"
  ON events
  FOR UPDATE
  TO authenticated
  USING (auth.user_has_role('admin'))
  WITH CHECK (auth.user_has_role('admin'));

-- ============================================================================
-- PATTERN 8: Conditional Write Access
-- Use for: Approval workflows, status transitions
-- ============================================================================

-- Users can only update events that are in draft
CREATE POLICY "Users can edit draft events"
  ON events
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = organizer_id
    AND status = 'draft'
  );

-- Published events can only be edited by admins
CREATE POLICY "Admins can edit published events"
  ON events
  FOR UPDATE
  TO authenticated
  USING (
    status = 'published'
    AND auth.user_has_role('admin')
  );

-- ============================================================================
-- PATTERN 9: Cascading Permissions (Parent-Child)
-- Use for: Nested resources
-- ============================================================================

ALTER TABLE ticket_tiers ENABLE ROW LEVEL SECURITY;

-- Anyone can view tiers for public events
CREATE POLICY "Public can view tiers for public events"
  ON ticket_tiers
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = ticket_tiers.event_id
      AND events.visibility = 'public'
      AND events.status = 'published'
    )
  );

-- Event organizers can manage tiers
CREATE POLICY "Organizers can manage event tiers"
  ON ticket_tiers
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = ticket_tiers.event_id
      AND events.organizer_id = auth.uid()
    )
  );

-- ============================================================================
-- PATTERN 10: Soft Delete with RLS
-- Use for: Trash/recycle bin functionality
-- ============================================================================

-- Only show non-deleted records
CREATE POLICY "Hide deleted events"
  ON events
  FOR SELECT
  USING (deleted_at IS NULL);

-- Users can "delete" (soft delete) their own events
CREATE POLICY "Users can soft delete own events"
  ON events
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = organizer_id
    AND deleted_at IS NULL
  )
  WITH CHECK (
    auth.uid() = organizer_id
  );

-- ============================================================================
-- TESTING RLS POLICIES
-- ============================================================================

-- Test as anonymous user
BEGIN;
  SET request.jwt.claims TO '{"sub": null, "role": "anon"}';
  SELECT * FROM events; -- Should only see published public events
ROLLBACK;

-- Test as authenticated user
BEGIN;
  SET request.jwt.claims TO '{"sub": "user-uuid-here", "role": "authenticated"}';
  SELECT * FROM events; -- Should see public + their own events
ROLLBACK;

-- Test as admin
BEGIN;
  SET request.jwt.claims TO '{"sub": "admin-uuid-here", "role": "authenticated"}';
  SELECT * FROM events; -- Should see all events (if admin policy exists)
ROLLBACK;

-- ============================================================================
-- COMMON RLS FUNCTIONS
-- ============================================================================

-- Check if user owns resource
CREATE OR REPLACE FUNCTION auth.owns_resource(table_name TEXT, resource_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  owner_id UUID;
BEGIN
  EXECUTE format('SELECT user_id FROM %I WHERE id = $1', table_name)
  INTO owner_id
  USING resource_id;

  RETURN owner_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is member of organization
CREATE OR REPLACE FUNCTION auth.is_org_member(org_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM organization_members
    WHERE organization_id = org_id
    AND user_id = auth.uid()
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- ============================================================================
-- PERFORMANCE TIPS
-- ============================================================================

-- Add indexes for RLS lookups
CREATE INDEX idx_events_organizer ON events(organizer_id);
CREATE INDEX idx_events_status_visibility ON events(status, visibility);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_company_members_user ON company_members(user_id);

-- Use SECURITY DEFINER functions sparingly (they bypass RLS)
-- Always validate inputs in SECURITY DEFINER functions
