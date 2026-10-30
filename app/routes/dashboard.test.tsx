import { act, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { AxiosHeaders } from 'axios'

import { AppProviders } from '~/providers/app-providers'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { apiClient } from '~/shared/api/axios-client'
import { createQueryClient } from '~/shared/api/query-client'
import { clearAuthSession, configureAuthQueryClient, login } from '~/features/auth/auth-session'

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
  const previousAdapter = apiClient.defaults.adapter

  beforeAll(async () => {
    // Transform the large workspace before the test; browser checks cover deferred downloading.
    await import('~/features/dashboard/dashboard-page')
  }, 30_000)

  afterEach(() => {
    apiClient.defaults.adapter = previousAdapter
    configureAuthQueryClient(null)
  })

  beforeEach(async () => {
    clearAuthSession()
    sessionStorage.clear()
    localStorage.clear()
    localStorage.setItem('saas-sentry.language', 'vi')
    await setAppLanguage('vi', false)
  })

  it('renders the shared dashboard for an authenticated role', async () => {
    configureAuthQueryClient(createQueryClient())
    apiClient.defaults.adapter = async (config) => ({
      config,
      headers: new AxiosHeaders(),
      status: 200,
      statusText: 'OK',
      data: config.url?.endsWith('/me')
        ? {
            success: true,
            message: 'ME.RETRIEVED',
            data: {
              appUserId: 'u1',
              loginEmail: 'it@example.com',
              employee: { id: 'e1', employeeCode: '001', fullName: 'IT Admin', department: null, jobTitle: null },
              roles: { direct: ['IT_ADMIN'], derived: [], effective: ['IT_ADMIN'] },
              selfServiceOnly: false
            }
          }
        : {
            success: true,
            message: 'AUTH.LOGGED_IN',
            data: {
              accessToken: 'access',
              refreshToken: 'refresh',
              tokenType: 'Bearer',
              expiresAt: new Date(Date.now() + 600_000).toISOString(),
              refreshExpiresAt: new Date(Date.now() + 3_600_000).toISOString()
            }
          }
    })
    await login('it@example.com', 'secret')
    renderRoute('it-admin')
    await act(() => vi.dynamicImportSettled())

    expect(await screen.findByRole('heading', { level: 1, name: 'Tổng quan' })).toBeInTheDocument()
    expect(screen.getByTestId('dashboard-role')).toHaveTextContent('Quản trị viên CNTT')
  })

  it('renders the existing not-found experience for an invalid role', () => {
    renderRoute('automation-service')

    expect(screen.getByRole('heading', { name: 'Không tìm thấy trang' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Về trang chính' })).toHaveAttribute('href', '/')
  })
})
