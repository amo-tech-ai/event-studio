-- =====================================================
-- EventOS Core Schema: integrations (Third-party Integrations)
-- =====================================================

-- Integrations table for managing third-party service connections
-- Handles API keys, webhooks, and external service configurations
CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  
  -- Integration Information
  name TEXT NOT NULL,
  slug TEXT NOT NULL, -- URL-friendly identifier
  description TEXT,
  integration_type TEXT NOT NULL CHECK (integration_type IN (
    'payment', 'email', 'sms', 'calendar', 'crm', 'analytics', 'social_media',
    'video_conferencing', 'survey', 'form_builder', 'webhook', 'api', 'other'
  )),
  service_provider TEXT NOT NULL, -- e.g., 'stripe', 'mailchimp', 'zoom'
  
  -- Integration Status
  status TEXT DEFAULT 'inactive' CHECK (status IN (
    'active', 'inactive', 'error', 'pending_setup', 'suspended'
  )),
  is_enabled BOOLEAN DEFAULT false,
  is_primary BOOLEAN DEFAULT false, -- Primary integration for this type
  
  -- Configuration
  configuration JSONB DEFAULT '{}', -- Integration-specific configuration
  credentials JSONB DEFAULT '{}', -- Encrypted credentials and API keys
  webhook_url TEXT,
  webhook_secret TEXT,
  
  -- API & Authentication
  api_endpoint TEXT,
  api_version TEXT,
  authentication_type TEXT CHECK (authentication_type IN (
    'api_key', 'oauth2', 'bearer_token', 'basic_auth', 'custom'
  )),
  rate_limit_per_minute INTEGER,
  rate_limit_per_hour INTEGER,
  
  -- Usage & Limits
  usage_count INTEGER DEFAULT 0,
  usage_limit INTEGER,
  usage_reset_date TIMESTAMPTZ,
  last_used_at TIMESTAMPTZ,
  
  -- Error Handling
  last_error TEXT,
  last_error_at TIMESTAMPTZ,
  error_count INTEGER DEFAULT 0,
  consecutive_errors INTEGER DEFAULT 0,
  
  -- Sync & Data
  last_sync_at TIMESTAMPTZ,
  sync_frequency TEXT DEFAULT 'manual' CHECK (sync_frequency IN (
    'manual', 'realtime', 'hourly', 'daily', 'weekly', 'monthly'
  )),
  sync_status TEXT DEFAULT 'idle' CHECK (sync_status IN (
    'idle', 'syncing', 'success', 'error', 'paused'
  )),
  
  -- Integration Settings
  settings JSONB DEFAULT '{}', -- Additional integration settings
  custom_fields JSONB DEFAULT '{}', -- Custom fields for integration
  
  -- Assignment & Management
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  created_by UUID NOT NULL REFERENCES users(id),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT unique_account_integration_slug UNIQUE (account_id, slug),
  CONSTRAINT unique_primary_integration CHECK (
    (is_primary = true AND integration_type IS NOT NULL) OR is_primary = false
  ),
  CONSTRAINT valid_usage_count CHECK (usage_count >= 0),
  CONSTRAINT valid_error_count CHECK (error_count >= 0)
);

-- Enable Row Level Security
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_integrations_account ON integrations(account_id);
CREATE INDEX idx_integrations_slug ON integrations(slug);
CREATE INDEX idx_integrations_type ON integrations(integration_type);
CREATE INDEX idx_integrations_service_provider ON integrations(service_provider);
CREATE INDEX idx_integrations_status ON integrations(status);
CREATE INDEX idx_integrations_enabled ON integrations(is_enabled);
CREATE INDEX idx_integrations_primary ON integrations(is_primary);
CREATE INDEX idx_integrations_created_by ON integrations(created_by);
CREATE INDEX idx_integrations_assigned_to ON integrations(assigned_to);
CREATE INDEX idx_integrations_last_sync ON integrations(last_sync_at);
CREATE INDEX idx_integrations_search ON integrations USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Create updated_at trigger
CREATE TRIGGER update_integrations_updated_at
  BEFORE UPDATE ON integrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically set slug from name
CREATE OR REPLACE FUNCTION set_integration_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := lower(regexp_replace(
      regexp_replace(NEW.name, '[^a-zA-Z0-9\s]', '', 'g'), 
      '\s+', '-', 'g'
    ));
    
    -- Ensure uniqueness within account
    WHILE EXISTS (
      SELECT 1 FROM integrations 
      WHERE integrations.slug = NEW.slug 
      AND integrations.account_id = NEW.account_id 
      AND integrations.id != NEW.id
    ) LOOP
      NEW.slug := NEW.slug || '-' || extract(epoch from now())::text;
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_integration_slug_trigger
  BEFORE INSERT OR UPDATE ON integrations
  FOR EACH ROW
  EXECUTE FUNCTION set_integration_slug();

-- Function to handle integration errors
CREATE OR REPLACE FUNCTION handle_integration_error()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.last_error IS NOT NULL AND NEW.last_error != OLD.last_error THEN
    NEW.last_error_at := NOW();
    NEW.error_count := NEW.error_count + 1;
    NEW.consecutive_errors := NEW.consecutive_errors + 1;
    
    -- Suspend integration if too many consecutive errors
    IF NEW.consecutive_errors >= 5 THEN
      NEW.status := 'suspended';
      NEW.is_enabled := false;
    END IF;
  ELSIF NEW.last_error IS NULL AND OLD.last_error IS NOT NULL THEN
    -- Reset error count on successful operation
    NEW.consecutive_errors := 0;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_integration_error_trigger
  BEFORE UPDATE ON integrations
  FOR EACH ROW
  EXECUTE FUNCTION handle_integration_error();

-- RLS Policies
CREATE POLICY "Integrations are viewable by account members"
  ON integrations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_users.account_id = integrations.account_id
      AND account_users.user_id = auth.uid()
      AND account_users.status = 'active'
    )
  );

CREATE POLICY "Account members can create integrations"
  ON integrations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_users.account_id = integrations.account_id
      AND account_users.user_id = auth.uid()
      AND account_users.status = 'active'
      AND account_users.role IN ('owner', 'admin', 'manager')
    )
  );

CREATE POLICY "Integration creators and managers can update integrations"
  ON integrations FOR UPDATE
  USING (
    created_by = auth.uid() OR
    assigned_to = auth.uid() OR
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_users.account_id = integrations.account_id
      AND account_users.user_id = auth.uid()
      AND account_users.status = 'active'
      AND account_users.role IN ('owner', 'admin', 'manager')
    )
  );

-- Comments for documentation
COMMENT ON TABLE integrations IS 'Third-party service integrations and API connections';
COMMENT ON COLUMN integrations.configuration IS 'JSON object containing integration-specific configuration';
COMMENT ON COLUMN integrations.credentials IS 'Encrypted JSON object containing API keys and credentials';
COMMENT ON COLUMN integrations.settings IS 'JSON object for additional integration settings';

-- Sample data for development
INSERT INTO integrations (
  account_id, name, slug, description, integration_type, service_provider,
  status, is_enabled, is_primary, created_by
) VALUES
(
  (SELECT id FROM accounts WHERE slug = 'acme-events'),
  'Stripe Payment Processing',
  'stripe-payment-processing',
  'Primary payment processing integration for ticket sales',
  'payment',
  'stripe',
  'active',
  true,
  true,
  '11111111-1111-1111-1111-111111111111'
),
(
  (SELECT id FROM accounts WHERE slug = 'acme-events'),
  'Mailchimp Email Marketing',
  'mailchimp-email-marketing',
  'Email marketing and newsletter integration',
  'email',
  'mailchimp',
  'active',
  true,
  true,
  '22222222-2222-2222-2222-222222222222'
),
(
  (SELECT id FROM accounts WHERE slug = 'acme-events'),
  'Zoom Video Conferencing',
  'zoom-video-conferencing',
  'Virtual event and meeting integration',
  'video_conferencing',
  'zoom',
  'inactive',
  false,
  false,
  '11111111-1111-1111-1111-111111111111'
);
