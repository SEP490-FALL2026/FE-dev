import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { EmployeeDetail } from './components/employee-detail'
import { EmployeeEventForm, type EmployeeEventKind } from './components/employee-event-form'
import { LeavePanel } from './components/leave-panel'
import { OffboardingPanel } from './components/offboarding-panel'

const employeeId = '11111111-1111-4111-8111-111111111111'
const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
beforeEach(async () => {
  await setAppLanguage('en', false)
})

it('filters the leave list to active leave and keeps creation in the employee profile', async () => {
  let status: string | null = null
  server.use(
    http.get('*/api/v1/long-leaves', ({ request }) => {
      status = new URL(request.url).searchParams.get('status')
      return HttpResponse.json({
        success: true,
        data: { items: [], pagination: { page: 1, pageSize: 20, totalItems: 0, totalPages: 0 } }
      })
    })
  )
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <LeavePanel />
    </QueryClientProvider>
  )
  await waitFor(() => expect(status).toBe('ACTIVE'))
  expect(screen.queryByRole('button', { name: 'Start long leave' })).not.toBeInTheDocument()
})

it('filters offboarding by current state and offers departed employees separately', async () => {
  const states: string[] = []
  server.use(
    http.get('*/api/v1/offboarding-cases', ({ request }) => {
      states.push(new URL(request.url).searchParams.get('state') ?? '')
      return HttpResponse.json({
        success: true,
        data: { items: [], pagination: { page: 1, pageSize: 20, totalItems: 0, totalPages: 0 } }
      })
    })
  )
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <OffboardingPanel />
    </QueryClientProvider>
  )
  await waitFor(() => expect(states).toContain('HANDING_OVER'))
  fireEvent.change(screen.getByLabelText('Departure status'), { target: { value: 'LEFT' } })
  await waitFor(() => expect(states).toContain('LEFT'))
  expect(screen.queryByRole('button', { name: 'Record offboarding' })).not.toBeInTheDocument()
})

it.each<[EmployeeEventKind, string]>([
  ['offboarding', '/api/v1/offboarding-cases'],
  ['transfer', '/api/v1/department-transfers']
])('submits %s for the fixed employee', async (kind, endpoint) => {
  let received: unknown
  const departmentId = '22222222-2222-4222-8222-222222222222'
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
    http.get('*/api/v1/employees', () =>
      HttpResponse.json({
        success: true,
        data: {
          items: [],
          pagination: { page: 1, pageSize: 100, totalItems: 0, totalPages: 0 }
        }
      })
    ),
    http.post(`*${endpoint}`, async ({ request }) => {
      received = await request.json()
      return HttpResponse.json({ success: false, error: { code: 'VALIDATION_ERROR' } }, { status: 422 })
    })
  )
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      <EmployeeEventForm
        kind={kind}
        employee={{ id: employeeId, employeeCode: 'EMP-01', fullName: 'Mai Nguyen' }}
        onClose={vi.fn()}
      />
    </QueryClientProvider>
  )
  expect(screen.getByLabelText('Employee')).toBeDisabled()
  if (kind === 'transfer') {
    await screen.findByRole('option', { name: /Engineering/ })
    fireEvent.change(screen.getByLabelText('Destination department'), { target: { value: departmentId } })
    fireEvent.change(screen.getByLabelText('Effective date'), { target: { value: '2026-12-01' } })
  } else {
    fireEvent.change(screen.getByLabelText('Last working day'), { target: { value: '2026-12-01' } })
  }
  fireEvent.change(screen.getByLabelText('Authoritative basis'), { target: { value: 'Decision 123' } })
  fireEvent.click(screen.getByRole('button', { name: 'Save' }))
  await waitFor(() =>
    expect(received).toMatchObject({
      employeeId,
      groundsNote: 'Decision 123',
      ...(kind === 'transfer'
        ? { toDepartmentId: departmentId, effectiveOn: '2026-12-01' }
        : { lastWorkingDay: '2026-12-01', accessBlockMode: 'WITH_LAST_DAY' })
    })
  )
})

it('records leave for the employee whose profile is open', async () => {
  let received: unknown
  server.use(
    http.get('*/api/v1/employees/:id', () =>
      HttpResponse.json({
        success: true,
        data: {
          id: employeeId,
          employeeCode: 'EMP-01',
          fullName: 'Mai Nguyen',
          status: 'ACTIVE',
          workState: 'WORKING',
          hireDate: '2025-01-01',
          employmentType: 'STAFF',
          workEmail: null,
          jobTitle: null,
          department: null,
          unplaced: true,
          account: null,
          placements: [],
          placementsHasMore: false
        }
      })
    ),
    http.post('*/api/v1/long-leaves', async ({ request }) => {
      received = await request.json()
      return HttpResponse.json({ success: false, error: { code: 'VALIDATION_ERROR' } }, { status: 422 })
    })
  )
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      <MemoryRouter>
        <EmployeeDetail employeeId={employeeId} onClose={vi.fn()} onCorrect={vi.fn()} />
      </MemoryRouter>
    </QueryClientProvider>
  )
  fireEvent.click(await screen.findByRole('button', { name: 'Start long leave' }))
  expect(screen.getByLabelText('Employee')).toBeDisabled()
  expect(screen.getByLabelText('Employee')).toHaveValue('EMP-01 — Mai Nguyen')
  fireEvent.change(screen.getByLabelText('Leave start date'), { target: { value: '2026-12-01' } })
  fireEvent.change(screen.getByLabelText('Approved return date'), { target: { value: '2027-01-01' } })
  fireEvent.change(screen.getByLabelText('Authoritative basis'), { target: { value: 'Decision 123' } })
  fireEvent.click(screen.getByRole('button', { name: 'Save' }))
  await waitFor(() =>
    expect(received).toEqual({
      employeeId,
      startedOn: '2026-12-01',
      approvedReturnOn: '2027-01-01',
      groundsNote: 'Decision 123'
    })
  )
})
