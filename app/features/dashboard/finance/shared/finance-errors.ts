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
  'BUDGET.CYCLE_EXISTS': 'cycleExists',
  'BUDGET.CYCLE_YEAR_PAST': 'cycleYearPast',
  'BUDGET.CYCLE_DEADLINES_INVALID': 'cycleDeadlinesInvalid',
  'BUDGET_CYCLE.NOT_DRAFT': 'cycleNotDraft',
  'BUDGET_CYCLE.DEADLINE_PASSED': 'cycleDeadlinePassed',
  'BUDGET_CYCLE.ALREADY_OPEN': 'cycleAlreadyOpen',
  'BUDGET_CYCLE.LOCKED': 'cycleLocked',
  'BUDGET.CYCLE_REASON_REQUIRED': 'cycleReasonRequired',
  'BUDGET.CYCLE_NOT_FOUND': 'cycleNotFound',
  'BUDGET.BASE_REASON_REQUIRED': 'baseReasonRequired',
  'BUDGET.RESERVE_REASON_REQUIRED': 'reserveReasonRequired',
  'BUDGET.BASELINE_VERSION_NOT_ALLOWED': 'baselineNotAllowed',
  'BUDGET.CYCLE_CURRENCY_MISMATCH': 'cycleCurrencyMismatch',
  'BUDGET_VERSION.OVER_CEILING': 'versionOverCeiling',
  'BUDGET_VERSION.ATTACHMENT_REQUIRED': 'versionAttachmentRequired',
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
  'BUDGET_REVIEW.MONTH_NOT_ENDED': 'periodNotEnded',
  'BUDGET_REVIEW.ALREADY_SIGNED': 'reviewAlreadySigned',
  'BUDGET_REVIEW.NOT_FOUND': 'reviewNotFound',
  'BUDGET_REVIEW.PERIOD_EXISTS': 'reviewPeriodExists',
  'BUDGET_REVIEW.SEAT_MONTHS_NOT_READY': 'reviewSeatMonthsNotReady',
  'BUDGET_REVIEW.NO_BUDGET_FOR_YEAR': 'reviewNoBudgetForYear',
  'SPEND.REVIEW_NOT_FOUND': 'notFound',
  'BUDGET_ADJUSTMENT.CYCLE_NOT_LOCKED': 'adjustmentCycleNotLocked',
  'BUDGET_CYCLE.NOT_OPEN': 'adjustmentCycleNotOpen',
  'BUDGET_ADJUSTMENT.INVALID_SHAPE': 'adjustmentShape',
  'BUDGET_ADJUSTMENT.OVER_UNALLOCATED': 'adjustmentLimit',
  'BUDGET_ADJUSTMENT.BELOW_FORECAST_FLOOR': 'adjustmentLimit',
  'BUDGET_ADJUSTMENT.OVER_BASE': 'adjustmentLimit',
  'BUDGET_ADJUSTMENT.OVER_REMAINING': 'adjustmentLimit',
  'BUDGET_ADJUSTMENT.NO_BUDGET': 'adjustmentNoBudget',
  'BUDGET_ADJUSTMENT.VERSION_IN_FLIGHT': 'adjustmentVersionInFlight',
  'BUDGET_ADJUSTMENT.BUDGET_IN_PREPARATION': 'adjustmentInPreparation',
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
  'COST_CENTER.CODE_TAKEN': 'costCenterCodeTaken',
  'COST_CENTER.NAME_INVALID': 'costCenterName',
  'COST_CENTER.NAME_RESERVED': 'costCenterName',
  'COST_CENTER.IN_USE': 'costCenterInUse',
  'COST_CENTER.DEPARTMENT_NOT_ACTIVE': 'costCenterDepartment',
  'COST_CENTER.NOT_FOUND': 'notFound',
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
