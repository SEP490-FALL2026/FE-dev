import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, expect, it, vi } from 'vitest'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { OffboardingDetails } from './components/offboarding-details'

vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))
const request = vi.mocked(customAxios)
let group = true
let accessBlocked = true
let caseState = 'LEFT'
let caseOverrides: Record<string, unknown> = {}
beforeEach(async () => {
  vi.resetAllMocks()
  group = true
  accessBlocked = true
  caseState = 'LEFT'
  caseOverrides = {}
  await setAppLanguage('en', false)
  request.mockImplementation(async (config) => {
    if (config.method === 'POST') return { data: {} }
    if (config.url?.endsWith('/me')) return { data: { roles: ['IT_ADMIN'] } }
    if (config.url?.endsWith('/it-admins'))
      return {
        data: {
          items: [
            { employeeId: 'departing-employee', employeeCode: 'IT-1', fullName: 'Departing employee' },
            { employeeId: 'it-2', employeeCode: 'IT-2', fullName: 'Other IT Admin' }
          ],
          pagination: { totalItems: 2 }
        }
      }
    if (config.url?.endsWith('/case-1'))
      return {
        data: {
          employee: { id: 'departing-employee', fullName: 'Departing employee' },
          state: caseState,
          accessBlocked,
          closed: false,
          lastWorkingDay: '2026-11-01',
          heldRights: 1,
          revocation: { dueOn: '2026-11-02', overdue: false, rightsWithoutCompletedTask: 1 },
          blockers: {},
          checklist: { dataHandover: { state: 'DONE' }, accountLock: { state: 'DONE' } },
          accountLock: { recordedAt: '2026-11-02T03:00:00Z', note: 'Locked' },
          mailboxLock: null,
          itHandover: null,
          closure: null,
          ...caseOverrides
        }
      }
    if (config.url?.endsWith('/open-requests'))
      return {
        data: {
          items: [
            { requestId: 'request-1', group, cancellable: true, state: 'EXECUTING', plan: { planName: 'Team plan' } }
          ],
          pagination: { totalItems: 1 }
        }
      }
    if (config.url?.endsWith('/rights'))
      return {
        data: {
          items: [
            {
              assignmentId: 'right-1',
              application: { name: 'Data tool' },
              plan: { name: 'Paid plan' },
              revocable: true,
              dataLossOnRemoval: true,
              revocationNote: 'Export workspace before removal',
              accessRunsOnUntil: '2026-12-31'
            }
          ],
          pagination: { totalItems: 1 }
        }
      }
    return { data: { items: [], pagination: { totalItems: 0 } } }
  })
})
function mount() {
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      <OffboardingDetails id='case-1' onBack={vi.fn()} />
    </QueryClientProvider>
  )
}
async function openCancellation() {
  fireEvent.click(
    await screen.findByRole('button', {
      name: group ? 'Close departing employee’s line' : 'Cancel request for departure'
    })
  )
  const dialog = screen.getByRole('dialog')
  fireEvent.change(within(dialog).getByLabelText('Reason'), { target: { value: '  Employee left  ' } })
  fireEvent.change(within(dialog).getByLabelText('Rollback / invitation recovery evidence (optional)'), {
    target: { value: '  Vendor checked and invitation recovered  ' }
  })
  return dialog
}
it('closes only the departing employee line and preserves other group beneficiaries', async () => {
  mount()
  const dialog = await openCancellation()
  expect(within(dialog).getByText(/Other group members continue/)).toBeInTheDocument()
  fireEvent.click(within(dialog).getByRole('button', { name: 'Confirm' }))
  await waitFor(() => expect(request.mock.calls.some(([config]) => config.method === 'POST')).toBe(true))
  const posts = request.mock.calls.filter(([config]) => config.method === 'POST')
  expect(posts).toHaveLength(1)
  expect(posts[0][0].url).toContain('/access-requests/request-1/lines/departing-employee/departure-closure')
  expect(posts[0][0].data).toStrictEqual({
    cause: 'BENEFICIARY_LEFT',
    note: 'Employee left',
    evidence: 'Vendor checked and invitation recovered'
  })
})
it('cancels a single request with separate evidence and retains both drafts after rejection', async () => {
  group = false
  const original = request.getMockImplementation()!
  request.mockImplementation(async (...args) => {
    if (args[0].method === 'POST')
      throw { response: { status: 422, data: { error: { code: 'ACCESS_REQUEST.EVIDENCE_REQUIRED' } } } }
    return original(...args)
  })
  mount()
  const dialog = await openCancellation()
  fireEvent.click(within(dialog).getByRole('button', { name: 'Confirm' }))
  await waitFor(() => expect(within(dialog).getByRole('button', { name: 'Confirm' })).toBeEnabled())
  const posts = request.mock.calls.filter(([config]) => config.method === 'POST')
  expect(posts).toHaveLength(1)
  expect(posts[0][0].url).toContain('/access-requests/request-1/cancellation')
  expect(posts[0][0].data).toStrictEqual({
    cause: 'BENEFICIARY_LEFT',
    note: 'Employee left',
    evidence: 'Vendor checked and invitation recovered'
  })
  expect(within(dialog).getByLabelText('Reason')).toHaveValue('  Employee left  ')
  expect(within(dialog).getByLabelText('Rollback / invitation recovery evidence (optional)')).toHaveValue(
    '  Vendor checked and invitation recovered  '
  )
})
it('blocks duplicate group closures while pending and omits unused evidence from the DTO', async () => {
  let reject!: (error: Error) => void
  const original = request.getMockImplementation()!
  request.mockImplementation(async (...args) => {
    if (args[0].method === 'POST')
      return new Promise((_resolve, fail) => {
        reject = fail
      })
    return original(...args)
  })
  mount()
  const dialog = await openCancellation()
  fireEvent.change(within(dialog).getByLabelText('Rollback / invitation recovery evidence (optional)'), {
    target: { value: '   ' }
  })
  const form = within(dialog).getByLabelText('Reason').closest('form')!
  const submitButton = within(dialog).getByRole('button', { name: 'Confirm' })
  fireEvent.submit(form)
  fireEvent.submit(form)
  await waitFor(() => expect(submitButton).toBeDisabled())
  const posts = request.mock.calls.filter(([config]) => config.method === 'POST')
  expect(posts).toHaveLength(1)
  expect(posts[0][0].data).toStrictEqual({ cause: 'BENEFICIARY_LEFT', note: 'Employee left' })
  reject(new Error('conflict'))
  await waitFor(() => expect(within(dialog).getByRole('button', { name: 'Confirm' })).toBeEnabled())
  expect(within(dialog).getByLabelText('Reason')).toHaveValue('  Employee left  ')
})
it('shows the plan instructions and paid-period access without any data handover step', async () => {
  mount()
  expect(await screen.findByText('Export workspace before removal')).toBeInTheDocument()
  expect(screen.getByText(/Access continues until/)).toBeInTheDocument()
  expect(screen.queryByText('Data handover')).not.toBeInTheDocument()
})

it('records the mailbox lock (1b) after 1a with an optional note', async () => {
  mount()
  fireEvent.click(await screen.findByRole('button', { name: 'Record mailbox lock (1b)' }))
  const dialog = screen.getByRole('dialog')
  fireEvent.click(within(dialog).getByRole('button', { name: 'Confirm' }))
  await waitFor(() => expect(request.mock.calls.some(([config]) => config.method === 'POST')).toBe(true))
  const post = request.mock.calls.find(([config]) => config.method === 'POST')![0]
  expect(post.url).toContain('/case-1/mailbox-lock')
  expect(post.data).toStrictEqual({})
})

it('keeps the mailbox lock disabled until 1a is recorded', async () => {
  caseOverrides = { accountLock: null }
  mount()
  expect(await screen.findByRole('button', { name: 'Record mailbox lock (1b)' })).toBeDisabled()
})

it('lists what keeps the system from closing the case and the overdue revocation', async () => {
  caseOverrides = {
    revocation: { dueOn: '2026-11-02', overdue: true, rightsWithoutCompletedTask: 2 },
    blockers: { MAILBOX_LOCK_NOT_RECORDED: 1, PERSONAL_RIGHTS_OPEN: 2 }
  }
  mount()
  expect(await screen.findByText('Mailbox lock (1b) not recorded')).toBeInTheDocument()
  expect(screen.getByText('2 personal rights without a completed revocation task')).toBeInTheDocument()
  expect(screen.getByText(/Revocation is overdue/)).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: /Close case/ })).not.toBeInTheDocument()
})

it('explains the hourly sweep when nothing blocks closure and shows the system closure', async () => {
  mount()
  expect(await screen.findByText(/next hourly check/)).toBeInTheDocument()
})

it('shows a case closed by the system without any action buttons', async () => {
  caseOverrides = {
    closed: true,
    mailboxLock: { recordedAt: '2026-11-03T03:00:00Z', recordedBySystem: true, note: null },
    closure: { closedAt: '2026-11-03T04:00:00Z', closedByAppUserId: null, closedBySystem: true }
  }
  mount()
  expect(await screen.findByText(/Closed by the system on/)).toBeInTheDocument()
  expect(screen.getByText(/Recorded by the system from the last K1 revocation checklist/)).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Record mailbox lock (1b)' })).not.toBeInTheDocument()
})

it('hands every IT responsibility of a leaving IT Admin to another IT Admin', async () => {
  caseOverrides = { itHandover: { state: 'PENDING', subscriptions: 3, applications: 1, handedOver: null } }
  mount()
  expect(await screen.findByText('Still in their name: 3 subscriptions, 1 applications')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Hand over responsibilities' }))
  const dialog = screen.getByRole('dialog')
  fireEvent.click(await within(dialog).findByRole('combobox'))
  expect(screen.queryByRole('option', { name: /Departing employee/ })).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('option', { name: /Other IT Admin/ }))
  fireEvent.click(within(dialog).getByRole('button', { name: 'Hand over' }))
  await waitFor(() => expect(request.mock.calls.some(([config]) => config.method === 'POST')).toBe(true))
  const post = request.mock.calls.find(([config]) => config.method === 'POST')![0]
  expect(post.url).toContain('/offboarding-cases/case-1/it-admin-handover')
  expect(post.data).toStrictEqual({ toItAdminEmployeeId: 'it-2' })
})

it('opens revocations while access is blocked before the employee leaves and sends only the new strict body', async () => {
  caseState = 'HANDING_OVER'
  mount()
  fireEvent.click(await screen.findByRole('checkbox'))
  fireEvent.click(screen.getByRole('button', { name: 'Open selected revocations' }))
  const dialog = screen.getByRole('dialog')
  fireEvent.change(within(dialog).getByRole('textbox'), { target: { value: '  Blocked access checked  ' } })
  fireEvent.click(within(dialog).getByRole('button', { name: 'Confirm' }))
  await waitFor(() => expect(request.mock.calls.some(([config]) => config.method === 'POST')).toBe(true))
  const post = request.mock.calls.find(([config]) => config.method === 'POST')![0]
  expect(post.url).toContain('/case-1/revocations')
  expect(post.data).toStrictEqual({ assignmentIds: ['right-1'], note: 'Blocked access checked' })
})

it('keeps revocations blocked when the backend says access is not blocked', async () => {
  accessBlocked = false
  mount()
  expect(await screen.findByRole('checkbox')).toBeDisabled()
})
