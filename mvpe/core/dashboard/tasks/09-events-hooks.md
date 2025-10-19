# Task 09: Events Module Hooks Enhancement
**Priority:** 🟡 HIGH
**Estimated Time:** 6 hours
**Status:** 🟡 33% (useEvents exists, need mutations)
**Dependencies:** Tasks 01-06 (Phase 0)

---

## 🎯 Objective

Enhance existing Events hooks and add mutation hooks for create, update, delete operations.

---

## ✅ Success Criteria

- [ ] useEvents hook verified working
- [ ] useEventMutations hook created
- [ ] useEventDetails hook created
- [ ] Create event mutation
- [ ] Update event mutation
- [ ] Delete event mutation
- [ ] All mutations invalidate queries
- [ ] Optimistic updates configured

---

## 📋 Quick Status Check

**Already EXISTS (✅):**
```typescript
// src/features/events/hooks/useEvents.ts
export function useEvents() // ✅ ALREADY WORKING
export interface Event // ✅ TYPES DEFINED
```

**Need to CREATE (🔴):**
- useEventMutations.ts
- useEventDetails.ts
- Update index.ts exports

---

## 📋 Implementation Steps

### 1. Verify Existing Hook (15 min)

```bash
# Check existing hook
cat src/features/events/hooks/useEvents.ts

# Test it works
npm run dev
# Import and use in a test component
```

- [ ] useEvents.ts exists
- [ ] Returns events from database
- [ ] Types properly defined
- [ ] No changes needed

---

### 2. Create useEventDetails Hook (1 hour)

```typescript
// src/features/events/hooks/useEventDetails.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Event } from '../types';

export function useEventDetails(eventId: string) {
  return useQuery({
    queryKey: ['events', eventId],
    queryFn: async (): Promise<Event | null> => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          tickets:tickets(count),
          orders:orders(count),
          attendees:attendees(count)
        `)
        .eq('id', eventId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!eventId,
  });
}
```

- [ ] File created
- [ ] Fetches single event with counts
- [ ] Joins tickets, orders, attendees
- [ ] Enabled guard added

---

### 3. Create useEventMutations Hook (3 hours)

```typescript
// src/features/events/hooks/useEventMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Event } from '../types';
import { useToast } from '@/hooks/use-toast';

export function useEventMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createEvent = useMutation({
    mutationFn: async (newEvent: Partial<Event>) => {
      const { data, error } = await supabase
        .from('events')
        .insert(newEvent)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "Event created",
        description: `${data.name} has been created successfully.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create event",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateEvent = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Event> }) => {
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async ({ id, updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['events', id] });

      // Snapshot previous value
      const previousEvent = queryClient.getQueryData(['events', id]);

      // Optimistically update
      queryClient.setQueryData(['events', id], (old: any) => ({
        ...old,
        ...updates,
      }));

      return { previousEvent };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousEvent) {
        queryClient.setQueryData(['events', variables.id], context.previousEvent);
      }
      toast({
        title: "Failed to update event",
        description: err.message,
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "Event updated",
        description: `${data.name} has been updated.`,
      });
    },
  });

  const deleteEvent = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "Event deleted",
        description: "Event has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete event",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    createEvent,
    updateEvent,
    deleteEvent,
  };
}
```

- [ ] File created
- [ ] Create mutation implemented
- [ ] Update mutation with optimistic updates
- [ ] Delete mutation implemented
- [ ] Query invalidation on success
- [ ] Toast notifications
- [ ] Error handling

---

### 4. Update Hook Exports (15 min)

```typescript
// src/features/events/hooks/index.ts
export { useEvents } from './useEvents';
export { useEventDetails } from './useEventDetails';
export { useEventMutations } from './useEventMutations';

export type { Event } from '../types';
```

- [ ] All hooks exported
- [ ] Types exported
- [ ] Clean imports available

---

## ✅ Testing

### Test Create Event (15 min)

```tsx
import { useEventMutations } from '@/features/events';

const { createEvent } = useEventMutations();

const handleCreate = () => {
  createEvent.mutate({
    name: "Test Event",
    slug: "test-event",
    event_type: "conference",
    status: "draft",
    start_at: new Date().toISOString(),
    end_at: new Date().toISOString(),
    capacity: 100,
  });
};
```

- [ ] Event created in database
- [ ] Toast notification shows
- [ ] Events list updates

### Test Update Event (15 min)

```tsx
const { updateEvent } = useEventMutations();

updateEvent.mutate({
  id: "event-123",
  updates: { name: "Updated Name" }
});
```

- [ ] Event updated
- [ ] Optimistic update works
- [ ] List refreshes

---

## 🎯 Next Task

After completion:
- [ ] All event hooks working
- [ ] CRUD operations functional
- [ ] Proceed to **Task 10: Events Integration**

---

## 📝 Notes

**Hooks Status:**
- useEvents: ✅ (existing)
- useEventDetails: ✅ / ❌
- useEventMutations: ✅ / ❌

**Time Spent:** _____ hours

**Completed By:** ___________________
**Date:** ___________________
