# 📚 Reference Folder - Current Inventory

**Date:** 2025-10-19
**Total Files:** 44 markdown files
**Status:** ⚠️ Needs Organization

---

## 🔍 Current State Analysis

### Critical Issues Found

#### 1. Duplicate Files (10 files) ⚠️
Files with " 1" suffix that are exact duplicates:
- `00-EVENT-WIZARD-PRD 1.md` (duplicate of `00-EVENT-WIZARD-PRD.md`)
- `00-MASTER-PLAN 1.md` (duplicate of `00-MASTER-PLAN.md`)
- `01-PRD-EVENTOS-V3 1.md` (duplicate of `01-PRD-EVENTOS-V3.md`)
- `04-UI-COMPONENTS-PATTERNS 1.md` (duplicate of `04-UI-COMPONENTS-PATTERNS.md`)
- `13-SYSTEM-ARCHITECTURE 1.md` (duplicate of `13-SYSTEM-ARCHITECTURE.md`)

**Action:** DELETE duplicates with " 1" suffix

#### 2. Files That Belong in 01-core/ (12 files) ⚠️
These duplicate files from `01-core/`:
- `00-MASTER-PLAN.md` → exists in `01-core/`
- `01-CORE-SETUP-CHECKLIST.md` → exists in `01-core/`
- `01-FRONTEND-MASTER-PLAN.md` → exists in `01-core/`
- `01-PRD-EVENTOS-V3.md` → exists in `01-core/`
- `04-UI-COMPONENTS-PATTERNS.md` → exists in `01-core/`
- `05-IMPLEMENTATION-PHASES.md` → exists in `01-core/`
- `06-UI-COMPONENT-DIAGRAMS.md` → exists in `01-core/`
- `12-AI-EVENT-SYSTEM-REVISED-PLAN.md` → exists in `01-core/`
- `13-SYSTEM-ARCHITECTURE.md` → exists in `01-core/`
- `05-IMPLEMENTATION-ROADMAP.md` → similar to `01-core/`
- `DEVELOPMENT_ROADMAP.md` → exists in `01-core/`

**Action:** MOVE to `notes/duplicates/`

#### 3. Files That Belong in 04-event-wizard/ (2 files) ⚠️
- `00-EVENT-WIZARD-PRD.md` → duplicate from `04-event-wizard/`
- `01-ai-events.md` → belongs in `04-event-wizard/`

**Action:** MOVE to `notes/duplicates/`

#### 4. Files That Belong in mermaid/ (2 files) ⚠️
- `18-JOURNEYS.md` → user journey diagrams
- `19-DIAGRAMS.md` → system diagrams

**Action:** MOVE to `mermaid/`

---

## 📁 File Inventory by Category

### ✅ TRUE REFERENCE MATERIALS (Keep in 01-reference/)

#### Build & Deployment (3 files)
- `04-TECH-STACK.md` - Technology stack reference
- `06-BUILD-GUIDE.md` - Build instructions
- `20-BUILD_GUIDE.md` - Alternative build guide
- `21-RISKS.md` - Risk assessment

#### Product Requirements (1 file)
- `MVP-PRD.md` - MVP product requirements document

#### Analysis & Review (1 file)
- `PLAN-REVIEW-DETECTIVE-ANALYSIS.md` - Plan review analysis

**Total: 6 files to keep**

---

### 🔬 RESEARCH MATERIALS (Move to research/)

#### Competitive Analysis (3 files)
- `01-breef-design-analysis.md` - Breef design analysis
- `01-CopilotKit-Tavily-Event-Management-Analysis.md` - CopilotKit analysis
- `01-EventOS-Complete-Feature-Roadmap.md` - Complete feature roadmap

**Action:** MOVE to `research/competitive-analysis/`

---

### 🤖 AI FEATURE MATERIALS (Move to agents/)

#### AI Strategy & Planning (4 files)
- `01-AI-FEATURES-MASTER-PLAN.md` - AI features overview
- `02-MASTER-AI-FEATURES.md` - AI capabilities
- `02-NATURAL_LANGUAGE_TABLES.md` - NLP features
- `08-AI-EVENT-SYSTEM-PLAN.md` - AI event system

**Action:** MOVE to `agents/planning/`

---

### 📄 GENERAL DOCUMENTS

#### Architecture & Features (2 files)
- `002-architecture.md` - Architecture overview
- `02-features.md` - Features overview

**Action:** REVIEW and potentially move to `01-core/` or keep

---

### 📝 PROMPTS & TEMPLATES

- `002-advanced.md`
- `004-team-workflow.md`
- `005-advanced-workflows.md`
- `006-implementation-phases.md`
- `007-production-ready-checklist.md`
- `homepage-copywriting-suggestions.md`


---

## 📊 Summary

| Category | Files | Action |
|----------|-------|--------|
| **Duplicates with " 1"** | 5 | DELETE |
| **Core duplicates** | 12 | MOVE to notes/ |
| **Event wizard duplicates** | 2 | MOVE to notes/ |
| **Diagram files** | 2 | MOVE to mermaid/ |
| **Research materials** | 3 | MOVE to research/ |
| **AI materials** | 4 | MOVE to agents/ |
| **True reference** | 6 | KEEP |
| **General docs** | 2 | REVIEW |
| **Prompts** | 7 | KEEP or move to templates/ |
| **READMEs** | 2 | UPDATE |

**Total:** 44 files → Should be 6-8 files after cleanup

---

## 🎯 Recommended Actions

### Priority 1: Remove Duplicates (Immediate)
```bash
# Delete files with " 1" suffix
rm "00-EVENT-WIZARD-PRD 1.md"
rm "00-MASTER-PLAN 1.md"
rm "01-PRD-EVENTOS-V3 1.md"
rm "04-UI-COMPONENTS-PATTERNS 1.md"
rm "13-SYSTEM-ARCHITECTURE 1.md"
```

### Priority 2: Move Misplaced Files (High)
```bash
# Move core duplicates to notes
mv 00-MASTER-PLAN.md ../notes/duplicates/
mv 01-CORE-SETUP-CHECKLIST.md ../notes/duplicates/
# ... (all core duplicates)

# Move event wizard files to notes
mv 00-EVENT-WIZARD-PRD.md ../notes/duplicates/
mv 01-ai-events.md ../notes/duplicates/

# Move diagrams to mermaid
mv 18-JOURNEYS.md ../mermaid/
mv 19-DIAGRAMS.md ../mermaid/
```

### Priority 3: Organize by Type (Medium)
```bash
# Create research subfolder
mkdir -p ../research/competitive-analysis
mv 01-breef-design-analysis.md ../research/competitive-analysis/
mv 01-CopilotKit-Tavily-Event-Management-Analysis.md ../research/competitive-analysis/
mv 01-EventOS-Complete-Feature-Roadmap.md ../research/competitive-analysis/

# Move AI materials
mkdir -p ../agents/planning
mv 01-AI-FEATURES-MASTER-PLAN.md ../agents/planning/
mv 02-MASTER-AI-FEATURES.md ../agents/planning/
mv 02-NATURAL_LANGUAGE_TABLES.md ../agents/planning/
mv 08-AI-EVENT-SYSTEM-PLAN.md ../agents/planning/
```

### Priority 4: Final Structure (Low)
```bash
# Final clean reference folder should contain:
01-reference/
├── 00-REFERENCE-INDEX.md (this file)
├── 04-TECH-STACK.md
├── 06-BUILD-GUIDE.md
├── 20-BUILD_GUIDE.md
├── 21-RISKS.md
├── MVP-PRD.md
├── PLAN-REVIEW-DETECTIVE-ANALYSIS.md
├── 002-architecture.md (review)
├── 02-features.md (review)
├── prompts/
└── README.md (updated)
```

---

## ✅ Expected Result

**Before:** 44 files (many duplicates and misplaced)
**After:** 6-10 core reference files + prompts folder
**Reduction:** 75-80% fewer files in this folder
**Organization:** Clean, focused, true reference materials only

---

## 🚀 Next Steps

1. **Create backup** of current state
2. **Delete duplicates** with " 1" suffix
3. **Move misplaced files** to correct folders
4. **Update README** with new structure
5. **Create index** of remaining files

---

**Created:** 2025-10-19
**Last Updated:** 2025-10-19
**Status:** Analysis Complete - Ready for Cleanup
