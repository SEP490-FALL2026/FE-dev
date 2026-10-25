import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { proposalBudgetStatus, type AnnualProposal, type BudgetStatus, type ProposalStage } from '../../annual-budget-data'
import { FilterPanel, FilterSearchField, FilterSelectField } from '../../shared/components/filter-panel'
import { proposalStatuses } from './finance-annual-proposals-filters'

/** READY = analysed and waiting to be sent (NEGOTIATED); NOT_READY = any other stage. */
export type SummaryReadiness = 'NOT_READY' | 'READY'

export interface DepartmentSummaryFilters {
  readiness: 'all' | SummaryReadiness
  /** Matches the department or cost center. */
  search: string
  stage: 'all' | ProposalStage
  status: 'all' | BudgetStatus
}

export const defaultDepartmentSummaryFilters: DepartmentSummaryFilters = {
  readiness: 'all',
  search: '',
  stage: 'all',
  status: 'all'
}

const summaryStages: readonly ProposalStage[] = [
  'SUBMITTED',
  'NEEDS_INFO',
  'IN_ANALYSIS',
  'NEGOTIATED',
  'SENT',
  'APPROVED',
  'RETURNED',
  'REJECTED'
]
const readinessOptions: readonly SummaryReadiness[] = ['READY', 'NOT_READY']

export const isDepartmentSummaryFiltered = (filters: DepartmentSummaryFilters) =>
  filters.readiness !== 'all' || filters.search.trim() !== '' || filters.stage !== 'all' || filters.status !== 'all'

export function matchesDepartmentSummaryFilters(proposal: AnnualProposal, filters: DepartmentSummaryFilters) {
  const search = filters.search.trim().toLocaleLowerCase()
  const haystack = `${proposal.department} ${proposal.costCenter}`.toLocaleLowerCase()
  const readiness: SummaryReadiness = proposal.stage === 'NEGOTIATED' ? 'READY' : 'NOT_READY'

  return (
    (search === '' || haystack.includes(search)) &&
    (filters.stage === 'all' || proposal.stage === filters.stage) &&
    (filters.status === 'all' || proposalBudgetStatus(proposal.stage) === filters.status) &&
    (filters.readiness === 'all' || readiness === filters.readiness)
  )
}

/** Filter bar of FIN-42: choices take effect only when applied; reset restores the defaults. */
export function FinanceDepartmentSummaryFilters({
  applied,
  onApply
}: {
  applied: DepartmentSummaryFilters
  onApply: (filters: DepartmentSummaryFilters) => void
}) {
  const { t } = useTranslation('dashboard')
  const [draft, setDraft] = useState(applied)
  const set = <K extends keyof DepartmentSummaryFilters>(key: K, value: DepartmentSummaryFilters[K]) =>
    setDraft((current) => ({ ...current, [key]: value }))

  return (
    <FilterPanel
      onApply={() => onApply(draft)}
      onReset={() => {
        setDraft(defaultDepartmentSummaryFilters)
        onApply(defaultDepartmentSummaryFilters)
      }}
      search={
        <FilterSearchField
          label={t('budgetPlan.filtersPlanning.summary.search')}
          onChange={(value) => set('search', value)}
          placeholder={t('budgetPlan.filtersPlanning.summary.searchPlaceholder')}
          value={draft.search}
        />
      }
    >
      <FilterSelectField
        label={t('budgetPlan.filtersPlanning.stage')}
        onChange={(value) => set('stage', value as DepartmentSummaryFilters['stage'])}
        value={draft.stage}
      >
        <option value='all'>{t('ui.all')}</option>
        {summaryStages.map((stage) => (
          <option key={stage} value={stage}>
            {t(`budgetPlan.stage.${stage}`)}
          </option>
        ))}
      </FilterSelectField>
      <FilterSelectField
        label={t('budgetPlan.filtersPlanning.budgetStatus')}
        onChange={(value) => set('status', value as DepartmentSummaryFilters['status'])}
        value={draft.status}
      >
        <option value='all'>{t('ui.all')}</option>
        {proposalStatuses.map((status) => (
          <option key={status} value={status}>
            {t(`budgetPlan.status.${status}`)}
          </option>
        ))}
      </FilterSelectField>
      <FilterSelectField
        label={t('budgetPlan.filtersPlanning.summary.readiness')}
        onChange={(value) => set('readiness', value as DepartmentSummaryFilters['readiness'])}
        value={draft.readiness}
      >
        <option value='all'>{t('ui.all')}</option>
        {readinessOptions.map((readiness) => (
          <option key={readiness} value={readiness}>
            {t(`budgetPlan.filtersPlanning.summary.readinessOption.${readiness}`)}
          </option>
        ))}
      </FilterSelectField>
    </FilterPanel>
  )
}
