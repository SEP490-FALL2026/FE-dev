import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Panel, PanelTitle, inputClassName } from '../../../dashboard-ui'
import {
  activeFiscalYear,
  annualBudgets2026,
  annualTotal,
  budgetStatuses,
  proposalBudgetStatus,
  proposalTotals,
  type BudgetStatus
} from '../../annual-budget-data'
import { useAnnualBudgetState } from '../../annual-budget-store'
import { financeDepartmentName } from '../../finance-demo-labels'
import { BudgetStatusPill } from './budget-plan-parts'

interface DepartmentRow {
  base: number | null
  buffer: number | null
  costCenter: string | null
  department: string
  manager: string | null
  status: BudgetStatus
  total: number
}

/** Annual budget per department for a chosen fiscal year, with the budget lifecycle status of each row. */
export function DepartmentAnnualBudgetsPanel({ formatCurrency }: { formatCurrency: (value: number) => string }) {
  const { t } = useTranslation('dashboard')
  const { periods, proposals } = useAnnualBudgetState()
  const selectId = useId()
  const [year, setYear] = useState(activeFiscalYear)
  const period = periods.find((item) => item.year === year)

  const rows: DepartmentRow[] =
    year === activeFiscalYear
      ? annualBudgets2026.map((budget) => ({ ...budget, total: annualTotal(budget) }))
      : proposals.some((proposal) => proposal.year === year)
        ? proposals
            .filter((proposal) => proposal.year === year)
            .map((proposal) => {
              const totals = proposalTotals(proposal)
              return {
                base: totals.base,
                buffer: totals.buffer,
                costCenter: proposal.costCenter,
                department: proposal.department,
                manager: proposal.manager,
                status: proposalBudgetStatus(proposal.stage),
                total: totals.total
              }
            })
        : period?.approvedTotal != null
          ? [
              {
                base: null,
                buffer: null,
                costCenter: null,
                department: t('budgetPlan.existing.departments.companyRow'),
                manager: null,
                status: period.status,
                total: period.approvedTotal
              }
            ]
          : []

  const dash = t('budgetPlan.existing.departments.notApplicable')
  const amount = (value: number | null) => (value === null ? dash : formatCurrency(value))

  return (
    <Panel>
      <PanelTitle
        action={
          <div className='flex items-center gap-2'>
            <label className='text-xs font-semibold text-muted-foreground' htmlFor={selectId}>
              {t('budgetPlan.existing.departments.yearLabel')}
            </label>
            <select
              className={`${inputClassName} w-auto`}
              id={selectId}
              onChange={(event) => setYear(Number(event.target.value))}
              value={year}
            >
              {periods.map((item) => (
                <option key={item.year} value={item.year}>
                  {t('budgetPlan.existing.departments.yearOption', { year: item.year })}
                </option>
              ))}
            </select>
          </div>
        }
        hint={t('budgetPlan.existing.departments.hint')}
        title={t('budgetPlan.existing.departments.title')}
      />

      <div className='mt-4 overflow-x-auto'>
        <table aria-label={t('budgetPlan.existing.departments.title')} className='w-full min-w-184 text-left text-xs'>
          <thead>
            <tr className='border-b border-border text-muted-foreground'>
              <th className='py-2.5 font-semibold'>{t('budgetPlan.existing.departments.colDepartment')}</th>
              <th className='py-2.5 font-semibold'>{t('budgetPlan.existing.departments.colManager')}</th>
              <th className='py-2.5 text-right font-semibold'>{t('budgetPlan.existing.departments.colTotal')}</th>
              <th className='py-2.5 text-right font-semibold'>{t('budgetPlan.existing.departments.colBase')}</th>
              <th className='py-2.5 text-right font-semibold'>{t('budgetPlan.existing.departments.colBuffer')}</th>
              <th className='py-2.5 pl-6 font-semibold'>{t('budgetPlan.existing.departments.colStatus')}</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-border'>
            {rows.map((row) => (
              <tr key={row.costCenter ?? row.department}>
                <td className='py-3'>
                  <span className='font-semibold text-foreground'>
                    {row.costCenter ? financeDepartmentName(row.costCenter, row.department) : row.department}
                  </span>
                  {row.costCenter && <span className='ml-2 font-mono text-muted-foreground'>{row.costCenter}</span>}
                </td>
                <td className='py-3'>{row.manager ?? dash}</td>
                <td className='py-3 text-right font-bold'>{formatCurrency(row.total)}</td>
                <td className='py-3 text-right'>{amount(row.base)}</td>
                <td className='py-3 text-right'>{amount(row.buffer)}</td>
                <td className='py-3 pl-6'>
                  <BudgetStatusPill status={row.status} />
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className='py-8 text-center text-muted-foreground' colSpan={6}>
                  {t('budgetPlan.existing.departments.empty')}
                </td>
              </tr>
            )}
          </tbody>
          {rows.length > 1 && (
            <tfoot>
              <tr className='border-t-2 border-border font-bold'>
                <td className='py-3' colSpan={2}>
                  {t('budgetPlan.existing.departments.total')}
                </td>
                <td className='py-3 text-right'>{formatCurrency(rows.reduce((sum, row) => sum + row.total, 0))}</td>
                <td className='py-3 text-right'>
                  {formatCurrency(rows.reduce((sum, row) => sum + (row.base ?? 0), 0))}
                </td>
                <td className='py-3 text-right'>
                  {formatCurrency(rows.reduce((sum, row) => sum + (row.buffer ?? 0), 0))}
                </td>
                <td />
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      <div className='mt-4 flex flex-wrap items-center gap-2'>
        <span className='text-[0.7rem] font-semibold text-muted-foreground'>
          {t('budgetPlan.existing.departments.legend')}
        </span>
        <ul aria-label={t('budgetPlan.existing.departments.legend')} className='flex flex-wrap gap-1.5'>
          {budgetStatuses.map((status) => (
            <li key={status}>
              <BudgetStatusPill status={status} />
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  )
}
