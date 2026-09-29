import { describe, expect, it } from 'vitest'

import { buildTeamCsv } from './export-team'
import { teamMembers } from '~/entities/user/team-members-demo'

describe('Team CSV export', () => {
  it('exports only the supplied profiles and safely quotes formula-like names and commas', () => {
    const csv = buildTeamCsv(
      [{ ...teamMembers[0], name: '=SUM(1,2)', email: 'a"b@company.com' }],
      ['Employee', 'Email'],
      (member) => member.status,
      () => '2 hours ago'
    )
    expect(csv).toContain('"\'=SUM(1,2)"')
    expect(csv).toContain('"a""b@company.com"')
    expect(csv.split('\r\n')).toHaveLength(2)
    expect(csv.startsWith('\uFEFF')).toBe(true)
  })
})
