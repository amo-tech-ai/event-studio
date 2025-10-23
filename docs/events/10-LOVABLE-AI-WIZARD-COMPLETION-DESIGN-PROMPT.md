# 🎨 EventOS AI Wizard Completion - Lovable Design Prompt

## 📋 **Project Overview**
**Goal:** Complete the AI Event Wizard system by creating the 4 missing AI wizard pages to achieve 100% AI features completion.

**Current Status:** 50% Complete (2/6 pages done)
- ✅ `/event-wizard` - Complete
- ✅ `/ai-wizard` - Complete  
- 🔴 `/ai-wizard/venues` - Missing
- 🔴 `/ai-wizard/tickets` - Missing
- 🔴 `/ai-wizard/agenda` - Missing
- 🔴 `/ai-wizard/marketing` - Missing

**Target:** 100% AI Features Complete (6/6 pages)

---

## 🎯 **CRITICAL MOBILE OPTIMIZATION REQUIREMENTS**

### **Mobile-First Design (CRITICAL)**
- **Sidebar MUST be collapsible** on mobile (<640px)
- **Hamburger menu [☰]** must be visible on mobile
- **Sidebar slides in as overlay** (not push) on mobile
- **Main content gets full width** when sidebar is closed
- **Touch-friendly navigation** with 44px+ touch targets
- **Safe area support** for mobile devices (notches, home indicators)

### **Mobile Layout Specifications**
- **Mobile (<640px):** Single column, sidebar collapsed by default
- **Tablet (640-1024px):** Two-column with collapsible sidebar
- **Desktop (>1024px):** Full sidebar visible, optimized layout

---

## 🤖 **AI WIZARD PAGES TO CREATE**

### **1. AI Venue Selection Page (`/ai-wizard/venues`)**

#### **Page Purpose**
Help users find and select the perfect venue for their event through AI-powered recommendations and smart filtering.

#### **Layout Structure**
```
┌─────────────────────────────────────────────────────────┐
│ Header: "AI Venue Selection" + Progress Indicator      │
├─────────────────────────────────────────────────────────┤
│ Chat Panel (60%)    │ Venue Results Panel (40%)        │
│                     │                                   │
│ AI Conversation     │ 📍 Venue Cards                    │
│ - Venue preferences │ - Photos, ratings, amenities     │
│ - Budget range      │ - Availability calendar          │
│ - Location needs    │ - Pricing information            │
│ - Capacity reqs     │ - Quick booking actions          │
│                     │                                   │
│ Quick Suggestions   │ Filters & Sorting                │
│ - "Budget under $5K"│ - Price range slider             │
│ - "Downtown area"   │ - Capacity filter                │
│ - "Outdoor space"   │ - Amenities checkboxes           │
│                     │ - Date availability              │
└─────────────────────────────────────────────────────────┘
```

#### **Required Sections**
1. **AI Chat Interface**
   - Conversational venue discovery
   - Smart questions about preferences
   - Budget and capacity guidance
   - Location and amenity requirements

2. **Venue Results Grid**
   - 6-8 venue cards with photos
   - Venue name, location, capacity
   - Star ratings and price range
   - Key amenities badges
   - Availability indicators

3. **Smart Filters Panel**
   - Price range slider ($500-$50,000)
   - Capacity selector (10-5000 people)
   - Location radius (1-50 miles)
   - Amenities checklist (WiFi, parking, catering, etc.)
   - Date availability picker

4. **Venue Detail Cards**
   - Photo gallery carousel
   - Detailed amenities list
   - Pricing breakdown
   - Availability calendar
   - Contact information
   - Quick booking button

#### **Mock Data Requirements**
- **Sample Venues:** 8 venues with realistic names, photos, ratings
- **Price Ranges:** $2,500-$15,000 per event
- **Capacities:** 50-2,000 attendees
- **Locations:** Downtown, suburbs, waterfront, convention centers
- **Amenities:** WiFi, parking, catering, AV equipment, outdoor space

---

### **2. AI Ticketing Setup Page (`/ai-wizard/tickets`)**

#### **Page Purpose**
Guide users through creating ticket tiers, pricing strategies, and sales configurations with AI-powered recommendations.

#### **Layout Structure**
```
┌─────────────────────────────────────────────────────────┐
│ Header: "AI Ticketing Setup" + Progress Indicator     │
├─────────────────────────────────────────────────────────┤
│ Chat Panel (60%)    │ Ticket Configuration (40%)       │
│                     │                                   │
│ AI Conversation     │ 🎫 Ticket Tier Builder           │
│ - Event type advice  │ - Tier name and description     │
│ - Pricing strategy   │ - Price and quantity settings   │
│ - Sales timeline     │ - Early bird discounts          │
│ - Marketing tips     │ - VIP packages                  │
│                     │                                   │
│ Quick Suggestions   │ Revenue Calculator               │
│ - "Early bird 20%"  │ - Projected revenue display     │
│ - "VIP package"     │ - Break-even analysis           │
│ - "Group discounts"│ - Sales timeline chart            │
│                     │ - Commission settings            │
└─────────────────────────────────────────────────────────┘
```

#### **Required Sections**
1. **AI Pricing Advisor**
   - Event type analysis
   - Market research insights
   - Competitor pricing data
   - Revenue optimization tips

2. **Ticket Tier Builder**
   - Create multiple ticket types
   - Early bird pricing setup
   - VIP and premium packages
   - Group discount tiers

3. **Revenue Calculator**
   - Real-time revenue projections
   - Break-even analysis
   - Sales timeline visualization
   - Commission and fee calculations

4. **Sales Strategy Panel**
   - Launch timeline recommendations
   - Marketing campaign suggestions
   - Pricing psychology tips
   - Upselling opportunities

#### **Mock Data Requirements**
- **Ticket Tiers:** Early Bird ($99), Regular ($149), VIP ($299)
- **Pricing Strategies:** Dynamic pricing, early bird discounts
- **Revenue Projections:** $25,000-$150,000 potential revenue
- **Sales Timeline:** 3-6 month sales period
- **Commission Rates:** 2.9% + $0.30 per ticket

---

### **3. AI Agenda Builder Page (`/ai-wizard/agenda`)**

#### **Page Purpose**
Create comprehensive event agendas with AI-powered session suggestions, speaker recommendations, and timeline optimization.

#### **Layout Structure**
```
┌─────────────────────────────────────────────────────────┐
│ Header: "AI Agenda Builder" + Progress Indicator       │
├─────────────────────────────────────────────────────────┤
│ Chat Panel (60%)    │ Agenda Timeline (40%)            │
│                     │                                   │
│ AI Conversation     │ 📅 Interactive Timeline          │
│ - Event goals       │ - Session blocks (30-90 min)     │
│ - Audience needs    │ - Speaker assignments            │
│ - Content themes    │ - Break and networking time     │
│ - Speaker matching  │ - Venue room assignments         │
│                     │                                   │
│ Quick Suggestions   │ Session Details Panel            │
│ - "Keynote speaker" │ - Session title and description  │
│ - "Panel discussion"│ - Speaker bio and photo         │
│ - "Networking break"│ - Room and capacity info         │
│                     │ - Materials and resources        │
└─────────────────────────────────────────────────────────┘
```

#### **Required Sections**
1. **AI Content Advisor**
   - Event goals and objectives
   - Audience analysis
   - Content theme suggestions
   - Speaker matching algorithm

2. **Interactive Timeline**
   - Drag-and-drop session blocks
   - Time slot management
   - Break and transition planning
   - Venue room assignments

3. **Session Builder**
   - Session title and description
   - Speaker selection and bio
   - Materials and resources
   - Room and capacity planning

4. **Speaker Database**
   - Speaker profiles and expertise
   - Availability calendar
   - Fee and contract information
   - Past event reviews

#### **Mock Data Requirements**
- **Event Duration:** 1-3 day conference
- **Session Types:** Keynotes, panels, workshops, networking
- **Speaker Profiles:** 15-20 diverse speakers
- **Session Lengths:** 30, 45, 60, 90 minutes
- **Venue Rooms:** Main hall, breakout rooms, networking areas

---

### **4. AI Marketing Dashboard Page (`/ai-wizard/marketing`)**

#### **Page Purpose**
Generate comprehensive marketing campaigns with AI-powered content creation, audience targeting, and performance analytics.

#### **Layout Structure**
```
┌─────────────────────────────────────────────────────────┐
│ Header: "AI Marketing Dashboard" + Progress Indicator  │
├─────────────────────────────────────────────────────────┤
│ Chat Panel (60%)    │ Campaign Builder (40%)          │
│                     │                                   │
│ AI Conversation     │ 📊 Marketing Channels            │
│ - Target audience   │ - Social media campaigns         │
│ - Content themes    │ - Email marketing sequences      │
│ - Budget allocation │ - Paid advertising setup         │
│ - Timeline planning │ - Influencer partnerships        │
│                     │                                   │
│ Quick Suggestions   │ Performance Analytics            │
│ - "Social media ads"│ - Reach and engagement metrics   │
│ - "Email sequence" │ - Conversion tracking             │
│ - "Influencer collab"│ - ROI and cost analysis         │
│                     │ - A/B testing results            │
└─────────────────────────────────────────────────────────┘
```

#### **Required Sections**
1. **AI Marketing Strategist**
   - Target audience analysis
   - Content theme generation
   - Channel recommendations
   - Budget optimization

2. **Campaign Builder**
   - Multi-channel campaign setup
   - Content calendar creation
   - Audience segmentation
   - Budget allocation

3. **Content Generator**
   - Social media posts
   - Email templates
   - Ad copy variations
   - Visual content suggestions

4. **Performance Analytics**
   - Real-time campaign metrics
   - Conversion tracking
   - ROI analysis
   - A/B testing results

#### **Mock Data Requirements**
- **Marketing Channels:** Social media, email, paid ads, PR
- **Content Types:** Posts, stories, emails, ads, press releases
- **Audience Segments:** Demographics, interests, behavior
- **Performance Metrics:** Reach, engagement, conversions, ROI
- **Budget Allocation:** $5,000-$50,000 marketing budget

---

## 🎨 **Design System Requirements**

### **Visual Consistency**
- **Match existing EventOS design** - Use same colors, fonts, spacing
- **shadcn/ui components** - Button, Card, Badge, Progress, Input
- **EventOS brand colors** - Primary orange, secondary blues
- **8px grid system** - Consistent spacing throughout
- **Mobile-first responsive** - Collapsible sidebar on mobile

### **Component Specifications**
- **Cards:** Rounded corners, subtle shadows, hover effects
- **Buttons:** Primary (orange), secondary (outline), ghost variants
- **Badges:** Status indicators, category tags, progress badges
- **Inputs:** Smart suggestions, auto-complete, validation states
- **Charts:** Revenue projections, timeline visualizations, metrics

### **Interactive Elements**
- **Hover effects** on all clickable elements
- **Loading states** with skeleton placeholders
- **Empty states** with helpful messaging
- **Success states** with confirmation feedback
- **Error states** with clear error messages

---

## 📱 **Mobile Optimization (CRITICAL)**

### **Mobile Layout Requirements**
- **Sidebar collapsed by default** on mobile (<640px)
- **Hamburger menu [☰]** in top-left corner
- **Sidebar slides in as overlay** when opened
- **Main content gets full width** when sidebar closed
- **Touch-friendly targets** (44px minimum)
- **Swipe gestures** for sidebar navigation

### **Responsive Breakpoints**
- **Mobile (<640px):** Single column, stacked panels
- **Tablet (640-1024px):** Two-column with collapsible sidebar
- **Desktop (>1024px):** Full sidebar, optimized layout

### **Touch Interactions**
- **Swipe left/right** to navigate between sections
- **Pinch to zoom** on venue photos and charts
- **Pull to refresh** for updated data
- **Long press** for additional options

---

## 🧪 **Testing Checklist**

### **Visual Design**
- [ ] Matches existing EventOS design system
- [ ] Consistent spacing and colors throughout
- [ ] Typography hierarchy is clear and readable
- [ ] Icons display correctly and are properly sized
- [ ] Cards have proper shadows and borders

### **Responsiveness (CRITICAL)**
- [ ] **Mobile layout works perfectly (< 640px) - PRIMARY FOCUS**
- [ ] **Sidebar is collapsible on mobile - CRITICAL REQUIREMENT**
- [ ] **Hamburger menu [☰] works correctly on mobile**
- [ ] **Sidebar slides in as overlay (not push) on mobile**
- [ ] **Main content gets full width when sidebar is closed**
- [ ] Tablet layout is optimized (640-1024px) - TOUCH OPTIMIZED
- [ ] Desktop layout is fully functional (> 1024px) - POWER USER FEATURES
- [ ] No horizontal scroll at any breakpoint
- [ ] Touch targets are appropriate for each device type

### **Components**
- [ ] All shadcn/ui components render correctly
- [ ] Buttons have proper hover and active states
- [ ] Badges display with correct colors and styling
- [ ] Input fields have proper focus states
- [ ] Cards have consistent shadows and spacing

### **Mock Data**
- [ ] Sample data displays correctly without errors
- [ ] No "undefined" or missing data errors
- [ ] Placeholder numbers show in metrics and calculations
- [ ] All text is readable and properly formatted
- [ ] Images load correctly (use placeholder images)

### **Code Quality**
- [ ] No TypeScript errors in console
- [ ] No JavaScript errors on page load
- [ ] Pages load without issues or delays
- [ ] Components are clean, readable, and well-structured
- [ ] Proper component naming and organization

---

## 🎯 **Success Criteria**

### **Completion Requirements**
- ✅ All 4 AI wizard pages created and functional
- ✅ Mobile optimization implemented (collapsible sidebar)
- ✅ Consistent design system across all pages
- ✅ Mock data displays correctly
- ✅ Responsive design works on all devices
- ✅ No TypeScript or console errors

### **Quality Standards**
- **Visual Consistency:** 100% match with EventOS design
- **Mobile Experience:** Perfect collapsible sidebar implementation
- **Performance:** < 2 second load time for each page
- **Accessibility:** WCAG 2.1 AA compliant
- **Code Quality:** Clean, maintainable, well-documented

---

## 📋 **Implementation Priority**

### **Phase 1: Mobile Optimization (Day 1)**
1. **FIX MOBILE SIDEBAR** - Make collapsible on all pages
2. **Add hamburger menu** - Mobile navigation trigger
3. **Test on mobile devices** - Verify functionality

### **Phase 2: AI Wizard Pages (Day 2-3)**
1. **AI Venue Selection** - Venue discovery and filtering
2. **AI Ticketing Setup** - Pricing and revenue optimization
3. **AI Agenda Builder** - Timeline and speaker management
4. **AI Marketing Dashboard** - Campaign creation and analytics

### **Phase 3: Testing & Polish (Day 4)**
1. **Cross-device testing** - Mobile, tablet, desktop
2. **Performance optimization** - Load times and responsiveness
3. **Final quality check** - All requirements met

---

## 🚀 **Expected Outcome**

**Target:** 100% AI Features Complete (6/6 pages)
- ✅ `/event-wizard` - Complete
- ✅ `/ai-wizard` - Complete  
- ✅ `/ai-wizard/venues` - **NEW**
- ✅ `/ai-wizard/tickets` - **NEW**
- ✅ `/ai-wizard/agenda` - **NEW**
- ✅ `/ai-wizard/marketing` - **NEW**

**Result:** Complete AI Event Wizard system with mobile-optimized, responsive design that matches EventOS design system perfectly.

---

**Status:** 🔴 Ready for Implementation  
**Priority:** 🔴 Critical - Complete AI Features  
**Timeline:** 4 days total (1 day mobile fix + 3 days AI pages)  
**Next Review:** After all 4 pages complete and mobile optimization verified
