export const itAdminShadowItExtra = {
  kicker: 'External software requests',
  title: 'Software requests outside the catalog',
  intro:
    'Review employee requests for new software and AI tools, approve or reject them, and assign individual beneficiaries.',
  search: 'Search software or requester...',
  empty: 'No external software requests in this group',
  requester: 'Requested by:',
  submittedAt: '· Submitted:',
  beneficiaries: 'beneficiaries',
  plan: 'Plan:',
  productPage: 'Product page',
  purpose: 'Purpose of request:',
  estimatedCost: 'Estimated cost:',
  term: 'Requested term:',
  beneficiaryList: 'Beneficiaries (',
  peopleClose: 'people)',
  splitNotice: '* Approval creates a separate provisioning task for each beneficiary under the original request code.',
  nextSteps: 'Next steps after approval:',
  nextStepsHelp:
    'The request is approved in principle. To make it ready for provisioning, IT Admin must add the plan to the department catalog and import purchase documents:',
  addPlan: '1. Add the plan to the catalog',
  importPurchase: '2. Import purchase documents',
  rejectionReason: 'Reason for rejection:',
  rejectedBy: 'Rejected by:',
  atTime: '· At:',
  reject: 'Reject request',
  approve: 'Approve request',
  decisionMade: 'A decision has been made for this request (',
  approveKicker: 'Approve external software request',
  approveTitle: 'Confirm approval of request',
  forDepartment: 'for department',
  decisionNote: 'Decision note:',
  decisionNotePlaceholder: 'Enter a note or additional purchase requirements...',
  cancel: 'Cancel',
  confirmApprove: 'Confirm approval',
  rejectKicker: 'Reject external software request',
  rejectionHelp: 'Enter a reason for rejection. The requester (',
  rejectionHelpEnd: ') will receive this explanation:',
  rejectionPlaceholder:
    'For example: the tool lacks required data security certification, or a comparable tool is already in the catalog...',
  confirmReject: 'Confirm rejection',
  acceptedNote: 'Approved in principle. Awaiting catalog setup and license purchase.',
  approvedToast: 'Approved {{software}}. The request is now awaiting setup and purchase.',
  rejectionRequired: 'Enter a reason for rejection (required).',
  rejectedToast: 'Rejected {{software}}. The requester will receive the reason.',
  pendingDecision: 'Awaiting decision',
  pendingConfig: 'Awaiting setup and purchase',
  accepted: 'Approved',
  rejected: 'Rejected',
  ready: 'Ready to provision',
  all: 'All',
  requestDetails: {
    'EXT-REQ-101': {
      purpose: 'Provide a VS Code based AI code editor to speed up Golang and React development.',
      cost: '$20 / person / month',
      duration: '12 months (annual subscription)'
    },
    'EXT-REQ-102': {
      purpose: 'Create concept illustrations for a brand campaign.',
      cost: '$60 / month',
      duration: '3-month trial'
    },
    'EXT-REQ-103': {
      purpose: 'Research technical topics and summarize detailed documentation.',
      cost: '$40 / month',
      duration: '12 months'
    },
    'EXT-REQ-104': {
      purpose: 'Look up terminal commands and analyze system logs.',
      cost: '$20 / month',
      duration: '6 months'
    }
  },
  priorDecisionNote:
    'Approved in principle. Add the plan to the department catalog (IT-11) and import a purchase contract (IT-06) before provisioning.',
  priorRejectionReason:
    'Does not meet information security requirements: Phind has not committed to avoiding storage of company source code.',
  staffEngineer: 'Staff Engineer',
  operationsEngineer: 'Operations Engineer'
} as const
