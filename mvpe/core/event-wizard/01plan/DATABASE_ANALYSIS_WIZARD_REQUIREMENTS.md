# 🚨 Database Analysis: Event Wizard Requirements

**Date:** 2025-10-17
**Analyst:** Claude Code
**Status:** CRITICAL ISSUES IDENTIFIED

---

## Executive Summary

**CRITICAL:** The current database setup has **major incompatibilities** that will block Event Wizard implementation. Immediate action required.

### Severity Breakdown
- 🔴 **Critical Issues:** 5
- 🟡 **Major Concerns:** 8
- 🟢 **Minor Issues:** 3

---

## 🔴 CRITICAL ISSUES

### 1. **Multi-Tenant vs Single-Tenant Architecture Conflict**

**Location:** `/supabase/migrations` vs `/supabase/01-core/`

**Problem:**
- Production migration (`20251013060000_core_eventos_schema_production.sql`) uses **single-tenant** model with `profiles` table
- Schema files in `/supabase/01-core/` use **multi-tenant** model with `accounts` + `users` tables
- These are **fundamentally incompatible** architectures

**Current Production Schema:**
```sql
-- Single-tenant (current production)
profiles (extends auth.users)
└── events (organizer_id → profiles.id)
    └── orders (customer_id → profiles.id)
```

**01-Core Schema:**
```sql
-- Multi-tenant (01-core)
accounts (tenant root)
└── users (user_id → auth.users.id)
    └── account_users (join table)
        └── events (account_id → accounts.id)
```

**Impact:** ⛔ **BLOCKS EVERYTHING**
Event Wizard references `contactInfo.email` but unclear if this maps to:
- `profiles.email` (production)
- `users.email` (01-core)
- `contacts.email` (CRM table in 01-core)

**Fix Required:** Choose ONE architecture immediately:
- **Option A:** Use production single-tenant (`profiles` based) + add wizard tables
- **Option B:** Migrate to 01-core multi-tenant (`accounts` based) + add wizard tables
- **Option C:** Hybrid approach (NOT RECOMMENDED - adds complexity)

**Recommendation:** Option A for MVP speed, Option B for long-term SaaS scalability

---

### 2. **Missing Wizard State Management Table**

**Required Table:** `wizard_sessions`
**Status:** ❌ **DOES NOT EXIST**

**Problem:**
- Event Wizard PRD specifies tracking wizard progress across stages
- No table exists to persist wizard state, session ID, or completion tracking
- Cannot implement CopilotKit state persistence without this

**Required Schema:**
```sql
CREATE TABLE wizard_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID, -- Could be NULL before contact info captured
  current_stage TEXT NOT NULL,
  stages_completed TEXT[],
  event_id UUID REFERENCES events(id),
  state JSONB, -- Full wizard state for recovery
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  total_messages INTEGER DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0
);
```

**Impact:** 🔴 **BLOCKS Stage 1-6 implementation**
Cannot track:
- Which stage user is on
- Partial progress (if user leaves and returns)
- Completion metrics (time to complete, messages sent)
- State recovery after browser refresh

---

### 3. **Ticket Tiers vs Tickets Confusion**

**Location:** Event Wizard Stage 4 vs existing `tickets` table

**Problem:**
The Event Wizard PRD describes **ticket tiers** (pricing levels), but:

**Production Schema:**
```sql
CREATE TABLE tickets (
  -- Individual ticket instances with QR codes
  id UUID,
  event_id UUID,
  order_id UUID,
  ticket_number TEXT,
  qr_code TEXT,
  status TEXT -- 'active', 'used', 'cancelled'
);
```

**01-Core Schema:**
```sql
CREATE TABLE tickets (
  -- Ticket TYPES/TIERS with pricing
  id UUID,
  event_id UUID,
  name TEXT, -- "Early Bird", "VIP"
  base_price DECIMAL(10,2),
  total_quantity INTEGER,
  sold_quantity INTEGER
);
```

**Event Wizard Needs:**
```sql
CREATE TABLE ticket_tiers (
  -- Pricing tiers configured during wizard
  id UUID,
  event_id UUID,
  name TEXT, -- "Early Bird", "Regular", "VIP"
  price DECIMAL(10,2),
  quantity INTEGER,
  tier_type TEXT -- 'early_bird', 'regular', 'vip'
);

-- Separate table for actual ticket instances
CREATE TABLE tickets (
  id UUID,
  tier_id UUID REFERENCES ticket_tiers(id),
  order_id UUID,
  ticket_number TEXT,
  qr_code TEXT
);
```

**Impact:** 🔴 **Stage 4: Ticketing BLOCKED**
Current structure doesn't support:
- Multiple pricing tiers per event
- Tier-specific quantity limits
- Early bird vs regular pricing

**Conflict:** Production uses `tickets` for instances, 01-core uses `tickets` for tiers. Event Wizard needs BOTH.

---

### 4. **No Marketing Campaign Infrastructure**

**Required for Stage 5:** Marketing content generation

**Missing Tables:**
- `marketing_campaigns` - Campaign tracking
- `email_templates` - Email content
- `whatsapp_campaigns` - WhatsApp broadcasts (EventOS differentiator!)
- `social_media_posts` - Generated posts

**Current State:** ❌ **NONE EXIST**

**01-Core Has:**
```sql
-- Generic campaigns table (not sufficient)
CREATE TABLE campaigns (
  id UUID,
  account_id UUID,
  name TEXT,
  -- Missing: specific channels, templates, WhatsApp support
);
```

**Impact:** 🔴 **Stage 5: Marketing COMPLETELY BLOCKED**
Cannot implement:
- AI-generated landing pages
- Email campaign templates
- WhatsApp broadcast messages (unique differentiator vs Zoho!)
- Social media post generation

---

### 5. **Missing Venue Booking System**

**Required for Stage 3:** Venue marketplace integration

**Missing Tables:**
- `venue_bookings` - Booking requests and confirmations
- `venue_availability` - Calendar/scheduling

**Current State:**
- Production: `venues` table exists (basic venue info)
- 01-core: `venues` table exists (basic venue info)
- **Neither has booking/reservation system**

**Event Wizard Needs:**
```sql
CREATE TABLE venue_bookings (
  id UUID PRIMARY KEY,
  event_id UUID REFERENCES events(id),
  venue_id UUID REFERENCES venues(id),
  event_date TIMESTAMPTZ,
  status TEXT, -- 'pending', 'confirmed', 'rejected'
  requested_by TEXT, -- Email before user account created
  booking_source TEXT -- 'wizard' vs manual
);
```

**Impact:** 🔴 **Stage 3: Venue Selection PARTIALLY BLOCKED**
Can support:
- ✅ Custom venue entry
- ❌ Marketplace venue booking
- ❌ Availability checking
- ❌ Booking status tracking

---

## 🟡 MAJOR CONCERNS

### 6. **CRM Contact Management Unclear**

**Wizard Stage 1** captures contact info but unclear where it's stored:

**Production Schema:**
```sql
-- No dedicated CRM, uses profiles
CREATE TABLE profiles (
  id UUID,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  company TEXT -- Added for wizard?
);
```

**01-Core Schema:**
```sql
-- Dedicated CRM table
CREATE TABLE contacts (
  id UUID,
  account_id UUID,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  company_name TEXT,
  contact_type TEXT, -- 'prospect', 'customer', etc.
  engagement_score INTEGER
);
```

**Event Wizard Expects:**
- Save contact during Stage 1
- Create/update CRM record
- Link wizard session to contact

**Issue:** Which table should Stage 1 use?
- Production: Add to `profiles` (requires auth.users first?)
- 01-core: Add to `contacts` (better CRM separation)

**Recommendation:** Use `contacts` table for pre-auth lead capture, sync to `profiles`/`users` after signup

---

### 7. **Event Status Fields Mismatch**

**Production Migration:**
```sql
CREATE TABLE events (
  status TEXT CHECK (status IN ('draft', 'published', 'cancelled', 'completed')),
  visibility TEXT CHECK (visibility IN ('public', 'private'))
);
```

**01-Core Schema:**
```sql
CREATE TABLE events (
  status TEXT CHECK (status IN ('draft', 'published', 'active', 'cancelled', 'completed', 'archived')),
  visibility TEXT CHECK (visibility IN ('public', 'private', 'invite_only'))
);
```

**Event Wizard PRD:**
- Creates events in `draft` status
- Stage 6 publishes: `draft` → `published`
- Needs `visibility = 'private'` until published

**Issue:**
- Production schema missing `'active'` and `'archived'` statuses
- 01-core has more granular states
- Both support wizard requirements, but inconsistent

---

### 8. **Missing Event Dashboard Tables**

**Required for Stage 6:** Post-publish analytics

**Missing:**
```sql
CREATE TABLE event_dashboards (
  id UUID,
  event_id UUID,
  organizer_id UUID,
  metrics JSONB -- {views, ticket_sales, revenue, conversion_rate}
);
```

**Impact:** 🟡 **Stage 6: Review & Launch INCOMPLETE**
Can publish event, but cannot:
- Track real-time views
- Show ticket sales progress
- Calculate conversion rates
- Provide post-launch dashboard

---

### 9. **No Stripe Integration Tables**

**Wizard Stage 4** mentions Stripe for paid tickets

**Missing:**
```sql
CREATE TABLE stripe_accounts (
  id UUID,
  event_id UUID,
  stripe_account_id TEXT,
  status TEXT
);

CREATE TABLE stripe_payment_intents (
  id UUID,
  order_id UUID,
  stripe_payment_intent_id TEXT,
  status TEXT
);
```

**Current:**
- Production: `orders.stripe_payment_intent_id` field exists ✅
- But no separate Stripe account management ❌

---

### 10. **Slug Generation Functions Differ**

**Production:**
```sql
-- Uses unaccent + UUID suffix
CREATE FUNCTION generate_event_slug() ...
  new.slug = unaccent(name) || '-' || substr(new.id::text, 1, 8);
```

**01-Core:**
```sql
-- Uses epoch timestamp for uniqueness
CREATE FUNCTION set_event_slug() ...
  NEW.slug := NEW.slug || '-' || extract(epoch from now())::text;
```

**Issue:** Different slug formats between environments

---

### 11. **Inconsistent Timestamp Patterns**

**Production:**
```sql
CREATE TABLE events (
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**01-Core:**
```sql
CREATE TABLE events (
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_updated_at TIMESTAMPTZ DEFAULT NOW(), -- Redundant?
  published_at TIMESTAMPTZ
);
```

**Wizard Needs:**
- `published_at` for Stage 6 publish action

---

### 12. **RLS Policy Complexity**

**Production:** Relatively simple RLS
**01-Core:** Complex multi-tenant RLS with `account_users` joins

**Wizard Impact:**
- Wizard runs before full auth (Stage 1 collects info)
- Need anonymous/pre-auth access patterns
- Complex RLS may block wizard operations

---

### 13. **Missing Metadata Fields**

**Wizard tracks creation source:**

```sql
-- Needed in events table
CREATE TABLE events (
  -- ...
  created_via TEXT, -- 'wizard', 'manual', 'api'
  wizard_session_id UUID REFERENCES wizard_sessions(id),
  metadata JSONB -- {wizard_stage, completion_time, etc.}
);
```

**Current:** Neither schema has these fields

---

## 🟢 MINOR ISSUES

### 14. **Missing Helper Functions**

**Wizard needs:**
```sql
-- Calculate duration between stages
CREATE FUNCTION calculate_wizard_duration(session_id UUID)
RETURNS INTEGER;

-- Generate ticket codes (production has this ✅)
-- Generate order numbers (production has this ✅)
```

### 15. **No Email Verification for CRM Contacts**

**Wizard Stage 1** collects emails but no verification

**Needed:**
```sql
ALTER TABLE contacts ADD COLUMN email_verified BOOLEAN DEFAULT false;
ALTER TABLE contacts ADD COLUMN email_verification_token TEXT;
```

### 16. **Missing Indexes for Wizard Queries**

**Wizard will frequently query:**
```sql
-- Find active wizard sessions
SELECT * FROM wizard_sessions WHERE current_stage != 'completed';

-- Find events created via wizard
SELECT * FROM events WHERE created_via = 'wizard';

-- Need indexes:
CREATE INDEX idx_wizard_sessions_stage ON wizard_sessions(current_stage);
CREATE INDEX idx_events_created_via ON events(created_via);
```

---

## 📋 MISSING TABLES SUMMARY

### Required for Event Wizard MVP:

| Table | Priority | Blocks Stage | Status |
|-------|----------|--------------|--------|
| `wizard_sessions` | 🔴 Critical | All stages | ❌ Missing |
| `ticket_tiers` | 🔴 Critical | Stage 4 | ❌ Missing |
| `marketing_campaigns` | 🔴 Critical | Stage 5 | ⚠️ Partial in 01-core |
| `email_templates` | 🔴 Critical | Stage 5 | ❌ Missing |
| `whatsapp_campaigns` | 🔴 Critical | Stage 5 | ❌ Missing |
| `venue_bookings` | 🔴 Critical | Stage 3 | ❌ Missing |
| `event_dashboards` | 🟡 Major | Stage 6 | ❌ Missing |
| `crm_contacts` | 🟡 Major | Stage 1 | ⚠️ Exists in 01-core |
| `stripe_accounts` | 🟡 Major | Stage 4 | ⚠️ Partial |

---

## 🎯 RECOMMENDED ACTION PLAN

### Phase 1: Immediate (CRITICAL)
1. **Decide Architecture:** Single-tenant (production) vs Multi-tenant (01-core)
2. **Create `wizard_sessions` table** (blocks ALL stages)
3. **Create `ticket_tiers` table** (blocks Stage 4)
4. **Create `venue_bookings` table** (blocks Stage 3)

### Phase 2: High Priority
5. **Create marketing infrastructure:**
   - `marketing_campaigns`
   - `email_templates`
   - `whatsapp_campaigns`
6. **Create `event_dashboards` table**
7. **Add wizard metadata to `events` table**

### Phase 3: Integration
8. **Add Stripe account management**
9. **Create helper functions**
10. **Add performance indexes**

---

## 🚀 IMPLEMENTATION STRATEGY

### Option A: Production + Wizard Tables (RECOMMENDED FOR MVP)

**Approach:**
- Keep existing production migration as base
- Add wizard-specific tables as new migrations
- Enhance `events` table with wizard metadata

**Pros:**
- ✅ Faster to implement
- ✅ No breaking changes to existing code
- ✅ Can launch wizard quickly

**Cons:**
- ❌ No multi-tenancy (harder to scale later)
- ❌ Weaker CRM capabilities
- ❌ May need refactor for SaaS growth

**Timeline:** 3-5 days

---

### Option B: Full 01-Core Migration (RECOMMENDED FOR SCALE)

**Approach:**
- Use 01-core as foundation
- Add wizard-specific enhancements
- Migrate existing data

**Pros:**
- ✅ Enterprise-ready multi-tenancy
- ✅ Full CRM capabilities
- ✅ Scalable to 10K+ accounts

**Cons:**
- ❌ Requires data migration
- ❌ More complex RLS policies
- ❌ Longer implementation time

**Timeline:** 1-2 weeks

---

## 📝 NEXT STEPS

1. **DECISION REQUIRED:** Architecture choice (A or B above)
2. **Create migrations** for missing tables
3. **Update Supabase types** to match new schema
4. **Test wizard flows** with real database
5. **Document schema decisions** for team

---

## 🔗 Related Documentation

- [Event Wizard PRD](../../main/event-wizard/00-EVENT-WIZARD-PRD.md)
- [Production Schema](../../supabase/migrations/20251013060000_core_eventos_schema_production.sql)
- [01-Core Schema](../../supabase/01-core/)
- [Migration Best Practices](../../.cursor/rules/migration.mdc)

---

**Status:** ⚠️ **AWAITING ARCHITECTURE DECISION**
**Owner:** Project Lead
**Review Date:** 2025-10-17
