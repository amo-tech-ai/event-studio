-- =====================================================
-- EventOS Core Schema: tickets (Ticket Management)
-- =====================================================

-- Ticket management table
-- Handles ticket types, pricing, and individual ticket instances
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  
  -- Ticket Type Information
  name TEXT NOT NULL,
  slug TEXT NOT NULL, -- URL-friendly identifier
  description TEXT,
  ticket_type TEXT DEFAULT 'standard' CHECK (ticket_type IN (
    'standard', 'early_bird', 'student', 'group', 'vip', 'free', 'sponsor', 'speaker', 'staff'
  )),
  
  -- Pricing Information
  base_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'CAD',
  tax_rate DECIMAL(5,4) DEFAULT 0.13, -- 13% HST for Ontario
  tax_amount DECIMAL(10,2) GENERATED ALWAYS AS (base_price * tax_rate) STORED,
  final_price DECIMAL(10,2) GENERATED ALWAYS AS (base_price + (base_price * tax_rate)) STORED,
  
  -- Availability & Limits
  total_quantity INTEGER NOT NULL DEFAULT 100,
  sold_quantity INTEGER DEFAULT 0,
  reserved_quantity INTEGER DEFAULT 0,
  available_quantity INTEGER GENERATED ALWAYS AS (total_quantity - sold_quantity - reserved_quantity) STORED,
  
  -- Sales Period
  sale_start_date TIMESTAMPTZ,
  sale_end_date TIMESTAMPTZ,
  early_bird_end_date TIMESTAMPTZ,
  
  -- Ticket Features
  includes_meals BOOLEAN DEFAULT false,
  includes_swag BOOLEAN DEFAULT false,
  includes_access_to_sessions TEXT[], -- Array of session IDs
  includes_networking BOOLEAN DEFAULT true,
  includes_after_party BOOLEAN DEFAULT false,
  
  -- Restrictions & Requirements
  min_age INTEGER,
  max_age INTEGER,
  requires_approval BOOLEAN DEFAULT false,
  requires_company_verification BOOLEAN DEFAULT false,
  allowed_companies TEXT[], -- Array of allowed company names
  restricted_emails TEXT[], -- Array of restricted email domains
  
  -- Group & Bulk Options
  is_group_ticket BOOLEAN DEFAULT false,
  min_group_size INTEGER,
  max_group_size INTEGER,
  group_discount_percentage DECIMAL(5,2) DEFAULT 0,
  
  -- Transfer & Refund Policy
  transferable BOOLEAN DEFAULT true,
  refundable BOOLEAN DEFAULT true,
  refund_deadline TIMESTAMPTZ,
  transfer_deadline TIMESTAMPTZ,
  
  -- Ticket Display
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_hidden BOOLEAN DEFAULT false,
  custom_fields JSONB DEFAULT '{}', -- Custom fields for ticket type
  
  -- Status & Management
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'sold_out', 'cancelled')),
  created_by UUID NOT NULL REFERENCES users(id),
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Analytics & Tracking
  view_count INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,4) DEFAULT 0,
  average_sale_time INTEGER, -- Average time to sell in minutes
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT unique_event_ticket_slug UNIQUE (event_id, slug),
  CONSTRAINT valid_quantity CHECK (total_quantity > 0),
  CONSTRAINT valid_sold_quantity CHECK (sold_quantity >= 0),
  CONSTRAINT valid_reserved_quantity CHECK (reserved_quantity >= 0),
  CONSTRAINT valid_group_size CHECK (
    (is_group_ticket = false) OR 
    (is_group_ticket = true AND min_group_size > 0 AND max_group_size >= min_group_size)
  ),
  CONSTRAINT valid_sale_dates CHECK (
    sale_start_date IS NULL OR sale_end_date IS NULL OR sale_start_date <= sale_end_date
  )
);

-- Enable Row Level Security
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_tickets_account ON tickets(account_id);
CREATE INDEX idx_tickets_event ON tickets(event_id);
CREATE INDEX idx_tickets_slug ON tickets(slug);
CREATE INDEX idx_tickets_ticket_type ON tickets(ticket_type);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_sale_dates ON tickets(sale_start_date, sale_end_date);
CREATE INDEX idx_tickets_price ON tickets(base_price);
CREATE INDEX idx_tickets_availability ON tickets(available_quantity);
CREATE INDEX idx_tickets_created_by ON tickets(created_by);
CREATE INDEX idx_tickets_assigned_to ON tickets(assigned_to);
CREATE INDEX idx_tickets_display_order ON tickets(display_order);
CREATE INDEX idx_tickets_search ON tickets USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Create updated_at trigger
CREATE TRIGGER update_tickets_updated_at
  BEFORE UPDATE ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically set slug from name
CREATE OR REPLACE FUNCTION set_ticket_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := lower(regexp_replace(
      regexp_replace(NEW.name, '[^a-zA-Z0-9\s]', '', 'g'), 
      '\s+', '-', 'g'
    ));
    
    -- Ensure uniqueness within event
    WHILE EXISTS (
      SELECT 1 FROM tickets 
      WHERE tickets.slug = NEW.slug 
      AND tickets.event_id = NEW.event_id 
      AND tickets.id != NEW.id
    ) LOOP
      NEW.slug := NEW.slug || '-' || extract(epoch from now())::text;
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_ticket_slug_trigger
  BEFORE INSERT OR UPDATE ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION set_ticket_slug();

-- Function to update sold quantity when attendees are created
CREATE OR REPLACE FUNCTION update_ticket_sold_quantity()
RETURNS TRIGGER AS $$
BEGIN
  -- Update sold quantity for the ticket type
  UPDATE tickets 
  SET sold_quantity = (
    SELECT COUNT(*) 
    FROM attendees 
    WHERE attendees.event_id = NEW.event_id 
    AND attendees.ticket_type = NEW.ticket_type
    AND attendees.payment_status = 'paid'
  )
  WHERE tickets.event_id = NEW.event_id 
  AND tickets.ticket_type = NEW.ticket_type;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update sold quantity when attendee payment status changes
CREATE TRIGGER update_ticket_sold_quantity_trigger
  AFTER INSERT OR UPDATE OF payment_status ON attendees
  FOR EACH ROW
  EXECUTE FUNCTION update_ticket_sold_quantity();

-- RLS Policies
CREATE POLICY "Tickets are viewable by account members"
  ON tickets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_users.account_id = tickets.account_id
      AND account_users.user_id = auth.uid()
      AND account_users.status = 'active'
    )
  );

CREATE POLICY "Account members can create tickets"
  ON tickets FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_users.account_id = tickets.account_id
      AND account_users.user_id = auth.uid()
      AND account_users.status = 'active'
      AND account_users.role IN ('owner', 'admin', 'manager')
    )
  );

CREATE POLICY "Ticket creators and managers can update tickets"
  ON tickets FOR UPDATE
  USING (
    created_by = auth.uid() OR
    assigned_to = auth.uid() OR
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_users.account_id = tickets.account_id
      AND account_users.user_id = auth.uid()
      AND account_users.status = 'active'
      AND account_users.role IN ('owner', 'admin', 'manager')
    )
  );

-- Comments for documentation
COMMENT ON TABLE tickets IS 'Ticket types and pricing for events';
COMMENT ON COLUMN tickets.available_quantity IS 'Computed column: total_quantity - sold_quantity - reserved_quantity';
COMMENT ON COLUMN tickets.final_price IS 'Computed column: base_price + tax_amount';
COMMENT ON COLUMN tickets.custom_fields IS 'JSON object for ticket-specific custom fields';
COMMENT ON COLUMN tickets.conversion_rate IS 'Percentage of views that result in sales';

-- Sample data for development
INSERT INTO tickets (
  account_id, event_id, name, slug, description, ticket_type, base_price,
  total_quantity, sale_start_date, sale_end_date, includes_meals, 
  includes_swag, created_by
) VALUES
(
  (SELECT id FROM accounts WHERE slug = 'acme-events'),
  (SELECT id FROM events WHERE slug = 'tech-summit-2025'),
  'Early Bird General Admission',
  'early-bird-general',
  'Early bird pricing for general admission to Tech Summit 2025',
  'early_bird',
  179.00,
  100,
  NOW(),
  (NOW() + INTERVAL '30 days'),
  true,
  true,
  '11111111-1111-1111-1111-111111111111'
),
(
  (SELECT id FROM accounts WHERE slug = 'acme-events'),
  (SELECT id FROM events WHERE slug = 'tech-summit-2025'),
  'Standard General Admission',
  'standard-general',
  'Standard pricing for general admission to Tech Summit 2025',
  'standard',
  199.00,
  500,
  NOW(),
  (SELECT end_date FROM events WHERE slug = 'tech-summit-2025'),
  true,
  true,
  '22222222-2222-2222-2222-222222222222'
),
(
  (SELECT id FROM accounts WHERE slug = 'acme-events'),
  (SELECT id FROM events WHERE slug = 'tech-summit-2025'),
  'VIP Experience',
  'vip-experience',
  'VIP access with premium seating, exclusive sessions, and networking',
  'vip',
  499.00,
  50,
  NOW(),
  (SELECT end_date FROM events WHERE slug = 'tech-summit-2025'),
  true,
  true,
  '11111111-1111-1111-1111-111111111111'
);
