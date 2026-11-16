import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { delay, http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { employeeId, pageResponse, planId, requestId } from '../../../../../test/fixtures/employee-api'
import { managerReadHandlers } from '../../../../../test/fixtures/manager-integration'
import { managerProfile } from '../../../../../test/fixtures/manager-api'
import {
  budgetAdjustment,
  reviewLine,
  reviewPeriod,
  savedExplanation,
  seatMonthCharge
} from '../../../../../test/fixtures/manager-budget-review'
import { ManagerLiveBudget } from './views/manager-live-budget'

const reads = vi.fn()
const written = vi.fn()
let explained = false
let signed = false
const server = setupServer(
  http.get('*/api/v1/budget-review-periods', ({ request }) => {
    reads('reviews', new URL(request.url).searchParams)
    return HttpResponse.json(pageResponse([reviewPeriod]))
  }),
  http.get('*/api/v1/budget-review-periods/:id', () => {
    reads('review')
    return HttpResponse.json({
      success: true,
      data: {
        period: { ...reviewPeriod, state: signed ? 'SIGNED' : reviewPeriod.state },
        ...pageResponse([
          { ...reviewLine, ...(explained ? { explanation: savedExplanation, explanationStatus: 'EXPLAINED' } : {}) }
        ]).data
      }
    })
  }),
  http.put('*/api/v1/budget-review-periods/:id/lines/:costCenterId/explanation', async ({ request, params }) => {
    written(params.id, params.costCenterId, await request.json())
    await delay(80)
    explained = true
    return HttpResponse.json({ success: true, data: { explanation: savedExplanation } })
  }),
  http.get('*/api/v1/seat-month-charges', ({ request }) => {
    reads('charges', new URL(request.url).searchParams)
    return HttpResponse.json({
      ...pageResponse([seatMonthCharge]),
      data: { ...pageResponse([seatMonthCharge]).data, poolLines: [] }
    })
  }),
  http.get('*/api/v1/budget-adjustments', ({ request }) => {
    reads('adjustments', new URL(request.url).searchParams)
    return HttpResponse.json(pageResponse([budgetAdjustment]))
  }),
  ...managerReadHandlers
)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
beforeEach(async () => {
  explained = false
  signed = false
  reads.mockClear()
  written.mockClear()
  await setAppLanguage('en', false)
})
function mount(view: string, extra = '') {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[`/dashboard/manager?tab=annual-budget&year=2026&budgetView=${view}${extra}`]}>
        <ManagerLiveBudget />
      </MemoryRouter>
    </QueryClientProvider>
  )
}
const openReview = () => mount('reviews', `&reviewId=${requestId}`)
async function fillExplanation() {
  fireEvent.click(await screen.findByRole('button', { name: 'Add explanation' }))
  const dialog = screen.getByRole('dialog')
  fireEvent.change(within(dialog).getByLabelText('Cause'), { target: { value: savedExplanation.cause } })
  fireEvent.change(within(dialog).getByLabelText('Duration of the cause'), { target: { value: 'ONGOING' } })
  fireEvent.change(within(dialog).getByLabelText('Department action'), { target: { value: savedExplanation.action } })
  fireEvent.change(within(dialog).getByLabelText('Known needs through year-end (VND)'), {
    target: { value: '9007199254740993' }
  })
  fireEvent.change(within(dialog).getByLabelText('Known needs through year-end'), {
    target: { value: savedExplanation.knownNeedsToYearEnd.note }
  })
  return dialog
}

it('lists review periods for the selected year without requesting hidden budget sections', async () => {
  mount('reviews')
  await screen.findByText('Quarterly review')
  expect(reads.mock.calls.find(([kind]) => kind === 'reviews')?.[1].get('year')).toBe('2026')
  expect(reads.mock.calls.some(([kind]) => kind === 'charges' || kind === 'adjustments')).toBe(false)
})

it('replaces the complete explanation with exact VND strings once, then reloads the review', async () => {
  openReview()
  const dialog = await fillExplanation()
  const save = within(dialog).getByRole('button', { name: 'Save' })
  fireEvent.click(save)
  fireEvent.click(save)
  await waitFor(() => expect(written).toHaveBeenCalledOnce())
  expect(written).toHaveBeenCalledWith(requestId, employeeId, {
    cause: savedExplanation.cause,
    persistence: 'ONGOING',
    action: savedExplanation.action,
    knownNeedsToYearEnd: { amount: { amount: '9007199254740993' }, note: savedExplanation.knownNeedsToYearEnd.note }
  })
  expect(await screen.findByText('Explained')).toBeInTheDocument()
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})

it.each(['GREEN', 'SIGNED', 'UNKNOWN_LIGHT'])('does not allow an explanation for %s', async (condition) => {
  server.use(
    http.get('*/api/v1/budget-review-periods/:id', () =>
      HttpResponse.json({
        success: true,
        data: {
          period: { ...reviewPeriod, state: condition === 'SIGNED' ? 'SIGNED' : reviewPeriod.state },
          ...pageResponse([
            {
              ...reviewLine,
              light: condition === 'GREEN' ? 'GREEN' : condition === 'UNKNOWN_LIGHT' ? 'FUTURE_LIGHT' : 'RED'
            }
          ]).data
        }
      })
    )
  )
  openReview()
  await screen.findByText('Spending pace')
  expect(screen.queryByRole('button', { name: /explanation/i })).not.toBeInTheDocument()
})

it('reloads a review signed while the explanation form was open', async () => {
  server.use(
    http.put('*/api/v1/budget-review-periods/:id/lines/:costCenterId/explanation', () => {
      signed = true
      return HttpResponse.json({ error: { code: 'BUDGET_REVIEW.NOT_AWAITING_EXPLANATIONS' } }, { status: 409 })
    })
  )
  openReview()
  const dialog = await fillExplanation()
  fireEvent.click(within(dialog).getByRole('button', { name: 'Save' }))
  expect(await screen.findByText('Signed')).toBeInTheDocument()
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})

it('hides a review returned for another year or cost center', async () => {
  server.use(
    http.get('*/api/v1/budget-review-periods/:id', () =>
      HttpResponse.json({
        success: true,
        data: {
          period: reviewPeriod,
          ...pageResponse([{ ...reviewLine, costCenter: { id: planId, code: 'PRIVATE', name: 'Other department' } }])
            .data
        }
      })
    )
  )
  openReview()
  expect(await screen.findByText('No budget data matches the selected department and year.')).toBeInTheDocument()
  expect(screen.queryByText('Other department')).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Add explanation' })).not.toBeInTheDocument()
})

it('queries seat-months by current cost center and resets pagination when the month changes', async () => {
  mount('charges', `&month=9&chargePage=3&costCenterId=${requestId}`)
  expect(await screen.findByText('Test Employee')).toBeInTheDocument()
  const first = reads.mock.calls.find(([kind]) => kind === 'charges')?.[1]
  expect(first.get('costCenterId')).toBe(employeeId)
  expect(first.get('page')).toBe('3')
  expect(first.get('month')).toBe('9')
  fireEvent.change(screen.getByLabelText('Month'), { target: { value: '10' } })
  await waitFor(() =>
    expect(
      reads.mock.calls
        .filter(([kind]) => kind === 'charges')
        .at(-1)?.[1]
        .get('month')
    ).toBe('10')
  )
  expect(
    reads.mock.calls
      .filter(([kind]) => kind === 'charges')
      .at(-1)?.[1]
      .get('page')
  ).toBe('1')
})

it('shows adjustments read-only and sends the generated state filter', async () => {
  mount('adjustments')
  await screen.findByText('Supplement')
  expect(screen.queryByRole('button', { name: /approve|reject|create/i })).not.toBeInTheDocument()
  fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'APPROVED' } })
  await waitFor(() =>
    expect(
      reads.mock.calls
        .filter(([kind]) => kind === 'adjustments')
        .at(-1)?.[1]
        .get('state')
    ).toBe('APPROVED')
  )
  expect(
    reads.mock.calls
      .filter(([kind]) => kind === 'adjustments')
      .at(-1)?.[1]
      .get('costCenterId')
  ).toBe(employeeId)
})

it('does not load current in-year figures for an upcoming department head', async () => {
  server.use(
    http.get('*/api/v1/me', () =>
      HttpResponse.json({
        success: true,
        data: {
          ...managerProfile,
          managerScope: null,
          upcomingUnits: [
            {
              departmentId: planId,
              departmentCode: 'NEW',
              departmentName: 'Upcoming',
              effectiveFrom: '2027-01-01',
              costCenterId: employeeId
            }
          ]
        }
      })
    )
  )
  mount('reviews')
  expect(
    await screen.findByText(
      'In-year figures are available for the department you currently manage. Select that department to continue.'
    )
  ).toBeInTheDocument()
  expect(reads).not.toHaveBeenCalled()
})

it('preserves retry for a read failure', async () => {
  let failed = true
  server.use(
    http.get('*/api/v1/budget-review-periods', () =>
      failed
        ? HttpResponse.json({ error: { code: 'SERVICE_UNAVAILABLE' } }, { status: 503 })
        : HttpResponse.json(pageResponse([reviewPeriod]))
    )
  )
  mount('reviews')
  await screen.findByText('Unable to load data. Try again.')
  failed = false
  fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
  expect(await screen.findByText('Quarterly review')).toBeInTheDocument()
})
