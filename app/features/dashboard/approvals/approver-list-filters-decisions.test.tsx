import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'

import { AppProviders } from '~/providers/app-providers'
import { setAppLanguage } from '~/shared/i18n/i18n'

import { DashboardPage } from '../dashboard-page'
import {
  decideProposal,
  requestBudgetAdjustment,
  resetAnnualBudgetStore,
  resolveBudgetException,
  sendProposalsToApprover
} from '../finance/annual-budget-store'

function renderApprover(tab: string) {
  return render(
    <MemoryRouter initialEntries={[`/?tab=${tab}`]}>
      <AppProviders>
        <DashboardPage role='spending-approver' />
      </AppProviders>
    </MemoryRouter>
  )
}

const apply = () => fireEvent.click(screen.getByRole('button', { name: 'Áp dụng bộ lọc' }))
const reset = () => fireEvent.click(screen.getByRole('button', { name: 'Đặt lại' }))
const select = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('combobox', { name }), { target: { value } })
const search = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('searchbox', { name }), { target: { value } })

describe('Spending Approver decision list filters', () => {
  beforeEach(async () => {
    localStorage.clear()
    localStorage.setItem('saas-sentry.language', 'vi')
    await setAppLanguage('vi', false)
    resetAnnualBudgetStore()
  })

  it('filters annual budgets by stage, department and search on apply (APV-05)', () => {
    sendProposalsToApprover(['prop-des', 'prop-eng', 'prop-ops'])
    decideProposal('prop-ops', 'APPROVED')
    renderApprover('annual-budget')

    const departments = () =>
      screen
        .queryAllByRole('button', { name: /^Xem ngân sách / })
        .map((button) => button.getAttribute('aria-label')?.replace('Xem ngân sách ', ''))
        .sort()
    expect(screen.getByRole('combobox', { name: 'Giai đoạn' })).toHaveValue('SENT')
    expect(departments()).toEqual(['Phòng Kinh doanh', 'Phòng Kỹ thuật', 'Phòng Thiết kế'])

    select('Giai đoạn', 'APPROVED')
    expect(departments()).toHaveLength(3)
    apply()
    expect(departments()).toEqual(['Phòng Vận hành'])

    select('Giai đoạn', 'all')
    select('Phòng ban', 'Phòng Thiết kế')
    apply()
    expect(departments()).toEqual(['Phòng Thiết kế'])

    reset()
    expect(departments()).toHaveLength(3)
    expect(screen.getByRole('combobox', { name: 'Phòng ban' })).toHaveValue('')

    search('Tìm kiếm hồ sơ ngân sách', 'cc-eng')
    apply()
    expect(departments()).toEqual(['Phòng Kỹ thuật'])

    search('Tìm kiếm hồ sơ ngân sách', 'hoàng gia linh')
    apply()
    expect(departments()).toEqual(['Phòng Kinh doanh'])

    select('Giai đoạn', 'REJECTED')
    apply()
    expect(departments()).toEqual([])
    expect(screen.getByText('Không có hồ sơ ngân sách nào khớp bộ lọc.')).toBeInTheDocument()
  })

  it('filters exceptions and adjustments by status, type-specific fields and search (APV-07)', () => {
    resolveBudgetException('bex-106', { action: 'SUBMIT_TO_APPROVER', note: 'Trình duyệt ngoại lệ trực sự cố.' })
    resolveBudgetException('bex-101', { action: 'PROPOSE_TOPUP', note: 'Bổ sung cho chiến dịch.', topUp: 4_200_000 })
    requestBudgetAdjustment('CC-MKT', 120_000_000, 100_000_000, 'Hủy chiến dịch quý 4.')
    renderApprover('exception-approval')

    const references = () => screen.queryAllByText(/^(REQ-2026-\d{3}|ADJ-[A-Z0-9-]+)$/).map((item) => item.textContent)
    expect(references().sort()).toEqual(['REQ-2026-099', 'REQ-2026-101', 'REQ-2026-106'])

    select('Loại ngoại lệ', 'OUT_OF_CATALOG')
    expect(references()).toHaveLength(3)
    apply()
    expect(references()).toEqual(['REQ-2026-101'])

    reset()
    select('Phương án của Tài chính', 'SUBMIT_TO_APPROVER')
    apply()
    expect(references()).toEqual(['REQ-2026-106'])

    reset()
    select('Trung tâm chi phí', 'CC-ENG')
    apply()
    expect(references()).toEqual(['REQ-2026-099'])

    reset()
    search('Tìm kiếm hồ sơ ngoại lệ', 'sự cố bảo mật')
    apply()
    expect(references()).toEqual(['REQ-2026-099'])

    select('Trạng thái', 'decided')
    apply()
    expect(references()).toEqual([])
    expect(screen.getByText('Không có hồ sơ nào khớp bộ lọc.')).toBeInTheDocument()

    fireEvent.click(
      within(screen.getByRole('group', { name: 'Loại hồ sơ' })).getByRole('button', { name: /Điều chỉnh ngân sách/ })
    )
    expect(screen.queryByRole('combobox', { name: 'Loại ngoại lệ' })).not.toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Trạng thái' })).toHaveValue('pending')
    expect(references().sort()).toEqual(['ADJ-2', 'ADJ-OPS'])

    select('Hướng điều chỉnh', 'decrease')
    apply()
    expect(references()).toEqual(['ADJ-2'])

    reset()
    search('Tìm kiếm hồ sơ ngoại lệ', 'pagerduty')
    apply()
    expect(references()).toEqual(['ADJ-OPS'])
  })

  it('filters the decision log by group, outcome, cost center and search (APV-06)', () => {
    renderApprover('decision-history')

    const entries = () =>
      within(screen.getByRole('list', { name: 'Nhật ký quyết định của Người duyệt chi' })).queryAllByRole('listitem')
    expect(entries()).toHaveLength(5)

    select('Trung tâm chi phí', 'CC-MKT')
    expect(entries()).toHaveLength(5)
    apply()
    expect(entries()).toHaveLength(2)

    select('Kết quả', 'REJECTED')
    apply()
    expect(entries()).toHaveLength(1)
    expect(entries()[0]).toHaveTextContent('REQ-2026-071')

    select('Nhóm quyết định', 'annual')
    apply()
    expect(entries()).toHaveLength(0)
    expect(screen.getByText('Không có quyết định nào khớp bộ lọc.')).toBeInTheDocument()

    reset()
    expect(entries()).toHaveLength(5)
    expect(screen.getByRole('combobox', { name: 'Nhóm quyết định' })).toHaveValue('all')

    search('Tìm kiếm trong nhật ký quyết định', 'cursor')
    apply()
    expect(entries()).toHaveLength(1)
    expect(entries()[0]).toHaveTextContent('REQ-2026-078')

    select('Năm tài chính', '2026')
    apply()
    expect(entries()).toHaveLength(1)
  })
})
