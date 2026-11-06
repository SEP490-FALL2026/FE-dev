import { managerReadHandlers } from '../../../test/fixtures/manager-integration'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router'
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

function CurrentLocation() {
  const location = useLocation()
  return <output data-testid='current-location'>{location.search}</output>
}

async function renderDashboard(role: UserRole, initialEntry = '/') {
  const view = render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <AppProviders>
        <DashboardPage role={role} />
        <CurrentLocation />
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
    expect(screen.queryByLabelText('ID phòng ban')).not.toBeInTheDocument()
    fireEvent.click(within(nav).getByRole('button', { name: 'Duyệt nhu cầu' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Duyệt nhu cầu' })).toBeInTheDocument()
    expect(screen.queryByLabelText('ID yêu cầu')).not.toBeInTheDocument()
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
  it('opens the group form only from the spending submission page', async () => {
    await setAppLanguage('en', true)
    server.use(http.get('*/api/v1/me', () => HttpResponse.json({ success: true, data: managerProfile })))
    await renderDashboard('manager')
    const nav = screen.getByRole('navigation', { name: 'Dashboard navigation' })
    expect(within(nav).queryByRole('button', { name: 'Request on behalf' })).not.toBeInTheDocument()
    expect(within(nav).queryByRole('button', { name: 'Group request' })).not.toBeInTheDocument()
    expect(within(nav).queryByRole('button', { name: 'Team plan request' })).not.toBeInTheDocument()
    fireEvent.click(within(nav).getByRole('button', { name: 'Submit spending requests' }))
    fireEvent.click(await screen.findByRole('button', { name: 'Create group request' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Team plan request' })).toBeInTheDocument()
    expect(within(nav).getByRole('button', { name: 'Submit spending requests' })).toHaveAttribute(
      'aria-current',
      'page'
    )
    expect(screen.getByRole('combobox', { name: 'Software plan' })).toBeInTheDocument()
    expect(screen.queryByLabelText('Plan ID')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Save preview' })).not.toBeInTheDocument()
    expect(within(nav).queryByRole('button', { name: 'Delegated requests' })).not.toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Beneficiaries' })).toBeInTheDocument()
    expect(screen.queryByLabelText('Beneficiary employee IDs (one per line)')).not.toBeInTheDocument()
  })
  it('restores group mode from the Manager URL', async () => {
    await setAppLanguage('en', true)
    server.use(http.get('*/api/v1/me', () => HttpResponse.json({ success: true, data: managerProfile })))
    await renderDashboard('manager', '/?tab=create-employee-request&scope=team')
    expect(await screen.findByRole('heading', { level: 1, name: 'Team plan request' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Request on behalf' })).not.toBeInTheDocument()
  })
  it.each([
    ['vi', 'individual', 'Yêu cầu cấp gói nhóm', 'Yêu cầu gửi hộ'],
    ['en', 'individual', 'Team plan request', 'Delegated requests'],
    ['en', '', 'Team plan request', 'Delegated requests'],
    ['en', 'invalid', 'Team plan request', 'Delegated requests']
  ])('opens the group form for %s links with scope "%s"', async (language, scope, title, removedTitle) => {
    await setAppLanguage(language as 'vi' | 'en', true)
    const delegated = vi.fn()
    server.use(
      http.get('*/api/v1/me', () => HttpResponse.json({ success: true, data: managerProfile })),
      http.post('*/api/v1/delegated-requests', () => {
        delegated()
        return HttpResponse.json({ success: true })
      }),
      http.post('*/api/v1/access-requests/preview', () => {
        delegated()
        return HttpResponse.json({ success: true })
      })
    )
    await renderDashboard(
      'manager',
      `/?tab=create-employee-request&departmentId=test-department&planId=invalid${scope ? `&scope=${scope}` : ''}`
    )
    expect(await screen.findByRole('heading', { level: 1, name: title })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: removedTitle })).not.toBeInTheDocument()
    const search = screen.getByTestId('current-location').textContent ?? ''
    const params = new URLSearchParams(search)
    expect(params.get('scope')).toBe('team')
    expect(params.get('departmentId')).toBe('test-department')
    expect(params.get('planId')).toBe('invalid')
    expect(delegated).not.toHaveBeenCalled()
  })
})
