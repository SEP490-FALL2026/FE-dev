import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it } from 'vitest'
import { i18n, setAppLanguage } from '~/shared/i18n/i18n'
import { itTransfers } from '~/shared/i18n/locales/en/it-transfers'
import { ItTransfersView } from './views/it-transfers-view'

const employeeId = '00000000-0000-4000-8000-000000000001'
const transfer = {
  id: 'transfer-1',
  employee: { id: employeeId, employeeCode: 'EMP001', fullName: 'Alex Nguyen' },
  from: { department: { id: 'dept-1', code: 'OLD', name: 'Operations' } },
  to: { department: { id: 'dept-2', code: 'NEW', name: 'Engineering' } },
  effectiveOn: '2026-11-03',
  status: 'EFFECTIVE',
  phase: 'IN_GRACE',
  grace: { endsOn: '2026-11-09', reminderOn: '2026-11-05' },
  groundsNote: null,
  headSuccessor: null,
  recordedByAppUserId: null,
  recordedByProcedure: true,
  recordedAt: '2026-11-01T01:00:00Z',
  effectiveAt: '2026-11-03T00:00:00Z',
  cancellation: null,
  closure: null,
  oldRights: [
    {
      assignmentId: 'assignment-1',
      application: { id: 'application-1', name: 'Jira' },
      plan: { id: 'plan-1', name: 'Standard' },
      provisioningType: 'K2',
      state: 'HELD',
      revocation: null,
      regranted: false
    },
    {
      assignmentId: 'assignment-2',
      application: { id: 'application-2', name: 'Figma' },
      plan: { id: 'plan-2', name: 'Pro' },
      provisioningType: 'K1',
      state: 'ENDED',
      revocation: null,
      regranted: true
    }
  ],
  commitmentsReleased: [{ currency: 'USD', amountMinor: '150000' }],
  snapshot: { before: { takenOn: '2026-11-03', rights: [] }, after: null },
  itHandover: null
}
const page = (items: unknown[], totalItems = items.length) => ({
  success: true,
  data: { items, pagination: { page: 1, pageSize: 20, totalItems, totalPages: Math.ceil(totalItems / 20) } }
})
const server = setupServer()
let detail: Record<string, unknown> = transfer
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
beforeEach(() => {
  detail = transfer
  server.use(
    http.get('*/api/v1/me', () =>
      HttpResponse.json({ success: true, data: { roles: ['IT_ADMIN'], employee: { id: 'it-user' } } })
    ),
    http.get('*/api/v1/department-transfers/transfer-1', () => HttpResponse.json({ success: true, data: detail }))
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
  expect(screen.getByText('In grace period')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Next' }))
  await waitFor(() => expect(requests.at(-1)?.searchParams.get('page')).toBe('2'))
  fireEvent.change(screen.getByLabelText('Effective from'), { target: { value: '2026-11-01' } })
  fireEvent.change(screen.getByLabelText('Grace ends before'), { target: { value: '2026-11-12' } })
  fireEvent.click(screen.getByRole('button', { name: 'Apply filters' }))
  await waitFor(() => expect(requests.at(-1)?.searchParams.get('effectiveFrom')).toBe('2026-11-01'))
  expect(requests.at(-1)?.searchParams.get('graceEndsBefore')).toBe('2026-11-12')
  expect(requests.at(-1)?.searchParams.get('page')).toBe('1')
  expect(screen.queryByRole('button', { name: /create|record|reschedule/i })).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'View transfer' }))
  fireEvent.click(await screen.findByRole('button', { name: 'Back to transfers' }))
  expect(screen.getByLabelText('Effective from')).toHaveValue('2026-11-01')
})

it('shows the grace period, old rights and released commitments without any closure or review action', async () => {
  await mount('transfer-1')
  expect(await screen.findByText('Jira')).toBeInTheDocument()
  expect(screen.getByText('Still held')).toBeInTheDocument()
  expect(screen.getByText('Granted again on the same subscription; not revoked')).toBeInTheDocument()
  expect(screen.getByText('Grace period ends')).toBeInTheDocument()
  expect(screen.getByText(/\$1,500\.00/)).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: /close|review|confirm/i })).not.toBeInTheDocument()
})

it('shows the outcome of each old right once the system has closed the transfer', async () => {
  detail = {
    ...transfer,
    phase: 'CLOSED',
    closure: { closedAt: '2026-11-10T02:00:00Z', closedByAppUserId: null, closedBySystem: true },
    snapshot: {
      before: { takenOn: '2026-11-03', rights: [] },
      after: {
        takenOn: '2026-11-10',
        rights: [
          { assignmentId: 'assignment-1', outcome: 'REVOKED' },
          { assignmentId: 'assignment-2', outcome: 'REGRANTED' }
        ]
      }
    }
  }
  await mount('transfer-1')
  expect(await screen.findByText(/Closed by the system on/)).toBeInTheDocument()
  expect(screen.getByText('Revoked')).toBeInTheDocument()
  expect(screen.getByText('Granted again')).toBeInTheDocument()
})

it('says when a departure recorded in the grace period took over the transfer', async () => {
  detail = {
    ...transfer,
    phase: 'SUPERSEDED',
    closure: {
      closedAt: '2026-11-06T02:00:00Z',
      closedByAppUserId: null,
      closedBySystem: true,
      supersededByCaseId: 'case-1'
    }
  }
  await mount('transfer-1')
  expect(await screen.findByText(/Taken over by a departure case/)).toBeInTheDocument()
})

it('hands the responsibilities of a transferred IT Admin to another IT Admin', async () => {
  detail = { ...transfer, itHandover: { state: 'PENDING', subscriptions: 2, applications: 0, handedOver: null } }
  let payload: unknown
  server.use(
    http.get('*/api/v1/it-admins', () =>
      HttpResponse.json(page([{ employeeId: 'it-2', employeeCode: 'IT02', fullName: 'Other IT Admin' }]))
    ),
    http.post('*/api/v1/department-transfers/transfer-1/it-admin-handover', async ({ request }) => {
      payload = await request.json()
      return HttpResponse.json({ success: true, data: null })
    })
  )
  await mount('transfer-1')
  fireEvent.click(await screen.findByRole('button', { name: 'Hand over responsibilities' }))
  const dialog = screen.getByRole('dialog')
  fireEvent.click(await within(dialog).findByRole('combobox'))
  fireEvent.click(await screen.findByRole('option', { name: /Other IT Admin/ }))
  fireEvent.click(within(dialog).getByRole('button', { name: 'Hand over' }))
  await waitFor(() => expect(payload).toEqual({ toItAdminEmployeeId: 'it-2' }))
})
