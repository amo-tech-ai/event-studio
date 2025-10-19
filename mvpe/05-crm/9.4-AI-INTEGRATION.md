# EventOS CRM - AI Integration Specifications

**Version:** 1.0  
**Date:** October 2025  
**Platform:** Lovable AI (Gemini 2.5 Flash)

---

## 🤖 AI Features Overview

All AI features use **Lovable AI** with the `google/gemini-2.5-flash` model (free during beta period).

---

## 1. Lead Scoring & Qualification

### Purpose
Automatically score and qualify leads based on profile and behavior data.

### Implementation

```typescript
// Edge function: supabase/functions/crm-lead-score/index.ts
const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${LOVABLE_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "google/gemini-2.5-flash",
    messages: [
      {
        role: "system",
        content: "You are a CRM lead scoring expert. Analyze leads and return a score 0-100 with reasoning."
      },
      {
        role: "user",
        content: `Score this lead:\nCompany: ${company}\nIndustry: ${industry}\nSize: ${size}\nEngagement: ${engagement}`
      }
    ]
  })
});
```

### Output Format
```json
{
  "score": 85,
  "qualification": "high",
  "reasoning": "Large company in target industry with strong engagement",
  "next_actions": [
    "Schedule discovery call",
    "Send case study",
    "Introduce to account manager"
  ]
}
```

---

## 2. Email Content Generation

### Purpose
Generate personalized email content for outreach, follow-ups, and proposals.

### Edge Function
```typescript
// supabase/functions/crm-email-generator/index.ts
const prompt = `Write a professional ${type} email to ${contactName} at ${companyName}.
Context: ${context}
Tone: ${tone}
Length: ${length} words`;

const response = await fetch(AI_ENDPOINT, {
  method: "POST",
  body: JSON.stringify({
    model: "google/gemini-2.5-flash",
    messages: [
      { role: "system", content: "You are a professional email writer for corporate events." },
      { role: "user", content: prompt }
    ]
  })
});
```

---

## 3. Meeting Summaries

### Purpose
Automatically summarize meeting notes and extract action items.

### Implementation
```typescript
const summary = await generateMeetingSummary({
  transcript: meetingTranscript,
  attendees: participants,
  duration: minutes
});

// Returns:
{
  "summary": "Discussed Q2 event planning...",
  "key_points": ["Budget approved", "Venue selected"],
  "action_items": [
    { "task": "Send proposal", "owner": "Sarah", "due": "2025-03-15" }
  ],
  "sentiment": "positive"
}
```

---

## 4. Next Best Action Recommendations

### Purpose
Suggest optimal next steps for each organizer relationship.

### Edge Function
```typescript
const recommendations = await getNextActions({
  organizerId,
  recentActivities,
  opportunities,
  engagementScore
});

// Returns prioritized action list
```

---

## 📊 AI Usage Tracking

Monitor AI usage to stay within budget:

```typescript
// Track AI calls
CREATE TABLE crm_ai_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature TEXT NOT NULL,
  tokens_used INTEGER,
  cost_estimate DECIMAL(10,4),
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

**Last Updated:** October 2025  
**Model:** google/gemini-2.5-flash (free during beta)
