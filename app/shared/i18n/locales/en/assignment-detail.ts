export const assignmentDetail = {
  title: 'Assignment Details',
  documentTitle: 'Assignment Details | SaaS-Sentry',
  back: 'Back to Access Review',
  cycle: 'Q{{quarter}} {{year}} Audit',
  sample:
    'Sample assignment from the Q2 2026 Manager review. Dates, activity and risk match the list; business purpose and project are supplied design examples.',
  partial:
    'Sample assignment from the Q2 2026 Manager review. Business purpose and project details were not supplied for this assignment.',
  employee: 'Assigned employee',
  team: '{{name}} Team',
  fields: {
    assigned: 'Assigned On',
    plan: 'Plan',
    activity: 'Last Activity',
    purpose: 'Business Purpose',
    project: 'Project',
    costCenter: 'Cost Center'
  },
  purposeAlpha: 'UI/UX design for Project Alpha',
  projectAlpha: 'Project Alpha',
  missing: 'Not supplied',
  lowRiskHint: 'Active usage within the last 30 days in the sample review cycle.',
  riskSampleHint: 'Risk level supplied by the sample review. No detailed policy explanation was provided.',
  decision: 'Your Decision',
  chooseDecision: 'Choose an access decision',
  choices: { keep: 'Keep', reclaim: 'Reclaim', exempt: 'Exempt' },
  choiceHints: { keep: 'Access is still needed', reclaim: 'No longer needed', exempt: 'Keep temporarily' },
  reason: 'Reason',
  reasonPlaceholder: 'Add reason for your decision...',
  reasonCount: '{{used}}/{{limit}}',
  info: 'About access review decisions',
  infoText:
    'Keep confirms continued need. Reclaim requests removal. Exempt proposes a temporary exception. Final permission checks and workflow transitions must be enforced by the backend.',
  draftHint:
    'Your choice and reason are unsaved drafts for this screen. Submission is unavailable until the review API is connected; no access or review status is changed.',
  submit: 'Submit Decision',
  notFound: 'Assignment not found',
  notFoundHint:
    'This assignment is not present in the supplied review records. Return to the list to choose an available assignment.',
  openDetails: 'Open assignment details'
} as const
