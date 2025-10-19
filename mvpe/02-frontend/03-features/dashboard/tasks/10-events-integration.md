# Task 10: Events Page Integration
**Priority:** 🔴 CRITICAL
**Time:** 6 hours
**Status:** 🔴 NOT STARTED
**Dependencies:** Task 09

---

## 🎯 Objective

Replace mock data in DashboardEvents.tsx with real database queries.

---

## ✅ Success Criteria

- [ ] useEvents hook integrated
- [ ] Mock data removed
- [ ] Real events display
- [ ] Loading/error states
- [ ] Filter functionality
- [ ] Search functionality

---

## 📋 Implementation

### Replace Mock Data (2 hours)

**Before:**
```typescript
const events = [
  { id: 1, title: "Symphony Under the Stars", ... }
];
```

**After:**
```typescript
import { useEvents } from '@/features/events';
import { LoadingSkeleton, ErrorMessage, EmptyState } from '@/components/dashboard';

function DashboardEvents() {
  const { data: events, isLoading, error } = useEvents();

  if (isLoading) return <LoadingSkeleton type="card" count={6} />;
  if (error) return <ErrorMessage error={error} />;
  if (!events?.length) return <EmptyState title="No events found" />;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {events.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
```

---

### Add Filters (2 hours)

```typescript
const [statusFilter, setStatusFilter] = useState('all');
const [typeFilter, setTypeFilter] = useState('all');

const filtered Events = events?.filter(event => {
  if (statusFilter !== 'all' && event.status !== statusFilter) return false;
  if (typeFilter !== 'all' && event.event_type !== typeFilter) return false;
  return true;
});
```

---

### Add Search (1 hour)

```typescript
const [search, setSearch] = useState('');

const searchedEvents = filteredEvents?.filter(event =>
  event.name.toLowerCase().includes(search.toLowerCase())
);
```

---

## ✅ Testing

- [ ] Events display from database (5 events)
- [ ] Filters work
- [ ] Search works
- [ ] Loading skeleton shows
- [ ] Empty state when no results

---

## 🎯 Next: Task 11 - Event Details

**Time Spent:** _____ hours
**Completed:** ___________________
