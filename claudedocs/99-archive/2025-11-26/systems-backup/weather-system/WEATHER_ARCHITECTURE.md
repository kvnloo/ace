# Weather System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Interface Layer                      │
├─────────────────────────────────────────────────────────────────┤
│  WeatherControls.tsx                                             │
│  ┌────────────┐ ┌─────────────┐ ┌──────────────────┐           │
│  │ Weather    │ │  Intensity  │ │  Gameplay Impact │           │
│  │ Selector   │ │  Slider     │ │  Indicators      │           │
│  └────────────┘ └─────────────┘ └──────────────────┘           │
│         │              │                   │                     │
│         └──────────────┴───────────────────┘                     │
│                        ▼                                         │
└─────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                        State Management Layer                    │
├─────────────────────────────────────────────────────────────────┤
│  useWeather Hook                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  State:                                                   │  │
│  │  • weather: WeatherType                                  │  │
│  │  • intensity: number (0-1)                               │  │
│  │                                                           │  │
│  │  Actions:                                                │  │
│  │  • changeWeather(type, intensity?)                       │  │
│  │  • setWeather(type)                                      │  │
│  │  • setIntensity(value)                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                        ▼                                         │
└─────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Core Weather System                          │
├─────────────────────────────────────────────────────────────────┤
│  WeatherSystem.tsx                                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Transition Manager                                       │  │
│  │  • currentWeather → targetWeather                        │  │
│  │  • transitionProgress (0-1)                              │  │
│  │  • Easing: t² * (3 - 2t)                                 │  │
│  │  • Duration: 3s default                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                        ▼                                         │
│  ┌──────────────────┬──────────────────┬──────────────────┐    │
│  │   Effect Router  │  Wetness Manager │ Lighting Control │    │
│  └──────────────────┴──────────────────┴──────────────────┘    │
│         │                    │                   │              │
└─────────┼────────────────────┼───────────────────┼──────────────┘
          ▼                    ▼                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Effect Components Layer                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ RainEffect                                               │   │
│  │ • Particle Count: 2000 * intensity                      │   │
│  │ • Geometry: Cylinder (0.02, 0.02, 1)                    │   │
│  │ • Physics: Gravity + Wind                               │   │
│  │ • Features: Splash, drift, velocity variation           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ SnowEffect                                               │   │
│  │ • Particle Count: 1500 * intensity                      │   │
│  │ • Geometry: Octahedron (0.5, 0)                         │   │
│  │ • Physics: Gentle fall + Sway + Rotation                │   │
│  │ • Features: Wind drift, size variation                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ WindEffect                                               │   │
│  │ • Particle Count: 500 * intensity                       │   │
│  │ • Type: Points (BufferGeometry)                         │   │
│  │ • Physics: Horizontal flow + Turbulence                 │   │
│  │ • Features: Additive blending, wrap-around              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ AtmosphericLighting                                      │   │
│  │ • Directional Light: Weather-specific intensity         │   │
│  │ • Ambient Light: Weather-specific color                 │   │
│  │ • Transition: Smooth interpolation                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ WetSurfaceEffect                                         │   │
│  │ • Material: MeshStandardMaterial                        │   │
│  │ • Roughness: 1.0 → 0.3 (as wetness increases)          │   │
│  │ • Metalness: 0.0 → 0.3                                  │   │
│  │ • Opacity: Based on wetness level                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ SunEffect                                                │   │
│  │ • Position: Dynamic (time-based arc)                    │   │
│  │ • Point Light: Distance 300, decay 2                    │   │
│  │ • Visual: Volumetric sphere representation              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Rendering Layer (Three.js)                   │
├─────────────────────────────────────────────────────────────────┤
│  • Instanced Meshes (rain, snow)                                │
│  • Points System (wind)                                          │
│  • Dynamic Lights                                                │
│  • Material Updates                                              │
└──────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
User Action
    │
    ▼
┌─────────────────┐
│ Weather Control │ (Button Click / Slider Move)
└─────────────────┘
    │
    ▼
┌─────────────────┐
│ changeWeather() │
│ setIntensity()  │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│  useState       │ (weather, intensity)
└─────────────────┘
    │
    ▼
┌─────────────────┐
│ WeatherSystem   │ (Props updated)
└─────────────────┘
    │
    ├─────────────────────┬──────────────────┬──────────────────┐
    ▼                     ▼                  ▼                  ▼
┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
│  Check   │      │ Update   │      │ Trigger  │      │ Render   │
│  Target  │      │ Wetness  │      │ Effects  │      │ Lighting │
│  Weather │      │ Level    │      │ Based on │      │ Config   │
└──────────┘      └──────────┘      │ Weather  │      └──────────┘
    │                     │          └──────────┘             │
    ▼                     ▼                  │                ▼
┌──────────┐      ┌──────────┐              ▼        ┌──────────┐
│ Start    │      │ Accum/   │      ┌──────────────┐ │ Light    │
│ Transi-  │      │ Evapor-  │      │ Particle     │ │ Intensity│
│ tion     │      │ ation    │      │ Systems      │ │ & Color  │
└──────────┘      └──────────┘      └──────────────┘ └──────────┘
    │                     │                  │                │
    └─────────────────────┴──────────────────┴────────────────┘
                         │
                         ▼
                  ┌──────────────┐
                  │  useFrame()  │ (Animation Loop)
                  └──────────────┘
                         │
                         ▼
                  ┌──────────────┐
                  │   Update     │
                  │  Particles   │
                  │  Transforms  │
                  └──────────────┘
                         │
                         ▼
                  ┌──────────────┐
                  │   Render     │
                  │   Scene      │
                  └──────────────┘
```

## Weather Transition State Machine

```
┌─────────────────────────────────────────────────────────────────┐
│                     Weather State Machine                        │
└─────────────────────────────────────────────────────────────────┘

    IDLE STATE (transitionProgress = 1.0)
         │
         │ User changes weather
         ▼
    ┌──────────────────────────────────────┐
    │ Set targetWeather = newWeather       │
    │ Set transitionProgress = 0            │
    │ Set isTransitioning = true           │
    └──────────────────────────────────────┘
         │
         ▼
    TRANSITIONING STATE (0 < progress < 1)
         │
         │ Each frame (useFrame):
         │ progress += delta / duration
         │ Apply easing: t² * (3 - 2t)
         │ Blend intensities
         │
         ├──────────────────────────────────┐
         │                                  │
         ▼                                  ▼
    Fade Out                           Fade In
    Current Weather                    Target Weather
    (1.0 → 0.0)                       (0.0 → 1.0)
         │                                  │
         └──────────────┬───────────────────┘
                        │
                        ▼
                   progress >= 1.0?
                        │
         ┌──────────────┴──────────────┐
         │ YES                          │ NO
         ▼                              ▼
    ┌──────────────────┐         Continue
    │ currentWeather   │         Transitioning
    │ = targetWeather  │              │
    │ progress = 1.0   │              │
    │ isTransitioning  │              │
    │ = false          │              │
    └──────────────────┘              │
         │                             │
         ▼                             │
    IDLE STATE                         │
         │                             │
         └─────────────────────────────┘
```

## Particle System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Particle Management                          │
└─────────────────────────────────────────────────────────────────┘

Initialization (useMemo):
    │
    ▼
┌──────────────────────────────────────────────────────────┐
│ Create Particle Array                                    │
│ For i = 0 to particleCount:                             │
│   particle[i] = {                                        │
│     position: random within area,                       │
│     velocity: gravity + wind,                           │
│     life: random 0-1,                                   │
│     phase: random 0-2π                                  │
│   }                                                      │
└──────────────────────────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────────────────────────┐
│ Apply to InstancedMesh                                   │
│ For each particle:                                       │
│   tempObject.position.set(particle.position)           │
│   tempObject.rotation.set(...)                         │
│   tempObject.scale.set(...)                            │
│   tempObject.updateMatrix()                            │
│   mesh.setMatrixAt(i, tempObject.matrix)              │
│ mesh.instanceMatrix.needsUpdate = true                  │
└──────────────────────────────────────────────────────────┘
    │
    ▼
Animation Loop (useFrame):
    │
    ▼
┌──────────────────────────────────────────────────────────┐
│ Update Particles                                         │
│ For each particle:                                       │
│   1. Update position:                                   │
│      position += velocity * delta                       │
│                                                          │
│   2. Apply environmental forces:                        │
│      wind = sin(time + phase) * windStrength           │
│      position.x += wind                                 │
│                                                          │
│   3. Check bounds:                                      │
│      if (position.y < 0):                              │
│        reset to top                                     │
│        randomize position.x, position.z                │
│                                                          │
│   4. Update life:                                       │
│      life = max(0, life - delta * 0.5)                │
│                                                          │
│   5. Update transform:                                  │
│      mesh.setMatrixAt(i, newMatrix)                    │
└──────────────────────────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────────────────────────┐
│ Mark for Update                                          │
│ mesh.instanceMatrix.needsUpdate = true                   │
└──────────────────────────────────────────────────────────┘
    │
    └──► Loop (60 FPS)
```

## Lighting System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│              Atmospheric Lighting Configuration                  │
└─────────────────────────────────────────────────────────────────┘

Weather Configs:
┌────────┬──────────────┬─────────┬───────────┐
│ Weather│ Directional  │ Ambient │   Color   │
├────────┼──────────────┼─────────┼───────────┤
│ clear  │     1.2      │   0.6   │ #ffffff   │
│ rain   │     0.5      │   0.4   │ #b0c4de   │
│ snow   │     0.8      │   0.7   │ #f0f8ff   │
│ windy  │     1.0      │   0.5   │ #fffacd   │
│ storm  │     0.3      │   0.3   │ #708090   │
└────────┴──────────────┴─────────┴───────────┘

Transition Logic (useFrame):
    │
    ▼
┌──────────────────────────────────────────────────────────┐
│ Get Current & Target Configs                            │
│ currentConfig = getConfig(currentWeather)               │
│ targetConfig = getConfig(targetWeather)                 │
└──────────────────────────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────────────────────────┐
│ Interpolate Based on Progress                           │
│ intensity = lerp(                                        │
│   currentConfig.directional,                            │
│   targetConfig.directional,                             │
│   transitionProgress                                     │
│ )                                                        │
│                                                          │
│ color = lerpColor(                                      │
│   currentConfig.color,                                  │
│   targetConfig.color,                                   │
│   transitionProgress                                     │
│ )                                                        │
└──────────────────────────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────────────────────────┐
│ Apply to Lights                                          │
│ directionalLight.intensity = intensity                   │
│ directionalLight.color = color                          │
│ ambientLight.intensity = ambientIntensity               │
│ ambientLight.color = color                              │
└──────────────────────────────────────────────────────────┘
```

## Performance Optimization Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                     Performance Layers                           │
└─────────────────────────────────────────────────────────────────┘

Level 1: Instanced Rendering
    ┌───────────────────────────────────────────────────┐
    │ Single Draw Call per Weather Effect              │
    │ • Rain: 1 draw call for 2000 particles          │
    │ • Snow: 1 draw call for 1500 particles          │
    │ Benefits: ~95% reduction in draw calls           │
    └───────────────────────────────────────────────────┘

Level 2: Conditional Rendering
    ┌───────────────────────────────────────────────────┐
    │ Only Active Weather Rendered                      │
    │ • if (weather === 'rain') render RainEffect      │
    │ • Inactive effects: 0 GPU cost                   │
    │ Benefits: No overhead from inactive weather      │
    └───────────────────────────────────────────────────┘

Level 3: LOD (Potential Enhancement)
    ┌───────────────────────────────────────────────────┐
    │ Distance-Based Quality                            │
    │ • Near: Full particle count                      │
    │ • Mid: 50% particle count                        │
    │ • Far: 25% particle count                        │
    │ Benefits: ~60% performance gain in large scenes  │
    └───────────────────────────────────────────────────┘

Level 4: Frustum Culling
    ┌───────────────────────────────────────────────────┐
    │ Camera-Aware Rendering                            │
    │ • Only render particles in view                  │
    │ • frustumCulled={false} on particles (boundary)  │
    │ Benefits: Better for moving cameras              │
    └───────────────────────────────────────────────────┘

Level 5: Intensity Scaling
    ┌───────────────────────────────────────────────────┐
    │ Dynamic Particle Count                            │
    │ • particleCount = baseCount * intensity          │
    │ • User adjustable: 0.0 - 1.0                     │
    │ Benefits: Linear performance scaling             │
    └───────────────────────────────────────────────────┘
```

## Integration Points

```
┌─────────────────────────────────────────────────────────────────┐
│                   External System Integration                    │
└─────────────────────────────────────────────────────────────────┘

1. Grass Component Integration
   ┌────────────────────────────────────────────────┐
   │ Weather → Grass Animation                      │
   │ • Windy/Storm: Increase sway                  │
   │ • Clear: Normal animation                      │
   │ • Rain/Snow: Moderate sway                    │
   └────────────────────────────────────────────────┘

2. Court Surface Integration
   ┌────────────────────────────────────────────────┐
   │ Weather → Surface Properties                   │
   │ • Rain/Storm: Reduce friction (0.7)           │
   │ • Snow: Reduce friction (0.5)                 │
   │ • Clear: Normal friction (1.0)                │
   │ • Apply wetness visual to material            │
   └────────────────────────────────────────────────┘

3. Gameplay Mechanics
   ┌────────────────────────────────────────────────┐
   │ Weather → Game Physics                         │
   │ • Ball trajectory affected by wind            │
   │ • Visibility reduces AI accuracy              │
   │ • Surface friction affects movement           │
   │ • Bounce coefficient modified by wetness      │
   └────────────────────────────────────────────────┘

4. Audio System (Future)
   ┌────────────────────────────────────────────────┐
   │ Weather → Sound Effects                        │
   │ • Rain: Droplet sounds                        │
   │ • Wind: Whoosh ambient                        │
   │ • Storm: Thunder + heavy rain                 │
   │ • Volume scales with intensity                │
   └────────────────────────────────────────────────┘

5. Camera Effects (Future)
   ┌────────────────────────────────────────────────┐
   │ Weather → Post-Processing                      │
   │ • Storm: Screen shake                         │
   │ • Rain: Lens droplets                         │
   │ • Fog: Distance blur                          │
   │ • Snow: Chromatic aberration                  │
   └────────────────────────────────────────────────┘
```

## Memory Management

```
┌─────────────────────────────────────────────────────────────────┐
│                     Memory Allocation                            │
└─────────────────────────────────────────────────────────────────┘

Particle Arrays (Float32Array):
    Rain:  2000 particles × 3 vectors × 4 floats = 24KB
    Snow:  1500 particles × 4 vectors × 4 floats = 24KB
    Wind:   500 particles × 2 vectors × 4 floats =  4KB
                                          Total: ~52KB

Instance Matrices (Float32Array):
    Rain:  2000 × 16 floats = 128KB
    Snow:  1500 × 16 floats =  96KB
                      Total: 224KB

Geometry Buffers:
    Cylinder (rain):    ~1KB
    Octahedron (snow):  ~1KB
    Points (wind):      ~1KB
                Total:   3KB

Total Memory: ~280KB per active weather effect
Peak Usage (storm): ~500KB (rain + wind combined)

Optimization Strategies:
1. Particle Pooling: Reuse particle objects
2. Lazy Loading: Create effects on first use
3. Cleanup: Dispose geometries when switching
4. Compression: Use Half-float for positions
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                     Framework & Libraries                        │
└─────────────────────────────────────────────────────────────────┘

React Three Fiber (@react-three/fiber)
    │
    ├─ Canvas: 3D scene container
    ├─ useFrame: Animation loop
    ├─ useThree: Context access
    └─ Hooks: State management

React Three Drei (@react-three/drei)
    │
    ├─ OrbitControls: Camera control
    ├─ Environment: HDR lighting
    ├─ PerspectiveCamera: Camera setup
    └─ Html: 2D overlay in 3D

Three.js (three)
    │
    ├─ InstancedMesh: Particle rendering
    ├─ BufferGeometry: Vertex data
    ├─ Points: Wind particles
    ├─ Vector3: 3D math
    ├─ Color: Color management
    └─ Object3D: Transform management

React (react)
    │
    ├─ useState: State management
    ├─ useEffect: Side effects
    ├─ useRef: Mutable references
    └─ useMemo: Memoization

Lucide React (lucide-react)
    │
    └─ Icons: Weather UI icons

TypeScript (typescript)
    │
    └─ Type Safety: Full type definitions
```

This architecture ensures high performance, maintainability, and extensibility for the weather system.
