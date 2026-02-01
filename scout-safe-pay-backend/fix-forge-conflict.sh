#!/bin/bash
# Fix Forge Deployment Conflict
# Run this on Forge to resolve the merge conflict

echo "🔧 Fixing Forge Deployment Conflict..."
echo ""

cd /home/forge/adminautoscout.dev

echo "1️⃣ Removing conflicting file..."
rm -f scout-safe-pay-backend/app/Models/DatabaseNotification.php
echo "✅ File removed"
echo ""

echo "2️⃣ Resetting git state..."
git reset --hard HEAD
echo "✅ Git reset"
echo ""

echo "3️⃣ Pulling latest changes..."
git fetch origin
git pull origin main
echo "✅ Code updated"
echo ""

echo "4️⃣ Running deployment script..."
bash .forge-deploy
echo ""

echo "✅ DONE! Deployment should be successful now."
echo ""
echo "Check admin panel: https://adminautoscout.dev/admin"
