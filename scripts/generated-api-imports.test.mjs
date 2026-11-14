import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const root = fileURLToPath(new URL('../', import.meta.url))
function sourceFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filename = path.join(directory, entry.name)
    if (entry.isDirectory()) return entry.name === 'generated' ? [] : sourceFiles(filename)
    return /\.[jt]sx?$/.test(filename) ? [filename] : []
  })
}

test('handwritten code references generated API modules that still exist', () => {
  const missing = []
  for (const filename of sourceFiles(path.join(root, 'app'))) {
    const source = fs.readFileSync(filename, 'utf8')
    for (const [, specifier] of source.matchAll(/["'](~\/shared\/api\/generated\/[^"']+)["']/g)) {
      const target = path.join(root, 'app', specifier.slice(2))
      if (![target + '.ts', target + '.tsx', path.join(target, 'index.ts')].some((p) => fs.existsSync(p))) {
        missing.push(`${path.relative(root, filename)}: ${specifier}`)
      }
    }
  }
  assert.deepEqual(missing, [], `Removed API modules are still referenced:\n${missing.join('\n')}`)
})
