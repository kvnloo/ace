# ACE Facility Tracking Workflow
**Version**: 1.0.0
**Last Updated**: 2025-11-22
**Owner**: System Architect
**Purpose**: Sustainable system for tracking facility status and maintaining documentation currency

---

## 🎯 Workflow Overview

This workflow establishes a living documentation system that keeps facility status accurate as development progresses. It integrates with the existing `.claude/inventory/` system and provides clear processes for updates, reviews, and regeneration.

### Core Principles

1. **Documentation as Code**: All facility status lives in structured markdown and JSON
2. **Automated Where Possible**: Scripts regenerate inventories from source code
3. **Human-Reviewed Where Needed**: Architects validate completion percentages and priorities
4. **Git-Tracked Changes**: Every update creates a clear audit trail
5. **Low-Friction Updates**: Quick updates take <5 minutes

---

## 📋 Tracking System Components

### 1. Source of Truth Files

**Primary Inventory Files** (`.claude/inventory/`):
```
completion-status.md        # Overall completion tracking
components-catalog.md        # Full component inventory
feature-implementation.md    # Feature status by category
user-stories.md             # User story mapping
dependency-graph.json       # Component dependencies
documentation-map.json      # Documentation structure
DEPENDENCY_ANALYSIS.md      # Deep dependency analysis
```

**Blueprint Documents** (`docs/architecture/`):
```
facility-architecture.md    # Technical architecture
facility-blueprint.md       # High-level design vision
```

### 2. Update Frequency

| File | Update Trigger | Frequency | Owner |
|------|----------------|-----------|-------|
| `completion-status.md` | Component completion | After each feature | Developer |
| `components-catalog.md` | New component added | Weekly | Architect |
| `feature-implementation.md` | Feature milestone | Per sprint | Product |
| `dependency-graph.json` | Structural change | Automated | System |
| Blueprint docs | Major design change | As needed | Architect |

---

## 🔄 Standard Update Workflows

### Workflow 1: Developer Completes Feature

**Trigger**: Developer finishes implementing a component or feature

**Steps**:
```bash
1. Run regeneration script
   ./update-checklist.sh --component "ComponentName"

2. Review generated changes
   git diff .claude/inventory/completion-status.md

3. Add completion notes (if needed)
   # Edit completion-status.md to add:
   # - Implementation notes
   # - Known limitations
   # - Performance characteristics

4. Commit with standard message
   git add .claude/inventory/
   git commit -m "feat(tracking): Update ComponentName completion status

   - Component now at 95% completion
   - Added LOD optimization
   - Test coverage: 80%"

5. Optional: Request architect review for major milestones
```

**Time Commitment**: 3-5 minutes

---

### Workflow 2: Weekly Inventory Refresh

**Trigger**: Every Monday morning or start of sprint

**Steps**:
```bash
1. Full inventory regeneration
   ./update-checklist.sh --full-refresh

2. Review all changed files
   git diff .claude/inventory/

3. Update percentage estimates manually
   # Check completion-status.md
   # Verify component percentages align with reality
   # Adjust based on test coverage, functionality, polish

4. Flag components needing attention
   # Add ⚠️ markers for components with:
   # - Missing tests
   # - Performance issues
   # - Incomplete features

5. Commit inventory snapshot
   git add .claude/inventory/
   git commit -m "chore(tracking): Weekly inventory refresh

   Updated completion metrics:
   - Overall: 75% → 78%
   - Core: 100% (no change)
   - 3D Visualization: 92% → 94%
   - Test coverage: 15% → 18%"
```

**Time Commitment**: 10-15 minutes

---

### Workflow 3: New Section Implementation

**Trigger**: Starting work on a new facility section (e.g., vertical farm, recovery pods)

**Steps**:
```bash
1. Create from template
   ./new-section.sh "VerticalFarm"
   # Generates:
   # - docs/sections/vertical-farm-spec.md
   # - src/components/VerticalFarm/index.tsx (stub)
   # - .claude/inventory/sections/vertical-farm.md

2. Fill in specification using template
   # See: .claude/templates/section-implementation.md

3. Add to dependency graph
   # Update: .claude/inventory/dependency-graph.json
   # Document dependencies on other systems

4. Initialize component in catalog
   ./update-checklist.sh --add-component "VerticalFarm"

5. Commit initial structure
   git add docs/sections/ src/components/ .claude/inventory/
   git commit -m "feat(facility): Initialize VerticalFarm section

   - Created specification document
   - Added component stub
   - Updated dependency graph
   - Ready for implementation"
```

**Time Commitment**: 15-20 minutes

---

### Workflow 4: Architect Review Cycle

**Trigger**: Monthly or before major releases

**Steps**:
```bash
1. Generate review report
   ./architect-review.sh --generate-report

2. Review completion percentages
   # Check if percentages match actual functionality
   # Verify test coverage claims
   # Validate performance assertions

3. Identify gaps and priorities
   # Use template: .claude/workflows/architect-review.md
   # Document:
   # - Missing critical features
   # - Technical debt areas
   # - Priority recommendations

4. Update roadmap and milestones
   # Sync with: docs/architecture/roadmap.md
   # Adjust sprint planning based on gaps

5. Commit review outcomes
   git add .claude/workflows/reviews/
   git commit -m "docs(review): Architect review 2025-11-22

   Key findings:
   - Test coverage needs improvement (15% → target 60%)
   - ClayCourtEffect needs enhancement (60% → 90%)
   - Performance optimization phase needed

   Action items:
   - Schedule testing sprint
   - Prioritize visual effects polish
   - Plan LOD implementation phase"
```

**Time Commitment**: 45-60 minutes

---

## 🤖 Automation Scripts

### update-checklist.sh

**Purpose**: Regenerate inventory files from source code

**Usage**:
```bash
# Full refresh (all files)
./update-checklist.sh --full-refresh

# Single component update
./update-checklist.sh --component "ThreeScene"

# Specific file only
./update-checklist.sh --file completion-status.md

# Dry run (preview changes)
./update-checklist.sh --dry-run
```

**What It Does**:
1. Scans `src/components/**/*.tsx` for all React components
2. Counts lines of code per component
3. Detects test files in `src/tests/**/*.test.tsx`
4. Calculates test coverage percentage
5. Searches for TODO/FIXME comments
6. Analyzes TypeScript type coverage
7. Updates JSON dependency graph
8. Regenerates markdown documentation
9. Preserves manual completion percentages (doesn't overwrite)

**See**: `.claude/workflows/update-checklist.sh` for implementation

---

### new-section.sh

**Purpose**: Scaffold a new facility section with all required files

**Usage**:
```bash
./new-section.sh "SectionName"
```

**What It Creates**:
- Specification document from template
- Component directory structure
- Test file stub
- Inventory tracking file
- Dependency graph entry

---

### architect-review.sh

**Purpose**: Generate architect review report and checklist

**Usage**:
```bash
./architect-review.sh --generate-report
./architect-review.sh --export-pdf  # Optional: export to PDF
```

**What It Generates**:
- Completion status summary
- Gap analysis
- Priority recommendations
- Test coverage report
- Performance metrics review
- Checklist for manual review

---

## 📝 Manual Update Guidelines

### When to Update Manually

1. **Completion Percentages**: After testing a component, adjust percentage based on:
   - Functionality implemented vs. planned
   - Test coverage
   - Performance optimization level
   - Polish and refinement

2. **Implementation Notes**: Add context that scripts can't detect:
   - Why certain features are incomplete
   - Performance characteristics
   - Known limitations
   - Future enhancement plans

3. **Priority Markers**: Flag components that need attention:
   - ⚠️ for components needing work
   - ⭐ for production-ready components
   - 🚧 for components under active development

### Update Format Standards

**Completion Status Entry**:
```markdown
#### ComponentName ⭐ **COMPLETE** (95%)
- **Status**: Production-ready with minor limitations
- **Lines**: 1,234
- **Functionality**:
  - ✅ Core feature X implemented
  - ✅ Feature Y working
  - ⚠️ Feature Z partially complete
  - ❌ Feature W not implemented
- **Test Coverage**: ✅ Has test file (component.test.tsx)
- **Quality**: Excellent - Well-organized, performant
- **Completion**: 95% - Core complete, optimization pending
- **Notes**: [Add any relevant implementation context]
```

**Component Catalog Entry**:
```markdown
### ComponentName.tsx (1,234 lines)
**Purpose**: Brief description of component purpose
**Key Features**:
- Feature 1
- Feature 2
- Feature 3

**Architecture**:
- Technical approach
- Dependencies
- Integration points

**Known Limitations**:
- Limitation 1
- Limitation 2
```

---

## 🎯 Integration with Development Workflow

### Pre-Commit Checklist

Before committing component changes:
```bash
1. [ ] Component code committed
2. [ ] Tests added/updated (if applicable)
3. [ ] Run: ./update-checklist.sh --component "ComponentName"
4. [ ] Review inventory diff
5. [ ] Add manual completion notes
6. [ ] Commit inventory update
```

### Sprint Planning Integration

Use inventory data to:
1. Identify components below target completion percentage
2. Prioritize testing for untested components
3. Schedule polish work for partial components
4. Plan new sections with proper dependencies

### Release Readiness Checklist

Before releases, verify:
```bash
1. [ ] Run full inventory refresh
2. [ ] Architect review completed
3. [ ] All ⭐ COMPLETE components verified
4. [ ] Test coverage ≥ 60% for critical paths
5. [ ] No critical ⚠️ warnings
6. [ ] Documentation synchronized
7. [ ] Performance benchmarks meet targets
```

---

## 📊 Metrics and Reporting

### Weekly Metrics to Track

1. **Overall Completion**: % of facility complete
2. **Test Coverage**: % of components with tests
3. **Component Velocity**: Components completed per week
4. **Quality Score**: Average completion % across components
5. **Technical Debt**: Count of ⚠️ warnings

### Monthly Reports

Generate monthly summary:
```bash
./architect-review.sh --monthly-report
```

**Report Includes**:
- Completion trend (graph)
- Test coverage improvement
- Components completed this month
- Technical debt trends
- Priority recommendations for next month

---

## 🔧 Maintenance and Evolution

### Quarterly Reviews

Every quarter:
1. Review workflow effectiveness
2. Update templates based on lessons learned
3. Improve automation scripts
4. Adjust completion criteria if needed
5. Archive historical snapshots

### Continuous Improvement

Track workflow metrics:
- Time spent on updates
- Accuracy of automated detection
- Manual override frequency
- Developer satisfaction

Optimize based on data:
- Reduce friction points
- Automate repetitive tasks
- Simplify where possible
- Add automation where high-value

---

## 🚨 Common Issues and Solutions

### Issue: Completion percentages drift from reality

**Solution**:
- Schedule monthly architect review
- Add validation step in automation
- Require justification for >80% completion claims
- Cross-reference with test coverage

### Issue: Developers skip inventory updates

**Solution**:
- Make updates part of CI/CD pipeline
- Add git hook to remind on component changes
- Reduce update time with better automation
- Show value through sprint planning integration

### Issue: Inventory files conflict in Git

**Solution**:
- Use JSON for machine-edited data (easier to merge)
- Keep manual edits in separate sections
- Add merge conflict resolution guide
- Consider last-write-wins for completion %

### Issue: Automation misses new components

**Solution**:
- Improve file discovery patterns
- Add component registration system
- Manual fallback in weekly refresh
- Alert architect when new files detected

---

## 📚 Related Documentation

- **Templates**: `.claude/templates/section-implementation.md`
- **Scripts**: `.claude/workflows/update-checklist.sh`
- **Review Process**: `.claude/workflows/architect-review.md`
- **Architecture**: `docs/architecture/facility-architecture.md`
- **Inventory**: `.claude/inventory/completion-status.md`

---

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-11-22 | Initial workflow documentation |

---

**Next Review**: 2025-12-22
**Owned By**: System Architect
**Maintained By**: Development Team
