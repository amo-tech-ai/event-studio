# Task 18: Week 3 - Analytics Page
**Phase:** Week 3
**Priority:** 🔴 HIGH
**Time:** 8 hours
**Status:** 🔴 NOT STARTED
**Dependencies:** Tasks 07-15 (Real-time data)

---

## 🎯 Objective

Create comprehensive Analytics page with charts, metrics, and insights.

---

## ✅ Success Criteria

- [ ] Analytics page created
- [ ] Event performance metrics
- [ ] Revenue analytics
- [ ] Ticket sales trends
- [ ] Attendee demographics
- [ ] Interactive charts
- [ ] Export reports

---

## 📋 Implementation

### 1. Create Analytics Hooks (3 hours)

```typescript
// src/features/analytics/hooks/useAnalytics.ts
export function useEventAnalytics(dateRange: { start: Date; end: Date }) {
  return useQuery({
    queryKey: ['analytics', 'events', dateRange],
    queryFn: async () => {
      // Events by type
      const { data: eventsByType } = await supabase
        .from('events')
        .select('event_type')
        .gte('created_at', dateRange.start.toISOString())
        .lte('created_at', dateRange.end.toISOString());

      // Ticket sales over time
      const { data: ticketSales } = await supabase
        .from('tickets')
        .select('created_at, price')
        .gte('created_at', dateRange.start.toISOString())
        .lte('created_at', dateRange.end.toISOString());

      // Revenue by event
      const { data: revenueByEvent } = await supabase
        .from('orders')
        .select('event_id, total, events(name)')
        .eq('status', 'paid')
        .gte('created_at', dateRange.start.toISOString())
        .lte('created_at', dateRange.end.toISOString());

      return {
        eventsByType: groupBy(eventsByType, 'event_type'),
        ticketSales,
        revenueByEvent,
      };
    },
  });
}
```

---

### 2. Create Analytics Page (4 hours)

```typescript
// src/pages/DashboardAnalytics.tsx
export function DashboardAnalytics() {
  const [dateRange, setDateRange] = useState({
    start: subMonths(new Date(), 3),
    end: new Date(),
  });

  const { data: analytics, isLoading } = useEventAnalytics(dateRange);

  if (isLoading) return <LoadingSkeleton type="chart" count={4} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total Events" value={analytics.totalEvents} />
        <StatCard label="Total Revenue" value={`$${analytics.revenue}`} />
        <StatCard label="Tickets Sold" value={analytics.ticketsSold} />
        <StatCard label="Avg. Attendance" value={analytics.avgAttendance} />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <ChartWrapper title="Events by Type">
          <PieChart data={analytics.eventsByType} />
        </ChartWrapper>

        <ChartWrapper title="Ticket Sales Trend">
          <LineChart data={analytics.ticketSales} />
        </ChartWrapper>

        <ChartWrapper title="Revenue by Event">
          <BarChart data={analytics.revenueByEvent} />
        </ChartWrapper>

        <ChartWrapper title="Attendee Growth">
          <AreaChart data={analytics.attendeeGrowth} />
        </ChartWrapper>
      </div>
    </div>
  );
}
```

---

### 3. Add Export Functionality (1 hour)

```typescript
function ExportButton({ data }: { data: any }) {
  const exportToCSV = () => {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString()}.csv`;
    a.click();
  };

  return <Button onClick={exportToCSV}>Export CSV</Button>;
}
```

---

## ✅ Testing

- [ ] Analytics page loads
- [ ] Charts display data
- [ ] Date range filter works
- [ ] Export CSV works
- [ ] Real-time updates

---

## 🎯 Next: Task 19 - Organizers Page

**Time Spent:** _____ hours
**Completed:** ___________________
