#!/bin/bash

# verify-state.sh - Verify the health of the project state
# Usage: ./scripts/verify-state.sh

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Track overall health
HEALTH_SCORE=0
MAX_HEALTH=100

echo
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Project State Verification${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo

# Git Status Check
echo -e "${CYAN}[1/6]${NC} ${BLUE}Git Status${NC}"
echo

CURRENT_BRANCH=$(git branch --show-current)
CURRENT_COMMIT=$(git rev-parse HEAD | cut -c1-7)

echo -e "  Branch:        ${YELLOW}${CURRENT_BRANCH}${NC}"
echo -e "  Commit:        ${YELLOW}${CURRENT_COMMIT}${NC}"

# Check for uncommitted changes
if git diff-index --quiet HEAD --; then
    echo -e "  Changes:       ${GREEN}✓ None${NC}"
    HEALTH_SCORE=$((HEALTH_SCORE + 15))
else
    MODIFIED=$(git diff --name-only | wc -l)
    echo -e "  Changes:       ${YELLOW}⚠️  ${MODIFIED} modified files${NC}"
    HEALTH_SCORE=$((HEALTH_SCORE + 5))
fi

# Check for untracked files
UNTRACKED=$(git ls-files --others --exclude-standard | wc -l)
if [ "$UNTRACKED" -eq 0 ]; then
    echo -e "  Untracked:     ${GREEN}✓ None${NC}"
    HEALTH_SCORE=$((HEALTH_SCORE + 15))
else
    echo -e "  Untracked:     ${YELLOW}⚠️  ${UNTRACKED} files${NC}"
    HEALTH_SCORE=$((HEALTH_SCORE + 5))
fi

# Check if on main or feature branch
if [ "$CURRENT_BRANCH" = "main" ]; then
    echo -e "  Branch Type:   ${GREEN}✓ Main branch${NC}"
    HEALTH_SCORE=$((HEALTH_SCORE + 10))
elif [[ "$CURRENT_BRANCH" =~ ^(feature|enhance|fix)/ ]]; then
    echo -e "  Branch Type:   ${GREEN}✓ Feature branch${NC}"
    HEALTH_SCORE=$((HEALTH_SCORE + 10))
else
    echo -e "  Branch Type:   ${YELLOW}⚠️  ${CURRENT_BRANCH}${NC}"
    HEALTH_SCORE=$((HEALTH_SCORE + 5))
fi

echo

# Dependencies Check
echo -e "${CYAN}[2/6]${NC} ${BLUE}Dependencies${NC}"
echo

if [ -f "package.json" ]; then
    echo -e "  package.json:  ${GREEN}✓ Found${NC}"
    HEALTH_SCORE=$((HEALTH_SCORE + 10))
else
    echo -e "  package.json:  ${RED}✗ Missing${NC}"
fi

if [ -f "package-lock.json" ]; then
    echo -e "  package-lock:  ${GREEN}✓ Found${NC}"
    HEALTH_SCORE=$((HEALTH_SCORE + 5))
else
    echo -e "  package-lock:  ${YELLOW}⚠️  Missing${NC}"
fi

if [ -d "node_modules" ]; then
    MODULE_COUNT=$(find node_modules -maxdepth 1 -type d 2>/dev/null | wc -l)
    echo -e "  node_modules:  ${GREEN}✓ Present (${MODULE_COUNT} packages)${NC}"
    HEALTH_SCORE=$((HEALTH_SCORE + 10))
else
    echo -e "  node_modules:  ${RED}✗ Missing - run 'npm install'${NC}"
fi

echo

# Build Configuration Check
echo -e "${CYAN}[3/6]${NC} ${BLUE}Build Configuration${NC}"
echo

CONFIG_FILES=("vite.config.ts" "tsconfig.json" "tsconfig.node.json")
CONFIG_FOUND=0

for config in "${CONFIG_FILES[@]}"; do
    if [ -f "$config" ]; then
        echo -e "  ${config}: ${GREEN}✓${NC}"
        CONFIG_FOUND=$((CONFIG_FOUND + 1))
    else
        echo -e "  ${config}: ${RED}✗${NC}"
    fi
done

if [ "$CONFIG_FOUND" -eq 3 ]; then
    HEALTH_SCORE=$((HEALTH_SCORE + 15))
elif [ "$CONFIG_FOUND" -gt 0 ]; then
    HEALTH_SCORE=$((HEALTH_SCORE + 5))
fi

echo

# Code Quality Check
echo -e "${CYAN}[4/6]${NC} ${BLUE}Code Quality${NC}"
echo

# Check if we can run type checking
if [ -f "node_modules/.bin/tsc" ]; then
    echo -e "  ${YELLOW}Running type check...${NC}"
    if npx tsc --noEmit > /dev/null 2>&1; then
        echo -e "  TypeScript:    ${GREEN}✓ No errors${NC}"
        HEALTH_SCORE=$((HEALTH_SCORE + 15))
    else
        ERROR_COUNT=$(npx tsc --noEmit 2>&1 | grep -c "error TS" || echo "0")
        echo -e "  TypeScript:    ${RED}✗ ${ERROR_COUNT} errors${NC}"
    fi
else
    echo -e "  TypeScript:    ${YELLOW}⚠️  TypeScript not installed${NC}"
fi

echo

# Test Check
echo -e "${CYAN}[5/6]${NC} ${BLUE}Tests${NC}"
echo

# Check for test directories
TEST_DIRS=("tests" "test" "e2e" "__tests__")
TEST_DIR_FOUND=false

for dir in "${TEST_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        TEST_COUNT=$(find "$dir" -name "*.test.*" -o -name "*.spec.*" 2>/dev/null | wc -l)
        if [ "$TEST_COUNT" -gt 0 ]; then
            echo -e "  ${dir}/:        ${GREEN}✓ ${TEST_COUNT} test files${NC}"
            TEST_DIR_FOUND=true
            HEALTH_SCORE=$((HEALTH_SCORE + 5))
        fi
    fi
done

if [ "$TEST_DIR_FOUND" = false ]; then
    echo -e "  Tests:         ${YELLOW}⚠️  No test files found${NC}"
fi

echo

# Port Check
echo -e "${CYAN}[6/6]${NC} ${BLUE}Development Environment${NC}"
echo

# Check if dev port is in use
DEV_PORT=5173
if lsof -Pi :${DEV_PORT} -sTCP:LISTEN -t > /dev/null 2>&1; then
    PID=$(lsof -Pi :${DEV_PORT} -sTCP:LISTEN -t)
    echo -e "  Port ${DEV_PORT}:     ${YELLOW}⚠️  In use (PID: ${PID})${NC}"
    echo -e "                ${YELLOW}Dev server may already be running${NC}"
else
    echo -e "  Port ${DEV_PORT}:     ${GREEN}✓ Available${NC}"
    HEALTH_SCORE=$((HEALTH_SCORE + 10))
fi

# Check for common build artifacts
if [ -d "dist" ]; then
    echo -e "  dist/:         ${GREEN}✓ Build artifacts present${NC}"
else
    echo -e "  dist/:         ${YELLOW}⚠️  No build artifacts${NC}"
fi

echo

# Calculate health percentage
HEALTH_PERCENTAGE=$((HEALTH_SCORE * 100 / MAX_HEALTH))

# Summary
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Health Summary${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo

# Show health score with color
if [ "$HEALTH_PERCENTAGE" -ge 80 ]; then
    echo -e "  ${GREEN}✓ HEALTHY${NC}"
    echo -e "  Health Score: ${GREEN}${HEALTH_SCORE}/${MAX_HEALTH} (${HEALTH_PERCENTAGE}%)${NC}"
    RECOMMENDATIONS=false
elif [ "$HEALTH_PERCENTAGE" -ge 50 ]; then
    echo -e "  ${YELLOW}⚠️  NEEDS ATTENTION${NC}"
    echo -e "  Health Score: ${YELLOW}${HEALTH_SCORE}/${MAX_HEALTH} (${HEALTH_PERCENTAGE}%)${NC}"
    RECOMMENDATIONS=true
else
    echo -e "  ${RED}✗ CRITICAL${NC}"
    echo -e "  Health Score: ${RED}${HEALTH_SCORE}/${MAX_HEALTH} (${HEALTH_PERCENTAGE}%)${NC}"
    RECOMMENDATIONS=true
fi

echo

# Recommendations
if [ "$RECOMMENDATIONS" = true ]; then
    echo -e "${YELLOW}Recommendations:${NC}"

    if [ ! -d "node_modules" ]; then
        echo -e "  ${BLUE}1.${NC} Install dependencies: ${CYAN}npm install${NC}"
    fi

    if ! git diff-index --quiet HEAD --; then
        echo -e "  ${BLUE}2.${NC} Commit or stash changes: ${CYAN}git add . && git commit${NC}"
    fi

    if [ "$HEALTH_PERCENTAGE" -lt 30 ]; then
        echo -e "  ${RED}3.${NC} Consider emergency reset: ${CYAN}./scripts/emergency-reset.sh${NC}"
    fi

    echo
fi

# Quick actions
echo -e "${CYAN}Quick Actions:${NC}"
echo -e "  ${BLUE}Start dev:${NC}     npm run dev"
echo -e "  ${BLUE}Run tests:${NC}     npm test"
echo -e "  ${BLUE}Type check:${NC}    npx tsc --noEmit"
echo -e "  ${BLUE}Build:${NC}         npm run build"
echo

# Exit with appropriate code
if [ "$HEALTH_PERCENTAGE" -ge 80 ]; then
    exit 0
elif [ "$HEALTH_PERCENTAGE" -ge 50 ]; then
    exit 1
else
    exit 2
fi
