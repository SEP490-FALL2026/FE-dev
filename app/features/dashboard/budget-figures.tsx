import { CircleAlert, Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { InfoRow, Pill, useDashboardFormat } from './dashboard-ui'

/**
 * Budget snapshot of one Cost Center and period (FR-3.14 (1), FR-5.1).
 * Every amount is borne cost; deductible VAT is shown apart and never consumes budget (FR-5.13, QĐ-60a).
 * `budget === null` means no Budget exists yet: show "No budget", never 0.
 */
export interface BudgetSnapshot {
  actual: number
  asOf: string
  budget: number | null
  costCenter: string
  deductibleVat: number
  held: number
  pending: number
  period: string
}

/** Estimated cost of a spend request or commitment (FR-5.13 (2)). */
export interface CostEstimate {
  deductibleVat: number
  nonDeductibleTax: number
  preTax: number
}

export function getRemaining(snapshot: Pick<BudgetSnapshot, 'actual' | 'budget' | 'held'>): number | null {
  return snapshot.budget === null ? null : snapshot.budget - snapshot.actual - snapshot.held
}

export function getBorneCost(estimate: CostEstimate) {
  return estimate.preTax + estimate.nonDeductibleTax
}

export function getTotalPayable(estimate: CostEstimate) {
  return estimate.preTax + estimate.nonDeductibleTax + estimate.deductibleVat
}

export function RemainingValue({
  formatCurrency,
  remaining
}: {
  formatCurrency: (value: number) => string
  remaining: number | null
}) {
  const { t } = useTranslation('dashboard')

  if (remaining === null) {
    return <Pill tone='warning'>{t('budget.noBudget')}</Pill>
  }

  if (remaining < 0) {
    return (
      <span className='inline-flex flex-wrap items-center justify-end gap-1.5'>
        <span className='font-bold text-danger'>{formatCurrency(remaining)}</span>
        <Pill tone='danger'>{t('budget.overCommitted')}</Pill>
      </span>
    )
  }

  return <span className='font-bold text-success'>{formatCurrency(remaining)}</span>
}

export function BudgetSnapshotPanel({
  formatCurrency,
  snapshot,
  title
}: {
  formatCurrency: (value: number) => string
  snapshot: BudgetSnapshot
  title?: string
}) {
  const { t } = useTranslation('dashboard')
  const { formatDateTime } = useDashboardFormat()
  const remaining = getRemaining(snapshot)
  const usedRatio =
    snapshot.budget && snapshot.budget > 0 ? Math.min(1, (snapshot.actual + snapshot.held) / snapshot.budget) : 0

  return (
    <div className='rounded-xl border border-border bg-background p-4'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <p className='text-xs font-bold text-foreground'>{title ?? t('budget.snapshotTitle')}</p>
        <span className='font-mono text-[0.7rem] font-semibold text-muted-foreground'>
          {snapshot.costCenter} · {snapshot.period}
        </span>
      </div>

      <div className='mt-3 divide-y divide-border'>
        <InfoRow
          label={t('budget.budget')}
          value={
            snapshot.budget === null ? (
              <Pill tone='warning'>{t('budget.noBudget')}</Pill>
            ) : (
              formatCurrency(snapshot.budget)
            )
          }
        />
        <InfoRow label={t('budget.actual')} value={formatCurrency(snapshot.actual)} />
        <InfoRow
          label={t('budget.held')}
          value={<span className='text-warning'>{formatCurrency(snapshot.held)}</span>}
        />
        <InfoRow
          label={t('budget.remaining')}
          value={<RemainingValue formatCurrency={formatCurrency} remaining={remaining} />}
        />
        <InfoRow label={t('budget.pending')} value={formatCurrency(snapshot.pending)} />
        <InfoRow
          label={t('budget.deductibleVat')}
          value={<span className='text-muted-foreground'>{formatCurrency(snapshot.deductibleVat)}</span>}
        />
      </div>

      {snapshot.budget !== null && (
        <div
          aria-label={t('budget.usedRatio')}
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={Math.round(usedRatio * 100)}
          className='mt-3 h-2 overflow-hidden rounded-full bg-surface-subtle'
          role='progressbar'
        >
          <div
            className={`h-full rounded-full ${remaining !== null && remaining < 0 ? 'bg-danger' : usedRatio > 0.85 ? 'bg-warning' : 'bg-primary'}`}
            style={{ width: `${usedRatio * 100}%` }}
          />
        </div>
      )}

      <p className='mt-3 flex items-center gap-1.5 text-[0.7rem] text-muted-foreground'>
        <Clock aria-hidden='true' className='size-3.5' />
        {t('budget.asOf', { time: formatDateTime(snapshot.asOf) })}
      </p>
      <p className='mt-1 flex items-start gap-1.5 text-[0.7rem] text-muted-foreground'>
        <CircleAlert aria-hidden='true' className='mt-px size-3.5 shrink-0' />
        {t('budget.borneCostNote')}
      </p>
    </div>
  )
}

export function CostEstimatePanel({
  estimate,
  formatCurrency
}: {
  estimate: CostEstimate
  formatCurrency: (value: number) => string
}) {
  const { t } = useTranslation('dashboard')

  return (
    <div className='rounded-xl border border-border bg-background p-4'>
      <div className='flex items-center justify-between gap-2'>
        <p className='text-xs font-bold text-foreground'>{t('budget.estimateTitle')}</p>
        <Pill>{t('budget.estimated')}</Pill>
      </div>
      <div className='mt-3 divide-y divide-border'>
        <InfoRow label={t('budget.preTax')} value={formatCurrency(estimate.preTax)} />
        <InfoRow label={t('budget.nonDeductibleTax')} value={formatCurrency(estimate.nonDeductibleTax)} />
        <InfoRow
          label={t('budget.borneCost')}
          value={<span className='text-primary'>{formatCurrency(getBorneCost(estimate))}</span>}
        />
        <InfoRow
          label={t('budget.deductibleVatSeparate')}
          value={<span className='text-muted-foreground'>{formatCurrency(estimate.deductibleVat)}</span>}
        />
        <InfoRow label={t('budget.totalPayable')} value={formatCurrency(getTotalPayable(estimate))} />
      </div>
    </div>
  )
}
