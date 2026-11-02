import { isAxiosError } from 'axios'
import type { finance } from '~/shared/i18n/locales/en/finance'

type FinanceErrorKey = keyof typeof finance.errors
const errorKeys: Partial<Record<string, FinanceErrorKey>> = {
  'AUTHORIZATION.FORBIDDEN': 'forbidden',
  'SPEND.NOT_FINANCE': 'forbidden',
  'SPEND.REVIEWER_IS_APPROVER': 'independentReview',
  'SPEND.OWN_REQUEST': 'ownRequest',
  'BUDGET.OWN_VERSION': 'ownVersion',
  'BUDGET.CURRENCY_NOT_REPORTING': 'reportingCurrency',
  'BUDGET.CURRENCY_MISMATCH': 'reportingCurrency',
  'BUDGET.QUARTERS_TOTAL_MISMATCH': 'quarters',
  'BUDGET.QUARTERS_EXCEED_TOTAL': 'quarters',
  'BUDGET.PROPOSAL_NOT_SUBMITTED': 'conflict',
  'BUDGET.VERSION_NOT_EDITABLE': 'conflict',
  'BUDGET.NO_ACTIVE_BUDGET': 'noBudget',
  'BUDGET.REASON_REQUIRED': 'reason',
  'BUDGET.ADJUSTMENT_REASON_REQUIRED': 'reason',
  'BUDGET.WINDOW_REASON_REQUIRED': 'reason',
  'BUDGET.WINDOW_BACKWARDS': 'window',
  'BUDGET.IMPORT_FILE_INVALID': 'importFile',
  'BUDGET.YEAR_ENDED': 'yearEnded',
  'BUDGET.PLAN_NOT_FOUND': 'planNotFound',
  'FINANCE_REVIEW.OPINION_REQUIRED': 'opinion',
  'FINANCE_REVIEW.REASON_REQUIRED': 'reason',
  'COST_CENTER.DEPARTMENT_ALREADY_LINKED': 'departmentLinked',
  'COST_CENTER.CODE_EXISTS': 'duplicateCode',
  'COST_CENTER.NOT_ACTIVE': 'inactive',
  'EXCHANGE_RATE.ALREADY_RECORDED': 'rateExists',
  'EXCHANGE_RATE.ALREADY_EXISTS': 'rateExists',
  VALIDATION_ERROR: 'validation',
  HTTP_PAYLOAD_TOO_LARGE: 'fileSize',
  HTTP_TOO_MANY_REQUESTS: 'rateLimit'
}

export function getFinanceError(error: unknown): { key: FinanceErrorKey; ambiguous: boolean; requestId?: string } {
  const response = isAxiosError(error) ? error.response : undefined
  const body = response?.data as { error?: { code?: string; requestId?: string } } | undefined
  const code = body?.error?.code ?? ''
  const status = response?.status
  const ambiguous = status === undefined || status >= 500
  const fallback = !status
    ? 'network'
    : status === 403
      ? 'forbidden'
      : status === 404
        ? 'notFound'
        : status === 409
          ? 'conflict'
          : status === 422
            ? 'validation'
            : status === 429
              ? 'rateLimit'
              : 'unavailable'
  return { key: errorKeys[code] ?? fallback, ambiguous, requestId: body?.error?.requestId }
}
