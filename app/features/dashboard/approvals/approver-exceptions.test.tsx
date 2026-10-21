import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'

import type { UserRole } from '~/entities/user-role/user-role'
import { AppProviders } from '~/providers/app-providers'
import { setAppLanguage } from '~/shared/i18n/i18n'

import { DashboardPage } from '../dashboard-page'
import { resetAnnualBudgetStore } from '../finance/annual-budget-store'

function renderDashboard(role: UserRole, initialEntry: string) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <AppProviders>
        <DashboardPage role={role} />
      </AppProviders>
    </MemoryRouter>
  )
}

describe('Spending Approver exceptions, budget adjustments and annual budget adjustment requests', () => {
  beforeEach(async () => {
    localStorage.clear()
    localStorage.setItem('saas-sentry.language', 'vi')
    await setAppLanguage('vi', false)
    resetAnnualBudgetStore()
  })

  it('approves the top-up Finance proposed for a request short of budget', () => {
    renderDashboard('spending-approver', '/?tab=exception-approval')

    expect(screen.getByRole('heading', { level: 1, name: 'Phê duyệt ngoại lệ' })).toBeInTheDocument()
    const types = screen.getByRole('group', { name: 'Loại hồ sơ' })
    expect(within(types).getByRole('button', { name: /Ngoại lệ ngân sách/ })).toHaveTextContent('1')
    expect(screen.getByRole('combobox', { name: 'Trạng thái' })).toHaveValue('pending')
    expect(screen.getByText('REQ-2026-099')).toBeInTheDocument()
    expect(screen.queryByText('REQ-2026-106')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Xem hồ sơ REQ-2026-099' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Snyk Team · 12 nhà phát triển' })).toBeInTheDocument()
    expect(screen.getByText('Đề xuất bổ sung ngân sách')).toBeInTheDocument()
    expect(screen.getByText(/bắt buộc sau sự cố bảo mật tháng 9/)).toBeInTheDocument()
    expect(screen.getByText('Còn lại trước yêu cầu')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Chấp thuận' }))
    expect(screen.getAllByText('Đã chấp thuận').length).toBeGreaterThan(0)
    expect(screen.getByText(/^Phạm Hoàng Nam · /)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Chấp thuận' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Quay lại danh sách' }))
    expect(screen.getByText('Không có hồ sơ nào khớp bộ lọc.')).toBeInTheDocument()
    fireEvent.change(screen.getByRole('combobox', { name: 'Trạng thái' }), { target: { value: 'decided' } })
    fireEvent.click(screen.getByRole('button', { name: 'Áp dụng bộ lọc' }))
    expect(screen.getByText('REQ-2026-099')).toBeInTheDocument()
    expect(screen.getByText('Đã chấp thuận')).toBeInTheDocument()
  })

  it('rejects a change to an approved budget only with a reason', () => {
    renderDashboard('spending-approver', '/?tab=exception-approval')

    fireEvent.click(
      within(screen.getByRole('group', { name: 'Loại hồ sơ' })).getByRole('button', { name: /Điều chỉnh ngân sách/ })
    )
    fireEvent.click(screen.getByRole('button', { name: 'Xem hồ sơ ADJ-OPS' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Điều chỉnh ngân sách CC-OPS' })).toBeInTheDocument()
    expect(screen.getByText(/Thêm PagerDuty cho trực sự cố 24\/7/)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Từ chối' }))
    fireEvent.click(screen.getByRole('button', { name: 'Xác nhận từ chối' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Bắt buộc nhập lý do từ chối.')

    fireEvent.change(screen.getByLabelText('Lý do từ chối'), {
      target: { value: 'Dùng buffer quý 4 hiện có trước khi tăng ngân sách năm.' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Xác nhận từ chối' }))
    expect(screen.getAllByText('Đã từ chối').length).toBeGreaterThan(0)
    expect(screen.getByText('Lý do: Dùng buffer quý 4 hiện có trước khi tăng ngân sách năm.')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Từ chối' })).not.toBeInTheDocument()
  })

  it('returns an annual budget to Finance only with a reason', () => {
    renderDashboard('spending-approver', '/?tab=annual-budget&id=prop-sal')

    fireEvent.click(screen.getByRole('button', { name: 'Yêu cầu Tài chính điều chỉnh' }))
    fireEvent.click(screen.getByRole('button', { name: 'Gửi yêu cầu điều chỉnh' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Bắt buộc nhập lý do.')

    fireEvent.change(screen.getByLabelText('Nội dung cần Tài chính điều chỉnh'), {
      target: { value: 'Giảm Salesforce về 7 suất theo số người dùng thực tế.' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Gửi yêu cầu điều chỉnh' }))

    expect(screen.getByText('Bị trả lại')).toBeInTheDocument()
    expect(screen.getByText('Đã yêu cầu Tài chính điều chỉnh phiên bản v1')).toBeInTheDocument()
    expect(screen.getByText('Lý do: Giảm Salesforce về 7 suất theo số người dùng thực tế.')).toBeInTheDocument()
  })
})
