import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { ItUsageView } from './views/it-usage-view'

vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))
vi.mock('recharts', () => ({
  Bar: () => null,
  BarChart: () => null,
  ResponsiveContainer: () => null,
  Tooltip: () => null,
  XAxis: () => null,
  YAxis: () => null
}))

it('uses the technical roster name and code without exposing unrelated personnel fields', async () => {
  await setAppLanguage('en', false)
  const pagination = { totalItems: 1, totalPages: 1, page: 1, pageSize: 20 }
  vi.mocked(customAxios).mockImplementation(async (config) => {
    if (config.url?.endsWith('/departments'))
      return { data: { items: [{ id: 'd1', name: 'Design', code: 'D' }], pagination } }
    if (config.url?.includes('/technical-members'))
      return {
        data: {
          items: [{ id: 'e1', code: 'EMP-1', fullName: 'Technical Member', loginEmail: 'private@example.invalid' }],
          pagination
        }
      }
    if (config.url?.endsWith('/usage-software'))
      return { data: { items: [{ application: { id: 'a1', name: 'Example' }, status: 'NO_DATA' }], pagination } }
    if (config.url?.endsWith('/usage-software/a1'))
      return {
        data: {
          range: { from: '2026-10-01', to: '2026-10-31' },
          status: 'NO_DATA',
          activeDays: 0,
          coveredDays: 0,
          vendorSources: [],
          collector: null,
          sourcesTruncated: false
        }
      }
    if (config.url?.includes('/usage-overview')) return { data: { items: [], pagination } }
    throw new Error('Unexpected request')
  })
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <MemoryRouter>
        <ItUsageView />
      </MemoryRouter>
    </QueryClientProvider>
  )
  fireEvent.click(await screen.findByRole('button', { name: 'Open department' }))
  expect(await screen.findByText('EMP-1')).toBeInTheDocument()
  expect(screen.getByText('Technical Member')).toBeInTheDocument()
  expect(screen.queryByText('private@example.invalid')).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'View usage data' }))
  fireEvent.click(await screen.findByRole('button', { name: 'Details' }))
  expect(await screen.findByText('There is not enough data to assess usage')).toBeInTheDocument()
})

it('restores selected usage and date range from the URL', async () => {
  await setAppLanguage('en', false)
  const request = vi.mocked(customAxios)
  request.mockReset()
  request.mockResolvedValue({
    data: { range: { from: '2026-10-01', to: '2026-10-31' }, status: 'NO_DATA', vendorSources: [], collector: null }
  } as never)
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <MemoryRouter
        initialEntries={[
          '/?department=d1&departmentName=Design&employee=e1&employeeCode=EMP-1&application=a1&applicationName=Example&from=2026-10-01&to=2026-10-31&departmentPage=3'
        ]}
      >
        <ItUsageView />
      </MemoryRouter>
    </QueryClientProvider>
  )
  expect(await screen.findByText('There is not enough data to assess usage')).toBeInTheDocument()
  expect(request).toHaveBeenCalledWith(
    expect.objectContaining({
      url: expect.stringContaining('/employees/e1/usage-software/a1'),
      params: { from: '2026-10-01', to: '2026-10-31' }
    }),
    undefined
  )
  expect(screen.getByRole('heading', { name: 'Example' })).toBeInTheDocument()
})
