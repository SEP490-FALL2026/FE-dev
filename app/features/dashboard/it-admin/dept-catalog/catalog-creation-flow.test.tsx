import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { CatalogApplicationForm } from './components/catalog-application-form'
import type {
  ApplicationDetailResponseDtoData,
  CreatedApplicationResponseDtoDataPlan
} from '~/shared/api/generated/model/applications'
vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))
it('opens the application creation form as a modal', async () => {
  await setAppLanguage('en', false)
  vi.mocked(customAxios).mockResolvedValue({ data: { items: [], pagination: { totalItems: 0 } } } as never)
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <CatalogApplicationForm onClose={vi.fn()} />
    </QueryClientProvider>
  )
  expect(screen.getByRole('dialog', { name: 'Add application' })).toHaveAttribute('aria-modal', 'true')
})
it('requires a control level for a team plan and sends its rules with the application', async () => {
  await setAppLanguage('en', false)
  const request = vi.mocked(customAxios)
  request.mockReset()
  request.mockResolvedValue({ data: null } as never)
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      <CatalogApplicationForm onClose={vi.fn()} />
    </QueryClientProvider>
  )
  fireEvent.change(screen.getByLabelText('Application name'), { target: { value: 'Canvas' } })
  fireEvent.change(screen.getByLabelText('Vendor name'), { target: { value: 'Vendor' } })
  fireEvent.change(screen.getByLabelText('Plan name'), { target: { value: 'Team' } })
  fireEvent.click(screen.getByLabelText('Shared workspace'))
  expect(screen.queryByLabelText('Centralized sign-in and synchronization')).not.toBeInTheDocument()
  fireEvent.click(screen.getByLabelText('Full control'))
  fireEvent.click(screen.getByLabelText('Data is lost when access is removed'))
  fireEvent.change(screen.getByLabelText('Revocation note'), { target: { value: 'Transfer files first' } })
  fireEvent.change(screen.getByLabelText('Logo URL'), { target: { value: 'https://example.org/logo.png' } })
  fireEvent.click(screen.getByRole('button', { name: 'Save' }))
  await waitFor(() =>
    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        data: expect.objectContaining({
          name: 'Canvas',
          vendorName: 'Vendor',
          logoUrl: 'https://example.org/logo.png',
          plan: expect.objectContaining({
            name: 'Team',
            provisioningType: 'K2',
            controlLevel: 'FULL',
            dataLossOnRemoval: true,
            revocationNote: 'Transfer files first'
          })
        })
      }),
      undefined
    )
  )
})

it('offers a vendor console only for K4 and does not ask internal plans for control level', async () => {
  await setAppLanguage('en', false)
  vi.mocked(customAxios).mockResolvedValue({ data: { items: [], pagination: { totalItems: 0 } } } as never)
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <CatalogApplicationForm onClose={vi.fn()} />
    </QueryClientProvider>
  )
  fireEvent.click(screen.getByLabelText('License key'))
  expect(screen.getByLabelText('Has vendor administration console')).toBeInTheDocument()
  expect(screen.getByLabelText('Full control')).toBeRequired()
  fireEvent.click(screen.getByLabelText('Internal access'))
  expect(screen.queryByLabelText('Has vendor administration console')).not.toBeInTheDocument()
  expect(screen.queryByLabelText('Full control')).not.toBeInTheDocument()
  expect(screen.queryByLabelText('Vendor name')).not.toBeInTheDocument()
})

it('continues with the plan returned by the server after a successful creation', async () => {
  await setAppLanguage('en', false)
  const returnedPlan = {
    id: 'p1',
    applicationId: 'a1',
    applicationName: 'Canvas',
    name: 'Team',
    provisioningType: 'K2',
    hasAdminConsole: false
  }
  vi.mocked(customAxios).mockImplementation(async (config) =>
    config.method === 'POST'
      ? { data: { id: 'a1', plan: returnedPlan } }
      : { data: { items: [], pagination: { totalItems: 0 } } }
  )
  const created = vi.fn()
  mountForm(created)
  fireEvent.change(screen.getByLabelText('Application name'), { target: { value: 'Canvas' } })
  fireEvent.change(screen.getByLabelText('Vendor name'), { target: { value: 'Vendor' } })
  fireEvent.change(screen.getByLabelText('Plan name'), { target: { value: 'Team' } })
  fireEvent.click(screen.getByLabelText('Shared workspace'))
  fireEvent.click(screen.getByLabelText('Full control'))
  fireEvent.click(screen.getByRole('button', { name: 'Save' }))
  await waitFor(() => expect(created).toHaveBeenCalledWith(returnedPlan))
})

function mountForm(onCreated: (plan: CreatedApplicationResponseDtoDataPlan) => void) {
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      <CatalogApplicationForm onClose={vi.fn()} onCreated={onCreated} />
    </QueryClientProvider>
  )
}

it('clears an existing logo by sending null when editing the application', async () => {
  await setAppLanguage('en', false)
  const request = vi.mocked(customAxios)
  request.mockReset()
  request.mockResolvedValue({ data: null } as never)
  const application = {
    id: 'a1',
    name: 'Canvas',
    logoUrl: 'https://example.org/old.png'
  } as NonNullable<ApplicationDetailResponseDtoData>
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      <CatalogApplicationForm application={application} onClose={vi.fn()} />
    </QueryClientProvider>
  )
  fireEvent.change(screen.getByLabelText('Logo URL'), { target: { value: '' } })
  fireEvent.click(screen.getByRole('button', { name: 'Save' }))
  await waitFor(() =>
    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'PATCH', data: { name: 'Canvas', logoUrl: null } }),
      undefined
    )
  )
})

it('offers the existing application when the server reports a duplicate', async () => {
  await setAppLanguage('en', false)
  const request = vi.mocked(customAxios)
  request.mockReset()
  request.mockImplementation(async (config) => {
    if (config.method === 'POST')
      throw {
        isAxiosError: true,
        response: {
          status: 409,
          data: {
            error: { code: 'APPLICATION.DUPLICATE', details: { existing: { id: 'a1', name: 'Existing Canvas' } } }
          }
        }
      }
    return { data: { items: [], pagination: { totalItems: 0 } } }
  })
  const useExisting = vi.fn()
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      <CatalogApplicationForm onClose={vi.fn()} onUseExisting={useExisting} />
    </QueryClientProvider>
  )
  fireEvent.change(screen.getByLabelText('Application name'), { target: { value: 'Canvas' } })
  fireEvent.change(screen.getByLabelText('Vendor name'), { target: { value: 'Vendor' } })
  fireEvent.change(screen.getByLabelText('Plan name'), { target: { value: 'Team' } })
  fireEvent.click(screen.getByLabelText('Shared workspace'))
  fireEvent.click(screen.getByLabelText('Full control'))
  fireEvent.click(screen.getByRole('button', { name: 'Save' }))
  fireEvent.click(await screen.findByRole('button', { name: 'Use Existing Canvas' }))
  expect(useExisting).toHaveBeenCalledWith('Existing Canvas')
})
