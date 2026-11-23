import { managerReadHandlers } from '../../../../../test/fixtures/manager-integration'
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
        <ManagerLiveOverview name='Test Manager' departmentId={departmentId} onSelectTab={select} />
      </MemoryRouter>
    </QueryClientProvider>
  )
  return select
}

it('retains spending totals without loading removed handover or transfer-review APIs', async () => {
  const removedRequests = vi.fn()
  server.use(
    http.get('*/api/v1/spend-queue', () => HttpResponse.json(list(23))),
    http.get('*/api/v1/transfer-reviews', () => {
      removedRequests()
      return new HttpResponse(null, { status: 404 })
    }),
    http.get('*/api/v1/handover-duties', () => {
      removedRequests()
      return new HttpResponse(null, { status: 404 })
    })
  )
  const select = mount()
  expect(await screen.findByText('23 records')).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Open transfer reviews' })).not.toBeInTheDocument()
  expect(screen.queryByRole('article', { name: 'Open data handovers' })).not.toBeInTheDocument()
  expect(removedRequests).not.toHaveBeenCalled()
  fireEvent.click(await screen.findByRole('button', { name: 'Spending submission queue' }))
  expect(select).toHaveBeenCalledWith('weekly-batch', { departmentId: employeeId })
})

it('retains retry when the spending queue fails', async () => {
  let failed = true
  server.use(
    http.get('*/api/v1/spend-queue', () =>
      failed
        ? HttpResponse.json({ error: { code: 'SERVICE.UNAVAILABLE' } }, { status: 503 })
        : HttpResponse.json(list(0))
    )
  )
  mount()
  expect(await screen.findByText('Unable to load data. Try again.')).toBeInTheDocument()
  failed = false
  fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
  expect(await screen.findByText('0 records')).toBeInTheDocument()
})

it('keeps an unavailable dashboard metric unavailable', async () => {
  mount()
  const card = await screen.findByText('Unused seats')
  expect(within(card.closest('div')!).getByText('Not available')).toBeInTheDocument()
})

it.each([undefined, employeeId])(
  'shows the department summary without an ID field for context %s',
  async (departmentId) => {
    mount(departmentId)
    if (departmentId) {
      await screen.findByRole('heading', { name: 'Engineering' })
      expect(screen.getAllByRole('heading', { name: 'Engineering' })).toHaveLength(1)
    } else expect(screen.queryByText(/Engineering/)).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Department ID')).not.toBeInTheDocument()
  }
)
