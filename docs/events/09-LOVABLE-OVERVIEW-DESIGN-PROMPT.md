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
6. **Organizer Detail Page** (`/dashboard/organizers/:id`) - Comprehensive organizer profile

### **Venue Management (1 Page)**
7. **Venue Details Page** (`/dashboard/venues/:id`) - Complete venue management with tabs

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

## 🎨 **SYSTEM ARCHITECTURE & USER JOURNEY FLOWS**

### **Complete System Overview Diagram**
```mermaid
graph TB
    subgraph "EventOS Platform Architecture"
        A[User Login] --> B[Dashboard Hub]
        B --> C[Analytics Dashboard]
        B --> D[Calendar Management]
        B --> E[Organizer Management]
        B --> F[Venue Management]
        B --> G[Settings]
        
        E --> H[Organizer Detail Page]
        F --> I[Venue Details Page]
        
        J[CRM System] --> K[CRM Dashboard]
        J --> L[Client Management]
        J --> M[Pipeline Board]
        J --> N[Reports & Analytics]
        
        O[Sponsor Management] --> P[Sponsor Dashboard]
        O --> Q[AI Discovery]
        O --> R[Proposal Management]
        O --> S[Contract Management]
        O --> T[Performance Analytics]
        O --> U[Sponsor Portal]
    end
    
    style A fill:#8B5CF6,color:#fff
    style B fill:#1E40AF,color:#fff
    style J fill:#059669,color:#fff
    style O fill:#DC2626,color:#fff
```

### **User Journey Flow - Complete Event Management**
```mermaid
flowchart TD
    A[User Login] --> B[Dashboard Overview]
    B --> C{User Role?}
    
    C -->|Organizer| D[Analytics Dashboard]
    C -->|Venue Manager| E[Venue Management]
    C -->|CRM User| F[CRM Dashboard]
    C -->|Sponsor| G[Sponsor Portal]
    
    D --> H[Create Event]
    H --> I[Select Venue]
    I --> J[Book Venue]
    J --> K[Manage Attendees]
    K --> L[Generate Revenue]
    
    E --> M[Venue Details]
    M --> N[Manage Bookings]
    N --> O[Update Availability]
    O --> P[Track Performance]
    
    F --> Q[Client Pipeline]
    Q --> R[Deal Management]
    R --> S[Generate Proposals]
    S --> T[Close Deals]
    
    G --> U[Browse Events]
    U --> V[Submit Proposals]
    V --> W[Track Performance]
    W --> X[Access Analytics]
    
    style A fill:#8B5CF6,color:#fff
    style B fill:#1E40AF,color:#fff
    style L fill:#059669,color:#fff
    style T fill:#DC2626,color:#fff
```

### **Mobile-First Navigation Flow**
```mermaid
graph LR
    subgraph "Mobile Navigation (< 640px)"
        A[☰ Hamburger Menu] --> B[Sidebar Overlay]
        B --> C[Dashboard]
        B --> D[Analytics]
        B --> E[Calendar]
        B --> F[Organizers]
        B --> G[Venues]
        B --> H[Settings]
        B --> I[AI Assistant]
        B --> J[Profile]
        
        K[Touch Gestures] --> L[Swipe Navigation]
        L --> M[Pull to Refresh]
        M --> N[Bottom Sheets]
        N --> O[Context Menus]
    end
    
    subgraph "Desktop Navigation (> 1024px)"
        P[Fixed Sidebar] --> Q[Always Visible]
        Q --> R[Quick Access]
        R --> S[Power User Features]
    end
    
    style A fill:#8B5CF6,color:#fff
    style B fill:#1E40AF,color:#fff
    style P fill:#059669,color:#fff
```

### **Dashboard System Integration Flow**
```mermaid
sequenceDiagram
    participant U as User
    participant D as Dashboard
    participant A as Analytics
    participant C as Calendar
    participant O as Organizers
    participant V as Venues
    participant S as Settings
    
    U->>D: Login to Dashboard
    D->>A: Load Analytics Data
    A-->>D: Revenue Metrics
    D->>C: Load Calendar Events
    C-->>D: Event Schedule
    D->>O: Load Organizer Data
    O-->>D: Organizer Profiles
    D->>V: Load Venue Data
    V-->>D: Venue Information
    D->>S: Load User Settings
    S-->>D: Configuration Data
    D-->>U: Complete Dashboard View
    
    Note over U,S: All systems integrated seamlessly
```

### **CRM System Workflow**
```mermaid
flowchart TD
    A[CRM Dashboard] --> B[Client Overview]
    B --> C[Pipeline Management]
    C --> D[Deal Stages]
    D --> E[Lead Generation]
    E --> F[Proposal Creation]
    F --> G[Contract Management]
    G --> H[Revenue Tracking]
    H --> I[Performance Analytics]
    I --> J[Client Success]
    
    K[AI Insights] --> L[Predictive Analytics]
    L --> M[Opportunity Scoring]
    M --> N[Automated Follow-ups]
    N --> O[Revenue Optimization]
    
    style A fill:#059669,color:#fff
    style J fill:#8B5CF6,color:#fff
    style K fill:#DC2626,color:#fff
```

### **Sponsor Management Flow**
```mermaid
graph TB
    subgraph "AI-Powered Sponsor Management"
        A[Sponsor Dashboard] --> B[AI Discovery Engine]
        B --> C[Lead Scoring]
        C --> D[Match Recommendations]
        D --> E[Proposal Generation]
        E --> F[Contract Automation]
        F --> G[Performance Tracking]
        G --> H[Revenue Optimization]
        
        I[AI Insights] --> J[Predictive Analytics]
        J --> K[Market Trends]
        K --> L[Opportunity Identification]
        L --> M[Automated Outreach]
        M --> N[Success Metrics]
    end
    
    style A fill:#DC2626,color:#fff
    style B fill:#8B5CF6,color:#fff
    style I fill:#059669,color:#fff
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

### **CRM Pipeline Board Wireframe**
```
┌─────────────────────────────────────────────────────────┐
│ [Sidebar Navigation] │ CRM Pipeline Management         │
├─────────────────────────────────────────────────────────┤
│ 👥 Client Pipeline              [Filter] [Sort] [Export] │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────┐ │
│ │   Leads     │ │  Qualified  │ │  Proposal   │ │ Won │ │
│ │ (12 deals)  │ │  (8 deals)  │ │  (5 deals)  │ │ (3) │ │
│ │             │ │             │ │             │ │     │ │
│ │ ┌─────────┐ │ │ ┌─────────┐ │ │ ┌─────────┐ │ │ ┌─┐ │ │
│ │ │Company A │ │ │ │Company B│ │ │ │Company C│ │ │ │D│ │ │
│ │ │$15,000   │ │ │ │$25,000  │ │ │ │$35,000  │ │ │ │$│ │ │
│ │ │🟡 Hot    │ │ │ │🟢 Warm  │ │ │ │🟠 Cold   │ │ │ │5│ │ │
│ │ └─────────┘ │ │ └─────────┘ │ │ └─────────┘ │ │ │0│ │ │
│ │             │ │             │ │             │ │ │K│ │ │
│ │ ┌─────────┐ │ │ ┌─────────┐ │ │ ┌─────────┐ │ │ └─┘ │ │
│ │ │Company E │ │ │ │Company F│ │ │ │Company G│ │ │     │ │
│ │ │$12,000   │ │ │ │$18,000  │ │ │ │$22,000  │ │ │     │ │
│ │ │🟡 Hot    │ │ │ │🟢 Warm  │ │ │ │🟠 Cold   │ │ │     │ │
│ │ └─────────┘ │ │ └─────────┘ │ │ └─────────┘ │ │     │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────┘ │
└─────────────────────────────────────────────────────────┘
```

### **Sponsor Discovery AI Wireframe**
```
┌─────────────────────────────────────────────────────────┐
│ [Sidebar Navigation] │ AI Sponsor Discovery             │
├─────────────────────────────────────────────────────────┤
│ 🤖 AI Insights & Recommendations    [Refresh] [Export]  │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🎯 AI Match Score: 95%                              │ │
│ │ Perfect match for Tech Conference 2024             │ │
│ │ [View Details] [Contact] [Save]                     │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 📊 Discovery Analytics                              │ │
│ │ • 50 AI matches found                               │ │
│ │ • 85% accuracy rate                                 │ │
│ │ • 12 hot leads identified                           │ │
│ │ • $2.5M pipeline value                              │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🔍 AI-Generated Matches                             │ │
│ │ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ │ │
│ │ │Company A│ │Company B│ │Company C│ │Company D│ │ │
│ │ │Score:95%│ │Score:87%│ │Score:82%│ │Score:78%│ │ │
│ │ │$50K     │ │$35K     │ │$25K     │ │$20K     │ │ │
│ │ └─────────┘ └─────────┘ └─────────┘ └─────────┘ │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### **Venue Details Page Wireframe**
```
┌─────────────────────────────────────────────────────────┐
│ [Sidebar Navigation] │ Convention Center Downtown       │
├─────────────────────────────────────────────────────────┤
│ 🏢 Venue Overview                    [Edit] [Book] [Share] │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [Venue Image Gallery - Swipeable]                  │ │
│ │ 📍 123 Business Ave, Toronto, ON                  │ │
│ │ 👥 Capacity: 500 | 💰 $2,500/day | ⭐ 4.8/5       │ │
│ │ ✅ WiFi, Parking, AV, Catering, Accessibility     │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 📊 Performance Metrics                             │ │
│ │ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │ │
│ │ │ 12       │ │ $45,200 │ │ 78%     │ │ 4.8/5   │   │ │
│ │ │ Bookings │ │ Revenue │ │ Occupancy│ │ Rating  │   │ │
│ │ └─────────┘ └─────────┘ └─────────┘ └─────────┘   │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 📅 Availability Calendar                            │ │
│ │ [Calendar Grid with Available/Booked Dates]        │ │
│ │ 🟢 Available  🟡 Tentative  🔴 Booked            │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 📋 Recent Bookings                                  │ │
│ │ • Tech Conference 2024 - Mar 15, 2024 - $2,500    │ │
│ │ • Startup Pitch Night - Mar 22, 2024 - $2,500     │ │
│ │ • Corporate Workshop - Mar 28, 2024 - $2,500      │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

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

### **Component Hierarchy**
```
EventOS Design System
├── Layout Components
│   ├── Sidebar (Navigation)
│   ├── Header (Page titles)
│   ├── Container (Content wrapper)
│   └── Grid (Responsive layout)
├── Data Display Components
│   ├── Card (Information display)
│   ├── Table (Data listing)
│   ├── List (Item display)
│   └── Badge (Status indicators)
├── Form Components
│   ├── Input (Text fields)
│   ├── Select (Dropdowns)
│   ├── Button (Actions)
│   └── Checkbox (Selections)
└── Feedback Components
    ├── Alert (Notifications)
    ├── Skeleton (Loading states)
    └── Toast (Messages)
```

---

## 🔄 **DATA FLOW & INTEGRATION DIAGRAMS**

### **Complete Data Flow Architecture**
```mermaid
graph TB
    subgraph "Frontend Layer"
        A[React Components] --> B[shadcn/ui Library]
        B --> C[EventOS Design System]
        C --> D[Mobile-First Layout]
    end
    
    subgraph "State Management Layer"
        E[Component State] --> F[Local Storage]
        F --> G[Session Management]
        G --> H[User Preferences]
    end
    
    subgraph "Data Layer (Mock Data)"
        I[Dashboard Metrics] --> J[Analytics Data]
        J --> K[Event Information]
        K --> L[User Profiles]
        L --> M[Venue Details]
        M --> N[CRM Pipeline]
        N --> O[Sponsor Data]
    end
    
    subgraph "Integration Points"
        P[Supabase Connection] --> Q[Real-time Updates]
        Q --> R[Authentication]
        R --> S[File Storage]
        S --> T[AI Services]
    end
    
    A --> E
    E --> I
    I --> P
    
    style A fill:#8B5CF6,color:#fff
    style I fill:#1E40AF,color:#fff
    style P fill:#059669,color:#fff
```

### **User Authentication Flow**
```mermaid
sequenceDiagram
    participant U as User
    participant L as Login Page
    participant A as Auth System
    participant D as Dashboard
    participant S as Sidebar
    
    U->>L: Enter credentials
    L->>A: Validate user
    A-->>L: Authentication success
    L->>D: Redirect to dashboard
    D->>S: Load sidebar navigation
    S-->>D: Navigation ready
    D-->>U: Complete dashboard view
    
    Note over U,S: Seamless authentication flow
```

### **Mobile Navigation Flow**
```mermaid
flowchart TD
    A[Mobile User] --> B[Tap Hamburger Menu]
    B --> C[Sidebar Slides In]
    C --> D[User Selects Page]
    D --> E[Navigate to Page]
    E --> F[Sidebar Slides Out]
    F --> G[Page Content Loads]
    G --> H[Touch Gestures Available]
    
    I[Swipe Right] --> J[Open Sidebar]
    J --> K[Navigation Options]
    K --> L[Select Destination]
    L --> M[Close Sidebar]
    M --> N[Page Transition]
    
    style A fill:#8B5CF6,color:#fff
    style C fill:#1E40AF,color:#fff
    style G fill:#059669,color:#fff
```

### **Component Integration Flow**
```mermaid
graph LR
    subgraph "Layout Components"
        A[Sidebar] --> B[Header]
        B --> C[Container]
        C --> D[Grid]
    end
    
    subgraph "Data Display Components"
        E[Card] --> F[Table]
        F --> G[List]
        G --> H[Badge]
    end
    
    subgraph "Form Components"
        I[Input] --> J[Select]
        J --> K[Button]
        K --> L[Checkbox]
    end
    
    subgraph "Feedback Components"
        M[Alert] --> N[Toast]
        N --> O[Skeleton]
        O --> P[Spinner]
    end
    
    A --> E
    E --> I
    I --> M
    
    style A fill:#8B5CF6,color:#fff
    style E fill:#1E40AF,color:#fff
    style I fill:#059669,color:#fff
    style M fill:#DC2626,color:#fff
```

### **Responsive Design Flow**
```mermaid
flowchart TD
    A[Device Detection] --> B{Screen Size?}
    
    B -->|Mobile < 640px| C[Mobile Layout]
    C --> D[Hamburger Menu]
    D --> E[Stacked Cards]
    E --> F[Touch Gestures]
    F --> G[Swipe Navigation]
    
    B -->|Tablet 640-1024px| H[Tablet Layout]
    H --> I[Sidebar + Content]
    I --> J[2-Column Grid]
    J --> K[Touch Optimized]
    
    B -->|Desktop > 1024px| L[Desktop Layout]
    L --> M[Fixed Sidebar]
    M --> N[Multi-Column Grid]
    N --> O[Power User Features]
    
    style A fill:#8B5CF6,color:#fff
    style C fill:#1E40AF,color:#fff
    style H fill:#059669,color:#fff
    style L fill:#DC2626,color:#fff
```

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

---

## 🎯 **COMPREHENSIVE USER JOURNEY FLOWS**

### **Complete User Journey - Event Organizer**
```mermaid
journey
    title Event Organizer Complete Journey
    section Login & Setup
      User logs in: 5: User
      Dashboard loads: 5: User
      View analytics: 4: User
    section Event Creation
      Create new event: 5: User
      Select venue: 4: User
      Set pricing: 3: User
      Publish event: 5: User
    section Management
      Track bookings: 5: User
      Manage attendees: 4: User
      Generate reports: 3: User
    section Success
      Event success: 5: User
      Revenue generated: 5: User
```

### **Complete User Journey - Venue Manager**
```mermaid
journey
    title Venue Manager Complete Journey
    section Venue Setup
      Login to system: 5: Venue Manager
      View venue dashboard: 5: Venue Manager
      Update availability: 4: Venue Manager
    section Booking Management
      Receive booking requests: 4: Venue Manager
      Review event details: 3: Venue Manager
      Approve bookings: 5: Venue Manager
    section Performance
      Track venue performance: 5: Venue Manager
      Manage amenities: 4: Venue Manager
      Generate revenue: 5: Venue Manager
```

### **Complete User Journey - CRM User**
```mermaid
journey
    title CRM User Complete Journey
    section Client Management
      Login to CRM: 5: CRM User
      View client pipeline: 5: CRM User
      Manage deals: 4: CRM User
    section Deal Process
      Qualify leads: 3: CRM User
      Create proposals: 4: CRM User
      Track negotiations: 4: CRM User
    section Success
      Close deals: 5: CRM User
      Generate revenue: 5: CRM User
      Client satisfaction: 5: CRM User
```

### **Complete User Journey - Sponsor**
```mermaid
journey
    title Sponsor Complete Journey
    section Discovery
      Access sponsor portal: 5: Sponsor
      Browse events: 4: Sponsor
      AI recommendations: 5: Sponsor
    section Engagement
      Submit proposals: 4: Sponsor
      Negotiate terms: 3: Sponsor
      Sign contracts: 4: Sponsor
    section Success
      Track performance: 5: Sponsor
      Measure ROI: 5: Sponsor
      Renew partnerships: 5: Sponsor
```

### **Mobile User Experience Flow**
```mermaid
flowchart TD
    A[Mobile User Opens App] --> B[Authentication Screen]
    B --> C[Login Success]
    C --> D[Dashboard Loads]
    D --> E[Touch Hamburger Menu]
    E --> F[Sidebar Slides In]
    F --> G[User Selects Page]
    G --> H[Navigation Occurs]
    H --> I[Sidebar Slides Out]
    I --> J[Page Content Loads]
    J --> K[Touch Gestures Available]
    K --> L[User Interacts]
    L --> M[Data Updates]
    M --> N[Success Feedback]
    
    style A fill:#8B5CF6,color:#fff
    style D fill:#1E40AF,color:#fff
    style J fill:#059669,color:#fff
    style N fill:#DC2626,color:#fff
```

### **Cross-Platform Integration Flow**
```mermaid
graph TB
    subgraph "Dashboard System"
        A[Analytics Dashboard] --> B[Calendar View]
        B --> C[Organizer Management]
        C --> D[Venue Management]
        D --> E[Settings]
    end
    
    subgraph "CRM System"
        F[CRM Dashboard] --> G[Client Management]
        G --> H[Pipeline Board]
        H --> I[Reports & Analytics]
    end
    
    subgraph "Sponsor System"
        J[Sponsor Dashboard] --> K[AI Discovery]
        K --> L[Proposal Management]
        L --> M[Contract Management]
        M --> N[Performance Analytics]
    end
    
    subgraph "Integration Points"
        O[Shared Sidebar] --> P[Common Navigation]
        P --> Q[Unified Search]
        Q --> R[Cross-System Data]
    end
    
    A --> F
    F --> J
    J --> O
    
    style A fill:#8B5CF6,color:#fff
    style F fill:#1E40AF,color:#fff
    style J fill:#059669,color:#fff
    style O fill:#DC2626,color:#fff
```

---

## 🎯 **INTERACTION PATTERNS & USER EXPERIENCE**

### **Touch Gesture Specifications**
```
Mobile Gestures:
├── Swipe Left/Right → Navigate between sections
├── Swipe Up → Open details (bottom sheet)
├── Swipe Down → Pull-to-refresh data
├── Pinch/Zoom → Zoom charts and analytics
├── Long Press → Context menu for actions
├── Double Tap → Quick actions
├── Tap & Hold → Drag and drop (calendar, pipeline)
└── Tap Hamburger [☰] → Toggle collapsible sidebar

Mobile Sidebar Navigation:
├── Tap [☰] → Open sidebar overlay (slide in from left)
├── Tap [✕] → Close sidebar overlay (slide out to left)
├── Tap Outside → Close sidebar (when open)
├── Swipe Right → Open sidebar (from left edge)
├── Swipe Left → Close sidebar (when open)
└── Back Button → Close sidebar (Android)
```

### **Animation & Transition Specifications**
```
Page Transitions:
├── Fade In/Out → 200ms ease-in-out
├── Slide In → 300ms ease-out
├── Scale Up → 250ms ease-out
└── Stagger → 100ms delay between items

Component Animations:
├── Hover States → 150ms ease-in-out
├── Loading Spinners → 1s linear infinite
├── Progress Bars → 500ms ease-out
└── Micro-interactions → 100ms ease-out
```

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
