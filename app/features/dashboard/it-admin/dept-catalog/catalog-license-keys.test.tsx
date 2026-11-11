import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, expect, it, vi } from 'vitest'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { CatalogKeyVault } from './components/catalog-license-keys'
vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))
const request = vi.mocked(customAxios)
beforeEach(async () => {
  vi.resetAllMocks()
  await setAppLanguage('en', false)
})
it('marks the keys input as required for importing into the vault', async () => {
  request.mockResolvedValue({ data: { items: [], pagination: { totalItems: 0 }, summary: {} } })
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <CatalogKeyVault subscriptionId='sub-1' />
    </QueryClientProvider>
  )
  const input = await screen.findByRole('textbox')
  expect(input).toBeRequired()
  expect(input.closest('div')?.querySelector('label')).toHaveTextContent('*')
})
it('loads masked keys and only reveals explicitly without putting the secret in query or mutation data', async () => {
  request.mockImplementation(async (config) =>
    config.url?.endsWith('/reveal')
      ? { data: { id: 'key-1', value: 'FULL-SECRET-KEY' } }
      : {
          data: {
            items: [{ id: 'key-1', masked: '****-MASK', status: 'IN_STORE' }],
            pagination: { totalItems: 1 },
            summary: {}
          }
        }
  )
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <QueryClientProvider client={client}>
      <CatalogKeyVault subscriptionId='sub-1' />
    </QueryClientProvider>
  )
  expect(await screen.findByText('****-MASK')).toBeInTheDocument()
  expect(request.mock.calls.some(([config]) => config.url?.endsWith('/reveal'))).toBe(false)
  fireEvent.click(screen.getByRole('button', { name: 'Reveal key' }))
  expect(request.mock.calls.some(([config]) => config.url?.endsWith('/reveal'))).toBe(false)
  fireEvent.click(screen.getByRole('button', { name: 'Confirm reveal' }))
  expect(await screen.findByText('FULL-SECRET-KEY')).toBeInTheDocument()
  await waitFor(() =>
    expect(
      client
        .getMutationCache()
        .getAll()
        .every((mutation) => mutation.state.data === undefined)
    ).toBe(true)
  )
  expect(
    JSON.stringify(
      client
        .getQueryCache()
        .getAll()
        .map((query) => query.state.data)
    )
  ).not.toContain('FULL-SECRET-KEY')
  fireEvent.click(screen.getByRole('button', { name: 'Hide key' }))
  expect(screen.queryByText('FULL-SECRET-KEY')).not.toBeInTheDocument()
})

it('keeps a key masked when focus is lost while reveal is still pending', async () => {
  let finishReveal: (() => void) | undefined
  request.mockImplementation(async (config) => {
    if (config.url?.endsWith('/reveal'))
      return new Promise((resolve) => {
        finishReveal = () => resolve({ data: { id: 'key-1', value: 'LATE-SECRET-KEY' } })
      })
    return {
      data: {
        items: [{ id: 'key-1', masked: '****-MASK', status: 'IN_STORE' }],
        pagination: { totalItems: 1 },
        summary: {}
      }
    }
  })
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <CatalogKeyVault subscriptionId='sub-1' />
    </QueryClientProvider>
  )
  await screen.findByText('****-MASK')
  fireEvent.click(screen.getByRole('button', { name: 'Reveal key' }))
  fireEvent.click(screen.getByRole('button', { name: 'Confirm reveal' }))
  await waitFor(() => expect(finishReveal).toBeDefined())
  fireEvent.blur(window)
  finishReveal?.()
  await waitFor(() => expect(screen.getByRole('button', { name: 'Reveal key' })).toBeEnabled())
  expect(screen.queryByText('LATE-SECRET-KEY')).not.toBeInTheDocument()
})
