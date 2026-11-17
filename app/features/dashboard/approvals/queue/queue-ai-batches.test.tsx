import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router'
import { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { ApprovalQueueView } from './views/spend-queue-view'

const originalAdapter = apiClient.defaults.adapter
const calls: InternalAxiosRequestConfig[] = []
const emptyPage = { items: [], pagination: { page: 1, pageSize: 20, totalItems: 0, totalPages: 0 } }
const requestId = '84000000-0000-4000-8000-000000000001'
const batchId = '84000000-0000-4000-8000-000000000002'
let aiDisabled = false

const ok = (config: InternalAxiosRequestConfig, data: unknown, status = 200) => ({
  config,
  status,
  statusText: 'OK',
  headers: {},
  data: { success: true, message: 'OK', data }
})

function setup(onSelectTab = vi.fn()) {
  apiClient.defaults.adapter = async (config) => {
    calls.push(config)
    const url = config.url ?? ''
    if (url.endsWith('/ai/access-request-summaries/source')) {
      if (aiDisabled) {
        const response = {
          config,
          status: 403,
          statusText: 'Forbidden',
          headers: new AxiosHeaders(),
          data: { success: false, error: { code: 'AI.DISABLED' } }
        }
        throw new AxiosError('disabled', undefined, config, undefined, response)
      }
      return ok(config, { queueRevision: 'rev-1', stepCount: 2, omittedCount: 0 })
    }
    if (url.endsWith('/ai/access-request-summaries') && config.method === 'post')
      return ok(config, { invocationId: 'inv-1', status: 'PENDING' }, 202)
    if (url.includes('/ai/access-request-summaries/inv-1'))
      return ok(config, {
        invocationId: 'inv-1',
        status: 'COMPLETED',
        createdAt: '2026-11-17T00:00:00Z',
        sourceStale: false,
        simulated: true,
        omittedCount: 0,
        errorCode: null,
        lines: [{ requestId, stepId: 'step-1', stepKind: 'SPEND_APPROVAL', summary: 'Gói nhóm cho phòng thiết kế' }]
      })
    if (url.endsWith('/spend-batches'))
      return ok(config, {
        items: [
          {
            id: batchId,
            department: { id: 'department-1', name: 'Design' },
            submittedBy: { employeeId: 'employee-1', employeeCode: 'E01', fullName: 'Head of design' },
            submittedAt: '2026-11-10T03:00:00Z',
            itemCount: 3,
            approvedCount: 1,
            pendingCount: 2
          }
        ],
        pagination: { page: 1, pageSize: 20, totalItems: 1, totalPages: 1 }
      })
    return ok(config, emptyPage)
  }
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  render(
    <MemoryRouter>
      <QueryClientProvider client={client}>
        <ApprovalQueueView onSelectTab={onSelectTab} />
      </QueryClientProvider>
    </MemoryRouter>
  )
  return onSelectTab
}

beforeEach(async () => {
  calls.length = 0
  aiDisabled = false
  await setAppLanguage('en', false)
})
afterEach(() => {
  apiClient.defaults.adapter = originalAdapter
})

it('summarises the queue with the revision read, labels a simulated run and opens a request', async () => {
  const onSelectTab = setup()
  fireEvent.click(await screen.findByRole('button', { name: 'Summarise 2 requests' }))
  expect(await screen.findByText('Gói nhóm cho phòng thiết kế')).toBeInTheDocument()
  expect(screen.getByText('Simulated — not AI')).toBeInTheDocument()
  const post = calls.find((config) => config.method === 'post')
  expect(JSON.parse(String(post?.data))).toEqual({ queueRevision: 'rev-1' })
  fireEvent.click(screen.getByRole('button', { name: 'Open' }))
  expect(onSelectTab).toHaveBeenCalledWith('request', { id: requestId })
})

it('says the AI summary is off instead of offering it', async () => {
  aiDisabled = true
  setup()
  expect(await screen.findByText('The AI summary is switched off.')).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: /Summarise/ })).not.toBeInTheDocument()
})

it('lists batches by name and date and opens the whole batch', async () => {
  const onSelectTab = setup()
  fireEvent.click(await screen.findByRole('tab', { name: 'By batch' }))
  expect(await screen.findAllByText('Head of design')).not.toHaveLength(0)
  expect(screen.queryByText('E01')).not.toBeInTheDocument()
  expect(screen.getAllByText('2 still waiting for a decision')).not.toHaveLength(0)
  fireEvent.click(screen.getAllByRole('button', { name: 'View details' })[0])
  await waitFor(() => expect(onSelectTab).toHaveBeenCalledWith('batch', { id: batchId }))
})
