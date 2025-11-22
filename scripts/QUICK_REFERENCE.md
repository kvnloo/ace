# Emergency Recovery - Quick Reference

## I Need To...

### Save Current State

```bash
./scripts/create-snapshot.sh "description"
```

### Undo Last Changes

```bash
./scripts/rollback-to-snapshot.sh
```

### Check If Everything Is OK

```bash
./scripts/verify-state.sh
```

### Everything Is Broken - Start Over

```bash
./scripts/emergency-reset.sh
# Type 'RESET' when prompted
```

---

## Common Problems

### Build Won't Run

```bash
./scripts/verify-state.sh
# If health < 50%:
./scripts/emergency-reset.sh
```

### Tests All Failing

```bash
# Restore last working state
./scripts/rollback-to-snapshot.sh

# Or restore specific file
git restore tests/
```

### Can't Start Dev Server

```bash
# Kill process on port
lsof -ti:5173 | xargs kill -9

# Or use different port
# Edit vite.config.ts
```

### Lost Track of Changes

```bash
# See all snapshots
git stash list
git tag -l "snapshot-*"

# Restore specific one
./scripts/rollback-to-snapshot.sh snapshot-ID
```

---

## Before Risky Changes

```bash
# 1. Save state
./scripts/create-snapshot.sh "before-risky-change"

# 2. Make changes

# 3. If broken:
./scripts/rollback-to-snapshot.sh
```

---

## Emergency Git Commands

### Discard All Changes

```bash
git restore .
git clean -fd
```

### Undo Last Commit

```bash
# Keep changes
git reset --soft HEAD~1

# Discard changes
git reset --hard HEAD~1
```

### Go Back to Main

```bash
git checkout main
git pull origin main
npm install
```

---

## Health Scores

- **80-100%** ✅ Healthy - Keep working
- **50-79%** ⚠️ Needs attention - Review issues
- **0-49%** 🚨 Critical - Consider reset

---

## File Locations

```
scripts/create-snapshot.sh       # Save state
scripts/rollback-to-snapshot.sh  # Restore state
scripts/emergency-reset.sh       # Nuclear option
scripts/verify-state.sh          # Health check
scripts/README.md                # Detailed docs
claudedocs/workflows/ROLLBACK_PROCEDURES.md  # Full guide
```

---

## Safety Rules

1. **Always snapshot before risky changes**
2. **Never work directly on main branch**
3. **Test before committing**
4. **Emergency reset is last resort**

---

## Get Help

1. Run `./scripts/verify-state.sh` to diagnose
2. Check `claudedocs/workflows/ROLLBACK_PROCEDURES.md` for detailed help
3. Review git log for known good commits: `git log --oneline -10`

---

**Print this or keep it open in another terminal!**
