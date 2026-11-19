import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import {
  getUsageOverviewListQueryKey,
  usageOverviewList
} from '~/shared/api/generated/operations/usage-overview/usage-overview-list'
import { useDashboardFormat } from '../../../dashboard-ui'
import { ItEmpty, ItQueryState } from '../../shared/components/it-query-state'
import { buildDepartmentUsageSeries } from './it-usage-chart-data'

const colors = [1, 2, 3, 4, 5, 6].map((slot) => `var(--theme-chart-${slot})`)
const params = { granularity: 'WEEK', groupBy: 'DEPARTMENT', pageSize: 100 } as const

export function ItUsageChart() {
  const { t } = useTranslation('itDepartmentWork')
  const { formatDate } = useDashboardFormat()
  const query = useQuery({
    queryKey: [...getUsageOverviewListQueryKey(params), 'complete-series'],
    queryFn: async () => {
      const items = []
      let page = 1
      let totalPages = 1
      while (page <= totalPages) {
        const response = await usageOverviewList({ ...params, page })
        if (!response.data) throw new Error('Missing usage overview page')
        items.push(...response.data.items)
        totalPages = response.data.pagination.totalPages ?? 1
        page++
      }
      return items
    }
  })
  const data = buildDepartmentUsageSeries(query.data ?? [])
  const missing = query.data?.some((item) => item.status !== 'HAS_DATA')
  return (
    <section className='space-y-4 rounded-xl border border-border bg-surface p-5 sm:p-6'>
      <header className='space-y-1'>
        <h2 className='section-accent text-lg font-semibold tracking-tight'>{t('usage.trendTitle')}</h2>
        <p className='text-sm text-muted-foreground'>{t('usage.trendHint')}</p>
      </header>
      <ItQueryState query={query}>
        {data.points.length && data.departments.length ? (
          <>
            <div className='flex flex-wrap gap-x-5 gap-y-2' aria-label={t('usage.trendLegend')}>
              {data.departments.map((department, index) => (
                <span key={department.id} className='inline-flex items-center gap-2 text-sm'>
                  <span
                    aria-hidden
                    className='size-2.5 rounded-full'
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  {department.name}
                </span>
              ))}
            </div>
            <div className='h-72 w-full' aria-hidden='true'>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart data={data.points} margin={{ top: 12, right: 20, left: 0, bottom: 4 }}>
                  <CartesianGrid stroke='var(--theme-border)' strokeDasharray='3 3' vertical={false} />
                  <XAxis dataKey='start' tickFormatter={formatDate} tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} domain={[0, 7]} width={32} tickLine={false} axisLine={false} />
                  <Tooltip labelFormatter={(value) => formatDate(String(value))} />
                  {data.departments.map((department, index) => (
                    <Line
                      key={department.id}
                      dataKey={department.id}
                      name={department.name}
                      type='monotone'
                      stroke={colors[index % colors.length]}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      connectNulls={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
            {missing && <p className='text-sm text-muted-foreground'>{t('usage.trendMissing')}</p>}
            <details className='text-sm'>
              <summary className='cursor-pointer font-medium'>{t('usage.trendTable')}</summary>
              <div className='mt-3 overflow-x-auto'>
                <table className='w-full text-left text-sm'>
                  <thead>
                    <tr>
                      <th className='p-2'>{t('usage.trendWeek')}</th>
                      {data.departments.map((department) => (
                        <th className='p-2' key={department.id}>
                          {department.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.points.map((point) => (
                      <tr key={point.start} className='border-t border-border'>
                        <th className='p-2 font-normal'>{formatDate(point.start)}</th>
                        {data.departments.map((department) => (
                          <td className='p-2' key={department.id}>
                            {point[department.id] ?? t('usage.NO_DATA')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          </>
        ) : (
          <ItEmpty />
        )}
      </ItQueryState>
    </section>
  )
}
