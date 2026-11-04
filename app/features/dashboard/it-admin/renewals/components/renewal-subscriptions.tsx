import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSubscriptionList } from '~/shared/api/generated/operations/subscriptions/subscription-list'
import { useDashboardFormat } from '../../../dashboard-ui'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { itButtonClass } from '../../shared/components/it-form'
import { RenewalProposalDialog } from './renewal-proposal-dialog'
import type { SubscriptionPageResponseDtoDataItemsItem } from '~/shared/api/generated/model/subscriptions'

export function RenewalSubscriptions() {
  const { t: translate } = useTranslation('itRenewals')
  const { formatDate, formatNumber } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<SubscriptionPageResponseDtoDataItemsItem>()
  const query = useSubscriptionList({ page, pageSize: 20, status: 'ACTIVE' })
  const data = query.data?.data
  return (
    <section className='space-y-4'>
      <p className='text-sm text-muted-foreground'>{translate('deadlinePageHint')}</p>
      <ItQueryState query={query}>
        {data?.items.length ? (
          <div className='divide-y divide-border/50 overflow-hidden rounded-lg border border-border/70 bg-surface'>
            {data.items.map((item) => (
              <article key={item.id} className='grid gap-4 p-5 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center'>
                <div className='min-w-0'>
                  <h2 className='truncate font-semibold' title={item.applicationName}>
                    {item.applicationName}
                  </h2>
                  <p className='truncate text-sm text-muted-foreground' title={item.planName}>
                    {item.planName}
                  </p>
                </div>
                <dl className='grid grid-cols-2 gap-x-5 gap-y-1 text-sm'>
                  <dt className='text-muted-foreground'>{translate('purchasedQuantity')}</dt>
                  <dd className='text-right font-mono tabular-nums'>
                    {item.purchasedQuantity === null ? translate('unknown') : formatNumber(item.purchasedQuantity)}
                  </dd>
                  <dt className='text-muted-foreground'>{translate('noticeDeadline')}</dt>
                  <dd className='text-right font-mono text-xs tabular-nums'>
                    {item.noticeDeadline.value ? formatDate(item.noticeDeadline.value) : translate('unknown')}
                  </dd>
                  <dt className='text-muted-foreground'>{translate('deadlineSource')}</dt>
                  <dd className='text-right text-xs'>
                    {translate(`values.${item.noticeDeadline.source}`, { defaultValue: translate('unknown') })}
                  </dd>
                </dl>
                <button type='button' className={itButtonClass} onClick={() => setSelected(item)}>
                  {translate('propose')}
                </button>
              </article>
            ))}
          </div>
        ) : (
          <ItEmpty />
        )}
      </ItQueryState>
      {data && <ItPagination page={page} total={data.pagination.totalItems} pageSize={20} onChange={setPage} />}
      {selected && <RenewalProposalDialog subscription={selected} onClose={() => setSelected(undefined)} />}
    </section>
  )
}
