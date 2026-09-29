import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router'

import { setAppLanguage } from '~/shared/i18n/i18n'

import { ManagerDashboardPage } from './manager-dashboard-page'

function renderDashboard(url = '/manager/dashboard') {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <ManagerDashboardPage />
    </MemoryRouter>
  )
}

describe('Manager dashboard', () => {
  beforeEach(async () => {
    await setAppLanguage('en', false)
  })

  it('renders the Manager dashboard and exposes the chart data on demand', () => {
    renderDashboard()
    expect(screen.getByRole('heading', { level: 1, name: 'Manager Dashboard' })).toBeInTheDocument()
    const usage = screen.getByRole('region', { name: 'Team Software Usage Overview' })
    expect(within(usage).queryByRole('table')).not.toBeInTheDocument()
    fireEvent.click(within(usage).getByRole('button', { name: 'View details' }))
    expect(within(usage).getByRole('table')).toBeInTheDocument()
    expect(within(usage).getByRole('button')).toHaveAttribute('aria-expanded', 'true')
  })

  it('validates the date range and filters recent requests after applying it', () => {
    renderDashboard()
    fireEvent.click(screen.getByRole('button', { name: 'Date range' }))
    fireEvent.change(screen.getByLabelText('Start date'), { target: { value: '2025-05-21' } })
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }))
    expect(screen.getByRole('alert')).toHaveTextContent('End date must be on or after start date.')
    fireEvent.change(screen.getByLabelText('End date'), { target: { value: '2025-05-22' } })
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }))
    expect(screen.getByText('No sample requests in the selected date range.')).toBeInTheDocument()
    expect(screen.queryByText('New Access – Figma')).not.toBeInTheDocument()
  })

  it('falls back to the sample range for invalid URL dates', () => {
    renderDashboard('/manager/dashboard?start=2025-02-30&end=invalid')
    expect(screen.getByText('New Access – Figma')).toBeInTheDocument()
  })

  it('renders Vietnamese labels and localized numbers', async () => {
    await setAppLanguage('vi', false)
    renderDashboard()
    expect(screen.getByRole('heading', { level: 1, name: 'Bảng điều khiển quản lý' })).toBeInTheDocument()
    expect(screen.getAllByText('2,4 giờ')).toHaveLength(2)
    expect(document.title).toBe('Bảng điều khiển quản lý | SaaS-Sentry')
  })
})
