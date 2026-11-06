import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AxiosHeaders } from 'axios'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { i18n, setAppLanguage } from '~/shared/i18n/i18n'
import { financeSettings } from '~/shared/i18n/locales/en/finance-settings'
import { finance } from '~/shared/i18n/locales/en/finance'
import { FinanceSpendBatchesView } from './views/finance-spend-batches-view'

describe('Finance spend batches integration', () => {
  const previousAdapter = apiClient.defaults.adapter
  const requests: { url?: string; method?: string; params?: Record<string, unknown> }[] = []

  beforeEach(async () => {
    requests.length = 0
    i18n.addResourceBundle('en', 'financeSettings', financeSettings)
    i18n.addResourceBundle('en', 'finance', finance)
    await setAppLanguage('en', false)

    apiClient.defaults.adapter = async (config) => {
      requests.push({
        url: config.url,
        method: config.method,
        params: config.params
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
              items: [
                {
                  id: 'cc-eng',
                  code: 'CC-ENG',
                  name: 'Engineering cost center',
                  kind: 'UNIT',
                  status: 'ACTIVE',
                  department: { id: 'dept-eng', name: 'Engineering', code: 'ENG' }
                }
              ],
              pagination: { page: 1, pageSize: 100, totalItems: 1, totalPages: 1 }
            }
          }
        }
      }

      if (config.url?.endsWith('/spend-batches')) {
        return {
          config,
          status: 200,
          statusText: 'OK',
          headers: new AxiosHeaders(),
          data: {
            success: true,
            message: 'SPEND_BATCH.LISTED',
            data: {
              items: [
                {
                  id: 'batch-01',
                  department: { id: 'dept-eng', name: 'Engineering' },
                  submittedBy: {
                    employeeId: 'emp-01',
                    employeeCode: 'EMP-01',
                    fullName: 'John Manager'
                  },
                  submittedAt: '2026-11-05T08:00:00Z',
                  itemCount: 3,
                  approvedCount: 2,
                  pendingCount: 1,
                  approvedAmounts: { VND: '45000000' }
                }
              ],
              pagination: { page: 1, pageSize: 20, totalItems: 1, totalPages: 1 }
            }
          }
        }
      }

      if (config.url?.includes('/spend-batches/batch-01/items')) {
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
                  requestId: 'req-01',
                  position: 1,
                  outcome: 'SENT_TO_APPROVER',
                  stopReason: null,
                  leftReason: null,
                  leftAt: null,
                  requestState: 'AWAITING_SPEND_DECISION'
                }
              ],
              pagination: { page: 1, pageSize: 20, totalItems: 1, totalPages: 1 }
            }
          }
        }
      }

      if (config.url?.includes('/spend-batches/batch-01')) {
        return {
          config,
          status: 200,
          statusText: 'OK',
          headers: new AxiosHeaders(),
          data: {
            success: true,
            data: {
              batch: {
                id: 'batch-01',
                department: { id: 'dept-eng', code: 'ENG', name: 'Engineering' },
                submittedBy: {
                  employeeId: 'emp-01',
                  employeeCode: 'EMP-01',
                  fullName: 'John Manager'
                },
                submittedAt: '2026-11-05T08:00:00Z',
                itemCount: 3
              }
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

  it('renders spend batch list and opens detail to view requests in batch', async () => {
    render(
      <QueryClientProvider
        client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
      >
        <FinanceSpendBatchesView />
      </QueryClientProvider>
    )

    // Bước 1: danh sách phòng ban, chưa gọi danh sách đợt
    expect((await screen.findAllByText('Engineering')).length).toBeGreaterThan(0)
    expect(requests.some((request) => request.url?.endsWith('/spend-batches'))).toBe(false)

    fireEvent.click(screen.getAllByRole('button', { name: finance.open })[0])

    // Bước 2: các đợt của phòng ban đã chọn
    expect((await screen.findAllByText('John Manager')).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/45,000,000/).length).toBeGreaterThan(0)
    const batchRequest = requests.find((request) => request.url?.endsWith('/spend-batches'))
    expect(batchRequest?.params?.departmentId).toBe('dept-eng')

    // Bước 3: chi tiết đợt
    fireEvent.click(screen.getAllByRole('button', { name: finance.open })[0])

    await waitFor(() => {
      expect(screen.getAllByText(finance.requestStates.AWAITING_SPEND_DECISION).length).toBeGreaterThan(0)
    })
  })
})
