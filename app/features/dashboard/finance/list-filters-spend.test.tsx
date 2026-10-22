import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'

import { AppProviders } from '~/providers/app-providers'
import { setAppLanguage } from '~/shared/i18n/i18n'

import { DashboardPage } from '../dashboard-page'
import { resetAnnualBudgetStore } from './annual-budget-store'

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
const codesOf = (pattern: RegExp, prefix: string) =>
  screen
    .queryAllByRole('button', { name: pattern })
    .map((button) => button.getAttribute('aria-label')?.replace(prefix, ''))
const search = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('searchbox', { name }), { target: { value } })
const choose = (label: string, value: string) => fireEvent.change(screen.getByLabelText(label), { target: { value } })

describe('Finance spend list filters', () => {
  beforeEach(async () => {
    localStorage.clear()
    localStorage.setItem('saas-sentry.language', 'vi')
    await setAppLanguage('vi', false)
    resetAnnualBudgetStore()
  })

  it('filters FIN-05 budget questions by search, cost center, status and opinion on apply', () => {
    renderTab('budget-questions')
    const questions = () => codesOf(/^Xem chi tiết REQ-/, 'Xem chi tiết ')
    expect(questions()).toHaveLength(5)

    search('Tìm kiếm yêu cầu ngân sách', 'notion ai')
    expect(questions()).toHaveLength(5)
    apply()
    expect(questions()).toEqual(['REQ-2026-097'])

    reset()
    expect(questions()).toHaveLength(5)
    expect(screen.getByRole('searchbox', { name: 'Tìm kiếm yêu cầu ngân sách' })).toHaveValue('')

    choose('Trung tâm chi phí', 'CC-MKT')
    apply()
    expect(questions()).toEqual(['REQ-2026-101'])

    reset()
    choose('Ý kiến ngân sách', 'WITHIN')
    apply()
    expect(questions()).toEqual(['REQ-2026-078'])

    choose('Ý kiến ngân sách', 'OVER')
    apply()
    expect(questions()).toEqual([])
    expect(screen.getByText('Không có yêu cầu nào.')).toBeInTheDocument()

    reset()
    choose('Trạng thái', 'CLOSED_CANCELLED')
    apply()
    expect(questions()).toEqual(['REQ-2026-084'])
  })

  it('filters FIN-20 commitments by search, cost center, budget and due state', () => {
    renderTab('commitments')
    const commitments = () => codesOf(/^Ghi nhận CMT-/, 'Ghi nhận ')
    expect(commitments()).toHaveLength(3)

    choose('Ngân sách', 'missing')
    expect(commitments()).toHaveLength(3)
    apply()
    expect(commitments()).toEqual(['CMT-2026-049', 'CMT-2026-050'])

    search('Tìm kiếm cam kết chi', 'semrush')
    apply()
    expect(commitments()).toEqual(['CMT-2026-050'])

    reset()
    expect(commitments()).toHaveLength(3)

    choose('Trung tâm chi phí', 'CC-ENG')
    apply()
    expect(commitments()).toEqual(['CMT-2026-051'])

    reset()
    choose('Hạn ghi nhận', 'overdue')
    apply()
    expect(commitments()).toEqual([])
    expect(screen.getByText('Không có cam kết nào khớp bộ lọc.')).toBeInTheDocument()

    choose('Hạn ghi nhận', 'onTime')
    apply()
    expect(commitments()).toHaveLength(3)
  })

  it('filters FIN-44 budget exceptions, starting from the open ones', () => {
    renderTab('budget-exceptions')
    const exceptions = () => codesOf(/^Xem chi tiết ngoại lệ REQ-/, 'Xem chi tiết ngoại lệ ')
    expect(screen.getByLabelText('Trạng thái')).toHaveValue('open')
    expect(exceptions()).toEqual(['REQ-2026-106', 'REQ-2026-107', 'REQ-2026-101'])

    choose('Trạng thái', 'all')
    expect(exceptions()).toHaveLength(3)
    apply()
    expect(exceptions()).toHaveLength(5)
    expect(screen.getByText('5 mục đang hiển thị · 3 đang mở · 2 đã xử lý')).toBeInTheDocument()

    choose('Loại ngoại lệ', 'CC_EXPIRED')
    apply()
    expect(exceptions()).toEqual(['REQ-2026-107', 'REQ-2026-088'])

    choose('Phương án xử lý', 'TRANSFER_COST_CENTER')
    apply()
    expect(exceptions()).toEqual(['REQ-2026-088'])

    reset()
    expect(screen.getByLabelText('Trạng thái')).toHaveValue('open')
    expect(exceptions()).toHaveLength(3)

    search('Tìm kiếm ngoại lệ ngân sách', 'snyk')
    apply()
    expect(exceptions()).toEqual([])
    expect(screen.getByText('Không có ngoại lệ nào khớp bộ lọc.')).toBeInTheDocument()

    choose('Trạng thái', 'resolved')
    choose('Trung tâm chi phí', 'CC-ENG')
    apply()
    expect(exceptions()).toEqual(['REQ-2026-099'])
  })

  it('filters FIN-07 charge exceptions by search, reason and status', () => {
    renderTab('charge-exceptions')
    const charges = () => codesOf(/^Xem chi tiết CHG-/, 'Xem chi tiết ')
    expect(charges()).toHaveLength(5)

    search('Tìm kiếm ngoại lệ khoản chi', '3341')
    expect(charges()).toHaveLength(5)
    apply()
    expect(charges()).toEqual(['CHG-0998', 'CHG-0979'])

    search('Tìm kiếm ngoại lệ khoản chi', 'xác minh')
    apply()
    expect(charges()).toEqual(['CHG-1003'])

    reset()
    expect(charges()).toHaveLength(5)

    choose('Lý do', 'NO_BASIS')
    apply()
    expect(charges()).toEqual(['CHG-1003', 'CHG-0979'])

    choose('Trạng thái', 'SENT_TO_APPROVER')
    apply()
    expect(charges()).toEqual(['CHG-0979'])

    choose('Trạng thái', 'BASIS_LINKED')
    apply()
    expect(charges()).toEqual([])
    expect(screen.getByText('Không có mục nào.')).toBeInTheDocument()

    reset()
    choose('Trạng thái', 'BASIS_LINKED')
    apply()
    expect(charges()).toEqual(['CHG-0985'])
  })
})
