-- =====================================================
-- EventOS Core Schema: campaigns (Marketing Campaigns)
-- =====================================================

-- Marketing campaigns table for event promotion and CRM outreach
-- Manages email campaigns, social media campaigns, and event marketing
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL, -- Optional link to specific event
  
  -- Campaign Information
  name TEXT NOT NULL,
  slug TEXT NOT NULL, -- URL-friendly identifier
  description TEXT,
  campaign_type TEXT NOT NULL CHECK (campaign_type IN (
    'email', 'social_media', 'event_promotion', 'lead_generation', 'nurture',
    'retargeting', 'announcement', 'reminder', 'follow_up', 'survey'
  )),
  
  -- Campaign Status & Timeline
  status TEXT DEFAULT 'draft' CHECK (status IN (
    'draft', 'scheduled', 'active', 'paused', 'completed', 'cancelled'
  )),
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  scheduled_send_date TIMESTAMPTZ,
  
  -- Campaign Content
  subject_line TEXT, -- For email campaigns
  content TEXT, -- Main campaign content
  content_type TEXT DEFAULT 'html' CHECK (content_type IN ('html', 'text', 'markdown')),
  call_to_action TEXT,
  landing_page_url TEXT,
  
  -- Target Audience
  target_segments TEXT[], -- Array of segment names
  target_criteria JSONB DEFAULT '{}', -- JSON object with targeting criteria
  audience_size INTEGER DEFAULT 0,
  
  -- Campaign Settings
  campaign_settings JSONB DEFAULT '{}', -- Additional campaign configuration
  automation_rules JSONB DEFAULT '{}', -- Automation and trigger rules
  
  -- Performance Metrics
  total_sent INTEGER DEFAULT 0,
  total_delivered INTEGER DEFAULT 0,
  total_opened INTEGER DEFAULT 0,
  total_clicked INTEGER DEFAULT 0,
  total_converted INTEGER DEFAULT 0,
  total_unsubscribed INTEGER DEFAULT 0,
  total_bounced INTEGER DEFAULT 0,
  
  -- Calculated Metrics
  delivery_rate DECIMAL(5,4) GENERATED ALWAYS AS (
    CASE WHEN total_sent > 0 THEN total_delivered::decimal / total_sent ELSE 0 END
  ) STORED,
  open_rate DECIMAL(5,4) GENERATED ALWAYS AS (
    CASE WHEN total_delivered > 0 THEN total_opened::decimal / total_delivered ELSE 0 END
  ) STORED,
  click_rate DECIMAL(5,4) GENERATED ALWAYS AS (
    CASE WHEN total_delivered > 0 THEN total_clicked::decimal / total_delivered ELSE 0 END
  ) STORED,
  conversion_rate DECIMAL(5,4) GENERATED ALWAYS AS (
    CASE WHEN total_clicked > 0 THEN total_converted::decimal / total_clicked ELSE 0 END
  ) STORED,
  
  -- Revenue Tracking
  revenue_generated DECIMAL(12,2) DEFAULT 0,
  cost_per_acquisition DECIMAL(10,2) DEFAULT 0,
  return_on_investment DECIMAL(5,4) DEFAULT 0,
  
  -- Assignment & Management
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  created_by UUID NOT NULL REFERENCES users(id),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT unique_account_campaign_slug UNIQUE (account_id, slug),
  CONSTRAINT valid_campaign_dates CHECK (
    start_date IS NULL OR end_date IS NULL OR start_date <= end_date
  ),
  CONSTRAINT valid_metrics CHECK (
    total_sent >= 0 AND total_delivered >= 0 AND total_opened >= 0 AND
    total_clicked >= 0 AND total_converted >= 0 AND total_unsubscribed >= 0 AND
    total_bounced >= 0
  )
);

-- Enable Row Level Security
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_campaigns_account ON campaigns(account_id);
CREATE INDEX idx_campaigns_event ON campaigns(event_id);
CREATE INDEX idx_campaigns_slug ON campaigns(slug);
CREATE INDEX idx_campaigns_type ON campaigns(campaign_type);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_start_date ON campaigns(start_date);
CREATE INDEX idx_campaigns_end_date ON campaigns(end_date);
CREATE INDEX idx_campaigns_scheduled_send ON campaigns(scheduled_send_date);
CREATE INDEX idx_campaigns_created_by ON campaigns(created_by);
CREATE INDEX idx_campaigns_assigned_to ON campaigns(assigned_to);
CREATE INDEX idx_campaigns_search ON campaigns USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));
CREATE INDEX idx_campaigns_target_segments ON campaigns USING gin(target_segments);

-- Create updated_at trigger
CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically set slug from name
CREATE OR REPLACE FUNCTION set_campaign_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := lower(regexp_replace(
      regexp_replace(NEW.name, '[^a-zA-Z0-9\s]', '', 'g'), 
      '\s+', '-', 'g'
    ));
    
    -- Ensure uniqueness within account
    WHILE EXISTS (
      SELECT 1 FROM campaigns 
      WHERE campaigns.slug = NEW.slug 
      AND campaigns.account_id = NEW.account_id 
      AND campaigns.id != NEW.id
    ) LOOP
      NEW.slug := NEW.slug || '-' || extract(epoch from now())::text;
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_campaign_slug_trigger
  BEFORE INSERT OR UPDATE ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION set_campaign_slug();

-- RLS Policies
CREATE POLICY "Campaigns are viewable by account members"
  ON campaigns FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_users.account_id = campaigns.account_id
      AND account_users.user_id = auth.uid()
      AND account_users.status = 'active'
    )
  );

CREATE POLICY "Account members can create campaigns"
  ON campaigns FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_users.account_id = campaigns.account_id
      AND account_users.user_id = auth.uid()
      AND account_users.status = 'active'
      AND account_users.role IN ('owner', 'admin', 'manager')
    )
  );

CREATE POLICY "Campaign creators and managers can update campaigns"
  ON campaigns FOR UPDATE
  USING (
    created_by = auth.uid() OR
    assigned_to = auth.uid() OR
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_users.account_id = campaigns.account_id
      AND account_users.user_id = auth.uid()
      AND account_users.status = 'active'
      AND account_users.role IN ('owner', 'admin', 'manager')
    )
  );

-- Comments for documentation
COMMENT ON TABLE campaigns IS 'Marketing campaigns for event promotion and CRM outreach';
COMMENT ON COLUMN campaigns.target_criteria IS 'JSON object containing audience targeting criteria';
COMMENT ON COLUMN campaigns.campaign_settings IS 'JSON object for campaign-specific configuration';
COMMENT ON COLUMN campaigns.automation_rules IS 'JSON object containing automation and trigger rules';

-- Sample data for development
INSERT INTO campaigns (
  account_id, event_id, name, slug, description, campaign_type, status,
  start_date, end_date, target_segments, created_by
) VALUES
(
  (SELECT id FROM accounts WHERE slug = 'acme-events'),
  (SELECT id FROM events WHERE slug = 'tech-summit-2025'),
  'Tech Summit 2025 Early Bird Promotion',
  'tech-summit-2025-early-bird',
  'Early bird promotion campaign for Tech Summit 2025',
  'event_promotion',
  'active',
  NOW(),
  (NOW() + INTERVAL '30 days'),
  ARRAY['tech_professionals', 'early_adopters'],
  '11111111-1111-1111-1111-111111111111'
),
(
  (SELECT id FROM accounts WHERE slug = 'acme-events'),
  (SELECT id FROM events WHERE slug = 'tech-summit-2025'),
  'Speaker Announcement Campaign',
  'speaker-announcement-campaign',
  'Announcing keynote speakers for Tech Summit 2025',
  'announcement',
  'scheduled',
  (NOW() + INTERVAL '7 days'),
  (NOW() + INTERVAL '14 days'),
  ARRAY['registered_attendees', 'interested_prospects'],
  '22222222-2222-2222-2222-222222222222'
);
