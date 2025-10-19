-- =====================================================
-- EventOS Core Schema: sessions (Event Sessions)
-- =====================================================

-- Event sessions table for managing individual sessions within events
-- Handles workshops, presentations, networking sessions, etc.
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  venue_id UUID REFERENCES venues(id) ON DELETE SET NULL,
  
  -- Session Information
  title TEXT NOT NULL,
  slug TEXT NOT NULL, -- URL-friendly identifier
  description TEXT,
  short_description TEXT,
  session_type TEXT DEFAULT 'presentation' CHECK (session_type IN (
    'presentation', 'workshop', 'panel', 'networking', 'break', 'meal', 'keynote',
    'demo', 'roundtable', 'fireside_chat', 'q_and_a', 'other'
  )),
  
  -- Scheduling
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER GENERATED ALWAYS AS (
    EXTRACT(EPOCH FROM (end_time - start_time)) / 60
  ) STORED,
  timezone TEXT DEFAULT 'America/Toronto',
  
  -- Session Details
  max_capacity INTEGER,
  current_registrations INTEGER DEFAULT 0,
  waitlist_count INTEGER DEFAULT 0,
  is_required BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_recorded BOOLEAN DEFAULT false,
  
  -- Content & Materials
  session_materials TEXT[], -- Array of material URLs
  presentation_url TEXT,
  recording_url TEXT,
  slides_url TEXT,
  handouts_url TEXT,
  
  -- Speakers & Presenters
  speakers JSONB DEFAULT '[]', -- Array of speaker information
  moderators JSONB DEFAULT '[]', -- Array of moderator information
  
  -- Session Features
  has_q_and_a BOOLEAN DEFAULT false,
  has_polls BOOLEAN DEFAULT false,
  has_chat BOOLEAN DEFAULT false,
  has_breakout_rooms BOOLEAN DEFAULT false,
  is_interactive BOOLEAN DEFAULT false,
  
  -- Registration & Access
  requires_registration BOOLEAN DEFAULT true,
  registration_deadline TIMESTAMPTZ,
  access_level TEXT DEFAULT 'general' CHECK (access_level IN (
    'general', 'vip', 'speaker', 'sponsor', 'staff', 'invite_only'
  )),
  
  -- Session Status
  status TEXT DEFAULT 'scheduled' CHECK (status IN (
    'draft', 'scheduled', 'live', 'completed', 'cancelled', 'postponed'
  )),
  
  -- Session Settings
  session_settings JSONB DEFAULT '{}', -- Additional session configuration
  custom_fields JSONB DEFAULT '{}', -- Custom fields for session
  
  -- Analytics & Feedback
  attendance_count INTEGER DEFAULT 0,
  feedback_rating DECIMAL(3,2) DEFAULT 0,
  feedback_count INTEGER DEFAULT 0,
  engagement_score INTEGER DEFAULT 0, -- 0-100 engagement score
  
  -- Assignment & Management
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  created_by UUID NOT NULL REFERENCES users(id),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT unique_event_session_slug UNIQUE (event_id, slug),
  CONSTRAINT valid_session_times CHECK (end_time > start_time),
  CONSTRAINT valid_capacity CHECK (max_capacity IS NULL OR max_capacity > 0),
  CONSTRAINT valid_registrations CHECK (current_registrations >= 0),
  CONSTRAINT valid_waitlist CHECK (waitlist_count >= 0)
);

-- Enable Row Level Security
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_sessions_account ON sessions(account_id);
CREATE INDEX idx_sessions_event ON sessions(event_id);
CREATE INDEX idx_sessions_venue ON sessions(venue_id);
CREATE INDEX idx_sessions_slug ON sessions(slug);
CREATE INDEX idx_sessions_type ON sessions(session_type);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_sessions_start_time ON sessions(start_time);
CREATE INDEX idx_sessions_end_time ON sessions(end_time);
CREATE INDEX idx_sessions_access_level ON sessions(access_level);
CREATE INDEX idx_sessions_created_by ON sessions(created_by);
CREATE INDEX idx_sessions_assigned_to ON sessions(assigned_to);
CREATE INDEX idx_sessions_search ON sessions USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));
CREATE INDEX idx_sessions_speakers ON sessions USING gin(speakers);

-- Create updated_at trigger
CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically set slug from title
CREATE OR REPLACE FUNCTION set_session_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := lower(regexp_replace(
      regexp_replace(NEW.title, '[^a-zA-Z0-9\s]', '', 'g'), 
      '\s+', '-', 'g'
    ));
    
    -- Ensure uniqueness within event
    WHILE EXISTS (
      SELECT 1 FROM sessions 
      WHERE sessions.slug = NEW.slug 
      AND sessions.event_id = NEW.event_id 
      AND sessions.id != NEW.id
    ) LOOP
      NEW.slug := NEW.slug || '-' || extract(epoch from now())::text;
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_session_slug_trigger
  BEFORE INSERT OR UPDATE ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION set_session_slug();

-- RLS Policies
CREATE POLICY "Sessions are viewable by account members"
  ON sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_users.account_id = sessions.account_id
      AND account_users.user_id = auth.uid()
      AND account_users.status = 'active'
    )
  );

CREATE POLICY "Account members can create sessions"
  ON sessions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_users.account_id = sessions.account_id
      AND account_users.user_id = auth.uid()
      AND account_users.status = 'active'
      AND account_users.role IN ('owner', 'admin', 'manager')
    )
  );

CREATE POLICY "Session creators and managers can update sessions"
  ON sessions FOR UPDATE
  USING (
    created_by = auth.uid() OR
    assigned_to = auth.uid() OR
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_users.account_id = sessions.account_id
      AND account_users.user_id = auth.uid()
      AND account_users.status = 'active'
      AND account_users.role IN ('owner', 'admin', 'manager')
    )
  );

-- Comments for documentation
COMMENT ON TABLE sessions IS 'Individual sessions within events (presentations, workshops, etc.)';
COMMENT ON COLUMN sessions.speakers IS 'JSON array containing speaker information';
COMMENT ON COLUMN sessions.session_settings IS 'JSON object for session-specific configuration';
COMMENT ON COLUMN sessions.custom_fields IS 'JSON object for session-specific custom fields';

-- Sample data for development
INSERT INTO sessions (
  account_id, event_id, venue_id, title, slug, description, session_type,
  start_time, end_time, max_capacity, speakers, created_by
) VALUES
(
  (SELECT id FROM accounts WHERE slug = 'acme-events'),
  (SELECT id FROM events WHERE slug = 'tech-summit-2025'),
  (SELECT id FROM venues WHERE slug = 'metro-toronto-convention-centre'),
  'The Future of AI in Business',
  'future-ai-business',
  'Exploring how artificial intelligence is transforming business operations and decision-making.',
  'keynote',
  '2025-03-15 09:00:00-05:00',
  '2025-03-15 10:00:00-05:00',
  500,
  '[{"name": "Dr. Jane Smith", "title": "Chief AI Officer", "company": "TechCorp Inc.", "bio": "Leading AI researcher with 15+ years experience"}]',
  '11111111-1111-1111-1111-111111111111'
),
(
  (SELECT id FROM accounts WHERE slug = 'acme-events'),
  (SELECT id FROM events WHERE slug = 'tech-summit-2025'),
  (SELECT id FROM venues WHERE slug = 'metro-toronto-convention-centre'),
  'Hands-on React Workshop',
  'hands-on-react-workshop',
  'Learn React fundamentals through hands-on coding exercises.',
  'workshop',
  '2025-03-15 11:00:00-05:00',
  '2025-03-15 12:30:00-05:00',
  30,
  '[{"name": "Mike Johnson", "title": "Senior Developer", "company": "StartupIO", "bio": "React expert with 8+ years experience"}]',
  '22222222-2222-2222-2222-222222222222'
);
