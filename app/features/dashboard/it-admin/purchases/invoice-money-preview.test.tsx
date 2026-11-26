import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { InvoiceEntry } from './components/invoice-entry'

const { preview } = vi.hoisted(() => ({ preview: vi.fn() }))
vi.mock('~/shared/api/generated/operations/currencies/currency-list', () => ({
  useCurrencyList: () => ({ isFetching: false, data: { data: { items: [] } } })
}))
vi.mock('~/shared/api/generated/operations/purchase-invoices/purchase-invoice-preview', () => ({
  purchaseInvoicePreview: preview
}))
vi.mock('./components/invoice-document-upload', () => {
  const attachLabel = 'Attach test document'
  return {
    InvoiceDocumentUpload: ({ onUploaded }: { onUploaded: (id: string, name: string) => void }) => (
      <button type='button' onClick={() => onUploaded('doc-1', 'invoice.pdf')}>
        {attachLabel}
      </button>
    )
  }
})

it('validates before preview and sends plain decimal strings after formatting', async () => {
  await setAppLanguage('en', false)
  preview.mockResolvedValue({
    data: {
      label: 'MATCHED',
      servicePeriodMonth: '2026-11',
      periodIndex: null,
      commitment: null,
      chargedCostCenter: null,
      flags: [],
      matchResult: 'MATCHED'
    }
  })
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      <InvoiceEntry link={{ requestId: 'request-1' }} onBack={vi.fn()} onSubmitted={vi.fn()} />
    </QueryClientProvider>
  )
  fireEvent.change(screen.getByLabelText('Invoice number'), { target: { value: 'INV-01' } })
  fireEvent.change(screen.getByLabelText('Invoice date'), { target: { value: '2026-11-20' } })
  fireEvent.change(screen.getByLabelText('Service month'), { target: { value: '2026-11' } })
  fireEvent.change(screen.getByLabelText('Original unit price'), { target: { value: '1234.25' } })
  fireEvent.change(screen.getByLabelText('Amount before tax in Vietnamese dong'), { target: { value: '250.5' } })
  fireEvent.change(screen.getByLabelText('Deductible tax in Vietnamese dong'), { target: { value: '25000' } })
  fireEvent.click(screen.getByRole('button', { name: 'Attach test document' }))
  fireEvent.click(screen.getByRole('button', { name: 'Preview invoice' }))
  expect(preview).not.toHaveBeenCalled()
  fireEvent.change(screen.getByLabelText('Amount before tax in Vietnamese dong'), { target: { value: '250000' } })
  fireEvent.click(screen.getByRole('button', { name: 'Preview invoice' }))
  await waitFor(() =>
    expect(preview).toHaveBeenCalledWith(
      expect.objectContaining({
        unitPriceOriginal: { amount: '1234.25', currency: 'VND' },
        netAmount: { amount: '250000' },
        deductibleTax: { amount: '25000' }
      })
    )
  )
  expect(await screen.findByRole('heading', { name: 'Review invoice' })).toBeVisible()
  fireEvent.change(screen.getByLabelText('Amount before tax in Vietnamese dong'), { target: { value: '250001' } })
  expect(screen.queryByRole('heading', { name: 'Review invoice' })).not.toBeInTheDocument()
})
