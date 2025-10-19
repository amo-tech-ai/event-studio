# 🛠️ Build with OpenAI & Claude SDK Guide for EventOS

**Project:** EventOS - AI-Powered Event Management  
**Analysis Date:** 2025-01-17  
**Scope:** Comprehensive integration guide for OpenAI and Claude SDKs

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

### **2. Claude SDK Integration**

```typescript
// src/lib/claude-agents.ts
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const claudeAgent = {
  async generateContent(prompt: string, context: any) {
    const response = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
      system: "You are an AI assistant for EventOS event management system."
    });
    return response.content[0].text;
  }
};
```

---

## 🎯 Model Selection Strategy

### **OpenAI Model Selection**

| Model | Use Case | Cost | Performance | Recommendation |
|-------|----------|------|-------------|----------------|
| **GPT-5 High** | Complex reasoning, multi-step planning | High | Excellent | For advanced event orchestration |
| **GPT-5 Mini** | High-volume tasks, simple responses | Low | Good | For basic automation and responses |
| **GPT-4o** | Balanced performance, general tasks | Medium | Excellent | For most event management tasks |
| **GPT-4o-mini** | Cost-effective, simple tasks | Low | Good | For basic queries and automation |

### **Claude Model Selection**

| Model | Use Case | Cost | Performance | Recommendation |
|-------|----------|------|-------------|----------------|
| **Claude Opus** | Complex reasoning, creative tasks | High | Excellent | For advanced content generation |
| **Claude Sonnet** | Balanced performance, general tasks | Medium | Excellent | For most event planning tasks |
| **Claude Haiku** | Fast responses, simple tasks | Low | Good | For quick queries and automation |

### **Model Selection Best Practices**

```typescript
// src/lib/model-selection.ts
export const selectModel = (task: string, complexity: 'low' | 'medium' | 'high') => {
  switch (complexity) {
    case 'low':
      return 'gpt-4o-mini'; // Cost-effective for simple tasks
    case 'medium':
      return 'gpt-4o'; // Balanced performance for general tasks
    case 'high':
      return 'gpt-5-high'; // Advanced reasoning for complex tasks
    default:
      return 'gpt-4o';
  }
};
```

---

## 🔧 Agent Patterns & Architecture

### **1. Multi-Agent Orchestration Pattern**

```typescript
// src/agents/orchestrator.ts
import { Agent } from 'openai-agents';

export class EventOrchestrator {
  private agents: Map<string, Agent> = new Map();

  constructor() {
    this.initializeAgents();
  }

  private initializeAgents() {
    this.agents.set('eventCreator', new Agent({
      name: "Event Creator",
      instructions: "Create and manage events with optimal configuration",
      model: "gpt-4o",
      tools: [createEventTool, updateEventTool]
    }));

    this.agents.set('venueMatcher', new Agent({
      name: "Venue Matcher",
      instructions: "Find and match venues based on event requirements",
      model: "gpt-4o",
      tools: [searchVenuesTool, checkAvailabilityTool]
    }));

    this.agents.set('marketingAgent', new Agent({
      name: "Marketing Agent",
      instructions: "Generate marketing content and manage campaigns",
      model: "gpt-4o",
      tools: [generateContentTool, deployCampaignTool]
    }));
  }

  async createEvent(userInput: string) {
    // Orchestrate multiple agents for complex workflows
    const requirements = await this.agents.get('eventCreator')!.run(
      `Parse event requirements: "${userInput}"`
    );

    const venues = await this.agents.get('venueMatcher')!.run(
      `Find venues for: ${JSON.stringify(requirements)}`
    );

    const event = await this.agents.get('eventCreator')!.run(
      `Create event with venue: ${venues.best_match}`
    );

    const marketing = await this.agents.get('marketingAgent')!.run(
      `Generate marketing for event: ${event.id}`
    );

    return { event, marketing };
  }
}
```

### **2. Function Calling Pattern**

```typescript
// src/agents/tools/event-tools.ts
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
      is_paid: { type: "boolean", description: "Whether event is paid" }
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

### **3. MCP (Model Context Protocol) Integration**

```typescript
// src/mcp/connectors.ts
import { MCPServer } from '@modelcontextprotocol/sdk';

export class EventOSMCPConnector {
  private server: MCPServer;

  constructor() {
    this.server = new MCPServer({
      name: "eventos-connector",
      version: "1.0.0"
    });
  }

  async connectToSupabase() {
    return this.server.addTool({
      name: "supabase_query",
      description: "Execute queries on EventOS database",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "SQL query to execute" },
          table: { type: "string", description: "Table name" }
        }
      },
      handler: async (params) => {
        // Execute Supabase query
        const { data, error } = await supabase
          .from(params.table)
          .select(params.query);
        
        return { data, error };
      }
    });
  }

  async connectToStripe() {
    return this.server.addTool({
      name: "stripe_payment",
      description: "Process payments through Stripe",
      parameters: {
        type: "object",
        properties: {
          amount: { type: "number", description: "Payment amount" },
          currency: { type: "string", description: "Currency code" },
          customer_email: { type: "string", description: "Customer email" }
        }
      },
      handler: async (params) => {
        // Process Stripe payment
        const paymentIntent = await stripe.paymentIntents.create({
          amount: params.amount * 100,
          currency: params.currency,
          customer_email: params.customer_email
        });
        
        return { payment_intent: paymentIntent };
      }
    });
  }
}
```

---

## 🔗 Integration Examples

### **1. Supabase Integration**

```typescript
// src/integrations/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export const supabaseTools = {
  async createEvent(eventData: any) {
    const { data, error } = await supabase
      .from('events')
      .insert(eventData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async searchVenues(criteria: any) {
    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .gte('capacity', criteria.minCapacity)
      .eq('city', criteria.location);
    
    if (error) throw error;
    return data;
  },

  async updateEventMetrics(eventId: string, metrics: any) {
    const { data, error } = await supabase
      .from('event_dashboards')
      .upsert({
        event_id: eventId,
        metrics: metrics,
        updated_at: new Date().toISOString()
      });
    
    if (error) throw error;
    return data;
  }
};
```

### **2. Stripe Integration**

```typescript
// src/integrations/stripe.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const stripeTools = {
  async createPaymentIntent(amount: number, currency: string, metadata: any) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: currency.toLowerCase(),
      metadata: metadata
    });
    
    return paymentIntent;
  },

  async handleWebhook(payload: string, signature: string) {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    
    switch (event.type) {
      case 'payment_intent.succeeded':
        return await this.handlePaymentSuccess(event.data.object);
      case 'payment_intent.payment_failed':
        return await this.handlePaymentFailure(event.data.object);
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  },

  async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    // Update order status in Supabase
    await supabase
      .from('orders')
      .update({ 
        payment_status: 'completed',
        paid_at: new Date().toISOString()
      })
      .eq('stripe_payment_intent_id', paymentIntent.id);
    
    // Trigger WhatsApp confirmation
    await this.sendWhatsAppConfirmation(paymentIntent);
  }
};
```

### **3. WhatsApp Integration**

```typescript
// src/integrations/whatsapp.ts
export const whatsappTools = {
  async sendMessage(phoneNumber: string, message: string) {
    const response = await fetch('https://graph.facebook.com/v18.0/YOUR_PHONE_NUMBER_ID/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'text',
        text: { body: message }
      })
    });

    return await response.json();
  },

  async sendTemplate(phoneNumber: string, templateName: string, parameters: string[]) {
    const response = await fetch('https://graph.facebook.com/v18.0/YOUR_PHONE_NUMBER_ID/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'template',
        template: {
          name: templateName,
          language: { code: 'en' },
          components: [{
            type: 'body',
            parameters: parameters.map(param => ({ type: 'text', text: param }))
          }]
        }
      })
    });

    return await response.json();
  }
};
```

---

## 📊 Best Practices

### **1. Prompt Caching**

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
}
```

### **2. Error Handling & Retries**

```typescript
// src/lib/error-handling.ts
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
    
    return {
      success: false,
      error: "Something went wrong. Please try again or contact support.",
      error_id: generateErrorId(),
      context
    };
  }
}
```

### **3. Real-time Streaming**

```typescript
// src/lib/streaming.ts
export class StreamingAgent {
  async streamEventCreation(userInput: string, onUpdate: (chunk: string) => void) {
    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an event creation assistant. Stream your response as you work." },
        { role: "user", content: userInput }
      ],
      stream: true
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        onUpdate(content);
      }
    }
  }

  async streamVenueSearch(criteria: any, onUpdate: (venues: any[]) => void) {
    // Simulate streaming venue search results
    const venues = await this.searchVenues(criteria);
    
    for (let i = 0; i < venues.length; i++) {
      onUpdate(venues.slice(0, i + 1));
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
}
```

---

## 🔍 Testing & Validation

### **1. Agent Testing Framework**

```typescript
// src/agents/tests/agent-testing.ts
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

### **2. Performance Monitoring**

```typescript
// src/monitoring/performance.ts
export class PerformanceMonitor {
  static async monitorAgentPerformance(agent: Agent, operation: string) {
    const startTime = Date.now();
    
    try {
      const result = await agent.run(operation);
      const duration = Date.now() - startTime;
      
      // Log performance metrics
      console.log(`Agent operation completed in ${duration}ms`);
      
      return {
        success: true,
        duration,
        result
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      
      console.error(`Agent operation failed after ${duration}ms:`, error);
      
      return {
        success: false,
        duration,
        error: error.message
      };
    }
  }
}
```

---

## 🚀 Deployment & Production

### **1. Environment Configuration**

```bash
# .env.production
OPENAI_API_KEY=your_production_openai_key
ANTHROPIC_API_KEY=your_production_claude_key
SUPABASE_URL=your_production_supabase_url
SUPABASE_ANON_KEY=your_production_supabase_key
STRIPE_SECRET_KEY=your_production_stripe_key
WHATSAPP_API_TOKEN=your_production_whatsapp_token
```

### **2. Production Optimizations**

```typescript
// src/config/production.ts
export const productionConfig = {
  openai: {
    model: "gpt-4o", // Use production model
    temperature: 0.7, // Balanced creativity
    maxTokens: 2000,
    timeout: 30000 // 30 second timeout
  },
  
  claude: {
    model: "claude-3-opus-20240229",
    maxTokens: 1000,
    timeout: 30000
  },
  
  caching: {
    enabled: true,
    ttl: 3600, // 1 hour cache
    maxSize: 1000 // Max 1000 cached items
  },
  
  retries: {
    maxRetries: 3,
    backoffMultiplier: 2,
    initialDelay: 1000
  }
};
```

---

## 📚 Key Resources

- **OpenAI Agents SDK:** [Official Documentation](https://platform.openai.com/docs/guides/agents)
- **Claude API:** [Anthropic Documentation](https://docs.anthropic.com/)
- **MCP Protocol:** [Model Context Protocol](https://github.com/modelcontextprotocol)
- **Function Calling:** [OpenAI Function Calling Guide](https://platform.openai.com/docs/guides/function-calling)
- **Supabase Integration:** [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- **Stripe Integration:** [Stripe Node.js SDK](https://stripe.com/docs/api/node)

---

This guide provides a comprehensive foundation for building EventOS with OpenAI and Claude SDKs, ensuring production-ready, scalable, and efficient AI-powered event management.
