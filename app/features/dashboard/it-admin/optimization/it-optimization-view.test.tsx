import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { ItOptimizationView } from './it-optimization-view'

vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))
it('shows recommendations by software and employee code without exposing the holder name or internal ID', async () => {
  await setAppLanguage('en', false)
  vi.mocked(customAxios).mockResolvedValue({
    data: {
      items: [
        {
          id: 'internal-id',
          group: 'G3',
          state: 'AWAITING_DECISION',
          tier: 'REVIEW',
          application: { applicationName: 'Workspace' },
          plan: { planName: 'Business' },
          holder: { employeeId: 'holder-id', employeeCode: 'EMP-001' },
          inactiveDays: 45
        }
      ],
      pagination: { totalItems: 1 }
    }
  } as never)
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <ItOptimizationView />
    </QueryClientProvider>
  )
  expect(await screen.findByText('Workspace · Business')).toBeInTheDocument()
  expect(screen.getByText('EMP-001')).toBeInTheDocument()
  expect(screen.queryByText('holder-id')).not.toBeInTheDocument()
  expect(screen.queryByText('internal-id')).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Details' }))
  expect(screen.getByRole('button', { name: 'Back to recommendations' })).toBeInTheDocument()
})
it('loads the current recommendation details when opening a row', async () => {
  await setAppLanguage('en', false)
  const item = {
    id: 'rec-1',
    group: 'G3',
    state: 'AWAITING_DECISION',
    application: { applicationName: 'Workspace' },
    plan: { planName: 'Business' },
    holder: { fullName: 'Alex' },
    inactiveDays: 45
  }
  const request = vi.mocked(customAxios)
  request.mockReset()
  request.mockImplementation(async (config) =>
    config.url?.endsWith('/rec-1')
      ? { data: { recommendation: { ...item, inactiveDays: 50 } } }
      : { data: { items: [item], pagination: { totalItems: 1 } } }
  )
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <ItOptimizationView />
    </QueryClientProvider>
  )
  fireEvent.click(await screen.findByRole('button', { name: 'Details' }))
  await waitFor(() => expect(request.mock.calls.some(([config]) => config.url?.endsWith('/rec-1'))).toBe(true))
  expect(await screen.findByText('50 days')).toBeInTheDocument()
})
it('opens a reclaim task for an eligible departed employee after confirmation', async () => {
  await setAppLanguage('en', false)
  const item = {
    id: 'rec-2',
    group: 'G2',
    state: 'OPEN',
    canReclaim: true,
    application: { applicationName: 'Workspace' },
    plan: { planName: 'Business' },
    holder: { fullName: 'Alex' },
    inactiveDays: null
  }
  const request = vi.mocked(customAxios)
  request.mockReset()
  request.mockImplementation(async (config) => {
    if (config.method === 'POST') return { data: {} }
    if (config.url?.endsWith('/rec-2')) return { data: { recommendation: item } }
    return { data: { items: [item], pagination: { totalItems: 1 } } }
  })
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      <ItOptimizationView />
    </QueryClientProvider>
  )
  fireEvent.click(await screen.findByRole('button', { name: 'Details' }))
  fireEvent.click(await screen.findByRole('button', { name: 'Start reclaim' }))
  expect(request.mock.calls.some(([config]) => config.method === 'POST')).toBe(false)
  fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
  await waitFor(() =>
    expect(
      request.mock.calls.some(([config]) => config.method === 'POST' && config.url?.endsWith('/rec-2/reclaim'))
    ).toBe(true)
  )
})
it('requires a reason to return a reclaim decision to the department head', async () => {
  await setAppLanguage('en', false)
  const item = {
    id: 'rec-3',
    group: 'G3',
    state: 'RECLAIM_DECIDED',
    canReclaim: false,
    application: { applicationName: 'Workspace' },
    plan: { planName: 'Business' },
    holder: { fullName: 'Alex' },
    inactiveDays: 45
  }
  const request = vi.mocked(customAxios)
  request.mockReset()
  request.mockImplementation(async (config) =>
    config.method === 'POST'
      ? { data: {} }
      : config.url?.endsWith('/rec-3')
        ? { data: { recommendation: item } }
        : { data: { items: [item], pagination: { totalItems: 1 } } }
  )
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      <ItOptimizationView />
    </QueryClientProvider>
  )
  fireEvent.click(await screen.findByRole('button', { name: 'Details' }))
  fireEvent.click(await screen.findByRole('button', { name: 'Return to department head' }))
  fireEvent.change(screen.getByLabelText('Reason'), { target: { value: 'ab' } })
  expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled()
  fireEvent.change(screen.getByLabelText('Reason'), { target: { value: 'Activity resumed' } })
  fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
  await waitFor(() =>
    expect(
      request.mock.calls.some(
        ([config]) =>
          config.url?.endsWith('/rec-3/return') &&
          JSON.stringify(config.data) === JSON.stringify({ reason: 'Activity resumed' })
      )
    ).toBe(true)
  )
})
