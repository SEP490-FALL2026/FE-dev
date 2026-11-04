import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getMeGetQueryKey } from '~/shared/api/generated/operations/me/me-get'
import { setAppLanguage } from '~/shared/i18n/i18n'
import type { TaskResponseDtoDataTask } from '~/shared/api/generated/model'
import * as api from '~/shared/api/generated/operations/provisioning-tasks'
import { ItProvisioningView } from './views/it-provisioning-view'

vi.mock('~/shared/api/generated/operations/provisioning-tasks', async (original) => ({
  ...(await original<object>()),
  provisioningTaskList: vi.fn(),
  provisioningTaskGet: vi.fn(),
  provisioningTaskClaim: vi.fn(),
  provisioningTaskComplete: vi.fn(),
  provisioningTaskCompleteRevocation: vi.fn()
}))
const task: TaskResponseDtoDataTask = {
  id: 'task-1',
  kind: 'GRANT',
  channel: 'MANUAL',
  status: 'IN_PROGRESS',
  accountIdentifier: 'employee@example.org',
  beneficiary: { employeeId: 'employee-1', employeeCode: 'E1', fullName: 'Employee One' },
  plan: {
    planId: 'plan-1',
    applicationId: 'app-1',
    applicationName: 'Workspace',
    planName: 'Business',
    provisioningType: 'K2'
  },
  availableDecisions: [],
  steps: [],
  revocation: null,
  attempts: 1,
  maxAttempts: 3,
  evidence: null,
  requestId: 'request-1',
  assignmentId: 'assignment-1',
  subscriptionId: null,
  defaultResponsibleEmployeeId: null,
  inGeneralQueue: false,
  createdAt: '2026-10-31T00:00:00Z',
  claimedBy: 'it-1',
  claimedAt: null,
  completedAt: null,
  failedAt: null,
  failureKind: null,
  nextRetryAt: null,
  closedAt: null,
  elapsedSeconds: 0,
  doneWhen: null,
  completedBy: null,
  failedBy: null,
  failureReason: null,
  lastError: null,
  handedOffBy: null,
  handedOffAt: null,
  handOffEvidence: null,
  closedBy: null,
  closeReason: null
}
function setup(authorized = true) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  client.setQueryData(getMeGetQueryKey(), {
    success: true,
    data: {
      managerScope: null,
      appUserId: 'it-1',
      employee: { unplaced: false, id: 'it-employee' },
      roles: authorized ? ['IT_ADMIN'] : []
    }
  })
  return render(
    <QueryClientProvider client={client}>
      <ItProvisioningView initialTaskId='task-1' />
    </QueryClientProvider>
  )
}
beforeEach(async () => {
  vi.clearAllMocks()
  await setAppLanguage('en', false)
  vi.mocked(api.provisioningTaskList).mockResolvedValue({
    success: true,
    message: 'TASK.LISTED',
    data: { items: [], pagination: { page: 1, pageSize: 20, totalItems: 0, totalPages: 0 } }
  })
  vi.mocked(api.provisioningTaskGet).mockResolvedValue({
    success: true,
    message: 'TASK.FOUND',
    data: { task }
  } as Awaited<ReturnType<typeof api.provisioningTaskGet>>)
})
describe('Provisioning API integration', () => {
  it('does not fetch or execute provisioning without an effective IT Admin role', () => {
    setup(false)
    expect(screen.getByText('The IT Admin role is required to execute provisioning.')).toBeInTheDocument()
    expect(api.provisioningTaskGet).not.toHaveBeenCalled()
    expect(screen.queryByRole('button', { name: 'Complete grant' })).not.toBeInTheDocument()
  })
  it('requires claiming work held by another administrator before completion', async () => {
    vi.mocked(api.provisioningTaskGet).mockResolvedValue({
      success: true,
      message: 'TASK.FOUND',
      data: { task: { ...task, claimedBy: 'other-admin' } }
    })
    setup()
    expect(await screen.findByRole('button', { name: 'Claim task' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Complete grant' })).not.toBeInTheDocument()
  })
  it('records K2 already-gone revocation with a note instead of grant evidence', async () => {
    vi.mocked(api.provisioningTaskGet).mockResolvedValue({
      success: true,
      message: 'TASK.FOUND',
      data: { task: { ...task, kind: 'REVOKE' } }
    })
    vi.mocked(api.provisioningTaskCompleteRevocation).mockResolvedValue({
      success: true,
      message: 'TASK.COMPLETED',
      data: null
    })
    setup()
    fireEvent.click(await screen.findByRole('button', { name: 'Complete revocation' }))
    fireEvent.change(screen.getByLabelText('Revocation result'), { target: { value: 'ALREADY_GONE' } })
    fireEvent.change(screen.getByLabelText('Note'), {
      target: { value: 'Provider confirms the account was removed earlier' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    await waitFor(() =>
      expect(api.provisioningTaskCompleteRevocation).toHaveBeenCalledWith('task-1', {
        completion: 'ALREADY_GONE',
        note: 'Provider confirms the account was removed earlier'
      })
    )
    expect(api.provisioningTaskComplete).not.toHaveBeenCalled()
  })
  it('preserves completion evidence when a write fails', async () => {
    vi.mocked(api.provisioningTaskComplete).mockRejectedValue(new Error('network'))
    setup()
    fireEvent.click(await screen.findByRole('button', { name: 'Complete grant' }))
    fireEvent.change(screen.getByLabelText('Evidence'), { target: { value: 'Preserve this verified result' } })
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    await waitFor(() => expect(api.provisioningTaskComplete).toHaveBeenCalled())
    expect(screen.getByLabelText('Evidence')).toHaveValue('Preserve this verified result')
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
  it('loads a linked task and sends entered evidence only after confirmation', async () => {
    vi.mocked(api.provisioningTaskComplete).mockResolvedValue({ success: true, message: 'TASK.COMPLETED', data: null })
    setup()
    expect(await screen.findByText('employee@example.org')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Complete grant' }))
    fireEvent.change(screen.getByLabelText('Evidence'), { target: { value: 'Verified active in provider workspace' } })
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    await waitFor(() =>
      expect(api.provisioningTaskComplete).toHaveBeenCalledWith('task-1', {
        evidence: 'Verified active in provider workspace'
      })
    )
  })
  it('only exposes failure decisions permitted by the server', async () => {
    vi.mocked(api.provisioningTaskGet).mockResolvedValue({
      success: true,
      message: 'TASK.FOUND',
      data: { task: { ...task, status: 'FAILED', availableDecisions: ['HAND_OFF'] } }
    } as Awaited<ReturnType<typeof api.provisioningTaskGet>>)
    setup()
    expect(await screen.findByRole('button', { name: 'Hand off to manual' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Retry task' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Close as failed' })).not.toBeInTheDocument()
  })
})
