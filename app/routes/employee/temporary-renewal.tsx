import { TemporaryRenewalPage } from '~/features/employee/temporary-renewal/temporary-renewal-page'

export function meta() {
  return [
    { title: 'Temporary Renewal Request | SaaS-Sentry' },
    {
      name: 'description',
      content: 'Extend your software license access for a specific period.'
    }
  ]
}

export default function TemporaryRenewalRoute() {
  return <TemporaryRenewalPage />
}
