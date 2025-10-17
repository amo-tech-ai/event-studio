# Plugin Setup Guide - EventOS

## You Already Have These Installed

 **claude-code-essentials**
 **full-stack-development**
 **documentation-generation**
 **ai-agent-development**
 **database-operations**

Now let's actually use them.

---

## How to Use Plugins (3 Simple Steps)

### Step 1: Check What You Have

```bash
# In Claude Code, type:
/agents
```

You'll see all available agents. Look for ones like:
- `debugger`
- `code-reviewer`
- `backend-architect`
- `frontend-developer`
- `database-architect`

### Step 2: Use an Agent

Just tell me to use a specific agent:

```
"Use code-reviewer to check src/components/ChatWizard.tsx"
"Use backend-architect to design the contact API"
"Use database-optimizer to analyze dashboard queries"
```

### Step 3: See the Results

The agent will:
1. Analyze your code/design/query
2. Give specific recommendations
3. Show you exactly what to change

---

## Quick Test: Try These Now

### Test 1: Code Review
```
"Use code-reviewer to analyze src/components/ChatWizard.tsx"
```

**What you'll get:**
- Security issues found
- Performance improvements
- Best practices violations
- Specific line-by-line fixes

### Test 2: Database Check
```
"Use database-optimizer to review the dashboard query performance"
```

**What you'll get:**
- Slow queries identified
- Index recommendations
- Query optimization suggestions

### Test 3: Architecture Design
```
"Use backend-architect to design a contact management API for the CRM"
```

**What you'll get:**
- API endpoint structure
- Request/response schemas
- Database schema design
- Security considerations

---

## Your Installed Plugins - What They Do

### 1. claude-code-essentials

**Daily development tools**

**Agents:**
- `debugger` - Fix errors and bugs
- `code-reviewer` - Review code quality
- `docs-architect` - Write documentation
- `error-detective` - Find error patterns

**Use when:**
- Something's broken
- Code review needed
- Documentation required

**Examples:**
```
"Use debugger to fix the chat connection error"
"Use code-reviewer to check the authentication logic"
"Use error-detective to analyze the error logs"
```

---

### 2. full-stack-development

**Complete feature implementation**

**Agents:**
- `backend-architect` - API design
- `frontend-developer` - React/Next.js UI
- `database-architect` - Schema design
- `test-automator` - Test generation
- `security-auditor` - Security review
- `performance-engineer` - Optimization

**Use when:**
- Building new features
- Need full-stack coordination
- Want end-to-end implementation

**Examples:**
```
"Build a contact management feature"
’ Automatically uses: backend-architect ’ database-architect ’ frontend-developer ’ test-automator

"Implement chat message reactions"
’ Coordinates all agents for complete feature
```

---

### 3. database-operations

**Supabase schema and optimization**

**Agents:**
- `database-architect` - Schema design
- `database-optimizer` - Query performance
- `database-admin` - Database operations
- `sql-pro` - Complex queries

**Slash Commands:**
- `/database-operations:sql-migrations` - Zero-downtime migrations
- `/database-operations:migration-observability` - Migration monitoring

**Use when:**
- Schema changes needed
- Queries running slow
- Database design decisions

**Examples:**
```
"Use database-architect to design chat threading schema"
"Use database-optimizer to fix slow analytics queries"
"/database-operations:sql-migrations to add user preferences table"
```

---

### 4. documentation-generation

**Technical documentation**

**Agents:**
- `docs-architect` - Comprehensive docs
- `api-documenter` - API documentation
- `mermaid-expert` - Diagrams
- `tutorial-engineer` - Step-by-step guides

**Use when:**
- Need API docs
- Want architecture diagrams
- Creating tutorials

**Examples:**
```
"Use api-documenter to generate OpenAPI spec for contacts API"
"Use mermaid-expert to create database schema diagram"
"Use docs-architect to document the chat system architecture"
```

---

### 5. ai-agent-development

**LLM and AI features**

**Agents:**
- `ai-engineer` - LLM applications
- `prompt-engineer` - Prompt optimization
- `mlops-engineer` - ML pipelines

**Use when:**
- Adding AI features
- Working with LLMs
- Building intelligent systems

**Examples:**
```
"Use ai-engineer to implement chat message suggestions"
"Use prompt-engineer to optimize the AI summary prompts"
```

---

## Real EventOS Workflows

### Workflow 1: Fix a Bug

```
1. "Use error-detective to analyze the chat connection errors"
   ’ Finds patterns in logs

2. "Use debugger to fix the WebSocket connection issue"
   ’ Specific fix recommendations

3. "Use test-automator to generate tests for the fix"
   ’ Prevents regression
```

### Workflow 2: Build Chat Feature

```
1. "Use backend-architect to design message threading API"
   ’ Clean API structure

2. "Use database-architect to design thread schema"
   ’ Optimized database design

3. "Use frontend-developer to build thread UI"
   ’ React components

4. "Use test-automator to generate tests"
   ’ Complete test suite
```

### Workflow 3: Optimize Dashboard

```
1. "Use performance-engineer to profile dashboard loading"
   ’ Identifies bottlenecks

2. "Use database-optimizer to fix slow queries"
   ’ Query optimizations

3. "Use frontend-developer to optimize React rendering"
   ’ Component optimizations
```

### Workflow 4: Complete Feature (Auto-Coordinated)

```
"Implement contact management with CRUD, search, and CSV import"

’ full-stack-development plugin automatically:
  - backend-architect designs API
  - database-architect designs schema
  - frontend-developer builds UI
  - test-automator generates tests
  - security-auditor reviews security
  - performance-engineer optimizes
```

---

## Pattern: When to Use Which Plugin

### Bug Fixing
**Plugin:** `claude-code-essentials`
```
"Use debugger to fix [issue]"
"Use error-detective to analyze [errors]"
```

### New Features
**Plugin:** `full-stack-development`
```
"Build [feature description]"
"Implement [user story]"
```

### Database Work
**Plugin:** `database-operations`
```
"Use database-architect to design [schema]"
"Use database-optimizer to fix [slow query]"
"/database-operations:sql-migrations for [migration]"
```

### Code Quality
**Plugin:** `claude-code-essentials`
```
"Use code-reviewer to check [file]"
"Use security-auditor to scan [component]"
```

### Documentation
**Plugin:** `documentation-generation`
```
"Use api-documenter for [endpoint]"
"Use mermaid-expert to diagram [system]"
```

---

## Pro Tips

### 1. Be Specific
```
L "Fix the database"
 "Use database-optimizer to analyze the dashboard analytics query in src/lib/queries.sql"
```

### 2. Chain Agents for Complete Work
```
"Use backend-architect to design contacts API,
then database-architect to design schema,
then frontend-developer to build the UI"
```

### 3. Let Plugins Auto-Coordinate
```
"Implement notification system"
’ full-stack-development handles everything
```

### 4. Use Slash Commands for Special Operations
```
/database-operations:sql-migrations
’ Specialized migration workflow
```

---

## Integration with Task Master

Combine plugins with Task Master for powerful workflows:

```bash
# Get next task
task-master next
# ’ Task 1.2: Implement chat threading

# Use agents to complete
"Use backend-architect to design threading API"
"Use database-architect for schema"
"Use frontend-developer for UI"

# Log what worked
task-master update-subtask --id=1.2 --prompt="
Used backend-architect: REST API with /threads endpoints
Used database-architect: threads table with message_count
Used frontend-developer: ThreadList and ThreadView components
Tests generated with test-automator
"

# Complete
task-master set-status --id=1.2 --status=done
```

---

## Troubleshooting

### "Which agent should I use?"
Ask me:
```
"Which agent should handle React component optimization?"
’ I'll suggest: frontend-developer or performance-engineer
```

### "Agent didn't do what I expected"
Be more specific:
```
Instead of: "Optimize the code"
Try: "Use performance-engineer to profile and optimize the dashboard rendering in src/pages/Dashboard.tsx"
```

### "How do I see available agents?"
```
/agents
’ Shows all installed agents
```

### "How do I see custom commands?"
```
/help
’ Shows all available commands including slash commands from plugins
```

---

## Next Steps

### Today
1. Try one agent right now:
   ```
   "Use code-reviewer to analyze src/components/ChatWizard.tsx"
   ```

2. Check what it finds

3. Apply the recommendations

### This Week
1. Use `debugger` for next bug
2. Use `backend-architect` for next API
3. Use `database-optimizer` for slow query
4. Use `full-stack-development` for next feature

### This Month
1. Build complete features with auto-coordination
2. Create custom workflows for common tasks
3. Document your agent usage patterns
4. Share with team

---

## Quick Reference Card

| Task | Agent | Command |
|------|-------|---------|
| **Fix bug** | debugger | `"Use debugger to fix [issue]"` |
| **Review code** | code-reviewer | `"Use code-reviewer to check [file]"` |
| **Design API** | backend-architect | `"Use backend-architect to design [API]"` |
| **Design schema** | database-architect | `"Use database-architect to design [schema]"` |
| **Optimize query** | database-optimizer | `"Use database-optimizer to fix [query]"` |
| **Build UI** | frontend-developer | `"Use frontend-developer to build [component]"` |
| **Generate tests** | test-automator | `"Use test-automator for [feature]"` |
| **Security scan** | security-auditor | `"Use security-auditor to scan [code]"` |
| **Profile performance** | performance-engineer | `"Use performance-engineer to profile [page]"` |
| **Create docs** | docs-architect | `"Use docs-architect to document [system]"` |
| **Database migration** | - | `/database-operations:sql-migrations` |

---

## Remember

1. **Plugins are specialists** - Each one is an expert
2. **Use explicitly** - Tell me which agent to use
3. **Be specific** - More detail = better results
4. **Chain them** - Multiple agents for complete work
5. **Auto-coordinate** - Let full-stack-development handle complex features

**Start simple:** Pick one agent, try it on one file, see what happens.

Then expand from there.
