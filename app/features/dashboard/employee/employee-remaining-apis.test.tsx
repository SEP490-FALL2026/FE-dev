import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it, vi } from 'vitest'
import { toast } from 'sonner'
import { setAppLanguage } from '~/shared/i18n/i18n'
import {
  catalogPlanDetails,
  chooseCatalogPlan,
  employeeCatalogHandlers
} from '../../../../test/fixtures/employee-catalog'
import { employeeId, employeeProfile, requestId } from '../../../../test/fixtures/employee-api'
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
it('confirms return handover with no body, blocks duplicate clicks and refreshes the actual return', async () => {
  let confirmed = false
  const written = vi.fn()
  const duty = vi.fn()
  server.use(
    http.get('*/api/v1/return-requests/:id', () =>
      HttpResponse.json({
        success: true,
        data: { returnRequest: { ...employeeReturn, handover: { ...employeeReturn.handover, confirmed } } }
      })
    ),
    http.post('*/api/v1/return-requests/:id/handover-confirmation', async ({ request, params }) => {
      written(params.id, await request.text())
      confirmed = true
      return HttpResponse.json({
        success: true,
        data: { returnRequest: { ...employeeReturn, handover: { ...employeeReturn.handover, confirmed } } }
      })
    }),
    http.post('*/api/v1/handover-duties/:id/confirmation', () => {
      duty()
      return HttpResponse.json({ success: true })
    })
  )
  mount(<EmployeeLiveReturnDetail id={requestId} employeeId={employeeId} onBack={vi.fn()} />)
  fireEvent.click(await screen.findByRole('button', { name: 'Confirm return data handover' }))
  const button = within(screen.getByRole('dialog')).getByRole('button', { name: 'Confirm' })
  expect(written).not.toHaveBeenCalled()
  fireEvent.click(button)
  fireEvent.click(button)
  expect(await screen.findByText('Data handover confirmed')).toBeInTheDocument()
  expect(written).toHaveBeenCalledExactlyOnceWith(requestId, '')
  expect(duty).not.toHaveBeenCalled()
  expect(screen.queryByRole('button', { name: 'Confirm return data handover' })).not.toBeInTheDocument()
})
it.each(['other_sender', 'completed', 'confirmed', 'not_required', 'unknown_state'])(
  'does not offer return confirmation for %s',
  async (condition) => {
    server.use(
      http.get('*/api/v1/return-requests/:id', () =>
        HttpResponse.json({
          success: true,
          data: {
            returnRequest: {
              ...employeeReturn,
              state:
                condition === 'completed'
                  ? 'COMPLETED'
                  : condition === 'unknown_state'
                    ? 'FUTURE_STATE'
                    : 'AWAITING_REVOCATION',
              requestedBy: {
                ...employeeReturn.requestedBy,
                employeeId: condition === 'other_sender' ? requestId : employeeId
              },
              handover: {
                ...employeeReturn.handover,
                required: condition !== 'not_required',
                confirmed: condition === 'confirmed'
              }
            }
          }
        })
      )
    )
    mount(<EmployeeLiveReturnDetail id={requestId} employeeId={employeeId} onBack={vi.fn()} />)
    await screen.findByText('Export the project files')
    expect(screen.queryByRole('button', { name: 'Confirm return data handover' })).not.toBeInTheDocument()
  }
)
it('reloads a return after an already-confirmed conflict instead of repeating the write', async () => {
  let confirmed = false
  const written = vi.fn()
  server.use(
    http.get('*/api/v1/return-requests/:id', () =>
      HttpResponse.json({
        success: true,
        data: { returnRequest: { ...employeeReturn, handover: { ...employeeReturn.handover, confirmed } } }
      })
    ),
    http.post('*/api/v1/return-requests/:id/handover-confirmation', () => {
      written()
      confirmed = true
      return HttpResponse.json({ error: { code: 'RETURN_REQUEST.HANDOVER_ALREADY_CONFIRMED' } }, { status: 409 })
    })
  )
  mount(<EmployeeLiveReturnDetail id={requestId} employeeId={employeeId} onBack={vi.fn()} />)
  fireEvent.click(await screen.findByRole('button', { name: 'Confirm return data handover' }))
  fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Confirm' }))
  expect(await screen.findByText('Data handover confirmed')).toBeInTheDocument()
  expect(written).toHaveBeenCalledOnce()
  await waitFor(() =>
    expect(toast.error).toHaveBeenCalledWith(
      'The return no longer needs this confirmation. Reload and check its current status.',
      expect.any(Object)
    )
  )
})
it('keeps return confirmation locked and explains an unknown outcome after closing the dialog', async () => {
  const written = vi.fn()
  server.use(
    http.post('*/api/v1/return-requests/:id/handover-confirmation', () => {
      written()
      return HttpResponse.json({}, { status: 503 })
    })
  )
  mount(<EmployeeLiveReturnDetail id={requestId} employeeId={employeeId} onBack={vi.fn()} />)
  fireEvent.click(await screen.findByRole('button', { name: 'Confirm return data handover' }))
  fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Confirm' }))
  await waitFor(() => expect(toast.error).toHaveBeenCalled())
  fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Cancel' }))
  expect(screen.getByRole('status')).toHaveTextContent('result is uncertain')
  expect(screen.getByRole('button', { name: 'Confirm return data handover' })).toBeDisabled()
  fireEvent.click(screen.getByRole('button', { name: 'Confirm return data handover' }))
  expect(written).toHaveBeenCalledOnce()
})
it('refreshes the session after a return-specific 403 while preserving its translated feedback', async () => {
  const sessionReads = vi.fn()
  server.use(
    http.get('*/api/v1/me', () => {
      sessionReads()
      return HttpResponse.json({ success: true, data: employeeProfile })
    }),
    http.post('*/api/v1/return-requests/:id/handover-confirmation', () =>
      HttpResponse.json({ error: { code: 'RETURN_REQUEST.NOT_REQUESTER' } }, { status: 403 })
    )
  )
  mount(<EmployeeLiveReturnDetail id={requestId} employeeId={employeeId} onBack={vi.fn()} />)
  fireEvent.click(await screen.findByRole('button', { name: 'Confirm return data handover' }))
  fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Confirm' }))
  await waitFor(() =>
    expect(toast.error).toHaveBeenCalledWith(
      'Only the person who submitted this return can confirm its data handover.',
      expect.any(Object)
    )
  )
  expect(sessionReads).toHaveBeenCalledOnce()
})
