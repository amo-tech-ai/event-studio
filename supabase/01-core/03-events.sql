-- =====================================================
-- EventOS Core Schema: events (Event Management)
-- =====================================================

-- Primary event management table
-- Core entity for all event-related functionality
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  
  -- Basic Event Information
  title TEXT NOT NULL,
  slug TEXT NOT NULL, -- URL-friendly identifier
  description TEXT,
  short_description TEXT,
  event_type TEXT DEFAULT 'conference' CHECK (event_type IN (
    'conference', 'workshop', 'seminar', 'networking', 'training', 
    'meeting', 'party', 'concert', 'exhibition', 'trade_show', 'other'
  )),
  
  -- Event Scheduling
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  timezone TEXT DEFAULT 'America/Toronto',
  duration_hours INTEGER GENERATED ALWAYS AS (
    EXTRACT(EPOCH FROM (end_date - start_date)) / 3600
  ) STORED,
  
  -- Location Information
  venue_id UUID REFERENCES venues(id) ON DELETE SET NULL,
  location_name TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state_province TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'Canada',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Online Event Support
  is_online BOOLEAN DEFAULT false,
  online_url TEXT,
  online_platform TEXT CHECK (online_platform IN ('zoom', 'teams', 'google_meet', 'custom', 'other')),
  online_instructions TEXT,
  
  -- Event Configuration
  capacity INTEGER,
  registration_required BOOLEAN DEFAULT true,
  registration_deadline TIMESTAMPTZ,
  early_bird_deadline TIMESTAMPTZ,
  cancellation_deadline TIMESTAMPTZ,
  
  -- Pricing & Revenue
  currency TEXT DEFAULT 'CAD',
  base_price DECIMAL(10,2) DEFAULT 0,
  early_bird_price DECIMAL(10,2),
  member_price DECIMAL(10,2),
  group_discount_rate DECIMAL(5,2), -- Percentage discount for groups
  
  -- Event Status & Visibility
  status TEXT DEFAULT 'draft' CHECK (status IN (
    'draft', 'published', 'active', 'cancelled', 'completed', 'archived'
  )),
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'invite_only')),
  featured BOOLEAN DEFAULT false,
  
  -- Marketing & SEO
  featured_image_url TEXT,
  banner_image_url TEXT,
  gallery_images TEXT[], -- Array of image URLs
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[],
  
  -- Registration & Attendance
  registration_count INTEGER DEFAULT 0,
  attendance_count INTEGER DEFAULT 0,
  check_in_count INTEGER DEFAULT 0,
  no_show_count INTEGER DEFAULT 0,
  
  -- Revenue Tracking
  total_revenue DECIMAL(15,2) DEFAULT 0,
  total_tickets_sold INTEGER DEFAULT 0,
  total_refunds DECIMAL(15,2) DEFAULT 0,
  
  -- Event Settings
  allow_waitlist BOOLEAN DEFAULT true,
  allow_cancellation BOOLEAN DEFAULT true,
  allow_transfer BOOLEAN DEFAULT false,
  require_approval BOOLEAN DEFAULT false,
  auto_approve BOOLEAN DEFAULT true,
  
  -- Communication Settings
  send_reminders BOOLEAN DEFAULT true,
  reminder_days_before INTEGER[] DEFAULT '{7, 1}', -- Days before event
  send_follow_up BOOLEAN DEFAULT true,
  follow_up_days_after INTEGER DEFAULT 3,
  
  -- Custom Fields & Configuration
  custom_fields JSONB DEFAULT '{}',
  event_settings JSONB DEFAULT '{}',
  branding JSONB DEFAULT '{}',
  
  -- Organizer Information
  organizer_name TEXT,
  organizer_email TEXT,
  organizer_phone TEXT,
  organizer_website TEXT,
  
  -- Ownership & Assignment
  created_by UUID NOT NULL REFERENCES users(id),
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  last_registration_at TIMESTAMPTZ
);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_events_account ON events(account_id);
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_created_by ON events(created_by);
CREATE INDEX idx_events_assigned_to ON events(assigned_to);
CREATE INDEX idx_events_venue ON events(venue_id);
CREATE INDEX idx_events_featured ON events(featured) WHERE featured = true;
CREATE INDEX idx_events_search ON events USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));
CREATE INDEX idx_events_date_range ON events(start_date, end_date);
CREATE INDEX idx_events_account_status ON events(account_id, status);

-- Create updated_at trigger
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically set slug from title
CREATE OR REPLACE FUNCTION set_event_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := lower(regexp_replace(
      regexp_replace(NEW.title, '[^a-zA-Z0-9\s]', '', 'g'), 
      '\s+', '-', 'g'
    ));
    
    -- Ensure uniqueness within account
    WHILE EXISTS (
      SELECT 1 FROM events 
      WHERE events.slug = NEW.slug 
      AND events.account_id = NEW.account_id 
      AND events.id != NEW.id
    ) LOOP
      NEW.slug := NEW.slug || '-' || extract(epoch from now())::text;
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_event_slug_trigger
  BEFORE INSERT OR UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION set_event_slug();

-- RLS Policies
CREATE POLICY "Events are viewable by account members"
  ON events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_users.account_id = events.account_id
      AND account_users.user_id = auth.uid()
      AND account_users.status = 'active'
    )
  );

CREATE POLICY "Account members can create events"
  ON events FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_users.account_id = events.account_id
      AND account_users.user_id = auth.uid()
      AND account_users.status = 'active'
      AND account_users.role IN ('owner', 'admin', 'manager')
    )
  );

CREATE POLICY "Event creators and managers can update events"
  ON events FOR UPDATE
  USING (
    created_by = auth.uid() OR
    assigned_to = auth.uid() OR
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_users.account_id = events.account_id
      AND account_users.user_id = auth.uid()
      AND account_users.status = 'active'
      AND account_users.role IN ('owner', 'admin', 'manager')
    )
  );

-- Public events policy (for public event pages)
CREATE POLICY "Public events are viewable by everyone"
  ON events FOR SELECT
  USING (status = 'published' AND visibility = 'public');

-- Comments for documentation
COMMENT ON TABLE events IS 'Core event management entity with comprehensive event data';
COMMENT ON COLUMN events.slug IS 'URL-friendly unique identifier within account';
COMMENT ON COLUMN events.duration_hours IS 'Computed duration in hours from start_date and end_date';
COMMENT ON COLUMN events.custom_fields IS 'JSON object for additional event-specific fields';
COMMENT ON COLUMN events.event_settings IS 'JSON object containing event-specific configuration';
COMMENT ON COLUMN events.branding IS 'JSON object containing branding and styling options';

-- Sample data for development
INSERT INTO events (
  account_id, title, slug, description, start_date, end_date, 
  event_type, status, visibility, created_by, capacity, base_price
) VALUES
(
  (SELECT id FROM accounts WHERE slug = 'acme-events'),
  'Toronto Tech Summit 2025',
  'toronto-tech-summit-2025',
  'Annual technology conference featuring the latest in AI, blockchain, and cloud computing.',
  '2025-06-15 09:00:00+00',
  '2025-06-15 17:00:00+00',
  'conference',
  'published',
  'public',
  '11111111-1111-1111-1111-111111111111',
  500,
  299.00
),
(
  (SELECT id FROM accounts WHERE slug = 'toronto-business'),
  'Networking Mixer: Q1 2025',
  'networking-mixer-q1-2025',
  'Monthly networking event for Toronto business professionals.',
  '2025-03-15 18:00:00+00',
  '2025-03-15 21:00:00+00',
  'networking',
  'published',
  'public',
  '22222222-2222-2222-2222-222222222222',
  100,
  25.00
);
