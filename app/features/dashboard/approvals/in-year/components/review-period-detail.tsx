import { ArrowLeft, ClipboardList } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useBudgetReviewPeriodGet } from '~/shared/api/generated/operations/budget-review-periods/budget-review-period-get'
import { useDashboardFormat } from '../../../dashboard-ui'
import {
  ApprovalsButton,
  ApprovalsEmpty,
  ApprovalsPage,
  ApprovalsPagination,
  ApprovalsSection,
  ApprovalsStat,
  ApprovalsStatGrid
} from '../../shared/components/approvals-ui'
import { ApprovalsQueryState } from '../../shared/components/approvals-query-state'
import { formatMoney } from '../../shared/approvals-money'
import type { ApprovalBudgetViewProps } from '../../annual-budget/budget-view-props'
import { ReviewLineCard } from './review-line-card'

type Money = { amount: string; currency: string }

const isNonZero = (value: Money) => Number(value.amount) !== 0

/**
 * Read-only review of one closed month. The lines arrive worst first (red, yellow, under, green); the light is only a
 * dot beside the Cost Center. The figures are the picture taken when Finance closed the month; Finance signs it.
 */
export function ReviewPeriodDetail({ itemId, onSelectTab }: ApprovalBudgetViewProps & { itemId: string }) {
  const { t: translate, i18n } = useTranslation('approvalsBudget')
  const { formatDate, formatDateTime } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const query = useBudgetReviewPeriodGet(itemId, { page, pageSize: 50 })
  const data = query.data?.data
  const period = data?.period
  const company = period?.company
  const money = (value: Money) => formatMoney(value, i18n.language)
  const lines = data?.items ?? []
  const hasLateChanges = lines.some((line) => isNonZero(line.changedAfterSnapshot))
  const person = (who: { fullName: string; employeeCode: string } | null) =>
    who ? `${who.fullName} (${who.employeeCode})` : translate('inYear.none')

  return (
    <ApprovalsPage
      icon={ClipboardList}
      eyebrow={translate('inYear.periods')}
      title={
        period
          ? translate('inYear.periodTitle', { month: period.month, year: period.year })
          : translate('inYear.periods')
      }
      description={translate('inYear.periodDescription')}
      actions={
        <ApprovalsButton variant='ghost' onClick={() => onSelectTab('in-year', { id: 'section:periods' })}>
          <ArrowLeft aria-hidden className='size-4' strokeWidth={1.5} />
          {translate('inYear.back')}
        </ApprovalsButton>
      }
    >
      <ApprovalsQueryState query={query}>
        {period && (
          <ApprovalsStatGrid>
            <ApprovalsStat
              label={translate('inYear.period')}
              value={`${translate(`inYear.periodKinds.${period.kind}`)} · ${period.month}/${period.year}`}
            />
            <ApprovalsStat label={translate('state')} value={translate(`inYear.periodStates.${period.state}`)} />
            <ApprovalsStat
              label={translate('inYear.closedBy')}
              value={`${person(period.closedBy)} · ${formatDateTime(period.closedAt)}`}
            />
            {period.kind === 'QUARTER' && (
              <ApprovalsStat
                label={translate('inYear.explanationsDueOn')}
                value={period.explanationsDueOn ? formatDate(period.explanationsDueOn) : translate('inYear.none')}
              />
            )}
            <ApprovalsStat
              label={translate('inYear.signedBy')}
              value={
                period.signedAt
                  ? `${person(period.signedBy)} · ${formatDateTime(period.signedAt)}`
                  : translate('inYear.notSigned')
              }
            />
            {period.note && <ApprovalsStat label={translate('inYear.note')} value={period.note} />}
          </ApprovalsStatGrid>
        )}

        {company && (
          <ApprovalsSection title={translate('inYear.companyTitle')}>
            <ApprovalsStatGrid>
              <ApprovalsStat
                label={translate('inYear.annualCeiling')}
                value={company.annualCeiling ? money(company.annualCeiling) : translate('inYear.none')}
              />
              <ApprovalsStat label={translate('inYear.companySpent')} value={money(company.spent)} />
              <ApprovalsStat
                label={translate('inYear.sharedPoolUnallocated')}
                value={money(company.sharedPoolUnallocated)}
                emphasis={company.sharedPoolOverReserve === true}
              />
              <ApprovalsStat
                label={translate('inYear.sharedPoolReserve')}
                value={company.sharedPoolReserve ? money(company.sharedPoolReserve) : translate('inYear.none')}
              />
            </ApprovalsStatGrid>
            {company.sharedPoolOverReserve === true && (
              <p role='status' className='text-sm text-warning-ink'>
                {translate('inYear.sharedPoolOver')}
              </p>
            )}
          </ApprovalsSection>
        )}

        <ApprovalsSection title={translate('inYear.linesTitle')} description={translate('inYear.linesNote')}>
          {hasLateChanges && (
            <p role='status' className='text-sm text-warning-ink'>
              {translate('inYear.changedAfterSnapshotNote')}
            </p>
          )}
          {lines.length === 0 && <ApprovalsEmpty message={translate('layout.linesEmpty')} />}
          <ul className='space-y-4'>
            {lines.map((line) => (
              <ReviewLineCard key={line.id} line={line} />
            ))}
          </ul>
          <ApprovalsPagination pagination={data?.pagination} onPageChange={setPage} />
        </ApprovalsSection>
      </ApprovalsQueryState>
    </ApprovalsPage>
  )
}
