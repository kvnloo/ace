/**
 * Type definitions for environment variables
 * This ensures type safety when accessing process.env
 */

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /**
       * Gemini API key for AI features
       * Injected by Vite from GEMINI_API_KEY environment variable
       */
      API_KEY?: string;

      /**
       * Gemini API key (alternative name)
       * Injected by Vite from GEMINI_API_KEY environment variable
       */
      GEMINI_API_KEY?: string;

      /**
       * Vite base path for deployment
       * Used for GitHub Pages deployment paths
       */
      VITE_BASE_PATH?: string;

      /**
       * Node environment
       */
      NODE_ENV?: 'development' | 'production' | 'test';
    }
  }
}

// This export is necessary to make this a module
export {};
