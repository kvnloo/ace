# Archive Documentation

**Purpose:** Historical documentation preserved for reference
**Status:** Archive (read-only)

---

## Overview

This directory contains archived documentation that is no longer actively maintained but preserved for historical reference.

---

## Structure

| Subdirectory | Contents | Files |
|--------------|----------|-------|
| `2025-11-26/` | Recent reorganization archive | Migration maps, agent reports |
| `debug-sessions/` | Historical debugging records | Debug logs, session reports |
| `legacy/` | Pre-restructure documents | 195+ historical files |
| `troubleshooting/` | Past troubleshooting guides | Issue resolution docs |
| `validation/` | Historical validation reports | Test validation records |

---

## Usage Guidelines

### DO
- Reference for historical context
- Search for previous solutions
- Understand past decisions

### DON'T
- Modify archived files
- Use outdated specs for new work
- Treat as current documentation

---

## Finding Active Documentation

For current documentation, see:
- `00-index/` - Navigation and getting started
- `04-planning/` - Current planning artifacts
- `05-implementation/` - Active implementation specs

---

## Archive Organization

### Date-Organized Archives
Files moved to archive are organized by date:
```
99-archive/
├── YYYY-MM-DD/          # Date of archival
│   ├── README.md        # What was archived and why
│   └── [archived files]
```

### Category Archives
Some archives are organized by category:
```
99-archive/
├── debug-sessions/      # All debugging archives
├── legacy/              # Pre-restructure content
├── troubleshooting/     # Resolved issues
└── validation/          # Historical validation
```

---

## Recent Archival Events

### 2025-11-26: Documentation Restructuring
- Consolidated 341 files from non-numbered folders
- Migrated to numbered folder taxonomy (00-08 + 99)
- See `2025-11-26/FOLDER-MIGRATION-MAP.md` for mapping
- See `2025-11-26/AGENT-10-CONSOLIDATION-REPORT.md` for details

---

## Restoration Policy

If archived content needs restoration:
1. Identify the specific document needed
2. Review why it was archived
3. Update content to current standards
4. Move to appropriate active folder
5. Update cross-references

---

**Last Updated:** 2025-11-26
**Maintainer:** Documentation Team
