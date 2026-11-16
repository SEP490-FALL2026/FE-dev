import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { i18n, setAppLanguage } from '~/shared/i18n/i18n'
import { finance } from '~/shared/i18n/locales/en/finance'
import { financeRequests } from '~/shared/i18n/locales/en/finance-requests'
import { FinanceRequestMonitorView } from './views/finance-request-monitor-view'

const vnd = (amount: string) => ({ amount, currency: 'VND' })
const person = { employeeId: 'e-1', employeeCode: 'E1', fullName: 'An Nguyen' }
const department = { id: 'd-1', code: 'ENG', name: 'Engineering' }
const plan = { planId: 'p-1', planName: 'Team', applicationId: 'a-1', applicationName: 'Figma' }

describe('Finance request monitor', () => {
  const previousAdapter = apiClient.defaults.adapter
  let requests: InternalAxiosRequestConfig[] = []
  let noReview = false
  const reply = (config: InternalAxiosRequestConfig, data: unknown) => ({
    config,
    status: 200,
    statusText: 'OK',
    headers: new AxiosHeaders(),
    data: { success: true, message: 'OK', data }
  })

  beforeEach(async () => {
    requests = []
    noReview = false
    i18n.addResourceBundle('en', 'financeRequests', financeRequests)
    i18n.addResourceBundle('en', 'finance', finance)
    await setAppLanguage('en', false)
    apiClient.defaults.adapter = async (config) => {
      requests.push(config)
      const url = config.url ?? ''
      if (noReview && url.includes('/budget-check'))
        throw new AxiosError('not found', 'ERR_BAD_REQUEST', config, null, {
          config,
          status: 404,
          statusText: 'Not Found',
          headers: new AxiosHeaders(),
          data: { success: false, error: { code: 'SPEND.REVIEW_NOT_FOUND' } }
        })
      if (url.endsWith('/budget-check/years'))
        return reply(config, {
          items: [
            {
              year: 2027,
              cost: vnd('12000000'),
              code: 'BUDGET_OK',
              effectiveBudget: { base: vnd('1'), reserve: vnd('1'), total: vnd('90000000') },
              held: vnd('0'),
              remaining: vnd('78000000')
            }
          ],
          pagination: { page: 1, pageSize: 20, totalItems: 1, totalPages: 1 }
        })
      if (url.endsWith('/budget-check'))
        return reply(config, {
          budgetCheck: {
            id: 'c-1',
            outcome: 'USES_RESERVE',
            blockedReasons: [],
            overBy: null,
            bindingTotal: vnd('12000000'),
            nextYearBudget: null
          }
        })
      if (url.endsWith('/access-requests/req-1'))
        return reply(config, {
          request: {
            id: 'req-1',
            type: 'GRANT',
            state: 'AWAITING_EXECUTION',
            plan,
            department,
            costCenter: { id: 'cc-1', code: 'CC-ENG' },
            requester: person,
            beneficiary: null,
            termMonths: 6,
            budgetYear: 2027,
            businessReason: 'Design handoff',
            submittedAt: '2026-11-01T00:00:00Z'
          }
        })
      return reply(config, {
        items: [
          {
            id: 'req-1',
            type: 'GRANT',
            state: 'AWAITING_EXECUTION',
            softwareName: 'Figma',
            plan,
            department,
            requester: person,
            reserveUsed: true,
            submittedAt: '2026-11-01T00:00:00Z'
          }
        ],
        pagination: { page: 1, pageSize: 20, totalItems: 1, totalPages: 1 }
      })
    }
  })
  afterEach(() => {
    apiClient.defaults.adapter = previousAdapter
  })

  const mount = (ui: React.ReactNode) =>
    render(
      <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
        {ui}
      </QueryClientProvider>
    )

  it('lists the Requests Finance oversees and opens one', async () => {
    const onSelectTab = vi.fn()
    mount(<FinanceRequestMonitorView onSelectTab={onSelectTab} />)
    expect((await screen.findAllByText('Figma')).length).toBeGreaterThan(0)
    expect(screen.getAllByText('Approved, awaiting execution').length).toBeGreaterThan(0)
    fireEvent.click(screen.getAllByRole('button', { name: finance.open })[0])
    expect(onSelectTab).toHaveBeenCalledWith('request-monitor', { id: 'req-1' })
  })

  it('filters by progress and type on the server', async () => {
    mount(<FinanceRequestMonitorView />)
    await screen.findAllByText('Figma')
    fireEvent.change(screen.getByLabelText('Progress'), { target: { value: 'open' } })
    await waitFor(() => expect(requests.some((request) => request.params?.view === 'open')).toBe(true))
  })

  it('shows the detail with the budget check and the figures of each year, read only', async () => {
    mount(<FinanceRequestMonitorView itemId='req-1' />)
    expect(await screen.findByText('Design handoff')).toBeTruthy()
    expect(await screen.findByText('Uses the reserve')).toBeTruthy()
    expect((await screen.findAllByText('Budget is enough')).length).toBeGreaterThan(0)
    expect(requests.every((request) => request.method === 'get')).toBe(true)
  })

  it('says the Request is not budget-checked yet on 404 SPEND.REVIEW_NOT_FOUND, not a generic error', async () => {
    noReview = true
    mount(<FinanceRequestMonitorView itemId='req-1' />)
    expect(await screen.findByText(/has not been budget-checked yet/)).toBeTruthy()
    expect(screen.queryByText(/Retry/)).toBeNull()
  })
})
