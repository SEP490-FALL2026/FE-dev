import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { ApprovalRequestView } from './views/spend-request-view'

const requestId = '83c00000-0000-4000-8000-000000000001'
const actor = { employeeId: 'approver', employeeCode: 'AP01', fullName: 'Approver' }
const requester = { employeeId: 'requester', employeeCode: 'E01', fullName: 'Requester' }
const beneficiary = { employeeId: 'beneficiary', employeeCode: 'E02', fullName: 'Beneficiary' }
const money = { amount: '1200.25', currency: 'USD' }
const page = { page: 1, pageSize: 100, totalItems: 1, totalPages: 1 }
const initialApproval = () => ({
  requestId,
  routing: { mode: 'VIA_HEAD', oneStepReason: null },
  budgetSnapshot: null,
  annualVendorAmount: null,
  step: {
    id: 'step-1',
    state: 'PENDING',
    waitingReason: null,
    assignee: actor,
    openedAt: '2026-11-01T00:00:00Z',
    decidedAt: null,
    slaWorkingDays: 3
  },
  request: {
    state: 'AWAITING_SPEND_APPROVAL',
    plan: { planId: 'plan-1', planName: 'Team', applicationName: 'Live software' },
    softwareName: null,
    requester,
    beneficiary: beneficiary as typeof beneficiary | null,
    lineCount: 1,
    costCenter: { id: 'cc-1', code: 'CC-01' },
    businessReason: 'Project use',
    termMonths: 12,
    expectedEndDate: null,
    budgetYear: 2026,
    offPlan: false,
    planLineAttached: true
  },
  need: { decidedBy: requester, decidedAt: '2026-10-31T00:00:00Z', reason: null },
  cost: null,
  assessment: null,
  decision: null
})
const year = (code = 'BUDGET_OK') => ({
  year: 2026,
  cost: money,
  code,
  budget: money,
  base: money,
  reserve: money,
  held: money,
  spent: money,
  remaining: money,
  remainingBase: money,
  remainingWithReserve: money,
  shareBasisPoints: null,
  pending: null
})
const originalAdapter = apiClient.defaults.adapter
let approval = initialApproval()
let years = [year()]
let posted: { url?: string; body: unknown }[] = []
let failMutation = false
let pendingMutation: Promise<void> | undefined
let readCount = 0
let groupPages: Record<number, unknown[]> = {}
let linesFail = false
let requestGetCalls = 0
let checkRoute = 'SPEND_APPROVAL'
let checkOutcome = 'WITHIN_BASE'

beforeEach(async () => {
  approval = initialApproval()
  years = [year()]
  posted = []
  failMutation = false
  pendingMutation = undefined
  readCount = 0
  groupPages = {}
  linesFail = false
  requestGetCalls = 0
  checkRoute = 'SPEND_APPROVAL'
  checkOutcome = 'WITHIN_BASE'
  await setAppLanguage('en', false)
  apiClient.defaults.adapter = async (config) => {
    const response = (data: unknown) => ({
      config,
      status: 200,
      statusText: 'OK',
      headers: {},
      data: { success: true, message: 'TEST.READ', data }
    })
    if (config.method === 'post') {
      posted.push({ url: config.url, body: JSON.parse(config.data as string) })
      if (pendingMutation) await pendingMutation
      if (failMutation)
        throw new AxiosError('conflict', 'ERR_BAD_REQUEST', config, undefined, {
          config,
          status: 409,
          statusText: 'Conflict',
          headers: {},
          data: { success: false, error: { code: 'SPEND.STEP_NOT_PENDING', message: 'Internal message' } }
        })
      return response({ spendApproval: approval })
    }
    if (config.url?.endsWith('/me')) return response({ employee: { id: actor.employeeId } })
    // The server refuses accessRequestGet to the spend step holder; the screen must not depend on it.
    if (config.url?.endsWith(`/access-requests/${requestId}`)) requestGetCalls++
    if (config.url?.endsWith('/spend-approval')) {
      readCount++
      return response({ spendApproval: approval })
    }
    if (config.url?.endsWith('/budget-check'))
      return response({
        budgetCheck: {
          id: 'check-1',
          number: 1,
          trigger: 'SUBMISSION',
          route: checkRoute,
          primaryCode: years[0].code,
          outcome: checkOutcome,
          blockedReasons: [],
          overBaseBy: null,
          overBy: null,
          bindingTotal: money,
          yearCount: years.length,
          ranAt: '2026-11-01T01:00:00Z'
        }
      })
    if (config.url?.endsWith('/budget-check/years'))
      return response({ items: years, pagination: { ...page, totalItems: years.length } })
    if (config.url?.endsWith('/lines')) {
      if (linesFail) throw new AxiosError('offline', 'ERR_NETWORK', config)
      if (!Object.keys(groupPages).length)
        throw new AxiosError('not a group', 'ERR_BAD_REQUEST', config, undefined, {
          config,
          status: 404,
          statusText: 'Not Found',
          headers: {},
          data: { success: false, error: { code: 'ACCESS_REQUEST.NOT_FOUND', message: 'Internal message' } }
        })
      return response({
        items: groupPages[config.params?.page ?? 1] ?? [],
        pagination: {
          ...page,
          page: config.params?.page ?? 1,
          totalItems: approval.request.lineCount,
          totalPages: Object.keys(groupPages).length
        }
      })
    }
    throw new AxiosError('unexpected test request', 'ERR_NETWORK', config)
  }
})
afterEach(() => {
  apiClient.defaults.adapter = originalAdapter
})
function mount(initialUrl = '/', onSelectTab = vi.fn()) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  render(
    <MemoryRouter initialEntries={[initialUrl]}>
      <QueryClientProvider client={client}>
        <ApprovalRequestView itemId={requestId} onSelectTab={onSelectTab} />
      </QueryClientProvider>
    </MemoryRouter>
  )
  return client
}
async function choose(value: 'Approve' | 'Reject', index = 0) {
  // Re-query on every attempt: the one-decision field is replaced by per-person fields once the group is known.
  await waitFor(() => expect(screen.getAllByRole('combobox', { name: 'Decision' })[index]).toBeEnabled())
  fireEvent.click(screen.getAllByRole('combobox', { name: 'Decision' })[index])
  fireEvent.click(screen.getByRole('option', { name: value }))
}
function confirm() {
  fireEvent.click(
    screen.getByRole('checkbox', { name: 'I have reviewed the request, budget check and supporting information.' })
  )
}

it('requires a rejection reason and sends only the strict rejection payload', async () => {
  mount()
  await choose('Reject')
  confirm()
  expect(screen.getByRole('button', { name: 'Confirm decision' })).toBeDisabled()
  fireEvent.change(screen.getByPlaceholderText('E.g. The team already has an equivalent tool under contract'), {
    target: { value: '  No business need  ' }
  })
  fireEvent.click(screen.getByRole('button', { name: 'Confirm decision' }))
  await waitFor(() => expect(posted).toHaveLength(1))
  expect(posted[0].body).toEqual({ decision: 'REJECT', reason: 'No business need' })
})

it('blocks insufficient-budget approval without offering removed override fields', async () => {
  years = [year('INSUFFICIENT_BUDGET')]
  mount()
  await choose('Approve')
  confirm()
  expect(screen.queryByRole('checkbox', { name: 'Approve with a budget override' })).not.toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Confirm decision' })).toBeDisabled()
  expect(posted).toHaveLength(0)
})

it('blocks repeated decisions while the server has not confirmed the write', async () => {
  let finish: () => void = () => undefined
  pendingMutation = new Promise<void>((resolve) => {
    finish = resolve
  })
  mount()
  await choose('Approve')
  confirm()
  const submit = screen.getByRole('button', { name: 'Confirm decision' })
  fireEvent.click(submit)
  fireEvent.click(submit)
  await waitFor(() => expect(posted).toHaveLength(1))
  expect(submit).toBeDisabled()
  finish()
})

it('keeps a failed decision draft and refreshes authoritative data after conflict', async () => {
  failMutation = true
  mount()
  await choose('Reject')
  confirm()
  fireEvent.change(screen.getByPlaceholderText('E.g. The team already has an equivalent tool under contract'), {
    target: { value: 'Keep this reason' }
  })
  fireEvent.click(screen.getByRole('button', { name: 'Confirm decision' }))
  await waitFor(() => expect(readCount).toBeGreaterThan(1))
  expect(screen.getByPlaceholderText('E.g. The team already has an equivalent tool under contract')).toHaveValue(
    'Keep this reason'
  )
  expect(screen.queryByText('Internal message')).not.toBeInTheDocument()
})

it('loads all beneficiary pages and sends a decision for every confirmed person', async () => {
  approval.request.beneficiary = null
  approval.request.lineCount = 2
  const line = (employee: typeof beneficiary) => ({
    employee,
    position: 1,
    state: 'NEED_CONFIRMED',
    needStep: { id: 'need-step', state: 'APPROVED', assignee: requester },
    expectedEndDate: null,
    needDecision: null,
    spendDecision: null,
    cost: money,
    share: money,
    endedAt: null,
    endedBy: null,
    endReason: null,
    cancelCause: null
  })
  groupPages = {
    1: [line(beneficiary)],
    2: [line({ ...beneficiary, employeeId: 'beneficiary-2', fullName: 'Second beneficiary' })]
  }
  mount()
  await choose('Approve', 0)
  await choose('Reject', 1)
  fireEvent.change(screen.getByPlaceholderText('E.g. This person already has a seat on another plan'), {
    target: { value: 'Duplicate seat' }
  })
  confirm()
  fireEvent.click(screen.getByRole('button', { name: 'Confirm decision' }))
  await waitFor(() => expect(posted).toHaveLength(1))
  expect(posted[0].url).toMatch(/line-spend-decisions$/)
  expect(posted[0].body).toEqual({
    lines: [
      { employeeId: 'beneficiary', decision: 'APPROVE' },
      { employeeId: 'beneficiary-2', decision: 'REJECT', reason: 'Duplicate seat' }
    ]
  })
})

it('blocks unknown step states and never submits a guessed approval', async () => {
  approval.step.state = 'NEW_SERVER_STATE'
  mount()
  expect(await screen.findByRole('button', { name: 'Confirm decision' })).toBeDisabled()
  expect(posted).toHaveLength(0)
})

it('lets the approver decide a request that uses the department reserve', async () => {
  checkOutcome = 'USES_RESERVE'
  mount()
  await choose('Approve')
  confirm()
  fireEvent.click(screen.getByRole('button', { name: 'Confirm decision' }))
  await waitFor(() => expect(posted).toHaveLength(1))
  expect(posted[0].body).toEqual({ decision: 'APPROVE' })
})

it('keeps the decision closed when the recheck blocks the request', async () => {
  checkOutcome = 'BLOCKED'
  checkRoute = 'BLOCKED'
  mount()
  expect(await screen.findByRole('button', { name: 'Confirm decision' })).toBeDisabled()
  expect(posted).toHaveLength(0)
})

it('treats a request without beneficiary and without group lines as one decision', async () => {
  approval.request.beneficiary = null
  mount()
  await choose('Approve')
  confirm()
  fireEvent.click(screen.getByRole('button', { name: 'Confirm decision' }))
  await waitFor(() => expect(posted).toHaveLength(1))
  expect(posted[0].url).toMatch(/spend-approval$/)
})

it('refreshes the active request once after a confirmed decision', async () => {
  mount()
  await choose('Approve')
  confirm()
  const submit = screen.getByRole('button', { name: 'Confirm decision' })
  fireEvent.click(submit)
  await waitFor(() => expect(readCount).toBeGreaterThan(1))
  await waitFor(() => expect(submit).not.toHaveAttribute('aria-busy', 'true'))
  expect(readCount).toBe(2)
})

it('offers the batch of the request only when the queue passed a valid batch id', () => {
  const batchId = '81000000-0000-4000-8000-000000000001'
  const onSelectTab = vi.fn()
  mount(`/?tab=request&id=${requestId}&batch=${batchId}`, onSelectTab)
  fireEvent.click(screen.getByRole('button', { name: 'View whole submission' }))
  expect(onSelectTab).toHaveBeenCalledWith('batch', { id: batchId })
})

it('hides the batch action when the batch id is missing or malformed', () => {
  mount(`/?tab=request&id=${requestId}&batch=not-a-uuid`)
  expect(screen.queryByRole('button', { name: 'View whole submission' })).not.toBeInTheDocument()
})

it('never reads accessRequestGet and decides a named-beneficiary request at once', async () => {
  mount()
  await choose('Approve')
  confirm()
  fireEvent.click(screen.getByRole('button', { name: 'Confirm decision' }))
  await waitFor(() => expect(posted).toHaveLength(1))
  expect(posted[0].url).toMatch(/spend-approval$/)
  expect(requestGetCalls).toBe(0)
  expect(screen.queryByText(/outside your access/i)).not.toBeInTheDocument()
})

it('keeps the decision closed and offers a retry when the group check fails for another reason', async () => {
  approval.request.beneficiary = null
  linesFail = true
  mount()
  expect(await screen.findByRole('button', { name: 'Retry' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Confirm decision' })).toBeDisabled()
  expect(posted).toHaveLength(0)
})
