# Technical Concepts Reference

**Date**: 2025-10-23
**Purpose**: Glossary of technical concepts, frameworks, and patterns encountered during repository analysis
**Audience**: Developers working on EventOS v2

---

## Quick Index

### AI & ML Concepts
- [RAG (Retrieval-Augmented Generation)](#rag-retrieval-augmented-generation)
- [Vector Embeddings](#vector-embeddings)
- [Semantic Search](#semantic-search)
- [HITL (Human-in-the-Loop)](#hitl-human-in-the-loop)

### Protocols & Communication
- [A2A Protocol](#a2a-protocol)
- [AG-UI Protocol](#ag-ui-protocol)
- [SSE (Server-Sent Events)](#sse-server-sent-events)
- [WebSockets](#websockets)

### AI Frameworks
- [LangGraph](#langgraph)
- [LangChain](#langchain)
- [Google ADK](#google-adk)
- [crewAI](#crewai)
- [CopilotKit](#copilotkit)

### Architecture Patterns
- [Multi-Agent Orchestration](#multi-agent-orchestration)
- [Layer-Based Sequencing](#layer-based-sequencing)
- [Progressive Disclosure](#progressive-disclosure)
- [Shift-Left Testing](#shift-left-testing)

### Frontend Technologies
- [Next.js App Router](#nextjs-app-router)
- [TanStack Query](#tanstack-query)
- [shadcn/ui](#shadcnui)
- [Tailwind CSS](#tailwind-css)

### Backend Technologies
- [FastAPI](#fastapi)
- [Poetry](#poetry)
- [pnpm](#pnpm)
- [UV Package Manager](#uv-package-manager)

### Database & Storage
- [MongoDB Vector Store](#mongodb-vector-store)
- [Supabase](#supabase)
- [PostgreSQL RLS](#postgresql-rls)

### Testing
- [MCP Testing](#mcp-testing)
- [Playwright MCP](#playwright-mcp)
- [Chrome DevTools MCP](#chrome-devtools-mcp)
- [E2E Testing](#e2e-testing)

---

## AI & ML Concepts

### RAG (Retrieval-Augmented Generation)

**Definition**: AI technique that combines retrieval from a knowledge base with generative AI to produce more accurate, grounded responses.

**How It Works**:
1. User query converted to vector embedding
2. Semantic search against vector database
3. Retrieved documents added to LLM context
4. LLM generates response using retrieved knowledge

**EventOS Use Cases**:
- **Sponsor Matching**: "Find tech sponsors for AI conference"
  - Retrieves sponsors from database with AI/tech focus
  - LLM recommends best matches with reasoning
- **Venue Search**: "Conference centers near downtown with 500+ capacity"
  - Retrieves venue listings semantically
  - LLM provides natural language recommendations
- **Speaker Curation**: "Experts in blockchain and finance"
  - Searches speaker database by topic
  - LLM suggests relevant speakers with bios

**Example from ecommerce-rag-agent**:
```python
# 1. Convert query to embedding
query_embedding = model.encode("tech sponsors for AI")

# 2. Search MongoDB vector store
results = collection.aggregate([
    {
        "$vectorSearch": {
            "queryVector": query_embedding,
            "path": "embedding",
            "numCandidates": 100,
            "limit": 10
        }
    }
])

# 3. Pass results to LLM
context = "\n".join([doc["description"] for doc in results])
response = llm.invoke(f"Context: {context}\n\nQuery: {query}")
```

**Why Important**: EventOS needs semantic search, not just keyword matching. RAG enables natural language queries over structured data.

---

### Vector Embeddings

**Definition**: Numerical representations of text (or other data) as high-dimensional vectors, where semantically similar items are close together in vector space.

**How It Works**:
```python
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')

# Convert text to 384-dimensional vector
text = "AI conference in San Francisco"
embedding = model.encode(text)
# Returns: [0.02, -0.15, 0.33, ..., 0.08]  # 384 numbers
```

**Similarity Calculation**:
```python
from sklearn.metrics.pairwise import cosine_similarity

query = "AI conference"
doc1 = "Machine learning summit"
doc2 = "Cooking workshop"

query_emb = model.encode(query)
doc1_emb = model.encode(doc1)
doc2_emb = model.encode(doc2)

similarity_1 = cosine_similarity([query_emb], [doc1_emb])  # 0.85 (high)
similarity_2 = cosine_similarity([query_emb], [doc2_emb])  # 0.12 (low)
```

**EventOS Application**:
- Sponsor profiles → embeddings → semantic matching
- Event descriptions → embeddings → similar events
- Speaker bios → embeddings → expertise matching

**Common Models**:
- `all-MiniLM-L6-v2` - Fast, 384 dimensions
- `text-embedding-ada-002` - OpenAI, 1536 dimensions
- `text-embedding-3-small` - OpenAI latest, 512/1536 dimensions

---

### Semantic Search

**Definition**: Search that understands meaning, not just keywords.

**Traditional Keyword Search**:
```
Query: "budget-friendly venue"
Matches: Documents containing exact words "budget" AND "friendly" AND "venue"
Misses: "affordable space", "cost-effective location"
```

**Semantic Search**:
```
Query: "budget-friendly venue"
Matches:
- "affordable conference space" (0.89 similarity)
- "cost-effective event location" (0.85 similarity)
- "economical meeting room" (0.82 similarity)
```

**EventOS Examples**:
```python
# User asks: "sponsors interested in environmental tech"
# Semantic search matches:
- "GreenTech Corp" (focus: "sustainable technology solutions")
- "EcoInnovate" (focus: "environmental innovation")
- "CleanEnergy" (focus: "renewable energy systems")

# Without semantic search, would miss these (no exact keyword match)
```

**Implementation in MongoDB**:
```javascript
// Create vector search index
db.sponsors.createSearchIndex({
  name: "sponsor_vector_index",
  type: "vectorSearch",
  definition: {
    "fields": [{
      "type": "vector",
      "path": "embedding",
      "numDimensions": 384,
      "similarity": "cosine"
    }]
  }
})

// Search query
db.sponsors.aggregate([
  {
    $vectorSearch: {
      queryVector: embedding,
      path: "embedding",
      numCandidates: 100,
      limit: 10,
      index: "sponsor_vector_index"
    }
  }
])
```

---

### HITL (Human-in-the-Loop)

**Definition**: Workflow pattern where AI makes recommendations but requires human approval before proceeding.

**Why Important**: For high-stakes decisions (budget approval, sponsor selection), human judgment is essential.

**EventOS Use Cases**:

**Scenario 1: Budget Approval**
```
1. Budget Agent calculates event cost: $85,000
2. Agent presents breakdown to user
3. ⏸️ WAIT for human approval
4. User approves/modifies
5. Agent proceeds with next step
```

**Scenario 2: Sponsor Selection**
```
1. Sponsor Agent finds 10 matches
2. Agent ranks by fit score
3. ⏸️ WAIT for human review
4. User selects 3 sponsors
5. Agent drafts outreach emails
```

**Implementation Pattern (from a2a-travel-demo-app)**:
```typescript
// Agent sends HITL request
const approval = await useCoAgent({
  name: "budget_approval",
  state: {
    totalCost: 85000,
    breakdown: {...},
    status: "pending_approval"
  }
});

// UI shows approval component
<HumanApprovalRequired
  title="Budget Approval Needed"
  data={approval.breakdown}
  onApprove={(modifications) => {
    agent.approve(modifications);
  }}
  onReject={(reason) => {
    agent.reject(reason);
  }}
/>

// Agent waits for response
while (approval.status === "pending") {
  await sleep(1000);
}

if (approval.status === "approved") {
  // Continue workflow
}
```

**Benefits**:
- Maintains human oversight
- Builds user trust in AI
- Catches AI errors before execution
- Enables iterative refinement

---

## Protocols & Communication

### A2A Protocol

**Definition**: Agent-to-Agent communication protocol enabling different AI agents to coordinate and collaborate.

**Why It Exists**: Different agents (built with LangGraph, ADK, crewAI) need a standard way to communicate.

**Architecture (from a2a-travel-demo-app)**:
```
┌──────────────┐
│ Orchestrator │ (Central coordinator)
└──────┬───────┘
       │ A2A Protocol
       │
       ├─────► Itinerary Agent (LangGraph + OpenAI)
       ├─────► Budget Agent (ADK + Gemini)
       ├─────► Restaurant Agent (LangGraph + OpenAI)
       └─────► Weather Agent (ADK + Gemini)
```

**Message Format**:
```typescript
interface A2AMessage {
  id: string;
  from: string;        // "orchestrator", "budget_agent", etc.
  to: string;          // Target agent
  type: string;        // "request", "response", "error"
  payload: {
    task: string;      // What to do
    context: any;      // Input data
    priority: number;  // Urgency
  };
  timestamp: string;
}
```

**Example Flow**:
```javascript
// 1. Orchestrator requests venue search
orchestrator.send({
  to: "venue_agent",
  type: "request",
  payload: {
    task: "find_venues",
    context: {
      city: "San Francisco",
      capacity: 500,
      date: "2025-12-15"
    }
  }
});

// 2. Venue agent responds
venue_agent.send({
  to: "orchestrator",
  type: "response",
  payload: {
    task: "find_venues",
    result: [
      { name: "Moscone Center", capacity: 3000 },
      { name: "Palace Hotel", capacity: 800 }
    ]
  }
});

// 3. Orchestrator forwards to budget agent
orchestrator.send({
  to: "budget_agent",
  type: "request",
  payload: {
    task: "estimate_cost",
    context: {
      venues: venue_agent.result
    }
  }
});
```

**EventOS Application**:
```
User: "Create a tech conference for 500 people"

Orchestrator coordinates 5 agents via A2A:
1. Event Planner Agent
   ├─ Request: Create 2-day schedule
   └─ Response: Day 1 keynote, Day 2 workshops

2. Venue Finder Agent
   ├─ Request: Find venues for 500 people
   └─ Response: 3 venue options with pricing

3. Budget Agent
   ├─ Request: Estimate total cost
   └─ Response: $85K breakdown

4. Sponsor Matcher Agent
   ├─ Request: Find tech sponsors
   └─ Response: 10 matched companies

5. Speaker Curator Agent
   ├─ Request: Suggest speakers
   └─ Response: 15 industry experts
```

**Implementation (A2A Middleware)**:
```typescript
// app/api/copilotkit/route.ts
import { a2aMiddleware } from "@ag-ui/a2a-middleware";

export async function POST(req: Request) {
  return a2aMiddleware({
    agents: [
      { name: "orchestrator", url: "http://localhost:9000" },
      { name: "event_planner", url: "http://localhost:9001" },
      { name: "budget", url: "http://localhost:9002" },
      { name: "venue_finder", url: "http://localhost:9003" },
      { name: "sponsor_matcher", url: "http://localhost:9004" },
      { name: "speaker_curator", url: "http://localhost:9005" },
    ]
  })(req);
}
```

---

### AG-UI Protocol

**Definition**: Agent-to-UI communication protocol enabling bidirectional state synchronization between AI agents and React components.

**Why It Exists**: Traditional approach has agent and UI out of sync. AG-UI keeps them synchronized in real-time.

**Without AG-UI** (traditional):
```typescript
// Problem: Agent and UI state diverge
const [agentState, setAgentState] = useState(null);

// 1. User submits form
submitForm(data);

// 2. Agent processes (UI doesn't know progress)
// ...long delay...

// 3. Finally get response
const response = await agent.process(data);
setAgentState(response);  // UI updates AFTER agent finishes
```

**With AG-UI** (synchronized):
```typescript
// Solution: Agent and UI share state
const { state, updateState } = useCoAgent({
  name: "event_planner",
  initialState: { status: "idle" }
});

// Agent updates trigger immediate UI updates
state.status === "planning" → UI shows "Planning event..."
state.status === "searching_venues" → UI shows "Finding venues..."
state.status === "complete" → UI shows results
```

**Real-Time Synchronization**:
```typescript
// React component
function EventCreation() {
  const { state } = useCoAgent({
    name: "event_planner"
  });

  return (
    <div>
      {state.currentStep === "collecting_info" && (
        <InfoForm />
      )}
      {state.currentStep === "planning" && (
        <LoadingSpinner text="Creating schedule..." />
      )}
      {state.currentStep === "complete" && (
        <EventSummary data={state.result} />
      )}
    </div>
  );
}

// Python agent
from copilotkit import CoAgent

agent = CoAgent(name="event_planner")

@agent.state
class State:
    current_step: str = "collecting_info"
    result: dict = None

def plan_event(state: State):
    # UI automatically updates when state changes
    state.current_step = "planning"
    # ... planning logic ...
    state.current_step = "complete"
    state.result = {...}
```

**EventOS Use Case**:
```
User creates event → AG-UI shows real-time progress:

┌─────────────────────────────────────┐
│ Creating Your Event                 │
│                                     │
│ ✓ Collected requirements           │
│ ⏳ Planning schedule...             │
│   Finding venues...                 │
│   Matching sponsors...              │
│   Curating speakers...              │
└─────────────────────────────────────┘

Each agent update immediately reflects in UI
```

---

### SSE (Server-Sent Events)

**Definition**: HTTP protocol for server-to-client streaming, enabling real-time updates from server.

**Comparison**:

| Feature | SSE | WebSockets | Polling |
|---------|-----|------------|---------|
| Direction | Server → Client | Bidirectional | Client → Server |
| Protocol | HTTP | WebSocket | HTTP |
| Reconnection | Automatic | Manual | N/A |
| Complexity | Low | Medium | Low |
| Use Case | Real-time updates | Chat, gaming | Simple updates |

**How SSE Works**:
```typescript
// Server (FastAPI)
from fastapi.responses import StreamingResponse

async def event_stream():
    async for update in agent.stream():
        yield f"data: {json.dumps(update)}\n\n"

@app.get("/events")
async def stream():
    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream"
    )

// Client (React)
useEffect(() => {
  const eventSource = new EventSource('/api/events');

  eventSource.onmessage = (event) => {
    const update = JSON.parse(event.data);
    setProgress(update);
  };

  return () => eventSource.close();
}, []);
```

**EventOS Application**:
```typescript
// Stream event creation progress
function EventWizard() {
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource('/api/create-event');

    eventSource.onmessage = (event) => {
      const update = JSON.parse(event.data);
      setProgress(prev => [...prev, update]);
    };
  }, []);

  return (
    <div>
      {progress.map(step => (
        <div key={step.id}>
          {step.status === "complete" ? "✓" : "⏳"} {step.message}
        </div>
      ))}
    </div>
  );
}

// Server streams updates
Stream: "Analyzing requirements..."
Stream: "Searching venues..."
Stream: "Found 5 venues"
Stream: "Matching sponsors..."
Stream: "Found 12 sponsors"
Stream: "Complete!"
```

**Why Important**: EventOS needs real-time feedback during multi-agent operations. SSE provides this without WebSocket complexity.

---

### WebSockets

**Definition**: Full-duplex communication protocol enabling bidirectional real-time communication.

**When to Use**:
- Chat applications (bidirectional messages)
- Collaborative editing
- Gaming
- Live dashboards with user controls

**When NOT to Use** (use SSE instead):
- Server-only updates (event creation progress)
- Notification streams
- Live logs

**EventOS Use Case**:
```typescript
// Only use WebSockets if you need bidirectional chat
function AIWizardChat() {
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:9000/chat');

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      addMessage(message);
    };
  }, []);

  const sendMessage = (text) => {
    ws.current.send(JSON.stringify({ text }));
  };

  return (
    <div>
      <ChatMessages messages={messages} />
      <ChatInput onSend={sendMessage} />
    </div>
  );
}
```

**SSE vs WebSocket Decision**:
- Need bidirectional? → WebSockets
- Server updates only? → SSE
- Simple notifications? → SSE

---

## AI Frameworks

### LangGraph

**Definition**: Framework for building stateful, multi-agent workflows using graph-based orchestration.

**Key Concepts**:
1. **State**: Shared data passed between nodes
2. **Nodes**: Functions that process state
3. **Edges**: Connections between nodes
4. **Conditional Routing**: Dynamic paths based on state

**Basic Example**:
```python
from langgraph.graph import StateGraph, END

# Define state
class EventState(TypedDict):
    requirements: dict
    schedule: dict
    venues: list
    status: str

# Create graph
workflow = StateGraph(EventState)

# Add nodes (agent functions)
workflow.add_node("collect_requirements", collect_requirements_agent)
workflow.add_node("plan_schedule", plan_schedule_agent)
workflow.add_node("find_venues", find_venues_agent)

# Add edges (flow)
workflow.add_edge("collect_requirements", "plan_schedule")
workflow.add_edge("plan_schedule", "find_venues")
workflow.add_edge("find_venues", END)

# Set entry point
workflow.set_entry_point("collect_requirements")

# Compile graph
app = workflow.compile()

# Run
result = app.invoke({
    "requirements": {"attendees": 500},
    "status": "started"
})
```

**EventOS Agent Example**:
```python
# Event Planner Agent using LangGraph
from langgraph.graph import StateGraph
from langchain_openai import ChatOpenAI

class EventPlannerState(TypedDict):
    event_name: str
    days: int
    schedule: dict
    status: str

def create_schedule(state: EventPlannerState):
    llm = ChatOpenAI(model="gpt-4")

    prompt = f"""
    Create a {state['days']}-day schedule for {state['event_name']}.
    Include keynotes, workshops, networking sessions.
    """

    response = llm.invoke(prompt)

    return {
        "schedule": response.content,
        "status": "complete"
    }

workflow = StateGraph(EventPlannerState)
workflow.add_node("create_schedule", create_schedule)
workflow.set_entry_point("create_schedule")
workflow.add_edge("create_schedule", END)

agent = workflow.compile()
```

**Benefits**:
- Visual workflow graphs (debug with LangGraph Studio)
- State persistence
- Conditional branching
- Error handling and retries
- Human-in-the-loop integration

---

### LangChain

**Definition**: Framework for building LLM applications with modular components (chains, agents, tools).

**Relationship to LangGraph**: LangChain provides building blocks, LangGraph provides orchestration.

**Key Components**:
```python
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

# 1. LLM
llm = ChatOpenAI(model="gpt-4")

# 2. Prompt Template
prompt = PromptTemplate(
    input_variables=["topic"],
    template="Create a speaker bio for an expert in {topic}"
)

# 3. Chain
chain = LLMChain(llm=llm, prompt=prompt)

# 4. Run
result = chain.run(topic="quantum computing")
```

**EventOS Use**: LangChain for individual agent logic, LangGraph for agent orchestration.

---

### Google ADK

**Definition**: Agent Development Kit for building agents using Google's Gemini models.

**Why Use ADK**:
- Optimized for Gemini models
- Built-in tool calling
- Streaming responses
- Google Cloud integration

**Example from a2a-travel-demo-app**:
```python
# Budget Agent using ADK + Gemini
from google import genai

client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

@app.post("/estimate")
async def estimate_budget(request: BudgetRequest):
    prompt = f"""
    Estimate budget for:
    - Venue: {request.venue}
    - Attendees: {request.attendees}
    - Days: {request.days}

    Provide breakdown for: venue, catering, A/V, staff
    """

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt
    )

    return response.text
```

**ADK vs LangGraph**:
- ADK: Google-specific, optimized for Gemini
- LangGraph: Model-agnostic, works with any LLM

**EventOS Strategy**: Mix both (like a2a-travel-demo-app)
- LangGraph agents: Event planning, venue search (OpenAI GPT-4)
- ADK agents: Budget estimation, weather (Gemini Flash - faster/cheaper)

---

### crewAI

**Definition**: Framework for orchestrating role-based AI agents as a crew with defined roles and goals.

**Philosophy**: Agents as team members with specific roles.

**Example**:
```python
from crewai import Agent, Task, Crew

# Define agents with roles
planner = Agent(
    role="Event Planner",
    goal="Create comprehensive event schedules",
    backstory="Expert in event planning with 10 years experience"
)

venue_finder = Agent(
    role="Venue Scout",
    goal="Find perfect venues for events",
    backstory="Real estate expert specializing in event spaces"
)

# Define tasks
planning_task = Task(
    description="Create a 2-day conference schedule",
    agent=planner
)

venue_task = Task(
    description="Find venues in San Francisco for 500 people",
    agent=venue_finder
)

# Create crew
crew = Crew(
    agents=[planner, venue_finder],
    tasks=[planning_task, venue_task],
    verbose=True
)

# Run
result = crew.kickoff()
```

**crewAI vs LangGraph**:
- crewAI: Role-based, simpler API, opinionated
- LangGraph: Graph-based, more flexible, complex

**EventOS**: Prefer LangGraph for consistency with saas-dynamic-dashboards, but crewAI patterns from restaurant-finder can inspire agent roles.

---

### CopilotKit

**Definition**: React framework for integrating AI copilots and agents into applications.

**Key Features**:
1. `<CopilotKit>` - Provider component
2. `useCoAgent` - React hook for agent state
3. Copilot Sidebar - Built-in chat UI
4. Copilot Textarea - AI-assisted input
5. Backend integration with LangGraph/ADK

**Architecture**:
```
┌─────────────────┐
│ React App       │
│ ├ CopilotKit    │
│ ├ useCoAgent    │
│ └ UI Components │
└────────┬────────┘
         │ HTTP/SSE
┌────────┴────────┐
│ Next.js API     │
│ ├ A2A Middleware│
│ └ Auth          │
└────────┬────────┘
         │ HTTP
┌────────┴────────┐
│ Python Agents   │
│ ├ LangGraph     │
│ └ Google ADK    │
└─────────────────┘
```

**Example** (from saas-dynamic-dashboards):
```typescript
// app/page.tsx
import { CopilotKit } from "@copilotkit/react-core";

export default function Home() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <Dashboard />
    </CopilotKit>
  );
}

// components/EventCreation.tsx
import { useCoAgent } from "@copilotkit/react-core";

function EventCreation() {
  const { state, setState } = useCoAgent({
    name: "event_planner",
    initialState: {
      status: "idle",
      schedule: null
    }
  });

  return (
    <div>
      <button onClick={() => setState({ status: "planning" })}>
        Create Event
      </button>
      {state.status === "planning" && <LoadingSpinner />}
      {state.schedule && <Schedule data={state.schedule} />}
    </div>
  );
}

// app/api/copilotkit/route.ts
import { CopilotRuntime, OpenAIAdapter } from "@copilotkit/runtime";

export async function POST(req: Request) {
  const copilotKit = new CopilotRuntime();

  return copilotKit.response(req, new OpenAIAdapter());
}
```

**Why CopilotKit**: Handles complex agent-UI synchronization, built-in components, production-ready.

---

## Architecture Patterns

### Multi-Agent Orchestration

**Definition**: Pattern where multiple specialized agents coordinate to accomplish complex tasks.

**Single Agent**:
```
User Request → Single Agent → Response
```

**Multi-Agent**:
```
User Request → Orchestrator
                ├─ Agent 1 (Specialist)
                ├─ Agent 2 (Specialist)
                ├─ Agent 3 (Specialist)
                └─ Agent 4 (Specialist)
                     ↓
                  Combined Response
```

**EventOS Architecture**:
```
User: "Create tech conference"
         ↓
┌────────────────────┐
│ Orchestrator       │ Coordinates workflow
└────────┬───────────┘
         │
         ├─► Event Planner (Schedule creation)
         │   ├─ Input: event requirements
         │   └─ Output: 2-day schedule
         │
         ├─► Venue Finder (Location search)
         │   ├─ Input: city, capacity, date
         │   └─ Output: 5 venue options
         │
         ├─► Budget Agent (Cost estimation)
         │   ├─ Input: venues, attendees, days
         │   └─ Output: $85K breakdown
         │
         ├─► Sponsor Matcher (RAG search)
         │   ├─ Input: event topic, industry
         │   └─ Output: 10 matched sponsors
         │
         └─► Speaker Curator (Expert discovery)
             ├─ Input: topics, speaker count
             └─ Output: 15 speaker suggestions
                 ↓
            Combined Event Plan
```

**Orchestrator Logic**:
```python
async def orchestrate_event_creation(user_input: dict):
    # 1. Collect requirements
    requirements = await collect_requirements(user_input)

    # 2. Parallel execution (independent tasks)
    schedule, venues = await asyncio.gather(
        event_planner_agent.run(requirements),
        venue_finder_agent.run(requirements)
    )

    # 3. Sequential execution (dependent task)
    budget = await budget_agent.run({
        "schedule": schedule,
        "venues": venues,
        "attendees": requirements["attendees"]
    })

    # 4. HITL approval
    if await user_approves(budget):
        # 5. Parallel execution (final tasks)
        sponsors, speakers = await asyncio.gather(
            sponsor_matcher_agent.run(requirements),
            speaker_curator_agent.run(schedule)
        )

    return {
        "schedule": schedule,
        "venues": venues,
        "budget": budget,
        "sponsors": sponsors,
        "speakers": speakers
    }
```

**Benefits**:
- **Specialization**: Each agent expert in one domain
- **Parallel Execution**: Independent tasks run concurrently
- **Scalability**: Add new agents without changing existing ones
- **Maintainability**: Debug individual agents in isolation

---

### Layer-Based Sequencing

**Definition**: Development pattern where tasks are organized into sequential layers with dependencies.

**5 Layers**:
```
Layer 1: Database ✅
  ↓ (must complete)
Layer 2: Backend ✅
  ↓ (must complete)
Layer 3: Frontend ✅
  ↓ (must complete)
Layer 4: Testing ✅
  ↓ (must complete)
Layer 5: Production ✅
```

**Why This Order**:
1. **Database First**: Backend needs database schema
2. **Backend Second**: Frontend needs API endpoints
3. **Frontend Third**: Testing needs complete UI
4. **Testing Fourth**: Production needs passing tests
5. **Production Last**: All layers validated

**Example: Adding Sponsor Matching**:

**Layer 1: Database**
```sql
-- Create sponsors table
CREATE TABLE sponsors (
  id UUID PRIMARY KEY,
  name TEXT,
  industry TEXT,
  budget_range TEXT,
  description TEXT,
  embedding VECTOR(384)  -- For semantic search
);

-- Create index for vector search
CREATE INDEX ON sponsors USING ivfflat (embedding vector_cosine_ops);
```

**Layer 2: Backend**
```python
# API endpoint
@app.post("/api/sponsors/match")
async def match_sponsors(request: MatchRequest):
    # Generate embedding
    embedding = model.encode(request.query)

    # Vector search
    sponsors = await db.search_sponsors(embedding)

    return {"sponsors": sponsors}
```

**Layer 3: Frontend**
```typescript
// React component
function SponsorMatcher() {
  const { mutate } = useMutation({
    mutationFn: (query: string) =>
      fetch('/api/sponsors/match', {
        method: 'POST',
        body: JSON.stringify({ query })
      })
  });

  return (
    <div>
      <input onChange={(e) => mutate(e.target.value)} />
      <SponsorResults data={data} />
    </div>
  );
}
```

**Layer 4: Testing**
```python
# E2E test with Playwright MCP
async def test_sponsor_matching():
    # Navigate to sponsor page
    await browser.navigate("/sponsors")

    # Fill search
    await browser.fill_form([{
        "ref": "search_input",
        "value": "tech sponsors for AI"
    }])

    # Verify results
    snapshot = await browser.snapshot()
    assert "GreenTech Corp" in snapshot
    assert "EcoInnovate" in snapshot
```

**Layer 5: Production**
```bash
# Deploy database migration
supabase db push

# Deploy backend
railway up

# Deploy frontend
vercel deploy --prod
```

**Checkpoints**:
- ✅ Layer 1 tests pass → Proceed to Layer 2
- ✅ Layer 2 tests pass → Proceed to Layer 3
- ✅ Layer 3 tests pass → Proceed to Layer 4
- ✅ Layer 4 tests pass → Proceed to Layer 5
- ❌ Any layer fails → Fix before proceeding

---

### Progressive Disclosure

**Definition**: Design pattern where complexity is revealed gradually, showing only essential information initially.

**Bad Example** (all at once):
```markdown
# Planning Architect Skill

[10,000 lines of detailed templates, examples, and documentation]
```

**Good Example** (progressive):
```markdown
# Planning Architect Skill (500 lines)

## Core Documents
1. PRD → See reference/prd-template.md
2. Tech Spec → See reference/tech-spec-template.md
3. Task Breakdown → See reference/task-breakdown-template.md

Want detailed PRD template? Load reference/prd-template.md
```

**Benefits**:
- Faster initial loading (less context consumed)
- Better user experience (not overwhelmed)
- Efficient context usage (load details only when needed)

**Applied in EventOS**:
- Main SKILL.md: < 500 lines
- Reference files: Detailed templates (~100KB)
- User sees overview → Dives deep only if needed

---

### Shift-Left Testing

**Definition**: Testing strategy where testing happens early and continuously, not just at the end.

**Traditional** (shift-right):
```
Build → Build → Build → Build → Test Everything
(4 weeks)                        (1 week fixing bugs)
```

**Shift-Left**:
```
Build Layer 1 → Test → Build Layer 2 → Test → Build Layer 3 → Test
(Find bugs early, fix cheap)
```

**EventOS Application**:
```
Layer 1: Database
  ├─ Build schema
  ├─ Test migrations ✅
  └─ Test RLS policies ✅

Layer 2: Backend
  ├─ Build API
  ├─ Test endpoints ✅
  └─ Test business logic ✅

Layer 3: Frontend
  ├─ Build components
  ├─ Test rendering ✅
  └─ Test interactions ✅
```

**Benefits**:
- **Find bugs early**: Cheaper to fix
- **Prevent cascading failures**: Layer 2 bug doesn't reach Layer 5
- **Faster debugging**: Know which layer broke
- **Confidence**: Each layer validated before proceeding

---

## Frontend Technologies

### Next.js App Router

**Definition**: Modern Next.js routing system using React Server Components and file-based routing.

**Old** (Pages Router):
```
pages/
├── index.tsx        → /
├── events/
│   ├── index.tsx    → /events
│   └── [id].tsx     → /events/123
└── api/
    └── events.ts    → /api/events
```

**New** (App Router):
```
app/
├── page.tsx             → /
├── layout.tsx           → Root layout
├── events/
│   ├── page.tsx         → /events
│   └── [id]/
│       └── page.tsx     → /events/123
└── api/
    └── events/
        └── route.ts     → /api/events
```

**Key Benefits**:
1. **Server Components**: Reduce client JS bundle
2. **Streaming**: Progressive rendering
3. **Nested Layouts**: Shared UI components
4. **Parallel Routes**: Multiple pages simultaneously

**EventOS Example**:
```
app/
├── layout.tsx                    # Root layout (nav, sidebar)
├── page.tsx                      # Home dashboard
├── events/
│   ├── layout.tsx                # Events layout
│   ├── page.tsx                  # Events list
│   ├── new/
│   │   └── page.tsx              # Create event (AI Wizard)
│   └── [id]/
│       ├── page.tsx              # Event detail
│       └── edit/
│           └── page.tsx          # Edit event
├── sponsors/
│   ├── page.tsx                  # Sponsors list
│   └── [id]/
│       └── page.tsx              # Sponsor detail
└── api/
    ├── copilotkit/
    │   └── route.ts              # A2A middleware
    ├── events/
    │   └── route.ts              # Events API
    └── sponsors/
        └── route.ts              # Sponsors API
```

---

### TanStack Query

**Definition**: Data fetching and state management library (formerly React Query).

**Why Use It**:
- Automatic caching
- Background refetching
- Optimistic updates
- Pagination support
- Infinite scroll

**Example**:
```typescript
// Fetch events
function EventsList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: () => fetch('/api/events').then(r => r.json())
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage />;

  return <EventsGrid events={data} />;
}

// Create event with optimistic update
function CreateEvent() {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (event) =>
      fetch('/api/events', {
        method: 'POST',
        body: JSON.stringify(event)
      }),
    onMutate: async (newEvent) => {
      // Cancel outgoing requests
      await queryClient.cancelQueries({ queryKey: ['events'] });

      // Snapshot previous value
      const previous = queryClient.getQueryData(['events']);

      // Optimistically update
      queryClient.setQueryData(['events'], (old) =>
        [...old, newEvent]
      );

      return { previous };
    },
    onError: (err, newEvent, context) => {
      // Rollback on error
      queryClient.setQueryData(['events'], context.previous);
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: ['events'] });
    }
  });

  return (
    <button onClick={() => mutate(newEventData)}>
      Create Event
    </button>
  );
}
```

**EventOS Application**:
- Fetch events with caching
- Optimistic sponsor matching
- Infinite scroll for speaker list
- Background refetch for live updates

---

### shadcn/ui

**Definition**: Component library built on Radix UI with Tailwind CSS, providing copy-paste accessible components.

**Not a Package**: You copy components into your codebase.

**Installation**:
```bash
npx shadcn-ui@latest init

npx shadcn-ui@latest add button
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add form
```

**Example**:
```typescript
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

function CreateEventDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Event</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Create New Event</DialogHeader>
        <EventForm />
      </DialogContent>
    </Dialog>
  );
}
```

**EventOS Usage**: Already using shadcn/ui, perfect match with saas-dynamic-dashboards.

---

### Tailwind CSS

**Definition**: Utility-first CSS framework.

**Example**:
```typescript
// Traditional CSS
<div className="event-card">
  <h2 className="event-title">AI Conference</h2>
  <p className="event-description">...</p>
</div>

// styles.css
.event-card {
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

// Tailwind CSS
<div className="p-4 rounded-lg bg-white shadow-sm">
  <h2 className="text-xl font-bold">AI Conference</h2>
  <p className="text-gray-600">...</p>
</div>
```

**EventOS**: Already using Tailwind, matches saas-dynamic-dashboards.

---

## Backend Technologies

### FastAPI

**Definition**: Modern Python web framework for building APIs with automatic docs and type validation.

**Example**:
```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Event(BaseModel):
    name: str
    attendees: int
    budget: float

@app.post("/api/events")
async def create_event(event: Event):
    # Type validation automatic
    return {"id": "123", "event": event}

# Automatic OpenAPI docs at /docs
```

**Why FastAPI**:
- Async support (handles many requests)
- Type validation (Pydantic)
- Automatic docs
- Fast performance

**EventOS Application**: Python agents run on FastAPI servers (ports 9000-9005).

---

### Poetry

**Definition**: Python dependency management and packaging tool.

**Example**:
```bash
# Initialize project
poetry init

# Add dependency
poetry add langchain langgraph openai

# Install dependencies
poetry install

# Run script
poetry run python agent.py
```

**pyproject.toml**:
```toml
[tool.poetry.dependencies]
python = "^3.10"
langchain = "^0.1.0"
langgraph = "^0.0.50"
openai = "^1.0.0"
fastapi = "^0.110.0"
```

**EventOS**: saas-dynamic-dashboards uses Poetry for Python agent.

---

### pnpm

**Definition**: Fast, disk-efficient package manager for Node.js.

**vs npm/yarn**:
```
npm:  15 seconds, 300MB node_modules
yarn: 12 seconds, 280MB node_modules
pnpm: 8 seconds, 150MB node_modules (uses symlinks)
```

**Commands**:
```bash
pnpm install           # Install dependencies
pnpm add react         # Add package
pnpm dev               # Run dev script
pnpm build             # Run build script
```

**EventOS**: saas-dynamic-dashboards uses pnpm, we should adopt it for v2.

---

### UV Package Manager

**Definition**: Ultra-fast Python package installer (Rust-based, 10-100x faster than pip).

**Comparison**:
```
pip install:     45 seconds
poetry install:  35 seconds
uv install:      2 seconds
```

**Usage**:
```bash
# Install uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# Create venv
uv venv

# Install packages
uv pip install langchain langgraph openai

# Sync dependencies
uv pip sync requirements.txt
```

**EventOS**: Consider switching from Poetry to UV for 10x faster installs during development.

---

## Database & Storage

### MongoDB Vector Store

**Definition**: MongoDB with vector search capabilities for semantic similarity queries.

**Setup**:
```javascript
// Create vector search index
db.sponsors.createSearchIndex({
  name: "sponsor_search",
  type: "vectorSearch",
  definition: {
    fields: [{
      type: "vector",
      path: "embedding",
      numDimensions: 384,
      similarity: "cosine"
    }]
  }
});
```

**Query**:
```python
from pymongo import MongoClient
from sentence_transformers import SentenceTransformer

# Connect
client = MongoClient("mongodb://localhost:27017")
db = client.eventdb

# Generate query embedding
model = SentenceTransformer('all-MiniLM-L6-v2')
query_embedding = model.encode("tech sponsors for AI conference")

# Vector search
results = db.sponsors.aggregate([
    {
        "$vectorSearch": {
            "queryVector": query_embedding.tolist(),
            "path": "embedding",
            "numCandidates": 100,
            "limit": 10,
            "index": "sponsor_search"
        }
    },
    {
        "$project": {
            "name": 1,
            "description": 1,
            "score": { "$meta": "vectorSearchScore" }
        }
    }
])

for sponsor in results:
    print(f"{sponsor['name']}: {sponsor['score']}")
```

**EventOS Application**: Semantic sponsor matching, venue search by description, speaker expertise matching.

---

### Supabase

**Definition**: Open-source Firebase alternative with PostgreSQL, Auth, Storage, and Realtime.

**EventOS Current Stack**: Already using Supabase.

**Key Features**:
- PostgreSQL with pgvector extension (vector search)
- Row-Level Security (RLS)
- Auto-generated REST API
- Real-time subscriptions
- Authentication
- File storage

**Vector Search in Supabase**:
```sql
-- Enable pgvector
CREATE EXTENSION vector;

-- Create table with vector column
CREATE TABLE sponsors (
  id UUID PRIMARY KEY,
  name TEXT,
  description TEXT,
  embedding VECTOR(384)
);

-- Create index
CREATE INDEX ON sponsors USING ivfflat (embedding vector_cosine_ops);

-- Query
SELECT name, description,
       1 - (embedding <=> '[0.1, 0.2, ...]'::vector) AS similarity
FROM sponsors
ORDER BY embedding <=> '[0.1, 0.2, ...]'::vector
LIMIT 10;
```

**EventOS Strategy**: Use Supabase for all data, add vector columns for semantic search.

---

### PostgreSQL RLS

**Definition**: Row-Level Security - database-level access control where users only see rows they're authorized to view.

**Example**:
```sql
-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policy: Users see only their events
CREATE POLICY "Users see own events"
ON events FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can create events
CREATE POLICY "Users create events"
ON events FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users update own events
CREATE POLICY "Users update own events"
ON events FOR UPDATE
USING (auth.uid() = user_id);
```

**EventOS Application**:
- Events: Users see only their events
- Sponsors: Public read, admin write
- Speakers: Public read, organizer write
- Bookings: Users see only their bookings

---

## Testing

### MCP Testing

**Definition**: Model Context Protocol testing tools integrated into Claude Code for browser automation and debugging.

**Available Tools**:
1. **Playwright MCP** - Browser automation
2. **Chrome DevTools MCP** - Network monitoring, performance
3. **Supabase MCP** - Database testing

---

### Playwright MCP

**Definition**: Browser automation for E2E testing via Model Context Protocol.

**Example Test**:
```typescript
// Test event creation flow
async function testEventCreation() {
  // 1. Navigate
  await browser_navigate({ url: "http://localhost:3000/events/new" });

  // 2. Take snapshot
  const snapshot = await browser_snapshot();

  // 3. Fill form
  await browser_fill_form({
    fields: [
      { ref: "event_name", value: "AI Conference" },
      { ref: "attendees", value: "500" },
      { ref: "date", value: "2025-12-15" }
    ]
  });

  // 4. Submit
  await browser_click({ element: "Submit button", ref: "submit_btn" });

  // 5. Verify success
  await browser_wait_for({ text: "Event created successfully" });

  // 6. Take screenshot
  await browser_take_screenshot({ filename: "event-created.png" });
}
```

**EventOS Use Cases**:
- AI Wizard flow (multi-step event creation)
- Sponsor matching search
- Venue discovery map interaction
- Speaker curation filters

---

### Chrome DevTools MCP

**Definition**: Network monitoring and performance analysis via Chrome DevTools Protocol.

**Example**:
```typescript
// Test API performance
async function testAPIPerformance() {
  // 1. Start performance trace
  await performance_start_trace({ reload: true });

  // 2. Perform actions
  await browser_navigate({ url: "http://localhost:3000/events" });

  // 3. Stop trace
  const trace = await performance_stop_trace();

  // 4. Analyze Core Web Vitals
  console.log("LCP:", trace.insights.LCPBreakdown);
  console.log("CLS:", trace.insights.CumulativeLayoutShift);

  // 5. Check network requests
  const requests = await list_network_requests();
  const apiCalls = requests.filter(r => r.url.includes('/api/'));

  console.log(`API calls: ${apiCalls.length}`);
  console.log(`Slowest: ${Math.max(...apiCalls.map(r => r.duration))}ms`);
}
```

**EventOS Use Cases**:
- Monitor agent API response times
- Verify no slow queries
- Check bundle size
- Validate Core Web Vitals

---

### E2E Testing

**Definition**: End-to-end testing that validates entire user flows from start to finish.

**EventOS Critical Flows**:

**Flow 1: Event Creation via AI Wizard**
```typescript
test("Create event via AI Wizard", async () => {
  // 1. Start wizard
  await browser.navigate("/events/new");

  // 2. Chat with AI
  await browser.type({
    element: "Chat input",
    ref: "wizard_chat",
    text: "Create a 2-day AI conference for 500 people in SF"
  });

  // 3. Wait for agent responses
  await browser.wait_for({ text: "I've created a schedule" });
  await browser.wait_for({ text: "Found 5 venues" });
  await browser.wait_for({ text: "Estimated budget: $85K" });

  // 4. Approve budget
  await browser.click({ element: "Approve button", ref: "approve_btn" });

  // 5. Wait for completion
  await browser.wait_for({ text: "Event created successfully" });

  // 6. Verify database
  const event = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  expect(event.name).toContain("AI conference");
  expect(event.attendees).toBe(500);
});
```

**Flow 2: Sponsor Matching**
```typescript
test("Match sponsors using RAG", async () => {
  // 1. Navigate
  await browser.navigate("/sponsors/discover");

  // 2. Search
  await browser.type({
    element: "Search input",
    ref: "sponsor_search",
    text: "tech sponsors interested in AI and sustainability"
  });

  // 3. Wait for results (RAG agent)
  await browser.wait_for({ text: "Found 10 matching sponsors" });

  // 4. Verify top result
  const snapshot = await browser.snapshot();
  expect(snapshot).toContain("GreenTech Corp");
  expect(snapshot).toContain("95% match");

  // 5. Save sponsor
  await browser.click({ element: "Save button", ref: "save_sponsor_0" });

  // 6. Verify saved
  await browser.wait_for({ text: "Sponsor saved" });
});
```

---

**Status**: ✅ Technical reference complete
**Last Updated**: 2025-10-23
**Related**: See [CONVERSATION-SUMMARY.md](./CONVERSATION-SUMMARY.md) for context
