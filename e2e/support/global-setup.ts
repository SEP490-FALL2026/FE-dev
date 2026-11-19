import { mkdirSync, rmSync } from 'node:fs'

/** Starts every run with an empty findings list. */
export default function globalSetup() {
  mkdirSync('test-results', { recursive: true })
  rmSync('test-results/findings.ndjson', { force: true })
}
