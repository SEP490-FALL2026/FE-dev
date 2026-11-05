export const managerRequestForm = {
  commonDecision: 'Decision for the whole group',
  individualDecisions: 'Decide individually',
  personDecision: 'Decision for {{name}}',
  rejectionReason: 'Reason for rejection',
  inPlan: 'Within the annual plan',
  budgetLine: 'Budget plan line',
  chooseBudgetLine: 'Select a plan line',
  budgetWindow: 'Planned purchase: {{from}} – {{to}}',
  suggested: 'Matches the requested plan',
  overdue: 'Past the planned purchase window',
  endDates: 'Access end dates by person',
  endDateFor: 'Access end date for {{name}}',
  commonEndDate: 'Shared access end date',
  applyEndDate: 'Apply to everyone',
  endDateHint:
    'Required for contractors, freelancers and interns. The group check confirms each person’s requirements.',
  editEndDates: 'Edit end dates',
  termConfirmation: 'Reason for confirming a term over 12 months',
  decisionsSummary: '{{approved}} approved, {{rejected}} rejected',
  requirementsUnavailable: 'No pending need step assigned to you was found. Reload the queue to check.'
} as const
