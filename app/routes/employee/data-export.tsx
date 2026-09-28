import { DataExportPage } from '~/features/employee/data-export/data-export-page'

export function meta() {
  return [
    { title: 'Request Data Export | SaaS-Sentry' },
    {
      name: 'description',
      content: 'Submit a request to download a certified copy of your personal and activity data stored in SaaS-Sentry.'
    }
  ]
}

export default function DataExportRoute() {
  return <DataExportPage />
}
