# EventOS MVP - Database Schema

**Project:** EventOS MVP - AI-Powered Event Management
**Version:** 1.0
**Database:** PostgreSQL 15+ (Supabase)
**Last Updated:** 2025-10-17

---

## 📋 Table of Contents

1. [Schema Overview](#schema-overview)
2. [Table Definitions](#table-definitions)
3. [Row-Level Security (RLS)](#row-level-security-rls)
4. [Database Indexes](#database-indexes)
5. [Database Functions](#database-functions)
6. [Migrations](#migrations)
7. [Example Queries](#example-queries)
8. [Data Validation](#data-validation)

---

## 🎯 Schema Overview

### Entity Relationship Diagram

```
┌─────────────────┐
│   auth.users    │ (Supabase Auth - built-in)
│                 │
│  - id (UUID)    │
│  - email        │
│  - created_at   │
└────────┬────────┘
         │
         │ organizer_id (FK)
         │
         ▼
┌─────────────────────────────────────┐
│            events                   │
│                                     │
│  - id (PK)                          │
│  - organizer_id (FK → auth.users)  │
│  - name                             │
│  - slug (UNIQUE)                    │
│  - description                      │
│  - start_date                       │
│  - location                         │
│  - capacity                         │
│  - cover_image_url                  │
│  - status (draft/published)         │
│  - visibility (public/private)      │
│  - created_at / updated_at          │
└────────┬────────────────────────────┘
         │
         ├───────────────────┬──────────────────┬─────────────────┐
         │                   │                  │                 │
         │ event_id (FK)     │ event_id (FK)    │ event_id (FK)   │
         ▼                   ▼                  ▼                 │
┌──────────────────┐  ┌──────────────┐  ┌────────────────────┐  │
│     tickets      │  │    orders    │  │  event_settings    │  │
│                  │  │              │  │                    │  │
│  - id (PK)       │  │  - id (PK)   │  │  - event_id (PK)   │  │
│  - event_id (FK) │  │  - event_id  │  │  - require_approval│  │
│  - name          │  │  - user_email│  │  - collect_phone   │  │
│  - description   │  │  - user_name │  │  - max_per_order   │  │
│  - price         │  │  - total     │  │  - sales_end_date  │  │
│  - quantity      │  │  - stripe_id │  │  - custom_fields   │  │
│  - sold          │  │  - status    │  └────────────────────┘  │
└──────────────────┘  └──────┬───────┘                          │
                             │                                  │
                             │ order_id (FK)                    │
                             ▼                                  │
                      ┌────────────────┐                        │
                      │   attendees    │                        │
                      │                │                        │
                      │  - id (PK)     │◄───────────────────────┘
                      │  - order_id    │        event_id (FK)
                      │  - event_id    │
                      │  - ticket_id   │
                      │  - name        │
                      │  - email       │
                      │  - qr_code     │
                      │  - checked_in  │
                      └────────────────┘
```

### Schema Statistics

- **Total Tables**: 5 core tables (+ 1 Supabase Auth table)
- **Total Columns**: 52 columns
- **Foreign Keys**: 6 relationships
- **Indexes**: 9 performance indexes
- **RLS Policies**: 8 security policies
- **Database Functions**: 3 helper functions

---

## 📊 Table Definitions

### 1. events

The core table storing all event information.

```sql
CREATE TABLE events (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign Keys
  organizer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Event Information
  name TEXT NOT NULL CHECK (LENGTH(name) >= 3 AND LENGTH(name) <= 200),
  slug TEXT UNIQUE NOT NULL CHECK (slug ~ '^[a-z0-9-]+$'),
  description TEXT CHECK (LENGTH(description) <= 5000),

  -- Event Details
  start_date TIMESTAMPTZ NOT NULL CHECK (start_date > NOW()),
  end_date TIMESTAMPTZ CHECK (end_date IS NULL OR end_date > start_date),
  location TEXT NOT NULL CHECK (LENGTH(location) >= 3),
  capacity INTEGER NOT NULL CHECK (capacity > 0 AND capacity <= 100000),

  -- Media
  cover_image_url TEXT CHECK (cover_image_url ~ '^https?://'),

  -- Status Management
  status TEXT NOT NULL DEFAULT 'draft' CHECK (
    status IN ('draft', 'published', 'cancelled', 'completed')
  ),
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (
    visibility IN ('public', 'private')
  ),

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_events_organizer ON events(organizer_id);
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_status ON events(status) WHERE status = 'published';
CREATE INDEX idx_events_start_date ON events(start_date) WHERE status = 'published';

-- Trigger: Auto-update updated_at
CREATE TRIGGER set_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE events IS 'Core event information and metadata';
COMMENT ON COLUMN events.slug IS 'URL-friendly unique identifier (e.g., "tech-summit-2025")';
COMMENT ON COLUMN events.capacity IS 'Maximum number of attendees allowed';
COMMENT ON COLUMN events.status IS 'Event publication status: draft, published, cancelled, completed';
```

**Field Details:**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | gen_random_uuid() | Primary key |
| `organizer_id` | UUID | NO | - | References auth.users(id) |
| `name` | TEXT | NO | - | Event name (3-200 chars) |
| `slug` | TEXT | NO | - | URL slug (lowercase, hyphens) |
| `description` | TEXT | YES | NULL | Event description (<5000 chars) |
| `start_date` | TIMESTAMPTZ | NO | - | Event start (must be future) |
| `end_date` | TIMESTAMPTZ | YES | NULL | Event end (optional) |
| `location` | TEXT | NO | - | Venue or address |
| `capacity` | INTEGER | NO | - | Max attendees (1-100,000) |
| `cover_image_url` | TEXT | YES | NULL | Cover image URL |
| `status` | TEXT | NO | 'draft' | draft/published/cancelled/completed |
| `visibility` | TEXT | NO | 'public' | public/private |
| `created_at` | TIMESTAMPTZ | NO | NOW() | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NO | NOW() | Last update timestamp |

---

### 2. tickets

Ticket tiers/types for each event.

```sql
CREATE TABLE tickets (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign Keys
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,

  -- Ticket Information
  name TEXT NOT NULL CHECK (LENGTH(name) >= 2 AND LENGTH(name) <= 100),
  description TEXT CHECK (LENGTH(description) <= 500),

  -- Pricing
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0 AND price <= 999999.99),
  currency TEXT NOT NULL DEFAULT 'USD' CHECK (currency IN ('USD', 'EUR', 'GBP')),

  -- Quantity Management
  quantity INTEGER NOT NULL CHECK (quantity > 0 AND quantity <= 100000),
  sold INTEGER NOT NULL DEFAULT 0 CHECK (sold >= 0 AND sold <= quantity),

  -- Availability
  sale_start_date TIMESTAMPTZ DEFAULT NOW(),
  sale_end_date TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_sale_dates CHECK (
    sale_end_date IS NULL OR sale_end_date > sale_start_date
  )
);

-- Indexes
CREATE INDEX idx_tickets_event ON tickets(event_id);
CREATE INDEX idx_tickets_availability ON tickets(event_id)
  WHERE sold < quantity AND (sale_end_date IS NULL OR sale_end_date > NOW());

-- Comments
COMMENT ON TABLE tickets IS 'Ticket tiers/types for events';
COMMENT ON COLUMN tickets.sold IS 'Number of tickets sold (auto-updated)';
COMMENT ON COLUMN tickets.quantity IS 'Total tickets available for this tier';
```

**Field Details:**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | gen_random_uuid() | Primary key |
| `event_id` | UUID | NO | - | References events(id) |
| `name` | TEXT | NO | - | Ticket name (2-100 chars) |
| `description` | TEXT | YES | NULL | Ticket description (<500 chars) |
| `price` | NUMERIC(10,2) | NO | - | Price in dollars (0-999999.99) |
| `currency` | TEXT | NO | 'USD' | Currency code (USD/EUR/GBP) |
| `quantity` | INTEGER | NO | - | Total available (1-100,000) |
| `sold` | INTEGER | NO | 0 | Tickets sold (auto-updated) |
| `sale_start_date` | TIMESTAMPTZ | YES | NOW() | Sales open date |
| `sale_end_date` | TIMESTAMPTZ | YES | NULL | Sales close date (optional) |
| `created_at` | TIMESTAMPTZ | NO | NOW() | Creation timestamp |

---

### 3. orders

Purchase orders from buyers.

```sql
CREATE TABLE orders (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign Keys
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,

  -- Buyer Information
  user_email TEXT NOT NULL CHECK (user_email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
  user_name TEXT NOT NULL CHECK (LENGTH(user_name) >= 2),
  user_phone TEXT CHECK (user_phone ~ '^\+?[1-9]\d{1,14}$'),

  -- Order Details
  total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount > 0),
  currency TEXT NOT NULL DEFAULT 'USD',

  -- Payment Integration
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_checkout_session_id TEXT UNIQUE,

  -- Order Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'completed', 'failed', 'refunded', 'cancelled')
  ),

  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,

  -- Constraints
  CONSTRAINT completed_at_required CHECK (
    (status = 'completed' AND completed_at IS NOT NULL) OR
    (status != 'completed' AND completed_at IS NULL)
  )
);

-- Indexes
CREATE INDEX idx_orders_event ON orders(event_id);
CREATE INDEX idx_orders_email ON orders(user_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_stripe_payment ON orders(stripe_payment_intent_id);

-- Comments
COMMENT ON TABLE orders IS 'Purchase orders for event tickets';
COMMENT ON COLUMN orders.stripe_payment_intent_id IS 'Stripe Payment Intent ID for tracking';
COMMENT ON COLUMN orders.status IS 'Order status: pending, completed, failed, refunded, cancelled';
COMMENT ON COLUMN orders.metadata IS 'Additional order data (e.g., discount codes, notes)';
```

**Field Details:**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | gen_random_uuid() | Primary key |
| `event_id` | UUID | NO | - | References events(id) |
| `user_email` | TEXT | NO | - | Buyer email (validated) |
| `user_name` | TEXT | NO | - | Buyer name (≥2 chars) |
| `user_phone` | TEXT | YES | NULL | Buyer phone (E.164 format) |
| `total_amount` | NUMERIC(10,2) | NO | - | Total paid (>0) |
| `currency` | TEXT | NO | 'USD' | Currency code |
| `stripe_payment_intent_id` | TEXT | YES | NULL | Stripe payment ID (unique) |
| `stripe_checkout_session_id` | TEXT | YES | NULL | Stripe session ID (unique) |
| `status` | TEXT | NO | 'pending' | Order status |
| `metadata` | JSONB | YES | {} | Extra data (JSON) |
| `created_at` | TIMESTAMPTZ | NO | NOW() | Order creation |
| `completed_at` | TIMESTAMPTZ | YES | NULL | Payment completion |

---

### 4. attendees

Individual ticket holders (one record per ticket sold).

```sql
CREATE TABLE attendees (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign Keys
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE RESTRICT,

  -- Attendee Information
  attendee_name TEXT NOT NULL CHECK (LENGTH(attendee_name) >= 2),
  attendee_email TEXT NOT NULL CHECK (attendee_email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$'),

  -- Ticket Details
  qr_code TEXT UNIQUE NOT NULL,
  ticket_number TEXT UNIQUE NOT NULL,

  -- Check-in Status
  checked_in BOOLEAN NOT NULL DEFAULT false,
  checked_in_at TIMESTAMPTZ,
  checked_in_by TEXT,

  -- Email Status
  email_sent BOOLEAN NOT NULL DEFAULT false,
  email_sent_at TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT checkin_timestamp CHECK (
    (checked_in = true AND checked_in_at IS NOT NULL) OR
    (checked_in = false AND checked_in_at IS NULL)
  )
);

-- Indexes
CREATE INDEX idx_attendees_order ON attendees(order_id);
CREATE INDEX idx_attendees_event ON attendees(event_id);
CREATE INDEX idx_attendees_qr ON attendees(qr_code);
CREATE INDEX idx_attendees_email ON attendees(attendee_email);

-- Comments
COMMENT ON TABLE attendees IS 'Individual ticket holders for events';
COMMENT ON COLUMN attendees.qr_code IS 'Unique QR code for check-in (UUID format)';
COMMENT ON COLUMN attendees.ticket_number IS 'Human-readable ticket number (e.g., "EVT-001-0001")';
COMMENT ON COLUMN attendees.checked_in IS 'Whether attendee has checked in at event';
```

**Field Details:**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | gen_random_uuid() | Primary key |
| `order_id` | UUID | NO | - | References orders(id) |
| `event_id` | UUID | NO | - | References events(id) |
| `ticket_id` | UUID | NO | - | References tickets(id) |
| `attendee_name` | TEXT | NO | - | Attendee name (≥2 chars) |
| `attendee_email` | TEXT | NO | - | Attendee email (validated) |
| `qr_code` | TEXT | NO | - | QR code data (unique UUID) |
| `ticket_number` | TEXT | NO | - | Human-readable ticket # |
| `checked_in` | BOOLEAN | NO | false | Check-in status |
| `checked_in_at` | TIMESTAMPTZ | YES | NULL | Check-in timestamp |
| `checked_in_by` | TEXT | YES | NULL | Who checked them in |
| `email_sent` | BOOLEAN | NO | false | Ticket email sent |
| `email_sent_at` | TIMESTAMPTZ | YES | NULL | Email send timestamp |
| `created_at` | TIMESTAMPTZ | NO | NOW() | Creation timestamp |

---

### 5. event_settings

Optional event configuration (one-to-one with events).

```sql
CREATE TABLE event_settings (
  -- Primary Key (also FK)
  event_id UUID PRIMARY KEY REFERENCES events(id) ON DELETE CASCADE,

  -- Registration Settings
  require_approval BOOLEAN NOT NULL DEFAULT false,
  collect_phone BOOLEAN NOT NULL DEFAULT false,
  max_tickets_per_order INTEGER NOT NULL DEFAULT 10 CHECK (
    max_tickets_per_order > 0 AND max_tickets_per_order <= 100
  ),

  -- Sales Settings
  sales_end_date TIMESTAMPTZ,
  early_bird_end_date TIMESTAMPTZ,

  -- Custom Fields (JSONB)
  custom_fields JSONB DEFAULT '[]',
  -- Example: [{"name": "Company", "type": "text", "required": true}]

  -- Notifications
  send_reminder_email BOOLEAN NOT NULL DEFAULT true,
  reminder_days_before INTEGER DEFAULT 3 CHECK (reminder_days_before > 0),

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_sales_dates CHECK (
    sales_end_date IS NULL OR
    sales_end_date <= (SELECT start_date FROM events WHERE id = event_id)
  )
);

-- Trigger: Auto-update updated_at
CREATE TRIGGER set_event_settings_updated_at
  BEFORE UPDATE ON event_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE event_settings IS 'Optional configuration for events';
COMMENT ON COLUMN event_settings.custom_fields IS 'JSON array of custom registration fields';
COMMENT ON COLUMN event_settings.require_approval IS 'Whether organizer must approve registrations';
```

**Field Details:**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `event_id` | UUID | NO | - | PK + FK to events(id) |
| `require_approval` | BOOLEAN | NO | false | Require organizer approval |
| `collect_phone` | BOOLEAN | NO | false | Require phone number |
| `max_tickets_per_order` | INTEGER | NO | 10 | Max tickets per purchase (1-100) |
| `sales_end_date` | TIMESTAMPTZ | YES | NULL | When ticket sales close |
| `early_bird_end_date` | TIMESTAMPTZ | YES | NULL | Early bird pricing end |
| `custom_fields` | JSONB | YES | [] | Custom registration fields (JSON) |
| `send_reminder_email` | BOOLEAN | NO | true | Send reminder emails |
| `reminder_days_before` | INTEGER | YES | 3 | Days before event to remind |
| `created_at` | TIMESTAMPTZ | NO | NOW() | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NO | NOW() | Last update timestamp |

---

## 🔒 Row-Level Security (RLS)

### Enable RLS on All Tables

```sql
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_settings ENABLE ROW LEVEL SECURITY;
```

### Policy 1: Events - Organizers Full Access

```sql
CREATE POLICY "organizers_crud_own_events"
ON events
FOR ALL
USING (auth.uid() = organizer_id)
WITH CHECK (auth.uid() = organizer_id);
```

**Purpose**: Organizers can create, read, update, delete their own events.

### Policy 2: Events - Public Read Published

```sql
CREATE POLICY "public_view_published_events"
ON events
FOR SELECT
USING (status = 'published' AND visibility = 'public');
```

**Purpose**: Anyone can view published public events (no auth required).

### Policy 3: Tickets - Public Read for Published Events

```sql
CREATE POLICY "public_view_tickets_for_published_events"
ON tickets
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM events
    WHERE events.id = tickets.event_id
      AND events.status = 'published'
      AND events.visibility = 'public'
  )
);
```

**Purpose**: Anyone can view tickets for published events.

### Policy 4: Tickets - Organizers Full Access

```sql
CREATE POLICY "organizers_manage_own_tickets"
ON tickets
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM events
    WHERE events.id = tickets.event_id
      AND events.organizer_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM events
    WHERE events.id = tickets.event_id
      AND events.organizer_id = auth.uid()
  )
);
```

**Purpose**: Organizers can manage tickets for their events.

### Policy 5: Orders - Users View Own Orders

```sql
CREATE POLICY "users_view_own_orders"
ON orders
FOR SELECT
USING (user_email = auth.jwt()->>'email');
```

**Purpose**: Users can only see orders placed with their email.

### Policy 6: Orders - Organizers View Event Orders

```sql
CREATE POLICY "organizers_view_event_orders"
ON orders
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM events
    WHERE events.id = orders.event_id
      AND events.organizer_id = auth.uid()
  )
);
```

**Purpose**: Organizers can view all orders for their events.

### Policy 7: Attendees - Multi-Party Access

```sql
CREATE POLICY "attendees_view_access"
ON attendees
FOR SELECT
USING (
  -- Attendees can see their own tickets
  attendee_email = auth.jwt()->>'email'
  OR
  -- Organizers can see all attendees for their events
  EXISTS (
    SELECT 1 FROM events
    WHERE events.id = attendees.event_id
      AND events.organizer_id = auth.uid()
  )
);
```

**Purpose**: Attendees see their tickets, organizers see all attendees for their events.

### Policy 8: Event Settings - Organizers Only

```sql
CREATE POLICY "organizers_manage_own_settings"
ON event_settings
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM events
    WHERE events.id = event_settings.event_id
      AND events.organizer_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM events
    WHERE events.id = event_settings.event_id
      AND events.organizer_id = auth.uid()
  )
);
```

**Purpose**: Only organizers can configure settings for their events.

---

## 📈 Database Indexes

### Performance Indexes

```sql
-- Events
CREATE INDEX idx_events_organizer ON events(organizer_id);
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_status ON events(status) WHERE status = 'published';
CREATE INDEX idx_events_start_date ON events(start_date) WHERE status = 'published';

-- Tickets
CREATE INDEX idx_tickets_event ON tickets(event_id);
CREATE INDEX idx_tickets_availability ON tickets(event_id)
  WHERE sold < quantity AND (sale_end_date IS NULL OR sale_end_date > NOW());

-- Orders
CREATE INDEX idx_orders_event ON orders(event_id);
CREATE INDEX idx_orders_email ON orders(user_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_stripe_payment ON orders(stripe_payment_intent_id);

-- Attendees
CREATE INDEX idx_attendees_order ON attendees(order_id);
CREATE INDEX idx_attendees_event ON attendees(event_id);
CREATE INDEX idx_attendees_qr ON attendees(qr_code);
CREATE INDEX idx_attendees_email ON attendees(attendee_email);
```

### Index Usage Justification

| Index | Table | Columns | Purpose |
|-------|-------|---------|---------|
| `idx_events_organizer` | events | organizer_id | Dashboard: "My Events" query |
| `idx_events_slug` | events | slug | Fast event lookup by URL slug |
| `idx_events_status` | events | status (WHERE published) | Public event listing |
| `idx_events_start_date` | events | start_date (WHERE published) | Upcoming events query |
| `idx_tickets_event` | tickets | event_id | Fetch tickets for event page |
| `idx_tickets_availability` | tickets | event_id (WHERE available) | Show only available tickets |
| `idx_orders_event` | orders | event_id | Sales report per event |
| `idx_orders_email` | orders | user_email | "My Orders" page |
| `idx_orders_stripe_payment` | orders | stripe_payment_intent_id | Webhook lookup |
| `idx_attendees_qr` | attendees | qr_code | Fast check-in by QR scan |

---

## ⚙️ Database Functions

### Function 1: Auto-Update Timestamp

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**Usage**: Automatically updates `updated_at` column on row updates.

### Function 2: Auto-Increment Tickets Sold

```sql
CREATE OR REPLACE FUNCTION increment_tickets_sold()
RETURNS TRIGGER AS $$
BEGIN
  -- When attendee is created, increment ticket's sold count
  IF TG_OP = 'INSERT' THEN
    UPDATE tickets
    SET sold = sold + 1
    WHERE id = NEW.ticket_id;
  END IF;

  -- When attendee is deleted, decrement ticket's sold count
  IF TG_OP = 'DELETE' THEN
    UPDATE tickets
    SET sold = sold - 1
    WHERE id = OLD.ticket_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger
CREATE TRIGGER update_tickets_sold_count
  AFTER INSERT OR DELETE ON attendees
  FOR EACH ROW
  EXECUTE FUNCTION increment_tickets_sold();
```

**Purpose**: Keep `tickets.sold` count in sync with attendees.

### Function 3: Generate Ticket Number

```sql
CREATE OR REPLACE FUNCTION generate_ticket_number(
  p_event_id UUID,
  p_order_number INTEGER
)
RETURNS TEXT AS $$
DECLARE
  event_slug TEXT;
  ticket_count INTEGER;
BEGIN
  -- Get event slug
  SELECT slug INTO event_slug
  FROM events
  WHERE id = p_event_id;

  -- Count existing tickets for this event
  SELECT COUNT(*) INTO ticket_count
  FROM attendees
  WHERE event_id = p_event_id;

  -- Format: SLUG-ORDER-TICKET (e.g., "SUMMIT-0042-0001")
  RETURN UPPER(event_slug) || '-' ||
         LPAD(p_order_number::TEXT, 4, '0') || '-' ||
         LPAD((ticket_count + 1)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;
```

**Usage**: Generate human-readable ticket numbers like "TECH-SUMMIT-0001-0003".

---

## 🚀 Migrations

### Migration 001: Initial Schema

```sql
-- supabase/migrations/20250117000001_initial_schema.sql

BEGIN;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (LENGTH(name) >= 3 AND LENGTH(name) <= 200),
  slug TEXT UNIQUE NOT NULL CHECK (slug ~ '^[a-z0-9-]+$'),
  description TEXT CHECK (LENGTH(description) <= 5000),
  start_date TIMESTAMPTZ NOT NULL CHECK (start_date > NOW()),
  end_date TIMESTAMPTZ CHECK (end_date IS NULL OR end_date > start_date),
  location TEXT NOT NULL CHECK (LENGTH(location) >= 3),
  capacity INTEGER NOT NULL CHECK (capacity > 0 AND capacity <= 100000),
  cover_image_url TEXT CHECK (cover_image_url ~ '^https?://'),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (
    status IN ('draft', 'published', 'cancelled', 'completed')
  ),
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (
    visibility IN ('public', 'private')
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for events
CREATE INDEX idx_events_organizer ON events(organizer_id);
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_status ON events(status) WHERE status = 'published';
CREATE INDEX idx_events_start_date ON events(start_date) WHERE status = 'published';

-- Create trigger for events
CREATE TRIGGER set_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create tickets table
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (LENGTH(name) >= 2 AND LENGTH(name) <= 100),
  description TEXT CHECK (LENGTH(description) <= 500),
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0 AND price <= 999999.99),
  currency TEXT NOT NULL DEFAULT 'USD' CHECK (currency IN ('USD', 'EUR', 'GBP')),
  quantity INTEGER NOT NULL CHECK (quantity > 0 AND quantity <= 100000),
  sold INTEGER NOT NULL DEFAULT 0 CHECK (sold >= 0 AND sold <= quantity),
  sale_start_date TIMESTAMPTZ DEFAULT NOW(),
  sale_end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT valid_sale_dates CHECK (
    sale_end_date IS NULL OR sale_end_date > sale_start_date
  )
);

-- Create indexes for tickets
CREATE INDEX idx_tickets_event ON tickets(event_id);
CREATE INDEX idx_tickets_availability ON tickets(event_id)
  WHERE sold < quantity AND (sale_end_date IS NULL OR sale_end_date > NOW());

-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL CHECK (user_email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
  user_name TEXT NOT NULL CHECK (LENGTH(user_name) >= 2),
  user_phone TEXT CHECK (user_phone ~ '^\+?[1-9]\d{1,14}$'),
  total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount > 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_checkout_session_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'completed', 'failed', 'refunded', 'cancelled')
  ),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  CONSTRAINT completed_at_required CHECK (
    (status = 'completed' AND completed_at IS NOT NULL) OR
    (status != 'completed' AND completed_at IS NULL)
  )
);

-- Create indexes for orders
CREATE INDEX idx_orders_event ON orders(event_id);
CREATE INDEX idx_orders_email ON orders(user_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_stripe_payment ON orders(stripe_payment_intent_id);

-- Create attendees table
CREATE TABLE attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE RESTRICT,
  attendee_name TEXT NOT NULL CHECK (LENGTH(attendee_name) >= 2),
  attendee_email TEXT NOT NULL CHECK (attendee_email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
  qr_code TEXT UNIQUE NOT NULL,
  ticket_number TEXT UNIQUE NOT NULL,
  checked_in BOOLEAN NOT NULL DEFAULT false,
  checked_in_at TIMESTAMPTZ,
  checked_in_by TEXT,
  email_sent BOOLEAN NOT NULL DEFAULT false,
  email_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT checkin_timestamp CHECK (
    (checked_in = true AND checked_in_at IS NOT NULL) OR
    (checked_in = false AND checked_in_at IS NULL)
  )
);

-- Create indexes for attendees
CREATE INDEX idx_attendees_order ON attendees(order_id);
CREATE INDEX idx_attendees_event ON attendees(event_id);
CREATE INDEX idx_attendees_qr ON attendees(qr_code);
CREATE INDEX idx_attendees_email ON attendees(attendee_email);

-- Create trigger for attendees (auto-increment tickets.sold)
CREATE OR REPLACE FUNCTION increment_tickets_sold()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE tickets SET sold = sold + 1 WHERE id = NEW.ticket_id;
  END IF;
  IF TG_OP = 'DELETE' THEN
    UPDATE tickets SET sold = sold - 1 WHERE id = OLD.ticket_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tickets_sold_count
  AFTER INSERT OR DELETE ON attendees
  FOR EACH ROW
  EXECUTE FUNCTION increment_tickets_sold();

-- Create event_settings table
CREATE TABLE event_settings (
  event_id UUID PRIMARY KEY REFERENCES events(id) ON DELETE CASCADE,
  require_approval BOOLEAN NOT NULL DEFAULT false,
  collect_phone BOOLEAN NOT NULL DEFAULT false,
  max_tickets_per_order INTEGER NOT NULL DEFAULT 10 CHECK (
    max_tickets_per_order > 0 AND max_tickets_per_order <= 100
  ),
  sales_end_date TIMESTAMPTZ,
  early_bird_end_date TIMESTAMPTZ,
  custom_fields JSONB DEFAULT '[]',
  send_reminder_email BOOLEAN NOT NULL DEFAULT true,
  reminder_days_before INTEGER DEFAULT 3 CHECK (reminder_days_before > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create trigger for event_settings
CREATE TRIGGER set_event_settings_updated_at
  BEFORE UPDATE ON event_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on all tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_settings ENABLE ROW LEVEL SECURITY;

COMMIT;
```

### Migration 002: RLS Policies

```sql
-- supabase/migrations/20250117000002_rls_policies.sql

BEGIN;

-- Events: Organizers full access
CREATE POLICY "organizers_crud_own_events"
ON events FOR ALL
USING (auth.uid() = organizer_id)
WITH CHECK (auth.uid() = organizer_id);

-- Events: Public read published
CREATE POLICY "public_view_published_events"
ON events FOR SELECT
USING (status = 'published' AND visibility = 'public');

-- Tickets: Public read for published events
CREATE POLICY "public_view_tickets_for_published_events"
ON tickets FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM events
    WHERE events.id = tickets.event_id
      AND events.status = 'published'
      AND events.visibility = 'public'
  )
);

-- Tickets: Organizers full access
CREATE POLICY "organizers_manage_own_tickets"
ON tickets FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM events
    WHERE events.id = tickets.event_id
      AND events.organizer_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM events
    WHERE events.id = tickets.event_id
      AND events.organizer_id = auth.uid()
  )
);

-- Orders: Users view own orders
CREATE POLICY "users_view_own_orders"
ON orders FOR SELECT
USING (user_email = auth.jwt()->>'email');

-- Orders: Organizers view event orders
CREATE POLICY "organizers_view_event_orders"
ON orders FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM events
    WHERE events.id = orders.event_id
      AND events.organizer_id = auth.uid()
  )
);

-- Attendees: Multi-party access
CREATE POLICY "attendees_view_access"
ON attendees FOR SELECT
USING (
  attendee_email = auth.jwt()->>'email'
  OR
  EXISTS (
    SELECT 1 FROM events
    WHERE events.id = attendees.event_id
      AND events.organizer_id = auth.uid()
  )
);

-- Event Settings: Organizers only
CREATE POLICY "organizers_manage_own_settings"
ON event_settings FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM events
    WHERE events.id = event_settings.event_id
      AND events.organizer_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM events
    WHERE events.id = event_settings.event_id
      AND events.organizer_id = auth.uid()
  )
);

COMMIT;
```

---

## 🔍 Example Queries

### 1. Get All Published Events

```sql
SELECT
  e.id,
  e.name,
  e.slug,
  e.start_date,
  e.location,
  e.capacity,
  e.cover_image_url,
  COUNT(DISTINCT a.id) as attendee_count,
  COALESCE(SUM(t.sold), 0) as tickets_sold
FROM events e
LEFT JOIN tickets t ON t.event_id = e.id
LEFT JOIN attendees a ON a.event_id = e.id
WHERE e.status = 'published'
  AND e.visibility = 'public'
  AND e.start_date > NOW()
GROUP BY e.id
ORDER BY e.start_date ASC;
```

### 2. Get Event Details with Tickets

```sql
SELECT
  e.*,
  json_agg(
    json_build_object(
      'id', t.id,
      'name', t.name,
      'price', t.price,
      'quantity', t.quantity,
      'sold', t.sold,
      'available', (t.quantity - t.sold)
    )
  ) FILTER (WHERE t.id IS NOT NULL) as tickets
FROM events e
LEFT JOIN tickets t ON t.event_id = e.id
WHERE e.slug = 'tech-summit-2025'
GROUP BY e.id;
```

### 3. Get My Events with Sales Summary

```sql
SELECT
  e.id,
  e.name,
  e.start_date,
  e.status,
  COUNT(DISTINCT o.id) as total_orders,
  COUNT(DISTINCT a.id) as total_attendees,
  COALESCE(SUM(o.total_amount) FILTER (WHERE o.status = 'completed'), 0) as total_revenue
FROM events e
LEFT JOIN orders o ON o.event_id = e.id
LEFT JOIN attendees a ON a.event_id = e.id
WHERE e.organizer_id = auth.uid()
GROUP BY e.id
ORDER BY e.start_date DESC;
```

### 4. Get Attendees for Event (with Check-in Status)

```sql
SELECT
  a.id,
  a.attendee_name,
  a.attendee_email,
  a.ticket_number,
  a.qr_code,
  a.checked_in,
  a.checked_in_at,
  t.name as ticket_type,
  o.user_email as buyer_email,
  o.total_amount as order_total
FROM attendees a
JOIN tickets t ON t.id = a.ticket_id
JOIN orders o ON o.id = a.order_id
WHERE a.event_id = 'event-uuid-here'
ORDER BY a.created_at DESC;
```

### 5. Check Ticket Availability

```sql
SELECT
  t.id,
  t.name,
  t.quantity,
  t.sold,
  (t.quantity - t.sold) as available,
  CASE
    WHEN (t.quantity - t.sold) = 0 THEN 'sold_out'
    WHEN (t.quantity - t.sold) < 10 THEN 'low_stock'
    ELSE 'available'
  END as status
FROM tickets t
WHERE t.event_id = 'event-uuid-here'
  AND (t.sale_end_date IS NULL OR t.sale_end_date > NOW());
```

---

## ✅ Data Validation

### Application-Level Validation (TypeScript)

```typescript
// src/lib/validation.ts
import { z } from "zod";

export const EventSchema = z.object({
  name: z.string().min(3).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  description: z.string().max(5000).optional(),
  start_date: z.date().refine((date) => date > new Date(), {
    message: "Event must be in the future"
  }),
  location: z.string().min(3),
  capacity: z.number().min(1).max(100000)
});

export const TicketSchema = z.object({
  name: z.string().min(2).max(100),
  price: z.number().min(0).max(999999.99),
  quantity: z.number().min(1).max(100000)
});

export const OrderSchema = z.object({
  user_email: z.string().email(),
  user_name: z.string().min(2),
  user_phone: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional()
});
```

### Database Constraints Summary

| Constraint Type | Examples |
|----------------|----------|
| **NOT NULL** | All primary keys, organizer_id, name, email, etc. |
| **CHECK** | Email regex, price >= 0, capacity > 0, status IN (...) |
| **UNIQUE** | slug, qr_code, ticket_number, stripe_payment_intent_id |
| **FOREIGN KEY** | event_id → events.id, organizer_id → auth.users.id |
| **TRIGGER** | Auto-update updated_at, auto-increment tickets.sold |

---

## 📊 Schema Statistics

| Metric | Count |
|--------|-------|
| **Tables** | 5 |
| **Columns** | 52 |
| **Indexes** | 14 |
| **Foreign Keys** | 6 |
| **RLS Policies** | 8 |
| **Triggers** | 3 |
| **Functions** | 3 |
| **CHECK Constraints** | 18 |
| **UNIQUE Constraints** | 6 |

---

**Next Document:** `07-MVP-IMPLEMENTATION-GUIDE.md` (Step-by-step coding guide)
**Status:** ✅ Database Schema Complete
**Ready for:** Migration execution and implementation
