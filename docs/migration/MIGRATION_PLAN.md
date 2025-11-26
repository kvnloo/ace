# Agile Migration Plan: enhance/3D → ace-3Dmerge

**Created**: 2025-11-25
**Methodology**: Test-Driven Development (TDD) with Incremental Migration

---

## Strategic Overview

### Why Incremental Migration?

The original `enhance/3D` branch broke due to:
1. Too many features merged at once
2. Unverified dependencies between components
3. Missing integration testing between features
4. Performance degradation from cumulative changes

### Migration Philosophy

```
📋 PRINCIPLE: "One Feature, One Test, One Commit"

For each component:
1. TEST  → Verify behavior in source branch
2. COPY  → Migrate to target branch
3. FIX   → Resolve import/dependency issues
4. VERIFY → TypeScript, tests, dev server
5. COMMIT → Only after all checks pass
```

---

## Sprint Structure

### Sprint Duration: 3-5 days each
### Validation Gate: Each sprint must pass before next begins

---

## Sprint 1: FPS Monitor Enhancement (Current)

**Goal**: Complete seamless FPS monitor transition animation

**User Story**:
> As a user viewing the 3D court, I want the FPS monitor to seamlessly transition from the loading screen to a persistent overlay, so I can continuously monitor performance.

### Tasks

| Task | Description | Status | Assignee |
|------|-------------|--------|----------|
| 1.1 | Research SOTA animation practices | ✅ Done | - |
| 1.2 | Extract FPS monitor from LoadingScreen | ✅ Done | - |
| 1.3 | Create FPSMonitorContext for global state | ✅ Done | - |
| 1.4 | Create GlobalFPSMonitor component | ✅ Done | - |
| 1.5 | Implement FLIP transition animation | ⏳ Pending | - |
| 1.6 | Integration testing | ⏳ Pending | - |

### Acceptance Criteria
- [ ] FPS monitor renders in loading screen
- [ ] On loading complete, FPS monitor animates to corner
- [ ] FPS data continues updating after transition
- [ ] Animation is smooth (no jarring jumps)
- [ ] TypeScript compiles without errors
- [ ] Dev server runs without console errors

### Definition of Done
- Code committed with descriptive message
- Documentation updated
- No regressions in existing functionality

---

## Sprint 2: Core Safety Infrastructure

**Goal**: Add error handling and performance optimization foundation

**User Stories**:
> As a developer, I want error boundaries to catch rendering errors gracefully.
> As a user, I want the app to degrade gracefully when 3D features fail.

### Tasks

| Task | Priority | Complexity | Dependencies |
|------|----------|------------|--------------|
| 2.1 Copy ErrorBoundary.tsx | P0 | Low | None |
| 2.2 Copy FallbackUI.tsx | P0 | Low | None |
| 2.3 Wrap ThreeScene in ErrorBoundary | P0 | Low | 2.1, 2.2 |
| 2.4 Copy ThreeSceneOptimized.tsx | P1 | High | LoadingProvider |
| 2.5 Integrate performance optimizations | P1 | Medium | 2.4 |
| 2.6 Write integration tests | P1 | Medium | 2.1-2.5 |

### Acceptance Criteria
- [ ] ErrorBoundary catches 3D rendering errors
- [ ] FallbackUI displays meaningful error message
- [ ] ThreeSceneOptimized reduces resource usage
- [ ] Performance mode switching works
- [ ] Tests cover error scenarios

### Test Cases
```typescript
// Sprint 2 Test Cases
describe('ErrorBoundary', () => {
  it('catches rendering errors and displays FallbackUI');
  it('allows error recovery when possible');
  it('logs errors for debugging');
});

describe('ThreeSceneOptimized', () => {
  it('switches between performance modes');
  it('maintains 60 FPS in high mode');
  it('reduces quality in low mode');
});
```

---

## Sprint 3: Visual Enhancements

**Goal**: Add grass rendering and lighting system

**User Stories**:
> As a user, I want to see realistic grass on tennis courts.
> As a user, I want day/night lighting to enhance immersion.

### Tasks

| Task | Priority | Complexity | Dependencies |
|------|----------|------------|--------------|
| 3.1 Copy GrassOptimized.tsx | P0 | High | None |
| 3.2 Copy Grass.tsx | P1 | Medium | None |
| 3.3 Integrate grass into TennisCourt | P0 | Medium | 3.1 |
| 3.4 Copy LightingSystem.tsx | P0 | Very High | postprocessing |
| 3.5 Add @react-three/postprocessing | P0 | Low | None |
| 3.6 Integrate lighting into ThreeScene | P1 | High | 3.4 |
| 3.7 Performance testing with grass+lighting | P0 | Medium | 3.1-3.6 |

### Acceptance Criteria
- [ ] Grass renders on grass-type courts
- [ ] Grass animates with wind effect
- [ ] Day/night cycle functions
- [ ] Stadium lights work correctly
- [ ] Performance stays above 30 FPS on medium hardware

### Performance Budget
- Grass: < 5ms per frame
- Lighting: < 3ms per frame
- Combined: < 10ms (maintaining 60+ FPS)

---

## Sprint 4: Interactive Features

**Goal**: Add court navigation and analytics overlays

**User Stories**:
> As a user, I want to navigate between courts easily.
> As a user, I want to see performance heatmaps on courts.

### Tasks

| Task | Priority | Complexity | Dependencies |
|------|----------|------------|--------------|
| 4.1 Copy CourtNavigationUI.tsx | P1 | Medium | None |
| 4.2 Copy HeatMapOverlay.tsx | P1 | Medium | None |
| 4.3 Copy TennisCourtWithHeatMap.tsx | P1 | Medium | 4.2 |
| 4.4 Copy HeatMapDemo.tsx | P2 | Low | 4.2, 4.3 |
| 4.5 Integrate navigation with ThreeScene | P1 | Medium | 4.1 |
| 4.6 Add keyboard shortcuts for navigation | P2 | Low | 4.5 |

### Acceptance Criteria
- [ ] Court selection UI is visible and functional
- [ ] Camera transitions smoothly to selected court
- [ ] Heatmap overlay displays on courts
- [ ] Keyboard navigation works (arrow keys)

---

## Sprint 5: Character System

**Goal**: Populate facility with animated characters

**User Stories**:
> As a user, I want to see animated people in the facility for realism.

### Tasks

| Task | Priority | Complexity | Dependencies |
|------|----------|------------|--------------|
| 5.1 Copy CharacterSystem.tsx | P1 | Very High | None |
| 5.2 Implement basic character movement | P0 | High | 5.1 |
| 5.3 Add character types (players, staff) | P1 | Medium | 5.2 |
| 5.4 Implement LOD for characters | P1 | High | 5.1 |
| 5.5 Performance optimization | P0 | High | 5.1-5.4 |

### Acceptance Criteria
- [ ] Characters render in scene
- [ ] Characters move along paths
- [ ] Different character types are distinguishable
- [ ] Performance impact < 5ms per frame
- [ ] LOD reduces character detail at distance

### Risk Mitigation
- CharacterSystem is the most complex component
- Plan for 2x time estimate
- Have fallback to static character markers

---

## Sprint 6-8: Facility Spaces

**Goal**: Complete all facility space visualizations

### Sprint 6: Core Facility Spaces
- ReceptionArea.tsx
- LockerRoom.tsx (×2 - men's/women's)
- SupportSpaces.tsx

### Sprint 7: Technical Spaces
- MechanicalRooms.tsx
- BMSControlRoom.tsx
- ParkingLot.tsx

### Sprint 8: Specialty Areas
- HydroponicsSystem.tsx
- BiometricLab.tsx
- CognitiveLab.tsx
- MovementStudio.tsx
- RecoverySuite.tsx
- TransportPods.tsx

---

## Testing Strategy

### Test Pyramid

```
         /\
        /  \      E2E Tests (few, expensive)
       /----\
      /      \    Integration Tests (some)
     /--------\
    /          \  Unit Tests (many, cheap)
   --------------
```

### Test Types by Sprint

| Sprint | Unit Tests | Integration Tests | E2E Tests |
|--------|------------|-------------------|-----------|
| 1 | FPS calculation | Loading→Overlay transition | - |
| 2 | Error catching | Scene with ErrorBoundary | Error recovery |
| 3 | Grass rendering | Grass+Lighting combined | Visual check |
| 4 | Navigation logic | Court selection | Full navigation |
| 5 | Character state | Multiple characters | Scene population |
| 6-8 | Space rendering | Space integration | Full facility tour |

### Continuous Integration

```yaml
# .github/workflows/migration-tests.yml
name: Migration Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install dependencies
        run: npm ci
      - name: TypeScript check
        run: npm run typecheck
      - name: Unit tests
        run: npm test
      - name: Build check
        run: npm run build
```

---

## Risk Management

### High-Risk Components

| Component | Risk | Mitigation |
|-----------|------|------------|
| LightingSystem | Performance impact, postprocessing deps | Test on low-end hardware first |
| CharacterSystem | Complexity, AI pathfinding | Implement in phases |
| GrassOptimized | Shader complexity | Keep fallback to simple color |
| BMSControlRoom | State management | Thorough integration testing |

### Rollback Strategy

Each sprint creates a tagged checkpoint:
```bash
git tag -a sprint-1-complete -m "Sprint 1: FPS Monitor done"
git tag -a sprint-2-complete -m "Sprint 2: Safety infra done"
```

To rollback:
```bash
git checkout sprint-X-complete
```

---

## Definition of Done (DoD)

### Per Component
- [ ] TypeScript compiles without errors
- [ ] All unit tests pass
- [ ] Integration with existing components verified
- [ ] Performance benchmarked
- [ ] Code reviewed (if team)
- [ ] Documentation updated

### Per Sprint
- [ ] All component DoDs met
- [ ] Sprint demo successful
- [ ] No regression in existing functionality
- [ ] Performance budget maintained
- [ ] Tag created

### Overall Migration
- [ ] All sprints complete
- [ ] Full E2E test suite passes
- [ ] Performance targets met
- [ ] Documentation complete
- [ ] Stakeholder sign-off

---

## Communication & Tracking

### Daily Updates
- Update FEATURE_MIGRATION_STATUS.md after each component
- Commit messages reference sprint and task

### Sprint Reviews
- Demo migrated features
- Review performance metrics
- Plan next sprint adjustments

### Documentation Updates
- This plan: Adjust based on learnings
- Status doc: After each component
- CHANGELOG: After each sprint

---

## Appendix: Command Reference

### Development Commands
```bash
# Start development
npm run dev

# Type checking
npm run typecheck

# Run tests
npm test

# Build production
npm run build

# E2E tests
npm run test:e2e
```

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/sprint-X-component-name

# After successful migration
git add .
git commit -m "feat: Migrate ComponentName from enhance/3D

- Added ComponentName.tsx
- Fixed import paths
- Added unit tests
- Verified performance

Sprint: X
Task: X.X"

# Merge to main branch
git checkout claude/merge-3d-features-carefully-016UHu9qyUERZi7foXuCqokY
git merge feature/sprint-X-component-name

# Create sprint tag
git tag -a sprint-X-complete -m "Sprint X complete"
```

---

**Next Action**: Complete Sprint 1 Task 1.5 (FLIP transition animation)
