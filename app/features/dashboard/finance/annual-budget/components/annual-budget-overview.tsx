import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { RemainingValue } from '../../../budget-figures'
import { Panel, PanelTitle, Pill } from '../../../dashboard-ui'
import {
  activeFiscalYear,
  annualBudgets2026,
  annualTotal,
  planningFiscalYear,
  proposalTotals,
  unpaidCommitments,
  usedThisYear,
  type ProposalStage
} from '../../annual-budget-data'
import { useAnnualBudgetState } from '../../annual-budget-store'
import type { FinanceTabKey } from '../../finance-nav'
import { ProposalStagePill } from './budget-plan-parts'

/** Approved annual budget of the active fiscal year, kept apart from the next year's proposals (not approved yet). */
export function AnnualBudgetOverview({
  formatCurrency,
  onSelectTab
}: {
  formatCurrency: (value: number) => string
  onSelectTab: (tab: FinanceTabKey) => void
}) {
  const { t } = useTranslation('dashboard')
  const { proposals } = useAnnualBudgetState()

  const base = annualBudgets2026.reduce((sum, budget) => sum + budget.base, 0)
  const buffer = annualBudgets2026.reduce((sum, budget) => sum + budget.buffer, 0)
  const approved = annualBudgets2026.reduce((sum, budget) => sum + annualTotal(budget), 0)
  const used = annualBudgets2026.reduce((sum, budget) => sum + usedThisYear(budget.costCenter), 0)
  const committed = unpaidCommitments.reduce((sum, item) => sum + item.amount, 0)

  const planned = proposals.filter((proposal) => proposal.year === planningFiscalYear)
  const proposedTotal = planned.reduce((sum, proposal) => sum + proposalTotals(proposal).total, 0)
  const stageCounts = planned.reduce<Partial<Record<ProposalStage, number>>>(
    (counts, proposal) => ({ ...counts, [proposal.stage]: (counts[proposal.stage] ?? 0) + 1 }),
    {}
  )

  const figures = [
    { label: t('budgetPlan.existing.overview.base'), value: formatCurrency(base) },
    { label: t('budgetPlan.existing.overview.buffer'), value: formatCurrency(buffer) },
    {
      hint: t('budgetPlan.existing.overview.committedHint'),
      label: t('budgetPlan.existing.overview.committed'),
      value: formatCurrency(committed)
    },
    { label: t('budgetPlan.existing.overview.used'), value: formatCurrency(used) }
  ]

  return (
    <Panel>
      <section
        aria-label={t('budgetPlan.existing.overview.region')}
        className='grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]'
      >
        <div>
          <PanelTitle
            action={<Pill tone='success'>{t('budgetPlan.existing.overview.approvedBadge')}</Pill>}
            hint={t('budgetPlan.existing.overview.hint')}
            title={t('budgetPlan.existing.overview.title', { year: activeFiscalYear })}
          />
          <dl className='mt-4 grid gap-3 sm:grid-cols-3'>
            <div className='rounded-xl border border-primary/25 bg-primary-soft/40 p-3 sm:col-span-3'>
              <dt className='text-xs font-semibold text-muted-foreground'>
                {t('budgetPlan.existing.overview.approved')}
              </dt>
              <dd className='mt-1 text-2xl font-extrabold tracking-tight text-foreground'>
                {formatCurrency(approved)}
              </dd>
            </div>
            {figures.map((figure) => (
              <div className='rounded-xl border border-border p-3' key={figure.label}>
                <dt className='text-xs font-semibold text-muted-foreground'>{figure.label}</dt>
                <dd className='mt-1 text-sm font-bold text-foreground'>{figure.value}</dd>
                {figure.hint && <dd className='text-[0.7rem] text-muted-foreground'>{figure.hint}</dd>}
              </div>
            ))}
            <div className='rounded-xl border border-border p-3'>
              <dt className='text-xs font-semibold text-muted-foreground'>
                {t('budgetPlan.existing.overview.remaining')}
              </dt>
              <dd className='mt-1 text-sm'>
                <RemainingValue formatCurrency={formatCurrency} remaining={approved - used - committed} />
              </dd>
            </div>
          </dl>
          <p className='mt-3 text-[0.7rem] text-muted-foreground'>{t('budgetPlan.existing.overview.formula')}</p>
        </div>

        <div
          aria-label={t('budgetPlan.existing.overview.proposedTitle')}
          className='rounded-xl border border-dashed border-warning/50 bg-warning/5 p-4'
          role='group'
        >
          <div className='flex flex-wrap items-start justify-between gap-2'>
            <h3 className='text-sm font-bold text-foreground'>{t('budgetPlan.existing.overview.proposedTitle')}</h3>
            <Pill tone='warning'>{t('budgetPlan.existing.overview.proposedBadge')}</Pill>
          </div>
          <p className='mt-0.5 text-xs text-muted-foreground'>
            {t('budgetPlan.existing.overview.proposedHint', { year: planningFiscalYear })}
          </p>
          <p className='mt-3 text-xs font-semibold text-muted-foreground'>
            {t('budgetPlan.existing.overview.proposedTotal')}
          </p>
          <p className='text-xl font-extrabold tracking-tight text-foreground'>{formatCurrency(proposedTotal)}</p>
          <p className='mt-3 text-xs font-semibold text-muted-foreground'>
            {t('budgetPlan.existing.overview.proposalCount')}
          </p>
          <ul className='mt-1.5 flex flex-wrap gap-2'>
            {(Object.entries(stageCounts) as [ProposalStage, number][]).map(([stage, count]) => (
              <li className='flex items-center gap-1 text-xs font-bold text-foreground' key={stage}>
                <ProposalStagePill stage={stage} />
                {count}
              </li>
            ))}
          </ul>
          <button
            className='mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline'
            onClick={() => onSelectTab('department-summary')}
            type='button'
          >
            {t('budgetPlan.existing.overview.openSummary')}
            <ArrowRight aria-hidden='true' className='size-3.5' />
          </button>
        </div>
      </section>
    </Panel>
  )
}
