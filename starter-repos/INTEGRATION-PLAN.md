# EventOS Integration Plan

**Date**: 2025-10-23
**Purpose**: Integrate starter repositories into EventOS
**Primary Starter**: saas-dynamic-dashboards
**Reference**: a2a-travel-demo-app (multi-agent patterns)

---

## ✅ Repositories Cloned

### 1. saas-dynamic-dashboards ⭐ (BASE)
**Location**: `/home/sk/event-studio/starter-repos/saas-dynamic-dashboards/`

**Structure**:
```
saas-dynamic-dashboards/
├── frontend/              # Next.js app
│   ├── app/              # App router pages
│   ├── components/       # UI components + shadcn/ui
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utilities
│   └── public/           # Static assets
├── agent/                # Python LangGraph agent
│   ├── agent.py          # Main agent file
│   ├── pyproject.toml    # Poetry dependencies
│   └── README.md
└── README.md
```

**Tech Stack**:
- Frontend: Next.js 14+, TypeScript, pnpm, Tailwind CSS
- Agent: Python, Poetry, LangGraph, OpenAI
- UI: CopilotKit integration, shadcn/ui components

**Setup**:
```bash
# Frontend
cd frontend
pnpm install
echo "OPENAI_API_KEY=sk-..." > .env
pnpm run dev  # Port 3000

# Agent
cd agent
poetry install
echo "OPENAI_API_KEY=sk-..." > .env
python agent.py
```

---

### 2. a2a-travel-demo-app ⭐ (REFERENCE)
**Location**: `/home/sk/event-studio/starter-repos/a2a-travel-demo-app/`

**Structure**:
```
a2a-travel-demo-app/
├── app/                  # Next.js app router
│   ├── api/copilotkit/  # A2A middleware
│   └── page.tsx         # Main UI
├── components/
│   ├── a2a/             # A2A message components
│   ├── forms/           # Trip requirements form
│   ├── hitl/            # Human-in-the-loop components
│   └── travel-chat.tsx  # Chat orchestration
├── agents/               # Python multi-agent system
│   ├── orchestrator.py   # Port 9000
│   ├── itinerary_agent.py    # Port 9001 (LangGraph)
│   ├── budget_agent.py       # Port 9002 (ADK/Gemini)
│   ├── restaurant_agent.py   # Port 9003 (LangGraph)
│   ├── weather_agent.py      # Port 9005 (ADK/Gemini)
│   └── requirements.txt
└── README.md
```

**Tech Stack**:
- Frontend: Next.js, CopilotKit, AG-UI Protocol, Tailwind CSS
- Agents: Python, LangGraph (OpenAI), Google ADK (Gemini), FastAPI
- Protocols: A2A (agent-to-agent), AG-UI (agent-UI)

**Setup**:
```bash
# Install dependencies
npm install
cd agents && python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# Configure
cp .env.example .env
# Add GOOGLE_API_KEY and OPENAI_API_KEY

# Run all services
npm run dev  # Starts UI + 5 agents on ports 3000, 9000-9005
```

**Agent System**:
```
Orchestrator (9000)
├── Itinerary Agent (9001) - LangGraph + OpenAI
├── Budget Agent (9002) - ADK + Gemini
├── Restaurant Agent (9003) - LangGraph + OpenAI
└── Weather Agent (9005) - ADK + Gemini
```

---

## 🎯 Integration Strategy

### Phase 1: Base Setup (Week 1)

#### Step 1.1: Clone saas-dynamic-dashboards as Base
```bash
# Create new EventOS v2 directory
mkdir -p /home/sk/event-studio-v2
cd /home/sk/event-studio-v2

# Copy saas-dynamic-dashboards structure
cp -r /home/sk/event-studio/starter-repos/saas-dynamic-dashboards/* ./

# Rename directories for clarity
mv frontend ui
mv agent ai-agent

# Initialize git
git init
git add .
git commit -m "Initial commit: saas-dynamic-dashboards base"
```

#### Step 1.2: Integrate Existing EventOS Components
```bash
# Copy Supabase configuration
cp /home/sk/event-studio/src/integrations/supabase/* ./ui/src/integrations/supabase/

# Copy environment variables
cp /home/sk/event-studio/.env.local ./ui/.env.local
# Add: OPENAI_API_KEY, GOOGLE_API_KEY

# Copy existing hooks
cp /home/sk/event-studio/src/hooks/* ./ui/src/hooks/

# Copy existing components (shadcn/ui)
cp -r /home/sk/event-studio/src/components/ui ./ui/src/components/ui
```

#### Step 1.3: Test Base Setup
```bash
# Test frontend
cd ui
pnpm install
pnpm run dev  # Should start on port 3000

# Test Supabase connection
# Navigate to http://localhost:3000
# Check database queries work

# Test AI agent
cd ../ai-agent
poetry install
python agent.py  # Should start LangGraph agent
```

**Success Criteria**:
- ✅ Frontend runs without errors
- ✅ Supabase connection works
- ✅ CopilotKit sidebar appears
- ✅ AI agent responds to test queries

---

### Phase 2: UI Migration (Week 2-3)

#### Step 2.1: Replace Dashboard Pages
```bash
# Keep dashboard shell from saas-dynamic-dashboards
# Replace content with EventOS pages

# Copy our existing pages
cp /home/sk/event-studio/src/pages/Dashboard.tsx ./ui/app/dashboard/page.tsx
cp /home/sk/event-studio/src/pages/DashboardEvents.tsx ./ui/app/dashboard/events/page.tsx
cp /home/sk/event-studio/src/pages/DashboardBookings.tsx ./ui/app/dashboard/bookings/page.tsx
# ... repeat for all pages
```

#### Step 2.2: Integrate TanStack Query
```typescript
// ui/lib/query-client.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      cacheTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

// ui/app/layout.tsx
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'

export default function RootLayout({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

#### Step 2.3: Convert Pages to App Router
```typescript
// Example: ui/app/dashboard/events/page.tsx
import { useEvents } from '@/hooks/useEvents'
import { EventsList } from '@/components/EventsList'

export default function EventsPage() {
  const { data: events, isLoading } = useEvents({ status: 'published' })

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Events</h1>
      <EventsList events={events} loading={isLoading} />
    </div>
  )
}
```

**Success Criteria**:
- ✅ All EventOS pages converted to App Router
- ✅ TanStack Query integrated
- ✅ Supabase hooks working
- ✅ All shadcn/ui components styled correctly

---

### Phase 3: Multi-Agent System (Week 3-4)

#### Step 3.1: Study a2a-travel-demo-app Patterns
```bash
# Reference files to study:
/home/sk/event-studio/starter-repos/a2a-travel-demo-app/agents/orchestrator.py
/home/sk/event-studio/starter-repos/a2a-travel-demo-app/agents/itinerary_agent.py
/home/sk/event-studio/starter-repos/a2a-travel-demo-app/app/api/copilotkit/route.ts
/home/sk/event-studio/starter-repos/a2a-travel-demo-app/components/a2a/
```

#### Step 3.2: Create EventOS Agent Structure
```bash
# Create agent directory structure
mkdir -p ai-agent/agents
cd ai-agent/agents

# Create EventOS-specific agents
touch orchestrator.py
touch event_planner_agent.py    # Port 9001
touch budget_agent.py            # Port 9002
touch venue_finder_agent.py      # Port 9003
touch sponsor_matcher_agent.py   # Port 9004
touch speaker_curator_agent.py   # Port 9005
```

#### Step 3.3: Implement Orchestrator (Port 9000)
```python
# ai-agent/agents/orchestrator.py
from fastapi import FastAPI
from langchain_core.messages import HumanMessage
from langgraph.graph import StateGraph

# Agent state
class AgentState(TypedDict):
    event_requirements: dict
    itinerary: dict
    budget: dict
    venue: dict
    sponsors: list
    speakers: list

# Orchestrator workflow
workflow = StateGraph(AgentState)

# Add nodes
workflow.add_node("collect_requirements", collect_requirements_node)
workflow.add_node("plan_event", plan_event_node)
workflow.add_node("find_venue", find_venue_node)
workflow.add_node("estimate_budget", estimate_budget_node)
workflow.add_node("match_sponsors", match_sponsors_node)
workflow.add_node("curate_speakers", curate_speakers_node)

# Add edges (workflow)
workflow.add_edge("collect_requirements", "plan_event")
workflow.add_edge("plan_event", "find_venue")
workflow.add_edge("find_venue", "estimate_budget")
workflow.add_edge("estimate_budget", "match_sponsors")
workflow.add_edge("match_sponsors", "curate_speakers")

# Compile
app = workflow.compile()

# FastAPI server
api = FastAPI()

@api.post("/invoke")
async def invoke_agent(request: dict):
    result = await app.ainvoke(request["state"])
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(api, host="0.0.0.0", port=9000)
```

#### Step 3.4: Implement Event Planner Agent (Port 9001)
```python
# ai-agent/agents/event_planner_agent.py
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph

# Agent using LangGraph + OpenAI
llm = ChatOpenAI(model="gpt-4")

def create_itinerary(state):
    """Creates detailed event itinerary"""
    requirements = state["event_requirements"]

    prompt = f"""
    Create a detailed event itinerary for:
    - Event Type: {requirements['type']}
    - Duration: {requirements['days']} days
    - Attendees: {requirements['attendees']} people
    - Theme: {requirements['theme']}

    Provide:
    1. Day-by-day schedule
    2. Key sessions/activities
    3. Break times
    4. Networking opportunities
    """

    response = llm.invoke(prompt)
    return {"itinerary": response.content}

# FastAPI server on port 9001
# ... (similar to orchestrator)
```

#### Step 3.5: Implement Budget Agent (Port 9002)
```python
# ai-agent/agents/budget_agent.py
import google.generativeai as genai

# Agent using Google ADK + Gemini
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel('gemini-pro')

def estimate_budget(state):
    """Estimates event budget"""
    requirements = state["event_requirements"]
    itinerary = state["itinerary"]
    venue = state["venue"]

    prompt = f"""
    Estimate budget for event:
    - Venue: {venue['name']} (${venue['price']}/day)
    - Attendees: {requirements['attendees']}
    - Duration: {requirements['days']} days
    - Catering: {requirements['catering_level']}

    Provide breakdown:
    1. Venue costs
    2. Catering costs
    3. Equipment costs
    4. Marketing costs
    5. Total estimated budget
    """

    response = model.generate_content(prompt)
    return {"budget": response.text}

# FastAPI server on port 9002
# ... (similar to orchestrator)
```

#### Step 3.6: Integrate A2A Protocol
```typescript
// ui/app/api/copilotkit/route.ts
import {
  CopilotRuntime,
  OpenAIAdapter,
  A2AMiddleware
} from "@copilotkit/runtime";

export const POST = async (req: Request) => {
  const { handleRequest } = copilotRuntime({
    actions: [],
    langserve: [
      {
        chainUrl: "http://localhost:9000/invoke", // Orchestrator
        name: "event_orchestrator",
        description: "Orchestrates event planning agents"
      },
      {
        chainUrl: "http://localhost:9001/invoke", // Event Planner
        name: "event_planner",
        description: "Creates event itineraries"
      },
      {
        chainUrl: "http://localhost:9002/invoke", // Budget Agent
        name: "budget_estimator",
        description: "Estimates event budgets"
      },
      // ... other agents
    ]
  });

  return handleRequest(req);
};
```

**Success Criteria**:
- ✅ Orchestrator coordinates all agents
- ✅ All 5 agents running on ports 9001-9005
- ✅ A2A protocol routes messages correctly
- ✅ UI displays agent communications
- ✅ Human-in-the-loop approvals working

---

### Phase 4: AI Wizard Integration (Week 4-5)

#### Step 4.1: Replace CopilotKit Sidebar with AI Wizard
```typescript
// ui/components/ai-wizard.tsx
"use client"

import { useCopilotChat, useCopilotAction } from "@copilotkit/react-core"
import { CopilotSidebar } from "@copilotkit/react-ui"

export function AIWizard() {
  const { messages, sendMessage } = useCopilotChat()

  // Define action for event creation
  useCopilotAction({
    name: "create_event_with_ai",
    description: "Create a new event using AI-powered planning",
    parameters: [
      {
        name: "event_requirements",
        type: "object",
        description: "Event requirements collected from user",
        required: true
      }
    ],
    handler: async ({ event_requirements }) => {
      // Call orchestrator
      const response = await fetch("/api/copilotkit", {
        method: "POST",
        body: JSON.stringify({
          action: "invoke_orchestrator",
          state: { event_requirements }
        })
      })

      return await response.json()
    }
  })

  return (
    <CopilotSidebar
      title="AI Event Wizard"
      instructions="Help users plan events by asking about their requirements and coordinating with specialized agents"
      defaultOpen={true}
      clickOutsideToClose={false}
    >
      {/* Custom wizard UI */}
      <div className="space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="message">
            {msg.content}
          </div>
        ))}
      </div>
    </CopilotSidebar>
  )
}
```

#### Step 4.2: Add Agent Message Visualization
```typescript
// ui/components/agent-messages.tsx
import { MessageFromA2A, MessageToA2A } from './a2a'

export function AgentMessages({ messages }) {
  return (
    <div className="agent-messages-container">
      {messages.map((msg) => (
        msg.direction === 'from_agent' ? (
          <MessageFromA2A
            key={msg.id}
            agentName={msg.agent}
            content={msg.content}
            timestamp={msg.timestamp}
          />
        ) : (
          <MessageToA2A
            key={msg.id}
            content={msg.content}
            timestamp={msg.timestamp}
          />
        )
      ))}
    </div>
  )
}
```

**Success Criteria**:
- ✅ AI Wizard replaces simple sidebar
- ✅ Conversational event creation working
- ✅ Agent messages visible in UI
- ✅ Human-in-the-loop approvals integrated
- ✅ Event created in database after wizard completes

---

### Phase 5: Testing & Polish (Week 5-6)

#### Step 5.1: E2E Testing with Playwright MCP
```typescript
// tests/e2e/ai-wizard.test.ts
test('AI Wizard creates event end-to-end', async () => {
  // Navigate to dashboard
  await mcp__playwright__browser_navigate({
    url: 'http://localhost:3000/dashboard'
  })

  // Open AI Wizard
  await mcp__playwright__browser_click({
    element: 'AI Wizard button',
    ref: 'button-ai-wizard'
  })

  // Send message to AI
  await mcp__playwright__browser_type({
    element: 'AI chat input',
    ref: 'input-ai-chat',
    text: 'Create a 2-day tech conference for 500 people',
    submit: true
  })

  // Wait for orchestrator response
  await mcp__playwright__browser_wait_for({
    text: 'I can help you plan that event'
  })

  // Verify agents are called
  // ... more test steps

  // Verify event created in database
  await mcp__playwright__browser_wait_for({
    text: 'Event created successfully'
  })
})
```

#### Step 5.2: Performance Testing
```typescript
// tests/performance/api-latency.test.ts
test('Agent response times < 2s', async () => {
  const start = Date.now()

  // Call orchestrator
  const response = await fetch('http://localhost:9000/invoke', {
    method: 'POST',
    body: JSON.stringify({
      state: { event_requirements: {...} }
    })
  })

  const duration = Date.now() - start

  expect(duration).toBeLessThan(2000) // 2 seconds
  expect(response.status).toBe(200)
})
```

#### Step 5.3: Security Audit
- [ ] RLS policies tested for all tables
- [ ] API keys not exposed in frontend
- [ ] CORS configured correctly
- [ ] Rate limiting on agent endpoints
- [ ] Input validation on all user inputs

**Success Criteria**:
- ✅ All E2E tests pass
- ✅ Performance requirements met
- ✅ Security audit passed
- ✅ No critical bugs
- ✅ Documentation complete

---

### Phase 6: Deployment (Week 6)

#### Step 6.1: Frontend Deployment (Vercel)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd ui
vercel deploy --prod

# Set environment variables in Vercel dashboard:
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_ANON_KEY
# - OPENAI_API_KEY
# - GOOGLE_API_KEY
```

#### Step 6.2: Agent Deployment (Railway/Render)
```bash
# Deploy Python agents to Railway
railway login
railway init
railway up

# Or use Render
# Create render.yaml:
services:
  - type: web
    name: event-orchestrator
    env: python
    buildCommand: "pip install -r requirements.txt"
    startCommand: "python agents/orchestrator.py"
    envVars:
      - key: OPENAI_API_KEY
        sync: false
      - key: GOOGLE_API_KEY
        sync: false
```

#### Step 6.3: Configure Production URLs
```typescript
// ui/.env.production
NEXT_PUBLIC_AGENT_ORCHESTRATOR_URL=https://event-orchestrator.railway.app
NEXT_PUBLIC_AGENT_PLANNER_URL=https://event-planner.railway.app
NEXT_PUBLIC_AGENT_BUDGET_URL=https://budget-estimator.railway.app
NEXT_PUBLIC_AGENT_VENUE_URL=https://venue-finder.railway.app
NEXT_PUBLIC_AGENT_SPONSOR_URL=https://sponsor-matcher.railway.app
NEXT_PUBLIC_AGENT_SPEAKER_URL=https://speaker-curator.railway.app
```

**Success Criteria**:
- ✅ Frontend deployed to Vercel
- ✅ Agents deployed to Railway/Render
- ✅ All agents accessible via public URLs
- ✅ Production environment variables configured
- ✅ SSL certificates configured
- ✅ Monitoring and logging set up

---

## 🔑 Key Differences from EventOS v1

### Architecture Changes

| Aspect | EventOS v1 | EventOS v2 (Integrated) |
|--------|-----------|------------------------|
| **Frontend** | Next.js (Pages Router) | Next.js (App Router) |
| **Package Manager** | npm | pnpm |
| **AI Integration** | None | CopilotKit + LangGraph |
| **Agent System** | None | Multi-agent (5 agents) |
| **State Management** | React Context | TanStack Query + LangGraph |
| **Database** | Supabase (same) | Supabase (same) |
| **UI Components** | shadcn/ui (same) | shadcn/ui (enhanced) |

### New Features

✅ **AI-Powered Event Creation**:
- Conversational interface
- Multi-agent orchestration
- Intelligent recommendations

✅ **Advanced Agent System**:
- Event Planner (itinerary creation)
- Budget Estimator (cost calculation)
- Venue Finder (location search with Google Maps)
- Sponsor Matcher (sponsor recommendations)
- Speaker Curator (speaker suggestions)

✅ **Human-in-the-Loop**:
- Budget approval workflow
- Event plan review
- Real-time agent message visualization

✅ **Modern Architecture**:
- App Router (Next.js 14+)
- Server Components
- Improved performance

---

## 📊 File Migration Checklist

### From event-studio (v1) → event-studio-v2

#### Database & API
- [ ] `/src/integrations/supabase/` → `/ui/src/integrations/supabase/`
- [ ] `/src/hooks/useEvents.ts` → `/ui/src/hooks/useEvents.ts`
- [ ] `/src/hooks/useDashboardStats.ts` → `/ui/src/hooks/useDashboardStats.ts`
- [ ] All database hooks → `/ui/src/hooks/`

#### Components
- [ ] `/src/components/ui/` → `/ui/src/components/ui/` (shadcn/ui)
- [ ] `/src/components/EventCard.tsx` → `/ui/src/components/EventCard.tsx`
- [ ] `/src/components/Dashboard*` → `/ui/app/dashboard/components/`
- [ ] All reusable components → `/ui/src/components/`

#### Pages (Convert to App Router)
- [ ] `/src/pages/Dashboard.tsx` → `/ui/app/dashboard/page.tsx`
- [ ] `/src/pages/DashboardEvents.tsx` → `/ui/app/dashboard/events/page.tsx`
- [ ] `/src/pages/DashboardBookings.tsx` → `/ui/app/dashboard/bookings/page.tsx`
- [ ] `/src/pages/DashboardFinancials.tsx` → `/ui/app/dashboard/financials/page.tsx`
- [ ] All pages → `/ui/app/**/page.tsx`

#### Configuration
- [ ] `.env.local` → `/ui/.env.local` (add OPENAI_API_KEY, GOOGLE_API_KEY)
- [ ] `tailwind.config.js` → `/ui/tailwind.config.ts`
- [ ] `tsconfig.json` → `/ui/tsconfig.json`

#### New Files (Agent System)
- [ ] Create `/ai-agent/agents/orchestrator.py`
- [ ] Create `/ai-agent/agents/event_planner_agent.py`
- [ ] Create `/ai-agent/agents/budget_agent.py`
- [ ] Create `/ai-agent/agents/venue_finder_agent.py`
- [ ] Create `/ai-agent/agents/sponsor_matcher_agent.py`
- [ ] Create `/ai-agent/agents/speaker_curator_agent.py`
- [ ] Create `/ai-agent/requirements.txt`
- [ ] Create `/ui/app/api/copilotkit/route.ts` (A2A middleware)
- [ ] Create `/ui/components/ai-wizard.tsx`
- [ ] Create `/ui/components/agent-messages.tsx`

---

## 💰 Cost Estimation

### API Costs (Monthly)
- **OpenAI GPT-4**: $50-200 (based on usage)
- **Google Gemini**: $0-50 (ADK free tier)
- **CopilotKit**: $0-99 (free tier → pro)
- **Google Maps API**: $0-50 (pay as you go)
- **Supabase**: $25 (existing)
- **Vercel**: $0-20 (hobby → pro)
- **Railway**: $5-50 (agent hosting)

**Total**: $155-$494/month

### Development Cost (Time)
- **Phase 1**: 40 hours (1 week)
- **Phase 2**: 80 hours (2 weeks)
- **Phase 3**: 80 hours (2 weeks)
- **Phase 4**: 40 hours (1 week)
- **Phase 5**: 40 hours (1 week)
- **Phase 6**: 20 hours (3 days)

**Total**: 300 hours (~7-8 weeks)

---

## 🚨 Risks & Mitigation

### High Risk

🔴 **Multi-agent complexity**:
- **Risk**: Hard to debug, unpredictable behavior
- **Mitigation**: Start with single agent, add gradually, extensive logging

🔴 **State synchronization**:
- **Risk**: Frontend, agent, and database state mismatches
- **Mitigation**: Use TanStack Query for cache, LangGraph for agent state, single source of truth

### Medium Risk

🟡 **CopilotKit learning curve**:
- **Risk**: New framework, limited documentation
- **Mitigation**: Follow examples closely, start simple, reference community

🟡 **Agent deployment**:
- **Risk**: Python agents need separate hosting
- **Mitigation**: Use Railway/Render, have fallback to local agent

### Low Risk

🟢 **Frontend migration**:
- **Risk**: Pages Router → App Router
- **Mitigation**: Incremental migration, test each page

---

## ✅ Success Criteria

### Technical
- [ ] All EventOS v1 features working in v2
- [ ] AI Wizard creates events successfully
- [ ] All 5 agents responding correctly
- [ ] Frontend-agent communication working
- [ ] Database integration complete
- [ ] Tests passing (unit, integration, E2E)
- [ ] Performance: API < 200ms, agents < 2s response

### User Experience
- [ ] AI Wizard is intuitive
- [ ] Agent messages are visible and understandable
- [ ] Loading states clear
- [ ] Error handling graceful
- [ ] Mobile responsive

### Business
- [ ] Feature parity with v1
- [ ] New AI features working
- [ ] Production deployment successful
- [ ] Cost within budget
- [ ] Documentation complete

---

## 📚 Resources

### Documentation
- [CopilotKit Docs](https://docs.copilotkit.ai)
- [LangGraph Docs](https://langchain-ai.github.io/langgraph/)
- [Google ADK Docs](https://google.github.io/adk-docs/)
- [A2A Protocol](https://github.com/agent-matrix/a2a)
- [AG-UI Protocol](https://docs.ag-ui.com)

### Reference Code
- **Primary Starter**: `/home/sk/event-studio/starter-repos/saas-dynamic-dashboards/`
- **Multi-Agent Reference**: `/home/sk/event-studio/starter-repos/a2a-travel-demo-app/`
- **Original EventOS**: `/home/sk/event-studio/`

---

**Status**: ✅ Ready to Begin
**Next Step**: Start Phase 1 - Clone saas-dynamic-dashboards as base
**Estimated Completion**: 7-8 weeks from start
