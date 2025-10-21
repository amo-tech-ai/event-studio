# Phase 1: Essential Registration Flow - Implementation Plan

## 📋 Overview
This document outlines the implementation plan for the core event registration flow in EventOS. Phase 1 focuses on creating beautiful, functional UI pages with mock data - NO database integration yet.

---

## 🎯 Goals
- ✅ Create 4 essential registration pages
- ✅ Use mock/placeholder data only
- ✅ Match existing EventOS design system
- ✅ Mobile-first responsive design
- ✅ Production-ready UI components
- ❌ NO database queries
- ❌ NO authentication logic
- ❌ NO real form submissions

---

## 📄 Pages to Implement

### 1. EventRegistration Page
**Route:** `/event/:slug/register`  
**Purpose:** Main registration hub with 3-step wizard  
**Components:**
- Progress indicator (3 steps)
- Step navigation
- Order summary sidebar
- Trust badges

**Mock Data:**
```typescript
const mockEvent = {
  id: "e1111111",
  slug: "ai-ml-summit-2025",
  name: "AI & ML Summit 2025",
  date: "June 15, 2025",
  location: "San Francisco Convention Center"
}

const mockTickets = [
  { id: "t1", name: "Early Bird", price: 99, available: true },
  { id: "t2", name: "Regular", price: 149, available: true },
  { id: "t3", name: "VIP", price: 299, available: true }
]
```

---

### 2. TicketSelection Page
**Route:** `/event/:slug/tickets`  
**Purpose:** Select ticket types and quantities  
**Components:**
- Ticket tier cards (grid layout)
- Quantity selectors (+/- buttons)
- Add-ons section (optional extras)
- Order summary sidebar
- Continue CTA

**Mock Data:**
```typescript
const mockTicketTiers = [
  {
    id: "t1",
    name: "Early Bird",
    price: 99,
    description: "Limited time offer",
    benefits: ["All sessions", "Networking", "Lunch"],
    badge: "Best Value",
    available: 45
  },
  {
    id: "t2",
    name: "Regular",
    price: 149,
    description: "Standard admission",
    benefits: ["All sessions", "Networking", "Lunch", "Swag bag"],
    badge: "Most Popular",
    available: 120
  },
  {
    id: "t3",
    name: "VIP",
    price: 299,
    description: "Premium experience",
    benefits: ["All sessions", "Premium seating", "VIP lounge", "Meet speakers"],
    badge: null,
    available: 20
  }
]

const mockAddOns = [
  { id: "a1", name: "Parking Pass", price: 15, icon: "🚗" },
  { id: "a2", name: "Meal Plan", price: 25, icon: "🍽️" },
  { id: "a3", name: "Swag Bag", price: 20, icon: "🎒" }
]
```

---

### 3. PaymentPage
**Route:** `/event/:slug/payment`  
**Purpose:** Collect payment and billing information  
**Components:**
- Payment method selector (Card/PayPal/Apple Pay)
- Card input fields (with visual validation)
- Billing address form
- Order summary sidebar
- Security badges
- Complete payment CTA

**Mock Data:**
```typescript
const mockOrderSummary = {
  event: "AI & ML Summit 2025",
  date: "June 15, 2025",
  tickets: [
    { name: "Early Bird", qty: 1, price: 99 },
    { name: "Regular", qty: 2, price: 298 }
  ],
  addons: [
    { name: "Parking Pass", qty: 1, price: 15 }
  ],
  subtotal: 412,
  fees: 12,
  total: 424
}
```

---

### 4. OrderConfirmation Page
**Route:** `/event/:slug/confirmation`  
**Purpose:** Success confirmation with next steps  
**Components:**
- Success header with checkmark
- Order details summary
- Next steps section
- Add to calendar CTA
- Social sharing buttons
- Support information

**Mock Data:**
```typescript
const mockConfirmation = {
  orderId: "ORD-12345",
  orderDate: "June 10, 2025",
  event: "AI & ML Summit 2025",
  eventDate: "June 15, 2025",
  eventTime: "9:00 AM - 6:00 PM",
  location: "San Francisco Convention Center",
  tickets: [
    { name: "Early Bird", qty: 1, price: 99 },
    { name: "Regular", qty: 2, price: 298 }
  ],
  total: 424,
  paymentMethod: "Visa **** 1234",
  email: "attendee@example.com"
}
```

---

## 🎨 Design System Compliance

### Colors (from existing design system)
- Primary: `hsl(var(--primary))`
- Secondary: `hsl(var(--secondary))`
- Accent: `hsl(var(--accent))`
- Muted: `hsl(var(--muted))`
- Success: Green for completed steps
- Warning: Orange for alerts

### Components to Use
- `Button` - Primary CTAs
- `Card` - Ticket tiers, order summary
- `Badge` - Tags and labels
- `Input` - Form fields
- `Separator` - Visual dividers
- `Progress` - Step indicator

### Typography
- Headings: `text-4xl font-bold` (H1), `text-2xl font-semibold` (H2)
- Body: `text-base` (16px)
- Labels: `text-sm font-medium`

### Spacing
- Section gaps: `space-y-8`
- Card padding: `p-6`
- Button padding: `px-6 py-3`

---

## 🔄 User Flow

```
Start → Event Details Page
  ↓ (Click "Register Now")
EventRegistration Page
  ↓ (Step 1: Tickets)
TicketSelection Page
  ↓ (Select tickets → Continue)
PaymentPage
  ↓ (Enter payment → Complete)
OrderConfirmation Page
  ↓ (Add to calendar / Share)
End
```

---

## 📱 Responsive Breakpoints

- **Mobile:** < 640px (sm)
  - Single column layout
  - Stacked cards
  - Sticky bottom CTA
  
- **Tablet:** 640px - 1024px (md, lg)
  - Two column layout
  - Side-by-side ticket cards
  - Sidebar order summary

- **Desktop:** > 1024px (xl, 2xl)
  - Three column layout
  - Sticky sidebar
  - Expanded cards

---

## ✅ Implementation Checklist

### Phase 1A: Page Structure
- [ ] Create `/event/:slug/register` route
- [ ] Create `/event/:slug/tickets` route
- [ ] Create `/event/:slug/payment` route
- [ ] Create `/event/:slug/confirmation` route
- [ ] Update App.tsx with new routes

### Phase 1B: Components
- [ ] EventRegistration page with progress indicator
- [ ] TicketSelection page with tier cards
- [ ] PaymentPage with form fields
- [ ] OrderConfirmation page with success state

### Phase 1C: Mock Data
- [ ] Create mock event data
- [ ] Create mock ticket tiers
- [ ] Create mock add-ons
- [ ] Create mock order summary

### Phase 1D: Visual States
- [ ] Hover effects on cards
- [ ] Active state for selected tickets
- [ ] Loading skeleton (visual only)
- [ ] Success animations

### Phase 1E: Testing
- [ ] Test on mobile (< 640px)
- [ ] Test on tablet (640-1024px)
- [ ] Test on desktop (> 1024px)
- [ ] Verify all links work
- [ ] Check console for errors

---

## 🚫 Out of Scope (Phase 2+)

These items will be handled in later phases:
- ❌ Supabase database queries
- ❌ User authentication checks
- ❌ Real payment processing (Stripe integration)
- ❌ Email confirmations
- ❌ Calendar API integration
- ❌ Form validation logic
- ❌ State management (React Query)
- ❌ Real-time availability updates

---

## 📊 Success Metrics

**Visual Design:**
- ✅ Matches existing EventOS design system
- ✅ Consistent spacing and typography
- ✅ Clean, modern appearance

**Functionality:**
- ✅ All pages render without errors
- ✅ Navigation between steps works
- ✅ Mock data displays correctly
- ✅ Responsive on all devices

**User Experience:**
- ✅ Clear visual hierarchy
- ✅ Intuitive navigation flow
- ✅ Prominent CTAs
- ✅ Trust-building elements

---

## 🔜 Next Steps (Phase 2)

After Phase 1 UI is complete, Claude will:
1. Set up Supabase tables (events, tickets, orders)
2. Add React Query for data fetching
3. Implement form validation with Zod
4. Connect Stripe for payments
5. Add authentication checks
6. Implement email confirmations

---

## 📝 Notes

- All pages use MOCK DATA only
- No database calls in Phase 1
- Focus on beautiful, functional UI
- Keep components simple and reusable
- Follow existing design patterns
- Mobile-first approach
- Production-ready styling

---

**Last Updated:** June 10, 2025  
**Status:** Ready for Implementation  
**Phase:** 1 of 4 (UI/UX Only)
