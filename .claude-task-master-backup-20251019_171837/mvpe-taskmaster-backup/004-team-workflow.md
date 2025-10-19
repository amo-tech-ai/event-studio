# EventOS Task Master Workflow

**Project:** EventOS - AI-Powered Corporate Event Management Platform
**Version:** 1.0
**Last Updated:** October 2025

---

## Daily Development Routine

### Morning Startup

```bash
# 1. Pull latest changes from main
git pull origin main

# 2. Check next available task
npm run tm:next

# Example output:
# Next task: 1 - Complete Event Wizard Stage 1 & 2 Implementation
# Status: pending
# Priority: high
# Dependencies: None

# 3. Mark task as in-progress
npm run tm:in-progress 1

# 4. View detailed task information
npx task-master show 1

# 5. Start working on the task
```

### During Implementation

```bash
# Log progress and implementation notes regularly
npx task-master update-subtask --id=1.1 --prompt="
Implemented EventBasicsForm.tsx component:
- Added Zod validation schema for event name, type, dates, capacity
- Integrated react-hook-form for state management
- Used shadcn/ui Form, Input, Select components
- Added image upload with preview using FileReader API
- Implemented auto-save to wizard_states table (triggers every 2s)
- Tested all validation rules (date range, capacity 10-10k, image size <5MB)

Technical decisions:
- Used Supabase upsert for wizard state auto-save
- Chose react-dropzone for file upload (drag-drop support)
- Used date-fns for date validation

Issues encountered:
- DatePicker component conflicted with Form - resolved by using react-day-picker directly
- Auto-save debounce needed to prevent excessive DB writes

Still needed:
- Add loading state during auto-save
- Test wizard state resume on browser refresh
- Add error boundary for form submission failures
"

# This creates timestamped notes that help with:
# - Future debugging
# - Team collaboration
# - Context preservation between sessions
```

### After Completion

```bash
# 1. Run linter and type check
npm run lint
npx tsc --noEmit

# 2. Test the implementation
npm run dev  # Manual testing in browser

# 3. Mark task as done
npm run tm:done 1

# 4. Commit work with task reference
git add .
git commit -m "feat(wizard): implement event basics form (task 1.1)

- Add EventBasicsForm component with Zod validation
- Implement auto-save to wizard_states table
- Add image upload with preview
- Add date range and capacity validation

Task: task-master show 1.1"

# 5. Push to remote
git push origin feat/wizard-stage-1

# 6. Get next task
npm run tm:next
```

---

## Feature Branch Workflow

### Starting a New Feature

```bash
# 1. Create feature branch from main
git checkout main
git pull origin main
git checkout -b feat/event-wizard-stage-3

# 2. Optional: Create tag for this feature
npx task-master add-tag \
  --name=feat-wizard-stage-3 \
  --description="Event Wizard Stage 3: Venue Selection"

# 3. Switch to feature tag (isolates tasks for this branch)
npx task-master use-tag feat-wizard-stage-3

# 4. View tasks in this context
npm run tm:list

# 5. Work on tasks in this branch
npm run tm:next
npm run tm:in-progress 3.1
# ... implement ...
npm run tm:done 3.1
```

### Completing a Feature

```bash
# 1. Ensure all feature tasks are done
npm run tm:list
# Verify: All tasks show status=done

# 2. Switch back to master tag
npx task-master use-tag master

# 3. Update main task status
npx task-master set-status --id=3 --status=done

# 4. Merge feature branch
git checkout main
git merge feat/event-wizard-stage-3

# 5. Push to remote
git push origin main

# 6. Optional: Delete feature branch
git branch -d feat/event-wizard-stage-3
```

---

## Handling Implementation Changes

### When Technical Approach Changes

```bash
# Scenario: You discover a better pattern during implementation
# Original plan: Custom form validation
# New decision: Use react-hook-form + Zod (better approach)

# Update all future tasks to reflect this change
npx task-master update \
  --from=2 \
  --prompt="IMPORTANT: Changed approach to use react-hook-form + Zod for ALL form validation instead of custom validation. Update all form implementation tasks to use this standardized pattern. Reference EventBasicsForm.tsx (task 1.1) for the standard implementation pattern. All forms should use:
- react-hook-form for state management
- Zod schemas for validation rules
- shadcn/ui Form components for UI
- Standardized error handling"

# This updates tasks 2, 3, 4, etc. to align with new approach
```

### When Requirements Change

```bash
# Scenario: Product requirements change mid-sprint
# Example: Event capacity increased from 10k to 50k max

# Update specific task
npx task-master update-task --id=1 --prompt="
UPDATE: Event capacity maximum increased from 10,000 to 50,000 per product team request.

Changes needed:
- Update Zod validation schema: capacity max 50000
- Update UI placeholder text: 'Enter capacity (10-50,000)'
- Update database constraint if exists
- Update test cases for capacity validation
"

# Verify update
npx task-master show 1
```

---

## Task Organization

### Breaking Down Complex Tasks

```bash
# Scenario: Task 4 (Stripe Payment) is too complex

# Expand task with custom focus
npx task-master expand \
  --id=4 \
  --num=8 \
  --prompt="Focus on security and error handling for payment processing. Include subtasks for:
- Stripe Connect setup and verification
- Checkout session creation with proper metadata
- Webhook signature verification (CRITICAL SECURITY)
- Payment confirmation flow
- Refund processing (partial and full)
- Edge cases: failed payments, duplicate webhooks, expired sessions
- Security testing: webhook replay attacks, CSRF
- Comprehensive error handling and logging"

# View expanded task
npx task-master show 4

# Expected subtasks:
# 4.1 Set up Stripe Connect configuration
# 4.2 Implement checkout session creation
# 4.3 Webhook signature verification system
# 4.4 Payment confirmation workflow
# 4.5 Refund processing system
# 4.6 Edge case handling (failures, duplicates)
# 4.7 Security testing implementation
# 4.8 Error handling and logging
```

### Moving Tasks

```bash
# Scenario: Subtask belongs in different task
# Move subtask 5.2 (SEO settings) to task 6 (Review & Publish)

npx task-master move --from=5.2 --to=6.4

# Scenario: Task needs to be converted to subtask
# Task 10 should be part of task 8 (Security)

npx task-master move --from=10 --to=8.5

# Regenerate task files after reorganization
npm run tm:gen
```

---

## Team Collaboration

### Multi-Developer Workflow

**Developer A: Wizard Implementation**
```bash
# Create branch and tag
git checkout -b feat/wizard-stage-3
npx task-master add-tag --from-branch
npx task-master use-tag feat-wizard-stage-3

# Work on venue selection
npm run tm:next
npm run tm:in-progress 3.1
# ... implement venue search filters ...
npm run tm:done 3.1

# Commit and push
git add .
git commit -m "feat(wizard): implement venue search filters (task 3.1)"
git push origin feat/wizard-stage-3
```

**Developer B: CRM Implementation** (parallel work)
```bash
# Create separate branch and tag
git checkout -b feat/crm-organizers
npx task-master add-tag --from-branch
npx task-master use-tag feat-crm-organizers

# Work on CRM independently
npm run tm:next
# ... implement CRM features ...
```

**Merging Both Features**
```bash
# Developer A merges first (no conflict)
git checkout main
git merge feat/wizard-stage-3
git push origin main

# Developer B merges second (potential conflict in tasks.json)
git checkout main
git pull origin main
git merge feat/crm-organizers

# IF CONFLICT in .taskmaster/tasks/tasks.json:
# Resolve by moving conflicting task IDs
npx task-master move --from=10 --to=20
npx task-master move --from=11 --to=21

# Commit resolved tasks
git add .taskmaster/tasks/tasks.json
git commit -m "chore(tasks): resolve task ID conflicts after merge"
git push origin main

# Regenerate task files
npm run tm:gen
```

---

## EventOS-Specific Workflows

### Wizard Stage Implementation

```bash
# Standard workflow for each wizard stage (stages 1-6)

# 1. Review stage requirements
npx task-master show <stage-task-id>

# 2. Create stage component file
# touch src/pages/wizard/EventStage<X>.tsx

# 3. Implement in order:
#    a. Zod validation schema (src/lib/validations/wizard.ts)
#    b. Form component with react-hook-form
#    c. shadcn/ui components integration
#    d. Auto-save to wizard_states table
#    e. Navigation (Previous/Next buttons)
#    f. Validation error display
#    g. Loading states

# 4. Test stage
#    - Form validation (all edge cases)
#    - Auto-save triggers correctly
#    - Navigation works (previous/next)
#    - Wizard state persists on refresh

# 5. Log implementation
npx task-master update-subtask --id=<subtask-id> --prompt="
Stage <X> implementation complete:
- Component: src/pages/wizard/EventStage<X>.tsx
- Validation: src/lib/validations/wizard.ts (eventStage<X>Schema)
- Database: Auto-saves to wizard_states.data.stage<X>
- Tests: All validation rules tested manually
- Issues: [list any issues encountered and solutions]
"

# 6. Mark complete
npm run tm:done <subtask-id>
```

### Supabase Integration

```bash
# When implementing features with Supabase

# 1. Check if database migration needed
# If YES:
npx supabase migration new add_<feature_name>_table

# 2. Edit migration file
# supabase/migrations/<timestamp>_add_<feature_name>_table.sql

# 3. Push migration
npx supabase db push

# 4. Regenerate TypeScript types
npx supabase gen types typescript --project-id jnmfterqvevgusfckxbt > src/integrations/supabase/types.ts

# 5. Import types in code
# import type { Database } from '@/integrations/supabase/types'
# type FeatureRow = Database['public']['Tables']['<table_name>']['Row']

# 6. Log database changes in task
npx task-master update-subtask --id=<id> --prompt="
Database changes:
- Migration: <timestamp>_add_<feature_name>_table.sql
- Tables added: <table_names>
- RLS policies: [describe policies]
- TypeScript types regenerated
"
```

### AI Feature Integration (Lovable AI)

```bash
# When implementing AI features (description generation, marketing copy, etc.)

# 1. Use Lovable AI Gateway + Gemini 2.5 Flash
# Reference: docs/chat/002-implementation-guide.md

# 2. Implement in edge function (NOT client-side)
# Create: supabase/functions/<feature-name>/index.ts

# 3. Add error handling for AI failures
#    - Network timeout
#    - Rate limiting
#    - Invalid responses
#    - Fallback to manual input

# 4. Test AI integration
#    - Mock AI responses in tests
#    - Test error scenarios
#    - Test response time (<2 seconds)

# 5. Log AI implementation
npx task-master update-subtask --id=<id> --prompt="
AI integration complete:
- Edge function: supabase/functions/<function-name>/index.ts
- Model: Gemini 2.5 Flash via Lovable AI Gateway
- Response time: <X>ms average
- Error handling: Network timeout, rate limits, invalid JSON
- Testing: Manual testing with various inputs
- Known limitations: [describe any limitations]
"
```

---

## Troubleshooting

### Task Master Issues

**Issue: Tasks not persisting**
```bash
# Check tasks.json exists
ls -la .taskmaster/tasks/tasks.json

# If missing, reinitialize (WARNING: this will reset tasks)
# npx task-master init

# Better: Restore from git
git checkout .taskmaster/tasks/tasks.json
```

**Issue: Complexity analysis fails**
```bash
# Try without research mode
npx task-master analyze-complexity

# Check API keys
cat .env | grep ANTHROPIC_API_KEY
cat .env | grep PERPLEXITY_API_KEY

# Verify model configuration
npx task-master models
```

**Issue: MCP integration not working**
```bash
# Check .mcp.json configuration
cat .mcp.json

# Restart Claude Code to reload MCP servers

# Alternative: Use CLI directly
npx task-master list
```

---

## Quick Reference

### Most Used Commands

```bash
# Daily workflow
npm run tm:next              # Get next task
npm run tm:in-progress 1     # Mark task 1 in progress
npm run tm:done 1            # Mark task 1 done
npm run tm:list              # List all tasks

# Task details
npx task-master show 1       # View task 1 details
npx task-master show 1.1     # View subtask 1.1

# Task management
npm run tm:expand 3          # Expand task 3 with research
npx task-master update-subtask --id=1.1 --prompt="notes"

# Task organization
npx task-master move --from=5.2 --to=6.4
npm run tm:gen               # Regenerate task markdown files

# Feature-specific
npm run tm:wizard            # List wizard tasks
npm run tm:crm               # List CRM tasks
npm run tm:dashboard         # List dashboard tasks
npm run tm:payments          # List payment tasks
```

---

## Best Practices

### ✅ Do

- **Update tasks frequently** - Log implementation notes every 30-60 minutes
- **Mark tasks done immediately** - Don't batch completions
- **Use descriptive commit messages** - Reference task IDs
- **Run type checks before marking done** - `npx tsc --noEmit`
- **Log technical decisions** - Explain why you chose approach X over Y
- **Document issues encountered** - Help future developers avoid same problems
- **Break down large tasks** - Use `expand` command for complex tasks
- **Use tags for feature branches** - Isolate work contexts

### ❌ Don't

- **Don't skip task updates** - They provide valuable context later
- **Don't mark tasks done prematurely** - Verify all requirements met
- **Don't ignore dependencies** - Check dependency chain before starting
- **Don't manually edit tasks.json** - Use Task Master commands
- **Don't commit .env or .mcp.json** - Contains API keys
- **Don't delete tasks without backup** - Use git to track history

---

## Project-Specific Conventions

### EventOS Task Naming

- **Wizard tasks:** "Complete Event Wizard Stage X: [Stage Name]"
- **CRM tasks:** "Build CRM [Feature]: [Description]"
- **Dashboard tasks:** "Create Dashboard [Feature]: [Description]"
- **Payment tasks:** "Implement [Payment Feature]: [Description]"

### EventOS Commit Message Format

```
<type>(scope): <subject> (task <id>)

<optional body>

<optional footer>
```

**Examples:**
```bash
feat(wizard): implement event basics form (task 1.1)
fix(crm): resolve pipeline drag-drop latency (task 6.2)
refactor(dashboard): optimize KPI queries (task 8.1)
docs(taskmaster): update team workflow guide
```

### EventOS Testing Standards

```bash
# Before marking task done:
1. npm run lint              # ✅ Linter passes
2. npx tsc --noEmit          # ✅ Type check passes
3. Manual testing in browser # ✅ Feature works
4. Verify RLS policies       # ✅ Security validated
5. Test error states         # ✅ Error handling works
```

---

**Document Version:** 1.0
**Last Updated:** October 2025
**Project:** EventOS - AI-Powered Corporate Event Management Platform
**Project Path:** `/home/sk/eventos-ai-canvas/`
