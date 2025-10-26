# Starter Repository Links

**Date**: 2025-10-23
**Purpose**: Quick reference for GitHub repository URLs

---

## 🌟 Primary Starter: saas-dynamic-dashboards

### GitHub URL
**Repository**: https://github.com/CopilotKit/CopilotKit

**Direct Path to Example**:
```
https://github.com/CopilotKit/CopilotKit/tree/main/examples/saas-dynamic-dashboards
```

### Live Demo
**Deployed App**: https://dynamic-saas-dashboard.vercel.app

### Video Demo
**Loom Recording**: https://www.loom.com/share/43be7bcbf1954672934e62ff8b3ee86e

### Local Clone Command
```bash
# Option 1: Clone entire CopilotKit repo and extract example
git clone https://github.com/CopilotKit/CopilotKit.git
cd CopilotKit/examples/saas-dynamic-dashboards

# Option 2: Use our already cloned version
cd /home/sk/event-studio/starter-repos/saas-dynamic-dashboards
```

### Key Features
- ⭐ Next.js 14+ with App Router
- ⭐ pnpm package manager
- ⭐ CopilotKit AI integration
- ⭐ Python LangGraph agent
- ⭐ Dashboard-focused UI
- ⭐ shadcn/ui components
- ⭐ OpenAI/Claude support

### Tech Stack
```typescript
Frontend:
- Next.js 14+
- TypeScript
- pnpm
- Tailwind CSS
- CopilotKit
- shadcn/ui

Backend:
- Python 3.10+
- Poetry
- LangGraph
- OpenAI API
```

---

## 🌟 Reference: a2a-travel-demo-app

### GitHub URL
**Repository**: https://github.com/TheGreatBonnie/a2a-travel-demo-app

**Direct Link**:
```
https://github.com/TheGreatBonnie/a2a-travel-demo-app
```

### Local Clone Command
```bash
# Option 1: Fresh clone
git clone https://github.com/TheGreatBonnie/a2a-travel-demo-app.git

# Option 2: Use our already cloned version
cd /home/sk/event-studio/starter-repos/a2a-travel-demo-app
```

### Key Features
- ⭐ Multi-agent orchestration (5 agents)
- ⭐ A2A protocol (agent-to-agent communication)
- ⭐ AG-UI protocol (agent-UI communication)
- ⭐ Mix of LangGraph (OpenAI) + ADK (Gemini)
- ⭐ Human-in-the-loop workflows
- ⭐ Real-time message visualization

### Agent Architecture
```
Orchestrator (Port 9000)
├── Itinerary Agent (9001) - LangGraph + OpenAI
├── Budget Agent (9002) - ADK + Gemini
├── Restaurant Agent (9003) - LangGraph + OpenAI
└── Weather Agent (9005) - ADK + Gemini
```

### Tech Stack
```typescript
Frontend:
- Next.js
- TypeScript
- CopilotKit
- AG-UI Client
- Tailwind CSS

Backend:
- Python 3.10+
- LangGraph (OpenAI)
- Google ADK (Gemini)
- FastAPI
- A2A Protocol
```

---

## 📚 Additional Reference Repositories

These were analyzed but not cloned (for reference only):

### 1. AI-Trip-Planner
**URL**: https://github.com/TheGreatBonnie/AI-Trip-Planner
**Use Case**: Simple OpenAI + Tavily integration examples

### 2. coagents-travel (Agent Only)
**URL**: https://github.com/CopilotKit/CopilotKit/tree/main/examples/coagents-travel/agent
**Use Case**: LangGraph agent implementation patterns

### 3. open-research-ANA
**URL**: https://github.com/CopilotKit/open-research-ANA
**Use Case**: Human-in-the-loop (HITL) patterns
**Live Demo**: https://open-research-ana.vercel.app

### 4. open-multi-agent-canvas
**URL**: https://github.com/CopilotKit/open-multi-agent-canvas
**Use Case**: MCP protocol integration (too complex for our needs)

---

## 🛠️ Quick Setup Commands

### Primary Starter (saas-dynamic-dashboards)

```bash
# Navigate to cloned repo
cd /home/sk/event-studio/starter-repos/saas-dynamic-dashboards

# Frontend setup
cd frontend
pnpm install
echo "OPENAI_API_KEY=sk-..." > .env
pnpm run dev  # http://localhost:3000

# Agent setup (separate terminal)
cd ../agent
poetry install
echo "OPENAI_API_KEY=sk-..." > .env
python agent.py
```

### Reference (a2a-travel-demo-app)

```bash
# Navigate to cloned repo
cd /home/sk/event-studio/starter-repos/a2a-travel-demo-app

# Install dependencies
npm install

# Setup Python agents
cd agents
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cd ..

# Configure environment
cp .env.example .env
# Edit .env and add:
# GOOGLE_API_KEY=your_key
# OPENAI_API_KEY=your_key

# Run all services (UI + 5 agents)
npm run dev
```

**Services started**:
- UI: http://localhost:3000
- Orchestrator: http://localhost:9000
- Itinerary Agent: http://localhost:9001
- Budget Agent: http://localhost:9002
- Restaurant Agent: http://localhost:9003
- Weather Agent: http://localhost:9005

---

## 📖 Documentation Links

### CopilotKit Ecosystem
- **Main Docs**: https://docs.copilotkit.ai
- **GitHub**: https://github.com/CopilotKit/CopilotKit
- **Examples**: https://github.com/CopilotKit/CopilotKit/tree/main/examples

### Protocols & Frameworks
- **A2A Protocol**: https://github.com/agent-matrix/a2a
- **AG-UI Protocol**: https://docs.ag-ui.com
- **LangGraph**: https://langchain-ai.github.io/langgraph/
- **Google ADK**: https://google.github.io/adk-docs/

### AI Providers
- **OpenAI Platform**: https://platform.openai.com
- **Google AI Studio**: https://aistudio.google.com
- **Anthropic (Claude)**: https://console.anthropic.com

---

## 🔗 Related Blog Posts

### Tutorial Articles
1. **Build an AI Travel Planner with CopilotKit**
   https://dev.to/copilotkit/build-an-ai-travel-planner-with-copilotkit-langgraph-google-maps-api-32fm

2. **The AI-Powered Trip Planner You Can't Live Without**
   https://dev.to/copilotkit/the-ai-powered-trip-planner-you-cant-live-without-2pk6

### Key Learnings from Articles
- Layered architecture (React → CopilotKit → LangGraph agent)
- React Context for state management
- `useCoAgent` hook for bidirectional sync
- Copilot Cloud vs. self-hosting
- LangGraph Studio for debugging

---

## 📋 Quick Reference

| Repository | Stars | Language | Framework | Complexity |
|------------|-------|----------|-----------|------------|
| saas-dynamic-dashboards | Part of CopilotKit | TypeScript/Python | Next.js + LangGraph | Low ⭐ |
| a2a-travel-demo-app | - | TypeScript/Python | Next.js + Multi-agent | High ⭐⭐⭐ |

### When to Use Each

**Use saas-dynamic-dashboards**:
- ✅ Starting point for EventOS v2
- ✅ Dashboard UI structure
- ✅ Simple AI integration
- ✅ Single agent workflow

**Reference a2a-travel-demo-app**:
- ✅ Multi-agent orchestration patterns
- ✅ A2A protocol implementation
- ✅ Agent communication examples
- ✅ HITL workflow patterns
- ✅ Message visualization UI

---

## 🎯 Integration Strategy

```
EventOS v2 = saas-dynamic-dashboards (base) + a2a-travel-demo-app (patterns)

Base Structure:                Multi-Agent System:
saas-dynamic-dashboards        a2a-travel-demo-app
├── Dashboard UI        +      ├── Orchestrator pattern
├── CopilotKit setup    +      ├── A2A protocol
└── Single agent        +      ├── Agent communication
                               └── 5 specialized agents

Result:
event-studio-v2
├── ui/ (from saas-dynamic-dashboards)
└── ai-agent/ (inspired by a2a-travel-demo-app)
    ├── orchestrator.py
    ├── event_planner_agent.py
    ├── budget_agent.py
    ├── venue_finder_agent.py
    ├── sponsor_matcher_agent.py
    └── speaker_curator_agent.py
```

---

## ✅ Already Cloned Locally

Both repositories are already available at:

```
/home/sk/event-studio/starter-repos/
├── saas-dynamic-dashboards/    ✅ Ready to use
└── a2a-travel-demo-app/        ✅ Ready to reference
```

No need to clone again unless you want a fresh copy!

---

**Last Updated**: 2025-10-23
**Status**: ✅ All repositories cloned and documented
**Next Step**: Review INTEGRATION-PLAN.md and begin Phase 1
