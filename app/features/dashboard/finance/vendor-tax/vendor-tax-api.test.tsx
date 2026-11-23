import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AxiosError, AxiosHeaders } from 'axios'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { i18n, setAppLanguage } from '~/shared/i18n/i18n'
import { financeSettings } from '~/shared/i18n/locales/en/finance-settings'
import { finance } from '~/shared/i18n/locales/en/finance'
import { FinanceVendorTaxView } from './views/finance-vendor-tax-view'

/** Matches a field label that may be followed by a required marker, hint or error text. */
const labelStart = (text: string) => new RegExp(`^${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`)

describe('Finance vendor tax contract integration', () => {
  const previousAdapter = apiClient.defaults.adapter
  const requests: { url?: string; method?: string; params?: Record<string, unknown>; body?: unknown }[] = []
  let status = 'DECLARED'
  beforeEach(async () => {
    status = 'DECLARED'
    requests.length = 0
    i18n.addResourceBundle('en', 'financeSettings', financeSettings)
    i18n.addResourceBundle('en', 'finance', finance)
    await setAppLanguage('en', false)
    apiClient.defaults.adapter = async (config) => {
      requests.push({
        url: config.url,
        method: config.method,
        params: config.params,
        body: config.data ? JSON.parse(config.data) : undefined
      })
      if (config.method === 'put')
        throw new AxiosError('conflict', '409', config, undefined, {
          config,
          status: 409,
          statusText: 'Conflict',
          headers: new AxiosHeaders(),
          data: { error: { code: 'VENDOR_TAX_PROFILE.CONFLICT' } }
        })
      const pagination = { page: config.params?.page ?? 1, pageSize: 10, totalItems: 11, totalPages: 2 }
      const lines = [{ taxType: 'VAT', ratePercent: '10.0000', deductible: true, payer: 'VENDOR_COLLECTS' }]
      const data = config.url?.endsWith('/tax-profile')
        ? {
            vendorId: 'vendor',
            status,
            profile: { group: 'T1', lines, version: 1, declaredBy: 'Finance', declaredAt: '2026-10-31' },
            defaultProfile: { group: 'T2', lines: [] }
          }
        : config.url?.endsWith('/history')
          ? { items: [], pagination }
          : config.url?.endsWith('/currencies')
            ? { items: [{ code: 'USD', name: 'US Dollar', minorUnit: 2 }] }
            : config.url?.endsWith('/tax-estimate')
              ? {
                  basis: 'PROFILE',
                  label: 'ESTIMATE',
                  group: 'T1',
                  currency: 'USD',
                  netAmount: '100.0001',
                  taxAmount: '10.00001',
                  deductibleTaxAmount: '10.00001',
                  nonDeductibleTaxAmount: '0',
                  estimatedCost: '100.0001',
                  lines: []
                }
              : { items: [], pagination }
      return { config, status: 200, statusText: 'OK', headers: new AxiosHeaders(), data: { success: true, data } }
    }
  })
  afterEach(() => {
    apiClient.defaults.adapter = previousAdapter
  })
  function mount() {
    render(
      <QueryClientProvider
        client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
      >
        <FinanceVendorTaxView itemId='vendor' />
      </QueryClientProvider>
    )
  }
  it('submits the selected group and writable tax fields, preserving draft values on failure', async () => {
    mount()
    fireEvent.click(await screen.findByRole('button', { name: financeSettings.declareProfile }))
    const dialog = screen.getByRole('dialog', { name: financeSettings.declareProfile })
    fireEvent.change(within(dialog).getByLabelText(new RegExp(financeSettings.taxGroup)), { target: { value: 'T3' } })
    fireEvent.change(within(dialog).getByLabelText(labelStart(financeSettings.ratePercent)), {
      target: { value: '8.5000' }
    })
    fireEvent.submit(dialog.querySelector('form')!)
    await waitFor(() => expect(requests.some((request) => request.method === 'put')).toBe(true))
    expect(requests.find((request) => request.method === 'put')?.body).toEqual({
      group: 'T3',
      lines: [{ taxType: 'VAT', ratePercent: '8.5000', deductible: true }]
    })
    await waitFor(() => expect(within(dialog).getByRole('button', { name: financeSettings.save })).toBeEnabled())
    expect(within(dialog).getByLabelText(labelStart(financeSettings.ratePercent))).toHaveValue('8.5000')
  })
  it('requests an estimate only after submitting exact amount and currency', async () => {
    mount()
    await screen.findByRole('button', { name: financeSettings.declareProfile })
    expect(requests.some((request) => request.url?.endsWith('/tax-estimate'))).toBe(false)
    fireEvent.change(screen.getByLabelText(labelStart(financeSettings.netAmount)), { target: { value: '100.0001' } })
    await screen.findByRole('option', { name: 'USD' })
    fireEvent.change(screen.getByLabelText(labelStart(financeSettings.currency)), { target: { value: 'USD' } })
    fireEvent.click(screen.getByRole('button', { name: financeSettings.estimate }))
    await waitFor(() =>
      expect(requests.find((request) => request.url?.endsWith('/tax-estimate'))?.params).toEqual({
        netAmount: '100.0001',
        currency: 'USD'
      })
    )
    expect(await screen.findByText(financeSettings.estimatedCost)).toBeInTheDocument()
  })
  it('disables declarations for an unrecognized profile state', async () => {
    status = 'FUTURE_STATE'
    mount()
    expect(await screen.findByRole('button', { name: financeSettings.declareProfile })).toBeDisabled()
  })
})
