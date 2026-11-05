import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { AxiosHeaders } from 'axios'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { ApprovalsOverviewView } from './views/approvals-overview-view'

vi.mock('react-i18next', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-i18next')>()),
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } })
}))
const originalAdapter = apiClient.defaults.adapter
const requestId = '12345678-1234-4234-8234-123456789012'
const totals: Record<string, number> = {
  '/spend-approvals': 37,
  '/need-decisions': 5,
  '/budget-versions': 4,
  '/subscription-renewals': 2
}
const needItem = {
  requestId,
  stepId: 'need-step',
  stepKind: 'NEED',
  deciderRole: 'SPENDING_APPROVER',
  type: 'GRANT',
  openedAt: '2026-11-01T00:00:00Z',
  assignedAt: '2026-11-01T00:00:00Z',
  slaWorkingDays: 3,
  dueOn: '2026-11-05',
  plan: { planId: 'plan', planName: 'Team', applicationName: 'Need application' },
  softwareName: null,
  requester: { employeeId: 'head', employeeCode: 'H01', fullName: 'Department head' },
  beneficiary: null,
  lineCount: 1,
  department: { id: 'dept', code: 'ENG', name: 'Engineering' },
  businessReasonExcerpt: 'Project',
  termMonths: 12,
  termConfirmationRequired: false,
  pricing: { status: 'PRICED', amount: { amount: '120.00', currency: 'USD' } },
  planLineRequired: false,
  samePersonAsSpend: false
}
let requests: Array<{ url: string; params: Record<string, unknown> }>
beforeEach(() => {
  requests = []
  apiClient.defaults.adapter = async (config) => {
    const params = (config.params ?? {}) as Record<string, unknown>
    requests.push({ url: config.url ?? '', params })
    const path = Object.keys(totals).find((suffix) => config.url?.endsWith(suffix)) ?? ''
    const listing = path === '/need-decisions' && params.pageSize === 20
    const data = {
      items: listing ? [needItem] : [],
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

it('shows server totals for every work queue and opens the matching screen', async () => {
  const onSelectTab = vi.fn()
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <QueryClientProvider client={client}>
      <ApprovalsOverviewView onSelectTab={onSelectTab} />
    </QueryClientProvider>
  )
  for (const total of ['37', '5', '4', '2']) expect(await screen.findByText(total)).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: /spendQueue/ }))
  expect(onSelectTab).toHaveBeenCalledWith('queue')
  fireEvent.click(screen.getByRole('button', { name: /overview\.renewals/ }))
  expect(onSelectTab).toHaveBeenCalledWith('renewal')
  fireEvent.click(screen.getByRole('button', { name: /annualBudget/ }))
  expect(onSelectTab).toHaveBeenCalledWith('annual-budget')
  expect(requests.some((request) => request.url.endsWith('/budget-versions') && request.params.state === 'SENT')).toBe(
    true
  )
  expect(
    requests.some((request) => request.url.endsWith('/subscription-renewals') && request.params.state === 'PROPOSED')
  ).toBe(true)
  expect(requests.every((request) => !request.url.endsWith('/notifications'))).toBe(true)
})

it('lists need decisions from the need queue and pages on the server', async () => {
  const onSelectTab = vi.fn()
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <QueryClientProvider client={client}>
      <ApprovalsOverviewView onSelectTab={onSelectTab} />
    </QueryClientProvider>
  )
  expect((await screen.findAllByText('Need application')).length).toBeGreaterThan(0)
  fireEvent.click(screen.getAllByRole('button', { name: 'open' })[0])
  expect(onSelectTab).toHaveBeenCalledWith('need', { id: requestId })
  fireEvent.click(screen.getByRole('button', { name: 'next' }))
  await waitFor(() =>
    expect(requests.some((request) => request.url.endsWith('/need-decisions') && request.params.page === 2)).toBe(true)
  )
})
