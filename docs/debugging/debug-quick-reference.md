# Debug System Quick Reference

## Keyboard Shortcuts

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl+Shift+D` | Toggle Debug Panel | Open/close debug panel |
| `Ctrl+Shift+P` | Toggle Performance HUD | Show/hide FPS overlay |
| `Ctrl+Shift+M` | Toggle Memory Monitor | Show/hide memory usage |
| `Ctrl+Shift+B` | Set Baseline | Capture current performance baseline |
| `Ctrl+Shift+T` | Run Performance Test | Execute automated test suite |
| `Ctrl+Shift+R` | Reset to Defaults | Reset all assets to default state |
| `Ctrl+Shift+E` | Export Report | Download performance report |
| `Ctrl+Shift+1-4` | Load Preset 1-4 | Quick-load built-in presets |

## Console Commands

### Quick Access

```javascript
// Access debug utilities
window.debug

// Access asset registry
window.assetRegistry

// Access performance tracker
window.performanceTracker
```

### Common Commands

```javascript
// Get current stats
await window.debug.stats()

// Get budget status
await window.debug.budget()

// List enabled assets
await window.debug.enabled()

// List disabled assets
await window.debug.disabled()

// Export registry state
await window.debug.export()

// Validate dependencies
await window.debug.validateCircular()
```

## Asset Registry Cheat Sheet

### Enable/Disable Assets

```javascript
// Enable asset
assetRegistry.enable('grass-blades')

// Disable asset
assetRegistry.disable('grass-blades')

// Toggle asset
assetRegistry.toggle('grass-blades')

// Check if enabled
assetRegistry.isEnabled('grass-blades')
```

### Query Assets

```javascript
// Get all assets
assetRegistry.getAll()

// Get by type
assetRegistry.getByType('grass')

// Get enabled only
assetRegistry.getEnabled()

// Get disabled only
assetRegistry.getDisabled()

// Get specific asset
assetRegistry.get('grass-blades')
```

### Dependencies

```javascript
// Get dependencies
assetRegistry.getDependencies('growth-visualization')

// Get dependents
assetRegistry.getDependents('grass-blades')

// Get full dependency tree
assetRegistry.getDependencyTree('growth-visualization')

// Check for circular dependencies
assetRegistry.getCircularDependencies()
```

### Performance Budget

```javascript
// Get total cost
assetRegistry.getTotalCost()

// Get cost by type
assetRegistry.getCostByType()

// Get budget status
const budget = assetRegistry.getBudgetStatus(100)
console.log(`${budget.current}/${budget.max} (${budget.percentage}%)`)
console.log(`Status: ${budget.status}`) // 'ok', 'warning', 'critical'
```

## Performance Tracker Cheat Sheet

### Real-time Metrics

```javascript
// Get current FPS
tracker.trackFPS()

// Get average FPS (last 5 seconds)
tracker.getAverageFPS(5)

// Get memory usage
tracker.getMemoryUsage()

// Get all current metrics
tracker.getCurrentMetrics()
```

### Baseline & Comparison

```javascript
// Set baseline
tracker.setBaseline()

// Compare to baseline
const delta = tracker.compareToBaseline(tracker.getCurrentMetrics())
console.log(`FPS Delta: ${delta.fpsDelta}`)
console.log(`Impact Score: ${delta.impactScore}`)
```

### Asset Tracking

```javascript
// Start render timer
tracker.startRenderTimer('asset-id')

// End render timer
const duration = tracker.endRenderTimer('asset-id')

// Track memory delta
const memoryChange = tracker.trackMemoryDelta('asset-id')

// Update metrics
tracker.updateAssetMetrics('asset-id', 'Asset Name', true)
```

### Reports

```javascript
// Generate report
const report = tracker.generateReport()

// Export as JSON
const json = tracker.exportReport()

// Download report
tracker.downloadReport()
```

## Performance Testing Cheat Sheet

### Basic Testing

```javascript
import { PerformanceTestRunner } from '@/utils/debug/performanceComparison'

const runner = new PerformanceTestRunner({
  stabilizationTime: 3000,
  measurementFrames: 60,
  measurementPasses: 3
})

// Run baseline test
const baseline = await runner.runBaseline()

// Test individual assets
const results = await runner.runIndividualAssetTests()

// Run full test suite
const report = await runner.runFullTestSuite()
```

### Save/Load Results

```javascript
import {
  saveReportToStorage,
  loadReportFromStorage
} from '@/utils/debug/performanceComparison'

// Save report
saveReportToStorage(report, 'my-test-results')

// Load report
const savedReport = loadReportFromStorage('my-test-results')
```

## Preset Configurations

### Built-in Presets

| Preset | Description | Typical FPS | Memory | Use Case |
|--------|-------------|-------------|--------|----------|
| **Baseline** | Minimal scene | 60+ | ~25 MB | Performance baseline |
| **One-by-One** | Sequential testing | Varies | Varies | Asset isolation |
| **Production** | Full production | 45-60 | ~150 MB | User experience |
| **Performance Test** | Maximum load | 30-45 | ~250 MB | Stress testing |

### Preset Management

```javascript
import {
  savePreset,
  loadPreset,
  listPresets,
  deletePreset
} from '@/utils/debug/debugStorage'

// Save current config as preset
savePreset('My Config', {
  id: 'my-config',
  name: 'My Config',
  description: 'Custom configuration',
  settings: { /* ... */ }
})

// Load preset
const preset = loadPreset('My Config')

// List all presets
const allPresets = listPresets()

// Delete preset
deletePreset('My Config')
```

## Asset Performance Reference

### Performance Cost Scale

| Cost | Category | Examples | Typical Impact |
|------|----------|----------|----------------|
| 1-2 | Minimal | Court lines, ambient light | <1 FPS |
| 3-4 | Low | Court surfaces, simple meshes | 1-3 FPS |
| 5-6 | Medium | Grass, particles | 3-8 FPS |
| 7-8 | High | Shadows, physics | 8-15 FPS |
| 9-10 | Very High | Volumetric clouds, GI | 15-25 FPS |

### Asset Catalog

#### Courts (Cost: 3-4)
- `tennis-court-1` - Primary court
- `tennis-court-2` - Secondary court
- `tennis-court-3` - Tertiary court
- `tennis-court-4` - Quaternary court
- `court-lines` - Line markings
- `court-net` - Tennis nets
- `court-surface` - Surface materials

#### Grass System (Cost: 5-7)
- `grass-blades` - Grass geometry (6)
- `grass-physics` - Wind & physics (5)
- `robotic-mowers` - Autonomous mowers (7)
- `growth-visualization` - Growth mapping (4)

#### Lighting (Cost: 1-7)
- `ambient-light` - Global ambient (1)
- `directional-light` - Sun light (2)
- `spot-lights` - Court lighting (5)
- `dynamic-shadows` - Shadow system (7)
- `hdr-environment` - Environment map (4)

#### Weather (Cost: 3-8)
- `weather-particles` - Rain/snow (6)
- `clouds` - Volumetric clouds (8)
- `fog-system` - Atmospheric fog (3)
- `wind-effects` - Wind simulation (4)

#### Effects (Cost: 4-6)
- `particle-systems` - General particles (5)
- `post-processing` - Effect pipeline (6)
- `bloom-effects` - Bloom effect (4)
- `motion-blur` - Motion blur (5)

#### UI/HUD (Cost: 1-3)
- `performance-hud` - FPS display (1)
- `heat-map-overlay` - Tactical overlay (3)
- `player-markers` - Position markers (2)

#### Buildings (Cost: 5-6)
- `reception-area` - Reception facility (5)
- `cognitive-lab` - Training lab (6)
- `bms-control-room` - Control center (5)
- `transport-pods` - Pod system (7)

#### Characters (Cost: 8)
- `character-system` - Character animation (8)

#### Physics (Cost: 6)
- `physics-engine` - Physics simulation (6)

## Performance Targets

### FPS Targets

| Target | Status | User Experience |
|--------|--------|-----------------|
| 60+ FPS | Optimal ✅ | Butter smooth |
| 50-60 FPS | Good ⚡ | Smooth |
| 30-50 FPS | Acceptable ⚠️ | Playable |
| <30 FPS | Poor ❌ | Needs optimization |

### Memory Targets

| Usage | Status | Action |
|-------|--------|--------|
| <200 MB | Excellent ✅ | No action |
| 200-350 MB | Good ⚡ | Monitor |
| 350-500 MB | Warning ⚠️ | Consider optimization |
| >500 MB | Critical ❌ | Immediate action |

### Performance Budget

| Component | Budget | Notes |
|-----------|--------|-------|
| Courts | 15 points | Essential, always loaded |
| Grass | 20 points | High visual impact |
| Lighting | 15 points | Essential, optimize shadows |
| Weather | 15 points | Optional, disable for performance |
| Effects | 10 points | Visual polish, can reduce |
| UI | 5 points | Minimal cost |
| Buildings | 15 points | Background elements |
| Characters | 10 points | High cost, limit count |
| Physics | 10 points | Reduce complexity if needed |
| **Total** | **100 points** | Performance budget |

## Optimization Quick Actions

### Emergency Performance Boost

```javascript
// Disable expensive visual effects
[
  'volumetric-clouds',
  'dynamic-shadows',
  'weather-particles',
  'motion-blur',
  'bloom-effects'
].forEach(id => assetRegistry.disable(id))
```

### Reduce Quality

```javascript
// Lower shadow quality
renderer.shadowMap.setSize(1024, 1024)
renderer.shadowMap.type = THREE.BasicShadowMap

// Reduce particles
particleSystem.maxParticles = 2500

// Disable post-processing
composer.enabled = false
```

### Memory Cleanup

```javascript
// Clear debug logs
window.debug?.clearLogs?.()

// Optimize storage
import { optimizeStorage } from '@/utils/debug/debugStorage'
optimizeStorage()

// Force garbage collection (if available)
if (gc) gc()
```

## Common Issue Solutions

| Issue | Quick Fix | Command |
|-------|-----------|---------|
| Low FPS | Disable clouds | `assetRegistry.disable('volumetric-clouds')` |
| High memory | Clear logs | `optimizeStorage()` |
| Stuttering | Reduce particles | `particleSystem.maxParticles = 2500` |
| Shadows slow | Lower quality | `shadowMap.setSize(1024, 1024)` |
| Loading slow | Disable weather | `assetRegistry.disable('weather-particles')` |

## Performance Test Results Interpretation

### Impact Levels

| Impact | FPS Loss | Color | Severity | Action |
|--------|----------|-------|----------|--------|
| Minimal | 0-5 | 🟢 Green | None | Safe to enable |
| Moderate | 5-10 | 🟡 Yellow | Low | Monitor in production |
| Significant | 10-20 | 🟠 Orange | Medium | Consider optimization |
| Severe | >20 | 🔴 Red | High | Immediate optimization |

### Recommendation Priorities

| Priority | Icon | Meaning | Timeline |
|----------|------|---------|----------|
| Critical | 🚨 | Immediate action | Now |
| High | ⚠️ | Optimize soon | This week |
| Medium | ℹ️ | Plan optimization | This month |
| Low | 💡 | Nice to have | Backlog |

## Storage Management

### Import/Export

```javascript
import {
  exportToFile,
  importFromFile,
  clearDebugData
} from '@/utils/debug/debugStorage'

// Export configuration
exportToFile('my-config') // Downloads JSON file

// Import configuration
const file = /* File object from input */
const state = await importFromFile(file)

// Clear all data
clearDebugData()
```

### Storage Stats

```javascript
import { getStorageStats } from '@/utils/debug/debugStorage'

const stats = getStorageStats()
console.log({
  used: stats.used,
  available: stats.available,
  stateSize: stats.stateSize,
  presetsCount: stats.presetsCount,
  logsCount: stats.logsCount
})
```

## Browser DevTools Integration

### Chrome Performance Tab

```
1. Open DevTools (F12)
2. Go to Performance tab
3. Click Record
4. Enable/disable assets
5. Stop recording
6. Analyze flame graph
```

### Memory Profiling

```
1. Open DevTools (F12)
2. Go to Memory tab
3. Take heap snapshot
4. Enable expensive asset
5. Take another snapshot
6. Compare snapshots
7. Find memory increase
```

### WebGL Inspector

```
// Check WebGL capabilities
const gl = renderer.getContext()
console.log({
  maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
  maxVertexUniforms: gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS),
  renderer: gl.getParameter(gl.RENDERER)
})
```

## API Quick Reference

### Most Used Functions

```javascript
// Asset management
assetRegistry.enable(id)
assetRegistry.disable(id)
assetRegistry.isEnabled(id)
assetRegistry.getAll()
assetRegistry.getTotalCost()
assetRegistry.getBudgetStatus()

// Performance tracking
tracker.trackFPS()
tracker.getMemoryUsage()
tracker.setBaseline()
tracker.getCurrentMetrics()
tracker.generateReport()

// Testing
runner.runBaseline()
runner.runIndividualAssetTests()
runner.runFullTestSuite()

// Storage
savePreset(name, config)
loadPreset(name)
exportToFile(filename)
optimizeStorage()
```

## Version Compatibility

| Browser | Min Version | WebGL 2.0 | Memory API | Performance API |
|---------|-------------|-----------|------------|-----------------|
| Chrome | 90+ | ✅ | ✅ | ✅ |
| Firefox | 88+ | ✅ | ⚠️ Limited | ✅ |
| Safari | 14+ | ✅ | ❌ | ⚠️ Limited |
| Edge | 90+ | ✅ | ✅ | ✅ |

## See Also

- [User Guide](./performance-debug-guide.md) - Complete usage guide
- [Developer Guide](./debug-system-integration.md) - Integration documentation
- [Troubleshooting](./performance-troubleshooting.md) - Common issues and solutions
