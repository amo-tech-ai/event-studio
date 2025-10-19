-- =====================================================
-- EventOS Core Schema: account_users (Team Management)
-- =====================================================

-- Account users junction table for multi-tenant team management
-- Manages user roles and permissions within accounts
CREATE TABLE account_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Role & Permissions
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN (
    'owner', 'admin', 'manager', 'member', 'viewer'
  )),
  permissions JSONB DEFAULT '{}', -- Granular permissions object
  
  -- Team Assignment
  department TEXT,
  team TEXT,
  manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Status & Access
  status TEXT DEFAULT 'active' CHECK (status IN (
    'active', 'inactive', 'pending', 'suspended', 'archived'
  )),
  access_level TEXT DEFAULT 'standard' CHECK (access_level IN (
    'standard', 'premium', 'enterprise'
  )),
  
  -- Invitation & Onboarding
  invited_by UUID REFERENCES users(id) ON DELETE SET NULL,
  invited_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ,
  
  -- User Preferences
  notification_preferences JSONB DEFAULT '{}',
  dashboard_preferences JSONB DEFAULT '{}',
  timezone TEXT DEFAULT 'America/Toronto',
  language TEXT DEFAULT 'en',
  
  -- Activity Tracking
  total_activities INTEGER DEFAULT 0,
  last_activity_at TIMESTAMPTZ,
  activity_score INTEGER DEFAULT 0, -- 0-100 activity score
  
  -- Performance Metrics
  events_created INTEGER DEFAULT 0,
  contacts_managed INTEGER DEFAULT 0,
  revenue_generated DECIMAL(12,2) DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT unique_account_user UNIQUE (account_id, user_id),
  CONSTRAINT valid_activity_score CHECK (activity_score BETWEEN 0 AND 100),
  CONSTRAINT valid_revenue_generated CHECK (revenue_generated >= 0)
);

-- Enable Row Level Security
ALTER TABLE account_users ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_account_users_account ON account_users(account_id);
CREATE INDEX idx_account_users_user ON account_users(user_id);
CREATE INDEX idx_account_users_role ON account_users(role);
CREATE INDEX idx_account_users_status ON account_users(status);
CREATE INDEX idx_account_users_manager ON account_users(manager_id);
CREATE INDEX idx_account_users_invited_by ON account_users(invited_by);
CREATE INDEX idx_account_users_last_login ON account_users(last_login_at);
CREATE INDEX idx_account_users_last_activity ON account_users(last_activity_at);
CREATE INDEX idx_account_users_activity_score ON account_users(activity_score);
CREATE INDEX idx_account_users_revenue ON account_users(revenue_generated);

-- Create updated_at trigger
CREATE TRIGGER update_account_users_updated_at
  BEFORE UPDATE ON account_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically set accepted_at when status changes to active
CREATE OR REPLACE FUNCTION set_account_user_accepted_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'active' AND OLD.status != 'active' AND NEW.accepted_at IS NULL THEN
    NEW.accepted_at := NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_account_user_accepted_at_trigger
  BEFORE UPDATE ON account_users
  FOR EACH ROW
  EXECUTE FUNCTION set_account_user_accepted_at();

-- Function to update activity score based on user activities
CREATE OR REPLACE FUNCTION update_account_user_activity_score()
RETURNS TRIGGER AS $$
BEGIN
  -- Update activity score based on various factors
  NEW.activity_score := GREATEST(0, LEAST(100, 
    CASE 
      WHEN NEW.total_activities > 100 THEN 40
      WHEN NEW.total_activities > 50 THEN 30
      WHEN NEW.total_activities > 20 THEN 20
      WHEN NEW.total_activities > 5 THEN 10
      ELSE 0
    END +
    CASE 
      WHEN NEW.events_created > 10 THEN 30
      WHEN NEW.events_created > 5 THEN 20
      WHEN NEW.events_created > 1 THEN 10
      ELSE 0
    END +
    CASE 
      WHEN NEW.contacts_managed > 100 THEN 20
      WHEN NEW.contacts_managed > 50 THEN 15
      WHEN NEW.contacts_managed > 20 THEN 10
      WHEN NEW.contacts_managed > 5 THEN 5
      ELSE 0
    END +
    CASE 
      WHEN NEW.last_activity_at > NOW() - INTERVAL '7 days' THEN 10
      WHEN NEW.last_activity_at > NOW() - INTERVAL '30 days' THEN 5
      ELSE 0
    END
  ));
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_account_user_activity_score_trigger
  BEFORE UPDATE ON account_users
  FOR EACH ROW
  EXECUTE FUNCTION update_account_user_activity_score();

-- RLS Policies
CREATE POLICY "Account users can view their own account memberships"
  ON account_users FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM account_users au
      WHERE au.account_id = account_users.account_id
      AND au.user_id = auth.uid()
      AND au.status = 'active'
    )
  );

CREATE POLICY "Account owners and admins can manage account users"
  ON account_users FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM account_users au
      WHERE au.account_id = account_users.account_id
      AND au.user_id = auth.uid()
      AND au.status = 'active'
      AND au.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Account owners and admins can update account users"
  ON account_users FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM account_users au
      WHERE au.account_id = account_users.account_id
      AND au.user_id = auth.uid()
      AND au.status = 'active'
      AND au.role IN ('owner', 'admin')
    )
  );

-- Comments for documentation
COMMENT ON TABLE account_users IS 'Multi-tenant team management and user roles within accounts';
COMMENT ON COLUMN account_users.permissions IS 'JSON object containing granular permissions';
COMMENT ON COLUMN account_users.notification_preferences IS 'JSON object containing user notification preferences';
COMMENT ON COLUMN account_users.dashboard_preferences IS 'JSON object containing user dashboard customization';

-- Sample data for development
INSERT INTO account_users (
  account_id, user_id, role, status, invited_by, accepted_at, created_at
) VALUES
(
  (SELECT id FROM accounts WHERE slug = 'acme-events'),
  '11111111-1111-1111-1111-111111111111',
  'owner',
  'active',
  NULL,
  NOW(),
  NOW()
),
(
  (SELECT id FROM accounts WHERE slug = 'acme-events'),
  '22222222-2222-2222-2222-222222222222',
  'admin',
  'active',
  '11111111-1111-1111-1111-111111111111',
  NOW(),
  NOW()
),
(
  (SELECT id FROM accounts WHERE slug = 'toronto-business'),
  '33333333-3333-3333-3333-333333333333',
  'manager',
  'active',
  '44444444-4444-4444-4444-444444444444',
  NOW(),
  NOW()
);
