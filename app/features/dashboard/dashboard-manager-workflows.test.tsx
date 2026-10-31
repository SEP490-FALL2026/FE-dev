import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeAll, afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
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

function renderDashboard(role: UserRole, initialEntry = '/') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <AppProviders>
        <DashboardPage role={role} />
      </AppProviders>
    </MemoryRouter>
  )
}

describe('DashboardPage Manager workflows', () => {
  beforeEach(async () => {
    localStorage.clear()
    localStorage.setItem('saas-sentry.language', 'vi')
    await setAppLanguage('vi', false)
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
