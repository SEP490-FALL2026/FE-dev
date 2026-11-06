import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { toast } from 'sonner'
import { apiClient } from '~/shared/api/axios-client'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { isApprovalRelatedKey } from '../shared/approvals-query-keys'
import { ApprovalBatchView } from './views/spend-batch-view'

const batchId = '81000000-0000-4000-8000-000000000001'
const firstRequestId = '81000000-0000-4000-8000-000000000002'
const skippedRequestId = '81000000-0000-4000-8000-000000000003'
const financeRequestId = '81000000-0000-4000-8000-000000000004'
const originalAdapter = apiClient.defaults.adapter
const clients: QueryClient[] = []
const calls: InternalAxiosRequestConfig[] = []
let failMutation = false
let financeState = 'AWAITING_FINANCE_REVIEW'
const batch = {
  id: batchId,
  department: { id: 'department', code: 'CC-ENG' },
  submittedBy: { employeeId: 'employee', employeeCode: 'E01', fullName: 'Batch sender' },
  submittedAt: '2026-10-30T00:00:00Z',
  itemCount: 51
}
const items = [
  {
    requestId: firstRequestId,
    position: 1,
    outcome: 'SENT_TO_APPROVER',
    stopReason: null,
    leftReason: null,
    leftAt: null,
    requestState: 'AWAITING_SPEND_DECISION'
  },
  {
    requestId: skippedRequestId,
    position: 2,
    outcome: 'SENT_TO_APPROVER',
    stopReason: null,
    leftReason: null,
    leftAt: null,
    requestState: 'AWAITING_SPEND_DECISION'
  },
  {
    requestId: financeRequestId,
    position: 3,
    outcome: 'SENT_TO_FINANCE',
    stopReason: null,
    leftReason: null,
    leftAt: null,
    requestState: 'AWAITING_FINANCE_REVIEW'
  }
]

function setup() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  clients.push(client)
  render(
    <QueryClientProvider client={client}>
      <ApprovalBatchView itemId={batchId} onSelectTab={vi.fn()} />
    </QueryClientProvider>
  )
  return client
}

beforeEach(async () => {
  calls.length = 0
  failMutation = false
  financeState = 'AWAITING_FINANCE_REVIEW'
  await setAppLanguage('en', false)
  apiClient.defaults.adapter = async (config) => {
    calls.push(config)
    if (config.method === 'post') {
      if (failMutation)
        throw new AxiosError('Private error', undefined, config, undefined, {
          config,
          status: 422,
          statusText: 'Invalid',
          headers: new AxiosHeaders(),
          data: { error: { code: 'VALIDATION_ERROR' } }
        })
      return {
        config,
        status: 200,
        statusText: 'OK',
        headers: {},
        data: {
          success: true,
          data: {
            results: [
              { requestId: firstRequestId, outcome: 'APPROVED', reason: null },
              { requestId: skippedRequestId, outcome: 'SKIPPED', reason: 'OVERRIDE_REQUIRED' }
            ]
          }
        }
      }
    }
    const data = config.url?.endsWith('/items')
      ? {
          items: items.map((item) =>
            item.requestId === financeRequestId ? { ...item, requestState: financeState } : item
          ),
          pagination: { page: config.params?.page ?? 1, pageSize: 50, totalItems: 51, totalPages: 2 }
        }
      : { batch }
    return { config, status: 200, statusText: 'OK', headers: {}, data: { success: true, data } }
  }
})

afterEach(() => {
  apiClient.defaults.adapter = originalAdapter
  clients.forEach((client) => client.clear())
  clients.length = 0
  vi.restoreAllMocks()
})

describe('Spending Approver batch API', () => {
  it('allows a reviewed Finance request that is now awaiting the spending decision', async () => {
    financeState = 'AWAITING_SPEND_DECISION'
    setup()
    const controls = await screen.findAllByRole('checkbox', { name: 'Select request #3' })
    expect(controls[0]).toBeEnabled()
  })
  it('paginates on the server and only selects eligible visible requests', async () => {
    setup()
    expect(await screen.findByText('Batch sender')).toBeInTheDocument()
    expect(screen.getAllByRole('checkbox', { name: 'Select request #3' })[0]).toBeDisabled()
    fireEvent.click(screen.getAllByRole('checkbox', { name: 'Select request #1' })[0])
    expect(screen.getByText('1 requests selected')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }))
    await waitFor(() => expect(calls.some((config) => config.params?.page === 2)).toBe(true))
    expect(await screen.findByText('0 requests selected')).toBeInTheDocument()
  })

  it('sends a strict decision and reports partial skips without a success toast', async () => {
    const warning = vi.spyOn(toast, 'warning')
    const success = vi.spyOn(toast, 'success')
    setup()
    await screen.findByText('Batch sender')
    fireEvent.click(screen.getAllByRole('checkbox', { name: 'Select request #1' })[0])
    fireEvent.click(screen.getAllByRole('checkbox', { name: 'Select request #2' })[0])
    fireEvent.click(screen.getByRole('button', { name: 'Confirm submission decision' }))
    await waitFor(() => expect(calls.some((config) => config.method === 'post')).toBe(true))
    expect(JSON.parse(calls.find((config) => config.method === 'post')?.data)).toEqual({
      decision: 'APPROVE',
      requestIds: [firstRequestId, skippedRequestId]
    })
    expect(await screen.findAllByText('A budget year is short of budget or has none')).not.toHaveLength(0)
    await waitFor(() => expect(warning).toHaveBeenCalledOnce())
    expect(success).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Confirm submission decision' })).toBeDisabled()
  })

  it('requires a rejection reason and keeps the draft after an API refusal', async () => {
    setup()
    await screen.findByText('Batch sender')
    fireEvent.click(screen.getAllByRole('checkbox', { name: 'Select request #1' })[0])
    fireEvent.click(screen.getByRole('combobox', { name: 'Decision' }))
    fireEvent.click(screen.getByRole('option', { name: 'Reject' }))
    const submit = screen.getByRole('button', { name: 'Confirm submission decision' })
    expect(submit).toBeDisabled()
    fireEvent.change(screen.getByLabelText('Reason for rejection'), { target: { value: 'Insufficient business need' } })
    failMutation = true
    fireEvent.click(submit)
    await waitFor(() => expect(calls.some((config) => config.method === 'post')).toBe(true))
    expect(JSON.parse(calls.find((config) => config.method === 'post')?.data)).toEqual({
      decision: 'REJECT',
      requestIds: [firstRequestId],
      reason: 'Insufficient business need'
    })
    await waitFor(() => expect(submit).not.toBeDisabled())
    expect(screen.getByLabelText('Reason for rejection')).toHaveValue('Insufficient business need')
  })

  it('matches generated API keys with relative or absolute base URL prefixes', () => {
    for (const prefix of ['', '/backend', 'https://api.example.test']) {
      expect(isApprovalRelatedKey([`${prefix}/api/v1/spend-batches/${batchId}`])).toBe(true)
      expect(isApprovalRelatedKey([`${prefix}/api/v1/access-requests/${firstRequestId}/budget-check`])).toBe(true)
      expect(isApprovalRelatedKey([`${prefix}/api/v1/notifications`, { page: 2 }])).toBe(true)
    }
    expect(isApprovalRelatedKey(['/backend/api/v1/spend-batches-other'])).toBe(false)
    expect(isApprovalRelatedKey(['/backend/api/v1/app-users'])).toBe(false)
  })
})
