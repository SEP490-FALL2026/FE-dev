import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, expect, it, vi } from 'vitest'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { ItInvoicesView } from './views/it-invoices-view'
import { InvoiceEntry } from './components/invoice-entry'

vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))
afterEach(() => vi.unstubAllGlobals())

it('uploads the original without attaching to a contract, previews and submits exact money strings', async () => {
  await setAppLanguage('en', false)
  const request = vi.mocked(customAxios)
  request.mockReset()
  const storage = vi.fn().mockResolvedValue({ ok: true })
  vi.stubGlobal('fetch', storage)
  request.mockImplementation(async (config) => {
    if (config.url?.endsWith('/currencies')) return { data: { items: [{ code: 'VND' }] } }
    if (config.url?.endsWith('/documents') && config.method === 'POST')
      return {
        data: {
          document: { id: 'doc-one' },
          upload: {
            url: 'https://storage.example.invalid/upload',
            method: 'PUT',
            headers: { 'Content-Type': 'application/pdf' },
            expiresAt: '2099-01-01T00:00:00Z'
          }
        }
      }
    if (config.url?.endsWith('/documents/doc-one'))
      return { data: { document: { status: 'PENDING_ATTACH', contractId: null } } }
    if (config.url?.endsWith('/purchase-invoices/preview'))
      return { data: { label: 'NEW_PURCHASE', servicePeriodMonth: '2026-11', matchResult: 'MATCHED', flags: [] } }
    if (config.url?.endsWith('/purchase-invoices') && config.method === 'POST') return { data: { id: 'invoice-one' } }
    return { data: {} }
  })
  const submitted = vi.fn()
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <InvoiceEntry link={{ requestId: 'request-one' }} month='2026-11' onBack={vi.fn()} onSubmitted={submitted} />
    </QueryClientProvider>
  )
  fireEvent.change(screen.getByLabelText('Invoice number'), { target: { value: 'INV-2026-11' } })
  fireEvent.change(screen.getByLabelText('Invoice date'), { target: { value: '2026-11-16' } })
  fireEvent.change(screen.getByLabelText('Original unit price'), { target: { value: '9007199254740993' } })
  fireEvent.change(screen.getByLabelText('Amount before tax in Vietnamese dong'), {
    target: { value: '9007199254740993' }
  })
  fireEvent.change(screen.getByLabelText('Invoice document'), {
    target: { files: [new File(['invoice'], 'invoice.pdf', { type: 'application/pdf' })] }
  })
  fireEvent.click(screen.getByRole('button', { name: 'Upload document' }))
  await screen.findByText('invoice.pdf')
  expect(request.mock.calls.some(([config]) => config.url?.endsWith('/attachment'))).toBe(false)
  expect(storage).toHaveBeenCalledWith(
    'https://storage.example.invalid/upload',
    expect.objectContaining({ method: 'PUT', credentials: 'omit' })
  )
  fireEvent.click(screen.getByRole('button', { name: 'Preview invoice' }))
  await screen.findByText('Quantity and price match')
  fireEvent.click(screen.getByRole('button', { name: 'Upload document' }))
  expect(screen.getByRole('button', { name: 'Submit for confirmation' })).toBeDisabled()
  fireEvent.click(screen.getByRole('button', { name: 'Stop adding a document' }))
  fireEvent.click(screen.getByRole('button', { name: 'Submit for confirmation' }))
  await screen.findByText('Quantity and price match')
  const writes = request.mock.calls.filter(
    ([config]) => config.url?.endsWith('/purchase-invoices') && config.method === 'POST'
  )
  expect(writes).toHaveLength(1)
  expect(writes[0][0].data).toMatchObject({
    link: { requestId: 'request-one' },
    documentIds: ['doc-one'],
    netAmount: { amount: '9007199254740993' },
    quantity: 1
  })
})

it('starts invoice entry from a missing period with its exact request and month', async () => {
  await setAppLanguage('en', false)
  const request = vi.mocked(customAxios)
  request.mockReset()
  request.mockImplementation(async (config) => {
    if (config.url?.endsWith('/missing-periods'))
      return {
        data: {
          items: [
            {
              linkKind: 'REQUEST',
              requestId: 'request-one',
              subscriptionId: null,
              label: 'NEW_PURCHASE',
              servicePeriodMonth: '2026-11',
              dueDate: '2026-11-19',
              paymentDate: '2026-11-13',
              plan: { applicationName: 'Figma', planName: 'Team' },
              department: { name: 'Design' }
            }
          ],
          pagination: { totalItems: 1 }
        }
      }
    return { data: { items: [], pagination: { totalItems: 0 } } }
  })
  render(
    <MemoryRouter initialEntries={['/?tab=purchase-invoices&view=missing']}>
      <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
        <ItInvoicesView />
      </QueryClientProvider>
    </MemoryRouter>
  )
  fireEvent.click(await screen.findByRole('button', { name: 'Submit invoice' }))
  expect(await screen.findByLabelText('Service month')).toHaveValue('2026-11')
  expect(screen.getByLabelText('Invoice number')).toBeRequired()
  expect(screen.getByRole('button', { name: 'Submit for confirmation' })).toBeDisabled()
  expect(request.mock.calls.some(([config]) => config.method === 'POST')).toBe(false)
})
