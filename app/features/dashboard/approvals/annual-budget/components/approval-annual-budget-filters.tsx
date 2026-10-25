import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { AnnualProposal, ProposalStage } from '../../../finance/annual-budget-data'
import { FilterPanel, FilterSearchField, FilterSelectField } from '../../../finance/shared/components/filter-panel'

export type DecisionStage = Extract<ProposalStage, 'APPROVED' | 'REJECTED' | 'RETURNED' | 'SENT'>

export const decisionStages: readonly DecisionStage[] = ['SENT', 'APPROVED', 'RETURNED', 'REJECTED']

export interface AnnualBudgetFilters {
  department: string
  /** Matches the department, the cost center or the manager. */
  search: string
  stage: 'all' | DecisionStage
  /** Budget year as text; '' = every year. */
  year: string
}

/** The list opens on the budgets still waiting for a decision. */
export const defaultAnnualBudgetFilters: AnnualBudgetFilters = {
  department: '',
  search: '',
  stage: 'SENT',
  year: ''
}

export function matchesAnnualBudgetFilters(proposal: AnnualProposal, filters: AnnualBudgetFilters) {
  const search = filters.search.trim().toLocaleLowerCase()
  const haystack = `${proposal.department} ${proposal.costCenter} ${proposal.manager}`.toLocaleLowerCase()

  return (
    (filters.stage === 'all' || proposal.stage === filters.stage) &&
    (filters.department === '' || proposal.department === filters.department) &&
    (filters.year === '' || proposal.year === Number(filters.year)) &&
    (search === '' || haystack.includes(search))
  )
}

/** Filter bar of APV-05: choices take effect only when applied; reset restores the defaults. */
export function ApprovalAnnualBudgetFilters({
  applied,
  onApply,
  proposals
}: {
  applied: AnnualBudgetFilters
  onApply: (filters: AnnualBudgetFilters) => void
  proposals: AnnualProposal[]
}) {
  const { t } = useTranslation('dashboard')
  const [draft, setDraft] = useState(applied)
  const set = <K extends keyof AnnualBudgetFilters>(key: K, value: AnnualBudgetFilters[K]) =>
    setDraft((current) => ({ ...current, [key]: value }))
  const departments = [...new Set(proposals.map((proposal) => proposal.department))].sort((a, b) => a.localeCompare(b))
  const years = [...new Set(proposals.map((proposal) => proposal.year))].sort((a, b) => b - a)

  return (
    <FilterPanel
      onApply={() => onApply(draft)}
      onReset={() => {
        setDraft(defaultAnnualBudgetFilters)
        onApply(defaultAnnualBudgetFilters)
      }}
      search={
        <FilterSearchField
          label={t('budgetPlan.filtersApproverDecisions.annual.search')}
          onChange={(value) => set('search', value)}
          placeholder={t('budgetPlan.filtersApproverDecisions.annual.searchPlaceholder')}
          value={draft.search}
        />
      }
    >
      <FilterSelectField
        label={t('budgetPlan.filtersApproverDecisions.annual.stage')}
        onChange={(value) => set('stage', value as AnnualBudgetFilters['stage'])}
        value={draft.stage}
      >
        <option value='all'>{t('budgetPlan.filtersApproverDecisions.annual.allStages')}</option>
        {decisionStages.map((stage) => (
          <option key={stage} value={stage}>
            {t(`budgetPlan.stage.${stage}`)}
          </option>
        ))}
      </FilterSelectField>
      <FilterSelectField
        label={t('budgetPlan.filtersApproverDecisions.annual.department')}
        onChange={(value) => set('department', value)}
        value={draft.department}
      >
        <option value=''>{t('budgetPlan.filtersApproverDecisions.annual.allDepartments')}</option>
        {departments.map((department) => (
          <option key={department} value={department}>
            {department}
          </option>
        ))}
      </FilterSelectField>
      <FilterSelectField
        label={t('budgetPlan.filtersApproverDecisions.annual.year')}
        onChange={(value) => set('year', value)}
        value={draft.year}
      >
        <option value=''>{t('budgetPlan.filtersApproverDecisions.annual.allYears')}</option>
        {years.map((year) => (
          <option key={year} value={String(year)}>
            {year}
          </option>
        ))}
      </FilterSelectField>
    </FilterPanel>
  )
}
