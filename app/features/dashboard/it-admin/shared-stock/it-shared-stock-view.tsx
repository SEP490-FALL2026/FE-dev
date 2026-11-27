import { useState } from 'react'
import { Boxes } from 'lucide-react'
import { ItPageHeader } from '../shared/components/it-page-header'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Package } from 'lucide-react'
import { usePlanList } from '~/shared/api/generated/operations/plans/plan-list'
import {
  getStockSummaryListQueryKey,
  stockSummaryList
} from '~/shared/api/generated/operations/stock-summary/stock-summary-list'
import type { PlanPageResponseDtoDataItemsItem } from '~/shared/api/generated/model/plans'
import { ItEmpty, ItQueryState } from '../shared/components/it-query-state'
import { ItPagination } from '../shared/components/it-pagination'
import { itButtonClass } from '../shared/components/it-form'
import { StockSubscriptions } from './stock-subscriptions'
import { StockMetrics } from './stock-metrics'

export function ItSharedStockView({ onOpenGrants }: { onOpenGrants?: () => void }) {
  const { t } = useTranslation('itAdmin')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<PlanPageResponseDtoDataItemsItem>()
  const plans = usePlanList({ page, pageSize: 20 })
  const stock = useQuery({
    queryKey: [...getStockSummaryListQueryKey(), 'all-plans'],
    queryFn: async () => {
      const items = []
      let page = 1
      let totalPages = 1
      while (page <= totalPages) {
        const response = await stockSummaryList({ page, pageSize: 100 })
        if (!response.data) throw new Error('Missing stock summary page')
        items.push(...response.data.items)
        totalPages = response.data.pagination.totalPages ?? 1
        page++
      }
      return items
    }
  })
  if (selected)
    return <StockSubscriptions plan={selected} onBack={() => setSelected(undefined)} onOpenGrants={onOpenGrants} />
  return (
    <section className='space-y-6'>
      <ItPageHeader icon={Boxes} title={t('stock.title')} subtitle={t('stock.catalogHint')} />
      <div className='space-y-1'>
        <h2 className='section-accent text-lg font-semibold tracking-tight'>{t('stock.choosePlan')}</h2>
        <p className='text-sm text-muted-foreground'>{t('stock.choosePlanHint')}</p>
      </div>
      {stock.isError && (
        <div role='status' className='flex flex-wrap items-center gap-3 text-sm text-muted-foreground'>
          <p>{t('stock.summaryUnavailable')}</p>
          <button type='button' className={itButtonClass} onClick={() => void stock.refetch()}>
            {t('retry')}
          </button>
        </div>
      )}
      <ItQueryState query={plans}>
        {plans.data?.data?.items.length ? (
          <div className='grid gap-4 lg:grid-cols-2'>
            {plans.data.data.items.map((plan) => {
              const summary = stock.data?.find((item) => item.plan.planId === plan.id)?.stock
              return (
                <article key={plan.id} className='flex min-w-0 flex-col rounded-lg border border-border bg-surface p-5'>
                  <div className='flex items-start gap-3'>
                    <span className='grid size-10 shrink-0 place-items-center rounded-md bg-primary-soft text-primary-ink'>
                      <Package aria-hidden strokeWidth={1.5} className='size-5' />
                    </span>
                    <div className='min-w-0 space-y-1'>
                      <h3 className='break-words text-base font-semibold'>
                        {plan.applicationName} · {plan.name}
                      </h3>
                      <p className='text-sm text-muted-foreground'>
                        {t(
                          plan.provisioningType === 'K2'
                            ? 'stock.seats'
                            : plan.provisioningType === 'K4'
                              ? 'stock.keys'
                              : plan.provisioningType === 'K1'
                                ? 'stock.personal'
                                : plan.provisioningType === 'K5'
                                  ? 'stock.internal'
                                  : 'stock.other'
                        )}
                      </p>
                    </div>
                  </div>
                  <div className='mt-4 flex-1 border-t border-border/70 pt-4'>
                    {plan.provisioningType === 'K5' ? (
                      <p className='text-sm text-muted-foreground'>{t('stock.internalNoSubscription')}</p>
                    ) : stock.isPending ? (
                      <p role='status' className='text-sm text-muted-foreground'>
                        {t('loading')}
                      </p>
                    ) : stock.isSuccess && !summary ? (
                      <p className='text-sm text-muted-foreground'>{t('stock.noActiveStock')}</p>
                    ) : summary ? (
                      <>
                        <StockMetrics
                          items={
                            summary.kind === 'SEATS'
                              ? [
                                  { label: t('stock.free'), value: summary.free, highlight: true },
                                  { label: t('stock.purchased'), value: summary.purchased },
                                  { label: t('stock.assigned'), value: summary.assigned }
                                ]
                              : summary.kind === 'KEYS'
                                ? [
                                    { label: t('stock.inStore'), value: summary.inStore, highlight: true },
                                    { label: t('stock.assigned'), value: summary.assigned },
                                    { label: t('stock.withdrawn'), value: summary.withdrawn }
                                  ]
                                : [{ label: t('stock.accountHolders'), value: summary.holders }]
                          }
                        />
                        {summary.kind === 'KEYS' && (
                          <p className='mt-2 text-xs text-muted-foreground'>{t('stock.keysAvailabilityNote')}</p>
                        )}
                      </>
                    ) : null}
                  </div>
                  {plan.provisioningType !== 'K5' && (
                    <button
                      type='button'
                      className={`${itButtonClass} mt-4 self-start`}
                      onClick={() => setSelected(plan)}
                    >
                      {t('stock.select')}
                      <ArrowRight aria-hidden strokeWidth={1.5} className='size-4' />
                    </button>
                  )}
                </article>
              )
            })}
          </div>
        ) : (
          <ItEmpty />
        )}
      </ItQueryState>
      {plans.data?.data && (
        <ItPagination page={page} total={plans.data.data.pagination.totalItems} pageSize={20} onChange={setPage} />
      )}
    </section>
  )
}
