import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'

import { AppProviders } from '~/providers/app-providers'
import { setAppLanguage } from '~/shared/i18n/i18n'

import { DashboardPage } from '../dashboard-page'
import { resetAnnualBudgetStore } from './annual-budget-store'

function renderFinance(initialEntry: string) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <AppProviders>
        <DashboardPage role='finance' />
      </AppProviders>
    </MemoryRouter>
  )
}

describe('Finance budget by department', () => {
  beforeEach(async () => {
    localStorage.clear()
    localStorage.setItem('saas-sentry.language', 'vi')
    await setAppLanguage('vi', false)
    resetAnnualBudgetStore()
  })

  it('shows budget, allocation, commitments, requests and exceptions of the chosen department at once', () => {
    renderFinance('/?tab=department-budget')

    expect(screen.getByRole('heading', { level: 1, name: 'Ngân sách Phòng Kỹ thuật' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Phân bổ theo nhóm phần mềm' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Cam kết chi chưa thanh toán' })).toBeInTheDocument()
    expect(screen.getByText('CMT-2026-044')).toBeInTheDocument()
    expect(screen.getByText('REQ-2026-099')).toBeInTheDocument()

    const picker = screen.getByRole('combobox', { name: 'Chọn phòng ban' })
    expect(within(picker).getByRole('option', { name: 'Phòng Vận hành' })).toHaveValue('CC-OPS')
    fireEvent.change(picker, { target: { value: 'CC-OPS' } })
    expect(screen.getByRole('heading', { level: 1, name: 'Ngân sách Phòng Vận hành' })).toBeInTheDocument()
    expect(screen.getByText('REQ-2026-106')).toBeInTheDocument()
    expect(screen.queryByText('CMT-2026-044')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /REQ-2026-106/ }))
    expect(
      within(screen.getByRole('navigation', { name: 'Điều hướng dashboard' })).getByRole('button', { current: 'page' })
    ).toHaveTextContent('Ngoại lệ ngân sách')
  })
})
