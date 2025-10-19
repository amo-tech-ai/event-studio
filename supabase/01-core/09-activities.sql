-- =====================================================
-- EventOS Core Schema: activities (CRM Activity Tracking)
-- =====================================================

-- Activity tracking table for CRM functionality
-- Records all interactions, communications, and touchpoints with contacts
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL, -- Optional link to specific event
  
  -- Activity Information
  activity_type TEXT NOT NULL CHECK (activity_type IN (
    'call', 'email', 'meeting', 'note', 'task', 'event_registration', 
    'event_attendance', 'ticket_purchase', 'feedback', 'survey_response',
    'social_media', 'website_visit', 'document_view', 'proposal_sent'
  )),
  subject TEXT NOT NULL,
  description TEXT,
  
  -- Activity Status & Priority
  status TEXT DEFAULT 'completed' CHECK (status IN (
    'pending', 'in_progress', 'completed', 'cancelled', 'deferred'
  )),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  
  -- Scheduling Information
  scheduled_date TIMESTAMPTZ,
  due_date TIMESTAMPTZ,
  completed_date TIMESTAMPTZ,
  duration_minutes INTEGER,
  
  -- Communication Details
  communication_direction TEXT CHECK (communication_direction IN (
    'inbound', 'outbound', 'internal'
  )),
  communication_channel TEXT CHECK (communication_channel IN (
    'phone', 'email', 'sms', 'linkedin', 'in_person', 'video_call', 'chat'
  )),
  
  -- Activity Content
  content TEXT, -- Email body, call notes, meeting minutes, etc.
  attachments TEXT[], -- Array of attachment URLs
  links TEXT[], -- Array of related links
  
  -- Follow-up Information
  requires_follow_up BOOLEAN DEFAULT false,
  follow_up_date TIMESTAMPTZ,
  follow_up_notes TEXT,
  
  -- Activity Metadata
  activity_metadata JSONB DEFAULT '{}', -- Additional activity-specific data
  tags TEXT[], -- Array of activity tags
  location TEXT, -- Meeting location, call location, etc.
  
  -- Outcome & Results
  outcome TEXT CHECK (outcome IN (
    'positive', 'neutral', 'negative', 'no_response', 'follow_up_needed'
  )),
  result_summary TEXT,
  next_steps TEXT,
  
  -- Assignment & Ownership
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  created_by UUID NOT NULL REFERENCES users(id),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_duration CHECK (duration_minutes > 0),
  CONSTRAINT valid_scheduled_date CHECK (
    scheduled_date IS NULL OR scheduled_date >= created_at
  ),
  CONSTRAINT valid_due_date CHECK (
    due_date IS NULL OR due_date >= created_at
  )
);

-- Enable Row Level Security
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_activities_account ON activities(account_id);
CREATE INDEX idx_activities_contact ON activities(contact_id);
CREATE INDEX idx_activities_event ON activities(event_id);
CREATE INDEX idx_activities_type ON activities(activity_type);
CREATE INDEX idx_activities_status ON activities(status);
CREATE INDEX idx_activities_priority ON activities(priority);
CREATE INDEX idx_activities_scheduled_date ON activities(scheduled_date);
CREATE INDEX idx_activities_due_date ON activities(due_date);
CREATE INDEX idx_activities_completed_date ON activities(completed_date);
CREATE INDEX idx_activities_assigned_to ON activities(assigned_to);
CREATE INDEX idx_activities_created_by ON activities(created_by);
CREATE INDEX idx_activities_follow_up ON activities(follow_up_date) WHERE requires_follow_up = true;
CREATE INDEX idx_activities_search ON activities USING gin(to_tsvector('english', subject || ' ' || COALESCE(description, '') || ' ' || COALESCE(content, '')));
CREATE INDEX idx_activities_tags ON activities USING gin(tags);

-- Create updated_at trigger
CREATE TRIGGER update_activities_updated_at
  BEFORE UPDATE ON activities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically set completed_date when status changes to completed
CREATE OR REPLACE FUNCTION set_activity_completed_date()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    NEW.completed_date := NOW();
  ELSIF NEW.status != 'completed' AND OLD.status = 'completed' THEN
    NEW.completed_date := NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_activity_completed_date_trigger
  BEFORE UPDATE ON activities
  FOR EACH ROW
  EXECUTE FUNCTION set_activity_completed_date();

-- Function to update contact last_contact_date when activity is completed
CREATE OR REPLACE FUNCTION update_contact_last_contact_date()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Update contact's last contact date
    UPDATE contacts 
    SET last_contact_date = NEW.completed_date,
        last_activity_date = NEW.completed_date
    WHERE contacts.id = NEW.contact_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_contact_last_contact_date_trigger
  AFTER UPDATE ON activities
  FOR EACH ROW
  EXECUTE FUNCTION update_contact_last_contact_date();

-- RLS Policies
CREATE POLICY "Activities are viewable by account members"
  ON activities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_users.account_id = activities.account_id
      AND account_users.user_id = auth.uid()
      AND account_users.status = 'active'
    )
  );

CREATE POLICY "Account members can create activities"
  ON activities FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_users.account_id = activities.account_id
      AND account_users.user_id = auth.uid()
      AND account_users.status = 'active'
    )
  );

CREATE POLICY "Activity owners and managers can update activities"
  ON activities FOR UPDATE
  USING (
    assigned_to = auth.uid() OR
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_users.account_id = activities.account_id
      AND account_users.user_id = auth.uid()
      AND account_users.status = 'active'
      AND account_users.role IN ('owner', 'admin', 'manager')
    )
  );

-- Comments for documentation
COMMENT ON TABLE activities IS 'CRM activity tracking for all contact interactions';
COMMENT ON COLUMN activities.activity_metadata IS 'JSON object for activity-specific metadata';
COMMENT ON COLUMN activities.content IS 'Main content of the activity (email body, call notes, etc.)';
COMMENT ON COLUMN activities.attachments IS 'Array of attachment URLs related to the activity';

-- Sample data for development
INSERT INTO activities (
  account_id, contact_id, activity_type, subject, description, status,
  communication_direction, communication_channel, assigned_to, created_by
) VALUES
(
  (SELECT id FROM accounts WHERE slug = 'acme-events'),
  (SELECT id FROM contacts WHERE email = 'john.smith@techcorp.com'),
  'call',
  'Follow-up call about Tech Summit 2025',
  'Discussed John''s interest in attending Tech Summit 2025 and his team''s requirements',
  'completed',
  'outbound',
  'phone',
  '11111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111'
),
(
  (SELECT id FROM accounts WHERE slug = 'acme-events'),
  (SELECT id FROM contacts WHERE email = 'sarah.j@startup.io'),
  'email',
  'Welcome email for Tech Summit 2025',
  'Sent welcome email with event details and speaker information',
  'completed',
  'outbound',
  'email',
  '22222222-2222-2222-2222-222222222222',
  '22222222-2222-2222-2222-222222222222'
),
(
  (SELECT id FROM accounts WHERE slug = 'acme-events'),
  (SELECT id FROM contacts WHERE email = 'michael.brown@bigcorp.com'),
  'meeting',
  'Initial discovery meeting',
  'Scheduled meeting to discuss BigCorp''s event needs and requirements',
  'pending',
  'outbound',
  'video_call',
  '11111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111'
);
