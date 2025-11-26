#!/bin/bash

# Error Recovery Test Execution Script
# Run this script to execute error recovery tests

set -e

echo "🧪 Error Recovery Testing Suite"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_warning "node_modules not found. Installing dependencies..."
    npm install
fi

# Check if Playwright is installed
if ! npx playwright --version &> /dev/null; then
    print_warning "Playwright not found. Installing..."
    npm install -D @playwright/test
    npx playwright install
fi

echo ""
print_info "Available test commands:"
echo ""
echo "1. Run all error recovery tests (all browsers)"
echo "2. Run on Chromium only"
echo "3. Run on Firefox only"
echo "4. Run on WebKit only"
echo "5. Run with UI mode (visual debugging)"
echo "6. Run in debug mode (step through tests)"
echo "7. Run specific test category"
echo "8. View test report"
echo "9. Exit"
echo ""

read -p "Select option (1-9): " option

case $option in
    1)
        print_info "Running all error recovery tests on all browsers..."
        npm run test:e2e tests/e2e/error-recovery.spec.ts
        print_success "Tests completed!"
        ;;
    2)
        print_info "Running tests on Chromium..."
        npm run test:e2e:chromium tests/e2e/error-recovery.spec.ts
        print_success "Chromium tests completed!"
        ;;
    3)
        print_info "Running tests on Firefox..."
        npm run test:e2e:firefox tests/e2e/error-recovery.spec.ts
        print_success "Firefox tests completed!"
        ;;
    4)
        print_info "Running tests on WebKit..."
        npm run test:e2e:webkit tests/e2e/error-recovery.spec.ts
        print_success "WebKit tests completed!"
        ;;
    5)
        print_info "Opening UI mode..."
        npm run test:e2e:ui tests/e2e/error-recovery.spec.ts
        ;;
    6)
        print_info "Opening debug mode..."
        npm run test:e2e:debug tests/e2e/error-recovery.spec.ts
        ;;
    7)
        echo ""
        echo "Test Categories:"
        echo "1. Asset Loading Failures"
        echo "2. Network Failures"
        echo "3. WebGL Support"
        echo "4. Loading Timeouts"
        echo "5. JavaScript Errors"
        echo "6. User Feedback Quality"
        echo "7. Progressive Enhancement"
        echo ""
        read -p "Select category (1-7): " category
        
        case $category in
            1)
                print_info "Running Asset Loading tests..."
                npx playwright test -g "Asset Loading" tests/e2e/error-recovery.spec.ts
                ;;
            2)
                print_info "Running Network Failure tests..."
                npx playwright test -g "Network Failures" tests/e2e/error-recovery.spec.ts
                ;;
            3)
                print_info "Running WebGL Support tests..."
                npx playwright test -g "WebGL Support" tests/e2e/error-recovery.spec.ts
                ;;
            4)
                print_info "Running Loading Timeout tests..."
                npx playwright test -g "Loading Timeouts" tests/e2e/error-recovery.spec.ts
                ;;
            5)
                print_info "Running JavaScript Error tests..."
                npx playwright test -g "JavaScript Errors" tests/e2e/error-recovery.spec.ts
                ;;
            6)
                print_info "Running User Feedback Quality tests..."
                npx playwright test -g "User Feedback Quality" tests/e2e/error-recovery.spec.ts
                ;;
            7)
                print_info "Running Progressive Enhancement tests..."
                npx playwright test -g "Progressive Enhancement" tests/e2e/error-recovery.spec.ts
                ;;
            *)
                print_warning "Invalid category selected"
                exit 1
                ;;
        esac
        print_success "Category tests completed!"
        ;;
    8)
        print_info "Opening test report..."
        npm run test:e2e:report
        ;;
    9)
        print_info "Exiting..."
        exit 0
        ;;
    *)
        print_warning "Invalid option selected"
        exit 1
        ;;
esac

echo ""
print_success "Done!"
echo ""
print_info "Next steps:"
echo "  - View report: npm run test:e2e:report"
echo "  - Debug failing test: npm run test:e2e:debug"
echo "  - Run in UI mode: npm run test:e2e:ui"
echo ""
