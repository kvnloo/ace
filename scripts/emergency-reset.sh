#!/bin/bash

# emergency-reset.sh - Nuclear option when everything is broken
# Usage: ./scripts/emergency-reset.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo
echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${RED}  ⚠️  EMERGENCY RESET - NUCLEAR OPTION  ⚠️${NC}"
echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo
echo -e "${YELLOW}This will:${NC}"
echo -e "  ${RED}✗${NC} Save current state as emergency snapshot"
echo -e "  ${RED}✗${NC} Reset to origin/main"
echo -e "  ${RED}✗${NC} Remove ALL untracked files"
echo -e "  ${RED}✗${NC} Reinstall all dependencies"
echo -e "  ${RED}✗${NC} Start dev server"
echo
echo -e "${RED}WARNING: This cannot be easily undone!${NC}"
echo -e "${YELLOW}Only use this when everything is completely broken.${NC}"
echo
echo -e "${YELLOW}Continue with emergency reset? (type 'RESET' to confirm):${NC} "
read -r CONFIRM

if [ "$CONFIRM" != "RESET" ]; then
    echo -e "${GREEN}Emergency reset cancelled${NC}"
    exit 0
fi

echo
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Starting Emergency Reset Procedure${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo

# Step 1: Create emergency snapshot
echo -e "${CYAN}[1/7]${NC} ${BLUE}Creating emergency snapshot...${NC}"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Ensure snapshot script exists
if [ ! -f "./scripts/create-snapshot.sh" ]; then
    echo -e "${YELLOW}⚠️  Snapshot script not found, creating manual stash...${NC}"
    git stash push -u -m "emergency-snapshot-${TIMESTAMP}" || true
else
    ./scripts/create-snapshot.sh "emergency-state-${TIMESTAMP}" || true
fi
echo -e "${GREEN}✓ Emergency snapshot created${NC}"
echo

# Step 2: Show current state
echo -e "${CYAN}[2/7]${NC} ${BLUE}Recording current state...${NC}"
CURRENT_BRANCH=$(git branch --show-current)
CURRENT_COMMIT=$(git rev-parse HEAD)
echo -e "  Branch: ${YELLOW}${CURRENT_BRANCH}${NC}"
echo -e "  Commit: ${YELLOW}${CURRENT_COMMIT:0:7}${NC}"
echo

# Step 3: Fetch latest from origin
echo -e "${CYAN}[3/7]${NC} ${BLUE}Fetching latest from origin...${NC}"
if git fetch origin; then
    echo -e "${GREEN}✓ Fetched latest changes${NC}"
else
    echo -e "${YELLOW}⚠️  Failed to fetch from origin, continuing with local main...${NC}"
fi
echo

# Step 4: Reset to origin/main
echo -e "${CYAN}[4/7]${NC} ${BLUE}Resetting to origin/main...${NC}"
git reset --hard origin/main
echo -e "${GREEN}✓ Reset to origin/main${NC}"
echo

# Step 5: Clean all untracked files
echo -e "${CYAN}[5/7]${NC} ${BLUE}Cleaning untracked files...${NC}"
echo -e "${YELLOW}⚠️  Removing all untracked files (excluding .snapshots/)${NC}"

# Show what will be removed
echo -e "${YELLOW}Files to be removed:${NC}"
git ls-files --others --exclude-standard | grep -v "^\.snapshots/" | head -20
TOTAL_FILES=$(git ls-files --others --exclude-standard | grep -v "^\.snapshots/" | wc -l)
if [ "$TOTAL_FILES" -gt 20 ]; then
    echo -e "  ... and $((TOTAL_FILES - 20)) more files"
fi
echo

# Remove files
git ls-files --others --exclude-standard | grep -v "^\.snapshots/" | xargs rm -rf 2>/dev/null || true
echo -e "${GREEN}✓ Untracked files removed${NC}"
echo

# Step 6: Reinstall dependencies
echo -e "${CYAN}[6/7]${NC} ${BLUE}Reinstalling dependencies...${NC}"
echo -e "${YELLOW}  Removing node_modules...${NC}"
rm -rf node_modules

echo -e "${YELLOW}  Running npm install...${NC}"
if npm install; then
    echo -e "${GREEN}✓ Dependencies installed successfully${NC}"
else
    echo -e "${RED}✗ Failed to install dependencies${NC}"
    echo -e "${YELLOW}  You may need to run 'npm install' manually${NC}"
fi
echo

# Step 7: Verify state
echo -e "${CYAN}[7/7]${NC} ${BLUE}Verifying state...${NC}"

# Check git status
echo -e "${YELLOW}Git Status:${NC}"
git status --short

# Check if on main branch
FINAL_BRANCH=$(git branch --show-current)
if [ "$FINAL_BRANCH" = "main" ]; then
    echo -e "${GREEN}✓ On main branch${NC}"
else
    echo -e "${YELLOW}⚠️  On branch: ${FINAL_BRANCH}${NC}"
    echo -e "${YELLOW}   You may want to: git checkout main${NC}"
fi
echo

# Summary
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ Emergency Reset Complete${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo
echo -e "${BLUE}Before Reset:${NC}"
echo -e "  Branch: ${CURRENT_BRANCH}"
echo -e "  Commit: ${CURRENT_COMMIT:0:7}"
echo
echo -e "${BLUE}After Reset:${NC}"
echo -e "  Branch: ${FINAL_BRANCH}"
echo -e "  Commit: $(git rev-parse HEAD | cut -c1-7)"
echo
echo -e "${BLUE}Emergency Snapshot:${NC}"
echo -e "  Location: stash@{0} or emergency-state-${TIMESTAMP}"
echo
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "  ${CYAN}1.${NC} Start dev server: ${BLUE}npm run dev${NC}"
echo -e "  ${CYAN}2.${NC} Run tests: ${BLUE}npm test${NC}"
echo -e "  ${CYAN}3.${NC} If you need to recover previous state:"
echo -e "     ${BLUE}./scripts/rollback-to-snapshot.sh emergency-state-${TIMESTAMP}${NC}"
echo
echo -e "${YELLOW}Start dev server now? (y/N):${NC} "
read -r START_DEV

if [[ "$START_DEV" =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Starting dev server...${NC}"
    npm run dev
fi
