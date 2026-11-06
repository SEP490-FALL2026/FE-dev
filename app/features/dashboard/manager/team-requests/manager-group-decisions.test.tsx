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
  planId,
  requestId
} from '../../../../../test/fixtures/employee-api'
import { managerId, managerRequest } from '../../../../../test/fixtures/manager-api'
import { managerReadHandlers } from '../../../../../test/fixtures/manager-integration'
import { ManagerGroupDecisions } from './components/manager-group-decisions'

const first = {
  employee: { ...person, fullName: 'Alex' },
  state: 'AWAITING_NEED',
  needStep: { state: 'PENDING', assignee: { employeeId: managerId } }
}
const second = { ...first, employee: { ...person, employeeId: planId, fullName: 'Robin' } }
const lines = [
  first,
  second,
  {
    ...first,
    employee: { ...person, employeeId: assignmentId },
    needStep: { state: 'PENDING', assignee: { employeeId: assignmentId } }
  }
]
const written = vi.fn()
const server = setupServer(
  ...managerReadHandlers,
  http.get('*/api/v1/access-requests/:id/lines', () => HttpResponse.json(pageResponse(lines))),
  http.post('*/api/v1/access-requests/:id/line-need-decisions', async ({ request }) => {
    written(await request.json())
    return HttpResponse.json({ success: true, data: { request: managerRequest } })
  })
)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
beforeEach(async () => {
  written.mockClear()
  await setAppLanguage('en', false)
})
function mount() {
  return render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <MemoryRouter>
        <ManagerGroupDecisions id={requestId} employeeId={managerId} requestPending />
      </MemoryRouter>
    </QueryClientProvider>
  )
}
async function confirm() {
  fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
  fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Confirm' }))
  await waitFor(() => expect(written).toHaveBeenCalledOnce())
}
it('requires an explicit decision and applies one approval to all and only the assigned people', async () => {
  mount()
  const group = await screen.findByRole('group', { name: 'Decision for the whole group' })
  expect(within(group).getByRole('radio', { name: 'Approve need' })).not.toBeChecked()
  fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  fireEvent.click(within(group).getByRole('radio', { name: 'Approve need' }))
  expect(screen.queryByLabelText('Reason for rejection')).not.toBeInTheDocument()
  expect(screen.queryByLabelText('Reason for confirming a term over 12 months')).not.toBeInTheDocument()
  await confirm()
  expect(written).toHaveBeenCalledWith({
    lines: [
      { employeeId, decision: 'APPROVE' },
      { employeeId: planId, decision: 'APPROVE' }
    ]
  })
})
it('requires one nonempty common reason and omits spend and term confirmation when rejecting everyone', async () => {
  mount()
  fireEvent.click(await screen.findByRole('radio', { name: 'Approve need' }))
  fireEvent.click(screen.getByRole('radio', { name: 'Reject need' }))
  expect(screen.queryByLabelText('Outside the annual plan')).not.toBeInTheDocument()
  expect(screen.queryByLabelText('Reason for confirming a term over 12 months')).not.toBeInTheDocument()
  expect(screen.getAllByLabelText('Reason for rejection')).toHaveLength(1)
  fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  fireEvent.change(screen.getByLabelText('Reason for rejection'), { target: { value: '  Not needed  ' } })
  await confirm()
  expect(written).toHaveBeenCalledWith({
    lines: [
      { employeeId, decision: 'REJECT', reason: 'Not needed' },
      { employeeId: planId, decision: 'REJECT', reason: 'Not needed' }
    ]
  })
})
it('allows mixed decisions and discards an inherited rejection reason on the approved person', async () => {
  mount()
  fireEvent.click(await screen.findByRole('radio', { name: 'Reject need' }))
  fireEvent.change(screen.getByLabelText('Reason for rejection'), { target: { value: 'Existing tool is sufficient' } })
  fireEvent.click(screen.getByLabelText('Decide individually'))
  const alex = screen.getByRole('group', { name: 'Decision for Alex' })
  fireEvent.click(within(alex).getByRole('radio', { name: 'Approve need' }))
  expect(within(alex).queryByLabelText('Reason for rejection')).not.toBeInTheDocument()
  await confirm()
  expect(written).toHaveBeenCalledWith({
    lines: [
      { employeeId, decision: 'APPROVE' },
      { employeeId: planId, decision: 'REJECT', reason: 'Existing tool is sufficient' }
    ]
  })
})
it('does not offer removed term or allocation controls', async () => {
  mount()
  fireEvent.click(await screen.findByRole('radio', { name: 'Approve need' }))
  expect(screen.queryByLabelText('Outside the annual plan')).not.toBeInTheDocument()
  expect(screen.queryByLabelText('Reason for confirming a term over 12 months')).not.toBeInTheDocument()
  await confirm()
  expect(Object.keys(written.mock.calls[0][0])).toEqual(['lines'])
})
it('refuses a partially loaded participant list', async () => {
  server.use(http.get('*/api/v1/access-requests/:id/lines', () => HttpResponse.json(pageResponse(lines, 1, 2))))
  mount()
  await screen.findByRole('group', { name: 'Decision for the whole group' })
  expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled()
  expect(written).not.toHaveBeenCalled()
})
