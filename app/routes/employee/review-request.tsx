import { ReviewRequestPage } from '~/features/employee/review-request/review-request-page'

export function meta() {
  return [
    { title: 'Review Your Request | SaaS-Sentry' },
    {
      name: 'description',
      content: 'Please review all information before submitting your software request.'
    }
  ]
}

export default function ReviewRequestRoute() {
  return <ReviewRequestPage />
}
