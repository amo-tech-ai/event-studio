# Complete Claude Code Development Plan for Web Applications
## Production-Ready Implementation Guide with Real-World Examples

---

## 📋 **Table of Contents**

1. [Project Setup & Configuration](#1-project-setup)
2. [Build with Claude Code](#2-build-with-claude-code)
3. [Subagents](#3-subagents)
4. [Plugins](#4-plugins)
5. [Output Styles](#5-output-styles)
6. [Hooks](#6-hooks)
7. [Headless Mode](#7-headless-mode)
8. [GitHub Actions](#8-github-actions)
9. [GitLab CI/CD](#9-gitlab-cicd)
10. [Model Context Protocol (MCP)](#10-mcp)
11. [Claude Agent SDK](#11-claude-agent-sdk)
12. [Real-World Use Cases](#12-real-world-use-cases)
13. [Complete Implementation Workflow](#13-complete-workflow)

---

## 1. Project Setup & Configuration {#1-project-setup}

### **1.1 Installation**

```bash
# Official installation method
npm install -g @anthropic-ai/claude-code

# Verify installation
claude --version

# Check system health
claude
> /doctor
```

### **1.2 Authentication**

```bash
# Start Claude Code
claude

# Inside Claude session, authenticate
> /login

# Verify authentication
> /status
```

### **1.3 Project Structure**

```
project-root/
├── .claude/
│   ├── settings.json           # Project settings (checked in)
│   ├── settings.local.json     # Personal overrides (gitignored)
│   ├── commands/               # Custom slash commands
│   │   ├── test-feature.md
│   │   └── security-audit.md
│   ├── agents/                 # Custom subagents
│   │   ├── db-expert.json
│   │   └── api-designer.json
│   └── hooks/                  # Automation hooks
│       ├── pre-commit.js
│       └── post-deploy.js
├── .mcp.json                   # MCP server configuration
├── CLAUDE.md                   # Project guide (CRITICAL)
├── .gitignore
└── src/
```

### **1.4 Configuration Hierarchy**

| Level | Location | Purpose | Checked In? |
|-------|----------|---------|-------------|
| **Enterprise** | `/Library/Application Support/ClaudeCode/managed-mcp.json` (macOS) | Company-wide policies | N/A |
| **Project** | `.claude/settings.json` | Team-shared settings | ✅ Yes |
| **Project Local** | `.claude/settings.local.json` | Personal preferences | ❌ No |
| **User** | `~/.claude/settings.json` | Global personal settings | ❌ No |
| **CLI Flags** | `claude --model opus` | One-time overrides | N/A |

### **1.5 Core Configuration Files**

**`.claude/settings.json` (Project Settings)**

```json
{
  "model": "claude-sonnet-4-5",
  "permissions": {
    "allow": [
      "Bash(npm run lint)",
      "Bash(npm test)",
      "Bash(git log:*)",
      "Bash(git diff:*)",
      "Read"
    ],
    "ask": [
      "Bash(git push:*)",
      "Bash(npm publish)",
      "Write"
    ],
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)",
      "Bash(rm -rf:*)",
      "Bash(docker rm:*)"
    ]
  },
  "hooks": {
    "PreToolUse": {
      "Write": "~/.claude/hooks/format-on-write.sh",
      "Edit": "~/.claude/hooks/format-on-edit.sh"
    },
    "SessionStart": "~/.claude/hooks/session-start.sh",
    "Stop": "~/.claude/hooks/cleanup.sh"
  },
  "env": {
    "NODE_ENV": "development",
    "DISABLE_TELEMETRY": "1",
    "MAX_MCP_OUTPUT_TOKENS": "50000"
  }
}
```

**`CLAUDE.md` (Project Guide)**

```markdown
# FashionOS Development Guide

## Overview
AI-powered fashion event platform built with React 18, Vite, Supabase, Clerk, Stripe Connect.

## Quick Start
```bash
npm install
cp .env.example .env
npm run db:migrate
npm run dev  # http://localhost:3000
```

## Architecture
- **Frontend:** React 18 + Vite + shadcn/ui + Tailwind
- **State:** Zustand + React Query
- **Backend:** Supabase (Postgres + Edge Functions)
- **Auth:** Clerk (Google, Apple, Facebook, LinkedIn)
- **Payments:** Stripe Connect
- **Storage:** Cloudinary
- **AI:** CopilotKit state machines

## Code Standards
- TypeScript strict mode
- Functional components with hooks
- Zod for all validation
- 80% test coverage minimum
- All DB tables MUST have RLS enabled

## Common Commands
```bash
npm test                    # Run all tests
npm run test:e2e            # Playwright E2E tests
npm run db:migrate          # Apply migrations
npm run db:generate         # Generate migration
npm run lint                # ESLint + Prettier
npm run type-check          # TypeScript check
```

## Critical Rules
1. **Security:** Never commit .env files or API keys
2. **Database:** Always use RLS policies (auth.uid())
3. **Validation:** Use Zod schemas for all inputs
4. **Performance:** <800ms page load, <200ms API
5. **Testing:** TDD - write tests before code

## File Structure
```
src/
├── components/   # Reusable UI components
├── features/     # Feature modules (events, tickets, etc.)
├── lib/          # Utilities, configs, API clients
├── pages/        # Route components
└── types/        # TypeScript definitions
```

## Common Pitfalls
- Forgetting to add indexes to DB queries
- Not testing mobile viewport (375px)
- Hardcoding URLs instead of env vars
- Missing error boundaries
- Stripe webhook signature validation

## Environment Variables
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Public anon key
- `VITE_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `CLERK_SECRET_KEY` - Clerk secret (server only)
- `STRIPE_SECRET_KEY` - Stripe secret key
- `CLOUDINARY_CLOUD_NAME` - Cloudinary account
```

**`.mcp.json` (MCP Configuration)**

```json
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    },
    "sentry": {
      "type": "http",
      "url": "https://mcp.sentry.dev/mcp"
    },
    "stripe": {
      "type": "http",
      "url": "https://mcp.stripe.com"
    },
    "supabase": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "${DATABASE_URL}"
      }
    }
  }
}
```

---

## 2. Build with Claude Code {#2-build-with-claude-code}

### **2.1 Core Workflow: Explore → Plan → Code → Commit**

| Phase | Description | Commands | Duration |
|-------|-------------|----------|----------|
| **Explore** | Understand codebase, gather context | `@filename`, `think harder` | 2-5 min |
| **Plan** | Design approach, identify risks | `Shift+Tab` (Plan Mode) | 3-10 min |
| **Code** | Implement with tests | Normal interaction | 10-30 min |
| **Commit** | Generate commit, create PR | `/pr`, `git commit` | 2-5 min |

### **2.2 Interactive Features**

#### **Plan Mode (Preview Changes)**

```bash
# Start Claude Code
claude

# Enable Plan Mode (Shift+Tab twice)
# Shows: ⏸ plan mode on

# All changes are previewed, not executed
> Create the Event Wizard with 6 stages

# Review proposed changes
# Press Enter to accept, Escape to cancel
```

**Plan Mode Benefits:**
- ✅ See all changes before applying
- ✅ Understand impact across files
- ✅ Catch mistakes early
- ✅ Learn Claude's reasoning

#### **Context Gathering**

```bash
claude

# Reference specific files
> @src/features/events/EventWizard.tsx
> Explain how the state machine works

# Reference directories
> @src/features/events/
> Show me all event-related components

# Reference URLs
> @https://docs.stripe.com/connect
> Implement Stripe Connect for organizer payouts

# Use MCP resources
> @github:issue/123
> Fix this GitHub issue
```

#### **Extended Thinking**

```bash
# Trigger deep reasoning for complex decisions
> think harder about the optimal state management for Event Wizard
> Consider: Zustand vs React Context vs Redux
> Evaluate: performance, DX, bundle size, testability

# For architectural decisions
> ultrathink about database schema for multi-tenant events
> Requirements: RLS, performance, scalability, data integrity
```

**Thinking Levels** (unofficial but observed):
- `think` - Basic reasoning (~4K tokens)
- `think hard` - Moderate reasoning (~8K tokens)
- `think harder` - Deep reasoning (~16K tokens)
- `ultrathink` - Maximum reasoning (~32K tokens)

### **2.3 File Operations**

```bash
# Read files
> Read src/lib/stripe.ts and explain the webhook handling

# Edit files
> Fix the bug in src/features/events/api.ts where events aren't filtered by organizer

# Create files
> Create a new React component for ticket selection at src/components/TicketSelector.tsx

# Multi-file edits
> Refactor authentication to use Clerk instead of Supabase Auth across all files
```

### **2.4 Test-Driven Development**

```bash
claude

# Step 1: Generate tests FIRST
> Generate comprehensive tests for Event Creation feature
> Include: unit, integration, E2E tests
> Cover: validation, RLS, error cases

# Step 2: Commit tests
> git add tests/
> git commit -m "test: Add Event Creation test suite"

# Step 3: Implement to pass tests
> Implement Event Creation to pass all tests
> Use Zod for validation, ensure RLS policies work

# Step 4: Verify
> Run npm test
> Fix any failures

# Step 5: Commit implementation
> git add src/features/events/
> git commit -m "feat: Implement Event Creation"
```

### **2.5 Keyboard Shortcuts**

| Shortcut | Action | When to Use |
|----------|--------|-------------|
| `Shift+Tab` | Toggle Plan Mode | Preview changes |
| `Escape` | Cancel current operation | Stop generation |
| `Ctrl+C` | Interrupt Claude | Course-correct |
| `/` | Open command menu | Access slash commands |
| `@` | Reference files/resources | Add context |
| `Tab` | Autocomplete | Complete file paths |

### **2.6 Session Management**

```bash
# Continue last conversation
claude -c

# Resume specific session
claude --resume abc123

# List recent sessions
claude --resume  # Shows picker

# Continue in non-interactive mode
claude -c -p "Run tests and fix any failures"
```

---

## 3. Subagents {#3-subagents}

### **3.1 What Are Subagents?**

Subagents are specialized AI workers that handle specific tasks. They run **inside** the main Claude session with focused system prompts.

**Benefits:**
- ✅ Preserve main context for complex work
- ✅ Specialized expertise (API design, security, testing)
- ✅ Parallel investigation without context pollution
- ✅ Team-shareable workflows

### **3.2 Built-in Subagents**

| Subagent | Purpose | When to Use |
|----------|---------|-------------|
| `api-designer` | Design REST/GraphQL APIs | Creating new endpoints |
| `performance-optimizer` | Identify bottlenecks | Slow queries, renders |
| `test-writer` | Generate test cases | Achieving coverage |
| `security-auditor` | Find vulnerabilities | Before deployment |

```bash
# List available subagents
> /agents list

# Use a subagent explicitly
> /agents use api-designer
> Design the Events API with CRUD + search

# Let Claude choose automatically
> Use a subagent to verify the database schema is properly normalized
```

### **3.3 Creating Custom Subagents**

**Example: Database Expert**

```json
// .claude/agents/db-expert.json
{
  "name": "db-expert",
  "description": "Supabase PostgreSQL expert specialized in RLS policies, migrations, and performance optimization",
  "systemPrompt": "You are a Supabase database expert. Follow these rules:\n\n1. **Migrations Only**: Never edit schema files directly. Always generate migrations using:\n   ```bash\n   supabase db diff -f migration_name\n   ```\n\n2. **RLS Mandatory**: Every table MUST have Row Level Security enabled:\n   ```sql\n   ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;\n   ```\n\n3. **Policies for All Roles**:\n   - `anon`: Public read-only access\n   - `authenticated`: User-specific access via auth.uid()\n   - Service role: Full access (server-side only)\n\n4. **Performance**:\n   - Add indexes for foreign keys\n   - Index columns used in WHERE clauses\n   - Use `EXPLAIN ANALYZE` to verify query plans\n\n5. **Naming Conventions**:\n   - Tables: snake_case, plural (users, events)\n   - Policies: `{table}_{action}_{role}` (events_select_authenticated)\n   - Indexes: `idx_{table}_{column}` (idx_events_organizer_id)\n\nRefer to CLAUDE.md for project-specific database rules.",
  "allowedTools": ["Bash", "WriteFile", "ReadFile", "Grep"],
  "model": "claude-sonnet-4-5"
}
```

**Example: API Designer**

```json
// .claude/agents/api-designer.json
{
  "name": "api-designer",
  "description": "REST API design specialist following OpenAPI standards",
  "systemPrompt": "You are an API design expert. Create APIs that are:\n\n1. **RESTful**: Use standard HTTP methods correctly\n   - GET: Retrieve (idempotent, cacheable)\n   - POST: Create\n   - PUT/PATCH: Update (PUT = full, PATCH = partial)\n   - DELETE: Remove (idempotent)\n\n2. **Consistent**:\n   - Plural resource names (/events, /tickets)\n   - Kebab-case for multi-word (/ticket-tiers)\n   - Versioned (/v1/events)\n\n3. **Well-Documented**:\n   - Generate OpenAPI 3.0 spec\n   - Include request/response examples\n   - Document all error codes\n\n4. **Secure**:\n   - Require authentication (Bearer token)\n   - Rate limiting headers\n   - Input validation (Zod schemas)\n\n5. **Performance**:\n   - Pagination for collections (cursor-based preferred)\n   - Filtering, sorting, field selection\n   - ETags for caching\n\nFollow the API patterns in CLAUDE.md.",
  "allowedTools": ["WriteFile", "ReadFile", "WebFetch"],
  "model": "claude-sonnet-4-5"
}
```

**Example: Security Auditor**

```json
// .claude/agents/security-auditor.json
{
  "name": "security-auditor",
  "description": "Security specialist focusing on OWASP Top 10 and best practices",
  "systemPrompt": "You are a security auditor. Check for:\n\n1. **Injection Attacks**:\n   - SQL: Verify parameterized queries (no string concat)\n   - XSS: Check input sanitization, output encoding\n   - Command: No unsanitized input to shell commands\n\n2. **Authentication**:\n   - Passwords hashed with bcrypt/Argon2\n   - JWTs properly signed and verified\n   - Session tokens secure (HttpOnly, SameSite)\n\n3. **Authorization**:\n   - RLS policies on all database tables\n   - API endpoints check user permissions\n   - No client-side-only auth checks\n\n4. **Sensitive Data**:\n   - No secrets in code (check .env usage)\n   - API keys in environment variables\n   - PII encrypted at rest\n\n5. **Dependencies**:\n   - Run `npm audit` and report vulnerabilities\n   - Check for outdated packages\n   - Verify license compatibility\n\nGenerate a detailed security report with severity ratings.",
  "allowedTools": ["Bash", "ReadFile", "Grep", "mcp__sentry"],
  "model": "claude-sonnet-4-5"
}
```

### **3.4 Using Subagents in Workflows**

```bash
claude

# Scenario: Complex database migration
> think harder about how to migrate from single-tenant to multi-tenant architecture

# Use subagent for detailed investigation
> Use the db-expert subagent to:
> 1. Analyze current schema
> 2. Design multi-tenant approach (row-level tenancy vs schema-per-tenant)
> 3. Create migration plan with zero downtime
> 4. Generate RLS policies for tenant isolation

# Main Claude reviews subagent's work
> Review the db-expert's proposal and identify potential issues

# Use another subagent for verification
> Use the security-auditor subagent to verify the RLS policies prevent cross-tenant data access
```

### **3.5 Subagent Best Practices**

| Practice | Why | Example |
|----------|-----|---------|
| **Narrow Focus** | Prevents context pollution | One domain (DB, API, Security) |
| **Clear System Prompt** | Consistent behavior | Specific rules, examples |
| **Tool Restrictions** | Safety and focus | Only relevant tools |
| **Team Sharing** | Consistent workflows | Check in `.claude/agents/` |

---

## 4. Plugins {#4-plugins}

### **4.1 Official Claude Code Plugins**

Claude Code has a plugin system for extending functionality. Plugins are **distributed separately** from the core CLI.

**Currently Available:**
- **IDE Extensions**: VSCode, IntelliJ, Vim/Neovim integration
- **Custom Tools**: Add your own tools to Claude's toolkit
- **Language Support**: Enhanced support for specific languages

### **4.2 Plugin Configuration**

**In `settings.json`:**

```json
{
  "enabledPlugins": [
    "@anthropic/vscode-integration",
    "@anthropic/vim-integration"
  ],
  "extraKnownMarketplaces": [
    "https://custom-plugins.example.com/registry"
  ]
}
```

### **4.3 IDE Integration Plugins**

#### **VSCode Plugin**

```bash
# Install VSCode extension
# Extension auto-installs when Claude Code detects VSCode

# Usage in Claude:
> Open src/components/Button.tsx in VSCode
> Show me where this component is used

# Claude can:
# - Open files in your editor
# - Jump to definitions
# - Show references
# - Trigger editor commands
```

#### **Vim/Neovim Plugin**

```bash
# For Vim users
# Enables Claude to open files in your existing Vim session

# Usage:
> Edit src/lib/api.ts in vim at line 42

# Claude can:
# - Open files at specific lines
# - Execute Vim commands
# - Read current buffer
```

### **4.4 Plugin Architecture**

Plugins extend Claude Code through:

1. **Custom Tools**: New tools for Claude to use
2. **MCP Servers**: Connect to external services
3. **Output Formatters**: Custom output styles
4. **Hooks**: Integration points in the workflow

**Example: Custom Tool Plugin**

```typescript
// plugins/screenshot-tool/index.ts
import { Plugin } from '@anthropic-ai/claude-code';

export default class ScreenshotPlugin implements Plugin {
  name = 'screenshot-tool';
  version = '1.0.0';

  tools = {
    take_screenshot: {
      description: 'Take a screenshot of a URL',
      parameters: {
        url: { type: 'string', description: 'URL to screenshot' },
        viewport: { type: 'string', description: 'Viewport size (e.g., 1920x1080)' }
      },
      handler: async (params: { url: string; viewport: string }) => {
        // Implementation using Puppeteer
        const screenshot = await takeScreenshot(params.url, params.viewport);
        return { path: screenshot, success: true };
      }
    }
  };
}
```

### **4.5 Plugin Marketplaces**

Check official plugin registry:
```bash
# List installed plugins
> /plugins list

# Search for plugins
> /plugins search testing

# Install plugin
> /plugins install @community/jest-runner
```

**Note:** As of October 2025, the plugin ecosystem is still evolving. Check [docs.claude.com/plugins](https://docs.claude.com/en/docs/claude-code/plugins-reference) for latest.

---

## 5. Output Styles {#5-output-styles}

### **5.1 Available Output Styles**

| Style | Purpose | When to Use |
|-------|---------|-------------|
| **Conversational** | Natural dialogue | Default interactive mode |
| **Structured** | Clear sections, headers | Complex explanations |
| **Concise** | Minimal, to-the-point | Quick answers |
| **Technical** | Code-focused, minimal prose | Implementation details |
| **Tutorial** | Step-by-step instructions | Learning new concepts |

### **5.2 Configuring Output Style**

**In `settings.json`:**

```json
{
  "outputStyle": "Structured"
}
```

**Via CLI:**

```bash
# For single session
claude --output-style concise

# In conversation
> Use concise output style for the rest of this session
```

### **5.3 Output Style Examples**

#### **Conversational Style**

```
You: How do I add authentication?

Claude: Great question! Let's set up authentication with Clerk. 
First, we'll need to install the Clerk SDK. I'll walk you through 
the setup step by step...
```

#### **Structured Style**

```
You: How do I add authentication?

Claude: 
## Authentication Setup with Clerk

### 1. Installation
```bash
npm install @clerk/nextjs
```

### 2. Environment Variables
Add to `.env`:
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- CLERK_SECRET_KEY

### 3. Configuration
...
```

#### **Concise Style**

```
You: How do I add authentication?

Claude:
npm install @clerk/nextjs
Add CLERK keys to .env
Wrap app in <ClerkProvider>
Use useUser() hook
```

#### **Technical Style**

```
You: How do I add authentication?

Claude:
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      {children}
    </ClerkProvider>
  );
}

// components/Profile.tsx
import { useUser } from '@clerk/nextjs';
...
```

### **5.4 Output Format for Automation**

**For CI/CD and scripts:**

```bash
# JSON output (parseable)
claude -p "Run tests and report failures" --output-format json

# Streaming JSON (real-time)
claude -p "Analyze errors in logs.txt" --output-format stream-json

# Plain text (default)
claude -p "Generate README" --output-format text
```

**JSON Output Structure:**

```json
{
  "conversationId": "conv_abc123",
  "turns": [
    {
      "role": "user",
      "content": "Run tests and report failures"
    },
    {
      "role": "assistant",
      "content": "Running tests...",
      "toolUse": [
        {
          "tool": "Bash",
          "input": "npm test",
          "output": "FAIL src/api.test.ts..."
        }
      ]
    }
  ],
  "outcome": "success"
}
```

---

## 6. Hooks {#6-hooks}

### **6.1 What Are Hooks?**

Hooks are **automation scripts** that run at specific points in Claude's workflow. They enable:
- Pre-flight validation
- Automatic formatting
- Security checks
- Post-deployment verification

### **6.2 Available Hook Events**

| Hook Event | When It Fires | Use Cases |
|------------|---------------|-----------|
| `SessionStart` | Claude session begins | Load project context, check git status |
| `UserPromptSubmit` | User sends a message | Log prompts, validate input |
| `PreToolUse` | Before tool execution | Block dangerous commands, validate permissions |
| `PostToolUse` | After tool execution | Format code, run linters |
| `Stop` | Session ends | Cleanup, commit changes, send notifications |

### **6.3 Hook Configuration**

**In `settings.json`:**

```json
{
  "hooks": {
    "SessionStart": "~/.claude/hooks/session-start.sh",
    "PreToolUse": {
      "Bash": "~/.claude/hooks/validate-bash.sh",
      "Write": "~/.claude/hooks/format-on-write.sh",
      "Edit": "~/.claude/hooks/format-on-edit.sh"
    },
    "PostToolUse": {
      "Write": "~/.claude/hooks/post-write.sh"
    },
    "Stop": "~/.claude/hooks/cleanup.sh"
  }
}
```

### **6.4 Hook Examples**

#### **SessionStart Hook**

```bash
#!/bin/bash
# ~/.claude/hooks/session-start.sh

echo "🚀 Starting Claude session..."

# Check git status
if [ -n "$(git status --porcelain)" ]; then
  echo "⚠️  Warning: You have uncommitted changes"
  git status --short
fi

# Check for missing .env
if [ ! -f .env ]; then
  echo "❌ Error: .env file not found"
  echo "Run: cp .env.example .env"
  exit 1
fi

# Load project context
if [ -f CLAUDE.md ]; then
  echo "✅ CLAUDE.md loaded"
fi

# Show recent activity
echo "📝 Recent commits:"
git log --oneline -5

echo "✨ Ready to code!"
```

#### **PreToolUse: Validate Bash Commands**

```bash
#!/bin/bash
# ~/.claude/hooks/validate-bash.sh

# Hook receives JSON via stdin
TOOL_INPUT=$(cat)

# Extract the command
COMMAND=$(echo "$TOOL_INPUT" | jq -r '.command')

# Dangerous patterns
DANGEROUS=(
  "rm -rf /"
  "mkfs"
  "dd if="
  ":(){ :|:& };:"  # Fork bomb
  "> /dev/sda"
)

# Check for dangerous commands
for pattern in "${DANGEROUS[@]}"; do
  if [[ "$COMMAND" == *"$pattern"* ]]; then
    echo "❌ BLOCKED: Dangerous command detected: $pattern"
    exit 1
  fi
done

# Check for production operations
if [[ "$COMMAND" == *"kubectl"* ]] && [[ "$COMMAND" == *"prod"* ]]; then
  echo "⚠️  Production kubectl command detected"
  echo "Command: $COMMAND"
  read -p "Are you sure? (yes/no): " confirm
  if [ "$confirm" != "yes" ]; then
    echo "❌ Command cancelled"
    exit 1
  fi
fi

# Log command for audit
echo "[$(date)] $COMMAND" >> ~/.claude/command-log.txt

# Allow command
exit 0
```

#### **PostToolUse: Auto-format Code**

```javascript
#!/usr/bin/env node
// ~/.claude/hooks/format-on-write.js

const { execSync } = require('child_process');
const fs = require('fs');

// Hook receives JSON via stdin
const input = JSON.parse(fs.readFileSync(0, 'utf-8'));
const filePath = input.path;

// Determine file type and run appropriate formatter
if (filePath.match(/\.(ts|tsx|js|jsx)$/)) {
  try {
    execSync(`prettier --write ${filePath}`, { stdio: 'inherit' });
    execSync(`eslint --fix ${filePath}`, { stdio: 'inherit' });
    console.log(`✅ Formatted: ${filePath}`);
  } catch (error) {
    console.log(`⚠️  Format failed: ${filePath}`);
  }
}

if (filePath.match(/\.py$/)) {
  try {
    execSync(`black ${filePath}`, { stdio: 'inherit' });
    console.log(`✅ Formatted: ${filePath}`);
  } catch (error) {
    console.log(`⚠️  Format failed: ${filePath}`);
  }
}

// Exit successfully
process.exit(0);
```

#### **Stop Hook: Cleanup & Summary**

```bash
#!/bin/bash
# ~/.claude/hooks/cleanup.sh

echo "🧹 Cleaning up session..."

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
  echo "📝 You have uncommitted changes:"
  git status --short
  
  read -p "Would you like to commit them? (yes/no): " commit
  if [ "$commit" = "yes" ]; then
    git add -A
    read -p "Commit message: " message
    git commit -m "$message"
    echo "✅ Changes committed"
  fi
fi

# Generate session summary
echo "📊 Session Summary:"
echo "- Files modified: $(git status --porcelain | wc -l)"
echo "- Time: $(date)"

# Backup important files
if [ -d "temp" ]; then
  rm -rf temp
fi

echo "✨ Session complete!"
```

### **6.5 Hook Error Handling**

Hooks can control execution flow:

```bash
# Exit 0: Continue normally
exit 0

# Exit 1: Block the operation
exit 1

# Exit 2: Show warning but continue
exit 2
```

### **6.6 Real-World Hook Workflows**

#### **Pre-commit Quality Gate**

```json
{
  "hooks": {
    "PreToolUse": {
      "Bash(git commit:*)": "~/.claude/hooks/pre-commit-gate.sh"
    }
  }
}
```

```bash
#!/bin/bash
# ~/.claude/hooks/pre-commit-gate.sh

echo "🔍 Running pre-commit checks..."

# Run tests
npm test -- --passWithNoTests
if [ $? -ne 0 ]; then
  echo "❌ Tests failed. Fix them before committing."
  exit 1
fi

# Run linter
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ Linting failed. Run 'npm run lint:fix'"
  exit 1
fi

# Check for sensitive data
if git diff --cached | grep -E "(API_KEY|SECRET|PASSWORD)" | grep -v ".env.example"; then
  echo "❌ Potential secret detected in staged files!"
  exit 1
fi

echo "✅ All checks passed"
exit 0
```

#### **Auto-deploy on Merge**

```json
{
  "hooks": {
    "PostToolUse": {
      "Bash(git push:* main)": "~/.claude/hooks/post-push-main.sh"
    }
  }
}
```

```bash
#!/bin/bash
# ~/.claude/hooks/post-push-main.sh

echo "🚀 Code pushed to main. Triggering deployment..."

# Trigger GitHub Action
gh workflow run deploy.yml --ref main

echo "✅ Deployment triggered. Check GitHub Actions for status."
```

---

## 7. Headless Mode {#7-headless-mode}

### **7.1 What Is Headless Mode?**

Headless mode runs Claude Code **non-interactively** for:
- CI/CD pipelines
- Automated scripts
- Batch processing
- Code generation workflows

**Key Feature:** No persistent conversation history between runs.

### **7.2 Basic Usage**

```bash
# Single query (print mode)
claude -p "Generate tests for src/api.ts"

# With output format
claude -p "Analyze this codebase" --output-format json

# Continue last conversation
claude -c -p "Fix the failing tests"

# Pipe input
cat logs.txt | claude -p "Analyze errors and suggest fixes"
```

### **7.3 Output Formats**

| Format | Purpose | Example Use Case |
|--------|---------|------------------|
| `text` | Human-readable (default) | Local scripts |
| `json` | Parseable, all metadata | CI/CD with parsing |
| `stream-json` | Real-time streaming | Live progress updates |

#### **Text Output**

```bash
$ claude -p "Count files in src/"

I'll count the files in the src/ directory.

Running: ls -R src/ | grep -E '\.tsx?$' | wc -l

Result: 47

There are 47 TypeScript/TSX files in the src/ directory.
```

#### **JSON Output**

```bash
$ claude -p "Run tests" --output-format json

{
  "conversationId": "conv_xyz789",
  "turns": [
    {
      "role": "user",
      "content": "Run tests"
    },
    {
      "role": "assistant",
      "content": "I'll run the test suite.",
      "toolUse": [
        {
          "tool": "Bash",
          "input": "npm test",
          "output": "PASS  src/api.test.ts\n...",
          "success": true
        }
      ]
    }
  ],
  "outcome": "success",
  "tokensUsed": 1523
}
```

#### **Stream JSON Output**

```bash
$ claude -p "Generate component" --output-format stream-json

{"type":"turn_start","role":"assistant"}
{"type":"content","text":"I'll create a new React component"}
{"type":"tool_use","tool":"Write","path":"src/Button.tsx"}
{"type":"tool_result","success":true}
{"type":"turn_end"}
```

### **7.4 Advanced Headless Patterns**

#### **Piping Data**

```bash
# Analyze log files
cat error.log | claude -p "Identify the root cause of these errors"

# Process CSV data
cat sales.csv | claude -p "Calculate total revenue by month"

# Parse test output
npm test 2>&1 | claude -p "Explain why these tests are failing"
```

#### **Max Turns Limit**

```bash
# Prevent infinite loops
claude -p "Fix all linting errors" --max-turns 5

# Single-turn (no follow-ups)
claude -p "Generate boilerplate" --max-turns 1
```

#### **Model Selection**

```bash
# Use faster model for simple tasks
claude -p "Format this file" --model haiku

# Use most capable model
claude -p "Design system architecture" --model opus
```

### **7.5 CI/CD Integration Examples**

#### **Pre-commit Hook**

```bash
#!/bin/bash
# .git/hooks/pre-commit

echo "Running AI code review..."

# Get staged files
FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(ts|tsx|js|jsx)$')

if [ -z "$FILES" ]; then
  exit 0
fi

# Review with Claude
REVIEW=$(claude -p "Review these files for bugs and security issues: $FILES" \
  --output-format json \
  --max-turns 1)

# Check for issues
ISSUES=$(echo "$REVIEW" | jq -r '.turns[-1].content')

if echo "$ISSUES" | grep -q "CRITICAL\|HIGH"; then
  echo "❌ Critical issues found:"
  echo "$ISSUES"
  exit 1
fi

echo "✅ Code review passed"
exit 0
```

#### **Automated Test Generation**

```bash
#!/bin/bash
# scripts/generate-tests.sh

echo "Generating missing tests..."

# Find files without tests
FILES=$(find src -name "*.ts" -not -name "*.test.ts" -not -name "*.spec.ts")

for FILE in $FILES; do
  TEST_FILE="${FILE%.ts}.test.ts"
  
  if [ ! -f "$TEST_FILE" ]; then
    echo "Generating tests for $FILE..."
    
    claude -p "Generate comprehensive tests for $FILE. Save to $TEST_FILE" \
      --output-format text \
      --max-turns 3
  fi
done

echo "✅ Test generation complete"
```

#### **Documentation Generator**

```bash
#!/bin/bash
# scripts/update-docs.sh

echo "Updating documentation..."

# Generate API docs
claude -p "Generate API documentation from src/api/ in OpenAPI 3.0 format. Save to docs/api.yaml" \
  --output-format text

# Update README
claude -p "Update README.md with latest features from CHANGELOG.md" \
  --output-format text

# Generate component docs
claude -p "Generate Storybook documentation for all components in src/components/" \
  --output-format text

echo "✅ Documentation updated"
```

### **7.6 Error Handling in Scripts**

```bash
#!/bin/bash
set -e  # Exit on error

# Capture output and exit code
OUTPUT=$(claude -p "Run database migrations" --output-format json 2>&1)
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
  echo "❌ Claude failed with exit code $EXIT_CODE"
  echo "$OUTPUT"
  
  # Send alert
  curl -X POST https://hooks.slack.com/... \
    -d "{\"text\": \"Migration failed: $OUTPUT\"}"
  
  exit 1
fi

# Parse JSON output
RESULT=$(echo "$OUTPUT" | jq -r '.outcome')

if [ "$RESULT" != "success" ]; then
  echo "❌ Migration reported failure"
  exit 1
fi

echo "✅ Migrations completed successfully"
```

### **7.7 Headless Best Practices**

| Practice | Why | Example |
|----------|-----|---------|
| **Use `--max-turns`** | Prevent runaway costs | `--max-turns 5` for bounded tasks |
| **Set timeouts** | Avoid hanging | `timeout 5m claude -p "..."` |
| **Validate output** | Catch failures | Parse JSON, check exit codes |
| **Log everything** | Debug issues | `claude -p "..." | tee logs/$(date).log` |
| **Test locally first** | Avoid CI failures | Run scripts manually before automating |

---

## 8. GitHub Actions {#8-github-actions}

### **8.1 Official GitHub Action**

**Action:** `anthropics/claude-code-action@v1`

**Features:**
- React to `@claude` mentions in PRs/issues
- Automated code review
- Bug fixing
- Test generation
- Documentation updates

### **8.2 Setup**

#### **Step 1: Install GitHub App**

```bash
# Run inside your project
claude

> /install-github-app

# Follow prompts to:
# 1. Create GitHub App
# 2. Install app to repository
# 3. Add secrets to repo
```

**Manual Setup Alternative:**

1. Go to GitHub Settings → Developer Settings → GitHub Apps
2. Create new GitHub App:
   - Name: `Claude Code - [Your Repo]`
   - Homepage URL: `https://claude.com/code`
   - Webhook: (leave empty)
   - Permissions:
     - Contents: Read & Write
     - Issues: Read & Write
     - Pull Requests: Read & Write
3. Generate private key (download `.pem` file)
4. Install app to your repository
5. Add secrets to repo:
   - `ANTHROPIC_API_KEY`: Your API key
   - `APP_ID`: GitHub App ID
   - `APP_PRIVATE_KEY`: Contents of `.pem` file

#### **Step 2: Create Workflow**

```yaml
# .github/workflows/claude-review.yml

name: Claude Code Review

on:
  pull_request:
    types: [opened, synchronize]
  issue_comment:
    types: [created]

jobs:
  claude-review:
    runs-on: ubuntu-latest
    
    # Only run on @claude mentions or new PRs
    if: |
      (github.event_name == 'issue_comment' && contains(github.event.comment.body, '@claude')) ||
      github.event_name == 'pull_request'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Claude Code Review
        uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          github_token: ${{ secrets.GITHUB_TOKEN }}
          
          # Optional: custom instructions
          claude_args: |
            --system-prompt "Follow guidelines in CLAUDE.md"
            --max-turns 10
```

### **8.3 Workflow Modes**

#### **Mode 1: Automatic Review on PR**

```yaml
name: Auto Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: |
            Review this PR for:
            - Security vulnerabilities
            - Performance issues
            - Code quality problems
            - Missing tests
            
            Only comment on significant issues. Be concise.
```

#### **Mode 2: On-Demand with @claude**

```yaml
name: Claude on Demand

on:
  issue_comment:
    types: [created]

jobs:
  claude:
    if: contains(github.event.comment.body, '@claude')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          # Claude reads the comment automatically
```

**Usage:**
```markdown
@claude fix the failing tests in this PR

@claude add error handling to the authentication flow

@claude generate tests for the Event API
```

#### **Mode 3: Custom Workflows**

```yaml
name: Generate Tests

on:
  push:
    branches: [main]
    paths:
      - 'src/**/*.ts'
      - '!src/**/*.test.ts'

jobs:
  generate-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Find files without tests
        id: find-files
        run: |
          FILES=$(find src -name "*.ts" -not -name "*.test.ts" | head -5)
          echo "files=$FILES" >> $GITHUB_OUTPUT
      
      - name: Generate tests
        uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: |
            Generate comprehensive tests for these files:
            ${{ steps.find-files.outputs.files }}
            
            Follow the testing patterns in CLAUDE.md.
          
          claude_args: --max-turns 15
      
      - name: Create PR
        run: |
          git config user.name "Claude Bot"
          git config user.email "claude@anthropic.com"
          git checkout -b tests/auto-generated-$(date +%s)
          git add .
          git commit -m "test: Auto-generate tests for new files"
          git push origin HEAD
          gh pr create --title "Auto-generated tests" --body "Generated by Claude Code"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### **8.4 Advanced Patterns**

#### **Security Scanning**

```yaml
name: Security Scan

on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly
  workflow_dispatch:

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: |
            Perform comprehensive security audit:
            
            1. Check for SQL injection vulnerabilities
            2. Verify all API keys are in environment variables
            3. Check authentication/authorization logic
            4. Scan for XSS vulnerabilities
            5. Review RLS policies in Supabase migrations
            6. Check for exposed secrets
            
            Generate a detailed security report.
          
          claude_args: --max-turns 20
      
      - name: Create issue if problems found
        if: failure()
        run: |
          gh issue create \
            --title "Security scan found issues" \
            --body "Claude Code detected security concerns. See workflow run for details." \
            --label security
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

#### **Performance Monitoring**

```yaml
name: Performance Check

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build and analyze
        run: |
          npm run build -- --analyze
          npm run lighthouse
      
      - name: Analyze with Claude
        uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: |
            Analyze the build output and Lighthouse report.
            
            Identify:
            - Bundle size increases
            - Performance regressions
            - Optimization opportunities
            
            Comment on the PR if there are significant issues.
```

#### **Documentation Sync**

```yaml
name: Sync Documentation

on:
  push:
    branches: [main]
    paths:
      - 'src/**/*.ts'
      - 'src/**/*.tsx'

jobs:
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Generate docs
        uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: |
            Update documentation to reflect code changes:
            
            1. Update API docs in docs/api.md
            2. Update component docs for any changed components
            3. Regenerate OpenAPI spec if API routes changed
            4. Update CHANGELOG.md with new features
            
            Use git diff to see what changed.
          
          claude_args: --max-turns 10
      
      - name: Commit docs
        run: |
          if [ -n "$(git status --porcelain)" ]; then
            git config user.name "Claude Bot"
            git config user.email "claude@anthropic.com"
            git add docs/
            git commit -m "docs: Auto-update documentation"
            git push
          fi
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### **8.5 GitHub Actions Best Practices**

| Practice | Implementation | Benefit |
|----------|----------------|---------|
| **Rate Limiting** | `--max-turns 10` | Control API costs |
| **Clear Instructions** | Detailed prompts | Better results |
| **Use CLAUDE.md** | `--system-prompt "Follow CLAUDE.md"` | Consistent behavior |
| **Error Handling** | `if: failure()` | Graceful failures |
| **Concise Output** | `--output-format json` | Parse results |
| **Security** | Secrets management | Protect API keys |

---

## 9. GitLab CI/CD {#9-gitlab-cicd}

### **9.1 GitLab Integration**

Claude Code works in GitLab CI/CD through headless mode. No official GitLab-specific action yet, but easy to integrate.

### **9.2 Basic Setup**

```yaml
# .gitlab-ci.yml

variables:
  ANTHROPIC_API_KEY: $ANTHROPIC_API_KEY  # Set in CI/CD settings

stages:
  - review
  - test
  - deploy

claude-review:
  stage: review
  image: node:20
  before_script:
    - npm install -g @anthropic-ai/claude-code
  script:
    - |
      claude -p "Review this MR for security and quality issues. Be concise." \
        --output-format json \
        --max-turns 5 > review.json
    - cat review.json
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
  artifacts:
    reports:
      codequality: review.json
```

### **9.3 Advanced Workflows**

#### **Automated Testing**

```yaml
generate-tests:
  stage: test
  image: node:20
  before_script:
    - npm install -g @anthropic-ai/claude-code
    - npm ci
  script:
    - |
      # Find files without tests
      FILES=$(find src -name "*.ts" -not -name "*.test.ts")
      
      # Generate tests
      for FILE in $FILES; do
        TEST_FILE="${FILE%.ts}.test.ts"
        if [ ! -f "$TEST_FILE" ]; then
          echo "Generating tests for $FILE..."
          claude -p "Generate tests for $FILE. Save to $TEST_FILE" \
            --max-turns 3
        fi
      done
    
    - npm test
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
```

#### **Security Audit**

```yaml
security-audit:
  stage: review
  image: node:20
  before_script:
    - npm install -g @anthropic-ai/claude-code
  script:
    - |
      claude -p "Perform security audit. Check for:
      - SQL injection
      - XSS vulnerabilities
      - Exposed secrets
      - Weak authentication
      
      Generate JSON report." \
        --output-format json \
        --max-turns 15 > security-report.json
    
    # Check for critical issues
    - |
      CRITICAL=$(jq '.turns[-1].content | select(contains("CRITICAL"))' security-report.json)
      if [ -n "$CRITICAL" ]; then
        echo "Critical security issues found!"
        cat security-report.json
        exit 1
      fi
  artifacts:
    reports:
      sast: security-report.json
```

#### **Auto-fix Issues**

```yaml
auto-fix:
  stage: review
  image: node:20
  before_script:
    - npm install -g @anthropic-ai/claude-code
    - git config user.name "Claude Bot"
    - git config user.email "claude@bot"
  script:
    - |
      # Get linting errors
      npm run lint --  --format json > lint-errors.json || true
      
      # Fix with Claude
      claude -p "Fix the linting errors in lint-errors.json" \
        --max-turns 10
      
      # Commit fixes
      if [ -n "$(git status --porcelain)" ]; then
        git add .
        git commit -m "fix: Auto-fix linting errors"
        git push origin HEAD:$CI_COMMIT_REF_NAME
      fi
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
  when: manual
```

### **9.4 GitLab-Specific Features**

#### **Merge Request Comments**

```yaml
comment-on-mr:
  stage: review
  image: node:20
  before_script:
    - npm install -g @anthropic-ai/claude-code
    - apk add --no-cache curl jq
  script:
    - |
      # Get review from Claude
      REVIEW=$(claude -p "Review this MR. Focus on breaking changes." \
        --output-format json \
        --max-turns 5)
      
      # Extract comment
      COMMENT=$(echo "$REVIEW" | jq -r '.turns[-1].content')
      
      # Post to MR
      curl --request POST \
        --header "PRIVATE-TOKEN: $GITLAB_TOKEN" \
        --header "Content-Type: application/json" \
        --data "{\"body\": \"$COMMENT\"}" \
        "$CI_API_V4_URL/projects/$CI_PROJECT_ID/merge_requests/$CI_MERGE_REQUEST_IID/notes"
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
```

### **9.5 Performance Optimization**

```yaml
# Cache Claude Code installation
.claude-cache:
  cache:
    key: claude-code
    paths:
      - .npm/
  before_script:
    - npm config set cache .npm --global
    - npm install -g @anthropic-ai/claude-code

# Use in jobs
my-job:
  extends: .claude-cache
  script:
    - claude -p "..."
```

---

## 10. Model Context Protocol (MCP) {#10-mcp}

### **10.1 What Is MCP?**

MCP (Model Context Protocol) connects Claude Code to external tools and services through a **standardized protocol**.

**Benefits:**
- ✅ Access live data (GitHub issues, Sentry errors, Stripe payments)
- ✅ Reduce context window usage (fetch on-demand)
- ✅ Team-shareable tool configurations
- ✅ Extensible (build custom MCP servers)

### **10.2 MCP Architecture**

```
┌─────────────────┐
│   Claude Code   │
└────────┬────────┘
         │ JSON-RPC
         ↓
┌─────────────────┐
│  MCP Client     │
└────────┬────────┘
         │ HTTP/STDIO
         ↓
┌─────────────────┐
│  MCP Servers    │ ← GitHub, Sentry, Stripe, Custom
└─────────────────┘
```

### **10.3 Available MCP Servers**

| Server | Type | Purpose | URL |
|--------|------|---------|-----|
| **GitHub** | HTTP | Issues, PRs, repos | `https://api.githubcopilot.com/mcp/` |
| **Sentry** | HTTP | Error tracking | `https://mcp.sentry.dev/mcp` |
| **Stripe** | HTTP | Payment data | `https://mcp.stripe.com` |
| **Notion** | HTTP | Documentation | `https://mcp.notion.com/mcp` |
| **Linear** | SSE | Issue tracking | `https://mcp.linear.app/sse` |
| **Slack** | HTTP | Messages, channels | Custom |
| **Postgres** | STDIO | Database queries | `@modelcontextprotocol/server-postgres` |
| **Puppeteer** | STDIO | Web scraping | `@modelcontextprotocol/server-puppeteer` |

### **10.4 Adding MCP Servers**

#### **Method 1: CLI Command**

```bash
# Add HTTP server
claude mcp add --transport http github https://api.githubcopilot.com/mcp/

# Add with environment variables
claude mcp add sentry \
  --transport http \
  --env SENTRY_AUTH_TOKEN=your-token \
  -- https://mcp.sentry.dev/mcp

# Add STDIO server (local)
claude mcp add postgres \
  --env DATABASE_URL="postgresql://..." \
  -- npx -y @modelcontextprotocol/server-postgres

# List servers
claude mcp list

# Remove server
claude mcp remove github
```

#### **Method 2: Edit `.mcp.json`**

```json
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    },
    "sentry": {
      "type": "http",
      "url": "https://mcp.sentry.dev/mcp",
      "env": {
        "SENTRY_AUTH_TOKEN": "${SENTRY_AUTH_TOKEN}"
      }
    },
    "stripe": {
      "type": "http",
      "url": "https://mcp.stripe.com",
      "headers": {
        "Authorization": "Bearer ${STRIPE_SECRET_KEY}"
      }
    },
    "postgres": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "${DATABASE_URL}"
      }
    },
    "puppeteer": {
      "type": "stdio",
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "-e", "DOCKER_CONTAINER=true",
        "mcp/puppeteer"
      ]
    }
  }
}
```

### **10.5 Using MCP in Claude Code**

#### **Discover Resources**

```bash
claude

# Type @ to see all available resources
> @

# Shows:
# Files:
#   @src/api.ts
#   @docs/architecture.md
#
# MCP Resources:
#   @github:issue/123
#   @github:pr/456
#   @sentry:error/abc123
#   @stripe:payment/pi_xyz
```

#### **Reference MCP Resources**

```bash
# GitHub issues
> @github:issue/123
> Analyze this issue and create a fix

# Sentry errors
> @sentry:error/latest
> Investigate the root cause of this error

# Stripe payments
> @stripe:payment/pi_123
> Check if this payment succeeded and update the order status

# Database queries
> @postgres
> SELECT * FROM events WHERE status = 'published'
> Analyze the query performance
```

#### **MCP Tools**

```bash
# Use MCP tools explicitly
> Use the GitHub MCP tool to create an issue for the bug we just found

> Use Sentry MCP to fetch all errors from the last 24 hours

> Use Puppeteer to take a screenshot of https://myapp.com/events/123
```

### **10.6 Custom MCP Server Example**

**Scenario:** Create MCP server for Supabase analytics

```typescript
// mcp-supabase-analytics/index.ts

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const server = new Server(
  {
    name: 'supabase-analytics',
    version: '1.0.0',
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

// Define tools
server.setRequestHandler('tools/list', async () => ({
  tools: [
    {
      name: 'get_event_analytics',
      description: 'Get analytics for events',
      inputSchema: {
        type: 'object',
        properties: {
          dateRange: {
            type: 'string',
            description: 'Date range (7d, 30d, 90d)',
          },
        },
      },
    },
    {
      name: 'get_revenue_breakdown',
      description: 'Get revenue breakdown by ticket tier',
      inputSchema: {
        type: 'object',
        properties: {
          eventId: { type: 'string' },
        },
      },
    },
  ],
}));

// Implement tool handlers
server.setRequestHandler('tools/call', async (request) => {
  if (request.params.name === 'get_event_analytics') {
    const { dateRange } = request.params.arguments as { dateRange: string };
    
    const { data, error } = await supabase
      .from('events')
      .select('*, orders(count)')
      .gte('created_at', getDateRange(dateRange));
    
    if (error) throw error;
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }
  
  throw new Error('Unknown tool');
});

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);

function getDateRange(range: string): string {
  const days = parseInt(range);
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}
```

**Add to `.mcp.json`:**

```json
{
  "mcpServers": {
    "supabase-analytics": {
      "type": "stdio",
      "command": "node",
      "args": ["./mcp-supabase-analytics/index.js"],
      "env": {
        "SUPABASE_URL": "${SUPABASE_URL}",
        "SUPABASE_SERVICE_KEY": "${SUPABASE_SERVICE_KEY}"
      }
    }
  }
}
```

**Usage:**

```bash
claude

> Use Supabase analytics to get event analytics for the last 30 days
> Which events have the highest revenue?
```

### **10.7 MCP Best Practices**

| Practice | Reason | Implementation |
|----------|--------|----------------|
| **Prefer HTTP** | SSE deprecated | Use HTTP transport |
| **Environment Variables** | Security | Never hardcode keys |
| **Check into Git** | Team sharing | `.mcp.json` |
| **OAuth When Possible** | Better UX | Use `/mcp` auth flow |
| **Test Locally** | Catch errors | `claude --mcp-debug` |

### **10.8 MCP Debugging**

```bash
# Enable MCP debug mode
claude --mcp-debug

# Shows:
# - MCP server connections
# - Request/response logs
# - Error details

# Test MCP server standalone
npx @modelcontextprotocol/inspector \
  npx -y @modelcontextprotocol/server-postgres
```

---

## 11. Claude Agent SDK {#11-claude-agent-sdk}

### **11.1 What Is the Claude Agent SDK?**

The **Claude Agent SDK** (formerly "Claude Code SDK") is the underlying framework that powers Claude Code. It enables building **custom AI agents** beyond coding.

**Use Cases:**
- Research agents
- Customer support bots
- Data analysis pipelines
- Content generation systems
- Workflow automation

### **11.2 SDK Architecture**

```
┌─────────────────────────────────────┐
│         Your Application            │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│      Claude Agent SDK               │
│  ┌─────────────────────────────┐   │
│  │  Agent Loop                 │   │
│  │  - Tool execution           │   │
│  │  - Context management       │   │
│  │  - Error handling           │   │
│  └─────────────────────────────┘   │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│      Anthropic API (Claude)         │
└─────────────────────────────────────┘
```

### **11.3 Available SDKs**

| Language | Repository | Status |
|----------|-----------|--------|
| **Python** | `anthropics/claude-agent-sdk-python` | ✅ Stable |
| **TypeScript** | `anthropics/claude-agent-sdk-typescript` | ✅ Stable |

### **11.4 Core Features**

#### **Agentic Loop**

The SDK handles the agent execution loop:

1. **Prompt** → Claude
2. **Tool Use** ← Claude requests tool
3. **Execute Tool** → Your code
4. **Tool Result** → Claude
5. **Repeat** until task complete

#### **Context Management**

- **Automatic compaction** when context limit approached
- **Conversation persistence**
- **Resume from checkpoints**

#### **Tool System**

- **Define tools** Claude can use
- **Automatic validation**
- **Error handling**

### **11.5 Python SDK Example**

```python
# example_agent.py

from anthropic import Anthropic
from claude_agent_sdk import Agent, tool

# Define tools
@tool
def search_database(query: str) -> str:
    """Search the events database"""
    # Your database search logic
    results = db.query(f"SELECT * FROM events WHERE name LIKE '%{query}%'")
    return str(results)

@tool
def create_event(name: str, date: str, venue: str) -> dict:
    """Create a new event"""
    event = db.insert('events', {
        'name': name,
        'date': date,
        'venue': venue,
        'status': 'draft'
    })
    return event

@tool
def send_email(to: str, subject: str, body: str) -> bool:
    """Send an email notification"""
    # Your email sending logic
    email_service.send(to=to, subject=subject, body=body)
    return True

# Create agent
client = Anthropic(api_key="your-api-key")
agent = Agent(
    client=client,
    model="claude-sonnet-4-5",
    tools=[search_database, create_event, send_email],
    system_prompt="""You are an event management assistant.
    
    Help users create and manage fashion events. Follow these rules:
    - Always validate event dates are in the future
    - Require venue information before creating events
    - Send confirmation emails after event creation
    - Search database before creating to avoid duplicates
    """
)

# Run agent
response = agent.run(
    "Create a fashion show called 'Paris Spring Collection' on March 15, 2026 at Le Grand Palais. Email organizer@fashion.com when done."
)

print(response)

# Agent will:
# 1. Validate the date
# 2. Create the event using create_event tool
# 3. Send email using send_email tool
# 4. Respond with confirmation
```

### **11.6 TypeScript SDK Example**

```typescript
// example-agent.ts

import Anthropic from '@anthropic-ai/sdk';
import { Agent, tool } from '@anthropic-ai/agent-sdk';

// Define tools
const searchDatabase = tool({
  name: 'search_database',
  description: 'Search the events database',
  parameters: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Search query' },
    },
    required: ['query'],
  },
  handler: async ({ query }: { query: string }) => {
    // Your database search logic
    const results = await db.query(
      `SELECT * FROM events WHERE name ILIKE $1`,
      [`%${query}%`]
    );
    return JSON.stringify(results);
  },
});

const createEvent = tool({
  name: 'create_event',
  description: 'Create a new event',
  parameters: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      date: { type: 'string', format: 'date' },
      venue: { type: 'string' },
    },
    required: ['name', 'date', 'venue'],
  },
  handler: async ({ name, date, venue }) => {
    const event = await db.insert('events', {
      name,
      date,
      venue,
      status: 'draft',
    });
    return event;
  },
});

// Create agent
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const agent = new Agent({
  client,
  model: 'claude-sonnet-4-5',
  tools: [searchDatabase, createEvent],
  systemPrompt: `You are an event management assistant...`,
});

// Run agent
const response = await agent.run(
  "Find all events in Paris and create a new one called 'Fashion Week 2026'"
);

console.log(response);
```

### **11.7 Advanced SDK Features**

#### **Streaming Responses**

```python
# Python
async for chunk in agent.stream("Create an event..."):
    print(chunk, end='', flush=True)
```

```typescript
// TypeScript
for await (const chunk of agent.stream("Create an event...")) {
  process.stdout.write(chunk);
}
```

#### **Conversation Persistence**

```python
# Save conversation
agent.save_conversation('event-creation-123.json')

# Resume later
agent = Agent.load_conversation('event-creation-123.json')
agent.run("Continue where we left off")
```

#### **Context Compaction**

```python
agent = Agent(
    client=client,
    model="claude-sonnet-4-5",
    tools=[...],
    # Auto-compact when reaching 80% of context
    compact_threshold=0.8,
    # Custom compaction instructions
    compact_prompt="Summarize conversation, keep event details"
)
```

### **11.8 Real-World SDK Use Case: Research Agent**

```python
# research_agent.py

from anthropic import Anthropic
from claude_agent_sdk import Agent, tool
import requests

@tool
def web_search(query: str) -> str:
    """Search the web using Brave Search API"""
    response = requests.get(
        "https://api.search.brave.com/res/v1/web/search",
        headers={"X-Subscription-Token": BRAVE_API_KEY},
        params={"q": query}
    )
    return str(response.json()['web']['results'][:5])

@tool
def fetch_url(url: str) -> str:
    """Fetch full content from a URL"""
    response = requests.get(url)
    return response.text[:10000]  # First 10k chars

@tool
def save_findings(title: str, content: str) -> bool:
    """Save research findings to a file"""
    with open(f'research/{title}.md', 'w') as f:
        f.write(content)
    return True

# Create research agent
client = Anthropic(api_key="your-api-key")
agent = Agent(
    client=client,
    model="claude-sonnet-4-5",
    tools=[web_search, fetch_url, save_findings],
    system_prompt="""You are a research assistant.
    
    For each research query:
    1. Search the web for relevant sources
    2. Fetch and analyze the top 3-5 sources
    3. Synthesize findings into a comprehensive report
    4. Save the report with a descriptive title
    
    Always cite sources and be objective."""
)

# Run research task
agent.run("""
Research the impact of AI on fashion industry in 2025.
Focus on:
- AI-generated designs
- Virtual fashion shows
- Personalization algorithms
- Sustainability implications

Provide a comprehensive 2000-word report with citations.
""")

# Agent will:
# 1. Search web multiple times
# 2. Fetch relevant articles
# 3. Analyze and synthesize
# 4. Save report
```

### **11.9 SDK vs Claude Code**

| Feature | Claude Code | Agent SDK |
|---------|-------------|-----------|
| **Purpose** | Coding assistant | Custom agents |
| **Built-in Tools** | File system, bash, git | None (you define) |
| **Interface** | CLI (interactive/headless) | Library (programmatic) |
| **Context** | Code files, git history | Your data sources |
| **Best For** | Software development | Any AI workflow |

---

## 12. Real-World Use Cases {#12-real-world-use-cases}

### **12.1 Use Case Matrix**

| Scenario | Tools Used | Implementation | Time Saved |
|----------|------------|----------------|------------|
| **New Feature Development** | Claude Code + TDD + Subagents | Write tests → Implement → Deploy | 60-70% |
| **Bug Fixing** | Claude Code + Sentry MCP + GitHub | Analyze error → Fix → PR | 50-60% |
| **Code Review** | GitHub Actions + Headless | Auto-review on PR | 80% |
| **Documentation** | Hooks + Headless | Auto-generate on push | 90% |
| **Security Audit** | Custom Subagent + Hooks | Weekly scan + report | 75% |
| **Test Generation** | Claude Code + TDD | Generate missing tests | 85% |
| **Refactoring** | Plan Mode + Subagents | Safe large-scale changes | 70% |
| **Research** | Agent SDK + MCP | Gather & synthesize info | 80% |

### **12.2 Complete Workflows**

#### **Workflow 1: Building a New Feature**

**Scenario:** Add "Event Waitlist" feature to FashionOS

```bash
# === Day 1: Planning & Design ===
claude

# Explore existing code
> @src/features/events/
> Show me how event creation works

# Design with AI assistance
> ultrathink about implementing an event waitlist feature
> Requirements:
> - Users can join waitlist when event is full
> - Automatic notifications when spots open
> - Priority queue based on join time
> - Admin dashboard to manage waitlist
>
> Consider:
> - Database schema (Supabase with RLS)
> - API design (REST)
> - Real-time updates (Supabase subscriptions)
> - Email notifications (Resend)
> - UI/UX (shadcn components)

# Use API designer subagent
> /agents use api-designer
> Design the Waitlist API endpoints

# Use DB expert subagent
> /agents use db-expert
> Design the database schema for waitlists

# === Day 2: Implementation (TDD) ===

# Step 1: Generate tests
> /test-feature Waitlist
# Creates: tests/features/waitlist.test.ts

# Step 2: Enter Plan Mode
> [Shift+Tab]

# Step 3: Implement feature
> Implement the Waitlist feature to pass all tests
> Follow the design from yesterday
> Include:
> - Database migration
> - API routes
> - React components
> - Email notifications

# Review plan, then apply

# Step 4: Run tests
> Run npm test
# Fix any failures iteratively

# === Day 3: Integration & Polish ===

# Security audit
> /security-audit
> Focus on Waitlist feature

# Performance check
> Analyze database query performance for waitlist operations
> Add indexes if needed

# Documentation
> Generate documentation for the Waitlist API
> Update CHANGELOG.md

# Create PR
> /pr Create PR for Waitlist feature
> Include:
> - Feature description
> - API documentation
> - Database migration notes
> - Testing instructions

# === Result ===
# ✅ Feature complete in 3 days (vs 7-10 days manual)
# ✅ 95% test coverage
# ✅ Security audited
# ✅ Documented
```

#### **Workflow 2: Production Incident Response**

**Scenario:** Stripe webhooks failing in production

```bash
# === Minute 0: Alert received ===

claude -c  # Continue last session

# Check Sentry for errors
> @sentry:project/fashionos
> Show errors from the last hour

# Review relevant code
> @src/api/webhooks/stripe.ts
> Analyze the webhook handler

# Check Stripe logs
> @stripe:webhook/latest-failures
> Show recent webhook failures

# === Minute 5: Diagnosis ===

# Investigate with subagent
> think harder about why Stripe webhooks are failing
> Based on Sentry errors and Stripe logs, what's the root cause?

# === Minute 10: Fix ===

# Generate fix
> Fix the webhook signature validation issue
> Ensure backward compatibility

# Run tests
> Run npm test -- webhooks
> Fix any failures

# === Minute 15: Deploy ===

# Create hotfix PR
> git checkout -b hotfix/stripe-webhooks
> git add src/api/webhooks/stripe.ts
> Generate commit message for this fix
> git commit -m "[generated message]"
> git push origin hotfix/stripe-webhooks

# Create PR
> gh pr create --title "hotfix: Fix Stripe webhook signature validation" \
>   --body "Fixes webhook failures caused by signature mismatch"

# === Minute 20: Verify ===

# Monitor deployment
> @sentry:project/fashionos
> Check if errors stopped after deploy

# Verify in Stripe
> @stripe:webhook/recent
> Confirm webhooks succeeding now

# === Result ===
# ✅ Incident resolved in 20 minutes (vs 2-3 hours manual)
# ✅ Root cause identified
# ✅ Fix deployed
# ✅ Verified working
```

#### **Workflow 3: Onboarding New Developer**

**Scenario:** New developer joins team, needs to understand codebase

```bash
# === Week 1: Codebase Understanding ===

claude

# Get high-level overview
> Read CLAUDE.md and give me a comprehensive overview of this project

# Understand architecture
> @ARCHITECTURE.md
> Explain the system architecture. What are the main components?

# Understand data flow
> Trace the flow of creating an event from user click to database insert
> Include: frontend, API, validation, database, notifications

# Find examples
> Show me example of a well-implemented feature I can learn from

# === Week 2: First Contribution ===

# Find beginner-friendly task
> @github:issues
> Find issues labeled "good-first-issue"

# Work on task with guidance
> @github:issue/234
> Help me implement this feature step-by-step
> Explain why we're doing each step

# Learn testing patterns
> Show me how to write tests for this feature
> Explain the testing philosophy in CLAUDE.md

# === Result ===
# ✅ New developer productive in days (vs weeks manual)
# ✅ Understands architecture deeply
# ✅ First PR merged
# ✅ Learned best practices
```

### **12.3 Anthropic Internal Use Cases**

**From official case studies:**

#### **Data Infrastructure Team**

**Before:** New data scientists spent weeks learning the codebase
**After with Claude Code:**
- Read CLAUDE.md files automatically
- Identify relevant data pipeline files
- Explain dependencies
- Trace upstream data sources
- **Result:** 80% reduction in ramp-up time

#### **Product Engineering Team**

**Use:** "First stop" for any programming task
- Identify files to examine for bug fixes
- Suggest approaches for new features
- Generate boilerplate code
- **Result:** Used for 100% of development tasks

#### **Security Engineering Team**

**Before:** "Design doc → janky code → refactor → give up on tests"
**After:**
- Get pseudocode from Claude
- Guide through TDD
- Produce testable code
- **Result:** More reliable, maintainable code

### **12.4 Advanced Automation Examples**

#### **Automated Dependency Updates**

```yaml
# .github/workflows/dependency-updates.yml

name: Dependency Updates

on:
  schedule:
    - cron: '0 0 * * 1'  # Weekly on Monday
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Check for updates
        run: npm outdated > outdated.txt || true
      
      - name: Analyze with Claude
        uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: |
            Review outdated dependencies in outdated.txt
            
            For each:
            1. Check CHANGELOG for breaking changes
            2. Assess risk (major/minor/patch)
            3. Update package.json if safe
            4. Update code if breaking changes
            5. Run tests
            
            Create PR with changes and migration notes.
```

#### **Intelligent Log Analysis**

```bash
#!/bin/bash
# scripts/analyze-logs.sh

# Get last 1000 lines of logs
kubectl logs deployment/api --tail 1000 > logs.txt

# Analyze with Claude
claude -p "Analyze these production logs. Identify:
1. Error patterns
2. Performance issues
3. Unusual behavior
4. Recommendations

Prioritize by severity." --output-format json > analysis.json

# Extract critical issues
CRITICAL=$(jq -r '.turns[-1].content | select(contains("CRITICAL"))' analysis.json)

if [ -n "$CRITICAL" ]; then
  # Send to Slack
  curl -X POST $SLACK_WEBHOOK \
    -d "{\"text\": \"🚨 Critical issues in production logs:\n$CRITICAL\"}"
fi
```

#### **Automated Code Migration**

```bash
claude

# Migrate from Redux to Zustand
> Migrate state management from Redux to Zustand
> Process:
> 1. Analyze current Redux usage (actions, reducers, selectors)
> 2. Create equivalent Zustand stores
> 3. Update components to use Zustand hooks
> 4. Remove Redux dependencies
> 5. Update tests
>
> Use Plan Mode to show all changes before applying
```

---

## 13. Complete Implementation Workflow {#13-complete-workflow}

### **13.1 Day-by-Day Implementation Plan**

#### **Day 1: Foundation**

| Task | Duration | Commands/Files |
|------|----------|----------------|
| Install Claude Code | 5 min | `npm install -g @anthropic-ai/claude-code` |
| Setup authentication | 5 min | `claude` → `/login` |
| Create project structure | 10 min | `.claude/`, `CLAUDE.md`, `.mcp.json` |
| Configure settings | 15 min | `.claude/settings.json` |
| Add MCP servers | 15 min | `claude mcp add ...` |
| Write CLAUDE.md | 30 min | Project guide, rules, commands |
| Test setup | 10 min | `claude` → `/doctor` |

**Deliverables:**
- ✅ Claude Code installed and authenticated
- ✅ Project configured with settings
- ✅ CLAUDE.md written
- ✅ MCP servers connected

---

#### **Day 2: Development Workflow**

| Task | Duration | Focus |
|------|----------|-------|
| Create custom slash commands | 30 min | `/test-feature`, `/security-audit` |
| Create custom subagents | 45 min | `db-expert`, `api-designer` |
| Setup hooks | 45 min | Pre-commit, post-write, cleanup |
| Practice TDD workflow | 60 min | Test → Implement → Commit |
| Practice Plan Mode | 30 min | Preview changes before applying |

**Deliverables:**
- ✅ 3-5 custom slash commands
- ✅ 2-3 custom subagents
- ✅ Hooks configured and tested
- ✅ Team familiar with workflows

---

#### **Day 3: CI/CD Integration**

| Task | Duration | Focus |
|------|----------|-------|
| Setup GitHub Actions | 45 min | Auto-review, security scan |
| Configure GitLab CI (if using) | 45 min | Headless mode pipelines |
| Test automated workflows | 30 min | Create test PR, verify actions |
| Setup monitoring | 30 min | Sentry MCP, log analysis |

**Deliverables:**
- ✅ GitHub Actions configured
- ✅ Automated reviews working
- ✅ Security scanning enabled
- ✅ Monitoring integrated

---

#### **Day 4: Advanced Features**

| Task | Duration | Focus |
|------|----------|-------|
| Build custom MCP server | 90 min | Project-specific analytics |
| Advanced subagent workflows | 60 min | Multi-agent collaboration |
| Optimize performance | 30 min | Caching, rate limiting |

**Deliverables:**
- ✅ Custom MCP server deployed
- ✅ Advanced workflows documented
- ✅ Performance optimized

---

#### **Day 5: Team Training & Docs**

| Task | Duration | Focus |
|------|----------|-------|
| Team training session | 120 min | Live demo, Q&A |
| Create internal documentation | 60 min | Wiki, playbooks |
| Define team standards | 30 min | Commit conventions, review process |

**Deliverables:**
- ✅ Team trained
- ✅ Documentation complete
- ✅ Standards defined

---

### **13.2 Success Metrics**

**Week 1 Goals:**

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Features shipped | 2-3 | Compare to baseline |
| Development time | -40% | Track time per feature |
| Code review time | -60% | Measure PR review duration |
| Bug fix time | -50% | Incident response metrics |
| Test coverage | 85%+ | `npm run test:coverage` |
| Team satisfaction | 8/10 | Survey |

**Month 1 Goals:**

| Metric | Target | Status |
|--------|--------|--------|
| Active users | 100% of dev team | Track usage |
| Automated reviews | 90%+ of PRs | GitHub Actions logs |
| Security scans | Weekly | Scheduled workflow |
| Documentation | 100% API coverage | Auto-generated docs |
| Cost per developer | <$50/month | API usage tracking |

---

### **13.3 Troubleshooting Guide**

| Issue | Cause | Solution |
|-------|-------|----------|
| "Connection failed" | Wrong API key | Check `.env` or `/login` again |
| "Tool not found" | MCP server down | `claude mcp list`, restart server |
| "Context limit reached" | Too many files | Use `/compact` or `.claudeignore` |
| "Permission denied" | Settings incorrect | Check `permissions` in `settings.json` |
| "Slow responses" | Model selection | Use `--model haiku` for simple tasks |
| "GitHub Action fails" | Missing secrets | Verify `ANTHROPIC_API_KEY` in repo secrets |

---

### **13.4 Cost Optimization**

**Strategies:**

1. **Use appropriate models:**
   - Haiku: Simple tasks, formatting
   - Sonnet: Most development work
   - Opus: Complex architecture decisions

2. **Limit max turns:**
   ```bash
   claude -p "..." --max-turns 5
   ```

3. **Optimize context:**
   - Use `.claudeignore` for large files
   - Compact frequently: `/compact`
   - Reference specific files, not directories

4. **Cache aggressively:**
   - Use prompt caching for CLAUDE.md
   - Reuse sessions: `claude -c`

5. **Monitor usage:**
   ```bash
   claude /cost  # Check token usage
   ```

**Expected Costs:**

| Usage Level | Monthly Cost | Use Case |
|-------------|--------------|----------|
| Light | $10-20 | Personal projects |
| Medium | $30-50 | Small team (3-5 devs) |
| Heavy | $100-200 | Full team (10+ devs) |
| Enterprise | Custom | High-volume automation |

---

### **13.5 Final Checklist**

```markdown
## Pre-Launch Checklist

### Configuration
- [ ] Claude Code installed globally
- [ ] Authentication configured
- [ ] Project settings in `.claude/settings.json`
- [ ] CLAUDE.md written and comprehensive
- [ ] MCP servers added to `.mcp.json`
- [ ] Hooks configured for automation
- [ ] Custom slash commands created
- [ ] Custom subagents created

### CI/CD
- [ ] GitHub Actions workflow created
- [ ] Secrets configured in repository
- [ ] Test workflow on dummy PR
- [ ] Security scanning enabled
- [ ] Documentation generation automated

### Team
- [ ] Training session completed
- [ ] Internal documentation published
- [ ] Standards and conventions defined
- [ ] Feedback mechanism established
- [ ] Support channel created (Slack/Discord)

### Monitoring
- [ ] Usage tracking enabled
- [ ] Cost monitoring configured
- [ ] Error tracking integrated (Sentry)
- [ ] Performance metrics defined
- [ ] Success criteria documented

### Security
- [ ] API keys in environment variables
- [ ] `.env` files in `.gitignore`
- [ ] Permissions configured (deny sensitive files)
- [ ] Security scanning automated
- [ ] Incident response plan documented
```

---

## 🎯 **Summary**

This plan provides a **complete, production-ready implementation** of Claude Code for web application development, including:

✅ **All official features:** Build, Subagents, Plugins, Hooks, MCP, GitHub Actions, GitLab CI/CD  
✅ **Real-world examples:** Actual code, workflows, and use cases  
✅ **Team-ready:** Training, documentation, standards  
✅ **Cost-optimized:** Best practices for efficiency  
✅ **Security-first:** Proper configuration, permissions, auditing  
✅ **Measurable:** Success metrics and tracking  

**Estimated Timeline:** 5 days from zero to full team adoption  
**Estimated ROI:** 50-70% reduction in development time  
**Estimated Cost:** $30-50/month per developer