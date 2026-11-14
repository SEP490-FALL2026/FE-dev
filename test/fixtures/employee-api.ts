import type {
  AccessRequestResponseDtoDataRequest,
  GroupCheckResponseDtoData,
  MeResponseDtoData,
  PreviewResponseDtoDataPreview,
  SaasIssueResponseDtoData
} from '~/shared/api/generated/model'

export const employeeId = '11111111-1111-4111-8111-111111111111'
export const planId = '22222222-2222-4222-8222-222222222222'
export const requestId = '33333333-3333-4333-8333-333333333333'
export const assignmentId = '44444444-4444-4444-8444-444444444444'
export const employeeProfile: NonNullable<MeResponseDtoData> = {
  managerScope: null,
  upcomingUnits: [],
  appUserId: employeeId,
  loginEmail: 'employee@example.test',
  employee: {
    unplaced: false,
    id: employeeId,
    employeeCode: 'EMP-TEST',
    fullName: 'Test Employee',
    department: { code: 'ENG', name: 'Engineering' },
    jobTitle: 'Engineer'
  },
  roles: ['EMPLOYEE']
}
export const plan = { planId, planName: 'Standard', applicationId: planId, applicationName: 'Test Software' }
export const person = { employeeId, employeeCode: 'EMP-TEST', fullName: 'Test Employee' }
export const pricing = {
  status: 'PRICED',
  missingReason: null,
  amount: { amount: '9007199254740993.25', currency: 'USD' },
  unitPrice: { amount: '20', currency: 'USD' },
  billingCycle: 'MONTHLY',
  kind: 'RECURRING',
  months: 3,
  monthlyPrice: { amount: '20', currency: 'USD' },
  nextYearAmount: null
} as const
export const groupCheck: NonNullable<GroupCheckResponseDtoData> = {
  plan: { eligible: true, reason: null },
  tooManyLines: null,
  tooFewLines: null,
  maxEndDate: '2027-10-31',
  endDateOutOfRange: false,
  lines: [{ employeeId, ok: true, reason: null, manyPaidSoftware: null }],
  lineCount: 1,
  hasSpendStep: true,
  pricing,
  amountPerPerson: null
}
export const accessRequest: AccessRequestResponseDtoDataRequest = {
  limitExemption: null,
  id: requestId,
  type: 'GRANT',
  branch: 'PAID_IN_CATALOG',
  state: 'PENDING',
  routing: { mode: 'VIA_HEAD', oneStepReason: null },
  flags: { manyPaidSoftware: null },
  plan,
  proposal: null,
  department: { id: employeeId, code: 'ENG', name: 'Engineering' },
  costCenter: null,
  requester: person,
  beneficiary: person,
  lineCount: 1,
  businessReason: 'Development work',
  termMonths: 3,
  expectedEndDate: null,
  serviceAccount: null,
  renewal: null,
  spend: null,
  budgetYear: null,
  pricing,
  policy: { version: 1, hasSpendStep: true, slaWorkingDays: 3 },
  submittedAt: '2026-10-31T03:00:00Z',
  needStep: {
    id: requestId,
    state: 'PENDING',
    assignee: null,
    routingRow: 1,
    waitingReason: null,
    slaWorkingDays: 3,
    createdAt: '2026-10-31T03:00:00Z',
    assignedAt: null,
    decidedAt: null
  },
  needDecision: null,
  withdrawal: null,
  cancellation: null
}
export const requestPreview: PreviewResponseDtoDataPreview = {
  limitExemption: null,
  maxEndDate: '2027-10-31',
  termRequired: false,
  annualVendorAmount: null,
  limits: {
    openNewCount: 0,
    openNewMax: 3,
    paidSoftwareCount: 0,
    paidSoftwareThreshold: 10,
    reasonRequired: false,
    refusal: null,
    openRequestId: null
  },
  blockedBy: null,
  plan,
  branch: 'PAID_IN_CATALOG',
  expectedEndDate: null,
  department: { id: employeeId, code: 'ENG', name: 'Engineering' },
  costCenter: null,
  existingAccess: null,
  canSubmit: true,
  budgetYear: null,
  pricing,
  costEstimate: null,
  spendSubmission: 'ALLOWED',
  chain: [],
  totalExpectedWorkingDays: 3
}
export const softwareIssue: NonNullable<SaasIssueResponseDtoData> = {
  id: requestId,
  code: 'ISSUE-TEST',
  state: 'WAITING_REPORTER',
  category: 'NO_ACCESS',
  impact: 'UNUSABLE',
  assignmentId,
  plan,
  reporter: person,
  assignedItAdmin: { employeeId, fullName: 'IT Admin', employeeCode: 'IT-TEST' },
  responseDueOn: '2026-11-02',
  overdue: false,
  createdAt: '2026-10-31T03:00:00Z',
  updatedAt: '2026-10-31T03:00:00Z',
  occurredAt: '2026-10-31T02:00:00Z',
  description: 'Cannot sign in',
  grantTaskId: null,
  assignedByFallback: false,
  resolution: null,
  vendorTicketRef: null,
  linkedWork: { grantTaskId: null, discrepancyId: null, returnId: null, requestId: null },
  duplicateOf: null,
  duplicateReason: null,
  resolvedAt: null,
  reopenUntil: null,
  closedAt: null,
  reopenCount: 0
}
export function pageResponse(items: unknown[] = [], page = 1, totalPages = 1) {
  return {
    success: true,
    message: 'TEST.LISTED',
    data: { items, pagination: { page, pageSize: 20, totalItems: items.length, totalPages } }
  }
}
