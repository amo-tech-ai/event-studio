# 💻 EventOS OpenAI Integration Code Snippets

**Project:** EventOS - AI-Powered Event Management  
**Analysis Date:** 2025-01-17  
**Scope:** Practical Code Examples for OpenAI Integration

---

## 🚀 Quick Start Setup

### **1. OpenAI Agents SDK Initialization**

```typescript
// src/lib/openai-agents.ts
import { Agent, function_tool } from 'openai-agents';

// Initialize OpenAI Agents SDK
const eventAgent = new Agent({
  name: "EventOS Agent",
  instructions: "You are an AI assistant for EventOS, helping users create and manage events. Always be helpful, professional, and efficient.",
  model: "gpt-4o",
  tools: [
    createEventTool,
    searchVenuesTool,
    processPaymentTool,
    sendWhatsAppMessageTool
  ]
});

export { eventAgent };
```

### **2. Environment Configuration**

```bash
# .env.local
OPENAI_API_KEY=your_openai_api_key_here
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
STRIPE_SECRET_KEY=your_stripe_secret_key
WHATSAPP_API_TOKEN=your_whatsapp_token
```

---

## 🛠️ Core Function Tools

### **1. Event Creation Tool**

```typescript
// src/agents/tools/event-creation.ts
import { function_tool } from 'openai-agents';
import { supabase } from '@/lib/supabase';

export const createEventTool = function_tool({
  name: "create_event",
  description: "Create a new event with all necessary details",
  parameters: {
    type: "object",
    properties: {
      title: { type: "string", description: "Event title" },
      description: { type: "string", description: "Event description" },
      start_date: { type: "string", format: "date-time" },
      end_date: { type: "string", format: "date-time" },
      venue_id: { type: "string", description: "Venue ID" },
      capacity: { type: "number", description: "Maximum attendees" },
      is_paid: { type: "boolean", description: "Whether event is paid" },
      currency: { type: "string", default: "CAD" }
    },
    required: ["title", "start_date", "end_date"]
  },
  async handler(params) {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert({
          title: params.title,
          description: params.description,
          start_date: params.start_date,
          end_date: params.end_date,
          venue_id: params.venue_id,
          capacity: params.capacity,
          is_paid: params.is_paid || false,
          currency: params.currency,
          status: 'draft'
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        event_id: data.id,
        message: `Event "${params.title}" created successfully!`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
});
```

### **2. Venue Search Tool**

```typescript
// src/agents/tools/venue-search.ts
import { function_tool } from 'openai-agents';
import { supabase } from '@/lib/supabase';

export const searchVenuesTool = function_tool({
  name: "search_venues",
  description: "Search for available venues based on criteria",
  parameters: {
    type: "object",
    properties: {
      location: { type: "string", description: "City or area" },
      capacity: { type: "number", description: "Minimum capacity required" },
      date: { type: "string", format: "date" },
      amenities: { 
        type: "array", 
        items: { type: "string" },
        description: "Required amenities (parking, wifi, catering, etc.)"
      },
      budget: { type: "number", description: "Maximum budget per day" }
    },
    required: ["location", "capacity"]
  },
  async handler(params) {
    try {
      let query = supabase
        .from('venues')
        .select('*')
        .eq('city', params.location)
        .gte('capacity', params.capacity)
        .eq('status', 'active');

      if (params.date) {
        query = query.not('unavailable_dates', 'cs', `["${params.date}"]`);
      }

      if (params.budget) {
        query = query.lte('daily_rate', params.budget);
      }

      const { data, error } = await query.limit(10);

      if (error) throw error;

      return {
        success: true,
        venues: data,
        count: data.length
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
});
```

### **3. Payment Processing Tool**

```typescript
// src/agents/tools/payment-processing.ts
import { function_tool } from 'openai-agents';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const processPaymentTool = function_tool({
  name: "process_payment",
  description: "Process ticket payment through Stripe",
  parameters: {
    type: "object",
    properties: {
      event_id: { type: "string" },
      ticket_tier_id: { type: "string" },
      quantity: { type: "number", minimum: 1 },
      customer_email: { type: "string", format: "email" },
      customer_name: { type: "string" },
      payment_method_id: { type: "string" }
    },
    required: ["event_id", "ticket_tier_id", "quantity", "customer_email", "payment_method_id"]
  },
  async handler(params) {
    try {
      // Get ticket tier details
      const { data: ticketTier } = await supabase
        .from('ticket_tiers')
        .select('*, events(*)')
        .eq('id', params.ticket_tier_id)
        .single();

      if (!ticketTier) {
        throw new Error('Ticket tier not found');
      }

      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: ticketTier.price * params.quantity * 100, // Convert to cents
        currency: ticketTier.currency.toLowerCase(),
        payment_method: params.payment_method_id,
        confirmation_method: 'manual',
        confirm: true,
        customer_email: params.customer_email,
        metadata: {
          event_id: params.event_id,
          ticket_tier_id: params.ticket_tier_id,
          quantity: params.quantity.toString()
        }
      });

      if (paymentIntent.status === 'succeeded') {
        // Create order record
        const { data: order } = await supabase
          .from('orders')
          .insert({
            event_id: params.event_id,
            ticket_tier_id: params.ticket_tier_id,
            quantity: params.quantity,
            total_amount: ticketTier.price * params.quantity,
            currency: ticketTier.currency,
            payment_status: 'completed',
            stripe_payment_intent_id: paymentIntent.id,
            customer_email: params.customer_email,
            customer_name: params.customer_name
          })
          .select()
          .single();

        // Update ticket tier sold count
        await supabase
          .from('ticket_tiers')
          .update({ quantity_sold: ticketTier.quantity_sold + params.quantity })
          .eq('id', params.ticket_tier_id);

        return {
          success: true,
          order_id: order.id,
          payment_intent_id: paymentIntent.id,
          message: 'Payment processed successfully!'
        };
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
});
```

---

## 📱 WhatsApp Integration

### **1. WhatsApp Message Tool**

```typescript
// src/agents/tools/whatsapp.ts
import { function_tool } from 'openai-agents';

export const sendWhatsAppMessageTool = function_tool({
  name: "send_whatsapp_message",
  description: "Send WhatsApp message to attendee",
  parameters: {
    type: "object",
    properties: {
      phone_number: { type: "string", description: "Recipient phone number with country code" },
      message: { type: "string", description: "Message content" },
      template_name: { type: "string", description: "WhatsApp template name (optional)" },
      template_params: { 
        type: "array", 
        items: { type: "string" },
        description: "Template parameters (optional)"
      }
    },
    required: ["phone_number", "message"]
  },
  async handler(params) {
    try {
      const response = await fetch('https://graph.facebook.com/v18.0/YOUR_PHONE_NUMBER_ID/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: params.phone_number,
          type: 'text',
          text: { body: params.message }
        })
      });

      const result = await response.json();

      return {
        success: true,
        message_id: result.messages[0].id,
        message: 'WhatsApp message sent successfully!'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
});
```

---

## 🔄 Webhook Handlers

### **1. Stripe Webhook Handler**

```typescript
// src/api/webhooks/stripe.ts
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).send('Webhook Error');
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
      break;
    
    case 'payment_intent.payment_failed':
      await handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
      break;
    
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const { event_id, ticket_tier_id, quantity } = paymentIntent.metadata;
  
  // Update order status
  await supabase
    .from('orders')
    .update({ 
      payment_status: 'completed',
      paid_at: new Date().toISOString()
    })
    .eq('stripe_payment_intent_id', paymentIntent.id);

  // Send WhatsApp confirmation
  await sendWhatsAppConfirmation(event_id, paymentIntent.receipt_email!);
}

async function sendWhatsAppConfirmation(eventId: string, email: string) {
  // Get event details
  const { data: event } = await supabase
    .from('events')
    .select('title, start_date, venues(name, address)')
    .eq('id', eventId)
    .single();

  if (event) {
    const message = `🎉 Your ticket for "${event.title}" is confirmed!\n\n📅 Date: ${new Date(event.start_date).toLocaleDateString()}\n📍 Venue: ${event.venues.name}\n\nWe're excited to see you there!`;
    
    // Trigger WhatsApp message via agent
    // This would typically be handled by the WhatsApp agent
  }
}
```

---

## 🎯 Agent Orchestration

### **1. Multi-Agent Event Creation Workflow**

```typescript
// src/agents/workflows/event-creation.ts
import { Agent, function_tool } from 'openai-agents';

export class EventCreationWorkflow {
  private eventAgent: Agent;
  private venueAgent: Agent;
  private marketingAgent: Agent;

  constructor() {
    this.eventAgent = new Agent({
      name: "Event Creation Agent",
      instructions: "Create events with optimal configuration",
      model: "gpt-4o",
      tools: [createEventTool]
    });

    this.venueAgent = new Agent({
      name: "Venue Matching Agent", 
      instructions: "Find the best venues for events",
      model: "gpt-4o",
      tools: [searchVenuesTool]
    });

    this.marketingAgent = new Agent({
      name: "Marketing Agent",
      instructions: "Generate marketing content and campaigns",
      model: "gpt-4o", 
      tools: [generateMarketingContentTool]
    });
  }

  async createEvent(userInput: string) {
    try {
      // Step 1: Parse user requirements
      const requirements = await this.eventAgent.run(
        `Parse these event requirements: "${userInput}". Extract title, date, capacity, location, and budget.`
      );

      // Step 2: Find suitable venues
      const venueSearch = await this.venueAgent.run(
        `Find venues for: ${JSON.stringify(requirements)}`
      );

      // Step 3: Create event with selected venue
      const eventCreation = await this.eventAgent.run(
        `Create event with venue: ${venueSearch.best_venue}`
      );

      // Step 4: Generate marketing content
      const marketingContent = await this.marketingAgent.run(
        `Create marketing content for event: ${eventCreation.event_id}`
      );

      return {
        success: true,
        event_id: eventCreation.event_id,
        venue: venueSearch.best_venue,
        marketing: marketingContent
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}
```

---

## 📊 Real-time Analytics

### **1. Event Dashboard Updates**

```typescript
// src/agents/tools/analytics.ts
import { function_tool } from 'openai-agents';
import { supabase } from '@/lib/supabase';

export const updateEventDashboardTool = function_tool({
  name: "update_event_dashboard",
  description: "Update real-time event dashboard metrics",
  parameters: {
    type: "object",
    properties: {
      event_id: { type: "string" },
      metric_type: { 
        type: "string", 
        enum: ["registration", "revenue", "engagement", "attendance"]
      },
      value: { type: "number" },
      timestamp: { type: "string", format: "date-time" }
    },
    required: ["event_id", "metric_type", "value"]
  },
  async handler(params) {
    try {
      const { data, error } = await supabase
        .from('event_dashboards')
        .upsert({
          event_id: params.event_id,
          [params.metric_type]: params.value,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Trigger real-time update to connected clients
      await supabase.channel('event-updates')
        .send({
          type: 'broadcast',
          event: 'dashboard-update',
          payload: {
            event_id: params.event_id,
            metric: params.metric_type,
            value: params.value
          }
        });

      return {
        success: true,
        message: 'Dashboard updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
});
```

---

## 🚨 Error Handling & Retries

### **1. Robust Error Handling**

```typescript
// src/lib/agent-error-handling.ts
export class AgentErrorHandler {
  static async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          break;
        }

        // Exponential backoff
        await new Promise(resolve => 
          setTimeout(resolve, delay * Math.pow(2, attempt - 1))
        );
      }
    }

    throw new Error(`Operation failed after ${maxRetries} attempts: ${lastError.message}`);
  }

  static handleAgentError(error: any, context: string) {
    console.error(`Agent Error in ${context}:`, error);
    
    // Log to monitoring service
    // Send alert to operations team
    // Return user-friendly error message
    
    return {
      success: false,
      error: "Something went wrong. Please try again or contact support.",
      error_id: generateErrorId(),
      context
    };
  }
}
```

---

## 🔧 Performance Optimization

### **1. Prompt Caching for Repeated Operations**

```typescript
// src/lib/prompt-caching.ts
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export class PromptCache {
  private cache = new Map<string, any>();

  async cachedCompletion(
    prompt: string,
    options: any = {},
    cacheKey?: string
  ): Promise<any> {
    const key = cacheKey || this.generateCacheKey(prompt, options);
    
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    const completion = await openai.chat.completions.create({
      ...options,
      messages: [{ role: 'user', content: prompt }]
    });

    this.cache.set(key, completion);
    return completion;
  }

  private generateCacheKey(prompt: string, options: any): string {
    return btoa(JSON.stringify({ prompt, options }));
  }

  clearCache() {
    this.cache.clear();
  }
}
```

---

## 📝 Testing & Validation

### **1. Agent Testing Framework**

```typescript
// src/agents/tests/agent-testing.ts
import { Agent } from 'openai-agents';

export class AgentTester {
  static async testAgent(
    agent: Agent,
    testCases: Array<{
      input: string;
      expectedOutput: string;
      description: string;
    }>
  ) {
    const results = [];

    for (const testCase of testCases) {
      try {
        const response = await agent.run(testCase.input);
        const passed = response.includes(testCase.expectedOutput);
        
        results.push({
          description: testCase.description,
          passed,
          input: testCase.input,
          expected: testCase.expectedOutput,
          actual: response
        });
      } catch (error) {
        results.push({
          description: testCase.description,
          passed: false,
          error: error.message
        });
      }
    }

    return results;
  }
}

// Example test cases
const eventCreationTests = [
  {
    input: "Create a tech conference for 200 people in Toronto",
    expectedOutput: "Event created successfully",
    description: "Basic event creation"
  },
  {
    input: "Find venues for a wedding with 150 guests",
    expectedOutput: "venue",
    description: "Venue search functionality"
  }
];
```

---

These code snippets provide a solid foundation for implementing OpenAI Agents SDK in EventOS, covering all major functionality from event creation to real-time analytics and error handling.
