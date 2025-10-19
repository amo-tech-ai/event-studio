# 06 - WhatsApp Business Automation

## 📱 Overview

WhatsApp Business API integration for automated attendee communications, event reminders, and real-time updates.

## 🏗️ Architecture

```mermaid
graph TB
    subgraph "Trigger Sources"
        Event[Event Published]
        Schedule[Scheduled Tasks]
        Manual[Manual Trigger]
        AI[AI Generated Task]
    end
    
    subgraph "WhatsApp System"
        Queue[Message Queue]
        RateLimit[Rate Limiter]
        Template[Template Manager]
        Sender[WhatsApp Sender]
    end
    
    subgraph "WhatsApp Business API"
        WA[WhatsApp Cloud API]
        Meta[Meta Business Platform]
    end
    
    subgraph "Database"
        Logs[Message Logs]
        Status[Delivery Status]
    end
    
    Event --> Queue
    Schedule --> Queue
    Manual --> Queue
    AI --> Queue
    
    Queue --> RateLimit
    RateLimit --> Template
    Template --> Sender
    Sender --> WA
    WA --> Meta
    
    Sender --> Logs
    WA --> Status
```

## 🔐 Setup & Authentication

### Prerequisites
1. Meta Business Account
2. WhatsApp Business Platform access
3. Phone number verified with WhatsApp
4. Access token from Meta

### Configuration

```sql
-- Store WhatsApp configuration securely
CREATE TABLE public.whatsapp_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  phone_number_id TEXT NOT NULL,
  business_account_id TEXT NOT NULL,
  access_token_encrypted TEXT NOT NULL, -- Encrypt with Vault
  webhook_verify_token TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  rate_limit_tier TEXT DEFAULT 'tier_1000', -- messaging tier
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Message templates (pre-approved by Meta)
CREATE TABLE public.whatsapp_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  template_name TEXT NOT NULL,
  language TEXT DEFAULT 'en',
  category TEXT NOT NULL CHECK (category IN ('MARKETING', 'UTILITY', 'AUTHENTICATION')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  template_body TEXT NOT NULL,
  variables JSONB DEFAULT '[]',
  meta_template_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, template_name, language)
);

-- Message queue for rate limiting
CREATE TABLE public.whatsapp_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_id UUID REFERENCES ai_events(id) ON DELETE CASCADE,
  recipient_phone TEXT NOT NULL,
  template_name TEXT NOT NULL,
  template_variables JSONB DEFAULT '{}',
  priority INTEGER DEFAULT 5 CHECK (priority >= 1 AND priority <= 10),
  scheduled_for TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'queued' CHECK (status IN ('queued', 'sending', 'sent', 'failed')),
  retry_count INTEGER DEFAULT 0,
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_queue_user_status ON whatsapp_queue(user_id, status);
CREATE INDEX idx_queue_scheduled ON whatsapp_queue(scheduled_for) WHERE status = 'queued';
```

### Secrets Setup

```typescript
// Add secrets via Lovable
// - WHATSAPP_ACCESS_TOKEN
// - WHATSAPP_PHONE_NUMBER_ID
// - WHATSAPP_WEBHOOK_VERIFY_TOKEN
```

## 📤 Message Flow

```mermaid
sequenceDiagram
    participant Organizer
    participant Edge as send-whatsapp
    participant Queue as Message Queue
    participant Worker as Queue Processor
    participant WA as WhatsApp API
    participant Attendee
    
    Organizer->>Edge: Send event reminder
    Edge->>Queue: INSERT INTO whatsapp_queue
    Edge-->>Organizer: Queued successfully
    
    loop Every 10 seconds
        Worker->>Queue: SELECT pending messages
        Queue-->>Worker: Batch of messages
        
        Worker->>Worker: Check rate limits
        
        alt Within rate limit
            Worker->>WA: POST /messages
            WA-->>Worker: message_id, status
            Worker->>Queue: UPDATE status = 'sent'
            WA->>Attendee: WhatsApp message
        else Rate limit exceeded
            Worker->>Queue: UPDATE scheduled_for (delay)
        end
    end
```

## 🔧 Edge Functions

### 1. Queue Message Endpoint

```typescript
// supabase/functions/queue-whatsapp/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { eventId, recipients, templateName, variables, scheduledFor } = await req.json();
    
    const authHeader = req.headers.get('Authorization')!;
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get user from auth header
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    // Validate template exists and is approved
    const { data: template, error: templateError } = await supabase
      .from('whatsapp_templates')
      .select('*')
      .eq('user_id', user.id)
      .eq('template_name', templateName)
      .eq('status', 'approved')
      .single();

    if (templateError || !template) {
      throw new Error('Template not found or not approved');
    }

    // Queue messages for each recipient
    const messages = recipients.map((phone: string) => ({
      user_id: user.id,
      event_id: eventId,
      recipient_phone: phone,
      template_name: templateName,
      template_variables: variables,
      scheduled_for: scheduledFor || new Date().toISOString(),
    }));

    const { data, error } = await supabase
      .from('whatsapp_queue')
      .insert(messages)
      .select();

    if (error) throw error;

    return new Response(
      JSON.stringify({ queued: data.length, messages: data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Queue error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
```

### 2. Queue Processor (Cron Job)

```sql
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule queue processor every 10 seconds
SELECT cron.schedule(
  'process-whatsapp-queue',
  '*/10 * * * * *', -- Every 10 seconds
  $$
  SELECT net.http_post(
    url := 'https://jnmfterqvevgusfckxbt.supabase.co/functions/v1/process-whatsapp-queue',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $$
);
```

```typescript
// supabase/functions/process-whatsapp-queue/index.ts
serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // Fetch pending messages
  const { data: messages, error } = await supabase
    .from('whatsapp_queue')
    .select('*')
    .eq('status', 'queued')
    .lte('scheduled_for', new Date().toISOString())
    .order('priority', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(100); // Process 100 at a time

  if (error || !messages || messages.length === 0) {
    return new Response(JSON.stringify({ processed: 0 }), { status: 200 });
  }

  let sent = 0;
  let failed = 0;

  for (const msg of messages) {
    try {
      // Get user's WhatsApp config
      const { data: config } = await supabase
        .from('whatsapp_config')
        .select('*')
        .eq('user_id', msg.user_id)
        .eq('status', 'active')
        .single();

      if (!config) {
        await supabase
          .from('whatsapp_queue')
          .update({ status: 'failed', error_message: 'WhatsApp not configured' })
          .eq('id', msg.id);
        failed++;
        continue;
      }

      // Check rate limits (tier-based)
      const rateLimitOk = await checkRateLimit(supabase, msg.user_id, config.rate_limit_tier);
      
      if (!rateLimitOk) {
        // Reschedule for later
        await supabase
          .from('whatsapp_queue')
          .update({ 
            scheduled_for: new Date(Date.now() + 60000).toISOString() // +1 minute
          })
          .eq('id', msg.id);
        continue;
      }

      // Send via WhatsApp API
      await supabase
        .from('whatsapp_queue')
        .update({ status: 'sending' })
        .eq('id', msg.id);

      const response = await fetch(
        `https://graph.facebook.com/v18.0/${config.phone_number_id}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${config.access_token_encrypted}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: msg.recipient_phone,
            type: 'template',
            template: {
              name: msg.template_name,
              language: { code: 'en' },
              components: [
                {
                  type: 'body',
                  parameters: Object.values(msg.template_variables || {}).map(val => ({
                    type: 'text',
                    text: String(val)
                  }))
                }
              ]
            }
          })
        }
      );

      const result = await response.json();

      if (response.ok) {
        await supabase
          .from('whatsapp_queue')
          .update({ 
            status: 'sent',
            sent_at: new Date().toISOString(),
            error_message: null
          })
          .eq('id', msg.id);
        
        // Log rate limit usage
        await logRateLimitUsage(supabase, msg.user_id);
        sent++;
      } else {
        throw new Error(result.error?.message || 'Send failed');
      }

    } catch (error) {
      console.error(`Failed to send message ${msg.id}:`, error);
      
      await supabase
        .from('whatsapp_queue')
        .update({
          status: msg.retry_count >= 3 ? 'failed' : 'queued',
          retry_count: msg.retry_count + 1,
          error_message: error.message,
          scheduled_for: new Date(Date.now() + 300000).toISOString() // +5 minutes
        })
        .eq('id', msg.id);
      
      failed++;
    }
  }

  return new Response(
    JSON.stringify({ processed: messages.length, sent, failed }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
});

async function checkRateLimit(supabase: any, userId: string, tier: string): Promise<boolean> {
  const limits: Record<string, number> = {
    'tier_1000': 1000,
    'tier_10000': 10000,
    'tier_100000': 100000,
  };

  const maxPerMinute = limits[tier] || 1000;
  const oneMinuteAgo = new Date(Date.now() - 60000).toISOString();

  const { count } = await supabase
    .from('whatsapp_queue')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'sent')
    .gte('sent_at', oneMinuteAgo);

  return (count || 0) < maxPerMinute;
}

async function logRateLimitUsage(supabase: any, userId: string) {
  await supabase
    .from('rate_limits')
    .insert({
      user_id: userId,
      service: 'whatsapp',
      endpoint: 'send_message',
      count: 1,
      window_start: new Date().toISOString()
    });
}
```

## 📋 Message Templates

### Pre-Approved Templates (Examples)

```json
{
  "event_reminder_24h": {
    "name": "event_reminder_24h",
    "category": "UTILITY",
    "language": "en",
    "body": "Hi {{1}}! Your event '{{2}}' starts tomorrow at {{3}}. See you there! 🎉",
    "variables": ["attendee_name", "event_name", "event_time"]
  },
  "check_in_instructions": {
    "name": "check_in_instructions",
    "category": "UTILITY",
    "language": "en",
    "body": "Welcome to {{1}}! Show this QR code at check-in: {{2}}",
    "variables": ["event_name", "qr_code_url"]
  },
  "event_update": {
    "name": "event_update",
    "category": "UTILITY",
    "language": "en",
    "body": "Update for {{1}}: {{2}}",
    "variables": ["event_name", "update_message"]
  }
}
```

## 🤖 AI-Powered Automation

```mermaid
graph LR
    subgraph "AI Task Generation"
        Event[Event Created]
        AI[AI Agent]
        Tasks[Task Queue]
    end
    
    subgraph "WhatsApp Automation"
        Schedule[Scheduler]
        Queue[Message Queue]
        Send[Send Messages]
    end
    
    Event --> AI
    AI --> Tasks
    
    Tasks -->|7 days before| Schedule
    Tasks -->|1 day before| Schedule
    Tasks -->|Day of event| Schedule
    
    Schedule --> Queue
    Queue --> Send
```

### Auto-Generated Tasks

```sql
-- AI tasks trigger WhatsApp messages
CREATE TABLE public.ai_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES ai_events(id) ON DELETE CASCADE,
  task_type TEXT NOT NULL CHECK (task_type IN ('send_reminder', 'send_update', 'check_in_prep')),
  status TEXT DEFAULT 'pending',
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  template_name TEXT NOT NULL,
  recipient_filter JSONB, -- e.g., {"ticket_type": "VIP"}
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger function to queue WhatsApp messages from AI tasks
CREATE OR REPLACE FUNCTION queue_whatsapp_from_task()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'executing' AND OLD.status = 'pending' THEN
    -- Get attendees for this event
    INSERT INTO whatsapp_queue (user_id, event_id, recipient_phone, template_name, template_variables)
    SELECT 
      e.organizer_id,
      NEW.event_id,
      a.attendee_info->>'phone',
      NEW.template_name,
      jsonb_build_object(
        'attendee_name', a.attendee_info->>'name',
        'event_name', e.name,
        'event_time', e.start_date::text
      )
    FROM attendees a
    JOIN orders o ON a.order_id = o.id
    JOIN ai_events e ON o.event_id = e.id
    WHERE e.id = NEW.event_id
      AND a.attendee_info->>'phone' IS NOT NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_queue_whatsapp
  AFTER UPDATE ON ai_tasks
  FOR EACH ROW
  EXECUTE FUNCTION queue_whatsapp_from_task();
```

## 📊 Monitoring & Analytics

```sql
-- Message delivery tracking
CREATE TABLE public.whatsapp_delivery_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_id UUID REFERENCES whatsapp_queue(id) ON DELETE CASCADE,
  status TEXT NOT NULL, -- sent, delivered, read, failed
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  meta_message_id TEXT,
  error_code TEXT,
  error_message TEXT
);

CREATE INDEX idx_delivery_queue ON whatsapp_delivery_logs(queue_id);
CREATE INDEX idx_delivery_timestamp ON whatsapp_delivery_logs(timestamp);

-- Analytics view
CREATE VIEW whatsapp_analytics AS
SELECT 
  DATE(sent_at) as date,
  user_id,
  COUNT(*) as total_sent,
  COUNT(*) FILTER (WHERE status = 'sent') as successful,
  COUNT(*) FILTER (WHERE status = 'failed') as failed,
  AVG(EXTRACT(EPOCH FROM (sent_at - created_at))) as avg_queue_time_seconds
FROM whatsapp_queue
WHERE sent_at IS NOT NULL
GROUP BY DATE(sent_at), user_id;
```

## ✅ Implementation Checklist

- [ ] Set up Meta Business Account
- [ ] Verify phone number with WhatsApp
- [ ] Create and store access token securely
- [ ] Database tables for config/queue/templates
- [ ] Edge function: queue-whatsapp
- [ ] Edge function: process-whatsapp-queue
- [ ] Set up pg_cron job
- [ ] Create message templates
- [ ] Submit templates for Meta approval
- [ ] Implement rate limiting
- [ ] Add delivery webhook handler
- [ ] Create analytics dashboard
- [ ] Test end-to-end flow

## 🚀 Usage Example

```typescript
// Queue a reminder message
const { data } = await supabase.functions.invoke('queue-whatsapp', {
  body: {
    eventId: 'event-uuid',
    recipients: ['+1234567890', '+0987654321'],
    templateName: 'event_reminder_24h',
    variables: {
      attendee_name: 'John Doe',
      event_name: 'Tech Summit 2025',
      event_time: '2025-03-15 10:00 AM'
    },
    scheduledFor: '2025-03-14T10:00:00Z' // 24h before
  }
});
```

## ⚠️ Important Notes

- **Rate Limits**: Messaging tier determines max messages/day (1K, 10K, 100K+)
- **Template Approval**: All templates must be pre-approved by Meta (24-48h)
- **Phone Format**: Use E.164 format (+country code + number)
- **Opt-in Required**: Users must opt-in to receive WhatsApp messages
- **24-Hour Window**: Can only send template messages outside 24h window
- **Costs**: Charged per message based on country/template type
