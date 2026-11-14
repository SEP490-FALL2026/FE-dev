export const itTransfers = {
  title: 'Department transfers',
  hint: 'Old rights stay for a 5-working-day grace period from the effective day. After it, the system opens revocation tasks for the IT Admin of the new department and closes the transfer itself.',
  back: 'Back to transfers',
  refresh: 'Refresh transfer',
  details: 'View transfer',
  all: 'All statuses',
  status: 'Status',
  phase: 'Phase',
  employeeId: 'Employee ID',
  employeePlaceholder: 'Official employee UUID (optional)',
  from: 'From department',
  to: 'To department',
  effectiveOn: 'Effective on',
  effectiveFrom: 'Effective from',
  effectiveTo: 'Effective to',
  graceEndsBefore: 'Grace ends before',
  graceEndsBeforeHint: 'Transfers whose grace period ends before this day (the day itself excluded).',
  graceEndsOn: 'Grace period ends',
  graceReminderOn: 'Reminder sent on',
  graceUntil: 'Grace until {{date}}',
  commitmentsReleased: 'Returned to the old department’s budget',
  applyFilters: 'Apply filters',
  closedAt: 'Closed on {{at}}',
  closedBySystem: 'Closed by the system on {{at}}',
  supersededAt: 'Taken over by a departure case on {{at}}; its revocation deadline applies to the old rights',
  unknown: 'Not available',
  oldRights: 'Old rights',
  snapshotOn: 'Snapshot of {{date}}',
  noOldRights: 'No old rights to revoke.',
  regranted: 'Granted again on the same subscription; not revoked',
  revocationTask: 'Revocation task: {{status}}',
  values: {
    PENDING: 'Scheduled',
    EFFECTIVE: 'Effective',
    CANCELLED: 'Cancelled'
  },
  phases: {
    PENDING: 'Scheduled',
    IN_GRACE: 'In grace period',
    REVOKING: 'Revoking old rights',
    CLOSED: 'Closed',
    CANCELLED: 'Cancelled',
    SUPERSEDED: 'Taken over by departure'
  },
  phaseHints: {
    IN_GRACE:
      'The person keeps the old rights until the grace period ends and may request the same software again in the new department.',
    REVOKING:
      'Revocation tasks are open in the queue of the new department’s IT Admin. The transfer closes when the last one is completed.'
  },
  rightStates: {
    HELD: 'Still held',
    REVOKING: 'Being revoked',
    ENDED: 'Ended'
  },
  outcomes: {
    REVOKED: 'Revoked',
    ENDED: 'Ended',
    REGRANTED: 'Granted again',
    TAKEN_OVER: 'Taken over by the new grant'
  },
  taskStates: {
    QUEUED: 'Queued',
    IN_PROGRESS: 'In progress',
    RETRY_SCHEDULED: 'Retry scheduled',
    FAILED: 'Failed',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    CLOSED_FAILED: 'Closed after failure'
  }
} as const
