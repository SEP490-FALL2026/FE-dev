import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { getSpendQueueListQueryKey } from '~/shared/api/generated/operations/spend-submission/spend-queue-list'
import { managerId, managerProfile, managerRequest, queueItem } from '../../../../test/fixtures/manager-api'
import { requestId, employeeId, planId, pageResponse } from '../../../../test/fixtures/employee-api'
import { ManagerLiveRequest } from './team-requests/views/manager-live-request'
import { ManagerLiveBatch } from './team-requests/views/manager-live-batch'
import { ManagerLiveCreate } from './team-requests/views/manager-live-create'
import { ManagerScreen } from './manager-screen'
import { ManagerStatus } from './shared/components/manager-api-ui'

const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
beforeEach(async () => {
  await setAppLanguage('en', false)
})
function mount(children: React.ReactNode, url = '/dashboard/manager') {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  return {
    ...render(
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={[url]}>{children}</MemoryRouter>
      </QueryClientProvider>
    ),
    client
  }
}
function serveRequest(request = managerRequest) {
  server.use(
    http.get('*/api/v1/access-requests/:id', () => HttpResponse.json({ success: true, data: { request } })),
    http.get('*/api/v1/access-requests/:id/similar-seats', () => HttpResponse.json(pageResponse([])))
  )
}
describe('Manager need approval and spend submission', () => {
  it('reloads the session after a forbidden read and stops mounting protected Manager screens', async () => {
    let meCalls = 0
    server.use(
      http.get('*/api/v1/me', () => {
        meCalls++
        return HttpResponse.json({
          success: true,
          data:
            meCalls === 1
              ? managerProfile
              : { ...managerProfile, roles: { direct: ['EMPLOYEE'], derived: [], effective: ['EMPLOYEE'] } }
        })
      }),
      http.get('*/api/v1/access-requests/:id', () =>
        HttpResponse.json({ error: { code: 'AUTHORIZATION.FORBIDDEN' } }, { status: 403 })
      )
    )
    mount(<ManagerScreen tab='request-approval' onSelectTab={vi.fn()} />, `/?id=${requestId}`)
    expect(await screen.findByRole('alert')).toHaveTextContent('Your permissions have changed')
    await waitFor(() => expect(meCalls).toBe(2))
    expect(screen.queryByRole('radio')).not.toBeInTheDocument()
  })
  it('sends only the need decision and allocation, blocks duplicate clicks, then refreshes the request and queue', async () => {
    let finish: () => void = () => undefined
    const pending = new Promise<void>((resolve) => {
      finish = resolve
    })
    const written = vi.fn()
    let current = managerRequest
    server.use(
      http.get('*/api/v1/access-requests/:id', () => HttpResponse.json({ success: true, data: { request: current } })),
      http.get('*/api/v1/access-requests/:id/similar-seats', () => HttpResponse.json(pageResponse([]))),
      http.post('*/api/v1/access-requests/:id/need-decision', async ({ request }) => {
        written(await request.json())
        await pending
        current = { ...managerRequest, state: 'AWAITING_SPEND_SUBMISSION' }
        return HttpResponse.json({ success: true, data: { request: current } })
      }),
      http.get('*/api/v1/access-requests/:id/supplements', () => HttpResponse.json(pageResponse([])))
    )
    const view = mount(<ManagerLiveRequest id={requestId} employeeId={managerId} onBack={vi.fn()} />)
    view.client.setQueryData(getSpendQueueListQueryKey(), { success: true })
    fireEvent.click(await screen.findByLabelText('Outside the annual plan'))
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    const dialog = screen.getByRole('dialog')
    const confirm = within(dialog).getByRole('button', { name: 'Confirm' })
    fireEvent.click(confirm)
    fireEvent.click(confirm)
    await waitFor(() => expect(written).toHaveBeenCalledTimes(1))
    expect(written).toHaveBeenCalledWith({ decision: 'APPROVE', spend: { offPlan: true } })
    expect(confirm).toBeDisabled()
    finish()
    expect(await screen.findByText('Awaiting batch submission')).toBeInTheDocument()
    expect(view.client.getQueryState(getSpendQueueListQueryKey())?.isInvalidated).toBe(true)
  })
  it('hides need decisions for the requester and for an unknown request state', async () => {
    serveRequest()
    const view = mount(<ManagerLiveRequest id={requestId} employeeId={employeeId} onBack={vi.fn()} />)
    expect(await screen.findByText('This step is not assigned to you, or has already changed.')).toBeInTheDocument()
    expect(screen.queryByRole('radio')).not.toBeInTheDocument()
    view.unmount()
    server.use(
      http.get('*/api/v1/access-requests/:id', () =>
        HttpResponse.json({ success: true, data: { request: { ...managerRequest, state: 'FUTURE_STATE' } } })
      )
    )
    mount(<ManagerLiveRequest id={requestId} employeeId={managerId} onBack={vi.fn()} />)
    expect(await screen.findByText('Status unavailable')).toBeInTheDocument()
    expect(screen.queryByRole('radio')).not.toBeInTheDocument()
  })
  it('keeps input and blocks resubmission after an uncertain write', async () => {
    serveRequest()
    const written = vi.fn()
    server.use(
      http.post('*/api/v1/access-requests/:id/need-decision', () => {
        written()
        return HttpResponse.json({ error: { code: 'SERVICE_UNAVAILABLE' } }, { status: 503 })
      })
    )
    mount(<ManagerLiveRequest id={requestId} employeeId={managerId} onBack={vi.fn()} />)
    fireEvent.click(await screen.findByLabelText('Reject need'))
    fireEvent.change(screen.getByLabelText('Reason'), { target: { value: 'No business requirement' } })
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Confirm' }))
    expect(await screen.findByText(/The previous action may have been recorded/)).toBeInTheDocument()
    expect(screen.getByLabelText('Reason')).toHaveValue('No business requirement')
    expect(within(screen.getByRole('dialog')).getByRole('button', { name: 'Confirm' })).toBeDisabled()
    expect(written).toHaveBeenCalledTimes(1)
  })
  it('submits only selected ready requests and displays per-request batch results', async () => {
    const written = vi.fn()
    server.use(
      http.get('*/api/v1/spend-queue', () =>
        HttpResponse.json(
          pageResponse([
            queueItem,
            {
              ...queueItem,
              requestId: employeeId,
              readyToSubmit: false,
              stage: 'BLOCKED',
              plan: { ...queueItem.plan, applicationName: 'Blocked Software' }
            }
          ])
        )
      ),
      http.post('*/api/v1/spend-batches', async ({ request }) => {
        written(await request.json())
        return HttpResponse.json({ success: true, data: { batch: { id: planId } } }, { status: 201 })
      }),
      http.get('*/api/v1/spend-batches/:id', () =>
        HttpResponse.json({ success: true, data: { batch: { id: planId } } })
      ),
      http.get('*/api/v1/spend-batches/:id/items', () =>
        HttpResponse.json(
          pageResponse([{ requestId, outcome: 'SENT_TO_FINANCE', requestState: 'AWAITING_FINANCE_REVIEW' }])
        )
      )
    )
    mount(<ManagerLiveBatch onOpen={vi.fn()} />)
    fireEvent.click(await screen.findByRole('checkbox', { name: 'Test Software' }))
    expect(screen.getByRole('checkbox', { name: 'Blocked Software' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Confirm' }))
    expect(await screen.findByText('Sent to Finance')).toBeInTheDocument()
    expect(written).toHaveBeenCalledWith({ requestIds: [requestId] })
  })
  it('never fetches the privileged department directory to fill a missing department ID', async () => {
    const calls: string[] = []
    server.use(
      http.get('*/api/v1/me', () => HttpResponse.json({ success: true, data: managerProfile })),
      http.get('*/api/v1/departments', ({ request }) => {
        calls.push(request.url)
        return HttpResponse.json(pageResponse([]))
      })
    )
    mount(<ManagerScreen tab='my-team' onSelectTab={vi.fn()} />)
    expect(await screen.findByLabelText('Department ID')).toBeInTheDocument()
    expect(calls).toEqual([])
  })
  it('creates delegated requests with official IDs and no fixture fields', async () => {
    const written = vi.fn()
    server.use(
      http.get('*/api/v1/group-request-candidates', () =>
        HttpResponse.json(pageResponse([{ employeeId, fullName: 'Test Employee', workEmail: 'employee@example.test' }]))
      ),
      http.post('*/api/v1/delegated-requests', async ({ request }) => {
        written(await request.json())
        return HttpResponse.json(
          { success: true, data: { batchId: planId, requests: [managerRequest] } },
          { status: 201 }
        )
      })
    )
    mount(
      <ManagerLiveCreate group={false} onOpen={vi.fn()} />,
      `/dashboard/manager?planId=${planId}&planName=Standard&applicationName=Test%20Software`
    )
    fireEvent.click(screen.getByRole('combobox', { name: 'Plan' }))
    fireEvent.click(screen.getByRole('option', { name: /Standard/ }))
    fireEvent.change(screen.getByLabelText('Term (months)'), { target: { value: '3' } })
    fireEvent.click(screen.getByRole('combobox', { name: 'Beneficiaries' }))
    fireEvent.click(await screen.findByRole('option', { name: /Test Employee/ }))
    fireEvent.change(screen.getByLabelText('Reason'), { target: { value: 'Onboarding' } })
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Confirm' }))
    expect(await screen.findByText('Created requests')).toBeInTheDocument()
    expect(written).toHaveBeenCalledWith({
      businessReason: 'Onboarding',
      termMonths: 3,
      beneficiaryEmployeeIds: [employeeId],
      items: [{ planId }]
    })
  })
  it('falls back safely for an unknown status', () => {
    mount(<ManagerStatus value='UNKNOWN_STATUS' />)
    expect(screen.getByText('Status unavailable')).toBeInTheDocument()
  })
})
