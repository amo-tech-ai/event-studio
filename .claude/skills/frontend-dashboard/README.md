# Building Frontend Dashboards

Expert skill for building React dashboards in the event-studio project.

## Purpose

Build responsive, production-ready React dashboards using the event-studio tech stack: TypeScript, shadcn/ui, TanStack Query, and Supabase.

## When to Use

Invoke this skill when:
- Creating dashboard pages
- Building admin interfaces
- Implementing data tables with actions
- Adding charts and analytics
- Creating metric/KPI cards
- Building event management UIs
- Developing booking interfaces
- Creating financial overviews

**Trigger words**: dashboard, metrics, KPI, data table, charts, analytics, admin panel, Recharts, event management, bookings, financials

## Usage

```bash
/skill frontend-dashboard
```

Then describe what you want:
- "Create a dashboard page showing all events with metrics"
- "Add a revenue analytics page with charts"
- "Build a bookings management interface with filters"

## What This Skill Provides

### 1. **Concise, Project-Specific Guidance**
- Focused on event-studio tech stack
- Assumes you know React/TypeScript/TanStack Query
- Only provides project-specific patterns

### 2. **Step-by-Step Workflows**
- Checklist format for tracking progress
- Clear, sequential steps
- Validation at each stage

### 3. **Quick Reference Patterns**
- Supabase query examples
- Component usage snippets
- Common layout patterns

### 4. **Concrete Examples**
- Input: User request
- Output: Exact implementation steps
- Three real-world examples

## Tech Stack Integration

**Event-Studio Specific**:
- React 18 + TypeScript + Vite
- shadcn/ui (Radix UI primitives)
- TanStack Query for data
- Supabase backend
- Zustand state management
- React Hook Form + Zod
- Lucide React icons
- Recharts for charts

## Resources Included

### Core SKILL.md (~290 lines)
- Project context
- Standard workflow with checklist
- Quick reference patterns
- 3 concrete examples
- Best practices
- Troubleshooting

### resources/component-patterns.tsx
Complete, production-ready components:
- **MetricCard** - KPI cards with trend indicators
- **StatsGrid** - 4-column metrics layout
- **DataTable** - Generic data table with actions
- **StatusBadge** - Status indicators
- **EmptyState** - No data states
- **ErrorAlert** - Error handling with retry
- **PageLoader**, **TableSkeleton** - Loading states
- **SectionHeader** - Page section headers

**Usage**: Import and use directly in your pages.

### resources/query-patterns.ts
TanStack Query patterns:
- Basic queries (useEvents, useEvent)
- Dashboard metrics (useDashboardMetrics)
- Revenue analytics (useRevenueAnalytics)
- CRUD mutations (create, update, delete)
- Infinite scroll (useInfiniteEvents)
- Dependent queries
- Parallel queries
- Real-time (polling)
- Prefetching

**Usage**: Copy patterns or use as reference.

### resources/supabase-patterns.ts
Comprehensive Supabase examples:
- CRUD operations
- Filters (eq, gte, lte, ilike, in, or)
- Joins and relationships
- Aggregations (count, sum, group by)
- Pagination and ordering
- Real-time subscriptions
- File storage operations
- Authentication helpers
- Complex queries

**Usage**: Reference for Supabase queries.

### resources/layout-examples.tsx
7 complete dashboard layouts:
1. **StandardDashboardLayout** - Sidebar + content area
2. **DashboardWithActionsBar** - Search, filters, actions
3. **TabbedDashboard** - Multi-tab analytics
4. **SplitViewDashboard** - List + detail panels
5. **GridViewDashboard** - Grid/list toggle view
6. **ResponsiveDashboard** - Mobile-first design
7. **StickyHeaderDashboard** - Fixed header scroll

**Usage**: Use as templates for your pages.

## Standard Workflow

**The skill provides this checklist**:

```
Dashboard Implementation:
- [ ] 1. Identify data requirements (tables, metrics)
- [ ] 2. Create custom hook in features/[feature]/hooks/
- [ ] 3. Build page in src/pages/Dashboard*.tsx
- [ ] 4. Add metric cards and main content
- [ ] 5. Add route in App.tsx
- [ ] 6. Test loading/error states
```

Each step has detailed guidance in SKILL.md.

## Example Outputs

### Example 1: Events Dashboard

**Input**: "Create a dashboard page showing all events with metrics"

**Output**:
1. Creates `src/features/events/hooks/useEventsDashboard.ts`
2. Creates `src/pages/DashboardEvents.tsx` with:
   - Header with "Create Event" button
   - 4 metric cards (total, active, revenue, bookings)
   - Search and filters
   - DataTable with actions
3. Adds route to `App.tsx`

### Example 2: Analytics Dashboard

**Input**: "Add a revenue analytics page with charts"

**Output**:
1. Creates `useRevenueAnalytics` hook
2. Creates page with:
   - Revenue metric cards
   - Line chart (Recharts) - revenue over time
   - Pie chart - revenue by category
   - Date range filter

### Example 3: Bookings Management

**Input**: "Create a bookings dashboard with search and filters"

**Output**:
- Search by attendee name
- Filter by status dropdown
- DataTable with booking details
- Actions: view, refund, email
- Export to CSV button

## Best Practices Compliance

This skill follows official Agent Skills best practices:

✅ **Concise**: 290 lines (well under 500 limit)
✅ **Assumes Claude is smart**: No over-explanations
✅ **Progressive disclosure**: Core in SKILL.md, details in resources
✅ **Workflow checklists**: Copy-paste checkboxes for tracking
✅ **Concrete examples**: Input/output pairs
✅ **Specific description**: Includes trigger keywords
✅ **One-level references**: All resources link from SKILL.md
✅ **Third-person description**: Professional voice
✅ **Gerund naming**: "Building Frontend Dashboards"
✅ **Forward slashes**: Unix-style paths

## Quick Start

### 1. Simple Dashboard
```typescript
const Dashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['data'],
    queryFn: async () => {
      const { data } = await supabase.from('table').select('*');
      return data;
    },
  });

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        {isLoading ? <PageLoader /> : <Card>Content</Card>}
      </main>
    </div>
  );
};
```

### 2. With Metrics
```typescript
import { MetricCard } from '.claude/skills/frontend-dashboard/resources/component-patterns';

<div className="grid grid-cols-4 gap-6">
  <MetricCard title="Total Events" value={42} icon={<Calendar />} />
</div>
```

### 3. With Table
```typescript
import { DataTable } from '.claude/skills/frontend-dashboard/resources/component-patterns';

<DataTable
  data={events}
  columns={[
    { key: 'title', label: 'Event' },
    { key: 'date', label: 'Date' },
  ]}
  onEdit={(event) => navigate(`/edit/${event.id}`)}
/>
```

## File Structure

```
.claude/skills/frontend-dashboard/
├── SKILL.md                          # Main skill (290 lines)
├── resources/
│   ├── component-patterns.tsx        # Reusable components
│   ├── query-patterns.ts            # TanStack Query patterns
│   ├── supabase-patterns.ts         # Supabase examples
│   └── layout-examples.tsx          # 7 dashboard layouts
└── README.md                         # This file
```

## Maintenance

- **Last updated**: 2025-01-18
- **Format**: Official Agent Skills best practices
- **Compatible with**: React 18, TypeScript 5, Vite 5
- **Project**: event-studio (EventOS)
- **Status**: Production-ready

## Related Skills

- `db-schema-analyzer` - Analyze database before building dashboards
- Future: `form-builder` - Build CRUD forms
- Future: `api-integration` - External API patterns

## Tips

- Use the workflow checklist every time
- Reference resource files instead of duplicating code
- Test responsive design in browser dev tools
- Always handle loading and error states
- Validate RLS policies before querying Supabase

---

**Need help?** Invoke the skill and describe what you want to build!
