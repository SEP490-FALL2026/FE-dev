import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, expect, it, vi } from 'vitest'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { CatalogPlanEditor } from './components/catalog-plan-editor'
import { CatalogSubscriptionEditor } from './components/catalog-subscription-editor'
vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))
const request = vi.mocked(customAxios)
beforeEach(async () => {
  vi.resetAllMocks()
  await setAppLanguage('en', false)
})
function mount(child: React.ReactNode) {
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      {child}
    </QueryClientProvider>
  )
}
it('loads plan details and preserves edited draft after update failure', async () => {
  request.mockImplementation(async (config) => {
    if (config.method === 'PATCH') throw new Error('failed')
    return {
      data: {
        id: 'plan-1',
        name: 'Existing plan',
        provisioningType: 'K1',
        pricingModel: 'PER_SEAT',
        controlLevel: 'FULL',
        dataLossOnRemoval: false
      }
    }
  })
  mount(<CatalogPlanEditor id='plan-1' onClose={() => undefined} />)
  fireEvent.change(await screen.findByLabelText('Plan name'), { target: { value: 'Updated plan' } })
  fireEvent.click(screen.getByRole('button', { name: 'Save' }))
  await waitFor(() =>
    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'PATCH', data: expect.objectContaining({ name: 'Updated plan' }) }),
      undefined
    )
  )
  expect(screen.getByDisplayValue('Updated plan')).toBeInTheDocument()
})
it('prevents completing drafts with missing data', async () => {
  request.mockResolvedValue({
    data: {
      id: 'sub-1',
      status: 'DRAFT',
      planName: 'Plan',
      missing: ['UNIT_PRICE'],
      autoRenew: false,
      allowsMidTermReduction: false
    }
  })
  mount(<CatalogSubscriptionEditor id='sub-1' onClose={() => undefined} />)
  expect(await screen.findByRole('button', { name: 'Activate subscription' })).toBeDisabled()
  expect(request.mock.calls.some(([config]) => config.method === 'POST')).toBe(false)
})
it('activates a complete draft through the completion endpoint', async () => {
  request.mockResolvedValue({
    data: {
      id: 'sub-1',
      status: 'DRAFT',
      planName: 'Plan',
      missing: [],
      autoRenew: false,
      allowsMidTermReduction: false
    }
  })
  mount(<CatalogSubscriptionEditor id='sub-1' onClose={() => undefined} />)
  fireEvent.click(await screen.findByRole('button', { name: 'Activate subscription' }))
  await waitFor(() =>
    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'POST', url: expect.stringContaining('/subscriptions/sub-1/completions') }),
      undefined
    )
  )
})
it('lets Finance recover an exchange-rate-only draft through completion', async () => {
  request.mockResolvedValue({
    data: {
      id: 'sub-1',
      status: 'DRAFT',
      planName: 'Plan',
      missing: ['EXCHANGE_RATE'],
      autoRenew: false,
      allowsMidTermReduction: false
    }
  })
  mount(<CatalogSubscriptionEditor id='sub-1' onClose={() => undefined} />)
  fireEvent.click(await screen.findByRole('button', { name: 'Activate subscription' }))
  await waitFor(() =>
    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'POST', url: expect.stringContaining('/completions') }),
      undefined
    )
  )
})
it('waits for the opening plan refresh instead of mounting stale default values', async () => {
  const { getPlanGetQueryKey } = await import('~/shared/api/generated/operations/plans/plan-get')
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  client.setQueryData(getPlanGetQueryKey('plan-1'), {
    data: { id: 'plan-1', name: 'Cached plan', provisioningType: 'K5', dataLossOnRemoval: false }
  })
  let resolveRequest: (value: unknown) => void = () => undefined
  request.mockImplementation(
    () =>
      new Promise((resolve) => {
        resolveRequest = resolve
      })
  )
  render(
    <QueryClientProvider client={client}>
      <CatalogPlanEditor id='plan-1' onClose={() => undefined} />
    </QueryClientProvider>
  )
  expect(screen.queryByLabelText('Plan name')).not.toBeInTheDocument()
  resolveRequest({ data: { id: 'plan-1', name: 'Fresh plan', provisioningType: 'K5', dataLossOnRemoval: false } })
  expect(await screen.findByDisplayValue('Fresh plan')).toBeInTheDocument()
})
it('preserves a dirty plan draft and blocks stale writes until explicitly reloaded', async () => {
  const { getPlanGetQueryKey } = await import('~/shared/api/generated/operations/plans/plan-get')
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const original = { id: 'plan-1', name: 'Original plan', provisioningType: 'K5', dataLossOnRemoval: false }
  request.mockResolvedValue({ data: original })
  render(
    <QueryClientProvider client={client}>
      <CatalogPlanEditor id='plan-1' onClose={() => undefined} />
    </QueryClientProvider>
  )
  fireEvent.change(await screen.findByLabelText('Plan name'), { target: { value: 'My draft' } })
  client.setQueryData(getPlanGetQueryKey('plan-1'), { data: { ...original, name: 'Remote plan' } })
  expect(await screen.findByRole('button', { name: 'Discard draft and reload' })).toBeInTheDocument()
  expect(screen.getByDisplayValue('My draft')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
  fireEvent.click(screen.getByRole('button', { name: 'Discard draft and reload' }))
  expect(await screen.findByDisplayValue('Remote plan')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled()
})
it('opens subscription fields from the refreshed quantity and missing-data snapshot', async () => {
  const { getSubscriptionGetQueryKey } =
    await import('~/shared/api/generated/operations/subscriptions/subscription-get')
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const cached = {
    id: 'sub-1',
    status: 'DRAFT',
    planName: 'Plan',
    purchasedQuantity: 1,
    missing: ['QUANTITY'],
    autoRenew: false,
    allowsMidTermReduction: false
  }
  client.setQueryData(getSubscriptionGetQueryKey('sub-1'), { data: cached })
  let resolveRequest: (value: unknown) => void = () => undefined
  request.mockImplementation(
    () =>
      new Promise((resolve) => {
        resolveRequest = resolve
      })
  )
  render(
    <QueryClientProvider client={client}>
      <CatalogSubscriptionEditor id='sub-1' onClose={() => undefined} />
    </QueryClientProvider>
  )
  expect(screen.queryByLabelText('Purchased seats')).not.toBeInTheDocument()
  resolveRequest({ data: { ...cached, purchasedQuantity: 7, missing: [] } })
  expect(await screen.findByLabelText('Purchased seats')).toHaveValue(7)
  expect(screen.getByRole('button', { name: 'Activate subscription' })).toBeEnabled()
})
it('refreshes seat usage and an active baseline preview after completion', async () => {
  const { QueryObserver } = await import('@tanstack/react-query')
  const { env } = await import('~/shared/config/env')
  const { getSubscriptionSeatUsageQueryKey } =
    await import('~/shared/api/generated/operations/subscriptions/subscription-seat-usage')
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const previewKey = [`${env.API_BASE_URL}/api/v1/seat-baseline-imports/import-1`]
  const fetchPreview = vi.fn(async () => ({ data: { previewVersion: 1 } }))
  const observer = new QueryObserver(client, { queryKey: previewKey, queryFn: fetchPreview })
  const unsubscribe = observer.subscribe(() => undefined)
  const seatKey = getSubscriptionSeatUsageQueryKey('sub-1')
  client.setQueryData(seatKey, { data: { occupied: 1 } })
  request.mockResolvedValue({
    data: {
      id: 'sub-1',
      status: 'DRAFT',
      planName: 'Plan',
      missing: [],
      autoRenew: false,
      allowsMidTermReduction: false
    }
  })
  render(
    <QueryClientProvider client={client}>
      <CatalogSubscriptionEditor id='sub-1' onClose={() => undefined} />
    </QueryClientProvider>
  )
  fireEvent.click(await screen.findByRole('button', { name: 'Activate subscription' }))
  await waitFor(() => expect(client.getQueryState(seatKey)?.isInvalidated).toBe(true))
  await waitFor(() => expect(fetchPreview.mock.calls.length).toBeGreaterThanOrEqual(2))
  unsubscribe()
})
