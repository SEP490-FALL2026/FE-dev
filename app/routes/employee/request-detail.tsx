import { RequestDetailPage } from '~/features/employee/request-detail/request-detail-page'

export function meta() {
  return [
    { title: 'Request Detail | SaaS-Sentry' },
    {
      name: 'description',
      content: 'Track and review your software access request status and approval flow.'
    }
  ]
}

interface RequestDetailRouteProps {
  params?: { id?: string }
}

export default function RequestDetailRoute({ params }: RequestDetailRouteProps) {
  return <RequestDetailPage requestId={params?.id} />
}
