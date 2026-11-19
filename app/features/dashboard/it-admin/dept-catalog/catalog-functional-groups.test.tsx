import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, expect, it, vi } from 'vitest'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { ItDeptCatalogView } from './views/it-dept-catalog-view'

vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))
const request = vi.mocked(customAxios)
beforeEach(async () => {
  vi.resetAllMocks()
  await setAppLanguage('en', false)
  request.mockImplementation(async (config) => {
    if (config.url?.endsWith('/functional-groups') && config.method === 'POST')
      return { data: { id: 'group-1', name: 'Design tools', status: 'ACTIVE' } }
    return {
      data: {
        items: config.url?.endsWith('/functional-groups')
          ? [{ id: 'group-1', name: 'Design tools', status: 'ACTIVE' }]
          : [],
        pagination: { totalItems: 1 }
      }
    }
  })
})
function mount() {
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <ItDeptCatalogView />
    </QueryClientProvider>
  )
}
it('lists and creates functional groups without adding a form below the catalog', async () => {
  mount()
  fireEvent.click(screen.getByRole('button', { name: 'Functional groups' }))
  expect(await screen.findByText('Design tools')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Create functional group' }))
  expect(screen.getByRole('dialog')).toBeInTheDocument()
  fireEvent.change(screen.getByLabelText('Group name'), { target: { value: 'Communication' } })
  fireEvent.click(screen.getByRole('button', { name: 'Save' }))
  await waitFor(() =>
    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: expect.stringMatching(/\/api\/v1\/functional-groups$/),
        data: { name: 'Communication' }
      }),
      undefined
    )
  )
})
it('sends an optional functional group with the application declaration', async () => {
  mount()
  fireEvent.click(screen.getByRole('button', { name: 'Add application' }))
  fireEvent.change(screen.getByLabelText('Application name'), { target: { value: 'Design suite' } })
  fireEvent.change(screen.getByLabelText('Vendor name'), { target: { value: 'Supplier' } })
  expect(screen.queryByLabelText('Business owner employee ID')).not.toBeInTheDocument()
  fireEvent.click(await screen.findByRole('combobox', { name: 'Functional group' }))
  fireEvent.click(await screen.findByRole('option', { name: 'Design tools' }))
  fireEvent.click(screen.getByRole('button', { name: 'Save' }))
  await waitFor(() =>
    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: expect.stringMatching(/\/api\/v1\/applications$/),
        data: expect.objectContaining({ functionalGroupId: 'group-1' })
      }),
      undefined
    )
  )
  expect(request.mock.calls.find(([config]) => config.method === 'POST')?.[0].data).not.toHaveProperty(
    'businessOwnerEmployeeId'
  )
})
