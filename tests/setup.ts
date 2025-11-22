/**
 * Vitest Test Setup
 *
 * This file runs before all tests to configure the testing environment.
 */

import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia (used by responsive components)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver (used by lazy loading)
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

// Mock ResizeObserver (used by responsive components)
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as any;

// Mock WebGL context for Three.js rendering tests
const mockWebGLContext = {
  canvas: document.createElement('canvas'),
  getParameter: vi.fn((param) => {
    if (param === 0x8B8D) return 16; // MAX_COMBINED_TEXTURE_IMAGE_UNITS
    if (param === 0x8872) return 16; // MAX_VERTEX_ATTRIBS
    if (param === 0x8B4C) return 16; // MAX_VERTEX_TEXTURE_IMAGE_UNITS
    return 0;
  }),
  getExtension: vi.fn(() => ({})),
  createShader: vi.fn(() => ({})),
  shaderSource: vi.fn(),
  compileShader: vi.fn(),
  getShaderParameter: vi.fn(() => true),
  createProgram: vi.fn(() => ({})),
  attachShader: vi.fn(),
  linkProgram: vi.fn(),
  getProgramParameter: vi.fn(() => true),
  useProgram: vi.fn(),
  createBuffer: vi.fn(() => ({})),
  bindBuffer: vi.fn(),
  bufferData: vi.fn(),
  enableVertexAttribArray: vi.fn(),
  vertexAttribPointer: vi.fn(),
  getAttribLocation: vi.fn(() => 0),
  getUniformLocation: vi.fn(() => ({})),
  uniform1f: vi.fn(),
  uniform2f: vi.fn(),
  uniform3f: vi.fn(),
  uniform4f: vi.fn(),
  uniformMatrix4fv: vi.fn(),
  createTexture: vi.fn(() => ({})),
  bindTexture: vi.fn(),
  texImage2D: vi.fn(),
  texParameteri: vi.fn(),
  generateMipmap: vi.fn(),
  activeTexture: vi.fn(),
  clearColor: vi.fn(),
  clearDepth: vi.fn(),
  enable: vi.fn(),
  disable: vi.fn(),
  depthFunc: vi.fn(),
  clear: vi.fn(),
  drawArrays: vi.fn(),
  drawElements: vi.fn(),
  viewport: vi.fn(),
  blendFunc: vi.fn(),
  blendEquation: vi.fn(),
  cullFace: vi.fn(),
  frontFace: vi.fn(),
  deleteBuffer: vi.fn(),
  deleteProgram: vi.fn(),
  deleteShader: vi.fn(),
  deleteTexture: vi.fn(),
  flush: vi.fn(),
  finish: vi.fn(),
  getError: vi.fn(() => 0),
};

// Mock canvas.getContext to return WebGL context
HTMLCanvasElement.prototype.getContext = vi.fn((contextType) => {
  if (contextType === 'webgl' || contextType === 'webgl2' || contextType === 'experimental-webgl') {
    return mockWebGLContext as any;
  }
  return null;
});

// Suppress console warnings during tests (Three.js can be verbose)
const originalWarn = console.warn;
const originalError = console.error;

beforeAll(() => {
  console.warn = vi.fn((message) => {
    // Only show warnings that aren't from Three.js or React Three Fiber
    if (!message?.toString().includes('THREE.') && !message?.toString().includes('R3F:')) {
      originalWarn(message);
    }
  });

  console.error = vi.fn((message) => {
    // Only show errors that aren't expected testing warnings
    if (!message?.toString().includes('Not implemented: HTMLFormElement.prototype.submit')) {
      originalError(message);
    }
  });
});

afterAll(() => {
  console.warn = originalWarn;
  console.error = originalError;
});
