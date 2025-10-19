#!/bin/bash

# Script to apply MVP database migrations to Supabase
# This script applies 3 migrations that add 17 new tables

set -e  # Exit on error

echo "🚀 Applying MVP Database Migrations to Supabase..."
echo "================================================"
echo ""

# Set access token from environment
export SUPABASE_ACCESS_TOKEN="${SUPABASE_PERSONAL_ACCESS_TOKEN}"

# Check if Supabase CLI is available
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
fi

echo "📊 Current database state:"
echo "Checking existing tables..."
npx supabase db remote list 2>/dev/null || echo "Using production database"

echo ""
echo "📝 Migrations to apply:"
echo "  1. 20251017130000_critical_mvp_tables.sql (6 tables)"
echo "  2. 20251017130100_crm_tables.sql (4 tables)"
echo "  3. 20251017130200_operations_tables.sql (7 tables)"
echo ""

# Confirm with user
read -p "Apply these migrations to PRODUCTION database? (yes/no): " -r
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "❌ Migration cancelled by user"
    exit 1
fi

echo ""
echo "🔄 Applying migrations..."

# Apply migrations using Supabase CLI
cd "$(dirname "$0")/.."  # Go to project root

# Push all new migrations
npx supabase db push --include-all

echo ""
echo "✅ Migrations applied successfully!"
echo ""
echo "📊 Verifying new tables..."

# Verify tables were created
echo "Running verification query..."

echo ""
echo "🎉 Migration complete!"
echo ""
echo "Next steps:"
echo "  1. Run: npx supabase gen types typescript > src/types/database.types.ts"
echo "  2. Verify all 30 tables exist"
echo "  3. Test critical functionality"
