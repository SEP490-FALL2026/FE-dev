import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSubscriptionRenewalGet } from '~/shared/api/generated/operations/subscription-renewals/subscription-renewal-get'
import { useDashboardFormat } from '../../../dashboard-ui'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { itButtonClass, itPrimaryClass } from '../../shared/components/it-form'
import { RenewalOutcomeDialog } from './renewal-outcome-dialog'
import { RenewalSeatRanking } from './renewal-seat-ranking'
import { RenewalState } from '../enums/renewal-state'
import { ItDetailDialog } from '../../shared/components/it-detail-dialog'

export function RenewalDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const { t: translate } = useTranslation('itRenewals')
  const { formatDate, formatNumber } = useDashboardFormat()
  const query = useSubscriptionRenewalGet(id)
  const item = query.data?.data?.renewal
  const [outcomeOpen, setOutcomeOpen] = useState(false)
  const [rankingOpen, setRankingOpen] = useState(false)
  if (outcomeOpen && item) return <RenewalOutcomeDialog renewal={item} onClose={() => setOutcomeOpen(false)} />
  return (
    <section className='space-y-5'>
      <button type='button' className={itButtonClass} onClick={onBack}>
        {translate('back')}
      </button>
      <ItQueryState query={query}>
        {item ? (
          <>
            <header className='flex flex-wrap items-start justify-between gap-3'>
              <div className='min-w-0 flex-1'>
                <h1
                  className='truncate text-2xl font-semibold tracking-tight'
                  title={item.subscription.applicationName}
                >
                  {item.subscription.applicationName}
                </h1>
                <p className='truncate text-sm text-muted-foreground' title={item.subscription.planName}>
                  {item.subscription.planName}
                </p>
              </div>
              {item.state === RenewalState.DECIDED && (
                <button
                  type='button'
                  className={itPrimaryClass}
                  disabled={query.isFetching}
                  onClick={() => setOutcomeOpen(true)}
                >
                  {translate('recordOutcome')}
                </button>
              )}
            </header>
            <dl className='grid gap-4 rounded-lg border border-border/70 bg-surface p-5 sm:grid-cols-2 lg:grid-cols-4'>
              <div>
                <dt className='text-xs text-muted-foreground'>{translate('state')}</dt>
                <dd className='mt-1 text-sm font-medium'>
                  {translate(`values.${item.state}`, { defaultValue: translate('unknown') })}
                </dd>
              </div>
              <div>
                <dt className='text-xs text-muted-foreground'>{translate('milestone')}</dt>
                <dd className='mt-1 text-right font-mono text-sm tabular-nums'>
                  {formatDate(item.milestone.baseDate)}
                </dd>
              </div>
              <div>
                <dt className='text-xs text-muted-foreground'>{translate('purchasedQuantity')}</dt>
                <dd className='mt-1 text-right font-mono text-sm tabular-nums'>
                  {item.period.purchasedQuantity === null
                    ? translate('unknown')
                    : formatNumber(item.period.purchasedQuantity)}
                </dd>
              </div>
              <div>
                <dt className='text-xs text-muted-foreground'>{translate('seatsInUse')}</dt>
                <dd className='mt-1 text-right font-mono text-sm tabular-nums'>
                  {formatNumber(item.period.seatsInUse)}
                </dd>
              </div>
            </dl>
            {item.waitingReason && (
              <p className='text-sm text-muted-foreground'>
                {translate('waitingReason')}:{' '}
                {translate(`values.${item.waitingReason}`, { defaultValue: translate('unknown') })}
              </p>
            )}
            <div className='grid gap-4 lg:grid-cols-2'>
              <section className='space-y-3 rounded-lg border border-border/70 bg-surface p-5'>
                <h2 className='font-semibold'>{translate('proposal')}</h2>
                <p className='text-sm'>
                  {translate(`values.${item.proposal.choice}`)}
                  {item.proposal.quantity !== null && (
                    <span className='ml-2 font-mono tabular-nums'>{formatNumber(item.proposal.quantity)}</span>
                  )}
                </p>
                <p className='whitespace-pre-wrap break-words text-sm text-muted-foreground'>{item.proposal.note}</p>
                {item.proposal.businessOwnerOpinion && (
                  <div className='text-sm'>
                    <h3 className='font-medium'>{translate('opinion')}</h3>
                    <p className='whitespace-pre-wrap break-words text-muted-foreground'>
                      {item.proposal.businessOwnerOpinion}
                    </p>
                  </div>
                )}
              </section>
              <section className='space-y-3 rounded-lg border border-border/70 bg-surface p-5'>
                <h2 className='font-semibold'>{translate('decision')}</h2>
                {item.decision ? (
                  <>
                    <p className='text-sm'>
                      {translate(`values.${item.decision.choice}`)}
                      {item.decision.quantity !== null && (
                        <span className='ml-2 font-mono tabular-nums'>{formatNumber(item.decision.quantity)}</span>
                      )}
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      {translate(`values.${item.decision.executionPoint}`, { defaultValue: translate('unknown') })}
                    </p>
                    <p className='whitespace-pre-wrap break-words text-sm'>{item.decision.reason}</p>
                  </>
                ) : (
                  <p className='text-sm text-muted-foreground'>{translate('values.PROPOSED')}</p>
                )}
              </section>
            </div>
            {item.outcomeDetail && (
              <section className='space-y-2 rounded-lg border border-border/70 bg-surface p-5'>
                <h2 className='font-semibold'>{translate('outcomeDetail')}</h2>
                <p className='text-sm'>{translate(`values.${item.outcomeDetail.kind}`)}</p>
                <p className='whitespace-pre-wrap break-words text-sm text-muted-foreground'>
                  {item.outcomeDetail.note}
                </p>
                {item.outcomeDetail.vendorFollowUpOpen && (
                  <p className='text-sm text-warning'>{translate('followUp')}</p>
                )}
              </section>
            )}
            <button
              type='button'
              className={itButtonClass}
              aria-expanded={rankingOpen}
              onClick={() => setRankingOpen(!rankingOpen)}
            >
              {translate('ranking')}
            </button>
            {rankingOpen && (
              <ItDetailDialog title={translate('ranking')} onClose={() => setRankingOpen(false)}>
                <RenewalSeatRanking id={id} />
              </ItDetailDialog>
            )}
          </>
        ) : (
          <ItEmpty />
        )}
      </ItQueryState>
    </section>
  )
}
