import { AxiosError, AxiosHeaders } from 'axios'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { FinanceCommitmentsView } from './views/finance-commitments-view'

vi.mock('react-i18next', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-i18next')>()),
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } })
}))
const adapter = apiClient.defaults.adapter
let posted: unknown
let state = 'HELD'
let releasePage = 0
beforeEach(() => {
  posted = undefined
  state = 'HELD'
  releasePage = 0
  apiClient.defaults.adapter = async (config) => {
    if (config.method === 'post') {
      posted = JSON.parse(config.data)
      throw new AxiosError('conflict', '409', config, undefined, {
        config,
        status: 409,
        statusText: 'Conflict',
        headers: new AxiosHeaders(),
        data: { error: { code: 'BUDGET.COMMITMENT_REQUEST_OPEN' } }
      })
    }
    const pagination = { page: config.params?.page ?? 1, pageSize: 20, totalItems: 21, totalPages: 2 }
    const money = { amount: '9007199254740993.25', currency: 'USD' }
    let data: unknown = { roles: ['FINANCE'] }
    if (config.url?.endsWith('/budget-commitments'))
      data = {
        items: [
          {
            id: 'commitment',
            requestId: 'request',
            costCenter: { code: 'CC', name: 'Finance' },
            year: 2026,
            amount: money,
            held: money,
            released: money,
            state,
            attached: false
          }
        ],
        pagination
      }
    if (config.url?.endsWith('/releases')) {
      releasePage = pagination.page
      data = { items: [], pagination }
    }
    return { config, status: 200, statusText: 'OK', headers: new AxiosHeaders(), data: { success: true, data } }
  }
})
afterEach(() => {
  apiClient.defaults.adapter = adapter
})
function mount() {
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <FinanceCommitmentsView itemId='commitment' />
    </QueryClientProvider>
  )
}
it('sends a release reason, retains it on failure and independently pages releases', async () => {
  mount()
  fireEvent.change(await screen.findByLabelText('common.reason'), { target: { value: 'Service ended' } })
  fireEvent.click(screen.getByRole('button', { name: 'commitments.release' }))
  await waitFor(() => expect(posted).toEqual({ reason: 'Service ended' }))
  expect(screen.getByLabelText('common.reason')).toHaveValue('Service ended')
  const section = screen.getByRole('region', { name: 'commitments.releases' })
  const buttons = section.querySelectorAll('button')
  fireEvent.click(buttons[buttons.length - 1])
  await waitFor(() => expect(releasePage).toBe(2))
})
it('disables release when the commitment state is unknown', async () => {
  state = 'UNKNOWN'
  mount()
  await screen.findByLabelText('common.reason')
  expect(screen.getByRole('button', { name: 'commitments.release' })).toBeDisabled()
})
