export const requestProgress = {
  title: 'Processing progress',
  step: 'Step {{number}}',
  sentAt: 'Submitted',
  startedAt: 'Started',
  endedAt: 'Ended',
  stages: {
    SUBMITTED: 'Submit request',
    NEED: 'Need approval',
    IT_ASSESSMENT: 'IT assessment',
    QUEUE_WAIT: 'Await spending submission',
    SPEND_DECISION: 'Spending approval',
    GRANT: 'Grant access'
  },
  phases: {
    closed: 'Processed',
    active: 'In progress',
    recorded: 'Recorded',
    rejected: 'Rejected',
    failed: 'Processing failed',
    stopped: 'Stopped',
    revision: 'Awaiting requester revision',
    closing: 'Awaiting IT closure'
  }
} as const
