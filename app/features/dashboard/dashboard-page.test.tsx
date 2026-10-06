import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'

import type { UserRole } from '~/entities/user-role/user-role'
import { AppProviders } from '~/providers/app-providers'
import { setAppLanguage } from '~/shared/i18n/i18n'

import { DashboardPage } from './dashboard-page'

const roleLabels: Record<UserRole, string> = {
  employee: 'Nhân viên',
  finance: 'Finance',
  'it-admin': 'Quản trị viên CNTT',
  manager: 'Quản lý trực tiếp',
  'spending-approver': 'Người duyệt chi',
  'super-admin': 'Quản trị hệ thống'
}

function renderDashboard(role: UserRole) {
  return render(
    <MemoryRouter>
      <AppProviders>
        <DashboardPage role={role} />
      </AppProviders>
    </MemoryRouter>
  )
}

describe('DashboardPage', () => {
  beforeEach(async () => {
    localStorage.clear()
    localStorage.setItem('saas-sentry.language', 'vi')
    await setAppLanguage('vi', false)
  })

  it('renders the shared dashboard shell for super-admin', () => {
    const view = renderDashboard('super-admin')

    expect(screen.getByRole('heading', { level: 1, name: 'Tổng quan' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Điều hướng dashboard' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Chỉ số tổng quan' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Chi phí phần mềm theo tháng' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Chi phí theo danh mục' })).toBeInTheDocument()
    expect(screen.getByTestId('dashboard-role')).toHaveTextContent(roleLabels['super-admin'])

    view.unmount()
  })

  it('renders the finance dashboard shell and navigates tabs', () => {
    const view = renderDashboard('finance')
    const nav = screen.getByRole('navigation', { name: 'Điều hướng dashboard' })

    expect(screen.getByText('Bảng điều khiển Tài chính & SaaS Spend')).toBeInTheDocument()
    expect(screen.getByTestId('dashboard-role')).toHaveTextContent('Finance')

    // Click "Báo cáo ngân sách"
    const budgetBtn = within(nav).getByRole('button', { name: /Báo cáo ngân sách/i })
    expect(budgetBtn).not.toHaveClass('bg-primary')
    fireEvent.click(budgetBtn)
    expect(budgetBtn).toHaveClass('bg-primary')
    expect(screen.getByText('Báo cáo ngân sách & Giải trình chi phí')).toBeInTheDocument()

    // Click "Lịch gia hạn"
    const renewalBtn = within(nav).getByRole('button', { name: /Lịch gia hạn/i })
    expect(renewalBtn).not.toHaveClass('bg-primary')
    fireEvent.click(renewalBtn)
    expect(renewalBtn).toHaveClass('bg-primary')
    expect(budgetBtn).not.toHaveClass('bg-primary')
    expect(screen.getByText('Lịch gia hạn & Hạn chót hợp đồng')).toBeInTheDocument()

    view.unmount()
  })

  it('renders the approvals dashboard shell for spending-approver and navigates tabs', () => {
    const view = renderDashboard('spending-approver')
    const nav = screen.getByRole('navigation', { name: 'Điều hướng dashboard' })

    expect(screen.getByText('Bảng điều khiển Phê duyệt & Ngân sách')).toBeInTheDocument()
    expect(screen.getByTestId('dashboard-role')).toHaveTextContent(roleLabels['spending-approver'])

    // Click "Hàng chờ duyệt"
    const queueBtn = within(nav).getByRole('button', { name: /Hàng chờ duyệt/i })
    expect(queueBtn).not.toHaveClass('bg-primary')
    fireEvent.click(queueBtn)
    expect(queueBtn).toHaveClass('bg-primary')
    expect(screen.getByText('Hàng chờ phê duyệt yêu cầu')).toBeInTheDocument()

    // Click "Báo cáo & Phân tích"
    const reportsBtn = within(nav).getByRole('button', { name: /Báo cáo & Phân tích/i })
    expect(reportsBtn).not.toHaveClass('bg-primary')
    fireEvent.click(reportsBtn)
    expect(reportsBtn).toHaveClass('bg-primary')
    expect(queueBtn).not.toHaveClass('bg-primary')
    expect(screen.getByText('Báo cáo & Phân tích chi tiêu')).toBeInTheDocument()

    view.unmount()
  })

  it('renders the manager dashboard shell and navigates tabs', () => {
    const view = renderDashboard('manager')
    const nav = screen.getByRole('navigation', { name: 'Điều hướng dashboard' })

    expect(screen.getByText('Bảng điều khiển Quản lý')).toBeInTheDocument()
    expect(screen.getByTestId('dashboard-role')).toHaveTextContent(roleLabels.manager)

    // Click "Nhân viên của tôi"
    const myTeamBtn = within(nav).getByRole('button', { name: /Nhân viên của tôi/i })
    expect(myTeamBtn).not.toHaveClass('bg-primary')
    fireEvent.click(myTeamBtn)
    expect(myTeamBtn).toHaveClass('bg-primary')
    expect(screen.getByRole('heading', { level: 1, name: 'Thành viên trong nhóm' })).toBeInTheDocument()

    // Click "Phần mềm của nhóm"
    const teamSoftBtn = within(nav).getByRole('button', { name: /Phần mềm của nhóm/i })
    expect(teamSoftBtn).not.toHaveClass('bg-primary')
    fireEvent.click(teamSoftBtn)
    expect(teamSoftBtn).toHaveClass('bg-primary')
    expect(myTeamBtn).not.toHaveClass('bg-primary')
    expect(screen.getByRole('heading', { level: 1, name: 'Phần mềm phòng ban sử dụng' })).toBeInTheDocument()

    // Click "Yêu cầu phê duyệt"
    const teamRequestsBtn = within(nav).getByRole('button', { name: /Yêu cầu phê duyệt/i })
    fireEvent.click(teamRequestsBtn)
    expect(teamRequestsBtn).toHaveClass('bg-primary')
    expect(teamSoftBtn).not.toHaveClass('bg-primary')
    expect(screen.getByRole('heading', { level: 1, name: 'Yêu cầu phần mềm của nhóm' })).toBeInTheDocument()

    // Click "Rà soát tài khoản lãng phí"
    const ghostSeatBtn = within(nav).getByRole('button', { name: /Rà soát tài khoản lãng phí/i })
    fireEvent.click(ghostSeatBtn)
    expect(ghostSeatBtn).toHaveClass('bg-primary')
    expect(teamRequestsBtn).not.toHaveClass('bg-primary')
    expect(
      screen.getByRole('heading', { level: 1, name: 'Rà soát tài khoản lãng phí (Ghost Seats)' })
    ).toBeInTheDocument()

    view.unmount()
  })

  it('keeps Manager filters and access-review progress available to assistive technology', () => {
    renderDashboard('manager')
    const nav = screen.getByRole('navigation', { name: 'Điều hướng dashboard' })

    fireEvent.click(within(nav).getByRole('button', { name: /Nhân viên của tôi/i }))
    const onLeave = screen.getByRole('button', { name: 'Nghỉ phép' })
    fireEvent.click(onLeave)
    expect(onLeave).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('table', { name: 'Thành viên trong nhóm' })).toBeInTheDocument()

    fireEvent.click(within(nav).getByRole('button', { name: /Đợt tái chứng nhận quyền/i }))
    const progress = screen.getByRole('progressbar', { name: 'Tiến độ hoàn thành chiến dịch' })
    expect(progress).toHaveAttribute('aria-valuenow', '3')
    const pendingRow = screen.getByText('AutoCAD').closest('tr')
    expect(pendingRow).not.toBeNull()
    fireEvent.click(within(pendingRow!).getByRole('button', { name: 'Duy trì' }))
    expect(progress).toHaveAttribute('aria-valuenow', '4')
  })

  it('confirms a Manager bulk ghost-seat decision before changing the preview', () => {
    renderDashboard('manager')
    const nav = screen.getByRole('navigation', { name: 'Điều hướng dashboard' })
    fireEvent.click(within(nav).getByRole('button', { name: /Rà soát tài khoản lãng phí/i }))

    fireEvent.click(screen.getByRole('button', { name: 'Đánh dấu thu hồi G3' }))
    const dialog = screen.getByRole('dialog', { name: 'Xác nhận rà soát hàng loạt' })
    expect(dialog).toHaveTextContent('chưa gửi đến IT Admin')
    fireEvent.click(within(dialog).getByRole('button', { name: 'Hủy' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Đánh dấu thu hồi G3' }))
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Đánh dấu thu hồi G3' }))
    expect(screen.getByRole('status')).toHaveTextContent('trong bản xem trước')
  })

  it('renders the employee dashboard shell', () => {
    const view = renderDashboard('employee')

    expect(screen.getByRole('heading', { level: 1, name: /Xin chào, Đức Anh!/i })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Điều hướng dashboard' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Chỉ số tổng quan' })).toBeInTheDocument()
    expect(screen.getByTestId('dashboard-role')).toHaveTextContent('Nhân viên')

    view.unmount()
  })

  it('exposes a keyboard-operable mobile navigation toggle', () => {
    renderDashboard('employee')

    const toggle = screen.getByRole('button', { name: 'Mở menu' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(toggle)

    expect(screen.getByRole('button', { expanded: true, name: 'Đóng menu' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('keeps theme, language, search, and logout controls available', () => {
    renderDashboard('finance')

    expect(screen.getByRole('searchbox', { name: 'Tìm kiếm' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Ngôn ngữ' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Chuyển sang giao diện tối' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Đăng xuất' })).toHaveAttribute('href', '/login')
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

    // Return to default dashboard home
    fireEvent.click(overviewBtn)
    expect(overviewBtn).toHaveAttribute('aria-current', 'page')
    expect(overviewBtn).toHaveClass('bg-primary')
    expect(optimizeBtn).not.toHaveAttribute('aria-current', 'page')
    expect(optimizeBtn).not.toHaveClass('bg-primary')
    expect(screen.getByText('Bảng điều khiển IT Admin')).toBeInTheDocument()

    view.unmount()
  })

  it('navigates through Employee menus and activates the corresponding view', () => {
    const view = renderDashboard('employee')
    const nav = screen.getByRole('navigation', { name: 'Điều hướng dashboard' })

    // Default entrance is Employee Overview
    const overviewBtn = within(nav).getByRole('button', { current: 'page', name: /Tổng quan/i })
    expect(overviewBtn).toBeInTheDocument()
    expect(overviewBtn).toHaveClass('bg-primary')
    expect(screen.getByText('Bảng điều khiển Nhân viên')).toBeInTheDocument()

    // Click "Phần mềm của tôi"
    const mySoftwareBtn = within(nav).getByRole('button', { name: /Phần mềm của tôi/i })
    expect(mySoftwareBtn).not.toHaveClass('bg-primary')
    fireEvent.click(mySoftwareBtn)
    expect(mySoftwareBtn).toHaveClass('bg-primary')
    expect(overviewBtn).not.toHaveClass('bg-primary')
    expect(screen.getByText('Bản quyền phần mềm của tôi')).toBeInTheDocument()

    // Click "Yêu cầu của tôi"
    const myRequestsBtn = within(nav).getByRole('button', { name: /Yêu cầu của tôi/i })
    expect(myRequestsBtn).not.toHaveClass('bg-primary')
    fireEvent.click(myRequestsBtn)
    expect(myRequestsBtn).toHaveClass('bg-primary')
    expect(mySoftwareBtn).not.toHaveClass('bg-primary')
    expect(screen.getByText('Danh sách yêu cầu của tôi')).toBeInTheDocument()

    // Click "Tạo yêu cầu"
    const createRequestBtn = within(nav).getByRole('button', { name: 'Tạo yêu cầu' })
    expect(createRequestBtn).not.toHaveClass('bg-primary')
    fireEvent.click(createRequestBtn)
    expect(createRequestBtn).toHaveClass('bg-primary')
    expect(myRequestsBtn).not.toHaveClass('bg-primary')
    expect(screen.getByText('Trung tâm tạo yêu cầu phần mềm')).toBeInTheDocument()

    // Click "Hồ sơ & Quyền riêng tư"
    const profileBtn = within(nav).getByRole('button', { name: /Hồ sơ & Quyền riêng tư/i })
    expect(profileBtn).not.toHaveClass('bg-primary')
    fireEvent.click(profileBtn)
    expect(profileBtn).toHaveClass('bg-primary')
    expect(createRequestBtn).not.toHaveClass('bg-primary')
    expect(screen.getByText('Hồ sơ cá nhân & Quyền riêng tư')).toBeInTheDocument()

    // Return to Overview
    fireEvent.click(overviewBtn)
    expect(overviewBtn).toHaveClass('bg-primary')
    expect(profileBtn).not.toHaveClass('bg-primary')
    expect(screen.getByText('Bảng điều khiển Nhân viên')).toBeInTheDocument()

    view.unmount()
  })
})
