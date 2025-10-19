# 🔍 Missing Core Tables Analysis (Hi.Events Comparison)

**Analysis Date:** 2025-10-17
**Reference:** Hi.Events Production Schema (45+ tables)
**Current MVP:** 19 tables
**Gap Analysis:** Critical missing tables for functional event platform

---

## 📊 Current MVP vs. Hi.Events

### Our Current MVP (19 tables)
✅ users, organizers, attendees
✅ contacts, companies, interactions, notes (CRM)
✅ venues, events, event_sessions
✅ ticket_tiers, orders, order_items
✅ payments, budgets
✅ tasks, vendors, event_vendors
✅ email_templates

### Hi.Events Has (45+ tables)
✅ accounts (multi-tenant)
✅ promo_codes (discount codes)
✅ order_refunds (refund tracking)
✅ event_settings (per-event config)
✅ taxes_and_fees (tax calculation)
✅ questions (custom forms)
✅ question_answers (form responses)
✅ check_in_lists (check-in management)
✅ attendee_check_ins (check-in records)
✅ event_statistics (analytics)
✅ event_daily_statistics (daily metrics)
✅ images (media management)
✅ product_categories (ticket organization)
✅ capacity_assignments (capacity tracking)
✅ invoices (invoice generation)

---

## 🚨 CRITICAL MISSING TABLES (Must Add to MVP)

These tables are ESSENTIAL for a functional event management platform:

### 1. **promo_codes** ⭐⭐⭐⭐⭐
**Priority:** CRITICAL
**Why:** Every event platform needs discount codes for marketing

**Use Cases:**
- Early bird discounts
- Partner promotions
- Influencer codes
- Group discounts
- Last-minute sales

**Business Impact:** Without this, organizers can't run promotions - major competitive disadvantage

---

### 2. **order_refunds** ⭐⭐⭐⭐⭐
**Priority:** CRITICAL
**Why:** Legal requirement + customer service essential

**Use Cases:**
- Event cancellations
- Customer requests
- Policy enforcement
- Financial tracking

**Business Impact:** Can't process refunds = can't operate legally

---

### 3. **event_settings** ⭐⭐⭐⭐
**Priority:** HIGH
**Why:** Per-event customization required

**Use Cases:**
- Custom messages (pre-checkout, post-checkout)
- Email footer customization
- Order timeout configuration
- SEO settings per event
- Social media links
- Online event connection details

**Business Impact:** Without this, all events look/behave the same - no branding

---

### 4. **questions** + **question_answers** ⭐⭐⭐⭐
**Priority:** HIGH
**Why:** Custom registration forms are standard feature

**Use Cases:**
- Dietary restrictions
- T-shirt sizes
- Custom attendee questions
- Emergency contacts
- Special requirements

**Business Impact:** Can't collect custom attendee info = can't handle complex events

---

### 5. **taxes_and_fees** ⭐⭐⭐⭐
**Priority:** HIGH
**Why:** Legal compliance + transparent pricing

**Use Cases:**
- Sales tax calculation
- Service fees
- Platform fees
- State/local taxes

**Business Impact:** Wrong tax calculation = legal issues + customer complaints

---

### 6. **check_in_lists** + **attendee_check_ins** ⭐⭐⭐
**Priority:** MEDIUM-HIGH
**Why:** Onsite event management essential

**Use Cases:**
- Door check-in
- QR code scanning
- Attendance tracking
- Session check-ins

**Business Impact:** Can't track who showed up = poor event management

---

### 7. **event_statistics** ⭐⭐⭐
**Priority:** MEDIUM
**Why:** Organizers need analytics

**Use Cases:**
- Sales tracking
- Revenue reporting
- Conversion metrics
- Refund tracking

**Business Impact:** No analytics = organizers flying blind

---

### 8. **images** ⭐⭐⭐
**Priority:** MEDIUM
**Why:** Events need visual content

**Use Cases:**
- Event cover images
- Organizer logos
- Product images
- Venue photos

**Business Impact:** No images = unprofessional looking events

---

### 9. **product_categories** ⭐⭐
**Priority:** LOW-MEDIUM
**Why:** Better ticket organization

**Use Cases:**
- Group tickets by type
- VIP section
- General admission section
- Workshops vs. sessions

**Business Impact:** Nice to have for multi-tier events

---

## 📋 RECOMMENDED MVP ADDITIONS

### Phase 1 (Week 4) - Add These Now:
1. ✅ **promo_codes** - Discount codes (CRITICAL)
2. ✅ **order_refunds** - Refund tracking (CRITICAL)
3. ✅ **event_settings** - Event configuration (HIGH)
4. ✅ **questions** - Custom forms (HIGH)
5. ✅ **question_answers** - Form responses (HIGH)
6. ✅ **taxes_and_fees** - Tax calculation (HIGH)

**Total: 6 new tables → 25 total MVP tables**

### Phase 1.5 (Week 5-6) - Add After Launch:
7. ✅ **images** - Media management
8. ✅ **check_in_lists** - Check-in management
9. ✅ **event_statistics** - Analytics

**Total: 3 more tables → 28 total tables**

### Phase 2 (Later) - Based on User Feedback:
- product_categories
- capacity_assignments
- event_daily_statistics
- invoices
- affiliates
- campaigns
- webhooks

---

## 💡 Key Insights from Hi.Events

### 1. Multi-Tenant Architecture
Hi.Events uses **accounts** as the tenant boundary:
- Each account owns events, organizers, users
- Allows SaaS model with team collaboration
- Critical for B2B customers

**Our Decision:** Skip for MVP, use organizers as tenant boundary. Add accounts in Phase 2 if needed.

### 2. Products vs. Tickets
Hi.Events renamed `tickets` → `products` to support:
- Regular tickets
- Add-ons (merchandise, parking)
- Bundled packages

**Our Decision:** Keep it simple with `ticket_tiers` for MVP. Expand to products in Phase 2.

### 3. Comprehensive Settings Pattern
Hi.Events has multiple settings tables:
- event_settings (per-event config)
- organizer_settings (per-organizer config)
- account settings (per-tenant config)

**Our Decision:** Add event_settings in MVP. Use JSONB for flexibility.

### 4. Check-in Architecture
Hi.Events separates:
- check_in_lists (which tickets can check in where)
- attendee_check_ins (actual check-in records)

**Our Decision:** Good pattern. Add after launch in Phase 1.5.

### 5. Promo Codes are Essential
Hi.Events has detailed promo code tracking:
- Usage limits
- Applicable products
- Expiry dates
- Usage statistics

**Our Decision:** MUST ADD to MVP. Too important to skip.

---

## 🎯 Updated MVP Table Count

**Original MVP:** 19 tables
**Add Critical Tables:** +6 tables
**New MVP Total:** 25 tables

### Critical Additions (Week 4):
1. promo_codes
2. order_refunds
3. event_settings
4. questions
5. question_answers
6. taxes_and_fees

**These 6 tables are non-negotiable for a competitive event platform.**

---

## 🚀 Implementation Priority

### MUST ADD (This Week):
```
Week 4, Day 1-2: promo_codes + order_refunds
Week 4, Day 3: event_settings + taxes_and_fees
Week 4, Day 4: questions + question_answers
Week 4, Day 5: Testing + Integration
```

### SHOULD ADD (Next Week):
```
Week 5: images + check_in_lists + event_statistics
```

### COULD ADD (Phase 2):
```
Later: product_categories, invoices, webhooks, etc.
```

---

## ⚠️ Competitive Risk Analysis

**Without promo_codes:**
- ❌ Can't run marketing campaigns
- ❌ Can't offer early bird discounts
- ❌ Can't do partner promotions
- ❌ Major competitive disadvantage vs. Eventbrite

**Without order_refunds:**
- ❌ Can't handle event cancellations
- ❌ Can't process customer refunds
- ❌ Legal/compliance issues
- ❌ Poor customer service

**Without custom questions:**
- ❌ Can't collect dietary restrictions
- ❌ Can't do complex registration
- ❌ Limits event types we can support

**Conclusion:** These are NOT "nice to have" - they're ESSENTIAL.

---

## 📊 Comparison Matrix

| **Feature** | **Eventbrite** | **Hi.Events** | **Our MVP (Current)** | **Our MVP (Updated)** |
|-------------|---------------|---------------|----------------------|----------------------|
| Promo Codes | ✅ | ✅ | ❌ | ✅ |
| Refund Management | ✅ | ✅ | ❌ | ✅ |
| Custom Questions | ✅ | ✅ | ❌ | ✅ |
| Tax Calculation | ✅ | ✅ | ❌ | ✅ |
| Event Settings | ✅ | ✅ | ❌ | ✅ |
| Check-in System | ✅ | ✅ | ❌ | Phase 1.5 |
| Analytics | ✅ | ✅ | ❌ | Phase 1.5 |
| Multi-Tenant | ✅ | ✅ | ❌ | Phase 2 |

**Current MVP:** 2/8 critical features (25%)
**Updated MVP:** 5/8 critical features (62.5%)
**With Phase 1.5:** 7/8 critical features (87.5%)

---

## 🎯 Final Recommendation

### Add These 6 Tables to MVP (Week 4):
1. ✅ promo_codes
2. ✅ order_refunds
3. ✅ event_settings
4. ✅ questions
5. ✅ question_answers
6. ✅ taxes_and_fees

**New MVP Total: 25 tables**

This brings us from 25% feature parity with production platforms to 62.5% - enough to be competitive while still maintaining MVP philosophy.

**Without these tables, we're not building an MVP - we're building a demo.**

---

**Document Version:** 1.0
**Last Updated:** 2025-10-17
**Status:** ⚠️ Action Required
**Recommendation:** Add 6 critical tables to MVP database plan
**Next:** Update 08-MVP-DATABASE.md with these tables
