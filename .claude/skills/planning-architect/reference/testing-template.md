# Testing Plan Template

Comprehensive testing strategy with MCP tool integration.

## Testing Pyramid

```
         /\
        /E2E\         ← 10% (Slow, comprehensive)
       /------\
      /Integration\   ← 30% (Medium speed)
     /------------\
    /    Unit      \  ← 60% (Fast, focused)
   /----------------\
```

---

## 1. Unit Testing

### Framework Setup
```bash
# Install Vitest
npm install -D vitest @vitest/ui
npm install -D @testing-library/react @testing-library/jest-dom
npm install -D @testing-library/user-event
```

### Configuration
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    globals: true,
    coverage: {
      reporter: ['text', 'html', 'lcov'],
      exclude: ['node_modules/', 'src/test/'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### Test Categories

#### Utility Functions
**File**: `src/utils/{name}.test.ts`
**Coverage Target**: 100%

```typescript
import { describe, it, expect } from 'vitest'
import { formatCurrency, formatDate } from './formatters'

describe('formatCurrency', () => {
  it('formats USD correctly', () => {
    expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56')
  })

  it('handles zero', () => {
    expect(formatCurrency(0, 'USD')).toBe('$0.00')
  })

  it('handles negative amounts', () => {
    expect(formatCurrency(-100, 'USD')).toBe('-$100.00')
  })
})
```

#### Validation Schemas
**File**: `src/schemas/{name}.test.ts`
**Coverage Target**: 100%

```typescript
import { describe, it, expect } from 'vitest'
import { eventSchema } from './event'

describe('eventSchema', () => {
  it('validates valid event', () => {
    const valid = {
      title: 'Test Event',
      description: 'Description',
      start_date: '2025-12-01T10:00:00Z',
    }
    expect(() => eventSchema.parse(valid)).not.toThrow()
  })

  it('rejects title too short', () => {
    const invalid = { title: 'ab' }
    expect(() => eventSchema.parse(invalid)).toThrow()
  })

  it('rejects invalid date format', () => {
    const invalid = { start_date: 'not-a-date' }
    expect(() => eventSchema.parse(invalid)).toThrow()
  })
})
```

#### React Hooks
**File**: `src/hooks/{name}.test.ts`
**Coverage Target**: 90%

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEvents } from './useEvents'

describe('useEvents', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
  })

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )

  it('fetches events successfully', async () => {
    const { result } = renderHook(() => useEvents(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBeDefined()
  })

  it('handles errors', async () => {
    // Mock Supabase error
    vi.mock('@/integrations/supabase/client', () => ({
      supabase: {
        from: () => ({
          select: () => Promise.resolve({ data: null, error: new Error('DB error') })
        })
      }
    }))

    const { result } = renderHook(() => useEvents(), { wrapper })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error).toBeDefined()
  })
})
```

---

## 2. Component Testing

### React Component Tests
**File**: `src/components/{Name}.test.tsx`
**Coverage Target**: 80%

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EventsList } from './EventsList'

describe('EventsList', () => {
  it('shows loading state', () => {
    render(<EventsList />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('displays events', async () => {
    render(<EventsList />)

    await waitFor(() => {
      expect(screen.getByText('Test Event 1')).toBeInTheDocument()
      expect(screen.getByText('Test Event 2')).toBeInTheDocument()
    })
  })

  it('shows empty state when no events', async () => {
    // Mock empty response
    vi.mock('@/hooks/useEvents', () => ({
      useEvents: () => ({ data: [], isLoading: false, error: null })
    }))

    render(<EventsList />)
    expect(screen.getByText('No events found')).toBeInTheDocument()
  })

  it('handles errors gracefully', async () => {
    // Mock error
    vi.mock('@/hooks/useEvents', () => ({
      useEvents: () => ({
        data: null,
        isLoading: false,
        error: new Error('Failed to load')
      })
    }))

    render(<EventsList />)
    expect(screen.getByText(/Failed to load/i)).toBeInTheDocument()
  })
})
```

### Form Component Tests
```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EventForm } from './EventForm'

describe('EventForm', () => {
  it('validates required fields', async () => {
    const user = userEvent.setup()
    render(<EventForm />)

    const submitButton = screen.getByRole('button', { name: /submit/i })
    await user.click(submitButton)

    expect(screen.getByText(/title is required/i)).toBeInTheDocument()
  })

  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<EventForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText(/title/i), 'Test Event')
    await user.type(screen.getByLabelText(/description/i), 'Description')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Test Event',
      description: 'Description',
    })
  })
})
```

---

## 3. Integration Testing

### API Integration Tests
**File**: `src/api/{name}.test.ts`
**Coverage Target**: 70%

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createClient } from '@supabase/supabase-js'

describe('Events API Integration', () => {
  let supabase: ReturnType<typeof createClient>
  let testEventId: string

  beforeAll(() => {
    supabase = createClient(
      process.env.VITE_SUPABASE_URL!,
      process.env.VITE_SUPABASE_ANON_KEY!
    )
  })

  afterAll(async () => {
    // Clean up test data
    if (testEventId) {
      await supabase.from('events').delete().eq('id', testEventId)
    }
  })

  it('creates event', async () => {
    const { data, error } = await supabase
      .from('events')
      .insert({
        title: 'Integration Test Event',
        organizer_id: 'test-user-id',
      })
      .select()
      .single()

    expect(error).toBeNull()
    expect(data).toBeDefined()
    expect(data?.title).toBe('Integration Test Event')
    testEventId = data!.id
  })

  it('fetches events with filter', async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'published')

    expect(error).toBeNull()
    expect(Array.isArray(data)).toBe(true)
  })

  it('enforces RLS policies', async () => {
    // Try to update another user's event
    const { error } = await supabase
      .from('events')
      .update({ title: 'Hacked' })
      .eq('id', testEventId)

    expect(error).toBeDefined()
    expect(error?.code).toBe('42501') // Permission denied
  })
})
```

### Edge Function Integration Tests
**File**: `supabase/functions/{name}/test.ts`

```typescript
import { assertEquals } from 'https://deno.land/std@0.168.0/testing/asserts.ts'

Deno.test('Edge Function - Create Event', async () => {
  const response = await fetch('http://localhost:54321/functions/v1/create-event', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('TEST_TOKEN')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: 'Test Event',
      description: 'Test Description',
    }),
  })

  assertEquals(response.status, 201)
  const data = await response.json()
  assertEquals(data.title, 'Test Event')
})
```

---

## 4. E2E Testing (MCP Integration)

### Playwright MCP Tests
**Purpose**: Test complete user flows in browser

#### Test Case 1: Create Event Flow
```typescript
/**
 * E2E Test: Create Event
 *
 * User Story: As an organizer, I want to create a new event
 * so that I can start selling tickets.
 */

// 1. Navigate to events page
await mcp__playwright__browser_navigate({
  url: 'http://localhost:8081/dashboard/events'
})

// 2. Take snapshot to verify page loaded
const snapshot = await mcp__playwright__browser_snapshot()
// Verify "Create Event" button exists

// 3. Click create button
await mcp__playwright__browser_click({
  element: 'Create Event button',
  ref: 'button-create-event'
})

// 4. Fill form
await mcp__playwright__browser_fill_form({
  fields: [
    {
      name: 'Event Title',
      type: 'textbox',
      ref: 'input-title',
      value: 'E2E Test Event'
    },
    {
      name: 'Description',
      type: 'textbox',
      ref: 'textarea-description',
      value: 'This is an E2E test event'
    },
    {
      name: 'Start Date',
      type: 'textbox',
      ref: 'input-start-date',
      value: '2025-12-01'
    },
    {
      name: 'Venue',
      type: 'combobox',
      ref: 'select-venue',
      value: 'Test Venue'
    }
  ]
})

// 5. Submit form
await mcp__playwright__browser_click({
  element: 'Submit button',
  ref: 'button-submit'
})

// 6. Wait for success message
await mcp__playwright__browser_wait_for({
  text: 'Event created successfully'
})

// 7. Verify event appears in list
const finalSnapshot = await mcp__playwright__browser_snapshot()
// Verify "E2E Test Event" appears in the list

// 8. Take screenshot for documentation
await mcp__playwright__browser_take_screenshot({
  filename: 'e2e-create-event-success.png'
})
```

#### Test Case 2: Book Ticket Flow
```typescript
/**
 * E2E Test: Book Ticket
 *
 * User Story: As an attendee, I want to book a ticket
 * so that I can attend the event.
 */

// 1. Navigate to event page
await mcp__playwright__browser_navigate({
  url: 'http://localhost:8081/events/test-event-id'
})

// 2. Click "Book Now" button
await mcp__playwright__browser_click({
  element: 'Book Now button',
  ref: 'button-book-now'
})

// 3. Select ticket quantity
await mcp__playwright__browser_click({
  element: 'Increase quantity button',
  ref: 'button-increase-quantity'
})

// 4. Proceed to checkout
await mcp__playwright__browser_click({
  element: 'Proceed to Checkout',
  ref: 'button-checkout'
})

// 5. Fill attendee information
await mcp__playwright__browser_fill_form({
  fields: [
    { name: 'Name', type: 'textbox', ref: 'input-name', value: 'Test User' },
    { name: 'Email', type: 'textbox', ref: 'input-email', value: 'test@example.com' }
  ]
})

// 6. Submit booking
await mcp__playwright__browser_click({
  element: 'Complete Booking',
  ref: 'button-complete-booking'
})

// 7. Wait for confirmation
await mcp__playwright__browser_wait_for({
  text: 'Booking confirmed'
})
```

---

### Chrome DevTools MCP Tests
**Purpose**: Monitor network, performance, and console

#### Test Case 1: API Performance Monitoring
```typescript
/**
 * Performance Test: Dashboard Load
 *
 * Requirement: Dashboard should load in < 2 seconds
 */

// 1. Navigate to dashboard
await mcp__chrome-devtools__navigate_page({
  url: 'http://localhost:8081/dashboard'
})

// 2. Get network requests
const requests = await mcp__chrome-devtools__list_network_requests()

// 3. Analyze API calls
const apiCalls = requests.filter(r => r.url.includes('/api/'))
for (const call of apiCalls) {
  console.log(`API: ${call.url}`)
  console.log(`Time: ${call.timing.total}ms`)
  console.log(`Status: ${call.status}`)

  // Assert response time < 200ms
  if (call.timing.total > 200) {
    console.warn(`⚠️ Slow API call: ${call.url} took ${call.timing.total}ms`)
  }
}

// 4. Check console for errors
const consoleLogs = await mcp__chrome-devtools__list_console_messages({
  types: ['error']
})

if (consoleLogs.length > 0) {
  console.error('❌ Console errors detected:')
  consoleLogs.forEach(log => console.error(log.text))
} else {
  console.log('✅ No console errors')
}

// 5. Take screenshot of final state
await mcp__chrome-devtools__take_screenshot({
  filename: 'dashboard-performance-test.png'
})
```

#### Test Case 2: Network Error Handling
```typescript
/**
 * Error Handling Test: Network Failure
 *
 * Requirement: App should handle network errors gracefully
 */

// 1. Navigate with emulated slow network
await mcp__chrome-devtools__emulate_network({
  throttlingOption: 'Slow 3G'
})

await mcp__chrome-devtools__navigate_page({
  url: 'http://localhost:8081/events'
})

// 2. Check loading states appear
await mcp__chrome-devtools__wait_for({
  text: 'Loading...'
})

// 3. Verify data eventually loads
await mcp__chrome-devtools__wait_for({
  text: 'Events'
})

// 4. Simulate offline mode
await mcp__chrome-devtools__emulate_network({
  throttlingOption: 'Offline'
})

// 5. Try to create event (should fail gracefully)
await mcp__chrome-devtools__navigate_page({
  url: 'http://localhost:8081/dashboard/events/new'
})

// 6. Verify error message appears
const snapshot = await mcp__chrome-devtools__take_snapshot()
// Should show "Network error" message

// 7. Reset network
await mcp__chrome-devtools__emulate_network({
  throttlingOption: 'No emulation'
})
```

---

## 5. Manual Testing Checklist

### Pre-deployment QA

#### Functionality
- [ ] All CRUD operations work
- [ ] Forms validate correctly
- [ ] Error messages are user-friendly
- [ ] Success messages appear
- [ ] Loading states show appropriately

#### UI/UX
- [ ] Responsive on mobile (320px, 768px, 1024px)
- [ ] Responsive on tablet
- [ ] Responsive on desktop
- [ ] Dark mode works (if applicable)
- [ ] Animations are smooth
- [ ] No layout shifts

#### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA
- [ ] Alt text on images
- [ ] ARIA labels present

#### Performance
- [ ] Page load < 2s
- [ ] API responses < 200ms (p95)
- [ ] No unnecessary re-renders
- [ ] Images optimized
- [ ] Code splitting effective

#### Security
- [ ] RLS policies enforced
- [ ] XSS prevention working
- [ ] CSRF tokens present
- [ ] No sensitive data in logs
- [ ] Authentication required

#### Cross-browser
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

## 6. Test Automation Strategy

### CI/CD Integration
```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm test

      - name: Run integration tests
        run: npm run test:integration
        env:
          VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}

      - name: Generate coverage
        run: npm run test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

### Test Coverage Goals
- **Unit Tests**: 80%+ coverage
- **Integration Tests**: 70%+ coverage
- **E2E Tests**: Critical user flows (100%)

---

## 7. Performance Testing

### Lighthouse CI
```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:8081/dashboard'],
      numberOfRuns: 3,
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
  },
}
```

### Load Testing
```bash
# Using k6
k6 run load-test.js

# Script: load-test.js
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  stages: [
    { duration: '1m', target: 100 },  // Ramp up
    { duration: '3m', target: 100 },  // Stay at 100 users
    { duration: '1m', target: 0 },    // Ramp down
  ],
};

export default function () {
  const res = http.get('https://your-api.com/events');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });
}
```

---

## 8. Success Criteria

### Test Coverage
- ✅ Unit test coverage > 80%
- ✅ Integration test coverage > 70%
- ✅ All critical paths have E2E tests
- ✅ All components have tests

### Performance
- ✅ All API calls < 200ms (p95)
- ✅ Page loads < 2s
- ✅ Lighthouse score > 90

### Quality
- ✅ No console errors in production
- ✅ All tests pass before deployment
- ✅ Accessibility score > 95
- ✅ Zero critical bugs

---

**Template Version**: 1.0
**Last Updated**: 2025-10-23
