# EventOS Core Tables - Implementation Plan

**Date:** 2025-10-19
**Scope:** 8 core tables migration + seeds + validation + CI
**Goal:** One-command setup with fail-fast validation

---

## Tables in Scope

1. `budgets` - Event budget tracking with variance calculation
2. `companies` - CRM company records with slug generation
3. `contacts` - CRM contact records with full_name generation
4. `event_settings` - Per-event configuration
5. `interactions` - CRM interaction tracking
6. `promo_codes` - Discount codes with validation
7. `tasks` - Event task management
8. `vendors` - Vendor directory with ratings

---

## Dependency Graph

```
auth.users (Supabase built-in)
  ↓
profiles (existing)
  ↓
organizers (existing) ← events (existing)
  ↓                       ↓
companies               event_settings
  ↓                       ↓
contacts                promo_codes
  ↓                       ↓
interactions            tasks
  ↓
vendors
  ↓
budgets
```

**Critical:** Must seed parent tables first:
- profiles/organizers
- events
- auth.users

---

## File Structure

```
event-studio/
├── supabase/
│   ├── schemas/
│   │   └── 20_eventos_core.sql          # Schema DDL (new)
│   ├── seeds/
│   │   └── 20_eventos_core_seed.sql     # Seed data (new)
│   ├── tests/
│   │   └── 20_eventos_core_validate.sql # Validation (new)
│   └── migrations/
│       └── 20251019_eventos_core.sql    # Generated migration
├── scripts/
│   └── db.migrate.seed.test.sh          # One-shot script (new)
├── .github/
│   └── workflows/
│       └── db-validate.yml               # CI workflow (new)
├── README_DB.md                          # Documentation (new)
└── .env.example                          # Template (update)
```

---

## Implementation Steps

### Step 1: Schema DDL (`supabase/schemas/20_eventos_core.sql`)

**Contents:**
1. Function definitions (idempotent)
   - `handle_updated_at()`
   - `generate_company_slug()`
   - `update_last_interaction_timestamp()`

2. Table definitions (8 tables)
   - Full DDL with constraints, indexes, triggers
   - Use provided DDL verbatim (minor fixes only)

3. RLS policies
   - Separate file or inline (TBD based on cursor rules)

**Key Requirements:**
- Lowercase SQL
- snake_case naming
- Idempotent (CREATE OR REPLACE, IF NOT EXISTS)
- Comments on complex logic

---

### Step 2: Seed Data (`supabase/seeds/20_eventos_core_seed.sql`)

**Minimal, realistic seed set:**

1. **Prerequisites (ensure exist):**
   - 1 profile/organizer: `11111111-1111-1111-1111-111111111111`
   - 1 event: `e1111111-1111-1111-1111-111111111111`
   - 1 auth.users: for `created_by`, `assigned_to`

2. **New records:**
   - 1 company (TechCon Events, slug auto-generated)
   - 1 contact (John Smith @ TechCon)
   - 1 vendor (Catering Co, rating 4.5)
   - 1 event_settings (for sample event)
   - 2 interactions (one via contact_id, one via company_id)
   - 2 promo_codes (EARLY20 percentage, SAVE50 fixed)
   - 2 tasks (TODO urgent, IN_PROGRESS medium)
   - 2 budgets (VENUE positive variance, CATERING negative)

**Validation points:**
- All FKs resolve
- All CHECKs pass
- Unique constraints respected
- Dates valid (valid_from < valid_until)

---

### Step 3: Validation Tests (`supabase/tests/20_eventos_core_validate.sql`)

**Test categories:**

1. **Row existence** (8 assertions)
   ```sql
   do $$
   begin
     if (select count(*) from budgets) < 1 then
       raise exception 'budgets table is empty';
     end if;
   end $$;
   ```

2. **FK integrity** (per table)
   - No orphaned records
   - Parent records exist

3. **CHECK constraints** (per table)
   - budgets: amounts >= 0, variance correct
   - promo_codes: discount_value > 0, valid dates
   - tasks: priority/status enums
   - vendors: rating 0-5

4. **Uniqueness** (where applicable)
   - companies.slug
   - promo_codes (event_id, code)

5. **Derived columns**
   - budgets.variance = actual - estimated
   - contacts.full_name = first_name || ' ' || last_name

---

### Step 4: One-Shot Script (`scripts/db.migrate.seed.test.sh`)

```bash
#!/bin/bash
set -euo pipefail

# Pre-flight checks
command -v supabase >/dev/null || { echo "supabase CLI not found"; exit 1; }
command -v psql >/dev/null || { echo "psql not found"; exit 1; }

# Load env
source .env || { echo ".env not found"; exit 1; }
: "${SUPABASE_DB_URL:?SUPABASE_DB_URL not set}"

# Steps
echo "🛑 Stopping Supabase..."
supabase stop || true

echo "🔄 Resetting database..."
supabase db reset

echo "🌱 Running seeds..."
psql "$SUPABASE_DB_URL" -f supabase/seeds/20_eventos_core_seed.sql

echo "✅ Running validation tests..."
psql "$SUPABASE_DB_URL" -f supabase/tests/20_eventos_core_validate.sql

echo "📊 Row counts:"
psql "$SUPABASE_DB_URL" -c "
  select 'budgets' as table, count(*) from budgets union all
  select 'companies', count(*) from companies union all
  select 'contacts', count(*) from contacts union all
  select 'event_settings', count(*) from event_settings union all
  select 'interactions', count(*) from interactions union all
  select 'promo_codes', count(*) from promo_codes union all
  select 'tasks', count(*) from tasks union all
  select 'vendors', count(*) from vendors;
"

echo ""
echo "✅ All validations passed!"
```

---

### Step 5: Diff-Based Migration

After creating `supabase/schemas/20_eventos_core.sql`:

```bash
supabase stop || true
supabase db diff -f 20251019_eventos_core
```

**Verify:**
- Generated file in `supabase/migrations/`
- Contains DDL only (no DML)
- Functions, tables, indexes, triggers

---

### Step 6: CI Workflow (`.github/workflows/db-validate.yml`)

```yaml
name: Database Validation

on:
  pull_request:
    paths:
      - 'supabase/schemas/**'
      - 'supabase/seeds/**'
      - 'supabase/tests/**'
      - 'scripts/db.migrate.seed.test.sh'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1
        with:
          version: latest

      - name: Install PostgreSQL client
        run: sudo apt-get update && sudo apt-get install -y postgresql-client

      - name: Run validation
        env:
          SUPABASE_DB_URL: ${{ secrets.SUPABASE_DB_URL }}
        run: bash scripts/db.migrate.seed.test.sh
```

---

### Step 7: Documentation (`README_DB.md`)

**Sections:**
1. Quick start (one-liner)
2. Prerequisites
3. Directory structure
4. Running migrations
5. Running seeds
6. Running tests
7. Troubleshooting
8. Common failures & fixes

---

### Step 8: Environment Template (`.env.example`)

Add database connection strings:
```
SUPABASE_DB_URL=postgresql://postgres:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require
PGHOST=aws-0-us-east-1.pooler.supabase.com
PGPORT=6543
PGDATABASE=postgres
PGUSER=postgres.YOUR_INSTANCE
PGPASSWORD=YOUR_PASSWORD
```

---

## Validation Checklist

### Per-Table Validations

**budgets:**
- [ ] estimated_amount >= 0
- [ ] actual_amount >= 0
- [ ] variance = actual_amount - estimated_amount
- [ ] category in enum
- [ ] status in enum

**companies:**
- [ ] slug unique
- [ ] company_size in enum
- [ ] status in enum
- [ ] organizer_id exists in profiles

**contacts:**
- [ ] email regex valid
- [ ] status in enum
- [ ] full_name = first_name || ' ' || last_name
- [ ] company_id NULL or exists in companies

**event_settings:**
- [ ] event_id unique
- [ ] order_timeout_minutes 5-60
- [ ] event_id exists in events

**interactions:**
- [ ] duration_minutes > 0 (if set)
- [ ] contact_id OR company_id present
- [ ] interaction_type in enum

**promo_codes:**
- [ ] discount_type in enum
- [ ] discount_value > 0
- [ ] max_uses_per_customer > 0
- [ ] times_used >= 0
- [ ] valid_from < valid_until (if both set)
- [ ] times_used <= max_uses (if max_uses set)
- [ ] (event_id, code) unique

**tasks:**
- [ ] priority in enum
- [ ] status in enum
- [ ] category in enum
- [ ] event_id exists in events

**vendors:**
- [ ] rating 0-5
- [ ] service_category in enum
- [ ] status in enum
- [ ] organizer_id exists in organizers

---

## Success Criteria

1. ✅ `bash scripts/db.migrate.seed.test.sh` completes without error
2. ✅ All 8 tables have >= 1 row
3. ✅ All FK relationships intact
4. ✅ All CHECK constraints pass
5. ✅ All unique constraints respected
6. ✅ CI blocks invalid PRs
7. ✅ Documentation clear and complete

---

## Risk Mitigation

**Risk 1: Missing parent records**
- Mitigation: Seed prerequisites first (profiles, events, organizers)
- Fallback: Create minimal parent records in seed file

**Risk 2: FK constraint violations**
- Mitigation: Explicit FK checks in validation tests
- Fallback: Detailed error messages

**Risk 3: Date validation failures**
- Mitigation: Use NOW() + intervals for valid dates
- Fallback: NULL dates where allowed

**Risk 4: Enum typos**
- Mitigation: Copy enums directly from DDL
- Fallback: Case-sensitive enum matching

---

## Timeline

- Step 1 (Schema): 30 min
- Step 2 (Seeds): 45 min
- Step 3 (Tests): 45 min
- Step 4 (Script): 15 min
- Step 5 (Migration): 10 min
- Step 6 (CI): 20 min
- Step 7 (Docs): 30 min
- Step 8 (Env): 5 min

**Total:** ~3.5 hours

---

## Next Steps

1. Create `supabase/schemas/20_eventos_core.sql`
2. Create `supabase/seeds/20_eventos_core_seed.sql`
3. Create `supabase/tests/20_eventos_core_validate.sql`
4. Create `scripts/db.migrate.seed.test.sh`
5. Run `supabase db diff`
6. Create CI workflow
7. Create documentation
8. Update `.env.example`
9. Test end-to-end
10. Commit all files

---

**Plan Status:** ✅ READY FOR IMPLEMENTATION
**Last Updated:** 2025-10-19
