# Task 01: Database Verification
**Priority:** 🔴 CRITICAL BLOCKER
**Estimated Time:** 2 hours
**Status:** 🔴 NOT STARTED
**Dependencies:** None (start here)

---

## 🎯 Objective

Verify database schema is complete and RLS policies work correctly before starting any implementation.

---

## ✅ Success Criteria

- [ ] All 22 required tables exist
- [ ] RLS enabled on all tables
- [ ] RLS policies tested with real user session
- [ ] Foreign keys configured correctly
- [ ] Indexes exist for performance
- [ ] Security advisors pass
- [ ] Performance advisors pass
- [ ] Verification script created and passes

---

## 📋 Task Checklist

### 1. Create Verification Script (30 min)

```bash
# Create script file
cat > scripts/verify-dashboard-ready.sh << 'EOF'
#!/bin/bash
set -e

echo "🔍 Verifying database schema for dashboard..."

# Database connection
DATABASE_URL=${DATABASE_URL:-"postgresql://postgres:postgres@127.0.0.1:54322/postgres"}

# Required tables
REQUIRED_TABLES=(
  events orders tickets attendees profiles
  companies contacts interactions tasks
  promo_codes venues wizard_sessions
  marketing_campaigns budgets ticket_tiers
  event_categories custom_fields
  event_dashboards venue_bookings
)

echo ""
echo "1️⃣ Checking table existence..."
MISSING_TABLES=()

for table in "${REQUIRED_TABLES[@]}"; do
  if psql "$DATABASE_URL" -c "\d $table" > /dev/null 2>&1; then
    echo "  ✅ $table"
  else
    echo "  ❌ $table - NOT FOUND"
    MISSING_TABLES+=("$table")
  fi
done

if [ ${#MISSING_TABLES[@]} -ne 0 ]; then
  echo ""
  echo "🚨 ERROR: Missing tables:"
  printf '  - %s\n' "${MISSING_TABLES[@]}"
  exit 1
fi

echo ""
echo "2️⃣ Checking RLS policies..."
psql "$DATABASE_URL" -c "
  SELECT
    schemaname,
    tablename,
    CASE WHEN rowsecurity THEN '✅ Enabled' ELSE '❌ Disabled' END as rls_status
  FROM pg_tables
  WHERE schemaname = 'public'
  ORDER BY tablename;
"

echo ""
echo "3️⃣ Checking foreign keys..."
psql "$DATABASE_URL" -c "
  SELECT
    COUNT(*) as foreign_key_count
  FROM information_schema.table_constraints
  WHERE constraint_type = 'FOREIGN KEY'
  AND table_schema = 'public';
"

echo ""
echo "4️⃣ Checking indexes..."
psql "$DATABASE_URL" -c "
  SELECT
    schemaname,
    tablename,
    indexname
  FROM pg_indexes
  WHERE schemaname = 'public'
  ORDER BY tablename, indexname
  LIMIT 20;
"

echo ""
echo "✅ Database schema verification complete!"
echo ""
EOF

chmod +x scripts/verify-dashboard-ready.sh
```

- [ ] Create script file
- [ ] Make script executable
- [ ] Add all 22 required tables to list
- [ ] Add RLS check query
- [ ] Add foreign key check
- [ ] Add index check

### 2. Run Verification Script (10 min)

```bash
./scripts/verify-dashboard-ready.sh
```

- [ ] Run script
- [ ] All 22 tables exist
- [ ] Note any missing tables
- [ ] Note any RLS issues

**Expected Output:**
```
✅ events
✅ orders
✅ tickets
✅ attendees
✅ profiles
✅ companies
✅ contacts
... (all 22 tables)
```

### 3. Test RLS Policies (30 min)

```bash
# Test with authenticated user
psql "$DATABASE_URL" << EOF
-- Set auth.uid() to simulate authenticated user
SET LOCAL request.jwt.claims.sub = 'test-user-id';

-- Test events table access
SELECT COUNT(*) FROM events;

-- Test orders table access
SELECT COUNT(*) FROM orders;

-- Test RLS blocks unauthorized access
SET LOCAL request.jwt.claims.sub = 'different-user-id';
SELECT COUNT(*) FROM events WHERE user_id = 'test-user-id';
EOF
```

- [ ] Test authenticated user can read own data
- [ ] Test user cannot read other user's data
- [ ] Verify RLS policies work correctly
- [ ] Document any RLS issues

### 4. Run Supabase Advisors (20 min)

```bash
# Use MCP tool for security advisor
mcp__supabase__get_advisors --type security

# Use MCP tool for performance advisor
mcp__supabase__get_advisors --type performance
```

- [ ] Run security advisor
- [ ] Review security findings
- [ ] Fix critical security issues
- [ ] Run performance advisor
- [ ] Review performance findings
- [ ] Note optimization opportunities

### 5. Verify Foreign Keys (15 min)

```bash
# Test foreign key relationships
psql "$DATABASE_URL" << EOF
-- Test event -> orders relationship
SELECT
  e.id as event_id,
  e.name,
  COUNT(o.id) as order_count
FROM events e
LEFT JOIN orders o ON e.id = o.event_id
GROUP BY e.id, e.name;

-- Test orders -> tickets relationship
SELECT
  o.id as order_id,
  COUNT(t.id) as ticket_count
FROM orders o
LEFT JOIN tickets t ON o.id = t.order_id
GROUP BY o.id;

-- Test events -> attendees relationship
SELECT
  e.id as event_id,
  e.name,
  COUNT(a.id) as attendee_count
FROM events e
LEFT JOIN attendees a ON e.id = a.event_id
GROUP BY e.id, e.name;
EOF
```

- [ ] Test event → orders relationship
- [ ] Test orders → tickets relationship
- [ ] Test events → attendees relationship
- [ ] Verify JOIN queries work
- [ ] Document any FK issues

### 6. Create Verification Report (15 min)

- [ ] Document verification results
- [ ] List any missing tables
- [ ] List any RLS issues
- [ ] List any FK problems
- [ ] List security advisor findings
- [ ] List performance advisor findings
- [ ] Create action plan for fixes

---

## 📊 Verification Results Template

```markdown
# Database Verification Report
Date: ___________
Time: ___________

## Table Existence
- Total Required: 22
- Found: _____
- Missing: _____

Missing Tables:
-

## RLS Status
- Tables with RLS Enabled: _____
- Tables with RLS Disabled: _____

Issues:
-

## Foreign Keys
- Total Foreign Keys: _____
- Working Correctly: ✅ / ❌

Issues:
-

## Security Advisor
- Critical Issues: _____
- Warnings: _____

Findings:
-

## Performance Advisor
- Critical Issues: _____
- Warnings: _____

Findings:
-

## Overall Status
- [ ] ✅ Ready for implementation
- [ ] ❌ Issues need fixing

Action Items:
1.
2.
3.
```

---

## 🚩 Known Issues

### Missing Tables (Potential)
- `venues` - Status unknown, need to verify
- `event_dashboards` - May not exist yet
- `venue_bookings` - May not exist yet

### Empty Tables (Will Block Features)
- `companies` - 0 rows (blocks Organizers page)
- `contacts` - 0 rows (blocks CRM features)

---

## 🎯 Next Task

After completing this task:
- [ ] All verification passes
- [ ] No critical blockers
- [ ] Proceed to **Task 02: Phase 0 - Sample Data Creation**

---

## 📝 Notes

**Issues Found:**
-

**Fixes Applied:**
-

**Time Spent:** _____ hours

**Completed By:** ___________________
**Date:** ___________________
