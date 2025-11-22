# Tennis Court Layout - Ground Floor

## Visual Layout

```
                    GROUND FLOOR - 24 TENNIS COURTS
                    ================================

Row 0 (z=-40m):  HARD COURTS (Indices 0-5)
┌────────┬────────┬────────┬────────┬────────┬────────┐
│ HARD 0 │ HARD 1 │ HARD 2 │ HARD 3 │ HARD 4 │ HARD 5 │
│  Blue  │  Blue  │  Blue  │  Blue  │  Blue  │  Blue  │
└────────┴────────┴────────┴────────┴────────┴────────┘

Row 1 (z=-14m):  CLAY COURTS (Indices 6-11) ✨ Enhanced
┌────────┬────────┬────────┬────────┬────────┬────────┐
│ CLAY 6 │ CLAY 7 │ CLAY 8 │ CLAY 9 │CLAY 10 │CLAY 11 │
│ Orange │ Orange │ Orange │ Orange │ Orange │ Orange │
│ 🎨 ClayCourtEffect Component                        │
└────────┴────────┴────────┴────────┴────────┴────────┘

Row 2 (z=12m):   GRASS COURTS (Indices 12-17) 🌱 NEW!
┌────────┬────────┬────────┬────────┬────────┬────────┐
│GRASS12 │GRASS13 │GRASS14 │GRASS15 │GRASS16 │GRASS17 │
│  Green │  Green │  Green │  Green │  Green │  Green │
│ 🌿 Grass Component (1500 blades each)              │
└────────┴────────┴────────┴────────┴────────┴────────┘

Row 3 (z=38m):   WOOD COURTS (Indices 18-23)
┌────────┬────────┬────────┬────────┬────────┬────────┐
│WOOD 18 │WOOD 19 │WOOD 20 │WOOD 21 │WOOD 22 │WOOD 23 │
│  Brown │  Brown │  Brown │  Brown │  Brown │  Brown │
└────────┴────────┴────────┴────────┴────────┴────────┘

     X: -35    -21     -7      7      21     35 (meters)
```

## Court Specifications

### Row 2: Grass Courts (RESTORED ✅)

**Court Indices**: 12, 13, 14, 15, 16, 17

**Positions**:
- Court 12: [-35, 0.1, 12]
- Court 13: [-21, 0.1, 12]
- Court 14: [-7, 0.1, 12]
- Court 15: [7, 0.1, 12]
- Court 16: [21, 0.1, 12]
- Court 17: [35, 0.1, 12]

**Surface Rendering**:
- Base plane: Green (#4d7c0f) 10m × 22m
- Grass blades: 1500 instances per court
- Animation: Wind sway enabled
- Total grass instances: 9000 across all 6 courts

**Visual Features**:
- Individual blade positioning
- Color variation (darker/lighter greens)
- Height variation (0.8m-1.2m)
- Subtle wind animation
- Natural random distribution

## Performance Metrics

**Per Grass Court**:
- Geometry: Instanced mesh (single draw call)
- Instances: 1500 grass blades
- Memory: ~114KB instance data
- Animation: Real-time wind sway

**Total (6 Grass Courts)**:
- Total instances: 9000
- Total memory: ~684KB
- Draw calls: 6 (one per court)
- Target FPS: 60 (maintained)

## Code Assignment Logic

```typescript
for(let i=0; i<24; i++) {
    let type: 'hard' | 'clay' | 'grass' | 'wood' = 'hard';
    if (i >= 6 && i < 12) type = 'clay';   // Courts 6-11
    if (i >= 12 && i < 18) type = 'grass'; // Courts 12-17 ✅
    if (i >= 18) type = 'wood';            // Courts 18-23

    const row = Math.floor(i / 6);
    const col = i % 6;

    courts.push(
        <TennisCourt
            key={i}
            type={type}
            position={[-35 + col * 14, 0.1, -40 + row * 26]}
        />
    );
}
```

## Implementation Status

| Surface Type | Courts | Enhancement | Status |
|-------------|--------|-------------|--------|
| Hard        | 0-5    | Texture mapping | ✅ Active |
| Clay        | 6-11   | ClayCourtEffect | ✅ Active |
| **Grass**   | **12-17** | **Grass Component** | **✅ RESTORED** |
| Wood        | 18-23  | Texture mapping | ✅ Active |

## Related Components

- `/components/Grass.tsx` - Grass rendering component
- `/components/ClayCourtEffect.tsx` - Clay court enhancement
- `/src/utils/courtTextures.ts` - Texture configuration
- `/components/ThreeScene.tsx` - Main scene integration
