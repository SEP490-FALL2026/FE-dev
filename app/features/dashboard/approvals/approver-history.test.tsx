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

const entries = () =>
  within(screen.getByRole('list', { name: 'Nhật ký quyết định của Người duyệt chi' })).queryAllByRole('listitem')
const entryWith = (text: RegExp) => {
  const entry = entries().find((item) => text.test(item.textContent ?? ''))
  if (!entry) throw new Error(`No entry matching ${text}`)
  return entry
}

describe('Spending Approver decision history (APV-06)', () => {
  beforeEach(async () => {
    localStorage.clear()
    localStorage.setItem('saas-sentry.language', 'vi')
    await setAppLanguage('vi', false)
    resetAnnualBudgetStore()
  })

  it('lists only approver decisions with version, outcome and a read-only notice', () => {
    renderDashboard('spending-approver', '/?tab=decision-history')

    expect(screen.getByRole('heading', { level: 1, name: 'Lịch sử quyết định' })).toBeInTheDocument()
    expect(screen.getByText(/Nhật ký kiểm toán chỉ đọc/)).toBeInTheDocument()
    expect(entries()).toHaveLength(5)

    const summary = screen.getByRole('region', { name: 'Tóm tắt quyết định' })
    expect(within(summary).getByText('Tổng quyết định').parentElement?.parentElement).toHaveTextContent('5')

    const approvedV2 = entryWith(/Duyệt ngân sách năm 2026 cho 6/)
    expect(within(approvedV2).getByText('Phiên bản v2')).toBeInTheDocument()
    expect(within(approvedV2).getByText('Đã duyệt')).toBeInTheDocument()
    expect(within(approvedV2).getByText('Phạm Hoàng Nam')).toBeInTheDocument()
    expect(within(approvedV2).queryByText('Lý do')).not.toBeInTheDocument()

    const adjustmentV1 = entryWith(/giảm buffer Phòng Kỹ thuật/)
    expect(within(adjustmentV1).getByText('Phiên bản v1')).toBeInTheDocument()
    expect(within(adjustmentV1).getByText('Yêu cầu điều chỉnh')).toBeInTheDocument()
    expect(within(adjustmentV1).getByText('Lý do')).toBeInTheDocument()

    const rejected = entryWith(/REQ-2026-071/)
    expect(within(rejected).getByText('Từ chối')).toBeInTheDocument()
    expect(within(rejected).getByText('Duyệt ngoại lệ')).toBeInTheDocument()
    expect(within(rejected).getByText('Lý do')).toBeInTheDocument()

    expect(screen.queryByText(/Figma Organization: 4 ghost seat/)).not.toBeInTheDocument()
  })

  it('separates annual budget, regular spend and exception or adjustment decisions', () => {
    renderDashboard('spending-approver', '/?tab=decision-history')
    const group = screen.getByRole('combobox', { name: 'Nhóm quyết định' })
    const apply = () => fireEvent.click(screen.getByRole('button', { name: 'Áp dụng bộ lọc' }))

    fireEvent.change(group, { target: { value: 'annual' } })
    apply()
    expect(entries()).toHaveLength(2)
    expect(entries().every((item) => /Kết quả duyệt/.test(item.textContent ?? ''))).toBe(true)

    fireEvent.change(group, { target: { value: 'spend' } })
    apply()
    expect(entries()).toHaveLength(1)
    expect(entryWith(/REQ-2026-078/)).toHaveTextContent('Duyệt khoản chi thường')

    fireEvent.change(group, { target: { value: 'exception' } })
    apply()
    expect(entries()).toHaveLength(2)
    expect(entryWith(/REQ-2026-071/)).toBeInTheDocument()
    const adjustment = entryWith(/CC-MKT.*Chấp thuận tăng ngân sách Marketing/)
    expect(adjustment).toHaveTextContent('Duyệt điều chỉnh ngân sách')
    expect(within(adjustment).getByText('Ghi chú')).toBeInTheDocument()

    fireEvent.change(group, { target: { value: 'all' } })
    fireEvent.change(screen.getByRole('combobox', { name: 'Kết quả' }), { target: { value: 'REJECTED' } })
    apply()
    expect(entries()).toHaveLength(1)
    expect(entryWith(/REQ-2026-071/)).toBeInTheDocument()
  })
})
