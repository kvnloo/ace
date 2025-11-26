# ACE Development Guide

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Modern browser with WebGL 2.0 support

### Installation

```bash
# Clone repository
git clone <repo-url>
cd ace

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Environment

```bash
# Development server (hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Run E2E tests
npm run test:e2e

# Type checking
npm run typecheck

# Linting
npm run lint
```

## Project Structure

```
ace/
├─ public/               # Static assets
├─ src/
│  ├─ components/        # React components
│  │  ├─ debug/         # Debug utilities
│  │  └─ ...
│  ├─ contexts/         # React contexts
│  ├─ hooks/            # Custom hooks
│  ├─ utils/            # Utility functions
│  └─ App.tsx           # Root component
├─ tests/               # E2E tests
├─ docs/                # User documentation
├─ claudedocs/          # LLM/technical documentation
└─ package.json
```

## Development Workflow

### 1. Feature Development

```bash
# Create feature branch
git checkout -b feature/new-court-type

# Make changes
# ... edit files ...

# Test changes
npm run dev
# Manual testing in browser

# Run automated tests
npm test
npm run test:e2e

# Commit
git add .
git commit -m "Add new court type component"
```

### 2. Component Creation

**Template for new 3D components:**

```typescript
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MyComponentProps {
  position?: [number, number, number];
  scale?: number;
}

export function MyComponent({
  position = [0, 0, 0],
  scale = 1
}: MyComponentProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Optimize expensive calculations
  const geometry = useMemo(
    () => new THREE.BoxGeometry(1, 1, 1),
    []
  );

  // Animations (optional)
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <primitive object={geometry} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}
```

### 3. State Management

Use React Context for global state:

```typescript
// contexts/MyContext.tsx
import { createContext, useContext, useState } from 'react';

const MyContext = createContext<MyContextType | undefined>(undefined);

export function MyProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(initialState);

  return (
    <MyContext.Provider value={{ state, setState }}>
      {children}
    </MyContext.Provider>
  );
}

export function useMyContext() {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useMyContext must be used within MyProvider');
  }
  return context;
}
```

## Performance Guidelines

### 1. Instanced Rendering

For many similar objects, use `<InstancedMesh>`:

```typescript
// ❌ BAD: Creates 100 individual meshes
courts.map((court, i) => (
  <mesh key={i} position={court.position}>
    <boxGeometry args={[10, 0.1, 20]} />
    <meshStandardMaterial color="blue" />
  </mesh>
))

// ✅ GOOD: Single instanced mesh
<InstancedMesh count={courts.length}>
  <boxGeometry args={[10, 0.1, 20]} />
  <meshStandardMaterial color="blue" />
</InstancedMesh>
```

### 2. Memoization

Prevent unnecessary recalculations:

```typescript
// ❌ BAD: Recreates geometry every render
function MyComponent() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  return <mesh geometry={geometry} />;
}

// ✅ GOOD: Memoized geometry
function MyComponent() {
  const geometry = useMemo(
    () => new THREE.BoxGeometry(1, 1, 1),
    []
  );
  return <mesh geometry={geometry} />;
}
```

### 3. Asset Loading

Load assets asynchronously with progress tracking:

```typescript
import { useProgress } from '@react-three/drei';

function Loader() {
  const { progress } = useProgress();
  return <div>Loading: {progress}%</div>;
}

function Scene() {
  return (
    <Suspense fallback={<Loader />}>
      <MyHeavyComponent />
    </Suspense>
  );
}
```

## Testing

### Unit Tests (Vitest)

```typescript
// MyComponent.test.tsx
import { render } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders without crashing', () => {
    render(<MyComponent />);
  });

  it('accepts position prop', () => {
    const { container } = render(
      <MyComponent position={[1, 2, 3]} />
    );
    // assertions...
  });
});
```

### E2E Tests (Playwright)

```typescript
// tests/court-rendering.spec.ts
import { test, expect } from '@playwright/test';

test('renders 3D scene', async ({ page }) => {
  await page.goto('/');

  // Wait for canvas
  const canvas = page.locator('canvas');
  await expect(canvas).toBeVisible();

  // Check for specific element
  await expect(page.locator('.debug-panel')).toBeVisible();
});
```

## Debugging

### 1. Three.js Inspector

Install Chrome extension: [Three.js DevTools](https://chrome.google.com/webstore/detail/threejs-developer-tools/ebpnegggocnnhleeicgljbedjkganaek)

### 2. React DevTools Profiler

```bash
# Enable profiler
npm run dev

# Open React DevTools in browser
# Navigate to Profiler tab
```

### 3. Debug Panel

Toggle with `d` key in development mode:

```typescript
// Shows:
- FPS counter
- Draw calls
- Triangle count
- Memory usage
- Grass density (if applicable)
```

### 4. Console Logging

```typescript
// Add debug logging
console.log('[ThreeScene] Initializing:', props);

// Performance timing
console.time('scene-build');
// ... expensive operation ...
console.timeEnd('scene-build');
```

## Code Style

### TypeScript
- Enable strict mode
- Define interfaces for all props
- Avoid `any` type

### React
- Functional components only
- Hooks for state and effects
- Memoization for expensive calculations

### Naming Conventions
- Components: PascalCase (`MyComponent`)
- Files: Same as component (`MyComponent.tsx`)
- Hooks: camelCase with `use` prefix (`useMyHook`)
- Utilities: camelCase (`calculateDistance`)

## Common Patterns

### Conditional Rendering

```typescript
// Environment-specific rendering
{import.meta.env.DEV && <DebugPanel />}

// Feature flags
{showGrass && <GrassAdaptive />}
```

### Error Boundaries

```typescript
import { ErrorBoundary } from 'react-error-boundary';

function App() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <ThreeScene />
    </ErrorBoundary>
  );
}
```

### Lazy Loading

```typescript
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

## Deployment

### Build

```bash
# Production build
npm run build

# Output in dist/
# - Optimized bundles
# - Minified code
# - Source maps
```

### Environment Variables

```bash
# .env.development
VITE_DEBUG_MODE=true

# .env.production
VITE_DEBUG_MODE=false
```

### Performance Checklist

Before deploying:
- [ ] Run production build
- [ ] Test in production mode (`npm run preview`)
- [ ] Check bundle size (`npm run build` output)
- [ ] Verify FPS in production build
- [ ] Test on target devices/browsers
- [ ] Check for console errors
- [ ] Validate accessibility features

## Troubleshooting

### Build Failures

**TypeScript errors:**
```bash
npm run typecheck
# Fix reported errors
```

**Missing dependencies:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Runtime Issues

**Canvas not appearing:**
- Check browser WebGL support
- Verify `ThreeScene` is mounted
- Check console for errors

**Low FPS:**
- Reduce instance counts
- Check draw calls in debug panel
- Profile with Chrome DevTools

**Assets not loading:**
- Check network tab for failed requests
- Verify file paths in `public/`
- Check CORS headers for remote assets

## Resources

- [Three.js Documentation](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [Vite Guide](https://vitejs.dev/guide/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Getting Help

1. Check existing documentation in `claudedocs/`
2. Search closed issues in repository
3. Ask in project discussions
4. Create detailed issue with reproduction steps
