#!/bin/bash

echo "🚀 Starting ixJOB Server..."

# Check if we're in the server directory
if [ ! -f "src/index.ts" ]; then
    echo "❌ Please run this script from the server directory"
    echo "💡 Run: cd server && ./start-dev.sh"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the development server
echo "🔥 Starting development server..."
npx tsx watch src/index.ts