import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { financeDepartmentName } from '../../finance-demo-labels'

import {
  planningFiscalYear,
  proposalBudgetStatus,
  type AnnualProposal,
  type BudgetStatus,
  type ProposalStage
} from '../../annual-budget-data'
import { FilterPanel, FilterSearchField, FilterSelectField } from '../../shared/components/filter-panel'

export interface AnnualProposalFilters {
  /** Cost center code; '' = every department. */
  costCenter: string
  /** Matches the department, cost center, Manager or a software name in the lines. */
  search: string
  stage: 'all' | ProposalStage
  status: 'all' | BudgetStatus
  /** Fiscal year as text; '' = every year. */
  year: string
}

export const defaultAnnualProposalFilters: AnnualProposalFilters = {
  costCenter: '',
  search: '',
  stage: 'all',
  status: 'all',
  year: String(planningFiscalYear)
}

export const proposalStages: readonly ProposalStage[] = [
  'SUBMITTED',
  'NEEDS_INFO',
  'IN_ANALYSIS',
  'NEGOTIATED',
  'SENT',
  'APPROVED',
  'RETURNED'
]

/** Budget statuses a proposal can show (see `proposalBudgetStatus`). */
export const proposalStatuses: readonly BudgetStatus[] = [
  'DRAFT',
  'UNDER_FINANCE_REVIEW',
  'PENDING_APPROVAL',
  'APPROVED'
]

export function matchesAnnualProposalFilters(proposal: AnnualProposal, filters: AnnualProposalFilters) {
  const search = filters.search.trim().toLocaleLowerCase()
  const haystack = [
    proposal.department,
    proposal.costCenter,
    proposal.manager,
    ...proposal.lines.map((item) => item.software)
  ]
    .join(' ')
    .toLocaleLowerCase()

  return (
    (filters.year === '' || String(proposal.year) === filters.year) &&
    (filters.costCenter === '' || proposal.costCenter === filters.costCenter) &&
    (search === '' || haystack.includes(search)) &&
    (filters.stage === 'all' || proposal.stage === filters.stage) &&
    (filters.status === 'all' || proposalBudgetStatus(proposal.stage) === filters.status)
  )
}

/** Unique cost centers with their department name, sorted by code. */
export const departmentOptions = (proposals: Pick<AnnualProposal, 'costCenter' | 'department'>[]) =>
  [...new Map(proposals.map((proposal) => [proposal.costCenter, proposal.department])).entries()].sort(([a], [b]) =>
    a.localeCompare(b)
  )

/** Filter bar of FIN-40: choices take effect only when applied; reset restores the defaults. */
export function FinanceAnnualProposalsFilters({
  applied,
  onApply,
  proposals
}: {
  applied: AnnualProposalFilters
  onApply: (filters: AnnualProposalFilters) => void
  proposals: AnnualProposal[]
}) {
  const { t } = useTranslation('dashboard')
  const [draft, setDraft] = useState(applied)
  const set = <K extends keyof AnnualProposalFilters>(key: K, value: AnnualProposalFilters[K]) =>
    setDraft((current) => ({ ...current, [key]: value }))
  const years = [...new Set(proposals.map((proposal) => String(proposal.year)))].sort().reverse()

  return (
    <FilterPanel
      onApply={() => onApply(draft)}
      onReset={() => {
        setDraft(defaultAnnualProposalFilters)
        onApply(defaultAnnualProposalFilters)
      }}
      search={
        <FilterSearchField
          label={t('budgetPlan.filtersPlanning.proposals.search')}
          onChange={(value) => set('search', value)}
          placeholder={t('budgetPlan.filtersPlanning.proposals.searchPlaceholder')}
          value={draft.search}
        />
      }
    >
      <FilterSelectField
        label={t('budgetPlan.filtersPlanning.proposals.year')}
        onChange={(value) => set('year', value)}
        value={draft.year}
      >
        <option value=''>{t('budgetPlan.filtersPlanning.proposals.allYears')}</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </FilterSelectField>
      <FilterSelectField
        label={t('budgetPlan.filtersPlanning.department')}
        onChange={(value) => set('costCenter', value)}
        value={draft.costCenter}
      >
        <option value=''>{t('budgetPlan.filtersPlanning.allDepartments')}</option>
        {departmentOptions(proposals).map(([code, department]) => (
          <option key={code} value={code}>
            {financeDepartmentName(code, department)}
          </option>
        ))}
      </FilterSelectField>
      <FilterSelectField
        label={t('budgetPlan.filtersPlanning.stage')}
        onChange={(value) => set('stage', value as AnnualProposalFilters['stage'])}
        value={draft.stage}
      >
        <option value='all'>{t('ui.all')}</option>
        {proposalStages.map((stage) => (
          <option key={stage} value={stage}>
            {t(`budgetPlan.stage.${stage}`)}
          </option>
        ))}
      </FilterSelectField>
      <FilterSelectField
        label={t('budgetPlan.filtersPlanning.budgetStatus')}
        onChange={(value) => set('status', value as AnnualProposalFilters['status'])}
        value={draft.status}
      >
        <option value='all'>{t('ui.all')}</option>
        {proposalStatuses.map((status) => (
          <option key={status} value={status}>
            {t(`budgetPlan.status.${status}`)}
          </option>
        ))}
      </FilterSelectField>
    </FilterPanel>
  )
}
