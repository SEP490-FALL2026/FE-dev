import { AxiosError, AxiosHeaders } from 'axios'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { FinanceBudgetCheckView } from './views/finance-budget-check-view'

vi.mock('react-i18next', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-i18next')>()),
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } })
}))
const requestId = '12345678-1234-4234-8234-123456789012'
const money = { amount: '9007199254740993.25', currency: 'USD' }
const pagination = { page: 1, pageSize: 20, totalItems: 21, totalPages: 2 }
const check = {
  id: 'check',
  number: 1,
  trigger: 'SUBMISSION',
  route: 'FINANCE_REVIEW',
  primaryCode: 'HIGH_VALUE',
  bindingTotal: money,
  yearCount: 21,
  ranAt: '2026-01-01',
  staleCostEvidence: false,
  periodClosed: false,
  planLineOverdue: false,
  offPlan: false,
  noIndependentReview: false
}
let state = 'PENDING'
let employeeId = 'reviewer'
let failMutation = false
let waitingBudget = false
let role = 'FINANCE'
let requests: Array<{ url: string; params: unknown; data: unknown }> = []
const adapter = apiClient.defaults.adapter

beforeEach(() => {
  state = 'PENDING'
  employeeId = 'reviewer'
  failMutation = false
  waitingBudget = false
  role = 'FINANCE'
  requests = []
  apiClient.defaults.adapter = async (config) => {
    const url = config.url ?? ''
    requests.push({ url, params: config.params, data: config.data ? JSON.parse(config.data) : undefined })
    if (config.method === 'post' && failMutation)
      throw new AxiosError('conflict', '409', config, undefined, {
        config,
        data: { success: false, error: { code: 'SPEND.REVIEW_NOT_OPEN' } },
        status: 409,
        statusText: 'Conflict',
        headers: new AxiosHeaders()
      })
    let data: unknown = null
    if (url.endsWith('/me')) data = { employee: { id: employeeId }, roles: [role] }
    else if (url.endsWith('/finance-reviews')) data = { items: [], pagination }
    else if (url.endsWith('/finance-review'))
      data = {
        financeReview: {
          requestId,
          step: { id: 'step', state, waitingReason: null, assignee: { employeeId: 'reviewer', fullName: 'Reviewer' } },
          check,
          review: waitingBudget
            ? { outcome: requests.some((request) => request.data) ? 'ASSESSED' : 'BUDGET_REVISION_NEEDED' }
            : null
        }
      }
    else if (url.endsWith('/years'))
      data = {
        items: [
          {
            year: 2026,
            cost: money,
            code: 'HIGH_VALUE',
            budget: money,
            held: money,
            spent: money,
            remaining: money,
            pending: money,
            shareBasisPoints: 5000,
            overridden: false
          }
        ],
        pagination
      }
    else if (url.endsWith('/budget-check')) data = { budgetCheck: check }
    else if (url.endsWith(requestId))
      data = {
        request: {
          id: requestId,
          state: waitingBudget ? 'AWAITING_BUDGET' : 'COMPLETED',
          requester: { employeeId: 'requester' },
          beneficiary: null
        }
      }
    return { config, data: { success: true, data }, status: 200, statusText: 'OK', headers: new AxiosHeaders() }
  }
})
afterEach(() => {
  apiClient.defaults.adapter = adapter
})
function mount() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  render(
    <QueryClientProvider client={client}>
      <FinanceBudgetCheckView itemId={requestId} />
    </QueryClientProvider>
  )
}

it('posts review outcomes using request codes and retains reason after a rejected write', async () => {
  failMutation = true
  mount()
  const outcome = await screen.findByLabelText('review.outcome')
  fireEvent.change(outcome, { target: { value: 'RETURN_TO_HEAD' } })
  fireEvent.change(screen.getByLabelText('common.reason'), { target: { value: '  Update the quote  ' } })
  fireEvent.click(screen.getByRole('button', { name: 'review.submit' }))
  await waitFor(() => expect(requests.filter((r) => r.data)).toHaveLength(1))
  expect(requests.find((r) => r.data)?.data).toEqual({ outcome: 'RETURN_TO_HEAD', reason: 'Update the quote' })
  await waitFor(() => expect(screen.getByLabelText('common.reason')).toHaveValue('  Update the quote  '))
})

it.each(['WAITING', 'COMPLETED', 'UNRECOGNIZED'])('locks review action for %s state', async (value) => {
  state = value
  mount()
  await screen.findByLabelText('review.outcome')
  expect(screen.getByRole('button', { name: 'review.submit' })).toBeDisabled()
})

it('locks actions when the current employee is not the assigned reviewer', async () => {
  employeeId = 'different'
  mount()
  await screen.findByLabelText('review.outcome')
  expect(screen.getByRole('button', { name: 'review.submit' })).toBeDisabled()
})

it('requires the current effective Finance role as well as the matching employee', async () => {
  role = 'EMPLOYEE'
  mount()
  await screen.findByLabelText('review.outcome')
  fireEvent.change(screen.getByLabelText('review.opinion'), { target: { value: 'Assessment' } })
  expect(screen.getByRole('button', { name: 'review.submit' })).toBeDisabled()
})

it('sends an assessment and direction without a reason', async () => {
  mount()
  fireEvent.change(await screen.findByLabelText('review.opinion'), { target: { value: '  A justified exception  ' } })
  fireEvent.change(screen.getByLabelText('review.direction'), { target: { value: 'RECOMMEND_OVERRIDE' } })
  await waitFor(() => expect(screen.getByRole('button', { name: 'review.submit' })).toBeEnabled())
  fireEvent.click(screen.getByRole('button', { name: 'review.submit' }))
  await waitFor(() =>
    expect(requests.find((r) => r.data)?.data).toEqual({
      outcome: 'ASSESSED',
      opinion: 'A justified exception',
      direction: 'RECOMMEND_OVERRIDE'
    })
  )
})

it('allows an explicitly looked-up waiting-budget request to return to its head after state verification', async () => {
  state = 'COMPLETED'
  waitingBudget = true
  mount()
  fireEvent.change(await screen.findByLabelText('review.outcome'), { target: { value: 'RETURN_TO_HEAD' } })
  fireEvent.change(screen.getByLabelText('common.reason'), { target: { value: 'Revise the proposed service' } })
  await waitFor(() => expect(screen.getByRole('button', { name: 'review.submit' })).toBeEnabled())
  expect(requests.some((r) => r.url.endsWith(requestId))).toBe(true)
  fireEvent.click(screen.getByRole('button', { name: 'review.submit' }))
  await waitFor(() =>
    expect(requests.find((r) => r.data)?.data).toEqual({
      outcome: 'RETURN_TO_HEAD',
      reason: 'Revise the proposed service'
    })
  )
})

it('locks the completed review after leaving waiting-budget even when the old request state is cached', async () => {
  state = 'COMPLETED'
  waitingBudget = true
  mount()
  fireEvent.change(await screen.findByLabelText('review.opinion'), {
    target: { value: 'Budget revision is unnecessary' }
  })
  await waitFor(() => expect(screen.getByRole('button', { name: 'review.submit' })).toBeEnabled())
  fireEvent.click(screen.getByRole('button', { name: 'review.submit' }))
  await waitFor(() => expect(screen.getByLabelText('review.opinion')).toHaveValue(''))
  fireEvent.change(screen.getByLabelText('review.opinion'), { target: { value: 'Another opinion' } })
  expect(screen.getByRole('button', { name: 'review.submit' })).toBeDisabled()
})

it('requests a server page for nested budget years', async () => {
  mount()
  const yearSection = await screen.findByRole('region', { name: 'review.years' })
  const buttons = yearSection.querySelectorAll('button')
  fireEvent.click(buttons[buttons.length - 1])
  await waitFor(() =>
    expect(requests.some((r) => r.url.endsWith('/years') && (r.params as { page?: number })?.page === 2)).toBe(true)
  )
})
