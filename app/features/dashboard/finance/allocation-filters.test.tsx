import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'

import { AppProviders } from '~/providers/app-providers'
import { setAppLanguage } from '~/shared/i18n/i18n'

import { DashboardPage } from '../dashboard-page'
import { resetAnnualBudgetStore } from './annual-budget-store'

function renderAllocation() {
  return render(
    <MemoryRouter initialEntries={['/?tab=budget-allocation']}>
      <AppProviders>
        <DashboardPage role='finance' />
      </AppProviders>
    </MemoryRouter>
  )
}

describe('Finance budget allocation filters', () => {
  beforeEach(async () => {
    localStorage.clear()
    localStorage.setItem('saas-sentry.language', 'vi')
    await setAppLanguage('vi', false)
    resetAnnualBudgetStore()
  })

  it('applies the filters only on submit and resets them', () => {
    renderAllocation()
    const companyTable = () => screen.getAllByRole('table')[0]
    const codes = () =>
      within(companyTable())
        .getAllByRole('row')
        .slice(1)
        .map((row) => row.querySelector('td p')?.textContent)

    expect(codes()).toHaveLength(6)

    fireEvent.change(screen.getByLabelText('Trạng thái phân bổ'), { target: { value: 'PARTIAL' } })
    expect(codes()).toHaveLength(6)
    fireEvent.click(screen.getByRole('button', { name: 'Áp dụng bộ lọc' }))
    expect(codes()).toEqual(['CC-MKT', 'CC-SAL'])

    fireEvent.change(screen.getByLabelText('Phòng ban'), { target: { value: 'CC-SAL' } })
    fireEvent.click(screen.getByRole('button', { name: 'Áp dụng bộ lọc' }))
    expect(codes()).toEqual(['CC-SAL'])
    expect(screen.getByRole('heading', { name: 'Phân bổ theo nhóm chi phí SaaS · CC-SAL' })).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Trạng thái ngân sách'), { target: { value: 'EXPIRED' } })
    fireEvent.click(screen.getByRole('button', { name: 'Áp dụng bộ lọc' }))
    expect(screen.getByText('Không có phòng ban phù hợp bộ lọc.')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Đặt lại' }))
    expect(codes()).toHaveLength(6)
    expect(screen.getByLabelText('Phòng ban')).toHaveValue('')
  })

  it('explains that a year without an approved budget cannot be allocated', () => {
    renderAllocation()

    fireEvent.change(screen.getByLabelText('Năm ngân sách'), { target: { value: '2027' } })
    fireEvent.click(screen.getByRole('button', { name: 'Áp dụng bộ lọc' }))

    expect(screen.getByText(/Năm 2027 \(Tài chính đang xem xét\) chưa có ngân sách đã duyệt/)).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })
})
