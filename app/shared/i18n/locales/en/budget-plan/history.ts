/** FIN-47: read-only audit trail of Finance and Spending Approver budget decisions. */
export const history = {
  bufferRate: 'Buffer rate {{rate}}',
  empty: 'No decisions match the filters.',
  kind: {
    ADJUSTMENT_APPROVAL: 'Budget adjustment decision',
    EXCEPTION_APPROVAL: 'Exception decision',
    SPEND_APPROVAL: 'Regular spend decision',
    ADJUSTMENT: 'Adjustment request',
    APPROVAL: 'Approval result',
    BUDGET_CHANGE: 'Budget change',
    BUFFER: 'Buffer',
    CUT: 'Cut',
    EXCEPTION: 'Exception handling',
    REVIEW: 'Estimate review'
  },
  listHint: '{{count}} entries, newest first',
  listLabel: 'Budget decision log',
  listTitle: 'Decision log',
  readOnly: 'Read-only audit trail: entries cannot be edited or deleted.',
  subtitle: 'Records every Finance estimate adjustment, cut reason, buffer, approval result and budget change.',
  title: 'Budget decision history'
} as const
