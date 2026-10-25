import { ChevronRight, FileInput, MessageSquareWarning, Wallet } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { financeDepartmentName } from '../../finance-demo-labels'

import { PageHeader, Panel, StatTile, useDashboardFormat } from '../../../dashboard-ui'
import {
  planningFiscalYear,
  proposalBudgetStatus,
  proposalTotals,
  type AnnualProposal,
  type ProposalStage
} from '../../annual-budget-data'
import { useAnnualBudgetState } from '../../annual-budget-store'
import type { FinanceTabKey } from '../../finance-nav'
import { BudgetStatusPill, ProposalStagePill } from '../components/budget-plan-parts'
import { FinanceAnnualProposalDetail } from '../components/finance-annual-proposal-detail'
import {
  FinanceAnnualProposalsFilters,
  defaultAnnualProposalFilters,
  matchesAnnualProposalFilters,
  type AnnualProposalFilters
} from '../components/finance-annual-proposals-filters'

/**
 * FIN-40: annual budget proposals that Managers submitted for the planning fiscal year. The list opens
 * first; choosing a proposal opens its detail screen (`id` search param).
 */
export function FinanceAnnualProposalsView({
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
  const [filters, setFilters] = useState<AnnualProposalFilters>(defaultAnnualProposalFilters)
  const yearProposals = proposals.filter((proposal) => proposal.year === planningFiscalYear)
  const selected = proposals.find((proposal) => proposal.id === proposalId)

  if (selected) {
    return (
      <FinanceAnnualProposalDetail
        formatCurrency={formatCurrency}
        key={selected.id}
        onBack={() => onSelectTab('annual-proposals')}
        onOpenNegotiation={() => onSelectTab('budget-negotiation', { id: selected.id })}
        proposal={selected}
      />
    )
  }

  const count = (value: ProposalStage) => yearProposals.filter((proposal) => proposal.stage === value).length
  const requested = yearProposals.reduce((sum, proposal) => sum + proposalTotals(proposal).requested, 0)
  const visible = proposals.filter((proposal) => matchesAnnualProposalFilters(proposal, filters))

  return (
    <div className='space-y-6'>
      <PageHeader
        subtitle={t('budgetPlan.proposals.subtitle')}
        title={t('budgetPlan.proposals.title', { year: planningFiscalYear })}
      />

      <section aria-label={t('budgetPlan.proposals.summaryLabel')} className='grid gap-4 sm:grid-cols-3'>
        <StatTile
          hint={t('budgetPlan.proposals.waitingHint')}
          icon={FileInput}
          label={t('budgetPlan.proposals.waiting')}
          tone='info'
          value={String(count('SUBMITTED'))}
        />
        <StatTile
          hint={t('budgetPlan.proposals.requestedTotalHint', { count: yearProposals.length, year: planningFiscalYear })}
          icon={Wallet}
          label={t('budgetPlan.proposals.requestedTotal')}
          value={formatCurrency(requested)}
        />
        <StatTile
          hint={t('budgetPlan.proposals.needsInfoHint')}
          icon={MessageSquareWarning}
          label={t('budgetPlan.proposals.needsInfo')}
          tone='warning'
          value={String(count('NEEDS_INFO'))}
        />
      </section>

      <FinanceAnnualProposalsFilters applied={filters} onApply={setFilters} proposals={proposals} />

      <Panel>
        <ProposalTable
          formatCurrency={formatCurrency}
          onOpen={(id) => onSelectTab('annual-proposals', { id })}
          proposals={visible}
        />
      </Panel>
    </div>
  )
}

function ProposalTable({
  formatCurrency,
  onOpen,
  proposals
}: {
  formatCurrency: (value: number) => string
  onOpen: (id: string) => void
  proposals: AnnualProposal[]
}) {
  const { t } = useTranslation('dashboard')
  const { formatDate } = useDashboardFormat()

  return (
    <div className='overflow-x-auto'>
      <table className='w-full min-w-200 text-left text-xs'>
        <thead>
          <tr className='border-b border-border text-muted-foreground'>
            <th className='py-2.5 font-semibold'>{t('budgetPlan.proposals.colDepartment')}</th>
            <th className='py-2.5 font-semibold'>{t('budgetPlan.proposals.colManager')}</th>
            <th className='py-2.5 font-semibold'>{t('budgetPlan.proposals.colSubmitted')}</th>
            <th className='py-2.5 text-right font-semibold'>{t('budgetPlan.proposals.colLines')}</th>
            <th className='py-2.5 text-right font-semibold'>{t('budgetPlan.proposals.colRequested')}</th>
            <th className='py-2.5 pl-6 font-semibold'>{t('budgetPlan.proposals.colStage')}</th>
            <th className='py-2.5 font-semibold'>{t('budgetPlan.proposals.colStatus')}</th>
            <th className='py-2.5'>
              <span className='sr-only'>{t('budgetPlan.proposals.openDetail')}</span>
            </th>
          </tr>
        </thead>
        <tbody className='divide-y divide-border'>
          {proposals.map((proposal) => (
            <tr
              className='cursor-pointer transition hover:bg-surface-subtle/60'
              key={proposal.id}
              onClick={() => onOpen(proposal.id)}
            >
              <td className='py-3'>
                <p className='font-semibold text-foreground'>
                  {financeDepartmentName(proposal.costCenter, proposal.department)}
                </p>
                <p className='mt-0.5 font-mono text-muted-foreground'>{proposal.costCenter}</p>
              </td>
              <td className='py-3'>{proposal.manager}</td>
              <td className='py-3'>{formatDate(proposal.submittedAt)}</td>
              <td className='py-3 text-right'>{proposal.lines.length}</td>
              <td className='py-3 text-right font-bold'>{formatCurrency(proposalTotals(proposal).requested)}</td>
              <td className='py-3 pl-6'>
                <ProposalStagePill stage={proposal.stage} />
              </td>
              <td className='py-3'>
                <BudgetStatusPill status={proposalBudgetStatus(proposal.stage)} />
              </td>
              <td className='py-3 text-right'>
                <button
                  aria-label={t('budgetPlan.proposals.openDetailFor', {
                    department: financeDepartmentName(proposal.costCenter, proposal.department)
                  })}
                  className='inline-flex items-center gap-1 font-bold text-primary hover:underline'
                  onClick={(event) => {
                    event.stopPropagation()
                    onOpen(proposal.id)
                  }}
                  type='button'
                >
                  {t('budgetPlan.proposals.openDetail')}
                  <ChevronRight aria-hidden='true' className='size-3.5' />
                </button>
              </td>
            </tr>
          ))}
          {proposals.length === 0 && (
            <tr>
              <td className='py-8 text-center text-muted-foreground' colSpan={8}>
                {t('budgetPlan.proposals.empty')}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
