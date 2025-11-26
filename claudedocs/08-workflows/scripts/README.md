# Rollback and Recovery Scripts

Quick-access scripts for when things go wrong.

## Quick Reference

| Script | Purpose | When to Use |
|--------|---------|-------------|
| `create-snapshot.sh` | Save current state | Before risky changes |
| `rollback-to-snapshot.sh` | Restore saved state | After failed changes |
| `emergency-reset.sh` | Nuclear reset to main | Everything is broken |
| `verify-state.sh` | Check project health | Diagnostic / validation |

## Common Scenarios

### Before Making Risky Changes

```bash
# Save current state
./scripts/create-snapshot.sh "before-adding-new-feature"

# Make your changes...
# If something breaks:

# Restore previous state
./scripts/rollback-to-snapshot.sh
```

### Build is Completely Broken

```bash
# 1. Check what's wrong
./scripts/verify-state.sh

# 2. If health score < 50%:
./scripts/emergency-reset.sh

# This will:
# - Save current broken state
# - Reset to origin/main
# - Clean everything
# - Reinstall dependencies
```

### Want to Try Something Experimental

```bash
# 1. Create snapshot
./scripts/create-snapshot.sh "before-experiment"

# 2. Create experimental branch
git checkout -b experiment/trying-new-approach

# 3. Try your experiment

# 4. If it works:
git checkout enhance/3D
git merge experiment/trying-new-approach

# 5. If it doesn't work:
git checkout enhance/3D
./scripts/rollback-to-snapshot.sh
```

### Multiple Failed Attempts

```bash
# Snapshot system keeps history
git stash list  # Show all snapshots
git tag -l "snapshot-*"  # Show snapshot tags

# Restore from specific snapshot
./scripts/rollback-to-snapshot.sh snapshot-20251121-143025
```

## Script Details

### create-snapshot.sh

**Usage:** `./scripts/create-snapshot.sh "description"`

**What it does:**
- Creates git stash with all uncommitted changes
- Creates timestamped tag
- Logs snapshot to `.snapshots/snapshot-log.txt`
- Keeps working directory intact

**Example:**
```bash
./scripts/create-snapshot.sh "before-refactoring-auth"
# Output shows: snapshot-20251121-191540
```

### rollback-to-snapshot.sh

**Usage:** `./scripts/rollback-to-snapshot.sh [snapshot-id]`

**Interactive mode:**
```bash
./scripts/rollback-to-snapshot.sh
# Shows list of available snapshots
# Prompts for selection
```

**Direct mode:**
```bash
./scripts/rollback-to-snapshot.sh snapshot-20251121-191540
# Directly restores specified snapshot
```

**What it does:**
- Lists available snapshots
- Saves current state before rollback (safety)
- Restores files from snapshot
- Runs npm install if dependencies changed

### emergency-reset.sh

**Usage:** `./scripts/emergency-reset.sh`

**WARNING:** Nuclear option - use only when necessary!

**What it does:**
1. Creates emergency snapshot of broken state
2. Resets to origin/main
3. Removes ALL untracked files
4. Reinstalls dependencies
5. Offers to start dev server

**Confirmation required:** Must type 'RESET' to proceed

**Example:**
```bash
./scripts/emergency-reset.sh
# Type 'RESET' when prompted
# Everything resets to clean state
```

### verify-state.sh

**Usage:** `./scripts/verify-state.sh`

**What it checks:**
- Git status and branch
- Dependencies (package.json, node_modules)
- Build configuration files
- TypeScript errors
- Test files
- Dev server port availability

**Health Score:**
- 80-100%: HEALTHY (exit 0)
- 50-79%: NEEDS ATTENTION (exit 1)
- 0-49%: CRITICAL (exit 2)

**Example:**
```bash
./scripts/verify-state.sh
# Shows detailed health report
# Provides recommendations
```

## Best Practices

### 1. Snapshot Before Risky Operations

Always create a snapshot before:
- Major refactoring
- Dependency updates
- Configuration changes
- Experimental features
- Production deployments

```bash
./scripts/create-snapshot.sh "description-of-what-you-are-about-to-do"
```

### 2. Verify State Regularly

```bash
./scripts/verify-state.sh
```

Run this to check project health, especially:
- After pulling changes
- Before starting work
- After dependency updates
- When debugging issues

### 3. Clean Up Old Snapshots

Snapshots accumulate in git stash. Clean up periodically:

```bash
# List snapshots
git stash list

# Remove specific stash
git stash drop stash@{5}

# Remove all stashes (careful!)
git stash clear

# Remove old snapshot tags
git tag -d snapshot-20251120-143025
```

### 4. Document What You're Doing

Use descriptive snapshot names:

✅ Good:
```bash
./scripts/create-snapshot.sh "before-migrating-to-vite-5"
./scripts/create-snapshot.sh "working-state-before-3d-optimization"
```

❌ Bad:
```bash
./scripts/create-snapshot.sh "test"
./scripts/create-snapshot.sh "backup"
```

## Snapshot Storage Locations

Snapshots are stored in multiple places for safety:

1. **Git Stash** - Main storage
   - `git stash list` to view
   - Contains all file changes

2. **Git Tags** - Reference points
   - `git tag -l "snapshot-*"` to view
   - Marks the commit state

3. **Snapshot Log** - Metadata
   - `.snapshots/snapshot-log.txt`
   - Contains: ID, description, hashes, dates

## Recovery Workflow

```
Problem Occurs
    ↓
Run verify-state.sh
    ↓
Health Score?
    ↓
    ├─ >80%: Minor issue
    │   └─ Fix manually or restore from snapshot
    │
    ├─ 50-80%: Moderate issue
    │   ├─ Try rollback-to-snapshot.sh
    │   └─ If that fails, check git log for good commit
    │
    └─ <50%: Critical issue
        └─ Use emergency-reset.sh
```

## Advanced Usage

### Combining with Git Branches

```bash
# Save work on feature branch
./scripts/create-snapshot.sh "feature-work-in-progress"

# Try risky approach on new branch
git checkout -b experiment/risky-refactor

# If it breaks:
git checkout enhance/3D
./scripts/rollback-to-snapshot.sh
```

### Automated Snapshots

Add to git hooks (`.git/hooks/pre-push`):

```bash
#!/bin/bash
/home/kvn/workspace/ace/scripts/create-snapshot.sh "auto-before-push"
```

### Snapshot Before Every Deploy

```bash
#!/bin/bash
# deploy.sh
./scripts/create-snapshot.sh "before-deploy-$(date +%Y%m%d)"
npm run build
npm run deploy
```

## Troubleshooting

### "Snapshot not found"

```bash
# List all snapshots
git stash list
git tag -l "snapshot-*"

# Check snapshot log
cat .snapshots/snapshot-log.txt
```

### "Cannot apply snapshot - conflicts"

```bash
# Manually resolve conflicts
git status
# Fix conflicts in listed files
git add .
./scripts/create-snapshot.sh "after-conflict-resolution"
```

### "Emergency reset won't run"

```bash
# Ensure you type exactly 'RESET' (all caps)
# If script is corrupted, restore manually:
git fetch origin
git reset --hard origin/main
npm install
```

### "Scripts not executable"

```bash
chmod +x scripts/*.sh
```

## Integration with Documentation

Full documentation: `/home/kvn/workspace/ace/claudedocs/workflows/ROLLBACK_PROCEDURES.md`

Contains:
- Detailed emergency procedures
- Git command reference
- Recovery decision trees
- Known good states
- Troubleshooting guides

## File Locations

```
/home/kvn/workspace/ace/
├── .snapshots/
│   └── snapshot-log.txt          # Snapshot metadata
├── scripts/
│   ├── create-snapshot.sh        # Create snapshot
│   ├── rollback-to-snapshot.sh   # Restore snapshot
│   ├── emergency-reset.sh        # Nuclear reset
│   ├── verify-state.sh           # Health check
│   └── README.md                 # This file
└── claudedocs/
    └── workflows/
        └── ROLLBACK_PROCEDURES.md  # Full documentation
```

## Safety Notes

1. **Snapshots use git stash** - They don't persist if you delete .git directory
2. **Emergency reset is destructive** - Always creates backup first, but be careful
3. **Verify after rollback** - Always run `verify-state.sh` after restoring
4. **Test before committing** - Make sure everything works before git commit

## Examples from Real Usage

### Example 1: Dependency Update Gone Wrong

```bash
# Before update
./scripts/create-snapshot.sh "before-react-19-upgrade"

# Update dependencies
npm install react@19 react-dom@19

# Build breaks!
npm run build  # FAILS

# Rollback
./scripts/rollback-to-snapshot.sh
npm run build  # WORKS

# Try again with better approach
```

### Example 2: Multiple Failed Attempts

```bash
# Attempt 1
./scripts/create-snapshot.sh "approach-1-using-library-x"
# ... fails

# Attempt 2
./scripts/create-snapshot.sh "approach-2-using-library-y"
# ... fails

# Attempt 3
./scripts/create-snapshot.sh "approach-3-custom-implementation"
# ... works!

# Clean up failed attempts
git stash list  # See what you tried
```

### Example 3: Working State Documentation

```bash
# Found a working configuration
./scripts/create-snapshot.sh "working-vite-config-for-3d"
git tag -a v1.0-working-3d -m "Confirmed working 3D visualization"

# Later, if something breaks:
git tag -l "*working*"  # Find working states
./scripts/rollback-to-snapshot.sh snapshot-20251121-150000
```

## Version History

- 2025-11-21: Initial creation
- All scripts tested and verified working

**Maintain this README as scripts evolve**
