import { MyRequestsPage } from '~/features/employee/my-requests/my-requests-page'

export function meta() {
  return [
    { title: 'My Requests | SaaS-Sentry' },
    {
      name: 'description',
      content: 'Track and manage the status of your software license requests.'
    }
  ]
}

export default function MyRequestsRoute() {
  return <MyRequestsPage />
}
