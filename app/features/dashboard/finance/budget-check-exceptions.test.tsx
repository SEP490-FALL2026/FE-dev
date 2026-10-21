import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'

import type { UserRole } from '~/entities/user-role/user-role'
import { AppProviders } from '~/providers/app-providers'
import { setAppLanguage } from '~/shared/i18n/i18n'

import { DashboardPage } from '../dashboard-page'
import { resetAnnualBudgetStore } from './annual-budget-store'

function renderDashboard(role: UserRole, initialEntry: string) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <AppProviders>
        <DashboardPage role={role} />
      </AppProviders>
    </MemoryRouter>
  )
}

describe('Finance budget check and budget exceptions', () => {
  beforeEach(async () => {
    localStorage.clear()
    localStorage.setItem('saas-sentry.language', 'vi')
    await setAppLanguage('vi', false)
    resetAnnualBudgetStore()
  })

  it('forwards requests within budget automatically and opens a failed check as an exception', () => {
    renderDashboard('finance', '/?tab=budget-check')

    expect(
      screen.getByRole('heading', { level: 1, name: 'Kiểm tra ngân sách trước khi gửi duyệt chi' })
    ).toBeInTheDocument()

    const passedRow = screen.getByText('REQ-2026-078').closest('tr')
    expect(passedRow).not.toBeNull()
    const row = within(passedRow as HTMLElement)
    expect(row.getByText('Đã chuyển Người duyệt chi')).toBeInTheDocument()
    expect(row.queryByRole('button')).not.toBeInTheDocument()

    fireEvent.change(screen.getByRole('combobox', { name: 'Loại ngoại lệ' }), {
      target: { value: 'INSUFFICIENT' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Áp dụng bộ lọc' }))
    expect(screen.queryByText('REQ-2026-078')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Xử lý ngoại lệ REQ-2026-106' }))
    expect(screen.getByRole('heading', { level: 1, name: 'PagerDuty Business · 12 suất' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Ghi nhận xử lý' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Bắt buộc nhập ghi chú xử lý.')
  })

  it('moves the request on a retired cost center to its replacement and updates the list', () => {
    renderDashboard('finance', '/?tab=budget-exceptions')

    expect(screen.getByRole('combobox', { name: 'Trạng thái' })).toHaveValue('open')
    expect(screen.getByText('3 mục đang hiển thị · 3 đang mở · 2 đã xử lý')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Xem chi tiết ngoại lệ REQ-2026-107' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Maze Starter' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('radio', { name: /Chuyển trung tâm chi phí/ }))
    expect(screen.getByLabelText('Trung tâm chi phí mới')).toHaveValue('CC-DES')
    fireEvent.change(screen.getByLabelText('Ghi chú xử lý'), {
      target: { value: 'CC-PRD đã gộp vào CC-DES, chuyển sang mã mới.' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Ghi nhận xử lý' }))

    expect(screen.getByRole('status')).toHaveTextContent('Đã ghi nhận xử lý ngoại lệ REQ-2026-107.')
    expect(screen.getByText('Chuyển sang CC-DES')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Quay lại danh sách' }))
    expect(screen.getByText('2 mục đang hiển thị · 2 đang mở · 3 đã xử lý')).toBeInTheDocument()
    expect(screen.queryByText('REQ-2026-107')).not.toBeInTheDocument()
  })
})
