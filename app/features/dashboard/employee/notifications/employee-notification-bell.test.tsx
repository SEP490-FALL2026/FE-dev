import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { delay, http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter, useLocation } from 'react-router'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { toast } from 'sonner'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { requestId } from '../../../../../test/fixtures/employee-api'
import { EmployeeNotificationBell } from './components/employee-notification-bell'
import { ManagerNotificationBell } from '../../manager/notifications/components/manager-notification-bell'

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))
const markRead = vi.fn()
const markAllRead = vi.fn()
const listRequests = vi.fn()
const outsideLabel = 'Outside'
let unread = 2
let readIds = new Set<string>()
const secondId = 'b010b6b1-39ed-4b87-a950-157c84a50002'
const notice = (id = requestId, code = 'REQUEST_SUBMITTED') => ({
  id,
  code,
  subject: null,
  params: { requestId },
  createdAt: '2026-10-31T03:00:00Z',
  readAt: readIds.has(id) ? '2026-11-01T03:00:00Z' : null
})
const page = (items = [notice()], currentPage = 1, totalPages = 1) => ({
  success: true,
  data: { items, pagination: { page: currentPage, pageSize: 10, totalItems: totalPages * items.length, totalPages } }
})
const server = setupServer(
  http.get('*/api/v1/notifications/unread-count', () => HttpResponse.json({ success: true, data: { unread } })),
  http.get('*/api/v1/notifications', ({ request }) => {
    listRequests(new URL(request.url).searchParams.toString())
    return HttpResponse.json(page())
  }),
  http.post('*/api/v1/notifications/read-all', async () => {
    markAllRead()
    await delay(50)
    readIds = new Set([requestId, secondId])
    unread = 0
    return HttpResponse.json({ success: true, data: { updated: 2 } })
  }),
  http.post('*/api/v1/notifications/:id/read', async ({ params }) => {
    markRead(params.id)
    await delay(50)
    readIds.add(String(params.id))
    unread = Math.max(0, unread - 1)
    return HttpResponse.json({ success: true, data: null })
  })
)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
beforeEach(async () => {
  server.resetHandlers()
  vi.clearAllMocks()
  unread = 2
  readIds = new Set()
  await setAppLanguage('en', false)
})
function Location() {
  const location = useLocation()
  return (
    <output data-testid='location'>
      {location.pathname}
      {location.search}
    </output>
  )
}
function mount(role: 'employee' | 'manager') {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[`/dashboard/${role}?tab=my-requests&page=3&departmentId=department-1`]}>
        {role === 'employee' ? <EmployeeNotificationBell /> : <ManagerNotificationBell />}
        <Location />
        <button type='button'>{outsideLabel}</button>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

for (const role of ['employee', 'manager'] as const) {
  describe(`${role} notification dropdown`, () => {
    it('opens the list without marking it read and keeps page context when dismissed', async () => {
      mount(role)
      expect(await screen.findByText('2')).toBeInTheDocument()
      expect(listRequests).not.toHaveBeenCalled()
      const bell = screen.getByRole('button', { name: 'Notifications' })
      fireEvent.click(bell)
      const dialog = await screen.findByRole('dialog', { name: 'Notifications' })
      expect(await within(dialog).findByText('Request submitted')).toBeInTheDocument()
      expect(within(dialog).getByLabelText('Unread')).toBeInTheDocument()
      expect(markRead).not.toHaveBeenCalled()
      expect(markAllRead).not.toHaveBeenCalled()
      expect(listRequests.mock.calls[0][0]).toContain('pageSize=10')
      fireEvent.keyDown(dialog, { key: 'Escape' })
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
      expect(bell).toHaveFocus()
      expect(screen.getByTestId('location')).toHaveTextContent(
        `/${role}?tab=my-requests&page=3&departmentId=department-1`
      )
    })

    it('marks one item once, updates its unread state and refreshes the badge', async () => {
      mount(role)
      await screen.findByText('2')
      fireEvent.click(screen.getByRole('button', { name: 'Notifications' }))
      const action = await screen.findByRole('button', { name: 'Mark as read' })
      fireEvent.click(action)
      fireEvent.click(action)
      await waitFor(() => expect(markRead).toHaveBeenCalledExactlyOnceWith(requestId))
      expect(action).toBeDisabled()
      await waitFor(() => expect(screen.queryByLabelText('Unread')).not.toBeInTheDocument())
      expect(await screen.findByText('1')).toBeInTheDocument()
      expect(screen.getByText('Request submitted')).toBeInTheDocument()
    })

    it('marks all notifications once and removes the unread badge after the server confirms', async () => {
      mount(role)
      await screen.findByText('2')
      fireEvent.click(screen.getByRole('button', { name: 'Notifications' }))
      await screen.findByText('Request submitted')
      const action = screen.getByRole('button', { name: 'Mark all as read' })
      fireEvent.click(action)
      fireEvent.click(action)
      await waitFor(() => expect(markAllRead).toHaveBeenCalledTimes(1))
      expect(action).toBeDisabled()
      await waitFor(() => expect(screen.queryByText('2')).not.toBeInTheDocument())
      expect(screen.getByText('Request submitted')).toBeInTheDocument()
      expect(screen.queryByLabelText('Unread')).not.toBeInTheDocument()
    })

    it('allows marking all read when a new unread item arrives before the badge poll', async () => {
      unread = 0
      mount(role)
      fireEvent.click(screen.getByRole('button', { name: 'Notifications' }))
      await screen.findByText('Request submitted')
      const action = screen.getByRole('button', { name: 'Mark all as read' })
      expect(action).toBeEnabled()
      fireEvent.click(action)
      await waitFor(() => expect(markAllRead).toHaveBeenCalledTimes(1))
      await waitFor(() => expect(screen.queryByLabelText('Unread')).not.toBeInTheDocument())
    })

    it('appends the next page, retains earlier items and hides Load more at the end', async () => {
      const pages = vi.fn()
      server.use(
        http.get('*/api/v1/notifications', async ({ request }) => {
          const current = Number(new URL(request.url).searchParams.get('page'))
          pages(current)
          await delay(30)
          return HttpResponse.json(page([current === 1 ? notice() : notice(secondId, 'REQUEST_GRANTED')], current, 2))
        })
      )
      mount(role)
      fireEvent.click(screen.getByRole('button', { name: 'Notifications' }))
      expect(await screen.findByText('Request submitted')).toBeInTheDocument()
      const load = screen.getByRole('button', { name: 'Load more' })
      fireEvent.click(load)
      fireEvent.click(load)
      expect(await screen.findByText('Access granted')).toBeInTheDocument()
      expect(screen.getByText('Request submitted')).toBeInTheDocument()
      expect(pages.mock.calls.map(([number]) => number)).toEqual([1, 2])
      expect(screen.queryByRole('button', { name: 'Load more' })).not.toBeInTheDocument()
    })

    it('preserves loaded rows when a later page fails and retries that page', async () => {
      let fail = true
      server.use(
        http.get('*/api/v1/notifications', ({ request }) => {
          const current = Number(new URL(request.url).searchParams.get('page'))
          if (current === 2 && fail) return HttpResponse.json({ message: 'private BE detail' }, { status: 503 })
          return HttpResponse.json(page([current === 1 ? notice() : notice(secondId, 'REQUEST_GRANTED')], current, 2))
        })
      )
      mount(role)
      fireEvent.click(screen.getByRole('button', { name: 'Notifications' }))
      await screen.findByText('Request submitted')
      fireEvent.click(screen.getByRole('button', { name: 'Load more' }))
      expect(await screen.findByRole('alert')).not.toHaveTextContent('private BE detail')
      expect(screen.getByText('Request submitted')).toBeInTheDocument()
      fail = false
      fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
      expect(await screen.findByText('Access granted')).toBeInTheDocument()
    })

    it('shows an empty state and closes on an outside pointer', async () => {
      server.use(http.get('*/api/v1/notifications', () => HttpResponse.json(page([]))))
      mount(role)
      fireEvent.click(screen.getByRole('button', { name: 'Notifications' }))
      expect(await screen.findByText('No notifications yet')).toBeInTheDocument()
      fireEvent.pointerDown(screen.getByRole('button', { name: 'Outside' }))
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    })

    it('uses a safe translated fallback and opens a related request in the correct workspace', async () => {
      server.use(
        http.get('*/api/v1/notifications', () => HttpResponse.json(page([notice(requestId, 'FUTURE_SECRET_CODE')])))
      )
      mount(role)
      fireEvent.click(screen.getByRole('button', { name: 'Notifications' }))
      expect(await screen.findByText('New work update')).toBeInTheDocument()
      expect(screen.queryByText('FUTURE_SECRET_CODE')).not.toBeInTheDocument()
      fireEvent.click(screen.getByRole('button', { name: 'View request' }))
      await waitFor(() =>
        expect(screen.getByTestId('location')).toHaveTextContent(
          `tab=${role === 'employee' ? 'request-detail' : 'request-approval'}&id=${requestId}`
        )
      )
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('keeps an unread item when a write fails and does not retry automatically', async () => {
      server.use(
        http.post('*/api/v1/notifications/:id/read', () => {
          markRead()
          return HttpResponse.json({ message: 'private BE detail' }, { status: 503 })
        })
      )
      mount(role)
      fireEvent.click(screen.getByRole('button', { name: 'Notifications' }))
      fireEvent.click(await screen.findByRole('button', { name: 'Mark as read' }))
      await waitFor(() => expect(toast.error).toHaveBeenCalledTimes(1))
      expect(markRead).toHaveBeenCalledTimes(1)
      expect(screen.getByLabelText('Unread')).toBeInTheDocument()
      expect(toast.error).toHaveBeenCalledWith(expect.not.stringContaining('private BE detail'), {
        id: 'notification-read'
      })
    })
  })
}
