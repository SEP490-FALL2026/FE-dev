import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Send, XCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { financeDepartmentName } from '../../finance-demo-labels'

import {
  InfoRow,
  Notice,
  PageHeader,
  Panel,
  PanelTitle,
  primaryButtonClassName,
  secondaryButtonClassName,
  useDashboardFormat
} from '../../../dashboard-ui'
import {
  activeFiscalYear,
  annualBudgets2026,
  annualTotal,
  budgetApprover,
  proposalBudgetStatus,
  proposalTotals,
  type AnnualProposal,
  type ProposalStage
} from '../../annual-budget-data'
import type { FinanceTabKey } from '../../finance-nav'
import { BudgetStatusPill, ProposalStagePill } from './budget-plan-parts'

/** Stages where Finance has not finished the analysis yet, so the detail links back to FIN-41. */
export const unfinishedStages: readonly ProposalStage[] = ['SUBMITTED', 'NEEDS_INFO', 'IN_ANALYSIS', 'RETURNED']

/** FIN-42 detail: the full budget breakdown of one department, kept off the summary list to keep it readable. */
export function FinanceDepartmentSummaryDetail({
  formatCurrency,
  onBack,
  onSelectTab,
  onSend,
  proposal
}: {
  formatCurrency: (value: number) => string
  onBack: () => void
  onSelectTab: (tab: FinanceTabKey, extraParams?: Record<string, string>) => void
  onSend: () => void
  proposal: AnnualProposal
}) {
  const { t } = useTranslation('dashboard')
  const { formatPercent } = useDashboardFormat()
  const totals = proposalTotals(proposal)
  const difference = totals.total - totals.requested
  const previousBudget = annualBudgets2026.find((item) => item.costCenter === proposal.costCenter)
  const previous = previousBudget ? annualTotal(previousBudget) : null

  return (
    <div className='space-y-6'>
      <button
        className='inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground transition hover:text-foreground'
        onClick={onBack}
        type='button'
      >
        <ArrowLeft aria-hidden='true' className='size-4' />
        {t('budgetPlan.backToList')}
      </button>

      <PageHeader
        actions={
          <span className='flex flex-wrap gap-1.5'>
            <ProposalStagePill stage={proposal.stage} />
            <BudgetStatusPill status={proposalBudgetStatus(proposal.stage)} />
          </span>
        }
        subtitle={`${proposal.costCenter} · ${proposal.manager} · ${t('budgetPlan.fiscalYear', { year: proposal.year })}`}
        title={financeDepartmentName(proposal.costCenter, proposal.department)}
      />

      <div className='grid gap-6 lg:grid-cols-2'>
        <Panel>
          <PanelTitle hint={t('budgetPlan.summary.tableHint')} title={t('budgetPlan.summary.detail.breakdownTitle')} />
          <div className='mt-3 divide-y divide-border'>
            <InfoRow label={t('budgetPlan.summary.colSaas')} value={formatCurrency(totals.base)} />
            <InfoRow
              label={t('budgetPlan.summary.detail.bufferRate', { rate: formatPercent(proposal.financeBufferRate) })}
              value={formatCurrency(totals.buffer)}
            />
            <InfoRow label={t('budgetPlan.summary.colOther')} value={formatCurrency(totals.other)} />
            <InfoRow
              label={t('budgetPlan.summary.colTotal')}
              value={<span className='text-sm font-extrabold'>{formatCurrency(totals.total)}</span>}
            />
          </div>
        </Panel>

        <Panel>
          <PanelTitle title={t('budgetPlan.summary.detail.compareTitle')} />
          <div className='mt-3 divide-y divide-border'>
            <InfoRow label={t('budgetPlan.summary.colRequested')} value={formatCurrency(totals.requested)} />
            <InfoRow
              label={t('budgetPlan.summary.colDifference')}
              value={
                <span className={difference < 0 ? 'text-success' : 'text-warning'}>{formatCurrency(difference)}</span>
              }
            />
            <InfoRow
              label={t('budgetPlan.summary.colPrevious', { year: activeFiscalYear })}
              value={previous === null ? t('budgetPlan.summary.noPrevious') : formatCurrency(previous)}
            />
            {previous !== null && (
              <InfoRow
                label={t('budgetPlan.summary.vsPrevious', { year: activeFiscalYear })}
                value={`${totals.total >= previous ? '+' : ''}${formatPercent((totals.total - previous) / previous)}`}
              />
            )}
          </div>
        </Panel>
      </div>

      <Panel>
        <PanelTitle title={t('budgetPlan.summary.detail.nextTitle')} />
        <div className='mt-3 flex flex-wrap items-center gap-3 text-xs'>
          {proposal.stage === 'NEGOTIATED' && (
            <button className={primaryButtonClassName} onClick={onSend} type='button'>
              <Send aria-hidden='true' className='size-3.5' />
              {t('budgetPlan.summary.detail.sendOne')}
            </button>
          )}
          {unfinishedStages.includes(proposal.stage) && (
            <button
              aria-label={t('budgetPlan.summary.openNegotiationFor', {
                department: financeDepartmentName(proposal.costCenter, proposal.department)
              })}
              className={secondaryButtonClassName}
              onClick={() => onSelectTab('budget-negotiation', { id: proposal.id })}
              type='button'
            >
              {t('budgetPlan.summary.openNegotiation')}
              <ArrowRight aria-hidden='true' className='size-3.5' />
            </button>
          )}
          {proposal.stage === 'SENT' && (
            <Notice icon={Clock} tone='warning'>
              {t('budgetPlan.summary.detail.waiting', { approver: budgetApprover })}
            </Notice>
          )}
          {proposal.stage === 'APPROVED' && (
            <Notice icon={CheckCircle2} tone='success'>
              {t('budgetPlan.summary.detail.approved')}
            </Notice>
          )}
          {proposal.stage === 'REJECTED' && (
            <Notice icon={XCircle} tone='danger'>
              {t('budgetPlan.summary.detail.rejected', { reason: proposal.decision?.reason ?? '' })}
            </Notice>
          )}
        </div>
      </Panel>
    </div>
  )
}
