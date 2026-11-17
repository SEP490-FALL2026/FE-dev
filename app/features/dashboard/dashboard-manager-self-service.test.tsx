import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it, vi } from 'vitest'
import type { EmployeeTabKey } from './employee'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { managerProfile } from '../../../test/fixtures/manager-api'
import { DashboardPage } from './dashboard-page'

// Test workspace composition through public feature interfaces; feature workflows have their own API tests.
vi.mock('./employee', async (original) => ({
  ...(await original<typeof import('./employee')>()),
  EmployeeScreen: ({ tab }: { tab: EmployeeTabKey }) => <div data-testid='personal-screen'>{tab}</div>
}))
vi.mock('./manager', async (original) => ({
  ...(await original<typeof import('./manager')>()),
  ManagerScreen: ({ tab }: { tab: string }) => <div data-testid='manager-screen'>{tab}</div>
}))
vi.mock('./finance', () => ({
  isValidFinanceTab: () => false,
  FinanceScreen: () => null,
  FinanceSidebarNav: () => null
}))
vi.mock('./components/dashboard-header', () => ({ DashboardHeader: () => null }))
vi.mock('~/entities/policy/components/policy-acknowledgement-gate', () => ({
  PolicyAcknowledgementGate: ({ children }: { children: React.ReactNode }) => children
}))

const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
beforeEach(() => setAppLanguage('en', false))
function mount(current = false, upcoming = false, tab = '') {
  server.use(
    http.get('*/api/v1/me', () =>
      HttpResponse.json({
        success: true,
        data: {
          ...managerProfile,
          managerScope: current ? managerProfile.managerScope : null,
          upcomingUnits: upcoming
            ? [
                {
                  departmentId: managerProfile.managerScope.departmentId,
                  departmentName: 'Upcoming',
                  departmentCode: 'NEXT',
                  costCenterId: null
                }
              ]
            : []
        }
      })
    )
  )
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <MemoryRouter initialEntries={['/dashboard/manager' + (tab ? `?tab=${tab}` : '')]}>
        <DashboardPage role='manager' />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

it('keeps personal screens and personal navigation for a Manager without a current scope', async () => {
  mount()
  expect(await screen.findByTestId('personal-screen')).toHaveTextContent('overview')
  expect(screen.queryByRole('button', { name: 'Department personnel' })).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Access rights' }))
  expect(screen.getByTestId('personal-screen')).toHaveTextContent('my-software')
  fireEvent.click(screen.getByRole('button', { name: 'My requests' }))
  expect(screen.getByTestId('personal-screen')).toHaveTextContent('my-requests')
})

it.each(['profile', 'privacy', 'personal-request', 'request-approval'])(
  'keeps the personal %s link accessible',
  async (tab) => {
    mount(false, false, tab)
    const expected = tab === 'personal-request' ? 'create-request' : tab === 'request-approval' ? 'request-detail' : tab
    expect(await screen.findByTestId('personal-screen')).toHaveTextContent(expected)
  }
)

it('retains annual-budget access for an upcoming head along with personal screens', async () => {
  mount(false, true)
  await screen.findByTestId('personal-screen')
  fireEvent.click(screen.getByRole('button', { name: 'Annual budget' }))
  expect(await screen.findByTestId('manager-screen')).toHaveTextContent('annual-budget')
  fireEvent.click(screen.getByRole('button', { name: 'Access rights' }))
  expect(await screen.findByTestId('personal-screen')).toHaveTextContent('my-software')
})

it('keeps the management workspace for a Manager with a current scope', async () => {
  mount(true)
  await waitFor(() => expect(screen.queryByTestId('personal-screen')).not.toBeInTheDocument())
  expect(await screen.findByTestId('manager-screen')).toHaveTextContent('overview')
  expect(screen.getByRole('button', { name: 'Department personnel' })).toBeInTheDocument()
})
