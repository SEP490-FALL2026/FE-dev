import { render, screen, waitFor, within } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { i18n, setAppLanguage } from '~/shared/i18n/i18n'
import { financeSettings } from '~/shared/i18n/locales/en/finance-settings'
import { finance } from '~/shared/i18n/locales/en/finance'
import { FinanceSubscriptionRenewalsView } from './views/finance-subscription-renewals-view'

const previousAdapter = apiClient.defaults.adapter
const requests: { url?: string; method?: string; params?: Record<string, unknown> }[] = []
let adjustmentStatus = 200

const subscription = {
  id: 'sub',
  planId: 'plan',
  planName: 'Team',
  applicationId: 'app',
  applicationName: 'Chat Suite',
  ownerDepartmentId: null
}
const renewal = {
  id: 'renewal',
  state: 'OUTCOME_RECORDED',
  subscription,
  milestone: { basis: 'DECLARED', baseDate: '2026-12-01' },
  proposedChoice: 'REDUCE',
  proposedQuantity: 8,
  decidedChoice: 'REDUCE',
  executionPoint: 'AS_PLANNED',
  outcome: 'AS_DECIDED',
  lateFlagged: false,
  waitingReason: null,
  proposedAt: '2026-11-01T02:00:00Z'
}
const adjustment = {
  subscriptionId: 'sub',
  commitment: 'ANNUAL',
  deadlineKind: 'NOTICE_DEADLINE',
  deadline: '2026-12-01',
  adjustmentPointOn: '2026-11-01',
  renewalOn: '2027-01-01',
  redAlertOn: '2026-11-24',
  purchasedQuantity: 10,
  vendorMinimumSeats: null,
  seatsNeeded: { total: 8, heldPastRenewal: 7, pendingContinuations: 1, approvedAwaitingGrant: 0 },
  target: 8,
  suggestedChoice: 'REDUCE',
  canCancel: false,
  activeSeatsToday: 9,
  openRequests: 0,
  responsibleItAdminEmployeeId: 'it',
  callerIsResponsible: false,
  recordedRenewalId: 'renewal'
}

function respond(config: InternalAxiosRequestConfig, status: number, data: unknown) {
  const response = { config, status, statusText: String(status), headers: new AxiosHeaders(), data }
  if (status >= 400) throw new AxiosError('failed', 'ERR_BAD_REQUEST', config, undefined, response)
  return response
}

beforeEach(async () => {
  requests.length = 0
  adjustmentStatus = 200
  i18n.addResourceBundle('en', 'financeSettings', financeSettings)
  i18n.addResourceBundle('en', 'finance', finance)
  await setAppLanguage('en', false)
  apiClient.defaults.adapter = async (config) => {
    requests.push({ url: config.url, method: config.method, params: config.params })
    const url = config.url ?? ''
    const page = { page: 1, pageSize: 20, totalItems: 1, totalPages: 1 }
    if (url.endsWith('/subscription-renewals/adjustment'))
      return adjustmentStatus === 200
        ? respond(config, 200, { success: true, data: { adjustment } })
        : respond(config, adjustmentStatus, { success: false, error: { code: 'SUBSCRIPTION_RENEWAL.NOT_FOUND' } })
    if (url.endsWith('/subscription-renewals/renewal'))
      return respond(config, 200, {
        success: true,
        data: {
          renewal: {
            ...renewal,
            period: {
              purchasedQuantity: 10,
              billingCycle: 'ANNUAL',
              startDate: '2026-01-01',
              endDate: '2026-12-31',
              renewalDate: '2027-01-01',
              autoRenew: true,
              allowsMidTermReduction: false,
              seatsInUse: 9
            },
            usage: { status: 'AVAILABLE' },
            decision: { choice: 'REDUCE', quantity: 8 },
            lateFlaggedAt: null,
            outcomeDetail: {
              kind: 'AS_DECIDED',
              note: null,
              recordedByEmployeeId: 'it',
              recordedAt: '2026-11-20T03:00:00Z',
              vendorFollowUpOpen: false,
              nextSubscriptionId: null,
              realisedSavings: { amount: '2400000', currency: 'VND' }
            }
          }
        }
      })
    if (url.endsWith('/subscription-renewals'))
      return respond(config, 200, { success: true, data: { items: [renewal], pagination: page } })
    if (url.endsWith('/subscription-deadline-events'))
      return respond(config, 200, {
        success: true,
        data: {
          items: [
            {
              id: 'event',
              subscription,
              kind: 'AUTO_RENEWAL_INCIDENT',
              milestoneDate: '2026-10-01',
              autoRenewAtTime: true,
              recordedOn: '2026-10-02',
              recordedAt: '2026-10-02T01:00:00Z'
            }
          ],
          pagination: page
        }
      })
    // Departments come from the department cost centers.
    return respond(config, 200, { success: true, data: { items: [], pagination: { ...page, totalItems: 0 } } })
  }
})
afterEach(() => {
  apiClient.defaults.adapter = previousAdapter
})

function mount(itemId?: string, onSelectTab = vi.fn()) {
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <FinanceSubscriptionRenewalsView itemId={itemId} onSelectTab={onSelectTab} />
    </QueryClientProvider>
  )
  return onSelectTab
}

it('lists the recorded adjustments and the passed deadlines, read only', async () => {
  const onSelectTab = mount()
  expect((await screen.findAllByText('Chat Suite · Team')).length).toBeGreaterThan(0)
  expect(screen.getAllByText('Reduce seats · 8 seats').length).toBeGreaterThan(0)
  expect(
    (await screen.findAllByText(financeSettings.renewals.events.kinds.AUTO_RENEWAL_INCIDENT)).length
  ).toBeGreaterThan(0)
  expect(screen.getAllByText(financeSettings.renewals.sharedPool).length).toBeGreaterThan(0)
  screen.getAllByRole('button', { name: finance.open })[0].click()
  expect(onSelectTab).toHaveBeenCalledWith('subscription-renewals', { id: 'renewal' })
  expect(requests.every((request) => request.method === 'get')).toBe(true)
})

it('shows one adjustment with the seats the system counted and the outcome IT Admin recorded', async () => {
  mount('renewal')
  expect(await screen.findByText(financeSettings.renewals.outcomes.AS_DECIDED)).toBeInTheDocument()
  const adjustmentRegion = await screen.findByRole('region', { name: financeSettings.renewals.adjustment.title })
  expect(
    await within(adjustmentRegion).findByText(financeSettings.renewals.adjustment.deadlineKinds.NOTICE_DEADLINE)
  ).toBeInTheDocument()
  await waitFor(() =>
    expect(
      requests.some(
        (request) =>
          request.url?.endsWith('/subscription-renewals/adjustment') && request.params?.subscriptionId === 'sub'
      )
    ).toBe(true)
  )
  expect(screen.queryByRole('button', { name: /record|ghi/i })).not.toBeInTheDocument()
})

it('reads a missing adjustment route as no adjustment point, not as an error', async () => {
  adjustmentStatus = 404
  mount('renewal')
  expect(await screen.findByText(financeSettings.renewals.adjustment.none)).toBeInTheDocument()
})
