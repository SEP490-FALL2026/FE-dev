import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'

import { AppProviders } from '~/providers/app-providers'
import { setAppLanguage } from '~/shared/i18n/i18n'

import { DashboardPage } from '../dashboard-page'
import { resetAnnualBudgetStore } from './annual-budget-store'
import { resetOptimizationStore } from './optimization-store'

function renderTab(tab: string) {
  return render(
    <MemoryRouter initialEntries={[`/?tab=${tab}`]}>
      <AppProviders>
        <DashboardPage role='finance' />
      </AppProviders>
    </MemoryRouter>
  )
}

const apply = () => fireEvent.click(screen.getByRole('button', { name: 'Áp dụng bộ lọc' }))
const reset = () => fireEvent.click(screen.getByRole('button', { name: 'Đặt lại' }))
const search = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('searchbox', { name }), { target: { value } })
const choose = (label: string, value: string) =>
  fireEvent.change(screen.getByRole('combobox', { name: label }), { target: { value } })

describe('Finance catalog list filters', () => {
  beforeEach(async () => {
    localStorage.clear()
    localStorage.setItem('saas-sentry.language', 'vi')
    await setAppLanguage('vi', false)
    resetAnnualBudgetStore()
    resetOptimizationStore()
  })

  it('filters the decision history by search, outcome and year on apply', () => {
    renderTab('decision-history')
    const entries = () =>
      within(screen.getByRole('list', { name: 'Nhật ký quyết định ngân sách' })).queryAllByRole('listitem')
    const total = entries().length
    expect(total).toBeGreaterThan(1)

    search('Tìm kiếm quyết định', 'canva')
    expect(entries()).toHaveLength(total)
    apply()
    expect(entries()).toHaveLength(1)
    expect(screen.getByText(/Canva Pro ngoài danh mục/)).toBeInTheDocument()

    reset()
    expect(entries()).toHaveLength(total)
    expect(screen.getByRole('searchbox', { name: 'Tìm kiếm quyết định' })).toHaveValue('')

    choose('Kết quả', 'REJECTED')
    apply()
    expect(entries()).toHaveLength(1)

    choose('Kết quả', 'all')
    choose('Năm tài chính', '2027')
    choose('Trung tâm chi phí', 'CC-DES')
    apply()
    expect(entries()).toHaveLength(2)

    choose('Loại quyết định', 'SPEND_APPROVAL')
    apply()
    expect(entries()).toHaveLength(0)
    expect(screen.getByText('Không có quyết định nào khớp bộ lọc.')).toBeInTheDocument()
  })

  it('filters software by search, catalog status, group and group budget on apply', () => {
    renderTab('saas-cost')
    const names = () =>
      within(screen.getByRole('table'))
        .queryAllByRole('row')
        .slice(1)
        .map((row) => within(row).getAllByRole('cell')[0].querySelector('p')?.textContent)
    expect(names()).toHaveLength(10)

    search('Tìm kiếm phần mềm', 'atlassian')
    apply()
    expect(names()).toEqual(['Jira Software'])

    reset()
    expect(names()).toHaveLength(10)

    choose('Ngân sách nhóm', 'OVER')
    apply()
    expect(names()).toEqual(['Adobe Creative Cloud'])

    choose('Ngân sách nhóm', 'all')
    choose('Nhóm phần mềm', 'AI')
    apply()
    expect(names()).toEqual(['Cursor Pro', 'ChatGPT Team'])

    choose('Trạng thái danh mục', 'NOT_ALLOWED')
    apply()
    expect(names()).toEqual([])
    expect(screen.getByText('Không có SaaS nào khớp bộ lọc.')).toBeInTheDocument()

    choose('Nhóm phần mềm', 'all')
    choose('Trung tâm chi phí', 'CC-MKT')
    apply()
    expect(names()).toEqual(['Canva Pro'])
  })

  it('filters optimization proposals by search, status, timing and kind on apply', () => {
    renderTab('cost-optimization')
    const codes = () =>
      screen
        .queryAllByRole('button', { name: /^Xem chi tiết OPT-/ })
        .map((button) => button.getAttribute('aria-label')?.replace('Xem chi tiết ', ''))
    expect(codes()).toHaveLength(7)

    search('Tìm kiếm đề xuất tối ưu', 'atlassian')
    expect(codes()).toHaveLength(7)
    apply()
    expect(codes()).toEqual(['OPT-2026-12'])

    reset()
    expect(codes()).toHaveLength(7)

    choose('Thời điểm áp dụng', 'NEXT_RENEWAL')
    apply()
    expect(codes().sort()).toEqual(['OPT-2026-13', 'OPT-2026-15'])

    choose('Loại tối ưu', 'CANCEL')
    apply()
    expect(codes()).toEqual(['OPT-2026-15'])

    choose('Trạng thái', 'APPROVED')
    apply()
    expect(codes()).toEqual([])
    expect(screen.getByText('Không có đề xuất phù hợp bộ lọc.')).toBeInTheDocument()

    reset()
    choose('Trạng thái', 'DRAFT')
    choose('Trung tâm chi phí', 'CC-DES')
    apply()
    expect(codes()).toEqual(['OPT-2026-11'])
  })
})
