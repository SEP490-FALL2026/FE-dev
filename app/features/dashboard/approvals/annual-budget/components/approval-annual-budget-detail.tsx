import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { PageHeader, Pill } from '../../../dashboard-ui'
import type { AnnualProposal } from '../../../finance/annual-budget-data'
import { ProposalStagePill } from '../../../finance/annual-budget/components/budget-plan-parts'
import { ApprovalAnnualBudgetDecision } from './approval-annual-budget-decision'
import { ApprovalAnnualBudgetHistory } from './approval-annual-budget-history'
import { ApprovalAnnualBudgetLines, ApprovalAnnualBudgetTotals } from './approval-annual-budget-lines'

/**
 * APV-05 detail: the approver compares the Manager's request with Finance's analysis, base cost, buffer and the
 * department total, reads the change history, then approves, rejects or asks Finance to adjust.
 */
export function ApprovalAnnualBudgetDetail({
  formatCurrency,
  onBack,
  proposal
}: {
  formatCurrency: (value: number) => string
  onBack: () => void
  proposal: AnnualProposal
}) {
  const { t } = useTranslation('dashboard')

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
          <span className='flex flex-wrap gap-2'>
            <Pill tone='neutral'>{t('budgetPlan.approver.versionLabel', { version: proposal.version })}</Pill>
            <ProposalStagePill stage={proposal.stage} />
          </span>
        }
        subtitle={`${proposal.costCenter} · ${proposal.manager} · ${t('budgetPlan.fiscalYear', { year: proposal.year })}`}
        title={proposal.department}
      />

      <div className='grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]'>
        <div className='min-w-0 space-y-6'>
          <ApprovalAnnualBudgetLines formatCurrency={formatCurrency} proposal={proposal} />
          <ApprovalAnnualBudgetHistory formatCurrency={formatCurrency} proposal={proposal} />
        </div>

        <div className='space-y-6'>
          <ApprovalAnnualBudgetTotals formatCurrency={formatCurrency} proposal={proposal} />
          <ApprovalAnnualBudgetDecision proposal={proposal} />
        </div>
      </div>
    </div>
  )
}
