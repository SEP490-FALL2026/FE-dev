import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { saasGroups, type CatalogStatus, type SaasGroup, type SaasItem } from '../annual-budget-data'
import { FilterPanel, FilterSearchField, FilterSelectField } from './filter-panel'

export type GroupBudgetState = 'OVER' | 'UNALLOCATED' | 'WITHIN'
type Allocations = Record<string, Partial<Record<SaasGroup, number>> | undefined>

export interface SaasCostFilters {
  budget: 'all' | GroupBudgetState
  costCenter: string
  group: 'all' | SaasGroup
  /** Matches the software name or the vendor. */
  search: string
  status: 'all' | CatalogStatus
}

export const defaultSaasCostFilters: SaasCostFilters = {
  budget: 'all',
  costCenter: '',
  group: 'all',
  search: '',
  status: 'all'
}

const catalogStatuses: readonly CatalogStatus[] = ['IN_CATALOG', 'NEW_UNDER_REVIEW', 'NOT_ALLOWED']
const budgetStates: readonly GroupBudgetState[] = ['WITHIN', 'OVER', 'UNALLOCATED']

/** The group budget of the item's Cost Center and the share of it the item's annual cost uses (null = not allocated). */
export function groupBudgetOf(item: SaasItem, allocations: Allocations) {
  const groupBudget = allocations[item.costCenter]?.[item.group] ?? 0
  return { groupBudget, share: groupBudget > 0 ? item.annualCost / groupBudget : null }
}

export function groupBudgetState(item: SaasItem, allocations: Allocations): GroupBudgetState {
  const { share } = groupBudgetOf(item, allocations)
  if (share === null) return 'UNALLOCATED'
  return share > 1 ? 'OVER' : 'WITHIN'
}

export function matchesSaasCostFilters(item: SaasItem, filters: SaasCostFilters, allocations: Allocations) {
  const search = filters.search.trim().toLocaleLowerCase()
  const haystack = `${item.name} ${item.vendor}`.toLocaleLowerCase()

  return (
    (filters.status === 'all' || item.catalogStatus === filters.status) &&
    (filters.costCenter === '' || item.costCenter === filters.costCenter) &&
    (filters.group === 'all' || item.group === filters.group) &&
    (filters.budget === 'all' || groupBudgetState(item, allocations) === filters.budget) &&
    (search === '' || haystack.includes(search))
  )
}

/** Filter bar of FIN-46: choices take effect only when applied; reset restores the defaults. */
export function FinanceSaasCostFilters({
  applied,
  items,
  onApply
}: {
  applied: SaasCostFilters
  items: SaasItem[]
  onApply: (filters: SaasCostFilters) => void
}) {
  const { t } = useTranslation('dashboard')
  const [draft, setDraft] = useState(applied)
  const set = <K extends keyof SaasCostFilters>(key: K, value: SaasCostFilters[K]) =>
    setDraft((current) => ({ ...current, [key]: value }))
  const costCenters = [...new Set(items.map((item) => item.costCenter))].sort()

  return (
    <FilterPanel
      onApply={() => onApply(draft)}
      onReset={() => {
        setDraft(defaultSaasCostFilters)
        onApply(defaultSaasCostFilters)
      }}
      search={
        <FilterSearchField
          label={t('budgetPlan.filtersCatalog.saas.search')}
          onChange={(value) => set('search', value)}
          placeholder={t('budgetPlan.filtersCatalog.saas.searchPlaceholder')}
          value={draft.search}
        />
      }
    >
      <FilterSelectField
        label={t('budgetPlan.filtersCatalog.saas.status')}
        onChange={(value) => set('status', value as SaasCostFilters['status'])}
        value={draft.status}
      >
        <option value='all'>{t('budgetPlan.filtersCatalog.saas.allStatuses')}</option>
        {catalogStatuses.map((status) => (
          <option key={status} value={status}>
            {t(`budgetPlan.saas.status.${status}`)}
          </option>
        ))}
      </FilterSelectField>
      <FilterSelectField
        label={t('budgetPlan.filtersCatalog.saas.costCenter')}
        onChange={(value) => set('costCenter', value)}
        value={draft.costCenter}
      >
        <option value=''>{t('budgetPlan.filtersCatalog.saas.allCostCenters')}</option>
        {costCenters.map((code) => (
          <option key={code} value={code}>
            {code}
          </option>
        ))}
      </FilterSelectField>
      <FilterSelectField
        label={t('budgetPlan.filtersCatalog.saas.group')}
        onChange={(value) => set('group', value as SaasCostFilters['group'])}
        value={draft.group}
      >
        <option value='all'>{t('budgetPlan.filtersCatalog.saas.allGroups')}</option>
        {saasGroups.map((group) => (
          <option key={group} value={group}>
            {t(`budgetPlan.group.${group}`)}
          </option>
        ))}
      </FilterSelectField>
      <FilterSelectField
        label={t('budgetPlan.filtersCatalog.saas.budget')}
        onChange={(value) => set('budget', value as SaasCostFilters['budget'])}
        value={draft.budget}
      >
        <option value='all'>{t('budgetPlan.filtersCatalog.saas.allBudgets')}</option>
        {budgetStates.map((state) => (
          <option key={state} value={state}>
            {t(`budgetPlan.filtersCatalog.saas.budgetValue.${state}`)}
          </option>
        ))}
      </FilterSelectField>
    </FilterPanel>
  )
}
