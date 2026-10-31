import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router'
import { beforeAll, afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

import type { UserRole } from '~/entities/user-role/user-role'
import { AppProviders } from '~/providers/app-providers'
import { setAppLanguage } from '~/shared/i18n/i18n'

import { DashboardPage } from './dashboard-page'
import { managerProfile, managerRequest, queueItem } from '../../../test/fixtures/manager-api'
import { requestId, employeeId, pageResponse } from '../../../test/fixtures/employee-api'

const server = setupServer(
  http.get('*/api/v1/me', () => HttpResponse.json({ success: true, data: managerProfile })),
  http.get('*/api/v1/spend-queue', () => HttpResponse.json(pageResponse([queueItem]))),
  http.get('*/api/v1/transfer-reviews', () => HttpResponse.json(pageResponse([]))),
  http.get('*/api/v1/personnel-notices', () => HttpResponse.json(pageResponse([]))),
  http.get('*/api/v1/departments/:id', () =>
    HttpResponse.json({
      success: true,
      data: { id: employeeId, code: 'ENG', name: 'Engineering', status: 'ACTIVE', memberCount: 1, costCenter: null }
    })
  ),
  http.get('*/api/v1/departments/:id/employees', () => HttpResponse.json(pageResponse([]))),
  http.get('*/api/v1/notifications/unread-count', () => HttpResponse.json({ success: true, data: { unread: 0 } })),
  http.get('*/api/v1/handover-duties', () =>
    HttpResponse.json({
      success: true,
      data: { items: [], pagination: { page: 1, pageSize: 20, totalItems: 0, totalPages: 0 } }
    })
  ),
  http.get('*/api/v1/access-requests/drafts', () =>
    HttpResponse.json({
      success: true,
      data: { items: [], pagination: { page: 1, pageSize: 20, totalItems: 0, totalPages: 0 } }
    })
  ),
  http.get('*/api/v1/onboarding-checklist', () => HttpResponse.json({ success: true, data: { steps: [] } })),
  http.get('*/api/v1/super-admin-watch', () =>
    HttpResponse.json({ success: true, data: { status: 'HEALTHY', reasons: {}, warnings: {}, holder: null } })
  ),
  http.get('*/api/v1/app-users', () =>
    HttpResponse.json({
      success: true,
      data: { items: [], pagination: { page: 1, pageSize: 20, totalItems: 0, totalPages: 0 } }
    })
  )
)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

function renderDashboard(role: UserRole, initialEntry = '/') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <AppProviders>
        <DashboardPage role={role} />
        <RouteProbe />
      </AppProviders>
    </MemoryRouter>
  )
}
function RouteProbe() {
  const location = useLocation()
  return (
    <output data-testid='route'>
      {location.pathname}
      {location.search}
    </output>
  )
}

describe('DashboardPage Manager workflows', () => {
  beforeEach(async () => {
    localStorage.clear()
    localStorage.setItem('saas-sentry.language', 'vi')
    await setAppLanguage('vi', false)
  })

  it('replaces the preview request history with an API request lookup', async () => {
    await setAppLanguage('en', true)
    renderDashboard('manager', '/?tab=my-requests')
    expect(
      await screen.findByText('A complete request history is not yet available. Open a request by its ID.')
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Request ID')).toBeInTheDocument()
    expect(screen.queryByText('No previews yet')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Save preview' })).not.toBeInTheDocument()
  })
  it('opens the live spending queue and retains the department context when changing tabs', async () => {
    await setAppLanguage('en', true)
    renderDashboard('manager', '/?departmentId=' + employeeId)
    expect(await screen.findByText('Engineering', { selector: 'h2' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Submit spending requests' }))
    expect(await screen.findByRole('checkbox', { name: 'Test Software' })).toBeInTheDocument()
    expect(screen.queryByText('REQ-M01')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Department personnel' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Department personnel' })).toBeInTheDocument()
    expect(
      screen.queryByText('Enter the official department ID provided by your administrator.', { exact: false })
    ).not.toBeVisible()
  })
  it('removes unsupported usage and periodic-review controls from the live navigation', async () => {
    await setAppLanguage('en', true)
    renderDashboard('manager', '/?tab=access-review')
    expect(await screen.findByRole('heading', { name: 'This feature is not available yet' })).toBeInTheDocument()
    const nav = screen.getByRole('navigation', { name: 'Dashboard navigation' })
    expect(within(nav).queryByRole('button', { name: /Ghost|Access Review/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Export|Reclaim/ })).not.toBeInTheDocument()
  })
  it('opens the request referenced by a notification without approving it', async () => {
    await setAppLanguage('en', true)
    const write = vi.fn()
    server.use(
      http.get('*/api/v1/notifications', () =>
        HttpResponse.json(
          pageResponse([
            {
              id: employeeId,
              code: 'STEP_ASSIGNED',
              params: { requestId, stepKind: 'NEED' },
              createdAt: '2026-10-31T03:00:00Z',
              readAt: '2026-10-31T03:00:00Z',
              subject: null
            }
          ])
        )
      ),
      http.get('*/api/v1/access-requests/:id', () =>
        HttpResponse.json({ success: true, data: { request: managerRequest } })
      ),
      http.get('*/api/v1/access-requests/:id/similar-seats', () => HttpResponse.json(pageResponse([]))),
      http.post('*/api/v1/access-requests/:id/need-decision', () => {
        write()
        return HttpResponse.json({ success: true })
      })
    )
    renderDashboard('manager')
    fireEvent.click(screen.getByRole('button', { name: 'Notifications' }))
    const dialog = screen.getByRole('dialog', { name: 'Notifications' })
    expect(await screen.findByRole('heading', { level: 1, name: 'Overview' })).toBeInTheDocument()
    fireEvent.click(await within(dialog).findByRole('button', { name: 'Open' }))
    expect(await screen.findByLabelText('Approve need')).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(write).not.toHaveBeenCalled()
  })

  it('moves legacy personnel notices into the personnel workspace and keeps the reporting flow', async () => {
    await setAppLanguage('en', true)
    renderDashboard('manager', '/dashboard/manager?tab=personnel-notices&departmentId=' + employeeId)
    expect(await screen.findByRole('heading', { level: 1, name: 'Department personnel' })).toBeInTheDocument()
    expect(await screen.findByText('No personnel changes reported')).toBeInTheDocument()
    const navigation = screen.getByRole('navigation', { name: 'Dashboard navigation' })
    expect(
      within(navigation).queryByRole('button', { name: /Personnel notices|Personnel changes|Notifications/ })
    ).not.toBeInTheDocument()
    expect(within(navigation).getByRole('button', { name: 'Department personnel' })).toHaveAttribute(
      'aria-current',
      'page'
    )
    expect(screen.getByTestId('route')).toHaveTextContent('tab=my-team')
    expect(screen.getByTestId('route')).toHaveTextContent('section=changes')
    expect(screen.getByTestId('route')).toHaveTextContent('departmentId=' + employeeId)
    fireEvent.click(screen.getByRole('button', { name: 'Report personnel change' }))
    expect(screen.getByRole('dialog', { name: 'Personnel notice' })).toBeInTheDocument()
    expect(screen.getByLabelText('Employee ID')).toBeInTheDocument()
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Close' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('paginates and filters notifications inside the bell without changing the workspace page', async () => {
    await setAppLanguage('en', true)
    const reads: string[] = []
    server.use(
      http.get('*/api/v1/notifications', ({ request }) => {
        const query = new URL(request.url).searchParams
        reads.push(query.toString())
        const page = Number(query.get('page'))
        return HttpResponse.json({
          success: true,
          data: {
            items: [
              {
                id: employeeId,
                code: 'STEP_ASSIGNED',
                params: {},
                createdAt: '2026-10-31T03:00:00Z',
                readAt: null,
                subject: null
              }
            ],
            pagination: { page, pageSize: 10, totalItems: 11, totalPages: 2 }
          }
        })
      })
    )
    renderDashboard('manager', '/dashboard/manager?tab=weekly-batch&page=2')
    expect(await screen.findByRole('heading', { level: 1, name: 'Submit spending requests' })).toBeInTheDocument()
    const bell = screen.getByRole('button', { name: 'Notifications' })
    bell.focus()
    fireEvent.click(bell)
    const dialog = screen.getByRole('dialog', { name: 'Notifications' })
    fireEvent.click(await within(dialog).findByRole('button', { name: 'Next' }))
    expect(await within(dialog).findByText('Page 2 of 2')).toBeInTheDocument()
    fireEvent.click(within(dialog).getByRole('button', { name: 'Unread' }))
    expect(await within(dialog).findByText('Page 1 of 2')).toBeInTheDocument()
    expect(reads.some((query) => query.includes('page=1') && query.includes('unreadOnly=true'))).toBe(true)
    expect(screen.getByTestId('route')).toHaveTextContent('tab=weekly-batch&page=2')
    fireEvent.keyDown(dialog, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(bell).toHaveFocus()
    expect(screen.getByTestId('route')).not.toHaveTextContent('notifications=')
  })

  it('keeps theme, language, search, and logout controls available', () => {
    renderDashboard('finance')

    expect(screen.getByRole('searchbox', { name: 'Tìm kiếm' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Ngôn ngữ' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Chuyển sang giao diện tối' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Đăng xuất' })).toHaveAttribute('href', '/logout')
  })

  it('navigates through IT admin submenus and activates the corresponding submenu', () => {
    const view = renderDashboard('it-admin')

    // Default entrance is Home screen of dashboard (Tổng quan)
    const overviewBtn = screen.getByRole('button', { current: 'page', name: /Tổng quan/i })
    expect(overviewBtn).toBeInTheDocument()
    expect(overviewBtn).toHaveClass('bg-primary')
    expect(screen.getByText('Bảng điều khiển IT Admin')).toBeInTheDocument()

    // Click sub-menu "Cấp phát & Thu hồi"
    const provisioningBtn = screen.getByRole('button', { name: /Cấp phát & Thu hồi/i })
    expect(provisioningBtn).not.toHaveAttribute('aria-current', 'page')
    expect(provisioningBtn).not.toHaveClass('bg-primary')
    fireEvent.click(provisioningBtn)

    // Sub-menu is now active and the provisioning view is rendered
    expect(provisioningBtn).toHaveAttribute('aria-current', 'page')
    expect(provisioningBtn).toHaveClass('bg-primary')
    expect(overviewBtn).not.toHaveClass('bg-primary')
    expect(screen.getByText('Hàng đợi cấp phát & thu hồi bản quyền')).toBeInTheDocument()

    // Click sub-menu "Tối ưu bản quyền"
    const optimizeBtn = screen.getByRole('button', { name: /Tối ưu bản quyền/i })
    fireEvent.click(optimizeBtn)
    expect(optimizeBtn).toHaveAttribute('aria-current', 'page')
    expect(optimizeBtn).toHaveClass('bg-primary')
    expect(provisioningBtn).not.toHaveAttribute('aria-current', 'page')
    expect(provisioningBtn).not.toHaveClass('bg-primary')
    expect(screen.getByText('Bảng tối ưu bản quyền & Giảm chi phí')).toBeInTheDocument()

    // Click sub-menu "Xử lý sai lệch bản quyền"
    const reconBtn = screen.getByRole('button', { name: /Xử lý sai lệch bản quyền/i })
    fireEvent.click(reconBtn)
    expect(reconBtn).toHaveAttribute('aria-current', 'page')
    expect(screen.getByText('Kiểm tra sai lệch bản quyền')).toBeInTheDocument()

    // Return to default dashboard home
    fireEvent.click(overviewBtn)
    expect(overviewBtn).toHaveAttribute('aria-current', 'page')
    expect(overviewBtn).toHaveClass('bg-primary')
    expect(optimizeBtn).not.toHaveAttribute('aria-current', 'page')
    expect(optimizeBtn).not.toHaveClass('bg-primary')
    expect(screen.getByText('Bảng điều khiển IT Admin')).toBeInTheDocument()

    view.unmount()
  })
})
