#!/bin/bash

# GitHub Actions Workflow Monitor
# Monitors latest deployment workflows

echo "🚀 GitHub Actions Deployment Monitor"
echo "===================================="
echo ""

# GitHub repository
REPO="lauraedgell33/autoscout"
BRANCH="main"

echo "Repository: $REPO"
echo "Branch: $BRANCH"
echo "Time: $(date)"
echo ""

# Check latest workflow runs (requires gh CLI)
if command -v gh &> /dev/null; then
    echo "📊 Latest Workflow Runs:"
    echo ""
    gh run list --repo "$REPO" --limit 5 --json status,name,createdAt,conclusion
else
    echo "⚠️  GitHub CLI not installed. Using curl..."
    echo ""
    
    # Fallback: use curl to get workflow runs
    curl -s -H "Accept: application/vnd.github+json" \
        "https://api.github.com/repos/$REPO/actions/runs?branch=$BRANCH&per_page=5" | \
        python3 -c "
import sys, json
data = json.load(sys.stdin)
print('Latest 5 Workflow Runs:')
print('=' * 80)
for run in data['workflow_runs']:
    status = '✅' if run['status'] == 'completed' else '🔄' if run['status'] == 'in_progress' else '❌'
    conclusion = run['conclusion'] or 'pending'
    print(f\"{status} {run['name']:<40} {run['status']:<15} {conclusion}\")
    print(f\"   Created: {run['created_at']}\")
    print(f\"   URL: {run['html_url']}\")
    print()
" || echo "Failed to parse response"
fi

echo ""
echo "🔗 Open in browser:"
echo "https://github.com/$REPO/actions"
