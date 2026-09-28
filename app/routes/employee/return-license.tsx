import { ReturnLicensePage } from '~/features/employee/return-license/return-license-page'

export function meta() {
  return [
    { title: 'Return License Request | SaaS-Sentry' },
    {
      name: 'description',
      content: 'Request to return a software license you no longer need.'
    }
  ]
}

export default function ReturnLicenseRoute() {
  return <ReturnLicensePage />
}
