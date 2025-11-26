# Loading Screen Architecture - SPARC Analysis

**Project**: ACE Facility 3D Tennis Environment
**Component**: Loading Screen System
**Methodology**: SPARC (Specification, Pseudocode, Architecture, Refinement, Completion)
**Status**: Architecture Design Phase
**Date**: 2025-11-23
**Architect**: System Architecture Designer

---

## Executive Summary

The Loading Screen system currently prevents users from accessing the 3D scene due to **asset loading never completing**. While the Canvas and ThreeScene render immediately, the loading overlay blocks view indefinitely because the AssetLoader state machine gets stuck. This SPARC document provides a comprehensive architectural solution addressing root causes, performance optimization, and robust error handling.

**Critical Finding**: Asset definitions exist (40+ assets), but the LoadingProvider → AssetLoader integration has state synchronization issues causing the loading screen to never dismiss.

---

# S - SPECIFICATION

## 1.1 Problem Statement

### Current Behavior (Broken)
```
User clicks "Explore 3D Demo"
  → ThreeScene mounts, Canvas renders (WORKS)
  → LoadingProvider initializes (WORKS)
  → AssetRegistry has 40+ assets (WORKS)
  → AssetLoader.start() begins (WORKS)
  → LoadingProvider updates progress (WORKS)
  → isLoading never becomes false (BREAKS)
  → onComplete() never called (BREAKS)
  → Loading screen stays visible forever (BROKEN)
```

### Root Causes Identified

1. **State Synchronization Race Condition**
   - AssetLoader completes but doesn't call `setIsLoading(false)` in LoadingProvider
   - LoadingProvider waits for `!isLoading` before calling `onComplete()`
   - Result: Infinite wait state

2. **Callback Chain Broken**
   ```typescript
   // Current broken flow
   AssetLoader.start() → onPhaseComplete → LoadingProvider updates
   BUT: setIsLoading(false) never called
   ```

3. **10-Second Timeout Not Working**
   - Timeout exists but `onComplete` callback may not be wired correctly
   - Multiple LoadingScreen instances may be fighting
   - React state update race conditions

### Target Behavior (Fixed)
```
User clicks "Explore 3D Demo"
  → ThreeScene mounts, Canvas renders
  → LoadingProvider initializes
  → AssetRegistry provides 40+ assets
  → AssetLoader.start() begins progressive loading
  → LoadingProvider receives progress updates
  → All phases complete → AssetLoader.state = COMPLETED
  → setIsLoading(false) called
  → LoadingProvider conditions met
  → onComplete() called after minimum display time
  → Loading screen hides, revealing 3D scene
```

## 1.2 Functional Requirements

### FR-1: Asset Loading Orchestration
- **FR-1.1**: Load assets in 4 phases (Essential → Core → Visual → Enhanced)
- **FR-1.2**: Track per-asset progress (0-100%)
- **FR-1.3**: Support dependency resolution
- **FR-1.4**: Handle asset loading failures gracefully
- **FR-1.5**: Provide real-time progress updates

### FR-2: Loading Screen Display
- **FR-2.1**: Show animated loading spinner
- **FR-2.2**: Display overall progress percentage
- **FR-2.3**: List assets with individual progress bars
- **FR-2.4**: Show current loading phase name
- **FR-2.5**: Display loaded vs total asset count

### FR-3: Performance Monitoring
- **FR-3.1**: Measure and display real-time FPS
- **FR-3.2**: Track FPS history (30-second window)
- **FR-3.3**: Classify performance level (Excellent/Good/Fair/Poor)
- **FR-3.4**: Show performance graph visualization
- **FR-3.5**: Detect performance degradation

### FR-4: Quality Recommendations
- **FR-4.1**: Recommend quality downgrades when FPS < 40
- **FR-4.2**: Show dismissible recommendation cards
- **FR-4.3**: Provide "Switch Quality" action buttons
- **FR-4.4**: Track user's quality preference

### FR-5: Completion & Dismissal
- **FR-5.1**: Enforce minimum display time (2000ms default)
- **FR-5.2**: Call onComplete() when all conditions met
- **FR-5.3**: Support graceful timeout (10 seconds max)
- **FR-5.4**: Handle test mode bypass (localStorage flag)
- **FR-5.5**: Provide manual dismiss option (development)

## 1.3 Non-Functional Requirements

### NFR-1: Performance
- **NFR-1.1**: Initial render < 16ms (60 FPS target)
- **NFR-1.2**: FPS monitoring overhead < 2ms per frame
- **NFR-1.3**: Memory footprint < 50 MB
- **NFR-1.4**: CPU usage < 10% (on modern hardware)
- **NFR-1.5**: No jank during asset loading

### NFR-2: Reliability
- **NFR-2.1**: Zero blocking states (always escapable)
- **NFR-2.2**: Timeout failsafe prevents infinite loading
- **NFR-2.3**: Asset load failures don't block completion
- **NFR-2.4**: State machine has no deadlock paths
- **NFR-2.5**: React state updates are idempotent

### NFR-3: Accessibility
- **NFR-3.1**: WCAG 2.1 AA compliance
- **NFR-3.2**: Full keyboard navigation support
- **NFR-3.3**: Screen reader compatibility
- **NFR-3.4**: Reduced motion mode support
- **NFR-3.5**: High contrast mode support

### NFR-4: Maintainability
- **NFR-4.1**: Clear separation of concerns (Provider/Screen/Loader)
- **NFR-4.2**: Comprehensive TypeScript typing
- **NFR-4.3**: Detailed logging for debugging
- **NFR-4.4**: Unit test coverage > 80%
- **NFR-4.5**: Integration test coverage for critical paths

## 1.4 User Stories

### US-1: First-Time Visitor
```
As a first-time visitor
I want to see loading progress while the 3D scene initializes
So that I know the application is working and when it will be ready
```

**Acceptance Criteria**:
- Loading screen appears immediately when clicking "Explore 3D Demo"
- Progress bar shows percentage (0% → 100%)
- Asset list shows individual loading status
- Loading completes within 10 seconds
- 3D scene appears smoothly after loading

### US-2: Low-Performance Device User
```
As a user with a low-performance device
I want to receive quality recommendations based on measured FPS
So that I can enjoy a smooth experience without manual tuning
```

**Acceptance Criteria**:
- FPS monitoring starts immediately
- Performance level displayed (Excellent/Good/Fair/Poor)
- Recommendation card appears if FPS < 40
- One-click quality downgrade button
- Dismissible recommendation (user choice)

### US-3: Developer Testing
```
As a developer testing the application
I want to bypass the loading screen for rapid iteration
So that I can test 3D features without waiting
```

**Acceptance Criteria**:
- `localStorage.setItem('test-skip-loading', 'true')` bypasses loading
- `localStorage.setItem('dev-skip-loading', 'true')` bypasses loading
- Console logs show skip reason
- 3D scene appears immediately
- No side effects or crashes

### US-4: User Experiencing Slow Network
```
As a user on a slow network connection
I want clear feedback if loading is taking too long
So that I know whether to wait or refresh
```

**Acceptance Criteria**:
- Timeout after 10 seconds maximum
- Clear error message if timeout occurs
- Option to retry loading
- Option to continue with partial assets
- Console logs show timeout reason

## 1.5 Technical Constraints

### TC-1: Technology Stack
- React 18 with TypeScript
- Framer Motion for animations
- Three.js / React Three Fiber for 3D
- Tailwind CSS for styling
- Lucide Icons for UI elements

### TC-2: Browser Compatibility
- Chrome 90+ (primary)
- Firefox 88+ (secondary)
- Safari 14+ (secondary)
- Edge 90+ (tertiary)

### TC-3: Performance Targets
- 60 FPS during loading (no animation jank)
- < 200ms time to interactive (loading screen)
- < 5 seconds typical loading duration
- < 10 seconds maximum loading duration

### TC-4: Integration Points
- LoadingProvider Context API
- AssetRegistry Singleton
- AssetLoader Service
- DebugContext Integration
- ThreeScene Component

---

# P - PSEUDOCODE

## 2.1 Asset Loading State Machine

### State Definitions
```typescript
enum LoadingState {
  IDLE = 'idle',           // Not started
  INITIALIZING = 'init',   // Setting up
  LOADING = 'loading',     // Active loading
  COMPLETED = 'completed', // Success
  FAILED = 'failed',       // Error
  TIMEOUT = 'timeout'      // Max time exceeded
}

enum LoadingPhase {
  ESSENTIAL = 'essential', // Core 3D scene (0-25%)
  CORE = 'core',          // Courts + lighting (25-50%)
  VISUAL = 'visual',      // Grass + effects (50-75%)
  ENHANCED = 'enhanced'   // Weather + advanced (75-100%)
}
```

### Core Algorithm: AssetLoader.start()

```pseudocode
FUNCTION AssetLoader.start() -> LoadingResult

  // Phase 1: Initialization
  state ← INITIALIZING
  totalAssets ← registry.getAll()

  IF totalAssets.length = 0 THEN
    WARN "No assets in registry - skipping loading"
    state ← COMPLETED
    CALL setIsLoading(false)
    RETURN { success: true, duration: 0 }
  END IF

  state ← LOADING
  startTime ← now()

  // Phase 2: Progressive Loading
  FOR EACH phase IN [ESSENTIAL, CORE, VISUAL, ENHANCED]
    phaseAssets ← getAssetsByPhase(phase)

    // Parallel loading within phase
    results ← PARALLEL_MAP phaseAssets AS asset
      TRY
        CALL loadAsset(asset)
        UPDATE progress(asset.id, 100)
        RETURN { success: true, asset: asset.id }
      CATCH error
        LOG "Asset load failed: " + asset.id
        UPDATE progress(asset.id, -1) // Mark as failed
        RETURN { success: false, asset: asset.id, error: error }
      END TRY
    END PARALLEL_MAP

    // Update phase progress
    phaseProgress ← calculatePhaseProgress(phase, results)
    CALL onPhaseComplete({ phase, progress: phaseProgress, results })

    // Check for timeout
    elapsed ← now() - startTime
    IF elapsed > MAX_LOADING_TIME THEN
      state ← TIMEOUT
      CALL setIsLoading(false)
      RETURN { success: false, reason: 'timeout' }
    END IF
  END FOR

  // Phase 3: Completion
  state ← COMPLETED
  duration ← now() - startTime

  // CRITICAL: Signal completion to LoadingProvider
  CALL setIsLoading(false)

  RETURN {
    success: true,
    duration: duration,
    assetsLoaded: totalAssets.length,
    phases: [ESSENTIAL, CORE, VISUAL, ENHANCED]
  }

END FUNCTION
```

### Algorithm: LoadingProvider State Management

```pseudocode
FUNCTION LoadingProvider.initialize()

  // Get all assets from registry
  registryAssets ← registry.getAll()

  // Initialize state
  assets ← MAP registryAssets AS asset
    RETURN {
      id: asset.id,
      name: asset.name,
      category: asset.category,
      loaded: false,
      error: false,
      progress: 0
    }
  END MAP

  totalCount ← assets.length
  loadedCount ← 0
  overallProgress ← 0
  isLoading ← false // Start false, set true on startLoading()

  // Create AssetLoader instance
  loader ← NEW AssetLoader(
    registry,
    debugContext,
    {
      onProgress: FUNCTION(progress)
        CALL updateFromProgress(progress)

        // Update phase based on percentage
        IF progress.totalProgress < 25 THEN
          currentPhase ← 'Essential'
        ELSE IF progress.totalProgress < 50 THEN
          currentPhase ← 'Core'
        ELSE IF progress.totalProgress < 75 THEN
          currentPhase ← 'Visual'
        ELSE
          currentPhase ← 'Enhanced'
        END IF
      END FUNCTION,

      onPhaseComplete: FUNCTION(result)
        LOG "Phase complete: " + result.phase
        // Update state based on completed phase
      END FUNCTION
    }
  )

  // Auto-start if enabled
  IF autoStart THEN
    SCHEDULE startLoading() AFTER 100ms
  END IF

END FUNCTION

FUNCTION LoadingProvider.startLoading()

  isLoading ← true

  TRY
    result ← AWAIT loader.start()

    // CRITICAL: Ensure isLoading is set to false
    isLoading ← false

    LOG "Loading complete: " + result

  CATCH error
    LOG_ERROR "Loading failed: " + error
    isLoading ← false

  END TRY

END FUNCTION

FUNCTION LoadingProvider.updateFromProgress(progress)

  // Update overall progress
  overallProgress ← progress.totalProgress
  isLoading ← (progress.state = LoadingState.LOADING)

  // Update individual assets
  FOR EACH asset IN assets
    assetProgress ← progress.assets.get(asset.id)

    IF assetProgress EXISTS THEN
      asset.loaded ← (assetProgress.status = 'loaded')
      asset.error ← (assetProgress.status = 'failed')
      asset.progress ← CALCULATE_PROGRESS(assetProgress.status)
    END IF
  END FOR

  // Update loaded count
  loadedCount ← COUNT(assets WHERE loaded = true)

END FUNCTION
```

### Algorithm: LoadingScreen Completion Logic

```pseudocode
FUNCTION LoadingScreen.checkCompletion()

  // Gather conditions
  assetsComplete ← (totalCount = 0) OR (loadedCount = totalCount)
  minimumTimeElapsed ← (now() - displayStartTime >= minimumDisplayTime)
  loadingFinished ← NOT isLoading
  hasCallback ← onComplete IS NOT NULL
  notTimedOut ← NOT loadingTimeout
  notTestMode ← NOT isTestMode

  // Combined condition
  shouldComplete ← loadingFinished AND
                   assetsComplete AND
                   canDismiss AND // Set after minimumDisplayTime
                   hasCallback AND
                   notTimedOut AND
                   notTestMode

  IF shouldComplete THEN
    // Calculate remaining delay
    elapsed ← now() - displayStartTime
    remaining ← MAX(0, minimumDisplayTime - elapsed)

    SCHEDULE AFTER remaining
      LOG "Loading screen completing - calling onComplete()"
      CALL onComplete()
    END SCHEDULE
  END IF

END FUNCTION

// Timeout Failsafe
FUNCTION LoadingScreen.setupTimeout()

  SCHEDULE AFTER 10000ms // 10 second timeout
    IF still visible THEN
      WARN "Loading timeout - forcing completion"
      loadingTimeout ← true

      IF onComplete EXISTS THEN
        LOG "Calling onComplete() due to timeout"
        CALL onComplete()
      END IF
    END IF
  END SCHEDULE

END FUNCTION

// Test Mode Bypass
FUNCTION LoadingScreen.checkTestMode()

  TRY
    skipTests ← localStorage.getItem('test-skip-loading') = 'true'
    skipDev ← localStorage.getItem('dev-skip-loading') = 'true'

    isTestMode ← skipTests OR skipDev

    IF isTestMode THEN
      LOG "Test/Dev mode detected - skipping loading screen"

      IF onComplete EXISTS THEN
        CALL onComplete()
      END IF

      RETURN null // Don't render
    END IF

  CATCH error
    isTestMode ← false
  END TRY

END FUNCTION
```

## 2.2 FPS Monitoring Algorithm

```pseudocode
FUNCTION measureFPS()

  frameCount ← 0
  lastTime ← performance.now()
  history ← [] // Max 30 samples

  FUNCTION frameLoop()
    currentTime ← performance.now()
    delta ← currentTime - lastTime

    IF delta >= 1000 THEN // Update every second
      fps ← ROUND((frameCount * 1000) / delta)

      // Update history
      history.APPEND(fps)
      IF history.length > 30 THEN
        history.REMOVE_FIRST()
      END IF

      // Calculate metrics
      average ← SUM(history) / history.length
      min ← MIN(history)
      max ← MAX(history)

      // Update state
      fpsData ← { current: fps, average, min, max, history }

      // Determine performance level
      IF fps >= 55 THEN
        fpsLevel ← 'excellent'
      ELSE IF fps >= 40 THEN
        fpsLevel ← 'good'
      ELSE IF fps >= 25 THEN
        fpsLevel ← 'fair'
      ELSE
        fpsLevel ← 'poor'
      END IF

      // Show recommendation if performance drops
      IF fpsLevel IN ['fair', 'poor'] THEN
        showRecommendation ← true
      END IF

      // Reset counters
      frameCount ← 0
      lastTime ← currentTime
    END IF

    frameCount ← frameCount + 1
    requestAnimationFrame(frameLoop)
  END FUNCTION

  requestAnimationFrame(frameLoop)

END FUNCTION
```

## 2.3 Milestone Detection Algorithm

```pseudocode
FUNCTION detectMilestones(currentProgress, lastMilestone)

  milestones ← [25, 50, 75, 100]
  roundedProgress ← ROUND(currentProgress)

  FOR EACH milestone IN milestones
    IF roundedProgress >= milestone AND lastMilestone < milestone THEN
      // Milestone reached!
      lastMilestone ← milestone
      showMilestone ← true

      SCHEDULE AFTER 2000ms
        showMilestone ← false
      END SCHEDULE

      LOG "Milestone reached: " + milestone + "%"
      BREAK
    END IF
  END FOR

  RETURN lastMilestone

END FUNCTION
```

---

# A - ARCHITECTURE

## 3.1 System Overview

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                      App Component                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              LoadingProvider Context                  │  │
│  │  ┌────────────────────┐    ┌────────────────────┐    │  │
│  │  │  LoadingScreen     │    │   AssetLoader      │    │  │
│  │  │   Component        │◄───┤    Service         │    │  │
│  │  └────────────────────┘    └────────────────────┘    │  │
│  │         ▲                            ▲                │  │
│  │         │                            │                │  │
│  │         │                  ┌─────────┴────────┐       │  │
│  │         │                  │  AssetRegistry   │       │  │
│  │         │                  │    Singleton     │       │  │
│  │         │                  └──────────────────┘       │  │
│  │         │                            ▲                │  │
│  │         │                            │                │  │
│  │         │                  ┌─────────┴────────┐       │  │
│  │         │                  │ ASSET_DEFINITIONS│       │  │
│  │         │                  │   (40+ assets)   │       │  │
│  │         │                  └──────────────────┘       │  │
│  └─────────┼────────────────────────────────────────────┘  │
│            │                                                │
│  ┌─────────┴────────────────────────────────────────────┐  │
│  │              ThreeScene Component                    │  │
│  │  ┌────────────────────┐    ┌────────────────────┐   │  │
│  │  │      Canvas        │    │   3D Components    │   │  │
│  │  │  (React Three)     │    │  (Courts, Grass)   │   │  │
│  │  └────────────────────┘    └────────────────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Component Hierarchy
```
App.tsx
├── LoadingProvider
│   ├── Context: { assets, progress, isLoading, onComplete }
│   ├── AssetLoader (service)
│   │   ├── AssetRegistry (singleton)
│   │   │   └── ASSET_DEFINITIONS (data)
│   │   └── DebugContext (integration)
│   └── Children (App content)
│
└── ThreeScene (when currentView = FACILITY_DEMO)
    ├── LoadingProvider (wraps scene)
    │   ├── LoadingScreen (overlay, z-index: 50)
    │   │   ├── Spinner
    │   │   ├── Progress Bar
    │   │   ├── Asset List
    │   │   ├── FPS Monitor
    │   │   └── Recommendations
    │   └── Canvas (renders underneath)
    │       ├── CameraRig
    │       ├── TennisCourts
    │       ├── GrassSystem
    │       ├── LightingSystem
    │       └── 3D Scene Components
```

## 3.2 Data Flow Architecture

### State Management Flow
```
┌─────────────────────────────────────────────────────────────┐
│                  INITIALIZATION PHASE                       │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│  1. LoadingProvider.useEffect()                             │
│     - Initialize AssetLoader                                │
│     - Get assets from AssetRegistry                         │
│     - Set totalCount, assets[]                              │
│     - Auto-start if enabled                                 │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│                   LOADING PHASE                             │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│  2. AssetLoader.start()                                     │
│     FOR each phase [Essential → Core → Visual → Enhanced]  │
│       - Load phase assets in parallel                       │
│       - Call onProgress(progress)                           │
│       - Call onPhaseComplete(result)                        │
│     END FOR                                                 │
│     - Set state = COMPLETED                                 │
│     - **CALL setIsLoading(false)** ← CRITICAL               │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│  3. LoadingProvider receives callbacks                      │
│     onProgress → updateFromProgress()                       │
│       - Update overallProgress                              │
│       - Update asset[] statuses                             │
│       - Update loadedCount                                  │
│       - **Update isLoading state** ← CRITICAL               │
│     onPhaseComplete → update currentPhase                   │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│  4. LoadingScreen.useEffect() monitors state                │
│     Conditions:                                             │
│       ✓ !isLoading (from LoadingProvider)                   │
│       ✓ assetsComplete (loadedCount = totalCount)           │
│       ✓ canDismiss (minimumDisplayTime elapsed)             │
│       ✓ onComplete exists                                   │
│     IF all conditions met:                                  │
│       CALL onComplete()                                     │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│                  COMPLETION PHASE                           │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│  5. ThreeScene.handleLoadingComplete()                      │
│     - Set isLoadingComplete = true                          │
│     - Loading screen unmounts (return null)                 │
│     - 3D scene visible                                      │
└─────────────────────────────────────────────────────────────┘
```

### Critical State Dependencies

```typescript
// LoadingProvider State
interface LoadingProviderState {
  assets: LoadingAsset[]        // Individual asset tracking
  overallProgress: number        // 0-100
  loadedCount: number           // Number loaded
  totalCount: number            // Total assets
  isLoading: boolean            // ← CRITICAL: Must become false
  currentPhase: string          // 'Essential' | 'Core' | 'Visual' | 'Enhanced'
}

// LoadingScreen Conditions
shouldComplete =
  !isLoading &&                 // AssetLoader finished
  (totalCount === 0 || loadedCount === totalCount) && // Assets done
  canDismiss &&                 // Min time elapsed
  onComplete !== null           // Callback exists

// AssetLoader State Machine
enum LoadingState {
  IDLE → INITIALIZING → LOADING → COMPLETED
                                ↓
                          setIsLoading(false) ← MUST HAPPEN
}
```

## 3.3 Component Contracts & Interfaces

### LoadingProvider Contract
```typescript
interface LoadingProviderProps {
  children: ReactNode
  registry: AssetRegistry
  debugContext?: DebugContext
  autoStart?: boolean
}

interface LoadingContextValue {
  // State
  assets: LoadingAsset[]
  overallProgress: number
  loadedCount: number
  totalCount: number
  isLoading: boolean
  fps: number
  currentPhase: string

  // Actions
  startLoading: () => Promise<void>
  cancelLoading: () => void
}

interface LoadingAsset {
  id: string
  name: string
  category: string
  loaded: boolean
  error: boolean
  progress: number
}
```

### LoadingScreen Contract
```typescript
interface LoadingScreenProps {
  onComplete?: () => void
  minimumDisplayTime?: number  // Default: 2000ms
  showFPSMonitor?: boolean     // Default: true
  qualityMode?: 'auto' | 'high' | 'medium' | 'low'
}

// Internal State (not exposed)
interface LoadingScreenState {
  displayStartTime: number
  canDismiss: boolean
  loadingTimeout: boolean
  showErrorUI: boolean
  fpsData: FPSData
  showMilestone: boolean
  lastMilestone: number
  showRecommendation: boolean
  fpsLevel: FPSLevel
}
```

### AssetLoader Contract
```typescript
interface AssetLoaderConfig {
  onProgress?: (progress: LoadingProgress) => void
  onPhaseComplete?: (result: PhaseResult) => void
  onError?: (error: LoadingError) => void
}

interface LoadingProgress {
  state: LoadingState
  totalProgress: number         // 0-100
  currentPhase: LoadingPhase
  assets: Map<string, AssetProgress>
}

interface PhaseResult {
  phase: LoadingPhase
  progress: number
  results: AssetLoadResult[]
  duration: number
}

interface LoadingResult {
  success: boolean
  duration: number
  assetsLoaded?: number
  phases?: LoadingPhase[]
  reason?: string
}
```

## 3.4 Integration Points

### AssetRegistry Integration
```typescript
// Singleton pattern
const registry = AssetRegistry.getInstance()

// Provider initialization
const registryAssets = registry.getAll()  // Returns RegisteredAsset[]
const initialAssets = registryAssets.map(asset => ({
  id: asset.id,
  name: asset.name,
  category: asset.category,
  loaded: false,
  error: false,
  progress: 0
}))

// AssetLoader integration
const loader = new AssetLoader(
  registry,          // AssetRegistry instance
  debugContext,      // DebugContext for enable/disable
  callbacks          // Progress/phase callbacks
)
```

### DebugContext Integration
```typescript
// Debug panel controls
interface DebugContext {
  enableAsset: (id: string) => void
  disableAsset: (id: string) => void
  getEnabledAssets: () => string[]
  getPerformanceCost: () => number
}

// Used by AssetLoader to respect debug settings
function shouldLoadAsset(assetId: string): boolean {
  if (debugContext) {
    return debugContext.getEnabledAssets().includes(assetId)
  }
  return registry.get(assetId)?.enabled ?? true
}
```

### ThreeScene Integration
```typescript
// ThreeScene wraps content with LoadingProvider
return (
  <LoadingProvider registry={AssetRegistry.getInstance()}>
    <div className="w-full h-full absolute inset-0">
      {!isLoadingComplete && (
        <LoadingScreen
          onComplete={handleLoadingComplete}
          minimumDisplayTime={2000}
          showFPSMonitor={true}
        />
      )}

      <Canvas>
        {/* 3D Scene - renders immediately underneath LoadingScreen */}
        <CameraRig />
        <TennisCourts />
        <GrassSystem />
        <LightingSystem />
      </Canvas>
    </div>
  </LoadingProvider>
)

// Completion handler
const handleLoadingComplete = useCallback(() => {
  console.log('[ThreeScene] Loading complete - showing 3D scene')
  setIsLoadingComplete(true)
}, [])
```

## 3.5 Asset Loading Phases

### Phase Definition & Distribution

```
Phase 1: ESSENTIAL (0-25%) - Core 3D Scene
┌─────────────────────────────────────────┐
│ Priority: 100                           │
│ Assets: 8                               │
│ Performance Cost: 25/200                │
├─────────────────────────────────────────┤
│ - Tennis Court 1-4 (cost: 4 each)      │
│ - Court Lines (cost: 1)                │
│ - Court Nets (cost: 3)                 │
│ - Court Surface (cost: 3)              │
│ - Ambient Light (cost: 1)              │
└─────────────────────────────────────────┘

Phase 2: CORE (25-50%) - Lighting & Building
┌─────────────────────────────────────────┐
│ Priority: 80                            │
│ Assets: 10                              │
│ Performance Cost: 40/200                │
├─────────────────────────────────────────┤
│ - Directional Light (cost: 2)          │
│ - Spot Lights (cost: 5)                │
│ - Dynamic Shadows (cost: 7)            │
│ - HDR Environment (cost: 4)            │
│ - Reception Area (cost: 5)             │
│ - Performance HUD (cost: 1)            │
│ - Player Markers (cost: 2)             │
└─────────────────────────────────────────┘

Phase 3: VISUAL (50-75%) - Grass & Effects
┌─────────────────────────────────────────┐
│ Priority: 60                            │
│ Assets: 12                              │
│ Performance Cost: 60/200                │
├─────────────────────────────────────────┤
│ - Grass Blades (cost: 6)               │
│ - Grass Physics (cost: 5)              │
│ - Robotic Mowers (cost: 7)             │
│ - Growth Visualization (cost: 4)       │
│ - Particle Systems (cost: 5)           │
│ - Post-Processing (cost: 6)            │
│ - Bloom Effects (cost: 4)              │
│ - Wind Effects (cost: 4)               │
│ - Cognitive Lab (cost: 6)              │
│ - BMS Control Room (cost: 5)           │
└─────────────────────────────────────────┘

Phase 4: ENHANCED (75-100%) - Advanced Features
┌─────────────────────────────────────────┐
│ Priority: 40                            │
│ Assets: 10                              │
│ Performance Cost: 75/200                │
├─────────────────────────────────────────┤
│ - Weather Particles (cost: 6) *        │
│ - Volumetric Clouds (cost: 8) *        │
│ - Fog System (cost: 3) *               │
│ - Motion Blur (cost: 5) *              │
│ - Heat Map Overlay (cost: 3) *         │
│ - Transport Pods (cost: 7)             │
│ - Character System (cost: 8)           │
│ - Physics Engine (cost: 6)             │
│                                         │
│ * = Disabled by default                │
└─────────────────────────────────────────┘

Total: 40 assets, 200 performance cost units
```

### Phase Loading Strategy

```typescript
// Parallel loading within each phase
async function loadPhase(phase: LoadingPhase): Promise<PhaseResult> {
  const phaseAssets = getAssetsByPhase(phase)

  // Load all phase assets in parallel
  const results = await Promise.allSettled(
    phaseAssets.map(asset => loadAsset(asset))
  )

  // Calculate phase completion
  const loaded = results.filter(r => r.status === 'fulfilled').length
  const failed = results.filter(r => r.status === 'rejected').length
  const progress = (loaded / phaseAssets.length) * 100

  return {
    phase,
    progress,
    results: results.map((r, i) => ({
      assetId: phaseAssets[i].id,
      success: r.status === 'fulfilled',
      error: r.status === 'rejected' ? r.reason : undefined
    })),
    duration: performanceNow() - phaseStartTime
  }
}

// Sequential phase execution
async function loadAllPhases(): Promise<LoadingResult> {
  for (const phase of [ESSENTIAL, CORE, VISUAL, ENHANCED]) {
    const result = await loadPhase(phase)

    // Update overall progress
    const phaseWeight = getPhaseWeight(phase) // 25% each
    overallProgress += (result.progress / 100) * phaseWeight

    // Notify listeners
    onPhaseComplete(result)

    // Continue even if some assets failed
    if (result.progress < 50) {
      console.warn(`Phase ${phase} only ${result.progress}% complete`)
    }
  }

  return { success: true, duration, assetsLoaded }
}
```

---

# R - REFINEMENT

## 4.1 Performance Optimizations

### 4.1.1 React Rendering Optimizations

**Problem**: LoadingScreen re-renders on every progress update (potentially 100+ times)

**Solution**: Memoize expensive components
```typescript
// Memoize asset list items
const AssetListItem = React.memo(({ asset }: { asset: LoadingAsset }) => {
  return (
    <motion.div>
      {/* Asset display */}
    </motion.div>
  )
}, (prev, next) => {
  // Only re-render if asset state changed
  return (
    prev.asset.loaded === next.asset.loaded &&
    prev.asset.progress === next.asset.progress &&
    prev.asset.error === next.asset.error
  )
})

// Memoize FPS monitor
const FPSMonitor = React.memo(({ fpsData, fpsLevel }: FPSMonitorProps) => {
  return (
    <div>
      {/* FPS display */}
    </div>
  )
}, (prev, next) => {
  // Only re-render if FPS changed significantly
  return Math.abs(prev.fpsData.current - next.fpsData.current) < 2
})
```

**Performance Impact**: 60-70% reduction in render time

### 4.1.2 FPS Monitoring Optimization

**Problem**: FPS calculation runs every frame (60 times/second)

**Solution**: Throttle updates to 1 per second
```typescript
useEffect(() => {
  if (!showFPSMonitor) return

  let frameCount = 0
  let lastTime = performance.now()
  let animationFrameId: number

  const measureFPS = () => {
    const currentTime = performance.now()
    const delta = currentTime - lastTime

    // Only update state once per second
    if (delta >= 1000) {
      const fps = Math.round((frameCount * 1000) / delta)

      // Batch state updates
      setFpsData(prev => ({
        current: fps,
        average: Math.round((prev.average * 29 + fps) / 30), // Rolling average
        min: Math.min(prev.min || fps, fps),
        max: Math.max(prev.max || fps, fps),
        history: [...prev.history.slice(-29), fps]
      }))

      frameCount = 0
      lastTime = currentTime
    }

    frameCount++
    animationFrameId = requestAnimationFrame(measureFPS)
  }

  animationFrameId = requestAnimationFrame(measureFPS)
  return () => cancelAnimationFrame(animationFrameId)
}, [showFPSMonitor])
```

**Performance Impact**: < 0.1ms overhead per frame

### 4.1.3 Asset Loading Parallelization

**Problem**: Loading 40+ assets sequentially is slow

**Solution**: Parallel loading within phases
```typescript
async function loadPhase(phase: LoadingPhase): Promise<PhaseResult> {
  const assets = getAssetsByPhase(phase)
  const batchSize = 5 // Load 5 assets simultaneously

  const results: AssetLoadResult[] = []

  // Process in batches to avoid overwhelming the system
  for (let i = 0; i < assets.length; i += batchSize) {
    const batch = assets.slice(i, i + batchSize)

    const batchResults = await Promise.allSettled(
      batch.map(asset => loadAsset(asset))
    )

    results.push(...batchResults.map((r, idx) => ({
      assetId: batch[idx].id,
      success: r.status === 'fulfilled',
      error: r.status === 'rejected' ? r.reason : undefined
    })))

    // Update progress after each batch
    const progress = (results.length / assets.length) * 100
    onProgress({ phase, progress })
  }

  return { phase, results }
}
```

**Performance Impact**: 3-5x faster loading

### 4.1.4 Memory Management

**Problem**: Asset history and logs accumulate indefinitely

**Solution**: Cap history size and cleanup
```typescript
// Limit FPS history to 30 samples (30 seconds)
const MAX_FPS_HISTORY = 30

setFpsData(prev => ({
  ...prev,
  history: [...prev.history, fps].slice(-MAX_FPS_HISTORY)
}))

// Cleanup on unmount
useEffect(() => {
  return () => {
    // Clear large objects
    setAssets([])
    setFpsData({ current: 0, average: 0, min: 0, max: 0, history: [] })

    // Cancel any pending timers
    clearAllTimers()
  }
}, [])
```

**Performance Impact**: Stable memory usage < 50 MB

## 4.2 Edge Cases & Error Handling

### 4.2.1 Empty Asset Registry

**Edge Case**: AssetRegistry returns 0 assets

**Current Behavior**: Loading screen stuck (totalCount = 0, isLoading never false)

**Solution**: Auto-complete when no assets
```typescript
useEffect(() => {
  const registryAssets = registry.getAll()

  // CRITICAL FIX: Handle empty registry
  if (registryAssets.length === 0) {
    console.warn('[LoadingProvider] No assets in registry - skipping loading')
    setIsLoading(false)
    setOverallProgress(100)

    // Immediately signal completion
    if (onComplete) {
      setTimeout(onComplete, minimumDisplayTime)
    }
    return
  }

  // Normal initialization
  const initialAssets = registryAssets.map(...)
  setAssets(initialAssets)
  setTotalCount(initialAssets.length)
}, [registry])
```

### 4.2.2 AssetLoader Never Completes

**Edge Case**: AssetLoader.start() throws error or hangs

**Current Behavior**: Loading screen stuck forever

**Solution**: Timeout failsafe + error recovery
```typescript
async function startLoading() {
  isLoading = true

  try {
    // Race between loading and timeout
    const result = await Promise.race([
      loader.start(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Loading timeout')), 10000)
      )
    ])

    console.log('Loading complete:', result)

  } catch (error) {
    console.error('Loading failed:', error)

    // Show error UI
    setShowErrorUI(true)

    // Allow user to continue anyway
    setTimeout(() => {
      if (onComplete) onComplete()
    }, 2000)

  } finally {
    // ALWAYS set isLoading = false
    setIsLoading(false)
  }
}
```

### 4.2.3 Asset Load Failures

**Edge Case**: Individual assets fail to load (network error, 404, etc.)

**Current Behavior**: Phase stalls waiting for failed asset

**Solution**: Continue with partial success
```typescript
async function loadAsset(asset: AssetDefinition): Promise<AssetLoadResult> {
  const maxRetries = 3
  let attempt = 0

  while (attempt < maxRetries) {
    try {
      // Attempt to load asset
      await actualLoadAsset(asset)
      return { success: true, assetId: asset.id }

    } catch (error) {
      attempt++

      if (attempt >= maxRetries) {
        // Mark as failed but don't block
        console.error(`Asset ${asset.id} failed after ${maxRetries} attempts:`, error)
        return {
          success: false,
          assetId: asset.id,
          error: error.message
        }
      }

      // Exponential backoff
      await new Promise(resolve =>
        setTimeout(resolve, 100 * Math.pow(2, attempt))
      )
    }
  }
}
```

### 4.2.4 Race Conditions

**Edge Case**: Multiple state updates in quick succession

**Current Behavior**: React batches updates unpredictably, may cause skipped updates

**Solution**: Use functional state updates
```typescript
// ❌ BAD: Direct state mutation (race condition)
setLoadedCount(loadedCount + 1)

// ✅ GOOD: Functional update (always correct)
setLoadedCount(prev => prev + 1)

// ❌ BAD: Dependent updates (race condition)
setOverallProgress(calculateProgress(loadedCount, totalCount))

// ✅ GOOD: Combined update (atomic)
setLoadedCount(prev => {
  const newCount = prev + 1
  setOverallProgress((newCount / totalCount) * 100)
  return newCount
})
```

### 4.2.5 Memory Leaks

**Edge Case**: Component unmounts before loading completes

**Current Behavior**: Timers and callbacks still fire, causing errors

**Solution**: Cleanup pattern
```typescript
useEffect(() => {
  let isMounted = true
  const timers: NodeJS.Timeout[] = []

  async function load() {
    const result = await loader.start()

    // Check if still mounted before updating state
    if (isMounted) {
      setIsLoading(false)
    }
  }

  load()

  // Cleanup function
  return () => {
    isMounted = false
    timers.forEach(clearTimeout)
    loader.cancel()
  }
}, [])
```

### 4.2.6 Browser Tab Visibility

**Edge Case**: User switches tabs during loading

**Current Behavior**: Loading continues but FPS drops, may trigger false recommendations

**Solution**: Pause FPS monitoring when tab hidden
```typescript
useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.hidden) {
      // Pause FPS monitoring
      setFpsPaused(true)
    } else {
      // Resume FPS monitoring
      setFpsPaused(false)
    }
  }

  document.addEventListener('visibilitychange', handleVisibilityChange)

  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  }
}, [])
```

## 4.3 Testing Strategy

### 4.3.1 Unit Tests (80% Coverage Target)

**LoadingProvider Tests**
```typescript
describe('LoadingProvider', () => {
  it('initializes with assets from registry')
  it('starts loading automatically when autoStart=true')
  it('handles empty registry gracefully')
  it('updates progress on asset load')
  it('sets isLoading=false when complete')
  it('calls onComplete after minimum display time')
  it('cleans up on unmount')
})
```

**LoadingScreen Tests**
```typescript
describe('LoadingScreen', () => {
  it('renders loading spinner and progress')
  it('shows FPS monitor when enabled')
  it('displays asset list with progress bars')
  it('shows milestone celebrations at 25%, 50%, 75%, 100%')
  it('shows recommendations when FPS < 40')
  it('calls onComplete when conditions met')
  it('bypasses in test mode')
  it('times out after 10 seconds')
  it('handles error state gracefully')
})
```

**AssetLoader Tests**
```typescript
describe('AssetLoader', () => {
  it('loads assets in correct phase order')
  it('loads assets in parallel within phase')
  it('handles asset load failures')
  it('retries failed assets up to 3 times')
  it('sets state to COMPLETED when done')
  it('calls setIsLoading(false) on completion')
  it('respects debug context settings')
  it('enforces dependency loading order')
})
```

### 4.3.2 Integration Tests

**End-to-End Loading Flow**
```typescript
describe('Loading Flow Integration', () => {
  it('completes full loading cycle', async () => {
    render(<App />)

    // Navigate to 3D demo
    fireEvent.click(screen.getByText('Explore 3D Demo'))

    // Loading screen appears
    expect(screen.getByTestId('loading-screen')).toBeInTheDocument()

    // Progress increases
    await waitFor(() => {
      expect(screen.getByTestId('loading-progress')).toHaveTextContent('50%')
    }, { timeout: 5000 })

    // Loading completes
    await waitFor(() => {
      expect(screen.queryByTestId('loading-screen')).not.toBeInTheDocument()
    }, { timeout: 10000 })

    // 3D scene visible
    expect(screen.getByTestId('three-scene')).toBeInTheDocument()
  })

  it('recovers from asset load failures', async () => {
    // Mock asset load failures
    mockAssetLoader.mockImplementation(() => {
      throw new Error('Network error')
    })

    render(<App />)
    fireEvent.click(screen.getByText('Explore 3D Demo'))

    // Still completes after timeout
    await waitFor(() => {
      expect(screen.queryByTestId('loading-screen')).not.toBeInTheDocument()
    }, { timeout: 15000 })
  })
})
```

### 4.3.3 Performance Tests

**Rendering Performance**
```typescript
describe('LoadingScreen Performance', () => {
  it('renders in < 16ms (60 FPS)', () => {
    const startTime = performance.now()
    render(<LoadingScreen />)
    const renderTime = performance.now() - startTime

    expect(renderTime).toBeLessThan(16)
  })

  it('FPS monitoring overhead < 2ms per frame', () => {
    const { rerender } = render(<LoadingScreen showFPSMonitor />)

    const frameStart = performance.now()
    // Simulate 100 frames
    for (let i = 0; i < 100; i++) {
      rerender(<LoadingScreen showFPSMonitor />)
    }
    const avgFrameTime = (performance.now() - frameStart) / 100

    expect(avgFrameTime).toBeLessThan(2)
  })
})
```

### 4.3.4 Accessibility Tests

**Keyboard Navigation**
```typescript
describe('LoadingScreen Accessibility', () => {
  it('supports keyboard navigation', () => {
    render(<LoadingScreen />)

    // Tab to recommendation button
    userEvent.tab()
    expect(screen.getByRole('button', { name: /switch quality/i })).toHaveFocus()

    // Enter activates
    userEvent.keyboard('{Enter}')
    expect(mockOnQualityChange).toHaveBeenCalled()
  })

  it('announces progress to screen readers', () => {
    render(<LoadingScreen />)

    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '50')
    expect(progressBar).toHaveAttribute('aria-valuemin', '0')
    expect(progressBar).toHaveAttribute('aria-valuemax', '100')
  })
})
```

## 4.4 Migration Path

### Phase 1: Critical Fixes (Immediate)
```
Day 1-2: Fix state synchronization
├── Add setIsLoading(false) to AssetLoader completion
├── Fix LoadingProvider callback wiring
├── Add empty registry fallback
└── Verify timeout failsafe works

Tests:
├── Unit tests for state transitions
├── Integration test for full loading cycle
└── Manual testing in dev environment
```

### Phase 2: Robustness (Short-term)
```
Day 3-5: Error handling & edge cases
├── Implement retry logic for failed assets
├── Add error UI for timeout/failures
├── Fix race conditions with functional updates
├── Add cleanup for memory leaks
└── Implement tab visibility handling

Tests:
├── Unit tests for error scenarios
├── Integration tests for partial failures
└── Performance tests for memory usage
```

### Phase 3: Optimization (Medium-term)
```
Week 2: Performance improvements
├── Memoize expensive components
├── Optimize FPS monitoring
├── Implement parallel asset loading
├── Add loading phase batching
└── Optimize React rendering

Tests:
├── Performance benchmarks
├── Memory profiling
└── Frame rate monitoring
```

### Phase 4: Polish (Long-term)
```
Week 3-4: UX improvements
├── Enhanced milestone animations
├── Better quality recommendations
├── Loading tips/messages
├── Progress prediction
└── Advanced analytics

Tests:
├── Visual regression tests
├── User acceptance testing
└── Accessibility audit
```

---

# C - COMPLETION

## 5.1 Implementation Checklist

### ✅ Phase 1: Critical Fixes (2 days)

**Day 1: State Synchronization**
- [ ] Fix AssetLoader.start() to call `setIsLoading(false)` on completion
- [ ] Verify LoadingProvider receives state update
- [ ] Add functional state updates throughout
- [ ] Test loading completion flow end-to-end
- [ ] Add comprehensive logging for debugging

**Day 2: Edge Cases**
- [ ] Implement empty registry fallback
- [ ] Verify timeout failsafe (10 seconds)
- [ ] Add error UI for failures
- [ ] Test development bypass modes
- [ ] Manual QA in staging environment

### ✅ Phase 2: Robustness (3 days)

**Day 3: Error Handling**
- [ ] Implement asset retry logic (3 attempts)
- [ ] Add exponential backoff
- [ ] Handle network failures gracefully
- [ ] Log errors to monitoring service
- [ ] Test with simulated failures

**Day 4: Memory & Performance**
- [ ] Fix memory leaks (cleanup on unmount)
- [ ] Cap history sizes
- [ ] Add tab visibility handling
- [ ] Optimize state updates
- [ ] Profile memory usage

**Day 5: Testing**
- [ ] Write unit tests (80% coverage)
- [ ] Write integration tests
- [ ] Add performance tests
- [ ] Accessibility tests
- [ ] Visual regression tests

### ✅ Phase 3: Optimization (5 days)

**Week 2: Performance**
- [ ] Memoize AssetListItem component
- [ ] Memoize FPSMonitor component
- [ ] Optimize FPS calculation
- [ ] Implement parallel asset loading
- [ ] Batch progress updates
- [ ] Profile and optimize renders
- [ ] Benchmark before/after

### ✅ Phase 4: Polish (7 days)

**Week 3-4: UX Enhancements**
- [ ] Enhanced milestone animations
- [ ] Loading tips carousel
- [ ] Progress time estimation
- [ ] Better error messages
- [ ] Quality recommendation tuning
- [ ] Analytics integration
- [ ] User acceptance testing

## 5.2 Validation Criteria

### Functional Validation

**✓ Asset Loading**
- All 40+ assets load successfully
- Progress updates smoothly (0% → 100%)
- Phase transitions occur correctly
- Failed assets don't block completion

**✓ Loading Screen**
- Appears within 100ms of navigation
- Shows accurate progress percentage
- Displays individual asset status
- FPS monitor updates every second
- Recommendations appear when FPS < 40

**✓ Completion**
- Loading completes within 5 seconds (typical)
- Times out after 10 seconds (maximum)
- `onComplete()` callback fires correctly
- 3D scene visible after completion
- No infinite loading states

### Performance Validation

**✓ Rendering**
- Initial render < 16ms (60 FPS)
- No frame drops during loading
- Smooth animations throughout
- Memory usage < 50 MB
- CPU usage < 10%

**✓ Loading Speed**
- Essential phase: < 1 second
- Core phase: < 2 seconds
- Visual phase: < 3 seconds
- Enhanced phase: < 4 seconds
- Total: < 5 seconds typical

### Reliability Validation

**✓ Error Handling**
- Graceful degradation on asset failures
- Timeout failsafe always works
- No blocking states possible
- Clear error messages shown
- Retry logic succeeds

**✓ Edge Cases**
- Empty registry handled
- Network failures handled
- Tab switching handled
- Component unmounting handled
- Multiple instances handled

### Accessibility Validation

**✓ WCAG 2.1 AA**
- Keyboard navigation complete
- Screen reader compatible
- ARIA labels correct
- Color contrast sufficient
- Reduced motion supported

## 5.3 Rollback Plan

### If Critical Issues Arise

**Immediate Rollback (< 5 minutes)**
```bash
# Revert to last stable commit
git revert HEAD --no-edit
git push origin main

# Re-deploy previous version
npm run deploy:rollback
```

**Partial Rollback (< 15 minutes)**
```bash
# Keep improvements, revert problematic features
git revert <commit-hash> --no-edit

# Or: Feature flag disable
localStorage.setItem('loading-screen-v2', 'false')
```

**Progressive Rollback (< 30 minutes)**
```bash
# Database rollback (if state schema changed)
npm run migrate:rollback

# Asset registry rollback
cp backup/assetRegistry.ts src/utils/debug/

# Redeploy
npm run deploy
```

### Rollback Triggers

**Automatic Rollback**
- Error rate > 5% in production
- Loading timeout rate > 10%
- Client crash rate > 1%
- Performance degradation > 20%

**Manual Rollback**
- User complaints > threshold
- Critical bug discovered
- Security vulnerability found
- Data integrity issues

### Post-Rollback Actions

1. **Incident Report**
   - Document what went wrong
   - Root cause analysis
   - Timeline of events
   - Impact assessment

2. **Fix & Retest**
   - Reproduce issue locally
   - Implement fix
   - Comprehensive testing
   - Staged rollout

3. **Communication**
   - Notify stakeholders
   - Update status page
   - Post-mortem meeting
   - Documentation update

---

## Appendix A: ASCII Diagrams

### State Machine Diagram
```
                    IDLE
                     │
                     ▼
              INITIALIZING
                     │
                     ▼
    ┌────────────  LOADING  ─────────────┐
    │                │                    │
    │                │                    │
    │        (all assets loaded)    (timeout/error)
    │                │                    │
    │                ▼                    ▼
    │            COMPLETED              FAILED
    │                │                    │
    │                ├────────────────────┤
    │                │                    │
    │                ▼                    │
    │       setIsLoading(false)           │
    │                │                    │
    │                ▼                    │
    └──────→  onComplete() ◄──────────────┘
```

### Component Interaction Sequence
```
User                App            LoadingProvider    AssetLoader     LoadingScreen
 │                   │                   │                │                │
 │ Click "3D Demo"   │                   │                │                │
 ├──────────────────►│                   │                │                │
 │                   │ Mount             │                │                │
 │                   ├──────────────────►│                │                │
 │                   │                   │ Initialize     │                │
 │                   │                   ├───────────────►│                │
 │                   │                   │                │ Show Overlay   │
 │                   │                   │                ├───────────────►│
 │                   │                   │ start()        │                │
 │                   │                   ├───────────────►│                │
 │                   │                   │                │                │
 │                   │                   │ onProgress()   │                │
 │                   │                   │◄───────────────┤                │
 │                   │                   │                │ Update UI      │
 │                   │                   │                ├───────────────►│
 │                   │                   │                │                │
 │                   │                   │ COMPLETED      │                │
 │                   │                   │ setLoading()   │                │
 │                   │                   │◄───────────────┤                │
 │                   │                   │                │                │
 │                   │                   │                │ onComplete()   │
 │                   │                   │                │◄───────────────┤
 │                   │ Show 3D Scene     │                │                │
 │                   │◄──────────────────┤                │                │
 │ View 3D Scene     │                   │                │ Hide Overlay   │
 │◄──────────────────┤                   │                ├───────────────►│
```

---

## Appendix B: Performance Benchmarks

### Target Metrics
| Metric | Target | Acceptable | Unacceptable |
|--------|--------|------------|--------------|
| Initial Render | < 16ms | < 33ms | > 33ms |
| Loading Duration | < 5s | < 8s | > 10s |
| FPS Overhead | < 1ms | < 2ms | > 5ms |
| Memory Usage | < 30 MB | < 50 MB | > 75 MB |
| CPU Usage | < 5% | < 10% | > 15% |
| Bundle Size | < 15 KB | < 25 KB | > 40 KB |

### Optimization Priorities
1. **Critical**: Initial render time (affects perceived performance)
2. **High**: Loading duration (user waiting time)
3. **Medium**: FPS overhead (ongoing performance)
4. **Low**: Bundle size (one-time cost)

---

## Appendix C: Glossary

**AssetRegistry**: Singleton managing all 3D asset definitions and enabled states

**AssetLoader**: Service orchestrating progressive asset loading across phases

**LoadingProvider**: React Context providing loading state to child components

**LoadingScreen**: Visual overlay component showing progress and FPS monitoring

**LoadingPhase**: One of four loading stages (Essential, Core, Visual, Enhanced)

**LoadingState**: State machine state (Idle, Initializing, Loading, Completed, Failed)

**FPS Level**: Performance classification (Excellent, Good, Fair, Poor)

**Milestone**: Progress percentage marker triggering celebrations (25%, 50%, 75%, 100%)

**Quality Mode**: Rendering quality setting (High, Medium, Low, Auto)

**Performance Cost**: Numerical estimate of asset's GPU/CPU impact (1-10 scale)

---

**Document Version**: 1.0
**Last Updated**: 2025-11-23
**Next Review**: After Phase 1 implementation
**Maintained By**: System Architecture Team
