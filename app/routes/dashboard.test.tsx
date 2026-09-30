import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'

import { AppProviders } from '~/providers/app-providers'
import { setAppLanguage } from '~/shared/i18n/i18n'

import DashboardRoute from './dashboard'

function renderRoute(role: string) {
  const routeElement = DashboardRoute({ params: { role } } as never)

  return render(
    <MemoryRouter>
      <AppProviders>{routeElement}</AppProviders>
    </MemoryRouter>
  )
}

describe('dashboard route', () => {
  beforeEach(async () => {
    localStorage.clear()
    localStorage.setItem('saas-sentry.language', 'vi')
    await setAppLanguage('vi', false)
  })

  it('renders the shared dashboard for a valid human role', () => {
    renderRoute('it-admin')

    expect(screen.getByRole('heading', { level: 1, name: 'Tổng quan' })).toBeInTheDocument()
    expect(screen.getByTestId('dashboard-role')).toHaveTextContent('Quản trị viên CNTT')
  })

  it('renders the existing not-found experience for an invalid role', () => {
    renderRoute('automation-service')

    expect(screen.getByRole('heading', { name: 'Không tìm thấy trang' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Về trang chính' })).toHaveAttribute('href', '/')
  })
})
