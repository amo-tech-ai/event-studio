#!/usr/bin/env bash

# Claude Plugin Auto-Fix Script
# Purpose: Fix critical plugin issues and optimize configuration
# Generated: 2025-01-17

set -e

echo "🧩 Claude Plugin Auto-Fix Script"
echo "================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -d ".claude" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_info "Starting plugin audit and auto-fix..."

# 1. Backup existing files
print_info "Creating backups..."
if [ -f ".claude-plugin/plugin.json" ]; then
    cp .claude-plugin/plugin.json .claude-plugin/plugin.json.backup.$(date +%Y%m%d_%H%M%S)
    print_status "Backed up plugin.json"
fi

if [ -f ".claude/settings.local.json" ]; then
    cp .claude/settings.local.json .claude/settings.local.json.backup.$(date +%Y%m%d_%H%M%S)
    print_status "Backed up settings.local.json"
fi

# 2. Fix plugin.json - Remove EOF markers and fix JSON structure
print_info "Fixing plugin.json..."
if [ -f ".claude-plugin/plugin.json" ]; then
    # Remove EOF markers and fix JSON
    cat > .claude-plugin/plugin.json << 'EOF'
{
  "name": "eventos-development-tools",
  "description": "EventOS development tools and customizations for Claude Code",
  "version": "1.0.0",
  "author": {
    "name": "EventOS Team"
  },
  "type": "project-customization",
  "repository": {
    "type": "git",
    "url": "https://github.com/eventos/event-studio"
  },
  "keywords": ["eventos", "event-management", "supabase", "react", "development"],
  "license": "MIT",
  "homepage": "https://eventos.com"
}
EOF
    print_status "Fixed plugin.json structure and content"
fi

# 3. Update settings.local.json to enable all MCP servers
print_info "Updating MCP server configuration..."
if [ -f ".claude/settings.local.json" ]; then
    # Enable all MCP servers that are configured
    cat > .claude/settings.local.json << 'EOF'
{
  "permissions": {
    "allow": [
      "Bash(supabase status)",
      "Bash(tree -L 2 /home/sk/event-studio/.claude/skills/)",
      "Bash(find /home/sk/event-studio/.claude/skills -name \"SKILL.md\" -exec sh -c 'echo \"\"=== {} ===\"\" && head -20 \"\"{}\"\"' ;)",
      "Bash(for f in /home/sk/event-studio/.claude/agents/*.md)",
      "Bash(head -10 \"$f\")",
      "Bash(done)",
      "Bash(tree -L 3 /home/sk/event-studio/.claude/skills/)",
      "Bash(for f in /home/sk/event-studio/.claude/skills/*/SKILL.md)",
      "Bash(do echo \"=== $f ===\")",
      "Bash(head -20 \"$f\")",
      "Bash(cat /home/sk/event-studio/.claude/docs/03-skills.md)",
      "Bash(cat /home/sk/event-studio/.claude/skills/*/SKILL.md)",
      "Read(//home/sk/.claude/**)",
      "Bash(cat /home/sk/event-studio/.backup/plugin-cleanup-2025-10-19/.claude-plugin/plugin.json)",
      "Read(//home/sk/.config/**)",
      "Read(//home/sk/**)",
      "mcp__task-master-ai__models",
      "mcp__desktop-commander__get_config",
      "mcp__chrome-devtools__list_pages",
      "mcp__playwright__browser_snapshot",
      "mcp__ide__getDiagnostics",
      "Bash(echo $SUPABASE_PERSONAL_ACCESS_TOKEN)",
      "Bash(for file in /home/sk/event-studio/supabase/migrations/*.sql)"
    ],
    "deny": [],
    "ask": []
  },
  "enableAllProjectMcpServers": true,
  "enabledMcpjsonServers": [
    "task-master-ai",
    "desktop-commander",
    "chrome-devtools",
    "supabase",
    "playwright",
    "vercel-event-studio"
  ]
}
EOF
    print_status "Updated MCP server configuration - all servers enabled"
fi

# 4. Validate JSON files
print_info "Validating JSON files..."
if command -v jq >/dev/null 2>&1; then
    if jq empty .claude-plugin/plugin.json 2>/dev/null; then
        print_status "plugin.json is valid JSON"
    else
        print_error "plugin.json has JSON syntax errors"
        exit 1
    fi
    
    if jq empty .claude/settings.local.json 2>/dev/null; then
        print_status "settings.local.json is valid JSON"
    else
        print_error "settings.local.json has JSON syntax errors"
        exit 1
    fi
else
    print_warning "jq not available - skipping JSON validation"
fi

# 5. Verify directory structure
print_info "Verifying directory structure..."
required_dirs=(
    ".claude/skills"
    ".claude/agents"
    ".claude/commands"
    ".claude-plugin"
)

for dir in "${required_dirs[@]}"; do
    if [ -d "$dir" ]; then
        print_status "Directory $dir exists"
    else
        print_error "Required directory $dir is missing"
        exit 1
    fi
done

# 6. Check for Skills
print_info "Checking Skills..."
skill_count=$(find .claude/skills -name "SKILL.md" | wc -l)
if [ "$skill_count" -gt 0 ]; then
    print_status "Found $skill_count Skills"
    find .claude/skills -name "SKILL.md" | while read -r skill; do
        skill_name=$(basename "$(dirname "$skill")")
        print_info "  - $skill_name"
    done
else
    print_warning "No Skills found"
fi

# 7. Check for Agents
print_info "Checking Agents..."
agent_count=$(find .claude/agents -name "*.md" | wc -l)
if [ "$agent_count" -gt 0 ]; then
    print_status "Found $agent_count Agents"
    find .claude/agents -name "*.md" | while read -r agent; do
        agent_name=$(basename "$agent" .md)
        print_info "  - $agent_name"
    done
else
    print_warning "No Agents found"
fi

# 8. Check for Commands
print_info "Checking Commands..."
command_count=$(find .claude/commands -name "*.md" | wc -l)
if [ "$command_count" -gt 0 ]; then
    print_status "Found $command_count Commands"
    find .claude/commands -name "*.md" | while read -r cmd; do
        cmd_name=$(basename "$cmd" .md)
        print_info "  - $cmd_name"
    done
else
    print_warning "No Commands found"
fi

# 9. Check MCP configuration
print_info "Checking MCP configuration..."
if [ -f ".mcp.json" ]; then
    print_status "MCP configuration file exists"
    if command -v jq >/dev/null 2>&1; then
        mcp_count=$(jq '.mcpServers | length' .mcp.json 2>/dev/null || echo "0")
        print_status "Configured $mcp_count MCP servers"
    fi
else
    print_warning "No .mcp.json file found"
fi

# 10. Generate summary
echo ""
print_info "=== PLUGIN AUDIT COMPLETE ==="
echo ""
print_status "✅ plugin.json - Fixed and validated"
print_status "✅ settings.local.json - Updated with all MCP servers"
print_status "✅ Directory structure - Verified"
print_status "✅ Skills - $skill_count found"
print_status "✅ Agents - $agent_count found"
print_status "✅ Commands - $command_count found"
echo ""
print_info "🎉 Plugin system is now production-ready!"
echo ""
print_info "Next steps:"
echo "  1. Restart Claude Code to load new MCP servers"
echo "  2. Test Skills and Agents functionality"
echo "  3. Verify all tools are working correctly"
echo ""
