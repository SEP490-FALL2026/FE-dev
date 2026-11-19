import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { RenewalProposalDialog } from './renewals/components/renewal-proposal-dialog'
import { notificationTarget } from '~/entities/notification/notification-target'
import type { NotificationListResponseDtoDataItemsItem } from '~/shared/api/generated/model/notifications/notificationListResponseDtoDataItemsItem'
import { DeviceStopRequests } from './device-collectors/components/device-stop-requests'

const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
beforeEach(async () => {
  await setAppLanguage('en', false)
})
function mount(component: React.ReactNode) {
  return render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}
    >
      <MemoryRouter>{component}</MemoryRouter>
    </QueryClientProvider>
  )
}
const adjustment = {
  subscriptionId: 'sub',
  commitment: 'MONTHLY',
  deadlineKind: 'PAYMENT_DATE',
  deadline: '2026-12-01',
  adjustmentPointOn: '2026-11-01',
  renewalOn: '2026-12-01',
  redAlertOn: null,
  purchasedQuantity: 5,
  vendorMinimumSeats: 0,
  seatsNeeded: { total: 0, heldPastRenewal: 0, pendingContinuations: 0, approvedAwaitingGrant: 0 },
  target: 0,
  suggestedChoice: 'CANCEL',
  canCancel: true,
  activeSeatsToday: 0,
  openRequests: 0,
  responsibleItAdminEmployeeId: null,
  callerIsResponsible: true,
  recordedRenewalId: null
}
const subscription = { id: 'sub', applicationName: 'Acme', planName: 'Team' }
it('records cancellation once with closure evidence and a fresh adjustment read', async () => {
  const requests: unknown[] = []
  let reads = 0
  server.use(
    http.get('*/api/v1/subscription-renewals/adjustment', () => {
      reads++
      return HttpResponse.json({ success: true, data: { adjustment } })
    }),
    http.post('*/api/v1/subscription-renewals', async ({ request }) => {
      requests.push(await request.json())
      return HttpResponse.json({ success: true, data: null })
    })
  )
  mount(<RenewalProposalDialog subscription={subscription} onOpenCase={vi.fn()} onClose={vi.fn()} />)
  await screen.findByText('Business data has been exported')
  const submit = screen.getByRole('button', { name: 'Record outcome' })
  expect(submit).toBeDisabled()
  fireEvent.click(screen.getByLabelText('Business data has been exported'))
  fireEvent.click(screen.getByLabelText('Administrator responsibilities have been transferred'))
  fireEvent.click(submit)
  await waitFor(() => expect(requests).toHaveLength(1))
  expect(reads).toBeGreaterThanOrEqual(2)
  expect(requests[0]).toEqual({
    subscriptionId: 'sub',
    choice: 'CANCEL',
    outcome: 'AS_DECIDED',
    closure: { dataExported: true, adminsTransferred: true }
  })
})
it('blocks a stale cancellation when seat requirements change during the final read', async () => {
  const posted = vi.fn()
  let reads = 0
  server.use(
    http.get('*/api/v1/subscription-renewals/adjustment', () =>
      HttpResponse.json({
        success: true,
        data: { adjustment: ++reads === 1 ? adjustment : { ...adjustment, canCancel: false, target: 1 } }
      })
    ),
    http.post('*/api/v1/subscription-renewals', () => {
      posted()
      return HttpResponse.json({ success: true, data: null })
    })
  )
  mount(<RenewalProposalDialog subscription={subscription} onOpenCase={vi.fn()} onClose={vi.fn()} />)
  await screen.findByText('Business data has been exported')
  fireEvent.click(screen.getByLabelText('Business data has been exported'))
  fireEvent.click(screen.getByLabelText('Administrator responsibilities have been transferred'))
  fireEvent.click(screen.getByRole('button', { name: 'Record outcome' }))
  await waitFor(() => expect(screen.getByRole('radio', { name: 'Cancel subscription' })).toBeDisabled())
  expect(posted).not.toHaveBeenCalled()
})
it('shows overdue stop requests and completes with an empty body only after confirmation', async () => {
  const posted: unknown[] = []
  const item = {
    id: 'stop',
    deviceId: 'device',
    registrationId: 'registration',
    holderEmployeeId: 'holder',
    state: 'OPEN',
    invalidReason: null,
    requestedAt: '2026-11-10T10:00:00Z',
    dueAt: '2026-11-12T10:00:00Z',
    handledAt: null,
    handledByAppUserId: null,
    selfHandled: false,
    overdue: true
  }
  server.use(
    http.get('*/api/v1/device-stop-requests', () =>
      HttpResponse.json({
        success: true,
        data: {
          items: posted.length ? [] : [item],
          pagination: { page: 1, pageSize: 20, totalItems: 1, totalPages: 1 }
        }
      })
    ),
    http.get('*/api/v1/devices/device', () =>
      HttpResponse.json({ success: true, data: { assetCode: 'PC-01', hostname: 'workstation' } })
    ),
    http.post('*/api/v1/device-stop-requests/stop/completion', async ({ request }) => {
      posted.push(await request.json())
      return HttpResponse.json({ success: true, data: { stopRequest: { ...item, state: 'COMPLETED' } } })
    })
  )
  mount(<DeviceStopRequests />)
  await screen.findByText('Overdue')
  fireEvent.click(screen.getByRole('button', { name: 'Complete collection stop' }))
  expect(posted).toHaveLength(0)
  fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Complete collection stop' }))
  await waitFor(() => expect(posted).toEqual([{}]))
})

it('uses the backend target and renewal date in the confirmed next period', async () => {
  const posted: Record<string, unknown>[] = []
  const renew = {
    ...adjustment,
    target: 5,
    suggestedChoice: 'RENEW',
    canCancel: false,
    seatsNeeded: { ...adjustment.seatsNeeded, total: 5 }
  }
  server.use(
    http.get('*/api/v1/subscription-renewals/adjustment', () =>
      HttpResponse.json({ success: true, data: { adjustment: renew } })
    ),
    http.post('*/api/v1/subscription-renewals', async ({ request }) => {
      posted.push((await request.json()) as Record<string, unknown>)
      return HttpResponse.json({ success: true, data: null })
    })
  )
  mount(<RenewalProposalDialog subscription={subscription} onOpenCase={vi.fn()} onClose={vi.fn()} />)
  await screen.findByLabelText('Purchased seats')
  fireEvent.change(screen.getByLabelText('Unit price'), { target: { value: '250000' } })
  expect(screen.getByLabelText('Period start')).toHaveValue('2026-12-01')
  fireEvent.click(screen.getByRole('button', { name: 'Record outcome' }))
  await waitFor(() => expect(posted).toHaveLength(1))
  expect(posted[0]).toMatchObject({
    choice: 'RENEW',
    proposedQuantity: 5,
    outcome: 'AS_DECIDED',
    nextPeriod: {
      purchasedQuantity: 5,
      unitPrice: { amount: '250000', currency: 'VND' },
      startDate: '2026-12-01',
      billingCycle: 'MONTHLY'
    }
  })
  expect(posted[0]).not.toHaveProperty('releasedAssignmentIds')
  expect(posted[0]).not.toHaveProperty('businessOwnerOpinion')
})

it('routes the IT stop notification to the handling queue', () => {
  const notification = {
    target: { operationId: 'deviceStopRequestList', pathParams: {} },
    params: {}
  } as NotificationListResponseDtoDataItemsItem
  expect(notificationTarget(notification, 'it-admin')).toEqual({
    tab: 'device-collectors',
    params: { deviceView: 'stopRequests' }
  })
})
it('keeps a notification without an accessible target in the inbox', () => {
  const notification = { target: null, params: {} } as NotificationListResponseDtoDataItemsItem
  expect(notificationTarget(notification, 'it-admin')).toBeUndefined()
})

it('requires the new period when a vendor refuses to cancel a monthly subscription', async () => {
  server.use(
    http.get('*/api/v1/subscription-renewals/adjustment', () =>
      HttpResponse.json({ success: true, data: { adjustment } })
    )
  )
  mount(<RenewalProposalDialog subscription={subscription} onOpenCase={vi.fn()} onClose={vi.fn()} />)
  const outcome = await screen.findByRole('combobox', { name: 'Vendor outcome' })
  fireEvent.click(outcome)
  fireEvent.click(await screen.findByRole('option', { name: 'Vendor refused' }))
  expect(screen.getByLabelText('Purchased seats')).toBeVisible()
  expect(screen.queryByLabelText('Business data has been exported')).not.toBeInTheDocument()
})

it('opens contract data-quality notifications in the subscription editor', () => {
  const id = '33333333-3333-4333-8333-333333333333'
  const notification = {
    id: 'notification',
    title: 'Contract data needs review',
    message: 'Review contract dates',
    subject: null,
    createdAt: '2026-11-18T00:00:00Z',
    readAt: null,
    code: 'SUBSCRIPTION_RENEWAL_DATA_QUALITY',
    target: { operationId: 'subscriptionGet', pathParams: { id } },
    params: {}
  } as NotificationListResponseDtoDataItemsItem
  expect(notificationTarget(notification, 'it-admin')).toEqual({ tab: 'dept-catalog', params: { subscriptionId: id } })
})
