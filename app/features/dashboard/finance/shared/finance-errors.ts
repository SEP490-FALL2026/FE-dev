import { isAxiosError } from 'axios'
import type { finance } from '~/shared/i18n/locales/en/finance'

type FinanceErrorKey = keyof typeof finance.errors
const errorKeys: Partial<Record<string, FinanceErrorKey>> = {
  'AUTHORIZATION.FORBIDDEN': 'forbidden',
  'INVOICE.DUPLICATE': 'invoiceDuplicate',
  'INVOICE.COMMITMENT_RELEASED': 'invoiceCommitmentReleased',
  'INVOICE.VENDOR_UNKNOWN': 'invoiceVendorUnknown',
  'SPEND.NOT_FINANCE': 'forbidden',
  'SPEND.OWN_REQUEST': 'ownRequest',
  'SPEND.PLAN_LINE_NOT_UPDATED': 'planLineNotUpdated',
  'SPEND.NO_BUDGET_TO_MAKE': 'noBudgetToMake',
  'SPEND.NO_HEAD_TO_PROPOSE': 'noDepartmentHead',
  'BUDGET.OWN_VERSION': 'ownVersion',
  'BUDGET.CURRENCY_NOT_REPORTING': 'reportingCurrency',
  CURRENCY_NOT_SUPPORTED: 'money',
  MONEY_SCALE_EXCEEDED: 'money',
  MONEY_OUT_OF_RANGE: 'money',
  'BUDGET.QUARTERS_MISMATCH': 'quarters',
  'BUDGET.PROPOSAL_NOT_SUBMITTED': 'proposalNotOpen',
  'BUDGET.PROPOSAL_CANNOT_RETURN': 'proposalNotOpen',
  'BUDGET.PROPOSAL_INCOMPLETE': 'lineIncomplete',
  'BUDGET.VERSION_NOT_EDITABLE': 'conflict',
  'BUDGET.VERSION_IN_FLIGHT': 'versionInFlight',
  'BUDGET.CURRENT_EXISTS': 'currentExists',
  'BUDGET.NO_CURRENT_BUDGET': 'noBudget',
  'BUDGET.VERSION_NOT_CURRENT': 'versionNotCurrent',
  'BUDGET.REVISION_REQUIRED': 'revisionRequired',
  'BUDGET.DEPARTMENT_HAS_NO_HEAD': 'noDepartmentHead',
  'BUDGET.REVISION_REASON_REQUIRED': 'reason',
  'BUDGET.ADJUSTMENT_REASON_REQUIRED': 'reason',
  'BUDGET.WINDOW_REASON_REQUIRED': 'reason',
  'BUDGET.WINDOW_BACKWARDS': 'window',
  'BUDGET.IMPORT_FILE_INVALID': 'importFile',
  'BUDGET.YEAR_ENDED': 'yearEnded',
  'BUDGET.PLAN_NOT_FOUND': 'planNotFound',
  'BUDGET.COMMITMENT_NOT_HELD': 'commitmentNotHeld',
  'BUDGET.COMMITMENT_REQUEST_OPEN': 'commitmentRequestOpen',
  'FINANCE.SETUP_INCOMPLETE': 'setupIncomplete',
  'BUDGET_ATTACHMENT.TYPE_NOT_ALLOWED': 'attachmentType',
  'BUDGET_ATTACHMENT.TOO_LARGE': 'attachmentSize',
  'BUDGET_ATTACHMENT.FILE_INVALID': 'attachmentInvalid',
  'BUDGET_ATTACHMENT.LIMIT_REACHED': 'attachmentLimit',
  'BUDGET_ATTACHMENT.UPLOAD_MISMATCH': 'attachmentUpload',
  'BUDGET_ATTACHMENT.UPLOAD_EXPIRED': 'attachmentUpload',
  'BUDGET_ATTACHMENT.UPLOAD_PENDING': 'attachmentUpload',
  'BUDGET_ATTACHMENT.NOT_AWAITING_UPLOAD': 'conflict',
  'BUDGET_ATTACHMENT.NOT_DISCARDABLE': 'conflict',
  'BUDGET_ATTACHMENT.ALREADY_REMOVED': 'conflict',
  'BUDGET_ATTACHMENT.NOT_FOUND': 'notFound',
  'COST_CENTER.DEPARTMENT_ALREADY_LINKED': 'departmentLinked',
  'EXCHANGE_RATE.ALREADY_RECORDED': 'rateExists',
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
