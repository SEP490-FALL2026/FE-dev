import { useState } from 'react'
import { usePolicyStepGet } from '~/shared/api/generated/operations/policies/policy-step-get'
import { CHECKLIST_ANSWER, type ChecklistAnswer } from '../enums/checklist-answer'
import { CHECKLIST_ITEM_CHECK } from '../enums/checklist-item-check'
import type { PolicyStep } from '../policy-steps'

/** Body field `checklist` that every decision route of a policy step accepts. */
export interface PolicyChecklistBody {
  policyVersionId: string
  answers: { itemCode: string; answer: ChecklistAnswer }[]
}

/**
 * Loads the checklist of the policy in force at a step and keeps the person's answers. Answers belong to one policy
 * version: when a new version is loaded (for example after `POLICY.VERSION_CHANGED`) they start empty again.
 */
export function usePolicyChecklist(step: PolicyStep, enabled = true) {
  const query = usePolicyStepGet(step.policyCode, step.stepCode, {
    query: { enabled, staleTime: 0, gcTime: 0 }
  })
  const data = !query.isError ? query.data?.data : null
  const [state, setState] = useState<{ versionId: string; answers: Record<string, ChecklistAnswer> }>({
    versionId: '',
    answers: {}
  })
  const answers = data && state.versionId === data.policyVersionId ? state.answers : {}
  const items = data?.step.checklist ?? []
  const answerOf = (code: string, check: string) =>
    check === CHECKLIST_ITEM_CHECK.SYSTEM ? CHECKLIST_ANSWER.YES : answers[code]
  const complete = !!data && items.every((item) => !!answerOf(item.code, item.check))
  const failedItems = items.filter((item) => answerOf(item.code, item.check) === CHECKLIST_ANSWER.NO)
  const body: PolicyChecklistBody | undefined =
    enabled && !query.isFetching && data && complete
      ? {
          policyVersionId: data.policyVersionId,
          answers: items.map((item) => ({ itemCode: item.code, answer: answerOf(item.code, item.check) }))
        }
      : undefined
  return {
    query,
    policy: data,
    items,
    answerOf,
    setAnswer: (code: string, answer: ChecklistAnswer) => {
      if (!data) return
      setState({ versionId: data.policyVersionId, answers: { ...answers, [code]: answer } })
    },
    /** Every person question is answered; `body` is ready to send. */
    complete,
    /** At least one answer is No: the step's forward decision is locked. */
    hasNo: failedItems.length > 0,
    failedItems,
    body,
    matches: (submitted: PolicyChecklistBody | undefined) =>
      !!body && JSON.stringify(submitted) === JSON.stringify(body),
    /** Quick answer: every person question Yes. Each answer can still be changed afterwards. */
    answerAllYes: () => {
      if (!data) return
      const next = { ...answers }
      for (const item of items) if (item.check === CHECKLIST_ITEM_CHECK.PERSON) next[item.code] = CHECKLIST_ANSWER.YES
      setState({ versionId: data.policyVersionId, answers: next })
    },
    /** Drops the answers and loads the version in force again. */
    reload: () => {
      setState({ versionId: '', answers: {} })
      void query.refetch()
    }
  }
}

export type PolicyChecklistState = ReturnType<typeof usePolicyChecklist>
