#!/usr/bin/env bash

# Agent Validation Script
# Purpose: Validate all agents have proper structure and documentation

set -e

echo "🤖 Validating Claude Agents Structure..."
echo "========================================"

AGENTS_DIR=".claude/agents"
VALIDATION_PASSED=true

# Function to validate an agent
validate_agent() {
    local agent_file="$1"
    local agent_name=$(basename "$agent_file" .md)
    
    echo "Validating agent: $agent_name"
    
    # Check required sections in agent file
    if [ -f "$agent_file" ]; then
        if grep -q "name:" "$agent_file"; then
            echo "✅ Has name field"
        else
            echo "❌ Missing name field"
            VALIDATION_PASSED=false
        fi
        
        if grep -q "description:" "$agent_file"; then
            echo "✅ Has description field"
        else
            echo "❌ Missing description field"
            VALIDATION_PASSED=false
        fi
        
        if grep -q "## Core Responsibilities" "$agent_file"; then
            echo "✅ Has Core Responsibilities section"
        else
            echo "❌ Missing Core Responsibilities section"
            VALIDATION_PASSED=false
        fi
        
        if grep -q "## " "$agent_file"; then
            echo "✅ Has additional documentation sections"
        else
            echo "⚠️  Limited documentation sections"
        fi
    else
        echo "❌ Agent file not found: $agent_file"
        VALIDATION_PASSED=false
    fi
    
    echo ""
}

# Validate all agents
if [ -d "$AGENTS_DIR" ]; then
    for agent_file in "$AGENTS_DIR"/*.md; do
        if [ -f "$agent_file" ]; then
            validate_agent "$agent_file"
        fi
    done
else
    echo "❌ Agents directory not found: $AGENTS_DIR"
    VALIDATION_PASSED=false
fi

# Final result
echo "========================================"
if [ "$VALIDATION_PASSED" = true ]; then
    echo "✅ All agents validation passed!"
    exit 0
else
    echo "❌ Some agents failed validation"
    exit 1
fi
