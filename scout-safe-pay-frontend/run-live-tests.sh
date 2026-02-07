#!/bin/bash

# AutoScout24 SafeTrade - Live E2E Test Runner
# This script runs Playwright E2E tests against live production servers
#
# Usage:
#   ./run-live-tests.sh              # Run all live tests
#   ./run-live-tests.sh frontend     # Run only frontend tests
#   ./run-live-tests.sh admin        # Run only admin panel tests
#   ./run-live-tests.sh --headed     # Run with browser visible
#   ./run-live-tests.sh --ui         # Run with Playwright UI

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     AutoScout24 SafeTrade - Live E2E Test Runner          ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Parse arguments
TEST_TYPE="all"
EXTRA_ARGS=""

while [[ $# -gt 0 ]]; do
  case $1 in
    frontend)
      TEST_TYPE="frontend"
      shift
      ;;
    admin)
      TEST_TYPE="admin"
      shift
      ;;
    --headed)
      EXTRA_ARGS="$EXTRA_ARGS --headed"
      shift
      ;;
    --ui)
      EXTRA_ARGS="$EXTRA_ARGS --ui"
      shift
      ;;
    --debug)
      EXTRA_ARGS="$EXTRA_ARGS --debug"
      shift
      ;;
    *)
      EXTRA_ARGS="$EXTRA_ARGS $1"
      shift
      ;;
  esac
done

# Change to frontend directory
cd "$SCRIPT_DIR"

echo -e "${YELLOW}Test Configuration:${NC}"
echo -e "  Test Type: ${GREEN}$TEST_TYPE${NC}"
echo -e "  Extra Args: ${GREEN}$EXTRA_ARGS${NC}"
echo ""

# Create screenshots directory
mkdir -p test-results/screenshots

# Run tests based on type
case $TEST_TYPE in
  frontend)
    echo -e "${BLUE}Running Frontend Tests...${NC}"
    echo -e "  Target: ${GREEN}https://www.autoscout24safetrade.com${NC}"
    echo ""
    npx playwright test --config=playwright.live.config.ts --project=frontend-chrome $EXTRA_ARGS
    ;;
  admin)
    echo -e "${BLUE}Running Admin Panel Tests...${NC}"
    echo -e "  Target: ${GREEN}https://adminautoscout.dev${NC}"
    echo ""
    npx playwright test --config=playwright.live.config.ts --project=admin-chrome $EXTRA_ARGS
    ;;
  all)
    echo -e "${BLUE}Running All Live Tests...${NC}"
    echo -e "  Frontend: ${GREEN}https://www.autoscout24safetrade.com${NC}"
    echo -e "  Admin: ${GREEN}https://adminautoscout.dev${NC}"
    echo ""
    npx playwright test --config=playwright.live.config.ts $EXTRA_ARGS
    ;;
esac

# Check result
if [ $? -eq 0 ]; then
  echo ""
  echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║               All tests passed successfully!               ║${NC}"
  echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
else
  echo ""
  echo -e "${RED}╔════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${RED}║                   Some tests failed!                        ║${NC}"
  echo -e "${RED}╚════════════════════════════════════════════════════════════╝${NC}"
  exit 1
fi

# Show report location
echo ""
echo -e "${YELLOW}Test Reports:${NC}"
echo -e "  HTML Report: ${BLUE}test-results/live-report/index.html${NC}"
echo -e "  JSON Report: ${BLUE}test-results/live-results.json${NC}"
echo ""
echo -e "${YELLOW}To view the HTML report:${NC}"
echo -e "  ${GREEN}npx playwright show-report test-results/live-report${NC}"
