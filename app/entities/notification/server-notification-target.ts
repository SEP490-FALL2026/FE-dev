import type { UserRole } from '~/entities/user-role/user-role'
import type { NotificationTarget } from './notification-target'

const uuid = (value: unknown): value is string =>
  typeof value === 'string' && /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(value)

/** Maps a server-authorized operation to an existing local dashboard screen. */
export function serverNotificationTarget(value: unknown, role: UserRole): NotificationTarget | undefined {
  if (!value || typeof value !== 'object') return
  const target = value as { operationId?: unknown; pathParams?: unknown }
  if (typeof target.operationId !== 'string' || !target.pathParams || typeof target.pathParams !== 'object') return
  const params = target.pathParams as Record<string, unknown>
  const id = uuid(params.id) ? params.id : undefined
  const detail = (tab: string, extra: Record<string, string> = {}): NotificationTarget | undefined =>
    id ? { tab, params: { id, ...extra } } : undefined
  const year = String(params.year ?? '')
  const validYear = /^\d{4}$/.test(year) && Number(year) >= 2000 && Number(year) <= 2200
  if (target.operationId === 'policyGet' && (role === 'employee' || role === 'manager' || role === 'super-admin')) {
    const code = params.code
    return typeof code === 'string' && /^POL-[A-Z0-9]+$/.test(code)
      ? {
          tab: 'policies',
          params: role === 'super-admin' ? { policy: code, policyView: 'detail' } : { policyCode: code }
        }
      : undefined
  }
  switch (role) {
    case 'employee':
      switch (target.operationId) {
        case 'accessRequestGet':
          return detail('request-detail')
        case 'returnRequestGet':
          return detail('return-detail')
        case 'saasIssueGet':
          return detail('issue-detail')
        case 'meSoftwareRightList':
          return { tab: 'my-software', params: {} }
      }
      break
    case 'manager':
      switch (target.operationId) {
        case 'accessRequestGet':
          return detail('request-approval')
        case 'returnRequestGet':
          return detail('return-detail')
        case 'ghostSeatRecommendationGet':
          return detail('ghost-seat-detail')
        case 'ghostSeatQueueList':
          return { tab: 'ghost-seat-review', params: {} }
        case 'departmentSoftwareProposalList':
          return { tab: 'team-software', params: { toolsView: 'proposals' } }
        case 'budgetMine':
        case 'budgetMineVersionList':
          return { tab: 'annual-budget', params: {} }
      }
      break
    case 'it-admin':
      switch (target.operationId) {
        case 'ghostSeatRecommendationGet':
          return id ? { tab: 'license-optimization', params: { recommendation: id } } : undefined
        case 'provisioningTaskGet':
          return detail('provisioning', { queue: 'tasks' })
        case 'offboardingCaseGet':
          return detail('offboarding')
        case 'saasIssueGet':
          return detail('saas-issues')
        case 'departmentTransferGet':
          return detail('transfers')
        case 'subscriptionRenewalGet':
          return detail('renewals')
        case 'usageSourceList':
          return { tab: 'usage-import', params: {} }
      }
      break
    case 'finance':
      switch (target.operationId) {
        case 'accessRequestGet':
          return detail('request-monitor')
        case 'budgetProposalGet':
          return detail('annual-proposals')
        case 'budgetVersionGet':
          return detail('budget-negotiation')
        case 'budgetReviewPeriodGet':
          return detail('period-close')
        case 'spendBatchGet':
          return detail('spend-batches')
        case 'purchaseInvoiceGet':
          return detail('purchase-invoices')
        case 'subscriptionRenewalGet':
          return detail('subscription-renewals')
        case 'budgetCycleGet':
          return validYear ? { tab: 'budget-cycles', params: { id: year } } : undefined
        case 'budgetReviewPeriodList':
          return { tab: 'period-close', params: {} }
        case 'budgetAdjustmentList':
          return { tab: 'budget-adjustments', params: {} }
      }
      break
    case 'spending-approver':
      switch (target.operationId) {
        case 'accessRequestGet':
          return detail('request')
        case 'spendBatchGet':
          return detail('batch')
        case 'budgetVersionGet':
          return detail('annual-budget')
        case 'budgetReviewPeriodGet':
          return id ? { tab: 'in-year', params: { id: `period:${id}` } } : undefined
        case 'budgetCycleGet':
          return validYear ? { tab: 'annual-budget', params: { id: `cycle:${year}` } } : undefined
        case 'budgetReviewPeriodList':
          return { tab: 'in-year', params: { id: 'section:periods' } }
        case 'budgetAdjustmentList':
          return { tab: 'in-year', params: { id: 'section:adjustments' } }
        case 'subscriptionDeadlineEventList':
          return { tab: 'in-year', params: { id: 'section:deadlines' } }
      }
      break
    case 'super-admin':
      switch (target.operationId) {
        case 'employeeGet':
          return id ? { tab: 'personnel', params: { employeeId: id } } : undefined
        case 'departmentGet':
          return id ? { tab: 'departments', params: { departmentId: id } } : undefined
        case 'personnelNoticeGet':
          return id ? { tab: 'personnel', params: { section: 'notices', noticeId: id } } : undefined
        case 'offboardingCaseGet':
          return id ? { tab: 'personnel', params: { section: 'offboarding', offboardingId: id } } : undefined
        case 'stepCongestionList':
          return { tab: 'operations', params: {} }
      }
      break
  }
}
