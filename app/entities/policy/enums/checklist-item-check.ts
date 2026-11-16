import { PolicyStepResponseDtoDataStepChecklistItemCheck } from '~/shared/api/generated/model/policies/policyStepResponseDtoDataStepChecklistItemCheck'

/** Who answers a question: `SYSTEM` is checked by the server and shown as Yes; `PERSON` must be answered. */
export const CHECKLIST_ITEM_CHECK = PolicyStepResponseDtoDataStepChecklistItemCheck
export type ChecklistItemCheck = (typeof CHECKLIST_ITEM_CHECK)[keyof typeof CHECKLIST_ITEM_CHECK]
