# EventOS Core Schema Audit Report
**Date:** 2025-10-12
**Status:** CRITICAL ISSUES FOUND - NOT PRODUCTION READY
**Auditor:** Claude Code (database-architect analysis)

---

## Executive Summary

🔴 **CRITICAL:** Schema has **13 critical issues** that MUST be fixed before production deployment.

**Overall Grade:** D (Not Production Ready)
- Security: C- (Missing schema qualifiers, duplicate policies, weak venue security)
- Performance: B (Good indexes, minor optimization opportunities)
- Best Practices: D (SQL style violations, missing table comments, wrong policy structure)
- Data Integrity: B+ (Good constraints and foreign keys)

---

## Critical Issues (Must Fix)

### 1. 🔴 MISSING SCHEMA QUALIFIERS (All Tables)
**Severity:** CRITICAL
**Risk:** Tables will be created in wrong schema or fail in production

**Problem:**
```sql
-- ❌ WRONG (all 6 files)
create table profiles (...)
create table venues (...)
```

**Fix Required:**
```sql
-- ✅ CORRECT
create table public.profiles (...)
create table public.venues (...)
```

**Files Affected:** All 6 schema files
**Impact:** High - Could cause deployment failures or schema confusion

---

### 2. 🔴 MISSING TABLE COMMENTS (All Tables)
**Severity:** CRITICAL (Best Practice Violation)
**Risk:** Poor maintainability, unclear table purpose

**Problem:** No `comment on table` statements in any file

**Fix Required:**
```sql
create table public.profiles (...);
comment on table public.profiles is 'User profiles extending auth.users with additional metadata for event organizers and attendees.';

create table public.venues (...);
comment on table public.venues is 'Event venues in Toronto area with capacity and amenity information.';

create table public.events (...);
comment on table public.events is 'Corporate events including conferences, seminars, workshops, and networking events.';

create table public.orders (...);
comment on table public.orders is 'Order transactions for event ticket purchases with Stripe payment tracking.';

create table public.attendees (...);
comment on table public.attendees is 'Event attendees who may differ from the order customer. Supports bulk ticket purchases.';

create table public.tickets (...);
comment on table public.tickets is 'Individual event tickets with QR codes for check-in and status tracking.';
```

**Files Affected:** All 6 files
**Impact:** Medium - Mandatory per project style guide

---

### 3. 🔴 DUPLICATE SELECT POLICIES (All Tables)
**Severity:** CRITICAL (Redundant, Performance Impact)
**Risk:** Inefficient policy evaluation, confusion

**Problem:** Every table has separate SELECT policies for `anon` and `authenticated` with identical logic

**Example from profiles (lines 18-28):**
```sql
-- ❌ WRONG - Duplicate policies
create policy "profiles are viewable by everyone"
  on profiles for select
  to anon
  using (true);

create policy "profiles are viewable by authenticated users"
  on profiles for select
  to authenticated
  using (true);
```

**Fix Required:**
```sql
-- ✅ CORRECT - Single policy for both roles
create policy "profiles are viewable by everyone"
  on public.profiles for select
  to anon, authenticated
  using (true);
```

**Files Affected:**
- 01_profiles.sql (lines 18-28)
- 02_venues.sql (lines 21-31)
- 03_events.sql (lines 34-44)

**Impact:** High - 3 unnecessary policies, wastes policy evaluation cycles

---

### 4. 🔴 WEAK VENUE SECURITY
**Severity:** CRITICAL
**Risk:** Any authenticated user can modify/delete ALL venues

**Problem (02_venues.sql lines 33-50):**
```sql
-- ❌ WRONG - Any authenticated user can do anything
create policy "authenticated users can insert venues"
  on venues for insert
  to authenticated
  with check (true);  -- SECURITY RISK!

create policy "authenticated users can update venues"
  on venues for update
  to authenticated
  using (true)  -- SECURITY RISK!
  with check (true);

create policy "authenticated users can delete venues"
  on venues for delete
  to authenticated
  using (true);  -- SECURITY RISK!
```

**Fix Required (Short-term):**
```sql
-- ✅ BETTER - Restrict to event organizers only
create policy "organizers can insert venues"
  on public.venues for insert
  to authenticated
  with check (
    exists (
      select 1 from public.events
      where organizer_id = (select auth.uid())
    )
  );

-- Only allow updates to venues used in user's events
create policy "organizers can update their event venues"
  on public.venues for update
  to authenticated
  using (
    id in (
      select venue_id from public.events
      where organizer_id = (select auth.uid())
    )
  );

-- Prevent deletions if venue has events
create policy "prevent venue deletion if has events"
  on public.venues for delete
  to authenticated
  using (
    not exists (select 1 from public.events where venue_id = id)
  );
```

**Fix Required (Long-term):**
- Add `user_roles` table with 'admin' role
- Restrict venue CUD operations to admin role only
- Document in comment: "Future: restrict to admin role via has_role()"

**Files Affected:** 02_venues.sql
**Impact:** CRITICAL - Data integrity and security risk

---

### 5. 🔴 MISSING INDEX ON STRIPE_PAYMENT_INTENT_ID
**Severity:** HIGH
**Risk:** Slow webhook processing, duplicate charge risk

**Problem (04_orders.sql):**
```sql
create table orders (
  ...
  stripe_payment_intent_id text,  -- ❌ No index or unique constraint
  ...
);
```

**Fix Required:**
```sql
-- ✅ Add unique index for idempotency
create unique index idx_orders_stripe_payment_intent_id
  on public.orders(stripe_payment_intent_id)
  where stripe_payment_intent_id is not null;
```

**Rationale:**
- Webhook idempotency requires fast lookup by payment_intent
- Unique constraint prevents duplicate charges
- Partial index (where not null) saves space

**Files Affected:** 04_orders.sql
**Impact:** HIGH - Could cause duplicate charges without this

---

### 6. 🔴 MISSING INDEX ON ORDER_NUMBER
**Severity:** MEDIUM
**Risk:** Slow order lookups

**Problem (04_orders.sql line 7):**
```sql
order_number text unique not null,  -- Unique constraint creates index, but no explicit index declared
```

**Fix:** Acceptable as-is (unique constraint auto-creates index), but add comment:
```sql
order_number text unique not null,  -- unique constraint creates btree index automatically
```

**Files Affected:** 04_orders.sql
**Impact:** LOW - Auto-handled, but needs documentation

---

### 7. 🔴 SQL STYLE VIOLATIONS (All Files)
**Severity:** MEDIUM (Must fix per style guide)
**Risk:** Inconsistent codebase, harder maintenance

**Problems:**

**a) Inconsistent indentation and spacing**
```sql
-- ❌ WRONG
create policy "customers can view their own orders"
  on orders for select
  to authenticated
  using ((select auth.uid()) = customer_id);

-- ✅ CORRECT (more readable)
create policy "customers can view their own orders"
  on public.orders
  for select
  to authenticated
  using (
    (select auth.uid()) = customer_id
  );
```

**b) Missing newlines in complex policies**
```sql
-- ❌ WRONG (hard to read)
using (event_id in (select id from events where organizer_id = (select auth.uid())))

-- ✅ CORRECT
using (
  event_id in (
    select id
    from public.events
    where organizer_id = (select auth.uid())
  )
)
```

**Files Affected:** All files
**Impact:** MEDIUM - Readability and maintainability

---

### 8. 🔴 EVENTS: CONFLICTING SELECT POLICIES
**Severity:** HIGH
**Risk:** Confusing policy logic, potential access issues

**Problem (03_events.sql lines 34-50):**
```sql
-- Policy 1: Anon users can see published public events
create policy "published public events are viewable by everyone"
  on events for select
  to anon
  using (status = 'published' and visibility = 'public');

-- Policy 2: Authenticated users can see published public events
create policy "published public events are viewable by authenticated users"
  on events for select
  to authenticated
  using (status = 'published' and visibility = 'public');

-- Policy 3: Organizers can see their own events (all statuses)
create policy "organizers can view their own events"
  on events for select
  to authenticated
  using ((select auth.uid()) = organizer_id);
```

**Issues:**
- Policies 1 & 2 are duplicates (same logic for different roles)
- Organizers get TWO policies evaluated (policy 2 + policy 3)

**Fix Required:**
```sql
-- ✅ CORRECT - Single policy for public events
create policy "published public events are viewable by all"
  on public.events
  for select
  to anon, authenticated
  using (
    status = 'published'
    and visibility = 'public'
  );

-- Policy for organizers to see their own events (any status)
create policy "organizers can view their own events"
  on public.events
  for select
  to authenticated
  using (
    (select auth.uid()) = organizer_id
  );
```

**Files Affected:** 03_events.sql
**Impact:** MEDIUM - Inefficient but functional

---

### 9. 🔴 ATTENDEES: DUPLICATE UPDATE POLICIES
**Severity:** MEDIUM
**Risk:** Policy conflict, unclear permissions

**Problem (05_attendees.sql lines 56-88):**
Two separate UPDATE policies with potentially overlapping permissions:
1. "customers can update their order attendees" (lines 56-71)
2. "organizers can update attendees for their events" (lines 73-88)

**Issue:**
- If customer IS the organizer, both policies apply
- Confusing which policy grants access
- Inefficient (double policy evaluation)

**Fix Required:**
```sql
-- ✅ CORRECT - Single policy combining both
create policy "customers or organizers can update attendees"
  on public.attendees
  for update
  to authenticated
  using (
    -- Customer owns the order
    order_id in (
      select id from public.orders
      where customer_id = (select auth.uid())
    )
    or
    -- Organizer owns the event
    event_id in (
      select id from public.events
      where organizer_id = (select auth.uid())
    )
  )
  with check (
    -- Same logic for write checks
    order_id in (
      select id from public.orders
      where customer_id = (select auth.uid())
    )
    or
    event_id in (
      select id from public.events
      where organizer_id = (select auth.uid())
    )
  );
```

**Files Affected:** 05_attendees.sql
**Impact:** MEDIUM - Works but inefficient

---

### 10. 🔴 TICKETS: WEAK INSERT POLICY
**Severity:** HIGH
**Risk:** Any authenticated user can create tickets for paid orders (not just order owner or service role)

**Problem (06_tickets.sql lines 48-57):**
```sql
-- ❌ WRONG - Any authenticated user can create tickets for ANY paid order
create policy "service role can insert tickets"
  on tickets for insert
  to authenticated  -- ❌ Should be service_role, not authenticated!
  with check (
    order_id in (
      select id from orders
      where payment_status = 'paid'
    )
  );
```

**Fix Required:**
```sql
-- ✅ CORRECT - Only service role (webhooks) can create tickets
-- Remove the above policy and handle ticket creation via service role only
-- Tickets should be created server-side in Stripe webhook handler
```

**Alternative (if allowing manual ticket creation):**
```sql
-- ✅ CORRECT - Only order owner can create tickets for their paid orders
create policy "customers can create tickets for their paid orders"
  on public.tickets
  for insert
  to authenticated
  with check (
    order_id in (
      select id from public.orders
      where customer_id = (select auth.uid())
        and payment_status = 'paid'
    )
  );
```

**Files Affected:** 06_tickets.sql
**Impact:** CRITICAL - Security vulnerability

---

### 11. 🔴 MISSING UPDATED_AT TRIGGER (All Tables)
**Severity:** MEDIUM
**Risk:** updated_at column never updates automatically

**Problem:** All tables have `updated_at timestamp with time zone default now() not null` but no trigger to update it

**Fix Required:**
```sql
-- Create reusable trigger function (add to 01_profiles.sql or separate file)
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
comment on function public.handle_updated_at() is 'Automatically updates the updated_at column on row updates.';

-- Apply to all tables
create trigger set_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

create trigger set_updated_at
  before update on public.venues
  for each row
  execute function public.handle_updated_at();

create trigger set_updated_at
  before update on public.events
  for each row
  execute function public.handle_updated_at();

create trigger set_updated_at
  before update on public.orders
  for each row
  execute function public.handle_updated_at();

create trigger set_updated_at
  before update on public.attendees
  for each row
  execute function public.handle_updated_at();

create trigger set_updated_at
  before update on public.tickets
  for each row
  execute function public.handle_updated_at();
```

**Files Affected:** All 6 files
**Impact:** MEDIUM - Data accuracy issue

---

### 12. 🔴 MISSING EVENT SLUG GENERATION
**Severity:** MEDIUM
**Risk:** Manual slug creation error-prone

**Problem (03_events.sql line 8):**
```sql
slug text unique not null,  -- ❌ No automatic generation
```

**Fix Required:**
```sql
-- Add trigger function for slug generation
create or replace function public.generate_event_slug()
returns trigger
language plpgsql
as $$
begin
  if new.slug is null or new.slug = '' then
    new.slug = lower(regexp_replace(new.name, '[^a-zA-Z0-9]+', '-', 'g'))
               || '-' || substr(new.id::text, 1, 8);
  end if;
  return new;
end;
$$;

create trigger set_event_slug
  before insert on public.events
  for each row
  execute function public.generate_event_slug();
```

**Files Affected:** 03_events.sql
**Impact:** MEDIUM - UX and data quality

---

### 13. 🔴 MISSING TICKET NUMBER/QR CODE GENERATION
**Severity:** HIGH
**Risk:** Tickets created without numbers/QR codes

**Problem (06_tickets.sql lines 8-9):**
```sql
ticket_number text unique not null,  -- ❌ No automatic generation
qr_code text unique not null,        -- ❌ No automatic generation
```

**Fix Required:**
```sql
-- Add trigger function
create or replace function public.generate_ticket_codes()
returns trigger
language plpgsql
as $$
begin
  if new.ticket_number is null or new.ticket_number = '' then
    new.ticket_number = 'TKT-' || upper(substr(new.id::text, 1, 8))
                       || '-' || to_char(new.created_at, 'YYMMDD');
  end if;

  if new.qr_code is null or new.qr_code = '' then
    new.qr_code = encode(gen_random_bytes(32), 'base64');
  end if;

  return new;
end;
$$;

create trigger set_ticket_codes
  before insert on public.tickets
  for each row
  execute function public.generate_ticket_codes();
```

**Files Affected:** 06_tickets.sql
**Impact:** HIGH - Critical for ticket functionality

---

## Warnings (Should Fix)

### W1. Events: Denormalized tickets_sold Counter
**Severity:** LOW
**Risk:** Data sync issues if not updated atomically

**Recommendation:** Add trigger to update tickets_sold when tickets are inserted/deleted:
```sql
create or replace function public.update_tickets_sold()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    update public.events
    set tickets_sold = tickets_sold + 1
    where id = new.event_id;
  elsif tg_op = 'DELETE' then
    update public.events
    set tickets_sold = tickets_sold - 1
    where id = old.event_id;
  end if;
  return null;
end;
$$;

create trigger maintain_tickets_sold
  after insert or delete on public.tickets
  for each row
  execute function public.update_tickets_sold();
```

### W2. Orders: Missing Constraint Between quantity and tickets
**Severity:** LOW
**Risk:** Order quantity doesn't match actual ticket count

**Recommendation:** Add application-level validation or database check via trigger

### W3. Missing Cascade Delete Policies
**Severity:** LOW
**Risk:** Orphaned records if foreign key cascades happen

**Current:** All FKs use default `ON DELETE NO ACTION`

**Recommendation:** Define explicit cascade behavior:
```sql
-- 03_events.sql
organizer_id uuid not null references public.profiles(id) on delete restrict,  -- Prevent deletion if has events
venue_id uuid references public.venues(id) on delete set null,  -- Allow venue deletion

-- 04_orders.sql
customer_id uuid not null references public.profiles(id) on delete restrict,  -- Keep order history
event_id uuid not null references public.events(id) on delete restrict,  -- Prevent deletion if has orders

-- 05_attendees.sql
order_id uuid not null references public.orders(id) on delete cascade,  -- Delete attendees with order
event_id uuid not null references public.events(id) on delete cascade,  -- Delete attendees with event

-- 06_tickets.sql
order_id uuid not null references public.orders(id) on delete cascade,  -- Delete tickets with order
event_id uuid not null references public.events(id) on delete cascade,  -- Delete tickets with event
attendee_id uuid references public.attendees(id) on delete set null,  -- Keep ticket if attendee removed
```

---

## Best Practices Violations

### BP1. Inconsistent Comment Style
- Some files use `--` for section headers
- No block comments (`/* */`) for complex logic
- **Fix:** Standardize on `--` for line comments, `/* */` for multi-line explanations

### BP2. No Explicit NULL Handling
- Many text columns allow NULL without justification
- **Recommendation:** Document why NULLs are acceptable or add NOT NULL constraints

### BP3. No Data Validation Functions
- Check constraints use inline logic
- **Recommendation:** Extract to reusable functions for complex validations

---

## Missing Features (Future Enhancements)

1. **Audit Trail:** No created_by/updated_by columns
2. **Soft Deletes:** No deleted_at pattern (intentional per design doc)
3. **Full-Text Search:** No GIN indexes on text columns (events.name, events.description)
4. **Geolocation:** No PostGIS support for venue location search
5. **Multi-Currency:** Only CAD (price_cents) supported
6. **Event Recurrence:** No recurring event pattern
7. **Ticket Tiers:** Intentionally omitted for MVP (single price per event)
8. **User Roles Table:** Noted as future enhancement in comments

---

## Production Readiness Checklist

### Must Fix Before Production (13 items)
- [ ] Add `public.` schema qualifier to all CREATE TABLE statements
- [ ] Add `comment on table` for all 6 tables
- [ ] Merge duplicate SELECT policies (profiles, venues, events)
- [ ] Fix venue security policies (restrict to organizers or admin role)
- [ ] Add unique index on orders.stripe_payment_intent_id
- [ ] Fix SQL style inconsistencies (indentation, spacing)
- [ ] Merge conflicting events SELECT policies
- [ ] Merge duplicate attendees UPDATE policies
- [ ] Fix tickets INSERT policy (restrict to service role or order owner)
- [ ] Add updated_at trigger for all tables
- [ ] Add event slug auto-generation trigger
- [ ] Add ticket number/QR code auto-generation trigger
- [ ] Add tickets_sold counter maintenance trigger

### Should Fix Before Production (3 items)
- [ ] Add explicit ON DELETE cascade rules
- [ ] Add tickets count validation trigger
- [ ] Standardize comment style

### Nice to Have (8 items)
- [ ] Add audit columns (created_by, updated_by)
- [ ] Add full-text search indexes
- [ ] Add geolocation support
- [ ] Document NULL handling strategy
- [ ] Extract validation logic to functions
- [ ] Add data retention policies
- [ ] Add backup/recovery procedures documentation
- [ ] Add performance benchmarking plan

---

## Recommended Fix Order

**Phase 1: Critical Security & Correctness (Must do first)**
1. Add schema qualifiers (`public.`)
2. Fix venue security policies
3. Fix tickets INSERT policy
4. Add stripe_payment_intent_id unique index

**Phase 2: Automation & Data Integrity**
5. Add updated_at triggers
6. Add slug generation trigger
7. Add ticket codes generation trigger
8. Add tickets_sold counter trigger

**Phase 3: RLS Optimization**
9. Merge duplicate SELECT policies
10. Merge duplicate UPDATE policies
11. Add explicit ON DELETE rules

**Phase 4: Documentation & Style**
12. Add table comments
13. Fix SQL formatting
14. Standardize comment style

---

## Conclusion

**Current Status:** NOT PRODUCTION READY

**Critical Blockers:** 13 issues must be resolved

**Estimated Fix Time:** 4-6 hours

**Recommendation:**
1. Create corrected schema files following the fix order above
2. Re-generate migration after fixes
3. Test locally with sample data
4. Review security policies with security team
5. Only then proceed to production deployment

**Risk Assessment:**
- **Security Risk:** HIGH (venue policies, ticket creation policy)
- **Data Integrity Risk:** MEDIUM (missing triggers, no cascade rules)
- **Performance Risk:** LOW (good index coverage overall)
- **Maintainability Risk:** MEDIUM (style violations, missing comments)

---

**Next Steps:**
1. Review this audit report
2. Address all Critical issues (items 1-13)
3. Re-run analysis
4. Generate clean migration
5. Deploy to staging for testing
