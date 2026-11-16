import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { i18n, setAppLanguage } from '~/shared/i18n/i18n'
import { approvals } from '~/shared/i18n/locales/en/approvals'
import { approvalsBudget } from '~/shared/i18n/locales/en/approvals-budget'
import { ApprovalInYearView } from './views/approval-in-year-view'

const vnd = (amount: string) => ({ amount, currency: 'VND' })
const adjustment = {
  id: 'adjustment-1',
  year: 2027,
  kind: 'TRANSFER',
  from: { id: 'cc-1', code: 'ENG', name: 'Engineering' },
  to: { id: 'cc-2', code: 'OPS', name: 'Operations' },
  amount: vnd('5000000'),
  reason: 'Move budget for a shared tool',
  transferReason: null,
  state: 'PENDING',
  createdBy: null,
  createdAt: '2026-11-01T00:00:00Z',
  decidedBy: null,
  decidedAt: null,
  decisionReason: null,
  createdVersionId: null
}
const pagination = { page: 1, pageSize: 20, totalItems: 1, totalPages: 1 }
const period = {
  id: 'period-1',
  year: 2027,
  month: 3,
  kind: 'QUARTER',
  state: 'SIGNED',
  currency: 'VND',
  closedBy: { employeeId: 'e-1', employeeCode: 'FIN-01', fullName: 'Finance Lead' },
  closedAt: '2027-04-01T00:00:00Z',
  explanationsDueOn: null,
  signedBy: null,
  signedAt: '2027-04-10T00:00:00Z',
  note: null,
  lightCounts: { GREEN: 2, YELLOW: 0, RED: 1, UNDER: 0 },
  company: {
    spent: vnd('900000'),
    sharedPoolUnallocated: vnd('700000'),
    sharedPoolReserve: vnd('500000'),
    sharedPoolOverReserve: true,
    annualCeiling: vnd('9000000')
  }
}

describe('Spending Approver in-year budget', () => {
  const previousAdapter = apiClient.defaults.adapter
  let requests: InternalAxiosRequestConfig[]
  let decideFailure: string | null
  let adjustmentYear: number
  beforeEach(async () => {
    requests = []
    decideFailure = null
    adjustmentYear = 2027
    i18n.addResourceBundle('en', 'approvals', approvals)
    i18n.addResourceBundle('en', 'approvalsBudget', approvalsBudget)
    await setAppLanguage('en', false)
    apiClient.defaults.adapter = async (config) => {
      requests.push(config)
      const path = config.url?.split('/api/v1')[1] ?? ''
      const respond = (data: unknown, status = 200) => ({
        config,
        status,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        data: { success: true, message: 'OK', data }
      })
      if (path.endsWith('/decision') && decideFailure)
        throw new AxiosError('failed', 'ERR_BAD_REQUEST', config, undefined, {
          config,
          status: 422,
          statusText: 'Unprocessable',
          headers: new AxiosHeaders(),
          data: { success: false, error: { code: decideFailure, message: 'x' } }
        })
      if (path.startsWith('/budget-adjustments')) {
        return respond(
          path.endsWith('/decision')
            ? { ...adjustment, state: 'APPROVED' }
            : { items: [{ ...adjustment, year: adjustmentYear }], pagination }
        )
      }
      if (path === '/budget-review-periods') return respond({ items: [period], pagination })
      if (path === '/budget-review-periods/period-1')
        return respond({
          period,
          items: [
            {
              id: 'row-1',
              costCenter: { id: 'cc-1', code: 'ENG', name: 'Engineering' },
              base: vnd('1000000'),
              reserve: vnd('0'),
              spent: vnd('1200000'),
              spentAfterMonth: vnd('0'),
              changedAfterSnapshot: vnd('30000'),
              committed: vnd('0'),
              pendingSpend: vnd('0'),
              remaining: vnd('-200000'),
              variancePpm: 200000,
              priceIncrease: vnd('0'),
              forecast: vnd('1500000'),
              paceBasisPoints: 11000,
              light: 'RED',
              explanationStatus: 'EXPLAINED',
              explanation: {
                cause: 'Tool price rose in February',
                persistence: 'ONGOING',
                action: 'Reclaim three idle seats',
                knownNeedsToYearEnd: { amount: vnd('36000000'), note: 'Renew in September' },
                explainedBy: { employeeId: 'e-2', employeeCode: 'ENG-01', fullName: 'Engineering Head' },
                explainedAt: '2027-04-03T00:00:00Z'
              }
            }
          ],
          pagination
        })
      if (path === '/subscription-deadline-events')
        return respond({
          items: [
            {
              id: 'event-1',
              subscription: {
                id: 'sub-1',
                planId: 'plan-1',
                planName: 'Team plan',
                applicationId: 'app-1',
                applicationName: 'Design tool',
                ownerDepartmentId: 'dept-1'
              },
              kind: 'AUTO_RENEWAL_INCIDENT',
              milestoneDate: '2026-10-01',
              autoRenewAtTime: true,
              recordedOn: '2026-10-02',
              recordedAt: '2026-10-02T00:00:00Z'
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

  const mount = (itemId?: string) =>
    render(
      <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
        <ApprovalInYearView itemId={itemId} onSelectTab={() => undefined} />
      </QueryClientProvider>
    )

  it('lists pending adjustments by default and approves one with no body but the decision', async () => {
    mount()
    await screen.findAllByText('Move budget for a shared tool')
    expect(requests.find((r) => r.url?.endsWith('/budget-adjustments'))?.params).toMatchObject({ state: 'PENDING' })
    fireEvent.click(screen.getAllByRole('button', { name: 'View details' })[0])
    fireEvent.click(await screen.findByRole('button', { name: 'Confirm decision' }))
    await waitFor(() =>
      expect(requests.some((r) => r.url?.endsWith('/budget-adjustments/adjustment-1/decision'))).toBe(true)
    )
    const decide = requests.find((r) => r.url?.endsWith('/decision'))
    expect(JSON.parse(decide?.data)).toEqual({ decision: 'APPROVE' })
  })

  it('requires a reason to reject', async () => {
    mount()
    await screen.findAllByText('Move budget for a shared tool')
    fireEvent.click(screen.getAllByRole('button', { name: 'View details' })[0])
    fireEvent.click(await screen.findByRole('combobox', { name: /Decision/ }))
    fireEvent.click(await screen.findByRole('option', { name: 'Reject' }))
    expect(screen.getByRole('button', { name: 'Confirm decision' })).toBeDisabled()
  })

  it('shows the closed month with real figures and the light only as a dot, with no write control', async () => {
    mount('period:period-1')
    expect((await screen.findAllByText('ENG · Engineering')).length).toBeGreaterThan(0)
    // the light is a signal beside the cost center, never a column of its own or a count
    expect(screen.getAllByRole('img', { name: /Red light/ }).length).toBeGreaterThan(0)
    expect(screen.queryByText(/^Light$/)).toBeNull()
    expect(screen.queryByText(/Green \/ Yellow/)).toBeNull()
    for (const heading of [
      'Year-end forecast',
      'Spending pace',
      'Changed after the picture',
      'Booked for later months'
    ])
      expect(screen.getAllByText(heading).length).toBeGreaterThan(0)
    expect(screen.getAllByText('110%').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Explained').length).toBeGreaterThan(0)
    expect(screen.getByText('Tool price rose in February')).toBeTruthy()
    expect(screen.getByText('The unallocated part of the shared pool is above the shared-pool reserve.')).toBeTruthy()
    expect(screen.queryByRole('button', { name: /sign/i })).toBeNull()
  })

  it('lists the closed months with who closed and signed them, and no light counts', async () => {
    mount('section:periods')
    expect((await screen.findAllByText('Finance Lead')).length).toBeGreaterThan(0)
    expect(screen.getAllByText('Closed by').length).toBeGreaterThan(0)
    expect(screen.queryByText('Green / Yellow / Red / Under')).toBeNull()
  })

  it('offers only a rejection for an adjustment of a year that has ended', async () => {
    adjustmentYear = 2020
    mount()
    await screen.findAllByText('Move budget for a shared tool')
    fireEvent.click(screen.getAllByRole('button', { name: 'View details' })[0])
    expect(await screen.findByText(/This year has ended/)).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Confirm decision' })).toBeDisabled()
  })

  it('lists missed subscription deadline events read-only', async () => {
    mount('section:deadlines')
    expect((await screen.findAllByText('Design tool · Team plan')).length).toBeGreaterThan(0)
    expect(screen.getAllByText('Auto-renewed without a decision').length).toBeGreaterThan(0)
  })

  it('opens one adjustment by id from a link and goes straight to its decision', async () => {
    mount('adjustment:adjustment-1')
    expect(await screen.findByRole('button', { name: 'Confirm decision' })).toBeTruthy()
    expect(screen.getAllByText('Move budget for a shared tool').length).toBeGreaterThan(0)
  })

  it('says so when the adjustment of a link cannot be found', async () => {
    mount('adjustment:no-such-adjustment')
    expect(await screen.findByText(/could not be found/)).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Confirm decision' })).toBeNull()
  })
})
