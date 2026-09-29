export const approvals = {
  nav: {
    dashboard: 'Dashboard',
    queue: 'Approval Queue',
    reports: 'Financial Reports',
    title: 'Approvals & Decisions'
  },
  reportsPage: {
    title: 'Financial Reports & SaaS Spend Analysis',
    subtitle:
      'Executive Deep-Dive Reports for Approver (CEO) — Track budget trends, waste indicators, and tech investment ROI',
    exportPdf: 'Export PDF Report',
    exportCsv: 'Export Excel/CSV',
    tabs: {
      budgetUtilization: 'Cost Center Budget',
      vendorBreakdown: 'Software Spend',
      wasteOptimization: 'Waste Analysis',
      commitmentsForecast: 'Commitments & Forecast'
    },
    filters: {
      categoryLabel: 'SaaS Category',
      allCategories: 'All Categories',
      devTools: 'Developer Tools & Cloud',
      collaboration: 'Collaboration & Workplace',
      design: 'Product Design & UX',
      security: 'Security & Compliance',
      statusLabel: 'Optimization Status',
      allStatuses: 'All Statuses',
      highWaste: 'Action Needed (High Waste)',
      optimized: 'Optimized (Efficient)'
    },
    tables: {
      softwareName: 'Software / Vendor Name',
      category: 'Category',
      seatsCount: 'Seats (Assigned / Total)',
      activeUsers: 'Active / Inactive',
      arrSpend: 'ARR Spend',
      wasteRisk: 'Estimated Waste',
      actions: 'Actions'
    },
    forecast: {
      title: '3-Month SaaS Spend Cash Flow Forecast',
      nextMonth: 'Oct 2026 (Projected)',
      followingMonth: 'Nov 2026 (Projected)',
      thirdMonth: 'Dec 2026 (Projected)'
    },
    highWasteTitle: 'High-Waste SaaS Subscriptions Breakdown',
    tableHeaders: {
      unassignedSeats: 'Unassigned Seats Waste',
      inactiveUsers: 'Inactive Users (>30 Days)',
      annualWaste: 'Est. Annual Waste',
      status: 'Status'
    },
    forecastNotes: {
      nextMonth: 'Jira Enterprise & GitHub seats renewal',
      followingMonth: 'Slack Grid H2-2026 payment',
      thirdMonth: 'Figma & Notion AI renewal'
    },
    softwareCount: '{{count}} apps',
    seatsFormat: '{{count}} seats',
    usersFormat: '{{count}} users',
    empty: 'No report data matching selected filters'
  },
  dashboard: {
    title: 'Executive Dashboard & Financial Reports',
    subtitle:
      'Executive Overview for Approver (CEO) · Track approval queue, budget utilization, and realized cost savings',
    metrics: {
      pendingValue: 'Pending Approval Value',
      urgentSla: 'Urgent Approvals (< 24h)',
      totalArr: 'Total SaaS Spend (ARR)',
      realizedSavings: 'Approved Real Savings',
      savingsNote: 'Optimized from downsizing & cancellation',
      yoyComparison: '+8.4% YoY'
    },
    filters: {
      title: 'Financial Reports Filter',
      periodLabel: 'Budget Period',
      costCenterLabel: 'Cost Center',
      allCostCenters: 'All Cost Centers',
      allPeriods: 'All Budget Periods',
      periodQ1: 'Q1-2026 Period',
      periodQ2: 'Q2-2026 Period',
      periodQ3: 'Q3-2026 Period',
      ccEngineering: 'Engineering & Core Backend (CC-ENG-02)',
      ccDesign: 'Product Design & UX (CC-DESIGN-01)',
      ccOps: 'Operations & IT Infrastructure (CC-OPS-03)',
      ccMkt: 'Marketing & Growth Tech (CC-MKT-04)'
    },
    reports: {
      budgetUtilizationTitle: 'Budget Utilization by Cost Center',
      vendorSpendTitle: 'SaaS Spend by Vendor',
      financialSummaryTitle: 'Financial Summary & Waste Highlights',
      pendingQueueTitle: 'Urgent Approval Queue Snapshot',
      tableCostCenter: 'Cost Center',
      tableBudget: 'Budget',
      tableSpent: 'Spent + Committed',
      tableRemaining: 'Remaining',
      tableUtilization: 'Utilization %',
      viewQueueBtn: 'Go to Approval Queue',
      urgentItemsCount: '{{count}} urgent items',
      wasteHighlight: 'Detected 18 unassigned seats and 12 inactive accounts. Potential savings of 45.000.000 ₫.',
      viewDetails: 'Review & Approve',
      filterReset: 'Reset Filter',
      statusNormal: 'Normal',
      statusWarning: 'Near Limit',
      statusDanger: 'Over Budget',
      viewAllQueue: 'View all (4)',
      requestedAmountLabel: 'Requested Amount',
      urgentSlaFormat: '{{hours}}h left (Urgent)',
      countUnits: '{{count}} units',
      arrPercentage: '{{percent}}% ARR'
    }
  },
  queue: {
    title: 'Approval Queue & Renewal Decisions',
    subtitle: 'Pending expense requests and subscription renewals ordered by SLA status',
    pendingDesc: 'Within approval SLA timeframe',
    urgentDesc: 'Decision required today',
    overdueDesc: 'SLA Reminder (No auto-reassign)',
    sodDesc: 'Pending Delegate action (Segregation of Duties)',
    deadlineFormat: 'Cancellation deadline: {{date}}',
    paidSeatsFormat: '{{count}} paid seats',
    overdueSlaFormat: 'Overdue SLA ({{hours}}h)',
    urgentSlaFormat: '{{hours}}h left (Urgent)',
    remainingSlaFormat: '{{hours}}h left',
    stats: {
      pending: 'Pending Approval',
      urgent: 'Urgent (< 24h)',
      overdue: 'Overdue SLA',
      sodConflict: 'Segregation of Duties Conflict'
    },
    filters: {
      searchPlaceholder: 'Search by SaaS name, requester, request ID...',
      allTypes: 'All Task Types',
      expense: 'New Expense Approval',
      renewal: 'Renewal Period Decision',
      newSaas: 'New SaaS Software',
      allUrgency: 'All Priorities',
      urgentOnly: 'SLA Urgent',
      sodOnly: 'Delegate Required (Segregation of Duties)'
    },
    table: {
      requestInfo: 'Request / Software',
      requester: 'Requester & Cost Center',
      type: 'Task Type',
      amount: 'Amount / Seats',
      sla: 'SLA Remaining',
      status: 'Status',
      actions: 'Actions'
    },
    types: {
      EXPENSE: 'Expense',
      RENEWAL: 'Renewal',
      NEW_SAAS: 'New SaaS'
    },
    badges: {
      sodAlert: 'Segregation of Duties Conflict (Beneficiary)',
      overdueAlert: 'SLA Overdue - No auto-reassign',
      managerApproved: 'Manager Verified',
      itAssessed: 'IT Risk Assessed'
    },
    actions: {
      review: 'Review & Decide',
      details: 'View Details'
    },
    empty: 'No pending requests in your approval queue'
  },
  panel: {
    expenseTitle: 'Expense Decision Panel',
    expenseSubtitle: 'Review expense request and budget snapshot',
    renewalTitle: 'Subscription Renewal Decision',
    renewalSubtitle: 'Select renewal option before cancellation deadline',
    sodWarningTitle: 'Segregation of Duties Warning',
    sodWarningDesc:
      'You are the requester or beneficiary of this request. Self-approval is prevented by system policy.',
    delegateInfo:
      'This approval step must be processed by your configured Delegate. If unconfigured, it remains in controlled pending state.',
    managerStatus: 'Direct Manager Verification',
    itRiskAssessment: 'IT Risk Assessment',
    itRiskLow: 'Low Risk (Security Verified)',
    itRiskMedium: 'Medium Risk (Security Notice)',
    itRiskHigh: 'High Risk (Security Unverified)',
    approveSuccessMsg:
      'Expense approved successfully! System automatically created HELD commitment and routed to IT Admin for provisioning.',
    rejectSuccessMsg: 'Expense request rejected. Rejection reason recorded and notified to requester.',
    askFinanceSuccessMsg: 'Inquiry submitted to Finance. Approval SLA countdown timer continues.',
    renewAsIsSuccessMsg: 'Decided to renew as-is! New period subscription record generated automatically.',
    downsizeSuccessMsg: 'Decided to downsize to {{seats}} seats! Real cost savings of {{amount}} recorded.',
    cancelSuccessMsg: 'Confirmed SERVICE CANCELLATION before deadline. Subscription will terminate at period end.',
    slaFormat: 'SLA: {{status}}',
    slaRemaining: '{{hours}}h remaining',
    slaOverdue: 'Overdue',
    softwareLabel: 'Software: {{name}}',
    requesterLabel: 'Requester',
    costCenterLabel: 'Cost Center',
    requestedAmountLabel: 'Requested Amount',
    requestDateLabel: 'Request Date',
    verificationHeader: 'Verification & Assessment Status',
    managerVerifiedNote: 'Need verified',
    snapshotTitle: 'BUDGET SNAPSHOT',
    periodBudgetLabel: 'Period Budget:',
    actualSpendLabel: 'Actual Spend:',
    heldCommitmentLabel: 'Held Commitments:',
    remainingBudgetLabel: 'Remaining Budget:',
    pendingApprovalLabel: 'Pending Approvals:',
    budgetUsageLabel: 'Budget Usage Percentage',
    actionsHeader: 'Decision Actions',
    sodLockedTitle: 'Action Locked per Segregation of Duties',
    sodLockedDesc: 'Only your designated Delegate can execute approval actions for this request.',
    cancellationLandmark: 'CANCELLATION DEADLINE: {{date}}',
    wasteBannerTitle: 'OPEN WASTE RECOMMENDATIONS',
    wasteRecommendationsCount: '{{count}} Recommendations',
    wasteBannerDesc:
      'System detected {{unassigned}} unassigned seats and {{inactive}} inactive users > 30 days. Downsizing seats upon renewal is recommended for cost optimization!',
    currentSeatsLabel: 'Current Seats',
    currentSeatsValue: '{{count}} Seats',
    renewalValueLabel: 'Renewal Value',
    deadlineLabel: 'Cancellation Deadline',
    usageEvidenceHeader: 'Real Usage Evidence',
    assignedLabel: 'Assigned',
    unassignedLabel: 'Unassigned',
    inactiveLabel: 'Inactive',
    renewAsIsDesc: 'Renew keeping current {{seats}} seats. Generates new period subscription record.',
    downsizeDesc: 'Reduce unused seats. Records real cost savings.',
    cancelDesc: 'Do not renew. Terminate service before cancellation deadline.',
    downsizeSeatsLabel: 'New Period Seat Count (Current: {{count}} seats)',
    reducedSeatsNote: 'Downsized by {{count}} seats compared to previous period',
    confirmCancelBtn: 'Confirm Service Cancellation',
    actions: {
      approve: 'Approve Expense',
      reject: 'Reject Expense',
      askFinance: 'Inquire Finance Info',
      renewAsIs: 'Renew As-Is',
      downsize: 'Downsize Seats (Savings)',
      cancel: 'Cancel Service'
    },
    rejectModal: {
      title: 'Confirm Expense Rejection',
      reasonLabel: 'Rejection Reason (Mandatory)',
      reasonPlaceholder: 'Enter detailed reason to notify the requester...',
      cancelBtn: 'Cancel',
      confirmBtn: 'Confirm Rejection'
    },
    askFinanceModal: {
      title: 'Inquire Finance Department',
      desc: 'System will submit budget check query to Finance. The approval step REMAINS yours and SLA timer does NOT stop.',
      notePlaceholder: 'Optional inquiry notes for Finance...',
      sendBtn: 'Send Inquiry'
    },
    renewalModal: {
      downsizeTitle: 'Confirm Seat Downsizing',
      seatsCount: 'New Period Seat Count',
      currentSeats: 'Current Seat Count',
      savingsCalculated: 'Calculated Real Savings',
      cancelTitle: 'Confirm SaaS Cancellation',
      cancelWarning: 'Warning: Service will terminate on the cancellation deadline. Active users will lose access.',
      activeUsersCount: 'Active Users Impacted',
      confirmDecision: 'Confirm Decision'
    }
  }
} as const
