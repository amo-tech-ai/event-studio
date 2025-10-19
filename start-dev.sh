#!/bin/bash

# Event Studio Development Server with Auto-Open Chrome
# This script starts the Vite dev server and automatically opens Chrome

echo "🚀 Starting Event Studio Development Server..."
echo "📁 Working directory: $(pwd)"

# Kill any existing Vite processes
pkill -f vite 2>/dev/null

# Start Vite development server in background
echo "⚡ Starting Vite server on port 5173..."
npx vite --host 0.0.0.0 --port 5173 &

# Wait for server to start
echo "⏳ Waiting for server to initialize..."
sleep 3

# Check if server is running
if curl -s http://localhost:5173 > /dev/null; then
    echo "✅ Server is running at http://localhost:5173"
    echo "🌐 Opening Chrome browser..."
    
    # Open Chrome (try different Chrome commands)
    if command -v google-chrome &> /dev/null; then
        google-chrome --new-window http://localhost:5173 &
    elif command -v google-chrome-stable &> /dev/null; then
        google-chrome-stable --new-window http://localhost:5173 &
    elif command -v chromium-browser &> /dev/null; then
        chromium-browser --new-window http://localhost:5173 &
    else
        echo "❌ Chrome not found. Please open http://localhost:5173 manually"
    fi
    
    echo "🎉 Development server ready!"
    echo "📝 Server URL: http://localhost:5173"
    echo "🔄 Hot reload enabled - changes will auto-refresh"
    echo ""
    echo "Press Ctrl+C to stop the server"
    
    # Keep script running and show server logs
    wait
else
    echo "❌ Failed to start server. Please check the output above."
    exit 1
fi
