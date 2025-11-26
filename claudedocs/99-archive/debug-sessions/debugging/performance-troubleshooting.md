# Performance Troubleshooting Guide

## Table of Contents
1. [Diagnostic Workflows](#diagnostic-workflows)
2. [Common Performance Issues](#common-performance-issues)
3. [Asset-Specific Optimization](#asset-specific-optimization)
4. [Browser-Specific Considerations](#browser-specific-considerations)
5. [Advanced Debugging](#advanced-debugging)

## Diagnostic Workflows

### Quick Performance Check

Follow this flowchart for rapid diagnosis:

```
START
  ↓
Is FPS < 30?
  ├─ YES → CRITICAL PATH
  │   ↓
  │   Check GPU utilization
  │   ├─ High (>90%) → GPU bottleneck
  │   │   └─ Reduce: shadows, effects, poly count
  │   └─ Low (<50%) → CPU bottleneck
  │       └─ Reduce: physics, particles, draw calls
  │
  └─ NO → Is FPS < 50?
      ├─ YES → OPTIMIZATION PATH
      │   ↓
      │   Run individual asset tests
      │   └─ Identify top 3 expensive assets
      │       └─ Optimize or reduce quality
      │
      └─ NO → Is memory > 500MB?
          ├─ YES → MEMORY PATH
          │   └─ Check for memory leaks
          │       └─ Profile and fix
          └─ NO → Performance is OK ✓
```

### Systematic Diagnosis Process

#### Step 1: Establish Baseline

```typescript
import { getPerformanceTracker } from '@/utils/debug/performanceTracker';

const tracker = getPerformanceTracker();

// 1. Disable all assets
assetRegistry.getEnabled().forEach(asset => {
  assetRegistry.disable(asset.id);
});

// 2. Wait for scene to stabilize
await new Promise(resolve => setTimeout(resolve, 3000));

// 3. Set baseline
tracker.setBaseline();

const baseline = tracker.getCurrentMetrics();
console.log('Baseline established:', baseline);
```

#### Step 2: Test Individual Assets

```typescript
import { PerformanceTestRunner } from '@/utils/debug/performanceComparison';

const runner = new PerformanceTestRunner({
  stabilizationTime: 3000,
  measurementFrames: 60,
  measurementPasses: 3
});

// Test each asset individually
const results = await runner.runIndividualAssetTests();

// Sort by performance impact
const sorted = Array.from(results.entries())
  .sort((a, b) => a[1].fps - b[1].fps);

console.log('Most expensive assets:', sorted.slice(0, 5));
```

#### Step 3: Identify Bottleneck

```typescript
// Check GPU vs CPU bottleneck
const metrics = tracker.getCurrentMetrics();

if (metrics.gpu) {
  const { drawCallsPerFrame, trianglesPerFrame } = metrics.gpu;

  console.log('GPU Stats:', {
    drawCalls: drawCallsPerFrame,
    triangles: trianglesPerFrame,
    renderer: metrics.gpu.renderer
  });

  // High draw calls = CPU bottleneck (>1000 calls)
  // High triangles = GPU bottleneck (>1M triangles)
}
```

#### Step 4: Apply Targeted Fixes

Based on bottleneck type:

- **GPU Bottleneck**: Reduce visual complexity
- **CPU Bottleneck**: Reduce scene complexity
- **Memory Bottleneck**: Reduce loaded assets

## Common Performance Issues

### Issue 1: Low FPS (< 30)

#### Symptoms
- Scene feels laggy
- Animations stutter
- Input feels delayed

#### Diagnostic Steps

```typescript
// 1. Check current FPS
const fps = tracker.trackFPS();
console.log('Current FPS:', fps);

// 2. Generate performance report
const report = tracker.generateReport();
console.log('Recommendations:', report.recommendations);

// 3. Check individual asset costs
const enabled = assetRegistry.getEnabled();
const costs = enabled.map(asset => ({
  name: asset.name,
  cost: asset.performanceCost,
  renderTime: /* get from tracker */
})).sort((a, b) => b.cost - a.cost);

console.log('Expensive assets:', costs.slice(0, 5));
```

#### Solutions

**Quick Fixes** (Immediate relief):
```typescript
// Disable expensive assets
const expensiveAssets = [
  'volumetric-clouds',
  'dynamic-shadows',
  'weather-particles',
  'motion-blur'
];

expensiveAssets.forEach(id => {
  assetRegistry.disable(id);
});
```

**Medium-term** (Reduce quality):
```typescript
// Reduce shadow quality
shadowMap.setSize(1024, 1024); // Down from 2048

// Reduce particle counts
particleSystem.maxParticles = 5000; // Down from 10000

// Disable post-processing effects
postProcessing.disable('bloom');
postProcessing.disable('ssao');
```

**Long-term** (Optimization):
- Implement LOD (Level of Detail) system
- Use instancing for repeated geometry
- Optimize shaders
- Reduce texture sizes
- Implement frustum culling

### Issue 2: High Memory Usage (> 500MB)

#### Symptoms
- Browser becomes slow
- Tab crashes
- "Out of memory" warnings
- Memory constantly increasing

#### Diagnostic Steps

```typescript
// 1. Check current memory
const memory = tracker.getMemoryUsage();
console.log('Memory usage:', memory, 'MB');

// 2. Track memory over time
const interval = setInterval(() => {
  const current = tracker.getMemoryUsage();
  console.log('Memory:', current, 'MB');
}, 5000);

// 3. Check for memory leaks
// If memory keeps increasing = likely leak

// 4. Profile asset memory
const assets = assetRegistry.getEnabled();
assets.forEach(asset => {
  const before = tracker.getMemoryUsage();
  assetRegistry.disable(asset.id);
  await new Promise(r => setTimeout(r, 1000));
  const after = tracker.getMemoryUsage();
  const freed = before - after;

  console.log(`${asset.name}: ${freed}MB`);
});
```

#### Solutions

**Immediate** (Free memory):
```typescript
// Disable high-memory assets
const highMemoryAssets = [
  'volumetric-clouds',
  'high-res-textures',
  'character-models'
];

highMemoryAssets.forEach(id => {
  assetRegistry.disable(id);
});

// Clear debug logs
if (window.debug) {
  window.debug.clearLogs();
}

// Optimize storage
import { optimizeStorage } from '@/utils/debug/debugStorage';
optimizeStorage();
```

**Fix Memory Leaks**:
```typescript
// Check for common leak patterns

// ❌ Bad: Event listeners not removed
component.addEventListener('click', handler);
// Missing: component.removeEventListener('click', handler);

// ❌ Bad: Textures not disposed
const texture = textureLoader.load('image.jpg');
// Missing: texture.dispose();

// ❌ Bad: Geometry not disposed
const geometry = new THREE.BoxGeometry(1, 1, 1);
// Missing: geometry.dispose();

// ✅ Good: Proper cleanup
useEffect(() => {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial();
  const mesh = new THREE.Mesh(geometry, material);

  return () => {
    geometry.dispose();
    material.dispose();
    // mesh is automatically garbage collected
  };
}, []);
```

### Issue 3: Inconsistent Performance

#### Symptoms
- FPS varies wildly
- Stuttering at random intervals
- Periodic frame drops

#### Diagnostic Steps

```typescript
// 1. Monitor FPS over time
const fpsHistory: number[] = [];
const interval = setInterval(() => {
  const fps = tracker.trackFPS();
  fpsHistory.push(fps);

  if (fpsHistory.length >= 60) {
    // Calculate variance
    const avg = fpsHistory.reduce((a, b) => a + b) / fpsHistory.length;
    const variance = fpsHistory.reduce((sum, fps) => sum + Math.pow(fps - avg, 2), 0) / fpsHistory.length;
    const stdDev = Math.sqrt(variance);

    console.log({
      average: avg.toFixed(1),
      stdDev: stdDev.toFixed(1),
      min: Math.min(...fpsHistory),
      max: Math.max(...fpsHistory)
    });

    fpsHistory.length = 0; // Reset
  }
}, 1000 / 60);
```

#### Solutions

**Identify Cause**:
```typescript
// Check for garbage collection pauses
// These cause periodic stutters

// Solution 1: Reduce object creation
// ❌ Bad: Creates new objects every frame
function update() {
  const temp = new THREE.Vector3(); // New object!
  // ...
}

// ✅ Good: Reuse objects
const temp = new THREE.Vector3(); // Created once
function update() {
  temp.set(0, 0, 0); // Reuse
  // ...
}

// Solution 2: Implement object pooling
class ObjectPool<T> {
  private pool: T[] = [];

  get(factory: () => T): T {
    return this.pool.pop() || factory();
  }

  release(obj: T) {
    this.pool.push(obj);
  }
}
```

**Stabilize Frame Times**:
```typescript
// Implement frame time smoothing
class FrameTimeStabilizer {
  private times: number[] = [];
  private maxSamples = 10;

  getSmoothFrameTime(currentTime: number): number {
    this.times.push(currentTime);
    if (this.times.length > this.maxSamples) {
      this.times.shift();
    }

    // Return median to filter outliers
    const sorted = [...this.times].sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length / 2)];
  }
}
```

### Issue 4: Slow Asset Loading

#### Symptoms
- Long initial load times
- Scene appears gradually
- Delayed asset activation

#### Solutions

```typescript
// Implement progressive loading
class AssetLoader {
  async loadInPriority() {
    // Priority 1: Essential assets
    await this.loadEssential([
      'tennis-courts',
      'ambient-light',
      'directional-light'
    ]);

    // Priority 2: Visual enhancements
    await this.loadEnhancements([
      'grass-blades',
      'court-surface'
    ]);

    // Priority 3: Nice-to-have
    await this.loadOptional([
      'weather-effects',
      'particle-systems'
    ]);
  }

  private async loadEssential(ids: string[]) {
    for (const id of ids) {
      await this.loadAsset(id);
      assetRegistry.enable(id);
    }
  }
}

// Use lazy loading for heavy assets
const heavyAssets = ['volumetric-clouds', 'character-system'];
heavyAssets.forEach(id => {
  // Don't load until needed
  assetRegistry.register({
    id,
    // ... definition
    defaultEnabled: false // Load on demand
  });
});
```

## Asset-Specific Optimization

### Courts (Performance Cost: 3-4)

**Common Issues**:
- High polygon count
- Complex textures

**Optimizations**:
```typescript
// Reduce texture resolution
courtTexture.image.width = 1024;  // Down from 2048
courtTexture.needsUpdate = true;

// Use simpler geometry for distant courts
if (camera.distance > 50) {
  courtMesh.geometry = lowPolyGeometry;
} else {
  courtMesh.geometry = highPolyGeometry;
}

// Implement LOD
const lod = new THREE.LOD();
lod.addLevel(highDetailCourt, 0);    // 0-25m
lod.addLevel(mediumDetailCourt, 25); // 25-50m
lod.addLevel(lowDetailCourt, 50);    // 50m+
```

### Grass System (Performance Cost: 6-7)

**Common Issues**:
- Massive instance counts
- Complex physics
- Wind simulation overhead

**Optimizations**:
```typescript
// Reduce grass instance count
const maxInstances = 50000; // Down from 100000

// Simplify wind calculation
// ❌ Bad: Per-instance calculation
instances.forEach(instance => {
  instance.applyWind(windVector); // Expensive!
});

// ✅ Good: Batch calculation with shader
grassShader.uniforms.windStrength.value = windStrength;
grassShader.uniforms.windDirection.value = windDirection;
// Wind applied in vertex shader - much faster

// Disable grass physics at distance
if (camera.distance > 30) {
  grassPhysics.enabled = false;
}

// Use billboards for distant grass
if (camera.distance > 50) {
  grassMesh.material = billboardMaterial;
}
```

### Lighting (Performance Cost: 2-7)

**Common Issues**:
- Too many lights
- High shadow map resolution
- Multiple shadow-casting lights

**Optimizations**:
```typescript
// Reduce shadow map size
directionalLight.shadow.mapSize.width = 1024;  // Down from 2048
directionalLight.shadow.mapSize.height = 1024;

// Limit shadow-casting lights
const maxShadowCasters = 3;
let shadowCasterCount = 0;

lights.forEach(light => {
  if (shadowCasterCount < maxShadowCasters) {
    light.castShadow = true;
    shadowCasterCount++;
  } else {
    light.castShadow = false;
  }
});

// Use cheaper shadow algorithm
renderer.shadowMap.type = THREE.BasicShadowMap; // Faster
// Instead of: THREE.PCFSoftShadowMap (prettier but slower)

// Disable shadows for small objects
if (mesh.geometry.boundingSphere.radius < 0.5) {
  mesh.castShadow = false;
  mesh.receiveShadow = false;
}
```

### Weather Effects (Performance Cost: 6-8)

**Common Issues**:
- Particle overdraw
- Complex volumetric rendering
- Multiple simultaneous effects

**Optimizations**:
```typescript
// Reduce particle count based on FPS
const targetFPS = 60;
const currentFPS = tracker.trackFPS();

if (currentFPS < targetFPS * 0.8) {
  particleSystem.maxParticles *= 0.75; // Reduce by 25%
}

// Use texture atlases for particles
particleSystem.material.map = particleAtlas;
// Faster than individual textures

// Limit render distance for particles
particleSystem.particles.forEach(particle => {
  const distance = particle.position.distanceTo(camera.position);
  particle.visible = distance < maxParticleDistance;
});

// Simplify clouds at distance
if (cloudDistance > 100) {
  cloud.material = simplifiedMaterial;
  cloud.geometry = lowPolyGeometry;
}
```

### Post-Processing (Performance Cost: 4-6)

**Common Issues**:
- Multiple passes
- Full-screen effects
- High sample counts

**Optimizations**:
```typescript
// Reduce effect quality
bloomPass.strength = 0.5;  // Down from 1.0
ssaoPass.kernelSize = 8;   // Down from 32

// Disable on low-end devices
if (renderer.capabilities.maxTextureSize < 4096) {
  composer.removePass(bloomPass);
  composer.removePass(ssaoPass);
}

// Use lower resolution render targets
const scale = 0.75; // Render at 75% resolution
composer.setSize(window.innerWidth * scale, window.innerHeight * scale);

// Combine passes where possible
// Instead of: Bloom + SSAO + Motion Blur (3 passes)
// Use: Combined custom shader (1 pass)
```

## Browser-Specific Considerations

### Chrome/Edge

**Best Performance Settings**:
```typescript
// Enable hardware acceleration
// chrome://settings/system

// Enable WebGL 2.0
const gl = canvas.getContext('webgl2');

// Use Chrome-specific optimizations
if (/Chrome/.test(navigator.userAgent)) {
  renderer.powerPreference = 'high-performance';
}
```

**Memory Profiling**:
```
1. Open DevTools (F12)
2. Go to Memory tab
3. Take heap snapshot
4. Enable asset → Take another snapshot
5. Compare snapshots → Find memory increase
6. Identify leaked objects
```

### Firefox

**Known Limitations**:
- Memory API less precise
- Some WebGL extensions unavailable

**Workarounds**:
```typescript
// Check memory support
if (!(performance as any).memory) {
  console.warn('Memory API not available in Firefox');
  // Use alternative method
  // Monitor performance.now() deltas instead
}

// Use Firefox-specific optimizations
if (/Firefox/.test(navigator.userAgent)) {
  // Reduce texture sizes
  renderer.capabilities.maxTextureSize = 2048;
}
```

### Safari

**Known Issues**:
- WebGL performance varies
- Memory limits stricter
- Some features not supported

**Solutions**:
```typescript
// Detect Safari
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

if (isSafari) {
  // Use conservative settings
  renderer.antialias = false;
  renderer.shadowMap.enabled = false;

  // Reduce complexity
  maxParticles = 1000; // Down from 5000
}
```

## Advanced Debugging

### GPU Debugging

```typescript
// Check GPU capabilities
const gl = renderer.getContext();
const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');

if (debugInfo) {
  console.log({
    vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
    renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
    maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
    maxVertexUnits: gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS)
  });
}

// Monitor draw calls
let drawCalls = 0;
const originalDrawElements = gl.drawElements.bind(gl);
gl.drawElements = function(...args) {
  drawCalls++;
  return originalDrawElements(...args);
};

setInterval(() => {
  console.log('Draw calls per second:', drawCalls);
  drawCalls = 0;
}, 1000);
```

### Memory Leak Detection

```typescript
class MemoryLeakDetector {
  private measurements: number[] = [];

  track() {
    const memory = (performance as any).memory?.usedJSHeapSize || 0;
    this.measurements.push(memory);

    // Keep last 100 measurements
    if (this.measurements.length > 100) {
      this.measurements.shift();
    }
  }

  detectLeak(): boolean {
    if (this.measurements.length < 50) return false;

    // Check if memory is consistently increasing
    const recent = this.measurements.slice(-25);
    const older = this.measurements.slice(-50, -25);

    const recentAvg = recent.reduce((a, b) => a + b) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b) / older.length;

    const increase = recentAvg - olderAvg;
    const percentIncrease = (increase / olderAvg) * 100;

    // If memory increased >10% over last 50 measurements = likely leak
    return percentIncrease > 10;
  }
}

const detector = new MemoryLeakDetector();
setInterval(() => {
  detector.track();
  if (detector.detectLeak()) {
    console.error('⚠️ Possible memory leak detected!');
  }
}, 1000);
```

### Performance Profiling

```typescript
// Custom performance marks
function profileAsset(id: string, fn: () => void) {
  performance.mark(`${id}-start`);
  fn();
  performance.mark(`${id}-end`);

  performance.measure(id, `${id}-start`, `${id}-end`);

  const measure = performance.getEntriesByName(id)[0];
  console.log(`${id} took ${measure.duration}ms`);

  // Cleanup
  performance.clearMarks();
  performance.clearMeasures();
}

// Usage
profileAsset('grass-render', () => {
  renderGrass();
});
```

---

## Emergency Performance Recovery

If performance is critically bad (FPS < 15):

```typescript
// Nuclear option: Disable everything non-essential
const essentialAssets = [
  'ambient-light',
  'directional-light',
  'tennis-court-1'
];

assetRegistry.getAll().forEach(asset => {
  if (!essentialAssets.includes(asset.id)) {
    assetRegistry.disable(asset.id);
  }
});

// Force minimum quality
renderer.setPixelRatio(1); // No HiDPI
renderer.shadowMap.enabled = false;
renderer.antialias = false;

// Reload if still bad
if (tracker.trackFPS() < 15) {
  alert('Performance critically low. Reloading with safe mode...');
  localStorage.setItem('safe-mode', 'true');
  location.reload();
}
```

## See Also

- [User Guide](./performance-debug-guide.md) - General usage
- [Developer Guide](./debug-system-integration.md) - Integration patterns
- [Quick Reference](./debug-quick-reference.md) - Shortcuts and presets
