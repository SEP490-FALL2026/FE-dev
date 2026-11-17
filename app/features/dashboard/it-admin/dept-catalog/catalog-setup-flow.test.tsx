import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { CatalogWorkspaceSetup } from './components/catalog-workspace-setup'
import { CatalogPlanSetup, type SetupPlan } from './components/catalog-plan-setup'
import { CatalogPurchaseForm } from './components/catalog-purchase-form'
vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))
const mount = (node: React.ReactNode) =>
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      {node}
    </QueryClientProvider>
  )
it('requires two distinct IT administrators and sends the workspace owner and administrator', async () => {
  await setAppLanguage('en', false)
  const request = vi.mocked(customAxios)
  request.mockReset()
  request.mockImplementation(async (config) => {
    if (config.method === 'PUT') return { data: {} }
    if (config.url?.endsWith('/it-admins'))
      return {
        data: {
          items: [
            { employeeId: 'owner', fullName: 'Alice', employeeCode: 'E1' },
            { employeeId: 'admin', fullName: 'Bob', employeeCode: 'E2' }
          ],
          pagination: { totalItems: 2 }
        }
      }
    return { data: { workspaceProfile: null } }
  })
  mount(<CatalogWorkspaceSetup planId='plan-one' onClose={vi.fn()} />)
  fireEvent.click(await screen.findByRole('combobox', { name: 'Primary owner' }))
  fireEvent.click(await screen.findByRole('option', { name: 'Alice · E1' }))
  fireEvent.click(screen.getByRole('combobox', { name: 'Second administrator' }))
  fireEvent.click(screen.getByRole('option', { name: 'Bob · E2' }))
  fireEvent.click(screen.getByRole('button', { name: 'Save' }))
  await waitFor(() =>
    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'PUT',
        data: {
          primaryOwnerEmployeeId: 'owner',
          members: [
            { employeeId: 'owner', role: 'OWNER' },
            { employeeId: 'admin', role: 'ADMIN' }
          ]
        }
      }),
      undefined
    )
  )
})
it('only offers subscription and workspace steps for applicable plan types', async () => {
  await setAppLanguage('en', false)
  const plan: SetupPlan = {
    id: 'p',
    applicationId: 'a',
    applicationName: 'App',
    name: 'Personal',
    provisioningType: 'K1',
    hasAdminConsole: false
  }
  const view = mount(<CatalogPlanSetup plan={plan} applicationKind='SAAS' onBack={vi.fn()} />)
  expect(screen.queryByRole('button', { name: 'Add subscription' })).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Set up workspace' })).not.toBeInTheDocument()
  view.rerender(
    <QueryClientProvider client={new QueryClient()}>
      <CatalogPlanSetup plan={{ ...plan, provisioningType: 'K2' }} applicationKind='SAAS' onBack={vi.fn()} />
    </QueryClientProvider>
  )
  expect(screen.getByRole('button', { name: 'Add subscription' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Set up workspace' })).toBeInTheDocument()
})

it('does not overwrite an existing workspace profile', async () => {
  await setAppLanguage('en', false)
  const request = vi.mocked(customAxios)
  request.mockReset()
  request.mockImplementation(async (config) =>
    config.url?.endsWith('/it-admins')
      ? { data: { items: [], pagination: { totalItems: 0 } } }
      : { data: { workspaceProfile: { primaryOwner: { fullName: 'Alice' } } } }
  )
  mount(<CatalogWorkspaceSetup planId='plan-one' onClose={vi.fn()} />)
  expect(
    await screen.findByText('A workspace profile already exists. This setup cannot replace it.')
  ).toBeInTheDocument()
  expect(request.mock.calls.some(([config]) => config.method === 'PUT')).toBe(false)
})

it('sends the subscription price, seats and commitment for a team plan', async () => {
  await setAppLanguage('en', false)
  const request = vi.mocked(customAxios)
  request.mockReset()
  request.mockImplementation(async (config) =>
    config.method === 'POST' ? { data: null } : { data: { provisioningType: 'K2' } }
  )
  mount(
    <CatalogPurchaseForm mode='subscription' applicationId='a1' applicationKind='SAAS' planId='p1' onClose={vi.fn()} />
  )
  fireEvent.click(await screen.findByLabelText('Term'))
  fireEvent.change(screen.getByLabelText('Purchased seats'), { target: { value: '10' } })
  fireEvent.change(screen.getByLabelText('Unit price'), { target: { value: '250000' } })
  fireEvent.click(screen.getByLabelText('12 months'))
  fireEvent.click(screen.getByRole('button', { name: 'Save' }))
  await waitFor(() =>
    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        data: expect.objectContaining({
          planId: 'p1',
          kind: 'TERM',
          purchasedQuantity: 10,
          unitPrice: { amount: '250000', currency: 'VND' },
          commitmentTermMonths: 12
        })
      }),
      undefined
    )
  )
})
