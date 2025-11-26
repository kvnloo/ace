# Hydroponics System Technical Specification

**Imported from:** claudedocs-old/archive/HydroponicsSystem-Implementation.md
**Component:** HydroponicsSystem.tsx
**Location:** Level 3 - Vertical Grass Lab
**Status:** ✅ Implemented

---

## System Overview

Comprehensive vertical hydroponics farming system featuring autonomous farming towers with real-time monitoring, automated nutrient delivery, and dynamic plant growth visualization.

### Key Specifications
- **Total Towers:** 16 (4 per sector × 4 sectors)
- **Total Plant Capacity:** 1,024 plants (64 per tower)
- **Tower Height:** 16m (8 tiers × 2m spacing)
- **Tower Footprint:** 3m × 3m each

---

## Component Architecture

### 1. FarmingTower
| Property | Value |
|----------|-------|
| Height | 16m (8 tiers × 2m) |
| Footprint | 3m × 3m |
| Plants/Tier | 8 (circular arrangement) |
| Plants/Tower | 64 |
| Structure | Central column + 4 support beams |

### 2. TowerTier
- Transparent platform showing root systems
- NFT (Nutrient Film Technique) channel
- LED grow light ring per tier
- 8 plants arranged radially

### 3. Plant Growth Stages

| Stage | Days | Height | Color |
|-------|------|--------|-------|
| Seedling | 0-10 | 0.15m | #86efac |
| Vegetative | 11-20 | 0.35m | #4ade80 |
| Flowering | 21-30 | 0.50m | #22c55e |
| Mature | 30+ | 0.65m | #16a34a |

### 4. LED Grow Lights
- **Spectrum:** Purple (400-700nm photosynthesis optimal)
- **Color:** #a855f7
- **Animation:** 85-100% pulsing intensity
- **Points per ring:** 16
- **Effective range:** 4m

### 5. Water Circulation System
- **Central Reservoir:** 2m diameter cylindrical tank
- **Distribution:** Radial pipe layout to all towers
- **Flow Cycle:** 2 seconds
- **Animation:** Traveling light effect (blue spheres)

### 6. Monitoring Display
Real-time metrics per tower:
- pH Level: 6.0-6.5
- EC: 1.8-2.4 mS
- Temperature: 22-28°C
- Humidity: 65-80%
- Growth Progress: 75-95%

---

## Facility Layout

### Level 3 Sector Positions
```
Sector 1: [-30, 0, -20]    Sector 2: [30, 0, -20]
Sector 3: [-30, 0,  20]    Sector 4: [30, 0,  20]
```

### Spacing & Clearance
- **Tower spacing:** 8m radial
- **Sector spacing:** 60m between sectors
- **Vertical clearance:** 20m
- **Floor platform:** 25m diameter per sector

---

## Props Interface

```typescript
interface HydroponicsSystemProps {
  position: [number, number, number];
  towerCount?: number;       // Default: 4
  showMetrics?: boolean;     // Default: true
}
```

---

## Color Palette

| Element | Color | Hex |
|---------|-------|-----|
| Structure | Slate | #334155, #475569, #64748b |
| Plants | Green gradient | #86efac → #16a34a |
| Water | Blue | #3b82f6, #60a5fa |
| LEDs | Purple | #a855f7, #7c3aed |
| Accents | Emerald | #22c55e |

---

## Performance Optimizations

1. **Instanced Geometry:** Plants use reusable geometries
2. **Selective Animation:** Only animated components use useFrame
3. **LOD System:** Simplified leaf geometry, low-poly structures
4. **HTML Overlays:** Metrics only when floor active

---

## Future Enhancements

- Plant variety (lettuce, herbs, tomatoes)
- Harvesting animation with robotic arms
- Pest detection visual indicators
- Climate control integration
- Yield analytics dashboard
- Maintenance bot visualization
- Interactive pH/EC/lighting controls

---

## Integration

### Rendering Conditions
- Visible when `activeFloor === 'ALL' || activeFloor === 3`
- Metrics displayed only on Level 3 active view

### Dependencies
- React Three Fiber
- Three.js
- @react-three/drei (Html, Text, Float)

---

*Last Updated: 2025-11-22*
*Component Version: 1.0.0*
