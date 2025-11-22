# ACE Repository Cleanup Plan

**Generated:** 2025-11-22
**Purpose:** Comprehensive analysis of cleanup opportunities without deleting anything yet
**Status:** ANALYSIS PHASE - NO CHANGES MADE

---

## Executive Summary

**Total Files Analyzed:** 84 documentation files + 11 component files + supporting files
**Cleanup Opportunities Identified:** 15 actionable items across 4 risk tiers
**Estimated Impact:** 17-18MB reduction, improved navigation, clearer project structure

### Key Findings

1. **1 unused React component** (QualityBadge) - TDD example only used in tests ✅
2. **1 backup file** detected (ThreeScene.tsx.backup) - safe to delete ✅
3. **10 active production components** - all verified in use ✅
4. **Documentation well-organized** between `/docs` (facility) and `/claudedocs` (code) ✅
5. **17MB inspiration images** - largest cleanup opportunity ⚠️
6. **Test directory structure** - needs better organization 📋
7. **Log files** - should be gitignored 🔧

---

## TIER 1: Safe Cleanup (Low Risk)

### 1.1 Backup Files (SAFE)

**File:** `/home/kvn/workspace/ace/components/ThreeScene.tsx.backup`
**Reason:** Backup file, 980 lines, identical to early version
**Risk:** 1/4 - Safe, backup only
**Dependencies:** None
**Recommendation:** DELETE
**Priority:** HIGH
**Impact:** Reduces confusion, 28KB saved

### 1.2 Temporary Logs (SAFE)

**File:** `/home/kvn/workspace/ace/logs/dev-errors.log`
**Reason:** Development error log, should not be committed
**Risk:** 1/4 - Safe
**Dependencies:** None
**Recommendation:** DELETE (add to .gitignore if not present)
**Priority:** HIGH
**Impact:** Prevents accidental commit of debug info

### 1.3 Root-Level Completion Markers (ORGANIZATIONAL)

**Files:**
- `MONITORING_SETUP_COMPLETE.md` (doesn't exist in root, shown in git status as untracked)
- `PERFORMANCE_TESTING_SUMMARY.md` (doesn't exist in root, shown in git status as untracked)
- `ROLLBACK_SYSTEM_COMPLETE.md` (doesn't exist in root, shown in git status as untracked)

**Reason:** These appear as untracked in git status but don't exist in filesystem - git status anomaly
**Risk:** 1/4 - Safe
**Recommendation:** Verify with `git status --porcelain` and clean up tracking if needed
**Priority:** MEDIUM
**Impact:** Cleaner git status

### 1.4 Snapshot Log (ORGANIZATIONAL)

**File:** `/home/kvn/workspace/ace/.snapshots/snapshot-log.txt`
**Reason:** Rollback system log, 161 bytes
**Risk:** 1/4 - Safe, can be regenerated
**Dependencies:** Rollback scripts may reference it
**Recommendation:** KEEP (but could be gitignored)
**Priority:** LOW
**Impact:** Part of rollback system, minimal size

---

## TIER 2: Low Risk Cleanup

### 2.1 Unused Components (CODE)

#### QualityBadge Component

**File:** `/home/kvn/workspace/ace/components/QualityBadge.tsx`
**Reason:** TDD example component, NOT imported anywhere except its test
**Risk:** 2/4 - Low risk, example component
**Dependencies:**
- Test file: `tests/unit/QualityBadge.test.tsx` (would also be removed)
- Documentation references in `claudedocs/03-testing-quality/TDD_IMPLEMENTATION_SUMMARY.md`
- Documentation references in `claudedocs/05-workflows/workflows/IMPLEMENTATION_COMPLETE.md`

**Usage Search Results:**
```
Found in 4 files:
- tests/unit/QualityBadge.test.tsx (its test)
- claudedocs/03-testing-quality/TDD_IMPLEMENTATION_SUMMARY.md (docs reference)
- components/QualityBadge.tsx (itself)
- claudedocs/05-workflows/workflows/IMPLEMENTATION_COMPLETE.md (docs reference)
```

**Recommendation:** KEEP as TDD example OR MOVE to `/examples` directory
**Priority:** MEDIUM
**Impact:** Currently serves as TDD documentation example, has educational value

**Alternative:** Create `/examples` directory structure:
```
examples/
  tdd-example/
    QualityBadge.tsx
    QualityBadge.test.tsx
    README.md (explain the TDD process)
```

#### ReceptionArea Component

**File:** `/home/kvn/workspace/ace/components/ReceptionArea.tsx`
**Reason:** 684-line detailed 3D reception area component
**Risk:** 1/4 - ACTIVELY USED
**Dependencies:**
- Imports: Html, Text, Float, Line from @react-three/drei
- Uses THREE.js extensively
- Imported and rendered in ThreeScene.tsx

**Usage Analysis:**
```
import ReceptionArea from './ReceptionArea';  // Line 21 in ThreeScene.tsx
<ReceptionArea showMeasurements={showMeasurements} showLabels={showLabels} />  // Line 1041
```

**Code Analysis:**
- Comprehensive reception area with desk, kiosks, waiting benches, wayfinding
- High-quality implementation (11 sub-components)
- Position: `[0, 0.1, -55]` (south facade ground floor)
- Fully functional and integrated

**Status:** ✅ ACTIVE COMPONENT
**Recommendation:** KEEP
**Priority:** N/A (in active use)

#### Grass Component

**File:** `/home/kvn/workspace/ace/components/Grass.tsx`
**Reason:** Grass rendering component, 141 lines
**Risk:** 1/4 - ACTIVELY USED
**Dependencies:** ThreeScene.tsx imports and renders it

**Usage Analysis:**
```
import Grass from './Grass';  // Line 19 in ThreeScene.tsx
<Grass ... />  // Line 540 in ThreeScene.tsx - CONFIRMED USAGE
```

**Status:** ✅ ACTIVE COMPONENT
**Recommendation:** KEEP
**Priority:** N/A (in active use)

### 2.2 Inspiration Images (ASSETS)

**Directory:** `/home/kvn/workspace/ace/inspo/`
**Size:** 17MB (7 PNG files)
**Reason:** Generated design inspiration images, dated Nov 22, 2025 1:17-1:18 AM
**Risk:** 2/4 - May be referenced in design discussions
**Dependencies:** May be linked in documentation

**Files:**
```
Generated Image November 22, 2025 - 1_17AM.png      (2.5MB)
Generated Image November 22, 2025 - 1_17AM (1).png  (2.6MB)
Generated Image November 22, 2025 - 1_17AM (2).png  (2.4MB)
Generated Image November 22, 2025 - 1_17AM (3).png  (2.4MB)
Generated Image November 22, 2025 - 1_17AM (4).png  (2.5MB)
Generated Image November 22, 2025 - 1_17AM (5).png  (2.5MB)
Generated Image November 22, 2025 - 1_18AM.png      (2.4MB)
```

**Recommendation:** MOVE to external storage or `docs/assets/design-inspiration/`
**Priority:** MEDIUM
**Impact:** 17MB reduction (largest single cleanup opportunity)

**Action Plan:**
1. Check if images are linked in any markdown files
2. If linked: Update links to point to external CDN/storage
3. If not linked: Archive externally and remove from repo
4. Alternative: Compress to JPEG with quality 80% (60-70% size reduction)

### 2.3 Documentation Overlap Analysis

#### Duplicate README.md Files

**Files:**
- `/home/kvn/workspace/ace/docs/README.md` (Facility documentation)
- `/home/kvn/workspace/ace/claudedocs/README.md` (Code documentation)

**Status:** NOT DUPLICATES - Correctly separated by purpose
**Recommendation:** KEEP BOTH
**Reasoning:** Clear separation between facility docs and code docs

#### Duplicate Filenames in Subdirectories

**In /docs:**
- `README.md` (found in multiple subdirs)

**In /claudedocs:**
- `README.md` (found in multiple subdirs)
- `IMPLEMENTATION_SUMMARY.md` (found in multiple subdirs)

**Analysis:** These are NOT problematic duplicates - they're README files for their respective directories
**Recommendation:** KEEP ALL
**Priority:** N/A

---

## TIER 3: Medium Risk Cleanup

### 3.1 Documentation Consolidation Opportunities

#### Potential Duplicates Between docs/ and claudedocs/

**Investigation Required:** Cross-reference these topics:
1. Architecture documentation appears in both:
   - `docs/architecture/` (facility architecture)
   - `claudedocs/01-architecture/` (code architecture)

   **Status:** SEPARATE CONCERNS - facility vs code architecture
   **Recommendation:** KEEP BOTH but ensure clear distinction

2. Research documentation:
   - `docs/research/` (market research)
   - `claudedocs/06-research/` (technical research)

   **Status:** SEPARATE CONCERNS - business vs technical
   **Recommendation:** KEEP BOTH

**Risk:** 3/4 - Could confuse contributors
**Recommendation:** Add cross-references in README files
**Priority:** MEDIUM
**Impact:** Improved documentation navigation

### 3.2 Test File Organization

**Current Structure:**
```
tests/
  setup.ts
  grass-rendering.test.tsx
  unit/
    QualityBadge.test.tsx
```

**Issues:**
1. `grass-rendering.test.tsx` at root - should be in appropriate subdirectory
2. Mixed test types (unit, integration, rendering) without clear organization
3. Package.json has extensive test scripts but inconsistent structure

**Recommendation:** REORGANIZE test structure
**Risk:** 3/4 - Could break test discovery
**Priority:** MEDIUM
**Impact:** Better test organization and discoverability

**Proposed Structure:**
```
tests/
  setup.ts
  unit/
    QualityBadge.test.tsx
    (other unit tests)
  integration/
    (integration tests)
  rendering/
    grass-rendering.test.tsx
    (other rendering tests)
  e2e/
    (playwright tests)
```

**Dependencies:**
- Verify Vitest and Playwright test discovery patterns
- Update test scripts in package.json if needed

---

## TIER 4: High Risk / Strategic Decisions

### 4.1 Component Architecture Decision

**Issue:** Unused or partially integrated components

**Components Requiring Decision:**
1. QualityBadge - TDD example, not production component
2. ReceptionArea - Fully implemented but not integrated
3. Grass - Imported but usage unclear

**Risk:** 4/4 - Architectural decision required
**Recommendation:** PROJECT STAKEHOLDER DECISION
**Priority:** LOW (no immediate impact)

**Options:**

**Option A: Keep All Components**
- Pros: Preserves work, examples, future features
- Cons: Code bloat, maintenance overhead
- Recommendation: Document purpose clearly

**Option B: Create /examples Directory**
- Pros: Separates examples from production code
- Cons: Requires restructuring
- Structure:
  ```
  examples/
    tdd-example/
      QualityBadge.tsx
      QualityBadge.test.tsx
  components/
    planned/
      ReceptionArea.tsx
    production/
      ThreeScene.tsx
      ClayCourtEffect.tsx
      (etc)
  ```

**Option C: Remove Unused Components**
- Pros: Leanest codebase
- Cons: Loses example code and future features
- Not recommended for this project

### 4.2 Documentation Strategy

**Current State:**
- `/docs/` - 459KB (Facility-focused)
- `/claudedocs/` - 643KB (Code-focused)
- Total: 1.1MB documentation (84+ files)

**Issues:**
1. High documentation count (84+ files)
2. Some overlap in architecture/research areas
3. No clear version control for docs (no CHANGELOG)

**Risk:** 4/4 - Affects entire team
**Recommendation:** DOCUMENT GOVERNANCE
**Priority:** LOW

**Proposed Actions:**
1. Create `DOCUMENTATION_GOVERNANCE.md` defining:
   - When to use `/docs` vs `/claudedocs`
   - Documentation review process
   - Archival strategy for outdated docs

2. Add cross-references:
   - Each README should link to related docs in other tree
   - Clear signposting: "Looking for code docs? See claudedocs/"

3. Implement doc versioning:
   - Add last-updated dates to key docs
   - Create archive process for superseded docs

---

## Cleanup Execution Plan

### Phase 1: Immediate Safe Cleanup (Week 1)

**Actions:**
1. ✅ Delete `components/ThreeScene.tsx.backup`
2. ✅ Delete `logs/dev-errors.log`
3. ✅ Add `logs/*.log` to `.gitignore`
4. ✅ Investigate git status anomaly for root-level .md files

**Expected Impact:** ~28KB saved, cleaner workspace

### Phase 2: Assets & Organization (Week 2)

**Actions:**
1. 🔍 Verify Grass component usage in ThreeScene.tsx
2. 🔍 Search all docs for references to `/inspo/` images
3. ⚠️ DECISION REQUIRED: Keep, compress, or archive inspiration images
4. 📝 Document QualityBadge as TDD example (add header comment)
5. 📝 Document ReceptionArea as planned feature (add header comment)

**Expected Impact:** 0-17MB saved (depending on image decision)

### Phase 3: Test Reorganization (Week 3)

**Actions:**
1. 📋 Create test organization proposal
2. ✅ Move `grass-rendering.test.tsx` to `tests/rendering/`
3. ✅ Update test discovery configuration if needed
4. ✅ Verify all test scripts still work

**Expected Impact:** Better test organization, no size change

### Phase 4: Documentation Governance (Ongoing)

**Actions:**
1. 📋 Create `DOCUMENTATION_GOVERNANCE.md`
2. ✅ Add cross-references between docs/ and claudedocs/
3. ✅ Add last-updated dates to key documentation files
4. 📋 Create documentation review checklist

**Expected Impact:** Improved documentation maintainability

---

## File-by-File Cleanup Checklist

### Components

| File | Lines | Status | Action | Risk | Priority |
|------|-------|--------|--------|------|----------|
| QualityBadge.tsx | 57 | KEEP | Document as TDD example | 2/4 | MEDIUM |
| ReceptionArea.tsx | 684 | KEEP | ✅ Active (used in ThreeScene) | 1/4 | - |
| Grass.tsx | 141 | KEEP | ✅ Active (used in ThreeScene) | 1/4 | - |
| BMSControlRoom.tsx | 333 | KEEP | ✅ Active (imported in ThreeScene) | 1/4 | - |
| ParkingLot.tsx | 368 | KEEP | ✅ Active (imported in ThreeScene) | 1/4 | - |
| ThreeScene.tsx.backup | 980 | DELETE | Backup file | 1/4 | HIGH |
| ThreeScene.tsx | 1467 | KEEP | Main 3D scene | 1/4 | - |
| ClayCourtEffect.tsx | 276 | KEEP | ✅ Active (court rendering) | 1/4 | - |
| NavBar.tsx | 74 | KEEP | ✅ Active (main navigation) | 1/4 | - |
| AIChat.tsx | 127 | KEEP | ✅ Active (chat interface) | 1/4 | - |
| Specifications.tsx | 101 | KEEP | ✅ Active (specs display) | 1/4 | - |

### Root Level Files

| File | Status | Action | Risk | Priority |
|------|--------|--------|------|----------|
| App.tsx | KEEP | Main app | 1/4 | - |
| index.tsx | KEEP | Entry point | 1/4 | - |
| types.ts | KEEP | Type definitions | 1/4 | - |
| vite.config.ts | KEEP | Build config | 1/4 | - |
| package.json | KEEP | Dependencies | 1/4 | - |
| README.md | KEEP | Project docs | 1/4 | - |
| metadata.json | KEEP | Project metadata | 1/4 | - |

### Directories

| Directory | Size | Action | Risk | Priority |
|-----------|------|--------|------|----------|
| inspo/ | 17MB | DECISION REQUIRED | 2/4 | MEDIUM |
| logs/ | 14KB | Delete logs, keep structure | 1/4 | HIGH |
| .snapshots/ | 14KB | Keep | 1/4 | - |
| scripts/ | - | Keep | 1/4 | - |
| tests/ | - | Reorganize structure | 3/4 | MEDIUM |
| docs/ | 459KB | Keep, add governance | 4/4 | LOW |
| claudedocs/ | 643KB | Keep, add governance | 4/4 | LOW |

---

## Risk Assessment Matrix

### Risk Levels Defined

**TIER 1 (Risk 1/4) - SAFE**
- Backup files
- Temporary files
- Log files
- Can be deleted without concern

**TIER 2 (Risk 2/4) - LOW RISK**
- Unused example code with educational value
- Large asset files that could be externalized
- Organizational improvements
- Can be changed with minimal review

**TIER 3 (Risk 3/4) - MEDIUM RISK**
- Test file reorganization
- Documentation consolidation
- Requires testing after changes

**TIER 4 (Risk 4/4) - HIGH RISK**
- Architectural decisions
- Component removal
- Documentation strategy changes
- Requires stakeholder approval

---

## Estimated Impact Summary

### Storage Savings

| Category | Potential Savings | Likelihood |
|----------|------------------|------------|
| Backup files | 28KB | 100% |
| Log files | 14KB | 100% |
| Inspiration images | 17MB | 50% (decision dependent) |
| **TOTAL** | **17MB max** | **Variable** |

### Code Quality Improvements

1. ✅ Clear component status (active/example/planned)
2. ✅ Better test organization
3. ✅ Cleaner git status
4. ✅ Improved documentation navigation

### Risks Mitigated

1. ❌ Accidental commits of log files (.gitignore update)
2. ❌ Confusion about component status (documentation)
3. ❌ Large repo clone times (image cleanup)
4. ❌ Test discovery issues (reorganization)

---

## Dependencies & Impacts

### Component Dependencies

```
App.tsx imports:
  ✅ NavBar (74 lines)
  ✅ ThreeScene (1467 lines)
  ✅ AIChat (127 lines)
  ✅ Specifications (101 lines)

ThreeScene.tsx imports:
  ✅ Grass (141 lines) - CONFIRMED USAGE line 540
  ✅ ClayCourtEffect (276 lines) - CONFIRMED USAGE
  ✅ ReceptionArea (684 lines) - CONFIRMED USAGE line 1041
  ✅ ParkingLot (368 lines) - CONFIRMED IMPORT line 23
  ✅ BMSControlRoom (333 lines) - CONFIRMED IMPORT line 24

Orphaned components:
  📋 QualityBadge (57 lines) - only used in tests (TDD example)

Total component lines: 3,628 (excluding backup)
Active production components: 10
Example/Test components: 1
```

### Test Dependencies

```
tests/unit/QualityBadge.test.tsx → components/QualityBadge.tsx
tests/grass-rendering.test.tsx → components/Grass.tsx (likely)
```

### Documentation Dependencies

- QualityBadge referenced in TDD documentation
- ReceptionArea may be referenced in architectural docs
- Inspiration images may be linked in design docs (requires verification)

---

## Recommendations Priority Order

### IMMEDIATE (This Week)

1. **DELETE** `components/ThreeScene.tsx.backup` (TIER 1, Risk 1/4)
2. **DELETE** `logs/dev-errors.log` (TIER 1, Risk 1/4)
3. **UPDATE** `.gitignore` to exclude `logs/*.log` (TIER 1, Risk 1/4)
4. **VERIFY** Grass component usage in ThreeScene.tsx (TIER 2, Risk 2/4)

### SHORT TERM (Next 2 Weeks)

5. **DOCUMENT** QualityBadge as TDD example with header comment (TIER 2, Risk 2/4)
6. **DOCUMENT** ReceptionArea as planned feature with header comment (TIER 2, Risk 2/4)
7. **DECIDE** on inspiration images: keep/compress/archive (TIER 2, Risk 2/4)
8. **REORGANIZE** test directory structure (TIER 3, Risk 3/4)

### MEDIUM TERM (Next Month)

9. **CREATE** `DOCUMENTATION_GOVERNANCE.md` (TIER 4, Risk 4/4)
10. **ADD** cross-references between docs/ and claudedocs/ (TIER 3, Risk 3/4)
11. **REVIEW** component architecture strategy (TIER 4, Risk 4/4)

### LONG TERM (Ongoing)

12. **IMPLEMENT** documentation versioning and archival process
13. **REVIEW** quarterly for new cleanup opportunities
14. **MONITOR** repository size and complexity metrics

---

## Approval Required

### Decisions Needed from Project Owner

1. **Inspiration Images** (`/inspo/` - 17MB)
   - [ ] Keep as-is in repository
   - [ ] Compress to JPEG format (save ~10MB)
   - [ ] Move to external storage (save 17MB)
   - [ ] Delete entirely

2. **Component Strategy**
   - [ ] Keep all components with documentation
   - [ ] Move examples to `/examples` directory
   - [ ] Remove unused components

3. **Test Organization**
   - [ ] Approve proposed test structure reorganization
   - [ ] Keep current structure

4. **Documentation Governance**
   - [ ] Implement proposed documentation governance
   - [ ] Maintain current approach

---

## Next Steps

1. **Review this plan** with project stakeholders
2. **Make decisions** on approval items above
3. **Execute Phase 1** (immediate safe cleanup)
4. **Schedule Phase 2** based on decisions made
5. **Track progress** using checkboxes in this document

---

## Metrics & Tracking

### Baseline (2025-11-22)

- Total repository size: ~130MB (with node_modules excluded)
- Documentation files: 84+
- Source files: 8 TSX components
- Asset files: 7 PNG images (17MB)
- Backup files: 1 (28KB)
- Log files: 1 (size unknown)

### Target After Cleanup

- Repository size: 113-130MB (depending on image decision)
- Documentation files: 84+ (no reduction, but better organized)
- Source files: 8 (no reduction, but clearly documented)
- Asset files: 0-7 (decision dependent)
- Backup files: 0
- Log files: 0 (gitignored)

### Success Metrics

- ✅ No backup files in repository
- ✅ No log files committed
- ✅ All components have clear status documentation
- ✅ Test structure is logical and organized
- ✅ Documentation has clear governance

---

## Document Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-22 | Quality Engineer | Initial comprehensive analysis |

---

## Additional Resources

- [Git Best Practices](https://git-scm.com/book/en/v2)
- [Test Organization Patterns](https://vitest.dev/guide/)
- [Documentation Architecture](https://www.writethedocs.org/)
- [Repository Maintenance](https://docs.github.com/en/repositories)

---

**END OF CLEANUP PLAN**

*No files were harmed in the creation of this analysis.*
