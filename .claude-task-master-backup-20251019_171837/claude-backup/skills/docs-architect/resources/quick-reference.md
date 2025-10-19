# Documentation Architect - Quick Reference

## Common Commands

### Generate MVP Docs
```bash
# Full MVP documentation set (001-009) with task breakdown
"Generate MVP documentation analyzing EventOS codebase with task breakdown for each feature"

# Specific section with tasks
"Generate 004-core-features.md with Task Master task breakdown"

# Update existing docs
"Update 002-architecture.md with new payment flow and task dependencies"
```

### Create Feature Implementation Plan
```bash
# Complete feature plan with tasks
"Create implementation plan for [feature] including:
- Architecture diagrams
- Task breakdown (5-7 subtasks per task)
- Dependencies and complexity scores
- Success criteria
- Task Master commands"

# Analyze existing feature
"Analyze [feature] and create:
- Architecture documentation
- Task breakdown for improvements
- Gap analysis with priorities"
```

### Feature Documentation
```bash
# Document new feature
"Document the event wizard feature with architecture diagrams"

# Document API
"Create API reference for Supabase Edge Functions"

# Document integration
"Document Stripe payment integration with webhook handling"
```

### Diagrams Only
```bash
# Create specific diagram
"Create sequence diagram for booking flow"

# Update diagram
"Update architecture diagram to include payment service"

# Multiple diagrams
"Create ERD and flow diagrams for event management"
```

---

## Document Types Reference

| Type | Purpose | Length | Key Elements |
|------|---------|--------|--------------|
| **MVP Docs** | System overview and implementation guide | 9 files | Architecture, setup, features, workflows |
| **Feature** | Specific feature implementation | 5-20 pages | Purpose, architecture, code, testing |
| **API Reference** | API endpoint documentation | Varies | Endpoints, parameters, responses, examples |
| **ADR** | Architecture Decision Record | 2-5 pages | Context, decision, consequences |
| **Onboarding** | New developer guide | 10-30 pages | Setup, concepts, workflows, troubleshooting |

---

## MVP Documentation Checklist

When generating 001-009 docs, ensure:

- [ ] **001-overview.md**: Executive summary, goals, high-level architecture
- [ ] **002-architecture.md**: System components, layers, integration points
- [ ] **003-setup-guide.md**: Environment setup, dependencies, configuration
- [ ] **004-core-features.md**: Core functionality with code examples
- [ ] **005-intermediate-workflows.md**: Automation, triggers, data flows
- [ ] **006-advanced-features.md**: AI agents, MCP servers, advanced integrations
- [ ] **007-best-practices.md**: Coding standards, patterns, conventions
- [ ] **008-success-criteria.md**: Functional, performance, reliability goals
- [ ] **009-workflow-checklist.md**: Implementation steps, task tracking

---

## Quality Standards

### Each Document Must Have
✅ Clear purpose statement at top
✅ Progressive complexity (high-level → details)
✅ Real code examples (not pseudocode)
✅ Mermaid diagrams where helpful
✅ Success criteria/validation steps
✅ Links to related documents
✅ Troubleshooting section
✅ Last updated date

### Each Document Should Avoid
❌ Verbose explanations of obvious concepts
❌ Generic tutorials Claude already knows
❌ Outdated code examples
❌ Broken internal links
❌ Unclear diagrams without labels
❌ Missing "why" explanations for decisions

---

## Diagram Selection Guide

| Scenario | Diagram Type | Example |
|----------|-------------|---------|
| User flow or API calls | Sequence Diagram | Login flow, checkout process |
| System architecture | Architecture Graph | Frontend → API → Database |
| Database schema | ERD | Users, Events, Orders relationships |
| Decision logic | Flowchart | Order validation, auth flow |
| State changes | State Diagram | Order states, event lifecycle |
| Project timeline | Gantt Chart | MVP phases, sprint planning |
| Code structure | Class Diagram | Component hierarchy |

---

## Section Templates

### Purpose Statement
```markdown
**Purpose:** [One sentence describing what and why]
```

### Architecture Section
```markdown
## 🏗️ Architecture

### High-Level Design
[Explanation of overall design]

```mermaid
[Architecture diagram]
```

### Key Components
1. **[Component 1]**: [Purpose and responsibilities]
2. **[Component 2]**: [Purpose and responsibilities]
```

### Implementation Section
```markdown
## 💡 Implementation

### [Feature/Component Name]

**File**: `src/path/to/file.ts:line-range`

```typescript
// Real code from project
[Code example]
```

**Why this approach?**
- [Reason 1]
- [Reason 2]
```

### Success Criteria Section
```markdown
## ✅ Success Criteria

### Functional
- ✅ [Requirement 1]
- ✅ [Requirement 2]

### Performance
- ✅ [Metric]: [Target]

### Validation
```bash
# Test commands
npm run test
```
```

---

## EventOS-Specific Patterns

### Technology Stack References
```markdown
**Frontend**: React 18 + TypeScript + Vite + shadcn/ui
**Backend**: Supabase (PostgreSQL + Auth + Storage + Real-time)
**State**: TanStack Query + Zustand
**Testing**: Playwright E2E + Vitest unit tests
**Deployment**: Vercel
```

### Code Example Format
```typescript
// Location: src/features/events/hooks/useEvents.ts:34-48

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'published');
      if (error) throw error;
      return data;
    }
  });
}
```

### Supabase Pattern Reference
```typescript
// RLS Policy Example
CREATE POLICY "users_read_own_events"
  ON events FOR SELECT
  USING (auth.uid() = organizer_id);

// Edge Function Example
const { data, error } = await supabase
  .functions.invoke('process-payment', {
    body: { amount, orderId }
  });
```

---

## Troubleshooting

### Documentation Too Long
**Symptom**: Document exceeds 30 pages
**Fix**: Split into multiple documents, move details to appendices

### Unclear Diagrams
**Symptom**: Readers confused by diagram
**Fix**: Add labels, limit to 5-7 nodes, include legend, explain in text

### Outdated Examples
**Symptom**: Code examples don't match current implementation
**Fix**: Copy from actual source files, verify with Read tool

### Missing Context
**Symptom**: Readers don't understand why decisions were made
**Fix**: Add "Why this approach?" sections, document alternatives considered

---

## Output Validation

Before finalizing documentation, verify:

1. **Completeness**: All required sections present
2. **Accuracy**: Code examples work and match current implementation
3. **Clarity**: Diagrams labeled, explanations clear
4. **Navigation**: Internal links work, logical flow between docs
5. **Currency**: Dates updated, no obsolete information
6. **Consistency**: Naming, formatting, style consistent throughout

---

**Last Updated**: 2025-10-19
**Version**: 1.0
