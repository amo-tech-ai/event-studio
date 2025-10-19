# Task 27: Events Pages Supabase Connection Fixes

**Created:** 2025-10-19
**Priority:** 🔴 **CRITICAL**
**Estimated Time:** 2-3 hours
**Status:** 🔴 **NOT STARTED**
**Assignee:** TBD
**Dependencies:** Task 09 (Events Hooks), Task 11 (Event Details)

---

## 📋 **Overview**

Fix critical field mapping bugs in DashboardEvents.tsx and connect DashboardEventDetails.tsx to Supabase database. Currently, events list has wrong field names and detail page uses 100% hardcoded data.

---

## 🚨 **Critical Issues Found**

### **Issue 1: DashboardEvents.tsx Field Mapping Errors**

**Location:** `src/pages/DashboardEvents.tsx`

#### ❌ **Bug 1.1: Wrong event_type field**
- **Line:** 153
- **Current:** `event.event_type`
- **Database Field:** `event.type`
- **Impact:** 🔴 Shows undefined/null instead of event type badge
- **Fix Required:** Change to `event.type`

#### ❌ **Bug 1.2: Wrong price field**
- **Line:** 193
- **Current:** `event.price`
- **Database Field:** `event.price_cents` (stored as cents!)
- **Impact:** 🔴 Shows undefined instead of price, wrong format
- **Fix Required:** `${(event.price_cents / 100).toFixed(2)}`

#### ⚠️ **Bug 1.3: Hardcoded location**
- **Line:** 176
- **Current:** `"Event Location"` (hardcoded string)
- **Database Field:** `event.venue_id` (needs join to venues table)
- **Impact:** 🟡 Shows generic text instead of real venue
- **Fix Required:** Join to venues table and use `venue.name`

#### ⚠️ **Bug 1.4: Missing booking count**
- **Line:** 186
- **Current:** Hardcoded `75%` capacity
- **Database Calculation:** Need count from tickets/orders table
- **Impact:** 🟡 Shows fake progress instead of real bookings
- **Fix Required:** Add booking count to query

---

### **Issue 2: DashboardEventDetails.tsx NOT Connected to Database**

**Location:** `src/pages/DashboardEventDetails.tsx`

#### ❌ **Bug 2.1: All data is hardcoded**
- **Lines:** 10-36
- **Current:** Hardcoded arrays for seatPlan, packages, merchandise
- **Database Tables:** Should fetch from `ticket_tiers`, `events`, `venues`
- **Impact:** 🔴 **CRITICAL** - Page shows fake data for all events
- **Fix Required:** Complete rewrite to use Supabase

#### ❌ **Bug 2.2: No dynamic routing**
- **Current:** Doesn't read `:id` param from URL
- **Route:** `/dashboard/events/:id` exists but unused
- **Impact:** 🔴 Same hardcoded event shows regardless of ID
- **Fix Required:** Use `useParams()` to get event ID

#### ❌ **Bug 2.3: No Supabase hook**
- **Current:** No `useEvent(id)` call
- **Hook Exists:** `src/features/events/hooks/useEvents.ts:54`
- **Impact:** 🔴 Event data never fetched from database
- **Fix Required:** Call `useEvent(id)` hook

#### ❌ **Bug 2.4: No navigation from list**
- **Current:** Event cards in DashboardEvents.tsx don't link to detail page
- **Expected:** Click card → navigate to `/dashboard/events/{id}`
- **Impact:** 🔴 Users can't access detail page
- **Fix Required:** Add `onClick` or `Link` to event cards

---

## ✅ **Todo Checklist**

### **Phase 1: Fix DashboardEvents.tsx Field Mappings** (30 min)

- [ ] **1.1** Fix Event interface in `useEvents.ts`
  - [ ] Change `event_type: string` → `type: string`
  - [ ] Add `price_cents: number` field
  - [ ] Add `venue_id: string | null` field
  - [ ] Regenerate types: `npx supabase gen types typescript`

- [ ] **1.2** Fix field usage in `DashboardEvents.tsx`
  - [ ] Line 153: Change `event.event_type` → `event.type`
  - [ ] Line 193: Change `event.price` → `${(event.price_cents / 100).toFixed(2)}`

- [ ] **1.3** Test field fixes
  - [ ] Navigate to http://localhost:8080/dashboard/events
  - [ ] Verify event type badges show correctly
  - [ ] Verify prices display as "$XX.XX" format
  - [ ] Check console for no TypeScript errors

### **Phase 2: Add Venue Data** (30 min)

- [ ] **2.1** Update useEvents query to join venues
  ```typescript
  .select('*, venue:venues(id, name, address)')
  ```

- [ ] **2.2** Update Event interface to include venue
  ```typescript
  venue?: {
    id: string;
    name: string;
    address: string;
  } | null;
  ```

- [ ] **2.3** Update DashboardEvents.tsx line 176
  - [ ] Change `"Event Location"` → `event.venue?.name || "Location TBD"`

- [ ] **2.4** Test venue display
  - [ ] Verify venue names show for events with venues
  - [ ] Verify "Location TBD" shows for events without venue

### **Phase 3: Add Booking Count** (30 min)

- [ ] **3.1** Create new hook `useEventBookingCounts()`
  - [ ] Query tickets table grouped by event_id
  - [ ] Return map of event_id → ticket count

- [ ] **3.2** Update DashboardEvents.tsx
  - [ ] Call `useEventBookingCounts()` hook
  - [ ] Calculate percentage: `(ticketCount / event.capacity) * 100`
  - [ ] Update progress bar line 186

- [ ] **3.3** Test booking counts
  - [ ] Verify progress bars show real percentages
  - [ ] Verify events with 0 bookings show 0%

### **Phase 4: Connect DashboardEventDetails.tsx** (60 min)

- [ ] **4.1** Add dynamic routing
  - [ ] Import `useParams` from 'react-router-dom'
  - [ ] Get event ID: `const { id } = useParams<{ id: string }>()`
  - [ ] Import `useEvent` hook

- [ ] **4.2** Replace hardcoded data with Supabase
  - [ ] Call `const { data: event, isLoading, error } = useEvent(id!)`
  - [ ] Add loading state component
  - [ ] Add error state component
  - [ ] Remove all hardcoded arrays (lines 10-36)

- [ ] **4.3** Update event header section
  - [ ] Line 69: Change `"Echo Beats Festival"` → `{event.name}`
  - [ ] Line 73: Change hardcoded date → `{new Date(event.start_at).toLocaleString()}`
  - [ ] Line 77: Change hardcoded location → `{event.venue?.name}`
  - [ ] Line 83: Change hardcoded capacity → `{event.capacity}`
  - [ ] Line 87: Change hardcoded price → `${(event.price_cents / 100).toFixed(2)}`

- [ ] **4.4** Update event description
  - [ ] Line 103-107: Change hardcoded text → `{event.description || "No description available"}`

- [ ] **4.5** Add ticket tiers query
  - [ ] Create `useTicketTiers(eventId)` hook
  - [ ] Query `ticket_tiers` table for event
  - [ ] Replace hardcoded seatPlan (lines 10-19) with real data

- [ ] **4.6** Handle missing data gracefully
  - [ ] Show "No packages available" if empty
  - [ ] Show "No merchandise available" if empty
  - [ ] Hide sections with no data

### **Phase 5: Add Navigation from Events List** (15 min)

- [ ] **5.1** Update DashboardEvents.tsx event cards
  - [ ] Import `useNavigate` from 'react-router-dom'
  - [ ] Add onClick to Card (line 144)
  - [ ] Navigate to `/dashboard/events/${event.id}`

- [ ] **5.2** Add hover cursor styling
  - [ ] Ensure `cursor-pointer` class exists on Card
  - [ ] Verify hover effects work

- [ ] **5.3** Test navigation
  - [ ] Click event card in list
  - [ ] Verify navigates to detail page
  - [ ] Verify correct event ID in URL
  - [ ] Verify correct event data loads

### **Phase 6: Testing & Verification** (30 min)

- [ ] **6.1** Test DashboardEvents.tsx
  - [ ] All fields display correctly
  - [ ] No TypeScript errors
  - [ ] No console errors
  - [ ] Event type badges show
  - [ ] Prices formatted correctly
  - [ ] Venue names display
  - [ ] Booking progress shows

- [ ] **6.2** Test DashboardEventDetails.tsx
  - [ ] Page loads with real data
  - [ ] Event info displays correctly
  - [ ] Ticket tiers load
  - [ ] Loading states work
  - [ ] Error states work
  - [ ] Back button works

- [ ] **6.3** Test navigation flow
  - [ ] Events list → Event detail
  - [ ] Event detail → Back to list
  - [ ] Direct URL: `/dashboard/events/{id}`

- [ ] **6.4** Test edge cases
  - [ ] Invalid event ID → 404 or error
  - [ ] Event with no venue
  - [ ] Event with no bookings
  - [ ] Event with no ticket tiers

---

## 📊 **Database Schema Reference**

### **events table** (Supabase)
```typescript
{
  id: string;              // UUID
  name: string;            // Event name
  slug: string;            // URL slug
  type: string;            // NOT event_type!
  status: string;          // published, draft, cancelled
  description: string | null;
  start_at: string;        // ISO timestamp
  end_at: string;          // ISO timestamp
  capacity: number;        // Max attendees
  price_cents: number;     // Price in cents (NOT price!)
  venue_id: string | null; // FK to venues
  organizer_id: string;    // FK to users
  visibility: string;      // public, private
  created_at: string;
  updated_at: string;
}
```

### **venues table**
```typescript
{
  id: string;
  name: string;
  address: string;
  city: string;
  capacity: number;
  // ... other fields
}
```

### **ticket_tiers table** (for event details)
```typescript
{
  id: string;
  event_id: string;        // FK to events
  name: string;            // "VIP", "General Admission"
  price_cents: number;     // Price in cents
  capacity: number;        // Max tickets for this tier
  // ... other fields
}
```

---

## 🔧 **Implementation Examples**

### **Example 1: Fixed Event Interface**

**File:** `src/features/events/hooks/useEvents.ts`

```typescript
export interface Event {
  id: string;
  name: string;
  slug: string;
  type: string;              // ✅ Fixed from event_type
  status: string;
  description: string | null;
  start_at: string;
  end_at: string;
  capacity: number | null;
  price_cents: number;       // ✅ Added
  venue_id: string | null;   // ✅ Added
  created_at: string;
  updated_at: string;
  venue?: {                  // ✅ Added for joined data
    id: string;
    name: string;
    address: string;
  } | null;
}
```

### **Example 2: Fixed useEvents Query with Venue Join**

```typescript
export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          venue:venues(id, name, address)
        `)
        .eq('status', 'published')
        .order('start_at', { ascending: true });

      if (error) throw error;
      return data as Event[];
    },
    staleTime: 5 * 60 * 1000,
  });
}
```

### **Example 3: Connected DashboardEventDetails Component**

```typescript
import { useParams } from 'react-router-dom';
import { useEvent } from '@/features/events/hooks/useEvents';

const DashboardEventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: event, isLoading, error } = useEvent(id!);

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="text-center">
            <p className="text-destructive">Event not found</p>
            <Link to="/dashboard/events">Back to Events</Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <h1>{event.name}</h1>
          <p>{new Date(event.start_at).toLocaleString()}</p>
          <p>{event.venue?.name || "Location TBD"}</p>
          <p>{event.description}</p>
          {/* ... rest of component using event data */}
        </div>
      </main>
    </div>
  );
};
```

### **Example 4: Event Card Navigation**

```typescript
import { useNavigate } from 'react-router-dom';

const DashboardEvents = () => {
  const navigate = useNavigate();
  const { data: events = [], isLoading, error } = useEvents();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {events.map((event) => (
        <Card
          key={event.id}
          className="overflow-hidden hover-lift cursor-pointer transition-all group"
          onClick={() => navigate(`/dashboard/events/${event.id}`)}
        >
          {/* Card content */}
          <Badge>{event.type}</Badge>
          <h3>{event.name}</h3>
          <p>${(event.price_cents / 100).toFixed(2)}</p>
          <p>{event.venue?.name || "Location TBD"}</p>
        </Card>
      ))}
    </div>
  );
};
```

---

## 🎯 **Success Criteria**

### **Phase 1-3 Success (DashboardEvents.tsx)**
- [ ] All event cards show correct event type badges
- [ ] All prices display in "$XX.XX" format
- [ ] Venue names display instead of "Event Location"
- [ ] Booking progress bars show real percentages
- [ ] No TypeScript errors in console
- [ ] No runtime errors in console

### **Phase 4-5 Success (DashboardEventDetails.tsx)**
- [ ] Clicking event card navigates to detail page
- [ ] Detail page loads real event data from database
- [ ] Event name, date, venue display correctly
- [ ] Event description shows
- [ ] Price displays correctly
- [ ] Loading state shows while fetching
- [ ] Error state shows for invalid IDs
- [ ] Back button returns to events list

### **Overall Success**
- [ ] Both pages fully connected to Supabase
- [ ] No hardcoded data remains
- [ ] All field mappings correct
- [ ] Navigation works end-to-end
- [ ] User can browse events → view details → return to list

---

## 📝 **Notes**

### **Database Connection**
- Using pooler connection: `aws-0-us-east-1.pooler.supabase.com:6543`
- Direct connection: `db.asrzdtpyrdgyggqdfwwl.supabase.co:5432`
- Current sample data: 5 events, 3 orders, 3 tickets

### **Type Regeneration**
After any schema changes, regenerate types:
```bash
npx supabase gen types typescript --project-id asrzdtpyrdgyggqdfwwl > src/integrations/supabase/types.ts
```

### **Testing with Real Data**
Current events in database (from sample data):
1. Summer Music Festival
2. Tech Innovation Conference
3. Food & Wine Expo
4. Wellness Retreat Weekend
5. Art Gallery Opening

### **Related Tasks**
- **Task 09:** Events Hooks (useEvents, useEvent)
- **Task 10:** Events Integration
- **Task 11:** Event Details Page
- **Task 26:** Dashboard Audit Progress Tracker

---

## 🐛 **Known Issues to Address**

1. **Price Storage:** Database stores `price_cents` (integer) but UI needs decimal display
2. **Venue Optional:** Some events may not have venue_id, need null handling
3. **Ticket Tiers:** Detail page needs separate query for ticket_tiers table
4. **Booking Count:** Need aggregation query or view for efficient booking counts
5. **Sample Data:** Limited test data (only 5 events), may need more for pagination testing

---

## 🚀 **Next Steps After Completion**

1. **Task 12:** Fix Bookings & Financials pages
2. **Task 14:** Add realtime subscriptions for live updates
3. **Task 15:** Performance optimization with caching
4. **Task 23:** E2E testing with Playwright

---

**Status:** 🔴 **NOT STARTED**
**Blocked By:** None
**Blocks:** Task 11 (Event Details), Task 12 (Bookings/Financials)
**Estimated Completion:** 2025-10-19 (if started today)
