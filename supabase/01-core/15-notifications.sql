-- =====================================================
-- EventOS Core Schema: notifications (Notification System)
-- =====================================================

-- Notifications table for managing system notifications and alerts
-- Handles in-app notifications, email notifications, and system alerts
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- NULL for system-wide notifications
  
  -- Notification Information
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  notification_type TEXT NOT NULL CHECK (notification_type IN (
    'info', 'success', 'warning', 'error', 'event_reminder', 'registration_confirmation',
    'payment_received', 'ticket_ready', 'event_cancelled', 'system_update', 'team_invite'
  )),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  
  -- Content & Actions
  content JSONB DEFAULT '{}', -- Additional notification content
  action_url TEXT, -- URL to navigate to when notification is clicked
  action_text TEXT, -- Text for the action button
  action_data JSONB DEFAULT '{}', -- Additional action data
  
  -- Delivery Channels
  channels TEXT[] DEFAULT ARRAY['in_app'], -- Array of delivery channels
  email_sent BOOLEAN DEFAULT false,
  sms_sent BOOLEAN DEFAULT false,
  push_sent BOOLEAN DEFAULT false,
  
  -- Related Entities
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  
  -- Status & Delivery
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'sent', 'delivered', 'read', 'clicked', 'failed', 'cancelled'
  )),
  delivery_status JSONB DEFAULT '{}', -- Per-channel delivery status
  
  -- User Interaction
  read_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  dismissed_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ,
  
  -- Scheduling
  scheduled_for TIMESTAMPTZ, -- When to send the notification
  sent_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ, -- When notification expires
  
  -- Template & Automation
  template_id TEXT, -- Reference to notification template
  is_automated BOOLEAN DEFAULT false,
  trigger_event TEXT, -- Event that triggered this notification
  
  -- Assignment & Management
  created_by UUID REFERENCES users(id),
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_scheduled_time CHECK (
    scheduled_for IS NULL OR scheduled_for >= created_at
  ),
  CONSTRAINT valid_expiry_time CHECK (
    expires_at IS NULL OR expires_at > created_at
  )
);

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_notifications_account ON notifications(account_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(notification_type);
CREATE INDEX idx_notifications_priority ON notifications(priority);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_scheduled_for ON notifications(scheduled_for);
CREATE INDEX idx_notifications_sent_at ON notifications(sent_at);
CREATE INDEX idx_notifications_expires_at ON notifications(expires_at);
CREATE INDEX idx_notifications_read_at ON notifications(read_at);
CREATE INDEX idx_notifications_created_by ON notifications(created_by);
CREATE INDEX idx_notifications_assigned_to ON notifications(assigned_to);
CREATE INDEX idx_notifications_event ON notifications(event_id);
CREATE INDEX idx_notifications_contact ON notifications(contact_id);
CREATE INDEX idx_notifications_order ON notifications(order_id);
CREATE INDEX idx_notifications_campaign ON notifications(campaign_id);
CREATE INDEX idx_notifications_search ON notifications USING gin(to_tsvector('english', title || ' ' || message));
CREATE INDEX idx_notifications_channels ON notifications USING gin(channels);

-- Create updated_at trigger
CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically set sent_at when status changes to sent
CREATE OR REPLACE FUNCTION set_notification_sent_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'sent' AND OLD.status != 'sent' AND NEW.sent_at IS NULL THEN
    NEW.sent_at := NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_notification_sent_at_trigger
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION set_notification_sent_at();

-- Function to handle notification expiration
CREATE OR REPLACE FUNCTION expire_notifications()
RETURNS TRIGGER AS $$
BEGIN
  -- Mark notifications as expired if they have passed their expiry time
  UPDATE notifications 
  SET status = 'cancelled'
  WHERE expires_at IS NOT NULL 
  AND expires_at <= NOW() 
  AND status IN ('pending', 'sent', 'delivered');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- RLS Policies
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (
    user_id = auth.uid() OR
    (user_id IS NULL AND EXISTS (
      SELECT 1 FROM account_users
      WHERE account_users.account_id = notifications.account_id
      AND account_users.user_id = auth.uid()
      AND account_users.status = 'active'
    ))
  );

CREATE POLICY "Account members can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_users.account_id = notifications.account_id
      AND account_users.user_id = auth.uid()
      AND account_users.status = 'active'
    )
  );

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_users.account_id = notifications.account_id
      AND account_users.user_id = auth.uid()
      AND account_users.status = 'active'
      AND account_users.role IN ('owner', 'admin', 'manager')
    )
  );

-- Comments for documentation
COMMENT ON TABLE notifications IS 'System notifications and alerts for users and events';
COMMENT ON COLUMN notifications.content IS 'JSON object containing additional notification content';
COMMENT ON COLUMN notifications.action_data IS 'JSON object containing additional action data';
COMMENT ON COLUMN notifications.delivery_status IS 'JSON object containing per-channel delivery status';

-- Sample data for development
INSERT INTO notifications (
  account_id, user_id, title, message, notification_type, priority,
  status, channels, created_by
) VALUES
(
  (SELECT id FROM accounts WHERE slug = 'acme-events'),
  '11111111-1111-1111-1111-111111111111',
  'Welcome to EventOS!',
  'Your account has been successfully created. Start by creating your first event.',
  'success',
  'medium',
  'sent',
  ARRAY['in_app', 'email'],
  '11111111-1111-1111-1111-111111111111'
),
(
  (SELECT id FROM accounts WHERE slug = 'acme-events'),
  '22222222-2222-2222-2222-222222222222',
  'Event Registration Confirmation',
  'Your registration for Tech Summit 2025 has been confirmed. Check your email for details.',
  'registration_confirmation',
  'high',
  'sent',
  ARRAY['in_app', 'email'],
  '11111111-1111-1111-1111-111111111111'
),
(
  (SELECT id FROM accounts WHERE slug = 'acme-events'),
  NULL,
  'System Maintenance Scheduled',
  'Scheduled maintenance will occur on March 20, 2025 from 2:00 AM to 4:00 AM EST.',
  'system_update',
  'medium',
  'sent',
  ARRAY['in_app'],
  '11111111-1111-1111-1111-111111111111'
);
