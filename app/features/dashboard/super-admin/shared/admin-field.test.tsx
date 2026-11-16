import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { AdminField } from './components/admin-form'

it('links a field description and marks only editable required fields', () => {
  const labels = { department: 'Department name', function: 'Function', employee: 'Employee' }
  render(
    <>
      <AdminField label={labels.department} description='Use the official name registered for the department.'>
        <input required />
      </AdminField>
      <AdminField label={labels.function} description='Describe the work handled by this department.'>
        <textarea />
      </AdminField>
      <AdminField label={labels.employee} description='The employee selected from the directory.'>
        <input required disabled value='Alex' readOnly />
      </AdminField>
    </>
  )
  expect(screen.getByLabelText('Department name')).toHaveAccessibleDescription(
    'Use the official name registered for the department.'
  )
  expect(screen.getByLabelText('Department name').closest('label')?.querySelector('.text-danger')).toHaveTextContent(
    '*'
  )
  expect(screen.getByLabelText('Function').closest('label')?.querySelector('.text-danger')).toBeNull()
  expect(screen.getByLabelText('Employee').closest('label')?.querySelector('.text-danger')).toBeNull()
})
