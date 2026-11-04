import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getMeGetQueryKey } from '~/shared/api/generated/operations/me/me-get'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { accessRequestGet } from '~/shared/api/generated/operations/access-requests/access-request-get'
import { accessRequestServiceAccountReview } from '~/shared/api/generated/operations/access-requests/access-request-service-account-review'
import { ServiceAccountReviewDialog } from './components/service-account-review-dialog'
vi.mock('~/shared/api/generated/operations/access-requests/access-request-get', async (original) => ({
  ...(await original<object>()),
  accessRequestGet: vi.fn()
}))
vi.mock('~/shared/api/generated/operations/access-requests/access-request-service-account-review', () => ({
  accessRequestServiceAccountReview: vi.fn()
}))
const detail = {
  success: true,
  message: 'REQUEST.FOUND',
  data: {
    request: {
      id: 'request-1',
      type: 'SERVICE_ACCOUNT',
      state: 'AWAITING_EXECUTION',
      serviceAccount: {
        purpose: 'Automated billing integration',
        expectedIdentifier: 'billing@example.org',
        responsible: { employeeId: 'owner-1', fullName: 'Account Owner' },
        boundary: { state: 'PENDING' }
      }
    }
  }
} as unknown as Awaited<ReturnType<typeof accessRequestGet>>
function setup() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  client.setQueryData(getMeGetQueryKey(), { data: { roles: ['IT_ADMIN'] } })
  return render(
    <QueryClientProvider client={client}>
      <ServiceAccountReviewDialog requestId='request-1' onClose={vi.fn()} />
    </QueryClientProvider>
  )
}
beforeEach(async () => {
  vi.clearAllMocks()
  await setAppLanguage('en', false)
  vi.mocked(accessRequestGet).mockResolvedValue(detail)
})
describe('Service account boundary review', () => {
  it('blocks a review when the latest request is no longer awaiting execution', async () => {
    const changed = structuredClone(detail)
    if (changed.data && 'request' in changed.data) changed.data.request.state = 'COMPLETED'
    vi.mocked(accessRequestGet).mockResolvedValue(changed)
    setup()
    expect(
      await screen.findByText(
        'This service-account request is no longer waiting for a boundary decision. Refresh the queue.'
      )
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled()
    expect(accessRequestServiceAccountReview).not.toHaveBeenCalled()
  })
  it('loads purpose before acceptance and blocks repeated writes while pending', async () => {
    let resolve!: (value: Awaited<ReturnType<typeof accessRequestServiceAccountReview>>) => void
    vi.mocked(accessRequestServiceAccountReview).mockReturnValue(
      new Promise((done) => {
        resolve = done
      })
    )
    setup()
    expect(await screen.findByText('Automated billing integration')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    await waitFor(() =>
      expect(accessRequestServiceAccountReview).toHaveBeenCalledWith('request-1', { decision: 'ACCEPT' })
    )
    expect(screen.getByRole('button', { name: 'Saving…' })).toBeDisabled()
    resolve({ success: true, message: 'REQUEST.REVIEWED', data: null })
  })
  it('requires a rejection reason and retains it after a failed review', async () => {
    vi.mocked(accessRequestServiceAccountReview).mockRejectedValue(new Error('offline'))
    setup()
    await screen.findByText('Automated billing integration')
    fireEvent.change(screen.getByLabelText('Boundary decision'), { target: { value: 'REJECT' } })
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled()
    fireEvent.change(screen.getByLabelText('Reason'), { target: { value: 'This is a personal account' } })
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    await waitFor(() =>
      expect(accessRequestServiceAccountReview).toHaveBeenCalledWith('request-1', {
        decision: 'REJECT',
        reason: 'This is a personal account'
      })
    )
    expect(screen.getByLabelText('Reason')).toHaveValue('This is a personal account')
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
