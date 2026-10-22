import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'

import type { UserRole } from '~/entities/user-role/user-role'
import { AppProviders } from '~/providers/app-providers'
import { setAppLanguage } from '~/shared/i18n/i18n'

import { DashboardPage } from '../dashboard-page'
import { resetOptimizationStore } from './optimization-store'

function renderDashboard(role: UserRole, initialEntry: string) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <AppProviders>
        <DashboardPage role={role} />
      </AppProviders>
    </MemoryRouter>
  )
}

describe('Finance period close by Cost Center and forecast cost optimization', () => {
  beforeEach(async () => {
    localStorage.clear()
    localStorage.setItem('saas-sentry.language', 'vi')
    await setAppLanguage('vi', false)
    resetOptimizationStore()
  })

  it('closes one Cost Center only after its remainder is released and the review is confirmed', () => {
    renderDashboard('finance', '/?tab=period-close')

    expect(
      screen.getByRole('heading', { level: 1, name: 'Đóng kỳ Quý 3/2026 theo trung tâm chi phí' })
    ).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Đóng kỳ CC-OPS' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Đóng kỳ Quý 3/2026 · CC-OPS' })).toBeInTheDocument()

    const closeButton = screen.getByRole('button', { name: 'Chốt CC-OPS' })
    fireEvent.click(screen.getByRole('checkbox'))
    expect(closeButton).toBeDisabled()

    fireEvent.click(screen.getByRole('button', { name: 'Giải phóng phần dư' }))
    fireEvent.click(screen.getByRole('button', { name: 'Giải phóng' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Bắt buộc nhập lý do.')
    fireEvent.change(screen.getByLabelText(/Lý do giải phóng phần dư CMT-2026-031/), {
      target: { value: 'Hợp đồng đã kết thúc, không còn hóa đơn.' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Giải phóng' }))

    expect(closeButton).toBeEnabled()
    fireEvent.click(closeButton)
    expect(screen.getByText(/Đã chốt bởi Ngọc Lan/)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Quay lại danh sách trung tâm chi phí' }))
    const summary = screen.getByRole('region', { name: 'Tóm tắt đóng kỳ' })
    expect(within(summary).getByText('2/6')).toBeInTheDocument()
  })

  it('lets Finance send a ghost-seat proposal that the Spending Approver then decides', () => {
    const finance = renderDashboard('finance', '/?tab=cost-optimization')

    expect(screen.getByRole('heading', { level: 1, name: 'Tối ưu chi phí dự trù Quý 4/2026' })).toBeInTheDocument()
    fireEvent.change(screen.getByRole('combobox', { name: 'Loại tối ưu' }), { target: { value: 'DOWNGRADE' } })
    fireEvent.click(screen.getByRole('button', { name: 'Áp dụng bộ lọc' }))
    expect(screen.queryByRole('button', { name: 'Xem chi tiết OPT-2026-11' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Đặt lại' }))

    fireEvent.click(screen.getByRole('button', { name: 'Xem chi tiết OPT-2026-11' }))
    expect(screen.getByText('Suất đề xuất thu hồi (4)')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Gửi Người duyệt chi' }))
    expect(screen.getByText(/đang chờ Người duyệt chi quyết/)).toBeInTheDocument()
    finance.unmount()

    renderDashboard('spending-approver', '/?tab=optimization')
    expect(screen.getByRole('heading', { level: 1, name: 'Đề xuất tối ưu chi phí' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Xem chi tiết OPT-2026-11' }))

    fireEvent.click(screen.getByRole('button', { name: 'Từ chối' }))
    fireEvent.click(screen.getByRole('button', { name: 'Xác nhận từ chối' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Bắt buộc nhập lý do.')
    fireEvent.click(screen.getByRole('button', { name: 'Hủy' }))

    fireEvent.click(screen.getByRole('button', { name: 'Duyệt đề xuất' }))
    expect(screen.getByText(/Phạm Hoàng Nam đã duyệt ngày \d{2}\/\d{2}\/\d{4}\./)).toBeInTheDocument()
  })
})
