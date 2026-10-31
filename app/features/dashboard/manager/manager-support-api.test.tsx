import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { managerId, managerRequest, proposal } from '../../../../test/fixtures/manager-api'
import {
  employeeId,
  requestId,
  planId,
  assignmentId,
  pageResponse,
  groupCheck,
  person
} from '../../../../test/fixtures/employee-api'
import { ManagerBudgetForm } from './annual-budget/views/manager-budget-form'
import { ManagerNoticeForm } from './personnel-notices/components/manager-notice-form'
import { ManagerTransferReviews } from './access-review/views/manager-transfer-reviews'
import { ManagerLiveTeam } from './team/views/manager-live-team'
import { ManagerLiveCreate } from './team-requests/views/manager-live-create'
import { ManagerGroupDecisions } from './team-requests/components/manager-group-decisions'
import { ManagerSpendCorrections } from './team-requests/components/manager-spend-corrections'

const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
beforeEach(async () => {
  await setAppLanguage('en', false)
})
function mount(children: React.ReactNode, url = '/dashboard/manager') {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[url]}>{children}</MemoryRouter>
    </QueryClientProvider>
  )
}
describe('Manager budget, group and personnel contracts', () => {
  it('edits plan allocation without offering a spending date that its endpoint cannot save', async () => {
    const written = vi.fn()
    server.use(
      http.get('*/api/v1/access-requests/:id/supplements', () => HttpResponse.json(pageResponse([]))),
      http.put('*/api/v1/access-requests/:id/plan-line', async ({ request }) => {
        written(await request.json())
        return HttpResponse.json({
          success: true,
          data: { planLine: { requestId, offPlan: true, planLineAttached: false, stillNeeded: false } }
        })
      })
    )
    mount(<ManagerSpendCorrections id={requestId} />)
    fireEvent.click(screen.getByRole('button', { name: 'Budget plan allocation' }))
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).queryByLabelText('Expected spending date')).not.toBeInTheDocument()
    fireEvent.click(within(dialog).getByLabelText('Outside the annual plan'))
    fireEvent.click(within(dialog).getByRole('button', { name: 'Confirm' }))
    await waitFor(() => expect(written).toHaveBeenCalledWith({ offPlan: true }))
  })
  it('submits decimal money unchanged and omits empty optional budget fields', async () => {
    const written = vi.fn()
    server.use(
      http.post('*/api/v1/budget-proposals', async ({ request }) => {
        written(await request.json())
        return HttpResponse.json({ success: true, data: { proposal } }, { status: 201 })
      })
    )
    mount(<ManagerBudgetForm costCenterId={employeeId} />)
    fireEvent.change(screen.getByLabelText('Fiscal year'), { target: { value: '2027' } })
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Development licenses' } })
    fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '9007199254740993.25' } })
    fireEvent.change(screen.getByLabelText('Reporting currency'), { target: { value: 'USD' } })
    fireEvent.change(screen.getByLabelText('Service period (months)'), { target: { value: '12' } })
    fireEvent.change(screen.getByLabelText('Purchase window starts'), { target: { value: '2027-01-01' } })
    fireEvent.change(screen.getByLabelText('Purchase window ends'), { target: { value: '2027-12-31' } })
    fireEvent.change(screen.getByLabelText('Repeat cycle'), { target: { value: 'MONTHLY' } })
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    await waitFor(() => expect(written).toHaveBeenCalledTimes(1))
    expect(written).toHaveBeenCalledWith({
      costCenterId: employeeId,
      year: 2027,
      lines: [
        {
          description: 'Development licenses',
          amount: { amount: '9007199254740993.25', currency: 'USD' },
          servicePeriodMonths: 12,
          windowFrom: '2027-01-01',
          windowTo: '2027-12-31',
          repeatCycle: 'MONTHLY'
        }
      ]
    })
  })
  it('uses only sendable BM-09 event kinds and waits for server confirmation before closing', async () => {
    const written = vi.fn()
    const closed = vi.fn()
    let finish: () => void = () => undefined
    const pending = new Promise<void>((resolve) => {
      finish = resolve
    })
    server.use(
      http.post('*/api/v1/personnel-notices', async ({ request }) => {
        written(await request.json())
        await pending
        return HttpResponse.json({ success: true, data: { id: requestId } }, { status: 201 })
      })
    )
    mount(<ManagerNoticeForm onCreated={closed} onClose={vi.fn()} />)
    expect(screen.queryByRole('option', { name: 'Job title change' })).not.toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Employee ID'), { target: { value: employeeId } })
    fireEvent.change(screen.getByLabelText('Proposed effective date'), { target: { value: '2026-11-15' } })
    const submit = screen.getByRole('button', { name: 'Submit' })
    fireEvent.click(submit)
    fireEvent.click(submit)
    await waitFor(() => expect(written).toHaveBeenCalledTimes(1))
    expect(written).toHaveBeenCalledWith({ employeeId, kind: 'DEPARTURE', proposedOn: '2026-11-15' })
    expect(closed).not.toHaveBeenCalled()
    finish()
    await waitFor(() => expect(closed).toHaveBeenCalledWith(requestId))
  })
  it('loads server member pages instead of filtering an initial roster', async () => {
    const pages: number[] = []
    server.use(
      http.get('*/api/v1/departments/:id', () => HttpResponse.json({ success: true, data: { id: employeeId } })),
      http.get('*/api/v1/departments/:id/employees', ({ request }) => {
        const page = Number(new URL(request.url).searchParams.get('page'))
        pages.push(page)
        return HttpResponse.json(
          pageResponse(
            [
              {
                employeeCode: `EMP-${page}`,
                fullName: `Member ${page}`,
                status: 'ACTIVE',
                workState: 'WORKING',
                hasWorkEmail: true,
                memberSince: '2026-10-01'
              }
            ],
            page,
            2
          )
        )
      })
    )
    mount(<ManagerLiveTeam departmentId={employeeId} />)
    expect(await screen.findByText('Member 1')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(await screen.findByText('Member 2')).toBeInTheDocument()
    expect(pages).toEqual([1, 2])
  })
  it('blocks group submission when the backend check reports an ineligible plan', async () => {
    const submitted = vi.fn()
    server.use(
      http.get('*/api/v1/group-request-candidates', () =>
        HttpResponse.json(pageResponse([{ employeeId, fullName: 'Test Employee', workEmail: 'employee@example.test' }]))
      ),
      http.post('*/api/v1/group-requests/check', () =>
        HttpResponse.json({
          success: true,
          data: { ...groupCheck, plan: { eligible: false, reason: 'KIND_NOT_MULTI_SEAT' } }
        })
      ),
      http.post('*/api/v1/group-requests', () => {
        submitted()
        return HttpResponse.json({ success: true })
      })
    )
    mount(
      <ManagerLiveCreate group onOpen={vi.fn()} />,
      `/dashboard/manager?planId=${planId}&planName=Standard&applicationName=Test%20Software`
    )
    fireEvent.click(screen.getByRole('combobox', { name: 'Plan' }))
    fireEvent.click(screen.getByRole('option', { name: /Standard/ }))
    fireEvent.change(screen.getByLabelText('Term (months)'), { target: { value: '3' } })
    fireEvent.click(screen.getByRole('combobox', { name: 'Beneficiaries' }))
    fireEvent.click(await screen.findByRole('option', { name: /Test Employee/ }))
    fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'Escape' })
    fireEvent.change(screen.getByLabelText('Reason'), { target: { value: 'Team development' } })
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    expect(await screen.findByText('This plan does not support multiple seats')).toBeInTheDocument()
    expect(within(screen.getByRole('dialog')).getByRole('button', { name: 'Confirm' })).toBeDisabled()
    expect(submitted).not.toHaveBeenCalled()
  })
  it('decides all and only the group lines assigned to the current manager', async () => {
    const written = vi.fn()
    const assigned = {
      employee: person,
      position: 1,
      state: 'AWAITING_NEED',
      needStep: { id: requestId, state: 'PENDING', assignee: { ...person, employeeId: managerId } }
    }
    server.use(
      http.get('*/api/v1/access-requests/:id/lines', () =>
        HttpResponse.json(
          pageResponse([
            assigned,
            {
              ...assigned,
              employee: { ...person, employeeId: planId, fullName: 'Other person' },
              needStep: { ...assigned.needStep, assignee: { ...person, employeeId: assignmentId } }
            }
          ])
        )
      ),
      http.post('*/api/v1/access-requests/:id/line-need-decisions', async ({ request }) => {
        written(await request.json())
        return HttpResponse.json({ success: true, data: { request: managerRequest } })
      })
    )
    mount(<ManagerGroupDecisions id={requestId} employeeId={managerId} hasSpend requestPending />)
    fireEvent.change(await screen.findByLabelText('Decision'), { target: { value: 'APPROVE' } })
    fireEvent.click(screen.getByLabelText('Outside the annual plan'))
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Confirm' }))
    await waitFor(() =>
      expect(written).toHaveBeenCalledWith({ lines: [{ employeeId, decision: 'APPROVE' }], spend: { offPlan: true } })
    )
  })
  it('requires the server canDecide permission for transfer decisions and sends assignment IDs', async () => {
    const written = vi.fn()
    const review = {
      id: requestId,
      employee: { id: employeeId, employeeCode: 'EMP-1', fullName: 'Transferred employee' },
      status: 'OPEN',
      dueOn: '2026-11-05',
      canDecide: true
    }
    server.use(
      http.get('*/api/v1/transfer-reviews', () => HttpResponse.json(pageResponse([review]))),
      http.get('*/api/v1/transfer-reviews/:id', () => HttpResponse.json({ success: true, data: review })),
      http.get('*/api/v1/transfer-reviews/:id/items', () =>
        HttpResponse.json(
          pageResponse([
            {
              assignmentId,
              application: { name: 'Test Tool' },
              plan: { name: 'Standard' },
              decision: 'PENDING',
              needsNewRequest: false
            }
          ])
        )
      ),
      http.post('*/api/v1/transfer-reviews/:id/decisions', async ({ request }) => {
        written(await request.json())
        return HttpResponse.json({ success: true, data: { review } })
      })
    )
    mount(<ManagerTransferReviews />, `/?reviewId=${requestId}`)
    fireEvent.click(await screen.findByRole('button', { name: 'Decision' }))
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Confirm' }))
    await waitFor(() => expect(written).toHaveBeenCalledWith({ assignmentId, decision: 'NOT_NEEDED' }))
  })
  it('preserves fields and shows retry countdown for rate limits', async () => {
    server.use(
      http.post('*/api/v1/personnel-notices', () =>
        HttpResponse.json(
          { error: { code: 'HTTP_TOO_MANY_REQUESTS' } },
          { status: 429, headers: { 'Retry-After': '2' } }
        )
      )
    )
    mount(<ManagerNoticeForm onCreated={vi.fn()} onClose={vi.fn()} />)
    fireEvent.change(screen.getByLabelText('Employee ID'), { target: { value: employeeId } })
    fireEvent.change(screen.getByLabelText('Proposed effective date'), { target: { value: '2026-11-15' } })
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    expect(await screen.findByRole('button', { name: 'Retry in 2s' })).toBeDisabled()
    expect(screen.getByLabelText('Employee ID')).toHaveValue(employeeId)
  })
})
