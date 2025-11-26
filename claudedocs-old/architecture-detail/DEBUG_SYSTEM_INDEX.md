# 3D Performance Debug System - Documentation Index

**Project**: ACE Tennis Facility
**Feature**: 3D Performance Debug System
**Status**: Architecture Complete, Ready for Implementation
**Date**: 2025-11-22

---

## 📚 Documentation Structure

This documentation suite provides complete architectural specifications, implementation guidance, and decision rationale for the 3D Performance Debug System.

---

## Core Documents

### 1. [Executive Summary](./debug-system-summary.md)
**Audience**: Project stakeholders, management, team leads
**Length**: 9 KB, ~10 minute read
**Purpose**: High-level overview of the system

**Key Sections**:
- Problem statement and solution overview
- Key features and benefits
- Technical architecture at a glance
- Implementation timeline (4 weeks)
- Risk assessment and mitigation
- Success metrics
- Next steps and approval

**Read this if**: You need to understand "what" and "why" without technical details.

---

### 2. [Architecture Document](./debug-system-architecture.md)
**Audience**: Software architects, lead developers, implementation team
**Length**: 58 KB, ~60 minute deep read
**Purpose**: Complete technical specification

**Key Sections**:
- System overview and goals
- Architecture diagrams (ASCII art)
- Component design (5 major components)
- Asset Registry System (schema, implementation)
- Debug Context Provider (state management)
- Debug UI Panel (React components)
- Performance Tracking (metrics collection)
- Integration strategy (how it fits existing code)
- Data flow diagrams
- File structure (detailed)
- Migration plan (4-phase, 20-day schedule)
- Performance baseline methodology
- Acceptance criteria

**Read this if**: You're implementing the system or need deep technical understanding.

---

### 3. [Quick Reference Guide](./debug-system-quick-reference.md)
**Audience**: Developers using the debug system
**Length**: 12 KB, ~15 minute read
**Purpose**: Developer usage guide and troubleshooting

**Key Sections**:
- Architecture at a glance (simplified)
- Core components and APIs
- Usage workflows (find bottlenecks, test categories, optimize)
- Built-in presets table
- Performance metrics explained
- File structure
- Migration checklist
- Troubleshooting common issues

**Read this if**: You're using the debug system to diagnose performance issues.

---

### 4. [Architecture Decision Record](./debug-system-decisions.md)
**Audience**: Architects, reviewers, future maintainers
**Length**: 10 KB, ~20 minute read
**Purpose**: Explains "why" key design decisions were made

**Key Sections**:
- Problem statement
- Considered options (4 alternatives)
- Detailed design decisions (10 major decisions)
- Rationale for each choice
- Alternatives considered and rejected
- Consequences (positive, negative, neutral)
- Success criteria
- Validation plan

**Read this if**: You need to understand the reasoning behind architectural choices.

---

## Visual Aids

### Architecture Diagrams

**High-Level System Flow**:
```
User Interface (DebugPanel)
     ↕
State Management (DebugContext)
     ↕
3D Rendering (ThreeScene + ConditionalAsset)
     ↕
Performance Monitoring (PerformanceTracker)
```

**Component Hierarchy**:
```
App
└── DebugProvider
    ├── DebugPanel
    │   ├── AssetControls
    │   ├── PerformanceMetrics
    │   └── PresetControls
    └── ThreeScene
        ├── Canvas
        │   └── SceneMetrics
        └── ConditionalAsset (wraps each 3D asset)
            └── [3D Component] (TennisCourt, Grass, etc.)
```

**Data Flow**:
```
User Toggle
    → Debug Context (state update)
    → Asset State Map
    → ConditionalAsset (checks state)
    → Render Decision (show/hide)
    → Performance Tracker (measure)
    → Performance Snapshot
    → UI Display
```

---

## Implementation Timeline

### Week 1: Infrastructure Setup
**Goal**: Basic toggle functionality working
- Create directory structure
- Implement AssetRegistry
- Build DebugContext (basic)
- Create DebugPanel UI shell
- Implement ConditionalAsset wrapper
- Test with 3 sample assets

**Deliverables**:
- `src/contexts/DebugContext.tsx`
- `src/components/debug/DebugPanel.tsx`
- `src/components/debug/ConditionalAsset.tsx`
- `src/utils/debug/assetRegistry.ts`
- `src/types/debug.ts`

---

### Week 2: Complete Asset Coverage
**Goal**: All 60-80 assets toggleable
- Systematically wrap all assets
- Complete asset registry
- Implement category toggles
- Add search functionality
- Create all presets
- Test all toggles

**Asset Inventory**:
- 24 Tennis Courts (6 hard, 6 clay, 6 grass, 6 wood)
- 24 Court Nets
- 6 Grass effects
- 6 Clay effects
- 48 Bleacher sections
- 2 Locker Rooms
- 1 Reception Area
- 1 Parking Lot
- 1 BMS Control Room
- 1 Mechanical Rooms
- 4 Hydroponics Systems
- 1 Robotic Grass System
- 1 Transport Pods
- ~10 Lighting sources
- ~5 Environment elements

**Total**: ~140 individual renderable elements → ~60-80 logical assets

---

### Week 3: Performance Tracking
**Goal**: Automated metrics collection
- Implement PerformanceTracker
- Create SceneMetrics component
- Integrate with DebugContext
- Build performance UI
- Implement baseline workflow
- Add per-asset impact measurement
- Create comparison tables

**Deliverables**:
- `src/utils/debug/performanceTracker.ts`
- `src/components/debug/SceneMetrics.tsx`
- `src/components/debug/PerformanceMetrics.tsx`
- `src/components/debug/FPSGraph.tsx`

---

### Week 4: Polish & QA
**Goal**: Production-ready debug system
- Add FPS graph visualization
- Implement export functionality
- Add tooltips and help text
- Performance test debug system
- Write user documentation
- Final QA testing
- Create demo video

**Deliverables**:
- `src/utils/debug/reportGenerator.ts`
- User guide document
- Performance test results
- QA sign-off

---

## Technical Stack

### Dependencies (Already in Project)
- React 19
- React Context API
- Three.js
- @react-three/fiber
- @react-three/drei
- Tailwind CSS
- TypeScript

### Browser APIs Used
- `requestAnimationFrame` (FPS tracking)
- `performance.mark/measure` (render time)
- `performance.memory` (memory usage, Chrome only)
- `localStorage` (state persistence)

### No Additional Dependencies Required ✅

---

## File Structure

```
src/
├── contexts/
│   └── DebugContext.tsx                  [Main state provider]
│
├── components/
│   └── debug/
│       ├── DebugPanel.tsx                [Main UI (Ctrl+Shift+D)]
│       ├── ConditionalAsset.tsx          [Wrapper component]
│       ├── AssetControls.tsx             [Asset toggle UI]
│       ├── AssetToggle.tsx               [Individual toggle]
│       ├── PerformanceMetrics.tsx        [Metrics display]
│       ├── PerformanceDelta.tsx          [Comparison UI]
│       ├── FPSGraph.tsx                  [FPS visualization]
│       ├── PresetControls.tsx            [Preset buttons]
│       └── SceneMetrics.tsx              [Three.js integration]
│
├── utils/
│   └── debug/
│       ├── assetRegistry.ts              [Asset database]
│       ├── assetDefinitions.ts           [Pre-populated assets]
│       ├── performanceTracker.ts         [Metrics collection]
│       ├── debugStorage.ts               [localStorage utils]
│       ├── presets.ts                    [Built-in presets]
│       └── reportGenerator.ts            [Export functionality]
│
├── types/
│   └── debug.ts                          [TypeScript types]
│
└── hooks/
    └── useDebugContext.ts                [Context hook]
```

**Estimated Lines of Code**: ~2,500 lines
**Estimated Bundle Size (Dev)**: +50 KB
**Estimated Bundle Size (Prod)**: 0 KB (tree-shaken)

---

## Key Design Patterns

1. **Wrapper Pattern**: Non-disruptive asset wrapping
2. **Context API**: Global debug state
3. **Observer Pattern**: Performance monitoring
4. **Registry Pattern**: Central asset database
5. **Preset Pattern**: Quick configurations
6. **Higher-Order Component**: ConditionalAsset wrapper

---

## Performance Characteristics

### Debug System Overhead

| Mode | FPS Impact | Use Case |
|------|------------|----------|
| Disabled (Production) | 0% | Tree-shaken, not in bundle |
| Enabled (Idle) | <5% | Panel open, not measuring |
| Active Measurement | <10% | During performance profiling |

### Memory Footprint

- Asset Registry: ~50 KB (in-memory)
- Debug Context State: ~20 KB
- Performance Snapshots (100 entries): ~100 KB
- UI Components (rendered): ~200 KB
- **Total**: ~370 KB in development mode

---

## Success Metrics

### Functional Requirements
- ✅ 100% asset coverage
- ✅ <1s toggle response time
- ✅ >95% performance metric accuracy
- ✅ Zero rendering errors

### Performance Requirements
- ✅ Identify top 10 expensive assets
- ✅ Baseline FPS established
- ✅ Per-asset impact calculated
- ✅ 30% reduction in FPS variance

### Developer Experience
- ✅ <5 min onboarding
- ✅ <30s to identify bottleneck
- ✅ 100% team adoption

---

## Common Workflows

### Workflow 1: Find Performance Culprit
```
1. Ctrl+Shift+D → Open debug panel
2. Click "All Off" preset
3. Note baseline FPS
4. Enable assets one-by-one
5. Check Performance tab after each
6. Identify largest FPS drops
7. Export report
```

### Workflow 2: Compare Asset Categories
```
1. Apply "Baseline" preset (env only)
2. Record baseline FPS
3. Enable "court" category → Record
4. Disable courts, enable "facility" → Record
5. Disable facility, enable "vegetation" → Record
6. Compare FPS impact of each category
```

### Workflow 3: Optimize Specific Asset
```
1. Apply "All Off"
2. Enable ONLY the target asset
3. Monitor FPS, memory, render time
4. Make code optimizations
5. Refresh, measure again
6. Compare before/after metrics
```

---

## Troubleshooting

### Issue: Assets don't toggle
**Solutions**:
- Check `debugEnabled` state
- Verify asset ID in registry
- Check `ConditionalAsset` wrapper present
- Console errors?

### Issue: Performance metrics show 0
**Solutions**:
- Is `SceneMetrics` in Canvas?
- Is tracker started?
- Browser supports `performance.memory`?
- Check `window.__THREE_DEBUG_INFO__`

### Issue: Panel doesn't open
**Solutions**:
- Try Ctrl+Shift+D keyboard shortcut
- Check debug mode enabled
- Console errors?
- Component mounted?

---

## Future Enhancements

### Post-MVP (Month 2-3)
- Asset dependency visualization
- Performance profiles (save/load)
- Regression detection
- GPU memory tracking
- Wireframe mode toggle

### Advanced Features (Month 4+)
- Remote debugging (share session)
- ML-based performance prediction
- Dynamic LOD based on FPS
- Automated performance budgets
- CI/CD integration

---

## Related Resources

### External Documentation
- [React Context API](https://react.dev/reference/react/createContext)
- [Three.js Performance](https://threejs.org/docs/#manual/en/introduction/Performance-tips)
- [Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance)
- [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)

### Internal Resources
- [ThreeScene.tsx](/home/kvn/workspace/evolve/repos/ace/src/components/ThreeScene.tsx)
- [Existing Architecture Docs](/home/kvn/workspace/evolve/repos/ace/docs/architecture/)

---

## Team Roles

### Implementation
- **System Architect**: Architecture design ✅ Complete
- **Frontend Developer**: Implementation (Week 1-4)
- **Performance Engineer**: Baseline establishment (Week 3)
- **QA Engineer**: Testing and validation (Week 4)

### Review & Approval
- **Tech Lead**: Architecture review
- **Project Manager**: Timeline approval
- **Team**: Code review during implementation

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0.0 | 2025-11-22 | Initial architecture complete | System Architect Agent |

---

## Contact & Questions

For questions about this architecture:
1. Review the [Architecture Document](./debug-system-architecture.md) for technical details
2. Check [Architecture Decisions](./debug-system-decisions.md) for design rationale
3. Consult [Quick Reference](./debug-system-quick-reference.md) for usage guidance
4. Contact the implementation team for clarifications

---

**Status**: ✅ Architecture Complete, Ready for Implementation
**Next Milestone**: Week 1 Infrastructure Setup Complete
**Target Release**: Week 4 (Full Feature Complete)
