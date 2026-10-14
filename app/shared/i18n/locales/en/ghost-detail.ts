export const ghostDetail = {
  title: 'Ghost Seat Detail',
  documentTitle: 'Ghost Seat Detail | SaaS-Sentry',
  subtitle:
    'Review the potential unused license and take appropriate action based on the evidence and business context.',
  back: 'Back to Ghost Seat Review',
  summary: 'Application and employee summary',
  appDescription: 'Design and prototyping platform for product teams.',
  department: 'Department:',
  costCenter: 'Cost Center:',
  plan: 'License Plan',
  monthlyCost: 'Monthly Cost',
  perMonth: '{{value}} / month',
  notProvided: 'Not provided',
  sample:
    'Design preview. Identity, last activity, inactivity and confidence follow the selected review row because the two designs disagree. Additional Figma fields, costs, timeline and notes are illustrative; the first timeline date follows the review row. These figures are not a live policy assessment.',
  partial:
    'Only this review row was supplied. Plan, cost, usage evidence, timeline and notes have not been provided for this seat.',
  notFound: 'Ghost seat not found',
  notFoundHint: 'This record is not available in the supplied preview. Return to the review list to select a seat.',
  status: '{{tier}} · {{count, number}} days inactive',
  recordNavigation: 'Seat navigation',
  previous: 'Previous seat',
  next: 'Next seat',
  position: '{{index, number}} / {{total, number}}',
  outsideFilter: 'Outside current filters',
  detailTabs: 'Seat detail sections',
  tabs: { overview: 'Overview', evidence: 'Usage & Evidence', requests: 'Related Requests', audit: 'Audit Trail' },
  details: 'Details',
  activityValue: '{{date}} ({{count, number}} days inactive)',
  meaningful: 'Meaningful activity',
  integration: '{{source}} (via integration)',
  exactMatch: 'Exact email match',
  definitionHint:
    'Active when the user performs design-related actions, such as creating, editing or viewing files, commenting or sharing.',
  facts: {
    lastActivity: 'Last activity date',
    definition: 'Activity definition',
    source: 'Data source',
    identity: 'Identity match',
    coverage: 'Usage coverage',
    savings: 'Estimated saving (next renewal)',
    confidence: 'Confidence'
  },
  timelineTitle: 'Timeline',
  timeline: {
    active: 'Last active',
    activeHint: 'Opened a design file in Figma',
    detected: 'Detected as potential ghost seat',
    detectedHint: 'Sample G3 threshold (≥ 60 days inactive)',
    recommended: 'Recommendation created',
    recommendedHint: 'Sample rule engine (G3)',
    pending: 'Awaiting manager decision',
    pendingHint: 'Pending'
  },
  dateTime: '{{date}}, {{time}}',
  noTimeline: 'No timeline has been supplied for this seat.',
  notesTitle: 'Notes',
  addNote: 'Add a note...',
  save: 'Save',
  draftHint: 'Local draft only. Saving requires the backend workflow.',
  noNotes: 'No notes have been supplied for this seat.',
  notes: {
    managerRole: '(Manager)',
    manager: 'Please review with the team. If not needed, we will reclaim this license.',
    adminRole: '(IT Admin)',
    admin: 'Confirmed no recent usage from our side. Will wait for your decision.'
  },
  evidenceTitle: 'Evidence & Data',
  usageData: 'Usage data',
  available: 'Available',
  collected: 'Data collected',
  data: {
    activity: 'Last activity date',
    summary: 'Usage summary (aggregated)',
    events: 'Application events (limited)'
  },
  fullEvidence: 'View full evidence',
  noRawEvidence:
    'The design supplies only this evidence summary. Raw events, usage charts and integration logs have not been provided.',
  noEvidence: 'Usage evidence has not been supplied for this seat.',
  relatedTitle: 'Related Information',
  appDetails: 'Application details',
  assignedBy: 'Assigned by',
  hrSystem: 'HR System',
  requestMismatch:
    'REQ-1024 appears in the design, but the existing request belongs to a different employee. This relationship is unverified; opening that request is unavailable.',
  noAudit: 'No audit records have been supplied. The sample timeline is not an authoritative audit trail.',
  context: 'Evidence and review actions',
  takeAction: 'Take Action',
  actions: { reclaim: 'Reclaim License', keep: 'Keep (Add Note)', exempt: 'Exempt (Set Expiry)' },
  recommendation: {
    reclaim: 'This license is likely unused and can be reclaimed to optimize costs.',
    keep: 'Keep this license under monitoring.',
    exempt: 'Exempt this license from the current review.'
  },
  noReason: 'The design supplies this recommendation without supporting reasoning.',
  rule: 'Sample rule: {{rule}}. Review decisions remain unavailable in this preview.'
} as const
