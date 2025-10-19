# EventOS Task Master Advanced Workflows

**Version:** 1.0
**Date:** October 2025
**Task Master Version:** 0.28.0
**Project:** EventOS - AI-Powered Corporate Event Management Platform

---

## Table of Contents

1. [Configuration Overview](#configuration-overview)
2. [Tagged Task Lists](#tagged-task-lists)
3. [Advanced npm Scripts](#advanced-npm-scripts)
4. [Task Expansion Workflows](#task-expansion-workflows)
5. [Dependency Management](#dependency-management)
6. [Task Reorganization](#task-reorganization)
7. [Team Collaboration](#team-collaboration)
8. [Research-Backed Operations](#research-backed-operations)
9. [Troubleshooting](#troubleshooting)

---

## Configuration Overview

### Current Configuration

**Location:** `.taskmaster/config.json`

```json
{
  "models": {
    "main": {
      "provider": "anthropic",
      "modelId": "claude-sonnet-4-20250514",
      "maxTokens": 64000,
      "temperature": 0.2
    },
    "research": {
      "provider": "perplexity",
      "modelId": "sonar-pro",
      "maxTokens": 8700,
      "temperature": 0.1
    },
    "fallback": {
      "provider": "claude-code",
      "modelId": "sonnet",
      "maxTokens": 64000,
      "temperature": 0.2
    }
  },
  "global": {
    "projectName": "EventOS",
    "defaultSubtasks": 6,
    "defaultPriority": "high",
    "defaultTag": "master",
    "enableCodebaseAnalysis": true
  }
}
```

### Model Roles

1. **Main Model** - Claude Sonnet 4
   - Used for: Task generation, expansion, updates
   - Why: Best reasoning and code understanding

2. **Research Model** - Perplexity Sonar Pro
   - Used for: Research-backed task creation, technical best practices
   - Why: Real-time web search for latest information

3. **Fallback Model** - Claude Code Sonnet
   - Used for: When main/research models fail or are unavailable
   - Why: Always available in Claude Code environment

---

## Tagged Task Lists

### Available Tags

EventOS uses **5 task tags** for organizing work by MVP phase:

#### 1. `master` (Default)
- **Purpose:** All 17 tasks in correct implementation order
- **Use Case:** Overall project view, dependency tracking
- **Tasks:** All tasks (1-17)

#### 2. `mvp-foundation`
- **Purpose:** Critical foundation tasks that block all features
- **Use Case:** Week 1 sprint planning
- **Tasks:**
  - Task 13: Database Schema Setup
  - Task 14: Authentication System

#### 3. `mvp-features`
- **Purpose:** Core event management features
- **Use Case:** Weeks 2-3 sprint planning
- **Tasks:**
  - Task 1: Event Wizard Stage 1-2
  - Task 2: Event Wizard Stage 3-4
  - Task 3: Event Wizard Stage 5-6
  - Task 4: Stripe Payment Integration
  - Task 15: Email Notifications

#### 4. `mvp-production`
- **Purpose:** Production-ready polish and deployment
- **Use Case:** Weeks 4-5 sprint planning
- **Tasks:**
  - Task 8: Dashboard & Analytics
  - Task 10: Security Hardening
  - Task 11: Performance Optimization
  - Task 12: Mobile & Accessibility
  - Task 16: E2E Testing
  - Task 17: SEO & Deployment

#### 5. `post-mvp`
- **Purpose:** Features to implement after MVP launch
- **Use Case:** Post-launch roadmap
- **Tasks:**
  - Task 5: CRM Organizers
  - Task 6: CRM Pipeline
  - Task 7: CRM Documents
  - Task 9: AI Chat Interface

### Tag Management Commands

```bash
# List all available tags
npm run tm:tags

# Switch to a specific tag context
npm run tm:use-tag mvp-foundation

# Quick switch shortcuts (auto-switches and lists tasks)
npm run tm:mvp-foundation    # Week 1 tasks
npm run tm:mvp-features      # Week 2-3 tasks
npm run tm:mvp-production    # Week 4-5 tasks
npm run tm:post-mvp          # Future tasks
npm run tm:master            # All tasks

# Create new tag
npm run tm:add-tag "sprint-1" --description="Sprint 1: Jan 1-14"

# Create tag from current git branch
npx task-master add-tag --from-branch
```

### Tag Workflow Example

```bash
# Week 1: Focus on foundation
npm run tm:mvp-foundation
# Output: Shows only tasks 13-14 (Database, Auth)

# Mark task 13 in progress
npm run tm:in-progress 13

# ... implement database schema ...

# Mark complete
npm run tm:done 13

# Switch to next phase
npm run tm:mvp-features
# Output: Shows tasks 1-4, 15 (Event Wizard, Payments, Email)
```

---

## Advanced npm Scripts

### Status Management

```bash
# Mark task as in-progress
npm run tm:in-progress 13

# Mark task as done
npm run tm:done 13

# Mark task for review
npm run tm:review 3

# Mark task as blocked
npm run tm:blocked 7
```

### Task Expansion

```bash
# Expand single task with research
npm run tm:expand 13

# Expand all pending tasks with research
npm run tm:expand-all

# Manual expansion with custom prompt
npx task-master expand --id=13 --num=8 --prompt="Focus on security and RLS policies"
```

### Task Updates

```bash
# Update subtask with implementation notes
npm run tm:update 13.1 --prompt="Created profiles table with RLS policies..."

# Update task details
npm run tm:update-task 13 --prompt="Changed to use UUID primary keys instead of integers"

# Update multiple tasks from ID onwards
npm run tm:update-from 5 --prompt="Changed database to PostgreSQL from MySQL"
```

### Dependency Management

```bash
# Add dependency (task 1 depends on task 13)
npm run tm:add-dep 1 --depends-on=13

# Remove dependency
npm run tm:remove-dep 1 --depends-on=13

# Validate all dependencies
npm run tm:validate-deps

# Auto-fix dependency issues
npm run tm:fix-deps
```

### Task Reorganization

```bash
# Move task to new position
npm run tm:move 5 --to=10

# Move subtask to different parent
npx task-master move --from=5.2 --to=7.3

# Move subtask to become standalone task
npx task-master move --from=5.2 --to=10
```

### Complexity Analysis

```bash
# Analyze all tasks with research
npm run tm:complexity

# View complexity report
npm run tm:complexity-report

# Analyze specific range
npx task-master analyze-complexity --from=1 --to=5 --research
```

### Task Generation

```bash
# Regenerate all task markdown files
npm run tm:gen

# Generate files for specific tag
npx task-master generate --tag=mvp-foundation
```

---

## Task Expansion Workflows

### When to Expand Tasks

Expand a task when:
- Complexity score ≥ 7 (from complexity analysis)
- Task description has >10 implementation steps
- Multiple developers will work on the task
- Task requires coordination across multiple files/systems

### Expansion Methods

#### Method 1: Automatic Expansion (Recommended)

```bash
# Run complexity analysis
npm run tm:complexity

# View recommendations
npm run tm:complexity-report

# Expand all tasks with score ≥ 7
npm run tm:expand-all
```

#### Method 2: Manual Expansion with Research

```bash
# Expand with default subtask count (6)
npm run tm:expand 13

# Expand with specific number of subtasks
npx task-master expand --id=13 --num=8 --research

# Expand with custom focus
npx task-master expand --id=4 --prompt="Focus on security testing and webhook verification" --research
```

#### Method 3: Expand After Implementation Starts

```bash
# Start task
npm run tm:in-progress 13

# Discover it's more complex than expected
npx task-master expand --id=13 --force --research

# --force allows expansion of in-progress tasks
```

### Expansion Example: Task 13 (Database)

**Before Expansion:**
```
Task 13: Database Schema Setup
- Status: pending
- Subtasks: 0
```

**Command:**
```bash
npm run tm:expand 13
```

**After Expansion:**
```
Task 13: Database Schema Setup
- Status: pending
- Subtasks: 8
  13.1: Create profiles and user_roles tables
  13.2: Create events and venues tables
  13.3: Create tickets and orders tables
  13.4: Create attendees table with QR codes
  13.5: Implement RLS policies on all tables
  13.6: Create security definer functions
  13.7: Add database constraints and indexes
  13.8: Generate TypeScript types from schema
```

---

## Dependency Management

### Understanding Dependencies

Dependencies define the order tasks must be completed:
- **Dependency:** Task A depends on Task B = B must be done before A
- **Blocked:** Task is blocked if any dependency is not `done`
- **Ready:** Task is ready if all dependencies are `done`

### Current Dependency Chain

```
13 (Database) → 14 (Auth) → 1 (Wizard 1-2) → 2 (Wizard 3-4) → 3 (Wizard 5-6)
                    ↓                                               ↓
                    ├─ 5 (CRM Org)                                  └─ 4 (Payments) → 15 (Email)
                    ├─ 8 (Dashboard) ───────────────────────────────┘           ↓
                    └─ 9 (AI Chat) + 2                                          └─ 16 (Testing) → 17 (Deploy)
                                                                                       ↑
10 (Security) ← 13 (Database)                                                          │
     ↓                                                                                 │
11 (Performance) → 12 (Accessibility) ──────────────────────────────────────────────┘
```

### Adding Dependencies

```bash
# Task 1 must wait for Database and Auth
npm run tm:add-dep 1 --depends-on=13
npm run tm:add-dep 1 --depends-on=14

# Dashboard needs Auth
npm run tm:add-dep 8 --depends-on=14

# Testing needs all MVP features complete
npx task-master add-dependency --id=16 --depends-on=1,2,3,4,8,10,11,12
```

### Validating Dependencies

```bash
# Check for circular dependencies
npm run tm:validate-deps

# Example circular dependency error:
# ❌ Task 5 depends on Task 7
# ❌ Task 7 depends on Task 5
# ⚠️  Circular dependency detected!

# Auto-fix issues
npm run tm:fix-deps
```

### Removing Dependencies

```bash
# Remove single dependency
npm run tm:remove-dep 9 --depends-on=2

# Task 9 (AI Chat) no longer requires Wizard Stage 3-4
```

---

## Task Reorganization

### Moving Tasks

Task Master supports moving tasks in various ways:

#### 1. Reorder Standalone Tasks

```bash
# Move task 5 to position 10
npm run tm:move 5 --to=10

# Tasks 6-9 shift down to 5-8
# Task 5 becomes task 10
```

#### 2. Convert Task to Subtask

```bash
# Move task 10 to become subtask 8.5
npx task-master move --from=10 --to=8.5

# Task 10 is now nested under task 8
```

#### 3. Convert Subtask to Task

```bash
# Move subtask 5.2 to standalone task 10
npx task-master move --from=5.2 --to=10

# Subtask 5.2 is now an independent task
```

#### 4. Move Subtask Between Parents

```bash
# Move subtask 5.2 to become 7.3
npx task-master move --from=5.2 --to=7.3

# Subtask moves from task 5 to task 7
```

#### 5. Bulk Move (Merge Conflict Resolution)

```bash
# Team merged tasks 10-15 from another branch
# Your tasks 10-12 conflict
# Move your tasks to 16-18

npx task-master move --from=10,11,12 --to=16,17,18
```

### Reorganization Example

**Scenario:** Task 15 (Email) should be implemented earlier

**Before:**
```
1. Wizard 1-2
2. Wizard 3-4
3. Wizard 5-6
4. Stripe Payments
15. Email Notifications (depends on 4)
```

**Command:**
```bash
npx task-master move --from=15 --to=5
```

**After:**
```
1. Wizard 1-2
2. Wizard 3-4
3. Wizard 5-6
4. Stripe Payments
5. Email Notifications (dependencies auto-updated)
```

---

## Team Collaboration

### Multi-Developer Workflow

#### Developer A: Foundation Phase

```bash
# Create feature branch
git checkout -b feat/database-setup

# Optional: Create tag for this feature
npx task-master add-tag --from-branch
# Creates tag: "feat-database-setup"

# Work on database task
npm run tm:in-progress 13

# Log progress
npm run tm:update 13.1 --prompt="Created profiles table with UUID pk..."

# Complete task
npm run tm:done 13

# Commit
git add .
git commit -m "feat(db): implement database schema (task 13)"
git push origin feat/database-setup
```

#### Developer B: Parallel Feature (Same Time)

```bash
# Create different feature branch
git checkout -b feat/dashboard-ui

# Create tag for dashboard work
npx task-master add-tag --from-branch

# Work on dashboard (not blocked if deps are met)
npm run tm:in-progress 8

# ... implement ...
```

#### Merge Conflict Resolution

**Scenario:** Both developers created tasks in the same ID range

```bash
# Developer A merged first (tasks 13-14)
# Developer B has conflicting tasks (also 13-14)

# Developer B: Pull main
git checkout main
git pull origin main

# Developer B: Merge branch (conflict in tasks.json)
git checkout feat/dashboard-ui
git merge main

# CONFLICT in .taskmaster/tasks/tasks.json

# Resolve: Move your tasks to new positions
npx task-master move --from=13 --to=18
npx task-master move --from=14 --to=19

# Commit resolved tasks
git add .taskmaster/tasks/tasks.json
git commit -m "chore(tasks): resolve task ID conflicts after merge"
git push origin feat/dashboard-ui
```

### Git + Task Master Best Practices

1. **Create tags from branches** - Isolates context
   ```bash
   npx task-master add-tag --from-branch
   ```

2. **Log implementation notes** - Future debugging
   ```bash
   npm run tm:update 13.1 --prompt="Implementation notes..."
   ```

3. **Reference tasks in commits** - Traceability
   ```bash
   git commit -m "feat(wizard): implement stage 1 form (task 1.1)"
   ```

4. **Sync tasks before merging** - Prevent conflicts
   ```bash
   git pull origin main
   npm run tm:validate-deps
   ```

---

## Research-Backed Operations

### When to Use Research

Use `--research` flag when you need:
- Latest technology best practices
- Security recommendations
- Performance optimization techniques
- Current library/framework patterns
- Industry-standard implementations

### Research-Enabled Commands

#### 1. Task Creation

```bash
# Add task with research
npx task-master add-task --prompt="Implement OAuth 2.0 authentication with PKCE" --research

# AI will research latest OAuth 2.0 best practices
```

#### 2. Task Expansion

```bash
# Expand with security focus
npm run tm:expand 4 --prompt="Focus on PCI compliance and webhook security" --research

# AI researches:
# - PCI DSS requirements for payments
# - Stripe webhook signature verification
# - Best practices for handling sensitive data
```

#### 3. Task Updates

```bash
# Update task with latest patterns
npx task-master update-task --id=1 --prompt="Update to use React 19 patterns and best practices" --research

# AI researches React 19 changes and updates task
```

#### 4. Complexity Analysis

```bash
# Analyze with research
npm run tm:complexity

# AI researches:
# - Similar project implementations
# - Common pitfalls
# - Recommended architectures
```

### Research Example

**Command:**
```bash
npx task-master expand --id=4 --research --prompt="Focus on Stripe Connect security and webhook handling"
```

**AI Research Process:**
1. Searches for "Stripe Connect best practices 2025"
2. Researches "webhook signature verification security"
3. Finds "PCI compliance requirements for SaaS"
4. Generates subtasks based on latest findings

**Result:**
```
4.1: Set up Stripe Connect with OAuth flow
4.2: Implement webhook signature verification (using stripe.webhooks.constructEvent)
4.3: Add idempotency keys for all mutations
4.4: Implement rate limiting on webhook endpoint
4.5: Add webhook retry logic with exponential backoff
4.6: Create audit log for all payment events
4.7: Test webhook security with replay attacks
4.8: Implement PCI DSS data handling requirements
```

---

## Troubleshooting

### Issue: Tasks Not Syncing

**Symptoms:**
- Task changes not reflected in `tasks.json`
- Task files outdated

**Solution:**
```bash
# Regenerate task files
npm run tm:gen

# Verify tasks.json
cat .taskmaster/tasks/tasks.json | jq '.master.tasks | length'
# Should return: 17
```

### Issue: Circular Dependencies

**Symptoms:**
- `npm run tm:validate-deps` shows errors
- Tasks marked as blocked incorrectly

**Solution:**
```bash
# View dependency issues
npm run tm:validate-deps

# Auto-fix
npm run tm:fix-deps

# Manual fix if needed
npm run tm:remove-dep 5 --depends-on=7
```

### Issue: Research Mode Fails

**Symptoms:**
- Error: "Perplexity API timeout"
- Expansion hangs for >60 seconds

**Solution:**
```bash
# Fallback: Expand without research
npx task-master expand --id=13

# Or: Use main model only
npx task-master expand --id=13 --no-research

# Check API keys
cat .env | grep PERPLEXITY_API_KEY
```

### Issue: Tag Not Found

**Symptoms:**
- Error: "Tag 'mvp-foundation' not found"

**Solution:**
```bash
# List available tags
npm run tm:tags

# Create missing tag
npm run tm:add-tag mvp-foundation --description="Foundation phase tasks"

# Switch to tag
npm run tm:mvp-foundation
```

### Issue: Task IDs Out of Order

**Symptoms:**
- Tasks are numbered: 1, 3, 5, 2, 4...
- Next task shows unexpected ID

**Solution:**
```bash
# Reorganize tasks
npx task-master move --from=3 --to=2
npx task-master move --from=5 --to=3

# Or: Manually edit tasks.json (NOT recommended)
# Better: Use move commands
```

---

## Quick Reference

### Daily Workflow Commands

```bash
# Morning: Check next task
npm run tm:next

# Start working
npm run tm:in-progress 13

# Log progress
npm run tm:update 13.1 --prompt="Implemented profiles table..."

# Complete task
npm run tm:done 13

# Check next task
npm run tm:next
```

### Weekly Planning Commands

```bash
# Review all tasks
npm run tm:list

# Check MVP foundation tasks
npm run tm:mvp-foundation

# Analyze complexity
npm run tm:complexity-report

# Expand complex tasks
npm run tm:expand-all
```

### Team Collaboration Commands

```bash
# Create feature tag
npx task-master add-tag --from-branch

# Validate before merge
npm run tm:validate-deps

# Resolve conflicts
npx task-master move --from=10 --to=20

# Sync tags
npm run tm:tags
```

---

## Additional Resources

### Documentation Files
- `003-taskmaster-plan.md` - Initial setup guide
- `004-team-workflow.md` - Team collaboration workflows
- `002-IMPLEMENTATION-ROADMAP.md` - 5-week MVP plan
- `003-PRODUCTION-READY-CHECKLIST.md` - Production deployment checklist

### Task Master Documentation
- Official Docs: https://taskmaster-ai.dev
- GitHub: https://github.com/eyaltoledano/task-master-ai
- Discord Community: [Join Server]

### EventOS Project
- Project Root: `/home/sk/eventos-ai-canvas/`
- Tasks Directory: `.taskmaster/tasks/`
- Config: `.taskmaster/config.json`
- State: `.taskmaster/state.json`

---

**Generated:** October 9, 2025
**Task Master Version:** 0.28.0
**Total Tasks:** 17 (13 MVP + 4 Post-MVP)
**Tags Created:** 5 (master, mvp-foundation, mvp-features, mvp-production, post-mvp)
**npm Scripts:** 28 task management commands
