# Historical Troubleshooting Documentation

**Archived from:** claudedocs-old/troubleshooting/
**Date:** November 22, 2025
**Status:** ✅ RESOLVED - Issues fixed, architecture changed

---

## Overview

These documents capture debugging work during early 3D implementation. Both critical issues identified have been resolved.

## Issues Documented

### 1. File Watcher Limit (ENOSPC Error)
- **File**: `3d_map_loading_issue.md`
- **Root Cause**: Linux kernel file watcher limit exceeded
- **Status**: ✅ FIXED
- **Solution**: Increased `fs.inotify.max_user_watches` to 524288

### 2. Empty 3D Canvas
- **File**: `empty_3d_view_diagnosis.md`
- **Root Cause**: Import map conflict in index.html
- **Status**: ✅ RESOLVED via architecture refactoring
- **Confidence**: 85%

## Resolution Evidence

### File Watcher Limit
Current system configuration shows the fix is in place:
```bash
cat /proc/sys/fs/inotify/max_user_watches
# Output: 524288 (increased from default ~8192)
```

### Component Architecture
The codebase has been significantly reorganized since these issues:
- **Commit df5a9b14** (Nov 25): "feat: Integrate PR #6 3D features"
- Components moved to modular directories:
  - `/src/components/facilities/`
  - `/src/components/characters/`
  - `/src/components/farming/`
- Old flat structure (`/components/*.tsx`) no longer exists

## Why These Documents Are Archived

1. **Issues Definitively Resolved**: Both critical issues fixed
2. **Architecture Changed**: File paths no longer valid
3. **Better Documentation Exists**: Current architecture docs supersede
4. **Historical Value**: Shows debugging methodology

## Caution

⚠️ **File paths in these documents DO NOT match current structure**

The diagnostics reference the old component structure. Consulting these documents for current troubleshooting could be misleading.

## Useful Extracted Patterns

### System Configuration
If you encounter ENOSPC errors on Linux:
```bash
# Temporary fix (current session)
sudo sysctl fs.inotify.max_user_watches=524288

# Permanent fix
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### Debugging 3D Rendering Issues
1. Check browser DevTools console for WebGL errors
2. Verify component imports match current structure
3. Check camera positioning relative to scene origin
4. Look for import map conflicts with bundler

---

**For current architecture**: See `/claudedocs/architecture/CORE_ARCHITECTURE.md`
**For current troubleshooting**: See `/claudedocs/testing/TESTING_GUIDE.md`
