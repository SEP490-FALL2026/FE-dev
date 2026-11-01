import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'
import { InternalRegistrationDialog } from './internal-registration-dialog'
import type { AssessmentResponseDtoDataAssessment } from '~/shared/api/generated/model/access-requests/assessmentResponseDtoDataAssessment'
const mocks = vi.hoisted(() => ({ register: vi.fn(), error: vi.fn(), success: vi.fn() }))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }))
vi.mock('~/shared/api/generated/operations/access-requests/access-request-internal-register', () => ({
  useAccessRequestInternalRegister: () => ({ mutateAsync: mocks.register, isPending: false })
}))
vi.mock('../../shared/hooks/use-it-mutation-feedback', () => ({
  useItMutationFeedback: () => ({ onError: mocks.error, onSuccess: mocks.success })
}))
describe('internal proposal registration', () => {
  it('requires owner, submits no invented spending and keeps draft on error', async () => {
    mocks.register.mockRejectedValue(new Error('validation'))
    const close = vi.fn()
    const item = {
      requestId: 'request-1',
      proposal: { softwareName: 'Internal tool' },
      proposedBusinessOwner: null,
      dataSensitivity: 'HIGH'
    } as unknown as AssessmentResponseDtoDataAssessment
    render(
      <QueryClientProvider client={new QueryClient()}>
        <InternalRegistrationDialog item={item} onClose={close} />
      </QueryClientProvider>
    )
    expect(screen.getByRole('button', { name: 'confirm' })).toBeDisabled()
    fireEvent.change(screen.getByLabelText('owner'), { target: { value: '12345678-1234-1234-1234-123456789012' } })
    fireEvent.submit(screen.getByLabelText('owner').closest('form')!)
    await waitFor(() => expect(mocks.error).toHaveBeenCalled())
    expect(mocks.register).toHaveBeenCalledWith({
      id: 'request-1',
      data: {
        businessOwnerEmployeeId: '12345678-1234-1234-1234-123456789012',
        softwareName: 'Internal tool',
        dataSensitivity: 'HIGH'
      }
    })
    expect(screen.getByLabelText('owner')).toHaveValue('12345678-1234-1234-1234-123456789012')
    expect(close).not.toHaveBeenCalled()
    expect(mocks.success).not.toHaveBeenCalled()
  })
})
