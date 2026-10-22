import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { activeFiscalYear, annualBudgets2026, budgetStatuses, type BudgetStatus } from '../annual-budget-data'
import { useAnnualBudgetState } from '../annual-budget-store'
import { FilterPanel, FilterSelectField } from './filter-panel'

export type AllocationState = 'FULL' | 'NONE' | 'PARTIAL'

export interface AllocationFilters {
  allocation: 'all' | AllocationState
  costCenter: string
  status: 'all' | BudgetStatus
  year: number
}

export const defaultAllocationFilters: AllocationFilters = {
  allocation: 'all',
  costCenter: '',
  status: 'all',
  year: activeFiscalYear
}

const allocationStates: readonly AllocationState[] = ['FULL', 'PARTIAL', 'NONE']

/** Filter panel of FIN-45: choices take effect only when applied; reset restores the defaults. */
export function FinanceAllocationFilters({
  applied,
  onApply
}: {
  applied: AllocationFilters
  onApply: (filters: AllocationFilters) => void
}) {
  const { t } = useTranslation('dashboard')
  const { periods } = useAnnualBudgetState()
  const [draft, setDraft] = useState(applied)
  const set = <K extends keyof AllocationFilters>(key: K, value: AllocationFilters[K]) =>
    setDraft((current) => ({ ...current, [key]: value }))

  return (
    <FilterPanel
      onApply={() => onApply(draft)}
      onReset={() => {
        setDraft(defaultAllocationFilters)
        onApply(defaultAllocationFilters)
      }}
    >
      <FilterSelectField
        label={t('budgetPlan.allocation.filters.year')}
        onChange={(value) => set('year', Number(value))}
        value={String(draft.year)}
      >
        {periods.map((period) => (
          <option key={period.year} value={period.year}>
            {period.year}
          </option>
        ))}
      </FilterSelectField>
      <FilterSelectField
        label={t('budgetPlan.allocation.filters.department')}
        onChange={(value) => set('costCenter', value)}
        value={draft.costCenter}
      >
        <option value=''>{t('budgetPlan.allocation.filters.allDepartments')}</option>
        {annualBudgets2026.map((budget) => (
          <option key={budget.costCenter} value={budget.costCenter}>
            {budget.department}
          </option>
        ))}
      </FilterSelectField>
      <FilterSelectField
        label={t('budgetPlan.allocation.filters.allocation')}
        onChange={(value) => set('allocation', value as AllocationFilters['allocation'])}
        value={draft.allocation}
      >
        <option value='all'>{t('ui.all')}</option>
        {allocationStates.map((state) => (
          <option key={state} value={state}>
            {t(`budgetPlan.allocation.filters.state.${state}`)}
          </option>
        ))}
      </FilterSelectField>
      <FilterSelectField
        label={t('budgetPlan.allocation.filters.status')}
        onChange={(value) => set('status', value as AllocationFilters['status'])}
        value={draft.status}
      >
        <option value='all'>{t('ui.all')}</option>
        {budgetStatuses.map((status) => (
          <option key={status} value={status}>
            {t(`budgetPlan.status.${status}`)}
          </option>
        ))}
      </FilterSelectField>
    </FilterPanel>
  )
}
