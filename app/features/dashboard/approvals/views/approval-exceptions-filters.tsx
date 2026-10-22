import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { actionsNeedingApproval, type BudgetCheckResult, type ExceptionAction } from '../../finance/annual-budget-data'
import { FilterPanel, FilterSearchField, FilterSelectField } from '../../finance/views/filter-panel'
import type { ApprovalStatus } from './approval-exception-detail'

export type ExceptionItemType = 'adjustments' | 'exceptions'
type ExceptionKind = Exclude<BudgetCheckResult, 'PASSED'>
export type AdjustmentDirection = 'decrease' | 'increase'
type DecisionState = 'decided' | 'pending'

export interface ApprovalExceptionFilters {
  costCenter: string
  /** Adjustments only. */
  direction: 'all' | AdjustmentDirection
  /** Exceptions only. */
  kind: 'all' | ExceptionKind
  /** Exceptions only: the option Finance chose. */
  option: 'all' | ExceptionAction
  /** Matches the case code, the software, the cost center and the reason or note. */
  search: string
  state: 'all' | DecisionState
}

/** The list opens on the cases still waiting for a decision. */
export const defaultApprovalExceptionFilters: ApprovalExceptionFilters = {
  costCenter: '',
  direction: 'all',
  kind: 'all',
  option: 'all',
  search: '',
  state: 'pending'
}

/** What the filters look at for one exception or adjustment row. */
export interface ApprovalExceptionFacts {
  costCenter: string
  direction?: AdjustmentDirection
  exceptionKind?: ExceptionKind
  action?: ExceptionAction
  /** Text the search bar matches against. */
  searchText: string
  status: ApprovalStatus
}

const states: readonly DecisionState[] = ['pending', 'decided']
const kinds: readonly ExceptionKind[] = ['INSUFFICIENT', 'OUT_OF_CATALOG', 'CC_EXPIRED']
const directions: readonly AdjustmentDirection[] = ['increase', 'decrease']

export function matchesApprovalExceptionFilters(
  facts: ApprovalExceptionFacts,
  filters: ApprovalExceptionFilters,
  type: ExceptionItemType
) {
  const search = filters.search.trim().toLocaleLowerCase()
  const decided = facts.status !== 'pending'
  const matchesState = filters.state === 'all' || (filters.state === 'decided') === decided
  const matchesType =
    type === 'exceptions'
      ? (filters.kind === 'all' || facts.exceptionKind === filters.kind) &&
        (filters.option === 'all' || facts.action === filters.option)
      : filters.direction === 'all' || facts.direction === filters.direction

  return (
    matchesState &&
    matchesType &&
    (filters.costCenter === '' || facts.costCenter === filters.costCenter) &&
    (search === '' || facts.searchText.toLocaleLowerCase().includes(search))
  )
}

/** Filter bar of APV-07: choices take effect only when applied; reset restores the defaults. */
export function ApprovalExceptionsFilters({
  applied,
  costCenters,
  onApply,
  type
}: {
  applied: ApprovalExceptionFilters
  costCenters: string[]
  onApply: (filters: ApprovalExceptionFilters) => void
  type: ExceptionItemType
}) {
  const { t } = useTranslation('dashboard')
  const [draft, setDraft] = useState(applied)
  const set = <K extends keyof ApprovalExceptionFilters>(key: K, value: ApprovalExceptionFilters[K]) =>
    setDraft((current) => ({ ...current, [key]: value }))

  return (
    <FilterPanel
      onApply={() => onApply(draft)}
      onReset={() => {
        setDraft(defaultApprovalExceptionFilters)
        onApply(defaultApprovalExceptionFilters)
      }}
      search={
        <FilterSearchField
          label={t('budgetPlan.filtersApproverDecisions.exceptions.search')}
          onChange={(value) => set('search', value)}
          placeholder={t('budgetPlan.filtersApproverDecisions.exceptions.searchPlaceholder')}
          value={draft.search}
        />
      }
    >
      <FilterSelectField
        label={t('budgetPlan.filtersApproverDecisions.exceptions.status')}
        onChange={(value) => set('state', value as ApprovalExceptionFilters['state'])}
        value={draft.state}
      >
        <option value='all'>{t('budgetPlan.filtersApproverDecisions.exceptions.allStatuses')}</option>
        {states.map((state) => (
          <option key={state} value={state}>
            {t(`budgetPlan.approverExceptions.state.${state}`)}
          </option>
        ))}
      </FilterSelectField>
      <FilterSelectField
        label={t('budgetPlan.filtersApproverDecisions.exceptions.costCenter')}
        onChange={(value) => set('costCenter', value)}
        value={draft.costCenter}
      >
        <option value=''>{t('budgetPlan.filtersApproverDecisions.exceptions.allCostCenters')}</option>
        {costCenters.map((code) => (
          <option key={code} value={code}>
            {code}
          </option>
        ))}
      </FilterSelectField>
      {type === 'exceptions' ? (
        <>
          <FilterSelectField
            label={t('budgetPlan.filtersApproverDecisions.exceptions.kind')}
            onChange={(value) => set('kind', value as ApprovalExceptionFilters['kind'])}
            value={draft.kind}
          >
            <option value='all'>{t('budgetPlan.filtersApproverDecisions.exceptions.allKinds')}</option>
            {kinds.map((kind) => (
              <option key={kind} value={kind}>
                {t(`budgetPlan.check.result.${kind}`)}
              </option>
            ))}
          </FilterSelectField>
          <FilterSelectField
            label={t('budgetPlan.filtersApproverDecisions.exceptions.option')}
            onChange={(value) => set('option', value as ApprovalExceptionFilters['option'])}
            value={draft.option}
          >
            <option value='all'>{t('budgetPlan.filtersApproverDecisions.exceptions.allOptions')}</option>
            {actionsNeedingApproval.map((action) => (
              <option key={action} value={action}>
                {t(`budgetPlan.exceptions.action.${action}`)}
              </option>
            ))}
          </FilterSelectField>
        </>
      ) : (
        <FilterSelectField
          label={t('budgetPlan.filtersApproverDecisions.exceptions.direction')}
          onChange={(value) => set('direction', value as ApprovalExceptionFilters['direction'])}
          value={draft.direction}
        >
          <option value='all'>{t('budgetPlan.filtersApproverDecisions.exceptions.allDirections')}</option>
          {directions.map((direction) => (
            <option key={direction} value={direction}>
              {t(`budgetPlan.filtersApproverDecisions.exceptions.directionValue.${direction}`)}
            </option>
          ))}
        </FilterSelectField>
      )}
    </FilterPanel>
  )
}
