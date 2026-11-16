import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { OffboardingPanel } from './components/offboarding-panel'
import { LeavePanel } from './components/leave-panel'
import { SuperAdminTransferView } from '../transfer/views/super-admin-transfer-view'

const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
beforeEach(() => setAppLanguage('en', false))
const page = (items: unknown[]) => ({
  success: true,
  data: { items, pagination: { page: 1, pageSize: 20, totalItems: items.length, totalPages: 1 } }
})
function mount(component: React.ReactNode, entry: string) {
  return render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <MemoryRouter initialEntries={[entry]}>{component}</MemoryRouter>
    </QueryClientProvider>
  )
}

it('opens an offboarding deep link with paged rights and change history in place of the list', async () => {
  server.use(
    http.get('*/api/v1/offboarding-cases', () =>
      HttpResponse.json(
        page([{ id: 'other', employee: { fullName: 'Other employee' }, state: 'LEFT', lastWorkingDay: '2026-10-01' }])
      )
    ),
    http.get('*/api/v1/offboarding-cases/:id', () =>
      HttpResponse.json({
        success: true,
        data: {
          id: 'case-1',
          employee: { fullName: 'Departing employee' },
          state: 'HANDING_OVER',
          lastWorkingDay: '2026-11-30',
          departureEffectiveOn: '2026-12-01',
          accessBlocked: false,
          groundsNote: 'Authorized departure',
          blockers: { ACCOUNT_LOCK_NOT_RECORDED: 1 },
          warnings: { registered: { ROLE_HOLDER_NEEDS_REPLACEMENT: 1 }, workspaces: {} },
          heldRights: 1,
          recordedAt: '2026-11-17T01:00:00Z'
        }
      })
    ),
    http.get('*/api/v1/offboarding-cases/:id/rights', () =>
      HttpResponse.json(
        page([
          {
            assignmentId: 'right-1',
            application: { name: 'Jira' },
            plan: { name: 'Standard' },
            revocable: true,
            effectiveFrom: '2026-01-01',
            revocation: { status: 'OPEN' },
            handover: null
          }
        ])
      )
    ),
    http.get('*/api/v1/offboarding-cases/:id/changes', () =>
      HttpResponse.json(
        page([
          {
            id: 'change-1',
            kind: 'LAST_DAY_CHANGED',
            oldLastWorkingDay: '2026-11-29',
            newLastWorkingDay: '2026-11-30',
            reason: 'Approved extension',
            changedAt: '2026-11-17T01:00:00Z'
          }
        ])
      )
    )
  )
  mount(<OffboardingPanel />, '/?offboardingId=case-1')
  expect(await screen.findByText('Authorized departure')).toBeInTheDocument()
  expect(await screen.findByText('Jira')).toBeInTheDocument()
  expect(await screen.findByText('Approved extension')).toBeInTheDocument()
  expect(screen.getByText('Company account lock missing: 1')).toBeInTheDocument()
  expect(screen.getByText('Roles awaiting replacement: 1')).toBeInTheDocument()
  expect(screen.queryByText('Other employee')).not.toBeInTheDocument()
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Back to offboarding' }))
  expect(await screen.findByText('Other employee')).toBeInTheDocument()
})

it('opens transfer details from its URL and shows old rights, grace dates and changes', async () => {
  server.use(
    http.get('*/api/v1/department-transfers', () => HttpResponse.json(page([]))),
    http.get('*/api/v1/department-transfers/:id', () =>
      HttpResponse.json({
        success: true,
        data: {
          id: 'transfer-1',
          employee: { fullName: 'Transferred employee' },
          from: { department: { name: 'Operations' } },
          to: { department: { name: 'Finance' } },
          status: 'EFFECTIVE',
          phase: 'IN_GRACE',
          effectiveOn: '2026-11-16',
          grace: { endsOn: '2026-11-23', reminderOn: '2026-11-20' },
          groundsNote: 'Authorized transfer',
          recordedAt: '2026-11-17T01:00:00Z',
          oldRights: [
            { assignmentId: 'right-1', application: { name: 'Slack' }, plan: { name: 'Pro' }, state: 'HELD' }
          ],
          commitmentsReleased: [{ currency: 'VND', amountMinor: '10000' }],
          snapshot: {
            before: null,
            after: { takenOn: '2026-11-23', rights: [{ assignmentId: 'right-1', outcome: 'REVOKED' }] }
          }
        }
      })
    ),
    http.get('*/api/v1/department-transfers/:id/changes', () =>
      HttpResponse.json(
        page([
          {
            id: 'change-1',
            kind: 'RESCHEDULED',
            oldEffectiveOn: '2026-11-15',
            newEffectiveOn: '2026-11-16',
            reason: 'New start agreed',
            groundsNote: 'Decision',
            changedAt: '2026-11-14T01:00:00Z'
          }
        ])
      )
    )
  )
  mount(<SuperAdminTransferView employeeId='employee-1' onClose={() => {}} />, '/?transferId=transfer-1')
  expect(await screen.findByText('Authorized transfer')).toBeInTheDocument()
  expect(
    within(await screen.findByRole('region', { name: 'Rights from the previous department' })).getByText('Slack')
  ).toBeInTheDocument()
  expect(await screen.findByText('New start agreed')).toBeInTheDocument()
  expect(screen.getByText('Grace period ends')).toBeInTheDocument()
  expect(screen.getByText('Budget commitments released')).toBeInTheDocument()
  expect(screen.getByText('Rights snapshot after closure')).toBeInTheDocument()
  expect(screen.getByText('Revoked')).toBeInTheDocument()
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})

it('loads long leave detail and its change history directly from the URL', async () => {
  server.use(
    http.get('*/api/v1/long-leaves', () => HttpResponse.json(page([]))),
    http.get('*/api/v1/long-leaves/:id', () =>
      HttpResponse.json({
        success: true,
        data: {
          id: 'leave-1',
          employee: { fullName: 'Employee on leave' },
          status: 'ACTIVE',
          startedOn: '2026-11-01',
          approvedReturnOn: '2026-12-01',
          groundsNote: 'Approved long leave',
          startedAt: '2026-10-31T01:00:00Z'
        }
      })
    ),
    http.get('*/api/v1/long-leaves/:id/changes', () =>
      HttpResponse.json(
        page([
          {
            id: 'change-1',
            kind: 'RETURN_DATE_CHANGED',
            oldReturnOn: '2026-11-20',
            newReturnOn: '2026-12-01',
            groundsNote: 'Extended by HR',
            recordedAt: '2026-11-14T01:00:00Z'
          }
        ])
      )
    )
  )
  mount(<LeavePanel />, '/?longLeaveId=leave-1')
  expect(await screen.findByText('Approved long leave')).toBeInTheDocument()
  expect(await screen.findByText('Extended by HR')).toBeInTheDocument()
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})
