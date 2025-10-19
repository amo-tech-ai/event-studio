# Task 08: Dashboard Page Integration
**Priority:** 🔴 CRITICAL
**Estimated Time:** 5 hours
**Status:** 🔴 NOT STARTED
**Dependencies:** Task 07 (Dashboard Hooks)

---

## 🎯 Objective

Replace all mock data in Dashboard.tsx with real database queries using the hooks created in Task 07.

---

## ✅ Success Criteria

- [ ] Dashboard.tsx uses real hooks
- [ ] All mock data removed
- [ ] Real stats display correctly
- [ ] Recent activity shows real data
- [ ] Revenue chart uses real data
- [ ] Loading states implemented
- [ ] Error handling implemented
- [ ] No hardcoded values

---

## 📋 Implementation Steps

### 1. Import Dashboard Hooks (5 min)

```typescript
// src/pages/Dashboard.tsx
import { useDashboardStats, useRecentActivity, useRevenueData } from '@/features/dashboard';
import { LoadingSkeleton, ErrorMessage, StatCard } from '@/components/dashboard';
import { Calendar, Users, Ticket, DollarSign } from 'lucide-react';
```

- [ ] Hooks imported
- [ ] Shared components imported
- [ ] Icons imported

---

### 2. Replace Mock Stats with Real Data (1 hour)

**Before (lines 16-21):**
```typescript
const stats = [
  { label: "Upcoming Events", value: "345", icon: "📅", color: "bg-pink-500" },
  { label: "Total Bookings", value: "1,798", icon: "📊", color: "bg-purple-500" },
  { label: "Tickets Sold", value: "1,250", icon: "🎫", color: "bg-pink-400" }
];
```

**After:**
```typescript
function Dashboard() {
  // Fetch real data
  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats();
  const { data: activity, isLoading: activityLoading, error: activityError } = useRecentActivity(5);
  const { data: revenue, isLoading: revenueLoading, error: revenueError } = useRevenueData(6);

  // Loading state
  if (statsLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="stat" count={4} />
        <LoadingSkeleton type="chart" />
        <LoadingSkeleton type="table" count={5} />
      </div>
    );
  }

  // Error state
  if (statsError) {
    return <ErrorMessage error={statsError} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          label="Upcoming Events"
          value={stats?.upcomingEvents || 0}
          icon={Calendar}
          color="bg-gradient-to-r from-pink-500 to-purple-500"
          trend={stats?.revenueChange}
        />
        <StatCard
          label="Total Bookings"
          value={stats?.totalBookings || 0}
          icon={Users}
          color="bg-gradient-to-r from-purple-500 to-pink-500"
        />
        <StatCard
          label="Tickets Sold"
          value={stats?.ticketsSold || 0}
          icon={Ticket}
          color="bg-gradient-to-r from-pink-400 to-purple-400"
        />
        <StatCard
          label="Total Revenue"
          value={`$${stats?.totalRevenue?.toLocaleString() || 0}`}
          icon={DollarSign}
          color="bg-gradient-to-r from-purple-600 to-pink-600"
          trend={stats?.revenueChange}
        />
      </div>

      {/* Rest of dashboard... */}
    </div>
  );
}
```

- [ ] Hooks called in component
- [ ] Loading state added
- [ ] Error state added
- [ ] StatCard components used
- [ ] Real values displayed
- [ ] Trend indicators shown
- [ ] Revenue formatted with $
- [ ] No hardcoded numbers

---

### 3. Replace Mock Activity with Real Data (1 hour)

**Before (lines 23-42):**
```typescript
const recentActivity = [
  {
    user: "Admin Stefanus Weber",
    action: "reviewed a refund request for Invoice ID:",
    detail: "INV1004",
    time: "05:30 PM"
  },
  // ... hardcoded activities
];
```

**After:**
```typescript
{/* Recent Activity Section */}
<Card className="p-6">
  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>

  {activityLoading ? (
    <LoadingSkeleton type="table" count={5} />
  ) : activityError ? (
    <ErrorMessage error={activityError} title="Failed to load activity" />
  ) : !activity || activity.length === 0 ? (
    <EmptyState
      icon={Users}
      title="No recent activity"
      description="Activity will appear here as users interact with the platform"
    />
  ) : (
    <div className="space-y-3">
      {activity.map((item) => (
        <div key={item.id} className="flex justify-between items-start py-3 border-b last:border-0">
          <div className="flex-1">
            <p className="text-sm font-medium">{item.user}</p>
            <p className="text-xs text-muted-foreground">
              {item.action} <span className="font-medium">{item.detail}</span>
            </p>
          </div>
          <span className="text-xs text-muted-foreground">{item.time}</span>
        </div>
      ))}
    </div>
  )}
</Card>
```

- [ ] Activity hook data used
- [ ] Loading skeleton shown
- [ ] Error message shown
- [ ] Empty state handled
- [ ] Activity items mapped
- [ ] Time displayed correctly
- [ ] No hardcoded activity

---

### 4. Replace Mock Revenue Chart with Real Data (1.5 hours)

**Before (lines 44-70):**
```typescript
const chartData = [
  { month: "Jan", revenue: 4200 },
  { month: "Feb", revenue: 3800 },
  // ... hardcoded data
];
```

**After:**
```typescript
{/* Revenue Chart Section */}
<ChartWrapper
  title="Revenue Overview (Last 6 Months)"
  isLoading={revenueLoading}
  error={revenueError}
  isEmpty={!revenue || revenue.length === 0}
  onRetry={() => window.location.reload()}
>
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={revenue}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="month"
        stroke="#888888"
        fontSize={12}
        tickLine={false}
        axisLine={false}
      />
      <YAxis
        stroke="#888888"
        fontSize={12}
        tickLine={false}
        axisLine={false}
        tickFormatter={(value) => `$${value}`}
      />
      <Tooltip
        content={({ active, payload }) => {
          if (active && payload && payload.length) {
            return (
              <div className="rounded-lg border bg-background p-2 shadow-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                      Revenue
                    </span>
                    <span className="font-bold text-muted-foreground">
                      ${payload[0].value?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          }
          return null;
        }}
      />
      <Line
        type="monotone"
        dataKey="revenue"
        stroke="hsl(var(--primary))"
        strokeWidth={2}
        dot={{ fill: "hsl(var(--primary))" }}
      />
    </LineChart>
  </ResponsiveContainer>
</ChartWrapper>
```

- [ ] ChartWrapper component used
- [ ] Real revenue data used
- [ ] Loading state handled
- [ ] Error state handled
- [ ] Empty state handled
- [ ] Chart configured
- [ ] Tooltip customized
- [ ] Currency formatting ($)
- [ ] No hardcoded data

---

### 5. Clean Up All Mock Data (30 min)

**Remove these sections:**
1. Hardcoded stats array (lines 16-21)
2. Hardcoded activity array (lines 23-42)
3. Hardcoded chart data (lines 44-70)

**Verify removed:**
- [ ] No stats array
- [ ] No recentActivity array
- [ ] No chartData array
- [ ] All data comes from hooks

---

### 6. Add Refresh Functionality (30 min)

```typescript
import { useQueryClient } from '@tanstack/react-query';

function Dashboard() {
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Rest of dashboard... */}
    </div>
  );
}
```

- [ ] Refresh button added
- [ ] Query invalidation working
- [ ] Data reloads on click

---

## ✅ Testing Checklist

### 1. Visual Verification (15 min)

```bash
npm run dev
# Navigate to /dashboard
```

**Check:**
- [ ] Stats show real numbers (not 345, 1,798)
- [ ] Events count matches database (should be 5)
- [ ] Bookings count correct (should be 3)
- [ ] Revenue shows real total ($926)
- [ ] Activity shows real orders
- [ ] Chart displays 6 months
- [ ] Revenue chart has real data points

---

### 2. Loading States (10 min)

Test loading skeletons:
```typescript
// Temporarily slow down queries
queryFn: async () => {
  await new Promise(resolve => setTimeout(resolve, 3000));
  // ... query
}
```

**Check:**
- [ ] Stats skeleton shows on load
- [ ] Chart skeleton shows on load
- [ ] Activity skeleton shows on load
- [ ] Transitions smoothly to data

---

### 3. Error States (10 min)

Test error handling:
```typescript
// Temporarily break query
.from('events_invalid_table')
```

**Check:**
- [ ] Error message displays
- [ ] Retry button shows
- [ ] Error doesn't crash page

---

### 4. Empty States (10 min)

Test with empty database:
```sql
-- Temporarily clear data
DELETE FROM events;
DELETE FROM orders;
```

**Check:**
- [ ] Shows 0 for stats
- [ ] Empty state for activity
- [ ] Chart shows all months with $0
- [ ] No errors

---

### 5. Real-Time Updates (10 min)

Test auto-refresh:
```sql
-- Add new order in database
INSERT INTO orders (status, total, created_at) VALUES ('paid', 100, NOW());
```

**Wait 5 minutes**

**Check:**
- [ ] Stats update automatically
- [ ] Activity shows new order
- [ ] Revenue chart updates
- [ ] No page reload needed

---

### 6. Compare Before/After (10 min)

| Metric | Before (Mock) | After (Real) | Status |
|--------|---------------|--------------|--------|
| Events | 345 | 5 | ✅ / ❌ |
| Bookings | 1,798 | 3 | ✅ / ❌ |
| Tickets | 1,250 | 3 | ✅ / ❌ |
| Revenue | $348,805 | $926 | ✅ / ❌ |
| Activity | Fake names | Real users | ✅ / ❌ |
| Chart | Fake data | Real months | ✅ / ❌ |

**All should show real data ✅**

---

## 🚩 Common Issues

### Issue: Stats Show 0

Check database has data:
```sql
SELECT COUNT(*) FROM events WHERE status = 'published';
SELECT COUNT(*) FROM orders WHERE status != 'cancelled';
```

### Issue: Activity Empty

Check orders have profile data:
```sql
SELECT o.id, o.created_at, p.full_name
FROM orders o
LEFT JOIN profiles p ON o.user_id = p.id
LIMIT 5;
```

### Issue: Chart Not Rendering

Install recharts:
```bash
npm install recharts
```

---

## 🎯 Next Task

After completing this task:
- [ ] Dashboard shows 100% real data
- [ ] All mock data removed
- [ ] Loading/error states working
- [ ] Auto-refresh configured
- [ ] Proceed to **Task 09: Week 1 - Events Module Hooks**

---

## 📝 Notes

**Integration Status:**
- Stats integrated: ✅ / ❌
- Activity integrated: ✅ / ❌
- Revenue integrated: ✅ / ❌
- Mock data removed: ✅ / ❌

**Real Values Confirmed:**
- Events: _____ (expected: 5)
- Bookings: _____ (expected: 3)
- Revenue: $_____ (expected: $926)

**Issues Found:**
-

**Time Spent:** _____ hours

**Completed By:** ___________________
**Date:** ___________________
