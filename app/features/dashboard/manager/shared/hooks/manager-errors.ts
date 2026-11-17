import axios from 'axios'

const errorKeys = {
  'GHOST_SEAT.NOT_DECIDER': 'forbidden',
  'GHOST_SEAT.PAUSED': 'ghostChanged',
  'GHOST_SEAT.NOT_DECIDABLE': 'ghostChanged',
  'GHOST_SEAT.SEAT_NOT_REVOCABLE': 'ghostNotRevocable',
  'GHOST_SEAT.EXEMPTION_REQUIRED': 'ghostExemption',
  'GHOST_SEAT.EXEMPTION_TOO_LONG': 'ghostExemption',
  'BUDGET_REVIEW.NOT_AWAITING_EXPLANATIONS': 'budgetReviewClosed',
  'BUDGET_REVIEW.EXPLANATION_NOT_REQUIRED': 'budgetExplanationNotRequired',
  'BUDGET.NOT_YOUR_COST_CENTER': 'forbidden',
  'FINANCE.SETUP_INCOMPLETE': 'financeSetup',
  'GROUP_REQUEST.LINES_MISMATCH': 'groupMismatch',
  'BUDGET_CYCLE.NOT_OPEN': 'cycleNotOpen',
  'BUDGET_CYCLE.LOCKED': 'cycleLocked',
  'BUDGET.COST_CENTER_REQUIRED': 'costCenterRequired',
  'GROUP_REQUEST.TOO_FEW_LINES': 'groupMinimum',
  'SUBSCRIPTION_RENEWAL.PROPOSAL_STALE': 'renewalStale',
  'SUBSCRIPTION_RENEWAL.ACTIVE_USERS_NOT_ACKNOWLEDGED': 'renewalAcknowledge',
  'SUBSCRIPTION_RENEWAL.NOT_DECIDER': 'notAssigned',
  'BUDGET.CURRENCY_NOT_REPORTING': 'currency',
  'BUDGET_ATTACHMENT.NOT_ATTACHABLE': 'budgetAttachments',
  'ACCESS_REQUEST.OWN_REQUEST': 'ownRequest',
  'ACCESS_REQUEST.NOT_THE_ASSIGNEE': 'notAssigned'
} as const

export function getManagerError(error: unknown, writing = false) {
  const response = axios.isAxiosError<{
    error?: {
      code?: string
      requestId?: string
      details?: {
        retryAfterSeconds?: number
        issues?: { path?: unknown }[]
        lines?: { line?: number; fields?: string[] }[]
        attachmentIds?: string[]
      }
    }
  }>(error)
    ? error.response
    : undefined
  const code = response?.data?.error?.code ?? ''
  const status = response?.status
  const key:
    | (typeof errorKeys)[keyof typeof errorKeys]
    | 'forbidden'
    | 'missing'
    | 'conflict'
    | 'validation'
    | 'rateLimit'
    | 'unknownOutcome'
    | 'unavailable' = Object.hasOwn(errorKeys, code)
    ? errorKeys[code as keyof typeof errorKeys]
    : status === 403
      ? 'forbidden'
      : status === 404
        ? 'missing'
        : status === 409
          ? 'conflict'
          : status === 422
            ? 'validation'
            : status === 429
              ? 'rateLimit'
              : writing && (!response || (status ?? 0) >= 500)
                ? 'unknownOutcome'
                : 'unavailable'
  const seconds = Number(response?.headers['retry-after'] ?? response?.data?.error?.details?.retryAfterSeconds ?? 60)
  return {
    key,
    requestId: response?.data?.error?.requestId,
    retrySeconds: Number.isFinite(seconds) ? Math.max(1, Math.ceil(seconds)) : 60,
    fields: [
      ...(response?.data?.error?.details?.attachmentIds?.length ? ['attachmentIds'] : []),
      ...(response?.data?.error?.details?.issues ?? [])
        .map((issue) =>
          typeof issue.path === 'string' ? issue.path : Array.isArray(issue.path) ? issue.path.join('.') : ''
        )
        .filter(Boolean),
      ...(response?.data?.error?.details?.lines ?? []).flatMap((line) => {
        const position = line.line
        if (typeof position !== 'number' || !Number.isInteger(position) || position < 1) return []
        return (line.fields ?? [])
          .filter((field) => typeof field === 'string')
          .map((field) => `lines.${position - 1}.${field}`)
      })
    ]
  }
}
