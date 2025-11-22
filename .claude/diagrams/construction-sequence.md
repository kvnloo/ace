# Construction Sequence Visual Guide
**Industrial Architecture Methodology Applied to ACE Migration**

---

## Construction Phase Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     CONSTRUCTION TIMELINE                        │
│                         (12 Weeks)                               │
└─────────────────────────────────────────────────────────────────┘

WEEK 1-2: FOUNDATION 🏗️
┌──────────────────────────────────────────────────┐
│ 📐 Type System                                   │
│    ├─ facility.ts                               │
│    ├─ components.ts                             │
│    ├─ digitalTwin.ts                            │
│    └─ autonomous.ts                             │
│                                                  │
│ ⚙️  Configuration & Constants                    │
│    ├─ facility.ts (court layouts)               │
│    └─ environment.ts (build config)             │
│                                                  │
│ 📊 Data Models                                   │
│    ├─ Court schemas                             │
│    ├─ Section models (A-F)                      │
│    └─ Sensor data formats                       │
└──────────────────────────────────────────────────┘
                     ↓
           ✅ TypeScript strict mode
           ✅ All configs externalized
           ✅ Data validation ready

WEEK 3-4: STRUCTURE 🏢
┌──────────────────────────────────────────────────┐
│ 🧩 Component Architecture                        │
│    components/                                   │
│    ├── core/        (primitives)                │
│    ├── facility/    (sections A-F)              │
│    ├── courts/      (tennis specifics)          │
│    ├── systems/     (autonomous)                │
│    └── shared/      (reusable UI)               │
│                                                  │
│ 🗺️  Routing & Navigation                         │
│    ├─ /facility (overview)                      │
│    ├─ /facility/section-a (reception)           │
│    └─ /facility/section-b/court/:id             │
│                                                  │
│ 🔄 State Management                              │
│    ├─ Zustand/Redux setup                       │
│    ├─ Global state slices                       │
│    └─ Persistence layer                         │
└──────────────────────────────────────────────────┘
                     ↓
           ✅ Zero circular dependencies
           ✅ All sections routable
           ✅ State management operational

WEEK 5-6: ENVELOPE 🏠
┌──────────────────────────────────────────────────┐
│ 🎨 Layout System                                 │
│    <AppLayout>                                   │
│       ├─ <NavigationHeader />                   │
│       ├─ <FacilitySidebar />                    │
│       ├─ <MainViewport>                         │
│       │     └─ <Canvas> (3D scene)              │
│       └─ <StatusFooter />                       │
│                                                  │
│ 🎭 Design System                                 │
│    ├─ Color palette                             │
│    ├─ Typography scale                          │
│    ├─ Component library                         │
│    └─ Dark mode support                         │
│                                                  │
│ 🌐 3D Scene Management                           │
│    ├─ Scene loader (lazy loading)               │
│    ├─ Camera controller                         │
│    ├─ LOD system                                │
│    └─ Asset loading progress                    │
└──────────────────────────────────────────────────┘
                     ↓
           ✅ Responsive on all devices
           ✅ Theme system implemented
           ✅ 60 FPS 3D rendering

WEEK 7-10: INTERIOR SYSTEMS 🔧
┌──────────────────────────────────────────────────┐
│                PARALLEL EXECUTION                │
│                                                  │
│ 🎾 Section B: Tennis Courts    (Week 7-8)      │
│    ├─ 24 court grid layout                      │
│    ├─ Surface materials (4 types)               │
│    ├─ Court status indicators                   │
│    └─ Interactive selection                     │
│                                                  │
│ 🚪 Section A: Reception        (Week 7)        │
│    ├─ Check-in kiosks                           │
│    └─ Wayfinding displays                       │
│                                                  │
│ 💪 Section C: Health Spaces    (Week 8)        │
│    ├─ BiometricLab                              │
│    ├─ CognitiveLab                              │
│    └─ RecoverySuite                             │
│                                                  │
│ 🌱 Section D: Vertical Farm    (Week 9)        │
│    ├─ 3-floor visualization                     │
│    ├─ Grow cycle monitoring                     │
│    └─ Robotic grass system                      │
│                                                  │
│ 🎛️  Section E: Control Room    (Week 9)        │
│    ├─ Monitoring dashboard                      │
│    ├─ Alert management                          │
│    └─ Manual overrides                          │
│                                                  │
│ 🤖 Autonomous Systems           (Week 9-10)     │
│    ├─ LightingSystem                            │
│    ├─ WeatherSystem                             │
│    └─ CharacterSystem                           │
│                                                  │
│ 🚗 Section F: Parking          (Week 10)       │
│    └─ EV infrastructure                         │
└──────────────────────────────────────────────────┘
                     ↓
           ✅ All 6 sections functional
           ✅ Autonomous systems integrated
           ✅ Digital twin connected

WEEK 11-12: FINISHES & COMMISSIONING ✨
┌──────────────────────────────────────────────────┐
│ ⚡ Performance Optimization                       │
│    ├─ Asset compression                         │
│    ├─ Code splitting                            │
│    └─ Memory leak fixes                         │
│                                                  │
│ 🧪 Quality Assurance                             │
│    ├─ Unit tests (>80% coverage)                │
│    ├─ Integration tests                         │
│    └─ Accessibility audit                       │
│                                                  │
│ 📚 Documentation                                 │
│    ├─ Component docs                            │
│    ├─ Architecture ADRs                         │
│    └─ User guides                               │
│                                                  │
│ 🚀 Deployment                                    │
│    ├─ Production build                          │
│    ├─ CI/CD pipeline                            │
│    └─ Monitoring setup                          │
└──────────────────────────────────────────────────┘
                     ↓
           ✅ Lighthouse score >90
           ✅ Tests passing
           ✅ Production deployed
```

---

## Critical Path Diagram

```
SEQUENTIAL DEPENDENCIES (No Parallelization)

┌───────────┐
│ PHASE 1   │  Types, Config, Data Models
│ FOUNDATION│  (Weeks 1-2)
└─────┬─────┘
      │ ⚠️ MUST COMPLETE BEFORE PHASE 2
      ↓
┌─────────────┐
│ PHASE 2     │  Component Architecture, Routing, State
│ STRUCTURE   │  (Weeks 3-4)
└──────┬──────┘
       │ ⚠️ MUST COMPLETE BEFORE PHASE 3
       ↓
┌─────────────┐
│ PHASE 3     │  Layout, Theme, 3D Scene
│ ENVELOPE    │  (Weeks 5-6)
└──────┬──────┘
       │ ⚠️ MUST COMPLETE BEFORE PHASE 4
       ↓
┌──────────────────────────────────────────┐
│ PHASE 4: INTERIOR SYSTEMS (Weeks 7-10)  │
│                                          │
│  ✅ PARALLEL EXECUTION POSSIBLE HERE ✅  │
│                                          │
│  Section A ║ Section B ║ Section C      │
│  (Week 7)  ║ (Wk 7-8) ║ (Week 8)       │
│            ║          ║                 │
│  Section D ║ Section E ║ Autonomous     │
│  (Week 9)  ║ (Week 9) ║ (Wk 9-10)      │
│            ║          ║                 │
│  Section F                              │
│  (Week 10)                              │
└──────┬───────────────────────────────────┘
       │ ⚠️ MUST COMPLETE BEFORE PHASE 5
       ↓
┌─────────────┐
│ PHASE 5     │  Performance, Testing, Docs, Deploy
│ FINISHES    │  (Weeks 11-12)
└─────────────┘
```

---

## Facility Section Dependency Graph

```
SECTION DEPENDENCIES

Legend:
  → Sequential dependency (must wait)
  ⇢  Soft dependency (can proceed but integration needed later)
  ∥  Parallel (no dependency)


FOUNDATION (Types, Config, Models)
       ↓
       ├────────────────────────────────────────┐
       ↓                                        ↓
STRUCTURE (Architecture, Routing, State)       │
       ↓                                        │
       ├────────────────┐                       │
       ↓                ↓                       │
ENVELOPE (Layout, Theme, 3D Scene)              │
       ↓                                        │
       ├──────────┬──────────┬──────────┐       │
       ↓          ↓          ↓          ↓       ↓
   Section A   Section B  Section C  Section D  Autonomous Systems
   Reception   Courts     Health     Farm       (Lighting, Weather)
   (Week 7)    (Wk 7-8)  (Week 8)   (Week 9)   (Week 9-10)
       ∥          ∥         ∥          ∥             ∥
       ├──────────┴─────────┴──────────┴─────────────┤
       ↓                                              ↓
   Section E                                      Section F
   Control Room                                   Parking
   (Week 9)                                       (Week 10)
       ⇢  (monitors all sections)                    ∥
       │                                              │
       └──────────────────┬───────────────────────────┘
                          ↓
                   FINISHES (Performance, Test, Deploy)
```

---

## Component Migration Flow

```
CURRENT STATE (Flat Structure)
src/components/
├── ThreeScene.tsx
├── BiometricLab.tsx
├── CognitiveLab.tsx
├── RecoverySuite.tsx
├── HydroponicsSystem.tsx
├── RoboticGrassSystem.tsx
├── BMSControlRoom.tsx
├── ReceptionArea.tsx
├── TransportPods.tsx
├── LightingSystem.tsx
├── WeatherSystem.tsx
├── CharacterSystem.tsx
├── Grass.tsx
├── ClayCourtEffect.tsx
├── HeatMapOverlay.tsx
└── ... (30+ more files)

         ↓ PHASE 2.1: REORGANIZATION ↓

TARGET STATE (Hierarchical Structure)
src/
├── components/
│   ├── core/               # Phase 2.1 (Week 3)
│   │   ├── Grass.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── DebugLogger.tsx
│   │
│   ├── facility/           # Phase 4 (Weeks 7-10)
│   │   ├── SectionA/       # Week 7
│   │   │   └── ReceptionArea/
│   │   │       ├── index.tsx
│   │   │       └── CheckInKiosk.tsx
│   │   │
│   │   ├── SectionB/       # Week 7-8
│   │   │   └── TennisCourts/
│   │   │       ├── CourtGrid.tsx
│   │   │       ├── CourtDetail.tsx
│   │   │       └── SurfaceMaterials/
│   │   │
│   │   ├── SectionC/       # Week 8
│   │   │   └── HealthSpaces/
│   │   │       ├── BiometricLab/
│   │   │       ├── CognitiveLab/
│   │   │       └── RecoverySuite/
│   │   │
│   │   ├── SectionD/       # Week 9
│   │   │   └── VerticalFarm/
│   │   │       ├── HydroponicsSystem/
│   │   │       └── RoboticGrassSystem/
│   │   │
│   │   ├── SectionE/       # Week 9
│   │   │   └── ControlRoom/
│   │   │       ├── Dashboard.tsx
│   │   │       └── AlertManager.tsx
│   │   │
│   │   └── SectionF/       # Week 10
│   │       └── Parking/
│   │           └── TransportPods/
│   │
│   ├── courts/             # Week 7-8
│   │   ├── CourtMesh.tsx
│   │   ├── ClayCourtEffect.tsx
│   │   └── HeatMapOverlay.tsx
│   │
│   ├── systems/            # Week 9-10
│   │   ├── LightingSystem/
│   │   ├── WeatherSystem/
│   │   └── CharacterSystem/
│   │
│   └── shared/             # Week 5-6
│       ├── NavBar.tsx
│       ├── LoadingProvider.tsx
│       └── QualityBadge.tsx
│
├── types/                  # Week 1
│   ├── facility.ts
│   ├── components.ts
│   └── digitalTwin.ts
│
├── config/                 # Week 1
│   ├── facility.ts
│   └── environment.ts
│
└── state/                  # Week 4
    ├── store.ts
    └── slices/
```

---

## Risk Heat Map

```
CONSTRUCTION PHASES BY RISK LEVEL

HIGH RISK 🔴 (Structural failures = project failure)
┌──────────────────────────────────┐
│ PHASE 1: FOUNDATION (Week 1-2)  │
│   • Type system retrofitting     │
│   • Breaking existing components │
│   • Configuration conflicts      │
└──────────────────────────────────┘

MEDIUM RISK 🟡 (Delays possible, workarounds exist)
┌──────────────────────────────────┐
│ PHASE 2: STRUCTURE (Week 3-4)   │
│   • Circular dependencies        │
│   • State management complexity  │
│                                  │
│ PHASE 3: ENVELOPE (Week 5-6)    │
│   • 3D performance issues        │
│   • Asset loading problems       │
│                                  │
│ PHASE 4: Section B Courts (W7-8)│
│   • 24 courts performance        │
│   • Material shader complexity   │
└──────────────────────────────────┘

LOW RISK 🟢 (Independent, reversible work)
┌──────────────────────────────────┐
│ PHASE 4: Section A Reception    │
│ PHASE 4: Section C Health        │
│ PHASE 4: Section D Farm          │
│ PHASE 4: Section F Parking       │
│ PHASE 5: Documentation           │
└──────────────────────────────────┘

MITIGATION STRATEGY:
🔴 High Risk: Extra review, incremental approach, rollback plan
🟡 Medium Risk: Prototyping, performance testing, alternatives ready
🟢 Low Risk: Standard development process
```

---

## Integration Points Diagram

```
SYSTEM INTEGRATION ARCHITECTURE

┌─────────────────────────────────────────────────────────────┐
│                    ACE DIGITAL TWIN                         │
│                   (React Application)                       │
└─────────────────────────────────────────────────────────────┘
         │
         ├─── 🖥️  UI LAYER (PHASE 3: ENVELOPE) ─────────────┐
         │    ├─ Layout System                              │
         │    ├─ Navigation                                 │
         │    └─ 3D Viewport                                │
         │                                                   │
         ├─── 🧩 COMPONENT LAYER (PHASE 4: SYSTEMS) ────────┤
         │    ├─ Section A: Reception                       │
         │    ├─ Section B: Courts                          │
         │    ├─ Section C: Health                          │
         │    ├─ Section D: Farm                            │
         │    ├─ Section E: Control                         │
         │    └─ Section F: Parking                         │
         │                                                   │
         ├─── 🔄 STATE LAYER (PHASE 2: STRUCTURE) ──────────┤
         │    ├─ Facility State                             │
         │    ├─ Courts State                               │
         │    ├─ Sensor Data                                │
         │    └─ Autonomous Agents                          │
         │                                                   │
         ├─── 📐 TYPE LAYER (PHASE 1: FOUNDATION) ──────────┤
         │    ├─ TypeScript Definitions                     │
         │    ├─ Data Schemas                               │
         │    └─ Validation Rules                           │
         │                                                   │
         └─── 🔌 INTEGRATION LAYER (ONGOING) ───────────────┘
              ├─ Unity MCP (Digital Twin)
              ├─ Blender MCP (Asset Creation)
              ├─ Sensor APIs (Real-time Data)
              └─ Agent System (Autonomous Control)

EXTERNAL SYSTEMS (Future Integration)
    ↓
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  Unity Engine    │  │  Sensor Network  │  │  Agent System    │
│  (Digital Twin)  │  │  (IoT Devices)   │  │  (Autonomy)      │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

---

## Success Metrics Dashboard

```
PHASE COMPLETION GATES

PHASE 1: FOUNDATION ✅
┌────────────────────────────────────────┐
│ ✅ TypeScript strict mode: ON          │
│ ✅ Configuration files: 100%           │
│ ✅ Data validation: Zod integrated     │
│ ✅ No magic numbers: 0 violations      │
└────────────────────────────────────────┘

PHASE 2: STRUCTURE ⏳
┌────────────────────────────────────────┐
│ ⏳ Component hierarchy: In progress    │
│ ⏳ Circular dependencies: 0 remaining  │
│ ⏳ Routes defined: 8/8 sections        │
│ ⏳ State management: Configured        │
└────────────────────────────────────────┘

PHASE 3: ENVELOPE ⏳
┌────────────────────────────────────────┐
│ ⏳ Responsive breakpoints: 3/3         │
│ ⏳ Design tokens: Defined              │
│ ⏳ 3D FPS: 60 sustained                │
│ ⏳ Asset loading: Progressive          │
└────────────────────────────────────────┘

PHASE 4: SYSTEMS ⏳
┌────────────────────────────────────────┐
│ ⏳ Section A (Reception): 0%           │
│ ⏳ Section B (Courts): 0%              │
│ ⏳ Section C (Health): 0%              │
│ ⏳ Section D (Farm): 0%                │
│ ⏳ Section E (Control): 0%             │
│ ⏳ Section F (Parking): 0%             │
│ ⏳ Autonomous Systems: 0%              │
└────────────────────────────────────────┘

PHASE 5: FINISHES ⏳
┌────────────────────────────────────────┐
│ ⏳ Lighthouse score: 0 (target: >90)   │
│ ⏳ Test coverage: 0% (target: >80%)    │
│ ⏳ Load time: N/A (target: <3s)        │
│ ⏳ Production: Not deployed            │
└────────────────────────────────────────┘
```

---

## Architect's Visual Metaphor

```
BUILDING A FACILITY (Physical Construction)
            ↓
    ┌─────────────┐
    │ FOUNDATION  │  Pour concrete, utilities hookup
    └──────┬──────┘
           ↓
    ┌─────────────┐
    │ STRUCTURE   │  Steel frame, floors, roof
    └──────┬──────┘
           ↓
    ┌─────────────┐
    │ ENVELOPE    │  Exterior walls, windows, weatherproofing
    └──────┬──────┘
           ↓
    ┌─────────────┐
    │ SYSTEMS     │  HVAC, electrical, plumbing, elevators
    └──────┬──────┘
           ↓
    ┌─────────────┐
    │ FINISHES    │  Paint, flooring, fixtures, landscaping
    └─────────────┘

BUILDING A CODEBASE (Software Construction)
            ↓
    ┌─────────────┐
    │ FOUNDATION  │  Types, config, data models
    └──────┬──────┘
           ↓
    ┌─────────────┐
    │ STRUCTURE   │  Architecture, routing, state
    └──────┬──────┘
           ↓
    ┌─────────────┐
    │ ENVELOPE    │  Layout, theme, 3D scene
    └──────┬──────┘
           ↓
    ┌─────────────┐
    │ SYSTEMS     │  Features, sections, integrations
    └──────┬──────┘
           ↓
    ┌─────────────┐
    │ FINISHES    │  Performance, tests, docs, deploy
    └─────────────┘

THE METAPHOR WORKS BECAUSE:
- You can't skip steps
- Each phase depends on the previous
- Rushing foundation = expensive fixes later
- Systems can be installed in parallel (Week 7-10)
- Finishes are last (no point in painting before walls exist)
```

---

**Document Purpose**: Visual companion to `construction-phases.md`
**Audience**: Swarm agents, project stakeholders, developers
**Next Update**: After Phase 1 completion
**Maintained By**: architect-coordinator agent
