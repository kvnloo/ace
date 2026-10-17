import path from 'path';
import { defineConfig, Plugin } from 'vite';
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

export default defineConfig(() => {
  const base = process.env.VITE_BASE_PATH || '/';

  return {
    base,
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [pascalForceWebgl(), react()],
    optimizeDeps: {
      exclude: ['@pascal-app/viewer', '@pascal-app/nodes'],
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        '@pascal-app/editor': path.resolve(__dirname, 'facility/pascal-editor-shim.ts'),
      },
    },
  };
});
