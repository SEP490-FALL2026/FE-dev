import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { i18n, setAppLanguage } from '~/shared/i18n/i18n'
import { itReconciliation } from '~/shared/i18n/locales/en/it-reconciliation'
import { ItReconciliationView } from './views/it-reconciliation-view'

vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))
const request = vi.mocked(customAxios)
afterEach(() => vi.unstubAllGlobals())
let source = 'NO_ASSIGNMENT'
let companyAsset = true
let amount: unknown = null
const vendor = () => ({
  id: 'vendor-1',
  source,
  state: 'OPEN',
  application: { id: 'app-1', name: 'Design tool' },
  identity: 'alex@company.com',
  internalValue: 'No assignment recorded',
  vendorValue: 'Active account',
  evidenceOn: '2026-11-16',
  firstSeenAt: '2026-11-16T01:00:00Z',
  lastSeenAt: '2026-11-16T01:00:00Z'
})
const outside = () => ({
  id: 'case-1',
  state: 'OPEN',
  application: { name: 'Unapproved tool' },
  discrepancyId: 'vendor-1',
  companyAsset,
  amount,
  documentIds: [],
  openedAt: '2026-11-16T01:00:00Z',
  concludedOn: '2026-11-16',
  revocation: { required: companyAsset, due: companyAsset, waitingRequestId: null, waitUntil: null }
})
beforeEach(async () => {
  vi.resetAllMocks()
  source = 'NO_ASSIGNMENT'
  companyAsset = true
  amount = null
  i18n.addResourceBundle('en', 'itReconciliation', itReconciliation, true, true)
  await setAppLanguage('en', false)
  request.mockImplementation(async (config) => {
    if (config.url?.endsWith('/documents') && config.method === 'POST')
      return {
        data: {
          document: { id: 'fresh-proof' },
          upload: {
            url: 'https://storage.example.invalid/proof',
            method: 'PUT',
            headers: {},
            expiresAt: '2099-01-01T00:00:00Z'
          }
        }
      }
    if (config.url?.includes('/documents/fresh-proof'))
      return { data: { document: { id: 'fresh-proof', status: 'READY', contractId: null } } }
    if (config.method === 'POST') return { data: {} }
    if (config.url?.endsWith('/me')) return { data: { roles: ['IT_ADMIN'] } }
    if (config.url?.includes('/vendor-account-discrepancies'))
      return { data: { items: [vendor()], pagination: { totalItems: 41 } } }
    if (config.url?.includes('/out-of-process-cases'))
      return { data: { items: [outside()], pagination: { totalItems: 1 } } }
    return { data: { items: [], pagination: { totalItems: 0 } } }
  })
})
function mount(queue = 'vendor') {
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      <MemoryRouter initialEntries={[`/dashboard/it-admin?tab=reconciliation&queue=${queue}`]}>
        <ItReconciliationView />
      </MemoryRouter>
    </QueryClientProvider>
  )
}
it('paginates vendor discrepancies on the server and retains the vendor comparison verbatim', async () => {
  mount()
  await screen.findByText('Design tool')
  expect(screen.getByText('No assignment recorded')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Next' }))
  await waitFor(() => expect(request.mock.calls.some(([config]) => config.params?.page === 2)).toBe(true))
})
it('requires a note and an explicit asset choice for an outside-process decision', async () => {
  mount()
  fireEvent.click(await screen.findByRole('button', { name: 'View details' }))
  await waitFor(() => expect(screen.getByRole('button', { name: 'Outside the process' })).toBeEnabled())
  fireEvent.click(screen.getByRole('button', { name: 'Outside the process' }))
  const dialog = screen.getByRole('dialog')
  const confirm = within(dialog).getByRole('button', { name: 'Confirm' })
  expect(confirm).toBeDisabled()
  fireEvent.change(within(dialog).getByLabelText('Investigation note'), {
    target: { value: '  Checked vendor workspace  ' }
  })
  expect(confirm).toBeDisabled()
  fireEvent.click(within(dialog).getByRole('radio', { name: 'Company asset' }))
  fireEvent.click(confirm)
  await waitFor(() => expect(request.mock.calls.some(([config]) => config.method === 'POST')).toBe(true))
  const post = request.mock.calls.find(([config]) => config.method === 'POST')![0]
  expect(post.url).toContain('/vendor-account-discrepancies/vendor-1/decision')
  expect(post.data).toEqual({ decision: 'OUT_OF_PROCESS', companyAsset: true, note: 'Checked vendor workspace' })
})
it('offers only false alarm for a discrepancy originating from an invoice difference', async () => {
  source = 'INVOICE_DIFFERENCE'
  mount()
  fireEvent.click(await screen.findByRole('button', { name: 'View details' }))
  expect(screen.queryByRole('button', { name: 'Outside the process' })).not.toBeInTheDocument()
  await waitFor(() => expect(screen.getByRole('button', { name: 'False alarm' })).toBeEnabled())
})
it('does not offer revocation for personal assets or false alarm after Finance recorded spending', async () => {
  companyAsset = false
  amount = { amount: '1185000', currency: 'VND' }
  mount('outside')
  fireEvent.click(await screen.findByRole('button', { name: 'View details' }))
  expect(screen.queryByRole('button', { name: 'Revoked' })).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'False alarm' })).not.toBeInTheDocument()
  await waitFor(() => expect(screen.getByRole('button', { name: 'Report only' })).toBeEnabled())
  fireEvent.click(screen.getByRole('button', { name: 'Report only' }))
  const dialog = screen.getByRole('dialog')
  fireEvent.change(within(dialog).getByLabelText('Investigation note'), {
    target: { value: 'Personal subscription confirmed' }
  })
  fireEvent.click(within(dialog).getByRole('button', { name: 'Confirm' }))
  await waitFor(() => expect(request.mock.calls.some(([config]) => config.method === 'POST')).toBe(true))
  expect(request.mock.calls.find(([config]) => config.method === 'POST')![0].data).toEqual({
    outcome: 'REPORT_ONLY',
    note: 'Personal subscription confirmed'
  })
})
it('keeps Finance invoice discrepancy actions read only for IT', async () => {
  mount('invoices')
  await screen.findByText(/Finance resolves invoice discrepancies/)
  expect(screen.queryByRole('button', { name: /close|confirm|record spending/i })).not.toBeInTheDocument()
})

it('records revocation only with confirmation and a newly completed uploaded proof', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(null, { status: 200 }))
  )
  mount('outside')
  fireEvent.click(await screen.findByRole('button', { name: 'View details' }))
  await waitFor(() => expect(screen.getByRole('button', { name: 'Revoked' })).toBeEnabled())
  fireEvent.click(screen.getByRole('button', { name: 'Revoked' }))
  const dialog = screen.getByRole('dialog')
  fireEvent.change(within(dialog).getByLabelText('Investigation note'), {
    target: { value: 'Renewal stopped at vendor' }
  })
  const confirm = within(dialog).getByRole('button', { name: 'Confirm' })
  expect(confirm).toBeDisabled()
  fireEvent.click(within(dialog).getByRole('checkbox', { name: 'I cancelled renewal or payment with the vendor' }))
  expect(confirm).toBeDisabled()
  fireEvent.change(within(dialog).getByLabelText('Cancellation proof'), {
    target: { files: [new File(['pdf'], 'cancelled.pdf', { type: 'application/pdf' })] }
  })
  fireEvent.click(within(dialog).getByRole('button', { name: 'Upload document' }))
  await within(dialog).findByText('cancelled.pdf')
  fireEvent.click(confirm)
  await waitFor(() => expect(request.mock.calls.some(([config]) => config.url?.endsWith('/case-1/closure'))).toBe(true))
  const post = request.mock.calls.find(([config]) => config.url?.endsWith('/case-1/closure'))![0]
  expect(post.data).toEqual({
    outcome: 'REVOKED',
    note: 'Renewal stopped at vendor',
    renewalCancelled: true,
    documentIds: ['fresh-proof']
  })
  expect(request.mock.calls.some(([config]) => config.url?.endsWith('/fresh-proof/complete'))).toBe(true)
})
