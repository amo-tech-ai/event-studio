# EventOS Production-Ready Setup Checklist

**Version:** 1.0
**Date:** October 2025
**Project:** EventOS - AI-Powered Corporate Event Management Platform
**Purpose:** Complete checklist for production deployment

---

## Quick Start Guide

### Step 1: Verify Prerequisites (15 min)

```bash
# Run this verification script
node --version  # ✅ v18 or higher
npm --version   # ✅ v8 or higher
git --version   # ✅ v2.30 or higher
npx supabase --version  # ✅ v1.150 or higher

# Check Task Master
npm run tm:next  # ✅ Should return Task 13 (Database Setup)
```

### Step 2: Start Phase 0 Setup (Day 1)

```bash
# Install all dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Verify Supabase connection
npx supabase link --project-ref jnmfterqvevgusfckxbt
npx supabase db remote list  # Should show tables
```

### Step 3: Begin Phase 1 Implementation (Week 1)

```bash
# Start database task
npm run tm:in-progress 13
npx task-master show 13  # View all 8 subtasks

# View first subtask
npx task-master show 13.1  # Design database schema
```

---

## Complete Production Checklist

### Phase 0: Pre-Implementation Setup ✅

**Timeline:** Day 1 (8 hours)
**Exit Criteria:** Development environment fully functional

#### Environment Setup
- [ ] Node.js 18+ installed and verified
- [ ] npm or bun package manager working
- [ ] Git configured with username and email
- [ ] Claude Code or VS Code installed
- [ ] Terminal/shell working (bash/zsh)

**Verification:**
```bash
node --version && npm --version && git --version
```

#### Project Dependencies
- [ ] All npm packages installed (`npm install`)
- [ ] No dependency conflicts
- [ ] Dev server starts (`npm run dev`)
- [ ] TypeScript compiles (`npx tsc --noEmit`)
- [ ] ESLint runs without errors (`npm run lint`)

**Verification:**
```bash
npm run dev  # Should start on http://localhost:8080
curl http://localhost:8080  # Should return HTML
```

#### Supabase Configuration
- [ ] Supabase CLI installed globally
- [ ] Project linked to remote instance
- [ ] Database connection verified
- [ ] TypeScript types generated from schema
- [ ] RLS policies visible in dashboard

**Verification:**
```bash
npx supabase link --project-ref jnmfterqvevgusfckxbt
npx supabase db remote list  # Shows tables
wc -l src/integrations/supabase/types.ts  # >100 lines
```

#### API Keys Configuration
- [ ] `.env` file created from template
- [ ] `VITE_SUPABASE_URL` set
- [ ] `VITE_SUPABASE_PUBLISHABLE_KEY` set
- [ ] `VITE_SUPABASE_PROJECT_ID` set
- [ ] `ANTHROPIC_API_KEY` set (for Task Master - optional)
- [ ] `PERPLEXITY_API_KEY` set (for research - optional)
- [ ] Stripe test keys ready (can set later)

**Security Check:**
```bash
cat .gitignore | grep ".env"  # ✅ Must be ignored
git status | grep ".env"      # ❌ Should not appear
```

#### Task Master Setup
- [ ] Task Master v0.28.0 installed
- [ ] Configuration file exists (`.taskmaster/config.json`)
- [ ] All 17 tasks loaded in `tasks.json`
- [ ] Next task returns Task 13 (Database)
- [ ] Task files generated in `.taskmaster/tasks/`
- [ ] Tags created (mvp-foundation, mvp-features, etc.)

**Verification:**
```bash
npm run tm:list | wc -l  # Should show 17 tasks
npm run tm:next  # Should return Task 13
npm run tm:tags  # Should show 5 tags
```

#### Git Repository
- [ ] Initial commit created
- [ ] `.gitignore` configured correctly
- [ ] No sensitive data committed
- [ ] Remote repository linked
- [ ] Can push to main branch

**Verification:**
```bash
git log --oneline | head -1  # Shows initial commit
git ls-files | grep ".env"   # Should return nothing
git push origin main         # Should succeed
```

---

### Phase 1: Foundation (Week 1) ✅

**Timeline:** 5 days (40 hours)
**Tasks:** 13 (Database - 8 subtasks), 14 (Auth - 7 subtasks)
**Exit Criteria:** Database + Auth working, can sign up and create profile

#### Task 13: Database Schema (Days 1-2)

**Subtask 13.1: Design Schema**
- [ ] All tables documented (profiles, user_roles, events, venues, tickets, orders, attendees)
- [ ] Data types specified for all columns
- [ ] Relationships mapped (foreign keys)
- [ ] Enums defined (app_role: admin, organizer, attendee, venue, vendor)
- [ ] Schema reviewed and approved

**Subtask 13.2: Create Migrations**
- [ ] Migration files created for each table
- [ ] Enums created before tables
- [ ] Foreign keys with CASCADE DELETE
- [ ] Initial indexes added
- [ ] Migrations tested on fresh database

**Verification:**
```bash
npx supabase db push  # Should succeed
npx supabase db remote list  # Shows all tables
```

**Subtask 13.3: Add Constraints**
- [ ] Check constraint: `end_date > start_date`
- [ ] Check constraint: `capacity >= 10 AND capacity <= 10000`
- [ ] Check constraint: ticket pricing validation
- [ ] Foreign keys prevent orphaned records
- [ ] Unique constraints on emails, usernames

**Verification:**
```sql
-- Test in Supabase SQL Editor
INSERT INTO events (start_date, end_date)
VALUES ('2025-01-10', '2025-01-05');  -- Should FAIL
```

**Subtask 13.4: Security Functions**
- [ ] `has_role(user_id, role)` function created
- [ ] `user_purchased_ticket(ticket_id, user_id)` function created
- [ ] `user_organizes_ticket_event(ticket_id, user_id)` function created
- [ ] `generate_qr_code()` function created
- [ ] All functions marked `SECURITY DEFINER`

**Verification:**
```sql
SELECT has_role(auth.uid(), 'admin');  -- Should return boolean
```

**Subtask 13.5: RLS Policies**
- [ ] RLS enabled on ALL tables
- [ ] Users can view own events
- [ ] Admins can view all events
- [ ] Public can view published events
- [ ] Policies tested with different user roles

**Verification:**
```bash
# Sign in as non-admin user
# Try: SELECT * FROM events WHERE organizer_id != auth.uid();
# Should return 0 rows
```

**Subtask 13.6: Performance Indexes**
- [ ] Indexes on foreign keys (organizer_id, venue_id, etc.)
- [ ] Indexes on frequently filtered columns (status, created_at)
- [ ] Indexes on JOIN columns
- [ ] Index naming convention followed
- [ ] Query performance benchmarked

**Subtask 13.7: TypeScript Types**
- [ ] Types generated from schema
- [ ] Types file has no errors
- [ ] Types used in code (no `any` types)
- [ ] Auto-generation integrated into workflow

**Verification:**
```bash
npx supabase gen types typescript --project-id jnmfterqvevgusfckxbt > src/integrations/supabase/types.ts
npx tsc --noEmit  # Should have 0 errors
```

**Subtask 13.8: Migration Workflow**
- [ ] Migration commands documented
- [ ] Rollback scripts created
- [ ] Migration tested in staging
- [ ] Migration logs maintained
- [ ] Rollback tested successfully

**Task 13 Exit Criteria:**
- ✅ All 7+ tables created with RLS
- ✅ Security functions working
- ✅ Constraints prevent invalid data
- ✅ TypeScript types generated
- ✅ `npm run tm:done 13` completed

---

#### Task 14: Authentication (Days 3-4)

**Subtask 14.1: Auth Pages**
- [ ] `/auth/login` page created with LoginForm
- [ ] `/auth/signup` page created with SignupForm
- [ ] `/auth/reset-password` page created
- [ ] Forms use react-hook-form + Zod
- [ ] Loading states during auth operations
- [ ] Error messages user-friendly

**Subtask 14.2: useAuth Hook**
- [ ] `useAuth` hook wraps Supabase Auth
- [ ] AuthContext provides user state
- [ ] Session persistence across page reloads
- [ ] Automatic token refresh
- [ ] Error handling for network failures

**Subtask 14.3: Profile Creation**
- [ ] Profile created on signup in `profiles` table
- [ ] Role assigned in `user_roles` table (default: organizer)
- [ ] Transaction atomicity ensured
- [ ] Error handling if profile creation fails

**Verification:**
```bash
# Sign up with new email
# Check Supabase dashboard:
# - auth.users has new user
# - profiles table has new profile
# - user_roles table has role assignment
```

**Subtask 14.4: Protected Routes**
- [ ] `ProtectedRoute` component created
- [ ] Redirects to `/auth/login` if not authenticated
- [ ] Role-based access control working
- [ ] Loading state while checking auth

**Verification:**
```bash
# Navigate to /dashboard without login
# Should redirect to /auth/login
```

**Subtask 14.5: OAuth & Email Verification**
- [ ] Google OAuth configured (optional)
- [ ] GitHub OAuth configured (optional)
- [ ] Email verification flow implemented
- [ ] Unverified users handled correctly

**Subtask 14.6: Session Management**
- [ ] Sessions persist in localStorage/cookies
- [ ] Tokens refresh automatically before expiry
- [ ] Session expiration handled gracefully
- [ ] Multi-tab session sync working

**Verification:**
```bash
# Sign in, refresh page 10 times
# Should stay logged in
# Wait 50 minutes, refresh page
# Should still be logged in (token refreshed)
```

**Subtask 14.7: Auth Testing**
- [ ] Sign up flow tested (creates profile + role)
- [ ] Sign in flow tested (establishes session)
- [ ] Password reset tested (sends email)
- [ ] Protected route redirect tested
- [ ] Error cases tested (wrong password, duplicate email)

**Task 14 Exit Criteria:**
- ✅ Can sign up and create account
- ✅ Can sign in and access dashboard
- ✅ Protected routes block unauthenticated users
- ✅ Session persists across refreshes
- ✅ `npm run tm:done 14` completed

---

### Phase 1 Final Checklist ✅

**Before moving to Phase 2:**
- [ ] Tasks 13 and 14 both marked as `done`
- [ ] Can create account via signup
- [ ] Can sign in with credentials
- [ ] Profile and role created automatically
- [ ] Protected routes working
- [ ] RLS policies verified
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] Git commit: `feat: complete Phase 1 foundation (tasks 13-14)`

**Time Check:** ≤ 40 hours (5 days)

---

### Phase 2: Core Features (Weeks 2-3) ✅

**Timeline:** 10 days (80 hours)
**Tasks:** 1 (Wizard 1-2 - 8 subtasks), 2-3 (Wizard 3-6), 4 (Payments - 10 subtasks), 15 (Email)
**Exit Criteria:** Can create event, purchase ticket, receive confirmation

#### Quick Checklist for Phase 2

**Week 2 (Days 6-10):**
- [ ] Task 1: Event Wizard Stage 1-2 completed (8 subtasks)
  - Event basics form with validation
  - Auto-save every 2 seconds
  - Image upload with preview
  - Rich text editor
  - AI description generation
  - Wizard state management
  - Navigation flow working
  - All tests passing
- [ ] Task 2: Event Wizard Stage 3-4 started
- [ ] Task 3: Event Wizard Stage 5-6 planned

**Week 3 (Days 11-15):**
- [ ] Task 2: Wizard Stage 3-4 completed (venue + tickets)
- [ ] Task 3: Wizard Stage 5-6 completed (marketing + publish)
- [ ] Task 4: Stripe payments completed (10 subtasks)
  - Stripe Connect configured
  - Checkout sessions working
  - Webhook handler secure
  - Order tracking implemented
  - QR codes generating
  - Confirmation emails sending
  - Refund processing working
  - Admin dashboard functional
  - Security tested
  - Payment flow end-to-end verified
- [ ] Task 15: Email notifications completed

**Phase 2 Exit Criteria:**
- ✅ Can create event through all 6 wizard stages
- ✅ Can purchase ticket with Stripe test card
- ✅ Receive confirmation email with QR code
- ✅ Webhook signature verification working
- ✅ Tasks 1-4, 15 marked as `done`

---

### Phase 3: Production Polish (Week 4) ✅

**Timeline:** 5 days (40 hours)
**Tasks:** 8 (Dashboard), 10 (Security), 11 (Performance), 12 (Accessibility)

**Quick Checklist:**
- [ ] Dashboard with KPI cards working
- [ ] Real-time updates via Supabase Realtime
- [ ] Charts rendering (recharts)
- [ ] CSV export functional
- [ ] XSS prevention implemented
- [ ] Rate limiting on edge functions
- [ ] CSRF protection added
- [ ] React Query caching configured
- [ ] Code splitting implemented
- [ ] Database queries optimized
- [ ] WCAG 2.1 AA compliance verified
- [ ] Mobile responsive (320px+)
- [ ] Keyboard navigation working

**Phase 3 Exit Criteria:**
- ✅ Lighthouse Performance score >90
- ✅ Lighthouse Accessibility score >90
- ✅ Dashboard loads in <800ms
- ✅ No critical security vulnerabilities
- ✅ Tasks 8, 10, 11, 12 marked as `done`

---

### Phase 4: Testing & Deployment (Week 5) ✅

**Timeline:** 5 days (40 hours)
**Tasks:** 16 (E2E Testing), 17 (SEO & Deploy)

**Quick Checklist:**
- [ ] Playwright E2E tests implemented
- [ ] All critical paths tested (signup, wizard, purchase)
- [ ] Accessibility audit passed
- [ ] Cross-browser testing completed
- [ ] SEO meta tags added
- [ ] sitemap.xml generated
- [ ] Structured data (JSON-LD) implemented
- [ ] Production environment configured
- [ ] SSL certificate active
- [ ] Custom domain configured
- [ ] Monitoring setup (Sentry, Google Analytics)
- [ ] Error tracking working
- [ ] Uptime monitoring configured

**Phase 4 Exit Criteria:**
- ✅ All E2E tests passing
- ✅ SEO score >90
- ✅ Production deployed on custom domain
- ✅ Monitoring active
- ✅ Tasks 16, 17 marked as `done`

---

## Daily Workflow Checklist

### Every Morning (10 min)
- [ ] `git pull origin main`
- [ ] `npm run tm:next` - Check next task
- [ ] `npx task-master show <id>` - Review task details
- [ ] `npm run tm:in-progress <id>` - Mark task in progress
- [ ] Plan today's subtasks

### Every 2 Hours During Work
- [ ] Commit work: `git add . && git commit -m "..."`
- [ ] Log progress: `npm run tm:update <subtask-id> --prompt="..."`
- [ ] Run tests: `npm run lint && npx tsc --noEmit`

### Every Evening (15 min)
- [ ] Mark completed subtasks as done
- [ ] Push work: `git push origin <branch>`
- [ ] Review tomorrow's tasks
- [ ] Update team (if applicable)

---

## Quality Gates

### Before Marking Any Task Done

**Code Quality:**
- [ ] `npm run lint` passes (0 errors)
- [ ] `npx tsc --noEmit` passes (0 type errors)
- [ ] No console.logs in production code
- [ ] No commented-out code

**Functionality:**
- [ ] All acceptance criteria met
- [ ] Manual testing completed
- [ ] Error cases handled
- [ ] Loading states implemented

**Security:**
- [ ] Input validation with Zod
- [ ] RLS policies verified
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] API keys not exposed

**Performance:**
- [ ] Page loads in <800ms
- [ ] API responses in <200ms
- [ ] No memory leaks
- [ ] Images optimized

**Documentation:**
- [ ] Task progress logged
- [ ] Technical decisions documented
- [ ] README updated (if needed)

---

## Emergency Rollback Procedures

### If Something Breaks in Production

**Database Rollback:**
```bash
# View migration history
npx supabase migration list

# Rollback last migration
npx supabase migration down

# Verify rollback
npx supabase db remote list
```

**Code Rollback:**
```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or: Hard reset (DANGEROUS - use with caution)
git reset --hard <previous-commit-hash>
git push origin main --force
```

**Supabase Rollback:**
- Via Supabase dashboard: Database → Backups → Restore

---

## Success Metrics

### MVP Launch Criteria

**All must be true:**
- ✅ All Phase 1-4 tasks completed (13-14, 1-4, 15, 8, 10-12, 16-17)
- ✅ Can sign up, create event, sell tickets end-to-end
- ✅ Payment processing working (test and production modes)
- ✅ Email notifications delivering
- ✅ Lighthouse scores >90 (Performance, Accessibility, SEO)
- ✅ Zero critical security vulnerabilities
- ✅ Production deployed with monitoring
- ✅ All E2E tests passing
- ✅ Mobile responsive and WCAG compliant

**Timeline:** 26 days (5.2 weeks)

---

**Generated:** October 9, 2025
**Total Tasks:** 17 (13 MVP + 4 Post-MVP)
**Expanded Tasks:** 4 critical tasks with 33 total subtasks
**Ready for:** Production MVP implementation
