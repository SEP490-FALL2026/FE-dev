import { describe, expect, it } from 'vitest'

import { i18n, setAppLanguage } from '~/shared/i18n/i18n'

import { buildSoftwareCsv } from './export-software'
import { teamSoftware } from './team-software-demo'

describe('Software CSV export', () => {
  it('exports all supplied rows with localized values, safe quoting and formula neutralization', async () => {
    await setAppLanguage('vi', false)
    const csv = buildSoftwareCsv(teamSoftware, 'vi', i18n.t)
    expect(csv.startsWith('\uFEFF')).toBe(true)
    expect(csv.split('\r\n')).toHaveLength(9)
    expect(csv).toContain('Chi phí tháng dự kiến')
    expect(csv).toContain(new Intl.NumberFormat('vi', { style: 'currency', currency: 'USD' }).format(299.9))
    const dangerous = buildSoftwareCsv([{ ...teamSoftware[0], name: '=SUM(1,2)', plan: 'a"b' }], 'vi', i18n.t)
    expect(dangerous).toContain('"' + "'=SUM(1,2)" + '"')
    expect(dangerous).toContain('"a""b"')
    expect(dangerous.split('\r\n')).toHaveLength(2)
  })
})
