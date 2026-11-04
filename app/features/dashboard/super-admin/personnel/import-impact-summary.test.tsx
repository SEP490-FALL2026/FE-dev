import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, expect, it } from 'vitest'
import type { EmployeeImportResponseDtoDataSummary } from '~/shared/api/generated/model/employee-imports'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { ImportImpactSummary } from './components/import-impact-summary'

beforeEach(async () => {
  await setAppLanguage('en', false)
})
const summary: EmployeeImportResponseDtoDataSummary = {
  newUnplaced: 3,
  totalRows: 12,
  valid: 10,
  errors: 2,
  existingSame: 1,
  existingDifferent: 1,
  newPeopleByDepartment: [{ departmentCode: 'ENG', count: 4 }],
  departmentsWithoutHead: [{ code: 'ENG', name: 'Engineering' }],
  reviewQueue: { total: 207, items: [{ employeeCode: 'EMP-42', fullName: 'Dana Nguyen', seats: 8 }] },
  duplicateOf: null
}

it('shows unplaced and per-department impact, and the full review count without treating the preview as all employees', () => {
  render(<ImportImpactSummary summary={summary} />)
  const unplaced = screen.getByText('New employees without a department').closest('div')
  if (!unplaced) throw new Error('Expected unplaced summary')
  expect(within(unplaced).getByText('3')).toBeInTheDocument()
  expect(screen.getByText('Engineering')).toBeInTheDocument()
  expect(screen.getByText('New employees by department')).toBeInTheDocument()
  expect(screen.getByText('4')).toBeInTheDocument()
  const review = screen.getByText('Employees to review: 207')
  fireEvent.click(review)
  expect(screen.getByText('Showing 1 of 207 employees.')).toBeInTheDocument()
  expect(screen.getByText('Dana Nguyen')).toBeInTheDocument()
  expect(screen.getByText('8 assigned seats')).toBeInTheDocument()
  expect(
    screen.getByText('These employees hold seats but are absent from the file. Import does not mark them as departed.')
  ).toBeInTheDocument()
})

it('does not show review or missing-head warnings when BE reports none', () => {
  render(
    <ImportImpactSummary
      summary={{
        ...summary,
        newUnplaced: 0,
        newPeopleByDepartment: [],
        departmentsWithoutHead: [],
        reviewQueue: { total: 0, items: [] }
      }}
    />
  )
  expect(screen.getByText('0')).toBeInTheDocument()
  expect(screen.queryByText('Departments without a head')).not.toBeInTheDocument()
  expect(screen.queryByText(/Employees to review:/)).not.toBeInTheDocument()
})
