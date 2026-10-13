import { EmployeeDashboardPage } from '~/features/employee/dashboard/employee-dashboard-page'

export function meta() {
  return [
    { title: 'Employee Dashboard | SaaS-Sentry' },
    {
      name: 'description',
      content: 'Overview of your software licenses and requests.'
    }
  ]
}

export default function EmployeeDashboardRoute() {
  return <EmployeeDashboardPage />
}
