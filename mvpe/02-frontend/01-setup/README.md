# ⚙️ Phase 0: Setup & Configuration

**Duration:** 8 hours (Day 0)
**When:** Before any development starts
**Goal:** Working development environment with Supabase connection

---

## 📋 Setup Checklist

### Prerequisites
- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] Code editor (VS Code recommended)
- [ ] Supabase account created

### Phase 0 Tasks
- [ ] **Task 1:** Read setup guide (`01-setup-guide.md`)
- [ ] **Task 2:** Install dependencies
- [ ] **Task 3:** Configure environment variables
- [ ] **Task 4:** Start development server
- [ ] **Task 5:** Verify Supabase connection
- [ ] **Task 6:** Review architecture overview
- [ ] **Task 7:** Check tech stack reference

---

## 📁 Files in This Phase

### 01-setup-guide.md (2 hours)
**Purpose:** Step-by-step environment setup

**Contains:**
- Installation instructions
- Environment configuration
- Supabase setup
- Development server start
- Troubleshooting guide

**When to read:** First thing, before any code

---

### 02-architecture-overview.md (1 hour)
**Purpose:** Understand system architecture

**Contains:**
- React 18 + Vite architecture
- Provider tree structure
- Routing architecture
- Data flow patterns
- Testing strategy

**When to read:** After setup, before building

---

### 03-tech-stack-reference.md (30 minutes)
**Purpose:** Quick reference for all technologies

**Contains:**
- Framework versions
- Library purposes
- Common patterns
- Quick commands

**When to read:** As needed during development

---

## 🎯 Phase Completion Criteria

You're ready to move to Phase 1 when:

- ✅ `npm run dev` starts server without errors
- ✅ Browser shows app at http://localhost:5173
- ✅ Can query Supabase in browser console:
  ```javascript
  const { data } = await supabase.from('events').select('*')
  console.log(data) // Shows events
  ```
- ✅ Environment variables configured (`.env` file)
- ✅ Understand high-level architecture
- ✅ Know where to find documentation

---

## 🔧 Quick Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Type check
npm run type-check

# Lint
npm run lint
```

---

## 🚨 Troubleshooting

### Server won't start
- Check Node version: `node --version` (need 18+)
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check port 5173 is available

### Supabase connection fails
- Verify `.env` file exists
- Check `VITE_SUPABASE_URL` is correct
- Check `VITE_SUPABASE_PUBLISHABLE_KEY` is correct
- Restart dev server after `.env` changes

### TypeScript errors
- Run: `npm run type-check`
- Verify `@types/*` packages installed
- Check `tsconfig.json` is present

---

## ⏭️ Next Phase

Once setup is complete:
→ **Go to:** `../02-foundation/README.md`
→ **Goal:** Learn core patterns before building features
→ **Time:** 1 week (16 hours)

---

**Status:** Phase 0 - Setup & Configuration
**Next:** Phase 1 - Foundation Patterns
