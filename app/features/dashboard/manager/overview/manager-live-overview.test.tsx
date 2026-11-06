import { managerDashboard, managerReadHandlers } from '../../../../../test/fixtures/manager-integration'
import { employeeId } from '../../../../../test/fixtures/employee-api'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { ManagerLiveOverview } from './views/manager-live-overview'

const server = setupServer(
  ...managerReadHandlers,
  http.get('*/api/v1/spend-queue', () => HttpResponse.json(list(0))),
  http.get('*/api/v1/handover-duties', () => HttpResponse.json(list(0))),
  http.get('*/api/v1/departments/:id', () =>
    HttpResponse.json({
      success: true,
      data: { id: employeeId, name: 'Engineering', code: 'ENG', status: 'ACTIVE', memberCount: 5, costCenter: null }
    })
  )
)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
beforeEach(async () => {
  await setAppLanguage('en', false)
})

function list(totalItems: number) {
  return {
    success: true,
    data: { items: [], pagination: { page: 1, pageSize: 1, totalPages: totalItems, totalItems } }
  }
}
function mount(departmentId?: string) {
  const select = vi.fn()
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <MemoryRouter initialEntries={[departmentId ? `/?departmentId=${departmentId}` : '/']}>
        <ManagerLiveOverview
          name='Test Manager'
          departmentName='Engineering'
          departmentId={departmentId}
          onSelectTab={select}
        />
      </MemoryRouter>
    </QueryClientProvider>
  )
  return select
}

it('shows one set of work metrics, retains server totals and scopes open handovers', async () => {
  const requests: URL[] = []
  server.use(
    http.get('*/api/v1/spend-queue', ({ request }) => {
      requests.push(new URL(request.url))
      return HttpResponse.json(list(23))
    }),
    http.get('*/api/v1/transfer-reviews', ({ request }) => {
      requests.push(new URL(request.url))
      return HttpResponse.json(list(8))
    }),
    http.get('*/api/v1/handover-duties', ({ request }) => {
      requests.push(new URL(request.url))
      return HttpResponse.json(list(5))
    })
  )
  const select = mount()
  expect(await screen.findByText('23 records')).toBeInTheDocument()
  expect(await screen.findByRole('button', { name: 'Spending submission queue' })).toBeInTheDocument()
  expect(screen.queryByRole('article', { name: 'Awaiting spending request submission' })).not.toBeInTheDocument()
  expect(screen.queryByRole('article', { name: 'Open transfer reviews' })).not.toBeInTheDocument()
  expect(screen.getAllByRole('button', { name: 'Open transfer reviews' })).toHaveLength(1)
  expect(await within(screen.getByRole('article', { name: 'Open data handovers' })).findByText('5')).toBeInTheDocument()
  expect(requests.some((url) => url.pathname.endsWith('/transfer-reviews'))).toBe(false)
  const handovers = requests.find((url) => url.pathname.endsWith('/handover-duties'))?.searchParams
  expect(handovers?.get('status')).toBe('OPEN')
  expect(handovers?.get('scope')).toBe('mine')
  fireEvent.click(screen.getByRole('button', { name: 'Open transfer reviews' }))
  expect(select).toHaveBeenCalledWith('transfer-reviews', { departmentId: employeeId })
  expect(screen.queryByRole('button', { name: 'Request software for staff' })).not.toBeInTheDocument()
  expect(screen.getAllByRole('button', { name: 'Request on behalf' })).toHaveLength(1)
  fireEvent.click(screen.getByRole('button', { name: 'Request on behalf' }))
  expect(select).toHaveBeenCalledWith('create-employee-request', { scope: 'team' })
})

it('keeps a failed count unavailable instead of presenting it as zero', async () => {
  server.use(
    http.get('*/api/v1/spend-queue', () => HttpResponse.json(list(0))),
    http.get('*/api/v1/handover-duties', () =>
      HttpResponse.json({ error: { code: 'SERVICE.UNAVAILABLE' } }, { status: 503 })
    )
  )
  mount()
  const reviews = screen.getByRole('article', { name: 'Open data handovers' })
  expect(await within(reviews).findByText('Unable to load data. Try again.')).toBeInTheDocument()
  expect(within(reviews).getByText('Not available')).toBeInTheDocument()
  expect(within(reviews).queryByText('0')).not.toBeInTheDocument()
  expect(within(reviews).getByRole('button', { name: 'Retry' })).toBeInTheDocument()
})

it('keeps an unavailable dashboard metric unavailable without a duplicate fallback card', async () => {
  server.use(
    http.get('*/api/v1/dashboards/manager', () =>
      HttpResponse.json({
        success: true,
        data: {
          ...managerDashboard,
          sections: {
            ...managerDashboard.sections,
            transferReviews: { state: 'NOT_AVAILABLE', count: null, sourceOperationId: null, reason: 'NO_DATA_SOURCE' }
          }
        }
      })
    )
  )
  mount()
  const card = await screen.findByRole('button', { name: 'Open transfer reviews' })
  expect(within(card).getByText('Not available')).toBeInTheDocument()
  expect(within(card).queryByText('0')).not.toBeInTheDocument()
  expect(screen.queryByRole('article', { name: 'Open transfer reviews' })).not.toBeInTheDocument()
})

it.each([undefined, employeeId])('shows the department name once with department context %s', async (departmentId) => {
  mount(departmentId)
  if (departmentId) await screen.findByRole('heading', { name: 'Engineering' })
  expect(screen.getAllByRole('heading', { name: departmentId ? 'Engineering' : /Test Manager/ })).toHaveLength(1)
  expect(screen.getByLabelText('Department ID')).toHaveValue(departmentId ?? '')
})
