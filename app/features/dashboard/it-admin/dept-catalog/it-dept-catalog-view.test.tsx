import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { ItDeptCatalogView } from './views/it-dept-catalog-view'
vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))
const request = vi.mocked(customAxios)
function mount() {
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      <ItDeptCatalogView />
    </QueryClientProvider>
  )
}
beforeEach(async () => {
  vi.resetAllMocks()
  await setAppLanguage('en', false)
})
describe('IT catalog API integration', () => {
  it('uses server pagination and contextual search without department fixtures', async () => {
    request.mockResolvedValue({
      data: {
        items: [{ id: 'app-1', name: 'Live application', kind: 'SAAS', status: 'APPROVED' }],
        pagination: { totalItems: 45 }
      }
    })
    mount()
    expect(await screen.findByText('Live application')).toBeInTheDocument()
    fireEvent.change(screen.getByPlaceholderText('Search applications by name'), { target: { value: 'Live' } })
    await waitFor(() =>
      expect(request).toHaveBeenCalledWith(
        expect.objectContaining({ params: expect.objectContaining({ search: 'Live', page: 1, pageSize: 20 }) }),
        undefined
      )
    )
    expect(screen.queryByText('Software Engineering')).not.toBeInTheDocument()
  })
  it('keeps the application draft when a create request fails', async () => {
    request.mockImplementation(async (config) => {
      if (config.method === 'POST') throw new Error('failed')
      return { data: { items: [], pagination: { totalItems: 0 } } }
    })
    mount()
    fireEvent.click(screen.getByRole('button', { name: 'Add application' }))
    fireEvent.change(screen.getByLabelText('Application name'), { target: { value: 'Draft application' } })
    fireEvent.change(screen.getByLabelText('Vendor name'), { target: { value: 'Vendor' } })
    expect(screen.queryByLabelText('Business owner employee ID')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    await waitFor(() =>
      expect(request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          data: expect.objectContaining({ name: 'Draft application', kind: 'SAAS' })
        }),
        undefined
      )
    )
    expect(screen.getByDisplayValue('Draft application')).toBeInTheDocument()
  })
  it('scopes plans and subscriptions to the selected application and gates retirement', async () => {
    request.mockImplementation(async (config) => {
      const url = config.url ?? ''
      if (url.endsWith('/applications/app-1'))
        return {
          data: { id: 'app-1', name: 'Live application', status: 'APPROVED', businessOwner: { fullName: 'Owner' } }
        }
      if (url.endsWith('/retirement'))
        return {
          data: {
            retirement: {
              status: 'APPROVED',
              confirmed: false,
              canRetire: false,
              blockers: { assignmentTotal: 0, subscriptionTotal: 0 }
            }
          }
        }
      return {
        data: {
          items: url.endsWith('/applications')
            ? [{ id: 'app-1', name: 'Live application', kind: 'SAAS', status: 'APPROVED' }]
            : [],
          pagination: { totalItems: 0 }
        }
      }
    })
    mount()
    fireEvent.click(await screen.findByRole('button', { name: 'Details' }))
    expect(await screen.findByRole('button', { name: 'Retire application permanently' })).toBeDisabled()
    await waitFor(() =>
      expect(request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('/plans'),
          params: { applicationId: 'app-1', page: 1, pageSize: 20 }
        }),
        undefined
      )
    )
    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining('/subscriptions'),
        params: { applicationId: 'app-1', page: 1, pageSize: 20 }
      }),
      undefined
    )
  })
})
