# 🎨 EventOS MVP Frontend Implementation Plan

**Document:** Frontend Architecture & Implementation Plan
**Version:** 1.0
**Date:** 2025-10-17
**Database Tables:** 25 tables
**Target:** 4-week MVP launch

---

## 📋 Overview

This document outlines the complete frontend implementation for EventOS MVP, mapping all 25 database tables to user-facing pages, components, and workflows.

### Tech Stack

**Framework:** Next.js 14 (App Router)
**UI Library:** React 18
**Styling:** Tailwind CSS + shadcn/ui components
**State Management:** React Query (TanStack Query)
**Forms:** React Hook Form + Zod validation
**Database Client:** Supabase JavaScript Client
**Auth:** Supabase Auth
**Payments:** Stripe Elements + Stripe Checkout

---

## 🎯 User Roles & Access

### 1. **Public Users** (No Auth)
- Browse public events
- View event details
- Purchase tickets
- Register as guest

### 2. **Attendees** (Authenticated)
- View purchased tickets
- Manage profile
- Access event materials

### 3. **Organizers** (Authenticated)
- Create/manage events
- Manage tickets & pricing
- Track sales & analytics
- Manage attendees
- CRM & contacts
- Settings & configuration

---

## 📱 Application Structure

```
/app
├── (public)
│   ├── page.tsx                    # Homepage
│   ├── events/
│   │   ├── page.tsx               # Event listing
│   │   └── [slug]/
│   │       ├── page.tsx           # Event details
│   │       └── checkout/
│   │           └── page.tsx       # Ticket checkout
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── callback/page.tsx
│   └── success/page.tsx            # Order confirmation
│
├── (attendee)
│   └── my-tickets/
│       └── page.tsx                # Attendee dashboard
│
└── (organizer)
    └── dashboard/
        ├── page.tsx                # Dashboard home
        ├── events/
        │   ├── page.tsx           # Events list
        │   ├── new/page.tsx       # Create event
        │   └── [id]/
        │       ├── page.tsx       # Event overview
        │       ├── edit/page.tsx  # Edit event
        │       ├── tickets/page.tsx        # Manage tickets
        │       ├── orders/page.tsx         # View orders
        │       ├── attendees/page.tsx      # Attendee list
        │       ├── promo-codes/page.tsx    # Discount codes
        │       ├── questions/page.tsx      # Custom forms
        │       ├── settings/page.tsx       # Event settings
        │       └── analytics/page.tsx      # Stats
        ├── contacts/
        │   ├── page.tsx           # CRM contacts list
        │   └── [id]/page.tsx      # Contact details
        ├── companies/
        │   ├── page.tsx           # Companies list
        │   └── [id]/page.tsx      # Company details
        ├── venues/page.tsx         # Venues management
        ├── vendors/page.tsx        # Vendors management
        ├── tasks/page.tsx          # Task management
        └── settings/
            ├── profile/page.tsx    # Organizer profile
            ├── taxes/page.tsx      # Tax & fees config
            └── billing/page.tsx    # Stripe setup
```

---

## 🏗️ Implementation by Database Table

### **Identity Tables (3 tables)**

#### 1. **users** - Authentication & Profile
**Pages:**
- `/auth/login` - Login page
- `/auth/signup` - Registration page
- `/dashboard/settings/profile` - Profile management

**Components:**
```tsx
// components/auth/LoginForm.tsx
- Email/password input
- Social OAuth buttons (Google)
- Remember me checkbox
- Forgot password link

// components/auth/SignupForm.tsx
- Full name, email, password
- Terms acceptance checkbox
- Role selection (organizer/attendee)

// components/profile/ProfileSettings.tsx
- Update name, email, phone
- Change password
- Timezone selection
- Avatar upload
```

**Key Features:**
- Supabase Auth integration
- Email verification flow
- Password reset flow
- Session management

---

#### 2. **organizers** - Organizer Profile
**Pages:**
- `/dashboard/settings/profile` - Organizer setup
- `/onboarding` - First-time setup wizard

**Components:**
```tsx
// components/organizer/OrganizerProfileForm.tsx
- Organization name
- Organization type (company/nonprofit/individual)
- Website, description
- Stripe Connect setup button
- Verification status badge

// components/organizer/StripeConnectButton.tsx
- Connect Stripe account
- View connection status
- Reconnect if disconnected
```

**Key Features:**
- Stripe Connect onboarding
- Organization verification
- Multi-currency support

---

#### 3. **attendees** - Attendee Management
**Pages:**
- `/dashboard/events/[id]/attendees` - Attendee list
- `/my-tickets` - Attendee view

**Components:**
```tsx
// components/attendees/AttendeeList.tsx
- Searchable attendee table
- Filter by ticket type, status
- Export to CSV
- Check-in status indicators

// components/attendees/AttendeeDetails.tsx
- Personal information
- Tickets purchased
- Check-in history
- Custom question answers
- Order history
```

**Key Features:**
- Search & filter
- Bulk actions
- Export capabilities
- Check-in tracking

---

### **CRM Tables (4 tables)**

#### 4. **contacts** - Customer Database
**Pages:**
- `/dashboard/contacts` - Contact list
- `/dashboard/contacts/[id]` - Contact details
- `/dashboard/contacts/new` - Add contact

**Components:**
```tsx
// components/crm/ContactList.tsx
- Searchable contact table
- Filter by lead status, tags, engagement
- Bulk tagging
- Import/export

// components/crm/ContactCard.tsx
- Contact header with avatar
- Quick stats (events attended, lifetime value)
- Engagement score visualization
- Tags display

// components/crm/ContactForm.tsx
- Personal info fields
- Company association dropdown
- Lead source & status
- Tags input (multi-select)
- Custom notes

// components/crm/ContactTimeline.tsx
- Activity feed (interactions, events attended)
- Add interaction button
- Filter by type
```

**Key Features:**
- Full-text search
- Lead status tracking
- Engagement scoring
- Tag-based segmentation
- Activity timeline

---

#### 5. **companies** - Business Accounts
**Pages:**
- `/dashboard/companies` - Company list
- `/dashboard/companies/[id]` - Company details
- `/dashboard/companies/new` - Add company

**Components:**
```tsx
// components/crm/CompanyList.tsx
- Company table with revenue sorting
- Filter by industry, size, account type
- Account priority badges

// components/crm/CompanyCard.tsx
- Company logo
- Industry & size badges
- Total revenue & events
- Contact list
- Account priority selector

// components/crm/CompanyForm.tsx
- Company name, website, industry
- Size & revenue selectors
- Account type & priority
- Location fields
```

**Key Features:**
- B2B account management
- Contact relationships
- Revenue tracking
- Industry filtering

---

#### 6. **interactions** - Communication History
**Pages:**
- Embedded in contact/company detail pages

**Components:**
```tsx
// components/crm/InteractionsList.tsx
- Chronological interaction feed
- Filter by type (email, phone, meeting)
- Add interaction button

// components/crm/AddInteractionModal.tsx
- Interaction type selector
- Subject & content fields
- Outcome selection
- Next action date picker
- Duration input (for calls/meetings)

// components/crm/InteractionCard.tsx
- Type icon
- Subject/summary
- Timestamp
- Outcome badge
- Next action alert
```

**Key Features:**
- Multi-channel tracking
- Follow-up reminders
- Sentiment analysis
- Activity logging

---

#### 7. **notes** - Quick Notes
**Pages:**
- Embedded in contact/company/event pages

**Components:**
```tsx
// components/crm/NotesList.tsx
- Note cards with timestamps
- Filter by type
- Pin important notes
- Private/public toggle

// components/crm/AddNoteButton.tsx
- Quick note textarea
- Type selector
- Privacy toggle
- Tag input

// components/crm/NoteCard.tsx
- Note content with markdown
- Created by user avatar
- Edit/delete actions
- Pin indicator
```

**Key Features:**
- Markdown support
- Privacy controls
- Pinned notes
- Full-text search

---

### **Event Tables (3 tables)**

#### 8. **venues** - Venue Management
**Pages:**
- `/dashboard/venues` - Venue list
- Modal for add/edit

**Components:**
```tsx
// components/venues/VenueList.tsx
- Venue cards with images
- Filter by type (physical/virtual/hybrid)
- Capacity indicators

// components/venues/VenueForm.tsx
- Venue name & type selector
- Address fields (autocomplete)
- Capacity input
- Virtual URL (for online events)
- Amenities multi-select
- Image upload
```

**Key Features:**
- Address autocomplete
- Capacity tracking
- Virtual/hybrid support
- Amenities management

---

#### 9. **events** - Main Event Management
**Pages:**
- `/dashboard/events` - Events list
- `/dashboard/events/new` - Create event wizard
- `/dashboard/events/[id]` - Event dashboard
- `/dashboard/events/[id]/edit` - Edit event
- `/events` - Public listing
- `/events/[slug]` - Public event page

**Components:**
```tsx
// Public Components
// components/events/EventCard.tsx
- Event cover image
- Title, date, location
- Price range
- Tickets remaining badge
- CTA button

// components/events/EventHero.tsx
- Cover image background
- Event title & description
- Date, time, location
- Organizer info
- Social share buttons

// components/events/EventDetails.tsx
- Tabs (About, Schedule, Location, FAQ)
- Rich text description
- Sessions/schedule display
- Venue map
- Organizer contact

// Organizer Components
// components/events/CreateEventWizard.tsx
- Multi-step form
  - Step 1: Basic info (title, description, category)
  - Step 2: Date & location
  - Step 3: Venue selection
  - Step 4: Cover image
  - Step 5: Review & publish

// components/events/EventDashboard.tsx
- Key metrics cards (sales, revenue, capacity)
- Recent orders list
- Sales chart
- Quick actions

// components/events/EventForm.tsx
- All event fields
- Rich text editor for description
- Date/time pickers with timezone
- Venue dropdown
- Category selector
- Status selector
- Visibility controls
```

**Key Features:**
- Multi-step event creation
- Rich text editing
- Image upload
- Status management
- SEO optimization
- Social sharing

---

#### 10. **event_sessions** - Session/Schedule
**Pages:**
- Embedded in event details page
- `/dashboard/events/[id]/schedule` - Manage schedule

**Components:**
```tsx
// components/events/SessionsList.tsx
- Timeline view of sessions
- Drag to reorder
- Add session button

// components/events/SessionForm.tsx
- Session title & description
- Type selector (keynote, workshop, panel)
- Start/end time pickers
- Location within venue
- Capacity limit
- Speaker info (JSONB)

// components/events/SessionCard.tsx
- Session details
- Time & location
- Speaker avatars
- Capacity indicator
```

**Key Features:**
- Timeline visualization
- Drag-and-drop scheduling
- Multi-track support
- Speaker management

---

### **Ticketing Tables (3 tables)**

#### 11. **ticket_tiers** - Ticket Management
**Pages:**
- `/dashboard/events/[id]/tickets` - Manage tickets

**Components:**
```tsx
// components/tickets/TicketTierList.tsx
- Ticket tier cards
- Drag to reorder
- Add tier button
- Quick stats (sold/available)

// components/tickets/TicketTierForm.tsx
- Ticket name & description
- Price input with currency
- Quantity fields
- Sale start/end dates
- Min/max per order
- Tier type selector

// components/tickets/TicketTierCard.tsx
- Tier name & price
- Sold vs. available progress bar
- Sale period indicators
- Edit/delete actions
```

**Key Features:**
- Multiple pricing tiers
- Time-based sales
- Quantity limits
- Order limits

---

#### 12. **orders** - Order Management
**Pages:**
- `/dashboard/events/[id]/orders` - Orders list
- `/dashboard/events/[id]/orders/[id]` - Order details

**Components:**
```tsx
// components/orders/OrderList.tsx
- Searchable order table
- Filter by status, date
- Export to CSV
- Refund actions

// components/orders/OrderDetails.tsx
- Order summary
- Line items
- Customer details
- Payment info
- Refund button
- Resend confirmation

// components/orders/OrderStatusBadge.tsx
- Color-coded status
- Tooltip with details
```

**Key Features:**
- Order search & filter
- Refund processing
- Email resend
- Export capabilities

---

#### 13. **order_items** - Order Line Items
**Pages:**
- Embedded in order details

**Components:**
```tsx
// components/orders/OrderItemsList.tsx
- Line item table
- Ticket type, quantity, price
- Attendee names
- Ticket codes (QR)

// components/orders/TicketQRCode.tsx
- QR code display
- Download ticket button
- Check-in status
```

**Key Features:**
- QR code generation
- Ticket downloads
- Check-in tracking

---

### **Marketing Tables (1 table)**

#### 14. **promo_codes** - Discount Codes
**Pages:**
- `/dashboard/events/[id]/promo-codes` - Manage promo codes

**Components:**
```tsx
// components/marketing/PromoCodeList.tsx
- Promo code table
- Filter by status, expiry
- Usage stats
- Quick enable/disable toggle

// components/marketing/PromoCodeForm.tsx
- Code input (auto-generate option)
- Discount type selector (%, fixed)
- Discount value input
- Applicable tickets multi-select
- Usage limits
- Date range picker
- Active toggle

// components/marketing/PromoCodeStats.tsx
- Times used
- Total discount given
- Revenue impact
- Top users

// Public Component
// components/checkout/PromoCodeInput.tsx
- Code input field
- Apply button
- Validation feedback
- Discount display
```

**Key Features:**
- Code generation
- Usage tracking
- Multi-ticket application
- Time-based validity
- Customer limits

---

### **Configuration Tables (2 tables)**

#### 15. **event_settings** - Event Configuration
**Pages:**
- `/dashboard/events/[id]/settings` - Event settings

**Components:**
```tsx
// components/events/EventSettingsForm.tsx
- Tabs (Checkout, Email, SEO, Branding, Features)

// Tab 1: Checkout Settings
- Pre-checkout message (rich text)
- Post-checkout message (rich text)
- Continue button text
- Order timeout slider

// Tab 2: Email Settings
- Email footer message
- Support email
- Notification toggles

// Tab 3: SEO
- SEO title, description, keywords
- Search engine indexing toggle
- Social media handles (JSON)

// Tab 4: Branding
- Color pickers (primary, secondary)
- Cover image position
- Logo upload

// Tab 5: Features
- Show remaining tickets toggle
- Online event details (if applicable)
- Organizer notification toggle
```

**Key Features:**
- Per-event customization
- Rich text editing
- Color customization
- SEO optimization
- Feature toggles

---

#### 16. **taxes_and_fees** - Tax Configuration
**Pages:**
- `/dashboard/settings/taxes` - Tax & fee management

**Components:**
```tsx
// components/settings/TaxesAndFeesList.tsx
- Tax/fee table
- Filter by type (tax/fee)
- Active/inactive toggle
- Set as default action

// components/settings/TaxFeeForm.tsx
- Name input
- Type selector (tax/fee)
- Calculation type (percentage/fixed)
- Rate input
- Applies to selector
- Regional rules (JSONB)
- Active toggle
```

**Key Features:**
- Multiple tax rules
- Regional application
- Percentage or fixed
- Default rules

---

### **Forms Tables (2 tables)**

#### 17. **questions** - Custom Questions
**Pages:**
- `/dashboard/events/[id]/questions` - Manage questions

**Components:**
```tsx
// components/forms/QuestionList.tsx
- Draggable question list
- Add question button
- Preview toggle

// components/forms/QuestionForm.tsx
- Question title & description
- Type selector (text, select, checkbox, etc.)
- Options builder (for select/radio)
- Required toggle
- Belongs to selector (order/attendee)
- Hidden toggle

// components/forms/QuestionPreview.tsx
- Live preview of question
- Shows how attendees will see it
```

**Key Features:**
- Drag-and-drop ordering
- Multiple question types
- Conditional visibility
- Live preview

---

#### 18. **question_answers** - Form Responses
**Pages:**
- Embedded in attendee/order details

**Components:**
```tsx
// components/forms/AnswersList.tsx
- Question-answer pairs
- Export to CSV

// components/forms/AnswerCard.tsx
- Question text
- Answer display (formatted by type)
- Timestamp
```

**Key Features:**
- Answer display
- Export capabilities
- Search & filter

---

### **Finance Tables (3 tables)**

#### 19. **order_refunds** - Refund Management
**Pages:**
- Embedded in order details
- `/dashboard/events/[id]/refunds` - Refunds list

**Components:**
```tsx
// components/refunds/ProcessRefundModal.tsx
- Refund amount input (pre-filled with order total)
- Refund type selector (full/partial)
- Reason selector
- Notes textarea
- Confirm button

// components/refunds/RefundList.tsx
- Refund table
- Filter by status
- Total refunded stats

// components/refunds/RefundStatusBadge.tsx
- Status indicator
- Provider refund ID
- Timestamp
```

**Key Features:**
- Full/partial refunds
- Stripe integration
- Reason tracking
- Status monitoring

---

#### 20. **payments** - Payment Tracking
**Pages:**
- Embedded in order details
- `/dashboard/settings/billing` - Payment settings

**Components:**
```tsx
// components/payments/PaymentDetails.tsx
- Payment method
- Transaction ID
- Amount
- Status badge
- Provider logo

// components/payments/StripeSetup.tsx
- Connect Stripe button
- Test mode indicator
- Webhook status
```

**Key Features:**
- Stripe integration
- Transaction tracking
- Multi-provider support
- Webhook monitoring

---

#### 21. **budgets** - Budget Management
**Pages:**
- `/dashboard/events/[id]/budget` - Budget tracking

**Components:**
```tsx
// components/budget/BudgetList.tsx
- Budget items table
- Filter by category, status
- Add item button
- Total estimated vs. actual

// components/budget/BudgetForm.tsx
- Category selector
- Item name & description
- Estimated cost
- Actual cost (when paid)
- Due date picker
- Status selector

// components/budget/BudgetOverview.tsx
- Budget summary cards
- By category breakdown
- Estimated vs. actual chart
- Payment status indicators
```

**Key Features:**
- Category tracking
- Estimated vs. actual
- Payment status
- Visual reporting

---

### **Operations Tables (3 tables)**

#### 22. **tasks** - Task Management
**Pages:**
- `/dashboard/tasks` - Tasks list
- `/dashboard/events/[id]/tasks` - Event-specific tasks

**Components:**
```tsx
// components/tasks/TaskBoard.tsx
- Kanban board (pending, in-progress, completed)
- Drag to change status
- Add task button

// components/tasks/TaskList.tsx
- Table view option
- Filter by status, priority, assignee
- Due date sorting

// components/tasks/TaskForm.tsx
- Title & description
- Event association dropdown
- Assign to dropdown
- Priority selector
- Due date picker
- Status selector

// components/tasks/TaskCard.tsx
- Task title
- Assignee avatar
- Priority badge
- Due date indicator
- Quick complete button
```

**Key Features:**
- Kanban board view
- Task assignment
- Priority levels
- Due date tracking
- Status workflow

---

#### 23. **vendors** - Vendor Management
**Pages:**
- `/dashboard/vendors` - Vendor list

**Components:**
```tsx
// components/vendors/VendorList.tsx
- Vendor cards
- Filter by service category
- Rating display

// components/vendors/VendorForm.tsx
- Vendor name & category
- Contact person & details
- Service description
- Address fields
- Rating selector
- Notes

// components/vendors/VendorCard.tsx
- Vendor name
- Service category badge
- Contact info
- Rating stars
- Events worked
```

**Key Features:**
- Service categorization
- Rating system
- Contact management
- Event history

---

#### 24. **event_vendors** - Vendor Assignments
**Pages:**
- `/dashboard/events/[id]/vendors` - Manage event vendors

**Components:**
```tsx
// components/vendors/EventVendorsList.tsx
- Assigned vendors table
- Add vendor button
- Service provided column
- Contract status

// components/vendors/AssignVendorModal.tsx
- Vendor selector (searchable)
- Service provided input
- Contract amount
- Service date picker
- Notes
```

**Key Features:**
- Vendor assignment
- Contract tracking
- Service dating
- Notes per assignment

---

### **Communications Table (1 table)**

#### 25. **email_templates** - Email Templates
**Pages:**
- `/dashboard/settings/email-templates` - Template management

**Components:**
```tsx
// components/email/TemplateList.tsx
- Template cards
- Filter by type
- Preview button

// components/email/TemplateEditor.tsx
- Template type selector
- Subject line input
- Body rich text editor
- Variable inserter ({{attendee_name}})
- Preview with sample data
- Test send button

// components/email/TemplatePreview.tsx
- Rendered email preview
- Mobile/desktop toggle
- Variable replacement display
```

**Key Features:**
- Rich text editing
- Variable support
- Preview & testing
- Template types

---

## 🚀 Implementation Timeline

### Week 1: Core Public Pages + Auth
**Days 1-2:** Authentication
- Login/signup pages
- Supabase Auth integration
- Session management

**Days 3-4:** Public Event Pages
- Homepage with event listing
- Event detail page
- Event card component

**Day 5:** Testing & Polish
- Responsive design
- Error handling
- Loading states

**Milestone:** Public can browse events and sign up

---

### Week 2: Checkout Flow
**Days 1-2:** Ticket Selection
- Ticket tier display
- Quantity selector
- Promo code input
- Cart functionality

**Days 3-4:** Checkout & Payment
- Checkout form (attendee details)
- Custom questions display
- Stripe Checkout integration
- Success page

**Day 5:** Testing & Polish
- Payment flow testing
- Email confirmations
- Error handling

**Milestone:** Complete ticket purchase flow works

---

### Week 3: Organizer Dashboard - Event Management
**Days 1-2:** Dashboard Layout
- Dashboard shell
- Navigation
- Event list page
- Create event wizard

**Days 3-4:** Event Configuration
- Event edit page
- Ticket management
- Event settings
- Promo codes

**Day 5:** Testing & Polish
- Form validation
- State management
- Responsive design

**Milestone:** Organizers can create and configure events

---

### Week 4: Organizer Dashboard - Advanced Features
**Days 1-2:** Order Management
- Orders list
- Order details
- Refund processing
- Attendee list

**Days 3:** CRM Foundation
- Contacts list
- Contact details
- Basic interactions

**Day 4:** Additional Features
- Custom questions
- Venues
- Tasks
- Budget tracking

**Day 5:** Final Testing & Launch
- End-to-end testing
- Performance optimization
- Bug fixes
- Launch! 🚀

**Milestone:** MVP goes live

---

## 🎨 Component Library

### Base Components (shadcn/ui)
- Button
- Input, Textarea, Select
- Dialog, Sheet
- Table, DataTable
- Card
- Badge
- Tabs
- Form components
- Calendar
- Dropdown Menu
- Toast notifications

### Custom Components
- EventCard
- TicketSelector
- PromoCodeInput
- OrderSummary
- DashboardLayout
- StatCard
- Chart components
- QR Code generator
- Rich text editor
- Image uploader
- Date/time pickers

---

## 🔐 Security & Access Control

### RLS Integration
```tsx
// lib/supabase.ts
import { createClientComponentClient } from '@supabase/ssr'

// Client-side queries automatically respect RLS
const supabase = createClientComponentClient()

// Example: Only organizer sees their events
const { data: events } = await supabase
  .from('events')
  .select('*')
  .eq('organizer_id', organizerId)
```

### Protected Routes
```tsx
// middleware.ts
export async function middleware(request: NextRequest) {
  // Check auth for /dashboard routes
  // Redirect to login if not authenticated
  // Verify organizer role for organizer routes
}
```

---

## 📊 Data Fetching Strategy

### React Query Setup
```tsx
// hooks/useEvents.ts
export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data } = await supabase
        .from('events')
        .select('*, venues(*), ticket_tiers(*)')
      return data
    }
  })
}

// hooks/useEvent.ts
export function useEvent(id: string) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const { data } = await supabase
        .from('events')
        .select('*, venues(*), ticket_tiers(*), event_settings(*)')
        .eq('id', id)
        .single()
      return data
    }
  })
}
```

### Optimistic Updates
```tsx
// hooks/useUpdateEvent.ts
export function useUpdateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (event) => {
      const { data } = await supabase
        .from('events')
        .update(event)
        .eq('id', event.id)
      return data
    },
    onMutate: async (newEvent) => {
      // Optimistically update UI
      await queryClient.cancelQueries(['event', newEvent.id])
      const previous = queryClient.getQueryData(['event', newEvent.id])
      queryClient.setQueryData(['event', newEvent.id], newEvent)
      return { previous }
    },
    onError: (err, newEvent, context) => {
      // Rollback on error
      queryClient.setQueryData(['event', newEvent.id], context.previous)
    },
    onSettled: (data, error, variables) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries(['event', variables.id])
    }
  })
}
```

---

## 🎯 Performance Optimization

### Code Splitting
```tsx
// Lazy load heavy components
const EventDashboard = lazy(() => import('./EventDashboard'))
const RichTextEditor = lazy(() => import('./RichTextEditor'))
const ChartComponent = lazy(() => import('./ChartComponent'))
```

### Image Optimization
```tsx
// Use Next.js Image component
import Image from 'next/image'

<Image
  src={event.coverImage}
  alt={event.title}
  width={1200}
  height={630}
  priority={isAboveFold}
  placeholder="blur"
/>
```

### Pagination & Infinite Scroll
```tsx
// For long lists (contacts, orders, etc.)
export function useInfiniteContacts() {
  return useInfiniteQuery({
    queryKey: ['contacts'],
    queryFn: async ({ pageParam = 0 }) => {
      const { data } = await supabase
        .from('contacts')
        .select('*')
        .range(pageParam, pageParam + 49)
      return data
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length === 50 ? pages.length * 50 : undefined
    }
  })
}
```

---

## 📱 Mobile Responsiveness

### Breakpoint Strategy
```tsx
// Tailwind breakpoints
sm: '640px'   // Mobile landscape
md: '768px'   // Tablet
lg: '1024px'  // Desktop
xl: '1280px'  // Large desktop
```

### Mobile-First Components
- Collapsible navigation
- Bottom sheet modals
- Touch-friendly controls
- Swipe gestures
- Simplified tables (card view on mobile)

---

## 🧪 Testing Strategy

### Unit Tests (Vitest)
- Component rendering
- Form validation
- Utility functions

### Integration Tests (React Testing Library)
- User flows
- Form submissions
- API interactions

### E2E Tests (Playwright)
- Complete purchase flow
- Event creation flow
- Dashboard navigation

---

## 🚀 Deployment

### Vercel Configuration
```json
{
  "buildCommand": "next build",
  "devCommand": "next dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY": "@stripe-key"
  }
}
```

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

---

## 📈 Success Metrics

### Technical Metrics
- Lighthouse score > 90
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Core Web Vitals passing

### Business Metrics
- Event creation < 5 minutes
- Checkout completion rate > 80%
- Mobile traffic > 40%
- Dashboard load time < 2s

---

## 📚 Documentation

### For Developers
- [ ] Component documentation (Storybook)
- [ ] API integration guide
- [ ] State management patterns
- [ ] Testing guidelines

### For Users
- [ ] Event creation guide
- [ ] Ticket setup tutorial
- [ ] Dashboard overview video
- [ ] FAQ section

---

**Document Version:** 1.0
**Last Updated:** 2025-10-17
**Status:** ✅ Ready for Implementation
**Database Tables Mapped:** 25/25 (100%)
**Estimated Pages:** 40+
**Estimated Components:** 100+
**Target:** 4-week implementation
