# MCP Testing Guide

Comprehensive guide for testing with Playwright MCP and Chrome DevTools MCP.

---

## Overview

MCP (Model Context Protocol) testing tools provide browser automation and network monitoring capabilities for E2E testing.

**Available MCP Tools**:
1. **Playwright MCP** - Browser automation, user flows, visual testing
2. **Chrome DevTools MCP** - Network monitoring, performance analysis, console debugging

---

## 1. Playwright MCP Testing

### Core Functions

#### Navigation
```typescript
// Navigate to a URL
await mcp__playwright__browser_navigate({
  url: 'http://localhost:8081/dashboard'
})
```

#### Taking Snapshots
```typescript
// Capture accessibility snapshot (better than screenshot)
const snapshot = await mcp__playwright__browser_snapshot()

// Snapshot shows:
// - All interactive elements with unique refs
// - Text content
// - Accessibility tree
// - Element roles and attributes
```

#### Clicking Elements
```typescript
// Click a button
await mcp__playwright__browser_click({
  element: 'Create Event button',  // Human-readable description
  ref: 'button-create-event'        // Exact ref from snapshot
})

// Double click
await mcp__playwright__browser_click({
  element: 'Row to edit',
  ref: 'row-event-123',
  doubleClick: true
})

// Right click
await mcp__playwright__browser_click({
  element: 'Context menu trigger',
  ref: 'menu-trigger',
  button: 'right'
})
```

#### Typing Text
```typescript
// Type into a text field
await mcp__playwright__browser_type({
  element: 'Event title input',
  ref: 'input-title',
  text: 'My Event Title'
})

// Type slowly (character by character, triggers key handlers)
await mcp__playwright__browser_type({
  element: 'Search box',
  ref: 'input-search',
  text: 'conference',
  slowly: true
})

// Type and submit (press Enter after)
await mcp__playwright__browser_type({
  element: 'Search box',
  ref: 'input-search',
  text: 'conference',
  submit: true
})
```

#### Filling Forms
```typescript
// Fill multiple form fields at once
await mcp__playwright__browser_fill_form({
  fields: [
    {
      name: 'Event Title',
      type: 'textbox',
      ref: 'input-title',
      value: 'Tech Conference 2025'
    },
    {
      name: 'Description',
      type: 'textbox',
      ref: 'textarea-description',
      value: 'Annual technology conference'
    },
    {
      name: 'Event Type',
      type: 'combobox',
      ref: 'select-event-type',
      value: 'Conference'
    },
    {
      name: 'Send Notifications',
      type: 'checkbox',
      ref: 'checkbox-notifications',
      value: 'true'
    }
  ]
})
```

#### Waiting
```typescript
// Wait for specific text to appear
await mcp__playwright__browser_wait_for({
  text: 'Event created successfully'
})

// Wait for text to disappear
await mcp__playwright__browser_wait_for({
  textGone: 'Loading...'
})

// Wait for specific time (seconds)
await mcp__playwright__browser_wait_for({
  time: 2  // Wait 2 seconds
})
```

#### Screenshots
```typescript
// Screenshot entire page
await mcp__playwright__browser_take_screenshot({
  filename: 'dashboard-page.png'
})

// Screenshot specific element
await mcp__playwright__browser_take_screenshot({
  element: 'Event card',
  ref: 'card-event-123',
  filename: 'event-card.png'
})

// Full page screenshot (scrolls)
await mcp__playwright__browser_take_screenshot({
  fullPage: true,
  filename: 'full-page.png',
  type: 'png'
})

// JPEG format with quality
await mcp__playwright__browser_take_screenshot({
  filename: 'compressed.jpeg',
  type: 'jpeg',
  quality: 80  // 0-100
})
```

#### File Upload
```typescript
// Upload a file
await mcp__playwright__browser_file_upload({
  paths: ['/path/to/image.jpg']
})

// Upload multiple files
await mcp__playwright__browser_file_upload({
  paths: [
    '/path/to/image1.jpg',
    '/path/to/image2.jpg',
    '/path/to/document.pdf'
  ]
})
```

#### Keyboard Actions
```typescript
// Press a key
await mcp__playwright__browser_press_key({
  key: 'Enter'
})

// Press special keys
await mcp__playwright__browser_press_key({
  key: 'Escape'
})

await mcp__playwright__browser_press_key({
  key: 'ArrowDown'
})
```

#### Browser Management
```typescript
// Close browser
await mcp__playwright__browser_close()

// Resize browser window
await mcp__playwright__browser_resize({
  width: 375,   // iPhone width
  height: 667
})

// Get console messages
const console = await mcp__playwright__browser_console_messages()

// Get only errors
const errors = await mcp__playwright__browser_console_messages({
  onlyErrors: true
})

// Get network requests
const requests = await mcp__playwright__browser_network_requests()
```

#### Dialog Handling
```typescript
// Handle alert/confirm/prompt dialogs
await mcp__playwright__browser_handle_dialog({
  accept: true,
  promptText: 'My response'  // For prompt dialogs
})

// Dismiss dialog
await mcp__playwright__browser_handle_dialog({
  accept: false
})
```

---

### Complete Test Examples

#### Example 1: Create Event Flow

```typescript
/**
 * E2E Test: Create Event
 * User Story: Organizer creates a new event
 */

// 1. Navigate to events page
await mcp__playwright__browser_navigate({
  url: 'http://localhost:8081/dashboard/events'
})

// 2. Take snapshot to verify page loaded
const initialSnapshot = await mcp__playwright__browser_snapshot()
// Snapshot shows all elements and their refs

// 3. Click "Create Event" button
await mcp__playwright__browser_click({
  element: 'Create Event button',
  ref: 'button-create-event'
})

// 4. Wait for form to appear
await mcp__playwright__browser_wait_for({
  text: 'Create New Event'
})

// 5. Fill out the form
await mcp__playwright__browser_fill_form({
  fields: [
    {
      name: 'Event Title',
      type: 'textbox',
      ref: 'input-title',
      value: 'E2E Test Conference 2025'
    },
    {
      name: 'Description',
      type: 'textbox',
      ref: 'textarea-description',
      value: 'A comprehensive technology conference for testing'
    },
    {
      name: 'Start Date',
      type: 'textbox',
      ref: 'input-start-date',
      value: '2025-12-01'
    },
    {
      name: 'End Date',
      type: 'textbox',
      ref: 'input-end-date',
      value: '2025-12-03'
    },
    {
      name: 'Venue',
      type: 'combobox',
      ref: 'select-venue',
      value: 'Convention Center'
    },
    {
      name: 'Status',
      type: 'combobox',
      ref: 'select-status',
      value: 'Published'
    }
  ]
})

// 6. Click submit button
await mcp__playwright__browser_click({
  element: 'Submit button',
  ref: 'button-submit'
})

// 7. Wait for success message
await mcp__playwright__browser_wait_for({
  text: 'Event created successfully'
})

// 8. Verify event appears in list
const finalSnapshot = await mcp__playwright__browser_snapshot()
// Check finalSnapshot for 'E2E Test Conference 2025'

// 9. Take screenshot for documentation
await mcp__playwright__browser_take_screenshot({
  filename: 'e2e-create-event-success.png',
  type: 'png'
})

// ✅ Test complete
```

#### Example 2: Search and Filter Events

```typescript
/**
 * E2E Test: Search Events
 * User Story: User searches for events by keyword
 */

// 1. Navigate to events page
await mcp__playwright__browser_navigate({
  url: 'http://localhost:8081/events'
})

// 2. Type in search box (slowly to trigger search)
await mcp__playwright__browser_type({
  element: 'Search box',
  ref: 'input-search',
  text: 'conference',
  slowly: true
})

// 3. Wait for results to update
await mcp__playwright__browser_wait_for({
  time: 1  // Wait 1 second for debounce
})

// 4. Verify results contain "conference"
const snapshot = await mcp__playwright__browser_snapshot()
// Check snapshot for filtered results

// 5. Apply status filter
await mcp__playwright__browser_click({
  element: 'Status filter dropdown',
  ref: 'select-status-filter'
})

await mcp__playwright__browser_click({
  element: 'Published option',
  ref: 'option-published'
})

// 6. Wait for filtered results
await mcp__playwright__browser_wait_for({
  time: 1
})

// 7. Take screenshot of filtered results
await mcp__playwright__browser_take_screenshot({
  filename: 'filtered-events.png'
})

// ✅ Test complete
```

#### Example 3: Mobile Responsive Test

```typescript
/**
 * Responsive Test: Mobile View
 * Verify: Dashboard works on mobile
 */

// 1. Resize to mobile dimensions (iPhone 12)
await mcp__playwright__browser_resize({
  width: 390,
  height: 844
})

// 2. Navigate to dashboard
await mcp__playwright__browser_navigate({
  url: 'http://localhost:8081/dashboard'
})

// 3. Take snapshot
const mobileSnapshot = await mcp__playwright__browser_snapshot()

// 4. Verify mobile menu exists
await mcp__playwright__browser_click({
  element: 'Mobile menu toggle',
  ref: 'button-mobile-menu'
})

// 5. Wait for menu to open
await mcp__playwright__browser_wait_for({
  text: 'Navigation Menu'
})

// 6. Screenshot mobile view
await mcp__playwright__browser_take_screenshot({
  filename: 'mobile-dashboard.png'
})

// 7. Test tablet size
await mcp__playwright__browser_resize({
  width: 768,
  height: 1024
})

await mcp__playwright__browser_take_screenshot({
  filename: 'tablet-dashboard.png'
})

// ✅ Test complete
```

---

## 2. Chrome DevTools MCP Testing

### Core Functions

#### Navigation
```typescript
// Navigate to page
await mcp__chrome-devtools__navigate_page({
  url: 'http://localhost:8081/dashboard',
  timeout: 30000  // Optional timeout in ms
})

// Navigate back
await mcp__chrome-devtools__navigate_page_history({
  navigate: 'back'
})

// Navigate forward
await mcp__chrome-devtools__navigate_page_history({
  navigate: 'forward'
})
```

#### Network Monitoring
```typescript
// List all network requests
const requests = await mcp__chrome-devtools__list_network_requests()

// Filter by resource type
const apiCalls = await mcp__chrome-devtools__list_network_requests({
  resourceTypes: ['xhr', 'fetch']
})

// Pagination
const firstPage = await mcp__chrome-devtools__list_network_requests({
  pageSize: 20,
  pageIdx: 0
})

// Get specific request details
const requestDetail = await mcp__chrome-devtools__get_network_request({
  reqid: 123  // Request ID from list
})
```

#### Console Messages
```typescript
// List all console messages
const console = await mcp__chrome-devtools__list_console_messages()

// Filter by type
const errors = await mcp__chrome-devtools__list_console_messages({
  types: ['error']
})

const warnings = await mcp__chrome-devtools__list_console_messages({
  types: ['warn']
})

// Get specific message
const message = await mcp__chrome-devtools__get_console_message({
  msgid: 456  // Message ID from list
})
```

#### Page Interaction
```typescript
// Click element
await mcp__chrome-devtools__click({
  uid: 'element-uid-from-snapshot'
})

// Double click
await mcp__chrome-devtools__click({
  uid: 'element-uid',
  dblClick: true
})

// Fill form field
await mcp__chrome-devtools__fill({
  uid: 'input-uid',
  value: 'text to fill'
})

// Hover over element
await mcp__chrome-devtools__hover({
  uid: 'element-uid'
})
```

#### Screenshots
```typescript
// Screenshot entire page
await mcp__chrome-devtools__take_screenshot({
  format: 'png'
})

// Screenshot specific element
await mcp__chrome-devtools__take_screenshot({
  uid: 'element-uid',
  format: 'png'
})

// Full page screenshot
await mcp__chrome-devtools__take_screenshot({
  fullPage: true,
  format: 'jpeg',
  quality: 85
})

// Save to file
await mcp__chrome-devtools__take_screenshot({
  filePath: '/path/to/screenshot.png',
  format: 'png'
})
```

#### Performance Testing
```typescript
// Emulate slow network
await mcp__chrome-devtools__emulate_network({
  throttlingOption: 'Slow 3G'
})

// Options: "No emulation", "Offline", "Slow 3G", "Fast 3G", "Slow 4G", "Fast 4G"

// Emulate slow CPU
await mcp__chrome-devtools__emulate_cpu({
  throttlingRate: 4  // 4x slowdown (1-20)
})

// Reset emulation
await mcp__chrome-devtools__emulate_network({
  throttlingOption: 'No emulation'
})

await mcp__chrome-devtools__emulate_cpu({
  throttlingRate: 1  // No throttling
})
```

#### Performance Profiling
```typescript
// Start performance trace
await mcp__chrome-devtools__performance_start_trace({
  reload: true,      // Reload page before tracing
  autoStop: false    // Manual stop
})

// Stop trace
const trace = await mcp__chrome-devtools__performance_stop_trace()

// Analyze specific insight
const insight = await mcp__chrome-devtools__performance_analyze_insight({
  insightName: 'LCPBreakdown'  // Or "DocumentLatency"
})
```

---

### Complete Test Examples

#### Example 1: API Performance Monitoring

```typescript
/**
 * Performance Test: Dashboard API Calls
 * Requirement: All API calls < 200ms (p95)
 */

// 1. Navigate to dashboard
await mcp__chrome-devtools__navigate_page({
  url: 'http://localhost:8081/dashboard'
})

// 2. Get all network requests
const requests = await mcp__chrome-devtools__list_network_requests({
  resourceTypes: ['xhr', 'fetch']
})

// 3. Analyze API performance
console.log('=== API Performance Report ===')
let slowCalls = 0

for (const request of requests) {
  const detail = await mcp__chrome-devtools__get_network_request({
    reqid: request.reqid
  })

  const duration = detail.timing?.total || 0

  console.log(`
API: ${detail.url}
Status: ${detail.status}
Duration: ${duration}ms
Size: ${detail.size} bytes
  `)

  if (duration > 200) {
    console.warn(`⚠️ SLOW: ${detail.url} took ${duration}ms`)
    slowCalls++
  }
}

console.log(`
Total API calls: ${requests.length}
Slow calls (>200ms): ${slowCalls}
Performance: ${slowCalls === 0 ? '✅ PASS' : '❌ FAIL'}
`)

// 4. Check console for errors
const errors = await mcp__chrome-devtools__list_console_messages({
  types: ['error']
})

if (errors.length > 0) {
  console.error('❌ Console errors detected:')
  for (const error of errors) {
    const detail = await mcp__chrome-devtools__get_console_message({
      msgid: error.msgid
    })
    console.error(detail.text)
  }
} else {
  console.log('✅ No console errors')
}

// 5. Take screenshot
await mcp__chrome-devtools__take_screenshot({
  filePath: 'performance-test-dashboard.png'
})

// ✅ Test complete
```

#### Example 2: Network Error Handling

```typescript
/**
 * Resilience Test: Offline Behavior
 * Requirement: App handles offline gracefully
 */

// 1. Navigate with normal network
await mcp__chrome-devtools__navigate_page({
  url: 'http://localhost:8081/events'
})

// 2. Verify page loads successfully
const snapshot1 = await mcp__chrome-devtools__take_snapshot()
console.log('✅ Page loaded with network')

// 3. Switch to offline mode
await mcp__chrome-devtools__emulate_network({
  throttlingOption: 'Offline'
})

// 4. Try to create event (should fail gracefully)
await mcp__chrome-devtools__click({
  uid: 'button-create-event'
})

// 5. Wait for error message
await mcp__chrome-devtools__wait_for({
  text: 'Network error',
  timeout: 5000
})

// 6. Verify error UI
const snapshot2 = await mcp__chrome-devtools__take_snapshot()
console.log('✅ Error message displayed')

// 7. Screenshot error state
await mcp__chrome-devtools__take_screenshot({
  filePath: 'offline-error-state.png'
})

// 8. Restore network
await mcp__chrome-devtools__emulate_network({
  throttlingOption: 'No emulation'
})

// 9. Verify recovery
await mcp__chrome-devtools__navigate_page({
  url: 'http://localhost:8081/events'
})

console.log('✅ App recovered after network restored')

// ✅ Test complete
```

#### Example 3: Slow Network Testing

```typescript
/**
 * Performance Test: Slow Network
 * Requirement: App remains usable on 3G
 */

// 1. Enable slow 3G
await mcp__chrome-devtools__emulate_network({
  throttlingOption: 'Slow 3G'
})

// 2. Start performance trace
await mcp__chrome-devtools__performance_start_trace({
  reload: true,
  autoStop: false
})

// 3. Navigate to dashboard
await mcp__chrome-devtools__navigate_page({
  url: 'http://localhost:8081/dashboard'
})

// 4. Wait for page to load
await mcp__chrome-devtools__wait_for({
  text: 'Dashboard',
  timeout: 30000  // Allow 30s on slow network
})

// 5. Stop trace
const trace = await mcp__chrome-devtools__performance_stop_trace()

// 6. Analyze performance
const lcpInsight = await mcp__chrome-devtools__performance_analyze_insight({
  insightName: 'LCPBreakdown'
})

console.log('=== Slow 3G Performance ===')
console.log(`LCP: ${lcpInsight.lcp}ms`)
console.log(`Target: < 2500ms (Slow 3G)`)

if (lcpInsight.lcp < 2500) {
  console.log('✅ PASS: Acceptable on Slow 3G')
} else {
  console.warn('⚠️ FAIL: Too slow on Slow 3G')
}

// 7. Reset network
await mcp__chrome-devtools__emulate_network({
  throttlingOption: 'No emulation'
})

// ✅ Test complete
```

---

## Best Practices

### 1. Always Take Snapshots First
```typescript
// ❌ Bad: Click without knowing ref
await mcp__playwright__browser_click({
  element: 'Button',
  ref: 'button-unknown'  // Guessing
})

// ✅ Good: Snapshot first, then use correct ref
const snapshot = await mcp__playwright__browser_snapshot()
// Read snapshot to find correct ref
await mcp__playwright__browser_click({
  element: 'Create Event button',
  ref: 'button-create-event'  // From snapshot
})
```

### 2. Use Descriptive Element Names
```typescript
// ❌ Bad: Vague description
await mcp__playwright__browser_click({
  element: 'Button',
  ref: 'btn-1'
})

// ✅ Good: Clear description
await mcp__playwright__browser_click({
  element: 'Create Event button in header',
  ref: 'button-create-event'
})
```

### 3. Wait for Dynamic Content
```typescript
// ❌ Bad: Immediate assertion
await mcp__playwright__browser_click({ ... })
const snapshot = await mcp__playwright__browser_snapshot()
// Might capture loading state

// ✅ Good: Wait for content
await mcp__playwright__browser_click({ ... })
await mcp__playwright__browser_wait_for({
  text: 'Event created successfully'
})
const snapshot = await mcp__playwright__browser_snapshot()
```

### 4. Combine Playwright and Chrome DevTools
```typescript
// Use Playwright for user interactions
await mcp__playwright__browser_navigate({ url: '...' })
await mcp__playwright__browser_click({ ... })
await mcp__playwright__browser_fill_form({ ... })

// Use Chrome DevTools for network/performance monitoring
const requests = await mcp__chrome-devtools__list_network_requests()
const console = await mcp__chrome-devtools__list_console_messages()
```

---

## Troubleshooting

### Issue: Element Not Found
**Solution**: Take snapshot first to get correct ref
```typescript
const snapshot = await mcp__playwright__browser_snapshot()
// Read snapshot, find element, use its ref
```

### Issue: Timing Issues
**Solution**: Add explicit waits
```typescript
await mcp__playwright__browser_wait_for({
  text: 'Expected content'
})
```

### Issue: Slow Tests
**Solution**: Use `fill_form` instead of individual `type` calls
```typescript
// ❌ Slow: Multiple calls
await mcp__playwright__browser_type({ ref: 'input-1', text: 'value1' })
await mcp__playwright__browser_type({ ref: 'input-2', text: 'value2' })

// ✅ Fast: Single call
await mcp__playwright__browser_fill_form({
  fields: [
    { ref: 'input-1', value: 'value1' },
    { ref: 'input-2', value: 'value2' }
  ]
})
```

---

**Guide Version**: 1.0
**Last Updated**: 2025-10-23
