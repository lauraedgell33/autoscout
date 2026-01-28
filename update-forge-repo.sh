#!/bin/bash

# Update Forge Site Repository via API
# Usage: ./update-forge-repo.sh <FORGE_API_TOKEN> <SERVER_ID> <SITE_ID>

set -e

FORGE_API_TOKEN="${1:-$FORGE_API_TOKEN}"
SERVER_ID="${2:-YOUR_SERVER_ID}"
SITE_ID="${3:-YOUR_SITE_ID}"

if [ -z "$FORGE_API_TOKEN" ]; then
    echo "❌ Error: FORGE_API_TOKEN is required"
    echo ""
    echo "Usage:"
    echo "  ./update-forge-repo.sh <FORGE_API_TOKEN> <SERVER_ID> <SITE_ID>"
    echo ""
    echo "Or set environment variable:"
    echo "  export FORGE_API_TOKEN='your-token-here'"
    echo ""
    echo "Get your API token from: https://forge.laravel.com/user-profile/api"
    exit 1
fi

echo "🔧 Updating Forge site repository configuration..."
echo "Repository: lauraedgell33/autoscout"
echo "Branch: main"
echo ""

# Update site repository
response=$(curl -s -X PUT \
    "https://forge.laravel.com/api/v1/servers/${SERVER_ID}/sites/${SITE_ID}" \
    -H "Authorization: Bearer ${FORGE_API_TOKEN}" \
    -H "Accept: application/json" \
    -H "Content-Type: application/json" \
    -d '{
        "repository": "lauraedgell33/autoscout",
        "repository_branch": "main",
        "repository_provider": "github"
    }')

echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"

if echo "$response" | grep -q '"repository":"lauraedgell33/autoscout"'; then
    echo ""
    echo "✅ Repository updated successfully!"
else
    echo ""
    echo "❌ Update failed. Please check the response above."
    exit 1
fi
