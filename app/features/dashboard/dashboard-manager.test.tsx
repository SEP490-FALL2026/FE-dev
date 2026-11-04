import { managerReadHandlers } from '../../../test/fixtures/manager-integration'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeAll, afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

import type { UserRole } from '~/entities/user-role/user-role'
import { AppProviders } from '~/providers/app-providers'
import { setAppLanguage } from '~/shared/i18n/i18n'

import { DashboardPage } from './dashboard-page'
// Pre-transform lazy code outside assertion timeouts; production network tests cover deferred downloads.
import './manager/manager-screen'
import './employee/employee-screen'
import { managerProfile } from '../../../test/fixtures/manager-api'
import { pageResponse } from '../../../test/fixtures/employee-api'

const server = setupServer(
  ...managerReadHandlers,
  http.get('*/api/v1/me', () =>
    HttpResponse.json({
      success: true,
      data: {
        managerScope: null,
        appUserId: 'test',
        loginEmail: 'employee@example.test',
        employee: {
          unplaced: false,
          id: 'test',
          employeeCode: 'TEST',
          fullName: 'Test Employee',
          department: null,
          jobTitle: null
        },
        roles: ['EMPLOYEE'],
        selfServiceOnly: false
      }
    })
  ),
  http.get('*/api/v1/notifications/unread-count', () => HttpResponse.json({ success: true, data: { unread: 0 } })),
  http.get('*/api/v1/spend-queue', () => HttpResponse.json(pageResponse([]))),
  http.get('*/api/v1/transfer-reviews', () => HttpResponse.json(pageResponse([]))),
  http.get('*/api/v1/handover-duties', () =>
    HttpResponse.json({
      success: true,
      data: { items: [], pagination: { page: 1, pageSize: 20, totalItems: 0, totalPages: 0 } }
    })
  ),
  http.get('*/api/v1/access-requests/drafts', () =>
    HttpResponse.json({
      success: true,
      data: { items: [], pagination: { page: 1, pageSize: 20, totalItems: 0, totalPages: 0 } }
    })
  ),
  http.get('*/api/v1/onboarding-checklist', () => HttpResponse.json({ success: true, data: { steps: [] } })),
  http.get('*/api/v1/super-admin-watch', () =>
    HttpResponse.json({ success: true, data: { status: 'HEALTHY', reasons: {}, warnings: {}, holder: null } })
  ),
  http.get('*/api/v1/app-users', () =>
    HttpResponse.json({
      success: true,
      data: { items: [], pagination: { page: 1, pageSize: 20, totalItems: 0, totalPages: 0 } }
    })
  )
)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

const roleLabels: Record<UserRole, string> = {
  employee: 'Nhân viên',
  finance: 'Tài chính',
  'it-admin': 'Quản trị viên CNTT',
  manager: 'Quản lý trực tiếp',
  'spending-approver': 'Người duyệt chi',
  'super-admin': 'Quản trị hệ thống'
}

async function renderDashboard(role: UserRole, initialEntry = '/') {
  const view = render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <AppProviders>
        <DashboardPage role={role} />
      </AppProviders>
    </MemoryRouter>
  )
  await act(() => vi.dynamicImportSettled())
  return view
}

describe('Manager dashboard API navigation', () => {
  beforeEach(async () => {
    localStorage.clear()
    localStorage.setItem('saas-sentry.language', 'vi')
    await setAppLanguage('vi', false)
  })

  it('renders the manager dashboard shell and navigates live tabs', async () => {
    server.use(http.get('*/api/v1/me', () => HttpResponse.json({ success: true, data: managerProfile })))
    await renderDashboard('manager')
    expect(await screen.findByRole('heading', { level: 1, name: 'Tổng quan' })).toBeInTheDocument()
    const nav = screen.getByRole('navigation', { name: 'Điều hướng dashboard' })
    expect(screen.getByTestId('dashboard-role')).toHaveTextContent(roleLabels.manager)
    const members = within(nav).getByRole('button', { name: 'Nhân sự phòng ban' })
    fireEvent.click(members)
    expect(members).toHaveAttribute('aria-current', 'page')
    expect(screen.getByLabelText('ID phòng ban')).toBeInTheDocument()
    fireEvent.click(within(nav).getByRole('button', { name: 'Duyệt nhu cầu' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Duyệt nhu cầu' })).toBeInTheDocument()
    expect(screen.getByLabelText('ID yêu cầu')).toBeInTheDocument()
    expect(screen.queryByText('REQ-M01')).not.toBeInTheDocument()
  })
  it('opens the annual budget only from Manager navigation', async () => {
    await setAppLanguage('en', true)
    server.use(
      http.get('*/api/v1/me', () => HttpResponse.json({ success: true, data: managerProfile })),
      http.get('*/api/v1/budget-proposals', () => HttpResponse.json(pageResponse([]))),
      http.get('*/api/v1/budgets/mine', () => HttpResponse.json({ success: true, data: { budget: null } }))
    )
    const view = await renderDashboard('manager')
    fireEvent.click(screen.getByRole('button', { name: 'Annual budget' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Annual budget' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'New proposal' })).toBeInTheDocument()
    view.unmount()
    server.resetHandlers()
    await renderDashboard('employee')
    expect(screen.queryByRole('button', { name: 'Annual budget' })).not.toBeInTheDocument()
  })
  it('opens group and delegated forms from the Manager sidebar', async () => {
    await setAppLanguage('en', true)
    server.use(http.get('*/api/v1/me', () => HttpResponse.json({ success: true, data: managerProfile })))
    await renderDashboard('manager')
    const nav = screen.getByRole('navigation', { name: 'Dashboard navigation' })
    const create = within(nav).getByRole('button', { name: 'Request on behalf' })
    expect(create).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(create)
    fireEvent.click(within(nav).getByRole('button', { name: 'Group request' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Group request' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Software plan' })).toBeInTheDocument()
    expect(screen.queryByLabelText('Plan ID')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Save preview' })).not.toBeInTheDocument()
    fireEvent.click(within(nav).getByRole('button', { name: 'Delegated requests' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Delegated requests' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Beneficiaries' })).toBeInTheDocument()
    expect(screen.queryByLabelText('Beneficiary employee IDs (one per line)')).not.toBeInTheDocument()
  })
  it('restores group mode from the Manager URL', async () => {
    await setAppLanguage('en', true)
    server.use(http.get('*/api/v1/me', () => HttpResponse.json({ success: true, data: managerProfile })))
    await renderDashboard('manager', '/?tab=create-employee-request&scope=team')
    expect(await screen.findByRole('heading', { level: 1, name: 'Group request' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Request on behalf' })).toHaveAttribute('aria-expanded', 'true')
  })
})
