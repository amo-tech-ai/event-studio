# Playwright MCP Features: Core vs Advanced

## Overview
Playwright MCP provides browser automation via the Model Context Protocol using accessibility tree-based interactions (not pixel-based). Official implementation: `@playwright/mcp` by Microsoft.

## Core Features

| Feature | Description | EventOS Example |
|---------|-------------|-----------------|
| **navigate** | Load URLs in browser | Navigate to `/dashboard`, `/events/new` |
| **snapshot** | Capture accessibility tree | Get current page structure for analysis |
| **click** | Click elements by ref | Click "Create Event" button, submit forms |
| **fill** | Fill input fields | Enter event name, date, venue details |
| **type** | Type text slowly (triggers handlers) | Type search query, autocomplete inputs |
| **wait_for** | Wait for text/conditions | Wait for "Event Created" success message |
| **select_option** | Select dropdown values | Choose event category, ticket type |
| **take_screenshot** | Capture visual state | Screenshot error states, success confirmations |

## Advanced Features

| Feature | Description | EventOS Example |
|---------|-------------|-----------------|
| **fill_form** | Fill multiple fields at once | Complete entire event creation form |
| **network_requests** | Monitor API calls | Verify Supabase queries, check RLS policies |
| **console_messages** | Capture browser logs | Debug React errors, track query failures |
| **drag** | Drag-and-drop elements | Reorder event agenda items, sort tables |
| **upload_file** | Upload files | Upload event banner, speaker headshots |
| **evaluate_script** | Run custom JavaScript | Extract computed styles, check state |
| **handle_dialog** | Accept/dismiss alerts | Handle confirmation dialogs, prompts |
| **hover** | Hover over elements | Test tooltip behavior, dropdown menus |
| **resize_page** | Change viewport size | Test responsive dashboard layouts |
| **wait (time)** | Wait for duration | Debounce animations, loading states |

## EventOS-Specific Use Cases

### 1. Event Creation Wizard
**Core flow**: navigate → fill_form → click → wait_for
```
1. Navigate to /events/new
2. Fill form: name, date, venue, capacity
3. Click "Next Step"
4. Wait for "Step 2: Tickets"
5. Screenshot confirmation
```

### 2. Booking Flow Smoke Test
**Core + Advanced**: navigate → network_requests → fill → click → console_messages
```
1. Navigate to /events/123/book
2. Monitor network for Supabase RLS errors
3. Fill ticket quantity, attendee info
4. Click "Complete Booking"
5. Check console for React Query errors
6. Verify "Booking Confirmed" appears
```

### 3. Admin Dashboard Validation
**Advanced**: navigate → snapshot → evaluate_script → network_requests
```
1. Navigate to /dashboard
2. Snapshot accessibility tree
3. Evaluate: document.querySelectorAll('[data-testid="stat-card"]').length
4. Monitor network for count queries (events, orders, tickets)
5. Verify RLS policies allow anon access
```

### 4. Multi-Step Wizard (Pitch Deck Style)
**Core + Advanced**: navigate → fill_form → click → drag → upload_file → screenshot
```
1. Navigate to /events/new/wizard
2. Step 1: Fill basic info
3. Step 2: Drag agenda items to reorder
4. Step 3: Upload event banner
5. Step 4: Review (screenshot for docs)
6. Submit and wait for success
```

## Browser Modes

| Mode | Use Case |
|------|----------|
| **Headless** | CI/CD pipelines, automated tests |
| **Headed** | Local debugging, demo recordings |
| **Persistent Profile** | Test auth state, saved sessions |
| **Device Emulation** | Mobile-first event browsing |

## Comparison: Playwright MCP vs Alternatives

| Capability | Playwright MCP | Puppeteer | Selenium |
|------------|----------------|-----------|----------|
| Accessibility tree | ✅ Native | ❌ No | ❌ No |
| Multi-browser | ✅ Chromium/Firefox/WebKit | ⚠️ Chromium only | ✅ Yes |
| Network interception | ✅ Full | ⚠️ Limited | ❌ No |
| Auto-waiting | ✅ Smart | ⚠️ Manual | ⚠️ Manual |
| MCP integration | ✅ Official | ❌ No | ❌ No |
| TypeScript first | ✅ Yes | ⚠️ Partial | ❌ No |

## When to Use Core vs Advanced

### Use **Core Features** For:
- ✅ Smoke tests (critical user paths)
- ✅ Basic form validation
- ✅ Navigation flows
- ✅ CI/CD quick checks

### Use **Advanced Features** For:
- ✅ Debugging production issues (network, console)
- ✅ Complex interactions (drag-drop, file upload)
- ✅ Performance validation (API response times)
- ✅ Comprehensive test suites

## EventOS Testing Priority

**P0 (Must Have - Core)**:
1. Dashboard loads without auth (RLS check)
2. Event creation basic flow
3. Booking form submission

**P1 (Should Have - Advanced)**:
1. Network request validation
2. Error state screenshots
3. Multi-browser compatibility

**P2 (Nice to Have)**:
1. Drag-drop agenda builder
2. File upload validation
3. Mobile responsive tests
