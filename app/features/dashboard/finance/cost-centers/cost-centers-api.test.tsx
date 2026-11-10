import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AxiosHeaders } from 'axios'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
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
      const money = (amount: string) => ({ amount, currency: 'VND' })
      const single = { page: 1, pageSize: 100, totalItems: 2, totalPages: 1 }
      if (config.url?.endsWith('/budgets/summary'))
        return {
          config,
          status: 200,
          statusText: 'OK',
          headers: new AxiosHeaders(),
          data: {
            success: true,
            data: {
              year: 2026,
              totals: {
                VND: {
                  currency: 'VND',
                  base: money('108000000'),
                  reserve: money('12000000'),
                  total: money('120000000'),
                  committed: money('30000000'),
                  spent: money('0'),
                  remaining: money('90000000'),
                  costCenterCount: 1,
                  overBudgetCount: 0
                }
              },
              lastInvoiceRecordedAt: null
            }
          }
        }
      if (config.url?.includes('/budget-commitments'))
        return {
          config,
          status: 200,
          statusText: 'OK',
          headers: new AxiosHeaders(),
          data: {
            success: true,
            data: {
              items: [],
              pagination: single
            }
          }
        }
      if (config.url?.endsWith('/budgets'))
        return {
          config,
          status: 200,
          statusText: 'OK',
          headers: new AxiosHeaders(),
          data: {
            success: true,
            data: {
              items: [
                {
                  costCenter: { id: 'center', code: 'CC-ENG', name: 'Engineering cost' },
                  year: 2026,
                  versionId: 'version-own',
                  number: 1,
                  base: money('108000000'),
                  reserve: money('12000000'),
                  total: money('120000000'),
                  committed: money('30000000'),
                  spent: money('0'),
                  remaining: money('90000000'),
                  overCommitted: false
                }
              ],
              pagination: single
            }
          }
        }
      if (config.url?.endsWith('/budget-versions')) {
        const version = (id: string, costCenterId: string, year: number) => ({
          id,
          costCenter: { id: costCenterId, code: costCenterId, name: costCenterId },
          year,
          number: 1,
          state: 'APPROVED',
          total: money('120000000'),
          createdAt: '2026-01-01T00:00:00Z',
          sentAt: null
        })
        return {
          config,
          status: 200,
          statusText: 'OK',
          headers: new AxiosHeaders(),
          data: {
            success: true,
            data: {
              items: [version('version-own', 'center', 2026), version('version-other', 'other', 2025)],
              pagination: single
            }
          }
        }
      }
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
  function mount(onSelectTab?: (tab: string, extra?: Record<string, string>) => void) {
    render(
      <QueryClientProvider
        client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
      >
        <FinanceCostCentersView onSelectTab={onSelectTab} />
      </QueryClientProvider>
    )
  }
  it('shows the current budget of each cost center without a create action', async () => {
    mount()
    expect(await screen.findAllByText('Engineering cost')).not.toHaveLength(0)
    expect(screen.queryByRole('button', { name: financeSettings.create })).not.toBeInTheDocument()
    await waitFor(() =>
      expect(requests.some((request) => request.url?.endsWith('/budgets') && request.params?.pageSize === 100)).toBe(
        true
      )
    )
    expect((await screen.findAllByText(/120,000,000/)).length).toBeGreaterThan(0)
  })
  it('lists only this cost center budget versions in its detail and opens one', async () => {
    const onSelectTab = vi.fn()
    mount(onSelectTab)
    fireEvent.click((await screen.findAllByRole('button', { name: finance.open }))[0])
    const versions = await screen.findByRole('region', { name: financeSettings.budgetVersions })
    expect(await within(versions).findAllByText('2026')).not.toHaveLength(0)
    expect(within(versions).queryByText('2025')).not.toBeInTheDocument()
    fireEvent.click(within(versions).getAllByRole('button', { name: finance.open })[0])
    expect(onSelectTab).toHaveBeenCalledWith('budget-negotiation', { id: 'version-own' })
  })
  it('summarises the year in budget widgets', async () => {
    mount()
    expect(await screen.findByText(financeSettings.kpis.total)).toBeInTheDocument()
    expect(screen.getByText(financeSettings.kpis.held)).toBeInTheDocument()
    expect(await screen.findByText('1/21 cost centers have a budget')).toBeInTheDocument()
    expect(screen.getByText(/120M/)).toBeInTheDocument()
    expect(screen.getByText(/90M/)).toBeInTheDocument()
  })
  it('shows budget figures in the detail without rename or deactivate', async () => {
    mount()
    fireEvent.click((await screen.findAllByRole('button', { name: finance.open }))[0])
    const figures = await screen.findByRole('region', { name: /^Budget for \d{4}$/ })
    expect(await within(figures).findByText(/90,000,000/)).toBeInTheDocument()
    expect(within(figures).getByText(financeSettings.budgetUtilization)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: financeSettings.rename })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: financeSettings.deactivate })).not.toBeInTheDocument()
    expect(requests.some((request) => request.url?.endsWith('/employees'))).toBe(false)
  })
})
