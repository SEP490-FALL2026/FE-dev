import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, expect, it, vi } from 'vitest'
import type { TaskResponseDtoDataTask } from '~/shared/api/generated/model'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { ProvisioningActionDialog } from './components/provisioning-action-dialog'
import { taskActions } from './task-actions'

vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))
const request = vi.mocked(customAxios)
const task = {
  id: 'task-1',
  kind: 'GRANT',
  channel: 'MANUAL',
  status: 'IN_PROGRESS',
  subscriptionId: 'sub-1',
  plan: { provisioningType: 'K4' },
  availableDecisions: []
} as unknown as TaskResponseDtoDataTask
const key = {
  id: 'key-1',
  subscriptionId: 'sub-1',
  masked: '••••-1234',
  status: 'IN_STORE',
  withdrawnAt: null as string | null
}
let keys = [key]
let rejectKey = false
beforeEach(async () => {
  vi.resetAllMocks()
  keys = [key]
  rejectKey = false
  await setAppLanguage('en', false)
  request.mockImplementation(async (config) => {
    if (config.method === 'POST') {
      if (rejectKey) {
        keys = []
        throw { isAxiosError: true, response: { status: 409, data: { error: { code: 'LICENSE_KEY.NOT_IN_STORE' } } } }
      }
      return { success: true, data: null }
    }
    return { data: { items: keys, pagination: { page: 1, pageSize: 20, totalItems: keys.length, totalPages: 1 } } }
  })
})
function open(action: 'complete' | 'revocation' = 'complete', currentTask = task) {
  const close = vi.fn()
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      <ProvisioningActionDialog task={currentTask} action={action} onClose={close} />
    </QueryClientProvider>
  )
  return close
}
const posts = () => request.mock.calls.filter(([config]) => config.method === 'POST')
function evidence() {
  fireEvent.change(screen.getByLabelText('Evidence'), { target: { value: '  Verified on the company device  ' } })
}

it('loads only masked available keys of the task subscription and requires a choice', async () => {
  open()
  evidence()
  expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled()
  fireEvent.click(await screen.findByRole('combobox', { name: 'License key' }))
  fireEvent.click(await screen.findByRole('option', { name: /1234/ }))
  await waitFor(() => expect(screen.getByRole('button', { name: 'Confirm' })).toBeEnabled())
  fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
  await waitFor(() => expect(posts()).toHaveLength(1))
  expect(posts()[0][0].data).toEqual({ evidence: 'Verified on the company device', licenseKeyId: 'key-1' })
  expect(request.mock.calls.find(([config]) => config.method === 'GET')![0].params).toEqual({
    subscriptionId: 'sub-1',
    status: 'IN_STORE',
    withdrawn: 'false',
    page: 1,
    pageSize: 20
  })
  expect(request.mock.calls.some(([config]) => config.url?.includes('/reveal'))).toBe(false)
})
it('blocks completion when the task has no subscription', () => {
  open('complete', { ...task, subscriptionId: null })
  evidence()
  expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled()
  expect(request).not.toHaveBeenCalled()
})
it('does not offer withdrawn or foreign-subscription keys', async () => {
  keys = [
    { ...key, withdrawnAt: '2026-11-10' },
    { ...key, id: 'foreign', subscriptionId: 'sub-2' }
  ]
  open()
  expect(await screen.findByText(/No available keys/)).toBeInTheDocument()
  evidence()
  expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled()
})
it('preserves evidence and invalidates the chosen key after a concurrent assignment', async () => {
  rejectKey = true
  const close = open()
  evidence()
  fireEvent.click(await screen.findByRole('combobox', { name: 'License key' }))
  fireEvent.click(await screen.findByRole('option', { name: /1234/ }))
  await waitFor(() => expect(screen.getByRole('button', { name: 'Confirm' })).toBeEnabled())
  fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
  expect(await screen.findByText(/No available keys/)).toBeInTheDocument()
  expect(screen.getByLabelText('Evidence')).toHaveValue('  Verified on the company device  ')
  expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled()
  expect(close).not.toHaveBeenCalled()
})
it('offers K4 revocation and returns the key to the pool by default', async () => {
  expect(taskActions({ ...task, kind: 'REVOKE' })).toContain('revocation')
  open('revocation', { ...task, kind: 'REVOKE' })
  evidence()
  fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
  await waitFor(() => expect(posts()).toHaveLength(1))
  expect(posts()[0][0].data).toEqual({
    completion: 'KEY_DEACTIVATED',
    evidence: 'Verified on the company device',
    keyDisposition: 'RETURN_TO_STORE'
  })
})
it('requires a withdrawal reason and sends it only for withdrawal', async () => {
  open('revocation', { ...task, kind: 'REVOKE' })
  evidence()
  fireEvent.click(screen.getByRole('combobox', { name: 'Key after revocation' }))
  fireEvent.click(screen.getByRole('option', { name: 'Withdraw from store' }))
  expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled()
  fireEvent.change(screen.getByLabelText('Key withdrawal reason'), {
    target: { value: '  Vendor key cannot be transferred  ' }
  })
  fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
  await waitFor(() => expect(posts()).toHaveLength(1))
  expect(posts()[0][0].data).toEqual({
    completion: 'KEY_DEACTIVATED',
    evidence: 'Verified on the company device',
    keyDisposition: 'WITHDRAW',
    withdrawalReason: 'Vendor key cannot be transferred'
  })
})

it('completes an extension without assigning a key or offering revocation', async () => {
  const extension = { ...task, kind: 'EXTEND' as const }
  expect(taskActions(extension)).toContain('complete')
  expect(taskActions(extension)).not.toContain('revocation')
  open('complete', extension)
  evidence()
  expect(screen.queryByRole('combobox', { name: 'License key' })).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
  await waitFor(() => expect(posts()).toHaveLength(1))
  expect(posts()[0][0].data).toEqual({ evidence: 'Verified on the company device' })
})
