import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter, useLocation } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { SuperAdminScreen } from '../super-admin-screen'
import { superAdminNavItems } from '../super-admin-nav'

const employeeId = '11111111-1111-4111-8111-111111111111'
const accountId = '22222222-2222-4222-8222-222222222222'
const departmentId = '33333333-3333-4333-8333-333333333333'
const employee = {
  id: employeeId,
  employeeCode: 'EMP-001',
  fullName: 'Mai Nguyen',
  status: 'ACTIVE',
  workState: 'WORKING',
  workEmail: 'mai@example.test',
  employmentType: 'STAFF',
  hireDate: '2026-01-01',
  jobTitle: null,
  department: { id: '44444444-4444-4444-8444-444444444444', code: 'OPS', name: 'Operations' },
  unplaced: false,
  placements: [],
  placementsHasMore: false,
  account: {
    id: accountId,
    loginEmail: 'mai@example.test',
    roles: ['EMPLOYEE'],
    status: 'ACTIVE',
    activationState: 'ACTIVATED'
  }
}
const account = {
  ...employee.account,
  employee: { id: employeeId, fullName: employee.fullName, employeeCode: employee.employeeCode },
  createdAt: '2026-01-01T00:00:00Z',
  roleHistory: [],
  roleHistoryHasMore: false,
  invitation: null
}
const envelope = (data: unknown) => HttpResponse.json({ success: true, data })
const page = (items: unknown[]) => ({
  items,
  pagination: { page: 1, pageSize: 20, totalItems: items.length, totalPages: 1 }
})
const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
beforeEach(async () => {
  await setAppLanguage('en', false)
  server.use(
    http.get('*/api/v1/employees/:id', () => envelope(employee)),
    http.get('*/api/v1/employees', () => envelope(page([employee]))),
    http.get('*/api/v1/app-users/:id', () => envelope(account)),
    http.get('*/api/v1/app-users', () => envelope(page([account]))),
    http.get('*/api/v1/departments', () => envelope(page([{ id: departmentId, code: 'ENG', name: 'Engineering' }])))
  )
})
function LocationContext() {
  const location = useLocation()
  return <output data-testid='personnel-location'>{location.pathname + location.search}</output>
}
function mount(entry = `/dashboard/super-admin?tab=personnel&employeeId=${employeeId}`) {
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      <MemoryRouter initialEntries={[entry]}>
        <LocationContext />
        <SuperAdminScreen tab='personnel' onSelectTab={vi.fn()} />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

it('has one personnel navigation entry for employee profiles, accounts and responsibilities', () => {
  expect(superAdminNavItems.filter((item) => item.key === 'personnel')).toHaveLength(1)
  expect(superAdminNavItems.some((item) => item.key === 'accounts')).toBe(false)
})

it('manages an employee account from the profile and returns to that same profile', async () => {
  mount()
  fireEvent.click(await screen.findByRole('button', { name: 'Manage login account' }))
  const details = await screen.findByRole('region', { name: 'View details' })
  expect(await within(details).findByText('mai@example.test')).toBeInTheDocument()
  expect(within(details).getByRole('button', { name: 'Change role' })).toBeEnabled()
  expect(screen.getByTestId('personnel-location')).toHaveTextContent(`tab=personnel&employeeId=${employeeId}`)
  fireEvent.click(within(details).getByRole('button', { name: 'Cancel' }))
  expect(await screen.findByRole('button', { name: 'Record offboarding' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Record transfer' })).toBeInTheDocument()
})

it('opens an invitation from overview context inside personnel and closes it without leaving the workspace', async () => {
  server.use(http.get('*/api/v1/account-candidates', () => envelope({ items: [] })))
  mount('/dashboard/super-admin?tab=personnel&action=invite')
  const invitation = await screen.findByRole('dialog', { name: 'Invite account' })
  fireEvent.click(within(invitation).getByRole('button', { name: 'Cancel' }))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(screen.getByTestId('personnel-location')).toHaveTextContent('tab=personnel')
  expect(screen.getByTestId('personnel-location')).not.toHaveTextContent('action=invite')
  expect(await screen.findByText('Mai Nguyen')).toBeInTheDocument()
})

it('uses the personnel directory role filter for an approver link instead of a separate accounts screen', async () => {
  server.use(http.get('*/api/v1/app-users', () => envelope(page([{ ...account, roles: ['SPENDING_APPROVER'] }]))))
  mount('/dashboard/super-admin?tab=personnel&role=SPENDING_APPROVER')
  expect(await screen.findByLabelText('Direct role')).toHaveValue('SPENDING_APPROVER')
  expect(await screen.findByText('Mai Nguyen')).toBeInTheDocument()
  expect(screen.getByTestId('personnel-location')).toHaveTextContent('tab=personnel')
})

it.each([
  ['offboarding', 'Record offboarding', 'Last working day', '/api/v1/offboarding-cases'],
  ['transfer', 'Record transfer', 'Effective date', '/api/v1/department-transfers']
] as const)(
  'keeps the %s preview and confirmation workflow inside the employee context',
  async (kind, action, dateField, endpoint) => {
    const previews: unknown[] = []
    const writes: unknown[] = []
    server.use(
      http.post(`*${endpoint}/preview`, async ({ request }) => {
        previews.push(await request.json())
        return envelope({
          rightsToRevoke: [],
          openRequestsToCancel: [],
          provisioningInFlight: [],
          commitmentToRelease: [],
          responsibilities: { subscriptions: 0, applications: 0 },
          vendorAdminRoles: [],
          headSuccessorRequired: false
        })
      }),
      http.post(`*${endpoint}`, async ({ request }) => {
        writes.push(await request.json())
        return envelope(null)
      })
    )
    mount()
    fireEvent.click(await screen.findByRole('button', { name: action }))
    expect(screen.getByLabelText('Employee')).toHaveValue('EMP-001 — Mai Nguyen')
    expect(screen.getByLabelText('Employee')).toBeDisabled()
    if (kind === 'transfer') {
      await screen.findByRole('option', { name: /Engineering/ })
      fireEvent.change(screen.getByLabelText('Destination department'), { target: { value: departmentId } })
    }
    fireEvent.change(screen.getByLabelText(dateField), { target: { value: '2026-12-01' } })
    fireEvent.change(screen.getByLabelText('Authoritative basis'), { target: { value: 'Approved personnel decision' } })
    fireEvent.click(screen.getByRole('button', { name: 'Preview impact' }))
    expect(await screen.findByText('Impact if recorded')).toBeInTheDocument()
    expect(writes).toHaveLength(0)
    fireEvent.click(screen.getByRole('button', { name: 'Confirm and record' }))
    await waitFor(() => expect(writes).toHaveLength(1))
    expect(writes[0]).toEqual(previews[0])
    expect(previews[0]).toMatchObject({ employeeId })
    expect(await screen.findByRole('button', { name: 'Manage login account' })).toBeInTheDocument()
    expect(screen.getByTestId('personnel-location')).toHaveTextContent(`tab=personnel&employeeId=${employeeId}`)
  }
)
