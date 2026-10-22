import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { BudgetOpinion, BudgetQuestion } from '../finance-data'
import { FilterPanel, FilterSearchField, FilterSelectField } from './filter-panel'

type QuestionStatus = BudgetQuestion['status']

export interface BudgetQuestionFilters {
  costCenter: string
  /** Only answered requests carry an opinion. */
  opinion: 'all' | BudgetOpinion
  /** Matches the request code, software, requester, asker or question text. */
  search: string
  status: 'all' | QuestionStatus
}

export const defaultBudgetQuestionFilters: BudgetQuestionFilters = {
  costCenter: '',
  opinion: 'all',
  search: '',
  status: 'all'
}

const statuses: readonly QuestionStatus[] = ['OPEN', 'ANSWERED', 'CLOSED_CANCELLED']
const opinions: readonly BudgetOpinion[] = ['WITHIN', 'OVER', 'NO_BUDGET']

export function matchesBudgetQuestionFilters(question: BudgetQuestion, filters: BudgetQuestionFilters) {
  const search = filters.search.trim().toLocaleLowerCase()
  const haystack =
    `${question.requestCode} ${question.software} ${question.requester} ${question.askedBy} ${question.question}`.toLocaleLowerCase()

  return (
    (filters.costCenter === '' || question.costCenter === filters.costCenter) &&
    (search === '' || haystack.includes(search)) &&
    (filters.status === 'all' || question.status === filters.status) &&
    (filters.opinion === 'all' || question.answer?.opinion === filters.opinion)
  )
}

/** Filter bar of FIN-05: choices take effect only when applied; reset restores the defaults. */
export function FinanceBudgetQuestionFilters({
  applied,
  onApply,
  questions
}: {
  applied: BudgetQuestionFilters
  onApply: (filters: BudgetQuestionFilters) => void
  questions: BudgetQuestion[]
}) {
  const { t } = useTranslation('dashboard')
  const [draft, setDraft] = useState(applied)
  const set = <K extends keyof BudgetQuestionFilters>(key: K, value: BudgetQuestionFilters[K]) =>
    setDraft((current) => ({ ...current, [key]: value }))
  const costCenters = [...new Set(questions.map((question) => question.costCenter))].sort()

  return (
    <FilterPanel
      onApply={() => onApply(draft)}
      onReset={() => {
        setDraft(defaultBudgetQuestionFilters)
        onApply(defaultBudgetQuestionFilters)
      }}
      search={
        <FilterSearchField
          label={t('budgetPlan.filtersSpend.questions.search')}
          onChange={(value) => set('search', value)}
          placeholder={t('budgetPlan.filtersSpend.questions.searchPlaceholder')}
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
        label={t('budgetPlan.filtersSpend.status')}
        onChange={(value) => set('status', value as BudgetQuestionFilters['status'])}
        value={draft.status}
      >
        <option value='all'>{t('ui.all')}</option>
        {statuses.map((status) => (
          <option key={status} value={status}>
            {t(`finance.questions.status.${status}`)}
          </option>
        ))}
      </FilterSelectField>
      <FilterSelectField
        label={t('budgetPlan.filtersSpend.questions.opinion')}
        onChange={(value) => set('opinion', value as BudgetQuestionFilters['opinion'])}
        value={draft.opinion}
      >
        <option value='all'>{t('ui.all')}</option>
        {opinions.map((opinion) => (
          <option key={opinion} value={opinion}>
            {t(`finance.opinion.${opinion}`)}
          </option>
        ))}
      </FilterSelectField>
    </FilterPanel>
  )
}
