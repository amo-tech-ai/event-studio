# How to Use Claude Code Plugins - Simple Guide

## What Are Plugins?

Think of plugins as **hiring specialized experts** for your project. Instead of Claude doing everything, you get 84 specialized agents who are masters at specific tasks.

## Real Example: Building a Feature

**Without plugins:**
```
You: "Build a user profile page"
Claude: *tries to do everything at once*
```

**With plugins:**
```
You: "Use backend-architect to design the profile API"
→ Expert designs clean, scalable API structure

You: "Use database-architect to design the user schema"
→ Expert creates optimized database schema

You: "Use frontend-developer to build the profile UI"
→ Expert builds React components following best practices

You: "Use test-automator to create tests"
→ Expert generates comprehensive test suite
```

**Result:** Better quality, faster development, consistent patterns.

---

## Quick Start (5 Minutes)

### Step 1: Add the Marketplace

In Claude Code, type:
```
/plugin marketplace add https://github.com/wshobson/agents
```

This adds access to 36 plugin packages with 84 specialized agents.

### Step 2: Install Your First Plugin

```
/plugin install claude-code-essentials
```

This gives you daily essentials:
- Code review expert
- Debug specialist
- Documentation writer
- Git workflow helper

### Step 3: Use an Agent

Just tell Claude to use a specific agent:
```
"Use code-reviewer to analyze this component for issues"
```

That's it. You're using plugins.

---

## Core Concept: Agents vs Plugins

**Agent** = Individual specialist (like "backend-architect")
**Plugin** = Package of related agents (like "full-stack-development")

### Example:

**Plugin:** `full-stack-development`
**Contains agents:**
- backend-architect
- frontend-developer
- database-architect
- test-automator
- security-auditor
- performance-engineer
- deployment-engineer

When you install the plugin, you get all these agents.

---

## Essential Plugins for EventOS

### 1. claude-code-essentials
**What it does:** Daily development tasks
**When to use:** Every day
**Agents you'll use:**
- `debugger` - Fix errors
- `code-reviewer` - Review code quality
- `docs-architect` - Write documentation

**Real example:**
```
"Use debugger to find why the chat messages aren't loading"
"Have code-reviewer check this authentication logic"
```

### 2. full-stack-development
**What it does:** Coordinates entire feature builds
**When to use:** Building new features
**Agents you'll use:**
- `backend-architect` - API design
- `frontend-developer` - React/Next.js UI
- `database-architect` - Schema design

**Real example:**
```
"Build a contact management feature for the CRM"
→ Automatically coordinates backend, database, frontend, tests, security
```

### 3. database-operations
**What it does:** Supabase schema work, query optimization
**When to use:** Database changes
**Agents you'll use:**
- `database-architect` - Schema design
- `database-optimizer` - Query performance
- `sql-pro` - Complex queries

**Real example:**
```
"Use database-architect to design the chat threads schema"
"Have database-optimizer analyze the dashboard queries"
```

### 4. api-scaffolding
**What it does:** Generates REST/GraphQL APIs
**When to use:** Creating new endpoints
**Agents you'll use:**
- `backend-architect` - API structure
- `fastapi-pro` - Python/FastAPI code
- `api-documenter` - OpenAPI docs

**Real example:**
```
"Use api-scaffolding to generate CRUD endpoints for contacts"
```

---

## How to Actually Use Agents

### Pattern 1: Direct Request
```
"Use [agent-name] to [task]"
```

**Examples:**
```
"Use backend-architect to design the notifications API"
"Use frontend-developer to create a dashboard card component"
"Use security-auditor to scan for vulnerabilities"
```

### Pattern 2: Multi-Agent Workflow
```
"Coordinate [agent-1], [agent-2], and [agent-3] to [bigger task]"
```

**Example:**
```
"Coordinate backend-architect, database-architect, and frontend-developer
to implement user preferences"

→ Claude automatically:
1. Has backend-architect design API
2. Has database-architect design schema
3. Has frontend-developer build UI
4. Coordinates them together
```

### Pattern 3: Plugin Orchestration
```
"[Feature description]" (plugin auto-coordinates)
```

**Example:**
```
"Implement real-time chat notifications"

→ full-stack-development plugin automatically uses:
- backend-architect (WebSocket API)
- database-architect (notifications table)
- frontend-developer (notification UI)
- test-automator (integration tests)
- security-auditor (auth checks)
```

---

## Real EventOS Workflows

### Workflow 1: Add Chat Feature
```bash
# 1. Design phase
"Use backend-architect to design message threading API"
"Use database-architect to create thread schema with performance in mind"

# 2. Implementation
"Use frontend-developer to build the thread UI component"
"Use fastapi-pro to implement the threading endpoints"

# 3. Quality
"Use test-automator to generate tests for threading"
"Use security-auditor to check for XSS vulnerabilities"

# 4. Polish
"Use performance-engineer to optimize thread loading"
```

### Workflow 2: CRM Contact Management
```bash
# Use full-stack plugin for complete feature
"Implement contact management with:
- Contact CRUD operations
- Search and filtering
- Activity timeline
- Bulk import from CSV"

→ Plugin coordinates all agents automatically
```

### Workflow 3: Dashboard Performance
```bash
# Performance optimization workflow
"Use performance-engineer to profile the dashboard loading time"
"Use database-optimizer to fix slow analytics queries"
"Use observability-engineer to add monitoring"
```

---

## Installation Plan for EventOS

### Week 1: Essentials
```bash
/plugin install claude-code-essentials
/plugin install full-stack-development
/plugin install database-operations
```

**Try them:**
```
"Use debugger to fix the chat connection issue"
"Use database-architect to design the CRM schema"
```

### Week 2: Quality & Security
```bash
/plugin install testing-quality-suite
/plugin install security-scanning
```

**Try them:**
```
"Use test-automator to generate tests for the auth flow"
"Use security-auditor to scan the codebase"
```

### Week 3: Infrastructure
```bash
/plugin install deployment-orchestration
/plugin install observability-monitoring
```

**Try them:**
```
"Use deployment-engineer to set up CI/CD for Vercel"
"Use observability-engineer to add error tracking"
```

---

## Which Agent for Which Task?

### Backend Work
- **API design:** `backend-architect`
- **Python/FastAPI code:** `fastapi-pro` or `python-pro`
- **GraphQL:** `graphql-architect`

### Frontend Work
- **React/Next.js:** `frontend-developer`
- **UI/UX design:** `ui-ux-designer`
- **Components:** `frontend-developer`

### Database Work
- **Schema design:** `database-architect`
- **Query optimization:** `database-optimizer`
- **Migrations:** `database-operations` plugin (has slash command)

### Quality Assurance
- **Code review:** `code-reviewer`
- **Security:** `security-auditor`
- **Testing:** `test-automator`
- **Performance:** `performance-engineer`

### DevOps
- **Deployment:** `deployment-engineer`
- **CI/CD:** `cicd-automation` plugin
- **Monitoring:** `observability-engineer`
- **Debugging production:** `incident-responder`

---

## Advanced: Custom Workflows

Create `.claude/commands/build-feature.md`:
```markdown
---
description: Build a complete feature with quality checks
---

Build feature: $ARGUMENTS

Steps:
1. Use backend-architect to design API
2. Use database-architect to design schema
3. Use frontend-developer to build UI
4. Use test-automator to generate tests
5. Use security-auditor to review
6. Use performance-engineer to optimize
7. Update task-master with progress
```

**Use it:**
```
/build-feature contact management system
```

---

## Troubleshooting

### "Agent not found"
**Problem:** Plugin not installed
**Solution:**
```bash
/plugin                    # Check installed plugins
/plugin install [name]     # Install missing plugin
```

### "Agent not working as expected"
**Problem:** Unclear instructions
**Solution:** Be specific:
```
❌ "Fix the database"
✅ "Use database-optimizer to analyze and fix the slow dashboard query in analytics.sql"
```

### "Which agent should I use?"
**Problem:** Not sure which specialist to ask
**Solution:** Ask Claude:
```
"Which agent should I use to optimize React component rendering?"
→ Claude suggests: frontend-developer or performance-engineer
```

---

## Integration with Task Master

Task Master + Plugins = Powerful workflow

```bash
# Get next task
task-master next
# → Task 1.2: Implement chat threading

# Use agents to complete it
"Use backend-architect to design threading API"
"Use database-architect to design thread schema"
"Use frontend-developer to build thread UI"

# Log progress
task-master update-subtask --id=1.2 --prompt="
Used backend-architect for API design
Used database-architect for schema
Implemented with frontend-developer
"

# Mark done
task-master set-status --id=1.2 --status=done
```

---

## Key Takeaways

1. **Plugins = Specialists:** Each agent is a domain expert
2. **Use explicitly:** `"Use [agent] to [task]"`
3. **Multi-agent coordination:** Let plugins orchestrate complex features
4. **Start small:** Install 2-3 plugins, learn, then expand
5. **Be specific:** Clear instructions = better results

## Next Steps

1. Add the marketplace (see Quick Start)
2. Install `claude-code-essentials`
3. Try one agent: `"Use code-reviewer to analyze src/components/Chat.tsx"`
4. Install `full-stack-development` for your next feature
5. Check `/help` to see your new commands

**Remember:** These agents are always available. Just ask them to help.
