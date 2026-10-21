import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'

import { AppProviders } from '~/providers/app-providers'
import { setAppLanguage } from '~/shared/i18n/i18n'

import { DashboardPage } from '../dashboard-page'
import { resetAnnualBudgetStore } from '../finance/annual-budget-store'
import { resetOptimizationStore } from '../finance/optimization-store'

function renderApprover(initialEntry: string) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <AppProviders>
        <DashboardPage role='spending-approver' />
      </AppProviders>
    </MemoryRouter>
  )
}

const apply = () => fireEvent.click(screen.getByRole('button', { name: 'Áp dụng bộ lọc' }))
const reset = () => fireEvent.click(screen.getByRole('button', { name: 'Đặt lại' }))

const queueReferences = () =>
  screen
    .queryAllByRole('button', { name: /^Mở [A-Z]{3}-/ })
    .map((button) => button.getAttribute('aria-label')?.replace('Mở ', ''))
    .sort()

const proposalCodes = () =>
  screen
    .queryAllByRole('button', { name: /^Xem chi tiết OPT-/ })
    .map((button) => button.getAttribute('aria-label')?.replace('Xem chi tiết ', ''))
    .sort()

describe('Spending Approver list filters', () => {
  beforeEach(async () => {
    localStorage.clear()
    localStorage.setItem('saas-sentry.language', 'vi')
    await setAppLanguage('vi', false)
    resetAnnualBudgetStore()
    resetOptimizationStore()
  })

  it('filters the SaaS spend queue on apply and resets to every item', () => {
    renderApprover('/?tab=queue')
    expect(screen.getByRole('heading', { level: 1, name: 'Hàng chờ phê duyệt' })).toBeInTheDocument()
    expect(queueReferences()).toHaveLength(8)

    fireEvent.change(screen.getByLabelText('Loại việc'), { target: { value: 'renewals' } })
    expect(queueReferences()).toHaveLength(8)
    apply()
    expect(queueReferences()).toEqual(['SUB-GITHUB-ENT', 'SUB-SLACK-ENT'])

    fireEvent.change(screen.getByLabelText('Trung tâm chi phí'), { target: { value: 'CC-ENG' } })
    apply()
    expect(queueReferences()).toEqual(['SUB-GITHUB-ENT'])

    reset()
    expect(queueReferences()).toHaveLength(8)
    expect(screen.getByLabelText('Loại việc')).toHaveValue('all')

    fireEvent.change(screen.getByLabelText('Hạn xử lý'), { target: { value: 'overdue' } })
    apply()
    expect(queueReferences()).toEqual(['REQ-2026-101'])

    fireEvent.change(screen.getByLabelText('Hạn xử lý'), { target: { value: 'soon' } })
    apply()
    expect(queueReferences()).toEqual(['REQ-2026-089'])

    reset()
    fireEvent.change(screen.getByLabelText('Kết quả kiểm tra ngân sách'), { target: { value: 'OUT_OF_CATALOG' } })
    apply()
    expect(queueReferences()).toEqual(['CHG-0979', 'FND-2026-07', 'REQ-2026-101'])

    reset()
    fireEvent.change(screen.getByRole('searchbox', { name: 'Tìm kiếm hồ sơ chờ duyệt' }), {
      target: { value: 'phòng thiết kế' }
    })
    apply()
    expect(queueReferences()).toEqual(['REQ-2026-089', 'REQ-2026-107'])

    fireEvent.change(screen.getByRole('searchbox', { name: 'Tìm kiếm hồ sơ chờ duyệt' }), {
      target: { value: 'không có hồ sơ này' }
    })
    apply()
    expect(queueReferences()).toEqual([])
    expect(screen.getByText('Không có hồ sơ nào khớp bộ lọc.')).toBeInTheDocument()
  })

  it('filters annual budget files by search and department', () => {
    renderApprover('/?tab=queue')
    fireEvent.click(
      within(screen.getByRole('group', { name: 'Loại hồ sơ' })).getByRole('button', { name: /Ngân sách năm/ })
    )
    const openKinhDoanh = { name: 'Mở ngân sách năm Phòng Kinh doanh' }
    expect(screen.getByRole('button', openKinhDoanh)).toBeInTheDocument()

    const search = screen.getByRole('searchbox', { name: 'Tìm kiếm hồ sơ ngân sách năm' })
    fireEvent.change(search, { target: { value: 'CC-ENG' } })
    expect(screen.getByRole('button', openKinhDoanh)).toBeInTheDocument()
    apply()
    expect(screen.queryByRole('button', openKinhDoanh)).not.toBeInTheDocument()
    expect(screen.getByText('Không có hồ sơ ngân sách năm nào khớp bộ lọc.')).toBeInTheDocument()

    fireEvent.change(search, { target: { value: 'cc-sal' } })
    apply()
    expect(screen.getByRole('button', openKinhDoanh)).toBeInTheDocument()

    reset()
    expect(search).toHaveValue('')
    fireEvent.change(screen.getByLabelText('Phòng ban'), { target: { value: 'Phòng Kinh doanh' } })
    apply()
    expect(screen.getByRole('button', openKinhDoanh)).toBeInTheDocument()
  })

  it('filters optimization proposals, showing sent ones by default', () => {
    renderApprover('/?tab=optimization')
    expect(screen.getByRole('heading', { level: 1, name: 'Đề xuất tối ưu chi phí' })).toBeInTheDocument()
    expect(screen.getByLabelText('Trạng thái')).toHaveValue('SENT')
    expect(proposalCodes()).toEqual(['OPT-2026-12', 'OPT-2026-14'])

    fireEvent.change(screen.getByLabelText('Trạng thái'), { target: { value: 'all' } })
    expect(proposalCodes()).toEqual(['OPT-2026-12', 'OPT-2026-14'])
    apply()
    expect(proposalCodes()).toEqual(['OPT-2026-09', 'OPT-2026-10', 'OPT-2026-12', 'OPT-2026-14'])

    fireEvent.change(screen.getByLabelText('Loại tối ưu'), { target: { value: 'DOWNGRADE' } })
    apply()
    expect(proposalCodes()).toEqual(['OPT-2026-10', 'OPT-2026-14'])

    fireEvent.change(screen.getByLabelText('Trung tâm chi phí'), { target: { value: 'CC-ENG' } })
    apply()
    expect(proposalCodes()).toEqual(['OPT-2026-10'])

    reset()
    expect(screen.getByLabelText('Trạng thái')).toHaveValue('SENT')
    expect(proposalCodes()).toEqual(['OPT-2026-12', 'OPT-2026-14'])

    fireEvent.change(screen.getByRole('searchbox', { name: 'Tìm kiếm đề xuất tối ưu' }), {
      target: { value: 'atlassian' }
    })
    apply()
    expect(proposalCodes()).toEqual(['OPT-2026-12'])

    fireEvent.change(screen.getByRole('searchbox', { name: 'Tìm kiếm đề xuất tối ưu' }), {
      target: { value: 'miro' }
    })
    apply()
    expect(proposalCodes()).toEqual([])
    expect(screen.getByText('Không có đề xuất phù hợp bộ lọc.')).toBeInTheDocument()
  })
})
