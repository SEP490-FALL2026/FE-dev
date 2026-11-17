import { NeedDecisionBodyDtoChecklistAnswersItemAnswer } from '~/shared/api/generated/model/access-requests/needDecisionBodyDtoChecklistAnswersItemAnswer'

/** Answer to one checklist question; every decision route shares these two codes. */
export const CHECKLIST_ANSWER = NeedDecisionBodyDtoChecklistAnswersItemAnswer
export type ChecklistAnswer = (typeof CHECKLIST_ANSWER)[keyof typeof CHECKLIST_ANSWER]
