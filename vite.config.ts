import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

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
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './tests/setup.ts',
        css: true,
        coverage: {
          provider: 'v8',
          reporter: ['text', 'json', 'html', 'lcov'],
          exclude: [
            'node_modules/',
            'tests/',
            '*.config.*',
            '**/*.d.ts',
            '**/*.test.{ts,tsx}',
            '**/templates/',
          ],
        },
      },
    };
});
