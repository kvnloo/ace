# Clay Texture Enhancement Tasks

## Overview
Tasks to implement realistic Roland Garros style terre battue (crushed brick) textures for clay tennis courts.

## Tasks

### Task 1: Create generateClayTexture()
**File**: `src/utils/courtTextures.ts`
**Priority**: High
**Estimated Effort**: Medium

**Description**:
Create a new clay texture generator that includes:
- 500+ granular particles with varied sizes (1-3px)
- Color variation per granule (±20 RGB variation)
- Rake marks at 4px spacing with slight waviness
- Terre battue color palette (red-brown tones)

**Acceptance Criteria**:
- [ ] Granular texture visible at close range
- [ ] Rake marks clearly visible
- [ ] Color variation creates natural appearance
- [ ] Authentic Roland Garros terre battue color

---

### Task 2: Create generateClayNormalMap()
**File**: `src/utils/courtTextures.ts`
**Priority**: Medium
**Estimated Effort**: Medium

**Description**:
Create a normal map generator for clay that:
- Creates granular bumps matching the diffuse texture
- Includes subtle rake groove normals
- Uses radial gradients for 3D bump effect

**Acceptance Criteria**:
- [ ] Granular bumps visible under lighting
- [ ] Rake grooves have subtle depth
- [ ] Normal map matches diffuse pattern

---

### Task 3: Update getCourtTexture() for Clay
**File**: `src/utils/courtTextures.ts`
**Priority**: High
**Estimated Effort**: Low

**Description**:
Update the clay court material configuration:
- Add the new diffuse and normal map textures
- Set roughness to 0.85 for matte, dusty surface
- Set normalScale to [0.8, 0.8] for pronounced bumps

**Acceptance Criteria**:
- [ ] Clay courts use new textures
- [ ] Surface has matte appearance
- [ ] Granular depth is visible

---

### Task 4: Visual Testing
**Priority**: High
**Estimated Effort**: Low

**Description**:
Test the clay texture implementation:
- View court from multiple angles and distances
- Verify rake marks are visible
- Check color authenticity against reference images
- Verify performance

**Acceptance Criteria**:
- [ ] Texture looks like authentic terre battue
- [ ] Rake marks visible from typical viewing distance
- [ ] No performance regression
