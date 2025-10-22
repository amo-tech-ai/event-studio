# CLAUDE.md - EventOS Project Configuration (Lite Edition)

**Version:** 2.1 (Updated)
**Project:** EventOS - AI-Powered Corporate Event Management Platform
**Status:** Production Development
**Last Updated:** October 2025

> **📖 Full Documentation:** See `/docs/` for detailed guides on workflows, troubleshooting, architecture, and security.

---

## 1. PROJECT OVERVIEW

**EventOS** is Canada's first AI-powered corporate event management platform, transforming event planning from a 3-week manual process into a seamless 3-minute AI-guided experience.

### Key Stakeholders
- **Corporate Event Planners** - Create and manage professional events
- **Venue Managers** - Manage spaces and bookings
- **Service Vendors** - Provide event services (catering, AV, etc.)
- **Sponsors** - Sponsor corporate events with ROI tracking
- **Attendees** - Register and attend corporate events

### Primary Goals
- Automate corporate event planning with AI assistance
- Enable event creation through natural language chat
- Streamline ticketing, payments, and attendee management
- Provide comprehensive CRM for event stakeholders
- Generate landing pages and task checklists automatically

---

## 2. TECH STACK

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 18.3.1, TypeScript 5.8.3, Vite 5.4.19 |
| **UI/Styling** | Tailwind CSS 3.4.17, shadcn/ui (Radix UI), lucide-react |
| **State Management** | @tanstack/react-query 5.83.0, react-hook-form 7.61.1 |
| **Validation** | Zod 4.1.11 |
| **Routing** | react-router-dom 6.30.1 |
| **Backend** | Supabase (Lovable Cloud), PostgreSQL 15+, Row-Level Security (RLS) |
| **AI** | Lovable AI Gateway, google/gemini-2.5-flash |
| **Payments** | Stripe Connect (future), Stripe Webhooks |
| **Dev Tools** | ESLint 9.32.0, PostCSS, Autoprefixer, Node.js 22.20.0, npm 10.9.3 |
| **Task Management** | task-master-ai 0.28.0 |

---

## 3. PROJECT STRUCTURE

```
/home/sk/eventos-ai-canvas/
├── src/                          # Application source code
│   ├── pages/                    # Page components (auth, wizard, crm, dashboard, chat)
│   ├── components/               # Reusable components (organized by feature)
│   ├── hooks/                    # Custom React hooks (use-auth, use-event-data, use-wizard, use-chat)
│   ├── lib/                      # Utilities and validations
│   └── integrations/             # Supabase client & auto-generated types
│
├── supabase/                     # Supabase backend
│   ├── functions/                # Edge Functions (Deno)
│   │   ├── chat-with-ai/         # AI chat integration
│   │   ├── create-checkout/      # Stripe checkout
│   │   ├── seed-sample-data/     # Data seeding
│   │   └── stripe-webhook/       # Payment webhooks
│   └── migrations/               # Database migrations (SQL)
│
├── docs/                         # Project documentation
│   ├── 1-stage/                  # Stage documentation
│   ├── chat/                     # Chat feature documentation
│   ├── crm/                      # CRM feature documentation
│   ├── dashboard/                # Dashboard feature documentation
│   ├── database/                 # Database documentation
│   ├── planning/                 # Planning documentation
│   ├── setup/                    # Setup and installation guides
│   ├── taskmaster/               # Task Master documentation
│   ├── wizard/                   # Wizard feature documentation
│   └── [core-docs]               # Core documentation files
│
├── .taskmaster/                  # Task Master AI project management
│   ├── tasks/                    # Task definitions (DO NOT create files here directly)
│   │   ├── chat-events/          # Chat feature tasks (01-06 numbered)
│   │   ├── crm/                  # CRM feature tasks (numbered)
│   │   └── tasks.json            # Master task file (managed by Task Master)
│   ├── docs/                     # Task Master documentation
│   │   ├── reports/              # Status reports, audit logs, summaries
│   │   ├── summaries/            # Progress trackers, priority lists
│   │   └── archived/             # Completed/obsolete documentation
│   ├── config.json               # Task Master configuration
│   └── CLAUDE.md                 # Task Master integration guide
│
├── .env                          # Environment variables (NEVER COMMIT)
├── public/                       # Static assets
├── CLAUDE.md                     # This file - AI assistant configuration
├── README.md                     # Project overview
├── SUPABASE-QUICK-START.md       # Supabase workflow guide
└── [root-level-docs]             # Keep minimal (CLAUDE.md, README.md, SITEMAP.md, STYLE-GUIDE.md only)
```

### File Organization Rules 🚨

#### ❌ NEVER Create Files in Project Root

**Prohibited in root directory:**
- ❌ No `TASKMASTER-*.md` files
- ❌ No `PRODUCTION-*.md` files
- ❌ No `PRIORITY-*.md` files
- ❌ No `CHAT-*.md` files
- ❌ No `FOCUS-*.md` files
- ❌ No `IMPLEMENTATION-*.md` files
- ❌ No `AUDIT-*.md` files
- ❌ No status reports or summaries

**Allowed in root directory:**
- ✅ `CLAUDE.md` (this file)
- ✅ `README.md` (project overview)
- ✅ `SITEMAP.md` (site structure)
- ✅ `STYLE-GUIDE.md` (coding standards)
- ✅ `SUPABASE-QUICK-START.md` (Supabase workflow)
- ✅ `supabase.md` (Supabase reference)
- ✅ `START-HERE.md` (Quick start guide)
- ✅ `AGENTS.md` / `GEMINI.md` (AI agent configurations)
- ✅ Configuration files (`package.json`, `tsconfig.json`, `.mcp.json`, etc.)

#### ✅ Correct File Locations

| File Type | Correct Location | Example |
|-----------|-----------------|---------|
| **TaskMaster Reports** | `.taskmaster/docs/reports/` | `TASKMASTER-SETUP-AUDIT-REPORT.md` |
| **Progress Trackers** | `.taskmaster/docs/summaries/` | `PRODUCTION-PROGRESS-TRACKER.md` |
| **Priority Lists** | `.taskmaster/docs/summaries/` | `PRIORITY-TASK-ORDER.md` |
| **Feature Reviews** | `.taskmaster/tasks/[feature]/` | `.taskmaster/tasks/chat-events/CHAT-FEATURE-REVIEW.md` |
| **Deployment Guides** | `.taskmaster/tasks/[feature]/` | `.taskmaster/tasks/chat-events/DEPLOYMENT-GUIDE.md` |
| **Setup Guides** | `docs/setup/` | `docs/setup/40-supabase-cli.md` |
| **Archived Docs** | `.taskmaster/docs/archived/` | Obsolete status reports |

#### 📋 File Naming Rules

**TaskMaster Task Files:**
- ✅ `01-task-name.txt` (numbered 01-99)
- ✅ `02-another-task.txt` (sequential numbering)
- ❌ `task-1.txt` (missing zero padding)
- ❌ `23-ai-chat-edge-function.txt` (keep numbers sequential within folder)

**Documentation Files:**
- ✅ `DEPLOYMENT-GUIDE.md` (UPPERCASE with hyphens)
- ✅ `IMPLEMENTATION-STATUS.md` (descriptive and specific)
- ❌ `guide.md` (too generic)
- ❌ `temp-notes.md` (temporary files should be in `.taskmaster/docs/archived/`)

**Feature-Specific Docs:**
- ✅ `.taskmaster/tasks/chat-events/CHAT-FEATURE-REVIEW.md` (in feature folder)
- ❌ `CHAT-FEATURE-REVIEW.md` (root directory)

### File Boundaries
| Status | Files |
|--------|-------|
| ✅ **Safe to Edit** | `src/**/*`, `docs/**/*`, `.taskmaster/docs/**/*`, `README.md`, `CLAUDE.md` |
| ⚠️ **Read-Only** | `package.json`, `tsconfig.json`, `vite.config.ts`, `supabase/migrations/*.sql` |
| ❌ **NEVER TOUCH** | `node_modules/`, `.git/`, `dist/`, `.env`, `src/integrations/supabase/types.ts`, `.taskmaster/tasks/tasks.json` |
| ❌ **NEVER CREATE** | Task files in `.taskmaster/tasks/` (use `task-master add-task` instead) |

---

## 4. ENVIRONMENT VARIABLES

### Required .env Keys
```bash
# Supabase (Required - Already Configured)
VITE_SUPABASE_URL=https://jnmfterqvevgusfckxbt.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=[configured]
VITE_SUPABASE_PROJECT_ID=jnmfterqvevgusfckxbt

# AI APIs (Configured for Task Master & Development)
ANTHROPIC_API_KEY=[configured]
PERPLEXITY_API_KEY=[configured]
OPENAI_API_KEY=[configured]
GOOGLE_API_KEY=[configured]
OLLAMA_API_KEY=[configured]

# GitHub (Configured)
GITHUB_TOKEN=[configured]

# Lovable AI (Auto-provisioned by Lovable)
LOVABLE_API_KEY=[auto-provisioned]

# Stripe (Future Implementation)
VITE_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Email (Future Implementation)
RESEND_API_KEY=
```

**Note:** All required API keys for development are already configured in `.env`. Never commit this file.

### Safety Rules
✅ **ALWAYS:** Keep .env in .gitignore, use VITE_ prefix for client-side vars, store secrets in Lovable Cloud
❌ **NEVER:** Commit .env, share keys, expose server-side keys to client code

---

## 5. ESSENTIAL COMMANDS

| Task | Command |
|------|---------|
| **Install dependencies** | `npm install` |
| **Start dev server** | `npm run dev` (http://localhost:8080) |
| **Production build** | `npm run build` |
| **Lint code** | `npm run lint` |
| **Type check** | `npx tsc --noEmit` |
| **Generate Supabase types** | `npx supabase gen types typescript --project-id jnmfterqvevgusfckxbt > src/integrations/supabase/types.ts` |
| **Create migration** | `npx supabase migration new migration_name` |
| **Push migrations** | `npx supabase db push` |
| **Add shadcn component** | `npx shadcn@latest add [component-name]` |
| **Deploy to Lovable** | `git push origin main` (auto-deploys) |

### Task Master Shortcuts (npm scripts)
| Task | Command |
|------|---------|
| **List all tasks** | `npm run tm:list` |
| **Get next task** | `npm run tm:next` |
| **Show task** | `npm run tm:show <id>` |
| **Mark in-progress** | `npm run tm:in-progress <id>` |
| **Mark done** | `npm run tm:done <id>` |
| **Mark review** | `npm run tm:review <id>` |
| **Expand task** | `npm run tm:expand <id>` |
| **Complexity analysis** | `npm run tm:complexity` |
| **View complexity report** | `npm run tm:complexity-report` |
| **List tags** | `npm run tm:tags` |
| **Switch to mvp-foundation** | `npm run tm:mvp-foundation` |
| **Switch to mvp-features** | `npm run tm:mvp-features` |
| **Switch to mvp-production** | `npm run tm:mvp-production` |

📖 **Full command reference:** See `/docs/development/commands.md` (if exists)

---

## 6. CODING STANDARDS

### TypeScript

**Current Configuration:**
- TypeScript 5.8.3 with moderate strictness settings
- `noImplicitAny`: false (allows implicit any)
- `strictNullChecks`: false (allows null/undefined without explicit checks)
- `skipLibCheck`: true (faster compilation)
- `@/` path alias configured for `./src`

```typescript
// ✅ GOOD: Explicit types (preferred)
function createEvent(name: string, date: Date): Promise<Event> { /* ... */ }

// ✅ GOOD: Import Supabase types
import { Database } from '@/integrations/supabase/types';
type Event = Database['public']['Tables']['events']['Row'];

// ⚠️ ACCEPTABLE: Implicit any (allowed by config, but avoid when possible)
function createEvent(name, date) { /* ... */ }

// ✅ BEST: Use Supabase auto-generated types for all database operations
```

### React Patterns
```typescript
// ✅ GOOD: Functional components + TypeScript + React Query
const EventCard: React.FC<{ event: Event }> = ({ event }) => {
  return <Card>{event.name}</Card>;
};

const useEvents = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase.from('events').select('*');
      if (error) throw error;
      return data;
    },
  });
};
```

### Naming Conventions
| Type | Convention | Example |
|------|-----------|---------|
| **Components** | PascalCase | `EventCard`, `WizardNavigation` |
| **Functions/Variables** | camelCase | `fetchEvents`, `eventData` |
| **Constants** | UPPER_SNAKE_CASE | `MAX_EVENT_CAPACITY` |
| **Files** | kebab-case (utils), PascalCase (components) | `event-utils.ts`, `EventCard.tsx` |

### Import Order
```typescript
// 1. React imports
import { useState, useEffect } from 'react';

// 2. External libraries
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

// 3. Internal imports (use @/ alias)
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

// 4. Relative imports
import { useEventData } from './use-event-data';
```

📖 **Full coding standards:** See `/docs/development/patterns.md`

---

## 7. DATABASE & SECURITY

### Core Tables (19+ total)
```sql
-- User Management
profiles, user_roles

-- Event Management
events, venues, tickets, orders, attendees, sponsorships, vendors

-- CRM System
crm_organizers, crm_contacts, crm_opportunities, crm_pipeline_stages,
crm_activities, crm_notes, crm_documents, crm_email_templates

-- System Tables
wizard_states, notifications
```

### Row-Level Security (RLS)
```sql
-- ✅ GOOD: Use auth.uid() for user isolation
CREATE POLICY "Users view own events"
ON events FOR SELECT
USING (organizer_id = auth.uid());

-- ✅ GOOD: Use security definer functions
CREATE POLICY "Admins manage all"
ON events FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- ❌ BAD: Never reference auth.users table directly
```

### Migration Workflow
```bash
# 1. Create migration
npx supabase migration new add_feature_name

# 2. Edit supabase/migrations/[timestamp]_add_feature_name.sql

# 3. Push to remote
npx supabase db push

# 4. Regenerate types
npx supabase gen types typescript --project-id jnmfterqvevgusfckxbt > src/integrations/supabase/types.ts
```

### Security Checklist
✅ **ALWAYS:**
- RLS on ALL tables
- Validate ALL inputs with Zod (client AND server)
- Use `auth.uid()` for current user ID
- Store secrets in environment variables
- Use security definer functions for privilege escalation

❌ **NEVER:**
- Disable RLS (even temporarily)
- Trust client-side validation alone
- Expose API keys in client code
- Reference `auth.users` table directly in queries
- Store sensitive data in localStorage

📖 **Full security guide:** See `/docs/security/guidelines.md`

---

## 8. GIT WORKFLOW

### Branch Naming
```bash
feat/add-ai-chat-interface    # New features
fix/wizard-validation-error    # Bug fixes
hotfix/payment-webhook         # Production hotfixes
refactor/simplify-wizard       # Code refactoring
docs/update-claude-md          # Documentation
```

### Commit Format
```
type(scope): description

Examples:
feat(wizard): add event marketing stage
fix(auth): resolve login redirect loop
docs(readme): update installation instructions
```

### Pre-Commit Checklist
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run lint` passes
- [ ] No console.logs in production code
- [ ] No .env or secrets committed
- [ ] Documentation updated

📖 **Full git workflow:** See `/docs/development/workflows.md`

---

## 9. DEPLOYMENT

### Staging (Lovable Cloud)
```bash
git push origin main  # Auto-deploys to Lovable
```

### Production (via Lovable UI)
1. Open https://lovable.dev/projects/0ad3b1d7-3045-48e8-bba7-ab97c481ca61
2. Click "Share" → "Publish"
3. Configure production settings
4. Monitor deployment status

### Rollback
Via Lovable dashboard: Deployments → Select previous version → Rollback

### Pre-Deployment Checklist
- [ ] All tests passing
- [ ] TypeScript compilation successful
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Test in staging first
- [ ] Backup database before major changes

📖 **Full deployment guide:** See `/docs/deployment/guide.md`

---

## 10. TROUBLESHOOTING (Quick Reference)

| Issue | Quick Fix |
|-------|-----------|
| **Build fails with TS errors** | Regenerate types: `npx supabase gen types typescript ...` |
| **Supabase query returns empty** | Check RLS policies in Supabase dashboard |
| **Module not found error** | Verify `@/` alias in `tsconfig.json` and `vite.config.ts` |
| **Infinite re-renders** | Check `useEffect` dependency arrays |
| **CORS errors** | Configure CORS headers in Edge Functions |

📖 **Full troubleshooting:** See `/docs/development/troubleshooting.md`

---

## 11. AI ASSISTANT GUIDELINES

### Primary Objectives
1. Complete event wizard implementation (6-stage flow)
2. Build CRM functionality (organizers, contacts, pipeline)
3. Implement dashboard features (KPIs, analytics, charts)
4. Integrate AI chat interface (Lovable AI + Gemini)
5. Add Stripe payment processing
6. Deploy to production

### Development Priorities
🔴 **CRITICAL:** RLS on all tables, validate inputs with Zod, use TypeScript strictly (no `any`), test user flows
🟡 **IMPORTANT:** Optimize queries, error handling, loading states, React Query for data
🟢 **NICE-TO-HAVE:** Unit tests, bundle optimization, accessibility, dark mode

### Prohibited Actions ❌
1. Never disable RLS
2. Never commit secrets (.env, API keys)
3. Never use `any` type
4. Never skip validation
5. Never modify auto-generated files (`src/integrations/supabase/types.ts`)
6. Never bypass authentication
7. Never ignore errors
8. Never use inline styles (use Tailwind)
9. Never create duplicate components (reuse shadcn/ui)
10. Never delete data without confirmation

### Code Review Checklist
- [ ] TypeScript types explicit (no `any`)
- [ ] Inputs validated with Zod
- [ ] Error handling present
- [ ] Loading states shown
- [ ] Uses existing shadcn/ui components
- [ ] Imports use `@/` alias
- [ ] RLS respected
- [ ] Follows existing patterns

📖 **Full AI coding guide:** See `/docs/ai-assistant/guidelines.md`

---

## 12. REAL-WORLD USER JOURNEYS

### Journey 1: Small Business Owner Hosts Networking Event
**Persona:** Marcus, 42-year-old local business owner and chamber of commerce member
**Goal:** Create monthly networking mixer for 40 local entrepreneurs in 2 minutes
**Flow:**
1. Login → Dashboard → "Create Event"
2. AI Chat: "Create networking mixer for 40 people next Thursday at The Coffee Lounge"
3. AI generates: Event basics, 2 ticket tiers (Early Bird $25, Regular $35)
4. Select suggested venue "The Coffee Lounge" (capacity: 50)
5. Review & Publish → Landing page + social media posts generated
**Result:** Event live in 90 seconds, 18 tickets sold in first 24 hours ($630 revenue)

### Journey 2: HR Manager Organizes Internal Workshop
**Persona:** Jennifer, 36-year-old HR coordinator at mid-sized company
**Goal:** Set up employee training workshop for 25 staff members
**Flow:**
1. Login → Dashboard → "Create Event"
2. Use wizard manually: "Leadership Skills Workshop - Internal"
3. Set capacity: 25, ticket price: Free (internal event)
4. Select company meeting room, add agenda
5. Send RSVP invitations via email integration
**Result:** 25/25 RSVPs confirmed in 2 days, attendee list exported to Excel, reminder emails scheduled

### Journey 3: Startup Founder Launches New Product
**Persona:** Alex, 29-year-old tech startup founder
**Goal:** Host product launch event for 60 people (customers + press)
**Flow:**
1. Login → Dashboard → "Create Event"
2. AI Chat: "Create product launch event for 60 people, mix of free press passes and $50 VIP tickets"
3. AI generates: Event page with product demo video, 2 tiers (Press Pass: Free, VIP Access: $50)
4. Add sponsors, customize branding to match company colors
5. Track registrations: 35 press passes, 20 VIP tickets sold ($1,000 revenue)
**Result:** Event fully booked in 1 week, attendee demographics show 60% existing customers, 40% new leads

📖 **Full user journeys:** See `/docs/PRD-EVENTOS.md` for comprehensive feature specifications

---

## 13. QUICK REFERENCE

### Project URLs
- **Lovable Project:** https://lovable.dev/projects/0ad3b1d7-3045-48e8-bba7-ab97c481ca61
- **GitHub Repository:** https://github.com/amo-tech-ai/eventos-ai-canvas
- **Supabase Project ID:** jnmfterqvevgusfckxbt
- **Supabase Dashboard:** https://supabase.com/dashboard/project/jnmfterqvevgusfckxbt
- **Dev Server:** http://localhost:8080

### Key Files
- **Project root:** `/home/sk/eventos-ai-canvas/`
- **Database types:** `src/integrations/supabase/types.ts` (auto-generated, 1413 lines)
- **Supabase config:** `supabase/config.toml`
- **PRD:** `docs/PRD-EVENTOS.md`
- **Task Master config:** `.taskmaster/config.json`
- **Task Master guide:** `.taskmaster/CLAUDE.md`
- **MCP config:** `.mcp.json` (Task Master AI + Chrome DevTools)

### Common Patterns
```typescript
// React Query pattern
const { data, isLoading, error } = useQuery({
  queryKey: ['key'],
  queryFn: async () => { /* ... */ }
});

// Form validation pattern
const form = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: { /* ... */ }
});

// Protected route pattern
const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/auth/login" />;
  return <>{children}</>;
};
```

---

## 13. DOCUMENTATION INDEX

### Core Documentation
- **Quick Start:** `/START-HERE.md`
- **Project Overview:** `/README.md`
- **Style Guide:** `/STYLE-GUIDE.md`
- **Site Map:** `/SITEMAP.md`
- **Supabase Quick Start:** `/SUPABASE-QUICK-START.md`
- **Supabase Reference:** `/supabase.md`

### Setup & Configuration
- **Chrome DevTools MCP:** `/docs/setup/50-chrome-devtools-mcp.md` (Browser automation & testing)

### Features & Implementation
- **PRD:** `/docs/PRD-EVENTOS.md`
- **Implementation Status:** `/docs/IMPLEMENTATION-STATUS.md`
- **Production Tracker:** `/docs/PRODUCTION-TRACKER.md`
- **Production Audit:** `/docs/PRODUCTION-AUDIT.md`
- **Production Launch Checklist:** `/docs/PRODUCTION-LAUNCH-CHECKLIST.md`
- **Security Review:** `/docs/SECURITY-REVIEW.md`

### Feature-Specific Documentation
- **AI Chat:** `/docs/chat/`
- **CRM:** `/docs/crm/`
- **Dashboard:** `/docs/dashboard/`
- **Wizard:** `/docs/wizard/`
- **Database:** `/docs/database/`

### Data & Testing
- **Data Seeding Guide:** `/docs/DATA-SEEDING-GUIDE.md`
- **Sample Data Format:** `/docs/SAMPLE-DATA-FORMAT-GUIDE.md`
- **Test Account Guide:** `/docs/TEST-ACCOUNT-GUIDE.md`

### Task Master Documentation
- **Task Master Guide:** `.taskmaster/CLAUDE.md`
- **Task List:** `.taskmaster/TASK-LIST-COMPLETE.md`
- **Reports:** `.taskmaster/docs/reports/`
- **Summaries:** `.taskmaster/docs/summaries/`
- **Organization Summary:** `.taskmaster/docs/ORGANIZATION-SUMMARY.md`

---

## 14. EXTERNAL RESOURCES

### Official Documentation
- **Lovable Platform:** https://docs.lovable.dev
- **Supabase:** https://supabase.com/docs
- **React:** https://react.dev
- **TypeScript:** https://typescriptlang.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **shadcn/ui:** https://ui.shadcn.com
- **React Query:** https://tanstack.com/query/latest
- **Zod:** https://zod.dev

### Support
- **Lovable Support:** https://docs.lovable.dev/support
- **Supabase Support:** https://supabase.com/support
- **Project Lead:** @sk (GitHub)

---

## 15. BEST PRACTICES SUMMARY

| Category | Best Practices |
|----------|---------------|
| **Security** | ✅ RLS on ALL tables, validate with Zod, use security definer functions, never commit secrets |
| **Code Quality** | ✅ TypeScript strict mode, explicit types, functional components, React Query, error handling |
| **Performance** | ✅ Code splitting, lazy loading, database indexes, query optimization, image optimization |
| **UX** | ✅ Loading states, error messages, mobile responsive, accessibility (ARIA), <800ms page loads |

---

## 16. CURRENT PROJECT STATE

### Recent Accomplishments
- ✅ AI Chat feature implemented with Edge Function (chat-with-ai)
- ✅ Task Master AI integration complete (v0.28.0)
- ✅ Comprehensive documentation organized in `/docs/`
- ✅ File organization rules established and enforced
- ✅ Multiple AI agent configurations (Claude, Gemini)
- ✅ Environment variables properly configured
- ✅ Database migrations in place (8 migrations applied)
- ✅ Supabase Edge Functions deployed
- ✅ npm scripts for Task Master shortcuts

### Active Development Areas
- 🚧 Event wizard completion (6-stage flow)
- 🚧 CRM functionality (organizers, contacts, opportunities)
- 🚧 Dashboard analytics and KPIs
- 🚧 Stripe payment integration
- 🚧 Production deployment preparation

### Git Repository
- **Remote:** https://github.com/amo-tech-ai/eventos-ai-canvas
- **Branch:** main (auto-deploys to Lovable)
- **Recent Commits:** Chat feature implementation, Task Master setup, documentation

## 17. CHANGELOG

### Version 2.1 - October 2025
- **Updated project status** with current accomplishments
- **Added Task Master npm scripts** for quick access
- **Documented Edge Functions** (4 functions deployed)
- **Updated documentation index** with actual file locations
- **Added GitHub repository** information
- **Clarified TypeScript configuration** settings
- **Updated environment variables** section with configured APIs

### Version 2.0 - January 2025
- **Streamlined to ~500 lines** (75% reduction from v1.0)
- **Modularized documentation** into `/docs/` subdirectories
- **Enhanced quick reference** with consolidated tables
- **Improved navigation** with cross-references

### Version 1.0 - October 2025
- Initial CLAUDE.md creation (2,103 lines)
- Comprehensive project documentation

---

## 18. TASK MASTER AI INTEGRATION

**Import Task Master's development workflow commands and guidelines.**

📖 **Full Task Master guide:** See `.taskmaster/CLAUDE.md`

### Quick Task Master Commands
```bash
task-master init                    # Initialize project
task-master parse-prd               # Generate tasks from PRD
task-master list                    # Show all tasks
task-master next                    # Get next task
task-master show <id>               # View task details
task-master set-status --id=<id> --status=done  # Mark complete
```

---

**END OF CLAUDE.md (Lite Edition)**

This is the streamlined reference guide for EventOS development with Claude Code.
For detailed documentation, see `/docs/` subdirectories.

**Last Updated:** October 11, 2025

### Version History
- **v2.1** (Oct 11, 2025): Updated with current project state, npm scripts, Edge Functions
- **v2.0** (Jan 2025): Streamlined edition
- **v1.0** (Oct 2025): Initial comprehensive documentation

## Task Master AI Instructions
**Import Task Master's development workflow commands and guidelines, treat as if import is in the main CLAUDE.md file.**
@./.taskmaster/CLAUDE.md
