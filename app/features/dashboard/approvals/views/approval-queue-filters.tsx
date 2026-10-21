import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { AnnualProposal, BudgetCheckResult } from '../../finance/annual-budget-data'
import { FilterPanel, FilterSearchField, FilterSelectField } from '../../finance/views/filter-panel'
import { budgetCheckResults, queueBudgetCheck } from '../approval-budget-check'
import { approverNow, type QueueItem, type QueueItemKind } from '../approvals-data'

/* ---------- SaaS spend queue (APV-01 "Khoản chi SaaS") ---------- */

export type QueueKindGroup = 'charges' | 'renewals' | 'requests'
export type QueueSlaState = 'onTime' | 'overdue' | 'soon'

export interface ApprovalQueueFilters {
  check: 'all' | BudgetCheckResult
  /** Cost Center code; '' = every Cost Center. */
  costCenter: string
  kind: 'all' | QueueKindGroup
  /** Matches the reference, the software or the subtitle (requester, department, vendor). */
  search: string
  sla: 'all' | QueueSlaState
}

export const defaultApprovalQueueFilters: ApprovalQueueFilters = {
  check: 'all',
  costCenter: '',
  kind: 'all',
  search: '',
  sla: 'all'
}

const kindGroups: Record<QueueKindGroup, readonly QueueItemKind[]> = {
  charges: ['CHARGE', 'FINDING'],
  renewals: ['RENEWAL'],
  requests: ['SPEND_STEP', 'NEED_STEP']
}
const kindGroupOrder: readonly QueueKindGroup[] = ['requests', 'renewals', 'charges']
const slaStates: readonly QueueSlaState[] = ['overdue', 'soon', 'onTime']

export function getSlaHoursLeft(item: Pick<QueueItem, 'slaDueAt'>) {
  return Math.round((new Date(item.slaDueAt).getTime() - new Date(approverNow).getTime()) / 3_600_000)
}

/** Same rule as the SLA badge: overdue below zero, due soon within 8 hours. */
export function queueSlaState(item: Pick<QueueItem, 'slaDueAt'>): QueueSlaState {
  const hoursLeft = getSlaHoursLeft(item)
  if (hoursLeft < 0) return 'overdue'
  return hoursLeft <= 8 ? 'soon' : 'onTime'
}

export function matchesApprovalQueueFilters(item: QueueItem, filters: ApprovalQueueFilters) {
  const search = filters.search.trim().toLocaleLowerCase()
  const haystack = `${item.reference} ${item.software} ${item.subtitle}`.toLocaleLowerCase()

  return (
    (search === '' || haystack.includes(search)) &&
    (filters.kind === 'all' || kindGroups[filters.kind].includes(item.kind)) &&
    (filters.check === 'all' || queueBudgetCheck(item) === filters.check) &&
    (filters.costCenter === '' || item.costCenter === filters.costCenter) &&
    (filters.sla === 'all' || queueSlaState(item) === filters.sla)
  )
}

/** Filter bar of APV-01 (SaaS spend): choices take effect only when applied; reset restores the defaults. */
export function ApprovalQueueFiltersPanel({
  applied,
  items,
  onApply
}: {
  applied: ApprovalQueueFilters
  items: QueueItem[]
  onApply: (filters: ApprovalQueueFilters) => void
}) {
  const { t } = useTranslation('dashboard')
  const [draft, setDraft] = useState(applied)
  const set = <K extends keyof ApprovalQueueFilters>(key: K, value: ApprovalQueueFilters[K]) =>
    setDraft((current) => ({ ...current, [key]: value }))
  const costCenters = [...new Set(items.map((item) => item.costCenter))].sort()

  return (
    <FilterPanel
      onApply={() => onApply(draft)}
      onReset={() => {
        setDraft(defaultApprovalQueueFilters)
        onApply(defaultApprovalQueueFilters)
      }}
      search={
        <FilterSearchField
          label={t('budgetPlan.filtersApproverQueue.queue.search')}
          onChange={(value) => set('search', value)}
          placeholder={t('budgetPlan.filtersApproverQueue.queue.searchPlaceholder')}
          value={draft.search}
        />
      }
    >
      <FilterSelectField
        label={t('budgetPlan.filtersApproverQueue.queue.kind')}
        onChange={(value) => set('kind', value as ApprovalQueueFilters['kind'])}
        value={draft.kind}
      >
        <option value='all'>{t('ui.all')}</option>
        {kindGroupOrder.map((group) => (
          <option key={group} value={group}>
            {t(`approvals.queue.filter.${group}`)}
          </option>
        ))}
      </FilterSelectField>
      <FilterSelectField
        label={t('budgetPlan.filtersApproverQueue.queue.check')}
        onChange={(value) => set('check', value as ApprovalQueueFilters['check'])}
        value={draft.check}
      >
        <option value='all'>{t('ui.all')}</option>
        {budgetCheckResults.map((result) => (
          <option key={result} value={result}>
            {t(`budgetPlan.approverSpend.result.${result}`)}
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
      <FilterSelectField
        label={t('budgetPlan.filtersApproverQueue.queue.sla')}
        onChange={(value) => set('sla', value as ApprovalQueueFilters['sla'])}
        value={draft.sla}
      >
        <option value='all'>{t('ui.all')}</option>
        {slaStates.map((state) => (
          <option key={state} value={state}>
            {t(`budgetPlan.filtersApproverQueue.queue.slaState.${state}`)}
          </option>
        ))}
      </FilterSelectField>
    </FilterPanel>
  )
}

/* ---------- Annual budget files (APV-01 "Ngân sách năm") ---------- */

export interface ApprovalAnnualFilters {
  /** Department name; '' = every department. */
  department: string
  /** Matches the department or the Cost Center. */
  search: string
}

export const defaultApprovalAnnualFilters: ApprovalAnnualFilters = { department: '', search: '' }

export function matchesApprovalAnnualFilters(proposal: AnnualProposal, filters: ApprovalAnnualFilters) {
  const search = filters.search.trim().toLocaleLowerCase()
  const haystack = `${proposal.department} ${proposal.costCenter}`.toLocaleLowerCase()

  return (
    (search === '' || haystack.includes(search)) &&
    (filters.department === '' || proposal.department === filters.department)
  )
}

export function ApprovalAnnualFiltersPanel({
  applied,
  onApply,
  proposals
}: {
  applied: ApprovalAnnualFilters
  onApply: (filters: ApprovalAnnualFilters) => void
  proposals: AnnualProposal[]
}) {
  const { t } = useTranslation('dashboard')
  const [draft, setDraft] = useState(applied)
  const departments = [...new Set(proposals.map((proposal) => proposal.department))].sort((a, b) => a.localeCompare(b))

  return (
    <FilterPanel
      onApply={() => onApply(draft)}
      onReset={() => {
        setDraft(defaultApprovalAnnualFilters)
        onApply(defaultApprovalAnnualFilters)
      }}
      search={
        <FilterSearchField
          label={t('budgetPlan.filtersApproverQueue.annual.search')}
          onChange={(value) => setDraft((current) => ({ ...current, search: value }))}
          placeholder={t('budgetPlan.filtersApproverQueue.annual.searchPlaceholder')}
          value={draft.search}
        />
      }
    >
      <FilterSelectField
        label={t('budgetPlan.filtersApproverQueue.annual.department')}
        onChange={(value) => setDraft((current) => ({ ...current, department: value }))}
        value={draft.department}
      >
        <option value=''>{t('budgetPlan.filtersApproverQueue.annual.allDepartments')}</option>
        {departments.map((department) => (
          <option key={department} value={department}>
            {department}
          </option>
        ))}
      </FilterSelectField>
    </FilterPanel>
  )
}
