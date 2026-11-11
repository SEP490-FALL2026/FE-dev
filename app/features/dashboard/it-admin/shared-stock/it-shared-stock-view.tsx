import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowRight, KeyRound, UsersRound } from 'lucide-react'
import { usePlanList } from '~/shared/api/generated/operations/plans/plan-list'
import type { PlanPageResponseDtoDataItemsItem } from '~/shared/api/generated/model/plans'
import { ItEmpty, ItQueryState } from '../shared/components/it-query-state'
import { ItPagination } from '../shared/components/it-pagination'
import { itButtonClass } from '../shared/components/it-form'
import { StockSubscriptions } from './stock-subscriptions'

export function ItSharedStockView({ onOpenGrants }: { onOpenGrants?: () => void }) {
  const { t } = useTranslation('itAdmin')
  const [kind, setKind] = useState<'K2' | 'K4'>('K2')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<PlanPageResponseDtoDataItemsItem>()
  const query = usePlanList({ provisioningType: kind, page, pageSize: 20 })

  if (selected)
    return <StockSubscriptions plan={selected} onBack={() => setSelected(undefined)} onOpenGrants={onOpenGrants} />
  return (
    <section className='space-y-7'>
      <header className='space-y-2 border-b border-border pb-6'>
        <p className='text-xs font-semibold uppercase tracking-wider text-primary'>{t('stock.eyebrow')}</p>
        <h1 className='text-2xl font-semibold tracking-tight'>{t('stock.title')}</h1>
        <p className='max-w-3xl text-sm text-muted-foreground'>{t('stock.description')}</p>
      </header>
      <div className='grid gap-3 sm:grid-cols-2' role='group' aria-label={t('stock.title')}>
        {(['K2', 'K4'] as const).map((value) => (
          <button
            key={value}
            type='button'
            className='flex min-h-24 items-start gap-4 rounded-lg border border-border bg-surface p-4 text-left transition-colors hover:border-primary/50 aria-pressed:border-primary aria-pressed:bg-primary-soft'
            aria-pressed={kind === value}
            onClick={() => {
              setKind(value)
              setPage(1)
            }}
          >
            {value === 'K2' ? (
              <UsersRound aria-hidden className='mt-0.5 size-5 shrink-0' />
            ) : (
              <KeyRound aria-hidden className='mt-0.5 size-5 shrink-0' />
            )}
            <span className='space-y-1'>
              <span className='block font-semibold'>{t(value === 'K2' ? 'stock.seats' : 'stock.keys')}</span>
              <span className='block text-sm text-muted-foreground'>
                {t(value === 'K2' ? 'stock.seatsHint' : 'stock.keysHint')}
              </span>
            </span>
          </button>
        ))}
      </div>
      <div className='space-y-1'>
        <h2 className='text-lg font-semibold'>{t('stock.choosePlan')}</h2>
        <p className='text-sm text-muted-foreground'>{t('stock.choosePlanHint')}</p>
      </div>
      <ItQueryState query={query}>
        {query.data?.data?.items.length ? (
          <div className='divide-y divide-border rounded-lg border border-border bg-surface'>
            {query.data.data.items.map((plan) => (
              <article key={plan.id} className='flex flex-wrap items-center justify-between gap-4 p-5'>
                <div className='min-w-0'>
                  <h2 className='font-semibold'>{plan.applicationName}</h2>
                  <p className='text-sm text-muted-foreground'>{plan.name}</p>
                </div>
                <button type='button' className={itButtonClass} onClick={() => setSelected(plan)}>
                  {t('stock.select')}
                  <ArrowRight aria-hidden className='size-4' />
                </button>
              </article>
            ))}
          </div>
        ) : (
          <ItEmpty />
        )}
      </ItQueryState>
      {query.data?.data && (
        <ItPagination page={page} total={query.data.data.pagination.totalItems} pageSize={20} onChange={setPage} />
      )}
    </section>
  )
}
