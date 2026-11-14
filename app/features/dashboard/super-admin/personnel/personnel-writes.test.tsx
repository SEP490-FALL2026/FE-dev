import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { MemoryRouter } from 'react-router'
import { EmployeePanel } from './components/employee-panel'
import { ImportPanel } from './components/import-panel'
import type { EmployeeImportResponseDtoData } from '~/shared/api/generated/model/employee-imports'

const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
beforeEach(async () => {
  await setAppLanguage('en', false)
})
function mount(component: React.ReactNode, entry = '/') {
  return render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      <MemoryRouter initialEntries={[entry]}>{component}</MemoryRouter>
    </QueryClientProvider>
  )
}
function fill(label: string, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } })
}

it('edits only the employee in the profile and submits changed values', async () => {
  const id = '11111111-1111-4111-8111-111111111111'
  let received: unknown
  server.use(
    http.get('*/api/v1/employees/:id', () =>
      HttpResponse.json({
        success: true,
        data: {
          id,
          employeeCode: 'EMP-001',
          fullName: 'Nguyen An',
          workEmail: 'an@example.com',
          employmentType: 'STAFF',
          hireDate: '2026-01-01',
          jobTitle: 'Engineer',
          status: 'ACTIVE',
          workState: 'WORKING',
          department: null,
          unplaced: true,
          account: null,
          placements: [],
          placementsHasMore: false
        }
      })
    ),
    http.patch('*/api/v1/employees/:id', async ({ request, params }) => {
      received = { id: params.id, body: await request.json() }
      return HttpResponse.json({ success: false, error: { code: 'EMPLOYEE.ROW_INVALID' } }, { status: 422 })
    })
  )
  mount(<EmployeePanel />, `/dashboard/super-admin/personnel/correct?employeeId=${id}`)
  const employee = await screen.findByLabelText('Employee')
  expect(employee).toBeDisabled()
  expect(employee).toHaveValue('EMP-001 — Nguyen An')
  expect(screen.queryByLabelText('Clear work email')).not.toBeInTheDocument()
  expect(screen.getByLabelText('Full name')).toHaveValue('Nguyen An')
  fill('Job title', 'Senior Engineer')
  fireEvent.click(screen.getByRole('button', { name: 'Save' }))
  await waitFor(() => expect(received).toEqual({ id, body: { jobTitle: 'Senior Engineer' } }))
})

it('creates a personnel record with only contract fields and keeps the draft when the server rejects it', async () => {
  let received: unknown
  server.use(
    http.get('*/api/v1/employees', () =>
      HttpResponse.json({
        success: true,
        data: { items: [], pagination: { page: 1, pageSize: 20, totalItems: 0, totalPages: 0 } }
      })
    ),
    http.get('*/api/v1/departments', ({ request }) => {
      const page = Number(new URL(request.url).searchParams.get('page') ?? 1)
      return HttpResponse.json({
        success: true,
        data: {
          items:
            page === 1
              ? [{ id: 'dep-1', code: 'OPS', name: 'Operations' }]
              : [{ id: 'dep-2', code: 'ENG', name: 'Engineering' }],
          pagination: { page, pageSize: 100, totalItems: 2, totalPages: 2 }
        }
      })
    }),
    http.post('*/api/v1/employees', async ({ request }) => {
      received = await request.json()
      return HttpResponse.json({ success: false, error: { code: 'EMPLOYEE.CODE_ALREADY_EXISTS' } }, { status: 409 })
    })
  )
  mount(<EmployeePanel />)
  fireEvent.click(screen.getByRole('button', { name: 'Create employee' }))
  fill('Employee code', 'E-020')
  const department = await screen.findByRole('combobox', { name: 'Department code' })
  expect(await screen.findByRole('option', { name: 'ENG · Engineering' })).toBeInTheDocument()
  fireEvent.change(department, { target: { value: 'ENG' } })
  fill('Full name', 'New Employee')
  fill('Employment type', 'STAFF')
  fill('Hire date', '2026-11-02')
  fireEvent.click(screen.getByRole('button', { name: 'Save' }))
  await waitFor(() =>
    expect(received).toEqual({
      employeeCode: 'E-020',
      departmentCode: 'ENG',
      fullName: 'New Employee',
      employmentType: 'STAFF',
      hireDate: '2026-11-02'
    })
  )
  await waitFor(() => expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled())
  expect(screen.getByLabelText('Full name')).toHaveValue('New Employee')
})

it('keeps creation disabled until departments load and allows retry after an error', async () => {
  let attempts = 0
  server.use(
    http.get('*/api/v1/departments', () => {
      attempts += 1
      if (attempts === 1)
        return HttpResponse.json({ success: false, error: { code: 'SERVICE_UNAVAILABLE' } }, { status: 503 })
      return HttpResponse.json({
        success: true,
        data: { items: [], pagination: { page: 1, pageSize: 100, totalItems: 0, totalPages: 0 } }
      })
    })
  )
  mount(<EmployeePanel />, '/dashboard/super-admin/personnel/new')
  expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
  fireEvent.click(await screen.findByRole('button', { name: 'Retry' }))
  expect(await screen.findByRole('combobox', { name: 'Department code' })).toBeInTheDocument()
  await waitFor(() => expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled())
})

it('allows creating an employee without assigning a department', async () => {
  let received: unknown
  server.use(
    http.get('*/api/v1/departments', () =>
      HttpResponse.json({
        success: true,
        data: {
          items: [],
          pagination: { page: 1, pageSize: 100, totalItems: 0, totalPages: 0 }
        }
      })
    ),
    http.post('*/api/v1/employees', async ({ request }) => {
      received = await request.json()
      return HttpResponse.json({ success: false, error: { code: 'EMPLOYEE.CODE_ALREADY_EXISTS' } }, { status: 409 })
    })
  )
  mount(<EmployeePanel />, '/dashboard/super-admin/personnel/new')
  await screen.findByRole('combobox', { name: 'Department code' })
  fill('Employee code', 'E-021')
  fill('Full name', 'Unassigned Employee')
  fill('Employment type', 'STAFF')
  fill('Hire date', '2026-11-02')
  fireEvent.click(screen.getByRole('button', { name: 'Save' }))
  await waitFor(() => expect(received).toMatchObject({ employeeCode: 'E-021' }))
  expect(received).not.toHaveProperty('departmentCode')
})

it('replays an import confirmation with the same idempotency key after an uncertain result', async () => {
  const importId = '22222222-2222-4222-8222-222222222222'
  const preview: NonNullable<EmployeeImportResponseDtoData> = {
    id: importId,
    fileName: 'employees.csv',
    status: 'PREVIEW',
    previewVersion: 4,
    ignoredColumns: [],
    summary: {
      totalRows: 1,
      valid: 1,
      errors: 0,
      existingSame: 0,
      existingDifferent: 0,
      newUnplaced: 0,
      newPeopleByDepartment: [],
      departmentsWithoutHead: [],
      reviewQueue: { total: 0, items: [] },
      duplicateOf: null
    },
    result: null,
    createdAt: '2026-10-30T00:00:00Z',
    expiresAt: '2026-11-01T00:00:00Z',
    confirmedAt: null,
    cancelledAt: null
  }
  const confirmations: Array<{ idempotencyKey: string; previewVersion: number }> = []
  server.use(
    http.get('*/api/v1/employee-imports/:id', () => HttpResponse.json({ success: true, data: preview })),
    http.get('*/api/v1/employee-imports/:id/rows', () =>
      HttpResponse.json({
        success: true,
        data: { items: [], pagination: { page: 1, pageSize: 20, totalItems: 0, totalPages: 0 } }
      })
    ),
    http.post('*/api/v1/employee-imports/:id/confirmations', async ({ request }) => {
      confirmations.push((await request.json()) as (typeof confirmations)[number])
      return HttpResponse.json({ success: false, error: { code: 'SERVICE_UNAVAILABLE' } }, { status: 503 })
    })
  )
  mount(<ImportPanel />, `/?importId=${importId}`)
  expect(screen.queryByRole('textbox', { name: /UUID|ID/ })).not.toBeInTheDocument()
  fireEvent.click(await screen.findByRole('button', { name: 'Confirm import' }))
  const dialog = screen.getByRole('dialog')
  fireEvent.click(within(dialog).getByRole('button', { name: 'Save' }))
  await waitFor(() => expect(confirmations).toHaveLength(1))
  await waitFor(() => expect(within(dialog).getByRole('button', { name: 'Save' })).toBeEnabled())
  fireEvent.click(within(dialog).getByRole('button', { name: 'Save' }))
  await waitFor(() => expect(confirmations).toHaveLength(2))
  expect(confirmations[0].idempotencyKey).toBeTruthy()
  expect(confirmations[1]).toEqual(confirmations[0])
  expect(confirmations[0].previewVersion).toBe(4)
  expect(confirmations[0]).toEqual({ idempotencyKey: expect.any(String), previewVersion: 4 })
})
