import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'

import { setAuthSession, clearAuthSession } from '../auth-session'
import { demoAccounts } from '../demo-accounts'
import { RoleGuard } from './role-guard'

describe('RoleGuard RBAC Security', () => {
  beforeEach(() => {
    clearAuthSession()
  })

  it('renders protected content when the user role matches the required role', () => {
    const itAdminAccount = demoAccounts.find((acc) => acc.role === 'it-admin')!
    setAuthSession(itAdminAccount)

    render(
      <MemoryRouter initialEntries={['/dashboard/it-admin']}>
        <RoleGuard requiredRole='it-admin'>
          <div data-testid='protected-content'>IT Admin Content</div>
        </RoleGuard>
      </MemoryRouter>
    )

    expect(screen.getByTestId('protected-content')).toBeInTheDocument()
    expect(screen.queryByText(/403/i)).not.toBeInTheDocument()
  })

  it('blocks access and displays 403 Forbidden when an employee tries to access super-admin', () => {
    const employeeAccount = demoAccounts.find((acc) => acc.role === 'employee')!
    setAuthSession(employeeAccount)

    render(
      <MemoryRouter initialEntries={['/dashboard/super-admin']}>
        <RoleGuard requiredRole='super-admin'>
          <div data-testid='protected-content'>Super Admin Confidential Content</div>
        </RoleGuard>
      </MemoryRouter>
    )

    // Confidential content must NOT be rendered
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    // 403 Forbidden UI must be rendered
    expect(screen.getByText(/403/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /forbiddenAction|Về trang tổng quan của tôi|Back to my dashboard/i })).toBeInTheDocument()
  })

  it('blocks access and displays 403 Forbidden when manager tries to access finance dashboard', () => {
    const managerAccount = demoAccounts.find((acc) => acc.role === 'manager')!
    setAuthSession(managerAccount)

    render(
      <MemoryRouter initialEntries={['/dashboard/finance']}>
        <RoleGuard requiredRole='finance'>
          <div data-testid='finance-content'>Finance Ledger Content</div>
        </RoleGuard>
      </MemoryRouter>
    )

    expect(screen.queryByTestId('finance-content')).not.toBeInTheDocument()
    expect(screen.getByText(/403/i)).toBeInTheDocument()
  })
})
