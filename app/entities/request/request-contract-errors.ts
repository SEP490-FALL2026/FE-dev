import axios from 'axios'

const requestErrors = {
  'ACCESS_REQUEST.OPEN_REQUEST_EXISTS': 'HAS_OPEN_REQUEST',
  'ACCESS_REQUEST.OPEN_LIMIT_REACHED': 'OPEN_LIMIT_REACHED',
  'ACCESS_REQUEST.MANY_PAID_SOFTWARE_REASON_REQUIRED': 'requestGuard',
  'ACCESS_REQUEST.ALREADY_HOLDS_ACCESS': 'existingAccess',
  'ACCESS_REQUEST.TERM_BEYOND_LIMIT': 'dateRequired',
  'GROUP_REQUEST.TERM_BEYOND_LIMIT': 'dateRequired',
  'BUDGET.ZBB_REQUIRED': 'zbbRequired',
  'BUDGET.PRIORITY_RANK_INVALID': 'rankInvalid',
  'BUDGET.OVER_CEILING_NOTE_REQUIRED': 'noteRequired',
  'BUDGET.CYCLE_NOT_FOUND': 'cycleRequired',
  'BUDGET.CYCLE_NOT_PUBLISHED': 'cycleRequired',
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
