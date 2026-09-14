import path from 'path';
import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

function pascalForceWebgl(): Plugin {
  return {
    name: 'ace-pascal-webgl',
    enforce: 'pre',
    transform(code, id) {
      const normalized = id.split('?')[0].replaceAll('\\', '/');
      if (!normalized.endsWith('/renderer-capability.js')) return null;
      if (!code.includes('function browserGpu()')) return null;
      return {
        code: code.replace(
          'function browserGpu() {',
          `function browserGpu() {\n    if (typeof window !== 'undefined' && window.__PASCAL_BACKEND__ === 'webgl2') return null;`,
        ),
        map: null,
      };
    },
  };
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');

    // Determine base path based on branch (set via environment variable during build)
    const base = process.env.VITE_BASE_PATH || '/';

    return {
      base,
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [pascalForceWebgl(), react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.NODE_ENV': JSON.stringify(mode === 'production' ? 'production' : 'development'),
      },
      optimizeDeps: {
        exclude: ['@pascal-app/viewer', '@pascal-app/nodes'],
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
          '@pascal-app/editor': path.resolve(__dirname, 'facility/pascal-editor-shim.ts'),
        }
      }
    };
});
