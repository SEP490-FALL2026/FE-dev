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
function mount(component: React.ReactNode) {
  return render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      <MemoryRouter>{component}</MemoryRouter>
    </QueryClientProvider>
  )
}
function fill(label: string, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } })
}
function basis() {
  fill('HR document type', 'Decision')
  fill('HR document reference', 'HR-2026-01')
  fill('HR document issuer', 'Personnel office')
  fill('HR document issue date', '2026-10-30')
}

it('creates a personnel record with only contract fields and keeps the draft when the server rejects it', async () => {
  let received: unknown
  server.use(
    http.post('*/api/v1/employees', async ({ request }) => {
      received = await request.json()
      return HttpResponse.json({ success: false, error: { code: 'EMPLOYEE.CODE_ALREADY_EXISTS' } }, { status: 409 })
    })
  )
  mount(<EmployeePanel />)
  fireEvent.click(screen.getByRole('button', { name: 'Create employee' }))
  fill('Employee code', 'E-020')
  fill('Department code', 'ENG')
  fill('Full name', 'New Employee')
  fill('Employment type', 'STAFF')
  fill('Hire date', '2026-11-02')
  basis()
  fireEvent.click(screen.getByRole('button', { name: 'Save' }))
  await waitFor(() =>
    expect(received).toEqual({
      employeeCode: 'E-020',
      departmentCode: 'ENG',
      fullName: 'New Employee',
      employmentType: 'STAFF',
      hireDate: '2026-11-02',
      hrBasis: { type: 'Decision', reference: 'HR-2026-01', issuer: 'Personnel office', issuedOn: '2026-10-30' }
    })
  )
  await waitFor(() => expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled())
  expect(screen.getByLabelText('Full name')).toHaveValue('New Employee')
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
  const confirmations: Array<{ idempotencyKey: string; previewVersion: number; hrBasis: unknown }> = []
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
  mount(<ImportPanel />)
  fill('Import UUID', importId)
  fireEvent.click(screen.getByRole('button', { name: 'Read existing import' }))
  fireEvent.click(await screen.findByRole('button', { name: 'Confirm import' }))
  basis()
  const dialog = screen.getByRole('dialog')
  fireEvent.click(within(dialog).getByRole('button', { name: 'Save' }))
  await waitFor(() => expect(confirmations).toHaveLength(1))
  await waitFor(() => expect(within(dialog).getByRole('button', { name: 'Save' })).toBeEnabled())
  fireEvent.click(within(dialog).getByRole('button', { name: 'Save' }))
  await waitFor(() => expect(confirmations).toHaveLength(2))
  expect(confirmations[0].idempotencyKey).toBeTruthy()
  expect(confirmations[1]).toEqual(confirmations[0])
  expect(confirmations[0].previewVersion).toBe(4)
})
