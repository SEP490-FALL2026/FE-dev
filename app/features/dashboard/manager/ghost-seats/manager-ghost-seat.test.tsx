import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { ManagerGhostSeatDetail } from './views/manager-ghost-seat-detail'
import { canSubmitGhostDecision } from './ghost-seat-decision'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { employeeProfile } from '../../../../../test/fixtures/employee-api'

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))
const id = '11111111-1111-4111-8111-111111111111'
const decision = vi.fn()
let state = 'AWAITING_DECISION'
let fail = false
const server = setupServer(
  http.get('*/api/v1/me', () => HttpResponse.json({ success: true, data: employeeProfile })),
  http.get('*/api/v1/ghost-seat-recommendations/:id', () =>
    HttpResponse.json({
      success: true,
      data: {
        recommendation: {
          id,
          state,
          group: 'G3',
          holder: { employeeId: id, employeeCode: 'EMP-TEST' },
          application: { applicationId: id, applicationName: 'Design Tool' },
          plan: { planId: id, planName: 'Enterprise' },
          activityStatus: 'INACTIVE',
          lastActiveDate: '2026-08-01',
          inactiveDays: 90,
          confidence: 'HIGH',
          potentialSaving: null,
          evidence: {
            coverageDays: 100,
            thresholds: { reviewDays: 60, actionDays: 90 },
            confidence: { level: 'HIGH', reasons: ['PRIVATE_CONFIDENCE'] },
            identityMatch: 'PRIVATE_IDENTITY',
            sources: [
              {
                name: 'Vendor report',
                kind: 'VENDOR',
                coverageFrom: '2026-08-01',
                coverageTo: '2026-11-01',
                definition: 'PRIVATE_SOURCE_DETAIL'
              }
            ]
          }
        }
      }
    })
  ),
  http.get('*/api/v1/policies/POL-MF5/steps/5.4', () =>
    HttpResponse.json({
      success: true,
      data: {
        policyCode: 'POL-MF5',
        policyVersionId: id,
        versionNumber: 2,
        step: {
          code: '5.4',
          title: 'Review unused seats',
          checklist: [{ code: '5.4-01', text: 'Business need remains?', check: 'PERSON' }]
        }
      }
    })
  ),
  http.post('*/api/v1/ghost-seat-decisions', async ({ request }) => {
    const body = await request.json()
    decision(body)
    return fail
      ? HttpResponse.json({ error: { code: 'POLICY.VERSION_CHANGED' } }, { status: 409 })
      : HttpResponse.json({ success: true, data: { items: [{ recommendationId: id, outcome: 'RECLAIM_DECIDED' }] } })
  })
)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
beforeEach(async () => {
  server.resetHandlers()
  vi.clearAllMocks()
  state = 'AWAITING_DECISION'
  fail = false
  await setAppLanguage('en', false)
})
function mount() {
  const back = vi.fn()
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <ManagerGhostSeatDetail id={id} onBack={back} />
    </QueryClientProvider>
  )
  return back
}
describe('Manager ghost seat decision', () => {
  it('shows only Manager evidence and submits Reclaim with a No answer and an explicit reason', async () => {
    const back = mount()
    const question = await screen.findByRole('radiogroup', { name: 'Business need remains?' })
    expect(screen.queryByText(/PRIVATE_/)).not.toBeInTheDocument()
    fireEvent.click(within(question).getByLabelText('No'))
    expect(screen.getByRole('radio', { name: 'Keep' })).toBeDisabled()
    expect(screen.getByRole('radio', { name: 'Exempt' })).toBeDisabled()
    expect(screen.getByRole('radio', { name: 'Reclaim' })).toBeChecked()
    expect(screen.getByRole('button', { name: 'Confirm decision' })).toBeDisabled()
    fireEvent.change(screen.getByLabelText('Reason (required for every decision)'), {
      target: { value: 'Project has ended' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Confirm decision' }))
    await waitFor(() =>
      expect(decision).toHaveBeenCalledWith({
        items: [{ recommendationId: id }],
        choice: 'RECLAIM',
        reason: 'Project has ended',
        checklist: { policyVersionId: id, answers: [{ itemCode: '5.4-01', answer: 'NO' }] }
      })
    )
    await waitFor(() => expect(back).toHaveBeenCalledOnce())
  })
  it('clears answers and preserves the reason after a policy version conflict', async () => {
    fail = true
    mount()
    fireEvent.click(
      within(await screen.findByRole('radiogroup', { name: 'Business need remains?' })).getByLabelText('Yes')
    )
    fireEvent.change(screen.getByLabelText('Reason (required for every decision)'), {
      target: { value: 'Active project' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Confirm decision' }))
    await waitFor(() => expect(decision).toHaveBeenCalledOnce())
    await waitFor(() =>
      expect(
        within(screen.getByRole('radiogroup', { name: 'Business need remains?' })).getByLabelText('Yes')
      ).not.toBeChecked()
    )
    expect(screen.getByLabelText('Reason (required for every decision)')).toHaveValue('Active project')
  })
  it('does not offer a decision for a closed recommendation', async () => {
    state = 'CLOSED'
    mount()
    expect(await screen.findByText(/no longer awaiting your decision/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Confirm decision' })).not.toBeInTheDocument()
  })
  it('requires a complete checklist and a reason for all three choices', () => {
    const body = { policyVersionId: id, answers: [] }
    expect(canSubmitGhostDecision('KEEP', true, body, 'Required project')).toBe(false)
    expect(canSubmitGhostDecision('EXEMPT', false, body, ' ')).toBe(false)
    expect(canSubmitGhostDecision('RECLAIM', true, undefined, 'End of project')).toBe(false)
  })
})
