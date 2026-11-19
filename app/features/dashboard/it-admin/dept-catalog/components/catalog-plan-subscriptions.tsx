import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSubscriptionList } from '~/shared/api/generated/operations/subscriptions/subscription-list'
import { ItEmpty, ItQueryState } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { itButtonClass } from '../../shared/components/it-form'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'

export function CatalogPlanSubscriptions({ planId, onEdit }: { planId: string; onEdit: (id: string) => void }) {
  const { t } = useTranslation('itCatalog')
  const { formatDate, formatNumber } = useWorkspaceFormat()
  const [page, setPage] = useState(1)
  const query = useSubscriptionList({ planId, page, pageSize: 20 })
  const data = query.data?.data
  return (
    <section className='space-y-3'>
      <h2 className='font-semibold'>{t('subscriptions')}</h2>
      <ItQueryState query={query}>
        {data?.items.length ? (
          <div className='divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface'>
            {data.items.map((item) => (
              <article key={item.id} className='flex flex-wrap items-center justify-between gap-3 p-4'>
                <div>
                  <p className='font-medium'>{item.planName}</p>
                  <p className='text-sm text-muted-foreground'>
                    {t(`enums.${item.status}`, { defaultValue: t('unknown') })}
                  </p>
                  {item.missing.length > 0 && (
                    <p className='text-sm text-muted-foreground'>
                      {t('missingData')}:{' '}
                      {item.missing.map((field) => t(`missing.${field}`, { defaultValue: t('unknown') })).join(', ')}
                    </p>
                  )}
                  <p className='text-sm text-muted-foreground'>
                    {t('quantity')}:{' '}
                    {item.purchasedQuantity === null ? t('unknown') : formatNumber(item.purchasedQuantity)}
                    <span aria-hidden> · </span>
                    {t('startDate')}: {item.startDate ? formatDate(item.startDate) : t('unknown')}
                  </p>
                </div>
                <button type='button' className={itButtonClass} onClick={() => onEdit(item.id)}>
                  {t('editSubscription')}
                </button>
              </article>
            ))}
          </div>
        ) : (
          <ItEmpty />
        )}
      </ItQueryState>
      {data && data.pagination.totalItems > 20 && (
        <ItPagination page={page} pageSize={20} total={data.pagination.totalItems} onChange={setPage} />
      )}
    </section>
  )
}
