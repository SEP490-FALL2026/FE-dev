import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CatalogLinkDialog } from './catalog-link-section'
const mocks = vi.hoisted(() => ({ link: vi.fn(), success: vi.fn(), error: vi.fn() }))
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { plan?: string }) => (options?.plan ? `${key} ${options.plan}` : key)
  })
}))
vi.mock('~/shared/api/generated/operations/access-requests/access-request-catalog-link', () => ({
  useAccessRequestCatalogLink: () => ({ mutateAsync: mocks.link, isPending: false })
}))
vi.mock('../../shared/hooks/use-it-mutation-feedback', () => ({
  useItMutationFeedback: () => ({ onSuccess: mocks.success, onError: mocks.error })
}))
const plan = { planId: 'persisted-plan', planName: 'Existing plan', applicationName: 'Existing application' }
function setup(eligible = true) {
  const close = vi.fn()
  render(
    <QueryClientProvider client={new QueryClient()}>
      <CatalogLinkDialog requestId='request-1' plan={plan} eligible={eligible} onClose={close} />
    </QueryClientProvider>
  )
  return close
}
describe('catalog plan linking', () => {
  beforeEach(() => vi.clearAllMocks())
  it('disables confirmation when persisted prerequisites are not eligible', () => {
    setup(false)
    expect(screen.getByRole('button', { name: 'confirm' })).toBeDisabled()
    fireEvent.submit(screen.getByRole('button', { name: 'confirm' }).closest('form')!)
    expect(mocks.link).not.toHaveBeenCalled()
  })
  it('submits only saved plan ID and prevents duplicate requests', async () => {
    let resolve!: () => void
    mocks.link.mockImplementation(
      () =>
        new Promise<void>((done) => {
          resolve = done
        })
    )
    setup()
    const form = screen.getByRole('button', { name: 'confirm' }).closest('form')!
    fireEvent.submit(form)
    fireEvent.submit(form)
    expect(mocks.link).toHaveBeenCalledTimes(1)
    expect(mocks.link).toHaveBeenCalledWith({ id: 'request-1', data: { planId: 'persisted-plan' } })
    resolve()
    await waitFor(() => expect(mocks.success).toHaveBeenCalled())
  })
  it('retains selected persisted plan and confirmation on failure', async () => {
    mocks.link.mockRejectedValue(new Error('conflict'))
    const close = setup()
    fireEvent.submit(screen.getByRole('button', { name: 'confirm' }).closest('form')!)
    await waitFor(() => expect(mocks.error).toHaveBeenCalled())
    expect(screen.getByText('catalogLink.confirm Existing plan')).toBeInTheDocument()
    expect(close).not.toHaveBeenCalled()
    expect(mocks.success).not.toHaveBeenCalled()
  })
})
