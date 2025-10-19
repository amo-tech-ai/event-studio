#!/bin/bash

# Script to apply sample data migration to Supabase
# This script executes the sample data SQL file

echo "🚀 Applying sample data migration..."
echo "📊 Target: 9 tables with 44 records"
echo ""

# Apply the migration using supabase execute_sql via mcp
npx @modelcontextprotocol/cli exec supabase execute_sql \
  --query "$(cat supabase/migrations/20251017200000_sample_data_core_tables.sql)"

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Sample data migration completed successfully!"
  echo "📈 Verifying data..."
  echo ""
  
  # Verify data was inserted
  echo "Row counts per table:"
  echo "- organizers: $(npx supabase db execute 'select count(*) from organizers')"
  echo "- promo_codes: $(npx supabase db execute 'select count(*) from promo_codes')"
  echo "- companies: $(npx supabase db execute 'select count(*) from companies')"
  echo "- contacts: $(npx supabase db execute 'select count(*) from contacts')"
  echo "- interactions: $(npx supabase db execute 'select count(*) from interactions')"
  echo "- budgets: $(npx supabase db execute 'select count(*) from budgets')"
  echo "- tasks: $(npx supabase db execute 'select count(*) from tasks')"
  echo "- vendors: $(npx supabase db execute 'select count(*) from vendors')"
  echo "- event_settings: $(npx supabase db execute 'select count(*) from event_settings')"
else
  echo ""
  echo "❌ Sample data migration failed!"
  echo "Check the error messages above."
  exit 1
fi
