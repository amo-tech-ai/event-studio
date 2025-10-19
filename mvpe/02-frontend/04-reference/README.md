# 📚 Phase X: Quick Reference

**Purpose:** Fast lookup during implementation
**When:** Anytime you need quick answers
**Goal:** Find component APIs, patterns, designs quickly

---

## 📁 Reference Files

### 01-component-api.md
**Use when:** "How do I use component X?"

**Contains:**
- Component prop definitions
- Usage examples
- Import paths
- Common patterns

**Example Lookups:**
- Button variants and sizes
- Card composition patterns
- Form field types
- Dialog usage

**Time to answer:** 2-5 minutes

---

### 02-page-designs.md
**Use when:** "What's the layout for page X?"

**Contains:**
- Page layout specifications
- Component composition
- Grid structures
- Responsive breakpoints

**Example Lookups:**
- Dashboard layout structure
- Event details page layout
- Settings page sections
- Navigation patterns

**Time to answer:** 2-5 minutes

---

### planning-archive/
**Use when:** Historical context needed

**Contains:**
- Original planning documents
- Comprehensive frontend plans
- Implementation progress history
- Feature roadmaps

**Files:**
- `05-COMPREHENSIVE-FRONTEND-PLAN.md` - Dashboard/forms/chat plan
- `06-UI-COMPONENT-DIAGRAMS.md` - Component diagrams
- `07-IMPLEMENTATION-PROGRESS-TRACKER.md` - Historical progress
- `08-FEATURE-SUGGESTIONS-ROADMAP.md` - Future features
- `10-FRONTEND-PLAN.md` - Complete Next.js plan

**When to use:** Research, historical context, alternative approaches

---

## 🔍 Quick Lookup Guide

### "How do I...?"

| Question | Answer Location | Time |
|----------|----------------|------|
| Use Button component? | `01-component-api.md` → Button | 2min |
| Style with Tailwind? | `../02-foundation/02-component-patterns.md` | 5min |
| Create form validation? | `../02-foundation/02-component-patterns.md` → Forms | 5min |
| Fetch data with hook? | `../02-foundation/01-data-state-management.md` | 5min |
| Layout dashboard page? | `02-page-designs.md` → Dashboard | 3min |
| Use Card component? | `01-component-api.md` → Card | 2min |
| Add real-time updates? | `../02-foundation/01-data-state-management.md` → Realtime | 5min |
| Implement accessibility? | `../02-foundation/02-component-patterns.md` → A11y | 5min |

---

## 💡 Pro Tips

### During Active Development

**Keep These Open:**
1. `01-component-api.md` (frequent reference)
2. Current task file (your guide)
3. Browser with dev tools

**Quick Command:**
```bash
# Search component API
grep -r "ButtonProps" 01-component-api.md

# Find pattern
grep -r "useQuery" ../02-foundation/
```

### When Stuck

**Order of operations:**
1. Check current task file (has code examples)
2. Check `02-foundation/` (learn the pattern)
3. Check `01-component-api.md` (verify API)
4. Check `02-page-designs.md` (see layout)
5. Check `planning-archive/` (historical context)

---

## 🎯 Reference vs Foundation

### Use Foundation Docs (`../02-foundation/`) when:
- ❓ Learning a new pattern
- ❓ Understanding why something works
- ❓ Need detailed explanation
- ❓ Want to see multiple examples
- **Time:** 10-30 minutes to read section

### Use Reference Docs (`./`) when:
- ✅ Quick API lookup
- ✅ Verify prop types
- ✅ Check import path
- ✅ See layout specification
- **Time:** 2-5 minutes

---

## 📖 Common Lookups

### Button Component
```typescript
// Quick reference: 01-component-api.md
import { Button } from "@/components/ui/button";

<Button
  variant="default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size="default" | "sm" | "lg" | "icon"
  onClick={handleClick}
>
  Click Me
</Button>
```

### Card Component
```typescript
// Quick reference: 01-component-api.md
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

### Data Hook Pattern
```typescript
// Quick reference: ../02-foundation/01-data-state-management.md
import { useQuery } from "@tanstack/react-query";

const { data, isLoading, error } = useQuery({
  queryKey: ['events'],
  queryFn: fetchEvents
});
```

### Form Pattern
```typescript
// Quick reference: ../02-foundation/02-component-patterns.md
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: { name: "" }
});
```

---

## 🚀 Navigation

### From Implementation Task
```
Implementing Task 07 (Dashboard Hooks)
  ↓
Need: How to structure useQuery hook?
  ↓
Look: ../02-foundation/01-data-state-management.md
  ↓
Quick check: 01-component-api.md for component usage
  ↓
Back to: Task 07 implementation
```

### From Design Work
```
Designing new page
  ↓
Check: 02-page-designs.md for layout patterns
  ↓
Verify: 01-component-api.md for components needed
  ↓
Reference: ../02-foundation/ for implementation patterns
  ↓
Build: Following patterns
```

---

## 📝 Quick Search Commands

```bash
# Find component definition
grep -r "Button" 01-component-api.md

# Find page layout
grep -r "Dashboard" 02-page-designs.md

# Find pattern example
grep -r "useQuery" ../02-foundation/

# Find planning context
grep -r "authentication" planning-archive/
```

---

## ⏰ Time Estimates

| Task | Reference Location | Time |
|------|-------------------|------|
| Look up component API | `01-component-api.md` | 2min |
| Check page layout | `02-page-designs.md` | 3min |
| Verify pattern usage | `../02-foundation/` | 5min |
| Research alternative | `planning-archive/` | 15min |

**Average lookup time:** 2-5 minutes
**Deep dive time:** 15-30 minutes

---

**Status:** Phase X - Reference (use anytime)
**Purpose:** Quick lookups during implementation
**Primary files:** `01-component-api.md`, `02-page-designs.md`
