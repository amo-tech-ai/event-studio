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

## 11. Edge Function Development Workflow

### Supabase Edge Functions Architecture

**Edge Functions** are serverless Deno functions that run on Supabase infrastructure. They handle:
- Payment processing (Stripe integration)
- Webhook handling (payment confirmations)
- Email delivery (Resend integration)
- AI runtime (OpenAI SDK + CopilotKit integration)

**Location:** `supabase/functions/`

**Runtime:** Deno (TypeScript/JavaScript with secure-by-default permissions)

### Development Pipeline

#### 1. Local Development

**Start Local Supabase Stack:**
```bash
# Start local Supabase (includes Edge Functions runtime)
npx supabase start

# Verify services running
npx supabase status
# Edge Functions URL: http://localhost:54321/functions/v1
```

**Serve Function Locally:**
```bash
# Serve single function with hot reload
npx supabase functions serve function-name

# Serve with environment variables
npx supabase functions serve function-name --env-file .env.local

# Serve all functions
npx supabase functions serve
```

**Test with cURL:**
```bash
# Test locally
curl -X POST http://localhost:54321/functions/v1/function-name \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'

# Test with authentication
curl -X POST http://localhost:54321/functions/v1/function-name \
  -H "Authorization: Bearer ${USER_JWT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"userId": "123"}'
```

#### 2. Edge Function Structure Pattern

**Standard Edge Function Template:**
```typescript
// supabase/functions/function-name/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// CORS headers (required for browser requests)
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client with service role (bypasses RLS)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verify user authentication (optional, for protected endpoints)
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    // Parse and validate input
    const body = await req.json()
    // TODO: Add Zod validation here

    // Business logic
    const result = await processRequest(body, user.id)

    // Return success response
    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    // Error handling with logging
    console.error('Function error:', error)

    return new Response(
      JSON.stringify({
        error: error.message,
        code: error.code || 'INTERNAL_ERROR',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.status || 500,
      },
    )
  }
})

async function processRequest(data: any, userId: string) {
  // Implement business logic
  return { success: true, data }
}
```

#### 3. Deployment

**Deploy Single Function:**
```bash
# Deploy to remote Supabase project
npx supabase functions deploy function-name

# Deploy with specific project
npx supabase functions deploy function-name --project-ref YOUR_PROJECT_REF

# Deploy all functions
npx supabase functions deploy
```

**Verify Deployment:**
```bash
# List deployed functions
npx supabase functions list

# Test deployed function
curl -X POST https://YOUR_PROJECT_REF.supabase.co/functions/v1/function-name \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -d '{"test": "data"}'
```

#### 4. Environment Variables

**Configure Secrets in Supabase Dashboard:**
```bash
# Set secrets via CLI
npx supabase secrets set STRIPE_SECRET_KEY=sk_test_...
npx supabase secrets set RESEND_API_KEY=re_...
npx supabase secrets set OPENAI_API_KEY=sk-...

# List secrets (values are hidden)
npx supabase secrets list

# Unset a secret
npx supabase secrets unset SECRET_NAME
```

**Access in Edge Function:**
```typescript
const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
const resendKey = Deno.env.get('RESEND_API_KEY')
const openaiKey = Deno.env.get('OPENAI_API_KEY')
```

#### 5. Monitoring & Debugging

**View Logs:**
```bash
# Real-time logs
npx supabase functions logs function-name --tail

# Filter by severity
npx supabase functions logs function-name --level error

# Search logs
npx supabase functions logs function-name --grep "payment failed"

# View logs for specific time range
npx supabase functions logs function-name --since "2025-01-15 10:00:00"
```

**Add Structured Logging:**
```typescript
// Use console methods for different log levels
console.log('Info:', { userId, action: 'checkout' })
console.warn('Warning:', { issue: 'slow query' })
console.error('Error:', { error: error.message, userId })
```

### Testing Edge Functions

#### Unit Tests (Deno Test)

```typescript
// supabase/functions/function-name/test.ts
import { assertEquals } from "https://deno.land/std@0.168.0/testing/asserts.ts"
import { processRequest } from "./index.ts"

Deno.test("processes valid request", async () => {
  const result = await processRequest({
    amount: 5000,
    currency: "usd"
  }, "user-123")

  assertEquals(result.success, true)
  assertEquals(result.amount, 5000)
})

Deno.test("rejects invalid amount", async () => {
  try {
    await processRequest({ amount: -100 }, "user-123")
  } catch (error) {
    assertEquals(error.message, "Amount must be positive")
  }
})
```

**Run Tests:**
```bash
deno test supabase/functions/function-name/test.ts
```

#### Integration Tests (Stripe CLI, Webhooks)

**Test Stripe Webhooks:**
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe  # macOS
# Or download from https://stripe.com/docs/stripe-cli

# Login to Stripe
stripe login

# Forward webhooks to local function
stripe listen --forward-to http://localhost:54321/functions/v1/stripe-webhook

# Trigger test events
stripe trigger payment_intent.succeeded
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
```

**Verify Webhook Handling:**
```typescript
// Check logs for webhook processing
console.log('Webhook received:', event.type)
console.log('Payment status:', event.data.object.payment_status)
```

### Common Patterns

#### Payment Processing (Stripe)

```typescript
import Stripe from 'https://esm.sh/stripe@14.21.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2023-10-16',
})

// Create checkout session
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [{
    price_data: {
      currency: 'usd',
      product_data: { name: 'Event Ticket' },
      unit_amount: 5000, // $50.00
    },
    quantity: 2,
  }],
  mode: 'payment',
  success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${origin}/cancel`,
  metadata: {
    orderId: 'order-123',
    userId: 'user-456',
  },
})

return session.url // Redirect URL
```

#### Email Delivery (Resend)

```typescript
import { Resend } from 'https://esm.sh/resend@2.0.0'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

await resend.emails.send({
  from: 'EventOS <noreply@eventos.app>',
  to: customerEmail,
  subject: 'Your Event Tickets',
  html: `
    <h1>Your tickets are ready!</h1>
    <p>Event: ${eventName}</p>
    <p>Date: ${eventDate}</p>
    <p>Tickets: ${ticketCount}</p>
  `,
  attachments: [
    {
      filename: 'tickets.pdf',
      content: pdfBuffer,
    }
  ],
})
```

#### Webhook Signature Verification

```typescript
// Verify Stripe webhook signature
const signature = req.headers.get('stripe-signature')!
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

let event
try {
  event = stripe.webhooks.constructEvent(
    await req.text(),
    signature,
    webhookSecret
  )
} catch (err) {
  console.error('Webhook signature verification failed:', err.message)
  return new Response('Invalid signature', { status: 400 })
}

// Process verified event
if (event.type === 'checkout.session.completed') {
  const session = event.data.object
  await handleSuccessfulPayment(session)
}
```

### Error Handling Best Practices

```typescript
serve(async (req) => {
  try {
    // Validate input
    const schema = z.object({
      amount: z.number().positive(),
      currency: z.enum(['usd', 'cad']),
    })

    const body = await req.json()
    const validated = schema.parse(body) // Throws if invalid

    // Process with explicit error types
    const result = await processPayment(validated)

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    // Log for debugging
    console.error('Payment processing error:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    })

    // Return user-friendly error
    const status = error instanceof z.ZodError ? 400 : 500
    const message = error instanceof z.ZodError
      ? 'Invalid input: ' + error.errors.map(e => e.message).join(', ')
      : 'Payment processing failed. Please try again.'

    return new Response(
      JSON.stringify({
        error: message,
        code: error.code || 'INTERNAL_ERROR',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status,
      },
    )
  }
})
```

### Checklist Before Deploying Edge Function

- [ ] CORS headers configured for browser requests
- [ ] Authentication verified (if required)
- [ ] Input validation with Zod
- [ ] Error handling with user-friendly messages
- [ ] Logging for debugging (console.log, console.error)
- [ ] Environment variables set in Supabase dashboard
- [ ] Unit tests pass
- [ ] Integration tests pass (webhooks, API calls)
- [ ] Tested locally with `supabase functions serve`
- [ ] Tested deployed version with curl/Postman
- [ ] Logs reviewed for errors

---

## 12. Feature Module Architecture

### Frontend Module Organization

**Problem:** Scattered business logic makes code hard to maintain and test.

**Solution:** Organize features into self-contained modules with clear boundaries.

### Standard Module Structure

Every feature must follow this structure:

```
src/features/{feature-name}/
├── hooks/                  # Data fetching and mutations
│   ├── useFeatures.ts     # Fetch list
│   ├── useFeature.ts      # Fetch single
│   ├── useCreateFeature.ts # Create mutation
│   ├── useUpdateFeature.ts # Update mutation
│   └── useDeleteFeature.ts # Delete mutation
├── components/            # UI components
│   ├── FeatureCard.tsx   # Display component
│   ├── FeatureForm.tsx   # Form component
│   ├── FeatureList.tsx   # List component
│   └── FeatureDetail.tsx # Detail view
├── types/                 # TypeScript interfaces
│   └── feature.types.ts  # All type definitions
├── validations/           # Zod schemas
│   └── feature.schema.ts # Input validation
├── store/                 # Zustand state (optional)
│   └── featureStore.ts   # Client-side state
├── utils/                 # Helper functions (optional)
│   └── featureHelpers.ts # Pure functions
└── index.ts              # Public API exports
```

### Implementation Checklist

**For Each New Feature Module:**

1. **Planning Phase:**
   - [ ] Define database schema (if new tables needed)
   - [ ] Document user flows
   - [ ] Identify required API calls
   - [ ] List validation rules

2. **Implementation Phase:**
   - [ ] Create directory structure
   - [ ] Define TypeScript types in `types/`
   - [ ] Create Zod schemas in `validations/`
   - [ ] Implement data hooks in `hooks/`
   - [ ] Build UI components in `components/`
   - [ ] Export public API from `index.ts`

3. **Testing Phase:**
   - [ ] Write unit tests for hooks
   - [ ] Write unit tests for utilities
   - [ ] Write E2E tests for user flows
   - [ ] Test error handling
   - [ ] Test loading states

4. **Documentation Phase:**
   - [ ] Add JSDoc comments to complex functions
   - [ ] Document props for components
   - [ ] Update feature documentation

### Data Fetching Pattern (TanStack Query)

#### Fetch List

```typescript
// hooks/useEvents.ts
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { Event } from '../types/event.types'

export function useEvents(filters?: { status?: string; limit?: number }) {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: async () => {
      let query = supabase
        .from('events')
        .select('*')
        .order('start_time', { ascending: true })

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      if (filters?.limit) {
        query = query.limit(filters.limit)
      }

      const { data, error } = await query

      if (error) throw error
      return data as Event[]
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Usage in component
const EventList = () => {
  const { data: events, isLoading, error } = useEvents({ status: 'published' })

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />

  return (
    <div>
      {events?.map(event => <EventCard key={event.id} event={event} />)}
    </div>
  )
}
```

#### Fetch Single Item

```typescript
// hooks/useEvent.ts
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { Event } from '../types/event.types'

export function useEvent(id: string | undefined) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      if (!id) throw new Error('Event ID required')

      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          tickets (
            id,
            tier_id,
            price_cents,
            status
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data as Event
    },
    enabled: !!id, // Only run if ID exists
    staleTime: 5 * 60 * 1000,
  })
}
```

### Mutation Pattern (TanStack Query)

#### Create Mutation

```typescript
// hooks/useCreateEvent.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { eventSchema } from '../validations/event.schema'
import type { EventInput } from '../types/event.types'
import { toast } from 'sonner'

export function useCreateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: EventInput) => {
      // Validate input with Zod
      const validated = eventSchema.parse(input)

      // Create event
      const { data, error } = await supabase
        .from('events')
        .insert(validated)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      // Invalidate and refetch events list
      queryClient.invalidateQueries({ queryKey: ['events'] })

      // Optimistically add to cache
      queryClient.setQueryData(['event', data.id], data)

      // Show success message
      toast.success('Event created successfully')
    },
    onError: (error) => {
      // Show error message
      toast.error('Failed to create event: ' + error.message)
      console.error('Create event error:', error)
    },
  })
}

// Usage in component
const CreateEventForm = () => {
  const createEvent = useCreateEvent()

  const handleSubmit = (formData) => {
    createEvent.mutate(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={createEvent.isPending}>
        {createEvent.isPending ? 'Creating...' : 'Create Event'}
      </button>
    </form>
  )
}
```

#### Update Mutation

```typescript
// hooks/useUpdateEvent.ts
export function useUpdateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<EventInput> }) => {
      const validated = eventUpdateSchema.parse(updates)

      const { data, error } = await supabase
        .from('events')
        .update(validated)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: ['events'] })

      // Update single event cache
      queryClient.setQueryData(['event', data.id], data)

      toast.success('Event updated successfully')
    },
    onError: (error) => {
      toast.error('Failed to update event: ' + error.message)
    },
  })
}
```

### TypeScript Types Pattern

```typescript
// types/event.types.ts

// Database types (auto-generated from Supabase)
import type { Database } from '@/integrations/supabase/types'

export type Event = Database['public']['Tables']['events']['Row']
export type EventInsert = Database['public']['Tables']['events']['Insert']
export type EventUpdate = Database['public']['Tables']['events']['Update']

// Frontend-specific types
export interface EventWithTickets extends Event {
  tickets: Ticket[]
}

export interface EventFormData {
  name: string
  description: string
  start_time: string
  end_time: string
  venue_id?: string
  capacity: number
  type: EventType
}

export type EventType = 'conference' | 'seminar' | 'workshop' | 'networking' | 'corporate_meeting'

export type EventStatus = 'draft' | 'published' | 'cancelled'

// Input types for API calls
export type EventInput = Omit<EventInsert, 'id' | 'created_at' | 'updated_at'>
```

### Zod Validation Pattern

```typescript
// validations/event.schema.ts
import { z } from 'zod'

export const eventSchema = z.object({
  name: z.string()
    .min(5, 'Event name must be at least 5 characters')
    .max(100, 'Event name must be less than 100 characters'),

  description: z.string()
    .min(50, 'Description must be at least 50 characters')
    .max(500, 'Description must be less than 500 characters'),

  type: z.enum(['conference', 'seminar', 'workshop', 'networking', 'corporate_meeting']),

  start_time: z.string()
    .datetime()
    .refine(
      (date) => new Date(date) > new Date(),
      'Event must start in the future'
    ),

  end_time: z.string()
    .datetime(),

  capacity: z.number()
    .int()
    .min(10, 'Minimum capacity is 10')
    .max(10000, 'Maximum capacity is 10,000'),

  venue_id: z.string().uuid().optional(),

  organizer_id: z.string().uuid(),
}).refine(
  (data) => new Date(data.end_time) > new Date(data.start_time),
  {
    message: 'Event end time must be after start time',
    path: ['end_time'],
  }
)

export const eventUpdateSchema = eventSchema.partial()
```

### Component Pattern

```typescript
// components/EventForm.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { eventSchema } from '../validations/event.schema'
import type { EventFormData } from '../types/event.types'

interface EventFormProps {
  initialData?: EventFormData
  onSubmit: (data: EventFormData) => void
  isLoading?: boolean
}

export const EventForm = ({ initialData, onSubmit, isLoading }: EventFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialData,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name">Event Name</label>
        <input
          {...register('name')}
          id="name"
          className="w-full px-4 py-2 border rounded"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <textarea
          {...register('description')}
          id="description"
          rows={4}
          className="w-full px-4 py-2 border rounded"
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      {/* More fields... */}

      <button
        type="submit"
        disabled={isLoading}
        className="px-6 py-2 bg-primary text-white rounded hover:bg-primary/90"
      >
        {isLoading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}
```

### Public API Pattern

```typescript
// index.ts
// Export only what other modules need to consume

// Hooks
export { useEvents } from './hooks/useEvents'
export { useEvent } from './hooks/useEvent'
export { useCreateEvent } from './hooks/useCreateEvent'
export { useUpdateEvent } from './hooks/useUpdateEvent'
export { useDeleteEvent } from './hooks/useDeleteEvent'

// Components
export { EventCard } from './components/EventCard'
export { EventForm } from './components/EventForm'
export { EventList } from './components/EventList'
export { EventDetail } from './components/EventDetail'

// Types (only public-facing types)
export type {
  Event,
  EventInput,
  EventFormData,
  EventWithTickets,
  EventType,
  EventStatus,
} from './types/event.types'

// DO NOT export:
// - Internal utilities
// - Zod schemas (use in module only)
// - Store internals
```

### Usage in Pages

```typescript
// src/pages/Events.tsx
import { useEvents, useCreateEvent, EventList, EventForm } from '@/features/events'

const EventsPage = () => {
  const { data: events, isLoading } = useEvents({ status: 'published' })
  const createEvent = useCreateEvent()

  const handleCreateEvent = (data) => {
    createEvent.mutate(data)
  }

  return (
    <div>
      <h1>Events</h1>

      <EventForm
        onSubmit={handleCreateEvent}
        isLoading={createEvent.isPending}
      />

      <EventList events={events} isLoading={isLoading} />
    </div>
  )
}
```

---

## 13. Production Readiness Checklist

Use this comprehensive checklist before deploying to production. All items must be checked.

### Backend (Edge Functions)

- [ ] **All required edge functions deployed** (minimum 4):
  - [ ] `create-checkout-session` - Stripe payment processing
  - [ ] `stripe-webhook` - Payment confirmation handling
  - [ ] `send-tickets` - Email delivery via Resend
  - [ ] `copilotkit-runtime` - AI event wizard backend

- [ ] **Environment variables configured** in Supabase dashboard:
  - [ ] `STRIPE_SECRET_KEY`
  - [ ] `STRIPE_WEBHOOK_SECRET`
  - [ ] `RESEND_API_KEY`
  - [ ] `OPENAI_API_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY` (auto-provisioned)

- [ ] **CORS headers** configured correctly for browser requests
- [ ] **Authentication** validated on protected endpoints
- [ ] **Error handling** implemented with user-friendly messages
- [ ] **Logging** configured for debugging
- [ ] **Rate limiting** configured (if applicable)
- [ ] **Webhook signatures** verified (Stripe)
- [ ] **Integration tests** passing
- [ ] **Deployed versions tested** with curl/Postman

### Frontend (React App)

- [ ] **All feature modules implemented** (minimum 5):
  - [ ] Events module (create, read, update events)
  - [ ] Tickets module (purchase flow)
  - [ ] Orders module (order management)
  - [ ] Promo Codes module (discount logic)
  - [ ] CRM module (contact management)

- [ ] **Zero TypeScript errors** (`npm run build` succeeds)
- [ ] **Zero console errors** in production build
- [ ] **Bundle size optimized** (< 500KB gzipped)
- [ ] **Lazy loading** for routes implemented
- [ ] **Error boundaries** configured for all major sections
- [ ] **Loading states** for all async operations
- [ ] **Form validations** with Zod schemas
- [ ] **Accessibility audit** passed (WCAG 2.1 AA)
- [ ] **E2E tests** passing for critical user flows

### Database (Supabase)

- [ ] **All migrations applied** successfully
- [ ] **RLS policies enabled** on all tables
- [ ] **No overly permissive policies** (audit with `get_advisors`)
- [ ] **Indexes optimized** (remove unused, add critical)
- [ ] **Foreign keys configured** for referential integrity
- [ ] **Sample/test data removed** from production
- [ ] **Backup configured** (automatic daily backups)
- [ ] **Connection pooling** configured

### Security

- [ ] **Zero security warnings** from Supabase security advisors
- [ ] **All secrets in environment variables** (not hardcoded)
- [ ] **API keys rotated** (production keys separate from test)
- [ ] **HTTPS enforced** (no HTTP fallback)
- [ ] **CSP headers configured** (Content Security Policy)
- [ ] **XSS protection** enabled (React default, but verify)
- [ ] **CSRF protection** enabled (Supabase handles this)
- [ ] **SQL injection prevention** verified (parameterized queries only)
- [ ] **Penetration testing** completed (OWASP top 10)

### Performance

- [ ] **Zero performance warnings** from Supabase performance advisors
- [ ] **Unused indexes removed** (identified in audit)
- [ ] **Query performance optimized** (< 100ms average)
- [ ] **Frontend Lighthouse score** > 90 (Performance, Accessibility, Best Practices, SEO)
- [ ] **Images optimized** (WebP format, lazy loading, responsive sizes)
- [ ] **CDN configured** for static assets
- [ ] **Load testing completed** (1000+ concurrent users)
- [ ] **Database connection pooling** verified

### Monitoring

- [ ] **Error tracking configured** (Sentry or similar)
- [ ] **Analytics configured** (PostHog, Plausible, or similar)
- [ ] **Uptime monitoring configured** (pingdom, UptimeRobot, etc.)
- [ ] **Log aggregation configured** (Supabase logs + external if needed)
- [ ] **Alerts configured** for critical errors (email, Slack, etc.)
- [ ] **Performance monitoring** configured (response times, query times)

### Documentation

- [ ] **API documentation complete** (Edge Functions, endpoints)
- [ ] **User guide complete** (how to use the platform)
- [ ] **Deployment guide complete** (how to deploy updates)
- [ ] **Rollback procedure documented** (how to revert changes)
- [ ] **Incident response plan documented** (who to contact, what to do)

### Pre-Launch Testing

- [ ] **Smoke tests** for critical paths:
  - [ ] User registration → Email verification → Login
  - [ ] Create event → Publish event → View public page
  - [ ] Select tickets → Checkout → Payment → Email delivery
  - [ ] AI wizard → Create event → Save draft

- [ ] **Cross-browser testing** (Chrome, Safari, Firefox, Edge)
- [ ] **Mobile testing** (iOS Safari, Android Chrome)
- [ ] **Slow connection testing** (3G, throttled)
- [ ] **Offline behavior** verified (service worker, error messages)

### Launch Day

- [ ] **Production database backed up**
- [ ] **Rollback plan tested**
- [ ] **Monitoring dashboards open** (logs, errors, metrics)
- [ ] **Team on standby** for immediate bug fixes
- [ ] **Communication plan** ready (status page, social media)

### Post-Launch (First 24 Hours)

- [ ] **Monitor error rates** (target: < 1% of requests)
- [ ] **Monitor performance metrics** (target: 95% requests < 1s)
- [ ] **Monitor user feedback** (support channels, social media)
- [ ] **Fix critical bugs** within 4 hours
- [ ] **Document known issues** for non-critical bugs

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
