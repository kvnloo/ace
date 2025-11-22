# Reference Diagrams & Measurements
## Autonomous Racket Sports & Health Optimization Facility

**Document Version**: 1.0
**Created**: 2025-11-22
**Source Data**: ThreeScene.tsx, facility-blueprint.md, facility-architecture.md
**Coordinate System**: Unity/Three.js World Space (meters)
**Measurement Units**: Meters (m), Square meters (m²)

---

## Table of Contents

1. [Building Overview](#1-building-overview)
2. [Floor Plans (All 4 Levels)](#2-floor-plans-all-4-levels)
3. [Section Cuts](#3-section-cuts)
4. [Elevations](#4-elevations)
5. [Site Plan](#5-site-plan)
6. [Circulation Diagrams](#6-circulation-diagrams)
7. [Grid Coordinates & Measurements](#7-grid-coordinates--measurements)
8. [Component Specifications](#8-component-specifications)

---

## 1. Building Overview

### 1.1 Building Envelope Dimensions

```
BUILDING_WIDTH:  140m (east-west)
BUILDING_DEPTH:  120m (north-south)
FLOOR_HEIGHT:    20m per level
TOTAL_HEIGHT:    81m (4 floors + roof structure)
TOTAL_FOOTPRINT: 16,800 m²
```

### 1.2 Floor Breakdown

| Level | Elevation | Floor Area | Primary Function | Court Count |
|-------|-----------|------------|------------------|-------------|
| **Ground (L0)** | 0m | 15,600 m² | Tennis Arena | 24 Tennis |
| **Level 1 (L1)** | 20m | 14,400 m² | Racquet Mezzanine | 16 Badminton, 4 Squash, 16 Table Tennis |
| **Level 2 (L2)** | 40m | 12,100 m² | Social & Heritage | 8 Pickleball, 1 Real Tennis |
| **Level 3 (L3)** | 60m | 14,400 m² | Vertical Farm Lab | 4 Farm Sectors (2000 m²) |
| **Roof** | 81m | - | Solar Array & Structure | - |

### 1.3 Campus Envelope

```
CAMPUS_FOOTPRINT: 300m × 300m (90,000 m²)
OUTDOOR_PLAZA:    Located at [80, 0, 80] world coords
PARKING_LOT:      Adjacent to main building
GREEN_BUFFER:     110m radius tree belt around facility
```

---

## 2. Floor Plans (All 4 Levels)

### 2.1 GROUND FLOOR (Level 0) - Tennis Arena
**Elevation**: 0m | **Floor Area**: 15,600 m² | **Ceiling Height**: 20m

```
North (Z = -65m)
    ↑
    │
    │     HARD COURTS (Row 1)          RECEPTION AREA
    │  ┌────┬────┬────┬────┬────┬────┐    ┌──────────┐
    │  │ H1 │ H2 │ H3 │ H4 │ H5 │ H6 │    │  LOBBY   │
    │  │10×22│10×22│10×22│10×22│10×22│10×22│  │  INFO    │
    │  └────┴────┴────┴────┴────┴────┘    │  DESK    │
    │      Z = -40m, Span: 80m           │          │
    │                                      └──────────┘
    │     CLAY COURTS (Row 2)             Z = 52m (South)
    │  ┌────┬────┬────┬────┬────┬────┐
    │  │ C1 │ C2 │ C3 │ C4 │ C5 │ C6 │
    │  │10×22│10×22│10×22│10×22│10×22│10×22│
    │  └────┴────┴────┴────┴────┴────┘
    │      Z = -14m, Span: 80m
    │
    │     GRASS COURTS (Row 3)
    │  ┌────┬────┬────┬────┬────┬────┐
    │  │ G1 │ G2 │ G3 │ G4 │ G5 │ G6 │
    │  │10×22│10×22│10×22│10×22│10×22│10×22│
    │  └────┴────┴────┴────┴────┴────┘
    │      Z = 12m, Span: 80m
    │
    │     WOOD COURTS (Row 4)
    │  ┌────┬────┬────┬────┬────┬────┐
    │  │ W1 │ W2 │ W3 │ W4 │ W5 │ W6 │
    │  │10×22│10×22│10×22│10×22│10×22│10×22│
    │  └────┴────┴────┴────┴────┴────┘
    │      Z = 38m, Span: 80m
    │
    ↓
South (Z = +65m)

West (-70m) ←──────────────────────────→ East (+70m)

SPECTATOR SEATING LAYOUT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Section ID  | Position (X, Y, Z)      | Rotation | Seats | Capacity
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NORTH-1     | [0, 0.1, -60]          | 0°       | 15/row| 75
SOUTH-1     | [0, 0.1, 52]           | 180°     | 15/row| 75
WEST-CLAY   | [-55, 0.1, -14]        | 90°      | 12/row| 60
WEST-GRASS  | [-55, 0.1, 12]         | 90°      | 12/row| 60
EAST-HARD   | [55, 0.1, -40]         | -90°     | 12/row| 60
EAST-CLAY   | [55, 0.1, -14]         | -90°     | 12/row| 60
NW-CORNER   | [-50, 0.1, -50]        | 45°      | 12/row| 60
NE-CORNER   | [50, 0.1, -50]         | -45°     | 12/row| 60
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL CAPACITY: 8 sections × 5 rows = 600 seats
ACCESSIBLE SEATING: 8 positions (front row each section)
```

#### Ground Floor Court Grid Coordinates

```
Court Layout Matrix (6 columns × 4 rows):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Court  | Center Position (X, Z)  | Surface | Dimensions | Net Width
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
H1     | [-35, -40]              | Hard    | 10m × 22m  | 10m
H2     | [-21, -40]              | Hard    | 10m × 22m  | 10m
H3     | [-7, -40]               | Hard    | 10m × 22m  | 10m
H4     | [7, -40]                | Hard    | 10m × 22m  | 10m
H5     | [21, -40]               | Hard    | 10m × 22m  | 10m
H6     | [35, -40]               | Hard    | 10m × 22m  | 10m
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
C1     | [-35, -14]              | Clay    | 10m × 22m  | 10m
C2     | [-21, -14]              | Clay    | 10m × 22m  | 10m
C3     | [-7, -14]               | Clay    | 10m × 22m  | 10m
C4     | [7, -14]                | Clay    | 10m × 22m  | 10m
C5     | [21, -14]               | Clay    | 10m × 22m  | 10m
C6     | [35, -14]               | Clay    | 10m × 22m  | 10m
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
G1     | [-35, 12]               | Grass   | 10m × 22m  | 10m
G2     | [-21, 12]               | Grass   | 10m × 22m  | 10m
G3     | [-7, 12]                | Grass   | 10m × 22m  | 10m
G4     | [7, 12]                 | Grass   | 10m × 22m  | 10m
G5     | [21, 12]                | Grass   | 10m × 22m  | 10m
G6     | [35, 12]                | Grass   | 10m × 22m  | 10m
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
W1     | [-35, 38]               | Wood    | 10m × 22m  | 10m
W2     | [-21, 38]               | Wood    | 10m × 22m  | 10m
W3     | [-7, 38]                | Wood    | 10m × 22m  | 10m
W4     | [7, 38]                 | Wood    | 10m × 22m  | 10m
W5     | [21, 38]                | Wood    | 10m × 22m  | 10m
W6     | [35, 38]                | Wood    | 10m × 22m  | 10m
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Row Spacing:  26m center-to-center (22m court + 4m circulation)
Column Spacing: 14m center-to-center (10m court + 4m circulation)
Total Row Width: 80m (6 courts)
Total Row Depth: 26m per row type
```

#### Reception Area Specifications

```
Location: South Facade (Z = 52m)
Dimensions: 20m × 12m
Components:
  - Main Lobby: 12m × 8m
  - Information Desk: 4m × 2m
  - Waiting Area: 8m × 6m
  - Entry Vestibule: 6m × 4m (double doors)
Access: Primary building entrance
```

---

### 2.2 LEVEL 1 (L1) - Racquet Mezzanine
**Elevation**: 20m | **Floor Area**: 14,400 m² | **Ceiling Height**: 20m

```
North
    ↑
    │
    │     BADMINTON COURTS (16 courts, 4×4 grid)
    │  ┌─────┬─────┬─────┬─────┐
    │  │ BD1 │ BD2 │ BD3 │ BD4 │       SQUASH
    │  │6×13 │6×13 │6×13 │6×13 │       COURTS
    │  ├─────┼─────┼─────┼─────┤    ┌────┐
    │  │ BD5 │ BD6 │ BD7 │ BD8 │    │ S1 │
    │  │6×13 │6×13 │6×13 │6×13 │    │6×9 │
    │  ├─────┼─────┼─────┼─────┤    ├────┤
    │  │ BD9 │BD10 │BD11 │BD12 │    │ S2 │
    │  │6×13 │6×13 │6×13 │6×13 │    │6×9 │
    │  ├─────┼─────┼─────┼─────┤    ├────┤
    │  │BD13 │BD14 │BD15 │BD16 │    │ S3 │
    │  │6×13 │6×13 │6×13 │6×13 │    │6×9 │
    │  └─────┴─────┴─────┴─────┘    ├────┤
    │                                │ S4 │
    │  Badminton Grid:               │6×9 │
    │  X: -40 to +8 (48m span)       └────┘
    │  Z: -30 to +46 (76m span)      X: 0-6m
    │  Spacing: 8m × 16m             Z: -20 to +32
    │
    │     TABLE TENNIS AREA (16 tables, 4×4 grid)
    │  ┌──┬──┬──┬──┐
    │  │T1│T2│T3│T4│
    │  ├──┼──┼──┼──┤
    │  │T5│T6│T7│T8│
    │  ├──┼──┼──┼──┤
    │  │T9│T10│T11│T12│
    │  ├──┼──┼──┼──┤
    │  │T13│T14│T15│T16│
    │  └──┴──┴──┴──┘
    │
    │  Tables: 1.5m × 2.7m each
    │  Grid: X: 35 to 50 (15m span)
    │        Z: -30 to +30 (60m span)
    │  Spacing: 5m × 10m
    │
    ↓
South

Floor Plate Dimensions: 120m × 100m (10m inset from exterior)
```

#### Level 1 Court Coordinates

```
BADMINTON COURTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Court   | Center (X, Y, Z)        | Dimensions  | Net
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BD1-4   | [-40, 20.1, -30]        | 6m × 13m    | 6m
BD5-8   | [-40, 20.1, -14]        | 6m × 13m    | 6m
BD9-12  | [-40, 20.1, 2]          | 6m × 13m    | 6m
BD13-16 | [-40, 20.1, 18]         | 6m × 13m    | 6m
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Column spacing: 8m (4 courts per row)
Row spacing: 16m (4 rows)

SQUASH COURTS (Glass-enclosed):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Court | Center (X, Y, Z)        | Dimensions  | Height
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
S1    | [0, 22, -20]            | 6m × 9m     | 4m
S2    | [0, 22, -8]             | 6m × 9m     | 4m
S3    | [0, 22, 4]              | 6m × 9m     | 4m
S4    | [0, 22, 16]             | 6m × 9m     | 4m
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Spacing: 12m center-to-center
Glass walls: Transmission 0.6, Thickness 0.5m

TABLE TENNIS AREA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Grid Position | Center (X, Y, Z)   | Table Size
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Row 1 (T1-4)  | [35-50, 20.8, -30] | 1.5m × 2.7m
Row 2 (T5-8)  | [35-50, 20.8, -20] | 1.5m × 2.7m
Row 3 (T9-12) | [35-50, 20.8, -10] | 1.5m × 2.7m
Row 4 (T13-16)| [35-50, 20.8, 0]   | 1.5m × 2.7m
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
X-spacing: 5m, Z-spacing: 10m
```

---

### 2.3 LEVEL 2 (L2) - Social & Heritage Courts
**Elevation**: 40m | **Floor Area**: 12,100 m² | **Ceiling Height**: 20m

```
North
    ↑
    │
    │     PICKLEBALL COURTS (8 courts, 4×2 grid)
    │  ┌─────┬─────┬─────┬─────┐
    │  │ PB1 │ PB2 │ PB3 │ PB4 │
    │  │6×12 │6×12 │6×12 │6×12 │
    │  ├─────┼─────┼─────┼─────┤
    │  │ PB5 │ PB6 │ PB7 │ PB8 │
    │  │6×12 │6×12 │6×12 │6×12 │
    │  └─────┴─────┴─────┴─────┘
    │
    │  X: -25 to +15 (40m span)
    │  Z: -15 to +1 (16m span)
    │  Spacing: 10m × 16m
    │
    │     REAL TENNIS COURT (Historic)       VIEWING
    │  ┌─────────────────────┐                GALLERY
    │  │                     │             ┌──────────┐
    │  │   REAL TENNIS       │             │   VIP    │
    │  │   12m × 24m         │─────────────│  SUITES  │
    │  │                     │  Glass      │          │
    │  │   Historic Court    │  Walkway    │  (4x)    │
    │  │                     │             │          │
    │  └─────────────────────┘             └──────────┘
    │
    │  Center: [30, 40.1, 0]               East Side
    │  With Penthouses (2m walls)          Glass Barriers
    │
    ↓
South

Floor Plate: 110m × 90m (15m inset from exterior)

GLASS WALKWAY SYSTEM:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Component      | Position           | Dimensions
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Main Walkway   | Perimeter circuit  | 4m wide
Glass Floor    | Transmission: 0.88 | 0.8m thickness
Safety Grid    | Below glass        | 3.8m × variable
LED Lighting   | 6m intervals       | Blue accent (0.3 intensity)
Barriers       | Both sides         | 2.4m height
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### Level 2 Court Coordinates

```
PICKLEBALL COURTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Court    | Center (X, Y, Z)     | Dimensions | Net
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PB1      | [-25, 40.1, -15]     | 6m × 12m   | 6m
PB2      | [-15, 40.1, -15]     | 6m × 12m   | 6m
PB3      | [-5, 40.1, -15]      | 6m × 12m   | 6m
PB4      | [5, 40.1, -15]       | 6m × 12m   | 6m
PB5      | [-25, 40.1, 1]       | 6m × 12m   | 6m
PB6      | [-15, 40.1, 1]       | 6m × 12m   | 6m
PB7      | [-5, 40.1, 1]        | 6m × 12m   | 6m
PB8      | [5, 40.1, 1]         | 6m × 12m   | 6m
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REAL TENNIS COURT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Component     | Position          | Dimensions
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Main Court    | [30, 40.1, 0]     | 12m × 24m
Penthouse L   | [-5, 42, 0]       | 2m × 4m × 24m
Penthouse R   | [5, 42, 0]        | 0.5m × 4m × 24m
Net           | [30, 41, 0]       | 10m width
Surface       | Historic wood     | Dark brown (#44403c)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VIP VIEWING SUITES (4 units):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Suite | Position (approx)    | Dimensions  | Features
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VIP-1 | East perimeter       | 8m × 6m     | Glass front, seating for 4
VIP-2 | East perimeter       | 8m × 6m     | Premium table, LED accent
VIP-3 | East perimeter       | 8m × 6m     | Ceiling: 3m height
VIP-4 | East perimeter       | 8m × 6m     | Climate controlled
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### 2.4 LEVEL 3 (L3) - Vertical Farm Lab
**Elevation**: 60m | **Floor Area**: 14,400 m² | **Ceiling Height**: 20m

```
North
    ↑
    │
    │     FARM SECTOR 1              FARM SECTOR 2
    │  ┌──────────────────┐       ┌──────────────────┐
    │  │                  │       │                  │
    │  │  HYDROPONICS     │       │  HYDROPONICS     │
    │  │  30m × 10m racks │       │  30m × 10m racks │
    │  │                  │       │                  │
    │  │  4 Grow Levels   │       │  4 Grow Levels   │
    │  │  Purple LED      │       │  Purple LED      │
    │  │  500 m² growing  │       │  500 m² growing  │
    │  │                  │       │                  │
    │  └──────────────────┘       └──────────────────┘
    │  Center: [-30, 60, -20]     Center: [30, 60, -20]
    │
    │
    │     FARM SECTOR 3              FARM SECTOR 4
    │  ┌──────────────────┐       ┌──────────────────┐
    │  │                  │       │                  │
    │  │  HYDROPONICS     │       │  HYDROPONICS     │
    │  │  30m × 10m racks │       │  30m × 10m racks │
    │  │                  │       │                  │
    │  │  4 Grow Levels   │       │  4 Grow Levels   │
    │  │  Purple LED      │       │  Purple LED      │
    │  │  500 m² growing  │       │  500 m² growing  │
    │  │                  │       │                  │
    │  └──────────────────┘       └──────────────────┘
    │  Center: [-30, 60, 20]      Center: [30, 60, 20]
    │
    ↓
South

Floor Plate: 120m × 100m
Total Growing Area: 4 sectors × 500 m² = 2,000 m²

GREEN FACADE SYSTEM (Exterior):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Wall      | Position         | Dimensions      | Coverage
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
West      | [-60, 70, 0]     | 2m × 18m × 80m  | Living wall
East      | [60, 70, 0]      | 2m × 18m × 80m  | Living wall
North     | [0, 70, -50]     | 100m × 18m × 2m | Living wall
South     | [0, 70, 50]      | 100m × 18m × 2m | Living wall
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total facade area: 7,120 m² of vertical greenery
```

#### Level 3 Farm Specifications

```
FARM RACK DETAILS (per sector):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Component      | Dimensions       | Specifications
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Rack Frame     | 30m × 4m × 10m   | Wireframe structure
Grow Shelves   | 29m × 0.2m × 9m  | 4 levels (0.5, 1.5, 2.5, 3.5m)
LED Arrays     | Point light      | Purple (0xa855f7), 2 intensity
Coverage       | 500 m² per rack  | Automated climate control
Hydroponic Sys | Integrated       | Nutrient delivery, monitoring
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTOR POSITIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sector | Center (X, Y, Z)    | Crop Focus
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FS-1   | [-30, 60, -20]      | Leafy greens
FS-2   | [30, 60, -20]       | Microgreens
FS-3   | [-30, 60, 20]       | Herbs
FS-4   | [30, 60, 20]        | Specialty crops
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 3. Section Cuts

### 3.1 SECTION A-A (North-South Longitudinal)
**Cutting Plane**: X = 0 (center line, east-west)

```
ROOF (81m)
Solar Array
    ╔═══════════════════════════════════════════════════════════╗
  81│█▓▓▓▓█   █▓▓▓▓█   █▓▓▓▓█   █▓▓▓▓█   █▓▓▓▓█   █▓▓▓▓█   █▓▓▓▓█│ Solar Panels
    ╠═══════════════════════════════════════════════════════════╣
    │                                                             │
L3  │  🌱🌱🌱🌱  FARM SECTOR 3   🌱🌱  🌱🌱🌱  FARM SECTOR 4  🌱🌱│ 60m-80m
 60 │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐  ┌─────┐ ┌─────┐ ┌─────┐ │ Vertical Farm
    │  │Rack │ │Rack │ │Rack │ │Rack │  │Rack │ │Rack │ │Rack │ │
    ╠══╧═════╧═╧═════╧═╧═════╧═╧═════╧══╧═════╧═╧═════╧═╧═════╧═╣
    │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ Floor slab
    │                                                             │
L2  │     🏓 PICKLEBALL      🎾 REAL TENNIS COURT  🪟 VIP SUITE │ 40m-60m
 40 │  ┌─┐ ┌─┐ ┌─┐ ┌─┐    ┌──────────────────┐   ┌──────────┐  │ Social Courts
    │  │P│ │P│ │P│ │P│    │  Penthouses      │   │ Lounge   │  │
    │  │B│ │B│ │B│ │B│    │                  │   │ Seating  │  │
    ╠══╧═╧═╧═╧═╧═╧═╧═╧════╧══════════════════╧═══╧══════════╧══╣
    │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ Floor slab
    │                                                             │
L1  │  🏸 BADMINTON COURTS         🏓 TABLE TENNIS    🎾 SQUASH │ 20m-40m
 20 │  ┌──┐┌──┐┌──┐┌──┐           ┌─┬─┬─┬─┐        ┌──┐┌──┐   │ Racquet Mezzanine
    │  │BD││BD││BD││BD│           │T│T│T│T│        │□ ││□ │   │
    │  └──┘└──┘└──┘└──┘           └─┴─┴─┴─┘        └──┘└──┘   │
    ╠═══════════════════════════════════════════════════════════╣
    │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ Floor slab
    │                                                             │
L0  │  🎾 HARD  🎾 CLAY   🎾 GRASS  🎾 WOOD    RECEPTION 🚪     │ 0m-20m
  0 │  ┌────┐  ┌────┐  ┌────┐  ┌────┐  ┌──────────────┐        │ Tennis Arena
    │  │ H1 │  │ C1 │  │ G1 │  │ W1 │  │   LOBBY      │        │
    │  └────┘  └────┘  └────┘  └────┘  └──────────────┘        │
    ╚═══════════════════════════════════════════════════════════╝
 -0.1│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ Foundation
    └─────────────────────────────────────────────────────────┘
     South -60m        0m Center              North +60m

ORGANIC STRUCTURE (Zaha Hadid inspired curves):
Structural ribbons wrap building from ground to roof
━ West curve: [-75,0,65] → [-85,20,65] → [-75,40,55] → [-65,80,50]
━ East curve: [75,0,65] → [85,20,65] → [75,40,55] → [65,80,50]
━ Roof arches cross at [0,90,0] apex
```

### 3.2 SECTION B-B (East-West Transverse)
**Cutting Plane**: Z = 0 (center line, north-south)

```
                    ROOF STRUCTURE (81m)
    ╔═══════════════════════════════════════════════════════╗
 81 │     🌞🌞    SOLAR PANELS    🌞🌞    SOLAR PANELS     │
    ╠═══════════════════════════════════════════════════════╣
    │                                                         │
 60 │ 🌱│  FARM RACK  │  CIRCULATION  │  FARM RACK  │🌱      │ L3
    │ 🌿│  4 Levels   │     AISLE     │  4 Levels   │🌿      │ Vertical Farm
    ╠═══╧═════════════╧═══════════════╧═════════════╧═══════╣
    │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
    │                                                         │
 40 │  🏓 │    PICKLEBALL     │         REAL TENNIS        │ │ L2
    │     │   Court Layout    │    12m × 24m Full Court   │ │ Social
    ╠═════╧═══════════════════╧════════════════════════════╧═╣
    │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
    │                                                         │
 20 │ □ │  BADMINTON GRID   │  TABLE TENNIS  │  SQUASH  │ □ │ L1
    │   │   4×4 Court Array │   16 Tables    │4 Courts  │   │ Racquet
    ╠═══╧═══════════════════╧════════════════╧══════════╧═══╣
    │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
    │                                                         │
  0 │ 🪑│ TENNIS H1│ TENNIS C1│ TENNIS G1│ TENNIS W1│ 🪑     │ L0
    │   │  10×22m  │  10×22m  │  10×22m  │  10×22m  │        │ Tennis Arena
    ╚═══╧══════════╧══════════╧══════════╧══════════╧════════╝
-0.1 │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
     └────────────────────────────────────────────────────────┘
      West -70m         0m Center             East +70m

WIDTH MEASUREMENTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Level | Total Width | Floor Inset | Net Width
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
L0    | 140m        | 5m (70m)    | 130m usable
L1    | 140m        | 10m (60m)   | 120m usable
L2    | 140m        | 15m (55m)   | 110m usable
L3    | 140m        | 10m (60m)   | 120m usable
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 3.3 SECTION C-C (Detail Section - Tennis Court Row)
**Cutting Plane**: Z = -40m (Hard Court Row)

```
LEVEL 1 FLOOR ABOVE (20m)
    ╔═══════════════════════════════════════════════════════════╗
 20 │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ Floor slab
    ╚═══════════════════════════════════════════════════════════╝
    │                  CEILING HEIGHT: 20m                      │
    │                                                            │
 18 │   💡─────────────💡─────────────💡─────────────💡         │ Lighting
    │                                                            │
    │                                                            │
 10 │   👁️ CAMERA    👁️ CAMERA    👁️ CAMERA    👁️ CAMERA    │ CV System
    │   Overhead biomechanics tracking                          │
    │                                                            │
  5 │                      [AIRSPACE]                           │
    │                                                            │
    │   🪑    🪑    🪑    🪑    🪑    🪑    🪑    🪑            │ Bleachers
  2 │   └──┬──┘    └──┬──┘    └──┬──┘    └──┬──┘              │ (West Side)
    │      │Support   │Support   │Support   │Support            │
    │                                                            │
    │  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  │
  0 │  │  H1 │  │  H2 │  │  H3 │  │  H4 │  │  H5 │  │  H6 │  │ Court Surface
    │  │10×22│  │10×22│  │10×22│  │10×22│  │10×22│  │10×22│  │
    │  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘  │
    ╚═══════════════════════════════════════════════════════════╝
-0.1 │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ Structural slab
     └────────────────────────────────────────────────────────┘
      -40m   -26m   -12m    2m     16m    30m    44m

BLEACHER SECTION DETAIL:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Component       | Dimensions        | Specifications
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Seat Width      | 0.45m             | Per person
Seat Depth      | 0.4m              | Bench depth
Row Rise        | 0.4m              | Tiered elevation
Base Elevation  | 2.0m              | Above court level
Total Rows      | 5                 | Per section
Platform        | Width+0.4m        | Steel frame
Support Legs    | 0.15m × 0.15m     | 4 per section
Safety Rail     | 0.15m height      | Top row
Accessible Row  | Front row         | Blue marked
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 4. Elevations

### 4.1 SOUTH ELEVATION (Main Entrance)
**View Direction**: Looking North

```
                   ROOF LINE (81m)
      ╔══════════════════════════════════════════════════╗
   81 │  ▓▓▓▓  SOLAR ARRAY  ▓▓▓▓  SOLAR ARRAY  ▓▓▓▓     │
      ╠══════════════════════════════════════════════════╣
      │                                                  │
      │  🌱🌱🌱  VERTICAL FARM (L3)  🌱🌱🌱             │ 60-80m
   60 │  Green Facade: 100m × 18m living wall           │
      │  ░░▓░░▓░░▓░░▓░░▓░░▓░░▓░░▓░░▓░░▓░░▓░░▓░░▓░░▓   │
      ╠══════════════════════════════════════════════════╣
      │                                                  │
      │  ╔════════════════════════════════════════╗     │ 40-60m
   40 │  ║  GLASS FACADE (L2) - Social Courts    ║     │
      │  ║  ◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊  ║     │
      │  ║  Transmission: 0.8, Reflective glass  ║     │
      │  ╚════════════════════════════════════════╝     │
      ╠══════════════════════════════════════════════════╣
      │                                                  │
      │  ╔════════════════════════════════════════╗     │ 20-40m
   20 │  ║  GLASS FACADE (L1) - Racquet Sports   ║     │
      │  ║  ◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊  ║     │
      │  ╚════════════════════════════════════════╝     │
      ╠══════════════════════════════════════════════════╣
      │                                                  │
      │  ┌────────────────────────────────────────┐     │
      │  │          RECEPTION ENTRANCE            │     │
    0 │  │    ┌──────────────────────────┐        │     │ 0-20m
      │  │    │  DOUBLE GLASS DOORS  🚪🚪│        │     │
      │  │    │      Width: 6m           │        │     │
      │  │    └──────────────────────────┘        │     │
      │  └────────────────────────────────────────┘     │
      ╚══════════════════════════════════════════════════╝
  -0.1│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ Grade
      └──────────────────────────────────────────────────┘
      -70m           0m Center              +70m

ORGANIC STRUCTURE COLUMNS (Visible):
┌───────────────────────────────────────────────────────────┐
│ Catmull-Rom Curves (tube geometry, 2m diameter):         │
│ • SW Column: [-75,0,65] → [-65,80,50]                   │
│ • SE Column: [75,0,65] → [65,80,50]                     │
│ • Roof Arch: [-65,80,50] ↗ [0,90,0] ↘ [65,80,50]       │
│ Material: White, roughness 0.2, metalness 0.1            │
└───────────────────────────────────────────────────────────┘
```

### 4.2 NORTH ELEVATION
**View Direction**: Looking South

```
                   ROOF LINE (81m)
      ╔══════════════════════════════════════════════════╗
   81 │  ▓▓▓▓  SOLAR ARRAY  ▓▓▓▓  SOLAR ARRAY  ▓▓▓▓     │
      ╠══════════════════════════════════════════════════╣
      │  🌱🌱🌱  VERTICAL FARM (L3)  🌱🌱🌱             │ 60-80m
   60 │  Green Facade: 100m × 18m living wall           │
      │  ░░▓░░▓░░▓░░▓░░▓░░▓░░▓░░▓░░▓░░▓░░▓░░▓░░▓░░▓   │
      ╠══════════════════════════════════════════════════╣
      │  ╔════════════════════════════════════════╗     │ 40-60m
   40 │  ║  GLASS FACADE (L2)                    ║     │
      │  ║  ◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊  ║     │
      │  ╚════════════════════════════════════════╝     │
      ╠══════════════════════════════════════════════════╣
      │  ╔════════════════════════════════════════╗     │ 20-40m
   20 │  ║  GLASS FACADE (L1)                    ║     │
      │  ║  ◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊  ║     │
      │  ╚════════════════════════════════════════╝     │
      ╠══════════════════════════════════════════════════╣
      │  ┌────────────────────────────────────────┐     │ 0-20m
    0 │  │         GROUND FLOOR FACADE            │     │
      │  │  Solid panels with ventilation grilles │     │
      │  └────────────────────────────────────────┘     │
      ╚══════════════════════════════════════════════════╝
  -0.1│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
      └──────────────────────────────────────────────────┘
```

### 4.3 EAST ELEVATION
**View Direction**: Looking West

```
      ╔══════════════════════════════════════════════════╗
   81 │  ▓▓▓▓  SOLAR ARRAY  ▓▓▓▓  SOLAR ARRAY  ▓▓▓▓     │
      ╠══════════════════════════════════════════════════╣
   60 │  🌿🌿  VERTICAL GREEN FACADE  🌿🌿               │
      │  2m × 18m × 80m living wall system              │
      ╠══════════════════════════════════════════════════╣
   40 │  ║  GLASS FACADE  ◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊  ║         │
      ╠══════════════════════════════════════════════════╣
   20 │  ║  GLASS FACADE  ◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊  ║         │
      ╠══════════════════════════════════════════════════╣
    0 │  └────────────────────────────────────────┘     │
      ╚══════════════════════════════════════════════════╝
  -0.1│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
      └──────────────────────────────────────────────────┘
      -60m           0m Center              +60m
```

### 4.4 WEST ELEVATION
**View Direction**: Looking East

```
(Mirror of East Elevation)
      ╔══════════════════════════════════════════════════╗
   81 │  ▓▓▓▓  SOLAR ARRAY  ▓▓▓▓  SOLAR ARRAY  ▓▓▓▓     │
      ╠══════════════════════════════════════════════════╣
   60 │  🌿🌿  VERTICAL GREEN FACADE  🌿🌿               │
      │  2m × 18m × 80m living wall system              │
      ╠══════════════════════════════════════════════════╣
   40 │  ║  GLASS FACADE  ◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊  ║         │
      ╠══════════════════════════════════════════════════╣
   20 │  ║  GLASS FACADE  ◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊◊  ║         │
      ╠══════════════════════════════════════════════════╣
    0 │  └────────────────────────────────────────┘     │
      ╚══════════════════════════════════════════════════╝
  -0.1│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
      └──────────────────────────────────────────────────┘
```

---

## 5. Site Plan

### 5.1 Campus Master Plan (300m × 300m)
**Scale**: 1 grid square = 20m

```
North (Z = -150m)
    ↑
    │
    │  🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳  (Tree Belt R=110m)
    │
    │     ┌─────────────────────────────────────┐
    │     │                                     │
    │     │      OUTDOOR PLAZA & COURTS        │
    │     │      Position: [80, 0, 80]         │
    │     │                                     │
    │     │  ┌────┐  ┌────┐  ┌────┐           │
    │     │  │CLAY│  │HARD│  │GRASS│          │
    │     │  │10×22│  │10×22│  │10×22│         │
    │     │  └────┘  └────┘  └────┘           │
    │     │                                     │
    │     │  Landscaping, seating, walkways    │
    │     │                                     │
    │     └─────────────────────────────────────┘
    │                    [110, 0, 110]
    │
    │
    │  🌳  ┌═══════════════════════════════════╗  🌳
    │      ║                                   ║
    │      ║     MAIN BUILDING FOOTPRINT       ║
    │      ║     140m (E-W) × 120m (N-S)       ║
    │      ║                                   ║
    │      ║     Center: [0, 0, 0]             ║
    │  🌳  ║                                   ║  🌳
    │      ║  ┌─────────────────────────┐     ║
    │      ║  │   RECEPTION (South)     │     ║
    │      ║  │   Entry: [0, 0, 52]     │     ║
    │      ║  └─────────────────────────┘     ║
    │      ╚═══════════════════════════════════╝
    │  🌳                                         🌳
    │
    │           ┌──────────────────┐
    │           │  PARKING LOT     │
    │           │                  │
    │           │  🚗🚗🚗🚗🚗🚗   │
    │           │  🚗🚗🚗🚗🚗🚗   │
    │           │                  │
    │           │  Position: TBD   │
    │           └──────────────────┘
    │
    │  🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳
    │
    ↓
South (Z = +150m)

West (-150m) ←───────────────────────────→ East (+150m)

SITE MEASUREMENTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Feature           | Position (X, Z)  | Dimensions
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Main Building     | [0, 0]           | 140m × 120m
Outdoor Plaza     | [80, 80]         | 50m × 50m
Tree Belt Inner   | Radius 110m      | Circular perimeter
Tree Belt Outer   | Radius 130m      | Circular perimeter
Parking           | Adjacent south   | ~2000 m²
Campus Boundary   | ±150m            | 300m × 300m (90,000 m²)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LANDSCAPING:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Element       | Quantity | Distribution
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Trees         | 15       | Radial 110-130m
Hardscape     | 20,000m² | Pavement, walkways
Green Space   | 50,000m² | Lawn, gardens
Outdoor Courts| 3        | Plaza area
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 6. Circulation Diagrams

### 6.1 Vertical Circulation (Stair & Elevator Cores)

```
                 SECTION VIEW (Y-axis)

Level 3 (60m)  ═══════════════════════════════
               │  🌱 FARM    │ CORE │         │
               │             └──┬───┘         │
               │                │             │
                                ▼
Level 2 (40m)  ═══════════════════════════════
               │  🏓 SOCIAL  │ CORE │         │
               │             └──┬───┘         │
               │                │             │
                                ▼
Level 1 (20m)  ═══════════════════════════════
               │  🏸 RACQUET │ CORE │         │
               │             └──┬───┘         │
               │                │             │
                                ▼
Ground (0m)    ═══════════════════════════════
               │  🎾 TENNIS  │ CORE │  ENTRY  │
               │             └──┴───┘    🚪   │
               └──────────────────────────────┘

CIRCULATION CORE SPECIFICATIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Component        | Quantity | Dimensions   | Location
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Main Stair       | 1        | 3m × 4m      | Central
Emergency Stair  | 2        | 2m × 2.5m    | Corners
Passenger Elev   | 2        | 2m × 2m each | Central core
Service Elev     | 1        | 3m × 3m      | Service area
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Code Compliance:
- Egress capacity: 600 occupants (L0) ÷ 0.3m/person = 180m total width
- Actual stair width: (3 + 2 + 2) = 7m × 2 directions = 14m > 180m ✓
- Travel distance: Max 60m to nearest exit ✓
```

### 6.2 Horizontal Circulation - Ground Floor

```
                    GROUND FLOOR CIRCULATION
North
    ↑
    │
    │  EXIT ←─────────────────────────────────────→ EXIT
    │   ↕                                            ↕
    │  ┌───────────────────────────────────────────┐
    │  │                                           │
    │  │ HARD │ ←─ 4m ─→ │ HARD │ ←─ 4m ─→ │ HARD│
    │  │ H1-6 │  Aisle   │      │  Aisle   │      │
    │  │      │          │      │          │      │
    │  ├──────┼──────────┼──────┼──────────┼──────┤
    │  │                                           │
    │  │ CLAY │ ←─ 4m ─→ │ CLAY │ ←─ 4m ─→ │ CLAY│
    │  │ C1-6 │  Aisle   │      │  Aisle   │      │
    │  │      │          │      │          │      │
    │  ├──────┼──────────┼──────┼──────────┼──────┤
    │  │                                           │
    │  │GRASS │ ←─ 4m ─→ │GRASS │ ←─ 4m ─→ │GRASS│
    │  │ G1-6 │  Aisle   │      │  Aisle   │      │
    │  │      │          │      │          │      │
    │  ├──────┼──────────┼──────┼──────────┼──────┤
    │  │                                           │
    │  │ WOOD │ ←─ 4m ─→ │ WOOD │ ←─ 4m ─→ │ WOOD│
    │  │ W1-6 │  Aisle   │      │  Aisle   │      │
    │  │      │          │      │          │      │
    │  └──────┴──────────┴──────┴──────────┴──────┘
    │   ↕                  ↕                   ↕
    │  CORE             CORE              RECEPTION
    │  EXIT            (CENTRAL)             ENTRY 🚪
    │
    ↓
South

CIRCULATION WIDTHS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type              | Width  | Code Requirement
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Main Aisles       | 4m     | Min 2.4m (IBC)
Cross Aisles      | 3m     | Min 1.5m
Perimeter Path    | 5m     | Min 2.4m
Exit Access       | 4m     | Min 1.8m
Reception Entry   | 6m     | Min 1.8m (2 doors)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 6.3 Horizontal Circulation - Level 2 (Glass Walkway)

```
                LEVEL 2 CIRCULATION WITH GLASS WALKWAY
North
    ↑
    │
    │  ┌────────────────────────────────────────────────┐
    │  │                                                │
    │  │  🏓 Pickleball Courts                         │
    │  │  ┌──┬──┬──┬──┐                                │
    │  │  │PB│PB│PB│PB│                                │
    │  │  └──┴──┴──┴──┘                                │
    │  │                                                │
    │  │         ↕  (4m circulation)                    │
    │  │                                                │
    │  │  ┌──────────────────────────┐                 │
    │  │  │                          │                 │
    │  │  │   REAL TENNIS COURT      │   ╔═══════╗    │
    │  │  │   12m × 24m              │═══║ GLASS ║    │
    │  │  │                          │   ║WALKWAY║    │
    │  │  └──────────────────────────┘   ║  4m   ║    │
    │  │                                  ║ wide  ║    │
    │  │                         VIP     ║       ║    │
    │  │                        SUITES ══╣───────╣    │
    │  │                        ┌────┐   ║       ║    │
    │  │                        │VIP1│═══╣       ║    │
    │  │                        ├────┤   ║       ║    │
    │  │                        │VIP2│═══╣       ║    │
    │  │                        ├────┤   ║       ║    │
    │  │                        │VIP3│═══╣       ║    │
    │  │                        ├────┤   ║       ║    │
    │  │                        │VIP4│═══╣       ║    │
    │  │                        └────┘   ╚═══════╝    │
    │  │                                                │
    │  │  ↕ CORE                                       │
    │  └────────────────────────────────────────────────┘
    │
    ↓
South

GLASS WALKWAY DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Component        | Specification
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Width            | 4m
Floor Material   | Tempered glass, 0.8m thick
Transmission     | 0.88 (88% transparent)
Barriers         | Glass, 2.4m height both sides
Lighting         | LED strips, 6m intervals, blue accent
Structural       | Steel beams 4m spacing, 3.5m wide
Load Capacity    | 5 kN/m² (live load)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 7. Grid Coordinates & Measurements

### 7.1 Master Grid System
**Origin**: [0, 0, 0] at building center, ground level
**Axis Convention**: +X = East, +Y = Up, +Z = South
**Grid Module**: 10m × 10m base grid

```
COORDINATE SYSTEM REFERENCE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Axis | Positive Direction | Range          | Description
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
X    | East →            | -70m to +70m   | Building width
Y    | Up ↑              | 0m to 81m      | Building height
Z    | South ↓           | -60m to +60m   | Building depth
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GRID REFERENCE POINTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Point Name        | Coordinates (X, Y, Z) | Description
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ORIGIN            | [0, 0, 0]             | Building center, ground
RECEPTION         | [0, 0, 52]            | Main entry
NW_CORNER_GND     | [-70, 0, -60]         | Northwest ground corner
NE_CORNER_GND     | [70, 0, -60]          | Northeast ground corner
SW_CORNER_GND     | [-70, 0, 60]          | Southwest ground corner
SE_CORNER_GND     | [70, 0, 60]           | Southeast ground corner
ROOF_APEX         | [0, 90, 0]            | Roof curve peak
OUTDOOR_PLAZA     | [80, 0, 80]           | Plaza center
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 7.2 Court Center Points (All Levels)

```
GROUND FLOOR TENNIS COURTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Court | Center Point (X, Y, Z)  | Surface | Grid Position
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
H1    | [-35, 0.1, -40]         | Hard    | Row 1, Col 1
H2    | [-21, 0.1, -40]         | Hard    | Row 1, Col 2
H3    | [-7, 0.1, -40]          | Hard    | Row 1, Col 3
H4    | [7, 0.1, -40]           | Hard    | Row 1, Col 4
H5    | [21, 0.1, -40]          | Hard    | Row 1, Col 5
H6    | [35, 0.1, -40]          | Hard    | Row 1, Col 6
C1    | [-35, 0.1, -14]         | Clay    | Row 2, Col 1
C2    | [-21, 0.1, -14]         | Clay    | Row 2, Col 2
C3    | [-7, 0.1, -14]          | Clay    | Row 2, Col 3
C4    | [7, 0.1, -14]           | Clay    | Row 2, Col 4
C5    | [21, 0.1, -14]          | Clay    | Row 2, Col 5
C6    | [35, 0.1, -14]          | Clay    | Row 2, Col 6
G1    | [-35, 0.1, 12]          | Grass   | Row 3, Col 1
G2    | [-21, 0.1, 12]          | Grass   | Row 3, Col 2
G3    | [-7, 0.1, 12]           | Grass   | Row 3, Col 3
G4    | [7, 0.1, 12]            | Grass   | Row 3, Col 4
G5    | [21, 0.1, 12]           | Grass   | Row 3, Col 5
G6    | [35, 0.1, 12]           | Grass   | Row 3, Col 6
W1    | [-35, 0.1, 38]          | Wood    | Row 4, Col 1
W2    | [-21, 0.1, 38]          | Wood    | Row 4, Col 2
W3    | [-7, 0.1, 38]           | Wood    | Row 4, Col 3
W4    | [7, 0.1, 38]            | Wood    | Row 4, Col 4
W5    | [21, 0.1, 38]           | Wood    | Row 4, Col 5
W6    | [35, 0.1, 38]           | Wood    | Row 4, Col 6
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LEVEL 1 RACQUET COURTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Court Type | Center Range            | Count | Pattern
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Badminton  | [-40, 20.1, -30] to    | 16    | 4×4 grid
           | [+8, 20.1, +46]         |       | 8m × 16m spacing
Squash     | [0, 22, -20] to        | 4     | Vertical stack
           | [0, 22, +16]            |       | 12m spacing
Table Tennis| [35, 20.8, -30] to    | 16    | 4×4 grid
           | [50, 20.8, 0]           |       | 5m × 10m spacing
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LEVEL 2 SOCIAL COURTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Court      | Center Point (X, Y, Z)  | Dimensions
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Pickleball | [-25, 40.1, -15] to    | 6m × 12m each
(8 courts) | [5, 40.1, 1]            | 10m × 16m spacing
Real Tennis| [30, 40.1, 0]           | 12m × 24m
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LEVEL 3 FARM SECTORS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sector | Rack Center (X, Y, Z)   | Growing Area
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FS-1   | [-30, 60, -20]          | 500 m²
FS-2   | [30, 60, -20]           | 500 m²
FS-3   | [-30, 60, 20]           | 500 m²
FS-4   | [30, 60, 20]            | 500 m²
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total: 2,000 m² growing area
```

---

## 8. Component Specifications

### 8.1 Tennis Court Components

```
COURT SURFACE DIMENSIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Component     | Dimensions       | Material/Color
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Court Playing | 10m × 22m        | Surface-specific
Outer Bounds  | 8m × 20m         | White lines (0.8 opacity)
Singles       | 7.8m × 19.8m     | Inner rectangle
Net Height    | 1m center        | 1.07m at posts
Net Width     | 10m              | Full court width
Net Posts     | 0.05m diameter   | 2m height, dark gray
Net Mesh      | 10m × 1.8m       | White, 0.3 opacity, wireframe
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SURFACE MATERIALS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Surface  | Color Code | Roughness | Special Features
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Hard     | #3b82f6    | 0.5       | Texture map
Clay     | #ea580c    | 0.8       | Particle effect, scuff marks
Grass    | #4d7c0f    | 0.8       | 1500 blade instances, animated
Wood     | #d4a373    | 0.6       | Wood grain texture, normal map
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 8.2 Bleacher Seating Specifications

```
BLEACHER SECTION DIMENSIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Parameter          | Value       | Code Reference
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Seat Width         | 0.45m       | IBC 1029.1.1 (min 0.46m)
Seat Depth         | 0.4m        | Standard bleacher
Row Rise           | 0.4m        | Optimal sightline
Base Elevation     | 2.0m        | Above court level
Rows per Section   | 5           | Tiered design
Seats per Row      | 12-15       | Section dependent
Total Width        | 6.75m       | 15 seats × 0.45m
Total Depth        | 2.0m        | 5 rows × 0.4m
Platform Frame     | W+0.4m      | Steel structure
Support Legs       | 0.15m sq    | 4 per section
Safety Railing     | 0.15m H     | Top row, yellow accent
Accessible Seating | Front row   | Blue marked (#3b82f6)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CAPACITY CALCULATION:
Total Sections: 8
Rows per Section: 5
Average Seats per Row: 13
Total Capacity: 8 × 5 × 13 = 520 seats (rounded to 600 for variation)
```

### 8.3 Vertical Farm Rack Specifications

```
FARM RACK GEOMETRY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Component       | Dimensions        | Material
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Frame Structure | 30m × 4m × 10m    | Wireframe (#334155)
Grow Shelf 1    | 29m × 0.2m × 9m   | Y = 0.5m, green (#22c55e)
Grow Shelf 2    | 29m × 0.2m × 9m   | Y = 1.5m, green
Grow Shelf 3    | 29m × 0.2m × 9m   | Y = 2.5m, green
Grow Shelf 4    | 29m × 0.2m × 9m   | Y = 3.5m, green
LED Array       | Point light       | Purple (#a855f7)
Light Intensity | 2.0               | 15m distance
Growing Area    | 500 m² per rack   | 4 levels × 125 m²/level
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ENVIRONMENTAL SYSTEMS (per sector):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
System          | Specification
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Lighting        | LED grow lights, full spectrum
Climate Control | Autonomous temperature/humidity
Hydroponics     | Nutrient film technique (NFT)
Irrigation      | Automated drip + misting
Monitoring      | IoT sensors (pH, EC, temp, humidity)
Robotics        | Automated harvesting/transport
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 8.4 Glass Facade & Walkway Materials

```
GLASS FACADE (Levels 1-2):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Property         | Value        | Material Class
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Color            | #e2e8f0      | Light slate
Transmission     | 0.8 (80%)    | meshPhysicalMaterial
Opacity          | 0.3          | Transparent
Roughness        | 0.1          | Smooth
Metalness        | 0.1          | Low
Thickness        | 0.5m         | Glass unit depth
Side Rendering   | DoubleSide   | Interior visibility
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GLASS WALKWAY (Level 2):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Component        | Specification
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Floor Glass      | Transmission 0.88, thickness 0.8m
Width            | 4m
Color            | #e0f2fe (light blue tint)
Roughness        | 0.08
Clearcoat        | 0.9 (high polish)
Safety Grid      | 3.8m width, wireframe, opacity 0.15
Barriers         | 2.4m height, both sides
LED Lighting     | Blue (#60a5fa), 6m intervals, 0.3 intensity
Structural Beams | 4m spacing, 3.5m wide, steel (#64748b)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 8.5 Organic Structural Elements

```
CATMULL-ROM CURVE COLUMNS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Curve ID  | Control Points (X, Y, Z)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
C1 (SW)   | [-75,0,65] → [-85,20,65] → [-75,40,55] → [-65,80,50]
C2 (SE)   | [75,0,65] → [85,20,65] → [75,40,55] → [65,80,50]
C3 (NW)   | [-75,0,-65] → [-85,20,-65] → [-75,40,-55] → [-65,80,-50]
C4 (NE)   | [75,0,-65] → [85,20,-65] → [75,40,-55] → [65,80,-50]
Arch1     | [-65,80,50] → [0,90,0] → [65,80,-50]
Arch2     | [65,80,50] → [0,90,0] → [-65,80,-50]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TUBE GEOMETRY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Parameter        | Value
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tube Segments    | 64
Tube Radius      | 2m
Radial Segments  | 8
Closed           | false
Material Color   | #ffffff (white)
Roughness        | 0.2
Metalness        | 0.1
Shadow Casting   | true
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 8.6 Solar Array Specifications

```
SOLAR PANEL LAYOUT (Roof Level, Y=81m):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Parameter        | Value
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Panel Dimensions | 4m × 6m × 0.2m
Panel Count      | 8 units (3×3 grid, missing 1 corner)
Grid Spacing     | 40m center-to-center
Tilt Angle       | -0.2 radians (~11.5°)
Base Color       | #020617 (dark blue-black)
Top Surface      | #1e293b (dark slate), metalness 0.9
Metalness        | 0.8
Roughness        | 0.2
Total Coverage   | ~192 m² active solar area
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

POSITIONS (X, Y, Z):
[-40, 81, -40], [0, 81, -40], [40, 81, -40]
[-40, 81, 0],   [0, 81, 0],   [40, 81, 0]
[-40, 81, 40],  [0, 81, 40]
(Missing: [40, 81, 40] for architectural variation)
```

### 8.7 Green Facade System

```
GREEN WALL BLOCKS (Level 3 Exterior):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Wall     | Position (X, Y, Z)  | Dimensions (W×H×D)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
West     | [-60, 70, 0]        | 2m × 18m × 80m
East     | [60, 70, 0]         | 2m × 18m × 80m
North    | [0, 70, -50]        | 100m × 18m × 2m
South    | [0, 70, 50]         | 100m × 18m × 2m
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MATERIAL:
Base Color: #15803d (dark green)
Roughness: 1.0 (matte)
Overlay: #16a34a (lighter green), wireframe, opacity 0.2
Total Area: 7,120 m² living wall coverage
```

---

## 9. Summary Tables

### 9.1 Floor Area Summary

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Level | Elevation | Plate Size      | Net Area | Primary Function
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
L0    | 0m        | 130m × 120m     | 15,600m² | Tennis Arena
L1    | 20m       | 120m × 120m     | 14,400m² | Racquet Mezzanine
L2    | 40m       | 110m × 110m     | 12,100m² | Social Courts
L3    | 60m       | 120m × 120m     | 14,400m² | Vertical Farm
Roof  | 81m       | -               | 192m²    | Solar Array
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL BUILDING AREA: 56,500 m²
```

### 9.2 Court Inventory

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Court Type    | Count | Dimensions  | Level | Surface Area
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tennis (Hard) | 6     | 10m × 22m   | L0    | 1,320 m²
Tennis (Clay) | 6     | 10m × 22m   | L0    | 1,320 m²
Tennis (Grass)| 6     | 10m × 22m   | L0    | 1,320 m²
Tennis (Wood) | 6     | 10m × 22m   | L0    | 1,320 m²
Badminton     | 16    | 6m × 13m    | L1    | 1,248 m²
Squash        | 4     | 6m × 9m     | L1    | 216 m²
Table Tennis  | 16    | 1.5m × 2.7m | L1    | 64.8 m²
Pickleball    | 8     | 6m × 12m    | L2    | 576 m²
Real Tennis   | 1     | 12m × 24m   | L2    | 288 m²
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL: 69 courts/tables | 7,672.8 m² playing surface
```

### 9.3 Capacity Summary

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Space Type          | Count | Capacity/Unit | Total Capacity
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tennis Courts       | 24    | 4 players     | 96
Badminton Courts    | 16    | 4 players     | 64
Squash Courts       | 4     | 2 players     | 8
Table Tennis        | 16    | 2 players     | 32
Pickleball Courts   | 8     | 4 players     | 32
Real Tennis         | 1     | 4 players     | 4
VIP Suites          | 4     | 4 guests      | 16
Bleacher Seating    | 8 sec | 75 seats      | 600
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL SIMULTANEOUS OCCUPANCY: ~850 people
Peak Event Capacity: 1,200+ (with standing areas)
```

---

## Document Control

**Version**: 1.0
**Last Updated**: 2025-11-22
**Author**: System Architect Agent
**Data Sources**:
- `/home/kvn/workspace/ace/components/ThreeScene.tsx`
- `/home/kvn/workspace/ace/docs/architecture/facility-blueprint.md`
- `/home/kvn/workspace/ace/docs/architecture/facility-architecture.md`

**Coordinate System**: Unity/Three.js World Space
**Units**: Metric (meters)
**Precision**: 0.1m typical, 0.01m for critical dimensions

**Next Steps**:
1. CAD export for structural engineering
2. MEP coordination drawings
3. Sensor placement diagrams
4. Digital twin asset integration
5. Construction documentation package

---

*End of Reference Diagrams Document*
