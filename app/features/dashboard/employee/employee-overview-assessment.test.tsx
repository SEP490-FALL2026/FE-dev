import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { accessRequest, pageResponse, person, requestId } from '../../../../test/fixtures/employee-api'
import { employeeDashboard, requestAssessment } from '../../../../test/fixtures/employee-overview-assessment'
import { EmployeeDashboardSummary } from './overview/components/employee-dashboard-summary'
import { LiveRequestAssessment } from './my-requests/components/live-request-assessment'
import { EmployeeLiveRequestDetail } from './my-requests/views/employee-live-request-detail'
import { EmployeeLiveOverview } from './overview/views/employee-live-overview'

const server = setupServer(
  http.get('*/api/v1/dashboards/employee', () => HttpResponse.json({ success: true, data: employeeDashboard })),
  http.get('*/api/v1/access-requests/:id/assessment', () =>
    HttpResponse.json({ success: true, data: { assessment: requestAssessment } })
  ),
  http.get('*/api/v1/access-requests/:id/timings', () => HttpResponse.json({ success: true, data: null })),
  http.get('*/api/v1/access-requests/drafts', () => HttpResponse.json(pageResponse())),
  http.get('*/api/v1/handover-duties', () => HttpResponse.json(pageResponse()))
)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
beforeEach(async () => {
  await setAppLanguage('en', false)
})
function mount(children: React.ReactNode) {
  return render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  )
}
it('uses server counts, distinguishes unavailable metrics and navigates to the matching list', async () => {
  const navigate = vi.fn()
  mount(<EmployeeDashboardSummary onSelectTab={navigate} />)
  expect(await screen.findByText('12')).toBeInTheDocument()
  expect(within(screen.getByRole('button', { name: 'My requests' })).getByText('0')).toBeInTheDocument()
  expect(
    within(screen.getByRole('button', { name: 'Open software issues' })).getByText('See the list')
  ).toBeInTheDocument()
  expect(within(screen.getByRole('button', { name: 'Expiring within 7 days' })).getByText('0')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Expiring within 7 days' }))
  expect(navigate).toHaveBeenCalledWith('my-software', { accessList: 'expiry' })
  fireEvent.click(screen.getByRole('button', { name: 'My requests' }))
  expect(navigate).toHaveBeenCalledWith('my-requests', undefined)
})
it('does not replace a missing counted metric with zero', async () => {
  server.use(
    http.get('*/api/v1/dashboards/employee', () =>
      HttpResponse.json({
        success: true,
        data: {
          ...employeeDashboard,
          sections: { ...employeeDashboard.sections, softwareRights: { state: 'COUNTED', count: null } }
        }
      })
    )
  )
  mount(<EmployeeDashboardSummary onSelectTab={vi.fn()} />)
  const card = await screen.findByRole('button', { name: 'Software access' })
  expect(within(card).getByText('Count not available')).toBeInTheDocument()
  expect(within(card).queryByText('0')).not.toBeInTheDocument()
})
it('handles an empty dashboard response', async () => {
  server.use(http.get('*/api/v1/dashboards/employee', () => HttpResponse.json({ success: true, data: null })))
  mount(<EmployeeDashboardSummary onSelectTab={vi.fn()} />)
  expect(await screen.findByText('Overview data is unavailable')).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Software access' })).not.toBeInTheDocument()
})
it('shows draft assessment fields as unrecorded and preserves the missing pricing reason', async () => {
  server.use(
    http.get('*/api/v1/access-requests/:id/assessment', () =>
      HttpResponse.json({
        success: true,
        data: {
          assessment: {
            ...requestAssessment,
            status: 'DRAFT',
            complete: false,
            completedBy: null,
            completedAt: null,
            step: null,
            adminConsole: null,
            memberExport: null,
            sso: null,
            quote: null,
            pricing: {
              ...requestAssessment.pricing,
              status: 'MISSING',
              missingReason: 'AWAITING_QUOTE',
              amount: null,
              unitPrice: null
            }
          }
        }
      })
    )
  )
  mount(<LiveRequestAssessment id={requestId} />)
  expect(await screen.findByText('In progress')).toBeInTheDocument()
  expect(screen.getByText('Awaiting an IT reviewer')).toBeInTheDocument()
  expect(screen.getByText('Awaiting a quote')).toBeInTheDocument()
  expect(screen.queryByText('Not available')).not.toBeInTheDocument()
  expect(screen.queryByText(/9,007,199/)).not.toBeInTheDocument()
})
it('recovers the dashboard after a server failure without showing stale counts', async () => {
  let failed = true
  server.use(
    http.get('*/api/v1/dashboards/employee', () =>
      failed ? HttpResponse.json({}, { status: 503 }) : HttpResponse.json({ success: true, data: employeeDashboard })
    )
  )
  mount(<EmployeeDashboardSummary onSelectTab={vi.fn()} />)
  const retry = await screen.findByRole('button', { name: 'Try again' })
  expect(screen.queryByText('12')).not.toBeInTheDocument()
  failed = false
  fireEvent.click(retry)
  expect(await screen.findByText('12')).toBeInTheDocument()
})
it('keeps restricted self-service overview from requesting Employee business metrics', async () => {
  const handler = vi.fn(() => HttpResponse.json({ success: true, data: employeeDashboard }))
  server.use(http.get('*/api/v1/dashboards/employee', handler))
  mount(<EmployeeLiveOverview name={person.fullName} selfServiceOnly onSelectTab={vi.fn()} />)
  expect(await screen.findByRole('heading', { name: person.fullName })).toBeInTheDocument()
  expect(handler).not.toHaveBeenCalled()
})
it('renders the IT assessment read-only and preserves large decimal quote precision', async () => {
  mount(<LiveRequestAssessment id={requestId} />)
  expect(await screen.findByText('Test vendor')).toBeInTheDocument()
  expect(screen.getByText(/9,007,199,254,740,993\.25/)).toBeInTheDocument()
  expect(screen.getByText('Annual commitment')).toBeInTheDocument()
  expect(screen.getAllByText('Not recorded yet').length).toBeGreaterThan(0)
  expect(screen.queryByRole('button')).not.toBeInTheDocument()
})
it('shows rejection and the suggested alternative from the assessment', async () => {
  server.use(
    http.get('*/api/v1/access-requests/:id/assessment', () =>
      HttpResponse.json({
        success: true,
        data: {
          assessment: {
            ...requestAssessment,
            status: 'REJECTED',
            rejection: {
              kind: 'UNCONTROLLABLE',
              reason: 'No revocation control',
              alternative: {
                plan: { planId: requestId, planName: 'Safe plan', applicationName: 'Safe software' },
                note: 'Use the approved tool'
              },
              rejectedBy: person,
              rejectedAt: '2026-11-01T03:00:00Z'
            }
          }
        }
      })
    )
  )
  mount(<LiveRequestAssessment id={requestId} />)
  expect(await screen.findByText('No revocation control')).toBeInTheDocument()
  expect(screen.getByText(/Safe software/)).toBeInTheDocument()
  expect(screen.getByText('Use the approved tool')).toBeInTheDocument()
})
it('retries assessment errors and handles an empty response', async () => {
  let failed = true
  server.use(
    http.get('*/api/v1/access-requests/:id/assessment', () =>
      failed ? HttpResponse.json({}, { status: 404 }) : HttpResponse.json({ success: true, data: null })
    )
  )
  mount(<LiveRequestAssessment id={requestId} />)
  const retry = await screen.findByRole('button', { name: 'Try again' })
  failed = false
  fireEvent.click(retry)
  expect(await screen.findByText('No assessment data yet')).toBeInTheDocument()
})
it.each([false, true])('loads assessment only when request has a proposal: %s', async (proposal) => {
  const handler = vi.fn(() => HttpResponse.json({ success: true, data: { assessment: requestAssessment } }))
  server.use(
    http.get('*/api/v1/access-requests/:id', () =>
      HttpResponse.json({
        success: true,
        data: {
          request: {
            ...accessRequest,
            plan: proposal ? null : accessRequest.plan,
            proposal: proposal ? requestAssessment.proposal : null
          }
        }
      })
    ),
    http.get('*/api/v1/access-requests/:id/assessment', handler)
  )
  mount(<EmployeeLiveRequestDetail id={requestId} onBack={vi.fn()} />)
  await screen.findByText(proposal ? 'Proposed software' : 'Test Software')
  if (proposal) expect(await screen.findByText('Test vendor')).toBeInTheDocument()
  else expect(handler).not.toHaveBeenCalled()
})
