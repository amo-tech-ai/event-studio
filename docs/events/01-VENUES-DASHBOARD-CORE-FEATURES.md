# 🏢 EventOS Venues Dashboard - Core Features Specification

## 📊 Executive Summary

**Purpose:** Define core venue management features for EventOS dashboard  
**Target Users:** Venue managers, event organizers, venue staff  
**Priority:** Core MVP features (essential for basic venue operations)  
**Timeline:** 2-3 weeks implementation  

---

## 🎯 Core Venue Dashboard Features

### **1. Venue Overview Dashboard**

#### **Essential Metrics Display**
- **Total Venues:** Count of all managed venues
- **Active Bookings:** Current confirmed reservations
- **Revenue This Month:** Monthly venue income
- **Occupancy Rate:** Percentage of venue utilization
- **Upcoming Events:** Next 7 days scheduled events

#### **Quick Actions**
- **Add New Venue** - Quick venue creation
- **View All Bookings** - Calendar overview
- **Generate Report** - Monthly venue performance
- **Manage Availability** - Block/unblock dates

---

### **2. Venue Management Core**

#### **A. Venue Information Management**
```typescript
interface VenueCore {
  // Basic Information
  name: string;
  type: 'conference_center' | 'hotel' | 'restaurant' | 'office' | 'theater' | 'virtual';
  description: string;
  
  // Location Details
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    coordinates: { lat: number; lng: number };
  };
  
  // Capacity & Layout
  capacity: {
    total: number;
    max: number;
    min: number;
    roomCount: number;
  };
  
  // Contact Information
  contact: {
    name: string;
    email: string;
    phone: string;
    website?: string;
  };
}
```

#### **B. Venue Features & Amenities**
- **Parking:** Available spaces, valet service
- **WiFi:** Speed, coverage area
- **AV Equipment:** Projectors, microphones, sound system
- **Catering:** In-house or external options
- **Accessibility:** Wheelchair access, special needs
- **Special Features:** Stage, dance floor, outdoor space

---

### **3. Booking Calendar & Availability**

#### **Core Calendar Features**
- **Monthly/Weekly/Daily Views** - Flexible calendar display
- **Availability Status** - Available, Booked, Blocked, Maintenance
- **Booking Conflicts** - Visual conflict detection
- **Quick Booking** - One-click reservation creation
- **Recurring Events** - Weekly/monthly event patterns

#### **Availability Management**
```typescript
interface VenueAvailability {
  date: string;
  timeSlots: {
    start: string;
    end: string;
    status: 'available' | 'booked' | 'blocked';
    bookingId?: string;
  }[];
  operatingHours: {
    open: string;
    close: string;
  };
  specialHours?: {
    date: string;
    open: string;
    close: string;
  }[];
}
```

---

### **4. Pricing & Rate Management**

#### **Core Pricing Features**
- **Base Rate:** Hourly/daily standard pricing
- **Peak Hours:** Higher rates for busy times
- **Weekend Rates:** Different pricing for weekends
- **Package Deals:** Multi-day or multi-venue discounts
- **Currency Support:** Multiple currency options

#### **Pricing Structure**
```typescript
interface VenuePricing {
  baseRate: number;
  currency: string;
  minimumHours: number;
  peakHourMultiplier: number;
  weekendMultiplier: number;
  packageRates: {
    halfDay: number;
    fullDay: number;
    multiDay: number;
  };
  additionalFees: {
    cleaning: number;
    security: number;
    equipment: number;
  };
}
```

---

### **5. Booking Management**

#### **Booking Lifecycle**
1. **Inquiry** - Initial venue request
2. **Quote** - Pricing proposal sent
3. **Contract** - Terms and conditions
4. **Confirmed** - Booking finalized
5. **Event Day** - Venue in use
6. **Completed** - Event finished
7. **Billing** - Invoice generation

#### **Booking Information**
```typescript
interface VenueBooking {
  id: string;
  venueId: string;
  eventName: string;
  clientName: string;
  contactEmail: string;
  contactPhone: string;
  
  // Event Details
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  expectedAttendees: number;
  
  // Pricing
  baseRate: number;
  totalCost: number;
  depositPaid: number;
  balanceDue: number;
  
  // Status
  status: 'inquiry' | 'quoted' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'partial' | 'paid' | 'overdue';
  
  // Special Requirements
  catering: boolean;
  avEquipment: boolean;
  security: boolean;
  specialRequests: string;
}
```

---

### **6. Floor Plan & Layout Management**

#### **Core Layout Features**
- **Interactive Floor Plans** - Clickable venue layouts
- **Room Configuration** - Different setup options
- **Capacity Visualization** - Seating arrangements
- **Equipment Placement** - AV, furniture positioning
- **Accessibility Routes** - Wheelchair access paths

#### **Layout Options**
```typescript
interface VenueLayout {
  name: string;
  capacity: number;
  setup: 'theater' | 'classroom' | 'banquet' | 'cocktail' | 'boardroom';
  dimensions: {
    length: number;
    width: number;
    area: number;
  };
  features: string[];
  equipment: string[];
  accessibility: boolean;
}
```

---

### **7. Client Communication**

#### **Communication Tools**
- **Booking Confirmations** - Automated email confirmations
- **Reminder Notifications** - Pre-event reminders
- **Change Notifications** - Booking modifications
- **Follow-up Messages** - Post-event communication

#### **Communication Templates**
```typescript
interface CommunicationTemplate {
  type: 'booking_confirmation' | 'reminder' | 'cancellation' | 'follow_up';
  subject: string;
  body: string;
  variables: string[]; // {{clientName}}, {{eventDate}}, etc.
  attachments: string[];
}
```

---

### **8. Basic Reporting & Analytics**

#### **Core Reports**
- **Monthly Revenue** - Income by venue
- **Booking Statistics** - Total bookings, occupancy rates
- **Client Analysis** - Repeat customers, new clients
- **Popular Time Slots** - Peak booking times
- **Cancellation Rates** - Booking reliability metrics

#### **Report Data Structure**
```typescript
interface VenueReport {
  period: {
    start: string;
    end: string;
  };
  revenue: {
    total: number;
    byVenue: Record<string, number>;
    byMonth: Record<string, number>;
  };
  bookings: {
    total: number;
    confirmed: number;
    cancelled: number;
    occupancyRate: number;
  };
  clients: {
    new: number;
    returning: number;
    topClients: Array<{
      name: string;
      bookings: number;
      revenue: number;
    }>;
  };
}
```

---

## 🎨 Dashboard UI Components

### **Main Dashboard Layout**
```
┌─────────────────────────────────────────────────────────┐
│ 🏢 Venues Dashboard                    [Add Venue] [📊] │
├─────────────────────────────────────────────────────────┤
│ 📊 Quick Stats                                         │
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
│ 🏢 Venue Management                                     │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [Venue List] [Calendar] [Bookings] [Reports]        │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### **Venue List Component**
```typescript
interface VenueCard {
  id: string;
  name: string;
  type: string;
  location: string;
  capacity: number;
  status: 'active' | 'inactive' | 'maintenance';
  nextBooking?: {
    date: string;
    event: string;
  };
  monthlyRevenue: number;
  occupancyRate: number;
}
```

### **Booking Calendar Component**
```typescript
interface CalendarView {
  view: 'month' | 'week' | 'day';
  selectedDate: string;
  events: Array<{
    id: string;
    title: string;
    start: string;
    end: string;
    status: 'confirmed' | 'tentative' | 'blocked';
    venue: string;
    client: string;
  }>;
}
```

---

## 🔧 Technical Implementation

### **Database Schema (Core Tables)**
```sql
-- Venues table (already exists in supabase/01-core/04-venues.sql)
CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  venue_type TEXT NOT NULL,
  capacity INTEGER,
  -- ... (existing schema)
);

-- Bookings table
CREATE TABLE venue_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID REFERENCES venues(id),
  event_name TEXT NOT NULL,
  client_name TEXT NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'inquiry',
  total_cost DECIMAL(10,2),
  -- ... (additional fields)
);

-- Venue layouts table
CREATE TABLE venue_layouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID REFERENCES venues(id),
  name TEXT NOT NULL,
  capacity INTEGER,
  setup_type TEXT,
  -- ... (layout details)
);
```

### **API Endpoints (Core)**
```typescript
// Venue Management
GET    /api/venues              // List all venues
POST   /api/venues              // Create new venue
GET    /api/venues/:id          // Get venue details
PUT    /api/venues/:id          // Update venue
DELETE /api/venues/:id          // Delete venue

// Booking Management
GET    /api/bookings            // List bookings
POST   /api/bookings            // Create booking
GET    /api/bookings/:id        // Get booking details
PUT    /api/bookings/:id        // Update booking
DELETE /api/bookings/:id        // Cancel booking

// Calendar & Availability
GET    /api/venues/:id/availability  // Check availability
GET    /api/venues/:id/calendar     // Get venue calendar
POST   /api/venues/:id/block        // Block dates

// Reports
GET    /api/reports/venue-revenue   // Revenue reports
GET    /api/reports/occupancy       // Occupancy reports
```

---

## 📱 Mobile Responsiveness

### **Mobile-First Design Principles**
- **Touch-Friendly Interface** - Large buttons, easy navigation
- **Simplified Navigation** - Bottom tab bar for main sections
- **Quick Actions** - Swipe gestures for common tasks
- **Offline Capability** - Basic functionality without internet

### **Mobile Dashboard Layout**
```
┌─────────────────────────┐
│ 🏢 Venues    [☰] [📊]  │
├─────────────────────────┤
│ 📊 Quick Stats         │
│ ┌─────┐ ┌─────┐ ┌─────┐│
│ │ 12  │ │ 45  │ │$25K ││
│ │Venues│ │Book │ │Rev  ││
│ └─────┘ └─────┘ └─────┘│
├─────────────────────────┤
│ 📅 Today's Events       │
│ • Tech Conference       │
│ • Wedding Reception     │
│ • Corporate Meeting     │
├─────────────────────────┤
│ 🏢 Quick Actions       │
│ [Add Venue] [New Booking]│
│ [Calendar] [Reports]    │
└─────────────────────────┘
```

---

## 🚀 Implementation Roadmap

### **Phase 1: Core Foundation (Week 1)**
- ✅ Venue information management
- ✅ Basic booking creation
- ✅ Simple calendar view
- ✅ Venue list with search/filter

### **Phase 2: Booking Management (Week 2)**
- ✅ Booking lifecycle management
- ✅ Availability checking
- ✅ Basic pricing structure
- ✅ Client communication templates

### **Phase 3: Analytics & Reports (Week 3)**
- ✅ Basic reporting dashboard
- ✅ Revenue tracking
- ✅ Occupancy analytics
- ✅ Mobile responsiveness

---

## 🎯 Success Metrics

### **Core KPIs to Track**
- **Venue Utilization Rate** - Target: >70%
- **Booking Confirmation Rate** - Target: >85%
- **Client Satisfaction** - Target: >4.5/5
- **Revenue Growth** - Target: 20% month-over-month
- **System Uptime** - Target: >99.5%

### **User Experience Metrics**
- **Time to Create Booking** - Target: <2 minutes
- **Dashboard Load Time** - Target: <3 seconds
- **Mobile Usability Score** - Target: >90%
- **User Adoption Rate** - Target: >80% of venue staff

---

## 🔗 Integration Points

### **EventOS Integration**
- **Event Wizard** - Venue selection during event creation
- **Dashboard** - Venue metrics in main dashboard
- **CRM** - Client information sharing
- **Analytics** - Cross-platform reporting

### **External Integrations**
- **Google Maps** - Venue location and directions
- **Calendar Systems** - Google Calendar, Outlook sync
- **Payment Processing** - Stripe integration for deposits
- **Email Services** - Automated communication

---

## 📋 Next Steps

### **Immediate Actions**
1. **Review Current Venue Schema** - Validate existing database structure
2. **Create Venue Dashboard Page** - Build main dashboard interface
3. **Implement Booking Management** - Core booking functionality
4. **Add Calendar Integration** - Availability and booking calendar
5. **Mobile Optimization** - Ensure mobile-first design

### **Future Enhancements**
- **Advanced Analytics** - Predictive booking patterns
- **AI-Powered Pricing** - Dynamic pricing optimization
- **Integration APIs** - Third-party system connections
- **Advanced Reporting** - Custom report builder

---

**Document Status:** ✅ Complete  
**Last Updated:** 2025-01-18  
**Next Review:** After Phase 1 implementation  
**Implementation Priority:** HIGH (Core MVP Feature)
