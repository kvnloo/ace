# MERGE PLAN - ARCHITECTURE DIAGRAM
## Visual Representation of Merge Strategy

---

## 📐 MERGE FLOW DIAGRAM

```
                                    CURRENT STATE
                                   (WORKING ✅)
                                        │
                        ┌───────────────┼───────────────┐
                        │               │               │
                   3D Renders      Grass Works    Loading Fixed
                     ✅                ✅              ✅
                        │               │               │
                        └───────────────┴───────────────┘
                                        │
                        ┌───────────────┴───────────────┐
                        │                               │
                   BACKUP CREATED                 TAG CREATED
                  (Safety Point)              (working-state-pre-merge)
                        │                               │
                        └───────────────┬───────────────┘
                                        │
                        ┌───────────────┴───────────────┐
                        │                               │
                     PR #5                           PR #6
                  (5 docs) 🟢                    (253 files) 🔴
                        │                               │
                        │                               │
                  ┌─────┴─────┐                   ┌─────┴─────┐
                  │           │                   │           │
              RELOCATE    ORGANIZE            SKIP CODE   REVIEW DOCS
              to proper   structure           CHANGES     (selective)
              location      ✅                   ❌           ⚠️
                  │           │                   │           │
                  └─────┬─────┘                   └─────┬─────┘
                        │                               │
                        │                               │
                   COMMIT & TEST                   EVALUATE ONLY
                        ✅                              ⚠️
                        │                               │
                        └───────────────┬───────────────┘
                                        │
                                  VALIDATION
                                        │
                    ┌───────────────────┼───────────────────┐
                    │                   │                   │
               BUILD TEST          TYPECHECK          VISUAL CHECK
                    │                   │                   │
                    │                   │                   │
                  PASS?               PASS?               PASS?
                    │                   │                   │
              ┌─────┴─────┐       ┌─────┴─────┐       ┌─────┴─────┐
              │           │       │           │       │           │
             YES         NO      YES         NO      YES         NO
              │           │       │           │       │           │
              ✅          ❌      ✅          ❌      ✅          ❌
              │           │       │           │       │           │
              └─────┬─────┴───────┴─────┬─────┴───────┴─────┬─────┘
                    │                   │                   │
                    │              ANY FAILURE?             │
                    │                   │                   │
                    │                  YES                  │
                    │                   │                   │
                    │              ROLLBACK                 │
                    │              IMMEDIATELY              │
                    │                   │                   │
                    │          git reset --hard             │
                    │      working-state-pre-merge          │
                    │                   │                   │
                    │                   ✅                  │
                    │                   │                   │
                    └───────────────────┴───────────────────┘
                                        │
                                        │
                                   ALL PASS?
                                        │
                                       YES
                                        │
                                        ✅
                                        │
                                  MERGE COMPLETE
                                   (SUCCESS!)
```

---

## 🗂️ FILE ORGANIZATION STRUCTURE

### Before Merge
```
project-root/
├── App.tsx (WORKING ✅)
├── src/
│   └── components/
│       ├── GrassAdaptive.tsx (WORKING ✅)
│       ├── InstancedTennisCourtsFull.tsx (WORKING ✅)
│       └── loading/ (WORKING ✅)
├── claudedocs-old/
│   ├── 01-architecture/
│   ├── 02-implementation-guides/
│   └── ... (organized)
└── [root is clean]
```

### After PR #5 Merge
```
project-root/
├── App.tsx (UNCHANGED ✅)
├── src/
│   └── components/ (UNCHANGED ✅)
├── claudedocs-old/ (UNCHANGED ✅)
└── claudedocs/
    └── 06-research/
        └── facilities/
            ├── hvac-specifications.md ⬅️ NEW
            ├── ice-hockey-specifications.md ⬅️ NEW
            ├── accessibility-safety-standards.md ⬅️ NEW
            ├── spectator-amenities.md ⬅️ NEW
            └── lighting-specifications.md ⬅️ NEW
```

### PR #6 (SKIPPED - Code Changes Avoided)
```
❌ SKIP THESE:
├── App.tsx (111 additions, 150 deletions) ⬅️ TOO RISKY
├── src/components/ThreeSceneDiagnostic.tsx ⬅️ NOT NEEDED
└── vite.config.ts changes ⬅️ AVOID CONFLICTS

⚠️ REVIEW SELECTIVELY:
└── claudedocs/ (100+ new docs) ⬅️ CHECK FOR DUPLICATES
```

---

## 🔄 DECISION FLOW

```
                           START MERGE PLANNING
                                    │
                                    ▼
                        IS CURRENT STATE WORKING?
                                    │
                        ┌───────────┴───────────┐
                       NO                      YES
                        │                       │
                        ▼                       ▼
                  FIX FIRST!              PROCEED SAFELY
                  (DO NOT MERGE)          CREATE BACKUPS
                        │                       │
                        ▼                       ▼
                                       ANALYZE PR #5
                                                │
                                    ┌───────────┴───────────┐
                                    │                       │
                              DOCS ONLY?              CODE CHANGES?
                                    │                       │
                                   YES                     NO
                                    │                       │
                                    ▼                       ▼
                              LOW RISK 🟢            EVALUATE RISK
                              MERGE SAFELY                  │
                                    │           ┌───────────┴───────────┐
                                    │      CRITICAL?              NON-CRITICAL?
                                    │           │                       │
                                    ▼          YES                     NO
                                           ❌ SKIP                ⚠️ REVIEW
                                            │                       │
                                            └───────────┬───────────┘
                                                        │
                                                        ▼
                                               ANALYZE PR #6
                                                        │
                                    ┌───────────────────┴───────────────────┐
                                    │                                       │
                              CODE CHANGES                            DOCUMENTATION
                             (253 files)                               (100+ files)
                                    │                                       │
                                    ▼                                       ▼
                           CONFLICTS WITH                          DUPLICATES OF
                           WORKING STATE?                         CLAUDEDOCS-OLD?
                                    │                                       │
                                   YES                          ┌───────────┴───────────┐
                                    │                          YES                     NO
                                    ▼                           │                       │
                              ❌ SKIP MERGE                ⚠️ SKIP                ✅ CONSIDER
                            (TOO RISKY)                   (REDUNDANT)             (EVALUATE)
                                    │                           │                       │
                                    └───────────────────────────┴───────────────────────┘
                                                        │
                                                        ▼
                                              EXECUTE MERGE PLAN
                                                        │
                                                        ▼
                                              VALIDATE THOROUGHLY
                                                        │
                                    ┌───────────────────┴───────────────────┐
                                    │                                       │
                              ALL TESTS PASS                          ANY FAILURE
                                    │                                       │
                                    ▼                                       ▼
                              ✅ SUCCESS                            ❌ ROLLBACK
                            MERGE COMPLETE                        RESTORE BACKUP
                                    │                                       │
                                    └───────────────────┬───────────────────┘
                                                        │
                                                        ▼
                                               UPDATE DOCUMENTATION
                                                 (THIS DOCUMENT)
```

---

## 🎯 RISK HEAT MAP

```
                    MERGE DECISION MATRIX

        LOW RISK              MEDIUM RISK           HIGH RISK
          🟢                      🟡                   🔴
    ┌─────────────────┬─────────────────────┬─────────────────────┐
    │                 │                     │                     │
    │  PR #5 DOCS     │  PR #6 NEW DOCS     │   APP.TSX           │
    │                 │                     │                     │
    │  ✅ MERGE       │  ⚠️ REVIEW          │   ❌ SKIP           │
    │                 │                     │                     │
    ├─────────────────┼─────────────────────┼─────────────────────┤
    │                 │                     │                     │
    │  .GITIGNORE     │  VITE.CONFIG.TS     │   GRASS SYSTEM      │
    │                 │                     │                     │
    │  ✅ SAFE        │  ⚠️ REVIEW          │   ❌ DO NOT TOUCH   │
    │                 │                     │                     │
    ├─────────────────┼─────────────────────┼─────────────────────┤
    │                 │                     │                     │
    │  README.MD      │  DIAGNOSTIC TOOLS   │   LOADING SCREEN    │
    │                 │                     │                     │
    │  ✅ SAFE        │  ⚠️ OPTIONAL        │   ❌ DO NOT TOUCH   │
    │                 │                     │                     │
    └─────────────────┴─────────────────────┴─────────────────────┘

    LEGEND:
    ✅ Safe to merge
    ⚠️ Review carefully before merging
    ❌ Skip entirely (too risky)
```

---

## 🏗️ SYSTEM ARCHITECTURE LAYERS

```
┌─────────────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   App.tsx   │  │  NavBar.tsx │  │ Loading UI  │         │
│  │   (SKIP)    │  │   (SAFE)    │  │  (CRITICAL) │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                   COMPONENT LAYER                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │    Grass    │  │   Courts    │  │  Lighting   │         │
│  │  (WORKING)  │  │ (WORKING)   │  │  (WORKING)  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                   RENDERING LAYER                           │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Three.js / React Three Fiber           │    │
│  │                    (DO NOT TOUCH)                   │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                   DOCUMENTATION LAYER                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ claudedocs- │  │ claudedocs/ │  │   PR #5     │         │
│  │    old/     │  │06-research/ │  │ Research    │         │
│  │   (KEEP)    │  │  (NEW)      │  │  (MERGE)    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘

MERGE STRATEGY BY LAYER:
━━━━━━━━━━━━━━━━━━━━━
Presentation:   ❌ SKIP (too risky to change working UI)
Component:      ❌ SKIP (grass & courts working perfectly)
Rendering:      ❌ SKIP (foundation layer - never touch)
Documentation:  ✅ MERGE (PR #5 safe, PR #6 review selectively)
```

---

## 📊 TIMELINE DIAGRAM

```
WEEK 1-2: Background
━━━━━━━━━━━━━━━━━━━━
│
├─ 20+ attempts to fix loading screen
├─ Multiple grass rendering iterations
├─ Court positioning fixes
└─ Finally achieved working state ✅
                │
                │
WEEK 3: Current State (NOW)
━━━━━━━━━━━━━━━━━━━━━━━━━━
│
├─ PR #5 created (research docs)
├─ PR #6 created (debug branch - 253 files)
└─ Current branch: claude/merge-3d-features-carefully
                │
                │
                ▼
        ┌───────────────┐
        │  THIS MERGE   │  ⬅️ YOU ARE HERE
        │     PLAN      │
        └───────────────┘
                │
                ▼
EXECUTION PHASE (5-10 minutes)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│
├─ Step 1: Create backups (2 min)
├─ Step 2: Merge PR #5 docs (2 min)
├─ Step 3: Validate build (1 min)
├─ Step 4: Skip PR #6 code (0 min - decision)
└─ Step 5: Final validation (1 min)
                │
                │
POST-MERGE PHASE
━━━━━━━━━━━━━━━
│
├─ Working state maintained ✅
├─ Research docs added ✅
└─ High-risk changes avoided ✅
                │
                │
FUTURE (Optional)
━━━━━━━━━━━━━━━
│
├─ Individual component extraction from PR #6
├─ Selective feature additions
└─ Gradual improvements (if needed)
```

---

## 🔐 SAFETY ARCHITECTURE

```
                    SAFETY LAYERS

┌─────────────────────────────────────────┐
│         LAYER 4: ROLLBACK PLAN          │
│  git reset --hard working-state-pre-merge│
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│      LAYER 3: VALIDATION GATES          │
│  Build ✅ → TypeCheck ✅ → Visual ✅    │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│       LAYER 2: BACKUP BRANCH            │
│     backup/pre-merge-{timestamp}        │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│         LAYER 1: SAFETY TAG             │
│      working-state-pre-merge            │
└─────────────────────────────────────────┘
                    │
                    ▼
            PROTECTED STATE
           (CURRENT WORKING)
```

---

## 📈 COMPLEXITY COMPARISON

```
OPTION A: Full PR #6 Merge (REJECTED)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Risk:       ▓▓▓▓▓▓▓▓▓▓ 10/10 🔴
Effort:     ▓▓▓▓▓▓▓▓░░  8/10
Value:      ▓▓░░░░░░░░  2/10
Time:       2-4 hours
Rollback:   ▓▓▓▓▓▓▓▓▓▓ 10/10 (very difficult)

OPTION B: PR #5 Only (RECOMMENDED)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Risk:       ▓░░░░░░░░░  1/10 🟢
Effort:     ▓░░░░░░░░░  1/10
Value:      ▓▓▓▓▓▓▓░░░  7/10
Time:       5-10 minutes
Rollback:   ▓░░░░░░░░░  1/10 (very easy)

OPTION C: PR #5 + Selective PR #6 Docs (ACCEPTABLE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Risk:       ▓▓▓░░░░░░░  3/10 🟡
Effort:     ▓▓▓░░░░░░░  3/10
Value:      ▓▓▓▓▓▓▓▓░░  8/10
Time:       15-30 minutes
Rollback:   ▓▓░░░░░░░░  2/10 (easy)

DECISION: OPTION B (PR #5 Only)
Rationale: Minimal risk, quick execution, maintains working state
```

---

## 🎯 SUCCESS METRICS DASHBOARD

```
┌─────────────────────────────────────────────────────────┐
│                  MERGE SUCCESS METRICS                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Build Status        [████████████████████] 100% ✅     │
│  TypeScript          [████████████████████] 100% ✅     │
│  Visual Regression   [████████████████████] 100% ✅     │
│  Performance         [████████████████████] >30 FPS ✅  │
│  Documentation       [████████████████████] 100% ✅     │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  Risk Avoided        [████████████████████] 10/10 🛡️   │
│  Time Saved          [████████████████████] 2-4 hrs ⏱️  │
│  Working State       [████████████████████] Preserved ✅│
│                                                         │
└─────────────────────────────────────────────────────────┘

TARGET: All bars at 100% or better
CURRENT: READY FOR EXECUTION
```

---

**END OF ARCHITECTURE DIAGRAM**

For execution details, see:
- **Full Plan**: [MERGE_PLAN_PR5_PR6.md](./MERGE_PLAN_PR5_PR6.md)
- **Quick Reference**: [MERGE_PLAN_QUICK_REFERENCE.md](./MERGE_PLAN_QUICK_REFERENCE.md)
