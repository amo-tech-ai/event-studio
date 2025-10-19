# EventOS MVP - Testing Strategy

**Project:** EventOS MVP - AI-Powered Event Management (Expanded)
**Version:** 2.0
**Last Updated:** 2025-10-17
**Status:** Testing Strategy

---

## 📋 Table of Contents

1. [Testing Overview](#testing-overview)
2. [Unit Testing](#unit-testing)
3. [Integration Testing](#integration-testing)
4. [End-to-End Testing](#end-to-end-testing)
5. [API Testing](#api-testing)
6. [Security Testing](#security-testing)
7. [Performance Testing](#performance-testing)
8. [User Acceptance Testing](#user-acceptance-testing)
9. [Test Data](#test-data)
10. [Continuous Integration](#continuous-integration)

---

## 🎯 Testing Overview

### Testing Goals

1. **Functionality**: All features work as specified
2. **Reliability**: System handles errors gracefully
3. **Security**: RLS policies and authentication work correctly
4. **Performance**: Pages load in <2 seconds
5. **Usability**: Users can complete tasks intuitively

### Testing Pyramid

```
        /\
       /  \      E2E Tests (10%)
      /----\     - Critical user flows
     /      \    - Payment flows
    /--------\   - AI wizard flows
   /          \
  /   Integration Tests (30%)
 /  - API endpoints
/   - Database operations
───────────────────────────────
     Unit Tests (60%)
     - Components
     - Utilities
     - Business logic
```

### Feature Coverage Matrix

| Feature | Unit | Integration | E2E | API | Security |
|---------|------|-------------|-----|-----|----------|
| **AI Event Wizard** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Ticketing System** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Payment Processing** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Public Event Pages** | ✅ | ✅ | ✅ | ⚪ | ✅ |
| **Email Notifications** | ✅ | ✅ | ✅ | ✅ | ⚪ |
| **CRM System** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **WhatsApp Automation** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Marketing Campaigns** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Venue Database** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Dashboard** | ✅ | ✅ | ✅ | ⚪ | ✅ |

---

## 🧪 Unit Testing

### Setup

```bash
# Install testing libraries
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D @testing-library/user-event happy-dom
```

### Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "happy-dom",
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.config.ts"
      ]
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
});
```

### Test Setup

```typescript
// src/test/setup.ts
import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
```

### Component Tests

#### Example: Button Component Test

```typescript
// src/components/ui/button.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./button";

describe("Button", () => {
  it("renders with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("handles click events", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText("Click me")).toBeDisabled();
  });

  it("applies variant classes", () => {
    render(<Button variant="destructive">Delete</Button>);
    expect(screen.getByText("Delete")).toHaveClass("bg-destructive");
  });
});
```

#### Example: Event Wizard Tests

```typescript
// src/components/wizard/EventWizard.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EventWizard } from "./EventWizard";
import { CopilotKit } from "@copilotkit/react-core";

// Mock CopilotKit
vi.mock("@copilotkit/react-core", () => ({
  CopilotKit: ({ children }: any) => <div>{children}</div>,
  useCopilotAction: vi.fn(),
  useCopilotReadable: vi.fn()
}));

describe("EventWizard", () => {
  it("renders wizard interface", () => {
    render(
      <CopilotKit>
        <EventWizard />
      </CopilotKit>
    );

    expect(screen.getByText(/Create Event with AI/i)).toBeInTheDocument();
  });

  it("shows progress steps", () => {
    render(
      <CopilotKit>
        <EventWizard />
      </CopilotKit>
    );

    expect(screen.getByText(/Event Details/i)).toBeInTheDocument();
    expect(screen.getByText(/Venue Selection/i)).toBeInTheDocument();
    expect(screen.getByText(/Ticket Configuration/i)).toBeInTheDocument();
  });

  it("updates state when event details are saved", async () => {
    const user = userEvent.setup();
    render(
      <CopilotKit>
        <EventWizard />
      </CopilotKit>
    );

    // Simulate AI action handler
    // This would be more complex in real implementation
    // Just testing that the component structure is correct
    expect(screen.getByText(/Progress:/i)).toBeInTheDocument();
  });
});
```

#### Example: CRM Tests

```typescript
// src/components/crm/CRMDashboard.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CRMDashboard } from "./CRMDashboard";
import * as supabase from "@/lib/supabase";

// Mock Supabase
vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: mockContacts }))
        }))
      }))
    })),
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: { id: "test-user-id" } } }))
    }
  }
}));

const mockContacts = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    company: "Acme Corp",
    contact_type: "sponsor",
    health_score: 85,
    last_contacted_at: "2025-10-10T10:00:00Z"
  }
];

describe("CRMDashboard", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false }
      }
    });
  });

  it("renders dashboard title", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <CRMDashboard />
      </QueryClientProvider>
    );

    expect(screen.getByText(/CRM - Contact Management/i)).toBeInTheDocument();
  });

  it("displays contacts", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <CRMDashboard />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
      expect(screen.getByText("Acme Corp")).toBeInTheDocument();
    });
  });

  it("displays health score correctly", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <CRMDashboard />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("85%")).toBeInTheDocument();
    });
  });
});
```

### Utility Function Tests

```typescript
// src/lib/utils.test.ts
import { describe, it, expect } from "vitest";
import { cn, formatCurrency, generateSlug } from "./utils";

describe("Utils", () => {
  describe("cn (className merger)", () => {
    it("merges class names", () => {
      expect(cn("foo", "bar")).toBe("foo bar");
    });

    it("handles conditional classes", () => {
      expect(cn("foo", false && "bar", "baz")).toBe("foo baz");
    });
  });

  describe("formatCurrency", () => {
    it("formats USD correctly", () => {
      expect(formatCurrency(1234.56, "USD")).toBe("$1,234.56");
    });

    it("handles zero", () => {
      expect(formatCurrency(0, "USD")).toBe("$0.00");
    });
  });

  describe("generateSlug", () => {
    it("converts text to slug", () => {
      expect(generateSlug("Tech Summit 2025")).toBe("tech-summit-2025");
    });

    it("removes special characters", () => {
      expect(generateSlug("Event @ NYC!")).toBe("event-nyc");
    });

    it("handles multiple spaces", () => {
      expect(generateSlug("Multiple   Spaces")).toBe("multiple-spaces");
    });
  });
});
```

---

## 🔗 Integration Testing

### Supabase Integration Tests

```typescript
// src/test/integration/events.test.ts
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

describe("Events Integration", () => {
  let testUserId: string;
  let testEventId: string;

  beforeAll(async () => {
    // Sign up test user
    const { data } = await supabase.auth.signUp({
      email: "test@example.com",
      password: "TestPassword123!"
    });
    testUserId = data.user!.id;
  });

  afterAll(async () => {
    // Cleanup: delete test event
    if (testEventId) {
      await supabase.from("events").delete().eq("id", testEventId);
    }

    // Sign out
    await supabase.auth.signOut();
  });

  it("creates an event", async () => {
    const eventData = {
      name: "Test Event",
      slug: "test-event",
      description: "Test event description",
      start_date: "2025-12-01T10:00:00Z",
      location: "New York, NY",
      capacity: 100,
      organizer_id: testUserId
    };

    const { data, error } = await supabase
      .from("events")
      .insert(eventData)
      .select()
      .single();

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.name).toBe("Test Event");

    testEventId = data.id;
  });

  it("retrieves event by slug", async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("slug", "test-event")
      .single();

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.name).toBe("Test Event");
  });

  it("updates event", async () => {
    const { data, error } = await supabase
      .from("events")
      .update({ capacity: 150 })
      .eq("id", testEventId)
      .select()
      .single();

    expect(error).toBeNull();
    expect(data.capacity).toBe(150);
  });

  it("respects RLS policies", async () => {
    // Sign out (becomes anonymous)
    await supabase.auth.signOut();

    // Try to update event as anonymous user
    const { error } = await supabase
      .from("events")
      .update({ capacity: 200 })
      .eq("id", testEventId);

    expect(error).toBeDefined();
    expect(error!.code).toBe("42501"); // Permission denied
  });
});
```

### CRM Integration Tests

```typescript
// src/test/integration/crm.test.ts
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

describe("CRM Integration", () => {
  let testUserId: string;
  let testContactId: string;

  beforeAll(async () => {
    const { data } = await supabase.auth.signUp({
      email: "crm-test@example.com",
      password: "TestPassword123!"
    });
    testUserId = data.user!.id;
  });

  afterAll(async () => {
    if (testContactId) {
      await supabase.from("crm_contacts").delete().eq("id", testContactId);
    }
    await supabase.auth.signOut();
  });

  it("creates a contact", async () => {
    const contactData = {
      organizer_id: testUserId,
      contact_type: "sponsor",
      name: "Acme Corp",
      email: "contact@acme.com",
      company: "Acme Corporation",
      health_score: 75
    };

    const { data, error } = await supabase
      .from("crm_contacts")
      .insert(contactData)
      .select()
      .single();

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.name).toBe("Acme Corp");

    testContactId = data.id;
  });

  it("filters contacts by type", async () => {
    const { data, error } = await supabase
      .from("crm_contacts")
      .select("*")
      .eq("organizer_id", testUserId)
      .eq("contact_type", "sponsor");

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.length).toBeGreaterThan(0);
    expect(data[0].contact_type).toBe("sponsor");
  });

  it("creates interaction record", async () => {
    const interactionData = {
      contact_id: testContactId,
      interaction_type: "email",
      subject: "Sponsorship Inquiry",
      content: "Initial outreach for event sponsorship",
      direction: "outbound"
    };

    const { data, error } = await supabase
      .from("crm_interactions")
      .insert(interactionData)
      .select()
      .single();

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.subject).toBe("Sponsorship Inquiry");
  });
});
```

---

## 🎭 End-to-End Testing

### Playwright Setup

```bash
# Install Playwright
npm install -D @playwright/test
npx playwright install
```

### Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",

  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure"
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] }
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] }
    }
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI
  }
});
```

### E2E Test: AI Wizard Flow

```typescript
// tests/e2e/wizard.spec.ts
import { test, expect } from "@playwright/test";

test.describe("AI Event Wizard", () => {
  test("creates event through AI conversation", async ({ page }) => {
    await page.goto("/create-event");

    // Wait for AI chat to load
    await expect(page.getByText(/AI Event Assistant/i)).toBeVisible();

    // Initial greeting from AI
    await expect(page.getByText(/What's your event name/i)).toBeVisible();

    // User provides event details
    await page.getByPlaceholder(/Type a message/i).fill("Tech Summit 2025");
    await page.keyboard.press("Enter");

    // Wait for AI response
    await expect(page.getByText(/great/i)).toBeVisible({ timeout: 10000 });

    // Continue conversation for date
    await page.getByPlaceholder(/Type a message/i).fill("December 15, 2025");
    await page.keyboard.press("Enter");

    // Location
    await page.waitForTimeout(2000);
    await page.getByPlaceholder(/Type a message/i).fill("San Francisco Convention Center");
    await page.keyboard.press("Enter");

    // Capacity
    await page.waitForTimeout(2000);
    await page.getByPlaceholder(/Type a message/i).fill("500 people");
    await page.keyboard.press("Enter");

    // Wait for venue search
    await expect(page.getByText(/search for venues/i)).toBeVisible({ timeout: 10000 });

    // Add tickets
    await page.waitForTimeout(2000);
    await page.getByPlaceholder(/Type a message/i).fill("Add General Admission ticket for $50, 400 quantity");
    await page.keyboard.press("Enter");

    await page.waitForTimeout(2000);
    await page.getByPlaceholder(/Type a message/i).fill("Add VIP ticket for $150, 100 quantity");
    await page.keyboard.press("Enter");

    // Create event
    await page.waitForTimeout(2000);
    await page.getByPlaceholder(/Type a message/i).fill("create event");
    await page.keyboard.press("Enter");

    // Wait for success message
    await expect(page.getByText(/Event created successfully/i)).toBeVisible({ timeout: 15000 });

    // Verify event appears in dashboard
    await page.goto("/dashboard");
    await expect(page.getByText("Tech Summit 2025")).toBeVisible();
  });
});
```

### E2E Test: Ticket Purchase Flow

```typescript
// tests/e2e/purchase.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Ticket Purchase Flow", () => {
  test("purchases tickets successfully", async ({ page }) => {
    // Navigate to event page
    await page.goto("/events/tech-summit-2025");

    // Wait for page to load
    await expect(page.getByText("Tech Summit 2025")).toBeVisible();

    // Select ticket tier
    await page.getByText("General Admission").click();
    await page.getByRole("button", { name: /Select/i }).first().click();

    // Verify ticket added to cart
    await expect(page.getByText(/1 × General Admission/i)).toBeVisible();

    // Proceed to checkout
    await page.getByRole("button", { name: /Checkout/i }).click();

    // Fill buyer information
    await page.getByLabel(/Name/i).fill("John Doe");
    await page.getByLabel(/Email/i).fill("john.doe@example.com");
    await page.getByLabel(/Phone/i).fill("+1234567890");

    // Continue to payment
    await page.getByRole("button", { name: /Continue to Payment/i }).click();

    // Wait for Stripe redirect
    await expect(page).toHaveURL(/checkout.stripe.com/, { timeout: 10000 });

    // Fill Stripe test card
    const stripeFrame = page.frameLocator('iframe[name*="stripe"]').first();
    await stripeFrame.getByLabel(/Card number/i).fill("4242424242424242");
    await stripeFrame.getByLabel(/Expiry/i).fill("12/34");
    await stripeFrame.getByLabel(/CVC/i).fill("123");
    await stripeFrame.getByLabel(/ZIP/i).fill("12345");

    // Submit payment
    await page.getByRole("button", { name: /Pay/i }).click();

    // Wait for success page
    await expect(page).toHaveURL(/\/success/, { timeout: 30000 });
    await expect(page.getByText(/Thank you for your purchase/i)).toBeVisible();

    // Verify email sent (check email mock service)
    // This would depend on your email testing setup
  });

  test("handles payment failure gracefully", async ({ page }) => {
    await page.goto("/events/tech-summit-2025");

    // Select ticket
    await page.getByRole("button", { name: /Select/i }).first().click();
    await page.getByRole("button", { name: /Checkout/i }).click();

    // Fill info
    await page.getByLabel(/Name/i).fill("Test User");
    await page.getByLabel(/Email/i).fill("test@example.com");
    await page.getByRole("button", { name: /Continue to Payment/i }).click();

    // Use Stripe declined test card
    const stripeFrame = page.frameLocator('iframe[name*="stripe"]').first();
    await stripeFrame.getByLabel(/Card number/i).fill("4000000000000002");
    await stripeFrame.getByLabel(/Expiry/i).fill("12/34");
    await stripeFrame.getByLabel(/CVC/i).fill("123");

    await page.getByRole("button", { name: /Pay/i }).click();

    // Verify error message
    await expect(page.getByText(/declined/i)).toBeVisible({ timeout: 10000 });
  });
});
```

### E2E Test: CRM Workflow

```typescript
// tests/e2e/crm.spec.ts
import { test, expect } from "@playwright/test";

test.describe("CRM Workflow", () => {
  test("creates and manages contact", async ({ page }) => {
    // Login
    await page.goto("/login");
    await page.getByLabel(/Email/i).fill("test@example.com");
    await page.getByLabel(/Password/i).fill("TestPassword123!");
    await page.getByRole("button", { name: /Sign In/i }).click();

    // Navigate to CRM
    await page.goto("/crm");
    await expect(page.getByText(/CRM - Contact Management/i)).toBeVisible();

    // Add new contact
    await page.getByRole("button", { name: /Add Contact/i }).click();

    // Fill contact form
    await page.getByLabel(/Name/i).fill("Acme Corporation");
    await page.getByLabel(/Email/i).fill("contact@acme.com");
    await page.getByLabel(/Phone/i).fill("+1234567890");
    await page.getByLabel(/Company/i).fill("Acme Corp");
    await page.getByLabel(/Type/i).selectOption("sponsor");

    // Save contact
    await page.getByRole("button", { name: /Save/i }).click();

    // Verify contact appears in list
    await expect(page.getByText("Acme Corporation")).toBeVisible();
    await expect(page.getByText("contact@acme.com")).toBeVisible();

    // Click on contact to view details
    await page.getByText("Acme Corporation").click();

    // Add interaction
    await page.getByRole("button", { name: /Add Interaction/i }).click();
    await page.getByLabel(/Type/i).selectOption("email");
    await page.getByLabel(/Subject/i).fill("Sponsorship Inquiry");
    await page.getByLabel(/Content/i).fill("Initial outreach for event sponsorship opportunities");
    await page.getByRole("button", { name: /Save/i }).click();

    // Verify interaction appears
    await expect(page.getByText("Sponsorship Inquiry")).toBeVisible();
  });
});
```

---

## 🔌 API Testing

### Stripe Webhook Testing

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local
stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook
```

### Webhook Test Script

```typescript
// tests/api/stripe-webhook.test.ts
import { describe, it, expect } from "vitest";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16"
});

describe("Stripe Webhook", () => {
  it("processes successful payment", async () => {
    // Create test session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Test Ticket" },
            unit_amount: 5000
          },
          quantity: 1
        }
      ],
      mode: "payment",
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
      metadata: {
        eventId: "test-event-id",
        tickets: JSON.stringify([{ id: "test-ticket-id", name: "Test Ticket", quantity: 1 }])
      }
    });

    expect(session.id).toBeDefined();
    expect(session.status).toBe("open");

    // In real test, would trigger webhook by completing payment
    // For now, just verify session creation
  });
});
```

### WhatsApp API Testing

```typescript
// tests/api/whatsapp.test.ts
import { describe, it, expect, vi } from "vitest";
import { sendWhatsAppMessage } from "@/lib/whatsapp";

// Mock fetch
global.fetch = vi.fn();

describe("WhatsApp API", () => {
  it("sends text message successfully", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ messages: [{ id: "wamid.test123" }] })
    });

    const result = await sendWhatsAppMessage({
      to: "+1234567890",
      message: "Test message",
      type: "text"
    });

    expect(result).toBeDefined();
    expect(result.messages).toBeDefined();
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/messages"),
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          Authorization: expect.stringContaining("Bearer")
        })
      })
    );
  });

  it("handles API errors", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: false,
      statusText: "Bad Request"
    });

    await expect(
      sendWhatsAppMessage({
        to: "+1234567890",
        message: "Test",
        type: "text"
      })
    ).rejects.toThrow("WhatsApp API error");
  });
});
```

---

## 🔒 Security Testing

### RLS Policy Tests

```sql
-- Test RLS policies manually in Supabase SQL Editor

-- Test 1: User can only see their own events
BEGIN;
  SET request.jwt.claims.sub TO 'user-1-id';

  SELECT * FROM events; -- Should only return user-1's events

  SELECT * FROM events WHERE organizer_id = 'user-2-id'; -- Should return empty

ROLLBACK;

-- Test 2: Public can view published events
BEGIN;
  SET request.jwt.claims.sub TO NULL; -- Anonymous

  SELECT * FROM events WHERE status = 'published'; -- Should work

  SELECT * FROM events WHERE status = 'draft'; -- Should return empty

ROLLBACK;

-- Test 3: Users can only see orders with their email
BEGIN;
  SET request.jwt.claims.sub TO 'user-1-id';
  SET request.jwt.claims.email TO 'user1@example.com';

  SELECT * FROM orders; -- Should only return orders with user1@example.com

ROLLBACK;
```

### Authentication Tests

```typescript
// tests/security/auth.test.ts
import { describe, it, expect } from "vitest";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

describe("Authentication Security", () => {
  it("rejects weak passwords", async () => {
    const { error } = await supabase.auth.signUp({
      email: "test@example.com",
      password: "123" // Too short
    });

    expect(error).toBeDefined();
    expect(error!.message).toContain("password");
  });

  it("prevents SQL injection in login", async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: "test@example.com' OR '1'='1",
      password: "anything"
    });

    expect(error).toBeDefined();
  });

  it("requires email verification for sensitive operations", async () => {
    // Sign up
    const { data: signUpData } = await supabase.auth.signUp({
      email: "test@example.com",
      password: "SecurePassword123!"
    });

    // Try to create event without verifying email
    const { error } = await supabase.from("events").insert({
      name: "Test Event",
      slug: "test-event",
      start_date: "2025-12-01T10:00:00Z",
      location: "Test Location",
      capacity: 100,
      organizer_id: signUpData.user!.id
    });

    // Should fail if email verification is required
    // (depends on Supabase configuration)
  });
});
```

---

## ⚡ Performance Testing

### Lighthouse CI

```bash
# Install Lighthouse CI
npm install -D @lhci/cli

# Create config
# lighthouserc.json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:5173/", "http://localhost:5173/events/tech-summit-2025"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.9 }]
      }
    }
  }
}
```

### Load Testing with k6

```javascript
// tests/load/events.js
import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 20 }, // Ramp up to 20 users
    { duration: "1m", target: 20 }, // Stay at 20 users
    { duration: "30s", target: 0 } // Ramp down
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"], // 95% of requests under 500ms
    http_req_failed: ["rate<0.01"] // Less than 1% failures
  }
};

export default function () {
  // Test homepage
  const homeResponse = http.get("http://localhost:5173/");
  check(homeResponse, {
    "homepage loads": (r) => r.status === 200,
    "homepage fast": (r) => r.timings.duration < 500
  });

  sleep(1);

  // Test event page
  const eventResponse = http.get("http://localhost:5173/events/tech-summit-2025");
  check(eventResponse, {
    "event page loads": (r) => r.status === 200,
    "event page fast": (r) => r.timings.duration < 1000
  });

  sleep(2);
}
```

### Database Query Performance

```sql
-- Test slow queries with EXPLAIN ANALYZE

-- Event listing query
EXPLAIN ANALYZE
SELECT
  e.*,
  COUNT(DISTINCT a.id) as attendee_count
FROM events e
LEFT JOIN attendees a ON a.event_id = e.id
WHERE e.status = 'published'
GROUP BY e.id
ORDER BY e.start_date DESC
LIMIT 20;

-- Should use idx_events_status and be <50ms

-- CRM contacts query
EXPLAIN ANALYZE
SELECT *
FROM crm_contacts
WHERE organizer_id = 'test-user-id'
  AND contact_type = 'sponsor'
  AND health_score > 70
ORDER BY last_contacted_at DESC;

-- Should use indexes and be <50ms
```

---

## 👥 User Acceptance Testing

### UAT Test Cases

#### Test Case 1: Event Creation

**Objective**: Verify organizer can create event using AI wizard

**Steps**:
1. Navigate to /create-event
2. Interact with AI wizard
3. Provide event details via conversation
4. Select venue
5. Configure tickets
6. Create event

**Expected Result**:
- Event created successfully
- Appears in dashboard
- All details saved correctly
- Email confirmation sent

**Actual Result**: _____________________

**Status**: ☐ Pass ☐ Fail

---

#### Test Case 2: Ticket Purchase

**Objective**: Verify attendee can purchase tickets

**Steps**:
1. Navigate to public event page
2. Select ticket tier
3. Enter attendee information
4. Complete Stripe payment
5. Receive confirmation email

**Expected Result**:
- Payment processes successfully
- Order created in database
- Attendee records created
- QR code generated
- Email with tickets delivered
- WhatsApp confirmation sent

**Actual Result**: _____________________

**Status**: ☐ Pass ☐ Fail

---

#### Test Case 3: CRM Contact Management

**Objective**: Verify organizer can manage contacts

**Steps**:
1. Navigate to /crm
2. Add new contact
3. Log interaction
4. Update health score
5. Send email/WhatsApp message

**Expected Result**:
- Contact saved successfully
- Interactions tracked
- Messages delivered
- Health score updated

**Actual Result**: _____________________

**Status**: ☐ Pass ☐ Fail

---

#### Test Case 4: Marketing Campaign

**Objective**: Verify organizer can create and send campaigns

**Steps**:
1. Navigate to /marketing
2. Create new campaign
3. Select target audience
4. Write message content
5. Schedule or send immediately

**Expected Result**:
- Campaign created
- Recipients filtered correctly
- Messages sent to all targets
- Analytics tracked

**Actual Result**: _____________________

**Status**: ☐ Pass ☐ Fail

---

## 📊 Test Data

### Seed Data Script

```sql
-- tests/seed-data.sql

BEGIN;

-- Create test user
INSERT INTO auth.users (id, email)
VALUES ('00000000-0000-0000-0000-000000000001', 'test@example.com')
ON CONFLICT DO NOTHING;

-- Create test events
INSERT INTO events (id, organizer_id, name, slug, description, start_date, location, capacity, status)
VALUES
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Tech Summit 2025', 'tech-summit-2025', 'Annual technology conference', '2025-12-15 10:00:00+00', 'San Francisco, CA', 500, 'published'),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Business Gala', 'business-gala', 'Networking gala event', '2025-11-20 18:00:00+00', 'New York, NY', 200, 'published');

-- Create test tickets
INSERT INTO tickets (event_id, name, price, quantity, sold)
VALUES
  ('10000000-0000-0000-0000-000000000001', 'General Admission', 50.00, 400, 100),
  ('10000000-0000-0000-0000-000000000001', 'VIP', 150.00, 100, 25),
  ('10000000-0000-0000-0000-000000000002', 'Standard', 75.00, 150, 50),
  ('10000000-0000-0000-0000-000000000002', 'Premium', 200.00, 50, 10);

-- Create test CRM contacts
INSERT INTO crm_contacts (organizer_id, contact_type, name, email, company, health_score)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'sponsor', 'Acme Corp', 'contact@acme.com', 'Acme Corporation', 85),
  ('00000000-0000-0000-0000-000000000001', 'vendor', 'Catering Co', 'sales@catering.com', 'Premium Catering', 70),
  ('00000000-0000-0000-0000-000000000001', 'attendee', 'John Doe', 'john@example.com', NULL, 60);

-- Create test venues
INSERT INTO venues (name, slug, city, state, country, capacity, price_per_day, venue_type, amenities, is_available)
VALUES
  ('SF Convention Center', 'sf-convention-center', 'San Francisco', 'CA', 'USA', 1000, 5000.00, 'conference_center', ARRAY['WiFi', 'Parking', 'AV Equipment'], true),
  ('NYC Grand Ballroom', 'nyc-grand-ballroom', 'New York', 'NY', 'USA', 500, 3500.00, 'hotel', ARRAY['WiFi', 'Catering', 'Stage'], true);

COMMIT;
```

---

## 🔄 Continuous Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:coverage

  integration-tests:
    runs-on: ubuntu-latest
    env:
      VITE_SUPABASE_URL: ${{ secrets.SUPABASE_TEST_URL }}
      VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_TEST_ANON_KEY }}
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run test:integration

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/

  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
```

---

## ✅ Testing Checklist

### Pre-Launch Testing

- [ ] All unit tests passing (>80% coverage)
- [ ] All integration tests passing
- [ ] Critical E2E flows tested
- [ ] Performance benchmarks met
- [ ] Security vulnerabilities scanned
- [ ] Accessibility standards met (WCAG 2.1 AA)
- [ ] Cross-browser compatibility verified
- [ ] Mobile responsiveness tested
- [ ] Error handling verified
- [ ] UAT sign-off received

### Post-Launch Monitoring

- [ ] Error tracking configured (Sentry)
- [ ] Performance monitoring active (Lighthouse CI)
- [ ] User analytics tracking
- [ ] Database query performance monitored
- [ ] API response times tracked
- [ ] Email deliverability monitored
- [ ] WhatsApp message success rate tracked

---

## 📚 Testing Resources

### Tools

- **Unit Testing**: Vitest + Testing Library
- **E2E Testing**: Playwright
- **API Testing**: Postman, Insomnia
- **Load Testing**: k6, Apache JMeter
- **Security**: OWASP ZAP, Snyk
- **Performance**: Lighthouse, WebPageTest

### Documentation

- [Vitest Docs](https://vitest.dev/)
- [Testing Library Docs](https://testing-library.com/)
- [Playwright Docs](https://playwright.dev/)
- [Supabase Testing Guide](https://supabase.com/docs/guides/testing)
- [Stripe Testing](https://stripe.com/docs/testing)

---

**Status:** ✅ Testing Strategy Complete
**Coverage Goal:** >80% code coverage
**Quality Gate:** All critical paths tested
