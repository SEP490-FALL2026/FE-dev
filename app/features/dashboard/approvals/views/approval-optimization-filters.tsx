import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { OptimizationKind, OptimizationOpportunity, OptimizationStatus } from '../../finance/optimization-data'
import { FilterPanel, FilterSearchField, FilterSelectField } from '../../finance/views/filter-panel'

type SentStatus = Exclude<OptimizationStatus, 'DRAFT'>

export interface ApprovalOptimizationFilters {
  /** Cost Center code; '' = every Cost Center. */
  costCenter: string
  kind: 'all' | OptimizationKind
  /** Matches the proposal code, the app or the vendor. */
  search: string
  status: 'all' | SentStatus
}

/** Proposals waiting for a decision come first. */
export const defaultApprovalOptimizationFilters: ApprovalOptimizationFilters = {
  costCenter: '',
  kind: 'all',
  search: '',
  status: 'SENT'
}

const statuses: readonly SentStatus[] = ['SENT', 'APPROVED', 'REJECTED']
const kinds: readonly OptimizationKind[] = ['GHOST_SEAT', 'DOWNGRADE', 'CANCEL']

export function matchesApprovalOptimizationFilters(
  item: OptimizationOpportunity,
  filters: ApprovalOptimizationFilters
) {
  const search = filters.search.trim().toLocaleLowerCase()
  const haystack = `${item.code} ${item.app} ${item.vendor}`.toLocaleLowerCase()

  return (
    (search === '' || haystack.includes(search)) &&
    (filters.status === 'all' || item.status === filters.status) &&
    (filters.kind === 'all' || item.kind === filters.kind) &&
    (filters.costCenter === '' || item.costCenter === filters.costCenter)
  )
}

/** Filter bar of APV-04: choices take effect only when applied; reset restores the defaults. */
export function ApprovalOptimizationFiltersPanel({
  applied,
  items,
  onApply
}: {
  applied: ApprovalOptimizationFilters
  items: OptimizationOpportunity[]
  onApply: (filters: ApprovalOptimizationFilters) => void
}) {
  const { t } = useTranslation('dashboard')
  const [draft, setDraft] = useState(applied)
  const set = <K extends keyof ApprovalOptimizationFilters>(key: K, value: ApprovalOptimizationFilters[K]) =>
    setDraft((current) => ({ ...current, [key]: value }))
  const costCenters = [...new Set(items.map((item) => item.costCenter))].sort()

  return (
    <FilterPanel
      onApply={() => onApply(draft)}
      onReset={() => {
        setDraft(defaultApprovalOptimizationFilters)
        onApply(defaultApprovalOptimizationFilters)
      }}
      search={
        <FilterSearchField
          label={t('budgetPlan.filtersApproverQueue.optimization.search')}
          onChange={(value) => set('search', value)}
          placeholder={t('budgetPlan.filtersApproverQueue.optimization.searchPlaceholder')}
          value={draft.search}
        />
      }
    >
      <FilterSelectField
        label={t('budgetPlan.filtersApproverQueue.optimization.status')}
        onChange={(value) => set('status', value as ApprovalOptimizationFilters['status'])}
        value={draft.status}
      >
        <option value='all'>{t('ui.all')}</option>
        {statuses.map((status) => (
          <option key={status} value={status}>
            {t(`finance.optimization.status.${status}`)}
          </option>
        ))}
      </FilterSelectField>
      <FilterSelectField
        label={t('budgetPlan.filtersApproverQueue.optimization.kind')}
        onChange={(value) => set('kind', value as ApprovalOptimizationFilters['kind'])}
        value={draft.kind}
      >
        <option value='all'>{t('ui.all')}</option>
        {kinds.map((kind) => (
          <option key={kind} value={kind}>
            {t(`finance.optimization.kind.${kind}`)}
          </option>
        ))}
      </FilterSelectField>
      <FilterSelectField
        label={t('budgetPlan.filtersApproverQueue.costCenter')}
        onChange={(value) => set('costCenter', value)}
        value={draft.costCenter}
      >
        <option value=''>{t('budgetPlan.filtersApproverQueue.allCostCenters')}</option>
        {costCenters.map((code) => (
          <option key={code} value={code}>
            {code}
          </option>
        ))}
      </FilterSelectField>
    </FilterPanel>
  )
}
