import { act, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AxiosHeaders } from 'axios'

import { AppProviders } from '~/providers/app-providers'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { apiClient } from '~/shared/api/axios-client'
import { createQueryClient } from '~/shared/api/query-client'
import { clearAuthSession, configureAuthQueryClient, login } from '~/features/auth/auth-session'

import DashboardRoute from './dashboard'
// Pre-transform the workspace outside test timeouts; browser tests verify deferred downloading.
import '~/features/dashboard/dashboard-page'
import '~/features/dashboard/it-admin/it-admin-screen'

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
              managerScope: null,
              appUserId: 'u1',
              loginEmail: 'it@example.com',
              employee: {
                unplaced: false,
                id: 'e1',
                employeeCode: '001',
                fullName: 'IT Admin',
                department: null,
                jobTitle: null
              },
              roles: ['IT_ADMIN'],
              selfServiceOnly: false
            }
          }
        : config.url?.includes('/auth/')
          ? {
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
          : config.url?.endsWith('/dashboards/it-admin')
            ? {
                success: true,
                message: 'DASHBOARD.RETRIEVED',
                data: {
                  asOf: '2026-11-03',
                  scope: { departments: 1 },
                  sections: Object.fromEntries(
                    [
                      'grantTasks',
                      'revocationTasks',
                      'saasIssues',
                      'offboardingHandovers',
                      'licenseKeys',
                      'termsToReview',
                      'cancellationDeadlines',
                      'discrepancies',
                      'unconfirmedDevices'
                    ].map((key) => [
                      key,
                      { state: 'NOT_AVAILABLE', count: null, sourceOperationId: null, reason: 'USAGE_NOT_DELIVERED' }
                    ])
                  )
                }
              }
            : {
                success: true,
                message: 'TEST.LISTED',
                data: { items: [], pagination: { page: 1, pageSize: 1, totalItems: 0, totalPages: 0 } }
              }
    })
    await login('it@example.com', 'secret')
    renderRoute('it-admin')
    await act(() => vi.dynamicImportSettled())

    expect(await screen.findByRole('heading', { level: 1, name: 'Trung tâm điều hành IT' })).toBeInTheDocument()
    expect(screen.getByTestId('dashboard-role')).toHaveTextContent('Quản trị viên CNTT')
  })

  it('renders the existing not-found experience for an invalid role', () => {
    renderRoute('automation-service')

    expect(screen.getByRole('heading', { name: 'Không tìm thấy trang' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Về trang chính' })).toHaveAttribute('href', '/')
  })
})
