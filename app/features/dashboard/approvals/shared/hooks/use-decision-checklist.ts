import { isAxiosError } from 'axios'
import { useMemo, useState } from 'react'
import { usePolicyStepGet } from '~/shared/api/generated/operations/policies/policy-step-get'

export const CHECKLIST_ANSWER = { YES: 'YES', NO: 'NO' } as const
export type ChecklistAnswer = (typeof CHECKLIST_ANSWER)[keyof typeof CHECKLIST_ANSWER]

/** Policy steps of the approver decisions that carry a checklist. */
export const DECISION_STEP = {
  SPEND: { policyCode: 'POL-MF1', stepCode: '1.7' },
  BUDGET_VERSION: { policyCode: 'POL-MF4', stepCode: '4.7' }
} as const
export type DecisionStep = (typeof DECISION_STEP)[keyof typeof DECISION_STEP]

export interface ChecklistPayload {
  policyVersionId: string
  answers: { itemCode: string; answer: ChecklistAnswer }[]
}

/**
 * Loads the checklist of one decision step and keeps the person's answers.
 * `SYSTEM` items are answered by the server, `PERSON` items need a Yes/No from the decider.
 */
export function useDecisionChecklist(step: DecisionStep) {
  const query = usePolicyStepGet(step.policyCode, step.stepCode, { query: { staleTime: 0 } })
  const data = query.data?.data
  const items = useMemo(() => data?.step?.checklist ?? [], [data])
  const versionId = data?.policyVersionId
  // Answers belong to one policy version: a newer version has other items, so earlier answers no longer apply.
  const [stored, setStored] = useState<{ versionId?: string; values: Record<string, ChecklistAnswer> }>({ values: {} })
  const answers = stored.versionId === versionId ? stored.values : {}

  const personItems = items.filter((item) => item.check === 'PERSON')
  const complete = Boolean(versionId) && personItems.every((item) => answers[item.code] !== undefined)
  const noItems = personItems.filter((item) => answers[item.code] === CHECKLIST_ANSWER.NO)
  const hasNo = noItems.length > 0

  const payload = (): ChecklistPayload | null =>
    versionId && complete
      ? {
          policyVersionId: versionId,
          answers: personItems.map((item) => ({ itemCode: item.code, answer: answers[item.code] }))
        }
      : null

  return {
    query,
    items,
    answers,
    setAnswer: (code: string, answer: ChecklistAnswer) =>
      setStored((previous) => ({
        versionId,
        values: { ...(previous.versionId === versionId ? previous.values : {}), [code]: answer }
      })),
    complete,
    hasNo,
    noItems,
    payload,
    /** Used when the server answers 409 POLICY.VERSION_CHANGED. */
    reload: () => query.refetch(),
    /** Pass as the per-call `onError` of a decision: a newer policy version reloads the questions. */
    handleError: (error: unknown) => {
      const code = isAxiosError(error)
        ? (error.response?.data as { error?: { code?: string } } | undefined)?.error?.code
        : undefined
      if (code === 'POLICY.VERSION_CHANGED') void query.refetch()
    }
  }
}
export type DecisionChecklist = ReturnType<typeof useDecisionChecklist>
