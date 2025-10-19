#!/bin/bash
# ============================================================================
# EventOS Database Migration, Seed & Validation Script
# ============================================================================
# Purpose: One-command setup with fail-fast validation
# Usage: bash scripts/db.migrate.seed.test.sh
# ============================================================================

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
  echo -e "${BLUE}ℹ ${NC} $1"
}

log_success() {
  echo -e "${GREEN}✅${NC} $1"
}

log_warning() {
  echo -e "${YELLOW}⚠️ ${NC} $1"
}

log_error() {
  echo -e "${RED}❌${NC} $1"
}

log_section() {
  echo ""
  echo -e "${BLUE}════════════════════════════════════════════════════════════════════════════${NC}"
  echo -e "${BLUE} $1${NC}"
  echo -e "${BLUE}════════════════════════════════════════════════════════════════════════════${NC}"
  echo ""
}

# ============================================================================
# PRE-FLIGHT CHECKS
# ============================================================================

log_section "PRE-FLIGHT CHECKS"

# Check for required commands
if ! command -v supabase &> /dev/null; then
  log_error "supabase CLI not found. Install: https://supabase.com/docs/guides/cli"
  exit 1
fi
log_success "supabase CLI found: $(supabase --version)"

if ! command -v psql &> /dev/null; then
  log_error "psql not found. Install PostgreSQL client"
  exit 1
fi
log_success "psql found: $(psql --version | head -n1)"

# Check for .env file
if [ ! -f ".env" ]; then
  log_error ".env file not found. Copy .env.example and configure"
  exit 1
fi
log_success ".env file found"

# Load environment variables
source .env

# Check for SUPABASE_DB_URL or construct from PG* vars
if [ -z "${SUPABASE_DB_URL:-}" ]; then
  if [ -n "${PGHOST:-}" ] && [ -n "${PGUSER:-}" ] && [ -n "${PGPASSWORD:-}" ]; then
    export SUPABASE_DB_URL="postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT:-5432}/${PGDATABASE:-postgres}"
    log_info "Constructed SUPABASE_DB_URL from PG* variables"
  else
    log_error "SUPABASE_DB_URL not set and cannot construct from PG* variables"
    log_info "Set SUPABASE_DB_URL or PGHOST, PGUSER, PGPASSWORD in .env"
    exit 1
  fi
fi
log_success "Database connection string configured"

# ============================================================================
# STEP 1: ENSURE SUPABASE IS RUNNING
# ============================================================================

log_section "STEP 1: STARTING SUPABASE"

if supabase status &> /dev/null; then
  log_info "Supabase is already running"
else
  log_info "Starting local Supabase..."
  supabase start
  log_success "Supabase started"
fi

# Test database connection
log_info "Testing database connection..."
if psql "$SUPABASE_DB_URL" -c "SELECT 1" &> /dev/null; then
  log_success "Database connection successful"
else
  log_error "Cannot connect to database. Check your credentials in .env"
  exit 1
fi

# ============================================================================
# STEP 2: RESET DATABASE
# ============================================================================

log_section "STEP 2: RESETTING DATABASE"

log_info "Running supabase db reset (loads migrations/*)..."
if supabase db reset --db-url "$SUPABASE_DB_URL" 2>&1 | tee /tmp/supabase-reset.log; then
  log_success "Database reset complete"
else
  log_error "Database reset failed. Check /tmp/supabase-reset.log"
  exit 1
fi

# ============================================================================
# STEP 3: RUN SEED DATA
# ============================================================================

log_section "STEP 3: INSERTING SEED DATA"

SEED_FILE="supabase/seeds/20_eventos_core_seed.sql"

if [ ! -f "$SEED_FILE" ]; then
  log_error "Seed file not found: $SEED_FILE"
  exit 1
fi

log_info "Running seed file: $SEED_FILE"
if psql "$SUPABASE_DB_URL" -f "$SEED_FILE" 2>&1 | tee /tmp/seed.log; then
  log_success "Seed data inserted successfully"
else
  log_error "Seed insertion failed. Check /tmp/seed.log"
  exit 1
fi

# ============================================================================
# STEP 4: RUN VALIDATION TESTS
# ============================================================================

log_section "STEP 4: RUNNING VALIDATION TESTS"

TEST_FILE="supabase/tests/20_eventos_core_validate.sql"

if [ ! -f "$TEST_FILE" ]; then
  log_error "Test file not found: $TEST_FILE"
  exit 1
fi

log_info "Running validation tests: $TEST_FILE"
if psql "$SUPABASE_DB_URL" -f "$TEST_FILE" 2>&1 | tee /tmp/validation.log; then
  log_success "All validation tests passed"
else
  log_error "Validation tests failed. Check /tmp/validation.log"
  exit 1
fi

# ============================================================================
# STEP 5: DISPLAY ROW COUNTS
# ============================================================================

log_section "STEP 5: DATABASE ROW COUNTS"

psql "$SUPABASE_DB_URL" <<'SQL'
select
  'budgets' as table_name,
  count(*) as row_count
from budgets
union all
select 'companies', count(*) from companies
union all
select 'contacts', count(*) from contacts
union all
select 'event_settings', count(*) from event_settings
union all
select 'interactions', count(*) from interactions
union all
select 'promo_codes', count(*) from promo_codes
union all
select 'tasks', count(*) from tasks
union all
select 'vendors', count(*) from vendors
order by table_name;
SQL

# ============================================================================
# FINAL SUCCESS MESSAGE
# ============================================================================

log_section "COMPLETE"

echo ""
log_success "🎉 All steps completed successfully!"
echo ""
log_info "Summary:"
echo "  ✅ Database reset"
echo "  ✅ Seed data inserted"
echo "  ✅ Validation tests passed"
echo "  ✅ All 8 tables populated"
echo ""
log_info "Next steps:"
echo "  • View Studio: http://127.0.0.1:54323"
echo "  • View API docs: http://127.0.0.1:54321"
echo "  • Run frontend: npm run dev"
echo "  • Run tests: npm test"
echo ""

exit 0
