# Task 02: Sample Data Creation
**Priority:** 🟡 HIGH
**Estimated Time:** 2 hours
**Status:** 🟡 PARTIAL (60% complete)
**Dependencies:** Task 01 (Database Verification)

---

## 🎯 Objective

Ensure all database tables have adequate sample data for testing dashboard features.

---

## ✅ Success Criteria

- [ ] Events table: 5+ events (✅ EXISTS)
- [ ] Orders table: 3+ orders (✅ EXISTS)
- [ ] Tickets table: 3+ tickets (✅ EXISTS)
- [ ] Attendees table: 4+ attendees (✅ EXISTS)
- [ ] Companies table: 5+ companies (🔴 EMPTY)
- [ ] Venues table: 3+ venues (❓ UNKNOWN)
- [ ] All foreign key relationships populated
- [ ] Test queries return data

---

## 📋 Task Checklist

### 1. Verify Existing Sample Data (15 min)

```sql
-- Check core tables
SELECT 'events' as table_name, COUNT(*) as count FROM events
UNION ALL
SELECT 'orders', COUNT(*) FROM orders
UNION ALL
SELECT 'tickets', COUNT(*) FROM tickets
UNION ALL
SELECT 'attendees', COUNT(*) FROM attendees
UNION ALL
SELECT 'profiles', COUNT(*) FROM profiles
UNION ALL
SELECT 'companies', COUNT(*) FROM companies
UNION ALL
SELECT 'contacts', COUNT(*) FROM contacts
UNION ALL
SELECT 'venues', COUNT(*) FROM venues;
```

- [ ] Run count query for all tables
- [ ] Document current counts
- [ ] Identify which tables need data

**Current Counts:**
```
events: 5 ✅
orders: 3 ✅
tickets: 3 ✅
attendees: 4 ✅
profiles: 3 ✅
companies: 0 🔴
contacts: 0 🔴
venues: ___ ❓
```

### 2. Create Sample Companies Data (30 min)

**Required for:** DashboardOrganizers.tsx (Week 3)

```sql
-- Insert sample companies
INSERT INTO companies (
  id,
  name,
  email,
  phone,
  website,
  industry,
  status,
  notes
) VALUES
  (
    gen_random_uuid(),
    'TechCon Events Ltd',
    'contact@techconevents.com',
    '+1-555-0101',
    'https://techconevents.com',
    'Technology',
    'active',
    'Leading tech conference organizer'
  ),
  (
    gen_random_uuid(),
    'Festival Producers Inc',
    'info@festivalproducers.com',
    '+1-555-0102',
    'https://festivalproducers.com',
    'Entertainment',
    'active',
    'Music and arts festival specialists'
  ),
  (
    gen_random_uuid(),
    'Corporate Summit Group',
    'hello@corporatesummit.com',
    '+1-555-0103',
    'https://corporatesummit.com',
    'Business',
    'active',
    'Business conference management'
  ),
  (
    gen_random_uuid(),
    'Sports Events Co',
    'contact@sportsevents.com',
    '+1-555-0104',
    'https://sportsevents.com',
    'Sports',
    'active',
    'Athletic event coordination'
  ),
  (
    gen_random_uuid(),
    'Arts & Culture Foundation',
    'info@artsculture.org',
    '+1-555-0105',
    'https://artsculture.org',
    'Arts',
    'active',
    'Cultural event programming'
  );
```

- [ ] Verify companies table schema
- [ ] Insert 5+ sample companies
- [ ] Verify insert successful
- [ ] Test SELECT query returns companies

### 3. Create Sample Venues Data (30 min)

**Required for:** DashboardVenues.tsx (Week 3)

```sql
-- First verify venues table exists
\d venues

-- Insert sample venues
INSERT INTO venues (
  id,
  name,
  address,
  city,
  state,
  country,
  postal_code,
  capacity,
  venue_type,
  amenities,
  status
) VALUES
  (
    gen_random_uuid(),
    'Grand Convention Center',
    '123 Main Street',
    'Los Angeles',
    'CA',
    'USA',
    '90001',
    5000,
    'convention_center',
    ARRAY['parking', 'wifi', 'av_equipment', 'catering'],
    'active'
  ),
  (
    gen_random_uuid(),
    'Riverside Amphitheater',
    '456 River Road',
    'San Francisco',
    'CA',
    'USA',
    '94101',
    3000,
    'outdoor',
    ARRAY['parking', 'sound_system', 'lighting'],
    'active'
  ),
  (
    gen_random_uuid(),
    'Downtown Performance Hall',
    '789 Broadway Ave',
    'New York',
    'NY',
    'USA',
    '10001',
    1500,
    'theater',
    ARRAY['wifi', 'av_equipment', 'backstage', 'green_room'],
    'active'
  );
```

- [ ] Check if venues table exists
- [ ] If missing, note for migration creation
- [ ] Insert 3+ sample venues
- [ ] Verify insert successful
- [ ] Test SELECT query returns venues

### 4. Create Sample Contacts (CRM) (20 min)

**Required for:** CRM features

```sql
-- Insert sample contacts linked to companies
INSERT INTO contacts (
  id,
  company_id,
  first_name,
  last_name,
  email,
  phone,
  position,
  status
)
SELECT
  gen_random_uuid(),
  c.id,
  'John',
  'Smith',
  'john.smith@' || LOWER(REPLACE(c.name, ' ', '')) || '.com',
  '+1-555-' || LPAD((ROW_NUMBER() OVER())::text, 4, '0'),
  'Event Coordinator',
  'active'
FROM companies c
LIMIT 5;
```

- [ ] Link contacts to companies
- [ ] Insert 5+ sample contacts
- [ ] Verify foreign key relationships
- [ ] Test JOIN query works

### 5. Test Data Relationships (20 min)

```sql
-- Test event → orders → tickets flow
SELECT
  e.id as event_id,
  e.name as event_name,
  COUNT(DISTINCT o.id) as order_count,
  COUNT(DISTINCT t.id) as ticket_count,
  SUM(o.total_cents) as total_revenue
FROM events e
LEFT JOIN orders o ON e.id = o.event_id
LEFT JOIN tickets t ON o.id = t.order_id
GROUP BY e.id, e.name;

-- Test companies → contacts relationship
SELECT
  c.name as company_name,
  COUNT(ct.id) as contact_count
FROM companies c
LEFT JOIN contacts ct ON c.id = ct.company_id
GROUP BY c.id, c.name;

-- Test venues can be queried
SELECT
  v.name,
  v.city,
  v.capacity,
  v.venue_type
FROM venues v
ORDER BY v.name;
```

- [ ] Test event relationships
- [ ] Verify revenue calculations
- [ ] Test company relationships
- [ ] Test venue queries
- [ ] Document any broken relationships

### 6. Create Additional Test Data (20 min)

**For edge cases and testing:**

```sql
-- Draft event (for filter testing)
INSERT INTO events (name, slug, event_type, status, start_at, end_at)
VALUES (
  'Draft Event - Testing',
  'draft-event-testing',
  'conference',
  'draft',
  NOW() + INTERVAL '60 days',
  NOW() + INTERVAL '61 days'
);

-- Past event (for filter testing)
INSERT INTO events (name, slug, event_type, status, start_at, end_at)
VALUES (
  'Past Event - Historical',
  'past-event-historical',
  'workshop',
  'completed',
  NOW() - INTERVAL '30 days',
  NOW() - INTERVAL '29 days'
);

-- Cancelled order (for status testing)
INSERT INTO orders (event_id, user_id, total_cents, payment_status, status)
SELECT
  id,
  (SELECT id FROM profiles LIMIT 1),
  5000,
  'refunded',
  'cancelled'
FROM events
LIMIT 1;
```

- [ ] Create draft event for testing
- [ ] Create past event for testing
- [ ] Create cancelled order for testing
- [ ] Verify different statuses work

---

## 📊 Sample Data Summary

| Table | Required | Current | Status | Notes |
|-------|----------|---------|--------|-------|
| **events** | 5+ | 5 | ✅ | Includes draft, active, past |
| **orders** | 3+ | 3 | ✅ | Includes cancelled order |
| **tickets** | 3+ | 3 | ✅ | Linked to orders |
| **attendees** | 4+ | 4 | ✅ | Linked to events |
| **profiles** | 3+ | 3 | ✅ | User accounts |
| **companies** | 5+ | 0 → 5 | 🟡 | Create in this task |
| **contacts** | 5+ | 0 → 5 | 🟡 | Create in this task |
| **venues** | 3+ | ? → 3 | 🟡 | Create in this task |

---

## 🚩 Potential Issues

### If Venues Table Doesn't Exist

```sql
-- Migration to create venues table
CREATE TABLE IF NOT EXISTS venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  postal_code TEXT,
  capacity INTEGER,
  venue_type TEXT,
  amenities TEXT[],
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY "Allow authenticated users to read venues"
ON venues FOR SELECT
TO authenticated
USING (true);
```

- [ ] Check if venues table exists
- [ ] If missing, create migration
- [ ] Apply migration
- [ ] Insert sample data

---

## ✅ Validation Queries

Run these to verify sample data is ready:

```sql
-- 1. Verify all tables have data
SELECT
  'events' as table_name,
  COUNT(*) as count,
  CASE WHEN COUNT(*) >= 5 THEN '✅' ELSE '❌' END as status
FROM events
UNION ALL
SELECT 'orders', COUNT(*), CASE WHEN COUNT(*) >= 3 THEN '✅' ELSE '❌' END FROM orders
UNION ALL
SELECT 'companies', COUNT(*), CASE WHEN COUNT(*) >= 5 THEN '✅' ELSE '❌' END FROM companies
UNION ALL
SELECT 'venues', COUNT(*), CASE WHEN COUNT(*) >= 3 THEN '✅' ELSE '❌' END FROM venues;

-- 2. Test revenue calculation
SELECT
  SUM(total_cents) as total_revenue_cents,
  ROUND(SUM(total_cents) / 100.0, 2) as total_revenue_dollars
FROM orders
WHERE payment_status = 'paid';

-- Expected: $7.27 or similar (72700 cents)

-- 3. Test filter capabilities
SELECT status, COUNT(*)
FROM events
GROUP BY status;

-- Expected: published, draft, completed statuses
```

---

## 🎯 Next Task

After completing this task:
- [ ] All tables have sample data
- [ ] Foreign keys validated
- [ ] Test queries return data
- [ ] Proceed to **Task 03: Phase 0 - Feature Module Structure**

---

## 📝 Notes

**Data Created:**
- Companies: _____ rows
- Venues: _____ rows
- Contacts: _____ rows

**Issues Found:**
-

**Time Spent:** _____ hours

**Completed By:** ___________________
**Date:** ___________________
