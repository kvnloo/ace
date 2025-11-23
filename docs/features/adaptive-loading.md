# Adaptive Loading System

Intelligent progressive loading system that adjusts quality based on device performance to ensure optimal user experience.

## Overview

The Adaptive Loading System delivers a smooth, tailored loading experience by:

- **Progressive Loading**: Assets load in 4 phases based on priority
- **FPS Monitoring**: Real-time performance tracking during loading
- **Quality Auto-Adjustment**: Automatic quality mode selection
- **User Control**: Skip button and manual quality override
- **Persistent Preferences**: Quality settings saved across sessions

## User Experience

### What to Expect

#### First Load

1. **Loading Screen Appears**
   - Shows progress bar with current phase
   - Displays FPS meter
   - Shows estimated time remaining

2. **Phase Progression**
   - Phase 1 (Essential): Basic scene setup (1-2 seconds)
   - Phase 2 (Core): Tennis courts and structures (3-5 seconds)
   - Phase 3 (Visual): Grass, lighting, weather (5-8 seconds)
   - Phase 4 (Enhanced): Effects and post-processing (8-12 seconds)

3. **FPS Monitoring**
   - System tracks frame rate during loading
   - Detects performance issues early
   - Adjusts quality if needed

#### High-Performance Devices (FPS ≥60)

- All 4 phases load successfully
- No performance warnings
- Full visual quality enabled
- May auto-upgrade to Ultra mode
- Total time: 8-12 seconds

#### Medium-Performance Devices (FPS 40-50)

- Phases 1-3 load successfully
- Recommendation appears for Balanced mode
- User can choose:
  - **Continue**: Load all phases (may be slower)
  - **Apply Balanced**: Skip phase 4, maintain good performance
- Total time: 6-8 seconds (if Balanced accepted)

#### Low-Performance Devices (FPS <30)

- Phase 1 completes, FPS check fails
- Immediate recommendation for Minimal mode
- Force load disabled for safety
- Only essential elements load
- Total time: 2-3 seconds

### Skip Button

Available after Phase 1 completes:

- **Click "Skip to Minimal"**: Loads basic scene only
- **Best for**: Users who want faster access
- **Quality**: Minimal mode (courts + buildings only)
- **Time saved**: ~5-10 seconds

### Quality Recommendations

When FPS drops below threshold, you'll see:

```
⚠️ Performance Notice

Your device is experiencing low frame rates (32 FPS).
We recommend switching to Balanced mode for better performance.

[Continue Loading]  [Apply Balanced Mode]
```

- **Continue**: Proceeds with current quality
- **Apply**: Switches to recommended mode

### Manual Quality Control

Access quality settings anytime:

1. Click settings icon (top-right)
2. Select "Quality Settings"
3. Choose mode:
   - **Emergency**: Courts only (lowest settings)
   - **Minimal**: Courts + buildings
   - **Balanced**: Courts + buildings + grass
   - **Quality**: Full scene, reduced effects
   - **Ultra**: Maximum visual quality

Changes apply immediately and persist across sessions.

## Performance Modes Explained

### Emergency Mode
**Target FPS**: 60-120
**Best for**: Critical performance recovery, very old devices

**Enabled Features**:
- Tennis courts only
- No shadows
- No grass
- No effects
- Basic lighting

**Memory Usage**: ~128 MB

### Minimal Mode
**Target FPS**: 50-55
**Best for**: Low-end devices, mobile

**Enabled Features**:
- Tennis courts
- Buildings
- Basic materials
- No grass or trees
- No shadows or effects
- Simple weather

**Memory Usage**: ~256 MB

### Balanced Mode (Default)
**Target FPS**: 40-45
**Best for**: Mid-range devices, balanced experience

**Enabled Features**:
- Tennis courts
- Buildings
- Grass (30% density)
- Weather effects
- Low-quality shadows
- No particles

**Memory Usage**: ~512 MB

### Quality Mode
**Target FPS**: 45-50
**Best for**: High-end devices, visual priority

**Enabled Features**:
- Tennis courts
- Buildings
- Grass (70% density)
- Trees and vegetation
- Weather effects
- Medium-quality shadows
- Post-processing
- No particles

**Memory Usage**: ~768 MB

### Ultra Mode
**Target FPS**: 55-60
**Best for**: Gaming rigs, maximum visual quality

**Enabled Features**:
- All elements enabled
- Grass (100% density)
- Trees and vegetation
- Particle effects
- Weather effects
- High-quality shadows
- Post-processing
- Reflections

**Memory Usage**: ~1024 MB

## Auto-Adjustment Behavior

The system continuously monitors FPS and adjusts quality:

### Downgrade Triggers
- Average FPS below mode's minimum for 10 seconds
- Sustained performance issues

### Upgrade Triggers
- Average FPS above mode's maximum + 10 for 30 seconds
- 1-minute cooldown between upgrades
- Stable performance required

### Example Timeline

```
Time  FPS   Mode      Action
----  ----  --------  ------
0s    60    Balanced  Initial load
10s   42    Balanced  Monitoring...
20s   40    Balanced  FPS below threshold
30s   38    Balanced  Sustained low FPS
31s   38    Minimal   Auto-downgraded
40s   55    Minimal   Performance improved
70s   58    Minimal   Stable high FPS (waiting for cooldown)
90s   60    Balanced  Auto-upgraded (cooldown passed)
```

## Best Practices

### For Users

1. **First Visit**: Let system auto-detect best mode
2. **Manual Changes**: Only if you prefer different balance
3. **Performance Issues**: Trust the recommendations
4. **Skip Button**: Use for quick access, quality can be increased later

### Device Recommendations

| Device Type | Recommended Mode |
|-------------|------------------|
| Desktop (Gaming) | Ultra |
| Desktop (Office) | Quality |
| Laptop (Modern) | Balanced |
| Laptop (Older) | Minimal |
| Tablet | Minimal |
| Phone | Emergency |

## Troubleshooting

See [Troubleshooting Guide](./troubleshooting-loading.md) for common issues and solutions.

## Technical Details

### Phase Breakdown

#### Phase 1: Essential (2s)
**Assets**: 5
**Categories**: Scene, Camera, Lighting, Geometry
**Target FPS**: ≥60

Critical systems required for basic 3D rendering:
- Scene container
- Camera setup
- Ambient lighting
- Ground plane

#### Phase 2: Core (5s)
**Assets**: 11
**Categories**: Geometry, Materials
**Target FPS**: ≥50

Main facility elements:
- 4 tennis courts
- Court lines and nets
- Building structures
- Court materials

#### Phase 3: Visual (8s)
**Assets**: 9
**Categories**: Geometry, Lighting, Materials, Weather
**Target FPS**: ≥45

Enhanced visual elements:
- Grass system
- Directional sunlight
- Court spotlights
- Basic weather
- Surface materials

#### Phase 4: Enhanced (12s)
**Assets**: 9
**Categories**: Effects, Post-processing, Weather
**Target FPS**: ≥40

Advanced effects:
- Particle systems (dust, rain)
- Dynamic shadows
- Post-processing (bloom, SSAO, tone mapping)
- Advanced weather (wind, clouds)

### Quality Mode Matrix

| Feature | Emergency | Minimal | Balanced | Quality | Ultra |
|---------|-----------|---------|----------|---------|-------|
| Shadow Quality | Off | Off | Low | Medium | High |
| Grass Density | 0% | 0% | 30% | 70% | 100% |
| Particle Count | 0 | 0 | 0 | 0 | 1000 |
| Post-Processing | ✗ | ✗ | ✗ | ✓ | ✓ |
| Weather Effects | ✗ | ✗ | ✓ | ✓ | ✓ |
| LOD Distance | 50m | 75m | 100m | 150m | 200m |

### FPS Monitoring

**Sample Rate**: Every 5 seconds
**History Size**: 10 samples (50 seconds)
**Stability Time (Downgrade)**: 10 seconds
**Stability Time (Upgrade)**: 30 seconds
**Upgrade Cooldown**: 60 seconds

### Storage

Quality preferences stored in `localStorage`:
```json
{
  "qualityMode": "balanced"
}
```

## API Reference

See [API Reference](./api-reference-loading.md) for developer integration.

## Version History

### v1.0.0 (Current)
- Progressive 4-phase loading
- FPS-based quality adjustment
- 5 quality presets
- Persistent preferences
- Skip button
- Auto-upgrade/downgrade

## Related Documentation

- [API Reference](./api-reference-loading.md)
- [Troubleshooting Guide](./troubleshooting-loading.md)
- [Performance Optimization](../performance/optimization-guide.md)
- [Quality Settings](../architecture/quality-system.md)
