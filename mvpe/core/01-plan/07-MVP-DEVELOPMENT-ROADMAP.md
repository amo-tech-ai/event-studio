# EventOS MVP - 4-Week Development Roadmap

**Project:** EventOS MVP - AI-Powered Event Management (Lean Launch)
**Timeline:** 4 weeks (28 days)
**Target Launch:** Week 5
**Status:** Ready to Start

---

## 🎯 MVP Goals

**Primary Objective:** Launch a working event platform where users can create and sell tickets in under 5 minutes using AI conversation.

**Success Criteria:**
- [ ] 50 events created in Month 1
- [ ] $5,000 in ticket sales processed
- [ ] 100 organizers signed up
- [ ] <5 minutes average event creation time
- [ ] 80%+ wizard completion rate

---

## 📦 MVP Scope (6 Core Features)

1. ✅ **AI Event Wizard** - Conversational event creation (CopilotKit)
2. ✅ **Basic Ticketing** - Configure 1-5 ticket tiers
3. ✅ **Stripe Payments** - Secure checkout and processing
4. ✅ **Landing Pages** - Auto-generated public event pages
5. ✅ **Email Notifications** - Ticket delivery via Resend
6. ✅ **Simple Dashboard** - View sales, attendees, revenue

---

## 🗓️ Week-by-Week Breakdown

### Week 1: Foundation + AI Wizard (Days 1-7)

**Goal:** Set up infrastructure and implement AI event creation

#### Days 1-2: Infrastructure Setup
**Tasks:**
- [ ] Create Supabase project
- [ ] Set up database schema (5 core tables)
- [ ] Configure RLS policies (8 policies)
- [ ] Set up authentication (email only)
- [ ] Initialize React project (Vite + TypeScript)
- [ ] Install core dependencies

**Deliverables:**
- Working Supabase instance
- Database with RLS enabled
- React app scaffold
- Authentication working

**Owner:** Full-stack developer
**Hours:** 16 hours

---

#### Days 3-5: AI Event Wizard

**Tasks:**
- [ ] Install CopilotKit SDK
- [ ] Configure OpenAI API integration
- [ ] Create CopilotKit provider
- [ ] Build conversational UI component
- [ ] Implement AI actions:
  - createEvent (Stage 1)
  - suggestVenue (Stage 2 - optional)
  - configureTick ets (Stage 3)
- [ ] Add form validation with Zod
- [ ] Implement auto-save (every 30s)

**Deliverables:**
- Working AI chat interface
- Event creation in <3 AI messages
- Draft auto-save functional
- Basic validation

**Owner:** AI engineer + Frontend developer
**Hours:** 24 hours

---

#### Days 6-7: Event CRUD + Polish

**Tasks:**
- [ ] Build event form (fallback if AI fails)
- [ ] Add image upload (cover photo)
- [ ] Create slug auto-generation
- [ ] Implement event status (draft/published)
- [ ] Build event preview component
- [ ] Add loading states and error handling

**Deliverables:**
- Event creation works via AI or form
- Events save to database
- Preview shows event details
- Good error messages

**Owner:** Frontend developer
**Hours:** 16 hours

---

### Week 2: Ticketing + Payments (Days 8-14)

**Goal:** Enable ticket sales and payment processing

#### Days 8-9: Ticket Configuration

**Tasks:**
- [ ] Build ticket tier configuration UI
- [ ] Add price input with currency formatting
- [ ] Implement quantity limits
- [ ] Add early bird date selection
- [ ] Calculate total capacity
- [ ] Validate ticket setup

**Deliverables:**
- Ticket configuration working
- Multiple tiers supported
- Validation prevents errors
- Tickets saved with event

**Owner:** Frontend + Backend developer
**Hours:** 16 hours

---

#### Days 10-11: Stripe Integration

**Tasks:**
- [ ] Set up Stripe account
- [ ] Install Stripe SDK
- [ ] Create Edge Function: create-checkout-session
- [ ] Build checkout page UI
- [ ] Implement Stripe Elements
- [ ] Handle payment redirect flow

**Deliverables:**
- Stripe checkout working
- Payment captured successfully
- Redirects after payment
- Order record created

**Owner:** Backend developer
**Hours:** 16 hours

---

#### Days 12-13: Webhook + Order Processing

**Tasks:**
- [ ] Create Edge Function: stripe-webhook
- [ ] Implement webhook signature validation
- [ ] Process checkout.session.completed event
- [ ] Create attendee records on success
- [ ] Generate QR codes (simple UUID-based)
- [ ] Update order status

**Deliverables:**
- Webhook receives Stripe events
- Orders marked as completed
- Attendees created automatically
- QR codes generated

**Owner:** Backend developer
**Hours:** 16 hours

---

#### Day 14: Testing + Bug Fixes

**Tasks:**
- [ ] Test full payment flow end-to-end
- [ ] Handle payment failures
- [ ] Test webhook with Stripe CLI
- [ ] Add error logging
- [ ] Fix any critical bugs

**Deliverables:**
- Payment flow working reliably
- Error handling robust
- Bugs documented and fixed

**Owner:** Full team
**Hours:** 8 hours

---

### Week 3: Landing Pages + Email (Days 15-21)

**Goal:** Public event pages and automated communications

#### Days 15-17: Public Landing Pages

**Tasks:**
- [ ] Create public event page route (/e/[slug])
- [ ] Build event detail component
- [ ] Add ticket selection UI
- [ ] Implement "Buy Tickets" CTA
- [ ] Add social share buttons
- [ ] Make mobile-responsive
- [ ] Add meta tags for SEO

**Deliverables:**
- Public event pages accessible
- SEO meta tags working
- Mobile-friendly design
- Share functionality

**Owner:** Frontend developer
**Hours:** 24 hours

---

#### Days 18-19: Email Integration

**Tasks:**
- [ ] Set up Resend account
- [ ] Create Edge Function: send-tickets
- [ ] Design email template (HTML)
- [ ] Include QR code in email
- [ ] Add event details to email
- [ ] Trigger email after payment
- [ ] Test email delivery

**Deliverables:**
- Email sending working
- Template looks good
- QR code included
- Reliable delivery

**Owner:** Backend + Designer
**Hours:** 16 hours

---

#### Days 20-21: Event Discovery Page

**Tasks:**
- [ ] Create events listing page (/events)
- [ ] Fetch published events from database
- [ ] Build event card component
- [ ] Add basic filters (upcoming, past)
- [ ] Implement search (simple text match)
- [ ] Add pagination
- [ ] Make responsive

**Deliverables:**
- Event discovery page working
- Search and filters functional
- Good UX on mobile
- Fast page load

**Owner:** Frontend developer
**Hours:** 16 hours

---

### Week 4: Dashboard + Launch Prep (Days 22-28)

**Goal:** Organizer dashboard and production readiness

#### Days 22-24: Organizer Dashboard

**Tasks:**
- [ ] Create dashboard route (/dashboard)
- [ ] Build "My Events" list component
- [ ] Show key metrics per event:
  - Total revenue
  - Tickets sold / available
  - Event status
- [ ] Add "Create Event" button
- [ ] Add "View Event" / "Edit" / "Attendees" actions
- [ ] Build attendee list page
- [ ] Add export to CSV (attendees)

**Deliverables:**
- Dashboard shows user's events
- Metrics displayed clearly
- Actions work correctly
- Attendee list accessible

**Owner:** Frontend developer
**Hours:** 24 hours

---

#### Days 25-26: UI/UX Polish

**Tasks:**
- [ ] Review all pages for consistency
- [ ] Fix spacing and alignment issues
- [ ] Add loading skeletons
- [ ] Improve error messages
- [ ] Add success toasts/notifications
- [ ] Test mobile responsiveness everywhere
- [ ] Add empty states (no events, etc.)
- [ ] Improve accessibility (keyboard nav, ARIA labels)

**Deliverables:**
- Polished, professional UI
- Consistent design system
- Good mobile experience
- Accessible to all users

**Owner:** Frontend + Designer
**Hours:** 16 hours

---

#### Days 27-28: Testing + Deployment

**Tasks:**
- [ ] End-to-end testing (full user flow)
- [ ] Fix critical bugs
- [ ] Set up production environment variables
- [ ] Deploy to Vercel production
- [ ] Test in production
- [ ] Set up error monitoring (Sentry)
- [ ] Configure DNS
- [ ] Create launch checklist
- [ ] Prepare demo video (2 min)
- [ ] Write launch blog post

**Deliverables:**
- Production deployment live
- All features working
- Monitoring active
- Launch materials ready

**Owner:** Full team
**Hours:** 16 hours

---

## 👥 Team & Roles

| Role | Responsibilities | Hours/Week | Total Hours |
|------|------------------|------------|-------------|
| **Full-Stack Developer** | Infrastructure, backend, deployment | 40h | 160h |
| **Frontend Developer** | UI components, wizard, dashboard | 40h | 160h |
| **AI Engineer** | CopilotKit integration, OpenAI | 20h (Weeks 1-2) | 40h |
| **Designer** | UI/UX design, email templates | 10h (Weeks 3-4) | 20h |
| **QA Tester** | Testing, bug reporting | 10h (Week 4) | 10h |

**Total:** 390 hours across 4 weeks

---

## 🗂️ Database Schema (MVP - 5 Tables)

```sql
-- Table 1: events (core event data)
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID NOT NULL REFERENCES auth.users(id),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  cover_image_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled')),
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 2: tickets (ticket tiers)
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL CHECK (price >= 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  sold INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 3: orders (purchase records)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_phone TEXT,
  total_amount NUMERIC NOT NULL,
  stripe_payment_intent_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 4: attendees (individual tickets)
CREATE TABLE attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  ticket_id UUID NOT NULL REFERENCES tickets(id),
  attendee_name TEXT NOT NULL,
  attendee_email TEXT NOT NULL,
  qr_code TEXT UNIQUE NOT NULL,
  checked_in BOOLEAN DEFAULT false,
  checked_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 5: event_settings (optional config)
CREATE TABLE event_settings (
  event_id UUID PRIMARY KEY REFERENCES events(id) ON DELETE CASCADE,
  require_approval BOOLEAN DEFAULT false,
  collect_phone BOOLEAN DEFAULT false,
  max_tickets_per_order INTEGER DEFAULT 10,
  sales_end_date TIMESTAMPTZ,
  custom_fields JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Total:** 5 tables (vs 30+ in full platform)

---

## 🔐 RLS Policies (MVP - 8 Policies)

```sql
-- Events
CREATE POLICY "organizers_crud_own_events" ON events FOR ALL USING (auth.uid() = organizer_id);
CREATE POLICY "public_view_published" ON events FOR SELECT USING (status = 'published');

-- Tickets
CREATE POLICY "public_view_tickets" ON tickets FOR SELECT USING (
  event_id IN (SELECT id FROM events WHERE status = 'published')
);

-- Orders
CREATE POLICY "users_own_orders" ON orders FOR SELECT USING (user_email = auth.jwt()->>'email');

-- Attendees
CREATE POLICY "users_own_attendees" ON attendees FOR SELECT USING (
  attendee_email = auth.jwt()->>'email' OR
  event_id IN (SELECT id FROM events WHERE organizer_id = auth.uid())
);

-- Event Settings
CREATE POLICY "organizers_own_settings" ON event_settings FOR ALL USING (
  event_id IN (SELECT id FROM events WHERE organizer_id = auth.uid())
);
```

---

## 📊 Progress Tracking

### Daily Standup Format
- **What I did yesterday:**
- **What I'm doing today:**
- **Blockers:**

### Weekly Demo (Every Friday)
- Demo completed features
- Review sprint goals
- Plan next week

### Metrics Dashboard
- Events created: 0 → 50 (goal)
- Revenue processed: $0 → $5K (goal)
- User signups: 0 → 100 (goal)
- Avg creation time: N/A → <5 min (goal)

---

## 🚨 Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **OpenAI API slow** | High | Medium | Add loading states, fallback to form mode |
| **Stripe integration issues** | Critical | Low | Allocate 3 days, use Stripe test mode early |
| **Team capacity** | High | Medium | Keep scope minimal, cut features if needed |
| **Email deliverability** | Medium | Low | Use Resend (high reputation), test before launch |

---

## ✅ Launch Checklist

### Pre-Launch (Day 28)
- [ ] All 6 core features working
- [ ] Full user flow tested
- [ ] No critical bugs
- [ ] Production deployed
- [ ] Monitoring set up
- [ ] Demo video recorded
- [ ] Landing page live
- [ ] Social accounts created

### Launch Day (Day 29 - Week 5)
- [ ] Post on Product Hunt
- [ ] Post on Reddit (r/SideProject, r/startups)
- [ ] Email waitlist (if any)
- [ ] Tweet announcement
- [ ] LinkedIn post
- [ ] Monitor errors closely

### Post-Launch (Week 5)
- [ ] Daily check-ins with first 10 users
- [ ] Fix bugs within 24 hours
- [ ] Collect feedback
- [ ] Plan v1.1 features

---

## 🎓 Decision Log

**Why MVP first?**
- Validate market demand before building complex features
- Get to revenue faster (Week 5 vs Week 13)
- Learn from real users
- Lower development cost

**Why CopilotKit over custom AI?**
- Faster integration (saves 1 week)
- Built-in conversational UI
- Handle state management
- Well-documented

**Why Resend over SendGrid?**
- Simpler API
- Better deliverability for transactional emails
- Lower cost for MVP volume

**Why 5 tables not 30?**
- Everything else can wait
- Reduces complexity
- Faster to build and test
- Easier to modify based on feedback

---

## 📚 Resources

**Tech Stack Docs:**
- Supabase: https://supabase.com/docs/guides/getting-started
- CopilotKit: https://docs.copilotkit.ai/getting-started
- Stripe Checkout: https://stripe.com/docs/checkout/quickstart
- Resend: https://resend.com/docs/send-with-nodejs

**Reference:**
- MVP PRD: `02-MVP-PRD.md`
- Full Platform PRD: `01-PRD-EVENTOS-V3.md`
- Comparison: `03-MVP-vs-FULL-COMPARISON.md`

---

**Next Update:** End of Week 1 (Day 7)
**Status:** ✅ Ready to Start Development
