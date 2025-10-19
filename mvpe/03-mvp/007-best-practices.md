# 007 - EventOS Best Practices

**Purpose:** Development standards, naming conventions, folder structure, security practices, and consistency guidelines for EventOS development.

---

## 🏗️ **Architecture Best Practices**

### **Component Architecture**
Follow a consistent, scalable component architecture pattern:

```typescript
// ✅ GOOD: Feature-based component structure
src/
├── features/
│   ├── events/
│   │   ├── components/
│   │   │   ├── EventCard/
│   │   │   │   ├── EventCard.tsx
│   │   │   │   ├── EventCard.test.tsx
│   │   │   │   └── index.ts
│   │   │   └── EventList/
│   │   ├── hooks/
│   │   │   ├── useEvents.ts
│   │   │   └── useEventForm.ts
│   │   ├── types/
│   │   │   └── event.types.ts
│   │   └── index.ts
│   └── bookings/
└── shared/
    ├── components/
    ├── hooks/
    └── utils/

// ❌ BAD: Flat component structure
src/
├── components/
│   ├── EventCard.tsx
│   ├── BookingForm.tsx
│   └── UserProfile.tsx
```

### **Data Flow Patterns**
Implement consistent data flow patterns:

```typescript
// ✅ GOOD: Centralized state management with React Query
const useEvents = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

// ✅ GOOD: Optimistic updates
const useCreateEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createEvent,
    onMutate: async (newEvent) => {
      await queryClient.cancelQueries(['events']);
      const previousEvents = queryClient.getQueryData(['events']);
      queryClient.setQueryData(['events'], (old) => [...old, newEvent]);
      return { previousEvents };
    },
    onError: (err, newEvent, context) => {
      queryClient.setQueryData(['events'], context.previousEvents);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['events']);
    },
  });
};
```

---

## 📝 **Naming Conventions**

### **File and Folder Naming**
```bash
# ✅ GOOD: kebab-case for files and folders
event-card/
event-list/
user-profile/
booking-form/

# ✅ GOOD: PascalCase for components
EventCard.tsx
EventList.tsx
UserProfile.tsx
BookingForm.tsx

# ❌ BAD: Inconsistent naming
Event_Card/
eventList/
User-Profile/
bookingForm/
```

### **Variable and Function Naming**
```typescript
// ✅ GOOD: Descriptive, consistent naming
const eventCardData = useEventCardData();
const handleEventClick = (eventId: string) => {};
const isEventPublished = event.status === 'published';
const MAX_EVENT_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// ❌ BAD: Unclear, inconsistent naming
const data = useData();
const click = (id) => {};
const published = event.status === 'published';
const max = 24 * 60 * 60 * 1000;
```

### **Database Naming**
```sql
-- ✅ GOOD: snake_case for tables and columns
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  organizer_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ✅ GOOD: Descriptive function names
CREATE OR REPLACE FUNCTION get_event_attendees(event_id UUID)
RETURNS TABLE(attendee_id UUID, attendee_name VARCHAR) AS $$
BEGIN
  RETURN QUERY
  SELECT o.user_id, u.full_name
  FROM orders o
  JOIN users u ON o.user_id = u.id
  WHERE o.event_id = get_event_attendees.event_id
    AND o.status = 'confirmed';
END;
$$ LANGUAGE plpgsql;
```

---

## 🔒 **Security Best Practices**

### **Authentication and Authorization**
```typescript
// ✅ GOOD: Secure authentication patterns
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;
  
  return <>{children}</>;
};

// ✅ GOOD: Role-based access control
export const usePermissions = () => {
  const { user } = useAuth();
  
  const canManageEvents = useMemo(() => {
    return user?.role === 'organizer' || user?.role === 'admin';
  }, [user]);
  
  const canViewAnalytics = useMemo(() => {
    return user?.role === 'organizer' || user?.role === 'admin';
  }, [user]);
  
  return { canManageEvents, canViewAnalytics };
};
```

### **Input Validation and Sanitization**
```typescript
// ✅ GOOD: Comprehensive input validation
import { z } from 'zod';

const EventSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1).max(5000),
  startDate: z.date().min(new Date()),
  endDate: z.date().min(new Date()),
  venueId: z.string().uuid(),
  eventType: z.enum(['conference', 'workshop', 'networking', 'webinar']),
});

export const validateEventData = (data: unknown) => {
  try {
    return EventSchema.parse(data);
  } catch (error) {
    throw new ValidationError('Invalid event data', error.errors);
  }
};

// ✅ GOOD: SQL injection prevention
export const getEventById = async (eventId: string) => {
  // Use parameterized queries
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single();
    
  if (error) throw new DatabaseError('Failed to fetch event', error);
  return data;
};
```

### **Row Level Security (RLS)**
```sql
-- ✅ GOOD: Comprehensive RLS policies
-- Enable RLS on all tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Users can only view published events
CREATE POLICY "Users can view published events" ON events
  FOR SELECT USING (status = 'published');

-- Organizers can manage their own events
CREATE POLICY "Organizers can manage their events" ON events
  FOR ALL USING (auth.uid() = organizer_id);

-- Users can only view their own orders
CREATE POLICY "Users can view their orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only create orders for themselves
CREATE POLICY "Users can create their own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

---

## 🎨 **UI/UX Best Practices**

### **Component Design Patterns**
```typescript
// ✅ GOOD: Consistent component interface
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  onClick,
  className = '',
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors';
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-input bg-background hover:bg-accent',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
  };
  const sizeClasses = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-11 px-8 text-lg',
  };
  
  return (
    <button
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && <Spinner className="mr-2 h-4 w-4" />}
      {children}
    </button>
  );
};
```

### **Accessibility Standards**
```typescript
// ✅ GOOD: Accessible component implementation
export const EventCard: React.FC<EventCardProps> = ({ event, onSelect }) => {
  return (
    <article
      role="article"
      aria-labelledby={`event-title-${event.id}`}
      className="rounded-lg border bg-card p-4 hover:shadow-md transition-shadow"
    >
      <h3 id={`event-title-${event.id}`} className="font-semibold text-lg">
        {event.title}
      </h3>
      
      <p className="text-muted-foreground mt-2">
        {event.description}
      </p>
      
      <div className="mt-4 flex items-center justify-between">
        <time dateTime={event.startDate.toISOString()}>
          {formatDate(event.startDate)}
        </time>
        
        <Button
          onClick={() => onSelect(event.id)}
          aria-label={`View details for ${event.title}`}
        >
          View Details
        </Button>
      </div>
    </article>
  );
};
```

---

## 🧪 **Testing Best Practices**

### **Unit Testing Patterns**
```typescript
// ✅ GOOD: Comprehensive unit tests
describe('EventCard', () => {
  const mockEvent = {
    id: '1',
    title: 'Test Event',
    description: 'Test Description',
    startDate: new Date('2024-01-01'),
    status: 'published' as const,
  };
  
  it('renders event information correctly', () => {
    render(<EventCard event={mockEvent} onSelect={jest.fn()} />);
    
    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Jan 1, 2024')).toBeInTheDocument();
  });
  
  it('calls onSelect when view details is clicked', () => {
    const onSelect = jest.fn();
    render(<EventCard event={mockEvent} onSelect={onSelect} />);
    
    fireEvent.click(screen.getByText('View Details'));
    expect(onSelect).toHaveBeenCalledWith('1');
  });
  
  it('is accessible', async () => {
    const { container } = render(<EventCard event={mockEvent} onSelect={jest.fn()} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### **Integration Testing Patterns**
```typescript
// ✅ GOOD: Integration tests with real data
describe('Event Creation Flow', () => {
  beforeEach(async () => {
    await setupTestDatabase();
  });
  
  afterEach(async () => {
    await cleanupTestDatabase();
  });
  
  it('creates an event successfully', async () => {
    render(<EventCreationWizard />);
    
    // Fill out event form
    await user.type(screen.getByLabelText('Event Title'), 'Test Event');
    await user.type(screen.getByLabelText('Description'), 'Test Description');
    await user.selectOptions(screen.getByLabelText('Event Type'), 'conference');
    
    // Submit form
    await user.click(screen.getByRole('button', { name: 'Create Event' }));
    
    // Verify event was created
    await waitFor(() => {
      expect(screen.getByText('Event created successfully')).toBeInTheDocument();
    });
    
    // Verify event appears in list
    const event = await screen.findByText('Test Event');
    expect(event).toBeInTheDocument();
  });
});
```

---

## 📊 **Performance Best Practices**

### **Code Splitting and Lazy Loading**
```typescript
// ✅ GOOD: Route-based code splitting
const EventCreationWizard = lazy(() => import('../features/events/EventCreationWizard'));
const AnalyticsDashboard = lazy(() => import('../features/analytics/AnalyticsDashboard'));

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/events/create" element={
        <Suspense fallback={<LoadingSpinner />}>
          <EventCreationWizard />
        </Suspense>
      } />
      <Route path="/analytics" element={
        <Suspense fallback={<LoadingSpinner />}>
          <AnalyticsDashboard />
        </Suspense>
      } />
    </Routes>
  );
};

// ✅ GOOD: Component-level lazy loading
const HeavyChart = lazy(() => import('./HeavyChart'));

export const AnalyticsCard: React.FC = () => {
  const [showChart, setShowChart] = useState(false);
  
  return (
    <div>
      <Button onClick={() => setShowChart(true)}>
        Show Chart
      </Button>
      
      {showChart && (
        <Suspense fallback={<ChartSkeleton />}>
          <HeavyChart />
        </Suspense>
      )}
    </div>
  );
};
```

### **Database Optimization**
```sql
-- ✅ GOOD: Proper indexing
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_organizer ON events(organizer_id);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_orders_event_id ON orders(event_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- ✅ GOOD: Optimized queries
-- Use SELECT with specific columns instead of SELECT *
SELECT id, title, start_date, status 
FROM events 
WHERE status = 'published' 
  AND start_date > NOW()
ORDER BY start_date ASC
LIMIT 20;

-- ✅ GOOD: Use EXPLAIN ANALYZE for query optimization
EXPLAIN ANALYZE
SELECT e.title, COUNT(o.id) as booking_count
FROM events e
LEFT JOIN orders o ON e.id = o.event_id
WHERE e.status = 'published'
GROUP BY e.id, e.title
ORDER BY booking_count DESC;
```

---

## 🔄 **State Management Best Practices**

### **React Query Configuration**
```typescript
// ✅ GOOD: Centralized query client configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        if (error.status === 404) return false;
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// ✅ GOOD: Custom hooks for data fetching
export const useEvents = (filters?: EventFilters) => {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: () => fetchEvents(filters),
    enabled: !!filters,
  });
};

export const useEvent = (eventId: string) => {
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: () => fetchEvent(eventId),
    enabled: !!eventId,
  });
};
```

---

## ✅ **Best Practices Validation**

### **Code Quality Checks**
```bash
# ✅ GOOD: Automated quality checks
npm run lint          # ESLint checks
npm run type-check    # TypeScript checks
npm run test          # Unit tests
npm run test:e2e      # E2E tests
npm run build         # Production build
npm run analyze       # Bundle analysis
```

### **Success Criteria**
- ✅ All components follow consistent naming conventions
- ✅ 100% TypeScript coverage with strict mode
- ✅ ESLint rules pass with zero warnings
- ✅ Unit test coverage > 90%
- ✅ E2E test coverage > 80%
- ✅ Accessibility score > 95%
- ✅ Performance score > 90
- ✅ Security audit passes

---

**Next Step:** Review [008-success-criteria.md](008-success-criteria.md) to understand measurable success metrics.

---

**Generated:** 2025-01-17  
**Version:** MVP 1.0  
**Status:** Best Practices Complete
