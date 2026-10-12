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

  it('renders the finance dashboard and navigates the UF-11/12/19 screens', () => {
    const view = renderDashboard('finance')
    const nav = screen.getByRole('navigation', { name: 'Điều hướng dashboard' })

    expect(screen.getByRole('heading', { level: 1, name: 'Bảng điều khiển Tài chính' })).toBeInTheDocument()
    expect(screen.getByTestId('dashboard-role')).toHaveTextContent('Finance')

    const questionsBtn = within(nav).getByRole('button', { name: /Câu hỏi ngân sách/i })
    expect(questionsBtn).not.toHaveClass('bg-primary')
    fireEvent.click(questionsBtn)
    expect(questionsBtn).toHaveClass('bg-primary')
    expect(screen.getByRole('heading', { level: 1, name: 'Câu hỏi ngân sách từ Người duyệt chi' })).toBeInTheDocument()

    const commitmentsBtn = within(nav).getByRole('button', { name: /Cam kết chờ ghi nhận/i })
    fireEvent.click(commitmentsBtn)
    expect(commitmentsBtn).toHaveClass('bg-primary')
    expect(questionsBtn).not.toHaveClass('bg-primary')
    expect(screen.getByRole('heading', { level: 1, name: 'Khoản cam kết chờ ghi nhận' })).toBeInTheDocument()

    fireEvent.click(within(nav).getByRole('button', { name: /Báo cáo kỳ/i }))
    expect(screen.getByRole('heading', { level: 1, name: 'Báo cáo kỳ Q3-2026' })).toBeInTheDocument()

    view.unmount()
  })

  it('requires an opinion and a note before Finance answers a budget question', () => {
    renderDashboard('finance')
    fireEvent.click(
      within(screen.getByRole('navigation', { name: 'Điều hướng dashboard' })).getByRole('button', {
        name: /Câu hỏi ngân sách/i
      })
    )

    fireEvent.click(screen.getByRole('button', { name: 'Gửi câu trả lời' }))
    expect(screen.getByText('Chọn một ý kiến.')).toBeInTheDocument()
    expect(screen.getByText('Bắt buộc nhập ghi chú.')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('radio', { name: 'Trong hạn mức' }))
    fireEvent.change(screen.getByLabelText('Ghi chú cho Người duyệt chi'), { target: { value: 'Còn đủ ngân sách.' } })
    fireEvent.click(screen.getByRole('button', { name: 'Gửi câu trả lời' }))

    expect(screen.getByText(/Câu trả lời đã hiện trên màn hình quyết định của Người duyệt chi/)).toBeInTheDocument()
  })

  it('shows a negative remaining with the over-committed label when a budget is smaller than back-filled commitments', () => {
    renderDashboard('finance')
    fireEvent.click(
      within(screen.getByRole('navigation', { name: 'Điều hướng dashboard' })).getByRole('button', {
        name: /Cost Center & ngân sách/i
      })
    )

    fireEvent.click(screen.getAllByRole('button', { name: 'Lập ngân sách' })[0])
    fireEvent.change(screen.getByLabelText('Hạn mức ngân sách (chi phí thực chịu, VND)'), {
      target: { value: '20000000' }
    })
    expect(screen.getByText(/Còn lại âm: cam kết tạo trước khi có ngân sách vượt hạn mức vừa lập/)).toBeInTheDocument()

    fireEvent.click(screen.getAllByRole('button', { name: 'Lập ngân sách' }).at(-1)!)
    expect(screen.getByText(/đã gắn ngược 2 khoản cam kết/)).toBeInTheDocument()
  })

  it('renders the spending approver dashboard and navigates the UF-15 screens', () => {
    const view = renderDashboard('spending-approver')
    const nav = screen.getByRole('navigation', { name: 'Điều hướng dashboard' })

    expect(screen.getByRole('heading', { level: 1, name: 'Chào Hoàng Nam' })).toBeInTheDocument()
    expect(screen.getByTestId('dashboard-role')).toHaveTextContent(roleLabels['spending-approver'])

    const queueBtn = within(nav).getByRole('button', { name: /Hàng chờ duyệt/i })
    expect(queueBtn).not.toHaveClass('bg-primary')
    fireEvent.click(queueBtn)
    expect(queueBtn).toHaveClass('bg-primary')
    expect(screen.getByRole('heading', { level: 1, name: 'Hàng chờ phê duyệt' })).toBeInTheDocument()

    const reportsBtn = within(nav).getByRole('button', { name: /Báo cáo/i })
    fireEvent.click(reportsBtn)
    expect(reportsBtn).toHaveClass('bg-primary')
    expect(queueBtn).not.toHaveClass('bg-primary')
    expect(screen.getByRole('heading', { level: 1, name: 'Báo cáo của Người duyệt chi' })).toBeInTheDocument()

    view.unmount()
  })

  it('requires a reason before the spending approver rejects a request', () => {
    renderDashboard('spending-approver')
    fireEvent.click(
      within(screen.getByRole('navigation', { name: 'Điều hướng dashboard' })).getByRole('button', {
        name: /Hàng chờ duyệt/i
      })
    )
    fireEvent.click(screen.getByRole('button', { name: 'Mở REQ-2026-089' }))

    expect(screen.getByRole('heading', { level: 1, name: 'Figma Organization · 15 seat' })).toBeInTheDocument()
    expect(
      within(screen.getByRole('navigation', { name: 'Điều hướng dashboard' })).getByRole('button', {
        name: /Hàng chờ duyệt/i
      })
    ).toHaveClass('bg-primary')

    fireEvent.click(screen.getByRole('button', { name: 'Từ chối' }))
    fireEvent.click(screen.getByRole('button', { name: 'Xác nhận từ chối' }))
    expect(screen.getByText('Bắt buộc nhập lý do.')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Lý do từ chối (bắt buộc)'), { target: { value: 'Chưa cần trong Q4.' } })
    fireEvent.click(screen.getByRole('button', { name: 'Xác nhận từ chối' }))
    expect(screen.getByText(/không tạo khoản cam kết/)).toBeInTheDocument()
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
    expect(screen.getByText('Thành viên trong nhóm')).toBeInTheDocument()

    // Click "Phần mềm của nhóm"
    const teamSoftBtn = within(nav).getByRole('button', { name: /Phần mềm của nhóm/i })
    expect(teamSoftBtn).not.toHaveClass('bg-primary')
    fireEvent.click(teamSoftBtn)
    expect(teamSoftBtn).toHaveClass('bg-primary')
    expect(myTeamBtn).not.toHaveClass('bg-primary')
    expect(screen.getByText('Phần mềm phòng ban sử dụng')).toBeInTheDocument()

    // Click "Yêu cầu phê duyệt"
    const teamRequestsBtn = within(nav).getByRole('button', { name: /Yêu cầu phê duyệt/i })
    fireEvent.click(teamRequestsBtn)
    expect(teamRequestsBtn).toHaveClass('bg-primary')
    expect(teamSoftBtn).not.toHaveClass('bg-primary')
    expect(screen.getByText('Yêu cầu phần mềm của nhóm')).toBeInTheDocument()

    // Click "Rà soát tài khoản lãng phí"
    const ghostSeatBtn = within(nav).getByRole('button', { name: /Rà soát tài khoản lãng phí/i })
    fireEvent.click(ghostSeatBtn)
    expect(ghostSeatBtn).toHaveClass('bg-primary')
    expect(teamRequestsBtn).not.toHaveClass('bg-primary')
    expect(screen.getByText('Rà soát tài khoản lãng phí (Ghost Seats)')).toBeInTheDocument()

    view.unmount()
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
