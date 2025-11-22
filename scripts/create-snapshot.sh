#!/bin/bash

# create-snapshot.sh - Create a snapshot of current working state
# Usage: ./scripts/create-snapshot.sh "description"

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get description from argument or use default
DESCRIPTION="${1:-manual-snapshot}"

# Create timestamp
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
SNAPSHOT_ID="snapshot-${TIMESTAMP}"
SNAPSHOT_TAG="${SNAPSHOT_ID}"

# Snapshot log file
SNAPSHOT_LOG=".snapshots/snapshot-log.txt"
mkdir -p .snapshots

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Creating Snapshot: ${SNAPSHOT_ID}${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo

# Check if there are any changes to snapshot
if git diff-index --quiet HEAD -- && [ -z "$(git ls-files --others --exclude-standard)" ]; then
    echo -e "${YELLOW}⚠️  No changes to snapshot${NC}"
    echo -e "${YELLOW}   Working directory is clean${NC}"
    echo

    # Still create a tag for the current state
    git tag "${SNAPSHOT_TAG}" -m "Snapshot: ${DESCRIPTION} (clean state)"
    echo -e "${GREEN}✓ Tag created: ${SNAPSHOT_TAG}${NC}"

    # Log the snapshot
    mkdir -p "$(dirname "${SNAPSHOT_LOG}")"
    echo "${SNAPSHOT_ID}|${DESCRIPTION}|clean|$(git rev-parse HEAD)|$(date)" >> "${SNAPSHOT_LOG}"

    echo
    echo -e "${GREEN}Snapshot saved (clean state)${NC}"
    exit 0
fi

# Show what will be saved
echo -e "${BLUE}📸 Capturing current state...${NC}"
echo

# Count changes
MODIFIED_COUNT=$(git diff --name-only | wc -l)
STAGED_COUNT=$(git diff --cached --name-only | wc -l)
UNTRACKED_COUNT=$(git ls-files --others --exclude-standard | wc -l)

echo -e "  Modified files:  ${YELLOW}${MODIFIED_COUNT}${NC}"
echo -e "  Staged files:    ${YELLOW}${STAGED_COUNT}${NC}"
echo -e "  Untracked files: ${YELLOW}${UNTRACKED_COUNT}${NC}"
echo

# Create git stash with untracked files
echo -e "${BLUE}💾 Creating stash...${NC}"
STASH_MSG="snapshot: ${DESCRIPTION} [${SNAPSHOT_ID}]"

if git stash push -u -m "${STASH_MSG}"; then
    echo -e "${GREEN}✓ Stash created successfully${NC}"
    STASH_HASH=$(git rev-parse stash@{0})
else
    echo -e "${RED}✗ Failed to create stash${NC}"
    exit 1
fi

# Create tag at current commit
echo
echo -e "${BLUE}🏷️  Creating tag...${NC}"
git tag "${SNAPSHOT_TAG}" -m "Snapshot: ${DESCRIPTION}"
echo -e "${GREEN}✓ Tag created: ${SNAPSHOT_TAG}${NC}"

# Log the snapshot
    mkdir -p "$(dirname "${SNAPSHOT_LOG}")"
CURRENT_BRANCH=$(git branch --show-current)
CURRENT_COMMIT=$(git rev-parse HEAD)

echo "${SNAPSHOT_ID}|${DESCRIPTION}|${STASH_HASH}|${CURRENT_COMMIT}|${CURRENT_BRANCH}|$(date)" >> "${SNAPSHOT_LOG}"

# Restore the stash (keep it in stash list but restore working directory)
echo
echo -e "${BLUE}📂 Restoring working directory...${NC}"
git stash apply stash@{0} > /dev/null 2>&1
echo -e "${GREEN}✓ Working directory restored${NC}"

# Summary
echo
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ Snapshot Created Successfully${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo
echo -e "  ${BLUE}Snapshot ID:${NC}     ${SNAPSHOT_ID}"
echo -e "  ${BLUE}Description:${NC}     ${DESCRIPTION}"
echo -e "  ${BLUE}Stash:${NC}           stash@{0}"
echo -e "  ${BLUE}Tag:${NC}             ${SNAPSHOT_TAG}"
echo -e "  ${BLUE}Branch:${NC}          ${CURRENT_BRANCH}"
echo -e "  ${BLUE}Commit:${NC}          ${CURRENT_COMMIT:0:7}"
echo
echo -e "${YELLOW}📝 To restore this snapshot later:${NC}"
echo -e "   ${BLUE}./scripts/rollback-to-snapshot.sh ${SNAPSHOT_ID}${NC}"
echo
echo -e "${YELLOW}📋 To list all snapshots:${NC}"
echo -e "   ${BLUE}git stash list${NC}"
echo -e "   ${BLUE}git tag -l 'snapshot-*'${NC}"
echo
