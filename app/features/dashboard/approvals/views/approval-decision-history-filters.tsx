import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { DecisionOutcome, HistoryEntry, HistoryKind } from '../../finance/annual-budget-data'
import { FilterPanel, FilterSearchField, FilterSelectField } from '../../finance/views/filter-panel'

export type DecisionGroup = 'annual' | 'exception' | 'spend'

const groupKinds: Record<DecisionGroup, readonly HistoryKind[]> = {
  annual: ['APPROVAL'],
  exception: ['EXCEPTION_APPROVAL', 'ADJUSTMENT_APPROVAL'],
  spend: ['SPEND_APPROVAL']
}

const groups: readonly DecisionGroup[] = ['annual', 'spend', 'exception']
const outcomes: readonly DecisionOutcome[] = ['APPROVED', 'REJECTED', 'ADJUSTMENT_REQUESTED']

export interface ApproverHistoryFilters {
  costCenter: string
  group: 'all' | DecisionGroup
  outcome: 'all' | DecisionOutcome
  /** Matches the note, the cost center or the approver. */
  search: string
  /** Fiscal year as text; '' = every year. */
  year: string
}

export const defaultApproverHistoryFilters: ApproverHistoryFilters = {
  costCenter: '',
  group: 'all',
  outcome: 'all',
  search: '',
  year: ''
}

export function matchesApproverHistoryFilters(entry: HistoryEntry, filters: ApproverHistoryFilters) {
  const search = filters.search.trim().toLocaleLowerCase()
  const haystack = `${entry.note} ${entry.costCenter} ${entry.actor}`.toLocaleLowerCase()

  return (
    (filters.group === 'all' || groupKinds[filters.group].includes(entry.kind)) &&
    (filters.outcome === 'all' || entry.outcome === filters.outcome) &&
    (filters.year === '' || entry.year === Number(filters.year)) &&
    (filters.costCenter === '' || entry.costCenter === filters.costCenter) &&
    (search === '' || haystack.includes(search))
  )
}

/** Filter bar of APV-06: choices take effect only when applied; reset restores the defaults. */
export function ApprovalDecisionHistoryFilters({
  applied,
  decisions,
  onApply
}: {
  applied: ApproverHistoryFilters
  decisions: HistoryEntry[]
  onApply: (filters: ApproverHistoryFilters) => void
}) {
  const { t } = useTranslation('dashboard')
  const [draft, setDraft] = useState(applied)
  const set = <K extends keyof ApproverHistoryFilters>(key: K, value: ApproverHistoryFilters[K]) =>
    setDraft((current) => ({ ...current, [key]: value }))
  const years = [...new Set(decisions.map((entry) => entry.year))].sort((a, b) => b - a)
  const costCenters = [...new Set(decisions.map((entry) => entry.costCenter))].sort()

  return (
    <FilterPanel
      onApply={() => onApply(draft)}
      onReset={() => {
        setDraft(defaultApproverHistoryFilters)
        onApply(defaultApproverHistoryFilters)
      }}
      search={
        <FilterSearchField
          label={t('budgetPlan.filtersApproverDecisions.history.search')}
          onChange={(value) => set('search', value)}
          placeholder={t('budgetPlan.filtersApproverDecisions.history.searchPlaceholder')}
          value={draft.search}
        />
      }
    >
      <FilterSelectField
        label={t('budgetPlan.filtersApproverDecisions.history.group')}
        onChange={(value) => set('group', value as ApproverHistoryFilters['group'])}
        value={draft.group}
      >
        <option value='all'>{t('budgetPlan.filtersApproverDecisions.history.allGroups')}</option>
        {groups.map((group) => (
          <option key={group} value={group}>
            {t(`budgetPlan.approverHistory.group.${group}`)}
          </option>
        ))}
      </FilterSelectField>
      <FilterSelectField
        label={t('budgetPlan.filtersApproverDecisions.history.outcome')}
        onChange={(value) => set('outcome', value as ApproverHistoryFilters['outcome'])}
        value={draft.outcome}
      >
        <option value='all'>{t('budgetPlan.filtersApproverDecisions.history.allOutcomes')}</option>
        {outcomes.map((outcome) => (
          <option key={outcome} value={outcome}>
            {t(`budgetPlan.approverHistory.outcome.${outcome}`)}
          </option>
        ))}
      </FilterSelectField>
      <FilterSelectField
        label={t('budgetPlan.filtersApproverDecisions.history.year')}
        onChange={(value) => set('year', value)}
        value={draft.year}
      >
        <option value=''>{t('budgetPlan.filtersApproverDecisions.history.allYears')}</option>
        {years.map((year) => (
          <option key={year} value={String(year)}>
            {t('budgetPlan.fiscalYear', { year })}
          </option>
        ))}
      </FilterSelectField>
      <FilterSelectField
        label={t('budgetPlan.filtersApproverDecisions.history.costCenter')}
        onChange={(value) => set('costCenter', value)}
        value={draft.costCenter}
      >
        <option value=''>{t('budgetPlan.filtersApproverDecisions.history.allCostCenters')}</option>
        {costCenters.map((code) => (
          <option key={code} value={code}>
            {code}
          </option>
        ))}
      </FilterSelectField>
    </FilterPanel>
  )
}
