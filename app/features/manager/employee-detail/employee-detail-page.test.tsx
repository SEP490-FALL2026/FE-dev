import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router'

import { setAppLanguage } from '~/shared/i18n/i18n'

import { EmployeeDetailPage } from './employee-detail-page'

function showEmployee(id = '1', query = '') {
  render(
    <MemoryRouter initialEntries={[`/manager/my-team/${id}${query}`]}>
      <EmployeeDetailPage employeeId={id} />
    </MemoryRouter>
  )
}

describe('Manager employee detail', () => {
  beforeEach(async () => {
    await setAppLanguage('en', false)
  })

  it('renders the selected employee and computes the monthly total from four assigned licenses', () => {
    showEmployee()
    expect(screen.getByRole('heading', { level: 1, name: 'Employee Detail' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Nguyễn Văn A' })).toBeInTheDocument()
    expect(within(screen.getByRole('table', { name: 'Assigned Software' })).getAllByRole('row')).toHaveLength(5)
    expect(screen.getByText('$57.99')).toBeInTheDocument()
    expect(screen.getByText(/Employee ID: EMP-0245/)).toBeInTheDocument()
  })

  it('changes tabs with the keyboard and renders the supplied request without enabling mutations', () => {
    showEmployee()
    const assigned = screen.getByRole('tab', { name: 'Assigned Software' })
    fireEvent.keyDown(assigned, { key: 'ArrowRight' })
    const requestTab = screen.getByRole('tab', { name: 'Requests' })
    expect(requestTab).toHaveAttribute('aria-selected', 'true')
    expect(requestTab).toHaveFocus()
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Jira Software')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('The design provides 1 request out of 6 all-time requests.')
    expect(
      screen
        .getAllByRole('link', { name: 'Create Request for Employee' })
        .every((link) => link.getAttribute('href') === '/manager/create-request?employee=1')
    ).toBe(true)
    fireEvent.keyDown(requestTab, { key: 'End' })
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Slack Pro was renewed')
  })

  it('loads a requested tab directly and preserves team filters in the return link', () => {
    showEmployee('1', '?tab=accessReview&department=Product+Design&page=2')
    expect(screen.getByRole('tab', { name: 'Access Review' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Completed on Feb 28, 2026')
    expect(screen.getByRole('link', { name: 'My Team' })).toHaveAttribute(
      'href',
      '/manager/my-team?department=Product+Design&page=2'
    )
  })

  it('does not attach the first employee software records to another employee', () => {
    showEmployee('6')
    expect(screen.getByRole('heading', { name: 'Vũ Hải' })).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Detailed records for this employee were not included')
    expect(screen.queryByText('EMP-0245')).not.toBeInTheDocument()
  })

  it('shows a localized missing employee state for an unknown ID', async () => {
    await setAppLanguage('vi', false)
    showEmployee('unknown')
    expect(screen.getByRole('heading', { name: 'Không tìm thấy nhân viên' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Về nhóm của tôi' })).toHaveAttribute('href', '/manager/my-team')
  })

  it('localizes currency, dates, and the document title in Vietnamese', async () => {
    await setAppLanguage('vi', false)
    showEmployee()
    expect(screen.getByRole('heading', { level: 1, name: 'Chi tiết nhân viên' })).toBeInTheDocument()
    const costCard = screen.getByRole('heading', { name: 'Chi phí hàng tháng' }).closest('section')
    expect(costCard).toHaveTextContent(
      new Intl.NumberFormat('vi', { style: 'currency', currency: 'USD' }).format(57.99).replace(/\s/g, ' ')
    )
    expect(document.title).toBe('Nguyễn Văn A | Chi tiết nhân viên | SaaS-Sentry')
  })
})
