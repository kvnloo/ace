#!/bin/bash

# Visual Testing Setup Script
# Automates initial setup and baseline generation for visual validation tests

set -e

echo "🎨 Visual Validation Testing Setup"
echo "=================================="
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install Node.js and npm first."
    exit 1
fi

# Check if we're in the project root
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Install Playwright browsers
echo "🌐 Installing Playwright browsers..."
npx playwright install chromium
echo "✅ Chromium browser installed"
echo ""

# Check if baselines already exist
SNAPSHOTS_DIR="tests/e2e/visual-validation.spec.ts-snapshots"
if [ -d "$SNAPSHOTS_DIR" ]; then
    echo "⚠️  Baseline snapshots already exist at: $SNAPSHOTS_DIR"
    echo ""
    read -p "Do you want to regenerate baselines? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Skipping baseline generation. Existing baselines will be used."
        GENERATE_BASELINES=false
    else
        echo "Regenerating baselines..."
        GENERATE_BASELINES=true
    fi
else
    echo "📸 No baselines found. Will generate initial baselines."
    GENERATE_BASELINES=true
fi

echo ""

# Generate baselines if needed
if [ "$GENERATE_BASELINES" = true ]; then
    echo "🎬 Starting development server..."

    # Start dev server in background
    npm run dev > /dev/null 2>&1 &
    DEV_SERVER_PID=$!

    # Wait for server to be ready
    echo "Waiting for server to start..."
    sleep 5

    # Check if server is running
    if ! kill -0 $DEV_SERVER_PID 2>/dev/null; then
        echo "❌ Development server failed to start"
        exit 1
    fi

    echo "✅ Development server running (PID: $DEV_SERVER_PID)"
    echo ""

    echo "📸 Generating baseline screenshots..."
    echo "This may take 2-3 minutes..."
    echo ""

    # Generate baselines
    if npm run test:e2e -- --update-snapshots tests/e2e/visual-validation.spec.ts --project=chromium; then
        echo ""
        echo "✅ Baselines generated successfully!"

        # Count generated snapshots
        SNAPSHOT_COUNT=$(find "$SNAPSHOTS_DIR" -type f -name "*.png" 2>/dev/null | wc -l)
        echo "📊 Generated $SNAPSHOT_COUNT baseline snapshots"
    else
        echo ""
        echo "❌ Baseline generation failed"
        kill $DEV_SERVER_PID 2>/dev/null || true
        exit 1
    fi

    # Stop dev server
    echo ""
    echo "🛑 Stopping development server..."
    kill $DEV_SERVER_PID 2>/dev/null || true
    wait $DEV_SERVER_PID 2>/dev/null || true
    echo "✅ Development server stopped"
fi

echo ""
echo "🎯 Running initial test suite..."
echo ""

# Start dev server again for tests
npm run dev > /dev/null 2>&1 &
DEV_SERVER_PID=$!
sleep 5

# Run tests
if npm run test:e2e tests/e2e/visual-validation.spec.ts --project=chromium; then
    echo ""
    echo "✅ All visual validation tests passed!"
    TEST_STATUS=0
else
    echo ""
    echo "⚠️  Some tests failed. This may be expected on first run."
    echo "Review the test report for details."
    TEST_STATUS=1
fi

# Stop dev server
kill $DEV_SERVER_PID 2>/dev/null || true
wait $DEV_SERVER_PID 2>/dev/null || true

echo ""
echo "🎉 Visual Testing Setup Complete!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Run tests:"
echo "   npm run test:e2e tests/e2e/visual-validation.spec.ts"
echo ""
echo "2. View test report:"
echo "   npm run test:e2e:report"
echo ""
echo "3. Run in headed mode (see browser):"
echo "   npm run test:e2e:headed tests/e2e/visual-validation.spec.ts"
echo ""
echo "4. Update baselines after UI changes:"
echo "   npm run test:e2e -- --update-snapshots tests/e2e/visual-validation.spec.ts"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📚 Documentation:"
echo "   - Quick start: tests/e2e/VISUAL_TESTING_QUICKSTART.md"
echo "   - Full docs:   tests/e2e/VISUAL_VALIDATION.md"
echo ""
echo "🐛 Issues? Check:"
echo "   - Browser console for WebGL errors"
echo "   - Asset loading in network tab"
echo "   - Test report for visual diffs"
echo ""

exit $TEST_STATUS
