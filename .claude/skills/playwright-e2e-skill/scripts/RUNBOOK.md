# Playwright E2E Skill Runbook

**Complete guide for local setup, testing, and CI/CD integration**

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Setup](#local-setup)
3. [Running Tests Locally](#running-tests-locally)
4. [CI/CD Integration](#cicd-integration)
5. [Troubleshooting](#troubleshooting)
6. [Advanced Usage](#advanced-usage)
7. [Best Practices](#best-practices)

---

## Prerequisites

### Required Software

```bash
# Node.js 18+ and npm 9+
node --version  # v18.0.0 or higher
npm --version   # 9.0.0 or higher

# Git (for version control)
git --version

# Claude Code (for skill execution)
claude --version
```

### Required Environment Variables

Create `.env` file in project root:

```bash
# Required
PLAYWRIGHT_BASE_URL=https://event-studio-rho.vercel.app

# Optional (defaults shown)
PLAYWRIGHT_BROWSER=chromium
PLAYWRIGHT_HEADLESS=true
PLAYWRIGHT_TIMEOUT=30000

# For CI/CD
VERCEL_URL=${VERCEL_URL}  # Auto-provided by Vercel
```

---

## Local Setup

### Step 1: Install Playwright MCP

```bash
# Navigate to skill directory
cd .claude/skills/playwright-e2e-skill/scripts

# Install dependencies
npm install

# Install Playwright browsers
npm run install:playwright
```

**Expected output:**
```
Downloading Chromium...
Downloading Firefox...
Downloading WebKit...
✅ Browsers installed successfully
```

### Step 2: Configure MCP Server

Add to `.mcp.json` in project root:

```json
{
  "mcpServers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": ["@playwright/mcp@latest"],
      "env": {
        "PLAYWRIGHT_BROWSER": "chromium",
        "PLAYWRIGHT_HEADLESS": "true"
      }
    }
  }
}
```

### Step 3: Verify Installation

```bash
# Test MCP server connection
claude mcp list

# Should show "playwright" in the list
```

---

## Running Tests Locally

### Quick Start (Smoke Tests)

```bash
# Run smoke tests (2-3 minutes)
npm run test:smoke
```

**Expected output:**
```
[Playwright] Running smoke tests...
✅ TEST 1: Dashboard loads without auth (PASSED)
✅ TEST 2: Navigation works (PASSED)
✅ TEST 3: Event list displays (PASSED)
✅ TEST 4: Forms render (PASSED)

==================================================
  PLAYWRIGHT TEST RESULTS
==================================================
  Total:   4
  Passed:  4 ✅
  Failed:  0 ❌
  Skipped: 0 ⏭️
==================================================
```

### Running All Test Suites

```bash
# Run all tests (smoke + auth + wizard)
npm run test:all

# Or individual suites
npm run test:smoke   # Critical path (P0)
npm run test:auth    # Authentication (P1)
npm run test:wizard  # Multi-step forms (P1)
```

### Interactive Debugging (Headed Mode)

```bash
# Run with browser visible
npm run test:headed

# Or set environment variable
PLAYWRIGHT_HEADLESS=false npm run test:smoke
```

**Use headed mode when:**
- ✅ Debugging test failures
- ✅ Understanding page structure
- ✅ Verifying UI behavior
- ✅ Creating new tests

### Multi-Browser Testing

```bash
# Test in all browsers
npm run test:multi-browser

# Or specific browsers
npm run test:firefox
npm run test:webkit
```

### Responsive Testing

```bash
# Test different viewports
npm run test:responsive

# Tests mobile, tablet, desktop layouts
```

---

## Using the Skill in Claude Code

### Method 1: Via Skill Tool

```bash
# In Claude Code conversation
Skill("playwright-e2e-skill")
```

Claude will load the skill and prompt you to choose a test suite.

### Method 2: Direct Playbook Execution

```bash
# In Claude Code
Skill("playwright-e2e-skill/playbooks/SMOKE.txt")
```

### Method 3: Custom Test Scenario

```typescript
// Ask Claude to run custom tests
"Run Playwright tests to validate the dashboard loads and shows correct stats"

// Claude will:
// 1. Load playwright-e2e-skill
// 2. Navigate to /dashboard
// 3. Take snapshot
// 4. Validate stats display
// 5. Capture screenshot
// 6. Report results
```

---

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/playwright-tests.yml`:

```yaml
name: Playwright E2E Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          cd .claude/skills/playwright-e2e-skill/scripts
          npm install
          npm run install:playwright

      - name: Run smoke tests
        env:
          PLAYWRIGHT_BASE_URL: ${{ secrets.VERCEL_URL }}
          PLAYWRIGHT_HEADLESS: true
        run: |
          cd .claude/skills/playwright-e2e-skill/scripts
          npm run test:smoke

      - name: Upload screenshots on failure
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-screenshots
          path: test-results/screenshots

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-results
          path: test-results
```

### Vercel Deploy Hook

Add to `vercel.json`:

```json
{
  "build": {
    "env": {
      "VITE_DISABLE_AUTH": "true"
    }
  },
  "hooks": {
    "post-deploy": "npm run test:ci"
  }
}
```

Or manually trigger after deploy:

```bash
# After Vercel deployment
vercel deploy --prod

# Get deployment URL
export VERCEL_URL=$(vercel ls --limit 1 --json | jq -r '.[0].url')

# Run tests against new deployment
PLAYWRIGHT_BASE_URL=https://$VERCEL_URL npm run test:smoke
```

---

## Troubleshooting

### Issue: Browser Not Installed

**Error:**
```
Error: Executable doesn't exist at /home/user/.cache/ms-playwright/chromium-1234/chrome-linux/chrome
```

**Solution:**
```bash
npm run install:playwright
```

---

### Issue: MCP Server Not Responding

**Error:**
```
Error: MCP server 'playwright' not responding
```

**Solution:**
```bash
# Check MCP configuration
cat .mcp.json | grep playwright

# Restart MCP server
claude mcp restart playwright
```

---

### Issue: Element Not Found

**Error:**
```
Error: Element with ref "btn-submit" not found
```

**Solution:**
```bash
# Take snapshot first to see available elements
browser_snapshot()

# Look for correct ref in snapshot output
# Update test with correct ref from snapshot
```

---

### Issue: Network Timeout

**Error:**
```
Error: Navigation timeout of 30000ms exceeded
```

**Solution:**
```bash
# Increase timeout
PLAYWRIGHT_TIMEOUT=60000 npm run test:smoke

# Or check if site is accessible
curl -I https://event-studio-rho.vercel.app/dashboard
```

---

### Issue: RLS Errors in Dashboard

**Error:**
```
Network request failed: 401 Unauthorized
Table: events, Policy: SELECT denied
```

**Solution:**
```sql
-- Apply RLS migration
-- File: supabase/migrations/20251019000000_allow_public_dashboard_counts.sql

-- Run in Supabase SQL editor:
-- https://supabase.com/dashboard/project/asrzdtpyrdgyggqdfwwl/sql/new
```

---

### Issue: Auth Bypass Not Working

**Error:**
```
Expected dashboard, got login page (/auth)
```

**Solution:**
```bash
# Verify environment variable in Vercel
vercel env ls

# Should show VITE_DISABLE_AUTH=true for all environments
# If missing, add it:
vercel env add VITE_DISABLE_AUTH production
# Enter value: true

# Redeploy
vercel --prod --yes
```

---

## Advanced Usage

### Creating Custom Playbooks

Create new playbook in `playbooks/CUSTOM.txt`:

```
# My Custom Test

NAVIGATE: /my-page

SNAPSHOT: -> Get page structure

FILL: ref="input-field", value="test value"

CLICK: element="Submit button", ref="btn-submit"

WAIT_FOR: "Success message"

SCREENSHOT: custom-test-result.png
```

Run with:
```bash
playwright-skill-runner --playbook playbooks/CUSTOM.txt
```

---

### Programmatic Test Execution

Use the TypeScript handler:

```typescript
import { PlaywrightSkillHandler } from '../resources/skill-handler';

const handler = new PlaywrightSkillHandler({
  baseURL: 'https://event-studio-rho.vercel.app',
  headless: false,
  timeout: 60000
});

await handler.initialize();
const results = await handler.runSmokeTests();
console.log(results);
await handler.cleanup();
```

---

### Network Request Monitoring

Monitor API calls during tests:

```typescript
NAVIGATE: /dashboard

NETWORK_REQUESTS: -> Get all requests since navigation

// Filter for Supabase queries
const supabaseRequests = requests.filter(r =>
  r.url.includes('supabase.co')
);

// Check for auth errors
const authErrors = supabaseRequests.filter(r =>
  r.status === 401 || r.status === 403
);
```

---

### Screenshot Best Practices

```bash
# Capture screenshots at key points
SCREENSHOT: test-start.png         # Initial state
SCREENSHOT: form-filled.png        # After input
SCREENSHOT: submission-result.png  # Final state

# Screenshots saved to: test-results/screenshots/
```

---

## Best Practices

### 1. Always Take Snapshot Before Interacting

```typescript
// ✅ Good
NAVIGATE: /dashboard
SNAPSHOT: -> See what's on page
CLICK: element="Button", ref="btn-submit"

// ❌ Bad
NAVIGATE: /dashboard
CLICK: element="Button", ref="unknown-ref" // May fail
```

### 2. Monitor Network on Auth-Sensitive Pages

```typescript
// ✅ Good
NAVIGATE: /dashboard
NETWORK_REQUESTS: -> Check for RLS errors
VALIDATE: No 401/403 responses

// ❌ Bad
NAVIGATE: /dashboard
WAIT_FOR: "Stats" // May fail silently due to RLS
```

### 3. Fail Fast in Smoke Tests

```typescript
// ✅ Good - Stop on first failure
if (test1.failed) {
  SCREENSHOT: failure-evidence.png
  EXIT: with error
}

// ❌ Bad - Continue after failures
// May waste time on dependent tests
```

### 4. Use Headed Mode for New Tests

```bash
# ✅ Good - See what's happening
PLAYWRIGHT_HEADLESS=false npm run test:new

# ❌ Bad - Hard to debug headless failures
PLAYWRIGHT_HEADLESS=true npm run test:new
```

### 5. Keep Playbooks Focused

```
# ✅ Good - One user journey per playbook
SMOKE.txt → Critical paths only
AUTH.txt → Auth flows only
WIZARD.txt → Multi-step forms only

# ❌ Bad - Everything in one file
ALL_TESTS.txt → 50 different test scenarios
```

---

## Performance Tips

### Parallel Execution (Future)

```bash
# Run test suites in parallel
npm run test:smoke & npm run test:auth & wait
```

### Selective Test Runs

```bash
# Run only P0 smoke tests in CI
npm run test:smoke

# Run full suite before release
npm run test:all
```

### Caching Browsers

```bash
# CI caching (GitHub Actions)
- uses: actions/cache@v4
  with:
    path: ~/.cache/ms-playwright
    key: playwright-${{ runner.os }}-${{ hashFiles('**/package-lock.json') }}
```

---

## Monitoring and Reporting

### Test Results Structure

```
test-results/
├── screenshots/
│   ├── dashboard-loaded.png
│   ├── form-filled.png
│   └── error-state.png
├── network/
│   ├── dashboard-requests.json
│   └── api-calls.json
└── reports/
    ├── smoke-test-report.json
    └── summary.txt
```

### Generate Reports

```bash
# Generate test report
npm run report

# Output: test-results/reports/summary.txt
```

---

## Next Steps

1. ✅ **Set up locally**: Follow [Local Setup](#local-setup)
2. ✅ **Run smoke tests**: `npm run test:smoke`
3. ✅ **Configure CI/CD**: Add GitHub Actions workflow
4. ✅ **Integrate with Vercel**: Add post-deploy hook
5. ✅ **Monitor production**: Run tests after every deployment
6. ✅ **Expand coverage**: Create custom playbooks for new features

---

## Support

**Issues?** Check [Troubleshooting](#troubleshooting) first.

**Questions?**
- 📖 Read [SKILL.md](../SKILL.md) for skill documentation
- 🔍 See [FEATURES.md](../resources/FEATURES.md) for capability reference
- 💬 Ask in project discussions

**Found a bug?** Report in project issues with:
1. Error message
2. Steps to reproduce
3. Screenshots from `test-results/screenshots/`
4. Network logs from `test-results/network/`

---

**Version**: 1.0.0
**Last Updated**: 2025-10-19
**Maintained By**: EventOS Team
