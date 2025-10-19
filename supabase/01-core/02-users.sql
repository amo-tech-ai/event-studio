-- =====================================================
-- EventOS Core Schema: users (User Management)
-- =====================================================

-- User management table extending Supabase auth.users
-- Handles user profiles, preferences, and team management
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Profile Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  display_name TEXT, -- Computed from first_name + last_name
  avatar_url TEXT,
  bio TEXT,
  job_title TEXT,
  department TEXT,
  
  -- Contact Information
  email TEXT UNIQUE NOT NULL, -- Mirrors auth.users.email
  phone TEXT,
  mobile TEXT,
  timezone TEXT DEFAULT 'America/Toronto',
  language TEXT DEFAULT 'en',
  
  -- User Preferences
  email_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  push_notifications BOOLEAN DEFAULT true,
  marketing_emails BOOLEAN DEFAULT false,
  
  -- UI Preferences
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'auto')),
  dashboard_layout JSONB DEFAULT '{}',
  notification_preferences JSONB DEFAULT '{}',
  
  -- User Status & Permissions
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'pending')),
  role TEXT DEFAULT 'user' CHECK (role IN ('super_admin', 'admin', 'manager', 'user', 'viewer')),
  permissions JSONB DEFAULT '{}', -- Granular permissions override
  
  -- Account Management
  current_account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  default_account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  
  -- Authentication & Security
  last_login_at TIMESTAMPTZ,
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMPTZ,
  two_factor_enabled BOOLEAN DEFAULT false,
  two_factor_secret TEXT,
  
  -- Onboarding & Training
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_step TEXT DEFAULT 'profile',
  training_completed BOOLEAN DEFAULT false,
  help_tooltips_enabled BOOLEAN DEFAULT true,
  
  -- Usage Analytics
  total_logins INTEGER DEFAULT 0,
  total_events_created INTEGER DEFAULT 0,
  total_campaigns_sent INTEGER DEFAULT 0,
  last_feature_used TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  profile_updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_current_account ON users(current_account_id);
CREATE INDEX idx_users_last_activity ON users(last_activity_at DESC);
CREATE INDEX idx_users_search ON users USING gin(to_tsvector('english', first_name || ' ' || last_name || ' ' || COALESCE(job_title, '')));
CREATE INDEX idx_users_display_name ON users(display_name);

-- Create updated_at trigger
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically set display_name
CREATE OR REPLACE FUNCTION set_user_display_name()
RETURNS TRIGGER AS $$
BEGIN
  NEW.display_name := TRIM(NEW.first_name || ' ' || NEW.last_name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_user_display_name_trigger
  BEFORE INSERT OR UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION set_user_display_name();

-- RLS Policies
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Account members can view team users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_users.account_id = users.current_account_id
      AND account_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all users"
  ON users FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users AS admin_user
      WHERE admin_user.id = auth.uid()
      AND admin_user.role IN ('super_admin', 'admin')
    )
  );

-- Account Users Junction Table
-- Manages many-to-many relationship between users and accounts
CREATE TABLE account_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Role within this account
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'manager', 'member', 'viewer')),
  permissions JSONB DEFAULT '{}', -- Account-specific permissions
  
  -- Invitation Management
  invited_by UUID REFERENCES users(id) ON DELETE SET NULL,
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  invitation_token TEXT,
  invitation_expires_at TIMESTAMPTZ,
  
  -- Access Control
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended', 'removed')),
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure unique user-account combinations
  UNIQUE(account_id, user_id)
);

-- Enable RLS for account_users
ALTER TABLE account_users ENABLE ROW LEVEL SECURITY;

-- Indexes for account_users
CREATE INDEX idx_account_users_account ON account_users(account_id);
CREATE INDEX idx_account_users_user ON account_users(user_id);
CREATE INDEX idx_account_users_role ON account_users(role);
CREATE INDEX idx_account_users_status ON account_users(status);

-- RLS Policies for account_users
CREATE POLICY "Users can view their account memberships"
  ON account_users FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Account owners can manage memberships"
  ON account_users FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM account_users AS owner_check
      WHERE owner_check.account_id = account_users.account_id
      AND owner_check.user_id = auth.uid()
      AND owner_check.role = 'owner'
    )
  );

-- Comments for documentation
COMMENT ON TABLE users IS 'Extended user profiles beyond Supabase auth.users';
COMMENT ON TABLE account_users IS 'Many-to-many relationship between users and accounts with roles';
COMMENT ON COLUMN users.permissions IS 'Granular permissions override for specific user';
COMMENT ON COLUMN account_users.permissions IS 'Account-specific permissions for user';

-- Sample data for development
INSERT INTO users (id, first_name, last_name, email, role, current_account_id) VALUES
('11111111-1111-1111-1111-111111111111', 'John', 'Smith', 'john@acmeevents.com', 'admin', 
 (SELECT id FROM accounts WHERE slug = 'acme-events')),
('22222222-2222-2222-2222-222222222222', 'Sarah', 'Johnson', 'sarah@tbn.ca', 'manager',
 (SELECT id FROM accounts WHERE slug = 'toronto-business')),
('33333333-3333-3333-3333-333333333333', 'Mike', 'Chen', 'mike@techconf.ca', 'owner',
 (SELECT id FROM accounts WHERE slug = 'tech-conf-canada'));
