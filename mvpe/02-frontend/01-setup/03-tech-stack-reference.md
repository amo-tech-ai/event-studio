# EventOS CRM - Page Designs

**Version:** 1.0  
**Date:** October 2025  
**Status:** Design Specification

---

## 📐 Design System

**Layout:** Sidebar navigation with collapsible menu  
**Components:** shadcn/ui library  
**Theme:** Extends EventOS design tokens  
**Responsive:** Mobile-first approach

---

## 🏠 Page 1: CRM Dashboard (`/crm/dashboard`)

### Purpose
Executive overview of CRM performance with key metrics, pipeline visualization, and recent activities.

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│ Header: CRM Dashboard                    [Filter] [Export]  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐         │
│ │ Total Clients│ │ Active Deals │ │ Revenue MTD  │         │
│ │     156      │ │      42      │ │   $125,000   │         │
│ │  +12% ↑     │ │   +8% ↑     │ │  +15% ↑     │         │
│ └──────────────┘ └──────────────┘ └──────────────┘         │
│                                                               │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ Pipeline Overview                                      │  │
│ │                                                        │  │
│ │  Lead (12)    Qualified (18)   Proposal (8)  Won (4)  │  │
│ │  ████████     ████████████████  ██████       ███      │  │
│ │                                                        │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                               │
│ ┌───────────────────┐  ┌──────────────────────────────┐    │
│ │ Revenue Forecast  │  │ Recent Activities            │    │
│ │                   │  │                              │    │
│ │  [Line Chart]     │  │ • Call with Tech Corp...     │    │
│ │                   │  │ • Proposal sent to...        │    │
│ │                   │  │ • Meeting scheduled...       │    │
│ └───────────────────┘  └──────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Component Breakdown

**Metric Cards** (StatCard component)
```typescript
interface MetricCardProps {
  title: string;
  value: string | number;
  change: number; // percentage
  trend: 'up' | 'down';
  icon: LucideIcon;
}
```

**Pipeline Chart** (PipelineChart component)
- Horizontal bar chart
- Interactive stage selection
- Shows count and total value per stage
- Click to filter opportunities

**Activity Feed** (ActivityTimeline component)
- Latest 10 activities
- Grouped by date
- Quick action buttons (call, email)
- Link to full activity log

### Data Requirements

```typescript
// Dashboard data structure
interface DashboardData {
  metrics: {
    totalClients: number;
    clientsChange: number;
    activeDeals: number;
    dealsChange: number;
    revenue: number;
    revenueChange: number;
  };
  pipeline: {
    stageId: string;
    stageName: string;
    count: number;
    value: number;
  }[];
  recentActivities: Activity[];
  forecast: {
    month: string;
    projected: number;
    actual: number;
  }[];
}
```

### Implementation Notes

- Auto-refresh every 30 seconds
- Export to PDF functionality
- Date range filter (today, week, month, quarter, year)
- Real-time updates via Supabase subscriptions

---

## 👥 Page 2: Organizer List (`/crm/organizers`)

### Purpose
Browse, search, and filter all client organizations with quick actions.

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│ Organizers                                    [+ New Client] │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│ [Search...]  [Industry ▼]  [Status ▼]  [Assigned ▼]        │
│                                                               │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Acme Corp                              Active  $50K LTV  │ │
│ │ Technology • Toronto • 150 employees                    │ │
│ │ 5 events • Last contact: 2 days ago                     │ │
│ │ [View] [Email] [Call]                                   │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Global Events Inc                          Active  $35K  │ │
│ │ Events • Vancouver • 80 employees                       │ │
│ │ 3 events • Last contact: 1 week ago                     │ │
│ │ [View] [Email] [Call]                                   │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Tech Innovators                         Prospect  $0    │ │
│ │ Technology • Montreal • 200 employees                   │ │
│ │ 0 events • Last contact: Never                          │ │
│ │ [View] [Email] [Call]                                   │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                               │
│ Showing 1-20 of 156                    [1] 2 3 4 ... [Next] │
└─────────────────────────────────────────────────────────────┘
```

### Component Breakdown

**Search & Filters** (OrganizerFilters component)
```typescript
interface FilterState {
  search: string;
  industry: string[];
  status: string[];
  assignedTo: string[];
  healthScore: { min: number; max: number };
}
```

**Organizer Card** (OrganizerCard component)
```typescript
interface OrganizerCardProps {
  organizer: {
    id: string;
    companyName: string;
    industry: string;
    location: string;
    employees: number;
    status: string;
    lifetimeValue: number;
    eventCount: number;
    lastContactDate: Date;
    engagementScore: number;
  };
  onView: (id: string) => void;
  onEmail: (id: string) => void;
  onCall: (id: string) => void;
}
```

### Features

- **Bulk Actions:** Select multiple organizers for mass email/assignment
- **Sorting:** By name, LTV, last contact, engagement score
- **Views:** List view (default), Kanban view, Map view
- **Export:** Export filtered list to CSV
- **Quick Add:** Modal for fast organizer creation

### Data Loading

```typescript
// Query with filters and pagination
const { data, isLoading } = useQuery({
  queryKey: ['organizers', filters, page],
  queryFn: async () => {
    let query = supabase
      .from('crm_organizers')
      .select('*, contacts:crm_contacts(count)')
      .order('updated_at', { ascending: false })
      .range(page * 20, (page + 1) * 20 - 1);
    
    if (filters.search) {
      query = query.ilike('company_name', `%${filters.search}%`);
    }
    
    if (filters.industry.length > 0) {
      query = query.in('industry', filters.industry);
    }
    
    return query;
  }
});
```

---

## 📊 Page 3: Organizer Detail (`/crm/organizers/:id`)

### Purpose
Comprehensive view of a single client organization with all related data.

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│ ← Back to Organizers                            [Edit] [...]│
├─────────────────────────────────────────────────────────────┤
│                                                               │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ Acme Corporation                                       │  │
│ │ Technology • Toronto, ON                               │  │
│ │ ★★★★☆ Engagement: 85/100  Health: 90/100              │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                               │
│ [Overview] [Contacts] [Opportunities] [Events] [Activity]   │
│                                                               │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ OVERVIEW TAB                                           │  │
│ │                                                         │  │
│ │ Company Details              Quick Stats               │  │
│ │ • Industry: Technology       • LTV: $50,000           │  │
│ │ • Size: 150 employees        • Events: 5              │  │
│ │ • Website: acme.com          • Active Deals: 2        │  │
│ │ • Since: Jan 2024            • Avg Event: $10K        │  │
│ │                                                         │  │
│ │ Primary Contact              Next Actions              │  │
│ │ John Smith                   • Follow up on proposal   │  │
│ │ CEO                          • Schedule Q2 planning    │  │
│ │ john@acme.com                • Send case study        │  │
│ │ (416) 555-0100                                         │  │
│ └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Tabs Structure

**1. Overview Tab**
- Company information
- Key metrics and statistics
- Primary contact details
- AI-generated next actions
- Recent notes

**2. Contacts Tab**
```
┌────────────────────────────────────────────┐
│ Contacts (4)                  [+ Add Contact]│
├────────────────────────────────────────────┤
│ John Smith • CEO • Primary                 │
│ john@acme.com • (416) 555-0100            │
│ [Edit] [Email] [Call]                      │
├────────────────────────────────────────────┤
│ Sarah Johnson • VP Events                  │
│ sarah@acme.com • (416) 555-0101           │
│ [Edit] [Email] [Call]                      │
└────────────────────────────────────────────┘
```

**3. Opportunities Tab**
```
┌────────────────────────────────────────────┐
│ Opportunities (2)           [+ New Deal]   │
├────────────────────────────────────────────┤
│ Tech Summit 2025                           │
│ $25,000 • Proposal • 75% probability       │
│ Expected close: Mar 15, 2025               │
├────────────────────────────────────────────┤
│ Annual Gala                                │
│ $35,000 • Negotiation • 90% probability    │
│ Expected close: Apr 1, 2025                │
└────────────────────────────────────────────┘
```

**4. Events Tab**
- List of all past and upcoming events
- Event performance metrics
- Quick link to event details

**5. Activity Tab**
- Timeline of all interactions
- Filter by type (calls, emails, meetings, notes)
- Log new activity
- Upcoming tasks

### Component Architecture

```typescript
// Main detail page
const OrganizerDetailPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  
  const { data: organizer, isLoading } = useQuery({
    queryKey: ['organizer', id],
    queryFn: () => fetchOrganizerWithRelations(id)
  });
  
  return (
    <WizardLayout maxWidth="2xl">
      <OrganizerHeader organizer={organizer} />
      <TabNavigation active={activeTab} onChange={setActiveTab} />
      
      {activeTab === 'overview' && <OverviewTab organizer={organizer} />}
      {activeTab === 'contacts' && <ContactsTab organizerId={id} />}
      {activeTab === 'opportunities' && <OpportunitiesTab organizerId={id} />}
      {activeTab === 'events' && <EventsTab organizerId={id} />}
      {activeTab === 'activity' && <ActivityTab organizerId={id} />}
    </WizardLayout>
  );
};
```

---

## 🎯 Page 4: Pipeline Board (`/crm/pipeline`)

### Purpose
Kanban-style visual pipeline for managing opportunities through sales stages.

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│ Sales Pipeline                      [Filter] [+ New Deal]   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│ Lead (12)  Qualified (18)  Proposal (8)  Negotiation (5)    │
│ $48K       $180K           $200K         $175K              │
│ ┌────────┐ ┌────────┐     ┌────────┐    ┌────────┐        │
│ │Acme    │ │TechCo  │     │Global  │    │Events  │        │
│ │$15K    │ │$25K    │     │$50K    │    │$35K    │        │
│ │Mar 15  │ │Mar 20  │     │Apr 1   │    │Mar 10  │        │
│ └────────┘ └────────┘     └────────┘    └────────┘        │
│ ┌────────┐ ┌────────┐     ┌────────┐    ┌────────┐        │
│ │Start   │ │Innov   │     │Summit  │    │Corp    │        │
│ │$8K     │ │$15K    │     │$40K    │    │$28K    │        │
│ │Apr 5   │ │Mar 18  │     │Mar 25  │    │Mar 12  │        │
│ └────────┘ └────────┘     └────────┘    └────────┘        │
│            ┌────────┐                                       │
│            │Future  │                                       │
│            │$12K    │                                       │
│            │Apr 10  │                                       │
│            └────────┘                                       │
└─────────────────────────────────────────────────────────────┘
```

### Features

**Drag & Drop**
- Move opportunities between stages
- Auto-update probability
- Log stage change activity
- Trigger automation workflows

**Opportunity Card** (OpportunityCard component)
```typescript
interface OpportunityCardProps {
  opportunity: {
    id: string;
    name: string;
    value: number;
    organizerName: string;
    expectedCloseDate: Date;
    probability: number;
    assignedTo: User;
  };
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
}
```

**Stage Column** (PipelineStage component)
```typescript
interface PipelineStageProps {
  stage: {
    id: string;
    name: string;
    color: string;
    opportunities: Opportunity[];
  };
  onDrop: (opportunityId: string, stageId: string) => void;
}
```

### Implementation

```typescript
// Pipeline page with drag-drop
const PipelinePage = () => {
  const { data: stages } = useQuery(['pipeline-stages'], fetchStages);
  const { data: opportunities } = useQuery(['opportunities'], fetchOpportunities);
  
  const moveMutation = useMutation({
    mutationFn: async ({ oppId, stageId }) => {
      await supabase
        .from('crm_opportunities')
        .update({ 
          stage_id: stageId,
          last_stage_change_at: new Date()
        })
        .eq('id', oppId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['opportunities']);
    }
  });
  
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto">
        {stages?.map(stage => (
          <PipelineStage
            key={stage.id}
            stage={stage}
            opportunities={opportunities?.filter(o => o.stage_id === stage.id)}
          />
        ))}
      </div>
    </DndContext>
  );
};
```

---

## 📈 Page 5: Reports & Analytics (`/crm/reports`)

### Purpose
Data visualization and reporting for CRM performance analysis.

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│ CRM Reports                            [Date Range] [Export] │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│ [Sales Performance] [Pipeline Analysis] [Team Performance]   │
│                                                               │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ Revenue Trend                                          │  │
│ │                                                         │  │
│ │  [Line Chart showing monthly revenue]                  │  │
│ │                                                         │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                               │
│ ┌─────────────────────┐  ┌────────────────────────────┐    │
│ │ Conversion Rates    │  │ Average Deal Size          │    │
│ │                     │  │                            │    │
│ │ [Funnel Chart]      │  │ [Bar Chart]                │    │
│ │                     │  │                            │    │
│ └─────────────────────┘  └────────────────────────────┘    │
│                                                               │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ Top Performers                                         │  │
│ │ 1. Sarah Chen      - $250K closed  - 15 deals          │  │
│ │ 2. Mike Johnson    - $180K closed  - 12 deals          │  │
│ │ 3. Lisa Wong       - $150K closed  - 10 deals          │  │
│ └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Report Types

**1. Sales Performance**
- Revenue trends (daily, weekly, monthly, quarterly)
- Win rate analysis
- Average deal size
- Sales cycle length
- Revenue by industry/region

**2. Pipeline Analysis**
- Pipeline velocity
- Conversion rates by stage
- Stuck deals (>30 days in stage)
- Forecasted revenue
- Pipeline coverage ratio

**3. Team Performance**
- Individual performance metrics
- Activity volume (calls, emails, meetings)
- Response times
- Client satisfaction scores
- Goal achievement

### Chart Components

```typescript
// Revenue trend chart
const RevenueTrendChart = ({ data, timeRange }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
        <Line 
          type="monotone" 
          dataKey="revenue" 
          stroke="hsl(var(--primary))" 
          strokeWidth={2}
        />
        <Line 
          type="monotone" 
          dataKey="forecast" 
          stroke="hsl(var(--muted-foreground))" 
          strokeDasharray="5 5"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
```

---

## 🎨 Design Tokens

### CRM-Specific Colors

```css
/* Add to index.css */
:root {
  /* Pipeline stages */
  --crm-lead: 107 114 128; /* gray */
  --crm-qualified: 59 130 246; /* blue */
  --crm-proposal: 139 92 246; /* purple */
  --crm-negotiation: 245 158 11; /* amber */
  --crm-won: 16 185 129; /* green */
  --crm-lost: 239 68 68; /* red */
  
  /* Health scores */
  --crm-health-high: 16 185 129; /* green */
  --crm-health-medium: 245 158 11; /* amber */
  --crm-health-low: 239 68 68; /* red */
}
```

### Typography

```typescript
// CRM page headings
<h1 className="text-h1 font-heading font-bold text-foreground">
<h2 className="text-h2 font-heading font-semibold text-foreground">
<h3 className="text-h3 font-heading font-medium text-foreground">

// Metric values
<span className="text-4xl font-bold text-foreground">

// Secondary text
<p className="text-body text-muted-foreground">
```

---

## 📱 Mobile Responsiveness

### Breakpoint Strategy

```typescript
// Mobile (<768px): Single column, collapsed sidebar
// Tablet (768px-1024px): Two columns, mini sidebar
// Desktop (>1024px): Full layout with sidebar

// Example responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

### Mobile Navigation

- Bottom tab bar for main sections
- Swipe gestures for pipeline stages
- Pull-to-refresh for lists
- Floating action button for quick add

---

**Last Updated:** October 2025  
**Next Steps:** Build components and integrate with database
