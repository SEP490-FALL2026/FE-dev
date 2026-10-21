import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Panel, PanelTitle, Pill, useDashboardFormat, type Tone } from '../../dashboard-ui'
import type { AnnualProposal, DecisionOutcome, HistoryEntry } from '../../finance/annual-budget-data'
import { useAnnualBudgetState } from '../../finance/annual-budget-store'
import { historyKindTones } from '../../finance/views/finance-decision-history-view'

export const decisionOutcomeTones: Record<DecisionOutcome, Tone> = {
  ADJUSTMENT_REQUESTED: 'warning',
  APPROVED: 'success',
  REJECTED: 'danger'
}

/**
 * APV-05: change history of this department's budget for the planning year — Finance's cuts, buffer and reviews,
 * and earlier decisions with their outcome and version — newest first.
 */
export function ApprovalAnnualBudgetHistory({
  formatCurrency,
  proposal
}: {
  formatCurrency: (value: number) => string
  proposal: AnnualProposal
}) {
  const { t } = useTranslation('dashboard')
  const { formatDate, formatPercent } = useDashboardFormat()
  const entries = useAnnualBudgetState()
    .history.filter((entry) => entry.costCenter === proposal.costCenter && entry.year === proposal.year)
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())

  const formatValue = (entry: HistoryEntry, value: number) =>
    entry.kind === 'BUFFER'
      ? t('budgetPlan.approver.history.bufferRate', { rate: formatPercent(value) })
      : formatCurrency(value)

  return (
    <Panel>
      <PanelTitle hint={t('budgetPlan.approver.history.hint')} title={t('budgetPlan.approver.history.title')} />
      {entries.length === 0 ? (
        <p className='mt-4 text-xs text-muted-foreground'>{t('budgetPlan.approver.history.empty')}</p>
      ) : (
        <ol
          aria-label={t('budgetPlan.approver.history.listLabel', { department: proposal.department })}
          className='mt-4 space-y-3'
        >
          {entries.map((entry) => (
            <li className='space-y-1.5 rounded-xl border border-border p-3 text-xs' key={entry.id}>
              <div className='flex flex-wrap items-center gap-2'>
                <Pill tone={historyKindTones[entry.kind]}>{t(`budgetPlan.history.kind.${entry.kind}`)}</Pill>
                {entry.outcome && (
                  <Pill tone={decisionOutcomeTones[entry.outcome]}>
                    {t(`budgetPlan.approver.outcome.${entry.outcome}`)}
                  </Pill>
                )}
                {entry.version !== undefined && (
                  <span className='font-mono font-semibold text-muted-foreground'>
                    {t('budgetPlan.approver.version', { version: entry.version })}
                  </span>
                )}
                <span className='ml-auto text-muted-foreground'>
                  {t('budgetPlan.approver.notice.by', { by: entry.actor, time: formatDate(entry.at) })}
                </span>
              </div>
              {(entry.before !== undefined || entry.after !== undefined) && (
                <p className='flex flex-wrap items-center gap-1.5 font-semibold text-foreground'>
                  {entry.before !== undefined && (
                    <span className='text-muted-foreground line-through'>{formatValue(entry, entry.before)}</span>
                  )}
                  {entry.before !== undefined && entry.after !== undefined && (
                    <ArrowRight aria-hidden='true' className='size-3.5 text-muted-foreground' />
                  )}
                  {entry.after !== undefined && <span>{formatValue(entry, entry.after)}</span>}
                </p>
              )}
              <p className='text-muted-foreground'>{entry.note}</p>
            </li>
          ))}
        </ol>
      )}
    </Panel>
  )
}
