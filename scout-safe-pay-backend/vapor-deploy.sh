#!/bin/bash

# Add Vapor to PATH
export PATH="$HOME/.config/composer/vendor/bin:$HOME/.composer/vendor/bin:$PATH"

echo "=========================================="
echo "🚀 Laravel Vapor Deployment Helper"
echo "=========================================="
echo ""

# Check if vapor is available
if ! command -v vapor &> /dev/null; then
    echo "❌ Vapor CLI not found!"
    echo "Run: composer global require laravel/vapor-cli"
    exit 1
fi

echo "✅ Vapor CLI found: $(vapor --version)"
echo ""

# Show menu
echo "Select action:"
echo "1) vapor login"
echo "2) vapor init"
echo "3) vapor deploy production"
echo "4) vapor logs production"
echo "5) vapor metrics production"
echo "6) vapor database:create production"
echo "7) vapor cache:create production"
echo "8) Exit"
echo ""

read -p "Enter choice [1-8]: " choice

case $choice in
    1)
        vapor login
        ;;
    2)
        vapor init
        ;;
    3)
        echo "🚀 Deploying to production..."
        vapor deploy production
        ;;
    4)
        vapor logs production
        ;;
    5)
        vapor metrics production
        ;;
    6)
        vapor database:create production
        ;;
    7)
        vapor cache:create production
        ;;
    8)
        echo "Bye!"
        exit 0
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac
