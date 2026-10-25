import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Pill, useDashboardFormat, type Tone } from '../../../dashboard-ui'
import type { DecisionOutcome, HistoryEntry } from '../../../finance/annual-budget-data'
import { historyKindTones } from '../../../finance/decisions/views/finance-decision-history-view'

export const outcomeTones: Record<DecisionOutcome, Tone> = {
  ADJUSTMENT_REQUESTED: 'warning',
  APPROVED: 'success',
  REJECTED: 'danger'
}

/** One recorded Spending Approver decision in the APV-06 audit trail. */
export function ApprovalDecisionHistoryEntry({
  entry,
  formatCurrency
}: {
  entry: HistoryEntry
  formatCurrency: (value: number) => string
}) {
  const { t } = useTranslation('dashboard')
  const { formatDate } = useDashboardFormat()
  const needsReason = entry.outcome === 'REJECTED' || entry.outcome === 'ADJUSTMENT_REQUESTED'

  return (
    <li className='grid gap-2 py-3 text-xs sm:grid-cols-[10rem_minmax(0,1fr)]'>
      <div className='text-muted-foreground'>
        <p className='font-semibold text-foreground'>{formatDate(entry.at)}</p>
        <p className='mt-0.5'>{entry.actor}</p>
      </div>
      <div className='min-w-0 space-y-1.5'>
        <div className='flex flex-wrap items-center gap-2'>
          <Pill tone={historyKindTones[entry.kind]}>{t(`budgetPlan.history.kind.${entry.kind}`)}</Pill>
          {entry.outcome && (
            <Pill tone={outcomeTones[entry.outcome]}>{t(`budgetPlan.approverHistory.outcome.${entry.outcome}`)}</Pill>
          )}
          <span className='font-mono font-bold text-primary'>{entry.costCenter}</span>
          <span className='text-muted-foreground'>{t('budgetPlan.fiscalYear', { year: entry.year })}</span>
          {entry.version !== undefined && (
            <Pill tone='neutral'>{t('budgetPlan.approverHistory.version', { version: entry.version })}</Pill>
          )}
        </div>
        {entry.after !== undefined && (
          <p className='flex flex-wrap items-center gap-1.5 font-semibold text-foreground'>
            {entry.before !== undefined && (
              <>
                <span className='sr-only'>{t('budgetPlan.approverHistory.amountChange')}</span>
                <span className='text-muted-foreground line-through'>{formatCurrency(entry.before)}</span>
                <ArrowRight aria-hidden='true' className='size-3.5 text-muted-foreground' />
              </>
            )}
            <span>{formatCurrency(entry.after)}</span>
          </p>
        )}
        <dl className='flex flex-wrap gap-x-1.5'>
          <dt className='font-semibold text-foreground'>
            {needsReason ? t('budgetPlan.approverHistory.reason') : t('budgetPlan.approverHistory.note')}
          </dt>
          <dd className='min-w-0 text-muted-foreground'>{entry.note}</dd>
        </dl>
      </div>
    </li>
  )
}
