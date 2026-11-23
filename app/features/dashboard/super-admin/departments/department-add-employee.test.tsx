import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { customAxios } from '~/shared/api/mutator/custom-axios'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { DepartmentAddEmployee } from './components/department-add-employee'

vi.mock('~/shared/api/mutator/custom-axios', () => ({ customAxios: vi.fn() }))
it('assigns an unplaced employee to the department with the chosen effective date', async () => {
  await setAppLanguage('en', false)
  const request = vi.mocked(customAxios)
  request.mockReset()
  request.mockImplementation(async (config) =>
    config.method === 'POST'
      ? { data: {} }
      : {
          data: {
            items: [
              {
                id: 'employee-1',
                employeeCode: 'E-01',
                fullName: 'Alex',
                status: 'ACTIVE',
                workState: 'WORKING',
                hireDate: '2026-01-01',
                unplaced: true
              }
            ],
            pagination: { page: 1, totalPages: 1, totalItems: 1 }
          }
        }
  )
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <DepartmentAddEmployee departmentId='department-1' departmentEffectiveFrom='2099-02-01' onClose={vi.fn()} />
    </QueryClientProvider>
  )
  const employee = await screen.findByRole('combobox', { name: 'Employee' })
  fireEvent.change(employee, { target: { value: 'employee-1' } })
  fireEvent.change(screen.getByLabelText('Effective from'), { target: { value: '2099-01-01' } })
  expect(screen.getByRole('button', { name: 'Add employee' })).toBeDisabled()
  fireEvent.change(screen.getByLabelText('Effective from'), { target: { value: '2099-02-01' } })
  fireEvent.click(screen.getByRole('button', { name: 'Add employee' }))
  await waitFor(() =>
    expect(
      request.mock.calls.some(
        ([config]) =>
          config.url?.endsWith('/employees/employee-1/first-placements') &&
          JSON.stringify(config.data) === JSON.stringify({ departmentId: 'department-1', effectiveFrom: '2099-02-01' })
      )
    ).toBe(true)
  )
})
