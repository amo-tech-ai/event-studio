# Claude Skills Documentation (Official Format)

## 1. Summary

**Claude Skills** (officially called "Agent Skills") are modular capabilities that extend Claude's functionality through filesystem-based resources. Each Skill packages instructions, metadata, and optional resources that Claude uses automatically when relevant.

### Key Concepts

**Progressive Disclosure Architecture**: Skills use a three-level loading system to minimize context usage:

- **Level 1 - Metadata** (always loaded): YAML frontmatter with `name` and `description` (~100 tokens per skill)
- **Level 2 - Instructions** (loaded when triggered): SKILL.md body with workflows and guidance (<5k tokens)
- **Level 3 - Resources** (loaded as needed): Bundled files accessed via bash (effectively unlimited)

### What Skills Enable

- **Specialize Claude**: Domain-specific expertise (legal, finance, engineering, etc.)
- **Reduce Repetition**: Create once, use automatically across conversations
- **Compose Capabilities**: Combine Skills for complex workflows
- **Scale Knowledge**: Bundle unlimited reference materials without context penalty

### How Skills Work

Skills exist as directories in a code execution environment where Claude has filesystem access. Claude:
1. Reads YAML frontmatter at startup (metadata)
2. Reads SKILL.md via bash when triggered (instructions)
3. Accesses additional files only when referenced (resources/code)

This architecture enables Claude to have access to vast knowledge bases while keeping context windows lean.

---

## 2. Step-by-Step Setup Guide

### Step 1: Create Skills Directory

```bash
mkdir -p .claude/skills
```

### Step 2: Understand Official Skill Structure

```
.claude/
└── skills/
    └── skill-name/
        ├── SKILL.md           # Required: Main skill file
        ├── resources/         # Optional: Reference files
        │   ├── guide.md       # Additional instructions
        │   ├── examples.sql   # Code examples
        │   └── schema.json    # Reference data
        ├── scripts/           # Optional: Executable utilities
        │   └── validate.py
        └── README.md          # Optional: Documentation
```

**Critical Requirements**:
- Filename MUST be `SKILL.md` (uppercase, not instructions.md)
- MUST include YAML frontmatter with `name` and `description`
- Only `name` and `description` are supported in frontmatter
- `name`: Maximum 64 characters
- `description`: Maximum 1024 characters

### Step 3: Create Your First Skill

**File: `.claude/skills/my-first-skill/SKILL.md`**

```markdown
---
name: My First Skill
description: Brief description of what this Skill does and when Claude should use it. Mention keywords that should trigger this Skill.
---

# My First Skill

Brief introduction to what this Skill provides.

## Instructions

### When to Use This Skill
- User asks about [specific topic]
- User mentions [trigger keywords]
- User requests [specific task type]

### Step-by-Step Process

1. **First Step**
   - Specific action to take
   - What to look for

2. **Second Step**
   - Next action
   - Expected output

3. **Third Step**
   - Final action
   - Delivery format

### Guidelines
- Important rules to follow
- Constraints and limitations
- Best practices
- Error handling approach

### Tools to Use
- List MCP tools relevant to this Skill
- Bash commands if applicable
- Reference to scripts in resources/

## Examples

### Example 1: [Scenario Name]

**User Request**: "Example input from user"

**Your Response**:
```
Expected output format
Step-by-step what you would do
```

### Example 2: [Another Scenario]

**User Request**: "Different example input"

**Your Response**:
```
How you'd handle this case
```

## Advanced Usage

[Optional section for complex scenarios]

## Resources

For detailed reference, see:
- `resources/guide.md` - Comprehensive guide
- `resources/examples.sql` - Code examples
- `scripts/validate.py` - Validation utility
```

### Step 4: Add Resources (Optional)

Create bundled files that Claude can access on-demand:

**Instructions** (`resources/*.md`): Additional documentation, guides, references
- Only loaded when SKILL.md references them
- Can be extensive without context penalty

**Code** (`scripts/*.py`, `scripts/*.sh`): Executable utilities
- Run via bash, only output enters context
- More reliable than having Claude generate code
- Good for validation, formatting, calculations

**Data** (`resources/*.json`, `resources/*.sql`): Reference materials
- Database schemas, API specs, examples
- Templates and boilerplate code

### Step 5: Invoke Your Skill

In Claude Code:
```bash
/skill skill-name
```

Or in `.mcp.json` for automatic availability:
```json
{
  "skills": [
    "skill-name"
  ]
}
```

Claude will automatically use the Skill when:
- User request matches the description
- Conversation context suggests it's relevant
- Explicitly invoked with /skill command

### Step 6: Test and Iterate

1. **Test trigger phrases**: Verify description catches relevant requests
2. **Check output quality**: Ensure instructions produce desired results
3. **Add examples**: More examples improve consistency
4. **Refine resources**: Add referenced materials as needed
5. **Monitor context usage**: Keep instructions concise

---

## 3. Best Practices Checklist

### ✅ YAML Frontmatter
- [ ] File named exactly `SKILL.md` (uppercase)
- [ ] Contains `name` field (max 64 chars)
- [ ] Contains `description` field (max 1024 chars)
- [ ] Description includes WHAT the Skill does
- [ ] Description includes WHEN to use it (trigger keywords)
- [ ] No other fields in frontmatter (only name and description supported)

### ✅ Skill Design
- [ ] **Single Responsibility**: One clear purpose
- [ ] **Well-Scoped**: Defined boundaries
- [ ] **Discoverable**: Description makes triggering obvious
- [ ] **Self-Contained**: All necessary context included
- [ ] **Deterministic**: Produces consistent results

### ✅ Instructions Quality
- [ ] **Clear Role**: Explicit expertise domain
- [ ] **When to Use**: Triggering conditions specified
- [ ] **Step-by-Step**: Procedural workflow provided
- [ ] **Guidelines**: Rules and constraints explicit
- [ ] **Examples**: 2-3 concrete examples included
- [ ] **Tool References**: Specific tools/commands mentioned
- [ ] **Concise**: Under 5k tokens for main instructions

### ✅ File Organization
- [ ] **Descriptive Naming**: Folder name indicates purpose
- [ ] **Resources Separated**: Additional files in resources/
- [ ] **Scripts Organized**: Executables in scripts/
- [ ] **README Included**: Usage documentation
- [ ] **Version Controlled**: Track changes

### ✅ Progressive Disclosure
- [ ] **Lean SKILL.md**: Core instructions only
- [ ] **Reference Resources**: Extensive materials in separate files
- [ ] **Executable Scripts**: Deterministic operations as code
- [ ] **Lazy Loading**: Resources loaded only when needed

### ✅ Security
- [ ] **No Network Calls**: Skills cannot access external APIs
- [ ] **Trusted Sources Only**: Only use Skills you created or from Anthropic
- [ ] **Audit Thoroughly**: Review all files if from external source
- [ ] **No Secrets**: Don't include API keys or credentials

---

## 4. Example Skill: Database Schema Analyzer

This example demonstrates the official Skill format with proper YAML frontmatter and structure.

### Directory Structure
```
.claude/skills/db-schema-analyzer/
├── SKILL.md                          # Main skill with frontmatter
├── resources/
│   ├── schema-checklist.md          # Comprehensive checklist
│   └── example-schemas.sql          # Reference examples
└── README.md                         # Usage documentation
```

### SKILL.md (Abbreviated)

```markdown
---
name: Database Schema Analyzer
description: Analyze PostgreSQL/Supabase schemas for design, security, performance, and best practices. Use when reviewing migrations, RLS policies, indexing, or database design.
---

# Database Schema Analyzer

PostgreSQL/Supabase schema analysis expert.

## Instructions

### When to Use
- User asks to review database schemas
- User mentions migrations, RLS, indexing
- Security audit or performance optimization requested

### Analysis Process

1. **Initial Assessment**
   - Review tables and relationships
   - Map data model structure

2. **Structural Analysis**
   - Check normalization
   - Verify constraints
   - Review data types

3. **Security Review**
   - Verify RLS policies
   - Check role-based access
   - Review function security

[...see full file for complete instructions...]

## Examples

### Example 1: Schema Review

**User**: "Review my events and tickets tables"

**Response**:
### 🔴 Critical Issues
- Missing foreign key on tickets.event_id
- No RLS policies on tickets
- Missing index on tickets.event_id

[...complete example output...]
```

### Resources Files

See the actual files in `.claude/skills/db-schema-analyzer/` for:
- `resources/schema-checklist.md` - Detailed review checklist
- `resources/example-schemas.sql` - Well-designed schema examples

---

## 5. Where Skills Work

### Claude Code
- **Custom Skills**: Create as `.claude/skills/` directories
- **Discovery**: Automatic when SKILL.md exists
- **Scope**: Personal (`~/.claude/skills/`) or project (`.claude/skills/`)

### Claude API
- **Pre-built Skills**: `pptx`, `xlsx`, `docx`, `pdf` available now
- **Custom Skills**: Upload via `/v1/skills` endpoints
- **Sharing**: Workspace-wide (all members can access)
- **Required Headers**: `code-execution-2025-08-25`, `skills-2025-10-02`, `files-api-2025-04-14`

### Claude.ai
- **Pre-built Skills**: Already working (no setup needed)
- **Custom Skills**: Upload as zip files in Settings > Features
- **Sharing**: Individual user only (must upload separately per user)
- **Plans**: Pro, Max, Team, Enterprise (with code execution)

---

## 6. Key Architecture Concepts

### Progressive Disclosure

Skills don't bloat your context window. Claude loads content in stages:

1. **Startup**: Only metadata (name + description)
2. **Triggered**: Read SKILL.md via bash
3. **As Needed**: Access specific resource files
4. **Execution**: Run scripts, get output only

**Impact**: You can have 50 Skills installed with only ~5k tokens of context penalty (50 × 100 tokens). Full instructions only load when each Skill is actually used.

### Filesystem-Based

Skills exist as directories Claude accesses via bash:

```bash
# How Claude loads a Skill
bash: cat .claude/skills/db-schema-analyzer/SKILL.md

# How Claude accesses resources
bash: cat .claude/skills/db-schema-analyzer/resources/checklist.md

# How Claude runs scripts
bash: python .claude/skills/db-schema-analyzer/scripts/validate.py schema.sql
```

**Impact**:
- Resources don't consume context until accessed
- Scripts provide deterministic operations
- No practical limit on bundled content

### Code Execution Environment

Skills run in a VM with:
- **Bash access**: Navigate filesystem, run commands
- **Python/Node**: Pre-installed packages only
- **No network**: Cannot make external API calls
- **Isolated**: Secure execution environment

---

## 7. Advanced Patterns

### Skill Composition

Combine multiple Skills:
```bash
/skill db-schema-analyzer
/skill sql-migration-generator
```

### Dynamic Resources

Reference project files:
```markdown
## Context
Review schemas in `supabase/migrations/`.
```

### Tool Integration

Specify MCP tools to use:
```markdown
## Tools
- `mcp__supabase__list_tables`
- `mcp__supabase__execute_sql`
- `mcp__supabase__apply_migration`
```

### Meta-Skills

Create Skills that generate other Skills:
```markdown
---
name: Skill Generator
description: Create new Claude Skills following best practices. Use when user wants to create a new Skill.
---

# Skill Generator

## Instructions
When user requests a new Skill:
1. Determine purpose and scope
2. Create `.claude/skills/[name]/` directory
3. Write SKILL.md with proper frontmatter
4. Add relevant resources
5. Create README
6. Test with examples
```

---

## 8. Security Considerations

**⚠️ CRITICAL**: Only use Skills from trusted sources (you created or from Anthropic).

### Risks
- **Tool Misuse**: Malicious Skills can invoke tools harmfully
- **Data Exfiltration**: Skills with sensitive data access could leak info
- **Disguised Intent**: Skill description may not match actual behavior
- **External Dependencies**: URLs in Skills can fetch malicious content

### Protection
- ✅ Audit all files thoroughly before use
- ✅ Review SKILL.md, scripts, and resources
- ✅ Be suspicious of external URL references
- ✅ Treat like installing software - trust matters

---

## 9. Limitations

### Cross-Surface Sync
**Custom Skills do NOT sync** across surfaces:
- Claude.ai ≠ API ≠ Claude Code
- Must upload separately to each

### Network Access
- ❌ Cannot make API calls
- ❌ Cannot access internet
- ❌ Cannot install packages at runtime
- ✅ Only pre-installed packages available

### Sharing Models
- **Claude.ai**: Individual user only
- **Claude API**: Workspace-wide
- **Claude Code**: Personal or project-based

---

## 10. Available Pre-built Skills

Anthropic provides these ready-to-use Skills:

| Skill | skill_id | Capabilities |
|-------|----------|--------------|
| PowerPoint | `pptx` | Create presentations, edit slides, analyze content |
| Excel | `xlsx` | Create spreadsheets, analyze data, generate charts |
| Word | `docx` | Create documents, edit content, format text |
| PDF | `pdf` | Generate formatted PDFs and reports |

Available on API and claude.ai. See [API Skills Guide](/en/api/skills-guide) for usage.

---

## Next Steps

1. ✅ Read the [official Agent Skills documentation](https://docs.anthropic.com/claude/docs/agents-and-tools/agent-skills)
2. ✅ Create `.claude/skills/` directory
3. ✅ Test the example `db-schema-analyzer` Skill
4. ✅ Create custom Skills for your workflow
5. ✅ Review [Skills Cookbook](https://github.com/anthropics/claude-cookbooks/tree/main/skills)
6. ✅ Share successful Skills with your team

---

## Resources

- **Official Docs**: https://docs.anthropic.com/claude/docs/agents-and-tools/agent-skills
- **Engineering Blog**: https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
- **Skills Cookbook**: https://github.com/anthropics/claude-cookbooks/tree/main/skills
- **Skills Repository**: https://github.com/anthropics/skills
- **API Guide**: https://docs.anthropic.com/claude/api/skills-guide

---

*Last Updated: 2025-01-18 (Based on Official Documentation)*
*Format Version: Official Agent Skills Specification*
