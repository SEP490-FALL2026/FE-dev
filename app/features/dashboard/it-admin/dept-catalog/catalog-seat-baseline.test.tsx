import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, expect, it, vi } from 'vitest'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { CatalogSeatBaseline } from './components/catalog-seat-baseline'
vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))
const request = vi.mocked(customAxios)
const preview = {
  id: 'import-1',
  fileName: 'seats.csv',
  status: 'PREVIEW',
  previewVersion: 3,
  summary: { valid: 2, errors: 1, totalRows: 3 },
  result: null
}
beforeEach(async () => {
  vi.resetAllMocks()
  await setAppLanguage('en', false)
})
it('limits the baseline subscription choices to the selected plan', async () => {
  request.mockImplementation(async (config) =>
    config.url?.endsWith('/seat-baseline')
      ? { data: { closed: false } }
      : { data: { items: [], pagination: { totalItems: 0 } } }
  )
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <CatalogSeatBaseline applicationId='app-1' planId='plan-1' />
    </QueryClientProvider>
  )
  await waitFor(() =>
    expect(
      request.mock.calls.some(
        ([config]) => config.url?.endsWith('/subscriptions') && config.params?.planId === 'plan-1'
      )
    ).toBe(true)
  )
})
it('uploads a selected subscription and retains the same confirmation intent after failure', async () => {
  let attempts = 0
  request.mockImplementation(async (config) => {
    const url = config.url ?? ''
    if (url.endsWith('/confirm')) {
      attempts++
      if (attempts === 1) throw new Error('network')
      return { data: { import: { ...preview, status: 'COMPLETED', result: { created: 2, errors: 1 } } } }
    }
    if (url.endsWith('/seat-baseline-imports') || url.endsWith('/import-1')) return { data: preview }
    if (url.endsWith('/rows'))
      return {
        data: {
          items: [
            {
              lineNumber: 4,
              outcome: 'ERROR',
              cells: { employeeCode: 'BAD' },
              errors: [{ code: 'EMPLOYEE_NOT_FOUND' }]
            }
          ],
          pagination: { totalItems: 1 }
        }
      }
    if (url.endsWith('/seat-baseline')) return { data: { closed: false } }
    return {
      data: {
        items: [{ id: 'sub-1', planName: 'Paid plan', status: 'ACTIVE', purchasedQuantity: 10 }],
        pagination: { totalItems: 1 }
      }
    }
  })
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      <CatalogSeatBaseline applicationId='app-1' />
    </QueryClientProvider>
  )
  fireEvent.click(await screen.findByLabelText(/Paid plan/))
  expect(screen.queryByText('sub-1')).not.toBeInTheDocument()
  fireEvent.change(screen.getByLabelText('CSV file'), {
    target: { files: [new File(['employeeCode\nA'], 'seats.csv', { type: 'text/csv' })] }
  })
  fireEvent.submit(screen.getByRole('button', { name: 'Upload preview' }).closest('form')!)
  expect(await screen.findByText('Employee not found')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Confirm valid rows' }))
  await waitFor(() => expect(attempts).toBe(1))
  await waitFor(() => expect(screen.getByRole('button', { name: 'Confirm valid rows' })).toBeEnabled())
  fireEvent.click(screen.getByRole('button', { name: 'Confirm valid rows' }))
  await waitFor(() => expect(attempts).toBe(2))
  const confirms = request.mock.calls.filter(([config]) => config.url?.endsWith('/confirm'))
  expect(confirms[0][0].data).toEqual(confirms[1][0].data)
  expect(confirms[0][0].data).toEqual({ previewVersion: 3, idempotencyKey: expect.any(String) })
})
it('blocks duplicate uploads and keeps the selected CSV when upload fails', async () => {
  let rejectUpload: (error: Error) => void = () => undefined
  request.mockImplementation(async (config) => {
    if (config.method === 'POST')
      return new Promise((_resolve, reject) => {
        rejectUpload = reject
      })
    if (config.url?.endsWith('/seat-baseline')) return { data: { closed: false } }
    return {
      data: {
        items: [{ id: 'sub-1', planName: 'Paid plan', status: 'ACTIVE', purchasedQuantity: 10 }],
        pagination: { totalItems: 1 }
      }
    }
  })
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      <CatalogSeatBaseline applicationId='app-1' />
    </QueryClientProvider>
  )
  fireEvent.click(await screen.findByLabelText(/Paid plan/))
  const file = new File(['employeeCode\nA'], 'seats.csv', { type: 'text/csv' })
  const input = screen.getByLabelText('CSV file') as HTMLInputElement
  fireEvent.change(input, { target: { files: [file] } })
  fireEvent.submit(screen.getByRole('button', { name: 'Upload preview' }).closest('form')!)
  expect(await screen.findByRole('button', { name: 'Uploading preview…' })).toBeDisabled()
  rejectUpload(new Error('failed'))
  await waitFor(() => expect(screen.getByRole('button', { name: 'Upload preview' })).toBeEnabled())
  expect(input.files?.[0]).toBe(file)
  expect(request.mock.calls.filter(([config]) => config.method === 'POST')).toHaveLength(1)
})
it('requires explicit confirmation before closing the organization baseline', async () => {
  request.mockImplementation(async (config) =>
    config.url?.endsWith('/seat-baseline')
      ? { data: { closed: false } }
      : { data: { items: [], pagination: { totalItems: 0 } } }
  )
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <CatalogSeatBaseline applicationId='app-1' />
    </QueryClientProvider>
  )
  fireEvent.click(await screen.findByRole('button', { name: 'Close baseline permanently' }))
  expect(screen.getByRole('dialog')).toHaveTextContent('entire organization')
  expect(request.mock.calls.filter(([config]) => config.method === 'POST')).toHaveLength(0)
})
it('uploads an internal K5 baseline using planId without subscriptionId', async () => {
  request.mockImplementation(async (config) => {
    if (config.method === 'POST') return { data: preview }
    if (config.url?.endsWith('/seat-baseline')) return { data: { closed: false } }
    if (config.url?.endsWith('/plans'))
      return { data: { items: [{ id: 'plan-5', name: 'Internal access' }], pagination: { totalItems: 1 } } }
    return { data: { ...preview, items: [], pagination: { totalItems: 0 } } }
  })
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <CatalogSeatBaseline applicationId='app-5' applicationKind='INTERNAL' />
    </QueryClientProvider>
  )
  fireEvent.click(await screen.findByLabelText(/Internal access/))
  fireEvent.change(screen.getByLabelText('CSV file'), {
    target: { files: [new File(['employeeCode\nA'], 'seats.csv')] }
  })
  fireEvent.submit(screen.getByRole('button', { name: 'Upload preview' }).closest('form')!)
  await waitFor(() => expect(request.mock.calls.some(([config]) => config.method === 'POST')).toBe(true))
  const body = request.mock.calls.find(([config]) => config.method === 'POST')?.[0].data as FormData
  expect(body.get('planId')).toBe('plan-5')
  expect(body.has('subscriptionId')).toBe(false)
  expect(request.mock.calls.some(([config]) => config.url?.endsWith('/subscriptions'))).toBe(false)
})
