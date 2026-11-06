import axios from 'axios'

const errors = {
  'PROVISIONING.ANOTHER_IT_ADMIN_NEEDED': 'anotherAdmin',
  'PROVISIONING_TASK.NOT_CLAIMABLE': 'conflict',
  'PROVISIONING_TASK.NOT_IN_PROGRESS': 'conflict',
  'PROVISIONING_TASK.NOT_FAILED': 'conflict',
  'PROVISIONING_TASK.WITHDRAWAL_PENDING': 'conflict',
  'PROVISIONING.REQUEST_BOUNDARY_NOT_CHECKED': 'boundaryRequired',
  'PROVISIONING.SUBSCRIPTION_QUANTITY_UNKNOWN': 'quantityUnknown',
  'SEAT_TARGET.SUBSCRIPTION_DRAFT': 'subscriptionDraft',
  'LICENSE_ASSIGNMENT.SEAT_CAPACITY': 'noSeats',
  'LICENSE_ASSIGNMENT.OVERLAP': 'conflict',
  'LICENSE_ASSIGNMENT.IDENTIFIER_IN_USE': 'identifierInUse',
  'SEAT_BASELINE.CLOSED': 'baselineClosed',
  'SEAT_BASELINE_IMPORT.PREVIEW_OUTDATED': 'previewStale',
  'SEAT_BASELINE_IMPORT.PREVIEW_STALE': 'previewStale',
  'SEAT_BASELINE_IMPORT.EXPIRED': 'previewStale',
  'SAAS_ISSUE.INVALID_TRANSITION': 'conflict',
  'SAAS_ISSUE.CLOSED': 'conflict',
  'SAAS_ISSUE.SCOPE_FORBIDDEN': 'forbidden',
  'OFFBOARDING_CASE.CASE_NOT_CLOSEABLE': 'blockers',
  'OFFBOARDING_CASE.ACCOUNT_LOCK_NOT_RECORDED': 'blockers',
  'OFFBOARDING_CASE.CASE_NOT_BLOCKED': 'accessNotBlocked',
  'OFFBOARDING_CASE.NOTHING_TO_REVOKE': 'nothingToRevoke',
  'SUBSCRIPTION_RENEWAL.EXCESS_SELECTION_INVALID': 'excessSelection',
  'SUBSCRIPTION_RENEWAL.EXCESS_NOT_REVOKED': 'excessNotRevoked',
  'SUBSCRIPTION_RENEWAL.PROPOSAL_STALE': 'proposalStale',
  'SUBSCRIPTION_RENEWAL.PROPOSER_IS_OWNER_HEAD': 'ownerHeadProposal',
  'OFFBOARDING_CASE.ASSIGNMENT_NOT_AVAILABLE': 'conflict'
} as const

export function getItError(error: unknown) {
  const response = axios.isAxiosError<{ error?: { code?: string; requestId?: string } }>(error)
    ? error.response
    : undefined
  const code = response?.data?.error?.code ?? ''
  let key:
    | (typeof errors)[keyof typeof errors]
    | 'unavailable'
    | 'forbidden'
    | 'missing'
    | 'validation'
    | 'rateLimit'
    | 'unknownOutcome' = 'unavailable'
  if (Object.hasOwn(errors, code)) key = errors[code as keyof typeof errors]
  else if (response?.status === 403) key = 'forbidden'
  else if (response?.status === 404) key = 'missing'
  else if (response?.status === 409) key = 'conflict'
  else if (response?.status === 422) key = 'validation'
  else if (response?.status === 429) key = 'rateLimit'
  else if (
    axios.isAxiosError(error) &&
    error.config?.method?.toUpperCase() !== 'GET' &&
    (!response || response.status >= 500)
  )
    key = 'unknownOutcome'
  return { key, code, requestId: response?.data?.error?.requestId }
}
