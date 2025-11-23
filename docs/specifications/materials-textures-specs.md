# Material and Texture Specifications

**Project**: ACE Tennis Academy 3D Visualization
**Version**: 1.0
**Last Updated**: 2025-11-22
**Purpose**: Comprehensive material library and texture requirements for all 3D assets

---

## Table of Contents

1. [Material Categories Overview](#material-categories-overview)
2. [PBR Workflow Standards](#pbr-workflow-standards)
3. [Court Surface Materials](#court-surface-materials)
4. [Building Exterior Materials](#building-exterior-materials)
5. [Interior Materials](#interior-materials)
6. [Furniture and Seating](#furniture-and-seating)
7. [Signage and Graphics](#signage-and-graphics)
8. [Vegetation and Landscaping](#vegetation-and-landscaping)
9. [Lighting Materials](#lighting-materials)
10. [Texture Resolution Standards](#texture-resolution-standards)
11. [Optimization Guidelines](#optimization-guidelines)
12. [Material Naming Conventions](#material-naming-conventions)

---

## Material Categories Overview

### Primary Material Groups

| Category | Material Count | Performance Priority | Quality Level |
|----------|---------------|---------------------|---------------|
| Court Surfaces | 6 types | High | Premium |
| Building Exterior | 12 materials | Medium | High |
| Interior Spaces | 20 materials | Medium | High |
| Furniture/Seating | 8 materials | Low | Medium |
| Signage/Graphics | 6 materials | Low | High |
| Vegetation | 10 materials | Medium | Medium |
| Lighting | 4 materials | High | Premium |

### Material Budget

- **Total Materials**: ~66 unique materials
- **Texture Memory Target**: <150MB compressed
- **Draw Calls Target**: <100 per scene
- **Instance-able Materials**: 40+ materials

---

## PBR Workflow Standards

### PBR Map Requirements

All materials follow Physically Based Rendering workflow:

```
Standard PBR Maps:
├── BaseColor (Albedo/Diffuse)
├── Normal (DirectX format, Y+)
├── Metallic (Grayscale)
├── Roughness (Grayscale)
├── AmbientOcclusion (Optional)
└── Height/Displacement (Optional)
```

### PBR Value Ranges

| Property | Range | Default | Notes |
|----------|-------|---------|-------|
| Metallic | 0.0 - 1.0 | 0.0 | 0 = dielectric, 1 = metal |
| Roughness | 0.0 - 1.0 | 0.5 | 0 = mirror, 1 = matte |
| Base Color | sRGB | N/A | No values >240 (non-metals) |
| Normal Strength | 0.0 - 2.0 | 1.0 | Adjust for visual impact |
| AO Intensity | 0.0 - 1.0 | 0.8 | Subtle cavity darkening |

### Color Space Standards

- **Base Color**: sRGB color space
- **Data Maps** (Normal, Metallic, Roughness, AO): Linear color space
- **Emission**: sRGB color space
- **Height**: Linear color space

---

## Court Surface Materials

### 1. Clay Court Material

**Material ID**: `MAT_COURT_CLAY_01`

**Visual Properties**:
- Base Color: RGB(185, 105, 75) - Terra cotta orange
- Surface: Matte with fine granular texture
- Weathering: Subtle wear patterns, court line fading

**PBR Properties**:
```yaml
baseColor: #B9694B
metallic: 0.0
roughness: 0.85
normalStrength: 0.6
aoIntensity: 0.7
```

**Texture Requirements**:
- **BaseColor**: 2048x2048 (court area tiling)
- **Normal**: 2048x2048 (granular clay texture)
- **Roughness**: 1024x1024 (variation map)
- **AO**: 1024x1024 (court line occlusion)

**Special Features**:
- Court lines: White painted lines with slight wear
- Edge dirt accumulation: Darker values at perimeter
- Moisture variation: Subtle color shifts for realism
- UV tiling: 4x4 repeat for 23.77m court

**Shader Notes**:
```glsl
// Clay dust particle effect on ball contact
uniform float dustIntensity;
uniform vec3 impactPosition;
// Moisture darkening in shaded areas
uniform float moistureLevel;
```

---

### 2. Hard Court Material

**Material ID**: `MAT_COURT_HARD_01`

**Visual Properties**:
- Base Color: RGB(60, 120, 180) - Deep blue
- Surface: Semi-gloss acrylic coating
- Reflection: Subtle reflections from smooth surface

**PBR Properties**:
```yaml
baseColor: #3C78B4
metallic: 0.0
roughness: 0.4
normalStrength: 0.3
aoIntensity: 0.8
clearcoat: 0.2
clearcoatRoughness: 0.6
```

**Texture Requirements**:
- **BaseColor**: 2048x2048 (solid color with subtle variation)
- **Normal**: 2048x2048 (micro-surface texture)
- **Roughness**: 2048x2048 (wear patterns)
- **Clearcoat**: 1024x1024 (acrylic layer)

**Special Features**:
- Court lines: Crisp white tape lines
- Surface cracks: Procedural crack generation
- Wear patterns: High-traffic areas (baseline, service boxes)
- Sun bleaching: UV-faded zones

---

### 3. Grass Court Material

**Material ID**: `MAT_COURT_GRASS_01`

**Visual Properties**:
- Base Color: RGB(85, 140, 70) - Fresh grass green
- Surface: Directional grass blade texture
- Animation: Subtle wind sway

**PBR Properties**:
```yaml
baseColor: #558C46
metallic: 0.0
roughness: 0.7
normalStrength: 1.2
subsurfaceScattering: 0.3
translucency: 0.4
```

**Texture Requirements**:
- **BaseColor**: 2048x2048 (grass blade atlas)
- **Normal**: 2048x2048 (blade direction)
- **Roughness**: 1024x1024
- **Height**: 2048x2048 (displacement)
- **SSS Map**: 1024x1024 (translucency)

**Special Features**:
- Blade geometry: Alpha-tested grass cards
- Growth direction: Mowing pattern normal map
- Court lines: Painted white stripes
- Wear patterns: Baseline thinning

**Shader Requirements**:
```glsl
// Wind animation
uniform float windStrength;
uniform vec2 windDirection;
uniform float time;
// SSS for backlighting
uniform vec3 subsurfaceColor;
```

---

### 4. Court Line Material

**Material ID**: `MAT_COURT_LINE_WHITE`

**Visual Properties**:
- Base Color: RGB(240, 240, 240) - Bright white
- Surface: Matte painted finish
- Wear: Slight edge chipping and fading

**PBR Properties**:
```yaml
baseColor: #F0F0F0
metallic: 0.0
roughness: 0.8
normalStrength: 0.4
emission: RGB(255,255,255) * 0.05
```

**Texture Requirements**:
- **BaseColor**: 512x512 (subtle paint variation)
- **Normal**: 512x512 (paint brush strokes)
- **Roughness**: 512x512 (wear pattern)
- **Opacity**: 512x512 (edge degradation)

**Special Features**:
- Edge softness: Alpha blending at borders
- Paint chipping: Procedural wear mask
- Reflective properties: Slight glow in bright sun

---

### 5. Net Material

**Material ID**: `MAT_COURT_NET_01`

**Visual Properties**:
- Base Color: RGB(40, 40, 40) - Black mesh
- Structure: Woven nylon/polyester
- Transparency: 60% see-through

**PBR Properties**:
```yaml
baseColor: #282828
metallic: 0.0
roughness: 0.6
opacity: 0.4
transmission: 0.6
normalStrength: 0.8
```

**Texture Requirements**:
- **BaseColor**: 1024x1024 (woven pattern)
- **Normal**: 1024x1024 (mesh geometry)
- **Opacity**: 1024x1024 (alpha mask)
- **Roughness**: 512x512

**Special Features**:
- Alpha blending: Proper depth sorting
- Shadow casting: Transparent shadow map
- White top band: Contrasting header material
- Cable posts: Metallic pole material

---

### 6. Court Fence Material

**Material ID**: `MAT_COURT_FENCE_01`

**Visual Properties**:
- Base Color: RGB(40, 100, 60) - Dark green
- Structure: Powder-coated chain-link
- Weathering: Rust spots, paint chips

**PBR Properties**:
```yaml
baseColor: #28643C
metallic: 0.3
roughness: 0.6
normalStrength: 1.0
opacity: 0.7
```

**Texture Requirements**:
- **BaseColor**: 1024x1024 (chain-link pattern)
- **Normal**: 1024x1024 (wire geometry)
- **Metallic**: 512x512 (rust patches)
- **Roughness**: 512x512
- **Opacity**: 1024x1024 (mesh alpha)

---

## Building Exterior Materials

### 1. Modern Facade Glass

**Material ID**: `MAT_BUILDING_GLASS_01`

**Visual Properties**:
- Base Color: RGB(180, 200, 210) - Slight blue tint
- Surface: High reflectivity
- Transparency: 85% with reflections

**PBR Properties**:
```yaml
baseColor: #B4C8D2
metallic: 0.0
roughness: 0.05
transmission: 0.85
ior: 1.52
thickness: 0.01
specularIntensity: 1.0
```

**Texture Requirements**:
- **BaseColor**: 512x512 (tint map)
- **Normal**: 1024x1024 (micro-imperfections)
- **Roughness**: 512x512 (fingerprints, smudges)
- **Reflection Cubemap**: 1024x1024 environment

**Special Features**:
- Real-time reflections: Screen-space or cubemap
- Fresnel effect: Angle-dependent transparency
- Interior visibility: Partial view of interior spaces
- Sun glare: Bright highlights from sunlight

---

### 2. Concrete Exterior

**Material ID**: `MAT_BUILDING_CONCRETE_01`

**Visual Properties**:
- Base Color: RGB(180, 180, 175) - Light gray
- Surface: Smooth architectural concrete
- Details: Pour lines, form marks

**PBR Properties**:
```yaml
baseColor: #B4B4AF
metallic: 0.0
roughness: 0.7
normalStrength: 0.8
aoIntensity: 0.9
```

**Texture Requirements**:
- **BaseColor**: 2048x2048 (tiling)
- **Normal**: 2048x2048 (form marks, aggregate)
- **Roughness**: 2048x2048 (variation)
- **AO**: 2048x2048 (crevice darkening)
- **Height**: 1024x1024 (subtle displacement)

**Special Features**:
- Weathering: Water stains, efflorescence
- Form lines: Horizontal construction joints
- Aggregate detail: Subtle exposed stones
- UV tiling: 2x2 per 4m section

---

### 3. Wood Cladding

**Material ID**: `MAT_BUILDING_WOOD_01`

**Visual Properties**:
- Base Color: RGB(140, 100, 70) - Warm timber
- Surface: Horizontal slat cladding
- Finish: Oil-treated natural wood

**PBR Properties**:
```yaml
baseColor: #8C6446
metallic: 0.0
roughness: 0.5
normalStrength: 1.0
anisotropy: 0.4
anisotropyRotation: 0.0
```

**Texture Requirements**:
- **BaseColor**: 2048x2048 (wood grain)
- **Normal**: 2048x2048 (grain detail, planks)
- **Roughness**: 2048x2048 (cross-grain variation)
- **AO**: 1024x1024 (plank shadows)

**Special Features**:
- Grain direction: Anisotropic highlights
- Plank gaps: Geometry or normal detail
- Weathering: UV fading, gray patina
- Knots and imperfections: Base color variation

---

### 4. Metal Roofing

**Material ID**: `MAT_BUILDING_ROOF_METAL_01`

**Visual Properties**:
- Base Color: RGB(80, 80, 85) - Gunmetal gray
- Surface: Corrugated metal panels
- Finish: Powder-coated steel

**PBR Properties**:
```yaml
baseColor: #505055
metallic: 0.8
roughness: 0.4
normalStrength: 1.2
anisotropy: 0.6
```

**Texture Requirements**:
- **BaseColor**: 2048x2048 (panel pattern)
- **Normal**: 2048x2048 (corrugation)
- **Metallic**: 1024x1024 (rust variation)
- **Roughness**: 2048x2048 (weathering)

**Special Features**:
- Panel seams: Ridge geometry
- Rust streaks: Base color variation
- Rain runoff: Vertical staining
- Anisotropic reflection: Brushed metal look

---

### 5. Entry Door Material

**Material ID**: `MAT_BUILDING_DOOR_01`

**Visual Properties**:
- Base Color: RGB(60, 60, 65) - Charcoal
- Surface: Powder-coated aluminum
- Hardware: Stainless steel handles

**PBR Properties**:
```yaml
baseColor: #3C3C41
metallic: 0.7
roughness: 0.3
normalStrength: 0.6
clearcoat: 0.4
```

**Texture Requirements**:
- **BaseColor**: 1024x1024 (panel detail)
- **Normal**: 1024x1024 (surface texture)
- **Metallic**: 512x512
- **Roughness**: 1024x1024 (fingerprints)

---

## Interior Materials

### 1. Floor - Hardwood Court Surround

**Material ID**: `MAT_INTERIOR_FLOOR_WOOD_01`

**Visual Properties**:
- Base Color: RGB(160, 120, 80) - Maple hardwood
- Surface: Polished sports floor
- Pattern: Vertical plank layout

**PBR Properties**:
```yaml
baseColor: #A07850
metallic: 0.0
roughness: 0.3
normalStrength: 0.8
clearcoat: 0.6
clearcoatRoughness: 0.2
anisotropy: 0.5
```

**Texture Requirements**:
- **BaseColor**: 2048x2048 (wood planks)
- **Normal**: 2048x2048 (grain + plank gaps)
- **Roughness**: 2048x2048 (wear patterns)
- **Clearcoat**: 1024x1024 (poly finish)
- **AO**: 1024x1024

**Special Features**:
- High-gloss finish: Clearcoat layer
- Court markings: Painted boundary lines
- Wear patterns: High-traffic scuff marks
- Reflections: Floor-level environment reflections

---

### 2. Wall - Acoustic Panels

**Material ID**: `MAT_INTERIOR_WALL_ACOUSTIC_01`

**Visual Properties**:
- Base Color: RGB(220, 220, 215) - Off-white
- Surface: Perforated acoustic panels
- Pattern: Regular hole array

**PBR Properties**:
```yaml
baseColor: #DCDCD7
metallic: 0.0
roughness: 0.6
normalStrength: 0.8
aoIntensity: 0.9
```

**Texture Requirements**:
- **BaseColor**: 1024x1024 (panel texture)
- **Normal**: 1024x1024 (perforation depth)
- **Roughness**: 512x512
- **AO**: 1024x1024 (hole shadows)
- **Opacity**: 1024x1024 (perforation alpha)

**Special Features**:
- Hole pattern: Geometric precision
- Depth simulation: Normal map depth
- Sound absorption: Visual texture
- Panel seams: Subtle gaps

---

### 3. Ceiling - Suspended Grid

**Material ID**: `MAT_INTERIOR_CEILING_01`

**Visual Properties**:
- Base Color: RGB(240, 240, 240) - White tiles
- Structure: T-bar grid system
- Finish: Matte acoustical tiles

**PBR Properties**:
```yaml
baseColor: #F0F0F0
metallic: 0.0
roughness: 0.8
normalStrength: 0.4
aoIntensity: 0.7
```

**Texture Requirements**:
- **BaseColor**: 1024x1024 (tile texture)
- **Normal**: 1024x1024 (surface detail)
- **Roughness**: 512x512
- **AO**: 1024x1024 (grid shadows)

**Special Features**:
- Grid lines: Dark metal T-bars
- Tile variation: Subtle color shifts
- Lighting integration: Recessed fixtures
- Ventilation: Diffuser grilles

---

### 4. Glass Interior Partitions

**Material ID**: `MAT_INTERIOR_GLASS_PARTITION_01`

**Visual Properties**:
- Base Color: RGB(220, 230, 235) - Clear with slight tint
- Surface: Tempered safety glass
- Transparency: 90% with frosted sections

**PBR Properties**:
```yaml
baseColor: #DCE6EB
metallic: 0.0
roughness: 0.1
transmission: 0.9
ior: 1.52
thickness: 0.012
normalStrength: 0.3
```

**Texture Requirements**:
- **BaseColor**: 512x512 (tint map)
- **Normal**: 1024x1024 (frosted patterns)
- **Roughness**: 1024x1024 (frosted areas)
- **Opacity**: 1024x1024 (design elements)

**Special Features**:
- Frosted branding: Academy logo
- Safety markers: Decorative dots
- Aluminum frames: Metallic borders
- Edge lighting: LED strip integration

---

### 5. Locker Room Tile

**Material ID**: `MAT_INTERIOR_TILE_CERAMIC_01`

**Visual Properties**:
- Base Color: RGB(200, 210, 220) - Light blue-gray
- Surface: Glossy ceramic tile
- Pattern: 300x300mm tiles with grout

**PBR Properties**:
```yaml
baseColor: #C8D2DC
metallic: 0.0
roughness: 0.15
normalStrength: 0.5
clearcoat: 0.8
clearcoatRoughness: 0.1
```

**Texture Requirements**:
- **BaseColor**: 2048x2048 (tile + grout)
- **Normal**: 2048x2048 (grout depth, surface)
- **Roughness**: 1024x1024
- **Clearcoat**: 1024x1024 (glaze)
- **AO**: 1024x1024 (grout lines)

**Special Features**:
- Grout lines: 3mm dark gray
- Tile variation: Subtle color shifts
- Wet surface: Dynamic roughness
- Reflections: Water puddles

---

### 6. Equipment Storage Cabinets

**Material ID**: `MAT_INTERIOR_CABINET_01`

**Visual Properties**:
- Base Color: RGB(80, 90, 100) - Slate gray
- Surface: Powder-coated metal
- Hardware: Chrome handles

**PBR Properties**:
```yaml
baseColor: #505A64
metallic: 0.6
roughness: 0.4
normalStrength: 0.6
clearcoat: 0.3
```

**Texture Requirements**:
- **BaseColor**: 1024x1024 (panel detail)
- **Normal**: 1024x1024 (surface texture)
- **Metallic**: 512x512 (wear variation)
- **Roughness**: 1024x1024

---

## Furniture and Seating

### 1. Spectator Bench Seating

**Material ID**: `MAT_FURNITURE_BENCH_01`

**Visual Properties**:
- Base Color: RGB(200, 60, 40) - Vibrant red plastic
- Surface: Molded polypropylene
- Finish: Semi-gloss UV-resistant

**PBR Properties**:
```yaml
baseColor: #C83C28
metallic: 0.0
roughness: 0.4
normalStrength: 0.4
subsurfaceScattering: 0.1
translucency: 0.05
```

**Texture Requirements**:
- **BaseColor**: 1024x1024 (plastic texture)
- **Normal**: 1024x1024 (surface detail)
- **Roughness**: 512x512 (wear patterns)

**Special Features**:
- UV fading: Color variation
- Scratches: Normal map detail
- Mounting hardware: Metal brackets
- Drainage holes: Alpha cutouts

---

### 2. Courtside Chair

**Material ID**: `MAT_FURNITURE_CHAIR_01`

**Visual Properties**:
- Base Color: RGB(30, 100, 60) - Forest green canvas
- Structure: Aluminum frame
- Finish: Powder-coated metal + canvas seat

**PBR Properties (Canvas)**:
```yaml
baseColor: #1E643C
metallic: 0.0
roughness: 0.7
normalStrength: 1.0
```

**PBR Properties (Frame)**:
```yaml
baseColor: #404040
metallic: 0.8
roughness: 0.3
normalStrength: 0.4
```

**Texture Requirements**:
- **BaseColor**: 1024x1024 (fabric weave)
- **Normal**: 1024x1024 (canvas texture)
- **Roughness**: 512x512

---

### 3. Training Equipment Rack

**Material ID**: `MAT_FURNITURE_RACK_METAL_01`

**Visual Properties**:
- Base Color: RGB(50, 50, 55) - Gunmetal
- Surface: Steel with powder coat
- Details: Perforated panels

**PBR Properties**:
```yaml
baseColor: #323237
metallic: 0.7
roughness: 0.4
normalStrength: 0.8
```

**Texture Requirements**:
- **BaseColor**: 1024x1024 (metal texture)
- **Normal**: 1024x1024 (weld seams, holes)
- **Metallic**: 512x512 (rust variation)
- **Roughness**: 1024x1024

---

### 4. Wooden Reception Desk

**Material ID**: `MAT_FURNITURE_DESK_WOOD_01`

**Visual Properties**:
- Base Color: RGB(120, 85, 60) - Walnut
- Surface: Polished hardwood
- Finish: Semi-gloss lacquer

**PBR Properties**:
```yaml
baseColor: #78553C
metallic: 0.0
roughness: 0.3
normalStrength: 0.9
clearcoat: 0.5
clearcoatRoughness: 0.3
anisotropy: 0.5
```

**Texture Requirements**:
- **BaseColor**: 2048x2048 (wood grain)
- **Normal**: 2048x2048 (grain detail)
- **Roughness**: 1024x1024
- **Clearcoat**: 1024x1024

---

## Signage and Graphics

### 1. Academy Logo Panel

**Material ID**: `MAT_SIGNAGE_LOGO_01`

**Visual Properties**:
- Base Color: Variable (logo colors)
- Surface: Matte vinyl or printed metal
- Mounting: Standoff from wall

**PBR Properties**:
```yaml
baseColor: #FFFFFF (background)
metallic: 0.0
roughness: 0.6
normalStrength: 0.2
emission: RGB(255,255,255) * 0.1
```

**Texture Requirements**:
- **BaseColor**: 2048x2048 (logo artwork)
- **Normal**: 512x512 (surface texture)
- **Roughness**: 512x512
- **Emission**: 2048x2048 (backlit areas)
- **Opacity**: 2048x2048 (cutout shapes)

**Special Features**:
- Vector-based logo: Sharp edges
- Backlighting: Halo glow effect
- Material variety: Brushed aluminum, acrylic
- 3D depth: Raised lettering

---

### 2. Wayfinding Signage

**Material ID**: `MAT_SIGNAGE_WAYFINDING_01`

**Visual Properties**:
- Base Color: RGB(0, 90, 160) - Brand blue
- Surface: Printed aluminum composite
- Graphics: White icons and text

**PBR Properties**:
```yaml
baseColor: #005AA0
metallic: 0.2
roughness: 0.5
normalStrength: 0.3
```

**Texture Requirements**:
- **BaseColor**: 1024x1024 (sign face)
- **Normal**: 512x512 (surface texture)
- **Roughness**: 512x512

**Special Features**:
- Icon clarity: High-contrast graphics
- Text legibility: Anti-aliased fonts
- Mounting: Wall brackets
- Reflective coating: Slight sheen

---

### 3. Court Number Display

**Material ID**: `MAT_SIGNAGE_COURT_NUMBER_01`

**Visual Properties**:
- Base Color: RGB(255, 255, 255) - White background
- Graphics: Large black numerals
- Finish: Weather-resistant panel

**PBR Properties**:
```yaml
baseColor: #FFFFFF
metallic: 0.0
roughness: 0.7
normalStrength: 0.2
```

**Texture Requirements**:
- **BaseColor**: 512x512 (number + background)
- **Normal**: 256x256
- **Roughness**: 256x256

---

### 4. Sponsor Banner

**Material ID**: `MAT_SIGNAGE_BANNER_01`

**Visual Properties**:
- Base Color: Variable (sponsor branding)
- Surface: Vinyl mesh banner
- Mounting: Tensioned fence mount

**PBR Properties**:
```yaml
baseColor: Custom per sponsor
metallic: 0.0
roughness: 0.6
opacity: 0.95
normalStrength: 0.5
```

**Texture Requirements**:
- **BaseColor**: 2048x2048 (sponsor graphics)
- **Normal**: 1024x1024 (mesh texture)
- **Opacity**: 1024x1024 (mesh holes)
- **Roughness**: 512x512

**Special Features**:
- Wind animation: Shader-based flutter
- UV resistant: Faded color variation
- Grommet holes: Alpha cutouts
- Semi-transparency: See-through mesh

---

### 5. LED Scoreboard Display

**Material ID**: `MAT_SIGNAGE_LED_SCREEN_01`

**Visual Properties**:
- Base Color: RGB(20, 20, 25) - Dark background
- Surface: LED pixel matrix
- Emission: Dynamic content

**PBR Properties**:
```yaml
baseColor: #141419
metallic: 0.1
roughness: 0.3
emission: Dynamic video texture
emissionIntensity: 2.0
```

**Texture Requirements**:
- **BaseColor**: 1024x1024 (screen bezel)
- **Emission**: 1024x1024 (dynamic content)
- **Normal**: 512x512 (pixel grid)

**Special Features**:
- Dynamic content: Video texture playback
- Pixel grid: Subtle LED array
- Screen glow: Bloom post-processing
- Housing: Powder-coated metal frame

---

## Vegetation and Landscaping

### 1. Tree Foliage

**Material ID**: `MAT_VEGETATION_TREE_LEAVES_01`

**Visual Properties**:
- Base Color: RGB(80, 140, 70) - Leaf green
- Surface: Alpha-tested leaf cards
- Translucency: Backlit subsurface

**PBR Properties**:
```yaml
baseColor: #508C46
metallic: 0.0
roughness: 0.7
subsurfaceScattering: 0.4
translucency: 0.5
opacity: 0.95
normalStrength: 0.8
```

**Texture Requirements**:
- **BaseColor**: 2048x2048 (leaf atlas)
- **Normal**: 2048x2048 (leaf veins)
- **Roughness**: 1024x1024
- **Opacity**: 2048x2048 (leaf alpha)
- **SSS Map**: 1024x1024

**Special Features**:
- Wind animation: Vertex displacement
- Seasonal variation: Color gradients
- Leaf detail: Multiple LODs
- Alpha to coverage: Smooth edges

---

### 2. Grass Landscaping

**Material ID**: `MAT_VEGETATION_GRASS_LANDSCAPE_01`

**Visual Properties**:
- Base Color: RGB(90, 150, 75) - Lawn green
- Surface: Dense grass blade cards
- Height: 5-10cm blade length

**PBR Properties**:
```yaml
baseColor: #5A964B
metallic: 0.0
roughness: 0.7
subsurfaceScattering: 0.3
translucency: 0.4
opacity: Varies per blade
normalStrength: 1.0
```

**Texture Requirements**:
- **BaseColor**: 2048x2048 (grass atlas)
- **Normal**: 2048x2048
- **Roughness**: 1024x1024
- **Opacity**: 2048x2048 (blade alpha)
- **Height**: 1024x1024

**Special Features**:
- Wind sway: Shader animation
- Clumping: Instance variation
- Color variation: Green hue shifts
- Ambient occlusion: Ground contact darkening

---

### 3. Tree Bark

**Material ID**: `MAT_VEGETATION_TREE_BARK_01`

**Visual Properties**:
- Base Color: RGB(100, 80, 60) - Brown bark
- Surface: Rough textured bark
- Details: Cracks, knots, moss

**PBR Properties**:
```yaml
baseColor: #64503C
metallic: 0.0
roughness: 0.9
normalStrength: 1.5
aoIntensity: 0.9
```

**Texture Requirements**:
- **BaseColor**: 2048x2048 (bark texture)
- **Normal**: 2048x2048 (deep cracks)
- **Roughness**: 2048x2048
- **AO**: 2048x2048 (crevice occlusion)
- **Height**: 1024x1024

**Special Features**:
- Parallax mapping: Depth illusion
- Moss growth: Color variation
- Weathering: Age progression
- UV mapping: Cylindrical projection

---

### 4. Hedges and Shrubs

**Material ID**: `MAT_VEGETATION_HEDGE_01`

**Visual Properties**:
- Base Color: RGB(70, 110, 60) - Dark foliage green
- Surface: Dense clustered leaves
- Shape: Manicured hedge form

**PBR Properties**:
```yaml
baseColor: #466E3C
metallic: 0.0
roughness: 0.75
subsurfaceScattering: 0.2
translucency: 0.3
opacity: 0.9
```

**Texture Requirements**:
- **BaseColor**: 1024x1024 (leaf cluster)
- **Normal**: 1024x1024
- **Roughness**: 512x512
- **Opacity**: 1024x1024

---

### 5. Ground Cover Plants

**Material ID**: `MAT_VEGETATION_GROUND_COVER_01`

**Visual Properties**:
- Base Color: RGB(95, 125, 85) - Mixed green
- Surface: Low-growing foliage
- Coverage: Dense ground plane

**PBR Properties**:
```yaml
baseColor: #5F7D55
metallic: 0.0
roughness: 0.7
subsurfaceScattering: 0.25
opacity: 0.85
```

**Texture Requirements**:
- **BaseColor**: 1024x1024
- **Normal**: 1024x1024
- **Opacity**: 1024x1024
- **Height**: 512x512

---

## Lighting Materials

### 1. LED Court Floodlight

**Material ID**: `MAT_LIGHTING_LED_FLOOD_01`

**Visual Properties**:
- Base Color: RGB(255, 245, 230) - Warm white
- Emission: High-intensity light source
- Housing: Powder-coated aluminum

**PBR Properties (Lens)**:
```yaml
baseColor: #FFF5E6
metallic: 0.0
roughness: 0.1
emission: RGB(255,245,230)
emissionIntensity: 5.0
transmission: 0.3
ior: 1.5
```

**PBR Properties (Housing)**:
```yaml
baseColor: #3C3C41
metallic: 0.7
roughness: 0.4
normalStrength: 0.6
```

**Texture Requirements**:
- **Emission**: 512x512 (light pattern)
- **BaseColor**: 1024x1024 (housing)
- **Normal**: 1024x1024 (housing detail)
- **IES Profile**: Light distribution data

**Special Features**:
- IES light profile: Realistic distribution
- Lens flare: Post-process effect
- Heat ripple: Shader distortion
- Mounting bracket: Adjustable geometry

---

### 2. Indoor Recessed Lighting

**Material ID**: `MAT_LIGHTING_RECESSED_01`

**Visual Properties**:
- Base Color: RGB(255, 250, 240) - Neutral white
- Emission: Soft downlight
- Trim: White powder coat

**PBR Properties (Bulb)**:
```yaml
baseColor: #FFFAF0
emission: RGB(255,250,240)
emissionIntensity: 3.0
roughness: 0.2
```

**PBR Properties (Trim)**:
```yaml
baseColor: #F0F0F0
metallic: 0.0
roughness: 0.5
```

**Texture Requirements**:
- **Emission**: 256x256 (light cone)
- **BaseColor**: 512x512 (trim)
- **Normal**: 512x512

**Special Features**:
- Soft glow: Volumetric light cone
- Ceiling integration: Flush mount
- Dimming: Intensity variation
- Color temperature: 3000K-5000K range

---

### 3. Emergency Exit Lighting

**Material ID**: `MAT_LIGHTING_EXIT_01`

**Visual Properties**:
- Base Color: RGB(0, 255, 0) - Green sign
- Emission: Backlit acrylic
- Always on: Safety requirement

**PBR Properties**:
```yaml
baseColor: #00FF00
emission: RGB(0,255,0)
emissionIntensity: 2.0
metallic: 0.0
roughness: 0.4
transmission: 0.6
```

**Texture Requirements**:
- **BaseColor**: 512x512 (exit text)
- **Emission**: 512x512 (glow pattern)
- **Opacity**: 512x512 (text cutout)

**Special Features**:
- Uniform glow: Even backlight
- High visibility: Bright emission
- Icon clarity: Sharp graphics
- Battery backup: Always visible

---

### 4. Decorative Pendant Lights

**Material ID**: `MAT_LIGHTING_PENDANT_01`

**Visual Properties**:
- Base Color: Variable (fixture design)
- Emission: Warm ambient light
- Shade: Translucent diffuser

**PBR Properties (Shade)**:
```yaml
baseColor: #FFE8C8
metallic: 0.0
roughness: 0.6
transmission: 0.7
subsurfaceScattering: 0.4
emission: RGB(255,232,200)
emissionIntensity: 1.5
```

**Texture Requirements**:
- **BaseColor**: 1024x1024 (shade pattern)
- **Emission**: 1024x1024 (glow map)
- **Normal**: 1024x1024 (surface detail)

**Special Features**:
- Diffuse glow: SSS effect
- Hanging cable: Suspended geometry
- Multiple styles: Modular designs
- Adjustable height: Ceiling mounts

---

## Texture Resolution Standards

### Resolution Guidelines by Asset Type

| Asset Category | Hero Assets | Standard Assets | Background Assets |
|----------------|-------------|-----------------|-------------------|
| Court Surfaces | 2048x2048 | 2048x2048 | 1024x1024 |
| Building Exterior | 2048x2048 | 2048x2048 | 1024x1024 |
| Interior Spaces | 2048x2048 | 1024x1024 | 512x512 |
| Furniture | 1024x1024 | 1024x1024 | 512x512 |
| Signage | 2048x2048 | 1024x1024 | 512x512 |
| Vegetation | 2048x2048 | 1024x1024 | 512x512 |
| Lighting | 512x512 | 512x512 | 256x256 |

### LOD Texture Requirements

**LOD0 (Full Detail)**:
- Full resolution textures
- All PBR maps included
- Distance: 0-20m

**LOD1 (Medium Detail)**:
- 50% resolution reduction
- BaseColor, Normal, Roughness only
- Distance: 20-50m

**LOD2 (Low Detail)**:
- 75% resolution reduction
- BaseColor and Normal only
- Distance: 50-100m

**LOD3 (Minimal Detail)**:
- 87.5% resolution reduction
- BaseColor only (baked lighting)
- Distance: 100m+

### Compression Standards

| Map Type | Format | Compression | Quality |
|----------|--------|-------------|---------|
| BaseColor | BC1/DXT1 | sRGB | High |
| Normal | BC5/ATI2 | Linear | High |
| Metallic | BC4/ATI1 | Linear | Medium |
| Roughness | BC4/ATI1 | Linear | Medium |
| AO | BC4/ATI1 | Linear | Medium |
| Emission | BC1/DXT1 | sRGB | High |
| Opacity | BC4/ATI1 | Linear | High |

---

## Optimization Guidelines

### Texture Atlasing Strategy

**Court Surface Atlas**:
```
2048x2048 Combined Atlas:
├── Clay court (1024x1024)
├── Court lines (512x512)
├── Net material (256x256)
└── Fence detail (256x256)
```

**Interior Material Atlas**:
```
2048x2048 Combined Atlas:
├── Floor wood (1024x1024)
├── Wall panels (512x512)
├── Ceiling tiles (256x256)
└── Trim details (256x256)
```

### Material Instancing

**High-Instance Materials** (>50 uses):
- Court line material
- Grass blades
- Seating units
- Signage elements
- LED lights

**Medium-Instance Materials** (10-50 uses):
- Window glass
- Door panels
- Wall sections
- Floor tiles

**Unique Materials** (<10 uses):
- Hero logo displays
- Custom furniture
- Specialized equipment

### Memory Budget Allocation

| Category | Texture Memory | Material Count | Instance Budget |
|----------|---------------|----------------|-----------------|
| Courts | 40 MB | 12 | Unlimited |
| Building | 35 MB | 18 | High |
| Interiors | 30 MB | 25 | Medium |
| Furniture | 15 MB | 15 | Medium |
| Signage | 12 MB | 10 | Low |
| Vegetation | 25 MB | 12 | High |
| Lighting | 8 MB | 8 | Low |
| **Total** | **165 MB** | **100** | - |

### Performance Optimization Techniques

**Texture Streaming**:
- Progressive loading based on distance
- Mipmap generation for all textures
- Lazy loading for off-screen materials

**Material Merging**:
- Combine similar roughness values
- Share normal maps where possible
- Atlas small unique textures

**Shader Optimization**:
- Use shader LODs for complex materials
- Disable expensive features at distance
- Bake static lighting where possible

**Draw Call Reduction**:
- Instance identical materials
- Use GPU instancing for vegetation
- Merge static geometry where feasible

---

## Material Naming Conventions

### Naming Schema

```
MAT_[CATEGORY]_[SUBCATEGORY]_[DESCRIPTION]_[VARIANT]

Examples:
MAT_COURT_CLAY_01
MAT_BUILDING_GLASS_FACADE_01
MAT_INTERIOR_FLOOR_WOOD_MAPLE_01
MAT_FURNITURE_CHAIR_COURTSIDE_GREEN
MAT_SIGNAGE_LOGO_BACKLIT_01
MAT_VEGETATION_TREE_OAK_BARK_01
MAT_LIGHTING_LED_FLOOD_5000K
```

### Texture Naming Schema

```
TEX_[MATERIAL_NAME]_[MAP_TYPE]_[RESOLUTION]

Map Types:
- BC (BaseColor)
- N (Normal)
- M (Metallic)
- R (Roughness)
- AO (Ambient Occlusion)
- H (Height/Displacement)
- E (Emission)
- O (Opacity)

Examples:
TEX_COURT_CLAY_BC_2048.png
TEX_COURT_CLAY_N_2048.png
TEX_BUILDING_GLASS_R_1024.png
TEX_FURNITURE_WOOD_M_1024.png
```

### File Organization

```
/textures
├── /courts
│   ├── clay/
│   ├── hard/
│   └── grass/
├── /building
│   ├── exterior/
│   └── interior/
├── /furniture
├── /signage
├── /vegetation
│   ├── trees/
│   └── grass/
└── /lighting

/materials
├── /courts
├── /building
├── /furniture
├── /signage
├── /vegetation
└── /lighting
```

---

## Material Quality Checklist

### Pre-Production Validation

- [ ] Color accuracy verified against brand guidelines
- [ ] PBR values within physically accurate ranges
- [ ] Texture resolutions appropriate for viewing distance
- [ ] Normal map baking errors corrected
- [ ] Tiling seams eliminated or minimized
- [ ] File formats optimized for web delivery
- [ ] Material names follow naming conventions
- [ ] LOD materials created and tested

### Runtime Performance Validation

- [ ] Material draw calls within budget
- [ ] Texture memory usage under target
- [ ] Shader complexity appropriate for target hardware
- [ ] No unnecessary texture reads
- [ ] Proper alpha sorting for transparent materials
- [ ] Instance rendering enabled where applicable
- [ ] Mipmap levels generated correctly
- [ ] Compression artifacts acceptable

### Visual Quality Validation

- [ ] Materials respond correctly to lighting
- [ ] Reflections appear physically plausible
- [ ] Roughness variation adds realism
- [ ] Normal maps enhance surface detail
- [ ] Color values avoid over-saturation
- [ ] Emission intensities balanced
- [ ] Transparency renders without artifacts
- [ ] Material transitions appear seamless

---

## Revision History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-11-22 | Initial material specifications document | Claude Code |

---

## References and Resources

### External Documentation
- [Substance 3D PBR Guide](https://substance3d.adobe.com/tutorials/courses/the-pbr-guide-part-1)
- [Marmoset Toolbag PBR Theory](https://marmoset.co/posts/basic-theory-of-physically-based-rendering/)
- [three.js Material Documentation](https://threejs.org/docs/#api/en/materials/Material)
- [Khronos glTF 2.0 Specification](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html)

### Internal Documents
- [3D Technical Specifications](./3d-technical-specs.md)
- [Asset Production Pipeline](./asset-production-pipeline.md)
- [Performance Optimization Guide](./performance-optimization.md)
- [Brand Visual Guidelines](./brand-guidelines.md)

---

**Document Status**: Complete
**Review Required**: Technical Lead, Art Director
**Implementation Target**: Development Sprint 2-3
