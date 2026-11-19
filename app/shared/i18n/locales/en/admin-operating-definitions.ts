export const operatingDefinitions = {
  REQUEST_OPEN_NEW_LIMIT: {
    name: 'Weekly new access request limit',
    description: 'Maximum new access requests naming one person in a calendar week.'
  },
  RENEWAL_WINDOW_DAYS: {
    name: 'Continuation request window',
    description: 'Days before access ends during which a continuation may be requested.'
  },
  FORECAST_ERROR_THRESHOLD_PERCENT: {
    name: 'Cost forecast error threshold',
    description: 'Forecasts with a larger backtested error are withheld.'
  },
  BUDGET_RESERVE_DEFAULT_PERCENT: {
    name: 'Annual budget reserve percentage',
    description: 'Reserve percentage for new budget versions; only Finance can edit it.'
  },
  BUDGET_ZBB_KPI3_BELOW_PERCENT: {
    name: 'Budget usage explanation threshold',
    description: 'Finance-owned budget setting that is not currently used by the server.'
  },
  BUDGET_ZBB_PRICE_INCREASE_PERCENT: {
    name: 'Price increase explanation threshold',
    description: 'Finance-owned budget setting that is not currently used by the server.'
  },
  PERSONNEL_NOTICE_REVIEW_WORKING_DAYS: {
    name: 'Personnel notice review deadline',
    description: 'Working days allowed to review and process a personnel notice.'
  },
  DEPARTURE_REVOCATION_WORKING_DAYS: {
    name: 'Departure access revocation deadline',
    description: 'Working days after the last working day allowed to revoke access.'
  },
  TRANSFER_GRACE_WORKING_DAYS: {
    name: 'Transfer access grace period',
    description: 'Working days during which old department access remains available after transfer.'
  },
  TRANSFER_GRACE_REMINDER_WORKING_DAYS: {
    name: 'Transfer grace reminder lead time',
    description: 'Working days before grace ends when the employee is reminded.'
  },
  PROVISIONING_RETRY_COUNT: {
    name: 'Provisioning retry limit',
    description: 'Retries allowed before a failed task is handed to a technology administrator.'
  },
  SAAS_ISSUE_RESPONSE_WORKING_DAYS: {
    name: 'Software issue response deadline',
    description: 'Working days before an unaccepted software issue triggers a reminder.'
  },
  SAAS_ISSUE_REOPEN_WORKING_DAYS: {
    name: 'Software issue reopening window',
    description: 'Working days after resolution during which the reporter may reopen an issue.'
  },
  INVITATION_REMINDER_DAYS: {
    name: 'Invitation reminder delay',
    description: 'Days before reminding an invited person; must be shorter than the withdrawal delay.'
  },
  INVITATION_WITHDRAW_DAYS: {
    name: 'Invitation withdrawal delay',
    description: 'Days before withdrawing an unused invitation; must exceed the reminder delay.'
  },
  DOCUMENT_MAX_SIZE_MB: {
    name: 'Maximum document size',
    description: 'Maximum size in megabytes for supporting documents and budget attachments.'
  },
  RENEWAL_ALERT_DAYS_BEFORE_DEADLINE: {
    name: 'Subscription cancellation reminder days',
    description: 'Enter decreasing day offsets, one for each reminder before the cancellation deadline.'
  },
  DETECTION_THRESHOLD_DAYS: {
    name: 'Unused access detection thresholds',
    description: 'Three increasing day thresholds for monitoring, review and revocation recommendations.'
  },
  GHOST_SEAT_NEW_ASSIGNMENT_GRACE_DAYS: {
    name: 'New access assignment grace period',
    description: 'Access assigned within this period is excluded from unused access checks.'
  },
  GHOST_SEAT_DECISION_WORKING_DAYS: {
    name: 'Unused access decision deadline',
    description: 'Working days for a department decision; overdue items trigger reminders without automatic decisions.'
  },
  GHOST_SEAT_REVOCATION_GRACE_DAYS: {
    name: 'Unused access revocation grace period',
    description: 'Calendar days to wait before access revocation may be completed.'
  },
  RULE_SCHEDULE_G1_G2: {
    name: 'Internal data waste detection schedule',
    description: 'Choose how often waste checks based on internal records run.'
  },
  RULE_SCHEDULE_G3_G4: {
    name: 'Usage data waste detection schedule',
    description: 'Choose how often waste checks based on software usage data run.'
  },
  AI_ENABLED: {
    name: 'Enable artificial intelligence features',
    description: 'Turn off to stop all calls to the artificial intelligence service.'
  },
  AI_ACCESS_REQUEST_SUMMARY_ENABLED: {
    name: 'Approval queue summaries',
    description: 'Available only while the system artificial intelligence switch is enabled.'
  }
} as const
