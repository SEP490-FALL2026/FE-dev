import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router'
import { beforeAll, afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

import type { UserRole } from '~/entities/user-role/user-role'
import { AppProviders } from '~/providers/app-providers'
import { setAppLanguage } from '~/shared/i18n/i18n'

import { DashboardPage } from './dashboard-page'
// Pre-transform lazy code outside assertion timeouts; production network tests cover deferred downloads.
import './manager/manager-screen'
import './it-admin/it-admin-screen'
import './finance/finance-screen'
import { managerProfile, managerRequest, queueItem } from '../../../test/fixtures/manager-api'
import { requestId, employeeId, pageResponse } from '../../../test/fixtures/employee-api'

const server = setupServer(
  ...[
    'provisioning-tasks',
    'saas-issues',
    'offboarding-cases',
    'budget-proposals',
    'budget-versions',
    'finance-reviews',
    'budget-information-requests'
  ].map((route) => http.get('*/api/v1/' + route, () => HttpResponse.json(pageResponse([])))),
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

async function renderDashboard(role: UserRole, initialEntry = '/') {
  const view = render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <AppProviders>
        <DashboardPage role={role} />
        <RouteProbe />
      </AppProviders>
    </MemoryRouter>
  )
  await act(() => vi.dynamicImportSettled())
  return view
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
    await renderDashboard('manager', '/?tab=my-requests')
    expect(await screen.findByText('A complete request history is not yet available.')).toBeInTheDocument()
    expect(screen.queryByLabelText('Request ID')).not.toBeInTheDocument()
    expect(screen.queryByText('No previews yet')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Save preview' })).not.toBeInTheDocument()
  })
  it('opens the live spending queue and retains the department context when changing tabs', async () => {
    await setAppLanguage('en', true)
    await renderDashboard('manager', '/?departmentId=' + employeeId)
    expect(await screen.findByText('Engineering', { selector: 'h2' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Submit spending requests' }))
    expect(await screen.findByRole('checkbox', { name: 'Test Software' })).toBeInTheDocument()
    expect(screen.queryByText('REQ-M01')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Department personnel' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Department personnel' })).toBeInTheDocument()
    expect(screen.queryByLabelText('Department ID')).not.toBeInTheDocument()
  })
  it('removes unsupported usage and periodic-review controls from the live navigation', async () => {
    await setAppLanguage('en', true)
    await renderDashboard('manager', '/?tab=access-review')
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
    await renderDashboard('manager')
    fireEvent.click(screen.getByRole('button', { name: 'Notifications' }))
    const dialog = screen.getByRole('dialog', { name: 'Notifications' })
    expect(await screen.findByRole('heading', { level: 1, name: 'Overview' })).toBeInTheDocument()
    fireEvent.click(await within(dialog).findByRole('button', { name: 'View request' }))
    expect(await screen.findByLabelText('Approve need')).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(write).not.toHaveBeenCalled()
  })

  it('moves legacy personnel notices into the personnel workspace and keeps the reporting flow', async () => {
    await setAppLanguage('en', true)
    await renderDashboard('manager', '/dashboard/manager?tab=personnel-notices&departmentId=' + employeeId)
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
    expect(screen.getByLabelText('Employee')).toBeInTheDocument()
    expect(screen.queryByLabelText('Employee ID')).not.toBeInTheDocument()
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Close' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('appends notification pages inside the bell without changing the workspace page', async () => {
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
                id: page === 1 ? employeeId : requestId,
                code: page === 1 ? 'STEP_ASSIGNED' : 'REQUEST_GRANTED',
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
    await renderDashboard('manager', '/dashboard/manager?tab=weekly-batch&page=2')
    expect(await screen.findByRole('heading', { level: 1, name: 'Submit spending requests' })).toBeInTheDocument()
    const bell = screen.getByRole('button', { name: 'Notifications' })
    bell.focus()
    fireEvent.click(bell)
    const dialog = screen.getByRole('dialog', { name: 'Notifications' })
    fireEvent.click(await within(dialog).findByRole('button', { name: 'Load more' }))
    expect(await within(dialog).findByText('Access granted')).toBeInTheDocument()
    expect(within(dialog).getByText('A workflow step needs your attention')).toBeInTheDocument()
    expect(within(dialog).queryByRole('button', { name: 'Load more' })).not.toBeInTheDocument()
    expect(reads.some((query) => query.includes('page=2'))).toBe(true)
    expect(screen.getByTestId('route')).toHaveTextContent('tab=weekly-batch&page=2')
    fireEvent.keyDown(dialog, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(bell).toHaveFocus()
    expect(screen.getByTestId('route')).not.toHaveTextContent('notifications=')
  })

  it('keeps theme, language, and logout controls available without a header search', async () => {
    await renderDashboard('finance')

    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Ngôn ngữ' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Chuyển sang giao diện tối' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Đăng xuất' })).toHaveAttribute('href', '/logout')
  })

  it('keeps current IT API navigation while Manager uses live workflows', async () => {
    server.use(
      http.get('*/api/v1/me', () =>
        HttpResponse.json({
          success: true,
          data: { ...managerProfile, roles: ['IT_ADMIN'] }
        })
      )
    )
    await renderDashboard('it-admin')
    const overview = screen.getByRole('button', { current: 'page', name: /Tổng quan/i })
    expect(screen.getByRole('heading', { name: 'Trung tâm điều hành IT' })).toBeInTheDocument()
    const provisioning = screen.getByRole('button', { name: 'Tác vụ cấp phát / thu hồi' })
    fireEvent.click(provisioning)
    expect(provisioning).toHaveAttribute('aria-current', 'page')
    expect(await screen.findByRole('heading', { level: 1, name: 'Thực thi cấp quyền' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Tối ưu bản quyền' }))
    expect(screen.getByText('Phân tích sử dụng và đề xuất tối ưu bản quyền chưa có API.')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Đối chiếu chi phí' }))
    expect(
      screen.getByText('Đối chiếu chứng từ và chi phí chưa có API. Không thể xác nhận số lượng mua, thiếu hoặc dư.')
    ).toBeInTheDocument()
    fireEvent.click(overview)
    expect(overview).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('heading', { name: 'Trung tâm điều hành IT' })).toBeInTheDocument()
  })
})
