# Stage 5: Marketing

## Overview

Stage 5 uses AI to generate comprehensive marketing content across multiple channels. This is a key differentiator vs. Zoho (Marketing score: EventOS 9/10, Zoho 5/10), with WhatsApp campaigns being unique to EventOS.

**Duration:** ~90 seconds
**Transition:** marketing → review

---

## Purpose

- Generate AI-powered event landing page
- Create email campaign templates
- Generate social media posts (LinkedIn, Twitter, Facebook, Instagram)
- Set up WhatsApp broadcast campaigns (unique to EventOS)
- Create promotional graphics descriptions
- Schedule content calendar

---

## State Structure

```typescript
interface MarketingState {
  marketingData: {
    campaignId?: string;
    content: {
      landingPage?: {
        headline: string;
        subheadline: string;
        description: string;
        cta: string;
      };
      emails?: Array<{
        type: "announcement" | "reminder" | "last_chance";
        subject: string;
        body: string;
        sendDate?: string;
      }>;
      socialPosts?: Array<{
        platform: "linkedin" | "twitter" | "facebook" | "instagram";
        content: string;
        hashtags?: string[];
      }>;
      whatsappMessages?: Array<{
        type: "announcement" | "reminder";
        message: string;
        sendDate?: string;
      }>;
    };
    channels: string[];
  };
}
```

---

## CopilotKit Implementation

### Hook: `useMarketingStage.ts`

```typescript
import { useCopilotAction } from "@copilotkit/react-core";
import { useWizardState } from "../hooks/useWizardState";
import { supabase } from "@/lib/supabase";
import { generateMarketingContent } from "@/lib/ai-marketing";

export function useMarketingStage() {
  const { state, updateState, goToStage, markStageComplete } = useWizardState();

  // Action 1: Generate all marketing content with AI
  useCopilotAction({
    name: "generateMarketingContent",
    description: "AI generates landing page, emails, social posts, and WhatsApp messages for the event",
    parameters: [
      {
        name: "tone",
        type: "string",
        description: "Marketing tone: professional, casual, exciting, formal",
        required: false
      },
      {
        name: "targetAudience",
        type: "string",
        description: "Who is the target audience? (e.g., tech professionals, students, executives)",
        required: false
      },
      {
        name: "keyMessage",
        type: "string",
        description: "Main message or value proposition",
        required: false
      }
    ],
    handler: async ({ tone = "professional", targetAudience, keyMessage }) => {
      try {
        // Gather context for AI generation
        const context = {
          eventName: state.eventData.name,
          eventType: state.eventData.type,
          eventDate: state.eventData.date,
          capacity: state.eventData.capacity,
          venueName: state.venueData.venueName,
          location: state.venueData.address,
          ticketTiers: state.ticketingData.tiers,
          tone,
          targetAudience: targetAudience || getDefaultAudience(state.eventData.type),
          keyMessage: keyMessage || `Join us for ${state.eventData.name}`
        };

        // Generate content using AI
        const generatedContent = await generateMarketingContent(context);

        // Create marketing campaign record
        const { data: campaign, error: campaignError } = await supabase
          .from("marketing_campaigns")
          .insert({
            event_id: state.eventData.id,
            name: `${state.eventData.name} - Launch Campaign`,
            status: "draft",
            channels: ["email", "social", "whatsapp"],
            content: generatedContent,
            metadata: {
              wizard_session_id: state.sessionId,
              generated_by: "ai",
              tone,
              target_audience: targetAudience
            }
          })
          .select()
          .single();

        if (campaignError) throw campaignError;

        // Save email templates
        const emailPromises = generatedContent.emails.map(email =>
          supabase.from("email_templates").insert({
            campaign_id: campaign.id,
            name: `${email.type} - ${state.eventData.name}`,
            subject: email.subject,
            body: email.body,
            template_type: email.type,
            status: "draft"
          })
        );

        await Promise.all(emailPromises);

        // Update wizard state
        updateState({
          marketingData: {
            campaignId: campaign.id,
            content: generatedContent,
            channels: ["email", "social", "whatsapp"]
          },
          completedStages: [...state.completedStages, "marketing"]
        });

        // Transition to review
        markStageComplete("marketing");
        goToStage("review");

        // Return preview of generated content
        return `Perfect! I've created a complete marketing campaign for "${state.eventData.name}":

📄 **Landing Page**
Headline: "${generatedContent.landingPage.headline}"
${generatedContent.landingPage.description.substring(0, 100)}...

📧 **Email Campaigns** (${generatedContent.emails.length} templates)
• Launch announcement
• 1-week reminder
• Last chance (24 hours before)

📱 **Social Media** (${generatedContent.socialPosts.length} posts)
• LinkedIn, Twitter, Facebook, Instagram

💬 **WhatsApp Broadcasts** (${generatedContent.whatsappMessages.length} messages)
• Event announcement
• Ticket reminders

Ready to review everything and launch your event?`;

      } catch (error) {
        console.error("Error generating marketing content:", error);
        return "I had trouble generating your marketing content. Could you try again?";
      }
    }
  });

  // Action 2: Customize specific marketing element
  useCopilotAction({
    name: "customizeMarketingElement",
    description: "Modify a specific piece of marketing content (headline, email, social post, etc.)",
    parameters: [
      {
        name: "elementType",
        type: "string",
        description: "Type of element: landing_headline, email_subject, social_post, whatsapp_message",
        required: true
      },
      {
        name: "elementId",
        type: "string",
        description: "Identifier for the specific element",
        required: false
      },
      {
        name: "newContent",
        type: "string",
        description: "New content for the element",
        required: true
      }
    ],
    handler: async ({ elementType, elementId, newContent }) => {
      try {
        // Update the specific element in campaign content
        const currentContent = state.marketingData.content;

        switch (elementType) {
          case "landing_headline":
            currentContent.landingPage.headline = newContent;
            break;
          case "email_subject":
            const emailIndex = currentContent.emails.findIndex(e => e.type === elementId);
            if (emailIndex !== -1) {
              currentContent.emails[emailIndex].subject = newContent;
            }
            break;
          case "social_post":
            const postIndex = currentContent.socialPosts.findIndex(p => p.platform === elementId);
            if (postIndex !== -1) {
              currentContent.socialPosts[postIndex].content = newContent;
            }
            break;
        }

        // Update database
        await supabase
          .from("marketing_campaigns")
          .update({ content: currentContent })
          .eq("id", state.marketingData.campaignId);

        // Update state
        updateState({
          marketingData: {
            ...state.marketingData,
            content: currentContent
          }
        });

        return `Updated ${elementType}! Your content now reads: "${newContent}"`;

      } catch (error) {
        console.error("Error customizing element:", error);
        return "I had trouble updating that content. Could you try again?";
      }
    }
  });

  // Action 3: Preview marketing content
  useCopilotAction({
    name: "previewMarketingContent",
    description: "Show preview of specific marketing content (landing page, email, social post)",
    parameters: [
      {
        name: "contentType",
        type: "string",
        description: "Type: landing_page, emails, social_posts, whatsapp",
        required: true
      }
    ],
    handler: async ({ contentType }) => {
      const content = state.marketingData.content;

      switch (contentType) {
        case "landing_page":
          return `**Landing Page Preview**

**${content.landingPage.headline}**
${content.landingPage.subheadline}

${content.landingPage.description}

[${content.landingPage.cta}]`;

        case "emails":
          return content.emails.map((email, i) =>
            `**Email ${i + 1}: ${email.type}**
Subject: ${email.subject}

${email.body.substring(0, 200)}...
${email.sendDate ? `Scheduled: ${email.sendDate}` : "Draft"}`
          ).join("\n\n");

        case "social_posts":
          return content.socialPosts.map((post, i) =>
            `**${post.platform.toUpperCase()} Post**
${post.content}
${post.hashtags ? `\n${post.hashtags.join(" ")}` : ""}`
          ).join("\n\n");

        case "whatsapp":
          return content.whatsappMessages.map((msg, i) =>
            `**WhatsApp ${msg.type}**
${msg.message}
${msg.sendDate ? `Send: ${msg.sendDate}` : "Draft"}`
          ).join("\n\n");

        default:
          return "Unknown content type. Try: landing_page, emails, social_posts, or whatsapp";
      }
    }
  });
}

// Helper to get default audience based on event type
function getDefaultAudience(eventType: string): string {
  const audiences = {
    conference: "industry professionals and thought leaders",
    workshop: "practitioners looking to build hands-on skills",
    meetup: "community members and enthusiasts",
    seminar: "professionals seeking specialized knowledge",
    networking: "business professionals and entrepreneurs",
    fundraiser: "donors and community supporters",
    concert: "music fans and entertainment seekers",
    festival: "families and community members"
  };
  return audiences[eventType] || "event attendees";
}
```

---

## AI Content Generation

### Landing Page Template
```typescript
const landingPageTemplate = {
  headline: "Transform Your [SKILL] in One Day",
  subheadline: "Join [NUMBER] professionals at [EVENT_NAME]",
  description: `
    [EVENT_NAME] brings together the brightest minds in [INDUSTRY] for
    a day of learning, networking, and innovation.

    What You'll Experience:
    • [BENEFIT_1]
    • [BENEFIT_2]
    • [BENEFIT_3]

    Don't miss this opportunity to [VALUE_PROPOSITION].
  `,
  cta: "Register Now - Early Bird Pricing Ends Soon!"
};
```

### Email Campaign Templates

**1. Launch Announcement**
```
Subject: 🎯 You're Invited: [EVENT_NAME] on [DATE]

Hi [NAME],

We're excited to announce [EVENT_NAME] - [ONE_LINE_DESCRIPTION].

📅 When: [DATE] at [TIME]
📍 Where: [VENUE_NAME], [CITY]
👥 Who: [TARGET_AUDIENCE]

Early Bird tickets are now available! Save [DISCOUNT]% when you register today.

[KEY_HIGHLIGHTS]

Reserve your spot: [TICKET_URL]

See you there!
[ORGANIZER_NAME]

P.S. Only [EARLY_BIRD_COUNT] Early Bird tickets remaining!
```

**2. One-Week Reminder**
```
Subject: ⏰ One Week Until [EVENT_NAME]!

Hi [NAME],

[EVENT_NAME] is just 7 days away! Here's everything you need to know:

📅 Date: [DATE]
⏰ Time: [TIME] (Doors open at [DOORS_TIME])
📍 Location: [VENUE_ADDRESS]

What to Expect:
• [AGENDA_HIGHLIGHT_1]
• [AGENDA_HIGHLIGHT_2]
• [AGENDA_HIGHLIGHT_3]

Haven't registered yet? Last chance to join: [TICKET_URL]

See you next week!
```

**3. Last Chance (24 Hours)**
```
Subject: 🚨 Last Chance: [EVENT_NAME] Tomorrow!

[NAME],

This is it - [EVENT_NAME] starts tomorrow!

Final tickets available: [REMAINING_TICKETS] left

Tomorrow's schedule:
[TIME_1]: [SESSION_1]
[TIME_2]: [SESSION_2]
[TIME_3]: [SESSION_3]

Don't miss out: [TICKET_URL]

Questions? Reply to this email.

Tomorrow, [TIME] at [VENUE]!
```

---

## Social Media Content

### LinkedIn (Professional)
```
🎯 Excited to announce [EVENT_NAME]!

Join us on [DATE] for [SHORT_DESCRIPTION].

Perfect for:
✓ [TARGET_1]
✓ [TARGET_2]
✓ [TARGET_3]

What you'll gain:
• [BENEFIT_1]
• [BENEFIT_2]
• [BENEFIT_3]

Limited spots available. Register now: [URL]

#[INDUSTRY] #[EVENT_TYPE] #[CITY] #ProfessionalDevelopment
```

### Twitter (Concise)
```
🚀 [EVENT_NAME] | [DATE]

[ONE_LINE_VALUE_PROP]

Early Bird: $[PRICE]
Location: [CITY]

Register → [SHORT_URL]

#[HASHTAG1] #[HASHTAG2]
```

### Instagram (Visual + Engaging)
```
✨ Mark your calendars! ✨

[EVENT_NAME] is coming to [CITY] on [DATE]!

🎤 [SPEAKER_COUNT]+ expert speakers
💡 [SESSION_COUNT]+ actionable sessions
🤝 Unlimited networking

Tag someone who needs to be there! 👇

Link in bio to register

#[EVENT_NAME] #[CITY]Events #[INDUSTRY] #Networking
```

### Facebook (Community)
```
📣 Event Announcement!

We're thrilled to invite you to [EVENT_NAME]!

When: [DATE] at [TIME]
Where: [VENUE_NAME], [CITY]
Who should attend: [TARGET_AUDIENCE]

This is more than just an event - it's a chance to:
🌟 [BENEFIT_1]
🌟 [BENEFIT_2]
🌟 [BENEFIT_3]

Bring a friend and save [DISCOUNT]% with code: FRIEND

Get tickets: [URL]

See you there! 🎉
```

---

## WhatsApp Campaigns (EventOS Exclusive)

### Event Announcement
```
🎉 *[EVENT_NAME]*

Hi [NAME]! You're invited to our upcoming [EVENT_TYPE]:

📅 *[DATE]* at [TIME]
📍 *[VENUE_NAME]*, [CITY]

Why attend?
✓ [BENEFIT_1]
✓ [BENEFIT_2]
✓ [BENEFIT_3]

🎟️ Register now: [SHORT_URL]

Early Bird pricing ends [DATE]!

Questions? Just reply to this message.
```

### Reminder (3 Days Before)
```
👋 Hi [NAME]!

Reminder: *[EVENT_NAME]* is in 3 days!

📅 [DAY], [DATE] at [TIME]
📍 [VENUE_NAME]

What to bring:
• Your ticket (check your email)
• Business cards
• An open mind 😊

See you there! 🎉
```

---

## Conversation Flow

```
AI: Perfect! Your ticketing is set up. Now let's create marketing
    content to promote your event!

    Would you like me to generate a complete marketing campaign?

User: Yes, make it professional and target tech professionals

AI: [Triggers generateMarketingContent]
     ↓
     Perfect! I've created a complete marketing campaign for "AI Summit 2025":

     📄 Landing Page
     Headline: "Transform Your AI Skills: Learn From Industry Leaders"
     [Preview...]

     📧 Email Campaigns (3 templates)
     • Launch announcement
     • 1-week reminder
     • Last chance (24 hours before)

     📱 Social Media (8 posts)
     • LinkedIn, Twitter, Facebook, Instagram

     💬 WhatsApp Broadcasts (2 messages)
     • Event announcement
     • Ticket reminders

     Ready to review everything and launch your event?

User: Yes, let's review

AI: [Transitions to Stage 6: Review]
```

---

## Database Operations

### 1. Create Marketing Campaign

```sql
INSERT INTO marketing_campaigns (
  event_id,
  name,
  status,
  channels,
  content,
  metadata
) VALUES (
  'event-uuid',
  'AI Summit 2025 - Launch Campaign',
  'draft',
  ARRAY['email', 'social', 'whatsapp'],
  '{
    "landingPage": {...},
    "emails": [...],
    "socialPosts": [...],
    "whatsappMessages": [...]
  }'::jsonb,
  '{
    "wizard_session_id": "session-uuid",
    "generated_by": "ai",
    "tone": "professional",
    "target_audience": "tech professionals"
  }'::jsonb
)
RETURNING *;
```

### 2. Create Email Templates

```sql
INSERT INTO email_templates (
  campaign_id,
  name,
  subject,
  body,
  template_type,
  status
) VALUES
  (
    'campaign-uuid',
    'announcement - AI Summit 2025',
    '🎯 You''re Invited: AI Summit 2025',
    '[EMAIL_BODY]',
    'announcement',
    'draft'
  ),
  (
    'campaign-uuid',
    'reminder - AI Summit 2025',
    '⏰ One Week Until AI Summit!',
    '[EMAIL_BODY]',
    'reminder',
    'draft'
  );
```

### 3. Schedule WhatsApp Campaign

```sql
INSERT INTO whatsapp_campaigns (
  event_id,
  campaign_id,
  message,
  scheduled_for,
  status,
  target_audience
) VALUES (
  'event-uuid',
  'campaign-uuid',
  '[WHATSAPP_MESSAGE]',
  '2025-03-01 09:00:00',
  'scheduled',
  'all_contacts'
);
```

---

## Success Criteria

- ✅ Landing page content generated
- ✅ Email campaign templates created (3 minimum)
- ✅ Social media posts generated (4+ platforms)
- ✅ WhatsApp messages created (unique to EventOS)
- ✅ Marketing campaign record created
- ✅ Content saved to database
- ✅ Global state updated with marketing data
- ✅ Stage marked complete
- ✅ Automatic transition to review stage

---

## Edge Cases

### 1. User Wants Different Tone
**Scenario:** User doesn't like professional tone
**Action:** Regenerate with new tone
**Message:** "What tone would you prefer? Options: casual, exciting, formal, friendly"

### 2. Content Too Generic
**Scenario:** AI generates generic content
**Action:** Request more context
**Message:** "To make this more engaging, tell me: What makes this event unique?"

### 3. User Has Existing Brand Guidelines
**Scenario:** User mentions brand guidelines
**Action:** Request guidelines document
**Message:** "Share your brand guidelines and I'll match the tone and style"

---

## Analytics Events

```typescript
// Content generation started
analytics.track("marketing_generation_started", {
  event_id: state.eventData.id,
  tone,
  target_audience: targetAudience,
  session_id: state.sessionId
});

// Content generated
analytics.track("marketing_content_generated", {
  event_id: state.eventData.id,
  channels: ["email", "social", "whatsapp"],
  num_emails: emails.length,
  num_social_posts: socialPosts.length,
  num_whatsapp: whatsappMessages.length,
  session_id: state.sessionId
});

// Stage completed
analytics.track("wizard_stage_completed", {
  stage: "marketing",
  channels_enabled: channels.length,
  session_id: state.sessionId,
  duration_seconds: calculateDuration()
});
```

---

## Performance Targets

| Metric | Target | Notes |
|--------|--------|-------|
| Content Generation Time | < 3 seconds | AI generation |
| Stage Completion Rate | > 80% | Some customize content |
| Average Time to Complete | 90 seconds | Includes review/edits |
| Content Quality Score | > 8/10 | User ratings |

---

## Competitive Advantage

**EventOS vs. Zoho Marketing Capabilities:**

| Feature | EventOS | Zoho |
|---------|---------|------|
| AI Content Generation | ✅ Full automation | ❌ Manual only |
| Email Campaigns | ✅ Templates + AI | ✅ Basic templates |
| Social Media Posts | ✅ Multi-platform AI | ⚠️ Limited |
| WhatsApp Integration | ✅ **Unique!** | ❌ Not available |
| Landing Page Builder | ✅ AI-generated | ✅ Manual builder |
| Content Personalization | ✅ AI-powered | ⚠️ Limited |
| Multi-channel Coordination | ✅ Unified campaign | ❌ Separate tools |

> **Key Differentiator:** EventOS is the only event platform with AI-powered WhatsApp marketing campaigns, reaching attendees on their preferred messaging platform.

---

## Testing Checklist

- [ ] Landing page content generated correctly
- [ ] Email templates created with proper formatting
- [ ] Social posts match platform character limits
- [ ] WhatsApp messages use proper formatting
- [ ] Tone matches user preference
- [ ] Content personalization works (names, dates)
- [ ] Campaign record created in database
- [ ] Templates saved correctly
- [ ] Content preview displays properly
- [ ] Customization/editing works
- [ ] Stage completion tracked
- [ ] Automatic transition to review
- [ ] Analytics events fire properly

---

## Next Stage

👉 **[Stage 6: Review & Launch](06-STAGE-REVIEW-LAUNCH.md)**

Transition happens automatically after marketing content is generated.
