# 🏗️ Phase 1: Foundation Patterns

**Duration:** 16 hours (Week 1)
**When:** After setup complete
**Goal:** Master core patterns before building features

---

## 📋 Learning Checklist

### Data & State Patterns (8 hours)
- [ ] Understand React Query basics
- [ ] Know when to use Zustand vs React Query
- [ ] Can create custom data hooks
- [ ] Understand cache strategies
- [ ] Know real-time subscription patterns

### Component Patterns (8 hours)
- [ ] Familiar with shadcn/ui components
- [ ] Understand component composition
- [ ] Know styling conventions
- [ ] Can build accessible components
- [ ] Understand form patterns

---

## 📁 Files in This Phase

### 01-data-state-management.md (8 hours)
**Purpose:** Master data fetching and state management

**Key Topics:**
- React Query (TanStack Query) patterns
- Zustand for client state
- Cache strategies
- Real-time subscriptions
- Error handling

**Code Examples:**
```typescript
// Query pattern
const { data, isLoading } = useQuery({
  queryKey: ['events'],
  queryFn: fetchEvents
});

// Mutation pattern
const mutation = useMutation({
  mutationFn: createEvent,
  onSuccess: () => queryClient.invalidateQueries(['events'])
});

// Zustand store
const useStore = create((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({
    sidebarOpen: !state.sidebarOpen
  }))
}));
```

**Practice Task:**
Build a simple hook that fetches and displays events with loading/error states.

---

### 02-component-patterns.md (8 hours)
**Purpose:** Master component patterns and shadcn/ui

**Key Topics:**
- shadcn/ui component library
- Component composition
- Tailwind styling conventions
- Accessibility patterns
- Form validation with Zod

**Code Examples:**
```typescript
// Button component usage
import { Button } from "@/components/ui/button";

<Button variant="default" size="lg" onClick={handleClick}>
  Click Me
</Button>

// Form with validation
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const form = useForm({
  resolver: zodResolver(eventSchema),
  defaultValues: { name: "", date: "" }
});
```

**Practice Task:**
Build a simple form with Button, Input, and validation.

---

## 🎓 Learning Path

### Day 1: Data Fetching (4 hours)
```
Morning (2h):
1. Read data-state-management.md sections 1-3
2. Understand React Query basics
3. Review query examples

Afternoon (2h):
4. Create simple data hook
5. Practice with loading/error states
6. Test in browser
```

### Day 2: State Management (4 hours)
```
Morning (2h):
1. Read data-state-management.md sections 4-6
2. Understand Zustand patterns
3. Learn cache strategies

Afternoon (2h):
4. Create Zustand store
5. Practice state updates
6. Combine with React Query
```

### Day 3: Components (4 hours)
```
Morning (2h):
1. Read component-patterns.md sections 1-3
2. Explore shadcn/ui components
3. Understand composition

Afternoon (2h):
4. Build example components
5. Practice styling
6. Test accessibility
```

### Day 4: Forms & Validation (4 hours)
```
Morning (2h):
1. Read component-patterns.md sections 4-6
2. Learn form patterns
3. Understand Zod validation

Afternoon (2h):
4. Build example form
5. Add validation
6. Test error handling
```

---

## 🎯 Phase Completion Criteria

You're ready for Phase 2 when you can:

### Data Patterns ✅
- [ ] Create a `useQuery` hook that fetches data
- [ ] Handle loading and error states
- [ ] Invalidate cache after mutation
- [ ] Explain when to use Zustand vs React Query
- [ ] Understand real-time subscription setup

### Component Patterns ✅
- [ ] Use 5+ shadcn/ui components correctly
- [ ] Build custom component with proper types
- [ ] Style component with Tailwind
- [ ] Create accessible form with validation
- [ ] Understand component composition

### Practical Check ✅
Build a mini-feature:
```typescript
// Can you build this?
function EventCard() {
  const { data: events, isLoading } = useEvents();
  const mutation = useCreateEvent();

  if (isLoading) return <Skeleton />;

  return (
    <Card>
      {events.map(event => (
        <div key={event.id}>{event.name}</div>
      ))}
      <Button onClick={() => mutation.mutate(newEvent)}>
        Add Event
      </Button>
    </Card>
  );
}
```

If you can build this confidently, you're ready!

---

## 📚 Additional Resources

### Official Documentation
- React Query: https://tanstack.com/query/latest
- Zustand: https://github.com/pmndrs/zustand
- shadcn/ui: https://ui.shadcn.com
- Tailwind: https://tailwindcss.com

### Code Examples Location
- Dashboard hooks: `../03-features/dashboard/tasks/07-dashboard-hooks.md`
- Events hooks: `../03-features/dashboard/tasks/09-events-hooks.md`

---

## 🚨 Common Mistakes to Avoid

### ❌ Using useState for server data
```typescript
// Wrong
const [events, setEvents] = useState([]);
useEffect(() => {
  fetch('/api/events').then(setEvents);
}, []);
```

### ✅ Use React Query instead
```typescript
// Correct
const { data: events } = useQuery({
  queryKey: ['events'],
  queryFn: fetchEvents
});
```

### ❌ Mixing component and styling logic
```typescript
// Wrong - inline styles
<div style={{ color: 'red', padding: '10px' }}>...</div>
```

### ✅ Use Tailwind classes
```typescript
// Correct
<div className="text-red-500 p-2">...</div>
```

---

## ⏭️ Next Phase

Once foundation patterns are mastered:
→ **Go to:** `../03-features/dashboard/tasks/00-TASK-INDEX.md`
→ **Goal:** Build production dashboard with real database
→ **Time:** 4-5 weeks (140 hours)

---

**Status:** Phase 1 - Foundation Patterns
**Previous:** Phase 0 - Setup
**Next:** Phase 2 - Feature Implementation
