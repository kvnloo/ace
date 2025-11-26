# 3D Debug System - Quick Reference

## Overview

Quick reference guide for the 3D Performance Debug System architecture.

---

## 📊 System Architecture at a Glance

```
┌─────────────────────────────────────────────────────────────┐
│                     USER INTERFACE                          │
│                                                             │
│  [Ctrl+Shift+D] → Debug Panel → [Assets|Performance|Presets]│
│                                                             │
│  • Toggle individual assets                                 │
│  • View real-time FPS, memory, render time                 │
│  • Apply presets (All Off, Baseline, Courts Only)          │
│  • Export performance reports                               │
└─────────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────────┐
│                  DEBUG CONTEXT (State)                      │
│                                                             │
│  assetRegistry ─→ All asset definitions                     │
│  assetStates ───→ Map<AssetId, enabled/disabled>           │
│  performanceSnapshots ─→ FPS, memory, render time history  │
│  activePreset ──→ Current preset applied                    │
└─────────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────────┐
│                  3D SCENE (Rendering)                       │
│                                                             │
│  <ConditionalAsset assetId="court-grass-1">                 │
│    <TennisCourt ... />                                      │
│  </ConditionalAsset>                                        │
│                                                             │
│  Each asset checks debug context before rendering          │
└─────────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────────┐
│             PERFORMANCE TRACKER (Metrics)                   │
│                                                             │
│  Every frame: Measure FPS, memory, render time             │
│  Every second: Create snapshot with enabled assets         │
│  Store in context for UI display                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Core Components

### 1. Asset Registry

**Purpose**: Database of all 3D assets
**Location**: `src/utils/debug/assetRegistry.ts`

```typescript
{
  id: 'court-grass-1',
  name: 'Grass Court #1',
  category: 'court',
  estimatedCost: { triangles: 15000, drawCalls: 12, memoryMB: 8 },
  dependencies: ['net-grass-1', 'vegetation-grass-1']
}
```

**Categories**:
- `court` - Tennis courts (24 total: hard, clay, grass, wood)
- `facility` - Buildings (reception, lockers, mechanical, BMS, hydroponics)
- `vegetation` - Grass effects, plants
- `lighting` - Ambient, directional, spot lights
- `effects` - Clay texture, particle effects, weather
- `environment` - Sky, ground plane, shadows
- `infrastructure` - Transport pods, robotic systems

### 2. Debug Context

**Purpose**: Global state management
**Location**: `src/contexts/DebugContext.tsx`

```typescript
const debug = useDebugContext();

// Control assets
debug.toggleAsset('court-grass-1');
debug.toggleCategory('vegetation');
debug.applyPreset('all-off');

// Check state
const enabled = debug.isAssetEnabled('court-grass-1');

// Performance
debug.recordSnapshot(snapshot);
const baseline = debug.getBaselineSnapshot();
const impact = debug.getAssetImpact('court-grass-1');
```

### 3. Conditional Asset Wrapper

**Purpose**: Conditionally render based on debug state
**Location**: `src/components/debug/ConditionalAsset.tsx`

```tsx
<ConditionalAsset assetId="court-grass-1">
  <TennisCourt position={[0, 0, 0]} type="grass" />
</ConditionalAsset>
```

### 4. Debug Panel

**Purpose**: User interface for control
**Location**: `src/components/debug/DebugPanel.tsx`

**Tabs**:
- **Assets**: Toggle individual assets, search, category controls
- **Performance**: FPS graphs, memory usage, render time, asset impact table
- **Presets**: Quick configurations (All Off, All On, Baseline, etc.)

**Keyboard Shortcut**: `Ctrl+Shift+D`

### 5. Performance Tracker

**Purpose**: Automated metrics collection
**Location**: `src/utils/debug/performanceTracker.ts`

**Metrics Collected**:
- FPS (frames per second)
- Memory usage (MB)
- Render time (ms per frame)
- Triangle count
- Draw calls

---

## 🔧 Usage Workflows

### Workflow 1: Find Performance Bottleneck

```
1. Open Debug Panel (Ctrl+Shift+D)
2. Click "All Off" preset
3. Wait 5 seconds → Record baseline FPS
4. Enable one asset at a time
5. Check Performance tab → See FPS impact
6. Identify biggest FPS drops
7. Export report for documentation
```

### Workflow 2: Test Grass Performance

```
1. Apply "All Off" preset
2. Enable only "vegetation" category
3. Performance tab → See grass impact
4. Compare with "No Vegetation" preset
5. Determine if grass is the bottleneck
```

### Workflow 3: Optimize Clay Courts

```
1. Apply "Courts Only" preset
2. Disable all courts
3. Enable one clay court at a time
4. Check Performance → FPS per court
5. Identify if clay effect is expensive
6. Consider optimization strategies
```

### Workflow 4: Category Comparison

```
1. Baseline: All Off → Record FPS
2. Enable "court" → Record FPS drop
3. Enable "facility" → Record FPS drop
4. Enable "lighting" → Record FPS drop
5. Compare impact of each category
6. Prioritize optimization by impact
```

---

## 📋 Built-in Presets

| Preset | Description | Use Case |
|--------|-------------|----------|
| **All Off** | Disable everything | Baseline measurement |
| **All On** | Enable everything | Full scene test |
| **Baseline (Env Only)** | Only lighting + environment | Minimal scene baseline |
| **Courts Only** | Courts + environment | Isolate court performance |
| **No Vegetation** | Everything except grass | Test grass impact |
| **No Effects** | Disable particle effects | Test effect overhead |

---

## 📊 Performance Metrics Explained

### FPS (Frames Per Second)
- **60 FPS**: Excellent (smooth)
- **45 FPS**: Good
- **30 FPS**: Acceptable (minimum target)
- **<20 FPS**: Poor (noticeable lag)

### Memory Usage
- **<100 MB**: Excellent
- **100-250 MB**: Good
- **250-500 MB**: Acceptable
- **>500 MB**: High (potential issues on lower-end devices)

### Render Time
- **<16 ms**: Excellent (60 FPS capable)
- **16-33 ms**: Acceptable (30 FPS capable)
- **>33 ms**: Problematic

### Asset Impact Calculation

```
Impact = Performance(Baseline) - Performance(Baseline + Asset)

Example:
Baseline FPS: 60
With Grass Court #1 FPS: 45
Grass Court #1 Impact: -15 FPS
```

---

## 🗂️ File Structure

```
src/
├── contexts/
│   └── DebugContext.tsx              ← Main state provider
│
├── components/
│   └── debug/
│       ├── DebugPanel.tsx            ← UI panel (Ctrl+Shift+D)
│       ├── ConditionalAsset.tsx      ← Wrapper component
│       ├── AssetControls.tsx         ← Asset toggle UI
│       ├── PerformanceMetrics.tsx    ← Metrics display
│       ├── PresetControls.tsx        ← Preset buttons
│       └── SceneMetrics.tsx          ← Three.js metrics collector
│
├── utils/
│   └── debug/
│       ├── assetRegistry.ts          ← Asset database
│       ├── assetDefinitions.ts       ← Pre-populated assets
│       ├── performanceTracker.ts     ← Metrics system
│       └── presets.ts                ← Preset definitions
│
└── types/
    └── debug.ts                      ← TypeScript types
```

---

## 🚀 Migration Checklist

### Phase 1: Setup (Week 1)
- [ ] Create directory structure
- [ ] Implement `AssetRegistry`
- [ ] Create `DebugContext` (basic)
- [ ] Build `DebugPanel` UI
- [ ] Create `ConditionalAsset` wrapper
- [ ] Test with 3 assets

### Phase 2: Asset Coverage (Week 2)
- [ ] Wrap all 24 tennis courts
- [ ] Wrap all facilities (8 buildings)
- [ ] Wrap vegetation (grass effects)
- [ ] Wrap lighting (ambient, directional, spots)
- [ ] Wrap environment (sky, ground, shadows)
- [ ] Test all toggles work

### Phase 3: Performance Tracking (Week 3)
- [ ] Implement `PerformanceTracker`
- [ ] Add `SceneMetrics` to Canvas
- [ ] Create performance UI
- [ ] Implement baseline workflow
- [ ] Add per-asset impact measurement
- [ ] Create comparison tables

### Phase 4: Polish (Week 4)
- [ ] Add FPS graphs
- [ ] Implement export functionality
- [ ] Add tooltips and help
- [ ] Performance test debug system
- [ ] Write documentation
- [ ] Final QA

---

## ⚠️ Important Notes

### Performance Impact of Debug System

- **Disabled**: <1% FPS impact (production)
- **Enabled (idle)**: <5% FPS impact
- **Active measurement**: <10% FPS impact

### Safety Measures

- Debug system disabled by default in production
- Feature flag: `process.env.NODE_ENV === 'development'`
- No modifications to core rendering logic
- All debug code tree-shakeable

### localStorage Persistence

Debug system saves:
- Asset toggle states
- Custom presets
- Debug panel visibility
- Selected tab

---

## 🐛 Troubleshooting

### Issue: Assets don't toggle

**Check**:
1. Is debug mode enabled? (`debug.debugEnabled`)
2. Is asset ID correct in registry?
3. Is `ConditionalAsset` wrapper present?
4. Check browser console for errors

### Issue: Performance metrics not updating

**Check**:
1. Is `SceneMetrics` component in Canvas?
2. Is performance tracker started?
3. Check browser supports `performance.memory`
4. Verify `window.__THREE_DEBUG_INFO__` exists

### Issue: FPS always shows 0

**Check**:
1. Tracker tick function running?
2. Check `requestAnimationFrame` callback
3. Verify snapshot recording
4. Check performance marks/measures

---

## 📚 Related Documents

- [Full Architecture Document](./debug-system-architecture.md)
- [Asset Registry Schema](./debug-system-architecture.md#asset-registry-system)
- [Performance Baseline Methodology](./debug-system-architecture.md#performance-baseline-methodology)
- [Migration Plan](./debug-system-architecture.md#migration-plan)

---

**Last Updated**: 2025-11-22
**Version**: 1.0.0
