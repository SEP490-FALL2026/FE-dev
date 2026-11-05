import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import {
  assignmentId,
  employeeId,
  pageResponse,
  person,
  pricing,
  requestId
} from '../../../../test/fixtures/employee-api'
import { managerId, managerProfile, managerRequest } from '../../../../test/fixtures/manager-api'
import { ManagerScreen } from './manager-screen'
import {
  assignedTool,
  managerCatalogHandlers,
  managerReadHandlers,
  managerReturn,
  needItem
} from '../../../../test/fixtures/manager-integration'
import { requestAssessment } from '../../../../test/fixtures/employee-overview-assessment'
import { chooseCatalogPlan } from '../../../../test/fixtures/employee-catalog'
import { catalogApplication } from '../../../../test/fixtures/employee-catalog'
import { getNeedDecisionListQueryKey } from '~/shared/api/generated/operations/need-decisions/need-decision-list'
import { ManagerDashboardSummary } from './overview/components/manager-dashboard-summary'
import { ManagerRequestLookup } from './team-requests/views/manager-live-request-lookup'
import { ManagerLiveRequest } from './team-requests/views/manager-live-request'
import { ManagerLiveCreate } from './team-requests/views/manager-live-create'
import { ManagerReturns } from './team/views/manager-returns'
import { ManagerReturnDetail } from './team/views/manager-return-detail'
import { ManagerReturnForm } from './team/components/manager-return-form'
import { ManagerLineWithdrawals } from './team-requests/components/manager-line-withdrawals'

const server = setupServer(
  ...managerCatalogHandlers,
  ...managerReadHandlers,
  http.get('*/api/v1/access-requests/:id', () =>
    HttpResponse.json({ success: true, data: { request: managerRequest } })
  ),
  http.get('*/api/v1/return-requests/:id', () =>
    HttpResponse.json({ success: true, data: { returnRequest: managerReturn } })
  )
)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
beforeEach(async () => {
  await setAppLanguage('en', false)
})
function mount(
  children: React.ReactNode,
  url = '/dashboard/manager',
  client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
) {
  return {
    ...render(
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={[url]}>{children}</MemoryRouter>
      </QueryClientProvider>
    ),
    client
  }
}
it('shows dashboard availability and routes software cards with authoritative department context', async () => {
  const navigate = vi.fn()
  mount(<ManagerDashboardSummary onSelectTab={navigate} />)
  expect(await screen.findByText('27')).toBeInTheDocument()
  expect(screen.getAllByText('Not available')).toHaveLength(2)
  expect(within(screen.getByRole('button', { name: 'Need approvals' })).getByText('0')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Department software rights' }))
  expect(navigate).toHaveBeenCalledWith('team-software', { departmentId: employeeId })
})
it('loads, filters and paginates the NEED queue without sending a decision on row open', async () => {
  const reads: URL[] = []
  const opened = vi.fn()
  server.use(
    http.get('*/api/v1/need-decisions', ({ request }) => {
      const url = new URL(request.url)
      reads.push(url)
      return HttpResponse.json({
        success: true,
        data: {
          items: [needItem],
          pagination: { page: Number(url.searchParams.get('page')), pageSize: 20, totalItems: 21, totalPages: 2 }
        }
      })
    })
  )
  mount(<ManagerRequestLookup onOpen={opened} />)
  expect(await screen.findByText('Test Software')).toBeInTheDocument()
  expect(screen.getByText('Awaiting need approval')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Next' }))
  await waitFor(() => expect(reads.at(-1)?.searchParams.get('page')).toBe('2'))
  fireEvent.change(screen.getByLabelText('Request type'), { target: { value: 'GROUP_GRANT' } })
  await waitFor(() => expect(reads.at(-1)?.searchParams.get('type')).toBe('GROUP_GRANT'))
  expect(reads.at(-1)?.searchParams.get('page')).toBe('1')
  fireEvent.click(screen.getByRole('button', { name: 'Open' }))
  expect(opened).toHaveBeenCalledWith(requestId)
})
it('recovers a failed NEED queue and handles empty results', async () => {
  let failed = true
  server.use(
    http.get('*/api/v1/need-decisions', () =>
      failed ? HttpResponse.json({}, { status: 503 }) : HttpResponse.json(pageResponse())
    )
  )
  mount(<ManagerRequestLookup onOpen={vi.fn()} />)
  const retry = await screen.findByRole('button', { name: 'Retry' })
  failed = false
  fireEvent.click(retry)
  expect(await screen.findByText('No requests awaiting your decision')).toBeInTheDocument()
})
it('validates a shared plan through the catalog rather than trusting URL labels', async () => {
  mount(<ManagerLiveCreate onOpen={vi.fn()} />, `/dashboard/manager?planId=${assignedTool.plan.id}&planName=Untrusted`)
  expect(await screen.findByText('Sharing not allowed')).toBeInTheDocument()
  expect(screen.getByRole('combobox', { name: 'Software' })).toHaveTextContent('Test Software')
  expect(screen.getByRole('combobox', { name: 'Software plan' })).toHaveTextContent('Standard')
  expect(screen.queryByText('Untrusted')).not.toBeInTheDocument()
})
it('refuses to send a plan whose detail cannot be read', async () => {
  server.use(http.get('*/api/v1/requestable-plans/:id', () => HttpResponse.json({}, { status: 404 })))
  mount(<ManagerLiveCreate onOpen={vi.fn()} />)
  await chooseCatalogPlan()
  expect(await screen.findByRole('alert')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled()
})
it('searches and filters the application catalog on the server and resets pagination', async () => {
  const reads: URL[] = []
  server.use(
    http.get('*/api/v1/requestable-applications', ({ request }) => {
      const url = new URL(request.url)
      reads.push(url)
      return HttpResponse.json({
        success: true,
        data: {
          items: [catalogApplication],
          pagination: { page: Number(url.searchParams.get('page')), pageSize: 20, totalItems: 21, totalPages: 2 }
        }
      })
    })
  )
  mount(<ManagerLiveCreate onOpen={vi.fn()} />)
  fireEvent.click(screen.getByRole('combobox', { name: 'Software' }))
  await screen.findByRole('option', { name: /Test Software/ })
  fireEvent.click(screen.getByRole('button', { name: 'Next' }))
  await waitFor(() => expect(reads.at(-1)?.searchParams.get('page')).toBe('2'))
  fireEvent.change(screen.getByLabelText('Software type'), { target: { value: 'SAAS' } })
  await waitFor(() => expect(reads.at(-1)?.searchParams.get('kind')).toBe('SAAS'))
  expect(reads.at(-1)?.searchParams.get('page')).toBe('1')
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: '  Vendor  ' } })
  await waitFor(() => expect(reads.at(-1)?.searchParams.get('search')).toBe('Vendor'))
  expect(reads.at(-1)?.searchParams.get('pageSize')).toBe('20')
})
it('uses requirement flags from the matching cached NEED step to build the decision form', async () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  client.setQueryData(
    getNeedDecisionListQueryKey({ page: 1, pageSize: 20 }),
    pageResponse([{ ...needItem, stepId: managerRequest.needStep.id, planLineRequired: false }])
  )
  server.use(http.get('*/api/v1/access-requests/:id/similar-seats', () => HttpResponse.json(pageResponse())))
  mount(
    <ManagerLiveRequest id={requestId} employeeId={managerId} departmentCode='ENG' onBack={vi.fn()} />,
    '/dashboard/manager',
    client
  )
  expect(await screen.findByLabelText('Reason for confirming a term beyond policy (if needed)')).toBeRequired()
})
it('shows proposal assessment and timings in Manager detail', async () => {
  server.use(
    http.get('*/api/v1/access-requests/:id', () =>
      HttpResponse.json({
        success: true,
        data: { request: { ...managerRequest, proposal: requestAssessment.proposal } }
      })
    ),
    http.get('*/api/v1/access-requests/:id/assessment', () =>
      HttpResponse.json({ success: true, data: { assessment: requestAssessment } })
    ),
    http.get('*/api/v1/access-requests/:id/timings', () =>
      HttpResponse.json({
        success: true,
        data: { timings: { segments: { NEED: { startedAt: '2026-11-01T03:00:00Z', endedAt: null } } } }
      })
    )
  )
  mount(<ManagerLiveRequest id={requestId} employeeId={employeeId} onBack={vi.fn()} />)
  expect(await screen.findByText('Test vendor')).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Processing timeline' })).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Withdraw request' })).not.toBeInTheDocument()
})
it('withdraws at a head stage with a required reason and invalidates the detail', async () => {
  const written = vi.fn()
  let state = 'AWAITING_BUDGET'
  server.use(
    http.get('*/api/v1/access-requests/:id', () =>
      HttpResponse.json({ success: true, data: { request: { ...managerRequest, state } } })
    ),
    http.post('*/api/v1/access-requests/:id/withdraw', async ({ request }) => {
      written(await request.json())
      state = 'WITHDRAWN'
      return HttpResponse.json({ success: true, data: {} })
    })
  )
  mount(<ManagerLiveRequest id={requestId} employeeId={managerId} departmentCode='ENG' onBack={vi.fn()} />)
  fireEvent.click(await screen.findByRole('button', { name: 'Withdraw request' }))
  const dialog = screen.getByRole('dialog')
  expect(within(dialog).getByRole('button', { name: 'Withdraw request' })).toBeDisabled()
  fireEvent.change(within(dialog).getByLabelText('Reason'), { target: { value: '  No longer required  ' } })
  fireEvent.click(within(dialog).getByRole('button', { name: 'Withdraw request' }))
  await waitFor(() => expect(written).toHaveBeenCalledWith({ reason: 'No longer required' }))
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  expect(screen.queryByRole('button', { name: 'Withdraw request' })).not.toBeInTheDocument()
})
it('withdraws only the selected group member and disables terminal lines', async () => {
  const written = vi.fn()
  const row = {
    employee: person,
    state: 'NEED_CONFIRMED',
    position: 1,
    needStep: { id: assignmentId, state: 'APPROVED', assignee: null },
    cost: pricing.amount,
    share: null
  }
  server.use(
    http.get('*/api/v1/access-requests/:id/lines', () =>
      HttpResponse.json(
        pageResponse([
          row,
          { ...row, employee: { ...person, employeeId: managerId, fullName: 'Completed member' }, state: 'COMPLETED' }
        ])
      )
    ),
    http.post('*/api/v1/access-requests/:id/lines/:employeeId/withdraw', async ({ request, params }) => {
      written(params.employeeId, await request.json())
      return HttpResponse.json({ success: true, data: {} })
    })
  )
  mount(<ManagerLineWithdrawals id={requestId} />)
  const button = await screen.findByRole('button', { name: 'Withdraw member' })
  expect(screen.getAllByRole('button', { name: 'Withdraw member' })).toHaveLength(1)
  fireEvent.click(button)
  const dialog = screen.getByRole('dialog')
  fireEvent.change(within(dialog).getByLabelText('Reason'), { target: { value: 'Not needed' } })
  fireEvent.click(within(dialog).getByRole('button', { name: 'Withdraw request' }))
  await waitFor(() => expect(written).toHaveBeenCalledWith(employeeId, { reason: 'Not needed' }))
})
it('filters and paginates the list of returns', async () => {
  const reads: URL[] = []
  server.use(
    http.get('*/api/v1/return-requests', ({ request }) => {
      const url = new URL(request.url)
      reads.push(url)
      return HttpResponse.json({
        success: true,
        data: {
          items: [managerReturn],
          pagination: { page: Number(url.searchParams.get('page')), pageSize: 20, totalItems: 21, totalPages: 2 }
        }
      })
    })
  )
  const opened = vi.fn()
  mount(<ManagerReturns onOpen={opened} />)
  await screen.findByText('Test Software')
  fireEvent.click(screen.getByRole('button', { name: 'Next' }))
  await waitFor(() => expect(reads.at(-1)?.searchParams.get('page')).toBe('2'))
  fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'FAILED' } })
  await waitFor(() => expect(reads.at(-1)?.searchParams.get('state')).toBe('FAILED'))
  expect(reads.at(-1)?.searchParams.get('page')).toBe('1')
  fireEvent.click(screen.getByRole('button', { name: 'Open' }))
  expect(opened).toHaveBeenCalledWith(requestId)
})
it('keeps the return filter and page when opening and returning from a detail', async () => {
  server.use(
    http.get('*/api/v1/me', () => HttpResponse.json({ success: true, data: managerProfile })),
    http.get('*/api/v1/return-requests', () => HttpResponse.json(pageResponse([managerReturn])))
  )
  const navigate = vi.fn()
  const context = { toolsView: 'returns', returnState: 'FAILED', returnPage: '2' }
  const url = '/dashboard/manager?toolsView=returns&returnState=FAILED&returnPage=2'
  const view = mount(<ManagerScreen tab='team-software' onSelectTab={navigate} />, url)
  fireEvent.click(await screen.findByRole('button', { name: 'Open' }))
  expect(navigate).toHaveBeenCalledWith('return-detail', { ...context, id: requestId })
  view.unmount()
  mount(<ManagerScreen tab='return-detail' onSelectTab={navigate} />, `${url}&id=${requestId}`)
  fireEvent.click(await screen.findByRole('button', { name: 'Back' }))
  expect(navigate).toHaveBeenCalledWith('team-software', context)
})
it('submits a return only after a reason and keeps it separate from completed revocation', async () => {
  const written = vi.fn()
  const created = vi.fn()
  server.use(
    http.post('*/api/v1/return-requests', async ({ request }) => {
      written(await request.json())
      return HttpResponse.json({ success: true, data: { returnRequest: managerReturn } }, { status: 201 })
    })
  )
  mount(<ManagerReturnForm assignment={assignedTool} departmentId={employeeId} onClose={vi.fn()} onCreated={created} />)
  const button = screen.getByRole('button', { name: 'Request return' })
  expect(button).toBeDisabled()
  fireEvent.change(screen.getByLabelText('Reason'), { target: { value: '  No longer needed  ' } })
  fireEvent.click(button)
  fireEvent.click(button)
  await waitFor(() => expect(created).toHaveBeenCalledWith(requestId))
  expect(written).toHaveBeenCalledExactlyOnceWith({ assignmentId, reason: 'No longer needed' })
})
it.each([false, true])('only the sender can confirm a return handover, sender: %s', async (sender) => {
  const written = vi.fn()
  server.use(
    http.post('*/api/v1/return-requests/:id/handover-confirmation', async ({ request }) => {
      written(await request.text())
      return HttpResponse.json({ success: true, data: {} })
    })
  )
  mount(<ManagerReturnDetail id={requestId} employeeId={sender ? managerId : employeeId} onBack={vi.fn()} />)
  await screen.findByText('Export work files')
  if (!sender) expect(screen.queryByRole('button', { name: 'Confirm data handover' })).not.toBeInTheDocument()
  else {
    fireEvent.click(screen.getByRole('button', { name: 'Confirm data handover' }))
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Confirm' }))
    await waitFor(() => expect(written).toHaveBeenCalledExactlyOnceWith(''))
  }
})
