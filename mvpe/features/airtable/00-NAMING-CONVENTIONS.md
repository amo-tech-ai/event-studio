# Documentation Naming Conventions

## Rule: Sequential Numbering for Documentation Files

All documentation markdown files in this directory should follow this naming pattern:

```
NN-Descriptive-Title-In-Kebab-Case.md
```

### Format Rules

1. **Two-digit prefix** (01, 02, 03, etc.)
2. **Hyphen separator** between number and title
3. **Kebab-case** for title (lowercase with hyphens)
4. **.md extension** for markdown files

### Examples

✅ **Correct:**
- `01-Airtable-Event-Attendee-Research-AI-Play.md`
- `02-Airtable-vs-EventOS-Schema-Comparison.md`
- `03-CopilotKit-Integration-Guide-for-EventOS.md`
- `04-EventOS-Feature-Implementation-Plan.md`

❌ **Incorrect:**
- `Airtable-vs-EventOS-Schema-Comparison.md` (no number)
- `1-Feature-Plan.md` (single digit instead of two)
- `05_Feature_Plan.md` (underscores instead of hyphens)
- `05-feature-plan.md` (lowercase title - use Title Case)

### Current File Sequence

| Number | File | Description |
|--------|------|-------------|
| 00 | NAMING-CONVENTIONS.md | This file - naming rules |
| 01 | Airtable-Event-Attendee-Research-AI-Play.md | Airtable AI Play summary |
| 02 | Airtable-vs-EventOS-Schema-Comparison.md | Schema comparison analysis |
| 03 | CopilotKit-Integration-Guide-for-EventOS.md | Comprehensive CopilotKit guide |
| 04 | EventOS-Feature-Implementation-Plan.md | 8-week implementation plan |
| 05 | *(next available)* | Reserved for next document |

### When Creating New Documentation

1. **Check the current highest number** in the directory
2. **Use the next sequential number** (if last is 04, use 05)
3. **Follow the naming format** exactly
4. **Update this file** with the new entry in the table above

### Special Cases

**Data Files (CSV, JSON, etc.):**
- Keep original names from source systems
- Examples: `Agenda-Full Agenda.csv`, `Attendees-All Attendees.csv`
- Do NOT renumber data export files

**Temporary/Working Files:**
- Prefix with `_` for temporary files: `_draft-feature.md`
- Delete when no longer needed

**Images/Media:**
- Use descriptive names: `architecture-diagram.png`
- Store in `images/` subdirectory if many files

### Quick Reference Command

To find the next available number:
```bash
ls -1 /home/sk/event-studio/mvpe/features/airtable/*.md | grep -E "^[0-9]{2}-" | tail -1
# Add 1 to the number shown
```

### Why This Convention?

✅ **Benefits:**
- Files naturally sort in logical order
- Easy to find documentation sequence
- Clear documentation progression
- Professional organization
- Git-friendly naming (no spaces)

---

*Last Updated: 2025-10-20*
*Next Available Number: 05*
