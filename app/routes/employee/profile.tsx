import { EmployeeProfilePage } from '~/features/employee/profile/employee-profile-page'

export function meta() {
  return [
    { title: 'My Profile | SaaS-Sentry' },
    {
      name: 'description',
      content: 'Manage your personal information and control your data privacy.'
    }
  ]
}

export default function EmployeeProfileRoute() {
  return <EmployeeProfilePage />
}
