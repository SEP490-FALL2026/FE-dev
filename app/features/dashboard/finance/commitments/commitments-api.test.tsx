import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
import { MemoryRouter } from 'react-router'
import { toast } from 'sonner'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { finance } from '~/shared/i18n/locales/en/finance'
import { financeSpend } from '~/shared/i18n/locales/en/finance-spend'
import { FinanceCommitmentsView } from './views/finance-commitments-view'

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

const vnd = (amount: string) => ({ amount, currency: 'VND' })
const page = (totalItems: number) => ({ page: 1, pageSize: 20, totalItems, totalPages: 1 })
const ok = (config: InternalAxiosRequestConfig, data: unknown, status = 200) => ({
  config,
  status,
  statusText: 'OK',
  headers: new AxiosHeaders(),
  data: { success: true, data }
})
const refuse = (config: InternalAxiosRequestConfig, status: number, code: string) =>
  new AxiosError(code, 'ERR_BAD_REQUEST', config, undefined, {
    config,
    status,
    statusText: 'Refused',
    headers: new AxiosHeaders(),
    data: { success: false, error: { code, requestId: 'req-1' } }
  })

function commitment(id: string, overrides: Record<string, unknown> = {}) {
  return {
    id,
    requestId: `request-${id}`,
    costCenter: { id: 'center-eng', code: 'CC-ENG', name: 'Engineering cost' },
    year: 2026,
    amount: vnd('20000000'),
    released: vnd('0'),
    held: vnd('20000000'),
    state: 'HELD',
    request: {
      id: `request-${id}`,
      software: { name: 'Figma' },
      plan: { name: 'Professional' },
      requester: { employeeCode: 'EMP-1', fullName: 'Lan Nguyen' },
      beneficiaryCount: 3,
      spendApprovedAt: '2026-11-02T03:15:00.000Z'
    },
    invoiced: vnd('0'),
    invoiceCount: 1,
    hasDiscrepancy: false,
    attached: true,
    attachedAt: '2026-11-02T03:15:00.000Z',
    unattachedReason: null,
    createdAt: '2026-11-02T03:15:00.000Z',
    ...overrides
  }
}

const invoice = (number: string, matchResult: string) => ({
  id: `invoice-${number}`,
  number,
  issuedOn: '2026-11-05',
  netAmount: vnd('12000000'),
  deductibleTax: vnd('0'),
  nonDeductibleTax: vnd('500000'),
  actualCost: vnd('12500000'),
  matchResult,
  note: null,
  recordedBy: { employeeId: 'f1', employeeCode: 'FIN-1', fullName: 'Phuc Trinh' },
  recordedAt: '2026-11-05T03:15:00.000Z'
})

describe('Finance held commitments and invoices', () => {
  const previousAdapter = apiClient.defaults.adapter
  const requests: { url: string; method?: string; params?: Record<string, unknown>; body?: unknown }[] = []
  let recordFailure: string | null = null
  let releaseFailure: string | null = null
  let recorded = false
  beforeEach(async () => {
    requests.length = 0
    recordFailure = null
    releaseFailure = null
    recorded = false
    vi.mocked(toast.success).mockClear()
    vi.mocked(toast.error).mockClear()
    await setAppLanguage('en', false)
    apiClient.defaults.adapter = async (config) => {
      const url = config.url ?? ''
      const body = config.data ? JSON.parse(config.data) : undefined
      requests.push({ url, method: config.method, params: config.params, body })
      if (url.endsWith('/cost-centers'))
        return ok(config, {
          items: [
            {
              id: 'center-eng',
              code: 'CC-ENG',
              name: 'Engineering cost',
              department: { id: 'dep-eng', code: 'ENG', name: 'Engineering' },
              status: 'ACTIVE',
              kind: 'UNIT'
            }
          ],
          pagination: { page: 1, pageSize: 100, totalItems: 1, totalPages: 1 }
        })
      if (url.endsWith('/budget-commitments'))
        return ok(config, {
          items: [
            commitment('c1'),
            commitment('c2', { state: 'RELEASED', held: vnd('0'), released: vnd('20000000'), hasDiscrepancy: true }),
            commitment('c3', { request: null })
          ],
          pagination: page(3)
        })
      if (url.endsWith('/invoices') && config.method === 'post') {
        if (recordFailure) throw refuse(config, recordFailure.startsWith('MONEY') ? 422 : 409, recordFailure)
        recorded = true
        return ok(
          config,
          {
            invoice: invoice(body.number, 'TAX_ONLY'),
            commitment: commitment('c1', { held: vnd('8000000'), invoiced: vnd('12500000'), invoiceCount: 2 })
          },
          201
        )
      }
      if (url.endsWith('/invoices'))
        return ok(config, {
          items: recorded
            ? [invoice('INV-NEW', 'TAX_ONLY'), invoice('SV-HD1', 'MATCHED')]
            : [invoice('SV-HD1', 'MATCHED')],
          pagination: page(recorded ? 2 : 1)
        })
      if (url.endsWith('/release')) {
        if (releaseFailure) throw refuse(config, 409, releaseFailure)
        return ok(config, {
          commitment: commitment('c1', { state: 'RELEASED', held: vnd('0'), released: vnd('20000000') })
        })
      }
      if (url.endsWith('/releases')) return ok(config, { items: [], pagination: page(0) })
      throw new Error(`Unexpected request ${url}`)
    }
  })
  afterEach(() => {
    apiClient.defaults.adapter = previousAdapter
  })

  function mount(props: { itemId?: string; requestId?: string; onSelectTab?: (tab: string) => void } = {}) {
    const query = props.itemId
      ? `?tab=commitments&id=${props.itemId}${props.requestId ? `&requestId=${props.requestId}` : ''}`
      : ''
    render(
      <MemoryRouter initialEntries={[`/dashboard/finance${query}`]}>
        <QueryClientProvider
          client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
        >
          <FinanceCommitmentsView itemId={props.itemId} onSelectTab={props.onSelectTab ?? vi.fn()} />
        </QueryClientProvider>
      </MemoryRouter>
    )
  }
  const listRequests = () => requests.filter((request) => request.url.endsWith('/budget-commitments'))
  const posts = (suffix: string) =>
    requests.filter((request) => request.method === 'post' && request.url.endsWith(suffix))
  async function openRecordForm() {
    fireEvent.click(await screen.findByRole('button', { name: financeSpend.commitments.record.action }))
    return screen.findByRole('dialog', { name: financeSpend.commitments.record.title })
  }
  const field = (form: HTMLElement, label: string) => within(form).getByLabelText(new RegExp(`^${label}`))

  it('lists held commitments of this year and narrows them by cost center', async () => {
    const onSelectTab = vi.fn()
    mount({ onSelectTab })
    expect((await screen.findAllByText('Figma')).length).toBeGreaterThan(0)
    expect(listRequests()[0].params).toEqual({ state: 'HELD', year: new Date().getFullYear(), page: 1, pageSize: 20 })
    expect(screen.getAllByText(financeSpend.commitments.columns.held).length).toBeGreaterThan(0)
    expect(screen.getAllByText('Professional').length).toBeGreaterThan(0)
    expect(screen.getAllByText(financeSpend.commitments.discrepancy).length).toBeGreaterThan(0)
    expect(screen.getAllByText(financeSpend.commitments.requestUnavailable).length).toBeGreaterThan(0)
    // The list keeps the key figures only; released money and the invoice list live on the detail page.
    expect(
      screen.queryByRole('columnheader', { name: financeSpend.commitments.columns.released })
    ).not.toBeInTheDocument()
    expect(
      screen.getAllByText(financeSpend.commitments.invoiceCountValue.replace('{{count}}', '1')).length
    ).toBeGreaterThan(0)
    fireEvent.click(screen.getAllByRole('button', { name: finance.open })[0])
    expect(onSelectTab).toHaveBeenCalledWith('commitments', { id: 'c1', requestId: 'request-c1' })
    const costCenter = screen.getByLabelText(new RegExp(`^${financeSpend.commitments.costCenter}`))
    await waitFor(() => expect(costCenter).toBeEnabled())
    fireEvent.change(costCenter, { target: { value: 'center-eng' } })
    await waitFor(() => expect(listRequests().at(-1)?.params?.costCenterId).toBe('center-eng'))
  })

  it('records an invoice with amounts only and shows the commitment the API returned', async () => {
    mount({ itemId: 'c1', requestId: 'request-c1' })
    const figures = await screen.findByRole('region', { name: financeSpend.commitments.detail.figures })
    expect(within(figures).getAllByText('₫20,000,000').length).toBeGreaterThan(0)
    expect((await screen.findAllByText(financeSpend.matchResult.MATCHED)).length).toBeGreaterThan(0)
    expect(listRequests()[0].params).toEqual({ requestId: 'request-c1', pageSize: 100 })
    const form = await openRecordForm()
    fireEvent.click(within(form).getByRole('button', { name: financeSpend.commitments.record.submit }))
    expect(await within(form).findByText(financeSpend.commitments.record.errors.numberRequired)).toBeInTheDocument()
    expect(within(form).getByText(financeSpend.commitments.record.errors.amountRequired)).toBeInTheDocument()
    fireEvent.change(field(form, financeSpend.commitments.invoices.number), { target: { value: ' INV-NEW ' } })
    fireEvent.change(field(form, financeSpend.commitments.invoices.issuedOn), { target: { value: '2026-11-05' } })
    fireEvent.change(field(form, financeSpend.commitments.invoices.netAmount), { target: { value: '0' } })
    fireEvent.click(within(form).getByRole('button', { name: financeSpend.commitments.record.submit }))
    expect(await within(form).findByText(financeSpend.commitments.record.errors.amountPositive)).toBeInTheDocument()
    fireEvent.change(field(form, financeSpend.commitments.invoices.netAmount), { target: { value: '12000000.5' } })
    fireEvent.click(within(form).getByRole('button', { name: financeSpend.commitments.record.submit }))
    expect(await within(form).findByText('VND allows up to 0 decimal places.')).toBeInTheDocument()
    expect(posts('/invoices')).toHaveLength(0)
    fireEvent.change(field(form, financeSpend.commitments.invoices.netAmount), { target: { value: '12000000' } })
    fireEvent.change(field(form, financeSpend.commitments.invoices.nonDeductibleTax), { target: { value: '500000' } })
    fireEvent.click(within(form).getByRole('button', { name: financeSpend.commitments.record.submit }))
    await waitFor(() => expect(posts('/invoices')).toHaveLength(1))
    expect(posts('/invoices')[0].url).toMatch(/\/api\/v1\/budget-commitments\/c1\/invoices$/)
    expect(posts('/invoices')[0].body).toEqual({
      number: 'INV-NEW',
      issuedOn: '2026-11-05',
      netAmount: { amount: '12000000' },
      nonDeductibleTax: { amount: '500000' }
    })
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(within(figures).getByText('₫8,000,000')).toBeInTheDocument()
    expect(toast.success).toHaveBeenCalledWith('Invoice INV-NEW recorded.', {
      id: 'finance-invoice-record',
      description: financeSpend.commitments.record.resultTAX_ONLY
    })
    expect((await screen.findAllByText(financeSpend.matchResult.TAX_ONLY)).length).toBeGreaterThan(0)
    expect(listRequests()).toHaveLength(1)
  })

  it('keeps the draft and points at the field when the API refuses the invoice', async () => {
    recordFailure = 'INVOICE.DUPLICATE'
    mount({ itemId: 'c1', requestId: 'request-c1' })
    const form = await openRecordForm()
    fireEvent.change(field(form, financeSpend.commitments.invoices.number), { target: { value: 'SV-HD1' } })
    fireEvent.change(field(form, financeSpend.commitments.invoices.issuedOn), { target: { value: '2026-11-05' } })
    fireEvent.change(field(form, financeSpend.commitments.invoices.netAmount), { target: { value: '1000' } })
    fireEvent.click(within(form).getByRole('button', { name: financeSpend.commitments.record.submit }))
    expect(await within(form).findByText(financeSpend.commitments.record.errors.duplicate)).toBeInTheDocument()
    expect(toast.error).toHaveBeenCalledWith(finance.errors.invoiceDuplicate, { id: 'finance-invoice-record' })
    expect(field(form, financeSpend.commitments.invoices.number)).toHaveValue('SV-HD1')
    recordFailure = 'MONEY_OUT_OF_RANGE'
    fireEvent.click(within(form).getByRole('button', { name: financeSpend.commitments.record.submit }))
    expect(await within(form).findByText(financeSpend.commitments.record.errors.amountRange)).toBeInTheDocument()
    expect(toast.error).toHaveBeenLastCalledWith(finance.errors.money, { id: 'finance-invoice-record' })
  })

  it('closes the form when the commitment was released meanwhile', async () => {
    recordFailure = 'INVOICE.COMMITMENT_RELEASED'
    mount({ itemId: 'c1', requestId: 'request-c1' })
    const form = await openRecordForm()
    fireEvent.change(field(form, financeSpend.commitments.invoices.number), { target: { value: 'INV-9' } })
    fireEvent.change(field(form, financeSpend.commitments.invoices.issuedOn), { target: { value: '2026-11-05' } })
    fireEvent.change(field(form, financeSpend.commitments.invoices.netAmount), { target: { value: '1000' } })
    fireEvent.click(within(form).getByRole('button', { name: financeSpend.commitments.record.submit }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(toast.error).toHaveBeenCalledWith(finance.errors.invoiceCommitmentReleased, { id: 'finance-invoice-record' })
    await waitFor(() => expect(listRequests().length).toBeGreaterThan(1))
  })

  it('offers neither recording nor release on a released commitment', async () => {
    mount({ itemId: 'c2', requestId: 'request-c2' })
    expect(await screen.findByRole('region', { name: financeSpend.commitments.detail.figures })).toBeInTheDocument()
    expect(screen.getByText(financeSpend.commitments.detail.discrepancyNote)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: financeSpend.commitments.record.action })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: financeSpend.commitments.release.action })).not.toBeInTheDocument()
  })

  it('requires a reason to release and reports a request that is still open', async () => {
    releaseFailure = 'BUDGET.COMMITMENT_REQUEST_OPEN'
    mount({ itemId: 'c1', requestId: 'request-c1' })
    fireEvent.click(await screen.findByRole('button', { name: financeSpend.commitments.release.action }))
    const form = await screen.findByRole('dialog', { name: financeSpend.commitments.release.title })
    fireEvent.click(within(form).getByRole('button', { name: financeSpend.commitments.release.submit }))
    expect(await within(form).findByText(financeSpend.commitments.release.reasonRequired)).toBeInTheDocument()
    expect(posts('/release')).toHaveLength(0)
    fireEvent.change(field(form, financeSpend.commitments.release.reason), { target: { value: '  Vendor closed  ' } })
    fireEvent.click(within(form).getByRole('button', { name: financeSpend.commitments.release.submit }))
    await waitFor(() => expect(posts('/release')).toHaveLength(1))
    expect(posts('/release')[0].body).toEqual({ reason: 'Vendor closed' })
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(finance.errors.commitmentRequestOpen, {
        id: 'finance-commitment-release'
      })
    )
  })

  it('releases the remainder and shows the released commitment', async () => {
    mount({ itemId: 'c1', requestId: 'request-c1' })
    fireEvent.click(await screen.findByRole('button', { name: financeSpend.commitments.release.action }))
    const form = await screen.findByRole('dialog', { name: financeSpend.commitments.release.title })
    fireEvent.change(field(form, financeSpend.commitments.release.reason), { target: { value: 'Vendor closed' } })
    fireEvent.click(within(form).getByRole('button', { name: financeSpend.commitments.release.submit }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(toast.success).toHaveBeenCalledWith(financeSpend.commitments.release.success, {
      id: 'finance-commitment-release'
    })
    expect(screen.queryByRole('button', { name: financeSpend.commitments.record.action })).not.toBeInTheDocument()
  })

  it('asks to reopen from the list when the link has no request', async () => {
    mount({ itemId: 'c1' })
    expect(await screen.findByText(financeSpend.commitments.detail.missingRequest)).toBeInTheDocument()
    expect(listRequests()).toHaveLength(0)
  })
})
