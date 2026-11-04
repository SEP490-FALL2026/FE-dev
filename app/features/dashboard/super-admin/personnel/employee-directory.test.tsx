import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter, useNavigate, useLocation } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it } from 'vitest'
import { i18n, setAppLanguage } from '~/shared/i18n/i18n'
import { adminEmployeeDirectory } from '~/shared/i18n/locales/en/admin-employee-directory'
import { EmployeePanel } from './components/employee-panel'
import { SuperAdminPersonnelView } from './views/super-admin-personnel-view'

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
    http.get('*/api/v1/employees', () => HttpResponse.json({ success: true, data: { items: [employee], pagination } }))
  )
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
