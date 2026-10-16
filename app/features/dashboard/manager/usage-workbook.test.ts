import { describe, expect, it } from 'vitest'

import { MOCK_TEAM_MEMBERS } from './manager-data'
import { createUsageWorkbook } from './usage-workbook'

describe('createUsageWorkbook', () => {
  it('exports the selected employee usage as an Excel workbook', async () => {
    const workbook = createUsageWorkbook(MOCK_TEAM_MEMBERS[0], {
      activeMinutes: 'Active minutes',
      plan: 'Plan',
      sheetName: 'Usage',
      software: 'Software',
      status: 'Status',
      title: 'Usage over 30 days',
      usageActive: 'Active',
      usageInactive: 'Inactive',
      usageLow: 'Low usage'
    })
    const bytes = new Uint8Array(await workbook.arrayBuffer())
    const contents = new TextDecoder().decode(bytes)

    expect(workbook.type).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    expect(bytes.slice(0, 4)).toEqual(new Uint8Array([0x50, 0x4b, 0x03, 0x04]))
    expect(contents).toContain('xl/worksheets/sheet1.xml')
    expect(contents).toContain('Mai Thị Lan')
    expect(contents).toContain('AutoCAD')
    expect(contents).toContain('<v>1420</v>')
    expect(contents).not.toContain('Trần Văn Tuấn')
  })
})
