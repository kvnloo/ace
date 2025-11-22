# Integration Flow Diagram
## Visual Component & Data Flow Map

**Generated**: 2025-11-22

---

## 1. Component Tree (Simplified Visual)

```
┌──────────────────────────────────────────────────────────────────────────┐
│                           BROWSER WINDOW                                 │
│ ┌──────────────────────────────────────────────────────────────────────┐ │
│ │ <html>                                                               │ │
│ │ ├─ <head>                                                            │ │
│ │ │  ├─ Tailwind CDN                                                   │ │
│ │ │  ├─ Google Fonts (Inter)                                           │ │
│ │ │  └─ Global CSS                                                     │ │
│ │ └─ <body>                                                            │ │
│ │    └─ <div id="root">                                                │ │
│ └──────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ ReactDOM.createRoot()
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ REACT ROOT (index.tsx)                                                   │
│ ┌──────────────────────────────────────────────────────────────────────┐ │
│ │ <React.StrictMode>                                                   │ │
│ │   └─ <App />                                                         │ │
│ └──────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ APP COMPONENT (App.tsx)                                                  │
│ ┌──────────────────────────────────────────────────────────────────────┐ │
│ │ STATE:                                                               │ │
│ │ • currentView: View                                                  │ │
│ │ • selectedFeature: FeatureData | null                                │ │
│ │                                                                      │ │
│ │ LAYOUT:                                                              │ │
│ │ ┌────────────────────────────────────────────────────────────────┐ │ │
│ │ │ <NavBar />                                    (Always Visible) │ │ │
│ │ └────────────────────────────────────────────────────────────────┘ │ │
│ │                                                                      │ │
│ │ ┌────────────────────────────────────────────────────────────────┐ │ │
│ │ │ <main className="h-screen pt-20">                              │ │ │
│ │ │   <AnimatePresence mode="wait">                                │ │ │
│ │ │                                                                 │ │ │
│ │ │     {currentView === HOME && <HomeView />}                     │ │ │
│ │ │     {currentView === SPECIFICATIONS && <Specifications />}     │ │ │
│ │ │     {currentView === FACILITY_DEMO && <ThreeSceneView />} ◄────┼─┼─┼─┐
│ │ │     {currentView === AMENITIES && <AmenitiesView />}           │ │ │ │
│ │ │     {currentView === INVEST && <InvestView />}                 │ │ │ │
│ │ │                                                                 │ │ │ │
│ │ │   </AnimatePresence>                                            │ │ │ │
│ │ │ </main>                                                         │ │ │ │
│ │ └────────────────────────────────────────────────────────────────┘ │ │ │
│ │                                                                      │ │ │
│ │ ┌────────────────────────────────────────────────────────────────┐ │ │ │
│ │ │ <AIChat />                                    (Always Visible) │ │ │ │
│ │ └────────────────────────────────────────────────────────────────┘ │ │ │
│ └──────────────────────────────────────────────────────────────────────┘ │ │
└──────────────────────────────────────────────────────────────────────────┘ │
                                                                              │
         CRITICAL PATH: FACILITY_DEMO VIEW                                   │
         ═══════════════════════════════════════════════════════════════════│══
                                                                              │
┌──────────────────────────────────────────────────────────────────────────┐ │
│ FACILITY DEMO VIEW (App.tsx Lines 154-209)                              │ │
│ ┌──────────────────────────────────────────────────────────────────────┐ │ │
│ │ <motion.div className="w-full h-full relative">                     │ │ │
│ │                                                                      │ │ │
│ │   ┌──────────────────────────────────────────────────────────────┐ │ │ │
│ │   │ LAYER 1: 3D Scene (z-0)                                      │ │ │ │
│ │   │ <div className="absolute inset-0 z-0">                       │ │ │ │
│ │   │   <ThreeScene onFeatureSelect={setSelectedFeature} /> ◄──────┼─┼─┼─┘
│ │   │ </div>                                                        │ │ │
│ │   └──────────────────────────────────────────────────────────────┘ │ │
│ │                                                                      │ │
│ │   ┌──────────────────────────────────────────────────────────────┐ │ │
│ │   │ LAYER 2: HUD Overlay (z-10)                                  │ │ │
│ │   │ <div className="absolute inset-0 z-10 pointer-events-none">  │ │ │
│ │   │                                                               │ │ │
│ │   │   ┌───────────────────────────────────────────────────────┐ │ │ │
│ │   │   │ Title & Description                                   │ │ │ │
│ │   │   └───────────────────────────────────────────────────────┘ │ │ │
│ │   │                                                               │ │ │
│ │   │   ┌───────────────────────────────────────────────────────┐ │ │ │
│ │   │   │ {selectedFeature && <FeatureInfoCard />}              │ │ │ │
│ │   │   │ • Triggered by ThreeScene callback                    │ │ │ │
│ │   │   │ • Displays feature.title, description, icon           │ │ │ │
│ │   │   │ • "View Full Specs" → setCurrentView(SPECIFICATIONS) │ │ │ │
│ │   │   └───────────────────────────────────────────────────────┘ │ │ │
│ │   │                                                               │ │ │
│ │   │ </div>                                                        │ │ │
│ │   └──────────────────────────────────────────────────────────────┘ │ │
│ │                                                                      │ │
│ │ </motion.div>                                                        │ │
│ └──────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ Props: { onFeatureSelect }
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ THREE SCENE COMPONENT (ThreeScene.tsx)                                   │
│ ┌──────────────────────────────────────────────────────────────────────┐ │
│ │ PROPS:                                                               │ │
│ │ • onFeatureSelect: (feature: FeatureData) => void                    │ │
│ │                                                                      │ │
│ │ STATE:                                                               │ │
│ │ • selectedId: string | null                                          │ │
│ │ • activeFloor: FloorLevel ('ALL' | 0 | 1 | 2 | 3)                   │ │
│ │ • annotationMode: AnnotationMode ('NONE'|'LABELS'|'MEASUREMENTS')   │ │
│ │ • controlsRef: React.RefObject<any>                                  │ │
│ │ • isAnimatingRef: React.MutableRefObject<boolean>                    │ │
│ │                                                                      │ │
│ │ STRUCTURE:                                                           │ │
│ │ <div className="w-full h-full absolute inset-0">                    │ │
│ │                                                                      │ │
│ │   ┌──────────────────────────────────────────────────────────────┐ │ │
│ │   │ HTML CONTROLS OVERLAY (Outside Canvas)                       │ │ │
│ │   │ <ControlsOverlay                                             │ │ │
│ │   │   activeFloor={activeFloor}                                  │ │ │
│ │   │   setActiveFloor={setActiveFloor}                            │ │ │
│ │   │   annotationMode={annotationMode}                            │ │ │
│ │   │   setAnnotationMode={setAnnotationMode}                      │ │ │
│ │   │ />                                                            │ │ │
│ │   │                                                               │ │ │
│ │   │ Renders:                                                      │ │ │
│ │   │ ┌─────────────────────────────────────────────────────────┐ │ │ │
│ │   │ │ Floor Selector                                          │ │ │ │
│ │   │ │ ├─ L3: Farm                                             │ │ │ │
│ │   │ │ ├─ L2: Social                                           │ │ │ │
│ │   │ │ ├─ L1: Racquet                                          │ │ │ │
│ │   │ │ ├─ G: Tennis                                            │ │ │ │
│ │   │ │ └─ Full Facility                                        │ │ │ │
│ │   │ └─────────────────────────────────────────────────────────┘ │ │ │
│ │   │ ┌─────────────────────────────────────────────────────────┐ │ │ │
│ │   │ │ Annotation Toggles                                      │ │ │ │
│ │   │ │ ├─ Clean                                                │ │ │ │
│ │   │ │ ├─ Labels                                               │ │ │ │
│ │   │ │ └─ Dimensions                                           │ │ │ │
│ │   │ └─────────────────────────────────────────────────────────┘ │ │ │
│ │   └──────────────────────────────────────────────────────────────┘ │ │
│ │                                                                      │ │
│ │   ┌──────────────────────────────────────────────────────────────┐ │ │
│ │   │ R3F CANVAS (WebGL Context)                                   │ │ │
│ │   │ <Canvas shadows dpr={[1, 1.5]}>                              │ │ │
│ │   │                                                               │ │ │
│ │   │   ┌──────────────────────────────────────────────────────┐ │ │ │
│ │   │   │ CAMERA SYSTEM                                        │ │ │ │
│ │   │   ├──────────────────────────────────────────────────────┤ │ │ │
│ │   │   │ <CameraRig                                           │ │ │ │
│ │   │   │   activeFloor={activeFloor}                          │ │ │ │
│ │   │   │   controlsRef={controlsRef}                          │ │ │ │
│ │   │   │   isAnimatingRef={isAnimatingRef}                    │ │ │ │
│ │   │   │ />                                                    │ │ │ │
│ │   │   │                                                       │ │ │ │
│ │   │   │ • useFrame hook for smooth interpolation             │ │ │ │
│ │   │   │ • Animates camera to floor-specific viewpoints       │ │ │ │
│ │   │   │ • Stops animation when user interacts with controls  │ │ │ │
│ │   │   └──────────────────────────────────────────────────────┘ │ │ │
│ │   │                                                               │ │ │
│ │   │   ┌──────────────────────────────────────────────────────┐ │ │ │
│ │   │   │ LIGHTING SYSTEM                                      │ │ │ │
│ │   │   ├──────────────────────────────────────────────────────┤ │ │ │
│ │   │   │ <ambientLight intensity={0.4} />                     │ │ │ │
│ │   │   │ <directionalLight                                    │ │ │ │
│ │   │   │   position={[-80, 150, 100]}                         │ │ │ │
│ │   │   │   intensity={2}                                       │ │ │ │
│ │   │   │   castShadow                                         │ │ │ │
│ │   │   │   shadow-mapSize={[2048, 2048]}                      │ │ │ │
│ │   │   │ />                                                    │ │ │ │
│ │   │   │ <Environment preset="park" />                        │ │ │ │
│ │   │   └──────────────────────────────────────────────────────┘ │ │ │
│ │   │                                                               │ │ │
│ │   │   ┌──────────────────────────────────────────────────────┐ │ │ │
│ │   │   │ SCENE GRAPH                                          │ │ │ │
│ │   │   ├──────────────────────────────────────────────────────┤ │ │ │
│ │   │   │ <group>                                              │ │ │ │
│ │   │   │                                                       │ │ │ │
│ │   │   │   <BuildingShell activeFloor={activeFloor} />        │ │ │ │
│ │   │   │   • OrganicStructure (Zaha Hadid curves)             │ │ │ │
│ │   │   │   • Glass facade                                     │ │ │ │
│ │   │   │   • Solar roof panels                                │ │ │ │
│ │   │   │                                                       │ │ │ │
│ │   │   │   <CampusGrounds />                                  │ │ │ │
│ │   │   │   • Plaza pavement                                   │ │ │ │
│ │   │   │   • Outdoor courts (3)                               │ │ │ │
│ │   │   │   • ParkingLot                                       │ │ │ │
│ │   │   │   • Trees × 15                                       │ │ │ │
│ │   │   │                                                       │ │ │ │
│ │   │   │   {(activeFloor==='ALL'||activeFloor===0) &&         │ │ │ │
│ │   │   │     <GroundFloor                                     │ │ │ │
│ │   │   │       active={activeFloor===0}                       │ │ │ │
│ │   │   │       showMeasurements={showMeasurements}            │ │ │ │
│ │   │   │       showLabels={showLabels}                        │ │ │ │
│ │   │   │     />                                                │ │ │ │
│ │   │   │   }                                                   │ │ │ │
│ │   │   │   • FloorPlate (140m × 120m)                         │ │ │ │
│ │   │   │   • TennisCourt × 24 (6 each: Hard/Clay/Grass/Wood) │ │ │ │
│ │   │   │   • BleacherSection × 8 (600 seats total)           │ │ │ │
│ │   │   │   • ReceptionArea (south facade)                    │ │ │ │
│ │   │   │   • LockerRoom × 2 (east/west)                      │ │ │ │
│ │   │   │   • RoboticGrassSystem (grass courts)               │ │ │ │
│ │   │   │   • CourtLabel × 4 (floating 3D signs)              │ │ │ │
│ │   │   │                                                       │ │ │ │
│ │   │   │   {(activeFloor==='ALL'||activeFloor===1) &&         │ │ │ │
│ │   │   │     <LevelOne                                        │ │ │ │
│ │   │   │       active={activeFloor===1}                       │ │ │ │
│ │   │   │       showMeasurements={showMeasurements}            │ │ │ │
│ │   │   │     />                                                │ │ │ │
│ │   │   │   }                                                   │ │ │ │
│ │   │   │   • FloorPlate (120m × 100m)                         │ │ │ │
│ │   │   │   • BadmintonCourt × 16                              │ │ │ │
│ │   │   │   • Squash courts × 4 (glass enclosures)            │ │ │ │
│ │   │   │   • Table Tennis × 16                                │ │ │ │
│ │   │   │   • BMSControlRoom (15m × 10m)                       │ │ │ │
│ │   │   │   • MechanicalRooms (HVAC, electrical, water)       │ │ │ │
│ │   │   │                                                       │ │ │ │
│ │   │   │   {(activeFloor==='ALL'||activeFloor===2) &&         │ │ │ │
│ │   │   │     <LevelTwo                                        │ │ │ │
│ │   │   │       active={activeFloor===2}                       │ │ │ │
│ │   │   │       showMeasurements={showMeasurements}            │ │ │ │
│ │   │   │     />                                                │ │ │ │
│ │   │   │   }                                                   │ │ │ │
│ │   │   │   • FloorPlate (110m × 90m)                          │ │ │ │
│ │   │   │   • Pickleball courts × 8                            │ │ │ │
│ │   │   │   • RealTennisCourt (heritage court)                │ │ │ │
│ │   │   │   • GlassWalkway × 4 (360° perimeter)               │ │ │ │
│ │   │   │   • VIPViewingSuite × 6 (corners + mid-walls)       │ │ │ │
│ │   │   │   • Viewing cutouts (floor-to-floor visibility)     │ │ │ │
│ │   │   │   • Information kiosks × 8                           │ │ │ │
│ │   │   │                                                       │ │ │ │
│ │   │   │   {(activeFloor==='ALL'||activeFloor===3) &&         │ │ │ │
│ │   │   │     <LevelThree                                      │ │ │ │
│ │   │   │       active={activeFloor===3}                       │ │ │ │
│ │   │   │       showMeasurements={showMeasurements}            │ │ │ │
│ │   │   │     />                                                │ │ │ │
│ │   │   │   }                                                   │ │ │ │
│ │   │   │   • FloorPlate (120m × 100m)                         │ │ │ │
│ │   │   │   • HydroponicsSystem × 4 (500m² each)              │ │ │ │
│ │   │   │   • GreenWallBlock × 4 (external facades)           │ │ │ │
│ │   │   │                                                       │ │ │ │
│ │   │   │   <TransportPods showRoutes={showLabels} />          │ │ │ │
│ │   │   │   • Autonomous pod system with pathfinding           │ │ │ │
│ │   │   │                                                       │ │ │ │
│ │   │   │   {FEATURES.map(feature =>                            │ │ │ │
│ │   │   │     <Marker                                          │ │ │ │
│ │   │   │       key={feature.id}                               │ │ │ │
│ │   │   │       position={feature.position}                    │ │ │ │
│ │   │   │       title={feature.title}                          │ │ │ │
│ │   │   │       isSelected={selectedId === feature.id}         │ │ │ │
│ │   │   │       onClick={() => handleSelect(feature)} ◄────────┼─┼─┼─┐
│ │   │   │       visible={visible}                              │ │ │ │ │
│ │   │   │     />                                                │ │ │ │ │
│ │   │   │   )}                                                  │ │ │ │ │
│ │   │   │   • 6 feature hotspots with floating spheres         │ │ │ │ │
│ │   │   │   • Click triggers: setSelectedId + onFeatureSelect  │ │ │ │ │
│ │   │   │                                                       │ │ │ │ │
│ │   │   │   <ContactShadows                                    │ │ │ │ │
│ │   │   │     position={[0, -0.2, 0]}                          │ │ │ │ │
│ │   │   │     opacity={0.6}                                    │ │ │ │ │
│ │   │   │     scale={400}                                      │ │ │ │ │
│ │   │   │   />                                                  │ │ │ │ │
│ │   │   │                                                       │ │ │ │ │
│ │   │   │ </group>                                              │ │ │ │ │
│ │   │   └──────────────────────────────────────────────────────┘ │ │ │ │
│ │   │                                                               │ │ │ │
│ │   │   ┌──────────────────────────────────────────────────────┐ │ │ │ │
│ │   │   │ INTERACTION CONTROLS                                 │ │ │ │ │
│ │   │   ├──────────────────────────────────────────────────────┤ │ │ │ │
│ │   │   │ <OrbitControls                                       │ │ │ │ │
│ │   │   │   ref={controlsRef}                                  │ │ │ │ │
│ │   │   │   enablePan={true}                                   │ │ │ │ │
│ │   │   │   minPolarAngle={0}                                  │ │ │ │ │
│ │   │   │   maxPolarAngle={Math.PI / 2.1}                      │ │ │ │ │
│ │   │   │   minDistance={20}                                   │ │ │ │ │
│ │   │   │   maxDistance={400}                                  │ │ │ │ │
│ │   │   │   makeDefault                                        │ │ │ │ │
│ │   │   │   onStart={() => isAnimatingRef.current = false}     │ │ │ │ │
│ │   │   │ />                                                    │ │ │ │ │
│ │   │   │ • User interaction stops camera animation            │ │ │ │ │
│ │   │   │ • Drag to rotate                                     │ │ │ │ │
│ │   │   │ • Scroll to zoom (20-400 units)                      │ │ │ │ │
│ │   │   │ • Right-click to pan                                 │ │ │ │ │
│ │   │   └──────────────────────────────────────────────────────┘ │ │ │ │
│ │   │                                                               │ │ │ │
│ │   │ </Canvas>                                                     │ │ │ │
│ │   └──────────────────────────────────────────────────────────────┘ │ │ │
│ │                                                                      │ │ │
│ │   ┌──────────────────────────────────────────────────────────────┐ │ │ │
│ │   │ Footer Text (Version Info)                                   │ │ │ │
│ │   │ className="absolute bottom-8 left-1/2"                       │ │ │ │
│ │   └──────────────────────────────────────────────────────────────┘ │ │ │
│ │                                                                      │ │ │
│ │ </div>                                                               │ │ │
│ └──────────────────────────────────────────────────────────────────────┘ │ │
└──────────────────────────────────────────────────────────────────────────┘ │
                                                                              │
                    DATA FLOW: FEATURE SELECTION                              │
                    ══════════════════════════════════════════════════════════│══
                                                                              │
┌──────────────────────────────────────────────────────────────────────────┐ │
│ EVENT FLOW SEQUENCE                                                      │ │
│ ┌──────────────────────────────────────────────────────────────────────┐ │ │
│ │                                                                      │ │ │
│ │ 1. USER ACTION: Click on Marker                                     │ │ │
│ │    └─ Marker component receives onClick event                       │ │ │
│ │                                                                      │ │ │
│ │ 2. MARKER COMPONENT: onClick handler                                │ │ │
│ │    └─ onClick={(e) => { e.stopPropagation(); onClick(); }}          │ │ │
│ │                                                                      │ │ │
│ │ 3. THREESCENE: handleSelect(feature) ◄────────────────────────────┘ │ │
│ │    ├─ setSelectedId(feature.id)  // Local state update             │ │ │
│ │    ├─ onFeatureSelect(feature)   // Callback to App.tsx            │ │ │
│ │    └─ Auto-navigate to floor:                                       │ │ │
│ │       if (feature.id.includes('ground')) setActiveFloor(0);         │ │ │
│ │       if (feature.id.includes('level1')) setActiveFloor(1);         │ │ │
│ │       if (feature.id.includes('level2')) setActiveFloor(2);         │ │ │
│ │       if (feature.id.includes('level3')) setActiveFloor(3);         │ │ │
│ │                                                                      │ │ │
│ │ 4. APP.TSX: setSelectedFeature(feature) ◄──────────────────────────┘ │
│ │    └─ Updates App state → triggers re-render                         │
│ │                                                                      │ │
│ │ 5. CONDITIONAL RENDER: FeatureInfoCard appears                      │ │
│ │    └─ {selectedFeature && <FeatureInfoCard />}                      │ │
│ │                                                                      │ │
│ │ 6. CAMERA ANIMATION: CameraRig responds to activeFloor change       │ │
│ │    └─ Smoothly animates to floor-specific viewpoint                 │ │
│ │                                                                      │ │
│ └──────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 2. State Management Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│ APP STATE                                                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ currentView: View                                                   │
│ ├─ HOME                                                             │
│ ├─ SPECIFICATIONS                                                   │
│ ├─ FACILITY_DEMO  ◄─── Renders ThreeScene                          │
│ ├─ AMENITIES                                                        │
│ └─ INVEST                                                           │
│                                                                     │
│ selectedFeature: FeatureData | null                                 │
│ └─ Set by: onFeatureSelect callback from ThreeScene                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                          │
                          │ Props passed down
                          ▼
┌─────────────────────────────────────────────────────────────────────┐
│ THREESCENE STATE                                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ selectedId: string | null                                           │
│ └─ Controls: Marker highlighting (yellow glow)                      │
│                                                                     │
│ activeFloor: FloorLevel                                             │
│ ├─ 'ALL'  → Show all floors, camera at [180, 120, 180]             │
│ ├─ 0      → Ground floor only, camera zooms to [80, 30, 80]        │
│ ├─ 1      → Level 1 only, camera at [80, 50, 80]                   │
│ ├─ 2      → Level 2 only, camera at [80, 70, 80]                   │
│ └─ 3      → Level 3 only, camera at [80, 90, 80]                   │
│                                                                     │
│ annotationMode: AnnotationMode                                      │
│ ├─ 'NONE'         → Clean view, no overlays                        │
│ ├─ 'LABELS'       → Show floating 3D labels, feature markers       │
│ └─ 'MEASUREMENTS' → Show CAD-style dimensions                       │
│                                                                     │
│ controlsRef: React.RefObject<OrbitControls>                         │
│ └─ Used by: CameraRig for programmatic camera control               │
│                                                                     │
│ isAnimatingRef: React.MutableRefObject<boolean>                     │
│ └─ Controls: Camera auto-animation vs user interaction              │
│    ├─ true:  CameraRig lerps to target position                    │
│    └─ false: User has control via OrbitControls                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Render Cycle Flow

```
┌───────────────────────────────────────────────────────────────────┐
│ INITIAL RENDER (Page Load)                                       │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│ 1. ReactDOM.createRoot(rootElement)                               │
│    └─ Mounts <React.StrictMode>                                  │
│       └─ Mounts <App />                                           │
│                                                                   │
│ 2. App.tsx initialization                                         │
│    ├─ currentView = HOME (default)                               │
│    ├─ selectedFeature = null                                     │
│    └─ Renders: NavBar + HomeView + AIChat                        │
│                                                                   │
│ 3. User clicks "Explore 3D Demo" button                           │
│    └─ setCurrentView(View.FACILITY_DEMO)                         │
│                                                                   │
│ 4. AnimatePresence detects view change                            │
│    ├─ Exit animation: HomeView fades out                         │
│    └─ Enter animation: FACILITY_DEMO fades in                    │
│                                                                   │
│ 5. ThreeScene mounts for first time                               │
│    ├─ State initialization:                                      │
│    │  • selectedId = null                                        │
│    │  • activeFloor = 'ALL'                                      │
│    │  • annotationMode = 'LABELS'                                │
│    │  • controlsRef = useRef(null)                               │
│    │  • isAnimatingRef = useRef(false)                           │
│    │                                                              │
│    ├─ ControlsOverlay renders (HTML layer)                       │
│    │  • Floor selector UI                                        │
│    │  • Annotation toggles                                       │
│    │                                                              │
│    └─ Canvas renders (WebGL initialization)                      │
│       ├─ WebGL context created                                   │
│       ├─ Three.js renderer initialized                           │
│       ├─ Scene graph built:                                      │
│       │  1. Lights (ambient + directional)                       │
│       │  2. Environment (HDR park preset)                        │
│       │  3. BuildingShell meshes                                 │
│       │  4. CampusGrounds meshes                                 │
│       │  5. All 4 floors (GroundFloor...LevelThree)              │
│       │  6. TransportPods                                        │
│       │  7. Marker × 6 (feature hotspots)                        │
│       │  8. ContactShadows                                       │
│       │                                                           │
│       ├─ CameraRig useFrame starts                               │
│       │  • Initial position: [180, 100, 180] (from Canvas)       │
│       │  • Target: [180, 120, 180] (ALL view)                    │
│       │  • Lerp interpolation begins                             │
│       │                                                           │
│       └─ OrbitControls attached                                  │
│          • User can rotate/zoom/pan                               │
│          • onStart callback sets isAnimatingRef = false           │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
                          │
                          │ RAF loop starts
                          ▼
┌───────────────────────────────────────────────────────────────────┐
│ RENDER LOOP (60 FPS)                                              │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│ useFrame((state, delta) => { ... })                               │
│                                                                   │
│ Every frame (16.67ms):                                            │
│ 1. Check isAnimatingRef                                           │
│    ├─ If true: Lerp camera to targetPos                          │
│    │           Lerp controls.target to targetLookAt               │
│    │           Check distance to stop animation                   │
│    └─ If false: Skip (user is controlling camera)                │
│                                                                   │
│ 2. Three.js renders scene                                         │
│    ├─ Frustum culling                                             │
│    ├─ Shadow map updates                                         │
│    ├─ Material shaders execute                                   │
│    └─ Draw calls to GPU                                           │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
                          │
                          │ User interaction
                          ▼
┌───────────────────────────────────────────────────────────────────┐
│ INTERACTION FLOW                                                  │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│ SCENARIO 1: User clicks floor button (e.g., "L2: Social")        │
│ ────────────────────────────────────────────────────────────      │
│ 1. ControlsOverlay button onClick                                 │
│    └─ setActiveFloor(2)                                          │
│                                                                   │
│ 2. ThreeScene re-renders with activeFloor=2                       │
│    ├─ CameraRig useEffect triggers:                              │
│    │  • targetPos.current.set(80, 70, 80)                        │
│    │  • targetLookAt.current.set(0, 40, 0)                       │
│    │  • isAnimatingRef.current = true                            │
│    │                                                              │
│    ├─ Floor components conditional render:                       │
│    │  • GroundFloor: hidden (activeFloor !== 'ALL' && !== 0)    │
│    │  • LevelOne: hidden                                         │
│    │  • LevelTwo: visible (activeFloor === 2)                   │
│    │  • LevelThree: hidden                                       │
│    │                                                              │
│    └─ Marker visibility filtered:                                │
│       • Only level2_* markers shown                               │
│                                                                   │
│ 3. useFrame loop animates camera                                  │
│    └─ Smooth transition over ~1 second                           │
│                                                                   │
│                                                                   │
│ SCENARIO 2: User clicks feature Marker                            │
│ ────────────────────────────────────────────────────────────      │
│ 1. Marker onClick handler                                         │
│    └─ ThreeScene.handleSelect(feature)                           │
│       ├─ setSelectedId(feature.id)                               │
│       ├─ onFeatureSelect(feature) → App.setSelectedFeature()     │
│       └─ Auto-navigate:                                           │
│          if (feature.id === 'level2_social') setActiveFloor(2)   │
│                                                                   │
│ 2. Multiple re-renders triggered:                                 │
│    ├─ ThreeScene: selectedId updated                             │
│    │  └─ Marker highlights (isSelected prop changes)             │
│    │     • Color: white → BRAND_YELLOW                           │
│    │     • Emissive intensity: 0 → 0.8                           │
│    │     • Label scale: 1 → 1.1                                  │
│    │                                                              │
│    ├─ App: selectedFeature updated                                │
│    │  └─ FeatureInfoCard appears (AnimatePresence)               │
│    │     • Slide up animation                                    │
│    │     • Display: title, description, icon                     │
│    │     • "View Full Specs" button                              │
│    │                                                              │
│    └─ Camera animation: same as SCENARIO 1                        │
│                                                                   │
│                                                                   │
│ SCENARIO 3: User drags to rotate camera                           │
│ ────────────────────────────────────────────────────────────      │
│ 1. OrbitControls detects mouse drag                               │
│    └─ onStart callback: isAnimatingRef.current = false           │
│                                                                   │
│ 2. OrbitControls updates camera position                          │
│    └─ Directly modifies state.camera.position                    │
│                                                                   │
│ 3. CameraRig useFrame skips lerp                                  │
│    └─ Early return due to !isAnimatingRef.current                │
│                                                                   │
│ 4. User releases mouse                                            │
│    └─ Camera stays at user-defined position                       │
│       (No auto-animation until floor button clicked)              │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

---

## 4. WebGL Rendering Pipeline

```
┌─────────────────────────────────────────────────────────────────────┐
│ WEBGL RENDERING PIPELINE (Every Frame)                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ 1. APPLICATION LAYER (React Three Fiber)                           │
│    └─ useFrame hook calls → Scene graph traversal                  │
│                                                                     │
│ 2. SCENE GRAPH PREPARATION                                         │
│    ├─ Update matrix world for all objects                          │
│    ├─ Frustum culling (hide objects outside camera view)           │
│    └─ Sort transparent objects (back-to-front)                     │
│                                                                     │
│ 3. SHADOW MAP PASS (if shadows enabled)                            │
│    ├─ Render scene from directionalLight perspective               │
│    ├─ Write depth values to 2048×2048 shadow map texture           │
│    └─ Objects with castShadow=true are rendered                    │
│                                                                     │
│ 4. MAIN RENDER PASS                                                │
│    ├─ Clear color buffer (background)                              │
│    ├─ Clear depth buffer                                           │
│    │                                                                │
│    ├─ FOR EACH VISIBLE OBJECT:                                     │
│    │  ├─ Bind material shader program                              │
│    │  ├─ Set uniforms:                                             │
│    │  │  • Model matrix                                            │
│    │  │  • View matrix (from camera)                               │
│    │  │  • Projection matrix                                       │
│    │  │  • Light positions/colors                                  │
│    │  │  • Material properties (color, roughness, metalness)       │
│    │  │  • Textures (if any)                                       │
│    │  │  • Shadow map (for receiveShadow objects)                  │
│    │  │                                                             │
│    │  ├─ Bind geometry buffers:                                    │
│    │  │  • Position attribute                                      │
│    │  │  • Normal attribute                                        │
│    │  │  • UV attribute                                            │
│    │  │                                                             │
│    │  └─ GPU DRAW CALL                                             │
│    │     ├─ Vertex shader transforms vertices                      │
│    │     ├─ Rasterization creates fragments                        │
│    │     ├─ Fragment shader calculates pixel colors:               │
│    │     │  • Lighting calculations (Phong/PBR)                    │
│    │     │  • Shadow sampling                                      │
│    │     │  • Texture sampling                                     │
│    │     └─ Write to color buffer                                  │
│    │                                                                │
│    └─ Typical draw call count: 500-1000 (varies by floor)          │
│                                                                     │
│ 5. POST-PROCESSING (Optional)                                      │
│    └─ Not currently enabled in this scene                          │
│                                                                     │
│ 6. SWAP BUFFERS                                                    │
│    └─ Display rendered frame to screen                             │
│                                                                     │
│ 7. PERFORMANCE MONITORING                                          │
│    ├─ Frame time: ~16.67ms target (60 FPS)                         │
│    ├─ Draw calls: Minimized via instancing where possible          │
│    └─ GPU memory: Textures + geometry buffers                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5. Component Communication Map

```
         ┌────────────────────────────────────────────┐
         │ App.tsx                                    │
         │ ┌────────────────────────────────────────┐ │
         │ │ State:                                 │ │
         │ │ • currentView                          │ │
         │ │ • selectedFeature                      │ │
         │ └────────────────────────────────────────┘ │
         └────────────────────────────────────────────┘
                     │                   ▲
                     │ Props             │ Callback
                     │                   │
                     ▼                   │
         onFeatureSelect={setSelectedFeature}
                     │                   │
                     │                   │
         ┌────────────────────────────────────────────┐
         │ ThreeScene.tsx                             │
         │ ┌────────────────────────────────────────┐ │
         │ │ State:                                 │ │
         │ │ • selectedId                           │ │
         │ │ • activeFloor                          │ │
         │ │ • annotationMode                       │ │
         │ │ • controlsRef                          │ │
         │ │ • isAnimatingRef                       │ │
         │ └────────────────────────────────────────┘ │
         └────────────────────────────────────────────┘
                     │              │              │
          ┌──────────┴──────┐   ┌──┴───┐   ┌──────┴──────┐
          │                 │   │      │   │             │
          ▼                 ▼   ▼      ▼   ▼             ▼
    ControlsOverlay   CameraRig    Floor Components   Marker
          │                 │          │                  │
          │                 │          │                  │
    User clicks        useFrame   Conditional        onClick
    floor button       animation   rendering         event
          │                 │          │                  │
          ▼                 ▼          │                  ▼
    setActiveFloor    Lerp camera      │            handleSelect
          │              position       │                  │
          │                 │           │                  ├─ setSelectedId
          │                 │           │                  └─ onFeatureSelect
          │                 │           │                           │
          └─────────────────┴───────────┘                           │
                     │                                              │
                     ▼                                              │
              Re-render triggers:                                   │
              • Camera animates to new position                     │
              • Floor visibility updates                            │
              • Marker highlighting changes                         │
                                                                    │
                                                                    └──► App.tsx
                                                                         setSelectedFeature
                                                                              │
                                                                              ▼
                                                                    FeatureInfoCard
                                                                    appears
```

---

## 6. Asset Loading Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│ ASSET LOADING SEQUENCE                                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ HTML LOAD (index.html):                                            │
│ 1. Tailwind CDN script                                             │
│ 2. Google Fonts (Inter family)                                     │
│ 3. Global CSS                                                      │
│ 4. Vite client (HMR in dev)                                        │
│ 5. index.tsx module                                                │
│                                                                     │
│ JAVASCRIPT BUNDLE (index.tsx → App.tsx):                           │
│ 1. React & ReactDOM                                                │
│ 2. Framer Motion                                                   │
│ 3. Lucide React icons                                              │
│ 4. Component modules                                               │
│                                                                     │
│ THREE.JS ECOSYSTEM:                                                │
│ 1. three.js core library                                           │
│ 2. @react-three/fiber                                              │
│ 3. @react-three/drei utilities                                     │
│                                                                     │
│ SCENE INITIALIZATION (ThreeScene.tsx mount):                       │
│ 1. WebGL context creation                                          │
│ 2. Three.js renderer setup                                         │
│ 3. Environment HDR (park preset - loaded async)                    │
│ 4. Geometry construction:                                          │
│    ├─ Procedural shapes (boxes, cylinders, planes)                │
│    ├─ Custom geometries (curves, extrusions)                       │
│    └─ All generated at runtime (no external models)                │
│ 5. Materials creation:                                             │
│    ├─ MeshStandardMaterial (PBR)                                   │
│    ├─ MeshPhysicalMaterial (glass)                                 │
│    └─ MeshBasicMaterial (emissive elements)                        │
│ 6. Textures (courtTextures.ts):                                   │
│    ├─ Loaded via TextureLoader                                     │
│    └─ Applied to tennis court surfaces                             │
│ 7. Fonts (POTENTIAL ISSUE):                                        │
│    └─ /fonts/inter-bold.woff                                       │
│       • Referenced in Text component (line 757)                    │
│       • Loaded by troika-three-text                                │
│       • ⚠️ File existence needs verification                       │
│                                                                     │
│ RENDER READY:                                                      │
│ └─ All assets loaded → First frame rendered                        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 7. Error Handling & Edge Cases

```
┌─────────────────────────────────────────────────────────────────────┐
│ ERROR SCENARIOS & HANDLING                                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ SCENARIO 1: WebGL Not Supported                                    │
│ ────────────────────────────────────────────────────────────        │
│ • Condition: User's browser/GPU doesn't support WebGL              │
│ • Three.js behavior: Falls back to WebGL1 if WebGL2 unavailable    │
│ • Current handling: ❌ None (will show blank canvas)                │
│ • Recommendation: Add WebGL detection + fallback message           │
│                                                                     │
│ SCENARIO 2: Font File Missing                                      │
│ ────────────────────────────────────────────────────────────        │
│ • Condition: /fonts/inter-bold.woff doesn't exist                  │
│ • troika-three-text behavior: Falls back to default system font    │
│ • Visible impact: Labels render with wrong font                    │
│ • Current handling: ⚠️ Silent failure                               │
│ • Recommendation: Verify font file exists in public directory      │
│                                                                     │
│ SCENARIO 3: Environment Preset Load Failure                        │
│ ────────────────────────────────────────────────────────────        │
│ • Condition: CDN or network issue loading "park" HDR               │
│ • drei behavior: Continues without environment lighting             │
│ • Visible impact: Darker scene, less realistic reflections         │
│ • Current handling: ✅ Graceful degradation                         │
│                                                                     │
│ SCENARIO 4: Component Import Error                                 │
│ ────────────────────────────────────────────────────────────        │
│ • Condition: Missing child component (e.g., ReceptionArea.tsx)     │
│ • React behavior: Error boundary or white screen                   │
│ • Current handling: ❌ Will crash app                               │
│ • Recommendation: Add error boundary around ThreeScene              │
│                                                                     │
│ SCENARIO 5: StrictMode Double-Render                               │
│ ────────────────────────────────────────────────────────────        │
│ • Condition: Development mode with <React.StrictMode>              │
│ • React behavior: Effects run twice, components render twice        │
│ • Three.js impact: ✅ No resource leaks detected                    │
│ • useFrame impact: ✅ Properly scoped, no issues                    │
│                                                                     │
│ SCENARIO 6: Performance on Low-End Devices                         │
│ ────────────────────────────────────────────────────────────        │
│ • Condition: Integrated GPU, mobile device                         │
│ • Symptoms: < 30 FPS, stuttering                                   │
│ • Current handling: ✅ DPR adjustment: dpr={[1, 1.5]}               │
│ • Optimization: Shadows can be disabled for performance            │
│                                                                     │
│ SCENARIO 7: Rapid Floor Switching                                  │
│ ────────────────────────────────────────────────────────────        │
│ • Condition: User clicks multiple floor buttons rapidly            │
│ • State behavior: Each click triggers new animation                │
│ • isAnimatingRef: Overridden by latest click                       │
│ • Current handling: ✅ Works correctly (latest wins)                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 8. Memory Management

```
┌─────────────────────────────────────────────────────────────────────┐
│ MEMORY LIFECYCLE                                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ COMPONENT MOUNT (ThreeScene.tsx):                                  │
│ ├─ React state: ~1KB                                               │
│ ├─ WebGL context: ~50MB (renderer buffers)                         │
│ ├─ Geometries: ~5MB (all floor geometries)                         │
│ ├─ Materials: ~2MB (shader programs)                               │
│ ├─ Textures: ~10MB (court textures + environment HDR)              │
│ └─ Total: ~68MB                                                    │
│                                                                     │
│ CONDITIONAL RENDERING:                                             │
│ • All 4 floors loaded simultaneously in 'ALL' view                 │
│ • Single floor view: Others still in memory (just hidden)          │
│ • ⚠️ No unloading mechanism when switching floors                   │
│ • Impact: Minimal (geometries are lightweight)                     │
│                                                                     │
│ COMPONENT UNMOUNT (Navigate away from FACILITY_DEMO):              │
│ ├─ React Three Fiber cleanup:                                      │
│ │  • Disposes all geometries automatically                         │
│ │  • Disposes all materials                                        │
│ │  • Disposes textures                                             │
│ │  • Destroys WebGL context                                        │
│ ├─ React state: Garbage collected                                  │
│ └─ Total memory freed: ~68MB                                       │
│                                                                     │
│ RE-MOUNT (Return to FACILITY_DEMO):                                │
│ └─ Full re-initialization (no caching)                             │
│                                                                     │
│ OPTIMIZATION OPPORTUNITIES:                                        │
│ • useMemo for expensive geometries: ✅ Already implemented          │
│ • Texture atlasing: ❌ Not implemented (minimal benefit)            │
│ • LOD (Level of Detail): ❌ Not needed (simple geometries)          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

**Document Version:** 1.0
**Last Updated:** 2025-11-22
**Status:** Complete ✅
