/** Finance (UF-11, UF-12, UF-19) and Spending Approver (UF-15) screens, plus shared budget wording. */
export const spendDashboard = {
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
      charges: 'Charges and legitimization',
      chargesHint: 'Charges without basis and vendor findings (BM-07)',
      nearestDeadline: 'Next: {{name}} — cancel by {{date}}',
      overdueHint: '{{count}} items past SLA',
      renewals: 'Renew / reduce / cancel proposals',
      requests: 'Requests awaiting spend decision',
      spendRegion: 'Spend and savings',
      subtitle:
        'What is waiting for your decision, plus total spend and savings. Finance only gives budget input for reference.',
      title: 'Hello {{name}}',
      totalSpend: 'Total spend {{period}}',
      urgentHint:
        'Sorted by SLA — when overdue the system reminds you and alerts Super Admin; it never reassigns or decides for you.',
      urgentTitle: 'Decide first',
      workRegion: 'Decisions waiting'
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
      askMore: 'Ask Finance more',
      costTitle: 'Cost and budget',
      fact: {
        cost: 'Estimated cost (borne)',
        costCenter: 'Cost Center · period',
        remainingAfter: 'Remaining if approved'
      },
      financeName: 'Finance',
      financePending: 'Waiting for Finance — your SLA keeps running.',
      questionPlaceholder:
        'E.g. If I approve this, does the Cost Center still cover the other pending requests this quarter?',
      questionRequired: 'Enter a question or comment for Finance.',
      questionLabel: 'Your question / comment',
      slaNotPaused: 'Asking does not pause the SLA clock; you can still decide before Finance answers.',
      summaryLabel: 'Request summary',
      topic: {
        BUDGET_TIMING: 'When a budget will exist',
        ENOUGH_BUDGET: 'Enough budget?',
        PENDING_IMPACT: 'Impact on pending requests',
        SUGGESTION: 'Suggested amount / timing'
      },
      topicLegend: 'What should Finance look at',
      urgency: { BEFORE_SLA: 'Before my SLA', NOT_URGENT: 'Not urgent', TODAY: 'Today' },
      urgencyLabel: 'Answer needed',
      you: 'You asked',
      approve: 'Approve',
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
      trailTitle: 'Approval trail'
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
      quantityInvalid: 'New quantity must be between {{min}} and {{max}} seats.',
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
    reports: {
      branchATitle: 'Seats granted via branch (a) this period — summary',
      days: '{{value}} days',
      financeRecording: 'Finance recording after approval (measured separately)',
      financeResponse: 'Finance answering questions (measured separately)',
      myOverdue: 'Share of my steps past SLA',
      processHint: 'KPI-2 split per step; Finance time is not added to the waiting path.',
      processTitle: 'Process performance — summary',
      reclaimedHint: 'Basis only — reclaiming does not add to savings by itself.',
      reclaimedSeats: 'Seats reclaimed',
      savingsLabel: 'Savings',
      seats: '{{count}} seats',
      spendHint: 'Period-basis borne cost by Cost Center.',
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
      usageTitle: 'Usage performance — summary'
    }
  },
  finance: {
    charts: {
      bva: {
        hint: 'Per Cost Center: the gray column is budget, the blue column is actual (borne cost).',
        title: 'Budget and actual {{period}}'
      },
      filter: {
        granularityLabel: 'View charts by',
        month: 'Month',
        note: {
          month: 'Monthly budget = quarter budget ÷ 3, for reference only (the organization budgets per quarter).',
          year: 'Year to date up to the current month; the yearly budget is the sum of the quarter budgets.'
        },
        periodLabel: 'Pick a period',
        quarter: 'Quarter',
        title: 'View by',
        year: 'Year',
        yearValue: 'Year {{year}}'
      },
      regionLabel: 'Finance charts',
      share: {
        hint: 'Share of actual spend by Cost Center; the Unallocated line stays gray.',
        title: '{{period}} actual spend by Cost Center'
      },
      shareColumn: 'Share',
      structure: {
        basis: 'Allocation basis',
        hint: 'Period cost split by the allocation rule that was applied.',
        title: '{{period}} cost structure by allocation basis'
      },
      usage: {
        hint: 'Each bar is one Cost Center budget: actual + held commitments + remaining. Cost Centers without a budget show only spent and committed amounts.',
        title: 'How the {{period}} budget is being used'
      }
    },
    nav: {
      budgetQuestions: 'Budget questions',
      budgets: 'Cost Centers & budgets',
      chargeExceptions: 'Charge exceptions',
      commitments: 'Commitments to record',
      costAnalysis: 'Allocation & budget vs actual',
      overview: 'Overview',
      periodClose: 'Period close',
      periodReport: 'Period report',
      sections: {
        budget: 'Budget',
        periodClose: 'Period close',
        reconciliation: 'Spend reconciliation'
      },
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
      closeHint: '{{count}} commitment remainders to review',
      closeStatus: 'Closing',
      commitmentsToRecord: 'Commitments to record',
      exceptionsHint: 'Need Finance and IT checks',
      formulaNote:
        'Finance is not on the spend approval path: it answers when asked and records after the Spending Approver approves.',
      openAction: 'Open →',
      openExceptions: 'Charge exceptions',
      openQuestions: 'Open budget questions',
      periodClose: 'Close {{period}}',
      questionsHint: 'From the Spending Approver — reference only, non-blocking',
      recordingHint: '{{count}} past their recording due time',
      subtitle: 'Open budget work for {{period}}. Each tile is the entry point to one task.',
      title: 'Finance dashboard',
      totalWithBudget: 'Total (Cost Centers with a budget)',
      withoutBudget: 'Cost Centers without a budget',
      workRegion: 'Open budget work'
    },
    questions: {
      answerTitle: 'Answer sent',
      backToList: 'Back to question list',
      colAsked: 'Asked by · time',
      colRequest: 'Request',
      colStatus: 'Status',
      contextTitle: 'Figures to answer with',
      factCostCenter: 'Cost Center · period',
      factRemainingAfter: 'Remaining if approved',
      factRemainingNow: 'Remaining now',
      questionTitle: "Spending Approver's question",
      replyTitle: 'Your answer',
      suggestedTag: 'Suggested',
      summaryLabel: 'Question summary',
      answeredNotice:
        "The answer now shows on the Spending Approver's decision screen. The spend step SLA was not paused.",
      askedBy: 'Asked by {{name}} at {{time}}',
      cancelledNotice: 'The request was cancelled, so the question closed with it.',
      empty: 'No questions.',
      filterLabel: 'Filter questions by status',
      noteLabel: 'Note for the Spending Approver',
      notePlaceholder: 'E.g. about 50 million left after held commitments.',
      noteRequired: 'A note is required.',
      opinionRequired: 'Choose an opinion.',
      replyLegend: 'Reply',
      requester: 'requested by {{name}}',
      ruleNotice:
        'Your answer is input for reference — not an approval and never blocking. The Spending Approver can decide at any time, even before you answer.',
      slaNote: 'Finance response time is measured separately.',
      sodBlocked:
        'You are the (substitute) Spending Approver of this request, so you cannot answer its budget question (SoD-8).',
      status: {
        ANSWERED: 'Answered',
        CLOSED_CANCELLED: 'Closed — request cancelled',
        OPEN: 'Open'
      },
      submit: 'Send answer',
      subtitle: 'The Spending Approver asks for the Cost Center and period budget position before deciding.',
      suggested: 'Snapshot suggests: {{opinion}}',
      title: 'Budget questions from the Spending Approver'
    },
    commitments: {
      approvedBy: 'approved by {{name}}',
      attached: 'Budget attached',
      awaitingBackfill: 'Awaiting back-fill',
      colBudget: 'Budget',
      colCommitment: 'Commitment',
      colDue: 'Recording due',
      colRequest: 'Request',
      emptyQueue: 'No commitments left to record.',
      noBudgetLocked: 'There is no budget for this Cost Center and period — the only possible opinion is No budget.',
      noteLabel: 'Note (optional)',
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
      budgetsTitle: 'Budgets for {{period}}',
      catalogHint: 'A Unit maps 1–1 to a department; Company carries company-wide cost.',
      catalogNote:
        'Splitting or merging departments ⟹ a new Cost Center and the old one retired; history is kept. No placeholder Cost Centers.',
      catalogTitle: 'Cost Center catalog',
      colAction: 'Action',
      colDepartment: 'Department',
      colKind: 'Kind',
      colStatus: 'Status',
      create: 'Create budget',
      createHint: 'Set a borne-cost limit for the Cost Center and period.',
      createTitle: 'Create budget {{costCenter}} · {{period}}',
      createdResult:
        'Budget {{costCenter}} is active; {{count}} commitments back-filled. Snapshots and reports use it immediately.',
      edit: 'Edit mid-period',
      editHint: 'Changing the amount mid-period requires a reason.',
      editNote:
        'History is kept; snapshots captured at decision time do not change; the Spending Approver is notified.',
      editTitle: 'Edit budget {{costCenter}} · {{period}}',
      editedResult: 'Budget {{costCenter}} updated and the Spending Approver notified.',
      kind: {
        COMPANY: 'Company',
        UNIT: 'Unit'
      },
      negativeExplain:
        'Negative remaining: commitments made before the budget existed exceed the new limit. The negative value is shown, never rounded to 0.',
      negativeResult:
        'Remaining is negative and labelled Over-committed; reports state the excess came from commitments made before the budget existed.',
      newCode: 'Cost Center code',
      newName: 'Name',
      periodType: 'Period type: {{type}} (set once by Super Admin)',
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
      title: 'Cost Centers & budgets'
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
      billingError: 'Vendor billing error',
      billingNote: 'Note (required)',
      billingNoteRequired: 'A note is required.',
      card: 'card ••{{last4}}',
      chargeTitle: 'Charge',
      closeBillingError: 'Close as billing error',
      empty: 'Nothing here.',
      evidence: 'Evidence ({{count}})',
      excess: 'Excess',
      filterLabel: 'Filter exceptions by status',
      itNote: 'IT Admin',
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
      committed: 'Committed',
      confirmRelease: 'Release',
      convertedHint: 'Each invoice converts exactly its amount from commitment to cost',
      convertedToCost: 'Converted to cost',
      heldRemainder: 'Held remainder',
      internalAmount: 'Amount (VND)',
      internalDescription: 'Cost description',
      internalHint:
        'No invoice or vendor needed. Each cost goes to exactly one Cost Center; to split, record several — no allocation ratios.',
      internalRequired: 'Enter a description, an amount above 0 and pick one Cost Center.',
      internalTitle: 'Internal software costs (FIN-31)',
      invoiceOutlook: 'Invoices',
      invoiced: 'Invoiced',
      matchedInvoices: 'Matched invoices',
      moreExpected: 'More invoices expected',
      noInvoice: 'No invoice expected',
      noMoreInvoices: 'No more invoices — last {{date}}',
      pickCostCenter: 'Pick a Cost Center',
      release: 'Release remainder',
      releaseDisabled: 'Invoices still expected — cannot release yet',
      releaseReason: 'Reason for releasing the remainder of {{code}} (required)',
      releaseReasonRequired: 'A reason is required.',
      released: 'Released',
      remainders: 'Remainders still held',
      remaindersHint: 'Release a remainder only when no further invoice will arrive.',
      remaindersTitle: 'Commitments with a remainder',
      subtitle:
        'Step 1 of closing {{period}}: convert commitments to cost from matched invoices and record internal costs.',
      summaryLabel: 'Period close summary',
      title: 'Close {{period}}',
      toAllocation: 'Allocate costs'
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
      subtitle: 'Step 2 of closing {{period}}: review allocation, compare budget with actuals and forecast.',
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
    report: {
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
      published: 'Published at {{time}}.',
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
