(function initUF09Data(globalScope) {
  'use strict';

  function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    Object.freeze(value);
    Object.values(value).forEach(deepFreeze);
    return value;
  }

  function createUF09Data() {
    const actor = {
      role: 'IT Admin',
      name: 'IT Admin',
      email: 'it-admin@company.com',
      initials: 'IT',
    };

    const employee = {
      id: 'EMP-0174',
      name: 'Tran Minh',
      email: 'tran.minh@company.com',
      title: 'Marketing Operations Lead',
      costCenter: 'Marketing · CC-MKT-01',
      manager: 'Le Thu Ha · EMP-0311',
      initialStatus: 'Active',
      handoverStatus: 'Handover in Progress',
      finalStatus: 'Terminated',
      avatar: 'TM',
    };

    const offboarding = {
      id: 'OFF-2026-044',
      createdAt: '10/09/2026 · 09:12 ICT',
      createdBy: 'IT Admin · it-admin@company.com',
      lastWorkingDate: '17/09/2026',
      handoverDueAt: '16/09/2026 · 17:00 ICT',
      handoverConfirmedBy: 'Le Thu Ha · EMP-0311',
      handoverConfirmedAt: '16/09/2026 · 16:42 ICT',
      deletionDueDate: '17/10/2026',
      deletionJobId: 'JOB-RET-20261017-041',
      deletionCompletedAt: '17/10/2026 · 02:14 ICT',
      usageDetailCount: 12480,
      anonymizedSummaryCount: 5,
      commonReason: 'Employee Offboarding · OFF-2026-044',
    };

    const directReports = [
      { id: 'EMP-0384', name: 'Nguyen Mai Anh', role: 'Campaign Specialist' },
      { id: 'EMP-0412', name: 'Pham Quoc Bao', role: 'Marketing Analyst' },
      { id: 'EMP-0461', name: 'Vo Gia Han', role: 'Content Executive' },
    ];

    const successions = [
      {
        type: 'Direct Manager',
        scope: '3 employees',
        previous: 'Tran Minh · EMP-0174',
        successor: 'Nguyen Hoang Long · EMP-0216',
        effectiveFrom: '18/09/2026',
      },
      {
        type: 'Business Owner',
        scope: 'Figma Professional',
        previous: 'Tran Minh · EMP-0174',
        successor: 'Le Thu Ha · EMP-0311',
        effectiveFrom: '18/09/2026',
      },
    ];

    const device = {
      id: 'DEV-LT-0174',
      label: 'Dell Latitude 7440',
      currentStatus: 'Active',
      effectiveTo: '17/09/2026 · 18:00 ICT',
      guardResult: 'DEVICE_REGISTRATION_EXPIRED',
      lastReceivedAt: '17/09/2026 · 17:42 ICT',
    };

    const assignments = [
      {
        app: 'Microsoft 365 E3',
        short: 'M365',
        assignmentId: 'ASN-3868',
        subscriptionId: 'SUB-M365-E3-01',
        taskId: 'PV-2043',
        employeeId: employee.id,
        decisionSource: offboarding.id,
        channel: 'Connector',
        evidenceId: 'MS365-EVT-771992',
        evidenceAt: '17/09/2026 · 09:41 ICT',
        savingType: 'At Next Renewal',
        saving: '4,200,000 VND/yr',
        tone: 'blue',
      },
      {
        app: 'Slack Business+',
        short: 'SL',
        assignmentId: 'ASN-3869',
        subscriptionId: 'SUB-SLK-BP-01',
        taskId: 'PV-2044',
        employeeId: employee.id,
        decisionSource: offboarding.id,
        channel: 'Connector',
        evidenceId: 'SLK-EVT-772011',
        evidenceAt: '17/09/2026 · 09:48 ICT',
        savingType: 'Immediate Realization',
        saving: '320,000 VND/mo',
        tone: 'purple',
      },
      {
        app: 'GitHub Business',
        short: 'GH',
        assignmentId: 'ASN-3870',
        subscriptionId: 'SUB-GH-BIZ-01',
        taskId: 'PV-2045',
        employeeId: employee.id,
        decisionSource: offboarding.id,
        channel: 'Connector',
        evidenceId: 'GH-EVT-772086',
        evidenceAt: '17/09/2026 · 10:02 ICT',
        savingType: 'Immediate Realization',
        saving: '420,000 VND/mo',
        tone: 'gray',
      },
      {
        app: 'Zoom Pro',
        short: 'ZM',
        assignmentId: 'ASN-3871',
        subscriptionId: 'SUB-ZOOM-PRO-01',
        taskId: 'PV-2046',
        employeeId: employee.id,
        decisionSource: offboarding.id,
        channel: 'Manual',
        evidenceId: 'ZM-EVT-772733',
        evidenceAt: '17/09/2026 · 10:17 ICT',
        savingType: 'At Next Renewal',
        saving: '3,600,000 VND/yr',
        tone: 'blue',
      },
      {
        app: 'Figma Professional',
        short: 'FI',
        assignmentId: 'ASN-3872',
        subscriptionId: 'SUB-FIG-PRO-02',
        taskId: 'PV-2042',
        employeeId: employee.id,
        decisionSource: offboarding.id,
        channel: 'Manual',
        evidenceId: 'FIG-EVT-772904',
        evidenceAt: '17/09/2026 · 10:29 ICT',
        savingType: 'At Next Renewal',
        saving: '5,400,000 VND/yr',
        tone: 'pink',
      },
    ];

    const steps = [
      { id: 1, label: 'Profile', hint: 'Last Day' },
      { id: 2, label: 'Succession', hint: 'Roles' },
      { id: 3, label: 'Handover', hint: 'Sign-off' },
      { id: 4, label: 'Revocation', hint: 'G2 Recs' },
      { id: 5, label: 'Execution', hint: 'UF-08' },
      { id: 6, label: 'Evidence', hint: 'BR-14.2' },
      { id: 7, label: 'Completion', hint: 'Data Retention' },
    ];

    const makeLedger = (
      seatAttached,
      successionBlockers,
      handoverBlockers,
      g2Open,
      tasksOpen,
      seatReleased,
      usageDetail,
    ) => ({
      seatAttached,
      successionBlockers,
      handoverBlockers,
      g2Open,
      tasksOpen,
      seatReleased,
      usageDetail,
    });

    const ledgers = {
      baseline: makeLedger(5, 2, 1, 0, 0, 0, 12480),
      successionDone: makeLedger(5, 0, 1, 0, 0, 0, 12480),
      readyForLastDay: makeLedger(5, 0, 0, 0, 0, 0, 12480),
      g2Open: makeLedger(5, 0, 0, 5, 0, 0, 12480),
      tasksCreated: makeLedger(5, 0, 0, 5, 5, 0, 12480),
      evidencePartial: makeLedger(1, 0, 0, 1, 1, 4, 12480),
      seatsReleased: makeLedger(0, 0, 0, 0, 0, 5, 12480),
      deletionComplete: makeLedger(0, 0, 0, 0, 0, 5, 0),
    };

    const baseScreen = (id, step, title, subtitle, state, ledgerKey, activeNav, actions = []) => ({
      id,
      step,
      totalSteps: 7,
      title,
      subtitle,
      state,
      ledgerKey,
      activeNav,
      actions,
    });

    const screens = [
      baseScreen('01', 1, 'Offboarding Employee Roster', 'Select an employee to initiate controlled offboarding workflow.', 'employee-list', 'baseline', 'people', ['open-profile']),
      baseScreen('02', 1, 'Offboarding Impact Analysis — Tran Minh', 'Review seats, organizational dependencies, and devices before creating case.', 'employee-impact', 'baseline', 'people', ['start-offboarding']),
      { ...baseScreen('03', 1, 'Set Last Working Date', 'Last working date is mandatory to govern timeline and retention.', 'start-dialog', 'baseline', 'people', ['cancel', 'create-offboarding']), dateRequired: true },
      baseScreen('04', 2, 'Offboarding Plan Created', 'System bundles seats, succession blockers, handover, and device schedules.', 'plan-created', 'baseline', 'people', ['assign-successors']),
      baseScreen('05', 2, 'Assign Successors', 'Close previous reporting lines and open successors on effective date.', 'successor-assignment', 'successionDone', 'people', ['save-successors']),
      baseScreen('06', 3, 'Awaiting Manager Handover Sign-off', 'IT tracks and reminds; only Manager can sign off on completed handover.', 'handover-waiting', 'successionDone', 'people', ['remind-manager']),
      baseScreen('07', 3, 'Handover Signed Off', 'All blockers closed; device stays active until end of last working day.', 'handover-confirmed', 'readyForLastDay', 'people', ['view-audit']),
      { ...baseScreen('08', 4, 'Five Priority G2 Recommendations', 'Internal signal confirms offboarding; Manager approval not required.', 'g2-created', 'g2Open', 'recommendations', ['select-all']), g2Confidence: 100 },
      baseScreen('09', 4, 'Bulk Revocation Selection', 'Review execution channel and cost savings before creating tasks.', 'bulk-selection', 'g2Open', 'recommendations', ['bulk-revoke']),
      { ...baseScreen('10', 4, 'Confirm Revocation of 5 Seats', 'Type required count and enter shared justification for audit log.', 'bulk-confirm', 'g2Open', 'recommendations', ['cancel', 'confirm-bulk']), typedCountRequired: 5, reasonRequired: true },
      { ...baseScreen('11', 5, 'Five Provisioning Tasks Created', 'Seats remain reserved until provider deprovisioning evidence is verified.', 'tasks-created', 'tasksCreated', 'access', ['open-uf08']), provisioningCreated: true },
      baseScreen('12', 6, 'Track Deprovisioning Evidence', 'Four seats released; Figma still awaits manual evidence verification.', 'evidence-overview', 'evidencePartial', 'access', ['open-task']),
      { ...baseScreen('13', 6, 'Insufficient Figma Evidence', 'Retains Assignment reservation and redirects to exact task in UF-08.', 'evidence-insufficient', 'evidencePartial', 'access', ['open-uf08-task']), openTaskId: 'PV-2042' },
      baseScreen('14', 6, 'Evidence Complete — Final Seat Released', 'Figma deprovisioned at provider; all five G2 recommendations closed.', 'evidence-complete', 'seatsReleased', 'access', ['view-summary']),
      { ...baseScreen('15', 7, 'Zero Seats Active · Awaiting Data Deletion', 'Offboarding complete for access; detailed logs queued for retention job.', 'deletion-scheduled', 'seatsReleased', 'people', ['view-deletion-schedule']), deletionScheduled: true },
      { ...baseScreen('16', 7, 'Retention Job Complete', 'Detailed usage data permanently deleted; decision Audit Trail retained.', 'deletion-complete', 'deletionComplete', 'people', ['view-audit']), deletionCompleted: true },
    ];

    const savings = {
      immediate: '740,000 VND/mo',
      renewal: '13,200,000 VND/yr',
      immediateApps: ['Slack Business+', 'GitHub Business'],
      renewalApps: ['Microsoft 365 E3', 'Figma Professional', 'Zoom Pro'],
    };

    const audit = [
      { at: '10/09/2026 · 09:12', label: 'Created OFF-2026-044', actor: 'IT Admin' },
      { at: '10/09/2026 · 09:18', label: 'Scheduled device expiration', actor: 'System' },
      { at: '12/09/2026 · 14:06', label: 'Assigned successors', actor: 'IT Admin' },
      { at: '16/09/2026 · 16:42', label: 'Confirmed handover completion', actor: 'Le Thu Ha' },
      { at: '17/09/2026 · 09:18', label: 'Generated 5 G2 recs and deprovisioning tasks', actor: 'System' },
      { at: '17/09/2026 · 10:29', label: 'Released final seat', actor: 'IT Admin' },
      { at: '17/10/2026 · 02:14', label: 'Deleted 12,480 usage detail records', actor: 'System' },
    ];

    return deepFreeze({
      actor,
      employee,
      offboarding,
      directReports,
      successions,
      device,
      assignments,
      steps,
      totalSteps: 7,
      ledgers,
      screens,
      savings,
      audit,
    });
  }

  const api = { createUF09Data };
  globalScope.UF09Data = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
