import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSubscriptionList } from '~/shared/api/generated/operations/subscriptions/subscription-list'
import { useSubscriptionSeatUsage } from '~/shared/api/generated/operations/subscriptions/subscription-seat-usage'
import type { PlanPageResponseDtoDataItemsItem } from '~/shared/api/generated/model/plans'
import { CatalogKeyVault } from '../dept-catalog/components/catalog-license-keys'
import { ItPagination } from '../shared/components/it-pagination'
import { ItQueryState } from '../shared/components/it-query-state'
import { itButtonClass, itPrimaryClass } from '../shared/components/it-form'
import { useDashboardFormat } from '../../dashboard-ui'
import { StockHolders } from './stock-holders'
import { StockMetrics } from './stock-metrics'

function StockSeatUsage({ id }: { id: string }) {
  const { t } = useTranslation('itAdmin')
  const query = useSubscriptionSeatUsage(id)
  return (
    <ItQueryState query={query}>
      <StockMetrics
        items={(['free', 'purchased', 'occupied'] as const).map((key) => ({
          label: t(`stock.${key}`),
          value: query.data?.data?.[key] ?? null,
          highlight: key === 'free'
        }))}
      />
    </ItQueryState>
  )
}

export function StockSubscriptions({
  plan,
  onBack,
  onOpenGrants
}: {
  plan: Pick<PlanPageResponseDtoDataItemsItem, 'id' | 'name' | 'applicationId' | 'applicationName' | 'provisioningType'>
  onBack: () => void
  onOpenGrants?: () => void
}) {
  const { t } = useTranslation('itAdmin')
  const { t: catalogText } = useTranslation('itCatalog')
  const { formatDate } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const [vault, setVault] = useState<string>()
  const [holders, setHolders] = useState<string>()
  const query = useSubscriptionList({ planId: plan.id, page, pageSize: 20 })
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
    <section className='space-y-6'>
      <button type='button' className={itButtonClass} onClick={onBack}>
        {t('stock.back')}
      </button>
      <header className='space-y-2 border-b border-border pb-5'>
        <p className='text-xs font-semibold uppercase tracking-wider text-primary'>
          {t(
            plan.provisioningType === 'K2'
              ? 'stock.seats'
              : plan.provisioningType === 'K4'
                ? 'stock.keys'
                : plan.provisioningType === 'K1'
                  ? 'stock.personal'
                  : 'stock.other'
          )}
        </p>
        <h1 className='text-2xl font-semibold tracking-tight'>{plan.applicationName}</h1>
        <p className='text-base font-medium text-muted-foreground'>{plan.name}</p>
      </header>
      {plan.provisioningType === 'K4' && (
        <div className='flex flex-wrap items-start justify-between gap-4 rounded-lg border border-border bg-surface p-5'>
          <div className='max-w-2xl space-y-1'>
            <h2 className='font-semibold'>{t('stock.keyActionTitle')}</h2>
            <p className='text-sm text-muted-foreground'>{t('stock.keyActionDescription')}</p>
          </div>
        </div>
      )}
      {plan.provisioningType === 'K2' && onOpenGrants && (
        <div className='flex flex-wrap items-center justify-between gap-3 rounded-lg bg-surface-subtle p-4'>
          <p className='max-w-2xl text-sm text-muted-foreground'>{t('stock.purchaseHint')}</p>
          <button type='button' className={itButtonClass} onClick={onOpenGrants}>
            {t('stock.openGrants')}
          </button>
        </div>
      )}
      <h2 className='border-b border-border pb-3 text-lg font-semibold'>{t('stock.subscriptions')}</h2>
      {plan.provisioningType === 'K4' && <p className='text-sm text-muted-foreground'>{t('stock.keyCapacityHint')}</p>}
      <ItQueryState query={query}>
        {query.data?.data?.items.length ? (
          <div className='space-y-3'>
            {query.data.data.items.map((item) => (
              <article key={item.id} className='space-y-4 rounded-lg border border-border bg-surface p-5'>
                <div className='flex flex-wrap items-start justify-between gap-4 border-b border-border/70 pb-4'>
                  <div className='space-y-1'>
                    <p className='text-base font-semibold'>{item.planName || plan.name}</p>
                    <p className='text-sm text-muted-foreground'>
                      {t('stock.status')}:{' '}
                      <span className='font-medium text-foreground'>
                        {item.status
                          ? catalogText(`enums.${item.status}`, { defaultValue: t('unknown') })
                          : t('unknown')}
                      </span>
                    </p>
                    {item.startDate && item.endDate && (
                      <p className='text-sm text-muted-foreground'>
                        {formatDate(item.startDate)} – {formatDate(item.endDate)}
                      </p>
                    )}
                  </div>
                  <div className='flex flex-wrap gap-2'>
                    {plan.provisioningType === 'K4' && (
                      <button type='button' className={itPrimaryClass} onClick={() => setVault(item.id)}>
                        {t('stock.openKeys')}
                      </button>
                    )}
                    <button
                      type='button'
                      className={itButtonClass}
                      aria-expanded={holders === item.id}
                      onClick={() => setHolders((previous) => (previous === item.id ? undefined : item.id))}
                    >
                      {t('stock.viewHolders')}
                    </button>
                  </div>
                </div>
                {plan.provisioningType === 'K2' && <StockSeatUsage id={item.id} />}
                {holders === item.id && <StockHolders key={item.id} subscriptionId={item.id} />}
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
