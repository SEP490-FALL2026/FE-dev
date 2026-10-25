import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { BudgetCheck, BudgetCheckResult, BudgetException } from '../../annual-budget-data'
import { FilterPanel, FilterSearchField, FilterSelectField } from '../../shared/components/filter-panel'

export type CheckNextStep = 'FORWARDED' | 'NEEDS_HANDLING' | 'RESOLVED'
type ExceptionKind = Exclude<BudgetCheckResult, 'PASSED'>

export interface BudgetCheckFilters {
  costCenter: string
  kind: 'all' | ExceptionKind
  /** Matches the request code, the software or the requester. */
  search: string
  step: 'all' | CheckNextStep
  /** Fiscal year as text; '' = every year. */
  year: string
}

export const defaultBudgetCheckFilters: BudgetCheckFilters = {
  costCenter: '',
  kind: 'all',
  search: '',
  step: 'all',
  year: ''
}

const steps: readonly CheckNextStep[] = ['NEEDS_HANDLING', 'FORWARDED', 'RESOLVED']
const kinds: readonly ExceptionKind[] = ['INSUFFICIENT', 'OUT_OF_CATALOG', 'CC_EXPIRED']

/** The fiscal year is the calendar year of the check (fiscal years run January–December). */
export const checkYear = (check: BudgetCheck) => check.checkedAt.slice(0, 4)

/** A passed request goes straight to the Spending Approver; a failed one waits on its exception. */
export function nextStepOf(check: BudgetCheck, exceptions: BudgetException[]): CheckNextStep {
  if (check.result === 'PASSED') return 'FORWARDED'
  return exceptions.find((item) => item.checkId === check.id)?.resolution ? 'RESOLVED' : 'NEEDS_HANDLING'
}

export function matchesBudgetCheckFilters(
  check: BudgetCheck,
  filters: BudgetCheckFilters,
  exceptions: BudgetException[]
) {
  const search = filters.search.trim().toLocaleLowerCase()
  const haystack = `${check.requestCode} ${check.software} ${check.requester}`.toLocaleLowerCase()

  return (
    (filters.year === '' || checkYear(check) === filters.year) &&
    (filters.costCenter === '' || check.costCenter === filters.costCenter) &&
    (search === '' || haystack.includes(search)) &&
    (filters.step === 'all' || nextStepOf(check, exceptions) === filters.step) &&
    (filters.kind === 'all' || check.result === filters.kind)
  )
}

/** Filter bar of FIN-08: choices take effect only when applied; reset restores the defaults. */
export function FinanceBudgetCheckFilters({
  applied,
  checks,
  onApply
}: {
  applied: BudgetCheckFilters
  checks: BudgetCheck[]
  onApply: (filters: BudgetCheckFilters) => void
}) {
  const { t } = useTranslation('dashboard')
  const [draft, setDraft] = useState(applied)
  const set = <K extends keyof BudgetCheckFilters>(key: K, value: BudgetCheckFilters[K]) =>
    setDraft((current) => ({ ...current, [key]: value }))
  const years = [...new Set(checks.map(checkYear))].sort().reverse()
  const costCenters = [...new Set(checks.map((check) => check.costCenter))].sort()

  return (
    <FilterPanel
      onApply={() => onApply(draft)}
      onReset={() => {
        setDraft(defaultBudgetCheckFilters)
        onApply(defaultBudgetCheckFilters)
      }}
      search={
        <FilterSearchField
          label={t('budgetPlan.check.filters.search')}
          onChange={(value) => set('search', value)}
          placeholder={t('budgetPlan.check.filters.searchPlaceholder')}
          value={draft.search}
        />
      }
    >
      <FilterSelectField
        label={t('budgetPlan.check.filters.year')}
        onChange={(value) => set('year', value)}
        value={draft.year}
      >
        <option value=''>{t('budgetPlan.check.filters.allYears')}</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </FilterSelectField>
      <FilterSelectField
        label={t('budgetPlan.check.filters.costCenter')}
        onChange={(value) => set('costCenter', value)}
        value={draft.costCenter}
      >
        <option value=''>{t('budgetPlan.check.filters.allCostCenters')}</option>
        {costCenters.map((code) => (
          <option key={code} value={code}>
            {code}
          </option>
        ))}
      </FilterSelectField>
      <FilterSelectField
        label={t('budgetPlan.check.filters.nextStep')}
        onChange={(value) => set('step', value as BudgetCheckFilters['step'])}
        value={draft.step}
      >
        <option value='all'>{t('ui.all')}</option>
        {steps.map((step) => (
          <option key={step} value={step}>
            {t(`budgetPlan.check.filters.step.${step}`)}
          </option>
        ))}
      </FilterSelectField>
      <FilterSelectField
        label={t('budgetPlan.check.filters.exceptionKind')}
        onChange={(value) => set('kind', value as BudgetCheckFilters['kind'])}
        value={draft.kind}
      >
        <option value='all'>{t('ui.all')}</option>
        {kinds.map((kind) => (
          <option key={kind} value={kind}>
            {t(`budgetPlan.check.result.${kind}`)}
          </option>
        ))}
      </FilterSelectField>
    </FilterPanel>
  )
}
