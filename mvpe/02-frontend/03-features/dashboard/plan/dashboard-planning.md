# EventOS Dashboard - Design & Implementation Plan

## 🎨 Design System

### Color Palette
- **Primary Coral**: `#E76F51` (hsl: 9 76% 62%)
- **Background Cream**: `#FAF6F3` (hsl: 30 43% 97%)
- **Text Charcoal**: `#1E1E1E` (hsl: 0 0% 12%)
- **Accent Beige**: `#F9F4EF`
- **Neutral Gray**: `#E8E6E4` (hsl: 30 11% 90%)
- **Footer Dark**: `#1B1513` (hsl: 15 18% 9%)
- **Card White**: `#FFFFFF`

### Typography
- **Headings**: Playfair Display (serif, elegant, 600-700 weight)
- **Body**: Inter (sans-serif, 400-500 weight)
- **Line Height**: 1.5–1.7
- **Base Font**: 16px body, 14px labels

### Component Patterns
- **Cards**: White bg, 16px padding, 12px radius, soft shadow
- **Buttons**: 8px radius, coral primary + outline variants
- **Icons**: Lucide, 20px, consistent stroke
- **Charts**: Coral + beige tones, soft fills, no gridlines
- **Tables**: Soft dividers, left-aligned labels, right-aligned numbers

---

## 📊 Dashboard Pages Structure

### 1. Dashboard Overview (`/dashboard`)
**Purpose**: Main KPI overview & quick insights

**Components**:
- Welcome header with user name
- 4 KPI stat cards (Events, Bookings, Revenue, Tickets)
- 2 Charts: Revenue Trend (line) + Popular Events (bar)
- Recent Activity feed
- Upcoming Events preview

**Data Points**:
- Total Events: 0 → Active/Draft/Past count
- Total Bookings: 0 → Confirmed bookings
- Revenue: $0 → Total ticket sales
- Tickets Sold: 0 → All tickets sold

---

### 2. Events Management (`/dashboard/events`)
**Purpose**: Browse, create, and manage all events

**Features**:
- Tab filters: Active / Draft / Past
- Search bar + Category dropdown
- Grid/List view toggle
- Event cards with image, title, date, stats
- "+ Create Event" coral button (top right)
- Empty state with CTA

**Event Card Info**:
- Event image
- Category badge
- Title + Location
- Date + Time
- Ticket progress bar (sold %)
- Price tag

---

### 3. Bookings (`/dashboard/bookings`)
**Purpose**: Track ticket sales & attendee management

**Components**:
- 3 Stat Cards: Total Bookings, Tickets Sold, Total Earnings
- 2 Charts: Bookings Overview (line), Category Breakdown (donut)
- Filter pills: All / Confirmed / Pending / Cancelled
- Bookings table with sorting

**Table Columns**:
- Invoice ID
- Date
- Name
- Event
- Ticket Category
- Price
- Qty
- Amount
- Status (badge)
- E-Voucher link

---

### 4. Calendar (`/dashboard/calendar`)
**Purpose**: Visual schedule of all events & meetings

**Features**:
- Month view grid
- Event markers on dates
- 4 Stat cards: All Schedules, Events, Meetings, Setup & Rehearsal
- Filter toggles: Event / Meeting / Setup / Task
- Schedule Details sidebar (right)
- "+ New Agenda" button
- Team avatars

---

### 5. Financials (`/dashboard/financials`)
**Purpose**: Revenue, expenses, and cash flow tracking

**Components**:
- 3 Summary Cards: Balance, Income, Expenses
- 2 Charts: Cashflow (bar), Sales Revenue (donut), Expense Breakdown (donut)
- Recent Transactions table
- Export button

**Transaction Columns**:
- Date
- Event
- Amount (+/-)
- Note
- Status

---

### 6. Organizers (CRM) (`/dashboard/organizers`)
**Purpose**: Manage organizer profiles & relationships

**Features**:
- Search + Status filter
- Grid of organizer cards
- "+ Create Organizer" button
- Company logo, name, contact, stats

---

### 7. Venues (CRM) (`/dashboard/venues`)
**Purpose**: Manage venue listings & bookings

**Features**:
- Search + filter
- Venue cards with image, capacity, location
- "+ Add Venue" button

---

### 8. Analytics (`/dashboard/analytics`)
**Purpose**: Deep insights & reporting

**Features**:
- Date range picker
- KPI comparison
- Event performance charts
- Audience demographics
- Revenue breakdown by category

---

### 9. Settings (`/dashboard/settings`)
**Purpose**: Profile, integrations, preferences

**Sections**:
- Profile & Account
- Payment Settings (Stripe)
- Notifications
- Team Members
- API Keys

---

## 🧩 Shared Components

### Sidebar Navigation
- Logo + "Dashboard" label
- Collapsible/responsive
- Active state highlighting
- Icon + text layout
- Section groups: Main / CRM / Settings

### Top Header Bar
- Search input
- Notification bell icon
- Settings icon
- User avatar + name dropdown

### Stat Card
- Icon in colored box (coral/10 bg)
- Large number (2xl font)
- Label text
- Change indicator (+/- %)
- More options menu (⋮)

### Empty State
- Icon illustration
- Heading
- Description text
- Coral CTA button

### Chart Components
- Line Chart (Revenue Trend)
- Bar Chart (Popular Events, Bookings)
- Donut Chart (Category Breakdown)
- All use coral + neutral palette

---

## 🚀 Implementation Phases

### Phase 1: Core Setup ✅
- Dashboard layout structure
- Sidebar navigation
- Design tokens in index.css
- Stat card component

### Phase 2: Main Pages (Current)
- Dashboard Overview
- Events Management
- Bookings
- Calendar

### Phase 3: Extended Features
- Financials
- Organizers CRM
- Venues CRM
- Analytics

### Phase 4: Polish
- Loading states
- Animations
- Responsive refinements
- Empty states

---

## 📱 Responsive Behavior

### Desktop (1024px+)
- Full sidebar visible
- 4-column stat grid
- 2-column chart layout

### Tablet (768px - 1023px)
- Collapsible sidebar
- 2-column stat grid
- Stacked charts

### Mobile (< 768px)
- Hidden sidebar (hamburger menu)
- 1-column layout
- Stacked components

---

## 🎯 Key UX Principles

1. **Information Hierarchy**: Most important stats at top
2. **Consistent Spacing**: 16px / 24px / 32px rhythm
3. **Soft Contrast**: Calm colors, not harsh grays
4. **Breathing Room**: Generous whitespace
5. **Actionable**: Clear CTAs, no dead ends
6. **Empty State Guidance**: Always show next action
7. **Loading Feedback**: Skeleton states for async data

---

## 🔗 Route Structure

```
/dashboard → Overview
/dashboard/events → Events Grid
/dashboard/events/wizard → Create Event
/dashboard/bookings → Bookings Table
/dashboard/calendar → Calendar View
/dashboard/financials → Financial Dashboard
/dashboard/organizers → Organizers CRM
/dashboard/venues → Venues CRM
/dashboard/analytics → Analytics & Reports
/dashboard/settings → Settings Panel
```

---

**Status**: Phase 2 in progress
**Last Updated**: 2025-10-11
