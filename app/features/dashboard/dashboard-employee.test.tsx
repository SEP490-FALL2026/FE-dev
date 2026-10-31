import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { toast } from 'sonner'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { employeeProfile, pageResponse } from '../../../test/fixtures/employee-api'
import { DashboardPage } from './dashboard-page'
import { ThemeProvider } from '~/shared/theme/theme-provider'

vi.mock('sonner', () => ({ toast: { loading: vi.fn(), info: vi.fn(), error: vi.fn(), dismiss: vi.fn() } }))

const server = setupServer(
  http.get('*/api/v1/me', () => HttpResponse.json({ success: true, data: employeeProfile })),
  http.get('*/api/v1/notifications/unread-count', () => HttpResponse.json({ success: true, data: { unread: 0 } })),
  http.get('*/api/v1/notifications', () => HttpResponse.json(pageResponse())),
  http.get('*/api/v1/access-requests/drafts', () => HttpResponse.json(pageResponse())),
  http.get('*/api/v1/handover-duties', () => HttpResponse.json(pageResponse())),
  http.get('*/api/v1/assignment-expiry-reminders', () => HttpResponse.json(pageResponse())),
  http.get('*/api/v1/return-requests', () => HttpResponse.json(pageResponse()))
)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
beforeEach(async () => {
  vi.clearAllMocks()
  await setAppLanguage('en', false)
})
function mount(url = '/') {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <ThemeProvider>
        <MemoryRouter initialEntries={[url]}>
          <DashboardPage role='employee' />
        </MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
describe('Employee dashboard shell', () => {
  it('renders the employee returned by /me without sample usage or fake counts', async () => {
    mount()
    expect(await screen.findByRole('heading', { name: 'Test Employee' })).toBeInTheDocument()
    expect(screen.queryByText('74%')).not.toBeInTheDocument()
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument()
    const nav = screen.getByRole('navigation', { name: 'Dashboard navigation' })
    fireEvent.click(within(nav).getByRole('button', { name: 'My requests' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'My requests' })).toBeInTheDocument()
    expect(screen.getByText(/complete request history is not available/)).toBeInTheDocument()
    fireEvent.click(within(nav).getByRole('button', { name: 'Access rights' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Access rights' })).toBeInTheDocument()
  })
  it('shows a notification toast from the header without leaving the current page', async () => {
    mount()
    await screen.findByRole('heading', { name: 'Test Employee' })
    fireEvent.click(screen.getByRole('button', { name: 'Open my profile' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Profile' })).toBeInTheDocument()
    expect(screen.getByText('EMP-TEST')).toBeInTheDocument()
    expect(screen.queryByLabelText('Choose profile photo')).not.toBeInTheDocument()
    const nav = screen.getByRole('navigation', { name: 'Dashboard navigation' })
    expect(within(nav).queryByRole('button', { name: 'Notifications' })).not.toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Notifications' })).toHaveLength(1)
    fireEvent.click(screen.getByRole('button', { name: 'Notifications' }))
    await waitFor(() =>
      expect(toast.info).toHaveBeenCalledWith('No new notifications', { id: 'employee-notification' })
    )
    expect(screen.getByRole('heading', { level: 1, name: 'Profile' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 1, name: 'Notifications' })).not.toBeInTheDocument()
  })
  it('falls back to overview for the removed notification page URL', async () => {
    mount('/?tab=notifications')
    expect(await screen.findByRole('heading', { name: 'Test Employee' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 1, name: 'Notifications' })).not.toBeInTheDocument()
  })
  it('keeps mobile navigation keyboard operable', () => {
    mount()
    const toggle = screen.getByRole('button', { name: 'Open menu' })
    fireEvent.click(toggle)
    expect(screen.getByRole('button', { name: 'Close menu', expanded: true })).toHaveAttribute('aria-expanded', 'true')
  })
})
