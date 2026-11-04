import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, expect, it, vi } from 'vitest'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { OffboardingDetails } from './components/offboarding-details'

vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))
const request = vi.mocked(customAxios)
let group = true
beforeEach(async () => {
  vi.resetAllMocks()
  group = true
  await setAppLanguage('en', false)
  request.mockImplementation(async (config) => {
    if (config.method === 'POST') return { data: {} }
    if (config.url?.endsWith('/me')) return { data: { roles: ['IT_ADMIN'] } }
    if (config.url?.endsWith('/case-1'))
      return {
        data: {
          employee: { id: 'departing-employee', fullName: 'Departing employee' },
          state: 'LEFT',
          lastWorkingDay: '2026-11-01',
          blockers: {},
          checklist: {},
          accountLock: { note: 'Locked' }
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
              accessRunsOnUntil: '2026-12-31',
              handover: {
                dutyId: 'duty-1',
                status: 'OPEN',
                role: 'DEPARTMENT_HEAD',
                confirmer: { fullName: 'Head Person', employeeCode: 'HEAD-1' },
                waitingReason: 'NO_SUCCESSOR',
                dueOn: '2026-11-05',
                overdue: true,
                flaggedUnconfirmed: true
              }
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
it('opens the right’s exact handover duty and refuses confirmation for another role', async () => {
  const original = request.getMockImplementation()!
  request.mockImplementation(async (...args) => {
    if (args[0].url?.endsWith('/handover-duties/duty-1'))
      return { data: { id: 'duty-1', role: 'DEPARTMENT_HEAD', status: 'OPEN', canConfirm: true } }
    return original(...args)
  })
  mount()
  fireEvent.click(await screen.findByRole('button', { name: 'Review handover duty' }))
  const dialog = screen.getByRole('dialog')
  expect(await within(dialog).findByText('This duty is no longer available for your confirmation.')).toBeInTheDocument()
  expect(within(dialog).getByRole('button', { name: 'Record IT handover' })).toBeDisabled()
  expect(request.mock.calls.some(([config]) => config.url?.endsWith('/handover-duties/duty-1'))).toBe(true)
  expect(request.mock.calls.some(([config]) => config.method === 'POST')).toBe(false)
})
it('shows the plan instructions and returned handover context without treating its due date as a removal gate', async () => {
  mount()
  expect(await screen.findByText('Export workspace before removal')).toBeInTheDocument()
  expect(screen.getByText(/Head Person/)).toBeInTheDocument()
  expect(screen.getByText(/Handover confirmation due/)).toBeInTheDocument()
  expect(screen.getByText(/Access continues until/)).toBeInTheDocument()
  expect(screen.getByText('Waiting for a successor')).toBeInTheDocument()
  expect(screen.getByText('Handover confirmation overdue')).toBeInTheDocument()
  expect(screen.getByText('Revocation continued without handover confirmation')).toBeInTheDocument()
})
