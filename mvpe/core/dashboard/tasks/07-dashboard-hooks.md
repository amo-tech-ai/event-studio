# Task 07: Dashboard Page Hooks
**Priority:** 🔴 CRITICAL
**Estimated Time:** 5 hours
**Status:** 🔴 NOT STARTED
**Dependencies:** Tasks 01-06 (Phase 0 Complete)

---

## 🎯 Objective

Create React Query hooks for the main Dashboard page to fetch real-time stats, recent activity, and revenue data from the database.

---

## ✅ Success Criteria

- [ ] useDashboardStats hook created
- [ ] useRecentActivity hook created
- [ ] useRevenueData hook created
- [ ] All hooks use TypeScript types
- [ ] Hooks properly configured with React Query
- [ ] Data fetches from real database
- [ ] Error handling implemented
- [ ] Loading states handled

---

## 📋 Implementation Steps

### 1. Create Dashboard Feature Module Structure (15 min)

```bash
# Create hook files
touch src/features/dashboard/hooks/useDashboardStats.ts
touch src/features/dashboard/hooks/useRecentActivity.ts
touch src/features/dashboard/hooks/useRevenueData.ts
touch src/features/dashboard/hooks/index.ts

# Create types
touch src/features/dashboard/types/index.ts
```

- [ ] Hooks directory created
- [ ] Files created
- [ ] Ready for implementation

---

### 2. Create Dashboard Types (30 min)

```typescript
// src/features/dashboard/types/index.ts
export interface DashboardStats {
  upcomingEvents: number;
  totalBookings: number;
  ticketsSold: number;
  totalRevenue: number;
  revenueChange?: {
    value: number;
    isPositive: boolean;
  };
}

export interface RecentActivityItem {
  id: string;
  user: string;
  action: string;
  detail: string;
  time: string;
  createdAt: string;
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentActivity: RecentActivityItem[];
  revenueData: RevenueDataPoint[];
}
```

- [ ] Types file created
- [ ] DashboardStats interface defined
- [ ] RecentActivityItem interface defined
- [ ] RevenueDataPoint interface defined
- [ ] All types exported

---

### 3. Create useDashboardStats Hook (1.5 hours)

```typescript
// src/features/dashboard/hooks/useDashboardStats.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { DashboardStats } from '../types';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async (): Promise<DashboardStats> => {
      // Fetch upcoming events count
      const { count: upcomingEvents, error: eventsError } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published')
        .gte('start_at', new Date().toISOString());

      if (eventsError) throw eventsError;

      // Fetch total bookings (orders)
      const { count: totalBookings, error: bookingsError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .neq('status', 'cancelled');

      if (bookingsError) throw bookingsError;

      // Fetch tickets sold
      const { count: ticketsSold, error: ticketsError } = await supabase
        .from('tickets')
        .select('*', { count: 'exact', head: true })
        .neq('status', 'cancelled');

      if (ticketsError) throw ticketsError;

      // Fetch total revenue from orders
      const { data: revenueData, error: revenueError } = await supabase
        .from('orders')
        .select('total')
        .eq('status', 'paid');

      if (revenueError) throw revenueError;

      const totalRevenue = revenueData?.reduce(
        (sum, order) => sum + (order.total || 0),
        0
      ) || 0;

      // Calculate revenue change (compare last 30 days vs previous 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

      const { data: recentRevenue } = await supabase
        .from('orders')
        .select('total')
        .eq('status', 'paid')
        .gte('created_at', thirtyDaysAgo.toISOString());

      const { data: previousRevenue } = await supabase
        .from('orders')
        .select('total')
        .eq('status', 'paid')
        .gte('created_at', sixtyDaysAgo.toISOString())
        .lt('created_at', thirtyDaysAgo.toISOString());

      const recentTotal = recentRevenue?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;
      const previousTotal = previousRevenue?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;

      const revenueChange = previousTotal > 0
        ? {
            value: Math.abs(((recentTotal - previousTotal) / previousTotal) * 100),
            isPositive: recentTotal > previousTotal
          }
        : undefined;

      return {
        upcomingEvents: upcomingEvents || 0,
        totalBookings: totalBookings || 0,
        ticketsSold: ticketsSold || 0,
        totalRevenue,
        revenueChange,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
  });
}
```

- [ ] Hook file created
- [ ] Imports added
- [ ] Query function implemented
- [ ] Events count query
- [ ] Bookings count query
- [ ] Tickets count query
- [ ] Revenue calculation
- [ ] Revenue change calculation
- [ ] Type-safe return value
- [ ] Stale time configured
- [ ] Auto-refresh configured

---

### 4. Create useRecentActivity Hook (1.5 hours)

```typescript
// src/features/dashboard/hooks/useRecentActivity.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { RecentActivityItem } from '../types';
import { formatDistanceToNow } from 'date-fns';

export function useRecentActivity(limit = 5) {
  return useQuery({
    queryKey: ['dashboard', 'activity', limit],
    queryFn: async (): Promise<RecentActivityItem[]> => {
      // Fetch recent orders with user profile data
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          status,
          created_at,
          profile:profiles(
            full_name,
            email
          ),
          event:events(
            name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (ordersError) throw ordersError;

      // Transform orders into activity items
      const activities: RecentActivityItem[] = (orders || []).map(order => ({
        id: order.id,
        user: order.profile?.full_name || order.profile?.email || 'Unknown User',
        action: `created an order for`,
        detail: order.event?.name || 'Unknown Event',
        time: formatDistanceToNow(new Date(order.created_at), { addSuffix: true }),
        createdAt: order.created_at,
      }));

      return activities;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 2 * 60 * 1000, // Auto-refresh every 2 minutes
  });
}
```

- [ ] Hook file created
- [ ] Imports added (including date-fns)
- [ ] Query function implemented
- [ ] Orders with joins query
- [ ] Activity transformation logic
- [ ] Time formatting with date-fns
- [ ] Limit parameter support
- [ ] Type-safe return value

---

### 5. Create useRevenueData Hook (1.5 hours)

```typescript
// src/features/dashboard/hooks/useRevenueData.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { RevenueDataPoint } from '../types';
import { format, subMonths, startOfMonth } from 'date-fns';

export function useRevenueData(months = 6) {
  return useQuery({
    queryKey: ['dashboard', 'revenue', months],
    queryFn: async (): Promise<RevenueDataPoint[]> => {
      // Get date range
      const endDate = new Date();
      const startDate = startOfMonth(subMonths(endDate, months - 1));

      // Fetch paid orders in date range
      const { data: orders, error } = await supabase
        .from('orders')
        .select('total, created_at')
        .eq('status', 'paid')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Group by month and sum revenue
      const revenueByMonth = new Map<string, number>();

      // Initialize all months with 0
      for (let i = 0; i < months; i++) {
        const monthDate = subMonths(endDate, months - 1 - i);
        const monthKey = format(monthDate, 'MMM yyyy');
        revenueByMonth.set(monthKey, 0);
      }

      // Sum revenue for each month
      (orders || []).forEach(order => {
        const monthKey = format(new Date(order.created_at), 'MMM yyyy');
        const currentRevenue = revenueByMonth.get(monthKey) || 0;
        revenueByMonth.set(monthKey, currentRevenue + (order.total || 0));
      });

      // Convert to array format for charts
      return Array.from(revenueByMonth.entries()).map(([month, revenue]) => ({
        month,
        revenue,
      }));
    },
    staleTime: 10 * 60 * 1000, // 10 minutes (revenue data changes less frequently)
    refetchInterval: 10 * 60 * 1000,
  });
}
```

- [ ] Hook file created
- [ ] Imports added (including date-fns)
- [ ] Query function implemented
- [ ] Date range calculation
- [ ] Orders query with date filter
- [ ] Month grouping logic
- [ ] Revenue summation
- [ ] Chart-friendly data format
- [ ] Months parameter support
- [ ] Type-safe return value

---

### 6. Create Hook Exports (10 min)

```typescript
// src/features/dashboard/hooks/index.ts
export { useDashboardStats } from './useDashboardStats';
export { useRecentActivity } from './useRecentActivity';
export { useRevenueData } from './useRevenueData';

export type { DashboardStats, RecentActivityItem, RevenueDataPoint } from '../types';
```

- [ ] Index file created
- [ ] All hooks exported
- [ ] Types exported
- [ ] Clean import path available

---

### 7. Update Dashboard Feature Index (5 min)

```typescript
// src/features/dashboard/index.ts
export * from './hooks';
export * from './types';
```

- [ ] Feature index updated
- [ ] Can import from `@/features/dashboard`

---

## ✅ Testing Checklist

### 1. Test useDashboardStats (10 min)

```tsx
// Test in a component
import { useDashboardStats } from '@/features/dashboard';

function TestComponent() {
  const { data, isLoading, error } = useDashboardStats();

  console.log('Stats:', data);
  // Should show real counts from database

  return <div>{JSON.stringify(data, null, 2)}</div>;
}
```

**Expected Output:**
```json
{
  "upcomingEvents": 5,
  "totalBookings": 3,
  "ticketsSold": 3,
  "totalRevenue": 926,
  "revenueChange": {
    "value": 12.5,
    "isPositive": true
  }
}
```

- [ ] Hook returns data
- [ ] Counts match database
- [ ] Revenue calculated correctly
- [ ] No errors

### 2. Test useRecentActivity (10 min)

```tsx
import { useRecentActivity } from '@/features/dashboard';

function TestActivity() {
  const { data, isLoading, error } = useRecentActivity(5);

  console.log('Activity:', data);

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

**Expected Output:**
```json
[
  {
    "id": "order-123",
    "user": "John Doe",
    "action": "created an order for",
    "detail": "Tech Conference 2025",
    "time": "2 hours ago",
    "createdAt": "2025-10-18T10:00:00Z"
  }
]
```

- [ ] Hook returns activities
- [ ] User names populated
- [ ] Event names joined
- [ ] Time formatted correctly
- [ ] Ordered by most recent

### 3. Test useRevenueData (10 min)

```tsx
import { useRevenueData } from '@/features/dashboard';

function TestRevenue() {
  const { data, isLoading, error } = useRevenueData(6);

  console.log('Revenue:', data);

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

**Expected Output:**
```json
[
  { "month": "May 2025", "revenue": 0 },
  { "month": "Jun 2025", "revenue": 0 },
  { "month": "Jul 2025", "revenue": 0 },
  { "month": "Aug 2025", "revenue": 450 },
  { "month": "Sep 2025", "revenue": 0 },
  { "month": "Oct 2025", "revenue": 476 }
]
```

- [ ] Hook returns 6 months
- [ ] All months present (even with 0)
- [ ] Revenue summed correctly
- [ ] Ordered chronologically

---

## 🚩 Common Issues

### Issue: date-fns Not Installed

```bash
npm install date-fns
```

### Issue: Query Returns Null

Check Supabase connection:
```bash
# Test connection
curl -H "Authorization: Bearer YOUR_ANON_KEY" \
  "YOUR_SUPABASE_URL/rest/v1/events?select=*&limit=1"
```

### Issue: Type Errors

Regenerate types:
```bash
npx supabase gen types typescript --local > src/types/database.ts
```

---

## 🎯 Next Task

After completing this task:
- [ ] All 3 dashboard hooks created
- [ ] All hooks tested and working
- [ ] Types properly defined
- [ ] No TypeScript errors
- [ ] Proceed to **Task 08: Week 1 - Dashboard Integration**

---

## 📝 Notes

**Hooks Created:**
- useDashboardStats: ✅ / ❌
- useRecentActivity: ✅ / ❌
- useRevenueData: ✅ / ❌

**Test Results:**
- Stats query works: ✅ / ❌
- Activity query works: ✅ / ❌
- Revenue query works: ✅ / ❌

**Issues Found:**
-

**Time Spent:** _____ hours

**Completed By:** ___________________
**Date:** ___________________
