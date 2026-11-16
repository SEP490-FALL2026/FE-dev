import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { financePurchases } from '~/shared/i18n/locales/en/finance-purchases'
import { purchaseErrorKey } from '../purchase-invoices/hooks/use-purchases-feedback'
import { FinanceDiscrepanciesView } from './views/finance-discrepancies-view'
import { FinanceOutOfProcessView } from './views/finance-out-of-process-view'

const vnd = (amount: string) => ({ amount, currency: 'VND' })
const pagination = { page: 1, pageSize: 20, total: 1, totalPages: 1 }

const discrepancy = (overrides: Record<string, unknown> = {}) => ({
  id: 'dis-1',
  state: 'OPEN',
  mismatches: ['QUANTITY', 'UNIT_PRICE'],
  openedAt: '2026-11-05T03:00:00Z',
  outcome: null,
  purchaseInvoice: {
    id: 'inv-1',
    vendorId: 'vendor-1',
    vendorInvoiceNumber: 'INV-009',
    servicePeriodMonth: '2026-11',
    linkKind: 'REQUEST',
    requestId: 'req-1',
    subscriptionId: null,
    netAmount: vnd('9000000')
  },
  quantity: { invoice: 12, expected: 10 },
  unitPrice: { invoice: vnd('800000'), expected: vnd('750000') },
  closure: null,
  ...overrides
})

const outOfProcessCase = (overrides: Record<string, unknown> = {}) => ({
  id: 'oop-1',
  state: 'OPEN',
  discrepancyId: 'va-1',
  application: { id: 'app-1', name: 'DesignTool' },
  vendorId: 'vendor-1',
  openedAt: '2026-11-06T03:00:00Z',
  outcome: null,
  note: null,
  closedBy: null,
  closedAt: null,
  amount: null,
  costCenterId: null,
  documentIds: [],
  companyAsset: false,
  concludedOn: null,
  renewalCancelled: false,
  revocation: { required: false, waitingRequestId: null, waitUntil: null, due: false },
  ...overrides
})

describe('Finance reconciliation', () => {
  const previousAdapter = apiClient.defaults.adapter
  let requests: InternalAxiosRequestConfig[] = []
  let cases: unknown[] = []

  const reply = (config: InternalAxiosRequestConfig, data: unknown) => ({
    config,
    status: 200,
    statusText: 'OK',
    headers: new AxiosHeaders(),
    data
  })

  beforeEach(async () => {
    requests = []
    cases = [outOfProcessCase()]
    await setAppLanguage('en', false)
    apiClient.defaults.adapter = async (config) => {
      requests.push(config)
      const url = config.url ?? ''
      if (/\/invoice-discrepancies\/dis-1$/.test(url))
        return reply(config, { success: true, message: 'OK', data: discrepancy() })
      if (url.endsWith('/invoice-discrepancies'))
        return reply(config, { success: true, message: 'OK', data: { items: [discrepancy()], pagination } })
      if (url.endsWith('/out-of-process-cases'))
        return reply(config, { success: true, message: 'OK', data: { items: cases, pagination } })
      if (url.endsWith('/cost-centers'))
        return reply(config, { success: true, message: 'OK', data: { items: [], pagination } })
      return reply(config, { success: true, message: 'OK', data: null })
    }
  })
  afterEach(() => {
    apiClient.defaults.adapter = previousAdapter
  })

  const wrap = (children: React.ReactNode) => (
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      {children}
    </QueryClientProvider>
  )

  it('lists open discrepancies with what differs', async () => {
    render(wrap(<FinanceDiscrepanciesView onSelectTab={() => undefined} />))
    expect((await screen.findAllByText('INV-009')).length).toBeGreaterThan(0)
    expect(screen.getAllByText('Count, Unit price').length).toBeGreaterThan(0)
    expect(requests.find((request) => request.url?.endsWith('/invoice-discrepancies'))?.params).toMatchObject({
      state: 'OPEN'
    })
  })

  it('closes a discrepancy with a reason and a difference; a suspicion needs more than zero', async () => {
    render(wrap(<FinanceDiscrepanciesView itemId='dis-1' onSelectTab={() => undefined} />))
    fireEvent.click(await screen.findByRole('button', { name: 'Close case' }))
    await screen.findByRole('dialog')
    fireEvent.change(screen.getByLabelText(/Reason/), { target: { value: 'Vendor changed the price' } })
    fireEvent.change(screen.getByLabelText(/Difference/), { target: { value: '500000' } })
    fireEvent.click(screen.getByRole('dialog').querySelector('button[type=submit]') as HTMLButtonElement)
    await waitFor(() => expect(requests.some((request) => request.url?.endsWith('/closure'))).toBe(true))
    const post = requests.find((request) => request.url?.endsWith('/closure'))
    expect(JSON.parse(post?.data)).toEqual({
      outcome: 'EXPLAINED',
      reason: 'Vendor changed the price',
      differenceAmount: { amount: '500000' }
    })
  })

  it('shows an empty state when there are no out-of-process cases', async () => {
    cases = []
    render(wrap(<FinanceOutOfProcessView />))
    expect(await screen.findByText('No matching records.')).toBeTruthy()
  })

  it('records the spend only with an amount and a payment document', async () => {
    render(wrap(<FinanceOutOfProcessView />))
    fireEvent.click((await screen.findAllByRole('button', { name: 'Close case' }))[0])
    await screen.findByRole('dialog')
    fireEvent.change(screen.getByLabelText(/Note/), { target: { value: 'Paid by a team lead' } })
    fireEvent.change(screen.getByLabelText(/Amount spent/), { target: { value: '1185000' } })
    expect(screen.getByRole('dialog').querySelector('button[type=submit]')).toBeDisabled()
  })

  it('closes a false alarm with only a note', async () => {
    render(wrap(<FinanceOutOfProcessView />))
    fireEvent.click((await screen.findAllByRole('button', { name: 'Close case' }))[0])
    await screen.findByRole('dialog')
    fireEvent.change(screen.getByRole('dialog').querySelector('select') as HTMLSelectElement, {
      target: { value: 'FALSE_ALARM' }
    })
    fireEvent.change(screen.getByLabelText(/Note/), { target: { value: 'Not ours' } })
    fireEvent.click(screen.getByRole('dialog').querySelector('button[type=submit]') as HTMLButtonElement)
    await waitFor(() => expect(requests.some((request) => request.url?.endsWith('/closure'))).toBe(true))
    const post = requests.find((request) => request.url?.endsWith('/closure'))
    expect(JSON.parse(post?.data)).toEqual({ outcome: 'FALSE_ALARM', note: 'Not ours' })
  })

  it('maps every OUT_OF_PROCESS_CASE error code BE documents, and none of the guessed ones', () => {
    const codes = [
      'ALREADY_CLOSED',
      'FINANCE_ONLY',
      'IT_ADMIN_ONLY',
      'NOT_FOUND',
      'NUMBER_TAKEN',
      'SPEND_ALREADY_RECORDED',
      'DOCUMENT_REQUIRED',
      'DOCUMENT_INVALID',
      'RECORD_FIELDS_MISSING',
      'RECORD_FIELDS_NOT_ALLOWED',
      'NO_VENDOR',
      'COST_CENTER_NOT_FOUND',
      'REVOKE_NOT_ALLOWED',
      'REVOKE_EVIDENCE_MISSING',
      'SPEND_RECORDED'
    ]
    for (const code of codes) {
      const key = purchaseErrorKey(`OUT_OF_PROCESS_CASE.${code}`)
      expect(key, code).toBeDefined()
      expect(financePurchases.errors).toHaveProperty(key as string)
    }
    expect(purchaseErrorKey('OUT_OF_PROCESS.ALREADY_CLOSED')).toBeUndefined()
    expect(purchaseErrorKey('OUT_OF_PROCESS.OUTCOME_NOT_ALLOWED')).toBeUndefined()
  })
})
