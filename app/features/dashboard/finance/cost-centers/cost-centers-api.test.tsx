import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AxiosHeaders } from 'axios'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { i18n, setAppLanguage } from '~/shared/i18n/i18n'
import { financeSettings } from '~/shared/i18n/locales/en/finance-settings'
import { finance } from '~/shared/i18n/locales/en/finance'
import { FinanceCostCentersView } from './views/finance-cost-centers-view'

describe('Finance cost center contract integration', () => {
  const previousAdapter = apiClient.defaults.adapter
  const requests: { url?: string; method?: string; params?: Record<string, unknown>; body?: unknown }[] = []
  let status = 'ACTIVE'
  beforeEach(async () => {
    requests.length = 0
    status = 'ACTIVE'
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
      const pagination = { page: config.params?.page ?? 1, pageSize: 20, totalItems: 21, totalPages: 2 }
      const data = config.url?.endsWith('/employees')
        ? { items: [{ employeeCode: 'EMP-1', fullName: 'Employee One', status: 'ACTIVE' }], pagination }
        : config.url?.endsWith('/departments')
          ? {
              items: [
                { id: 'department', code: 'ENG', name: 'Engineering', status: 'ACTIVE', costCenter: null },
                { id: 'linked', code: 'OPS', name: 'Operations', status: 'ACTIVE', costCenter: { id: 'existing' } }
              ],
              pagination
            }
          : {
              items: [
                {
                  id: 'center',
                  code: 'CC-ENG',
                  name: 'Engineering cost',
                  department: { id: 'department', code: 'ENG', name: 'Engineering' },
                  status,
                  kind: 'UNIT'
                }
              ],
              pagination
            }
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
        <FinanceCostCentersView />
      </QueryClientProvider>
    )
  }
  it('creates a UNIT cost center using the supplied department ID without calling a forbidden department lookup', async () => {
    mount()
    fireEvent.click(screen.getByRole('button', { name: financeSettings.create }))
    const dialog = screen.getByRole('dialog')
    fireEvent.change(within(dialog).getByLabelText(financeSettings.code), { target: { value: ' CC-ENG ' } })
    fireEvent.change(within(dialog).getByLabelText(financeSettings.name), { target: { value: 'Engineering' } })
    fireEvent.change(within(dialog).getByLabelText(new RegExp(financeSettings.departmentId)), {
      target: { value: '00000000-0000-4000-8000-000000000001' }
    })
    fireEvent.submit(dialog.querySelector('form')!)
    await waitFor(() =>
      expect(requests.find((request) => request.method === 'post')?.body).toEqual({
        code: 'CC-ENG',
        name: 'Engineering',
        kind: 'UNIT',
        departmentId: '00000000-0000-4000-8000-000000000001'
      })
    )
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(requests.some((request) => request.url?.endsWith('/departments'))).toBe(false)
  })
  it('pages employees separately and sends only name on rename', async () => {
    mount()
    fireEvent.click((await screen.findAllByRole('button', { name: finance.open }))[0])
    const detail = screen.getByRole('dialog')
    expect((await within(detail).findAllByText('Employee One')).length).toBeGreaterThan(0)
    fireEvent.click(within(detail).getByRole('button', { name: finance.next }))
    await waitFor(() =>
      expect(requests.some((request) => request.url?.endsWith('/center/employees') && request.params?.page === 2)).toBe(
        true
      )
    )
    fireEvent.click(within(detail).getByRole('button', { name: financeSettings.rename }))
    const form = screen.getByRole('dialog')
    fireEvent.change(within(form).getByLabelText(financeSettings.name), { target: { value: ' New name ' } })
    fireEvent.submit(form.querySelector('form')!)
    await waitFor(() =>
      expect(requests.find((request) => request.method === 'patch')?.body).toEqual({ name: 'New name' })
    )
  })
  it('blocks mutations for a future cost center state', async () => {
    status = 'FUTURE'
    mount()
    fireEvent.click((await screen.findAllByRole('button', { name: finance.open }))[0])
    expect(screen.getByRole('button', { name: financeSettings.rename })).toBeDisabled()
    expect(screen.getByRole('button', { name: financeSettings.deactivate })).toBeDisabled()
  })
})
