-- =====================================================
-- EventOS Core Schema: venues (Location Management)
-- =====================================================

-- Venue and location management table
-- Handles physical venues, virtual spaces, and location details
CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  
  -- Basic Venue Information
  name TEXT NOT NULL,
  slug TEXT NOT NULL, -- URL-friendly identifier
  description TEXT,
  venue_type TEXT DEFAULT 'conference_center' CHECK (venue_type IN (
    'conference_center', 'hotel', 'restaurant', 'office', 'coworking_space',
    'theater', 'auditorium', 'stadium', 'park', 'outdoor', 'virtual', 'other'
  )),
  
  -- Contact Information
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  website TEXT,
  
  -- Physical Address
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state_province TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'Canada',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Capacity & Layout
  total_capacity INTEGER,
  max_capacity INTEGER,
  min_capacity INTEGER,
  room_count INTEGER,
  
  -- Venue Features
  has_parking BOOLEAN DEFAULT false,
  parking_capacity INTEGER,
  has_wifi BOOLEAN DEFAULT true,
  has_av_equipment BOOLEAN DEFAULT false,
  has_catering BOOLEAN DEFAULT false,
  has_accessibility BOOLEAN DEFAULT false,
  features TEXT[], -- ['projector', 'microphone', 'stage', 'dance_floor']
  
  -- Pricing & Availability
  base_rate DECIMAL(10,2), -- Base hourly/daily rate
  currency TEXT DEFAULT 'CAD',
  minimum_booking_hours INTEGER DEFAULT 1,
  booking_advance_days INTEGER DEFAULT 30,
  
  -- Venue Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance', 'closed')),
  availability_status TEXT DEFAULT 'available' CHECK (availability_status IN (
    'available', 'booked', 'maintenance', 'unavailable'
  )),
  
  -- Images & Media
  featured_image_url TEXT,
  gallery_images TEXT[], -- Array of image URLs
  floor_plan_url TEXT,
  virtual_tour_url TEXT,
  
  -- Operating Hours
  operating_hours JSONB DEFAULT '{}', -- {monday: {open: "09:00", close: "17:00"}, ...}
  timezone TEXT DEFAULT 'America/Toronto',
  
  -- Special Requirements
  special_requirements TEXT,
  accessibility_features TEXT[],
  restrictions TEXT,
  
  -- Venue Settings
  booking_policy TEXT,
  cancellation_policy TEXT,
  venue_settings JSONB DEFAULT '{}',
  
  -- Usage Statistics
  total_events INTEGER DEFAULT 0,
  total_attendees INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  average_rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  
  -- Ownership & Assignment
  created_by UUID NOT NULL REFERENCES users(id),
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_venues_account ON venues(account_id);
CREATE INDEX idx_venues_slug ON venues(slug);
CREATE INDEX idx_venues_status ON venues(status);
CREATE INDEX idx_venues_venue_type ON venues(venue_type);
CREATE INDEX idx_venues_city ON venues(city);
CREATE INDEX idx_venues_capacity ON venues(total_capacity);
CREATE INDEX idx_venues_created_by ON venues(created_by);
CREATE INDEX idx_venues_assigned_to ON venues(assigned_to);
CREATE INDEX idx_venues_search ON venues USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));
CREATE INDEX idx_venues_location ON venues(latitude, longitude);
CREATE INDEX idx_venues_features ON venues USING gin(features);

-- Create updated_at trigger
CREATE TRIGGER update_venues_updated_at
  BEFORE UPDATE ON venues
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically set slug from name
CREATE OR REPLACE FUNCTION set_venue_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := lower(regexp_replace(
      regexp_replace(NEW.name, '[^a-zA-Z0-9\s]', '', 'g'), 
      '\s+', '-', 'g'
    ));
    
    -- Ensure uniqueness within account
    WHILE EXISTS (
      SELECT 1 FROM venues 
      WHERE venues.slug = NEW.slug 
      AND venues.account_id = NEW.account_id 
      AND venues.id != NEW.id
    ) LOOP
      NEW.slug := NEW.slug || '-' || extract(epoch from now())::text;
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_venue_slug_trigger
  BEFORE INSERT OR UPDATE ON venues
  FOR EACH ROW
  EXECUTE FUNCTION set_venue_slug();

-- RLS Policies
CREATE POLICY "Venues are viewable by account members"
  ON venues FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_users.account_id = venues.account_id
      AND account_users.user_id = auth.uid()
      AND account_users.status = 'active'
    )
  );

CREATE POLICY "Account members can create venues"
  ON venues FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_users.account_id = venues.account_id
      AND account_users.user_id = auth.uid()
      AND account_users.status = 'active'
      AND account_users.role IN ('owner', 'admin', 'manager')
    )
  );

CREATE POLICY "Venue creators and managers can update venues"
  ON venues FOR UPDATE
  USING (
    created_by = auth.uid() OR
    assigned_to = auth.uid() OR
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_users.account_id = venues.account_id
      AND account_users.user_id = auth.uid()
      AND account_users.status = 'active'
      AND account_users.role IN ('owner', 'admin', 'manager')
    )
  );

-- Comments for documentation
COMMENT ON TABLE venues IS 'Venue and location management for events';
COMMENT ON COLUMN venues.slug IS 'URL-friendly unique identifier within account';
COMMENT ON COLUMN venues.features IS 'Array of venue features and amenities';
COMMENT ON COLUMN venues.operating_hours IS 'JSON object containing operating hours by day';
COMMENT ON COLUMN venues.venue_settings IS 'JSON object containing venue-specific configuration';

-- Sample data for development
INSERT INTO venues (
  account_id, name, slug, description, venue_type, address_line1, city,
  total_capacity, contact_email, created_by, features
) VALUES
(
  (SELECT id FROM accounts WHERE slug = 'acme-events'),
  'Metro Toronto Convention Centre',
  'metro-toronto-convention-centre',
  'Premier convention center in downtown Toronto with state-of-the-art facilities.',
  'conference_center',
  '255 Front St W',
  'Toronto',
  1000,
  'events@mtcc.com',
  '11111111-1111-1111-1111-111111111111',
  ARRAY['projector', 'microphone', 'stage', 'wifi', 'catering', 'parking']
),
(
  (SELECT id FROM accounts WHERE slug = 'toronto-business'),
  'The Spoke Club',
  'the-spoke-club',
  'Upscale private club perfect for networking events and business meetings.',
  'restaurant',
  '600 King St W',
  'Toronto',
  150,
  'events@spokeclub.com',
  '22222222-2222-2222-2222-222222222222',
  ARRAY['wifi', 'catering', 'bar', 'private_rooms']
);
