import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeAll, afterAll, beforeEach, describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

import type { UserRole } from '~/entities/user-role/user-role'
import { AppProviders } from '~/providers/app-providers'
import { setAppLanguage } from '~/shared/i18n/i18n'

import { DashboardPage } from './dashboard-page'

const server = setupServer(
  http.get('*/api/v1/me', () =>
    HttpResponse.json({
      success: true,
      data: {
        appUserId: 'test',
        loginEmail: 'employee@example.test',
        employee: { id: 'test', employeeCode: 'TEST', fullName: 'Test Employee', department: null, jobTitle: null },
        roles: { direct: ['EMPLOYEE'], derived: [], effective: ['EMPLOYEE'] },
        selfServiceOnly: false
      }
    })
  ),
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

const roleLabels: Record<UserRole, string> = {
  employee: 'Nhân viên',
  finance: 'Tài chính',
  'it-admin': 'Quản trị viên CNTT',
  manager: 'Quản lý trực tiếp',
  'spending-approver': 'Người duyệt chi',
  'super-admin': 'Quản trị hệ thống'
}

function renderDashboard(role: UserRole, initialEntry = '/') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
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

  it('renders the super-admin dashboard and navigates the UF-13 screens', () => {
    const view = renderDashboard('super-admin')

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
    renderDashboard('super-admin')

    expect(screen.getByRole('heading', { level: 1, name: 'Organization setup' })).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: 'Setup checklist' })).toBeInTheDocument()
    const nav = screen.getByRole('navigation', { name: 'Dashboard navigation' })
    expect(within(nav).getByRole('button', { name: 'Departments and projects' })).toBeInTheDocument()
    expect(screen.queryByText('Minh Anh')).not.toBeInTheDocument()
  })

  it('renders the finance dashboard and navigates the UF-11/12/19 screens', () => {
    const view = renderDashboard('finance')
    const nav = screen.getByRole('navigation', { name: 'Điều hướng dashboard' })

    expect(screen.getByRole('heading', { level: 1, name: 'Bảng điều khiển Tài chính' })).toBeInTheDocument()
    expect(screen.getByTestId('dashboard-role')).toHaveTextContent('Tài chính')

    // Five areas like the IT Admin menu: the overview is a direct link, the others expand in place.
    const areaButtons = within(nav).getAllByRole('button', { expanded: false })
    expect(areaButtons.map((button) => button.textContent?.replace(/\d+$/, ''))).toEqual([
      'Trung tâm chi phí & Ngân sách',
      'Lập kế hoạch & Dự trù',
      'Chi phí & Đối soát',
      'Đóng kỳ & Báo cáo'
    ])
    expect(within(nav).getByRole('button', { current: 'page' })).toHaveTextContent('Tổng quan')

    const budgetArea = within(nav).getByRole('button', { name: /Trung tâm chi phí & Ngân sách/ })
    expect(within(nav).queryByRole('button', { name: /Theo phòng ban/ })).not.toBeInTheDocument()
    fireEvent.click(budgetArea)
    expect(budgetArea).toHaveAttribute('aria-expanded', 'true')

    const questionsBtn = within(nav).getByRole('button', { name: /Yêu cầu ngân sách/ })
    fireEvent.click(questionsBtn)
    expect(questionsBtn).toHaveClass('bg-primary')
    expect(
      screen.getByRole('heading', { level: 1, name: 'Yêu cầu thông tin ngân sách từ Người duyệt chi' })
    ).toBeInTheDocument()

    const commitmentsBtn = within(nav).getByRole('button', { name: /Cam kết chi/ })
    fireEvent.click(commitmentsBtn)
    expect(commitmentsBtn).toHaveClass('bg-primary')
    expect(questionsBtn).not.toHaveClass('bg-primary')
    expect(screen.getByRole('heading', { level: 1, name: 'Khoản cam kết chờ ghi nhận' })).toBeInTheDocument()

    fireEvent.click(within(nav).getByRole('button', { name: /Đóng kỳ & Báo cáo/ }))
    fireEvent.click(within(nav).getByRole('button', { name: 'Báo cáo kỳ' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Báo cáo kỳ Quý 3/2026' })).toBeInTheDocument()

    view.unmount()
  })

  it('lists budget info requests first, filters them in order, and opens a separate detail screen', () => {
    renderDashboard('finance', '/?tab=budget-questions')

    const filter = screen.getByRole('combobox', { name: 'Trạng thái' })
    expect(
      within(filter)
        .getAllByRole('option')
        .map((option) => option.textContent)
    ).toEqual(['Tất cả', 'Đang mở', 'Đã trả lời', 'Đóng — yêu cầu bị hủy'])
    expect(filter).toHaveValue('all')
    expect(screen.getAllByRole('button', { name: /^Xem chi tiết REQ-/ })).toHaveLength(5)

    fireEvent.change(filter, { target: { value: 'ANSWERED' } })
    fireEvent.click(screen.getByRole('button', { name: 'Áp dụng bộ lọc' }))
    expect(screen.getAllByRole('button', { name: /^Xem chi tiết REQ-/ })).toHaveLength(1)

    fireEvent.click(screen.getByRole('button', { name: 'Xem chi tiết REQ-2026-078' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Cursor Pro · 10 suất' })).toBeInTheDocument()
    expect(screen.queryByRole('combobox', { name: 'Trạng thái' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Quay lại danh sách' }))
    expect(screen.getByRole('combobox', { name: 'Trạng thái' })).toHaveValue('ANSWERED')
    expect(screen.getAllByRole('button', { name: /^Xem chi tiết REQ-/ })).toHaveLength(1)
  })

  it('requires an opinion and a note before Finance answers a budget question', () => {
    renderDashboard('finance', '/?tab=budget-questions')
    fireEvent.click(screen.getByRole('button', { name: 'Xem chi tiết REQ-2026-089' }))

    fireEvent.click(screen.getByRole('button', { name: 'Gửi câu trả lời' }))
    expect(screen.getByText('Chọn một ý kiến.')).toBeInTheDocument()
    expect(screen.getByText('Bắt buộc nhập ghi chú.')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('radio', { name: 'Trong hạn mức' }))
    fireEvent.change(screen.getByLabelText('Ghi chú cho Người duyệt chi'), { target: { value: 'Còn đủ ngân sách.' } })
    fireEvent.click(screen.getByRole('button', { name: 'Gửi câu trả lời' }))

    expect(screen.getByText(/Câu trả lời đã hiện trên màn hình quyết định của Người duyệt chi/)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Quay lại danh sách' }))
    fireEvent.change(screen.getByRole('combobox', { name: 'Trạng thái' }), { target: { value: 'ANSWERED' } })
    fireEvent.click(screen.getByRole('button', { name: 'Áp dụng bộ lọc' }))
    expect(screen.getAllByRole('button', { name: /^Xem chi tiết REQ-/ })).toHaveLength(2)
    expect(screen.getByRole('button', { name: 'Xem chi tiết REQ-2026-089' })).toBeInTheDocument()
  })

  it('shows a negative remaining with the over-committed label when a budget is smaller than back-filled commitments', () => {
    renderDashboard('finance', '/?tab=budgets')

    fireEvent.click(screen.getAllByRole('button', { name: 'Lập ngân sách' })[0])
    fireEvent.change(screen.getByLabelText('Hạn mức ngân sách (chi phí thực chịu, VND)'), {
      target: { value: '20000000' }
    })
    expect(screen.getByText(/Còn lại âm: cam kết tạo trước khi có ngân sách vượt hạn mức vừa lập/)).toBeInTheDocument()

    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Lập ngân sách' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByText(/đã gắn ngược 2 khoản cam kết/)).toBeInTheDocument()
  })

  it('switches the budget view between month, quarter and year and adds a Cost Center in a pop-up', () => {
    renderDashboard('finance', '/?tab=budgets')

    expect(screen.getByRole('heading', { name: 'Ngân sách theo trung tâm chi phí — Quý 4/2026' })).toBeInTheDocument()
    const granularity = screen.getByRole('group', { name: 'Xem theo' })

    fireEvent.click(within(granularity).getByRole('button', { name: 'Tháng' }))
    expect(screen.getByLabelText('Kỳ')).toHaveValue('2026-10')
    fireEvent.change(screen.getByLabelText('Kỳ'), { target: { value: '2026-07' } })
    expect(screen.getByRole('heading', { name: 'Ngân sách theo trung tâm chi phí — Tháng 7/2026' })).toBeInTheDocument()
    expect(screen.getByText('Kỳ đã qua')).toBeInTheDocument()

    fireEvent.click(within(granularity).getByRole('button', { name: 'Năm' }))
    expect(screen.getByRole('heading', { name: 'Ngân sách theo trung tâm chi phí — Năm 2026' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Thêm trung tâm chi phí' }))
    const dialog = screen.getByRole('dialog', { name: 'Thêm trung tâm chi phí' })
    fireEvent.click(within(dialog).getByRole('button', { name: 'Lưu' }))
    expect(within(dialog).getByRole('alert')).toHaveTextContent('Nhập mã và tên trung tâm chi phí.')

    fireEvent.change(within(dialog).getByLabelText('Mã trung tâm chi phí'), { target: { value: 'cc-legal' } })
    fireEvent.change(within(dialog).getByLabelText('Tên'), { target: { value: 'Pháp chế' } })
    fireEvent.click(within(dialog).getByRole('button', { name: 'Lưu' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getAllByText('CC-LEGAL')).toHaveLength(2)
  })

  it('renders the spending approver dashboard and navigates the UF-15 screens', () => {
    const view = renderDashboard('spending-approver')
    const nav = screen.getByRole('navigation', { name: 'Điều hướng dashboard' })

    expect(screen.getByRole('heading', { level: 1, name: 'Chào Hoàng Nam' })).toBeInTheDocument()
    expect(screen.getByTestId('dashboard-role')).toHaveTextContent(roleLabels['spending-approver'])
    expect(screen.queryByText(/Mở hàng chờ/)).not.toBeInTheDocument()

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
    const savings = screen.getByRole('region', { name: 'Tiết kiệm' })
    const periodFilter = screen.getByRole('group', { name: 'Xem theo' })
    const spendChart = screen.getByRole('img', {
      name: 'Biểu đồ cột ngân sách và chi phí theo trung tâm chi phí — Quý 3/2026'
    })
    expect(savings.compareDocumentPosition(periodFilter) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(periodFilter.compareDocumentPosition(spendChart) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(screen.getByText('Chưa phân bổ trung tâm chi phí')).toBeInTheDocument()

    fireEvent.click(within(periodFilter).getByRole('button', { name: 'Năm' }))
    expect(
      screen.getByRole('img', { name: 'Biểu đồ cột ngân sách và chi phí theo trung tâm chi phí — Năm 2026' })
    ).toBeInTheDocument()
    expect(screen.queryByText('Chưa phân bổ trung tâm chi phí')).not.toBeInTheDocument()

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

    expect(screen.getByRole('heading', { level: 1, name: 'Figma Organization · 15 suất' })).toBeInTheDocument()
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

  it('shows the Finance budget opinion thread on the request detail', () => {
    renderDashboard('spending-approver', '/?tab=request&id=req-101')
    expect(
      screen.getByText('Marketing chưa có ngân sách quý 4 — Tài chính có dự kiến lập trong tuần này không?')
    ).toBeInTheDocument()
    expect(screen.getByText(/Ngọc Lan \(Tài chính\) trả lời/)).toBeInTheDocument()

    renderDashboard('spending-approver', '/?tab=request&id=req-089')
    expect(screen.getByText(/Đang chờ Tài chính trả lời/)).toBeInTheDocument()
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
      screen.getByRole('heading', { level: 1, name: 'Rà soát mức sử dụng phần mềm của nhân viên' })
    ).toBeInTheDocument()

    view.unmount()
  })

  it('opens the annual budget proposal only from Manager navigation', async () => {
    localStorage.setItem('saas-sentry.language', 'en')
    await setAppLanguage('en', false)
    const manager = renderDashboard('manager')
    fireEvent.click(screen.getByRole('button', { name: 'Annual budget proposal' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Next year budget proposal' })).toBeInTheDocument()
    manager.unmount()

    renderDashboard('employee')
    expect(screen.queryByRole('button', { name: 'Annual budget proposal' })).not.toBeInTheDocument()
  })

  it('opens team and individual request forms from the Manager sidebar', async () => {
    localStorage.setItem('saas-sentry.language', 'en')
    await setAppLanguage('en', false)
    renderDashboard('manager')
    const nav = screen.getByRole('navigation', { name: 'Dashboard navigation' })
    const createButton = within(nav).getByRole('button', { name: 'Create Request' })

    expect(createButton).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(createButton)
    expect(createButton).toHaveAttribute('aria-expanded', 'true')

    fireEvent.click(within(nav).getByRole('button', { name: 'Request for team' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Create License Request for Team' })).toBeInTheDocument()
    expect(screen.queryByRole('combobox', { name: 'Select Employee' })).not.toBeInTheDocument()
    const members = screen.getByRole('group', { name: 'Select team members to receive access' })
    const previewButton = screen.getByRole('button', { name: 'Preview Request' })
    expect(previewButton).toBeDisabled()
    fireEvent.click(within(members).getAllByRole('checkbox')[0])
    expect(previewButton).toBeDisabled()
    fireEvent.change(screen.getByRole('textbox', { name: 'Desired license plan' }), {
      target: { value: 'Enterprise Custom' }
    })
    fireEvent.change(screen.getByLabelText('From date'), {
      target: { value: '2026-01-01' }
    })
    fireEvent.change(screen.getByLabelText('To date'), { target: { value: '2025-12-31' } })
    expect(screen.getByText('The end date must be on or after the start date.')).toBeInTheDocument()
    expect(previewButton).toBeDisabled()
    fireEvent.change(screen.getByLabelText('To date'), { target: { value: '2026-06-30' } })
    expect(previewButton).toBeEnabled()
    fireEvent.change(screen.getByRole('textbox', { name: 'Business Justification' }), {
      target: { value: 'Shared access for the design project' }
    })
    fireEvent.click(previewButton)
    expect(screen.getByText('Enterprise Custom')).toBeInTheDocument()
    expect(screen.getByText('1/1/2026 – 6/30/2026')).toBeInTheDocument()

    fireEvent.click(within(nav).getByRole('button', { name: 'Request for individual' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Create License Request for Employee' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Select Employee' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Desired license plan' })).toHaveValue('')
    expect(screen.getByLabelText('From date')).toHaveValue('')
    expect(screen.getByLabelText('To date')).toHaveValue('')
    expect(within(nav).getByRole('button', { name: 'Request for individual' })).toHaveAttribute('aria-current', 'page')
  })

  it('restores team request mode from the Manager URL', async () => {
    localStorage.setItem('saas-sentry.language', 'en')
    await setAppLanguage('en', false)
    renderDashboard('manager', '/?tab=create-employee-request&scope=team')

    expect(screen.getByRole('heading', { level: 1, name: 'Create License Request for Team' })).toBeInTheDocument()
    const nav = screen.getByRole('navigation', { name: 'Dashboard navigation' })
    expect(within(nav).getByRole('button', { name: 'Create Request' })).toHaveAttribute('aria-expanded', 'true')
  })
})
