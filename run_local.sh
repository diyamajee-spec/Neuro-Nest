#!/usr/bin/env bash
# Neuro-Nest Local Startup Script
echo "=========================================="
echo "   🧠 NEURO-NEST: AI CAREER ENGINE        "
echo "=========================================="

# Ensure .env.local exists
if [ ! -f .env.local ]; then
    if [ -f .env.example ]; then
        echo "⚠️ .env.local file not found. Creating from .env.example..."
        cp .env.example .env.local
        echo "✅ Created .env.local from .env.example template."
    else
        echo "⚠️ .env.local file not found and .env.example is missing."
        echo "Please create .env.local with your Supabase and Gemini keys."
    fi
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 node_modules missing. Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Error: npm install failed. Please check your Node.js installation."
        exit 1
    fi
fi

# Choose an available port
PORT=8080
for candidate in 8080 8081 8082 8083 8084; do
    if ! (exec 3<>/dev/tcp/127.0.0.1/$candidate) 2>/dev/null; then
        PORT=$candidate
        break
    fi
done

echo "🚀 Launching development server on http://localhost:$PORT..."
npm run dev -- -p "$PORT"
