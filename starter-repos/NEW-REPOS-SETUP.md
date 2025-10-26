# New Repositories Setup Status

**Date**: 2025-10-23
**Repositories**: ag-ui-langgraph-app, open-gemini-canvas
**Location**: `/home/sk/event-studio/starter-repos/`

---

## ✅ Successfully Cloned Repositories

### 1. ag-ui-langgraph-app ⭐⭐⭐⭐⭐
**Location**: `/home/sk/event-studio/starter-repos/ag-ui-langgraph-app`
**GitHub**: https://github.com/TheGreatBonnie/ag-ui-langgraph-app
**Status**: ✅ Ready to run

#### Dependencies Installed
- ✅ Frontend: npm install (1025 packages)
- ✅ Python Agent: Poetry installed (28 packages)
  - ag-ui-protocol 0.1.9
  - fastapi 0.115.14
  - langgraph 0.4.10
  - openai 1.109.1
  - uvicorn 0.34.3

#### Structure
```
ag-ui-langgraph-app/
├── src/                          # Next.js 15 frontend
│   ├── app/
│   │   └── copilotkit/          # Research interface
│   ├── components/              # React components
│   └── lib/                     # Utilities
├── ag-ui-langgraph-agent/       # Python FastAPI backend
│   ├── .venv/                   # Virtual environment (created)
│   ├── src/agui/langgraph/
│   │   ├── agent.py            # Workflow builder
│   │   ├── state.py            # State management
│   │   ├── research.py         # Research logic
│   │   ├── report.py           # Report generation
│   │   └── web_search.py       # SerpAPI integration
│   └── pyproject.toml
├── package.json
└── README.md
```

---

### 2. open-gemini-canvas ⭐⭐⭐⭐⭐
**Location**: `/home/sk/event-studio/starter-repos/open-gemini-canvas`
**GitHub**: https://github.com/CopilotKit/open-gemini-canvas
**Live Demo**: https://copilot-kit-deepmind.vercel.app/
**Status**: ⚠️ Frontend ready, Python agent needs 3.12

#### Dependencies Installed
- ✅ Frontend: pnpm install (991 packages)
  - Next.js 15.2.4
  - CopilotKit 1.9.3
  - React 19.1.1
  - Radix UI components
  - Tailwind CSS 4.1.11

- ⚠️ Python Agent: Requires Python 3.12 (current: 3.10.12)

#### Structure
```
open-gemini-canvas/
├── app/                         # Next.js frontend
│   └── api/                     # API routes
├── components/                  # React components
├── agent/                       # Python FastAPI backend
│   ├── main.py                 # FastAPI server
│   ├── posts_generator_agent.py
│   ├── stack_agent.py
│   ├── prompts.py
│   └── pyproject.toml
├── package.json
└── README.md
```

---

## 🚀 How to Run

### ag-ui-langgraph-app (Fully Working)

#### Required: API Keys
Create `.env` files in both directories:

**Frontend `.env`**:
```bash
cd /home/sk/event-studio/starter-repos/ag-ui-langgraph-app
cp .env.example .env
# Edit .env and add:
# OPENAI_API_KEY=your_key
# SERPAPI_KEY=your_key (for web search)
```

**Agent `.env`**:
```bash
cd ag-ui-langgraph-agent
cp .env.example .env
# Edit .env and add:
# OPENAI_API_KEY=your_key
# SERPAPI_KEY=your_key
```

#### Option 1: Run Together (Recommended)
```bash
cd /home/sk/event-studio/starter-repos/ag-ui-langgraph-app

# Install concurrently if needed
npm install -g concurrently

# Run both frontend and agent
npm run dev
```

This starts:
- **Frontend**: http://localhost:3000
- **Agent API**: http://localhost:8000

#### Option 2: Run Separately

**Terminal 1 - Frontend**:
```bash
cd /home/sk/event-studio/starter-repos/ag-ui-langgraph-app
npm run dev
# Opens http://localhost:3000
```

**Terminal 2 - Python Agent**:
```bash
cd ag-ui-langgraph-agent
source .venv/bin/activate
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
# API at http://localhost:8000
```

---

### open-gemini-canvas (Frontend Only for Now)

#### Frontend Only (No API Keys Needed)
```bash
cd /home/sk/event-studio/starter-repos/open-gemini-canvas
pnpm dev
# Opens http://localhost:3000
```

**Note**: Agent won't work without Python 3.12, but you can explore the frontend UI and code.

#### To Run Full Stack (Need Python 3.12)
```bash
# Option 1: Upgrade Python to 3.12
# Option 2: Use pyenv to install Python 3.12
# Option 3: Use Docker

# Once you have Python 3.12:
cd agent
python3.12 -m venv .venv
source .venv/bin/activate
poetry install
python main.py
```

---

## 📋 Repository Comparison

| Feature | ag-ui-langgraph-app | open-gemini-canvas |
|---------|---------------------|---------------------|
| **Status** | ✅ Fully working | ⚠️ Frontend only |
| **Python Version** | 3.10+ ✅ | 3.12 required ⚠️ |
| **LLM** | OpenAI GPT-4 | Google Gemini |
| **Framework** | LangGraph | LangGraph |
| **Protocol** | AG-UI Protocol | CopilotKit |
| **Use Case** | Research agent | Post generator + Stack analyzer |
| **Complexity** | Medium | Medium |
| **Stars** | 3 | 138 ⭐ |

---

## 🎯 What to Use Each For

### ag-ui-langgraph-app → EventOS Event Research
**Primary reference** for EventOS agents.

**Use For**:
- Real-time streaming patterns (SSE)
- LangGraph workflow orchestration
- AG-UI Protocol implementation
- Research agent templates

**Adapt For EventOS**:
```python
# Event Research Agent (based on research agent)
from langgraph.graph import StateGraph

class EventResearchState(TypedDict):
    query: str
    search_results: list
    analysis: str
    report: str

def search_venues(state):
    # Search Google Maps API + web
    results = serp_api.search(state["query"] + " conference venues")
    return {"search_results": results}

def analyze_venues(state):
    # LLM analyzes results
    llm = ChatOpenAI(model="gpt-4")
    analysis = llm.invoke(f"Analyze venues: {state['search_results']}")
    return {"analysis": analysis}

def generate_report(state):
    report = llm.invoke(f"Create report: {state['analysis']}")
    return {"report": report}

# Build workflow
workflow = StateGraph(EventResearchState)
workflow.add_node("search", search_venues)
workflow.add_node("analyze", analyze_venues)
workflow.add_node("generate", generate_report)

workflow.add_edge("search", "analyze")
workflow.add_edge("analyze", "generate")
```

---

### open-gemini-canvas → EventOS Content Generation
**Production patterns** and specialized agents.

**Use For**:
- Production deployment patterns
- Google Gemini integration (cost savings)
- Specialized agent examples
- CopilotKit best practices

**Adapt For EventOS**:
```python
# Event Post Generator (based on posts_generator_agent)
from google import generativeai as genai

class EventPostGenerator:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-2.0-flash')

    def generate_post(self, event_details: dict) -> str:
        prompt = f"""
        Generate professional social media posts for:
        Event: {event_details['name']}
        Date: {event_details['date']}
        Speakers: {event_details['speakers']}

        Create:
        1. LinkedIn post (professional)
        2. Twitter thread (engaging)
        """

        response = self.model.generate_content(prompt)
        return response.text

# Use for:
# - Event announcement posts
# - Speaker introduction posts
# - Sponsor highlight posts
```

---

## 🔧 Troubleshooting

### ag-ui-langgraph-app

#### Issue 1: Poetry Keyring Error
**Error**: `Cannot install uvicorn` with keyring error
**Solution**:
```bash
cd ag-ui-langgraph-agent
source .venv/bin/activate
poetry config keyring.enabled false
poetry install
```

#### Issue 2: Missing API Keys
**Error**: `OPENAI_API_KEY not found`
**Solution**: Add to both `.env` files:
```bash
OPENAI_API_KEY=sk-...
SERPAPI_KEY=...  # Optional for web search
```

#### Issue 3: Port Already in Use
**Error**: `Address already in use: 0.0.0.0:8000`
**Solution**:
```bash
# Find process using port
lsof -i :8000
# Kill it
kill -9 <PID>
# Or use different port
uvicorn main:app --port 8001
```

---

### open-gemini-canvas

#### Issue 1: Python 3.12 Required
**Error**: `Current Python version (3.10.12) is not allowed`
**Solutions**:

**Option 1: Install Python 3.12**:
```bash
# Ubuntu/Debian
sudo add-apt-repository ppa:deadsnakes/ppa
sudo apt update
sudo apt install python3.12 python3.12-venv
```

**Option 2: Use pyenv**:
```bash
# Install pyenv
curl https://pyenv.run | bash

# Install Python 3.12
pyenv install 3.12
pyenv local 3.12

# Now run setup
cd agent
python -m venv .venv
source .venv/bin/activate
poetry install
```

**Option 3: Skip Agent (Use Frontend Only)**:
```bash
# Just run frontend
pnpm dev
# Explore UI and components
```

#### Issue 2: Missing Google API Key
**Error**: Agent needs `GOOGLE_API_KEY`
**Solution**:
```bash
cd agent
echo "GOOGLE_API_KEY=..." > .env
# Get key from: https://aistudio.google.com/app/apikey
```

---

## 📚 Learning Resources

### ag-ui-langgraph-app
**README**: `/home/sk/event-studio/starter-repos/ag-ui-langgraph-app/README.md`
**Agent README**: `ag-ui-langgraph-agent/README.md`

**Key Files to Study**:
- `src/app/copilotkit/page.tsx` - Frontend integration
- `ag-ui-langgraph-agent/src/agui/langgraph/agent.py` - LangGraph workflow
- `ag-ui-langgraph-agent/src/agui/langgraph/research.py` - Research logic

---

### open-gemini-canvas
**README**: `/home/sk/event-studio/starter-repos/open-gemini-canvas/README.md`
**Live Demo**: https://copilot-kit-deepmind.vercel.app/

**Key Files to Study**:
- `app/page.tsx` - Main UI
- `components/canvas.tsx` - Canvas interface
- `agent/posts_generator_agent.py` - Gemini agent
- `agent/stack_agent.py` - Stack analyzer

---

## 🎓 Next Steps

### Immediate (Try Locally)
```bash
# 1. Test ag-ui-langgraph-app
cd /home/sk/event-studio/starter-repos/ag-ui-langgraph-app
# Add API keys to .env files
npm run dev

# 2. Explore open-gemini-canvas UI
cd /home/sk/event-studio/starter-repos/open-gemini-canvas
pnpm dev
```

### Short-term (Study Code)
1. **Read agent implementations**:
   - `ag-ui-langgraph-agent/src/agui/langgraph/agent.py`
   - `open-gemini-canvas/agent/posts_generator_agent.py`

2. **Understand workflows**:
   - How LangGraph orchestrates research
   - How AG-UI Protocol streams updates
   - How Gemini agents generate content

3. **Identify patterns for EventOS**:
   - Research workflow → Venue discovery
   - Post generator → Event announcements
   - Stack analyzer → Venue tech analysis

### Long-term (Adapt for EventOS)
1. **Create EventOS agents** inspired by:
   - Event Planner (from research agent)
   - Venue Finder (from research agent + maps)
   - Content Generator (from posts generator)
   - Sponsor Matcher (from research + RAG)

2. **Integrate with EventOS**:
   - Use saas-dynamic-dashboards as base
   - Add AG-UI Protocol for real-time updates
   - Implement LangGraph workflows
   - Connect to Supabase database

---

## 📊 All Cloned Repositories Summary

### In `/home/sk/event-studio/starter-repos/`:

| Repository | Status | Purpose | EventOS Fit |
|------------|--------|---------|-------------|
| **saas-dynamic-dashboards** | ✅ Ready | Base architecture | ⭐⭐⭐⭐⭐ PRIMARY BASE |
| **a2a-travel-demo-app** | ⚠️ Missing ADK packages | Multi-agent orchestration | ⭐⭐⭐⭐ REFERENCE |
| **ag-ui-langgraph-app** | ✅ Ready | AG-UI + LangGraph | ⭐⭐⭐⭐⭐ PRIMARY REFERENCE |
| **open-gemini-canvas** | ⚠️ Needs Python 3.12 | Production + Gemini | ⭐⭐⭐⭐⭐ PRODUCTION PATTERNS |

---

## 🏗️ EventOS v2 Integration Strategy

```
EventOS v2 Architecture

Base: saas-dynamic-dashboards
├── Dashboard UI structure
├── pnpm + Next.js 14+
├── shadcn/ui components
└── Single agent (expand to multi)

Add: ag-ui-langgraph-app patterns
├── AG-UI Protocol (real-time streaming)
├── LangGraph workflows (event planning)
├── SSE streaming (progress updates)
└── Research agent → Venue/Sponsor discovery

Add: open-gemini-canvas patterns
├── Gemini integration (cost savings)
├── Specialized agents (content generation)
├── Production deployment patterns
└── CopilotKit best practices

Add: a2a-travel-demo-app patterns
├── Multi-agent orchestration
├── A2A protocol (agent communication)
├── HITL workflows (approvals)
└── 5-agent architecture

Add: ecommerce-rag-agent patterns
├── RAG for sponsor matching
├── MongoDB vector store
├── Semantic search
└── Embeddings

Result: EventOS v2
├── ui/ (saas-dynamic-dashboards)
└── agents/
    ├── orchestrator.py
    ├── event_planner_agent.py (ag-ui-langgraph-app)
    ├── venue_finder_agent.py (ag-ui-langgraph-app + maps)
    ├── budget_agent.py (a2a-travel-demo-app)
    ├── sponsor_matcher_agent.py (ecommerce-rag-agent RAG)
    ├── speaker_curator_agent.py (open-gemini-canvas)
    └── content_generator_agent.py (open-gemini-canvas)
```

---

## ✅ Current Status Summary

**Cloned**: 4 repositories
**Ready to Run**: 2 repositories (saas-dynamic-dashboards, ag-ui-langgraph-app)
**Needs Setup**: 2 repositories (a2a-travel-demo-app, open-gemini-canvas)

**Recommended Next Step**: Test **ag-ui-langgraph-app** locally with your OpenAI API key!

```bash
cd /home/sk/event-studio/starter-repos/ag-ui-langgraph-app
# Add OPENAI_API_KEY to .env files
npm run dev
# Visit http://localhost:3000
```

---

**Last Updated**: 2025-10-23
**Status**: ✅ Setup complete, ready for testing
**Next**: Add API keys and run ag-ui-langgraph-app
