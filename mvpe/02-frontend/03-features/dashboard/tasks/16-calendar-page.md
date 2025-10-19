# Task 16: Week 3 - Calendar Page
**Phase:** Week 3 (Missing Pages)
**Priority:** 🔴 HIGH
**Time:** 8 hours
**Status:** 🔴 NOT STARTED (Page doesn't exist)
**Dependencies:** Tasks 01-06 (Phase 0)

---

## 🎯 Objective

Create Calendar page to display events in month/week/day views with scheduling functionality.

---

## ✅ Success Criteria

- [ ] Calendar page created
- [ ] Month/week/day views working
- [ ] Events display on calendar
- [ ] Click event opens details
- [ ] Drag-and-drop rescheduling
- [ ] Add event from calendar
- [ ] Real-time event updates

---

## 📋 Implementation

### 1. Install Calendar Library (15 min)

```bash
npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction
```

---

### 2. Create Calendar Hook (2 hours)

```typescript
// src/features/calendar/hooks/useCalendarEvents.ts
export function useCalendarEvents() {
  return useQuery({
    queryKey: ['calendar', 'events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('id, name, start_at, end_at, event_type, status')
        .gte('start_at', startOfMonth(new Date()).toISOString())
        .lte('end_at', endOfMonth(new Date()).toISOString());

      if (error) throw error;

      return data.map(event => ({
        id: event.id,
        title: event.name,
        start: event.start_at,
        end: event.end_at,
        backgroundColor: getEventColor(event.event_type),
        borderColor: getEventColor(event.event_type),
      }));
    },
  });
}
```

---

### 3. Create Calendar Page (4 hours)

```typescript
// src/pages/DashboardCalendar.tsx
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useCalendarEvents } from '@/features/calendar';

export function DashboardCalendar() {
  const { data: events, isLoading } = useCalendarEvents();
  const { updateEvent } = useEventMutations();

  const handleEventDrop = (info: any) => {
    updateEvent.mutate({
      id: info.event.id,
      updates: {
        start_at: info.event.start.toISOString(),
        end_at: info.event.end.toISOString(),
      },
    });
  };

  const handleDateClick = (info: any) => {
    // Open create event dialog with selected date
    setCreateDialog(true);
    setSelectedDate(info.date);
  };

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <Button onClick={() => setCreateDialog(true)}>
          Add Event
        </Button>
      </div>

      <Card className="p-6">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          events={events}
          editable={true}
          droppable={true}
          eventDrop={handleEventDrop}
          dateClick={handleDateClick}
          eventClick={(info) => navigate(`/dashboard/events/${info.event.id}`)}
          height="auto"
        />
      </Card>
    </div>
  );
}
```

---

### 4. Add Real-time Updates (1 hour)

```typescript
// Subscribe to event changes
useRealtimeSubscription('events', ['calendar', 'events']);
```

---

### 5. Style Calendar (30 min)

```css
/* src/styles/calendar.css */
.fc {
  --fc-border-color: hsl(var(--border));
  --fc-button-bg-color: hsl(var(--primary));
  --fc-button-border-color: hsl(var(--primary));
  --fc-button-hover-bg-color: hsl(var(--primary) / 0.9);
  --fc-today-bg-color: hsl(var(--accent));
}

.fc-event {
  cursor: pointer;
}
```

---

### 6. Add Route (15 min)

```typescript
// src/App.tsx
<Route path="/dashboard/calendar" element={
  <Suspense fallback={<LoadingSkeleton />}>
    <DashboardCalendar />
  </Suspense>
} />
```

---

## ✅ Testing

- [ ] Calendar displays current month
- [ ] Events appear on correct dates
- [ ] Month/week/day views work
- [ ] Drag event updates database
- [ ] Click date opens create dialog
- [ ] Click event opens details
- [ ] Real-time updates work

---

## 🎯 Next: Task 17 - Settings Page

**Time Spent:** _____ hours
**Completed:** ___________________
