import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
import type { ReactElement } from 'react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { AdjustmentCreateDialog, cycleNotLockedDeadline } from './components/adjustment-create-dialog'
import { ReviewCloseDialog } from './components/review-close-dialog'
import { ReviewPeriodDetail } from './components/review-period-detail'
import { FinanceAdjustmentsView } from './views/finance-adjustments-view'
import { FinanceReviewPeriodsView } from './views/finance-review-periods-view'

const vnd = (amount: string) => ({ amount, currency: 'VND' })
const person = { employeeId: 'e1', employeeCode: 'E1', fullName: 'Finance Person' }
const costCenters = [
  { id: 'cc-1', code: 'CC1', name: 'Engineering' },
  { id: 'cc-2', code: 'CC2', name: 'Design' }
]

describe('In-year budget review screens', () => {
  const previousAdapter = apiClient.defaults.adapter
  let requests: InternalAxiosRequestConfig[] = []
  let periodState = 'AWAITING_EXPLANATIONS'
  let createFails: { code: string; details?: unknown } | null = null
  let cycleStatus = 'LOCKED'

  const reply = (config: InternalAxiosRequestConfig, data: unknown) => ({
    config,
    status: 200,
    statusText: 'OK',
    headers: new AxiosHeaders(),
    data
  })
  const pagination = { page: 1, pageSize: 20, totalItems: 1, totalPages: 1 }
  const period = () => ({
    id: 'p1',
    year: 2026,
    month: 9,
    kind: 'QUARTER',
    state: periodState,
    currency: 'VND',
    closedBy: person,
    closedAt: '2026-10-01T00:00:00Z',
    explanationsDueOn: '2026-10-08',
    signedBy: periodState === 'SIGNED' ? person : null,
    signedAt: periodState === 'SIGNED' ? '2026-10-09T00:00:00Z' : null,
    note: null,
    lightCounts: { GREEN: 1, YELLOW: 0, RED: 1, UNDER: 0 },
    company: {
      spent: vnd('1000'),
      sharedPoolUnallocated: vnd('10'),
      sharedPoolReserve: null,
      sharedPoolOverReserve: null,
      annualCeiling: null
    }
  })
  const line = (id: string, explanationStatus: string) => ({
    id,
    costCenter: costCenters[0],
    base: vnd('100'),
    reserve: vnd('10'),
    spent: vnd('50'),
    spentAfterMonth: vnd('0'),
    changedAfterSnapshot: vnd(id === 'l1' ? '5000' : '0'),
    committed: vnd('0'),
    pendingSpend: vnd('0'),
    remaining: vnd('60'),
    variancePpm: 0,
    priceIncrease: vnd('0'),
    forecast: vnd('90'),
    paceBasisPoints: 11500,
    light: 'RED',
    explanationStatus,
    explanation:
      explanationStatus === 'EXPLAINED'
        ? {
            cause: 'Jira price went up',
            persistence: 'ONGOING',
            action: 'Reclaim 3 seats',
            knownNeedsToYearEnd: { amount: vnd('36000000'), note: 'Figma renewal in September' },
            explainedBy: person,
            explainedAt: '2026-10-03T00:00:00Z'
          }
        : null
  })

  beforeEach(async () => {
    requests = []
    periodState = 'AWAITING_EXPLANATIONS'
    createFails = null
    cycleStatus = 'LOCKED'
    await setAppLanguage('en', false)
    apiClient.defaults.adapter = async (config) => {
      requests.push(config)
      const url = config.url ?? ''
      if (config.method === 'post' && url.endsWith('/budget-adjustments') && createFails) {
        throw new AxiosError('conflict', 'ERR_BAD_REQUEST', config, null, {
          ...reply(config, { success: false, error: createFails }),
          status: 409
        })
      }
      if (config.method === 'get' && /\/budget-cycles\/\d{4}$/.test(url))
        return reply(config, {
          success: true,
          message: 'OK',
          data: { year: 2026, status: cycleStatus, submissionDeadline: '2026-12-31' }
        })
      if (config.method === 'post' && url.endsWith('/signature')) {
        periodState = 'SIGNED'
        return reply(config, { success: true, message: 'OK', data: period() })
      }
      if (config.method === 'post') return reply(config, { success: true, message: 'OK', data: { id: 'a1' } })
      if (config.method === 'get' && url.endsWith('/budget-review-periods'))
        return reply(config, { success: true, message: 'OK', data: { items: [period()], pagination } })
      if (url.includes('/budget-review-periods/p1'))
        return reply(config, {
          success: true,
          message: 'OK',
          data: {
            period: period(),
            items: [line('l1', 'PENDING'), line('l2', 'EXPLAINED')],
            pagination
          }
        })
      if (url.endsWith('/cost-centers'))
        return reply(config, { success: true, message: 'OK', data: { items: costCenters, pagination } })
      return reply(config, { success: true, message: 'OK', data: { items: [], pagination } })
    }
  })
  afterEach(() => {
    apiClient.defaults.adapter = previousAdapter
  })

  const mount = (ui: ReactElement) =>
    render(
      <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
        {ui}
      </QueryClientProvider>
    )
  const posted = () => requests.find((request) => request.method === 'post')

  it('signs a period with a note and warns about lines still waiting for an explanation', async () => {
    mount(<ReviewPeriodDetail id='p1' onBack={() => undefined} />)
    fireEvent.click(await screen.findByRole('button', { name: 'Sign period' }))
    expect(await screen.findByText(/1 Cost Center\(s\) still wait for an explanation/)).toBeTruthy()
    fireEvent.change(screen.getByLabelText(/^Note/), { target: { value: 'Reviewed with leadership' } })
    fireEvent.click(screen.getByRole('button', { name: 'Sign' }))
    await waitFor(() => expect(posted()).toBeTruthy())
    expect(posted()?.url?.endsWith('/budget-review-periods/p1/signature')).toBe(true)
    expect(JSON.parse(posted()?.data)).toEqual({ note: 'Reviewed with leadership' })
  })

  it('shows the real figures of a line and the light only as a coloured signal', async () => {
    mount(<ReviewPeriodDetail id='p1' onBack={() => undefined} />)
    expect((await screen.findAllByText('Year-end forecast')).length).toBeGreaterThan(0)
    expect(screen.getAllByText('Spending pace').length).toBeGreaterThan(0)
    expect(screen.getAllByText('115 % of the calendar').length).toBeGreaterThan(0)
    // The light is a dot named for assistive technology, never a listed value or a count.
    const dots = screen.getAllByRole('img', { name: /Light red: the year-end forecast is above base plus reserve/ })
    expect(dots.length).toBe(2)
    expect(screen.queryByText('Light')).toBeNull()
    expect(screen.queryByText(/Green 1/)).toBeNull()
    // Late invoices: only the line that moved shows the change, and the banner says so.
    expect(screen.getAllByText('Changed after the snapshot').length).toBe(1)
    expect(screen.getByText(/Some invoices arrived after the snapshot/)).toBeTruthy()
  })

  it('shows the explanation the head wrote and waits for the one that is missing', async () => {
    mount(<ReviewPeriodDetail id='p1' onBack={() => undefined} />)
    expect(await screen.findByText('Jira price went up')).toBeTruthy()
    expect(screen.getByText('Ongoing')).toBeTruthy()
    expect(screen.getByText('Reclaim 3 seats')).toBeTruthy()
    expect(screen.getByText('Figma renewal in September')).toBeTruthy()
    expect(screen.getByText(/Waiting for the head of the department/)).toBeTruthy()
  })

  it('lists the periods with who closed and signed them, without light counts', async () => {
    mount(<FinanceReviewPeriodsView />)
    expect((await screen.findAllByText('Closed by')).length).toBeGreaterThan(0)
    expect(screen.getAllByText('Signed by').length).toBeGreaterThan(0)
    expect(screen.queryByText('Lights')).toBeNull()
  })

  it('starts the year filters on the current year instead of an empty box', async () => {
    const year = String(new Date().getFullYear())
    const periods = mount(<FinanceReviewPeriodsView />)
    expect(((await screen.findByLabelText('Year')) as HTMLInputElement).value).toBe(year)
    periods.unmount()
    mount(<FinanceAdjustmentsView />)
    expect(((await screen.findByLabelText('Year')) as HTMLInputElement).value).toBe(year)
  })

  it('does not offer a month that has not ended', async () => {
    const now = new Date()
    mount(<ReviewCloseDialog onClose={() => undefined} onClosed={() => undefined} />)
    fireEvent.change(screen.getByLabelText(/^Year/), { target: { value: String(now.getFullYear()) } })
    const option = await screen.findByRole('option', { name: `Month ${now.getMonth() + 1}` })
    expect((option as HTMLOptionElement).disabled).toBe(true)
  })

  it('hides the sign button once the period is signed', async () => {
    periodState = 'SIGNED'
    mount(<ReviewPeriodDetail id='p1' onBack={() => undefined} />)
    expect(await screen.findByText(/Signed by Finance Person/)).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Sign period' })).toBeNull()
  })

  it('asks only for the Cost Centers a TRANSFER takes and sends the cost-center change reason', async () => {
    mount(<AdjustmentCreateDialog onClose={() => undefined} />)
    expect(screen.queryByText('From Cost Center')).toBeNull()
    fireEvent.change(screen.getByLabelText(/^Kind/), { target: { value: 'TRANSFER' } })
    await screen.findByText('From Cost Center')
    expect(screen.getByText('To Cost Center')).toBeTruthy()
    await screen.findAllByRole('option', { name: 'CC1 · Engineering' })
    fireEvent.change(screen.getByLabelText(/^From Cost Center/), { target: { value: 'cc-1' } })
    fireEvent.change(screen.getByLabelText(/^To Cost Center/), { target: { value: 'cc-1' } })
    expect(screen.getByText('Choose two different Cost Centers.')).toBeTruthy()
    fireEvent.change(screen.getByLabelText(/^To Cost Center/), { target: { value: 'cc-2' } })
    fireEvent.change(screen.getByLabelText(/^Amount/), { target: { value: '5000' } })
    fireEvent.click(screen.getByLabelText('The department changed Cost Center during the year'))
    fireEvent.change(screen.getByLabelText(/^Reason/), { target: { value: 'Team moved' } })
    fireEvent.click(screen.getByRole('button', { name: 'Send for decision' }))
    await waitFor(() => expect(posted()).toBeTruthy())
    expect(JSON.parse(posted()?.data)).toEqual({
      year: new Date().getFullYear(),
      kind: 'TRANSFER',
      amount: { amount: '5000' },
      reason: 'Team moved',
      fromCostCenterId: 'cc-1',
      toCostCenterId: 'cc-2',
      transferReason: 'COST_CENTER_CHANGE'
    })
  })

  it('sends a ceiling reduction with no Cost Center and explains 409 CYCLE_NOT_LOCKED with the deadline', async () => {
    createFails = { code: 'BUDGET_ADJUSTMENT.CYCLE_NOT_LOCKED', details: { submissionDeadline: '2026-12-31' } }
    mount(<AdjustmentCreateDialog onClose={() => undefined} />)
    fireEvent.change(screen.getByLabelText(/^Kind/), { target: { value: 'CEILING_REDUCTION' } })
    fireEvent.change(screen.getByLabelText(/^Amount/), { target: { value: '100' } })
    fireEvent.change(screen.getByLabelText(/^Reason/), { target: { value: 'Lower the ceiling' } })
    fireEvent.click(screen.getByRole('button', { name: 'Send for decision' }))
    await waitFor(() => expect(posted()).toBeTruthy())
    const body = JSON.parse(posted()?.data)
    expect(body.fromCostCenterId).toBeUndefined()
    expect(body.toCostCenterId).toBeUndefined()
    expect(await screen.findByText(/from the day after the submission deadline \(2026-12-31\)/)).toBeTruthy()
  })

  it('blocks lodging an adjustment while the cycle of the year is not locked', async () => {
    cycleStatus = 'OPEN'
    mount(<FinanceAdjustmentsView />)
    expect(await screen.findByText(/from the day after the submission deadline \(2026-12-31\)/)).toBeTruthy()
    expect(screen.getByRole('button', { name: 'New adjustment' })).toBeDisabled()
  })

  it('disables sending in the dialog while the cycle of the chosen year is open', async () => {
    cycleStatus = 'DRAFT'
    mount(<AdjustmentCreateDialog onClose={() => undefined} />)
    expect(await screen.findByText(/from the day after the submission deadline \(2026-12-31\)/)).toBeTruthy()
    fireEvent.change(screen.getByLabelText(/^Kind/), { target: { value: 'CEILING_REDUCTION' } })
    fireEvent.change(screen.getByLabelText(/^Amount/), { target: { value: '100' } })
    fireEvent.change(screen.getByLabelText(/^Reason/), { target: { value: 'Lower the ceiling' } })
    expect(screen.getByRole('button', { name: 'Send for decision' })).toBeDisabled()
  })

  it('reads the submission deadline only from the CYCLE_NOT_LOCKED error', () => {
    expect(cycleNotLockedDeadline(new Error('x'))).toBeNull()
  })

  it('lists adjustments with their state filter', async () => {
    mount(<FinanceAdjustmentsView />)
    fireEvent.change(await screen.findByLabelText(/^State/), { target: { value: 'PENDING' } })
    await waitFor(() =>
      expect(
        requests.some((request) => request.url?.endsWith('/budget-adjustments') && request.params?.state === 'PENDING')
      ).toBe(true)
    )
  })
})
