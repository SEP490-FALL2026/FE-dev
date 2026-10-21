import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { ChargeException, ExceptionReason, ExceptionStatus } from '../finance-data'
import { FilterPanel, FilterSearchField, FilterSelectField } from './filter-panel'

export interface ChargeExceptionFilters {
  reason: 'all' | ExceptionReason
  /** Matches the code, vendor, card last 4 digits or IT note. */
  search: string
  status: 'all' | ExceptionStatus
}

export const defaultChargeExceptionFilters: ChargeExceptionFilters = {
  reason: 'all',
  search: '',
  status: 'all'
}

const reasons: readonly ExceptionReason[] = ['NO_BASIS', 'OVER_APPROVED', 'OUT_OF_TERM', 'MULTIPLE_BASES']
const statuses: readonly ExceptionStatus[] = ['CHECKING', 'SENT_TO_APPROVER', 'BASIS_LINKED', 'BILLING_ERROR']

export function matchesChargeExceptionFilters(item: ChargeException, filters: ChargeExceptionFilters) {
  const search = filters.search.trim().toLocaleLowerCase()
  const haystack = `${item.code} ${item.vendor} ${item.cardLast4} ${item.itNote ?? ''}`.toLocaleLowerCase()

  return (
    (search === '' || haystack.includes(search)) &&
    (filters.reason === 'all' || item.reason === filters.reason) &&
    (filters.status === 'all' || item.status === filters.status)
  )
}

/** Filter bar of FIN-07: choices take effect only when applied; reset restores the defaults. */
export function FinanceChargeExceptionFilters({
  applied,
  onApply
}: {
  applied: ChargeExceptionFilters
  onApply: (filters: ChargeExceptionFilters) => void
}) {
  const { t } = useTranslation('dashboard')
  const [draft, setDraft] = useState(applied)
  const set = <K extends keyof ChargeExceptionFilters>(key: K, value: ChargeExceptionFilters[K]) =>
    setDraft((current) => ({ ...current, [key]: value }))

  return (
    <FilterPanel
      onApply={() => onApply(draft)}
      onReset={() => {
        setDraft(defaultChargeExceptionFilters)
        onApply(defaultChargeExceptionFilters)
      }}
      search={
        <FilterSearchField
          label={t('budgetPlan.filtersSpend.chargeExceptions.search')}
          onChange={(value) => set('search', value)}
          placeholder={t('budgetPlan.filtersSpend.chargeExceptions.searchPlaceholder')}
          value={draft.search}
        />
      }
    >
      <FilterSelectField
        label={t('budgetPlan.filtersSpend.chargeExceptions.reason')}
        onChange={(value) => set('reason', value as ChargeExceptionFilters['reason'])}
        value={draft.reason}
      >
        <option value='all'>{t('ui.all')}</option>
        {reasons.map((reason) => (
          <option key={reason} value={reason}>
            {t(`finance.exceptions.reason.${reason}`)}
          </option>
        ))}
      </FilterSelectField>
      <FilterSelectField
        label={t('budgetPlan.filtersSpend.status')}
        onChange={(value) => set('status', value as ChargeExceptionFilters['status'])}
        value={draft.status}
      >
        <option value='all'>{t('ui.all')}</option>
        {statuses.map((status) => (
          <option key={status} value={status}>
            {t(`finance.exceptions.status.${status}`)}
          </option>
        ))}
      </FilterSelectField>
    </FilterPanel>
  )
}
