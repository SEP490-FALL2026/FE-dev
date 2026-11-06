import { fireEvent, render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { RenewalDetailView } from './views/renewal-detail-view'
import { RenewalListView } from './views/renewal-list-view'

const renewalId = '3f6c2a1e-7b4d-4c8e-9a21-000000000101'
const subscription = {
  id: '3f6c2a1e-7b4d-4c8e-9a21-000000000102',
  planId: '3f6c2a1e-7b4d-4c8e-9a21-000000000103',
  planName: 'Business',
  applicationId: '3f6c2a1e-7b4d-4c8e-9a21-000000000104',
  applicationName: 'Design Suite',
  ownerDepartmentId: '3f6c2a1e-7b4d-4c8e-9a21-000000000105'
}
const pagination = (totalItems: number) => ({ page: 1, pageSize: 20, totalItems, totalPages: totalItems ? 1 : 0 })
const listItem = {
  id: renewalId,
  state: 'PROPOSED',
  subscription,
  milestone: { basis: 'DECLARED', baseDate: '2026-12-01' },
  proposedChoice: 'REDUCE',
  proposedQuantity: 8,
  decidedChoice: null,
  executionPoint: null,
  outcome: null,
  lateFlagged: false,
  waitingReason: null,
  proposedAt: '2026-11-01T03:15:00.000Z'
}
const detail = () => ({
  ...listItem,
  period: {
    purchasedQuantity: 10,
    billingCycle: 'ANNUAL',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    renewalDate: '2027-01-01',
    autoRenew: true,
    allowsMidTermReduction: false,
    seatsInUse: 3
  },
  usage: { status: 'NOT_AVAILABLE' },
  proposal: {
    choice: 'REDUCE',
    quantity: 8,
    note: 'Two teams moved away.',
    businessOwnerOpinion: null,
    proposedByEmployeeId: '3f6c2a1e-7b4d-4c8e-9a21-000000000106',
    proposedAt: '2026-11-01T03:15:00.000Z'
  },
  decision: null,
  lateFlaggedAt: null,
  outcomeDetail: null
})
const seat = (index: number) => ({
  assignmentId: `3f6c2a1e-7b4d-4c8e-9a21-00000000020${index}`,
  employee: { id: `employee-${index}`, employeeCode: `E0${index}`, fullName: `Holder ${index}` },
  group: 'OTHER',
  position: index,
  validFrom: '2026-01-01',
  lastActivityOn: null
})

const originalAdapter = apiClient.defaults.adapter
let requests: InternalAxiosRequestConfig[] = []
let posted: unknown[] = []
let mutationError: { status: number; code: string; details?: Record<string, unknown> } | null = null

beforeEach(async () => {
  requests = []
  posted = []
  mutationError = null
  await setAppLanguage('en', false)
  apiClient.defaults.adapter = async (config) => {
    requests.push(config)
    const ok = (data: unknown) => ({
      config,
      status: 200,
      statusText: 'OK',
      headers: {},
      data: { success: true, message: 'TEST', data }
    })
    if (config.method === 'post') {
      posted.push(JSON.parse(config.data as string))
      if (mutationError)
        throw new AxiosError('rejected', 'ERR_BAD_REQUEST', config, undefined, {
          config,
          status: mutationError.status,
          statusText: 'Error',
          headers: {},
          data: {
            success: false,
            error: { code: mutationError.code, message: 'Internal detail', details: mutationError.details }
          }
        })
      return ok({ renewal: { ...detail(), state: 'DECIDED' } })
    }
    if (config.url?.endsWith('/me')) return ok({ employee: { id: 'approver' } })
    if (config.url?.endsWith('/seat-ranking'))
      return ok({
        usage: { status: 'NOT_AVAILABLE' },
        seatsInUse: 3,
        items: [1, 2, 3].map(seat),
        pagination: pagination(3)
      })
    if (config.url?.endsWith(`/subscription-renewals/${renewalId}`)) return ok({ renewal: detail() })
    if (config.url?.endsWith('/subscription-renewals')) return ok({ items: [listItem], pagination: pagination(1) })
    if (config.url?.endsWith('/subscription-deadline-events')) return ok({ items: [], pagination: pagination(0) })
    throw new AxiosError('unexpected test request', 'ERR_NETWORK', config)
  }
})
afterEach(() => {
  apiClient.defaults.adapter = originalAdapter
  vi.restoreAllMocks()
})

function mount(node: React.ReactNode, entry = '/?tab=renewal') {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  render(
    <MemoryRouter initialEntries={[entry]}>
      <QueryClientProvider client={client}>{node}</QueryClientProvider>
    </MemoryRouter>
  )
}

describe('Spending Approver renewal list', () => {
  it('loads the PROPOSED queue by default and keeps filters when opening a case', async () => {
    const onSelectTab = vi.fn()
    mount(<RenewalListView onSelectTab={onSelectTab} />)
    expect(await screen.findAllByText('Design Suite')).not.toHaveLength(0)
    const list = requests.find((request) => request.url?.endsWith('/subscription-renewals'))
    expect(list?.params).toEqual({ state: 'PROPOSED', page: 1, pageSize: 20 })
    expect(screen.getByRole('button', { name: 'Awaiting decision' })).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(screen.getByRole('button', { name: 'All statuses' }))
    expect(onSelectTab).toHaveBeenLastCalledWith('renewal', { state: 'ALL' })
    fireEvent.change(screen.getByRole('combobox', { name: 'Late flag' }), { target: { value: 'true' } })
    expect(onSelectTab).toHaveBeenLastCalledWith('renewal', { late: 'true' })

    fireEvent.click(screen.getAllByRole('button', { name: 'View details' })[0])
    expect(onSelectTab).toHaveBeenLastCalledWith('renewal', { id: renewalId })
    expect(screen.getByText('No missed milestones.')).toBeInTheDocument()
  })

  it('sends the late and all-state filters from the URL without a UI-only state value', async () => {
    mount(<RenewalListView onSelectTab={vi.fn()} />, '/?tab=renewal&state=ALL&late=true')
    await screen.findAllByText('Design Suite')
    const list = requests.find((request) => request.url?.endsWith('/subscription-renewals'))
    expect(list?.params).toEqual({ late: 'true', page: 1, pageSize: 20 })
  })
})

describe('Spending Approver renewal detail', () => {
  it('shows the proposal read only without decision or seat ranking operations', async () => {
    const onSelectTab = vi.fn()
    mount(<RenewalDetailView renewalId={renewalId} onSelectTab={onSelectTab} />)
    expect(await screen.findByText('Usage cannot be assessed yet. This does not mean zero users.')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Record decision' })).not.toBeInTheDocument()
    expect(requests.some((request) => request.url?.endsWith('/seat-ranking'))).toBe(false)
    expect(posted).toHaveLength(0)
    fireEvent.click(screen.getByRole('button', { name: 'Back to list' }))
    expect(onSelectTab).toHaveBeenCalledWith('renewal', {})
  })
})
