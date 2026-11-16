import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { AxiosHeaders } from 'axios'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { formatMoney } from '~/shared/lib/money'
import { addDays, localToday } from './approvals-insights'
import { ApprovalsOverviewView } from './views/approvals-overview-view'

vi.mock('react-i18next', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-i18next')>()),
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } })
}))
const originalAdapter = apiClient.defaults.adapter
const totals: Record<string, number> = {
  '/spend-approvals': 37,
  '/budget-versions': 4
}
let requests: Array<{ url: string; params: Record<string, unknown> }>
beforeEach(() => {
  requests = []
  apiClient.defaults.adapter = async (config) => {
    const params = (config.params ?? {}) as Record<string, unknown>
    requests.push({ url: config.url ?? '', params })
    const path = Object.keys(totals).find((suffix) => config.url?.endsWith(suffix)) ?? ''
    const data = {
      items: [],
      pagination: {
        page: Number(params.page ?? 1),
        pageSize: Number(params.pageSize),
        totalItems: totals[path],
        totalPages: 2
      }
    }
    return { config, data: { success: true, data }, status: 200, statusText: 'OK', headers: new AxiosHeaders() }
  }
})
afterEach(() => {
  apiClient.defaults.adapter = originalAdapter
})

it('shows server totals for the spend queue and the budget versions and opens the matching screen', async () => {
  const onSelectTab = vi.fn()
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <QueryClientProvider client={client}>
      <ApprovalsOverviewView onSelectTab={onSelectTab} />
    </QueryClientProvider>
  )
  for (const total of ['37', '4']) expect(await screen.findByText(total)).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: /spendQueue/ }))
  expect(onSelectTab).toHaveBeenCalledWith('queue')
  fireEvent.click(screen.getByRole('button', { name: /annualBudget/ }))
  expect(onSelectTab).toHaveBeenCalledWith('annual-budget')
  expect(requests.some((request) => request.url.endsWith('/budget-versions') && request.params.state === 'SENT')).toBe(
    true
  )
  expect(requests.every((request) => !request.url.endsWith('/notifications'))).toBe(true)
})

const spendItem = (stepId: string, costCenter: string, amount: string, dueOn: string, outcome: string) => ({
  requestId: `${stepId}-request`,
  stepId,
  stepKind: 'SPEND_APPROVAL',
  openedAt: '2026-11-01T00:00:00Z',
  slaWorkingDays: 3,
  dueOn,
  plan: { planId: 'plan', applicationName: `App ${stepId}`, planName: 'Team' },
  softwareName: null,
  requester: { employeeId: 'employee', employeeCode: 'E01', fullName: 'Requester' },
  beneficiary: null,
  lineCount: 1,
  costCenter: { id: costCenter, code: costCenter },
  amount: { amount, currency: 'VND' },
  outcome,
  samePersonAsSpend: false,
  noIndependentReview: false,
  batchId: stepId === 'late' ? 'batch-1' : null
})
const version = (id: string, costCenter: string, amount: string, state: string) => ({
  id,
  costCenter: { id: costCenter, code: costCenter, name: costCenter },
  year: new Date().getFullYear(),
  number: 1,
  kind: 'INITIAL',
  state,
  total: { amount, currency: 'VND' },
  createdAt: '2026-10-01T00:00:00Z',
  sentAt: '2026-10-02T00:00:00Z'
})

it('builds figures and charts from every waiting request and the budget versions of the year', async () => {
  const today = localToday()
  const spendItems = [
    spendItem('late', 'CC-ENG', '1500000', addDays(today, -1), 'WITHIN_BASE'),
    spendItem('soon', 'CC-ENG', '800000', today, 'BLOCKED'),
    spendItem('later', 'CC-SAL', '1000000', addDays(today, 7), 'WITHIN_BASE')
  ]
  const versions = [
    version('v1', 'CC-ENG', '50000000', 'APPROVED'),
    version('v2', 'CC-SAL', '20000000', 'APPROVED'),
    version('v3', 'CC-HR', '9000000', 'SENT')
  ]
  apiClient.defaults.adapter = async (config) => {
    const params = (config.params ?? {}) as Record<string, unknown>
    requests.push({ url: config.url ?? '', params })
    const full = params.pageSize === 100
    const items = !full
      ? []
      : config.url?.endsWith('/spend-approvals')
        ? spendItems
        : config.url?.endsWith('/budget-versions')
          ? versions
          : []
    const data = {
      items,
      pagination: { page: 1, pageSize: Number(params.pageSize), totalItems: items.length, totalPages: 1 }
    }
    return { config, data: { success: true, data }, status: 200, statusText: 'OK', headers: new AxiosHeaders() }
  }
  const onSelectTab = vi.fn()
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <QueryClientProvider client={client}>
      <ApprovalsOverviewView onSelectTab={onSelectTab} />
    </QueryClientProvider>
  )
  expect(await screen.findByText(formatMoney({ amount: '3300000', currency: 'VND' }, 'en'))).toBeInTheDocument()
  expect(screen.getByText('insights.overdue').nextElementSibling).toHaveTextContent('1')
  expect(screen.getByText('insights.dueSoon').nextElementSibling).toHaveTextContent('1')
  expect(screen.getByText('insights.usesReserve').nextElementSibling).toHaveTextContent('0')
  // Donut legends name every part with its count, so identity never rests on colour alone.
  expect(screen.getByText('status.WITHIN_BASE').closest('li')).toHaveTextContent('2')
  expect(screen.getByText('status.BLOCKED').closest('li')).toHaveTextContent('1')
  expect((await screen.findByText('status.APPROVED')).closest('li')).toHaveTextContent('2')
  expect(screen.getByText('status.SENT').closest('li')).toHaveTextContent('1')
  const [spendTable, budgetTable] = await screen.findAllByRole('button', { name: 'insights.views.table' })
  fireEvent.click(spendTable)
  expect(
    screen.getByRole('cell', { name: formatMoney({ amount: '2300000', currency: 'VND' }, 'en') })
  ).toBeInTheDocument()
  fireEvent.click(budgetTable)
  expect(
    screen.getByRole('cell', { name: formatMoney({ amount: '50000000', currency: 'VND' }, 'en') })
  ).toBeInTheDocument()
  expect(
    screen.queryByRole('cell', { name: formatMoney({ amount: '9000000', currency: 'VND' }, 'en') })
  ).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: /^App late(?!r)/ }))
  expect(onSelectTab).toHaveBeenCalledWith('request', { id: 'late-request', batch: 'batch-1' })
  expect(
    requests.some(
      (request) => request.url.endsWith('/budget-versions') && request.params.year === new Date().getFullYear()
    )
  ).toBe(true)
})
