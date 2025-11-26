#!/bin/bash

# Verify Loading Screen Fix
# This script verifies that the loading screen fix is working correctly

echo "🔍 Verifying Loading Screen Fix..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check 1: Verify no duplicate LoadingProvider in App.tsx
echo "1️⃣ Checking for duplicate LoadingProvider..."
if grep -q "import.*LoadingProvider.*from.*LoadingProvider" src/App.tsx; then
  if grep -q "useLoading" src/App.tsx; then
    echo -e "${GREEN}✅ PASS: App.tsx uses useLoading hook (correct)${NC}"
  else
    echo -e "${RED}❌ FAIL: App.tsx imports LoadingProvider but doesn't use hook${NC}"
  fi
else
  echo -e "${RED}❌ FAIL: App.tsx doesn't import LoadingProvider hook${NC}"
fi

if grep -q "<LoadingProvider" src/App.tsx; then
  echo -e "${RED}❌ FAIL: Duplicate LoadingProvider found in App.tsx${NC}"
else
  echo -e "${GREEN}✅ PASS: No duplicate LoadingProvider in App.tsx${NC}"
fi

# Check 2: Verify main.tsx has autoStart={false}
echo ""
echo "2️⃣ Checking main.tsx autoStart configuration..."
if grep -q "autoStart={false}" src/main.tsx; then
  echo -e "${GREEN}✅ PASS: autoStart is set to false${NC}"
else
  echo -e "${RED}❌ FAIL: autoStart should be false${NC}"
fi

# Check 3: Verify startLoading is called in App.tsx
echo ""
echo "3️⃣ Checking for manual loading trigger..."
if grep -q "startLoading()" src/App.tsx; then
  echo -e "${GREEN}✅ PASS: startLoading() is called${NC}"
else
  echo -e "${RED}❌ FAIL: startLoading() not found${NC}"
fi

# Check 4: Build verification
echo ""
echo "4️⃣ Verifying build..."
if npm run build > /tmp/build-check.log 2>&1; then
  echo -e "${GREEN}✅ PASS: Build successful${NC}"
else
  echo -e "${RED}❌ FAIL: Build failed${NC}"
  echo "Check /tmp/build-check.log for details"
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "The loading screen fix includes:"
echo "  • Removed duplicate LoadingProvider from App.tsx"
echo "  • Changed autoStart from true to false in main.tsx"
echo "  • Added manual startLoading() trigger when entering 3D view"
echo "  • LoadingScreen now correctly reads from single context"
echo ""
echo "To test manually:"
echo "  1. npm run dev"
echo "  2. Open http://localhost:5173"
echo "  3. Click 'Explore 3D Demo'"
echo "  4. Loading screen should appear and show progress"
echo ""
echo "Manual test page: http://localhost:5173/tests/manual-loading-test.html"
echo ""
