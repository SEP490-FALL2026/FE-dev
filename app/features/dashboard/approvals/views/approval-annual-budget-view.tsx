import { ArrowRight, CheckCircle2, Clock, Landmark } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { PageHeader, Panel, StatTile, useDashboardFormat } from '../../dashboard-ui'
import { planningFiscalYear, proposalTotals, type ProposalStage } from '../../finance/annual-budget-data'
import { useAnnualBudgetState } from '../../finance/annual-budget-store'
import { ProposalStagePill } from '../../finance/views/budget-plan-parts'
import type { ApprovalTabKey } from '../approvals-nav'
import { ApprovalAnnualBudgetDetail } from './approval-annual-budget-detail'
import {
  ApprovalAnnualBudgetFilters,
  decisionStages,
  defaultAnnualBudgetFilters,
  matchesAnnualBudgetFilters,
  type AnnualBudgetFilters,
  type DecisionStage
} from './approval-annual-budget-filters'

const isDecisionStage = (stage: ProposalStage): stage is DecisionStage =>
  (decisionStages as ProposalStage[]).includes(stage)

/**
 * APV-05: department budgets Finance sent for the planning year. The list opens first; choosing one opens
 * its decision screen (`id` search param). Proposals still with Finance are not shown.
 */
export function ApprovalAnnualBudgetView({
  formatCurrency,
  itemId,
  onSelectTab
}: {
  formatCurrency: (value: number) => string
  itemId?: string
  onSelectTab: (tab: ApprovalTabKey, params?: Record<string, string>) => void
}) {
  const { t } = useTranslation('dashboard')
  const { formatDate } = useDashboardFormat()
  const items = useAnnualBudgetState().proposals.filter((proposal) => isDecisionStage(proposal.stage))
  const [filters, setFilters] = useState<AnnualBudgetFilters>(defaultAnnualBudgetFilters)
  const selected = items.find((proposal) => proposal.id === itemId)

  if (selected) {
    return (
      <ApprovalAnnualBudgetDetail
        formatCurrency={formatCurrency}
        key={selected.id}
        onBack={() => onSelectTab('annual-budget')}
        proposal={selected}
      />
    )
  }

  const totalOf = (stage: DecisionStage) =>
    items.filter((item) => item.stage === stage).reduce((sum, item) => sum + proposalTotals(item).total, 0)
  const visible = items.filter((item) => matchesAnnualBudgetFilters(item, filters))
  const head = 'py-2.5 pr-3 font-semibold'

  return (
    <div className='space-y-6'>
      <PageHeader
        subtitle={t('budgetPlan.approver.subtitle', { year: planningFiscalYear })}
        title={t('budgetPlan.approver.title')}
      />

      <section aria-label={t('budgetPlan.approver.summaryLabel')} className='grid gap-4 sm:grid-cols-3'>
        <StatTile
          icon={Clock}
          label={t('budgetPlan.approver.pending')}
          tone='primary'
          value={String(items.filter((item) => item.stage === 'SENT').length)}
        />
        <StatTile
          icon={Landmark}
          label={t('budgetPlan.approver.pendingTotal')}
          tone='warning'
          value={formatCurrency(totalOf('SENT'))}
        />
        <StatTile
          icon={CheckCircle2}
          label={t('budgetPlan.approver.approvedTotal')}
          tone='success'
          value={formatCurrency(totalOf('APPROVED'))}
        />
      </section>

      <ApprovalAnnualBudgetFilters applied={filters} onApply={setFilters} proposals={items} />

      <Panel>
        {visible.length === 0 ? (
          <p className='py-6 text-center text-xs text-muted-foreground'>
            {t('budgetPlan.filtersApproverDecisions.annual.empty')}
          </p>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full min-w-200 text-left text-xs'>
              <thead>
                <tr className='border-b border-border text-muted-foreground'>
                  <th className={head}>{t('budgetPlan.approver.colDepartment')}</th>
                  <th className={head}>{t('budgetPlan.approver.colVersion')}</th>
                  <th className={`${head} text-right`}>{t('budgetPlan.approver.colFinanceTotal')}</th>
                  <th className={`${head} text-right`}>{t('budgetPlan.approver.colRequested')}</th>
                  <th className={`${head} text-right`}>{t('budgetPlan.approver.colBuffer')}</th>
                  <th className={head}>{t('budgetPlan.approver.colSentAt')}</th>
                  <th className={head}>{t('budgetPlan.approver.colStage')}</th>
                  <th className='py-2.5'>
                    <span className='sr-only'>{t('budgetPlan.approver.openDetail')}</span>
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border'>
                {visible.map((proposal) => {
                  const totals = proposalTotals(proposal)
                  const open = () => onSelectTab('annual-budget', { id: proposal.id })

                  return (
                    <tr
                      className='cursor-pointer transition hover:bg-surface-subtle/60'
                      key={proposal.id}
                      onClick={open}
                    >
                      <td className='py-3 pr-3'>
                        <p className='font-semibold text-foreground'>{proposal.department}</p>
                        <p className='mt-0.5 font-mono text-[0.7rem] text-muted-foreground'>{proposal.costCenter}</p>
                      </td>
                      <td className='py-3 pr-3 font-mono font-semibold'>
                        {t('budgetPlan.approver.version', { version: proposal.version })}
                      </td>
                      <td className='py-3 pr-3 text-right font-bold text-foreground'>{formatCurrency(totals.total)}</td>
                      <td className='py-3 pr-3 text-right text-muted-foreground'>{formatCurrency(totals.requested)}</td>
                      <td className='py-3 pr-3 text-right'>{formatCurrency(totals.buffer)}</td>
                      <td className='py-3 pr-3'>{proposal.sentAt ? formatDate(proposal.sentAt) : null}</td>
                      <td className='py-3 pr-3'>
                        <ProposalStagePill stage={proposal.stage} />
                      </td>
                      <td className='py-3 text-right'>
                        <button
                          aria-label={t('budgetPlan.approver.openDetailFor', { department: proposal.department })}
                          className='inline-flex items-center gap-1 font-bold text-primary hover:underline'
                          onClick={(event) => {
                            event.stopPropagation()
                            open()
                          }}
                          type='button'
                        >
                          {t('budgetPlan.approver.openDetail')}
                          <ArrowRight aria-hidden='true' className='size-3' />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  )
}
