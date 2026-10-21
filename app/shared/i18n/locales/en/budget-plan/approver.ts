/** APV-05: the Spending Approver approves, rejects or returns department budgets Finance sent. */
export const approver = {
  actions: {
    ADJUSTMENT_REQUESTED: 'Ask Finance to adjust',
    APPROVED: 'Approve budget',
    REJECTED: 'Reject'
  },
  approvedTotal: 'Approved total',
  base: 'Base cost (SaaS after review)',
  buffer: 'Buffer ({{rate}})',
  colBuffer: 'Buffer',
  colDepartment: 'Department',
  colDifference: 'Difference',
  colFinance: 'Finance amount',
  colFinanceTotal: 'Finance total',
  colReason: 'Reason for the cut',
  colRequested: 'Manager requested',
  colSentAt: 'Sent',
  colSoftware: 'Software',
  colStage: 'Status',
  colVersion: 'Version',
  confirm: {
    ADJUSTMENT_REQUESTED: 'Send adjustment request',
    REJECTED: 'Confirm rejection'
  },
  decisionHint:
    "Approving locks the department's budget for the new year. Asking for an adjustment sends it back to Finance to resend a new version. Rejecting ends this version. The last two need a reason.",
  decisionTitle: 'Decision',
  history: {
    bufferRate: 'Buffer rate {{rate}}',
    empty: 'No change has been recorded for this budget yet.',
    hint: "Finance's cuts, buffer and reviews, and earlier decisions, newest first.",
    listLabel: 'Budget change history of {{department}}',
    title: 'Change history'
  },
  lineDetail: '{{plan}} · {{group}} · {{users}} users × {{months}} months',
  linesHint: "The Manager's request compared with Finance's analysis and cuts for each software.",
  linesTitle: "Manager's request and Finance's analysis",
  managerNeed: 'Need: {{need}}',
  noReason: 'Kept as requested',
  notice: {
    by: '{{by}} · {{time}}',
    effect: {
      ADJUSTMENT_REQUESTED: 'The budget went back to Finance to adjust and resend a new version.',
      APPROVED: 'The {{year}} budget of {{department}} is now locked.',
      REJECTED: 'This version is closed; Finance must prepare a new submission to resubmit.'
    },
    reason: 'Reason: {{reason}}',
    title: {
      ADJUSTMENT_REQUESTED: 'Asked Finance to adjust version v{{version}}',
      APPROVED: 'Approved version v{{version}}',
      REJECTED: 'Rejected version v{{version}}'
    }
  },
  openDetail: 'View',
  openDetailFor: 'View the budget of {{department}}',
  other: 'Other costs',
  otherRequested: 'Manager requested {{amount}}',
  outcome: {
    ADJUSTMENT_REQUESTED: 'Adjustment requested',
    APPROVED: 'Approved',
    REJECTED: 'Rejected'
  },
  pending: 'Budgets awaiting approval',
  pendingTotal: 'Total awaiting approval',
  previousNone: 'No budget last year',
  previousYear: 'Approved for {{year}}',
  reasonLabel: {
    ADJUSTMENT_REQUESTED: 'What Finance should adjust',
    REJECTED: 'Reason for rejecting'
  },
  reasonRequired: 'A reason is required.',
  requestedTotal: 'Manager requested total',
  sentBy: 'Sent by Finance on {{time}}',
  subtitle:
    'Department budgets for {{year}} submitted by Finance. Approve to lock them, ask Finance to adjust, or reject with a reason.',
  summaryLabel: 'Budget submission summary',
  title: 'Annual budget approval',
  total: 'Total budget for approval',
  totalsHint: 'Base cost + buffer + other costs.',
  totalsTitle: 'Department budget total',
  version: 'v{{version}}',
  versionLabel: 'Version v{{version}}',
  vsPrevious: 'Change from last year'
} as const
