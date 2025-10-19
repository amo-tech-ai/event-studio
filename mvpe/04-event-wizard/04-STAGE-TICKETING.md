# Stage 4: Ticketing

## Overview

Stage 4 sets up ticket tiers with EventOS's zero-commission ticketing system. Unlike Eventbrite (3.5% fee) and matching Zoho's approach, EventOS charges 0% commission to maximize organizer revenue.

**Duration:** ~60 seconds
**Transition:** ticketing → marketing

---

## Purpose

- Create ticket tiers (Early Bird, Regular, VIP, etc.)
- Set pricing and quantity limits for each tier
- Configure free tickets if applicable
- Generate unique ticket URLs
- Enable Stripe payment processing
- Set up ticket release schedule (optional)

---

## State Structure

```typescript
interface TicketingState {
  ticketingData: {
    tiers: Array<{
      id?: string;
      name: string;
      price: number;
      currency: string;
      quantity: number;
      quantitySold?: number;
      description?: string;
      releaseDate?: string;
      endDate?: string;
      tier_type?: "early_bird" | "regular" | "vip" | "free";
    }>;
    paymentProcessorConnected: boolean;
    totalRevenuePotential?: number;
  };
}
```

---

## CopilotKit Implementation

### Hook: `useTicketingStage.ts`

```typescript
import { useCopilotAction } from "@copilotkit/react-core";
import { useWizardState } from "../hooks/useWizardState";
import { supabase } from "@/lib/supabase";

export function useTicketingStage() {
  const { state, updateState, goToStage, markStageComplete } = useWizardState();

  // Action 1: Create ticket tiers
  useCopilotAction({
    name: "createTicketTiers",
    description: "Create ticket tiers with pricing and quantity limits for the event",
    parameters: [
      {
        name: "tiers",
        type: "array",
        description: "Array of ticket tier objects with name, price, quantity, and optional description",
        required: true,
        items: {
          name: "string",
          price: "number",
          quantity: "number",
          description: "string"
        }
      }
    ],
    handler: async ({ tiers }) => {
      try {
        // Validate tiers
        if (!tiers || tiers.length === 0) {
          return "You need at least one ticket tier. What types of tickets would you like to offer?";
        }

        // Validate total capacity
        const totalTickets = tiers.reduce((sum, t) => sum + t.quantity, 0);
        if (totalTickets > state.eventData.capacity) {
          return `Total tickets (${totalTickets}) exceed venue capacity (${state.eventData.capacity}). Please adjust quantities.`;
        }

        // Create ticket tiers in database
        const ticketPromises = tiers.map(async (tier) => {
          // Determine tier type
          const tierType = determineTierType(tier.name, tier.price);

          const { data, error } = await supabase
            .from("ticket_tiers")
            .insert({
              event_id: state.eventData.id,
              name: tier.name,
              price: tier.price,
              currency: "USD",
              quantity_total: tier.quantity,
              quantity_available: tier.quantity,
              description: tier.description || `${tier.name} ticket for ${state.eventData.name}`,
              tier_type: tierType,
              status: "active",
              metadata: {
                wizard_session_id: state.sessionId,
                created_via: "wizard"
              }
            })
            .select()
            .single();

          if (error) throw error;
          return data;
        });

        const createdTiers = await Promise.all(ticketPromises);

        // Calculate revenue potential
        const revenuePotential = tiers.reduce(
          (sum, t) => sum + (t.price * t.quantity),
          0
        );

        // Update wizard state
        updateState({
          ticketingData: {
            tiers: createdTiers,
            totalRevenuePotential: revenuePotential,
            paymentProcessorConnected: false // To be set up separately
          },
          completedStages: [...state.completedStages, "ticketing"]
        });

        // Transition to marketing
        markStageComplete("ticketing");
        goToStage("marketing");

        // Format confirmation message
        const tierSummary = tiers.map(t =>
          `  • ${t.name}: $${t.price} × ${t.quantity} tickets = $${t.price * t.quantity}`
        ).join("\n");

        return `Perfect! Your ticketing is set up:

${tierSummary}

💰 **Potential Revenue:** $${revenuePotential.toLocaleString()} (0% commission!)
🎟️ **Total Tickets:** ${totalTickets}

Your tickets will be available at: eventos.com/${state.eventData.slug}/tickets

Now let's create marketing content to promote your event! Would you like me to generate a landing page and email campaigns?`;

      } catch (error) {
        console.error("Error creating ticket tiers:", error);
        return "I had trouble setting up your tickets. Could you try again?";
      }
    }
  });

  // Action 2: Suggest ticket tiers based on event type
  useCopilotAction({
    name: "suggestTicketTiers",
    description: "AI suggests appropriate ticket tiers based on event type, capacity, and market rates",
    parameters: [],
    handler: async () => {
      const eventType = state.eventData.type;
      const capacity = state.eventData.capacity;

      // AI-powered suggestions based on event type
      const suggestions = {
        conference: [
          {
            name: "Early Bird",
            price: Math.round(capacity > 200 ? 199 : 99),
            quantity: Math.round(capacity * 0.3),
            description: "Save 30% with early registration"
          },
          {
            name: "Regular",
            price: Math.round(capacity > 200 ? 299 : 149),
            quantity: Math.round(capacity * 0.5),
            description: "Standard conference pass"
          },
          {
            name: "VIP",
            price: Math.round(capacity > 200 ? 499 : 249),
            quantity: Math.round(capacity * 0.2),
            description: "Premium seating + networking dinner"
          }
        ],
        workshop: [
          {
            name: "Standard",
            price: Math.round(capacity > 30 ? 149 : 79),
            quantity: capacity,
            description: "Includes materials and certificate"
          }
        ],
        meetup: [
          {
            name: "Free",
            price: 0,
            quantity: capacity,
            description: "Free community event"
          }
        ],
        seminar: [
          {
            name: "General Admission",
            price: 49,
            quantity: Math.round(capacity * 0.8),
            description: "Access to all sessions"
          },
          {
            name: "VIP",
            price: 99,
            quantity: Math.round(capacity * 0.2),
            description: "Priority seating + Q&A access"
          }
        ],
        fundraiser: [
          {
            name: "Supporter",
            price: 50,
            quantity: Math.round(capacity * 0.5),
            description: "Support the cause"
          },
          {
            name: "Patron",
            price: 150,
            quantity: Math.round(capacity * 0.3),
            description: "Premium support level"
          },
          {
            name: "Benefactor",
            price: 500,
            quantity: Math.round(capacity * 0.2),
            description: "VIP table + recognition"
          }
        ]
      };

      const suggested = suggestions[eventType] || suggestions.conference;

      // Store in suggestions
      updateState({
        suggestions: {
          ...state.suggestions,
          ticketTiers: suggested
        }
      });

      const tierList = suggested.map(t =>
        `  • **${t.name}**: $${t.price} × ${t.quantity} tickets`
      ).join("\n");

      return `Based on your ${eventType} for ${capacity} attendees, I suggest:

${tierList}

Would you like to use these tiers, or customize them?`;
    }
  });

  // Action 3: Add/modify individual tier
  useCopilotAction({
    name: "modifyTicketTier",
    description: "Modify an existing ticket tier or add a new one",
    parameters: [
      {
        name: "tierId",
        type: "string",
        description: "ID of tier to modify (leave empty to add new tier)",
        required: false
      },
      {
        name: "name",
        type: "string",
        required: true
      },
      {
        name: "price",
        type: "number",
        required: true
      },
      {
        name: "quantity",
        type: "number",
        required: true
      },
      {
        name: "description",
        type: "string",
        required: false
      }
    ],
    handler: async ({ tierId, name, price, quantity, description }) => {
      try {
        if (tierId) {
          // Update existing tier
          const { data, error } = await supabase
            .from("ticket_tiers")
            .update({
              name,
              price,
              quantity_total: quantity,
              description
            })
            .eq("id", tierId)
            .select()
            .single();

          if (error) throw error;

          return `Updated **${name}** tier: $${price} × ${quantity} tickets`;
        } else {
          // Add new tier
          const { data, error } = await supabase
            .from("ticket_tiers")
            .insert({
              event_id: state.eventData.id,
              name,
              price,
              currency: "USD",
              quantity_total: quantity,
              quantity_available: quantity,
              description,
              status: "active"
            })
            .select()
            .single();

          if (error) throw error;

          return `Added **${name}** tier: $${price} × ${quantity} tickets`;
        }
      } catch (error) {
        console.error("Error modifying tier:", error);
        return "I had trouble updating that tier. Could you try again?";
      }
    }
  });
}

// Helper function to determine tier type
function determineTierType(name: string, price: number): string {
  const nameLower = name.toLowerCase();

  if (price === 0) return "free";
  if (nameLower.includes("early") || nameLower.includes("bird")) return "early_bird";
  if (nameLower.includes("vip") || nameLower.includes("premium")) return "vip";
  return "regular";
}
```

---

## Conversation Flow

### Scenario 1: AI-Suggested Tiers
```
AI: Now let's set up ticketing! What ticket types would you like to offer?

User: I'm not sure, what do you suggest?

AI: [Triggers suggestTicketTiers]
     ↓
     Based on your conference for 500 attendees, I suggest:

     • Early Bird: $199 × 150 tickets
     • Regular: $299 × 250 tickets
     • VIP: $499 × 100 tickets

     Would you like to use these tiers, or customize them?

User: Looks good, let's use those

AI: [Triggers createTicketTiers]
     ↓
     Perfect! Your ticketing is set up:

       • Early Bird: $199 × 150 tickets = $29,850
       • Regular: $299 × 250 tickets = $74,750
       • VIP: $499 × 100 tickets = $49,900

     💰 Potential Revenue: $154,500 (0% commission!)
     🎟️ Total Tickets: 500

     Your tickets: eventos.com/ai-summit-2025/tickets

     Now let's create marketing content!

     [Automatically transitions to Stage 5: Marketing]
```

### Scenario 2: Custom Tiers
```
AI: What ticket types would you like to offer?

User: Just two tiers: General for $50 with 80 tickets, and VIP for $150 with 20 tickets

AI: [Triggers createTicketTiers]
     ↓
     Perfect! Your ticketing is set up:

       • General: $50 × 80 tickets = $4,000
       • VIP: $150 × 20 tickets = $3,000

     💰 Potential Revenue: $7,000 (0% commission!)
     🎟️ Total Tickets: 100

     [Transitions to marketing]
```

### Scenario 3: Free Event
```
User: This is a free community event

AI: [Triggers createTicketTiers with free tier]
     ↓
     Perfect! I've set up free registration for your event.

     🎟️ Total Capacity: 500 free tickets

     Free events still benefit from registration tracking and email marketing.
     Let's set up promotional content!
```

---

## Database Operations

### 1. Create Ticket Tiers

```sql
INSERT INTO ticket_tiers (
  event_id,
  name,
  price,
  currency,
  quantity_total,
  quantity_available,
  description,
  tier_type,
  status,
  metadata
) VALUES
  (
    'event-uuid',
    'Early Bird',
    199.00,
    'USD',
    150,
    150,
    'Save 30% with early registration',
    'early_bird',
    'active',
    '{"wizard_session_id": "session-uuid", "created_via": "wizard"}'::jsonb
  ),
  (
    'event-uuid',
    'Regular',
    299.00,
    'USD',
    250,
    250,
    'Standard conference pass',
    'regular',
    'active',
    '{"wizard_session_id": "session-uuid", "created_via": "wizard"}'::jsonb
  ),
  (
    'event-uuid',
    'VIP',
    499.00,
    'USD',
    100,
    100,
    'Premium seating + networking dinner',
    'vip',
    'active',
    '{"wizard_session_id": "session-uuid", "created_via": "wizard"}'::jsonb
  )
RETURNING *;
```

### 2. Update Tier

```sql
UPDATE ticket_tiers
SET
  name = 'Super Early Bird',
  price = 149.00,
  quantity_total = 200,
  description = 'Exclusive early pricing'
WHERE id = 'tier-uuid';
```

### 3. Revenue Calculation

```sql
SELECT
  SUM(price * quantity_total) AS potential_revenue,
  SUM(price * quantity_sold) AS actual_revenue,
  SUM(quantity_sold) AS tickets_sold,
  SUM(quantity_available) AS tickets_remaining
FROM ticket_tiers
WHERE event_id = 'event-uuid';
```

---

## Ticket Tier Recommendations

### Conference (200+ attendees)
| Tier | Price | Allocation | Description |
|------|-------|------------|-------------|
| Early Bird | $199 | 30% | Limited availability |
| Regular | $299 | 50% | Standard access |
| VIP | $499 | 20% | Premium experience |

### Workshop (10-50 attendees)
| Tier | Price | Allocation | Description |
|------|-------|------------|-------------|
| Standard | $79-149 | 100% | All-inclusive |

### Meetup (20-100 attendees)
| Tier | Price | Allocation | Description |
|------|-------|------------|-------------|
| Free | $0 | 100% | Community event |

### Fundraiser (100-500 attendees)
| Tier | Price | Allocation | Description |
|------|-------|------------|-------------|
| Supporter | $50 | 50% | Basic support |
| Patron | $150 | 30% | Premium support |
| Benefactor | $500 | 20% | VIP recognition |

---

## Validation Rules

| Field | Required | Validation | Error Message |
|-------|----------|------------|---------------|
| Tier name | ✅ Yes | 2-50 chars | "Ticket name required" |
| Price | ✅ Yes | ≥ 0, ≤ 10,000 | "Price must be $0-$10,000" |
| Quantity | ✅ Yes | 1-100,000 | "Quantity must be 1-100,000" |
| Total tickets | ✅ Yes | ≤ venue capacity | "Exceeds venue capacity" |

### Additional Validation
```typescript
// Check: Total tickets don't exceed capacity
const totalTickets = tiers.reduce((sum, t) => sum + t.quantity, 0);
if (totalTickets > eventCapacity) {
  throw new Error(`Total tickets (${totalTickets}) exceed capacity (${eventCapacity})`);
}

// Check: At least one tier exists
if (tiers.length === 0) {
  throw new Error("At least one ticket tier required");
}

// Check: Free events can only have free tiers
if (eventType === "free") {
  const paidTiers = tiers.filter(t => t.price > 0);
  if (paidTiers.length > 0) {
    throw new Error("Free events cannot have paid tickets");
  }
}
```

---

## Success Criteria

- ✅ At least one ticket tier created
- ✅ Total tickets ≤ venue capacity
- ✅ All tiers have valid pricing ($0+)
- ✅ Tiers saved to `ticket_tiers` table
- ✅ Revenue potential calculated correctly
- ✅ Global state updated with ticketing data
- ✅ Stage marked complete
- ✅ Automatic transition to marketing stage

---

## Edge Cases

### 1. Exceeding Venue Capacity
**Scenario:** Total tickets > venue capacity
**Action:** Reject and request adjustment
**Message:** "Total tickets (600) exceed venue capacity (500). Please reduce quantities."

### 2. Zero Tickets
**Scenario:** User tries to create event with 0 tickets
**Action:** Require at least 1 ticket
**Message:** "You need at least one ticket tier. What would you like to offer?"

### 3. Unrealistic Pricing
**Scenario:** User sets $10,000 ticket price for meetup
**Action:** Confirm with user
**Message:** "$10,000 per ticket for a meetup seems high. Is that correct?"

### 4. Free + Paid Mix
**Scenario:** User wants both free and paid tiers
**Action:** Allow but clarify
**Message:** "You're offering both free and paid tickets. Free tickets can't be converted to paid later. Proceed?"

---

## Analytics Events

```typescript
// Tier suggestions requested
analytics.track("ticket_suggestions_requested", {
  event_type: state.eventData.type,
  capacity: state.eventData.capacity,
  session_id: state.sessionId
});

// Tiers created
analytics.track("ticket_tiers_created", {
  event_id: state.eventData.id,
  num_tiers: tiers.length,
  has_free_tier: tiers.some(t => t.price === 0),
  has_early_bird: tiers.some(t => t.tier_type === "early_bird"),
  total_tickets: totalTickets,
  revenue_potential: revenuePotential,
  session_id: state.sessionId
});

// Stage completed
analytics.track("wizard_stage_completed", {
  stage: "ticketing",
  num_tiers: tiers.length,
  revenue_potential: revenuePotential,
  session_id: state.sessionId,
  duration_seconds: calculateDuration()
});
```

---

## UI Components

### Ticket Tier Builder
```
┌─────────────────────────────────────────────┐
│  Configure Your Tickets                     │
├─────────────────────────────────────────────┤
│                                             │
│  Tier 1: Early Bird                         │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐ │
│  │ $199     │  │ 150 qty  │  │ Active    │ │
│  └──────────┘  └──────────┘  └───────────┘ │
│  Revenue: $29,850                           │
│                                             │
│  Tier 2: Regular                            │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐ │
│  │ $299     │  │ 250 qty  │  │ Active    │ │
│  └──────────┘  └──────────┘  └───────────┘ │
│  Revenue: $74,750                           │
│                                             │
│  Tier 3: VIP                                │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐ │
│  │ $499     │  │ 100 qty  │  │ Active    │ │
│  └──────────┘  └──────────┘  └───────────┘ │
│  Revenue: $49,900                           │
│                                             │
│  [+ Add Tier]                               │
│                                             │
│  Total Potential Revenue: $154,500          │
│  (0% commission • 100% yours!)              │
│                                             │
│  [Continue to Marketing →]                  │
└─────────────────────────────────────────────┘
```

### Revenue Summary
```
┌──────────────────────────────────────┐
│  💰 Revenue Breakdown                │
│                                      │
│  Early Bird: $29,850 (19%)           │
│  ████▌░░░░░░░░░░░░░░░░               │
│                                      │
│  Regular: $74,750 (48%)              │
│  ███████████▋░░░░░░░░░               │
│                                      │
│  VIP: $49,900 (33%)                  │
│  ████████░░░░░░░░░░░░                │
│                                      │
│  **Total: $154,500**                 │
│                                      │
│  With EventOS: $154,500 (0% fee)     │
│  With Eventbrite: $148,988 (3.5% fee)│
│                                      │
│  💡 You save $5,512!                 │
└──────────────────────────────────────┘
```

---

## Testing Checklist

- [ ] Single tier creation works
- [ ] Multiple tiers creation works
- [ ] Free tier (price = $0) works
- [ ] Total capacity validation works
- [ ] Tier modification works
- [ ] Tier deletion works
- [ ] Revenue calculation is correct
- [ ] Capacity overflow rejected
- [ ] Pricing validation works ($0-$10,000)
- [ ] AI suggestions match event type
- [ ] Stage completion tracked
- [ ] Automatic transition to marketing
- [ ] Ticket URLs generated correctly
- [ ] Analytics events fire properly

---

## Performance Targets

| Metric | Target | Notes |
|--------|--------|-------|
| API Response Time | < 300ms | Batch insert tiers |
| Stage Completion Rate | > 90% | Critical revenue step |
| Average Time to Complete | 60 seconds | Quick tier setup |
| Error Rate | < 2% | Validation handles edge cases |

---

## Competitive Advantage: Zero Commission

### EventOS vs. Competitors

**Example: 500 tickets at $100 each = $50,000 revenue**

| Platform | Commission | Organizer Keeps | Fee Cost |
|----------|------------|-----------------|----------|
| **EventOS** | **0%** | **$50,000** | **$0** |
| Zoho Backstage | 0% | $50,000 | $0 |
| Eventbrite | 3.5% + $1.59/ticket | $47,705 | $2,295 |
| Ticketmaster | 15%+ | $42,500 | $7,500+ |

### Marketing Message
> "Keep 100% of your ticket revenue. No hidden fees, no commission. Just pure profit for your event."

---

## Payment Processing

### Stripe Integration
```typescript
// Connect Stripe account (separate from wizard)
async function connectStripeAccount(eventId: string) {
  const { data: event } = await supabase
    .from("events")
    .select("organizer_id")
    .eq("id", eventId)
    .single();

  // Create Stripe Connect account
  const account = await stripe.accounts.create({
    type: "express",
    country: "US",
    email: event.organizer_id,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true }
    }
  });

  // Save to database
  await supabase
    .from("stripe_accounts")
    .insert({
      event_id: eventId,
      stripe_account_id: account.id,
      status: "pending"
    });

  return account;
}
```

---

## Next Stage

👉 **[Stage 5: Marketing](05-STAGE-MARKETING.md)**

Transition happens automatically after ticketing is configured.
