# Database Schema Analyzer Skill

## Purpose
Analyzes PostgreSQL database schemas for design quality, security, performance, and best practices.

## When to Use
- Reviewing new schema designs
- Auditing existing databases
- Before major migrations
- Security assessments
- Performance optimization

## Usage
In Claude Code CLI:
```bash
/skill db-schema-analyzer
```

Then provide your schema (SQL files, migrations, or describe your tables).

## What It Checks
- **Structure**: Normalization, relationships, constraints
- **Security**: RLS policies, permissions, data protection
- **Performance**: Indexes, query patterns, optimizations
- **Standards**: Naming conventions, coding style

## Output
Categorized findings with specific SQL examples for fixes:
- 🔴 Critical Issues
- 🟡 Improvements
- 🟢 Good Practices
- 📋 Recommendations

## Resources Included
- `schema-checklist.md`: Comprehensive review checklist
- `example-schemas.sql`: Reference examples of good practices

## Maintenance
- Last updated: 2025-01-15
- Compatible with: PostgreSQL 12+, Supabase
- Recommended for: Event management systems, CRM databases, SaaS applications
