import { SoftwareDetailPage } from '~/features/employee/software-detail/software-detail-page'

export function meta() {
  return [
    { title: 'Software Details | SaaS-Sentry' },
    {
      name: 'description',
      content: 'Detailed software license usage, cost, and access management.'
    }
  ]
}

interface SoftwareDetailRouteProps {
  params?: { id?: string }
}

export default function SoftwareDetailRoute({ params }: SoftwareDetailRouteProps) {
  return <SoftwareDetailPage softwareId={params?.id} />
}
