import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'

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

  it('shows only Manager session previews in My Requests and lets the manager filter them', async () => {
    localStorage.setItem('saas-sentry.language', 'en')
    await setAppLanguage('en', false)
    const view = renderDashboard('manager', '/?tab=my-requests')
    const nav = screen.getByRole('navigation', { name: 'Dashboard navigation' })
    const approvalButton = within(nav).getByRole('button', { name: /Team Requests/ })
    const myRequestsButton = within(nav).getByRole('button', { name: 'My Requests' })

    expect(approvalButton.compareDocumentPosition(myRequestsButton) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(myRequestsButton).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('heading', { level: 1, name: 'My Requests' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'No previews yet' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Request for team' }))
    const members = screen.getByRole('group', { name: 'Select team members to receive access' })
    fireEvent.click(within(members).getAllByRole('checkbox')[0])
    fireEvent.change(screen.getByRole('textbox', { name: 'Desired license plan' }), {
      target: { value: 'Enterprise Custom' }
    })
    fireEvent.change(screen.getByLabelText('From date'), { target: { value: '2026-01-01' } })
    fireEvent.change(screen.getByLabelText('To date'), { target: { value: '2026-06-30' } })
    fireEvent.change(screen.getByRole('textbox', { name: 'Business Justification' }), {
      target: { value: 'Shared design work' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Preview Request' }))
    fireEvent.click(screen.getByRole('button', { name: 'Save preview' }))

    expect(screen.getByRole('heading', { level: 1, name: 'My Requests' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'No previews yet' })).not.toBeInTheDocument()
    expect(screen.getByText('Enterprise Custom')).toBeInTheDocument()
    expect(screen.getByText('Not submitted')).toBeInTheDocument()
    const detailsButton = screen.getByRole('button', { name: 'View details' })
    expect(detailsButton).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(detailsButton)
    expect(detailsButton).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Shared design work')).toBeInTheDocument()

    const filters = screen.getByRole('group', { name: 'Filter by request audience' })
    fireEvent.click(within(filters).getByRole('button', { name: 'Individual' }))
    expect(screen.getByText('No matching previews found.')).toBeInTheDocument()
    fireEvent.click(within(filters).getByRole('button', { name: 'All' }))
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search my requests' }), {
      target: { value: 'no-such-software' }
    })
    expect(screen.getByText('No matching previews found.')).toBeInTheDocument()

    view.unmount()
    renderDashboard('manager', '/?tab=my-requests')
    expect(screen.getByRole('heading', { name: 'No previews yet' })).toBeInTheDocument()
  })

  it('collects marked employee requests directly and sends the full list in the preview', async () => {
    localStorage.setItem('saas-sentry.language', 'en')
    await setAppLanguage('en', false)
    renderDashboard('manager', '/?tab=team-requests')

    fireEvent.click(
      within(screen.getByRole('row', { name: /REQ-M01/ })).getByRole('button', { name: 'Review & Decide' })
    )
    expect(screen.getByRole('heading', { name: 'Registered participants' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Mark request' }))
    expect(screen.getByRole('heading', { name: 'Marked requests' })).toBeInTheDocument()
    expect(screen.getByText('1 marked requests')).toBeInTheDocument()
    expect(screen.getByText(/REQ-M01/)).toBeInTheDocument()
    expect(screen.queryByRole('textbox', { name: 'Desired license plan' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Review more requests' }))
    fireEvent.click(
      within(screen.getByRole('row', { name: /REQ-M02/ })).getByRole('button', { name: 'Review & Decide' })
    )
    fireEvent.click(screen.getByRole('button', { name: 'Mark request' }))
    expect(screen.getByText('2 marked requests')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Send all to CEO' }))
    expect(screen.getByText(/Send recorded for 2 requests in this preview/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Send all to CEO' })).toBeDisabled()
    expect(screen.getByRole('heading', { name: 'No marked requests awaiting send' })).toBeInTheDocument()
  })
  it('groups access review by employee and opens usage details without a revocation decision', () => {
    renderDashboard('manager')
    const nav = screen.getByRole('navigation', { name: 'Điều hướng dashboard' })

    fireEvent.click(within(nav).getByRole('button', { name: /Nhân viên của tôi/i }))
    const onLeave = screen.getByRole('button', { name: 'Nghỉ phép' })
    fireEvent.click(onLeave)
    expect(onLeave).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('table', { name: 'Thành viên trong nhóm' })).toBeInTheDocument()

    fireEvent.click(within(nav).getByRole('button', { name: /Đợt tái chứng nhận quyền/i }))
    expect(screen.getByRole('region', { name: 'Danh sách nhân viên trong đợt tái chứng nhận' })).toBeInTheDocument()
    expect(screen.queryByText('AutoCAD')).not.toBeInTheDocument()
    const employee = screen.getByRole('button', { name: /Mai Thị Lan.*2 công cụ/i })
    fireEvent.click(employee)
    expect(employee).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('table', { name: 'Công cụ của Mai Thị Lan' })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Gửi yêu cầu thu hồi' })[0]).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Xuất Excel sử dụng' })).toBeEnabled()
    fireEvent.click(screen.getByRole('button', { name: 'Xem tần suất sử dụng' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Mức sử dụng phần mềm của Mai Thị Lan' })).toBeInTheDocument()
    expect(within(nav).getByRole('button', { name: /Đợt tái chứng nhận quyền/i })).toHaveAttribute(
      'aria-current',
      'page'
    )
    expect(screen.getByRole('button', { name: 'Xem chi tiết sử dụng Figma' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Xem chi tiết sử dụng Research Agent' })).toBeInTheDocument()
    expect(screen.getByText('Cần xác minh mức sử dụng')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Xuất Excel sử dụng' })).toBeEnabled()
    expect(screen.queryByRole('button', { name: 'Cấp thêm phần mềm' })).not.toBeInTheDocument()
    expect(screen.queryByText(/₫/)).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Xem chi tiết sử dụng Figma' }))
    expect(screen.getByRole('heading', { name: 'Phiên sử dụng gần nhất' })).toBeInTheDocument()
    expect(screen.getByText('Bắt đầu')).toBeInTheDocument()
    expect(screen.getByText('Kết thúc gần nhất')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Xem chi tiết sử dụng Slack' }))
    expect(screen.getByRole('heading', { name: 'Phiên sử dụng gần nhất' })).toBeInTheDocument()
    expect(screen.getByText('Bắt đầu')).toBeInTheDocument()
    expect(screen.queryByText('Chưa có dữ liệu')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Xem chi tiết sử dụng Research Agent' }))
    expect(screen.getByRole('heading', { name: 'Credit sử dụng theo kỳ được cấp' })).toBeInTheDocument()
    expect(screen.getByText('420')).toBeInTheDocument()
    expect(screen.getByText('600')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Quay lại đợt tái chứng nhận quyền truy cập' }))
    expect(
      screen.getByRole('heading', { level: 1, name: 'Đợt tái chứng nhận quyền truy cập định kỳ' })
    ).toBeInTheDocument()
  })

  it('downloads the selected employee usage as an Excel file', async () => {
    const originalCreateObjectURL = Object.getOwnPropertyDescriptor(URL, 'createObjectURL')
    const originalRevokeObjectURL = Object.getOwnPropertyDescriptor(URL, 'revokeObjectURL')
    const createObjectURL = vi.fn(() => 'blob:usage')
    const revokeObjectURL = vi.fn()
    Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: createObjectURL })
    Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: revokeObjectURL })
    let filename = ''
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
      filename = this.download
    })

    renderDashboard('manager', '/?tab=access-review')
    fireEvent.click(screen.getByRole('button', { name: /Mai Thị Lan.*2 công cụ/i }))
    fireEvent.click(screen.getByRole('button', { name: 'Xem tần suất sử dụng' }))
    fireEvent.click(screen.getByRole('button', { name: 'Xuất Excel sử dụng' }))

    expect(createObjectURL).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    )
    expect(filename).toBe('usage-EMP-01.xlsx')
    await waitFor(() => expect(revokeObjectURL).toHaveBeenCalledWith('blob:usage'))
    click.mockRestore()
    if (originalCreateObjectURL) Object.defineProperty(URL, 'createObjectURL', originalCreateObjectURL)
    else Reflect.deleteProperty(URL, 'createObjectURL')
    if (originalRevokeObjectURL) Object.defineProperty(URL, 'revokeObjectURL', originalRevokeObjectURL)
    else Reflect.deleteProperty(URL, 'revokeObjectURL')
  })

  it('shows credit consumption against an AI agent request allocation', () => {
    renderDashboard('manager', '/?tab=employee-detail&id=EMP-02')
    fireEvent.click(screen.getByRole('button', { name: 'Xem chi tiết sử dụng GitHub' }))
    expect(screen.getByRole('heading', { name: 'Phiên sử dụng gần nhất' })).toBeInTheDocument()
    expect(screen.getByText('Bắt đầu')).toBeInTheDocument()
    expect(screen.getByText('Kết thúc gần nhất')).toBeInTheDocument()
    expect(screen.queryByText('Chưa có dữ liệu')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Xem chi tiết sử dụng Codex' }))

    expect(screen.getByText('1.450')).toBeInTheDocument()
    expect(screen.getByText('2.000')).toBeInTheDocument()
    expect(screen.getByText('Theo yêu cầu AI-REQ-014')).toBeInTheDocument()
  })

  it('keeps the team context for a directly opened employee detail', () => {
    renderDashboard('manager', '/?tab=employee-detail&id=EMP-01')
    const nav = screen.getByRole('navigation', { name: 'Điều hướng dashboard' })
    expect(within(nav).getByRole('button', { name: /Nhân viên của tôi/i })).toHaveAttribute('aria-current', 'page')
    expect(screen.queryByRole('button', { name: 'Cấp thêm phần mềm' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'Mức sử dụng phần mềm của Mai Thị Lan' })).toBeInTheDocument()
  })

  it('shows tool usage without manager revocation controls and explains request availability', () => {
    renderDashboard('manager')
    const nav = screen.getByRole('navigation', { name: 'Điều hướng dashboard' })
    fireEvent.click(within(nav).getByRole('button', { name: /Rà soát tài khoản lãng phí/i }))
    expect(screen.getByRole('columnheader', { name: 'Mức độ sử dụng' })).toBeInTheDocument()
    expect(screen.queryByText('G3')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /thu hồi|giữ lại/i })).not.toBeInTheDocument()
    fireEvent.click(screen.getAllByRole('button', { name: 'Xem chi tiết' })[0])
    expect(screen.getByRole('heading', { level: 1, name: 'Chi tiết sử dụng phần mềm' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Gửi yêu cầu kiểm tra' })).toBeDisabled()
    expect(screen.getByText(/chưa có kết nối tiếp nhận/)).toBeInTheDocument()
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

    // Click sub-menu "Gia hạn AI"
    const renewalsBtn = screen.getByRole('button', { name: /Gia hạn AI/i })
    fireEvent.click(renewalsBtn)
    expect(renewalsBtn).toHaveAttribute('aria-current', 'page')
    expect(screen.getByText('Đề xuất gia hạn & Đàm phán hợp đồng AI')).toBeInTheDocument()

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

    // Click "Quyền riêng tư"
    const privacyBtn = within(nav).getByRole('button', { name: 'Quyền riêng tư' })
    expect(privacyBtn).not.toHaveClass('bg-primary')
    fireEvent.click(privacyBtn)
    expect(privacyBtn).toHaveClass('bg-primary')
    expect(createRequestBtn).not.toHaveClass('bg-primary')
    expect(screen.getByRole('heading', { level: 1, name: 'Quyền riêng tư' })).toBeInTheDocument()
    expect(screen.queryByText('Thông tin cá nhân')).not.toBeInTheDocument()

    // Return to Overview
    fireEvent.click(overviewBtn)
    expect(overviewBtn).toHaveClass('bg-primary')
    expect(privacyBtn).not.toHaveClass('bg-primary')
    expect(screen.getByText('Bảng điều khiển Nhân viên')).toBeInTheDocument()

    view.unmount()
  })

  it('opens the separate employee profile from the header avatar', () => {
    renderDashboard('employee')
    const nav = screen.getByRole('navigation', { name: 'Điều hướng dashboard' })
    const avatar = screen.getByRole('button', { name: 'Mở hồ sơ cá nhân' })

    fireEvent.click(avatar)

    expect(avatar).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('heading', { level: 1, name: 'Hồ sơ cá nhân' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Thông tin cá nhân' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Thông tin tổ chức' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Bảo vệ quyền riêng tư & Minh bạch dữ liệu' })).not.toBeInTheDocument()
    expect(within(nav).getByRole('button', { name: 'Quyền riêng tư' })).not.toHaveAttribute('aria-current')

    fireEvent.click(within(nav).getByRole('button', { name: 'Quyền riêng tư' }))
    expect(screen.getByRole('button', { name: 'Xuất dữ liệu của tôi' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Xuất dữ liệu của tôi' }))
    fireEvent.click(screen.getByRole('button', { name: 'Quay lại Quyền riêng tư' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Quyền riêng tư' })).toBeInTheDocument()
  })

  it('previews a selected employee avatar in the profile and header', () => {
    const createDescriptor = Object.getOwnPropertyDescriptor(URL, 'createObjectURL')
    const revokeDescriptor = Object.getOwnPropertyDescriptor(URL, 'revokeObjectURL')
    const createObjectURL = vi.fn(() => 'blob:employee-avatar')
    const revokeObjectURL = vi.fn()
    Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: createObjectURL })
    Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: revokeObjectURL })

    try {
      const view = renderDashboard('employee', '/?tab=profile')
      const avatarButton = screen.getByRole('button', { name: 'Mở hồ sơ cá nhân' })
      const fileInput = screen.getByLabelText('Chọn ảnh đại diện')

      fireEvent.change(fileInput, {
        target: { files: [new File(['invalid'], 'avatar.svg', { type: 'image/svg+xml' })] }
      })
      expect(screen.getByRole('alert')).toHaveTextContent('Chỉ hỗ trợ ảnh JPG, PNG hoặc WebP.')
      expect(createObjectURL).not.toHaveBeenCalled()

      fireEvent.change(fileInput, {
        target: { files: [new File([new Uint8Array(2 * 1024 * 1024 + 1)], 'large.png', { type: 'image/png' })] }
      })
      expect(screen.getByRole('alert')).toHaveTextContent('Ảnh phải có dung lượng tối đa 2 MB.')
      expect(createObjectURL).not.toHaveBeenCalled()

      fireEvent.change(fileInput, {
        target: { files: [new File(['valid'], 'avatar.png', { type: 'image/png' })] }
      })
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      expect(screen.getByRole('img', { name: 'Ảnh đại diện của Nguyễn Văn An' })).toHaveAttribute(
        'src',
        'blob:employee-avatar'
      )
      expect(avatarButton.querySelector('img')).toHaveAttribute('src', 'blob:employee-avatar')
      expect(screen.getByRole('button', { name: 'Đổi ảnh đại diện' })).toBeInTheDocument()

      view.unmount()
      expect(revokeObjectURL).toHaveBeenCalledWith('blob:employee-avatar')
    } finally {
      if (createDescriptor) Object.defineProperty(URL, 'createObjectURL', createDescriptor)
      else Reflect.deleteProperty(URL, 'createObjectURL')
      if (revokeDescriptor) Object.defineProperty(URL, 'revokeObjectURL', revokeDescriptor)
      else Reflect.deleteProperty(URL, 'revokeObjectURL')
    }
  })

  it('shows usage from the assigned software samples and opens the software list', () => {
    renderDashboard('employee')

    const usage = screen.getByRole('region', { name: 'Mức độ sử dụng phần mềm' })
    expect(within(usage).getByText('74%')).toBeInTheDocument()
    expect(within(usage).getByText('95%')).toBeInTheDocument()
    expect(within(usage).getByText('42%')).toBeInTheDocument()
    expect(within(usage).getByText(/không đo hiệu suất làm việc của nhân viên/)).toBeInTheDocument()

    fireEvent.click(within(usage).getByRole('button', { name: 'Tất cả' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Bản quyền phần mềm của tôi' })).toBeInTheDocument()
  })
})
