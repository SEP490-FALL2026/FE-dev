import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { env } from '~/shared/config/env'
import type { DepartmentResponseDtoData } from '~/shared/api/generated/model'
import { DepartmentActionForm, type DepartmentAction } from './components/department-action-form'
import { DepartmentForm } from './components/department-form'
import { DepartmentDetailView } from './components/department-detail-view'
import { MemoryRouter } from 'react-router'
import { SuperAdminDepartmentsView } from './views/super-admin-departments-view'

const server = setupServer()
const base = `${env.API_BASE_URL}/api/v1`
const employeeId = '00000000-0000-4000-8000-000000000002'
const department: NonNullable<DepartmentResponseDtoData> = {
  id: '00000000-0000-4000-8000-000000000001',
  code: 'ENG',
  name: 'Engineering',
  function: null,
  status: 'ACTIVE',
  effectiveFrom: '2026-01-01',
  costCenter: null,
  itAdmin: null,
  head: { employeeId, employeeCode: 'E2', fullName: 'Dana', since: '2026-10-30' },
  memberCount: 40,
  warnings: [],
  createdAt: '',
  updatedAt: '',
  deactivatedAt: null,
  successor: null,
  headHistory: [],
  headHistoryHasMore: false
}
const envelope = (data: unknown) => HttpResponse.json({ success: true, message: 'OK', data })
const pagination = (page: number) => ({ page, pageSize: 20, totalItems: 40, totalPages: 2 })
function mount(component: React.ReactNode) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  return render(<QueryClientProvider client={client}>{component}</QueryClientProvider>)
}
function submit() {
  const form = screen.getByRole('dialog').querySelector('form')
  if (!form) throw new Error('Expected form')
  fireEvent.submit(form)
}

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
beforeEach(async () => {
  await setAppLanguage('en', false)
  server.use(http.get(`${base}/app-users`, () => envelope({ items: [], pagination: pagination(1) })))
})

describe('Organization workflows through HTTP', () => {
  it('paginates login-backed candidates and sends the employee reference from page two', async () => {
    const pages: string[] = []
    let body: unknown
    server.use(
      http.get(`${base}/app-users`, ({ request }) => {
        const params = new URL(request.url).searchParams
        pages.push(params.get('page') ?? '')
        expect(params.get('status')).toBe('ACTIVE')
        expect(params.get('activationState')).toBe('ACTIVATED')
        expect(params.get('role')).toBe('MANAGER')
        const second = params.get('page') === '2'
        return envelope({
          items: [
            {
              id: 'login-id',
              loginEmail: 'dana@example.com',
              status: 'ACTIVE',
              activationState: 'ACTIVATED',
              employee: { id: employeeId, employeeCode: 'E2', fullName: second ? 'Dana Page Two' : 'Dana Page One' },
              roles: ['EMPLOYEE', 'MANAGER']
            }
          ],
          pagination: pagination(second ? 2 : 1)
        })
      }),
      http.post(`${base}/departments/${department.id}/head-assignments`, async ({ request }) => {
        body = await request.json()
        return envelope(department)
      })
    )
    mount(<DepartmentActionForm department={department} action='assignHead' onClose={vi.fn()} />)
    await screen.findByRole('button', { name: /Dana Page One/ })
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    fireEvent.click(await screen.findByRole('button', { name: /Dana Page Two/ }))
    expect(screen.getByRole('combobox', { name: 'Employee' })).toHaveValue(employeeId)
    fireEvent.change(screen.getByLabelText('Effective from'), { target: { value: '2027-01-01' } })
    submit()
    await waitFor(() => expect(body).toEqual({ employeeId, effectiveFrom: '2027-01-01' }))
    expect(pages).toEqual(['1', '2'])
  })

  it.each<[DepartmentAction, string, boolean]>([
    ['vacateHead', 'head-vacancies', true],
    ['designateSuccessor', 'successor-designations', true],
    ['clearSuccessor', 'successor-clearances', false],
    ['deactivate', 'deactivate', false]
  ])('sends the strict body for %s', async (action, path, dated) => {
    let body: unknown
    server.use(
      http.get(`${base}/app-users`, () =>
        envelope({
          items: [
            {
              id: 'login-id',
              employee: { id: employeeId, employeeCode: 'EMP-2', fullName: 'Dana' },
              roles: ['MANAGER']
            }
          ],
          pagination: pagination(1)
        })
      ),
      http.post(`${base}/departments/${department.id}/${path}`, async ({ request }) => {
        body = await request.json()
        return envelope(department)
      })
    )
    mount(<DepartmentActionForm department={department} action={action} onClose={vi.fn()} />)
    if (action === 'designateSuccessor') fireEvent.click(await screen.findByRole('button', { name: /Dana/ }))
    if (dated) fireEvent.change(screen.getByLabelText('Effective from'), { target: { value: '2027-01-01' } })
    submit()
    await waitFor(() =>
      expect(body).toEqual({
        ...(dated ? { effectiveFrom: '2027-01-01' } : {}),
        ...(action === 'designateSuccessor' ? { employeeId } : {})
      })
    )
  })

  it('keeps department search, filters and creation available without a separate module tab', async () => {
    server.use(http.get(`${base}/departments`, () => envelope({ items: [department], pagination: pagination(1) })))
    mount(
      <MemoryRouter>
        <SuperAdminDepartmentsView />
      </MemoryRouter>
    )
    await screen.findByRole('heading', { name: 'Engineering' })
    expect(screen.getByRole('searchbox', { name: 'Search departments' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Status' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Projects' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Create department' }))
    expect(screen.getByRole('dialog', { name: 'Create department' })).toBeInTheDocument()
    expect(screen.getByLabelText('Department code')).toBeInTheDocument()
  })

  it('pages department members using their own endpoint without editing membership locally', async () => {
    const pages: string[] = []
    server.use(
      http.get(`${base}/departments/${department.id}`, () => envelope(department)),
      http.get(`${base}/departments/${department.id}/employees`, ({ request }) => {
        const page = new URL(request.url).searchParams.get('page') ?? '1'
        pages.push(page)
        return envelope({
          items: [
            {
              employeeId,
              employeeCode: `E${page}`,
              fullName: `Member ${page}`,
              status: 'ACTIVE',
              workState: 'WORKING',
              hasWorkEmail: true,
              memberSince: '2026-10-30'
            }
          ],
          pagination: pagination(Number(page))
        })
      })
    )
    mount(
      <MemoryRouter>
        <DepartmentDetailView id={department.id} onBack={vi.fn()} />
      </MemoryRouter>
    )
    expect(await screen.findByRole('link', { name: 'Member 1' })).toHaveAttribute(
      'href',
      `/dashboard/super-admin?tab=personnel&employeeId=${employeeId}`
    )
    expect(screen.queryByRole('button', { name: 'Projects' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    await screen.findByText('Member 2')
    expect(pages).toEqual(['1', '2'])
    expect(screen.queryByRole('button', { name: /add member|remove member/i })).not.toBeInTheDocument()
  })

  it('retains the form after a conflict and blocks duplicate submissions while pending', async () => {
    let calls = 0
    let release: (() => void) | undefined
    const gate = new Promise<void>((resolve) => {
      release = resolve
    })
    const onClose = vi.fn()
    server.use(
      http.post(`${base}/departments`, async () => {
        calls += 1
        await gate
        return HttpResponse.json({ success: false, error: { code: 'DEPARTMENT.CODE_TAKEN' } }, { status: 409 })
      })
    )
    mount(<DepartmentForm onClose={onClose} />)
    fireEvent.change(screen.getByLabelText('Department code'), { target: { value: 'ENG' } })
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Engineering' } })
    submit()
    await waitFor(() => expect(screen.getByRole('button', { name: 'Saving…' })).toBeDisabled())
    submit()
    await waitFor(() => expect(calls).toBe(1))
    release?.()
    await waitFor(() => expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled())
    expect(screen.getByLabelText('Name')).toHaveValue('Engineering')
    expect(onClose).not.toHaveBeenCalled()
    expect(calls).toBe(1)
  })
})
