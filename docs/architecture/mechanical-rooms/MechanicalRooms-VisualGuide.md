# MechanicalRooms Visual Reference Guide

## Room Layout Overview

```
╔════════════════════════════════════════════════════════════════╗
║                    MECHANICAL FLOOR (Level 1)                  ║
║                    Position: [35, 0.1, -40]                    ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  ┌─────────────────┐         ┌─────────────────┐             ║
║  │   HVAC ROOM     │         │  ELECTRICAL RM  │             ║
║  │   20m × 15m     │         │   15m × 12m     │             ║
║  │                 │         │                 │             ║
║  │  AHU-1   AHU-2  │         │ MDB-1  MDB-4    │             ║
║  │    ⚙️      ⚙️    │         │  ⚡     ⚡      │             ║
║  │                 │         │                 │             ║
║  │  AHU-3   AHU-4  │         │ MDB-2  MDB-5    │             ║
║  │    ⚙️      ⚙️    │         │  ⚡     ⚡      │             ║
║  │                 │         │                 │             ║
║  │                 │         │ MDB-3  MDB-6    │             ║
║  └─────────────────┘         │  ⚡     ⚡      │             ║
║                              └─────────────────┘             ║
║                                                                ║
║  ┌─────────────────┐         ┌─────────────────┐             ║
║  │ WATER TREATMENT │         │  GENERATOR RM   │             ║
║  │   18m × 15m     │         │   20m × 12m     │             ║
║  │                 │         │                 │             ║
║  │      🌊         │         │  GEN-1  GEN-2   │             ║
║  │    TANK         │         │   🔋     🔋     │             ║
║  │   (5m tall)     │         │                 │             ║
║  │                 │         │  500kVA 500kVA  │             ║
║  │  💧  💧  💧     │         │                 │             ║
║  │ Filters (3x)    │         └─────────────────┘             ║
║  └─────────────────┘                                          ║
║                                                                ║
║  ┌───────────────────────────────────────────┐                ║
║  │        MAINTENANCE ROBOT AREA             │                ║
║  │                                           │                ║
║  │   🔌          🤖  MAINT-02                │                ║
║  │  DOCK-1        (patrolling)               │                ║
║  │                                           │                ║
║  │        🤖                    🔌           │                ║
║  │     MAINT-01              DOCK-2          │                ║
║  │    (docked)                               │                ║
║  │                                           │                ║
║  │              🤖  MAINT-03                 │                ║
║  │               (inspecting)                │                ║
║  └───────────────────────────────────────────┘                ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

---

## HVAC System Detail

```
╔═══════════════════════════════════════════════════════════╗
║              AIR HANDLER UNIT (AHU)                       ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║    ┌──────────────────────────────────────┐              ║
║    │         [AHU-1 Label]                │              ║
║    ├──────────────────────────────────────┤              ║
║    │                                      │              ║
║    │  ┌───┐              ┌───┐           │              ║
║    │  │ ⚙ │ Supply Fan   │ ⚙ │ Exhaust  │              ║
║    │  │ ◉ │ (rotating)   │ ◉ │  Fan     │              ║
║    │  └───┘              └───┘           │              ║
║    │    ↓                  ↑             │              ║
║    │  💨💨💨            💨💨💨          │              ║
║    │ Particles          Particles        │              ║
║    │                                      │              ║
║    │  ┌──────────────────────┐           │              ║
║    │  │    Filter Section    │           │              ║
║    │  │    (visible grill)   │           │              ║
║    │  └──────────────────────┘           │              ║
║    │                                      │              ║
║    └──────────────────────────────────────┘              ║
║                  │                                       ║
║              ┌───┴───┐                                   ║
║              │ Duct  │                                   ║
║              └───────┘                                   ║
║                                                           ║
║    ┌─────────────────────┐                               ║
║    │   Control Panel     │                               ║
║    ├─────────────────────┤                               ║
║    │ Temp:   20.5°C  🟢 │                               ║
║    │ Press:  475 Pa  🟢 │                               ║
║    │ Flow: 3350 CFM  🟢 │                               ║
║    │ Status:  NORMAL 🟢 │                               ║
║    └─────────────────────┘                               ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

---

## Electrical Panel Detail

```
╔════════════════════════════════════════════════════════╗
║       MAIN DISTRIBUTION BOARD (MDB-1)                  ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║    ┌────────────────────────────────────┐             ║
║    │         ⚡ MDB-1 ⚡                │             ║
║    ├────────────────────────────────────┤             ║
║    │                                    │             ║
║    │  ════════════════════════════════  │  ← Bus Bar ║
║    │     (Copper - 400A capacity)       │             ║
║    │                                    │             ║
║    │  🟢 CB1  🟢 CB2   [Circuit Row 1] │             ║
║    │  🟢 CB3  🟢 CB4   [Circuit Row 2] │             ║
║    │  🟢 CB5  🟢 CB6   [Circuit Row 3] │             ║
║    │  🟢 CB7  🟢 CB8   [Circuit Row 4] │             ║
║    │  🟢 CB9  🟢 CB10  [Circuit Row 5] │             ║
║    │  🟢 CB11 🟢 CB12  [Circuit Row 6] │             ║
║    │  🟢 CB13 🟢 CB14  [Circuit Row 7] │             ║
║    │  🟢 CB15 🟢 CB16  [Circuit Row 8] │             ║
║    │  🟢 CB17 🟢 CB18  [Circuit Row 9] │             ║
║    │  🟢 CB19 🟢 CB20  [Circuit Row 10]│             ║
║    │  🟢 CB21 🟢 CB22  [Circuit Row 11]│             ║
║    │  🟢 CB23 🔴 CB24  [Circuit Row 12]│             ║
║    │                                    │             ║
║    │  ┌──────┐      ┌──────┐           │             ║
║    │  │  V   │      │  A   │           │             ║
║    │  │ 415  │      │ 295  │           │             ║
║    │  │  ↗   │      │  ↗   │           │             ║
║    │  └──────┘      └──────┘           │             ║
║    │ Voltmeter    Ammeter              │             ║
║    │                                    │             ║
║    └────────────────────────────────────┘             ║
║                                                        ║
║    ┌──────────────────────┐                           ║
║    │  Digital Display     │                           ║
║    ├──────────────────────┤                           ║
║    │ V:    415.2 V   🟢  │                           ║
║    │ I:    295.5 A   🟢  │                           ║
║    │ kW:   125      🟢  │                           ║
║    │ Hz:   50.0     🟢  │                           ║
║    └──────────────────────┘                           ║
║                                                        ║
╚════════════════════════════════════════════════════════╝

Legend:
🟢 = Circuit ON (green LED)
🔴 = Circuit OFF (red LED)
CB = Circuit Breaker
V = Voltage
A = Amperage
```

---

## Water Treatment System Detail

```
╔═══════════════════════════════════════════════════════╗
║            WATER TREATMENT FACILITY                   ║
╠═══════════════════════════════════════════════════════╣
║                                                       ║
║                    ┌────────┐                         ║
║                    │ INLET  │                         ║
║                    │  PIPE  │                         ║
║                    └───┬────┘                         ║
║                        │                              ║
║        ╔═══════════════╧════════════════╗             ║
║        ║                                ║             ║
║   🟢🟢🟢🟢  Level Sensors                ║   5m      ║
║        ║  ┌────────────────────┐        ║   tall    ║
║   🟢🟢🟢🟢  │                    │        ║   tank    ║
║        ║  │   WATER STORAGE    │        ║             ║
║   🟢🟢🟢🟢  │      (78% full)    │        ║             ║
║        ║  │                    │        ║             ║
║   ⚫⚫⚫⚫  │    ~~~~~~~~~~~~~~~~ │        ║             ║
║        ║  │  ~~~~~~~~~~~~~~~~~~│        ║             ║
║   ⚫⚫⚫⚫  │ ~~~~~~~~~~~~~~~~~~~~ │        ║             ║
║        ║  │~~~~~~~~~~~~~~~~~~~~│        ║             ║
║        ║  └────────────────────┘        ║             ║
║        ╚═══════════════╤════════════════╝             ║
║                        │                              ║
║                    ┌───┴────┐                         ║
║                    │ OUTLET │                         ║
║                    │  PIPE  │                         ║
║                    └────────┘                         ║
║                                                       ║
║    FILTRATION SYSTEM              PUMP SYSTEM        ║
║    ┌────────────┐                 ┌──────┐           ║
║    │ Filter #3  │                 │ 🔵   │ Motor    ║
║    ├────────────┤                 │ ════ │           ║
║    │ Filter #2  │        🔄       │  ⚙  │ Impeller ║
║    ├────────────┤      rotating   │      │           ║
║    │ Filter #1  │                 └──────┘           ║
║    └────────────┘                 Status: 🟢 ON     ║
║                                                       ║
║    ┌──────────────────────┐                          ║
║    │   SYSTEM METRICS     │                          ║
║    ├──────────────────────┤                          ║
║    │ Level:     78%   🟢 │                          ║
║    │ Flow:   450 L/min 🟢│                          ║
║    │ Pressure:  3.2 bar🟢│                          ║
║    │ Quality: Excellent 🟢│                          ║
║    └──────────────────────┘                          ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
```

---

## Generator System Detail

```
╔════════════════════════════════════════════════════════╗
║              BACKUP GENERATOR (GEN-1)                  ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║    ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️  ← Warning stripes     ║
║    ┌──────────────────────────────────────┐           ║
║    │         GENERATOR ENCLOSURE          │           ║
║    │  ┌────────────────────────────┐      │           ║
║    │  │ ∥∥∥∥∥∥∥  Ventilation      │      │           ║
║    │  │ ∥∥∥∥∥∥∥  Grills           │      │           ║
║    │  │ ∥∥∥∥∥∥∥                   │      │           ║
║    │  └────────────────────────────┘      │           ║
║    │                                      │           ║
║    │      ┌──────────┐                    │           ║
║    │      │  ENGINE  │  ≈≈ (vibrating)    │           ║
║    │      │  BLOCK   │                    │           ║
║    │      └────┬─────┘                    │           ║
║    │           │                          │           ║
║    │      ┌────┴─────┐                    │           ║
║    │      │ALTERNATOR│                    │           ║
║    │      │  500kVA  │                    │           ║
║    │      └──────────┘                    │           ║
║    └──────────────────────────────────────┘           ║
║                        │  Exhaust                     ║
║                        └──┐                           ║
║                           │💨💨💨 Heat shimmer        ║
║                           └─┘                         ║
║                                                        ║
║    ┌─────────────┐         ┌──────────┐              ║
║    │ FUEL TANK   │         │ CONTROL  │              ║
║    │   🟡🟡🟡    │         │  PANEL   │              ║
║    │ ~~~~~~~~~~~~│         │  🟢🟢🟡⚫ │              ║
║    │~~~~~~~~~~~~~│         │          │              ║
║    │  (87% full) │         │  Status  │              ║
║    └─────────────┘         └──────────┘              ║
║                                                        ║
║    ┌──────────────────────┐                           ║
║    │  GENERATOR STATUS    │                           ║
║    ├──────────────────────┤                           ║
║    │ Status:  STANDBY 🟢 │                           ║
║    │ Power:   500 kVA 🟢 │                           ║
║    │ Fuel:        87% 🟢 │                           ║
║    │ Runtime:     12h 🟢 │                           ║
║    └──────────────────────┘                           ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
```

---

## Maintenance Robot Detail

```
╔════════════════════════════════════════════════════╗
║         AUTONOMOUS MAINTENANCE ROBOT               ║
║              (MAINT-01)                            ║
╠════════════════════════════════════════════════════╣
║                                                    ║
║           🚁 Rotor     🚁 Rotor                    ║
║              ╲           ╱                         ║
║               ╲         ╱                          ║
║                ╲       ╱                           ║
║            ═════╲═════╱═════  ← Rotating scanner  ║
║             ╔═══════════════╗                      ║
║             ║       ●       ║  ← Camera/sensor    ║
║             ║   MAIN BODY   ║     (blue glow)     ║
║             ║  (spherical)  ║                      ║
║             ║               ║                      ║
║             ║   🔵 🟢 🔵   ║  ← Status LEDs      ║
║             ╚═══════════════╝                      ║
║            ═════╱═════╲═════                       ║
║                ╱       ╲                           ║
║               ╱         ╲                          ║
║              ╱           ╲                         ║
║           🚁 Rotor     🚁 Rotor                    ║
║                                                    ║
║         ┌──────────────────┐                       ║
║         │    MAINT-01      │  ← ID Label          ║
║         └──────────────────┘                       ║
║                                                    ║
║  Hovering Motion: ↕ (sine wave, 0.05m amplitude) ║
║  Scanner: Rotating @ 2 rad/s                      ║
║  Status: ACTIVE - Patrolling                      ║
║                                                    ║
╚════════════════════════════════════════════════════╝

DOCKING STATION
═══════════════
    ┌───────────────────┐
    │    ╭─────────╮    │
    │   ╱    🟢    ╲   │  ← Status ring (green=ready)
    │  │  Charging  │  │
    │   ╲  Column  ╱   │
    │    ╰─────────╯    │
    ├───────────────────┤
    │  🔆     🔆      │  ← Charging pads (4x)
    │      🔆     🔆   │    (amber glow)
    └───────────────────┘
           ║  ║  ║         ← Support legs (3x)
           ╚══╩══╝
```

---

## Status Indicator Legend

### LED Colors & Meanings

```
🟢 GREEN    = Normal operation, system healthy
🔵 BLUE     = Active monitoring, data flowing
🟡 YELLOW   = Warning, attention needed
🔴 RED      = Alert, immediate action required
🟠 ORANGE   = Standby mode, ready for activation
🟣 PURPLE   = Maintenance mode
⚫ GRAY     = Offline, disabled, or inactive
⚪ WHITE    = Neutral status, information only
```

### Equipment Status Icons

```
⚙️  = HVAC equipment
⚡  = Electrical system
💧  = Water/fluid system
🔋  = Power/energy system
🤖  = Robotic system
🔌  = Charging/power connection
🌊  = Water storage/treatment
💨  = Airflow/ventilation
🔥  = Combustion/heat generation
🔄  = Rotation/circulation
```

---

## Particle Effect Visualization

### Airflow Particles (HVAC)

```
Supply Air Flow:
    ↓ ↓ ↓ ↓ ↓
    💨💨💨💨💨  ← Particles moving down
    💨💨💨💨💨     (supply air)
    💨💨💨💨💨
    ↓ ↓ ↓ ↓ ↓

Return Air Flow:
    ↑ ↑ ↑ ↑ ↑
    💨💨💨💨💨  ← Particles moving up
    💨💨💨💨💨     (return air)
    💨💨💨💨💨
    ↑ ↑ ↑ ↑ ↑
```

### Exhaust Particles (Generator)

```
Heat Shimmer:
           ↑
          💨
         💨 💨
        💨   💨
       💨     💨  ← Rising heat
      💨       💨
     🔥🔥🔥🔥🔥  ← Exhaust pipe
```

---

## Animation Timing Reference

```
╔════════════════════════════════════════════════════╗
║          ANIMATION SPEEDS & CYCLES                 ║
╠════════════════════════════════════════════════════╣
║                                                    ║
║  HVAC Fans:           0.15 rad/s  (9 RPM)         ║
║  Water Pump:          0.20 rad/s  (12 RPM)        ║
║  Robot Scanner:       2.00 rad/s  (19 RPM)        ║
║  Generator Vibration: 40 Hz sine wave             ║
║  Robot Hover:         2 Hz sine wave              ║
║  Gauge Needles:       Smooth interpolation        ║
║  Airflow Particles:   0.02 units/frame (down)     ║
║  Exhaust Particles:   0.03 units/frame (up)       ║
║  LED Pulse:           Variable (0.5-2 Hz)         ║
║                                                    ║
╚════════════════════════════════════════════════════╝
```

---

## Lighting Map

```
                    ROOM LIGHTING SCHEME

    HVAC Room              Electrical Room
┌─────────────────┐    ┌─────────────────┐
│     💡          │    │     💡          │
│  (white, 25m)   │    │  (amber, 20m)   │
│                 │    │                 │
│  🔦 🔦 🔦 🔦   │    │  🔦 🔦 🔦 🔦   │
│  AHU indicators │    │  Panel LEDs     │
└─────────────────┘    └─────────────────┘

  Water Treatment          Generator Room
┌─────────────────┐    ┌─────────────────┐
│     💡          │    │     💡          │
│  (blue, 20m)    │    │  (yellow, 20m)  │
│                 │    │                 │
│  🔦 🔦          │    │  🔦 🔦         │
│  System LEDs    │    │  Status lights  │
└─────────────────┘    └─────────────────┘

        Maintenance Robot Area
       ┌─────────────────────┐
       │                     │
       │  🔦     🤖    🔦   │
       │ DOCK  ROBOT  DOCK  │
       │                     │
       └─────────────────────┘
```

---

## Spatial Relationships

```
Top View (Bird's Eye):

                    N (North)
                      ↑

    W ← ─────────────┼───────────── → E
                      │
                    S (South)
                      ↓

┌─────────────────────────────────────────┐
│ HVAC                    ELECTRICAL      │
│  ⚙️⚙️                    ⚡⚡⚡          │
│  ⚙️⚙️                    ⚡⚡⚡          │
│                                         │
├─────────────────────────────────────────┤
│ WATER                   GENERATOR       │
│   🌊                      🔋🔋          │
│  💧💧💧                                 │
│                                         │
├─────────────────────────────────────────┤
│        MAINTENANCE ROBOT AREA           │
│    🔌  🤖     🤖      🔌               │
│  DOCK-1    (active)   DOCK-2            │
│              🤖                         │
│           (active)                      │
└─────────────────────────────────────────┘

    Center Position: [35, 0.1, -40]
         ↑    ↑    ↑
         X    Y    Z
      (East) (Up) (North)
```

---

## Component Hierarchy

```
MechanicalRooms
├── HVAC Room Group [0, 0, 0]
│   ├── Floor Mesh
│   ├── AirHandlerUnit #1 [-7, 1.5, -5]
│   ├── AirHandlerUnit #2 [7, 1.5, -5]
│   ├── AirHandlerUnit #3 [-7, 1.5, 5]
│   └── AirHandlerUnit #4 [7, 1.5, 5]
│
├── Electrical Room Group [25, 0, 0]
│   ├── Floor Mesh
│   ├── ElectricalPanel #1 [-5, 1.5, -4]
│   ├── ElectricalPanel #2 [-5, 1.5, 0]
│   ├── ElectricalPanel #3 [-5, 1.5, 4]
│   ├── ElectricalPanel #4 [5, 1.5, -4]
│   ├── ElectricalPanel #5 [5, 1.5, 0]
│   └── ElectricalPanel #6 [5, 1.5, 4]
│
├── Water Treatment Group [-25, 0, 0]
│   ├── Floor Mesh
│   └── WaterTreatmentSystem [0, 2.5, 0]
│
├── Generator Room Group [0, 0, 20]
│   ├── Floor Mesh
│   ├── BackupGenerator #1 [-6, 1, 0]
│   └── BackupGenerator #2 [6, 1, 0]
│
├── Robot Maintenance Group [0, 0, -20]
│   ├── RobotDockingStation #1 [-4, 0, 0]
│   ├── RobotDockingStation #2 [4, 0, 0]
│   ├── MaintenanceRobot #1 [-4, 1.5, 0] (docked)
│   ├── MaintenanceRobot #2 [8, 2, 5] (patrolling)
│   └── MaintenanceRobot #3 [-8, 2.5, -5] (inspecting)
│
└── Ambient Lighting
    ├── HVAC Light [0, 8, 0]
    ├── Electrical Light [25, 8, 0]
    ├── Water Light [-25, 8, 0]
    └── Generator Light [0, 8, 20]
```

---

**Visual Guide Version**: 1.0.0
**Last Updated**: 2025-11-22
**Companion Document**: MechanicalRooms-Documentation.md
