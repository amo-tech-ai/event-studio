# Task 04: TypeScript Types Generation
**Priority:** 🔴 CRITICAL BLOCKER
**Estimated Time:** 30 minutes
**Status:** 🔴 NOT STARTED
**Dependencies:** Task 01 (Database Verification)

---

## 🎯 Objective

Generate TypeScript types from database schema to enable type-safe queries and autocomplete.

---

## ✅ Success Criteria

- [ ] database.ts file created in src/types/
- [ ] Types generated from all 22 tables
- [ ] TypeScript compiles with no errors
- [ ] Autocomplete works in IDE
- [ ] Can import and use types in hooks

---

## 📋 Task Checklist

### 1. Create Types Directory (2 min)

```bash
# Create types directory if it doesn't exist
mkdir -p src/types
```

- [ ] Create src/types/ directory
- [ ] Verify directory exists

### 2. Generate Types from Database (5 min)

```bash
# Generate types from local Supabase instance
npx supabase gen types typescript --local > src/types/database.ts

# Or if using remote Supabase:
# npx supabase gen types typescript --project-id asrzdtpyrdgyggqdfwwl > src/types/database.ts
```

- [ ] Run type generation command
- [ ] Wait for completion
- [ ] Verify database.ts file created
- [ ] Check file size (should be > 10 KB)

**Expected Output:**
```
Connecting to local database...
Generating types...
✅ Types written to src/types/database.ts
```

### 3. Verify Generated Types (10 min)

```bash
# Check file size
ls -lh src/types/database.ts

# View first 50 lines to verify structure
head -n 50 src/types/database.ts
```

**Expected Content:**
```typescript
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          name: string
          slug: string
          event_type: string
          status: string
          // ... more fields
        }
        Insert: {
          // ...
        }
        Update: {
          // ...
        }
      }
      orders: {
        // ...
      }
      // ... all 22 tables
    }
  }
}
```

- [ ] Verify Database interface exists
- [ ] Verify Tables type exists
- [ ] Verify Row, Insert, Update types for each table
- [ ] Check events table types
- [ ] Check orders table types
- [ ] File size reasonable (20-50 KB expected)

### 4. Test Type Imports (10 min)

Create a test file to verify imports work:

```bash
# Create test file
cat > src/types/test-types.ts << 'EOF'
import type { Database } from './database'

// Test extracting table types
type Event = Database['public']['Tables']['events']['Row']
type Order = Database['public']['Tables']['orders']['Row']
type Ticket = Database['public']['Tables']['tickets']['Row']

// Test that required fields exist
const testEvent: Event = {
  id: 'test-id',
  name: 'Test Event',
  slug: 'test-event',
  event_type: 'conference',
  status: 'published',
  description: null,
  start_at: new Date().toISOString(),
  end_at: new Date().toISOString(),
  capacity: 100,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

// Test autocomplete works
const eventId: Event['id'] = 'test-id'
const eventName: Event['name'] = 'Test Event'

console.log('✅ Types test passed')
EOF

# Compile test file
npx tsc --noEmit src/types/test-types.ts

# Clean up test file
rm src/types/test-types.ts
```

- [ ] Create test file
- [ ] Verify TypeScript compiles with no errors
- [ ] Test autocomplete works in IDE
- [ ] Delete test file after verification

### 5. Create Type Utility Helpers (Optional - 3 min)

```bash
cat > src/types/helpers.ts << 'EOF'
import type { Database } from './database'

// Utility types for easier type extraction
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type Insertable<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type Updatable<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

// Common table types
export type Event = Tables<'events'>
export type Order = Tables<'orders'>
export type Ticket = Tables<'tickets'>
export type Attendee = Tables<'attendees'>
export type Profile = Tables<'profiles'>
export type Company = Tables<'companies'>
export type Contact = Tables<'contacts'>
export type Venue = Tables<'venues'>

// Export main Database type
export type { Database }
EOF
```

- [ ] Create helpers.ts file
- [ ] Add utility types
- [ ] Export common table types
- [ ] Verify no TypeScript errors

### 6. Test in Real Hook (Optional - 5 min)

Update existing useEvents hook to use types:

```typescript
// src/features/events/hooks/useEvents.ts
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { Event } from '@/types/helpers' // ✅ NEW

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'published')
        .order('start_at', { ascending: true })

      if (error) throw error
      return data as Event[] // ✅ Type-safe
    },
    staleTime: 5 * 60 * 1000,
  })
}
```

- [ ] Import Event type in useEvents.ts
- [ ] Use type in return statement
- [ ] Verify autocomplete works
- [ ] No TypeScript errors

---

## 📊 Type Generation Verification

### Check Generated Types Include:

- [ ] **Database** interface
- [ ] **Tables** type with all tables:
  - [ ] events
  - [ ] orders
  - [ ] tickets
  - [ ] attendees
  - [ ] profiles
  - [ ] companies
  - [ ] contacts
  - [ ] interactions
  - [ ] tasks
  - [ ] promo_codes
  - [ ] venues
  - [ ] wizard_sessions
  - [ ] marketing_campaigns
  - [ ] budgets
  - [ ] ticket_tiers
  - [ ] event_categories
  - [ ] custom_fields
  - [ ] event_dashboards
  - [ ] venue_bookings
  - [ ] (and any other tables)

- [ ] Each table has:
  - [ ] Row type (for SELECT queries)
  - [ ] Insert type (for INSERT queries)
  - [ ] Update type (for UPDATE queries)

### TypeScript Features Working:

- [ ] Autocomplete for table names
- [ ] Autocomplete for column names
- [ ] Type checking for query results
- [ ] Type checking for insert/update data
- [ ] No 'any' types in generated file

---

## 🚩 Common Issues

### Issue: Command Not Found

```bash
# Install Supabase CLI if needed
npm install -g supabase

# Or use npx
npx supabase gen types typescript --local
```

### Issue: Connection Failed

```bash
# Make sure Supabase is running
supabase status

# If not running:
supabase start
```

### Issue: Types Outdated

```bash
# Re-run after schema changes
npx supabase gen types typescript --local > src/types/database.ts
```

---

## ✅ Validation

Run these checks before marking complete:

```bash
# 1. File exists
[ -f "src/types/database.ts" ] && echo "✅ File exists" || echo "❌ File missing"

# 2. File has content
[ -s "src/types/database.ts" ] && echo "✅ File has content" || echo "❌ File empty"

# 3. Contains Database interface
grep -q "export interface Database" src/types/database.ts && echo "✅ Database interface found" || echo "❌ Missing"

# 4. Contains events table
grep -q "events:" src/types/database.ts && echo "✅ Events table found" || echo "❌ Missing"

# 5. TypeScript compiles
npx tsc --noEmit && echo "✅ TypeScript OK" || echo "❌ TypeScript errors"
```

Expected output: All ✅

---

## 🎯 Next Task

After completing this task:
- [ ] database.ts file exists
- [ ] All table types generated
- [ ] TypeScript compiles
- [ ] Autocomplete works
- [ ] Proceed to **Task 05: Phase 0 - Shared Components**

---

## 📝 Notes

**File Details:**
- Path: src/types/database.ts
- Size: _____ KB
- Tables included: _____ of 22

**TypeScript Status:**
- Compilation: ✅ / ❌
- Autocomplete: ✅ / ❌

**Issues Found:**
-

**Time Spent:** _____ minutes

**Completed By:** ___________________
**Date:** ___________________
