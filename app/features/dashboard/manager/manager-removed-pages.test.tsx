import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter, useLocation, useSearchParams } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { employeeId, pageResponse } from '../../../../test/fixtures/employee-api'
import { managerReadHandlers } from '../../../../test/fixtures/manager-integration'
import { isValidManagerTab } from './manager-nav'
import { ManagerScreen } from './manager-screen'
import { ManagerSidebarNav } from './shared/components/manager-sidebar-nav'

const removedRead = vi.fn()
const server = setupServer(
  ...managerReadHandlers,
  http.get('*/api/v1/spend-queue', () => HttpResponse.json(pageResponse([]))),
  http.get('*/api/v1/transfer-reviews', () => {
    removedRead()
    return HttpResponse.json(pageResponse([]))
  }),
  http.get('*/api/v1/handover-duties', () => {
    removedRead()
    return HttpResponse.json(pageResponse([]))
  })
)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
beforeEach(async () => {
  removedRead.mockClear()
  await setAppLanguage('en', false)
})

function Workspace() {
  const [params] = useSearchParams()
  const location = useLocation()
  const tab = params.get('tab')
  return (
    <>
      <nav>
        <ManagerSidebarNav activeParent={tab ?? 'overview'} onSelectTab={vi.fn()} />
      </nav>
      <ManagerScreen tab={isValidManagerTab(tab) ? tab : 'overview'} onSelectTab={vi.fn()} />
      <output data-testid='location'>{location.pathname + location.search}</output>
    </>
  )
}

it.each(['transfer-reviews', 'handovers'])('returns legacy %s links to the overview', async (tab) => {
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <MemoryRouter initialEntries={[`/dashboard/manager?tab=${tab}&departmentId=${employeeId}&reviewId=old`]}>
        <Workspace />
      </MemoryRouter>
    </QueryClientProvider>
  )
  const nav = screen.getByRole('navigation')
  expect(within(nav).queryByRole('button', { name: 'Transfer reviews' })).not.toBeInTheDocument()
  expect(within(nav).queryByRole('button', { name: 'Data handovers' })).not.toBeInTheDocument()
  expect(await screen.findByRole('heading', { level: 1, name: 'Overview' })).toBeInTheDocument()
  expect(screen.getByTestId('location')).toHaveTextContent(
    new RegExp(`^/dashboard/manager\\?departmentId=${employeeId}$`)
  )
  expect(removedRead).not.toHaveBeenCalled()
})
