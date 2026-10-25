import { ArrowRight, Lock } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { financeDemoText } from '../../finance-demo-labels'

import { Notice, PageHeader, Panel, PanelTitle, Pill, useDashboardFormat, type Tone } from '../../../dashboard-ui'
import type { HistoryEntry, HistoryKind } from '../../annual-budget-data'
import { useAnnualBudgetState } from '../../annual-budget-store'
import {
  FinanceDecisionHistoryFilters,
  defaultDecisionHistoryFilters,
  matchesDecisionHistoryFilters,
  type DecisionHistoryFilters
} from '../components/finance-decision-history-filters'

export const historyKindTones: Record<HistoryKind, Tone> = {
  ADJUSTMENT: 'warning',
  ADJUSTMENT_APPROVAL: 'warning',
  APPROVAL: 'success',
  BUDGET_CHANGE: 'primary',
  BUFFER: 'info',
  CUT: 'danger',
  EXCEPTION: 'warning',
  EXCEPTION_APPROVAL: 'danger',
  REVIEW: 'neutral',
  SPEND_APPROVAL: 'info'
}

/** FIN-47: read-only audit trail of every budget decision, newest first. */
export function FinanceDecisionHistoryView({ formatCurrency }: { formatCurrency: (value: number) => string }) {
  const { t } = useTranslation('dashboard')
  const { formatDate, formatPercent } = useDashboardFormat()
  const { history } = useAnnualBudgetState()
  const [filters, setFilters] = useState<DecisionHistoryFilters>(defaultDecisionHistoryFilters)

  const sorted = [...history].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
  const visible = sorted.filter((entry) => matchesDecisionHistoryFilters(entry, filters))

  const formatValue = (entry: HistoryEntry, value: number) =>
    entry.kind === 'BUFFER' ? formatPercent(value) : formatCurrency(value)

  return (
    <div className='space-y-6'>
      <PageHeader subtitle={t('budgetPlan.history.subtitle')} title={t('budgetPlan.history.title')} />

      <Notice icon={Lock} tone='neutral'>
        {t('budgetPlan.history.readOnly')}
      </Notice>

      <FinanceDecisionHistoryFilters applied={filters} history={history} onApply={setFilters} />

      <Panel>
        <PanelTitle
          hint={t('budgetPlan.history.listHint', { count: visible.length })}
          title={t('budgetPlan.history.listTitle')}
        />

        <ol aria-label={t('budgetPlan.history.listLabel')} className='mt-4 divide-y divide-border'>
          {visible.map((entry) => (
            <li className='grid gap-2 py-3 text-xs sm:grid-cols-[10rem_minmax(0,1fr)]' key={entry.id}>
              <div className='text-muted-foreground'>
                <p className='font-semibold text-foreground'>{formatDate(entry.at)}</p>
                <p className='mt-0.5'>{entry.actor}</p>
              </div>
              <div className='min-w-0 space-y-1.5'>
                <div className='flex flex-wrap items-center gap-2'>
                  <Pill tone={historyKindTones[entry.kind]}>{t(`budgetPlan.history.kind.${entry.kind}`)}</Pill>
                  <span className='font-mono font-bold text-primary'>{entry.costCenter}</span>
                  <span className='text-muted-foreground'>{t('budgetPlan.fiscalYear', { year: entry.year })}</span>
                </div>
                {(entry.before !== undefined || entry.after !== undefined) && (
                  <p className='flex flex-wrap items-center gap-1.5 font-semibold text-foreground'>
                    {entry.before !== undefined && (
                      <span className='text-muted-foreground line-through'>{formatValue(entry, entry.before)}</span>
                    )}
                    {entry.before !== undefined && entry.after !== undefined && (
                      <ArrowRight aria-hidden='true' className='size-3.5 text-muted-foreground' />
                    )}
                    {entry.after !== undefined &&
                      (entry.kind === 'BUFFER' ? (
                        <span>{t('budgetPlan.history.bufferRate', { rate: formatPercent(entry.after) })}</span>
                      ) : (
                        <span>{formatValue(entry, entry.after)}</span>
                      ))}
                  </p>
                )}
                <p className='text-muted-foreground'>{financeDemoText(entry.note)}</p>
              </div>
            </li>
          ))}
        </ol>
        {visible.length === 0 && (
          <p className='py-6 text-center text-xs text-muted-foreground'>{t('budgetPlan.history.empty')}</p>
        )}
      </Panel>
    </div>
  )
}
