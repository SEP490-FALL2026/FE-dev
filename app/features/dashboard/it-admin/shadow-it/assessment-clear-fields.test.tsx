import { useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import type {
  AssessmentPatchDto,
  AssessmentResponseDtoDataAssessment
} from '~/shared/api/generated/model/access-requests'
import { AssessmentFields } from './components/assessment-fields'

it('clears an existing optional catalog link with explicit null rather than restoring the saved value', async () => {
  await setAppLanguage('en', false)
  const item = {
    vendor: { name: 'Vendor' },
    equivalentTool: { planId: 'plan-old' }
  } as AssessmentResponseDtoDataAssessment
  function Editor() {
    const [draft, setDraft] = useState<AssessmentPatchDto>({})
    return (
      <>
        <AssessmentFields item={item} draft={draft} onChange={setDraft} />
        <output>{JSON.stringify(draft)}</output>
      </>
    )
  }
  render(<Editor />)
  fireEvent.change(screen.getByDisplayValue('plan-old'), { target: { value: '' } })
  expect(screen.queryByDisplayValue('plan-old')).not.toBeInTheDocument()
  expect(screen.getByRole('status')).toHaveTextContent('"equivalentPlanId":null')
})
