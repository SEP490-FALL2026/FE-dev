import { DataUsagePage } from '~/features/employee/data-usage/data-usage-page'

export function meta() {
  return [
    { title: 'View Data Usage | SaaS-Sentry' },
    {
      name: 'description',
      content:
        'Transparent breakdown of what data SaaS-Sentry collects, how usage is tracked, and access log frequency.'
    }
  ]
}

export default function DataUsageRoute() {
  return <DataUsagePage />
}
