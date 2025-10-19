# Plugin Setup Audit Report
**Date**: 2025-10-19
**Project**: EventOS (event-studio)
**Auditor**: Claude Code Analysis

---

## Executive Summary

Your plugin setup has **5 critical issues** and **3 warnings** that need attention. While Skills are correctly configured, there are problems with plugin manifests, directory structure confusion, and invalid JSON files.

**Status**: 🔴 **Requires Immediate Attention**

---

## Critical Issues

### 1. 🔴 **Invalid Plugin Manifest (plugin.json)**
**Location**: `/home/sk/event-studio/.claude-plugin/plugin.json`

**Issue**: The plugin.json file contains shell EOF markers and is malformed:
```json
{
"name": "my-first-plugin",
"description": "A simple greeting plugin to learn the basics",
"version": "1.0.0",
"author": {
"name": "Your Name"
}
}
EOF
```

**Impact**: This will cause plugin loading to fail completely.

**Required Fix**:
- Remove the `EOF` line from the file
- Update `author.name` from placeholder "Your Name" to actual author
- Ensure valid JSON formatting

---

### 2. 🔴 **Invalid Command File (hello.md)**
**Location**: `/home/sk/event-studio/commands/hello.md`

**Issue**: Command file contains EOF marker:
```markdown
---
description: Greet the user with a personalized message
---

# Hello Command

Greet the user warmly and ask how you can help them today. Make the greeting personal and encouraging.
EOF
```

**Impact**: Command may not parse correctly.

**Required Fix**: Remove the `EOF` line

---

### 3. 🔴 **Confusing Directory Structure**
**Current Structure**:
```
event-studio/  (project root)
├── .claude-plugin/          ⚠️ Plugin manifest at root
│   └── plugin.json
├── commands/                 ⚠️ Commands at root
│   └── hello.md
├── .claude/                  ✅ Project-level customization
│   ├── commands/
│   ├── agents/
│   └── skills/
└── .mcp.json                ✅ Project-level MCP servers
```

**Issue**: You have BOTH:
- A plugin structure at root (`.claude-plugin/`, `commands/`)
- Project-level customization in `.claude/`

**Impact**: Confusion about whether this is a plugin or a project with customizations.

**Analysis**:
- If this is meant to be a **plugin for distribution**: Root-level structure is correct
- If this is your **project with customizations**: `.claude/` is correct, root plugin structure should be removed
- **Current state**: Mixed setup suggesting incomplete tutorial cleanup

---

### 4. 🔴 **Missing Plugin Components**
If this IS a plugin (based on root `.claude-plugin/` directory):

**Missing**:
- No `agents/` directory at root (only in `.claude/`)
- No `skills/` directory at root (only in `.claude/`)
- No `hooks/` configuration
- No `.mcp.json` referenced in plugin.json

**Impact**: Plugin would only provide the hello command, nothing else.

---

### 5. 🔴 **MCP Server Configuration Mismatch**

**Current**: `.mcp.json` at project root (✅ correct for project-level)
**Enabled in settings**: Only subset of servers enabled

```json
// .claude/settings.local.json
"enabledMcpjsonServers": [
  "task-master-ai",
  "desktop-commander",
  "chrome-devtools",
  "supabase"
]
```

**Missing from enabled list**:
- `playwright` (defined in .mcp.json but not enabled)
- `vercel-event-studio` (defined in .mcp.json but not enabled)

**Impact**: These MCP servers won't be loaded even though configured.

---

## Warnings

### ⚠️ 1. **Plugin Naming**
The root plugin is named "my-first-plugin" - this appears to be from a tutorial and should be renamed to something meaningful for your project.

### ⚠️ 2. **Redundant Command Definitions**
You have commands in TWO locations:
- `/home/sk/event-studio/commands/` (plugin level)
- `/home/sk/event-studio/.claude/commands/` (project level)

This may cause conflicts or confusion.

### ⚠️ 3. **Redundant Agent Definitions**
Similarly, agents exist only in `.claude/agents/` but not at plugin root, creating inconsistency.

---

## What's Working Correctly ✅

### 1. **Skills Configuration**
Your Skills are properly structured in `.claude/skills/`:
- ✅ `supabase-react-best-practices/SKILL.md`
- ✅ `db-schema-analyzer/SKILL.md`
- ✅ `frontend-dashboard/SKILL.md`
- ✅ `playwright-e2e-skill/SKILL.md`

**Status**: All Skills follow correct directory structure

### 2. **Project-Level Agents**
Agents in `.claude/agents/` are correctly structured:
- ✅ `supabase-mcp.md`
- ✅ `task-orchestrator.md`
- ✅ `task-executor.md`
- ✅ `task-checker.md`

### 3. **MCP Configuration Format**
Your `.mcp.json` syntax is valid and properly structured.

### 4. **Settings Configuration**
`.claude/settings.local.json` uses correct schema for permissions and MCP server enablement.

---

## Recommended Actions

### Option A: This is a PROJECT (Not a Plugin) - RECOMMENDED

If you're just customizing Claude Code for this project, not creating a distributable plugin:

1. **DELETE** the root-level plugin artifacts:
   ```bash
   rm -rf .claude-plugin/
   rm -rf commands/
   ```

2. **Keep** everything in `.claude/`:
   - `.claude/skills/` ✅
   - `.claude/commands/` ✅
   - `.claude/agents/` ✅
   - `.claude/settings.local.json` ✅

3. **Enable all MCP servers** in `.claude/settings.local.json`:
   ```json
   "enabledMcpjsonServers": [
     "task-master-ai",
     "desktop-commander",
     "chrome-devtools",
     "supabase",
     "playwright",
     "vercel-event-studio"
   ]
   ```

### Option B: This IS a Plugin for Distribution

If you intend to create a distributable plugin:

1. **Fix** `.claude-plugin/plugin.json`:
   - Remove EOF marker
   - Update author name
   - Add proper metadata

2. **Move or configure** components:
   ```json
   // In plugin.json, add:
   {
     "name": "eventos-plugin",
     "version": "1.0.0",
     "description": "EventOS development tools",
     "author": {
       "name": "Your Actual Name"
     },
     "commands": ["./commands/"],
     "agents": ["./.claude/agents/"],
     "skills": ["./.claude/skills/"],
     "mcpServers": "./.mcp.json"
   }
   ```

3. **Create proper structure**:
   ```
   event-studio/ (plugin root)
   ├── .claude-plugin/
   │   └── plugin.json (FIXED)
   ├── commands/
   │   └── hello.md (FIXED)
   ├── agents/ (MOVE from .claude/agents/)
   ├── skills/ (MOVE from .claude/skills/)
   └── .mcp.json
   ```

---

## Environment Variable Usage

Your MCP server configs should use `${CLAUDE_PLUGIN_ROOT}` if they reference plugin-local files. Currently not applicable since .mcp.json servers use external commands (npx).

---

## Testing Recommendations

After fixes, validate with:

```bash
# Validate plugin structure (if Option B)
claude plugin validate /home/sk/event-studio

# Test MCP server connections
# (restart Claude Code and check MCP tools are available)

# Verify Skills load
# (use a Skill-appropriate task and verify Claude can invoke it)
```

---

## Summary Table

| Component | Location | Status | Action Needed |
|-----------|----------|--------|---------------|
| Skills | `.claude/skills/` | ✅ Correct | None |
| Agents (project) | `.claude/agents/` | ✅ Correct | None |
| Commands (project) | `.claude/commands/` | ✅ Correct | None |
| Plugin manifest | `.claude-plugin/plugin.json` | 🔴 Invalid | Fix or Delete |
| Commands (plugin) | `commands/hello.md` | 🔴 Invalid | Fix or Delete |
| MCP config | `.mcp.json` | ⚠️ Partial | Enable all servers |
| Settings | `.claude/settings.local.json` | ✅ Valid | Update MCP list |

---

## Conclusion

**Primary Recommendation**: Follow **Option A** (treat as project, not plugin).

Your current setup suggests you started following a plugin tutorial but are actually just customizing Claude Code for your EventOS project. Clean up the root-level plugin artifacts and work exclusively within the `.claude/` directory for project-level customizations.

**Next Steps**:
1. Decide: Plugin or Project?
2. Follow remediation steps for your choice
3. Test thoroughly after changes
4. Document your setup in project README

---

**Questions?** Review:
- [Plugins Guide](https://docs.claude.com/en/docs/claude-code/plugins)
- [Plugin Reference](https://docs.claude.com/en/docs/claude-code/plugins-reference)
- [Skills Guide](https://docs.claude.com/en/docs/claude-code/skills)
