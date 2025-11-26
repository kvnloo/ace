# MERGE PLAN - QUICK REFERENCE GUIDE
## TL;DR Execution Guide

⚠️ **READ THE FULL PLAN FIRST**: [MERGE_PLAN_PR5_PR6.md](./MERGE_PLAN_PR5_PR6.md)

---

## 🎯 ONE-LINE SUMMARY

**Merge PR #5 docs safely, SKIP PR #6 code changes, selectively add PR #6 docs**

---

## ⚡ ULTRA-QUICK START (5 Minutes)

### Step 1: Safety First (2 min)
```bash
# Backup everything
git branch backup/pre-merge-$(date +%Y%m%d-%H%M%S)
git tag -a working-state-pre-merge -m "Last known good state"
git stash push -m "Pre-merge safety"

# Verify current state works
npm run build && npm run typecheck
```

### Step 2: PR #5 Merge (2 min)
```bash
# Create target directory
mkdir -p claudedocs/06-research/facilities

# Get files from PR #5
git checkout pr-5-branch -- \
  HVAC_Multi-Sport_Facility_Technical_Specifications.md \
  ice-hockey-rink-specifications.md \
  sports-facility-accessibility-safety-standards.md \
  sports-facility-spectator-amenities-specifications.md \
  sports-lighting-specifications.md

# Relocate
mv HVAC_Multi-Sport_Facility_Technical_Specifications.md \
   claudedocs/06-research/facilities/hvac-specifications.md
mv ice-hockey-rink-specifications.md \
   claudedocs/06-research/facilities/ice-hockey-specifications.md
mv sports-facility-accessibility-safety-standards.md \
   claudedocs/06-research/facilities/accessibility-safety-standards.md
mv sports-facility-spectator-amenities-specifications.md \
   claudedocs/06-research/facilities/spectator-amenities.md
mv sports-lighting-specifications.md \
   claudedocs/06-research/facilities/lighting-specifications.md

# Commit
git add claudedocs/06-research/
git commit -m "docs: Integrate research documentation from PR #5"
```

### Step 3: Validate (1 min)
```bash
npm run build && npm run typecheck && echo "✅ SUCCESS"
```

### Step 4: PR #6 Decision
```bash
# RECOMMENDED: SKIP PR #6 code changes entirely
# Only selectively review documentation if needed

echo "✅ Merge complete - PR #5 integrated, PR #6 skipped for safety"
```

---

## 🚨 ROLLBACK (IF ANYTHING BREAKS)

```bash
git merge --abort 2>/dev/null
git reset --hard working-state-pre-merge
git clean -fd
npm run build
```

---

## 📊 RISK LEVELS

| Component | Risk | Action |
|-----------|------|--------|
| PR #5 Docs | 🟢 LOW | ✅ Merge safely |
| PR #6 Docs | 🟡 MEDIUM | ⚠️ Review selectively |
| PR #6 Code | 🔴 CRITICAL | ❌ SKIP entirely |
| App.tsx | 🔴 CRITICAL | ❌ DO NOT TOUCH |
| Grass System | 🔴 CRITICAL | ❌ DO NOT TOUCH |
| Loading Screen | 🔴 CRITICAL | ❌ DO NOT TOUCH |

---

## ✅ VALIDATION CHECKLIST

After merge, verify:
- [ ] `npm run build` succeeds
- [ ] `npm run typecheck` has zero errors
- [ ] `npm run dev` starts without errors
- [ ] 3D scene renders correctly
- [ ] Grass displays properly
- [ ] Loading screen works
- [ ] No console errors
- [ ] FPS > 30

---

## 🎓 DECISION RATIONALE

**Why skip PR #6 code?**
- Current state is working (after 20+ fix attempts)
- PR #6 has 253 files changed (too risky)
- App.tsx changes conflict with working version
- Documentation can be added without code changes
- Risk vs. reward doesn't justify full merge

**Why merge PR #5?**
- Documentation only (zero code risk)
- Valuable research content
- Easy to relocate to proper location
- No dependencies or conflicts
- Can rollback in seconds if needed

---

## 💡 TIPS

1. **Go slow** - Test after each step
2. **Commit often** - Small commits are safer
3. **Read errors** - Don't ignore TypeScript warnings
4. **Trust the backup** - You can always rollback
5. **When in doubt, skip** - Working code > new features

---

## 📞 EMERGENCY CONTACTS

**If something breaks**:
1. Run rollback procedure above
2. Check [MERGE_PLAN_PR5_PR6.md](./MERGE_PLAN_PR5_PR6.md) Section "Rollback Strategy"
3. Document what went wrong
4. Don't panic - you have backups

---

## 🎯 SUCCESS METRICS

**You're done when**:
- ✅ PR #5 docs are in `claudedocs/06-research/facilities/`
- ✅ Build passes
- ✅ TypeScript compiles
- ✅ 3D scene works
- ✅ No new errors

**Time estimate**: 5-10 minutes for safe PR #5 merge

---

## 📚 FULL DOCUMENTATION

For complete details, risk analysis, and comprehensive procedures:
**→ [MERGE_PLAN_PR5_PR6.md](./MERGE_PLAN_PR5_PR6.md)**

---

**Last Updated**: 2025-11-26
**Status**: Ready for execution
**Confidence Level**: HIGH for PR #5, SKIP PR #6 code
