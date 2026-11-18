import { useTranslation } from 'react-i18next'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useUsageEmployeeSoftwareGet } from '~/shared/api/generated/operations/usage-overview/usage-employee-software-get'
import { useDashboardFormat } from '~/features/dashboard/dashboard-ui'
import { ItQueryState } from '../../shared/components/it-query-state'
import { itButtonClass } from '../../shared/components/it-form'
import { useUsageNavigation } from '../hooks/use-usage-navigation'
import { UsagePeriod } from './usage-period'

export function UsageDetail({
  employeeId,
  application,
  onBack
}: {
  employeeId: string
  application: { id: string; name: string }
  onBack: () => void
}) {
  const { t } = useTranslation('itDepartmentWork')
  const { formatDate } = useDashboardFormat()
  const { params } = useUsageNavigation()
  const query = useUsageEmployeeSoftwareGet(employeeId, application.id, {
    from: params.get('from') || undefined,
    to: params.get('to') || undefined
  })
  const data = query.data?.data
  return (
    <section className='space-y-5'>
      <button type='button' className={itButtonClass} onClick={onBack}>
        {t('back')}
      </button>
      <header>
        <h1 className='text-2xl font-semibold'>{application.name}</h1>
        <p className='text-sm text-muted-foreground'>{params.get('employeeCode')}</p>
      </header>
      <UsagePeriod />
      <ItQueryState query={query}>
        {data && (
          <>
            <p className='text-sm text-muted-foreground'>
              {t('usage.period')}: {formatDate(data.range.from)} – {formatDate(data.range.to)}
            </p>
            <p>{t(`usage.${data.status}`)}</p>
            {data.status === 'NO_DATA' ? (
              <p>{t('usage.noData')}</p>
            ) : (
              <dl className='grid gap-3 sm:grid-cols-2'>
                <div>
                  <dt>{t('usage.active')}</dt>
                  <dd>{data.activeDays}</dd>
                </div>
                <div>
                  <dt>{t('usage.covered')}</dt>
                  <dd>{data.coveredDays}</dd>
                </div>
              </dl>
            )}
            <h2 className='section-accent text-lg font-semibold tracking-tight'>{t('usage.sources')}</h2>
            {data.vendorSources.map((source) => (
              <article key={source.sourceId} className='space-y-3 rounded-lg border border-border bg-surface p-5'>
                <h3 className='font-medium'>{source.name}</h3>
                <p className='text-sm text-muted-foreground'>
                  {t('usage.vendor')} · {t(`usage.${source.status}`)}
                </p>
                {source.status === 'NO_DATA' ? (
                  <p>{t('usage.noData')}</p>
                ) : (
                  <>
                    <p>
                      {t('usage.active')}: {source.activeDays} · {t('usage.covered')}: {source.coveredDays}
                    </p>
                    <p className='text-sm text-muted-foreground'>{t('usage.vendorDatesHint')}</p>
                    <p className='text-sm'>
                      {source.activeDates?.map((date) => formatDate(date)).join(' · ') || t('usage.noActivityObserved')}
                    </p>
                  </>
                )}
                {source.updatedAt && (
                  <p className='text-xs text-muted-foreground'>
                    {t('usage.updated')}: {formatDate(source.updatedAt)}
                  </p>
                )}
              </article>
            ))}
            {data.collector && (
              <article className='space-y-3 rounded-lg border border-border bg-surface p-5'>
                <h3 className='font-medium'>{t('usage.collector')}</h3>
                <p>{t(`usage.${data.collector.status}`)}</p>
                {data.collector.status === 'NO_DATA' ? (
                  <p>{t('usage.noData')}</p>
                ) : (
                  <>
                    <p>
                      {t('usage.active')}: {data.collector.activeDays} · {t('usage.covered')}:{' '}
                      {data.collector.coveredDays}
                    </p>
                    {(['responses', 'totalTokens'] as const).map((metric) => (
                      <div key={metric}>
                        <h4 className='text-sm font-medium'>{t(`usage.${metric}`)}</h4>
                        <div className='h-48' aria-hidden='true'>
                          <ResponsiveContainer width='100%' height='100%'>
                            <BarChart data={data.collector?.days}>
                              <XAxis dataKey='date' tickFormatter={formatDate} axisLine={false} tickLine={false} />
                              <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                              <Tooltip labelFormatter={(value) => formatDate(String(value))} />
                              <Bar dataKey={metric} name={t(`usage.${metric}`)} fill='var(--theme-primary)' />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    ))}
                    <ul className='space-y-1 text-sm'>
                      {data.collector.days?.map((day) => (
                        <li key={day.date}>
                          {formatDate(day.date)} · {t(`usage.${day.coverage}`)} · {t('usage.responses')}:{' '}
                          {day.responses} · {t('usage.totalTokens')}: {day.totalTokens}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {data.collector.updatedAt && (
                  <p className='text-xs text-muted-foreground'>
                    {t('usage.updated')}: {formatDate(data.collector.updatedAt)}
                  </p>
                )}
              </article>
            )}
            {data.sourcesTruncated && <p className='text-sm text-muted-foreground'>{t('usage.truncated')}</p>}
          </>
        )}
      </ItQueryState>
    </section>
  )
}
