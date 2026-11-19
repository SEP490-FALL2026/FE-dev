import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSubscriptionDeadlineEventList } from '~/shared/api/generated/operations/subscription-renewals/subscription-deadline-event-list'
import { useDashboardFormat } from '../../../dashboard-ui'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'

export function RenewalDeadlineEvents() {
  const { t: translate } = useTranslation('itRenewals')
  const { formatDate } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const query = useSubscriptionDeadlineEventList({ page, pageSize: 20 })
  const data = query.data?.data
  return (
    <section className='space-y-4'>
      <ItQueryState query={query}>
        {data?.items.length ? (
          <div className='divide-y divide-border/50 overflow-hidden rounded-lg border border-border/70 bg-surface'>
            {data.items.map((item) => (
              <article key={item.id} className='flex flex-wrap items-center justify-between gap-4 p-5'>
                <div className='min-w-0 flex-1'>
                  <h2 className='truncate font-semibold' title={item.subscription.applicationName}>
                    {item.subscription.applicationName}
                  </h2>
                  <p className='truncate text-sm text-muted-foreground' title={item.subscription.planName}>
                    {item.subscription.planName}
                  </p>
                </div>
                <p className='text-sm'>{translate(`values.${item.kind}`, { defaultValue: translate('unknown') })}</p>
                <dl className='grid grid-cols-2 gap-x-4 text-xs'>
                  <dt className='text-muted-foreground'>{translate('milestone')}</dt>
                  <dd className='text-right font-mono tabular-nums'>{formatDate(item.milestoneDate)}</dd>
                  <dt className='text-muted-foreground'>{translate('recordedOn')}</dt>
                  <dd className='text-right font-mono tabular-nums'>{formatDate(item.recordedOn)}</dd>
                </dl>
              </article>
            ))}
          </div>
        ) : (
          <ItEmpty />
        )}
      </ItQueryState>
      {data && <ItPagination page={page} total={data.pagination.totalItems} pageSize={20} onChange={setPage} />}
    </section>
  )
}
