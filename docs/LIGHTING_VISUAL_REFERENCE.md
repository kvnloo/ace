# Lighting System Visual Reference

## Stadium Floodlight Layout

```
Bird's Eye View of Building (140m × 120m)

                    NORTH
        F1    F2    F3    F4    F5
         ↓     ↓     ↓     ↓     ↓
    ╔═══════════════════════════════════╗
    ║                                   ║
 F16→                                   ←F6
WEST ║   [24 Tennis Courts Layout]     ║ EAST
 F15→                                   ←F7
    ║                                   ║
 F14→                                   ←F8
    ║                                   ║
    ╚═══════════════════════════════════╝
         ↑     ↑     ↑     ↑     ↑
        F13   F12   F11   F10   F9
                   SOUTH

Legend:
F1-F16: Floodlight positions (25m height)
→ ←: Light direction (60° cone angle)
╔═╗: Building perimeter
```

## Court Spotlight Distribution

```
Single Tennis Court (10m × 22m) - 4 Spotlights

         L1 ────────────── L2
          ↘              ↙
           │            │
           │            │
           │   COURT    │  12m height
           │            │  18m distance
           │            │  45° angle
          ↗              ↖
         L3 ────────────── L4

24 Courts × 4 Lights = 96 Court Spotlights

Court Grid Layout (6 × 4):

┌────┬────┬────┬────┬────┬────┐
│ HC │ HC │ HC │ HC │ HC │ HC │  HARD (6)
├────┼────┼────┼────┼────┼────┤
│ CL │ CL │ CL │ CL │ CL │ CL │  CLAY (6)
├────┼────┼────┼────┼────┼────┤
│ GR │ GR │ GR │ GR │ GR │ GR │  GRASS (6)
├────┼────┼────┼────┼────┼────┤
│ WD │ WD │ WD │ WD │ WD │ WD │  WOOD (6)
└────┴────┴────┴────┴────┴────┘

Each cell = 4 spotlights
```

## Ambient Light Distribution

```
Multi-Level Lighting (Side View)

LEVEL 3 (60m) ●─────●─────●─────●─────●─────●─────●
              │     │     │     │     │     │     │
              │ VERTICAL GRASS LAB (4 sectors)    │
              │                                     │

LEVEL 2 (40m) ●─────●─────●─────●─────●─────●─────●
              │     │     │     │     │     │     │
              │ PICKLEBALL + REAL TENNIS            │
              │                                     │

LEVEL 1 (20m) ●─────●─────●─────●─────●─────●─────●
              │     │     │     │     │     │     │
              │ BADMINTON + SQUASH + TABLE TENNIS  │
              │                                     │

GROUND (0m)   ●───────────────────────────────────●
              │                                     │
              │  24 TENNIS COURTS + RECEPTION       │
              │                                     │
              ●═════════════════════════════════════●

● = Ambient point light (15m radius)
Level height = 20m spacing
```

## Lighting Intensity Map

```
Day Mode - Top View

High Intensity ████  Medium ▓▓▓▓  Low ░░░░

           BUILDING PERIMETER
    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
    ▓▓                          ▓▓
    ▓▓   ████  ████  ████       ▓▓
    ▓▓   ████  ████  ████       ▓▓  HARD
    ▓▓                          ▓▓
    ▓▓   ████  ████  ████       ▓▓
    ▓▓   ████  ████  ████       ▓▓  CLAY
    ▓▓                          ▓▓
    ▓▓   ████  ████  ████       ▓▓
    ▓▓   ████  ████  ████       ▓▓  GRASS
    ▓▓                          ▓▓
    ▓▓   ████  ████  ████       ▓▓
    ▓▓   ████  ████  ████       ▓▓  WOOD
    ▓▓                          ▓▓
    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

Sun Position: Overhead (Y=150m)
Ambient: 0.6 intensity
```

```
Night Mode - Top View

High Intensity ████  Medium ▓▓▓▓  Low ░░░░

           FLOODLIGHT COVERAGE
    ████████████████████████████████
    ████░░                  ░░██████
    ████░░  ████  ████  ████░░██████
    ████░░  ████  ████  ████░░██████  HARD
    ████░░                  ░░██████
    ████░░  ████  ████  ████░░██████
    ████░░  ████  ████  ████░░██████  CLAY
    ████░░                  ░░██████
    ████░░  ████  ████  ████░░██████
    ████░░  ████  ████  ████░░██████  GRASS
    ████░░                  ░░██████
    ████░░  ████  ████  ████░░██████
    ████░░  ████  ████  ████░░██████  WOOD
    ████░░                  ░░██████
    ████████████████████████████████

Floodlights: Perimeter (16 spots)
Court Lights: Individual courts (96 spots)
Ambient: 0.2 intensity
```

## Light Cone Visualization

```
Floodlight Beam Pattern (Side View)

     FIXTURE (25m height)
           ║
           ║ Support Pole
           ╚═╗
              ╲
               ╲ 60° cone
                ╲
                 ╲
                  ╲  80m distance
                   ╲
                    ╲
                     ╲
══════════════════════╲════════ Ground
                       ▓▓▓▓▓
                    (Coverage)

Penumbra: 30% (soft edge)
Shadow: Yes (1024×1024 map)
```

```
Court Spotlight Pattern (Side View)

     FIXTURE (12m height)
           ║
           ╚═╗
              ╲
               ╲ 45° cone
                ╲
                 ╲  18m distance
                  ╲
═══════════════════╲═══════ Court Surface
                    ▓▓▓
                 (10m×22m)

Penumbra: 20% (soft edge)
Shadow: No (performance optimization)
```

## Shadow Map Coverage

```
Sun Shadow Cascade (High Quality)

    SUN POSITION
         ☀
        /│\
       / │ \
      /  │  \
     /   │   \
    /    │    \
   └─────┼─────┘
         │
    ╔════╧════╗  Shadow Camera (300m × 300m)
    ║▓▓▓▓▓▓▓▓▓║  2048×2048 shadow map
    ║▓▓SCENE▓▓║  Covers entire facility
    ║▓▓▓▓▓▓▓▓▓║  Dynamic cascade splitting
    ╚═════════╝

Shadow Properties:
- Bias: -0.0005
- Near: 0.1m
- Far: 500m
- Type: PCF Soft Shadows
```

```
Floodlight Shadow Coverage (Each Fixture)

    FLOODLIGHT
         ║
         ╚═╗
           ▼ 60° cone
    ╔════════════╗
    ║▓▓▓▓▓▓▓▓▓▓▓▓║  1024×1024 shadow map
    ║▓▓▓▓▓▓▓▓▓▓▓▓║  80m distance
    ║▓▓▓▓▓▓▓▓▓▓▓▓║  Local coverage
    ╚════════════╝

16 fixtures × 1024² = 16MB shadow memory
```

## Atmospheric Effects

```
Fog Density Visualization (Side View)

Sky ░░░░░░░░░░░░░░░░░░░░░░░░░░ (Thin fog)
    ░░░░░░░░░░░░░░░░░░░░░░░░
    ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒    (Medium fog)
    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓    (Dense fog)
════════════════════════════════ Ground

Exponential Fog (FogExp2)
- Dawn: 0.002 density
- Day: 0.0008 density
- Dusk: 0.0015 density
- Night: 0.001 density

User adjustable: 0 to 0.005
```

## Bloom Effect Zones

```
Bloom Coverage (Top View)

No Bloom ░░  Light Bloom ▒▒  Heavy Bloom ████

           NIGHT EVENT MODE
    ████████████████████████████████
    ████░░                  ░░██████
    ████░░  ▒▒▒▒  ▒▒▒▒  ▒▒▒▒░░██████
    ████░░  ▒▒▒▒  ▒▒▒▒  ▒▒▒▒░░██████
    ████░░                  ░░██████
    ████░░  ▒▒▒▒  ▒▒▒▒  ▒▒▒▒░░██████
    ████░░  ▒▒▒▒  ▒▒▒▒  ▒▒▒▒░░██████
    ████░░                  ░░██████
    ████████████████████████████████

████ = Floodlights (heavy bloom)
▒▒▒▒ = Court lights (light bloom)
░░░░ = Ambient areas (no bloom)

Bloom Threshold: 0.6 luminance
Bloom Strength: 0 to 2.0 (user adjustable)
```

## Time of Day Progression

```
Sun Path Diagram

           DAY (2.5 intensity)
              ☀ (Y=150)
             ╱│╲
            ╱ │ ╲
           ╱  │  ╲
DAWN      ╱   │   ╲      DUSK
(1.2) ☀──────┼──────☀ (1.0)
(Y=50) ╲     │     ╱ (Y=40)
        ╲    │    ╱
         ╲   │   ╱
          ╲  │  ╱
           ╲ │ ╱
            ╲│╱
          NIGHT
        ☾ (0.3, Y=200)

Color Temperature:
Dawn:  #ffaa88 (warm orange)
Day:   #ffffff (white)
Dusk:  #ff8866 (red-orange)
Night: #6b8ccc (cool blue)
```

## Lighting Mode Comparison

```
                NATURAL    SPORTS    EVENT    MAINTENANCE

Floodlights    ░░░░░░     ████      ████     ░░░░░░
Court Lights   ░░░░░░     ████      ████     ████
Ambient        ░░░░░░     ▒▒▒▒      ▒▒▒▒     ████
Bloom          None       0.5       2.0      0
Fog            0.0008     0.001     0.003    0
Shadows        High       High      High     Medium

Legend:
░░░░ = Disabled
▒▒▒▒ = Moderate
████ = Full intensity
```

## Quality Level Impact

```
Shadow Resolution Comparison

    ULTRA (2048×2048)    HIGH (1024×1024)
    ┌──────────────┐     ┌──────────────┐
    │▓▓▓▓▓▓▓▓▓▓▓▓▓▓│     │▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
    │▓▓▓▓▓▓▓▓▓▓▓▓▓▓│     │▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
    │▓▓Sharp Edge▓▓│     │▓▓Good Edge▓▓▓│
    │▓▓▓▓▓▓▓▓▓▓▓▓▓▓│     │▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
    └──────────────┘     └──────────────┘

   MEDIUM (512×512)      LOW (256×256)
    ┌──────────────┐     ┌──────────────┐
    │▓▓▓▓▓▓▓▓▓▓▓▓▓▓│     │▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
    │▓▓▓▓▓▓▓▓▓▓▓▓▓▓│     │▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
    │▓▓Soft Edge▓▓▓│     │▓▓▓Rough▓▓▓▓▓▓│
    │▓▓▓▓▓▓▓▓▓▓▓▓▓▓│     │▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
    └──────────────┘     └──────────────┘
```

## Light Fixture Models

```
Floodlight Fixture (3D Representation)

    ┌─────┐
    │ ╱█╲ │  Housing (cylindrical)
    │╱███╲│  0.5m diameter
    └─────┘  Metalness: 0.8
       ║     Roughness: 0.2
       ║
       ║     Support Pole
       ║     0.15m diameter
       ║     4m length
       ║
    ═══════  Ground Mount

Dimensions:
- Housing: 0.3m × 1m cylinder
- Pole: 0.1m-0.15m tapered
- Total height: 25m (on building)
```

```
Court Spotlight (Simplified)

      ╱█╲   Fixture head
      ███   0.2m diameter
      ╲█╱
       ║    Mount arm
    ═══════ 12m pole height

Dimensions:
- Fixture: 0.15m × 0.5m
- Simple geometry (low poly)
- No shadow casting
```

## Color Temperature Scale

```
Time of Day Color Progression

Dawn    ██████░░░░░░░░░░  Warm (2700K equiv)
        #ffaa88

Day     ░░░░░░██████░░░░  Neutral (5500K equiv)
        #ffffff

Dusk    ████████░░░░░░░░  Warm-Red (2500K equiv)
        #ff8866

Night   ░░░░░░░░░░██████  Cool Blue (6500K equiv)
        #6b8ccc

Legend:
████ = Dominant color
░░░░ = Secondary tones
```

## Performance Budget Visualization

```
Light Count by Category

Court Spotlights    ████████████████████████ 96 (65%)
Floodlights         ███████ 16 (11%)
Ambient Lights      ████████████ 32 (22%)
Celestial           ██ 2 (1%)
                    └────────────────────────┘
                    0        50       100    146

Memory Usage (Shadow Maps)

Sun Shadow          ████████ 4MB (20%)
Floodlight Shadows  ████████████████ 16MB (80%)
                    └────────────────────────┘
                    0        10       20    20MB
```

## Light Activation Matrix

```
Mode vs. Time Matrix (Light Activation)

              Dawn    Day     Dusk    Night
Natural       Sun     Sun     Sun     Moon
Sports        Sun+C   Sun+C   Sun+CF  Moon+CF
Event         Sun+CF  Sun+CF  Sun+CF  Moon+CF
Maintenance   Sun+CA  Sun+CA  Sun+CA  Moon+CA

Legend:
Sun/Moon = Celestial light only
+C = Court lights enabled
+F = Floodlights enabled
+A = All ambient lights
```

## Coordinate System Reference

```
World Space Coordinates

         +Y (Up)
          │
          │
          │
          └────────── +X (East)
         ╱
        ╱
       ╱
      +Z (South)

Building Center: (0, 0, 0)
Building Bounds: X[-70, 70], Y[0, 80], Z[-60, 60]

Light Positions (examples):
- Floodlight North: (0, 25, -55)
- Court Center: (0, 0, 0)
- Reception: (0, 0, 48)
```

---

**Viewing Tips:**

1. These diagrams use ASCII art - view in monospace font
2. Symbols: ║═╔╗╚╝ for structure, ░▒▓█ for gradients
3. Coordinate system: Three.js right-handed Y-up
4. All measurements in meters unless specified
5. Light intensity values are relative (Three.js units)

**Navigation:**

- Main docs: `/docs/LIGHTING_SYSTEM.md`
- Integration: `/docs/LIGHTING_INTEGRATION_GUIDE.md`
- Component: `/components/LightingSystem.tsx`
- Tests: `/tests/LightingSystem.test.tsx`
