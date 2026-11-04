import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeAll, afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

import type { UserRole } from '~/entities/user-role/user-role'
import { AppProviders } from '~/providers/app-providers'
import { setAppLanguage } from '~/shared/i18n/i18n'

import { DashboardPage } from './dashboard-page'
// Pre-transform lazy code outside assertion timeouts; production network tests cover deferred downloads.
import './employee/employee-screen'
import './it-admin/it-admin-screen'
import './finance/finance-screen'
import { employeeProfile, pageResponse } from '../../../test/fixtures/employee-api'
import { employeeCatalogHandlers } from '../../../test/fixtures/employee-catalog'

const server = setupServer(
  ...employeeCatalogHandlers,
  http.get('*/api/v1/dashboards/employee', () => HttpResponse.json({ success: true, data: null })),
  http.get('*/api/v1/notifications/unread-count', () => HttpResponse.json({ success: true, data: { unread: 0 } })),
  ...[
    'access-requests/drafts',
    'me/access-requests',
    'handover-duties',
    'assignment-expiry-reminders',
    'return-requests'
  ].map((route) => http.get('*/api/v1/' + route, () => HttpResponse.json(pageResponse()))),
  http.get('*/api/v1/me/software-rights', () =>
    HttpResponse.json({ ...pageResponse(), data: { ...pageResponse().data, asOf: '2026-11-03', view: 'current' } })
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
  ),
  ...[
    'provisioning-tasks',
    'saas-issues',
    'offboarding-cases',
    'budget-proposals',
    'budget-versions',
    'finance-reviews',
    'budget-information-requests',
    'budgets'
  ].map((path) =>
    http.get(`*/api/v1/${path}`, () =>
      HttpResponse.json({
        success: true,
        data: { items: [], pagination: { page: 1, pageSize: 1, totalItems: 0, totalPages: 0 } }
      })
    )
  ),
  http.get('*/api/v1/me', () => HttpResponse.json({ error: { code: 'AUTHORIZATION.FORBIDDEN' } }, { status: 403 }))
)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())

async function renderDashboard(role: UserRole, initialEntry = '/') {
  if (role === 'employee') {
    server.use(http.get('*/api/v1/me', () => HttpResponse.json({ success: true, data: employeeProfile })))
  }
  const view = render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <AppProviders>
        <DashboardPage role={role} />
      </AppProviders>
    </MemoryRouter>
  )
  await act(() => vi.dynamicImportSettled())
  return view
}

describe('DashboardPage', () => {
  beforeEach(async () => {
    server.resetHandlers()
    localStorage.clear()
    localStorage.setItem('saas-sentry.language', 'vi')
    await setAppLanguage('vi', false)
  })

  it('renders the live employee identity in the current dashboard shell', async () => {
    await renderDashboard('employee')
    expect(await screen.findByRole('heading', { name: 'Test Employee' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Điều hướng dashboard' })).toBeInTheDocument()
    expect(screen.getByTestId('dashboard-role')).toHaveTextContent('Nhân viên')
    expect(screen.queryByText('Đức Anh')).not.toBeInTheDocument()
  })

  it('exposes a keyboard-operable mobile navigation toggle', async () => {
    await renderDashboard('employee')

    const toggle = screen.getByRole('button', { name: 'Mở menu' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(toggle)

    expect(screen.getByRole('button', { expanded: true, name: 'Đóng menu' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('keeps theme, language, search, and logout controls available', async () => {
    await renderDashboard('finance')

    expect(screen.getByRole('searchbox', { name: 'Tìm kiếm' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Ngôn ngữ' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Chuyển sang giao diện tối' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Đăng xuất' })).toHaveAttribute('href', '/logout')
  })

  it('navigates IT API screens and identifies features without backend support', async () => {
    const view = await renderDashboard('it-admin')
    const overviewBtn = screen.getByRole('button', { current: 'page', name: /Tổng quan/i })
    expect(screen.getByRole('heading', { name: 'Trung tâm điều hành IT' })).toBeInTheDocument()
    const provisioningBtn = screen.getByRole('button', { name: 'Tác vụ cấp phát / thu hồi' })
    fireEvent.click(provisioningBtn)
    expect(provisioningBtn).toHaveAttribute('aria-current', 'page')
    expect(await screen.findByText('Bạn không có quyền thực hiện thao tác này.')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Tối ưu bản quyền' }))
    expect(screen.getByText('Phân tích sử dụng và đề xuất tối ưu bản quyền chưa có API.')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Đối chiếu chi phí' }))
    expect(
      screen.getByText('Đối chiếu chứng từ và chi phí chưa có API. Không thể xác nhận số lượng mua, thiếu hoặc dư.')
    ).toBeInTheDocument()
    fireEvent.click(overviewBtn)
    expect(overviewBtn).toHaveAttribute('aria-current', 'page')
    view.unmount()
  })

  it('navigates live employee access, requests, catalog and privacy pages', async () => {
    await renderDashboard('employee')
    await screen.findByRole('heading', { name: 'Test Employee' })
    const nav = screen.getByRole('navigation', { name: 'Điều hướng dashboard' })
    for (const [button, heading] of [
      ['Quyền sử dụng', 'Quyền sử dụng'],
      ['Yêu cầu của tôi', 'Yêu cầu của tôi'],
      ['Tạo yêu cầu', 'Tạo yêu cầu'],
      ['Quyền riêng tư', 'Quyền riêng tư']
    ]) {
      const control = within(nav).getByRole('button', { name: button })
      fireEvent.click(control)
      expect(control).toHaveAttribute('aria-current', 'page')
      expect(await screen.findByRole('heading', { level: 1, name: heading })).toBeInTheDocument()
    }
    const overview = within(nav).getByRole('button', { name: 'Tổng quan' })
    fireEvent.click(overview)
    expect(overview).toHaveAttribute('aria-current', 'page')
    expect(await screen.findByRole('heading', { name: 'Test Employee' })).toBeInTheDocument()
  })

  it('opens the API employee profile from the current header and keeps privacy separate', async () => {
    await renderDashboard('employee')
    await screen.findByRole('heading', { name: 'Test Employee' })
    const avatar = screen.getByRole('button', { name: 'Mở hồ sơ cá nhân' })
    fireEvent.click(avatar)
    expect(avatar).toHaveAttribute('aria-current', 'page')
    expect(await screen.findByRole('heading', { level: 1, name: 'Hồ sơ' })).toBeInTheDocument()
    expect(screen.getByText('EMP-TEST')).toBeInTheDocument()
    const privacy = within(screen.getByRole('navigation', { name: 'Điều hướng dashboard' })).getByRole('button', {
      name: 'Quyền riêng tư'
    })
    expect(privacy).not.toHaveAttribute('aria-current')
    fireEvent.click(privacy)
    expect(await screen.findByRole('heading', { level: 1, name: 'Quyền riêng tư' })).toBeInTheDocument()
    expect(privacy).toHaveAttribute('aria-current', 'page')
  })

  it('keeps employee profile changes unavailable without a supporting API', async () => {
    await renderDashboard('employee', '/?tab=profile')
    expect(await screen.findByText('EMP-TEST')).toBeInTheDocument()
    expect(screen.queryByLabelText('Chọn ảnh đại diện')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Đổi ảnh đại diện' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Đổi mật khẩu' })).toHaveAttribute('href', '/change-password')
  })

  it('opens API software rights without showing fabricated sample usage', async () => {
    await renderDashboard('employee')
    await screen.findByRole('heading', { name: 'Test Employee' })
    for (const percentage of ['74%', '95%', '42%']) expect(screen.queryByText(percentage)).not.toBeInTheDocument()
    fireEvent.click(
      within(screen.getByRole('navigation', { name: 'Điều hướng dashboard' })).getByRole('button', {
        name: 'Quyền sử dụng'
      })
    )
    expect(await screen.findByRole('heading', { level: 1, name: 'Quyền sử dụng' })).toBeInTheDocument()
    expect(await screen.findByText('Chưa được cấp quyền phần mềm')).toBeInTheDocument()
  })
})
