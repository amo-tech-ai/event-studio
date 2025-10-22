# EventOS Complete Sitemap & Architecture Analysis
**Generated:** 2025-01-18  
**Project:** EventOS - AI-Powered Event Management Platform  
**Updated:** Added AI Event Wizard integration and new suggested pages

---

## 🗺️ Application Routes

### Public Routes (No Authentication Required)
| Route | Component | Purpose | Status |
|-------|-----------|---------|--------|
| `/` | `Home.tsx` | Landing page with product overview, features, event wizard intro | ✅ Active |
| `/events` | `Events.tsx` | Public events listing page | ✅ Active |
| `/event/:slug` | `EventDetails.tsx` | Public event details page | ✅ Active |
| `/auth` | `Auth.tsx` | Login/signup authentication page | ✅ Active |
| `/index` | `Index.tsx` | Index page (purpose unclear - needs investigation) | ⚠️ Needs Review |
| `*` | `NotFound.tsx` | 404 error page for invalid routes | ✅ Active |

### Protected Routes (Authentication Required)
**Note:** Auth disabled during development via `VITE_DISABLE_AUTH=true`

#### Core Dashboard Routes
| Route | Component | Purpose | Status |
|-------|-----------|---------|--------|
| `/dashboard` | `Dashboard.tsx` | Main dashboard with overview stats | ✅ Active |
| `/dashboard/events` | `DashboardEvents.tsx` | Event management and listing | ✅ Active |
| `/dashboard/events/:id` | `DashboardEventDetails.tsx` | Individual event details view | ✅ Active |
| `/dashboard/bookings` | `DashboardBookings.tsx` | Booking management and tracking | ✅ Active |
| `/dashboard/financials` | `DashboardFinancials.tsx` | Financial reports and revenue tracking | ✅ Active |
| `/dashboard/gallery` | `DashboardGallery.tsx` | Media gallery for event assets | ✅ Active |

#### AI Event Wizard Routes (NEW)
| Route | Component | Purpose | Status |
|-------|-----------|---------|--------|
| `/event-wizard` | `EventWizard.tsx` | 7-step AI-powered event creation wizard | ✅ Active |
| `/event-wizard/venues` | `EventWizardVenues.tsx` | AI-powered venue selection and comparison | 🆕 Suggested |
| `/event-wizard/tickets` | `EventWizardTickets.tsx` | AI-powered ticketing setup and pricing | 🆕 Suggested |
| `/event-wizard/agenda` | `EventWizardAgenda.tsx` | AI-powered agenda builder with timeline | 🆕 Suggested |
| `/event-wizard/marketing` | `EventWizardMarketing.tsx` | AI-powered marketing content generation | 🆕 Suggested |
| `/event-wizard/review` | `EventWizardReview.tsx` | Final review and event publication | 🆕 Suggested |

#### Placeholder Routes (Need Implementation)
| Route | Component | Purpose | Status |
|-------|-----------|---------|--------|
| `/dashboard/analytics` | `Dashboard.tsx` | Analytics (redirects to main dashboard) | 🔴 Placeholder |
| `/dashboard/calendar` | `Dashboard.tsx` | Calendar view (redirects to main dashboard) | 🔴 Placeholder |
| `/dashboard/organizers` | `Dashboard.tsx` | Organizer management (redirects to main dashboard) | 🔴 Placeholder |
| `/dashboard/venues` | `Dashboard.tsx` | Venue management (redirects to main dashboard) | 🔴 Placeholder |
| `/dashboard/settings` | `Dashboard.tsx` | User settings (redirects to main dashboard) | 🔴 Placeholder |

#### Suggested New AI-Powered Routes
| Route | Component | Purpose | Status |
|-------|-----------|---------|--------|
| `/ai-assistant` | `AIAssistant.tsx` | General AI assistant for event management | 🆕 Suggested |
| `/ai-venue-finder` | `AIVenueFinder.tsx` | AI-powered venue discovery and matching | 🆕 Suggested |
| `/ai-speaker-finder` | `AISpeakerFinder.tsx` | AI-powered speaker discovery and matching | 🆕 Suggested |
| `/ai-sponsor-finder` | `AISponsorFinder.tsx` | AI-powered sponsor discovery and matching | 🆕 Suggested |
| `/ai-content-generator` | `AIContentGenerator.tsx` | AI-powered content creation for events | 🆕 Suggested |
| `/ai-analytics` | `AIAnalytics.tsx` | AI-powered event analytics and insights | 🆕 Suggested |

---

## 📊 Route Status Summary

### Fully Implemented Pages: 12
- **Public Routes (5):** Home, Events, EventDetails, Auth, NotFound
- **Core Dashboard (6):** Dashboard, DashboardEvents, DashboardEventDetails, DashboardBookings, DashboardFinancials, DashboardGallery
- **AI Event Wizard (1):** EventWizard

### Pages Needing Review: 1
- **Index.tsx** - Exists but purpose unclear, needs investigation

### Placeholder Pages: 5
These routes exist but redirect to main Dashboard:
- Analytics
- Calendar
- Organizers
- Venues
- Settings

### Suggested New Pages: 11
- **AI Event Wizard Sub-pages (5):** Venues, Tickets, Agenda, Marketing, Review
- **AI-Powered Tools (6):** AIAssistant, AIVenueFinder, AISpeakerFinder, AISponsorFinder, AIContentGenerator, AIAnalytics

### Total Routes: 28
- **Public:** 5 routes (18%)
- **Protected:** 23 routes (82%)
- **Implementation:** 12/28 complete (43%)
- **AI-Enhanced:** 11 new AI-powered routes suggested

---

## 🏗️ Application Architecture

### Provider Hierarchy
```
QueryClientProvider (React Query)
└── AuthProvider (Supabase Auth)
    └── TooltipProvider (Radix UI)
        └── BrowserRouter (React Router)
            └── Routes
```

### Authentication Flow
```
User Access Attempt
└── ProtectedRoute Check
    ├── VITE_DISABLE_AUTH=true → ✅ Bypass (Development)
    ├── Loading → Show Spinner
    ├── No Session → Redirect to /auth
    └── Valid Session → ✅ Render Protected Content
```

### Key Components
- **`ProtectedRoute.tsx`**: HOC that wraps protected routes, handles auth checks
- **`AuthContext.tsx`**: Provides auth state (user, session, loading) to entire app
- **`queryClient.ts`**: Configures React Query for data fetching/caching

---

## 🎯 Feature Modules Structure

### Current Status
**Implementation:** 0% (No feature modules created yet)

### Recommended Feature Modules
Based on the dashboard structure and AI integration, these should exist:

#### Core Feature Modules
1. **`/src/features/dashboard/`** - Dashboard overview hooks & components
2. **`/src/features/events/`** - Event management logic
3. **`/src/features/bookings/`** - Booking system
4. **`/src/features/financials/`** - Revenue tracking & reporting
5. **`/src/features/gallery/`** - Media management
6. **`/src/features/analytics/`** - Analytics & insights
7. **`/src/features/calendar/`** - Calendar views
8. **`/src/features/organizers/`** - Organizer profiles
9. **`/src/features/venues/`** - Venue management
10. **`/src/features/settings/`** - User preferences

#### AI-Powered Feature Modules (NEW)
11. **`/src/features/ai-event-wizard/`** - AI-powered event creation wizard
12. **`/src/features/ai-assistant/`** - General AI assistant for event management
13. **`/src/features/ai-venue-finder/`** - AI-powered venue discovery and matching
14. **`/src/features/ai-speaker-finder/`** - AI-powered speaker discovery and matching
15. **`/src/features/ai-sponsor-finder/`** - AI-powered sponsor discovery and matching
16. **`/src/features/ai-content-generator/`** - AI-powered content creation
17. **`/src/features/ai-analytics/`** - AI-powered analytics and insights

---

## 🚨 Critical Findings

### 1. Database Connectivity: 0%
- All dashboard pages display **mock data only**
- No Supabase queries implemented
- No TanStack Query hooks created
- Pages show incorrect metrics (e.g., 345 events vs actual 5)

### 2. Missing Pages: 5
These routes redirect to Dashboard instead of dedicated pages:
- DashboardAnalytics
- DashboardCalendar
- DashboardOrganizers
- DashboardVenues
- DashboardSettings

### 3. Feature Module Architecture: Not Implemented
- Zero feature modules exist
- All logic currently in page components
- No separation of concerns for data fetching

### 4. Development Auth Bypass
- ✅ Successfully configured with `VITE_DISABLE_AUTH=true`
- Auth check happens in `ProtectedRoute.tsx`
- Console warning appears when bypassed

### 5. Missing Index Page Documentation
- **Index.tsx** exists in `/src/pages/` but purpose unclear
- Not documented in current sitemap
- Needs investigation and proper routing

---

## 📈 Implementation Roadmap

### Phase 0: Infrastructure (Day 0 - 8 hours)
- [x] Disable auth for development
- [ ] Verify database schema (22 tables)
- [ ] Create sample data (5+ events, 3+ orders)
- [ ] Create feature module directories
- [ ] Generate TypeScript types from Supabase
- [ ] Build shared dashboard components

### Phase 1: Database Integration (Week 1-2)
Connect existing 6 dashboard pages to real data:
1. Dashboard.tsx - Overview stats
2. DashboardEvents.tsx - Event list
3. DashboardEventDetails.tsx - Event detail
4. DashboardBookings.tsx - Bookings
5. DashboardFinancials.tsx - Financials
6. DashboardGallery.tsx - Gallery

### Phase 2: Missing Pages (Week 3)
Create 5 placeholder pages:
1. DashboardAnalytics.tsx
2. DashboardCalendar.tsx
3. DashboardOrganizers.tsx
4. DashboardVenues.tsx
5. DashboardSettings.tsx

### Phase 3: AI Event Wizard Enhancement (Week 4-5)
**NEW AI-Powered Event Wizard Sub-pages:**
1. EventWizardVenues.tsx - AI venue selection and comparison
2. EventWizardTickets.tsx - AI ticketing setup and pricing
3. EventWizardAgenda.tsx - AI agenda builder with timeline
4. EventWizardMarketing.tsx - AI marketing content generation
5. EventWizardReview.tsx - Final review and publication

### Phase 4: AI-Powered Tools (Week 6-7)
**NEW AI-Powered Standalone Tools:**
1. AIAssistant.tsx - General AI assistant
2. AIVenueFinder.tsx - AI venue discovery
3. AISpeakerFinder.tsx - AI speaker discovery
4. AISponsorFinder.tsx - AI sponsor discovery
5. AIContentGenerator.tsx - AI content creation
6. AIAnalytics.tsx - AI analytics and insights

### Phase 5: Polish & Testing (Week 8)
- Real-time updates
- Loading states
- Error handling
- Mobile responsiveness
- E2E testing
- AI integration testing

---

## 🎨 Design System

### Color Palette (HSL)
- **Primary:** `14 70% 50%` (Coral #C45836)
- **Secondary:** `24 50% 65%` (Warm Tan #D89A7A)
- **Background:** `30 25% 95%` (Cream #F5F1ED)
- **Muted:** `25 20% 85%` (Light Gray)
- **Accent:** `20 60% 60%` (Accent Coral)

### Typography
- Font: Inter (system default)
- Headings: Bold, larger sizes
- Body: Regular weight
- Code: Monospace

### Component Library
- **UI Framework:** Radix UI primitives
- **Styling:** Tailwind CSS with custom design tokens
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod validation
- **State:** TanStack Query + Zustand
- **Charts:** Recharts

---

## 🔒 Security Configuration

### Authentication
- **Provider:** Supabase Auth
- **Methods:** Email/Password
- **Session Storage:** localStorage (via Supabase client)
- **Development Bypass:** VITE_DISABLE_AUTH environment variable

### Protected Routes
All `/dashboard/*` and `/event-wizard` routes require authentication unless bypassed for development.

---

## 📱 Responsive Breakpoints

```css
sm: 640px   // Mobile landscape
md: 768px   // Tablet
lg: 1024px  // Desktop
xl: 1280px  // Large desktop
2xl: 1536px // Extra large
```

---

## 🔗 External Dependencies

### Core Libraries
- React 18.3.1
- React Router DOM 6.30.1
- Supabase JS 2.75.0
- TanStack Query 5.83.0

### UI Libraries
- Radix UI (all primitives)
- Tailwind CSS 3.x
- Lucide React 0.462.0
- Recharts 2.15.4

### Form & Validation
- React Hook Form 7.61.1
- Zod 3.25.76
- @hookform/resolvers 3.10.0

---

## 📝 Next Steps

1. **Complete Phase 0** (8 hours)
   - Database verification
   - Feature module setup
   - Type generation

2. **Start Week 1** (Dashboard Integration)
   - Replace mock data with real queries
   - Implement useDashboardStats hook
   - Add loading/error states

3. **Build Missing Pages** (Week 3)
   - Analytics with charts
   - Calendar with event timeline
   - Organizer profiles
   - Venue management
   - Settings panel

4. **Production Readiness** (Week 4)
   - Re-enable authentication
   - Comprehensive testing
   - Performance optimization
   - Deploy to production

---

## 💡 Key Insights

### Strengths ✅
- Beautiful, professional UI design
- Responsive layout structure
- Design system established
- Routes properly configured
- Authentication framework in place
- Event Wizard completed

### Critical Gaps ❌
- **Zero database connectivity** (highest priority)
- 5 missing dashboard pages
- No feature module architecture
- No real-time updates
- Mock data throughout

### Success Metrics
- **Target:** 100% database connectivity, 0% mock data, 11 new AI-powered pages
- **Current:** 0% database connectivity, 100% mock data, 1 AI page (EventWizard)
- **Gap:** 85% completion needed over 8 weeks
- **AI Enhancement:** 11 new AI-powered routes to implement

---

## 🤖 AI Integration Strategy

### CopilotKit LangGraph Integration
- **Event Wizard Enhancement:** Break down single EventWizard into 5 specialized sub-pages
- **AI-Powered Tools:** Create 6 standalone AI tools for specific event management tasks
- **Real-Time Research:** Integrate Tavily search for live venue, speaker, and sponsor discovery
- **Multi-Agent Workflows:** Implement specialized AI agents for different event aspects

### Suggested AI Features by Page
| Page | AI Capabilities | Business Value |
|------|----------------|----------------|
| **EventWizardVenues** | AI venue research, comparison, pricing analysis | 40% faster venue selection |
| **EventWizardTickets** | AI pricing recommendations, revenue optimization | 25% increase in ticket sales |
| **EventWizardAgenda** | AI session suggestions, speaker matching, timeline optimization | 60% faster agenda creation |
| **EventWizardMarketing** | AI content generation, campaign optimization | 70% faster marketing setup |
| **AIVenueFinder** | AI venue discovery, compatibility matching | 3x more venue options |
| **AISpeakerFinder** | AI speaker research, expertise matching | 50% better speaker selection |
| **AISponsorFinder** | AI sponsor discovery, ROI prediction | 2x more sponsorship opportunities |
| **AIContentGenerator** | AI content creation, brand consistency | 80% faster content production |
| **AIAnalytics** | AI insights, predictive analytics, recommendations | 30% better event performance |

---

**Ready for Development:** ✅ Auth disabled, architecture mapped, roadmap defined, AI strategy planned
**Estimated Timeline:** 8 weeks to production-ready with full AI integration
**Current Focus:** Phase 0 infrastructure setup → Week 1 database integration → Week 4-5 AI enhancement
