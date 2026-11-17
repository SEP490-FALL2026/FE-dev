import { fireEvent, render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { expect, it, vi } from 'vitest'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { ItPurchaseDocumentsView } from './views/it-purchase-documents-view'

vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))

it('opens a contract from the list and returns to the list', async () => {
  await setAppLanguage('en', false)
  vi.mocked(customAxios).mockImplementation(async (config) => {
    if (config.url?.endsWith('/contracts/contract-1'))
      return {
        data: {
          contract: {
            id: 'contract-1',
            name: 'Annual agreement',
            status: 'ACTIVE',
            vendor: { name: 'Example vendor' },
            createdAt: '2026-11-06T10:00:00Z',
            subscriptions: [],
            documents: []
          }
        }
      }
    return {
      data: {
        items: [{ id: 'contract-1', name: 'Annual agreement', status: 'ACTIVE', vendor: { name: 'Example vendor' } }],
        pagination: { totalItems: 1, totalPages: 1 }
      }
    }
  })
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <ItPurchaseDocumentsView />
    </QueryClientProvider>
  )
  fireEvent.click(await screen.findByRole('button', { name: 'Open contract' }))
  expect(await screen.findByRole('heading', { name: 'Annual agreement' })).toBeInTheDocument()
  expect(screen.getByText('Linked subscriptions')).toBeInTheDocument()
  expect(screen.getByText('No subscriptions are linked to this contract.')).toBeInTheDocument()
  expect(screen.getByText('No attachments have been uploaded.')).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Annual agreement' }).closest('header')).toContainElement(
    screen.getByRole('button', { name: 'Upload attachment' })
  )
  expect(screen.queryByText(/contract-1/)).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Back' }))
  expect(await screen.findByRole('button', { name: 'Open contract' })).toBeInTheDocument()
})

it('opens a contract attachment and returns to its contract', async () => {
  await setAppLanguage('en', false)
  vi.mocked(customAxios).mockImplementation(async (config) => {
    if (config.url?.endsWith('/contracts/contract-1'))
      return {
        data: {
          contract: {
            id: 'contract-1',
            name: 'Annual agreement',
            status: 'ACTIVE',
            vendor: { name: 'Example vendor' },
            createdAt: '2026-11-06T10:00:00Z',
            subscriptions: [],
            documents: [{ id: 'doc-1', fileName: 'agreement.pdf', purpose: 'CONTRACT_ATTACHMENT' }]
          }
        }
      }
    if (config.url?.endsWith('/documents/doc-1'))
      return {
        data: {
          document: {
            id: 'doc-1',
            fileName: 'agreement.pdf',
            status: 'READY',
            sizeBytes: 1200,
            contractId: 'contract-1'
          }
        }
      }
    return {
      data: {
        items: [{ id: 'contract-1', name: 'Annual agreement', status: 'ACTIVE', vendor: { name: 'Example vendor' } }],
        pagination: { totalItems: 1, totalPages: 1 }
      }
    }
  })
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <ItPurchaseDocumentsView />
    </QueryClientProvider>
  )
  fireEvent.click(await screen.findByRole('button', { name: 'Open contract' }))
  expect(await screen.findByText('agreement.pdf')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Open document' }))
  expect(await screen.findByRole('heading', { name: 'agreement.pdf' })).toBeInTheDocument()
  expect(screen.queryByText(/contract-1/)).not.toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Open file' })).toBeEnabled()
  fireEvent.click(screen.getByRole('button', { name: 'Back' }))
  expect(await screen.findByRole('heading', { name: 'Annual agreement' })).toBeInTheDocument()
})
