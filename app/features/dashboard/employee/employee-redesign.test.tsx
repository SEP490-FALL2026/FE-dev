import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import type { HandoverDutyPageResponseDtoDataItemsItem } from '~/shared/api/generated/model/handover-duties/handoverDutyPageResponseDtoDataItemsItem'
import type { ExpiryReminderPageResponseDtoDataItemsItem } from '~/shared/api/generated/model/assignment-expiry/expiryReminderPageResponseDtoDataItemsItem'
import { assignmentId, employeeId, pageResponse, plan, planId, requestId } from '../../../../test/fixtures/employee-api'
import { EmployeeLiveOverview } from './overview/views/employee-live-overview'
import { EmployeeLiveAccessView } from './my-software/views/employee-live-access-view'

const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
beforeEach(async () => {
  await setAppLanguage('en', false)
})
function mount(children: React.ReactNode, url = '/') {
  return render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <MemoryRouter initialEntries={[url]}>{children}</MemoryRouter>
    </QueryClientProvider>
  )
}
const duty: HandoverDutyPageResponseDtoDataItemsItem = {
  id: requestId,
  assignmentId,
  application: { id: planId, name: 'Test Software' },
  plan: { id: planId, name: 'Standard' },
  employee: { id: employeeId, fullName: 'Test Employee', employeeCode: 'EMP-TEST' },
  source: 'DEPARTURE',
  role: 'REQUESTER',
  status: 'OPEN',
  dataLoss: false,
  dueOn: '2026-11-01',
  overdue: false,
  flaggedUnconfirmed: false,
  waitingReason: null,
  canConfirm: true
}

it('displays server totals and open handovers without treating the preview as the full list', async () => {
  const requests: URL[] = []
  server.use(
    http.get('*/api/v1/access-requests/drafts', () =>
      HttpResponse.json({
        success: true,
        data: { ...pageResponse().data, pagination: { page: 1, pageSize: 1, totalItems: 19, totalPages: 19 } }
      })
    ),
    http.get('*/api/v1/handover-duties', ({ request }) => {
      requests.push(new URL(request.url))
      return HttpResponse.json({
        success: true,
        data: { items: [duty], pagination: { page: 1, pageSize: 4, totalItems: 7, totalPages: 2 } }
      })
    })
  )
  const navigate = vi.fn()
  mount(<EmployeeLiveOverview name='Test Employee' selfServiceOnly={false} onSelectTab={navigate} />)
  expect(
    await within(screen.getByRole('article', { name: 'Saved request drafts' })).findByText('19')
  ).toBeInTheDocument()
  expect(await within(screen.getByRole('article', { name: 'Open data handovers' })).findByText('7')).toBeInTheDocument()
  expect(
    await within(screen.getByRole('table', { name: 'Handovers to complete' })).findByText('Test Software')
  ).toBeInTheDocument()
  expect(requests[0].searchParams.get('scope')).toBe('mine')
  expect(requests[0].searchParams.get('status')).toBe('OPEN')
  fireEvent.click(
    within(screen.getByRole('article', { name: 'Saved request drafts' })).getByRole('button', { name: 'View details' })
  )
  expect(navigate).toHaveBeenCalledWith('my-requests')
  expect(screen.queryByRole('button', { name: 'Notifications' })).not.toBeInTheDocument()
})

it('shows a failed count as unavailable and recovers it through retry', async () => {
  let failed = true
  server.use(
    http.get('*/api/v1/access-requests/drafts', () =>
      failed
        ? HttpResponse.json({ error: { code: 'SERVICE.UNAVAILABLE' } }, { status: 503 })
        : HttpResponse.json(pageResponse())
    ),
    http.get('*/api/v1/handover-duties', () => HttpResponse.json(pageResponse()))
  )
  mount(<EmployeeLiveOverview name='Test Employee' selfServiceOnly={false} onSelectTab={vi.fn()} />)
  const drafts = screen.getByRole('article', { name: 'Saved request drafts' })
  expect(await within(drafts).findByRole('alert')).toBeInTheDocument()
  expect(within(drafts).getByText('Not available')).toBeInTheDocument()
  expect(within(drafts).queryByText('0')).not.toBeInTheDocument()
  failed = false
  fireEvent.click(within(drafts).getByRole('button', { name: 'Try again' }))
  expect(await within(drafts).findByText('0')).toBeInTheDocument()
})

it('keeps independent server pages for reminders and returns and renews the actual assignment', async () => {
  const queries: URL[] = []
  const holder = { id: employeeId, employeeCode: 'EMP-TEST', fullName: 'Test Employee' }
  const reminder: ExpiryReminderPageResponseDtoDataItemsItem = {
    id: requestId,
    assignmentId,
    audience: 'EMPLOYEE',
    expectedEndDate: '2026-11-30',
    recipient: holder,
    holder,
    plan,
    createdAt: '2026-10-31T03:00:00Z'
  }
  server.use(
    http.get('*/api/v1/assignment-expiry-reminders', ({ request }) => {
      queries.push(new URL(request.url))
      return HttpResponse.json(pageResponse([reminder], 2, 2))
    }),
    http.get('*/api/v1/return-requests', ({ request }) => {
      queries.push(new URL(request.url))
      return HttpResponse.json(pageResponse([], 3, 3))
    })
  )
  const navigate = vi.fn()
  mount(<EmployeeLiveAccessView onSelectTab={navigate} />, '/?tab=my-software&page=2&returnsPage=3')
  const table = await screen.findByRole('table', { name: 'Expiry reminders' })
  fireEvent.click(within(table).getByRole('button', { name: 'Renew access' }))
  expect(navigate).toHaveBeenCalledWith('create-request', { mode: 'renewal', assignmentId })
  expect(queries.find((url) => url.pathname.endsWith('/assignment-expiry-reminders'))?.searchParams.get('page')).toBe(
    '2'
  )
  expect(queries.find((url) => url.pathname.endsWith('/return-requests'))?.searchParams.get('page')).toBe('3')
})
