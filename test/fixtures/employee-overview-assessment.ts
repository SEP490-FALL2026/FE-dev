import type { AssessmentResponseDtoDataAssessment } from '~/shared/api/generated/model/access-requests/assessmentResponseDtoDataAssessment'
import type { EmployeeDashboardResponseDtoData } from '~/shared/api/generated/model/dashboards/employeeDashboardResponseDtoData'
import { person, pricing, requestId } from './employee-api'

export const employeeDashboard: NonNullable<EmployeeDashboardResponseDtoData> = {
  asOf: '2026-11-01',
  sections: {
    softwareRights: { state: 'COUNTED', count: 12, sourceOperationId: 'meSoftwareRightList', reason: null },
    expiringRights: { state: 'COUNTED', count: 0, sourceOperationId: null, reason: null },
    requests: { state: 'COUNTED', count: 0, sourceOperationId: 'meAccessRequestList', reason: null },
    saasIssues: { state: 'AT_SOURCE', count: null, sourceOperationId: 'saasIssueList', reason: null }
  }
}

export const requestAssessment: AssessmentResponseDtoDataAssessment = {
  requestId,
  status: 'COMPLETED',
  proposal: {
    softwareName: 'Proposed software',
    homepageUrl: 'https://example.test',
    purpose: 'Design work',
    dataDescription: 'Project designs',
    expectedUsers: 3
  },
  step: {
    state: 'APPROVED',
    assignee: person,
    waitingReason: null,
    slaWorkingDays: 3,
    assignedAt: null,
    decidedAt: null
  },
  classification: 'PAID_LICENSED',
  vendor: { vendorId: null, name: 'Test vendor' },
  plannedPlanName: 'Business',
  provisioningType: 'K1',
  adminConsole: true,
  memberExport: false,
  sso: null,
  termsSummary: 'Annual commitment',
  memberUsageMethod: 'Admin report',
  grantRevokeMethod: 'IT console',
  dataSensitivity: 'LOW',
  opinion: null,
  equivalentTool: null,
  proposedBusinessOwner: person,
  controlLevel: 'FULL',
  controlRiskNote: 'Reviewed by IT',
  quote: {
    unitPrice: pricing.amount,
    billingCycle: 'ANNUAL',
    validFrom: '2026-11-01',
    validUntil: null,
    commitmentMonths: 12,
    paymentFrequency: 'UPFRONT_ONCE',
    firstPaymentOn: null
  },
  complete: true,
  pricing,
  costEstimate: null,
  completedBy: person,
  completedAt: '2026-11-01T03:00:00Z',
  rejection: null
}
