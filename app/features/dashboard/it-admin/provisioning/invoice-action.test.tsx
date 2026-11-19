import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, expect, it, vi } from 'vitest'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { ProvisioningInvoiceAction } from './components/provisioning-invoice-action'

vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))
const api = vi.mocked(customAxios)
const navigate = vi.fn()

beforeEach(async () => {
  vi.resetAllMocks()
  await setAppLanguage('en', false)
})

function mount() {
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <ProvisioningInvoiceAction requestId='request-1' onSelectTab={navigate} />
    </QueryClientProvider>
  )
}

it('offers a new invoice when the request has none', async () => {
  api.mockResolvedValue({ data: { items: [], pagination: { totalItems: 0 } } })
  mount()
  fireEvent.click(await screen.findByRole('button', { name: 'Submit purchase invoice' }))
  expect(navigate).toHaveBeenCalledWith('purchase-invoices', { requestId: 'request-1', view: 'new' })
})

it.each(['SUBMITTED', 'CONFIRMED', 'RETURNED'])(
  'opens the existing %s invoice instead of offering another',
  async (state) => {
    api.mockResolvedValue({ data: { items: [{ id: 'invoice-1', state }], pagination: { totalItems: 1 } } })
    mount()
    fireEvent.click(await screen.findByRole('button', { name: 'View purchase invoice' }))
    expect(screen.queryByRole('button', { name: 'Submit purchase invoice' })).not.toBeInTheDocument()
    expect(navigate).toHaveBeenCalledWith('purchase-invoices', { invoiceId: 'invoice-1', view: 'history' })
  }
)

it('does not offer submission when invoice status cannot be checked', async () => {
  api.mockRejectedValue(new Error('network'))
  mount()
  expect(await screen.findByRole('alert')).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Submit purchase invoice' })).not.toBeInTheDocument()
})
