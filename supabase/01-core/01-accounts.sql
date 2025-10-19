-- =====================================================
-- EventOS Core Schema: accounts (Multi-tenant Foundation)
-- =====================================================

-- Multi-tenant account management table
-- Root table for all tenant isolation and SaaS architecture
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Account Information
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- URL-friendly identifier
  description TEXT,
  website TEXT,
  logo_url TEXT,
  
  -- Business Details
  industry TEXT,
  company_size TEXT CHECK (company_size IN ('startup', 'small', 'medium', 'large', 'enterprise')),
  annual_revenue_range TEXT,
  employee_count INTEGER,
  
  -- Contact Information
  primary_email TEXT NOT NULL,
  primary_phone TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state_province TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'Canada',
  timezone TEXT DEFAULT 'America/Toronto',
  
  -- Account Configuration
  currency TEXT DEFAULT 'CAD',
  language TEXT DEFAULT 'en',
  date_format TEXT DEFAULT 'MM/DD/YYYY',
  time_format TEXT DEFAULT '12h',
  
  -- Business Metrics
  total_events INTEGER DEFAULT 0,
  total_revenue DECIMAL(15,2) DEFAULT 0,
  total_customers INTEGER DEFAULT 0,
  total_attendees INTEGER DEFAULT 0,
  
  -- Subscription & Billing
  subscription_plan TEXT DEFAULT 'starter' CHECK (subscription_plan IN ('starter', 'professional', 'enterprise')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'trial', 'suspended', 'cancelled')),
  billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'annually')),
  monthly_recurring_revenue DECIMAL(10,2) DEFAULT 0,
  
  -- AI-Powered Insights
  health_score INTEGER DEFAULT 50 CHECK (health_score BETWEEN 0 AND 100),
  engagement_score INTEGER DEFAULT 50 CHECK (engagement_score BETWEEN 0 AND 100),
  churn_risk TEXT DEFAULT 'low' CHECK (churn_risk IN ('low', 'medium', 'high')),
  growth_potential TEXT DEFAULT 'medium' CHECK (growth_potential IN ('low', 'medium', 'high')),
  
  -- Feature Flags
  features JSONB DEFAULT '{}', -- {analytics: true, campaigns: false, api_access: true}
  settings JSONB DEFAULT '{}', -- Account-specific configuration
  
  -- Account Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'archived')),
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_step TEXT DEFAULT 'setup',
  
  -- Ownership & Assignment
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  trial_ends_at TIMESTAMPTZ,
  subscription_ends_at TIMESTAMPTZ
);

-- Enable Row Level Security
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_accounts_slug ON accounts(slug);
CREATE INDEX idx_accounts_status ON accounts(status);
CREATE INDEX idx_accounts_subscription_plan ON accounts(subscription_plan);
CREATE INDEX idx_accounts_owner ON accounts(owner_id);
CREATE INDEX idx_accounts_assigned ON accounts(assigned_to);
CREATE INDEX idx_accounts_health_score ON accounts(health_score);
CREATE INDEX idx_accounts_created_at ON accounts(created_at DESC);
CREATE INDEX idx_accounts_search ON accounts USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Create updated_at trigger
CREATE TRIGGER update_accounts_updated_at
  BEFORE UPDATE ON accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
CREATE POLICY "Accounts are viewable by owners and team members"
  ON accounts FOR SELECT
  USING (
    owner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_users.account_id = accounts.id
      AND account_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Account owners can update their accounts"
  ON accounts FOR UPDATE
  USING (owner_id = auth.uid());

CREATE POLICY "Authenticated users can create accounts"
  ON accounts FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Comments for documentation
COMMENT ON TABLE accounts IS 'Multi-tenant account management for SaaS architecture';
COMMENT ON COLUMN accounts.slug IS 'URL-friendly unique identifier for account';
COMMENT ON COLUMN accounts.health_score IS 'AI-calculated account health score (0-100)';
COMMENT ON COLUMN accounts.engagement_score IS 'AI-calculated engagement score (0-100)';
COMMENT ON COLUMN accounts.features IS 'JSON object containing feature flags for account';
COMMENT ON COLUMN accounts.settings IS 'JSON object containing account-specific configuration';

-- Sample data for development
INSERT INTO accounts (name, slug, primary_email, industry, company_size, subscription_plan) VALUES
('Acme Events Inc', 'acme-events', 'contact@acmeevents.com', 'Technology', 'medium', 'professional'),
('Toronto Business Network', 'toronto-business', 'info@tbn.ca', 'Professional Services', 'small', 'starter'),
('Tech Conference Canada', 'tech-conf-canada', 'hello@techconf.ca', 'Technology', 'large', 'enterprise');
