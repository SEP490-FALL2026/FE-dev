import axios from 'axios'

const fields = new Set([
  'employeeCode',
  'departmentCode',
  'fullName',
  'workEmail',
  'employmentType',
  'hireDate',
  'contractEndDate',
  'jobTitle'
])
const reasons = new Set([
  'EMPLOYEE_CODE_INVALID',
  'EMPLOYEE_CODE_TAKEN',
  'WORK_EMAIL_TAKEN',
  'DEPARTMENT_CODE_INVALID',
  'DEPARTMENT_NOT_FOUND',
  'DEPARTMENT_INACTIVE',
  'JOB_TITLE_TOO_LONG',
  'CONTRACT_END_NOT_APPLICABLE',
  'CONTRACT_END_BEFORE_HIRE',
  'OWN_RECORD',
  'HIRE_DATE_LOCKED',
  'HIRE_DATE_IN_PAST',
  'OPEN_ASSIGNMENT_NEEDS_EXPECTED_END'
])
function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object'
}

/** Only expose known validation reasons; server text and unknown fields never become UI copy. */
export function readEmployeeFieldErrors(error: unknown): Record<string, string> {
  if (!axios.isAxiosError<unknown>(error)) return {}
  const response = error.response?.data
  if (!isRecord(response) || !isRecord(response.error) || response.error.code !== 'EMPLOYEE.ROW_INVALID') return {}
  const details = response.error.details
  if (!isRecord(details) || !Array.isArray(details.reasons)) return {}
  const errors: Record<string, string> = {}
  for (const reason of details.reasons) {
    if (!isRecord(reason) || typeof reason.field !== 'string' || typeof reason.code !== 'string') continue
    if (fields.has(reason.field)) errors[reason.field] = reasons.has(reason.code) ? reason.code : 'INVALID'
  }
  return errors
}
