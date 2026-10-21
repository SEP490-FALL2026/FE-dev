import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { OptimizationKind, OptimizationOpportunity, OptimizationStatus } from '../optimization-data'
import { FilterPanel, FilterSearchField, FilterSelectField } from './filter-panel'

type OptimizationTiming = OptimizationOpportunity['timing']

export interface OptimizationFilters {
  costCenter: string
  kind: 'all' | OptimizationKind
  /** Matches the proposal code, the app or the vendor. */
  search: string
  status: 'all' | OptimizationStatus
  timing: 'all' | OptimizationTiming
}

export const defaultOptimizationFilters: OptimizationFilters = {
  costCenter: '',
  kind: 'all',
  search: '',
  status: 'all',
  timing: 'all'
}

const kinds: readonly OptimizationKind[] = ['GHOST_SEAT', 'DOWNGRADE', 'CANCEL']
const statuses: readonly OptimizationStatus[] = ['DRAFT', 'SENT', 'APPROVED', 'REJECTED']
const timings: readonly OptimizationTiming[] = ['IMMEDIATE', 'NEXT_RENEWAL']

export function matchesOptimizationFilters(item: OptimizationOpportunity, filters: OptimizationFilters) {
  const search = filters.search.trim().toLocaleLowerCase()
  const haystack = `${item.code} ${item.app} ${item.vendor}`.toLocaleLowerCase()

  return (
    (filters.kind === 'all' || item.kind === filters.kind) &&
    (filters.costCenter === '' || item.costCenter === filters.costCenter) &&
    (filters.status === 'all' || item.status === filters.status) &&
    (filters.timing === 'all' || item.timing === filters.timing) &&
    (search === '' || haystack.includes(search))
  )
}

/** Filter bar of FIN-35: choices take effect only when applied; reset restores the defaults. */
export function FinanceOptimizationFilters({
  applied,
  items,
  onApply
}: {
  applied: OptimizationFilters
  items: OptimizationOpportunity[]
  onApply: (filters: OptimizationFilters) => void
}) {
  const { t } = useTranslation('dashboard')
  const [draft, setDraft] = useState(applied)
  const set = <K extends keyof OptimizationFilters>(key: K, value: OptimizationFilters[K]) =>
    setDraft((current) => ({ ...current, [key]: value }))
  const costCenters = [...new Set(items.map((item) => item.costCenter))].sort()

  return (
    <FilterPanel
      onApply={() => onApply(draft)}
      onReset={() => {
        setDraft(defaultOptimizationFilters)
        onApply(defaultOptimizationFilters)
      }}
      search={
        <FilterSearchField
          label={t('budgetPlan.filtersCatalog.optimization.search')}
          onChange={(value) => set('search', value)}
          placeholder={t('budgetPlan.filtersCatalog.optimization.searchPlaceholder')}
          value={draft.search}
        />
      }
    >
      <FilterSelectField
        label={t('budgetPlan.filtersCatalog.optimization.kind')}
        onChange={(value) => set('kind', value as OptimizationFilters['kind'])}
        value={draft.kind}
      >
        <option value='all'>{t('budgetPlan.filtersCatalog.optimization.allKinds')}</option>
        {kinds.map((kind) => (
          <option key={kind} value={kind}>
            {t(`finance.optimization.kind.${kind}`)}
          </option>
        ))}
      </FilterSelectField>
      <FilterSelectField
        label={t('budgetPlan.filtersCatalog.optimization.costCenter')}
        onChange={(value) => set('costCenter', value)}
        value={draft.costCenter}
      >
        <option value=''>{t('budgetPlan.filtersCatalog.optimization.allCostCenters')}</option>
        {costCenters.map((code) => (
          <option key={code} value={code}>
            {code}
          </option>
        ))}
      </FilterSelectField>
      <FilterSelectField
        label={t('budgetPlan.filtersCatalog.optimization.status')}
        onChange={(value) => set('status', value as OptimizationFilters['status'])}
        value={draft.status}
      >
        <option value='all'>{t('budgetPlan.filtersCatalog.optimization.allStatuses')}</option>
        {statuses.map((status) => (
          <option key={status} value={status}>
            {t(`finance.optimization.status.${status}`)}
          </option>
        ))}
      </FilterSelectField>
      <FilterSelectField
        label={t('budgetPlan.filtersCatalog.optimization.timing')}
        onChange={(value) => set('timing', value as OptimizationFilters['timing'])}
        value={draft.timing}
      >
        <option value='all'>{t('budgetPlan.filtersCatalog.optimization.allTimings')}</option>
        {timings.map((timing) => (
          <option key={timing} value={timing}>
            {t(`budgetPlan.filtersCatalog.optimization.timingValue.${timing}`)}
          </option>
        ))}
      </FilterSelectField>
    </FilterPanel>
  )
}
