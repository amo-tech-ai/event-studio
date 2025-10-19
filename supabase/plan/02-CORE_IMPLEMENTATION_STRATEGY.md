# 🚀 Phase 1: MVP Implementation (Minimum Viable Product)

**Phase Duration:** 4 weeks
**Target Launch:** End of Week 4
**Prerequisites:** Phase 0 Database Schema Complete ✅
**Team Size:** 3 engineers (1 backend, 1 frontend, 1 full-stack)

---

## 📋 MVP Definition

The MVP proves the core value proposition: **Organizers can create events and attendees can buy tickets.**

### What's Included (Minimum)
✅ Create event with basic info
✅ Create ONE ticket type per event
✅ Public event page
✅ Buy ticket with Stripe
✅ Confirmation email

### What's Excluded (For Later)
❌ Multiple ticket types
❌ Advanced dashboard
❌ AI features
❌ Marketing automation
❌ Analytics
❌ Multi-user roles
❌ OAuth login

**Philosophy:** Launch in 4 weeks, get real users, learn what they actually need.

---

## 🎯 MVP Features (Only 3)

### Feature 1: Create Event
**Duration:** Week 1
**Complexity:** LOW

**Capabilities:**
- Organizer signs up with email/password (Supabase Auth)
- Create event form with 6 fields:
  - Event name
  - Event date
  - Event description
  - Location/venue
  - Ticket price
  - Ticket quantity available

**Database:**
- Uses `events` table from Phase 0
- Uses `ticket_tiers` table (only 1 tier per event)

**API Endpoints:**
- `POST /api/events` - Create event
- `GET /api/events/:id` - Get event
- `PUT /api/events/:id` - Edit event

**Success Criteria:**
- Organizer creates event in <3 minutes
- Event saved to database correctly

---

### Feature 2: Public Event Page
**Duration:** Week 2
**Complexity:** LOW

**Capabilities:**
- Public URL: `eventos.com/e/[event-slug]`
- Display all event info
- Show tickets available count
- "Buy Ticket" button

**Implementation:**
- Server-side rendered page
- Dynamic route in Next.js
- No authentication required to view

**Success Criteria:**
- Page loads in <1 second
- Mobile responsive
- Anyone can view without login

---

### Feature 3: Buy Ticket
**Duration:** Weeks 3-4
**Complexity:** MEDIUM

**Capabilities:**
- Click "Buy Ticket" button
- Enter: Name, Email, Phone
- Redirect to Stripe Checkout
- Process payment
- Create order in database
- Send confirmation email
- Display success page with ticket details

**Payment Flow:**
1. User clicks "Buy Ticket"
2. Fill out registration form
3. Redirect to Stripe Checkout
4. User enters payment info
5. Stripe processes payment
6. Webhook confirms payment
7. Create order + attendee records
8. Send confirmation email via Resend
9. Show success page

**Database:**
- Uses `orders` table from Phase 0
- Uses `attendees` table from Phase 0
- Uses `order_items` table from Phase 0

**API Endpoints:**
- `POST /api/checkout` - Create Stripe session
- `POST /api/webhooks/stripe` - Handle payment confirmation

**Success Criteria:**
- Complete purchase in <2 minutes
- 100% payment success rate
- Email arrives within 30 seconds
- Order data stored correctly

---

## 🔄 4-Week Timeline

| **Week** | **Focus** | **Deliverable** |
|----------|----------|----------------|
| **Week 1** | Auth + Event Creation | Organizer can create event |
| **Week 2** | Public Event Page | Anyone can view event |
| **Week 3** | Stripe Integration | Payment processing works |
| **Week 4** | Email + Polish | Complete purchase flow works |

### Daily Breakdown

**Week 1:**
- Day 1-2: Set up Supabase auth (email/password)
- Day 3-4: Create event API + form
- Day 5: Test event creation

**Week 2:**
- Day 1-2: Build public event page
- Day 3: Add ticket availability counter
- Day 4: Add "Buy Ticket" button
- Day 5: Test and polish

**Week 3:**
- Day 1-2: Integrate Stripe Checkout
- Day 3: Create webhook handler
- Day 4: Save order to database
- Day 5: Test payment flow

**Week 4:**
- Day 1-2: Set up Resend for emails
- Day 3: Create confirmation email template
- Day 4: Build success page
- Day 5: End-to-end testing + launch

---

## 🔐 Security (Minimal)

### Authentication
- Supabase Auth with email/password only
- No OAuth, no magic links - keep it simple

### Row Level Security

```sql
-- Events: Organizers see only their events
CREATE POLICY "own_events"
ON events FOR ALL
USING (auth.uid() = organizer_id);

-- Events: Anyone can view published events
CREATE POLICY "view_events"
ON events FOR SELECT
USING (true);

-- Orders: Users see only their orders
CREATE POLICY "own_orders"
ON orders FOR SELECT
USING (email = auth.jwt()->>'email');
```

---

## 💰 MVP Costs

### Monthly Infrastructure

| **Service** | **Cost** | **Purpose** |
|-------------|---------|-------------|
| Supabase Free Tier | $0 | Database + Auth (500MB, 2GB bandwidth) |
| Vercel Hobby | $0 | Frontend hosting |
| Stripe | 2.9% + $0.30 | Payment processing |
| Resend Free Tier | $0 | 100 emails/day |
| **Total** | **$0/month** | Zero infrastructure cost for MVP |

**Note:** Only pay Stripe fees when you make sales. Zero upfront cost.

### Development Investment

| **Phase** | **Duration** | **Cost** |
|-----------|-------------|---------|
| MVP | 4 weeks | $30,000 (3 engineers) |
| Contingency | 10% | $3,000 |
| **Total** | **4 weeks** | **$33,000** |

**Comparison to Original Plan:**
- Timeline: 4 weeks vs. 12 weeks (67% faster)
- Cost: $33K vs. $198K (83% cheaper)
- Team: 3 vs. 7 people (57% smaller)

---

## 🎯 MVP Success Criteria

### Launch When:

- [ ] Organizer creates event successfully
- [ ] Public event page displays correctly
- [ ] Payment processing works (3 successful test purchases)
- [ ] Confirmation email arrives
- [ ] No critical bugs
- [ ] Basic mobile responsive

### Target Metrics (First Month):

- 10 events created
- 100 tickets sold
- <1% error rate
- <5 support tickets/week

---

## ⚠️ Known Limitations (Accepting These)

| **Limitation** | **Impact** | **When to Fix** |
|----------------|----------|----------------|
| Only 1 ticket type per event | Can't have VIP/Early Bird tiers | Phase 2 if users request |
| No dashboard analytics | Organizers can't see charts | Phase 2 based on feedback |
| No refund handling | Manual refund process | Phase 2 if needed |
| No cart system | Buy one ticket at a time | Phase 2 if needed |
| No discount codes | Can't offer promotions | Phase 2 if requested |
| No multi-language | English only | Phase 3 if going global |

**Principle:** Only fix what users actually complain about.

---

## 📚 MVP Documentation (Minimal)

### For Developers
- [ ] README with setup instructions
- [ ] Environment variables guide
- [ ] API endpoint documentation
- [ ] Database schema diagram

### For Users
- [ ] 5-minute quick start video
- [ ] "Create Your First Event" tutorial
- [ ] FAQ (10 common questions)

---

## ✅ MVP Launch Checklist

### Pre-Launch (Week 4, Day 4)
- [ ] Test on 5 different devices
- [ ] Process 5 real test transactions
- [ ] Verify emails arrive correctly
- [ ] Check all RLS policies work
- [ ] Set up error monitoring (Sentry free tier)

### Launch Day (Week 4, Day 5)
- [ ] Deploy to production
- [ ] Smoke test all features
- [ ] Monitor for 4 hours
- [ ] Have team available for issues

### Post-Launch (Week 5+)
- [ ] Collect user feedback
- [ ] Fix critical bugs within 24 hours
- [ ] Track key metrics daily
- [ ] Decide what to build next based on user requests

---

## 🚀 What Comes After MVP

### Phase 2 Candidates (Based on User Feedback)

**Only build if users request:**
- Multiple ticket types
- Dashboard with analytics
- Discount codes
- Refund handling
- Email marketing
- Event check-in app

**Don't build unless users are willing to pay for it.**

---

## 🎯 MVP Philosophy

### Core Principles

1. **Ship Fast** → 4 weeks, not 12 weeks
2. **Spend Nothing** → $0/month infrastructure using free tiers
3. **Learn First** → Get real user feedback before building more
4. **Solve One Problem** → Event creators need to sell tickets
5. **No Speculation** → Don't build features users might want

### Success Defined

MVP succeeds if:
- ✅ 10 organizers create events in first month
- ✅ 100 tickets sold successfully
- ✅ Users tell us what features they actually need

**Then and only then** do we build Phase 2.

---

**Document Version:** 3.0 (MVP)
**Last Updated:** 2025-10-17
**Status:** ✅ Ready for Implementation
**Changes:** Stripped down to absolute minimum viable product
**Philosophy:** Launch fast, learn, iterate
**Previous:** [01-MASTER_PLAN_OVERVIEW.md](./01-MASTER_PLAN_OVERVIEW.md)
**Next:** Build based on user feedback
