import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it, vi } from 'vitest'
import type { LinesResponseDtoDataItemsItem } from '~/shared/api/generated/model/group-requests/linesResponseDtoDataItemsItem'
import type { SimilarSeatsResponseDtoDataItemsItem } from '~/shared/api/generated/model/access-requests/similarSeatsResponseDtoDataItemsItem'
import { setAppLanguage } from '~/shared/i18n/i18n'
import {
  assignmentId,
  employeeId,
  groupCheck,
  pageResponse,
  person,
  plan,
  requestId
} from '../../../../test/fixtures/employee-api'
import { managerId, managerProfile, managerRequest } from '../../../../test/fixtures/manager-api'
import { managerReadHandlers } from '../../../../test/fixtures/manager-integration'
import { ManagerScreen } from './manager-screen'
import { ManagerLiveRequest } from './team-requests/views/manager-live-request'
import { ManagerSimilarSeats } from './team-requests/components/manager-similar-seats'
import { ManagerGroupConfirmation } from './team-requests/components/manager-group-confirmation'

const line: LinesResponseDtoDataItemsItem = {
  employee: person,
  position: 1,
  state: 'NEED_CONFIRMED',
  needStep: { id: assignmentId, state: 'APPROVED', assignee: null },
  expectedEndDate: null,
  needDecision: null,
  spendDecision: null,
  cost: null,
  share: null,
  endedAt: null,
  endedBy: null,
  endReason: null,
  cancelCause: null
}
const server = setupServer(
  ...managerReadHandlers,
  http.get('*/api/v1/me', () => HttpResponse.json({ success: true, data: managerProfile })),
  http.get('*/api/v1/departments/:id', () => HttpResponse.json({ success: true, data: { id: employeeId } })),
  http.get('*/api/v1/departments/:id/employees', () =>
    HttpResponse.json(pageResponse([{ ...person, status: 'ACTIVE', workState: 'WORKING', memberSince: '2026-10-01' }]))
  ),
  http.get('*/api/v1/departments/:id/tools-in-use', () => HttpResponse.json(pageResponse())),
  http.get('*/api/v1/return-requests', () => HttpResponse.json(pageResponse())),
  http.get('*/api/v1/access-requests/:id/lines', () => HttpResponse.json(pageResponse([line]))),
  http.get('*/api/v1/access-requests/:id/supplements', () => HttpResponse.json(pageResponse()))
)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
beforeEach(async () => {
  await setAppLanguage('en', false)
})
function mount(children: React.ReactNode, url = '/dashboard/manager') {
  return render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      <MemoryRouter initialEntries={[url]}>{children}</MemoryRouter>
    </QueryClientProvider>
  )
}

it.each(['AWAITING_SPEND_SUBMISSION', 'AWAITING_BUDGET', 'WAITING_CONTROLLED'])(
  'shows one participant list with withdrawal actions at %s',
  async (state) => {
    server.use(
      http.get('*/api/v1/access-requests/:id', () =>
        HttpResponse.json({ success: true, data: { request: { ...managerRequest, type: 'GROUP_GRANT', state } } })
      )
    )
    mount(<ManagerLiveRequest id={requestId} employeeId={managerId} departmentCode='ENG' onBack={vi.fn()} />)
    expect(await screen.findByRole('button', { name: 'Withdraw member' })).toBeInTheDocument()
    expect(screen.getAllByText(person.fullName)).toHaveLength(2) // Requester summary plus one participant row.
    expect(screen.getAllByRole('heading', { name: 'Participants' })).toHaveLength(1)
    expect(screen.queryByRole('heading', { name: 'Withdraw group members' })).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Decision')).not.toBeInTheDocument()
  }
)

it('retains line decisions and hides withdrawal actions while a group is awaiting need approval', async () => {
  server.use(
    http.get('*/api/v1/access-requests/:id', () =>
      HttpResponse.json({ success: true, data: { request: { ...managerRequest, type: 'GROUP_GRANT' } } })
    ),
    http.get('*/api/v1/access-requests/:id/lines', () =>
      HttpResponse.json(
        pageResponse([
          {
            ...line,
            state: 'AWAITING_NEED',
            needStep: { id: assignmentId, state: 'PENDING', assignee: { ...person, employeeId: managerId } }
          }
        ])
      )
    )
  )
  mount(<ManagerLiveRequest id={requestId} employeeId={managerId} departmentCode='ENG' onBack={vi.fn()} />)
  expect(await screen.findByRole('group', { name: 'Decision for the whole group' })).toBeInTheDocument()
  expect(screen.getAllByRole('heading', { name: 'Participants' })).toHaveLength(1)
  expect(screen.queryByRole('button', { name: 'Withdraw member' })).not.toBeInTheDocument()
})

it('distinguishes assignments for the same plan and preserves server pagination', async () => {
  const reads: URLSearchParams[] = []
  const seat: SimilarSeatsResponseDtoDataItemsItem = {
    assignmentId,
    plan,
    accountIdentifier: 'build@example.test',
    heldSince: '2026-10-01'
  }
  server.use(
    http.get('*/api/v1/access-requests/:id/similar-seats', ({ request }) => {
      const params = new URL(request.url).searchParams
      reads.push(params)
      const page = Number(params.get('page'))
      return HttpResponse.json(
        pageResponse(
          page === 1
            ? [seat, { ...seat, assignmentId: employeeId, accountIdentifier: 'design@example.test' }]
            : [{ ...seat, assignmentId: managerId, accountIdentifier: 'next@example.test' }],
          page,
          2
        )
      )
    })
  )
  mount(<ManagerSimilarSeats id={requestId} />)
  fireEvent.click(screen.getByText('Existing similar access'))
  expect(await screen.findByText('design@example.test')).toBeInTheDocument()
  const table = screen.getByRole('table', { name: 'Existing similar access' })
  const rows = within(table).getAllByRole('row')
  expect(rows).toHaveLength(3)
  expect(within(rows[1]!).getByText('build@example.test')).toBeInTheDocument()
  expect(within(rows[1]!).getByText(assignmentId)).toBeInTheDocument()
  expect(within(rows[2]!).getByText(employeeId)).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Next' }))
  expect(await screen.findByText('next@example.test')).toBeInTheDocument()
  expect(screen.queryByText('build@example.test')).not.toBeInTheDocument()
  expect(reads.at(-1)?.get('page')).toBe('2')
  expect(reads.at(-1)?.get('pageSize')).toBe('20')
})

it('groups identical validation reasons and identifies affected colleagues with their emails', async () => {
  const confirm = vi.fn()
  server.use(
    http.post('*/api/v1/group-requests/check', () =>
      HttpResponse.json({
        success: true,
        data: {
          ...groupCheck,
          lines: [employeeId, managerId].map((id) => ({ employeeId: id, ok: false, reason: 'END_DATE_REQUIRED' }))
        }
      })
    )
  )
  mount(
    <ManagerGroupConfirmation
      body={{
        planId: plan.planId,
        businessReason: 'Work',
        termMonths: 1,
        lines: [{ employeeId }, { employeeId: managerId }]
      }}
      people={[
        { value: employeeId, label: 'Alex Nguyen', description: 'alex.build@example.test' },
        { value: managerId, label: 'Alex Nguyen', description: 'alex.design@example.test' }
      ]}
      blocked={false}
      busy={false}
      onConfirm={confirm}
      onCancel={vi.fn()}
    />
  )
  expect(await screen.findByText('An access end date is required')).toBeInTheDocument()
  expect(screen.getAllByText('An access end date is required')).toHaveLength(1)
  expect(screen.getByText('alex.build@example.test')).toBeInTheDocument()
  expect(screen.getByText('alex.design@example.test')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled()
  fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
  expect(confirm).not.toHaveBeenCalled()
})

it('keeps a single members label and the total after removing the duplicate section heading', async () => {
  mount(<ManagerScreen tab='my-team' onSelectTab={vi.fn()} />, `/dashboard/manager?departmentId=${employeeId}`)
  expect(await screen.findByText('1 records')).toBeInTheDocument()
  expect(screen.getAllByText('Department members')).toHaveLength(1)
  expect(screen.queryByRole('heading', { name: 'Department members' })).not.toBeInTheDocument()
  expect(screen.getByRole('table', { name: 'Department members' })).toBeInTheDocument()
})

it.each(['assigned', 'returns'])('keeps tools navigation distinct from the %s section title', async (view) => {
  mount(
    <ManagerScreen tab='team-software' onSelectTab={vi.fn()} />,
    `/dashboard/manager?departmentId=${employeeId}&toolsView=${view}`
  )
  await screen.findByRole('heading', { name: 'Assigned tools' })
  expect(screen.getAllByText('Assigned tools')).toHaveLength(1)
  expect(screen.getByRole('button', { name: 'Current assignments' })).toHaveAttribute(
    'aria-pressed',
    String(view === 'assigned')
  )
  expect(screen.getAllByText('Return requests')).toHaveLength(1)
  await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())
})
