import { isAxiosError } from 'axios'
import type { approvals } from '~/shared/i18n/locales/en/approvals'

type ApprovalsErrorKey = keyof typeof approvals.errors
const errorKeys: Partial<Record<string, ApprovalsErrorKey>> = {
  'AUTHORIZATION.FORBIDDEN': 'forbidden',
  'SPEND.NOT_THE_ASSIGNEE': 'forbidden',
  'BUDGET.NOT_SPENDING_APPROVER': 'forbidden',
  'ACCESS_REQUEST.NOT_THE_ASSIGNEE': 'forbidden',
  'SPEND.OWN_REQUEST': 'ownRequest',
  'ACCESS_REQUEST.OWN_REQUEST': 'ownRequest',
  'BUDGET.OWN_VERSION': 'ownVersion',
  'BUDGET.CONFLICT_OF_INTEREST': 'conflictOfInterest',
  'SPEND.REVIEWER_IS_APPROVER': 'independentReview',
  'SPEND.OVERRIDE_REQUIRED': 'overrideRequired',
  'SPEND.RECHECKED_NEEDS_FINANCE_REVIEW': 'recheckedFinance',
  'SPEND.RECHECKED_RETURNED_TO_HEAD': 'recheckedHead',
  'SPEND.NO_SPEND_STEP': 'conflict',
  'SPEND.NOT_CHECKABLE': 'conflict',
  'BUDGET.VERSION_NOT_SENT': 'conflict',
  'BUDGET.YEAR_ENDED': 'yearEnded',
  'GROUP_REQUEST.LINES_MISMATCH': 'linesMismatch',
  'GROUP_REQUEST.LINE_HOLDS_ACCESS': 'lineHoldsAccess',
  'ACCESS_REQUEST.GROUP_USES_LINES': 'groupUsesLines',
  'ACCESS_REQUEST.STEP_NOT_PENDING': 'stepNotPending',
  'ACCESS_REQUEST.NOT_FOUND': 'notFound',
  'SPEND.REVIEW_NOT_FOUND': 'notFound',
  'SPEND.BATCH_NOT_FOUND': 'batchNotFound',
  'BUDGET.VERSION_NOT_FOUND': 'notFound',
  'BUDGET.PROPOSAL_NOT_FOUND': 'notFound',
  'BUDGET_ATTACHMENT.NOT_FOUND': 'attachmentNotFound',
  HTTP_PAYLOAD_TOO_LARGE: 'validation',
  HTTP_UNSUPPORTED_MEDIA_TYPE: 'validation',
  HTTP_BAD_REQUEST: 'validation',
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
