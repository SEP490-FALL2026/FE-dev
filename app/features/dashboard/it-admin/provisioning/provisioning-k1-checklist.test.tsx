import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, expect, it, vi } from 'vitest'
import type { TaskResponseDtoDataTask } from '~/shared/api/generated/model'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { ProvisioningActionDialog } from './components/provisioning-action-dialog'

vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))
const request = vi.mocked(customAxios)

const departureSteps = [
  'MAILBOX_PASSWORD_RESET',
  'SOFTWARE_FORGOT_PASSWORD',
  'SESSIONS_SIGNED_OUT',
  'RENEWAL_DISABLED',
  'EVIDENCE_RECORDED',
  'MAILBOX_LOCKED'
] as const
const checklist = (codes: readonly string[], variant = 'DEPARTURE') => ({
  variant,
  items: codes.map((code, index) => ({ code, label: code, order: index + 1, doneAt: null }))
})
const task = {
  id: 'task-1',
  kind: 'REVOKE',
  status: 'IN_PROGRESS',
  subscriptionId: 'subscription-1',
  plan: { provisioningType: 'K1' },
  // The list was loaded while another K1 seat was still open: 5 steps.
  k1Checklist: checklist(departureSteps.slice(0, 5))
} as unknown as TaskResponseDtoDataTask
let card = checklist(departureSteps.slice(0, 5))

beforeEach(async () => {
  vi.resetAllMocks()
  card = checklist(departureSteps.slice(0, 5))
  await setAppLanguage('en', false)
  request.mockImplementation(async (config) => {
    if (config.method === 'POST') return { success: true, data: {} }
    if (config.url?.endsWith('/provisioning-tasks/task-1'))
      return { success: true, data: { task: { ...task, k1Checklist: card } } }
    return { success: true, data: { items: [], pagination: { totalItems: 0 } } }
  })
})

function mount() {
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      <ProvisioningActionDialog task={task} action='revocation' onClose={vi.fn()} />
    </QueryClientProvider>
  )
  return screen.getByRole('dialog')
}

function fillRevocation(dialog: HTMLElement) {
  fireEvent.change(within(dialog).getByLabelText('Paid through'), { target: { value: '2026-11-30' } })
  fireEvent.change(within(dialog).getByLabelText('Evidence'), { target: { value: 'Renewal turned off' } })
}

it('reads the card again and sends every ticked step with its time, in order', async () => {
  card = checklist(departureSteps)
  const dialog = mount()
  // The fresh card now has the mailbox lock: this is the last K1 task of the person.
  expect(await within(dialog).findByRole('checkbox', { name: /Lock the mailbox/ })).toBeInTheDocument()
  fillRevocation(dialog)
  const confirm = within(dialog).getByRole('button', { name: 'Confirm' })
  expect(confirm).toBeDisabled()
  within(dialog)
    .getAllByRole('checkbox')
    .forEach((box) => fireEvent.click(box))
  await waitFor(() => expect(confirm).toBeEnabled())
  fireEvent.click(confirm)
  await waitFor(() => expect(request.mock.calls.some(([config]) => config.method === 'POST')).toBe(true))
  const post = request.mock.calls.find(([config]) => config.method === 'POST')![0]
  expect(post.url).toContain('/provisioning-tasks/task-1/revocation-completion')
  const body = post.data as { k1Checklist: { items: { code: string; done: boolean; doneAt: string }[] } }
  expect(body.k1Checklist.items.map((item) => item.code)).toStrictEqual([...departureSteps])
  expect(body.k1Checklist.items.every((item) => item.done && !Number.isNaN(Date.parse(item.doneAt)))).toBe(true)
})

it('refuses a step ticked earlier than the step before it', async () => {
  const dialog = mount()
  await within(dialog).findAllByRole('checkbox')
  fillRevocation(dialog)
  within(dialog)
    .getAllByRole('checkbox')
    .forEach((box) => fireEvent.click(box))
  fireEvent.change(within(dialog).getByLabelText(/Time done: Reset the mailbox password/), {
    target: { value: '2026-11-10T10:00' }
  })
  fireEvent.change(within(dialog).getByLabelText(/Time done: Use “Forgot password”/), {
    target: { value: '2026-11-10T09:00' }
  })
  expect(within(dialog).getByText(/must be done at or after the time of the step before it/)).toBeInTheDocument()
  expect(within(dialog).getByRole('button', { name: 'Confirm' })).toBeDisabled()
})

it('accepts a step done before the task was created, such as the reset at the block moment', async () => {
  card = checklist(['RENEWAL_DISABLED', 'EVIDENCE_RECORDED'], 'STILL_EMPLOYED')
  const dialog = mount()
  expect(await within(dialog).findByText('Checklist for an employee who still works here')).toBeInTheDocument()
  fillRevocation(dialog)
  within(dialog)
    .getAllByRole('checkbox')
    .forEach((box) => fireEvent.click(box))
  fireEvent.change(within(dialog).getByLabelText(/Time done: Turn off renewal/), {
    target: { value: '2020-01-01T08:00' }
  })
  await waitFor(() => expect(within(dialog).getByRole('button', { name: 'Confirm' })).toBeEnabled())
})
