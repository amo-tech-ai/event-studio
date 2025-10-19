-- =====================================================
-- EventOS Core Schema: attendees (Event Attendees)
-- =====================================================

-- Event attendees table
-- Tracks all event registrations and attendee information
CREATE TABLE attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Optional link to registered user
  
  -- Personal Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  display_name TEXT, -- Computed from first_name + last_name
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  job_title TEXT,
  department TEXT,
  
  -- Registration Information
  registration_type TEXT DEFAULT 'general' CHECK (registration_type IN (
    'general', 'vip', 'speaker', 'sponsor', 'exhibitor', 'staff', 'volunteer', 'media'
  )),
  registration_source TEXT DEFAULT 'website' CHECK (registration_source IN (
    'website', 'email', 'phone', 'walk_in', 'referral', 'partner', 'api'
  )),
  registration_status TEXT DEFAULT 'registered' CHECK (registration_status IN (
    'registered', 'confirmed', 'checked_in', 'no_show', 'cancelled', 'waitlisted'
  )),
  
  -- Ticket Information
  ticket_type TEXT DEFAULT 'standard' CHECK (ticket_type IN (
    'standard', 'early_bird', 'student', 'group', 'vip', 'free', 'sponsor'
  )),
  ticket_price DECIMAL(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'CAD',
  discount_applied DECIMAL(10,2) DEFAULT 0,
  final_price DECIMAL(10,2) DEFAULT 0,
  
  -- Dietary & Accessibility
  dietary_requirements TEXT,
  accessibility_needs TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  
  -- Event-Specific Information
  session_preferences TEXT[], -- Array of preferred session IDs
  networking_interests TEXT[], -- Array of networking interest tags
  referral_source TEXT,
  notes TEXT,
  
  -- Check-in Information
  checked_in_at TIMESTAMPTZ,
  checked_in_by UUID REFERENCES users(id),
  check_in_location TEXT,
  qr_code TEXT UNIQUE, -- Generated QR code for check-in
  
  -- Communication Preferences
  email_opt_in BOOLEAN DEFAULT true,
  sms_opt_in BOOLEAN DEFAULT false,
  marketing_opt_in BOOLEAN DEFAULT false,
  communication_preferences JSONB DEFAULT '{}',
  
  -- Engagement Tracking
  engagement_score INTEGER DEFAULT 0, -- 0-100 engagement score
  last_activity_at TIMESTAMPTZ,
  survey_responses JSONB DEFAULT '{}',
  feedback_rating INTEGER CHECK (feedback_rating BETWEEN 1 AND 5),
  feedback_comments TEXT,
  
  -- Registration Metadata
  registration_ip TEXT,
  user_agent TEXT,
  registration_metadata JSONB DEFAULT '{}',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  
  -- Payment Information
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN (
    'pending', 'paid', 'failed', 'refunded', 'partially_refunded'
  )),
  payment_method TEXT,
  payment_reference TEXT,
  payment_date TIMESTAMPTZ,
  
  -- Waitlist Information
  waitlist_position INTEGER,
  waitlist_joined_at TIMESTAMPTZ,
  waitlist_notified_at TIMESTAMPTZ,
  
  -- Assignment & Management
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  created_by UUID REFERENCES users(id),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT unique_event_email UNIQUE (event_id, email),
  CONSTRAINT valid_registration_status CHECK (
    (registration_status = 'waitlisted' AND waitlist_position IS NOT NULL) OR
    (registration_status != 'waitlisted' AND waitlist_position IS NULL)
  )
);

-- Enable Row Level Security
ALTER TABLE attendees ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_attendees_account ON attendees(account_id);
CREATE INDEX idx_attendees_event ON attendees(event_id);
CREATE INDEX idx_attendees_user ON attendees(user_id);
CREATE INDEX idx_attendees_email ON attendees(email);
CREATE INDEX idx_attendees_registration_status ON attendees(registration_status);
CREATE INDEX idx_attendees_ticket_type ON attendees(ticket_type);
CREATE INDEX idx_attendees_payment_status ON attendees(payment_status);
CREATE INDEX idx_attendees_checked_in ON attendees(checked_in_at);
CREATE INDEX idx_attendees_created_by ON attendees(created_by);
CREATE INDEX idx_attendees_assigned_to ON attendees(assigned_to);
CREATE INDEX idx_attendees_qr_code ON attendees(qr_code);
CREATE INDEX idx_attendees_waitlist ON attendees(waitlist_position) WHERE registration_status = 'waitlisted';
CREATE INDEX idx_attendees_search ON attendees USING gin(to_tsvector('english', first_name || ' ' || last_name || ' ' || COALESCE(company, '')));
CREATE INDEX idx_attendees_networking ON attendees USING gin(networking_interests);

-- Create updated_at trigger
CREATE TRIGGER update_attendees_updated_at
  BEFORE UPDATE ON attendees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically set display_name from first_name + last_name
CREATE OR REPLACE FUNCTION set_attendee_display_name()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.display_name IS NULL OR NEW.display_name = '' THEN
    NEW.display_name := TRIM(NEW.first_name || ' ' || NEW.last_name);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_attendee_display_name_trigger
  BEFORE INSERT OR UPDATE ON attendees
  FOR EACH ROW
  EXECUTE FUNCTION set_attendee_display_name();

-- Function to generate QR code
CREATE OR REPLACE FUNCTION generate_attendee_qr_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.qr_code IS NULL OR NEW.qr_code = '' THEN
    NEW.qr_code := 'EVENT_' || NEW.event_id || '_' || NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_attendee_qr_code_trigger
  BEFORE INSERT ON attendees
  FOR EACH ROW
  EXECUTE FUNCTION generate_attendee_qr_code();

-- RLS Policies
CREATE POLICY "Attendees are viewable by account members"
  ON attendees FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_users.account_id = attendees.account_id
      AND account_users.user_id = auth.uid()
      AND account_users.status = 'active'
    )
  );

CREATE POLICY "Account members can create attendees"
  ON attendees FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_users.account_id = attendees.account_id
      AND account_users.user_id = auth.uid()
      AND account_users.status = 'active'
    )
  );

CREATE POLICY "Attendees can update their own information"
  ON attendees FOR UPDATE
  USING (
    email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_users.account_id = attendees.account_id
      AND account_users.user_id = auth.uid()
      AND account_users.status = 'active'
      AND account_users.role IN ('owner', 'admin', 'manager')
    )
  );

-- Comments for documentation
COMMENT ON TABLE attendees IS 'Event attendees and registration information';
COMMENT ON COLUMN attendees.registration_type IS 'Type of attendee registration (general, vip, speaker, etc.)';
COMMENT ON COLUMN attendees.engagement_score IS 'Calculated engagement score based on event participation';
COMMENT ON COLUMN attendees.qr_code IS 'Unique QR code for event check-in';
COMMENT ON COLUMN attendees.waitlist_position IS 'Position in waitlist queue (only for waitlisted attendees)';

-- Sample data for development
INSERT INTO attendees (
  account_id, event_id, first_name, last_name, email, company, job_title,
  registration_type, ticket_type, ticket_price, final_price, created_by
) VALUES
(
  (SELECT id FROM accounts WHERE slug = 'acme-events'),
  (SELECT id FROM events WHERE slug = 'tech-summit-2025'),
  'John',
  'Smith',
  'john.smith@techcorp.com',
  'TechCorp Inc.',
  'Senior Developer',
  'general',
  'early_bird',
  199.00,
  179.00,
  '11111111-1111-1111-1111-111111111111'
),
(
  (SELECT id FROM accounts WHERE slug = 'acme-events'),
  (SELECT id FROM events WHERE slug = 'tech-summit-2025'),
  'Sarah',
  'Johnson',
  'sarah.j@startup.io',
  'StartupIO',
  'CTO',
  'speaker',
  'vip',
  0.00,
  0.00,
  '22222222-2222-2222-2222-222222222222'
);
