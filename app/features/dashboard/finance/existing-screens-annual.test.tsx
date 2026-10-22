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

describe('Annual budget figures on the existing Finance screens', () => {
  beforeEach(async () => {
    localStorage.clear()
    localStorage.setItem('saas-sentry.language', 'vi')
    await setAppLanguage('vi', false)
    resetAnnualBudgetStore()
  })

  it('shows the approved annual budget apart from the proposed, not yet approved one', () => {
    renderDashboard('finance', '/?tab=overview')

    const region = screen.getByRole('region', { name: 'Ngân sách năm' })
    expect(within(region).getByRole('heading', { name: 'Ngân sách năm 2026 đã duyệt' })).toBeInTheDocument()
    expect(within(region).getByText(/2\.076\.000\.000/)).toBeInTheDocument()
    expect(within(region).getByText(/69\.720\.000/)).toBeInTheDocument()

    const proposed = within(region).getByRole('group', { name: 'Đang đề xuất — chưa duyệt' })
    expect(within(proposed).getByText('Chưa duyệt')).toBeInTheDocument()
    expect(within(proposed).getByText('Tổng đang đề xuất')).toBeInTheDocument()
    expect(within(proposed).getByText('Đã gửi Người duyệt chi')).toBeInTheDocument()
  })

  it('switches the department budgets to FY2027 with their lifecycle status', () => {
    renderDashboard('finance', '/?tab=budgets')
    const table = screen.getByRole('table', { name: 'Ngân sách năm theo phòng ban' })

    expect(within(table).getByRole('row', { name: /Phòng Kinh doanh/ })).toHaveTextContent('Đang hiệu lực')
    fireEvent.change(screen.getByRole('combobox', { name: 'Năm tài chính' }), { target: { value: '2027' } })

    const salesRow = within(table).getByRole('row', { name: /Phòng Kinh doanh/ })
    expect(within(salesRow).getByText('Chờ phê duyệt')).toBeInTheDocument()

    fireEvent.change(screen.getByRole('combobox', { name: 'Năm tài chính' }), { target: { value: '2025' } })
    const companyRow = within(table).getByRole('row', { name: /Toàn công ty \(tổng đã duyệt\)/ })
    expect(within(companyRow).getByText('Hết hiệu lực')).toBeInTheDocument()
  })

  it('tracks approved spending that is not recorded or not paid yet', () => {
    renderDashboard('finance', '/?tab=commitments')

    const totals = screen.getByLabelText('Tổng chưa thanh toán')
    expect(within(totals).getByText(/69\.720\.000/)).toBeInTheDocument()
    expect(within(totals).getByText(/24\.420\.000/)).toBeInTheDocument()
    expect(within(totals).getByText(/45\.300\.000/)).toBeInTheDocument()
    expect(screen.getByRole('row', { name: /CMT-2026-044/ })).toHaveTextContent('Đã ghi nhận — chưa thanh toán')
    expect(screen.getByText(/được trừ khỏi ngân sách còn lại/)).toBeInTheDocument()
  })
})
