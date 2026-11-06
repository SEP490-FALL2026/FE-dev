export const financeSpend = {
  invoiceIntake: {
    billedQuantity: 'Quantity on invoice',
    billedQuantityHint:
      'Checked against the approved seats only. The system does not store it yet, so it will not show when the invoice is reopened.',
    billedQuantityPlaceholder: 'e.g. 10',
    billedQuantityRequired: 'Enter the seats or units on the invoice (a whole number above 0).',
    title: 'Record invoices',
    description: 'Record purchase invoices against held commitments to reconcile actual spend.',
    modeLabel: 'How to enter invoices',
    modes: { manual: 'Manual entry', import: 'Import file' },
    step1: '1. Choose the commitment',
    step2: '2. Invoice details',
    department: 'Department',
    departmentPlaceholder: 'Choose a department',
    held: 'Held',
    noHeld: 'This department has no held commitments.',
    clear: 'Clear',
    recordedHeld: 'The commitment still holds {{amount}}.',
    preview: {
      purchase: 'Software · plan',
      approvedSeats: 'Approved seats',
      quantityMismatch:
        'Quantity mismatch: the invoice says {{quantity}}, {{seats}} seats were approved. Check the document before recording.',
      title: 'Preview',
      hint: 'Estimated from the invoice being entered. The official result comes back from the system after recording.',
      approved: 'Approved',
      heldNow: 'Held now',
      actualCost: 'Actual cost to record',
      heldAfter: 'Held after recording',
      expectedMatch: 'Expected match'
    },
    import: {
      dropTitle: 'Drag and drop an invoice file here',
      dropHint: 'Accepts .csv or .xlsx, one file at a time.',
      choose: 'Choose file',
      rejected: 'Only .csv or .xlsx files are accepted.',
      remove: 'Remove {{name}}',
      unavailable:
        'Invoice import is not supported by the system yet, so the file is not sent or processed. Use manual entry for now.',
      preview: 'Preview data'
    }
  },
  noValue: '—',
  unknown: 'Unknown',
  all: 'All',
  pickerUnavailable: 'The list to choose from could not be loaded. This filter is unavailable for now.',
  pickerTruncated: 'The list is too long, so a few entries may be missing.',
  batches: {
    title: 'Approved spend by batch',
    description:
      'Batches department heads sent on and what the spending approver approved, so you know which invoices are coming. Read only.',
    department: 'Department',
    departmentAll: 'All departments',
    submittedFrom: 'Sent from',
    submittedTo: 'Sent through',
    datePlaceholder: 'e.g. 2026-11-01',
    invalidWindow: 'The start date must be on or before the end date.',
    clearFilters: 'Clear filters',
    empty: 'No batch was sent within the current filters.',
    columns: {
      department: 'Department',
      submittedBy: 'Sent by',
      submittedAt: 'Sent at',
      itemCount: 'Requests',
      approvedCount: 'Approved',
      pendingCount: 'Pending',
      approvedAmounts: 'Approved amount'
    },
    detail: {
      title: 'Spend batch of {{department}}',
      fallbackTitle: 'Spend batch',
      department: 'Department code',
      submittedBy: 'Sent by',
      submittedAt: 'Sent at',
      itemCount: 'Requests',
      items: 'Requests in the batch',
      itemsEmpty: 'The batch has no requests to show.',
      position: 'Order',
      request: 'Request ID',
      outcome: 'Outcome when sent',
      stopReason: 'Stop reason',
      left: 'Left the batch',
      leftAt: '{{reason}} · {{at}}',
      requestState: 'Current state',
      notLeft: 'Still in batch'
    }
  },
  outcome: {
    SENT_TO_APPROVER: 'Sent to the spending approver',
    SENT_TO_FINANCE: 'Sent to Finance review',
    STOPPED: 'Stopped'
  },
  stopReason: {
    STALE_COST_EVIDENCE: 'Cost evidence is out of date',
    CLOSED_OR_EXPIRED_BUDGET_PERIOD: 'Budget period closed or expired',
    PRICE_MISSING: 'Price missing',
    RATE_MISSING: 'Exchange rate missing'
  },
  leftReason: {
    RETURNED_BY_FINANCE: 'Returned by Finance',
    CONFLICT_OF_INTEREST: 'Conflict of interest',
    REQUEST_WITHDRAWN: 'Request withdrawn',
    REQUEST_CANCELLED: 'Request cancelled'
  },
  requestState: {
    PENDING: 'Pending',
    WAITING_CONTROLLED: 'Controlled wait',
    AWAITING_EXECUTION: 'Awaiting execution',
    AWAITING_IT_ASSESSMENT: 'Awaiting IT assessment',
    AWAITING_SPEND_SUBMISSION: 'Awaiting spend submission',
    AWAITING_FINANCE_REVIEW: 'Awaiting Finance review',
    AWAITING_BUDGET: 'Awaiting budget',
    AWAITING_SPEND_DECISION: 'Awaiting spend decision',
    REJECTED: 'Rejected',
    IT_REJECTED: 'Rejected by IT',
    EXECUTING: 'Executing',
    COMPLETED: 'Completed',
    FAILED: 'Failed',
    AWAITING_IT_CLOSE: 'Awaiting IT close',
    WITHDRAWN: 'Withdrawn',
    CANCELLED: 'Cancelled'
  },
  commitments: {
    title: 'Held commitments',
    description:
      'Approved spend of each department. Record invoices to reconcile them and update actual spend on the cost center.',
    costCenter: 'Cost center',
    costCenterAll: 'All cost centers',
    year: 'Fiscal year',
    yearPlaceholder: 'e.g. 2026',
    invalidYear: 'Enter a year from 2000 to 2200, or leave it empty for every year.',
    state: 'State',
    stateAll: 'All states',
    empty: 'No commitment matches the filters.',
    columns: {
      software: 'Software',
      requester: 'Requester',
      amount: 'Approved',
      released: 'Released',
      held: 'Held',
      invoiced: 'Actual spend',
      state: 'State'
    },
    noPlan: 'No plan',
    requestUnavailable: 'Request unavailable',
    discrepancy: 'Over approved amount',
    invoiceCountValue: 'Invoices: {{count}}',
    detail: {
      fallbackTitle: 'Commitment',
      missingRequest: 'The link is missing the request. Open the commitment again from the list.',
      notFound: 'This commitment was not found. It may have changed or be outside your access scope.',
      figures: 'Commitment figures',
      request: 'Request',
      plan: 'Plan',
      requester: 'Requester',
      beneficiaries: 'Beneficiaries',
      spendApprovedAt: 'Spend approved at',
      costCenter: 'Cost center',
      year: 'Fiscal year',
      discrepancyNote:
        'The invoiced price before tax is over the approved amount. The invoices still count as actual spend.'
    },
    invoices: {
      title: 'Recorded invoices',
      empty: 'No invoice has been recorded for this commitment.',
      number: 'Invoice number',
      issuedOn: 'Invoice date',
      netAmount: 'Price before tax',
      deductibleTax: 'Deductible VAT',
      nonDeductibleTax: 'Non-deductible tax',
      actualCost: 'Actual spend',
      matchResult: 'Reconciliation',
      recordedBy: 'Recorded by',
      recordedAt: 'Recorded at',
      note: 'Note',
      system: 'System'
    },
    record: {
      action: 'Record invoice',
      title: 'Record an invoice for the commitment',
      submit: 'Record invoice',
      cancel: 'Cancel',
      numberPlaceholder: 'e.g. INV-2026-0912',
      issuedOnPlaceholder: 'e.g. 2026-11-05',
      netAmountPlaceholder: 'e.g. 12000000',
      deductibleTaxPlaceholder: 'e.g. 1200000',
      nonDeductibleTaxPlaceholder: 'e.g. 500000',
      notePlaceholder: 'e.g. November invoice',
      amountHint: 'In {{currency}}, with a dot for decimals.',
      deductibleTaxHint: 'Shown separately, not part of actual spend. Leave empty if none.',
      nonDeductibleTaxHint: 'Added to actual spend. Leave empty if none.',
      actualCostHint: 'Actual spend = price before tax + non-deductible tax.',
      success: 'Invoice {{number}} recorded.',
      resultMATCHED: 'The invoice matches the approved amount.',
      resultTAX_ONLY: 'The invoice differs only by tax.',
      resultPRICE_QUANTITY_EXCEPTION: 'The invoices are now over the approved amount and flagged as a discrepancy.',
      errors: {
        numberRequired: 'Enter the invoice number.',
        numberLength: 'The invoice number can be up to 64 characters.',
        duplicate: 'The vendor already has an invoice with this number.',
        issuedOnRequired: 'Choose the invoice date.',
        amountRequired: 'Enter the price before tax.',
        amountInvalid: 'Enter a non-negative number with digits and one dot only, e.g. 12000000.',
        amountPositive: 'The price before tax must be more than 0.',
        amountScale: '{{currency}} allows up to {{digits}} decimal places.',
        amountRange: 'The amount is outside the allowed range.',
        noteLength: 'The note can be up to 1000 characters.',
        invalid: 'This value is invalid.'
      }
    },
    release: {
      action: 'Release remainder',
      title: 'Release the remainder',
      summary: 'Return the {{amount}} still held to the budget. Money already expensed is not changed.',
      reason: 'Reason',
      reasonPlaceholder: 'e.g. The request ended and the vendor confirmed no further invoice',
      reasonHint: 'Release only when no further invoice is expected.',
      reasonRequired: 'Enter a reason for the release.',
      reasonLength: 'The reason can be up to 1000 characters.',
      submit: 'Release',
      cancel: 'Cancel',
      success: 'The remainder of the commitment was released.'
    },
    releases: {
      title: 'Release history',
      empty: 'Nothing has been released yet.',
      amount: 'Amount',
      reason: 'Reason',
      releasedBy: 'Released by',
      releasedAt: 'Released at',
      system: 'System'
    }
  },
  matchResult: {
    MATCHED: 'Matched',
    TAX_ONLY: 'Tax difference only',
    PRICE_QUANTITY_EXCEPTION: 'Over approved amount'
  },
  releaseReason: {
    REQUEST_CANCELLED: 'Request cancelled',
    REQUEST_WITHDRAWN: 'Request withdrawn',
    GRANT_FAILED: 'Grant failed',
    PARTICIPANT_WITHDRAWN: 'Participant withdrew from the group',
    REMAINDER: 'Remainder released by Finance'
  }
}
