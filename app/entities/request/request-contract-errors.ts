import axios from 'axios'

const requestErrors = {
  'DEPARTMENT_SOFTWARE.PROPOSAL_ALREADY_OPEN': 'departmentSoftware.duplicate',
  'DEPARTMENT_SOFTWARE.ALREADY_LISTED': 'departmentSoftware.alreadyListed',
  'DEPARTMENT_SOFTWARE.NOT_IN_CATALOG': 'departmentSoftware.notInCatalog',
  'ACCESS_REQUEST.OPEN_REQUEST_EXISTS': 'HAS_OPEN_REQUEST',
  'ACCESS_REQUEST.OPEN_LIMIT_REACHED': 'OPEN_LIMIT_REACHED',
  'ACCESS_REQUEST.ALREADY_HOLDS_ACCESS': 'existingAccess',
  'ACCESS_REQUEST.TERM_REQUIRED': 'termRefusal.TERM_REQUIRED',
  'ACCESS_REQUEST.TERM_MONTHS_OUT_OF_RANGE': 'termRefusal.TERM_MONTHS_OUT_OF_RANGE',
  'ACCESS_REQUEST.TERM_NOT_ASKED': 'termRefusal.TERM_NOT_ASKED',
  'ACCESS_REQUEST.TERM_LONG_TERM_NOT_ALLOWED': 'termRefusal.TERM_LONG_TERM_NOT_ALLOWED',
  'ACCESS_REQUEST.TERM_CONTRACT_ENDED': 'termRefusal.TERM_CONTRACT_ENDED',
  'RENEWAL_REQUEST.WINDOW_NOT_OPEN': 'renewalWindowUnknown',
  'RENEWAL_REQUEST.ASSIGNMENT_NOT_RENEWABLE': 'renewalNotAllowed',
  'RENEWAL_REQUEST.ALREADY_REQUESTED': 'renewalAlreadyRequested',
  'ACCESS_REQUEST.GRANT_RUNNING': 'grantRunning',
  'ACCESS_REQUEST.GRANT_COMPLETED': 'grantCompleted',
  'ACCESS_REQUEST.SOFTWARE_IN_CATALOG': 'softwareInCatalog',
  'ACCESS_REQUEST.STEP_NOT_PENDING': 'stepNotPending',
  'SPEND.SUPPLEMENT_TERM_MONTHS_OUT_OF_RANGE': 'termRefusal.TERM_MONTHS_OUT_OF_RANGE',
  'SPEND.SUPPLEMENT_TERM_NOT_REDUCED': 'supplementTermNotReduced',
  'SPEND.SUPPLEMENT_TERM_NOT_ASKED': 'supplementTermNotAsked',
  'BUDGET.CYCLE_NOT_FOUND': 'cycleRequired',
  'SPEND.RECHECKED_RETURNED_TO_HEAD': 'returned',
  'SPEND.RECHECKED_RETURNED_TO_REQUESTER': 'returned',
  'SPEND.RESERVE_NOT_PENDING': 'reserveNotAllowed',
  'SPEND.RESERVE_CONFIRMER_IS_BENEFICIARY': 'reserveNotAllowed',
  'SPEND.OWN_REQUEST': 'reserveNotAllowed'
} as const

export function requestContractErrorKey(error: unknown) {
  const code = axios.isAxiosError<{ error?: { code?: string } }>(error) ? error.response?.data.error?.code : undefined
  return code && Object.hasOwn(requestErrors, code) ? requestErrors[code as keyof typeof requestErrors] : undefined
}
