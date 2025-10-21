# Stage 2: Event Basics

## Overview

Stage 2 creates the core event record with essential details: name, date, type, capacity, and description. The AI assistant helps organizers refine their event concept and generates SEO-friendly slugs.

**Duration:** ~60 seconds
**Transition:** event_basics → venue_selection

---

## Purpose

- Create event record in Supabase `events` table
- Capture essential event details
- Generate unique event slug for URL
- Provide AI suggestions for event description
- Set event to "draft" status

---

## State Structure

```typescript
interface EventBasicsState {
  eventData: {
    id?: string;
    name?: string;
    date?: string;  // ISO 8601 format
    type?: string;  // conference, workshop, meetup, etc.
    capacity?: number;
    description?: string;
    slug?: string;
  };
}
```

---

## CopilotKit Implementation

### Hook: `useEventBasicsStage.ts`

```typescript
import { useCopilotAction } from "@copilotkit/react-core";
import { useWizardState } from "../hooks/useWizardState";
import { supabase } from "@/lib/supabase";
import { generateSlug } from "@/lib/utils";

export function useEventBasicsStage() {
  const { state, updateState, goToStage, markStageComplete } = useWizardState();

  useCopilotAction({
    name: "createEvent",
    description: "Create a new event with basic information",
    parameters: [
      {
        name: "eventName",
        type: "string",
        description: "Name of the event (e.g., 'Tech Summit 2025')",
        required: true
      },
      {
        name: "eventDate",
        type: "string",
        description: "Event date in YYYY-MM-DD format",
        required: true
      },
      {
        name: "eventType",
        type: "string",
        description: "Type of event: conference, workshop, meetup, seminar, networking, fundraiser, concert, sports, festival",
        required: true
      },
      {
        name: "capacity",
        type: "number",
        description: "Expected number of attendees",
        required: true
      },
      {
        name: "description",
        type: "string",
        description: "Brief description of the event",
        required: false
      }
    ],
    handler: async ({ eventName, eventDate, eventType, capacity, description }) => {
      try {
        // 1. Generate unique slug
        const baseSlug = generateSlug(eventName);
        const slug = await ensureUniqueSlug(baseSlug);

        // 2. Create event record
        const { data: event, error: eventError } = await supabase
          .from("events")
          .insert({
            name: eventName,
            slug,
            start_date: eventDate,
            event_type: eventType,
            capacity,
            description: description || `Join us for ${eventName}`,
            status: "draft",
            visibility: "private",
            organizer_id: state.contactInfo.email, // Link to CRM
            created_via: "wizard",
            wizard_session_id: state.sessionId,
            metadata: {
              wizard_stage: "event_basics",
              contact_name: state.contactInfo.name,
              contact_company: state.contactInfo.company
            }
          })
          .select()
          .single();

        if (eventError) throw eventError;

        // 3. Update wizard session
        await supabase
          .from("wizard_sessions")
          .update({
            event_id: event.id,
            current_stage: "venue_selection",
            stages_completed: [...state.completedStages, "event_basics"],
            state: {
              ...state,
              eventData: event
            },
            last_activity_at: new Date().toISOString()
          })
          .eq("id", state.sessionId);

        // 4. Update global state
        updateState({
          eventData: {
            id: event.id,
            name: eventName,
            date: eventDate,
            type: eventType,
            capacity,
            description,
            slug
          },
          completedStages: [...state.completedStages, "event_basics"]
        });

        // 5. Transition to next stage
        markStageComplete("event_basics");
        goToStage("venue_selection");

        // 6. Return confirmation with next step
        const formattedDate = new Date(eventDate).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        });

        return `Perfect! "${eventName}" is scheduled for ${formattedDate}. I've created your event page at: eventos.com/${slug}

Now let's find the perfect venue! Would you like me to suggest venues based on your ${capacity} attendees, or do you already have a venue in mind?`;

      } catch (error) {
        console.error("Error creating event:", error);
        return "I had trouble creating your event. Could you verify the details and try again?";
      }
    }
  });

  // Helper action for AI to suggest event descriptions
  useCopilotAction({
    name: "suggestEventDescription",
    description: "Generate an engaging event description based on event type and details",
    parameters: [
      {
        name: "eventName",
        type: "string",
        required: true
      },
      {
        name: "eventType",
        type: "string",
        required: true
      },
      {
        name: "targetAudience",
        type: "string",
        required: false
      }
    ],
    handler: async ({ eventName, eventType, targetAudience }) => {
      // This is called internally by AI to generate suggestions
      const suggestions = {
        conference: `Join industry leaders at ${eventName} for cutting-edge insights, networking, and innovation.`,
        workshop: `Hands-on learning experience at ${eventName}. Gain practical skills and connect with peers.`,
        meetup: `Connect with like-minded professionals at ${eventName}. Casual networking and knowledge sharing.`,
        seminar: `Expert-led sessions at ${eventName}. Deep dive into ${targetAudience || "key topics"}.`,
        fundraiser: `Support a great cause at ${eventName}. Make a difference while enjoying an unforgettable evening.`,
        concert: `Live music experience at ${eventName}. Don't miss this incredible performance!`,
        festival: `Celebrate at ${eventName}! Food, music, entertainment for the whole community.`
      };

      return suggestions[eventType] || `Join us for an amazing experience at ${eventName}!`;
    }
  });
}

// Helper function to ensure slug uniqueness
async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const { data } = await supabase
      .from("events")
      .select("slug")
      .eq("slug", slug)
      .single();

    if (!data) return slug; // Slug is unique

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}
```

---

## Conversation Flow

### Natural Language Input
```
AI: Perfect! Thanks Sarah. Now let's create your event!
    What kind of event are you planning?

User: We're hosting a tech conference called "AI Summit 2025" on March 15th for about 500 people

AI: [Triggers createEvent action]
     ↓
     Extracts:
     - eventName: "AI Summit 2025"
     - eventDate: "2025-03-15"
     - eventType: "conference"
     - capacity: 500

     Perfect! "AI Summit 2025" is scheduled for Saturday, March 15, 2025.
     I've created your event page at: eventos.com/ai-summit-2025

     Now let's find the perfect venue! Would you like me to suggest venues
     based on your 500 attendees, or do you already have a venue in mind?

     [Automatically transitions to Stage 3: Venue Selection]
```

### Clarifying Questions
```
User: I want to create a workshop

AI: Great! A workshop is perfect for hands-on learning.

    Could you tell me:
    - What's the workshop name?
    - When are you planning it?
    - How many participants?

User: "React Masterclass" on April 20th for 30 people

AI: [Triggers createEvent]
     ↓
     Awesome! "React Masterclass" is set for April 20th with 30 participants.
     Your event page: eventos.com/react-masterclass

     For a workshop of 30, I'd recommend a venue with:
     - Hands-on workstation setup
     - Projector/screen
     - Breakout space

     Let me show you some options...
```

---

## Database Operations

### 1. Event Creation

```sql
INSERT INTO events (
  name,
  slug,
  start_date,
  event_type,
  capacity,
  description,
  status,
  visibility,
  organizer_id,
  created_via,
  wizard_session_id,
  metadata
) VALUES (
  'AI Summit 2025',
  'ai-summit-2025',
  '2025-03-15',
  'conference',
  500,
  'Join industry leaders at AI Summit 2025 for cutting-edge insights...',
  'draft',
  'private',
  'sarah.johnson@techcorp.com',
  'wizard',
  'session-uuid-here',
  '{
    "wizard_stage": "event_basics",
    "contact_name": "Sarah Johnson",
    "contact_company": "TechCorp"
  }'::jsonb
)
RETURNING *;
```

### 2. Slug Uniqueness Check

```sql
SELECT slug
FROM events
WHERE slug = 'ai-summit-2025';

-- If exists, try: 'ai-summit-2025-1', 'ai-summit-2025-2', etc.
```

### 3. Session Update

```sql
UPDATE wizard_sessions
SET
  event_id = 'event-uuid-here',
  current_stage = 'venue_selection',
  stages_completed = array_append(stages_completed, 'event_basics'),
  state = jsonb_set(state, '{eventData}', '{"id": "uuid", "name": "AI Summit 2025", ...}'::jsonb),
  last_activity_at = NOW(),
  total_messages = total_messages + 2
WHERE id = 'session-uuid-here';
```

---

## Event Types

| Type | Description | Typical Capacity | Default Duration |
|------|-------------|------------------|------------------|
| conference | Multi-track professional event | 200-5000 | 1-3 days |
| workshop | Hands-on training session | 10-50 | 2-8 hours |
| meetup | Informal networking gathering | 20-100 | 2-3 hours |
| seminar | Educational presentation | 30-200 | 2-4 hours |
| networking | Professional networking event | 50-300 | 2-3 hours |
| fundraiser | Charity/nonprofit event | 100-500 | 3-4 hours |
| concert | Live music performance | 100-10000 | 2-4 hours |
| sports | Athletic competition | 50-50000 | 2-6 hours |
| festival | Community celebration | 500-50000 | 1-3 days |

---

## Validation Rules

| Field | Required | Validation | Error Message |
|-------|----------|------------|---------------|
| eventName | ✅ Yes | 3-100 chars | "Event name must be 3-100 characters" |
| eventDate | ✅ Yes | Future date | "Event date must be in the future" |
| eventType | ✅ Yes | Valid type from list | "Please select a valid event type" |
| capacity | ✅ Yes | 1-100,000 | "Capacity must be between 1 and 100,000" |
| description | ❌ No | 10-500 chars | Auto-generated if not provided |

---

## AI Suggestions

The AI provides contextual suggestions based on event type:

### For Conferences:
```typescript
suggestions: {
  description: "Multi-day industry event with keynotes, workshops, and networking",
  recommendedVenueFeatures: ["breakout rooms", "main auditorium", "exhibition space"],
  ticketTiers: ["Early Bird", "Regular", "VIP"],
  marketingChannels: ["LinkedIn", "Industry newsletters", "Professional associations"]
}
```

### For Workshops:
```typescript
suggestions: {
  description: "Hands-on learning with expert instructors",
  recommendedVenueFeatures: ["workstations", "projector", "whiteboards"],
  ticketTiers: ["Standard", "Materials Included"],
  marketingChannels: ["Meetup", "Facebook", "Email"]
}
```

---

## Success Criteria

- ✅ Event record created in `events` table with status "draft"
- ✅ Unique slug generated (handles conflicts gracefully)
- ✅ Wizard session linked to event via `event_id`
- ✅ Global state updated with complete event data
- ✅ Stage marked complete in `stages_completed`
- ✅ Automatic transition to `venue_selection` stage
- ✅ Confirmation message includes event URL

---

## Edge Cases

### 1. Slug Collision
**Scenario:** Event name "Summer Festival" already exists
**Action:** Append counter: `summer-festival-1`, `summer-festival-2`, etc.
**Message:** "I've created your event at: eventos.com/summer-festival-2"

### 2. Past Date Provided
**Scenario:** User says "yesterday" or provides past date
**Action:** Clarify and request future date
**Message:** "Events must be scheduled for future dates. When would you like to hold this event?"

### 3. Unrealistic Capacity
**Scenario:** User says "10 million attendees"
**Action:** Validate and suggest realistic number
**Message:** "That's quite ambitious! Let's start with a more manageable number. How many do you realistically expect?"

### 4. Vague Event Type
**Scenario:** User says "a gathering"
**Action:** Ask clarifying questions
**Message:** "What kind of gathering? Would you call it a conference, workshop, meetup, or something else?"

---

## Analytics Events

```typescript
// Stage started
analytics.track("wizard_stage_started", {
  stage: "event_basics",
  session_id: state.sessionId
});

// Event type selected
analytics.track("event_type_selected", {
  event_type: eventType,
  capacity,
  session_id: state.sessionId
});

// Event created
analytics.track("event_created", {
  event_id: event.id,
  event_type: eventType,
  capacity,
  has_description: !!description,
  session_id: state.sessionId
});

// Stage completed
analytics.track("wizard_stage_completed", {
  stage: "event_basics",
  session_id: state.sessionId,
  duration_seconds: calculateDuration()
});
```

---

## UI Components

### Progress Indicator
```
Contact Info  →  [Event Basics]  →  Venue  →  Tickets  →  Marketing  →  Review
    ●                  ●              ○         ○           ○            ○
```

### Event Preview Card
```
┌──────────────────────────────────────┐
│  🎯 AI Summit 2025                   │
│                                      │
│  📅 Saturday, March 15, 2025         │
│  👥 500 attendees                    │
│  🏢 Conference                       │
│                                      │
│  🔗 eventos.com/ai-summit-2025       │
│                                      │
│  Status: Draft • Private             │
└──────────────────────────────────────┘
```

---

## Testing Checklist

- [ ] Event created with all required fields
- [ ] Unique slug generated correctly
- [ ] Duplicate slug handling works (adds -1, -2, etc.)
- [ ] Past dates rejected
- [ ] Invalid event types rejected
- [ ] Capacity validation works (1-100,000)
- [ ] Description auto-generated when not provided
- [ ] Event linked to organizer correctly
- [ ] Session updated with event_id
- [ ] Stage completion tracked
- [ ] Automatic transition to stage 3
- [ ] Event URL displayed in confirmation
- [ ] Analytics events fire correctly

---

## Performance Targets

| Metric | Target | Notes |
|--------|--------|-------|
| API Response Time | < 300ms | Insert + slug check |
| Stage Completion Rate | > 90% | Clear value proposition |
| Average Time to Complete | 60 seconds | Conversational efficiency |
| Error Rate | < 2% | Robust validation |

---

## SEO & URL Structure

### Slug Generation Rules
```typescript
function generateSlug(eventName: string): string {
  return eventName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')  // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, '')       // Remove leading/trailing hyphens
    .substring(0, 60);             // Limit to 60 chars
}

// Examples:
// "AI Summit 2025" → "ai-summit-2025"
// "React & Node.js Workshop!" → "react-node-js-workshop"
// "Summer Music Festival 🎵" → "summer-music-festival"
```

### URL Structure
```
Production: https://eventos.com/{slug}
Preview: https://preview.eventos.com/{slug}
Draft: https://draft.eventos.com/{slug}
```

---

## Next Stage

👉 **[Stage 3: Venue Selection](03-STAGE-VENUE-SELECTION.md)**

Transition happens automatically after event is created.
