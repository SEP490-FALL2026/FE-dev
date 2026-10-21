import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'

import type { UserRole } from '~/entities/user-role/user-role'
import { AppProviders } from '~/providers/app-providers'
import { setAppLanguage } from '~/shared/i18n/i18n'

import { DashboardPage } from '../dashboard-page'
import { resetAnnualBudgetStore } from '../finance/annual-budget-store'
import { budgetPosition, queueBudgetCheck } from './approval-budget-check'
import { approvalQueue } from './approvals-data'

function renderDashboard(role: UserRole, initialEntry: string) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <AppProviders>
        <DashboardPage role={role} />
      </AppProviders>
    </MemoryRouter>
  )
}

const checkOf = (reference: string) => {
  const item = approvalQueue.find((entry) => entry.reference === reference)
  if (!item) throw new Error(reference)
  return queueBudgetCheck(item)
}

describe('Spending Approver budget checks and annual budget files', () => {
  beforeEach(async () => {
    localStorage.clear()
    localStorage.setItem('saas-sentry.language', 'vi')
    await setAppLanguage('vi', false)
    resetAnnualBudgetStore()
  })

  it('derives a budget check result for every queue item', () => {
    expect(checkOf('REQ-2026-089')).toBe('PASSED')
    expect(checkOf('SUB-SLACK-ENT')).toBe('INSUFFICIENT')
    expect(checkOf('SUB-GITHUB-ENT')).toBe('PASSED')
    expect(checkOf('CHG-0979')).toBe('OUT_OF_CATALOG')
    expect(checkOf('FND-2026-07')).toBe('OUT_OF_CATALOG')
    expect(checkOf('REQ-2026-107')).toBe('CC_EXPIRED')

    const company = budgetPosition('CC-COMPANY', 96_000_000)
    expect(company.approved).toBe(203_000_000)
    expect(company.after).toBe((company.before ?? 0) - 96_000_000)
    expect(budgetPosition('CC-PRD', 5_400_000).approved).toBeNull()
  })

  it('keeps the overview to one row of what waits for a decision', () => {
    renderDashboard('spending-approver', '/?tab=overview')

    const tiles = screen.getByRole('region', { name: 'Việc chờ bạn quyết' })
    expect(within(tiles).getAllByRole('button')).toHaveLength(4)
    expect(within(tiles).getByText('Khoản chi SaaS chờ duyệt')).toBeInTheDocument()
    expect(within(tiles).getByText('Ngân sách năm chờ duyệt')).toBeInTheDocument()
    expect(within(tiles).getByText('1 ngoại lệ · 1 điều chỉnh ngân sách')).toBeInTheDocument()
    expect(within(tiles).getByText('Hạn báo hủy gần nhất')).toBeInTheDocument()
    // Spend and savings moved off the home screen; they stay one click away on Reports.
    expect(screen.queryByText('Tiết kiệm thực hiện ngay')).not.toBeInTheDocument()

    fireEvent.click(within(tiles).getByRole('button', { name: /Ngân sách năm chờ duyệt/ }))
    expect(screen.getByRole('heading', { level: 1, name: /ngân sách năm/i })).toBeInTheDocument()
  })

  it('keeps annual budget files apart from SaaS spend in the queue', () => {
    renderDashboard('spending-approver', '/?tab=queue')

    expect(screen.getByRole('heading', { level: 1, name: 'Hàng chờ phê duyệt' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Mở REQ-2026-089' })).toBeInTheDocument()

    fireEvent.click(
      within(screen.getByRole('group', { name: 'Loại hồ sơ' })).getByRole('button', { name: /Ngân sách năm/ })
    )
    expect(screen.getByText('Phòng Kinh doanh', { selector: 'p' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Mở ngân sách năm Phòng Kinh doanh' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Mở REQ-2026-089' })).not.toBeInTheDocument()
  })

  it('filters SaaS spend by budget check result', () => {
    renderDashboard('spending-approver', '/?tab=queue')
    const checks = screen.getByLabelText('Kết quả kiểm tra ngân sách')
    const apply = () => fireEvent.click(screen.getByRole('button', { name: 'Áp dụng bộ lọc' }))

    fireEvent.change(checks, { target: { value: 'INSUFFICIENT' } })
    apply()
    expect(screen.getByRole('button', { name: 'Mở SUB-SLACK-ENT' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Mở REQ-2026-089' })).not.toBeInTheDocument()

    fireEvent.change(checks, { target: { value: 'CC_EXPIRED' } })
    apply()
    expect(screen.getByRole('button', { name: 'Mở REQ-2026-107' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Mở SUB-SLACK-ENT' })).not.toBeInTheDocument()
  })

  it('shows the budget check panel on a SaaS request', () => {
    renderDashboard('spending-approver', '/?tab=request&id=req-089')

    const panel = screen.getByRole('region', { name: 'Kết quả kiểm tra ngân sách' })
    expect(within(panel).getByText('Trong ngân sách')).toBeInTheDocument()
    expect(within(panel).getByText('Còn lại trước khoản chi')).toBeInTheDocument()
    expect(within(panel).getByText('Còn lại sau khoản chi')).toBeInTheDocument()
  })

  it('opens a request on a retired Cost Center without a quarterly budget', () => {
    renderDashboard('spending-approver', '/?tab=request&id=req-107')

    expect(screen.getByRole('heading', { level: 1, name: 'Maze Starter' })).toBeInTheDocument()
    const panel = screen.getByRole('region', { name: 'Kết quả kiểm tra ngân sách' })
    expect(within(panel).getByText('Budget hết hiệu lực')).toBeInTheDocument()
  })

  it('keeps the report to three headline figures with the rare detail collapsed', () => {
    renderDashboard('spending-approver', '/?tab=reports')

    const figures = screen.getByRole('region', { name: 'Tiết kiệm' })
    expect(within(figures).getByText('Tổng chi Quý 3/2026')).toBeInTheDocument()
    expect(within(figures).getByText(/23 suất đã thu hồi/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Sử dụng license' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Thời gian xử lý' })).toBeInTheDocument()

    const branchA = screen.getByText('Suất cấp thẳng không qua duyệt chi (3 ứng dụng)').closest('details')
    expect(branchA).not.toHaveAttribute('open')
  })
})
