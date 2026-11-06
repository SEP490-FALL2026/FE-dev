import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { finance } from '~/shared/i18n/locales/en/finance'
import { financeSpend } from '~/shared/i18n/locales/en/finance-spend'
import { submittedWindow } from './spend-batch-window'
import { FinanceSpendBatchesView } from './views/finance-spend-batches-view'

const ok = (config: InternalAxiosRequestConfig, data: unknown) => ({
  config,
  status: 200,
  statusText: 'OK',
  headers: new AxiosHeaders(),
  data: { success: true, data }
})
const onePage = (totalItems: number) => ({ page: 1, pageSize: 20, totalItems, totalPages: 1 })

describe('Finance approved spend by batch', () => {
  const previousAdapter = apiClient.defaults.adapter
  const requests: { url?: string; params?: Record<string, unknown> }[] = []
  beforeEach(async () => {
    requests.length = 0
    await setAppLanguage('en', false)
    apiClient.defaults.adapter = async (config) => {
      requests.push({ url: config.url, params: config.params })
      const url = config.url ?? ''
      if (url.endsWith('/cost-centers'))
        return ok(config, {
          items: [
            {
              id: 'center-eng',
              code: 'CC-ENG',
              name: 'Engineering cost',
              department: { id: 'dep-eng', code: 'ENG', name: 'Engineering' },
              status: 'ACTIVE',
              kind: 'UNIT'
            },
            { id: 'center-free', code: 'CC-X', name: 'Unlinked', department: null, status: 'ACTIVE', kind: 'UNIT' }
          ],
          pagination: { page: 1, pageSize: 100, totalItems: 2, totalPages: 1 }
        })
      if (url.endsWith('/spend-batches'))
        return ok(config, {
          items: [
            {
              id: 'batch-1',
              department: { id: 'dep-eng', name: 'Engineering' },
              submittedBy: { employeeId: 'e1', employeeCode: 'EMP-7', fullName: 'Lan Tran' },
              submittedAt: '2026-11-03T03:15:00.000Z',
              itemCount: 5,
              approvedCount: 3,
              pendingCount: 1,
              approvedAmounts: { VND: '12000000', USD: '123.45' }
            },
            {
              id: 'batch-2',
              department: { id: 'dep-ops', name: 'Operations' },
              submittedBy: { employeeId: 'e2', employeeCode: 'EMP-9', fullName: 'Minh Do' },
              submittedAt: '2026-11-02T03:15:00.000Z',
              itemCount: 2,
              approvedCount: 0,
              pendingCount: 2,
              approvedAmounts: {}
            }
          ],
          pagination: onePage(2)
        })
      if (url.endsWith('/spend-batches/missing'))
        throw new AxiosError('Not found', 'ERR_BAD_REQUEST', config, undefined, {
          config,
          status: 404,
          statusText: 'Not Found',
          headers: new AxiosHeaders(),
          data: { success: false, error: { code: 'SPEND.BATCH_NOT_FOUND' } }
        })
      if (url.endsWith('/spend-batches/batch-1/items'))
        return ok(config, {
          items: [
            {
              requestId: 'request-a',
              position: 1,
              outcome: 'SENT_TO_APPROVER',
              stopReason: null,
              leftReason: null,
              leftAt: null,
              requestState: 'COMPLETED'
            },
            {
              requestId: 'request-b',
              position: 2,
              outcome: 'STOPPED',
              stopReason: 'PRICE_MISSING',
              leftReason: 'REQUEST_WITHDRAWN',
              leftAt: '2026-11-04T03:15:00.000Z',
              requestState: 'BRAND_NEW_STATE'
            }
          ],
          pagination: onePage(2)
        })
      if (url.endsWith('/spend-batches/batch-1'))
        return ok(config, {
          batch: {
            id: 'batch-1',
            department: { id: 'dep-eng', code: 'ENG' },
            submittedBy: { employeeId: 'e1', employeeCode: 'EMP-7', fullName: 'Lan Tran' },
            submittedAt: '2026-11-03T03:15:00.000Z',
            itemCount: 5
          }
        })
      throw new Error(`Unexpected request ${url}`)
    }
  })
  afterEach(() => {
    apiClient.defaults.adapter = previousAdapter
  })
  function mount(props: { itemId?: string; onSelectTab?: (tab: string, extra?: Record<string, string>) => void }) {
    render(
      <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
        <FinanceSpendBatchesView itemId={props.itemId} onSelectTab={props.onSelectTab ?? vi.fn()} />
      </QueryClientProvider>
    )
  }
  const batchRequests = () => requests.filter((request) => request.url?.endsWith('/spend-batches'))

  it('lists batches with counts and approved amounts per currency in major units', async () => {
    const onSelectTab = vi.fn()
    mount({ onSelectTab })
    expect((await screen.findAllByText('Engineering')).length).toBeGreaterThan(0)
    expect(batchRequests()[0].params).toEqual({ page: 1, pageSize: 20 })
    expect(screen.getAllByText('₫12,000,000').length).toBeGreaterThan(0)
    expect(screen.getAllByText('$123.45').length).toBeGreaterThan(0)
    expect(screen.getAllByText(financeSpend.batches.columns.approvedAmounts).length).toBeGreaterThan(0)
    fireEvent.click(screen.getAllByRole('button', { name: finance.open })[0])
    expect(onSelectTab).toHaveBeenCalledWith('spend-batches', { id: 'batch-1' })
  })

  it('filters by a department from the cost center catalogue and by a sent date window', async () => {
    mount({})
    await screen.findAllByText('Engineering')
    const department = screen.getByLabelText(new RegExp(`^${financeSpend.batches.department}`))
    await waitFor(() => expect(department).toBeEnabled())
    expect(within(department).queryByText('Unlinked')).not.toBeInTheDocument()
    fireEvent.change(department, { target: { value: 'dep-eng' } })
    fireEvent.change(screen.getByLabelText(new RegExp(`^${financeSpend.batches.submittedFrom}`)), {
      target: { value: '2026-11-01' }
    })
    fireEvent.change(screen.getByLabelText(new RegExp(`^${financeSpend.batches.submittedTo}`)), {
      target: { value: '2026-11-05' }
    })
    await waitFor(() => expect(batchRequests().at(-1)?.params?.submittedTo).toBeDefined())
    const params = batchRequests().at(-1)?.params
    expect(params?.departmentId).toBe('dep-eng')
    expect(params?.page).toBe(1)
    expect(params?.submittedFrom).toMatch(/^2026-11-01T00:00:00[+-]\d{2}:\d{2}$/)
    expect(params?.submittedTo).toMatch(/^2026-11-06T00:00:00[+-]\d{2}:\d{2}$/)
  })

  it('refuses a window that ends before it starts without asking the API', async () => {
    mount({})
    await screen.findAllByText('Engineering')
    fireEvent.change(screen.getByLabelText(new RegExp(`^${financeSpend.batches.submittedFrom}`)), {
      target: { value: '2026-11-10' }
    })
    fireEvent.change(screen.getByLabelText(new RegExp(`^${financeSpend.batches.submittedTo}`)), {
      target: { value: '2026-11-01' }
    })
    expect((await screen.findAllByText(financeSpend.batches.invalidWindow)).length).toBeGreaterThan(0)
    expect(batchRequests().some((request) => request.params?.submittedTo)).toBe(false)
    expect(submittedWindow('2026-11-10', '2026-11-01')).toEqual({ invalid: true })
    expect(submittedWindow('', '')).toEqual({ invalid: false, submittedFrom: undefined, submittedTo: undefined })
  })

  it('shows the batch and its requests as a full page, with a fallback for unknown states', async () => {
    const onSelectTab = vi.fn()
    mount({ itemId: 'batch-1', onSelectTab })
    expect(await screen.findByRole('heading', { level: 1, name: 'Spend batch of ENG' })).toBeInTheDocument()
    const items = await screen.findByRole('region', { name: financeSpend.batches.detail.items })
    expect((await within(items).findAllByText(financeSpend.outcome.SENT_TO_APPROVER)).length).toBeGreaterThan(0)
    expect(within(items).getAllByText(financeSpend.stopReason.PRICE_MISSING).length).toBeGreaterThan(0)
    expect(within(items).getAllByText(financeSpend.requestState.COMPLETED).length).toBeGreaterThan(0)
    expect(within(items).getAllByText(financeSpend.unknown).length).toBeGreaterThan(0)
    expect(
      within(items).getAllByText(new RegExp(`^${financeSpend.leftReason.REQUEST_WITHDRAWN} · `)).length
    ).toBeGreaterThan(0)
    expect(batchRequests()).toHaveLength(0)
    fireEvent.click(screen.getByRole('button', { name: finance.backToList }))
    expect(onSelectTab).toHaveBeenCalledWith('spend-batches')
  })

  it('reports a batch that cannot be read', async () => {
    mount({ itemId: 'missing' })
    expect(await screen.findByText(finance.errors.batchNotFound)).toBeInTheDocument()
  })
})
