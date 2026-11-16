import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { i18n, setAppLanguage } from '~/shared/i18n/i18n'
import { approvals } from '~/shared/i18n/locales/en/approvals'
import { approvalsBudget } from '~/shared/i18n/locales/en/approvals-budget'
import { ApprovalAnnualBudgetView } from './views/approval-annual-budget-view'

const vnd = (amount: string) => ({ amount, currency: 'VND' })
const pagination = { page: 1, pageSize: 20, totalItems: 1, totalPages: 1 }
const cycle = {
  year: 2027,
  submissionDeadline: '2026-11-30',
  decisionDeadline: '2026-12-15',
  annualCeiling: vnd('500000000'),
  sharedPoolReserve: vnd('50000000'),
  available: vnd('450000000'),
  priorities: null,
  status: 'OPEN',
  openedAt: '2026-10-01T00:00:00Z'
}

describe('Spending Approver budget cycle overview', () => {
  const previousAdapter = apiClient.defaults.adapter
  let requests: InternalAxiosRequestConfig[]
  beforeEach(async () => {
    requests = []
    i18n.addResourceBundle('en', 'approvals', approvals)
    i18n.addResourceBundle('en', 'approvalsBudget', approvalsBudget)
    await setAppLanguage('en', false)
    apiClient.defaults.adapter = async (config) => {
      requests.push(config)
      const path = config.url?.split('/api/v1')[1] ?? ''
      const respond = (data: unknown) => ({
        config,
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        data: { success: true, message: 'OK', data }
      })
      if (path === '/budget-cycles') return respond({ items: [cycle], pagination })
      if (path === '/budget-cycles/2027') return respond(cycle)
      if (path === '/budget-cycles/2027/package')
        return respond({
          year: 2027,
          annualCeiling: vnd('500000000'),
          sharedPoolReserve: vnd('50000000'),
          available: vnd('450000000'),
          proposalsTotal: vnd('300000000'),
          proposalsOverAvailable: false,
          versionsTotal: vnd('250000000'),
          versionsAdjustment: vnd('0'),
          unallocated: vnd('200000000'),
          versionsOutsideListed: vnd('0'),
          versionsInOtherCurrency: 0,
          overBy: vnd('0'),
          departmentsTotal: 1,
          departments: [
            {
              departmentId: 'dept-1',
              departmentCode: 'ENG',
              departmentName: 'Engineering',
              headStatus: 'HAS_HEAD',
              baselineAllowed: false,
              baselineRefusal: 'HAS_PROPOSAL',
              proposal: { id: 'p1', total: vnd('300000000'), state: 'SUBMITTED' },
              version: null
            }
          ]
        })
      if (path === '/budget-cycles/2027/baseline')
        return respond({
          basis: 'HOLDER_DEPARTMENT',
          year: 2027,
          currency: 'VND',
          computedAt: '2026-11-10T00:00:00Z',
          departmentsTotal: 0,
          departments: [],
          sharedPoolUnallocated: null
        })
      if (path.startsWith('/budgets/summary'))
        return respond({
          year: 2027,
          annualCeiling: vnd('500000000'),
          sharedPoolReserve: vnd('50000000'),
          totals: {
            VND: {
              currency: 'VND',
              base: vnd('1'),
              reserve: vnd('1'),
              total: vnd('1'),
              effectiveBudget: { base: vnd('1'), reserve: vnd('1'), total: vnd('240000000'), adjustment: vnd('0') },
              committed: vnd('10000000'),
              spent: vnd('20000000'),
              remaining: vnd('210000000'),
              pendingSpend: vnd('5000000'),
              remainingBase: vnd('1'),
              remainingWithReserve: vnd('1'),
              costCenterCount: 1,
              overBudgetCount: 0
            }
          },
          lastInvoiceRecordedAt: null,
          companySpent: vnd('20000000'),
          sharedPoolUnallocated: null,
          sharedPoolOverReserve: false,
          seatMonthsWithoutCostCenter: null
        })
      if (path.startsWith('/budgets'))
        return respond({
          items: [
            {
              costCenter: { id: 'cc-1', code: 'ENG', name: 'Engineering CC' },
              year: 2027,
              status: 'ACTIVE',
              versionId: 'v1',
              number: 1,
              base: vnd('1'),
              reserve: vnd('1'),
              total: vnd('1'),
              effectiveBudget: { base: vnd('1'), reserve: vnd('1'), total: vnd('240000000'), adjustment: vnd('0') },
              committed: vnd('10000000'),
              spent: vnd('20000000'),
              pendingSpend: vnd('5000000'),
              remainingBase: vnd('1'),
              remainingWithReserve: vnd('1'),
              overBudget: false,
              remaining: vnd('210000000'),
              overCommitted: false,
              priorPeriodAdjustment: null
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

  const mount = (itemId?: string, onSelectTab = () => undefined) =>
    render(
      <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
        <ApprovalAnnualBudgetView itemId={itemId} onSelectTab={onSelectTab} />
      </QueryClientProvider>
    )

  it('lists budget cycles read-only and opens one by year', async () => {
    const opened: unknown[][] = []
    mount(undefined, ((...args: unknown[]) => opened.push(args)) as never)
    fireEvent.click(screen.getByRole('button', { name: 'Budget cycles' }))
    await screen.findAllByText('Open for proposals')
    fireEvent.click(screen.getAllByRole('button', { name: 'View details' })[0])
    expect(opened).toEqual([['annual-budget', { id: 'cycle:2027' }]])
  })

  it('shows the ceiling, the department package and the year budget of a cycle', async () => {
    mount('cycle:2027')
    expect(await screen.findByText('Budget cycle 2027')).toBeTruthy()
    expect((await screen.findAllByText('Engineering')).length).toBeGreaterThan(0)
    expect((await screen.findAllByText('Engineering CC')).length).toBeGreaterThan(0)
    expect(requests.every((request) => request.method === 'get')).toBe(true)
    expect(requests.some((request) => request.url?.includes('/budgets/summary'))).toBe(true)
  })
})
