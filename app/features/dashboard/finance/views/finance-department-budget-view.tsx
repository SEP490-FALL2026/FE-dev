import { CircleDollarSign, Lock, PiggyBank, Receipt } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { RemainingValue } from '../../budget-figures'
import { PageHeader, StatTile, useDashboardFormat } from '../../dashboard-ui'
import {
  activeFiscalYear,
  annualBudgets2026,
  annualTotal,
  unpaidCommitments,
  usedThisYear
} from '../annual-budget-data'
import type { FinanceTabKey } from '../finance-nav'
import {
  DepartmentAllocationSection,
  DepartmentCommitmentsSection,
  DepartmentExceptionsSection,
  DepartmentRequestsSection,
  DepartmentUsageSection
} from './finance-department-budget-sections'
import { FilterSelect } from './filter-select'

interface FinanceDepartmentBudgetViewProps {
  formatCurrency: (value: number) => string
  onSelectTab: (tab: FinanceTabKey, extraParams?: Record<string, string>) => void
}

/**
 * FIN-09: pick one department and see everything about its budget at once — the approved annual budget, how it
 * is allocated, what is committed and the open requests and exceptions. Each section links to its full screen.
 */
export function FinanceDepartmentBudgetView({ formatCurrency, onSelectTab }: FinanceDepartmentBudgetViewProps) {
  const { t } = useTranslation('dashboard')
  const { formatCompactCurrency } = useDashboardFormat()
  const [costCenter, setCostCenter] = useState(annualBudgets2026[0].costCenter)

  const budget = annualBudgets2026.find((item) => item.costCenter === costCenter) ?? annualBudgets2026[0]
  const approved = annualTotal(budget)
  const used = usedThisYear(costCenter)
  const committed = unpaidCommitments
    .filter((item) => item.costCenter === costCenter)
    .reduce((sum, item) => sum + item.amount, 0)
  const sectionProps = { costCenter, formatCurrency, onSelectTab }

  return (
    <div className='space-y-6'>
      <PageHeader
        subtitle={t('budgetPlan.department.subtitle', { year: activeFiscalYear })}
        title={t('budgetPlan.department.title', { department: budget.department })}
      />

      <FilterSelect<string>
        label={t('budgetPlan.department.pickLabel')}
        onChange={setCostCenter}
        options={annualBudgets2026.map((item) => ({ label: item.department, value: item.costCenter }))}
        value={costCenter}
      />

      <section
        aria-label={t('budgetPlan.department.figuresLabel')}
        className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'
      >
        <StatTile
          hint={t('budgetPlan.department.approvedHint', {
            base: formatCompactCurrency(budget.base),
            buffer: formatCompactCurrency(budget.buffer)
          })}
          icon={CircleDollarSign}
          label={t('budgetPlan.department.approved')}
          value={formatCurrency(approved)}
        />
        <StatTile icon={Receipt} label={t('budgetPlan.department.used')} tone='info' value={formatCurrency(used)} />
        <StatTile
          hint={t('budgetPlan.department.committedHint')}
          icon={Lock}
          label={t('budgetPlan.department.committed')}
          tone='warning'
          value={formatCurrency(committed)}
        />
        <div className='rounded-2xl border border-border bg-surface p-4 shadow-sm'>
          <div className='flex items-start justify-between gap-3'>
            <span className='text-xs font-semibold text-muted-foreground'>{t('budgetPlan.department.remaining')}</span>
            <span className='grid size-9 place-items-center rounded-xl bg-success/10 text-success'>
              <PiggyBank aria-hidden='true' className='size-4' />
            </span>
          </div>
          <p className='mt-2 text-2xl font-extrabold tracking-tight'>
            <RemainingValue formatCurrency={formatCurrency} remaining={approved - used - committed} />
          </p>
          <p className='mt-1 text-xs text-muted-foreground'>{t('budgetPlan.department.remainingHint')}</p>
        </div>
      </section>

      <div className='grid gap-6 xl:grid-cols-2'>
        <DepartmentUsageSection approved={approved} committed={committed} formatCurrency={formatCurrency} used={used} />
        <DepartmentAllocationSection {...sectionProps} approved={approved} />
        <DepartmentCommitmentsSection {...sectionProps} />
        <DepartmentRequestsSection {...sectionProps} />
        <DepartmentExceptionsSection {...sectionProps} />
      </div>
    </div>
  )
}
