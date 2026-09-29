export const finance = {
  nav: {
    title: 'Finance & Budgeting',
    dashboard: 'Dashboard',
    softwareDirectory: 'Software Cost Directory',
    snapshot: 'Budget Snapshot',
    renewals: 'Renewal Schedule & Deadlines',
    commitments: 'Budget Commitments',
    shadowIt: 'Unmapped SaaS Spend'
  },
  dashboard: {
    title: 'Financial Overview Dashboard',
    subtitle: 'Track aggregate SaaS spend, cost center budget utilization, and cost optimization',
    yoyComparison: '+8.4% YoY',
    mrrNote: 'Monthly Average',
    activeSubNote: 'Paid Subscriptions',
    savingsNote: 'From seat reclamation & downsizing',
    currentQuarter: 'Q3-2026',
    budgetPercentLabel: '{{percent}}% Budget',
    spendPercentLabel: '{{percent}}% Spend',
    metrics: {
      arr: 'Annual Spend (ARR)',
      mrr: 'Monthly Spend (MRR)',
      activeSubscriptions: 'Active Subscriptions',
      realizedSavings: 'Realized Savings'
    },
    costCenterChartTitle: 'Budget Allocation & Actual Spend by Cost Center',
    vendorBreakdownTitle: 'Top Vendor Spend Breakdown',
    savingsBreakdownTitle: 'Savings & Waste Analysis',
    totalBudgetLabel: 'Allocated Budget',
    actualSpendLabel: 'Actual Spend + Commitments'
  },
  directory: {
    title: 'SaaS Subscription Cost Directory',
    subtitle: 'Detailed inventory of all active paid software subscriptions across the organization',
    searchPlaceholder: 'Search by software name, vendor, cost center...',
    table: {
      software: 'Software / Vendor',
      pricingModel: 'Plan & Seats',
      annualCost: 'Annual Cost',
      costCenter: 'Cost Center',
      paymentMethod: 'Payment Method',
      status: 'Status'
    },
    seatsFormat: '{{assigned}} / {{total}} seats used',
    invoiceMethod: 'Corporate Invoice',
    cardMethod: 'Company Credit Card (...{{last4}})'
  },
  shadowIt: {
    title: 'Review & Map Unmapped SaaS Spend',
    subtitle: 'Detect unmapped SaaS transactions paid via corporate credit cards or expense reports',
    searchPlaceholder: 'Search transactions by vendor name, cardholder, card digits...',
    legalizeSuccessMsg: 'Transaction mapped successfully! Software added to official inventory.',
    inquireSuccessMsg: 'Inquiry ticket sent to employee and IT Admin.',
    rejectSuccessMsg: 'Non-compliant expense marked as rejected.',
    legalizeModalTitle: 'Confirm Software Mapping',
    legalizeModalDesc:
      'System will record this service in official SaaS Directory and assign expense to the Cost Center.',
    inquireModalTitle: 'Require Employee Expense Justification',
    inquireModalDesc: 'Send notification to cardholder to request business purpose and manager verification.',
    cardLabelFormat: 'Card ...{{last4}}',
    confirmLegalizeBtn: 'Confirm Mapping',
    confirmInquireBtn: 'Send Inquiry Ticket',
    table: {
      transaction: 'Transaction / SaaS Service',
      spender: 'Cardholder & Card',
      amount: 'Amount',
      date: 'Transaction Date',
      status: 'Processing Status',
      actions: 'Actions'
    },
    statuses: {
      FLAGGED: 'Unmapped Detected',
      INQUIRED: 'Awaiting Justification',
      LEGALIZED: 'Mapped',
      REJECTED: 'Rejected'
    },
    actions: {
      legalize: 'Map & Add',
      inquire: 'Inquire',
      reject: 'Reject'
    }
  },
  snapshot: {
    title: 'Budget Control Snapshot',
    subtitle: 'Manage budget period snapshots, actual spend, and limit check inquiries for Approver',
    periodFormat: 'Period {{period}}',
    actualSpendNote: 'Invoiced payments',
    heldNote: 'Held commitments',
    remainingNote: 'Available budget',
    pendingNote: 'Awaiting CEO',
    usageLabel: 'Budget Usage Percentage',
    modalTitle: 'Respond Budget Info ({{requestCode}})',
    selectStatusLabel: 'Select Budget Status',
    ruleInfoTitle: 'Budget Control Guidance',
    ruleInfoDesc:
      'Finance response provides budget context for the Approver. The response DOES NOT auto-approve or auto-block; approval SLA continues as normal.',
    notePlaceholder: 'Enter Finance remarks for the Approver...',
    cancelBtn: 'Cancel',
    confirmSendBtn: 'Confirm Response',
    respondedMsg: 'Budget status sent to Approver! Approval step SLA timer continues as normal.',
    requesterText: 'Requester: {{name}} | Cost Center: {{costCenter}} | Amount: {{amount}}',
    respondedBadge: '(Responded)',
    metrics: {
      totalBudget: 'Period Budget',
      actualSpend: 'Actual Spend',
      heldCommitment: 'Held Commitments',
      remaining: 'Remaining Budget',
      pendingApproval: 'Pending Approval'
    },
    inquiries: {
      title: 'Budget Inquiries from Approver',
      subtitle: 'Provide budget status for pending approval step — SLA timer continues as normal',
      respond: 'Respond Info',
      statusOptions: {
        withinLimit: 'Within Budget Limit',
        exceedsLimit: 'Exceeds Budget Limit',
        noBudget: 'No Unallocated Budget'
      },
      note: 'Finance notes (non-blocking, info-only)'
    }
  },
  renewals: {
    title: 'Subscription Renewal Schedule & Cancellation Deadlines',
    subtitle: 'Critical landmark is the CANCELLATION DEADLINE, not contract renewal date',
    searchPlaceholder: 'Search subscriptions by name or vendor...',
    vendorText: 'Vendor: {{vendor}} | {{seats}} seats ({{cost}}/yr)',
    landmarkText: 'Critical Landmark',
    cancellationDeadlineFormat: 'CANCELLATION DEADLINE: {{date}}',
    unassignedText: '{{unassigned}} unassigned seats, {{inactive}} inactive users',
    incidentBadge: 'Auto-renewal Incident Risk',
    pendingBadge: 'Awaiting CEO Decision',
    table: {
      subscription: 'Subscription / SaaS Plan',
      vendor: 'Vendor',
      seats: 'Seat Utilization',
      cancellationDeadline: 'Cancellation Deadline',
      renewalDate: 'Contract Renewal Date',
      wasteRecommendation: 'Waste Recommendation',
      status: 'Status',
      action: 'Actions'
    },
    waste: {
      badge: 'Waste Recommendation',
      unassignedSeats: '{{count}} unassigned seats',
      inactiveUsers: '{{count}} inactive users > 30 days',
      potentialSavings: 'Potential Savings: {{amount}}'
    },
    autoRenewalAlert: {
      title: 'Auto-Renewal Warning',
      desc: 'If unhandled prior to cancellation deadline, contract auto-renews and triggers an unhandled renewal incident.'
    }
  },
  commitments: {
    title: 'Held Budget Commitments',
    subtitle: 'Automatically created upon approval to reserve budget capacity',
    totalHeldLabel: 'TOTAL HELD BUDGET COMMITMENTS',
    subRuleText: 'Budget Reservation',
    subRuleDesc: 'Auto-reserved upon CEO approval',
    searchPlaceholder: 'Search by commitment ID, request ID, SaaS name...',
    reconcileInvoice: 'Reconcile Invoice',
    reconciledMsg: 'Invoice reconciled successfully! Amount converted from Commitment to Actual Spend.',
    table: {
      commitmentId: 'Commitment ID',
      requestRef: 'Request Reference',
      costCenter: 'Cost Center',
      amount: 'Committed Amount',
      createdAt: 'Created At',
      status: 'Status',
      actions: 'Reconciliation'
    },
    statuses: {
      HELD: 'Held (Committed)',
      RECONCILED: 'Invoiced & Reconciled',
      RELEASED: 'Released'
    }
  }
} as const
