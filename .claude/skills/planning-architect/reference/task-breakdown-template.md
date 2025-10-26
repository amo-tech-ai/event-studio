# Task Breakdown Template

Use this template when breaking down features into implementation tasks.

## Layer-Based Sequencing

**Critical Rule**: NEVER start a layer before the previous layer is complete and tested.

```
Layer 1: Database ✅ (Foundation)
  ↓ Must complete and test before Layer 2
Layer 2: Backend ✅ (Business Logic)
  ↓ Must complete and test before Layer 3
Layer 3: Frontend ✅ (User Interface)
  ↓ Must complete and test before Layer 4
Layer 4: Testing ✅ (Continuous Validation)
  ↓ Must complete before Layer 5
Layer 5: Production ✅ (Deployment)
```

---

## Template Structure

```markdown
# {Feature Name} - Task Breakdown

**Estimated Completion**: X days
**Assignee**: {name or team}
**Priority**: High/Medium/Low
**Dependencies**: {List dependent features or tasks}

---

## Layer 1: Database Foundation

### Task 1.1: Design Schema
**File**: `supabase/migrations/{timestamp}_{feature}_schema.sql`
**Estimated Time**: 2 hours
**Dependencies**: None

**Success Criteria**:
- [ ] ERD diagram created
- [ ] All tables defined with proper types
- [ ] Foreign keys established
- [ ] Indexes planned

**Implementation Steps**:
1. Create ERD using mermaid or dbdiagram.io
2. Define table schemas
3. Identify indexes needed
4. Document relationships

**Testing**:
```bash
# Validate migration syntax
pnpm db:push --dry-run
```

**Rollback Plan**:
```sql
-- Include DROP statements in migration comments
-- DROP TABLE IF EXISTS {table_name} CASCADE;
```

---

### Task 1.2: Create Migration
**File**: `supabase/migrations/{timestamp}_{feature}_schema.sql`
**Estimated Time**: 1 hour
**Dependencies**: Task 1.1

**Success Criteria**:
- [ ] Migration is idempotent (can run multiple times safely)
- [ ] All tables created with correct schemas
- [ ] Indexes created
- [ ] Migration runs without errors

**Implementation**:
```sql
-- Create tables if not exists
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_events_created
  ON events(created_at DESC);

-- Rollback (in comments)
-- DROP TABLE IF EXISTS events CASCADE;
```

**Testing**:
```bash
# Apply migration locally
pnpm db:push

# Verify tables exist
pnpm db:studio
```

---

### Task 1.3: Add RLS Policies
**File**: `supabase/migrations/{timestamp}_{feature}_rls.sql`
**Estimated Time**: 2 hours
**Dependencies**: Task 1.2

**Success Criteria**:
- [ ] RLS enabled on all tables
- [ ] Public read policies work
- [ ] Authenticated write policies work
- [ ] Organizer-specific policies work
- [ ] Policies tested with different user roles

**Implementation**:
```sql
-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Public can view published events
CREATE POLICY "public_events_viewable"
  ON events FOR SELECT
  TO public
  USING (status = 'published');

-- Authenticated users can create events
CREATE POLICY "authenticated_create_events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = organizer_id);

-- Organizers can update own events
CREATE POLICY "organizers_update_own"
  ON events FOR UPDATE
  TO authenticated
  USING (auth.uid() = organizer_id)
  WITH CHECK (auth.uid() = organizer_id);
```

**Testing**:
```bash
# Test RLS policies
# 1. Sign in as public user - verify can see published events
# 2. Sign in as organizer - verify can CRUD own events
# 3. Sign in as other user - verify cannot modify other's events
```

**Security Validation**:
- [ ] Anonymous users cannot modify data
- [ ] Users cannot see draft events from others
- [ ] Organizers can only modify their own events

---

### Task 1.4: Database Testing
**Tool**: Supabase Studio or SQL queries
**Estimated Time**: 1 hour
**Dependencies**: Task 1.3

**Success Criteria**:
- [ ] Can insert test data
- [ ] RLS policies work as expected
- [ ] Indexes improve query performance
- [ ] Foreign keys enforce integrity

**Test Cases**:
```sql
-- Test 1: Insert event
INSERT INTO events (title, organizer_id, status)
VALUES ('Test Event', auth.uid(), 'draft');

-- Test 2: Query with index
EXPLAIN ANALYZE
SELECT * FROM events WHERE status = 'published';
-- Verify index is used

-- Test 3: Foreign key constraint
INSERT INTO tickets (event_id)
VALUES ('non-existent-uuid');
-- Should fail with foreign key violation
```

---

## Layer 2: Backend Logic

### Task 2.1: Create Edge Function
**File**: `supabase/functions/{name}/index.ts`
**Estimated Time**: 3 hours
**Dependencies**: Layer 1 complete

**Success Criteria**:
- [ ] Function deploys successfully
- [ ] Authentication works
- [ ] Validation works
- [ ] Error handling complete
- [ ] Logs structured data

**Implementation**:
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'

// Validation schema
const requestSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(5000).optional(),
})

serve(async (req: Request) => {
  try {
    // 1. Get authenticated user
    const authHeader = req.headers.get('Authorization')!
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return new Response('Unauthorized', { status: 401 })
    }

    // 2. Validate request
    const body = await req.json()
    const validated = requestSchema.parse(body)

    // 3. Business logic
    const { data, error } = await supabase
      .from('events')
      .insert({ ...validated, organizer_id: user.id })
      .select()
      .single()

    if (error) throw error

    // 4. Return response
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
      status: 201,
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400 }
    )
  }
})
```

**Testing**:
```bash
# Deploy function
supabase functions deploy {name}

# Test with curl
curl -X POST https://{project}.supabase.co/functions/v1/{name} \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Event"}'
```

---

### Task 2.2: Create React Query Hook
**File**: `src/hooks/use{Feature}.ts`
**Estimated Time**: 2 hours
**Dependencies**: Task 2.1

**Success Criteria**:
- [ ] Query hook fetches data correctly
- [ ] Mutation hooks work (create, update, delete)
- [ ] Cache invalidation works
- [ ] Error handling implemented
- [ ] TypeScript types complete

**Implementation**:
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { Database } from '@/integrations/supabase/types'

type Event = Database['public']['Tables']['events']['Row']
type EventInsert = Database['public']['Tables']['events']['Insert']

export function useEvents(filters?: { status?: string }) {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: async () => {
      let query = supabase.from('events').select('*')

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCreateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (event: EventInsert) => {
      const { data, error } = await supabase
        .from('events')
        .insert(event)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      // Invalidate and refetch events list
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}
```

**Testing**:
```typescript
// In component or test file
const { data, isLoading, error } = useEvents({ status: 'published' })
const createEvent = useCreateEvent()

// Test mutation
await createEvent.mutateAsync({
  title: 'Test Event',
  organizer_id: userId,
})
```

---

## Layer 3: Frontend UI

### Task 3.1: Create Component
**File**: `src/components/{Name}.tsx`
**Estimated Time**: 3 hours
**Dependencies**: Layer 2 complete

**Success Criteria**:
- [ ] Component renders correctly
- [ ] Uses real data from hook
- [ ] Loading states work
- [ ] Error states work
- [ ] Accessibility complete (a11y)
- [ ] Responsive design works

**Implementation**:
```typescript
import { useEvents } from '@/hooks/useEvents'
import { Loader2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function EventsList() {
  const { data: events, isLoading, error } = useEvents({ status: 'published' })

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load events. Please try again.
        </AlertDescription>
      </Alert>
    )
  }

  if (!events?.length) {
    return <EmptyState message="No events found" />
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {events.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}
```

**Testing**:
```bash
# Run dev server
npm run dev

# Visual testing checklist:
# [ ] Component renders
# [ ] Loading spinner shows
# [ ] Error message displays
# [ ] Empty state shows
# [ ] Events list displays
# [ ] Responsive on mobile
```

---

### Task 3.2: Add Form Handling
**File**: `src/components/{Name}Form.tsx`
**Estimated Time**: 2 hours
**Dependencies**: Task 3.1

**Success Criteria**:
- [ ] Form validates input
- [ ] Submit calls mutation hook
- [ ] Success feedback shows
- [ ] Error feedback shows
- [ ] Form resets after success

**Implementation**:
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateEvent } from '@/hooks/useEvents'
import { toast } from 'sonner'

const formSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(5000).optional(),
})

export function EventForm() {
  const createEvent = useCreateEvent()
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { title: '', description: '' },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createEvent.mutateAsync(values)
      toast.success('Event created successfully!')
      form.reset()
    } catch (error) {
      toast.error('Failed to create event')
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  )
}
```

---

## Layer 4: Testing & Validation

### Task 4.1: E2E Tests (Playwright MCP)
**Tool**: Playwright MCP
**Estimated Time**: 2 hours
**Dependencies**: Layer 3 complete

**Success Criteria**:
- [ ] User flow tested end-to-end
- [ ] All assertions pass
- [ ] Screenshots captured
- [ ] Network requests validated

**Test Script**:
```typescript
// Using Playwright MCP tools
await mcp__playwright__browser_navigate({
  url: 'http://localhost:8081/events'
})

await mcp__playwright__browser_snapshot()

await mcp__playwright__browser_click({
  element: 'Create Event button',
  ref: 'button-create-event'
})

await mcp__playwright__browser_fill_form({
  fields: [
    { name: 'Title', type: 'textbox', ref: 'input-title', value: 'Test Event' },
    { name: 'Description', type: 'textbox', ref: 'textarea-desc', value: 'Test' }
  ]
})

await mcp__playwright__browser_click({
  element: 'Submit button',
  ref: 'button-submit'
})

await mcp__playwright__browser_wait_for({
  text: 'Event created successfully'
})
```

---

### Task 4.2: Network Monitoring (Chrome DevTools MCP)
**Tool**: Chrome DevTools MCP
**Estimated Time**: 1 hour
**Dependencies**: Task 4.1

**Success Criteria**:
- [ ] API calls logged
- [ ] Response times measured
- [ ] Errors captured
- [ ] Console logs clean

**Test Script**:
```typescript
await mcp__chrome-devtools__navigate_page({
  url: 'http://localhost:8081/events'
})

const requests = await mcp__chrome-devtools__list_network_requests()
// Verify API calls

const console = await mcp__chrome-devtools__list_console_messages({
  types: ['error']
})
// Verify no errors
```

---

## Layer 5: Production Deployment

### Task 5.1: Pre-deployment Checklist
**Estimated Time**: 1 hour
**Dependencies**: Layer 4 complete

**Checklist**:
- [ ] All tests pass
- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] Environment variables set
- [ ] Database migrations ready
- [ ] Edge Functions deployed to staging
- [ ] Performance audit complete
- [ ] Security audit complete
- [ ] Documentation updated

---

### Task 5.2: Deploy
**Estimated Time**: 1 hour
**Dependencies**: Task 5.1

**Steps**:
```bash
# 1. Database migration
supabase db push

# 2. Deploy Edge Functions
supabase functions deploy {name}

# 3. Build frontend
npm run build

# 4. Deploy frontend
vercel deploy --prod

# 5. Verify deployment
curl https://your-domain.com/api/health
```

**Success Criteria**:
- [ ] Migration applied successfully
- [ ] Edge Functions deployed
- [ ] Frontend deployed
- [ ] Health check passes
- [ ] Feature works in production

---

## Summary

**Total Estimated Time**: {sum of all tasks}
**Critical Path**: Database → Backend → Frontend → Testing → Deploy
**Blockers**: {List any known blockers}
**Risks**: {List any risks}

---

**Template Version**: 1.0
**Last Updated**: 2025-10-23
