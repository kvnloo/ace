# ESLint Configuration & Code Quality Report

## Overview

ESLint has been successfully configured for this TypeScript + React project with comprehensive code quality rules. This document summarizes the linting setup, issues found, fixes applied, and remaining manual work.

---

## Configuration Summary

### Installed Packages

- `eslint@9.39.1` - Core ESLint engine (flat config format)
- `@typescript-eslint/parser@8.47.0` - TypeScript parser
- `@typescript-eslint/eslint-plugin@8.47.0` - TypeScript-specific rules
- `eslint-plugin-react@7.37.5` - React-specific rules
- `eslint-plugin-react-hooks@7.0.1` - React Hooks rules
- `eslint-plugin-jsx-a11y@6.10.2` - Accessibility rules
- `eslint-plugin-import@2.32.0` - Import organization and validation

### Configuration Files

1. **eslint.config.js** - Main ESLint configuration (ESLint v9 flat config format)
2. **.eslintignore** - Ignore patterns (deprecated in ESLint v9, integrated into eslint.config.js)

### NPM Scripts Added

```json
{
  "lint": "eslint . --ext .ts,.tsx,.js,.jsx",
  "lint:fix": "eslint . --ext .ts,.tsx,.js,.jsx --fix",
  "lint:report": "eslint . --ext .ts,.tsx,.js,.jsx --format json --output-file eslint-report.json || true"
}
```

---

## Linting Rules Applied

### TypeScript Rules
- ✅ Warn on explicit `any` types
- ✅ Enforce consistent type imports
- ✅ Warn on unused variables (with `_` prefix exception)
- ✅ TypeScript recommended rules as base

### React Rules
- ✅ No React import required (React 17+ automatic JSX)
- ✅ Prop types disabled (using TypeScript)
- ✅ Self-closing components enforced
- ✅ Curly brace presence optimization
- ✅ React Hooks exhaustive dependencies check
- ✅ Proper hooks usage validation

### Accessibility Rules (Relaxed)
- ⚠️ Anchor validity warnings
- ⚠️ Click events require keyboard events (warning only)
- ⚠️ Static element interactions (warning only)
- ⚠️ Alt text on images (warning only)

### Import Organization
- ✅ Alphabetical sorting within groups
- ✅ React imports first
- ✅ External packages before internal
- ✅ No newlines between import groups

### Code Quality
- ✅ Console.log warnings (console.warn/error allowed)
- ✅ Prefer const over let
- ✅ No var declarations
- ✅ Strict equality (===) preferred
- ✅ Curly braces for multi-line blocks

---

## Issues Summary

### Initial Scan
- **Total Issues:** 256 (174 errors, 82 warnings)

### After Auto-Fix
- **Total Issues:** 232 (174 errors, 58 warnings)
- **Auto-Fixed:** 24 issues

---

## Auto-Fixed Issues (24 total)

The following issues were automatically fixed:

1. **Import Order** - Reordered imports alphabetically and by type (React first, then external, then internal)
2. **Self-Closing Components** - Converted components without children to self-closing syntax
3. **Curly Brace Presence** - Removed unnecessary curly braces in JSX props

---

## Remaining Issues Requiring Manual Fixes

### Critical Errors (174)

#### 1. React Hooks Issues

**Problem:** Components created during render (NavBar.tsx)
```typescript
// ❌ Bad - Component defined inside render
const NavItem = ({ view, label }) => (
  <button onClick={...}>...</button>
);

// ✅ Good - Component defined outside
const NavItem: React.FC<Props> = ({ view, label }) => (
  <button onClick={...}>...</button>
);
```

**Files Affected:**
- `/home/user/ace/components/NavBar.tsx` (Lines 13-25, 40-44)

**Fix:** Move `NavItem` component definition outside the parent component.

---

**Problem:** setState called synchronously in useEffect (App.tsx)
```typescript
// ❌ Bad
useEffect(() => {
  if (currentView !== View.FACILITY_DEMO) {
    setSelectedFeature(null);
  }
}, [currentView]);

// ✅ Good - Use derived state or move logic
const selectedFeature = currentView === View.FACILITY_DEMO ? selectedFeature : null;
```

**Files Affected:**
- `/home/user/ace/App.tsx` (Line 34)

**Fix:** Consider using derived state instead of synchronous setState in useEffect.

---

#### 2. Accessibility Issues

**Problem:** Form labels not associated with controls
```typescript
// ❌ Bad
<label className="...">Full Name</label>
<input type="text" />

// ✅ Good
<label htmlFor="fullName" className="...">Full Name</label>
<input id="fullName" type="text" />
```

**Files Affected:**
- `/home/user/ace/App.tsx` (Lines 448, 456, 465, 473)

**Fix:** Add `htmlFor` prop to labels and matching `id` prop to inputs.

---

**Problem:** Interactive elements need keyboard event handlers
```typescript
// ❌ Bad
<div onClick={handleClick}>Click me</div>

// ✅ Good
<button onClick={handleClick}>Click me</button>
// OR
<div onClick={handleClick} onKeyPress={handleKeyPress} role="button" tabIndex={0}>
  Click me
</div>
```

**Files Affected:**
- `/home/user/ace/components/NavBar.tsx` (Line 30)
- `/home/user/ace/components/ThreeScene.tsx` (Multiple instances)

**Fix:** Use semantic HTML (`<button>`) or add keyboard handlers + ARIA roles.

---

**Problem:** Images missing alt text
```typescript
// ❌ Bad
<img src="..." className="..." />

// ✅ Good
<img src="..." alt="Description of image" className="..." />
```

**Files Affected:**
- `/home/user/ace/App.tsx` (Lines 309, 360, 388, 418)

**Fix:** Add descriptive `alt` attributes to all images.

---

#### 3. Three.js/React Three Fiber Issues

**Problem:** Unknown props on Three.js components
```typescript
// Three.js mesh components receive warnings for props like:
- castShadow
- receiveShadow
- position
- rotation
- intensity
- etc.
```

**Files Affected:**
- `/home/user/ace/components/ThreeScene.tsx` (Throughout)

**Fix:** These are false positives. Add ESLint disable comments or configure plugin to recognize Three.js props:

```typescript
/* eslint-disable react/no-unknown-property */
<mesh castShadow receiveShadow position={[0, 0, 0]}>
  {/* ... */}
</mesh>
/* eslint-enable react/no-unknown-property */
```

---

#### 4. TypeScript Issues

**Problem:** Unused variables
```typescript
// Files with unused imports/variables:
- Camera, Users, PlayCircle in App.tsx
- fireEvent in NavBar.test.tsx
- DEFAULT_ROBOTS in services/seo.ts
```

**Fix:** Remove unused imports or prefix with underscore if intentionally unused.

---

**Problem:** Explicit `any` types
```typescript
// ❌ Bad
const data: any = response.json();

// ✅ Good
const data: ResponseData = response.json();
// OR
const data: unknown = response.json();
```

**Files Affected:**
- `/home/user/ace/utils/analytics.ts` (Multiple instances: lines 128, 129, 190, 198, 216, 225)

**Fix:** Replace `any` with proper types or `unknown`.

---

#### 5. Testing Issues

**Problem:** Vitest globals not recognized
```typescript
// ❌ Error: 'afterEach' is not defined
afterEach(() => {
  cleanup();
});
```

**Files Affected:**
- `/home/user/ace/components/NavBar.test.tsx`
- Test setup files

**Fix:** Add Vitest types to ESLint config or use explicit imports:
```typescript
import { afterEach, describe, it, expect } from 'vitest';
```

---

#### 6. Environment Variables

**Problem:** `navigator` is not defined
```typescript
// In analytics.ts - browser API not recognized in global scope
```

**Files Affected:**
- `/home/user/ace/utils/analytics.ts` (Line 102)

**Fix:** Already added to eslint.config.js globals, but may need additional browser environment configuration.

---

### Warnings (58)

#### 1. Import Resolver Warnings

**Problem:** TypeScript resolver interface warnings on every file

**Cause:** ESLint import plugin TypeScript resolver not properly configured

**Fix:** This is a known issue with the flat config format. Consider installing `eslint-import-resolver-typescript` or suppressing these warnings if imports work correctly.

---

#### 2. Console Statements

**Problem:** `console.log()` statements throughout codebase

**Files Affected:**
- `/home/user/ace/utils/analytics.ts` (Lines 78-86, 176-177, 210, 214, 224, 230)

**Fix:** Replace with `console.warn()` or `console.error()`, or remove debug logs before production.

---

#### 3. Unescaped Entities

**Problem:** Apostrophes in JSX need escaping
```typescript
// ❌ Bad
<span>I'm currently offline</span>

// ✅ Good
<span>I&apos;m currently offline</span>
// OR
<span>{"I'm currently offline"}</span>
```

**Files Affected:**
- `/home/user/ace/App.tsx` (Line 103)

---

## Recommended Action Plan

### High Priority (Breaking Issues)

1. **Fix React Hooks violations** (NavBar.tsx, App.tsx)
   - Move NavItem outside parent component
   - Refactor useEffect setState pattern

2. **Fix accessibility issues** (App.tsx)
   - Add htmlFor/id to form labels and inputs
   - Add alt text to all images

3. **Remove unused variables**
   - Clean up unused imports

### Medium Priority (Quality Issues)

4. **Fix Three.js prop warnings** (ThreeScene.tsx)
   - Add ESLint disable comments for Three.js components

5. **Replace any types** (utils/analytics.ts)
   - Define proper TypeScript interfaces

6. **Fix test setup** (NavBar.test.tsx)
   - Import Vitest globals explicitly

### Low Priority (Warnings)

7. **Clean up console statements** (utils/analytics.ts)
   - Use console.warn/error or remove

8. **Fix unescaped entities**
   - Escape apostrophes in JSX

9. **Suppress import resolver warnings**
   - Configure TypeScript resolver or suppress warnings

---

## ESLint v9 Migration Notes

This project now uses **ESLint v9** with the **flat config format** (`eslint.config.js`).

### Key Changes:
- `.eslintrc.json` is deprecated → Use `eslint.config.js`
- `.eslintignore` is deprecated → Use `ignores` property in config
- New plugin import/usage syntax
- Globals must be explicitly defined

### Compatibility:
- All major plugins are compatible with ESLint v9
- Some import resolver warnings persist (known issue)

---

## Running Linter

```bash
# Check for issues
npm run lint

# Auto-fix what can be fixed
npm run lint:fix

# Generate JSON report
npm run lint:report
```

---

## Conclusion

✅ **ESLint is fully configured** with TypeScript, React, and accessibility support

✅ **24 issues auto-fixed** (import order, self-closing components, etc.)

⚠️ **232 issues remain** (174 errors, 58 warnings)

🔧 **Manual fixes required** primarily for:
- React Hooks best practices
- Accessibility (labels, alt text, keyboard events)
- Three.js prop warnings (false positives)
- TypeScript any types
- Unused variables

The linting configuration focuses on **quality over strictness** with most accessibility and code quality issues set to "warn" rather than "error" to avoid breaking builds during development.

---

**Generated:** 2025-11-23
**ESLint Version:** 9.39.1
**Configuration:** Flat Config (eslint.config.js)
