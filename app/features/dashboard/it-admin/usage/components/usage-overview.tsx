import { useTranslation } from 'react-i18next'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useUsageOverviewList } from '~/shared/api/generated/operations/usage-overview/usage-overview-list'
import { useDashboardFormat } from '~/features/dashboard/dashboard-ui'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { ItChoiceSelect } from '../../shared/components/it-choice-select'
import { useUsageNavigation } from '../hooks/use-usage-navigation'

export function UsageOverview() {
  const { t } = useTranslation('itDepartmentWork')
  const { formatDate } = useDashboardFormat()
  const { params, update, page: readPage } = useUsageNavigation()
  const page = readPage('overviewPage')
  const sourceKind =
    params.get('usageSourceKind') === 'VENDOR'
      ? 'VENDOR'
      : params.get('usageSourceKind') === 'COLLECTOR'
        ? 'COLLECTOR'
        : undefined
  const query = useUsageOverviewList({
    from: params.get('from') || undefined,
    to: params.get('to') || undefined,
    granularity: 'WEEK',
    groupBy: 'DEPARTMENT',
    sourceKind,
    page,
    pageSize: 20
  })
  const items = query.data?.data?.items ?? []
  return (
    <section className='space-y-4'>
      <h2 className='text-lg font-semibold'>{t('usage.overview')}</h2>
      <p className='text-sm text-muted-foreground'>{t('usage.overviewHint')}</p>
      <ItChoiceSelect
        label={t('usage.sources')}
        value={sourceKind ?? ''}
        onChange={(value) => update({ usageSourceKind: value, overviewPage: undefined })}
        options={[
          { value: '', label: t('usage.allSources') },
          { value: 'VENDOR', label: t('usage.vendor') },
          { value: 'COLLECTOR', label: t('usage.collector') }
        ]}
      />
      <ItQueryState query={query}>
        {items.length ? (
          <div className='space-y-3'>
            {items.map((item, index) => (
              <article
                key={`${item.department?.id}-${item.period.start}-${index}`}
                className='rounded-lg border border-border bg-surface p-4'
              >
                <h3 className='font-medium'>{item.department?.name ?? t('unknown')}</h3>
                <p className='text-sm text-muted-foreground'>
                  {formatDate(item.period.start)} – {formatDate(item.period.end)} · {t(`usage.${item.status}`)}
                </p>
                {item.status === 'NO_DATA' ? (
                  <p>{t('usage.noData')}</p>
                ) : (
                  <>
                    <div className='h-32' aria-hidden='true'>
                      <ResponsiveContainer width='100%' height='100%'>
                        <BarChart
                          layout='vertical'
                          data={[
                            { name: t('usage.active'), days: item.activeDays },
                            { name: t('usage.covered'), days: item.coveredDays }
                          ]}
                        >
                          <XAxis type='number' allowDecimals={false} axisLine={false} tickLine={false} />
                          <YAxis type='category' dataKey='name' width={150} axisLine={false} tickLine={false} />
                          <Tooltip />
                          <Bar dataKey='days' name={t('usage.daysUnit')} fill='var(--theme-primary)' />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <p className='text-sm'>
                      {t('usage.active')}: {item.activeDays} · {t('usage.covered')}: {item.coveredDays}
                    </p>
                  </>
                )}
                {item.updatedAt && (
                  <p className='text-xs text-muted-foreground'>
                    {t('usage.updated')}: {formatDate(item.updatedAt)}
                  </p>
                )}
              </article>
            ))}
          </div>
        ) : (
          <ItEmpty />
        )}
      </ItQueryState>
      <ItPagination
        page={page}
        pageSize={20}
        total={query.data?.data?.pagination.totalItems ?? 0}
        onChange={(value) => update({ overviewPage: String(value) })}
      />
    </section>
  )
}
