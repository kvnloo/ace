# Transport Pods System Diagram

## Station Network Topology

```
                    L3: Vertical Farm Hub (0, 60.5, 0)
                              │
                              │ Vertical
                              │ Transit
                              │
                    L2: Social Zone Hub (0, 40.5, 0)
                              │
                              │
                              │
                    L1: Racquet Hub (0, 20.5, 0)
                        ┌─────┼─────┐
                        │     │     │
                   ┌────┘     │     └────┐
                   │          │          │
                   │          │          │
        Parking Lot        Main Entrance     Ground Courts
        (-100,0.5,-20)     (0,0.5,65)        (40,0.5,0)
           │                   │                  │
           │                   │                  │
           └───────────────────┼──────────────────┘
                               │
                               │
                        Outdoor Plaza
                        (90,0.5,50)

Total: 7 Stations
Routes: 13 Bidirectional Connections
```

## Pod State Flow Diagram

```
     ╔═══════╗
     ║ IDLE  ║  (Gray indicator)
     ║  Pod  ║  Waiting at station
     ╚═══╤═══╝  Passengers: 0-4/4
         │
         │ User books destination
         │
         ▼
   ╔═══════════╗
   ║ BOARDING  ║  (Yellow indicator)
   ║    Pod    ║  Loading passengers
   ╚═════╤═════╝  Duration: 2 seconds
         │
         │ Boarding complete
         │
         ▼
  ╔════════════╗
  ║ TRAVELING  ║  (Green indicator)
  ║    Pod     ║  Moving along route
  ╚══════╤═════╝  Progress: 0% → 100%
         │
         │ Reaches destination
         │
         ▼
   ╔═══════════╗
   ║ ARRIVING  ║  (Blue indicator)
   ║    Pod    ║  Approaching station
   ╚═════╤═════╝  Duration: 1.5 seconds
         │
         │ Passengers disembark
         │
         └─────────► Back to IDLE
```

## Pod Vehicle Anatomy

```
        ╭─────────────────╮
        │  Status Light   │  ← Color indicates state
        ╰────────┬────────╯
                 │
    ╭────────────┴────────────╮
    │                         │
    │   ╭─────────────────╮   │
    │   │  Glass Canopy   │   │  ← 90% transmission
    │   │  (Transparent)  │   │
    │   ╰─────────────────╯   │
    │                         │
    │    ●●●●    ●●●●        │  ← Passengers (0-4)
    │                         │
    │  Metallic Pod Body      │  ← Sleek capsule design
    ╰─────┬───────────┬───────╯
          │           │
    ┌─────┴───┐ ┌────┴─────┐
    │ Thruster│ │ Thruster │  ← Hover effect
    │  Ring   │ │   Ring   │
    └─────────┘ └──────────┘
         │           │
         ▼           ▼
    [Energy Field Glow]  ← Active when traveling
```

## Station Platform Layout

```
                   Direction
                   Indicators
                   ▼  ▼  ▼
              ╭─── ◄ ► ─────╮
              │              │
         ╭────┴──────────────┴────╮
         │                        │
         │    Station Name        │  ← Floating text
         │   ╔════════════╗       │
         │   ║   Active   ║       │  ← Green sphere
         │   ║  Indicator ║       │     (pods present)
    ┌────┴───╨────────────╨───────┴────┐
    │    ○○○○○○○○○○○○○○○○○○○○○○○○○○○   │
    │  ○                             ○ │  ← LED ring
    │ ○    CIRCULAR PLATFORM         ○│  ← 6m diameter
    │○                                 ○│
    │○          [Pod Zone]            ○│
    │ ○                              ○ │
    │  ○                            ○  │
    │    ○○○○○○○○○○○○○○○○○○○○○○○○○○   │
    └──────┬─────────┬─────────┬───────┘
           │         │         │
           ▼         ▼         ▼
        Support   Support   Support
        Column    Column    Column
```

## Booking Kiosk Interface

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ ● TRANSPORT BOOKING      ┃  ← Animated pulse
┃                          ┃
┃ From: Main Entrance      ┃  ← Current station
┃ ━━━━━━━━━━━━━━━━━━━━━━  ┃
┃                          ┃
┃ ┌──────────────────────┐ ┃
┃ │ Ground Courts     → │ ┃  ← Available
┃ └──────────────────────┘ ┃     routes
┃ ┌──────────────────────┐ ┃
┃ │ Parking Lot       → │ ┃
┃ └──────────────────────┘ ┃
┃ ┌──────────────────────┐ ┃
┃ │ L1 Racquet Hub    → │ ┃
┃ └──────────────────────┘ ┃
┃                          ┃
┃ ┌──────────────────────┐ ┃
┃ │      Close           │ ┃
┃ └──────────────────────┘ ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

## Tracking Panel Interface

```
┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃  POD TRACKING         ┃
┃                       ┃
┃ Pod ID:      pod_03   ┃  ← Unique identifier
┃ Status:    TRAVELING  ┃  ← Current state
┃ Passengers:      2/4  ┃  ← Occupancy
┃                       ┃
┃ Current:             ┃
┃   Main Entrance      ┃
┃                       ┃
┃ Destination:         ┃
┃   L3 Vertical Farm   ┃
┃                       ┃
┃ ┌───────────────────┐ ┃
┃ │████████░░░░░░░░░░│ ┃  ← Progress bar
┃ └───────────────────┘ ┃
┃      67% Complete     ┃
┃                       ┃
┃ ┌───────────────────┐ ┃
┃ │ Close Tracking    │ ┃
┃ └───────────────────┘ ┃
┗━━━━━━━━━━━━━━━━━━━━━━━┛
```

## Route Path Visualization

### Active Route (Pod Traveling)
```
Station A ═════════════════════════════════► Station B
          ▲                                  ▲
          │                                  │
     Bright Yellow                      Pod Position
     Solid Line                         (moving along)
     3px Width
```

### Inactive Route
```
Station A ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ► Station B
          ▲
          │
       Gray Color
       Dashed Line
       1.5px Width
```

### Vertical Route (Multi-level)
```
    L3 Station
        ╱
       ╱
      ╱   ← Arc upward
     ╱       (20% elevation boost)
    ╱
   ╱
Ground Station
```

## System Data Flow

```
┌─────────────┐
│    USER     │
└──────┬──────┘
       │ Click Station
       ▼
┌─────────────────┐
│ Booking Kiosk   │
└──────┬──────────┘
       │ Select Destination
       ▼
┌─────────────────┐      ┌──────────────┐
│ Pod Dispatcher  │─────►│ Route Cache  │
└──────┬──────────┘      └──────────────┘
       │ Assign Pod            │
       ▼                       │ Get Path
┌─────────────────┐           │
│ Pod State       │◄──────────┘
│ Update          │
└──────┬──────────┘
       │ Every Frame
       ▼
┌─────────────────┐
│ Animation Loop  │
│ (useFrame)      │
└──────┬──────────┘
       │ Update Position
       ▼
┌─────────────────┐
│ Visual Render   │
└─────────────────┘
```

## Component Hierarchy

```
<TransportPods>
│
├─ Pod State Management
│  ├─ useState(pods: Pod[])
│  ├─ useState(routes: Map<string, Vector3[]>)
│  └─ useState(selectedPod: string | null)
│
├─ Path Generation
│  └─ useMemo(() => generateAllRoutes())
│
├─ Animation
│  └─ useFrame(() => updateAllPods())
│
└─ Render
   │
   ├─ <PodStation> × 7
   │  ├─ Platform Mesh
   │  ├─ Support Columns
   │  ├─ Station Label
   │  ├─ Direction Indicators
   │  └─ <BookingKiosk> (HTML)
   │
   ├─ <PodVehicle> × 8
   │  ├─ Capsule Body
   │  ├─ Glass Canopy
   │  ├─ Status Light
   │  ├─ Thrusters
   │  └─ <InfoLabel> (HTML)
   │
   ├─ <RoutePath> × (dynamic)
   │  └─ Line Geometry
   │
   └─ <TrackingPanel> (HTML)
      └─ Conditional Render
```

## Performance Profile

```
┌────────────────────────────────────┐
│        RENDER PIPELINE             │
├────────────────────────────────────┤
│                                    │
│  Geometry Creation  ──► 4000 tris │  ← One-time
│                                    │
│  Material Setup     ──► 15 mats   │  ← Cached
│                                    │
│  Path Calculation   ──► 13 routes │  ← Memoized
│                                    │
├────────────────────────────────────┤
│         PER FRAME (60fps)          │
├────────────────────────────────────┤
│                                    │
│  Pod Updates        ──► 8 pods    │  ← 0.5ms
│                                    │
│  Position Interp    ──► Matrix    │  ← 0.3ms
│                                    │
│  State Checks       ──► Logic     │  ← 0.1ms
│                                    │
│  Render             ──► Draw      │  ← 1.0ms
│                                    │
│  Total Frame Time:       ~2ms     │  ✓ Good
│                                    │
└────────────────────────────────────┘
```

## Color Legend

```
Status Indicators:
  ● Gray    (#6b7280) = IDLE
  ● Yellow  (#fbbf24) = BOARDING
  ● Green   (#22c55e) = TRAVELING
  ● Blue    (#3b82f6) = ARRIVING

Primary Colors:
  ■ Brand Yellow  (#DFFF4F) = Routes, highlights
  ■ Slate         (#1e293b) = Platforms, structures
  ■ White         (#ffffff) = Text, labels

Materials:
  ◆ Metallic      (M:0.7, R:0.2) = Pod bodies
  ◇ Glass         (T:0.9, O:0.2) = Canopies
  ◈ Emissive      (Dynamic)      = Status lights
```

## Spatial Layout (Top View)

```
           North
             ↑
             │
    Parking ●│            ● Outdoor
     Lot     │             Plaza
             │               │
             │               │
West ────────┼────────────────────── East
             │               │
             │        Ground Courts
       Main  ●              ●
      Entrance              │
             │              │
             ↓
           South

● = Ground Station
Elevated stations (L1, L2, L3) positioned at center (0, Y, 0)
```

## Legend

```
Symbols:
  ● = Station
  ═ = Active Route
  ─ = Inactive Route
  ► = Direction
  ◄ = Return Path
  ╱ = Vertical Transit
  ┌─┐ = Interactive Element
  ┏━┓ = UI Panel
  ║ = State Boundary
  ▼ = Flow Direction
```

---

This diagram provides a visual reference for understanding the transport pod system architecture, layout, and interactions.
