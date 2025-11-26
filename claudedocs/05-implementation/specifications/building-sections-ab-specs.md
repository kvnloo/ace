# Building Sections A & B: 3D Specifications

## Document Control

| Property | Value |
|----------|-------|
| Document Version | 1.0 |
| Date | 2025-11-22 |
| Status | Draft |
| Author | Technical Documentation Team |
| Classification | Technical Specifications |

---

## Section A: Primary Entrance Specifications

### A.1 Overall Dimensions

#### A.1.1 Exterior Footprint
```
Overall Dimensions:
├── Width: 12.0m (39'4")
├── Depth: 8.0m (26'3")
├── Height: 4.5m (14'9")
└── Total Floor Area: 96.0m² (1,033 sq ft)

Clearance Requirements:
├── Front setback: 3.0m minimum
├── Side clearances: 1.5m each side
└── Overhead clearance: 5.0m minimum
```

#### A.1.2 Zone Breakdown
```
┌─────────────────────────────────────────┐
│         SECTION A: ENTRANCE             │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │   Zone A1: Exterior Approach    │   │
│  │   4.0m × 12.0m = 48.0m²        │   │
│  │                                 │   │
│  │   • Covered canopy             │   │
│  │   • Weather protection         │   │
│  │   • Lighting integration       │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │   Zone A2: Reception Vestibule  │   │
│  │   4.0m × 12.0m = 48.0m²        │   │
│  │                                 │   │
│  │   ┌──────┐        ┌──────┐     │   │
│  │   │Entry │        │ Desk │     │   │
│  │   │Doors │        │      │     │   │
│  │   └──────┘        └──────┘     │   │
│  │                                 │   │
│  │   [Seating]    [Display]       │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘

Plan View Scale: 1:100
```

### A.2 Structural Components

#### A.2.1 Foundation System
```yaml
foundation_specifications:
  type: Reinforced concrete slab-on-grade

  slab_details:
    thickness: 200mm (8")
    reinforcement:
      - Steel mesh: D10 @ 200mm centers (both directions)
      - Edge reinforcement: 4×D16 continuous bars
    concrete_grade: C30/37 (4,350 psi)
    finish: Power-floated with sealed surface

  sub_base:
    crushed_stone: 150mm (6") compacted
    sand_blinding: 50mm (2")
    damp_proof_membrane: 1200 gauge polyethylene
    insulation: 100mm XPS foam (R-value: 5.0)

  load_capacity:
    uniform_load: 5.0 kN/m² (105 psf)
    point_load: 2.5 kN (560 lbf)

  drainage:
    perimeter_drain: 100mm perforated pipe
    sump_location: Northeast corner
    fall: 1:100 towards drainage points
```

#### A.2.2 Wall Construction
```yaml
exterior_walls:
  primary_system:
    type: Insulated steel frame panels
    frame: 150mm steel C-sections @ 600mm centers
    external_cladding:
      material: Fiber cement panels
      thickness: 9mm
      finish: Textured paint, color per schedule
    insulation:
      type: Mineral wool batts
      thickness: 150mm
      R-value: 4.2 m²K/W (R-24)
    vapor_barrier: Polyethylene sheet, 0.15mm
    internal_lining:
      material: Painted gypsum board
      thickness: 13mm
      finish: Level 4, eggshell paint

  total_wall_thickness: 195mm (7.7")

  thermal_performance:
    U-value: 0.22 W/m²K (R-4.5)
    air_tightness: ≤2.0 m³/h/m² @ 50Pa

  acoustic_performance:
    STC_rating: 52
    OITC_rating: 45

interior_walls:
  partition_type: Steel stud with gypsum board
  stud_size: 90mm @ 600mm centers
  board_thickness: 13mm each side
  total_thickness: 116mm (4.6")
  acoustic_insulation: 90mm mineral wool (where required)
  STC_rating: 45
```

#### A.2.3 Roof Structure
```yaml
roof_system:
  type: Standing seam metal roof on steel trusses

  primary_structure:
    trusses:
      type: Pratt truss, galvanized steel
      depth: 450mm (17.7")
      spacing: 1200mm (3'11") centers
      span: 12.0m (39'4")

  roof_deck:
    material: Profiled steel decking
    profile: Trapezoidal, 0.7mm BMT
    finish: Factory-applied primer

  insulation_layers:
    layer_1: 150mm PIR boards (R-7.0)
    layer_2: 50mm XPS boards (R-2.5)
    total_R_value: 9.5 m²K/W (R-54)

  waterproofing:
    membrane: TPO single-ply
    thickness: 1.5mm (60 mil)
    color: Light gray (reflective)
    warranty: 20 years

  metal_roofing:
    material: Aluminum standing seam
    thickness: 0.9mm (24 gauge)
    finish: PVDF coating
    color: Charcoal gray
    seam_height: 50mm (2")
    panel_width: 400mm (15.75")

  roof_slope: 1:40 (1.43°, 2.5%)

  drainage:
    type: Internal box gutters
    gutter_width: 300mm
    downpipe_diameter: 100mm
    downpipe_quantity: 4 (one per corner)
```

### A.3 Entrance Door Systems

#### A.3.1 Main Entry Doors
```yaml
door_specifications:
  configuration: Double doors with fixed sidelights

  door_dimensions:
    each_leaf:
      width: 1200mm (3'11")
      height: 2400mm (7'10")
      thickness: 50mm (2")
    clear_opening: 2340mm × 2340mm (7'8" × 7'8")

  construction:
    frame: Thermally broken aluminum
    profile_width: 70mm
    finish: Powder-coated, color per schedule

  glazing:
    type: Laminated safety glass
    specification: 6mm + 1.52mm PVB + 6mm
    performance:
      thermal: U-value 1.1 W/m²K (R-0.9)
      acoustic: Rw 35 dB
      safety: Class P2A per EN 356
    tint: Low-E, neutral gray

  hardware:
    hinges:
      type: Heavy-duty continuous hinge
      material: Stainless steel 304
      finish: Satin
    locks:
      type: Electromagnetic lock system
      holding_force: 1200 lbf (5,338 N)
      backup: Mechanical panic bar (interior)
    closer:
      type: Concealed overhead closer
      force: Size 4 (ADA compliant)
      hold_open: Electromagnetic, fire-rated
    handles:
      type: Pull handle, both sides
      length: 1200mm (47")
      diameter: 32mm (1.25")
      material: Stainless steel 316
      finish: Brushed satin

  accessibility:
    opening_force: ≤5 lbf (22 N)
    threshold: Flush, maximum 13mm (0.5")
    clear_width: Exceeds 850mm (33.5") per ADAAG

  automation:
    system: Low-energy automatic operator
    activation: Motion sensor + push button
    opening_speed: 0.3 m/s
    hold_time: 5 seconds (adjustable)
    safety_sensors: Infrared array, both sides
```

#### A.3.2 Sidelights and Transom
```yaml
fixed_glazing:
  sidelights:
    quantity: 2 (one each side)
    dimensions:
      width: 900mm (2'11") each
      height: 2400mm (7'10")
    framing: Matching door system

  transom:
    dimensions:
      width: 4200mm (13'9") total
      height: 600mm (2'0")
    position: Above door and sidelights

  glazing_specification:
    type: Insulated glass unit (IGU)
    composition: 6mm clear + 16mm argon + 6mm Low-E
    U-value: 1.0 W/m²K (R-1.0)
    SHGC: 0.35
    VLT: 60%
```

### A.4 Interior Features

#### A.4.1 Reception Desk
```yaml
reception_desk:
  location:
    position: Central, 2.5m from entrance
    orientation: Facing entrance doors

  dimensions:
    length: 3000mm (9'10")
    depth: 900mm (2'11")
    height_front: 1100mm (3'7")
    height_back: 750mm (2'6")
    knee_clearance: 685mm (27") × 760mm (30") × 480mm (19")

  construction:
    structure: Steel frame with laminated panels
    work_surface:
      material: Solid surface composite
      thickness: 12mm
      edge: 20mm waterfall profile
      color: White quartz
    front_panel:
      material: Wood veneer on MDF
      species: White oak
      finish: Clear matte lacquer
    transaction_top:
      height: 1100mm (ADA compliant)
      width: 900mm
      surface: Matching work surface material

  integrated_systems:
    power_outlets: 4× duplex, flush-mounted
    data_ports: 2× Cat6a, 1× fiber optic
    cable_management: Integrated trough, 100mm × 50mm
    lighting: Under-counter LED strip, 3000K, dimmable

  storage:
    drawers: 3× file drawers, full-extension slides
    shelving: 2× adjustable shelves, 25mm thick
    lockable_compartment: 1× with electronic lock

  accessibility_features:
    lowered_section: 685mm high × 760mm wide
    knee_clearance: Full depth, unobstructed
    counter_edge: Rounded, 6mm radius
```

#### A.4.2 Seating Area
```yaml
waiting_area:
  location: South wall, opposite reception

  dimensions:
    area: 12.0m² (129 sq ft)
    arrangement: L-shaped configuration

  furniture_layout:
    seating:
      type: Modular bench seating
      configuration: 2-seat + 3-seat units
      dimensions_2seat: 1200mm × 700mm × 450mm (W×D×H)
      dimensions_3seat: 1800mm × 700mm × 450mm
      material: Upholstered foam on wood frame
      fabric: Commercial-grade, stain-resistant
      color: Charcoal gray

    side_table:
      quantity: 1
      dimensions: 600mm × 600mm × 450mm
      material: Powder-coated steel base, laminate top

  circulation:
    clearance_front: 1200mm minimum
    clearance_sides: 900mm minimum
    accessible_route: 1500mm clear width maintained
```

#### A.4.3 Display and Signage
```yaml
information_displays:
  digital_display:
    location: Wall-mounted, above reception desk
    size: 55" diagonal (1220mm × 686mm)
    type: Commercial LCD panel
    resolution: 3840 × 2160 (4K UHD)
    brightness: 500 cd/m²
    mounting: Low-profile wall bracket
    power: Concealed conduit from ceiling

  wayfinding_signage:
    material: Brushed aluminum with vinyl graphics
    mounting: Stand-off posts, 25mm clearance
    typical_size: 300mm × 150mm
    locations:
      - Above interior doors (4 locations)
      - Directional arrows (as required)
    illumination: Halo-lit with LED strips

  branding:
    facility_name:
      location: Reception desk front panel
      method: Routed and painted letters
      height: 150mm
      font: Sans-serif, custom
      color: Gold metallic
```

### A.5 Finishes Schedule

#### A.5.1 Floor Finishes
```yaml
flooring:
  zone_a1_exterior:
    material: Non-slip ceramic tile
    size: 400mm × 400mm
    thickness: 10mm
    finish: Matte textured
    color: Dark gray
    slip_resistance: R11 (DIN 51130)
    frost_resistance: Yes

  zone_a2_interior:
    material: Luxury vinyl tile (LVT)
    size: 610mm × 610mm
    thickness: 3mm + 2mm underlayment
    wear_layer: 0.7mm (heavy commercial)
    finish: Wood-look plank pattern
    color: Light oak
    slip_resistance: R10

  transition:
    type: Aluminum threshold profile
    width: 50mm
    finish: Brushed stainless steel

  base:
    material: Matching LVT cove base
    height: 100mm
    profile: Straight edge
```

#### A.5.2 Wall Finishes
```yaml
wall_treatments:
  painted_walls:
    substrate: Gypsum board, Level 4 finish
    primer: 1 coat acrylic primer-sealer
    paint: 2 coats acrylic eggshell
    colors:
      primary_walls: Warm white (LRV 85)
      accent_wall: Soft blue-gray (LRV 65)

  feature_wall:
    location: Behind reception desk
    material: Wood slat panel system
    slat_profile: 50mm × 20mm with 30mm spacing
    species: White oak
    finish: Clear matte lacquer
    mounting: Hidden Z-clip system
    backing: Acoustic felt, 12mm

  wainscot:
    location: High-traffic areas
    height: 1200mm from floor
    material: Impact-resistant FRP panels
    thickness: 2.5mm
    finish: Smooth, matte white
    trim: Aluminum H-molding
```

#### A.5.3 Ceiling System
```yaml
ceiling:
  main_area:
    type: Suspended acoustic tile
    tile_size: 600mm × 600mm
    thickness: 15mm
    edge_detail: Square tegular
    finish: White, textured
    acoustic_performance:
      NRC: 0.70
      CAC: 35
    light_reflectance: 0.83

  suspension_system:
    grid: Exposed T-bar, 24mm face
    finish: White powder coat
    support: Wire hangers @ 1200mm centers
    ceiling_height: 3000mm (9'10")
    plenum_depth: 600mm

  canopy_ceiling:
    location: Zone A1 (exterior approach)
    type: Metal panel system
    material: Perforated aluminum
    perforation: 2mm holes @ 5mm centers (30% open)
    thickness: 2.0mm
    finish: Clear anodized
    mounting: Concealed clips on steel framework
    height: 2700mm (8'10")
```

### A.6 Mechanical, Electrical & Plumbing (MEP)

#### A.6.1 HVAC Systems
```yaml
climate_control:
  system_type: Split system heat pump

  outdoor_unit:
    capacity: 12 kW (40,950 BTU/h)
    refrigerant: R-32
    sound_level: 58 dB(A)
    location: Roof-mounted, north side

  indoor_units:
    type: Ceiling-concealed ducted unit
    quantity: 1
    airflow: 1200 m³/h (706 CFM)

  ductwork:
    supply_ducts:
      main_trunk: 400mm × 200mm rectangular
      branches: 150mm diameter circular
      material: Galvanized steel
      insulation: 25mm fiber glass (R-4.0)
    return_ducts:
      main: 500mm × 300mm rectangular
      grilles: 600mm × 300mm, aluminum

  diffusers:
    supply:
      type: 4-way square diffuser
      size: 300mm × 300mm
      quantity: 6
      pattern: Adjustable air pattern
      finish: White powder coat
    return:
      type: Linear bar grille
      size: 600mm × 300mm
      quantity: 2
      finish: White aluminum

  controls:
    thermostat: Programmable, wall-mounted
    location: Reception desk area, 1500mm height
    zones: Single zone with temperature setback
    settings:
      occupied: 21°C ± 2°C (70°F ± 3.6°F)
      unoccupied: 15°C winter / 27°C summer

  ventilation:
    fresh_air: 10 L/s per person (minimum)
    air_changes: 4 ACH during occupied hours
    filtration: MERV 11 pleated filters
```

#### A.6.2 Electrical Systems
```yaml
power_distribution:
  service_entry:
    voltage: 230V single-phase
    amperage: 100A
    panel_location: Zone A2, concealed in wall cavity

  lighting:
    general_lighting:
      type: LED recessed downlights
      quantity: 16
      wattage: 12W each (Total: 192W)
      color_temp: 4000K (neutral white)
      CRI: >90
      output: 1000 lumens per fixture
      dimming: 0-10V protocol
      spacing: 1800mm grid

    accent_lighting:
      feature_wall: LED strip, 3000K, 24V DC
      length: 12.0m
      power: 96W total
      control: Separate dimmer

    emergency_lighting:
      type: LED emergency exit signs with battery backup
      quantity: 4 (2 over exit doors, 2 wayfinding)
      battery: 3-hour duration
      test: Monthly automatic self-test

  power_outlets:
    general_purpose:
      type: Duplex receptacles, 230V
      quantity: 12
      mounting: Flush in walls
      height: 450mm above floor
      circuit: 20A dedicated circuits

    dedicated_outlets:
      reception_desk: 4× duplex (2 circuits)
      IT_equipment: 2× quad outlets with surge protection
      cleaning: 1× GFCI-protected

  data_systems:
    structured_cabling:
      backbone: Cat6a UTP
      outlets: 8× RJ45 jacks
      patch_panel: 24-port, wall-mounted
      cabinet: 12U wall-mount rack

    wireless:
      access_points: 1× ceiling-mounted WAP
      standard: Wi-Fi 6 (802.11ax)
      coverage: Full zone coverage

  security_systems:
    access_control:
      card_reader: Proximity reader at entrance
      strike_plate: Electromagnetic lock (fail-safe)
      controller: Network-based, PoE powered

    CCTV:
      cameras: 2× IP cameras (entrance + interior)
      resolution: 4MP (2560 × 1440)
      recording: Network video recorder (NVR)
      storage: 30 days continuous

    intrusion_detection:
      motion_sensors: 2× dual-technology sensors
      door_contacts: On all exterior doors
      keypad: Wall-mounted, backlit
```

#### A.6.3 Plumbing (If Applicable)
```yaml
plumbing_provisions:
  water_supply:
    stub_out_location: Northeast corner
    size: 20mm (3/4") copper
    shutoff_valve: Ball valve, accessible

  drainage:
    floor_drain: 100mm diameter, stainless steel grate
    location: Near reception desk
    trap: Deep seal, 100mm

  future_provisions:
    drinking_fountain: Rough-in at west wall
    janitor_sink: Drain and supply rough-in
```

### A.7 Building Services & Integration

#### A.7.1 Fire Protection
```yaml
fire_safety:
  detection:
    system_type: Addressable fire alarm
    devices:
      smoke_detectors: 4× photoelectric sensors
      heat_detectors: 2× rate-of-rise sensors
      manual_pull_stations: 2× at exits
      alarm_sounders: 4× horn/strobe combinations

  suppression:
    type: Automatic sprinkler system
    coverage: Ordinary Hazard Group 1
    sprinkler_heads:
      type: Pendent, concealed
      temperature: 68°C (155°F)
      spacing: 3.6m maximum
      quantity: 8
    water_supply: Connection to facility main

  egress:
    exit_doors: 2× (main entrance + secondary)
    exit_signage: Illuminated, battery backup
    emergency_lighting: 3-hour battery backup
    travel_distance: <23m (75') to exit
```

#### A.7.2 Building Automation
```yaml
automation_systems:
  control_strategy:
    platform: BACnet/IP building management system
    integration_points:
      - HVAC control and monitoring
      - Lighting control and scheduling
      - Access control coordination
      - Energy monitoring

  scheduling:
    occupied_hours: 0600-2200 (configurable)
    setback_periods: 2200-0600
    holiday_override: Calendar-based

  monitoring:
    temperature: All zones
    humidity: Main space
    energy_consumption: Main panel
    alarm_notifications: Email/SMS alerts
```

---

## Section B: Locker Facilities Specifications

### B.1 Overall Dimensions

#### B.1.1 Facility Footprint
```
Overall Dimensions:
├── Width: 10.0m (32'10")
├── Depth: 15.0m (49'3")
├── Height: 3.6m (11'10")
└── Total Floor Area: 150.0m² (1,615 sq ft)

Functional Zones:
├── Zone B1: Main locker area: 90.0m² (60%)
├── Zone B2: Changing areas: 30.0m² (20%)
├── Zone B3: Circulation/amenities: 30.0m² (20%)
└── Total: 150.0m²
```

#### B.1.2 Zone Layout
```
┌───────────────────────────────────────────────┐
│        SECTION B: LOCKER FACILITIES           │
│                                               │
│  ┌─────────────────┬─────────────────┐       │
│  │  Zone B1        │  Zone B2        │       │
│  │  MAIN LOCKERS   │  CHANGING AREA  │       │
│  │                 │                 │       │
│  │  ┌───┬───┬───┐  │  ┌──────────┐  │       │
│  │  │ L │ L │ L │  │  │  Changing│  │       │
│  │  │ O │ O │ O │  │  │  Benches │  │       │
│  │  │ C │ C │ C │  │  └──────────┘  │       │
│  │  │ K │ K │ K │  │                 │       │
│  │  │ E │ E │ E │  │  ┌──────────┐  │       │
│  │  │ R │ R │ R │  │  │  Privacy │  │       │
│  │  │ S │ S │ S │  │  │  Stalls  │  │       │
│  │  └───┴───┴───┘  │  └──────────┘  │       │
│  │                 │                 │       │
│  │  [Additional    │  [Mirrors]      │       │
│  │   Locker Rows]  │  [Hooks]        │       │
│  │                 │                 │       │
│  └─────────────────┴─────────────────┘       │
│                                               │
│  ┌─────────────────────────────────────┐     │
│  │       Zone B3: AMENITIES            │     │
│  │                                     │     │
│  │  [Restrooms]  [Showers]  [Storage] │     │
│  │                                     │     │
│  └─────────────────────────────────────┘     │
│                                               │
│  [Entry/Exit Transition from Section A]      │
└───────────────────────────────────────────────┘

Plan View Scale: 1:100
```

### B.2 Structural Components

#### B.2.1 Foundation and Floor System
```yaml
foundation:
  type: Reinforced concrete slab-on-grade

  slab_specifications:
    thickness: 200mm (8")
    reinforcement:
      - D10 mesh @ 200mm centers (both ways)
      - Perimeter edge: 4×D16 continuous
    concrete: C30/37 (4,350 psi)
    finish: Power-troweled, sealed

  sub_base:
    aggregate: 150mm (6") compacted crushed stone
    sand_layer: 50mm (2")
    dpm: 1200 gauge polyethylene sheet
    insulation: 75mm XPS foam (R-4.0)

  drainage:
    slope: 1:80 towards floor drains
    floor_drains: 4× locations (100mm diameter)
    trap_seal: 75mm deep seal
    drain_material: Stainless steel grates

  waterproofing:
    changing_areas: Liquid-applied membrane
    wet_areas: Epoxy coating system
    joints: Sealed with polyurethane sealant
```

#### B.2.2 Wall Systems
```yaml
exterior_walls:
  construction: Matching Section A specifications
  thickness: 195mm
  insulation: R-24 (4.2 m²K/W)
  finish: Painted gypsum board interior

interior_partitions:
  standard_walls:
    type: Metal stud with gypsum board
    stud_size: 90mm @ 600mm centers
    board: 13mm each side
    total_thickness: 116mm

  wet_area_walls:
    type: Metal stud with moisture-resistant board
    stud_size: 90mm @ 400mm centers
    board: 13mm MR gypsum board + 6mm cement board
    waterproofing: Liquid membrane system
    finish: Ceramic tile
    total_thickness: 140mm

  privacy_partitions:
    material: High-pressure laminate (HPL)
    thickness: 13mm solid grade laminate
    color: Slate gray, textured
    mounting: Floor-anchored aluminum posts
    height: 1800mm (5'11")
    clearance_bottom: 150mm (6")
    clearance_top: 1050mm to ceiling
```

#### B.2.3 Ceiling System
```yaml
ceiling:
  main_areas:
    type: Suspended acoustic tile system
    tile: 600mm × 600mm × 15mm
    finish: White, textured
    NRC: 0.70
    grid: White T-bar, 24mm face
    height: 3000mm (9'10")

  wet_areas:
    type: Moisture-resistant suspended panels
    material: Vinyl-coated gypsum
    size: 1200mm × 600mm
    finish: Smooth white
    grid: Aluminum, powder-coated white
    height: 2700mm (8'10")

  changing_areas:
    type: Same as wet areas
    additional_feature: Integrated lighting panels
```

### B.3 Locker Systems

#### B.3.1 Primary Locker Banks
```yaml
locker_specifications:
  configuration: Multi-tier locker system

  standard_unit_dimensions:
    width: 300mm (12")
    depth: 450mm (18")
    height_per_tier:
      single_tier: 1800mm (71")
      two_tier: 900mm (35") each
      three_tier: 600mm (24") each

  recommended_configuration:
    two_tier: 60% of lockers (120 units)
    three_tier: 40% of lockers (90 units)
    total_lockers: 210 individual units

  construction:
    material: Cold-rolled steel
    gauge: 18 gauge (1.2mm)
    finish: Powder-coated enamel
    color_options:
      primary: Charcoal gray (RAL 7024)
      accent: Safety yellow doors (RAL 1003)

  door_specifications:
    hinge: Continuous piano hinge, full height
    handle: Recessed pull handle
    locking_mechanism: Digital keypad lock
      - Code length: 4-6 digits
      - Master override: Yes
      - Battery life: 18 months (4× AAA)
      - Low battery alert: LED indicator
      - Audit trail: Last 500 entries

  ventilation:
    type: Louvers in doors
    size: 3× 150mm × 25mm slots per door
    total_open_area: 112.5 cm² per locker

  interior_features:
    hooks: 2× double prong hooks per unit
    shelf: 1× adjustable shelf (two-tier units)
    base: Sloped top on upper tier units
    number_plates: Engraved aluminum, 50mm × 30mm
```

#### B.3.2 Locker Layout and Arrangement
```yaml
layout_strategy:
  primary_banks:
    configuration: Back-to-back double-sided units
    aisle_width: 1500mm (59") between banks
    bank_depth: 900mm (35") total (450mm × 2)

  arrangement:
    bank_a:
      location: North wall
      length: 9000mm (29'6")
      tiers: 2-tier configuration
      total_units: 60 (30 columns × 2 tiers)

    bank_b:
      location: Center (island)
      length: 9000mm
      configuration: Back-to-back
      tiers: 2-tier
      total_units: 60 (30 columns × 2 tiers)

    bank_c:
      location: South wall
      length: 6000mm (19'8")
      tiers: 3-tier configuration
      total_units: 60 (20 columns × 3 tiers)

    bank_d:
      location: East wall
      length: 3000mm (9'10")
      tiers: 3-tier
      total_units: 30 (10 columns × 3 tiers)

  accessibility_compliance:
    accessible_lockers: 10 units (5% of total)
    location: Bank A, end positions
    height_range: 380mm - 1220mm (15" - 48")
    configuration: Single-tier, full height
    clear_floor_space: 1500mm × 1500mm in front

  circulation:
    primary_aisle: 1800mm (71") width
    secondary_aisles: 1500mm (59") minimum
    turning_circle: 1500mm diameter (3 locations)
```

#### B.3.3 Ancillary Locker Features
```yaml
locker_accessories:
  benching:
    type: Fixed wall-mounted benches
    location: Center of aisles between locker banks
    dimensions:
      length: Variable (matching aisle length)
      width: 400mm (16")
      height: 450mm (18")
    construction:
      frame: Powder-coated steel tube
      seat: Hardwood slats, 50mm × 25mm
      finish: Clear polyurethane
      spacing: 10mm gaps between slats
    mounting: Wall brackets @ 900mm centers
    capacity: 3-4 persons per 2000mm length

  coat_hooks:
    type: Wall-mounted multi-hook rail
    location: Above benches
    height: 1650mm (65")
    spacing: 300mm (12") between hooks
    material: Stainless steel 304
    finish: Brushed satin

  waste_receptacles:
    quantity: 4
    type: Dual-stream recycling bins
    capacity: 60 liters (16 gallons) each
    material: Powder-coated steel
    compartments: General waste / Recycling

  signage:
    locker_numbers: Engraved plates on each unit
    wayfinding: Wall-mounted directional signs
    safety: Emergency procedures (4 locations)
    usage_guidelines: Rules and etiquette poster
```

### B.4 Changing Area Facilities

#### B.4.1 Open Changing Area
```yaml
changing_space:
  area: 20.0m² (215 sq ft)
  capacity: 12 persons simultaneously

  benching:
    configuration: U-shaped layout
    total_length: 8000mm (26'3")
    bench_specifications:
      width: 400mm (16")
      height: 450mm (18")
      material: Phenolic resin slats
      color: Light gray
      finish: Anti-slip texture

  hooks_and_storage:
    wall_hooks: 24× individual hooks
    height: 1650mm (65")
    spacing: 300mm (12") centers
    material: Stainless steel

  mirrors:
    type: Full-height wall mirrors
    dimensions: 2400mm × 1200mm (3 panels)
    material: 6mm safety-backed glass
    frame: Aluminum channel, satin finish
    mounting: J-channel top and bottom

  flooring:
    material: Non-slip ceramic tile
    size: 300mm × 300mm
    finish: Matte, textured
    color: Light gray
    slip_resistance: R11 (DIN 51130)
```

#### B.4.2 Privacy Changing Stalls
```yaml
private_stalls:
  quantity: 4

  dimensions_per_stall:
    width: 1200mm (47")
    depth: 1200mm (47")
    height: 2100mm (82")
    clear_floor_area: 1.44m² (15.5 sq ft)

  partition_system:
    material: 13mm solid grade laminate (HPL)
    color: Slate gray, textured finish
    edge_profile: PVC edge banding, matching color

  door:
    width: 900mm (35")
    height: 2000mm (79")
    clearance_bottom: 150mm (6")
    clearance_top: 900mm
    hinge: Self-closing, stainless steel
    latch: Indicator lock (occupied/vacant)
    handle: D-pull, both sides, stainless steel

  mounting_system:
    posts: Aluminum extrusion, satin finish
    floor_anchors: Stainless steel brackets
    ceiling_support: Overhead bracing (where required)

  interior_features:
    coat_hooks: 4× per stall
    bench: Wall-mounted fold-down type
      - dimensions: 400mm × 400mm
      - material: Phenolic resin
      - load_capacity: 200 kg (440 lbs)
    mirror: 600mm × 400mm, wall-mounted

  accessibility:
    accessible_stall: 1 unit (enlarged)
    dimensions: 1500mm × 1800mm (59" × 71")
    features:
      - Grab bars: 2× L-shaped, stainless steel
      - Fold-down seat: Heavy-duty, 500mm × 500mm
      - Door swing: Outward opening
      - Clear floor space: 1500mm diameter
```

### B.5 Amenity Facilities

#### B.5.1 Restroom Facilities
```yaml
restroom_specifications:
  configuration: Gender-neutral / All-gender facilities

  toilet_rooms:
    quantity: 4 individual rooms

    dimensions_per_room:
      width: 1800mm (71")
      depth: 2100mm (82")
      height: 2700mm (8'10")

    fixtures:
      toilet:
        type: Wall-hung, elongated bowl
        height: 450mm (18") rim height (ADA)
        material: Vitreous china, white
        flush: Dual-flush, sensor-activated
          - full_flush: 6 liters (1.6 gallons)
          - half_flush: 3 liters (0.8 gallons)
        carrier: In-wall steel frame

      sink:
        type: Wall-mounted, semi-recessed
        size: 550mm × 450mm (22" × 18")
        material: Vitreous china, white
        faucet: Sensor-activated, single-handle
        flow_rate: 1.9 L/min (0.5 GPM)

      accessories:
        toilet_paper: Recessed dispenser, double-roll
        soap_dispenser: Automatic foam dispenser
        paper_towel: Recessed dispenser, multi-fold
        waste_bin: Recessed, 20-liter capacity
        grab_bars: 3× per room (side, rear, front)
          - diameter: 35mm (1.375")
          - material: Stainless steel 304
          - finish: Brushed satin
          - mounting: Concealed flanges

  finishes:
    walls:
      material: Ceramic tile on cement board
      size: 300mm × 600mm
      color: White with gray accent band
      grout: Epoxy, stain-resistant, gray
      height: Full height (2700mm)

    floor:
      material: Non-slip porcelain tile
      size: 300mm × 300mm
      color: Medium gray
      slip_resistance: R11

    ceiling:
      material: Moisture-resistant gypsum board
      finish: Painted, semi-gloss white

  doors:
    width: 900mm (35")
    height: 2100mm (82")
    material: Solid core with HPL facing
    hardware: Privacy lock with emergency release
    closer: Adjustable hydraulic closer
    threshold: Flush transition, maximum 13mm
```

#### B.5.2 Shower Facilities
```yaml
shower_rooms:
  quantity: 6 individual shower rooms

  dimensions_per_room:
    width: 1200mm (47")
    depth: 1500mm (59")
    height: 2700mm (8'10")
    wet_area: 900mm × 1200mm (shower zone)
    dry_area: 600mm × 1200mm (drying zone)

  shower_fixture:
    type: Thermostatic mixing valve
    controls: Single-lever temperature and flow
    showerhead:
      type: Fixed overhead + handheld combo
      overhead: 250mm (10") rain head
      handheld: 3-function spray, 1500mm hose
      height: Overhead at 2100mm, slide bar to 2100mm
      finish: Chrome-plated brass
      flow_rate: 9.5 L/min (2.5 GPM) max

  drainage:
    floor_drain: Linear trench drain
    location: Threshold between wet and dry zones
    length: 1200mm (47")
    grate: Stainless steel, slot pattern
    slope: 1:50 towards drain

  waterproofing:
    system: Liquid-applied membrane
    coverage: Full wet area + 300mm beyond
    height: 2100mm on walls

  finishes:
    wet_area_walls:
      material: Porcelain tile
      size: 300mm × 600mm
      color: Light gray
      grout: Epoxy, mold-resistant

    wet_area_floor:
      material: Non-slip mosaic tile
      size: 50mm × 50mm
      color: Dark gray
      slip_resistance: R12 (barefoot area)

    dry_area:
      walls: Painted moisture-resistant gypsum
      floor: Matching locker area flooring

  accessories:
    hooks: 3× wall-mounted, stainless steel
    shelf: Ceramic tile shelf, 300mm × 200mm
    grab_bar: 1× horizontal, 600mm length
    mirror: 400mm × 600mm, wall-mounted

  door_system:
    type: Solid grade laminate partition
    width: 900mm (35")
    height: 2100mm (82")
    clearance: 150mm bottom, 600mm top
    hardware: Privacy lock with indicator

  ventilation:
    exhaust_fan: Individual per room
    capacity: 8 air changes per hour
    control: Humidity sensor + manual override
```

### B.6 Finishes Schedule

#### B.6.1 Floor Finishes
```yaml
flooring_zones:
  zone_b1_main_lockers:
    material: Luxury vinyl tile (LVT)
    specification: Heavy commercial grade
    size: 610mm × 610mm
    thickness: 3.2mm + 2mm underlayment
    wear_layer: 0.7mm
    pattern: Stone-look texture
    color: Warm gray
    slip_resistance: R10
    installation: Fully adhered

  zone_b2_changing_areas:
    dry_areas: Same as Zone B1
    wet_areas:
      material: Non-slip ceramic tile
      size: 300mm × 300mm
      thickness: 10mm
      finish: Matte textured
      color: Light gray
      slip_resistance: R11

  zone_b3_amenities:
    restrooms:
      material: Porcelain tile
      size: 300mm × 300mm
      finish: Anti-slip surface
      color: Medium gray
      slip_resistance: R11

    showers:
      material: Mosaic tile
      size: 50mm × 50mm
      finish: High-grip texture
      color: Dark gray
      slip_resistance: R12

  transitions:
    type: Aluminum transition strips
    profile: Low-profile ramp
    finish: Anodized aluminum, satin

  base:
    material: Vinyl cove base
    height: 100mm (4")
    color: Matching floor
    profile: Straight top edge
```

#### B.6.2 Wall Finishes
```yaml
wall_treatments:
  locker_areas:
    primary_finish:
      material: Painted gypsum board
      preparation: Level 4 finish
      primer: 1 coat acrylic
      paint: 2 coats semi-gloss acrylic
      color: Pale blue-gray (LRV 70)

    wainscot:
      height: 1200mm (4')
      material: FRP panels (fiber-reinforced plastic)
      thickness: 2.5mm
      finish: Smooth, high-gloss
      color: White
      trim: Aluminum H-molding

  changing_areas:
    walls: Same as locker areas
    wet_area_accent:
      material: Ceramic tile
      size: 100mm × 300mm subway tile
      color: White with gray grout
      pattern: Running bond
      height: Full height in shower zones

  restrooms:
    material: Ceramic tile, full height
    size: 300mm × 600mm
    color: White base with gray accent stripe
    grout: Epoxy, gray

  privacy_partitions:
    material: 13mm solid grade laminate
    color: Slate gray, textured
    edge: PVC edge banding, matching
```

#### B.6.3 Ceiling Finishes
```yaml
ceiling_systems:
  main_locker_area:
    type: Suspended acoustic tile
    tile_size: 600mm × 600mm
    thickness: 15mm
    edge: Square tegular
    finish: White, textured
    NRC: 0.70
    grid: White T-bar
    height: 3000mm (9'10")

  changing_and_amenities:
    type: Moisture-resistant panels
    size: 1200mm × 600mm
    material: Vinyl-faced gypsum
    finish: Smooth white
    grid: Aluminum, white powder coat
    height: 2700mm (8'10")

  shower_rooms:
    type: Solid surface panels
    material: PVC composite
    size: 1200mm × 600mm
    finish: Smooth, gloss white
    mounting: Concealed grid system
    height: 2700mm
```

### B.7 Mechanical, Electrical & Plumbing

#### B.7.1 HVAC Systems
```yaml
climate_control:
  system_type: Variable refrigerant flow (VRF)

  outdoor_unit:
    capacity: 20 kW (68,240 BTU/h)
    refrigerant: R-410A
    location: Roof-mounted, screened

  indoor_units:
    locker_area:
      type: Ceiling cassette, 4-way discharge
      quantity: 2
      capacity: 8 kW each

    changing_areas:
      type: Wall-mounted slim-line
      quantity: 2
      capacity: 4 kW each

  ventilation:
    general_areas:
      fresh_air: 10 L/s per person
      air_changes: 6 ACH

    shower_rooms:
      exhaust_rate: 50 L/s per room
      air_changes: 12 ACH
      control: Humidity sensor activated

    restrooms:
      exhaust_rate: 25 L/s per room
      air_changes: 10 ACH
      control: Occupancy sensor

  ductwork:
    supply: Spiral galvanized steel, insulated
    exhaust: PVC (wet areas) / galvanized (dry)
    diffusers: Aluminum, white powder coat
    grilles: Linear bar type in wet areas

  filtration:
    primary: MERV 13 pleated filters
    change_frequency: Quarterly

  controls:
    thermostats: Wireless, programmable
    zones: 4 independent zones
    scheduling: Occupancy-based
    setpoints:
      occupied: 21°C ± 2°C (70°F)
      unoccupied: 15°C winter / 27°C summer
```

#### B.7.2 Plumbing Systems
```yaml
water_supply:
  service_entry:
    size: 50mm (2") copper main
    pressure: 400 kPa (58 psi)
    shutoff: Ball valve with lockout

  hot_water:
    heater_type: Electric storage tank
    capacity: 200 liters (53 gallons)
    power: 6 kW, 230V
    temperature: 60°C (140°F) setpoint
    recirculation: Pump with timer
    insulation: R-12 jacket

  distribution:
    cold_water: Type K copper, 20mm mains
    hot_water: Type K copper, 20mm mains, insulated
    fixture_branches: 15mm copper

  fixture_count:
    toilets: 4× dual-flush, wall-hung
    sinks: 4× wall-mounted in restrooms
    showers: 6× thermostatic mixing valves
    drinking_fountain: 1× bottle filler combo
    hose_bibs: 2× for maintenance

  drainage:
    waste_lines:
      primary: 100mm PVC
      branches: 50mm PVC
      vents: 50mm PVC through roof

    floor_drains:
      quantity: 12 (wet areas + maintenance)
      size: 100mm diameter
      trap_seal: 75mm minimum
      grate: Stainless steel, removable

    shower_drains:
      type: Linear trench drain
      length: 1200mm each (6 total)
      slope: 1:50 to drain

  backflow_prevention:
    main_supply: Reduced pressure zone (RPZ) device
    shower_valves: Integral check valves
    hose_bibs: Vacuum breakers
```

#### B.7.3 Electrical Systems
```yaml
power_distribution:
  panel:
    location: Electrical room (Zone B3)
    voltage: 230V single-phase
    amperage: 200A
    breakers: 24-circuit panel

  lighting:
    locker_area:
      type: LED linear high-bay
      quantity: 12
      wattage: 40W each (Total: 480W)
      output: 4800 lumens per fixture
      color_temp: 4000K
      CRI: >80
      mounting: Suspended from ceiling
      control: Occupancy sensors + manual override

    changing_areas:
      type: LED recessed downlights
      quantity: 8
      wattage: 18W each
      output: 1600 lumens per fixture
      color_temp: 3500K
      CRI: >90
      dimming: Yes, 0-10V

    wet_areas:
      type: LED vapor-tight fixtures
      quantity: 6 (showers) + 4 (restrooms)
      wattage: 15W each
      IP_rating: IP65
      color_temp: 4000K

    emergency_lighting:
      exit_signs: 3× LED with battery backup
      emergency_lights: 6× twin-head LED units
      battery: 3-hour duration
      testing: Monthly automatic self-test

  power_outlets:
    locker_area: 8× duplex, 20A circuits
    changing_areas: 4× duplex (hair dryer use)
    maintenance: 2× GFCI-protected

  specialty_circuits:
    locker_charging: 20× USB charging ports
      - locations: Integrated into locker banks
      - output: 5V DC, 2.4A per port
      - total_power: 10A dedicated circuit

    hand_dryers: 4× high-speed units
      - power: 1800W each
      - circuits: Dedicated 20A each

  data_systems:
    access_control:
      card_readers: 2× (entry and lockers)
      network: Cat6a, PoE powered

    public_WiFi:
      access_point: 1× ceiling-mounted
      coverage: Full facility

  security:
    CCTV: 3× IP cameras
      - locations: Entry, locker area, corridor
      - resolution: 4MP
      - storage: 30-day NVR

    occupancy_monitoring:
      people_counter: At entrance
      real-time_display: Digital signage
```

### B.8 Accessibility and Compliance

#### B.8.1 ADA/Accessibility Requirements
```yaml
accessibility_features:
  lockers:
    accessible_units: 10 (5% of total)
    height_range: 380mm - 1220mm (15" - 48")
    reach_range: Within 1220mm (48") from floor
    clear_floor_space: 1500mm × 1500mm in front
    operating_force: <5 lbf for latches

  changing_stalls:
    accessible_stall: 1 unit
    dimensions: 1500mm × 1800mm (59" × 71")
    grab_bars: L-shaped, both sides
    fold_down_seat: 500mm × 500mm, 200kg capacity
    clear_floor_space: 1500mm diameter

  restrooms:
    all_rooms_accessible: Yes
    toilet_height: 450mm (18") rim
    grab_bars: Rear wall + side wall
    sink_height: 865mm (34") maximum
    knee_clearance: 685mm high × 760mm wide × 480mm deep
    faucet_controls: Lever or automatic

  showers:
    transfer_shower: 1 room configured
    dimensions: 900mm × 1500mm (36" × 60")
    seat: Fold-down, L-shaped
    grab_bars: 3 walls
    controls: Handheld spray with 1500mm hose

  circulation:
    minimum_aisle_width: 1500mm (59")
    turning_diameter: 1500mm (3 locations)
    accessible_route: Continuous from entrance

  signage:
    tactile_signs: Room identification
    braille: All permanent room signs
    pictograms: International symbols
    mounting_height: 1370mm - 1525mm (54" - 60")
```

#### B.8.2 Building Code Compliance
```yaml
code_requirements:
  occupancy_classification:
    ibc_group: A-3 Assembly
    sprinklered: Yes
    construction_type: Type V-B

  occupant_load:
    calculation_basis:
      locker_area: 1 person per 5m² = 18
      changing_areas: 1 person per 3m² = 10
      amenities: Fixture count = 16
    total_occupant_load: 44 persons

  egress:
    exit_quantity: 2 required
    exit_separation: >15m (50')
    corridor_width: 1500mm minimum
    travel_distance: <23m (75') to exit
    doors: Positive latching, panic hardware

  fire_protection:
    sprinklers: NFPA 13, Light Hazard
    fire_alarm: Addressable system
    smoke_detectors: Per NFPA 72
    fire_extinguishers: Type ABC, 10 lb (3 locations)

  plumbing_code:
    fixture_count: Per IPC Table 403.1
    water_efficiency: WaterSense certified fixtures
    backflow: Reduced pressure zone devices

  electrical_code:
    wiring: NEC compliant
    grounding: Per NEC Article 250
    GFCI: Required in wet locations
    arc_fault: Required in applicable circuits

  accessibility:
    standard: ADA Standards for Accessible Design
    barrier_free: Yes, full compliance
    assistive_listening: Induction loop system (if required)
```

---

## Integration Between Sections A & B

### Transition Zone Specifications
```yaml
connection_corridor:
  dimensions:
    length: 5000mm (16'5")
    width: 2000mm (6'7")
    height: 3000mm (9'10")

  finishes:
    floor: Continuous LVT from Section B
    walls: Painted gypsum, matching Section A
    ceiling: Suspended acoustic tile

  features:
    wayfinding: Digital directory at midpoint
    lighting: LED downlights, 4000K
    access_control: Card reader at Section B entry

  circulation:
    clear_width: 1800mm (71") minimum
    turning_space: 1500mm diameter provided
    accessible_route: Continuous, level
```

---

## Material Specifications Summary

### Key Materials Reference
```yaml
structural:
  concrete: C30/37 (4,350 psi)
  steel_reinforcement: Grade 500 (72.5 ksi)
  steel_framing: Galvanized, ASTM A653

finishes:
  paint: Low-VOC acrylic, eggshell/semi-gloss
  tile_ceramic: Porcelain, slip-resistant
  tile_grout: Epoxy, stain/mold resistant
  vinyl_flooring: LVT, 0.7mm wear layer
  laminate: Solid grade HPL, 13mm

fixtures:
  plumbing_fixtures: Vitreous china, white
  faucets: Sensor-activated, chrome
  accessories: Stainless steel 304, brushed

hardware:
  door_hardware: Stainless steel, ADA compliant
  partition_posts: Aluminum extrusion
  locker_steel: 18 gauge, powder-coated
```

---

## Maintenance and Operations

### Maintenance Access
```yaml
access_provisions:
  ceiling_access:
    panels: Removable acoustic tiles
    clearance: 600mm plenum depth
    locations: Above all service areas

  mechanical_access:
    room: Dedicated space in Zone B3
    size: 3000mm × 2000mm
    door: 900mm wide, keyed

  plumbing_access:
    panels: Removable at all valve locations
    size: 450mm × 450mm minimum
    finish: Matching wall finish

  electrical_access:
    panel_clearance: 1000mm in front
    height: 1200mm - 1800mm to center
    lighting: Dedicated task lighting
```

### Cleaning and Durability
```yaml
cleanability:
  floors: Sealed, mop-friendly surfaces
  walls: Washable finishes in high-traffic areas
  partitions: Non-porous laminate, chemical-resistant
  fixtures: Smooth surfaces, minimal crevices

durability_ratings:
  flooring: Heavy commercial grade
  paint: Scrub-resistant, 5000+ cycles
  tile: Abrasion resistance ≥4 (PEI rating)
  hardware: Corrosion-resistant materials
```

---

## Environmental and Sustainability

### Energy Efficiency
```yaml
energy_performance:
  lighting: 100% LED, 70% reduction vs. fluorescent
  HVAC: VRF system, SEER >16
  insulation: Exceeds minimum code by 25%
  water_heating: Heat pump technology (future)

  controls:
    occupancy_sensors: All spaces
    daylight_harvesting: Where applicable
    programmable_thermostats: All zones

  renewable_ready:
    solar_pv: Roof designed for future panels
    battery_storage: Space reserved
```

### Water Conservation
```yaml
water_efficiency:
  toilets: Dual-flush, 3/6 liter (0.8/1.6 GPF)
  faucets: 1.9 L/min (0.5 GPM) aerators
  showers: 9.5 L/min (2.5 GPM) maximum

  estimated_savings: 35% vs. standard fixtures

  rainwater_harvesting: Stub-outs provided for future
```

### Material Sustainability
```yaml
sustainable_materials:
  recycled_content:
    steel: 90%+ recycled
    gypsum_board: 95%+ recycled
    acoustic_tiles: 70%+ recycled

  low_VOC:
    paints: <50 g/L VOC
    adhesives: Low-emitting
    sealants: Water-based where possible

  certifications:
    flooring: FloorScore certified
    wood_products: FSC or PEFC certified
```

---

## Conclusion

This specification document provides comprehensive technical details for the design, construction, and operation of Building Sections A (Primary Entrance) and B (Locker Facilities). All specifications are intended to meet or exceed applicable building codes, accessibility standards, and industry best practices.

**For Additional Information:**
- Architectural drawings: See drawing set A-series
- Structural calculations: See engineering reports
- MEP coordination: See M/E/P drawing sets
- Product specifications: See Division 01-16 technical sections

**Document End**
