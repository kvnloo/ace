# Building Sections C & D: 3D Specifications
## Spectator Seating & Clubhouse/Social Facilities

**Document Version**: 1.0
**Created**: 2025-11-22
**Facility**: LawnTech Dynamics Autonomous Indoor Grass Court Facility
**Location**: Naperville, Illinois

---

## Table of Contents

1. [Section C: Spectator Seating](#section-c-spectator-seating)
2. [Section D: Clubhouse & Social](#section-d-clubhouse--social)
3. [Integration Specifications](#integration-specifications)
4. [Digital Twin Requirements](#digital-twin-requirements)
5. [Technical Appendix](#technical-appendix)

---

## Section C: Spectator Seating

### C.1 Overview

The spectator seating system provides flexible viewing capacity for all court levels with integrated accessibility features, premium viewing options, and autonomous environmental control systems.

### C.2 Layout Architecture

#### C.2.1 Ground Floor - Tennis Complex Seating

**Primary Viewing Area Specifications**

```yaml
Ground_Floor_Seating:
  Total_Capacity: 480 seats
  Distribution:
    Center_Court_Premium: 120 seats
    Court_1-6_Standard: 60 seats each (360 total)

  Seating_Zones:
    Zone_A_Premium:
      Capacity: 120 seats
      Row_Count: 8 rows
      Seats_Per_Row: 15
      Row_Spacing: 1.2m (47.2")
      Seat_Width: 0.55m (21.7")
      Elevation_Rise: 0.38m per row (15")
      Viewing_Angle: 12-18° optimal sightline

    Zone_B_Standard:
      Capacity: 360 seats (6 courts × 60)
      Row_Count: 6 rows per court
      Seats_Per_Row: 10
      Row_Spacing: 1.0m (39.4")
      Seat_Width: 0.50m (19.7")
      Elevation_Rise: 0.30m per row (11.8")
      Viewing_Angle: 10-15° sightline
```

**Accessibility Seating**

```yaml
ADA_Compliant_Seating:
  Wheelchair_Positions: 24 (5% of total capacity)
  Companion_Seats: 24 (adjacent to wheelchair positions)
  Distribution: 4 positions per major court area

  Dimensions:
    Wheelchair_Space: 0.91m × 1.22m (36" × 48")
    Companion_Seat_Width: 0.55m (21.7")
    Aisle_Width: 1.52m (60" minimum)
    Approach_Path: 1.22m (48" minimum)

  Elevation_Access:
    Ramp_Gradient: 1:12 maximum slope
    Ramp_Width: 1.52m (60")
    Landing_Platforms: Every 9.14m (30') rise
    Landing_Dimensions: 1.52m × 1.52m minimum
    Handrails: Both sides, dual height (0.86m & 0.71m)

  Viewing_Optimization:
    Sightline_Clearance: Unobstructed over standing spectators
    Preferred_Location: Midcourt, elevated rows 3-5
    Egress_Route: Direct access to emergency exits
```

#### C.2.2 First Floor - Mezzanine Sports Seating

**Badminton Courts (16 Courts)**

```yaml
Badminton_Seating:
  Total_Capacity: 320 seats
  Configuration: Perimeter gallery seating

  Gallery_Specifications:
    Width: 3.5m (11.5')
    Length: Continuous along court perimeter
    Seating_Type: Bench seating with backrests
    Capacity_Per_Court: 20 seats

  Dimensions:
    Bench_Depth: 0.45m (17.7")
    Backrest_Height: 0.40m (15.7")
    Bench_Height: 0.45m (17.7")
    Aisle_Behind_Benches: 1.2m (47.2")

  Viewing_Angle:
    Elevation: +2.5m above court level
    Sightline: 8-12° downward angle
    Court_Visibility: Full court coverage from any seat
```

**Squash Courts (4 Courts)**

```yaml
Squash_Seating:
  Total_Capacity: 160 seats
  Configuration: Elevated viewing gallery

  Gallery_Design:
    Type: Glass-walled viewing corridor
    Elevation: +3.0m above court level
    Width: 2.5m (8.2')
    Capacity_Per_Court: 40 seats

  Seating_Layout:
    Configuration: Stadium-style rows
    Row_Count: 4 rows
    Seats_Per_Row: 10
    Row_Spacing: 0.90m (35.4")
    Seat_Width: 0.48m (18.9")

  Viewing_Features:
    Front_Wall_Glass: 12mm tempered safety glass
    Viewing_Angle: 15-20° downward
    Sound_System: Court audio feed to gallery
    Score_Display: LED boards per court
```

**Table Tennis Area (16 Stations)**

```yaml
Table_Tennis_Seating:
  Total_Capacity: 128 seats
  Configuration: Flexible modular seating

  Seating_Specifications:
    Type: Retractable bleacher system
    Capacity_Per_Section: 32 seats
    Sections: 4 independent units

  Dimensions:
    Extended_Depth: 3.2m (10.5')
    Retracted_Depth: 0.6m (2.0')
    Width_Per_Section: 6.0m (19.7')
    Row_Count: 4 rows
    Seats_Per_Row: 8

  Deployment:
    Operation_Mode: Electric motor-driven
    Deployment_Time: 90 seconds
    Storage_Mode: Fold against wall
    Safety_Features: Auto-stop sensors, manual override
```

#### C.2.3 Second Floor - Specialty Courts Seating

**Pickleball Courts (8 Courts)**

```yaml
Pickleball_Seating:
  Total_Capacity: 240 seats
  Configuration: Courtside and elevated options

  Courtside_Seating:
    Capacity: 120 seats (15 per court)
    Type: Individual chairs with cup holders
    Spacing: 0.60m (23.6") center-to-center
    Distance_From_Court: 2.5m (8.2') from baseline

  Elevated_Gallery:
    Capacity: 120 seats
    Elevation: +2.0m above court level
    Configuration: 3 rows × 40 seats
    Row_Spacing: 1.0m (39.4")
    Viewing_Angle: 10-14° sightline
```

**Real Tennis Court (1 Court)**

```yaml
Real_Tennis_Seating:
  Total_Capacity: 60 seats
  Configuration: Traditional gallery seating

  Dedans_Gallery:
    Capacity: 40 seats
    Type: Historic-style bench seating
    Elevation: Ground level along hazard end
    Bench_Length: 12.0m (39.4')
    Bench_Depth: 0.50m (19.7")

  Grille_Side_Gallery:
    Capacity: 20 seats
    Type: Elevated viewing platform
    Elevation: +1.5m above court level
    Width: 2.0m (6.6')
    Length: 8.0m (26.2')
```

### C.3 Seating Materials & Construction

#### C.3.1 Seating Units

**Premium Seating Specifications**

```yaml
Premium_Seat_Construction:
  Frame:
    Material: Aluminum alloy 6061-T6
    Finish: Powder-coated (RAL 7024 Graphite Gray)
    Leg_Design: Cantilever mount to minimize floor obstructions
    Weight_Capacity: 250kg (550 lbs) per seat

  Cushioning:
    Seat_Pad_Material: High-density polyurethane foam (50 kg/m³)
    Backrest_Pad_Material: Medium-density foam (35 kg/m³)
    Upholstery: Commercial-grade vinyl (fire-rated Class 1)
    Color_Options: Navy blue, charcoal gray, forest green
    Thickness: 75mm seat, 50mm backrest

  Ergonomics:
    Seat_Depth: 450mm (17.7")
    Seat_Width: 550mm (21.7")
    Backrest_Height: 400mm (15.7")
    Backrest_Angle: 105° from horizontal
    Lumbar_Support: Integrated curved design

  Features:
    Cup_Holder: Integrated retractable design
    Armrests: Foldable, shared between seats
    Tip-Up_Mechanism: Gravity-assisted, dampened return
    Row_Numbering: Engraved aluminum plates
```

**Standard Seating Specifications**

```yaml
Standard_Seat_Construction:
  Frame:
    Material: Steel tubular frame (38mm diameter)
    Finish: Epoxy powder coating
    Mounting: Fixed to floor with concealed anchors
    Weight_Capacity: 180kg (400 lbs) per seat

  Seating_Surface:
    Material: Molded polypropylene
    Color: Stadium gray with UV stabilizers
    Texture: Anti-slip ribbed pattern
    Thickness: 8mm
    Drainage: Perforated for water drainage

  Dimensions:
    Seat_Width: 500mm (19.7")
    Seat_Depth: 400mm (15.7")
    Backrest_Height: 350mm (13.8")
    Overall_Height: 800mm (31.5")

  Features:
    Fold_Mechanism: Tip-up seat with gravity return
    Row_Numbers: Injection-molded into backrest
    Fire_Rating: ASTM E84 Class A
```

#### C.3.2 Structural Support Systems

**Riser Platform Construction**

```yaml
Riser_Platform_Specifications:
  Structure:
    Primary_Beams: Steel I-beams (W8×15)
    Secondary_Joists: Steel C-channels (C6×8.2) @ 600mm o.c.
    Decking: Concrete topping on metal deck (20 ga.)
    Concrete_Thickness: 75mm (3") lightweight concrete

  Load_Capacity:
    Live_Load: 4.8 kN/m² (100 psf)
    Point_Load: 1.3 kN (300 lbs) at any point
    Safety_Factor: 2.5x design load

  Support_Columns:
    Type: Steel HSS (Hollow Structural Section)
    Size: 150mm × 150mm × 6mm wall (6"×6"×1/4")
    Spacing: 4.5m (14.8') typical grid
    Foundation: Anchor bolts into structural slab

  Connections:
    Beam_Connections: Welded or bolted moment connections
    Joist_Connections: Clip angles with 2 bolts minimum
    Column_Base_Plates: 300mm × 300mm × 20mm steel
```

**Accessibility Ramps**

```yaml
Ramp_Construction:
  Slope_Specifications:
    Maximum_Grade: 1:12 (8.33%)
    Cross_Slope: 1:48 (2.08%) maximum
    Running_Slope_Tolerance: ±0.5%

  Surface_Material:
    Type: Non-slip concrete finish
    Broom_Finish: Perpendicular to ramp direction
    Slip_Resistance: Minimum 0.6 coefficient (dry)
    Color: Contrast with surrounding (safety yellow edge)

  Edge_Protection:
    Curb_Height: 100mm (4") minimum
    Curb_Width: 50mm (2") minimum
    Extension: Full length of ramp

  Handrails:
    Height_Upper: 860mm (34") above ramp surface
    Height_Lower: 710mm (28") above ramp surface
    Extension_Beyond_Ramp: 300mm (12") at top and bottom
    Gripping_Surface: 38mm (1.5") diameter round
    Clearance_From_Wall: 45mm (1.75")
    Material: Stainless steel 304, brushed finish

  Landing_Platforms:
    Minimum_Size: 1.5m × 1.5m (5' × 5')
    Frequency: Every 9m (30') of ramp rise
    Level_Tolerance: ±3mm (1/8")
    Edge_Protection: Matching ramp curb system
```

### C.4 Accessibility Features

#### C.4.1 Comprehensive ADA Compliance

**Circulation Routes**

```yaml
Accessible_Routes:
  Primary_Corridors:
    Width: 1.8m (6') minimum
    Clear_Height: 2.4m (8') minimum
    Cross_Slope: 1:48 (2%) maximum
    Running_Slope: 1:20 (5%) maximum

  Turning_Spaces:
    T-Turn_Space: 1.5m × 1.5m arms (5' × 5')
    Circular_Turn: 1.8m (6') diameter minimum
    Frequency: Every 60m (200') maximum

  Doors:
    Clear_Width: 860mm (34") minimum
    Maneuvering_Clearance: 1.5m (5') on pull side
    Threshold_Height: 13mm (0.5") maximum
    Opening_Force: 22N (5 lbf) maximum
    Closer_Delay: 5 seconds minimum

  Signage:
    Height_Range: 1.2m - 1.5m (48" - 60") to centerline
    Tactile_Characters: Raised 0.8mm (1/32")
    Braille_Below: Grade 2 contracted braille
    Character_Height: 16mm - 50mm based on viewing distance
    Contrast_Ratio: 70% minimum light-on-dark or vice versa
```

**Assistive Listening Systems**

```yaml
Hearing_Assistance:
  Technology_Type: RF-based assistive listening system
  Coverage_Area: All seating zones

  Transmitter_Specifications:
    Frequency_Range: 72-76 MHz (dedicated band)
    Power_Output: 100mW
    Coverage_Radius: 50m (164') per transmitter
    Transmitter_Count: 8 units (strategic placement)

  Receiver_Specifications:
    Available_Units: 48 personal receivers (10% of ADA seats)
    Battery_Type: Rechargeable Li-ion
    Battery_Life: 8 hours continuous use
    Volume_Control: User-adjustable 20-step
    Neckloop_Compatibility: T-coil compatible

  Distribution_System:
    Check-Out_Desk: Located at main entrance
    Deposit_Requirement: Photo ID or credit card
    Sanitization: UV-C sterilization after each use
    Storage: Secure charging cabinet with 60 slots
```

**Visual Accessibility**

```yaml
Visual_Accommodation:
  Sightline_Calculations:
    Eye_Height_Seated: 1.07m (42") standard
    Eye_Height_Wheelchair: 1.14m (45")
    C_Value_Target: 120mm (4.7") minimum
    Riser_Height_Calculation: C + (D × tan(α))
      # C = vertical clearance
      # D = horizontal distance between rows
      # α = viewing angle

  Contrast_Markers:
    Step_Nosing: High-contrast yellow tape
    Nosing_Width: 50mm (2")
    Retroreflectivity: 250 mcd/lux/m² minimum
    Aisle_Edge_Marking: Continuous along full length

  Lighting_Considerations:
    Minimum_Illuminance: 100 lux (10 fc) at tread surface
    Uniformity_Ratio: 10:1 maximum to minimum
    Glare_Control: Shielded fixtures, indirect lighting
    Emergency_Lighting: Photoluminescent path marking
```

### C.5 Environmental Control Systems

#### C.5.1 HVAC for Spectator Areas

**Climate Control Zones**

```yaml
HVAC_Zone_Configuration:
  Zone_Division:
    Ground_Floor_Premium: Independent zone (Zone C-1)
    Ground_Floor_Standard: 2 zones (Zone C-2A, C-2B)
    Mezzanine_Gallery: Single zone (Zone C-3)
    Upper_Level_Seating: Single zone (Zone C-4)

  Design_Criteria_Per_Zone:
    Occupied_Temperature: 20-22°C (68-72°F)
    Relative_Humidity: 40-60%
    Ventilation_Rate: 10 L/s per person (20 CFM)
    Air_Changes_Per_Hour: 6 ACH minimum

  Load_Calculations:
    Sensible_Heat_Gain_Per_Person: 75W (256 BTU/hr)
    Latent_Heat_Gain_Per_Person: 55W (188 BTU/hr)
    Lighting_Heat_Gain: 15W/m² (4.7W/ft²)
    Solar_Heat_Gain: Minimized by window placement
    Transmission_Heat_Loss: R-30 insulation minimum
```

**Air Distribution Design**

```yaml
Air_Distribution_System:
  Supply_Air_Method:
    Type: Underfloor air distribution (UFAD)
    Supply_Outlets: Floor-level swirl diffusers
    Outlet_Spacing: 2.5m (8.2') grid pattern
    Outlet_Height: Flush with floor finish

  Supply_Air_Parameters:
    Temperature: 16-18°C (61-64°F)
    Velocity_At_Outlet: 0.5 m/s (100 fpm) maximum
    Throw_Distance: 1.8m (6') @ 0.25 m/s terminal velocity
    Air_Pattern: 360° radial distribution

  Return_Air_System:
    Return_Grilles: High-wall mounted
    Grille_Height: 2.7m (9') above floor
    Grille_Size: 600mm × 600mm (24" × 24")
    Grille_Spacing: 6m (20') on center
    Return_Air_Velocity: 2.5 m/s (500 fpm) maximum

  Ductwork_Specifications:
    Supply_Duct_Material: Galvanized sheet metal, insulated
    Return_Duct_Material: Galvanized sheet metal
    Insulation: R-8 fiberglass with vapor barrier
    Duct_Sealing: All joints sealed to SMACNA Class A
    Pressure_Class: 500 Pa (2" w.g.) positive, 1250 Pa negative
```

**Air Quality Management**

```yaml
Indoor_Air_Quality:
  Filtration_System:
    Pre_Filter: MERV 8 (35% efficiency)
    Final_Filter: MERV 13 (90% efficiency @ 1.0 μm)
    Filter_Frames: Side-access with gasket seals
    Pressure_Drop_Monitoring: Differential pressure sensors
    Filter_Replacement_Alert: Building automation system

  CO2_Monitoring:
    Sensor_Type: NDIR (non-dispersive infrared)
    Sensor_Locations: 1 per zone at return air
    Setpoint: 800 ppm maximum
    Demand_Control: Modulate outdoor air damper
    Accuracy: ±50 ppm @ 1000 ppm

  Humidity_Control:
    Humidification: Steam injection in AHU
    Dehumidification: Cooling coil with reheat
    Setpoint_Range: 45% ± 5% RH
    Sensor_Type: Capacitive RH sensor
    Control_Authority: BAS proportional control
```

#### C.5.2 Lighting Systems

**General Illumination**

```yaml
Ambient_Lighting:
  Technology: LED high-bay luminaires

  Light_Levels:
    Seating_Area_Horizontal: 200 lux (20 fc) average
    Aisles_And_Stairs: 100 lux (10 fc) minimum
    Emergency_Egress_Paths: 10 lux (1 fc) minimum

  Fixture_Specifications:
    Luminaire_Type: LED high-output downlight
    Wattage: 100W per fixture
    Lumen_Output: 13,000 lumens (130 lm/W efficacy)
    Color_Temperature: 4000K (neutral white)
    CRI: 90+ (excellent color rendering)
    Beam_Angle: 60° medium flood

  Fixture_Layout:
    Mounting_Height: 4.5m (14.8') above floor
    Spacing: 4.0m × 4.0m (13' × 13') grid
    Fixture_Count_Ground_Floor: 84 luminaires
    Fixture_Count_Mezzanine: 56 luminaires
    Fixture_Count_Upper_Level: 32 luminaires

  Control_System:
    Dimming_Protocol: 0-10V DC analog dimming
    Dimming_Range: 10% to 100%
    Zones: 8 independent control zones
    Scene_Presets: Pre-event (50%), Event (100%), Intermission (75%)
    Occupancy_Sensors: Ultrasonic + PIR dual-technology
    Daylight_Harvesting: Photocells in perimeter zones
```

**Accent & Feature Lighting**

```yaml
Feature_Lighting:
  Court_Highlight_Lighting:
    Purpose: Draw attention to featured courts
    Fixture_Type: LED track-mounted spotlights
    Beam_Angle: 25° narrow spot
    Output: 2,000 lumens per fixture
    Color_Temperature: 3000K (warm white)
    Dimming: Full-range 0-100%

  Architectural_Accent_Lighting:
    Purpose: Enhance architectural features
    Fixture_Type: Linear LED wall washers
    Output: 800 lumens per foot
    Beam_Distribution: Asymmetric wall wash
    Color_Temperature: 3500K

  Wayfinding_Lighting:
    Path_Markers: LED step lights in risers
    Aisle_Lighting: Floor-recessed LED markers
    Exit_Signs: LED pictogram with battery backup
    Output_Per_Marker: 50 lumens
    Spacing: 3m (10') on center
```

**Emergency & Safety Lighting**

```yaml
Emergency_Lighting_System:
  Code_Requirements:
    Illumination_Level: 10 lux (1 fc) average
    Uniformity_Ratio: 40:1 maximum to minimum
    Duration: 90 minutes minimum
    Activation_Time: <10 seconds from power loss

  Emergency_Luminaires:
    Type: LED with integral battery backup
    Lumen_Output: 1,000 lumens (emergency mode)
    Battery_Type: Sealed lead-acid or Li-ion
    Self_Testing: Monthly function test, annual duration test
    Test_Results_Logging: BAS integration

  Exit_Signage:
    Type: LED pictogram with directional arrows
    Visibility_Distance: 30m (100')
    Face_Color: Green on white background
    Mounting_Height: 2.0m (6.6') to bottom of sign
    Battery_Backup: 90-minute rated

  Egress_Path_Marking:
    Type: Photoluminescent tape
    Luminance: 30 mcd/m² after 10 minutes
    Location: Stair nosings, handrails, exit paths
    Width: 50mm (2")
    Charging: Ambient light or UV charge stations
```

### C.6 Safety & Egress Systems

#### C.6.1 Fire Life Safety

**Fire Detection & Alarm**

```yaml
Fire_Alarm_System:
  System_Type: Addressable analog detection

  Detection_Devices:
    Smoke_Detectors:
      Type: Photoelectric with thermal backup
      Spacing: 9m × 9m (30' × 30') coverage
      Sensitivity: Obscuration 2-4% per foot
      Location: Ceiling-mounted, all zones

    Heat_Detectors:
      Type: Rate-of-rise + fixed temperature
      Rating: 57°C (135°F) fixed, 8°C/min ROR
      Location: Mechanical rooms, storage areas

    Manual_Pull_Stations:
      Type: Single-action dual indicator
      Location: All exit pathways, max 60m (200') travel
      Mounting_Height: 1.1m - 1.4m (42" - 54") to handle

  Notification_Appliances:
    Horns: 90 dBA minimum, wall-mounted
    Strobes: 75 candela, wall-mounted
    Horn_Strobe_Combo: Primary notification device
    Spacing: Per NFPA 72 coverage requirements
    Synchronization: All strobes synchronized

  System_Features:
    Voice_Evacuation: Pre-recorded messages in 3 languages
    Mass_Notification: Integration with building PA
    Remote_Annunciation: Fire department connection
    Graphic_Annunciator: Main fire control panel
```

**Fire Suppression Systems**

```yaml
Sprinkler_System:
  System_Classification: Ordinary Hazard Group 1

  Sprinkler_Specifications:
    Head_Type: Pendent, concealed, quick-response
    Temperature_Rating: 68°C (155°F)
    Coverage_Area: 12m² (130 ft²) per head
    Spacing: 3.7m × 3.7m (12' × 12') maximum

  Hydraulic_Design:
    Design_Area: 140m² (1,500 ft²)
    Density: 6.1 L/min/m² (0.15 gpm/ft²)
    Hose_Stream_Allowance: 950 L/min (250 gpm)
    Duration: 60 minutes

  System_Components:
    Pipe_Material: Black steel Schedule 40
    Pipe_Sizing: Hydraulically calculated
    Main_Riser: 150mm (6") diameter
    Branch_Lines: 25mm - 65mm (1" - 2.5")

  Monitoring:
    Flow_Switches: Each floor zone
    Tamper_Switches: All control valves
    Pressure_Gauges: System riser and remote points
    Water_Level_Indicator: Fire pump suction tank
```

#### C.6.2 Egress Analysis

**Occupant Load Calculations**

```yaml
Occupant_Load_By_Area:
  Ground_Floor_Seating:
    Area: 840 m² (9,040 ft²)
    Occupancy_Factor: 0.46 m²/person (5 ft²/person) - fixed seats
    Calculated_Load: 1,826 persons (actual seat count: 480)
    Design_Load: Use actual seat count

  Mezzanine_Seating:
    Area: 620 m² (6,670 ft²)
    Occupancy_Factor: 0.65 m²/person (7 ft²/person) - bench seating
    Calculated_Load: 954 persons (actual capacity: 608)
    Design_Load: Use actual capacity

  Upper_Level_Seating:
    Area: 380 m² (4,090 ft²)
    Occupancy_Factor: 0.46 m²/person (5 ft²/person)
    Calculated_Load: 826 persons (actual seat count: 300)
    Design_Load: Use actual seat count

  Total_Building_Occupant_Load: 1,388 persons
```

**Egress Capacity Analysis**

```yaml
Exit_Configuration:
  Required_Exits:
    Occupant_Load: 1,388 persons
    Required_Exits: 4 minimum (>1000 occupants)
    Provided_Exits: 6 exits

  Exit_Capacity_Calculations:
    Stair_Capacity_Factor: 0.076 persons per mm width per floor
    Door_Capacity_Factor: 0.164 persons per mm width

    Exit_Stair_1_North:
      Width: 1.8m (1,800mm)
      Capacity: 137 persons per floor (1800 × 0.076)
      Serves: All floors

    Exit_Stair_2_South:
      Width: 1.8m (1,800mm)
      Capacity: 137 persons per floor
      Serves: All floors

    Exit_Stair_3_East:
      Width: 1.5m (1,500mm)
      Capacity: 114 persons per floor
      Serves: Ground and Mezzanine

    Exit_Stair_4_West:
      Width: 1.5m (1,500mm)
      Capacity: 114 persons per floor
      Serves: Ground and Mezzanine

    Exit_Doors_Ground_Level:
      Door_1_Main: 2.4m (2,400mm) - Capacity 394 persons
      Door_2_Secondary: 1.8m (1,800mm) - Capacity 295 persons

  Total_Exit_Capacity:
    Ground_Floor: 1,091 persons (exceeds 480 required)
    Mezzanine: 502 persons (exceeds 608 required - adequate with 2-stage egress)
    Upper_Level: 388 persons (exceeds 300 required)
```

**Travel Distance & Dead-End Analysis**

```yaml
Egress_Path_Measurements:
  Travel_Distance_To_Exit:
    Maximum_Allowed: 75m (250') - sprinklered building
    Actual_Maximum_Ground_Floor: 52m (171')
    Actual_Maximum_Mezzanine: 48m (157')
    Actual_Maximum_Upper_Level: 44m (144')
    Compliance: All areas within limits

  Dead_End_Corridors:
    Maximum_Allowed: 6m (20')
    Dead_End_Locations: None - all corridors lead to 2+ exits

  Common_Path_Of_Egress:
    Maximum_Allowed: 23m (75')
    Actual_Maximum: 18m (59')
    Compliance: Within limits

  Exit_Discharge:
    Discharge_Point: Direct to public way at grade
    Discharge_Width: Minimum 2.4m (8') clear path
    Discharge_Path: Maintained clear year-round
```

---

## Section D: Clubhouse & Social

### D.1 Overview

The Clubhouse & Social facilities provide comprehensive amenities including food service, retail, locker rooms, lounges, administrative offices, and social gathering spaces integrated with autonomous building systems.

### D.2 Space Allocation & Layout

#### D.2.1 Ground Floor - Main Clubhouse (Level 0)

**Reception & Lobby**

```yaml
Main_Lobby:
  Total_Area: 185 m² (1,990 ft²)
  Ceiling_Height: 4.5m (14.8')

  Functional_Zones:
    Reception_Desk:
      Dimensions: 4.0m × 1.2m × 1.1m high (13' × 4' × 3.6')
      Material: Solid surface countertop, wood base
      Positions: 3 reception stations
      Features: Integrated computers, phone, card readers
      Accessibility: Lowered section 0.86m (34") high

    Waiting_Area:
      Area: 65 m² (700 ft²)
      Seating_Capacity: 24 persons
      Furniture: Modular lounge seating
      Layout: 3 groupings of 8 seats

    Information_Display:
      Type: 85" interactive digital display
      Resolution: 4K (3840 × 2160)
      Mounting: Floor stand, tilt-adjustable
      Content: Court schedules, events, facility map

  Finishes:
    Flooring: Large-format porcelain tile (600mm × 1200mm)
    Walls: Paint on gypsum board with wood accent panels
    Ceiling: Suspended acoustic tile with integrated lighting
    Accent_Wall: Living plant wall (vertical garden system)
```

**Pro Shop / Retail**

```yaml
Pro_Shop:
  Total_Area: 120 m² (1,290 ft²)

  Retail_Zones:
    Apparel_Section:
      Area: 45 m² (484 ft²)
      Wall_Display: 12m linear (39.4') of slatwall
      Floor_Fixtures: 4 four-way racks, 2 round racks
      Fitting_Rooms: 2 rooms @ 1.5m × 1.5m (5' × 5')

    Equipment_Section:
      Area: 50 m² (538 ft²)
      Racquet_Display: Wall-mounted grid system
      Shelving: 8m (26.2') of adjustable shelving
      Demo_Area: 2m × 3m (6.6' × 9.8') for racquet testing

    Point_Of_Sale:
      Counter_Dimensions: 2.5m × 0.8m × 1.0m high (8.2' × 2.6' × 3.3')
      Stations: 2 POS terminals
      Back_Office: 15 m² (161 ft²) for inventory & staff

  Storage:
    Stock_Room: 25 m² (269 ft²)
    Shelving_System: Industrial wire shelving, adjustable
    Access: Secured door from sales floor

  Security:
    EAS_System: RF-based electronic article surveillance
    Cameras: 4 HD cameras with 360° coverage
    Safe: Floor-mounted drop safe for cash
```

**Café & Nutrition Bar**

```yaml
Cafe_Area:
  Total_Area: 240 m² (2,580 ft²)

  Service_Areas:
    Coffee_Bar:
      Length: 6.0m (19.7')
      Equipment: Espresso machine, grinders, brewers
      Capacity: 2 baristas simultaneously

    Juice_&_Smoothie_Bar:
      Length: 4.5m (14.8')
      Equipment: Commercial blenders (3), refrigerated display
      Prep_Space: Cutting boards, sink, ingredient storage

    Grab_&_Go_Display:
      Dimensions: 2.5m × 1.2m (8.2' × 3.9')
      Type: Refrigerated self-serve case
      Capacity: 80-100 items

    Checkout_Counter:
      Length: 2.0m (6.6')
      Stations: 1 POS terminal
      Features: Contactless payment, mobile ordering pickup

  Seating_Configuration:
    Two_Top_Tables: 8 tables @ 0.7m × 0.7m (28" × 28")
    Four_Top_Tables: 6 tables @ 0.9m × 0.9m (36" × 36")
    Bar_Height_Seating: 12 seats along window counter
    Total_Seating: 52 seats

  Kitchen_Prep:
    Area: 45 m² (484 ft²)
    Equipment:
      - Refrigerator: 2-door reach-in, 1400L capacity
      - Freezer: Single-door reach-in, 700L capacity
      - Microwave_Oven: Commercial 1800W
      - Toaster_Oven: Conveyor-type
      - Hand_Sink: 3-compartment with sprayer
      - Prep_Surfaces: Stainless steel counters, 4.5m total
```

**Locker Rooms - Premium (Ground Floor)**

```yaml
Premium_Locker_Rooms:
  Total_Area_Men: 180 m² (1,940 ft²)
  Total_Area_Women: 180 m² (1,940 ft²)

  Locker_Configuration:
    Locker_Type: Full-height premium lockers
    Dimensions_Per_Locker: 0.35m W × 0.50m D × 1.8m H (14" × 20" × 6')
    Material: Powder-coated steel with wood-grain finish
    Locks: RFID-enabled electronic locks
    Total_Lockers_Per_Room: 120 lockers

  Changing_Area:
    Area_Per_Room: 85 m² (915 ft²)
    Benches: Solid surface with cedar slats
    Bench_Dimensions: 0.40m W × variable length
    Privacy_Partitions: Floor-to-ceiling at changing stalls
    Changing_Stalls: 8 per room

  Shower_Facilities:
    Individual_Showers: 12 per room
    Shower_Dimensions: 1.2m × 1.2m (4' × 4')
    Shower_Type: Walk-in with glass enclosure
    Controls: Thermostatic mixing valve
    Shower_Heads: Dual (rain head + handheld)
    Accessibility: 2 ADA-compliant showers per room

  Grooming_Area:
    Vanity_Length: 8.0m (26.2')
    Sinks: 10 undermount sinks per room
    Mirrors: Full-width LED-backlit mirrors
    Countertop: Solid surface, white quartz
    Outlets: 20 outlets (hair dryers, shavers)
    Amenities: Hair dryers, complimentary toiletries

  Additional_Facilities:
    Sauna:
      Area: 12 m² (129 ft²)
      Capacity: 8 persons
      Type: Electric heater, cedar interior
      Temperature: 80-90°C (176-194°F)

    Steam_Room:
      Area: 10 m² (108 ft²)
      Capacity: 6 persons
      Generator: 12 kW steam generator
      Temperature: 43-46°C (110-115°F)

    Toilets:
      Stalls: 8 standard + 1 ADA-compliant per room
      Partitions: Floor-to-ceiling, high-pressure laminate
      Fixtures: Dual-flush wall-hung toilets

    Urinals_(Men):
      Quantity: 6 wall-hung waterless urinals
      Privacy_Screens: Between each urinal
```

#### D.2.2 Mezzanine Level - Social & Events (Level 1)

**Members' Lounge**

```yaml
Members_Lounge:
  Total_Area: 280 m² (3,010 ft²)
  Ceiling_Height: 4.0m (13.1')

  Seating_Zones:
    Conversation_Areas:
      Quantity: 5 distinct groupings
      Furniture_Per_Group: Sofa, 2 armchairs, coffee table
      Seating_Capacity: 45 persons (all zones)

    Reading_Nook:
      Area: 35 m² (377 ft²)
      Seating: 12 leather reading chairs
      Lighting: Adjustable task lamps per seat
      Bookshelves: Built-in walnut shelving

    Fireplace_Area:
      Type: Double-sided electric fireplace
      Dimensions: 2.0m W × 0.5m D × 1.5m H (6.6' × 1.6' × 5')
      Seating: Semicircular arrangement, 16 seats
      Hearth: Natural stone surround

  Technology:
    WiFi_Coverage: High-density AP deployment
    Charging_Stations: USB and wireless charging at tables
    Display_Screens: 3 × 65" displays for sports viewing
    Audio_System: Distributed ceiling speakers, zone control

  Finishes:
    Flooring: Luxury vinyl plank (wood-look)
    Walls: Paint with fabric-wrapped acoustic panels
    Ceiling: Exposed structure with acoustic treatment
    Accent_Features: Reclaimed wood feature wall
```

**Multi-Purpose Event Space**

```yaml
Event_Space:
  Total_Area: 220 m² (2,370 ft²)
  Ceiling_Height: 4.0m (13.1')

  Flexible_Configuration:
    Partition_System: Operable acoustic partition walls
    Partition_Count: 2 partitions
    Divided_Spaces: 3 rooms @ 73 m² each (786 ft²)
    Sound_Transmission_Class: STC 50

  Seating_Capacities:
    Full_Space_Theater: 200 persons
    Full_Space_Banquet: 120 persons (12 per 1.8m round table)
    Full_Space_Classroom: 90 persons (18 tables × 5 persons)
    Divided_Room_Theater: 65 persons per room
    Divided_Room_Banquet: 40 persons per room

  Built_In_Features:
    Projection_Screen: 4.0m × 2.25m (13.1' × 7.4') motorized
    Projector: 7,000 lumens, 4K resolution, ceiling-mounted
    Audio_System: 8 ceiling speakers + wireless mics
    Lighting: Dimmable LED recessed, scene presets

  Support_Spaces:
    Storage_Room: 25 m² (269 ft²)
    Stored_Furniture: 200 stacking chairs, 20 folding tables
    Coat_Closet: 8 m² (86 ft²)
    Kitchenette: Sink, refrigerator, coffee maker
```

**Viewing Terrace (Outdoor)**

```yaml
Outdoor_Terrace:
  Total_Area: 150 m² (1,615 ft²)

  Construction:
    Deck_Material: Composite decking (wood alternative)
    Plank_Size: 140mm × 23mm (5.5" × 0.9")
    Color: Charcoal gray
    Substructure: Aluminum framing system
    Slope: 1% for drainage

  Furnishings:
    Dining_Tables: 8 tables @ 1.2m × 0.75m (4' × 2.5')
    Chairs: 32 all-weather stacking chairs
    Lounge_Seating: 2 sectional sofas
    Umbrellas: 8 × 2.7m (9') diameter market umbrellas

  Railing_System:
    Height: 1.07m (42")
    Type: Glass panel with aluminum posts
    Glass: 10mm tempered safety glass
    Post_Spacing: 1.2m (4') on center

  Amenities:
    Outdoor_Heaters: 4 infrared patio heaters
    Lighting: String lights + LED deck lighting
    Power_Outlets: 6 weatherproof GFCI outlets
    Gas_Connection: Natural gas line for future grill
```

#### D.2.3 Administrative & Back-of-House

**Administrative Offices**

```yaml
Office_Layout:
  Total_Area: 180 m² (1,940 ft²)

  Office_Types:
    Director_Office:
      Area: 25 m² (269 ft²)
      Furniture: Executive desk, credenza, guest chairs
      Storage: Built-in file cabinets

    Manager_Offices:
      Quantity: 3 offices
      Area_Each: 15 m² (161 ft²)
      Furniture: Desk, task chair, guest chair, bookshelf

    Open_Workspace:
      Area: 75 m² (807 ft²)
      Workstations: 6 cubicle workstations
      Workstation_Size: 1.5m × 1.5m (5' × 5')
      Partitions: 1.35m (53") height for privacy

    Conference_Room:
      Area: 30 m² (323 ft²)
      Table: 3.6m × 1.2m (12' × 4') for 10 persons
      Technology: 75" display, video conferencing system

  Support_Spaces:
    Copy_Room: 10 m² (108 ft²) - copier, supplies
    Break_Room: 15 m² (161 ft²) - kitchenette, table for 4
    Storage: 10 m² (108 ft²) - shelving for documents
```

**Maintenance & Facilities**

```yaml
Maintenance_Areas:
  Facilities_Office:
    Area: 20 m² (215 ft²)
    Functions: Maintenance supervisor office
    Features: Desk, computer, radio charging station

  Tool_Room:
    Area: 30 m² (323 ft²)
    Storage: Pegboard walls, tool chests, parts bins
    Workbench: 2.4m × 0.75m (8' × 2.5')
    Shelving: Industrial wire rack, 5-tier

  Equipment_Storage:
    Area: 40 m² (431 ft²)
    Stored_Equipment:
      - Court cleaning equipment
      - HVAC filters and parts
      - Lighting maintenance supplies
      - Seasonal decorations

  Custodial_Rooms:
    Quantity: 4 closets (1 per floor)
    Area_Each: 6 m² (65 ft²)
    Equipment: Mop sink, storage for cleaning supplies
```

### D.3 Interior Design & Finishes

#### D.3.1 Material Specifications

**Flooring Systems**

```yaml
Flooring_By_Area:
  Lobby_&_Circulation:
    Material: Porcelain tile
    Size: 600mm × 1200mm (24" × 48")
    Color: Warm gray with subtle veining
    Finish: Matte, slip-resistant
    Installation: Thin-set mortar, 3mm grout joints

  Cafe_&_Social_Areas:
    Material: Luxury vinyl plank (LVP)
    Size: 180mm × 1220mm (7" × 48")
    Appearance: Light oak wood-look
    Wear_Layer: 0.5mm (20 mil) commercial grade
    Installation: Floating floor with underlayment

  Locker_Rooms:
    Dry_Areas:
      Material: Ceramic tile
      Size: 300mm × 300mm (12" × 12")
      Slip_Rating: DCOF ≥ 0.42 (dry)

    Wet_Areas_(Showers):
      Material: Porcelain mosaic tile
      Size: 50mm × 50mm (2" × 2")
      Slip_Rating: DCOF ≥ 0.60 (wet)

  Offices:
    Material: Carpet tile
    Size: 500mm × 500mm (20" × 20")
    Fiber: Nylon 6,6
    Pile_Weight: 850 g/m² (25 oz/yd²)
    Backing: Cushion-backed for comfort
```

**Wall Finishes**

```yaml
Wall_Systems:
  Standard_Walls:
    Construction: 16 ga steel studs @ 400mm o.c.
    Gypsum_Board: 16mm (5/8") Type X fire-rated
    Finish: Level 4 smooth finish
    Paint: Low-VOC latex, eggshell sheen
    Color_Palette: Whites, warm grays, accent blues

  Accent_Walls:
    Material_Options:
      Wood_Slat_Panels:
        Material: Walnut veneer on MDF
        Slat_Width: 80mm (3.1")
        Spacing: 20mm (0.8") reveal
        Finish: Clear matte lacquer

      Fabric_Panels:
        Material: Tackable fabric on acoustic core
        Thickness: 25mm (1")
        NRC_Rating: 0.85

  Wet_Areas:
    Material: Ceramic tile
    Size: 200mm × 600mm (8" × 24") subway tile
    Color: White with gray grout
    Height: Full-height in showers, wainscot in locker areas
```

**Ceiling Systems**

```yaml
Ceiling_Finishes:
  Suspended_Acoustic_Ceiling:
    Grid: 15/16" exposed tee, white finish
    Tile_Size: 600mm × 600mm (24" × 24")
    Tile_Type: Mineral fiber, high NRC
    NRC: 0.70 (70% sound absorption)
    CAC: 35 (ceiling attenuation class)

  Gypsum_Board_Ceiling:
    Application: Premium areas (lobby, lounge)
    Construction: 13mm (1/2") lightweight gypsum board
    Finish: Level 5 smooth, painted
    Color: Bright white

  Exposed_Structure_Ceiling:
    Application: Industrial-chic areas (event space option)
    Treatment: Painted structure and decking
    Color: Matte black or charcoal gray
    Acoustic_Treatment: Suspended acoustic clouds
```

#### D.3.2 Furniture & Fixtures

**Lounge & Social Furniture**

```yaml
Furniture_Specifications:
  Lounge_Seating:
    Sofa:
      Dimensions: 2.1m × 0.9m × 0.8m high (7' × 3' × 2.6')
      Frame: Hardwood with reinforced corners
      Upholstery: Commercial-grade fabric, stain-resistant
      Cushions: High-density foam, removable covers
      Color: Navy blue, charcoal, or tan options

    Armchair:
      Dimensions: 0.8m × 0.85m × 0.9m high (2.6' × 2.8' × 3')
      Style: Mid-century modern
      Frame: Solid wood legs, upholstered body
      Upholstery: Leather or performance fabric

  Dining_&_Cafe_Furniture:
    Tables:
      Two_Top: 0.7m × 0.7m (28" × 28"), 0.75m high (30")
      Four_Top: 0.9m × 0.9m (36" × 36"), 0.75m high
      Top_Material: High-pressure laminate or solid surface
      Base: Powder-coated steel, single pedestal

    Chairs:
      Type: Stackable side chair
      Dimensions: 0.45m W × 0.5m D × 0.8m H (18" × 20" × 31")
      Material: Polypropylene shell, steel legs
      Weight_Capacity: 180kg (400 lbs)
      Stacking_Height: 10 chairs maximum
```

**Casework & Millwork**

```yaml
Built_In_Cabinetry:
  Reception_Desk:
    Construction: Plywood core with wood veneer
    Veneer_Species: White oak
    Finish: Clear matte lacquer
    Countertop: 38mm (1.5") solid surface
    Hardware: Concealed European hinges, soft-close

  Pro_Shop_Fixtures:
    Slatwall_Panels:
      Material: MDF core with melamine finish
      Groove_Spacing: 100mm (4") on center
      Panel_Thickness: 18mm (3/4")
      Color: Maple finish

    Shelving:
      Material: Powder-coated steel standards and brackets
      Shelf_Material: 25mm (1") melamine-coated particle board
      Adjustability: 25mm (1") increments
      Load_Capacity: 50 kg/m (35 lbs/ft)
```

### D.4 MEP Systems (Mechanical, Electrical, Plumbing)

#### D.4.1 Plumbing Systems

**Domestic Water Distribution**

```yaml
Water_System_Design:
  Service_Entry:
    Service_Size: 100mm (4") diameter
    Meter: Compound meter with backflow preventer
    Pressure: 380-550 kPa (55-80 psi)

  Distribution_Piping:
    Cold_Water_Material: Type L copper
    Hot_Water_Material: Type L copper with insulation
    Insulation: 13mm (1/2") fiberglass pipe insulation
    Pipe_Sizing: Per fixture unit method (IPC)

  Hot_Water_System:
    Water_Heater_Type: High-efficiency condensing
    Capacity: 380 liters (100 gallons)
    Input: 75 kW (256,000 BTU/hr)
    Efficiency: 0.95 thermal efficiency
    Recovery: 450 liters/hour (119 gph) @ 45°C rise
    Recirculation: Pump with timer control

  Fixture_Counts:
    Water_Closets: 28 total
    Urinals: 12 (men's facilities)
    Lavatories: 38
    Showers: 24
    Service_Sinks: 4
    Kitchen_Sinks: 3
    Drinking_Fountains: 6
```

**Drainage & Vent Systems**

```yaml
Sanitary_Drainage:
  Piping_Material: PVC Schedule 40

  Pipe_Sizing:
    Building_Drain: 150mm (6")
    Branch_Drains: 75mm - 100mm (3" - 4")
    Fixture_Drains: 40mm - 50mm (1.5" - 2")

  Slope_Requirements:
    150mm_Pipe: 1/4" per foot (2%)
    100mm_Pipe: 1/4" per foot (2%)
    75mm_Pipe: 1/4" per foot (2%)

  Vent_System:
    Type: Conventional vent system
    Vent_Stack: 100mm (4") diameter
    Branch_Vents: 50mm (2")
    Vent_Termination: Through roof, 300mm above

  Cleanouts:
    Frequency: Every change of direction >45°
    Size: Same as pipe served
    Type: Flush floor or wall-mounted access
```

**Specialty Plumbing**

```yaml
Specialty_Systems:
  Floor_Drains:
    Quantity: 32 drains
    Size: 75mm (3") diameter
    Type: Cast iron with removable strainer
    Trap_Primer: Automatic trap primers on all drains
    Locations: Shower rooms, mechanical rooms, janitor closets

  Grease_Interceptor:
    Serving: Cafe kitchen
    Capacity: 95 liters (25 gallons)
    Type: Hydromechanical grease interceptor
    Location: Below kitchen floor slab
    Access: Floor hatch for maintenance

  Backflow_Prevention:
    Type_1: Reduced pressure zone (RPZ) assembly
    Locations: Building service entry, irrigation
    Type_2: Dual check valve
    Locations: Individual fixtures (hose bibs)
```

#### D.4.2 Electrical Systems

**Power Distribution**

```yaml
Electrical_Service:
  Service_Entrance:
    Voltage: 277/480V, 3-phase, 4-wire
    Service_Size: 1600 amperes
    Service_Equipment: Main switchboard with main breaker
    Metering: Electronic watt-hour meter, demand register

  Panelboard_Distribution:
    Main_Distribution_Panels: 4 panels @ 400A each
    Lighting_Panels: 8 panels @ 225A each
    Receptacle_Panels: 6 panels @ 225A each
    HVAC_Panels: 2 panels @ 400A each

  Branch_Circuit_Types:
    Lighting: 277V, 1-phase, 20A circuits
    Receptacles: 120V, 1-phase, 20A circuits
    Equipment: 208V, 3-phase, variable amperage

  Emergency_Power:
    Generator: 150 kW natural gas, automatic transfer
    Critical_Loads: Emergency lighting, fire alarm, exit signs
    Transfer_Time: <10 seconds
    Fuel_Supply: Natural gas utility connection
```

**Receptacles & Devices**

```yaml
Receptacle_Specifications:
  General_Purpose:
    Type: Duplex receptacle, 20A, 125V
    Spacing: Max 3.6m (12') along walls
    Height: 400mm (16") above finished floor
    Color: White in public areas, gray in back-of-house

  GFCI_Protected:
    Locations: Within 1.8m (6') of water sources
    Type: 20A GFCI receptacle or GFCI circuit breaker

  USB_Charging_Stations:
    Locations: Lounge, cafe, waiting areas
    Quantity: 24 units
    Output: Dual USB-A ports, 3.1A shared

  Floor_Outlets:
    Locations: Event space, open office areas
    Type: Flush floor box with hinged cover
    Services: Power + data

  Dedicated_Circuits:
    Cafe_Equipment: Refrigerators, coffee makers
    Office_Equipment: Copiers, computers
    Audio_Visual: Projectors, displays, sound systems
```

**Lighting Control Systems**

```yaml
Lighting_Controls:
  Control_Strategy: Networked digital lighting control system

  Control_Devices:
    Occupancy_Sensors:
      Type: Dual-technology (PIR + ultrasonic)
      Locations: Offices, restrooms, storage rooms
      Time_Delay: 10 minutes after vacancy

    Daylight_Sensors:
      Type: Closed-loop photocell
      Locations: Perimeter zones with windows
      Setpoint: 300 lux (30 fc) target illuminance
      Dimming_Range: 20-100%

    Wall_Switches:
      Type: Digital dimming switch
      Functions: On/off, dimming, scene recall
      Locations: All controlled spaces

  Scene_Control:
    Preset_Scenes: Pre-event, event, intermission, cleaning
    Scene_Recall: Wall keypad or mobile app
    Programming: BAS integration for scheduling
```

#### D.4.3 HVAC Systems (Clubhouse-Specific)

**Clubhouse Climate Control**

```yaml
HVAC_Design_Parameters:
  Design_Conditions:
    Summer_Outdoor: 33°C DB / 24°C WB (91°F / 75°F)
    Winter_Outdoor: -18°C (-0.4°F)
    Indoor_Temperature: 22°C ± 1°C (72°F ± 2°F)
    Indoor_Humidity: 45% ± 5% RH

  System_Type:
    Lobby_&_Social: Variable air volume (VAV) with reheat
    Offices: VAV with zone temperature control
    Locker_Rooms: Dedicated exhaust with makeup air
    Kitchen: Kitchen hood with dedicated makeup air

  Air_Handling_Units:
    AHU_1_Clubhouse:
      Capacity: 10,000 CFM
      Serves: Lobby, pro shop, cafe, lounge
      Cooling_Coil: 30 ton DX cooling
      Heating_Coil: 600 MBH hot water
      Supply_Fan: 15 HP VFD

    AHU_2_Offices:
      Capacity: 4,000 CFM
      Serves: Administrative offices
      Cooling_Coil: 12 ton DX cooling
      Heating_Coil: 250 MBH hot water
      Supply_Fan: 7.5 HP VFD
```

**Locker Room Ventilation**

```yaml
Locker_Room_HVAC:
  Exhaust_System:
    Type: Continuous exhaust to prevent odor migration
    Exhaust_Rate: 0.5 CFM per square foot minimum
    Exhaust_Fan: 2,500 CFM per locker room
    Fan_Type: Inline centrifugal, sound-attenuated
    Controls: VFD with occupancy override (boost mode)

  Makeup_Air:
    Source: Dedicated outdoor air system (DOAS)
    Capacity: 2,000 CFM per locker room
    Conditioning: Heating/cooling to neutral temperature
    Delivery: Low-velocity displacement diffusers

  Shower_Area_Exhaust:
    Dedicated_Exhaust: 1,200 CFM per shower room
    Moisture_Control: Humidity sensor control
    Exhaust_Grilles: Ceiling-mounted in shower areas

  Temperature_Control:
    Setpoint: 24°C (75°F) in changing areas
    Setback: 18°C (65°F) unoccupied
    Shower_Area: 26°C (79°F) to prevent discomfort
```

**Kitchen Ventilation**

```yaml
Commercial_Kitchen_HVAC:
  Exhaust_Hood:
    Type: Type I grease hood
    Dimensions: 3.0m × 1.2m (10' × 4')
    Hood_Style: Wall-mounted canopy
    Exhaust_Rate: 400 CFM per linear foot
    Total_Exhaust: 1,200 CFM

  Makeup_Air_Unit:
    Capacity: 1,200 CFM (100% of exhaust)
    Heating: Gas-fired, 200 MBH input
    Cooling: None (tempered outdoor air only)
    Delivery: Short-circuit hood per ASHRAE 154

  Fire_Suppression:
    System_Type: Wet chemical fire suppression
    Coverage: All cooking equipment under hood
    Activation: Fusible links @ 79°C (175°F)
    Manual_Pull_Station: Adjacent to exit door
```

### D.5 Technology & Communications

#### D.5.1 Audiovisual Systems

**Public Address & Background Music**

```yaml
PA_System:
  Audio_Distribution:
    Type: Networked distributed audio system
    Coverage: All public areas
    Zones: 12 independent zones

  Speakers:
    Type_Ceiling: 8" coaxial ceiling speakers
    Quantity_Ceiling: 120 speakers
    Type_Pendant: Pendant speakers in high-ceiling areas
    Quantity_Pendant: 24 speakers
    Coverage_Pattern: 90° dispersion

  Sources:
    Background_Music: Streaming service integration
    Paging_Microphone: Desktop paging station at reception
    Emergency_Announcements: Integration with fire alarm

  Amplification:
    Amplifier_Type: Network audio amplifier
    Total_Power: 3,000 watts (distributed across zones)
    Redundancy: N+1 amplifier configuration
```

**Digital Signage**

```yaml
Digital_Display_Network:
  Display_Types:
    Lobby_Display: 85" 4K interactive touchscreen
    Hallway_Displays: 55" 4K portrait-oriented (4 units)
    Menu_Boards_(Cafe): 43" 4K landscape (2 units)
    Event_Space: 75" 4K movable display

  Content_Management:
    System: Cloud-based digital signage CMS
    Content_Types: Schedules, events, promotions, wayfinding
    Update_Frequency: Real-time schedule sync
    Remote_Management: Web-based administration

  Network_Infrastructure:
    Connection: Gigabit Ethernet per display
    Power: PoE+ where feasible, local power otherwise
    Mounting: VESA wall mounts or floor stands
```

#### D.5.2 Data & Communications

**Structured Cabling System**

```yaml
Cabling_Infrastructure:
  Backbone_Cabling:
    Type: 12-strand single-mode fiber optic
    Topology: Star from main telecom room
    Termination: LC connectors, rack-mounted panels

  Horizontal_Cabling:
    Type: Category 6A UTP
    Maximum_Length: 90m (295') permanent link
    Termination: RJ45 jacks, 8P8C
    Cable_Management: J-hooks and cable trays

  Telecommunications_Rooms:
    Main_TR_Location: Ground floor, central location
    IDF_Locations: Mezzanine, upper level
    Room_Size: 3m × 4m (10' × 13') minimum
    Environmental: Cooling to 21°C (70°F), humidity control
    Power: Dedicated 20A circuits, UPS-backed

  Outlet_Locations:
    Offices: 2 outlets per workstation
    Conference_Rooms: 6 outlets distributed
    Common_Areas: 1 outlet per 20m² (215 ft²)
    AV_Locations: Dedicated homerun cables
```

**Wireless Network**

```yaml
WiFi_System:
  Access_Point_Deployment:
    Technology: WiFi 6 (802.11ax)
    Frequency_Bands: Dual-band 2.4 GHz and 5 GHz
    Coverage_Design: 50-75% cell overlap for roaming
    AP_Count: 32 access points

  AP_Locations:
    Ceiling_Mounted: General areas
    Wall_Mounted: Corridors and outdoor terrace
    Density: High-density in lounge, cafe, event space

  Network_Controller:
    Type: Cloud-managed network controller
    Management: Web-based dashboard
    Features: Guest portal, bandwidth management, analytics

  Guest_Network:
    SSID: "LawnTech_Guest"
    Security: WPA3-Personal with captive portal
    Isolation: VLAN separation from corporate network
    Bandwidth: Rate-limited per device
```

#### D.5.3 Security Systems

**Access Control**

```yaml
Access_Control_System:
  Technology: RFID card-based access control

  Card_Reader_Locations:
    Main_Entrance: Card + PIN reader
    Locker_Room_Entries: Card readers (4 locations)
    Administrative_Suite: Card reader
    Equipment_Storage: Card reader
    Back_of_House: Card readers (3 locations)

  Credential_Types:
    Member_Cards: Proximity cards (125 kHz)
    Staff_Cards: Smart cards with photo ID
    Temporary_Passes: Time-limited access

  Integration:
    Building_Management: Unlock doors on fire alarm
    Intrusion_Alarm: Arm/disarm based on access events
    Scheduling: Automatic unlock/lock schedules

  Electronic_Locks:
    Type: Mortise lockset with electric strike
    Fail_Mode: Fail-safe (unlock on power loss) for egress
    Power_Supply: PoE+ or local 12VDC transformer
```

**Video Surveillance**

```yaml
CCTV_System:
  Camera_Deployment:
    Total_Cameras: 48 cameras

    Camera_Types:
      Dome_Cameras: Indoor, vandal-resistant (32 cameras)
      Bullet_Cameras: Outdoor, weather-resistant (8 cameras)
      PTZ_Cameras: Parking and perimeter (4 cameras)
      Fisheye_Cameras: Entrance wide-coverage (4 cameras)

  Camera_Specifications:
    Resolution: 5 megapixel (2560 × 1920)
    Frame_Rate: 30 fps
    Low_Light: 0.01 lux color, 0.001 lux B&W
    Video_Compression: H.265 (HEVC)
    Storage: Motion-based recording, 30-day retention

  Recording_System:
    NVR_Type: Network video recorder (enterprise-grade)
    Storage_Capacity: 120 TB RAID 6 array
    Redundancy: Hot-swappable drives
    Remote_Access: Web browser and mobile app

  Monitoring:
    Display: 4 × 55" video wall in security office
    Live_View: 16-camera mosaic per screen
    Alerts: Motion detection, tampering, video loss
```

**Intrusion Detection**

```yaml
Alarm_System:
  System_Type: Networked intrusion detection

  Detection_Devices:
    Door_Contacts: All perimeter doors and windows (68 points)
    Motion_Detectors: Interior spaces when unoccupied (24 units)
    Glass_Break_Detectors: Large glass windows (12 units)

  Control_Panels:
    Main_Panel_Location: Security office
    Keypad_Locations: Main entrance, staff areas (4 keypads)
    Arming_Modes: Away, stay, instant, perimeter

  Monitoring:
    Central_Station: 24/7 professional monitoring service
    Communication: Dual-path (IP + cellular)
    Response: Police dispatch on verified alarm

  Integration:
    Access_Control: Automatic arming based on access
    Video_Surveillance: Camera recording on alarm events
    Building_Automation: Lighting activation on intrusion
```

---

## Integration Specifications

### I.1 Building Automation System (BAS)

**System Architecture**

```yaml
BAS_Overview:
  Platform: Open-protocol building automation system
  Protocol: BACnet/IP for all devices

  Central_Server:
    Type: Enterprise-grade BAS server
    Location: Main server room
    Redundancy: Hot standby failover server
    User_Interface: Web-based graphical interface

  Field_Controllers:
    Type: Freely programmable BACnet controllers
    Quantity: 16 controllers distributed by system
    Communication: Ethernet backbone
    Backup_Power: UPS for critical controllers

  Operator_Workstations:
    Quantity: 4 workstations
    Locations: Facilities office, security office, reception
    Features: Real-time monitoring, alarm management, trending
```

**Integrated Systems**

```yaml
Systems_Under_BAS_Control:
  HVAC:
    - Air handling units (start/stop, temperature control)
    - VAV boxes (damper position, reheat control)
    - Exhaust fans (scheduling, override control)
    - Chilled water system (chiller staging, pump control)
    - Hot water system (boiler staging, pump control)

  Lighting:
    - Occupancy-based scheduling
    - Daylight harvesting control
    - Scene recall for events
    - Energy monitoring per zone

  Security:
    - Access control integration (lock status, events)
    - CCTV integration (camera presets on alarms)
    - Intrusion alarm status monitoring

  Life_Safety:
    - Fire alarm status monitoring
    - Smoke control system activation
    - Emergency power status
    - Elevator recall on fire alarm

  Utilities:
    - Electric demand monitoring
    - Water consumption tracking
    - Gas usage monitoring
    - Solar PV production (if installed)
```

**Autonomous Features**

```yaml
Autonomous_Operations:
  Demand_Response:
    Function: Load shedding during peak demand events
    Controlled_Loads: HVAC setback, lighting dimming
    Trigger: Utility demand response signal
    Override: Manual override by facilities staff

  Optimal_Start_Stop:
    Function: Calculate HVAC start time for occupancy
    Algorithm: Machine learning based on weather and thermal mass
    Energy_Savings: Estimated 15-20% HVAC energy reduction

  Fault_Detection_Diagnostics:
    Monitored_Parameters: Equipment runtime, energy use, setpoint deviation
    Alerts: Email/SMS on abnormal conditions
    Dashboard: Graphical fault summary

  Predictive_Maintenance:
    Data_Collection: Equipment runtime hours, cycle counts
    Prediction: Maintenance needs based on manufacturer schedules
    Work_Orders: Automated work order generation
```

### I.2 Unified Member Experience

**Member Mobile App Integration**

```yaml
Mobile_App_Features:
  Court_Booking:
    Function: Reserve courts via smartphone
    Real_Time_Availability: Live court status
    Recurring_Reservations: Weekly standing reservations
    Guest_Bookings: Add guests to reservations

  Access_Control:
    Function: Mobile credential for building entry
    Technology: Bluetooth or NFC phone-as-key
    Zones: Main entrance, locker rooms

  Cafe_Ordering:
    Function: Pre-order food and beverages
    Payment: Stored credit card or member billing
    Pickup_Notification: Alert when order ready

  Facility_Notifications:
    Push_Alerts: Court availability, event reminders
    Announcements: Facility news and updates
    Emergency_Alerts: Weather closures, emergencies
```

**Digital Locker Assignment**

```yaml
Smart_Locker_System:
  Assignment_Method: App-based locker selection

  Locker_Features:
    Electronic_Lock: RFID or Bluetooth lock
    Unlock_Methods: Mobile app, member card, PIN
    Occupancy_Status: Real-time availability map

  Management:
    Daily_Lockers: Auto-release 2 hours after facility close
    Rental_Lockers: Monthly billing, secure long-term storage
    Maintenance: Unlock override for cleaning/maintenance

  Integration:
    Membership_Database: Sync with member accounts
    Billing_System: Charge rental fees to member accounts
    Access_Control: Coordinate with locker room entry
```

### I.3 Energy Management

**Energy Monitoring & Reporting**

```yaml
Energy_Metering:
  Metering_Points:
    Main_Building_Meter: Whole-building electric
    HVAC_Submeter: HVAC equipment loads
    Lighting_Submeter: All lighting circuits
    Cafe_Equipment: Kitchen equipment loads
    Solar_PV_(Future): Rooftop solar production

  Data_Collection:
    Interval: 15-minute demand intervals
    Storage: Cloud-based energy management platform
    Reporting: Monthly energy reports, benchmarking

  Dashboards:
    Real_Time_Display: Public display in lobby (current usage)
    Staff_Dashboard: Detailed analytics for operations team
    Member_Portal: Energy use per member (optional)
```

**Sustainability Features**

```yaml
Green_Building_Strategies:
  Lighting:
    Technology: 100% LED lighting
    Controls: Occupancy and daylight harvesting
    Savings: 60-70% vs. traditional lighting

  HVAC:
    Efficiency: High-efficiency equipment (EER >12)
    Economizer: Free cooling with outdoor air
    Demand_Control_Ventilation: CO2-based ventilation
    Heat_Recovery: Enthalpy wheel on air handlers

  Water:
    Fixtures: Low-flow faucets (1.5 gpm), showerheads (2.0 gpm)
    Toilets: Dual-flush WC (0.8/1.6 gpf)
    Urinals: Waterless urinals
    Savings: 40-50% water use reduction

  Renewable_Energy:
    Rooftop_Solar: 250 kW PV array (future phase)
    Battery_Storage: 500 kWh energy storage (future phase)
    Net_Zero_Goal: Target net-zero energy by 2030
```

---

## Digital Twin Requirements

### DT.1 3D Model Specifications

**Model Detail Levels (LOD)**

```yaml
LOD_Requirements:
  LOD_300_Schematic:
    Purpose: Overall spatial layout and relationships
    Detail: Generic objects with approximate size/shape
    Use: Early design visualization

  LOD_350_Design:
    Purpose: Detailed design coordination
    Detail: Specific assemblies, accurate dimensions
    Use: Design review, client presentations

  LOD_400_Fabrication:
    Purpose: Construction documentation
    Detail: Complete fabrication details, connections
    Use: Shop drawings, contractor coordination

  LOD_500_As_Built:
    Purpose: Facility management
    Detail: Verified field dimensions, installed equipment
    Use: Operations, maintenance, renovations
```

**Model Content**

```yaml
3D_Model_Components:
  Architectural:
    - Walls, floors, ceilings with accurate materials
    - Doors and windows with hardware
    - Stairs, ramps, railings
    - Casework and millwork
    - Furniture (generic or specific models)

  Structural:
    - Foundations and footings
    - Columns and beams
    - Floor and roof framing
    - Connections and reinforcement

  Mechanical:
    - HVAC equipment (AHUs, fans, coils)
    - Ductwork and diffusers
    - Piping systems (supply, return, drain)
    - Plumbing fixtures

  Electrical:
    - Panel boards and transformers
    - Lighting fixtures
    - Receptacles and switches
    - Cable trays and conduits

  Technology:
    - Security cameras
    - Access control readers
    - Network access points
    - AV equipment
```

### DT.2 Data Integration

**BIM to BAS Data Exchange**

```yaml
Data_Synchronization:
  Equipment_Tagging:
    Standard: COBie (Construction Operations Building Information Exchange)
    Parameters: Equipment type, manufacturer, model, serial number
    IDs: Unique equipment IDs matching BAS point names

  Spatial_Data:
    Room_Names: Synchronized between BIM and BAS
    Room_Numbers: Consistent numbering system
    Zone_Definitions: Spatial zones match control zones

  Maintenance_Data:
    Warranty_Info: Equipment warranty dates
    Manuals: Links to O&M manuals from BIM
    Spare_Parts: Parts lists and recommended stock

  Asset_Management:
    Lifecycle_Tracking: Installation date, expected life
    Replacement_Planning: Capital planning integration
    Work_Orders: Integration with CMMS (Computerized Maintenance Management System)
```

**Real-Time Data Overlay**

```yaml
Live_Data_Visualization:
  3D_Model_Overlay:
    Temperature: Color-coded room temperatures
    Occupancy: Real-time occupancy indicators
    Equipment_Status: Green/yellow/red status indicators
    Energy_Use: Heat map of energy consumption

  Dashboard_Views:
    Floor_Plan_View: 2D plan with data overlay
    3D_Cutaway: Section views showing concealed systems
    Equipment_View: Zoom to specific equipment with data panel

  User_Interaction:
    Click_Equipment: Display real-time parameters
    Historical_Trends: Graph data over time
    Alarm_Navigation: Jump to equipment in alarm
```

### DT.3 Simulation Capabilities

**Occupancy Simulation**

```yaml
Occupancy_Modeling:
  Inputs:
    - Court reservation schedule
    - Event calendar
    - Historical occupancy patterns
    - Time of day and day of week

  Outputs:
    - Predicted peak occupancy times
    - HVAC load forecasting
    - Staffing level recommendations
    - Parking demand estimation

  Validation:
    - Compare predictions to actual occupancy
    - Refine algorithms based on variance
    - Machine learning for improved accuracy
```

**Energy Simulation**

```yaml
Energy_Modeling:
  Baseline_Model:
    Software: EnergyPlus or equivalent
    Inputs: Envelope, HVAC, lighting, occupancy, weather
    Output: Annual energy use by end use

  Optimization_Scenarios:
    - LED lighting upgrades
    - HVAC setpoint adjustments
    - Solar PV sizing
    - Battery storage strategies

  Operational_Adjustment:
    - Test schedule changes virtually
    - Evaluate demand response strategies
    - Predict energy cost impacts
```

---

## Technical Appendix

### A.1 Code Compliance Summary

**Applicable Codes & Standards**

```yaml
Building_Codes:
  International_Building_Code: 2021 IBC
  International_Mechanical_Code: 2021 IMC
  International_Plumbing_Code: 2021 IPC
  National_Electrical_Code: 2020 NEC (NFPA 70)
  International_Energy_Conservation_Code: 2021 IECC

  Local_Amendments: City of Naperville amendments apply

Accessibility:
  Federal: 2010 ADA Standards for Accessible Design
  State: Illinois Accessibility Code (71 IL Adm. Code 400)

Life_Safety:
  Fire_Protection: NFPA 13 (Sprinkler), NFPA 72 (Fire Alarm)
  Egress: IBC Chapter 10, NFPA 101 Life Safety Code

Industry_Standards:
  ASHRAE: 90.1 (Energy), 62.1 (Ventilation), 55 (Thermal Comfort)
  LEED: Targeting LEED Gold certification
```

### A.2 Material Sustainability

**Environmental Product Declarations (EPD)**

```yaml
Material_Selection_Criteria:
  Low_VOC:
    - Paints and coatings: <50 g/L VOC
    - Adhesives and sealants: <70 g/L VOC
    - Flooring: FloorScore certified
    - Furniture: GREENGUARD Gold certified

  Recycled_Content:
    - Structural steel: 90% recycled content
    - Gypsum board: 20% recycled content
    - Carpet tile: 50% recycled content
    - Acoustic ceiling tile: 70% recycled content

  Regional_Materials:
    - Sourced within 500 miles: >30% by value
    - Manufactured regionally: Illinois and surrounding states

  Certified_Wood:
    - FSC-certified wood: 100% of wood products
    - Rapidly renewable: Bamboo, cork where applicable
```

### A.3 Dimensional Reference

**Key Dimensions Summary**

```yaml
Critical_Dimensions:
  Seating_Section_C:
    Ground_Floor_Seating_Area: 840 m² (9,040 ft²)
    Mezzanine_Seating_Area: 620 m² (6,670 ft²)
    Upper_Level_Seating_Area: 380 m² (4,090 ft²)
    Total_Seating_Capacity: 1,388 seats

  Clubhouse_Section_D:
    Lobby_&_Reception: 185 m² (1,990 ft²)
    Pro_Shop: 120 m² (1,290 ft²)
    Cafe: 240 m² (2,580 ft²)
    Locker_Rooms: 360 m² (3,880 ft²) - combined
    Members_Lounge: 280 m² (3,010 ft²)
    Event_Space: 220 m² (2,370 ft²)
    Administrative: 180 m² (1,940 ft²)
    Total_Clubhouse_Area: 1,585 m² (17,060 ft²)

  Overall_Sections_C_&_D:
    Combined_Total_Area: 3,425 m² (36,870 ft²)
```

### A.4 Equipment Schedules

**Major Equipment List**

```yaml
HVAC_Equipment:
  - AHU-1: 10,000 CFM rooftop unit
  - AHU-2: 4,000 CFM rooftop unit
  - Exhaust_Fans: 4 fans @ 2,500 CFM each
  - Chiller: 100-ton air-cooled chiller
  - Boiler: 2 × 600 MBH condensing boilers
  - Kitchen_MAU: 1,200 CFM makeup air unit

Electrical_Equipment:
  - Main_Switchboard: 1600A, 277/480V
  - Emergency_Generator: 150 kW natural gas
  - UPS_System: 20 kVA for critical loads
  - Panelboards: 20 panelboards distributed

Plumbing_Equipment:
  - Water_Heaters: 2 × 380-liter condensing
  - Booster_Pump: Domestic water pressure booster
  - Grease_Interceptor: 95-liter capacity
  - Sump_Pumps: 2 pumps in basement areas

Technology_Equipment:
  - Network_Switches: 8 × 48-port PoE+ switches
  - Wireless_APs: 32 access points
  - Security_NVR: 120TB storage capacity
  - Access_Control_Panel: 4-door controller × 12
```

---

## Conclusion

This specification document provides comprehensive 3D design details for Building Sections C (Spectator Seating) and D (Clubhouse & Social) of the LawnTech Dynamics Autonomous Indoor Grass Court Facility.

**Key Highlights:**

- **Section C**: 1,388-seat capacity across 3 levels with ADA-compliant accessibility
- **Section D**: 1,585 m² clubhouse with premium amenities and autonomous systems
- **Integration**: Unified building automation, member experience, and digital twin capabilities
- **Sustainability**: LEED Gold target with energy-efficient systems and renewable energy readiness

**Next Steps:**
1. 3D model development in Blender and Unity per digital twin architecture
2. Cost estimation and value engineering
3. Stakeholder review and approval
4. Construction documentation phase

---

**Document Control:**
- **Revision**: 1.0
- **Date**: 2025-11-22
- **Author**: Technical Writer - ACE Project Team
- **Approved By**: [Pending]
- **Next Review**: Upon design development completion
