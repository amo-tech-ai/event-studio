# 🛠️ EventOS Dashboard Multi-Step Fix Prompt

**Purpose:** Systematic step-by-step approach to fix all dashboard issues and achieve 100% production readiness.

---

## 🎯 **OVERVIEW**

This prompt provides a structured, multi-step approach to fix the EventOS dashboard based on our comprehensive audit findings. Each step builds upon the previous one, ensuring a logical progression from critical infrastructure to individual page implementations.

---

## 📋 **STEP 1: CRITICAL INFRASTRUCTURE FIXES**

### **1.1 Database Connection Validation**
```
PROMPT: "Validate all Supabase database connections and ensure the dashboard is connected to the local Supabase instance. Check that all main stats (upcoming events, total bookings, tickets sold) are displaying real data from the database. If any fields show '...' or mock data, fix the database connections immediately."
```

### **1.2 TypeScript Types Integration**
```
PROMPT: "Generate and integrate TypeScript types for the Supabase database schema. Update the Supabase client configuration to use the generated types for better type safety and developer experience. Ensure all database interactions are properly typed."
```

### **1.3 Authentication System**
```
PROMPT: "Verify the authentication bypass system is working correctly for development. Ensure VITE_DISABLE_AUTH is properly configured and the ProtectedRoute component is functioning. Test that the dashboard is accessible without authentication during development."
```

---

## 📋 **STEP 2: SHARED COMPONENTS & UTILITIES**

### **2.1 Dashboard Shared Components**
```
PROMPT: "Create reusable dashboard components in src/components/dashboard/. Include: DashboardCard, StatsCard, LoadingSpinner, ErrorBoundary, EmptyState, and Pagination components. These should be production-ready with proper TypeScript types and responsive design."
```

### **2.2 Data Fetching Hooks**
```
PROMPT: "Create comprehensive React Query hooks for all dashboard data. Include: useEvents, useBookings, useTickets, useVenues, useAnalytics, useDashboardStats. Each hook should handle loading states, error states, and data caching properly."
```

### **2.3 Utility Functions**
```
PROMPT: "Create utility functions for data formatting, date handling, currency formatting, and status mapping. Place these in src/utils/dashboard.ts with proper TypeScript types and comprehensive error handling."
```

---

## 📋 **STEP 3: CORE FEATURE MODULES**

### **3.1 Events Feature Module**
```
PROMPT: "Complete the Events feature module in src/features/events/. Implement: EventCard, EventList, EventFilters, EventForm, EventDetails components. Ensure all CRUD operations work with the database and include proper validation, error handling, and loading states."
```

### **3.2 Bookings Feature Module**
```
PROMPT: "Create the Bookings feature module in src/features/bookings/. Implement: BookingCard, BookingList, BookingFilters, BookingDetails components. Connect to the orders table in Supabase and display real booking data with proper status indicators."
```

### **3.3 Analytics Feature Module**
```
PROMPT: "Build the Analytics feature module in src/features/analytics/. Include: RevenueChart, AttendanceChart, EventPerformanceChart, and DashboardMetrics components. Use real data from the database to show meaningful analytics and insights."
```

### **3.4 Venues Feature Module**
```
PROMPT: "Develop the Venues feature module in src/features/venues/. Create: VenueCard, VenueList, VenueForm, VenueDetails components. Ensure proper integration with the venues table and include capacity, amenities, and location information."
```

---

## 📋 **STEP 4: INDIVIDUAL PAGE FIXES**

### **4.1 Dashboard Home Page**
```
PROMPT: "Fix the main dashboard page (src/pages/Dashboard.tsx). Ensure all main stats display real data, implement proper loading and error states, and add quick action buttons that work. Include recent events, upcoming bookings, and key metrics."
```

### **4.2 Events Page**
```
PROMPT: "Complete the Events page (src/pages/DashboardEvents.tsx). Implement: search functionality, filtering by status/type, sorting options, pagination, and bulk actions. Ensure all event data is real and properly formatted."
```

### **4.3 Bookings Page**
```
PROMPT: "Fix the Bookings page (src/pages/DashboardBookings.tsx). Replace mock data with real booking information from the orders table. Implement: booking status management, customer details, payment tracking, and booking analytics."
```

### **4.4 Analytics Page**
```
PROMPT: "Build the Analytics page (src/pages/DashboardAnalytics.tsx). Create comprehensive analytics dashboard with: revenue charts, attendance metrics, event performance, customer insights, and export functionality."
```

### **4.5 Venues Page**
```
PROMPT: "Develop the Venues page (src/pages/DashboardVenues.tsx). Display all venues with: capacity information, amenities, location details, booking availability, and venue management tools."
```

### **4.6 Settings Page**
```
PROMPT: "Create the Settings page (src/pages/DashboardSettings.tsx). Include: user profile management, notification preferences, API settings, data export options, and system configuration."
```

---

## 📋 **STEP 5: ADVANCED FEATURES**

### **5.1 Real-time Updates**
```
PROMPT: "Implement real-time updates using Supabase subscriptions. Add live updates for: booking counts, event status changes, new orders, and analytics data. Ensure proper cleanup of subscriptions to prevent memory leaks."
```

### **5.2 Search & Filtering**
```
PROMPT: "Implement comprehensive search and filtering across all pages. Include: global search, advanced filters, saved filter presets, and search history. Make it fast and responsive with proper debouncing."
```

### **5.3 Data Export & Reporting**
```
PROMPT: "Add data export functionality for all major data types. Include: CSV export for events/bookings, PDF reports for analytics, and scheduled report generation. Ensure proper data formatting and error handling."
```

### **5.4 Mobile Responsiveness**
```
PROMPT: "Ensure all dashboard pages are fully responsive and work perfectly on mobile devices. Test on various screen sizes, implement touch-friendly interactions, and optimize loading performance for mobile networks."
```

---

## 📋 **STEP 6: TESTING & VALIDATION**

### **6.1 Unit Testing**
```
PROMPT: "Create comprehensive unit tests for all dashboard components, hooks, and utilities. Use React Testing Library and Jest. Cover: component rendering, user interactions, error states, and edge cases."
```

### **6.2 Integration Testing**
```
PROMPT: "Implement integration tests for the complete dashboard workflow. Test: user authentication, data loading, CRUD operations, real-time updates, and error handling scenarios."
```

### **6.3 E2E Testing**
```
PROMPT: "Create end-to-end tests using Playwright for critical user journeys. Test: complete event creation workflow, booking management, analytics viewing, and settings configuration."
```

---

## 📋 **STEP 7: PERFORMANCE OPTIMIZATION**

### **7.1 Code Splitting**
```
PROMPT: "Implement code splitting and lazy loading for all dashboard pages. Use React.lazy() and Suspense to reduce initial bundle size and improve loading performance."
```

### **7.2 Data Caching**
```
PROMPT: "Optimize React Query configuration for better caching and performance. Implement: proper cache invalidation, background refetching, optimistic updates, and stale-while-revalidate patterns."
```

### **7.3 Bundle Optimization**
```
PROMPT: "Analyze and optimize the bundle size. Remove unused dependencies, implement tree shaking, and optimize imports. Use bundle analyzer to identify and eliminate unnecessary code."
```

---

## 📋 **STEP 8: PRODUCTION READINESS**

### **8.1 Error Handling**
```
PROMPT: "Implement comprehensive error handling across the entire dashboard. Add: global error boundaries, user-friendly error messages, retry mechanisms, and error reporting to external services."
```

### **8.2 Security Audit**
```
PROMPT: "Perform security audit of the dashboard. Check: input validation, XSS protection, CSRF protection, secure data handling, and proper authentication/authorization."
```

### **8.3 Accessibility**
```
PROMPT: "Ensure the dashboard meets WCAG 2.1 AA accessibility standards. Add: proper ARIA labels, keyboard navigation, screen reader support, color contrast compliance, and focus management."
```

### **8.4 Documentation**
```
PROMPT: "Create comprehensive documentation for the dashboard. Include: component documentation, API documentation, user guides, developer setup instructions, and deployment procedures."
```

---

## 🚀 **EXECUTION STRATEGY**

### **Phase 1: Foundation (Steps 1-2)**
- Focus on critical infrastructure and shared components
- Ensure solid foundation before building features
- Validate database connections and authentication

### **Phase 2: Core Features (Steps 3-4)**
- Build feature modules systematically
- Fix individual pages one by one
- Test each page thoroughly before moving to the next

### **Phase 3: Enhancement (Steps 5-6)**
- Add advanced features and real-time capabilities
- Implement comprehensive testing
- Ensure mobile responsiveness

### **Phase 4: Production (Steps 7-8)**
- Optimize performance and bundle size
- Ensure production readiness
- Complete security and accessibility audits

---

## 📊 **SUCCESS METRICS**

### **Completion Criteria:**
- ✅ All pages display real data (no mock data)
- ✅ All CRUD operations work correctly
- ✅ Real-time updates functioning
- ✅ Mobile responsive design
- ✅ Comprehensive error handling
- ✅ 100% test coverage for critical paths
- ✅ Performance score > 90
- ✅ Accessibility compliance
- ✅ Security audit passed

### **Quality Gates:**
- Each step must pass validation before proceeding
- No critical errors or warnings
- All tests passing
- Performance benchmarks met
- User acceptance testing completed

---

## 🎯 **USAGE INSTRUCTIONS**

1. **Start with Step 1** and complete each sub-step thoroughly
2. **Validate each step** before moving to the next
3. **Test functionality** after each major change
4. **Document progress** and any issues encountered
5. **Iterate and improve** based on testing results

**Remember:** Each step builds upon the previous one. Don't skip steps or rush through the process. Quality over speed ensures a production-ready dashboard.

---

**Generated:** 2025-01-17  
**Purpose:** Systematic EventOS Dashboard Fix  
**Target:** 100% Production Ready Dashboard
