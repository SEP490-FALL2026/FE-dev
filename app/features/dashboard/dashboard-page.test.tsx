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
import './super-admin/super-admin-screen'
import './finance/finance-screen'
import './approvals/approval-screen'

const server = setupServer(
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
    'budgets',
    'budget-commitments',
    'cost-centers',
    'spend-approvals',
    'notifications'
  ].map((path) =>
    http.get(`*/api/v1/${path}`, () =>
      HttpResponse.json({
        success: true,
        data: { items: [], pagination: { page: 1, pageSize: 1, totalItems: 0, totalPages: 0 } }
      })
    )
  ),
  http.get('*/api/v1/budgets/summary', () =>
    HttpResponse.json({ success: true, data: { year: 2026, totals: {}, lastInvoiceRecordedAt: null } })
  ),
  http.get('*/api/v1/me', () => HttpResponse.json({ error: { code: 'AUTHORIZATION.FORBIDDEN' } }, { status: 403 }))
)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())

const roleLabels: Record<UserRole, string> = {
  employee: 'Nhân viên',
  finance: 'Tài chính',
  'it-admin': 'Quản trị viên CNTT',
  manager: 'Quản lý trực tiếp',
  'spending-approver': 'Người duyệt chi',
  'super-admin': 'Quản trị hệ thống'
}

async function renderDashboard(role: UserRole, initialEntry = '/') {
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
    localStorage.clear()
    localStorage.setItem('saas-sentry.language', 'vi')
    await setAppLanguage('vi', false)
  })

  it('renders the super-admin dashboard and navigates the UF-13 screens', async () => {
    const view = await renderDashboard('super-admin')

    expect(screen.getByRole('heading', { level: 1, name: 'Thiết lập tổ chức' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Điều hướng dashboard' })).toBeInTheDocument()
    expect(screen.getByTestId('dashboard-role')).toHaveTextContent(roleLabels['super-admin'])

    const nav = screen.getByRole('navigation', { name: 'Điều hướng dashboard' })
    const accountsBtn = within(nav).getByRole('button', { name: /Tài khoản và trách nhiệm/i })
    fireEvent.click(accountsBtn)
    expect(screen.getByRole('heading', { level: 1, name: 'Tài khoản và trách nhiệm' })).toBeInTheDocument()

    view.unmount()
  })

  it('translates the super-admin overview and navigation when English is selected', async () => {
    await setAppLanguage('en')
    await renderDashboard('super-admin')

    expect(screen.getByRole('heading', { level: 1, name: 'Organization setup' })).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: 'Setup checklist' })).toBeInTheDocument()
    const nav = screen.getByRole('navigation', { name: 'Dashboard navigation' })
    expect(within(nav).getByRole('button', { name: 'Departments' })).toBeInTheDocument()
    expect(screen.queryByText('Minh Anh')).not.toBeInTheDocument()
  })

  it('lists one Finance menu entry per screen and opens each by its label', async () => {
    await renderDashboard('finance')
    expect(screen.getByRole('heading', { level: 1, name: 'Tổng quan tài chính' })).toBeInTheDocument()
    const nav = screen.getByRole('navigation', { name: 'Điều hướng dashboard' })
    expect(within(nav).queryByRole('button', { name: 'Trung tâm chi phí & Ngân sách' })).not.toBeInTheDocument()
    expect(within(nav).queryByRole('button', { name: 'Báo cáo kỳ' })).not.toBeInTheDocument()
    for (const [label, heading] of [
      ['Trung tâm chi phí', 'Trung tâm chi phí'],
      ['Đề xuất ngân sách', 'Đề xuất ngân sách'],
      ['Chờ xác nhận lần cuối', 'Chờ xác nhận lần cuối'],
      ['Nhập hóa đơn', 'Nhập hóa đơn']
    ]) {
      fireEvent.click(within(nav).getByRole('button', { name: label }))
      expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument()
      expect(within(nav).getByRole('button', { name: label })).toHaveAttribute('aria-current', 'page')
    }
    expect(screen.queryByRole('button', { name: 'Tạo mới' })).not.toBeInTheDocument()
  })

  it('navigates the Spending Approver API workspaces without demo badges or profile', async () => {
    const view = await renderDashboard('spending-approver')
    const nav = screen.getByRole('navigation', { name: 'Điều hướng dashboard' })

    expect(screen.getByRole('heading', { level: 1, name: 'Tổng quan phê duyệt' })).toBeInTheDocument()
    expect(screen.getByTestId('dashboard-role')).toHaveTextContent(roleLabels['spending-approver'])
    expect(screen.queryByText('Hoàng Nam')).not.toBeInTheDocument()

    const queueBtn = within(nav).getByRole('button', { name: /Hàng chờ duyệt/i })
    expect(queueBtn).not.toHaveClass('bg-primary')
    fireEvent.click(queueBtn)
    expect(queueBtn).toHaveClass('bg-primary')
    expect(screen.getByRole('heading', { level: 1, name: 'Hàng đợi duyệt chi' })).toBeInTheDocument()
    expect(await screen.findByText('Không có bản ghi phù hợp.')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Ví dụ: Figma, Nguyễn Văn A hoặc CC-ENG')).toBeInTheDocument()

    expect(within(nav).queryByRole('button', { name: /Báo cáo/i })).not.toBeInTheDocument()
    fireEvent.click(within(nav).getByRole('button', { name: /Ngân sách năm/i }))
    expect(screen.getByRole('heading', { level: 1, name: 'Phê duyệt ngân sách năm' })).toBeInTheDocument()

    view.unmount()
  })

  it('sends removed demo tabs back to the overview', async () => {
    await renderDashboard('spending-approver', '/?tab=reports')
    expect(screen.getByRole('heading', { level: 1, name: 'Tổng quan phê duyệt' })).toBeInTheDocument()
  })

  it('no longer offers subscription renewal decisions to the Spending Approver', async () => {
    await renderDashboard('spending-approver', '/?tab=renewal&id=renewal-1')
    expect(screen.getByRole('heading', { level: 1, name: 'Tổng quan phê duyệt' })).toBeInTheDocument()
    const nav = screen.getByRole('navigation', { name: 'Điều hướng dashboard' })
    expect(within(nav).queryByRole('button', { name: /Gia hạn thuê bao/i })).not.toBeInTheDocument()
  })

  it('does not restore a demo Request for a legacy fixture ID', async () => {
    await renderDashboard('spending-approver', '/?tab=request&id=req-101')
    expect(screen.getByRole('heading', { level: 1, name: 'Duyệt chi yêu cầu' })).toBeInTheDocument()
    expect(screen.getByText('Không có bản ghi phù hợp.')).toBeInTheDocument()
  })
})
