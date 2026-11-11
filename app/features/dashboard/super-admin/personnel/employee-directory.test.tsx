import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter, useNavigate, useLocation } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it, vi } from 'vitest'
import { i18n, setAppLanguage } from '~/shared/i18n/i18n'
import { adminEmployeeDirectory } from '~/shared/i18n/locales/en/admin-employee-directory'
import { EmployeePanel } from './components/employee-panel'
import { SuperAdminPersonnelView } from './views/super-admin-personnel-view'
import { SuperAdminScreen } from '../super-admin-screen'

const employeeId = '11111111-1111-4111-8111-111111111111'
const departmentId = '22222222-2222-4222-8222-222222222222'
const browserBackLabel = 'Browser back'
const employee = {
  id: employeeId,
  employeeCode: 'EMP-001',
  fullName: 'Nguyen An',
  workEmail: 'an@example.com',
  employmentType: 'STAFF',
  status: 'ACTIVE',
  workState: 'WORKING',
  hireDate: '2026-01-01',
  jobTitle: 'Engineer',
  department: null,
  unplaced: true,
  account: null
}
const pagination = { page: 1, pageSize: 20, totalItems: 21, totalPages: 2 }
const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
beforeEach(async () => {
  await setAppLanguage('en', false)
  server.use(
    http.get('*/api/v1/employees', () => HttpResponse.json({ success: true, data: { items: [employee], pagination } })),
    http.get('*/api/v1/app-users', () =>
      HttpResponse.json({
        success: true,
        data: { items: [], pagination: { page: 1, pageSize: 100, totalItems: 0, totalPages: 0 } }
      })
    ),
    http.get('*/api/v1/departments', () =>
      HttpResponse.json({ success: true, data: { items: [], pagination: { page: 1, totalPages: 0, totalItems: 0 } } })
    )
  )
})

it('joins account roles to employee records and filters before paging', async () => {
  const manager = {
    ...employee,
    account: { id: 'account-1', status: 'ACTIVE', activationState: 'ACTIVATED', employeeLeft: false }
  }
  const unassigned = { ...employee, id: 'employee-2', fullName: 'Second Employee', employeeCode: 'EMP-002' }
  server.use(
    http.get('*/api/v1/employees', () =>
      HttpResponse.json({
        success: true,
        data: { items: [manager, unassigned], pagination: { page: 1, pageSize: 100, totalItems: 2, totalPages: 1 } }
      })
    ),
    http.get('*/api/v1/app-users', () =>
      HttpResponse.json({
        success: true,
        data: {
          items: [
            {
              id: 'account-1',
              employee: { id: employeeId, employeeCode: 'EMP-001', fullName: 'Nguyen An' },
              roles: ['MANAGER']
            }
          ],
          pagination: { page: 1, pageSize: 100, totalItems: 1, totalPages: 1 }
        }
      })
    )
  )
  mount()
  expect(await screen.findByText('Second Employee')).toBeInTheDocument()
  expect(screen.getAllByText('Manager').length).toBeGreaterThan(1)
  fireEvent.click(screen.getByRole('button', { name: 'Filters' }))
  fireEvent.change(screen.getByRole('combobox', { name: 'Direct role' }), { target: { value: 'MANAGER' } })
  fireEvent.click(screen.getByRole('button', { name: text('apply') }))
  expect(await screen.findByText('Nguyen An')).toBeInTheDocument()
  expect(screen.queryByText('Second Employee')).not.toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Filters' })).toHaveAccessibleDescription('Filters are applied')
})

it('includes matching roles from later employee and account pages', async () => {
  server.use(
    http.get('*/api/v1/employees', ({ request }) => {
      const params = new URL(request.url).searchParams
      const later = params.get('page') === '2' && params.get('pageSize') === '100'
      return HttpResponse.json({
        success: true,
        data: {
          items: [
            later
              ? { ...employee, id: 'employee-later', fullName: 'Later Employee', account: { id: 'account-later' } }
              : employee
          ],
          pagination: { page: later ? 2 : 1, pageSize: 100, totalItems: 2, totalPages: 2 }
        }
      })
    }),
    http.get('*/api/v1/app-users', ({ request }) => {
      const later = new URL(request.url).searchParams.get('page') === '2'
      return HttpResponse.json({
        success: true,
        data: {
          items: later ? [{ id: 'account-later', employee: { id: 'employee-later' }, roles: ['MANAGER'] }] : [],
          pagination: { page: later ? 2 : 1, pageSize: 100, totalItems: 1, totalPages: 2 }
        }
      })
    })
  )
  mount()
  await screen.findByRole('button', { name: 'Nguyen An' })
  fireEvent.click(screen.getByRole('button', { name: 'Filters' }))
  fireEvent.change(screen.getByRole('combobox', { name: 'Direct role' }), { target: { value: 'MANAGER' } })
  fireEvent.click(screen.getByRole('button', { name: text('apply') }))
  expect(await screen.findByRole('button', { name: 'Later Employee' })).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Nguyen An' })).not.toBeInTheDocument()
})
function mount() {
  return render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <MemoryRouter initialEntries={['/dashboard/super-admin?tab=personnel']}>
        <EmployeePanel />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

it('starts with filters closed and keeps the draft when toggled', async () => {
  mount()
  const toggle = screen.getByRole('button', { name: 'Filters' })
  expect(toggle).toHaveAttribute('aria-expanded', 'false')
  expect(screen.queryByRole('textbox', { name: text('search') })).not.toBeInTheDocument()
  fireEvent.click(toggle)
  const search = screen.getByRole('textbox', { name: text('search') })
  fireEvent.change(search, { target: { value: 'Nguyen' } })
  expect(toggle).toHaveAttribute('aria-expanded', 'true')
  fireEvent.click(toggle)
  expect(screen.queryByRole('textbox', { name: text('search') })).not.toBeInTheDocument()
  fireEvent.click(toggle)
  expect(screen.getByRole('textbox', { name: text('search') })).toHaveValue('Nguyen')
})

it('shows a visible details action for each employee and opens its profile', async () => {
  server.use(
    http.get('*/api/v1/employees/:id', () =>
      HttpResponse.json({ success: true, data: { ...employee, placements: [], placementsHasMore: false } })
    )
  )
  mount()
  const table = await screen.findByRole('table', { name: text('title') })
  expect(within(table).getByRole('columnheader', { name: 'Actions' })).toBeVisible()
  const row = within(table).getByRole('row', { name: /Nguyen An/ })
  fireEvent.click(within(row).getByRole('button', { name: 'View details' }))
  expect(await screen.findByText('Engineer')).toBeInTheDocument()
})
const text = (key: keyof typeof adminEmployeeDirectory.directory) =>
  i18n.t(`directory.${key}`, { ns: 'adminPersonnel' })

it('loads the global directory and sends search and filters to the server, resetting server paging', async () => {
  const requests: URLSearchParams[] = []
  server.use(
    http.get('*/api/v1/employees', ({ request }) => {
      const params = new URL(request.url).searchParams
      requests.push(params)
      return HttpResponse.json({
        success: true,
        data: { items: [employee], pagination: { ...pagination, page: Number(params.get('page') ?? 1) } }
      })
    })
  )
  mount()
  expect(await screen.findByRole('button', { name: 'Nguyen An' })).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: i18n.t('next', { ns: 'admin' }) }))
  await waitFor(() => expect(requests.at(-1)?.get('page')).toBe('2'))
  fireEvent.click(screen.getByRole('button', { name: 'Filters' }))
  fireEvent.change(screen.getByRole('textbox', { name: text('search') }), { target: { value: 'an' } })
  fireEvent.change(screen.getByLabelText(text('placement')), { target: { value: 'true' } })
  fireEvent.change(screen.getByLabelText(text('account')), { target: { value: 'false' } })
  fireEvent.click(screen.getByRole('button', { name: text('apply') }))
  await waitFor(() => expect(requests.at(-1)?.get('q')).toBe('an'))
  expect(requests.at(-1)?.get('page')).toBe('1')
  expect(requests.at(-1)?.get('unplaced')).toBe('true')
  expect(requests.at(-1)?.get('hasAccount')).toBe('false')
  expect(requests.at(-1)?.has('departmentId')).toBe(false)
})

it('filters by a department chosen directly from the department list', async () => {
  const requests: URLSearchParams[] = []
  server.use(
    http.get('*/api/v1/departments', () =>
      HttpResponse.json({
        success: true,
        data: {
          items: [{ id: departmentId, code: 'ENG', name: 'Engineering' }],
          pagination: { page: 1, pageSize: 100, totalItems: 1, totalPages: 1 }
        }
      })
    ),
    http.get('*/api/v1/employees', ({ request }) => {
      requests.push(new URL(request.url).searchParams)
      return HttpResponse.json({ success: true, data: { items: [employee], pagination } })
    })
  )
  mount()
  fireEvent.click(screen.getByRole('button', { name: 'Filters' }))
  const department = await screen.findByRole('combobox', { name: 'Department' })
  expect(await screen.findByRole('option', { name: 'ENG · Engineering' })).toBeInTheDocument()
  fireEvent.change(department, { target: { value: departmentId } })
  fireEvent.click(screen.getByRole('button', { name: text('apply') }))
  await waitFor(() => expect(requests.at(-1)?.get('departmentId')).toBe(departmentId))
  expect(screen.queryByRole('button', { name: 'Choose department' })).not.toBeInTheDocument()
})

it('shows employee and account information together on the detail page', async () => {
  server.use(
    http.get('*/api/v1/employees/:id', () =>
      HttpResponse.json({
        success: true,
        data: {
          ...employee,
          account: { id: 'account-1', status: 'ACTIVE', activationState: 'ACTIVATED', roles: ['MANAGER'] },
          placements: [],
          placementsHasMore: false
        }
      })
    ),
    http.get('*/api/v1/app-users/:id', () =>
      HttpResponse.json({
        success: true,
        data: {
          id: 'account-1',
          loginEmail: 'login@example.com',
          status: 'ACTIVE',
          activationState: 'ACTIVATED',
          roles: ['MANAGER'],
          roleHistory: [],
          roleHistoryHasMore: false,
          invitation: null,
          createdAt: '2026-01-01'
        }
      })
    )
  )
  mount()
  fireEvent.click(await screen.findByRole('button', { name: 'Nguyen An' }))
  expect(await screen.findByText('login@example.com')).toBeInTheDocument()
  expect(screen.getByText('an@example.com')).toBeInTheDocument()
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(screen.getByRole('region', { name: 'Official information' })).toBeInTheDocument()
  expect(screen.getByRole('region', { name: 'Login account' })).toBeInTheDocument()
  expect(screen.getByRole('region', { name: 'Department history' })).toBeInTheDocument()
})

it('opens account creation from the employee directory', async () => {
  const onInvite = vi.fn()
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <MemoryRouter>
        <EmployeePanel onInviteAccount={onInvite} />
      </MemoryRouter>
    </QueryClientProvider>
  )
  fireEvent.click(screen.getByRole('button', { name: 'Invite account' }))
  expect(onInvite).toHaveBeenCalledOnce()
})

it('keeps account management in the personnel flow', async () => {
  server.use(
    http.get('*/api/v1/employees/:id', () =>
      HttpResponse.json({
        success: true,
        data: {
          ...employee,
          account: { id: 'account-1', status: 'ACTIVE', activationState: 'ACTIVATED', roles: ['MANAGER'] },
          placements: [],
          placementsHasMore: false
        }
      })
    ),
    http.get('*/api/v1/app-users/:id', () =>
      HttpResponse.json({
        success: true,
        data: {
          id: 'account-1',
          loginEmail: 'login@example.com',
          status: 'ACTIVE',
          activationState: 'ACTIVATED',
          roles: ['MANAGER'],
          roleHistory: [],
          roleHistoryHasMore: false,
          invitation: null,
          createdAt: '2026-01-01'
        }
      })
    )
  )
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <MemoryRouter initialEntries={['/dashboard/super-admin?tab=personnel']}>
        <SuperAdminScreen tab='personnel' onSelectTab={vi.fn()} />
      </MemoryRouter>
    </QueryClientProvider>
  )
  fireEvent.click(await screen.findByRole('button', { name: 'Nguyen An' }))
  fireEvent.click(await screen.findByRole('button', { name: 'Manage login account' }))
  expect(await screen.findByRole('button', { name: 'Change role' })).toBeInTheDocument()
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
  expect(await screen.findByText('an@example.com')).toBeInTheDocument()
})

it('opens the authoritative employee profile and preserves first-placement draft on rejection', async () => {
  const writes: unknown[] = []
  server.use(
    http.get('*/api/v1/employees/:id', () =>
      HttpResponse.json({ success: true, data: { ...employee, placements: [], placementsHasMore: false } })
    ),
    http.get('*/api/v1/departments', () =>
      HttpResponse.json({
        success: true,
        data: {
          items: [{ id: departmentId, code: 'ENG', name: 'Engineering' }],
          pagination: { ...pagination, totalItems: 1, totalPages: 1 }
        }
      })
    ),
    http.post('*/api/v1/employees/:id/first-placements', async ({ request }) => {
      writes.push(await request.json())
      return HttpResponse.json({ success: false, error: { code: 'EMPLOYEE.DATE_INVALID' } }, { status: 422 })
    })
  )
  mount()
  fireEvent.click(await screen.findByRole('button', { name: 'Nguyen An' }))
  expect(await screen.findByText('Engineer')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: text('place') }))
  const dialog = screen.getByRole('dialog')
  fireEvent.click(within(dialog).getByRole('button', { name: 'Choose department' }))
  fireEvent.click(await within(dialog).findByRole('button', { name: /ENG.*Engineering/ }))
  fireEvent.change(within(dialog).getByLabelText(text('effectiveFrom')), { target: { value: '2099-11-10' } })
  fireEvent.click(within(dialog).getByRole('button', { name: text('place') }))
  await waitFor(() => expect(writes).toEqual([{ departmentId, effectiveFrom: '2099-11-10' }]))
  await waitFor(() => expect(within(dialog).getByRole('button', { name: text('place') })).toBeEnabled())
  expect(within(dialog).getByLabelText(text('effectiveFrom'))).toHaveValue('2099-11-10')
})

it('hides first placement for an employee who already belongs to a department', async () => {
  server.use(
    http.get('*/api/v1/employees/:id', () =>
      HttpResponse.json({
        success: true,
        data: {
          ...employee,
          unplaced: false,
          department: { id: departmentId, code: 'ENG', name: 'Engineering' },
          placements: [
            {
              department: { id: departmentId, code: 'ENG', name: 'Engineering' },
              validFrom: '2026-01-01',
              validTo: null
            }
          ],
          placementsHasMore: true
        }
      })
    )
  )
  mount()
  fireEvent.click(await screen.findByRole('button', { name: 'Nguyen An' }))
  expect(await screen.findByText(text('historyMore'))).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: text('place') })).not.toBeInTheDocument()
})

it('keeps personnel tabs in URL history and clears profile context when leaving the directory', async () => {
  server.use(
    http.get('*/api/v1/employees/:id', () =>
      HttpResponse.json({ success: true, data: { ...employee, placements: [], placementsHasMore: false } })
    )
  )
  function Harness() {
    const navigate = useNavigate()
    const location = useLocation()
    return (
      <>
        <button type='button' onClick={() => void navigate(-1)}>
          {browserBackLabel}
        </button>
        <output data-testid='url'>{location.search}</output>
        <SuperAdminPersonnelView />
      </>
    )
  }
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <MemoryRouter initialEntries={['/dashboard/super-admin?tab=personnel']}>
        <Harness />
      </MemoryRouter>
    </QueryClientProvider>
  )
  fireEvent.click(await screen.findByRole('button', { name: 'Nguyen An' }))
  expect(await screen.findByText('Engineer')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Employee import' }))
  expect(screen.getByTestId('url')).toHaveTextContent('tab=personnel&section=imports')
  expect(screen.getByTestId('url')).not.toHaveTextContent('employeeId')
  expect(screen.getByRole('button', { name: 'Employee import' })).toHaveAttribute('aria-pressed', 'true')
  fireEvent.click(screen.getByRole('button', { name: 'Browser back' }))
  expect(await screen.findByText('Engineer')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Employee profiles' })).toHaveAttribute('aria-pressed', 'true')
})
