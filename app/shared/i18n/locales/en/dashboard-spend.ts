import { budgetPlan } from './dashboard-budget-plan'

/** Finance (UF-11, UF-12, UF-19) and Spending Approver (UF-15) screens, plus shared budget wording. */
export const spendDashboard = {
  budgetPlan,
  ui: {
    all: 'All',
    cancel: 'Cancel',
    close: 'Close',
    save: 'Save'
  },
  budget: {
    actual: 'Actual',
    asOf: 'Data as of {{time}}',
    borneCost: 'Borne cost',
    borneCostNote: 'All amounts are borne cost; deductible VAT is shown in its own column and never consumes budget.',
    budget: 'Budget',
    costCenter: 'Cost Center',
    deductibleVat: 'Deductible VAT',
    deductibleVatSeparate: 'Deductible VAT (separate)',
    estimateTitle: 'Estimated cost',
    estimated: 'Estimate',
    held: 'Held commitments',
    noBudget: 'No budget',
    nonDeductibleTax: 'Non-deductible tax',
    overCommitted: 'Over-committed',
    pending: 'Spend requests awaiting decision',
    preTax: 'Price before tax',
    remaining: 'Remaining',
    snapshotTitle: 'Budget snapshot',
    totalPayable: 'Total payable',
    usedRatio: 'Spent and committed share'
  },
  approvals: {
    nav: {
      annualBudget: 'Annual budget approval',
      decisionHistory: 'Decision history',
      exceptionApproval: 'Exceptions & adjustments',
      optimization: 'Optimization proposals',
      overview: 'Overview',
      queue: 'Approval queue',
      reports: 'Reports'
    },
    backToQueue: 'Back to queue',
    reasonRequired: 'A reason is required.',
    kind: {
      CHARGE: 'Charge without basis',
      FINDING: 'Legitimization',
      NEED_STEP: 'Need step',
      RENEWAL: 'Renewal',
      SPEND_STEP: 'Spend approval'
    },
    risk: {
      HIGH: 'High risk',
      LOW: 'Low risk',
      MEDIUM: 'Medium risk'
    },
    sla: {
      left: '{{hours}}h left',
      overdue: '{{hours}}h past SLA',
      reminders: 'Reminded {{count}} times',
      reminders_one: 'Reminded once'
    },
    alerts: {
      budgetChanged: 'Finance changed a budget mid-period',
      deadlineSoon: 'Cancellation deadline approaching',
      financeOver: 'Finance recorded Over limit after approval',
      lateExecution: 'Renewal decided but not yet executed'
    },
    overview: {
      alertsTitle: 'Alerts for me',
      subtitle: 'What is waiting for your decision. Finance only gives budget input for reference.',
      title: 'Hello {{name}}',
      urgentHint:
        'Sorted by SLA — when overdue the system reminds you and alerts Super Admin; it never reassigns or decides for you.',
      urgentTitle: 'Decide first'
    },
    queue: {
      colAmount: 'Amount',
      colItem: 'Item',
      colSla: 'SLA',
      colType: 'Type',
      filter: {
        charges: 'Charges / legitimization',
        renewals: 'Renewals',
        requests: 'Requests'
      },
      filterLabel: 'Filter by item type',
      open: 'Open',
      openItem: 'Open {{reference}}',
      slaRule:
        'Each item has its own SLA clock. When overdue or the backlog passes its threshold, the system reminds you and alerts Super Admin — no reassignment, no delegation, never an automatic decision.',
      subtitle:
        'Four item types: spend step · need step when a department head is the beneficiary · renewal · charge without basis or legitimization.',
      title: 'Approval queue'
    },
    request: {
      approve: 'Approve',
      askFinance: 'Ask Finance for budget information',
      askDialogTitle: 'Ask Finance about the {{costCenter}} budget',
      budgetHint: "This request's cost next to the Cost Center budget snapshot for the period.",
      budgetTitle: 'Cost and budget',
      financeReplied: '{{name}} replied · {{time}}',
      financeTeam: 'Finance',
      financeWaiting: 'Waiting for Finance — your SLA keeps running and you can decide now.',
      notAsked: 'You have not asked Finance about this request.',
      questionRequired: 'Enter a question for Finance.',
      recordingNote:
        'Finance records an official opinion on the commitment; Over limit or No budget notifies you — the decision is not reversed.',
      rejectDialogTitle: 'Reject {{reference}}',
      rejectHint: 'The requester is told the reason; no commitment is created.',
      summaryCostCenter: 'Cost Center · period',
      summaryRegion: 'Request summary',
      summaryRemainingAfter: 'Remaining after this request',
      yourQuestion: 'Your question · {{time}}',
      beneficiary: 'Beneficiary',
      branch: {
        b: 'Branch (b) — more seats / upgrade',
        c: 'Branch (c) — new software'
      },
      confirmReject: 'Confirm rejection',
      financeHint: 'Optional. The SLA clock keeps running; you can decide before Finance answers.',
      financeTitle: 'Finance budget input',
      itAssessment: 'IT Admin assessment',
      needApproved: 'Need step approved. The request moves to the spend step — still yours, logged as the same person.',
      needDecisionTitle: 'Need-step decision',
      needStepHint:
        'The department head filed this request, so the need step is held by the Spending Approver (QĐ-52c). The two steps stay separate.',
      needTitle: 'Need and justification',
      questionLabel: 'Question for Finance',
      referenceOnly: 'For reference only — not an approval and never blocks your decision.',
      reject: 'Reject',
      rejectReason: 'Rejection reason (required)',
      rejected: 'Rejected. The requester is notified with the reason; no commitment is created.',
      requester: 'Requester',
      samePerson: 'Same person as previous step',
      sendQuestion: 'Send question',
      snapshotCaptured:
        'The budget snapshot is captured at decision time and kept as evidence. Nobody approves a request they filed or benefit from.',
      spendApproved:
        'Spend approved. The system creates a commitment (Finance records it later) and a provisioning task for IT Admin.',
      spendDecisionTitle: 'Spend decision',
      spendStepHint: 'Approve or reject on the budget snapshot. A rejection needs a reason.',
      step: {
        created: 'Request submitted',
        itReview: 'IT reviews catalog, risk, control level',
        needStep: 'Need step',
        spendStep: 'Spend step'
      },
      trailTitle: 'Approval trail',
      yourStep: '— your step'
    },
    renewal: {
      action: {
        CANCEL: 'Cancel subscription',
        REDUCE: 'Reduce quantity',
        RENEW: 'Renew as is'
      },
      actionRequired: 'Choose a decision.',
      annualCost: 'Next term cost (borne)',
      annualSaving: 'Saves about {{amount}} per term',
      assigned: 'Assigned seats',
      contractTitle: 'Subscription and deadline',
      daysLeft: '{{count}} days to cancellation deadline',
      daysLeft_one: '1 day to cancellation deadline',
      deadline: 'Cancellation deadline',
      decided:
        'Decision recorded: {{action}} ({{quantity}} seats). It is logged in the Audit Trail and handed to IT Admin to execute and record the outcome (UF-20).',
      decisionTitle: 'Your decision',
      group: {
        DECIDED: 'Already decided to reclaim',
        G2: 'G2 — left company',
        G3: 'G3 — inactive',
        G4: 'G4 — low use',
        OLDEST: 'Oldest last activity'
      },
      handoffNote:
        'A decision may be recorded before or after the cancellation deadline; late decisions are not voided — valid execution timing is handled by WF-15/UF-20.',
      itPick: 'IT proposal',
      itProposal: 'IT Admin proposal',
      lateNote: 'Decided after the cancellation deadline — IT handles it as late execution.',
      newQuantity: 'New quantity (currently {{purchased}})',
      noCommitment:
        'Renew/reduce/cancel decisions do not create a commitment; the renewal cost appears in the L1 forecast.',
      ownerOpinion: 'Business Owner opinion',
      pickInvalid: 'Select exactly {{count}} seats to reclaim.',
      purchased: 'Purchased seats',
      quantityInvalid: 'Quantity must be above 0 and below {{purchased}}.',
      reasonLabel: 'Reason for differing from IT (required)',
      reclaimHint: 'System ranking: already decided → G2 → G3/G4 → oldest last activity.',
      reclaimTitle: 'Below assigned seats — pick {{count}} seats to reclaim',
      renewalDate: 'Renewal date',
      submit: 'Record decision',
      title: '{{software}} renewal',
      usage: {
        active: 'Active',
        inactive: 'Inactive',
        noData: 'No data',
        unmatched: 'Identity unmatched'
      },
      usageHint: 'No data and unmatched identities are never counted as inactive.',
      usageTitle: 'Usage evidence and waste',
      waste: {
        g1: 'Unassigned',
        g2: 'Left company',
        g3: 'Inactive',
        g4: 'Low use'
      }
    },
    charge: {
      assessmentHint: 'Input only — IT does not decide legitimization.',
      assessmentTitle: 'IT Admin assessment',
      chargeSubtitle: 'A charge with no valid basis after Finance and IT checked it.',
      chargeTitle: 'Statement charge',
      chargesTotal: '{{count}} charges in total',
      control: 'Control level',
      costCenterLabel: 'Cost Center to carry the charge (required to accept)',
      costCenterRequired: 'Choose a Cost Center.',
      date: 'Date',
      decisionHint: 'Only the Spending Approver decides; Finance and Super Admin are not on this path.',
      decisionTitle: 'Choose an outcome',
      executionNote:
        'The decision is written to each charge of the record and the Audit Trail; IT Admin executes it in UF-12.',
      financeEvidence: 'Finance evidence',
      findingSubtitle: 'BM-07 file for an unapproved vendor — legitimization is the branch (c) decision.',
      findingTitle: 'Vendor finding — {{vendor}}',
      headContext: 'Department head context',
      headContextHint: 'Non-blocking — you can decide without it.',
      noHeadContext: 'No context yet — the department head has been reminded.',
      outcome: {
        ACCEPT: 'Accept charge',
        FALSE_POSITIVE: 'False positive',
        LEGITIMIZE: 'Approve legitimization',
        NOT_ACCEPT: 'Do not accept',
        NOT_APPROVED: 'Do not approve'
      },
      outcomeHint: {
        ACCEPT: 'Pick a Cost Center; the charge leaves the Unallocated line.',
        FALSE_POSITIVE: 'Closed with a reason; reopens if it appears again.',
        LEGITIMIZE: 'IT adds it to the catalog and grants current users — no second spend approval.',
        NOT_ACCEPT: 'Reason required; stays on the Unallocated line labelled not accepted.',
        NOT_APPROVED: 'Reason required; IT cancels, reclaims or moves users to an existing tool.'
      },
      payer: 'Payer',
      reasonLabel: 'Reason (required)',
      responsible: 'Responsible person',
      result: {
        ACCEPT: 'Charge accepted and booked to {{costCenter}}.',
        FALSE_POSITIVE: 'Closed as a false positive.',
        LEGITIMIZE:
          'Legitimization approved. IT Admin adds it to the catalog, registers the subscription and grants current users.',
        NOT_ACCEPT: 'Not accepted — the charge stays on the Unallocated line labelled not accepted.',
        NOT_APPROVED: 'Not approved — IT Admin cancels, reclaims or moves users.'
      },
      statementLine: 'Statement line',
      submit: 'Record decision',
      users: '{{count}} current users',
      vendor: 'Vendor'
    },
    optimization: {
      annualPending: 'Annual saving awaiting your decision',
      approve: 'Approve proposal',
      approvedSaving: 'Approved saving this period',
      backToList: 'Back to proposals',
      confirmReject: 'Confirm rejection',
      decisionHint:
        'If approved, IT Admin reclaims the seats or changes the plan; rejecting needs a reason and Finance is notified.',
      decisionTitle: 'Your decision',
      filterLabel: 'Filter proposals by status',
      noNote: 'Finance left no note.',
      pending: 'Proposals awaiting you',
      pendingHint: 'Saves {{amount}} this period if all are approved',
      reasonRequired: 'A reason is required.',
      reject: 'Reject',
      rejectReason: 'Reason for rejection (required)',
      sentBy: 'Sent by Finance on {{time}}',
      subtitle:
        'Finance proposes lowering next period’s forecast cost through ghost seats, plan downgrades or duplicate plans. You approve or reject; IT Admin executes after approval.',
      summaryLabel: 'Optimization proposal summary',
      title: 'Cost optimization proposals'
    },
    reports: {
      branchATitle: 'Seats granted without the spend step ({{count}} apps)',
      days: '{{value}} days',
      financeRecording: 'Finance recording after approval (measured separately)',
      financeResponse: 'Finance answering questions (measured separately)',
      myOverdue: 'Share of my steps past SLA',
      processHint: 'KPI-2 split per step; Finance time is not added to the waiting path.',
      processTitle: 'Processing time',
      savingsLabel: 'Savings',
      seats: '{{count}} seats',
      spendChartLabel: 'Bar chart of budget and spend by Cost Center — {{period}}',
      spendHint: 'Period-basis borne cost by Cost Center. Hover a column for details.',
      spendSeries: 'Period spend',
      spendTitle: 'Spend {{spend}} / budget {{budget}}',
      step: {
        itReview: 'IT review',
        need: 'Need step',
        provisioning: 'Provisioning',
        spend: 'Spend step'
      },
      subtitle: 'Period {{period}} — spend, savings and the performance summaries a Spending Approver may see.',
      title: 'Spending Approver reports',
      usage: {
        activeInEvaluated: 'Active share of evaluated seats',
        coverage: 'Evidence coverage',
        kpi3: 'KPI-3 (official metric)'
      },
      usageHint: 'Three ratios answering three different questions — never merged.',
      usageNote: '{{purchased}} seats purchased · {{evaluated}} evaluated · {{active}} active.',
      usageTitle: 'License usage',
      ofBudget: 'Of the {{budget}} budget · {{share}} used',
      reclaimedCount: '{{count}} seats reclaimed — evidence only, not added to savings',
      totalSpend: 'Total spend {{period}}'
    }
  },
  finance: {
    nav: {
      annualProposals: 'Annual budget proposals',
      areas: {
        budget: 'Cost Centers & Budget',
        close: 'Period Close & Reports',
        overview: 'Overview',
        planning: 'Planning & Forecast',
        spend: 'Spend & Reconciliation'
      },
      budgetAllocation: 'Budget allocation',
      budgetCheck: 'Budget check',
      budgetExceptions: 'Budget exceptions',
      budgetNegotiation: 'Review & negotiation',
      budgetPeriods: 'Budget periods',
      budgetQuestions: 'Budget info requests',
      budgets: 'Cost Centers',
      chargeExceptions: 'Charge exceptions',
      commitments: 'Commitments',
      costAnalysis: 'Allocation & budget vs actual',
      costForecast: 'Cost forecast',
      costOptimization: 'Cost optimization',
      decisionHistory: 'Decision history',
      departmentBudget: 'By department',
      departmentSummary: 'Department summary',
      overview: 'Overview',
      periodClose: 'Period close',
      periodReport: 'Period report',
      saasCost: 'Software & cost',
      spendImport: 'Import statements / invoices'
    },
    opinion: {
      NO_BUDGET: 'No budget',
      OVER: 'Over limit',
      WITHIN: 'Within limit'
    },
    overview: {
      budgetTableHint: 'Remaining = budget − actual − held commitments. Without a budget we show "No budget", never 0.',
      budgetTableTitle: 'Budget · actual · commitments · remaining — {{period}}',
      barHint:
        'Grey is the budget; orange is actual spend with held commitments as the lighter top. Hover for details.',
      barTitle: 'Budget and usage by Cost Center — {{period}}',
      closeHint: '{{count}} commitment remainders to review',
      donutEmpty: 'No actual spend in this period yet.',
      donutHint: 'Each Cost Center share of actual spend. Hover for details.',
      donutTitle: 'Actual spend mix — {{period}}',
      donutTotal: 'Total actual',
      closeStatus: 'Closing',
      commitmentsToRecord: 'Commitments to record',
      exceptionsHint: 'Need Finance and IT checks',
      formulaNote:
        'Finance is not on the spend approval path: it answers when asked and records after the Spending Approver approves.',
      openAction: 'Open →',
      openExceptions: 'Charge exceptions',
      openQuestions: 'Open budget info requests',
      periodClose: 'Close {{period}}',
      questionsHint: 'From the Spending Approver — reference only, non-blocking',
      recordingHint: '{{count}} past their recording due time',
      subtitle: 'Open budget work for {{period}}. Each tile is the entry point to one task.',
      title: 'Finance dashboard',
      totalWithBudget: 'Total (Cost Centers with a budget)',
      usedShare: 'Used',
      withoutBudget: 'Cost Centers without a budget',
      workRegion: 'Open budget work'
    },
    questions: {
      answeredNotice:
        "The answer now shows on the Spending Approver's decision screen. The spend step SLA was not paused.",
      backToList: 'Back to list',
      cancelledNotice: 'The purchase request was cancelled, so this budget info request closed with it.',
      colRequest: 'Request',
      colSentBy: 'Sent by',
      colStatus: 'Status',
      dossierBudget: '1. Current budget',
      dossierCost: '2. Total cost of this request',
      dossierHint: "Figures for the request's Cost Center and period; every amount is borne cost.",
      dossierTitle: 'Attached dossier',
      empty: 'No requests.',
      filterLabel: 'Filter requests by status',
      from: 'From {{name}} · Spending Approver',
      noteLabel: 'Note for the Spending Approver',
      notePlaceholder: 'E.g. about 50 million left after held commitments.',
      noteRequired: 'A note is required.',
      openDetail: 'View details',
      openDetailFor: 'View details of {{code}}',
      opinionLegend: 'Budget opinion',
      opinionRequired: 'Choose an opinion.',
      replyLegend: 'Reply',
      requestKicker: 'Budget info request',
      requester: 'requested by {{name}}',
      ruleNotice:
        'Your answer is input for reference — not an approval and never blocking. The Spending Approver can decide at any time, even before you answer.',
      slaNote: 'Finance response time is measured separately.',
      sodBlocked:
        'You are the Spending Approver of this request, so you cannot answer its budget info request (SoD-8).',
      status: {
        ANSWERED: 'Answered',
        CLOSED_CANCELLED: 'Closed — request cancelled',
        OPEN: 'Open'
      },
      submit: 'Send answer',
      subtitle:
        "The Spending Approver sends a request with the Cost Center's budget dossier for the period; Finance answers for reference before the decision.",
      suggested: 'Snapshot suggests: {{opinion}}',
      title: 'Budget info requests from the Spending Approver'
    },
    commitments: {
      approvedBy: 'approved by {{name}}',
      attached: 'Budget attached',
      awaitingBackfill: 'Awaiting back-fill',
      backToList: 'Back to queue',
      colBudget: 'Budget',
      colCommitment: 'Commitment',
      colDue: 'Recording due',
      colRequest: 'Request',
      emptyQueue: 'No commitments left to record.',
      dueAt: 'Record by {{time}}',
      figuresTitle: 'Budget and cost of this commitment',
      noBudgetLocked: 'There is no budget for this Cost Center and period — the only possible opinion is No budget.',
      noteLabel: 'Note (optional)',
      openDetail: 'Record',
      openDetailFor: 'Record {{code}}',
      notifies: 'Notifies approver',
      opinionLegend: 'Official opinion',
      overdue: 'Due now',
      queueHint:
        'Created by the system when the Spending Approver approves a request with cost. Released commitments (request cancelled, provisioning failed) are not listed.',
      queueTitle: 'Recording queue',
      recordTitle: 'Record official opinion — {{software}}',
      recordedNotified:
        'Recorded {{code}} and notified the Spending Approver. The decision and provisioning stand; the commitment stays Held.',
      recordedTitle: 'Recorded in this session',
      recordedWithin: 'Recorded {{code}}: Within limit. No further notification.',
      ruleNotice:
        'Recording happens after approval, has its own SLA and is not on the provisioning path. Recording Over limit or No budget only notifies — it never reverses the decision or stops provisioning.',
      sodNote: 'The recorder cannot be the Spending Approver of the same request (SoD-8).',
      submit: 'Record',
      subtitle: 'Each commitment belongs to exactly one approved spend request.',
      title: 'Commitments awaiting recording'
    },
    budgets: {
      addCenter: 'Add Cost Center',
      amountLabel: 'Budget limit (borne cost, VND)',
      amountPlaceholder: 'E.g. 20000000',
      amountRequired: 'The limit must be above 0 — no zero placeholder budgets.',
      backfillNote:
        'As soon as the budget exists, the system attaches these commitments to it and logs the Audit Trail.',
      backfillTitle: '{{count}} commitments will be back-filled',
      backfillTitle_one: '1 commitment will be back-filled',
      budgetsHint: 'At most one budget per Cost Center and period.',
      budgetsTitle: 'Budgets by Cost Center — {{period}}',
      catalogHint: 'A Unit maps 1–1 to a department; Company carries company-wide cost.',
      catalogNote:
        'Splitting or merging departments ⟹ a new Cost Center and the old one retired; history is kept. No placeholder Cost Centers.',
      catalogTitle: 'Cost Center catalog',
      colAction: 'Action',
      colDepartment: 'Department',
      colKind: 'Kind',
      colStatus: 'Status',
      colUsage: 'Usage (actual + commitments)',
      compactNote: 'Amounts are abbreviated — hover to see the full figure.',
      create: 'Create budget',
      createHint:
        'Set a borne-cost limit for the Cost Center and period. Quarter and year amounts are split evenly across months.',
      createTitle: 'Create budget {{costCenter}} · {{period}}',
      createdResult:
        'Budget {{costCenter}} · {{period}} is active; {{count}} commitments back-filled. Snapshots and reports use it immediately.',
      currentAmount: 'Current budget: {{amount}}',
      edit: 'Edit',
      editHint:
        'Changing the amount mid-period requires a reason. Quarter and year amounts are split evenly across months.',
      editNote:
        'History is kept; snapshots captured at decision time do not change; the Spending Approver is notified.',
      editTitle: 'Edit budget {{costCenter}} · {{period}}',
      editedResult: 'Budget {{costCenter}} · {{period}} updated and the Spending Approver notified.',
      granularityLabel: 'View by',
      kind: {
        COMPANY: 'Company',
        UNIT: 'Unit'
      },
      negativeExplain:
        'Negative remaining: commitments made before the budget existed exceed the new limit. The negative value is shown, never rounded to 0.',
      negativeResult:
        'Remaining is negative and labelled Over-committed; reports state the excess came from commitments made before the budget existed.',
      newCode: 'Cost Center code',
      newCodePlaceholder: 'E.g. CC-LEGAL',
      newDuplicate: 'This Cost Center code already exists.',
      newName: 'Name',
      newRequired: 'Enter a Cost Center code and name.',
      periodLabel: 'Period',
      periodName: {
        MONTH: '{{number}}/{{year}}',
        QUARTER: 'Q{{number}} {{year}}',
        YEAR: 'Year {{year}}'
      },
      periodNote: 'Quarters and years add their months up.',
      periodTypes: {
        MONTH: 'Month',
        QUARTER: 'Quarter',
        YEAR: 'Year'
      },
      previewRemaining: 'Remaining after creation',
      reasonLabel: 'Reason for change (required)',
      reasonRequired: 'A reason is required.',
      replacedBy: 'replaced by {{code}}',
      retire: 'Retire',
      status: {
        ACTIVE: 'Active',
        RETIRED: 'Retired'
      },
      submitCreate: 'Create budget',
      submitEdit: 'Save and notify',
      subtitle: 'Manage the Cost Center catalog and set budgets per Cost Center and period.',
      summaryRegion: 'Budget overview for the period',
      tileActualHint: 'All Cost Centers',
      tileBudget: 'Total budget',
      tileBudgetHint: '{{count}}/{{total}} Cost Centers have a budget',
      tileHeldHint: 'Approved, not yet cost',
      tileRemainingHint: 'Cost Centers with a budget only',
      timing: {
        CURRENT: 'Current period',
        FUTURE: 'Upcoming period',
        PAST: 'Past period'
      },
      title: 'Cost Centers & budgets',
      usageAria: '{{percent}} of the budget used'
    },
    import: {
      cancelBatch: 'Cancel batch',
      cancelledResult: 'Batch cancelled — nothing was written.',
      colAmount: 'Amount',
      colDate: 'Date',
      colDescription: 'Description',
      colLine: 'Line',
      colResult: 'Check result',
      confirm: 'Write {{count}} valid rows',
      doneResult: '{{count}} rows written. Vendors were normalized and charges reconciled against approval basis.',
      duplicateRows: 'Previously imported rows',
      errorRows: 'Rows with errors',
      exception: 'Exceptions to check',
      exceptionHint: 'Open in FIN-07',
      fileLabel: 'CSV file',
      fileRejected: 'CSV only — XLSX, PDF or other encodings reject the whole file.',
      formatNote:
        'CSV in the standard template or a configured bank template is the only evidence source for this release.',
      newImport: 'Import another file',
      noFollowUp: 'No follow-up',
      noFollowUpHint: 'Matched basis, already recorded, refund or not software',
      previewHint: 'Preview is mandatory. One bad row never breaks the whole file.',
      previewSummary: 'Preview summary',
      problem: {
        DUPLICATE: 'Already imported',
        INVALID_DATE: 'Invalid date',
        MISSING_AMOUNT: 'Missing amount'
      },
      rowErrorNote: 'Only valid rows are written; error and duplicate rows are skipped with their reason.',
      rowValid: 'Valid',
      steps: {
        done: 'Result',
        preview: 'Preview',
        upload: 'Upload'
      },
      stepsLabel: 'Import steps',
      subtitle: 'Import card statements or the period cost invoice list to reconcile against approval basis.',
      templateLabel: 'Template',
      title: 'Import statements and invoices',
      toPreview: 'Preview',
      uploadHint: 'Pick a template, then upload the CSV file.',
      uploadTitle: 'Upload file',
      useSample: 'Use sample file',
      validRows: 'Valid rows',
      vendorQueue: 'Sent to IT queue',
      vendorQueueHint: 'Vendor unidentified or not approved (ITA-15)'
    },
    exceptions: {
      amount: 'Amount',
      approvedAmount: 'Approved amount',
      attach: 'Attach evidence',
      basisTried: 'Basis tried',
      backToList: 'Back to exceptions',
      billingError: 'Vendor billing error',
      billingDialogHint:
        'Close the exception as a vendor billing error. Any adjustment arrives later with a new document.',
      billingDialogTitle: 'Close {{code}} as a billing error',
      billingNote: 'Note (required)',
      billingNoteRequired: 'A note is required.',
      card: 'card ••{{last4}}',
      chargeTitle: 'Charge',
      closeBillingError: 'Close as billing error',
      colCharge: 'Charge',
      colDate: 'Date · card',
      colStatus: 'Status',
      empty: 'Nothing here.',
      evidence: 'Evidence ({{count}})',
      excess: 'Excess',
      filterLabel: 'Filter exceptions by status',
      itNote: 'IT Admin',
      openDetail: 'View details',
      openDetailFor: 'View details of {{code}}',
      linkedByIt:
        'If IT links a basis, the system re-reconciles this line; any amount above the approved amount stays an exception.',
      outcome: {
        BASIS_LINKED: 'IT linked a basis; the line was re-reconciled.',
        BILLING_ERROR: 'Closed as a vendor billing error. Any adjustment arrives later as a new document.',
        CHECKING: '',
        SENT_TO_APPROVER: 'Sent to the Spending Approver. Only they accept or decline the charge.'
      },
      reason: {
        MULTIPLE_BASES: 'Multiple bases match',
        NO_BASIS: 'No basis',
        OUT_OF_TERM: 'Outside term',
        OVER_APPROVED: 'Above approved amount'
      },
      reasonLabel: 'Exception reason',
      resultTitle: 'Joint check result with IT',
      ruleNotice:
        'An exception means "needs checking", not a violation. Finance attaches evidence and checks with IT but does not decide to accept a charge (SoD-3).',
      sendToApprover: 'No valid basis — send to Spending Approver',
      status: {
        BASIS_LINKED: 'Basis linked',
        BILLING_ERROR: 'Billing error',
        CHECKING: 'Checking',
        SENT_TO_APPROVER: 'Awaiting Spending Approver'
      },
      subtitle:
        'Charges that did not match an approval basis after reconciliation; each exception has exactly one reason.',
      title: 'Charge exceptions',
      unallocatedNote: 'Unexplained amounts still count as period actuals, on the Unallocated Cost Center line.'
    },
    close: {
      addInternal: 'Record cost',
      auditNote: 'This action is logged in the Audit Trail.',
      backToList: 'Back to Cost Centers',
      checkCarried: '{{count}} still expect invoices — their remainder stays held into the next period.',
      checkReleased: 'No remainder left to release.',
      checkReviewed: 'I have reviewed this Cost Center’s internal costs and allocation.',
      checkToRelease: '{{count}} remainders expect no more invoices — release them.',
      checklistHint: 'Close each Cost Center once remainders are handled and internal costs are recorded.',
      checklistTitle: 'Close the Cost Center',
      closeBlocked: 'Release remainders that expect no more invoices before closing.',
      closeCostCenter: 'Close {{code}}',
      closed: 'Closed by {{name}} on {{time}}. Late items appear in the next report as a prior-period adjustment.',
      closedCount: 'Cost Centers closed',
      closedHint: 'Each Cost Center is closed on its own',
      colStatus: 'Status',
      confirmRelease: 'Release',
      convertedHint: 'Each invoice converts exactly its amount from commitment to cost',
      convertedToCost: 'Converted to cost',
      detailSubtitle: '{{name}} — release commitment remainders, record internal costs, then close the Cost Center.',
      detailTitle: 'Close {{period}} · {{code}}',
      heldRemainder: 'Held remainder',
      internalAmount: 'Amount (VND)',
      internalDescription: 'Cost description',
      internalHint:
        'No invoice or vendor needed. Costs recorded here belong to this Cost Center; to split, record them in each Cost Center — no allocation ratios.',
      internalRequired: 'Enter a description and an amount above 0.',
      internalTitle: 'Internal software costs',
      listHint:
        'Open each Cost Center to handle remainders and internal costs, then close it. The period is not locked: late items appear in the next report.',
      listTitle: 'Cost Centers in the period',
      moreExpected: 'More invoices expected',
      noInternal: 'No internal cost recorded this period.',
      noInvoice: 'No invoice expected',
      noLockNote:
        'Closing does not lock the period; late items are booked as a prior-period adjustment in the next report.',
      noMoreInvoices: 'No more invoices — last {{date}}',
      noRemainders: 'This Cost Center has no commitment with a remainder.',
      open: 'Open',
      openFor: 'Close {{code}}',
      periodCost: 'Period cost (allocated)',
      pickCostCenter: 'Pick a Cost Center',
      release: 'Release remainder',
      releaseDisabled: 'Invoices still expected — cannot release yet',
      releaseReason: 'Reason for releasing the remainder of {{code}} (required)',
      releaseReasonRequired: 'A reason is required.',
      released: 'Released',
      remainderFigures: 'Committed {{committed}} · invoiced {{invoiced}}',
      remaindersHint: 'Release a remainder only when no further invoice will arrive.',
      remaindersTitle: 'Commitments with a remainder',
      status: {
        BLOCKED: 'Remainder to release',
        CLOSED: 'Closed',
        READY: 'Ready to close'
      },
      subtitle: 'Step 1 of closing {{period}}: close costs one Cost Center at a time.',
      summaryLabel: 'Period close summary',
      title: 'Close {{period}} by Cost Center',
      toAllocation: 'Allocate costs',
      toExceptions: 'View exceptions',
      toReleaseCount: 'Remainders to release',
      unallocatedRow:
        'Unallocated to a Cost Center: {{amount}} — not closed here; waits for the Spending Approver on {{count}} exceptions.'
    },
    analysis: {
      allocationHint:
        'Shared plans by the ratios Finance declared (100% total); personal seats by the holder’s department, split by day on transfer; shared accounts to the department Unit or Company.',
      allocationTitle: 'Cost allocation by Cost Center (FIN-32)',
      basis: {
        cash: 'Cash basis',
        period: 'Period basis'
      },
      basisHint: {
        cash: 'Booked on the invoice date — for payment reconciliation.',
        period: 'Spread evenly over the usage period — for budget tracking.'
      },
      basisLabel: 'Recognition basis',
      bvaTitle: 'Budget vs actual on borne cost (FIN-33)',
      internal: 'Internal',
      l1Hint: 'Read straight from contracts — no statistical model.',
      l1Title: 'L1 — Committed cost',
      l1Total: 'Next quarter total',
      l2Deferred: 'L2 — Model-based forecast is not implemented yet (needs ≥ 12 months of data and back-testing).',
      l3Hint: 'Three scenarios from assumptions Finance enters.',
      l3Note: 'Scenario = L1 + decision-driven part × 0.5 / 1 / 1.5.',
      l3Title: 'L3 — Scenarios',
      openExceptions: '{{count}} open exceptions',
      personalSeats: 'Personal seats',
      priorAdjustment: 'Prior-period adjustment ({{period}})',
      scenario: {
        base: 'Base',
        high: 'High',
        low: 'Low'
      },
      sharedAccounts: 'Shared accounts',
      sharedByRatio: 'Shared plans (ratio)',
      subtitle: 'Step 2 of closing {{period}}: review allocation and compare budget with actuals per Cost Center.',
      title: 'Allocation and budget vs actual {{period}}',
      toReport: 'Prepare period report',
      total: 'Total',
      unallocated: 'Unallocated Cost Center',
      unallocatedNote:
        'The Unallocated line is a report line, not a Cost Center; it is never forced into one until the Spending Approver decides.',
      upcomingRenewals: 'Upcoming renewals',
      assumption: {
        costPerHire: 'Tool cost per hire (VND)',
        newHires: 'New hires',
        newProjects: 'New projects (VND)'
      }
    },
    forecast: {
      approvedLine: 'Approved saving',
      baseAfterAll: 'Base if every proposal is approved',
      baseAfterApproved: 'Base after approved saving',
      optimizedHint: 'The base scenario minus the in-period saving of cost optimization proposals.',
      optimizedTitle: 'Base scenario after optimization',
      pendingLine: 'Draft and pending proposals',
      subtitle:
        'Committed cost from contracts and assumption-based scenarios — the basis for optimizing forecast cost.',
      title: 'Cost forecast {{period}}',
      toOptimization: 'Optimize forecast cost'
    },
    optimization: {
      afterHint: 'If every proposal not rejected is approved',
      afterOptimization: 'Forecast after optimization',
      annualSaving: 'Annual saving',
      approved: 'Approved by {{name}} on {{time}}. IT Admin executes; the saving is taken off the forecast.',
      approvedHint: '{{count}} approved proposals',
      approvedSaving: 'Approved saving',
      backToList: 'Back to proposals',
      basis: {
        CANCEL: '{{active}}/{{purchased}} seats still active',
        DOWNGRADE: '{{current}} → {{proposed}}',
        GHOST_SEAT: '{{count}}/{{purchased}} seats unused'
      },
      budgetImpact: '{{costCenter}} budget · {{period}}',
      colBasis: 'Type and basis',
      colMonthly: 'Saving / month',
      colProposal: 'Proposal',
      colStatus: 'Status',
      colWindow: 'Saving this period',
      colLastActivity: 'Last activity',
      colSignal: 'Signal',
      colUser: 'Seat holder',
      currentMonthly: 'Current cost / month',
      currentPlan: 'Current plan',
      empty: 'No proposal matches the filters.',
      evidenceHint: {
        CANCEL: 'Few users, and another catalog tool already covers the same need.',
        DOWNGRADE: 'Very few users touch features only the current plan has.',
        GHOST_SEAT: 'Seats bought but unused for over 60 days, held by leavers, or never signed in.'
      },
      evidenceTitle: 'Usage evidence',
      featuresLost: 'Features lost by downgrading',
      financeNote: 'Finance note',
      forecast: 'Committed forecast cost',
      forecastHint: 'Layer 1 — {{period}}',
      ghostTitle: 'Seats proposed for reclaim ({{count}})',
      kind: {
        CANCEL: 'Cancel duplicate plan',
        DOWNGRADE: 'Downgrade plan',
        GHOST_SEAT: 'Reclaim ghost seats'
      },
      monthlySaving: 'Saving / month',
      noteLabel: 'Note for the Spending Approver (optional)',
      openDetail: 'View',
      openDetailFor: 'View details of {{code}}',
      overlapWith: 'Overlaps with',
      potential: 'Potential saving this period',
      potentialHint: '{{count}} proposals not rejected',
      premiumUsage: 'Users of current-plan features (90 days)',
      proposedMonthly: 'Cost after optimization / month',
      proposedPlan: 'Proposed plan',
      rejected: 'Rejected by {{name}} on {{time}}: {{reason}}',
      remainingAfter: 'Remaining if applied',
      remainingBefore: 'Remaining now',
      savingsHint: 'Borne cost per month; the in-period saving counts only months from the effective date.',
      savingsTitle: 'Cost impact',
      seatsActive: 'Active seats',
      seatsPurchased: 'Seats purchased',
      send: 'Send to Spending Approver',
      sendHint: 'Finance only proposes; the Spending Approver decides and IT Admin reclaims seats or changes the plan.',
      sendTitle: 'Send proposal',
      sent: 'Sent on {{time}} — awaiting the Spending Approver’s decision.',
      signal: {
        INACTIVE: 'Inactive for {{days}} days',
        LEFT_COMPANY: 'Left the company',
        NEVER_USED: 'Never signed in'
      },
      status: {
        APPROVED: 'Approved',
        DRAFT: 'Draft',
        REJECTED: 'Rejected',
        SENT: 'Awaiting Spending Approver'
      },
      subtitle:
        'Lower next period’s committed cost by reclaiming ghost seats, downgrading plans whose features go unused, or cancelling duplicate plans. Finance proposes — the Spending Approver decides — IT Admin executes.',
      summaryLabel: 'Cost optimization summary',
      timing: {
        IMMEDIATE: 'Effective from {{month}}',
        NEXT_RENEWAL: 'At the renewal on {{date}}'
      },
      timingLabel: 'Effective',
      title: 'Forecast cost optimization {{period}}',
      usageNote: 'Inactive days are a tool-usage signal supplied by IT Admin, not a measure of work performance.',
      vendor: 'Vendor',
      windowSaving: 'Saving in {{period}}'
    },
    report: {
      aiDraft: 'Software spending for Q3 2026 was 408.1 million ₫ for the period [1], below the total budget of 520 million ₫ [2]. Operations used 93.6% of its budget, the highest in the company [3]. Unallocated cost center spending is 6.62 million ₫, with three exceptions awaiting the Spending Approver [4]. Immediate savings are 18.4 million ₫, and savings at the next renewal are 41.2 million ₫; these are separate figures [5].',
      aiSource1: '[1] Budget versus actual · period basis · total',
      aiSource2: '[2] Q3 2026 budget · six cost centers',
      aiSource3: '[3] CC-OPS · period actual ÷ budget',
      aiSource4: '[4] Allocation · unallocated lines',
      aiSource5: '[5] Savings report',
      colNarrative: 'Narrative',
      colRole: 'Role',
      colSavings: 'Savings',
      colSpend: 'Total spend',
      draftWarning:
        'AI drafted this from backend figures — it is not data. Review and edit before use; every figure traces to its source.',
      figuresLabel: 'Period figures',
      generateDraft: 'Generate AI draft',
      hidden: 'Hidden',
      immutable:
        'A published report is an immutable snapshot — it cannot be republished; late items and corrections appear in the next report as prior-period adjustments.',
      mode: {
        ai: 'Use AI draft',
        manual: 'Write it myself'
      },
      modeHint: {
        ai: 'AI only explains — it never calculates money or concludes violations.',
        manual: 'Use when AI is not needed, or AI is off / failing — the process still completes.'
      },
      narrativeHint: 'Optional. The narrative is only in the Finance and Spending Approver copies.',
      narrativePlaceholder: 'Write the narrative for the period report…',
      narrativeTitle: 'Narrative',
      ofBudget: 'of {{budget}} budget',
      ownDepartment: 'Own department',
      publish: 'Publish period report',
      published: 'Published on {{time}}.',
      reviewFirst: 'Mark the draft as reviewed and edited before publishing.',
      reviewedCheck: 'I have reviewed and edited the draft',
      roles: {
        approver: 'Spending Approver',
        finance: 'Finance',
        itAdmin: 'IT Admin',
        manager: 'Department head'
      },
      savingsImmediate: 'Savings realized now',
      savingsNextRenewal: 'Savings at next renewal',
      savingsSeparate: 'Two separate figures, never added together',
      subtitle: 'Step 3 of the close: optional AI draft, then publish the report scoped to each role.',
      title: '{{period}} period report',
      totalSpend: 'Total spend (period basis)',
      visibilityHint:
        'Department heads only see actuals and held commitments of their department — no budget or company totals.',
      visibilityTitle: 'Who sees what',
      visible: 'Visible'
    }
  }
} as const
