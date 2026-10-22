import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'

import { AppProviders } from '~/providers/app-providers'
import { setAppLanguage } from '~/shared/i18n/i18n'

import { DashboardPage } from '../dashboard-page'
import { resetAnnualBudgetStore } from './annual-budget-store'

function renderBudgetCheck() {
  return render(
    <MemoryRouter initialEntries={['/?tab=budget-check']}>
      <AppProviders>
        <DashboardPage role='finance' />
      </AppProviders>
    </MemoryRouter>
  )
}

const requestCodes = () => screen.getAllByText(/^REQ-2026-\d{3}$/).map((element) => element.textContent)
const apply = () => fireEvent.click(screen.getByRole('button', { name: 'Áp dụng bộ lọc' }))

describe('Finance budget check filters', () => {
  beforeEach(async () => {
    localStorage.clear()
    localStorage.setItem('saas-sentry.language', 'vi')
    await setAppLanguage('vi', false)
    resetAnnualBudgetStore()
  })

  it('filters by search, cost center, next step and exception type on apply', () => {
    renderBudgetCheck()
    expect(requestCodes()).toHaveLength(8)

    fireEvent.change(screen.getByLabelText('Trung tâm chi phí / Phòng ban'), { target: { value: 'CC-ENG' } })
    expect(requestCodes()).toHaveLength(8)
    apply()
    expect(requestCodes()).toEqual(['REQ-2026-097', 'REQ-2026-099', 'REQ-2026-078'])

    fireEvent.change(screen.getByRole('searchbox', { name: 'Tìm kiếm yêu cầu' }), { target: { value: 'hoàng anh' } })
    apply()
    expect(requestCodes()).toEqual(['REQ-2026-099', 'REQ-2026-078'])

    fireEvent.click(screen.getByRole('button', { name: 'Đặt lại' }))
    expect(requestCodes()).toHaveLength(8)

    fireEvent.change(screen.getByRole('searchbox', { name: 'Tìm kiếm yêu cầu' }), { target: { value: 'figma' } })
    apply()
    expect(requestCodes()).toEqual(['REQ-2026-089'])

    fireEvent.change(screen.getByRole('searchbox', { name: 'Tìm kiếm yêu cầu' }), { target: { value: 'REQ-2026-10' } })
    apply()
    expect(requestCodes()).toEqual(['REQ-2026-107', 'REQ-2026-106', 'REQ-2026-104', 'REQ-2026-101'])

    fireEvent.change(screen.getByLabelText('Bước tiếp theo'), { target: { value: 'NEEDS_HANDLING' } })
    apply()
    expect(requestCodes()).toEqual(['REQ-2026-107', 'REQ-2026-106', 'REQ-2026-101'])

    fireEvent.change(screen.getByLabelText('Loại ngoại lệ'), { target: { value: 'CC_EXPIRED' } })
    apply()
    expect(requestCodes()).toEqual(['REQ-2026-107'])
  })

  it('shows resolved exceptions separately and nothing for a year without checks', () => {
    renderBudgetCheck()

    fireEvent.change(screen.getByLabelText('Bước tiếp theo'), { target: { value: 'RESOLVED' } })
    apply()
    expect(requestCodes()).toEqual(['REQ-2026-099'])

    fireEvent.click(screen.getByRole('button', { name: 'Đặt lại' }))
    fireEvent.change(screen.getByLabelText('Bước tiếp theo'), { target: { value: 'FORWARDED' } })
    apply()
    expect(requestCodes()).toHaveLength(4)
    expect(screen.getByLabelText('Năm ngân sách')).toHaveValue('')
  })
})
