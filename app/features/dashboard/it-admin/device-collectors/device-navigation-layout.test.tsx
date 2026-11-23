import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { expect, it, vi } from 'vitest'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { ItDevicesView } from './views/it-devices-view'

vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))

it('shows the device registry and personal devices without the two removed navigation buttons', async () => {
  await setAppLanguage('en', false)
  vi.mocked(customAxios).mockResolvedValue({ data: { items: [], pagination: { totalItems: 0, totalPages: 0 } } })
  render(
    <MemoryRouter>
      <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
        <ItDevicesView />
      </QueryClientProvider>
    </MemoryRouter>
  )
  expect(screen.getByRole('button', { name: 'Device registry' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'My devices' })).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Collector allowlist' })).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Collection stop requests' })).not.toBeInTheDocument()
})
