import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { financeSpend } from '~/shared/i18n/locales/en/finance-spend'
import type { Commitment } from './hooks/use-commitment-actions'
import { emptyInvoiceDraft } from './invoice-form'
import { previewInvoice, quantityMismatch } from './invoice-preview'
import { FinanceInvoiceIntakeView } from './views/finance-invoice-intake-view'

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

const vnd = (amount: string) => ({ amount, currency: 'VND' })
const commitment = {
  id: 'commitment-1',
  requestId: 'request-1',
  costCenter: { id: 'center-eng', code: 'CC-ENG', name: 'Engineering cost' },
  year: 2026,
  amount: vnd('20000000'),
  released: vnd('0'),
  held: vnd('20000000'),
  state: 'HELD',
  request: {
    id: 'request-1',
    software: { name: 'Figma' },
    plan: { name: 'Professional' },
    requester: { employeeCode: 'EMP-1', fullName: 'Lan Nguyen' },
    beneficiaryCount: 3,
    spendApprovedAt: '2026-11-02T03:15:00.000Z'
  },
  invoiced: vnd('0'),
  invoiceCount: 0,
  hasDiscrepancy: false,
  attached: true,
  attachedAt: '2026-11-02T03:15:00.000Z',
  unattachedReason: null,
  createdAt: '2026-11-02T03:15:00.000Z'
} as Commitment
const costCenter = {
  id: 'center-eng',
  code: 'CC-ENG',
  name: 'Engineering cost',
  kind: 'UNIT',
  status: 'ACTIVE',
  department: { id: 'department-eng', code: 'ENG', name: 'Engineering' }
}
const page = <Item,>(items: Item[]) => ({
  items,
  pagination: { page: 1, pageSize: 100, totalItems: items.length, totalPages: 1 }
})

describe('previewInvoice', () => {
  const draft = (netAmount: string, nonDeductibleTax = '', deductibleTax = '') => ({
    ...emptyInvoiceDraft,
    netAmount,
    nonDeductibleTax,
    deductibleTax
  })
  it('adds non-deductible tax to actual cost and lowers the held amount by the net', () => {
    expect(previewInvoice(commitment, draft('12000000', '500000', '1200000'))).toEqual({
      actualCost: 12500000,
      heldAfter: 8000000,
      expectedMatch: 'TAX_ONLY'
    })
  })
  it('warns only when a positive whole quantity differs from the approved seats', () => {
    expect(quantityMismatch(commitment, '3')).toBe(false)
    expect(quantityMismatch(commitment, '5')).toBe(true)
    expect(quantityMismatch(commitment, '')).toBe(false)
    expect(quantityMismatch({ ...commitment, request: null }, '5')).toBe(false)
  })
  it('flags an exception when the invoices exceed what was approved', () => {
    expect(previewInvoice(commitment, draft('20000000')).expectedMatch).toBe('MATCHED')
    expect(previewInvoice(commitment, draft('22000000'))).toMatchObject({
      heldAfter: 0,
      expectedMatch: 'PRICE_QUANTITY_EXCEPTION'
    })
  })
})

describe('Finance invoice intake', () => {
  const previousAdapter = apiClient.defaults.adapter
  const requests: InternalAxiosRequestConfig[] = []
  beforeEach(async () => {
    requests.length = 0
    await setAppLanguage('en', false)
    apiClient.defaults.adapter = async (config) => {
      requests.push(config)
      const path = config.url?.split('/api/v1')[1] ?? ''
      const data =
        config.method === 'post'
          ? {
              invoice: {
                id: 'invoice-1',
                number: 'INV-1',
                issuedOn: '2026-11-05',
                netAmount: vnd('12000000'),
                deductibleTax: vnd('0'),
                nonDeductibleTax: vnd('0'),
                actualCost: vnd('12000000'),
                matchResult: 'MATCHED',
                note: null,
                recordedBy: { employeeId: 'finance', employeeCode: 'FIN-1', fullName: 'Finance' },
                recordedAt: '2026-11-05T00:00:00.000Z'
              },
              commitment: { ...commitment, held: vnd('8000000'), invoiceCount: 1 }
            }
          : path.endsWith('/cost-centers')
            ? page([costCenter])
            : path.endsWith('/budget-commitments')
              ? page([commitment])
              : page([])
      return { config, status: 200, statusText: 'OK', headers: new AxiosHeaders(), data: { success: true, data } }
    }
  })
  afterEach(() => {
    apiClient.defaults.adapter = previousAdapter
  })
  function mount(initialEntry = '/') {
    render(
      <MemoryRouter initialEntries={[initialEntry]}>
        <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
          <FinanceInvoiceIntakeView />
        </QueryClientProvider>
      </MemoryRouter>
    )
  }

  it('switches between manual entry and file import with the active mode pressed', () => {
    mount()
    const manual = screen.getByRole('button', { name: financeSpend.invoiceIntake.modes.manual })
    const fileImport = screen.getByRole('button', { name: financeSpend.invoiceIntake.modes.import })
    expect(manual).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(fileImport)
    expect(fileImport).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText(financeSpend.invoiceIntake.import.dropTitle)).toBeInTheDocument()
  })

  it('accepts a csv or xlsx file without sending it and keeps the import action disabled', () => {
    mount('/?mode=import')
    const input = screen.getByLabelText(financeSpend.invoiceIntake.import.choose, { selector: 'input' })
    fireEvent.change(input, { target: { files: [new File(['a'], 'invoices.pdf', { type: 'application/pdf' })] } })
    expect(screen.getByRole('alert')).toHaveTextContent(financeSpend.invoiceIntake.import.rejected)
    fireEvent.change(input, { target: { files: [new File(['number,net'], 'invoices.csv', { type: 'text/csv' })] } })
    expect(screen.getByText('invoices.csv')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: financeSpend.invoiceIntake.import.preview })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Remove invoices.csv' }))
    expect(screen.queryByText('invoices.csv')).not.toBeInTheDocument()
    expect(requests).toHaveLength(0)
  })

  it('records an invoice on the chosen held commitment and shows the backend result', async () => {
    mount()
    await waitFor(() => expect(screen.getByRole('option', { name: 'CC-ENG · Engineering' })).toBeInTheDocument())
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'center-eng' } })
    fireEvent.click(await screen.findByRole('button', { name: /Figma · Professional/ }))
    expect(
      requests.some(
        (request) =>
          request.url?.endsWith('/budget-commitments') &&
          request.params?.costCenterId === 'center-eng' &&
          request.params?.state === 'HELD'
      )
    ).toBe(true)
    // Quantity is required and compared with the approved seats, but never sent to the API.
    const quantity = screen.getByRole('spinbutton', { name: /Quantity on invoice/i })
    fireEvent.submit(quantity.closest('form')!)
    expect(screen.getByText(financeSpend.invoiceIntake.billedQuantityRequired)).toBeInTheDocument()
    expect(requests.some((request) => request.method === 'post')).toBe(false)
    fireEvent.change(quantity, { target: { value: '5' } })
    expect(screen.getByText(/Quantity mismatch/)).toBeInTheDocument()
    fireEvent.change(quantity, { target: { value: '3' } })
    expect(screen.queryByText(/Quantity mismatch/)).not.toBeInTheDocument()
    fireEvent.change(screen.getByRole('textbox', { name: /Invoice number/i }), { target: { value: 'INV-1' } })
    fireEvent.change(document.querySelector('input[name="issuedOn"]')!, { target: { value: '2026-11-05' } })
    fireEvent.change(document.querySelector('input[name="netAmount"]')!, { target: { value: '12000000' } })
    const preview = screen.getByRole('region', { name: financeSpend.invoiceIntake.preview.title })
    expect(within(preview).getByText(/8,000,000/)).toBeInTheDocument()
    fireEvent.submit(document.querySelector('input[name="netAmount"]')!.closest('form')!)
    await waitFor(() => expect(requests.some((request) => request.method === 'post')).toBe(true))
    const posted = requests.find((request) => request.method === 'post')!
    expect(posted.url).toMatch(/\/budget-commitments\/commitment-1\/invoices$/)
    expect(JSON.parse(posted.data as string)).toEqual({
      number: 'INV-1',
      issuedOn: '2026-11-05',
      netAmount: { amount: '12000000' }
    })
    expect(await screen.findByRole('status')).toHaveTextContent('INV-1')
  })
})
