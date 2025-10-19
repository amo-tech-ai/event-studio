-- =====================================================
-- EventOS Core Schema: contacts (CRM Contact Management)
-- =====================================================

-- Contact management table for CRM functionality
-- Central repository for all customer and prospect information
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  
  -- Personal Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  display_name TEXT, -- Computed from first_name + last_name
  email TEXT NOT NULL,
  phone TEXT,
  mobile TEXT,
  title TEXT, -- Job title
  department TEXT,
  
  -- Company Information
  company_name TEXT,
  company_website TEXT,
  company_size TEXT CHECK (company_size IN ('startup', 'small', 'medium', 'large', 'enterprise')),
  industry TEXT,
  annual_revenue_range TEXT,
  
  -- Address Information
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state_province TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'Canada',
  
  -- Contact Classification
  contact_type TEXT DEFAULT 'prospect' CHECK (contact_type IN (
    'prospect', 'lead', 'customer', 'partner', 'vendor', 'speaker', 'influencer'
  )),
  lead_source TEXT DEFAULT 'website' CHECK (lead_source IN (
    'website', 'referral', 'social_media', 'email_campaign', 'event', 'cold_outreach', 'partner'
  )),
  lead_status TEXT DEFAULT 'new' CHECK (lead_status IN (
    'new', 'contacted', 'qualified', 'proposal_sent', 'negotiating', 'closed_won', 'closed_lost'
  )),
  
  -- Engagement & Relationship
  engagement_score INTEGER DEFAULT 0, -- 0-100 engagement score
  relationship_stage TEXT DEFAULT 'awareness' CHECK (relationship_stage IN (
    'awareness', 'interest', 'consideration', 'purchase', 'advocacy'
  )),
  last_contact_date TIMESTAMPTZ,
  last_activity_date TIMESTAMPTZ,
  
  -- Communication Preferences
  email_opt_in BOOLEAN DEFAULT true,
  sms_opt_in BOOLEAN DEFAULT false,
  marketing_opt_in BOOLEAN DEFAULT false,
  preferred_contact_method TEXT DEFAULT 'email' CHECK (preferred_contact_method IN (
    'email', 'phone', 'sms', 'linkedin', 'in_person'
  )),
  timezone TEXT DEFAULT 'America/Toronto',
  language TEXT DEFAULT 'en',
  
  -- Social Media & Professional
  linkedin_url TEXT,
  twitter_handle TEXT,
  facebook_url TEXT,
  instagram_handle TEXT,
  website_url TEXT,
  bio TEXT,
  
  -- Event History & Preferences
  total_events_attended INTEGER DEFAULT 0,
  total_spent DECIMAL(12,2) DEFAULT 0,
  average_ticket_price DECIMAL(10,2) DEFAULT 0,
  preferred_event_types TEXT[], -- Array of preferred event types
  preferred_venues TEXT[], -- Array of preferred venue IDs
  networking_interests TEXT[], -- Array of networking interest tags
  
  -- Notes & Tags
  notes TEXT,
  tags TEXT[], -- Array of contact tags
  custom_fields JSONB DEFAULT '{}', -- Custom fields for contact
  
  -- Assignment & Management
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  created_by UUID REFERENCES users(id),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT unique_account_email UNIQUE (account_id, email),
  CONSTRAINT valid_engagement_score CHECK (engagement_score BETWEEN 0 AND 100),
  CONSTRAINT valid_total_spent CHECK (total_spent >= 0),
  CONSTRAINT valid_average_ticket_price CHECK (average_ticket_price >= 0)
);

-- Enable Row Level Security
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_contacts_account ON contacts(account_id);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_contact_type ON contacts(contact_type);
CREATE INDEX idx_contacts_lead_status ON contacts(lead_status);
CREATE INDEX idx_contacts_company ON contacts(company_name);
CREATE INDEX idx_contacts_assigned_to ON contacts(assigned_to);
CREATE INDEX idx_contacts_created_by ON contacts(created_by);
CREATE INDEX idx_contacts_last_contact ON contacts(last_contact_date);
CREATE INDEX idx_contacts_last_activity ON contacts(last_activity_date);
CREATE INDEX idx_contacts_engagement ON contacts(engagement_score);
CREATE INDEX idx_contacts_search ON contacts USING gin(to_tsvector('english', first_name || ' ' || last_name || ' ' || COALESCE(company_name, '') || ' ' || COALESCE(email, '')));
CREATE INDEX idx_contacts_tags ON contacts USING gin(tags);
CREATE INDEX idx_contacts_preferred_types ON contacts USING gin(preferred_event_types);
CREATE INDEX idx_contacts_networking ON contacts USING gin(networking_interests);

-- Create updated_at trigger
CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically set display_name from first_name + last_name
CREATE OR REPLACE FUNCTION set_contact_display_name()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.display_name IS NULL OR NEW.display_name = '' THEN
    NEW.display_name := TRIM(NEW.first_name || ' ' || NEW.last_name);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_contact_display_name_trigger
  BEFORE INSERT OR UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION set_contact_display_name();

-- Function to update engagement score based on activities
CREATE OR REPLACE FUNCTION update_contact_engagement_score()
RETURNS TRIGGER AS $$
BEGIN
  -- Update engagement score based on various factors
  -- This is a simplified version - in production, this would be more sophisticated
  NEW.engagement_score := GREATEST(0, LEAST(100, 
    CASE 
      WHEN NEW.total_events_attended > 0 THEN 20 + (NEW.total_events_attended * 10)
      ELSE 0
    END +
    CASE 
      WHEN NEW.total_spent > 1000 THEN 30
      WHEN NEW.total_spent > 500 THEN 20
      WHEN NEW.total_spent > 100 THEN 10
      ELSE 0
    END +
    CASE 
      WHEN NEW.last_contact_date > NOW() - INTERVAL '30 days' THEN 20
      WHEN NEW.last_contact_date > NOW() - INTERVAL '90 days' THEN 10
      ELSE 0
    END +
    CASE 
      WHEN NEW.email_opt_in = true THEN 5
      ELSE 0
    END +
    CASE 
      WHEN NEW.marketing_opt_in = true THEN 5
      ELSE 0
    END
  ));
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_contact_engagement_score_trigger
  BEFORE INSERT OR UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_contact_engagement_score();

-- RLS Policies
CREATE POLICY "Contacts are viewable by account members"
  ON contacts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_users.account_id = contacts.account_id
      AND account_users.user_id = auth.uid()
      AND account_users.status = 'active'
    )
  );

CREATE POLICY "Account members can create contacts"
  ON contacts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_users.account_id = contacts.account_id
      AND account_users.user_id = auth.uid()
      AND account_users.status = 'active'
    )
  );

CREATE POLICY "Contact owners and managers can update contacts"
  ON contacts FOR UPDATE
  USING (
    assigned_to = auth.uid() OR
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_users.account_id = contacts.account_id
      AND account_users.user_id = auth.uid()
      AND account_users.status = 'active'
      AND account_users.role IN ('owner', 'admin', 'manager')
    )
  );

-- Comments for documentation
COMMENT ON TABLE contacts IS 'CRM contact management for customers and prospects';
COMMENT ON COLUMN contacts.engagement_score IS 'Calculated engagement score based on activities and interactions';
COMMENT ON COLUMN contacts.custom_fields IS 'JSON object for contact-specific custom fields';
COMMENT ON COLUMN contacts.preferred_event_types IS 'Array of preferred event types for personalization';

-- Sample data for development
INSERT INTO contacts (
  account_id, first_name, last_name, email, phone, title, company_name,
  contact_type, lead_source, lead_status, assigned_to, created_by
) VALUES
(
  (SELECT id FROM accounts WHERE slug = 'acme-events'),
  'John',
  'Smith',
  'john.smith@techcorp.com',
  '+1-416-555-0123',
  'Senior Developer',
  'TechCorp Inc.',
  'customer',
  'website',
  'closed_won',
  '11111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111'
),
(
  (SELECT id FROM accounts WHERE slug = 'acme-events'),
  'Sarah',
  'Johnson',
  'sarah.j@startup.io',
  '+1-416-555-0456',
  'CTO',
  'StartupIO',
  'customer',
  'referral',
  'closed_won',
  '22222222-2222-2222-2222-222222222222',
  '22222222-2222-2222-2222-222222222222'
),
(
  (SELECT id FROM accounts WHERE slug = 'acme-events'),
  'Michael',
  'Brown',
  'michael.brown@bigcorp.com',
  '+1-416-555-0789',
  'VP of Marketing',
  'BigCorp Enterprises',
  'prospect',
  'cold_outreach',
  'contacted',
  '11111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111'
);
