# 🎨 EventOS Complete UI/UX Design Overview - Lovable Design Prompt

## 📋 **DESIGN BRIEF**

**Project:** EventOS Complete UI/UX Design System  
**Target Users:** Event organizers, venue managers, sponsors, attendees  
**Design Focus:** Comprehensive event management platform with AI-powered features  
**Timeline:** 15-20 days for complete design implementation across all pages  
**Approach:** Iterative building with existing component reuse and mobile-first design  

---

## 🎯 **LOVABLE'S MISSION**

Create a beautiful, responsive event management platform that provides:
- **Complete Dashboard System** - Analytics, calendar, organizers, venues, settings
- **Venue Management** - Detailed venue pages with booking management
- **CRM System** - Client management with pipeline tracking and AI insights
- **Sponsor Management** - AI-powered sponsor discovery and proposal generation
- **Mobile-First Design** - 65% of users are mobile, optimized for touch interactions

All pages must use the existing EventOS design system, shadcn/ui components, and maintain visual consistency across the platform.

---

## 🏗️ **COMPLETE PAGE STRUCTURE OVERVIEW**

### **Dashboard Pages (6 Pages)**
1. **Analytics Dashboard** (`/dashboard/analytics`) - Performance metrics and insights
2. **Calendar View** (`/dashboard/calendar`) - Event scheduling and management
3. **Organizers Management** (`/dashboard/organizers`) - Organizer profiles and performance
4. **Venues Management** (`/dashboard/venues`) - Venue listing and management
5. **Settings Page** (`/dashboard/settings`) - Account configuration
6. **Organizer Detail Page** (`/dashboard/organizers/:id`) - Comprehensive organizer profile matching purple screenshot style (soft cards, rounded corners, clean spacing)

**CRITICAL SIDEBAR REQUIREMENTS FOR ALL DASHBOARD PAGES:**
- **Sidebar MUST be visible** on all dashboard pages (`/dashboard/analytics`, `/dashboard/calendar`, `/dashboard/organizers`, `/dashboard/venues`, `/dashboard/settings`)
- **Active item highlighting** - Current page must be highlighted in sidebar
- **Mobile behavior** - Sidebar collapsed by default on mobile (<640px), opens as left overlay via hamburger button
- **Consistent navigation** - Same sidebar structure across all dashboard pages

### **Venue Management (1 Page)**
7. **Venue Details Page** (`/dashboard/venues/:id`) - Complete venue management with gallery banner, stats cards (bookings, occupancy, revenue, rating), amenities badges, availability calendar with legend, and recent bookings table

### **CRM System (5 Pages)**
8. **CRM Dashboard** (`/crm/dashboard`) - Client metrics and pipeline overview
9. **Organizer Management** (`/crm/organizers`) - Client company profiles
10. **Organizer Detail Page** (`/crm/organizers/:id`) - Comprehensive client profile
11. **Pipeline Board** (`/crm/pipeline`) - Visual Kanban board for deals
12. **Reports & Analytics** (`/crm/reports`) - Performance insights and forecasting

### **Sponsor Management (6 Pages)**
13. **Sponsor Dashboard** (`/sponsors/dashboard`) - AI insights and performance metrics
14. **Sponsor Discovery** (`/sponsors/discovery`) - AI-powered matching and lead generation
15. **Proposal Management** (`/sponsors/proposals`) - AI-generated proposals and tracking
16. **Contract Management** (`/sponsors/contracts`) - Digital contracts and compliance
17. **Performance Analytics** (`/sponsors/analytics`) - Real-time metrics and forecasting
18. **Sponsor Portal** (`/sponsors/portal`) - Self-service portal for sponsors

**Total: 18 Pages** across 4 major systems

---

## 🏗️ **DASHBOARD PAGE TEMPLATE REQUIREMENTS**

### **Reusable Dashboard Page Template**
All dashboard pages must use a consistent template structure:
- **Header Section** - Page title, breadcrumbs, action buttons
- **Content Grid** - Responsive layout with proper spacing
- **Right Gutter** - Consistent sidebar space allocation
- **Skeleton Blocks** - Loading state placeholders
- **Empty State Slot** - When no data is available
- **Error State Slot** - For error handling
- **Standard Card/Section Spacing** - 8px grid system

### **Organizer Detail Page Specifications** (`/dashboard/organizers/:id`)
**Style:** Match purple screenshot reference (soft cards, rounded corners, clean spacing)
**Sections Required:**
- **Profile Header** - Avatar, name, role, contact CTAs (call, email, message)
- **KPI Cards** - Total events, revenue, attendees (3-4 metric cards)
- **Recent Events Cards** - Event thumbnails, titles, dates, status
- **Activity Feed Timeline** - Recent actions, bookings, updates
- **Mini Calendar** - Upcoming events and availability
- **Mock Data** - Use placeholder images and sample data

### **Venue Detail Page Specifications** (`/dashboard/venues/:id`)
**Sections Required:**
- **Gallery Banner** - Image carousel with venue photos
- **Stats Cards** - Bookings count, occupancy rate, revenue, rating
- **Amenities Badges** - WiFi, parking, AV, catering, accessibility
- **Availability Calendar** - Monthly view with legend (available/tentative/booked)
- **Recent Bookings Table** - Event name, date, revenue, status
- **Mock Data** - Use placeholder images and sample data

---

## 🎨 **DESIGN SYSTEM REQUIREMENTS**

### **Visual Design Standards**
- **Color Scheme:** EventOS semantic color tokens (HSL-based)
- **Typography:** Inter font family with consistent hierarchy
- **Spacing:** 8px grid system for consistent spacing
- **Components:** shadcn/ui component library (27 components available)
- **Icons:** Lucide React icons for consistency
- **Shadows:** Subtle shadows for depth and hierarchy
- **Borders:** Rounded corners (8px radius) for modern look

### **Component Naming Standards**
Use these exact component names for consistency:
- **Navigation:** `Sidebar`, `Header`, `Breadcrumb`
- **Layout:** `Container`, `Grid`, `Stack`, `Card`
- **Data Display:** `Table`, `List`, `Badge`, `Avatar`, `Progress`
- **Forms:** `Input`, `Select`, `Checkbox`, `Radio`, `Button`
- **Feedback:** `Alert`, `Toast`, `Skeleton`, `Spinner`
- **Overlay:** `Modal`, `Drawer`, `Tooltip`, `Popover`

### **Mobile-First Responsive Design**
- **Primary Focus:** Mobile (< 640px) - 65% of users
- **Secondary:** Tablet (640px - 1024px) - Touch optimized
- **Tertiary:** Desktop (> 1024px) - Power user features

### **CRITICAL MOBILE SIDEBAR REQUIREMENTS**
- **Default State:** Sidebar HIDDEN on mobile (< 640px)
- **Hamburger Menu:** [☰] icon in top-left corner for sidebar toggle
- **Overlay Style:** Sidebar slides in from left as overlay (NOT push)
- **Touch Targets:** 44px+ touch targets for all sidebar items
- **Close Options:** [✕] button, tap outside, swipe left, back button
- **Smooth Animations:** 300ms slide transitions for open/close
- **Backdrop Blur:** Semi-transparent backdrop when sidebar is open
- **Safe Areas:** Respect device safe areas (notches, home indicators)

---

## 📱 **MOBILE SIDEBAR SPECIFICATIONS**

### **Collapsible Sidebar Design**
- **Default State:** Sidebar hidden on mobile (< 640px)
- **Hamburger Menu:** [☰] icon in top-left corner for sidebar toggle
- **Overlay Style:** Sidebar slides in from left as overlay (not push)
- **Touch Targets:** 44px+ touch targets for all sidebar items
- **Close Options:** [✕] button, tap outside, swipe left, back button
- **Smooth Animations:** 300ms slide transitions for open/close
- **Backdrop Blur:** Semi-transparent backdrop when sidebar is open
- **Safe Areas:** Respect device safe areas (notches, home indicators)

### **MOBILE OPTIMIZATION REQUIREMENTS**
**CRITICAL:** Based on mobile screenshot analysis, the sidebar MUST be collapsible:
- **Problem:** Fixed sidebar takes up too much space on mobile screens
- **Solution:** Hamburger menu [☰] in top-left corner
- **Behavior:** Sidebar slides in as overlay when opened
- **Content:** Main content area gets full width when sidebar is closed
- **Navigation:** Easy access to all menu items via hamburger menu
- **Touch-Friendly:** Large touch targets for mobile users

### **Sidebar Navigation Structure**
```
┌─────────────────┐
│ [☰] EventOS     │ ← Hamburger menu for sidebar toggle
├─────────────────┤
│ 🏠 Dashboard    │
│ 📊 Analytics    │
│ 📅 Calendar     │
│ 👥 Organizers   │
│ 🏢 Venues       │
│ ⚙️ Settings     │
├─────────────────┤
│ 🤖 AI Assistant │
│ 👤 Profile      │
└─────────────────┘
```

---

## 🎯 **ITERATIVE BUILDING APPROACH**

### **Phase 1: Foundation Pages (Days 1-5) - HIGHEST PRIORITY**
**Order of Implementation:**
1. **Analytics Dashboard** - Most business-critical page
2. **Calendar View** - Essential for event scheduling
3. **Organizers Management** - User management foundation
4. **Venues Management** - Core venue functionality
5. **Settings Page** - User configuration

**Success Criteria:**
- All 5 pages render without errors
- Mobile-first responsive design
- Consistent with existing EventOS design
- Mock data displays correctly
- Sidebar navigation working on all devices

### **Phase 2: Venue Details (Days 6-8) - HIGH PRIORITY**
**Order of Implementation:**
6. **Venue Details Page** - Complete venue management with tabs
7. **Cross-page consistency review** - Ensure design harmony

**Success Criteria:**
- Venue details page complete with all tabs
- Mobile optimization verified
- Cross-page functionality tested
- Touch gestures working properly

### **Phase 3: CRM System (Days 9-13) - HIGH PRIORITY**
**Order of Implementation:**
8. **CRM Dashboard** - Client metrics and pipeline overview
9. **Organizer Management** - Client company profiles
10. **Organizer Detail Page** - Comprehensive client profile
11. **Pipeline Board** - Visual Kanban board for deals
12. **Reports & Analytics** - Performance insights

**Success Criteria:**
- All 5 CRM pages complete
- Consistent navigation and design
- Mobile optimization verified
- Cross-page functionality tested

### **Phase 4: Sponsor Management (Days 14-18) - MEDIUM PRIORITY**
**Order of Implementation:**
13. **Sponsor Dashboard** - AI insights and performance metrics
14. **Sponsor Discovery** - AI-powered matching and lead generation
15. **Proposal Management** - AI-generated proposals and tracking
16. **Contract Management** - Digital contracts and compliance
17. **Performance Analytics** - Real-time metrics and forecasting
18. **Sponsor Portal** - Self-service portal for sponsors

**Success Criteria:**
- All 6 sponsor pages complete
- AI-themed design elements working
- Mobile gesture support working
- Cross-device validation complete

### **Phase 5: Final Polish (Days 19-20) - MEDIUM PRIORITY**
**Order of Implementation:**
19. **Final Polish** - Mobile optimization and testing
20. **Accessibility Review** - WCAG compliance across all pages

**Success Criteria:**
- All 18 pages complete and polished
- Mobile gesture support working
- Mock data displays correctly
- Cross-device validation
- Accessibility compliance verified

---

## 📐 **DETAILED WIREFRAMES & LAYOUT SPECIFICATIONS**

### **Dashboard Layout Wireframe**
```
┌─────────────────────────────────────────────────────────┐
│ [Sidebar Navigation - Always Visible] │ Dashboard Header │
├─────────────────────────────────────────────────────────┤
│ 👋 Welcome Back!              [🔍 Search] [🔔] [⚙️] │
├─────────────────────────────────────────────────────────┤
│ 📊 Key Metrics (4 Cards)                              │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│ │ $45,200 │ │ 1,250   │ │ 68%     │ │ 4.8/5   │       │
│ │ Revenue │ │ Attendees│ │ Conversion│ │ Rating  │       │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘       │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ │
│ │              Revenue Trend Chart                     │ │
│ │     📈 Line chart showing 6-month revenue           │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────┐ ┌─────────────────────────────────┐ │
│ │ Attendee Demos  │ │        Top Events Table        │ │
│ │ 📊 Pie Chart    │ │ Event Name    │ Revenue │ %    │ │
│ │ Age Groups      │ │ Tech Conf 2024│ $12,000 │ 89% │ │
│ └─────────────────┘ └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### **Mobile Layout Wireframe (< 640px) - COLLAPSIBLE SIDEBAR**
```
┌─────────────────┐
│ [☰] EventOS     │ ← Hamburger menu for sidebar toggle
├─────────────────┤
│   Welcome Back  │
├─────────────────┤
│   Metrics Cards │
│   (Stacked)     │
├─────────────────┤
│   Chart Area    │
│   (Full Width)  │
├─────────────────┤
│   Data Table    │
│   (Scrollable)  │
└─────────────────┘

SIDEBAR OVERLAY (When Open):
┌─────────────────┐
│ [✕] Navigation  │ ← Close button
├─────────────────┤
│ 🏠 Dashboard    │
│ 📊 Analytics    │
│ 📅 Calendar     │
│ 👥 Organizers   │
│ 🏢 Venues       │
│ ⚙️ Settings     │
├─────────────────┤
│ 🤖 AI Assistant │
│ 👤 Profile      │
└─────────────────┘
```

**CRITICAL MOBILE REQUIREMENT:**
- **Sidebar MUST be collapsible on mobile** - Default state: HIDDEN
- **Hamburger menu [☰] in top-left corner** - Tap to open sidebar
- **Sidebar slides in as overlay** - Does NOT push content
- **Touch targets 44px+** - Easy thumb navigation
- **Close options:** [✕] button, tap outside, swipe left, back button
- **Smooth animations:** 300ms slide transitions
- **Backdrop blur:** Semi-transparent when open

---

## 🧩 **COMPONENT REUSE STRATEGY**

### **Shared Components Across All Pages**
- **Sidebar Navigation** - Consistent across all dashboard pages
- **Header Components** - Page titles, breadcrumbs, action buttons
- **Card Components** - Information display, metrics, profiles
- **Table Components** - Data listing, sorting, filtering
- **Form Components** - Input fields, buttons, validation states
- **Modal Components** - Overlays, confirmations, details

### **Page-Specific Components**
- **Analytics Charts** - Revenue trends, performance metrics
- **Calendar Grid** - Event scheduling, availability
- **Pipeline Board** - Kanban-style deal management
- **AI Insights Panel** - Sponsor management AI features
- **Touch Gestures** - Mobile-specific interactions

---

## 📊 **MOCK DATA SPECIFICATIONS**

### **Dashboard Mock Data**
- **Analytics:** $45,200 revenue, 1,250 attendees, 68% conversion, 4.8/5 rating
- **Calendar:** 15 events across next month with different statuses
- **Organizers:** 8 organizer profiles with performance metrics
- **Venues:** 12 venues with capacity, pricing, and amenities

### **CRM Mock Data**
- **Clients:** 45 total organizers, $125,400 revenue, 78% win rate
- **Pipeline:** 8 deals across different stages with values $10K-$35K
- **Performance:** Top performers with ROI and satisfaction scores

### **Sponsor Mock Data**
- **Revenue:** $125,400 total, 45 sponsors, 78% win rate, 12 active deals
- **Discovery:** 50 AI matches, 85% accuracy, 12 hot leads, $2.5M pipeline
- **Proposals:** 15 total proposals, 65% response rate, $1.2M pipeline value

### **Venue Mock Data**
- **Venue Details:** Convention Center Downtown, 500 capacity, $2,500/day
- **Bookings:** 12 bookings this month, 78% occupancy rate
- **Amenities:** WiFi, Parking, AV Equipment, Catering, Accessibility

### **Organizer Detail Page Mock Data**
- **Profile:** Sarah Johnson, Event Marketing Specialist, 8 years experience
- **KPI Cards:** 24 total events, $125,400 revenue, 1,250 attendees, 4.8/5 rating
- **Recent Events:** Tech Conference 2024, Startup Pitch Night, Corporate Workshop
- **Activity Feed:** 3 new bookings this week, 2 venue confirmations, 1 payment received
- **Mini Calendar:** 5 upcoming events in next 30 days

---

## 🧪 **TESTING CHECKLIST**

### **Visual Design Validation**
- [ ] Matches EventOS existing design system
- [ ] Consistent spacing and color usage
- [ ] Typography hierarchy is clear and readable
- [ ] Icons display correctly and are properly sized
- [ ] Cards have appropriate shadows and borders

### **Responsiveness Testing**
- [ ] **Mobile layout works perfectly (< 640px) - PRIMARY FOCUS**
- [ ] **Sidebar is collapsible on mobile - CRITICAL REQUIREMENT**
- [ ] **Hamburger menu [☰] works correctly on mobile**
- [ ] **Sidebar slides in as overlay (not push) on mobile**
- [ ] **Main content gets full width when sidebar is closed**
- [ ] **Sidebar visible on all dashboard pages** (`/dashboard/analytics`, `/dashboard/calendar`, `/dashboard/organizers`, `/dashboard/venues`, `/dashboard/settings`)
- [ ] **Active item highlighting works** - Current page highlighted in sidebar
- [ ] Tablet layout is optimized (640-1024px) - TOUCH OPTIMIZED
- [ ] Desktop layout is fully functional (> 1024px) - POWER USER FEATURES
- [ ] No horizontal scroll at any breakpoint
- [ ] Touch targets are appropriate for each device type
- [ ] Mobile: 44px+ touch targets, thumb-friendly navigation
- [ ] Tablet: 48px+ touch targets, landscape optimization
- [ ] Desktop: 32px+ targets, keyboard navigation

### **Component Quality**
- [ ] All shadcn/ui components render correctly
- [ ] Cards have proper shadows and borders
- [ ] Buttons have clear hover and active states
- [ ] Badges display with correct colors and sizing
- [ ] Icons are consistent and properly sized

### **Mock Data Integration**
- [ ] Sample data displays without errors
- [ ] No "undefined" or missing data issues
- [ ] Placeholder numbers show correctly in metrics
- [ ] All text is readable and properly formatted
- [ ] Images load and display properly

### **User Experience**
- [ ] Navigation is intuitive and clear
- [ ] Loading states provide good feedback
- [ ] Error states are helpful and actionable
- [ ] Empty states guide users to take action
- [ ] Interactive elements provide clear feedback

---

## 🎯 **SUCCESS CRITERIA**

### **Design Excellence**
- **Visual Consistency:** Matches existing EventOS design perfectly
- **Mobile Optimization:** 65% of users are mobile-first
- **Component Quality:** Professional, polished components
- **User Experience:** Intuitive and easy to navigate
- **Performance:** Fast loading and smooth interactions

### **Technical Quality**
- **No TypeScript Errors:** Clean, error-free code
- **No Console Errors:** No JavaScript errors or warnings
- **Responsive Design:** Perfect on all device sizes
- **Accessibility:** Proper ARIA labels and keyboard navigation
- **Performance:** Fast page load times and smooth animations

### **Business Value**
- **User Engagement:** Pages encourage user interaction
- **Conversion Optimization:** Clear calls-to-action and user flows
- **Professional Appearance:** Enterprise-ready design quality
- **Scalability:** Design works for growing user base
- **Brand Consistency:** Reinforces EventOS brand identity

---

## 🚀 **DELIVERABLES EXPECTED**

### **Complete Page Set (18 Pages)**
- [ ] **Dashboard System (6 pages)** - Analytics, calendar, organizers, venues, settings, organizer detail
- [ ] **Venue Management (1 page)** - Venue details with comprehensive management
- [ ] **CRM System (5 pages)** - Dashboard, organizers, detail, pipeline, reports
- [ ] **Sponsor Management (6 pages)** - Dashboard, discovery, proposals, contracts, analytics, portal

### **Design Assets**
- [ ] Wireframes for each page
- [ ] Component specifications
- [ ] Responsive layout guidelines
- [ ] Interaction patterns
- [ ] Mobile optimization notes

### **Quality Assurance**
- [ ] Cross-browser compatibility
- [ ] Mobile device testing
- [ ] Accessibility compliance
- [ ] Performance optimization
- [ ] User experience validation

---

## 📋 **IMPLEMENTATION PRIORITY MATRIX**

| Priority | System | Pages | Business Value | Technical Complexity | Mobile Impact |
|----------|--------|-------|----------------|---------------------|---------------|
| **1** | Dashboard | 6 pages | HIGH | MEDIUM | HIGH |
| **2** | Venue Management | 1 page | HIGH | MEDIUM | HIGH |
| **3** | CRM System | 5 pages | HIGH | MEDIUM | MEDIUM |
| **4** | Sponsor Management | 6 pages | MEDIUM | HIGH | HIGH |

---

## ✅ **PROMPT COMPLETENESS CHECKLIST**

### **Design Specifications**
- [x] All 18 pages detailed with purpose, layout, components
- [x] Mobile-first responsive design requirements (65% mobile users)
- [x] Touch targets specified (44px+ mobile, 48px+ tablet, 32px+ desktop)
- [x] Gesture support defined (swipe, pull-to-refresh, bottom sheets)
- [x] Safe area considerations for mobile devices
- [x] Mock data specifications for each page

### **Implementation Order**
- [x] Priority matrix with business value and technical complexity
- [x] 5-phase implementation timeline (20 days total)
- [x] Success criteria for each phase
- [x] Cross-page consistency requirements
- [x] Final review and polish checklist

### **Technical Requirements**
- [x] EventOS design system compliance
- [x] shadcn/ui component library usage
- [x] Responsive breakpoints defined
- [x] Accessibility requirements
- [x] Performance optimization guidelines

### **Quality Assurance**
- [x] Comprehensive testing checklist
- [x] Cross-device validation requirements
- [x] User experience validation criteria
- [x] Business value metrics
- [x] Success criteria and deliverables

---

**Document Status:** ✅ **COMPLETE WITH DIAGRAMS & WIREFRAMES**  
**Priority:** CRITICAL (UI/UX Design)  
**Next Action:** Begin with Analytics Dashboard (Phase 1, Day 1)  
**Success Metric:** 18 pages complete with comprehensive visual specifications  
**Implementation Order:** ✅ **OPTIMIZED FOR SUCCESS WITH VISUAL GUIDANCE**

---

## 🎨 **LOVABLE'S JOB**

- Create beautiful, responsive UI layouts
- Design visual components and styling
- Build page structure with mock/placeholder data
- Focus on user experience and visual design
- Ensure mobile-first responsive design
- Use existing shadcn/ui components
- Maintain EventOS design consistency

## 🔧 **CLAUDE'S JOB (LATER)**

- Connect pages to Supabase database
- Implement data fetching and state management
- Add form validation and submission logic
- Handle authentication and permissions
- Integrate AI features and automation
- Add real-time updates and notifications

---

## ❌ **What NOT to Include**

**NO Database Code:**
- ❌ No Supabase queries
- ❌ No .from('table') calls
- ❌ No database connections
- ❌ No SQL or data fetching

**NO State Management:**
- ❌ No React Query/TanStack Query
- ❌ No complex useState for data
- ❌ No useEffect for fetching
- ❌ No data mutations

**NO Advanced Logic:**
- ❌ No form submission handlers
- ❌ No authentication checks
- ❌ No real search/filter logic
- ❌ No data validation (except visual)

---

## ✅ **What TO Include**

**YES - Visual Design:**
- ✅ Page layout and structure
- ✅ Component composition
- ✅ Styling and colors
- ✅ Responsive design
- ✅ Typography and spacing

**YES - Mock Data:**
- ✅ Hardcoded sample data (3-5 items per page)
- ✅ Placeholder metrics (revenue, counts, percentages)
- ✅ Sample event/organizer/venue details
- ✅ Mock company information

**YES - Visual States:**
- ✅ Hover effects on cards
- ✅ Button active states
- ✅ Loading skeletons (visual only)
- ✅ Empty states (visual only)
- ✅ Visual feedback (button changes)

**YES - UI Interactions:**
- ✅ Button onClick for visual changes
- ✅ Toggle states (bookmark filled/outline)
- ✅ Accordion expand/collapse
- ✅ Tab navigation (visual)
- ✅ Modal open/close (if needed)

---

**This comprehensive overview ensures Lovable has everything needed to create a complete, consistent, and professional EventOS platform with 18 pages across 4 major systems, all optimized for mobile-first design and following best practices for iterative building.**