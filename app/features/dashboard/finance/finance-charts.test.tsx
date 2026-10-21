import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'

import { AppProviders } from '~/providers/app-providers'
import { setAppLanguage } from '~/shared/i18n/i18n'

import { DashboardPage } from '../dashboard-page'
import { resetAnnualBudgetStore } from './annual-budget-store'
import { resetOptimizationStore } from './optimization-store'

function renderFinance(tab: string) {
  return render(
    <MemoryRouter initialEntries={[`/?tab=${tab}`]}>
      <AppProviders>
        <DashboardPage role='finance' />
      </AppProviders>
    </MemoryRouter>
  )
}

describe('Finance column and donut charts', () => {
  beforeEach(async () => {
    localStorage.clear()
    localStorage.setItem('saas-sentry.language', 'vi')
    await setAppLanguage('vi', false)
    resetAnnualBudgetStore()
    resetOptimizationStore()
  })

  it('shows two column charts and two donuts on the forecast, following the assumptions', () => {
    renderFinance('cost-forecast')

    expect(screen.getByRole('img', { name: 'Chi phí đã cam kết theo tháng · Quý 4/2026' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'So sánh kịch bản' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Cơ cấu kịch bản cơ sở' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Tiết kiệm tiềm năng theo loại tối ưu' })).toBeInTheDocument()

    // The donut legend carries the values, so colour is never the only way to read it.
    expect(screen.getByText('Công cụ cho nhân sự mới')).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Nhân sự mới'), { target: { value: '0' } })
    const hiresRow = screen.getByText('Công cụ cho nhân sự mới').closest('li')
    expect(hiresRow).toHaveTextContent('0 ₫')
  })

  it('shows budget usage and allocation as donuts for the chosen department', () => {
    renderFinance('department-budget')

    expect(screen.getByRole('img', { name: 'Tình hình sử dụng ngân sách' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Phân bổ theo nhóm phần mềm' })).toBeInTheDocument()

    // Hovering a legend row shows that slice's details in the hole instead of a floating tooltip.
    const usage = screen.getByRole('img', { name: 'Tình hình sử dụng ngân sách' })
    const usedRow = screen
      .getAllByText('Đã sử dụng')
      .find((element) => element.closest('li'))
      ?.closest('li')
    expect(usedRow).toBeDefined()
    fireEvent.mouseEnter(usedRow!)
    expect(usage).toHaveTextContent('Đã sử dụng')
    expect(usage).toHaveTextContent('76%')
    fireEvent.mouseLeave(usedRow!)
    expect(usage).not.toHaveTextContent('76%')

    fireEvent.change(screen.getByLabelText('Chọn phòng ban'), { target: { value: 'CC-MKT' } })
    // Marketing has budget left to allocate, shown as its own neutral slice.
    expect(screen.getAllByText('Chưa phân bổ').length).toBeGreaterThan(0)
  })

  it('shows the overview spend donut details in the hole on hover', () => {
    renderFinance('overview')

    const donut = screen.getByRole('img', { name: 'Cơ cấu thực chi — Quý 4/2026' })
    expect(donut).toHaveTextContent('Tổng thực chi')
    const engRow = screen
      .getAllByText('CC-ENG')
      .find((element) => element.closest('li'))
      ?.closest('li')
    expect(engRow).toBeDefined()
    fireEvent.mouseEnter(engRow!)
    expect(donut).toHaveTextContent('CC-ENG')
    expect(donut).toHaveTextContent('45%')
    expect(donut).not.toHaveTextContent('Tổng thực chi')
    fireEvent.mouseLeave(engRow!)
    expect(donut).toHaveTextContent('Tổng thực chi')
  })
})
