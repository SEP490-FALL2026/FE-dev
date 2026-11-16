import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it } from 'vitest'
import { i18n, setAppLanguage } from '~/shared/i18n/i18n'
import { adminGhostSeats } from '~/shared/i18n/locales/en/admin-ghost-seats'
import { SuperAdminGhostSeatsView } from './index'

const server = setupServer()
const pagination = { page: 1, pageSize: 20, totalItems: 1, totalPages: 1 }
const applicationId = 'da91c7f0-3a89-45b0-8930-b0c165b0f795'
const threshold = {
  applicationId,
  applicationName: 'Example software',
  monitorDays: 30,
  reviewDays: 60,
  actionDays: 90,
  updatedAt: '2026-11-01T00:00:00Z'
}
const run = {
  id: 'run-1',
  ruleSet: 'G3_G4',
  periodKey: '2026-W46',
  status: 'COMPLETED',
  attempt: 1,
  startedAt: '2026-11-16T00:00:00Z',
  finishedAt: '2026-11-16T00:01:00Z',
  createdCount: 2,
  updatedCount: 0,
  closedCount: 0,
  skippedCount: 1,
  failedCount: 0
}
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
beforeEach(async () => {
  await setAppLanguage('en', false)
  i18n.addResourceBundle('en', 'admin', { ghostSeats: adminGhostSeats }, true, true)
  server.use(
    http.get('*/api/v1/ghost-seat-thresholds', () =>
      HttpResponse.json({ success: true, data: { items: [threshold], pagination } })
    )
  )
})
function mount(url = '/?tab=ghost-seats') {
  render(
    <MemoryRouter initialEntries={[url]}>
      <QueryClientProvider
        client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
      >
        <SuperAdminGhostSeatsView />
      </QueryClientProvider>
    </MemoryRouter>
  )
}

it('rejects unordered thresholds and sends a complete valid replacement', async () => {
  const bodies: unknown[] = []
  server.use(
    http.put('*/api/v1/ghost-seat-thresholds/:id', async ({ request }) => {
      bodies.push(await request.json())
      return HttpResponse.json({ success: true, data: { threshold } })
    })
  )
  mount()
  fireEvent.click(await screen.findByRole('button', { name: 'Edit thresholds for Example software' }))
  fireEvent.change(screen.getByRole('spinbutton', { name: 'Start monitoring after' }), { target: { value: '70' } })
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
  })
  expect(screen.getByText('Enter three whole numbers from 1 to 365, in increasing order.')).toBeInTheDocument()
  expect(bodies).toEqual([])
  fireEvent.change(screen.getByRole('spinbutton', { name: 'Start monitoring after' }), { target: { value: '40' } })
  fireEvent.click(screen.getByRole('button', { name: 'Save' }))
  await waitFor(() => expect(bodies).toEqual([{ monitorDays: 40, reviewDays: 60, actionDays: 90 }]))
})

it('restores organization defaults only after explicit confirmation', async () => {
  let deleted = 0
  server.use(
    http.delete('*/api/v1/ghost-seat-thresholds/:id', () => {
      deleted++
      return HttpResponse.json({ success: true, data: null })
    })
  )
  mount()
  fireEvent.click(await screen.findByRole('button', { name: 'Restore defaults for Example software' }))
  expect(deleted).toBe(0)
  fireEvent.click(screen.getByRole('button', { name: 'Restore defaults' }))
  await waitFor(() => expect(deleted).toBe(1))
})

it('sets an override using the permitted department software picker', async () => {
  const writes: unknown[] = []
  server.use(
    http.get('*/api/v1/departments', () =>
      HttpResponse.json({ success: true, data: { items: [{ id: 'dept-1', name: 'Operations' }], pagination } })
    ),
    http.get('*/api/v1/departments/dept-1/software-list', () =>
      HttpResponse.json({
        success: true,
        data: {
          items: [
            { entryId: 'entry-1', applicationId, applicationName: 'Department software', planId: null, planName: null }
          ],
          pagination
        }
      })
    ),
    http.put('*/api/v1/ghost-seat-thresholds/:id', async ({ request, params }) => {
      writes.push({ id: params.id, body: await request.json() })
      return HttpResponse.json({ success: true, data: { threshold } })
    })
  )
  mount()
  fireEvent.click(screen.getByRole('button', { name: 'Set application thresholds' }))
  await screen.findByRole('option', { name: 'Operations' })
  fireEvent.change(screen.getByRole('combobox', { name: 'Department' }), { target: { value: 'dept-1' } })
  await screen.findByRole('option', { name: 'Department software' })
  fireEvent.change(screen.getByRole('combobox', { name: 'Application' }), { target: { value: applicationId } })
  fireEvent.change(screen.getByRole('spinbutton', { name: 'Start monitoring after' }), { target: { value: '10' } })
  fireEvent.change(screen.getByRole('spinbutton', { name: 'Ask manager to review after' }), { target: { value: '20' } })
  fireEvent.change(screen.getByRole('spinbutton', { name: 'Mark for action after' }), { target: { value: '30' } })
  fireEvent.click(screen.getByRole('button', { name: 'Save' }))
  await waitFor(() =>
    expect(writes).toEqual([{ id: applicationId, body: { monitorDays: 10, reviewDays: 20, actionDays: 30 } }])
  )
})

it('runs selected rules using request enum values and opens paginated skip reasons as a page', async () => {
  const bodies: unknown[] = []
  const pages: string[] = []
  server.use(
    http.get('*/api/v1/ghost-seat-rule-runs', () =>
      HttpResponse.json({ success: true, data: { items: [run], pagination } })
    ),
    http.post('*/api/v1/ghost-seat-rule-runs', async ({ request }) => {
      bodies.push(await request.json())
      return HttpResponse.json({ success: true, data: { runs: [{ ...run, skippedByGate: [] }] } })
    }),
    http.get('*/api/v1/ghost-seat-rule-runs/run-1/skips', ({ request }) => {
      const page = new URL(request.url).searchParams.get('page') ?? '1'
      pages.push(page)
      return HttpResponse.json({
        success: true,
        data: {
          items: [
            {
              subjectType: 'ASSIGNMENT',
              subjectId: 'seat-1',
              gate: page === '1' ? 'NO_DATA' : 'NEW_ASSIGNMENT',
              detail: {}
            }
          ],
          pagination: { ...pagination, page: Number(page), totalItems: 21, totalPages: 2 }
        }
      })
    })
  )
  mount('/?tab=ghost-seats&section=runs')
  fireEvent.change(screen.getByRole('combobox', { name: 'Rules to run' }), { target: { value: 'G3G4' } })
  fireEvent.click(screen.getByRole('button', { name: 'Run now' }))
  fireEvent.click(screen.getByRole('button', { name: /Run now|Saving/ }))
  await waitFor(() => expect(bodies).toEqual([{ rules: ['G3G4'] }]))
  fireEvent.click(await screen.findByRole('button', { name: 'View skip reasons' }))
  expect(await screen.findByText('No usage data')).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Run now' })).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Next' }))
  expect(await screen.findByText('Recently assigned')).toBeInTheDocument()
  expect(pages).toContain('2')
})

it('filters decisions made by seat holders and keeps unavailable acceptance rates distinct from zero', async () => {
  const filters: Array<string | null> = []
  server.use(
    http.get('*/api/v1/ghost-seat-kpi5', () =>
      HttpResponse.json({
        success: true,
        data: {
          denominator: 0,
          numerator: 0,
          ratePercent: null,
          from: '2026-11-01',
          to: '2026-11-17',
          byGroup: Object.fromEntries(
            ['G1', 'G2', 'G3', 'G4'].map((key) => [
              key,
              { denominator: 0, numerator: 0, ratePercent: null, confidenceLabel: 'INTERNAL_DATA' }
            ])
          )
        }
      })
    ),
    http.get('*/api/v1/ghost-seat-decisions', ({ request }) => {
      filters.push(new URL(request.url).searchParams.get('selfDecided'))
      return HttpResponse.json({
        success: true,
        data: {
          items: [
            {
              id: 'decision-1',
              recommendationId: 'rec-1',
              choice: 'KEEP',
              reason: 'Needed for release',
              exemptUntil: null,
              decidedOn: '2026-11-16',
              decidedAt: '2026-11-16T00:00:00Z',
              decidedBy: { employeeId: 'person-1', employeeCode: 'EMP-001', fullName: 'Example Manager' },
              deciderDepartmentId: 'dept-1',
              selfDecided: true
            }
          ],
          pagination
        }
      })
    })
  )
  mount('/?tab=ghost-seats&section=decisions')
  expect(await screen.findByText('Needed for release')).toBeInTheDocument()
  expect(await screen.findByText('No recommendations in this period')).toBeInTheDocument()
  fireEvent.change(screen.getByRole('combobox', { name: 'Decision scope' }), { target: { value: 'true' } })
  await waitFor(() => expect(filters).toContain('true'))
  expect(screen.queryByText('G1')).not.toBeInTheDocument()
})
