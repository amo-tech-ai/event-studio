# Task 15: Week 2 - Performance Optimization
**Phase:** Week 2 (Real-time & Polish)
**Priority:** 🟡 HIGH
**Time:** 4 hours
**Status:** 🔴 NOT STARTED
**Dependencies:** Task 14 (Real-time Complete)

---

## 🎯 Objective

Optimize dashboard performance, reduce load times, and improve user experience.

---

## ✅ Success Criteria

- [ ] Page load time < 2 seconds
- [ ] Query response < 1 second
- [ ] Lighthouse score > 90
- [ ] Bundle size optimized
- [ ] Images optimized
- [ ] Code splitting implemented
- [ ] Caching configured

---

## 📋 Implementation

### 1. Implement Query Optimizations (1 hour)

```typescript
// Optimize useEvents hook
export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('id, name, slug, status, start_at, end_at, event_type, capacity') // Select only needed fields
        .eq('status', 'published')
        .order('start_at', { ascending: true })
        .limit(50); // Add pagination limit

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000, // Cache for 10 minutes
    refetchOnWindowFocus: false, // Don't refetch on every focus
  });
}
```

**Optimizations:**
- [ ] Select only needed columns
- [ ] Add pagination limits
- [ ] Increase stale time
- [ ] Disable unnecessary refetches
- [ ] Add result caching

---

### 2. Implement Code Splitting (1 hour)

```typescript
// src/App.tsx - Lazy load pages
import { lazy, Suspense } from 'react';
import { LoadingSkeleton } from '@/components/dashboard';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const DashboardEvents = lazy(() => import('./pages/DashboardEvents'));
const DashboardBookings = lazy(() => import('./pages/DashboardBookings'));
const DashboardFinancials = lazy(() => import('./pages/DashboardFinancials'));
const DashboardGallery = lazy(() => import('./pages/DashboardGallery'));

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={
          <Suspense fallback={<LoadingSkeleton type="card" count={3} />}>
            <Dashboard />
          </Suspense>
        } />
        <Route path="/dashboard/events" element={
          <Suspense fallback={<LoadingSkeleton />}>
            <DashboardEvents />
          </Suspense>
        } />
        {/* ... other routes */}
      </Routes>
    </BrowserRouter>
  );
}
```

- [ ] Lazy load all pages
- [ ] Add Suspense boundaries
- [ ] Loading fallbacks configured
- [ ] Bundle sizes reduced

---

### 3. Optimize Images (30 min)

```typescript
// Add image optimization
export function OptimizedImage({ src, alt, ...props }: ImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      {...props}
    />
  );
}

// Use in Gallery
<OptimizedImage
  src={image.image_url}
  alt={image.file_name}
  className="w-full h-48 object-cover"
/>
```

- [ ] Lazy loading enabled
- [ ] Async decoding
- [ ] Proper sizing attributes
- [ ] WebP format if possible

---

### 4. Add Request Deduplication (30 min)

```typescript
// Prevent duplicate queries
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      // Use Promise.all for parallel queries
      const [events, orders, tickets] = await Promise.all([
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('tickets').select('*', { count: 'exact', head: true }),
      ]);

      return {
        upcomingEvents: events.count || 0,
        totalBookings: orders.count || 0,
        ticketsSold: tickets.count || 0,
      };
    },
    staleTime: 5 * 60 * 1000,
    // Prevent duplicate requests
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}
```

- [ ] Parallel queries with Promise.all
- [ ] Request deduplication
- [ ] Reduced refetch frequency

---

### 5. Implement Virtual Scrolling (1 hour)

```bash
npm install @tanstack/react-virtual
```

```typescript
// For large lists (bookings, events)
import { useVirtualizer } from '@tanstack/react-virtual';

export function VirtualizedEventList({ events }: { events: Event[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: events.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200, // Estimated row height
    overscan: 5, // Render 5 extra items
  });

  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <EventCard event={events[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] Virtual scrolling for events
- [ ] Virtual scrolling for bookings
- [ ] Improved scroll performance
- [ ] Reduced DOM nodes

---

### 6. Run Performance Audit (30 min)

```bash
# Build production bundle
npm run build

# Analyze bundle size
npm run build -- --analyze

# Run Lighthouse
npx lighthouse http://localhost:4173/dashboard --view
```

**Target Metrics:**
- [ ] Performance score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Total Blocking Time < 300ms
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1

---

### 7. Optimize Bundle Size (30 min)

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          query: ['@tanstack/react-query'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          supabase: ['@supabase/supabase-js'],
          charts: ['recharts'],
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
});
```

- [ ] Manual chunk splitting
- [ ] Vendor chunk separated
- [ ] UI library chunked
- [ ] Chart library lazy loaded

---

## ✅ Performance Testing

### Load Time Test
```bash
# Measure page load times
for page in dashboard events bookings financials gallery; do
  echo "Testing $page..."
  curl -w "@curl-format.txt" -o /dev/null -s "http://localhost:5173/dashboard/$page"
done
```

**Targets:**
- [ ] Dashboard: < 2s
- [ ] Events: < 1.5s
- [ ] Bookings: < 2s
- [ ] Financials: < 2s
- [ ] Gallery: < 2.5s

---

### Query Performance Test
```typescript
// Measure query times
const start = performance.now();
const { data } = await supabase.from('events').select('*');
const end = performance.now();
console.log(`Query time: ${end - start}ms`);
```

**Targets:**
- [ ] Events query: < 500ms
- [ ] Orders query: < 500ms
- [ ] Stats query: < 800ms
- [ ] Revenue query: < 1000ms

---

### Memory Leak Test
```bash
# Run app for 10 minutes
# Monitor Chrome DevTools Memory tab
# Check for memory growth

# Take heap snapshots:
# - Initial load
# - After 5 minutes
# - After 10 minutes

# Compare snapshots for leaks
```

- [ ] No significant memory growth
- [ ] Subscriptions clean up properly
- [ ] Event listeners removed

---

## 📊 Before/After Metrics

| Metric | Before | After | Target | Status |
|--------|--------|-------|--------|--------|
| Page Load | ___s | ___s | < 2s | ✅ / ❌ |
| Bundle Size | ___KB | ___KB | < 500KB | ✅ / ❌ |
| Query Time | ___ms | ___ms | < 500ms | ✅ / ❌ |
| Lighthouse | ___ | ___ | > 90 | ✅ / ❌ |
| FCP | ___s | ___s | < 1.5s | ✅ / ❌ |
| TTI | ___s | ___s | < 3s | ✅ / ❌ |

---

## 🎉 Week 2 Complete!

**What You've Built:**
- ✅ Real-time subscriptions on all pages
- ✅ Live updates without page refresh
- ✅ Connection status monitoring
- ✅ Optimized queries and caching
- ✅ Code splitting implemented
- ✅ Virtual scrolling for large lists
- ✅ Performance targets met

**Metrics:**
- Real-time latency: < 2s
- Page load: < 2s
- Query response: < 1s
- Lighthouse score: > 90

**Ready For:**
- Week 3: Build 5 missing pages
- Week 3: Complete dashboard (11/11 pages)

---

## 🎯 Next: Task 16 - Calendar Page

**Time Spent:** _____ hours
**Completed:** ___________________
