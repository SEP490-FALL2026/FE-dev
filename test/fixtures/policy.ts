import { http, HttpResponse } from 'msw'
import { fireEvent, screen } from '@testing-library/react'

export const policyVersionId = '77777777-7777-4777-8777-777777777777'

/** Checklist of any policy step: one question the system answers and one the person must answer. */
export const policyStepHandlers = [
  http.get('*/api/v1/policies/:code/steps/:step', ({ params }) =>
    HttpResponse.json({
      success: true,
      data: {
        policyCode: params.code,
        policyVersionId,
        versionNumber: 1,
        step: {
          code: params.step,
          title: 'Policy step',
          checklist: [
            { code: `${String(params.step)}-01`, text: 'Checked by the system', check: 'SYSTEM' },
            { code: `${String(params.step)}-02`, text: 'The need is justified', check: 'PERSON' }
          ]
        }
      }
    })
  )
]

/** Body the checklist component sends once every person question is answered Yes. */
export function checklistBody(step: string) {
  return {
    policyVersionId,
    answers: [
      { itemCode: `${step}-01`, answer: 'YES' },
      { itemCode: `${step}-02`, answer: 'YES' }
    ]
  }
}

/** Answers every person question of the visible checklist with Yes or No. */
export async function answerChecklist(answer: 'Yes' | 'No' = 'Yes') {
  const groups = await screen.findAllByRole('radiogroup', { name: 'The need is justified' })
  for (const group of groups) {
    const option = Array.from(group.querySelectorAll('label')).find((label) => label.textContent === answer)
    const input = option?.querySelector('input')
    if (input) fireEvent.click(input)
  }
}
