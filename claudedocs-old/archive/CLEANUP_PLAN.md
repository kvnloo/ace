# Documentation Cleanup Plan

## Current State
- **375 files** in docs/ (completely unmanageable)
- **68 test/validation/debug reports** scattered everywhere
- **30 subdirectories** (most unnecessary)
- **160 non-markdown files** (screenshots, HTML demos)

## Target State: 5 Essential Files

### Keep in docs/ (Human-Readable)
1. **README.md** - Project overview and navigation
2. **ARCHITECTURE.md** - Consolidated facility architecture
3. **DEVELOPMENT.md** - How to develop the web app
4. **API.md** - API reference (if needed)
5. **FACILITY_GUIDE.md** - Facility operations guide

## Cleanup Actions

### Phase 1: Move Historical/Debug Content to claudedocs/
```bash
# Test reports, validation, debug sessions
mv docs/*test*.md claudedocs/test-reports/
mv docs/*validation*.md claudedocs/validation-history/
mv docs/*debug*.md claudedocs/debug-sessions/
mv docs/*fix*.md claudedocs/debug-sessions/
mv docs/*report*.md claudedocs/archive/
mv docs/*summary*.md claudedocs/archive/
mv docs/*analysis*.md claudedocs/archive/

# Screenshots and artifacts
mv docs/*.png claudedocs/test-reports/
mv docs/*.html claudedocs/archive/

# Entire debug/test directories
mv docs/debugging/ claudedocs/
mv docs/debug-reports/ claudedocs/
mv docs/test-reports/ claudedocs/
mv docs/test-fixes/ claudedocs/
mv docs/test-enhancements/ claudedocs/
mv docs/validation/ claudedocs/
mv docs/archive/ claudedocs/
mv docs/tdd/ claudedocs/
```

### Phase 2: Consolidate Architecture
```bash
# Merge all architecture docs into single ARCHITECTURE.md
# Source files:
docs/architecture/facility-blueprint.md
docs/architecture/facility-architecture.md
docs/architecture/digital-twin-architecture.md
docs/systems/*/

# Delete after consolidation:
rm -rf docs/architecture/
rm -rf docs/systems/
```

### Phase 3: Delete Redundant Directories
```bash
rm -rf docs/analysis/
rm -rf docs/sprints/
rm -rf docs/screenshots/
rm -rf docs/fixes/
rm -rf docs/migration/
rm -rf docs/orchestration/
rm -rf docs/research/  # Move to claudedocs if valuable
rm -rf docs/ci-cd/     # Move to DEVELOPMENT.md
rm -rf docs/community/ # Move to CONTRIBUTING.md in root
rm -rf docs/contributing/ # Same
```

### Phase 4: Consolidate API Docs
```bash
# If API docs exist, merge into single API.md
# Otherwise delete
rm -rf docs/api/
rm -rf docs/components/
rm -rf docs/features/
```

### Phase 5: Move Operational Content
```bash
# These belong in claudedocs or separate facility-ops repo
mv docs/operations/ claudedocs/
mv docs/performance/ claudedocs/
mv docs/business/ claudedocs/
mv docs/specifications/ claudedocs/
mv docs/concepts/ claudedocs/
```

## Final Structure

```
docs/
├── README.md              # Project overview
├── ARCHITECTURE.md        # Consolidated architecture
├── DEVELOPMENT.md         # Developer guide
├── API.md                 # API reference
└── FACILITY_GUIDE.md      # Facility operations

claudedocs/
├── test-reports/          # Historical test data
├── validation-history/    # Validation reports
├── debug-sessions/        # Debug artifacts
├── archive/               # Old summaries/reports
├── operations/            # Facility operations detail
├── specifications/        # Technical specs
└── systems/               # System documentation
```

## Expected Results
- **docs/**: 5 files maximum
- **claudedocs/**: Organized archives
- **Developers**: See essential info immediately
- **LLMs**: Access detailed history in claudedocs
