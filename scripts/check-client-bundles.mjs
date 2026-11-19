import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

const assets = new URL('../build/client/assets/', import.meta.url)
const limit = 500_000
const bundles = await Promise.all(
  (await readdir(assets))
    .filter((name) => name.endsWith('.js'))
    .map(async (name) => ({ name, bytes: (await stat(new URL(name, assets))).size }))
)
const oversized = bundles.filter(({ bytes }) => bytes > limit).sort((a, b) => b.bytes - a.bytes)

if (oversized.length) {
  for (const { name, bytes } of oversized) {
    console.error(`${join('build/client/assets', name)}: ${(bytes / 1000).toFixed(2)} kB exceeds 500 kB`)
  }
  process.exitCode = 1
} else {
  const largest = bundles.sort((a, b) => b.bytes - a.bytes)[0]
  console.log(
    `Client bundle budget passed (${bundles.length} chunks; largest ${(largest.bytes / 1000).toFixed(2)} kB).`
  )
}
