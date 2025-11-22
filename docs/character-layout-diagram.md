# Character System Layout Diagram

## Facility Top-Down View with Character Distribution

```
                          NORTH (-60m Z)
                               ↑

    ┌──────────────────────────────────────────────────┐
    │  BLEACHER                              BLEACHER  │
    │  [spectators]                      [spectators]  │
    ├──────────────────────────────────────────────────┤
    │                                                  │
    │  🏸🏸  HARD COURTS (0-5)  🏸🏸                    │
    │  👤👤  (Players Z: -40m)  👤👤                    │
    │  🎾  🎾  🎾  🎾  🎾  🎾                           │
    │                                                  │
    │  📋 (Coach)              📋 (Coach)              │
    │                                                  │
WEST ├──────────────────────────────────────────────────┤ EAST
(-70) │  🏸🏸  CLAY COURTS (6-11)  🏸🏸                  │ (+70)
    │  👤👤  (Players Z: -14m)   👤👤                   │
    │  🎾  🎾  🎾  🎾  🎾  🎾                           │
    │                                                  │
 B  │  📋 (Coach)              📋 (Coach)              │  B
 L  ├──────────────────────────────────────────────────┤  L
 E  │  🏸🏸  GRASS COURTS (12-17)  🏸🏸                 │  E
 A  │  👤👤  (Players Z: +12m)     👤👤                 │  A
 C  │  🎾  🎾  🎾  🎾  🎾  🎾                           │  C
 H  │                                                  │  H
 E  │  📋 (Coach)              📋 (Coach)              │  E
 R  ├──────────────────────────────────────────────────┤  R
    │  🏸🏸  WOOD COURTS (18-23)  🏸🏸                  │
    │  👤👤  (Players Z: +38m)     👤👤                 │
    │  🎾  🎾  🎾  🎾  🎾  🎾                           │
    │                                                  │
    │  📋 (Coach)              📋 (Coach)              │
    ├──────────────────────────────────────────────────┤
    │                  RECEPTION AREA                  │
    │         🚶 🚶 🚶 (Visitors)  🚶                  │
    │              🧑‍💼 (Staff)                           │
    │  BLEACHER                              BLEACHER  │
    │  [spectators]                      [spectators]  │
    └──────────────────────────────────────────────────┘

                          SOUTH (+60m Z)
                               ↓

    Legend:
    👤 = Tennis Player (Blue)
    📋 = Coach (Amber)
    🚶 = Visitor (Green)
    🧑‍💼 = Staff (Indigo)
    🎾 = Court Center
    🏸 = Court Boundary
    [spectators] = Bleacher Section (Purple)
```

## Court Grid Layout (24 Courts)

```
         Col 0    Col 1    Col 2    Col 3    Col 4    Col 5
        ┌──────┬──────┬──────┬──────┬──────┬──────┐
Row 0   │  0   │  1   │  2   │  3   │  4   │  5   │  HARD
(Z:-40) │ 🎾🎾 │ 🎾🎾 │ 🎾🎾 │ 🎾🎾 │ 🎾🎾 │ 🎾🎾 │  (#3b82f6)
        ├──────┼──────┼──────┼──────┼──────┼──────┤
Row 1   │  6   │  7   │  8   │  9   │  10  │  11  │  CLAY
(Z:-14) │ 🎾🎾 │ 🎾🎾 │ 🎾🎾 │ 🎾🎾 │ 🎾🎾 │ 🎾🎾 │  (#ea580c)
        ├──────┼──────┼──────┼──────┼──────┼──────┤
Row 2   │  12  │  13  │  14  │  15  │  16  │  17  │  GRASS
(Z:+12) │ 🎾🎾 │ 🎾🎾 │ 🎾🎾 │ 🎾🎾 │ 🎾🎾 │ 🎾🎾 │  (#4d7c0f)
        ├──────┼──────┼──────┼──────┼──────┼──────┤
Row 3   │  18  │  19  │  20  │  21  │  22  │  23  │  WOOD
(Z:+38) │ 🎾🎾 │ 🎾🎾 │ 🎾🎾 │ 🎾🎾 │ 🎾🎾 │ 🎾🎾 │  (#d4a373)
        └──────┴──────┴──────┴──────┴──────┴──────┘
        X:-35  X:-21  X:-7   X:+7   X:+21  X:+35

    Each court: 10m (width) × 22m (length)
    Court spacing: 14m center-to-center (X-axis)
                   26m center-to-center (Z-axis)
```

## Character Distribution by Zone

### Court Areas (Players & Coaches)
```
Zone: Courts 0-5 (HARD)
├── Players: 12 (indices 0-11)
│   ├── Court 0: Player-0 (left), Player-1 (right)
│   ├── Court 1: Player-2 (left), Player-3 (right)
│   └── ... (pattern continues)
└── Coaches: 3 (coach-0, coach-1, coach-2)

Zone: Courts 6-11 (CLAY)
├── Players: 12 (indices 12-23)
└── Coaches: 3 (coach-3, coach-4, coach-5)

Zone: Courts 12-17 (GRASS)
├── Players: 12 (indices 24-35)
└── Coaches: 3 (coach-6, coach-7, coach-8)

Zone: Courts 18-23 (WOOD)
├── Players: 12 (indices 36-47)
└── Coaches: 3 (coach-9, coach-10, coach-11)
```

### Walkway Areas (Staff & Visitors)
```
Main Circulation Loop:
├── Staff: 8 total
│   ├── North walkway: 2
│   ├── East walkway: 2
│   ├── South walkway: 2
│   └── West walkway: 2
│
└── Visitors: 15 total
    ├── Random exploration
    └── Reception area congregation
```

### Bleacher Sections (Spectators)
```
Section 1 (North Center):     [0, 2, -60]  → 25 spectators
Section 2 (South Center):     [0, 2, 52]   → 25 spectators
Section 3 (West Clay):        [-55, 2, -14] → 25 spectators
Section 4 (West Grass):       [-55, 2, 12]  → 25 spectators
Section 5 (East Hard):        [55, 2, -40]  → 25 spectators
Section 6 (East Clay):        [55, 2, -14]  → 25 spectators
Section 7 (Northwest Corner): [-50, 2, -50] → 25 spectators
Section 8 (Northeast Corner): [50, 2, -50]  → 25 spectators
                                            ────────────────
                                    Total:  200 spectators
```

## Movement Patterns

### Player Movement (PLAYING State)
```
Court Baseline:
    ┌──────────────────────┐
    │ ←→ Player A          │  Oscillation: ±0.3m
    │                      │  Frequency: 2 Hz
    │ ─ ─ ─ ─ NET ─ ─ ─ ─ │
    │                      │
    │          Player B ←→ │  Oscillation: ±0.3m
    └──────────────────────┘  Frequency: 2 Hz
```

### Player Movement (WALKING State)
```
Path Example:
    Court → Waypoint1 → Waypoint2 → New Court
     🎾  ──→  🚶  ──→  🚶  ──→  🎾

    With random offset:
    🎾  ──→ 🚶 ──→ 🚶 ──→ 🎾
            ↓      ↓
        (±2m)  (±2m)
```

### Coach Movement (PATROL Pattern)
```
Coach Zone (2 courts):
    Court A ←────→ Center ←────→ Court B
      🎾              📋              🎾

    State cycle:
    COACHING (10s) → WALKING → IDLE (3s) → WALKING → COACHING
```

### Staff Patrol Routes
```
Rectangular Loop:
    ┌─────────────────────────────┐
    │ Start                       │
    │  ↓                          ↑
    │  → → → → → → → → → → → → → ┘
    │                            ↑
    └ ← ← ← ← ← ← ← ← ← ← ← ← ← ┘

    Waypoints: 4-6 per loop
    Duration: 60-90 seconds per cycle
```

### Visitor Random Walk
```
Random Exploration:
          Reception
             ↓
         🚶  ┌─┐
            │ │ │  Random
         ↙  │ │ │  waypoint
      🚶    │ │ │  selection
         ↘  │ │ │
         🚶  └─┘
             ↑
          Return
```

## State Distribution (Typical Snapshot)

```
At any given moment (estimated):

PLAYING:   30-35 players  (60-70% of players)
WALKING:   10-15 players  (20-30%)
IDLE:      3-8 players    (6-15%)

COACHING:  6-8 coaches    (50-65% of coaches)
WALKING:   3-5 coaches    (25-40%)
IDLE:      1-2 coaches    (8-15%)

WALKING:   6-7 staff      (75-85% of staff)
IDLE:      1-2 staff      (15-25%)

WALKING:   10-12 visitors (65-80% of visitors)
IDLE:      3-5 visitors   (20-35%)

WATCHING:  200 spectators (100% static)
```

## Interaction Zones

### Hover Interaction Areas
```
Character Hitbox (radius):
    ┌─────────┐
    │    🎾   │  Hover radius: 0.5m
    │   ╱ ╲   │  Click radius: 0.5m
    │  /   \  │
    └─────────┘

Tooltip Display:
    ┌──────────────────┐
    │ 🎾 PLAYER - playing │
    └──────────────────┘
         ↑ (above character)
```

### Selection UI Position
```
Scene Layout:

         ┌─────────────────────────┐
         │  Character Info Panel   │ ← Y: +50m (above scene)
         │  ─────────────────────  │
         │  ID: player-12          │
         │  Type: player           │
         │  State: playing         │
         │  Court: 6               │
         └─────────────────────────┘
                    ↓
    ─────────────────────────────────
                  Scene
    ─────────────────────────────────
```

## Performance Heat Map

```
Character Density (per 10m²):

    Low (0-2):     [░░]
    Medium (3-5):  [▒▒]
    High (6-10):   [▓▓]
    Very High (11+): [██]

    ┌──────────────────────────────┐
    │ ░░  ██  ██  ██  ██  ██  ░░  │  Hard courts
    │                              │
    │ ░░  ██  ██  ██  ██  ██  ░░  │  Clay courts
    │                              │
    │ ░░  ██  ██  ██  ██  ██  ░░  │  Grass courts
    │                              │
    │ ░░  ██  ██  ██  ██  ██  ░░  │  Wood courts
    │                              │
    │ ░░  ▒▒  ▒▒  ▒▒  ▒▒  ▒▒  ░░  │  Walkways
    │                              │
    │ ████      Reception      ████│  High density
    └──────────────────────────────┘
```

## Coordinate Reference

### World Space Origin (0, 0, 0)
```
           Y (UP)
           ↑
           │
           │
           └────→ X (EAST)
          ╱
         ╱
        Z (SOUTH)
```

### Key Coordinates
```
Court Grid Center:     [0, 0, 0]
Building Center:       [0, 40, 0] (Y: vertical floors)
Reception Entrance:    [0, 0, 57.5]
Parking Lot:          [-100, 0, -20]
Outdoor Courts:       [90, 0, 50]

Bleacher Elevation:    Y = 2m (above ground)
Player Height:         Y = 1.4m (body) + 0.25m (head)
```

## Character Scale Reference

```
Human Proportions:

       ●  ← Head (0.25m radius sphere)
      /|\
     / | \ ← Body (0.3m radius × 1.4m height capsule)
    /  |  \
   │   |   │
   │   |   │
   │   |   │
  ──  ─┴─  ── ← Shadow (0.4m radius)

Equipment:
  Racket: 0.8m length × 0.02m diameter cylinder
  Position: +0.4m X offset, 0.8m Y height
  Rotation: 45° during play
```

## Summary Statistics

```
Total Characters: 283
├── Active (animated): 83
│   ├── Players: 48 (57.8%)
│   ├── Coaches: 12 (14.5%)
│   ├── Staff: 8 (9.6%)
│   └── Visitors: 15 (18.1%)
└── Static (crowd): 200 spectators

Activity Distribution:
├── On Courts: 48 players + 12 coaches = 60
├── In Walkways: 8 staff + 15 visitors = 23
└── In Bleachers: 200 spectators

Area Coverage:
├── Court Area: 140m × 120m = 16,800 m²
├── Character Density: 283 / 16,800 = 0.017 per m²
└── Realistic Population: ✓ (typical facility capacity)
```
