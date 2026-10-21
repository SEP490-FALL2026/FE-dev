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

const marketingGroup = 'Marketing & bán hàng'

describe('Finance budget allocation, SaaS cost and decision history', () => {
  beforeEach(async () => {
    localStorage.clear()
    localStorage.setItem('saas-sentry.language', 'vi')
    await setAppLanguage('vi', false)
    resetAnnualBudgetStore()
  })

  it('keeps the allocated sum within the approved budget of a Cost Center', () => {
    renderDashboard('finance', '/?tab=budget-allocation')

    expect(screen.getByRole('heading', { level: 1, name: 'Phân bổ ngân sách đã duyệt' })).toBeInTheDocument()
    expect(screen.getAllByText('Đã khóa').length).toBeGreaterThan(0)
    fireEvent.change(screen.getByRole('combobox', { name: 'Chọn trung tâm chi phí' }), { target: { value: 'CC-MKT' } })

    const summary = screen.getByRole('region', { name: 'Tổng hợp phân bổ CC-MKT' })
    expect(within(summary).getByText(/^37\.000\.000/)).toBeInTheDocument()

    const input = screen.getByLabelText(`Số phân bổ cho nhóm ${marketingGroup}`)
    const saveButton = screen.getByRole('button', { name: `Lưu phân bổ nhóm ${marketingGroup}` })
    fireEvent.change(input, { target: { value: '100000000' } })
    fireEvent.click(saveButton)
    expect(screen.getByRole('alert')).toHaveTextContent('vượt ngân sách đã duyệt')
    expect(within(summary).getByText(/^37\.000\.000/)).toBeInTheDocument()

    fireEvent.change(input, { target: { value: '80000000' } })
    fireEvent.click(saveButton)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(within(summary).getByText(/^10\.000\.000/)).toBeInTheDocument()
  })

  it('records an approved budget adjustment request in the decision history', () => {
    const { unmount } = renderDashboard('finance', '/?tab=budget-allocation')

    fireEvent.change(screen.getByRole('combobox', { name: 'Chọn trung tâm chi phí' }), { target: { value: 'CC-MKT' } })
    fireEvent.click(screen.getByRole('button', { name: 'Yêu cầu điều chỉnh ngân sách đã duyệt' }))
    const dialog = screen.getByRole('dialog')
    fireEvent.change(within(dialog).getByLabelText('Tổng ngân sách đề xuất'), { target: { value: '150000000' } })
    fireEvent.click(within(dialog).getByRole('button', { name: 'Gửi yêu cầu điều chỉnh' }))
    expect(within(dialog).getByRole('alert')).toHaveTextContent('Bắt buộc nhập lý do.')

    fireEvent.change(within(dialog).getByLabelText('Lý do điều chỉnh'), {
      target: { value: 'Mở rộng chiến dịch quý 4.' }
    })
    fireEvent.click(within(dialog).getByRole('button', { name: 'Gửi yêu cầu điều chỉnh' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByText(/Đã gửi yêu cầu điều chỉnh CC-MKT/)).toBeInTheDocument()
    unmount()

    renderDashboard('finance', '/?tab=decision-history')
    expect(screen.getByRole('heading', { level: 1, name: 'Lịch sử quyết định ngân sách' })).toBeInTheDocument()
    fireEvent.change(screen.getByRole('combobox', { name: 'Loại quyết định' }), {
      target: { value: 'ADJUSTMENT' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Áp dụng bộ lọc' }))
    const log = screen.getByRole('list', { name: 'Nhật ký quyết định ngân sách' })
    expect(within(log).getAllByRole('listitem')).toHaveLength(1)
    expect(within(log).getByText('Mở rộng chiến dịch quý 4.')).toBeInTheDocument()
    expect(within(log).getByText(/150\.000\.000/)).toBeInTheDocument()
  })

  it('separates new SaaS to evaluate from the catalog', () => {
    renderDashboard('finance', '/?tab=saas-cost')

    fireEvent.change(screen.getByRole('combobox', { name: 'Trạng thái danh mục' }), {
      target: { value: 'NEW_UNDER_REVIEW' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Áp dụng bộ lọc' }))
    const table = screen.getByRole('table')
    expect(within(table).getByText('HubSpot Marketing Starter')).toBeInTheDocument()
    expect(within(table).getByText('ChatGPT Team')).toBeInTheDocument()
    expect(within(table).queryByText('Figma Organization')).not.toBeInTheDocument()
  })
})
