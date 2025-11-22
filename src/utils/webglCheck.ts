/**
 * WebGL Capability Detection and Validation
 *
 * Provides comprehensive WebGL support detection for 3D rendering
 * Used by SafeThreeScene to ensure browser compatibility before initialization
 */

export interface WebGLCapabilities {
  supported: boolean;
  version: '1.0' | '2.0' | null;
  renderer: string | null;
  vendor: string | null;
  maxTextureSize: number | null;
  maxVertexUniforms: number | null;
  extensions: string[];
  error: string | null;
}

/**
 * Comprehensive WebGL capability check
 * Returns detailed information about WebGL support
 */
export const checkWebGLSupport = (): WebGLCapabilities => {
  const canvas = document.createElement('canvas');

  try {
    // Try WebGL 2.0 first
    let gl = canvas.getContext('webgl2') as WebGL2RenderingContext | null;
    let version: '1.0' | '2.0' | null = gl ? '2.0' : null;

    // Fallback to WebGL 1.0
    if (!gl) {
      gl = canvas.getContext('webgl') as WebGLRenderingContext | null;
      version = gl ? '1.0' : null;
    }

    // Alternative context names for older browsers
    if (!gl) {
      gl = canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
      version = gl ? '1.0' : null;
    }

    if (!gl) {
      return {
        supported: false,
        version: null,
        renderer: null,
        vendor: null,
        maxTextureSize: null,
        maxVertexUniforms: null,
        extensions: [],
        error: 'WebGL not supported by this browser'
      };
    }

    // Get debug info
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown';
    const vendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'Unknown';

    // Get capabilities
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    const maxVertexUniforms = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);

    // Get supported extensions
    const extensions = gl.getSupportedExtensions() || [];

    return {
      supported: true,
      version,
      renderer,
      vendor,
      maxTextureSize,
      maxVertexUniforms,
      extensions,
      error: null
    };

  } catch (error) {
    return {
      supported: false,
      version: null,
      renderer: null,
      vendor: null,
      maxTextureSize: null,
      maxVertexUniforms: null,
      extensions: [],
      error: error instanceof Error ? error.message : 'Unknown WebGL error'
    };
  }
};

/**
 * Simple boolean check for WebGL support
 * Use this for quick validation before rendering
 */
export const hasWebGLSupport = (): boolean => {
  return checkWebGLSupport().supported;
};

/**
 * Check if WebGL meets minimum requirements for Three.js
 */
export const meetsMinimumRequirements = (): { meets: boolean; reason?: string } => {
  const capabilities = checkWebGLSupport();

  if (!capabilities.supported) {
    return {
      meets: false,
      reason: capabilities.error || 'WebGL not supported'
    };
  }

  // Check minimum texture size (Three.js needs at least 2048)
  if (capabilities.maxTextureSize && capabilities.maxTextureSize < 2048) {
    return {
      meets: false,
      reason: `Maximum texture size (${capabilities.maxTextureSize}) is below minimum (2048)`
    };
  }

  // Check vertex uniforms (minimum 128 for complex scenes)
  if (capabilities.maxVertexUniforms && capabilities.maxVertexUniforms < 128) {
    return {
      meets: false,
      reason: `Insufficient vertex uniforms (${capabilities.maxVertexUniforms} < 128)`
    };
  }

  return { meets: true };
};

/**
 * Get user-friendly error message for WebGL issues
 */
export const getWebGLErrorMessage = (): string => {
  const capabilities = checkWebGLSupport();

  if (!capabilities.supported) {
    return `WebGL is not available on your browser. Please update your browser or enable WebGL in settings. Error: ${capabilities.error}`;
  }

  const requirements = meetsMinimumRequirements();
  if (!requirements.meets) {
    return `Your graphics hardware doesn't meet minimum requirements: ${requirements.reason}`;
  }

  return 'Unknown WebGL error';
};
