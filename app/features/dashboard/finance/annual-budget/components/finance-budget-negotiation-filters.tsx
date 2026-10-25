import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { financeDepartmentName } from '../../finance-demo-labels'

import { proposalTotals, type AnnualProposal, type ProposalStage } from '../../annual-budget-data'
import { FilterPanel, FilterSearchField, FilterSelectField } from '../../shared/components/filter-panel'
import { departmentOptions } from './finance-annual-proposals-filters'

/** CUT = Finance's total is below the Manager's request; KEPT = it is not. */
export type NegotiationDifference = 'CUT' | 'KEPT'

export interface NegotiationFilters {
  /** Cost center code; '' = every department. */
  costCenter: string
  difference: 'all' | NegotiationDifference
  /** Matches the department, cost center or Manager. */
  search: string
  stage: 'all' | ProposalStage
}

export const defaultNegotiationFilters: NegotiationFilters = {
  costCenter: '',
  difference: 'all',
  search: '',
  stage: 'all'
}

const differences: readonly NegotiationDifference[] = ['CUT', 'KEPT']

export function negotiationDifferenceOf(proposal: AnnualProposal): NegotiationDifference {
  const totals = proposalTotals(proposal)
  return totals.total < totals.requested ? 'CUT' : 'KEPT'
}

export function matchesNegotiationFilters(proposal: AnnualProposal, filters: NegotiationFilters) {
  const search = filters.search.trim().toLocaleLowerCase()
  const haystack = `${proposal.department} ${proposal.costCenter} ${proposal.manager}`.toLocaleLowerCase()

  return (
    (filters.costCenter === '' || proposal.costCenter === filters.costCenter) &&
    (search === '' || haystack.includes(search)) &&
    (filters.stage === 'all' || proposal.stage === filters.stage) &&
    (filters.difference === 'all' || negotiationDifferenceOf(proposal) === filters.difference)
  )
}

/** Filter bar of FIN-41: choices take effect only when applied; reset restores the defaults. */
export function FinanceBudgetNegotiationFilters({
  applied,
  onApply,
  proposals,
  stages
}: {
  applied: NegotiationFilters
  onApply: (filters: NegotiationFilters) => void
  proposals: AnnualProposal[]
  /** The stages the negotiation list shows. */
  stages: readonly ProposalStage[]
}) {
  const { t } = useTranslation('dashboard')
  const [draft, setDraft] = useState(applied)
  const set = <K extends keyof NegotiationFilters>(key: K, value: NegotiationFilters[K]) =>
    setDraft((current) => ({ ...current, [key]: value }))

  return (
    <FilterPanel
      onApply={() => onApply(draft)}
      onReset={() => {
        setDraft(defaultNegotiationFilters)
        onApply(defaultNegotiationFilters)
      }}
      search={
        <FilterSearchField
          label={t('budgetPlan.filtersPlanning.negotiation.search')}
          onChange={(value) => set('search', value)}
          placeholder={t('budgetPlan.filtersPlanning.negotiation.searchPlaceholder')}
          value={draft.search}
        />
      }
    >
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
        onChange={(value) => set('stage', value as NegotiationFilters['stage'])}
        value={draft.stage}
      >
        <option value='all'>{t('ui.all')}</option>
        {stages.map((stage) => (
          <option key={stage} value={stage}>
            {t(`budgetPlan.stage.${stage}`)}
          </option>
        ))}
      </FilterSelectField>
      <FilterSelectField
        label={t('budgetPlan.filtersPlanning.negotiation.difference')}
        onChange={(value) => set('difference', value as NegotiationFilters['difference'])}
        value={draft.difference}
      >
        <option value='all'>{t('ui.all')}</option>
        {differences.map((difference) => (
          <option key={difference} value={difference}>
            {t(`budgetPlan.filtersPlanning.negotiation.differenceOption.${difference}`)}
          </option>
        ))}
      </FilterSelectField>
    </FilterPanel>
  )
}
