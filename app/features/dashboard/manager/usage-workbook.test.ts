import { describe, expect, it } from 'vitest'

import { MOCK_TEAM_MEMBERS } from './manager-data'
import { createUsageWorkbook } from './usage-workbook'

describe('createUsageWorkbook', () => {
  it('exports the selected employee usage as an Excel workbook', async () => {
    const workbook = createUsageWorkbook(MOCK_TEAM_MEMBERS[0], {
      activeMinutes: 'Active minutes',
      creditsConsumed: 'Credits used',
      creditsLimit: 'Credit limit',
      dayPeriod: 'Daily',
      plan: 'Plan',
      period: 'Period',
      requestPeriod: 'By request',
      sessionEnd: 'Session end',
      sessionStart: 'Session start',
      sheetName: 'Usage',
      software: 'Software',
      status: 'Status',
      title: 'Usage over 30 days',
      usageActive: 'Active',
      usageAgentActive: 'Allocated',
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
    expect(contents).toContain('2026-09-30T09:15:00')
    expect(contents).toContain('Research Agent')
    expect(contents).toContain('<v>420</v>')
    expect(contents).toContain('Daily: 2026-10-18')
    expect(contents).not.toContain('Trần Văn Tuấn')
  })
})
