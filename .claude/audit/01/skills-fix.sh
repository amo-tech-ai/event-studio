#!/usr/bin/env bash

# Claude Skills & Agents Auto-Fix Script
# Purpose: Implement recommended improvements from audit report
# Generated: 2025-01-17

set -e

echo "🧩 Claude Skills & Agents Auto-Fix Script"
echo "=========================================="
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

print_info "Starting skills and agents optimization..."

# 1. Add cross-references between related skills
print_info "Adding cross-references between related skills..."

# Add cross-reference to supabase-react-best-practices
cat >> .claude/skills/supabase-react-best-practices/README.md << 'EOF'

## Related Skills

- **db-schema-analyzer**: For database design validation and schema analysis
- **frontend-dashboard**: For dashboard-specific React patterns and components

EOF

# Add cross-reference to frontend-dashboard
cat >> .claude/skills/frontend-dashboard/README.md << 'EOF'

## Related Skills

- **supabase-react-best-practices**: For general Supabase + React integration patterns
- **playwright-e2e-skill**: For testing dashboard functionality

EOF

# Add cross-reference to db-schema-analyzer
cat >> .claude/skills/db-schema-analyzer/README.md << 'EOF'

## Related Skills

- **supabase-react-best-practices**: For implementing React patterns with analyzed schemas
- **frontend-dashboard**: For building dashboards with validated database structures

EOF

# Add cross-reference to playwright-e2e-skill
cat >> .claude/skills/playwright-e2e-skill/README.md << 'EOF'

## Related Skills

- **frontend-dashboard**: For testing dashboard components and functionality
- **supabase-react-best-practices**: For testing Supabase integration patterns

EOF

print_status "Added cross-references between related skills"

# 2. Enhance task-checker agent with testing capabilities
print_info "Enhancing task-checker agent with testing capabilities..."

# Create a backup of the original task-checker
cp .claude/agents/task-checker.md .claude/agents/task-checker.md.backup

# Add testing capabilities to task-checker
cat >> .claude/agents/task-checker.md << 'EOF'

## Integration with Testing Skills

### Automated Testing Verification
When verifying implementations, consider using:

1. **playwright-e2e-skill**: For end-to-end testing verification
   - Run smoke tests after implementation
   - Validate user flows and functionality
   - Check for regression issues

2. **Integration Testing**: 
   - Verify API endpoints work correctly
   - Test database connections and queries
   - Validate authentication flows

### Testing Workflow Enhancement
```bash
# After implementation verification, run:
# 1. Unit tests
npm test

# 2. Integration tests (if applicable)
npm run test:integration

# 3. E2E smoke tests (using playwright-e2e-skill)
# This would be coordinated with the playwright-e2e-skill
```

EOF

print_status "Enhanced task-checker agent with testing capabilities"

# 3. Create skill validation script
print_info "Creating skill validation script..."

cat > .claude/scripts/validate-skills.sh << 'EOF'
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
EOF

chmod +x .claude/scripts/validate-skills.sh
print_status "Created skill validation script"

# 4. Create agent validation script
print_info "Creating agent validation script..."

cat > .claude/scripts/validate-agents.sh << 'EOF'
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
EOF

chmod +x .claude/scripts/validate-agents.sh
print_status "Created agent validation script"

# 5. Create comprehensive validation script
print_info "Creating comprehensive validation script..."

cat > .claude/scripts/validate-all.sh << 'EOF'
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
EOF

chmod +x .claude/scripts/validate-all.sh
print_status "Created comprehensive validation script"

# 6. Create maintenance script
print_info "Creating maintenance script..."

cat > .claude/scripts/maintenance.sh << 'EOF'
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
EOF

chmod +x .claude/scripts/maintenance.sh
print_status "Created maintenance script"

# 7. Create directory for scripts if it doesn't exist
mkdir -p .claude/scripts
print_status "Created scripts directory"

# 8. Run validation to ensure everything is working
print_info "Running validation to ensure fixes are working..."

if .claude/scripts/validate-all.sh; then
    print_status "All validations passed after fixes"
else
    print_warning "Some validations failed - please review"
fi

# 9. Summary
echo ""
echo "🎉 Skills & Agents Auto-Fix Complete!"
echo "====================================="
echo ""
echo "✅ Completed improvements:"
echo "  1. Added cross-references between related skills"
echo "  2. Enhanced task-checker agent with testing capabilities"
echo "  3. Created skill validation script"
echo "  4. Created agent validation script"
echo "  5. Created comprehensive validation script"
echo "  6. Created maintenance script"
echo ""
echo "📋 Next steps:"
echo "  - Run .claude/scripts/validate-all.sh monthly"
echo "  - Use .claude/scripts/maintenance.sh for regular maintenance"
echo "  - Test the enhanced task-checker agent"
echo "  - Review cross-references and update as needed"
echo ""
echo "🔗 Scripts created:"
echo "  - .claude/scripts/validate-skills.sh"
echo "  - .claude/scripts/validate-agents.sh"
echo "  - .claude/scripts/validate-all.sh"
echo "  - .claude/scripts/maintenance.sh"
echo ""
print_status "Auto-fix completed successfully!"
