import { fireEvent, render, screen } from '@testing-library/react'
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

function openOpsProposal() {
  renderDashboard('finance', '/?tab=annual-proposals')
  expect(screen.getByRole('heading', { level: 1, name: 'Đề xuất ngân sách năm 2027' })).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Xem đề xuất của Phòng Vận hành' }))
  expect(screen.getByRole('heading', { level: 1, name: 'Phòng Vận hành · Năm tài chính 2027' })).toBeInTheDocument()
}

describe('Finance annual budget proposals and negotiation', () => {
  beforeEach(async () => {
    localStorage.clear()
    localStorage.setItem('saas-sentry.language', 'vi')
    await setAppLanguage('vi', false)
    resetAnnualBudgetStore()
  })

  it('requires a message before asking the Manager for more information', () => {
    openOpsProposal()

    fireEvent.click(screen.getByRole('button', { name: 'Yêu cầu bổ sung thông tin' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Nhập nội dung cần Manager bổ sung.')

    fireEvent.change(screen.getByLabelText('Nội dung cần Manager bổ sung'), {
      target: { value: 'Bổ sung báo giá PagerDuty.' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Yêu cầu bổ sung thông tin' }))

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByText(/Đã gửi yêu cầu bổ sung cho Manager/)).toBeInTheDocument()
    expect(
      screen.getByText(/Tài chính đã yêu cầu bổ sung ngày \d{2}\/\d{2}\/\d{4}: Bổ sung báo giá PagerDuty\./)
    ).toBeInTheDocument()
    expect(screen.getByText('Chờ Manager bổ sung')).toBeInTheDocument()
  })

  it('moves a proposal to analysis and completes it once every cut has a reason', () => {
    openOpsProposal()

    fireEvent.click(screen.getByRole('button', { name: 'Chuyển sang phân tích' }))
    expect(screen.getByRole('heading', { name: 'Thương lượng từng dòng SaaS' })).toBeInTheDocument()
    expect(screen.getByText('Đang phân tích')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Số Tài chính đề xuất cho Datadog APM Pro (₫)'), {
      target: { value: '72000000' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Lưu dòng Datadog APM Pro' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Bắt buộc nêu lý do khi số đề xuất thấp hơn Manager yêu cầu.')

    fireEvent.change(screen.getByLabelText('Lý do cắt giảm Datadog APM Pro'), {
      target: { value: 'Chỉ 5 máy chủ đang được giám sát.' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Lưu dòng Datadog APM Pro' }))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Hoàn tất phân tích' }))
    expect(screen.getByText('Đã phân tích xong')).toBeInTheDocument()
    expect(screen.getByText(/Đã hoàn tất phân tích\. Xem tổng hợp/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Hoàn tất phân tích' })).not.toBeInTheDocument()
  })
})
