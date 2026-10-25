import { CheckCircle2, History, Lock, PencilLine, XCircle } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Notice, PageHeader, Panel, PanelTitle, StatTile } from '../../../dashboard-ui'
import { approverHistoryKinds, type DecisionOutcome } from '../../../finance/annual-budget-data'
import { useAnnualBudgetState } from '../../../finance/annual-budget-store'
import {
  ApprovalDecisionHistoryFilters,
  defaultApproverHistoryFilters,
  matchesApproverHistoryFilters,
  type ApproverHistoryFilters
} from '../components/approval-decision-history-filters'
import { ApprovalDecisionHistoryEntry } from '../components/approval-decision-history-entry'

/** APV-06: read-only audit trail of the Spending Approver's decisions, newest first. */
export function ApprovalDecisionHistoryView({ formatCurrency }: { formatCurrency: (value: number) => string }) {
  const { t } = useTranslation('dashboard')
  const { history } = useAnnualBudgetState()
  const [filters, setFilters] = useState<ApproverHistoryFilters>(defaultApproverHistoryFilters)

  const decisions = history
    .filter((entry) => approverHistoryKinds.includes(entry.kind))
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
  const visible = decisions.filter((entry) => matchesApproverHistoryFilters(entry, filters))
  const countOutcome = (value: DecisionOutcome) => decisions.filter((entry) => entry.outcome === value).length

  return (
    <div className='space-y-6'>
      <PageHeader subtitle={t('budgetPlan.approverHistory.subtitle')} title={t('budgetPlan.approverHistory.title')} />

      <section
        aria-label={t('budgetPlan.approverHistory.summaryLabel')}
        className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'
      >
        <StatTile
          icon={History}
          label={t('budgetPlan.approverHistory.tiles.decisions')}
          tone='primary'
          value={String(decisions.length)}
        />
        <StatTile
          icon={CheckCircle2}
          label={t('budgetPlan.approverHistory.tiles.approved')}
          tone='success'
          value={String(countOutcome('APPROVED'))}
        />
        <StatTile
          icon={XCircle}
          label={t('budgetPlan.approverHistory.tiles.rejected')}
          tone='danger'
          value={String(countOutcome('REJECTED'))}
        />
        <StatTile
          icon={PencilLine}
          label={t('budgetPlan.approverHistory.tiles.adjustment')}
          tone='warning'
          value={String(countOutcome('ADJUSTMENT_REQUESTED'))}
        />
      </section>

      <Notice icon={Lock} tone='neutral'>
        {t('budgetPlan.approverHistory.readOnly')}
      </Notice>

      <ApprovalDecisionHistoryFilters applied={filters} decisions={decisions} onApply={setFilters} />

      <Panel>
        <PanelTitle
          hint={t('budgetPlan.approverHistory.listHint', { count: visible.length })}
          title={t('budgetPlan.approverHistory.listTitle')}
        />

        <ol aria-label={t('budgetPlan.approverHistory.listLabel')} className='mt-4 divide-y divide-border'>
          {visible.map((entry) => (
            <ApprovalDecisionHistoryEntry entry={entry} formatCurrency={formatCurrency} key={entry.id} />
          ))}
        </ol>
        {visible.length === 0 && (
          <p className='py-6 text-center text-xs text-muted-foreground'>{t('budgetPlan.approverHistory.empty')}</p>
        )}
      </Panel>
    </div>
  )
}
