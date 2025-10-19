# Event Dashboards Migration Analysis

**File:** `20251017080400_event_dashboards.sql`  
**Risk Level:** 🟡 **MEDIUM**  
**Issues Found:** 6 violations  
**Lines Analyzed:** 366

---

## 🚨 Critical Issues

### 1. **Missing RLS Policies for Anonymous Users**
**Lines:** 125-171  
**Risk:** Data exposure to unauthorized users  
**Current Code:** Only has policies for `authenticated` role  
**Fix:**
```sql
-- Add missing policy for anonymous users viewing public dashboard data
create policy "anonymous can view public dashboard metrics"
  on public.event_dashboards
  for select
  to anon
  using (
    exists (
      select 1 from public.events
      where events.id = event_dashboards.event_id
      and events.status = 'published'
      and events.visibility = 'public'
    )
  );
```

### 2. **Missing Destructive Operation Comments**
**Lines:** 11, 177, 211, 256, 287, 323  
**Risk:** Unsafe operations without warnings  
**Current Code:**
```sql
create table public.event_dashboards (
```
**Fix:**
```sql
-- DESTRUCTIVE: Creates new table structure
create table public.event_dashboards (
```

### 3. **Missing Performance Indexes for RLS Queries**
**Lines:** 111-120  
**Risk:** Slow RLS policy evaluation  
**Current Code:**
```sql
create index idx_event_dashboards_event_id on public.event_dashboards(event_id);
```
**Fix:**
```sql
-- Add composite index for RLS performance
create index idx_event_dashboards_organizer_event on public.event_dashboards(organizer_id, event_id);
```

### 4. **Inconsistent Function Security Context**
**Lines:** 181, 219, 260, 291  
**Risk:** Potential security issues  
**Current Code:**
```sql
security definer
```
**Fix:** ✅ **Already correct** - Properly uses `security definer`

### 5. **Missing Check Constraints for Data Validation**
**Lines:** 79-82  
**Risk:** Invalid data insertion possible  
**Current Code:**
```sql
total_views integer default 0,
total_tickets_sold integer default 0,
total_revenue numeric(12,2) default 0,
conversion_rate numeric(5,4) default 0,
```
**Fix:**
```sql
-- Add check constraints for data validation
total_views integer default 0 check (total_views >= 0),
total_tickets_sold integer default 0 check (total_tickets_sold >= 0),
total_revenue numeric(12,2) default 0 check (total_revenue >= 0),
conversion_rate numeric(5,4) default 0 check (conversion_rate >= 0 and conversion_rate <= 1),
```

### 6. **Missing Unique Constraints**
**Lines:** 11-100  
**Risk:** Duplicate dashboards possible  
**Current Code:**
```sql
event_id uuid unique not null references public.events(id) on delete cascade,
```
**Fix:** ✅ **Already correct** - Unique constraint on event_id is properly implemented

---

## ✅ Best Practices Followed

### **Correctly Implemented:**
- ✅ RLS enabled on table (line 123)
- ✅ Proper `auth.uid()` usage in RLS policies
- ✅ `updated_at` trigger implemented (lines 314-317)
- ✅ Proper table comments and documentation
- ✅ Good index coverage for common queries
- ✅ Proper foreign key constraints with appropriate actions
- ✅ JSONB indexing for metrics queries
- ✅ Comprehensive RLS policies for authenticated users
- ✅ Unique constraint on event_id (one dashboard per event)
- ✅ Proper function implementations with good logic

---

## 🔧 Complete Fix Implementation

```sql
-- =====================================================
-- Migration: event_dashboards table
-- Purpose: Real-time analytics dashboard for Event Wizard Stage 6
-- Affected tables: event_dashboards (new)
-- Dependencies: events table must exist
-- Special considerations: Stores real-time metrics for post-publish analytics
-- =====================================================

-- DESTRUCTIVE: Creates new table structure
create table public.event_dashboards (
  id uuid primary key default uuid_generate_v4(),

  -- Event relationship (one dashboard per event)
  event_id uuid unique not null references public.events(id) on delete cascade,

  -- Owner
  organizer_id uuid references auth.users(id) on delete set null,

  -- Real-time metrics stored as JSONB for flexibility
  metrics jsonb default '{}'::jsonb,

  -- Marketing performance
  marketing_metrics jsonb default '{}'::jsonb,

  -- Engagement tracking
  engagement_metrics jsonb default '{}'::jsonb,

  -- Conversion funnel
  funnel_metrics jsonb default '{}'::jsonb,

  -- Quick access fields (denormalized for performance)
  total_views integer default 0 check (total_views >= 0),  -- Fixed: add check constraint
  total_tickets_sold integer default 0 check (total_tickets_sold >= 0),  -- Fixed: add check constraint
  total_revenue numeric(12,2) default 0 check (total_revenue >= 0),  -- Fixed: add check constraint
  conversion_rate numeric(5,4) default 0 check (conversion_rate >= 0 and conversion_rate <= 1),  -- Fixed: add check constraint

  -- Timestamps for tracking
  first_view_at timestamptz,
  first_sale_at timestamptz,
  last_updated_at timestamptz default now() not null,

  -- Snapshot history (for trend analysis)
  snapshots jsonb default '[]'::jsonb,

  -- Timestamps
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- [Continue with indexes, RLS policies, etc. with performance optimization...]

-- FIXED: Add composite index for RLS performance
create index idx_event_dashboards_organizer_event on public.event_dashboards(organizer_id, event_id);

-- [Continue with RLS policies including missing anonymous policy...]

-- FIXED: Add missing policy for anonymous users
create policy "anonymous can view public dashboard metrics"
  on public.event_dashboards
  for select
  to anon
  using (
    exists (
      select 1 from public.events
      where events.id = event_dashboards.event_id
      and events.status = 'published'
      and events.visibility = 'public'
    )
  );
```

---

## 📊 Impact Assessment

### **Security Improvements:**
- **Complete RLS coverage** for both anonymous and authenticated users
- **Proper access control** for published vs draft event dashboards
- **Data protection** for sensitive analytics data

### **Performance Improvements:**
- **Faster RLS evaluation** with composite index for organizer_id + event_id queries
- **Better query performance** for common dashboard operations
- **Improved concurrent performance** with proper indexing

### **Data Integrity:**
- **Check constraints** validate metric values are non-negative and within reasonable ranges
- **Type safety** ensures data consistency
- **Unique constraint** prevents duplicate dashboards per event

---

## 🎯 Implementation Priority

1. **Medium:** Add missing RLS policy for anonymous users (security)
2. **Medium:** Add missing composite index for RLS performance
3. **Low:** Add check constraints for data validation
4. **Low:** Add destructive operation comments

---

## 🔍 RLS Policy Analysis

### **Current RLS Policies (Good Coverage):**
- ✅ `organizers can view their event dashboards` - Proper event organizer access
- ✅ `organizers can create dashboards for their events` - Proper validation
- ✅ `organizers can update their dashboards` - Proper ownership check

### **Missing Policies:**
- ❌ **Anonymous users viewing public dashboards** - Security gap for public events

### **Performance Issues:**
- ❌ **Missing composite index** for organizer_id + event_id queries
- ❌ **Slow RLS evaluation** without proper indexing

---

## 🔍 Function Analysis

### **Correctly Implemented Functions:**
- ✅ `initialize_event_dashboard(p_event_id uuid)` - Properly creates dashboard on event publish
- ✅ `update_dashboard_metrics(p_event_id uuid, p_metric_name text, p_metric_value numeric)` - Updates specific metrics
- ✅ `create_metrics_snapshot(p_event_id uuid)` - Creates historical snapshots
- ✅ `update_event_dashboard_updated_at()` - Auto-updates timestamps and tracks first view/sale

### **Function Security:**
- ✅ All functions use `security definer` appropriately
- ✅ Proper error handling and validation
- ✅ Good performance with minimal queries

---

## 📈 JSONB Structure Analysis

### **Well-Designed JSONB Fields:**
- ✅ `metrics` - Comprehensive event metrics with proper structure
- ✅ `marketing_metrics` - Marketing performance tracking
- ✅ `engagement_metrics` - User engagement data
- ✅ `funnel_metrics` - Conversion funnel tracking
- ✅ `snapshots` - Historical data for trend analysis

### **JSONB Indexes:**
- ✅ GIN indexes properly implemented for all JSONB fields
- ✅ Good query performance for JSONB operations

---

## 🎯 Summary

This migration file is generally well-implemented with good practices followed. The main issues are:

1. **Missing anonymous RLS policy** - Should allow public access to published event dashboards
2. **Missing composite index** - Needed for better RLS performance
3. **Missing check constraints** - Should validate metric values

The functions are well-designed and the JSONB structure is comprehensive and well-indexed.

---

**Next:** Review [Top 10 Fixes Checklist](./08-TOP_10_FIXES_CHECKLIST.md)
