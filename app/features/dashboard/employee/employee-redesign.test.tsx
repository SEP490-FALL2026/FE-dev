import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import type { ExpiryReminderPageResponseDtoDataItemsItem } from '~/shared/api/generated/model/assignment-expiry/expiryReminderPageResponseDtoDataItemsItem'
import { assignmentId, employeeId, pageResponse, plan, requestId } from '../../../../test/fixtures/employee-api'
import { EmployeeLiveOverview } from './overview/views/employee-live-overview'
import { EmployeeLiveAccessView } from './my-software/views/employee-live-access-view'

const server = setupServer(
  http.get('*/api/v1/dashboards/employee', () => HttpResponse.json({ success: true, data: null }))
)
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
it('shows draft totals without requesting removed handover APIs', async () => {
  const handovers = vi.fn()
  server.use(
    http.get('*/api/v1/access-requests/drafts', () =>
      HttpResponse.json({
        success: true,
        data: { ...pageResponse().data, pagination: { page: 1, pageSize: 1, totalItems: 19, totalPages: 19 } }
      })
    ),
    http.get('*/api/v1/handover-duties', () => {
      handovers()
      return new HttpResponse(null, { status: 404 })
    })
  )
  const navigate = vi.fn()
  mount(<EmployeeLiveOverview name='Test Employee' selfServiceOnly={false} onSelectTab={navigate} />)
  const drafts = screen.getByRole('article', { name: 'Saved request drafts' })
  expect(await within(drafts).findByText('19')).toBeInTheDocument()
  expect(screen.queryByRole('article', { name: 'Open data handovers' })).not.toBeInTheDocument()
  expect(screen.queryByRole('table', { name: 'Handovers to complete' })).not.toBeInTheDocument()
  expect(handovers).not.toHaveBeenCalled()
  fireEvent.click(within(drafts).getByRole('button', { name: 'View details' }))
  expect(navigate).toHaveBeenCalledWith('my-requests')
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

it('loads only the selected access list and renews the actual assignment', async () => {
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
  mount(<EmployeeLiveAccessView onSelectTab={navigate} />, '/?tab=my-software&accessList=expiry&page=2&returnsPage=3')
  const table = await screen.findByRole('table', { name: 'Expiry reminders' })
  fireEvent.click(within(table).getByRole('button', { name: 'Renew access' }))
  expect(navigate).toHaveBeenCalledWith('create-request', { mode: 'renewal', assignmentId })
  expect(queries.find((url) => url.pathname.endsWith('/assignment-expiry-reminders'))?.searchParams.get('page')).toBe(
    '2'
  )
  expect(queries.some((url) => url.pathname.endsWith('/return-requests'))).toBe(false)
  fireEvent.click(screen.getByRole('button', { name: 'Return requests' }))
  await screen.findByRole('heading', { name: 'Return requests' })
  expect(queries.find((url) => url.pathname.endsWith('/return-requests'))?.searchParams.get('page')).toBe('1')
})
