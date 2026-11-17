import { expectedChecklist, policyStepData } from '../shared/checklist-test-utils'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { i18n, setAppLanguage } from '~/shared/i18n/i18n'
import { approvalsBudget } from '~/shared/i18n/locales/en/approvals-budget'
import { ApprovalAnnualBudgetView } from './views/approval-annual-budget-view'
import { ApprovalVersionHistoryView } from './views/approval-version-history-view'

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

const attachment = {
  id: 'attachment-1',
  fileName: 'vendor-quote.pdf',
  contentType: 'application/pdf',
  sizeBytes: 2048,
  status: 'ATTACHED',
  uploadedBy: { employeeId: 'finance-1', employeeCode: 'FIN', fullName: 'Finance uploader' },
  attachedAt: '2026-11-01T00:00:00Z',
  removedAt: null
}

/** Ticks "read and agree to all": it confirms the review and answers every checklist question Yes. */
async function agreeToAll(dialog: HTMLElement) {
  await within(dialog).findByText('0 of 2 questions answered')
  fireEvent.click(within(dialog).getByRole('checkbox', { name: /I have read and agree to everything/ }))
}

/** The review is confirmed and one criterion answered No: the ground to return the version. */
async function failOneCriterion(dialog: HTMLElement) {
  fireEvent.click(
    await within(dialog).findByRole('checkbox', { name: /I have reviewed the version, the department proposal/ })
  )
  fireEvent.click(await within(dialog).findByRole('button', { name: 'Show the decision checklist' }))
  fireEvent.click(within(dialog).getAllByRole('radio', { name: 'No' }).at(-1) as HTMLElement)
  for (const radio of within(dialog).getAllByRole('radio', { name: 'Yes' }).slice(1, -1)) fireEvent.click(radio)
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
          roles: ['SPENDING_APPROVER']
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
      if (path === '/budget-versions/version-1/attachments' || path === '/budget-proposals/proposal-1/attachments')
        data = {
          items: [
            attachment,
            {
              ...attachment,
              id: 'attachment-2',
              fileName: 'old-quote.xlsx',
              status: 'REMOVED',
              removedAt: '2026-11-02T00:00:00Z'
            }
          ],
          pagination: { page: 1, pageSize: 10, totalItems: 2, totalPages: 1 }
        }
      if (path === '/budget-attachments/attachment-1/links')
        data = { url: 'https://files.example.test/quote.pdf', expiresAt: '2026-11-04T01:00:00Z' }
      if (path.includes('/policies/') && path.includes('/steps/')) data = policyStepData(path)
      if (path === '/budget-proposals') data = page([proposal])
      if (path === '/budget-proposals/proposal-1') data = { proposal }
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

  const selectTab = vi.fn()

  function mountHistory(itemId: string) {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
    render(
      <QueryClientProvider client={client}>
        <ApprovalVersionHistoryView itemId={itemId} onSelectTab={selectTab} />
      </QueryClientProvider>
    )
  }

  function mount(itemId?: string) {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
    render(
      <QueryClientProvider client={client}>
        <ApprovalAnnualBudgetView itemId={itemId} onSelectTab={selectTab} />
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
    const dialog = document.body
    expect(within(dialog).queryByRole('combobox', { name: 'Decision' })).not.toBeInTheDocument()
    expect(within(dialog).getByRole('button', { name: 'Return to Finance' })).toBeDisabled()
    await agreeToAll(dialog)
    expect(within(dialog).getByRole('button', { name: 'Return to Finance' })).toBeDisabled()
    fireEvent.click(within(dialog).getByRole('button', { name: 'Approve' }))
    await waitFor(() => expect(decided).toBe(true))
    const write = requests.find((request) => request.url?.endsWith('/decision'))
    expect(JSON.parse(write?.data)).toEqual({ decision: 'APPROVE', checklist: expectedChecklist })
    expect(requests.filter((request) => request.url?.endsWith('/budget-versions/version-1')).length).toBeGreaterThan(1)
  })

  it('returns a version only on a criterion answered No, with the reason asked in its own dialog', async () => {
    rejectWrite = true
    mount('version-1')
    fireEvent.click(await screen.findByRole('button', { name: 'Review decision' }))
    const dialog = document.body
    await failOneCriterion(dialog)
    expect(within(dialog).getByRole('button', { name: 'Approve' })).toBeDisabled()
    fireEvent.click(within(dialog).getByRole('button', { name: 'Return to Finance' }))
    const returnDialog = await screen.findByRole('dialog', { name: 'Return the version to Finance' })
    expect(within(returnDialog).getByText('Vendor is verified')).toBeInTheDocument()
    expect(within(returnDialog).getByRole('button', { name: 'Confirm return' })).toBeDisabled()
    fireEvent.change(within(returnDialog).getByRole('textbox', { name: /Reason/ }), {
      target: { value: 'Please revise the scope' }
    })
    fireEvent.click(within(returnDialog).getByRole('button', { name: 'Confirm return' }))
    await waitFor(() => expect(requests.some((request) => request.url?.endsWith('/decision'))).toBe(true))
    expect(JSON.parse(requests.find((request) => request.url?.endsWith('/decision'))?.data)).toEqual({
      decision: 'RETURN',
      reason: 'Please revise the scope',
      checklist: {
        policyVersionId: expectedChecklist.policyVersionId,
        answers: [
          { itemCode: 'P-01', answer: 'YES' },
          { itemCode: 'P-02', answer: 'NO' }
        ]
      }
    })
    await waitFor(() =>
      expect(requests.filter((request) => request.url?.endsWith('/budget-versions/version-1')).length).toBeGreaterThan(
        1
      )
    )
    expect(
      within(screen.getByRole('dialog', { name: 'Return the version to Finance' })).getByRole('textbox', {
        name: /Reason/
      })
    ).toHaveValue('Please revise the scope')
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

  it('keeps the decision but blocks another write after a server own-version denial', async () => {
    ownVersionResponse = true
    mount('version-1')
    fireEvent.click(await screen.findByRole('button', { name: 'Review decision' }))
    await agreeToAll(document.body)
    fireEvent.click(screen.getByRole('button', { name: 'Approve' }))
    await waitFor(() => expect(requests.some((request) => request.url?.endsWith('/decision'))).toBe(true))
    await waitFor(() => expect(screen.getByRole('button', { name: 'Approve' })).toBeDisabled())
    expect(screen.queryByText('technical forbidden message')).not.toBeInTheDocument()
    expect(decided).toBe(false)
  })

  it('opens the version history on its own screen', async () => {
    mount('version-1')
    fireEvent.click(await screen.findByRole('button', { name: 'Version history' }))
    expect(selectTab).toHaveBeenCalledWith('version-history', { id: 'version-1' })
    expect(screen.queryByRole('region', { name: 'Version history' })).not.toBeInTheDocument()
  })

  it('shows the audit change details on the history screen', async () => {
    mountHistory('version-1')
    const history = await screen.findByRole('region', { name: 'Version history' })
    expect((await within(history).findAllByText('Finance actor API')).length).toBeGreaterThan(0)
    expect(within(history).getAllByText('Budget figures updated').length).toBeGreaterThan(0)
    expect(within(history).getAllByText('Before: $100.00').length).toBeGreaterThan(0)
    fireEvent.click(screen.getByRole('button', { name: 'Back to budget version' }))
    expect(selectTab).toHaveBeenCalledWith('annual-budget', { id: 'version-1' })
  })

  it('reads department proposals without offering a decision action', async () => {
    mount('proposal:proposal-1')
    expect(await screen.findByText('Engineering API')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Review decision' })).not.toBeInTheDocument()
    expect(requests.some((request) => request.url?.endsWith('/budget-proposals/proposal-1'))).toBe(true)
    expect(requests.some((request) => request.url?.endsWith('/budget-proposals/proposal-1/lines'))).toBe(false)
  })

  it('waits for the server and prevents duplicate decision submissions', async () => {
    deferDecision = true
    mount('version-1')
    fireEvent.click(await screen.findByRole('button', { name: 'Review decision' }))
    const submit = screen.getByRole('button', { name: 'Approve' })
    await agreeToAll(document.body)
    fireEvent.click(submit)
    await waitFor(() => expect(submit).toBeDisabled())
    fireEvent.click(submit)
    expect(decided).toBe(false)
    expect(requests.filter((request) => request.url?.endsWith('/decision'))).toHaveLength(1)
    releaseDecision?.()
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

  it('lists version attachments read-only and opens a server download link', async () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null)
    mount('version-1')
    const region = await screen.findByRole('region', { name: 'Supporting documents' })
    expect(await within(region).findByText('vendor-quote.pdf')).toBeInTheDocument()
    expect(within(region).getAllByText(/Finance uploader/)).toHaveLength(2)
    expect(within(region).getAllByText(/^2 KB$/)).toHaveLength(2)
    expect(within(region).getByText('old-quote.xlsx')).toHaveClass('line-through')
    expect(within(region).queryByRole('button', { name: 'Download old-quote.xlsx' })).not.toBeInTheDocument()
    expect(within(region).queryByRole('button', { name: /remove|upload/i })).not.toBeInTheDocument()
    fireEvent.click(within(region).getByRole('button', { name: 'Download vendor-quote.pdf' }))
    await waitFor(() =>
      expect(open).toHaveBeenCalledWith('https://files.example.test/quote.pdf', '_blank', 'noopener,noreferrer')
    )
    expect(
      requests.some(
        (request) => request.method === 'post' && request.url?.endsWith('/budget-attachments/attachment-1/links')
      )
    ).toBe(true)
    open.mockRestore()
  })

  it('lists proposal attachments from the proposal endpoint', async () => {
    mount('proposal:proposal-1')
    const region = await screen.findByRole('region', { name: 'Supporting documents' })
    expect(await within(region).findByText('vendor-quote.pdf')).toBeInTheDocument()
    expect(requests.some((request) => request.url?.endsWith('/budget-proposals/proposal-1/attachments'))).toBe(true)
  })
})
