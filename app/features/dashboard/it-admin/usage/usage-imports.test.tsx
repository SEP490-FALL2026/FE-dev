import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { UsageImports } from './components/usage-imports'

vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))

it('requires the tracking notice before confirming a preview and sends an idempotency key', async () => {
  await setAppLanguage('en', false)
  const pagination = { page: 1, pageSize: 20, totalItems: 1, totalPages: 1 }
  vi.mocked(customAxios).mockImplementation(async (config, options) => {
    if (config.url?.endsWith('/confirm')) return { data: {} }
    if (config.url?.endsWith('/rows')) return { data: { items: [], pagination } }
    if (config.url?.endsWith('/usage-imports/i1'))
      return {
        data: {
          id: 'i1',
          status: 'PREVIEW',
          previewVersion: 2,
          summary: {
            totalRows: 1,
            matched: 1,
            unmatched: 0,
            ambiguous: 0,
            invalid: 0,
            trackingNoticeRequired: true,
            unmappedEventTypes: []
          }
        }
      }
    if (config.url?.endsWith('/usage-imports'))
      return {
        data: {
          items: [{ id: 'i1', application: { name: 'Example' }, source: { name: 'Report' }, status: 'PREVIEW' }],
          pagination
        }
      }
    void options
    throw new Error('Unexpected request')
  })
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      <MemoryRouter>
        <UsageImports onBack={() => {}} />
      </MemoryRouter>
    </QueryClientProvider>
  )
  fireEvent.click(await screen.findByRole('button', { name: 'Details' }))
  const button = await screen.findByRole('button', { name: 'Confirm import' })
  expect(button).toBeDisabled()
  fireEvent.click(screen.getByRole('checkbox'))
  fireEvent.click(button)
  await waitFor(() =>
    expect(vi.mocked(customAxios)).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining('/usage-imports/i1/confirm'),
        data: { previewVersion: 2, notice: 'SYSTEM_SENT' }
      }),
      expect.objectContaining({ headers: { 'Idempotency-Key': expect.any(String) } })
    )
  )
})

it('restores the preview and row outcome filter from the URL', async () => {
  await setAppLanguage('en', false)
  const request = vi.mocked(customAxios)
  request.mockReset()
  request.mockImplementation(async (config) =>
    config.url?.endsWith('/rows')
      ? { data: { items: [], pagination: { totalItems: 0 } } }
      : {
          data: {
            status: 'CANCELLED',
            summary: { totalRows: 0, matched: 0, unmatched: 0, ambiguous: 0, invalid: 0, unmappedEventTypes: [] }
          }
        }
  )
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <MemoryRouter initialEntries={['/?importId=i2&rowOutcome=INVALID&rowPage=2']}>
        <UsageImports onBack={() => {}} />
      </MemoryRouter>
    </QueryClientProvider>
  )
  await waitFor(() =>
    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining('/usage-imports/i2/rows'),
        params: { page: 2, pageSize: 20, outcome: 'INVALID' }
      }),
      undefined
    )
  )
  expect(screen.queryByRole('button', { name: 'Confirm import' })).not.toBeInTheDocument()
})
