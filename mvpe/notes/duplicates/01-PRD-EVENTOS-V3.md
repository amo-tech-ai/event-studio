# EventOS - Product Requirements Document (PRD) V3.0

**Version:** 3.0
**Date:** October 2025
**Project:** EventOS - AI-Powered Business Event Management Platform
**Primary Market:** Business Events, Corporate Events, Marketing Activations
**Tech Stack:** Supabase + CopilotKit + OpenAI SDK
**Status:** Architecture Ready

---

## 1. Executive Summary

### Project Name
**EventOS** - The AI-Powered Business Event Management Platform

### Purpose
Transform business event planning from weeks of coordination into minutes of AI-powered conversation. EventOS combines intelligent CopilotKit state machines, OpenAI agents, and Supabase infrastructure to deliver end-to-end event management for corporate events, marketing activations, product launches, galas, and sponsor-driven experiences.

### Technology Stack

**Core Infrastructure**
- **Database:** Supabase PostgreSQL with RLS
- **Auth:** Supabase Auth (email, Google SSO, phone)
- **Storage:** Supabase Storage buckets
- **Realtime:** Supabase Realtime for live updates
- **Edge Functions:** Supabase Edge Functions (Deno runtime)

**AI & Automation**
- **AI Chat Interface:** CopilotKit (React SDK)
- **State Machine:** CopilotKit State Machine for event wizard
- **AI Models:** OpenAI SDK (GPT-4, GPT-4o for advanced reasoning)
- **Voice AI:** ElevenLabs (optional voice interface)

**Frontend**
- **Framework:** React 18 + TypeScript 5.3 + Vite 5.0
- **UI Library:** shadcn/ui + Tailwind CSS 3.4
- **State:** Zustand + React Query
- **Forms:** React Hook Form + Zod validation

**Communication**
- **WhatsApp:** WhatsApp Business API (direct integration)
- **Email:** Resend API
- **SMS:** Twilio (optional)

**Payments**
- **Processing:** Stripe Connect
- **Canadian compliance:** GST/PST/HST support

### High-Level Vision
Become the leading platform for business event management by combining AI-powered planning, sponsor CRM, WhatsApp automation, and real-time analytics. EventOS handles everything from initial concept through execution, sponsor management, marketing activations, and post-event reporting.

### Business Impact

**Time Transformation**
- Event Planning: 3 weeks → 10 minutes (99.2% reduction)
- Sponsor Outreach: 40 hours → 2 hours (95% reduction)
- Marketing Content: 8 hours → 15 minutes (97% reduction)
- WhatsApp Coordination: 20 hours → 0 hours (100% automated)

**Financial Targets**
- Year 1 Revenue: $2.5M ARR
- Average Event Value: $25,000 - $125,000
- Platform Margin: 15-20%
- Sponsor Commission: 10-15%

**Market Penetration**
- Year 1 Clients: 200+ organizations
- Events Per Client: 6-12 annually
- Geographic Coverage: North America
- Target Segments: Corporate, Marketing Agencies, Event Production Companies

---

## 2. Core Features & Use Cases

### 2.1 AI Event Wizard (CopilotKit State Machine)

**Overview:**
Conversational event creation using CopilotKit state machine that guides users through event planning with AI assistance.

**State Machine Flow:**
```typescript
// Event Creation States
type EventWizardState =
  | { state: "basics"; data: EventBasics }
  | { state: "venue"; data: VenueSelection }
  | { state: "ticketing"; data: TicketConfig }
  | { state: "sponsors"; data: SponsorConfig }
  | { state: "marketing"; data: MarketingConfig }
  | { state: "review"; data: CompleteEvent };

// CopilotKit Configuration
const eventWizard = useCopilotChatState<EventWizardState>({
  initialState: { state: "basics", data: {} },
  transitions: {
    basics: ["venue"],
    venue: ["ticketing"],
    ticketing: ["sponsors", "marketing"],
    sponsors: ["marketing"],
    marketing: ["review"],
    review: ["complete"]
  }
});
```

**Real-World Example 1: Product Launch Event**

**User:** "I need to plan a product launch for our new SaaS platform in Toronto for 300 attendees in March"

**AI Response (via CopilotKit):**
```
Great! I'll help you create a product launch event. Let me gather some details:

Event Type: Product Launch
Location: Toronto
Expected Attendees: 300
Timeframe: March 2026

Based on this, I recommend:
✓ Venue: Toronto Convention Centre (Section B - 400 capacity)
✓ Date: March 15, 2026 (optimal for tech launches)
✓ Budget Range: $45,000 - $75,000

Would you like me to:
1. Set up ticketing with early bird pricing
2. Find potential sponsors (tech companies, VCs)
3. Generate landing page and marketing materials

How would you like to proceed?
```

**Acceptance Criteria:**
- [ ] Event created in <5 user messages
- [ ] AI suggests venues with availability
- [ ] Auto-generates budget breakdown
- [ ] Saves progress at each state transition
- [ ] Resume from any point in conversation

---

### 2.2 Venue Search & Booking System

**Overview:**
AI-powered venue matching with availability checking, capacity validation, and booking management.

**Features:**
- Real-time availability calendar
- AI-powered venue recommendations
- Capacity and amenity matching
- Multi-space booking (breakout rooms, reception areas)
- Venue comparison tool
- Contract generation and e-signature
- Automated confirmation emails

**Database Schema:**
```sql
CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  address JSONB NOT NULL, -- {street, city, province, postal_code, country}
  capacity_seated INTEGER,
  capacity_standing INTEGER,
  spaces JSONB[], -- [{name, capacity, sq_ft, amenities[]}]
  amenities TEXT[], -- ["wifi", "av_equipment", "catering", "parking"]
  pricing JSONB, -- {base_rate, hourly_rate, day_rate, weekend_rate}
  images TEXT[],
  availability_calendar JSONB, -- {date: {available, booked_event_id}}
  contact_info JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE venue_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  venue_id UUID REFERENCES venues(id),
  spaces TEXT[], -- Space names booked
  start_datetime TIMESTAMPTZ NOT NULL,
  end_datetime TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, confirmed, cancelled
  contract_url TEXT,
  contract_signed BOOLEAN DEFAULT false,
  total_cost NUMERIC,
  deposit_paid NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Real-World Example 2: Corporate Gala**

**User:** "Find a luxury venue in Vancouver for a gala dinner, 200 guests, premium catering required"

**AI Agent Process:**
1. Query venues with:
   - Location: Vancouver
   - Capacity: 200-250 (add buffer)
   - Amenities: catering kitchen, premium dining setup
   - Category: luxury, high-end
2. Check availability for user's date range
3. Calculate pricing with taxes
4. Present top 3 options with photos and pricing

**AI Response:**
```
I found 3 perfect venues for your gala:

🏛️ Fairmont Hotel Pacific Ballroom
• Capacity: 250 seated
• $12,000 base + $150/person catering
• Premium AV included
• Available: March 15, 22, 29

🌊 Vancouver Convention Centre West
• Capacity: 300 seated
• $8,500 base + $120/person catering
• Waterfront views
• Available: March 10, 17, 24

🏰 The Vancouver Club
• Capacity: 180 seated
• $15,000 base + $200/person catering
• Historic venue, white-glove service
• Available: March 8, 15, 22

Would you like to see photos or book a site visit?
```

---

### 2.3 Sponsor Lead Generation & CRM

**Overview:**
AI-powered sponsor matching, outreach automation, and relationship management for events.

**Features:**
- **Sponsor Database:** 10,000+ pre-loaded company profiles
- **AI Matching:** Match events to relevant sponsors based on industry, budget, audience
- **Outreach Automation:** Personalized email sequences via Resend
- **Proposal Generation:** AI-generated sponsorship decks
- **CRM Pipeline:** Track sponsor relationships and deals
- **ROI Analytics:** Post-event sponsor performance reports

**Database Schema:**
```sql
CREATE TABLE sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  company_size TEXT, -- startup, growth, enterprise
  annual_marketing_budget NUMERIC,
  target_audience JSONB, -- {demographics, interests, job_titles}
  previous_sponsorships JSONB[], -- [{event_type, budget, roi}]
  contact_info JSONB, -- {name, title, email, phone, linkedin}
  logo_url TEXT,
  website TEXT,
  social_media JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sponsorship_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  tier_name TEXT NOT NULL, -- "Platinum", "Gold", "Silver", "Bronze"
  price NUMERIC NOT NULL,
  benefits JSONB NOT NULL, -- {logo_placement, booth_space, speaking_slot, tickets}
  quantity_available INTEGER DEFAULT 1,
  quantity_sold INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sponsorship_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  sponsor_id UUID REFERENCES sponsors(id),
  package_id UUID REFERENCES sponsorship_packages(id),
  status TEXT DEFAULT 'lead', -- lead, contacted, proposal_sent, negotiating, won, lost
  assigned_to UUID REFERENCES profiles(id),
  proposal_url TEXT,
  contract_url TEXT,
  contract_signed BOOLEAN DEFAULT false,
  amount NUMERIC,
  probability INTEGER DEFAULT 25, -- Win probability %
  expected_close_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sponsor_outreach (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES sponsorship_deals(id) ON DELETE CASCADE,
  outreach_type TEXT NOT NULL, -- email, call, meeting, follow_up
  subject TEXT,
  message_template TEXT,
  sent_at TIMESTAMPTZ,
  opened BOOLEAN DEFAULT false,
  clicked BOOLEAN DEFAULT false,
  replied BOOLEAN DEFAULT false,
  reply_content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Real-World Example 3: Tech Conference Sponsor Matching**

**User:** "Find sponsors for my AI conference, 500 attendees, mostly developers and CTOs"

**AI Agent Process (OpenAI SDK):**
```typescript
// Edge Function: match-sponsors
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const response = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [
    {
      role: "system",
      content: "You are a sponsor matching expert. Analyze event details and match with relevant sponsors."
    },
    {
      role: "user",
      content: `Event: AI Conference
Audience: 500 developers, CTOs, tech leaders
Industry: Technology/AI
Budget needed: $75,000-$150,000 in sponsorships

Find matching sponsors from database and suggest outreach strategy.`
    }
  ],
  tools: [
    {
      type: "function",
      function: {
        name: "query_sponsors",
        description: "Query sponsor database with filters",
        parameters: {
          type: "object",
          properties: {
            industries: { type: "array", items: { type: "string" } },
            min_budget: { type: "number" },
            target_audience: { type: "array" }
          }
        }
      }
    },
    {
      type: "function",
      function: {
        name: "generate_outreach_email",
        description: "Generate personalized sponsor outreach email",
        parameters: {
          type: "object",
          properties: {
            sponsor_name: { type: "string" },
            event_details: { type: "object" },
            package_tier: { type: "string" }
          }
        }
      }
    }
  ]
});

// AI calls query_sponsors tool
const sponsors = await querySponsorsFromDatabase({
  industries: ["AI/ML", "Cloud Computing", "Developer Tools"],
  min_budget: 10000,
  target_audience: ["developers", "CTOs", "tech_leaders"]
});

// AI generates outreach strategy
return {
  matched_sponsors: sponsors.slice(0, 15),
  packages_suggested: [
    { tier: "Platinum", price: 50000, sponsors: ["OpenAI", "Google Cloud"] },
    { tier: "Gold", price: 25000, sponsors: ["GitHub", "MongoDB", "Vercel"] },
    { tier: "Silver", price: 10000, sponsors: ["Supabase", "Neon", "Clerk"] }
  ],
  outreach_sequence: [
    { day: 1, action: "Send personalized intro email" },
    { day: 4, action: "Follow-up with proposal deck" },
    { day: 8, action: "LinkedIn message if no response" },
    { day: 12, action: "Phone call to decision maker" }
  ]
};
```

**AI Response:**
```
I found 15 perfect sponsor matches for your AI conference! Here's my strategy:

💎 Platinum Tier ($50K) - 2 spots
• OpenAI - Perfect fit, targets developers, high budget
• Google Cloud - Strong AI presence, enterprise reach

🥇 Gold Tier ($25K) - 5 spots
• GitHub, MongoDB, Vercel, AWS, Azure
• All have developer-focused marketing, active in AI space

🥈 Silver Tier ($10K) - 8 spots
• Supabase, Neon, Clerk, Anthropic, HuggingFace, etc.

I've prepared personalized outreach emails for each. Would you like me to:
1. Send outreach emails now (15 emails)
2. Show you the email templates first
3. Set up automated follow-up sequence

Total potential sponsorship: $275,000
```

**Acceptance Criteria:**
- [ ] Match sponsors with 80%+ relevance score
- [ ] Generate personalized emails in <10s
- [ ] Track opens/clicks/replies
- [ ] Auto-schedule follow-ups
- [ ] Generate sponsorship proposals

---

### 2.4 Marketing Activations & Social Media

**Overview:**
AI-powered marketing content generation, social media scheduling, and campaign tracking for events.

**Features:**
- **Landing Page Generator:** AI creates custom event landing pages
- **Content Creation:** Social media posts, email campaigns, ads
- **Brand Kit Management:** Logo, colors, fonts per event
- **Multi-Channel Publishing:** Facebook, Instagram, LinkedIn, X (Twitter)
- **Campaign Analytics:** Track reach, engagement, conversions
- **QR Code Generation:** Print materials, posters, flyers
- **Email Sequences:** Automated drip campaigns

**Database Schema:**
```sql
CREATE TABLE marketing_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  campaign_name TEXT NOT NULL,
  campaign_type TEXT NOT NULL, -- social, email, paid_ads, content
  status TEXT DEFAULT 'draft', -- draft, scheduled, active, completed
  channels TEXT[], -- ["facebook", "instagram", "linkedin", "email"]
  start_date DATE,
  end_date DATE,
  budget NUMERIC,
  target_audience JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
  platform TEXT NOT NULL, -- facebook, instagram, linkedin, twitter
  post_type TEXT, -- image, carousel, video, story
  content TEXT NOT NULL,
  media_urls TEXT[],
  hashtags TEXT[],
  scheduled_for TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  post_url TEXT,
  analytics JSONB, -- {reach, impressions, clicks, likes, shares, comments}
  status TEXT DEFAULT 'draft', -- draft, scheduled, published, failed
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  preview_text TEXT,
  html_content TEXT NOT NULL,
  plain_text_content TEXT,
  recipient_list JSONB[], -- [{email, name, custom_fields}]
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  stats JSONB, -- {sent, delivered, opened, clicked, bounced, unsubscribed}
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE landing_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  template_id TEXT,
  custom_html TEXT,
  seo_title TEXT,
  seo_description TEXT,
  hero_image TEXT,
  branding JSONB, -- {logo, primary_color, secondary_color, font}
  sections JSONB[], -- [{type: "hero", content: {...}}, {type: "speakers", ...}]
  analytics JSONB, -- {views, unique_visitors, conversion_rate}
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Real-World Example 4: Product Launch Marketing Campaign**

**User:** "Create a social media campaign for my SaaS product launch event"

**AI Agent Process:**
```typescript
// Edge Function: generate-marketing-campaign
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const response = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [
    {
      role: "system",
      content: "You are a marketing expert. Create comprehensive social media campaigns for events."
    },
    {
      role: "user",
      content: `Event: SaaS Product Launch
Product: AI-powered analytics platform
Audience: B2B tech companies, data analysts, CTOs
Event Date: March 15, 2026
Venue: Toronto Convention Centre

Create a 6-week social media campaign with:
- 3 posts per week
- Mix of platforms (LinkedIn, Twitter, Instagram)
- Content types: announcements, speaker highlights, early bird offers
- Hashtag strategy`
    }
  ]
});

// AI generates campaign with 18 posts
const campaign = {
  duration: "6 weeks",
  total_posts: 18,
  platforms: ["linkedin", "twitter", "instagram"],
  posts: [
    {
      week: 1,
      day: 1,
      platform: "linkedin",
      type: "announcement",
      content: "🚀 Big news! We're launching our AI-powered analytics platform at an exclusive event in Toronto on March 15th.\n\nJoin 300+ data leaders to see the future of business intelligence.\n\nEarly bird tickets: 40% off for first 50 registrations!\n\n🔗 Register: [link]\n\n#AIAnalytics #ProductLaunch #DataScience #TechEvents",
      image_description: "Futuristic dashboard with AI elements, product logo prominent",
      cta: "Register Now"
    },
    // ... 17 more posts
  ],
  hashtag_strategy: {
    primary: ["#AIAnalytics", "#ProductLaunch"],
    secondary: ["#DataScience", "#TechEvents", "#Toronto"],
    event_specific: ["#DataLeaders2026"]
  },
  posting_schedule: {
    linkedin: ["Mon 9am", "Wed 1pm", "Fri 10am"],
    twitter: ["Tue 11am", "Thu 3pm", "Sat 9am"],
    instagram: ["Wed 5pm", "Fri 7pm", "Sun 11am"]
  }
};
```

**AI Response:**
```
I've created a 6-week marketing campaign for your product launch! 🎯

📊 Campaign Overview:
• 18 social posts across LinkedIn, Twitter, Instagram
• Content mix: 30% announcements, 40% value content, 30% social proof
• Hashtag strategy: #AIAnalytics #ProductLaunch #DataLeaders2026

Week 1-2: Awareness & Early Bird
✓ Announcement posts
✓ Speaker highlights
✓ Early bird ticket promotion (40% off)

Week 3-4: Engagement & Social Proof
✓ Customer testimonials
✓ Product demos/teasers
✓ Countdown posts

Week 5-6: Urgency & FOMO
✓ Limited spots remaining
✓ Final call posts
✓ Live event teasers

Landing Page: eventos.com/saas-launch-2026
• Hero: AI dashboard animation
• Sections: Speakers, Agenda, Why Attend, Sponsors, Register
• SEO optimized for "AI analytics product launch Toronto"

Would you like me to:
1. Schedule all 18 posts now
2. Show you the content for approval first
3. Generate landing page HTML
4. Set up email drip campaign

Estimated reach: 50K-100K impressions over 6 weeks
```

**Acceptance Criteria:**
- [ ] Generate campaign in <30 seconds
- [ ] Create platform-optimized content (character limits, image sizes)
- [ ] Schedule posts with optimal timing
- [ ] Track analytics per post
- [ ] A/B test variations

---

### 2.5 WhatsApp Automation & Communications

**Overview:**
Automated WhatsApp messaging for attendee communications, reminders, and customer service.

**Features:**
- **Automated Reminders:** 7 days, 24 hours, 1 hour before event
- **QR Ticket Delivery:** Send tickets via WhatsApp instantly
- **Check-In Updates:** Real-time check-in confirmations
- **Customer Service Bot:** Answer attendee questions via WhatsApp
- **VIP Concierge:** Personalized assistance for VIP attendees
- **Post-Event Follow-Up:** Surveys and thank you messages
- **Sponsor Updates:** Real-time lead notifications to sponsors

**Implementation:**
```sql
CREATE TABLE whatsapp_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  template_name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL, -- TRANSACTIONAL, MARKETING, UTILITY
  language TEXT DEFAULT 'en',
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  header_text TEXT,
  body_text TEXT NOT NULL,
  footer_text TEXT,
  buttons JSONB[], -- [{type: "quick_reply", text: "Confirm"}]
  variables TEXT[], -- ["attendee_name", "event_name", "event_date"]
  meta_template_id TEXT, -- WhatsApp template ID after approval
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  recipient_phone TEXT NOT NULL,
  recipient_name TEXT,
  template_name TEXT REFERENCES whatsapp_templates(template_name),
  message_type TEXT NOT NULL, -- template, text, media
  content TEXT,
  media_url TEXT,
  variables JSONB, -- {attendee_name: "John", event_name: "Tech Summit"}
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  status TEXT DEFAULT 'queued', -- queued, sent, delivered, read, failed
  error_message TEXT,
  whatsapp_message_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE whatsapp_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id),
  phone_number TEXT NOT NULL,
  attendee_id UUID REFERENCES attendees(id),
  conversation_history JSONB[], -- [{role: "user", text: "...", timestamp}]
  ai_context JSONB, -- Context for AI assistant
  status TEXT DEFAULT 'open', -- open, resolved, escalated
  assigned_to UUID REFERENCES profiles(id), -- Human agent
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Real-World Example 5: Automated Event Reminders**

**Scenario:** Conference with 500 attendees, automated WhatsApp reminders at T-7 days, T-24 hours, T-1 hour.

**Edge Function Implementation:**
```typescript
// supabase/functions/send-whatsapp-reminders/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const WHATSAPP_API = "https://graph.facebook.com/v18.0";
const PHONE_NUMBER_ID = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID");
const ACCESS_TOKEN = Deno.env.get("WHATSAPP_ACCESS_TOKEN");

serve(async (req) => {
  const supabase = createClient(/* ... */);

  const { eventId, reminderType } = await req.json(); // "7_days", "24_hours", "1_hour"

  // Get all attendees for event
  const { data: attendees } = await supabase
    .from("attendees")
    .select(`
      *,
      orders (
        events (
          name,
          start_date,
          venue:venues (name, address)
        )
      )
    `)
    .eq("orders.event_id", eventId)
    .not("attendee_info->phone", "is", null);

  // Get WhatsApp template
  const { data: template } = await supabase
    .from("whatsapp_templates")
    .select("*")
    .eq("template_name", `event_reminder_${reminderType}`)
    .eq("status", "approved")
    .single();

  // Send messages
  const results = [];

  for (const attendee of attendees) {
    const event = attendee.orders.events;
    const venue = event.venue;

    try {
      // Send WhatsApp message
      const response = await fetch(
        `${WHATSAPP_API}/${PHONE_NUMBER_ID}/messages`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${ACCESS_TOKEN}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: attendee.attendee_info.phone,
            type: "template",
            template: {
              name: template.template_name,
              language: { code: "en" },
              components: [
                {
                  type: "body",
                  parameters: [
                    { type: "text", text: attendee.attendee_info.name },
                    { type: "text", text: event.name },
                    { type: "text", text: new Date(event.start_date).toLocaleDateString() },
                    { type: "text", text: venue.name }
                  ]
                },
                {
                  type: "button",
                  sub_type: "url",
                  index: 0,
                  parameters: [
                    { type: "text", text: attendee.qr_code } // Unique ticket QR
                  ]
                }
              ]
            }
          })
        }
      );

      const result = await response.json();

      // Log message
      await supabase.from("whatsapp_messages").insert({
        event_id: eventId,
        recipient_phone: attendee.attendee_info.phone,
        recipient_name: attendee.attendee_info.name,
        template_name: template.template_name,
        variables: {
          attendee_name: attendee.attendee_info.name,
          event_name: event.name,
          event_date: event.start_date,
          venue_name: venue.name
        },
        sent_at: new Date().toISOString(),
        status: "sent",
        whatsapp_message_id: result.messages?.[0]?.id
      });

      results.push({ phone: attendee.attendee_info.phone, status: "sent" });

    } catch (error) {
      results.push({ phone: attendee.attendee_info.phone, status: "failed", error: error.message });
    }
  }

  return new Response(JSON.stringify({
    total: attendees.length,
    sent: results.filter(r => r.status === "sent").length,
    failed: results.filter(r => r.status === "failed").length,
    results
  }), {
    headers: { "Content-Type": "application/json" }
  });
});
```

**Message Template Example:**
```
Hi {{1}},

Your event "{{2}}" is coming up on {{3}} at {{4}}!

📍 Venue: {{5}}
🎟️ View your ticket: [Button: Show QR Code]

Need help? Reply to this message.

See you there! 🎉
```

**Acceptance Criteria:**
- [ ] Send 1,000+ messages without rate limiting
- [ ] 98% delivery rate
- [ ] QR code accessible via WhatsApp
- [ ] AI bot responds to questions <5s
- [ ] Track read receipts

---

### 2.6 Event CRM & Relationship Management

**Overview:**
Comprehensive CRM for managing organizers, sponsors, vendors, and attendees throughout the event lifecycle.

**Features:**
- **Contact Management:** Centralized database of all stakeholders
- **Deal Pipeline:** Visual pipeline for sponsor and vendor deals
- **Activity Tracking:** Log all interactions (calls, emails, meetings)
- **Task Automation:** Auto-create follow-up tasks
- **Email Integration:** Sync with Gmail/Outlook
- **Reporting:** Revenue forecasting, health scores, conversion rates
- **Relationship Insights:** AI-powered next-best-action recommendations

**Database Schema:**
```sql
CREATE TABLE crm_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL, -- organizer, sponsor, vendor, attendee, speaker
  company_name TEXT,
  contact_name TEXT NOT NULL,
  job_title TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  linkedin_url TEXT,
  address JSONB,
  tags TEXT[],
  custom_fields JSONB,
  health_score INTEGER DEFAULT 50 CHECK (health_score >= 0 AND health_score <= 100),
  lifecycle_stage TEXT DEFAULT 'lead', -- lead, qualified, opportunity, customer, advocate
  assigned_to UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE crm_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES crm_contacts(id) ON DELETE CASCADE,
  deal_name TEXT NOT NULL,
  deal_type TEXT NOT NULL, -- sponsorship, venue_booking, vendor_contract
  amount NUMERIC NOT NULL,
  stage TEXT NOT NULL, -- lead, contacted, proposal, negotiation, won, lost
  probability INTEGER DEFAULT 25 CHECK (probability >= 0 AND probability <= 100),
  expected_close_date DATE,
  actual_close_date DATE,
  assigned_to UUID REFERENCES profiles(id),
  deal_owner UUID REFERENCES profiles(id),
  lost_reason TEXT,
  notes TEXT,
  custom_fields JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE crm_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES crm_contacts(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES crm_deals(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- email, call, meeting, note, task
  subject TEXT,
  description TEXT,
  outcome TEXT,
  duration_minutes INTEGER,
  scheduled_for TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending', -- pending, completed, cancelled
  assigned_to UUID REFERENCES profiles(id),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE crm_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES crm_contacts(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES crm_deals(id) ON DELETE CASCADE,
  task_type TEXT NOT NULL, -- follow_up, send_proposal, schedule_call
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  priority TEXT DEFAULT 'medium', -- low, medium, high, urgent
  status TEXT DEFAULT 'todo', -- todo, in_progress, done, cancelled
  assigned_to UUID REFERENCES profiles(id),
  created_by UUID REFERENCES profiles(id),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE crm_email_sync (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES crm_contacts(id),
  email_provider TEXT NOT NULL, -- gmail, outlook, custom
  message_id TEXT UNIQUE NOT NULL,
  thread_id TEXT,
  subject TEXT,
  from_address TEXT,
  to_addresses TEXT[],
  cc_addresses TEXT[],
  body_preview TEXT,
  sent_at TIMESTAMPTZ,
  attachments JSONB[],
  labels TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Real-World Example 6: Sponsor Relationship Management**

**Scenario:** Event organizer manages 15 potential sponsors with automated follow-ups.

**CRM Workflow:**
1. **Lead Capture:** AI identifies 15 potential sponsors from database
2. **Enrichment:** Fetch company info (size, budget, previous sponsorships)
3. **Scoring:** AI calculates fit score (0-100) based on event match
4. **Outreach:** Automated email sequence
5. **Activity Tracking:** Log opens, clicks, replies
6. **Task Creation:** Auto-create follow-up tasks
7. **Deal Progression:** Move through pipeline stages
8. **Forecasting:** Predict revenue based on probability

**AI Agent for Next-Best-Action:**
```typescript
// Edge Function: crm-next-action
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Analyze contact history and recommend next action
const response = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [
    {
      role: "system",
      content: "You are a sales AI assistant. Analyze CRM data and recommend the best next action."
    },
    {
      role: "user",
      content: `Contact: Acme Corp (sponsor)
Deal: $25,000 Gold Sponsorship
Stage: Proposal Sent
Last Activity: Email sent 5 days ago (opened 2 days ago, not replied)
Health Score: 65
Event Date: 45 days away

What should I do next?`
    }
  ]
});

// AI Response:
{
  action: "schedule_phone_call",
  urgency: "high",
  reasoning: "Contact opened proposal but hasn't replied in 3 days. Phone follow-up has 3x higher conversion rate at this stage. Event is in 45 days, need decision in next 2 weeks to include in marketing materials.",
  talking_points: [
    "Ask if they have questions about the proposal",
    "Highlight exclusive benefits (stage mention, logo placement)",
    "Create urgency: early sponsors get premium booth locations",
    "Offer custom package if budget is a concern"
  ],
  best_time_to_call: "Tuesday or Thursday, 10am-12pm (highest answer rate)",
  fallback_action: "Send LinkedIn message if no answer after 2 call attempts"
}
```

**Acceptance Criteria:**
- [ ] Track 10,000+ contacts
- [ ] Pipeline visualization with drag-and-drop
- [ ] Email sync (Gmail/Outlook)
- [ ] AI-powered next action recommendations
- [ ] Revenue forecasting accuracy >85%

---

## 3. Advanced Features & Best Practices

### 3.1 Real-Time Analytics Dashboard

**Metrics Tracked:**
- Ticket sales (real-time)
- Revenue tracking
- Attendee demographics
- Marketing campaign performance
- Sponsor engagement
- Email open/click rates
- Social media reach
- WhatsApp delivery rates
- Website traffic and conversions

**Implementation:**
```typescript
// React Query for real-time data
const { data: eventMetrics } = useQuery({
  queryKey: ["event-metrics", eventId],
  queryFn: async () => {
    const { data } = await supabase
      .from("event_metrics_view")
      .select("*")
      .eq("event_id", eventId)
      .single();
    return data;
  },
  refetchInterval: 5000 // Refresh every 5 seconds
});

// Supabase Realtime for live updates
useEffect(() => {
  const channel = supabase
    .channel("ticket-sales")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "orders",
        filter: `event_id=eq.${eventId}`
      },
      (payload) => {
        toast.success("New ticket sold! 🎉");
        queryClient.invalidateQueries(["event-metrics", eventId]);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [eventId]);
```

### 3.2 Multi-Event Management

**Features:**
- Dashboard showing all events
- Bulk operations (duplicate events, mass email)
- Event templates (recurring events)
- Portfolio analytics
- Resource sharing (venues, vendors, sponsors)

**Best Practice:** Event Series Template
```sql
CREATE TABLE event_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  template_name TEXT NOT NULL,
  event_type TEXT,
  default_settings JSONB, -- {capacity, ticket_tiers, marketing_plan}
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clone event from template
CREATE FUNCTION clone_event_from_template(template_id UUID, new_date DATE)
RETURNS UUID AS $$
DECLARE
  new_event_id UUID;
BEGIN
  -- Insert new event with template settings
  INSERT INTO events (user_id, name, start_date, settings)
  SELECT user_id, template_name || ' - ' || new_date, new_date, default_settings
  FROM event_templates
  WHERE id = template_id
  RETURNING id INTO new_event_id;

  RETURN new_event_id;
END;
$$ LANGUAGE plpgsql;
```

### 3.3 API & Webhooks

**Public API Endpoints:**
```
POST /api/events - Create event
GET /api/events/:id - Get event details
POST /api/events/:id/register - Register attendee
GET /api/events/:id/analytics - Get event metrics
POST /api/sponsors/match - AI sponsor matching
POST /api/marketing/generate - AI content generation
```

**Webhooks:**
```sql
CREATE TABLE webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  events TEXT[] NOT NULL, -- ["ticket.sold", "event.published", "sponsor.signed"]
  secret TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger webhook on ticket sale
CREATE FUNCTION trigger_ticket_sold_webhook()
RETURNS TRIGGER AS $$
DECLARE
  webhook RECORD;
BEGIN
  FOR webhook IN
    SELECT * FROM webhooks
    WHERE 'ticket.sold' = ANY(events)
    AND enabled = true
    AND user_id = (SELECT organizer_id FROM events WHERE id = NEW.event_id)
  LOOP
    PERFORM net.http_post(
      url := webhook.url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'X-EventOS-Signature', encode(hmac(NEW::text, webhook.secret, 'sha256'), 'hex')
      ),
      body := jsonb_build_object(
        'event', 'ticket.sold',
        'data', row_to_json(NEW)
      )
    );
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER webhook_ticket_sold
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION trigger_ticket_sold_webhook();
```

### 3.4 Security Best Practices

**Row-Level Security (RLS):**
```sql
-- Users can only see their own events
CREATE POLICY "Users see own events"
  ON events FOR SELECT
  USING (organizer_id = auth.uid());

-- Users can only edit their own events
CREATE POLICY "Users edit own events"
  ON events FOR UPDATE
  USING (organizer_id = auth.uid());

-- Attendees can see public events
CREATE POLICY "Public events visible"
  ON events FOR SELECT
  USING (visibility = 'public' AND published = true);

-- Sponsors can only see their own deals
CREATE POLICY "Sponsors see own deals"
  ON sponsorship_deals FOR SELECT
  USING (
    sponsor_id IN (
      SELECT sponsor_id FROM sponsor_users WHERE user_id = auth.uid()
    )
  );
```

**API Rate Limiting:**
```typescript
// Edge Function middleware
import { createRateLimiter } from "./rate-limiter.ts";

const limiter = createRateLimiter({
  tokensPerInterval: 100,
  interval: "minute"
});

serve(async (req) => {
  const clientId = req.headers.get("Authorization") || req.headers.get("X-Forwarded-For");

  const { success } = await limiter.limit(clientId);

  if (!success) {
    return new Response("Rate limit exceeded", { status: 429 });
  }

  // Continue with request...
});
```

---

## 4. Technical Architecture

### 4.1 System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
│  ┌────────────┐  ┌──────────────┐  ┌────────────────────┐  │
│  │  Landing   │  │   Dashboard  │  │   Event Wizard     │  │
│  │   Pages    │  │   (Org/Spon) │  │  (CopilotKit)      │  │
│  └────────────┘  └──────────────┘  └────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Supabase Backend                            │
│  ┌──────────┐  ┌──────────┐  ┌─────────────┐  ┌─────────┐ │
│  │PostgreSQL│  │  Auth    │  │  Storage    │  │Realtime │ │
│  │   +RLS   │  │  (JWT)   │  │  (Images)   │  │(WebSock)│ │
│  └──────────┘  └──────────┘  └─────────────┘  └─────────┘ │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          Edge Functions (Deno Runtime)                │  │
│  │  • AI Event Planning  • Sponsor Matching              │  │
│  │  • WhatsApp Messaging • Email Campaigns               │  │
│  │  • Payment Processing • Analytics Aggregation         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
          ┌─────────────────┼─────────────────┐
          ▼                 ▼                 ▼
┌──────────────────┐ ┌──────────────┐ ┌──────────────────┐
│   OpenAI SDK     │ │  CopilotKit  │ │ WhatsApp Business│
│  (GPT-4o Agent)  │ │  (State Mgt) │ │      API         │
└──────────────────┘ └──────────────┘ └──────────────────┘
          │                 │                 │
          └─────────────────┼─────────────────┘
                            ▼
          ┌─────────────────────────────────────┐
          │      External Services              │
          │  • Stripe (Payments)                │
          │  • Resend (Email)                   │
          │  • ElevenLabs (Voice AI - Optional) │
          └─────────────────────────────────────┘
```

### 4.2 CopilotKit Integration

**Event Wizard State Machine:**
```typescript
// src/hooks/useEventWizard.ts
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import { useCopilotChatSuggestions } from "@copilotkit/react-ui";

interface EventWizardState {
  step: "basics" | "venue" | "ticketing" | "sponsors" | "marketing" | "review";
  eventData: Partial<Event>;
  validationErrors: Record<string, string>;
}

export function useEventWizard() {
  const [state, setState] = useState<EventWizardState>({
    step: "basics",
    eventData: {},
    validationErrors: {}
  });

  // Make event data readable by AI
  useCopilotReadable({
    description: "Current event wizard state",
    value: state
  });

  // Define AI actions
  useCopilotAction({
    name: "updateEventBasics",
    description: "Update basic event information (name, date, capacity)",
    parameters: [
      {
        name: "eventName",
        type: "string",
        description: "Name of the event",
        required: true
      },
      {
        name: "eventDate",
        type: "string",
        description: "Event date in ISO format",
        required: true
      },
      {
        name: "capacity",
        type: "number",
        description: "Expected number of attendees",
        required: true
      }
    ],
    handler: async ({ eventName, eventDate, capacity }) => {
      setState(prev => ({
        ...prev,
        eventData: {
          ...prev.eventData,
          name: eventName,
          start_date: eventDate,
          capacity
        }
      }));

      // Save to Supabase
      const { data } = await supabase
        .from("events")
        .upsert({
          name: eventName,
          start_date: eventDate,
          capacity,
          organizer_id: user.id
        })
        .select()
        .single();

      return `Event "${eventName}" created for ${capacity} attendees on ${new Date(eventDate).toLocaleDateString()}`;
    }
  });

  useCopilotAction({
    name: "searchVenues",
    description: "Search for venues matching event requirements",
    parameters: [
      {
        name: "city",
        type: "string",
        description: "City where event will be held"
      },
      {
        name: "capacity",
        type: "number",
        description: "Minimum capacity needed"
      },
      {
        name: "amenities",
        type: "string[]",
        description: "Required amenities (e.g., wifi, catering, av_equipment)"
      }
    ],
    handler: async ({ city, capacity, amenities }) => {
      const { data: venues } = await supabase.rpc("search_venues", {
        p_city: city,
        p_min_capacity: capacity,
        p_amenities: amenities
      });

      return venues.map(v => ({
        id: v.id,
        name: v.name,
        capacity: v.capacity_seated,
        price: v.pricing.day_rate,
        amenities: v.amenities
      }));
    }
  });

  // AI suggestions based on current state
  useCopilotChatSuggestions({
    instructions: `User is creating an event. Current step: ${state.step}. Suggest relevant next actions.`,
    minSuggestions: 3,
    maxSuggestions: 5
  });

  return { state, setState };
}
```

**CopilotKit Provider Setup:**
```typescript
// src/App.tsx
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

function App() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <CopilotSidebar
        defaultOpen={true}
        labels={{
          title: "EventOS AI Assistant",
          initial: "Hi! I'm your event planning assistant. What would you like to create today?"
        }}
      >
        <EventWizard />
      </CopilotSidebar>
    </CopilotKit>
  );
}
```

**Edge Function for CopilotKit Runtime:**
```typescript
// supabase/functions/copilotkit/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4";

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY")
});

serve(async (req) => {
  const { messages, actions } = await req.json();

  // Add system prompt for event planning
  const systemMessage = {
    role: "system",
    content: `You are an expert event planning assistant. You help users create professional events by:
- Gathering event details conversationally
- Suggesting venues based on requirements
- Recommending ticketing strategies
- Finding relevant sponsors
- Creating marketing content
- Providing best practices for event success

Use the available actions to update event data, search venues, and manage the planning process. Be friendly, concise, and actionable.`
  };

  // Call OpenAI with tools
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [systemMessage, ...messages],
    tools: actions.map(action => ({
      type: "function",
      function: {
        name: action.name,
        description: action.description,
        parameters: {
          type: "object",
          properties: action.parameters.reduce((acc, param) => ({
            ...acc,
            [param.name]: {
              type: param.type,
              description: param.description
            }
          }), {}),
          required: action.parameters.filter(p => p.required).map(p => p.name)
        }
      }
    })),
    tool_choice: "auto"
  });

  return new Response(JSON.stringify(response), {
    headers: { "Content-Type": "application/json" }
  });
});
```

---

## 5. Success Metrics & KPIs

### 5.1 Business Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Monthly Active Events** | 150+ by Month 6 | Events with activity in last 30 days |
| **Average Event Value** | $35,000 | Total event budget / number of events |
| **Sponsor Match Rate** | 60% | Matched sponsors / total sponsor searches |
| **CRM Conversion Rate** | 25% | Deals won / total deals created |
| **WhatsApp Open Rate** | 95%+ | Messages read / messages delivered |
| **Platform Revenue** | $250K MRR by Month 6 | Subscription + commissions |

### 5.2 User Experience Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Event Creation Time** | <10 minutes | Time from start to publish |
| **AI Chat Completion Rate** | 90%+ | Completed wizards / started wizards |
| **Mobile Usage** | 60%+ | Mobile sessions / total sessions |
| **User Satisfaction (NPS)** | 50+ | Net Promoter Score |
| **Feature Adoption** | 75%+ | Users using 3+ core features |

### 5.3 Technical Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **API Response Time** | <200ms (p95) | 95th percentile response time |
| **Uptime** | 99.9% | System availability |
| **Error Rate** | <0.1% | Failed requests / total requests |
| **Database Query Time** | <100ms (p95) | 95th percentile query time |
| **AI Response Time** | <3s | Time from user message to AI response |

---

## 6. Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
- [ ] Supabase setup (database, auth, storage)
- [ ] Core database schema (20+ tables)
- [ ] RLS policies for all tables
- [ ] Basic React app with routing
- [ ] shadcn/ui component setup

### Phase 2: AI Event Wizard (Weeks 3-4)
- [ ] CopilotKit integration
- [ ] OpenAI SDK configuration
- [ ] Event wizard state machine
- [ ] AI actions (create event, search venues)
- [ ] Form validation and auto-save

### Phase 3: Venue & Ticketing (Weeks 5-6)
- [ ] Venue database and search
- [ ] Booking system
- [ ] Ticket configuration
- [ ] Stripe integration
- [ ] Order processing

### Phase 4: Sponsors & CRM (Weeks 7-8)
- [ ] Sponsor database (seed 10K companies)
- [ ] AI sponsor matching
- [ ] CRM pipeline UI
- [ ] Deal management
- [ ] Email integration

### Phase 5: Marketing & Communications (Weeks 9-10)
- [ ] Landing page generator
- [ ] Social media scheduling
- [ ] Email campaigns (Resend)
- [ ] WhatsApp Business API setup
- [ ] Automated reminders

### Phase 6: Analytics & Polish (Weeks 11-12)
- [ ] Real-time dashboard
- [ ] Analytics views
- [ ] Reporting tools
- [ ] Performance optimization
- [ ] Security audit
- [ ] Launch preparation

**Total Timeline: 12 weeks to MVP**

---

## 7. Risk Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **OpenAI Rate Limits** | High | Medium | Implement caching, use GPT-4o-mini for simple tasks, queue system |
| **WhatsApp Template Approval** | Medium | High | Pre-approve 10 templates, provide customization guide |
| **Sponsor Database Quality** | High | Medium | Manual curation, verify contact info, enrichment API |
| **Payment Processing Issues** | Critical | Low | Stripe retry logic, webhook verification, manual reconciliation |
| **Venue Availability Data** | Medium | High | Partner with venue management software, manual updates |
| **CopilotKit Learning Curve** | Low | Medium | Documentation, examples, community support |

---

## 8. Appendix

### 8.1 Reference Links

**Documentation:**
- Supabase Docs: https://supabase.com/docs
- CopilotKit Docs: https://docs.copilotkit.ai
- OpenAI SDK: https://platform.openai.com/docs
- WhatsApp Business API: https://developers.facebook.com/docs/whatsapp
- Stripe Connect: https://stripe.com/docs/connect

**Example Projects:**
- CopilotKit State Machine: https://docs.copilotkit.ai/direct-to-llm/cookbook/state-machine
- OpenAI Agents: https://openai.github.io/openai-agents-python/

### 8.2 Glossary

- **CopilotKit:** React framework for building AI-powered interfaces with state management
- **OpenAI SDK:** Official SDK for integrating GPT models and agents
- **Supabase:** Open-source Firebase alternative with PostgreSQL, Auth, Storage, Edge Functions
- **RLS:** Row-Level Security - database-level authorization
- **Edge Functions:** Serverless functions running on Deno runtime
- **State Machine:** Structured workflow with defined states and transitions
- **Webhook:** HTTP callback for real-time event notifications

---

**Document Status:** ✅ Ready for Development
**Last Updated:** October 2025
**Version:** 3.0
**Next Review:** After Phase 2 completion
