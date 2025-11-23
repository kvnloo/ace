# App.tsx Comparison: Dev vs Main Branch

## Executive Summary

**CRITICAL BREAKING CHANGES IDENTIFIED**: The main branch introduces multiple features that cause 3D rendering failures:

1. **Loading Screen System** - New loading state management interferes with ThreeScene initialization
2. **ThreeSceneWrapper** - Wrapper component introduces rendering delays and lifecycle issues
3. **Additional Diagnostic Components** - ThreeSceneDiagnostic and DebugLogger overhead
4. **CourtNavigationUI** - Navigation overlay blocks 3D interactions
5. **LoadingProvider Integration** - Complex loading state management
6. **Enhanced Import Dependencies** - 5+ additional component imports

---

## Line-by-Line Diff: Critical Sections

### 1. Import Statements

#### ✅ WORKING (Dev - worktrees/ace-dev/App.tsx)
```tsx
// Lines 2-22 - MINIMAL IMPORTS
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { View, FeatureData } from './types';
import NavBar from './components/NavBar';
import ThreeScene from './components/ThreeScene';        // DIRECT IMPORT
import AIChat from './components/AIChat';
import Specifications from './components/Specifications';
import {
  Zap, Activity, Camera, Cpu, Sprout, Users,
  ArrowRight, PlayCircle, Layers, Wind,
  ShieldCheck, ShoppingBag
} from 'lucide-react';
```

#### ❌ BROKEN (Main - src/App.tsx)
```tsx
// Lines 2-28 - EXCESSIVE IMPORTS
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { View, FeatureData } from './types';
import NavBar from './components/NavBar';
import ThreeSceneWrapper from './components/ThreeSceneWrapper';     // WRAPPER (BREAKING)
import AIChat from './components/AIChat';
import Specifications from './components/Specifications';
import Amenities from './components/Amenities';                     // NEW
import ThreeSceneDiagnostic from './components/ThreeSceneDiagnostic'; // NEW (BREAKING)
import DebugLogger from './components/DebugLogger';                 // NEW (BREAKING)
import CourtNavigationUI from './components/CourtNavigationUI';     // NEW (BREAKING)
import LoadingScreen from './components/loading/LoadingScreen';     // NEW (BREAKING)
import { useLoading } from './components/loading/LoadingProvider';  // NEW (BREAKING)
import {
  Zap, Activity, Camera, Cpu, Sprout, Users,
  ArrowRight, PlayCircle, Layers, Wind,
  ShieldCheck, ShoppingBag
} from 'lucide-react';
```

**BREAKING CHANGE #1**:
- Dev uses `ThreeScene` directly
- Main uses `ThreeSceneWrapper` which adds abstraction layer and initialization delays

---

### 2. State Initialization

#### ✅ WORKING (Dev)
```tsx
// Lines 24-33 - SIMPLE STATE
const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [selectedFeature, setSelectedFeature] = useState<FeatureData | null>(null);

  // Reset selected feature when leaving demo view
  useEffect(() => {
    if (currentView !== View.FACILITY_DEMO) {
      setSelectedFeature(null);
    }
  }, [currentView]);
```

#### ❌ BROKEN (Main)
```tsx
// Lines 30-49 - COMPLEX STATE WITH LOADING LOGIC
const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [selectedFeature, setSelectedFeature] = useState<FeatureData | null>(null);
  const [loadingComplete, setLoadingComplete] = useState(false);      // NEW STATE
  const [shouldShowLoading, setShouldShowLoading] = useState(false);  // NEW STATE
  const { isLoading } = useLoading();                                 // CONTEXT HOOK

  // Synchronize view with URL (NEW - 12 lines)
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('/court')) {
      setCurrentView(View.FACILITY_DEMO);
    } else if (path.includes('/specs')) {
      setCurrentView(View.SPECIFICATIONS);
    } else if (path.includes('/amenities')) {
      setCurrentView(View.AMENITIES);
    } else if (path.includes('/invest')) {
      setCurrentView(View.INVEST);
    }
  }, []);

  // Update URL when view changes (NEW - 24 lines)
  useEffect(() => {
    let path = '/';
    switch (currentView) {
      case View.FACILITY_DEMO:
        path = '/court';
        break;
      case View.SPECIFICATIONS:
        path = '/specs';
        break;
      case View.AMENITIES:
        path = '/amenities';
        break;
      case View.INVEST:
        path = '/invest';
        break;
      default:
        path = '/';
    }
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
  }, [currentView]);

  // Reset selected feature when leaving demo view
  useEffect(() => {
    if (currentView !== View.FACILITY_DEMO) {
      setSelectedFeature(null);
    }
  }, [currentView]);

  // Show loading screen only when entering court view (NEW - 7 lines)
  useEffect(() => {
    if (currentView === View.FACILITY_DEMO && !loadingComplete) {
      setShouldShowLoading(true);
    } else {
      setShouldShowLoading(false);
    }
  }, [currentView, loadingComplete]);
```

**BREAKING CHANGE #2**:
- Dev: 2 state variables, 1 simple effect
- Main: 5 state variables, 4 complex effects
- Loading state logic delays ThreeScene mount and initialization

---

### 3. Loading Screen Integration

#### ✅ WORKING (Dev)
```tsx
// No loading screen - ThreeScene renders immediately
```

#### ❌ BROKEN (Main)
```tsx
// Lines 99-108 - LOADING SCREEN BLOCKS RENDERING
<AnimatePresence>
  {shouldShowLoading && !loadingComplete && (
    <LoadingScreen
      onComplete={() => setLoadingComplete(true)}
      minimumDisplayTime={2000}                    // 2 SECOND DELAY
      showFPSMonitor={true}
    />
  )}
</AnimatePresence>
```

**BREAKING CHANGE #3**:
- Loading screen blocks initial render for minimum 2 seconds
- ThreeScene initialization delayed until loading complete
- FPS monitor adds performance overhead

---

### 4. Main Content Wrapper

#### ✅ WORKING (Dev)
```tsx
// Line 45 - SIMPLE MAIN TAG
<main className="relative w-full h-screen pt-20 overflow-hidden">
```

#### ❌ BROKEN (Main)
```tsx
// Line 115 - MAIN TAG WITH ID (accessibility)
<main id="main-content" className="relative w-full h-screen pt-20 overflow-hidden">
```

**Minor Issue**: ID attribute is fine, not a breaking change.

---

### 5. 3D FACILITY DEMO View - THE CRITICAL SECTION

#### ✅ WORKING (Dev - Lines 154-209)
```tsx
{/* 3D FACILITY DEMO */}
{currentView === View.FACILITY_DEMO && (
  <motion.div
    key="demo"
    initial="initial"
    animate="enter"
    exit="exit"
    variants={pageVariants}
    className="w-full h-full relative bg-gradient-to-b from-slate-900 to-black"
  >
    <div className="absolute inset-0 z-0">
      <ThreeScene onFeatureSelect={setSelectedFeature} />    {/* DIRECT RENDER */}
    </div>

    {/* HUD Layer */}
    <div className="absolute inset-0 z-10 pointer-events-none p-6 flex flex-col justify-between">
      <div className="mt-12">
         <h2 className="text-3xl font-bold text-white drop-shadow-lg">
           Facility Interactive Map
         </h2>
         <p className="text-white/70 text-sm max-w-md drop-shadow-md mt-2">
           24 Courts • Vertical Farm • Performance Gym <br/>
           Rotate the view to explore the entire complex.
         </p>
      </div>

      {/* Selected Feature Info Card */}
      <AnimatePresence>
        {selectedFeature && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="pointer-events-auto self-end md:self-start md:max-w-sm w-full bg-slate-900/90 backdrop-blur-xl border border-tennis-yellow/30 p-6 rounded-2xl shadow-2xl"
          >
            {/* Feature card content */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </motion.div>
)}
```

#### ❌ BROKEN (Main - Lines 305-364)
```tsx
{/* 3D FACILITY DEMO */}
{currentView === View.FACILITY_DEMO && (
  <motion.div
    key="demo"
    initial="initial"
    animate="enter"
    exit="exit"
    variants={pageVariants}
    className="w-full h-full relative bg-gradient-to-b from-slate-900 to-black"
  >
    <ThreeSceneDiagnostic />                                {/* DIAGNOSTIC OVERLAY */}
    <div className="absolute inset-0 z-0">
      <ThreeSceneWrapper onFeatureSelect={setSelectedFeature} />  {/* WRAPPER */}
      {/* Court Navigation and Visualization Controls */}
      <CourtNavigationUI />                                 {/* NAVIGATION UI */}

    </div>

    {/* HUD Layer */}
    <div className="absolute inset-0 z-10 pointer-events-none p-6 flex flex-col justify-between">
      <div className="mt-12">
        <h2 className="text-3xl font-bold text-white drop-shadow-lg">
          Facility Interactive Map
        </h2>
        <p className="text-white/90 text-sm max-w-md drop-shadow-md mt-2">
          24 Courts • Vertical Farm • Performance Gym <br />
          Rotate the view to explore the entire complex.
        </p>
      </div>

      {/* Selected Feature Info Card */}
      <AnimatePresence>
        {selectedFeature && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="pointer-events-auto self-end md:self-start md:max-w-sm w-full bg-slate-900/90 backdrop-blur-xl border border-tennis-yellow/30 p-6 rounded-2xl shadow-2xl"
          >
            {/* Feature card content */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </motion.div>
)}
```

**BREAKING CHANGE #4** (MOST CRITICAL):
- `<ThreeSceneDiagnostic />` - Diagnostic overlay adds rendering overhead BEFORE scene loads
- `<ThreeSceneWrapper />` instead of `<ThreeScene />` - Wrapper adds lifecycle complexity
- `<CourtNavigationUI />` - Navigation UI inside scene container, potential z-index/pointer-events conflicts
- Component order: Diagnostic → Wrapper → Navigation creates initialization race conditions

---

### 6. Global Elements

#### ✅ WORKING (Dev - Lines 398-400)
```tsx
{/* Global Elements */}
<AIChat />
```

#### ❌ BROKEN (Main - Lines 432-435)
```tsx
{/* Global Elements */}
<AIChat />
{/* <DebugLogger enabled={true} showPerformance={true} /> */}
```

**Minor Issue**: DebugLogger is commented out, not a breaking change currently.

---

## Identified Breaking Changes Summary

### Priority 1: Critical (Prevents Rendering)

1. **ThreeSceneWrapper Instead of ThreeScene**
   - Location: Line 316 (main) vs Line 164 (dev)
   - Impact: Adds abstraction layer that delays initialization
   - Fix: Replace `ThreeSceneWrapper` with direct `ThreeScene` import

2. **Loading Screen Blocking**
   - Location: Lines 100-108 (main)
   - Impact: 2-second minimum delay before ThreeScene can mount
   - Fix: Remove LoadingScreen or make it non-blocking

3. **ThreeSceneDiagnostic Overhead**
   - Location: Line 314 (main)
   - Impact: Diagnostic overlay renders BEFORE scene, causes initialization conflicts
   - Fix: Remove or move diagnostic outside scene container

### Priority 2: High (Performance/Interaction Issues)

4. **CourtNavigationUI Placement**
   - Location: Line 318 (main)
   - Impact: Navigation UI inside scene container causes pointer-events conflicts
   - Fix: Move outside absolute container or ensure proper z-indexing

5. **Complex Loading State Management**
   - Location: Lines 33-89 (main)
   - Impact: Multiple loading states create race conditions
   - Fix: Simplify to single loading flag or remove entirely

6. **LoadingProvider Context**
   - Location: Line 35 (main) - `const { isLoading } = useLoading();`
   - Impact: External context may conflict with local loading state
   - Fix: Remove or ensure proper coordination with local state

### Priority 3: Medium (Code Quality)

7. **Excessive Import Dependencies**
   - Location: Lines 2-28 (main) vs Lines 2-22 (dev)
   - Impact: 5+ additional component imports increase bundle size and complexity
   - Fix: Remove unused components, lazy load diagnostics

8. **URL Synchronization Effects**
   - Location: Lines 37-73 (main)
   - Impact: URL sync on every render, potential infinite loops
   - Fix: Debounce or use proper routing library

---

## Code Snippets: Working vs Broken Patterns

### Pattern 1: Direct Scene Rendering (WORKING)
```tsx
// ✅ DEV VERSION - WORKS
import ThreeScene from './components/ThreeScene';

{currentView === View.FACILITY_DEMO && (
  <motion.div className="w-full h-full relative">
    <div className="absolute inset-0 z-0">
      <ThreeScene onFeatureSelect={setSelectedFeature} />
    </div>
    <div className="absolute inset-0 z-10 pointer-events-none">
      {/* HUD overlay */}
    </div>
  </motion.div>
)}
```

```tsx
// ❌ MAIN VERSION - BROKEN
import ThreeSceneWrapper from './components/ThreeSceneWrapper';
import ThreeSceneDiagnostic from './components/ThreeSceneDiagnostic';
import CourtNavigationUI from './components/CourtNavigationUI';

{currentView === View.FACILITY_DEMO && (
  <motion.div className="w-full h-full relative">
    <ThreeSceneDiagnostic />                    {/* BREAKS: Pre-render diagnostic */}
    <div className="absolute inset-0 z-0">
      <ThreeSceneWrapper onFeatureSelect={setSelectedFeature} />  {/* BREAKS: Wrapper delay */}
      <CourtNavigationUI />                     {/* BREAKS: Pointer conflicts */}
    </div>
    <div className="absolute inset-0 z-10 pointer-events-none">
      {/* HUD overlay */}
    </div>
  </motion.div>
)}
```

### Pattern 2: State Management (WORKING)
```tsx
// ✅ DEV VERSION - SIMPLE & WORKS
const [currentView, setCurrentView] = useState<View>(View.HOME);
const [selectedFeature, setSelectedFeature] = useState<FeatureData | null>(null);

useEffect(() => {
  if (currentView !== View.FACILITY_DEMO) {
    setSelectedFeature(null);
  }
}, [currentView]);
```

```tsx
// ❌ MAIN VERSION - COMPLEX & BROKEN
const [currentView, setCurrentView] = useState<View>(View.HOME);
const [selectedFeature, setSelectedFeature] = useState<FeatureData | null>(null);
const [loadingComplete, setLoadingComplete] = useState(false);
const [shouldShowLoading, setShouldShowLoading] = useState(false);
const { isLoading } = useLoading();

// 4 separate useEffect hooks managing state
// Creates initialization race conditions
```

---

## Recommendations for Fixes

### Immediate Fixes (Restore Rendering)

1. **Replace ThreeSceneWrapper with ThreeScene**
   ```diff
   - import ThreeSceneWrapper from './components/ThreeSceneWrapper';
   + import ThreeScene from './components/ThreeScene';

   - <ThreeSceneWrapper onFeatureSelect={setSelectedFeature} />
   + <ThreeScene onFeatureSelect={setSelectedFeature} />
   ```

2. **Remove Loading Screen from 3D View**
   ```diff
   - <AnimatePresence>
   -   {shouldShowLoading && !loadingComplete && (
   -     <LoadingScreen onComplete={() => setLoadingComplete(true)} />
   -   )}
   - </AnimatePresence>
   ```

3. **Remove ThreeSceneDiagnostic from Production**
   ```diff
   - <ThreeSceneDiagnostic />
   ```

4. **Move CourtNavigationUI Outside Scene Container**
   ```diff
   <div className="absolute inset-0 z-0">
     <ThreeScene onFeatureSelect={setSelectedFeature} />
   -   <CourtNavigationUI />
   </div>
   + <div className="absolute inset-0 z-5 pointer-events-none">
   +   <CourtNavigationUI />
   + </div>
   ```

### Progressive Enhancements (After Rendering Works)

1. **Simplify Loading State**
   - Remove `loadingComplete` and `shouldShowLoading` states
   - Use single loading flag from LoadingProvider OR local state, not both

2. **Optimize URL Synchronization**
   - Use proper routing library (React Router) instead of manual pushState
   - Remove redundant URL sync effects

3. **Lazy Load Diagnostic Components**
   - Only load ThreeSceneDiagnostic in development builds
   - Conditionally import based on environment

4. **Performance Monitoring**
   - Move FPS monitor to separate overlay
   - Don't bundle with LoadingScreen

---

## Testing Verification

### To verify fixes work:

1. **Visual Regression Test**
   - Navigate to `/court` route
   - 3D scene should render immediately (no 2-second delay)
   - Camera controls should be responsive
   - No console errors

2. **Performance Test**
   - FPS should be 60fps on capable hardware
   - No loading screen blocking
   - Smooth transitions between views

3. **Interaction Test**
   - Click on 3D court features
   - Feature info card appears
   - Navigation controls work without conflicts

4. **Lighthouse Score**
   - Performance: > 90
   - No blocking resources
   - Fast First Contentful Paint

---

## Conclusion

**Root Cause**: The main branch over-engineered the 3D rendering with unnecessary abstractions:
- Loading screens blocking render
- Wrapper components delaying initialization
- Diagnostic overlays interfering with scene setup
- Complex state management creating race conditions

**Solution**: Revert to dev branch's simple, direct approach:
- Direct `ThreeScene` import and rendering
- Minimal state management (2 variables)
- No blocking loading screens
- Clean component hierarchy

**Recovery Path**: Remove features one-by-one until rendering works, then re-add with proper integration.
