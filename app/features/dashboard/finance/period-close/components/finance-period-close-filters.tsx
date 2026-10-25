import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { CloseStatus } from '../../period-close-data'
import { FilterPanel, FilterSearchField, FilterSelectField } from '../../shared/components/filter-panel'

/** HELD = the Cost Center still holds a remainder; NONE = it holds nothing. */
export type RemainderFilter = 'HELD' | 'NONE'

export interface PeriodCloseFilters {
  remainder: 'all' | RemainderFilter
  /** Matches the cost center code or name. */
  search: string
  status: 'all' | CloseStatus
}

export const defaultPeriodCloseFilters: PeriodCloseFilters = { remainder: 'all', search: '', status: 'all' }

const statuses: readonly CloseStatus[] = ['BLOCKED', 'READY', 'CLOSED']
const remainders: readonly RemainderFilter[] = ['HELD', 'NONE']

export function matchesPeriodCloseFilters(
  row: { cc: { code: string; name: string }; summary: { heldAmount: number; status: CloseStatus } },
  filters: PeriodCloseFilters
) {
  const search = filters.search.trim().toLocaleLowerCase()
  const haystack = `${row.cc.code} ${row.cc.name}`.toLocaleLowerCase()
  const remainder: RemainderFilter = row.summary.heldAmount > 0 ? 'HELD' : 'NONE'

  return (
    (search === '' || haystack.includes(search)) &&
    (filters.status === 'all' || row.summary.status === filters.status) &&
    (filters.remainder === 'all' || remainder === filters.remainder)
  )
}

/** Filter bar of FIN-30: choices take effect only when applied; reset restores the defaults. */
export function FinancePeriodCloseFilters({
  applied,
  onApply
}: {
  applied: PeriodCloseFilters
  onApply: (filters: PeriodCloseFilters) => void
}) {
  const { t } = useTranslation('dashboard')
  const [draft, setDraft] = useState(applied)
  const set = <K extends keyof PeriodCloseFilters>(key: K, value: PeriodCloseFilters[K]) =>
    setDraft((current) => ({ ...current, [key]: value }))

  return (
    <FilterPanel
      onApply={() => onApply(draft)}
      onReset={() => {
        setDraft(defaultPeriodCloseFilters)
        onApply(defaultPeriodCloseFilters)
      }}
      search={
        <FilterSearchField
          label={t('budgetPlan.filtersPlanning.periodClose.search')}
          onChange={(value) => set('search', value)}
          placeholder={t('budgetPlan.filtersPlanning.periodClose.searchPlaceholder')}
          value={draft.search}
        />
      }
    >
      <FilterSelectField
        label={t('budgetPlan.filtersPlanning.periodClose.status')}
        onChange={(value) => set('status', value as PeriodCloseFilters['status'])}
        value={draft.status}
      >
        <option value='all'>{t('ui.all')}</option>
        {statuses.map((status) => (
          <option key={status} value={status}>
            {t(`finance.close.status.${status}`)}
          </option>
        ))}
      </FilterSelectField>
      <FilterSelectField
        label={t('budgetPlan.filtersPlanning.periodClose.remainder')}
        onChange={(value) => set('remainder', value as PeriodCloseFilters['remainder'])}
        value={draft.remainder}
      >
        <option value='all'>{t('ui.all')}</option>
        {remainders.map((remainder) => (
          <option key={remainder} value={remainder}>
            {t(`budgetPlan.filtersPlanning.periodClose.remainderOption.${remainder}`)}
          </option>
        ))}
      </FilterSelectField>
    </FilterPanel>
  )
}
