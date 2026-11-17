import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSubscriptionList } from '~/shared/api/generated/operations/subscriptions/subscription-list'
import { useDashboardFormat } from '../../../dashboard-ui'
import { ItEmpty, ItQueryState } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { itButtonClass } from '../../shared/components/it-form'

export function SubscriptionExpiry() {
  const { t } = useTranslation('itProvisioning')
  const { formatDate } = useDashboardFormat()
  const [expiry, setExpiry] = useState<'SOON' | 'EXPIRED'>('SOON')
  const [page, setPage] = useState(1)
  const query = useSubscriptionList({ expiry, mine: 'true', page, pageSize: 20 })
  const data = query.data?.data
  return (
    <section className='space-y-4'>
      <p className='text-sm text-muted-foreground'>{t('subscriptionExpiry.hint')}</p>
      <div role='group' aria-label={t('subscriptionExpiry.title')} className='flex flex-wrap gap-2'>
        {(['SOON', 'EXPIRED'] as const).map((value) => (
          <button
            key={value}
            type='button'
            className={itButtonClass}
            aria-pressed={expiry === value}
            onClick={() => {
              setExpiry(value)
              setPage(1)
            }}
          >
            {t(`subscriptionExpiry.${value}`)}
          </button>
        ))}
      </div>
      <ItQueryState query={query}>
        {data?.items.length ? (
          <div className='divide-y divide-border rounded-lg border border-border bg-surface'>
            {data.items.map((item) => (
              <article key={item.id} className='space-y-1 p-4'>
                <h2 className='font-semibold'>
                  {item.applicationName} · {item.planName}
                </h2>
                <p className='text-sm text-muted-foreground'>{t(`subscriptionExpiry.${expiry}`)}</p>
                <p className='text-sm'>
                  {t('subscriptionExpiry.endDate')}: {item.endDate ? formatDate(item.endDate) : t('unavailable')}
                </p>
                {item.renewalDate && (
                  <p className='text-sm'>
                    {t('subscriptionExpiry.renewalDate')}: {formatDate(item.renewalDate)}
                  </p>
                )}
              </article>
            ))}
          </div>
        ) : (
          <ItEmpty />
        )}
      </ItQueryState>
      {data && <ItPagination page={page} pageSize={20} total={data.pagination.totalItems} onChange={setPage} />}
    </section>
  )
}
