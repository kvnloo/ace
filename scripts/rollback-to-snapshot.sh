#!/bin/bash

# rollback-to-snapshot.sh - Restore a previous snapshot
# Usage: ./scripts/rollback-to-snapshot.sh [snapshot-id]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

SNAPSHOT_LOG=".snapshots/snapshot-log.txt"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Snapshot Rollback Tool${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo

# Function to list available snapshots
list_snapshots() {
    echo -e "${CYAN}📋 Available Snapshots:${NC}"
    echo

    # Show from stash
    echo -e "${YELLOW}From Stash:${NC}"
    if git stash list | grep -q "snapshot:"; then
        git stash list | grep "snapshot:" | nl -w2 -s'. ' || true
    else
        echo "  (none)"
    fi

    echo
    echo -e "${YELLOW}From Tags:${NC}"
    if git tag -l "snapshot-*" | head -10 | grep -q "snapshot-"; then
        git tag -l "snapshot-*" --sort=-creatordate | head -10 | nl -w2 -s'. '
    else
        echo "  (none)"
    fi

    # Show from log if exists
    if [ -f "${SNAPSHOT_LOG}" ]; then
        echo
        echo -e "${YELLOW}From Log:${NC}"
        tail -10 "${SNAPSHOT_LOG}" | while IFS='|' read -r id desc hash commit branch date; do
            echo "  ${id} - ${desc} (${date})"
        done
    fi
    echo
}

# Function to find snapshot in stash
find_snapshot_in_stash() {
    local snapshot_id=$1
    git stash list | grep "snapshot:" | grep "${snapshot_id}" | head -1 | awk '{print $1}' | tr -d ':'
}

# If no argument provided, show list and prompt
if [ -z "$1" ]; then
    list_snapshots

    echo -e "${YELLOW}Enter snapshot ID or stash number (e.g., 'snapshot-20251121-143025' or '0'):${NC}"
    read -r SNAPSHOT_INPUT

    if [ -z "$SNAPSHOT_INPUT" ]; then
        echo -e "${RED}✗ No snapshot selected${NC}"
        exit 1
    fi
else
    SNAPSHOT_INPUT="$1"
fi

echo
echo -e "${BLUE}🔍 Looking for snapshot: ${SNAPSHOT_INPUT}${NC}"
echo

# Determine if input is a stash number or snapshot ID
if [[ "$SNAPSHOT_INPUT" =~ ^[0-9]+$ ]]; then
    # It's a stash number
    STASH_REF="stash@{${SNAPSHOT_INPUT}}"

    # Check if stash exists
    if ! git stash list | grep -q "^${STASH_REF}:"; then
        echo -e "${RED}✗ Stash ${STASH_REF} not found${NC}"
        list_snapshots
        exit 1
    fi

    # Get description
    STASH_DESC=$(git stash list | grep "^${STASH_REF}:" | sed 's/^[^:]*: //')
    echo -e "${GREEN}✓ Found stash: ${STASH_DESC}${NC}"

elif [[ "$SNAPSHOT_INPUT" =~ ^snapshot- ]]; then
    # It's a snapshot ID
    SNAPSHOT_ID="$SNAPSHOT_INPUT"

    # Try to find in stash
    STASH_REF=$(find_snapshot_in_stash "${SNAPSHOT_ID}")

    if [ -z "$STASH_REF" ]; then
        # Not in stash, check if tag exists
        if git tag -l "${SNAPSHOT_ID}" | grep -q "${SNAPSHOT_ID}"; then
            echo -e "${YELLOW}⚠️  Snapshot found as tag only (clean state snapshot)${NC}"
            echo -e "${YELLOW}   Checking out tag: ${SNAPSHOT_ID}${NC}"

            # Checkout the tag
            git checkout "tags/${SNAPSHOT_ID}"

            echo
            echo -e "${GREEN}✓ Restored to snapshot tag${NC}"
            echo -e "${YELLOW}⚠️  You are in 'detached HEAD' state${NC}"
            echo -e "${YELLOW}   To create a branch: git checkout -b recovery/${SNAPSHOT_ID}${NC}"
            exit 0
        else
            echo -e "${RED}✗ Snapshot ${SNAPSHOT_ID} not found${NC}"
            list_snapshots
            exit 1
        fi
    fi

    STASH_DESC=$(git stash list | grep "^${STASH_REF}:" | sed 's/^[^:]*: //')
    echo -e "${GREEN}✓ Found snapshot: ${STASH_DESC}${NC}"

else
    echo -e "${RED}✗ Invalid snapshot ID or stash number${NC}"
    list_snapshots
    exit 1
fi

# Warn about uncommitted changes
if ! git diff-index --quiet HEAD -- || [ -n "$(git ls-files --others --exclude-standard)" ]; then
    echo
    echo -e "${YELLOW}⚠️  WARNING: You have uncommitted changes${NC}"
    echo
    git status --short
    echo
    echo -e "${YELLOW}These changes will be saved in a new snapshot before rollback.${NC}"
    echo -e "${YELLOW}Continue? (y/N):${NC} "
    read -r CONFIRM

    if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
        echo -e "${RED}Rollback cancelled${NC}"
        exit 0
    fi

    # Create a snapshot of current state before rollback
    echo
    echo -e "${BLUE}💾 Creating snapshot of current state...${NC}"
    ./scripts/create-snapshot.sh "before-rollback-to-${SNAPSHOT_INPUT}"
    echo
fi

# Perform the rollback
echo -e "${BLUE}🔄 Rolling back to snapshot...${NC}"
echo

# Clear working directory
echo -e "  ${BLUE}1/4${NC} Clearing working directory..."
git restore . > /dev/null 2>&1 || true

# Remove untracked files (except snapshots and scripts)
echo -e "  ${BLUE}2/4${NC} Removing untracked files..."
git ls-files --others --exclude-standard | grep -v "^\.snapshots/" | grep -v "^scripts/" | xargs rm -rf 2>/dev/null || true

# Apply the stash
echo -e "  ${BLUE}3/4${NC} Applying snapshot..."
if git stash apply "${STASH_REF}" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Snapshot applied successfully${NC}"
else
    echo -e "${RED}✗ Failed to apply snapshot${NC}"
    echo -e "${YELLOW}  You may need to resolve conflicts${NC}"
    exit 1
fi

# Check if package.json or package-lock.json changed
if git diff --name-only "${STASH_REF}" | grep -q "package.*\.json"; then
    echo -e "  ${BLUE}4/4${NC} Dependencies changed, running npm install..."
    npm install
else
    echo -e "  ${BLUE}4/4${NC} No dependency changes detected"
fi

# Summary
echo
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ Rollback Completed Successfully${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo
echo -e "  ${BLUE}Restored from:${NC}  ${STASH_DESC}"
echo -e "  ${BLUE}Stash:${NC}          ${STASH_REF}"
echo

# Show current status
echo -e "${CYAN}Current Status:${NC}"
git status --short | head -20
echo

# Suggest next steps
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "  ${BLUE}1.${NC} Review the restored files"
echo -e "  ${BLUE}2.${NC} Test that everything works: ${CYAN}npm run dev${NC}"
echo -e "  ${BLUE}3.${NC} Run tests: ${CYAN}npm test${NC}"
echo -e "  ${BLUE}4.${NC} If satisfied, commit: ${CYAN}git add . && git commit -m 'Restored from snapshot'${NC}"
echo
