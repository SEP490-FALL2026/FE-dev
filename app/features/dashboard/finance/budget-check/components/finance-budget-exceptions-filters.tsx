import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { BudgetException, ExceptionAction } from '../../annual-budget-data'
import { FilterPanel, FilterSearchField, FilterSelectField } from '../../shared/components/filter-panel'

type ExceptionKind = BudgetException['kind']

export interface BudgetExceptionFilters {
  /** Matches the recorded handling option; only resolved exceptions have one. */
  action: 'all' | ExceptionAction
  costCenter: string
  kind: 'all' | ExceptionKind
  /** Matches the request code, software, Manager or detail. */
  search: string
  state: 'all' | 'open' | 'resolved'
}

/** The open exceptions show first, as before the filter panel existed. */
export const defaultBudgetExceptionFilters: BudgetExceptionFilters = {
  action: 'all',
  costCenter: '',
  kind: 'all',
  search: '',
  state: 'open'
}

const kinds: readonly ExceptionKind[] = ['INSUFFICIENT', 'OUT_OF_CATALOG', 'CC_EXPIRED']
const actions: readonly ExceptionAction[] = [
  'PROPOSE_TOPUP',
  'TRANSFER_COST_CENTER',
  'REQUEST_INFO',
  'SUBMIT_TO_APPROVER'
]

export function matchesBudgetExceptionFilters(item: BudgetException, filters: BudgetExceptionFilters) {
  const search = filters.search.trim().toLocaleLowerCase()
  const haystack = `${item.requestCode} ${item.software} ${item.manager} ${item.detail}`.toLocaleLowerCase()

  return (
    (filters.costCenter === '' || item.costCenter === filters.costCenter) &&
    (search === '' || haystack.includes(search)) &&
    (filters.kind === 'all' || item.kind === filters.kind) &&
    (filters.state === 'all' || Boolean(item.resolution) === (filters.state === 'resolved')) &&
    (filters.action === 'all' || item.resolution?.action === filters.action)
  )
}

/** Filter bar of FIN-44: choices take effect only when applied; reset restores the defaults. */
export function FinanceBudgetExceptionFilters({
  applied,
  exceptions,
  onApply
}: {
  applied: BudgetExceptionFilters
  exceptions: BudgetException[]
  onApply: (filters: BudgetExceptionFilters) => void
}) {
  const { t } = useTranslation('dashboard')
  const [draft, setDraft] = useState(applied)
  const set = <K extends keyof BudgetExceptionFilters>(key: K, value: BudgetExceptionFilters[K]) =>
    setDraft((current) => ({ ...current, [key]: value }))
  const costCenters = [...new Set(exceptions.map((item) => item.costCenter))].sort()

  return (
    <FilterPanel
      onApply={() => onApply(draft)}
      onReset={() => {
        setDraft(defaultBudgetExceptionFilters)
        onApply(defaultBudgetExceptionFilters)
      }}
      search={
        <FilterSearchField
          label={t('budgetPlan.filtersSpend.budgetExceptions.search')}
          onChange={(value) => set('search', value)}
          placeholder={t('budgetPlan.filtersSpend.budgetExceptions.searchPlaceholder')}
          value={draft.search}
        />
      }
    >
      <FilterSelectField
        label={t('budgetPlan.filtersSpend.costCenter')}
        onChange={(value) => set('costCenter', value)}
        value={draft.costCenter}
      >
        <option value=''>{t('budgetPlan.filtersSpend.allCostCenters')}</option>
        {costCenters.map((code) => (
          <option key={code} value={code}>
            {code}
          </option>
        ))}
      </FilterSelectField>
      <FilterSelectField
        label={t('budgetPlan.filtersSpend.budgetExceptions.kind')}
        onChange={(value) => set('kind', value as BudgetExceptionFilters['kind'])}
        value={draft.kind}
      >
        <option value='all'>{t('ui.all')}</option>
        {kinds.map((kind) => (
          <option key={kind} value={kind}>
            {t(`budgetPlan.check.result.${kind}`)}
          </option>
        ))}
      </FilterSelectField>
      <FilterSelectField
        label={t('budgetPlan.filtersSpend.status')}
        onChange={(value) => set('state', value as BudgetExceptionFilters['state'])}
        value={draft.state}
      >
        <option value='all'>{t('ui.all')}</option>
        <option value='open'>{t('budgetPlan.exceptions.state.open')}</option>
        <option value='resolved'>{t('budgetPlan.exceptions.state.resolved')}</option>
      </FilterSelectField>
      <FilterSelectField
        label={t('budgetPlan.filtersSpend.budgetExceptions.action')}
        onChange={(value) => set('action', value as BudgetExceptionFilters['action'])}
        value={draft.action}
      >
        <option value='all'>{t('ui.all')}</option>
        {actions.map((action) => (
          <option key={action} value={action}>
            {t(`budgetPlan.exceptions.action.${action}`)}
          </option>
        ))}
      </FilterSelectField>
    </FilterPanel>
  )
}
