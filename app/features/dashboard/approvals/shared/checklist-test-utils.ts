import { fireEvent, screen } from '@testing-library/react'

export const checklistVersionId = '3f6c2a1e-7b4d-4c8e-9a21-000000000901'
/** The `answers` a test expects after answering every person question Yes. */
export const yesAnswers = [
  { itemCode: 'P-01', answer: 'YES' },
  { itemCode: 'P-02', answer: 'YES' }
]
export const expectedChecklist = { policyVersionId: checklistVersionId, answers: yesAnswers }

/** Body for `GET /policies/{code}/steps/{stepCode}` in a test adapter. */
export function policyStepData(url: string) {
  const match = /\/policies\/([^/]+)\/steps\/([^/?]+)/.exec(url)
  return {
    policyCode: match?.[1] ?? 'POL-MF1',
    policyVersionId: checklistVersionId,
    versionNumber: 1,
    step: {
      code: match?.[2] ?? '1.7',
      title: 'Step',
      checklist: [
        { code: 'S-01', text: 'System check', check: 'SYSTEM' },
        { code: 'P-01', text: 'Reviewed the budget', check: 'PERSON' },
        { code: 'P-02', text: 'Vendor is verified', check: 'PERSON' }
      ]
    }
  }
}

/** Answers every person question Yes (waits for the checklist to load). */
export async function answerChecklistYes() {
  await screen.findByText('Reviewed the budget')
  for (const radio of screen.getAllByRole('radio', { name: /^(Yes|checklist.yes)$/ })) {
    if (!(radio as HTMLInputElement).disabled) fireEvent.click(radio)
  }
}
