import type { UserRole } from '~/entities/user-role/user-role'
import { serverNotificationTarget } from './server-notification-target'
import { NOTIFICATION_SUBJECT as SUBJECT } from './enums/notification-subject'
import type { NotificationListResponseDtoDataItemsItem } from '~/shared/api/generated/model'

const uuid = (value: unknown): value is string =>
  typeof value === 'string' && /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(value)
export type NotificationTarget = { tab: string; params: Record<string, string> }
/** Build local dashboard targets only. Never navigate to params.viewPath or arbitrary server URLs. */
export function notificationTarget(
  notification: NotificationListResponseDtoDataItemsItem,
  role: UserRole
): NotificationTarget | undefined {
  // Newer contracts provide an authorization-aware target. Explicit null means no destination.
  if (Object.hasOwn(notification, 'target')) {
    const target = (notification as typeof notification & { target?: unknown }).target
    const destination = serverNotificationTarget(target, role)
    if (destination?.tab === 'annual-budget' && role === 'manager') {
      const year = notification.params.year
      const departmentId = notification.params.departmentId
      if (typeof year === 'number' && Number.isInteger(year) && year >= 2000 && year <= 2200)
        destination.params.year = String(year)
      if (uuid(departmentId)) destination.params.departmentId = departmentId
    }
    return destination
  } else if (role !== 'employee' && role !== 'manager') return
  const { subject, params, code } = notification
  const id = uuid(subject?.id) ? subject.id : undefined
  const manager = role === 'manager'
  if (
    subject?.type === SUBJECT.POLICY_VERSION &&
    typeof params.policyCode === 'string' &&
    /^POL-[A-Z0-9]+$/.test(params.policyCode)
  ) {
    return {
      tab: 'policies',
      params: {
        policyCode: params.policyCode,
        ...(typeof params.versionNumber === 'number' &&
        Number.isInteger(params.versionNumber) &&
        params.versionNumber > 0
          ? { version: String(params.versionNumber) }
          : {})
      }
    }
  }
  if (id && subject?.type === SUBJECT.ACCESS_REQUEST)
    return { tab: manager ? 'request-approval' : 'request-detail', params: { id } }
  if (id && subject?.type === SUBJECT.RETURN_REQUEST) return { tab: 'return-detail', params: { id } }
  if (manager && id && subject?.type === SUBJECT.GHOST_SEAT_RECOMMENDATION)
    return { tab: 'ghost-seat-detail', params: { id } }
  if (manager && (subject?.type.startsWith('BUDGET_') || code === 'BUDGET_THRESHOLD_REACHED')) {
    const year = params.year
    if (typeof year !== 'number' || !Number.isInteger(year) || year < 2000 || year > 2200) return
    const target: NotificationTarget = { tab: 'annual-budget', params: { year: String(year) } }
    if (uuid(params.departmentId)) target.params.departmentId = params.departmentId
    if (id && subject?.type === SUBJECT.BUDGET_PROPOSAL) target.params.proposalId = id
    if (id && subject?.type === SUBJECT.BUDGET_VERSION) target.params.versionId = id
    if (subject?.type === SUBJECT.BUDGET_REVIEW_PERIOD) {
      target.params.budgetView = 'reviews'
      if (id) target.params.reviewId = id
    }
    if (subject?.type === SUBJECT.BUDGET_ADJUSTMENT) {
      target.params.budgetView = 'adjustments'
      if (id) target.params.adjustmentId = id
    }
    return target
  }
  if (!manager && subject?.type === SUBJECT.LICENSE_ASSIGNMENT && id) return { tab: 'software-detail', params: { id } }
  if (code === 'USAGE_TRACKING_NOTICE') return { tab: manager ? 'profile' : 'privacy', params: {} }
  if (!subject && uuid(params.requestId) && /^(REQUEST_|STEP_|COMMITMENT_)/.test(code))
    return { tab: manager ? 'request-approval' : 'request-detail', params: { id: params.requestId } }
}
