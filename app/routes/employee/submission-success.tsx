import { SubmissionSuccessPage } from '~/features/employee/submission-success/submission-success-page'

export function meta() {
  return [
    { title: 'Submission Success | SaaS-Sentry' },
    {
      name: 'description',
      content: 'Your request has been submitted successfully.'
    }
  ]
}

export default function SubmissionSuccessRoute() {
  return <SubmissionSuccessPage />
}
