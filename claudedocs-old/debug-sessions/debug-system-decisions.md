# 3D Debug System - Architecture Decision Record

**Date**: 2025-11-22
**Status**: Accepted
**Deciders**: System Architect Agent

---

## Context and Problem Statement

The ACE Tennis Facility 3D scene contains 60-80+ individual assets (courts, facilities, vegetation, lighting, effects) that contribute to overall performance. Without granular control, developers cannot isolate which specific assets cause performance bottlenecks, making optimization guesswork rather than data-driven.

**Key Challenge**: How do we enable systematic performance debugging without disrupting the existing, stable 3D rendering codebase?

---

## Decision Drivers

1. **Non-Disruptive**: Must not require modifications to existing 3D components
2. **Zero Production Cost**: Debug system must have zero overhead in production builds
3. **Developer Experience**: Must be intuitive and fast to use
4. **Comprehensive Coverage**: Must track all significant performance contributors
5. **Actionable Data**: Must provide clear, quantifiable performance metrics

---

## Considered Options

### Option 1: Manual Asset Commenting (Rejected)

**Approach**: Developers manually comment out assets in ThreeScene.tsx to test performance.

**Pros**:
- Simple, no new code required
- Immediate implementation

**Cons**:
- Time-consuming (manual edits for each test)
- Error-prone (easy to forget uncommented code)
- No performance metrics collection
- No state persistence
- Risk of accidentally committing commented code

**Decision**: ❌ Rejected - Too manual, no automation

---

### Option 2: Webpack/Vite Build Flags (Rejected)

**Approach**: Use build-time flags to conditionally include assets, rebuild for each test.

**Pros**:
- Tree-shakeable in production
- Clear separation of debug/production code

**Cons**:
- Requires rebuild for every toggle (slow iteration)
- No runtime flexibility
- Cannot test multiple configurations quickly
- Complex build configuration

**Decision**: ❌ Rejected - Too slow for rapid iteration

---

### Option 3: Query Parameter Toggles (Rejected)

**Approach**: Use URL query parameters like `?assets=courts,lighting` to control rendering.

**Pros**:
- No UI needed
- Shareable URLs for specific configurations
- Simple implementation

**Cons**:
- Poor developer experience (manually editing URLs)
- No visual feedback on what's enabled
- No performance metrics collection
- Difficult to manage 60+ assets via URL

**Decision**: ❌ Rejected - Poor UX for complex scenarios

---

### Option 4: Debug Panel with Conditional Rendering (Accepted) ✅

**Approach**: React Context + Wrapper Pattern + Debug UI Panel

**Architecture**:
```
DebugContext (state) → ConditionalAsset (wrapper) → Asset (unchanged)
     ↓
DebugPanel (UI) + PerformanceTracker (metrics)
```

**Pros**:
- Non-disruptive wrapper pattern (no component modifications)
- Real-time toggling without rebuilds
- Comprehensive performance tracking
- Intuitive UI with presets
- State persistence (localStorage)
- Tree-shakeable in production
- Extensible for future features

**Cons**:
- Requires initial setup (4 weeks)
- Minimal performance overhead when enabled (<10%)
- Adds ~50KB to development bundle (tree-shaken in production)

**Decision**: ✅ Accepted - Best balance of functionality and developer experience

---

## Detailed Design Decisions

### Decision 1: Wrapper Pattern vs Component Modification

**Chosen**: Wrapper Pattern

**Rationale**:
- **Safety**: Existing components remain unchanged and tested
- **Reversibility**: Easy to remove wrappers if issues arise
- **Isolation**: Debug logic separated from rendering logic
- **Compatibility**: Works with any component type

**Alternative Considered**: Modify each component to check debug state internally
- ❌ Rejected: Pollutes component logic, harder to maintain, couples debug to components

**Implementation**:
```tsx
<ConditionalAsset assetId="court-grass-1">
  <TennisCourt position={[0, 0, 0]} type="grass" />
</ConditionalAsset>
```

---

### Decision 2: React Context vs Redux/Zustand

**Chosen**: React Context API

**Rationale**:
- **Built-in**: No additional dependencies
- **Sufficient Complexity**: Debug state is simple, not deeply nested
- **Performance**: State updates are infrequent (user-driven toggles)
- **Familiarity**: Team already uses Context in codebase

**Alternative Considered**: Redux Toolkit or Zustand
- ❌ Rejected: Overkill for debug-only state, adds dependency

---

### Decision 3: Asset Registry Implementation

**Chosen**: Static registry with Map-based lookups

**Rationale**:
- **Performance**: O(1) lookups for asset state
- **Type Safety**: Full TypeScript typing for asset definitions
- **Extensibility**: Easy to add metadata (tags, categories, estimates)
- **Immutability**: Asset definitions are immutable, only state changes

**Schema**:
```typescript
interface AssetDefinition {
  id: string;
  name: string;
  category: AssetCategory;
  estimatedCost: PerformanceCost;
  dependencies: string[];
  tags: string[];
}
```

**Alternative Considered**: Dynamic discovery via React children traversal
- ❌ Rejected: Complex, fragile, loses type safety, no metadata

---

### Decision 4: Performance Metrics Collection

**Chosen**: Hybrid approach with multiple measurement techniques

**Techniques**:
1. **FPS**: `requestAnimationFrame` timing
2. **Memory**: `performance.memory` API (Chrome/Edge only, graceful degradation)
3. **Render Time**: `performance.mark/measure` around Three.js render
4. **Renderer Info**: `THREE.WebGLRenderer.info` for triangles and draw calls

**Rationale**:
- **Comprehensive**: Covers CPU, GPU, and memory aspects
- **Standard APIs**: Uses browser-native performance APIs
- **Lightweight**: Minimal overhead from measurement itself

**Alternative Considered**: Chrome DevTools Protocol integration
- ❌ Rejected: Complex setup, requires browser extension, not portable

---

### Decision 5: UI Framework for Debug Panel

**Chosen**: Tailwind CSS with Lucide React icons

**Rationale**:
- **Consistency**: Matches existing project styling
- **Speed**: Rapid prototyping with utility classes
- **Responsive**: Built-in responsive design utilities
- **Bundle Size**: Tree-shakeable, only used CSS included

**Alternative Considered**: Material-UI or custom CSS
- ❌ Rejected: MUI adds significant bundle size, custom CSS slower to develop

---

### Decision 6: Preset System

**Chosen**: Built-in presets + custom preset save/load

**Built-in Presets**:
- All Off (baseline)
- All On (full scene)
- Baseline (env only)
- Courts Only
- No Vegetation
- No Effects

**Rationale**:
- **Common Workflows**: Covers 80% of debugging scenarios
- **Quick Access**: One-click configuration
- **Consistency**: Repeatable test configurations
- **Extensibility**: Users can save custom presets

**Alternative Considered**: Preset marketplace (share presets online)
- 💡 Deferred: Future enhancement, not MVP

---

### Decision 7: Performance Baseline Methodology

**Chosen**: Progressive measurement workflow

**Workflow**:
1. Measure empty scene (no assets)
2. Measure environment baseline (lighting + sky only)
3. Enable each asset individually, measure delta
4. Measure category combinations
5. Measure full scene

**Rationale**:
- **Systematic**: Covers all assets and combinations
- **Comparative**: Clear before/after metrics
- **Isolates Impact**: Attributes performance cost to specific assets
- **Reproducible**: Standardized process for consistency

**Alternative Considered**: Only measure full scene variations
- ❌ Rejected: Cannot isolate individual asset impact

---

### Decision 8: localStorage vs IndexedDB

**Chosen**: localStorage for debug state persistence

**Rationale**:
- **Simplicity**: Synchronous API, easy to use
- **Sufficient Size**: Debug state <1MB, well within 5-10MB limit
- **Compatibility**: Universal browser support
- **No Setup**: Built-in, no schema management

**Alternative Considered**: IndexedDB for larger capacity
- ❌ Rejected: Async API complexity not justified for small data

---

### Decision 9: Development vs Production Builds

**Chosen**: Feature flag + tree-shaking for production

**Implementation**:
```typescript
if (process.env.NODE_ENV === 'development') {
  // Include debug system
} else {
  // Tree-shaken in production
}
```

**Rationale**:
- **Zero Production Cost**: Debug code completely removed
- **Simple Logic**: Single environment check
- **Build Tool Support**: Vite/Webpack handle tree-shaking automatically

**Alternative Considered**: Always include but disable by default
- ❌ Rejected: Adds unnecessary bytes to production bundle

---

### Decision 10: Migration Strategy

**Chosen**: Incremental, phased rollout over 4 weeks

**Phases**:
1. **Week 1**: Infrastructure + 3 test assets
2. **Week 2**: Full asset coverage
3. **Week 3**: Performance tracking
4. **Week 4**: Polish + QA

**Rationale**:
- **Risk Reduction**: Test infrastructure before full rollout
- **Iterative Feedback**: Catch issues early
- **Parallelizable**: Different assets can be wrapped independently
- **Reversible**: Easy to rollback at each phase

**Alternative Considered**: Big-bang implementation (wrap all assets at once)
- ❌ Rejected: High risk, difficult to debug issues

---

## Consequences

### Positive

✅ **Data-Driven Optimization**: Clear metrics replace guesswork
✅ **Fast Iteration**: Toggle assets instantly without code edits or rebuilds
✅ **Maintainable**: Clear separation of concerns, debug isolated from rendering
✅ **Extensible**: Foundation for future performance tooling (LOD, streaming, budgets)
✅ **Shareable**: Export performance reports for team collaboration
✅ **Zero Production Cost**: Debug system completely removed in production builds

### Negative

⚠️ **Development Overhead**: Initial 4-week implementation time
⚠️ **Learning Curve**: New team members must learn debug system (mitigated by documentation)
⚠️ **Maintenance Burden**: Debug system must be updated when new assets added (automated via registry)
⚠️ **Bundle Size in Dev**: +50KB in development builds (acceptable for debugging)

### Neutral

🔄 **Performance Overhead in Dev**: <10% FPS impact when actively measuring (acceptable trade-off)
🔄 **Browser Compatibility**: Memory API Chrome-only, gracefully degrades in Firefox/Safari

---

## Validation

### Success Criteria

**MVP (Week 4)**:
- [ ] All 60-80 assets toggleable
- [ ] Real-time FPS, memory, render time tracking
- [ ] 6+ built-in presets working
- [ ] Baseline performance measurement workflow functional
- [ ] Export performance report feature working

**Adoption (Month 2)**:
- [ ] 100% of team uses debug panel for performance work
- [ ] Performance issues identified and documented
- [ ] Optimization roadmap based on debug data

**Impact (Month 3)**:
- [ ] 20%+ improvement in worst-case FPS
- [ ] Performance regression testing integrated into workflow
- [ ] User-reported performance issues reduced

---

## Related Decisions

- **Asset Categories**: 8 categories chosen based on rendering pipeline and update frequency
- **Performance Thresholds**: FPS (60/45/30), Memory (100/250/500 MB), Render Time (8/16/33 ms)
- **Keyboard Shortcut**: Ctrl+Shift+D chosen for muscle memory (Chrome DevTools uses F12)
- **Tab Order**: Assets → Performance → Presets based on typical workflow

---

## References

- [Full Architecture Document](/home/kvn/workspace/evolve/repos/ace/docs/architecture/debug-system-architecture.md)
- [Quick Reference Guide](/home/kvn/workspace/evolve/repos/ace/docs/architecture/debug-system-quick-reference.md)
- [Executive Summary](/home/kvn/workspace/evolve/repos/ace/docs/architecture/debug-system-summary.md)

---

**Last Updated**: 2025-11-22
**Next Review**: End of Week 1 (after infrastructure implementation)
