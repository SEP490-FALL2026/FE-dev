import { defineConfig } from 'vitest/config'

// Run separately from the normal regression suite: these assertions audit the current docs contract.
export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'jsdom',
    include: ['test/audits/mf23-contract-audit.test.tsx'],
    setupFiles: ['./test/setup.ts'],
    maxWorkers: 1,
    testTimeout: 15000
  }
})
