import axios from 'axios'

const errors = {
  'SUBSCRIPTION.STALE': 'subscriptionStale',
  'SUBSCRIPTION.DUPLICATE_PLAN': 'subscriptionDuplicate',
  'SUBSCRIPTION.VENDOR_ADMINS_REQUIRED': 'subscriptionWorkspaceAdmins',
  'SUBSCRIPTION.RESPONSIBLE_REQUIRED': 'subscriptionResponsibleRequired',
  'SUBSCRIPTION.RESPONSIBLE_NOT_IT_ADMIN': 'subscriptionResponsibleInvalid',
  'SUBSCRIPTION.K1_MONTHLY_ONLY': 'subscriptionK1Terms',
  'SUBSCRIPTION.K4_PERPETUAL_ONLY': 'subscriptionK4Kind',
  'SUBSCRIPTION.BILLING_LONGER_THAN_COMMITMENT': 'subscriptionBillingTerm',
  'SUBSCRIPTION_RENEWAL.BEFORE_ADJUSTMENT_POINT': 'beforeAdjustment',
  'SUBSCRIPTION_RENEWAL.QUANTITY_NOT_SEATS_NEEDED': 'adjustmentChanged',
  'SUBSCRIPTION_RENEWAL.CANCEL_NOT_ALLOWED': 'cancelNotAllowed',
  'SUBSCRIPTION_RENEWAL.VENDOR_MINIMUM_EVIDENCE_REQUIRED': 'minimumEvidence',
  'SUBSCRIPTION_RENEWAL.NEXT_PERIOD_REQUIRED': 'nextPeriodRequired',
  'SUBSCRIPTION_RENEWAL.PERIOD_REFUSED': 'periodRefused',
  'SUBSCRIPTION_RENEWAL.NOT_RENEWABLE': 'notRenewable',
  'SUBSCRIPTION_RENEWAL.ALREADY_PROPOSED': 'renewalExists',
  'DEVICE_STOP_REQUEST.NOT_OPEN': 'stopNotOpen',
  'DEVICE_STOP_REQUEST.NOT_FOUND': 'missing',

  'PROVISIONING.K1_CHECKLIST_INCOMPLETE': 'k1ChecklistIncomplete',
  'PROVISIONING.PERSONAL_ACCOUNT': 'personalAccount',
  'PROVISIONING.K1_CHECKLIST_OUT_OF_ORDER': 'k1ChecklistOrder',
  'PROVISIONING.CONTRACT_ENDED': 'contractEnded',
  'PROVISIONING.SUBSCRIPTION_NEXT_PERIOD_SEATS': 'nextPeriodSeats',
  'POLICY.CHECKLIST_INCOMPLETE': 'policyChecklistIncomplete',
  'POLICY.CHECKLIST_HAS_NO': 'policyChecklistHasNo',
  'POLICY.VERSION_CHANGED': 'policyVersionChanged',
  'POLICY.NOT_IN_FORCE': 'policyVersionChanged',
  'APPLICATION.DUPLICATE': 'applicationDuplicate',
  'DEPARTMENT_SOFTWARE.ALREADY_LISTED': 'softwareAlreadyListed',
  'DEPARTMENT_SOFTWARE.OWN_PROPOSAL': 'ownProposal',
  'DEPARTMENT_SOFTWARE.NOT_IN_CATALOG': 'softwareNotInCatalog',
  'PURCHASE_INVOICE.NUMBER_TAKEN': 'invoiceNumberTaken',
  'SUBSCRIPTION.PRICE_NOT_VND': 'priceNotVnd',
  'PROVISIONING.ANOTHER_IT_ADMIN_NEEDED': 'anotherAdmin',
  'PROVISIONING_TASK.NOT_CLAIMABLE': 'conflict',
  'PROVISIONING_TASK.NOT_IN_PROGRESS': 'conflict',
  'PROVISIONING_TASK.NOT_FAILED': 'conflict',
  'PROVISIONING_TASK.WITHDRAWAL_PENDING': 'conflict',
  'PROVISIONING.REQUEST_BOUNDARY_NOT_CHECKED': 'boundaryRequired',
  'PROVISIONING.SUBSCRIPTION_QUANTITY_UNKNOWN': 'quantityUnknown',
  'SEAT_TARGET.SUBSCRIPTION_DRAFT': 'subscriptionDraft',
  'LICENSE_ASSIGNMENT.SEAT_CAPACITY': 'noSeats',
  'PROVISIONING.PURCHASE_NOT_ALLOWED': 'purchaseRefused',
  'PROVISIONING.PURCHASE_REASON_REQUIRED': 'purchaseReasonRequired',
  'PROVISIONING.KEY_REQUIRED': 'keyRequired',
  'LICENSE_KEY.NOT_IN_STORE': 'keyUnavailable',
  'LICENSE_KEY.WITHDRAWN': 'keyUnavailable',
  'LICENSE_KEY.SUBSCRIPTION_MISMATCH': 'keyUnavailable',
  'REVOCATION.WITHDRAWAL_REASON_REQUIRED': 'keyWithdrawalReasonRequired',
  'REVOCATION.K1_CHECKLIST_INCOMPLETE': 'k1ChecklistIncomplete',
  'REVOCATION.K1_CHECKLIST_OUT_OF_ORDER': 'k1ChecklistOrder',
  'REVOCATION.COMPLETION_NOT_ALLOWED': 'completionNotAllowed',
  'OFFBOARDING_CASE.ACCOUNT_LOCK_FIRST': 'accountLockFirst',
  'OFFBOARDING_CASE.MAILBOX_LOCK_BEFORE_K1': 'mailboxLockBeforeK1',
  'OFFBOARDING_CASE.CASE_CLOSED': 'conflict',
  'OFFBOARDING_CASE.CONCURRENT_CHANGE': 'conflict',
  'IT_HANDOVER.NOT_YET_YOURS': 'handoverNotYetYours',
  'IT_HANDOVER.NOTHING_TO_HAND_OVER': 'handoverNothing',
  'IT_HANDOVER.SOURCE_CANCELLED': 'conflict',
  'IT_HANDOVER.SAME_PERSON': 'handoverSamePerson',
  'IT_HANDOVER.TARGET_NOT_IT_ADMIN': 'handoverTargetInvalid',
  'LICENSE_ASSIGNMENT.OVERLAP': 'conflict',
  'LICENSE_ASSIGNMENT.IDENTIFIER_IN_USE': 'identifierInUse',
  'SEAT_BASELINE_IMPORT.PREVIEW_OUTDATED': 'previewStale',
  'SEAT_BASELINE_IMPORT.PREVIEW_STALE': 'previewStale',
  'SEAT_BASELINE_IMPORT.EXPIRED': 'previewStale',
  'SAAS_ISSUE.INVALID_TRANSITION': 'conflict',
  'SAAS_ISSUE.CLOSED': 'conflict',
  'SAAS_ISSUE.SCOPE_FORBIDDEN': 'forbidden',
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
