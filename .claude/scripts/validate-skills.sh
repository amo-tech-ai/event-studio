#!/usr/bin/env bash

# Skill Validation Script
# Purpose: Validate all skills have proper structure and documentation

set -e

echo "🔍 Validating Claude Skills Structure..."
echo "========================================"

SKILLS_DIR=".claude/skills"
VALIDATION_PASSED=true

# Function to validate a skill
validate_skill() {
    local skill_dir="$1"
    local skill_name=$(basename "$skill_dir")
    
    echo "Validating skill: $skill_name"
    
    # Check required files
    local required_files=("SKILL.md" "README.md")
    for file in "${required_files[@]}"; do
        if [ ! -f "$skill_dir/$file" ]; then
            echo "❌ Missing required file: $skill_dir/$file"
            VALIDATION_PASSED=false
        else
            echo "✅ Found: $file"
        fi
    done
    
    # Check resources directory
    if [ ! -d "$skill_dir/resources" ]; then
        echo "⚠️  No resources directory found (optional but recommended)"
    else
        echo "✅ Found: resources directory"
    fi
    
    # Check README.md has required sections
    if [ -f "$skill_dir/README.md" ]; then
        if grep -q "## Purpose" "$skill_dir/README.md"; then
            echo "✅ README.md has Purpose section"
        else
            echo "❌ README.md missing Purpose section"
            VALIDATION_PASSED=false
        fi
        
        if grep -q "## When to Use" "$skill_dir/README.md"; then
            echo "✅ README.md has When to Use section"
        else
            echo "❌ README.md missing When to Use section"
            VALIDATION_PASSED=false
        fi
    fi
    
    echo ""
}

# Validate all skills
if [ -d "$SKILLS_DIR" ]; then
    for skill_dir in "$SKILLS_DIR"/*; do
        if [ -d "$skill_dir" ]; then
            validate_skill "$skill_dir"
        fi
    done
else
    echo "❌ Skills directory not found: $SKILLS_DIR"
    VALIDATION_PASSED=false
fi

# Final result
echo "========================================"
if [ "$VALIDATION_PASSED" = true ]; then
    echo "✅ All skills validation passed!"
    exit 0
else
    echo "❌ Some skills failed validation"
    exit 1
fi
