import { AxiosError, AxiosHeaders } from 'axios'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { FinanceBudgetQuestionsView } from './views/finance-budget-questions-view'

vi.mock('react-i18next', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-i18next')>()),
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } })
}))
const adapter = apiClient.defaults.adapter
let state = 'OPEN'
let posted: unknown
let page = 0
beforeEach(() => {
  state = 'OPEN'
  posted = undefined
  page = 0
  apiClient.defaults.adapter = async (config) => {
    if (config.method === 'post') {
      posted = JSON.parse(config.data)
      throw new AxiosError('conflict', '409', config, undefined, {
        config,
        status: 409,
        statusText: 'Conflict',
        headers: new AxiosHeaders(),
        data: { error: { code: 'BUDGET_INFORMATION.NOT_OPEN' } }
      })
    }
    page = config.params?.page ?? 0
    return {
      config,
      status: 200,
      statusText: 'OK',
      headers: new AxiosHeaders(),
      data: {
        success: true,
        data: config.url?.endsWith('/me')
          ? { roles: ['FINANCE'] }
          : {
              items: [
                {
                  id: 'question',
                  requestId: 'request',
                  question: 'Available budget?',
                  askedBy: { fullName: 'Approver' },
                  state,
                  answer: null
                }
              ],
              pagination: { page: page || 1, pageSize: 20, totalItems: 21, totalPages: 2 }
            }
      }
    }
  }
})
afterEach(() => {
  apiClient.defaults.adapter = adapter
})
function mount() {
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <FinanceBudgetQuestionsView itemId='question' />
    </QueryClientProvider>
  )
}
it('answers with the contract code and retains note on failure', async () => {
  mount()
  fireEvent.change(await screen.findByLabelText('questions.answer'), { target: { value: 'OVER_LIMIT' } })
  fireEvent.change(screen.getByLabelText('common.note'), { target: { value: 'Forecast changed' } })
  fireEvent.click(screen.getByRole('button', { name: 'questions.submit' }))
  await waitFor(() => expect(posted).toEqual({ answer: 'OVER_LIMIT', note: 'Forecast changed' }))
  expect(screen.getByLabelText('common.note')).toHaveValue('Forecast changed')
})
it('pages the question list through the server rather than slicing a local array', async () => {
  mount()
  await screen.findByLabelText('questions.answer')
  fireEvent.click(within(screen.getByRole('navigation', { name: 'pagination' })).getByRole('button', { name: 'next' }))
  await waitFor(() => expect(page).toBe(2))
})
it('does not offer an answer for unknown question state', async () => {
  state = 'UNKNOWN'
  mount()
  await screen.findByLabelText('questions.answer')
  expect(screen.getByRole('button', { name: 'questions.submit' })).toBeDisabled()
})
