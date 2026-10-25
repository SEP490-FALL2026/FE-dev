import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { financeDataAsOf, type CommitmentToRecord } from '../../finance-data'
import { FilterPanel, FilterSearchField, FilterSelectField } from '../../shared/components/filter-panel'

export interface CommitmentFilters {
  budget: 'all' | 'attached' | 'missing'
  costCenter: string
  due: 'all' | 'onTime' | 'overdue'
  /** Matches the commitment code, request code, software or approver. */
  search: string
}

export const defaultCommitmentFilters: CommitmentFilters = {
  budget: 'all',
  costCenter: '',
  due: 'all',
  search: ''
}

/** A commitment is overdue once its recording deadline has passed at the data snapshot time. */
export const isCommitmentOverdue = (item: CommitmentToRecord) => item.recordingDueAt <= financeDataAsOf

export function matchesCommitmentFilters(item: CommitmentToRecord, filters: CommitmentFilters) {
  const search = filters.search.trim().toLocaleLowerCase()
  const haystack = `${item.code} ${item.requestCode} ${item.software} ${item.approvedBy}`.toLocaleLowerCase()

  return (
    (filters.costCenter === '' || item.costCenter === filters.costCenter) &&
    (search === '' || haystack.includes(search)) &&
    (filters.budget === 'all' || item.budgetAttached === (filters.budget === 'attached')) &&
    (filters.due === 'all' || isCommitmentOverdue(item) === (filters.due === 'overdue'))
  )
}

/** Filter bar of FIN-20: choices take effect only when applied; reset restores the defaults. */
export function FinanceCommitmentFilters({
  applied,
  onApply,
  queue
}: {
  applied: CommitmentFilters
  onApply: (filters: CommitmentFilters) => void
  queue: CommitmentToRecord[]
}) {
  const { t } = useTranslation('dashboard')
  const [draft, setDraft] = useState(applied)
  const set = <K extends keyof CommitmentFilters>(key: K, value: CommitmentFilters[K]) =>
    setDraft((current) => ({ ...current, [key]: value }))
  const costCenters = [...new Set(queue.map((item) => item.costCenter))].sort()

  return (
    <FilterPanel
      onApply={() => onApply(draft)}
      onReset={() => {
        setDraft(defaultCommitmentFilters)
        onApply(defaultCommitmentFilters)
      }}
      search={
        <FilterSearchField
          label={t('budgetPlan.filtersSpend.commitments.search')}
          onChange={(value) => set('search', value)}
          placeholder={t('budgetPlan.filtersSpend.commitments.searchPlaceholder')}
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
        label={t('budgetPlan.filtersSpend.commitments.budget')}
        onChange={(value) => set('budget', value as CommitmentFilters['budget'])}
        value={draft.budget}
      >
        <option value='all'>{t('ui.all')}</option>
        <option value='attached'>{t('finance.commitments.attached')}</option>
        <option value='missing'>{t('budget.noBudget')}</option>
      </FilterSelectField>
      <FilterSelectField
        label={t('budgetPlan.filtersSpend.commitments.due')}
        onChange={(value) => set('due', value as CommitmentFilters['due'])}
        value={draft.due}
      >
        <option value='all'>{t('ui.all')}</option>
        <option value='overdue'>{t('budgetPlan.filtersSpend.commitments.dueState.overdue')}</option>
        <option value='onTime'>{t('budgetPlan.filtersSpend.commitments.dueState.onTime')}</option>
      </FilterSelectField>
    </FilterPanel>
  )
}
