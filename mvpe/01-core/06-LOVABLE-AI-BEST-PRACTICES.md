# Lovable AI Best Practices Guide
**AI Agents, Automations & Cloud Integration**

## Table of Contents
1. [AI-Powered Venue Recommendation System](#venue-recommendation)
2. [AI Use Cases & Patterns](#ai-use-cases)
3. [Edge Functions Architecture](#edge-functions)
4. [Data Storage & Security](#data-security)
5. [Integration Patterns](#integrations)
6. [Production Best Practices](#production)

---

## AI-Powered Venue Recommendation System {#venue-recommendation}

### Overview
Build an intelligent venue recommendation engine that evaluates event requirements and suggests the top 5 matching venues using Lovable AI.

### Database Schema

```sql
-- Venues table with searchable attributes
CREATE TABLE public.venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  address JSONB NOT NULL,
  capacity INTEGER NOT NULL,
  base_price NUMERIC NOT NULL,
  price_per_person NUMERIC,
  amenities TEXT[] DEFAULT ARRAY[]::TEXT[],
  event_types TEXT[] DEFAULT ARRAY[]::TEXT[], -- ['corporate', 'wedding', 'conference']
  features JSONB DEFAULT '{}'::JSONB, -- Flexible storage for AI analysis
  availability_calendar JSONB DEFAULT '{}'::JSONB,
  rating NUMERIC DEFAULT 5.0,
  images TEXT[],
  coordinates POINT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- AI venue recommendations log
CREATE TABLE public.ai_venue_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  search_criteria JSONB NOT NULL,
  recommendations JSONB NOT NULL,
  ai_reasoning TEXT,
  selected_venue_id UUID REFERENCES public.venues(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_venue_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public venues viewable by all"
  ON public.venues FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users view own recommendations"
  ON public.ai_venue_recommendations FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### Edge Function: Venue Recommendation AI

**File: `supabase/functions/recommend-venues/index.ts`**

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { eventType, capacity, budget, additionalDetails, location } = await req.json();

    // 1. Fetch candidate venues from database
    const { data: venues, error: venuesError } = await supabase
      .from('venues')
      .select('*')
      .contains('event_types', [eventType])
      .gte('capacity', capacity * 0.8) // Allow 20% flexibility
      .lte('base_price', budget * 1.2); // Allow 20% budget flexibility

    if (venuesError) throw venuesError;

    // 2. Use Lovable AI to intelligently rank and recommend venues
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    const systemPrompt = `You are an expert venue recommendation system. 
    Analyze the user's event requirements and the available venues to suggest the top 5 best matches.
    
    Consider:
    - Event type compatibility
    - Capacity fit (not too small, not wastefully large)
    - Budget alignment
    - Amenities match
    - Location convenience
    - Overall value for money
    
    Provide reasoning for each recommendation and rank them 1-5.`;

    const userPrompt = `
    Event Requirements:
    - Type: ${eventType}
    - Expected Attendees: ${capacity}
    - Budget: $${budget}
    - Additional Details: ${additionalDetails}
    - Preferred Location: ${location || 'Any'}
    
    Available Venues:
    ${JSON.stringify(venues, null, 2)}
    
    Please recommend the top 5 venues and explain your reasoning.
    `;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'recommend_venues',
            description: 'Return top 5 venue recommendations with rankings',
            parameters: {
              type: 'object',
              properties: {
                recommendations: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      venue_id: { type: 'string' },
                      rank: { type: 'integer' },
                      score: { type: 'number' },
                      reasoning: { type: 'string' },
                      pros: { type: 'array', items: { type: 'string' } },
                      cons: { type: 'array', items: { type: 'string' } }
                    },
                    required: ['venue_id', 'rank', 'score', 'reasoning']
                  }
                }
              },
              required: ['recommendations']
            }
          }
        }],
        tool_choice: { type: 'function', function: { name: 'recommend_venues' } }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API Error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      throw new Error(`AI API error: ${errorText}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices[0].message.tool_calls[0];
    const recommendations = JSON.parse(toolCall.function.arguments);

    // 3. Enrich recommendations with full venue data
    const enrichedRecommendations = recommendations.recommendations.map(rec => {
      const venue = venues.find(v => v.id === rec.venue_id);
      return { ...rec, venue };
    });

    // 4. Log recommendation for analytics and learning
    const { error: logError } = await supabase
      .from('ai_venue_recommendations')
      .insert({
        search_criteria: { eventType, capacity, budget, additionalDetails, location },
        recommendations: enrichedRecommendations,
        ai_reasoning: aiData.choices[0].message.content
      });

    if (logError) console.error('Failed to log recommendation:', logError);

    return new Response(
      JSON.stringify({ 
        recommendations: enrichedRecommendations,
        total_candidates: venues.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

### Frontend Implementation

```typescript
// hooks/use-venue-recommendations.ts
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface VenueSearchCriteria {
  eventType: string;
  capacity: number;
  budget: number;
  additionalDetails?: string;
  location?: string;
}

export function useVenueRecommendations() {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const { toast } = useToast();

  const searchVenues = async (criteria: VenueSearchCriteria) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('recommend-venues', {
        body: criteria
      });

      if (error) throw error;

      setRecommendations(data.recommendations);
      
      toast({
        title: "Venues Found!",
        description: `Found ${data.recommendations.length} matching venues`,
      });

      return data.recommendations;
    } catch (error) {
      console.error('Venue search error:', error);
      toast({
        title: "Search Failed",
        description: error.message,
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return { searchVenues, recommendations, isLoading };
}
```

---

## AI Use Cases & Patterns {#ai-use-cases}

### 1. AI Chatbot / Conversational Agent

**Use Case**: Event planning assistant that helps users create events through natural conversation.

```typescript
// supabase/functions/event-planning-chatbot/index.ts
const systemPrompt = `You are an expert event planning assistant.
Help users create amazing events by asking the right questions and providing guidance.

You can:
- Suggest event ideas based on their goals
- Recommend appropriate venues
- Calculate budgets
- Suggest timelines
- Provide vendor recommendations

Always be helpful, concise, and action-oriented.`;

// Use streaming for real-time responses
const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${LOVABLE_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'google/gemini-2.5-flash',
    messages: conversationHistory,
    stream: true
  }),
});

// Return SSE stream to frontend
return new Response(response.body, {
  headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' }
});
```

### 2. Sentiment Detection

**Use Case**: Analyze event feedback and attendee reviews to understand satisfaction levels.

```typescript
// supabase/functions/analyze-feedback/index.ts
const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${LOVABLE_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'google/gemini-2.5-flash',
    messages: [{
      role: 'user',
      content: `Analyze the sentiment of this event feedback: "${feedbackText}"`
    }],
    tools: [{
      type: 'function',
      function: {
        name: 'analyze_sentiment',
        parameters: {
          type: 'object',
          properties: {
            sentiment: { 
              type: 'string', 
              enum: ['positive', 'negative', 'neutral', 'mixed'] 
            },
            confidence: { type: 'number' },
            key_themes: { type: 'array', items: { type: 'string' } },
            actionable_insights: { type: 'array', items: { type: 'string' } }
          },
          required: ['sentiment', 'confidence']
        }
      }
    }],
    tool_choice: { type: 'function', function: { name: 'analyze_sentiment' } }
  }),
});
```

### 3. Document Q&A

**Use Case**: Let users ask questions about event contracts, venue policies, or planning guides.

```typescript
// supabase/functions/document-qa/index.ts
const documentContent = await getDocumentFromStorage(documentId);

const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${LOVABLE_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'google/gemini-2.5-flash',
    messages: [
      { 
        role: 'system', 
        content: `You are a helpful assistant that answers questions about documents.
        Base your answers ONLY on the provided document content.
        If the answer is not in the document, say so.`
      },
      {
        role: 'user',
        content: `Document:\n${documentContent}\n\nQuestion: ${question}`
      }
    ]
  }),
});
```

### 4. Creative Generation

**Use Case**: Generate event descriptions, marketing copy, email templates.

```typescript
// supabase/functions/generate-content/index.ts
const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${LOVABLE_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'google/gemini-2.5-flash',
    messages: [{
      role: 'user',
      content: `Generate an engaging event description for:
      Event Type: ${eventType}
      Target Audience: ${targetAudience}
      Key Features: ${features.join(', ')}
      Tone: ${tone}
      
      Make it compelling and action-oriented.`
    }]
  }),
});
```

### 5. Multilingual Translation

**Use Case**: Translate event details for international audiences.

```typescript
// supabase/functions/translate-content/index.ts
const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${LOVABLE_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'google/gemini-2.5-flash',
    messages: [{
      role: 'user',
      content: `Translate this event content to ${targetLanguage}:
      ${content}
      
      Maintain the tone and formatting.`
    }]
  }),
});
```

### 6. Image & Document Analysis

**Use Case**: Extract event details from uploaded flyers or analyze venue photos.

```typescript
// supabase/functions/analyze-image/index.ts
const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${LOVABLE_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'google/gemini-2.5-pro', // Use Pro for vision tasks
    messages: [{
      role: 'user',
      content: [
        {
          type: 'text',
          text: 'Extract event details from this flyer: date, time, location, ticket price'
        },
        {
          type: 'image_url',
          image_url: { url: imageDataUrl }
        }
      ]
    }],
    tools: [{
      type: 'function',
      function: {
        name: 'extract_event_details',
        parameters: {
          type: 'object',
          properties: {
            event_name: { type: 'string' },
            date: { type: 'string' },
            time: { type: 'string' },
            location: { type: 'string' },
            ticket_price: { type: 'number' }
          }
        }
      }
    }],
    tool_choice: { type: 'function', function: { name: 'extract_event_details' } }
  }),
});
```

### 7. Task Completion Workflows (Agentic)

**Use Case**: Automatically handle post-event tasks like sending surveys, generating reports.

```typescript
// supabase/functions/post-event-workflow/index.ts
const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${LOVABLE_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'google/gemini-2.5-flash',
    messages: [{
      role: 'system',
      content: `You are an event management automation agent.
      After an event ends, you must:
      1. Generate an attendance report
      2. Create a feedback survey
      3. Draft a thank-you email
      4. Identify actionable insights
      
      Use the provided tools to complete these tasks.`
    }],
    tools: [
      {
        type: 'function',
        function: {
          name: 'generate_report',
          description: 'Generate event analytics report',
          parameters: { /* ... */ }
        }
      },
      {
        type: 'function',
        function: {
          name: 'create_survey',
          description: 'Create post-event feedback survey',
          parameters: { /* ... */ }
        }
      },
      {
        type: 'function',
        function: {
          name: 'send_email',
          description: 'Send email to attendees',
          parameters: { /* ... */ }
        }
      }
    ]
  }),
});
```

---

## Edge Functions Architecture {#edge-functions}

### Best Practices

#### 1. CORS & Security
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Restrict in production
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle OPTIONS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Verify auth
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
  );

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Your logic here
});
```

#### 2. Rate Limiting
```typescript
// Check rate limit from database
const { data: rateLimitData } = await supabase
  .from('rate_limits')
  .select('request_count, window_start')
  .eq('user_id', user.id)
  .eq('endpoint', 'recommend-venues')
  .single();

const now = new Date();
const windowStart = rateLimitData?.window_start ? new Date(rateLimitData.window_start) : now;
const windowDuration = 60 * 1000; // 1 minute

if (now - windowStart < windowDuration && rateLimitData?.request_count >= 10) {
  return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
    status: 429,
    headers: corsHeaders
  });
}
```

#### 3. Error Handling
```typescript
try {
  // Your logic
} catch (error) {
  console.error('Function error:', error);
  
  // Log to monitoring (Sentry, etc.)
  await logError({
    function: 'recommend-venues',
    user_id: user.id,
    error: error.message,
    stack: error.stack
  });

  // Return user-friendly error
  return new Response(
    JSON.stringify({ 
      error: 'An unexpected error occurred',
      request_id: crypto.randomUUID()
    }),
    { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}
```

#### 4. Background Tasks
```typescript
// Use EdgeRuntime.waitUntil for non-blocking operations
EdgeRuntime.waitUntil(
  sendEmailNotification(user.email, recommendations)
);

// Return immediately
return new Response(
  JSON.stringify({ recommendations }),
  { headers: corsHeaders }
);
```

---

## Data Storage & Security {#data-security}

### Storage Buckets

```sql
-- Create storage bucket for event images
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-images', 'event-images', true);

-- RLS policies for storage
CREATE POLICY "Public images viewable by all"
ON storage.objects FOR SELECT
USING (bucket_id = 'event-images');

CREATE POLICY "Authenticated users upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'event-images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### File Upload Pattern

```typescript
// components/ImageUpload.tsx
const uploadImage = async (file: File) => {
  const userId = user.id;
  const filePath = `${userId}/${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from('event-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('event-images')
    .getPublicUrl(filePath);

  return publicUrl;
};
```

### RLS Patterns

```sql
-- Multi-tenant isolation
CREATE POLICY "Users access own org data"
ON public.events FOR ALL
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.user_organizations 
    WHERE user_id = auth.uid()
  )
);

-- Role-based access
CREATE POLICY "Admins manage all events"
ON public.events FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
```

---

## Integration Patterns {#integrations}

### Stripe Payments

```typescript
// supabase/functions/create-checkout/index.ts
import Stripe from 'https://esm.sh/stripe@12.0.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
});

const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [{
    price_data: {
      currency: 'usd',
      product_data: { name: ticket.name },
      unit_amount: ticket.price * 100,
    },
    quantity: 1,
  }],
  mode: 'payment',
  success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${origin}/cancel`,
  metadata: {
    ticket_id: ticket.id,
    user_id: user.id
  }
});
```

### Email with Resend

```typescript
// supabase/functions/send-ticket/index.ts
const response = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: 'events@yourdomain.com',
    to: attendee.email,
    subject: `Your ticket for ${event.name}`,
    html: ticketEmailTemplate(attendee, event)
  }),
});
```

### Scheduled Tasks (pg_cron)

```sql
-- Enable pg_cron
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Send reminder emails 24 hours before events
SELECT cron.schedule(
  'send-event-reminders',
  '0 9 * * *', -- Every day at 9 AM
  $$
  SELECT net.http_post(
    url := 'https://[PROJECT_ID].supabase.co/functions/v1/send-reminders',
    headers := '{"Authorization": "Bearer [ANON_KEY]", "Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  ) as request_id;
  $$
);
```

---

## Production Best Practices {#production}

### 1. Monitoring & Observability

```typescript
// Add correlation IDs to all requests
const correlationId = crypto.randomUUID();
console.log(`[${correlationId}] Processing request`, { user_id: user.id });

// Log AI usage for analytics
await supabase.from('ai_usage_logs').insert({
  user_id: user.id,
  function_name: 'recommend-venues',
  model: 'google/gemini-2.5-flash',
  tokens_used: aiData.usage.total_tokens,
  cost_estimate: calculateCost(aiData.usage),
  correlation_id: correlationId
});
```

### 2. Caching Strategy

```typescript
// Cache venue data (changes infrequently)
const cacheKey = `venues:${eventType}:${capacity}`;
const cachedData = await redis.get(cacheKey);

if (cachedData) {
  return JSON.parse(cachedData);
}

const venues = await fetchVenues();
await redis.set(cacheKey, JSON.stringify(venues), 'EX', 3600); // 1 hour
```

### 3. Graceful Degradation

```typescript
// Fallback to simple search if AI fails
let recommendations;
try {
  recommendations = await aiRecommendVenues(criteria);
} catch (error) {
  console.error('AI failed, using fallback:', error);
  recommendations = await simpleVenueSearch(criteria);
}
```

### 4. Testing Edge Functions Locally

```bash
# Start local Supabase
supabase start

# Serve function locally
supabase functions serve recommend-venues --env-file .env.local

# Test with curl
curl -i --location --request POST 'http://localhost:54321/functions/v1/recommend-venues' \
  --header 'Authorization: Bearer [ANON_KEY]' \
  --header 'Content-Type: application/json' \
  --data '{"eventType":"conference","capacity":200,"budget":10000}'
```

### 5. CI/CD for Functions

```yaml
# .github/workflows/deploy-functions.yml
name: Deploy Functions
on:
  push:
    branches: [main]
    paths: ['supabase/functions/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: supabase/setup-cli@v1
      - run: supabase functions deploy --project-ref ${{ secrets.PROJECT_ID }}
```

---

## Key Takeaways

✅ **Always use Lovable AI first** - It's pre-configured and requires no API keys
✅ **Use tool calling for structured output** - Don't parse JSON from text
✅ **Log AI interactions** - Build feedback loops for improvement
✅ **Implement proper RLS** - Never trust client-side checks
✅ **Handle rate limits gracefully** - 429/402 errors from AI gateway
✅ **Use background tasks** - Keep responses fast with `EdgeRuntime.waitUntil`
✅ **Monitor everything** - Correlation IDs, error tracking, cost analysis
✅ **Test locally first** - Use `supabase functions serve`

---

**Last Updated**: 2025-10-08  
**Status**: Production-Ready Guidelines  
**Related Docs**: 
- [00-master-plan.md](00-MASTER-PLAN%201.md)
- [13-ai-agents-automation-guide.md](./13-ai-agents-automation-guide.md)
- [Lovable AI Docs](https://docs.lovable.dev/features/ai)
- [Lovable Cloud Docs](https://docs.lovable.dev/features/cloud)
