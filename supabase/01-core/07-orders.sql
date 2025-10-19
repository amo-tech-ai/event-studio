-- =====================================================
-- EventOS Core Schema: orders (Order Management)
-- =====================================================

-- Order management table
-- Handles ticket purchases, payments, and order processing
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Optional link to registered user
  
  -- Order Information
  order_number TEXT UNIQUE NOT NULL, -- Human-readable order number
  order_type TEXT DEFAULT 'ticket_purchase' CHECK (order_type IN (
    'ticket_purchase', 'refund', 'transfer', 'upgrade', 'cancellation'
  )),
  
  -- Customer Information
  customer_email TEXT NOT NULL,
  customer_first_name TEXT,
  customer_last_name TEXT,
  customer_phone TEXT,
  customer_company TEXT,
  
  -- Order Status
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'processing', 'paid', 'failed', 'cancelled', 'refunded', 'partially_refunded'
  )),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN (
    'pending', 'paid', 'failed', 'refunded', 'partially_refunded'
  )),
  
  -- Pricing Information
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'CAD',
  
  -- Payment Information
  payment_method TEXT CHECK (payment_method IN (
    'credit_card', 'debit_card', 'paypal', 'stripe', 'bank_transfer', 'cash', 'check'
  )),
  payment_reference TEXT, -- External payment system reference
  payment_intent_id TEXT, -- Stripe payment intent ID
  payment_date TIMESTAMPTZ,
  payment_failure_reason TEXT,
  
  -- Discount & Promo Information
  promo_code TEXT,
  discount_percentage DECIMAL(5,2) DEFAULT 0,
  discount_reason TEXT,
  
  -- Order Details
  ticket_count INTEGER NOT NULL DEFAULT 0,
  order_items JSONB DEFAULT '[]', -- Array of order items with details
  order_metadata JSONB DEFAULT '{}', -- Additional order information
  
  -- Shipping & Delivery
  delivery_method TEXT DEFAULT 'digital' CHECK (delivery_method IN (
    'digital', 'pickup', 'shipping', 'will_call'
  )),
  shipping_address JSONB, -- Shipping address if applicable
  tracking_number TEXT,
  delivery_date TIMESTAMPTZ,
  
  -- Refund Information
  refund_amount DECIMAL(10,2) DEFAULT 0,
  refund_reason TEXT,
  refund_date TIMESTAMPTZ,
  refund_reference TEXT,
  
  -- Order Processing
  processed_at TIMESTAMPTZ,
  processed_by UUID REFERENCES users(id),
  notes TEXT,
  internal_notes TEXT, -- Internal notes not visible to customer
  
  -- Communication
  confirmation_sent_at TIMESTAMPTZ,
  reminder_sent_at TIMESTAMPTZ,
  follow_up_sent_at TIMESTAMPTZ,
  
  -- Assignment & Management
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  created_by UUID REFERENCES users(id),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_amounts CHECK (
    subtotal >= 0 AND 
    tax_amount >= 0 AND 
    discount_amount >= 0 AND 
    total_amount >= 0 AND
    refund_amount >= 0
  ),
  CONSTRAINT valid_ticket_count CHECK (ticket_count >= 0)
);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_orders_account ON orders(account_id);
CREATE INDEX idx_orders_event ON orders(event_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_payment_reference ON orders(payment_reference);
CREATE INDEX idx_orders_payment_intent_id ON orders(payment_intent_id);
CREATE INDEX idx_orders_created_by ON orders(created_by);
CREATE INDEX idx_orders_assigned_to ON orders(assigned_to);
CREATE INDEX idx_orders_payment_date ON orders(payment_date);
CREATE INDEX idx_orders_total_amount ON orders(total_amount);
CREATE INDEX idx_orders_search ON orders USING gin(to_tsvector('english', order_number || ' ' || customer_email || ' ' || COALESCE(customer_first_name, '') || ' ' || COALESCE(customer_last_name, '')));

-- Create updated_at trigger
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to generate unique order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := 'ORD-' || 
      TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
      LPAD(EXTRACT(EPOCH FROM NOW())::text, 10, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_order_number_trigger
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION generate_order_number();

-- Function to update order totals
CREATE OR REPLACE FUNCTION update_order_totals()
RETURNS TRIGGER AS $$
BEGIN
  -- Recalculate total amount
  NEW.total_amount := NEW.subtotal + NEW.tax_amount - NEW.discount_amount;
  
  -- Ensure total is not negative
  IF NEW.total_amount < 0 THEN
    NEW.total_amount := 0;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_order_totals_trigger
  BEFORE INSERT OR UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_order_totals();

-- Function to update order status based on payment
CREATE OR REPLACE FUNCTION update_order_payment_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update order status based on payment status
  IF NEW.payment_status = 'paid' AND OLD.payment_status != 'paid' THEN
    NEW.status := 'paid';
    NEW.payment_date := NOW();
  ELSIF NEW.payment_status = 'failed' AND OLD.payment_status != 'failed' THEN
    NEW.status := 'failed';
  ELSIF NEW.payment_status = 'refunded' AND OLD.payment_status != 'refunded' THEN
    NEW.status := 'refunded';
    NEW.refund_date := NOW();
  ELSIF NEW.payment_status = 'partially_refunded' AND OLD.payment_status != 'partially_refunded' THEN
    NEW.status := 'partially_refunded';
    NEW.refund_date := NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_order_payment_status_trigger
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_order_payment_status();

-- RLS Policies
CREATE POLICY "Orders are viewable by account members"
  ON orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_users.account_id = orders.account_id
      AND account_users.user_id = auth.uid()
      AND account_users.status = 'active'
    )
  );

CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (
    customer_email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR
    user_id = auth.uid()
  );

CREATE POLICY "Account members can create orders"
  ON orders FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_users.account_id = orders.account_id
      AND account_users.user_id = auth.uid()
      AND account_users.status = 'active'
    )
  );

CREATE POLICY "Order creators and managers can update orders"
  ON orders FOR UPDATE
  USING (
    created_by = auth.uid() OR
    assigned_to = auth.uid() OR
    EXISTS (
      SELECT 1 FROM account_users
      WHERE account_users.account_id = orders.account_id
      AND account_users.user_id = auth.uid()
      AND account_users.status = 'active'
      AND account_users.role IN ('owner', 'admin', 'manager')
    )
  );

-- Comments for documentation
COMMENT ON TABLE orders IS 'Order management for ticket purchases and payments';
COMMENT ON COLUMN orders.order_number IS 'Human-readable unique order identifier';
COMMENT ON COLUMN orders.order_items IS 'JSON array of order items with ticket details';
COMMENT ON COLUMN orders.order_metadata IS 'JSON object for additional order information';
COMMENT ON COLUMN orders.shipping_address IS 'JSON object containing shipping address details';

-- Sample data for development
INSERT INTO orders (
  account_id, event_id, customer_email, customer_first_name, customer_last_name,
  subtotal, tax_amount, total_amount, ticket_count, status, payment_status,
  payment_method, created_by
) VALUES
(
  (SELECT id FROM accounts WHERE slug = 'acme-events'),
  (SELECT id FROM events WHERE slug = 'tech-summit-2025'),
  'john.smith@techcorp.com',
  'John',
  'Smith',
  179.00,
  23.27,
  202.27,
  1,
  'paid',
  'paid',
  'credit_card',
  '11111111-1111-1111-1111-111111111111'
),
(
  (SELECT id FROM accounts WHERE slug = 'acme-events'),
  (SELECT id FROM events WHERE slug = 'tech-summit-2025'),
  'sarah.j@startup.io',
  'Sarah',
  'Johnson',
  0.00,
  0.00,
  0.00,
  1,
  'paid',
  'paid',
  'free',
  '22222222-2222-2222-2222-222222222222'
);
