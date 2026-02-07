#!/bin/bash

#############################################
# AutoScout24 SafeTrade - Comprehensive Test Runner
#############################################

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║     AutoScout24 SafeTrade - Comprehensive Test Suite          ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Configuration
BACKEND_DIR="scout-safe-pay-backend"
FRONTEND_DIR="scout-safe-pay-frontend"
TEST_RESULTS_DIR="test-results"

# Create test results directory
mkdir -p "$TEST_RESULTS_DIR"

# Function to print section header
print_section() {
    echo -e "\n${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}  $1${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

# Function to check if command succeeded
check_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ $2 PASSED${NC}"
        return 0
    else
        echo -e "${RED}✗ $2 FAILED${NC}"
        return 1
    fi
}

# Parse arguments
RUN_BACKEND=true
RUN_FRONTEND=true
RUN_E2E=true
SETUP_DB=true
VERBOSE=false

while [[ "$#" -gt 0 ]]; do
    case $1 in
        --backend-only) RUN_FRONTEND=false; RUN_E2E=false ;;
        --frontend-only) RUN_BACKEND=false; RUN_E2E=false ;;
        --e2e-only) RUN_BACKEND=false; RUN_FRONTEND=false ;;
        --no-db-setup) SETUP_DB=false ;;
        --verbose) VERBOSE=true ;;
        -h|--help)
            echo "Usage: ./run-tests.sh [options]"
            echo ""
            echo "Options:"
            echo "  --backend-only    Run only backend tests"
            echo "  --frontend-only   Run only frontend tests"
            echo "  --e2e-only        Run only E2E tests"
            echo "  --no-db-setup     Skip database setup"
            echo "  --verbose         Show verbose output"
            echo "  -h, --help        Show this help"
            exit 0
            ;;
        *) echo "Unknown parameter: $1"; exit 1 ;;
    esac
    shift
done

# Track overall status
BACKEND_STATUS=0
FRONTEND_STATUS=0
E2E_STATUS=0

#############################################
# Backend Tests
#############################################

if [ "$RUN_BACKEND" = true ]; then
    print_section "BACKEND TESTS (Laravel)"
    
    cd "$BACKEND_DIR" || exit 1
    
    # Setup test database
    if [ "$SETUP_DB" = true ]; then
        echo -e "${BLUE}Setting up test database...${NC}"
        
        # Create testing database if using SQLite
        if [ ! -f "database/database.sqlite" ]; then
            touch database/database.sqlite
        fi
        
        # Run migrations for testing
        php artisan migrate:fresh --env=testing --seed --seeder=RoleSeeder 2>/dev/null
        
        # Run test user seeder
        php artisan db:seed --class=TestUserSeeder --env=testing 2>/dev/null
        
        echo -e "${GREEN}✓ Test database ready${NC}"
    fi
    
    # Run PHPUnit tests
    echo -e "\n${BLUE}Running PHPUnit tests...${NC}\n"
    
    if [ "$VERBOSE" = true ]; then
        php artisan test --verbose
    else
        php artisan test
    fi
    
    BACKEND_STATUS=$?
    check_status $BACKEND_STATUS "Backend Tests"
    
    cd ..
fi

#############################################
# Frontend Tests (Jest)
#############################################

if [ "$RUN_FRONTEND" = true ]; then
    print_section "FRONTEND UNIT TESTS (Jest)"
    
    cd "$FRONTEND_DIR" || exit 1
    
    echo -e "${BLUE}Running Jest tests...${NC}\n"
    
    if [ "$VERBOSE" = true ]; then
        npm test -- --verbose --coverage 2>&1
    else
        npm test -- --coverage 2>&1
    fi
    
    FRONTEND_STATUS=$?
    check_status $FRONTEND_STATUS "Frontend Unit Tests"
    
    cd ..
fi

#############################################
# E2E Tests (Playwright)
#############################################

if [ "$RUN_E2E" = true ]; then
    print_section "E2E INTEGRATION TESTS (Playwright)"
    
    cd "$FRONTEND_DIR" || exit 1
    
    echo -e "${BLUE}Running Playwright E2E tests...${NC}\n"
    
    # Check if servers are running
    BACKEND_RUNNING=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8002/api/health 2>/dev/null)
    FRONTEND_RUNNING=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002 2>/dev/null)
    
    if [ "$BACKEND_RUNNING" != "200" ]; then
        echo -e "${YELLOW}⚠ Backend server not running on port 8002${NC}"
        echo -e "${YELLOW}  Start it with: cd scout-safe-pay-backend && php artisan serve --port=8002${NC}"
    fi
    
    if [ "$FRONTEND_RUNNING" != "200" ] && [ "$FRONTEND_RUNNING" != "302" ]; then
        echo -e "${YELLOW}⚠ Frontend server not running on port 3002${NC}"
        echo -e "${YELLOW}  Start it with: cd scout-safe-pay-frontend && npm run dev${NC}"
    fi
    
    # Run Playwright tests
    if [ "$VERBOSE" = true ]; then
        npx playwright test --reporter=list 2>&1
    else
        npx playwright test 2>&1
    fi
    
    E2E_STATUS=$?
    check_status $E2E_STATUS "E2E Integration Tests"
    
    cd ..
fi

#############################################
# Summary
#############################################

print_section "TEST SUMMARY"

TOTAL_PASSED=0
TOTAL_FAILED=0

if [ "$RUN_BACKEND" = true ]; then
    if [ $BACKEND_STATUS -eq 0 ]; then
        echo -e "${GREEN}✓ Backend Tests:  PASSED${NC}"
        ((TOTAL_PASSED++))
    else
        echo -e "${RED}✗ Backend Tests:  FAILED${NC}"
        ((TOTAL_FAILED++))
    fi
fi

if [ "$RUN_FRONTEND" = true ]; then
    if [ $FRONTEND_STATUS -eq 0 ]; then
        echo -e "${GREEN}✓ Frontend Tests: PASSED${NC}"
        ((TOTAL_PASSED++))
    else
        echo -e "${RED}✗ Frontend Tests: FAILED${NC}"
        ((TOTAL_FAILED++))
    fi
fi

if [ "$RUN_E2E" = true ]; then
    if [ $E2E_STATUS -eq 0 ]; then
        echo -e "${GREEN}✓ E2E Tests:      PASSED${NC}"
        ((TOTAL_PASSED++))
    else
        echo -e "${RED}✗ E2E Tests:      FAILED${NC}"
        ((TOTAL_FAILED++))
    fi
fi

echo ""
echo -e "─────────────────────────────────────────"
echo -e "Total Passed: ${GREEN}$TOTAL_PASSED${NC}"
echo -e "Total Failed: ${RED}$TOTAL_FAILED${NC}"
echo ""

# Test Credentials
echo -e "${BLUE}Test Credentials:${NC}"
echo "─────────────────────────────────────────────────────"
echo -e "👤 BUYER:    buyer.test@autoscout.dev    | BuyerPass123!"
echo -e "👤 SELLER:   seller.test@autoscout.dev   | SellerPass123!"
echo -e "👤 ADMIN:    admin@autoscout.dev         | Admin123!@#"
echo -e "🏢 DEALER:   dealer.test@autoscout.dev   | DealerPass123!"
echo "─────────────────────────────────────────────────────"

# Exit with appropriate code
if [ $TOTAL_FAILED -gt 0 ]; then
    exit 1
else
    echo -e "\n${GREEN}All tests completed successfully!${NC}"
    exit 0
fi
