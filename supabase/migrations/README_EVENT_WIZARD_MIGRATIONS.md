# Event Wizard Database Migrations

**Created:** 2025-10-17
**Purpose:** Critical database tables for CopilotKit Event Wizard implementation
**Status:** ✅ Ready for Review

---

## 📋 Overview

This directory contains **5 new migration files** that add essential tables required for the **AI Event Wizard** (6-stage CopilotKit state machine). These migrations address critical gaps identified in the database analysis.

---

## 🔥 Critical Migrations Created

### 1. **20251017080000_wizard_sessions.sql**
**Priority:** 🔴 **CRITICAL**
**Blocks:** ALL wizard stages

**Creates:**
- `wizard_sessions` table

**Purpose:**
- Tracks CopilotKit state across all 6 wizard stages
- Persists progress (contact_info → event_basics → venue_selection → ticketing → marketing → review)
- Enables state recovery after browser refresh
- Stores full wizard state as JSONB for CopilotKit
- Tracks completion metrics (time spent, messages sent)

**Key Features:**
- Supports anonymous users (before auth)
- Links to events created during Stage 2
- Tracks abandonment (auto-marks after 24 hours)
- Full RLS policies for both authenticated and anonymous users

**Tables:** 1
**Indexes:** 8
**Functions:** 2
**RLS Policies:** 6

---

### 2. **20251017080100_ticket_tiers.sql**
**Priority:** 🔴 **CRITICAL**
**Blocks:** Stage 4 (Ticketing)

**Creates:**
- `ticket_tiers` table

**Purpose:**
- Defines pricing levels (Early Bird, Regular, VIP, etc.)
- Separate from individual ticket instances
- Configured during Event Wizard Stage 4
- Tracks quantity available vs sold

**Key Features:**
- Auto-generates URL-friendly slugs
- Auto-marks as "sold_out" when quantity reached
- Computed `quantity_available` field
- Sale period support (start/end dates)
- Display ordering for frontend

**Tables:** 1
**Indexes:** 6
**Functions:** 3
**Triggers:** 3
**RLS Policies:** 6

**Example Tiers:**
- Early Bird: $199 × 150 tickets
- Regular: $299 × 250 tickets
- VIP: $499 × 100 tickets

---

### 3. **20251017080200_marketing_infrastructure.sql**
**Priority:** 🔴 **CRITICAL**
**Blocks:** Stage 5 (Marketing)

**Creates:**
- `marketing_campaigns` table
- `email_templates` table
- `whatsapp_campaigns` table (EventOS exclusive!)

**Purpose:**
- AI-generated marketing content storage
- Multi-channel campaign management
- WhatsApp integration (competitive differentiator vs Zoho)

**Key Features:**

**Marketing Campaigns:**
- Stores AI-generated content as JSONB
- Tracks: landing page, emails, social posts, WhatsApp messages
- Multi-channel support: email, social, whatsapp
- Campaign metrics and analytics

**Email Templates:**
- Template types: announcement, reminder, last_chance, confirmation, follow_up
- Scheduling with offset (e.g., "7 days before event")
- Delivery metrics: sent, opened, clicked, bounced

**WhatsApp Campaigns:**
- 🚀 **UNIQUE TO EVENTOS** - Zoho doesn't have this!
- Broadcast messages to contacts
- Target audiences: all_contacts, ticket_holders, vip_only
- Response tracking

**Tables:** 3
**Indexes:** 18
**Triggers:** 3
**RLS Policies:** 9

**Competitive Advantage:**
```
EventOS: ✅ WhatsApp campaigns
Zoho Backstage: ❌ No WhatsApp support
Eventbrite: ❌ No WhatsApp support
```

---

### 4. **20251017080300_venue_bookings.sql**
**Priority:** 🔴 **CRITICAL**
**Blocks:** Stage 3 (Venue Selection - Marketplace)

**Creates:**
- `venue_bookings` table

**Purpose:**
- Venue marketplace booking requests
- Availability checking
- Booking status tracking (pending → confirmed → completed)

**Key Features:**
- Booking before authentication (wizard flow)
- Date range support for multi-day events
- Availability checking function
- Auto-links venue to event when confirmed
- Supports both marketplace and custom venues
- Pricing negotiation tracking

**Key Function:**
```sql
check_venue_availability(venue_id, event_date, date_range)
  → Returns boolean (true if available)
```

**Booking Flow:**
1. User selects venue in Stage 3
2. Creates booking with status = 'pending'
3. Venue owner reviews (status = 'confirmed' or 'rejected')
4. Auto-links venue to event on confirmation

**Tables:** 1
**Indexes:** 10
**Functions:** 4
**Triggers:** 2
**RLS Policies:** 6

---

### 5. **20251017080400_event_dashboards.sql**
**Priority:** 🟡 **MAJOR**
**Blocks:** Stage 6 (Review & Launch - Analytics)

**Creates:**
- `event_dashboards` table

**Purpose:**
- Real-time analytics after event publish
- Post-launch dashboard data
- Metrics tracking for organizers

**Key Features:**

**Metrics Stored as JSONB:**
```jsonb
{
  "views": 1247,
  "unique_visitors": 892,
  "ticket_sales": 23,
  "revenue": 6877,
  "conversion_rate": 0.0184,
  "traffic_sources": {
    "social": 722,
    "direct": 287,
    "email": 187,
    "whatsapp": 51
  },
  "last_24_hours": {
    "views": 245,
    "ticket_sales": 5,
    "revenue": 1495
  }
}
```

**Functions Provided:**
- `initialize_event_dashboard(event_id)` - Create dashboard on publish
- `update_dashboard_metrics(event_id, metric, value)` - Update metrics
- `create_metrics_snapshot(event_id)` - Historical snapshots

**Denormalized Fields for Performance:**
- `total_views`
- `total_tickets_sold`
- `total_revenue`
- `conversion_rate`

**Tables:** 1
**Indexes:** 8
**Functions:** 4
**Triggers:** 1
**RLS Policies:** 3

---

## 📊 Migration Summary

| Migration | Tables | Functions | Triggers | RLS Policies | Indexes |
|-----------|--------|-----------|----------|--------------|---------|
| wizard_sessions | 1 | 2 | 1 | 6 | 8 |
| ticket_tiers | 1 | 3 | 3 | 6 | 6 |
| marketing_infrastructure | 3 | 0 | 3 | 9 | 18 |
| venue_bookings | 1 | 4 | 2 | 6 | 10 |
| event_dashboards | 1 | 4 | 1 | 3 | 8 |
| **TOTALS** | **7** | **13** | **10** | **30** | **50** |

---

## 🎯 Wizard Stage Coverage

| Stage | Required Tables | Migration | Status |
|-------|----------------|-----------|--------|
| **Stage 1: Contact Info** | wizard_sessions | ✅ 080000 | Ready |
| **Stage 2: Event Basics** | events (existing) + wizard_sessions | ✅ 080000 | Ready |
| **Stage 3: Venue Selection** | venue_bookings | ✅ 080300 | Ready |
| **Stage 4: Ticketing** | ticket_tiers | ✅ 080100 | Ready |
| **Stage 5: Marketing** | marketing_campaigns, email_templates, whatsapp_campaigns | ✅ 080200 | Ready |
| **Stage 6: Review & Launch** | event_dashboards | ✅ 080400 | Ready |

---

## ⚠️ Important Notes

### Architecture Compatibility

These migrations are designed to work with **BOTH** architectural approaches:

**Option A: Single-Tenant (Current Production)**
- Uses `profiles` table (extends auth.users)
- Wizard references `auth.users.id` directly
- Simpler RLS policies

**Option B: Multi-Tenant (01-Core)**
- Uses `accounts` + `users` tables
- Wizard adapted for `account_id` references
- More complex RLS with `account_users` joins

**Current Approach:** Migrations use `auth.users(id)` references which work for BOTH.

### Dependencies

**Required Before Running:**
1. `events` table must exist
2. `venues` table must exist
3. `auth.users` table (Supabase Auth)
4. Function `handle_updated_at()` (or will be created)

**Not Required:**
- `accounts` table (optional for multi-tenant)
- `profiles` table (optional for single-tenant)

### RLS Security

All tables have comprehensive RLS policies:
- ✅ Anonymous users can use wizard (before auth)
- ✅ Authenticated users own their data
- ✅ Event organizers control their events
- ✅ No cross-tenant data leaks

---

## 🚀 How to Apply

### Option 1: Supabase CLI (Recommended)

```bash
# 1. Navigate to project root
cd /home/sk/event-studio

# 2. Stop local Supabase (if running)
supabase stop

# 3. Apply migrations
supabase db reset

# 4. Restart
supabase start

# 5. Verify
supabase db diff
```

### Option 2: Manual SQL

```bash
# Apply in order:
psql -f supabase/migrations/20251017080000_wizard_sessions.sql
psql -f supabase/migrations/20251017080100_ticket_tiers.sql
psql -f supabase/migrations/20251017080200_marketing_infrastructure.sql
psql -f supabase/migrations/20251017080300_venue_bookings.sql
psql -f supabase/migrations/20251017080400_event_dashboards.sql
```

### Option 3: Supabase Dashboard

1. Go to **SQL Editor** in Supabase Dashboard
2. Copy/paste each migration file
3. Execute in order (080000 → 080100 → 080200 → 080300 → 080400)

---

## ✅ Verification Checklist

After applying migrations, verify:

```sql
-- 1. Check tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
  'wizard_sessions',
  'ticket_tiers',
  'marketing_campaigns',
  'email_templates',
  'whatsapp_campaigns',
  'venue_bookings',
  'event_dashboards'
);
-- Should return 7 rows

-- 2. Check RLS enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename LIKE 'wizard_%'
   OR tablename LIKE 'ticket_%'
   OR tablename LIKE 'marketing_%'
   OR tablename LIKE 'venue_%'
   OR tablename = 'event_dashboards';
-- All should have rowsecurity = true

-- 3. Check functions exist
SELECT proname
FROM pg_proc
WHERE proname LIKE 'check_venue%'
   OR proname LIKE 'update_dashboard%'
   OR proname LIKE 'initialize_event%';
-- Should return function names

-- 4. Test wizard session creation
INSERT INTO wizard_sessions (
  contact_email,
  contact_name,
  current_stage
) VALUES (
  'test@example.com',
  'Test User',
  'contact_info'
) RETURNING id;
-- Should return UUID

-- 5. Clean up test
DELETE FROM wizard_sessions WHERE contact_email = 'test@example.com';
```

---

## 🐛 Troubleshooting

### Issue: Foreign Key Constraint Fails
**Error:** `relation "events" does not exist`
**Fix:** Ensure production schema migration runs first:
```bash
psql -f supabase/migrations/20251013060000_core_eventos_schema_production.sql
```

### Issue: Function Already Exists
**Error:** `function "handle_updated_at" already exists`
**Fix:** This is OK - function is shared across tables

### Issue: RLS Policy Conflicts
**Error:** `policy already exists`
**Fix:** Drop existing policies or modify policy names in migrations

### Issue: Permission Denied
**Error:** `permission denied for schema public`
**Fix:** Ensure database user has CREATE privileges:
```sql
GRANT CREATE ON SCHEMA public TO your_user;
```

---

## 📚 Related Documentation

- **[Database Analysis Report](../../docs/database/DATABASE_ANALYSIS_WIZARD_REQUIREMENTS.md)** - Full analysis with red flags
- **[Event Wizard PRD](../../main/event-wizard/00-EVENT-WIZARD-PRD.md)** - Complete wizard specification
- **[Stage Documentation](../../main/event-wizard/)** - Individual stage docs (01-06)
- **[Migration Rules](.cursor/rules/migration.mdc)** - Supabase migration best practices
- **[Schema Rules](.cursor/rules/schema.mdc)** - Schema design guidelines

---

## 🎉 Next Steps

1. **Apply Migrations** (see "How to Apply" above)
2. **Run Verification** (see "Verification Checklist")
3. **Generate TypeScript Types:**
   ```bash
   supabase gen types typescript --local > src/types/supabase.ts
   ```
4. **Update Frontend Code** to use new tables
5. **Implement CopilotKit Hooks** using wizard_sessions state
6. **Test Wizard Flow** end-to-end

---

## 📞 Support

**Issues?** See: [Database Analysis Report](../../docs/database/DATABASE_ANALYSIS_WIZARD_REQUIREMENTS.md)

**Questions?** Check:
- Stage-specific docs in `/main/event-wizard/`
- Migration best practices in `.cursor/rules/migration.mdc`

---

**Status:** ✅ **READY FOR IMPLEMENTATION**
**Reviewed:** Pending
**Approved:** Pending
**Applied:** Pending
