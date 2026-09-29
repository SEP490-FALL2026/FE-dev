;(function initUF10Data(globalScope) {
  'use strict'

  function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value
    Object.values(value).forEach(deepFreeze)
    return Object.freeze(value)
  }

  function createUF10Data() {
    const actor = {
      role: 'IT Admin',
      name: 'IT Admin',
      email: 'it-admin@company.com',
      initials: 'IT'
    }

    const run = {
      id: 'RUN-OPT-20260917-0615',
      generatedAt: '17/09/2026 · 06:15 ICT',
      generatedBy: 'Automation Service',
      handledBy: 'IT Admin · it-admin@company.com',
      g12Schedule: 'Daily · 06:15 ICT',
      g34Schedule: 'Every Monday · 06:15 ICT',
      snapshotPolicy: 'Immutable at time of generation'
    }

    const stages = [
      { id: 1, label: 'Overview', hint: 'G1–G4' },
      { id: 2, label: 'G1 · Renewal', hint: 'Subscription' },
      { id: 3, label: 'G2 · Offboarded', hint: 'Immediate Reclaim' },
      { id: 4, label: 'G3/G4 · Usage', hint: 'Manager Review' },
      { id: 5, label: 'Resolution', hint: 'IT · UF-08' },
      { id: 6, label: 'Savings', hint: 'Separated Categories' }
    ]

    const groups = [
      {
        id: 'G1',
        name: 'Unassigned Seats',
        count: 12,
        source: 'Internal subscription data',
        confidence: '100%',
        managerRequired: false,
        action: 'Reduce at renewal',
        tone: 'blue'
      },
      {
        id: 'G2',
        name: 'Offboarded Employees',
        count: 3,
        source: 'HRIS + Assignment',
        confidence: '100%',
        managerRequired: false,
        action: 'Immediate revoke',
        tone: 'red'
      },
      {
        id: 'G3',
        name: 'Never Active',
        count: 9,
        source: 'Valid usage coverage',
        confidence: 'High',
        managerRequired: true,
        action: 'Manager review',
        tone: 'amber'
      },
      {
        id: 'G4',
        name: 'Dormant / Inactive',
        count: 14,
        source: 'Last activity date',
        confidence: 'Medium',
        managerRequired: true,
        action: 'Manager confirm',
        tone: 'purple'
      }
    ]

    const g1 = {
      targetType: 'Subscription',
      subscriptionId: 'SUB-M365-E3-01',
      app: 'Microsoft 365 E3',
      purchased: 120,
      assigned: 108,
      proposedReduction: 12,
      approvedReduction: 8,
      bufferRetained: 4,
      renewalDate: '15/12/2026',
      noticeDeadline: '15/11/2026',
      unitCost: '500,000 VND/seat/mo',
      estimatedSaving: '72,000,000 VND/yr',
      approvedSaving: '48,000,000 VND/yr',
      decisionId: 'REN-2026-041',
      approvalId: 'APV-2026-118',
      financeRecordId: 'FIN-REN-2026-078',
      handoffOrder: ['UF-15', 'UF-11'],
      financeIsApprover: false,
      approvedBy: 'Cost Approver · Truong Ngoc Minh',
      approvedAt: '17/09/2026 · 10:18 ICT',
      recordedAt: '17/09/2026 · 10:31 ICT'
    }

    const g2 = {
      decisionSource: 'OPT-G2-20260917-014',
      managerRequired: false,
      typedCountRequired: 3,
      reasonRequired: true,
      reason: 'Employee offboarded · RUN-OPT-20260917-0615',
      items: [
        {
          user: 'Nguyen Hai Yen',
          employeeId: 'EMP-0527',
          app: 'Slack Business+',
          short: 'SL',
          assignmentId: 'ASN-5114',
          subscriptionId: 'SUB-SLK-BP-01',
          taskId: 'PV-2058',
          channel: 'Connector',
          saving: '320,000 VND/mo',
          savingType: 'Immediate',
          tone: 'purple'
        },
        {
          user: 'Nguyen Hai Yen',
          employeeId: 'EMP-0527',
          app: 'GitHub Business',
          short: 'GH',
          assignmentId: 'ASN-5115',
          subscriptionId: 'SUB-GH-BIZ-01',
          taskId: 'PV-2059',
          channel: 'Connector',
          saving: '420,000 VND/mo',
          savingType: 'Immediate',
          tone: 'gray'
        },
        {
          user: 'Ho Tuan Anh',
          employeeId: 'EMP-0486',
          app: 'Notion Enterprise',
          short: 'NO',
          assignmentId: 'ASN-5107',
          subscriptionId: 'SUB-NOT-ENT-01',
          taskId: 'PV-2061',
          channel: 'Manual',
          saving: '3,600,000 VND/yr',
          savingType: 'G1 Opportunity',
          tone: 'black'
        }
      ]
    }

    const usageRecommendations = [
      {
        id: 'REC-2026-331',
        group: 'G3',
        user: 'Pham Quang',
        employeeId: 'EMP-0293',
        app: 'Figma Professional',
        assignmentId: 'ASN-5098',
        subscriptionId: 'SUB-FIG-PRO-02',
        evidence: 'Never active',
        daysInactive: 'Never',
        coverageDays: 120,
        sourceImportedAt: '16/09/2026 · 21:40 ICT',
        identityMatch: 'Exact email match',
        activityDefinition: 'Created or edited file; logins excluded',
        confidence: 92,
        manager: 'Le Thu Ha · EMP-0311',
        managerDecision: 'Revoke',
        decisionReason: 'No longer involved in design projects',
        returnsToIT: true
      },
      {
        id: 'REC-2026-332',
        group: 'G4',
        user: 'Nguyen Mai Anh',
        employeeId: 'EMP-0384',
        app: 'Atlassian Jira',
        assignmentId: 'ASN-5077',
        subscriptionId: 'SUB-ATL-STD-01',
        evidence: 'Inactive for 94 days',
        daysInactive: 94,
        coverageDays: 180,
        sourceImportedAt: '16/09/2026 · 22:05 ICT',
        identityMatch: 'Exact email match',
        activityDefinition: 'Page view lasting ≥ 2s',
        confidence: 84,
        manager: 'Le Thu Ha · EMP-0311',
        managerDecision: 'Keep',
        decisionReason: 'Preparing for Q4 campaign launch',
        returnsToIT: false
      },
      {
        id: 'REC-2026-333',
        group: 'G4',
        user: 'Vu Duc Long',
        employeeId: 'EMP-0442',
        app: 'Miro Business',
        assignmentId: 'ASN-5061',
        subscriptionId: 'SUB-MIRO-BIZ-01',
        evidence: 'Inactive for 76 days',
        daysInactive: 76,
        coverageDays: 120,
        sourceImportedAt: '16/09/2026 · 22:18 ICT',
        identityMatch: 'Exact email match',
        activityDefinition: 'Created or edited board',
        confidence: 78,
        manager: 'Nguyen Hoang Long · EMP-0216',
        managerDecision: 'Temporary Exemption',
        decisionReason: 'Planned long-term sabbatical',
        exemptionUntil: '17/12/2026',
        returnsToIT: false
      }
    ]

    const managerBatch = {
      id: 'MBR-2026-W38-009',
      sentAt: '17/09/2026 · 08:30 ICT',
      returnedAt: '17/09/2026 · 15:42 ICT',
      managers: 2,
      recommendations: 3,
      cadence: 'Weekly Batch',
      sourceFlow: 'UF-05'
    }

    const branches = {
      agree: {
        label: 'Branch A · IT Agrees',
        recommendationId: 'REC-2026-331',
        taskId: 'PV-2060',
        assignmentId: 'ASN-5098',
        taskCreatedAt: '17/09/2026 · 15:48 ICT',
        handoff: 'UF-08',
        assignmentReleased: false
      },
      disagree: {
        label: 'Branch B · IT Disagrees',
        recommendationId: 'REC-2026-331',
        reasonRequired: true,
        reason: 'New import data undergoing reconciliation; insufficient grounds for revocation.',
        returnedAt: '17/09/2026 · 16:05 ICT',
        taskCreated: false
      }
    }

    const savings = {
      immediate: {
        value: '740,000 VND/mo',
        amount: 740000,
        status: 'Realized',
        components: ['Slack 320,000', 'GitHub 420,000']
      },
      renewal: {
        value: '48,000,000 VND/yr',
        amount: 48000000,
        status: 'Approved at next renewal',
        components: ['Microsoft 365 · 8 seats reduced']
      },
      notionOpportunity: { value: '3,600,000 VND/yr', recorded: false, status: 'New G1 opportunity · Unrecorded' },
      figmaOpportunity: { value: '5,400,000 VND/yr', recorded: false, status: 'Pending PV-2060 evidence verification' },
      combinedTotal: null
    }

    const makeLedger = (
      g1Open,
      g2Open,
      managerPending,
      itReview,
      tasksOpen,
      seatsReleased,
      renewalReductionApproved,
      immediateSaving,
      renewalSaving
    ) => ({
      g1Open,
      g2Open,
      managerPending,
      itReview,
      tasksOpen,
      seatsReleased,
      renewalReductionApproved,
      immediateSaving,
      renewalSaving
    })

    const ledgers = {
      dashboard: makeLedger(12, 3, 23, 0, 0, 0, 0, 0, 0),
      g1Review: makeLedger(12, 3, 23, 0, 0, 0, 0, 0, 0),
      g1Approved: makeLedger(4, 3, 23, 0, 0, 0, 8, 0, 48000000),
      g2Review: makeLedger(4, 3, 23, 0, 0, 0, 8, 0, 48000000),
      g2TasksCreated: makeLedger(4, 3, 23, 0, 3, 0, 8, 0, 48000000),
      usageReview: makeLedger(4, 3, 23, 0, 3, 0, 8, 0, 48000000),
      managerResults: makeLedger(4, 3, 0, 1, 3, 0, 8, 0, 48000000),
      itReview: makeLedger(4, 3, 0, 1, 3, 0, 8, 0, 48000000),
      branchATaskCreated: makeLedger(4, 3, 0, 0, 4, 0, 8, 0, 48000000),
      branchBDialog: makeLedger(4, 3, 0, 1, 3, 0, 8, 0, 48000000),
      branchBReturned: makeLedger(4, 3, 1, 0, 3, 0, 8, 0, 48000000),
      summaryA: makeLedger(5, 0, 0, 0, 1, 3, 8, 740000, 48000000)
    }

    const baseScreen = (id, stage, title, subtitle, state, ledgerKey, activeNav, branch, actions = []) => ({
      id,
      stage,
      totalStages: 6,
      title,
      subtitle,
      state,
      ledgerKey,
      activeNav,
      branch,
      actions
    })

    const screens = [
      baseScreen(
        '01',
        1,
        'License Optimization Dashboard',
        'Four waste categories isolated by source, confidence, and remediation path.',
        'optimization-dashboard',
        'dashboard',
        'recommendations',
        'ALL',
        ['compare-groups']
      ),
      baseScreen(
        '02',
        1,
        'Why G1–G4 Must Not Be Combined',
        'Compare gating criteria and decision authorities before execution.',
        'group-comparison',
        'dashboard',
        'recommendations',
        'ALL',
        ['open-group']
      ),
      baseScreen(
        '03',
        2,
        'G1 · Purchased but Unassigned Seats',
        'G1 targets Subscription quantity; no employee revocation decision.',
        'g1-list',
        'g1Review',
        'recommendations',
        'G1',
        ['open-subscription']
      ),
      baseScreen(
        '04',
        2,
        'Proposal to Reduce 12 Microsoft 365 Seats',
        'Verify buffer, cancellation deadline, and estimate before renewal approval.',
        'g1-renewal-detail',
        'g1Review',
        'apps',
        'G1',
        ['send-approval']
      ),
      {
        ...baseScreen(
          '05',
          2,
          'Renewal Approval Handoff',
          'Cost Approver decides first; Finance records post-approval.',
          'g1-approval-handoff',
          'g1Review',
          'apps',
          'G1',
          ['open-uf15']
        ),
        handoffOrder: ['UF-15', 'UF-11']
      },
      baseScreen(
        '06',
        2,
        'Approved 8 Seat Reduction at Renewal',
        'Preserves 4-seat buffer; Finance recorded approved decision.',
        'g1-approved-recorded',
        'g1Approved',
        'apps',
        'G1',
        ['view-finance-record']
      ),
      {
        ...baseScreen(
          '07',
          3,
          'G2 · Seats of Offboarded Employees',
          'Three internal seats with 100% confidence routed directly to IT.',
          'g2-list',
          'g2Review',
          'recommendations',
          'G2',
          ['select-all']
        ),
        managerRequired: false
      },
      {
        ...baseScreen(
          '08',
          3,
          'Confirm Immediate Revocation of 3 Seats',
          'Type required count and shared justification; no manager sign-off.',
          'g2-bulk-confirm',
          'g2Review',
          'recommendations',
          'G2',
          ['cancel', 'confirm']
        ),
        managerRequired: false,
        typedCountRequired: 3,
        reasonRequired: true
      },
      {
        ...baseScreen(
          '09',
          3,
          'Three G2 Revocation Tasks Created',
          'Handoff to UF-08; seats remain reserved until provider evidence.',
          'g2-tasks-created',
          'g2TasksCreated',
          'access',
          'G2',
          ['open-uf08']
        ),
        managerRequired: false
      },
      baseScreen(
        '10',
        4,
        'G3/G4 · Usage-based Recommendations',
        'Conclusions shown only when usage source has valid coverage and identity match.',
        'usage-list',
        'usageReview',
        'recommendations',
        'G3/G4',
        ['open-evidence']
      ),
      baseScreen(
        '11',
        4,
        'Immutable Evidence Snapshot for REC-2026-331',
        'Snapshot preserves coverage window, identity mapping, and activity definition.',
        'usage-evidence',
        'usageReview',
        'recommendations',
        'G3',
        ['add-to-batch']
      ),
      baseScreen(
        '12',
        4,
        'Send Week 38 Manager Review Batch',
        'Three recommendations batched weekly and routed to two Managers.',
        'manager-batch-send',
        'usageReview',
        'recommendations',
        'G3/G4',
        ['send-batch']
      ),
      baseScreen(
        '13',
        4,
        'Review Results Returned from UF-05',
        'Keep and Exemption close at Manager; only Revoke returns to IT queue.',
        'manager-results',
        'managerResults',
        'recommendations',
        'G3/G4',
        ['review-reclaim']
      ),
      baseScreen(
        '14',
        5,
        'IT Review of Revocation Decision',
        'Compare snapshot and Manager justification before choosing Agree or Disagree.',
        'it-review',
        'itReview',
        'recommendations',
        'G3',
        ['agree', 'disagree']
      ),
      {
        ...baseScreen(
          '15',
          5,
          'Branch A · IT Agrees with Revocation',
          'Creates PV-2060 and hands off to UF-08; Assignment remains reserved.',
          'it-agree',
          'branchATaskCreated',
          'access',
          'G3 · A',
          ['open-uf08']
        ),
        createdTaskId: 'PV-2060'
      },
      {
        ...baseScreen(
          '16',
          5,
          'Branch B · Enter Disagreement Justification',
          'Mandatory justification required before returning recommendation to Manager.',
          'it-disagree-dialog',
          'branchBDialog',
          'recommendations',
          'G3 · B',
          ['cancel', 'return-manager']
        ),
        createdTaskId: null,
        reasonRequired: true
      },
      {
        ...baseScreen(
          '17',
          5,
          'Returned to Manager for Re-evaluation',
          'Retains snapshot and decision history; no ProvisioningTask created.',
          'returned-to-manager',
          'branchBReturned',
          'recommendations',
          'G3 · B',
          ['view-audit']
        ),
        createdTaskId: null
      },
      baseScreen(
        '18',
        6,
        'Verified Savings by Category',
        'Walkthrough continues Branch A; monthly savings never combined with renewal savings.',
        'savings-summary',
        'summaryA',
        'cost',
        'A · SUMMARY',
        ['view-report']
      )
    ]

    const audit = [
      { at: '17/09/2026 · 06:15', label: 'Rule run created snapshot', actor: 'Automation Service' },
      { at: '17/09/2026 · 08:30', label: 'Sent Week 38 Manager batch', actor: 'IT Admin' },
      { at: '17/09/2026 · 10:18', label: 'Approved 8 seat reduction at renewal', actor: 'Truong Ngoc Minh' },
      { at: '17/09/2026 · 10:31', label: 'Finance recorded post-approval', actor: 'Finance' },
      { at: '17/09/2026 · 15:42', label: 'Manager returned Revoke decision', actor: 'Le Thu Ha' },
      { at: '17/09/2026 · 15:48', label: 'Created PV-2060 in Branch A', actor: 'IT Admin' },
      { at: '17/09/2026 · 16:05', label: 'Returned to Manager in Branch B', actor: 'IT Admin' }
    ]

    return deepFreeze({
      actor,
      run,
      stages,
      totalStages: 6,
      groups,
      g1,
      g2,
      usageRecommendations,
      managerBatch,
      branches,
      savings,
      ledgers,
      screens,
      audit
    })
  }

  const api = { createUF10Data }
  globalScope.UF10Data = api
  if (typeof module !== 'undefined' && module.exports) module.exports = api
})(typeof globalThis !== 'undefined' ? globalThis : this)
