/** Column names explicitly documented by the employee-import contract. */
export const importColumns = {
  employee_code: 'employeeCode', full_name: 'fullName', employment_type: 'employmentType',
  hire_date: 'hireDate', department_code: 'departmentCode', work_email: 'workEmail', job_title: 'jobTitle'
} as const
export function importColumnField(column: string) {
  return Object.hasOwn(importColumns, column) ? importColumns[column as keyof typeof importColumns] : null
}
