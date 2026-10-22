import { CalendarX2, CheckCircle2, Lock, Scale } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Notice, PageHeader, Panel, PanelTitle, Pill, secondaryButtonClassName } from '../../dashboard-ui'
import { activeFiscalYear, annualBudgets2026, annualTotal } from '../annual-budget-data'
import { requestBudgetAdjustment, useAnnualBudgetState } from '../annual-budget-store'
import type { FinanceTabKey } from '../finance-nav'
import { FinanceAllocationEditor, allocatedSum } from './finance-allocation-editor'
import {
  FinanceAllocationFilters,
  defaultAllocationFilters,
  type AllocationFilters,
  type AllocationState
} from './finance-allocation-filters'
import { FinanceBudgetAdjustmentDialog } from './finance-budget-adjustment-dialog'
import { FilterSelect } from './filter-select'

/**
 * FIN-45: the approved FY budget is locked per department; Finance only splits it into SaaS cost groups.
 * Changing an approved total goes through an adjustment request decided by the Spending Approver.
 */
export function FinanceBudgetAllocationView({
  formatCurrency
}: {
  formatCurrency: (value: number) => string
  onSelectTab: (tab: FinanceTabKey, extraParams?: Record<string, string>) => void
}) {
  const { t } = useTranslation('dashboard')
  const { allocations, periods } = useAnnualBudgetState()
  const [filters, setFilters] = useState<AllocationFilters>(defaultAllocationFilters)
  const [costCenter, setCostCenter] = useState(annualBudgets2026[0].costCenter)
  const [adjusting, setAdjusting] = useState(false)
  const [sent, setSent] = useState<{ after: number; before: number; costCenter: string } | null>(null)

  // Only the active year has department budgets approved for allocation; FY2026 budgets are all ACTIVE.
  const isActiveYear = filters.year === activeFiscalYear
  const filteredPeriod = periods.find((period) => period.year === filters.year)
  const allocationState = (costCenterCode: string, total: number): AllocationState => {
    const allocated = allocatedSum(allocations[costCenterCode])
    return allocated === 0 ? 'NONE' : allocated >= total ? 'FULL' : 'PARTIAL'
  }
  const rows = annualBudgets2026.filter(
    (budget) =>
      isActiveYear &&
      (filters.costCenter === '' || budget.costCenter === filters.costCenter) &&
      (filters.status === 'all' || budget.status === filters.status) &&
      (filters.allocation === 'all' || allocationState(budget.costCenter, annualTotal(budget)) === filters.allocation)
  )
  const editorCostCenter = filters.costCenter || costCenter
  const selected = annualBudgets2026.find((budget) => budget.costCenter === editorCostCenter) ?? annualBudgets2026[0]
  const approvedTotal = annualTotal(selected)
  const companyTotal = annualBudgets2026.reduce((sum, budget) => sum + annualTotal(budget), 0)

  return (
    <div className='space-y-6'>
      <PageHeader
        actions={
          <button className={secondaryButtonClassName} onClick={() => setAdjusting(true)} type='button'>
            <Scale aria-hidden='true' className='size-3.5' />
            {t('budgetPlan.allocation.requestAdjustment')}
          </button>
        }
        subtitle={t('budgetPlan.allocation.subtitle', { year: activeFiscalYear })}
        title={t('budgetPlan.allocation.title')}
      />

      {sent && (
        <Notice icon={CheckCircle2} tone='success'>
          {t('budgetPlan.allocation.adjustment.sent', {
            after: formatCurrency(sent.after),
            before: formatCurrency(sent.before),
            costCenter: sent.costCenter
          })}
        </Notice>
      )}

      <FinanceAllocationFilters applied={filters} onApply={setFilters} />

      {!isActiveYear && filteredPeriod && (
        <Notice icon={CalendarX2} tone='warning'>
          {t('budgetPlan.allocation.filters.notAllocatable', {
            status: t(`budgetPlan.status.${filteredPeriod.status}`),
            year: filters.year
          })}
        </Notice>
      )}

      {isActiveYear && (
        <Panel>
          <PanelTitle
            hint={t('budgetPlan.allocation.companyHint', { amount: formatCurrency(companyTotal) })}
            title={t('budgetPlan.allocation.companyTitle')}
          />
          <div className='mt-4 overflow-x-auto'>
            <table className='w-full min-w-184 text-left text-xs'>
              <thead>
                <tr className='border-b border-border text-muted-foreground'>
                  <th className='py-2 font-semibold'>{t('budget.costCenter')}</th>
                  <th className='py-2 text-right font-semibold'>{t('budgetPlan.allocation.colBase')}</th>
                  <th className='py-2 text-right font-semibold'>{t('budgetPlan.allocation.colBuffer')}</th>
                  <th className='py-2 text-right font-semibold'>{t('budgetPlan.allocation.colApproved')}</th>
                  <th className='py-2 text-right font-semibold'>{t('budgetPlan.allocation.colAllocated')}</th>
                  <th className='py-2 text-right font-semibold'>{t('budgetPlan.allocation.colUnallocated')}</th>
                  <th className='py-2 pl-6 font-semibold'>
                    <span className='sr-only'>{t('budgetPlan.allocation.lockedLabel')}</span>
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border'>
                {rows.map((budget) => {
                  const total = annualTotal(budget)
                  const unallocated = total - allocatedSum(allocations[budget.costCenter])
                  return (
                    <tr
                      className={budget.costCenter === editorCostCenter ? 'bg-primary-soft/40' : ''}
                      key={budget.costCenter}
                    >
                      <td className='py-2'>
                        <p className='font-mono font-bold text-primary'>{budget.costCenter}</p>
                        <p className='mt-0.5 font-semibold text-foreground'>{budget.department}</p>
                      </td>
                      <td className='py-2 text-right'>{formatCurrency(budget.base)}</td>
                      <td className='py-2 text-right'>{formatCurrency(budget.buffer)}</td>
                      <td className='py-2 text-right font-bold'>{formatCurrency(total)}</td>
                      <td className='py-2 text-right'>{formatCurrency(total - unallocated)}</td>
                      <td className={`py-3 text-right font-semibold ${unallocated > 0 ? 'text-warning' : ''}`}>
                        {unallocated > 0 ? formatCurrency(unallocated) : '—'}
                      </td>
                      <td className='py-2 pl-6' title={t('budgetPlan.allocation.lockedLabel')}>
                        <Pill tone='neutral'>
                          <Lock aria-hidden='true' className='size-3' />
                          {t('budgetPlan.allocation.locked')}
                        </Pill>
                      </td>
                    </tr>
                  )
                })}
                {rows.length === 0 && (
                  <tr>
                    <td className='py-8 text-center text-muted-foreground' colSpan={7}>
                      {t('budgetPlan.allocation.filters.empty')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {isActiveYear && (
        <Panel>
          {filters.costCenter === '' && (
            <FilterSelect
              label={t('budgetPlan.allocation.pickCostCenter')}
              onChange={setCostCenter}
              options={annualBudgets2026.map((budget) => ({ label: budget.costCenter, value: budget.costCenter }))}
              value={costCenter}
            />
          )}
          <FinanceAllocationEditor
            approvedTotal={approvedTotal}
            costCenter={selected.costCenter}
            formatCurrency={formatCurrency}
            groupAmounts={allocations[selected.costCenter] ?? {}}
            key={selected.costCenter}
          />
        </Panel>
      )}

      {adjusting && (
        <FinanceBudgetAdjustmentDialog
          approvedTotal={approvedTotal}
          costCenter={selected.costCenter}
          formatCurrency={formatCurrency}
          onClose={() => setAdjusting(false)}
          onSubmit={(after, reason) => {
            requestBudgetAdjustment(selected.costCenter, approvedTotal, after, reason)
            setSent({ after, before: approvedTotal, costCenter: selected.costCenter })
            setAdjusting(false)
          }}
        />
      )}
    </div>
  )
}
