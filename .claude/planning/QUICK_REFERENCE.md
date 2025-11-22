# Construction Plan Quick Reference Card
**Industrial Architecture Methodology for ACE Migration**

---

## 5-Phase Construction Plan (14 Weeks)

```
WEEK 1-1.5   │ FOUNDATION    │ Types, Config, Data Models
WEEK 2.5-4.5 │ STRUCTURE     │ Architecture, Routing, State
WEEK 4.5-6.5 │ ENVELOPE      │ Layout, Theme, 3D Scene
WEEK 6.5-11  │ SYSTEMS       │ Sections A-F, Autonomous
WEEK 11-14   │ FINISHES      │ Performance, Testing, Deploy
```

---

## Facility Section Sequence

```
Priority Order (Based on Dependencies + Business Value):

1. Section A: Reception      (Week 6.5-7.5)  - Score: 9.55/10
2. Section B: Tennis Courts  (Week 7.5-10)   - Score: 9.05/10  ← Critical Path
3. Section F: Parking        (Week 10.5-11)  - Score: 7.80/10
4. Section E: Control Room   (Week 9.5-10.5) - Score: 6.60/10
5. Section C: Health Spaces  (Week 8.5-9.5)  - Score: 6.00/10
6. Section D: Vertical Farm  (Week 9.5-10.5) - Score: 6.40/10
```

---

## Critical Path

```
Foundation (Week 1-1.5)
    ↓ MUST COMPLETE
Structure (Week 2.5-4.5)
    ↓ MUST COMPLETE
Envelope (Week 4.5-6.5)
    ↓ MUST COMPLETE
Courts/Section B (Week 7.5-10)  ← LONGEST PHASE
    ↓ MUST COMPLETE
Finishes (Week 11-14)
```

**Total Critical Path**: ~10.5 weeks (of 14 weeks total)

---

## Phase Deliverables Checklist

### Phase 1: FOUNDATION (1.5 weeks)
- [ ] TypeScript strict mode 100%
- [ ] Configuration externalized
- [ ] Data models with Zod validation
- [ ] Zero magic numbers

### Phase 2: STRUCTURE (2 weeks)
- [ ] Component hierarchy (core/facility/courts/systems/shared)
- [ ] Routes for all sections (A-F)
- [ ] State management (Zustand/Redux)
- [ ] ThreeScene.tsx modularized (1,545 lines → components)

### Phase 3: ENVELOPE (2 weeks)
- [ ] Responsive layout (mobile/tablet/desktop)
- [ ] Design system + theme
- [ ] 3D scene manager with LOD
- [ ] 60 FPS rendering

### Phase 4: SYSTEMS (4.5 weeks)
- [ ] Section A: Reception functional
- [ ] Section B: 24 courts + player tracking + occupancy
- [ ] Section C: Health spaces (BiometricLab, CognitiveLab, RecoverySuite)
- [ ] Section D: Vertical farm visualization
- [ ] Section E: Control room + real-time sync
- [ ] Section F: Parking + EV infrastructure
- [ ] Autonomous systems (Lighting, Weather, Real-time)

### Phase 5: FINISHES (2.5 weeks)
- [ ] Lighthouse score >90
- [ ] Test coverage >80% (from 15%)
- [ ] Documentation complete
- [ ] Production deployed

---

## Critical Gaps to Address (P0)

```
1. Real-Time Sync        │ Phase 4.6 │ Week 9.5-11  │ 15-20 days
2. Player Tracking       │ Phase 4.1 │ Week 7.5-10  │ 10-15 days
3. Testing Infrastructure│ All Phases│ Ongoing      │ 20% of time
```

---

## Risk Heat Map

```
🔴 HIGH RISK:
   - Testing coverage expansion (15% → 80%)
   - Real-time sync integration (large effort)

🟡 MEDIUM RISK:
   - Courts rendering performance (24 courts)
   - ThreeScene.tsx modularization (1,545 lines)

🟢 LOW RISK:
   - Individual sections (A, C, D, F)
   - Documentation work
   - Type system completion (67% already done)
```

---

## Timeline Confidence

```
Phase 1: 🟢 HIGH    (67% already typed, clear path)
Phase 2: 🟢 HIGH    (routing exists, needs reorganization)
Phase 3: 🟢 HIGH    (standard UI work, clear deliverables)
Phase 4: 🟡 MEDIUM  (courts complex, real-time sync new work)
Phase 5: 🟢 HIGH    (standard finish work)

OVERALL: 🟢 HIGH - 14 weeks achievable
```

---

## Resource Allocation

```
WEEKS 1-6 (Phases 1-3):   1-2 developers (sequential work)
WEEKS 7-11 (Phase 4):     3-4 developers (parallel sections)
WEEKS 11-14 (Phase 5):    2-3 developers (testing, optimization)
```

---

## Key Success Factors

1. ✅ **Foundation before structure** - Don't skip Phase 1
2. ✅ **Modularize ThreeScene.tsx early** - Week 2.5-4.5, not later
3. ✅ **Test as you go** - 20% of time each phase, not just Phase 5
4. ✅ **Real-time sync early planning** - Architecture in Phase 2
5. ✅ **Parallel Phase 4 work** - 3-4 devs on different sections

---

## Quick Start (Week 1)

```bash
# 1. Start Phase 1 - Foundation Work
cd repos/ace
git checkout -b phase-1-foundation

# 2. Type System Setup
mkdir -p src/types
touch src/types/{facility,components,digitalTwin,autonomous,sensors}.ts
touch src/types/index.ts

# 3. Configuration Extraction
mkdir -p src/config
touch src/config/{facility,environment}.ts

# 4. Enable TypeScript Strict Mode
# Edit tsconfig.json: "strict": true

# 5. Begin Data Models
mkdir -p src/models
touch src/models/{court,section,sensor,member}.ts

# Start implementation following construction-phases.md
```

---

## Files to Reference

```
Primary Plan:     .claude/planning/construction-phases.md
Visual Guide:     .claude/diagrams/construction-sequence.md
Integration:      .claude/planning/construction-inventory-integration.md
Validation:       .claude/planning/VALIDATION_CHECKLIST.md
Complete Summary: .claude/planning/ARCHITECT_WORK_COMPLETE.md
```

---

## Emergency Contacts (Agent Coordination)

```
Construction Issues:   architect-coordinator (this agent)
Priority Questions:    priority-strategist
Gap Analysis:          gap-analyzer
Documentation Issues:  spec-reconciler
Component Questions:   component-inventory
Feature Mapping:       feature-mapper
```

---

**Status**: ✅ Plan validated and ready for execution
**Approval Required**: Swarm coordinator sign-off
**Next Action**: Start Phase 1 (Week 1)
