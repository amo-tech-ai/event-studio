# EventOS Database Setup

Complete database setup with migrations, seeds, and validation for EventOS core tables.

## Quick Start

**One-line setup:**
```bash
bash scripts/db.migrate.seed.test.sh
```

This will:
1. Stop local Supabase (if running)
2. Reset database with all migrations
3. Insert seed data for 8 core tables
4. Run comprehensive validation tests
5. Display row counts

---

## Prerequisites

### Required Tools
- **Supabase CLI** (latest): https://supabase.com/docs/guides/cli
- **PostgreSQL client** (psql): https://www.postgresql.org/download/
- **Bash** (for running scripts)

### Database Connection
You need one of:
- **Remote Supabase project** with connection string
- **Local Supabase** running via `supabase start`

---

## Configuration

### 1. Environment Setup

Copy the example environment file:
```bash
cp .env.example .env
```

### 2. Configure Database Connection

**Option A: Remote Supabase (Production/Staging)**
```bash
# In .env
SUPABASE_DB_URL=postgresql://postgres.YOUR_INSTANCE:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require

# Alternative: Individual PG* variables
PGHOST=aws-0-us-east-1.pooler.supabase.com
PGPORT=6543
PGDATABASE=postgres
PGUSER=postgres.YOUR_INSTANCE
PGPASSWORD=YOUR_PASSWORD
```

**Option B: Local Supabase (Development)**
```bash
# In .env
SUPABASE_DB_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres

# Or
PGHOST=127.0.0.1
PGPORT=54322
PGDATABASE=postgres
PGUSER=postgres
PGPASSWORD=postgres
```

### 3. Test Connection
```bash
source .env
psql "$SUPABASE_DB_URL" -c "SELECT 1"
```

---

## Directory Structure

```
event-studio/
├── supabase/
│   ├── schemas/                    # Declarative schema definitions
│   │   └── 20_eventos_core.sql    # 8 core tables + functions
│   ├── seeds/                      # Sample data for development
│   │   └── 20_eventos_core_seed.sql
│   ├── tests/                      # Validation tests
│   │   └── 20_eventos_core_validate.sql
│   └── migrations/                 # Generated migrations (auto)
│       └── YYYYMMDDHHMMSS_*.sql
├── scripts/
│   └── db.migrate.seed.test.sh    # One-command setup
├── .github/
│   └── workflows/
│       └── db-validate.yml         # CI validation on PRs
├── README_DB.md                    # This file
└── .env.example                    # Environment template
```

---

## Core Tables

The 8 tables managed by this setup:

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `budgets` | Event budget tracking | Calculated variance, vendor FK |
| `companies` | CRM company records | Auto-generated slug, full-text search |
| `contacts` | CRM contact records | Generated full_name, company FK |
| `event_settings` | Per-event configuration | Unique per event, timeout constraints |
| `interactions` | CRM activity tracking | Updates last_interaction_at trigger |
| `promo_codes` | Discount codes | Date validation, usage tracking |
| `tasks` | Event task management | Priority/status enums, due dates |
| `vendors` | Vendor directory | Rating constraints, service categories |

---

## Running Migrations

### Full Reset (Recommended for Development)
```bash
bash scripts/db.migrate.seed.test.sh
```

This runs all steps automatically with validation.

### Manual Steps

**1. Reset database:**
```bash
supabase db reset --db-url "$SUPABASE_DB_URL"
```

**2. Apply seeds:**
```bash
psql "$SUPABASE_DB_URL" -f supabase/seeds/20_eventos_core_seed.sql
```

**3. Run validation:**
```bash
psql "$SUPABASE_DB_URL" -f supabase/tests/20_eventos_core_validate.sql
```

**4. Check row counts:**
```bash
psql "$SUPABASE_DB_URL" -c "
  SELECT 'budgets' AS table, COUNT(*) FROM budgets UNION ALL
  SELECT 'companies', COUNT(*) FROM companies UNION ALL
  SELECT 'contacts', COUNT(*) FROM contacts UNION ALL
  SELECT 'event_settings', COUNT(*) FROM event_settings UNION ALL
  SELECT 'interactions', COUNT(*) FROM interactions UNION ALL
  SELECT 'promo_codes', COUNT(*) FROM promo_codes UNION ALL
  SELECT 'tasks', COUNT(*) FROM tasks UNION ALL
  SELECT 'vendors', COUNT(*) FROM vendors
  ORDER BY table;
"
```

---

## Running Tests

### Validation Tests
```bash
psql "$SUPABASE_DB_URL" -f supabase/tests/20_eventos_core_validate.sql
```

**Tests include:**
- ✅ Row existence (all 8 tables)
- ✅ Foreign key integrity
- ✅ CHECK constraint compliance
- ✅ Unique constraint validation
- ✅ Derived column calculations (variance, full_name, slug)
- ✅ Trigger functionality (updated_at, last_interaction_at)

**Fail-fast behavior:** Tests stop immediately on first failure with detailed error message.

---

## Continuous Integration

GitHub Actions automatically validates changes on pull requests:

**Triggers:**
- PRs affecting `supabase/schemas/**`, `supabase/seeds/**`, `supabase/tests/**`
- Pushes to `main` branch

**Workflow:**
1. Starts local Supabase instance
2. Runs `db.migrate.seed.test.sh`
3. Uploads logs on failure
4. Blocks merge if validation fails

**View workflow:** `.github/workflows/db-validate.yml`

---

## Troubleshooting

### Error: "supabase CLI not found"
**Solution:**
```bash
# Install Supabase CLI
brew install supabase/tap/supabase  # macOS
# OR
npm install -g supabase            # npm
```

### Error: "psql not found"
**Solution:**
```bash
# Install PostgreSQL client
brew install postgresql@15          # macOS
sudo apt-get install postgresql-client  # Ubuntu/Debian
```

### Error: "Cannot connect to database"
**Check:**
1. Is `.env` file present? Run: `ls -la .env`
2. Is `SUPABASE_DB_URL` set? Run: `source .env && echo $SUPABASE_DB_URL`
3. Is database accessible? Run: `psql "$SUPABASE_DB_URL" -c "SELECT 1"`

**Remote connection issues:**
- Verify credentials in Supabase dashboard
- Check pooler vs direct connection (port 6543 vs 5432)
- Ensure IP allowlisted (Supabase > Settings > Database > Connection pooling)

**Local connection issues:**
- Is Supabase running? Run: `supabase status`
- Start Supabase: `supabase start`

### Error: "relation already exists"
**Cause:** Schema already applied, not idempotent.

**Solution:**
```bash
# Full reset (destructive)
supabase db reset --db-url "$SUPABASE_DB_URL"

# Then rerun
bash scripts/db.migrate.seed.test.sh
```

### Error: "violates foreign key constraint"
**Cause:** Parent records missing (profiles, events, organizers).

**Solution:**
The seed file creates prerequisites automatically. If still failing:
```bash
# Check if parent tables exist
psql "$SUPABASE_DB_URL" -c "SELECT COUNT(*) FROM profiles; SELECT COUNT(*) FROM events;"

# If empty, run base migrations first
supabase db reset --db-url "$SUPABASE_DB_URL"
```

### Error: "violates check constraint"
**Cause:** Seed data doesn't match CHECK constraints.

**Common issues:**
- Invalid enum values (check schema DDL for allowed values)
- Negative amounts (budgets.estimated_amount >= 0)
- Invalid date ranges (valid_from < valid_until)
- Invalid email format (contacts.email)

**Solution:** Check `/tmp/seed.log` for specific constraint name and fix seed data.

### Error: Validation tests failed
**Check logs:**
```bash
cat /tmp/validation.log
```

**Common failures:**
- Row count too low: Seed didn't insert all records
- FK orphans: Parent record deleted or missing
- Calculated fields wrong: Trigger didn't fire (check function exists)

---

## Common Tasks

### Add New Seed Data
```bash
# Edit seed file
nano supabase/seeds/20_eventos_core_seed.sql

# Rerun seeds (non-destructive due to ON CONFLICT)
psql "$SUPABASE_DB_URL" -f supabase/seeds/20_eventos_core_seed.sql
```

### Generate New Migration
```bash
# After modifying supabase/schemas/20_eventos_core.sql
supabase db diff -f my_new_migration_name

# Generated in: supabase/migrations/
```

### View Applied Migrations
```bash
psql "$SUPABASE_DB_URL" -c "SELECT * FROM supabase_migrations.schema_migrations ORDER BY version;"
```

### Reset Specific Table
```bash
# Example: Clear and reseed companies
psql "$SUPABASE_DB_URL" -c "TRUNCATE companies CASCADE;"
psql "$SUPABASE_DB_URL" -f supabase/seeds/20_eventos_core_seed.sql
```

---

## Development Workflow

### 1. Make Schema Changes
Edit `supabase/schemas/20_eventos_core.sql`

### 2. Generate Migration
```bash
supabase db diff -f descriptive_name
```

### 3. Update Seeds (if needed)
Edit `supabase/seeds/20_eventos_core_seed.sql`

### 4. Update Tests (if needed)
Edit `supabase/tests/20_eventos_core_validate.sql`

### 5. Test Locally
```bash
bash scripts/db.migrate.seed.test.sh
```

### 6. Commit and Push
```bash
git add supabase/ scripts/
git commit -m "feat: add new schema changes"
git push
```

### 7. CI Validates
GitHub Actions runs validation automatically on PR.

---

## Production Deployment

### Pre-deployment Checklist
- [ ] All migrations tested locally
- [ ] Validation tests pass
- [ ] Seed data reviewed (remove test data for production)
- [ ] RLS policies reviewed and tested
- [ ] Indexes optimized for production load
- [ ] Backup taken (if applying to existing database)

### Deployment Steps
```bash
# 1. Backup production database
supabase db dump --db-url "$PROD_SUPABASE_DB_URL" > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. Apply migrations to production
supabase db push --db-url "$PROD_SUPABASE_DB_URL"

# 3. Verify schema
psql "$PROD_SUPABASE_DB_URL" -c "\dt public.*"

# 4. Run validation (NO SEEDS in production)
psql "$PROD_SUPABASE_DB_URL" -f supabase/tests/20_eventos_core_validate.sql
```

**Note:** Never run seed files in production. They're for development only.

---

## Schema Reference

### Functions
- `handle_updated_at()` - Auto-updates `updated_at` timestamp
- `generate_company_slug()` - Auto-generates URL slug from company name
- `update_last_interaction_timestamp()` - Updates contact/company on new interaction

### Indexes
- Full-text search on companies.name (GIN)
- Partial indexes on nullable FKs
- Foreign key indexes for joins
- Status/date indexes for filtering

### Constraints
- FK cascades: `ON DELETE CASCADE` for event_id (deletes cascade)
- FK nulls: `ON DELETE SET NULL` for vendor_id (preserves budget history)
- CHECK constraints: Enums, ranges, logical constraints
- UNIQUE constraints: Slugs, composite keys

---

## Support

**Issues:** https://github.com/your-org/event-studio/issues
**Documentation:** See `IMPLEMENTATION-PLAN-EVENTOS-CORE.md` for technical details
**Schema:** See `supabase/schemas/20_eventos_core.sql` for full DDL

---

**Last Updated:** 2025-10-19
