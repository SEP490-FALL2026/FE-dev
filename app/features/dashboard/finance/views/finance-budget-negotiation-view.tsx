import { ChevronRight, Handshake, Scale, Wallet } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { PageHeader, Panel, StatTile } from '../../dashboard-ui'
import { planningFiscalYear, proposalTotals, type AnnualProposal, type ProposalStage } from '../annual-budget-data'
import { useAnnualBudgetState } from '../annual-budget-store'
import type { FinanceTabKey } from '../finance-nav'
import { ProposalStagePill } from './budget-plan-parts'
import { FinanceBudgetNegotiationDetail } from './finance-budget-negotiation-detail'
import {
  FinanceBudgetNegotiationFilters,
  defaultNegotiationFilters,
  matchesNegotiationFilters,
  type NegotiationFilters
} from './finance-budget-negotiation-filters'

/** Stages Finance analyses (editable) or has analysed (read-only). */
const stages: readonly ProposalStage[] = ['IN_ANALYSIS', 'RETURNED', 'NEGOTIATED', 'SENT', 'APPROVED']

/**
 * FIN-41: proposals in analysis. Finance compares the Manager request with its own figures; choosing a
 * proposal opens the line-by-line negotiation screen (`id` search param).
 */
export function FinanceBudgetNegotiationView({
  formatCurrency,
  onSelectTab,
  proposalId
}: {
  formatCurrency: (value: number) => string
  onSelectTab: (tab: FinanceTabKey, extraParams?: Record<string, string>) => void
  proposalId?: string
}) {
  const { t } = useTranslation('dashboard')
  const { proposals } = useAnnualBudgetState()
  const [filters, setFilters] = useState<NegotiationFilters>(defaultNegotiationFilters)
  const analysed = proposals.filter(
    (proposal) => proposal.year === planningFiscalYear && stages.includes(proposal.stage)
  )
  const selected = analysed.find((proposal) => proposal.id === proposalId)

  if (selected) {
    return (
      <FinanceBudgetNegotiationDetail
        formatCurrency={formatCurrency}
        key={selected.id}
        onBack={() => onSelectTab('budget-negotiation')}
        onOpenSummary={() => onSelectTab('department-summary')}
        proposal={selected}
      />
    )
  }

  const count = (value: ProposalStage) => analysed.filter((proposal) => proposal.stage === value).length
  const requested = analysed.reduce((sum, proposal) => sum + proposalTotals(proposal).requested, 0)
  const financeTotal = analysed.reduce((sum, proposal) => sum + proposalTotals(proposal).total, 0)
  const visible = analysed.filter((proposal) => matchesNegotiationFilters(proposal, filters))

  return (
    <div className='space-y-6'>
      <PageHeader
        subtitle={t('budgetPlan.negotiation.subtitle')}
        title={t('budgetPlan.negotiation.title', { year: planningFiscalYear })}
      />

      <section aria-label={t('budgetPlan.negotiation.summaryLabel')} className='grid gap-4 sm:grid-cols-3'>
        <StatTile
          hint={t('budgetPlan.negotiation.inAnalysisHint')}
          icon={Handshake}
          label={t('budgetPlan.negotiation.inAnalysis')}
          tone='info'
          value={String(count('IN_ANALYSIS') + count('RETURNED'))}
        />
        <StatTile icon={Wallet} label={t('budgetPlan.negotiation.requestedTotal')} value={formatCurrency(requested)} />
        <StatTile
          hint={t('budgetPlan.negotiation.savingHint', { amount: formatCurrency(financeTotal - requested) })}
          icon={Scale}
          label={t('budgetPlan.negotiation.financeTotal')}
          tone='success'
          value={formatCurrency(financeTotal)}
        />
      </section>

      <FinanceBudgetNegotiationFilters applied={filters} onApply={setFilters} proposals={analysed} stages={stages} />

      <Panel>
        <NegotiationTable
          formatCurrency={formatCurrency}
          onOpen={(id) => onSelectTab('budget-negotiation', { id })}
          proposals={visible}
        />
      </Panel>
    </div>
  )
}

function NegotiationTable({
  formatCurrency,
  onOpen,
  proposals
}: {
  formatCurrency: (value: number) => string
  onOpen: (id: string) => void
  proposals: AnnualProposal[]
}) {
  const { t } = useTranslation('dashboard')

  return (
    <div className='overflow-x-auto'>
      <table className='w-full min-w-176 text-left text-xs'>
        <thead>
          <tr className='border-b border-border text-muted-foreground'>
            <th className='py-2.5 font-semibold'>{t('budgetPlan.negotiation.colDepartment')}</th>
            <th className='py-2.5 text-right font-semibold'>{t('budgetPlan.negotiation.colRequested')}</th>
            <th className='py-2.5 text-right font-semibold'>{t('budgetPlan.negotiation.colFinance')}</th>
            <th className='py-2.5 text-right font-semibold'>{t('budgetPlan.negotiation.colDifference')}</th>
            <th className='py-2.5 pl-6 font-semibold'>{t('budgetPlan.negotiation.colStage')}</th>
            <th className='py-2.5'>
              <span className='sr-only'>{t('budgetPlan.negotiation.openDetail')}</span>
            </th>
          </tr>
        </thead>
        <tbody className='divide-y divide-border'>
          {proposals.map((proposal) => {
            const totals = proposalTotals(proposal)
            const difference = totals.total - totals.requested

            return (
              <tr
                className='cursor-pointer transition hover:bg-surface-subtle/60'
                key={proposal.id}
                onClick={() => onOpen(proposal.id)}
              >
                <td className='py-3'>
                  <p className='font-semibold text-foreground'>{proposal.department}</p>
                  <p className='mt-0.5 font-mono text-muted-foreground'>{proposal.costCenter}</p>
                </td>
                <td className='py-3 text-right'>{formatCurrency(totals.requested)}</td>
                <td className='py-3 text-right font-bold'>{formatCurrency(totals.total)}</td>
                <td className={`py-3 text-right font-semibold ${difference < 0 ? 'text-success' : 'text-warning'}`}>
                  {formatCurrency(difference)}
                </td>
                <td className='py-3 pl-6'>
                  <ProposalStagePill stage={proposal.stage} />
                </td>
                <td className='py-3 text-right'>
                  <button
                    aria-label={t('budgetPlan.negotiation.openDetailFor', { department: proposal.department })}
                    className='inline-flex items-center gap-1 font-bold text-primary hover:underline'
                    onClick={(event) => {
                      event.stopPropagation()
                      onOpen(proposal.id)
                    }}
                    type='button'
                  >
                    {t('budgetPlan.negotiation.openDetail')}
                    <ChevronRight aria-hidden='true' className='size-3.5' />
                  </button>
                </td>
              </tr>
            )
          })}
          {proposals.length === 0 && (
            <tr>
              <td className='py-8 text-center text-muted-foreground' colSpan={6}>
                {t('budgetPlan.negotiation.empty')}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
