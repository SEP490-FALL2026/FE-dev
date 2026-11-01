import { AssessmentStatus } from '../enums/assessment-status'
import { AssessmentClassification } from '../enums/assessment-classification'
import { RequestState } from '../enums/request-state'
import { RequestBranch } from '../enums/request-branch'
export function canLinkCatalogPlan(
  assessment: { status: string; classification: string | null; equivalentTool: { planId: string } | null },
  request: { branch: string; state: string; plan: unknown } | null | undefined,
  authorized: boolean
) {
  return (
    authorized &&
    assessment.status === AssessmentStatus.COMPLETED &&
    assessment.classification === AssessmentClassification.PAID_LICENSED &&
    Boolean(assessment.equivalentTool?.planId) &&
    request?.branch === RequestBranch.NEW_SOFTWARE &&
    request.state === RequestState.AWAITING_EXECUTION &&
    request.plan === null
  )
}
