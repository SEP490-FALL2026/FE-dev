import { expect, it } from 'vitest'

import { i18n } from '~/shared/i18n/i18n'

const sources = {
  ...import.meta.glob('./finance/**/views/*.tsx', { eager: true, query: '?raw', import: 'default' }),
  ...import.meta.glob('./it-admin/**/views/*.tsx', { eager: true, query: '?raw', import: 'default' }),
  ...import.meta.glob('./super-admin/**/views/*.tsx', { eager: true, query: '?raw', import: 'default' })
} as Record<string, string>

it('has Vietnamese and English entries for literal dashboard translation keys', () => {
  const missing: string[] = []
  for (const [file, source] of Object.entries(sources)) {
    for (const [, key] of source.matchAll(/\bt\(\s*['"]([^'"]+)['"]/g)) {
      if (!/^(itAdmin|finance|superAdmin|financeDemo)\./.test(key)) continue
      for (const language of ['vi', 'en']) {
        if (!i18n.exists(`dashboard:${key}`, { lng: language })) missing.push(`${file}: ${language} ${key}`)
      }
    }
  }
  expect(missing).toEqual([])
})
