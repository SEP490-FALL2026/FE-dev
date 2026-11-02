// Labels for confirmed keys only. The API owns which parameters appear in the list.
export const OPERATING_PARAMETER_LABELS = {
  APPROVAL_SLA_WORKING_DAYS: 'approvalSla',
  BACKLOG_ALERT_THRESHOLD: 'backlogAlert',
  ACTIVITY_WINDOW_MINUTES: 'activityWindow',
  FISCAL_YEAR_START_MONTH: 'fiscalYearStart',
  SPEND_SUBMISSION_WAIT_WORKING_DAYS: 'spendSubmissionWait',
  TRANSFER_REVIEW_WORKING_DAYS: 'transferReview'
} as const

export function isKnownParameterKey(key: string): key is keyof typeof OPERATING_PARAMETER_LABELS {
  return Object.hasOwn(OPERATING_PARAMETER_LABELS, key)
}
