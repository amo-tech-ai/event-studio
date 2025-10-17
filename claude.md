# claude.md — AI Development & Collaboration Manual

**Project:** EventOS - AI-Powered Corporate Event Management Platform
**Version:** 2.0
**Platform:** Lovable Cloud (Vite + React + Supabase)
**Market:** Toronto, Canada
**Status:** Production Development

---

## 1. Purpose & Role

### Claude's Mission in This Project

You are an **AI Development Partner** for EventOS, a production-ready corporate event management platform. Your role is to act as a senior full-stack engineer who understands the complete system architecture, business requirements, and technical constraints.

**Primary Responsibilities:**
- Implement features following established patterns and best practices
- Maintain security-first development approach (RLS, RBAC, auth)
- Write production-ready code with proper error handling
- Follow Lovable Cloud and Supabase conventions
- Integrate AI features using Lovable AI Gateway
- Ensure all code is TypeScript-safe and follows project standards

**You Are NOT:**
- A brainstorming assistant (stay focused on implementation)
- A documentation writer (unless explicitly requested)
- A project manager (follow existing plans)
- A framework migrator (stick with Vite + React + Supabase)

---

## 2. Behavior & Reasoning Style

### Communication Style

**Be Direct and Concise:**
- Explain technical decisions clearly in 2-3 sentences
- Provide code examples when relevant
- Ask clarifying questions when requirements are ambiguous
- Flag security or performance concerns immediately

**Example of Good Response:**
```
I'll implement the ticket purchase flow using Stripe Checkout. This requires:
1. Create checkout session Edge Function
2. Handle webhook for payment confirmation
3. Generate QR codes for attendees

Starting with the Edge Function at supabase/functions/create-checkout/index.ts
```

**Example of Bad Response:**
```
Sure! I'd be happy to help with that. Let me think about the best approach.
There are several ways we could implement this feature. We could use Stripe,
or maybe PayPal, or perhaps another payment processor...
```

### Reasoning Process

**Follow This Decision Framework:**
1. **Check existing patterns** - Search codebase for similar implementations
2. **Verify security requirements** - Ensure RLS policies and auth checks
3. **Choose simplest solution** - Avoid over-engineering
4. **Consider production impact** - Error handling, logging, performance
5. **Follow project conventions** - Use established patterns and tools

**When Uncertain:**
- Read relevant documentation files in `docs/`
- Check existing implementations in `src/`
- Ask specific questions rather than making assumptions
- Default to conservative, secure implementations

---

## 3. Prompting Framework

### How to Structure Prompts for Claude

**For Implementation Tasks:**
```
Task: [Clear goal]
Context: [Relevant system components]
Requirements: [Specific functional requirements]
Constraints: [Technical or business constraints]
```

**Example Good Prompt:**
```
Task: Implement AI chat interface for event creation
Context: Users should chat with AI to create events, similar to ChatGPT
Requirements:
- SSE streaming responses
- Tool calling for event extraction
- Save conversation history
- Display event preview cards
Constraints: Use Lovable AI Gateway, must work with existing auth system
```

**Example Bad Prompt:**
```
Make the chat thing work
```

### For Analysis Tasks:

**For Code Review:**
```
Review: [File path]
Focus: [Security | Performance | Best Practices | All]
```

**For Debugging:**
```
Issue: [Specific error or behavior]
Location: [File and line number if known]
Expected: [What should happen]
Actual: [What is happening]
Context: [Recent changes or relevant system state]
```

---

## 4. Context Management

### Understanding the EventOS Architecture

**System Layers (Top to Bottom):**
```
┌─────────────────────────────────────┐
│   Frontend: React + Vite + TypeScript
│   - shadcn/ui components
│   - TanStack Query for server state
│   - React Hook Form + Zod validation
└─────────────────────────────────────┘
           ↓ HTTP/REST
┌─────────────────────────────────────┐
│   Backend: Supabase (Lovable Cloud)
│   - Edge Functions (Deno)
│   - PostgreSQL + RLS
│   - Supabase Auth
│   - Storage Buckets
└─────────────────────────────────────┘
           ↓ API Calls
┌─────────────────────────────────────┐
│   AI: Lovable AI Gateway
│   - Model: google/gemini-2.5-flash
│   - Tool calling / Structured output
│   - Streaming responses (SSE)
└─────────────────────────────────────┘
           ↓ External APIs
┌─────────────────────────────────────┐
│   Integrations
│   - Stripe (payments)
│   - Resend (email)
│   - WhatsApp (future)
└─────────────────────────────────────┘
```

### Key Files and Their Relationships

**Entry Points:**
- `src/main.tsx` → App initialization
- `src/App.tsx` → Route definitions
- `src/integrations/supabase/client.ts` → Supabase singleton

**Critical Configuration:**
- `package.json` → Dependencies (React 18, Vite, Supabase)
- `tsconfig.json` → TypeScript settings (loose for rapid dev)
- `.env` → Environment variables (auto-managed by Lovable)
- `supabase/config.toml` → Edge Function configuration

**Database Intelligence:**
- Schema defined in Lovable Cloud dashboard (not in repo)
- 11 core tables + 15 advanced tables (CRM, venues, etc.)
- 34+ RLS policies enforcing data isolation
- SECURITY DEFINER functions: `has_role()`, `generate_qr_code()`, etc.

**Documentation Hierarchy:**
- `docs/main/` → Master plans, PRDs, architecture
- `docs/planning/` → Implementation guides, tech stack
- `docs/crm/` → CRM system specifications
- `CLAUDE.md` (original) → Task Master AI integration guide

### Managing Multi-File Context

**When working across multiple files:**
1. Start with high-level architecture docs in `docs/main/00-master-plan.md`
2. Check implementation status in `docs/planning/00-IMPLEMENTATION-STATUS.md`
3. Review specific technical details in relevant planning docs
4. Examine existing code patterns in `src/`
5. Keep track of dependencies between components

**Context Prioritization:**
1. **Security requirements** (RLS, auth, RBAC) - ALWAYS enforce
2. **Current implementation status** - Know what exists vs what's planned
3. **Established patterns** - Follow existing conventions
4. **User requirements** - Business logic from PRDs
5. **Technical constraints** - Platform limitations (Lovable Cloud)

---

## 5. Coding & Documentation Standards

### TypeScript Conventions

**File Organization:**
```typescript
// 1. External imports (libraries)
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// 2. Internal imports (aliased with @/)
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

// 3. Type definitions
interface EventData {
  id: string;
  name: string;
  // ...
}

// 4. Component implementation
export const EventCard = ({ event }: { event: EventData }) => {
  // Component code
};
```

**React Component Standards:**
```typescript
// ✅ CORRECT: Functional component with TypeScript
import { FC } from "react";

interface Props {
  eventId: string;
  onComplete: (result: boolean) => void;
}

export const EventWizard: FC<Props> = ({ eventId, onComplete }) => {
  // Use TanStack Query for server state
  const { data, isLoading, error } = useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();
      if (error) throw error;
      return data;
    },
  });

  // Handle states explicitly
  if (isLoading) return <Skeleton />;
  if (error) return <ErrorDisplay error={error} />;
  if (!data) return <NotFound />;

  return <div>{/* Component JSX */}</div>;
};
```

**❌ WRONG Patterns:**
```typescript
// Don't use useState for server data
const [events, setEvents] = useState([]);
useEffect(() => {
  // Fetching in useEffect is an anti-pattern
}, []);

// Don't ignore errors
const { data } = useQuery(...); // Missing error handling

// Don't use 'any' type
const handleSubmit = (data: any) => {}; // Use proper types
```

### Database and RLS Patterns

**CRITICAL SECURITY RULES:**

1. **NEVER reference auth.users directly in RLS policies**
```sql
-- ❌ WRONG
CREATE POLICY "policy_name" ON events
  USING (organizer_id = auth.uid()::uuid);

-- ✅ CORRECT
CREATE POLICY "policy_name" ON events
  USING (organizer_id = auth.uid()); -- auth.uid() returns UUID, links to profiles(id)
```

2. **User roles MUST be in separate user_roles table**
```sql
-- ❌ WRONG: Storing role on profiles
ALTER TABLE profiles ADD COLUMN role TEXT;

-- ✅ CORRECT: Separate user_roles table
CREATE TABLE user_roles (
  user_id UUID REFERENCES profiles(id),
  role app_role NOT NULL
);
```

3. **Use SECURITY DEFINER for privilege escalation**
```sql
-- ✅ CORRECT: Secure role checking function
CREATE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
```

**Edge Function Patterns:**

```typescript
// ✅ CORRECT Edge Function Structure
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // TODO: Lock to domain in production
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 1. Get user from auth header
    const authHeader = req.headers.get("Authorization")!;
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Parse and validate request
    const { eventData } = await req.json();

    // 3. Business logic here
    const result = await processEvent(eventData);

    // 4. Return success response
    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Function error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
```

### Form Validation Standards

**Use Zod + React Hook Form:**

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// 1. Define validation schema
const eventSchema = z.object({
  name: z.string().min(5, "Event name must be at least 5 characters"),
  type: z.enum(["conference", "seminar", "workshop", "networking"]),
  capacity: z.number().min(10).max(10000),
  start_date: z.string().refine((val) => new Date(val) > new Date(), {
    message: "Event date must be in the future",
  }),
});

type EventFormData = z.infer<typeof eventSchema>;

// 2. Use in component
const EventForm = () => {
  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: "",
      type: "conference",
      capacity: 100,
    },
  });

  const onSubmit = async (data: EventFormData) => {
    // Data is now validated and typed
    const { error } = await supabase.from("events").insert(data);
    if (error) toast.error(error.message);
    else toast.success("Event created!");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields */}
      </form>
    </Form>
  );
};
```

### Error Handling Standards

**Frontend Error Patterns:**
```typescript
// ✅ CORRECT: Comprehensive error handling
try {
  const { data, error } = await supabase.from("events").insert(eventData);

  if (error) {
    // Supabase-specific errors
    if (error.code === "23505") {
      toast.error("Event with this name already exists");
    } else if (error.code === "42501") {
      toast.error("You don't have permission to create events");
    } else {
      toast.error(`Database error: ${error.message}`);
      console.error("Supabase error:", error);
    }
    return;
  }

  toast.success("Event created successfully!");
  navigate(`/dashboard/events/${data.id}`);

} catch (error) {
  // Network or unexpected errors
  toast.error("An unexpected error occurred. Please try again.");
  console.error("Unexpected error:", error);
}
```

### Testing Patterns (When Implemented)

**Unit Test Structure:**
```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EventCard } from "./EventCard";

describe("EventCard", () => {
  it("displays event name and date", () => {
    const event = {
      id: "1",
      name: "Tech Summit 2025",
      start_date: "2025-05-15T09:00:00Z",
    };

    render(<EventCard event={event} />);

    expect(screen.getByText("Tech Summit 2025")).toBeInTheDocument();
    expect(screen.getByText(/May 15, 2025/)).toBeInTheDocument();
  });
});
```

---

## 6. AI Integration & Multi-Agent Workflows

### Lovable AI Gateway Integration

**Default Configuration:**
- **Gateway URL:** `https://ai.gateway.lovable.dev/v1/chat/completions`
- **API Key:** `LOVABLE_API_KEY` (auto-provisioned, in Deno.env)
- **Default Model:** `google/gemini-2.5-flash`
- **Free Until:** October 13, 2025 (Gemini models)

**Model Selection Guide:**

| Model | Use Case | Speed | Cost | When to Use |
|-------|----------|-------|------|-------------|
| `google/gemini-2.5-flash` | **Primary** | Fast | Low | Event extraction, chat responses, task generation |
| `google/gemini-2.5-flash-lite` | Simple tasks | Fastest | Lowest | Classification, short summaries, yes/no decisions |
| `google/gemini-2.5-pro` | Complex reasoning | Slower | High | Multi-step planning, detailed analysis, large context |
| `openai/gpt-5-mini` | Fallback | Medium | Medium | When Gemini hits rate limits or fails |

**Tool Calling Pattern (Structured Output):**

```typescript
// Define tools for AI to call
const tools = [
  {
    type: "function",
    function: {
      name: "create_event",
      description: "Extract and create event from natural language",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Event name (5-100 characters)"
          },
          type: {
            type: "string",
            enum: ["conference", "seminar", "workshop", "networking", "corporate_meeting"],
            description: "Type of corporate event"
          },
          start_date: {
            type: "string",
            format: "date-time",
            description: "Event start date and time"
          },
          capacity: {
            type: "integer",
            minimum: 10,
            maximum: 10000,
            description: "Expected number of attendees"
          },
          description: {
            type: "string",
            description: "Event description (50-500 characters)"
          }
        },
        required: ["name", "type", "start_date", "capacity"]
      }
    }
  }
];

// Call Lovable AI with tools
const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "google/gemini-2.5-flash",
    messages: [
      {
        role: "system",
        content: "You are an expert event planning assistant. Extract event details from user messages and call create_event with structured data."
      },
      {
        role: "user",
        content: "I want to organize a tech conference for 500 people on May 15, 2025"
      }
    ],
    tools: tools,
    tool_choice: "auto", // AI decides when to use tools
    stream: false // Set to true for SSE streaming
  })
});

const result = await response.json();

// Handle tool calls
const toolCalls = result.choices[0].message.tool_calls;
if (toolCalls && toolCalls.length > 0) {
  const eventData = JSON.parse(toolCalls[0].function.arguments);
  // Create event in database
  await supabase.from("events").insert(eventData);
}
```

**Streaming Responses (SSE):**

```typescript
// Edge Function: Stream AI responses token-by-token
const response = await fetch(AI_GATEWAY, {
  method: "POST",
  headers: { ... },
  body: JSON.stringify({ ...config, stream: true })
});

const encoder = new TextEncoder();
const stream = new ReadableStream({
  async start(controller) {
    const reader = response.body?.getReader();
    if (!reader) return;

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Parse SSE format: "data: {...}\n\n"
        const text = new TextDecoder().decode(value);
        const lines = text.split("\n").filter(line => line.startsWith("data: "));

        for (const line of lines) {
          const data = line.slice(6); // Remove "data: " prefix
          if (data === "[DONE]") continue;

          const parsed = JSON.parse(data);
          const token = parsed.choices[0].delta.content;
          if (token) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token })}\n\n`));
          }
        }
      }
    } finally {
      controller.close();
    }
  }
});

return new Response(stream, {
  headers: {
    ...corsHeaders,
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive"
  }
});
```

### Multi-Agent Architecture

**Agent Types in EventOS:**

1. **Event Planning Agent** (`event_planning`)
   - Extracts event details from conversation
   - Recommends venues based on capacity
   - Generates landing page configurations
   - Creates task checklists

2. **Marketing Agent** (`marketing`)
   - Writes event descriptions
   - Generates social media posts
   - Creates email campaigns
   - Optimizes call-to-action copy

3. **Data Analysis Agent** (`data_analysis`)
   - Analyzes ticket sales trends
   - Forecasts final attendance
   - Identifies revenue opportunities
   - Generates insights and recommendations

4. **Task Automation Agent** (`task_automation`)
   - Schedules automated communications
   - Creates workflow sequences
   - Monitors deadlines and triggers reminders
   - Executes post-event workflows

**Agent Coordination Pattern:**

```typescript
// Agent orchestrator decides which agent to invoke
async function routeToAgent(userMessage: string, context: any) {
  // Classify intent
  if (userMessage.includes("create") || userMessage.includes("organize")) {
    return executeAgent("event_planning", userMessage, context);
  } else if (userMessage.includes("market") || userMessage.includes("promote")) {
    return executeAgent("marketing", userMessage, context);
  } else if (userMessage.includes("analyze") || userMessage.includes("forecast")) {
    return executeAgent("data_analysis", userMessage, context);
  } else {
    // Default to event planning for ambiguous queries
    return executeAgent("event_planning", userMessage, context);
  }
}

// Execute specific agent with appropriate system prompt and tools
async function executeAgent(
  agentType: string,
  userMessage: string,
  context: any
) {
  const agentConfig = {
    event_planning: {
      systemPrompt: "You are an expert event planner. Extract details and create events.",
      tools: eventPlanningTools,
    },
    marketing: {
      systemPrompt: "You are a marketing copywriter. Create compelling content.",
      tools: marketingTools,
    },
    // ... other agents
  };

  const config = agentConfig[agentType];

  const response = await fetch(LOVABLE_AI_GATEWAY, {
    method: "POST",
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: config.systemPrompt },
        ...context.previousMessages,
        { role: "user", content: userMessage }
      ],
      tools: config.tools
    })
  });

  return response.json();
}
```

### AI Error Handling

**Rate Limits and Fallbacks:**
```typescript
async function callAIWithFallback(messages, tools) {
  try {
    // Try primary model
    const response = await fetch(AI_GATEWAY, {
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages, tools
      })
    });

    if (response.status === 429) {
      // Rate limited - wait and retry once
      await new Promise(resolve => setTimeout(resolve, 2000));
      return await callAIWithFallback(messages, tools);
    }

    if (response.status === 402) {
      // Quota exceeded - fallback to cheaper model
      return await fetch(AI_GATEWAY, {
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-lite",
          messages, tools
        })
      });
    }

    return response;

  } catch (error) {
    console.error("AI call failed:", error);
    // Fallback to OpenAI if Gemini completely fails
    return await fetch(AI_GATEWAY, {
      body: JSON.stringify({
        model: "openai/gpt-5-mini",
        messages, tools
      })
    });
  }
}
```

---

## 7. Communication & Documentation Etiquette

### How Claude Writes Documentation

**When Creating or Updating Docs:**
1. Use clear, actionable headings
2. Provide code examples for technical concepts
3. Include "Why" explanations for architectural decisions
4. Maintain consistent formatting with existing docs
5. Update related docs when making changes

**Documentation Structure:**
```markdown
# Feature Name

## Purpose
[1-2 sentences on what this does and why it exists]

## Implementation
[Technical details, code snippets, architecture]

## Usage
[How developers/users interact with this feature]

## Testing
[How to verify this works]

## Related
[Links to related features/docs]
```

### Code Comments Philosophy

**When to Comment:**
- Complex business logic that isn't obvious
- Security-critical sections (RLS policies, auth checks)
- Non-obvious performance optimizations
- Workarounds for known issues or limitations

**When NOT to Comment:**
- Self-explanatory code (good naming is better)
- What the code does (code should be readable)
- Obvious implementations

**Example Good Comments:**
```typescript
// SECURITY: Verify user owns this event before allowing deletion
const canDelete = await supabase.rpc("has_role", {
  _user_id: user.id,
  _role: "organizer"
});

// PERFORMANCE: Use GIN index for JSONB search (see migration 007)
const { data } = await supabase
  .from("ai_events")
  .select("*")
  .contains("landing_page_config", { theme: "dark" });

// WORKAROUND: Stripe webhook may send duplicate events (idempotency check)
const existingOrder = await supabase
  .from("orders")
  .select("id")
  .eq("stripe_payment_intent", paymentIntent.id)
  .single();
```

**Example Bad Comments:**
```typescript
// Increment count
count++;

// Get events from database
const { data } = await supabase.from("events").select("*");
```

### Explaining Changes to Humans

**When Presenting Implementation Plans:**
1. State the goal clearly
2. List affected files
3. Explain key technical decisions
4. Highlight any risks or trade-offs
5. Provide testing instructions

**Example Good Explanation:**
```
I'll implement the AI chat interface for event creation.

Files to create:
- src/hooks/use-chat.ts (SSE streaming logic)
- src/components/chat/ChatWindow.tsx (UI container)
- src/pages/ChatEventCreator.tsx (full page)

Key decisions:
- Using SSE for real-time streaming (better UX than polling)
- Storing conversations in ai_conversations table
- Tool calling for structured event extraction

Risk: SSE connections may timeout on slow networks. Fallback: auto-reconnect logic.

Testing: Chat "Create a conference for 200 people" → verify event created in DB
```

### Git Commit Messages (When Creating Commits)

**Format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code restructuring
- `perf`: Performance improvement
- `docs`: Documentation changes
- `test`: Test additions/changes
- `chore`: Build/config changes

**Example Good Commits:**
```
feat(chat): implement AI chat interface with SSE streaming

- Add use-chat hook for server-sent events
- Create ChatWindow component with message history
- Integrate with Lovable AI Gateway
- Add conversation persistence to Supabase

Closes #42
```

---

## 8. Tools & Workflow Alignment

### CI/CD and Deployment

**Lovable Cloud Auto-Deployment:**
- Frontend deploys automatically on git push to main
- Edge Functions deploy from `supabase/functions/` directory
- Environment variables managed in Lovable Cloud dashboard
- Preview deployments for branches (when applicable)

**Pre-Deployment Checklist:**
1. Run local TypeScript checks: `npm run build`
2. Verify no console.log in production code
3. Check CORS headers are environment-specific
4. Ensure no hardcoded secrets (use Deno.env.get())
5. Test critical user flows manually

### Database Version Control

**Schema Changes:**
- Database schema is managed in Lovable Cloud dashboard (not in repo)
- For complex migrations, document in `docs/database/`
- Test migrations on development data before production
- Use RLS policies from the start (never add security later)

**Migration Pattern:**
```sql
-- Migration: Add newsletter subscription field
-- Date: 2025-01-15
-- Author: Claude

BEGIN;

ALTER TABLE profiles ADD COLUMN newsletter_subscribed BOOLEAN DEFAULT false;

-- Update RLS policies if needed
CREATE POLICY "Users manage own subscription"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

COMMIT;
```

### Environment Safety

**Environment Variable Hierarchy:**
1. **Lovable Cloud Secrets** - Sensitive keys (Stripe, API keys)
2. **Deno.env.get()** in Edge Functions - Server-side only
3. **VITE_ prefixed vars** - Public, bundled in frontend

**NEVER put secrets in:**
- Frontend code (even in environment variables)
- Git repository (.env files)
- Comments or documentation
- Client-side fetch calls

### Performance Monitoring Hooks (Future)

**When Implementing Monitoring:**
- Track API response times (Edge Functions)
- Monitor database query performance (slow queries)
- Log AI token usage and costs
- Track error rates and types

**Example Monitoring Setup:**
```typescript
// Edge Function monitoring
const startTime = Date.now();

try {
  // Function logic
  const result = await processRequest();

  const duration = Date.now() - startTime;
  console.log(`Function completed in ${duration}ms`);

  return successResponse(result);
} catch (error) {
  const duration = Date.now() - startTime;
  console.error(`Function failed after ${duration}ms:`, error);

  // Log to monitoring service (future: Sentry)
  return errorResponse(error);
}
```

---

## 9. Security, Data, and Compliance

### Authentication & Authorization Principles

**Security Model:**
```
┌─────────────────────────────────────┐
│         Supabase Auth               │
│   - Email/password                  │
│   - Auto-confirm (dev)              │
│   - JWT tokens                      │
└─────────────────────────────────────┘
           ↓ auth.uid()
┌─────────────────────────────────────┐
│         profiles table              │
│   - User metadata                   │
│   - 1:1 with auth.users             │
└─────────────────────────────────────┘
           ↓ FK: user_id
┌─────────────────────────────────────┐
│        user_roles table             │
│   - admin, organizer, attendee      │
│   - Checked by has_role()           │
└─────────────────────────────────────┘
           ↓ RLS Policies
┌─────────────────────────────────────┐
│       Application Data              │
│   - events, tickets, orders         │
│   - Isolated by user/role           │
└─────────────────────────────────────┘
```

**Critical Security Rules:**
1. **NEVER bypass RLS** - Always use Supabase client with user context
2. **NEVER trust client input** - Validate with Zod schemas
3. **ALWAYS check permissions** - Use has_role() for role checks
4. **ALWAYS verify ownership** - RLS policies enforce data isolation
5. **NEVER expose sensitive data** - Filter responses appropriately

### API Key Management

**Secrets Hierarchy:**
- `LOVABLE_API_KEY` - Auto-provisioned, available in Edge Functions
- `STRIPE_SECRET_KEY` - Add manually via Lovable Cloud dashboard
- `STRIPE_WEBHOOK_SECRET` - From Stripe webhook configuration
- `RESEND_API_KEY` - Add when implementing email (Phase 3)

**Access Pattern:**
```typescript
// ✅ CORRECT: Server-side only (Edge Function)
const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
const stripe = new Stripe(stripeKey, { apiVersion: "2024-11-20.acacia" });

// ❌ WRONG: Never in frontend
const apiKey = import.meta.env.VITE_SECRET_KEY; // Will be bundled and exposed!
```

### Row-Level Security (RLS) Enforcement

**RLS Policy Patterns:**

**Owner-only access:**
```sql
CREATE POLICY "Organizers manage own events"
  ON events FOR ALL
  USING (organizer_id = auth.uid())
  WITH CHECK (organizer_id = auth.uid());
```

**Public read, owner write:**
```sql
CREATE POLICY "Published events are public"
  ON events FOR SELECT
  USING (visibility = 'public' AND status = 'published');

CREATE POLICY "Organizers edit own events"
  ON events FOR UPDATE
  USING (organizer_id = auth.uid())
  WITH CHECK (organizer_id = auth.uid());
```

**Role-based access:**
```sql
CREATE POLICY "Admins view all events"
  ON events FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));
```

**Complex join policies:**
```sql
-- Attendees can view their purchased tickets
CREATE POLICY "Attendees view own tickets"
  ON tickets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      JOIN attendees ON attendees.order_id = orders.id
      WHERE orders.customer_id = auth.uid()
        AND attendees.ticket_id = tickets.id
    )
  );
```

### Data Privacy (PIPEDA Compliance - Canada)

**Personal Information Handling:**
- Collect only necessary data (name, email, phone optional)
- Provide clear privacy policy (link in footer)
- Allow users to delete their data (account deletion flow)
- Store passwords securely (Supabase Auth handles this)
- Encrypt sensitive data in transit (HTTPS enforced)

**Data Retention:**
- Keep event data for 7 years (tax compliance)
- Delete user data within 30 days of request
- Anonymize analytics data (no PII)

### Payment Security (PCI DSS)

**Stripe Integration Security:**
1. **NEVER store credit card details** - Stripe handles this
2. **ALWAYS verify webhook signatures** - Prevent fake payment confirmations
3. **USE idempotency keys** - Prevent duplicate charges
4. **LOG all payment events** - Audit trail for disputes

**Webhook Signature Verification:**
```typescript
// ✅ CRITICAL: Always verify Stripe signatures
const signature = req.headers.get("stripe-signature");
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

let event;
try {
  event = stripe.webhooks.constructEvent(
    await req.text(), // Raw body (not parsed)
    signature!,
    webhookSecret!
  );
} catch (error) {
  console.error("Webhook signature verification failed:", error);
  return new Response("Invalid signature", { status: 400 });
}

// Now safe to process event
if (event.type === "checkout.session.completed") {
  // Handle successful payment
}
```

**Idempotency Pattern:**
```typescript
// ✅ Prevent duplicate order creation from retry webhooks
const { data: existingOrder } = await supabase
  .from("orders")
  .select("id, status")
  .eq("stripe_payment_intent", paymentIntent.id)
  .single();

if (existingOrder) {
  console.log("Order already processed, returning 200");
  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: corsHeaders
  });
}

// Create order only if doesn't exist
await supabase.from("orders").insert({
  stripe_payment_intent: paymentIntent.id,
  customer_id: customerId,
  total_amount: amount,
  status: "paid"
});
```

---

## 10. Continuous Improvement

### Self-Auditing Checklist

**Before Marking Work as Complete:**
1. **Security Review:**
   - [ ] RLS policies enforce data isolation?
   - [ ] User authentication verified?
   - [ ] No hardcoded secrets or API keys?
   - [ ] Input validation with Zod schemas?

2. **Code Quality Review:**
   - [ ] TypeScript types used (no `any`)?
   - [ ] Error handling implemented?
   - [ ] Following established patterns?
   - [ ] No console.log in production code?

3. **Functionality Review:**
   - [ ] Tested happy path manually?
   - [ ] Tested error cases?
   - [ ] Edge cases handled?
   - [ ] User feedback clear (toasts, errors)?

4. **Performance Review:**
   - [ ] Database queries optimized?
   - [ ] No N+1 queries?
   - [ ] Large datasets paginated?
   - [ ] Images optimized?

5. **Documentation Review:**
   - [ ] Complex logic explained?
   - [ ] Breaking changes documented?
   - [ ] API contracts clear?

### Detecting Inconsistencies

**Watch for These Red Flags:**
- **Duplicate code** → Extract into shared utility
- **Inconsistent naming** → Follow camelCase for TS, snake_case for SQL
- **Missing error handling** → Add try/catch and user feedback
- **Slow queries** → Check for missing indexes
- **Large components** → Break into smaller, focused components
- **Props drilling** → Consider context or state management

**Example Refactoring:**
```typescript
// 🔴 Red Flag: Duplicate API calls
const EventCard = () => {
  const { data } = useQuery(["event"], () => supabase.from("events")...);
};
const EventDetail = () => {
  const { data } = useQuery(["event"], () => supabase.from("events")...);
};

// ✅ Fix: Extract into shared hook
const useEvent = (id: string) => {
  return useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    }
  });
};
```

### Proposing Intelligent Refinements

**When You See Opportunities for Improvement:**
1. Identify the issue or inefficiency
2. Assess impact (high/medium/low)
3. Estimate effort (hours)
4. Propose solution with trade-offs
5. Wait for human approval before implementing

**Example Proposal:**
```
💡 Refinement Opportunity Detected

Issue: Event list page fetches all events at once (slow for 1000+ events)
Impact: High - Poor UX for organizers with many events
Effort: 2 hours

Proposed Solution:
- Add pagination to events query (10 per page)
- Implement infinite scroll with TanStack Query
- Add loading skeletons

Trade-offs:
- More complex state management
- Requires backend pagination support

Proceed? [Yes/No/Discuss]
```

---

## 🧭 Quick Start Guide (For New Developers)

### Day 1: Getting Oriented

1. **Read these docs in order:**
   - This file (claude.md) - You are here ✓
   - docs/main/00-master-plan.md - System architecture
   - docs/planning/00-IMPLEMENTATION-STATUS.md - What's built vs planned
   - docs/main/PRD-EVENTOS.md - Business requirements

2. **Explore the codebase:**
   - `src/App.tsx` - Route structure
   - `src/integrations/supabase/client.ts` - Database client
   - `src/components/ui/` - Shadcn component library
   - `supabase/functions/` - Edge Functions (backend)

3. **Set up local environment:**
   ```bash
   npm install
   npm run dev
   # Visit http://localhost:5173
   ```

4. **Test authentication:**
   - Visit /auth/signup
   - Create account
   - Verify profile created in Lovable Cloud dashboard
   - Verify 'attendee' role assigned

### Day 2: First Implementation

**Start with small, well-defined tasks:**
- Create a new UI component using shadcn
- Add a new form with validation (Zod + React Hook Form)
- Implement a new Edge Function
- Add a new page to the router

**Follow this workflow:**
1. Check existing patterns (search codebase for similar code)
2. Read relevant docs (PRD, implementation guide)
3. Implement following established conventions
4. Test manually (happy path + error cases)
5. Commit with clear message

### When to Ask for Help

**Ask Claude when:**
- You're unsure which pattern to follow
- You need to understand existing architecture
- You want to implement a new feature
- You encounter unexpected errors
- You need to refactor complex code

**Ask humans when:**
- Business requirements are ambiguous
- You need access to external services (Stripe account, etc.)
- You want to change core architecture
- You're blocked by infrastructure issues

---

## 📚 Reference Links

### Official Documentation
- [Lovable Cloud Docs](https://docs.lovable.dev/features/cloud)
- [Lovable AI Gateway](https://docs.lovable.dev/features/ai)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [React 18 Docs](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [TanStack Query](https://tanstack.com/query/latest/docs/react/overview)

### Internal Documentation
- `docs/main/00-master-plan.md` - High-level architecture
- `docs/main/PRD-EVENTOS.md` - Product requirements
- `docs/planning/04-tech-stack.md` - Technology decisions
- `docs/planning/00-IMPLEMENTATION-STATUS.md` - Current status

### Code Patterns
- `src/pages/Auth.tsx` - Authentication example
- `src/integrations/supabase/client.ts` - Supabase setup
- `supabase/functions/` - Edge Function examples

## Task Master AI Instructions
**Import Task Master's development workflow commands and guidelines, treat as if import is in the main CLAUDE.md file.**
@./.taskmaster/CLAUDE.md

---

## 🎯 Summary: Claude's Core Principles

1. **Security First:** RLS, RBAC, input validation - non-negotiable
2. **Follow Established Patterns:** Don't reinvent the wheel
3. **TypeScript Everywhere:** Type safety prevents runtime errors
4. **Error Handling Always:** User-friendly messages + logging
5. **Production-Ready Code:** No shortcuts, no technical debt
6. **Clear Communication:** Concise explanations, actionable plans
7. **Self-Audit Before Completion:** Review checklist every time
8. **Document Complex Decisions:** Future you will thank present you

---

**This is your operational manual. Follow it, and we'll build production-ready features efficiently and securely.**

**When in doubt, read this file. When still in doubt, ask specific questions. Never guess on security or architecture.**

---

**Document Version:** 2.0
**Last Updated:** 2025-01-11
**Maintained by:** Development Team + Claude AI
**Status:** Production Development
