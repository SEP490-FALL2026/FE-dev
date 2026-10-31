import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { ManagerLiveOverview } from './views/manager-live-overview'

const server = setupServer()
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
function mount() {
  const select = vi.fn()
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <MemoryRouter>
        <ManagerLiveOverview name='Test Manager' departmentName='Engineering' onSelectTab={select} />
      </MemoryRouter>
    </QueryClientProvider>
  )
  return select
}

it('uses server totals and scopes open duties rather than counting a preview page', async () => {
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
  expect(
    await within(screen.getByRole('article', { name: 'Awaiting spending request submission' })).findByText('23')
  ).toBeInTheDocument()
  expect(
    await within(screen.getByRole('article', { name: 'Open transfer reviews' })).findByText('8')
  ).toBeInTheDocument()
  expect(await within(screen.getByRole('article', { name: 'Open data handovers' })).findByText('5')).toBeInTheDocument()
  expect(requests.find((url) => url.pathname.endsWith('/transfer-reviews'))?.searchParams.get('status')).toBe('OPEN')
  const handovers = requests.find((url) => url.pathname.endsWith('/handover-duties'))?.searchParams
  expect(handovers?.get('status')).toBe('OPEN')
  expect(handovers?.get('scope')).toBe('mine')
  fireEvent.click(
    within(screen.getByRole('article', { name: 'Open transfer reviews' })).getByRole('button', { name: 'Open' })
  )
  expect(select).toHaveBeenCalledWith('transfer-reviews')
  fireEvent.click(
    screen.getByRole('button', {
      name: 'Request software for staff'
    })
  )
  expect(select).toHaveBeenCalledWith('create-employee-request', { scope: 'individual' })
})

it('keeps a failed count unavailable instead of presenting it as zero', async () => {
  server.use(
    http.get('*/api/v1/spend-queue', () => HttpResponse.json(list(0))),
    http.get('*/api/v1/transfer-reviews', () =>
      HttpResponse.json({ error: { code: 'SERVICE.UNAVAILABLE' } }, { status: 503 })
    ),
    http.get('*/api/v1/handover-duties', () => HttpResponse.json(list(0)))
  )
  mount()
  const reviews = screen.getByRole('article', { name: 'Open transfer reviews' })
  expect(await within(reviews).findByText('Unable to load data. Try again.')).toBeInTheDocument()
  expect(within(reviews).getByText('Not available')).toBeInTheDocument()
  expect(within(reviews).queryByText('0')).not.toBeInTheDocument()
  expect(within(reviews).getByRole('button', { name: 'Retry' })).toBeInTheDocument()
})
