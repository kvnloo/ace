# Emergency Rollback and Recovery Procedures

## Quick Reference

**Build is broken?** → [Emergency Reset](#emergency-reset)
**Tests failing?** → [Rollback Last Commit](#rollback-last-commit)
**Need to go back?** → [Restore Snapshot](#restore-from-snapshot)
**Save current state?** → [Create Snapshot](#create-snapshot)

---

## Table of Contents

1. [Quick Recovery Commands](#quick-recovery-commands)
2. [Git-Based Rollback Procedures](#git-based-rollback-procedures)
3. [Snapshot System](#snapshot-system)
4. [Emergency Procedures](#emergency-procedures)
5. [State Preservation](#state-preservation)
6. [Recovery Scripts](#recovery-scripts)
7. [Known Good States](#known-good-states)

---

## Quick Recovery Commands

### Discard All Local Changes
```bash
# WARNING: This discards ALL uncommitted changes
git restore .
git clean -fd  # Remove untracked files
```

### Undo Last Commit (Keep Changes)
```bash
git reset --soft HEAD~1
```

### Undo Last Commit (Discard Changes)
```bash
git reset --hard HEAD~1
```

### Go Back to Last Known Good State
```bash
git checkout main
npm install
npm run dev
```

---

## Git-Based Rollback Procedures

### 1. Rollback Last Commit

**When to use:** Last commit broke something, but earlier commits are fine.

```bash
# Check what will be undone
git log --oneline -5

# Option A: Keep changes as uncommitted
git reset --soft HEAD~1

# Option B: Discard changes completely
git reset --hard HEAD~1

# If you already pushed to remote
git push --force-with-lease origin enhance/3D
```

**Safety tip:** Use `--soft` if you want to keep the changes and recommit differently.

### 2. Rollback Multiple Commits

**When to use:** Several recent commits are problematic.

```bash
# Find the good commit hash
git log --oneline -20

# Reset to specific commit (replace COMMIT_HASH)
git reset --hard COMMIT_HASH

# Force push if already on remote
git push --force-with-lease origin enhance/3D
```

### 3. Create Recovery Branch Before Risky Changes

```bash
# Before making risky changes
git checkout -b backup/before-risky-change
git checkout enhance/3D

# Make your risky changes...

# If it fails, recover:
git checkout backup/before-risky-change
git branch -D enhance/3D
git checkout -b enhance/3D
```

---

## Snapshot System

### Create Snapshot

**Before ANY risky operation:**

```bash
# Using the script
./scripts/create-snapshot.sh "before-fixing-build"

# Manual method
git stash push -u -m "snapshot: before-fixing-build"
git tag snapshot-$(date +%Y%m%d-%H%M%S)
```

**What gets saved:**
- All uncommitted changes
- Untracked files
- Current branch state
- Package lock files

### Restore from Snapshot

```bash
# Using the script
./scripts/rollback-to-snapshot.sh

# Manual method
git stash list
git stash apply stash@{0}

# Or restore from tag
git checkout snapshot-TAG_NAME
```

### List All Snapshots

```bash
# Stash-based snapshots
git stash list

# Tag-based snapshots
git tag -l "snapshot-*"

# View snapshot details
git stash show -p stash@{0}
```

---

## Emergency Procedures

### Build Breaks

**Symptoms:** `npm run dev` fails, compilation errors

**Recovery Steps:**

1. **Quick Fix Attempt:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

2. **If Still Broken:**
```bash
# Restore from last known good state
./scripts/emergency-reset.sh

# Or manually
git restore package.json package-lock.json
npm install
npm run dev
```

3. **Nuclear Option:**
```bash
git reset --hard origin/main
npm install
npm run dev
```

### All Tests Fail

**Symptoms:** Tests that previously passed now all fail

**Recovery Steps:**

1. **Check if it's a config issue:**
```bash
git diff HEAD -- '*.config.*' 'playwright.config.ts'
git restore '*.config.*'
```

2. **Restore test files:**
```bash
git restore tests/ e2e/
```

3. **Full rollback:**
```bash
git reset --hard HEAD~1
npm install
npm test
```

### Dev Server Won't Start

**Symptoms:** `npm run dev` hangs, crashes, or shows port conflicts

**Recovery Steps:**

1. **Kill existing processes:**
```bash
# Kill processes on port 5173
lsof -ti:5173 | xargs kill -9

# Or use fuser
fuser -k 5173/tcp
```

2. **Clear build artifacts:**
```bash
rm -rf dist/ .vite/ node_modules/.vite/
npm run dev
```

3. **Reset Vite config:**
```bash
git restore vite.config.ts
npm run dev
```

4. **Full reset:**
```bash
./scripts/emergency-reset.sh
```

### Production is Broken

**Symptoms:** Deployed site shows errors, blank page, or crashes

**IMMEDIATE ACTION:**

```bash
# Deploy last known good commit
git checkout main
git log --oneline -10

# Find last working commit (check GitHub Actions)
git checkout WORKING_COMMIT_HASH

# Force deploy
git push --force-with-lease origin main

# Or revert to specific tag
git checkout tags/v1.0.0
git push --force-with-lease origin main
```

**Prevention:** Always tag working deployments:
```bash
git tag -a v1.0.1 -m "Working deployment 2025-11-21"
git push --tags
```

### Everything is Broken

**When:** Multiple systems failing, unclear what caused it

**NUCLEAR RESET:**

```bash
# Save current disaster state for analysis
./scripts/create-snapshot.sh "disaster-state-analysis"

# Hard reset to main
git fetch origin
git reset --hard origin/main

# Clean everything
git clean -fdx  # WARNING: Removes ALL untracked files
rm -rf node_modules
npm install

# Verify
npm run dev
npm test
```

---

## State Preservation

### Before Risky Changes Checklist

**Always do this before:**
- Major refactoring
- Dependency updates
- Configuration changes
- Experimental features
- Production deployments

```bash
# 1. Create snapshot
./scripts/create-snapshot.sh "before-risky-operation"

# 2. Create backup branch
git checkout -b backup/$(date +%Y%m%d-%H%M%S)
git checkout enhance/3D

# 3. Tag current state
git tag backup-$(date +%Y%m%d-%H%M%S)

# 4. Verify tests pass
npm test

# 5. NOW make your changes
```

---

## Recovery Scripts

### 1. create-snapshot.sh

**Usage:** `./scripts/create-snapshot.sh "description"`

**What it does:**
- Creates git stash with all changes
- Creates timestamped tag
- Saves to snapshot log
- Shows snapshot ID

**Example:**
```bash
./scripts/create-snapshot.sh "before-adding-3d-features"
# Output: Snapshot created: snapshot-20251121-143025
```

### 2. rollback-to-snapshot.sh

**Usage:** `./scripts/rollback-to-snapshot.sh [snapshot-id]`

**What it does:**
- Lists available snapshots
- Restores selected snapshot
- Preserves current state as new snapshot first
- Runs npm install if needed

**Example:**
```bash
# Interactive mode
./scripts/rollback-to-snapshot.sh

# Direct restore
./scripts/rollback-to-snapshot.sh snapshot-20251121-143025
```

### 3. emergency-reset.sh

**Usage:** `./scripts/emergency-reset.sh`

**What it does:**
- Creates emergency snapshot first
- Resets to origin/main
- Cleans all untracked files
- Reinstalls dependencies
- Starts dev server

**CAUTION:** This is the nuclear option. Use only when everything is broken.

### 4. verify-state.sh

**Usage:** `./scripts/verify-state.sh`

**What it does:**
- Checks git status
- Verifies dependencies
- Runs tests
- Checks build
- Reports health status

---

## Known Good States

### Current Known Good States

```
# These are verified working states from git history:

e80d8ee - Fix base path for GitHub Pages deployment
d1cf76a - Fix blank page on /dev/ deployment
5a61e4b - Update README with comprehensive project documentation

# To restore any of these:
git checkout e80d8ee
git checkout -b recovery/working-deployment
npm install
npm run dev
```

### Tag Working States

**Always tag working deployments:**
```bash
# After successful deployment
git tag -a v1.0.0-20251121 -m "Working 3D city visualization"
git push --tags

# After successful feature
git tag -a feature-3d-working -m "3D features fully functional"
git push --tags
```

---

## Best Practices

1. **Always snapshot before risky changes**
2. **Commit working states frequently**
3. **Tag successful deployments**
4. **Test in branches, not main**
5. **Keep main branch clean and deployable**
6. **Document what broke and why**
7. **Practice recovery in test branches**

---

## Troubleshooting

### "Cannot rollback - uncommitted changes"

```bash
# Save current work first
./scripts/create-snapshot.sh "work-in-progress"

# Then rollback
git reset --hard HEAD~1
```

### "Snapshot not found"

```bash
# List all snapshots
git stash list
git tag -l "snapshot-*"

# If lost, check reflog
git reflog
```

### "Script permission denied"

```bash
chmod +x scripts/*.sh
```

### "Port already in use"

```bash
# Kill process on port
lsof -ti:5173 | xargs kill -9

# Or change port in vite.config.ts
```

---

## Git Command Reference

### Information Commands
```bash
git status                    # Current state
git log --oneline -10        # Recent commits
git diff                     # Uncommitted changes
git diff HEAD~1              # Last commit changes
git reflog                   # All state changes
git branch -a                # All branches
git tag -l                   # All tags
```

### Undo Commands
```bash
git restore FILE             # Discard file changes
git restore .                # Discard all changes
git reset --soft HEAD~1      # Undo commit, keep changes
git reset --hard HEAD~1      # Undo commit, discard changes
git revert COMMIT            # Create inverse commit
git clean -fd                # Remove untracked files
```

### Safety Commands
```bash
git stash                    # Save changes temporarily
git stash pop                # Restore stashed changes
git checkout -b backup       # Create backup branch
git tag snapshot-NAME        # Tag current state
```

---

## Version History

- 2025-11-21: Initial procedures created
- Next review: After first emergency use

**Keep this document updated with lessons learned from actual recovery situations.**
