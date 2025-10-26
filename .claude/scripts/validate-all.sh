#!/usr/bin/env bash

# Comprehensive Validation Script
# Purpose: Validate entire Claude Skills & Agents ecosystem

set -e

echo "🔍 Comprehensive Claude Skills & Agents Validation"
echo "=================================================="
echo ""

# Run skill validation
echo "1. Validating Skills..."
echo "----------------------"
if .claude/scripts/validate-skills.sh; then
    echo "✅ Skills validation passed"
else
    echo "❌ Skills validation failed"
    exit 1
fi

echo ""
echo "2. Validating Agents..."
echo "----------------------"
if .claude/scripts/validate-agents.sh; then
    echo "✅ Agents validation passed"
else
    echo "❌ Agents validation failed"
    exit 1
fi

echo ""
echo "3. Checking Integration..."
echo "-------------------------"

# Check for cross-references
echo "Checking cross-references between skills..."
if grep -q "Related Skills" .claude/skills/*/README.md; then
    echo "✅ Cross-references found"
else
    echo "⚠️  No cross-references found"
fi

echo ""
echo "=================================================="
echo "✅ Comprehensive validation completed successfully!"
echo ""
echo "Next steps:"
echo "- Review any warnings above"
echo "- Test skills and agents in your workflow"
echo "- Run this validation monthly"
