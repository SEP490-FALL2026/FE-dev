import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getMeGetQueryKey } from '~/shared/api/generated/operations/me/me-get'
import { setAppLanguage } from '~/shared/i18n/i18n'
import type { TaskResponseDtoDataTask } from '~/shared/api/generated/model'
import * as api from '~/shared/api/generated/operations/provisioning-tasks'
import { useLicenseKeyList } from '~/shared/api/generated/operations/license-keys/license-key-list'
import { ItProvisioningView } from './views/it-provisioning-view'

vi.mock('~/shared/api/generated/operations/provisioning-tasks', async (original) => ({
  ...(await original<object>()),
  provisioningTaskList: vi.fn(),
  provisioningTaskGet: vi.fn(),
  provisioningTaskClaim: vi.fn(),
  provisioningTaskComplete: vi.fn(),
  provisioningTaskCompleteRevocation: vi.fn()
}))
vi.mock('~/shared/api/generated/operations/license-keys/license-key-list', async (original) => ({
  ...(await original<object>()),
  useLicenseKeyList: vi.fn()
}))
const task: TaskResponseDtoDataTask = {
  k1Checklist: null,
  id: 'task-1',
  kind: 'GRANT',
  channel: 'MANUAL',
  status: 'IN_PROGRESS',
  accountIdentifier: 'employee@example.org',
  beneficiary: { employeeId: 'employee-1', employeeCode: 'E1', fullName: 'Employee One' },
  plan: {
    preRevocationNote: null,
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
  dueOn: null,
  notBefore: null,
  claimableNow: true,
  purchase: null,
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
function setup(authorized = true, initialTaskId: string | undefined = 'task-1') {
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
      <ItProvisioningView initialTaskId={initialTaskId || undefined} />
    </QueryClientProvider>
  )
}
beforeEach(async () => {
  vi.clearAllMocks()
  await setAppLanguage('en', false)
  vi.mocked(useLicenseKeyList).mockReturnValue({
    isPending: false,
    isError: false,
    data: {
      data: {
        items: [{ id: 'key-1', subscriptionId: 'sub-1', status: 'IN_STORE', withdrawnAt: null, masked: '****-1234' }],
        pagination: { totalItems: 1 }
      }
    }
  } as never)
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
  it('opens the task queue directly from provisioning', async () => {
    setup(true, '')
    fireEvent.click(await screen.findByRole('button', { name: 'Task queue' }))
    await waitFor(() => expect(api.provisioningTaskList).toHaveBeenCalled())
  })
  it('shows task status without the manual channel in the queue', async () => {
    vi.mocked(api.provisioningTaskList).mockResolvedValue({
      success: true,
      message: 'TASK.LISTED',
      data: {
        items: [{ ...task, kind: 'REVOKE' }],
        pagination: { page: 1, pageSize: 20, totalItems: 1, totalPages: 1 }
      }
    } as unknown as Awaited<ReturnType<typeof api.provisioningTaskList>>)
    setup(true, '')
    fireEvent.click(await screen.findByRole('button', { name: 'Task queue' }))
    const row = (await screen.findByText(/Employee One/)).closest('article')!
    expect(within(row).getByText(/Revoke/)).toBeInTheDocument()
    expect(within(row).queryByText(/Manual/)).not.toBeInTheDocument()
  })
  it('hides technical fields and does not offer another claim on a revocation held by the current admin', async () => {
    vi.mocked(api.provisioningTaskGet).mockResolvedValue({
      success: true,
      message: 'TASK.FOUND',
      data: { task: { ...task, kind: 'REVOKE' } }
    })
    setup()
    expect(await screen.findByRole('button', { name: 'Complete revocation' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Claim task' })).not.toBeInTheDocument()
    expect(screen.queryByText('Attempts')).not.toBeInTheDocument()
    expect(screen.queryByText('Channel')).not.toBeInTheDocument()
  })
  it('still permits taking over a revocation held by another admin', async () => {
    vi.mocked(api.provisioningTaskGet).mockResolvedValue({
      success: true,
      message: 'TASK.FOUND',
      data: { task: { ...task, kind: 'REVOKE', claimedBy: 'other-admin' } }
    })
    setup()
    expect(await screen.findByRole('button', { name: 'Claim task' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Complete revocation' })).not.toBeInTheDocument()
  })
  it('replaces claim with completion actions after the server confirms the claim', async () => {
    let currentTask: TaskResponseDtoDataTask = { ...task, kind: 'REVOKE', status: 'QUEUED', claimedBy: null }
    vi.mocked(api.provisioningTaskGet).mockImplementation(async () => ({
      success: true,
      message: 'TASK.FOUND',
      data: { task: currentTask }
    }))
    vi.mocked(api.provisioningTaskClaim).mockImplementation(async () => {
      currentTask = { ...currentTask, status: 'IN_PROGRESS', claimedBy: 'it-1' }
      return { success: true, message: 'TASK.CLAIMED', data: { task: currentTask } }
    })
    setup()
    fireEvent.click(await screen.findByRole('button', { name: 'Claim task' }))
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    expect(await screen.findByRole('button', { name: 'Complete revocation' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Report failure' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Claim task' })).not.toBeInTheDocument()
  })
  it('explains when a revocation waiting for its grace period can be claimed', async () => {
    vi.mocked(api.provisioningTaskGet).mockResolvedValue({
      success: true,
      message: 'TASK.FOUND',
      data: { task: { ...task, kind: 'REVOKE', status: 'QUEUED', claimableNow: false, notBefore: '2026-12-15' } }
    })
    setup()
    expect(await screen.findByText(/12\/15\/2026/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Claim task' })).not.toBeInTheDocument()
  })
  it('requires selecting a masked available key when completing a K4 grant', async () => {
    vi.mocked(api.provisioningTaskGet).mockResolvedValue({
      success: true,
      message: 'TASK.FOUND',
      data: { task: { ...task, subscriptionId: 'sub-1', plan: { ...task.plan!, provisioningType: 'K4' } } }
    })
    vi.mocked(api.provisioningTaskComplete).mockResolvedValue({ success: true, message: 'TASK.COMPLETED', data: null })
    setup()
    fireEvent.click(await screen.findByRole('button', { name: 'Complete grant' }))
    fireEvent.change(screen.getByLabelText('Evidence'), { target: { value: 'Access granted' } })
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled()
    fireEvent.click(screen.getByRole('combobox', { name: 'Available license key' }))
    fireEvent.click(screen.getByRole('option', { name: '****-1234' }))
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    await waitFor(() =>
      expect(api.provisioningTaskComplete).toHaveBeenCalledWith('task-1', {
        evidence: 'Access granted',
        licenseKeyId: 'key-1'
      })
    )
  })
  it('records key withdrawal with its reason for a K4 revocation', async () => {
    vi.mocked(api.provisioningTaskGet).mockResolvedValue({
      success: true,
      message: 'TASK.FOUND',
      data: { task: { ...task, kind: 'REVOKE', claimableNow: true, plan: { ...task.plan!, provisioningType: 'K4' } } }
    })
    vi.mocked(api.provisioningTaskCompleteRevocation).mockResolvedValue({
      success: true,
      message: 'TASK.COMPLETED',
      data: null
    })
    setup()
    fireEvent.click(await screen.findByRole('button', { name: 'Complete revocation' }))
    fireEvent.click(screen.getByRole('combobox', { name: 'Key handling' }))
    fireEvent.click(screen.getByRole('option', { name: 'Withdraw key from stock' }))
    fireEvent.change(screen.getByLabelText('Evidence'), { target: { value: 'Key deactivated with provider' } })
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled()
    fireEvent.change(screen.getByLabelText('Withdrawal reason'), { target: { value: 'Key compromised' } })
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    await waitFor(() =>
      expect(api.provisioningTaskCompleteRevocation).toHaveBeenCalledWith('task-1', {
        completion: 'KEY_DEACTIVATED',
        evidence: 'Key deactivated with provider',
        keyDisposition: 'WITHDRAW',
        withdrawalReason: 'Key compromised'
      })
    )
  })
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
    fireEvent.click(screen.getByRole('combobox', { name: 'Revocation result' }))
    fireEvent.click(screen.getByRole('option', { name: 'Already gone' }))
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
  it('sends a Drive evidence link for a departure revocation', async () => {
    vi.mocked(api.provisioningTaskGet).mockResolvedValue({
      success: true,
      message: 'TASK.FOUND',
      data: {
        task: {
          ...task,
          kind: 'REVOKE',
          revocation: { source: 'DEPARTURE' } as NonNullable<TaskResponseDtoDataTask['revocation']>
        }
      }
    })
    vi.mocked(api.provisioningTaskCompleteRevocation).mockResolvedValue({
      success: true,
      message: 'TASK.COMPLETED',
      data: null
    })
    setup()
    fireEvent.click(await screen.findByRole('button', { name: 'Complete revocation' }))
    expect(screen.getByText('Paste the Drive link to the images showing the completed revocation.')).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Evidence'), {
      target: { value: 'https://drive.google.com/file/d/evidence/view' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    await waitFor(() =>
      expect(api.provisioningTaskCompleteRevocation).toHaveBeenCalledWith('task-1', {
        completion: 'ACCOUNT_REMOVED',
        evidence: 'https://drive.google.com/file/d/evidence/view'
      })
    )
  })
  it('also sends the evidence link and required note when a departing employee account is already gone', async () => {
    vi.mocked(api.provisioningTaskGet).mockResolvedValue({
      success: true,
      message: 'TASK.FOUND',
      data: {
        task: {
          ...task,
          kind: 'REVOKE',
          revocation: { source: 'ABRUPT_DEPARTURE' } as NonNullable<TaskResponseDtoDataTask['revocation']>
        }
      }
    })
    vi.mocked(api.provisioningTaskCompleteRevocation).mockResolvedValue({
      success: true,
      message: 'TASK.COMPLETED',
      data: null
    })
    setup()
    fireEvent.click(await screen.findByRole('button', { name: 'Complete revocation' }))
    fireEvent.click(screen.getByRole('combobox', { name: 'Revocation result' }))
    fireEvent.click(screen.getByRole('option', { name: 'Already gone' }))
    fireEvent.change(screen.getByLabelText('Evidence'), {
      target: { value: 'https://drive.google.com/file/d/evidence/view' }
    })
    fireEvent.change(screen.getByLabelText('Note'), { target: { value: 'Provider confirmed account was removed' } })
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    await waitFor(() =>
      expect(api.provisioningTaskCompleteRevocation).toHaveBeenCalledWith('task-1', {
        completion: 'ALREADY_GONE',
        note: 'Provider confirmed account was removed',
        evidence: 'https://drive.google.com/file/d/evidence/view'
      })
    )
  })
  it('sends the account-removed result with evidence for K2', async () => {
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
    fireEvent.change(screen.getByLabelText('Evidence'), { target: { value: 'Removed from workspace' } })
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    await waitFor(() =>
      expect(api.provisioningTaskCompleteRevocation).toHaveBeenCalledWith('task-1', {
        completion: 'ACCOUNT_REMOVED',
        evidence: 'Removed from workspace'
      })
    )
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
