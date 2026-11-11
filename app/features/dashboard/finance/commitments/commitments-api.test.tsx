import { fireEvent, render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AxiosHeaders } from 'axios'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { i18n, setAppLanguage } from '~/shared/i18n/i18n'
import { financeSettings } from '~/shared/i18n/locales/en/finance-settings'
import { finance } from '~/shared/i18n/locales/en/finance'
import { FinanceCommitmentsView } from './views/finance-commitments-view'

describe('Finance commitments integration', () => {
  const previousAdapter = apiClient.defaults.adapter
  const requests: { url?: string; method?: string; body?: unknown }[] = []

  beforeEach(async () => {
    requests.length = 0
    i18n.addResourceBundle('en', 'financeSettings', financeSettings)
    i18n.addResourceBundle('en', 'finance', finance)
    await setAppLanguage('en', false)

    apiClient.defaults.adapter = async (config) => {
      requests.push({
        url: config.url,
        method: config.method,
        body: config.data ? JSON.parse(config.data) : undefined
      })

      if (config.url?.endsWith('/cost-centers')) {
        return {
          config,
          status: 200,
          statusText: 'OK',
          headers: new AxiosHeaders(),
          data: {
            success: true,
            data: {
              items: [{ id: 'cc-01', code: 'CC-IT', name: 'IT Department' }],
              pagination: { page: 1, pageSize: 100, totalItems: 1, totalPages: 1 }
            }
          }
        }
      }

      if (config.url?.endsWith('/invoices') && config.method === 'post') {
        return {
          config,
          status: 201,
          statusText: 'Created',
          headers: new AxiosHeaders(),
          data: {
            success: true,
            message: 'BUDGET_COMMITMENT.INVOICE_RECORDED',
            data: {
              invoice: {
                id: 'inv-01',
                number: 'INV-TEST-001',
                issuedOn: '2026-11-06',
                netAmount: { amount: '10000000', currency: 'VND' },
                deductibleTax: { amount: '1000000', currency: 'VND' },
                nonDeductibleTax: { amount: '0', currency: 'VND' },
                actualCost: { amount: '10000000', currency: 'VND' },
                matchResult: 'MATCHED',
                note: null,
                recordedBy: { employeeId: 'emp-01', employeeCode: 'EMP-01', fullName: 'Finance User' },
                recordedAt: '2026-11-06T10:00:00Z'
              },
              commitment: {
                id: 'commit-01',
                held: { amount: '0', currency: 'VND' },
                state: 'EXPENSED'
              }
            }
          }
        }
      }

      if (config.url?.endsWith('/budget-commitments')) {
        return {
          config,
          status: 200,
          statusText: 'OK',
          headers: new AxiosHeaders(),
          data: {
            success: true,
            message: 'BUDGET_COMMITMENT.LISTED',
            data: {
              items: [
                {
                  id: 'commit-01',
                  requestId: 'req-01',
                  costCenter: { id: 'cc-01', code: 'CC-IT', name: 'IT Department' },
                  year: 2026,
                  amount: { amount: '10000000', currency: 'VND' },
                  released: { amount: '0', currency: 'VND' },
                  held: { amount: '10000000', currency: 'VND' },
                  invoiced: { amount: '0', currency: 'VND' },
                  invoiceCount: 0,
                  hasDiscrepancy: false,
                  state: 'HELD',
                  attached: true,
                  attachedAt: '2026-01-01T00:00:00Z',
                  unattachedReason: null,
                  createdAt: '2026-01-01T00:00:00Z',
                  request: {
                    id: 'req-01',
                    software: { name: 'Figma Enterprise' },
                    plan: { name: 'Annual Pro' },
                    requester: { employeeCode: 'EMP-02', fullName: 'Alice Designer' },
                    beneficiaryCount: 5,
                    spendApprovedAt: '2026-01-02T00:00:00Z'
                  }
                }
              ],
              pagination: { page: 1, pageSize: 20, totalItems: 1, totalPages: 1 }
            }
          }
        }
      }

      return {
        config,
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        data: {
          success: true,
          data: { items: [], pagination: { page: 1, pageSize: 20, totalItems: 0, totalPages: 0 } }
        }
      }
    }
  })

  afterEach(() => {
    apiClient.defaults.adapter = previousAdapter
  })

  it('lists commitments only, with no invoice recording and a release action', async () => {
    const selectTab = vi.fn()
    render(
      <QueryClientProvider
        client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
      >
        <FinanceCommitmentsView onSelectTab={selectTab} />
      </QueryClientProvider>
    )

    expect((await screen.findAllByText('IT Department')).length).toBeGreaterThan(0)
    expect(screen.getAllByText('Figma Enterprise').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Alice Designer').length).toBeGreaterThan(0)
    expect(screen.getByRole('heading', { name: 'Commitments' })).toBeInTheDocument()

    expect(screen.queryByRole('button', { name: /invoice/i })).not.toBeInTheDocument()
    expect(screen.queryByText(/invoiced/i)).not.toBeInTheDocument()

    fireEvent.click(screen.getAllByRole('button', { name: finance.releaseRemainder })[0])
    expect(selectTab).toHaveBeenCalledWith('commitment-release', { id: 'commit-01', request: 'req-01' })
    expect(requests.some((r) => r.url?.endsWith('/invoices'))).toBe(false)
  })
})
