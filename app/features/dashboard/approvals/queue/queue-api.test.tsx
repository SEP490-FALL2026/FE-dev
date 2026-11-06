import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router'
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
  dueOn: '2026-10-31',
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
function setup(adapter: AxiosAdapter, onSelectTab = vi.fn(), initialUrl = '/?tab=queue') {
  apiClient.defaults.adapter = adapter
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  render(
    <MemoryRouter initialEntries={[initialUrl]}>
      <QueryClientProvider client={client}>
        <ApprovalQueueView onSelectTab={onSelectTab} />
      </QueryClientProvider>
    </MemoryRouter>
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
  expect(screen.getByPlaceholderText('E.g. Figma, Nguyen Van A or CC-ENG')).toBeInTheDocument()
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

it('keeps the queue compact and carries the batch into the request detail', async () => {
  const batchId = '81000000-0000-4000-8000-000000000001'
  const onSelectTab = vi.fn()
  setup(
    async (config) => ({
      config,
      status: 200,
      statusText: 'OK',
      headers: {},
      data: { success: true, data: { items: [{ ...item, batchId }], pagination } }
    }),
    onSelectTab
  )
  expect(await screen.findAllByText('Live application')).not.toHaveLength(0)
  expect(screen.getAllByText('CC-LIVE')).not.toHaveLength(0)
  expect(screen.queryByRole('columnheader', { name: 'Submission ID' })).not.toBeInTheDocument()
  expect(screen.queryByRole('columnheader', { name: 'Opened' })).not.toBeInTheDocument()
  expect(screen.queryByText('Open by ID')).not.toBeInTheDocument()
  fireEvent.click(screen.getAllByRole('button', { name: 'View details' })[0])
  expect(onSelectTab).toHaveBeenCalledWith('request', { id: item.requestId, batch: batchId })
})

const needItem = {
  requestId: '12345678-1234-4234-8234-123456789012',
  stepId: 'need-step',
  stepKind: 'NEED',
  deciderRole: 'SPENDING_APPROVER',
  type: 'GROUP_GRANT',
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
  pricing: { status: 'PRICED', amount: { amount: '120.00', currency: 'USD' } },
  samePersonAsSpend: false
}

function bothQueues(): AxiosAdapter {
  return async (config) => {
    calls.push(config)
    const isNeed = config.url?.endsWith('/need-decisions') ?? false
    const total = isNeed ? 5 : 37
    return {
      config,
      status: 200,
      statusText: 'OK',
      headers: {},
      data: {
        success: true,
        data: {
          items: isNeed ? [needItem] : [item],
          pagination: { page: config.params?.page ?? 1, pageSize: 20, totalItems: total, totalPages: 2 }
        }
      }
    }
  }
}

it('shows both lists with server totals and switches through the URL', async () => {
  const onSelectTab = vi.fn()
  setup(bothQueues(), onSelectTab)
  expect(await screen.findByRole('button', { name: /^Spend decisions\s*37$/ })).toHaveAttribute('aria-pressed', 'true')
  expect(await screen.findByRole('button', { name: /^Department heads' requests\s*5$/ })).toHaveAttribute(
    'aria-pressed',
    'false'
  )
  fireEvent.click(screen.getByRole('button', { name: /Department heads' requests/ }))
  expect(onSelectTab).toHaveBeenCalledWith('queue', { list: 'need' })
})

it('lists need confirmations on the server and opens the need detail', async () => {
  const onSelectTab = vi.fn()
  setup(bothQueues(), onSelectTab, '/?tab=queue&list=need')
  expect((await screen.findAllByText('Need application')).length).toBeGreaterThan(0)
  expect(screen.queryByText('Live application')).not.toBeInTheDocument()
  fireEvent.click(screen.getAllByRole('button', { name: 'View details' })[0])
  expect(onSelectTab).toHaveBeenCalledWith('need', { id: needItem.requestId })
  fireEvent.click(screen.getByRole('button', { name: 'Next page' }))
  await waitFor(() =>
    expect(calls.some((config) => config.url?.endsWith('/need-decisions') && config.params?.page === 2)).toBe(true)
  )
})
