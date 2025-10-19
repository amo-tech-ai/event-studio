# EventOS Implementation Phases - Production Ready Guide

**Version:** 1.0
**Date:** October 2025
**Project:** EventOS - AI-Powered Corporate Event Management Platform
**Target:** Production-Ready MVP in 5 Weeks

---

## Table of Contents

1. [Phase Overview](#phase-overview)
2. [Phase 0: Pre-Implementation Setup](#phase-0-pre-implementation-setup)
3. [Phase 1: Foundation (Week 1)](#phase-1-foundation-week-1)
4. [Phase 2: Core Features (Weeks 2-3)](#phase-2-core-features-weeks-2-3)
5. [Phase 3: Production Polish (Week 4)](#phase-3-production-polish-week-4)
6. [Phase 4: Testing & Deployment (Week 5)](#phase-4-testing--deployment-week-5)
7. [Phase 5: Post-MVP (Future)](#phase-5-post-mvp-future)
8. [Best Practices](#best-practices)
9. [Quality Gates](#quality-gates)

---

## Phase Overview

### Timeline & Milestones

| Phase | Duration | Tasks | Milestone | Status |
|-------|----------|-------|-----------|--------|
| **0: Setup** | Day 1 | Environment | Dev environment ready | ⏳ Pending |
| **1: Foundation** | Week 1 (5 days) | 13-14 | Database + Auth working | ⏳ Pending |
| **2: Core Features** | Weeks 2-3 (10 days) | 1-4, 15 | Event creation + payments working | ⏳ Pending |
| **3: Production Polish** | Week 4 (5 days) | 8, 10-12 | Dashboard, security, performance optimized | ⏳ Pending |
| **4: Testing & Deploy** | Week 5 (5 days) | 16-17 | Production deployed with monitoring | ⏳ Pending |
| **5: Post-MVP** | Post-launch | 5-7, 9 | CRM and AI chat features | ⏳ Future |

### Critical Path

```
Phase 0 (Setup) → Phase 1 (Foundation) → Phase 2 (Features) → Phase 3 (Polish) → Phase 4 (Deploy) → Phase 5 (Post-MVP)
```

**Cannot skip phases** - Each phase depends on previous completion.

---

## Phase 0: Pre-Implementation Setup

**Duration:** Day 1 (8 hours)
**Goal:** Development environment ready for Phase 1
**Status Gate:** All tools installed, APIs configured, first commit pushed

### Stage 0.1: Environment Setup (2 hours)

**Checklist:**
- [ ] Node.js 18+ installed
- [ ] npm or bun package manager working
- [ ] Git configured with user name/email
- [ ] Claude Code installed and running
- [ ] VS Code extensions installed (ESLint, Prettier, Tailwind IntelliSense)

**Commands:**
```bash
# Verify Node.js
node --version  # Should be v18 or higher

# Verify npm
npm --version

# Verify Git
git --version
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# Initialize project
cd /home/sk/eventos-ai-canvas
npm install
```

**Validation:**
```bash
npm run dev  # Should start Vite dev server on port 8080
```

### Stage 0.2: Supabase Setup (2 hours)

**Checklist:**
- [ ] Supabase CLI installed
- [ ] Project linked to remote Supabase instance
- [ ] Database connection verified
- [ ] TypeScript types generated

**Commands:**
```bash
# Install Supabase CLI
npm install -g supabase

# Link to remote project
npx supabase link --project-ref jnmfterqvevgusfckxbt

# Verify connection
npx supabase db remote list

# Generate types
npx supabase gen types typescript --project-id jnmfterqvevgusfckxbt > src/integrations/supabase/types.ts
```

**Validation:**
```bash
# Check types file exists and is not empty
wc -l src/integrations/supabase/types.ts  # Should be > 100 lines
```

### Stage 0.3: API Keys Configuration (1 hour)

**Checklist:**
- [ ] `.env` file created from `.env.example`
- [ ] Supabase keys configured
- [ ] Anthropic API key for Task Master (optional but recommended)
- [ ] Perplexity API key for research (optional but recommended)
- [ ] Stripe keys ready (can be test keys for now)

**Steps:**
```bash
# Copy example
cp .env.example .env

# Edit .env with actual keys
nano .env
```

**Required Keys:**
```bash
VITE_SUPABASE_URL=https://jnmfterqvevgusfckxbt.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGc...  # From Supabase dashboard
VITE_SUPABASE_PROJECT_ID=jnmfterqvevgusfckxbt

# Optional but recommended for Task Master
ANTHROPIC_API_KEY=sk-ant-api03-...
PERPLEXITY_API_KEY=pplx-...

# Stripe (test keys for development)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

**Validation:**
```bash
# Verify environment variables load
npm run dev
# Open http://localhost:8080
# Check browser console for no Supabase errors
```

### Stage 0.4: Task Master Initialization (2 hours)

**Checklist:**
- [ ] Task Master installed and initialized
- [ ] PRD parsed into tasks
- [ ] Complexity analysis run
- [ ] Critical tasks expanded

**Commands:**
```bash
# Already installed, verify
npm list task-master-ai  # Should show v0.28.0

# Verify configuration
cat .taskmaster/config.json

# List all tasks
npm run tm:list

# Get next task
npm run tm:next  # Should return Task 13 (Database)

# Optional: Expand critical tasks
npm run tm:expand 13  # Expand database task
npm run tm:expand 14  # Expand auth task
npm run tm:expand 1   # Expand wizard task
npm run tm:expand 4   # Expand payments task
```

**Validation:**
```bash
# Check tasks are loaded
npm run tm:list | wc -l  # Should show 17 tasks

# Check next task
npm run tm:next  # Should return Task 13 (Database Setup)
```

### Stage 0.5: Git Initial Commit (1 hour)

**Checklist:**
- [ ] `.gitignore` configured correctly
- [ ] Initial commit with setup complete
- [ ] Branch protection configured (optional)

**Commands:**
```bash
# Verify .gitignore
cat .gitignore | grep ".env"  # Should be there
cat .gitignore | grep "node_modules"  # Should be there

# Check git status
git status

# Add all project files (except .env, node_modules)
git add .

# Initial commit
git commit -m "chore: initial EventOS setup with Task Master

- Configure Supabase integration
- Set up Task Master AI with 17 tasks
- Add environment configuration
- Initialize project structure

Task Master: Phase 0 complete"

# Push to remote
git push origin main
```

**Validation:**
```bash
# Verify commit
git log --oneline | head -1

# Verify .env not committed
git ls-files | grep ".env"  # Should return nothing
```

### Phase 0 Exit Criteria ✅

**All must be true to proceed to Phase 1:**
- ✅ `npm run dev` starts without errors
- ✅ Supabase connection verified
- ✅ `npm run tm:next` returns Task 13
- ✅ `.env` file exists and has all required keys
- ✅ Initial git commit pushed
- ✅ No sensitive data in git repository

**Time Check:** Should complete in ≤ 8 hours

---

## Phase 1: Foundation (Week 1)

**Duration:** 5 days (40 hours)
**Tasks:** 13 (Database), 14 (Auth)
**Goal:** Database schema + authentication working
**Status Gate:** Can sign up, sign in, and create a profile

### Stage 1.1: Database Schema (Days 1-2, 16 hours)

**Task:** Task 13 - Database Schema Setup and RLS Configuration

**Subtasks (if expanded):**
1. Create profiles and user_roles tables
2. Create events, venues, tickets tables
3. Create orders and attendees tables
4. Implement RLS policies on all tables
5. Create security definer functions
6. Add database constraints and indexes
7. Generate TypeScript types

**Implementation Order:**
```
Day 1 Morning: Profiles + User Roles tables
Day 1 Afternoon: Events + Venues tables
Day 2 Morning: Tickets + Orders + Attendees tables
Day 2 Afternoon: RLS policies + Functions + Constraints
```

**Workflow:**
```bash
# Start task
npm run tm:in-progress 13

# Create migration for profiles table
npx supabase migration new add_profiles_and_roles

# Edit migration file
nano supabase/migrations/$(ls -t supabase/migrations | head -1)

# Push migration
npx supabase db push

# Regenerate types
npx supabase gen types typescript --project-id jnmfterqvevgusfckxbt > src/integrations/supabase/types.ts

# Log progress
npm run tm:update 13.1 --prompt="Created profiles table with UUID pk, linked to auth.users, added RLS policy for users to view own profile"

# Complete subtask
npx task-master set-status --id=13.1 --status=done

# Repeat for all subtasks...
```

**Quality Checks:**
- [ ] All tables created with proper data types
- [ ] Foreign keys with CASCADE DELETE configured
- [ ] RLS policies tested with different user roles
- [ ] Check constraints prevent invalid data (dates, capacity limits)
- [ ] TypeScript types match schema exactly

**Testing:**
```bash
# Test RLS policies manually in Supabase SQL Editor
-- Try to read another user's events (should fail)
SELECT * FROM events WHERE organizer_id != auth.uid();

# Test security definer functions
SELECT has_role(auth.uid(), 'admin');

# Test constraints
-- Try to insert invalid event (end_date < start_date)
-- Should fail with check constraint error
```

**Exit Criteria:**
- ✅ All 7+ tables created
- ✅ RLS policies active on ALL tables
- ✅ Security functions working
- ✅ TypeScript types generated with no errors
- ✅ Subtask 13 marked as done

### Stage 1.2: Authentication System (Days 3-4, 16 hours)

**Task:** Task 14 - Authentication System Implementation

**Subtasks (if expanded):**
1. Create auth pages (Login, Signup, Reset Password)
2. Implement useAuth hook with Supabase Auth
3. Create profile on signup with role assignment
4. Implement ProtectedRoute component
5. Add session persistence and token refresh
6. Add email verification flow
7. Handle auth errors gracefully

**Implementation Order:**
```
Day 3 Morning: Login & Signup pages
Day 3 Afternoon: useAuth hook + profile creation
Day 4 Morning: ProtectedRoute + session persistence
Day 4 Afternoon: Error handling + testing
```

**Workflow:**
```bash
# Start task
npm run tm:in-progress 14

# Create auth pages
mkdir -p src/pages/auth
touch src/pages/auth/Login.tsx
touch src/pages/auth/Signup.tsx
touch src/pages/auth/ResetPassword.tsx

# Create useAuth hook
touch src/hooks/use-auth.ts

# Implement and test

# Log progress
npm run tm:update 14.1 --prompt="Created Login page with email/password form, integrated Supabase signInWithPassword, added error handling for wrong credentials"

# Complete subtasks one by one
npx task-master set-status --id=14.1 --status=done
```

**Quality Checks:**
- [ ] Sign up creates profile in profiles table
- [ ] Sign up assigns default role in user_roles table
- [ ] Login redirects to dashboard
- [ ] Protected routes redirect to /auth/login if not authenticated
- [ ] Session persists on page refresh
- [ ] Token auto-refreshes before expiry
- [ ] Error messages user-friendly (not technical)

**Testing:**
```bash
# Manual testing checklist
1. Sign up with new email → Should create user and profile
2. Check Supabase dashboard → User exists with role
3. Sign in with credentials → Should redirect to dashboard
4. Refresh page → Should stay logged in
5. Try accessing /dashboard without login → Should redirect to /auth/login
6. Test wrong password → Should show friendly error
7. Test duplicate email → Should show "Email already registered"
```

**Exit Criteria:**
- ✅ Sign up flow working end-to-end
- ✅ Sign in flow working with session persistence
- ✅ Protected routes block unauthenticated access
- ✅ All error cases handled gracefully
- ✅ Task 14 marked as done

### Stage 1.3: Integration Testing (Day 5, 8 hours)

**Goal:** Verify Phase 1 foundation is solid

**Tests:**
```bash
# 1. Database integrity test
- Create user via signup
- Check profiles table has record
- Check user_roles table has record
- Verify RLS allows user to see own profile only

# 2. Auth flow test
- Sign up → Sign out → Sign in → Access protected route
- Test session persistence across browser refresh
- Test token refresh (wait 50 minutes, verify still logged in)

# 3. Multi-user test
- Create 2 users (User A, User B)
- User A tries to read User B's profile via SQL
- Should fail due to RLS

# 4. Type safety test
npm run lint
npx tsc --noEmit  # Should have 0 errors
```

**Exit Criteria:**
- ✅ All manual tests pass
- ✅ No TypeScript errors
- ✅ No ESLint errors
- ✅ RLS verified working correctly

### Phase 1 Exit Criteria ✅

**All must be true to proceed to Phase 2:**
- ✅ Tasks 13 and 14 marked as `done`
- ✅ Can sign up, sign in, sign out
- ✅ Profile created on signup with role
- ✅ Protected routes work correctly
- ✅ RLS policies tested and working
- ✅ TypeScript types match database schema
- ✅ Git commit: "feat: complete Phase 1 foundation (tasks 13-14)"

**Time Check:** Should complete in ≤ 40 hours (5 days)

---

## Phase 2: Core Features (Weeks 2-3)

**Duration:** 10 days (80 hours)
**Tasks:** 1-4, 15
**Goal:** Event creation wizard + payments + email notifications working
**Status Gate:** Can create event, buy ticket, receive confirmation email

### Stage 2.1: Event Wizard Stage 1-2 (Days 6-7, 16 hours)

**Task:** Task 1 - Event Basics & Details

**Subtasks (if expanded):**
1. Create EventBasicsForm with Zod validation
2. Implement auto-save to wizard_states table
3. Create EventDetailsForm with Tiptap editor
4. Integrate Lovable AI for description generation
5. Add image upload with preview
6. Test wizard navigation

**Implementation Workflow:**
```bash
npm run tm:in-progress 1

# Day 6: Event Basics
- Create EventBasicsForm.tsx with react-hook-form
- Add Zod schema for validation (name, type, dates, capacity)
- Implement auto-save every 2 seconds
- Test auto-save persists on refresh

# Day 7: Event Details
- Create EventDetailsForm.tsx with Tiptap rich text
- Add AI description generation edge function
- Implement image upload with FileReader
- Test full Stage 1-2 flow

npm run tm:done 1
```

**Quality Checks:**
- [ ] Form validation prevents invalid submissions
- [ ] Auto-save triggers every 2 seconds
- [ ] Wizard state resumes on browser refresh
- [ ] AI description generates in <2 seconds
- [ ] Image uploads limited to JPG/PNG, max 5MB

### Stage 2.2: Event Wizard Stage 3-4 (Days 8-9, 16 hours)

**Task:** Task 2 - Venue Selection & Ticketing

**Subtasks:**
1. Create venue search with filters
2. Implement AI venue recommendations
3. Create venue details modal
4. Build ticket tier configuration
5. Add pricing and sales period settings
6. Validate ticket math (total ≤ capacity)

**Implementation Workflow:**
```bash
npm run tm:in-progress 2

# Day 8: Venue Selection
- Create VenueSearchForm with filters
- Add AI venue recommendation edge function
- Implement venue details modal

# Day 9: Ticketing
- Create TicketTierForm (max 5 tiers)
- Add pricing validation ($0-$10,000)
- Implement sales period date pickers
- Validate total tickets ≤ capacity

npm run tm:done 2
```

### Stage 2.3: Event Wizard Stage 5-6 (Days 10-11, 16 hours)

**Task:** Task 3 - Marketing & Review/Publish

**Implementation Workflow:**
```bash
npm run tm:in-progress 3

# Day 10: Marketing
- Create MarketingForm with AI copy generation
- Add SEO settings (meta title, description)
- Implement landing page preview

# Day 11: Review & Publish
- Create ReviewSummary component
- Implement publish workflow
- Generate static HTML landing page
- Send confirmation email

npm run tm:done 3
```

### Stage 2.4: Stripe Payment Integration (Days 12-14, 24 hours)

**Task:** Task 4 - Stripe Connect + Payments

**Subtasks:**
1. Set up Stripe Connect configuration
2. Implement checkout session creation
3. Build webhook handler with signature verification
4. Create order tracking system
5. Generate QR codes for attendees
6. Implement refund processing
7. Add admin refund dashboard
8. Security testing

**Implementation Workflow:**
```bash
npm run tm:in-progress 4

# Day 12: Stripe Connect Setup
- Configure Stripe Connect in Supabase edge function
- Create checkout session endpoint
- Test checkout flow with test card

# Day 13: Webhook & Orders
- Implement webhook handler in edge function
- Add signature verification (CRITICAL)
- Create orders table records on payment success
- Generate QR codes for attendees

# Day 14: Refunds & Admin
- Implement refund processing
- Create admin refund dashboard
- Test full payment flow end-to-end

npm run tm:done 4
```

**Security Critical:**
```typescript
// MUST verify webhook signature
const sig = req.headers.get('stripe-signature');
const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
// Never trust webhook data without verification!
```

### Stage 2.5: Email Notifications (Day 15, 8 hours)

**Task:** Task 15 - Resend Email Integration

**Subtasks:**
1. Set up Resend API in edge function
2. Create ticket confirmation email template
3. Create event reminder email template
4. Implement email queue system
5. Add email preferences

**Implementation Workflow:**
```bash
npm run tm:in-progress 15

# Create Resend edge function
npx supabase functions new send-email

# Implement email templates
- Ticket confirmation with QR code
- Event reminder (24 hours before)
- Password reset (custom branded)

# Test email delivery
curl -X POST https://jnmfterqvevgusfckxbt.supabase.co/functions/v1/send-email \
  -H "Authorization: Bearer [anon-key]" \
  -d '{"template":"ticket_confirmation","to":"test@example.com"}'

npm run tm:done 15
```

### Phase 2 Exit Criteria ✅

**All must be true to proceed to Phase 3:**
- ✅ Tasks 1, 2, 3, 4, 15 marked as `done`
- ✅ Can create full event through 6-stage wizard
- ✅ Can purchase ticket with Stripe test card
- ✅ Receive confirmation email with QR code
- ✅ Event landing page generates correctly
- ✅ Webhook signature verification working
- ✅ Git commit: "feat: complete Phase 2 core features (tasks 1-4, 15)"

**Time Check:** Should complete in ≤ 80 hours (10 days)

---

## Phase 3: Production Polish (Week 4)

**Duration:** 5 days (40 hours)
**Tasks:** 8, 10, 11, 12
**Goal:** Dashboard, security, performance, accessibility ready for production
**Status Gate:** Lighthouse score >90, security audit passes

### Stage 3.1: Dashboard & Analytics (Days 16-17, 16 hours)

**Task:** Task 8 - Dashboard with KPI Cards

**Workflow:**
```bash
npm run tm:in-progress 8

# Day 16: KPI Cards
- Create KPICard component
- Implement total events, revenue, tickets sold metrics
- Add real-time updates with Supabase Realtime

# Day 17: Charts & Export
- Create revenue trend chart (recharts)
- Add ticket sales by tier pie chart
- Implement CSV export

npm run tm:done 8
```

### Stage 3.2: Security Hardening (Day 18, 8 hours)

**Task:** Task 10 - Security Enhancements

**Workflow:**
```bash
npm run tm:in-progress 10

# XSS prevention
- Sanitize all user inputs
- Escape HTML in rich text editor

# Rate limiting
- Add rate limiting to edge functions (10 req/min)
- Implement CSRF protection

# Security headers
- Add Content-Security-Policy
- Set X-Frame-Options

npm run tm:done 10
```

### Stage 3.3: Performance Optimization (Day 19, 8 hours)

**Task:** Task 11 - Performance & Caching

**Workflow:**
```bash
npm run tm:in-progress 11

# React Query caching
- Configure staleTime for all queries
- Implement query invalidation

# Code splitting
- Lazy load wizard stages
- Split vendor bundles

# Database optimization
- Add indexes on frequently queried columns
- Optimize RLS policies for performance

npm run tm:done 11
```

### Stage 3.4: Mobile & Accessibility (Day 20, 8 hours)

**Task:** Task 12 - WCAG 2.1 AA Compliance

**Workflow:**
```bash
npm run tm:in-progress 12

# Accessibility
- Add ARIA labels to all interactive elements
- Test keyboard navigation
- Ensure color contrast ratios meet WCAG

# Mobile optimization
- Test on 320px width (iPhone SE)
- Optimize touch targets (44px minimum)
- Test on real devices

npm run tm:done 12
```

### Phase 3 Exit Criteria ✅

- ✅ Tasks 8, 10, 11, 12 marked as `done`
- ✅ Lighthouse Performance score >90
- ✅ Lighthouse Accessibility score >90
- ✅ No critical security vulnerabilities
- ✅ Dashboard loads in <800ms
- ✅ Mobile responsive (320px+)

---

## Phase 4: Testing & Deployment (Week 5)

**Duration:** 5 days (40 hours)
**Tasks:** 16, 17
**Goal:** Production deployed with monitoring
**Status Gate:** Live on production domain with SSL

### Stage 4.1: E2E Testing (Days 21-23, 24 hours)

**Task:** Task 16 - End-to-End Testing

**Workflow:**
```bash
npm run tm:in-progress 16

# Day 21: Setup Playwright
npm install -D @playwright/test
npx playwright install

# Day 22-23: Write E2E tests
- User registration flow
- Event creation wizard (all 6 stages)
- Ticket purchase flow
- Payment webhook handling
- Email delivery

npm run tm:done 16
```

### Stage 4.2: Production Deployment (Days 24-25, 16 hours)

**Task:** Task 17 - SEO & Production Deploy

**Workflow:**
```bash
npm run tm:in-progress 17

# Day 24: SEO
- Add meta tags to all pages
- Create sitemap.xml
- Implement structured data (JSON-LD)

# Day 25: Deploy
- Configure custom domain
- Set up SSL certificate
- Deploy to Lovable Cloud production
- Configure monitoring (Sentry, Google Analytics)

npm run tm:done 17
```

### Phase 4 Exit Criteria ✅

- ✅ Tasks 16, 17 marked as `done`
- ✅ All E2E tests passing
- ✅ Production deployed on custom domain
- ✅ SSL certificate active
- ✅ Monitoring and error tracking configured
- ✅ SEO score >90

---

## Phase 5: Post-MVP (Future)

**Tasks:** 5-7, 9
**Goal:** CRM system and AI chat

Will be implemented after MVP launch based on user feedback.

---

## Best Practices

### Daily Workflow

**Morning (30 min):**
```bash
# 1. Pull latest changes
git pull origin main

# 2. Check next task
npm run tm:next

# 3. Review task details
npx task-master show <id>

# 4. Mark in progress
npm run tm:in-progress <id>

# 5. Plan the day's work
```

**During Work (every 1-2 hours):**
```bash
# Log progress
npm run tm:update <subtask-id> --prompt="Implemented X, discovered Y issue, resolved with Z approach"

# Commit frequently
git add .
git commit -m "feat(wizard): implement stage 1 form validation (task 1.1)"
```

**End of Day (30 min):**
```bash
# Mark completed subtasks as done
npm run tm:done <subtask-id>

# Push work
git push origin feat/wizard-stage-1

# Update team (if applicable)
```

### Code Quality Standards

**Before Marking Task Done:**
```bash
# 1. Lint check
npm run lint  # ✅ Must pass

# 2. Type check
npx tsc --noEmit  # ✅ Must have 0 errors

# 3. Manual testing
# Test all user flows related to the task

# 4. Accessibility check
# Use browser DevTools Lighthouse

# 5. Security check
# Review for XSS, SQL injection, CSRF vulnerabilities
```

### Git Commit Standards

**Format:**
```
<type>(<scope>): <subject> (task <id>)

<optional body>
```

**Examples:**
```bash
git commit -m "feat(database): add profiles table with RLS (task 13.1)"
git commit -m "fix(auth): resolve token refresh race condition (task 14.6)"
git commit -m "refactor(wizard): simplify auto-save logic (task 1.2)"
git commit -m "test(payments): add webhook signature verification tests (task 4.3)"
```

---

## Quality Gates

### Phase Exit Criteria Summary

| Phase | Exit Criteria | Time Limit |
|-------|---------------|------------|
| **0: Setup** | Environment ready, Task Master initialized | 1 day |
| **1: Foundation** | Database + Auth working, RLS verified | 5 days |
| **2: Core Features** | Event creation + payments working | 10 days |
| **3: Production Polish** | Lighthouse >90, security hardened | 5 days |
| **4: Testing & Deploy** | Production live with monitoring | 5 days |

**Total MVP Timeline:** 26 days (5.2 weeks) with buffer

---

**Generated:** October 9, 2025
**Next Steps:** Expand critical tasks 13, 14, 1, 4 with detailed subtasks
