# Stage 3: Venue Selection

## Overview

Stage 3 leverages EventOS's venue marketplace to recommend and book venues. This is a key differentiator vs. Zoho Backstage, which lacks venue discovery features. The AI suggests venues based on capacity, date, location, and event type.

**Duration:** ~90 seconds
**Transition:** venue_selection → ticketing

---

## Purpose

- Recommend venues from EventOS marketplace
- Support custom venue entry (if organizer has their own)
- Create venue booking record
- Negotiate pricing (for marketplace venues)
- Link venue to event

---

## State Structure

```typescript
interface VenueSelectionState {
  venueData: {
    venueId?: string;
    venueName?: string;
    venueType?: "marketplace" | "custom";
    address?: string;
    capacity?: number;
    amenities?: string[];
    pricing?: {
      basePrice?: number;
      currency?: string;
      negotiated?: boolean;
    };
    bookingId?: string;
  };
}
```

---

## CopilotKit Implementation

### Hook: `useVenueSelectionStage.ts`

```typescript
import { useCopilotAction } from "@copilotkit/react-core";
import { useWizardState } from "../hooks/useWizardState";
import { supabase } from "@/lib/supabase";

export function useVenueSelectionStage() {
  const { state, updateState, goToStage, markStageComplete } = useWizardState();

  // Action 1: Search and recommend venues from marketplace
  useCopilotAction({
    name: "searchVenues",
    description: "Search for suitable venues in the EventOS marketplace based on event requirements",
    parameters: [
      {
        name: "location",
        type: "string",
        description: "City or region where event will be held",
        required: false
      },
      {
        name: "preferredAmenities",
        type: "string[]",
        description: "Desired amenities: projector, wifi, catering, parking, etc.",
        required: false
      }
    ],
    handler: async ({ location, preferredAmenities = [] }) => {
      try {
        // Build query based on event requirements
        let query = supabase
          .from("venues")
          .select("*")
          .gte("capacity", state.eventData.capacity) // Venues must fit attendees
          .eq("status", "active")
          .eq("marketplace_listing", true);

        if (location) {
          query = query.ilike("city", `%${location}%`);
        }

        const { data: venues, error } = await query
          .order("rating", { ascending: false })
          .limit(5);

        if (error) throw error;

        // Filter by amenities if specified
        const filteredVenues = preferredAmenities.length > 0
          ? venues.filter(v =>
              preferredAmenities.some(a => v.amenities?.includes(a))
            )
          : venues;

        // Store suggestions in state
        updateState({
          suggestions: {
            ...state.suggestions,
            venues: filteredVenues
          }
        });

        // Format response
        if (filteredVenues.length === 0) {
          return `I couldn't find marketplace venues in ${location || "your area"} for ${state.eventData.capacity} attendees. Would you like to:
1. Expand the search radius
2. Enter a custom venue you already have
3. Get help finding a venue`;
        }

        const venueList = filteredVenues.map((v, i) =>
          `${i + 1}. **${v.name}** - ${v.city}
   Capacity: ${v.capacity} | Price: $${v.base_price}/day
   Amenities: ${v.amenities?.join(", ") || "N/A"}
   Rating: ${v.rating || "N/A"} ⭐`
        ).join("\n\n");

        return `Great! I found ${filteredVenues.length} venues perfect for "${state.eventData.name}":

${venueList}

Which venue interests you? Or would you like me to show different options?`;

      } catch (error) {
        console.error("Error searching venues:", error);
        return "I had trouble searching venues. Let me try again or you can enter a custom venue.";
      }
    }
  });

  // Action 2: Select a marketplace venue
  useCopilotAction({
    name: "selectMarketplaceVenue",
    description: "Select a venue from the marketplace and create a booking request",
    parameters: [
      {
        name: "venueId",
        type: "string",
        description: "ID of the selected venue",
        required: true
      }
    ],
    handler: async ({ venueId }) => {
      try {
        // 1. Get venue details
        const { data: venue, error: venueError } = await supabase
          .from("venues")
          .select("*")
          .eq("id", venueId)
          .single();

        if (venueError) throw venueError;

        // 2. Check availability for event date
        const { data: conflicts } = await supabase
          .from("venue_bookings")
          .select("id")
          .eq("venue_id", venueId)
          .eq("status", "confirmed")
          .overlaps("event_date_range", `[${state.eventData.date},${state.eventData.date}]`);

        if (conflicts && conflicts.length > 0) {
          return `${venue.name} isn't available on ${state.eventData.date}. Would you like to:
1. Choose a different date
2. Select another venue`;
        }

        // 3. Create booking request
        const { data: booking, error: bookingError } = await supabase
          .from("venue_bookings")
          .insert({
            event_id: state.eventData.id,
            venue_id: venueId,
            event_date: state.eventData.date,
            status: "pending",
            attendee_count: state.eventData.capacity,
            requested_by: state.contactInfo.email,
            booking_source: "wizard",
            metadata: {
              wizard_session_id: state.sessionId,
              event_type: state.eventData.type
            }
          })
          .select()
          .single();

        if (bookingError) throw bookingError;

        // 4. Update event with venue
        await supabase
          .from("events")
          .update({
            venue_id: venueId,
            location: `${venue.address}, ${venue.city}`
          })
          .eq("id", state.eventData.id);

        // 5. Update wizard state
        updateState({
          venueData: {
            venueId,
            venueName: venue.name,
            venueType: "marketplace",
            address: `${venue.address}, ${venue.city}`,
            capacity: venue.capacity,
            amenities: venue.amenities,
            pricing: {
              basePrice: venue.base_price,
              currency: "USD",
              negotiated: false
            },
            bookingId: booking.id
          },
          completedStages: [...state.completedStages, "venue_selection"]
        });

        // 6. Transition to ticketing
        markStageComplete("venue_selection");
        goToStage("ticketing");

        return `Perfect! I've requested **${venue.name}** for ${state.eventData.date}.

📍 ${venue.address}, ${venue.city}
👥 Capacity: ${venue.capacity}
💰 Base price: $${venue.base_price}/day

The venue owner will review your request within 24 hours. Meanwhile, let's set up your ticketing! What ticket types would you like to offer?`;

      } catch (error) {
        console.error("Error selecting venue:", error);
        return "I had trouble booking that venue. Could you try another option?";
      }
    }
  });

  // Action 3: Add custom venue (user already has one)
  useCopilotAction({
    name: "addCustomVenue",
    description: "Add organizer's own venue details when they already have a location",
    parameters: [
      {
        name: "venueName",
        type: "string",
        description: "Name of the venue",
        required: true
      },
      {
        name: "address",
        type: "string",
        description: "Full address of venue",
        required: true
      },
      {
        name: "capacity",
        type: "number",
        description: "Maximum capacity",
        required: false
      }
    ],
    handler: async ({ venueName, address, capacity }) => {
      try {
        // Update event with custom venue
        await supabase
          .from("events")
          .update({
            location: `${venueName}, ${address}`,
            custom_venue: {
              name: venueName,
              address,
              capacity
            }
          })
          .eq("id", state.eventData.id);

        // Update wizard state
        updateState({
          venueData: {
            venueName,
            venueType: "custom",
            address,
            capacity
          },
          completedStages: [...state.completedStages, "venue_selection"]
        });

        // Transition to ticketing
        markStageComplete("venue_selection");
        goToStage("ticketing");

        return `Great! Your event will be at **${venueName}**.

📍 ${address}
${capacity ? `👥 Capacity: ${capacity}` : ""}

Now let's set up ticketing! What ticket types would you like to offer?`;

      } catch (error) {
        console.error("Error adding custom venue:", error);
        return "I had trouble saving your venue. Could you try again?";
      }
    }
  });
}
```

---

## Conversation Flow

### Scenario 1: Marketplace Venue Search
```
AI: Now let's find the perfect venue! Would you like me to suggest venues
    based on your 500 attendees, or do you already have a venue in mind?

User: Show me venues in San Francisco with good AV equipment

AI: [Triggers searchVenues action]
     ↓
     Great! I found 3 venues perfect for "AI Summit 2025":

     1. **TechHub Convention Center** - San Francisco
        Capacity: 800 | Price: $5,000/day
        Amenities: projector, wifi, stage, catering, parking
        Rating: 4.8 ⭐

     2. **Innovation Hall** - San Francisco
        Capacity: 600 | Price: $3,500/day
        Amenities: projector, wifi, breakout-rooms, catering
        Rating: 4.6 ⭐

     3. **Bay Area Conference Space** - San Francisco
        Capacity: 550 | Price: $2,800/day
        Amenities: projector, wifi, parking
        Rating: 4.5 ⭐

     Which venue interests you?

User: Let's go with TechHub Convention Center

AI: [Triggers selectMarketplaceVenue]
     ↓
     Perfect! I've requested **TechHub Convention Center** for March 15, 2025.

     📍 123 Market St, San Francisco, CA
     👥 Capacity: 800
     💰 Base price: $5,000/day

     The venue owner will review your request within 24 hours.
     Meanwhile, let's set up your ticketing!

     [Automatically transitions to Stage 4: Ticketing]
```

### Scenario 2: Custom Venue Entry
```
AI: Would you like me to suggest venues or do you already have one?

User: We're using our company office at 456 Mission St, San Francisco

AI: [Triggers addCustomVenue]
     ↓
     Great! Your event will be at **TechCorp Office**.

     📍 456 Mission St, San Francisco, CA

     Now let's set up ticketing! What ticket types would you like to offer?

     [Automatically transitions to Stage 4: Ticketing]
```

### Scenario 3: No Suitable Venues
```
AI: I couldn't find marketplace venues in Austin for 500 attendees.
    Would you like to:
    1. Expand the search radius
    2. Enter a custom venue you already have
    3. Get help finding a venue

User: Try nearby cities

AI: [Triggers searchVenues with expanded radius]
```

---

## Database Operations

### 1. Venue Search Query

```sql
SELECT *
FROM venues
WHERE
  capacity >= 500
  AND status = 'active'
  AND marketplace_listing = true
  AND city ILIKE '%San Francisco%'
  AND 'projector' = ANY(amenities)
ORDER BY rating DESC
LIMIT 5;
```

### 2. Availability Check

```sql
SELECT id
FROM venue_bookings
WHERE
  venue_id = 'venue-uuid'
  AND status = 'confirmed'
  AND event_date_range && daterange('2025-03-15', '2025-03-15', '[]');
```

### 3. Booking Request Creation

```sql
INSERT INTO venue_bookings (
  event_id,
  venue_id,
  event_date,
  status,
  attendee_count,
  requested_by,
  booking_source,
  metadata
) VALUES (
  'event-uuid',
  'venue-uuid',
  '2025-03-15',
  'pending',
  500,
  'sarah.johnson@techcorp.com',
  'wizard',
  '{"wizard_session_id": "session-uuid", "event_type": "conference"}'::jsonb
)
RETURNING *;
```

### 4. Event Update with Venue

```sql
-- Marketplace venue
UPDATE events
SET
  venue_id = 'venue-uuid',
  location = '123 Market St, San Francisco, CA'
WHERE id = 'event-uuid';

-- Custom venue
UPDATE events
SET
  location = 'TechCorp Office, 456 Mission St, San Francisco, CA',
  custom_venue = '{
    "name": "TechCorp Office",
    "address": "456 Mission St, San Francisco, CA",
    "capacity": 500
  }'::jsonb
WHERE id = 'event-uuid';
```

---

## Venue Matching Algorithm

The AI uses these factors to recommend venues:

### Primary Factors (Must Match)
- ✅ **Capacity**: Venue capacity ≥ event capacity
- ✅ **Availability**: No confirmed bookings on event date
- ✅ **Status**: Venue is active and accepting bookings

### Secondary Factors (Ranked)
- ⭐ **Rating**: Higher-rated venues ranked first
- 📍 **Location**: Proximity to requested location
- 🎯 **Amenities**: Matches requested features
- 💰 **Price**: Within budget range (if specified)
- 🏆 **Event Type Match**: Venue suited for event type

### Scoring Example
```typescript
function scoreVenue(venue: Venue, requirements: Requirements): number {
  let score = 0;

  // Rating (0-50 points)
  score += (venue.rating || 0) * 10;

  // Amenity match (0-30 points)
  const matchedAmenities = requirements.amenities.filter(a =>
    venue.amenities.includes(a)
  ).length;
  score += (matchedAmenities / requirements.amenities.length) * 30;

  // Capacity buffer (0-10 points)
  // Prefer venues not too oversized
  const buffer = venue.capacity / requirements.capacity;
  score += buffer >= 1 && buffer <= 1.5 ? 10 : 0;

  // Price competitiveness (0-10 points)
  if (requirements.budget) {
    score += venue.base_price <= requirements.budget ? 10 : 0;
  }

  return score;
}
```

---

## Validation Rules

| Field | Required | Validation | Error Message |
|-------|----------|------------|---------------|
| venueId (marketplace) | ✅ Yes | Valid UUID | "Invalid venue selected" |
| venueName (custom) | ✅ Yes | 3-100 chars | "Venue name required" |
| address (custom) | ✅ Yes | Min 10 chars | "Please provide full address" |
| capacity (custom) | ❌ No | 1-100,000 | - |

---

## Success Criteria

- ✅ Venue recommendations based on event requirements
- ✅ Availability check before booking
- ✅ Booking request created for marketplace venues
- ✅ Event linked to venue (marketplace or custom)
- ✅ Global state updated with venue data
- ✅ Stage marked complete
- ✅ Automatic transition to ticketing stage

---

## Edge Cases

### 1. Venue Unavailable on Selected Date
**Scenario:** Chosen venue is already booked
**Action:** Notify user, offer alternatives or date change
**Message:** "That venue is booked on March 15. Try April 1st or select another venue?"

### 2. No Venues Match Criteria
**Scenario:** Search returns 0 results
**Action:** Offer to expand search or add custom venue
**Message:** "No venues found. Would you like to: 1) Expand search, 2) Add your own venue?"

### 3. Incomplete Address for Custom Venue
**Scenario:** User says "our office" without full address
**Action:** Request complete address
**Message:** "Could you provide the full address for your office?"

### 4. Capacity Mismatch
**Scenario:** User selects venue smaller than attendee count
**Action:** Warn about capacity issue
**Message:** "This venue fits 300 but you expect 500 attendees. Is that okay?"

---

## Analytics Events

```typescript
// Venue search initiated
analytics.track("venue_search_started", {
  location: location || "any",
  amenities: preferredAmenities,
  event_capacity: state.eventData.capacity,
  session_id: state.sessionId
});

// Venue selected
analytics.track("venue_selected", {
  venue_id: venueId,
  venue_type: "marketplace" | "custom",
  venue_name: venueName,
  session_id: state.sessionId
});

// Booking created
analytics.track("venue_booking_created", {
  booking_id: bookingId,
  venue_id: venueId,
  event_date: eventDate,
  session_id: state.sessionId
});

// Stage completed
analytics.track("wizard_stage_completed", {
  stage: "venue_selection",
  venue_type: "marketplace" | "custom",
  session_id: state.sessionId,
  duration_seconds: calculateDuration()
});
```

---

## UI Components

### Venue Recommendation Cards
```
┌─────────────────────────────────────────────┐
│  TechHub Convention Center          4.8 ⭐  │
│  ────────────────────────────────────────   │
│  📍 123 Market St, San Francisco, CA        │
│  👥 Capacity: 800 (seats 500 comfortably)   │
│  💰 $5,000/day                              │
│                                             │
│  ✓ Projector  ✓ WiFi  ✓ Stage              │
│  ✓ Catering   ✓ Parking                     │
│                                             │
│  [View Details]      [Select Venue]         │
└─────────────────────────────────────────────┘
```

### Booking Confirmation
```
┌──────────────────────────────────────┐
│  ✅ Venue Booking Request Sent       │
│                                      │
│  TechHub Convention Center           │
│  March 15, 2025                      │
│                                      │
│  Status: Pending Review              │
│  Response expected: 24 hours         │
│                                      │
│  Next: Set up ticketing →            │
└──────────────────────────────────────┘
```

---

## Testing Checklist

- [ ] Venue search returns relevant results
- [ ] Capacity filtering works correctly
- [ ] Amenity filtering works correctly
- [ ] Location search works (city, region)
- [ ] Availability check prevents double-booking
- [ ] Marketplace venue booking created successfully
- [ ] Custom venue saved correctly
- [ ] Event linked to venue properly
- [ ] Incomplete address rejected for custom venue
- [ ] Stage completion tracked
- [ ] Automatic transition to ticketing
- [ ] Venue cards display correctly
- [ ] Analytics events fire properly

---

## Performance Targets

| Metric | Target | Notes |
|--------|--------|-------|
| Venue Search Response | < 500ms | Database query + filtering |
| Stage Completion Rate | > 85% | Some drop-off expected |
| Average Time to Complete | 90 seconds | Includes browsing venues |
| Error Rate | < 3% | Network issues, availability |

---

## Competitive Advantage

**EventOS vs. Zoho Backstage:**

| Feature | EventOS | Zoho |
|---------|---------|------|
| Venue Discovery | ✅ AI-powered marketplace | ❌ No venue search |
| Venue Recommendations | ✅ Based on capacity, date, location | ❌ Manual entry only |
| Availability Check | ✅ Real-time | ❌ N/A |
| Venue Booking | ✅ Integrated | ❌ External process |
| Custom Venue Support | ✅ Yes | ✅ Yes |

> **Key Differentiator:** EventOS is the only platform with an integrated AI-powered venue marketplace, saving organizers hours of research time.

---

## Next Stage

👉 **[Stage 4: Ticketing](./04-STAGE-TICKETING.md)**

Transition happens automatically after venue is selected.
