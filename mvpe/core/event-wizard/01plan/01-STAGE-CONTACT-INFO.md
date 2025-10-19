# Stage 1: Contact Info

## Overview

The first stage of the Event Wizard collects essential contact information and creates a CRM record before proceeding with event creation. This ensures we maintain relationship data and can follow up with organizers.

**Duration:** ~30 seconds
**Transition:** contact_info → event_basics

---

## Purpose

- Capture organizer contact details (name, email, company, role)
- Create CRM contact record in Supabase
- Initialize wizard session tracking
- Build rapport with conversational AI

---

## State Structure

```typescript
interface ContactInfoState {
  name?: string;
  email?: string;
  company?: string;
  role?: string;
}
```

---

## CopilotKit Implementation

### Hook: `useContactInfoStage.ts`

```typescript
import { useCopilotAction } from "@copilotkit/react-core";
import { useWizardState } from "../hooks/useWizardState";
import { supabase } from "@/lib/supabase";

export function useContactInfoStage() {
  const { state, updateState, goToStage, markStageComplete } = useWizardState();

  useCopilotAction({
    name: "saveContactInfo",
    description: "Save the organizer's contact information to start event creation",
    parameters: [
      {
        name: "name",
        type: "string",
        description: "Full name of the event organizer",
        required: true
      },
      {
        name: "email",
        type: "string",
        description: "Email address for event notifications",
        required: true
      },
      {
        name: "company",
        type: "string",
        description: "Company or organization name",
        required: false
      },
      {
        name: "role",
        type: "string",
        description: "Job title or role (e.g., Event Manager, Marketing Director)",
        required: false
      }
    ],
    handler: async ({ name, email, company, role }) => {
      try {
        // 1. Create or update CRM contact
        const { data: contact, error: contactError } = await supabase
          .from("crm_contacts")
          .upsert({
            name,
            email,
            company,
            role,
            contact_type: "organizer",
            source: "event_wizard",
            tags: ["wizard_user"],
            custom_fields: {
              wizard_session_id: state.sessionId,
              first_event_date: new Date().toISOString()
            }
          }, {
            onConflict: "email"
          })
          .select()
          .single();

        if (contactError) throw contactError;

        // 2. Update wizard session
        const { error: sessionError } = await supabase
          .from("wizard_sessions")
          .update({
            user_id: contact.id,
            last_activity_at: new Date().toISOString()
          })
          .eq("id", state.sessionId);

        if (sessionError) throw sessionError;

        // 3. Update global state
        updateState({
          contactInfo: { name, email, company, role },
          completedStages: [...state.completedStages, "contact_info"]
        });

        // 4. Transition to next stage
        markStageComplete("contact_info");
        goToStage("event_basics");

        // 5. Return confirmation
        return `Perfect! Thanks ${name}. Your contact info is saved. Now let's create your event! What kind of event are you planning?`;

      } catch (error) {
        console.error("Error saving contact info:", error);
        return "I encountered an issue saving your information. Could you try again?";
      }
    }
  });
}
```

---

## Conversation Flow

### User Opens Wizard
```
AI: Hi! I'm your EventOS assistant. I'll help you create an amazing event in just a few minutes.

To get started, could you tell me:
- Your name
- Email address
- Company name (optional)
- Your role (optional)
```

### User Provides Info
```
User: I'm Sarah Johnson, sarah.johnson@techcorp.com, from TechCorp, and I'm the Event Manager

AI: [Triggers saveContactInfo action]
     ↓
     Perfect! Thanks Sarah. Your contact info is saved.
     Now let's create your event! What kind of event are you planning?

     [Automatically transitions to Stage 2: Event Basics]
```

### Alternative: Partial Info
```
User: My name is John and my email is john@example.com

AI: [Triggers saveContactInfo with name + email only]
     ↓
     Great! Thanks John. I've saved your contact details.
     Ready to create an awesome event?
```

---

## Database Operations

### 1. CRM Contact Record

```sql
INSERT INTO crm_contacts (
  name,
  email,
  company,
  role,
  contact_type,
  source,
  tags,
  custom_fields
) VALUES (
  'Sarah Johnson',
  'sarah.johnson@techcorp.com',
  'TechCorp',
  'Event Manager',
  'organizer',
  'event_wizard',
  ARRAY['wizard_user'],
  '{"wizard_session_id": "uuid-here", "first_event_date": "2025-10-17"}'::jsonb
)
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  company = EXCLUDED.company,
  role = EXCLUDED.role,
  updated_at = NOW();
```

### 2. Wizard Session Update

```sql
UPDATE wizard_sessions
SET
  user_id = 'contact-uuid-here',
  stages_completed = array_append(stages_completed, 'contact_info'),
  last_activity_at = NOW(),
  total_messages = total_messages + 1
WHERE id = 'session-uuid-here';
```

---

## Validation Rules

| Field | Required | Validation | Error Message |
|-------|----------|------------|---------------|
| name | ✅ Yes | Min 2 chars | "Please provide your full name" |
| email | ✅ Yes | Valid email format | "Please provide a valid email address" |
| company | ❌ No | - | - |
| role | ❌ No | - | - |

---

## Success Criteria

- ✅ Contact record created/updated in `crm_contacts` table
- ✅ Wizard session linked to contact via `user_id`
- ✅ Global state updated with contact info
- ✅ Stage marked as complete in `stages_completed` array
- ✅ Automatic transition to `event_basics` stage
- ✅ Confirmation message displayed to user

---

## Edge Cases

### 1. Existing Email
**Scenario:** User email already exists in CRM
**Action:** Update existing record, preserve relationship history
**Message:** "Welcome back, Sarah! Let's create another great event."

### 2. Invalid Email Format
**Scenario:** User provides malformed email
**Action:** Request correction before proceeding
**Message:** "That email doesn't look quite right. Could you double-check it?"

### 3. User Abandons Stage
**Scenario:** User doesn't provide required info within 2 minutes
**Action:** Save session state, send follow-up email
**Message:** "Take your time! I'll save your progress and you can continue anytime."

---

## Analytics Events

Track these events for funnel analysis:

```typescript
// Stage started
analytics.track("wizard_stage_started", {
  stage: "contact_info",
  session_id: state.sessionId,
  timestamp: Date.now()
});

// Info collected
analytics.track("contact_info_collected", {
  has_company: !!company,
  has_role: !!role,
  session_id: state.sessionId
});

// Stage completed
analytics.track("wizard_stage_completed", {
  stage: "contact_info",
  session_id: state.sessionId,
  duration_seconds: calculateDuration()
});
```

---

## UI Components

### Desktop Layout
```
┌─────────────────────────────────────────┐
│  EventOS Wizard                    1/6  │
├─────────────────────────────────────────┤
│                                         │
│  AI Assistant:                          │
│  ┌────────────────────────────────────┐ │
│  │ Hi! I'm your EventOS assistant...  │ │
│  └────────────────────────────────────┘ │
│                                         │
│  You:                                   │
│  ┌────────────────────────────────────┐ │
│  │ Type your message...                │ │
│  └────────────────────────────────────┘ │
│                                         │
│  Progress: ●○○○○○                      │
└─────────────────────────────────────────┘
```

### Mobile Layout
```
┌──────────────────────┐
│ EventOS    [?]  1/6  │
├──────────────────────┤
│                      │
│ AI: Hi! I'm your...  │
│                      │
│ You: Sarah Johnson   │
│ sarah@techcorp.com   │
│                      │
│ ┌──────────────────┐ │
│ │ Type message...   │ │
│ └──────────────────┘ │
│                      │
│ ●○○○○○              │
└──────────────────────┘
```

---

## Testing Checklist

- [ ] Contact saved successfully with all fields
- [ ] Contact saved with only required fields (name + email)
- [ ] Duplicate email handling works correctly
- [ ] Invalid email format rejected
- [ ] Session linked to contact properly
- [ ] Stage completion tracked in database
- [ ] Automatic transition to stage 2 works
- [ ] Confirmation message displays correctly
- [ ] Analytics events fire properly
- [ ] Error handling for database failures

---

## Performance Targets

| Metric | Target | Notes |
|--------|--------|-------|
| API Response Time | < 200ms | CRM upsert + session update |
| Stage Completion Rate | > 95% | Most users provide basic info |
| Average Time to Complete | 30 seconds | Conversational flow |
| Error Rate | < 1% | Robust validation |

---

## Next Stage

👉 **[Stage 2: Event Basics](./02-STAGE-EVENT-BASICS.md)**

Transition happens automatically after contact info is saved.
