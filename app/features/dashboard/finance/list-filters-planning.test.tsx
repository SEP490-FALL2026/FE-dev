import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'

import { AppProviders } from '~/providers/app-providers'
import { setAppLanguage } from '~/shared/i18n/i18n'

import { DashboardPage } from '../dashboard-page'
import { resetAnnualBudgetStore } from './annual-budget-store'

function renderFinance(tab: string) {
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
const choose = (label: string, value: string) => fireEvent.change(screen.getByLabelText(label), { target: { value } })

/** Department names taken from the row buttons whose accessible name starts with `prefix`. */
const rowsOf = (prefix: string) =>
  screen
    .queryAllByRole('button', { name: new RegExp(`^${prefix} `) })
    .map((button) => button.getAttribute('aria-label')?.slice(prefix.length + 1))

describe('Finance planning and close list filters', () => {
  beforeEach(async () => {
    localStorage.clear()
    localStorage.setItem('saas-sentry.language', 'vi')
    await setAppLanguage('vi', false)
    resetAnnualBudgetStore()
  })

  it('filters FIN-40 annual proposals by search, department, stage and budget status on apply', () => {
    renderFinance('annual-proposals')
    const proposals = () => rowsOf('Xem đề xuất của')
    expect(proposals()).toHaveLength(6)
    expect(screen.getByLabelText('Năm ngân sách')).toHaveValue('2027')

    choose('Giai đoạn', 'SUBMITTED')
    expect(proposals()).toHaveLength(6)
    apply()
    expect(proposals()).toEqual(['Phòng Vận hành', 'Toàn công ty'])

    reset()
    expect(proposals()).toHaveLength(6)
    expect(screen.getByLabelText('Giai đoạn')).toHaveValue('all')

    search('Tìm kiếm đề xuất ngân sách', 'pagerduty')
    apply()
    expect(proposals()).toEqual(['Phòng Vận hành'])

    reset()
    choose('Phòng ban', 'CC-MKT')
    apply()
    expect(proposals()).toEqual(['Phòng Marketing'])

    reset()
    choose('Trạng thái ngân sách', 'PENDING_APPROVAL')
    apply()
    expect(proposals()).toEqual(['Phòng Kinh doanh'])

    choose('Giai đoạn', 'SUBMITTED')
    apply()
    expect(proposals()).toEqual([])
    expect(screen.getByText('Không có đề xuất nào ở tiến độ này.')).toBeInTheDocument()
  })

  it('filters FIN-41 negotiation by search, stage and whether Finance cut the request', () => {
    renderFinance('budget-negotiation')
    const files = () => rowsOf('Phân tích đề xuất của')
    expect(files()).toHaveLength(3)

    choose('Chênh lệch', 'CUT')
    apply()
    expect(files()).toEqual(['Phòng Thiết kế', 'Phòng Kinh doanh'])

    choose('Chênh lệch', 'KEPT')
    apply()
    expect(files()).toEqual(['Phòng Kỹ thuật'])

    reset()
    expect(files()).toHaveLength(3)

    search('Tìm kiếm hồ sơ thương lượng', 'gia linh')
    apply()
    expect(files()).toEqual(['Phòng Kinh doanh'])

    reset()
    choose('Giai đoạn', 'NEGOTIATED')
    apply()
    expect(files()).toEqual(['Phòng Thiết kế'])

    choose('Phòng ban', 'CC-ENG')
    apply()
    expect(files()).toEqual([])
  })

  it('filters FIN-42 summary rows, keeps selection on visible rows and totals the visible rows', () => {
    renderFinance('department-summary')
    const departments = () =>
      screen.queryAllByRole('checkbox', { name: /^Chọn / }).map((box) => box.getAttribute('aria-label')?.slice(5))
    expect(departments()).toHaveLength(6)
    expect(screen.getByText('Tổng toàn công ty')).toBeInTheDocument()

    choose('Sẵn sàng gửi', 'READY')
    apply()
    expect(departments()).toEqual(['Phòng Thiết kế'])
    expect(screen.getByText('Tổng các dòng đang hiển thị')).toBeInTheDocument()
    expect(screen.queryByText('Tổng toàn công ty')).not.toBeInTheDocument()

    const sendButton = screen.getByRole('button', { name: /Gửi hồ sơ cho Người duyệt chi/ })
    expect(sendButton).toBeDisabled()
    fireEvent.click(screen.getByRole('checkbox', { name: 'Chọn Phòng Thiết kế' }))
    expect(sendButton).toBeEnabled()

    reset()
    expect(departments()).toHaveLength(6)
    expect(screen.getByText('Tổng toàn công ty')).toBeInTheDocument()

    search('Tìm kiếm phòng ban trong tổng hợp', 'cc-sal')
    apply()
    expect(departments()).toEqual(['Phòng Kinh doanh'])
    // The selected Phòng Thiết kế is hidden, so nothing visible can be sent.
    expect(sendButton).toBeDisabled()

    reset()
    choose('Trạng thái ngân sách', 'DRAFT')
    apply()
    expect(departments()).toEqual(['Phòng Marketing'])

    choose('Giai đoạn', 'APPROVED')
    apply()
    expect(departments()).toEqual([])
    expect(screen.getByText('Không có phòng ban nào khớp bộ lọc.')).toBeInTheDocument()
  })

  it('filters FIN-30 Cost Centers by search, close status and remainder, and keeps filters after a detail visit', () => {
    renderFinance('period-close')
    const costCenters = () => rowsOf('Đóng kỳ').filter((code) => code?.startsWith('CC-'))
    expect(costCenters()).toHaveLength(6)

    choose('Phần dư', 'NONE')
    apply()
    expect(costCenters()).toEqual(['CC-MKT', 'CC-SAL', 'CC-COMPANY'])

    reset()
    search('Tìm kiếm trung tâm chi phí đóng kỳ', 'vận hành')
    apply()
    expect(costCenters()).toEqual(['CC-OPS'])

    reset()
    choose('Trạng thái chốt', 'BLOCKED')
    apply()
    expect(costCenters()).toEqual(['CC-OPS'])

    fireEvent.click(screen.getByRole('button', { name: 'Đóng kỳ CC-OPS' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Đóng kỳ Quý 3/2026 · CC-OPS' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Quay lại danh sách trung tâm chi phí' }))
    expect(costCenters()).toEqual(['CC-OPS'])
    expect(screen.getByLabelText('Trạng thái chốt')).toHaveValue('BLOCKED')

    choose('Trạng thái chốt', 'CLOSED')
    choose('Phần dư', 'HELD')
    apply()
    expect(costCenters()).toEqual([])
    expect(screen.getByText('Không có trung tâm chi phí nào khớp bộ lọc.')).toBeInTheDocument()
  })
})
