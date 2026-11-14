import { managerCatalogHandlers, managerReadHandlers } from '../../../../test/fixtures/manager-integration'
import { chooseCatalogPlan } from '../../../../test/fixtures/employee-catalog'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { getSpendQueueListQueryKey } from '~/shared/api/generated/operations/spend-submission/spend-queue-list'
import { managerId, managerProfile, managerRequest, queueItem } from '../../../../test/fixtures/manager-api'
import { requestId, employeeId, planId, pageResponse, groupCheck } from '../../../../test/fixtures/employee-api'
import { ManagerLiveRequest } from './team-requests/views/manager-live-request'
import { ManagerLiveBatch } from './team-requests/views/manager-live-batch'
import { ManagerLiveCreate } from './team-requests/views/manager-live-create'
import { ManagerScreen } from './manager-screen'
import { ManagerStatus } from './shared/components/manager-api-ui'

const server = setupServer(...managerCatalogHandlers, ...managerReadHandlers)
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
          data: meCalls === 1 ? managerProfile : { ...managerProfile, roles: ['EMPLOYEE'] }
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
    await screen.findByRole('radio', { name: 'Approve need' })
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    const dialog = screen.getByRole('dialog')
    const confirm = within(dialog).getByRole('button', { name: 'Confirm' })
    fireEvent.click(confirm)
    fireEvent.click(confirm)
    await waitFor(() => expect(written).toHaveBeenCalledTimes(1))
    expect(written).toHaveBeenCalledWith({ decision: 'APPROVE' })
    expect(confirm).toBeDisabled()
    finish()
    await waitFor(() => expect(view.client.getQueryState(getSpendQueueListQueryKey())?.isInvalidated).toBe(true))
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
    expect(await screen.findByRole('heading', { level: 1, name: 'Test Software' })).toBeInTheDocument()
    expect(screen.queryByText(requestId)).not.toBeInTheDocument()
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
          pageResponse([{ requestId, outcome: 'SENT_TO_APPROVER', requestState: 'AWAITING_SPEND_DECISION' }])
        )
      )
    )
    mount(<ManagerLiveBatch onOpen={vi.fn()} />)
    fireEvent.click(await screen.findByRole('checkbox', { name: 'Test Software' }))
    expect(screen.getByRole('checkbox', { name: 'Blocked Software' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Confirm' }))
    expect(await screen.findByText('Sent to spending approver')).toBeInTheDocument()
    expect(written).toHaveBeenCalledWith({ requestIds: [requestId], reserveConfirmations: [] })
  })
  it('requires a reserve reason and sends it with the same selected request only once', async () => {
    const written = vi.fn()
    server.use(
      http.get('*/api/v1/spend-queue', () =>
        HttpResponse.json(pageResponse([{ ...queueItem, budgetOutcome: 'USES_RESERVE' }]))
      ),
      http.post('*/api/v1/spend-batches', async ({ request }) => {
        written(await request.json())
        return HttpResponse.json({ success: true, data: { batch: { id: planId } } })
      }),
      http.get('*/api/v1/spend-batches/:id', () =>
        HttpResponse.json({ success: true, data: { batch: { id: planId } } })
      ),
      http.get('*/api/v1/spend-batches/:id/items', () => HttpResponse.json(pageResponse([])))
    )
    mount(<ManagerLiveBatch onOpen={vi.fn()} />)
    fireEvent.click(await screen.findByRole('checkbox', { name: 'Test Software' }))
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    const dialog = within(screen.getByRole('dialog'))
    const confirm = dialog.getByRole('button', { name: 'Confirm' })
    expect(confirm).toBeDisabled()
    fireEvent.change(dialog.getByLabelText(/Reason for using the reserve/), {
      target: { value: 'Additional project seats' }
    })
    fireEvent.click(confirm)
    fireEvent.click(confirm)
    await waitFor(() =>
      expect(written).toHaveBeenCalledExactlyOnceWith({
        requestIds: [requestId],
        reserveConfirmations: [{ requestId, reason: 'Additional project seats' }]
      })
    )
  })
  it('never fetches the privileged department directory to fill a missing department ID', async () => {
    const calls: string[] = []
    server.use(
      http.get('*/api/v1/me', () =>
        HttpResponse.json({ success: true, data: { ...managerProfile, managerScope: null } })
      ),
      http.get('*/api/v1/departments', ({ request }) => {
        calls.push(request.url)
        return HttpResponse.json(pageResponse([]))
      })
    )
    mount(<ManagerScreen tab='my-team' onSelectTab={vi.fn()} />)
    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(calls).toEqual([])
  })
  it.each(['personal-request', 'request-approval'] as const)(
    'keeps %s available to a Manager before their head assignment starts',
    async (tab) => {
      const privileged = vi.fn()
      server.use(
        http.get('*/api/v1/me', () =>
          HttpResponse.json({
            success: true,
            data: {
              ...managerProfile,
              managerScope: null,
              upcomingUnits: [
                {
                  departmentId: planId,
                  departmentCode: 'OPS',
                  departmentName: 'Operations',
                  effectiveFrom: '2026-12-01',
                  costCenterId: null
                }
              ]
            }
          })
        ),
        http.get('*/api/v1/departments/:id', () => {
          privileged()
          return HttpResponse.json({}, { status: 403 })
        })
      )
      serveRequest()
      mount(<ManagerScreen tab={tab} onSelectTab={vi.fn()} />, `/?planId=${planId}&id=${requestId}`)
      if (tab === 'personal-request') await screen.findByRole('heading', { name: 'Request software for myself' })
      else await screen.findByRole('heading', { name: 'Test Software', level: 1 })
      expect(privileged).not.toHaveBeenCalled()
      expect(screen.queryByText('You do not have permission to perform this action.')).not.toBeInTheDocument()
    }
  )
  it('creates group requests with official IDs and no fixture fields', async () => {
    const written = vi.fn()
    server.use(
      http.get('*/api/v1/group-request-candidates', () =>
        HttpResponse.json(
          pageResponse([
            { employeeId, fullName: 'Test Employee', workEmail: 'employee@example.test' },
            { employeeId: planId, fullName: 'Second Employee', workEmail: 'second@example.test' }
          ])
        )
      ),
      http.post('*/api/v1/group-requests/check', () =>
        HttpResponse.json({
          success: true,
          data: {
            ...groupCheck,
            lines: [
              { employeeId, ok: true, reason: null },
              { employeeId: planId, ok: true, reason: null }
            ]
          }
        })
      ),
      http.post('*/api/v1/group-requests', async ({ request }) => {
        written(await request.json())
        return HttpResponse.json({ success: true, data: { request: managerRequest } }, { status: 201 })
      })
    )
    mount(<ManagerLiveCreate onOpen={vi.fn()} />, '/dashboard/manager')
    await chooseCatalogPlan()
    await screen.findByText('Sharing not allowed')
    fireEvent.change(screen.getByLabelText('Expected end date'), { target: { value: '2027-01-31' } })
    fireEvent.click(screen.getByRole('combobox', { name: 'Beneficiaries' }))
    fireEvent.click(await screen.findByRole('option', { name: /Test Employee/ }))
    fireEvent.click(screen.getByRole('option', { name: /Second Employee/ }))
    fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'Escape' })
    fireEvent.change(screen.getByLabelText('Reason'), { target: { value: 'Onboarding' } })
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    await waitFor(() =>
      expect(within(screen.getByRole('dialog')).getByRole('button', { name: 'Confirm' })).toBeEnabled()
    )
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Confirm' }))
    expect(await screen.findByText('Created requests')).toBeInTheDocument()
    expect(written).toHaveBeenCalledWith({
      businessReason: 'Onboarding',
      expectedEndDate: '2027-01-31',
      planId,
      lines: [{ employeeId }, { employeeId: planId }]
    })
  })
  it('falls back safely for an unknown status', () => {
    mount(<ManagerStatus value='UNKNOWN_STATUS' />)
    expect(screen.getByText('Status unavailable')).toBeInTheDocument()
  })
})
