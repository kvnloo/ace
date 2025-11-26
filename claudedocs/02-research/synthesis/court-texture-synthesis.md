# Court Texture Synthesis - Implementation Recommendations

## Executive Summary

Based on research findings, this document synthesizes the key techniques and provides actionable implementation recommendations for creating realistic procedural textures for wood, clay, and grass tennis court surfaces.

---

## Recommended Approaches by Surface

### Wood Court: Canvas API with Sobel Normal Maps

**Why This Approach:**
- Canvas API provides sufficient control for plank-based generation
- Sobel operator efficiently converts heightmap to normal map
- Pre-computed textures have zero runtime cost
- 2048x2048 resolution provides excellent grain detail

**Key Implementation Points:**
1. Generate 8-12 planks with individual color variation
2. Use Simplex noise for grain patterns (stretch Y-axis 2x)
3. Generate heightmap first, then derive normal map via Sobel
4. Apply high anisotropic filtering (8x) for angle views

**Material Settings:**
```javascript
roughness: 0.15    // Glossy polyurethane
metalness: 0       // Non-metallic
envMapIntensity: 1.2
```

---

### Clay Court: Hybrid Canvas + Enhanced Granular

**Why This Approach:**
- Granular texture requires many small particles (500+)
- Rake marks add critical visual authenticity
- Canvas handles both efficiently as pre-computed
- Normal map adds depth perception

**Key Implementation Points:**
1. Generate 500+ granular particles with ±20 RGB variation
2. Add rake marks at 4px spacing with slight waviness
3. Optional: Include wear pattern overlay for baseline/service areas
4. Generate matching normal map for granular bumps

**Material Settings:**
```javascript
roughness: 0.85     // Matte dusty surface
metalness: 0        // Non-metallic
normalScale: [0.8, 0.8]
```

---

### Grass Court: Enhanced Instanced Geometry

**Why This Approach:**
- Instanced geometry already implemented, needs refinement
- Shader-based coloring is efficient and flexible
- Clumping distribution adds natural appearance
- No texture needed, pure geometry solution

**Key Implementation Points:**
1. Enhance distribution with clumping algorithm
2. Increase height variation to 70-130%
3. Add sun-bleached effect in fragment shader
4. Increase lean variation to ±0.25 radians

**Shader Enhancements:**
```glsl
// Darker base, lighter tip
vec3 finalColor = mix(uBaseColor * 0.7, uTipColor * 1.2, vUv.y);

// Sun-bleached tips
finalColor.r += vUv.y * 0.05;
finalColor.g += vUv.y * 0.03;

// Per-blade variation
finalColor *= (0.88 + vWindFactor * 0.24);
```

---

## Trade-off Decisions

### Texture Resolution: 2048x2048 for Wood, 1024x1024 for Clay
- **Rationale**: Wood grain requires fine detail; clay granules are already small-scale noise
- **Memory Impact**: ~16MB for wood, ~4MB for clay (RGBA)
- **Alternative**: 1024x1024 for both if memory constrained

### Grass Density: Adaptive (50k-750k blades)
- **Rationale**: Current adaptive system works well
- **Enhancement**: Focus on visual quality, not quantity
- **Keep**: The existing FPS-based scaling approach

### Normal Map Generation: Sobel Over Perlin
- **Rationale**: Sobel generates from actual heightmap, more accurate
- **Alternative**: Perlin-based normal would be faster but less realistic
- **Decision**: Sobel for wood (detail matters), simplified for clay

---

## Performance Budget

### Texture Memory
| Asset | Resolution | Memory | Priority |
|-------|------------|--------|----------|
| Wood Diffuse | 2048x2048 | 16MB | High |
| Wood Normal | 2048x2048 | 16MB | High |
| Clay Diffuse | 1024x1024 | 4MB | Medium |
| Clay Normal | 1024x1024 | 4MB | Medium |
| **Total** | - | **40MB** | - |

### Generation Time (Estimated)
| Asset | Time | When |
|-------|------|------|
| Wood Texture | ~50ms | Load |
| Wood Normal | ~100ms | Load |
| Clay Texture | ~30ms | Load |
| Clay Normal | ~50ms | Load |
| **Total** | ~230ms | Once |

### Runtime Impact
- Grass shader: Negligible (simple math operations)
- Texture sampling: Standard, optimized by GPU
- No per-frame procedural generation

---

## Implementation Priority

### Phase 1: Quick Wins (High Impact, Low Effort)
1. **Grass shader enhancement** - Just update GLSL code
2. **Grass distribution clumping** - Modify generation algorithm
3. **Clay color variation** - Add to particle generation

### Phase 2: Core Improvements (High Impact, Medium Effort)
4. **Wood texture rewrite** - Plank-based with Simplex grain
5. **Clay rake marks** - Add parallel line generation
6. **Wood normal map** - Implement Sobel generator

### Phase 3: Polish (Medium Impact, Higher Effort)
7. **Clay normal map** - Granular bump mapping
8. **Wear patterns** - Optional enhancement
9. **LOD system for grass** - Future consideration

---

## Risk Mitigation

### Risk: Texture Generation Fails on Some Browsers
**Mitigation**: Wrap in try-catch, fall back to solid color material

### Risk: Performance Regression
**Mitigation**:
- Pre-compute everything at load time
- Cache textures (already implemented)
- Profile before/after changes

### Risk: Visual Inconsistency Across Devices
**Mitigation**:
- Use standard sRGB color space
- Test on multiple GPUs
- Avoid browser-specific Canvas features

---

## Success Criteria

### Wood Court
- [ ] Individual planks visually distinguishable
- [ ] Grain pattern visible and natural-looking
- [ ] Glossy appearance under lighting
- [ ] No obvious tiling artifacts

### Clay Court
- [ ] Granular texture visible at close range
- [ ] Rake marks clearly visible
- [ ] Authentic terre battue color
- [ ] Matte, dusty appearance

### Grass Court
- [ ] Natural clumping pattern visible
- [ ] Color variation blade-to-blade
- [ ] Darker at base, lighter at tips
- [ ] Sun-bleached effect on tips

---

## Next Steps

1. Create detailed implementation specification
2. Create task breakdown for each surface type
3. Begin implementation with grass (quickest win)
4. Proceed to wood (most complex)
5. Finish with clay (medium complexity)
6. Visual testing and iteration
