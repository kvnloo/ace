# ACE Facility Tracking Workflows

**Purpose**: Sustainable system for maintaining accurate facility documentation as development evolves
**Version**: 1.0.0
**Last Updated**: 2025-11-22

---

## 📁 System Overview

This directory contains the complete workflow system for tracking ACE facility implementation status, ensuring documentation stays current, and maintaining architectural quality over time.

### What Problem Does This Solve?

**Without this system**:
- Documentation becomes stale and inaccurate
- Completion percentages drift from reality
- No clear process for tracking progress
- Architectural drift goes unnoticed
- Tribal knowledge isn't captured

**With this system**:
- Documentation auto-regenerates from source code
- Clear workflows for all team members
- Architectural reviews on schedule
- Progress tracked consistently
- Knowledge preserved in templates

---

## 🗂️ Files in This System

### Core Documentation

1. **`facility-tracking.md`** - Master workflow document
   - Complete tracking workflow
   - Update procedures for all scenarios
   - Integration with development process
   - Metrics and reporting guidance

2. **`architect-review.md`** - Review process
   - Monthly/quarterly review checklist
   - Completion verification procedures
   - Quality assessment criteria
   - Technical debt tracking

3. **`README.md`** (this file) - Quick start guide
   - System overview
   - Getting started instructions
   - Quick reference for common tasks

### Automation Scripts

4. **`update-checklist.sh`** - Inventory regeneration
   - Scans source code for components
   - Calculates metrics (LOC, test coverage)
   - Regenerates inventory markdown files
   - Updates dependency graphs

### Templates

5. **`../.claude/templates/section-implementation.md`** - New section template
   - Comprehensive specification template
   - Guides new feature development
   - Ensures consistent documentation
   - Includes all architectural considerations

---

## 🚀 Quick Start

### First Time Setup

```bash
# Navigate to workflows directory
cd /home/kvn/workspace/evolve/repos/ace/.claude/workflows

# Verify script is executable
chmod +x update-checklist.sh

# Run initial inventory refresh
./update-checklist.sh --full-refresh

# Review generated files
git diff ../inventory/
```

### Daily Developer Workflow

**When you complete a component feature**:
```bash
# 1. Update inventory for your component
./update-checklist.sh --component "YourComponent"

# 2. Review changes
git diff ../inventory/completion-status.md

# 3. Add any manual notes about completion
# Edit: .claude/inventory/completion-status.md

# 4. Commit inventory update
git add ../inventory/
git commit -m "feat(tracking): Update YourComponent status"
```

**Time**: ~3 minutes

### Weekly Team Workflow

**Every Monday or start of sprint**:
```bash
# 1. Full inventory refresh
./update-checklist.sh --full-refresh

# 2. Review all changes
git diff ../inventory/

# 3. Update completion percentages
# Edit: .claude/inventory/completion-status.md
# Verify percentages align with reality

# 4. Commit weekly snapshot
git add ../inventory/
git commit -m "chore(tracking): Weekly inventory refresh

Updated metrics and completion percentages"
```

**Time**: ~10-15 minutes

### Monthly Architect Workflow

**Before releases or monthly review**:
```bash
# 1. Read architect review checklist
cat architect-review.md

# 2. Generate review report
# (Follow checklist in architect-review.md)

# 3. Complete review form
# Create: .claude/workflows/reviews/YYYY-MM-DD-review.md

# 4. Commit review results
git add reviews/
git commit -m "docs(review): Architect review YYYY-MM-DD"
```

**Time**: ~45-60 minutes

---

## 📚 Common Tasks

### Task: Start New Facility Section

**Scenario**: Beginning work on new section (e.g., Vertical Farm, Recovery Pods)

**Steps**:
```bash
# 1. Copy section template
cp ../.claude/templates/section-implementation.md \
   ../../docs/sections/vertical-farm-spec.md

# 2. Fill in template
# Edit: docs/sections/vertical-farm-spec.md

# 3. Create component structure
mkdir -p ../../src/components/VerticalFarm

# 4. Create initial stub
cat > ../../src/components/VerticalFarm/index.tsx <<'EOF'
import React from 'react';

interface VerticalFarmProps {
  position?: [number, number, number];
}

export const VerticalFarm: React.FC<VerticalFarmProps> = ({ position = [0, 0, 0] }) => {
  return (
    <group position={position}>
      {/* TODO: Implement vertical farm */}
    </group>
  );
};
EOF

# 5. Update inventory
./update-checklist.sh --component "VerticalFarm"

# 6. Commit initial structure
git add ../../docs/sections/ ../../src/components/ ../inventory/
git commit -m "feat(facility): Initialize VerticalFarm section"
```

### Task: Check Component Completion Status

**Scenario**: Want to see status of specific component

**Steps**:
```bash
# View completion status
grep -A 20 "ComponentName" ../inventory/completion-status.md

# Or view full catalog entry
grep -A 30 "ComponentName.tsx" ../inventory/components-catalog.md

# Check dependencies
jq '.components.ComponentName' ../inventory/dependency-graph.json
```

### Task: Update Completion Percentage

**Scenario**: Component reached new milestone, need to update percentage

**Steps**:
```bash
# 1. Run inventory update
./update-checklist.sh --component "ComponentName"

# 2. Edit completion status
vim ../inventory/completion-status.md

# Find component section, update:
# - Completion percentage: XX% → YY%
# - Status markers (⭐, ⚠️, 🚧)
# - Functionality checkboxes (✅, ❌)
# - Implementation notes

# 3. Commit update
git add ../inventory/completion-status.md
git commit -m "chore(tracking): Update ComponentName to YY%

Completed features:
- Feature 1
- Feature 2

Remaining work:
- Feature 3"
```

### Task: Generate Monthly Report

**Scenario**: Need to report progress to stakeholders

**Steps**:
```bash
# 1. Run full refresh
./update-checklist.sh --full-refresh

# 2. Extract key metrics
cat ../inventory/completion-status.md | grep "Overall Completion\|Test coverage\|Total components"

# 3. Create summary (manual)
cat > monthly-report-YYYY-MM.md <<'EOF'
# ACE Facility - Monthly Progress Report
Date: YYYY-MM

## Metrics
- Overall Completion: XX%
- Test Coverage: YY%
- Components: N total, M complete

## Completed This Month
- Component A (100%)
- Component B (95%)
- Component C (90%)

## In Progress
- Component D (75%)
- Component E (60%)

## Planned Next Month
- Complete Component D
- Begin Component F
- Test coverage improvement
EOF
```

---

## 🔧 Script Reference

### update-checklist.sh

**Purpose**: Regenerate inventory from source code

**Options**:
```bash
# Full refresh (all files)
./update-checklist.sh --full-refresh

# Single component update
./update-checklist.sh --component "ComponentName"

# Specific file only
./update-checklist.sh --file completion-status.md

# Preview without writing
./update-checklist.sh --dry-run

# Help
./update-checklist.sh --help
```

**What it does**:
1. Scans `src/components/**/*.tsx`
2. Counts lines of code
3. Detects test files
4. Calculates test coverage
5. Finds TODO/FIXME comments
6. Analyzes TypeScript types
7. Updates dependency graph
8. Regenerates markdown docs

**What it DOESN'T do**:
- Overwrite manual completion percentages
- Delete manual notes/comments
- Change component categorization
- Modify architecture decisions

---

## 📊 Metrics Tracked

### Automatically Tracked

**By update-checklist.sh**:
- Total component count
- Lines of code per component
- Test file presence
- Test coverage percentage
- TODO/FIXME count
- Import dependencies
- File creation dates

### Manually Tracked

**By developers**:
- Completion percentages (0-100%)
- Status markers (⭐, ⚠️, 🚧)
- Functionality checklists (✅, ❌)
- Implementation notes
- Known limitations
- Future enhancements

### Review Tracked

**By architect**:
- Architectural consistency
- Code quality scores
- Technical debt items
- Risk assessments
- Strategic alignment

---

## 🎯 Best Practices

### DO ✅

- **Run updates after every significant change**
- **Review generated diffs before committing**
- **Add manual notes for context**
- **Keep completion percentages honest**
- **Update immediately, not in batches**
- **Use consistent status markers**
- **Document limitations clearly**

### DON'T ❌

- **Skip inventory updates ("I'll do it later")**
- **Inflate completion percentages**
- **Delete auto-generated sections**
- **Ignore drift between docs and reality**
- **Batch weeks of updates together**
- **Use inconsistent formatting**
- **Leave broken documentation**

---

## 🔄 Integration Points

### Git Workflow

**Pre-commit hook (optional)**:
```bash
# .git/hooks/pre-commit
#!/bin/bash
# Check if components changed
if git diff --cached --name-only | grep -q "src/components/"; then
  echo "Component changes detected - consider updating inventory"
  echo "Run: cd .claude/workflows && ./update-checklist.sh"
fi
```

### CI/CD Pipeline

**GitHub Actions (future)**:
```yaml
# .github/workflows/inventory-check.yml
name: Check Inventory Currency

on: [pull_request]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Check inventory age
        run: |
          # Verify inventory updated recently
          # Warn if stale
```

### Project Board

**Sync with GitHub Projects**:
- Tag issues with completion percentages
- Auto-update from inventory
- Dashboard showing progress

---

## 📈 Success Metrics

**How to know the system is working**:

✅ **Good Signs**:
- Inventory updated weekly minimum
- Completion percentages accurate (±5%)
- Documentation matches reality
- Developers use system regularly
- Architect reviews happen on schedule
- Technical debt tracked and managed

❌ **Warning Signs**:
- Inventory not updated in >2 weeks
- Completion claims don't match testing
- Documentation contradicts code
- Developers skip updates
- Reviews delayed/skipped
- Technical debt growing unchecked

---

## 🚨 Troubleshooting

### Problem: Script fails with "file not found"

**Solution**:
```bash
# Verify you're in correct directory
pwd
# Should be: /path/to/ace/.claude/workflows

# Check script exists
ls -la update-checklist.sh

# Make executable if needed
chmod +x update-checklist.sh
```

### Problem: Generated output looks wrong

**Solution**:
```bash
# Run in dry-run mode to preview
./update-checklist.sh --dry-run

# Check source directory paths
grep "SRC_DIR\|INVENTORY_DIR" update-checklist.sh

# Verify component files exist
find ../../src/components -name "*.tsx" | head
```

### Problem: Manual edits get overwritten

**Solution**:
- Script preserves manual sections
- Only regenerates automated metrics
- If overwritten, restore from git:
```bash
git checkout -- ../inventory/completion-status.md
```

### Problem: Completion percentages don't update

**Solution**:
- Script doesn't auto-update percentages
- This is intentional - human judgment required
- Update manually in completion-status.md

---

## 📅 Maintenance Schedule

### Daily
- [ ] Update inventory when completing features
- [ ] Quick review of auto-generated changes

### Weekly (Monday/Sprint Start)
- [ ] Full inventory refresh
- [ ] Verify completion percentages
- [ ] Update status markers
- [ ] Review TODO count

### Monthly
- [ ] Architect review (full checklist)
- [ ] Generate progress report
- [ ] Assess technical debt
- [ ] Update roadmap

### Quarterly
- [ ] Review workflow effectiveness
- [ ] Update templates
- [ ] Improve automation
- [ ] Archive historical data

---

## 🔍 Related Documentation

**Architecture**:
- `/docs/architecture/facility-architecture.md` - Technical architecture
- `/docs/architecture/facility-blueprint.md` - High-level vision

**Inventory**:
- `/.claude/inventory/completion-status.md` - Component status
- `/.claude/inventory/components-catalog.md` - Full catalog
- `/.claude/inventory/dependency-graph.json` - Dependencies

**Templates**:
- `/.claude/templates/section-implementation.md` - New section spec

**Workflows**:
- `facility-tracking.md` - Complete workflow guide
- `architect-review.md` - Review process
- `update-checklist.sh` - Automation script

---

## 🎓 Training & Onboarding

### For New Developers

**Week 1**:
1. Read this README
2. Review facility-tracking.md
3. Run update-checklist.sh in dry-run mode
4. Shadow experienced developer doing update

**Week 2**:
1. Update inventory for first completed component
2. Ask questions about process
3. Suggest improvements

### For Architects

**Initial Training**:
1. Read architect-review.md thoroughly
2. Review past reviews (if any)
3. Shadow monthly review process
4. Conduct first review with mentor

**Ongoing**:
1. Monthly review execution
2. Process improvement suggestions
3. Template updates

---

## 🔮 Future Enhancements

### Planned Improvements

**v1.1** (Next Quarter):
- [ ] Automated test coverage calculation
- [ ] Component complexity metrics
- [ ] Performance benchmark tracking
- [ ] Automatic category classification

**v1.2** (6 Months):
- [ ] CI/CD integration
- [ ] GitHub Projects sync
- [ ] Dashboard visualization
- [ ] Trend analysis

**v2.0** (Long-term):
- [ ] ML-based completion prediction
- [ ] Automatic issue creation
- [ ] Smart dependency analysis
- [ ] Real-time status updates

### Community Contributions

**How to contribute**:
1. Use system, note pain points
2. Propose improvements
3. Submit workflow enhancements
4. Share best practices

---

## 📞 Support & Questions

**For help**:
1. Check this README first
2. Review facility-tracking.md
3. Ask in team channel
4. Contact system architect

**For issues**:
1. Verify script permissions
2. Check file paths
3. Review error messages
4. File issue with details

---

## ✅ Quick Reference Card

**Daily** (3 min):
```bash
./update-checklist.sh --component "MyComponent"
git add ../inventory/ && git commit -m "feat(tracking): Update"
```

**Weekly** (15 min):
```bash
./update-checklist.sh --full-refresh
# Review + commit
```

**Monthly** (60 min):
```bash
# Follow architect-review.md checklist
# Generate report
# Commit review
```

**New Section** (20 min):
```bash
cp ../templates/section-implementation.md ../../docs/sections/new-section.md
# Fill template
# Create component stub
./update-checklist.sh --full-refresh
```

---

**Version**: 1.0.0
**Last Updated**: 2025-11-22
**Next Review**: 2025-12-22
**Owner**: System Architect
**Contributors**: Development Team
