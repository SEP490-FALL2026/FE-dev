import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { ItField } from './it-form'

it('marks only required controls in the field label', () => {
  const labels = { required: 'Required field', optional: 'Optional field' }
  render(
    <>
      <ItField label={labels.required}>
        <input required />
      </ItField>
      <ItField label={labels.optional}>
        <input />
      </ItField>
    </>
  )
  expect(screen.getByText('Required field').parentElement).toHaveTextContent('*')
  expect(screen.getByText('Optional field').parentElement).not.toHaveTextContent('*')
})
