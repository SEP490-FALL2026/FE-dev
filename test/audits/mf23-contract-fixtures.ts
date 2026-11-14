// Synthetic test data based on the configured live OpenAPI schema; no production data.
import type {
  TaskResponseDtoDataTask,
  OffboardingDetailResponseDtoData,
  TransferDetailResponseDtoData,
  NoticeDetailResponseDtoData
} from '~/shared/api/generated/model'

export const auditTask: TaskResponseDtoDataTask = {
  id: '11111111-1111-4111-8111-111111111111',
  kind: 'REVOKE',
  channel: 'MANUAL',
  status: 'IN_PROGRESS',
  requestId: null,
  assignmentId: '11111111-1111-4111-8111-111111111111',
  beneficiary: null,
  plan: {
    planId: '11111111-1111-4111-8111-111111111111',
    planName: 'Audit fixture',
    applicationId: '11111111-1111-4111-8111-111111111111',
    applicationName: 'Legacy K1 application',
    provisioningType: 'K1',
    preRevocationNote: null
  },
  subscriptionId: null,
  accountIdentifier: 'Audit fixture',
  defaultResponsibleEmployeeId: null,
  inGeneralQueue: false,
  dueOn: null,
  notBefore: null,
  claimableNow: false,
  createdAt: '2026-11-14T10:00:00Z',
  claimedBy: null,
  claimedAt: null,
  completedAt: null,
  failedAt: null,
  failureKind: null,
  attempts: 1,
  maxAttempts: 3,
  nextRetryAt: null,
  availableDecisions: [],
  closedAt: null,
  revocation: null,
  purchase: null,
  elapsedSeconds: 0,
  steps: [],
  doneWhen: null,
  completedBy: null,
  evidence: null,
  failedBy: null,
  failureReason: null,
  lastError: null,
  handedOffBy: null,
  handedOffAt: null,
  handOffEvidence: null,
  closedBy: null,
  closeReason: null,
  k1Checklist: {
    variant: 'DEPARTURE',
    items: [
      {
        code: 'MAILBOX_PASSWORD_RESET',
        label: 'MAILBOX_PASSWORD_RESET',
        order: 1,
        doneAt: null
      },
      {
        code: 'SOFTWARE_FORGOT_PASSWORD',
        label: 'SOFTWARE_FORGOT_PASSWORD',
        order: 2,
        doneAt: null
      },
      {
        code: 'SESSIONS_SIGNED_OUT',
        label: 'SESSIONS_SIGNED_OUT',
        order: 3,
        doneAt: null
      },
      {
        code: 'RENEWAL_DISABLED',
        label: 'RENEWAL_DISABLED',
        order: 4,
        doneAt: null
      },
      {
        code: 'EVIDENCE_RECORDED',
        label: 'EVIDENCE_RECORDED',
        order: 5,
        doneAt: null
      },
      {
        code: 'MAILBOX_LOCKED',
        label: 'MAILBOX_LOCKED',
        order: 6,
        doneAt: null
      }
    ]
  }
}

export const auditCase: NonNullable<OffboardingDetailResponseDtoData> = {
  id: '11111111-1111-4111-8111-111111111111',
  employee: {
    id: '11111111-1111-4111-8111-111111111111',
    employeeCode: 'Audit fixture',
    fullName: 'Audit fixture'
  },
  state: 'HANDING_OVER',
  accessBlockMode: 'WITH_LAST_DAY',
  lastWorkingDay: '2026-11-12',
  handoverDueOn: null,
  pastLastDay: false,
  accessBlocked: true,
  accessBlockedFrom: '2026-11-13',
  heldRights: 0,
  revocation: {
    dueOn: null,
    overdue: false,
    rightsWithoutCompletedTask: 0
  },
  accountLockMissing: false,
  closed: false,
  roleFlags: {
    SUPER_ADMIN_HOLDER: false,
    FINANCE: false,
    SPENDING_APPROVER: false,
    IT_ADMIN_IN_CHARGE: false,
    DEPARTMENT_HEAD: false,
    WORKSPACE_OWNER: false
  },
  department: null,
  priorWorkState: 'WORKING',
  departureEffectiveOn: '2026-11-13',
  groundsNote: null,
  headSuccessor: null,
  recordedByAppUserId: null,
  recordedByProcedure: false,
  recordedAt: '2026-11-14T10:00:00Z',
  left: null,
  cancellation: null,
  accountLock: {
    recordedAt: '2026-11-14T10:00:00Z',
    recordedByAppUserId: '11111111-1111-4111-8111-111111111111',
    note: 'Company account blocked'
  },
  mailboxLock: null,
  itHandover: null,
  closure: null,
  checklist: null,
  blockers: {},
  warnings: {
    departmentWithoutHeadFrom: null,
    accountLockNotRecorded: false,
    workspaces: {},
    registered: {}
  }
}

export const auditTransfer: NonNullable<TransferDetailResponseDtoData> = {
  id: '11111111-1111-4111-8111-111111111111',
  employee: {
    id: '11111111-1111-4111-8111-111111111111',
    employeeCode: 'Audit fixture',
    fullName: 'Audit fixture'
  },
  from: {
    department: {
      id: '11111111-1111-4111-8111-111111111111',
      code: 'Audit fixture',
      name: 'Audit fixture'
    }
  },
  to: {
    department: {
      id: '11111111-1111-4111-8111-111111111111',
      code: 'Audit fixture',
      name: 'Audit fixture'
    }
  },
  effectiveOn: '2026-11-16',
  status: 'EFFECTIVE',
  phase: 'IN_GRACE',
  grace: {
    endsOn: '2026-11-20',
    reminderOn: '2026-11-18'
  },
  groundsNote: null,
  headSuccessor: null,
  recordedByAppUserId: null,
  recordedByProcedure: false,
  recordedAt: '2026-11-14T10:00:00Z',
  effectiveAt: null,
  cancellation: null,
  closure: null,
  oldRights: [
    {
      assignmentId: '11111111-1111-4111-8111-111111111111',
      application: {
        id: '11111111-1111-4111-8111-111111111111',
        name: 'Legacy Jira'
      },
      plan: {
        id: '11111111-1111-4111-8111-111111111111',
        name: 'Standard'
      },
      provisioningType: 'K2',
      state: 'HELD',
      revocation: null,
      regranted: false
    }
  ],
  commitmentsReleased: [],
  snapshot: null,
  itHandover: null
}

export const auditNotice: NonNullable<NoticeDetailResponseDtoData> = {
  id: '11111111-1111-4111-8111-111111111111',
  code: 'Audit fixture',
  employee: {
    id: '11111111-1111-4111-8111-111111111111',
    employeeCode: 'Audit fixture',
    fullName: 'Audit fixture'
  },
  kind: 'DEPARTURE',
  proposedOn: '2026-12-01',
  status: 'PENDING_VERIFICATION',
  dueOn: '2026-12-02',
  overdue: false,
  priority: false,
  note: null,
  sender: {
    id: '11111111-1111-4111-8111-111111111111',
    employeeCode: 'Audit fixture',
    fullName: 'Audit fixture'
  },
  targetDepartment: null,
  createdAt: '2026-11-14T10:00:00Z',
  defaultItAdminEmployeeId: null,
  rejectReason: null,
  recordedEvent: null,
  handledAt: null,
  overdueNoticedAt: null,
  verification: null
}
