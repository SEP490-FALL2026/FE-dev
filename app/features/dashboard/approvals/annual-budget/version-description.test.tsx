import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { AxiosHeaders } from 'axios'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { i18n, setAppLanguage } from '~/shared/i18n/i18n'
import { approvals } from '~/shared/i18n/locales/en/approvals'
import { approvalsBudget } from '~/shared/i18n/locales/en/approvals-budget'
import { ApprovalAnnualBudgetView } from './views/approval-annual-budget-view'
import { ApprovalVersionHistoryView } from './views/approval-version-history-view'

const vnd = (amount: string) => ({ amount, currency: 'VND' })
const center = { id: 'cc-1', code: 'ENG', name: 'Engineering' }
const version = {
  id: 'version-1',
  costCenter: center,
  year: 2027,
  number: 1,
  state: 'SENT',
  proposalId: 'proposal-1',
  rejectedPredecessorId: null,
  base: vnd('400000000'),
  baseReason: 'Finance cut the base after talking to the head',
  origin: 'PROPOSAL',
  reserve: vnd('48000000'),
  reservePercent: 12,
  defaultReserve: vnd('40000000'),
  reserveReason: 'Three hires planned for Q2',
  total: vnd('448000000'),
  reason: 'old free text that is no longer used',
  carriedOverNextYear: vnd('500000000'),
  belowCarriedOver: true,
  carriedOverShortfall: vnd('52000000'),
  noProposalSubmitted: true,
  waitingReason: null,
  decision: null,
  createdBy: { employeeId: 'f-1', employeeCode: 'FIN', fullName: 'Finance Lead' },
  createdAt: '2026-10-30T00:00:00Z',
  sentAt: '2026-11-01T00:00:00Z',
  detachedAt: null,
  neverCurrent: false,
  expiredAt: null
}
const pagination = { page: 1, pageSize: 20, totalItems: 1, totalPages: 1 }

describe('Spending Approver version screen follows the API description', () => {
  const previousAdapter = apiClient.defaults.adapter
  beforeEach(async () => {
    i18n.addResourceBundle('en', 'approvals', approvals)
    i18n.addResourceBundle('en', 'approvalsBudget', approvalsBudget)
    await setAppLanguage('en', false)
    apiClient.defaults.adapter = async (config) => {
      const path = config.url?.split('/api/v1')[1] ?? ''
      const respond = (data: unknown) => ({
        config,
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        data: { success: true, message: 'OK', data }
      })
      if (path === '/me') return respond({ employee: { id: 'approver-1' }, roles: ['SPENDING_APPROVER'] })
      if (path === '/budget-versions/version-1') return respond({ version })
      if (path === '/budget-proposals/proposal-1')
        return respond({ proposal: { id: 'proposal-1', costCenter: center, requestedAmount: vnd('450000000') } })
      if (path.endsWith('/attachments')) return respond({ items: [], pagination })
      if (path === '/budget-versions/version-1/history')
        return respond({
          items: [
            {
              seq: 1,
              kind: 'ATTACHMENT_ADDED',
              versionState: 'DRAFT',
              position: null,
              lines: null,
              changes: [{ field: 'quote-2027.pdf', before: null, after: 'ATTACHED' }],
              currency: 'VND',
              by: { id: 'f-1', name: 'Finance Lead' },
              at: '2026-11-01T00:00:00Z'
            },
            {
              seq: 2,
              kind: 'FIGURES_UPDATED',
              versionState: 'DRAFT',
              position: null,
              lines: null,
              changes: [{ field: 'reservePercent', before: '10', after: '12' }],
              currency: 'VND',
              by: { id: 'f-1', name: 'Finance Lead' },
              at: '2026-11-01T00:00:00Z'
            }
          ],
          pagination
        })
      return respond(null)
    }
  })
  afterEach(() => {
    apiClient.defaults.adapter = previousAdapter
  })

  const wrap = (node: React.ReactNode) =>
    render(
      <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
        {node}
      </QueryClientProvider>
    )

  it('shows the flags, the reserve facts and the department request next to the base', async () => {
    wrap(<ApprovalAnnualBudgetView itemId='version-1' onSelectTab={() => undefined} />)
    expect(await screen.findByText(/below the commitments that run into this year/)).toBeTruthy()
    expect(screen.getAllByText(/The department submitted no request/).length).toBeGreaterThan(0)
    expect(await screen.findByText('Against the department request')).toBeTruthy()
    expect(screen.getAllByText('Reserve share').length).toBeGreaterThan(0)
    expect(screen.getAllByText('12 %').length).toBeGreaterThan(0)
    expect(screen.getByText('Three hires planned for Q2')).toBeTruthy()
    expect(screen.getByText('Finance cut the base after talking to the head')).toBeTruthy()
    // the retired free-text reason of old versions is no longer shown
    expect(screen.queryByText('old free text that is no longer used')).toBeNull()
  })

  it('names a changed field it does not know as it is and formats the reserve share', async () => {
    wrap(<ApprovalVersionHistoryView itemId='version-1' onSelectTab={() => undefined} />)
    expect((await screen.findAllByText('quote-2027.pdf')).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/After: 12 %/).length).toBeGreaterThan(0)
  })
})
