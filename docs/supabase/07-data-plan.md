# EventOS Data Plan & Database Architecture

**Status:** Production Ready
**Last Updated:** October 13, 2025
**Migration:** `20251013060000_core_eventos_schema_production.sql`

---

## =Ë Table of Contents

1. [Overview](#overview)
2. [Implementation Order](#implementation-order)
3. [Core Tables](#core-tables)
4. [Advanced Features](#advanced-features)
5. [Data Relationships](#data-relationships)
6. [Real-World Examples](#real-world-examples)

---

## Overview

EventOS uses a **relational database architecture** built on PostgreSQL through Supabase. The schema is designed for **corporate event management** in the Toronto area, supporting conferences, seminars, workshops, and networking events.

### Design Principles

- **RLS-First Security:** Every table has Row Level Security enabled with granular policies
- **Proper Foreign Key Ordering:** Tables created in dependency order to prevent constraint failures
- **Auto-Generated Identifiers:** Tickets, orders, and events get unique codes automatically
- **Performance Optimized:** Strategic indexes on foreign keys and frequently queried columns
- **Audit Trail:** Timestamps (created_at, updated_at) on all tables

---

## Implementation Order

Tables **must** be implemented in this exact order due to foreign key dependencies:

| Order | Table | Depends On | Why It's Needed |
|-------|-------|------------|-----------------|
| 1 | `profiles` | `auth.users` | Foundation for all user data |
| 2 | `venues` | None | Independent venue information |
| 3 | `events` | profiles, venues | Links organizers to venues |
| 4 | `orders` | profiles, events | Payment transactions |
| 5 | `attendees` | orders, events | Ticket purchaser information |
| 6 | `tickets` | events, orders, attendees | Individual ticket instances |

### Why This Order Matters

**Example of What Would Break:**
```sql
-- L WRONG: This would fail
CREATE TABLE orders (
  event_id UUID REFERENCES events(id) -- events doesn't exist yet!
);

--  CORRECT: Create events first, then orders
CREATE TABLE events (...);
CREATE TABLE orders (
  event_id UUID REFERENCES events(id) -- events exists now
);
```

---

## Core Tables

### 1. Profiles =d
**Purpose:** Extends Supabase Auth with user metadata

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| id | uuid | Primary key, references auth.users | `11111111-...` |
| email | text | User email (indexed) | organizer@eventos.com |
| full_name | text | Display name | Sarah Johnson |
| phone | text | Contact number | +1-416-555-0101 |
| company | text | Organization name | EventOS Inc |
| created_at | timestamptz | Registration date | 2025-01-15 10:30:00 |
| updated_at | timestamptz | Last profile update | 2025-01-20 14:25:00 |

**Use Cases:**
- **Event Organizer Dashboard:** Display organizer name and contact info
- **Customer Profile Page:** Show attendee details and purchase history
- **Admin Panel:** List all users with filtering capabilities

**Real-World Example:**
```typescript
// Fetch organizer profile for event creation form
const { data: profile } = await supabase
  .from('profiles')
  .select('full_name, company, phone')
  .eq('id', user.id)
  .single();

// Display: "Welcome back, Sarah Johnson from EventOS Inc"
```

**RLS Policies:**
- Anonymous: Can view all profiles (for event organizer attribution)
- Authenticated: Can view all + update their own

---

### 2. Venues <Û
**Purpose:** Toronto event locations with capacity and amenities

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| id | uuid | Primary key | `a1111111-...` |
| name | text | Venue name | Metro Toronto Convention Centre |
| address | text | Street address | 255 Front St W |
| city | text | City (default: Toronto) | Toronto |
| postal_code | text | ZIP/Postal code | M5V 2W6 |
| capacity | integer | Maximum attendees (10-50,000) | 5000 |
| amenities | jsonb | Features object | `{"wifi": true, "parking": true}` |
| contact_email | text | Venue booking email | events@mtccc.com |
| contact_phone | text | Venue phone | +1-416-585-8000 |
| created_at | timestamptz | Record created | 2025-01-10 09:00:00 |
| updated_at | timestamptz | Last update | 2025-01-10 09:00:00 |

**Use Cases:**
- **Event Creation:** Select venue from dropdown during event setup
- **Venue Finder:** Public directory of available event spaces
- **Capacity Planning:** Filter venues by minimum capacity requirements
- **Amenity Matching:** Find venues with specific features (wifi, parking, catering)

**Real-World Example:**
```typescript
// Find venues that can accommodate 200+ people with parking
const { data: venues } = await supabase
  .from('venues')
  .select('name, address, capacity, contact_email')
  .gte('capacity', 200)
  .filter('amenities', 'cs', '{"parking": true}')
  .order('capacity', { ascending: true });

// Results: Steam Whistle Brewing (800), Royal York (1500), MTCC (5000)
```

**RLS Policies:**
- Anonymous: Read-only access (public venue directory)
- Authenticated: Read-only access
- Organizers: Can create/update venues (admin feature)

---

### 3. Events <«
**Purpose:** Corporate events (conferences, seminars, workshops, networking)

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| id | uuid | Primary key | `e1111111-...` |
| organizer_id | uuid | FK to profiles | `11111111-...` |
| venue_id | uuid | FK to venues (nullable) | `a1111111-...` |
| name | text | Event title | AI & Machine Learning Summit 2025 |
| slug | text | URL-friendly identifier | ai-ml-summit-2025-e1111111 |
| type | text | conference/seminar/workshop/networking | conference |
| description | text | Event details | Join industry leaders for... |
| start_at | timestamptz | Event start time | 2025-06-15 09:00:00-04 |
| end_at | timestamptz | Event end time | 2025-06-16 18:00:00-04 |
| capacity | integer | Max tickets (10-10,000) | 500 |
| price_cents | integer | Ticket price in cents | 29900 ($299.00) |
| status | text | draft/published/cancelled/completed | published |
| visibility | text | public/private | public |
| created_at | timestamptz | Event created | 2025-01-15 10:00:00 |
| updated_at | timestamptz | Last updated | 2025-02-01 14:30:00 |

**Use Cases:**
- **Public Event Listing:** Homepage displaying upcoming events
- **Organizer Dashboard:** Manage draft and published events
- **Event Detail Page:** Show full event information to potential attendees
- **Ticket Sales:** Calculate availability (capacity - tickets_sold)
- **Event Calendar:** Display events by date with filtering

**Real-World Example:**
```typescript
// Homepage: Show upcoming published public events
const { data: upcomingEvents } = await supabase
  .from('events')
  .select(`
    id, name, slug, type, description, start_at,
    price_cents, capacity,
    venues (name, city),
    profiles (full_name, company)
  `)
  .eq('status', 'published')
  .eq('visibility', 'public')
  .gte('start_at', new Date().toISOString())
  .order('start_at', { ascending: true })
  .limit(10);

// Display cards with: Name, Organizer, Venue, Date, Price, "Buy Tickets" button
```

**Auto-Generated Fields:**
- **slug:** `generate_event_slug()` trigger creates URL-safe identifier
  - Example: "AI Summit 2025" ’ "ai-summit-2025-e1111111"

**RLS Policies:**
- Anonymous: View published + public events only
- Authenticated: View published + public events, create own events
- Organizers: View/update/delete their own events (any status)

---

### 4. Orders =³
**Purpose:** Payment transactions for ticket purchases

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| id | uuid | Primary key | `01111111-...` |
| customer_id | uuid | FK to profiles (buyer) | `22222222-...` |
| event_id | uuid | FK to events | `e1111111-...` |
| order_number | text | Unique order ID | ORD-20251013-01111111 |
| quantity | integer | Number of tickets (1-20) | 2 |
| unit_price_cents | integer | Price per ticket | 29900 |
| total_cents | integer | Total amount paid | 59800 (2 × $299) |
| payment_status | text | pending/paid/failed/refunded | paid |
| stripe_payment_intent_id | text | Stripe payment reference | pi_test_123456789 |
| paid_at | timestamptz | Payment timestamp | 2025-02-15 14:30:00 |
| created_at | timestamptz | Order created | 2025-02-15 14:25:00 |
| updated_at | timestamptz | Last updated | 2025-02-15 14:30:00 |

**Use Cases:**
- **Purchase History:** Show customer's past orders
- **Order Confirmation:** Display order details after payment
- **Revenue Analytics:** Calculate total sales by event
- **Refund Processing:** Track refunded orders
- **Payment Reconciliation:** Match Stripe transactions to orders

**Real-World Example:**
```typescript
// Create order during checkout
const { data: order, error } = await supabase
  .from('orders')
  .insert({
    customer_id: user.id,
    event_id: selectedEvent.id,
    quantity: 2,
    unit_price_cents: selectedEvent.price_cents,
    total_cents: 2 * selectedEvent.price_cents,
    payment_status: 'pending'
  })
  .select()
  .single();

// After Stripe payment succeeds:
await supabase
  .from('orders')
  .update({
    payment_status: 'paid',
    stripe_payment_intent_id: paymentIntent.id,
    paid_at: new Date().toISOString()
  })
  .eq('id', order.id);
```

**Auto-Generated Fields:**
- **order_number:** `generate_order_number()` trigger creates unique ID
  - Format: `ORD-YYYYMMDD-UUIDPREFIX`
  - Example: `ORD-20251013-01111111`

**Constraints:**
- `total_cents = quantity * unit_price_cents` (validated)
- `stripe_payment_intent_id` unique (prevents duplicate payments)

**RLS Policies:**
- Customers: View their own orders
- Organizers: View orders for their events
- Anonymous: No access

---

### 5. Attendees =e
**Purpose:** Information about people attending events

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| id | uuid | Primary key | `a0111111-...` |
| order_id | uuid | FK to orders | `01111111-...` |
| event_id | uuid | FK to events | `e1111111-...` |
| full_name | text | Attendee name | Michael Chen |
| email | text | Attendee email | customer@example.com |
| phone | text | Contact number | +1-416-555-0102 |
| created_at | timestamptz | Record created | 2025-02-15 14:30:00 |
| updated_at | timestamptz | Last updated | 2025-02-15 14:30:00 |

**Use Cases:**
- **Ticket Assignment:** Collect attendee info during checkout
- **Event Check-In:** Verify attendee identity at door
- **Event Communications:** Send pre-event emails to all attendees
- **Attendee List:** Show organizers who's coming to their event
- **Networking Features:** Display attendee directory (with permission)

**Real-World Example:**
```typescript
// Collect attendee info during multi-ticket checkout
const attendees = [
  { full_name: "John Doe", email: "john@example.com" },
  { full_name: "Jane Smith", email: "jane@example.com" }
];

const { data: insertedAttendees } = await supabase
  .from('attendees')
  .insert(
    attendees.map(a => ({
      order_id: order.id,
      event_id: event.id,
      ...a
    }))
  )
  .select();

// Organizer dashboard: View attendee list
const { data: eventAttendees } = await supabase
  .from('attendees')
  .select('full_name, email, phone')
  .eq('event_id', myEvent.id)
  .order('created_at', { ascending: true });
```

**Why Separate from Profiles?**
- Customer might buy tickets for other people
- Attendee email ` Buyer email necessarily
- Enables gifting, corporate bulk purchases

**RLS Policies:**
- Customers: View attendees from their orders
- Organizers: View attendees for their events
- Anonymous: No access

---

### 6. Tickets <Ÿ
**Purpose:** Individual ticket instances with QR codes

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| id | uuid | Primary key | `b1111111-...` |
| event_id | uuid | FK to events | `e1111111-...` |
| order_id | uuid | FK to orders | `01111111-...` |
| attendee_id | uuid | FK to attendees (nullable) | `a0111111-...` |
| ticket_number | text | Unique ticket ID | TKT-B1111111-251013 |
| qr_code | text | Base64 QR code data | 8qUJkWga7N1L7g3+8Zow... |
| status | text | active/used/cancelled/refunded | active |
| checked_in_at | timestamptz | Check-in timestamp | NULL (not checked in yet) |
| created_at | timestamptz | Ticket created | 2025-02-15 14:30:00 |
| updated_at | timestamptz | Last updated | 2025-02-15 14:30:00 |

**Use Cases:**
- **Ticket Display:** Show customer their tickets after purchase
- **QR Code Scanning:** Check in attendees at event entrance
- **Ticket Verification:** Validate ticket authenticity
- **Event Statistics:** Count active vs. used vs. cancelled tickets
- **Duplicate Prevention:** Ensure each ticket used only once

**Real-World Example:**
```typescript
// Customer views their tickets
const { data: myTickets } = await supabase
  .from('tickets')
  .select(`
    ticket_number,
    qr_code,
    status,
    checked_in_at,
    events (name, start_at, venues (name, address)),
    attendees (full_name, email)
  `)
  .eq('order_id', order.id);

// Display digital tickets with QR codes

// Check-in app: Scan QR and update status
const { data: ticket } = await supabase
  .from('tickets')
  .update({
    status: 'used',
    checked_in_at: new Date().toISOString()
  })
  .eq('qr_code', scannedQRCode)
  .eq('status', 'active') // Only check in active tickets
  .select()
  .single();
```

**Auto-Generated Fields:**
- **ticket_number:** `generate_ticket_codes()` trigger creates unique ID
  - Format: `TKT-UUIDPREFIX-YYMMDD`
  - Example: `TKT-B1111111-251013`
- **qr_code:** Auto-generated 32-byte random code (Base64 encoded)

**RLS Policies:**
- Customers: View tickets from their orders
- Organizers: View/update tickets for their events (check-in)
- Anonymous: No access

---

## Advanced Features

### 1. event_stats View =Ê
**Purpose:** RLS-safe real-time ticket statistics (replaces denormalized columns)

**Why a View?**
- **RLS-Safe:** Cross-table triggers don't work with Row Level Security
- **Always Accurate:** Computed from tickets table in real-time
- **Performance:** Postgres query optimizer makes it fast
- **Maintainability:** No sync issues between tables

**Columns:**
- `event_id` - Event reference
- `event_name` - Event title
- `capacity` - Total capacity
- `tickets_sold` - Count of active + used tickets
- `tickets_available` - Capacity - tickets_sold
- `tickets_active` - Unused tickets
- `tickets_used` - Checked-in tickets
- `tickets_cancelled` - Cancelled tickets

**Use Cases:**
- **Event Listing:** Show "50 tickets remaining"
- **Capacity Alerts:** Warn when event nearly sold out
- **Sales Dashboard:** Track ticket sales velocity
- **Availability Check:** Prevent overbooking

**Real-World Example:**
```typescript
// Event card component
const { data: eventWithStats } = await supabase
  .from('events')
  .select(`
    id, name, slug, price_cents,
    event_stats!inner (tickets_sold, tickets_available)
  `)
  .eq('id', eventId)
  .single();

// Display: "299 tickets available (201 sold / 500 capacity)"
```

---

### 2. Automatic Code Generation >

All unique identifiers are auto-generated via database triggers:

| Object | Function | Format | Example |
|--------|----------|--------|---------|
| Events | `generate_event_slug()` | `{name-slug}-{uuid-prefix}` | ai-ml-summit-2025-e1111111 |
| Orders | `generate_order_number()` | `ORD-{YYYYMMDD}-{uuid-prefix}` | ORD-20251013-01111111 |
| Tickets | `generate_ticket_codes()` | `TKT-{uuid-prefix}-{YYMMDD}` | TKT-B1111111-251013 |

**Benefits:**
- **Consistency:** All codes follow standard format
- **Readability:** Human-friendly identifiers
- **Uniqueness:** Guaranteed by database
- **Sortability:** Includes date information

---

### 3. Timestamp Management ð

Every table has automatic timestamp handling:

- **created_at:** Set once when record created (immutable)
- **updated_at:** Auto-updated on every modification

Trigger: `handle_updated_at()` function

**Use Cases:**
- **Audit Trail:** Track when data changed
- **Sorting:** "Most recent first" queries
- **Analytics:** Time-series analysis
- **Debugging:** Identify stale data

---

## Data Relationships

```
auth.users (Supabase Auth)
    “
profiles (1:1)         , ’ events (1:N)   ’ event_stats (1:1 view)
    ‘                           “
      orders (N:1)    $          ’ attendees (N:1)
              “                           “
           tickets    4                  
              ‘
         venues (N:1)

Legend:
1:1  = One-to-one relationship
1:N  = One-to-many relationship
N:1  = Many-to-one relationship (reverse of 1:N)
```

### Key Relationships

1. **User ’ Events:** One organizer can create many events
2. **Event ’ Venue:** Many events can use one venue
3. **User ’ Orders:** One customer can place many orders
4. **Order ’ Event:** Many orders for one event
5. **Order ’ Attendees:** One order creates multiple attendees
6. **Order ’ Tickets:** One order generates multiple tickets
7. **Attendee ’ Ticket:** One ticket per attendee
8. **Event ’ Stats:** Each event has computed statistics

---

## Real-World Examples

### Example 1: Complete Ticket Purchase Flow

```typescript
// 1. User browses events
const { data: events } = await supabase
  .from('events')
  .select(`
    *,
    venues (name, address),
    profiles (full_name),
    event_stats (tickets_available)
  `)
  .eq('status', 'published')
  .eq('visibility', 'public');

// 2. User selects event, adds 2 tickets to cart
const selectedEvent = events[0];
const quantity = 2;

// 3. Create order (payment pending)
const { data: order } = await supabase
  .from('orders')
  .insert({
    customer_id: user.id,
    event_id: selectedEvent.id,
    quantity,
    unit_price_cents: selectedEvent.price_cents,
    total_cents: quantity * selectedEvent.price_cents,
    payment_status: 'pending'
  })
  .select()
  .single();

// 4. Process payment with Stripe
const paymentIntent = await stripe.paymentIntents.create({
  amount: order.total_cents,
  currency: 'cad',
  metadata: { order_id: order.id }
});

// 5. Update order status
await supabase
  .from('orders')
  .update({
    payment_status: 'paid',
    stripe_payment_intent_id: paymentIntent.id,
    paid_at: new Date().toISOString()
  })
  .eq('id', order.id);

// 6. Create attendees (collect info from user)
const attendeeData = [
  { full_name: 'John Doe', email: 'john@example.com', phone: '+1-416-555-1111' },
  { full_name: 'Jane Smith', email: 'jane@example.com', phone: '+1-416-555-2222' }
];

const { data: attendees } = await supabase
  .from('attendees')
  .insert(
    attendeeData.map(a => ({
      order_id: order.id,
      event_id: selectedEvent.id,
      ...a
    }))
  )
  .select();

// 7. Create tickets (auto-generated codes and QR)
const { data: tickets } = await supabase
  .from('tickets')
  .insert(
    attendees.map(attendee => ({
      event_id: selectedEvent.id,
      order_id: order.id,
      attendee_id: attendee.id,
      status: 'active'
    }))
  )
  .select();

// 8. Send confirmation email with tickets
await sendOrderConfirmation(order.id, tickets);
```

### Example 2: Organizer Dashboard

```typescript
// Fetch organizer's events with statistics
const { data: myEvents } = await supabase
  .from('events')
  .select(`
    id, name, slug, status, start_at, capacity,
    venues (name, address),
    event_stats (
      tickets_sold,
      tickets_available,
      tickets_active,
      tickets_used
    )
  `)
  .eq('organizer_id', user.id)
  .order('start_at', { ascending: false });

// For each event, show:
// - Event name and status
// - Venue info
// - Ticket sales: "125 / 200 sold (75 remaining)"
// - Check-in rate: "80 checked in / 125 sold (64%)"
```

### Example 3: Event Check-In App

```typescript
// Scan QR code at event entrance
const scannedQRCode = await scanQRCode();

// Look up and check in ticket
const { data: ticket, error } = await supabase
  .from('tickets')
  .update({
    status: 'used',
    checked_in_at: new Date().toISOString()
  })
  .eq('qr_code', scannedQRCode)
  .eq('event_id', currentEvent.id)
  .eq('status', 'active') // Only active tickets can be checked in
  .select(`
    ticket_number,
    attendees (full_name, email),
    events (name)
  `)
  .single();

if (error) {
  if (error.code === 'PGRST116') {
    alert('Invalid ticket or already checked in');
  }
} else {
  alert(` Welcome ${ticket.attendees.full_name}!`);
}
```

### Example 4: Revenue Analytics

```typescript
// Calculate total revenue by event
const { data: revenueByEvent } = await supabase
  .from('orders')
  .select(`
    event_id,
    events (name),
    total_cents
  `)
  .eq('payment_status', 'paid');

// Group by event and sum
const revenue = revenueByEvent.reduce((acc, order) => {
  const eventName = order.events.name;
  acc[eventName] = (acc[eventName] || 0) + order.total_cents;
  return acc;
}, {});

// Display:
// AI Summit: $59,800 CAD (200 tickets)
// Leadership Seminar: $12,900 CAD (100 tickets)
```

---

## Database Statistics

| Metric | Value | Notes |
|--------|-------|-------|
| Tables | 6 | Core data tables |
| Views | 1 | event_stats (computed) |
| RLS Policies | 28 | Granular security by role |
| Indexes | 15 | Optimized query performance |
| Triggers | 9 | Auto-generation & timestamps |
| Functions | 4 | Trigger logic |
| Check Constraints | 11 | Data validation |

---

## Frontend Integration Guide

### 1. Configuration (src/lib/supabase.ts)

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

### 2. TypeScript Types

Types are auto-generated at: `src/types/supabase.ts`

Regenerate with:
```bash
npx supabase gen types typescript --linked > src/types/supabase.ts
```

### 3. Common Queries

**Fetch Public Events:**
```typescript
const { data, error } = await supabase
  .from('events')
  .select('*, venues(*), profiles(*)')
  .eq('status', 'published')
  .eq('visibility', 'public');
```

**Create Event:**
```typescript
const { data, error } = await supabase
  .from('events')
  .insert({
    organizer_id: user.id,
    venue_id: selectedVenue.id,
    name: 'My Conference',
    type: 'conference',
    start_at: '2025-12-01T09:00:00Z',
    end_at: '2025-12-01T18:00:00Z',
    capacity: 100,
    price_cents: 9900
  });
```

---

## Security & Performance

### Row Level Security (RLS)

All tables have RLS enabled with policies for:
- **Anonymous (anon):** Read-only access to public data
- **Authenticated:** Read-write based on ownership
- **Service Role:** Full access (backend only)

### Performance Optimizations

1. **Indexes:** Foreign keys and frequently queried columns
2. **Cached Auth:** `(select auth.uid())` prevents per-row function calls
3. **Computed Views:** event_stats uses Postgres query optimizer
4. **Connection Pooling:** Supabase handles automatically

---

## Troubleshooting

### Common Issues

**1. "Permission Denied" Error**
- Check RLS policies are enabled
- Verify user has correct role (anon vs authenticated)
- Ensure grants are configured (see migration file)

**2. "Foreign Key Violation"**
- Tables must exist before referencing
- Follow implementation order strictly

**3. "Tickets Sold Not Updating"**
- Don't use denormalized column
- Use `event_stats` view instead

---

## Next Steps

1. **Frontend Components:** Build React components for each table
2. **API Routes:** Create server-side endpoints for complex operations
3. **Real-time Subscriptions:** Listen to database changes
4. **Analytics Dashboard:** Implement organizer insights
5. **Email Notifications:** Trigger emails on order completion

---

**Documentation Complete** 
For questions, see: `/docs/supabase/MIGRATION_COMPLETE.md`
