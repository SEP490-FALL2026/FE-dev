import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'

import type { UserRole } from '~/entities/user-role/user-role'
import { AppProviders } from '~/providers/app-providers'
import { setAppLanguage } from '~/shared/i18n/i18n'

import { DashboardPage } from '../dashboard-page'
import { resetAnnualBudgetStore } from './annual-budget-store'

function renderDashboard(role: UserRole, initialEntry: string) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <AppProviders>
        <DashboardPage role={role} />
      </AppProviders>
    </MemoryRouter>
  )
}

describe('Department budget summary, budget periods and annual budget approval', () => {
  beforeEach(async () => {
    localStorage.clear()
    localStorage.setItem('saas-sentry.language', 'vi')
    await setAppLanguage('vi', false)
    resetAnnualBudgetStore()
  })

  it('lets Finance send an analysed department budget that the Spending Approver then decides', () => {
    const finance = renderDashboard('finance', '/?tab=department-summary')

    expect(screen.getByRole('heading', { level: 1, name: 'Tổng hợp ngân sách phòng ban' })).toBeInTheDocument()
    const sendButton = screen.getByRole('button', { name: /Gửi hồ sơ cho Người duyệt chi/ })
    expect(sendButton).toBeDisabled()
    expect(screen.getByRole('checkbox', { name: 'Chọn Phòng Kỹ thuật' })).toBeDisabled()
    // The list stays short; the breakdown and the link to the analysis live on the detail screen.
    expect(screen.queryByRole('columnheader', { name: 'Chi phí SaaS sau rà soát' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Xem chi tiết ngân sách Phòng Kỹ thuật' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Phòng Kỹ thuật' })).toBeInTheDocument()
    expect(screen.getByText('Chi phí SaaS sau rà soát')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Mở phân tích ngân sách Phòng Kỹ thuật' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Quay lại danh sách' }))

    fireEvent.click(screen.getByRole('checkbox', { name: 'Chọn Phòng Thiết kế' }))
    fireEvent.click(screen.getByRole('button', { name: /Gửi hồ sơ cho Người duyệt chi/ }))
    expect(screen.getByText(/Đã gửi 1 hồ sơ cho Phạm Hoàng Nam/)).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Chọn Phòng Thiết kế' })).toBeDisabled()
    finance.unmount()

    renderDashboard('spending-approver', '/?tab=annual-budget')
    expect(screen.getByRole('heading', { level: 1, name: 'Duyệt ngân sách năm' })).toBeInTheDocument()
    const summary = screen.getByRole('region', { name: 'Tóm tắt hồ sơ ngân sách' })
    expect(within(summary).getByText('2')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Xem ngân sách Phòng Thiết kế' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Phòng Thiết kế' })).toBeInTheDocument()
    expect(screen.getByText('Thương lượng gói năm giảm 40%.')).toBeInTheDocument()

    expect(screen.getByText('Phiên bản v1')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Yêu cầu Tài chính điều chỉnh' }))
    fireEvent.click(screen.getByRole('button', { name: 'Gửi yêu cầu điều chỉnh' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Bắt buộc nhập lý do.')
    fireEvent.click(screen.getByRole('button', { name: 'Hủy' }))

    fireEvent.click(screen.getByRole('button', { name: 'Duyệt ngân sách' }))
    expect(screen.getByText('Đã duyệt phiên bản v1')).toBeInTheDocument()
    expect(screen.getAllByText(/^Phạm Hoàng Nam · /).length).toBeGreaterThan(0)
    expect(screen.queryByRole('button', { name: 'Yêu cầu Tài chính điều chỉnh' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Từ chối' })).not.toBeInTheDocument()
  })

  it('rejects a department budget only with a reason and records the outcome and version', () => {
    renderDashboard('spending-approver', '/?tab=annual-budget&id=prop-sal')

    expect(screen.getByRole('heading', { level: 1, name: 'Phòng Kinh doanh' })).toBeInTheDocument()
    expect(screen.getByText('Chỉ 2 người dùng thường xuyên; giữ 2 suất.')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Từ chối' }))
    fireEvent.click(screen.getByRole('button', { name: 'Xác nhận từ chối' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Bắt buộc nhập lý do.')

    fireEvent.change(screen.getByLabelText('Lý do từ chối'), {
      target: { value: 'Salesforce trùng với CRM đang dùng chung.' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Xác nhận từ chối' }))

    expect(screen.getByText('Đã từ chối phiên bản v1')).toBeInTheDocument()
    expect(screen.getByText('Lý do: Salesforce trùng với CRM đang dùng chung.')).toBeInTheDocument()
    expect(screen.getByText('Bị từ chối')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Duyệt ngân sách' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Quay lại danh sách' }))
    fireEvent.change(screen.getByLabelText('Giai đoạn'), { target: { value: 'REJECTED' } })
    fireEvent.click(screen.getByRole('button', { name: 'Áp dụng bộ lọc' }))
    expect(screen.getAllByRole('button', { name: /^Xem ngân sách / })).toHaveLength(1)
    expect(screen.getByRole('button', { name: 'Xem ngân sách Phòng Kinh doanh' })).toBeInTheDocument()
  })

  it('rejects a budget period whose end date is before its start date', () => {
    renderDashboard('finance', '/?tab=budget-periods')

    expect(screen.getByRole('heading', { level: 1, name: 'Quản lý kỳ ngân sách' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Sửa kỳ ngân sách năm 2025' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Xử lý ngoại lệ REQ-2026-107' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Xử lý ngoại lệ REQ-2026-088' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Sửa kỳ ngân sách năm 2027' }))
    const dialog = screen.getByRole('dialog', { name: 'Sửa kỳ ngân sách năm 2027' })
    fireEvent.change(within(dialog).getByLabelText('Ngày kết thúc'), { target: { value: '2026-12-01' } })
    fireEvent.click(within(dialog).getByRole('button', { name: 'Lưu' }))
    expect(within(dialog).getByRole('alert')).toHaveTextContent('Ngày kết thúc phải sau ngày bắt đầu.')

    fireEvent.change(within(dialog).getByLabelText('Ngày kết thúc'), { target: { value: '2027-12-30' } })
    fireEvent.click(within(dialog).getByRole('button', { name: 'Lưu' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByText('Đã cập nhật kỳ ngân sách năm 2027.')).toBeInTheDocument()
  })
})
