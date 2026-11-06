import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import { afterAll, beforeAll, beforeEach, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { employeeId, pageResponse, planId, requestId } from '../../../../../test/fixtures/employee-api'
import { ManagerSubscriptionRenewals } from './views/manager-subscription-renewals'

const written = vi.fn()
let stale = false
const proposal = {
  id: requestId,
  state: 'PROPOSED',
  proposedChoice: 'CANCEL',
  proposedQuantity: null,
  proposedAt: '2026-11-06T00:00:00Z',
  subscription: {
    id: planId,
    planId,
    planName: 'Standard',
    applicationId: planId,
    applicationName: 'Test Software',
    ownerDepartmentId: employeeId
  },
  period: {
    seatsInUse: 2,
    purchasedQuantity: 4,
    billingCycle: 'MONTHLY',
    startDate: null,
    endDate: null,
    renewalDate: null,
    autoRenew: true,
    allowsMidTermReduction: false
  },
  proposal: {
    choice: 'CANCEL',
    quantity: null,
    note: 'Retire the tool',
    businessOwnerOpinion: null,
    proposedByEmployeeId: employeeId,
    proposedAt: '2026-11-06T00:00:00Z',
    releasedSeatCount: 0
  }
}
const server = setupServer(
  http.get('*/api/v1/subscription-renewals', () => HttpResponse.json(pageResponse(stale ? [] : [proposal]))),
  http.get('*/api/v1/subscription-renewals/:id', () =>
    HttpResponse.json({ success: true, data: { renewal: { ...proposal, state: stale ? 'STALE' : 'PROPOSED' } } })
  ),
  http.get('*/api/v1/subscription-renewals/:id/seat-ranking', () =>
    HttpResponse.json({ ...pageResponse([]), data: { ...pageResponse([]).data, usage: { status: 'NOT_AVAILABLE' } } })
  ),
  http.post('*/api/v1/subscription-renewals/:id/decision', async ({ request }) => {
    written(await request.json())
    if (stale)
      return HttpResponse.json(
        { success: false, error: { code: 'SUBSCRIPTION_RENEWAL.PROPOSAL_STALE' } },
        { status: 409 }
      )
    return HttpResponse.json({ success: true, data: { renewal: { ...proposal, state: 'DECIDED' } } })
  })
)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
beforeEach(async () => {
  server.resetHandlers()
  written.mockClear()
  stale = false
  await setAppLanguage('en', false)
})
async function mount() {
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <MemoryRouter initialEntries={[`/?tab=subscription-renewals&renewalId=${requestId}`]}>
        <ManagerSubscriptionRenewals />
      </MemoryRouter>
    </QueryClientProvider>
  )
  await screen.findByLabelText('Reason')
}
it('requires acknowledgement for active users and sends only confirmation fields', async () => {
  await mount()
  const confirm = screen.getByRole('button', { name: 'Confirm proposal' })
  expect(confirm).toBeDisabled()
  expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('checkbox'))
  fireEvent.change(screen.getByLabelText('Reason'), { target: { value: '  Approved by department  ' } })
  fireEvent.click(confirm)
  await waitFor(() =>
    expect(written).toHaveBeenCalledWith({
      decision: 'CONFIRM',
      reason: 'Approved by department',
      acknowledgeActiveUsers: true
    })
  )
  expect(screen.getByText('Usage data is not available to assess activity.')).toBeInTheDocument()
})
it('refreshes a stale proposal and prevents another confirmation', async () => {
  await mount()
  fireEvent.click(screen.getByRole('checkbox'))
  stale = true
  fireEvent.click(screen.getByRole('button', { name: 'Confirm proposal' }))
  expect(
    await screen.findByText('This proposal has changed. IT must submit a new proposal before confirmation.')
  ).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Confirm proposal' })).not.toBeInTheDocument()
  expect(written).toHaveBeenCalledOnce()
})
