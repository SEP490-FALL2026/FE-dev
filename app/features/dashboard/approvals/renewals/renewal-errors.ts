import { isAxiosError } from 'axios'
import type { TFunction } from 'i18next'
import type { approvalsRenewal } from '~/shared/i18n/locales/en/approvals-renewal'
import { getApprovalsError } from '../shared/approvals-errors'

type RenewalErrorKey = keyof typeof approvalsRenewal.errors

/** Documented subscription-renewal codes; generic codes fall back to the shared approvals messages. */
const renewalErrorKeys: Partial<Record<string, RenewalErrorKey>> = {
  'SUBSCRIPTION_RENEWAL.READ_FORBIDDEN': 'readForbidden',
  'SUBSCRIPTION_RENEWAL.NOT_FOUND': 'notFound',
  'SUBSCRIPTION_RENEWAL.NOT_DECIDER': 'notDecider',
  'SUBSCRIPTION_RENEWAL.NOT_AWAITING_DECISION': 'notAwaiting',
  'SUBSCRIPTION_RENEWAL.ACTIVE_USERS_NOT_ACKNOWLEDGED': 'activeUsers',
  'FINANCE.SETUP_INCOMPLETE': 'financeSetup',
  'REVOCATION.TYPE_NOT_SUPPORTED': 'revocationType',
  'SUBSCRIPTION_RENEWAL.QUANTITY_INVALID': 'quantityInvalid',
  'SUBSCRIPTION_RENEWAL.EXCESS_SELECTION_INVALID': 'excessSelection',
  'SUBSCRIPTION_RENEWAL.MID_TERM_NOT_ALLOWED': 'midTerm',
  'AUTHORIZATION.FORBIDDEN': 'forbidden'
}

/** Codes after which the approver must not retry the decision (locks the form). */
const blockingKeys: readonly RenewalErrorKey[] = ['readForbidden', 'notDecider', 'forbidden']

interface ErrorDetails {
  seatsInUse?: number
  required?: number
  selected?: number
}

export interface RenewalFailure {
  renewalKey?: RenewalErrorKey
  approvalsKey: ReturnType<typeof getApprovalsError>['key']
  ambiguous: boolean
  blocking: boolean
  details: ErrorDetails
  requestId?: string
}

function numberOrUndefined(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined
}

export function getRenewalError(error: unknown): RenewalFailure {
  const shared = getApprovalsError(error)
  const body = isAxiosError(error)
    ? (error.response?.data as { error?: { code?: string; details?: Record<string, unknown> } } | undefined)
    : undefined
  const renewalKey = renewalErrorKeys[body?.error?.code ?? '']
  const rawDetails = body?.error?.details ?? {}
  return {
    renewalKey,
    approvalsKey: shared.key,
    ambiguous: shared.ambiguous,
    blocking: renewalKey ? blockingKeys.includes(renewalKey) : shared.key === 'forbidden',
    requestId: shared.requestId,
    details: {
      seatsInUse: numberOrUndefined(rawDetails.seatsInUse),
      required: numberOrUndefined(rawDetails.required),
      selected: numberOrUndefined(rawDetails.selected)
    }
  }
}

/** Resolves the user-facing message; never shows the raw server message. */
export function getRenewalErrorMessage(
  failure: RenewalFailure,
  translateRenewal: TFunction<'approvalsRenewal'>,
  translateApprovals: TFunction<'approvals'>
) {
  if (failure.ambiguous) return translateApprovals('errors.ambiguous')
  const { renewalKey, details } = failure
  if (renewalKey === 'activeUsers' && details.seatsInUse === undefined)
    return translateRenewal('errors.activeUsersUnknown')
  if (renewalKey === 'excessSelection' && (details.required === undefined || details.selected === undefined))
    return translateRenewal('errors.excessSelectionUnknown')
  if (renewalKey)
    return translateRenewal(`errors.${renewalKey}`, {
      count: details.seatsInUse,
      required: details.required,
      selected: details.selected
    })
  return translateApprovals(`errors.${failure.approvalsKey}`)
}
