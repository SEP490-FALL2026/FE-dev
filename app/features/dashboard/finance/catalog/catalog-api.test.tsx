import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
import { afterEach, beforeEach, expect, it } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { i18n, setAppLanguage } from '~/shared/i18n/i18n'
import { financeSettings } from '~/shared/i18n/locales/en/finance-settings'
import { finance } from '~/shared/i18n/locales/en/finance'
import { FinanceCatalogView } from './views/finance-catalog-view'

const previousAdapter = apiClient.defaults.adapter
const requests: { url?: string; method?: string; params?: Record<string, unknown> }[] = []
const pagination = (page: unknown) => ({ page: page ?? 1, pageSize: 10, totalItems: 11, totalPages: 2 })

function body(url: string, params: Record<string, unknown> | undefined): unknown {
  if (url.endsWith('/applications'))
    return {
      items: [{ id: 'app', name: 'Business App', kind: 'SAAS', status: 'APPROVED', vendor: { name: 'Vendor' } }],
      pagination: pagination(params?.page)
    }
  if (url.endsWith('/applications/app'))
    return {
      id: 'app',
      name: 'Business App',
      functionalGroup: { id: 'g', name: 'Communication' },
      responsibleItAdmin: { employeeId: 'e', employeeCode: 'IT-007', fullName: 'Tran Thi IT' },
      dataSensitivity: 'HIGH'
    }
  if (url.endsWith('/plans'))
    return {
      items: [
        {
          id: 'plan',
          name: 'Business Plan',
          applicationId: 'app',
          applicationName: 'Business App',
          provisioningType: 'K1',
          pricingModel: 'PER_SEAT'
        }
      ],
      pagination: pagination(params?.page)
    }
  if (url.endsWith('/plans/plan/terms'))
    return {
      planId: 'plan',
      applicable: true,
      terms: {
        termsUrl: 'https://vendor.example/terms',
        lastReviewedOn: '2026-03-01',
        aiTraining: 'Not used',
        dataLocation: 'Singapore',
        installLimit: { maxDevicesPerKey: null, note: null },
        commercialUse: null,
        cancellationRefund: null,
        updatedAt: '2026-03-01T00:00:00Z'
      },
      warnings: [],
      warningTotal: 0
    }
  if (url.endsWith('/plans/plan'))
    return {
      id: 'plan',
      name: 'Business Plan',
      applicationName: 'Business App',
      provisioningType: 'K1',
      pricingModel: 'PER_SEAT',
      controlLevel: 'FULL',
      sharingPolicy: 'NOT_ALLOWED',
      dataLossOnRemoval: true,
      hasAdminConsole: false
    }
  if (url.endsWith('/subscriptions/sub'))
    return {
      id: 'sub',
      planName: 'Business Plan',
      ownerDepartmentId: null,
      vendor: { id: 'v', name: 'Vendor' },
      kind: 'TERM',
      status: 'DRAFT',
      missing: ['QUANTITY'],
      purchasedQuantity: null,
      unitPrice: null,
      originalPrice: null,
      billingCycle: null,
      startDate: '2026-01-01',
      endDate: null,
      renewalDate: null,
      noticeDeadline: { value: null, source: 'MISSING' },
      autoRenew: false,
      allowsMidTermReduction: false,
      vendorMinimumSeats: null,
      responsibleItAdmin: null,
      seats: null,
      taxEstimate: null
    }
  if (url.endsWith('/subscriptions'))
    return {
      items: [
        {
          id: 'sub',
          planName: 'Business Plan',
          status: 'DRAFT',
          purchasedQuantity: null,
          unitPrice: null,
          billingCycle: null,
          missingFinancialData: true,
          missing: ['QUANTITY', 'UNIT_PRICE']
        }
      ],
      pagination: pagination(params?.page)
    }
  if (url.endsWith('/contracts'))
    return {
      items: [
        {
          id: 'contract',
          name: 'Master agreement',
          number: 'HD-01',
          vendor: { id: 'v', name: 'Vendor' },
          effectiveFrom: '2026-01-01',
          effectiveTo: '2026-12-31',
          status: 'ACTIVE',
          subscriptionCount: 1
        }
      ],
      pagination: pagination(params?.page)
    }
  if (url.endsWith('/contracts/contract/usage-sources'))
    return {
      items: [{ id: 'src', name: 'Login export', application: { id: 'app', name: 'Business App' }, status: 'ACTIVE' }],
      pagination: { page: 1, pageSize: 10, totalItems: 1, totalPages: 1 }
    }
  if (url.endsWith('/contracts/contract'))
    return {
      contract: {
        id: 'contract',
        name: 'Master agreement',
        number: 'HD-01',
        vendor: { id: 'v', name: 'Vendor' },
        effectiveFrom: '2026-01-01',
        effectiveTo: '2026-12-31',
        status: 'ACTIVE',
        note: null,
        subscriptions: [
          {
            subscriptionId: 'sub',
            status: 'ACTIVE',
            startDate: '2026-01-01',
            endDate: '2026-12-31',
            planName: 'Business Plan',
            applicationName: 'Business App'
          }
        ],
        documents: [{ id: 'doc', fileName: 'agreement.pdf' }],
        truncated: { subscriptions: false, documents: false, applicationIds: false }
      }
    }
  return null
}

beforeEach(async () => {
  requests.length = 0
  i18n.addResourceBundle('en', 'financeSettings', financeSettings)
  i18n.addResourceBundle('en', 'finance', finance)
  await setAppLanguage('en', false)
  apiClient.defaults.adapter = async (config) => {
    requests.push({ url: config.url, method: config.method, params: config.params })
    const data = body(config.url ?? '', config.params)
    if (data === null) {
      const response = {
        config,
        status: 404,
        statusText: 'Not Found',
        headers: new AxiosHeaders(),
        data: { success: false, error: { code: 'NOT_FOUND' } }
      }
      throw new AxiosError('Not Found', 'ERR_BAD_REQUEST', config as InternalAxiosRequestConfig, undefined, response)
    }
    return { config, status: 200, statusText: 'OK', headers: new AxiosHeaders(), data: { success: true, data } }
  }
})
afterEach(() => {
  apiClient.defaults.adapter = previousAdapter
})

function mount() {
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <FinanceCatalogView />
    </QueryClientProvider>
  )
}

it('reads the application, a plan with its terms and a subscription, read only and without employee codes', async () => {
  mount()
  expect(screen.getByPlaceholderText(financeSettings.searchApplicationsPlaceholder)).toBeInTheDocument()
  fireEvent.click((await screen.findAllByRole('button', { name: finance.open }))[0])
  // The detail replaces the list as its own screen; its outer region comes first.
  const detail = screen.getAllByRole('region')[0]
  expect(screen.queryByPlaceholderText(financeSettings.searchApplicationsPlaceholder)).not.toBeInTheDocument()
  expect(await within(detail).findByText('Tran Thi IT')).toBeInTheDocument()
  expect(within(detail).queryByText(/IT-007/)).not.toBeInTheDocument()
  expect((await within(detail).findAllByText(financeSettings.noPrice)).length).toBeGreaterThan(0)

  // A plan opens its own panel with the terms; from there Finance narrows the subscriptions to it.
  fireEvent.click((await within(detail).findAllByRole('button', { name: finance.open }))[0])
  const plan = await screen.findByRole('dialog', { name: 'Business Plan' })
  expect(await within(plan).findByText('Singapore')).toBeInTheDocument()
  expect(within(plan).getByText(financeSettings.enum.NOT_ALLOWED)).toBeInTheDocument()
  fireEvent.click(within(plan).getByRole('button', { name: financeSettings.catalogDetail.viewSubscriptions }))
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

  // A subscription opens its detail; a draft has no adjustment point to read.
  const subscriptions = screen.getByRole('region', { name: financeSettings.subscriptions })
  await within(subscriptions).findAllByText(financeSettings.missingFinancialData)
  fireEvent.click(within(subscriptions).getAllByRole('button', { name: finance.open })[0])
  const subscription = await screen.findByRole('dialog', {
    name: financeSettings.catalogDetail.subscriptionTitle.replace('{{plan}}', 'Business Plan')
  })
  expect(await within(subscription).findByText(/Missing: Quantity/)).toBeInTheDocument()
  expect(requests.some((request) => request.url?.endsWith('/subscription-renewals/adjustment'))).toBe(false)
  expect(requests.every((request) => request.method === 'get')).toBe(true)
})

it('lists contracts and opens one with its subscriptions, files and usage sources', async () => {
  mount()
  fireEvent.click(screen.getByRole('button', { name: financeSettings.catalogDetail.partLabels.contracts }))
  expect((await screen.findAllByText('Master agreement')).length).toBeGreaterThan(0)
  expect(screen.getAllByText(financeSettings.contracts.statuses.ACTIVE).length).toBeGreaterThan(0)
  fireEvent.click(screen.getAllByRole('button', { name: finance.open })[0])
  const contract = await screen.findByRole('dialog', { name: 'Master agreement' })
  expect(await within(contract).findByText('agreement.pdf')).toBeInTheDocument()
  expect((await within(contract).findAllByText('Login export')).length).toBeGreaterThan(0)
  expect(within(contract).getAllByText('Business App · Business Plan').length).toBeGreaterThan(0)
  expect(requests.every((request) => request.method === 'get')).toBe(true)
})
