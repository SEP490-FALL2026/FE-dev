import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AxiosHeaders } from 'axios'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { i18n, setAppLanguage } from '~/shared/i18n/i18n'
import { financeSettings } from '~/shared/i18n/locales/en/finance-settings'
import { finance } from '~/shared/i18n/locales/en/finance'
import { FinanceCommitmentsView } from './views/finance-commitments-view'

describe('Finance commitments and invoice recording integration', () => {
  const previousAdapter = apiClient.defaults.adapter
  const requests: { url?: string; method?: string; body?: any }[] = []

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
        data: { success: true, data: { items: [], pagination: { page: 1, pageSize: 20, totalItems: 0, totalPages: 0 } } }
      }
    }
  })

  afterEach(() => {
    apiClient.defaults.adapter = previousAdapter
  })

  it('renders commitments table and opens record invoice dialog', async () => {
    render(
      <QueryClientProvider
        client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
      >
        <FinanceCommitmentsView />
      </QueryClientProvider>
    )

    expect((await screen.findAllByText('IT Department')).length).toBeGreaterThan(0)
    expect(screen.getAllByText('Figma Enterprise').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Alice Designer').length).toBeGreaterThan(0)

    // Bấm nút Record Invoice
    const recordButtons = screen.getAllByRole('button', { name: finance.recordInvoice })
    fireEvent.click(recordButtons[0])

    const invoiceInput = await screen.findByPlaceholderText('INV-2026-001')
    expect(invoiceInput).toBeInTheDocument()

    // Nhập số hóa đơn và tiền trước thuế
    fireEvent.change(invoiceInput, { target: { value: 'INV-TEST-001' } })
    fireEvent.change(screen.getByPlaceholderText('10000000'), { target: { value: '10000000' } })

    // Submit form (nút trong dialog)
    const dialog = screen.getByRole('dialog')
    const submitBtn = within(dialog).getByRole('button', { name: finance.recordInvoice })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(requests.some((r) => r.url?.endsWith('/invoices') && r.method === 'post')).toBe(true)
    })
  })
})

