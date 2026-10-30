import { AxiosHeaders } from 'axios'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { apiClient } from '~/shared/api/axios-client'
import { createQueryClient } from '~/shared/api/query-client'
import { AppProviders } from '~/providers/app-providers'
import { clearAuthSession, configureAuthQueryClient, login } from '../auth-session'
import { RoleGuard } from './role-guard'

function renderGuard(role: 'employee' | 'super-admin') {
  return render(
    <MemoryRouter initialEntries={[`/dashboard/${role}`]}>
      <AppProviders>
        <Routes>
          <Route
            path='/dashboard/:role'
            element={
              <RoleGuard requiredRole={role}>
                <output data-testid='protected-workspace' />
              </RoleGuard>
            }
          />
          <Route path='/login' element={<output data-testid='login-target' />} />
        </Routes>
      </AppProviders>
    </MemoryRouter>
  )
}

describe('RoleGuard', () => {
  const previousAdapter = apiClient.defaults.adapter

  beforeEach(() => {
    clearAuthSession()
    sessionStorage.clear()
    configureAuthQueryClient(createQueryClient())
  })
  afterEach(() => {
    apiClient.defaults.adapter = previousAdapter
    configureAuthQueryClient(null)
  })

  it('redirects a guest to login without rendering protected content', () => {
    renderGuard('employee')
    expect(screen.getByTestId('login-target')).toBeInTheDocument()
    expect(screen.queryByTestId('protected-workspace')).not.toBeInTheDocument()
  })

  it('accepts a role in /me effective roles and blocks another role', async () => {
    apiClient.defaults.adapter = async (config) => ({
      config,
      data: config.url?.endsWith('/me')
        ? {
            success: true,
            message: 'ME.RETRIEVED',
            data: {
              appUserId: 'u1',
              loginEmail: 'person@example.com',
              employee: { id: 'e1', employeeCode: '001', fullName: 'Person', department: null, jobTitle: null },
              roles: { direct: ['EMPLOYEE'], derived: [], effective: ['EMPLOYEE'] },
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
          },
      headers: new AxiosHeaders(),
      status: 200,
      statusText: 'OK'
    })
    await login('person@example.com', 'secret')

    const allowed = renderGuard('employee')
    expect(screen.getByTestId('protected-workspace')).toBeInTheDocument()
    allowed.unmount()
    renderGuard('super-admin')
    expect(screen.getByText(/403/i)).toBeInTheDocument()
    expect(screen.queryByTestId('protected-workspace')).not.toBeInTheDocument()
  })
})
