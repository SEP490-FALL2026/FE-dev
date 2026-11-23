import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { CatalogPurchaseForm } from './catalog-purchase-form'
import { CatalogSubscriptionEditor } from './catalog-subscription-editor'

const mocks = vi.hoisted(() => ({ create: vi.fn(), update: vi.fn(), planType: 'K2' }))
vi.mock('~/shared/api/generated/operations/plans/plan-get', () => ({
  usePlanGet: () => ({ data: { data: { provisioningType: mocks.planType } } })
}))
vi.mock('~/shared/api/generated/operations/subscriptions/subscription-list', () => ({
  useSubscriptionList: () => ({ data: { data: { items: [] } } }),
  getSubscriptionListQueryKey: () => ['subscriptions']
}))
vi.mock('~/shared/api/generated/operations/subscriptions/subscription-create', () => ({
  useSubscriptionCreate: () => ({ mutate: mocks.create })
}))
vi.mock('~/shared/api/generated/operations/subscriptions/subscription-update', () => ({
  useSubscriptionUpdate: () => ({ mutate: mocks.update })
}))
vi.mock('~/shared/api/generated/operations/it-admins/it-admin-list', () => ({
  getItAdminListQueryKey: () => ['admins'],
  itAdminList: async () => ({ data: { items: [], pagination: { totalPages: 1 } } })
}))
vi.mock('~/shared/api/generated/operations/subscriptions/subscription-get', () => ({
  useSubscriptionGet: () => ({
    data: {
      data: {
        id: 'sub',
        planId: 'plan',
        planName: 'Team',
        status: 'DRAFT',
        missing: [],
        kind: 'TERM',
        purchasedQuantity: null,
        unitPrice: null,
        startDate: null,
        billingCycle: null,
        commitmentTermMonths: null,
        responsibleItAdminEmployeeId: null,
        updatedAt: '2026-11-18T10:00:00.000Z'
      }
    },
    queryKey: ['sub'],
    isFetching: false,
    isError: false
  })
}))
function mount(component: React.ReactNode) {
  return render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      {component}
    </QueryClientProvider>
  )
}
beforeEach(async () => {
  mocks.create.mockReset()
  mocks.update.mockReset()
  mocks.planType = 'K2'
  await setAppLanguage('en', false)
})

it('restricts K1 to term purchases with monthly billing and a one-month commitment', async () => {
  mocks.planType = 'K1'
  mount(
    <CatalogPurchaseForm
      mode='subscription'
      applicationId='app'
      applicationKind='SAAS'
      planId='plan'
      onClose={() => {}}
    />
  )
  expect(screen.queryByRole('radio', { name: /perpetual/i })).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('radio', { name: /term/i }))
  expect(screen.queryByRole('radio', { name: /annual/i })).not.toBeInTheDocument()
  expect(screen.queryByRole('radio', { name: /12 months/i })).not.toBeInTheDocument()
})

it('restricts K4 to a perpetual purchase without billing and commitment fields', () => {
  mocks.planType = 'K4'
  mount(
    <CatalogPurchaseForm
      mode='subscription'
      applicationId='app'
      applicationKind='SAAS'
      planId='plan'
      onClose={() => {}}
    />
  )
  expect(screen.queryByRole('radio', { name: /^term$/i })).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('radio', { name: /perpetual/i }))
  expect(screen.queryByRole('radio', { name: /monthly/i })).not.toBeInTheDocument()
  expect(screen.queryByRole('radio', { name: /1 month/i })).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Save' }))
  expect(mocks.create).toHaveBeenCalledWith({ data: { planId: 'plan', kind: 'PERPETUAL' } })
})

it('prevents an annual payment paired with a one-month commitment', async () => {
  mount(
    <CatalogPurchaseForm
      mode='subscription'
      applicationId='app'
      applicationKind='SAAS'
      planId='plan'
      onClose={() => {}}
    />
  )
  fireEvent.click(screen.getByRole('radio', { name: /term/i }))
  fireEvent.click(screen.getByRole('radio', { name: /annual/i }))
  fireEvent.click(screen.getByRole('radio', { name: /1 month/i }))
  fireEvent.click(screen.getByRole('button', { name: 'Save' }))
  expect(mocks.create).not.toHaveBeenCalled()
  expect(screen.getByText(/annual billing requires a 12-month commitment/i)).toBeVisible()
})

it('prevents the same invalid combination when updating a draft', async () => {
  mount(<CatalogSubscriptionEditor id='sub' onClose={() => {}} />)
  fireEvent.click(await screen.findByRole('radio', { name: /annual/i }))
  fireEvent.click(screen.getByRole('radio', { name: /1 month/i }))
  fireEvent.click(screen.getByRole('button', { name: 'Save' }))
  expect(mocks.update).not.toHaveBeenCalled()
  expect(screen.getByText(/annual billing requires a 12-month commitment/i)).toBeVisible()
})

it('restricts K1 billing choices when editing', async () => {
  mocks.planType = 'K1'
  mount(<CatalogSubscriptionEditor id='sub' onClose={() => {}} />)
  expect(await screen.findByRole('radio', { name: /monthly/i })).toBeVisible()
  expect(screen.queryByRole('radio', { name: /annual/i })).not.toBeInTheDocument()
  expect(screen.queryByRole('radio', { name: /12 months/i })).not.toBeInTheDocument()
})

it('requires only the purchase type when creating a draft', async () => {
  mount(
    <CatalogPurchaseForm
      mode='subscription'
      applicationId='app'
      applicationKind='SAAS'
      planId='plan'
      onClose={() => {}}
    />
  )
  fireEvent.click(screen.getByRole('radio', { name: /term/i }))
  expect(screen.getByRole('radio', { name: /term/i })).toBeRequired()
  expect(screen.getByRole('radio', { name: /monthly/i })).not.toBeRequired()
  expect(screen.getByRole('radio', { name: /1 month/i })).not.toBeRequired()
  expect(screen.getByLabelText('Purchased seats')).not.toBeRequired()
  expect(screen.getByLabelText('Unit price (VND)')).not.toBeRequired()
  expect(screen.getByLabelText('Start date')).not.toBeRequired()
  expect(await screen.findByLabelText('Responsible IT administrator')).not.toBeRequired()
  fireEvent.click(screen.getByRole('button', { name: 'Save' }))
  await waitFor(() => expect(mocks.create).toHaveBeenCalledWith({ data: { planId: 'plan', kind: 'TERM' } }))
})

it('allows updating a single field of an incomplete draft without exposing unrelated fields', async () => {
  mount(<CatalogSubscriptionEditor id='sub' onClose={() => {}} />)
  const quantity = await screen.findByLabelText('Purchased seats')
  expect(quantity).not.toBeRequired()
  expect(screen.getByLabelText('Unit price (VND)')).not.toBeRequired()
  expect(screen.getByLabelText('Start date')).not.toBeRequired()
  expect(screen.getByRole('radio', { name: /monthly/i })).not.toBeRequired()
  expect(screen.getByRole('radio', { name: /1 month/i })).not.toBeRequired()
  expect(screen.queryByLabelText('End date')).not.toBeInTheDocument()
  fireEvent.change(quantity, { target: { value: '5' } })
  fireEvent.click(screen.getByRole('button', { name: 'Save' }))
  expect(mocks.update).toHaveBeenCalledWith({
    id: 'sub',
    data: { purchasedQuantity: 5, expectedUpdatedAt: '2026-11-18T10:00:00.000Z' }
  })
})
