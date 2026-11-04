import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it } from 'vitest'
import { i18n, setAppLanguage } from '~/shared/i18n/i18n'
import { itTransfers } from '~/shared/i18n/locales/en/it-transfers'
import { ItTransfersView } from './views/it-transfers-view'

const employeeId = '00000000-0000-4000-8000-000000000001'
const successorId = '00000000-0000-4000-8000-000000000002'
const transfer = {
  id: 'transfer-1',
  employee: { id: employeeId, employeeCode: 'EMP001', fullName: 'Alex Nguyen' },
  from: { department: { id: 'dept-1', code: 'OLD', name: 'Operations' } },
  to: { department: { id: 'dept-2', code: 'NEW', name: 'Engineering' } },
  effectiveOn: '2026-11-03',
  status: 'EFFECTIVE',
  grounds: null,
  headSuccessor: null,
  recordedByAppUserId: null,
  recordedByProcedure: true,
  recordedAt: '2026-11-01T01:00:00Z',
  effectiveAt: '2026-11-03T00:00:00Z',
  cancellation: null,
  closure: null
}
const page = (items: unknown[], totalItems = items.length) => ({
  success: true,
  data: { items, pagination: { page: 1, pageSize: 20, totalItems, totalPages: Math.ceil(totalItems / 20) } }
})
const duty = {
  assignmentId: 'assignment-1',
  accountIdentifier: 'robot@example.invalid',
  plan: { planId: 'plan-1', planName: 'Team', applicationName: 'Workspace' },
  owningDepartment: { id: 'dept-1', code: 'OLD', name: 'Operations' },
  responsible: { employeeId, employeeCode: 'EMP001', fullName: 'Alex Nguyen' },
  dueOn: '2026-11-03',
  fileKind: 'TRANSFER',
  fileId: 'transfer-1',
  overdue: false
}
const handover = {
  id: 'handover-1',
  assignmentId: 'assignment-1',
  application: { id: 'application-1', name: 'Workspace' },
  plan: { id: 'plan-1', name: 'Team' },
  employee: transfer.employee,
  source: 'TRANSFER_REVIEW',
  role: 'IT_ADMIN',
  status: 'OPEN',
  dataLoss: true,
  dueOn: '2026-11-03',
  overdue: false,
  flaggedUnconfirmed: false,
  waitingReason: null,
  canConfirm: true,
  noticeText: 'Export the shared project before removal.',
  confirmer: { id: 'it-user', employeeCode: 'IT01', fullName: 'IT Operator' },
  confirmation: null,
  cancellation: null,
  createdAt: '2026-11-02T00:00:00Z'
}
const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
beforeEach(() => {
  server.use(
    http.get('*/api/v1/me', () =>
      HttpResponse.json({ success: true, data: { roles: ['IT_ADMIN'], employee: { id: 'it-user' } } })
    ),
    http.get('*/api/v1/department-transfers/transfer-1', () => HttpResponse.json({ success: true, data: transfer })),
    http.get('*/api/v1/service-account-duties', () => HttpResponse.json(page([]))),
    http.get('*/api/v1/handover-duties', () => HttpResponse.json(page([])))
  )
})
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
async function mount(initialId?: string) {
  i18n.addResourceBundle('en', 'itTransfers', itTransfers, true, true)
  await setAppLanguage('en', false)
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  render(
    <QueryClientProvider client={client}>
      <ItTransfersView initialId={initialId} />
    </QueryClientProvider>
  )
}

it('uses server filters and pagination without offering HR event creation', async () => {
  const requests: URL[] = []
  server.use(
    http.get('*/api/v1/department-transfers', ({ request }) => {
      requests.push(new URL(request.url))
      return HttpResponse.json(page([transfer], 41))
    })
  )
  await mount()
  expect(await screen.findByText('Alex Nguyen')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Next' }))
  await waitFor(() => expect(requests.at(-1)?.searchParams.get('page')).toBe('2'))
  fireEvent.change(screen.getByLabelText('Effective from'), { target: { value: '2026-11-01' } })
  fireEvent.click(screen.getByRole('button', { name: 'Apply filters' }))
  await waitFor(() => expect(requests.at(-1)?.searchParams.get('effectiveFrom')).toBe('2026-11-01'))
  expect(requests.at(-1)?.searchParams.get('page')).toBe('1')
  expect(screen.queryByRole('button', { name: /create|record|reschedule/i })).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'View transfer' }))
  fireEvent.click(await screen.findByRole('button', { name: 'Back to transfers' }))
  expect(screen.getByLabelText('Effective from')).toHaveValue('2026-11-01')
})

it('changes responsibility only for duties belonging to the selected transfer', async () => {
  server.use(
    http.get('*/api/v1/service-account-duties', () =>
      HttpResponse.json(
        page([
          duty,
          {
            ...duty,
            assignmentId: 'other',
            accountIdentifier: 'other@example.invalid',
            fileKind: 'OFFBOARDING',
            fileId: 'offboarding-1'
          }
        ])
      )
    )
  )
  await mount('transfer-1')
  const account = await screen.findByText('robot@example.invalid')
  fireEvent.click(within(account.closest('article')!).getByRole('button', { name: 'Change responsible person' }))
  expect(
    within(screen.getByText('other@example.invalid').closest('article')!).getByRole('button', {
      name: 'Change responsible person'
    })
  ).toBeDisabled()
  let payload: unknown
  server.use(
    http.post('*/api/v1/license-assignments/assignment-1/responsible-changes', async ({ request }) => {
      payload = await request.json()
      return HttpResponse.json({ success: true, data: null })
    })
  )
  fireEvent.change(screen.getByLabelText('New responsible employee ID'), { target: { value: successorId } })
  fireEvent.change(screen.getByLabelText('Effective date'), { target: { value: '2026-11-03' } })
  fireEvent.click(screen.getByRole('button', { name: 'Save responsibility change' }))
  await waitFor(() => expect(payload).toEqual({ employeeId: successorId, effectiveFrom: '2026-11-03' }))
})

it('blocks closure before the transfer is effective', async () => {
  server.use(
    http.get('*/api/v1/department-transfers/transfer-1', () =>
      HttpResponse.json({ success: true, data: { ...transfer, status: 'PENDING', effectiveAt: null } })
    )
  )
  await mount('transfer-1')
  expect(await screen.findByRole('button', { name: 'Close transfer' })).toBeDisabled()
})

it('keeps closure blocked after an uncertain write and rereads the transfer', async () => {
  let writes = 0
  await mount('transfer-1')
  server.use(
    http.post('*/api/v1/department-transfers/transfer-1/closure', () => {
      writes++
      return HttpResponse.json({ error: { code: 'SERVICE_UNAVAILABLE' } }, { status: 503 })
    })
  )
  fireEvent.click(await screen.findByRole('button', { name: 'Close transfer' }))
  fireEvent.click(screen.getByRole('button', { name: 'Confirm closure' }))
  await screen.findByText('The result is uncertain. Close this form and refresh the transfer before trying again.')
  expect(screen.getByRole('button', { name: 'Confirm closure' })).toBeDisabled()
  expect(writes).toBe(1)
})

it('closes an effective transfer once and shows the server-confirmed closure', async () => {
  let writes = 0
  let closed = false
  let readCount = 0
  let release = () => {}
  const gate = new Promise<void>((resolve) => {
    release = resolve
  })
  server.use(
    http.get('*/api/v1/department-transfers/transfer-1', () => {
      readCount++
      return HttpResponse.json({
        success: true,
        data: {
          ...transfer,
          closure: closed ? { closedAt: '2026-11-03T12:00:00Z', closedByAppUserId: 'it-user' } : null
        }
      })
    }),
    http.post('*/api/v1/department-transfers/transfer-1/closure', async ({ request }) => {
      writes++
      expect(await request.text()).toBe('')
      await gate
      closed = true
      return HttpResponse.json({
        success: true,
        data: { ...transfer, closure: { closedAt: '2026-11-03T12:00:00Z', closedByAppUserId: 'it-user' } }
      })
    })
  )
  await mount('transfer-1')
  fireEvent.click(await screen.findByRole('button', { name: 'Close transfer' }))
  const confirm = screen.getByRole('button', { name: 'Confirm closure' })
  fireEvent.click(confirm)
  fireEvent.click(confirm)
  await waitFor(() => expect(writes).toBe(1))
  expect(confirm).toBeDisabled()
  release()
  expect(await screen.findByText('Technical work closed', { exact: false })).toBeInTheDocument()
  expect(readCount).toBeGreaterThan(1)
  expect(screen.queryByRole('button', { name: 'Close transfer' })).not.toBeInTheDocument()
})

it('prevents choosing the current person and blocks retry after an uncertain responsibility change', async () => {
  let writes = 0
  server.use(
    http.get('*/api/v1/service-account-duties', () => HttpResponse.json(page([duty]))),
    http.post('*/api/v1/license-assignments/assignment-1/responsible-changes', () => {
      writes++
      return HttpResponse.json({ error: { code: 'SERVICE_UNAVAILABLE' } }, { status: 503 })
    })
  )
  await mount('transfer-1')
  fireEvent.click(await screen.findByRole('button', { name: 'Change responsible person' }))
  fireEvent.change(screen.getByLabelText('New responsible employee ID'), { target: { value: employeeId } })
  expect(screen.getByRole('button', { name: 'Save responsibility change' })).toBeDisabled()
  fireEvent.change(screen.getByLabelText('New responsible employee ID'), { target: { value: successorId } })
  fireEvent.change(screen.getByLabelText('Effective date'), { target: { value: '2026-11-03' } })
  fireEvent.click(screen.getByRole('button', { name: 'Save responsibility change' }))
  await screen.findByText('The result is uncertain. Close this form and refresh responsibilities before trying again.')
  expect(screen.getByLabelText('New responsible employee ID')).toHaveValue(successorId)
  expect(screen.getByRole('button', { name: 'Save responsibility change' })).toBeDisabled()
  expect(writes).toBe(1)
})

it('confirms a current IT transfer handover with HANDLED and shows its notice', async () => {
  let payload: unknown
  server.use(
    http.get('*/api/v1/handover-duties', () => HttpResponse.json(page([handover]))),
    http.get('*/api/v1/handover-duties/handover-1', () => HttpResponse.json({ success: true, data: handover })),
    http.post('*/api/v1/handover-duties/handover-1/confirmations', async ({ request }) => {
      payload = await request.json()
      return HttpResponse.json({ success: true, data: { ...handover, status: 'CONFIRMED', canConfirm: false } })
    })
  )
  await mount('transfer-1')
  fireEvent.click(await screen.findByRole('button', { name: 'Review handover' }))
  expect(await screen.findByText('Export the shared project before removal.')).toBeInTheDocument()
  await waitFor(() => expect(screen.getByRole('button', { name: 'Confirm handled' })).toBeEnabled())
  fireEvent.click(screen.getByRole('button', { name: 'Confirm handled' }))
  await waitFor(() => expect(payload).toEqual({ value: 'HANDLED' }))
})

it('keeps a department head handover read-only even when the viewer can confirm in another role', async () => {
  server.use(
    http.get('*/api/v1/handover-duties', () => HttpResponse.json(page([{ ...handover, role: 'DEPARTMENT_HEAD' }]))),
    http.get('*/api/v1/handover-duties/handover-1', () =>
      HttpResponse.json({ success: true, data: { ...handover, role: 'DEPARTMENT_HEAD' } })
    )
  )
  await mount('transfer-1')
  fireEvent.click(await screen.findByRole('button', { name: 'Review handover' }))
  await screen.findByText('This handover is read-only for you or is no longer open.')
  expect(screen.getByRole('button', { name: 'Confirm handled' })).toBeDisabled()
})
