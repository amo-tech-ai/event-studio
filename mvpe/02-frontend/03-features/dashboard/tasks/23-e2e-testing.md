# Task 23: Week 4 - End-to-End Testing
**Phase:** Week 4
**Priority:** 🔴 CRITICAL
**Time:** 8 hours
**Status:** 🔴 NOT STARTED
**Dependencies:** Tasks 21-22

---

## 🎯 Objective

Create comprehensive E2E tests for all dashboard functionality using Playwright.

---

## ✅ Success Criteria

- [ ] E2E tests for all pages
- [ ] Critical user flows tested
- [ ] Tests passing
- [ ] CI/CD integration
- [ ] Test coverage > 80%

---

## 📋 Implementation

### 1. Setup Playwright (30 min)

```bash
# Install Playwright
npm install -D @playwright/test
npx playwright install

# Create config
npx playwright init
```

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

---

### 2. Create Test Utilities (1 hour)

```typescript
// e2e/utils/auth.ts
export async function login(page: Page) {
  await page.goto('/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await page.waitForURL('/dashboard');
}

// e2e/utils/fixtures.ts
export async function createTestEvent(page: Page) {
  await page.goto('/dashboard/events');
  await page.click('text=Create Event');
  await page.fill('[name="name"]', 'Test Event');
  await page.fill('[name="slug"]', 'test-event');
  await page.selectOption('[name="event_type"]', 'conference');
  await page.click('button:has-text("Create")');
}
```

---

### 3. Test Dashboard Page (1 hour)

```typescript
// e2e/dashboard.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/dashboard');
  });

  test('displays stats correctly', async ({ page }) => {
    // Check stats are visible
    await expect(page.locator('text=Upcoming Events')).toBeVisible();
    await expect(page.locator('text=Total Bookings')).toBeVisible();
    await expect(page.locator('text=Total Revenue')).toBeVisible();

    // Check stats have values
    const eventsCount = await page.locator('[data-testid="events-count"]').textContent();
    expect(parseInt(eventsCount!)).toBeGreaterThan(0);
  });

  test('displays recent activity', async ({ page }) => {
    await expect(page.locator('text=Recent Activity')).toBeVisible();
    await expect(page.locator('[data-testid="activity-item"]').first()).toBeVisible();
  });

  test('displays revenue chart', async ({ page }) => {
    await expect(page.locator('text=Revenue Overview')).toBeVisible();
    await expect(page.locator('[data-testid="revenue-chart"]')).toBeVisible();
  });

  test('refresh button works', async ({ page }) => {
    await page.click('button:has-text("Refresh")');
    await page.waitForTimeout(1000); // Wait for refresh
    // Verify data reloaded
  });
});
```

---

### 4. Test Events Page (1 hour)

```typescript
// e2e/events.spec.ts
test.describe('Events', () => {
  test('displays events list', async ({ page }) => {
    await page.goto('/dashboard/events');

    // Check events are displayed
    const eventCards = page.locator('[data-testid="event-card"]');
    await expect(eventCards).toHaveCount(5); // From sample data
  });

  test('filter events by status', async ({ page }) => {
    await page.goto('/dashboard/events');

    // Filter to published only
    await page.selectOption('[data-testid="status-filter"]', 'published');

    // Verify filtered results
    const publishedEvents = page.locator('[data-testid="event-card"]');
    await expect(publishedEvents).toHaveCount.greaterThan(0);
  });

  test('search events', async ({ page }) => {
    await page.goto('/dashboard/events');

    await page.fill('[data-testid="search-input"]', 'Conference');

    // Verify search results
    await expect(page.locator('text=Conference')).toBeVisible();
  });

  test('create new event', async ({ page }) => {
    await page.goto('/dashboard/events');

    await page.click('button:has-text("Create Event")');

    // Fill form
    await page.fill('[name="name"]', 'New Test Event');
    await page.fill('[name="slug"]', 'new-test-event');
    await page.selectOption('[name="event_type"]', 'conference');
    await page.fill('[name="capacity"]', '100');

    // Submit
    await page.click('button:has-text("Create")');

    // Verify success
    await expect(page.locator('text=Event created')).toBeVisible();
    await expect(page.locator('text=New Test Event')).toBeVisible();
  });
});
```

---

### 5. Test Critical User Flows (2 hours)

```typescript
// e2e/flows/booking-flow.spec.ts
test('complete booking flow', async ({ page }) => {
  // 1. Navigate to events
  await page.goto('/dashboard/events');

  // 2. Select an event
  await page.click('[data-testid="event-card"]').first();

  // 3. View event details
  await expect(page.locator('h1')).toContainText('Event');

  // 4. Navigate to bookings
  await page.click('text=Bookings');

  // 5. Verify booking created
  await expect(page.locator('[data-testid="booking-row"]')).toHaveCount.greaterThan(0);
});

// e2e/flows/revenue-tracking.spec.ts
test('revenue tracking flow', async ({ page }) => {
  // 1. Check initial revenue
  await page.goto('/dashboard');
  const initialRevenue = await page.locator('[data-testid="revenue-stat"]').textContent();

  // 2. Create paid order
  // ... create order logic

  // 3. Verify revenue updated
  await page.goto('/dashboard/financials');
  const newRevenue = await page.locator('[data-testid="total-revenue"]').textContent();

  // Revenue should increase
  expect(parseFloat(newRevenue!)).toBeGreaterThan(parseFloat(initialRevenue!));
});
```

---

### 6. Test Real-time Updates (1 hour)

```typescript
// e2e/realtime.spec.ts
test('real-time event updates', async ({ page, context }) => {
  // Open dashboard in first tab
  await page.goto('/dashboard/events');

  // Open admin panel in second tab
  const adminPage = await context.newPage();
  await adminPage.goto('/admin/events');

  // Create event in admin
  await createTestEvent(adminPage);

  // Wait for real-time update
  await page.waitForTimeout(3000);

  // Verify event appears in first tab without refresh
  await expect(page.locator('text=Test Event')).toBeVisible();
});
```

---

### 7. Setup CI/CD (1 hour)

```yaml
# .github/workflows/e2e-tests.yml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npm run preview &
      - run: npx playwright test
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## ✅ Testing Checklist

### Core Pages Tested:
- [ ] Dashboard
- [ ] Events
- [ ] Event Details
- [ ] Bookings
- [ ] Financials
- [ ] Gallery
- [ ] Calendar
- [ ] Settings
- [ ] Analytics
- [ ] Organizers
- [ ] Venues

### Critical Flows Tested:
- [ ] User login
- [ ] Event creation
- [ ] Order creation
- [ ] Revenue tracking
- [ ] Real-time updates
- [ ] Filter/search
- [ ] CRUD operations

### Test Quality:
- [ ] All tests passing
- [ ] No flaky tests
- [ ] Fast execution (< 5 min)
- [ ] Screenshots on failure
- [ ] Videos on failure

---

## 🎯 Next: Task 24 - Performance Benchmarks

**Time Spent:** _____ hours
**Completed:** ___________________
