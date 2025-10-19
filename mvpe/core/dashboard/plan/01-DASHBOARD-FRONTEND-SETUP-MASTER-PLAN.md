# Dashboard Frontend Setup - Master Plan
**Version:** 2.0 (Revised after Implementation Order Audit)
**Date:** 2025-10-18 (Updated: 2025-10-18)
**Status:** ✅ Ready for Implementation (All Dependency Issues Resolved)
**Priority:** HIGH - Production Blocker

**🔍 Audit Status:**
- Audited by: Claude Code Implementation Order Specialist
- Audit Report: `03-IMPLEMENTATION-ORDER-AUDIT.md`
- Corrections Applied: Phase 0 added, Week 1 revised, timeline buffers added
- Score: 95/100 (Excellent - Ready for implementation)

---

## 📋 Executive Summary

This document provides a comprehensive plan to complete the EventOS dashboard frontend with proper database connectivity. Currently, the dashboard has beautiful UI mockups but **zero database integration**, making it non-functional for production use.

### Current Status Assessment

**✅ Completed (UI Only - No Database):**
1. Dashboard.tsx (Overview) - Mock data only
2. DashboardEvents.tsx - Mock data only
3. DashboardEventDetails.tsx - Mock data only
4. DashboardBookings.tsx - Mock data only
5. DashboardFinancials.tsx - Mock data only
6. DashboardGallery.tsx - Mock data only

**❌ Missing Pages (Planned but Not Created):**
1. DashboardCalendar.tsx - Route exists, redirects to Dashboard
2. DashboardAnalytics.tsx - Route exists, redirects to Dashboard
3. DashboardOrganizers.tsx - Route exists, redirects to Dashboard
4. DashboardVenues.tsx - Route exists, redirects to Dashboard
5. DashboardSettings.tsx - Route exists, redirects to Dashboard

**🔴 Critical Issues:**
- **0% Database Connectivity** - All components show hardcoded data
- No feature module architecture
- No TanStack Query hooks for data fetching
- No real-time subscriptions
- Mock data doesn't match real database (e.g., shows 345 events instead of real 5)
- Routes configured but pages not implemented

### Production Readiness Impact

**Current Dashboard Contribution to Production Readiness:** 15%
- ✅ UI Design: 100%
- ❌ Database Integration: 0%
- ❌ Feature Completeness: 54% (6 of 11 pages)
- ❌ Real-time Updates: 0%

**Target:** 100% functional dashboard with real data

---

## 🎯 Implementation Strategy

### Phase 0: Infrastructure Setup (Day 0) ⭐ **CRITICAL - START HERE**
**Priority:** BLOCKER - Must complete before all other phases
**Goal:** Verify database, create directories, generate types, build shared components
**Duration:** 8 hours

### Phase 1: Database Integration (Week 1-2)
**Priority:** CRITICAL - Must complete before Phase 2
**Goal:** Connect all existing dashboard pages to real database
**Duration:** 7 days (52 hours) - Revised from 5 days

### Phase 2: Missing Pages (Week 3)
**Priority:** HIGH
**Goal:** Implement 5 missing dashboard pages

### Phase 3: Real-time Features (Week 4)
**Priority:** MEDIUM
**Goal:** Add live updates and subscriptions

### Phase 4: Polish & Optimization (Week 5)
**Priority:** LOW
**Goal:** Loading states, error handling, animations

---

## 📊 Detailed Analysis

### Existing Pages Breakdown

#### 1. Dashboard.tsx (Main Overview)
**Location:** `/home/sk/event-studio/src/pages/Dashboard.tsx`
**Route:** `/dashboard`
**Status:** ❌ Mock Data Only

**Current Components:**
- 3 Stat cards (Upcoming Events, Total Bookings, Tickets Sold)
- Ticket Sales donut chart
- Sales Revenue bar chart
- Upcoming Event card
- Recent Activity feed

**Database Disconnection Evidence:**
```typescript
// Line 17-21: Hardcoded stats
const stats = [
  { label: "Upcoming Events", value: "345", ... },  // Should be 5
  { label: "Total Bookings", value: "1,798", ... }, // Should be 3
  { label: "Tickets Sold", value: "1,250", ... }    // Should be 3
];

// Line 23-42: Hardcoded activity
const recentActivity = [
  { user: "Admin Stefanus Weber", ... }  // Should be from database
];

// Missing: NO database imports
// Missing: NO useQuery hooks
// Missing: NO real-time subscriptions
```

**Required Database Queries:**
1. Total events count (WHERE status = 'published')
2. Total bookings count (FROM orders)
3. Tickets sold count (FROM tickets WHERE status = 'sold')
4. Revenue total (SUM(total_cents) FROM orders WHERE payment_status = 'paid')
5. Ticket sales breakdown (GROUP BY status)
6. Revenue trend (GROUP BY month)
7. Next upcoming event (ORDER BY start_time LIMIT 1)
8. Recent activity (FROM activity_logs ORDER BY created_at DESC LIMIT 5)

**Implementation Checklist:**
- [ ] Create `/src/features/dashboard/` module
- [ ] Implement `hooks/useDashboardStats.ts`
- [ ] Implement `hooks/useTicketSales.ts`
- [ ] Implement `hooks/useSalesRevenue.ts`
- [ ] Implement `hooks/useUpcomingEvents.ts`
- [ ] Implement `hooks/useRecentActivity.ts`
- [ ] Replace all hardcoded data with hooks
- [ ] Add loading states
- [ ] Add error handling
- [ ] Test with real production data

---

#### 2. DashboardEvents.tsx (Events Management)
**Location:** `/home/sk/event-studio/src/pages/DashboardEvents.tsx`
**Route:** `/dashboard/events`
**Status:** ❌ Mock Data Only

**Required Database Queries:**
1. All events (SELECT * FROM events)
2. Filter by status (WHERE status = ?)
3. Search by name (WHERE name ILIKE ?)
4. Order by date (ORDER BY start_time)

**Implementation Checklist:**
- [ ] Create `/src/features/events/` module
- [ ] Implement `hooks/useEvents.ts` (with filters)
- [ ] Implement `hooks/useCreateEvent.ts`
- [ ] Implement `hooks/useUpdateEvent.ts`
- [ ] Implement `hooks/useDeleteEvent.ts`
- [ ] Add TypeScript types in `types/event.types.ts`
- [ ] Add Zod schemas in `validations/event.schema.ts`
- [ ] Replace mock data
- [ ] Connect to real database
- [ ] Test CRUD operations

---

#### 3. DashboardEventDetails.tsx (Single Event View)
**Location:** `/home/sk/event-studio/src/pages/DashboardEventDetails.tsx`
**Route:** `/dashboard/events/:id`
**Status:** ❌ Mock Data Only

**Required Database Queries:**
1. Event details (SELECT * FROM events WHERE id = ?)
2. Event tickets (SELECT * FROM tickets WHERE event_id = ?)
3. Event orders (SELECT * FROM orders WHERE event_id = ?)
4. Event attendees (SELECT * FROM attendees WHERE event_id = ?)

**Implementation Checklist:**
- [ ] Implement `hooks/useEvent.ts` (single event with relations)
- [ ] Implement `hooks/useEventStats.ts`
- [ ] Replace mock data
- [ ] Add ticket management
- [ ] Add attendee list
- [ ] Test with real event IDs

---

#### 4. DashboardBookings.tsx (Bookings Management)
**Location:** `/home/sk/event-studio/src/pages/DashboardBookings.tsx`
**Route:** `/dashboard/bookings`
**Status:** ❌ Mock Data Only

**Required Database Queries:**
1. All bookings/orders (SELECT * FROM orders)
2. Filter by status (WHERE payment_status = ?)
3. Filter by event (WHERE event_id = ?)
4. Order by date (ORDER BY created_at DESC)
5. Booking stats (COUNT, SUM grouping)

**Implementation Checklist:**
- [ ] Create `/src/features/orders/` module
- [ ] Implement `hooks/useOrders.ts`
- [ ] Implement `hooks/useOrderStats.ts`
- [ ] Add filter functionality
- [ ] Add export functionality
- [ ] Replace mock data
- [ ] Test with real orders

---

#### 5. DashboardFinancials.tsx (Financial Dashboard)
**Location:** `/home/sk/event-studio/src/pages/DashboardFinancials.tsx`
**Route:** `/dashboard/financials`
**Status:** ❌ Mock Data Only

**Required Database Queries:**
1. Total income (SUM(total_cents) WHERE payment_status = 'paid')
2. Total expenses (if expense tracking exists)
3. Balance calculation
4. Revenue by month (GROUP BY month)
5. Revenue by event (GROUP BY event_id)
6. Recent transactions (ORDER BY created_at DESC)

**Implementation Checklist:**
- [ ] Create `/src/features/financials/` module
- [ ] Implement `hooks/useFinancialStats.ts`
- [ ] Implement `hooks/useTransactions.ts`
- [ ] Add revenue breakdown charts
- [ ] Add expense tracking (if needed)
- [ ] Replace mock data
- [ ] Test with real financial data

---

#### 6. DashboardGallery.tsx (Image Gallery)
**Location:** `/home/sk/event-studio/src/pages/DashboardGallery.tsx`
**Route:** `/dashboard/gallery`
**Status:** ❌ Mock Data Only

**Required Database Queries:**
1. Event images (FROM events SELECT image_url)
2. Uploaded media (FROM media table if exists)
3. Gallery metadata

**Implementation Checklist:**
- [ ] Check if media/gallery table exists in database
- [ ] Create media upload functionality if needed
- [ ] Implement `hooks/useGallery.ts`
- [ ] Connect to Supabase Storage
- [ ] Replace mock data
- [ ] Add image upload
- [ ] Test with real images

---

### Missing Pages Implementation

#### 7. DashboardCalendar.tsx (Calendar View) ❌ NOT CREATED
**Route:** `/dashboard/calendar` → Currently redirects to Dashboard
**Priority:** HIGH
**Planned Features (from planning doc):**
- Month view grid
- Event markers on dates
- 4 Stat cards: All Schedules, Events, Meetings, Setup & Rehearsal
- Filter toggles: Event / Meeting / Setup / Task
- Schedule Details sidebar
- "+ New Agenda" button

**Required Database Queries:**
1. Events by month (WHERE start_time BETWEEN ? AND ?)
2. Events by date (WHERE DATE(start_time) = ?)
3. Event types grouping
4. Calendar statistics

**Implementation Checklist:**
- [ ] Create `/src/pages/DashboardCalendar.tsx`
- [ ] Create `/src/features/calendar/` module
- [ ] Implement `hooks/useCalendarEvents.ts`
- [ ] Add calendar component (use shadcn/ui calendar)
- [ ] Add event markers
- [ ] Add sidebar details
- [ ] Add filters
- [ ] Update route in App.tsx
- [ ] Test with real events

---

#### 8. DashboardAnalytics.tsx (Analytics & Reports) ❌ NOT CREATED
**Route:** `/dashboard/analytics` → Currently redirects to Dashboard
**Priority:** MEDIUM
**Planned Features:**
- Date range picker
- KPI comparison
- Event performance charts
- Audience demographics
- Revenue breakdown by category

**Required Database Queries:**
1. Event performance metrics
2. Ticket sales trends
3. Revenue analytics
4. Attendee demographics (if tracked)
5. Category breakdown
6. Time-series data

**Implementation Checklist:**
- [ ] Create `/src/pages/DashboardAnalytics.tsx`
- [ ] Create `/src/features/analytics/` module
- [ ] Implement `hooks/useAnalytics.ts`
- [ ] Add date range picker
- [ ] Add performance charts (use Recharts or Chart.js)
- [ ] Add demographic charts
- [ ] Update route in App.tsx
- [ ] Test with historical data

---

#### 9. DashboardOrganizers.tsx (CRM - Organizers) ❌ NOT CREATED
**Route:** `/dashboard/organizers` → Currently redirects to Dashboard
**Priority:** MEDIUM
**Planned Features:**
- Search + Status filter
- Grid of organizer cards
- "+ Create Organizer" button
- Company logo, name, contact, stats

**Database Schema Check:**
```sql
-- Check if companies/organizers table exists
SELECT * FROM companies LIMIT 1;
-- Current audit shows: 0 rows (table exists but empty)
```

**Required Database Queries:**
1. All companies/organizers (SELECT * FROM companies)
2. Search by name (WHERE name ILIKE ?)
3. Filter by status
4. Organizer statistics

**Implementation Checklist:**
- [ ] Create `/src/pages/DashboardOrganizers.tsx`
- [ ] Create `/src/features/crm/` module
- [ ] Implement `hooks/useCompanies.ts`
- [ ] Implement `hooks/useCreateCompany.ts`
- [ ] Add company card component
- [ ] Add search and filters
- [ ] Update route in App.tsx
- [ ] Test with company data

---

#### 10. DashboardVenues.tsx (CRM - Venues) ❌ NOT CREATED
**Route:** `/dashboard/venues` → Currently redirects to Dashboard
**Priority:** MEDIUM
**Planned Features:**
- Search + filter
- Venue cards with image, capacity, location
- "+ Add Venue" button

**Database Schema Check:**
```sql
-- Check if venues table exists
SELECT * FROM venues LIMIT 1;
-- Need to verify if table exists
```

**Required Database Queries:**
1. All venues (SELECT * FROM venues)
2. Search by name/location
3. Filter by capacity
4. Venue bookings

**Implementation Checklist:**
- [ ] Verify venues table exists in database
- [ ] Create migration if needed
- [ ] Create `/src/pages/DashboardVenues.tsx`
- [ ] Create `/src/features/venues/` module
- [ ] Implement `hooks/useVenues.ts`
- [ ] Implement `hooks/useCreateVenue.ts`
- [ ] Add venue card component
- [ ] Update route in App.tsx
- [ ] Test with venue data

---

#### 11. DashboardSettings.tsx (Settings Panel) ❌ NOT CREATED
**Route:** `/dashboard/settings` → Currently redirects to Dashboard
**Priority:** HIGH
**Planned Sections:**
- Profile & Account
- Payment Settings (Stripe)
- Notifications
- Team Members
- API Keys

**Required Database Queries:**
1. User profile (SELECT * FROM profiles WHERE id = ?)
2. Notification preferences
3. Team members (if multi-user support)
4. API key management

**Implementation Checklist:**
- [ ] Create `/src/pages/DashboardSettings.tsx`
- [ ] Create `/src/features/settings/` module
- [ ] Implement profile settings
- [ ] Add Stripe integration settings
- [ ] Add notification preferences
- [ ] Add API key management
- [ ] Update route in App.tsx
- [ ] Test settings updates

---

## 🏗️ Feature Module Architecture

### Standard Module Structure

Every dashboard feature must follow this architecture (from claude.md section 12):

```
src/features/{feature-name}/
├── hooks/                  # Data fetching and mutations
│   ├── use{Feature}s.ts   # Fetch list
│   ├── use{Feature}.ts    # Fetch single
│   ├── useCreate{Feature}.ts
│   ├── useUpdate{Feature}.ts
│   └── useDelete{Feature}.ts
├── components/            # UI components
│   ├── {Feature}Card.tsx
│   ├── {Feature}Form.tsx
│   └── {Feature}List.tsx
├── types/                 # TypeScript interfaces
│   └── {feature}.types.ts
├── validations/           # Zod schemas
│   └── {feature}.schema.ts
├── store/                 # Zustand state (optional)
│   └── {feature}Store.ts
└── index.ts              # Public exports
```

### Required Feature Modules

Based on dashboard pages, create these modules:

1. **`src/features/dashboard/`** - Main dashboard stats and overview
2. **`src/features/events/`** - Event management
3. **`src/features/orders/`** - Bookings/orders management
4. **`src/features/financials/`** - Financial tracking
5. **`src/features/calendar/`** - Calendar view and scheduling
6. **`src/features/analytics/`** - Analytics and reporting
7. **`src/features/crm/`** - Companies/organizers management
8. **`src/features/venues/`** - Venue management
9. **`src/features/settings/`** - User settings and preferences

---

## 🔧 Implementation Timeline

### 🚨 Phase 0: Infrastructure Setup (Day 0 - 8 hours) ⭐ **START HERE**

**CRITICAL:** Must complete Phase 0 before starting Week 1. All infrastructure must be verified and ready.

#### Morning (4 hours): Database & Data Verification

**1. Database Schema Verification (2 hours)**
```bash
# Create verification script
cat > scripts/verify-dashboard-ready.sh << 'EOF'
#!/bin/bash
echo "🔍 Verifying database schema..."

# Check all required tables exist
REQUIRED_TABLES=(
  events orders tickets attendees profiles
  companies contacts interactions tasks
  promo_codes venues wizard_sessions
  marketing_campaigns budgets ticket_tiers
  event_categories custom_fields
)

for table in "${REQUIRED_TABLES[@]}"; do
  if ! psql "$DATABASE_URL" -c "\d $table" > /dev/null 2>&1; then
    echo "❌ Table '$table' NOT FOUND!"
    exit 1
  fi
done
echo "✅ All tables exist"

# Check RLS enabled
echo "🔍 Checking RLS policies..."
psql "$DATABASE_URL" -c "
  SELECT tablename
  FROM pg_tables
  WHERE schemaname = 'public'
  AND rowsecurity = false;
"

echo "✅ Database schema verified"
EOF

chmod +x scripts/verify-dashboard-ready.sh
./scripts/verify-dashboard-ready.sh
```

**Checklist:**
- [ ] Run schema verification script
- [ ] Verify all 22 tables exist
- [ ] Verify RLS enabled on all tables
- [ ] Test RLS policies with real user session
- [ ] Check foreign keys configured
- [ ] Check indexes exist
- [ ] Run `mcp__supabase__get_advisors` (security)
- [ ] Run `mcp__supabase__get_advisors` (performance)
- [ ] Fix any issues found

**2. Sample Data Creation (2 hours)**
```bash
# Verify sample data exists
psql "$DATABASE_URL" -c "
  SELECT 'events' as table_name, COUNT(*) as count FROM events
  UNION ALL
  SELECT 'orders', COUNT(*) FROM orders
  UNION ALL
  SELECT 'tickets', COUNT(*) FROM tickets
  UNION ALL
  SELECT 'attendees', COUNT(*) FROM attendees;
"
```

**Checklist:**
- [ ] Check if sample data exists (minimum 5 events)
- [ ] If missing, create sample events
- [ ] Create sample orders (minimum 3)
- [ ] Create sample tickets
- [ ] Create sample attendees
- [ ] Verify data relationships (foreign keys work)
- [ ] Test queries return data

**Phase 0 Morning Validation:** Database 100% ready ✓

#### Afternoon (4 hours): Infrastructure & Components

**3. Feature Module Structure (1 hour)**
```bash
# Create all feature module directories at once
mkdir -p src/features/{dashboard,events,orders,financials,calendar,analytics,crm,venues,settings}/{hooks,components,types,validations}

# Create index.ts files
for module in dashboard events orders financials calendar analytics crm venues settings; do
  echo "export * from './hooks'" > src/features/$module/index.ts
done

# Verify structure
tree src/features -L 2
```

**Checklist:**
- [ ] Create all module directories
- [ ] Create index.ts files in each module
- [ ] Verify structure matches standard pattern
- [ ] Document any deviations

**4. TypeScript Types Generation (30 minutes)**
```bash
# Generate types from database schema
npx supabase gen types typescript --local > src/types/database.ts

# Test import
echo "import type { Database } from '@/types/database'" > test-types.ts
npx tsc --noEmit test-types.ts
rm test-types.ts
```

**Checklist:**
- [ ] Generate types from database
- [ ] Verify types file created
- [ ] Test import works
- [ ] Check for TypeScript errors

**5. Shared Dashboard Components (2 hours)**
```typescript
// Create /src/components/dashboard/ directory
mkdir -p src/components/dashboard

// Create LoadingSkeleton.tsx
// Create ErrorMessage.tsx
// Create EmptyState.tsx
// Create StatCard.tsx
// Create ChartWrapper.tsx
// Create index.ts for exports
```

**Checklist:**
- [ ] Create `/src/components/dashboard/` directory
- [ ] Implement `LoadingSkeleton.tsx` (reusable skeleton for all pages)
- [ ] Implement `ErrorMessage.tsx` (error display component)
- [ ] Implement `EmptyState.tsx` (empty state with CTA)
- [ ] Implement `StatCard.tsx` (stats display card)
- [ ] Implement `ChartWrapper.tsx` (chart container)
- [ ] Create `index.ts` for clean exports
- [ ] Test imports work: `import { LoadingSkeleton } from '@/components/dashboard'`

**6. Infrastructure Testing (30 minutes)**
```bash
# Test Supabase connection
npm run dev

# In browser:
# 1. Test signup flow
# 2. Test login flow
# 3. Navigate to protected route
# 4. Verify auth.uid() returns value
# 5. Test logout
```

**Checklist:**
- [ ] Test Supabase connection works
- [ ] Test authentication flow (signup → login → protected route)
- [ ] Test queryClient configuration
- [ ] Test RLS policies with auth.uid()
- [ ] Verify error boundaries work
- [ ] Document any issues

**Phase 0 Afternoon Validation:** All infrastructure ready ✓

#### Phase 0 Success Criteria

**Phase 0 is COMPLETE when:**
- ✅ Database verified script passes
- ✅ All 22 tables exist and RLS enabled
- ✅ Sample data created (5+ events, 3+ orders)
- ✅ All feature module directories created
- ✅ TypeScript types generated from database
- ✅ All 6 shared components implemented and tested
- ✅ Auth flow tested end-to-end
- ✅ No blocking issues documented

**DO NOT START WEEK 1 UNTIL ALL PHASE 0 ITEMS ARE COMPLETE** ⚠️

---

### Week 1: Database Integration - Core Pages (52 hours - 7 days) ⭐ REVISED

**PREREQUISITE:** Phase 0 must be 100% complete before starting Week 1.

#### Day 1: Dashboard Module (10 hours)

**Morning (5 hours):**
- [ ] Implement `hooks/useDashboardStats.ts`
  - Events count query (WHERE status = 'published')
  - Bookings count query
  - Tickets sold query (WHERE status = 'sold')
  - Revenue calculation (SUM total_cents WHERE payment_status = 'paid')
- [ ] Implement `hooks/useTicketSales.ts` (donut chart data)
- [ ] Implement `hooks/useSalesRevenue.ts` (bar chart data)
- [ ] Implement `hooks/useUpcomingEvents.ts` (ORDER BY start_at LIMIT 1)
- [ ] Implement `hooks/useRecentActivity.ts` (activity feed)
- [ ] Test all hooks return real data
- [ ] Add loading states
- [ ] Add error handling

**Afternoon (5 hours):**
- [ ] Open `Dashboard.tsx`
- [ ] Import all dashboard hooks
- [ ] Replace hardcoded stats array with `useDashboardStats()`
- [ ] Replace ticket chart mock data with `useTicketSales()`
- [ ] Replace revenue chart with `useSalesRevenue()`
- [ ] Replace upcoming event card with `useUpcomingEvents()`
- [ ] Replace activity feed with `useRecentActivity()`
- [ ] Add `<LoadingSkeleton />` while loading
- [ ] Add `<ErrorMessage />` on error
- [ ] Test with real database
- [ ] Verify stats match real data:
  - Events: 5 (not 345) ✓
  - Revenue: $926 (not $348,805) ✓
  - Bookings: 3 (not 1,798) ✓
- [ ] Code review
- [ ] Commit changes

**Day 1 Validation:**
- [ ] Dashboard shows REAL event count (5)
- [ ] Shows REAL revenue ($926)
- [ ] Shows REAL bookings (3)
- [ ] Loading states work
- [ ] Error handling works
- [ ] No console errors

#### Day 2: Events Module (12 hours)

**Morning (6 hours):**
- [ ] Create `types/event.types.ts` (TypeScript interfaces)
- [ ] Create `validations/event.schema.ts` (Zod schemas for forms)
- [ ] Implement `hooks/useEvents.ts` (with filters: status, category, search)
- [ ] Implement `hooks/useCreateEvent.ts` (mutation hook)
- [ ] Implement `hooks/useUpdateEvent.ts` (mutation hook)
- [ ] Implement `hooks/useDeleteEvent.ts` (mutation hook)
- [ ] Test CRUD operations manually

**Afternoon (6 hours):**
- [ ] Open `DashboardEvents.tsx`
- [ ] Import events hooks
- [ ] Replace mock data with `useEvents()`
- [ ] Connect search functionality to `useEvents({ search })`
- [ ] Connect filter tabs (Active/Draft/Past) to `useEvents({ status })`
- [ ] Connect category dropdown to `useEvents({ category })`
- [ ] Add `<LoadingSkeleton />` for loading state
- [ ] Add `<ErrorMessage />` for errors
- [ ] Add `<EmptyState />` if no events
- [ ] Test search works (type event name)
- [ ] Test filters work (click tabs)
- [ ] E2E test: Create new event using `useCreateEvent`
- [ ] Code review
- [ ] Commit changes

**Day 2 Validation:**
- [ ] Events list shows real 5 events
- [ ] Search finds events by name
- [ ] Filters work correctly (Active/Draft/Past)
- [ ] Can create new event successfully
- [ ] Form validation works (Zod schema)

#### Day 3: Event Details Module (8 hours)

**Morning (4 hours):**
- [ ] Implement `hooks/useEvent.ts` (single event with relations)
  - Join with tickets table
  - Join with orders table
  - Join with attendees table
- [ ] Implement `hooks/useEventStats.ts` (event-specific metrics)
- [ ] Implement `hooks/useEventTickets.ts` (ticket list for event)
- [ ] Implement `hooks/useEventAttendees.ts` (attendee list)
- [ ] Test hooks with real event ID

**Afternoon (4 hours):**
- [ ] Open `DashboardEventDetails.tsx`
- [ ] Replace mock data with `useEvent(eventId)`
- [ ] Connect stats section with `useEventStats(eventId)`
- [ ] Connect tickets section with `useEventTickets(eventId)`
- [ ] Connect attendees section with `useEventAttendees(eventId)`
- [ ] Add loading states
- [ ] Add error handling for invalid ID (404 page)
- [ ] Test with all real event IDs from database
- [ ] Test 404 behavior with fake ID
- [ ] Commit changes

**Day 3 Validation:**
- [ ] Event details load for valid ID
- [ ] Shows real ticket data
- [ ] Shows real attendee list
- [ ] 404 error for invalid ID
- [ ] Navigation from events list works

#### Day 4: Bookings Module (6 hours)

**Morning (3 hours):**
- [ ] Create `/src/features/orders/` module structure
- [ ] Create `types/order.types.ts`
- [ ] Implement `hooks/useOrders.ts` (with filters: status, event, date)
- [ ] Implement `hooks/useOrderStats.ts` (bookings statistics)
- [ ] Test hooks return correct data

**Afternoon (3 hours):**
- [ ] Open `DashboardBookings.tsx`
- [ ] Replace stats with `useOrderStats()`
- [ ] Replace table data with `useOrders()`
- [ ] Connect filter pills (Confirmed/Pending/Cancelled)
- [ ] Add export functionality (CSV download)
- [ ] Add pagination if > 50 orders
- [ ] Test with real orders (3 orders)
- [ ] Test filters work
- [ ] Commit changes

**Day 4 Validation:**
- [ ] Shows 3 real orders
- [ ] Filters work (Confirmed/Pending)
- [ ] Export to CSV works
- [ ] Order details display correctly

#### Day 5: Financials Module (6 hours)

**Morning (3 hours):**
- [ ] Create `/src/features/financials/` module
- [ ] Implement `hooks/useFinancialStats.ts`
  - Total income calculation
  - Total expenses (if table exists)
  - Balance calculation
  - Monthly breakdown
- [ ] Implement `hooks/useRevenueBreakdown.ts` (by event, by category)
- [ ] Implement `hooks/useTransactions.ts` (recent transactions list)
- [ ] Test calculations match database

**Afternoon (3 hours):**
- [ ] Open `DashboardFinancials.tsx`
- [ ] Replace stats cards with `useFinancialStats()`
- [ ] Replace revenue chart with `useRevenueBreakdown()`
- [ ] Replace transactions table with `useTransactions()`
- [ ] Verify calculations:
  - Total income: $926 (72700 cents)
  - Match database SUM query
- [ ] Test date range filters
- [ ] Commit changes

**Day 5 Validation:**
- [ ] Shows real revenue ($926)
- [ ] Charts reflect real data
- [ ] Calculations match database
- [ ] Breakdown by event works

#### Day 6: Gallery Module + Buffer (6 hours)

**Morning (3 hours):**
- [ ] Verify media/gallery table exists in database
- [ ] If missing, create migration for media table
- [ ] Create `hooks/useGallery.ts`
- [ ] Connect to Supabase Storage bucket
- [ ] Implement `hooks/useUploadImage.ts` (upload to storage)
- [ ] Test image upload flow

**Afternoon (3 hours):**
- [ ] Open `DashboardGallery.tsx`
- [ ] Replace mock images with `useGallery()`
- [ ] Connect upload button to `useUploadImage()`
- [ ] Add image preview
- [ ] Add delete functionality
- [ ] Test with real images from storage
- [ ] Commit changes

**Plus:** Catch up on any delayed tasks from Days 1-5

**Day 6 Validation:**
- [ ] Loads real images from storage
- [ ] Upload works (new image appears)
- [ ] Delete works
- [ ] All Week 1 pages complete

#### Day 7: Integration Testing + Documentation (8 hours)

**Full Day Testing:**
- [ ] Test all 6 pages end-to-end
- [ ] Test navigation between pages (Dashboard → Events → Details)
- [ ] Test loading states on all pages
- [ ] Test error scenarios:
  - Network error
  - Invalid ID
  - Empty data
- [ ] Test with different user accounts (RLS policies)
- [ ] Fix any bugs found during testing
- [ ] Performance testing (query times < 100ms)
- [ ] Mobile responsiveness check
- [ ] Accessibility check (keyboard navigation, screen reader)
- [ ] Document any remaining issues
- [ ] Week 1 demo/review with stakeholders
- [ ] Plan Week 2 tasks

**Week 1 Success Criteria:**
- ✅ ALL 6 existing pages show real data
- ✅ Zero hardcoded mock data remaining
- ✅ Dashboard shows 5 events (not 345)
- ✅ Dashboard shows $926 revenue (not $348,805)
- ✅ Loading states on all pages
- ✅ Error handling on all pages
- ✅ No console errors
- ✅ TypeScript compiles with no errors
- ✅ Performance acceptable (< 2s page load)
- ✅ Manual testing complete
- ✅ Ready for Week 2 (real-time features)

---

### Week 2: Database Integration - Polish (20 hours)

**Monday-Tuesday (16h):** Real-time Updates
- [ ] Add Supabase subscriptions to dashboard
- [ ] Real-time event updates
- [ ] Real-time order updates
- [ ] Real-time ticket sales updates
- [ ] Test subscription performance

**Wednesday-Thursday (4h):** Optimization
- [ ] Optimize queries (indexes, joins)
- [ ] Add pagination where needed
- [ ] Add caching with TanStack Query
- [ ] Performance testing

**Week 2 Success Criteria:**
- ✅ Real-time updates working
- ✅ Query performance < 100ms
- ✅ All existing pages production-ready

---

### Week 3: Missing Pages Implementation (40 hours)

**Monday (8h):** DashboardCalendar.tsx
- [ ] Create page file
- [ ] Create calendar feature module
- [ ] Implement calendar hooks
- [ ] Add calendar UI component
- [ ] Add event markers
- [ ] Test with real events

**Tuesday (8h):** DashboardSettings.tsx
- [ ] Create page file
- [ ] Create settings feature module
- [ ] Implement profile settings
- [ ] Add Stripe integration
- [ ] Add notification preferences
- [ ] Test settings updates

**Wednesday (8h):** DashboardAnalytics.tsx
- [ ] Create page file
- [ ] Create analytics feature module
- [ ] Implement analytics hooks
- [ ] Add charts (Recharts)
- [ ] Add date range picker
- [ ] Test with historical data

**Thursday (8h):** DashboardOrganizers.tsx
- [ ] Create page file
- [ ] Create CRM feature module
- [ ] Implement company hooks
- [ ] Add company cards
- [ ] Add search and filters
- [ ] Test with company data

**Friday (8h):** DashboardVenues.tsx
- [ ] Verify venues table exists
- [ ] Create page file
- [ ] Create venues feature module
- [ ] Implement venue hooks
- [ ] Add venue cards
- [ ] Test with venue data

**Week 3 Success Criteria:**
- ✅ All 5 missing pages created
- ✅ All routes functional (no redirects)
- ✅ All pages connected to database
- ✅ 11/11 dashboard pages complete

---

### Week 4: Polish & Optimization (20 hours)

**Monday-Wednesday (16h):** Polish
- [ ] Add loading skeletons for all pages
- [ ] Add empty states with CTAs
- [ ] Add error boundaries
- [ ] Improve mobile responsiveness
- [ ] Add animations/transitions
- [ ] Accessibility audit (WCAG 2.1 AA)

**Thursday-Friday (4h):** Testing & Documentation
- [ ] E2E testing for all dashboard pages
- [ ] Write dashboard documentation
- [ ] Create user guide
- [ ] Final QA

**Week 4 Success Criteria:**
- ✅ All pages polished
- ✅ Accessibility compliant
- ✅ Mobile responsive
- ✅ E2E tests passing
- ✅ Dashboard 100% production-ready

---

## 📊 Database Schema Verification

Before starting implementation, verify these tables exist:

```sql
-- Core tables (verified from audit)
✅ events (5 rows)
✅ orders (3 rows)
✅ tickets (3 rows)
✅ attendees (4 rows)
✅ profiles (3 rows)

-- CRM tables (exist but empty)
⚠️ companies (0 rows)
⚠️ contacts (0 rows)
⚠️ interactions (0 rows)

-- Additional tables to verify
❓ venues (need to check)
❓ activity_logs (for recent activity feed)
❓ media (for gallery)
❓ analytics_events (for analytics tracking)
```

**Pre-Implementation Tasks:**
- [ ] Run database schema verification query
- [ ] Create missing tables if needed
- [ ] Add sample data for testing
- [ ] Verify RLS policies exist for all tables

---

## 🎯 Success Metrics

### Technical KPIs

**Before:**
- Dashboard pages with database: 0/11 (0%)
- Feature modules created: 0/9 (0%)
- Real data displayed: 0%
- Routes functional: 6/11 (54%)

**Target (After 4 weeks):**
- Dashboard pages with database: 11/11 (100%) ✅
- Feature modules created: 9/9 (100%) ✅
- Real data displayed: 100% ✅
- Routes functional: 11/11 (100%) ✅
- Real-time updates: Yes ✅
- Loading states: All pages ✅
- Error handling: All pages ✅
- Mobile responsive: All pages ✅
- Accessibility: WCAG 2.1 AA ✅

### Business KPIs

**Dashboard Must Show Real:**
- Current event count (5 events, not 345)
- Real revenue ($926, not $348,805)
- Actual bookings (3 orders, not 1,798)
- Live ticket sales (3 tickets, not 1,250)
- Real upcoming events
- Actual activity feed

---

## 🚨 Critical Blockers & Dependencies

### Blockers
1. **Database Access**: Ensure Supabase connection works
2. **RLS Policies**: Must allow authenticated users to read their data
3. **Missing Tables**: Create venues, activity_logs, media tables if needed
4. **Sample Data**: Need test data for all tables

### Dependencies
1. **Edge Functions** (from Phase 1 roadmap): Some features may need backend
2. **Stripe Integration**: For payment settings page
3. **File Upload**: For gallery and event images
4. **Authentication**: All pages require auth

---

## 📝 Code Examples

### Example: Dashboard Stats Hook

```typescript
// src/features/dashboard/hooks/useDashboardStats.ts
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // Get events count
      const { count: eventsCount } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published')

      // Get bookings count
      const { count: bookingsCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })

      // Get tickets sold count
      const { count: ticketsSold } = await supabase
        .from('tickets')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'sold')

      // Get total revenue
      const { data: orders } = await supabase
        .from('orders')
        .select('total_cents')
        .eq('payment_status', 'paid')

      const totalRevenue = orders?.reduce((sum, o) => sum + o.total_cents, 0) || 0

      return {
        upcomingEvents: eventsCount || 0,
        totalBookings: bookingsCount || 0,
        ticketsSold: ticketsSold || 0,
        totalRevenue: totalRevenue / 100, // Convert cents to dollars
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  })
}
```

### Example: Using the Hook in Dashboard

```typescript
// src/pages/Dashboard.tsx
import { useDashboardStats } from '@/features/dashboard'

const Dashboard = () => {
  const { data: stats, isLoading, error } = useDashboardStats()

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />

  return (
    <div>
      <StatsCard label="Upcoming Events" value={stats.upcomingEvents} />
      <StatsCard label="Total Bookings" value={stats.totalBookings} />
      <StatsCard label="Tickets Sold" value={stats.ticketsSold} />
      <StatsCard label="Total Revenue" value={`$${stats.totalRevenue}`} />
    </div>
  )
}
```

---

## 📚 Reference Documents

**Development Guides:**
- `/home/sk/event-studio/claude.md` - AI development manual (sections 11-13)
- `/home/sk/event-studio/IMPROVED_DEVELOPMENT_SYSTEM.md` - Development workflow
- `/home/sk/event-studio/mvp/core/dashboard/dashboard-planning.md` - Original design plan

**Frontend Planning:**
- `/home/sk/event-studio/mvp/core/02-frontend/01-FRONTEND-MASTER-PLAN.md`
- `/home/sk/event-studio/mvp/core/02-frontend/03-DATA-STATE-GUIDE.md`
- `/home/sk/event-studio/mvp/core/02-frontend/04-UI-COMPONENTS-PATTERNS.md`

**Production Roadmap:**
- `/home/sk/event-studio/mvp/progress/PRODUCTION_LAUNCH_ROADMAP.md`

---

## 🎬 Getting Started

### ⚠️ CRITICAL: Start with Phase 0 (Day 0)

**DO NOT skip Phase 0!** All infrastructure must be verified before Week 1.

### Phase 0 (Day 0) Checklist - 8 hours

**Morning (4 hours):**
- [ ] Read this master plan completely
- [ ] Review claude.md sections 11-13
- [ ] Create database verification script (`scripts/verify-dashboard-ready.sh`)
- [ ] Run database schema verification (all 22 tables)
- [ ] Verify RLS policies enabled
- [ ] Test RLS with real user session
- [ ] Check sample data exists (5+ events, 3+ orders)
- [ ] Create sample data if missing
- [ ] Run Supabase security advisors
- [ ] Run Supabase performance advisors

**Afternoon (4 hours):**
- [ ] Create ALL feature module directories:
  ```bash
  mkdir -p src/features/{dashboard,events,orders,financials,calendar,analytics,crm,venues,settings}/{hooks,components,types,validations}
  ```
- [ ] Generate TypeScript types from database:
  ```bash
  npx supabase gen types typescript --local > src/types/database.ts
  ```
- [ ] Create shared dashboard components:
  - LoadingSkeleton.tsx
  - ErrorMessage.tsx
  - EmptyState.tsx
  - StatCard.tsx
  - ChartWrapper.tsx
- [ ] Test Supabase connection
- [ ] Test authentication flow (signup → login → protected route)
- [ ] Test error boundaries work
- [ ] Document any blockers

**Evening:**
- [ ] Verify Phase 0 success criteria (all checkboxes above)
- [ ] Confirm NO blocking issues
- [ ] Plan Week 1 Day 1 tasks
- [ ] **ONLY proceed to Week 1 if Phase 0 is 100% complete**

### Week 1, Day 1 Checklist (AFTER Phase 0)

**Morning (5 hours):**
- [ ] Implement all dashboard hooks (stats, charts, activity)
- [ ] Test hooks with real database
- [ ] Verify TypeScript autocomplete works (from generated types)

**Afternoon (5 hours):**
- [ ] Open Dashboard.tsx
- [ ] Replace ALL mock data with hooks
- [ ] Use shared components (LoadingSkeleton, ErrorMessage)
- [ ] Test with real data
- [ ] Verify correct values display (5 events, $926 revenue)
- [ ] Code review and commit

**Evening:**
- [ ] Review Day 1 progress
- [ ] Document any issues
- [ ] Plan Day 2 tasks

### Daily Workflow

1. **Morning standup** (5 min)
   - Review yesterday's progress
   - Identify today's goal
   - Check for blockers

2. **Implementation** (6 hours)
   - Follow week plan
   - Test as you build
   - Commit after each feature

3. **Testing** (1.5 hours)
   - Manual testing
   - Check with real data
   - Verify loading states

4. **Documentation** (30 min)
   - Update progress
   - Document issues
   - Plan tomorrow

---

## ✅ Definition of Done

A dashboard page is considered **DONE** when:

- [ ] All hardcoded mock data removed
- [ ] Connected to real Supabase database
- [ ] Uses TanStack Query for data fetching
- [ ] Has loading states (skeleton or spinner)
- [ ] Has error handling (error boundary + error message)
- [ ] TypeScript types defined
- [ ] Zod schemas created (if forms exist)
- [ ] Mobile responsive
- [ ] Accessibility checked
- [ ] Manually tested with real data
- [ ] No console errors
- [ ] Code reviewed
- [ ] Committed to git

---

## 🚀 Launch Criteria

The dashboard frontend is **PRODUCTION READY** when:

### Functionality (100%)
- [ ] All 11 pages created
- [ ] All 11 routes functional
- [ ] All components connected to database
- [ ] Zero mock data
- [ ] Real-time updates working

### Quality (100%)
- [ ] All TypeScript errors resolved
- [ ] All console errors fixed
- [ ] Loading states on all pages
- [ ] Error handling on all pages
- [ ] Empty states with CTAs

### Performance (100%)
- [ ] Query performance < 100ms
- [ ] Page load time < 2s
- [ ] Lighthouse score > 90
- [ ] Mobile responsive
- [ ] Accessibility WCAG 2.1 AA

### Testing (100%)
- [ ] Manual testing complete
- [ ] E2E tests passing
- [ ] Cross-browser tested
- [ ] Mobile tested

---

---

## 📊 Revised Timeline Summary

### Original Plan (INCORRECT)
- Week 1: 5 days (40 hours) - Database integration
- Week 2: 5 days (20 hours) - Polish
- Week 3: 5 days (40 hours) - Missing pages
- Week 4: 5 days (20 hours) - Testing
- **Total: 20 days, 120 hours**

### Corrected Plan (AFTER AUDIT) ✅
- **Phase 0: 1 day (8 hours)** - Infrastructure setup ⭐ **ADDED**
- Week 1: 7 days (52 hours) - Database integration (+40% buffer)
- Week 2: 3 days (16 hours) - Real-time features & polish
- Week 3: 7 days (44 hours) - Missing pages (+40% buffer)
- Week 4: 5 days (24 hours) - Final testing & optimization
- **Total: 23 days, 144 hours** (+20% overall)

### Key Changes
1. ✅ **Added Phase 0** (infrastructure verification - CRITICAL)
2. ✅ **Week 1 extended** (5 → 7 days for realistic timeline)
3. ✅ **Added time buffers** (40% added to complex tasks)
4. ✅ **Database verified first** (before any implementation)
5. ✅ **Types generated upfront** (TypeScript autocomplete from Day 1)
6. ✅ **Shared components created first** (no duplication)

---

**Status:** ✅ Ready for Implementation (After Audit Corrections Applied)
**Start Date:** Week 3 of Production Launch Roadmap
**Expected Completion:** Week 7 of Production Launch Roadmap (+1 week for Phase 0 and buffers)
**Owner:** Frontend Development Team

**Critical Reminder:** 🚨 **START WITH PHASE 0** - Do not skip infrastructure setup!

**Questions or blockers?** Refer to claude.md sections 11-13 or escalate immediately.

---

**End of Master Plan** ✅

**Next Steps:**
1. ⭐ **BEGIN WITH PHASE 0 (Day 0)** - Infrastructure setup
2. Verify database schema (all 22 tables)
3. Create all feature module directories
4. Generate TypeScript types
5. Build shared components
6. ONLY THEN start Week 1 database integration
7. Ship production-ready dashboard in 5-6 weeks

🚀 **Let's build a dashboard with REAL data - the RIGHT way!**
