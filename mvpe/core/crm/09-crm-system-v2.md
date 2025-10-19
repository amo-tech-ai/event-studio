# 09 - Event CRM System: Comprehensive Relationship Management

## 🎯 Purpose

Unified CRM for managing all event stakeholders: organizers, sponsors, vendors, VIP attendees, and partners. Powered by AI insights, automated workflows, and real-time analytics.

## 📊 Complete Database Schema

```sql
-- ============================================
-- CRM CONTACTS - Central Contact Management
-- ============================================

CREATE TABLE crm_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE, -- CRM owner

  -- Contact Details
  contact_type TEXT NOT NULL CHECK (contact_type IN ('organizer', 'sponsor', 'vendor', 'speaker', 'vip_attendee', 'partner')),
  company_name TEXT,
  contact_name TEXT NOT NULL,
  job_title TEXT,

  -- Communication
  email TEXT NOT NULL,
  phone TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  website TEXT,

  -- Address
  address JSONB, -- {street, city, state/province, postal_code, country}
  timezone TEXT DEFAULT 'America/Toronto',

  -- Segmentation
  industry TEXT, -- "Technology", "Finance", "Healthcare", etc.
  company_size TEXT, -- "1-10", "11-50", "51-200", "201-1000", "1000+"
  annual_revenue TEXT, -- "$0-1M", "$1M-10M", "$10M-50M", "$50M+"
  target_audience JSONB, -- {demographics, interests, job_titles}
  tags TEXT[], -- ["high-value", "ai-sponsor", "repeat-customer"]

  -- Relationship Metrics
  health_score INTEGER DEFAULT 50 CHECK (health_score >= 0 AND health_score <= 100),
  sentiment TEXT DEFAULT 'neutral', -- positive, neutral, negative
  engagement_score INTEGER DEFAULT 0, -- Based on interactions
  lifetime_value NUMERIC DEFAULT 0,
  lifecycle_stage TEXT DEFAULT 'lead' CHECK (lifecycle_stage IN (
    'lead', 'qualified', 'opportunity', 'customer', 'advocate', 'churned'
  )),

  -- Assignment
  assigned_to UUID REFERENCES profiles(id), -- Sales rep/account manager
  team TEXT, -- "Sales", "Partnerships", "Customer Success"

  -- Metadata
  source TEXT, -- "website", "referral", "ai_match", "trade_show"
  custom_fields JSONB DEFAULT '{}',
  notes TEXT,

  -- AI Insights
  ai_summary TEXT, -- AI-generated contact summary
  next_best_action TEXT, -- AI recommendation
  churn_risk INTEGER, -- 0-100 probability of churning
  upsell_opportunity BOOLEAN DEFAULT false,

  -- Timestamps
  last_contact_date TIMESTAMPTZ,
  next_follow_up_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Indexes
  CONSTRAINT unique_contact_email UNIQUE(user_id, email)
);

CREATE INDEX idx_crm_contacts_user_id ON crm_contacts(user_id);
CREATE INDEX idx_crm_contacts_type ON crm_contacts(contact_type);
CREATE INDEX idx_crm_contacts_lifecycle ON crm_contacts(lifecycle_stage);
CREATE INDEX idx_crm_contacts_health ON crm_contacts(health_score);
CREATE INDEX idx_crm_contacts_assigned ON crm_contacts(assigned_to);

-- ============================================
-- CRM DEALS - Sales Pipeline Management
-- ============================================

CREATE TABLE crm_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES crm_contacts(id) ON DELETE CASCADE,

  -- Deal Information
  deal_name TEXT NOT NULL,
  deal_type TEXT NOT NULL CHECK (deal_type IN (
    'sponsorship', 'venue_booking', 'vendor_contract', 'speaker_fee', 'partnership', 'ticket_sales'
  )),
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'CAD',

  -- Pipeline Stage
  stage TEXT NOT NULL CHECK (stage IN (
    'lead', 'contacted', 'qualified', 'proposal_sent', 'negotiation',
    'verbal_agreement', 'contract_sent', 'won', 'lost'
  )),
  probability INTEGER DEFAULT 25 CHECK (probability >= 0 AND probability <= 100),

  -- Timeline
  expected_close_date DATE,
  actual_close_date DATE,
  days_in_stage INTEGER DEFAULT 0,

  -- Relationships
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES profiles(id),
  deal_owner UUID REFERENCES profiles(id),

  -- Win/Loss Analysis
  lost_reason TEXT,
  lost_to_competitor TEXT,
  won_reason TEXT,

  -- Contract & Proposals
  proposal_url TEXT,
  contract_url TEXT,
  contract_signed BOOLEAN DEFAULT false,
  contract_signed_date TIMESTAMPTZ,

  -- Financial Tracking
  commission_rate NUMERIC, -- % commission for sales rep
  commission_amount NUMERIC,
  deposit_amount NUMERIC DEFAULT 0,
  deposit_paid BOOLEAN DEFAULT false,
  payment_terms TEXT, -- "Net 30", "50% upfront, 50% on delivery"

  -- Metadata
  notes TEXT,
  custom_fields JSONB DEFAULT '{}',

  -- AI Insights
  ai_win_probability INTEGER, -- AI-calculated win %
  ai_deal_insights TEXT[], -- ["Strong engagement", "Budget concern detected"]
  risk_factors TEXT[], -- ["No response in 7 days", "Competitor mentioned"]

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Stage Change Tracking
  stage_history JSONB DEFAULT '[]' -- [{stage, date, user_id}]
);

CREATE INDEX idx_crm_deals_user_id ON crm_deals(user_id);
CREATE INDEX idx_crm_deals_contact_id ON crm_deals(contact_id);
CREATE INDEX idx_crm_deals_stage ON crm_deals(stage);
CREATE INDEX idx_crm_deals_assigned ON crm_deals(assigned_to);
CREATE INDEX idx_crm_deals_event_id ON crm_deals(event_id);
CREATE INDEX idx_crm_deals_close_date ON crm_deals(expected_close_date);

-- ============================================
-- CRM ACTIVITIES - Interaction Tracking
-- ============================================

CREATE TABLE crm_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES crm_contacts(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES crm_deals(id) ON DELETE CASCADE,

  -- Activity Details
  activity_type TEXT NOT NULL CHECK (activity_type IN (
    'email', 'call', 'meeting', 'note', 'task', 'linkedin_message',
    'proposal_sent', 'contract_sent', 'follow_up', 'demo', 'site_visit'
  )),
  subject TEXT NOT NULL,
  description TEXT,
  outcome TEXT, -- "Positive", "Neutral", "Negative", "No Response"

  -- Meeting/Call Details
  duration_minutes INTEGER,
  meeting_type TEXT, -- "phone", "video", "in_person"
  attendees JSONB[], -- [{name, email, role}]
  meeting_notes TEXT,

  -- Timing
  scheduled_for TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled', 'rescheduled')),

  -- Assignment
  assigned_to UUID REFERENCES profiles(id),
  created_by UUID REFERENCES profiles(id),

  -- Email Tracking
  email_sent BOOLEAN DEFAULT false,
  email_opened BOOLEAN DEFAULT false,
  email_opened_at TIMESTAMPTZ,
  email_clicked BOOLEAN DEFAULT false,
  email_replied BOOLEAN DEFAULT false,

  -- Metadata
  sentiment TEXT, -- positive, neutral, negative (AI-detected)
  importance TEXT DEFAULT 'medium' CHECK (importance IN ('low', 'medium', 'high', 'critical')),
  tags TEXT[],

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_crm_activities_contact_id ON crm_activities(contact_id);
CREATE INDEX idx_crm_activities_deal_id ON crm_activities(deal_id);
CREATE INDEX idx_crm_activities_scheduled ON crm_activities(scheduled_for);
CREATE INDEX idx_crm_activities_assigned ON crm_activities(assigned_to);

-- ============================================
-- CRM TASKS - Action Items & Follow-ups
-- ============================================

CREATE TABLE crm_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES crm_contacts(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES crm_deals(id) ON DELETE CASCADE,

  -- Task Details
  task_type TEXT NOT NULL CHECK (task_type IN (
    'call', 'email', 'follow_up', 'send_proposal', 'schedule_meeting',
    'send_contract', 'check_in', 'research', 'internal_review'
  )),
  title TEXT NOT NULL,
  description TEXT,

  -- Priority & Timing
  due_date DATE,
  due_time TIME,
  reminder_minutes INTEGER DEFAULT 15, -- Remind X minutes before
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),

  -- Status
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done', 'cancelled')),
  completed_at TIMESTAMPTZ,

  -- Assignment
  assigned_to UUID REFERENCES profiles(id),
  created_by UUID REFERENCES profiles(id),

  -- Automation
  auto_generated BOOLEAN DEFAULT false,
  triggered_by TEXT, -- "ai_recommendation", "workflow_rule", "manual"

  -- Recurrence
  recurring BOOLEAN DEFAULT false,
  recurrence_pattern JSONB, -- {frequency: "weekly", day_of_week: "Monday"}

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_crm_tasks_due_date ON crm_tasks(due_date);
CREATE INDEX idx_crm_tasks_assigned ON crm_tasks(assigned_to);
CREATE INDEX idx_crm_tasks_status ON crm_tasks(status);

-- ============================================
-- EMAIL INTEGRATION - Gmail/Outlook Sync
-- ============================================

CREATE TABLE crm_email_sync (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES crm_contacts(id) ON DELETE SET NULL,

  -- Email Provider
  email_provider TEXT NOT NULL CHECK (email_provider IN ('gmail', 'outlook', 'custom')),
  provider_account_id TEXT, -- OAuth account ID

  -- Message Details
  message_id TEXT UNIQUE NOT NULL, -- Provider's message ID
  thread_id TEXT,
  subject TEXT,
  from_address TEXT NOT NULL,
  to_addresses TEXT[] NOT NULL,
  cc_addresses TEXT[],
  bcc_addresses TEXT[],

  -- Content
  body_text TEXT,
  body_html TEXT,
  body_preview TEXT, -- First 200 chars

  -- Attachments
  attachments JSONB[], -- [{filename, size, mime_type, url}]

  -- Metadata
  sent_at TIMESTAMPTZ NOT NULL,
  received_at TIMESTAMPTZ,
  labels TEXT[], -- Gmail labels or Outlook categories
  is_read BOOLEAN DEFAULT false,
  is_starred BOOLEAN DEFAULT false,

  -- AI Analysis
  sentiment TEXT, -- positive, neutral, negative
  intent TEXT, -- "inquiry", "follow_up", "objection", "interested"
  key_points TEXT[], -- AI-extracted key information
  action_items TEXT[], -- AI-detected action items

  -- Link to CRM
  linked_deal_id UUID REFERENCES crm_deals(id),
  auto_linked BOOLEAN DEFAULT false,

  -- Timestamps
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_email_sync_user_id ON crm_email_sync(user_id);
CREATE INDEX idx_email_sync_contact_id ON crm_email_sync(contact_id);
CREATE INDEX idx_email_sync_thread_id ON crm_email_sync(thread_id);

-- ============================================
-- CRM WORKFLOWS - Automation Rules
-- ============================================

CREATE TABLE crm_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Workflow Definition
  workflow_name TEXT NOT NULL,
  description TEXT,
  enabled BOOLEAN DEFAULT true,

  -- Trigger
  trigger_type TEXT NOT NULL CHECK (trigger_type IN (
    'contact_created', 'deal_stage_changed', 'activity_logged',
    'task_overdue', 'email_opened', 'no_activity_x_days', 'custom'
  )),
  trigger_conditions JSONB, -- {field: "health_score", operator: "<", value: 30}

  -- Actions
  actions JSONB[] NOT NULL, -- [{type: "create_task", params: {...}}]
  /*
    Action types:
    - create_task: Auto-create follow-up task
    - send_email: Automated email sequence
    - update_field: Change contact/deal field
    - notify_user: Alert assigned user
    - webhook: Call external API
  */

  -- Metadata
  execution_count INTEGER DEFAULT 0,
  last_executed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_workflows_user_id ON crm_workflows(user_id);
CREATE INDEX idx_workflows_enabled ON crm_workflows(enabled);

-- ============================================
-- ANALYTICS VIEWS
-- ============================================

-- Contact Health Score Calculation
CREATE VIEW crm_contact_health_summary AS
SELECT
  c.id,
  c.contact_name,
  c.company_name,
  c.health_score,

  -- Activity Metrics
  COUNT(DISTINCT a.id) FILTER (WHERE a.created_at > NOW() - INTERVAL '30 days') as activities_last_30d,
  MAX(a.created_at) as last_activity_date,
  EXTRACT(DAY FROM NOW() - MAX(a.created_at)) as days_since_last_activity,

  -- Deal Metrics
  COUNT(DISTINCT d.id) as total_deals,
  COUNT(DISTINCT d.id) FILTER (WHERE d.stage = 'won') as won_deals,
  SUM(d.amount) FILTER (WHERE d.stage = 'won') as total_revenue,

  -- Engagement
  COUNT(DISTINCT e.id) FILTER (WHERE e.email_opened = true) as emails_opened,
  COUNT(DISTINCT e.id) FILTER (WHERE e.email_replied = true) as emails_replied

FROM crm_contacts c
LEFT JOIN crm_activities a ON c.id = a.contact_id
LEFT JOIN crm_deals d ON c.id = d.contact_id
LEFT JOIN crm_email_sync e ON c.id = e.contact_id
GROUP BY c.id;

-- Deal Pipeline Analytics
CREATE VIEW crm_pipeline_metrics AS
SELECT
  d.stage,
  d.deal_type,
  COUNT(*) as deal_count,
  SUM(d.amount) as total_value,
  SUM(d.amount * d.probability / 100) as weighted_value,
  AVG(d.days_in_stage) as avg_days_in_stage,
  COUNT(*) FILTER (WHERE d.updated_at > NOW() - INTERVAL '7 days') as active_last_week
FROM crm_deals d
WHERE d.stage NOT IN ('won', 'lost')
GROUP BY d.stage, d.deal_type;

-- Revenue Forecasting
CREATE VIEW crm_revenue_forecast AS
SELECT
  DATE_TRUNC('month', d.expected_close_date) as forecast_month,
  d.deal_type,
  COUNT(*) as deal_count,
  SUM(d.amount) as total_potential,
  SUM(d.amount * d.probability / 100) as weighted_forecast,
  SUM(d.amount) FILTER (WHERE d.probability >= 75) as high_confidence_forecast
FROM crm_deals d
WHERE d.stage NOT IN ('won', 'lost')
  AND d.expected_close_date IS NOT NULL
  AND d.expected_close_date >= CURRENT_DATE
GROUP BY forecast_month, d.deal_type
ORDER BY forecast_month;
```

## 🤖 AI-Powered Features

### 1. Next-Best-Action Recommendations

```typescript
// Edge Function: crm-ai-recommendations
import OpenAI from "https://esm.sh/openai@4";

const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY") });

export async function getNextBestAction(contactId: string) {
  // Fetch contact history
  const { data: contact } = await supabase
    .from("crm_contacts")
    .select(`
      *,
      deals:crm_deals(*),
      activities:crm_activities(*)
    `)
    .eq("id", contactId)
    .single();

  // Analyze with AI
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are a sales AI assistant. Analyze CRM data and recommend optimal next actions."
      },
      {
        role: "user",
        content: `
Contact: ${contact.contact_name} at ${contact.company_name}
Health Score: ${contact.health_score}/100
Lifecycle Stage: ${contact.lifecycle_stage}
Last Contact: ${contact.last_contact_date}
Active Deals: ${contact.deals.length}
Recent Activities: ${contact.activities.slice(0, 5).map(a => a.activity_type).join(", ")}

What should be the next best action to move this relationship forward?
        `
      }
    ]
  });

  const recommendation = response.choices[0].message.content;

  // Save recommendation
  await supabase
    .from("crm_contacts")
    .update({
      next_best_action: recommendation,
      updated_at: new Date().toISOString()
    })
    .eq("id", contactId);

  return recommendation;
}
```

### 2. Automated Health Score Calculation

```sql
-- Function: Update Contact Health Score
CREATE OR REPLACE FUNCTION update_contact_health_score(contact_id UUID)
RETURNS INTEGER AS $$
DECLARE
  health INTEGER := 50; -- Base score
  days_since_activity INTEGER;
  activity_count INTEGER;
  won_deals_count INTEGER;
  email_engagement_rate NUMERIC;
BEGIN
  -- Recent Activity (0-30 points)
  SELECT EXTRACT(DAY FROM NOW() - MAX(created_at))
  INTO days_since_activity
  FROM crm_activities
  WHERE contact_id = contact_id;

  IF days_since_activity IS NULL THEN
    health := health - 20; -- Never contacted
  ELSIF days_since_activity < 7 THEN
    health := health + 20; -- Very recent
  ELSIF days_since_activity < 30 THEN
    health := health + 10; -- Recent
  ELSE
    health := health - (days_since_activity / 10); -- Decaying
  END IF;

  -- Activity Frequency (0-20 points)
  SELECT COUNT(*)
  INTO activity_count
  FROM crm_activities
  WHERE contact_id = contact_id
    AND created_at > NOW() - INTERVAL '90 days';

  health := health + LEAST(activity_count, 20);

  -- Won Deals (0-30 points)
  SELECT COUNT(*)
  INTO won_deals_count
  FROM crm_deals
  WHERE contact_id = contact_id
    AND stage = 'won';

  health := health + (won_deals_count * 10);

  -- Email Engagement (0-20 points)
  SELECT
    CASE
      WHEN COUNT(*) = 0 THEN 0
      ELSE (COUNT(*) FILTER (WHERE email_opened = true)::NUMERIC / COUNT(*)) * 20
    END
  INTO email_engagement_rate
  FROM crm_email_sync
  WHERE contact_id = contact_id
    AND sent_at > NOW() - INTERVAL '90 days';

  health := health + COALESCE(email_engagement_rate, 0);

  -- Cap at 0-100
  health := GREATEST(0, LEAST(100, health));

  -- Update contact
  UPDATE crm_contacts
  SET health_score = health,
      updated_at = NOW()
  WHERE id = contact_id;

  RETURN health;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-update health score
CREATE TRIGGER update_health_score_on_activity
  AFTER INSERT OR UPDATE ON crm_activities
  FOR EACH ROW
  WHEN (NEW.contact_id IS NOT NULL)
  EXECUTE FUNCTION update_contact_health_score(NEW.contact_id);
```

### 3. Email Sentiment Analysis

```typescript
// Edge Function: analyze-email-sentiment
export async function analyzeEmailSentiment(emailBody: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "Analyze email sentiment and extract key information. Return JSON: {sentiment, intent, key_points, action_items}"
      },
      {
        role: "user",
        content: emailBody
      }
    ],
    response_format: { type: "json_object" }
  });

  const analysis = JSON.parse(response.choices[0].message.content);

  return {
    sentiment: analysis.sentiment, // positive, neutral, negative
    intent: analysis.intent, // inquiry, follow_up, objection, interested
    key_points: analysis.key_points,
    action_items: analysis.action_items
  };
}
```

## 📊 CRM Dashboard Components

### Deal Pipeline Visualization

```typescript
// components/crm/PipelineBoard.tsx
export function PipelineBoard() {
  const { data: pipeline } = useQuery({
    queryKey: ["pipeline"],
    queryFn: async () => {
      const { data } = await supabase
        .from("crm_deals")
        .select("*")
        .not("stage", "in", "('won','lost')")
        .order("probability", { ascending: false });

      return groupBy(data, "stage");
    }
  });

  const stages = [
    "lead", "contacted", "qualified", "proposal_sent",
    "negotiation", "verbal_agreement", "contract_sent"
  ];

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto">
        {stages.map(stage => (
          <Droppable key={stage} droppableId={stage}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="w-80 bg-gray-50 rounded-lg p-4"
              >
                <h3 className="font-semibold mb-4">
                  {stage.replace("_", " ").toUpperCase()}
                  <span className="ml-2 text-sm text-gray-500">
                    ${pipeline[stage]?.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
                  </span>
                </h3>

                {pipeline[stage]?.map((deal, index) => (
                  <Draggable key={deal.id} draggableId={deal.id} index={index}>
                    {(provided) => (
                      <DealCard
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        deal={deal}
                      />
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
```

## 🔄 Automated Workflows

### Example: Low Health Score Alert

```sql
INSERT INTO crm_workflows (user_id, workflow_name, trigger_type, trigger_conditions, actions)
VALUES (
  auth.uid(),
  'Alert on Low Health Score',
  'contact_created',
  '{"field": "health_score", "operator": "<", "value": 30}',
  ARRAY[
    '{"type": "create_task", "params": {"task_type": "check_in", "title": "Check in with low-health contact", "priority": "high", "due_days": 1}}'::jsonb,
    '{"type": "notify_user", "params": {"message": "Contact health score dropped below 30%", "channel": "email"}}'::jsonb
  ]
);
```

## ✅ Implementation Checklist

- [x] Core CRM tables (contacts, deals, activities, tasks)
- [x] Email sync integration (Gmail/Outlook)
- [x] AI-powered next-best-action
- [x] Automated health score calculation
- [ ] Pipeline drag-and-drop UI
- [ ] Email sentiment analysis
- [ ] Workflow automation engine
- [ ] Revenue forecasting dashboard
- [ ] Mobile CRM app (React Native)
- [ ] Reporting & analytics

---

**Status:** ✅ Ready for Implementation
**Last Updated:** October 2025
**Version:** 2.0
