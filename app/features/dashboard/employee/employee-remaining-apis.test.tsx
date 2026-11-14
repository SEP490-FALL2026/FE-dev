import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import {
  catalogPlanDetails,
  chooseCatalogPlan,
  employeeCatalogHandlers
} from '../../../../test/fixtures/employee-catalog'
import { employeeId, requestId } from '../../../../test/fixtures/employee-api'
import { employeeReturn } from '../../../../test/fixtures/employee-return'
import { EmployeeLiveCreateView } from './software-request/views/employee-live-create-view'
import { EmployeeLiveReturnDetail } from './my-software/views/employee-live-return-detail'

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))
const server = setupServer(
  ...employeeCatalogHandlers,
  http.get('*/api/v1/return-requests/:id', () =>
    HttpResponse.json({ success: true, data: { returnRequest: employeeReturn } })
  )
)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
beforeEach(async () => {
  vi.clearAllMocks()
  await setAppLanguage('en', false)
})
function mount(children: React.ReactNode) {
  return render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  )
}
it('reads plan terms and data-loss information while displaying vendor information only with the software', async () => {
  const reads = vi.fn()
  server.use(
    http.get('*/api/v1/requestable-plans/:id', ({ params }) => {
      reads(params.id)
      return HttpResponse.json({ success: true, data: catalogPlanDetails })
    })
  )
  mount(<EmployeeLiveCreateView onSelectTab={vi.fn()} />)
  await chooseCatalogPlan()
  const details = screen.getByRole('region', { name: 'Selected plan details' })
  expect(within(details).getByText('Sharing not allowed')).toBeInTheDocument()
  expect(screen.getAllByText('Vendor', { exact: true })).toHaveLength(1)
  expect(within(details).queryByText('Vendor', { exact: true })).not.toBeInTheDocument()
  expect(within(details).getByText('Yes')).toBeInTheDocument()
  expect(reads).toHaveBeenCalledExactlyOnceWith(catalogPlanDetails.id)
})
it('waits for successful plan details and recovers safely after a read error', async () => {
  let failed = true
  server.use(
    http.get('*/api/v1/requestable-plans/:id', () =>
      failed
        ? HttpResponse.json(
            { error: { code: 'REQUESTABLE_SOFTWARE.PLAN_NOT_FOUND', message: 'private detail' } },
            { status: 404 }
          )
        : HttpResponse.json({ success: true, data: catalogPlanDetails })
    )
  )
  mount(<EmployeeLiveCreateView onSelectTab={vi.fn()} />)
  await chooseCatalogPlan()
  expect(screen.getByRole('alert')).not.toHaveTextContent('private detail')
  expect(screen.getByRole('button', { name: 'Preview request' })).toBeDisabled()
  expect(screen.getByRole('button', { name: 'Save draft' })).toBeDisabled()
  failed = false
  fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
  expect(await screen.findByText('Sharing not allowed')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Preview request' })).toBeEnabled()
})
it.each([null, { ...catalogPlanDetails, id: requestId }])(
  'does not accept empty or mismatched plan details',
  async (data) => {
    server.use(http.get('*/api/v1/requestable-plans/:id', () => HttpResponse.json({ success: true, data })))
    mount(<EmployeeLiveCreateView onSelectTab={vi.fn()} />)
    await chooseCatalogPlan()
    expect(screen.getByText('Software details are unavailable')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Preview request' })).toBeDisabled()
  }
)
it('handles unknown sharing values without granting sharing permissions', async () => {
  server.use(
    http.get('*/api/v1/requestable-plans/:id', () =>
      HttpResponse.json({
        success: true,
        data: { ...catalogPlanDetails, sharingPolicy: 'NEW_POLICY', vendorName: null, dataLossOnRemoval: false }
      })
    )
  )
  mount(<EmployeeLiveCreateView onSelectTab={vi.fn()} />)
  await chooseCatalogPlan()
  const details = screen.getByRole('region', { name: 'Selected plan details' })
  expect(within(details).getByText('Unsupported status')).toBeInTheDocument()
  expect(within(details).queryByText('Vendor', { exact: true })).not.toBeInTheDocument()
  expect(within(details).getByText('No')).toBeInTheDocument()
})
it.each(['AWAITING_REVOCATION', 'COMPLETED', 'FAILED'])(
  'reads the return without the removed handover action in %s',
  async (state) => {
    server.use(
      http.get('*/api/v1/return-requests/:id', () =>
        HttpResponse.json({ success: true, data: { returnRequest: { ...employeeReturn, state } } })
      )
    )
    const back = vi.fn()
    mount(<EmployeeLiveReturnDetail id={requestId} employeeId={employeeId} onBack={back} />)
    await screen.findByText('Export the project files')
    expect(screen.queryByRole('button', { name: 'Confirm return data handover' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Back' }))
    expect(back).toHaveBeenCalledOnce()
  }
)
it('retries a failed return read without exposing the backend message', async () => {
  let failed = true
  server.use(
    http.get('*/api/v1/return-requests/:id', () =>
      failed
        ? HttpResponse.json({ message: 'private backend detail' }, { status: 503 })
        : HttpResponse.json({ success: true, data: { returnRequest: employeeReturn } })
    )
  )
  mount(<EmployeeLiveReturnDetail id={requestId} employeeId={employeeId} onBack={vi.fn()} />)
  expect(await screen.findByRole('alert')).not.toHaveTextContent('private backend detail')
  failed = false
  fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
  await screen.findByText('Export the project files')
})
