@echo off
title Neuro-Nest Startup
echo ==========================================
echo    🧠 NEURO-NEST: AI CAREER ENGINE        
echo ==========================================

:: Check for .env file
if not exist .env.local (
    if not exist .env (
        echo ⚠️ Warning: .env.local file not found!
        if exist .env.example (
            copy .env.example .env.local
            echo ✅ Created .env.local from .env.example template.
        )
    )
)

:: Check for node_modules
if not exist node_modules (
    echo 📦 node_modules missing. Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ Error: npm install failed.
        pause
        exit /b %errorlevel%
    )
)

:: Start the application
echo 🚀 Launching development server on http://localhost:8080...
npm run dev
pause
