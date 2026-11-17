import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { ItUsageChart } from './components/it-usage-chart'
vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))
vi.mock('recharts', () => ({
  CartesianGrid: () => null,
  Line: () => null,
  LineChart: () => null,
  ResponsiveContainer: () => null,
  Tooltip: () => null,
  XAxis: () => null,
  YAxis: () => null
}))
it('shows the scoped usage series and distinguishes missing data from zero', async () => {
  await setAppLanguage('en', false)
  vi.mocked(customAxios).mockResolvedValue({
    data: {
      items: [
        {
          department: { id: 'd1', name: 'Engineering' },
          period: { start: '2026-11-01', end: '2026-11-07' },
          status: 'HAS_DATA',
          activeDays: 2,
          coveredDays: 5
        },
        {
          department: { id: 'd2', name: 'Design' },
          period: { start: '2026-11-01', end: '2026-11-07' },
          status: 'NO_DATA',
          activeDays: 0,
          coveredDays: 0
        }
      ],
      pagination: { totalItems: 2 }
    }
  } as never)
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <ItUsageChart />
    </QueryClientProvider>
  )
  expect((await screen.findAllByText('Engineering')).length).toBeGreaterThan(0)
  expect(screen.getByText(/Some periods have partial or missing coverage/)).toBeInTheDocument()
  fireEvent.click(screen.getByText('View chart data'))
  expect(screen.getByRole('table')).toBeInTheDocument()
  expect(vi.mocked(customAxios)).toHaveBeenCalledWith(
    expect.objectContaining({ params: expect.objectContaining({ groupBy: 'DEPARTMENT', granularity: 'WEEK' }) }),
    undefined
  )
})

it('includes departments on subsequent API pages in the same chart', async () => {
  await setAppLanguage('en', false)
  const request = vi.mocked(customAxios)
  request.mockReset()
  request.mockImplementation(async (config) => {
    const page = Number(config.params?.page)
    return {
      data: {
        items: [
          {
            department: { id: `d${page}`, name: page === 1 ? 'Engineering' : 'Design' },
            period: { start: '2026-11-02', end: '2026-11-08' },
            status: 'HAS_DATA',
            activeDays: page
          }
        ],
        pagination: { totalPages: 2 }
      }
    }
  })
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <ItUsageChart />
    </QueryClientProvider>
  )
  expect((await screen.findAllByText('Design')).length).toBeGreaterThan(0)
  expect(request).toHaveBeenCalledWith(
    expect.objectContaining({ params: expect.objectContaining({ page: 2 }) }),
    undefined
  )
})
