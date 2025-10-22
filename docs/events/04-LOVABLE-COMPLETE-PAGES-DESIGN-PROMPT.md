# 🎨 Lovable Complete Pages Design Prompt

## 🎯 **MISSION: Design Complete EventOS Dashboard & AI Wizard Pages**

**Project:** EventOS - AI-Powered Event Management Platform  
**Designer:** Lovable AI  
**Focus:** UI/UX Design, Visual Components, User Experience  
**Timeline:** 2-3 days for complete implementation  

---

## 📋 **DESIGN BRIEF OVERVIEW**

You are tasked with creating **9 missing pages** for EventOS that will complete the dashboard and AI wizard functionality. These pages must match the existing EventOS design system, be mobile-first responsive, and provide excellent user experience.

### **Pages to Design:**
1. **Dashboard Analytics** - Event performance metrics and insights
2. **Dashboard Calendar** - Visual calendar for event scheduling  
3. **Dashboard Organizers** - Organizer profiles and management
4. **Dashboard Venues** - Venue listing and management
5. **Dashboard Settings** - Account and system configuration
6. **AI Venue Selection** - AI-powered venue recommendations
7. **AI Ticketing Setup** - AI-assisted ticket configuration
8. **AI Agenda Builder** - AI-generated event schedules
9. **AI Marketing Dashboard** - AI-powered marketing recommendations

---

## 🎨 **DESIGN REQUIREMENTS**

### **Visual Design Standards**
- **Color Scheme:** Use EventOS semantic color tokens (HSL-based)
- **Typography:** Consistent with existing pages (Inter font family)
- **Spacing:** Follow 8px grid system for consistent spacing
- **Components:** Use shadcn/ui component library (27 components available)
- **Icons:** Lucide React icons for consistency
- **Shadows:** Subtle shadows for depth and hierarchy
- **Borders:** Rounded corners (8px radius) for modern look

### **Layout Principles**
- **Mobile-First:** 65% of users are mobile, design for mobile first
- **Grid System:** Use CSS Grid and Flexbox for layouts
- **Card-Based:** Information organized in clean, scannable cards
- **White Space:** Generous spacing for breathing room
- **Visual Hierarchy:** Clear information hierarchy with typography and spacing

### **Responsive Breakpoints**
- **Mobile:** < 640px (primary focus)
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px
- **Large Desktop:** > 1280px

---

## 📱 **PAGE-BY-PAGE DESIGN SPECIFICATIONS**

### **1. Dashboard Analytics Page**

**Purpose:** Event performance metrics, revenue insights, and attendee analytics

**Layout Structure:**
- **Header Section:** Page title "Analytics Dashboard" with date range picker
- **Metrics Grid:** 4 key metric cards in 2x2 grid (mobile: stacked)
- **Charts Section:** Revenue chart, attendee analytics, conversion rates
- **Top Events List:** Best performing events with metrics
- **Export Actions:** PDF and Excel export buttons

**Key Components:**
- **Metric Cards:** Revenue, attendees, conversion rate, top event
- **Line Chart:** Monthly revenue trend (last 6 months)
- **Pie Chart:** Attendee demographics breakdown
- **Bar Chart:** Event performance comparison
- **Data Table:** Top 10 events with performance metrics
- **Export Buttons:** PDF and Excel download options

**Mock Data:**
- Monthly revenue: $45,000
- Total attendees: 1,250
- Conversion rate: 68%
- Top event: "Tech Conference 2024" with 89% satisfaction

**Mobile Considerations:**
- Stack metric cards vertically
- Make charts touch-friendly
- Swipe navigation for chart sections
- Large touch targets for export buttons

---

### **2. Dashboard Calendar Page**

**Purpose:** Visual calendar for event scheduling and availability

**Layout Structure:**
- **Calendar Header:** Month/year navigation with view toggles
- **Calendar Grid:** Monthly view with event blocks
- **Event Details Panel:** Selected event information
- **Quick Actions:** Add event, filter options
- **Availability Indicators:** Color-coded availability status

**Key Components:**
- **Calendar Grid:** Monthly view with navigation
- **Event Blocks:** Color-coded by status (confirmed, tentative, blocked)
- **Event Modal:** Quick event details popup
- **Filter Controls:** Event type, status, date range filters
- **Add Event Button:** Floating action button for quick event creation

**Mock Data:**
- 15 events across next month
- Different statuses: confirmed (green), tentative (yellow), blocked (red)
- Various event types: conferences, workshops, networking
- Time slots: 9 AM - 6 PM typical business hours

**Mobile Considerations:**
- Swipe navigation between months
- Tap to select dates
- Swipe up for event details
- Large touch targets for navigation

---

### **3. Dashboard Organizers Page**

**Purpose:** Organizer profiles, event history, and performance tracking

**Layout Structure:**
- **Header Section:** "Organizers" title with add organizer button
- **Search & Filter:** Search bar with filter dropdowns
- **Organizer Grid:** Organizer cards in responsive grid
- **Performance Metrics:** Individual organizer statistics
- **Quick Actions:** Contact, edit, view events buttons

**Key Components:**
- **Organizer Cards:** Profile photo, name, contact info, metrics
- **Search Bar:** Real-time search with suggestions
- **Filter Dropdown:** Status, event type, performance filters
- **Performance Charts:** Individual organizer metrics
- **Action Buttons:** Contact, edit, view events, archive

**Mock Data:**
- 8 organizer profiles with photos
- Contact information and preferences
- Event history and performance metrics
- Specialization tags (tech, corporate, networking)
- Performance ratings and feedback scores

**Mobile Considerations:**
- Single column layout for organizer cards
- Swipe actions for quick contact
- Collapsible performance sections
- Easy-to-tap action buttons

---

### **4. Dashboard Venues Page**

**Purpose:** Venue listing, management, and relationship tracking

**Layout Structure:**
- **Header Section:** "Venues" title with add venue button
- **Search & Filters:** Search bar with location and capacity filters
- **Venue Grid:** Venue cards with images and key details
- **Map View Toggle:** Switch between list and map view
- **Venue Details:** Capacity, location, amenities, pricing

**Key Components:**
- **Venue Cards:** Image, name, location, capacity, pricing
- **Search Bar:** Search by name, location, or amenities
- **Filter Controls:** Location, capacity, price range, amenities
- **Map Integration:** Visual map view of venues
- **Action Buttons:** View details, contact, book, edit

**Mock Data:**
- 12 venues with high-quality images
- Location details and contact information
- Capacity ranges (50-500 people)
- Pricing tiers and availability
- Amenities: parking, catering, AV equipment, WiFi

**Mobile Considerations:**
- Image-heavy cards with clear information
- Swipe between list and map views
- Touch-friendly filter controls
- Quick contact actions

---

### **5. Dashboard Settings Page**

**Purpose:** Account management, preferences, and system configuration

**Layout Structure:**
- **Profile Section:** User avatar, name, contact information
- **Settings Tabs:** Profile, notifications, security, billing
- **Preference Controls:** Toggle switches and dropdowns
- **Security Options:** Password change, two-factor authentication
- **System Settings:** Theme, language, timezone preferences

**Key Components:**
- **Profile Form:** Avatar upload, name, email, phone
- **Toggle Switches:** Notification preferences
- **Dropdown Menus:** Language, timezone, currency
- **Security Settings:** Password change, 2FA setup
- **Theme Selector:** Light/dark mode toggle
- **Save Buttons:** Primary and secondary actions

**Mock Data:**
- User profile information
- Notification preferences (email, SMS, push)
- Security settings and 2FA status
- System preferences and theme selection
- Billing information and subscription status

**Mobile Considerations:**
- Single column form layout
- Large touch targets for toggles
- Easy-to-use dropdown menus
- Clear save/cancel actions

---

### **6. AI Venue Selection Page**

**Purpose:** AI-powered venue recommendations with intelligent matching

**Layout Structure:**
- **AI Chat Interface:** Conversational venue selection
- **Venue Recommendations:** AI-suggested venues with explanations
- **Comparison Table:** Side-by-side venue comparison
- **Filter Controls:** Location, capacity, budget, amenities
- **Selection Actions:** Choose venue, get more options

**Key Components:**
- **AI Chat Bubble:** "I found 5 venues that match your criteria..."
- **Venue Recommendation Cards:** AI explanations for each suggestion
- **Comparison Table:** Key metrics side-by-side
- **AI Reasoning:** "This venue is perfect because..." explanations
- **Selection Confirmation:** "You selected Convention Center"

**Mock Data:**
- 8 AI-recommended venues with explanations
- AI reasoning for each recommendation
- Comparison metrics: price, capacity, location, amenities
- "Perfect match" indicators and confidence scores
- Alternative suggestions and backup options

**Mobile Considerations:**
- Chat interface optimized for mobile
- Swipeable venue cards
- Easy comparison on small screens
- Clear selection confirmation

---

### **7. AI Ticketing Setup Page**

**Purpose:** AI-assisted ticket configuration with pricing optimization

**Layout Structure:**
- **AI Assistant Panel:** Conversational ticketing guidance
- **Ticket Tier Builder:** Create and configure ticket types
- **Pricing Suggestions:** AI-recommended pricing strategies
- **Capacity Planning:** Attendee capacity and revenue projections
- **Preview Section:** Event page preview with ticket options

**Key Components:**
- **AI Chat Interface:** "Based on similar events, I suggest..."
- **Ticket Tier Cards:** Early Bird, Regular, VIP configurations
- **Pricing Sliders:** Interactive price adjustment
- **Revenue Calculator:** Real-time revenue projections
- **Capacity Planner:** Attendee capacity optimization
- **Preview Panel:** Live event page preview

**Mock Data:**
- 3 ticket tiers: Early Bird ($99), Regular ($149), VIP ($299)
- AI pricing recommendations with market analysis
- Capacity planning: 200-300 attendees optimal
- Revenue projections: $25,000-45,000 potential
- Market comparison data and competitor analysis

**Mobile Considerations:**
- Touch-friendly sliders and controls
- Swipeable ticket tier cards
- Easy price adjustment on mobile
- Clear revenue projections

---

### **8. AI Agenda Builder Page**

**Purpose:** AI-generated event schedules with speaker suggestions

**Layout Structure:**
- **Timeline View:** Visual agenda with time slots
- **AI Suggestions:** Speaker and session recommendations
- **Drag & Drop Interface:** Reorder sessions easily
- **Speaker Database:** Available speakers and experts
- **Timing Optimization:** AI-suggested timing improvements

**Key Components:**
- **Timeline Interface:** Visual agenda with time blocks
- **Session Cards:** Session details with speaker suggestions
- **Speaker Recommendations:** AI-suggested speakers with bios
- **Timing Controls:** Start/end time adjustments
- **Break Management:** Coffee breaks and networking time
- **Optimization Tips:** AI suggestions for better flow

**Mock Data:**
- 8 session slots with AI-generated content
- Speaker recommendations with expertise areas
- Timing suggestions and optimization tips
- Break periods and networking sessions
- Session topics and learning objectives

**Mobile Considerations:**
- Vertical timeline for mobile viewing
- Touch-friendly drag and drop
- Swipeable session cards
- Easy speaker selection

---

### **9. AI Marketing Dashboard Page**

**Purpose:** AI-powered marketing recommendations and campaign management

**Layout Structure:**
- **AI Strategy Panel:** Marketing strategy recommendations
- **Campaign Builder:** Create and customize marketing campaigns
- **Content Generator:** AI-generated marketing content
- **Audience Targeting:** Demographic and interest targeting
- **Performance Tracking:** Campaign performance metrics

**Key Components:**
- **AI Strategy Cards:** "For tech conferences, I recommend..."
- **Campaign Templates:** Pre-built campaign structures
- **Content Generator:** AI-created social media posts
- **Audience Selector:** Target audience configuration
- **Performance Metrics:** Campaign success indicators
- **Content Preview:** Live preview of generated content

**Mock Data:**
- 5 marketing strategies with AI explanations
- Campaign templates for different event types
- Generated social media content and email templates
- Audience targeting recommendations
- Performance metrics and ROI projections

**Mobile Considerations:**
- Swipeable strategy cards
- Touch-friendly campaign builder
- Easy content generation on mobile
- Clear performance metrics

---

## 🎨 **DESIGN SYSTEM REQUIREMENTS**

### **Color Palette**
- **Primary:** EventOS brand colors (blue tones)
- **Secondary:** Supporting colors for accents
- **Success:** Green for positive actions
- **Warning:** Yellow for attention items
- **Error:** Red for errors and alerts
- **Neutral:** Gray scale for text and backgrounds

### **Typography Hierarchy**
- **H1:** Page titles (32px, bold)
- **H2:** Section headers (24px, semibold)
- **H3:** Card titles (20px, medium)
- **Body:** Regular text (16px, regular)
- **Caption:** Small text (14px, regular)
- **Button:** Action text (16px, medium)

### **Component Library**
- **Cards:** Consistent shadows, borders, and spacing
- **Buttons:** Primary, secondary, and ghost variants
- **Inputs:** Form fields with proper focus states
- **Badges:** Status indicators and tags
- **Modals:** Overlay dialogs with proper z-index
- **Navigation:** Sidebar and top navigation consistency

### **Spacing System**
- **XS:** 4px (tight spacing)
- **SM:** 8px (small gaps)
- **MD:** 16px (standard spacing)
- **LG:** 24px (section spacing)
- **XL:** 32px (large sections)
- **XXL:** 48px (major sections)

---

## 📱 **MOBILE-FIRST RESPONSIVE DESIGN**

### **Mobile Layout (< 640px)**
- **Single Column:** All content in single column
- **Touch Targets:** Minimum 44px for all interactive elements
- **Swipe Navigation:** Swipe between sections where appropriate
- **Collapsible Sections:** Accordion-style content organization
- **Floating Actions:** FAB for primary actions

### **Tablet Layout (640px - 1024px)**
- **Two Column:** Sidebar navigation with main content
- **Grid Layout:** 2-column grid for cards and components
- **Touch Optimization:** Larger touch targets than desktop
- **Navigation:** Tab-based navigation for easy access

### **Desktop Layout (> 1024px)**
- **Multi-Column:** 3-4 column layouts for complex dashboards
- **Hover States:** Rich hover interactions and tooltips
- **Keyboard Navigation:** Full keyboard accessibility
- **Advanced Interactions:** Drag and drop, multi-select

---

## 🧪 **TESTING CHECKLIST**

### **Visual Design Validation**
- [ ] Matches existing EventOS design system
- [ ] Consistent color usage throughout
- [ ] Typography hierarchy is clear and readable
- [ ] Icons are properly sized and aligned
- [ ] Spacing follows 8px grid system

### **Responsive Design Testing**
- [ ] Mobile layout works perfectly (< 640px)
- [ ] Tablet layout is optimized (640-1024px)
- [ ] Desktop layout is fully functional (> 1024px)
- [ ] No horizontal scroll at any breakpoint
- [ ] Touch targets are appropriate for mobile

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

### **Complete Page Set**
- [ ] Dashboard Analytics - Full analytics dashboard
- [ ] Dashboard Calendar - Interactive calendar view
- [ ] Dashboard Organizers - Organizer management
- [ ] Dashboard Venues - Venue listing and management
- [ ] Dashboard Settings - Account configuration
- [ ] AI Venue Selection - AI-powered recommendations
- [ ] AI Ticketing Setup - AI-assisted configuration
- [ ] AI Agenda Builder - AI-generated schedules
- [ ] AI Marketing Dashboard - AI marketing strategies

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

## 📋 **IMPLEMENTATION TIMELINE**

### **Day 1: Core Dashboard Pages**
- Dashboard Analytics
- Dashboard Calendar
- Dashboard Organizers

### **Day 2: Remaining Dashboard Pages**
- Dashboard Venues
- Dashboard Settings
- Cross-page consistency review

### **Day 3: AI Wizard Pages**
- AI Venue Selection
- AI Ticketing Setup
- AI Agenda Builder
- AI Marketing Dashboard

### **Final Review**
- Complete testing checklist
- Cross-device validation
- User experience review
- Final polish and optimization

---

**Document Status:** ✅ Complete Lovable Design Prompt  
**Priority:** CRITICAL (UI/UX Design)  
**Next Action:** Begin with Dashboard Analytics page  
**Success Metric:** 9 pages complete with mobile-first responsive design
