import { CheckCircle2, ChevronRight, Clock, Landmark, Send, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Notice,
  PageHeader,
  Panel,
  PanelTitle,
  StatTile,
  primaryButtonClassName,
  useDashboardFormat
} from '../../dashboard-ui'
import {
  activeFiscalYear,
  annualBudgets2026,
  annualTotal,
  budgetApprover,
  planningFiscalYear,
  proposalTotals
} from '../annual-budget-data'
import { sendProposalsToApprover, useAnnualBudgetState } from '../annual-budget-store'
import type { FinanceTabKey } from '../finance-nav'
import { ProposalStagePill } from './budget-plan-parts'
import { FinanceDepartmentSummaryDetail } from './finance-department-summary-detail'
import {
  FinanceDepartmentSummaryFilters,
  defaultDepartmentSummaryFilters,
  isDepartmentSummaryFiltered,
  matchesDepartmentSummaryFilters,
  type DepartmentSummaryFilters
} from './finance-department-summary-filters'

const previousTotal = (costCenter: string) => {
  const budget = annualBudgets2026.find((item) => item.costCenter === costCenter)
  return budget ? annualTotal(budget) : null
}

/**
 * FIN-42: a short list — one row per department with the total to approve, the gap to the Manager's request and
 * the stage. The full breakdown opens as a detail screen (`id` search param). Finance selects analysed departments
 * and sends them to the Spending Approver.
 */
export function FinanceDepartmentSummaryView({
  formatCurrency,
  onSelectTab,
  proposalId
}: {
  formatCurrency: (value: number) => string
  onSelectTab: (tab: FinanceTabKey, extraParams?: Record<string, string>) => void
  proposalId?: string
}) {
  const { t } = useTranslation('dashboard')
  const { formatPercent } = useDashboardFormat()
  const { proposals } = useAnnualBudgetState()
  const [selected, setSelected] = useState<string[]>([])
  const [sentCount, setSentCount] = useState<number | null>(null)
  const [filters, setFilters] = useState<DepartmentSummaryFilters>(defaultDepartmentSummaryFilters)

  const rows = proposals
    .filter((proposal) => proposal.year === planningFiscalYear)
    .map((proposal) => ({ previous: previousTotal(proposal.costCenter), proposal, totals: proposalTotals(proposal) }))
  const sum = (pick: (row: (typeof rows)[number]) => number) => rows.reduce((total, row) => total + pick(row), 0)
  const companyTotal = sum((row) => row.totals.total)
  const previousCompany = annualBudgets2026.reduce((total, budget) => total + annualTotal(budget), 0)
  const change = previousCompany > 0 ? (companyTotal - previousCompany) / previousCompany : 0
  const ready = rows.filter((row) => row.proposal.stage === 'NEGOTIATED')
  const pending = rows.filter((row) => row.proposal.stage === 'SENT')

  const filtered = isDepartmentSummaryFiltered(filters)
  const visible = rows.filter((row) => matchesDepartmentSummaryFilters(row.proposal, filters))
  const visibleSum = (pick: (row: (typeof rows)[number]) => number) =>
    visible.reduce((total, row) => total + pick(row), 0)
  const visibleTotal = visibleSum((row) => row.totals.total)
  // Only rows still on screen are sent, so a filter never sends a department the user cannot see.
  const sendable = selected.filter((id) => visible.some((row) => row.proposal.id === id))

  const toggle = (id: string) =>
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))

  const send = (ids: string[]) => {
    sendProposalsToApprover(ids)
    setSentCount(ids.length)
    setSelected((current) => current.filter((id) => !ids.includes(id)))
  }

  const opened = rows.find((row) => row.proposal.id === proposalId)
  if (opened) {
    return (
      <FinanceDepartmentSummaryDetail
        formatCurrency={formatCurrency}
        onBack={() => onSelectTab('department-summary')}
        onSelectTab={onSelectTab}
        onSend={() => send([opened.proposal.id])}
        proposal={opened.proposal}
      />
    )
  }

  const headClass = 'py-2.5 pr-3 text-right font-semibold'

  return (
    <div className='space-y-6'>
      <PageHeader
        subtitle={t('budgetPlan.summary.subtitle', { year: planningFiscalYear })}
        title={t('budgetPlan.summary.title')}
      />

      <section aria-label={t('budgetPlan.summary.summaryLabel')} className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <StatTile
          hint={t('budgetPlan.summary.companyTotalHint', { count: rows.length, year: planningFiscalYear })}
          icon={Landmark}
          label={t('budgetPlan.summary.companyTotal')}
          value={formatCurrency(companyTotal)}
        />
        <StatTile
          hint={t('budgetPlan.summary.vsPreviousHint', {
            amount: formatCurrency(previousCompany),
            year: activeFiscalYear
          })}
          icon={TrendingUp}
          label={t('budgetPlan.summary.vsPrevious', { year: activeFiscalYear })}
          tone={change > 0 ? 'warning' : 'success'}
          value={`${change > 0 ? '+' : ''}${formatPercent(change)}`}
        />
        <StatTile
          hint={t('budgetPlan.summary.readyHint')}
          icon={CheckCircle2}
          label={t('budgetPlan.summary.readyToSend')}
          tone='info'
          value={String(ready.length)}
        />
        <StatTile
          hint={t('budgetPlan.summary.pendingHint', { approver: budgetApprover })}
          icon={Clock}
          label={t('budgetPlan.summary.pending')}
          tone='warning'
          value={String(pending.length)}
        />
      </section>

      {sentCount !== null && (
        <Notice icon={CheckCircle2} tone='success'>
          {t('budgetPlan.summary.sentNotice', { approver: budgetApprover, count: sentCount })}
        </Notice>
      )}

      <FinanceDepartmentSummaryFilters applied={filters} onApply={setFilters} />

      <Panel>
        <PanelTitle
          action={
            <button
              className={primaryButtonClassName}
              disabled={sendable.length === 0}
              onClick={() => send(sendable)}
              type='button'
            >
              <Send aria-hidden='true' className='size-3.5' />
              {t('budgetPlan.summary.send')}
            </button>
          }
          hint={t('budgetPlan.summary.selectHint', { count: sendable.length })}
          title={t('budgetPlan.summary.tableTitle')}
        />
        <div className='mt-4 overflow-x-auto'>
          <table className='w-full min-w-160 text-left text-xs'>
            <thead>
              <tr className='border-b border-border text-muted-foreground'>
                <th className='w-8 py-2.5' />
                <th className='py-2.5 pr-3 font-semibold'>{t('budgetPlan.summary.colDepartment')}</th>
                <th className={headClass}>{t('budgetPlan.summary.colTotal')}</th>
                <th className={headClass}>{t('budgetPlan.summary.detail.colGap')}</th>
                <th className='py-2.5 pl-3 font-semibold'>{t('budgetPlan.summary.colStatus')}</th>
                <th className='py-2.5'>
                  <span className='sr-only'>{t('budgetPlan.summary.detail.open')}</span>
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {visible.map(({ proposal, totals }) => {
                const difference = totals.total - totals.requested
                const selectable = proposal.stage === 'NEGOTIATED'
                const open = () => onSelectTab('department-summary', { id: proposal.id })

                return (
                  <tr className='cursor-pointer transition hover:bg-surface-subtle/60' key={proposal.id} onClick={open}>
                    <td className='py-3' onClick={(event) => event.stopPropagation()}>
                      <input
                        aria-label={t('budgetPlan.summary.selectRow', { department: proposal.department })}
                        checked={selected.includes(proposal.id)}
                        className='size-4 accent-primary'
                        disabled={!selectable}
                        onChange={() => toggle(proposal.id)}
                        type='checkbox'
                      />
                    </td>
                    <td className='py-3 pr-3'>
                      <span className='font-semibold text-foreground'>{proposal.department}</span>
                      <span className='ml-2 font-mono text-[0.7rem] text-muted-foreground'>{proposal.costCenter}</span>
                    </td>
                    <td className='py-3 pr-3 text-right font-bold text-foreground'>{formatCurrency(totals.total)}</td>
                    <td
                      className={`py-3 pr-3 text-right font-semibold ${difference < 0 ? 'text-success' : 'text-warning'}`}
                    >
                      {difference > 0 ? '+' : ''}
                      {formatCurrency(difference)}
                    </td>
                    <td className='py-3 pl-3'>
                      <ProposalStagePill stage={proposal.stage} />
                    </td>
                    <td className='py-3 text-right'>
                      <button
                        aria-label={t('budgetPlan.summary.detail.openFor', { department: proposal.department })}
                        className='inline-flex items-center gap-1 font-bold text-primary hover:underline'
                        onClick={(event) => {
                          event.stopPropagation()
                          open()
                        }}
                        type='button'
                      >
                        {t('budgetPlan.summary.detail.open')}
                        <ChevronRight aria-hidden='true' className='size-3.5' />
                      </button>
                    </td>
                  </tr>
                )
              })}
              {visible.length === 0 && (
                <tr>
                  <td className='py-8 text-center text-muted-foreground' colSpan={6}>
                    {t('budgetPlan.filtersPlanning.summary.empty')}
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className='border-t-2 border-border font-bold text-foreground'>
                <td />
                <td className='py-3 pr-3'>
                  {filtered
                    ? t('budgetPlan.filtersPlanning.summary.footerVisible')
                    : t('budgetPlan.summary.footerTotal')}
                </td>
                <td className='py-3 pr-3 text-right'>{formatCurrency(visibleTotal)}</td>
                <td className='py-3 pr-3 text-right'>
                  {formatCurrency(visibleTotal - visibleSum((row) => row.totals.requested))}
                </td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      </Panel>
    </div>
  )
}
