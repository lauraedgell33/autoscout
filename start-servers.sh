#!/bin/bash

echo "🚀 Starting AutoScout24 SafeTrade Payment System..."
echo ""

# Start Backend
echo "📦 Starting Backend (Laravel)..."
cd scout-safe-pay-backend
php artisan serve --port=8002 > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"
echo "   Backend URL: http://localhost:8002"
echo "   Admin Panel: http://localhost:8002/admin"
cd ..

# Wait for backend to start
sleep 2

# Start Frontend
echo ""
echo "🎨 Starting Frontend (Next.js)..."
cd scout-safe-pay-frontend
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"
echo "   Frontend URL: http://localhost:3001"
cd ..

echo ""
echo "✅ All servers started!"
echo ""
echo "📋 Quick Links:"
echo "   Frontend:    http://localhost:3001"
echo "   Backend API: http://localhost:8002/api"
echo "   Admin Panel: http://localhost:8002/admin (admin@autoscout24.com / password)"
echo ""
echo "📝 Logs:"
echo "   Backend:  tail -f /tmp/backend.log"
echo "   Frontend: tail -f /tmp/frontend.log"
echo ""
echo "🛑 To stop servers: ./stop-servers.sh"
