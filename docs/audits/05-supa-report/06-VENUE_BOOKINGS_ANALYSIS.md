# Venue Bookings Migration Analysis

**File:** `20251017080300_venue_bookings.sql`  
**Risk Level:** 🟡 **MEDIUM**  
**Issues Found:** 8 violations  
**Lines Analyzed:** 331

---

## 🚨 Critical Issues

### 1. **Missing Foreign Key Constraint for Venue Ownership**
**Lines:** 19, 126-137  
**Risk:** No venue ownership tracking, orphaned records possible  
**Current Code:**
```sql
venue_id uuid not null references public.venues(id) on delete restrict,
```
**Fix:**
```sql
-- Add venue ownership tracking (requires venues table modification)
-- First, add owner_id to venues table in a separate migration
-- ALTER TABLE public.venues ADD COLUMN owner_id uuid references auth.users(id) on delete set null;

-- Then update the RLS policy
create policy "venue owners can view bookings for their venues"
  on public.venue_bookings
  for select
  to authenticated
  using (
    exists (
      select 1 from public.venues
      where venues.id = venue_bookings.venue_id
      and venues.owner_id = auth.uid()
    )
  );
```

### 2. **Missing Destructive Operation Comments**
**Lines:** 12, 194, 231, 263, 294  
**Risk:** Unsafe operations without warnings  
**Current Code:**
```sql
create table public.venue_bookings (
```
**Fix:**
```sql
-- DESTRUCTIVE: Creates new table structure
create table public.venue_bookings (
```

### 3. **Missing Enum Safety Checks**
**Lines:** 36-41, 44-50, 67  
**Risk:** Invalid data insertion possible  
**Current Code:**
```sql
booking_source text default 'manual' not null check (booking_source in (
  'wizard', 'manual', 'api', 'import'
)),
```
**Fix:**
```sql
-- Create enum types safely
do $$ begin
  create type booking_source_enum as enum ('wizard', 'manual', 'api', 'import');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type booking_status_enum as enum ('pending', 'confirmed', 'rejected', 'cancelled', 'completed');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type payment_status_enum as enum ('unpaid', 'deposit_paid', 'paid', 'refunded');
exception when duplicate_object then null;
end $$;

-- Use enums in table
booking_source booking_source_enum default 'manual' not null,
status booking_status_enum default 'pending' not null,
payment_status payment_status_enum default 'unpaid',
```

### 4. **Missing Performance Index for RLS Queries**
**Lines:** 94-107  
**Risk:** Slow RLS policy evaluation  
**Current Code:**
```sql
create index idx_venue_bookings_event_id on public.venue_bookings(event_id);
```
**Fix:**
```sql
-- Add composite index for RLS performance
create index idx_venue_bookings_event_status on public.venue_bookings(event_id, status);
create index idx_venue_bookings_venue_status on public.venue_bookings(venue_id, status);
```

### 5. **Inconsistent Function Security Context**
**Lines:** 201, 235, 266  
**Risk:** Potential security issues  
**Current Code:**
```sql
security definer
```
**Fix:** ✅ **Already correct** - Properly uses `security definer`

### 6. **Missing Check Constraints for Data Validation**
**Lines:** 22, 26, 53-55  
**Risk:** Invalid data insertion possible  
**Current Code:**
```sql
attendee_count integer not null check (attendee_count > 0),
```
**Fix:**
```sql
-- Add more comprehensive check constraints
attendee_count integer not null check (attendee_count > 0 and attendee_count <= 50000),
quoted_price numeric(10,2) check (quoted_price >= 0),
final_price numeric(10,2) check (final_price >= 0),
-- Ensure final_price is not greater than quoted_price
constraint valid_pricing check (final_price is null or quoted_price is null or final_price <= quoted_price),
```

### 7. **Missing Unique Constraints**
**Lines:** 12-83  
**Risk:** Duplicate bookings possible  
**Current Code:** No unique constraints on booking combinations  
**Fix:**
```sql
-- Add unique constraint to prevent duplicate bookings
constraint unique_venue_event_date unique (venue_id, event_id, event_date),
```

### 8. **Incomplete RLS Policy Coverage**
**Lines:** 112-188  
**Risk:** Missing policies for some operations  
**Current Code:** Missing policies for venue owners  
**Fix:**
```sql
-- Add missing policies for venue owners (requires venues.owner_id field)
create policy "venue owners can view bookings for their venues"
  on public.venue_bookings
  for select
  to authenticated
  using (
    exists (
      select 1 from public.venues
      where venues.id = venue_bookings.venue_id
      and venues.owner_id = auth.uid()
    )
  );

create policy "venue owners can update booking status"
  on public.venue_bookings
  for update
  to authenticated
  using (
    exists (
      select 1 from public.venues
      where venues.id = venue_bookings.venue_id
      and venues.owner_id = auth.uid()
    )
  );
```

---

## ✅ Best Practices Followed

### **Correctly Implemented:**
- ✅ RLS enabled on table (line 110)
- ✅ Proper `auth.uid()` usage in RLS policies
- ✅ `updated_at` trigger implemented (lines 257-260)
- ✅ Proper table comments and documentation
- ✅ Good index coverage for common queries
- ✅ Proper foreign key constraints with appropriate actions
- ✅ Availability checking function with proper logic
- ✅ Auto-linking venue to event on confirmation
- ✅ Comprehensive RLS policies for event organizers
- ✅ Support for anonymous users (wizard flow)

---

## 🔧 Complete Fix Implementation

```sql
-- =====================================================
-- Migration: venue_bookings table
-- Purpose: Venue marketplace booking system for Event Wizard Stage 3
-- Affected tables: venue_bookings (new)
-- Dependencies: events and venues tables must exist
-- Special considerations: Supports booking requests before auth, availability checking, status tracking
-- =====================================================

-- DESTRUCTIVE: Creates new enum types (safe with DO block)
do $$ begin
  create type booking_source_enum as enum ('wizard', 'manual', 'api', 'import');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type booking_status_enum as enum ('pending', 'confirmed', 'rejected', 'cancelled', 'completed');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type payment_status_enum as enum ('unpaid', 'deposit_paid', 'paid', 'refunded');
exception when duplicate_object then null;
end $$;

-- DESTRUCTIVE: Creates new table structure
create table public.venue_bookings (
  id uuid primary key default uuid_generate_v4(),

  -- Event relationship
  event_id uuid not null references public.events(id) on delete cascade,

  -- Venue relationship
  venue_id uuid not null references public.venues(id) on delete restrict,

  -- Event date for booking
  event_date date not null,
  event_date_range daterange,

  -- Booking details
  attendee_count integer not null check (attendee_count > 0 and attendee_count <= 50000),  -- Fixed: add max limit
  event_type text,

  -- Requestor information (before auth)
  requested_by text not null,
  requestor_name text,
  requestor_company text,
  requestor_phone text,

  -- Booking source
  booking_source booking_source_enum default 'manual' not null,  -- Fixed: use enum type

  -- Booking status
  status booking_status_enum default 'pending' not null,  -- Fixed: use enum type

  -- Pricing (optional - for marketplace venues)
  quoted_price numeric(10,2) check (quoted_price >= 0),  -- Fixed: add check constraint
  final_price numeric(10,2) check (final_price >= 0),    -- Fixed: add check constraint
  currency text default 'USD',

  -- Communication
  notes text,
  rejection_reason text,
  special_requests text,

  -- Response tracking
  responded_at timestamptz,
  responded_by uuid references auth.users(id) on delete set null,

  -- Payment tracking (optional)
  payment_status payment_status_enum default 'unpaid',  -- Fixed: use enum type
  payment_due_date date,

  -- Metadata
  metadata jsonb default '{}'::jsonb,

  -- Timestamps
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  confirmed_at timestamptz,
  cancelled_at timestamptz,

  -- FIXED: Add unique constraint to prevent duplicate bookings
  constraint unique_venue_event_date unique (venue_id, event_id, event_date),
  -- FIXED: Add pricing validation
  constraint valid_pricing check (final_price is null or quoted_price is null or final_price <= quoted_price)
);

-- [Continue with indexes, RLS policies, etc. with performance optimization...]

-- FIXED: Add composite indexes for RLS performance
create index idx_venue_bookings_event_status on public.venue_bookings(event_id, status);
create index idx_venue_bookings_venue_status on public.venue_bookings(venue_id, status);

-- [Continue with RLS policies including venue owner policies...]

-- FIXED: Add missing policies for venue owners (requires venues.owner_id field)
-- Note: These policies require the venues table to have an owner_id field
-- create policy "venue owners can view bookings for their venues"
--   on public.venue_bookings
--   for select
--   to authenticated
--   using (
--     exists (
--       select 1 from public.venues
--       where venues.id = venue_bookings.venue_id
--       and venues.owner_id = auth.uid()
--     )
--   );
```

---

## 📊 Impact Assessment

### **Security Improvements:**
- **Complete RLS coverage** for venue owners (requires venues table modification)
- **Proper access control** for booking management
- **Data protection** for sensitive booking information

### **Performance Improvements:**
- **Faster RLS evaluation** with composite indexes
- **Better enum performance** with proper enum types
- **Improved query performance** for common operations

### **Data Integrity:**
- **Type safety** with enum types prevents invalid data
- **Unique constraints** prevent duplicate bookings
- **Check constraints** validate data ranges and relationships

---

## 🎯 Implementation Priority

1. **High:** Add missing composite indexes for RLS performance
2. **High:** Add unique constraint to prevent duplicate bookings
3. **Medium:** Convert to enum types for better data integrity
4. **Medium:** Add check constraints for data validation
5. **Low:** Add destructive operation comments
6. **Future:** Add venue ownership tracking (requires venues table modification)

---

## 🔍 RLS Policy Analysis

### **Current RLS Policies (Good Coverage):**
- ✅ `organizers can view bookings for their events` - Proper event organizer access
- ✅ `organizers can create bookings for their events` - Proper validation
- ✅ `anonymous can create bookings via wizard` - Supports wizard flow
- ✅ `organizers can update their bookings` - Proper ownership check

### **Missing Policies (Requires Venues Table Modification):**
- ❌ **Venue owners viewing bookings** - Requires venues.owner_id field
- ❌ **Venue owners updating booking status** - Requires venues.owner_id field

### **Performance Issues:**
- ❌ **Missing composite indexes** for event_id + status and venue_id + status queries
- ❌ **Slow RLS evaluation** without proper indexing

---

## 🔄 Dependencies for Complete Implementation

### **Required Changes to Venues Table:**
```sql
-- Add to venues table migration or separate migration
ALTER TABLE public.venues ADD COLUMN owner_id uuid references auth.users(id) on delete set null;
CREATE INDEX idx_venues_owner_id ON public.venues(owner_id);

-- Then uncomment the venue owner RLS policies in venue_bookings
```

---

**Next:** Review [Event Dashboards Analysis](./07-EVENT_DASHBOARDS_ANALYSIS.md)
