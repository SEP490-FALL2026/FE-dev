import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, expect, it } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { OperationsReports } from './components/operations-reports'
import { MonitoringNotice } from '../settings/components/monitoring-notice'

const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
const client = () => new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })

it('reads the revocation report with server paging and the selected grouping', async () => {
  await setAppLanguage('en', false)
  const requests: URL[] = []
  server.use(
    http.get('*/api/v1/reports/revocation-sla', ({ request }) => {
      requests.push(new URL(request.url))
      return HttpResponse.json({
        success: true,
        data: {
          from: '2026-11-01',
          to: '2026-11-17',
          completed: 3,
          onTime: 2,
          overdueOpen: 1,
          medianWorkingDays: null,
          onTimeRate: null,
          rows: [],
          pagination: { page: 1, pageSize: 20, totalItems: 21, totalPages: 2 }
        }
      })
    })
  )
  render(
    <QueryClientProvider client={client()}>
      <OperationsReports report='sla' />
    </QueryClientProvider>
  )
  fireEvent.change(await screen.findByLabelText('Group results by'), { target: { value: 'department' } })
  await waitFor(() => expect(requests.at(-1)?.searchParams.get('groupBy')).toBe('department'))
  fireEvent.click(await screen.findByRole('button', { name: 'Next' }))
  await waitFor(() => expect(requests.at(-1)?.searchParams.get('page')).toBe('2'))
})

it('opens the monitoring editor as its own page and publishes all required content', async () => {
  await setAppLanguage('en', false)
  let body: unknown
  server.use(
    http.get('*/api/v1/monitoring-notices/current', () => HttpResponse.json({ success: true, data: null })),
    http.post('*/api/v1/monitoring-notice-versions', async ({ request }) => {
      body = await request.json()
      return HttpResponse.json({ success: true, data: null }, { status: 201 })
    })
  )
  render(
    <QueryClientProvider client={client()}>
      <MonitoringNotice />
    </QueryClientProvider>
  )
  fireEvent.click(await screen.findByRole('button', { name: 'Publish a new monitoring notice' }))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  for (const label of [
    'Data collected',
    'Data not collected',
    'Purpose of collection',
    'Retention period',
    'Right to stop collection'
  ]) {
    const input = screen.getByLabelText(label)
    expect(input).toBeRequired()
    expect(input).toHaveAccessibleDescription()
    fireEvent.change(input, { target: { value: label + ' details' } })
  }
  fireEvent.click(screen.getByRole('button', { name: 'Publish notice' }))
  await waitFor(() =>
    expect(body).toEqual({
      collected: 'Data collected details',
      notCollected: 'Data not collected details',
      purpose: 'Purpose of collection details',
      retention: 'Retention period details',
      stopRight: 'Right to stop collection details',
      includesToolStatus: false,
      requiresReacknowledgement: true
    })
  )
})
