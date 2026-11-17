import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { configure, render, screen, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it, vi } from 'vitest'
import type { MineResponseDtoDataBudget } from '~/shared/api/generated/model/budgets/mineResponseDtoDataBudget'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { employeeId, planId, requestId } from '../../../../../test/fixtures/employee-api'
import { managerProfile } from '../../../../../test/fixtures/manager-api'
import { ManagerOverviewBudget } from './components/manager-overview-budget'

const year = new Date().getFullYear()
const money = (amount: string) => ({ amount, currency: 'USD' })
const budget: MineResponseDtoDataBudget = {
  costCenter: { id: planId, code: 'ENG-CC', name: 'Engineering' },
  year,
  status: 'ACTIVE',
  base: money('9007199254740993.25'),
  reserve: money('6.75'),
  total: money('9007199254741000.00'),
  committed: money('12.00'),
  spent: money('20.00'),
  pendingSpend: money('3.00'),
  remainingBase: money('9007199254740958.25'),
  remainingWithReserve: money('9007199254740965.00'),
  overBudget: false,
  effectiveBudget: {
    base: money('9007199254740993.25'),
    reserve: money('6.75'),
    total: money('9007199254741000.00'),
    adjustment: money('0')
  },
  cycle: null,
  version: null,
  latestRefusal: null,
  proposal: null
}
const budgetRead = vi.fn()
const departmentRead = vi.fn()
const server = setupServer(
  http.get('*/api/v1/me', () => HttpResponse.json({ success: true, data: managerProfile })),
  http.get('*/api/v1/departments/:id', ({ params }) => {
    departmentRead(params.id)
    return HttpResponse.json({
      success: true,
      data: { id: employeeId, name: 'Engineering', costCenter: { id: planId, code: 'ENG-CC', name: 'Engineering' } }
    })
  }),
  http.get('*/api/v1/budgets/mine', ({ request }) => {
    budgetRead(new URL(request.url).searchParams)
    return HttpResponse.json({ success: true, data: { budget } })
  })
)
beforeAll(() => {
  configure({ asyncUtilTimeout: 5000 })
  server.listen({ onUnhandledRequest: 'error' })
})
afterEach(() => server.resetHandlers())
afterAll(() => {
  configure({ asyncUtilTimeout: 1000 })
  server.close()
})
beforeEach(async () => {
  budgetRead.mockClear()
  departmentRead.mockClear()
  await setAppLanguage('en', false)
})
function mount() {
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <MemoryRouter initialEntries={[`/?departmentId=${requestId}&costCenterId=${requestId}`]}>
        <ManagerOverviewBudget />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

it('uses the current manager department cost center and displays exact amounts', async () => {
  mount()
  expect(await screen.findByText('Cost center: ENG-CC · Engineering')).toBeInTheDocument()
  expect(departmentRead).toHaveBeenCalledWith(employeeId)
  expect(budgetRead).toHaveBeenCalledTimes(1)
  expect(budgetRead.mock.calls[0][0].get('costCenterId')).toBe(planId)
  expect(budgetRead.mock.calls[0][0].get('year')).toBe(String(year))
  const structure = screen.getByRole('region', { name: 'Budget composition' })
  expect(within(structure).getByText(/9,007,199,254,740,993\.25/)).toBeInTheDocument()
  expect(screen.getByRole('region', { name: 'Budget activity' })).toBeInTheDocument()
  expect(screen.getByText('Remaining, including reserve')).toBeInTheDocument()
})

it('does not query a budget when the department has no cost center', async () => {
  server.use(
    http.get('*/api/v1/departments/:id', () =>
      HttpResponse.json({ success: true, data: { id: employeeId, name: 'Engineering', costCenter: null } })
    )
  )
  mount()
  expect(
    await screen.findByText('Your department has no cost center. Contact an administrator to check.')
  ).toBeInTheDocument()
  expect(budgetRead).not.toHaveBeenCalled()
})

it('does not query a department or budget without a current manager scope', async () => {
  server.use(
    http.get('*/api/v1/me', () => HttpResponse.json({ success: true, data: { ...managerProfile, managerScope: null } }))
  )
  mount()
  expect(await screen.findByText('Your current managed department could not be identified.')).toBeInTheDocument()
  expect(departmentRead).not.toHaveBeenCalled()
  expect(budgetRead).not.toHaveBeenCalled()
})

it('does not display a budget returned for a different cost center', async () => {
  server.use(
    http.get('*/api/v1/budgets/mine', () =>
      HttpResponse.json({
        success: true,
        data: { budget: { ...budget, costCenter: { ...budget.costCenter, id: requestId } } }
      })
    )
  )
  mount()
  expect(await screen.findByText('No budget data matches your department’s cost center.')).toBeInTheDocument()
  expect(screen.queryByText('Approved budget')).not.toBeInTheDocument()
})

it('shows an empty state rather than inventing a zero budget', async () => {
  server.use(
    http.get('*/api/v1/budgets/mine', () =>
      HttpResponse.json({ success: true, data: { budget: { ...budget, status: 'NO_ACTIVE_BUDGET', total: null } } })
    )
  )
  mount()
  expect(
    await screen.findByText('Your department’s cost center has no active budget for this year.')
  ).toBeInTheDocument()
  expect(screen.queryByRole('region', { name: 'Budget composition' })).not.toBeInTheDocument()
})

it('keeps negative remaining amounts visible', async () => {
  server.use(
    http.get('*/api/v1/budgets/mine', () =>
      HttpResponse.json({ success: true, data: { budget: { ...budget, remainingWithReserve: money('-0.25') } } })
    )
  )
  mount()
  const chart = await screen.findByRole('region', { name: 'Budget activity' })
  expect(within(chart).getByText(/-\$0\.25/)).toBeInTheDocument()
})

it('does not draw proportions when currencies differ', async () => {
  server.use(
    http.get('*/api/v1/budgets/mine', () =>
      HttpResponse.json({
        success: true,
        data: {
          budget: {
            ...budget,
            effectiveBudget: { ...budget.effectiveBudget, reserve: { amount: '10', currency: 'VND' } }
          }
        }
      })
    )
  )
  mount()
  const chart = await screen.findByRole('region', { name: 'Budget composition' })
  expect(
    within(chart).getByText(
      'Shares are unavailable because figures are missing, use different currencies or do not match the budget total.'
    )
  ).toBeInTheDocument()
})

it('uses effective figures after adjustments while retaining the original approved amount', async () => {
  server.use(
    http.get('*/api/v1/budgets/mine', () =>
      HttpResponse.json({
        success: true,
        data: {
          budget: {
            ...budget,
            effectiveBudget: { base: money('100'), reserve: money('10'), total: money('110'), adjustment: money('-15') }
          }
        }
      })
    )
  )
  mount()
  expect(await screen.findByText('Effective budget')).toBeInTheDocument()
  expect(screen.getByText('$110.00')).toBeInTheDocument()
  expect(screen.getByText('-$15.00')).toBeInTheDocument()
  const structure = screen.getByRole('region', { name: 'Budget composition' })
  expect(within(structure).getByText('$100.00')).toBeInTheDocument()
  expect(within(structure).queryByText(/9,007,199/)).not.toBeInTheDocument()
  expect(screen.getByText(/9,007,199,254,741,000/)).toBeInTheDocument()
})

it('does not substitute the original allocation for a missing effective budget', async () => {
  server.use(
    http.get('*/api/v1/budgets/mine', () =>
      HttpResponse.json({ success: true, data: { budget: { ...budget, effectiveBudget: null } } })
    )
  )
  mount()
  expect(await screen.findByText('No budget data matches your department’s cost center.')).toBeInTheDocument()
  expect(screen.queryByRole('region', { name: 'Budget composition' })).not.toBeInTheDocument()
})

it('shows a remaining percentage against the effective total with exact activity amounts', async () => {
  server.use(
    http.get('*/api/v1/budgets/mine', () =>
      HttpResponse.json({
        success: true,
        data: {
          budget: {
            ...budget,
            total: money('660000000'),
            effectiveBudget: {
              base: money('600000000'),
              reserve: money('60000000'),
              total: money('660000000'),
              adjustment: money('0')
            },
            spent: money('0'),
            committed: money('6540000'),
            pendingSpend: money('3816000'),
            remainingWithReserve: money('649644000')
          }
        }
      })
    )
  )
  mount()
  expect(await screen.findByText('98.4%')).toBeInTheDocument()
  const activity = screen.getByRole('region', { name: 'Budget activity' })
  expect(within(activity).getByText('$649,644,000.00')).toBeInTheDocument()
  expect(within(activity).getByText('$6,540,000.00')).toBeInTheDocument()
  expect(within(activity).getByText('$3,816,000.00')).toBeInTheDocument()
  expect(screen.queryByText(/Bars are scaled/)).not.toBeInTheDocument()
})
