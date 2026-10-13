import { MySoftwarePage } from '~/features/employee/my-software/my-software-page'

export function meta() {
  return [
    { title: 'My Software | SaaS-Sentry' },
    {
      name: 'description',
      content: 'View and manage software and licenses currently assigned to you.'
    }
  ]
}

export default function MySoftwareRoute() {
  return <MySoftwarePage />
}
