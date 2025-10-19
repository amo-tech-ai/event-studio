#!/bin/bash

# EventOS Production Authentication Enabler
# This script helps re-enable authentication for production

echo "🔒 EventOS Production Authentication Enabler"
echo "============================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the event-studio root directory"
    exit 1
fi

# Update local .env file
echo "📝 Updating local .env file..."
if grep -q "VITE_DISABLE_AUTH" .env; then
    sed -i 's/VITE_DISABLE_AUTH=.*/VITE_DISABLE_AUTH=false/' .env
    echo "✅ Updated VITE_DISABLE_AUTH=false in .env"
else
    echo "VITE_DISABLE_AUTH=false" >> .env
    echo "✅ Added VITE_DISABLE_AUTH=false to .env"
fi

# Update Vercel environment variables
echo ""
echo "🚀 Updating Vercel environment variables..."

# Remove existing variable
echo "🗑️  Removing existing VITE_DISABLE_AUTH..."
vercel env rm VITE_DISABLE_AUTH --yes 2>/dev/null || true

# Add correct variable
echo "➕ Adding VITE_DISABLE_AUTH=false to all environments..."
echo "false" | vercel env add VITE_DISABLE_AUTH production
echo "false" | vercel env add VITE_DISABLE_AUTH preview  
echo "false" | vercel env add VITE_DISABLE_AUTH development

echo ""
echo "✅ Authentication enabled for production!"
echo ""
echo "📋 What was done:"
echo "   • Updated local .env file with VITE_DISABLE_AUTH=false"
echo "   • Updated Vercel environment variables for all environments"
echo ""
echo "🔒 Your app now requires authentication at:"
echo "   • Local: http://localhost:5173"
echo "   • Production: https://event-studio-rho.vercel.app"
echo ""
echo "🔄 To disable authentication for development, run:"
echo "   ./disable-auth.sh"
