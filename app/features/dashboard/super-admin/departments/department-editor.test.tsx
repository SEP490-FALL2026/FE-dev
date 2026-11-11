import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { i18n, setAppLanguage } from '~/shared/i18n/i18n'
import { env } from '~/shared/config/env'
import type { DepartmentResponseDtoData } from '~/shared/api/generated/model'
import { DepartmentForm } from './components/department-form'

const base = `${env.API_BASE_URL}/api/v1`
const departmentId = '00000000-0000-4000-8000-000000000001'
const employeeId = '00000000-0000-4000-8000-000000000002'
const department: NonNullable<DepartmentResponseDtoData> = {
  id: departmentId,
  code: 'ENG',
  name: 'Engineering',
  function: null,
  status: 'ACTIVE',
  effectiveFrom: '2026-01-01',
  costCenter: null,
  itAdmin: null,
  head: null,
  memberCount: 4,
  warnings: [],
  createdAt: '',
  updatedAt: '',
  deactivatedAt: null,
  successor: null,
  headHistory: [],
  headHistoryHasMore: false
}
const server = setupServer()
const envelope = (data: unknown) => HttpResponse.json({ success: true, message: 'OK', data })
let current = { ...department }
const writes: { method: string; body: unknown }[] = []
function submit() {
  const form = screen.getByRole('dialog').querySelector('form')
  if (!form) throw new Error('Expected form')
  fireEvent.submit(form)
}
function mount(onClose = vi.fn()) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  render(
    <QueryClientProvider client={client}>
      <DepartmentForm department={department} onClose={onClose} />
    </QueryClientProvider>
  )
  return { onClose, client }
}
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
beforeEach(async () => {
  writes.length = 0
  current = { ...department }
  await setAppLanguage('en', false)
  i18n.addResourceBundle(
    'en',
    'adminOrganization',
    {
      editor: {
        headChoice: 'Department head change',
        keepHead: 'Keep current head',
        assignHead: 'Choose new head',
        vacateHead: 'Leave vacant',
        chooseHead: 'Choose a manager',
        review: 'I reviewed the latest department data',
        errors: { headMembership: 'Choose a member of this department on the effective date.' }
      }
    },
    true,
    true
  )
  server.use(
    http.get(`${base}/departments/${departmentId}`, () => envelope(current)),
    http.get(`${base}/app-users`, () =>
      envelope({ items: [], pagination: { page: 1, pageSize: 20, totalPages: 1, totalItems: 0 } })
    ),
    http.patch(`${base}/departments/${departmentId}`, async ({ request }) => {
      const body = (await request.json()) as Record<string, unknown>
      writes.push({ method: 'patch', body })
      current = { ...current, ...body }
      return envelope(current)
    })
  )
})

describe('Unified department editor', () => {
  it('retains the current IT administrator even when the account is no longer in the selectable list', async () => {
    const assigned = { ...department, itAdmin: { employeeId, employeeCode: 'IT-02', fullName: 'Alex', usable: false } }
    const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
    render(
      <QueryClientProvider client={client}>
        <DepartmentForm department={assigned} onClose={vi.fn()} />
      </QueryClientProvider>
    )
    expect(await screen.findByRole('option', { name: 'IT-02 — Alex' })).toBeInTheDocument()
    expect(screen.getByLabelText('IT administrator')).toHaveValue(employeeId)
    fireEvent.change(screen.getByLabelText('IT administrator'), { target: { value: '' } })
    submit()
    await waitFor(() => expect(writes).toEqual([{ method: 'patch', body: { itAdminEmployeeId: null } }]))
  })
  it('associates backend validation paths with the actual field and preserves its draft', async () => {
    server.use(
      http.patch(`${base}/departments/${departmentId}`, () =>
        HttpResponse.json(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Internal validation detail',
              details: { issues: [{ path: ['body', 'function'] }] }
            }
          },
          { status: 422 }
        )
      )
    )
    mount()
    const field = screen.getByLabelText('Function')
    fireEvent.change(field, { target: { value: 'Changed function' } })
    submit()
    await waitFor(() => expect(field).toHaveAttribute('aria-invalid', 'true'))
    expect(field).toHaveAccessibleDescription(i18n.t('editor.errors.validation', { ns: 'adminOrganization' }))
    expect(field).toHaveValue('Changed function')
    expect(screen.queryByText('Internal validation detail')).not.toBeInTheDocument()
  })

  it('does not send an empty patch when nothing changed', async () => {
    const { onClose } = mount()
    submit()
    await waitFor(() => expect(onClose).toHaveBeenCalledOnce())
    expect(writes).toEqual([])
  })

  it('patches only changed department fields', async () => {
    const { onClose } = mount()
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: ' Engineering Platform ' } })
    submit()
    await waitFor(() => expect(onClose).toHaveBeenCalledOnce())
    expect(writes).toEqual([{ method: 'patch', body: { name: 'Engineering Platform' } }])
  })

  it('queries managers for the department and date, saves details before head, and retries only the failed head change', async () => {
    const candidates: URLSearchParams[] = []
    let headCalls = 0
    const onClose = vi.fn()
    server.use(
      http.get(`${base}/app-users`, ({ request }) => {
        const params = new URL(request.url).searchParams
        if (params.get('role') !== 'MANAGER')
          return envelope({ items: [], pagination: { page: 1, totalPages: 1, totalItems: 0, pageSize: 20 } })
        candidates.push(params)
        return envelope({
          items: [
            {
              id: 'account',
              employee: { id: employeeId, employeeCode: 'EMP-2', fullName: 'Dana' },
              roles: ['EMPLOYEE', 'MANAGER']
            }
          ],
          pagination: { page: 1, totalPages: 1, totalItems: 1, pageSize: 20 }
        })
      }),
      http.post(`${base}/departments/${departmentId}/head-assignments`, async ({ request }) => {
        writes.push({ method: 'head', body: await request.json() })
        headCalls += 1
        if (headCalls === 1)
          return HttpResponse.json(
            { success: false, error: { code: 'DEPARTMENT.HEAD_NOT_A_MEMBER_ON_DATE' } },
            { status: 422 }
          )
        return envelope(current)
      })
    )
    mount(onClose)
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Platform' } })
    fireEvent.change(screen.getByLabelText('Department head change'), { target: { value: 'assign' } })
    fireEvent.change(screen.getByLabelText('Effective from'), { target: { value: '2027-02-03' } })
    await screen.findByRole('option', { name: /Dana/ })
    fireEvent.change(screen.getByLabelText('Choose a manager'), { target: { value: employeeId } })
    submit()
    await screen.findByText('Choose a member of this department on the effective date.')
    expect(onClose).not.toHaveBeenCalled()
    expect(screen.getByLabelText('Name')).toHaveValue('Platform')
    expect(writes.map((write) => write.method)).toEqual(['patch', 'head'])
    expect(
      candidates.some(
        (params) => params.get('departmentId') === departmentId && params.get('memberOn') === '2027-02-03'
      )
    ).toBe(true)
    submit()
    await waitFor(() => expect(onClose).toHaveBeenCalledOnce())
    expect(writes.map((write) => write.method)).toEqual(['patch', 'head', 'head'])
    expect(writes[2].body).toEqual({ employeeId, effectiveFrom: '2027-02-03' })
  })

  it('does not attempt head changes if the department update is rejected', async () => {
    server.use(
      http.patch(`${base}/departments/${departmentId}`, () =>
        HttpResponse.json({ success: false, error: { code: 'DEPARTMENT.NAME_INVALID' } }, { status: 422 })
      )
    )
    mount()
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Platform' } })
    fireEvent.change(screen.getByLabelText('Department head change'), { target: { value: 'vacate' } })
    fireEvent.change(screen.getByLabelText('Effective from'), { target: { value: '2027-02-03' } })
    submit()
    await waitFor(() => expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled())
    expect(writes).toEqual([])
  })

  it('reads back after an uncertain write and requires reviewing before retry', async () => {
    let reads = 0
    let calls = 0
    server.use(
      http.get(`${base}/departments/${departmentId}`, () => {
        reads += 1
        return envelope(current)
      }),
      http.patch(`${base}/departments/${departmentId}`, async ({ request }) => {
        calls += 1
        current = { ...current, ...((await request.json()) as object) }
        return HttpResponse.json({ success: false, error: { code: 'SERVICE.UNAVAILABLE' } }, { status: 503 })
      })
    )
    const { onClose } = mount()
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Platform' } })
    submit()
    await screen.findByRole('checkbox', { name: 'I reviewed the latest department data' })
    expect(reads).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
    submit()
    expect(calls).toBe(1)
    fireEvent.click(screen.getByRole('checkbox', { name: 'I reviewed the latest department data' }))
    submit()
    await waitFor(() => expect(onClose).toHaveBeenCalledOnce())
    expect(calls).toBe(1)
  })
})
