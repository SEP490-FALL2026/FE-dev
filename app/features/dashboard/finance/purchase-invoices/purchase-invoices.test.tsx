import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { FinancePurchaseInvoicesView } from './views/finance-purchase-invoices-view'

const vnd = (amount: string) => ({ amount, currency: 'VND' })
const pagination = { page: 1, pageSize: 20, total: 1, totalPages: 1 }

const invoice = (overrides: Record<string, unknown> = {}) => ({
  id: 'inv-1',
  label: 'NEW_PURCHASE',
  servicePeriodMonth: '2026-11',
  periodIndex: null,
  periodCount: null,
  matchResult: 'PRICE_QUANTITY_EXCEPTION',
  flags: ['OVER_APPROVED'],
  state: 'SUBMITTED',
  linkKind: 'REQUEST',
  requestId: 'req-1',
  subscriptionId: null,
  vendorId: 'vendor-1',
  vendorInvoiceNumber: 'INV-001',
  issuedOn: '2026-11-03',
  quantity: 12,
  netAmount: vnd('12000000'),
  paymentSource: 'COMPANY_CARD',
  submittedBy: { employeeId: 'emp-1' },
  submittedAt: '2026-11-03T03:00:00Z',
  decidedAt: null,
  unitPriceOriginal: { amount: '20.00', currency: 'USD' },
  deductibleTax: vnd('0'),
  nonDeductibleTax: vnd('0'),
  returnReason: null,
  documents: [{ documentId: 'doc-1', position: 1 }],
  ...overrides
})

describe('Finance purchase invoices', () => {
  const previousAdapter = apiClient.defaults.adapter
  let requests: InternalAxiosRequestConfig[] = []
  let listItems: unknown[] = [invoice()]
  let listFails = false

  const reply = (config: InternalAxiosRequestConfig, data: unknown) => ({
    config,
    status: 200,
    statusText: 'OK',
    headers: new AxiosHeaders(),
    data
  })

  beforeEach(async () => {
    requests = []
    listItems = [invoice()]
    listFails = false
    await setAppLanguage('en', false)
    apiClient.defaults.adapter = async (config) => {
      requests.push(config)
      const url = config.url ?? ''
      if (url.includes('/purchase-invoices/missing-periods') || url.includes('/missing-period'))
        return reply(config, { success: true, message: 'OK', data: { items: [], pagination } })
      if (url.endsWith('/confirmation') || url.endsWith('/return') || url.endsWith('/returned'))
        return reply(config, { success: true, message: 'OK', data: invoice({ state: 'CONFIRMED' }) })
      if (/\/purchase-invoices\/inv-1$/.test(url))
        return reply(config, { success: true, message: 'OK', data: invoice() })
      if (url.includes('/purchase-invoices')) {
        if (listFails) {
          throw new AxiosError('boom', 'ERR_BAD_RESPONSE', config, undefined, {
            config,
            status: 500,
            statusText: 'Server Error',
            headers: {},
            data: {}
          })
        }
        return reply(config, { success: true, message: 'OK', data: { items: listItems, pagination } })
      }
      return reply(config, { success: true, message: 'OK', data: null })
    }
  })
  afterEach(() => {
    apiClient.defaults.adapter = previousAdapter
  })

  const mount = (itemId?: string) =>
    render(
      <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
        <FinancePurchaseInvoicesView itemId={itemId} onSelectTab={() => undefined} />
      </QueryClientProvider>
    )

  it('lists the invoices awaiting a signature and asks for submitted ones only', async () => {
    mount()
    expect((await screen.findAllByText('INV-001')).length).toBeGreaterThan(0)
    expect(screen.getAllByText('Count or price differs').length).toBeGreaterThan(0)
    const list = requests.find((request) => request.url?.endsWith('/purchase-invoices'))
    expect(list?.params).toMatchObject({ state: 'SUBMITTED' })
  })

  it('shows an empty state when nothing is waiting', async () => {
    listItems = []
    mount()
    await waitFor(() => expect(requests.some((request) => request.url?.includes('/purchase-invoices'))).toBe(true))
    expect(await screen.findByText('No matching records.')).toBeTruthy()
    expect(screen.queryByText('INV-001')).toBeNull()
  })

  it('offers a retry when the list fails', async () => {
    listFails = true
    mount()
    expect(await screen.findByRole('button', { name: /try again/i })).toBeTruthy()
  })

  it('signs an invoice and warns that a discrepancy case opens', async () => {
    mount('inv-1')
    expect(await screen.findByText(/a discrepancy case opens/)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Sign and release' }))
    await screen.findByRole('dialog')
    expect(requests.some((request) => request.method === 'post')).toBe(false)
    fireEvent.click(screen.getByRole('button', { name: 'Sign' }))
    await waitFor(() => expect(requests.some((request) => request.method === 'post')).toBe(true))
    const post = requests.find((request) => request.method === 'post')
    expect(post?.url).toContain('/purchase-invoices/inv-1/')
  })

  it('returns an invoice only with a reason', async () => {
    mount('inv-1')
    fireEvent.click(await screen.findByRole('button', { name: 'Return invoice' }))
    await screen.findByRole('dialog')
    expect(screen.getByRole('button', { name: 'Return' })).toBeDisabled()
    fireEvent.change(screen.getByLabelText(/Reason/), { target: { value: 'Outside the approved term' } })
    fireEvent.click(screen.getByRole('button', { name: 'Return' }))
    await waitFor(() => expect(requests.some((request) => request.method === 'post')).toBe(true))
    const post = requests.find((request) => request.method === 'post')
    expect(JSON.parse(post?.data)).toEqual({ reason: 'Outside the approved term' })
  })
})
