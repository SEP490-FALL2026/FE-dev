import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { historyKinds, type DecisionOutcome, type HistoryEntry, type HistoryKind } from '../../annual-budget-data'
import { FilterPanel, FilterSearchField, FilterSelectField } from '../../shared/components/filter-panel'

export interface DecisionHistoryFilters {
  costCenter: string
  kind: 'all' | HistoryKind
  outcome: 'all' | DecisionOutcome
  /** Matches the note, the actor or the cost center. */
  search: string
  /** Fiscal year as text; '' = every year. */
  year: string
}

export const defaultDecisionHistoryFilters: DecisionHistoryFilters = {
  costCenter: '',
  kind: 'all',
  outcome: 'all',
  search: '',
  year: ''
}

const outcomes: readonly DecisionOutcome[] = ['APPROVED', 'REJECTED', 'ADJUSTMENT_REQUESTED']

export function matchesDecisionHistoryFilters(entry: HistoryEntry, filters: DecisionHistoryFilters) {
  const search = filters.search.trim().toLocaleLowerCase()
  const haystack = `${entry.note} ${entry.actor} ${entry.costCenter}`.toLocaleLowerCase()

  return (
    (filters.kind === 'all' || entry.kind === filters.kind) &&
    (filters.year === '' || entry.year === Number(filters.year)) &&
    (filters.costCenter === '' || entry.costCenter === filters.costCenter) &&
    (filters.outcome === 'all' || entry.outcome === filters.outcome) &&
    (search === '' || haystack.includes(search))
  )
}

/** Filter bar of FIN-47: choices take effect only when applied; reset restores the defaults. */
export function FinanceDecisionHistoryFilters({
  applied,
  history,
  onApply
}: {
  applied: DecisionHistoryFilters
  history: HistoryEntry[]
  onApply: (filters: DecisionHistoryFilters) => void
}) {
  const { t } = useTranslation('dashboard')
  const [draft, setDraft] = useState(applied)
  const set = <K extends keyof DecisionHistoryFilters>(key: K, value: DecisionHistoryFilters[K]) =>
    setDraft((current) => ({ ...current, [key]: value }))
  const years = [...new Set(history.map((entry) => entry.year))].sort((a, b) => b - a)
  const costCenters = [...new Set(history.map((entry) => entry.costCenter))].sort()

  return (
    <FilterPanel
      onApply={() => onApply(draft)}
      onReset={() => {
        setDraft(defaultDecisionHistoryFilters)
        onApply(defaultDecisionHistoryFilters)
      }}
      search={
        <FilterSearchField
          label={t('budgetPlan.filtersCatalog.history.search')}
          onChange={(value) => set('search', value)}
          placeholder={t('budgetPlan.filtersCatalog.history.searchPlaceholder')}
          value={draft.search}
        />
      }
    >
      <FilterSelectField
        label={t('budgetPlan.filtersCatalog.history.kind')}
        onChange={(value) => set('kind', value as DecisionHistoryFilters['kind'])}
        value={draft.kind}
      >
        <option value='all'>{t('budgetPlan.filtersCatalog.history.allKinds')}</option>
        {historyKinds.map((kind) => (
          <option key={kind} value={kind}>
            {t(`budgetPlan.history.kind.${kind}`)}
          </option>
        ))}
      </FilterSelectField>
      <FilterSelectField
        label={t('budgetPlan.filtersCatalog.history.year')}
        onChange={(value) => set('year', value)}
        value={draft.year}
      >
        <option value=''>{t('budgetPlan.filtersCatalog.history.allYears')}</option>
        {years.map((year) => (
          <option key={year} value={String(year)}>
            {t('budgetPlan.fiscalYear', { year })}
          </option>
        ))}
      </FilterSelectField>
      <FilterSelectField
        label={t('budgetPlan.filtersCatalog.history.costCenter')}
        onChange={(value) => set('costCenter', value)}
        value={draft.costCenter}
      >
        <option value=''>{t('budgetPlan.filtersCatalog.history.allCostCenters')}</option>
        {costCenters.map((code) => (
          <option key={code} value={code}>
            {code}
          </option>
        ))}
      </FilterSelectField>
      <FilterSelectField
        label={t('budgetPlan.filtersCatalog.history.outcome')}
        onChange={(value) => set('outcome', value as DecisionHistoryFilters['outcome'])}
        value={draft.outcome}
      >
        <option value='all'>{t('budgetPlan.filtersCatalog.history.allOutcomes')}</option>
        {outcomes.map((outcome) => (
          <option key={outcome} value={outcome}>
            {t(`budgetPlan.filtersCatalog.history.outcomeValue.${outcome}`)}
          </option>
        ))}
      </FilterSelectField>
    </FilterPanel>
  )
}
