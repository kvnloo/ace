# Performance Monitoring

Comprehensive guide to monitoring and optimizing system performance.

## Monitoring Architecture

### Key Metrics
- **FPS (Frames Per Second)**: Target 60 FPS
- **Memory Usage**: Track allocation and GC
- **Asset Loading**: Monitor load times
- **Network Performance**: Track data transfer

### Monitoring Tools

**Built-in Tools:**
- Performance Panel (in-app)
- Console logging
- Stats.js integration

**External Tools:**
- Chrome DevTools
- React DevTools Profiler
- Three.js Inspector

## Real-Time Monitoring

### FPS Tracking

```typescript
import Stats from 'stats.js';

const stats = new Stats();
stats.showPanel(0); // FPS panel
document.body.appendChild(stats.dom);

function animate() {
  stats.begin();

  // Rendering code
  renderer.render(scene, camera);

  stats.end();
  requestAnimationFrame(animate);
}
```

### Memory Monitoring

```typescript
function logMemoryUsage() {
  if (performance.memory) {
    const used = performance.memory.usedJSHeapSize / 1048576;
    const total = performance.memory.totalJSHeapSize / 1048576;
    console.log(`Memory: ${used.toFixed(2)}MB / ${total.toFixed(2)}MB`);
  }
}

setInterval(logMemoryUsage, 5000);
```

### Asset Loading Tracking

```typescript
class AssetLoader {
  private loadedAssets = 0;
  private totalAssets = 0;

  trackProgress(loaded: number, total: number) {
    this.loadedAssets = loaded;
    this.totalAssets = total;

    const progress = (loaded / total) * 100;
    console.log(`Loading: ${progress.toFixed(1)}%`);
  }
}
```

## Performance Profiling

### Identifying Bottlenecks

**Rendering Performance:**
```typescript
// Track render time
const startTime = performance.now();
renderer.render(scene, camera);
const renderTime = performance.now() - startTime;

if (renderTime > 16.67) { // > 60 FPS threshold
  console.warn(`Slow render: ${renderTime.toFixed(2)}ms`);
}
```

**Component Performance:**
```typescript
import { Profiler } from 'react';

<Profiler id="ThreeScene" onRender={logRenderMetrics}>
  <ThreeScene />
</Profiler>

function logRenderMetrics(
  id: string,
  phase: string,
  actualDuration: number
) {
  if (actualDuration > 16) {
    console.warn(`${id} took ${actualDuration}ms`);
  }
}
```

## Optimization Strategies

### Rendering Optimization

**Instance Batching:**
- Combine similar geometry
- Reduce draw calls
- Use InstancedMesh for repeated objects

**LOD (Level of Detail):**
- Switch to lower detail at distance
- Automatic quality adjustment
- Performance-based scaling

**Frustum Culling:**
- Only render visible objects
- Automatic Three.js culling
- Custom culling for large scenes

### Memory Optimization

**Texture Management:**
```typescript
// Dispose unused textures
texture.dispose();

// Use texture atlasing
const atlas = new TextureAtlas(textures);

// Compress textures
const compressedTexture = compressTexture(texture, 'DXT5');
```

**Geometry Cleanup:**
```typescript
// Dispose unused geometry
geometry.dispose();

// Merge geometries
const merged = BufferGeometryUtils.mergeGeometries(geometries);
```

**Material Pooling:**
```typescript
class MaterialPool {
  private materials = new Map();

  getMaterial(key: string) {
    if (!this.materials.has(key)) {
      this.materials.set(key, createMaterial(key));
    }
    return this.materials.get(key);
  }
}
```

### Asset Loading Optimization

**Progressive Loading:**
1. Load critical assets first
2. Stream in secondary assets
3. Lazy load optional features

**Code Splitting:**
```typescript
// Dynamic imports for features
const WeatherSystem = lazy(() => import('./WeatherSystem'));
const CharacterSystem = lazy(() => import('./CharacterSystem'));
```

**Asset Compression:**
- Use compressed textures (DDS, KTX)
- Minify JSON data
- Compress 3D models (Draco)

## Performance Benchmarks

### Target Metrics

**Rendering:**
- FPS: ≥ 60 (desktop), ≥ 30 (mobile)
- Frame time: ≤ 16.67ms (60 FPS)
- Max frame drop: < 5% of frames

**Memory:**
- Initial allocation: < 200MB
- Peak usage: < 500MB
- GC frequency: < 1 per second

**Loading:**
- Initial load: < 3 seconds
- Asset streaming: < 5 seconds
- Time to interactive: < 4 seconds

### Benchmark Tests

```typescript
describe('Performance Benchmarks', () => {
  it('maintains 60 FPS during camera movement', async () => {
    const fpsReadings = await measureFPS(cameraMovement);
    const avgFps = average(fpsReadings);
    expect(avgFps).toBeGreaterThanOrEqual(60);
  });

  it('loads scene within 3 seconds', async () => {
    const loadTime = await measureLoadTime();
    expect(loadTime).toBeLessThan(3000);
  });

  it('memory usage stays below 500MB', async () => {
    const peakMemory = await measurePeakMemory();
    expect(peakMemory).toBeLessThan(500 * 1024 * 1024);
  });
});
```

## Debug Tools

### Performance Panel

The in-app performance panel displays:
- Current FPS
- Memory usage
- Asset loading status
- Render statistics

**Toggle panel:**
```typescript
// Press 'P' key to toggle
window.addEventListener('keydown', (e) => {
  if (e.key === 'p') {
    togglePerformancePanel();
  }
});
```

### Console Commands

**Performance commands:**
```javascript
// Get current FPS
window.getFPS()

// Get memory usage
window.getMemoryUsage()

// Get render stats
window.getRenderStats()

// Enable detailed logging
window.setDebugMode(true)
```

## Monitoring in Production

### Sentry Integration

Track performance in production:

```typescript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [
    new Sentry.BrowserTracing({
      tracingOrigins: ['localhost', /^\//],
    }),
  ],
  tracesSampleRate: 0.1,
});

// Track custom metrics
Sentry.setMeasurement('fps', currentFPS, 'fps');
Sentry.setMeasurement('memory', memoryUsage, 'megabyte');
```

### Analytics Events

Track performance events:

```typescript
// Log slow renders
if (renderTime > 30) {
  analytics.track('slow_render', {
    duration: renderTime,
    scene: currentScene,
  });
}

// Log memory warnings
if (memoryUsage > 400 * 1024 * 1024) {
  analytics.track('high_memory', {
    usage: memoryUsage,
  });
}
```

## Quick Reference

### Performance Checklist

**Before Release:**
- [ ] Run performance benchmarks
- [ ] Check for memory leaks
- [ ] Verify asset loading times
- [ ] Test on target devices
- [ ] Enable production optimizations

**During Development:**
- [ ] Monitor FPS regularly
- [ ] Profile React components
- [ ] Check Three.js render stats
- [ ] Review memory usage patterns
- [ ] Test asset loading

### Common Issues

**Low FPS:**
- Too many draw calls → Use instancing
- Complex shaders → Simplify or use LOD
- Large textures → Compress or reduce size

**High Memory:**
- Textures not disposed → Add cleanup
- Geometry not pooled → Implement pooling
- Event listeners leaking → Remove on unmount

**Slow Loading:**
- Large assets → Compress or split
- Synchronous loading → Use async
- No caching → Implement cache layer

### Optimization Tips

1. **Measure first** - Profile before optimizing
2. **Focus on bottlenecks** - Optimize the slowest parts
3. **Test on target hardware** - Don't just test on dev machines
4. **Monitor in production** - Track real user performance
5. **Iterate** - Continuous improvement
