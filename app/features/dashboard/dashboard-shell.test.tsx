import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeAll, afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

import type { UserRole } from '~/entities/user-role/user-role'
import { AppProviders } from '~/providers/app-providers'
import { setAppLanguage } from '~/shared/i18n/i18n'

import { DashboardPage } from './dashboard-page'

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
    expect(screen.getByRole('link', { name: 'Đăng xuất' })).toHaveAttribute('href', '/logout')
  })

  it('navigates IT API screens and identifies features without backend support', async () => {
    const view = renderDashboard('it-admin')
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
