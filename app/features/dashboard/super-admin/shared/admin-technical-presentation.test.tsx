import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Toaster, toast } from 'sonner'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { SetupChecklist } from '../overview/components/setup-checklist'
import { AdminQueryState } from './components/admin-query-state'
import { useAdminMutationFeedback } from './hooks/use-admin-mutation-feedback'

const technicalId = '11111111-1111-4111-8111-111111111111'
const failure = {
  isAxiosError: true,
  response: { status: 422, data: { error: { code: 'VALIDATION_ERROR', requestId: technicalId } } }
}

beforeEach(async () => {
  await setAppLanguage('en', false)
})
afterEach(() => toast.dismiss())

it.each([
  ['en', 'Setup step'],
  ['vi', 'Bước thiết lập']
] as const)('keeps future setup keys out of visible text and accessible names in %s', async (language, label) => {
  await setAppLanguage(language, false)
  const { container } = render(
    <SetupChecklist
      steps={[{ step: 6, key: 'FUTURE_INTERNAL_STAGE', status: 'NOT_AVAILABLE', reasons: [] }]}
      onSelectTab={vi.fn()}
    />
  )
  const trigger = screen.getByRole('button', { name: new RegExp(label) })
  fireEvent.click(trigger)
  expect(screen.getByRole('region', { name: label })).toBeInTheDocument()
  expect(container.innerHTML).not.toContain('FUTURE_INTERNAL_STAGE')
})

it('retains translated query failure guidance and retry without exposing the technical request ID', () => {
  const retry = vi.fn()
  const { container } = render(
    <QueryClientProvider client={new QueryClient()}>
      <AdminQueryState query={{ isPending: false, isError: true, error: failure, refetch: retry }}>
        <p>Loaded content</p>
      </AdminQueryState>
    </QueryClientProvider>
  )
  expect(screen.getByRole('alert')).toHaveTextContent('Check the entered values and required fields.')
  expect(container.innerHTML).not.toContain(technicalId)
  expect(container.textContent).not.toContain('VALIDATION_ERROR')
  fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
  expect(retry).toHaveBeenCalledOnce()
})

function FeedbackAction() {
  const feedback = useAdminMutationFeedback([['affected-requests']])
  return <button onClick={() => void feedback.onError(failure)}>Trigger failure</button>
}

it('keeps mutation error guidance and cache invalidation without showing the technical request ID in the toast', async () => {
  const client = new QueryClient()
  client.setQueryData(['affected-requests'], { requestId: technicalId })
  render(
    <QueryClientProvider client={client}>
      <FeedbackAction />
      <Toaster />
    </QueryClientProvider>
  )
  fireEvent.click(screen.getByRole('button', { name: 'Trigger failure' }))
  expect(await screen.findByText('Check the entered values and required fields.')).toBeInTheDocument()
  await waitFor(() => expect(client.getQueryState(['affected-requests'])?.isInvalidated).toBe(true))
  expect(document.body.textContent).not.toContain(technicalId)
  expect(document.body.textContent).not.toContain('VALIDATION_ERROR')
  expect(client.getQueryData(['affected-requests'])).toEqual({ requestId: technicalId })
})
