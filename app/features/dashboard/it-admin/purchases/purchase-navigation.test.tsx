import { fireEvent, render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, expect, it, vi } from 'vitest'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { ItPurchaseDocumentsView } from './views/it-purchase-documents-view'

vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))
const request = vi.mocked(customAxios)
const id = '11111111-1111-4111-8111-111111111111'
beforeEach(async () => {
  vi.resetAllMocks()
  await setAppLanguage('en', false)
  request.mockImplementation(async (config) =>
    config.url?.includes('/contracts/')
      ? { data: { contract: { id, name: 'Annual design agreement', createdAt: '2026-11-06T10:00:00Z' } } }
      : { data: { document: { id, fileName: 'Agreement.pdf', status: 'READY', sizeBytes: 500, contractId: id } } }
  )
})

it.each([
  ['Contract ID', 'Open contract', 'Annual design agreement'],
  ['Document ID', 'Open document', 'Agreement.pdf']
])('opens %s as a separate view and returns to lookup', async (field, action, heading) => {
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <ItPurchaseDocumentsView />
    </QueryClientProvider>
  )
  fireEvent.change(screen.getByLabelText(field), { target: { value: id } })
  fireEvent.click(screen.getByRole('button', { name: action }))
  expect(await screen.findByRole('heading', { name: heading })).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Open contract' })).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Open document' })).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Back' }))
  expect(screen.getByRole('button', { name: action })).toBeInTheDocument()
})
