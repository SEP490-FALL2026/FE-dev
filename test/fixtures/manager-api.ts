import type {
  AccessRequestResponseDtoDataRequest,
  QueueResponseDtoDataItemsItem,
  ProposalResponseDtoDataProposal
} from '~/shared/api/generated/model'
import { accessRequest, employeeProfile, person, planId, requestId, employeeId, pricing } from './employee-api'

export const managerId = '55555555-5555-4555-8555-555555555555'
export const managerProfile = {
  ...employeeProfile,
  employee: { ...employeeProfile.employee, id: managerId, fullName: 'Test Manager' },
  roles: { direct: ['EMPLOYEE'], derived: ['MANAGER'], effective: ['EMPLOYEE', 'MANAGER'] }
}
export const managerRequest: AccessRequestResponseDtoDataRequest = {
  ...accessRequest,
  needStep: { ...accessRequest.needStep, assignee: { ...person, employeeId: managerId, fullName: 'Test Manager' } }
}
export const queueItem: QueueResponseDtoDataItemsItem = {
  requestId,
  plan: { planId, planName: 'Standard', applicationName: 'Test Software' },
  softwareName: null,
  requester: person,
  beneficiary: person,
  lineCount: 1,
  amount: pricing.amount,
  expectedSpendOn: '2026-11-10',
  budgetYear: 2026,
  stage: 'NOT_SUBMITTED',
  blockedReason: null,
  financeReturnReason: null,
  offPlan: true,
  planLineAttached: false,
  readyToSubmit: true,
  updatedAt: '2026-10-31T03:00:00Z',
  queuedAt: null,
  waitedWorkingDays: 0,
  overdue: false,
  reminders: 0
}
export const proposal: ProposalResponseDtoDataProposal = {
  id: requestId,
  costCenter: { id: employeeId, code: 'ENG', name: 'Engineering' },
  year: 2027,
  state: 'SUBMITTED',
  previousProposalId: null,
  successorOfProposalId: null,
  successorProposalId: null,
  total: pricing.amount,
  submittedBy: { ...person, employeeId: managerId },
  submittedAt: '2026-10-31T03:00:00Z',
  returned: null,
  withdrawnAt: null,
  succeededAt: null,
  closedAt: null
}
