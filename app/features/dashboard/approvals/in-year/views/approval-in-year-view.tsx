import { CalendarClock } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useBudgetReviewPeriodList } from '~/shared/api/generated/operations/budget-review-periods/budget-review-period-list'
import { useDashboardFormat } from '../../../dashboard-ui'
import {
  ApprovalsPage,
  ApprovalsPagination,
  ApprovalsSection,
  ApprovalsSelect,
  ApprovalsToolbar
} from '../../shared/components/approvals-ui'
import { useBudgetYearOptions } from '../../shared/hooks/use-budget-year-options'
import { ApprovalsQueryState } from '../../shared/components/approvals-query-state'
import { ApprovalsTable } from '../../shared/components/approvals-table'
import { formatMoney } from '../../shared/approvals-money'
import type { ApprovalBudgetViewProps } from '../../annual-budget/budget-view-props'
import { ReviewPeriodDetail } from '../components/review-period-detail'

/** The API takes a four-digit year; anything else in the box means "every year". */
const parseYear = (value: string): number | undefined => {
  const year = Number(value)
  return /^\d{4}$/.test(value) && year >= 2000 && year <= 2999 ? year : undefined
}

/** A period detail uses `period:<id>`; all other links open the review list. */
export function ApprovalInYearView(props: ApprovalBudgetViewProps) {
  const { t: translate } = useTranslation('approvalsBudget')
  if (props.itemId?.startsWith('period:'))
    return <ReviewPeriodDetail {...props} key={props.itemId} itemId={props.itemId.slice('period:'.length)} />
  return (
    <ApprovalsPage icon={CalendarClock} title={translate('inYear.title')} description={translate('inYear.description')}>
      <PeriodList onOpen={(id) => props.onSelectTab('in-year', { id: `period:${id}` })} />
    </ApprovalsPage>
  )
}

function YearFilter({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const { t: translate } = useTranslation('approvalsBudget')
  const years = useBudgetYearOptions()
  return (
    <div className='w-full sm:w-48'>
      <ApprovalsSelect
        label={translate('year')}
        value={value}
        placeholder={translate('layout.yearPlaceholder')}
        options={[{ value: '', label: translate('inYear.allYears') }, ...years.options]}
        onChange={onChange}
      />
    </div>
  )
}

function PeriodList({ onOpen }: { onOpen: (id: string) => void }) {
  const { t: translate, i18n } = useTranslation('approvalsBudget')
  const { formatDate, formatDateTime } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const [yearText, setYearText] = useState('')
  const year = parseYear(yearText)
  const query = useBudgetReviewPeriodList({ ...(year ? { year } : {}), page, pageSize: 20 })
  const person = (who: { fullName: string } | null) => who?.fullName ?? translate('inYear.none')
  return (
    <ApprovalsSection title={translate('inYear.periods')} description={translate('inYear.periodsNote')}>
      <ApprovalsToolbar>
        <YearFilter
          value={yearText}
          onChange={(value) => {
            setYearText(value)
            setPage(1)
          }}
        />
      </ApprovalsToolbar>
      <ApprovalsQueryState query={query}>
        <ApprovalsTable
          items={query.data?.data?.items ?? []}
          rowKey={(period) => period.id}
          onOpen={(period) => onOpen(period.id)}
          columns={[
            {
              key: 'period',
              label: translate('inYear.period'),
              render: (period) => `${period.month}/${period.year} · ${translate(`inYear.periodKinds.${period.kind}`)}`
            },
            {
              key: 'state',
              label: translate('state'),
              render: (period) => translate(`inYear.periodStates.${period.state}`)
            },
            {
              key: 'closed',
              label: translate('inYear.closedBy'),
              render: (period) => (
                <span>
                  {person(period.closedBy)}
                  <span className='block text-xs text-muted-foreground'>{formatDateTime(period.closedAt)}</span>
                </span>
              )
            },
            {
              key: 'due',
              label: translate('inYear.explanationsDueOn'),
              numeric: true,
              align: 'center',
              render: (period) => (period.explanationsDueOn ? formatDate(period.explanationsDueOn) : '—')
            },
            {
              key: 'signed',
              label: translate('inYear.signedBy'),
              render: (period) =>
                period.signedAt ? (
                  <span>
                    {person(period.signedBy)}
                    <span className='block text-xs text-muted-foreground'>{formatDateTime(period.signedAt)}</span>
                    {period.note && (
                      <span className='block text-xs text-muted-foreground' title={period.note}>
                        {period.note}
                      </span>
                    )}
                  </span>
                ) : (
                  translate('inYear.notSigned')
                )
            },
            {
              key: 'spent',
              label: translate('inYear.companySpent'),
              numeric: true,
              render: (period) => (period.company ? formatMoney(period.company.spent, i18n.language) : '—')
            },
            {
              key: 'pool',
              label: translate('inYear.sharedPoolUnallocated'),
              numeric: true,
              render: (period) =>
                period.company ? (
                  <span className={period.company.sharedPoolOverReserve === true ? 'text-warning-ink' : undefined}>
                    {formatMoney(period.company.sharedPoolUnallocated, i18n.language)}
                    {period.company.sharedPoolOverReserve === true && (
                      <span className='block text-xs'>{translate('inYear.overReserveShort')}</span>
                    )}
                  </span>
                ) : (
                  '—'
                )
            }
          ]}
        />
        <ApprovalsPagination pagination={query.data?.data?.pagination} onPageChange={setPage} />
      </ApprovalsQueryState>
    </ApprovalsSection>
  )
}
