import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { MemoryRouter } from 'react-router'
import { toast } from 'sonner'
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

describe('Spending Approver renewal decision', () => {
  it('shows usage as not assessable and returns to the list from the full-page detail', async () => {
    const onSelectTab = vi.fn()
    mount(<RenewalDetailView renewalId={renewalId} onSelectTab={onSelectTab} />)
    expect(await screen.findByText('Usage cannot be assessed yet. This does not mean zero users.')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Back to list' }))
    expect(onSelectTab).toHaveBeenCalledWith('renewal', {})
  })

  it('requires exactly the excess seats for a reduction and sends the strict body', async () => {
    const success = vi.spyOn(toast, 'success')
    mount(<RenewalDetailView renewalId={renewalId} onSelectTab={vi.fn()} />)
    fireEvent.click(await screen.findByRole('button', { name: 'Reduce seats' }))
    fireEvent.change(screen.getByPlaceholderText('For example: 8'), { target: { value: '1' } })
    fireEvent.change(screen.getByPlaceholderText('For example: Two teams moved to another tool, keep 8 seats'), {
      target: { value: '  Lower demand  ' }
    })
    fireEvent.click(await screen.findByRole('checkbox', { name: 'Take back the seat of Holder 1' }))
    fireEvent.click(screen.getByRole('button', { name: 'Record decision' }))
    expect(await screen.findByText('Select exactly 2 seats, 1 selected.')).toBeInTheDocument()
    expect(posted).toHaveLength(0)

    fireEvent.click(screen.getByRole('checkbox', { name: 'Take back the seat of Holder 2' }))
    expect(screen.getByRole('checkbox', { name: 'Take back the seat of Holder 3' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Record decision' }))
    await waitFor(() => expect(posted).toHaveLength(1))
    expect(posted[0]).toEqual({
      choice: 'REDUCE',
      quantity: 1,
      reason: 'Lower demand',
      releasedAssignmentIds: [seat(1).assignmentId, seat(2).assignmentId]
    })
    await waitFor(() => expect(success).toHaveBeenCalledWith('Renewal decision recorded.', expect.anything()))
  })

  it('requires acknowledging active users before cancelling', async () => {
    mount(<RenewalDetailView renewalId={renewalId} onSelectTab={vi.fn()} />)
    fireEvent.click(await screen.findByRole('button', { name: 'Cancel subscription' }))
    expect(screen.getByRole('button', { name: 'Cancel subscription' })).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(screen.getByRole('button', { name: 'Record decision' }))
    expect(await screen.findByText('Confirm the cancellation while people still use it.')).toBeInTheDocument()
    fireEvent.click(
      screen.getByRole('checkbox', { name: 'I confirm the cancellation although 3 seats are still held' })
    )
    fireEvent.click(screen.getByRole('button', { name: 'Record decision' }))
    await waitFor(() => expect(posted).toHaveLength(1))
    expect(posted[0]).toEqual({ choice: 'CANCEL', acknowledgeActiveUsers: true })
  })

  it('maps documented error codes to translated messages, keeps the draft and never shows server text', async () => {
    const error = vi.spyOn(toast, 'error')
    mutationError = { status: 409, code: 'SUBSCRIPTION_RENEWAL.NOT_AWAITING_DECISION' }
    mount(<RenewalDetailView renewalId={renewalId} onSelectTab={vi.fn()} />)
    fireEvent.click(await screen.findByRole('button', { name: 'Renew as is' }))
    const reason = screen.getByPlaceholderText('For example: Two teams moved to another tool, keep 8 seats')
    fireEvent.change(reason, { target: { value: 'Keep as is' } })
    fireEvent.click(screen.getByRole('button', { name: 'Record decision' }))
    await waitFor(() =>
      expect(error).toHaveBeenCalledWith(
        'This renewal is no longer awaiting a decision. The data has been reloaded.',
        expect.objectContaining({ id: 'approvals-renewal-decision' })
      )
    )
    expect(posted[0]).toEqual({ choice: 'RENEW', reason: 'Keep as is' })
    expect(reason).toHaveValue('Keep as is')
    expect(screen.queryByText('Internal detail')).not.toBeInTheDocument()
  })

  it('locks the form when the caller is not the decider', async () => {
    vi.spyOn(toast, 'error')
    mutationError = { status: 403, code: 'SUBSCRIPTION_RENEWAL.NOT_DECIDER' }
    mount(<RenewalDetailView renewalId={renewalId} onSelectTab={vi.fn()} />)
    fireEvent.click(await screen.findByRole('button', { name: 'Renew as is' }))
    fireEvent.click(screen.getByRole('button', { name: 'Record decision' }))
    expect(await screen.findByText('You cannot decide this renewal.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Record decision' })).toBeDisabled()
    expect(toast.error).toHaveBeenCalledWith('You are not the person who decides this renewal.', expect.anything())
  })
})
