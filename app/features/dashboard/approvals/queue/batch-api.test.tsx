import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { toast } from 'sonner'
import { apiClient } from '~/shared/api/axios-client'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { isApprovalRelatedKey } from '../shared/approvals-query-keys'
import { ApprovalBatchView } from './views/spend-batch-view'
import { expectedChecklist, policyStepData } from '../shared/checklist-test-utils'

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
    if (config.url?.includes('/steps/'))
      return {
        config,
        status: 200,
        statusText: 'OK',
        headers: {},
        data: { success: true, data: policyStepData(config.url) }
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

  const oneCriterionFailed = {
    policyVersionId: expectedChecklist.policyVersionId,
    answers: [
      { itemCode: 'P-01', answer: 'YES' },
      { itemCode: 'P-02', answer: 'NO' }
    ]
  }
  /** Ticks "read and agree to all": it confirms the review and answers every checklist question Yes. */
  async function agreeToAll() {
    await screen.findByText('0 of 2 questions answered')
    fireEvent.click(screen.getByRole('checkbox', { name: /I have read and agree to everything/ }))
  }
  /** The review is confirmed and one criterion answered No: the ground to reject or return. */
  async function failOneCriterion() {
    fireEvent.click(
      await screen.findByRole('checkbox', {
        name: 'I have reviewed the request, budget check and supporting information.'
      })
    )
    fireEvent.click(await screen.findByRole('button', { name: 'Show the decision checklist' }))
    fireEvent.click(screen.getAllByRole('radio', { name: 'No' }).at(-1) as HTMLElement)
    for (const radio of screen.getAllByRole('radio', { name: 'Yes' }).slice(1, -1)) fireEvent.click(radio)
  }

  it('sends a strict decision and reports partial skips without a success toast', async () => {
    const warning = vi.spyOn(toast, 'warning')
    const success = vi.spyOn(toast, 'success')
    setup()
    await screen.findByText('Batch sender')
    fireEvent.click(screen.getAllByRole('checkbox', { name: 'Select request #1' })[0])
    fireEvent.click(screen.getAllByRole('checkbox', { name: 'Select request #2' })[0])
    await agreeToAll()
    fireEvent.click(screen.getByRole('button', { name: 'Approve' }))
    await waitFor(() => expect(calls.some((config) => config.method === 'post')).toBe(true))
    expect(JSON.parse(calls.find((config) => config.method === 'post')?.data)).toEqual({
      decision: 'APPROVE',
      requestIds: [firstRequestId, skippedRequestId],
      checklist: expectedChecklist
    })
    expect(await screen.findAllByText('Insufficient budget must be corrected before approval')).not.toHaveLength(0)
    await waitFor(() => expect(warning).toHaveBeenCalledOnce())
    expect(success).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Approve' })).toBeDisabled()
  })

  it('opens Reject only on a criterion answered No, asks for the reason in a dialog and keeps it after an API refusal', async () => {
    setup()
    await screen.findByText('Batch sender')
    fireEvent.click(screen.getAllByRole('checkbox', { name: 'Select request #1' })[0])
    await agreeToAll()
    expect(screen.getByRole('button', { name: 'Reject' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Return' })).toBeDisabled()
    fireEvent.click(screen.getByRole('checkbox', { name: /I have read and agree to everything/ }))
    await failOneCriterion()
    expect(screen.getByRole('button', { name: 'Approve' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Reject' }))
    const dialog = await screen.findByRole('dialog', { name: 'Reject the selected requests' })
    expect(within(dialog).getByText('Vendor is verified')).toBeInTheDocument()
    expect(within(dialog).getByRole('button', { name: 'Confirm rejection' })).toBeDisabled()
    fireEvent.change(within(dialog).getByPlaceholderText('State why you reject or return it'), {
      target: { value: 'Insufficient business need' }
    })
    failMutation = true
    fireEvent.click(within(dialog).getByRole('button', { name: 'Confirm rejection' }))
    await waitFor(() => expect(calls.some((config) => config.method === 'post')).toBe(true))
    expect(JSON.parse(calls.find((config) => config.method === 'post')?.data)).toEqual({
      decision: 'REJECT',
      requestIds: [firstRequestId],
      reason: 'Insufficient business need',
      checklist: oneCriterionFailed
    })
    await waitFor(() => expect(within(dialog).getByRole('button', { name: 'Confirm rejection' })).not.toBeDisabled())
    expect(within(dialog).getByPlaceholderText('State why you reject or return it')).toHaveValue(
      'Insufficient business need'
    )
  })

  it('returns the whole batch to the head with a reason and names no requests', async () => {
    setup()
    await screen.findByText('Batch sender')
    await failOneCriterion()
    fireEvent.click(screen.getByRole('button', { name: 'Return' }))
    const dialog = await screen.findByRole('dialog', { name: 'Return the whole batch' })
    expect(within(dialog).getByRole('button', { name: 'Confirm return' })).toBeDisabled()
    fireEvent.change(within(dialog).getByPlaceholderText('State why you reject or return it'), {
      target: { value: 'Use the team plan' }
    })
    fireEvent.click(within(dialog).getByRole('button', { name: 'Confirm return' }))
    await waitFor(() => expect(calls.some((config) => config.method === 'post')).toBe(true))
    expect(JSON.parse(calls.find((config) => config.method === 'post')?.data)).toEqual({
      decision: 'RETURN',
      reason: 'Use the team plan',
      checklist: oneCriterionFailed
    })
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
