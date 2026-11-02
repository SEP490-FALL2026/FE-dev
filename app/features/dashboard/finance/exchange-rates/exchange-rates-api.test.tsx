import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AxiosError, AxiosHeaders } from 'axios'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { i18n, setAppLanguage } from '~/shared/i18n/i18n'
import { financeSettings } from '~/shared/i18n/locales/en/finance-settings'
import { finance } from '~/shared/i18n/locales/en/finance'
import { FinanceExchangeRatesView } from './views/finance-exchange-rates-view'

describe('Finance exchange rate contract integration', () => {
  const previousAdapter = apiClient.defaults.adapter
  const requests: { url?: string; method?: string; params?: Record<string, unknown>; body?: unknown }[] = []
  let rejectWrite = false
  beforeEach(async () => {
    requests.length = 0
    rejectWrite = false
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
      if (config.method === 'post' && rejectWrite)
        throw new AxiosError('invalid', '422', config, undefined, {
          config,
          status: 422,
          statusText: 'Unprocessable',
          headers: new AxiosHeaders(),
          data: { error: { code: 'EXCHANGE_RATE.ALREADY_EXISTS' } }
        })
      const data = config.url?.endsWith('/currencies')
        ? {
            items: [
              { code: 'USD', name: 'US Dollar', minorUnit: 2 },
              { code: 'VND', name: 'Vietnamese Dong', minorUnit: 0 }
            ]
          }
        : config.url?.endsWith('/reporting-currency')
          ? { currency: 'VND' }
          : { items: [], pagination: { page: config.params?.page ?? 1, pageSize: 20, totalItems: 21, totalPages: 2 } }
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
        <FinanceExchangeRatesView />
      </QueryClientProvider>
    )
  }
  it('uses server pages and resets the page when currency/date filters change', async () => {
    mount()
    fireEvent.click(await screen.findByRole('button', { name: finance.next }))
    await waitFor(() => expect(requests.some((request) => request.params?.page === 2)).toBe(true))
    expect(requests.some((request) => request.url?.includes('/operating-parameters/'))).toBe(false)
    fireEvent.change(screen.getByLabelText(financeSettings.currency), { target: { value: 'USD' } })
    fireEvent.change(screen.getByLabelText(financeSettings.from), { target: { value: '2026-10-01' } })
    await waitFor(() =>
      expect(
        requests.some(
          (request) =>
            request.params?.page === 1 && request.params.currency === 'USD' && request.params.from === '2026-10-01'
        )
      ).toBe(true)
    )
  })
  it('sends the exact decimal string, retains a failed draft and invalidates the rate list after success', async () => {
    rejectWrite = true
    mount()
    fireEvent.click(screen.getByRole('button', { name: financeSettings.recordRate }))
    const dialog = screen.getByRole('dialog')
    await within(dialog).findByRole('option', { name: 'USD · US Dollar' })
    fireEvent.change(within(dialog).getByLabelText(financeSettings.currency), { target: { value: 'USD' } })
    fireEvent.change(within(dialog).getByLabelText(financeSettings.rateDate), { target: { value: '2026-10-31' } })
    const rate = within(dialog).getByRole('textbox')
    fireEvent.change(rate, { target: { value: '25400.0000000001' } })
    fireEvent.submit(dialog.querySelector('form')!)
    await waitFor(() => expect(requests.some((request) => request.method === 'post')).toBe(true))
    expect(requests.find((request) => request.method === 'post')?.body).toEqual({
      currency: 'USD',
      rateDate: '2026-10-31',
      rate: '25400.0000000001'
    })
    await waitFor(() => expect(within(dialog).getByRole('button', { name: financeSettings.save })).toBeEnabled())
    expect(rate).toHaveValue('25400.0000000001')
    rejectWrite = false
    fireEvent.submit(dialog.querySelector('form')!)
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(
      requests.filter((request) => request.method === 'get' && request.url?.endsWith('/exchange-rates')).length
    ).toBeGreaterThan(1)
  })
})
