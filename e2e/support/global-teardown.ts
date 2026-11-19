import { existsSync, readFileSync, writeFileSync } from 'node:fs'

interface Row {
  test: string
  kind: string
  detail: string
  url: string
}

const FILE = 'test-results/findings.ndjson'

/** Turns the per-test findings into one Markdown list grouped by test, easy to read after a watched run. */
export default function globalTeardown() {
  if (!existsSync(FILE)) return
  const rows = readFileSync(FILE, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line) as Row)
  const byTest = new Map<string, Row[]>()
  for (const row of rows) byTest.set(row.test, [...(byTest.get(row.test) ?? []), row])
  const lines = ['# E2E findings', '']
  for (const [name, items] of byTest) {
    lines.push(`## ${name}`, '')
    const seen = new Set<string>()
    for (const item of items) {
      const key = `${item.kind}|${item.detail}`
      if (seen.has(key)) continue
      seen.add(key)
      lines.push(`- **${item.kind}** ${item.detail} _(${new URL(item.url).pathname}${new URL(item.url).search})_`)
    }
    lines.push('')
  }
  writeFileSync('test-results/findings.md', lines.join('\n'))
}
