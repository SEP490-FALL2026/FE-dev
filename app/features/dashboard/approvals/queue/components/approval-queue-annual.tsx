import { ChevronRight, Info } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Notice, Panel, PanelTitle, useDashboardFormat } from '../../../dashboard-ui'
import { planningFiscalYear, proposalTotals, type AnnualProposal } from '../../../finance/annual-budget-data'
import type { ApprovalTabKey } from '../../approvals-nav'
import {
  ApprovalAnnualFiltersPanel,
  defaultApprovalAnnualFilters,
  matchesApprovalAnnualFilters
} from './approval-queue-filters'

interface ApprovalQueueAnnualProps {
  formatCurrency: (value: number) => string
  onSelectTab: (tab: ApprovalTabKey, params?: Record<string, string>) => void
  /** Department budgets in stage SENT. */
  proposals: AnnualProposal[]
}

/** APV-01 "Ngân sách năm": annual budget files kept apart from SaaS spend; each opens on APV-05. */
export function ApprovalQueueAnnual({ formatCurrency, onSelectTab, proposals }: ApprovalQueueAnnualProps) {
  const { t } = useTranslation('dashboard')
  const { formatDate } = useDashboardFormat()
  const [filters, setFilters] = useState(defaultApprovalAnnualFilters)
  const visible = proposals.filter((proposal) => matchesApprovalAnnualFilters(proposal, filters))

  return (
    <div className='space-y-6'>
      <ApprovalAnnualFiltersPanel applied={filters} onApply={setFilters} proposals={proposals} />
      <Panel>
        <PanelTitle
          hint={t('budgetPlan.approverSpend.annual.hint')}
          title={t('budgetPlan.approverSpend.annual.title', { year: planningFiscalYear })}
        />
        <div className='mt-3'>
          <Notice icon={Info} tone='info'>
            {t('budgetPlan.approverSpend.annual.note')}
          </Notice>
        </div>

        {proposals.length === 0 ? (
          <p className='mt-4 text-xs text-muted-foreground'>{t('budgetPlan.approverSpend.annual.empty')}</p>
        ) : visible.length === 0 ? (
          <p className='mt-4 text-xs text-muted-foreground'>{t('budgetPlan.filtersApproverQueue.annual.empty')}</p>
        ) : (
          <div className='mt-4 overflow-x-auto'>
            <table className='w-full min-w-160 text-left text-xs'>
              <thead>
                <tr className='border-b border-border text-muted-foreground'>
                  <th className='py-2.5 font-semibold'>{t('budgetPlan.approverSpend.annual.colDepartment')}</th>
                  <th className='py-2.5 font-semibold'>{t('budgetPlan.approverSpend.annual.colVersion')}</th>
                  <th className='py-2.5 text-right font-semibold'>{t('budgetPlan.approverSpend.annual.colFinance')}</th>
                  <th className='py-2.5 text-right font-semibold'>
                    {t('budgetPlan.approverSpend.annual.colRequested')}
                  </th>
                  <th className='py-2.5 pl-6 font-semibold'>{t('budgetPlan.approverSpend.annual.colSentAt')}</th>
                  <th className='py-2.5' />
                </tr>
              </thead>
              <tbody className='divide-y divide-border'>
                {visible.map((proposal) => {
                  const totals = proposalTotals(proposal)

                  return (
                    <tr key={proposal.id}>
                      <td className='py-3'>
                        <p className='font-bold text-foreground'>{proposal.department}</p>
                        <p className='font-mono text-[0.7rem] text-muted-foreground'>{proposal.costCenter}</p>
                      </td>
                      <td className='py-3'>
                        {t('budgetPlan.approverSpend.annual.version', { version: proposal.version })}
                      </td>
                      <td className='py-3 text-right font-bold'>{formatCurrency(totals.total)}</td>
                      <td className='py-3 text-right text-muted-foreground'>{formatCurrency(totals.requested)}</td>
                      <td className='py-3 pl-6'>{proposal.sentAt ? formatDate(proposal.sentAt) : '—'}</td>
                      <td className='py-3 text-right'>
                        <button
                          aria-label={t('budgetPlan.approverSpend.annual.openItem', {
                            department: proposal.department
                          })}
                          className='inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 font-bold text-primary transition hover:border-primary'
                          onClick={() => onSelectTab('annual-budget', { id: proposal.id })}
                          type='button'
                        >
                          {t('budgetPlan.approverSpend.annual.open')}
                          <ChevronRight aria-hidden='true' className='size-3.5' />
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
