import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { SubscriptionExpiry } from './components/subscription-expiry'

vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))
it('loads the responsible administrator’s expiring and expired subscriptions using the server filter', async () => {
  await setAppLanguage('en', false)
  const request = vi.mocked(customAxios)
  request.mockReset()
  request.mockResolvedValue({
    data: {
      items: [
        {
          id: 's1',
          applicationName: 'Figma',
          planName: 'Team',
          expiry: 'SOON',
          endDate: '2026-12-01',
          renewalDate: null,
          daysLeft: 14,
          deadlineKind: 'END_DATE'
        }
      ],
      pagination: { totalItems: 1 }
    }
  } as never)
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <SubscriptionExpiry />
    </QueryClientProvider>
  )
  expect(await screen.findByText('Figma · Team')).toBeInTheDocument()
  expect(request).toHaveBeenCalledWith(
    expect.objectContaining({ params: { expiry: 'SOON', mine: 'true', page: 1, pageSize: 20 } }),
    undefined
  )
  fireEvent.click(screen.getByRole('button', { name: 'Expired subscriptions' }))
  await waitFor(() =>
    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({ params: { expiry: 'EXPIRED', mine: 'true', page: 1, pageSize: 20 } }),
      undefined
    )
  )
})
