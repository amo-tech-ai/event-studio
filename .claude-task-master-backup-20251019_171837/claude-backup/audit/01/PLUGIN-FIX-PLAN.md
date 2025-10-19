# Plugin Setup Fix Plan - EventOS

## Core Problem Identified

**You have a HYBRID setup that's causing confusion:**
- Tutorial plugin artifacts at root (`.claude-plugin/`, `commands/`) ← **WRONG for your use case**
- Project customizations in `.claude/` ← **CORRECT for your use case**
- Invalid JSON files with shell EOF markers ← **Breaking functionality**
- Not all MCP servers enabled ← **Missing tools**

**What you actually need**: Project-level customizations, NOT a distributable plugin.

---

## Step-by-Step Solution

### Phase 1: Backup & Clean
1. Backup invalid files (for reference)
2. Remove root-level plugin artifacts
3. Clean up tutorial leftovers

### Phase 2: Configure Correctly
4. Update settings.local.json with all MCP servers
5. Verify Skills structure
6. Verify Agents structure
7. Verify Commands structure

### Phase 3: Validate & Test
8. Validate JSON files
9. Test MCP server availability
10. Verify Skills are loadable
11. Create production-ready status report

---

## Execution Starting...
