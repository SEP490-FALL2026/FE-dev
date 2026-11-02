import { isAxiosError } from 'axios'
import type { approvals } from '~/shared/i18n/locales/en/approvals'

type ApprovalsErrorKey = keyof typeof approvals.errors
const errorKeys: Partial<Record<string, ApprovalsErrorKey>> = {
  'AUTHORIZATION.FORBIDDEN': 'forbidden',
  'SPEND.NOT_THE_ASSIGNEE': 'forbidden',
  'BUDGET.NOT_SPENDING_APPROVER': 'forbidden',
  'ACCESS_REQUEST.NOT_THE_ASSIGNEE': 'forbidden',
  'BUDGET_INFORMATION.NOT_THE_ASSIGNEE': 'forbidden',
  'SPEND.OWN_REQUEST': 'ownRequest',
  'ACCESS_REQUEST.OWN_REQUEST': 'ownRequest',
  'BUDGET_INFORMATION.OWN_REQUEST': 'ownRequest',
  'BUDGET.OWN_VERSION': 'ownVersion',
  'SPEND.REVIEWER_IS_APPROVER': 'independentReview',
  'SPEND.OVERRIDE_REQUIRED': 'overrideRequired',
  'SPEND.OVERRIDE_MISMATCH': 'overrideMismatch',
  'SPEND.OVERRIDE_NOT_NEEDED': 'overrideNotNeeded',
  'SPEND.RECHECKED_NEEDS_FINANCE_REVIEW': 'recheckedFinance',
  'SPEND.RECHECKED_RETURNED_TO_HEAD': 'recheckedHead',
  'SPEND.NO_SPEND_STEP': 'conflict',
  'SPEND.STEP_NOT_PENDING': 'conflict',
  'SPEND.NOT_CHECKABLE': 'conflict',
  'BUDGET.VERSION_NOT_SENT': 'conflict',
  'BUDGET.YEAR_ENDED': 'yearEnded',
  'BUDGET_INFORMATION.ALREADY_OPEN': 'questionOpen',
  'BUDGET_INFORMATION.NO_SPEND_STEP': 'conflict',
  'BUDGET_INFORMATION.STEP_NOT_PENDING': 'conflict',
  'GROUP_REQUEST.LINES_MISMATCH': 'linesMismatch',
  'ACCESS_REQUEST.TERM_CONFIRMATION_REQUIRED': 'termConfirmation',
  'ACCESS_REQUEST.PLAN_LINE_REQUIRED': 'planLineRequired',
  'ACCESS_REQUEST.STILL_NEEDED_REQUIRED': 'stillNeeded',
  VALIDATION_ERROR: 'validation',
  HTTP_TOO_MANY_REQUESTS: 'rateLimit'
}

export function getApprovalsError(error: unknown): { key: ApprovalsErrorKey; ambiguous: boolean; requestId?: string } {
  const response = isAxiosError(error) ? error.response : undefined
  const body = response?.data as { error?: { code?: string; requestId?: string } } | undefined
  const status = response?.status
  const fallback =
    status === undefined
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
  return {
    key: errorKeys[body?.error?.code ?? ''] ?? fallback,
    ambiguous: status === undefined || status >= 500,
    requestId: body?.error?.requestId
  }
}
