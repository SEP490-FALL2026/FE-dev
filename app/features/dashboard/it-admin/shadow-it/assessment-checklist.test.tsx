import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import type { AssessmentResponseDtoDataAssessment } from '~/shared/api/generated/model/access-requests/assessmentResponseDtoDataAssessment'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { AssessmentDialog } from './components/assessment-dialog'

vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))

it('requires policy answers and submits the current version when completing assessment', async () => {
  await setAppLanguage('en', false)
  vi.mocked(customAxios).mockImplementation(async (config) => {
    if (config.url?.includes('/policies/'))
      return {
        data: {
          policyVersionId: 'version-1',
          step: {
            checklist: [
              { code: 'one', text: 'Is this suitable?', check: 'PERSON' },
              { code: 'system', text: 'System check', check: 'SYSTEM' }
            ]
          }
        }
      }
    return { data: {} }
  })
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      <AssessmentDialog
        item={{ requestId: 'request-1' } as AssessmentResponseDtoDataAssessment}
        mode='complete'
        onClose={() => {}}
      />
    </QueryClientProvider>
  )
  const confirm = screen.getByRole('button', { name: 'Confirm' })
  expect(confirm).toBeDisabled()
  expect(await screen.findByText(/Is this suitable/)).toBeInTheDocument()
  fireEvent.click(screen.getByLabelText('Yes'))
  fireEvent.click(confirm)
  await waitFor(() =>
    expect(vi.mocked(customAxios)).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        data: { checklist: { policyVersionId: 'version-1', answers: [{ itemCode: 'one', answer: 'YES' }] } }
      }),
      undefined
    )
  )
})
