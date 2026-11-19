/** Wording shared by the annual budget planning screens (Finance FIN-40 → FIN-47, Spending Approver APV-05). */
export const common = {
  backToList: 'Back to the list',
  filters: {
    apply: 'Apply filters',
    reset: 'Reset',
    title: 'Filters'
  },
  fiscalYear: 'Fiscal year {{year}}',
  group: {
    AI: 'AI assistants',
    COLLABORATION: 'Collaboration',
    DESIGN: 'Design',
    DEV_TOOLS: 'Developer tools',
    MARKETING: 'Marketing & sales',
    OTHER: 'Other'
  },
  stage: {
    APPROVED: 'Approved',
    IN_ANALYSIS: 'In analysis',
    NEEDS_INFO: 'Waiting for the Manager',
    NEGOTIATED: 'Analysis complete',
    REJECTED: 'Rejected',
    RETURNED: 'Returned',
    SENT: 'Sent to the Spending Approver',
    SUBMITTED: 'Newly submitted'
  },
  status: {
    ACTIVE: 'Active',
    APPROVED: 'Approved',
    DRAFT: 'Draft',
    EXPIRED: 'Expired',
    PENDING_APPROVAL: 'Pending approval',
    UNDER_FINANCE_REVIEW: 'Under Finance review'
  }
} as const
