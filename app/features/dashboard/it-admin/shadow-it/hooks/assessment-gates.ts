import { AssessmentStatus } from '../enums/assessment-status'
import { AssessmentClassification } from '../enums/assessment-classification'
export function canCompleteAssessment(
  item: { complete: boolean; status: string; classification: string | null },
  authorized: boolean
) {
  return (
    authorized &&
    item.complete &&
    item.status === AssessmentStatus.DRAFT &&
    item.classification === AssessmentClassification.PAID_LICENSED
  )
}
