import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, within } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { DeviceResults } from './components/device-results'

vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))

it('shows the holder of each usage record from its registration, including earlier holders', async () => {
  await setAppLanguage('en', false)
  vi.mocked(customAxios).mockImplementation(async (config) => {
    const pagination = { page: 1, pageSize: 100, totalItems: 2, totalPages: 1 }
    if (config.url?.endsWith('/registrations'))
      return {
        data: {
          pagination,
          items: [
            { id: 'reg-old', holder: { fullName: 'Earlier Holder', employeeCode: 'OLD' } },
            { id: 'reg-new', holder: { fullName: 'Current Holder', employeeCode: 'NEW' } }
          ]
        }
      }
    return {
      data: {
        pagination,
        items: [
          {
            date: '2026-11-01',
            registrationId: 'reg-old',
            tool: 'CODEX',
            coverage: 'COVERED',
            responses: 1,
            totalTokens: 10
          },
          {
            date: '2026-11-02',
            registrationId: 'reg-new',
            tool: 'CODEX',
            coverage: 'COVERED',
            responses: 2,
            totalTokens: 20
          }
        ]
      }
    }
  })
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <DeviceResults id='device-1' kind='usage' onClose={vi.fn()} />
    </QueryClientProvider>
  )
  expect(await screen.findByText('Earlier Holder (OLD)')).toBeInTheDocument()
  const articles = screen.getAllByRole('article')
  expect(within(articles[0]).getByText('Earlier Holder (OLD)')).toBeInTheDocument()
  expect(within(articles[1]).getByText('Current Holder (NEW)')).toBeInTheDocument()
})
