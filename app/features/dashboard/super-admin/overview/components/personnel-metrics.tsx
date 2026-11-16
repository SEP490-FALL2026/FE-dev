import { useTranslation } from 'react-i18next'
import type { SuperAdminDashboardResponseDtoData } from '~/shared/api/generated/model/dashboards'
import { useDashboardFormat } from '../../../dashboard-ui'

export function PersonnelMetrics({ data }: { data: NonNullable<SuperAdminDashboardResponseDtoData> }) {
  const { t: translate } = useTranslation('admin')
  const { formatDate, formatNumber } = useDashboardFormat()
  const sections = data.sections
  const metrics = [
    ...Object.entries(sections.departures ?? {}),
    ...Object.entries(sections.transfers ?? {}),
    ...Object.entries(sections.seatsReturned ?? {}),
    ...(sections.plansBelowVendorAdminMinimum
      ? [['plansBelowVendorAdminMinimum', sections.plansBelowVendorAdminMinimum] as const]
      : [])
  ]
  if (!metrics.length && !data.calendar) return null
  return (
    <section aria-label={translate('upcomingAdmin.title')} className='space-y-3'>
      <h2 className='font-semibold'>{translate('upcomingAdmin.title')}</h2>
      {data.calendar && (
        <p className='text-sm text-muted-foreground'>
          {translate('upcomingAdmin.calendar', {
            from: formatDate(data.calendar.from),
            to: formatDate(data.calendar.to)
          })}
        </p>
      )}
      <dl className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
        {metrics.map(([key, metric]) => (
          <div key={key} className='rounded-lg border border-border bg-surface p-4'>
            <dt className='text-sm text-muted-foreground'>
              {translate(`upcomingAdmin.${key}`, { defaultValue: translate('unknown') })}
            </dt>
            <dd className='mt-3 text-right font-mono text-xl tabular-nums'>
              {metric.state === 'COUNTED' &&
              typeof metric.count === 'number' &&
              Number.isSafeInteger(metric.count) &&
              metric.count >= 0
                ? formatNumber(metric.count)
                : translate(metric.state === 'AT_SOURCE' ? 'overview.metrics.atSource' : 'overview.metrics.noSource')}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
