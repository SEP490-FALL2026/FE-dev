import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePlanWarningList } from '~/shared/api/generated/operations/plan-terms/plan-warning-list'
import { useDashboardFormat } from '../../../dashboard-ui'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { itButtonClass } from '../../shared/components/it-form'

export function CatalogTermWarnings({ onOpen }: { onOpen: (planId: string) => void }) {
  const { t: translate } = useTranslation('itCatalog')
  const { formatDate } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const query = usePlanWarningList({ page, pageSize: 20 })
  const data = query.data?.data
  return (
    <section className='space-y-4'>
      <ItQueryState query={query}>
        {data?.items.length ? (
          <div className='divide-y divide-border/50 rounded-lg border border-border/70 bg-surface'>
            {data.items.map((item) => (
              <article
                key={`${item.planId}-${item.subscriptionId}`}
                className='flex flex-wrap items-center justify-between gap-4 p-5'
              >
                <div className='min-w-0 flex-1'>
                  <h2 className='truncate font-semibold' title={item.applicationName}>
                    {item.applicationName}
                  </h2>
                  <p className='truncate text-sm text-muted-foreground' title={item.planName}>
                    {item.planName}
                  </p>
                </div>
                <dl className='grid grid-cols-2 gap-x-4 text-xs'>
                  <dt>{translate('terms.reviewFrom')}</dt>
                  <dd className='text-right font-mono tabular-nums'>{formatDate(item.reviewFrom)}</dd>
                  <dt>{translate('terms.lastReviewedOn')}</dt>
                  <dd className='text-right font-mono tabular-nums'>
                    {item.lastReviewedOn ? formatDate(item.lastReviewedOn) : translate('unknown')}
                  </dd>
                </dl>
                <button type='button' className={itButtonClass} onClick={() => onOpen(item.planId)}>
                  {translate('terms.open')}
                </button>
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
