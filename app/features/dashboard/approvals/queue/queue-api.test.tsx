import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AxiosError, type AxiosAdapter, type InternalAxiosRequestConfig } from 'axios'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { ApprovalQueueView } from './views/spend-queue-view'

const originalAdapter = apiClient.defaults.adapter
const calls: InternalAxiosRequestConfig[] = []
const pagination = { page: 1, pageSize: 20, totalItems: 21, totalPages: 2 }
const item = {
  requestId: '83c00000-0000-4000-8000-000000000001',
  stepId: 'step-1',
  openedAt: '2026-10-28T00:00:00Z',
  slaWorkingDays: 3,
  plan: { planId: 'plan-1', applicationName: 'Live application', planName: 'Team' },
  softwareName: null,
  requester: { employeeId: 'employee-1', employeeCode: 'E01', fullName: 'Test requester' },
  beneficiary: { employeeId: 'employee-2', employeeCode: 'E02', fullName: 'Test beneficiary' },
  lineCount: 1,
  costCenter: { id: 'cc-1', code: 'CC-LIVE' },
  amount: { amount: '9007199254740993.25', currency: 'USD' },
  primaryCode: 'BUDGET_OK',
  samePersonAsSpend: false,
  noIndependentReview: false,
  offPlan: false,
  batchId: null
}
function setup(adapter: AxiosAdapter) {
  apiClient.defaults.adapter = adapter
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  render(
    <QueryClientProvider client={client}>
      <ApprovalQueueView onSelectTab={vi.fn()} />
    </QueryClientProvider>
  )
  return client
}
beforeEach(async () => {
  calls.length = 0
  await setAppLanguage('en', false)
})
afterEach(() => {
  apiClient.defaults.adapter = originalAdapter
})

it('renders authoritative queue data, exact money and server pagination', async () => {
  setup(async (config) => {
    calls.push(config)
    return {
      config,
      status: 200,
      statusText: 'OK',
      headers: {},
      data: {
        success: true,
        message: 'SPEND_APPROVAL.LISTED',
        data: { items: [item], pagination: { ...pagination, page: config.params?.page ?? 1 } }
      }
    }
  })
  expect(await screen.findAllByText('Live application')).not.toHaveLength(0)
  expect(screen.getAllByText(/9,007,199,254,740,993.25/)).not.toHaveLength(0)
  fireEvent.click(screen.getByRole('button', { name: 'Next page' }))
  await waitFor(() => expect(calls.some((config) => config.params?.page === 2)).toBe(true))
  expect(screen.getByPlaceholderText('Filter this page by software, requester or Cost Center')).toBeInTheDocument()
})

it('shows an empty state without restoring demo queue rows', async () => {
  setup(async (config) => ({
    config,
    status: 200,
    statusText: 'OK',
    headers: {},
    data: { success: true, data: { items: [], pagination: { ...pagination, totalItems: 0, totalPages: 0 } } }
  }))
  expect(await screen.findByText('No matching records.')).toBeInTheDocument()
  expect(screen.queryByText('REQ-2026-089')).not.toBeInTheDocument()
})

it('shows a recoverable network error without demo fallback', async () => {
  setup(async (config) => {
    throw new AxiosError('offline', 'ERR_NETWORK', config)
  })
  expect(await screen.findByRole('button', { name: 'Retry' })).toBeInTheDocument()
  expect(screen.queryByText('REQ-2026-089')).not.toBeInTheDocument()
})
