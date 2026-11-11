import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSubscriptionList } from '~/shared/api/generated/operations/subscriptions/subscription-list'
import { useSubscriptionSeatUsage } from '~/shared/api/generated/operations/subscriptions/subscription-seat-usage'
import type { PlanPageResponseDtoDataItemsItem } from '~/shared/api/generated/model/plans'
import { CatalogKeyVault } from '../dept-catalog/components/catalog-license-keys'
import { CatalogSeatBaseline } from '../dept-catalog/components/catalog-seat-baseline'
import { ItPagination } from '../shared/components/it-pagination'
import { ItQueryState } from '../shared/components/it-query-state'
import { itButtonClass, itPrimaryClass } from '../shared/components/it-form'
import { useDashboardFormat } from '../../dashboard-ui'

function StockSeatUsage({ id }: { id: string }) {
  const { t } = useTranslation('itAdmin')
  const { formatNumber } = useDashboardFormat()
  const query = useSubscriptionSeatUsage(id)
  return (
    <ItQueryState query={query}>
      <dl className='flex flex-wrap gap-6'>
        {(['purchased', 'occupied', 'free'] as const).map((key) => (
          <div key={key}>
            <dt className='text-xs text-muted-foreground'>{t(`stock.${key}`)}</dt>
            <dd className='font-mono tabular-nums'>
              {query.data?.data?.[key] == null ? t('unknown') : formatNumber(query.data.data[key])}
            </dd>
          </div>
        ))}
      </dl>
    </ItQueryState>
  )
}

export function StockSubscriptions({
  plan,
  onBack,
  onOpenGrants
}: {
  plan: PlanPageResponseDtoDataItemsItem
  onBack: () => void
  onOpenGrants?: () => void
}) {
  const { t } = useTranslation('itAdmin')
  const { t: catalogText } = useTranslation('itCatalog')
  const { formatDate } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const [vault, setVault] = useState<string>()
  const [baseline, setBaseline] = useState(false)
  const query = useSubscriptionList({ planId: plan.id, page, pageSize: 20 })
  if (baseline)
    return (
      <section className='space-y-5'>
        <button type='button' className={itButtonClass} onClick={() => setBaseline(false)}>
          {t('back')}
        </button>
        <h1 className='text-2xl font-semibold'>
          {plan.applicationName} · {plan.name}
        </h1>
        <p className='max-w-3xl text-sm text-muted-foreground'>{t('stock.baselineDescription')}</p>
        <div className='space-y-2 text-sm text-muted-foreground'>
          <p>{t('stock.csvColumns')}</p>
          <a
            className='inline-flex min-h-11 items-center font-medium text-primary hover:underline'
            href='data:text/csv;charset=utf-8,employee_code%2Caccount_identifier%2Ckind%2Cgranted_on%2Cexpected_end_date%2Creason%0A'
            download='seat-baseline.csv'
          >
            {t('stock.downloadTemplate')}
          </a>
        </div>
        <CatalogSeatBaseline applicationId={plan.applicationId} planId={plan.id} />
      </section>
    )
  if (vault)
    return (
      <section className='space-y-5'>
        <button type='button' className={itButtonClass} onClick={() => setVault(undefined)}>
          {t('back')}
        </button>
        <h1 className='text-2xl font-semibold'>
          {plan.applicationName} · {plan.name}
        </h1>
        <CatalogKeyVault subscriptionId={vault} />
      </section>
    )
  return (
    <section className='space-y-5'>
      <button type='button' className={itButtonClass} onClick={onBack}>
        {t('stock.back')}
      </button>
      <header>
        <p className='text-sm font-medium text-primary'>
          {t(plan.provisioningType === 'K2' ? 'stock.seats' : 'stock.keys')}
        </p>
        <h1 className='mt-1 text-2xl font-semibold'>{plan.applicationName}</h1>
        <p className='mt-1 text-muted-foreground'>{plan.name}</p>
      </header>
      <div className='flex flex-wrap items-start justify-between gap-4 border-y border-border py-5'>
        <div className='max-w-2xl space-y-1'>
          <h2 className='font-semibold'>
            {t(plan.provisioningType === 'K2' ? 'stock.baseline' : 'stock.keyActionTitle')}
          </h2>
          <p className='text-sm text-muted-foreground'>
            {t(plan.provisioningType === 'K2' ? 'stock.baselineDescription' : 'stock.keyActionDescription')}
          </p>
        </div>
        {plan.provisioningType === 'K2' && (
          <button type='button' className={itPrimaryClass} onClick={() => setBaseline(true)}>
            {t('stock.baseline')}
          </button>
        )}
      </div>
      {plan.provisioningType === 'K2' && onOpenGrants && (
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <p className='max-w-2xl text-sm text-muted-foreground'>{t('stock.purchaseHint')}</p>
          <button type='button' className={itButtonClass} onClick={onOpenGrants}>
            {t('stock.openGrants')}
          </button>
        </div>
      )}
      <h2 className='font-semibold'>{t('stock.subscriptions')}</h2>
      {plan.provisioningType === 'K4' && <p className='text-sm text-muted-foreground'>{t('stock.keyCapacityHint')}</p>}
      <ItQueryState query={query}>
        {query.data?.data?.items.length ? (
          <div className='space-y-3'>
            {query.data.data.items.map((item) => (
              <article key={item.id} className='space-y-4 rounded-lg border border-border bg-surface p-5'>
                <div className='flex flex-wrap items-center justify-between gap-3'>
                  <div>
                    <p className='font-medium'>{item.planName || plan.name}</p>
                    <p className='text-sm text-muted-foreground'>
                      {t('stock.status')}:{' '}
                      {item.status ? catalogText(`enums.${item.status}`, { defaultValue: t('unknown') }) : t('unknown')}
                    </p>
                    {item.startDate && item.endDate && (
                      <p className='text-sm text-muted-foreground'>
                        {formatDate(item.startDate)} – {formatDate(item.endDate)}
                      </p>
                    )}
                  </div>
                  {plan.provisioningType === 'K4' && (
                    <button type='button' className={itPrimaryClass} onClick={() => setVault(item.id)}>
                      {t('stock.openKeys')}
                    </button>
                  )}
                </div>
                <StockSeatUsage id={item.id} />
              </article>
            ))}
          </div>
        ) : (
          <p className='text-sm text-muted-foreground'>{t('stock.noSubscriptions')}</p>
        )}
      </ItQueryState>
      {query.data?.data && (
        <ItPagination page={page} total={query.data.data.pagination.totalItems} pageSize={20} onChange={setPage} />
      )}
    </section>
  )
}
