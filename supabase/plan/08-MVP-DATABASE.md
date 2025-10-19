# 🗄️ EventOS MVP Database Schema

**Document:** MVP Database Architecture
**Version:** 1.0
**Date:** 2025-10-17
**Philosophy:** Include all core tables needed for event management, but keep fields minimal

---

## 📋 Overview

This document defines the database schema for the EventOS MVP. While we're building a minimal product, we need proper foundational tables to support core event management workflows.

### Design Principles

1. **Include core tables** - Don't skip essential entities
2. **Minimize fields** - Only include fields needed for MVP
3. **Plan for growth** - Schema can be extended in Phase 2+
4. **Maintain referential integrity** - Proper foreign keys and constraints
5. **Security first** - RLS policies on all tables

---

## 🎯 MVP Table Categories

### Core MVP Tables (25 tables)

| **Category** | **Tables** | **Purpose** |
|--------------|-----------|------------|
| **Identity** | users, organizers, attendees | Who uses the system |
| **CRM** | contacts, companies, interactions, notes | Customer relationship management |
| **Events** | events, venues, event_sessions | What events exist |
| **Ticketing** | ticket_tiers, orders, order_items | How tickets are sold |
| **Marketing** | promo_codes | Discount codes & campaigns |
| **Configuration** | event_settings, taxes_and_fees | Event customization & compliance |
| **Forms** | questions, question_answers | Custom registration forms |
| **Finance** | payments, budgets, order_refunds | Money tracking & refunds |
| **Operations** | tasks, vendors, event_vendors | Event planning |

**Total: 25 Core Tables** (increased from 19 → added 6 critical tables)

---

## 👥 Identity Tables

### Table: users

**Purpose:** Central authentication and user management for all system users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'attendee', -- 'admin', 'organizer', 'attendee'
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_view_own" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (auth.uid() = id);
```

**MVP Fields:**
- ✅ id, email, full_name, phone, role
- ❌ Skip: last_login, preferences, settings, bio, social_links

---

### Table: organizers

**Purpose:** Extended profile for event organizers with business details

```sql
CREATE TABLE organizers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_name TEXT NOT NULL,
  organization_type TEXT, -- 'company', 'nonprofit', 'individual'
  website TEXT,
  description TEXT,
  verification_status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
  stripe_account_id TEXT, -- For payment processing
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_organizers_user_id ON organizers(user_id);
CREATE INDEX idx_organizers_verification ON organizers(verification_status);

-- RLS Policies
ALTER TABLE organizers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "organizers_view_own" ON organizers
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "organizers_manage_own" ON organizers
  FOR ALL USING (user_id = auth.uid());
```

**MVP Fields:**
- ✅ Basic org info, Stripe integration, verification status
- ❌ Skip: team_size, founding_date, tax_info

---

### Table: attendees

**Purpose:** People who register for events (can be guests or registered users)

```sql
CREATE TABLE attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- NULL if guest checkout
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_attendees_user_id ON attendees(user_id);
CREATE INDEX idx_attendees_email ON attendees(email);

-- RLS Policies
ALTER TABLE attendees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "attendees_view_own" ON attendees
  FOR SELECT USING (
    user_id = auth.uid() OR
    email = auth.jwt()->>'email'
  );
```

**Note:** Attendees can exist without user accounts (guest checkout). Link to user if they create account later.

---

## 💼 CRM Tables

### Table: contacts

**Purpose:** Central customer database for all contacts across events (360-degree customer view)

```sql
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID NOT NULL REFERENCES organizers(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,

  -- Basic Info
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  job_title TEXT,

  -- Lead Info
  lead_source TEXT, -- 'website', 'referral', 'event', 'social_media', 'cold_outreach'
  lead_status TEXT DEFAULT 'new', -- 'new', 'contacted', 'qualified', 'customer', 'lost'

  -- Engagement
  engagement_score INTEGER DEFAULT 0, -- 0-100 calculated from interactions
  last_contact_date TIMESTAMPTZ,

  -- Demographics
  city TEXT,
  state TEXT,
  country TEXT,
  timezone TEXT,

  -- Preferences
  communication_preferences JSONB DEFAULT '{}', -- {email: true, sms: false, phone: true}
  interests JSONB DEFAULT '[]', -- ['technology', 'business', 'networking']

  -- Tags for segmentation
  tags TEXT[] DEFAULT '{}', -- ['vip', 'speaker', 'sponsor']

  -- Lifecycle
  customer_since TIMESTAMPTZ,
  lifetime_value DECIMAL(10,2) DEFAULT 0,

  -- Notes
  notes TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_contacts_organizer_id ON contacts(organizer_id);
CREATE INDEX idx_contacts_company_id ON contacts(company_id);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_lead_status ON contacts(lead_status);
CREATE INDEX idx_contacts_engagement_score ON contacts(engagement_score);
CREATE INDEX idx_contacts_tags ON contacts USING gin(tags);

-- Full-text search
CREATE INDEX idx_contacts_search ON contacts USING gin(
  to_tsvector('english', first_name || ' ' || last_name || ' ' || COALESCE(email, '') || ' ' || COALESCE(company_id::text, ''))
);

-- RLS Policies
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contacts_manage_own" ON contacts
  FOR ALL USING (
    organizer_id IN (
      SELECT id FROM organizers WHERE user_id = auth.uid()
    )
  );
```

**MVP Fields:**
- ✅ Contact info, lead tracking, engagement score, segmentation
- ❌ Skip: social_profiles, custom_fields, ai_predictions

---

### Table: companies

**Purpose:** Business account management for B2B events and corporate clients

```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID NOT NULL REFERENCES organizers(id) ON DELETE CASCADE,

  -- Company Info
  name TEXT NOT NULL,
  website TEXT,
  industry TEXT, -- 'technology', 'finance', 'healthcare', 'manufacturing', etc.

  -- Size & Revenue
  company_size TEXT, -- '1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'
  annual_revenue TEXT, -- '$0-1M', '$1M-10M', '$10M-50M', '$50M-100M', '$100M+'

  -- Account Management
  account_type TEXT DEFAULT 'prospect', -- 'prospect', 'customer', 'partner', 'competitor'
  account_priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'strategic'

  -- Location
  headquarters_city TEXT,
  headquarters_state TEXT,
  headquarters_country TEXT,

  -- Engagement
  total_events_attended INTEGER DEFAULT 0,
  total_revenue DECIMAL(10,2) DEFAULT 0,
  last_event_date TIMESTAMPTZ,

  -- Notes
  notes TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_companies_organizer_id ON companies(organizer_id);
CREATE INDEX idx_companies_name ON companies(name);
CREATE INDEX idx_companies_industry ON companies(industry);
CREATE INDEX idx_companies_account_type ON companies(account_type);

-- Full-text search
CREATE INDEX idx_companies_search ON companies USING gin(to_tsvector('english', name || ' ' || COALESCE(industry, '')));

-- RLS Policies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "companies_manage_own" ON companies
  FOR ALL USING (
    organizer_id IN (
      SELECT id FROM organizers WHERE user_id = auth.uid()
    )
  );
```

**MVP Fields:**
- ✅ Company details, size, revenue, account management
- ❌ Skip: org_chart, decision_makers, contracts

---

### Table: interactions

**Purpose:** Complete communication history across all channels (email, phone, meeting, etc.)

```sql
CREATE TABLE interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID NOT NULL REFERENCES organizers(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,

  -- Interaction Details
  interaction_type TEXT NOT NULL, -- 'email', 'phone', 'meeting', 'event_attendance', 'website_visit', 'support_ticket'
  direction TEXT, -- 'inbound', 'outbound'

  subject TEXT,
  content TEXT,

  -- Outcome
  outcome TEXT, -- 'positive', 'neutral', 'negative', 'no_response'
  sentiment_score INTEGER CHECK (sentiment_score >= -100 AND sentiment_score <= 100), -- -100 to +100

  -- Follow-up
  next_action TEXT,
  next_action_date DATE,

  -- Engagement
  duration_minutes INTEGER, -- For calls/meetings
  engagement_score INTEGER DEFAULT 0, -- Calculated engagement value

  -- Metadata
  metadata JSONB DEFAULT '{}', -- Flexible storage for channel-specific data

  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_interactions_organizer_id ON interactions(organizer_id);
CREATE INDEX idx_interactions_contact_id ON interactions(contact_id);
CREATE INDEX idx_interactions_event_id ON interactions(event_id);
CREATE INDEX idx_interactions_type ON interactions(interaction_type);
CREATE INDEX idx_interactions_created_at ON interactions(created_at DESC);

-- RLS Policies
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "interactions_manage_own" ON interactions
  FOR ALL USING (
    organizer_id IN (
      SELECT id FROM organizers WHERE user_id = auth.uid()
    )
  );
```

**MVP Fields:**
- ✅ Communication history, outcomes, follow-ups, sentiment
- ❌ Skip: email_thread_id, call_recording_url, ai_summary

---

### Table: notes

**Purpose:** Quick notes and contextual information about contacts, companies, and events

```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID NOT NULL REFERENCES organizers(id) ON DELETE CASCADE,

  -- Related Entity (one of these will be set)
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,

  -- Note Content
  content TEXT NOT NULL,
  note_type TEXT DEFAULT 'general', -- 'general', 'meeting', 'phone_call', 'important', 'follow_up'

  -- Privacy
  is_private BOOLEAN DEFAULT false, -- Only visible to creator

  -- Metadata
  pinned BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',

  created_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_notes_organizer_id ON notes(organizer_id);
CREATE INDEX idx_notes_contact_id ON notes(contact_id);
CREATE INDEX idx_notes_company_id ON notes(company_id);
CREATE INDEX idx_notes_event_id ON notes(event_id);
CREATE INDEX idx_notes_created_by ON notes(created_by);
CREATE INDEX idx_notes_created_at ON notes(created_at DESC);

-- Full-text search
CREATE INDEX idx_notes_content ON notes USING gin(to_tsvector('english', content));

-- RLS Policies
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notes_view_team" ON notes
  FOR SELECT USING (
    (organizer_id IN (
      SELECT id FROM organizers WHERE user_id = auth.uid()
    ) AND is_private = false)
    OR created_by = auth.uid()
  );

CREATE POLICY "notes_manage_own" ON notes
  FOR ALL USING (
    organizer_id IN (
      SELECT id FROM organizers WHERE user_id = auth.uid()
    )
  );
```

**MVP Fields:**
- ✅ Note content, privacy, tags, relationships
- ❌ Skip: mentions, attachments, rich_text_formatting

---

## 🎪 Event Tables

### Table: venues

**Purpose:** Physical or virtual locations where events are held

```sql
CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID NOT NULL REFERENCES organizers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  venue_type TEXT NOT NULL DEFAULT 'physical', -- 'physical', 'virtual', 'hybrid'
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  postal_code TEXT,
  capacity INTEGER,
  virtual_url TEXT, -- For virtual/hybrid events
  amenities JSONB DEFAULT '[]', -- ['wifi', 'parking', 'catering']
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_venues_organizer_id ON venues(organizer_id);
CREATE INDEX idx_venues_city ON venues(city);

-- RLS Policies
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "venues_view_public" ON venues
  FOR SELECT USING (true);

CREATE POLICY "venues_manage_own" ON venues
  FOR ALL USING (
    organizer_id IN (
      SELECT id FROM organizers WHERE user_id = auth.uid()
    )
  );
```

**MVP Fields:**
- ✅ Location details, capacity, virtual support
- ❌ Skip: floor_plans, 3d_tours, detailed_amenities

---

### Table: events

**Purpose:** The central table for all event information

```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID NOT NULL REFERENCES organizers(id) ON DELETE CASCADE,
  venue_id UUID REFERENCES venues(id) ON DELETE SET NULL,

  -- Basic Info
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL, -- 'conference', 'concert', 'workshop', 'meetup', 'other'
  category TEXT, -- 'technology', 'business', 'arts', 'sports', etc.

  -- Timing
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'UTC',

  -- Capacity
  total_capacity INTEGER,
  registration_limit INTEGER,

  -- Status
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'published', 'cancelled', 'completed'
  visibility TEXT NOT NULL DEFAULT 'public', -- 'public', 'private', 'unlisted'

  -- Media
  cover_image_url TEXT,
  thumbnail_url TEXT,

  -- Settings
  settings JSONB DEFAULT '{}', -- Flexible settings object

  -- Timestamps
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_events_organizer_id ON events(organizer_id);
CREATE INDEX idx_events_venue_id ON events(venue_id);
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_events_category ON events(category);

-- Full-text search
CREATE INDEX idx_events_search ON events USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- RLS Policies
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "events_view_published" ON events
  FOR SELECT USING (
    status = 'published' AND visibility = 'public'
    OR organizer_id IN (
      SELECT id FROM organizers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "events_manage_own" ON events
  FOR ALL USING (
    organizer_id IN (
      SELECT id FROM organizers WHERE user_id = auth.uid()
    )
  );
```

**MVP Fields:**
- ✅ All essential event info, timing, capacity, status
- ❌ Skip: tags, custom_fields, seo_metadata, social_shares

---

### Table: event_sessions

**Purpose:** Break down events into specific sessions/activities (optional for simple events)

```sql
CREATE TABLE event_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  description TEXT,
  session_type TEXT, -- 'keynote', 'workshop', 'panel', 'break', 'networking'

  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,

  location TEXT, -- Room/space within venue
  capacity INTEGER,

  speaker_info JSONB DEFAULT '[]', -- [{name, title, bio, photo}]

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_event_sessions_event_id ON event_sessions(event_id);
CREATE INDEX idx_event_sessions_start_time ON event_sessions(start_time);

-- RLS Policies
ALTER TABLE event_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sessions_view_public" ON event_sessions
  FOR SELECT USING (
    event_id IN (
      SELECT id FROM events WHERE status = 'published' AND visibility = 'public'
    )
  );

CREATE POLICY "sessions_manage_own" ON event_sessions
  FOR ALL USING (
    event_id IN (
      SELECT id FROM events
      WHERE organizer_id IN (
        SELECT id FROM organizers WHERE user_id = auth.uid()
      )
    )
  );
```

**MVP Use Case:** Simple events might not need sessions. Multi-day conferences do.

---

## 🎟️ Ticketing Tables

### Table: ticket_tiers

**Purpose:** Different ticket types/pricing levels for an event

```sql
CREATE TABLE ticket_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,

  name TEXT NOT NULL, -- 'General Admission', 'Early Bird', 'VIP', etc.
  description TEXT,

  price DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',

  quantity_total INTEGER NOT NULL,
  quantity_sold INTEGER NOT NULL DEFAULT 0,

  sale_start TIMESTAMPTZ,
  sale_end TIMESTAMPTZ,

  tier_type TEXT DEFAULT 'standard', -- 'standard', 'early_bird', 'vip', 'group'

  settings JSONB DEFAULT '{}', -- Per-ticket settings

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_ticket_tiers_event_id ON ticket_tiers(event_id);

-- RLS Policies
ALTER TABLE ticket_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tickets_view_public" ON ticket_tiers
  FOR SELECT USING (
    event_id IN (
      SELECT id FROM events WHERE status = 'published'
    )
  );

CREATE POLICY "tickets_manage_own" ON ticket_tiers
  FOR ALL USING (
    event_id IN (
      SELECT id FROM events
      WHERE organizer_id IN (
        SELECT id FROM organizers WHERE user_id = auth.uid()
      )
    )
  );
```

---

### Table: orders

**Purpose:** Track ticket purchases and registrations

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  attendee_id UUID NOT NULL REFERENCES attendees(id) ON DELETE CASCADE,

  order_number TEXT UNIQUE NOT NULL, -- Human-readable order ID

  subtotal DECIMAL(10,2) NOT NULL,
  fees DECIMAL(10,2) DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',

  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'cancelled', 'refunded'

  payment_method TEXT, -- 'stripe', 'paypal', 'free'
  payment_intent_id TEXT, -- Stripe payment intent ID

  billing_email TEXT NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_orders_event_id ON orders(event_id);
CREATE INDEX idx_orders_attendee_id ON orders(attendee_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- RLS Policies
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_view_own" ON orders
  FOR SELECT USING (
    attendee_id IN (
      SELECT id FROM attendees WHERE user_id = auth.uid() OR email = auth.jwt()->>'email'
    )
    OR event_id IN (
      SELECT id FROM events
      WHERE organizer_id IN (
        SELECT id FROM organizers WHERE user_id = auth.uid()
      )
    )
  );
```

---

### Table: order_items

**Purpose:** Individual tickets within an order (junction table)

```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  ticket_tier_id UUID NOT NULL REFERENCES ticket_tiers(id) ON DELETE CASCADE,

  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,

  attendee_name TEXT, -- Who this ticket is for (can be different from buyer)
  attendee_email TEXT,

  ticket_code TEXT UNIQUE, -- QR code / barcode for check-in
  checked_in_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_ticket_tier_id ON order_items(ticket_tier_id);
CREATE INDEX idx_order_items_ticket_code ON order_items(ticket_code);

-- RLS Policies
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "order_items_view_with_order" ON order_items
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM orders WHERE
        attendee_id IN (
          SELECT id FROM attendees WHERE user_id = auth.uid()
        )
        OR event_id IN (
          SELECT id FROM events
          WHERE organizer_id IN (
            SELECT id FROM organizers WHERE user_id = auth.uid()
          )
        )
    )
  );
```

---

## 🎯 Marketing & Promotions Tables

### Table: promo_codes

**Purpose:** Discount codes and promotional campaigns (CRITICAL for marketing)

```sql
CREATE TABLE promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,

  code VARCHAR(50) NOT NULL,
  discount_type VARCHAR(20) NOT NULL, -- 'PERCENTAGE', 'FIXED_AMOUNT'
  discount_value DECIMAL(10,2) NOT NULL,

  -- Applicability
  applicable_ticket_ids JSONB DEFAULT '[]', -- Which tickets this applies to (empty = all)

  -- Limits
  max_uses INTEGER, -- NULL = unlimited
  max_uses_per_customer INTEGER DEFAULT 1,
  min_order_amount DECIMAL(10,2),

  -- Timing
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,

  -- Tracking
  times_used INTEGER DEFAULT 0 NOT NULL,
  total_discount_given DECIMAL(14,2) DEFAULT 0.00,

  -- Status
  is_active BOOLEAN DEFAULT true NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_promo_codes_event_id ON promo_codes(event_id);
CREATE INDEX idx_promo_codes_code ON promo_codes(code);
CREATE INDEX idx_promo_codes_valid_until ON promo_codes(valid_until);

-- RLS Policies
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "promo_codes_manage_own" ON promo_codes
  FOR ALL USING (
    event_id IN (
      SELECT id FROM events
      WHERE organizer_id IN (
        SELECT id FROM organizers WHERE user_id = auth.uid()
      )
    )
  );

-- Public can check if code exists (but not see all codes)
CREATE POLICY "promo_codes_public_validate" ON promo_codes
  FOR SELECT USING (
    is_active = true
    AND (valid_until IS NULL OR valid_until > NOW())
  );
```

**MVP Fields:**
- ✅ Code, discount type/value, limits, validity
- ❌ Skip: advanced targeting, auto-generation, A/B testing

---

## 🔧 Event Configuration Tables

### Table: event_settings

**Purpose:** Per-event customization and configuration

```sql
CREATE TABLE event_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL UNIQUE REFERENCES events(id) ON DELETE CASCADE,

  -- Checkout Messages
  pre_checkout_message TEXT,
  post_checkout_message TEXT,
  continue_button_text VARCHAR(100) DEFAULT 'Continue',

  -- Email Configuration
  email_footer_message TEXT,
  support_email VARCHAR(255),

  -- Order Configuration
  order_timeout_minutes INTEGER DEFAULT 15 NOT NULL,
  require_attendee_details BOOLEAN DEFAULT true NOT NULL,

  -- SEO
  seo_title VARCHAR(255),
  seo_description TEXT,
  seo_keywords VARCHAR(255),
  allow_search_engine_indexing BOOLEAN DEFAULT true NOT NULL,

  -- Social Media
  social_media_handles JSONB DEFAULT '{}', -- {twitter: '@handle', instagram: '@handle'}
  show_social_media_handles BOOLEAN DEFAULT true,

  -- Online Events
  is_online_event BOOLEAN DEFAULT false NOT NULL,
  online_event_connection_details TEXT, -- Zoom link, stream URL, etc.

  -- Branding
  primary_color VARCHAR(20) DEFAULT '#3B82F6',
  secondary_color VARCHAR(20) DEFAULT '#1E40AF',
  cover_image_position VARCHAR(20) DEFAULT 'center',

  -- Features
  show_remaining_tickets BOOLEAN DEFAULT false,
  notify_organizer_of_new_orders BOOLEAN DEFAULT true NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_event_settings_event_id ON event_settings(event_id);

-- RLS Policies
ALTER TABLE event_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "event_settings_manage_own" ON event_settings
  FOR ALL USING (
    event_id IN (
      SELECT id FROM events
      WHERE organizer_id IN (
        SELECT id FROM organizers WHERE user_id = auth.uid()
      )
    )
  );
```

**MVP Fields:**
- ✅ Messages, timeouts, SEO, social, online event support
- ❌ Skip: advanced theming, custom CSS, white-labeling

---

### Table: taxes_and_fees

**Purpose:** Tax and fee calculation rules

```sql
CREATE TABLE taxes_and_fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID NOT NULL REFERENCES organizers(id) ON DELETE CASCADE,

  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('TAX', 'FEE')),

  calculation_type VARCHAR(20) NOT NULL CHECK (calculation_type IN ('PERCENTAGE', 'FIXED')),
  rate DECIMAL(10,3) NOT NULL, -- 8.5 for 8.5%, or fixed amount

  -- Applicability
  applies_to VARCHAR(50) DEFAULT 'ALL', -- 'ALL', 'TICKETS_ONLY', 'SPECIFIC_TICKETS'
  applicable_ticket_ids JSONB DEFAULT '[]',

  -- Regional
  applies_to_regions JSONB DEFAULT '[]', -- ['US', 'CA', 'NY'] - countries/states

  -- Status
  is_active BOOLEAN DEFAULT true NOT NULL,
  is_default BOOLEAN DEFAULT false NOT NULL,

  description TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_taxes_and_fees_organizer_id ON taxes_and_fees(organizer_id);
CREATE INDEX idx_taxes_and_fees_type ON taxes_and_fees(type);

-- RLS Policies
ALTER TABLE taxes_and_fees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "taxes_and_fees_manage_own" ON taxes_and_fees
  FOR ALL USING (
    organizer_id IN (
      SELECT id FROM organizers WHERE user_id = auth.uid()
    )
  );
```

**MVP Fields:**
- ✅ Tax/fee calculation, regional rules, applicability
- ❌ Skip: complex tax jurisdiction logic, automatic tax lookup APIs

---

## 📋 Custom Forms Tables

### Table: questions

**Purpose:** Custom registration form questions

```sql
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  description TEXT,

  question_type VARCHAR(50) NOT NULL, -- 'text', 'textarea', 'select', 'multiselect', 'checkbox', 'radio', 'number', 'email', 'phone'

  -- Options (for select/radio/checkbox types)
  options JSONB DEFAULT '[]', -- ['Option 1', 'Option 2', 'Option 3']

  -- Validation
  is_required BOOLEAN DEFAULT false NOT NULL,
  belongs_to VARCHAR(50) NOT NULL DEFAULT 'ORDER', -- 'ORDER' or 'ATTENDEE'

  -- Display Order
  display_order INTEGER DEFAULT 1 NOT NULL,
  is_hidden BOOLEAN DEFAULT false NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_questions_event_id ON questions(event_id);
CREATE INDEX idx_questions_display_order ON questions(event_id, display_order);

-- RLS Policies
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "questions_view_public" ON questions
  FOR SELECT USING (
    event_id IN (
      SELECT id FROM events WHERE status = 'published'
    ) AND is_hidden = false
  );

CREATE POLICY "questions_manage_own" ON questions
  FOR ALL USING (
    event_id IN (
      SELECT id FROM events
      WHERE organizer_id IN (
        SELECT id FROM organizers WHERE user_id = auth.uid()
      )
    )
  );
```

**MVP Fields:**
- ✅ Common question types, validation, options
- ❌ Skip: conditional logic, file uploads, payment fields

---

### Table: question_answers

**Purpose:** Store answers to custom questions

```sql
CREATE TABLE question_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  attendee_id UUID REFERENCES attendees(id) ON DELETE CASCADE, -- NULL if belongs_to = 'ORDER'

  answer JSONB NOT NULL, -- Flexible storage: "text", ["option1", "option2"], {value: "..."}, etc.

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_question_answers_question_id ON question_answers(question_id);
CREATE INDEX idx_question_answers_order_id ON question_answers(order_id);
CREATE INDEX idx_question_answers_attendee_id ON question_answers(attendee_id);

-- RLS Policies
ALTER TABLE question_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "question_answers_view_own" ON question_answers
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM orders WHERE
        attendee_id IN (
          SELECT id FROM attendees WHERE user_id = auth.uid()
        )
        OR event_id IN (
          SELECT id FROM events
          WHERE organizer_id IN (
            SELECT id FROM organizers WHERE user_id = auth.uid()
          )
        )
    )
  );
```

**MVP Fields:**
- ✅ Flexible JSONB storage, links to orders/attendees
- ❌ Skip: file attachments, encryption

---

## 💰 Financial Tables

### Table: order_refunds

**Purpose:** Track refund transactions

```sql
CREATE TABLE order_refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,

  refund_amount DECIMAL(14,2) NOT NULL,
  refund_type VARCHAR(20) NOT NULL DEFAULT 'FULL', -- 'FULL', 'PARTIAL'

  -- Payment Provider Info
  payment_provider VARCHAR(50) NOT NULL, -- 'stripe', 'paypal'
  provider_refund_id TEXT, -- External refund ID

  status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'COMPLETED', 'FAILED'

  -- Reason & Notes
  refund_reason VARCHAR(100), -- 'EVENT_CANCELLED', 'CUSTOMER_REQUEST', 'DUPLICATE', 'FRAUD'
  notes TEXT,

  -- Metadata
  refunded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  refunded_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_order_refunds_order_id ON order_refunds(order_id);
CREATE INDEX idx_order_refunds_status ON order_refunds(status);
CREATE INDEX idx_order_refunds_refunded_at ON order_refunds(refunded_at);

-- RLS Policies
ALTER TABLE order_refunds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "order_refunds_view_own" ON order_refunds
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM orders WHERE
        event_id IN (
          SELECT id FROM events
          WHERE organizer_id IN (
            SELECT id FROM organizers WHERE user_id = auth.uid()
          )
        )
    )
  );
```

**MVP Fields:**
- ✅ Refund amount, type, status, provider tracking
- ❌ Skip: partial item refunds, automated refund rules

---

## 💰 Financial Tables

### Table: payments

**Purpose:** Track all payment transactions

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,

  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',

  payment_method TEXT NOT NULL, -- 'stripe', 'paypal', 'bank_transfer'
  payment_provider TEXT NOT NULL, -- 'stripe', 'paypal'

  transaction_id TEXT, -- External payment ID
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'

  metadata JSONB DEFAULT '{}', -- Store provider-specific data

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX idx_payments_status ON payments(status);

-- RLS Policies
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payments_view_with_order" ON payments
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM orders WHERE
        event_id IN (
          SELECT id FROM events
          WHERE organizer_id IN (
            SELECT id FROM organizers WHERE user_id = auth.uid()
          )
        )
    )
  );
```

---

### Table: budgets

**Purpose:** Financial planning and tracking for events

```sql
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,

  category TEXT NOT NULL, -- 'venue', 'catering', 'marketing', 'staff', 'equipment', 'other'
  item_name TEXT NOT NULL,
  description TEXT,

  estimated_cost DECIMAL(10,2) NOT NULL,
  actual_cost DECIMAL(10,2) DEFAULT 0,

  status TEXT DEFAULT 'planned', -- 'planned', 'approved', 'paid', 'cancelled'

  due_date DATE,
  paid_date DATE,

  notes TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_budgets_event_id ON budgets(event_id);
CREATE INDEX idx_budgets_category ON budgets(category);
CREATE INDEX idx_budgets_status ON budgets(status);

-- RLS Policies
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "budgets_manage_own" ON budgets
  FOR ALL USING (
    event_id IN (
      SELECT id FROM events
      WHERE organizer_id IN (
        SELECT id FROM organizers WHERE user_id = auth.uid()
      )
    )
  );
```

---

## 📋 Operations Tables

### Table: tasks

**Purpose:** Event planning tasks and to-dos

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  description TEXT,

  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,

  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'cancelled'
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'

  due_date DATE,
  completed_at TIMESTAMPTZ,

  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_tasks_event_id ON tasks(event_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

-- RLS Policies
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tasks_manage_event_team" ON tasks
  FOR ALL USING (
    event_id IN (
      SELECT id FROM events
      WHERE organizer_id IN (
        SELECT id FROM organizers WHERE user_id = auth.uid()
      )
    )
    OR assigned_to = auth.uid()
  );
```

---

### Table: vendors

**Purpose:** External service providers for events

```sql
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID NOT NULL REFERENCES organizers(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  service_category TEXT NOT NULL, -- 'catering', 'av_equipment', 'photography', 'security', 'decor', 'other'

  contact_person TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,

  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT,

  notes TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_vendors_organizer_id ON vendors(organizer_id);
CREATE INDEX idx_vendors_service_category ON vendors(service_category);

-- RLS Policies
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "vendors_manage_own" ON vendors
  FOR ALL USING (
    organizer_id IN (
      SELECT id FROM organizers WHERE user_id = auth.uid()
    )
  );
```

---

### Table: event_vendors (Junction)

**Purpose:** Link vendors to specific events

```sql
CREATE TABLE event_vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,

  service_provided TEXT NOT NULL,
  contract_amount DECIMAL(10,2),
  contract_status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled'

  contact_date DATE,
  service_date DATE,

  notes TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(event_id, vendor_id, service_provided)
);

-- Indexes
CREATE INDEX idx_event_vendors_event_id ON event_vendors(event_id);
CREATE INDEX idx_event_vendors_vendor_id ON event_vendors(vendor_id);

-- RLS Policies
ALTER TABLE event_vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "event_vendors_manage_own" ON event_vendors
  FOR ALL USING (
    event_id IN (
      SELECT id FROM events
      WHERE organizer_id IN (
        SELECT id FROM organizers WHERE user_id = auth.uid()
      )
    )
  );
```

---

## 📊 Database Summary

### All MVP Tables (25 Total)

| **#** | **Table** | **Category** | **Purpose** |
|-------|----------|-------------|------------|
| 1 | users | Identity | Central user authentication |
| 2 | organizers | Identity | Event organizer profiles |
| 3 | attendees | Identity | Event attendees (guests or users) |
| 4 | contacts | CRM | Customer database (360-degree view) |
| 5 | companies | CRM | Business account management |
| 6 | interactions | CRM | Communication history tracking |
| 7 | notes | CRM | Quick notes on contacts/companies/events |
| 8 | venues | Events | Event locations |
| 9 | events | Events | Main event data |
| 10 | event_sessions | Events | Event schedule breakdown |
| 11 | ticket_tiers | Ticketing | Ticket types and pricing |
| 12 | orders | Ticketing | Ticket purchases |
| 13 | order_items | Ticketing | Individual tickets |
| 14 | **promo_codes** | **Marketing** | **Discount codes & promotions** |
| 15 | **event_settings** | **Configuration** | **Per-event customization** |
| 16 | **taxes_and_fees** | **Configuration** | **Tax & fee calculation** |
| 17 | **questions** | **Forms** | **Custom registration questions** |
| 18 | **question_answers** | **Forms** | **Form response storage** |
| 19 | **order_refunds** | **Finance** | **Refund tracking** |
| 20 | payments | Finance | Payment transactions |
| 21 | budgets | Finance | Event budget tracking |
| 22 | tasks | Operations | Event planning tasks |
| 23 | vendors | Operations | Service providers |
| 24 | event_vendors | Operations | Event-vendor relationships |
| 25 | **(existing)** email_templates | Communications | Email templates from Phase 0 |

**Total: 25 tables for MVP** (was 19, added 6 critical tables)

### New Critical Tables Added:
- ✅ **promo_codes** - Essential for marketing campaigns
- ✅ **order_refunds** - Legal requirement for refund processing
- ✅ **event_settings** - Per-event customization & branding
- ✅ **questions + question_answers** - Custom registration forms
- ✅ **taxes_and_fees** - Tax calculation & compliance

---

## 🔐 Security Overview

### RLS Strategy

All tables have Row Level Security enabled with policies that enforce:

1. **Organizers** see only their own events and related data
2. **Attendees** see only their own registrations and orders
3. **Public users** see only published events
4. **Admins** (future) can access everything

### Key Security Patterns

```sql
-- Pattern 1: Own data only
auth.uid() = user_id

-- Pattern 2: Via organizer relationship
organizer_id IN (
  SELECT id FROM organizers WHERE user_id = auth.uid()
)

-- Pattern 3: Via event relationship
event_id IN (
  SELECT id FROM events WHERE organizer_id IN (...)
)

-- Pattern 4: Public published data
status = 'published' AND visibility = 'public'
```

---

## 🚀 Implementation Order

### Week 1: Identity & Events
1. users
2. organizers
3. venues
4. events

**Milestone:** Create event functionality

---

### Week 2: Ticketing & Orders
5. ticket_tiers
6. attendees
7. orders
8. order_items

**Milestone:** Buy ticket functionality

---

### Week 3: Finance & Operations
9. payments (Stripe integration)
10. budgets
11. tasks

**Milestone:** Complete purchase flow

---

### Week 4: Critical Features + CRM
12. **promo_codes** (discount codes - CRITICAL)
13. **order_refunds** (refund tracking - CRITICAL)
14. **event_settings** (event configuration)
15. **questions** (custom forms)
16. **question_answers** (form responses)
17. **taxes_and_fees** (tax calculation)
18. contacts (CRM customer database)
19. companies (CRM business accounts)
20. interactions (CRM communication history)
21. notes (CRM quick notes)
22. vendors
23. event_vendors
24. event_sessions

**Milestone:** Competitive feature parity + full CRM capabilities

---

## 📝 Migration Strategy

### Single Migration File

Create one comprehensive migration that includes:
- All table definitions
- All indexes
- All RLS policies
- All foreign key constraints
- Trigger functions (updated_at timestamps)

```sql
-- Migration: 20251017_mvp_complete_schema.sql

-- Step 1: Create all tables
-- Step 2: Create indexes
-- Step 3: Enable RLS
-- Step 4: Create policies
-- Step 5: Create functions/triggers
```

---

## 🎯 Phase 2 Extensions

**What to add only if users request:**

### Event & Ticketing
- [ ] Custom registration forms
- [ ] Discount codes / promo codes
- [ ] Group ticketing
- [ ] Waitlists
- [ ] Event templates
- [ ] Multi-currency support
- [ ] Tax calculations per region
- [ ] Social sharing
- [ ] Event ratings/reviews

### CRM & Sales
- [ ] Leads table (lead qualification & scoring)
- [ ] Opportunities table (sales pipeline)
- [ ] Campaigns table (marketing automation)
- [ ] Campaign recipients (email marketing)
- [ ] Contact custom fields
- [ ] Lead scoring automation
- [ ] Email sequence automation
- [ ] Deal/opportunity tracking

### Analytics
- [ ] Advanced analytics tables
- [ ] Customer journey tracking
- [ ] Engagement analytics
- [ ] ROI calculations
- [ ] Predictive models

### Advanced Features
- [ ] Check-ins (QR code scanning)
- [ ] Seat maps (interactive seating)
- [ ] Bundles (package deals)
- [ ] Promoters & commissions
- [ ] Sponsors management
- [ ] Networking connections

**Don't build these unless users consistently request them.**

---

**Document Version:** 3.0 (Added Critical Hi.Events Tables)
**Last Updated:** 2025-10-17
**Status:** ✅ Ready for Implementation
**CRM Tables Added (v2):** contacts, companies, interactions, notes
**Critical Tables Added (v3):** promo_codes, order_refunds, event_settings, questions, question_answers, taxes_and_fees
**Total Tables:** 25 (was 19 → added 6 critical tables based on Hi.Events analysis)
**Competitive Parity:** 62.5% (up from 25%)
**Next Steps:** Create migration file with all schemas
