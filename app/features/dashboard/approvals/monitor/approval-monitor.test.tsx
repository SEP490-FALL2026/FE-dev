import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { i18n, setAppLanguage } from '~/shared/i18n/i18n'
import { approvals } from '~/shared/i18n/locales/en/approvals'
import { approvalsSpend } from '~/shared/i18n/locales/en/approvals-spend'
import { AxiosError } from 'axios'
import type { ApprovalTabKey } from '../enums'
import { ApprovalMonitorView } from './views/approval-monitor-view'

const request = {
  id: 'req-1',
  type: 'GRANT',
  branch: 'STANDARD',
  state: 'AWAITING_SPEND_DECISION',
  routing: { mode: 'VIA_HEAD', oneStepReason: null },
  plan: null,
  softwareName: 'Design tool',
  beneficiary: null,
  lineCount: 1,
  termMonths: 6,
  expectedEndDate: null,
  submittedAt: '2026-11-01T00:00:00Z',
  updatedAt: '2026-11-02T00:00:00Z',
  needStep: null,
  spend: { stage: 'WAITING_SPEND_DECISION' },
  outcome: null,
  withdrawal: null,
  requester: { employeeId: 'e1', employeeCode: 'E01', fullName: 'An Nguyen' },
  department: { id: 'd1', code: 'ENG', name: 'Engineering' },
  reserveUsed: true
}

describe('Spending Approver request monitoring', () => {
  const previousAdapter = apiClient.defaults.adapter
  let requests: InternalAxiosRequestConfig[]
  beforeEach(async () => {
    requests = []
    i18n.addResourceBundle('en', 'approvals', approvals)
    i18n.addResourceBundle('en', 'approvalsSpend', approvalsSpend)
    await setAppLanguage('en', false)
    apiClient.defaults.adapter = async (config) => {
      requests.push(config)
      return {
        config,
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        data: {
          success: true,
          message: 'OK',
          data: { items: [request], pagination: { page: 1, pageSize: 20, totalItems: 1, totalPages: 1 } }
        }
      }
    }
  })
  afterEach(() => {
    apiClient.defaults.adapter = previousAdapter
  })

  const mount = (
    props: { itemId?: string; onSelectTab?: (tab: ApprovalTabKey, params?: Record<string, string>) => void } = {}
  ) =>
    render(
      <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
        <ApprovalMonitorView {...props} />
      </QueryClientProvider>
    )

  it('lists open requests with their spend step and never writes', async () => {
    mount()
    expect((await screen.findAllByText('Design tool')).length).toBeGreaterThan(0)
    expect(screen.getAllByText('Waiting for approval').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Uses reserve').length).toBeGreaterThan(0)
    expect(requests.find((config) => config.url?.endsWith('/access-requests'))?.params).toMatchObject({
      view: 'open',
      page: 1
    })
    expect(requests.every((config) => config.method === 'get')).toBe(true)
  })

  it('switches to ended requests and filters by type', async () => {
    mount()
    await screen.findAllByText('Design tool')
    fireEvent.click(screen.getByRole('combobox', { name: 'Show' }))
    fireEvent.click(screen.getByRole('option', { name: 'Ended requests' }))
    await waitFor(() => expect(requests.some((config) => config.params?.view === 'ended')).toBe(true))
    fireEvent.click(screen.getByRole('combobox', { name: 'Type' }))
    fireEvent.click(screen.getByRole('option', { name: 'Renewal' }))
    await waitFor(() =>
      expect(requests.some((config) => config.params?.view === 'ended' && config.params?.type === 'RENEWAL')).toBe(true)
    )
  })

  it('opens the read-only detail of a request from the list', async () => {
    const onSelectTab = vi.fn()
    mount({ onSelectTab })
    await screen.findAllByText('Design tool')
    fireEvent.click(screen.getAllByRole('button', { name: 'View details' })[0])
    expect(onSelectTab).toHaveBeenCalledWith('monitor', { id: 'req-1' })
  })

  it('shows the detail of a request that reached the spend step with a read-only call', async () => {
    const id = '12345678-1234-4234-8234-123456789012'
    const detail = {
      ...request,
      id,
      businessReason: 'Design review',
      branch: 'PAID_IN_CATALOG',
      costCenter: { id: 'cc', code: 'CC-01' },
      requester: request.requester,
      budgetYear: 2026,
      cost: { currentYear: { year: 2026, months: 6, amount: { amount: '1200000', currency: 'VND' } }, nextYear: null },
      spend: { stage: 'WAITING_SPEND_DECISION', blockedReasons: [], overBy: null, refusalReason: null }
    }
    apiClient.defaults.adapter = async (config) => {
      requests.push(config)
      return {
        config,
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        data: { success: true, message: 'OK', data: { request: detail } }
      }
    }
    mount({ itemId: id, onSelectTab: vi.fn() })
    expect(await screen.findByText('Design review')).toBeTruthy()
    expect(screen.getByText('Waiting for approval')).toBeTruthy()
    expect(requests.every((config) => config.method === 'get')).toBe(true)
    expect(requests.some((config) => config.url?.endsWith(`/access-requests/${id}`))).toBe(true)
  })

  it('explains that a request still at the need step cannot be opened yet', async () => {
    apiClient.defaults.adapter = async (config) => {
      throw new AxiosError('not found', 'ERR_BAD_REQUEST', config, undefined, {
        config,
        status: 404,
        statusText: 'Not Found',
        headers: {},
        data: { success: false, error: { code: 'ACCESS_REQUEST.NOT_FOUND' } }
      })
    }
    mount({ itemId: '12345678-1234-4234-8234-123456789012', onSelectTab: vi.fn() })
    expect(await screen.findByText(/cannot be opened yet/)).toBeTruthy()
  })

  it('narrows the list by a status group, a flag and a date range, and clears them again', async () => {
    mount()
    await screen.findAllByText('Design tool')
    fireEvent.click(screen.getByRole('combobox', { name: 'Status' }))
    fireEvent.click(screen.getByRole('option', { name: 'Rejected or stopped' }))
    await waitFor(() =>
      expect(
        requests.some((config) => config.params?.state === 'REJECTED,IT_REJECTED,FAILED,WITHDRAWN,CANCELLED')
      ).toBe(true)
    )
    fireEvent.click(screen.getByRole('combobox', { name: 'Flag' }))
    fireEvent.click(screen.getByRole('option', { name: 'One-step request' }))
    fireEvent.change(screen.getByLabelText('Sent from'), { target: { value: '2026-11-01' } })
    fireEvent.change(screen.getByLabelText('Sent until'), { target: { value: '2026-11-30' } })
    await waitFor(() =>
      expect(
        requests.some(
          (config) =>
            config.params?.flag === 'ONE_STEP' &&
            typeof config.params?.from === 'string' &&
            typeof config.params?.to === 'string' &&
            config.params?.state === 'REJECTED,IT_REJECTED,FAILED,WITHDRAWN,CANCELLED'
        )
      ).toBe(true)
    )
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }))
    await waitFor(() => {
      const last = requests[requests.length - 1]
      expect(last.params?.flag).toBeUndefined()
      expect(last.params?.state).toBeUndefined()
    })
  })
})
