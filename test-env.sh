#!/bin/bash
# Test script to verify environment variables are loaded

set -a
source .env
set +a

echo "Testing environment variable loading..."
echo ""
echo "SUPABASE_ACCESS_TOKEN: ${SUPABASE_ACCESS_TOKEN:0:20}... (truncated)"
echo "VERCEL_TOKEN: ${VERCEL_TOKEN:0:10}... (truncated)"
echo "FIRECRAWL_API_KEY: ${FIRECRAWL_API_KEY:0:10}... (truncated)"
echo ""
if [ -n "$SUPABASE_ACCESS_TOKEN" ]; then
    echo "✅ SUPABASE_ACCESS_TOKEN is loaded"
else
    echo "❌ SUPABASE_ACCESS_TOKEN is NOT loaded"
fi
