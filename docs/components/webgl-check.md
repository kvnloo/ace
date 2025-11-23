# WebGL Check Utility

## Overview
Comprehensive WebGL capability detection and validation system. Provides detailed information about browser WebGL support, hardware capabilities, and compatibility checks for Three.js rendering.

## Location
- **Path**: `/src/utils/webglCheck.ts`
- **Category**: Utility / System Check
- **Type**: Utility Module (not a React component)

## Exported Functions

### `checkWebGLSupport()`
Performs comprehensive WebGL capability detection.

**Returns**: `WebGLCapabilities` object
```typescript
interface WebGLCapabilities {
  supported: boolean;
  version: '1.0' | '2.0' | null;
  renderer: string | null;
  vendor: string | null;
  maxTextureSize: number | null;
  maxVertexUniforms: number | null;
  extensions: string[];
  error: string | null;
}
```

### `hasWebGLSupport()`
Quick boolean check for WebGL availability.

**Returns**: `boolean`
```typescript
const isSupported = hasWebGLSupport();
```

### `meetsMinimumRequirements()`
Validates if WebGL meets minimum Three.js requirements.

**Returns**: `{ meets: boolean; reason?: string }`
```typescript
const validation = meetsMinimumRequirements();
if (!validation.meets) {
  console.error(validation.reason);
}
```

### `getWebGLErrorMessage()`
Generates user-friendly error message for WebGL issues.

**Returns**: `string` - Human-readable error description
```typescript
const errorMsg = getWebGLErrorMessage();
// "WebGL is not available on your browser..."
```

## WebGL Capabilities Detected

### Version Detection
- **WebGL 2.0** - Preferred, modern features
- **WebGL 1.0** - Fallback for older browsers
- **experimental-webgl** - Legacy compatibility

### Hardware Information
- **Renderer** - GPU model (via WEBGL_debug_renderer_info)
- **Vendor** - GPU manufacturer
- **Max Texture Size** - Maximum texture dimensions
- **Max Vertex Uniforms** - Shader uniform capacity
- **Extensions** - List of all supported WebGL extensions

### Minimum Requirements
| Requirement | Minimum Value | Purpose |
|-------------|---------------|---------|
| Texture Size | 2048 | Three.js texture handling |
| Vertex Uniforms | 128 | Complex scene rendering |
| WebGL Support | v1.0 or v2.0 | Basic 3D rendering |

## Usage Example

### Basic Support Check
```typescript
import { hasWebGLSupport } from './utils/webglCheck';

if (!hasWebGLSupport()) {
  console.error('WebGL not supported!');
  return;
}
```

### Detailed Capability Check
```typescript
import { checkWebGLSupport } from './utils/webglCheck';

const caps = checkWebGLSupport();

if (caps.supported) {
  console.log(`WebGL ${caps.version} detected`);
  console.log(`Renderer: ${caps.renderer}`);
  console.log(`Max Texture Size: ${caps.maxTextureSize}`);
  console.log(`Extensions: ${caps.extensions.length}`);
} else {
  console.error(`WebGL Error: ${caps.error}`);
}
```

### Requirement Validation
```typescript
import { meetsMinimumRequirements } from './utils/webglCheck';

const validation = meetsMinimumRequirements();

if (!validation.meets) {
  showErrorModal(validation.reason);
  return;
}

// Proceed with Three.js initialization
```

### User-Friendly Error Handling
```typescript
import { getWebGLErrorMessage } from './utils/webglCheck';

function initializeApp() {
  const validation = meetsMinimumRequirements();

  if (!validation.meets) {
    const errorMessage = getWebGLErrorMessage();
    showUserNotification(errorMessage);
    return;
  }

  // Start 3D application
}
```

## Error Types Handled

### No WebGL Support
```
"WebGL is not available on your browser.
Please update your browser or enable WebGL in settings."
```

### Insufficient Hardware
```
"Your graphics hardware doesn't meet minimum requirements:
Maximum texture size (1024) is below minimum (2048)"
```

### Extension Issues
- Automatically handles missing extensions
- Provides fallback for missing debug info
- Continues gracefully without optional features

## Integration with SafeThreeScene

The WebGL check is used by `SafeThreeScene` for pre-initialization validation:

```typescript
import { meetsMinimumRequirements } from './utils/webglCheck';

function SafeThreeScene() {
  const validation = meetsMinimumRequirements();

  if (!validation.meets) {
    return <ErrorScreen message={getWebGLErrorMessage()} />;
  }

  return <ThreeScene />;
}
```

## Dependencies
None - Pure JavaScript utility with no external dependencies

## Browser Compatibility

### Supported Contexts
1. `webgl2` - Modern browsers (Chrome 56+, Firefox 51+, Safari 15+)
2. `webgl` - Standard WebGL 1.0
3. `experimental-webgl` - Legacy browsers

### Detection Strategy
1. Try WebGL 2.0 first (best features)
2. Fallback to WebGL 1.0 (wider support)
3. Try experimental context (legacy)
4. Report unsupported if all fail

## Related Components
- [SafeThreeScene](/docs/components/safe-three-scene.md) - Uses validation before rendering
- [ErrorBoundary](/docs/components/error-boundary.md) - Displays WebGL errors
- [ThreeScene](/docs/components/three-scene.md) - Main 3D scene requiring WebGL

## Performance Notes
- Lightweight, runs once on initialization
- No ongoing performance impact
- Fast detection (~1ms typical)
- Caches canvas element temporarily

## Common Use Cases
1. **App initialization** - Validate before loading 3D resources
2. **Feature detection** - Enable/disable features based on capabilities
3. **Error reporting** - Provide helpful diagnostics to users
4. **Quality settings** - Adjust graphics based on hardware limits
5. **Fallback UI** - Show 2D interface when WebGL unavailable

## Notes
- Always check WebGL before initializing Three.js
- Display user-friendly messages, not technical errors
- Consider graceful degradation for unsupported browsers
- Log detailed capability info for debugging
- Store capabilities for runtime feature decisions

## Testing
- Test on various browsers and devices
- Verify fallback behavior without WebGL
- Check error messages are user-friendly
- Validate minimum requirement thresholds
- Test with GPU acceleration disabled
