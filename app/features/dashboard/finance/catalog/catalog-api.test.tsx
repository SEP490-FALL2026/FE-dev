import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AxiosHeaders } from 'axios'
import { afterEach, beforeEach, expect, it } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { i18n, setAppLanguage } from '~/shared/i18n/i18n'
import { financeSettings } from '~/shared/i18n/locales/en/finance-settings'
import { finance } from '~/shared/i18n/locales/en/finance'
import { FinanceCatalogView } from './views/finance-catalog-view'

const previousAdapter = apiClient.defaults.adapter
const requests: { url?: string; method?: string; params?: Record<string, unknown> }[] = []
beforeEach(async () => {
  requests.length = 0
  i18n.addResourceBundle('en', 'financeSettings', financeSettings)
  i18n.addResourceBundle('en', 'finance', finance)
  await setAppLanguage('en', false)
  apiClient.defaults.adapter = async (config) => {
    requests.push({ url: config.url, method: config.method, params: config.params })
    const items = config.url?.endsWith('/applications')
      ? [{ id: 'app', name: 'Business App', kind: 'SAAS', status: 'APPROVED', vendor: { name: 'Vendor' } }]
      : config.url?.endsWith('/plans')
        ? [
            {
              id: 'plan',
              name: 'Business Plan',
              applicationId: 'app',
              applicationName: 'Business App',
              provisioningType: 'K1',
              pricingModel: 'PER_SEAT'
            }
          ]
        : [
            {
              id: 'sub',
              planName: 'Business Plan',
              status: 'DRAFT',
              purchasedQuantity: null,
              unitPrice: null,
              billingCycle: null,
              missingFinancialData: true
            }
          ]
    return {
      config,
      status: 200,
      statusText: 'OK',
      headers: new AxiosHeaders(),
      data: {
        success: true,
        data: { items, pagination: { page: config.params?.page ?? 1, pageSize: 10, totalItems: 11, totalPages: 2 } }
      }
    }
  }
})
afterEach(() => {
  apiClient.defaults.adapter = previousAdapter
})
it('reads plans and subscriptions for the chosen application without inventing missing prices', async () => {
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <FinanceCatalogView />
    </QueryClientProvider>
  )
  expect(screen.getByPlaceholderText(financeSettings.searchApplicationsPlaceholder)).toBeInTheDocument()
  fireEvent.click((await screen.findAllByRole('button', { name: finance.open }))[0])
  const detail = screen.getByRole('dialog')
  await waitFor(() =>
    expect(requests.some((request) => request.url?.endsWith('/plans') && request.params?.applicationId === 'app')).toBe(
      true
    )
  )
  expect((await within(detail).findAllByText(financeSettings.noPrice)).length).toBeGreaterThan(0)
  fireEvent.click(within(detail).getAllByRole('button', { name: finance.open })[0])
  await waitFor(() =>
    expect(
      requests.some(
        (request) =>
          request.url?.endsWith('/subscriptions') &&
          request.params?.applicationId === 'app' &&
          request.params.planId === 'plan'
      )
    ).toBe(true)
  )
  expect(requests.every((request) => request.method === 'get')).toBe(true)
})
