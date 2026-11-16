import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { RenewalDetail } from './components/renewal-detail'

vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))
it('opens seat rankings on a separate page and lets IT review only the proposed seats', async () => {
  await setAppLanguage('en', false)
  vi.mocked(customAxios).mockImplementation(async (config) => {
    if (config.url?.endsWith('/seat-ranking'))
      return {
        data: {
          usage: { status: 'NOT_AVAILABLE' },
          items: [],
          pagination: { totalItems: 0 }
        }
      }
    return {
      data: {
        renewal: {
          id: 'renewal-1',
          state: 'PROPOSED',
          subscription: { applicationName: 'Workspace', planName: 'Business' },
          period: { purchasedQuantity: 10, seatsInUse: 2 },
          milestone: { baseDate: '2026-12-01' },
          proposal: { choice: 'REDUCE', quantity: 1 }
        }
      }
    }
  })
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <RenewalDetail id='renewal-1' onBack={vi.fn()} />
    </QueryClientProvider>
  )
  fireEvent.click(await screen.findByRole('button', { name: 'Seat review order' }))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(screen.queryByRole('heading', { name: 'Proposal' })).not.toBeInTheDocument()
  fireEvent.click(screen.getByLabelText('Proposed seats only'))
  await screen.findByText('Usage data is not available. Assigned seats do not prove usage.')
  expect(
    vi
      .mocked(customAxios)
      .mock.calls.some(([config]) => config.url?.endsWith('/seat-ranking') && config.params?.proposedOnly === 'true')
  ).toBe(true)
})
