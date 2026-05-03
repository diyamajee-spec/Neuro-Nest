#!/bin/bash

# Neuro-Nest Local Startup Script
echo "=========================================="
echo "   🧠 NEURO-NEST: AI CAREER ENGINE        "
echo "=========================================="

# Check for .env file
if [ ! -f .env ] && [ ! -f .env.local ]; then
    echo "⚠️ Warning: .env.local file not found!"
    echo "Please copy .env.example to .env.local and fill in your keys."
    if [ -f .env.example ]; then
        cp .env.example .env.local
        echo "✅ Created .env.local from .env.example template."
    fi
fi

# Check for node_modules
if [ ! -d "node_modules" ]; then
    echo "📦 node_modules missing. Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Error: npm install failed. Please check your Node.js installation."
        exit 1
    fi
fi

# Start the application
echo "🚀 Launching development server on http://localhost:8080..."
npm run dev
