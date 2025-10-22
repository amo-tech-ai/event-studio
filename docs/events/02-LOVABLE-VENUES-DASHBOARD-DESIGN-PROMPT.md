# 🎨 Lovable Design Prompt: Venues Dashboard

## 📋 **DESIGN BRIEF**

**Project:** EventOS Venues Management Dashboard  
**Target Users:** Venue managers, event organizers, venue staff  
**Design Focus:** Clean, professional, mobile-first venue management interface  
**Timeline:** 2-3 days for complete design implementation  

---

## 🎯 **LOVABLE'S MISSION**

Create a beautiful, responsive venues dashboard that allows venue managers to:
- **View all venues** at a glance with key metrics
- **Manage bookings** with an intuitive calendar interface
- **Track revenue** and occupancy rates
- **Communicate with clients** through integrated messaging
- **Access everything** on mobile devices seamlessly

---

## 🏗️ **PAGE STRUCTURE & LAYOUT**

### **Main Venues Dashboard Page**
**Route:** `/dashboard/venues`  
**Purpose:** Central hub for all venue management activities

#### **Page Layout Structure:**
```
┌─────────────────────────────────────────────────────────┐
│ 🏢 Venues Dashboard                    [Add Venue] [📊] │
├─────────────────────────────────────────────────────────┤
│ 📊 Quick Stats (4 Cards)                              │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│ │ 12      │ │ 45      │ │ $25,400 │ │ 78%     │       │
│ │ Venues  │ │ Bookings│ │ Revenue │ │ Occupancy│       │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘       │
├─────────────────────────────────────────────────────────┤
│ 📅 Upcoming Events (Next 7 Days)                      │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Mon 15 │ Tech Conference    │ Conference Center A   │ │
│ │ Tue 16 │ Wedding Reception  │ Grand Ballroom        │ │
│ │ Wed 17 │ Corporate Meeting  │ Boardroom 1          │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ 🏢 Venue Management Tabs                               │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [Venue List] [Calendar] [Bookings] [Reports]        │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## 🎨 **DESIGN REQUIREMENTS**

### **Visual Design System**
- **Color Palette:** Use existing EventOS brand colors (primary blue, success green, warning orange)
- **Typography:** Clean, readable fonts with proper hierarchy
- **Spacing:** Consistent 16px, 24px, 32px spacing system
- **Shadows:** Subtle card shadows for depth
- **Borders:** Light gray borders for separation

### **Component Styling**
- **Cards:** White background, subtle shadow, rounded corners
- **Buttons:** Primary blue for actions, secondary gray for secondary actions
- **Badges:** Color-coded status indicators (green=active, orange=pending, red=blocked)
- **Icons:** Lucide React icons, consistent sizing
- **Charts:** Clean, minimal chart designs with EventOS colors

---

## 📱 **RESPONSIVE DESIGN REQUIREMENTS**

### **Mobile Layout (< 640px)**
- **Single column layout** with stacked cards
- **Touch-friendly buttons** (minimum 44px height)
- **Swipe navigation** between sections
- **Bottom navigation** for main sections
- **Collapsible sections** to save space

### **Tablet Layout (640px - 1024px)**
- **Two-column grid** for stats cards
- **Sidebar navigation** for venue management
- **Touch-optimized** interface elements
- **Expandable calendar** view

### **Desktop Layout (> 1024px)**
- **Three-column layout** with sidebar
- **Full calendar** view with detailed information
- **Hover effects** on interactive elements
- **Keyboard navigation** support

---

## 🧩 **COMPONENT SPECIFICATIONS**

### **1. Quick Stats Cards**
**Purpose:** Display key venue metrics at a glance

**Design Requirements:**
- **4 cards in a row** on desktop, stacked on mobile
- **Large numbers** for metrics (12, 45, $25,400, 78%)
- **Descriptive labels** (Venues, Bookings, Revenue, Occupancy)
- **Color-coded** based on performance (green=good, orange=warning, red=critical)
- **Hover effects** with subtle lift animation

**Mock Data:**
```
Card 1: 12 Venues (green badge)
Card 2: 45 Bookings (blue badge)  
Card 3: $25,400 Revenue (green badge)
Card 4: 78% Occupancy (orange badge)
```

### **2. Upcoming Events Section**
**Purpose:** Show next 7 days of scheduled events

**Design Requirements:**
- **Clean list layout** with date, event name, venue
- **Status indicators** (confirmed, tentative, blocked)
- **Quick actions** (view details, edit booking)
- **Scrollable** if more than 5 events
- **Empty state** when no upcoming events

**Mock Data:**
```
Mon 15 Jan | Tech Conference 2024 | Conference Center A | ✅ Confirmed
Tue 16 Jan | Wedding Reception    | Grand Ballroom      | ✅ Confirmed  
Wed 17 Jan | Corporate Meeting    | Boardroom 1         | ⏳ Tentative
Thu 18 Jan | Product Launch       | Main Auditorium     | ✅ Confirmed
Fri 19 Jan | Team Building        | Outdoor Pavilion    | ⏳ Tentative
```

### **3. Venue Management Tabs**
**Purpose:** Navigate between different venue management views

**Tab Options:**
- **Venue List** - All venues with search/filter
- **Calendar** - Booking calendar view
- **Bookings** - All bookings management
- **Reports** - Analytics and reporting

**Design Requirements:**
- **Active tab highlighting** with blue underline
- **Icon + text labels** for each tab
- **Smooth transitions** between tab content
- **Mobile-friendly** tab navigation

### **4. Venue List Component**
**Purpose:** Display all venues with key information

**Design Requirements:**
- **Card-based layout** with venue image, name, location
- **Status badges** (Active, Inactive, Maintenance)
- **Quick metrics** (capacity, monthly revenue, occupancy)
- **Action buttons** (Edit, View, Book)
- **Search and filter** functionality

**Mock Venue Data:**
```
🏢 Conference Center A
📍 123 Business Ave, Toronto
👥 Capacity: 500 | 💰 $15,200/month | 📊 85% occupancy
[Edit] [View] [New Booking]

🏢 Grand Ballroom  
📍 456 Hotel St, Vancouver
👥 Capacity: 300 | 💰 $12,800/month | 📊 72% occupancy
[Edit] [View] [New Booking]

🏢 Boardroom 1
📍 789 Office Tower, Montreal  
👥 Capacity: 50 | 💰 $3,200/month | 📊 45% occupancy
[Edit] [View] [New Booking]
```

### **5. Booking Calendar Component**
**Purpose:** Visual calendar for venue availability and bookings

**Design Requirements:**
- **Monthly/weekly/daily views** with toggle buttons
- **Color-coded bookings** (confirmed=blue, tentative=yellow, blocked=red)
- **Hover tooltips** with booking details
- **Quick booking creation** on available dates
- **Mobile-optimized** touch interactions

**Calendar Features:**
- **Date navigation** with previous/next month
- **Today indicator** with highlighted current date
- **Booking conflicts** shown in red
- **Available slots** shown in green
- **Legend** explaining color codes

### **6. Booking Management Component**
**Purpose:** Detailed view of all venue bookings

**Design Requirements:**
- **Table/list view** with booking details
- **Status filters** (All, Confirmed, Tentative, Cancelled)
- **Search functionality** by client name or event
- **Sort options** by date, venue, status
- **Bulk actions** for multiple bookings

**Booking Information Display:**
```
Event Name | Client | Venue | Date | Time | Status | Actions
Tech Conf  | ABC Corp| Center A | Jan 15 | 9AM-5PM | ✅ | [Edit][View]
Wedding    | Smiths  | Ballroom | Jan 16 | 6PM-12AM| ✅ | [Edit][View]
Meeting    | XYZ Inc| Boardroom| Jan 17 | 2PM-4PM | ⏳ | [Edit][View]
```

### **7. Reports Dashboard Component**
**Purpose:** Analytics and reporting for venue performance

**Design Requirements:**
- **Chart visualizations** for revenue, occupancy, bookings
- **Date range picker** for custom reporting periods
- **Export functionality** (PDF, Excel)
- **Key metrics** prominently displayed
- **Trend indicators** (up/down arrows)

**Report Sections:**
- **Revenue Overview** - Monthly revenue chart
- **Occupancy Rates** - Venue utilization chart  
- **Booking Trends** - Booking volume over time
- **Top Venues** - Best performing venues
- **Client Analysis** - Repeat vs new clients

---

## 🎭 **INTERACTIVE ELEMENTS**

### **Hover Effects**
- **Cards lift slightly** on hover with shadow increase
- **Buttons change color** to darker shade
- **Icons scale up** slightly (1.1x)
- **Smooth transitions** (0.2s ease-in-out)

### **Click Interactions**
- **Button press animation** with scale down (0.95x)
- **Tab switching** with smooth content transitions
- **Modal opening** with fade-in animation
- **Form validation** with visual feedback

### **Loading States**
- **Skeleton loaders** for data-heavy sections
- **Spinner animations** for async operations
- **Progressive loading** for large datasets
- **Empty state illustrations** when no data

---

## 📊 **MOCK DATA REQUIREMENTS**

### **Venue Information**
```
12 Total Venues:
- Conference Center A (500 capacity, $15,200/month)
- Grand Ballroom (300 capacity, $12,800/month)  
- Boardroom 1 (50 capacity, $3,200/month)
- Outdoor Pavilion (200 capacity, $8,500/month)
- Main Auditorium (800 capacity, $22,100/month)
- Meeting Room 2 (25 capacity, $1,800/month)
- Rooftop Terrace (150 capacity, $6,200/month)
- Executive Suite (100 capacity, $4,500/month)
- Garden Room (75 capacity, $2,900/month)
- Tech Lab (40 capacity, $2,100/month)
- VIP Lounge (30 capacity, $1,500/month)
- Storage Room (0 capacity, $500/month)
```

### **Booking Data**
```
45 Total Bookings:
- 32 Confirmed bookings
- 8 Tentative bookings  
- 3 Cancelled bookings
- 2 Blocked dates

Revenue: $25,400 this month
Occupancy: 78% average
```

### **Upcoming Events**
```
Next 7 Days:
- Mon: Tech Conference (Conference Center A)
- Tue: Wedding Reception (Grand Ballroom)
- Wed: Corporate Meeting (Boardroom 1)
- Thu: Product Launch (Main Auditorium)
- Fri: Team Building (Outdoor Pavilion)
- Sat: Private Party (VIP Lounge)
- Sun: No events scheduled
```

---

## 🎨 **VISUAL DESIGN GUIDELINES**

### **Color Scheme**
- **Primary Blue:** #3B82F6 (buttons, links, active states)
- **Success Green:** #10B981 (confirmed bookings, positive metrics)
- **Warning Orange:** #F59E0B (tentative bookings, attention needed)
- **Error Red:** #EF4444 (cancelled bookings, critical issues)
- **Neutral Gray:** #6B7280 (text, borders, inactive states)
- **Background:** #F9FAFB (light gray for page background)
- **Card Background:** #FFFFFF (white for content cards)

### **Typography**
- **Headings:** Bold, 24px-32px, dark gray (#111827)
- **Subheadings:** Medium, 18px-20px, medium gray (#374151)
- **Body Text:** Regular, 14px-16px, dark gray (#111827)
- **Small Text:** Regular, 12px-14px, light gray (#6B7280)
- **Numbers:** Bold, 20px-28px, primary blue (#3B82F6)

### **Spacing System**
- **XS:** 4px (icon spacing)
- **S:** 8px (small gaps)
- **M:** 16px (standard spacing)
- **L:** 24px (section spacing)
- **XL:** 32px (large gaps)
- **XXL:** 48px (page margins)

---

## 📱 **MOBILE-SPECIFIC REQUIREMENTS**

### **Touch Interface**
- **Minimum 44px** touch targets for all interactive elements
- **Swipe gestures** for calendar navigation
- **Pull-to-refresh** for data updates
- **Bottom sheet** for detailed views
- **Floating action button** for primary actions

### **Mobile Layout Adaptations**
- **Single column** layout for all content
- **Collapsible sections** to save space
- **Sticky headers** for navigation
- **Tab bar** at bottom for main navigation
- **Full-screen modals** for detailed views

### **Mobile Navigation**
```
Bottom Tab Bar:
🏠 Dashboard | 📅 Calendar | 🏢 Venues | 📊 Reports | ⚙️ Settings
```

---

## 🎯 **USER JOURNEY FLOWS**

### **Primary User Journey: Managing a Booking**
1. **Land on Dashboard** - See overview of all venues and bookings
2. **View Calendar** - Check availability for specific dates
3. **Create Booking** - Fill out booking form with client details
4. **Confirm Booking** - Review details and send confirmation
5. **Track Status** - Monitor booking through to completion

### **Secondary User Journey: Venue Analytics**
1. **Access Reports** - Navigate to reports section
2. **Select Date Range** - Choose time period for analysis
3. **View Metrics** - Review revenue, occupancy, and booking trends
4. **Export Data** - Download reports for external use
5. **Take Action** - Make decisions based on analytics

---

## 🧪 **TESTING CHECKLIST**

### **Visual Design Validation**
- [ ] Matches EventOS existing design system
- [ ] Consistent spacing and color usage
- [ ] Typography hierarchy is clear and readable
- [ ] Icons display correctly and are properly sized
- [ ] Cards have appropriate shadows and borders

### **Responsiveness Testing**
- [ ] Mobile layout works perfectly (< 640px)
- [ ] Tablet layout is optimized (640px - 1024px)
- [ ] Desktop layout is fully functional (> 1024px)
- [ ] No horizontal scrolling at any screen size
- [ ] Touch targets are large enough on mobile devices

### **Component Functionality**
- [ ] All shadcn/ui components render correctly
- [ ] Cards display with proper styling and hover effects
- [ ] Buttons have appropriate hover and active states
- [ ] Badges show correct colors for different statuses
- [ ] Icons are consistently sized and positioned

### **Mock Data Display**
- [ ] Sample venue data displays without errors
- [ ] No "undefined" or missing data in components
- [ ] Placeholder numbers show correctly in metrics cards
- [ ] All text content is readable and properly formatted
- [ ] Charts and graphs display with sample data

### **Code Quality Assurance**
- [ ] No TypeScript compilation errors
- [ ] No console errors or warnings
- [ ] Page loads quickly without performance issues
- [ ] Components are clean, readable, and well-structured
- [ ] Proper imports and dependencies

---

## 🚀 **IMPLEMENTATION PRIORITY**

### **Phase 1: Core Dashboard (Day 1)**
- Main venues dashboard layout
- Quick stats cards with mock data
- Upcoming events section
- Basic navigation tabs

### **Phase 2: Venue Management (Day 2)**
- Venue list component with search/filter
- Booking calendar with availability
- Booking management table
- Mobile responsiveness

### **Phase 3: Analytics & Polish (Day 3)**
- Reports dashboard with charts
- Interactive elements and animations
- Final mobile optimizations
- Testing and quality assurance

---

## 📋 **DELIVERABLES EXPECTED**

### **From Lovable:**
- ✅ **Complete page layouts** for all venue management views
- ✅ **Responsive design** that works on all devices
- ✅ **Interactive components** with proper styling
- ✅ **Mock data integration** showing realistic content
- ✅ **Mobile-optimized** touch interface
- ✅ **Visual consistency** with existing EventOS design

### **NOT Expected from Lovable:**
- ❌ Database connections or data fetching
- ❌ Form submission logic or validation
- ❌ Authentication or user management
- ❌ Real-time data updates
- ❌ Complex state management

---

**Design Focus:** Create a beautiful, functional venues dashboard that venue managers will love to use every day. Focus on clean design, intuitive navigation, and mobile-first user experience.

**Success Criteria:** A venue manager should be able to manage all their venues, bookings, and analytics from this dashboard without any confusion or frustration.

---

**Document Status:** ✅ Ready for Lovable Implementation  
**Priority:** HIGH (Core MVP Feature)  
**Estimated Time:** 2-3 days for complete design  
**Next Step:** Begin with main dashboard layout and quick stats cards
