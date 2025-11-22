# Reception Area - Visual Integration Guide

## Aerial View Layout

```
                    NORTH (Front of Facility)
                            ↑
                            |
    ╔═══════════════════════════════════════════════════╗
    ║                                                   ║
    ║              TENNIS COURT ARENA                   ║
    ║           (24 Courts in 4 Rows)                   ║
    ║                                                   ║
WEST║  [-57.5,0,0]                    [57.5,0,0]      ║EAST
    ║  WOMEN'S                           MEN'S         ║
    ║  LOCKER                           LOCKER         ║
    ║  ROOM                             ROOM           ║
    ║  (15×25m)                         (15×25m)       ║
    ║                                                   ║
    ║           SPECTATOR SEATING (600 seats)          ║
    ║                                                   ║
    ╚═════════════════╦═══════════════╦═════════════════╝
                      ║               ║
                      ║  [0,0.1,-55]  ║
    ╔═════════════════╩═══════════════╩═════════════════╗
    ║                                                   ║
    ║         🚪  MAIN ENTRANCE DOORS  🚪               ║
    ║              (Double Glass)                       ║
    ║  ┌─────────┐                    ┌─────────────┐  ║
    ║  │ KIOSK 1 │   RECEPTION DESK   │  WAITING    │  ║
    ║  │ KIOSK 2 │    (Curved 12m)    │   AREA      │  ║
    ║  └─────────┘                    │  8 Seats    │  ║
    ║  ┌─────────┐                    └─────────────┘  ║
    ║  │REFRESH  │                                     ║
    ║  │BAR      │  🛍️  RETAIL DISPLAYS (×3)  🛍️       ║
    ║  └─────────┘                                     ║
    ║                                                   ║
    ║  📍WAYFIND         20m × 15m          📍WAYFIND  ║
    ║                                                   ║
    ╚═══════════════════════════════════════════════════╝
                            |
                            ↓
                    SOUTH (Main Entrance)
              CONNECTION TO OUTDOOR PLAZA
```

## Component Positioning Map

### Reception Floor Local Coordinates
Origin at [0, 0.1, -55] in facility space

```
        -10m                 0m                 +10m
    ────────────────────────────────────────────────
-7m │        🚪 ENTRANCE DOORS 🚪                   │
    │    Frame: 5m × 4.2m | Sign: "MAIN ENTRANCE"  │
    ────────────────────────────────────────────────
-4m │   [Floor Mat: 12m × 6m carpet]               │
    │                                               │
-2m │  💻    💻              💺  💺                  │
    │ KIOSK KIOSK          BENCH BENCH             │
    │  #1    #2            (4×2 seats)             │
    │ [-7,0] [-4.5]         [6,0,-2] [6,0,1]       │
 0m │                                               │
    │  ☕              ⌨️ RECEPTION  ⌨️              │
    │ BAR              DESK (12.5m)                 │
    │[-8,0,0]          [0,0,2]                      │
    │                  3 Workstations               │
 2m │                  "WELCOME TO ACE"             │
    │                  Sign at 3m                   │
    │                                               │
 5m │  📍              🔺 COFFEE TABLE 🔺         📍│
    │ WAYFIND          [1.5,0.25,1.5]         WAYFIND│
    │[-9,0,5]                                  [9,0,5]│
    │                                               │
 6m │         🛍️        🛍️        🛍️              │
    │       RETAIL   RETAIL   RETAIL                │
    │       [-5,0,6]  [0,0,6]  [5,0,6]             │
    │                                               │
 7m │      "ACE PRO SHOP" Sign at 3.5m             │
    │                                               │
    ────────────────────────────────────────────────
```

## Elevation View (Side Profile)

```
8m  ┌─────────────────────────────────────┐ Ceiling
    │  💡  💡  💡  💡  💡  💡  (6 Lights) │
7m  │                                     │
    │                                     │
6m  │     "ACE PRO SHOP" (Floating)      │
    │                                     │
5m  │  "MAIN ENTRANCE" Sign (Floating)   │
    │                                     │
4m  │       Wayfinding                   │
    │       Display                       │
3.5m│       Screen                        │
    │                                     │
3m  │  "WELCOME TO ACE" (Floating)       │
    │                                     │
2m  │  ┌──────────────────┐              │
    │  │  Retail Display  │              │
1.5m│  │  Glass Top       │              │
    │  └──────────────────┘              │
1.2m│  ═══════════════════ Reception Desk│
    │                                     │
0.5m│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ Desk Base      │
0m  └─────────────────────────────────────┘ Floor
    [Polished Metallic Finish: #f1f5f9]
```

## Front View (Facing Reception Desk)

```
           OVERHEAD "WELCOME TO ACE" SIGN
                     (3m height)
    ┌──────────────────────────────────────────┐
    │                                          │
    │              ACE RECEPTION               │ 1.2m
    │  ═══════════════════════════════════════ │
    │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
    │  ⚡ YELLOW LED ACCENT STRIP (3m intensity) │
    │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
    │                                          │
    │   🖥️        🖥️        🖥️               │ Monitors
    │ Station1  Station2  Station3            │ (1.2m height)
    │                                          │
    │         12.5m Total Width                │
    └──────────────────────────────────────────┘
         Curved CatmullRom Form
```

## Material & Lighting Specifications

### Surface Materials
```
┌─────────────────────────┬──────────┬──────────┬─────────┐
│ Element                 │ Color    │ Rough    │ Metal   │
├─────────────────────────┼──────────┼──────────┼─────────┤
│ Floor                   │ #f1f5f9  │ 0.1      │ 0.8     │
│ Reception Desk          │ #1e293b  │ 0.3      │ 0.6     │
│ Desk Top                │ #0f172a  │ 0.15     │ 0.8     │
│ Kiosk Frame             │ #1e293b  │ 0.2      │ 0.8     │
│ Bench Frame             │ #1e293b  │ 0.6      │ 0.4     │
│ Bench Cushions          │ #DFFF4F  │ 0.7      │ 0.1     │
│ Retail Display Base     │ #1e293b  │ 0.3      │ 0.6     │
│ Glass (Display)         │ #f8fafc  │ 0.05     │ 0.1     │
│ Entry Doors             │ #1e293b  │ 0.05     │ 0.8     │
└─────────────────────────┴──────────┴──────────┴─────────┘

Transmission Values:
- Display Glass: 0.9 (90% see-through)
- Entry Doors: 0.6 (60% see-through)
```

### Lighting Map
```
    [-6,5,-4]  [0,5,-4]  [6,5,-4]
        💡        💡        💡      Ceiling Grid

    [-6,5,4]   [0,5,4]   [6,5,4]
        💡        💡        💡      (6 Point Lights)

    Properties per light:
    - Intensity: 8
    - Distance: 12m
    - Decay: 2
    - Color: #f8fafc (warm white)
    - Cast Shadow: true
```

### Accent Lighting
```
⚡ Reception LED Strip
   Position: [0, 0.3, -1.2]
   Color: #DFFF4F (Brand Yellow)
   Intensity: 3
   Distance: 8m

🔦 Entrance Sign Halo
   Position: [0, 5, 0.5] (above doors)
   Color: #DFFF4F
   Intensity: 15
   Distance: 8m

💚 Kiosk Status Lights
   Position: [0, 3.6, 0] (per kiosk)
   Color: #22c55e (Green when active)
   Intensity: 2
   Distance: 3m
```

## Interactive Zones

### Hover/Click Detection Areas
```
┌──────────────────────────────────────────────┐
│ 1. Reception Desk                            │
│    Event: onPointerOver/Out                  │
│    Response: Color → #DFFF4F                 │
│                                              │
│ 2. Check-in Kiosks (×2)                     │
│    Event: onPointerOver/Out                  │
│    Response: Screen activates, status light  │
│                                              │
│ 3. Wayfinding Displays (×2)                 │
│    Event: onPointerOver per level            │
│    Response: Level highlighting              │
│                                              │
│ 4. Court Labels (if enabled)                 │
│    Event: onPointerOver/Out                  │
│    Response: Scale 1.0 → 1.1                 │
└──────────────────────────────────────────────┘
```

## Visitor Flow Patterns

### Entry → Check-in Flow
```
    🚶 VISITOR ENTERS
         │
         ↓
    📍 WAYFINDING CHECK
    (Corner displays)
         │
    ┌────┴────┐
    │         │
    ↓         ↓
💻 KIOSK  👤 RECEPTION
(Members)  (Guests)
    │         │
    └────┬────┘
         ↓
    🎾 TO FACILITY
   (Courts/Amenities)
```

### Retail/Refreshment Flow
```
    🚶 VISITOR
         │
    ┌────┼────┐
    │    │    │
    ↓    ↓    ↓
   🛍️   ☕   💺
 SHOP  BAR  WAIT
    │    │    │
    └────┼────┘
         ↓
    🎾 TO FACILITY
```

## Dimensional CAD Overlay

When `showMeasurements={true}`:

```
                20m WIDTH
    ◄───────────────────────────────────►

    ┌───────────────────────────────────┐  ▲
    │                                   │  │
    │                                   │  │
    │         RECEPTION AREA            │  │ 15m
    │           (300m²)                 │  │ DEPTH
    │                                   │  │
    │                                   │  │
    └───────────────────────────────────┘  ▼

    Floor to Ceiling: 8m HEIGHT
```

HTML Dimension Labels appear at:
- Width: [0, 0.5, -8]
- Depth: [11.5, 0.5, 0]
- Height: [0, 4.5, 0]

## Zone Labels

When `showLabels={true}`:

```
HTML Overlay Positions:
┌─────────────────────────────────────────┐
│ 📍 RECEPTION DESK                       │ [0, 1.5, 2]
│ 🖥️ CHECK-IN KIOSKS                     │ [-7, 1.5, -2]
│ 💺 WAITING AREA                         │ [6, 1.5, 1.5]
│ 🛍️ RETAIL AREA                         │ [0, 2, 6]
└─────────────────────────────────────────┘

Style: bg-slate-900/90 backdrop-blur-md
       text-white border-white/20
       px-4 py-2 rounded-lg shadow-xl
```

## Integration with Facility Systems

### Connections to Main Building
```
RECEPTION AREA [0, 0.1, -55]
        │
        ├─ North → TENNIS COURTS (24 courts)
        │
        ├─ East → MEN'S LOCKER ROOM [57.5,0,0]
        │
        ├─ West → WOMEN'S LOCKER ROOM [-57.5,0,0]
        │
        ├─ Up → ELEVATOR ACCESS (not shown)
        │         └─ L1: Racquet Sports
        │         └─ L2: Pickleball
        │         └─ L3: Vertical Farm
        │
        └─ South → OUTDOOR PLAZA
                   └─ Parking Lot [-100,0.2,-20]
```

### Visual Sightlines
```
From Reception Desk:
- Direct view of entrance doors (security)
- Peripheral view of both kiosks
- Clear line to waiting area
- Cannot see courts (separation for focus)

From Waiting Area:
- View of retail displays
- View of refreshment bar
- Cannot see reception desk (privacy)
- Window view to plaza (natural light)
```

## Color Palette Summary

### Primary Colors
```
┌─────────────────┬───────────┬─────────────────────┐
│ Name            │ Hex       │ Usage               │
├─────────────────┼───────────┼─────────────────────┤
│ Brand Yellow    │ #DFFF4F   │ Accents, LED, Signs │
│ Dark Slate      │ #0f172a   │ Primary surfaces    │
│ Medium Slate    │ #1e293b   │ Furniture frames    │
│ Light Gray      │ #f1f5f9   │ Floor, ceiling      │
│ Glass Tint      │ #e0f2fe   │ Glass transparency  │
│ Active Blue     │ #3b82f6   │ Kiosk screens       │
│ Status Green    │ #22c55e   │ Available indicators│
└─────────────────┴───────────┴─────────────────────┘
```

---

**Integration Status**: ✅ Production Ready
**Last Updated**: 2025-11-22
**Coordinate System**: ACE Facility Global Space
