import axios from 'axios'

const contractErrorKeys = {
  'APP_USER.ALREADY_EXISTS_FOR_EMPLOYEE': 'duplicate',
  'APP_USER.LOGIN_EMAIL_TAKEN': 'duplicate',
  'APP_USER.FINANCE_ALREADY_ASSIGNED': 'financeAssigned',
  'APP_USER.ROLE_DERIVED': 'derivedRole',
  'APP_USER.SUPER_ADMIN_TRANSFER_ONLY': 'transferOnly',
  'APP_USER.ALREADY_ACTIVATED': 'alreadyActivated',
  'APP_USER.ACCOUNT_LOCKED': 'accountLocked',
  'APP_USER.ROLE_COMBINATION_FORBIDDEN': 'roleCombination',
  'APP_USER.SUPER_ADMIN_HOLDER_NOT_LOCKABLE': 'transferOnly',
  'APPROVAL_ROLE.EMPLOYEE_NOT_ACTIVE': 'ineligible',
  'APPROVAL_ROLE.NO_USABLE_ACCOUNT': 'unusableAccount',
  'APPROVAL_ROLE.SUPER_ADMIN_CANNOT_HOLD': 'roleCombination',
  'APPROVAL_ROLE.SUBSTITUTE_MUST_DIFFER': 'dutyConflict',
  'SUPER_ADMIN_TRANSFER.ACCOUNT_LOCKED': 'accountLocked',
  'SUPER_ADMIN_TRANSFER.EMPLOYEE_NOT_WORKING': 'ineligible',
  'SUPER_ADMIN_TRANSFER.NOT_ACTIVATED': 'unusableAccount',
  'SUPER_ADMIN_TRANSFER.EMAIL_NOT_VERIFIED': 'unusableAccount',
  'SUPER_ADMIN_TRANSFER.WORK_ROLE_HELD': 'successorResponsibilities',
  'SUPER_ADMIN_TRANSFER.APPROVAL_ROLE_HELD': 'successorResponsibilities',
  'SUPER_ADMIN_TRANSFER.HEADS_DEPARTMENT': 'successorResponsibilities',
  'DEPARTMENT.CODE_TAKEN': 'duplicate',
  'DEPARTMENT.IN_USE': 'departmentInUse',
  'DEPARTMENT.IT_ADMIN_INVALID': 'ineligible',
  'DEPARTMENT.HEAD_EMPLOYEE_NOT_ACTIVE': 'ineligible',
  'DEPARTMENT.HEAD_HEADS_ANOTHER_DEPARTMENT': 'successorResponsibilities',
  'DEPARTMENT.HEAD_NOT_A_MEMBER_ON_DATE': 'headMembership',
  'DEPARTMENT.HEAD_SUCCESSOR_IS_THE_HEAD': 'headMembership',
  'DEPARTMENT.HEAD_SUCCESSOR_DATE_NOT_FUTURE': 'dateInvalid',
  'DEPARTMENT.HEAD_DATE_IN_PAST': 'dateInvalid',
  'DEPARTMENT_TRANSFER.GROUNDS_REQUIRED': 'hrBasis',
  'DEPARTMENT_TRANSFER.GROUNDS_INCOMPLETE': 'hrBasis',
  'DEPARTMENT_TRANSFER.GROUNDS_IS_NOTICE': 'hrBasis',
  'DEPARTMENT_TRANSFER.HEAD_SUCCESSOR_REQUIRED': 'successorRequired',
  'DEPARTMENT_TRANSFER.SUCCESSOR_NOT_A_MEMBER_ON_DATE': 'headMembership',
  'DEPARTMENT_TRANSFER.PENDING_EVENT_EXISTS': 'pendingEvent',
  'DEPARTMENT_TRANSFER.EFFECTIVE_DATE_IN_PAST': 'dateInvalid',
  'DEPARTMENT_TRANSFER.EFFECTIVE_DATE_NOT_AFTER_CURRENT_PERIOD': 'dateInvalid',
  'LONG_LEAVE.GROUNDS_REQUIRED': 'hrBasis',
  'LONG_LEAVE.GROUNDS_INCOMPLETE': 'hrBasis',
  'LONG_LEAVE.GROUNDS_IS_NOTICE': 'hrBasis',
  'LONG_LEAVE.START_DATE_INVALID': 'dateInvalid',
  'LONG_LEAVE.RETURN_DATE_INVALID': 'dateInvalid',
  'LONG_LEAVE.RETURN_DATE_IN_PAST': 'dateInvalid',
  'LONG_LEAVE.ALREADY_ON_LEAVE': 'pendingEvent',
  'LONG_LEAVE.EMPLOYEE_NOT_WORKING': 'ineligible',
  'OFFBOARDING_CASE.GROUNDS_REQUIRED': 'hrBasis',
  'OFFBOARDING_CASE.GROUNDS_INCOMPLETE': 'hrBasis',
  'OFFBOARDING_CASE.GROUNDS_IS_NOTICE': 'hrBasis',
  'OFFBOARDING_CASE.SUCCESSOR_NOT_A_MEMBER_ON_DATE': 'headMembership',
  'OFFBOARDING_CASE.PENDING_EVENT_EXISTS': 'pendingEvent',
  'OFFBOARDING_CASE.LAST_DAY_ALREADY_PASSED': 'dateInvalid',
  'OFFBOARDING_CASE.LAST_WORKING_DAY_INVALID': 'dateInvalid',
  'OFFBOARDING_CASE.DEPARTED_ON_INVALID': 'dateInvalid',
  'OFFBOARDING_CASE.TRANSFER_CANCELLATION_REASON_REQUIRED': 'transferCancellation',
  'PERSONNEL_NOTICE.GROUNDS_REQUIRED': 'hrBasis',
  'PERSONNEL_NOTICE.GROUNDS_INCOMPLETE': 'hrBasis',
  'PERSONNEL_NOTICE.GROUNDS_IS_NOTICE': 'hrBasis',
  'PERSONNEL_NOTICE.NO_MATCHING_EVENT': 'eventMissing',
  'PERSONNEL_NOTICE.VERIFICATION_REQUIRED': 'verificationRequired',
  'IMPORT.PREVIEW_OUTDATED': 'previewStale',
  'IMPORT.PREVIEW_STALE': 'previewStale',
  'IMPORT.EXPIRED': 'importExpired',
  'IMPORT.DUPLICATE_FILE_NOT_ACKNOWLEDGED': 'duplicateFile',
  'IMPORT.ALREADY_CONFIRMED': 'importConfirmed',
  'IMPORT.FILE_REQUIRED': 'fileInvalid',
  'IMPORT.FILE_EMPTY': 'fileInvalid',
  'IMPORT.FILE_NOT_TEXT': 'fileInvalid',
  'IMPORT.FILE_TOO_MANY_ROWS': 'fileInvalid',
  'IMPORT.FILE_UNREADABLE': 'fileInvalid',
  'IMPORT.FILE_MISSING_COLUMNS': 'fileInvalid',
  'PARAMETER.VALUE_INVALID': 'parameterInvalid',
  'NON_WORKING_DATE.TAKEN': 'duplicate',
  'NON_WORKING_DATE.IN_PAST': 'dateInvalid'
} as const

type ContractErrorKey = (typeof contractErrorKeys)[keyof typeof contractErrorKeys]

export function getAdminError(error: unknown) {
  const response = axios.isAxiosError<{ error?: { code?: string; requestId?: string } }>(error)
    ? error.response
    : undefined
  const code = response?.data?.error?.code ?? ''
  let key:
    | ContractErrorKey
    | 'unavailable'
    | 'forbidden'
    | 'missing'
    | 'conflict'
    | 'validation'
    | 'rateLimit'
    | 'unknownOutcome'
    | 'lockedCurrency'
    | 'selfAction'
    | 'ineligible' = 'unavailable'
  if (Object.hasOwn(contractErrorKeys, code)) key = contractErrorKeys[code as keyof typeof contractErrorKeys]
  else if (code === 'REPORTING_CURRENCY.LOCKED') key = 'lockedCurrency'
  else if (code.includes('SELF_')) key = 'selfAction'
  else if (code.includes('INELIGIBLE') || code.includes('NOT_ELIGIBLE')) key = 'ineligible'
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
