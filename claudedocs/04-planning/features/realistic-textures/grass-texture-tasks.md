# Grass Texture Enhancement Tasks

## Overview
Tasks to enhance the grass court rendering for a more natural, Wimbledon-style appearance.

## Tasks

### Task 1: Enhance Fragment Shader
**File**: `src/components/GrassAdaptive.tsx`
**Priority**: High
**Estimated Effort**: Low

**Description**:
Update the grass fragment shader to include:
- Darker base color (0.65x multiplier instead of 0.7x)
- Brighter tip color (1.25x multiplier instead of 1.2x)
- Enhanced sun-bleached effect with quadratic falloff
- Ambient occlusion at blade base
- Wider per-blade color variation (0.88-1.12 range)

**Acceptance Criteria**:
- [ ] Blades are darker at base, lighter at tips
- [ ] Sun-bleached yellow tint visible at tips
- [ ] Color variation between blades is noticeable
- [ ] Base of grass appears slightly shadowed

---

### Task 2: Implement Clumping Distribution
**File**: `src/components/GrassAdaptive.tsx`
**Priority**: High
**Estimated Effort**: Medium

**Description**:
Update the grass distribution algorithm to create natural clumping:
- Generate clump centers (count/50 clumps)
- 70% of blades positioned near a clump
- 30% of blades randomly distributed
- Increased lean variation (±0.3 radians)

**Acceptance Criteria**:
- [ ] Visible clumping pattern in grass
- [ ] Natural appearance, not grid-like
- [ ] Blades lean in varied directions
- [ ] No bare patches or obvious gaps

---

### Task 3: Increase Height and Scale Variation
**File**: `src/components/GrassAdaptive.tsx`
**Priority**: Medium
**Estimated Effort**: Low

**Description**:
Increase variation in blade dimensions:
- Height variation: 70-130% (was 70-130%, verify)
- Scale variation: 70-130% (was 75-125%)
- Ensure variation applies consistently with clumping

**Acceptance Criteria**:
- [ ] Visible height variation across lawn
- [ ] No uniform "carpet" appearance
- [ ] Short and tall blades mixed naturally

---

### Task 4: Visual Testing
**Priority**: High
**Estimated Effort**: Low

**Description**:
Test the grass enhancements:
- View court from multiple angles
- Verify clumping is visible but natural
- Check color gradient on individual blades
- Verify wind animation still works correctly
- Check performance (frame rate)

**Acceptance Criteria**:
- [ ] Grass looks natural, not synthetic
- [ ] Color variation visible
- [ ] Wind animation smooth
- [ ] No performance regression
