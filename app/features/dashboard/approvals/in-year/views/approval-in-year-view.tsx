import { CalendarClock, CalendarX2, ClipboardList, Scale } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { AdjustmentListResponseDtoDataItemsItem } from '~/shared/api/generated/model/budget-adjustments/adjustmentListResponseDtoDataItemsItem'
import { useBudgetAdjustmentList } from '~/shared/api/generated/operations/budget-adjustments/budget-adjustment-list'
import { useBudgetReviewPeriodList } from '~/shared/api/generated/operations/budget-review-periods/budget-review-period-list'
import { useDashboardFormat } from '../../../dashboard-ui'
import {
  ApprovalsPage,
  ApprovalsPagination,
  ApprovalsSection,
  ApprovalsSelect,
  ApprovalsStatus,
  ApprovalsToolbar
} from '../../shared/components/approvals-ui'
import { ApprovalsSegmented } from '../../shared/components/approvals-segmented'
import { useBudgetYearOptions } from '../../shared/hooks/use-budget-year-options'
import { ApprovalsQueryState } from '../../shared/components/approvals-query-state'
import { ApprovalsTable } from '../../shared/components/approvals-table'
import { formatMoney } from '../../shared/approvals-money'
import type { ApprovalBudgetViewProps } from '../../annual-budget/budget-view-props'
import { AdjustmentDecisionDialog } from '../components/adjustment-decision'
import { ADJUSTMENT_ID_PREFIX, AdjustmentById } from '../components/adjustment-by-id'
import { DeadlineEvents } from '../components/deadline-events'
import { ReviewPeriodDetail } from '../components/review-period-detail'
import { adjustmentState, IN_YEAR_SECTIONS, type AdjustmentState, type InYearSection } from '../enums/in-year'

const SECTION_ICONS = { adjustments: Scale, periods: ClipboardList, deadlines: CalendarX2 } as const

const isSection = (value: string | undefined): value is InYearSection =>
  (IN_YEAR_SECTIONS as readonly string[]).includes(value ?? '')

/** The API takes a four-digit year; anything else in the box means "every year". */
const parseYear = (value: string): number | undefined => {
  const year = Number(value)
  return /^\d{4}$/.test(value) && year >= 2000 && year <= 2999 ? year : undefined
}

/** Only `id` reaches the screen, so the section rides in it: `section:periods`, `period:<id>` for one review period, or `adjustment:<id>` for one adjustment. */
export function ApprovalInYearView(props: ApprovalBudgetViewProps) {
  const { t: translate } = useTranslation('approvalsBudget')
  if (props.itemId?.startsWith('period:'))
    return <ReviewPeriodDetail {...props} key={props.itemId} itemId={props.itemId.slice('period:'.length)} />
  if (props.itemId?.startsWith(ADJUSTMENT_ID_PREFIX))
    return (
      <AdjustmentById
        key={props.itemId}
        id={props.itemId.slice(ADJUSTMENT_ID_PREFIX.length)}
        onBack={() => props.onSelectTab('in-year', { id: 'section:adjustments' })}
      />
    )
  const requested = props.itemId?.startsWith('section:') ? props.itemId.slice('section:'.length) : undefined
  const section: InYearSection = isSection(requested) ? requested : 'adjustments'
  return (
    <ApprovalsPage icon={CalendarClock} title={translate('inYear.title')} description={translate('inYear.description')}>
      <ApprovalsSegmented
        label={translate('inYear.title')}
        value={section}
        onChange={(item) => props.onSelectTab('in-year', { id: `section:${item}` })}
        items={IN_YEAR_SECTIONS.map((item) => ({
          key: item,
          label: translate(`inYear.${item}`),
          icon: SECTION_ICONS[item]
        }))}
      />
      {section === 'adjustments' && <AdjustmentList />}
      {section === 'periods' && <PeriodList onOpen={(id) => props.onSelectTab('in-year', { id: `period:${id}` })} />}
      {section === 'deadlines' && <DeadlineEvents />}
    </ApprovalsPage>
  )
}

type Center = AdjustmentListResponseDtoDataItemsItem['from']

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

function AdjustmentList() {
  const { t: translate, i18n } = useTranslation('approvalsBudget')
  const { formatDateTime } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const [state, setState] = useState<AdjustmentState | ''>(adjustmentState.PENDING)
  const [yearText, setYearText] = useState('')
  const [deciding, setDeciding] = useState<AdjustmentListResponseDtoDataItemsItem | null>(null)
  const year = parseYear(yearText)
  const query = useBudgetAdjustmentList({
    ...(state ? { state } : {}),
    ...(year ? { year } : {}),
    page,
    pageSize: 20
  })
  const center = (value: Center) => (value ? `${value.code} · ${value.name}` : translate('inYear.none'))
  return (
    <ApprovalsSection title={translate('inYear.adjustments')} description={translate('inYear.adjustmentsNote')}>
      <ApprovalsToolbar>
        <div className='w-full sm:w-56'>
          <ApprovalsSelect
            label={translate('state')}
            value={state}
            options={[
              { value: '', label: translate('inYear.allStates') },
              ...Object.values(adjustmentState).map((value) => ({ value, label: translate(`inYear.states.${value}`) }))
            ]}
            onChange={(selected) => {
              setState(Object.values(adjustmentState).find((value) => value === selected) ?? '')
              setPage(1)
            }}
          />
        </div>
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
          rowKey={(adjustment) => adjustment.id}
          onOpen={(adjustment) => {
            if (adjustment.state === adjustmentState.PENDING) setDeciding(adjustment)
          }}
          columns={[
            {
              key: 'kind',
              label: translate('inYear.kind'),
              render: (row) => (
                <span>
                  {translate(`inYear.kinds.${row.kind}`)}
                  {row.transferReason && (
                    <span className='block text-xs text-muted-foreground'>
                      {translate(`inYear.transferReasons.${row.transferReason}`)}
                    </span>
                  )}
                </span>
              )
            },
            { key: 'year', label: translate('year'), numeric: true, align: 'center', render: (row) => row.year },
            { key: 'from', label: translate('inYear.from'), render: (row) => center(row.from) },
            { key: 'to', label: translate('inYear.to'), render: (row) => center(row.to) },
            {
              key: 'amount',
              label: translate('inYear.amount'),
              numeric: true,
              render: (row) => formatMoney(row.amount, i18n.language)
            },
            {
              key: 'reason',
              label: translate('inYear.createdReason'),
              render: (row) => <span title={row.reason}>{row.reason}</span>
            },
            {
              key: 'createdBy',
              label: translate('inYear.createdBy'),
              render: (row) => (
                <span>
                  {row.createdBy?.fullName ?? translate('inYear.none')}
                  <span className='block text-xs text-muted-foreground'>{formatDateTime(row.createdAt)}</span>
                </span>
              )
            },
            { key: 'state', label: translate('state'), render: (row) => <ApprovalsStatus value={row.state} /> },
            {
              key: 'decision',
              label: translate('inYear.decidedBy'),
              render: (row) =>
                row.decidedAt ? (
                  <span>
                    {row.decidedBy?.fullName ?? translate('inYear.none')}
                    <span className='block text-xs text-muted-foreground'>{formatDateTime(row.decidedAt)}</span>
                    {row.decisionReason && (
                      <span className='block text-xs text-muted-foreground' title={row.decisionReason}>
                        {row.decisionReason}
                      </span>
                    )}
                    {row.createdVersionId && (
                      <span className='block text-xs text-muted-foreground'>{translate('inYear.versionCreated')}</span>
                    )}
                  </span>
                ) : (
                  translate('inYear.none')
                )
            }
          ]}
        />
        <ApprovalsPagination pagination={query.data?.data?.pagination} onPageChange={setPage} />
      </ApprovalsQueryState>
      {deciding && <AdjustmentDecisionDialog adjustment={deciding} onClose={() => setDeciding(null)} />}
    </ApprovalsSection>
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
