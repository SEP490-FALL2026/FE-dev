/** APV-06: read-only audit trail of the Spending Approver's decisions. */
export const approverHistory = {
  amountChange: 'Amount before and after the adjustment',
  empty: 'No decisions match the filters.',
  group: {
    annual: 'Annual budget',
    exception: 'Exceptions & adjustments',
    spend: 'Regular spend'
  },
  listHint: '{{count}} decisions, newest first',
  listLabel: 'Spending Approver decision log',
  listTitle: 'Decision log',
  note: 'Note',
  outcome: {
    ADJUSTMENT_REQUESTED: 'Adjustment requested',
    APPROVED: 'Approved',
    REJECTED: 'Rejected'
  },
  readOnly: 'Read-only audit trail: recorded decisions cannot be edited or deleted.',
  reason: 'Reason',
  subtitle:
    'Records annual budget approvals, the approved version, the approver, the time and the reason for a rejection or adjustment; regular spend is kept apart from exceptions and budget adjustments.',
  summaryLabel: 'Decision summary',
  tiles: {
    adjustment: 'Adjustment requested',
    approved: 'Approved',
    decisions: 'Total decisions',
    rejected: 'Rejected'
  },
  title: 'Decision history',
  version: 'Version v{{version}}'
} as const
