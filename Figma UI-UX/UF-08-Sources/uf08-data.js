;(function initUF08Data(root, factory) {
  const value = factory()
  if (typeof module !== 'undefined' && module.exports) module.exports = value
  if (root) root.UF08_DATA = value
})(typeof window !== 'undefined' ? window : globalThis, function buildUF08Data() {
  function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value
    Object.values(value).forEach(deepFreeze)
    return Object.freeze(value)
  }

  const actor = {
    name: 'IT Admin',
    email: 'it-admin@company.com',
    initials: 'IT'
  }

  const subscriptions = {
    'SUB-GH-BIZ-01': {
      app: 'GitHub Business',
      plan: 'Business',
      purchased: 50,
      occupied: 48,
      renewalDate: '31/12/2026'
    },
    'SUB-FIG-PRO-02': {
      app: 'Figma Professional',
      plan: 'Professional',
      purchased: 32,
      occupied: 29,
      renewalDate: '15/01/2027'
    },
    'SUB-SLK-BP-01': {
      app: 'Slack Business+',
      plan: 'Business+',
      purchased: 50,
      occupied: 49,
      renewalDate: '01/02/2027',
      beforeApproval: { internalUsed: 49, providerUsed: 50, purchased: 50 },
      afterPurchase: { internalUsed: 50, providerUsed: 50, purchased: 51 }
    }
  }

  const tasks = {
    'PV-2041': {
      id: 'PV-2041',
      operation: 'Provision',
      app: 'GitHub Business',
      provider: 'GitHub',
      user: 'Nguyen Minh An',
      employeeId: 'EMP-0248',
      account: 'minhanh-dev',
      email: 'minh.an@company.com',
      channel: 'Connector',
      decisionSource: 'REQ-2026-0917-084',
      assignmentId: 'ASN-4901',
      subscriptionId: 'SUB-GH-BIZ-01',
      correlationId: 'COR-7A91-2041',
      createdAt: '17/09/2026 · 09:42 ICT',
      sla: '3 hours 18 mins left',
      endpoint: 'PUT /orgs/acme/memberships/minhanh-dev',
      idempotencyKey: 'assign:ASN-4901:github'
    },
    'PV-2042': {
      id: 'PV-2042',
      operation: 'Deprovision',
      app: 'Figma Professional',
      provider: 'Figma',
      user: 'Tran Minh',
      employeeId: 'EMP-0174',
      account: 'tran.minh@company.com',
      email: 'tran.minh@company.com',
      channel: 'Manual',
      decisionSource: 'OFF-2026-044',
      assignmentId: 'ASN-3872',
      subscriptionId: 'SUB-FIG-PRO-02',
      correlationId: 'COR-2D44-2042',
      createdAt: '17/09/2026 · 09:18 ICT',
      sla: '2 hours 54 mins left',
      instructions: [
        'Open organization Figma Admin Console.',
        'Locate tran.minh@company.com and verify identity.',
        'Remove member access and record event audit reference.'
      ]
    },
    'PV-2037': {
      id: 'PV-2037',
      operation: 'Provision',
      app: 'GitHub Business',
      provider: 'GitHub',
      user: 'Le Thu Ha',
      employeeId: 'EMP-0311',
      account: 'lethuha-dev',
      email: 'thu.ha@company.com',
      channel: 'Connector → Manual',
      decisionSource: 'REQ-2026-0916-219',
      assignmentId: 'ASN-4894',
      subscriptionId: 'SUB-GH-BIZ-01',
      correlationId: 'COR-1C73-2037',
      createdAt: '16/09/2026 · 16:04 ICT',
      sla: 'Overdue by 46 mins',
      endpoint: 'PUT /orgs/acme/memberships/lethuha-dev',
      idempotencyKey: 'assign:ASN-4894:github',
      attempts: [
        { number: 1, at: '17/09/2026 · 09:50', code: '502', result: 'Provider slow response' },
        { number: 2, at: '17/09/2026 · 10:02', code: '502', result: 'Provider slow response' },
        { number: 3, at: '17/09/2026 · 10:18', code: '504', result: 'Gateway timeout' },
        { number: 4, at: '17/09/2026 · 10:36', code: '502', result: 'Provider slow response' },
        { number: 5, at: '17/09/2026 · 11:08', code: '504', result: 'Gateway timeout' },
        { number: 6, at: '17/09/2026 · 12:12', code: '502', result: 'Provider slow response' }
      ]
    },
    'PV-2038': {
      id: 'PV-2038',
      operation: 'Provision',
      app: 'Figma Professional',
      provider: 'Figma',
      user: 'Pham Quang',
      employeeId: 'EMP-0293',
      account: 'pham.quang@company.com',
      email: 'pham.quang@company.com',
      channel: 'Connector',
      decisionSource: 'REQ-2026-0916-228',
      assignmentId: 'ASN-4895',
      subscriptionId: 'SUB-FIG-PRO-02',
      correlationId: 'COR-63BE-2038',
      createdAt: '16/09/2026 · 16:32 ICT',
      sla: 'Overdue by 18 mins',
      errorCode: 'FIGMA_TOKEN_EXPIRED'
    },
    'PV-2039': {
      id: 'PV-2039',
      operation: 'Provision',
      app: 'Slack Business+',
      provider: 'Slack',
      user: 'Doan Anh',
      employeeId: 'EMP-0276',
      account: 'doan.anh@company.com',
      email: 'doan.anh@company.com',
      channel: 'Connector',
      decisionSource: 'REQ-2026-0916-241',
      assignmentId: 'ASN-4897',
      subscriptionId: 'SUB-SLK-BP-01',
      correlationId: 'COR-8F20-2039',
      createdAt: '16/09/2026 · 17:10 ICT',
      sla: '28 mins left',
      errorCode: 'LICENSE_LIMIT_REACHED',
      approvalId: 'COST-2026-0917-016'
    }
  }

  const ledgers = {
    baseline: { manual: 8, automatic: 4, pending: 2, failed: 3, completedToday: 12 },
    pendingInvite: { manual: 8, automatic: 3, pending: 3, failed: 3, completedToday: 12 },
    manualCompleted: { manual: 7, automatic: 3, pending: 3, failed: 3, completedToday: 13 },
    retrying: { manual: 7, automatic: 4, pending: 3, failed: 2, completedToday: 13 },
    retryExhausted: { manual: 7, automatic: 3, pending: 3, failed: 3, completedToday: 13 },
    manualTransferred: { manual: 8, automatic: 3, pending: 3, failed: 2, completedToday: 13 },
    purchaseReturned: { manual: 8, automatic: 4, pending: 3, failed: 1, completedToday: 13 }
  }

  const screens = [
    {
      id: '01',
      title: 'Provisioning Execution Queue',
      subtitle: 'Track all access grant and revocation tasks in a unified state machine.',
      state: 'overview',
      taskId: 'PV-2041',
      ledgerKey: 'baseline',
      taskStatus: 'queued'
    },
    {
      id: '02',
      title: 'Automated Task Ready',
      subtitle: 'Verify Assignment and connector credentials before execution.',
      state: 'auto-ready',
      taskId: 'PV-2041',
      ledgerKey: 'baseline',
      taskStatus: 'queued',
      actions: ['execute']
    },
    {
      id: '03',
      title: 'Connector Executing',
      subtitle: 'Worker is calling provider API with idempotency lock.',
      state: 'connector-running',
      taskId: 'PV-2041',
      ledgerKey: 'baseline',
      taskStatus: 'running',
      attempt: 1,
      maxAttempts: 6,
      actions: []
    },
    {
      id: '04',
      title: 'Invitation Sent — Pending Acceptance',
      subtitle: 'API success confirms invitation sent; actual access does not yet exist.',
      state: 'pending-invite',
      taskId: 'PV-2041',
      ledgerKey: 'pendingInvite',
      taskStatus: 'pending-acceptance',
      membership: 'pending',
      provisioned: false,
      actions: ['open-reconciliation']
    },
    {
      id: '05',
      title: 'Membership Reconciliation Handoff',
      subtitle: 'Retain task in pending state until UF-14 verifies active member.',
      state: 'reconciliation-handoff',
      taskId: 'PV-2041',
      ledgerKey: 'pendingInvite',
      taskStatus: 'pending-acceptance',
      provisioned: false,
      handoff: 'UF-14',
      actions: ['open-reconciliation', 'view-audit']
    },
    {
      id: '06',
      title: 'Unclaimed Manual Task',
      subtitle: 'Figma revocation requires IT Admin manual action on provider admin console.',
      state: 'manual-detail',
      taskId: 'PV-2042',
      ledgerKey: 'pendingInvite',
      taskStatus: 'waiting-manual',
      actions: ['claim']
    },
    {
      id: '07',
      title: 'Manual Action in Progress',
      subtitle: 'IT Admin has claimed task and is executing controlled checklist.',
      state: 'manual-claimed',
      taskId: 'PV-2042',
      ledgerKey: 'pendingInvite',
      taskStatus: 'in-progress',
      claimedBy: 'IT Admin',
      claimedAt: '17/09/2026 · 10:21 ICT',
      actions: ['confirm-evidence']
    },
    {
      id: '08',
      title: 'Confirm Manual Completion',
      subtitle: 'Audit evidence and verified auditor are mandatory before completing task.',
      state: 'manual-confirm',
      taskId: 'PV-2042',
      ledgerKey: 'pendingInvite',
      taskStatus: 'in-progress',
      evidenceRequired: true,
      actions: ['cancel', 'complete-manual']
    },
    {
      id: '09',
      title: 'Manual Revocation Complete',
      subtitle: 'Account deprovisioned at provider; seat returned to available pool.',
      state: 'manual-success',
      taskId: 'PV-2042',
      ledgerKey: 'manualCompleted',
      taskStatus: 'completed',
      seatReleased: true,
      completedBy: 'IT Admin',
      completedAt: '17/09/2026 · 10:29 ICT',
      evidenceId: 'FIG-EVT-772904',
      actions: ['view-audit']
    },
    {
      id: '10',
      title: 'Failed Tasks Queue',
      subtitle: 'Classify errors to retry properly and route decisions to correct owner.',
      state: 'failure-overview',
      taskId: 'PV-2037',
      ledgerKey: 'manualCompleted',
      taskStatus: 'failed',
      actions: ['open-task']
    },
    {
      id: '11',
      title: 'Transient Error Retrying',
      subtitle: 'System retries with exponential backoff and transparent next run time.',
      state: 'retrying',
      taskId: 'PV-2037',
      ledgerKey: 'retrying',
      taskStatus: 'running',
      errorClass: 'temporary',
      attempt: 3,
      maxAttempts: 6,
      nextAttemptAt: '17/09/2026 · 10:36 ICT',
      actions: ['view-technical']
    },
    {
      id: '12',
      title: 'All Six Automatic Retries Exhausted',
      subtitle: 'Automated attempts stopped; task returns to queue for human decision.',
      state: 'retry-exhausted',
      taskId: 'PV-2037',
      ledgerKey: 'retryExhausted',
      taskStatus: 'failed',
      errorClass: 'temporary',
      attempt: 6,
      maxAttempts: 6,
      nextAttemptAt: null,
      actions: ['switch-manual', 'close-with-reason']
    },
    {
      id: '13',
      title: 'Switch Task to Manual Execution',
      subtitle: 'Preserves Task ID and all six retry attempts when switching channels.',
      state: 'switch-manual',
      taskId: 'PV-2037',
      ledgerKey: 'manualTransferred',
      taskStatus: 'waiting-manual',
      preservedAttempts: 6,
      actions: ['cancel', 'confirm-switch']
    },
    {
      id: '14',
      title: 'Authentication Error — No Retry',
      subtitle: 'Figma credentials expired; automated retries cannot fix credentials.',
      state: 'authentication-failure',
      taskId: 'PV-2038',
      ledgerKey: 'manualTransferred',
      taskStatus: 'failed',
      errorClass: 'authentication',
      actions: ['repair-connection', 'switch-manual', 'close-with-reason']
    },
    {
      id: '15',
      title: 'License Limit Reached',
      subtitle: 'Task awaits additional seat approval; IT Admin does not approve budget.',
      state: 'capacity-wait',
      taskId: 'PV-2039',
      ledgerKey: 'manualTransferred',
      taskStatus: 'waiting-cost-approval',
      errorClass: 'capacity',
      financeStatus: 'not-an-approver',
      provisioned: false,
      actions: ['view-approval']
    },
    {
      id: '16',
      title: 'Licenses Purchased — Resumed Execution',
      subtitle: 'IT resumes provisioning immediately while Finance logs commitment in parallel.',
      state: 'capacity-returned',
      taskId: 'PV-2039',
      ledgerKey: 'purchaseReturned',
      taskStatus: 'queued',
      financeStatus: 'recording-in-parallel',
      provisioned: false,
      actions: ['execute']
    }
  ]

  const queueRows = [
    { id: 'PV-2041', status: 'Pending Acceptance', tone: 'pending' },
    { id: 'PV-2042', status: 'Manual Action', tone: 'manual' },
    { id: 'PV-2037', status: 'Transient Error', tone: 'danger' },
    { id: 'PV-2038', status: 'Auth Error', tone: 'danger' },
    { id: 'PV-2039', status: 'Capacity Limit', tone: 'warning' }
  ]

  return deepFreeze({ actor, subscriptions, tasks, ledgers, screens, queueRows })
})
