import axios from 'axios'

const errorKeys = {
  'FINANCE.SETUP_INCOMPLETE': 'financeSetup',
  'ACCESS_REQUEST.ALREADY_HOLDS_ACCESS': 'existingAccess',
  'ACCESS_REQUEST.APPLICATION_RETIRED': 'planUnavailable',
  'ACCESS_REQUEST.TERM_CONFIRMATION_REQUIRED': 'termConfirmation',
  'RENEWAL_REQUEST.TERM_CONFIRMATION_REQUIRED': 'termConfirmation',
  'SAAS_ISSUE.REOPEN_WINDOW_ENDED': 'reopenExpired'
} as const

export function getEmployeeError(error: unknown) {
  const response = axios.isAxiosError<{
    error?: {
      code?: string
      requestId?: string
      details?: { retryAfterSeconds?: number; issues?: { path?: unknown }[] }
    }
  }>(error)
    ? error.response
    : undefined
  const code = response?.data?.error?.code ?? ''
  let key:
    | (typeof errorKeys)[keyof typeof errorKeys]
    | 'unavailable'
    | 'forbidden'
    | 'missing'
    | 'validation'
    | 'conflict'
    | 'rateLimit'
    | 'unknownOutcome' = 'unavailable'
  if (Object.hasOwn(errorKeys, code)) key = errorKeys[code as keyof typeof errorKeys]
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
  const retryAfter = Number(response?.headers['retry-after'] ?? response?.data?.error?.details?.retryAfterSeconds ?? 60)
  return {
    key,
    fields: (response?.data?.error?.details?.issues ?? [])
      .map((issue) =>
        typeof issue.path === 'string' ? issue.path : Array.isArray(issue.path) ? issue.path.join('.') : ''
      )
      .filter(Boolean),
    requestId: response?.data?.error?.requestId,
    retryAfter: Number.isFinite(retryAfter) ? Math.max(1, retryAfter) : 60
  }
}
