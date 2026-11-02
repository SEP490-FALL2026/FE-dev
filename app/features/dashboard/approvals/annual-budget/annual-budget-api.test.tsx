import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { i18n, setAppLanguage } from '~/shared/i18n/i18n'
import { approvalsBudget } from '~/shared/i18n/locales/en/approvals-budget'
import { ApprovalAnnualBudgetView } from './views/approval-annual-budget-view'

const money = { amount: '9007199254740993.25', currency: 'USD' }
const center = { id: 'center-1', code: 'ENG', name: 'Engineering API' }
const version = {
  id: 'version-1',
  costCenter: center,
  year: 2027,
  number: 2,
  kind: 'INITIAL',
  state: 'SENT',
  proposalId: null,
  basedOnVersionId: null,
  rejectedPredecessorId: null,
  base: money,
  reserve: { amount: '0', currency: 'USD' },
  total: money,
  highValuePercent: 10,
  highValueAmount: null,
  quarters: null,
  reason: null,
  previousTotal: null,
  decision: null,
  createdBy: { employeeId: 'finance-1', employeeCode: 'FIN', fullName: 'Finance API' },
  createdAt: '2026-10-30T00:00:00Z',
  sentAt: '2026-11-01T00:00:00Z',
  detachedAt: null,
  neverCurrent: false,
  expiredAt: null
}
const page = (items: unknown[], pageNumber = 1) => ({
  items,
  pagination: { page: pageNumber, pageSize: 20, totalItems: items.length ? 21 : 0, totalPages: items.length ? 2 : 0 }
})
const line = {
  position: 1,
  proposalPosition: null,
  description: 'Original API line',
  planId: null,
  seats: 2,
  amount: money,
  windowFrom: '2027-01-01',
  windowTo: '2027-03-31',
  servicePeriodMonths: 12,
  repeatCycle: 'ANNUAL',
  quoteValidUntil: null,
  financeComment: 'Finance basis',
  adjustmentReason: null,
  overdue: false
}
const proposal = {
  id: 'proposal-1',
  costCenter: center,
  year: 2027,
  state: 'SUBMITTED',
  total: money,
  previousProposalId: null,
  successorOfProposalId: null,
  successorProposalId: null,
  submittedBy: null,
  submittedAt: '2026-11-01T00:00:00Z',
  returned: null,
  withdrawnAt: null,
  succeededAt: null,
  closedAt: null
}

describe('Spending Approver annual budget API', () => {
  const previousAdapter = apiClient.defaults.adapter
  let requests: InternalAxiosRequestConfig[]
  let decided: boolean
  let rejectWrite: boolean
  let ownVersion: boolean
  let ownVersionResponse: boolean
  let versionStatus: string
  let deferDecision: boolean
  let releaseDecision: (() => void) | undefined
  beforeEach(async () => {
    requests = []
    decided = false
    rejectWrite = false
    ownVersion = false
    ownVersionResponse = false
    versionStatus = 'SENT'
    deferDecision = false
    releaseDecision = undefined
    i18n.addResourceBundle('en', 'approvalsBudget', approvalsBudget)
    await setAppLanguage('en', false)
    apiClient.defaults.adapter = async (config) => {
      requests.push(config)
      const path = config.url?.split('/api/v1')[1] ?? ''
      let data: unknown = null
      if (path === '/me')
        data = {
          employee: { id: ownVersion ? 'finance-1' : 'approver-1' },
          roles: { effective: ['SPENDING_APPROVER'] }
        }
      if (path === '/budget-versions')
        data = page(
          [
            { ...version, costCenter: { ...center, name: config.params?.page === 2 ? 'Second API page' : center.name } }
          ],
          config.params?.page
        )
      if (path === '/budget-versions/version-1')
        data = { version: { ...version, state: decided ? 'APPROVED' : versionStatus } }
      if (path === '/budget-versions/version-1/lines')
        data = page(
          [{ ...line, description: config.params?.page === 2 ? 'Second API line page' : line.description }],
          config.params?.page
        )
      if (path === '/budget-versions/version-1/history')
        data = page([
          {
            seq: 1,
            kind: 'FIGURES_UPDATED',
            versionState: 'SENT',
            position: null,
            lines: null,
            changes: [{ field: 'base', before: '100', after: '200' }],
            currency: 'USD',
            by: { id: 'finance-1', name: 'Finance actor API' },
            at: '2026-11-01T00:00:00Z'
          }
        ])
      if (path === '/budget-versions/version-1/decision') {
        if (deferDecision)
          await new Promise<void>((resolve) => {
            releaseDecision = resolve
          })
        if (ownVersionResponse)
          throw new AxiosError('forbidden', 'ERR_BAD_REQUEST', config, undefined, {
            config,
            status: 403,
            statusText: 'Forbidden',
            headers: new AxiosHeaders(),
            data: { success: false, error: { code: 'BUDGET.OWN_VERSION', message: 'technical forbidden message' } }
          })
        if (rejectWrite)
          throw new AxiosError('conflict', 'ERR_BAD_REQUEST', config, undefined, {
            config,
            status: 409,
            statusText: 'Conflict',
            headers: new AxiosHeaders(),
            data: { success: false, error: { code: 'BUDGET.VERSION_NOT_SENT', message: 'technical message' } }
          })
        decided = true
        data = { version: { ...version, state: 'APPROVED' } }
      }
      if (path === '/budget-proposals') data = page([proposal])
      if (path === '/budget-proposals/proposal-1') data = { proposal }
      if (path === '/budget-proposals/proposal-1/lines')
        data = page([{ ...line, description: 'API proposal line', note: null }])
      return {
        config,
        data: { success: true, message: 'BUDGET.FETCHED', data },
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders()
      }
    }
  })
  afterEach(() => {
    releaseDecision?.()
    apiClient.defaults.adapter = previousAdapter
  })

  function mount(itemId?: string) {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
    render(
      <QueryClientProvider client={client}>
        <ApprovalAnnualBudgetView itemId={itemId} onSelectTab={vi.fn()} />
      </QueryClientProvider>
    )
    return client
  }

  it('loads authoritative versions and pages on the server', async () => {
    mount()
    await waitFor(() => expect(requests.some((request) => request.url?.endsWith('/budget-versions'))).toBe(true))
    expect((await screen.findAllByText('Engineering API')).length).toBeGreaterThan(0)
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    expect((await screen.findAllByText('Second API page')).length).toBeGreaterThan(0)
    expect(requests.some((request) => request.params?.page === 2)).toBe(true)
  })

  it('approves with the exact contract body and refreshes the detail', async () => {
    mount('version-1')
    fireEvent.click(await screen.findByRole('button', { name: 'Review decision' }))
    const dialog = screen.getByRole('dialog')
    fireEvent.click(within(dialog).getByRole('button', { name: 'Confirm decision' }))
    await waitFor(() => expect(decided).toBe(true))
    const write = requests.find((request) => request.url?.endsWith('/decision'))
    expect(JSON.parse(write?.data)).toEqual({ decision: 'APPROVE' })
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(requests.filter((request) => request.url?.endsWith('/budget-versions/version-1')).length).toBeGreaterThan(1)
  })

  it('requires a rejection reason and retains it after a stale decision response', async () => {
    rejectWrite = true
    mount('version-1')
    fireEvent.click(await screen.findByRole('button', { name: 'Review decision' }))
    const dialog = screen.getByRole('dialog')
    fireEvent.click(within(dialog).getByRole('combobox', { name: 'Decision' }))
    fireEvent.click(within(dialog).getByRole('option', { name: 'Reject' }))
    expect(within(dialog).getByRole('button', { name: 'Confirm decision' })).toBeDisabled()
    fireEvent.change(within(dialog).getByRole('textbox', { name: /Reason/ }), {
      target: { value: 'Please revise the scope' }
    })
    fireEvent.click(within(dialog).getByRole('button', { name: 'Confirm decision' }))
    await waitFor(() => expect(requests.some((request) => request.url?.endsWith('/decision'))).toBe(true))
    expect(JSON.parse(requests.find((request) => request.url?.endsWith('/decision'))?.data)).toEqual({
      decision: 'REJECT',
      reason: 'Please revise the scope'
    })
    await waitFor(() =>
      expect(requests.filter((request) => request.url?.endsWith('/budget-versions/version-1')).length).toBeGreaterThan(
        1
      )
    )
    expect(within(screen.getByRole('dialog')).getByRole('textbox', { name: /Reason/ })).toHaveValue(
      'Please revise the scope'
    )
    expect(screen.queryByText('technical message')).not.toBeInTheDocument()
  })

  it('blocks creators from deciding their own version', async () => {
    ownVersion = true
    mount('version-1')
    await screen.findByText('Engineering API')
    await waitFor(() => expect(requests.some((request) => request.url?.endsWith('/me'))).toBe(true))
    expect(screen.queryByRole('button', { name: 'Review decision' })).not.toBeInTheDocument()
  })

  it('blocks unknown version states and uses a safe status label', async () => {
    versionStatus = 'FUTURE_STATUS'
    mount('version-1')
    await screen.findByText('Engineering API')
    expect(await screen.findByText('Unknown status')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Review decision' })).not.toBeInTheDocument()
  })

  it('requests changes with a trimmed reason instead of a fabricated return decision', async () => {
    mount('version-1')
    fireEvent.click(await screen.findByRole('button', { name: 'Review decision' }))
    const dialog = screen.getByRole('dialog')
    fireEvent.click(within(dialog).getByRole('combobox', { name: 'Decision' }))
    fireEvent.click(within(dialog).getByRole('option', { name: 'Request changes' }))
    fireEvent.change(within(dialog).getByRole('textbox', { name: /Reason/ }), {
      target: { value: '  Amend the reserve  ' }
    })
    fireEvent.click(within(dialog).getByRole('button', { name: 'Confirm decision' }))
    await waitFor(() => expect(decided).toBe(true))
    expect(JSON.parse(requests.find((request) => request.url?.endsWith('/decision'))?.data)).toEqual({
      decision: 'REQUEST_CHANGES',
      reason: 'Amend the reserve'
    })
  })

  it('retains the dialog but blocks another write after a server own-version denial', async () => {
    ownVersionResponse = true
    mount('version-1')
    fireEvent.click(await screen.findByRole('button', { name: 'Review decision' }))
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Confirm decision' }))
    await waitFor(() => expect(requests.some((request) => request.url?.endsWith('/decision'))).toBe(true))
    await waitFor(() =>
      expect(within(screen.getByRole('dialog')).getByRole('button', { name: 'Confirm decision' })).toBeDisabled()
    )
    expect(screen.queryByText('technical forbidden message')).not.toBeInTheDocument()
    expect(decided).toBe(false)
  })

  it('loads version lines on the server and shows the audit change details', async () => {
    mount('version-1')
    const lines = await screen.findByRole('region', { name: 'Budget lines' })
    await within(lines).findAllByText('Original API line')
    fireEvent.click(within(lines).getByRole('button', { name: /next/i }))
    expect((await within(lines).findAllByText('Second API line page')).length).toBeGreaterThan(0)
    expect(requests.some((request) => request.url?.endsWith('/lines') && request.params?.page === 2)).toBe(true)
    fireEvent.click(screen.getByRole('button', { name: 'Version history' }))
    const history = await screen.findByRole('region', { name: 'Version history' })
    expect((await within(history).findAllByText('Finance actor API')).length).toBeGreaterThan(0)
    expect(within(history).getAllByText('Budget figures updated').length).toBeGreaterThan(0)
    expect(within(history).getAllByText('Before: $100.00').length).toBeGreaterThan(0)
  })

  it('reads department proposals without offering a decision action', async () => {
    mount('proposal:proposal-1')
    expect(await screen.findByText('Engineering API')).toBeInTheDocument()
    expect((await screen.findAllByText('API proposal line')).length).toBeGreaterThan(0)
    expect(screen.queryByRole('button', { name: 'Review decision' })).not.toBeInTheDocument()
    expect(requests.some((request) => request.url?.endsWith('/budget-proposals/proposal-1'))).toBe(true)
    expect(requests.some((request) => request.url?.endsWith('/budget-proposals/proposal-1/lines'))).toBe(true)
  })

  it('waits for the server and prevents duplicate decision submissions', async () => {
    deferDecision = true
    mount('version-1')
    fireEvent.click(await screen.findByRole('button', { name: 'Review decision' }))
    const submit = within(screen.getByRole('dialog')).getByRole('button', { name: 'Confirm decision' })
    fireEvent.click(submit)
    await waitFor(() => expect(submit).toBeDisabled())
    fireEvent.click(submit)
    expect(decided).toBe(false)
    expect(requests.filter((request) => request.url?.endsWith('/decision'))).toHaveLength(1)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    releaseDecision?.()
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('sends supported status and year filters and resets the page', async () => {
    mount()
    await screen.findAllByText('Engineering API')
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    await screen.findAllByText('Second API page')
    fireEvent.click(screen.getByRole('combobox', { name: 'Status' }))
    fireEvent.click(screen.getByRole('option', { name: 'All statuses' }))
    fireEvent.change(screen.getByPlaceholderText('Enter a year, e.g. 2027'), { target: { value: '2028' } })
    fireEvent.click(screen.getByRole('button', { name: 'Apply filters' }))
    await waitFor(() =>
      expect(
        requests.some(
          (request) =>
            request.url?.endsWith('/budget-versions') &&
            request.params?.year === 2028 &&
            request.params?.page === 1 &&
            request.params?.state === undefined
        )
      ).toBe(true)
    )
  })
})
