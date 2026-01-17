#!/bin/bash

echo "🛑 Stopping AutoScout24 SafeTrade Payment System..."
echo ""

# Stop Backend (Laravel)
echo "📦 Stopping Backend..."
BACKEND_PIDS=$(lsof -ti:8002)
if [ ! -z "$BACKEND_PIDS" ]; then
    echo "$BACKEND_PIDS" | xargs kill -9 2>/dev/null
    echo "   ✓ Backend stopped"
else
    echo "   ⚠ Backend not running"
fi

# Stop Frontend (Next.js)
echo "🎨 Stopping Frontend..."
FRONTEND_PIDS=$(lsof -ti:3001)
if [ ! -z "$FRONTEND_PIDS" ]; then
    echo "$FRONTEND_PIDS" | xargs kill -9 2>/dev/null
    echo "   ✓ Frontend stopped"
else
    echo "   ⚠ Frontend not running"
fi

echo ""
echo "✅ All servers stopped!"
