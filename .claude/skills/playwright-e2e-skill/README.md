# Playwright E2E Testing Skill

## Purpose
Automates end-to-end browser testing for EventOS using Playwright MCP (Model Context Protocol). Tests critical user journeys, validates Supabase RLS policies, and monitors application behavior.

## When to Use
- After deployments (smoke tests)
- Validating user flows (booking, event creation, dashboard)
- Debugging production issues
- Verifying RLS policies and permissions
- Testing responsive layouts
- Accessibility testing
- Network request monitoring

## Usage
In Claude Code CLI:
```bash
/skill playwright-e2e-skill
```

Then describe what you want to test (e.g., "Run smoke test", "Test event booking flow").

## What It Tests
- **User Flows**: Authentication, event creation, booking, dashboard navigation
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation
- **Network**: Supabase queries, API calls, error responses
- **Responsive**: Mobile, tablet, desktop layouts
- **Security**: RLS policy enforcement, auth boundaries

## Test Playbooks Included
- `AUTH.txt`: Authentication flows (login, signup, logout)
- `SMOKE.txt`: Critical path smoke tests
- `PITCH_DECK_WIZARD.txt`: Multi-step wizard testing

## Resources Included
- `agent.config.json`: Playwright agent configuration
- `FEATURES.md`: Detailed capability documentation
- `skill-handler.ts`: Integration handler
- `RUNBOOK.md`: Test execution guide

## Output
- Screenshots on failure
- Console error logs
- Network request/response details
- Step-by-step execution trace
- Pass/fail summary

## Maintenance
- Last updated: 2025-10-19
- Compatible with: Playwright MCP latest, Chrome, Firefox, Safari
- Recommended for: EventOS web application testing

## Related Skills

- **frontend-dashboard**: For testing dashboard components and functionality
- **supabase-react-best-practices**: For testing Supabase integration patterns


## Related Skills

- **frontend-dashboard**: For testing dashboard components and functionality
- **supabase-react-best-practices**: For testing Supabase integration patterns

