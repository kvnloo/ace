import path from 'path';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv } from 'vite';

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
    plugins: [
      react(),
      // Bundle visualizer - only in analyze mode
      visualizer({
        filename: './dist/stats.html',
        open: false,
        gzipSize: true,
        brotliSize: true,
      }),
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      // Output directory
      outDir: 'dist',

      // Generate sourcemaps for production (disabled for smaller bundle)
      sourcemap: false,

      // Minification settings
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, // Remove console.logs in production
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
        },
        format: {
          comments: false, // Remove comments
        },
      },

      // Chunk size warning limit (500kb)
      chunkSizeWarningLimit: 500,

      // Rollup options
      rollupOptions: {
        output: {
          // Manual chunk splitting strategy
          manualChunks: {
            // React core
            'react-vendor': ['react', 'react-dom'],

            // Three.js and related
            'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],

            // Animation libraries
            'animation-vendor': ['framer-motion'],

            // Google AI
            'ai-vendor': ['@google/genai'],

            // UI utilities
            'ui-vendor': ['lucide-react'],
          },

          // Asset file naming
          assetFileNames: (assetInfo) => {
            const name = assetInfo.name;
            if (!name) {
              return `assets/[name]-[hash][extname]`;
            }
            const extType = name.split('.').pop() ?? '';
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              return `assets/images/[name]-[hash][extname]`;
            } else if (/woff|woff2|eot|ttf|otf/i.test(extType)) {
              return `assets/fonts/[name]-[hash][extname]`;
            }
            return `assets/[name]-[hash][extname]`;
          },

          // Chunk file naming
          chunkFileNames: 'assets/js/[name]-[hash].js',

          // Entry file naming
          entryFileNames: 'assets/js/[name]-[hash].js',
        },
      },

      // CSS code splitting
      cssCodeSplit: true,

      // CSS minification
      cssMinify: true,

      // Report compressed size
      reportCompressedSize: true,

      // Target modern browsers
      target: 'es2015',
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './test-setup.ts',
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        include: ['components/**/*.{ts,tsx}', 'types.ts'],
        exclude: ['node_modules/', '**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
      },
    },
  };
});
