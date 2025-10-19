# Claude Skills Detective Prompts

**Three simple prompts** for Claude Code to set up, verify, and audit your Claude Skills.
**Validated:** 2025-10-19 | **Status:** Production-ready | **Tested:** ✅

---

## 🧩 1) Setup Prompt — "Create or Initialize Claude Skills Setup"

**Goal:** Help Claude Code generate the correct Skills folder and starter files.

```
Create or set up my Claude Skills environment following official best practices:
- Create .claude/skills/ folders and SKILL.md templates.
- Include correct YAML front-matter (name + description only).
- Add concise, action-oriented examples (under 500 lines).
- Follow official docs: https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview and /best-practices.
- Explain when, how, and why to use Skills in development.
- Summarize benefits, typical use cases, and example workflows.
Output a ready-to-use folder structure and a short checklist for testing the Skills.
```

**When to use:** Starting a new project or adding Skills for the first time.

---

## 🔍 2) Validation Prompt — "Verify and Validate Claude Skills Setup"

**Goal:** Ask Claude Code to examine existing Skills and check correctness.

```
Inspect and validate all Claude Skills in my workspace (.claude/skills/*/SKILL.md):
- Verify YAML front-matter: name + description within limits (64 chars / 1024 chars).
- Validate against official Anthropic Skill structure and best practices.
- Check conciseness, naming conventions, description clarity, and progressive disclosure.
- Identify missing files, broken links, or bad references.
- Confirm scripts follow error-handling and "solve-don't-punt" principles.
- Detect any time-sensitive or outdated content.
Output a Markdown audit report with:
1) Pass/fail per Skill
2) Errors or red flags
3) Fix suggestions
4) Overall readiness %
```

**When to use:** After creating or modifying skills, before deployment.

---

## 🕵️‍♂️ 3) Audit & Troubleshoot Prompt — "Full Claude Skills Health Check"

**Goal:** Deep detective audit for structure, correctness, and production readiness.

```
Perform a full Claude Skills audit:
- Examine all SKILL.md files in .claude/skills/, scripts, and references.
- Validate structure, folder naming, and file links.
- Cross-check with official documentation and checklist standards.
- Identify configuration issues, missing dependencies, or anti-patterns.
- Rate readiness (0–100%), note critical vs minor issues.
- Provide concrete fixes and troubleshooting steps to reach production-ready status.
Keep it simple, clear, and actionable. Summarize results in a short Markdown table.
```

**When to use:** Production readiness checks, debugging issues, or comprehensive audits.

---

## ✅ How to Use

**In Claude Code CLI:**
1. Copy one of the prompts above
2. Paste it directly into Claude Code chat
3. Claude will analyze your `.claude/skills/` directory
4. Follow the recommendations to fix any issues

**Example workflow:**
```bash
# First time setup
→ Use Prompt #1

# After changes
→ Use Prompt #2

# Before production
→ Use Prompt #3
```

---

## 📊 What We Tested (EventOS Project)

| Prompt | What It Checked | Result |
|--------|----------------|--------|
| #1 Setup | N/A (skills already exist) | - |
| #2 Validation | 4 skills, frontmatter, structure | Found 1 critical issue |
| #3 Full Audit | Complete health check | 85% → 100% after fixes |

**Issues Found:**
- ❌ Extra frontmatter fields (version, author, tags)
- ⚠️ Missing README.md files
- ⚠️ Empty scripts directory

**All Fixed:** ✅ Now 100% production ready

---

## 🎯 Key Differences from User-Provided Prompts

**Original prompts referenced:** `/skills` or `skills/`
**Corrected to:** `.claude/skills/` (official location)

**Why it matters:**
- Claude Code looks for skills in `.claude/skills/` by default
- Wrong path = skills won't be discovered
- Official Anthropic specification uses `.claude/` prefix

---

## 📚 Official References

- [Agent Skills Overview](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview)
- [Best Practices](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices)
- [Skills Cookbook](https://github.com/anthropics/claude-cookbooks/tree/main/skills)

---

## 💡 Pro Tips

1. **Start with Prompt #2** if you have existing skills
2. **Use Prompt #3** for production deployments
3. **Character limits matter:** name ≤ 64, description ≤ 1024
4. **Only two frontmatter fields:** `name` and `description`
5. **Keep SKILL.md concise:** Under 5k tokens recommended

---

**Last Updated:** 2025-10-19
**Tested On:** EventOS project (4 skills, 100% production ready)
