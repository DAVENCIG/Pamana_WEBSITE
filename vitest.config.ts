import { defineConfig } from 'vitest/config'

// Kept separate from vite.config.ts so tests do not load the build-only plugins.
export default defineConfig({
  test: { environment: 'node', include: ['src/**/*.test.ts', 'functions/**/*.test.ts'] },
})
