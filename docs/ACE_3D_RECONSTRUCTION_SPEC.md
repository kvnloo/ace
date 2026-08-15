# ACE Performance Campus — 3D Reconstruction Specification

Status: reconstruction brief derived from the seven preserved ACE inspiration images
Reference source: immutable `inspo/*.png` files on `origin/enhance/3D` and the historical debug branch

## Product intent

Build an original, explorable, browser-native digital twin of ACE Performance Campus that preserves the inspiration corpus's architectural language without pretending inconsistent AI-generated details are construction drawings.

The first success criterion is visual identity. A technically functioning collection of courts, boxes and dashboards is not sufficient.

## Stable visual language

### Campus silhouette

- Two dominant rounded glass volumes/towers form the recognizable skyline.
- White structural ribbons and tall exoskeletal arches bridge and brace the volumes.
- Occupied floors read as stacked, thin, rounded plates rather than opaque rectangular blocks.
- A transparent central atrium forms the social and navigational heart.
- Courts remain visually connected to the building at ground, mezzanine and interior levels.

### Materials

- low-iron architectural glass with controlled reflection and visible interior depth;
- matte warm-white structural steel/concrete;
- pale oak accents on balcony edges, reception and retail elements;
- polished light stone/concrete floors;
- saturated blue, green, terracotta and ochre court surfaces;
- dense green living walls and hydroponic racks;
- restrained violet grow-light accents and cyan data-display accents.

### Spatial sequence

1. aerial/exterior campus reveal;
2. entry arcade and transparent reception;
3. central atrium with direct sightline to a hero court;
4. elevated spectator/gallery circulation;
5. interior pickleball and training halls;
6. Neuro & Reaction Lab / Athlete OS experience;
7. visible LawnTech cultivation and robotics lab.

### Lighting

- daylight-first architectural presentation;
- large skylights and glazed façades provide broad soft illumination;
- realistic interior-to-exterior exposure balance;
- violet and cyan accents remain secondary, not cyberpunk wash;
- local contact shadows and ambient occlusion ground people, courts and furniture;
- a twilight presentation may be added only after the daylight scene passes.

## AI-image inconsistencies to resolve deliberately

The source images disagree on exact floor count, court arrangement, arch attachment, entry geometry, furniture and cultivation layouts. These are not literal requirements.

Create one canonical campus plan with:

- stable dimensions and circulation;
- regulation sport geometry;
- structurally plausible arch rhythm;
- consistent floor elevations;
- accessible routes and coherent entrances;
- named zones that persist across overview and interior views.

## Canonical scene hierarchy

```text
ACE_Campus
  Site
    Terrain
    Arrival
    ExteriorCourts
    Landscape
  Architecture
    WestBioTower
    EastBioTower
    CentralAtrium
    StructuralArches
    FloorPlates
    Bridges
    RoofAndSolar
  SportZones
    Tennis
    Pickleball
    Basketball
    FootballTraining
    ReactionLab
  PerformanceZones
    AthleteOS
    Recovery
    Biomechanics
    LawnTechLab
  Operations
    Reception
    Retail
    SpectatorGalleries
    ServiceRoutes
  Presentation
    Cameras
    Lights
    Environment
    Labels
```

Every major zone requires a stable ID, world-space bounds and selection metadata.

## Reconstruction lane

### Phase 0 — evidence freeze

- Recover all seven source images from the historical branch.
- Hash them and create a reference manifest.
- Select five fixed comparison cameras: exterior hero, arrival, atrium, court hall and LawnTech lab.
- Preserve the historical Three.js capture as the baseline, not as an architectural source.

### Phase 1 — massing blockout

Build only:

- two tower volumes;
- floor plates;
- central atrium;
- arch system;
- main bridges;
- four exterior court zones;
- canonical camera paths.

Use neutral clay materials. Reject the blockout if its silhouette does not read as the same facility family at thumbnail scale.

### Phase 2 — authored architecture

Move architectural source of truth to Blender or a deterministic procedural interchange pipeline. Export modular GLBs for architecture, courts, landscape and interior props. Do not author the complete premium facility as ad-hoc React component primitives.

### Phase 3 — PBR and daylight

Add glass, warm-white structure, oak, court surfaces, vegetation and a physically coherent daylight environment. Tone mapping and color conversion occur exactly once.

### Phase 4 — living systems

Add optimized living walls, hydroponic racks, robotics and restrained grow lighting. Vegetation uses instancing/LOD and must not dominate transfer or frame budgets.

### Phase 5 — sport and Athlete OS layers

Integrate Homebase through contracts:

- court and facility configuration;
- regulation pickleball geometry;
- rally/player/ball simulation;
- selected-court operational state.

ACE owns multi-sport composition, camera direction, campus shell and Athlete OS UI. Data overlays must be optional and must not obscure the architecture.

### Phase 6 — production tiers

Ship Auto, Performance, Balanced and Cinematic modes with real monotonic sinks for pixel ratio, shadow maps, vegetation, reflections, post-processing and simulation cadence.

## Browser architecture

- React 19 + TypeScript + Vite;
- current stable Three.js and React Three Fiber versions pinned explicitly;
- route-level lazy loading so the marketing site does not download the 3D campus immediately;
- glTF/GLB assets with mesh compression and KTX2 textures;
- shared scene-state contracts independent of rendering;
- Web Worker only for meaningful heavy geometry/data tasks;
- deterministic camera presets and capture route;
- no runtime dependence on remote Unsplash or generated-image hosts.

## Quality gates

### Visual identity

At 1440×900 and 390×844:

- the paired glass volumes and white arches read within the first frame;
- at least three depth planes are visible in the exterior and atrium cameras;
- the exterior hero, arrival and atrium captures preserve the source corpus's value hierarchy;
- no repeated-box campus, primitive-debug materials or empty plane field passes;
- current candidate is compared against both the old runtime and reference contact sheet.

### Performance targets

Named certification hardware is the local RTX 3080 Ti 12 GB workstation.

Balanced, 1440×900:

- p95 frame time ≤ 16.7 ms after warm-up;
- p99 frame time ≤ 25 ms;
- no first-use navigation hitch over 100 ms after prewarming;
- ≤ 300 visible draw calls in exterior hero view;
- ≤ 2.5 million visible triangles in exterior hero view;
- ≤ 512 MB estimated resident texture memory;
- initial route transfer ≤ 3 MB compressed excluding opt-in 3D route;
- initial 3D route transfer ≤ 20 MB compressed for the first usable view.

Performance tier must remain usable without architectural silhouette loss.

### Correctness

- regulation court geometry comes from tested domain constants;
- all camera destinations remain inside traversable bounds;
- stable zone IDs survive asset optimization;
- glTF validator returns no errors;
- browser console and page-error gates are clean;
- no operational, biometric or live-data claim appears without a real source and explicit mode.

## First vertical slice

Deliver one exterior hero scene before building the whole campus:

- paired bio-towers;
- central atrium volume;
- three major arches;
- layered floor plates;
- four colored exterior courts;
- living-wall proxies;
- daylight PBR;
- orbit plus authored arrival camera;
- fixed deterministic screenshot route;
- Balanced and Performance modes.

The vertical slice passes only after a side-by-side visual review against the seven-image corpus. More facility features cannot compensate for a failed silhouette.
