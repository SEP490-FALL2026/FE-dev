import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { OffboardingActionDialog } from './offboarding-action-dialog'

const mocks = vi.hoisted(() => ({ lock: vi.fn(), toastError: vi.fn(), toastSuccess: vi.fn() }))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }))
vi.mock('sonner', () => ({ toast: { success: mocks.toastSuccess, error: mocks.toastError } }))
vi.mock('~/shared/api/generated/operations/offboarding-cases/offboarding-case-record-account-lock', () => ({
  useOffboardingCaseRecordAccountLock: () => ({ mutateAsync: mocks.lock, isPending: false })
}))
vi.mock('~/shared/api/generated/operations/offboarding-cases/offboarding-case-open-revocations', () => ({
  useOffboardingCaseOpenRevocations: () => ({ isPending: false })
}))
vi.mock('~/shared/api/generated/operations/access-requests/access-request-cancel-for-departure', () => ({
  useAccessRequestCancelForDeparture: () => ({ isPending: false })
}))
function setup() {
  const close = vi.fn()
  render(
    <QueryClientProvider client={new QueryClient()}>
      <OffboardingActionDialog action={{ kind: 'lock', caseId: 'case-1' }} onClose={close} />
    </QueryClientProvider>
  )
  return close
}
describe('account lock evidence', () => {
  beforeEach(() => vi.clearAllMocks())
  it('requires evidence and blocks rapid duplicate submissions', async () => {
    let resolve!: () => void
    mocks.lock.mockImplementation(
      () =>
        new Promise<void>((done) => {
          resolve = done
        })
    )
    setup()
    expect(screen.getByRole('button', { name: 'confirm' })).toBeDisabled()
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Checked external directory audit' } })
    const form = screen.getByRole('textbox').closest('form')!
    fireEvent.submit(form)
    fireEvent.submit(form)
    expect(mocks.lock).toHaveBeenCalledTimes(1)
    expect(mocks.lock).toHaveBeenCalledWith({ id: 'case-1', data: { note: 'Checked external directory audit' } })
    resolve()
    await waitFor(() => expect(mocks.toastSuccess).toHaveBeenCalled())
  })
  it('preserves evidence and keeps dialog open on backend error', async () => {
    mocks.lock.mockRejectedValue(new Error('conflict'))
    const close = setup()
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Evidence retained' } })
    fireEvent.submit(screen.getByRole('textbox').closest('form')!)
    await waitFor(() => expect(mocks.toastError).toHaveBeenCalled())
    expect(screen.getByRole('textbox')).toHaveValue('Evidence retained')
    expect(close).not.toHaveBeenCalled()
    expect(mocks.toastSuccess).not.toHaveBeenCalled()
  })
})
