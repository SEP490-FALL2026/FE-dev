import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { SuperAdminOverviewView } from './views/super-admin-overview-view'

const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

it('reads the dashboard, keeps source-only and unavailable sections uncounted, and refreshes all sources', async () => {
  await setAppLanguage('en', false)
  let reads = 0
  const section = (state: string, count: number | null, sourceOperationId: string | null) => ({
    state,
    count,
    sourceOperationId,
    reason: state === 'NOT_AVAILABLE' ? 'NO_DATA_SOURCE' : null
  })
  server.use(
    http.get('*/api/v1/dashboards/super-admin', () => {
      reads++
      return HttpResponse.json({
        success: true,
        data: {
          asOf: '2026-11-03',
          sections: {
            congestion: section('AT_SOURCE', null, 'stepCongestionList'),
            backgroundJobs: section('NOT_AVAILABLE', null, null),
            approverConfiguration: section('AT_SOURCE', null, 'appUserList'),
            superAdminRole: section('AT_SOURCE', null, 'superAdminWatchGet'),
            departmentsWithoutHead: section('COUNTED', 4, 'departmentList'),
            departmentsWithoutItAdmin: section('COUNTED', 0, 'departmentList'),
            accountCandidates: section('AT_SOURCE', null, 'accountCandidatesList'),
            personnelNotices: section('COUNTED', 7, 'personnelNoticeList')
          }
        }
      })
    }),
    http.get('*/api/v1/onboarding-checklist', () => HttpResponse.json({ success: true, data: { steps: [] } })),
    http.get('*/api/v1/super-admin-watch', () => HttpResponse.json({ success: true, data: null }))
  )
  const selectTab = vi.fn()
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <SuperAdminOverviewView onSelectTab={selectTab} />
    </QueryClientProvider>
  )
  const metrics = await screen.findByRole('region', { name: 'Operational overview' })
  expect(within(metrics).getByText('4')).toBeInTheDocument()
  expect(within(metrics).getByText('7')).toBeInTheDocument()
  expect(within(metrics).getAllByText('0')).toHaveLength(1)
  expect(within(metrics).getByText('No data source yet')).toBeInTheDocument()
  fireEvent.click(within(metrics).getByRole('button', { name: 'Review personnel notices' }))
  expect(selectTab).toHaveBeenCalledWith('personnel', { section: 'notices' })
  await waitFor(() => expect(screen.getByRole('button', { name: 'Refresh data' })).toBeEnabled())
  fireEvent.click(screen.getByRole('button', { name: 'Refresh data' }))
  await waitFor(() => expect(reads).toBe(2))
})
