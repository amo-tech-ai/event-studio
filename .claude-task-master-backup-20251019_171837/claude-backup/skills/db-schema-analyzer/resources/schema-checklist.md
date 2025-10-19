# Database Schema Review Checklist

## Structure
- [ ] All tables have primary keys
- [ ] Foreign keys properly defined
- [ ] Appropriate data types selected
- [ ] NOT NULL constraints where appropriate
- [ ] DEFAULT values for required fields

## Indexing
- [ ] Primary keys indexed (automatic)
- [ ] Foreign keys indexed
- [ ] Frequently queried columns indexed
- [ ] Composite indexes for common queries
- [ ] Unique constraints where needed

## Security
- [ ] RLS enabled on all user-data tables
- [ ] Policies for SELECT, INSERT, UPDATE, DELETE
- [ ] Role-based access control
- [ ] Sensitive data encrypted
- [ ] Audit columns (created_at, updated_at, created_by)

## Performance
- [ ] No obvious N+1 query patterns
- [ ] Appropriate use of triggers
- [ ] Partitioning for large tables
- [ ] Materialized views where beneficial

## Naming
- [ ] snake_case for all identifiers
- [ ] Descriptive table names (plural)
- [ ] Clear column names
- [ ] Foreign keys: {table}_id pattern
- [ ] Junction tables: {table1}_{table2}

## Data Integrity
- [ ] Check constraints for validation
- [ ] Cascading deletes configured
- [ ] Orphan prevention strategies
- [ ] Transaction boundaries clear
