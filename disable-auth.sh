#!/bin/bash

# EventOS Development Authentication Disabler
# This script helps disable authentication during development

echo "🔓 EventOS Development Authentication Disabler"
echo "=============================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the event-studio root directory"
    exit 1
fi

# Update local .env file
echo "📝 Updating local .env file..."
if grep -q "VITE_DISABLE_AUTH" .env; then
    sed -i 's/VITE_DISABLE_AUTH=.*/VITE_DISABLE_AUTH=true/' .env
    echo "✅ Updated VITE_DISABLE_AUTH=true in .env"
else
    echo "VITE_DISABLE_AUTH=true" >> .env
    echo "✅ Added VITE_DISABLE_AUTH=true to .env"
fi

# Update Vercel environment variables
echo ""
echo "🚀 Updating Vercel environment variables..."

# Remove existing variable
echo "🗑️  Removing existing VITE_DISABLE_AUTH..."
vercel env rm VITE_DISABLE_AUTH --yes 2>/dev/null || true

# Add correct variable
echo "➕ Adding VITE_DISABLE_AUTH=true to all environments..."
echo "true" | vercel env add VITE_DISABLE_AUTH production
echo "true" | vercel env add VITE_DISABLE_AUTH preview  
echo "true" | vercel env add VITE_DISABLE_AUTH development

echo ""
echo "✅ Authentication disabled for development!"
echo ""
echo "📋 What was done:"
echo "   • Updated local .env file with VITE_DISABLE_AUTH=true"
echo "   • Updated Vercel environment variables for all environments"
echo ""
echo "🌐 Your app should now be accessible without authentication at:"
echo "   • Local: http://localhost:5173"
echo "   • Production: https://event-studio-rho.vercel.app"
echo ""
echo "⚠️  Remember to re-enable authentication before production deployment!"
echo ""
echo "🔄 To re-enable authentication later, run:"
echo "   ./enable-auth.sh"
