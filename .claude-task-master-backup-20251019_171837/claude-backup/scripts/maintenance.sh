#!/usr/bin/env bash

# Claude Skills & Agents Maintenance Script
# Purpose: Monthly maintenance tasks

set -e

echo "🔧 Claude Skills & Agents Maintenance"
echo "====================================="
echo ""

# Function to get file modification dates
get_mod_date() {
    if [ -f "$1" ]; then
        stat -c %y "$1" 2>/dev/null || stat -f %Sm "$1" 2>/dev/null || echo "Unknown"
    else
        echo "File not found"
    fi
}

echo "📊 Maintenance Report - $(date)"
echo "================================"
echo ""

echo "📁 Skills Status:"
echo "----------------"
for skill_dir in .claude/skills/*; do
    if [ -d "$skill_dir" ]; then
        skill_name=$(basename "$skill_dir")
        mod_date=$(get_mod_date "$skill_dir/SKILL.md")
        echo "  $skill_name: Last modified $mod_date"
    fi
done

echo ""
echo "🤖 Agents Status:"
echo "----------------"
for agent_file in .claude/agents/*.md; do
    if [ -f "$agent_file" ]; then
        agent_name=$(basename "$agent_file" .md)
        mod_date=$(get_mod_date "$agent_file")
        echo "  $agent_name: Last modified $mod_date"
    fi
done

echo ""
echo "🔍 Validation Status:"
echo "--------------------"
if .claude/scripts/validate-all.sh; then
    echo "✅ All validations passed"
else
    echo "❌ Some validations failed - review output above"
fi

echo ""
echo "📋 Maintenance Checklist:"
echo "------------------------"
echo "  [ ] Review any validation failures"
echo "  [ ] Update documentation if needed"
echo "  [ ] Check for new integration opportunities"
echo "  [ ] Verify all skills are still relevant"
echo "  [ ] Test agent workflows"
echo "  [ ] Update cross-references if new skills added"
echo ""
echo "✅ Maintenance completed!"
