import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { delay, http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { toast } from 'sonner'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { pageResponse, requestId } from '../../../../../test/fixtures/employee-api'
import { EmployeeNotificationBell } from './components/employee-notification-bell'

vi.mock('sonner', () => ({ toast: { loading: vi.fn(), info: vi.fn(), error: vi.fn(), dismiss: vi.fn() } }))

const markRead = vi.fn()
let unread = 2
const server = setupServer(
  http.get('*/api/v1/notifications/unread-count', () => HttpResponse.json({ success: true, data: { unread } })),
  http.post('*/api/v1/notifications/:id/read', ({ params }) => {
    markRead(params.id)
    unread -= 1
    return HttpResponse.json({ success: true, data: null })
  })
)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
beforeEach(async () => {
  server.resetHandlers()
  vi.clearAllMocks()
  unread = 2
  await setAppLanguage('en', false)
})
function mount() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <EmployeeNotificationBell />
    </QueryClientProvider>
  )
}
function notification(code: string) {
  return { id: requestId, code, subject: null, params: {}, createdAt: '2026-10-31T03:00:00Z', readAt: null }
}

describe('Employee notification bell', () => {
  it('shows one unread notification, blocks repeated clicks and refreshes the badge after marking it read', async () => {
    const requests = vi.fn()
    server.use(
      http.get('*/api/v1/notifications', async ({ request }) => {
        const params = new URL(request.url).searchParams
        requests({ unreadOnly: params.get('unreadOnly'), pageSize: params.get('pageSize') })
        await delay(60)
        return HttpResponse.json(pageResponse([notification('REQUEST_SUBMITTED')]))
      })
    )
    mount()
    expect(await screen.findByText('2')).toBeInTheDocument()
    const bell = screen.getByRole('button', { name: 'Notifications' })
    fireEvent.click(bell)
    fireEvent.click(bell)
    expect(bell).toBeDisabled()
    await waitFor(() =>
      expect(toast.info).toHaveBeenCalledWith('Your request was submitted', { id: 'employee-notification' })
    )
    expect(markRead).toHaveBeenCalledExactlyOnceWith(requestId)
    expect(requests).toHaveBeenCalledExactlyOnceWith({ unreadOnly: 'true', pageSize: '1' })
    expect(toast.info).toHaveBeenCalledTimes(1)
    expect(toast.loading).toHaveBeenCalledWith('Loading data', { id: 'employee-notification' })
    expect(await screen.findByText('1')).toBeInTheDocument()
    expect(toast.error).not.toHaveBeenCalled()
  })

  it('uses the translated fallback for an unknown notification code', async () => {
    server.use(
      http.get('*/api/v1/notifications', () => HttpResponse.json(pageResponse([notification('FUTURE_NOTICE')])))
    )
    mount()
    fireEvent.click(screen.getByRole('button', { name: 'Notifications' }))
    await waitFor(() =>
      expect(toast.info).toHaveBeenCalledWith('There is an update related to your work', {
        id: 'employee-notification'
      })
    )
  })

  it('shows an empty toast without marking anything read', async () => {
    server.use(http.get('*/api/v1/notifications', () => HttpResponse.json(pageResponse())))
    mount()
    fireEvent.click(screen.getByRole('button', { name: 'Notifications' }))
    await waitFor(() =>
      expect(toast.info).toHaveBeenCalledWith('No new notifications', { id: 'employee-notification' })
    )
    expect(markRead).not.toHaveBeenCalled()
  })

  it('replaces the loading toast with a safe error when loading fails', async () => {
    server.use(
      http.get('*/api/v1/notifications', () => HttpResponse.json({ message: 'private BE detail' }, { status: 503 }))
    )
    mount()
    fireEvent.click(screen.getByRole('button', { name: 'Notifications' }))
    await waitFor(() => expect(toast.error).toHaveBeenCalledTimes(1))
    expect(toast.error).toHaveBeenCalledWith(expect.not.stringContaining('private BE detail'), {
      id: 'employee-notification'
    })
    expect(toast.info).not.toHaveBeenCalled()
    expect(markRead).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Notifications' })).toBeEnabled()
  })
})
