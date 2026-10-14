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
    expect(screen.getByRole('heading', { level: 1, name: 'Báo cáo Quý 3/2026' })).toBeInTheDocument()

    view.unmount()
  })

  it('filters the finance dashboard charts by month, quarter or year', () => {
    renderDashboard('finance')

    const charts = screen.getByRole('region', { name: 'Biểu đồ tài chính' })
    expect(within(charts).getByRole('img', { name: 'Ngân sách Quý 4/2026 đang được dùng thế nào' })).toBeInTheDocument()
    expect(
      within(charts).getByRole('img', { name: 'Cơ cấu thực chi Quý 4/2026 theo trung tâm chi phí' })
    ).toBeInTheDocument()
    expect(within(charts).queryByText('Diễn giải')).not.toBeInTheDocument()

    fireEvent.change(within(charts).getByRole('combobox', { name: 'Chọn kỳ' }), { target: { value: 'Q3-2026' } })
    expect(within(charts).getByRole('img', { name: 'Ngân sách và thực chi Quý 3/2026' })).toBeInTheDocument()
    expect(within(charts).getByText('182.400.000 ₫')).toBeInTheDocument()

    fireEvent.click(within(charts).getByRole('button', { name: 'Năm' }))
    expect(within(charts).getByRole('img', { name: 'Cơ cấu chi phí Năm 2026 theo cách phân bổ' })).toBeInTheDocument()

    fireEvent.click(within(charts).getByRole('button', { name: 'Tháng' }))
    expect(within(charts).getByRole('combobox', { name: 'Chọn kỳ' })).toHaveValue('2026-10')
  })

  it('lists budget questions and lets Finance open one to answer it', () => {
    renderDashboard('finance')
    fireEvent.click(
      within(screen.getByRole('navigation', { name: 'Điều hướng dashboard' })).getByRole('button', {
        name: /Câu hỏi ngân sách/i
      })
    )

    expect(screen.getByRole('button', { name: /REQ-2026-089/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /REQ-2026-078/ })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Đã trả lời/ }))
    fireEvent.click(screen.getByRole('button', { name: /REQ-2026-078/ }))
    expect(screen.getByRole('heading', { name: 'Câu trả lời đã gửi' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Quay lại danh sách câu hỏi' }))

    fireEvent.click(screen.getByRole('button', { name: /Đang mở/ }))
    fireEvent.click(screen.getByRole('button', { name: /REQ-2026-089/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Gửi câu trả lời' }))
    expect(screen.getByText('Chọn một ý kiến.')).toBeInTheDocument()
    expect(screen.getByText('Bắt buộc nhập ghi chú.')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('radio', { name: /Trong hạn mức/ }))
    fireEvent.change(screen.getByLabelText('Ghi chú cho Người duyệt chi'), { target: { value: 'Còn đủ ngân sách.' } })
    fireEvent.click(screen.getByRole('button', { name: 'Gửi câu trả lời' }))

    expect(screen.getByText(/Câu trả lời đã hiện trên màn hình quyết định của Người duyệt chi/)).toBeInTheDocument()
  })

  it('creates a budget in a pop-up and shows a negative remaining after back-fill', () => {
    renderDashboard('finance')
    fireEvent.click(
      within(screen.getByRole('navigation', { name: 'Điều hướng dashboard' })).getByRole('button', {
        name: /Trung tâm chi phí & ngân sách/i
      })
    )

    fireEvent.click(screen.getAllByRole('button', { name: 'Lập ngân sách' })[0])
    const dialog = screen.getByRole('dialog', { name: 'Lập ngân sách CC-MKT · Quý 4/2026' })
    fireEvent.change(within(dialog).getByLabelText('Hạn mức ngân sách (chi phí thực chịu, đồng)'), {
      target: { value: '20000000' }
    })
    expect(
      within(dialog).getByText(/Còn lại âm: các cam kết tạo trước khi có ngân sách vượt hạn mức vừa lập/)
    ).toBeInTheDocument()

    fireEvent.click(within(dialog).getByRole('button', { name: 'Lập ngân sách' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByText(/đã gắn ngược 2 khoản cam kết/)).toBeInTheDocument()
  })

  it('shows past months of the budget screen as view only', () => {
    renderDashboard('finance')
    fireEvent.click(
      within(screen.getByRole('navigation', { name: 'Điều hướng dashboard' })).getByRole('button', {
        name: /Trung tâm chi phí & ngân sách/i
      })
    )

    fireEvent.change(screen.getByLabelText('Xem theo tháng'), { target: { value: '2026-08' } })
    expect(screen.getByText(/Kỳ ngân sách Quý 3\/2026/)).toBeInTheDocument()
    expect(screen.getByText('Kỳ đã qua — chỉ xem')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Sửa giữa kỳ' })).not.toBeInTheDocument()
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

  it('lets the spending approver ask Finance a structured budget question', () => {
    renderDashboard('spending-approver')
    fireEvent.click(
      within(screen.getByRole('navigation', { name: 'Điều hướng dashboard' })).getByRole('button', {
        name: /Hàng chờ duyệt/i
      })
    )
    fireEvent.click(screen.getByRole('button', { name: 'Mở REQ-2026-089' }))

    expect(
      screen.getByText('Phòng Thiết kế còn đủ ngân sách quý 4 để mua thêm 15 giấy phép Figma không?')
    ).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Hỏi thêm bộ phận Tài chính' }))

    fireEvent.click(screen.getByRole('button', { name: 'Gửi câu hỏi' }))
    expect(screen.getByText('Nhập câu hỏi hoặc ý kiến cho bộ phận Tài chính.')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('checkbox', { name: 'Gợi ý số tiền / thời điểm' }))
    fireEvent.change(screen.getByLabelText('Câu hỏi / ý kiến của bạn'), {
      target: { value: 'Có nên dời sang tháng 11?' }
    })
    fireEvent.change(screen.getByLabelText('Cần trả lời'), { target: { value: 'TODAY' } })
    fireEvent.click(screen.getByRole('button', { name: 'Gửi câu hỏi' }))

    expect(screen.getByText('Có nên dời sang tháng 11?')).toBeInTheDocument()
    expect(screen.getAllByText('Trong hôm nay').length).toBeGreaterThan(0)
  })

  it('bounds a renewal reduction by the ranked reclaim list and records the decision', () => {
    renderDashboard('spending-approver')
    fireEvent.click(
      within(screen.getByRole('navigation', { name: 'Điều hướng dashboard' })).getByRole('button', {
        name: /Hàng chờ duyệt/i
      })
    )
    fireEvent.click(screen.getByRole('button', { name: 'Mở SUB-GITHUB-ENT' }))

    fireEvent.click(screen.getByRole('radio', { name: /Giảm số lượng/ }))
    fireEvent.change(screen.getByLabelText(/Số lượng mới/), { target: { value: '30' } })
    fireEvent.click(screen.getByRole('button', { name: 'Ghi quyết định' }))
    expect(screen.getByText('Số lượng mới phải từ 38 đến 49 giấy phép.')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText(/Số lượng mới/), { target: { value: '40' } })
    fireEvent.click(screen.getByRole('button', { name: 'Ghi quyết định' }))
    expect(screen.getByText(/Đã ghi quyết định: Giảm số lượng/)).toBeInTheDocument()
  })

  it('requires a reason before the spending approver rejects a request', () => {
    renderDashboard('spending-approver')
    fireEvent.click(
      within(screen.getByRole('navigation', { name: 'Điều hướng dashboard' })).getByRole('button', {
        name: /Hàng chờ duyệt/i
      })
    )
    fireEvent.click(screen.getByRole('button', { name: 'Mở REQ-2026-089' }))

    expect(screen.getByRole('heading', { level: 1, name: 'Figma Organization · 15 giấy phép' })).toBeInTheDocument()
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
