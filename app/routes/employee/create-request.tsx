import { CreateRequestPage } from '~/features/employee/create-request/create-request-page'

export function meta() {
  return [
    { title: 'Create Request | SaaS-Sentry' },
    {
      name: 'description',
      content: 'Choose the type of software request you want to submit.'
    }
  ]
}

export default function CreateRequestRoute() {
  return <CreateRequestPage />
}
