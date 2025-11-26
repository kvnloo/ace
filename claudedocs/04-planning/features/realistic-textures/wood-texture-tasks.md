# Wood Texture Enhancement Tasks

## Overview
Tasks to implement realistic NBA-style hardwood maple textures for wood tennis courts.

## Tasks

### Task 1: Rewrite generateWoodTexture()
**File**: `src/utils/courtTextures.ts`
**Priority**: High
**Estimated Effort**: Medium

**Description**:
Replace the current simple grain pattern with plank-based generation that includes:
- 10 distinct planks with individual color variation
- Maple color palette (warm golden-brown tones)
- Simplex-like grain patterns with natural waviness
- Increased resolution from 512x512 to 2048x2048

**Acceptance Criteria**:
- [ ] Individual planks are visually distinguishable
- [ ] Grain patterns look natural, not synthetic
- [ ] No obvious tiling artifacts
- [ ] Color variation between planks is subtle but noticeable

---

### Task 2: Implement Sobel Normal Map Generator
**File**: `src/utils/courtTextures.ts`
**Priority**: High
**Estimated Effort**: Medium

**Description**:
Replace the simple normal map with a Sobel-derived normal map that:
- Generates a heightmap matching the diffuse texture
- Applies Sobel operators to derive surface normals
- Produces proper tangent-space normal map (RGB encoded)

**Acceptance Criteria**:
- [ ] Normal map matches diffuse texture patterns
- [ ] Grain has visible depth under lighting
- [ ] No visual artifacts at edges

---

### Task 3: Update Wood Material Properties
**File**: `src/utils/courtTextures.ts`
**Priority**: Medium
**Estimated Effort**: Low

**Description**:
Update the material properties for wood courts:
- Set roughness to 0.15 for glossy polyurethane finish
- Ensure metalness is 0
- Add anisotropic filtering (8x)

**Acceptance Criteria**:
- [ ] Surface has glossy, varnished appearance
- [ ] Reflections are visible under lighting
- [ ] Texture remains sharp at oblique angles

---

### Task 4: Visual Testing
**Priority**: High
**Estimated Effort**: Low

**Description**:
Test the wood texture implementation:
- View court from multiple angles and distances
- Check lighting interaction
- Verify performance (no frame rate drop)

**Acceptance Criteria**:
- [ ] Texture looks realistic from typical viewing angles
- [ ] No performance regression
- [ ] Works in all supported browsers
