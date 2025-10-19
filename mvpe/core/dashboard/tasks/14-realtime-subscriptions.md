# Task 14: Week 2 - Real-time Subscriptions
**Phase:** Week 2 (Real-time & Polish)
**Priority:** 🔴 HIGH
**Time:** 12 hours
**Status:** 🔴 NOT STARTED
**Dependencies:** Tasks 07-13 (Week 1 Complete)

---

## 🎯 Objective

Add Supabase real-time subscriptions to enable live updates across all dashboard pages without page refreshes.

---

## ✅ Success Criteria

- [ ] Real-time subscriptions implemented
- [ ] Events update live
- [ ] Orders update live
- [ ] Dashboard stats update live
- [ ] Connection status indicator
- [ ] Optimistic updates working
- [ ] No performance degradation

---

## 📋 Implementation

### 1. Create Real-time Hook Utility (2 hours)

```typescript
// src/hooks/useRealtimeSubscription.ts
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

export function useRealtimeSubscription(
  table: string,
  queryKey: string[],
  filter?: { column: string; value: string }
) {
  const queryClient = useQueryClient();

  useEffect(() => {
    let channel: RealtimeChannel;

    const setupSubscription = async () => {
      channel = supabase
        .channel(`${table}-changes`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: table,
            filter: filter ? `${filter.column}=eq.${filter.value}` : undefined,
          },
          (payload) => {
            console.log(`Real-time update:`, payload);

            // Invalidate affected queries
            queryClient.invalidateQueries({ queryKey });

            // Handle different event types
            if (payload.eventType === 'INSERT') {
              // Optionally show toast notification
              console.log('New record inserted:', payload.new);
            } else if (payload.eventType === 'UPDATE') {
              console.log('Record updated:', payload.new);
            } else if (payload.eventType === 'DELETE') {
              console.log('Record deleted:', payload.old);
            }
          }
        )
        .subscribe();
    };

    setupSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [table, queryKey, filter, queryClient]);
}
```

---

### 2. Add Real-time to Dashboard (2 hours)

```typescript
// src/pages/Dashboard.tsx
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';

export function Dashboard() {
  const { data: stats } = useDashboardStats();

  // Subscribe to events changes
  useRealtimeSubscription('events', ['dashboard', 'stats']);

  // Subscribe to orders changes
  useRealtimeSubscription('orders', ['dashboard', 'stats']);

  // Subscribe to tickets changes
  useRealtimeSubscription('tickets', ['dashboard', 'stats']);

  // ... rest of component
}
```

- [ ] Dashboard subscribed to events
- [ ] Dashboard subscribed to orders
- [ ] Dashboard subscribed to tickets
- [ ] Stats update automatically

---

### 3. Add Real-time to Events Page (2 hours)

```typescript
// src/pages/DashboardEvents.tsx
export function DashboardEvents() {
  const { data: events } = useEvents();

  // Subscribe to events table changes
  useRealtimeSubscription('events', ['events']);

  // Subscribe to specific event updates if viewing details
  const { id } = useParams();
  if (id) {
    useRealtimeSubscription('events', ['events', id], {
      column: 'id',
      value: id
    });
  }

  // ... rest of component
}
```

- [ ] Events list updates live
- [ ] New events appear automatically
- [ ] Event updates reflect immediately
- [ ] Deleted events removed automatically

---

### 4. Add Real-time to Bookings (2 hours)

```typescript
// src/pages/DashboardBookings.tsx
export function DashboardBookings() {
  const { data: orders } = useOrders();

  // Subscribe to orders changes
  useRealtimeSubscription('orders', ['orders']);

  // ... rest of component
}
```

- [ ] New orders appear live
- [ ] Order status updates live
- [ ] Payment confirmations instant

---

### 5. Add Real-time to Financials (2 hours)

```typescript
// src/pages/DashboardFinancials.tsx
export function DashboardFinancials() {
  const { data: analytics } = useRevenueAnalytics();

  // Subscribe to orders for revenue updates
  useRealtimeSubscription('orders', ['financials', 'revenue']);

  // ... rest of component
}
```

- [ ] Revenue updates in real-time
- [ ] Charts update automatically
- [ ] New transactions appear instantly

---

### 6. Add Connection Status Indicator (1 hour)

```typescript
// src/components/ConnectionStatus.tsx
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function ConnectionStatus() {
  const [status, setStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');

  useEffect(() => {
    const channel = supabase.channel('connection-check');

    channel
      .on('system', { event: 'presence' }, () => {
        setStatus('connected');
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setStatus('connected');
        } else if (status === 'CLOSED') {
          setStatus('disconnected');
        } else {
          setStatus('connecting');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (status === 'connected') return null;

  return (
    <div className="fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg bg-background border">
      {status === 'connecting' && (
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
          <span className="text-sm">Connecting...</span>
        </div>
      )}
      {status === 'disconnected' && (
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-red-500" />
          <span className="text-sm">Disconnected</span>
        </div>
      )}
    </div>
  );
}
```

- [ ] Connection status visible
- [ ] Shows connecting state
- [ ] Shows disconnected state
- [ ] Auto-hides when connected

---

### 7. Add to App Layout (1 hour)

```typescript
// src/App.tsx or src/layouts/DashboardLayout.tsx
import { ConnectionStatus } from '@/components/ConnectionStatus';

export function App() {
  return (
    <>
      {/* ... app content */}
      <ConnectionStatus />
    </>
  );
}
```

- [ ] Status indicator in layout
- [ ] Visible on all pages
- [ ] Non-intrusive placement

---

## ✅ Testing

### Test Real-time Updates (30 min per test)

#### Test Events Real-time
```bash
# Terminal 1: Run app
npm run dev

# Terminal 2: Insert new event
psql "$DATABASE_URL" << EOF
INSERT INTO events (name, slug, event_type, status, start_at, end_at, capacity)
VALUES ('Live Event Test', 'live-test', 'conference', 'published', NOW(), NOW() + INTERVAL '2 hours', 100);
EOF
```

**Expected:** New event appears in events list without refresh

- [ ] New event appears < 2 seconds
- [ ] Event list updates automatically
- [ ] Dashboard stats update
- [ ] No page reload needed

---

#### Test Orders Real-time
```sql
-- Insert new order
INSERT INTO orders (status, total, created_at)
VALUES ('paid', 150, NOW());
```

**Expected:**
- [ ] Bookings page updates
- [ ] Financials page updates
- [ ] Dashboard stats update
- [ ] Revenue chart updates

---

#### Test Connection Resilience
```bash
# Stop Supabase
supabase stop

# Check UI shows disconnected

# Restart Supabase
supabase start

# Check UI reconnects automatically
```

- [ ] Disconnected indicator shows
- [ ] Auto-reconnect works
- [ ] Subscriptions resume
- [ ] Data syncs after reconnect

---

## 🚩 Common Issues

### Issue: Subscriptions Not Working

Check Supabase real-time enabled:
```bash
# Check realtime is enabled in Supabase settings
# Enable publications for tables:
psql "$DATABASE_URL" << EOF
ALTER PUBLICATION supabase_realtime ADD TABLE events;
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE tickets;
EOF
```

### Issue: Too Many Subscriptions

Consolidate subscriptions:
```typescript
// Bad: Multiple subscriptions per table
useRealtimeSubscription('events', ['events']);
useRealtimeSubscription('events', ['dashboard']);

// Good: One subscription, multiple invalidations
useRealtimeSubscription('events', ['events', 'dashboard']);
```

---

## 📊 Performance Monitoring

Monitor subscription performance:
- [ ] < 5 active channels per page
- [ ] < 2 second update latency
- [ ] No memory leaks
- [ ] Subscriptions clean up on unmount

---

## 🎯 Next: Task 15 - Performance Optimization

**Time Spent:** _____ hours
**Completed:** ___________________
