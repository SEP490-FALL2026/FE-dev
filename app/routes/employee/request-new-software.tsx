import { RequestNewSoftwarePage } from '~/features/employee/request-new-software/request-new-software-page'

export function meta() {
  return [
    { title: 'Request New Software | SaaS-Sentry' },
    {
      name: 'description',
      content: "Get access to a software you don't currently have."
    }
  ]
}

export default function RequestNewSoftwareRoute() {
  return <RequestNewSoftwarePage />
}
