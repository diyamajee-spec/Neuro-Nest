@echo off
title Neuro-Nest Startup
echo ==========================================
echo    🧠 NEURO-NEST: AI CAREER ENGINE        
echo ==========================================

:: Ensure environment file exists
if not exist .env.local (
    if exist .env.example (
        echo ⚠️ .env.local file not found. Creating from .env.example...
        copy .env.example .env.local
        echo ✅ Created .env.local from .env.example template.
    ) else (
        echo ⚠️ .env.local file not found and .env.example is missing.
        echo Please create .env.local with your Supabase and Gemini keys.
    )
)

:: Install dependencies if needed
if not exist node_modules (
    echo 📦 node_modules missing. Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ Error: npm install failed.
        pause
        exit /b %errorlevel%
    )
)

:: Choose an available port
setlocal enabledelayedexpansion
set "PORT=8080"
for %%P in (8080 8081 8082 8083 8084) do (
    set "IN_USE=0"
    for /f "tokens=5" %%A in ('netstat -ano ^| findstr /C:":%%P " ^| findstr LISTENING') do (
        set "IN_USE=1"
    )
    if !IN_USE! EQU 0 (
        set "PORT=%%P"
        goto :PORT_FOUND
    )
)
:PORT_FOUND
endlocal & set "PORT=%PORT%"

echo 🚀 Launching development server on http://localhost:%PORT%...
call npm run dev -- -p %PORT%
pause
