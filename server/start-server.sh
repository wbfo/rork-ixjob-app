#!/bin/bash

# ixJOB Server Startup Script
echo "🚀 Starting ixJOB Backend Server..."

# Check if we're in the server directory
if [ ! -f "src/index.ts" ]; then
    echo "❌ Please run this script from the server directory"
    echo "   cd server && ./start-server.sh"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ first."
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if .env exists, if not copy from example
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        echo "📋 Creating .env from .env.example..."
        cp .env.example .env
        echo "✅ Please edit .env file with your configuration"
    else
        echo "⚠️  No .env file found. Server will run with defaults."
    fi
fi

# Start the server
echo "🎯 Starting development server..."
if command -v tsx &> /dev/null; then
    tsx watch src/index.ts
elif command -v ts-node &> /dev/null; then
    ts-node src/index.ts
else
    echo "📦 Installing tsx for TypeScript execution..."
    npm install -g tsx
    tsx watch src/index.ts
fi