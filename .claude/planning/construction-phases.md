# Industrial Construction Phases for ACE Facility Migration
**Architect**: Industrial Architect Coordinator
**Date**: 2025-11-22
**Methodology**: Industrial Construction Sequencing (Foundation → Structure → Envelope → Systems → Finishes)

---

## Executive Summary

This document applies industrial construction methodology to the ACE facility migration from current 3D visualization (React Three Fiber) to a comprehensive autonomous facility digital twin. Like building a real facility, we must establish foundations before walls, structure before systems, and infrastructure before aesthetics.

**Key Insight**: The facility has 30+ components already built but lacks systematic organization. We need to retrofit the foundation under an existing structure while preparing for expansion.

---

## Construction Philosophy

### Industrial Construction Principles Applied to Code Migration

1. **Foundation First**: Core infrastructure, type systems, data models
2. **Structure**: Component architecture, routing, state management
3. **Envelope**: UI shell, navigation, layout systems
4. **Interior Systems**: Feature modules, autonomous systems, integrations
5. **Finishes**: Polish, performance, documentation, deployment

### Critical Path Identification

**Load-bearing elements** that other work depends on:
- Type definitions (foundation)
- Component architecture patterns (structure)
- Navigation/routing system (envelope)
- State management (systems)
- Digital twin integration layer (systems)

---

## Phase 1: FOUNDATION (Weeks 1-2)
**Goal**: Establish stable infrastructure before any refactoring

### 1.1 Type System Foundation
**Rationale**: Like surveying land and pouring foundation slabs—everything builds on this.

**Deliverables**:
- [ ] `/src/types/facility.ts` - Facility section definitions (A-F)
- [ ] `/src/types/components.ts` - Component interfaces and props
- [ ] `/src/types/digitalTwin.ts` - Unity/Blender integration types
- [ ] `/src/types/autonomous.ts` - Agent system interfaces
- [ ] `/src/types/sensors.ts` - IoT and monitoring types

**Dependencies**: None (this IS the foundation)

**Success Criteria**:
- ✅ All TypeScript strict mode enabled
- ✅ No `any` types in core infrastructure
- ✅ Type exports centralized in `/src/types/index.ts`

### 1.2 Configuration & Constants
**Rationale**: Like utilities hookups—needed before anything else can function.

**Deliverables**:
- [ ] `/src/config/facility.ts` - Court layouts, dimensions, sections
- [ ] `/src/config/environment.ts` - Build/deploy configuration
- [ ] `/src/constants/` - Physical constants, sensor ranges, thresholds

**Dependencies**: Type system (1.1)

**Success Criteria**:
- ✅ All magic numbers eliminated from components
- ✅ Environment-specific configs externalized
- ✅ Physical specifications match facility-blueprint.md

### 1.3 Data Models & Schemas
**Rationale**: Like structural engineering drawings—define what we're building.

**Deliverables**:
- [ ] Court data models (24 courts × 4 types)
- [ ] Facility section models (A: Reception → F: Parking)
- [ ] Member/user data schemas
- [ ] Sensor data formats
- [ ] Digital twin state models

**Dependencies**: Type system (1.1)

**Success Criteria**:
- ✅ Zod or similar validation for all data
- ✅ JSON schemas for external integrations
- ✅ Database-ready models (future-proofed)

---

## Phase 2: STRUCTURE (Weeks 3-4)
**Goal**: Build the architectural framework that all features attach to

### 2.1 Component Architecture Patterns
**Rationale**: Like steel framing—defines how everything connects.

**Deliverables**:
- [ ] `/src/components/core/` - Reusable primitives (3D mesh wrappers, hooks)
- [ ] `/src/components/facility/` - Section-specific components
- [ ] `/src/components/courts/` - Court visualization components
- [ ] `/src/components/systems/` - Autonomous systems UI
- [ ] Component composition guidelines

**Current Components to Reorganize**:
```
From flat structure:
src/components/*.tsx (46 files)

To hierarchical structure:
src/
├── components/
│   ├── core/          # Primitives (Grass, DebugLogger, ErrorBoundary)
│   ├── facility/      # Sections A-F
│   │   ├── SectionA/  # Reception (ReceptionArea.tsx)
│   │   ├── SectionB/  # Courts (ThreeScene, court components)
│   │   ├── SectionC/  # Health (BiometricLab, CognitiveLab, RecoverySuite)
│   │   ├── SectionD/  # Vertical Farm (HydroponicsSystem, RoboticGrassSystem)
│   │   ├── SectionE/  # Control Room (BMSControlRoom)
│   │   └── SectionF/  # Parking (TransportPods)
│   ├── courts/        # Tennis court specifics
│   ├── systems/       # Lighting, Weather, Character
│   └── shared/        # NavBar, QualityBadge, LoadingProvider
```

**Dependencies**: Foundation phase complete (1.1-1.3)

**Success Criteria**:
- ✅ No circular dependencies
- ✅ Clear component hierarchy (max 3 levels deep)
- ✅ Shared components extracted to /core or /shared
- ✅ Each section self-contained in its directory

### 2.2 Routing & Navigation
**Rationale**: Like hallways and circulation—how users move through the facility.

**Deliverables**:
- [ ] React Router setup with facility sections as routes
- [ ] Navigation state management
- [ ] Breadcrumb system
- [ ] Deep linking to specific courts/areas

**Route Structure**:
```
/                      # Landing page
/facility              # Full 3D overview
/facility/section-a    # Reception area
/facility/section-b    # Tennis courts
  /facility/section-b/court/:id  # Specific court
/facility/section-c    # Health optimization
/facility/section-d    # Vertical farm
/facility/section-e    # Control room
/facility/section-f    # Parking
/admin                 # Control panel (BMSControlRoom)
```

**Dependencies**: Component architecture (2.1)

**Success Criteria**:
- ✅ All facility sections accessible via routes
- ✅ Browser back/forward works correctly
- ✅ URL state persists 3D camera position
- ✅ Deep links shareable

### 2.3 State Management Architecture
**Rationale**: Like electrical and plumbing systems—power and data flow.

**Deliverables**:
- [ ] Global state slice definitions
- [ ] Context providers for facility data
- [ ] State persistence strategy (localStorage, IndexedDB)
- [ ] Real-time data synchronization hooks

**State Slices**:
```typescript
interface AppState {
  facility: FacilityState;      // Current section, navigation
  courts: CourtsState;          // Court status, schedules
  digitalTwin: DigitalTwinState; // Unity/Blender sync
  sensors: SensorsState;        // Real-time IoT data
  autonomous: AutonomousState;  // Agent system status
  user: UserState;              // Member data, preferences
}
```

**Dependencies**: Data models (1.3), Component architecture (2.1)

**Success Criteria**:
- ✅ Zustand or Redux Toolkit configured
- ✅ Type-safe state updates
- ✅ DevTools integration
- ✅ State persistence working

---

## Phase 3: ENVELOPE (Weeks 5-6)
**Goal**: Create the visual shell and user interface framework

### 3.1 Layout System & UI Shell
**Rationale**: Like building envelope—weather-tight before interior work.

**Deliverables**:
- [ ] Master layout component with responsive breakpoints
- [ ] Navigation shell (header, sidebar, breadcrumbs)
- [ ] 3D viewport container with controls
- [ ] Modal/overlay system for detail views

**Layout Hierarchy**:
```
<App>
  <AppLayout>
    <NavigationHeader />
    <FacilitySidebar />
    <MainViewport>
      <Canvas>
        {/* 3D scene */}
      </Canvas>
      <OverlayControls />
    </MainViewport>
    <StatusFooter />
  </AppLayout>
</App>
```

**Dependencies**: Routing (2.2), State management (2.3)

**Success Criteria**:
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Consistent spacing and typography
- ✅ Accessibility (ARIA, keyboard navigation)
- ✅ Loading states handled gracefully

### 3.2 Design System & Theme
**Rationale**: Like architectural finishes spec—consistent materials throughout.

**Deliverables**:
- [ ] Color palette (primary, secondary, semantic colors)
- [ ] Typography scale
- [ ] Component library (buttons, inputs, cards)
- [ ] Tailwind/CSS configuration
- [ ] Dark mode support

**Dependencies**: Layout system (3.1)

**Success Criteria**:
- ✅ Design tokens defined and used consistently
- ✅ Component storybook or documentation
- ✅ Theme switching works
- ✅ Matches facility brand identity

### 3.3 3D Scene Management
**Rationale**: Like curtain wall installation—major visible system.

**Deliverables**:
- [ ] Scene loader with lazy loading
- [ ] Camera controller (orbit, first-person, preset views)
- [ ] Level-of-detail (LOD) system for performance
- [ ] Asset loading progress indicators

**Current Assets to Organize**:
- ThreeScene.tsx → Scene orchestrator
- BasicThreeScene.tsx → Testing scaffold
- TestScene.tsx → Development sandbox
- Grass.tsx, ClayCourtEffect.tsx → Material components

**Dependencies**: Component architecture (2.1), Layout system (3.1)

**Success Criteria**:
- ✅ 60 FPS on mid-range hardware
- ✅ Smooth camera transitions
- ✅ Assets load progressively
- ✅ WebGL context managed properly

---

## Phase 4: INTERIOR SYSTEMS (Weeks 7-10)
**Goal**: Build out feature modules for each facility section

### 4.1 Section B: Tennis Courts Module
**Rationale**: Core product—like HVAC installation, critical and complex.

**Current Components**:
- Court rendering (24 courts × 4 surfaces)
- Grass shader system
- Clay court effects
- Court labeling (court-labels-3d-fix.md)
- HeatMap overlays

**Deliverables**:
- [ ] Court grid layout (4×6 or optimized configuration)
- [ ] Surface type visualization (grass, clay, hard, carpet)
- [ ] Court status indicators (occupied, maintenance, available)
- [ ] Interactive court selection
- [ ] Court detail view with stats

**Dependencies**: 3D scene management (3.3), State management (2.3)

**Success Criteria**:
- ✅ All 24 courts render correctly
- ✅ Surface materials match specifications
- ✅ Performance: <16ms frame time with all courts visible
- ✅ Court labels readable from all angles

### 4.2 Section A: Reception & Entry
**Rationale**: First impression—like lobby finishes.

**Current Components**:
- ReceptionArea.tsx

**Deliverables**:
- [ ] Reception desk with check-in flow
- [ ] Member kiosk system
- [ ] Wayfinding displays
- [ ] Entry sequence (exterior → lobby → facility)

**Dependencies**: Layout system (3.1), Navigation (2.2)

**Success Criteria**:
- ✅ Seamless entry experience
- ✅ Check-in integration points defined
- ✅ Accessible wayfinding

### 4.3 Section C: Health Optimization Spaces
**Rationale**: Premium amenity—like spa finishes.

**Current Components**:
- BiometricLab.tsx
- CognitiveLab.tsx
- RecoverySuite.tsx
- MovementStudio.tsx

**Deliverables**:
- [ ] Health assessment flow
- [ ] Recovery suite booking system
- [ ] Biometric data visualization
- [ ] Cognitive training interfaces

**Dependencies**: State management (2.3), Layout system (3.1)

**Success Criteria**:
- ✅ All health spaces accessible
- ✅ Member data privacy maintained
- ✅ Integration with Blueprint protocol concepts

### 4.4 Section D: Vertical Farm System
**Rationale**: Unique feature—like central atrium, showcase element.

**Current Components**:
- HydroponicsSystem.tsx
- RoboticGrassSystem.tsx

**Deliverables**:
- [ ] 3-floor vertical farm visualization
- [ ] Grow cycle monitoring
- [ ] Robotic grass swap system
- [ ] Integration with kitchen/nutrition

**Dependencies**: 3D scene (3.3), Autonomous systems (4.6)

**Success Criteria**:
- ✅ 3D farm structure visible
- ✅ Grass growth cycles visualized
- ✅ Robot paths shown
- ✅ Environmental data displayed

### 4.5 Section E: Control Room & NOC
**Rationale**: Operational nerve center—like building automation system.

**Current Components**:
- BMSControlRoom.tsx

**Deliverables**:
- [ ] Facility-wide monitoring dashboard
- [ ] System status indicators
- [ ] Alert management
- [ ] Manual override controls

**Dependencies**: State management (2.3), All facility sections (4.1-4.4)

**Success Criteria**:
- ✅ Real-time status of all sections
- ✅ Alert prioritization working
- ✅ Override controls functional
- ✅ Incident logging

### 4.6 Autonomous Systems Integration
**Rationale**: Like smart building systems—IoT and automation.

**Current Components**:
- LightingSystem.tsx
- WeatherSystem.tsx
- CharacterSystem.tsx (player tracking)

**Deliverables**:
- [ ] Lighting control system
- [ ] Weather/climate simulation
- [ ] Player tracking and AI characters
- [ ] Agent system visualization

**Dependencies**: Sensor types (1.1), State management (2.3)

**Success Criteria**:
- ✅ Lighting responds to time/conditions
- ✅ Weather effects realistic
- ✅ Character movement natural
- ✅ Agent decisions visualized

### 4.7 Section F: Parking & EV Infrastructure
**Rationale**: Arrival experience—like landscape and approach.

**Current Components**:
- TransportPods.tsx

**Deliverables**:
- [ ] Parking structure 3D model
- [ ] EV charging station visualization
- [ ] Capacity monitoring
- [ ] Arrival sequence

**Dependencies**: 3D scene (3.3), Layout (3.1)

**Success Criteria**:
- ✅ Parking structure visible in campus view
- ✅ EV charging status shown
- ✅ Entry/exit flow clear

---

## Phase 5: FINISHES & COMMISSIONING (Weeks 11-12)
**Goal**: Polish, performance, testing, documentation

### 5.1 Performance Optimization
**Rationale**: Like HVAC balancing—make everything run smoothly.

**Current Components**:
- PerformanceMetrics.tsx
- DebugLogger.tsx
- ErrorBoundary.tsx

**Deliverables**:
- [ ] Performance profiling and optimization
- [ ] Asset compression and CDN setup
- [ ] Code splitting and lazy loading
- [ ] Memory leak detection and fixes

**Dependencies**: All feature modules (4.1-4.7)

**Success Criteria**:
- ✅ Lighthouse score >90
- ✅ Initial load <3 seconds
- ✅ 60 FPS sustained
- ✅ Memory stable over time

### 5.2 Quality Assurance & Testing
**Rationale**: Like building inspection—verify everything works.

**Deliverables**:
- [ ] Unit tests for business logic
- [ ] Integration tests for key flows
- [ ] Visual regression tests
- [ ] Accessibility audit

**Dependencies**: All features complete (4.1-4.7)

**Success Criteria**:
- ✅ >80% code coverage
- ✅ All critical paths tested
- ✅ WCAG AA compliance
- ✅ Cross-browser compatibility

### 5.3 Documentation & Knowledge Transfer
**Rationale**: Like O&M manuals—operators need to understand the system.

**Deliverables**:
- [ ] Component documentation (Storybook or similar)
- [ ] Architecture decision records (ADRs)
- [ ] Deployment guides
- [ ] User guides for facility features

**Dependencies**: All phases complete

**Success Criteria**:
- ✅ All components documented
- ✅ ADRs explain key decisions
- ✅ Deployment automated
- ✅ User guides clear and tested

### 5.4 Deployment & Launch
**Rationale**: Like certificate of occupancy—ready for use.

**Deliverables**:
- [ ] Production build configuration
- [ ] CI/CD pipeline setup
- [ ] Monitoring and alerting
- [ ] Rollback procedures

**Dependencies**: QA complete (5.2), Documentation (5.3)

**Success Criteria**:
- ✅ Production deployment successful
- ✅ Monitoring dashboards live
- ✅ Rollback tested
- ✅ Launch checklist complete

---

## Critical Path Analysis

### Must Complete Before Phase 2:
1. Type system (1.1)
2. Configuration (1.2)
3. Data models (1.3)

**Rationale**: Foundation must cure before framing begins.

### Must Complete Before Phase 3:
1. Component architecture (2.1)
2. Routing (2.2)
3. State management (2.3)

**Rationale**: Structure must be complete before envelope can attach.

### Must Complete Before Phase 4:
1. Layout system (3.1)
2. 3D scene management (3.3)

**Rationale**: Can't install systems without envelope sealed.

### Must Complete Before Phase 5:
1. All section modules (4.1-4.7)

**Rationale**: Can't commission what isn't built.

---

## Facility Section Mapping

### Documentation → Implementation Mapping

| Facility Section | Documentation Source | Current Components | Migration Priority |
|-----------------|---------------------|-------------------|-------------------|
| **Section A: Reception** | facility-blueprint.md § 2.1 | ReceptionArea.tsx | Phase 4.2 (Week 7) |
| **Section B: Tennis Courts** | FACILITY-MASTER-OVERVIEW.md | ThreeScene.tsx, court components | Phase 4.1 (Week 7-8) |
| **Section C: Health Optimization** | APEX-Facility-Summary.md | BiometricLab, CognitiveLab, RecoverySuite | Phase 4.3 (Week 8) |
| **Section D: Vertical Farm** | facility-architecture.md § Farming | HydroponicsSystem, RoboticGrassSystem | Phase 4.4 (Week 9) |
| **Section E: Control Room** | building-sections-ef-specs.md | BMSControlRoom.tsx | Phase 4.5 (Week 9) |
| **Section F: Parking** | building-sections-ef-specs.md | TransportPods.tsx | Phase 4.7 (Week 10) |
| **Autonomous Systems** | digital-twin-architecture.md | Lighting, Weather, Character systems | Phase 4.6 (Week 9-10) |

---

## Risk Management

### High-Risk Areas (Like Structural Steel)

1. **3D Performance**: Real-time rendering of 24 courts + facility
   - **Mitigation**: LOD system, asset optimization, progressive loading
   - **Fallback**: Static 2D floor plan views

2. **State Complexity**: Multiple data sources (Unity, sensors, user input)
   - **Mitigation**: Clear state architecture (Phase 2.3)
   - **Fallback**: Simplified state model with manual refresh

3. **Type Safety**: Retrofitting types to 30+ existing components
   - **Mitigation**: Incremental typing with `@ts-ignore` strategy
   - **Fallback**: Gradual migration, not big-bang rewrite

### Medium-Risk Areas (Like MEP Coordination)

1. **Component Dependencies**: Circular imports, tight coupling
   - **Mitigation**: Dependency graph analysis in Phase 2.1
   - **Fallback**: Temporary adapter pattern

2. **Digital Twin Integration**: Unity/Blender MCP servers
   - **Mitigation**: Mock interfaces first, real integration later
   - **Fallback**: Static 3D models without live sync

### Low-Risk Areas (Like Interior Paint)

1. **Visual Design**: Theme and styling
   - **Mitigation**: Design system early (Phase 3.2)
   - **Fallback**: Basic styling works, refinement optional

2. **Documentation**: ADRs and guides
   - **Mitigation**: Write as you go (ongoing)
   - **Fallback**: Code comments sufficient

---

## Dependencies Between Phases

### Sequential Dependencies (Cannot Parallelize)

```
Phase 1: FOUNDATION
    ↓ (Must complete before starting)
Phase 2: STRUCTURE
    ↓ (Must complete before starting)
Phase 3: ENVELOPE
    ↓ (Must complete before starting)
Phase 4: INTERIOR SYSTEMS
    ↓ (Must complete before starting)
Phase 5: FINISHES
```

### Parallel Opportunities Within Phases

**Phase 4 (Interior Systems)** can have sections built in parallel:
- Section A (Reception) ∥ Section B (Courts) ∥ Section C (Health)
- Section D (Farm) ∥ Section E (Control) ∥ Section F (Parking)
- Autonomous Systems can progress alongside sections

**Constraint**: All depend on Phase 3 (Envelope) being complete.

---

## Success Metrics

### Foundation Complete (End of Phase 1)
- ✅ 100% TypeScript strict compliance
- ✅ All configuration externalized
- ✅ Data models validated with Zod

### Structure Complete (End of Phase 2)
- ✅ Zero circular dependencies
- ✅ Routing to all facility sections
- ✅ State management operational

### Envelope Complete (End of Phase 3)
- ✅ Responsive layout on all devices
- ✅ Design system implemented
- ✅ 3D scene rendering smoothly

### Systems Complete (End of Phase 4)
- ✅ All 6 facility sections functional
- ✅ Autonomous systems integrated
- ✅ Digital twin connection established

### Commissioning Complete (End of Phase 5)
- ✅ Performance targets met
- ✅ Tests passing with >80% coverage
- ✅ Production deployment successful

---

## Phased Deliverable Schedule

| Week | Phase | Deliverables | Dependencies | Risk Level |
|------|-------|--------------|--------------|------------|
| 1 | Foundation | Type system, Config, Data models | None | 🔴 High |
| 2 | Foundation | Type system complete, Validation | Week 1 | 🔴 High |
| 3 | Structure | Component architecture | Week 1-2 | 🟡 Medium |
| 4 | Structure | Routing, State management | Week 3 | 🟡 Medium |
| 5 | Envelope | Layout system, UI shell | Week 3-4 | 🟢 Low |
| 6 | Envelope | Design system, 3D scene manager | Week 5 | 🟡 Medium |
| 7 | Interior | Section A + Section B (courts) start | Week 5-6 | 🟡 Medium |
| 8 | Interior | Section B complete, Section C (health) | Week 7 | 🟡 Medium |
| 9 | Interior | Section D (farm), Section E (control) | Week 7-8 | 🟢 Low |
| 10 | Interior | Section F (parking), Autonomous systems | Week 9 | 🟢 Low |
| 11 | Finishes | Performance optimization, Testing | Week 7-10 | 🟡 Medium |
| 12 | Finishes | Documentation, Deployment | Week 11 | 🟢 Low |

---

## Integration with Inventory System

### Awaiting Inventory Deliverables

This construction plan will be **validated and refined** once these inventory files are created:

1. **Documentation Inventory** (`../inventory/documentation-inventory.md`)
   - Confirms facility sections documented
   - Identifies specification gaps
   - Maps docs to implementation needs

2. **Implementation Inventory** (`../inventory/implementation-inventory.md`)
   - Catalogs all 30+ React components
   - Maps components to facility sections
   - Identifies code organization issues
   - Assesses component completion status

3. **Gap Analysis** (`../inventory/gap-analysis.md`)
   - Lists missing implementations
   - Prioritizes development work
   - Informs construction phase priorities

### Refinement Process

Once inventories complete:
1. **Validate section mapping**: Ensure all facility sections have doc + code coverage
2. **Adjust phase priorities**: Reorder based on completion gaps
3. **Update dependencies**: Refine critical path based on actual component relationships
4. **Revise timeline**: Adjust week estimates based on inventory findings

---

## Next Actions

### For Swarm Coordinator
1. ✅ Review this construction-phases.md
2. ⏳ Wait for inventory agents to complete their work
3. ⏳ Validate phase assignments against inventories
4. ⏳ Approve or request refinements to this plan

### For Documentation Agents
- Create `../inventory/documentation-inventory.md`
- Map docs to facility sections A-F
- Identify specification completeness

### For Code Analysis Agents
- Create `../inventory/implementation-inventory.md`
- Catalog all components by facility section
- Assess completion status of each section

### For Priority Strategist
- Review this construction sequence
- Propose adjustments based on business priorities
- Identify "quick wins" vs. "long poles"

### For Gap Analyzer
- Create `../inventory/gap-analysis.md`
- Prioritize missing implementations
- Inform Phase 4 work breakdown

---

## Architect's Notes

### Why Industrial Construction Methodology?

Traditional software project management often jumps between features chaotically. Industrial construction teaches us:

1. **Sequential Dependencies Matter**: You can't install drywall before framing
2. **Foundation Failures Are Expensive**: Type system errors compound
3. **Systems Integration Is Critical**: Everything must connect smoothly
4. **Commissioning Validates Assumptions**: Test at the end, not just during

### Why 5 Phases?

This matches proven construction project phasing:
1. **Site Prep & Foundation** (Types, Config, Models)
2. **Structure** (Architecture, Routing, State)
3. **Envelope** (Layout, Theme, Scene)
4. **Systems** (Features, Integrations)
5. **Finishes & Commissioning** (Polish, Test, Deploy)

### What Makes This Different?

Most migrations are "renovate while occupied"—users suffer disruptions. This plan treats it like building a new facility adjacent to the old one:

1. **Phase 1-3**: Build new infrastructure (users unaffected)
2. **Phase 4**: Migrate sections one by one (minimal disruption)
3. **Phase 5**: Grand opening of new facility (big-bang cutover)

### Flexibility Built In

While phases are sequential, **section modules (Phase 4) can be reordered** based on:
- Business priorities (e.g., court visualization first)
- Resource availability (e.g., Unity integration delayed)
- Risk mitigation (e.g., parking last as lowest risk)

---

**Document Status**: 🟡 PRELIMINARY—Awaiting inventory completion
**Review Required**: Yes—by swarm coordinator and other planning agents
**Next Update**: After documentation and implementation inventories complete
**Estimated Refinement Time**: 2-4 hours post-inventory
