import { describe, expect, it } from 'vitest'

import { teamRequests } from '~/entities/request/manager-requests-demo'
import { i18n, setAppLanguage } from '~/shared/i18n/i18n'

import { buildRequestReport } from './request-report'

describe('Request summary report', () => {
  it('exports localized known details and keeps missing fields explicit for other requests', async () => {
    await setAppLanguage('en', false)
    const english = buildRequestReport(teamRequests[0], 'en', i18n.t)
    expect(english).toContain('REQ-1024')
    expect(english).toContain('EMP-0245')
    expect(english).toContain('read-only preview')
    await setAppLanguage('vi', false)
    const vietnamese = buildRequestReport(teamRequests[5], 'vi', i18n.t)
    expect(vietnamese).toContain('REQ-1034')
    expect(vietnamese).toContain('Nguyễn Thủy F')
    expect(vietnamese).toContain('Tableau')
    expect(vietnamese).toContain('Chưa được cung cấp')
    expect(vietnamese).not.toContain('Project Alpha')
    expect(vietnamese).not.toContain('EMP-0245')
  })
})
