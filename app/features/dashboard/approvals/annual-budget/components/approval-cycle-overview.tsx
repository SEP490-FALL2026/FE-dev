import { ArrowLeft, CalendarRange } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useBudgetCycleBaseline } from '~/shared/api/generated/operations/budget-cycles/budget-cycle-baseline'
import { useBudgetCycleGet } from '~/shared/api/generated/operations/budget-cycles/budget-cycle-get'
import { useBudgetCycleList } from '~/shared/api/generated/operations/budget-cycles/budget-cycle-list'
import { useBudgetCyclePackage } from '~/shared/api/generated/operations/budget-cycles/budget-cycle-package'
import { useBudgetSummary } from '~/shared/api/generated/operations/budgets/budget-summary'
import { useBudgetTable } from '~/shared/api/generated/operations/budgets/budget-table'
import { ApprovalsQueryState } from '../../shared/components/approvals-query-state'
import { ApprovalsTable } from '../../shared/components/approvals-table'
import {
  ApprovalsButton,
  ApprovalsPage,
  ApprovalsPagination,
  ApprovalsSection,
  ApprovalsStat,
  ApprovalsStatGrid,
  ApprovalsStatus
} from '../../shared/components/approvals-ui'
import { formatMoney } from '../../shared/approvals-money'
import { useDashboardFormat } from '../../../dashboard-ui'
import type { ApprovalBudgetViewProps } from '../budget-view-props'

/** The detail id of a cycle is `cycle:<year>` so it fits the single `id` route parameter. */
export const CYCLE_ID_PREFIX = 'cycle:'

const FOUR_DIGITS = /^\d{4}$/

export function ApprovalCycleList({ onOpen }: { onOpen: (year: number) => void }) {
  const { t: translate, i18n } = useTranslation('approvalsBudget')
  const [page, setPage] = useState(1)
  const query = useBudgetCycleList({ page, pageSize: 20 })
  return (
    <ApprovalsSection title={translate('cycles.tab')} description={translate('cycles.note')}>
      <ApprovalsQueryState query={query}>
        <ApprovalsTable
          items={query.data?.data?.items ?? []}
          rowKey={(cycle) => String(cycle.year)}
          onOpen={(cycle) => onOpen(cycle.year)}
          columns={[
            { key: 'year', label: translate('year'), numeric: true, align: 'center', render: (cycle) => cycle.year },
            { key: 'status', label: translate('state'), render: (cycle) => <CycleStatus value={cycle.status} /> },
            {
              key: 'ceiling',
              label: translate('cycles.annualCeiling'),
              numeric: true,
              render: (cycle) => formatMoney(cycle.annualCeiling, i18n.language)
            },
            {
              key: 'available',
              label: translate('cycles.available'),
              numeric: true,
              render: (cycle) => formatMoney(cycle.available, i18n.language)
            },
            {
              key: 'submission',
              label: translate('cycles.submissionDeadline'),
              numeric: true,
              align: 'center',
              render: (cycle) => cycle.submissionDeadline
            },
            {
              key: 'decision',
              label: translate('cycles.decisionDeadline'),
              numeric: true,
              align: 'center',
              render: (cycle) => cycle.decisionDeadline
            }
          ]}
        />
        <ApprovalsPagination pagination={query.data?.data?.pagination} onPageChange={setPage} />
      </ApprovalsQueryState>
    </ApprovalsSection>
  )
}

export function ApprovalCycleDetail({ itemId, onSelectTab }: ApprovalBudgetViewProps & { itemId: string }) {
  const { t: translate } = useTranslation('approvalsBudget')
  const raw = itemId.slice(CYCLE_ID_PREFIX.length)
  const year = FOUR_DIGITS.test(raw) ? Number(raw) : undefined
  return (
    <ApprovalsPage
      icon={CalendarRange}
      eyebrow={translate('title')}
      title={translate('cycles.detailTitle', { year: raw })}
      actions={
        <ApprovalsButton variant='ghost' onClick={() => onSelectTab('annual-budget')}>
          <ArrowLeft aria-hidden className='size-4' strokeWidth={1.5} />
          {translate('back')}
        </ApprovalsButton>
      }
    >
      {year !== undefined && <CycleDetailContent year={year} />}
    </ApprovalsPage>
  )
}

function CycleDetailContent({ year }: { year: number }) {
  const { t: translate, i18n } = useTranslation('approvalsBudget')
  const { formatDateTime } = useDashboardFormat()
  const cycleQuery = useBudgetCycleGet(year)
  const packageQuery = useBudgetCyclePackage(year)
  const cycle = cycleQuery.data?.data
  const budgetPackage = packageQuery.data?.data
  const money = (value: { amount: string; currency: string } | null | undefined) => formatMoney(value, i18n.language)
  return (
    <>
      <ApprovalsQueryState query={cycleQuery}>
        {cycle && (
          <>
            <ApprovalsStatGrid>
              <ApprovalsStat label={translate('cycles.annualCeiling')} value={money(cycle.annualCeiling)} emphasis />
              <ApprovalsStat label={translate('cycles.sharedPoolReserve')} value={money(cycle.sharedPoolReserve)} />
              <ApprovalsStat label={translate('cycles.available')} value={money(cycle.available)} />
            </ApprovalsStatGrid>
            <div className='flex flex-wrap items-center gap-3 text-sm text-muted-foreground'>
              <CycleStatus value={cycle.status} />
              <span>
                {translate('cycles.deadlines', {
                  submission: cycle.submissionDeadline,
                  decision: cycle.decisionDeadline
                })}
              </span>
              {cycle.openedAt && <span>{translate('cycles.openedAt', { time: formatDateTime(cycle.openedAt) })}</span>}
            </div>
            {cycle.priorities && (
              <p className='max-w-3xl text-sm [text-wrap:pretty] whitespace-pre-line'>{cycle.priorities}</p>
            )}
          </>
        )}
      </ApprovalsQueryState>

      <ApprovalsSection title={translate('cycles.packageTitle')}>
        <ApprovalsQueryState query={packageQuery}>
          {budgetPackage && (
            <div className='space-y-4'>
              <ApprovalsStatGrid>
                <ApprovalsStat label={translate('cycles.available')} value={money(budgetPackage.available)} />
                <ApprovalsStat label={translate('cycles.proposalsTotal')} value={money(budgetPackage.proposalsTotal)} />
                <ApprovalsStat label={translate('cycles.versionsTotal')} value={money(budgetPackage.versionsTotal)} />
                {Number(budgetPackage.versionsAdjustment.amount) !== 0 && (
                  <ApprovalsStat
                    label={translate('cycles.versionsAdjustment')}
                    value={money(budgetPackage.versionsAdjustment)}
                  />
                )}
                {Number(budgetPackage.versionsOutsideListed.amount) !== 0 && (
                  <ApprovalsStat
                    label={translate('cycles.versionsOutsideListed')}
                    value={money(budgetPackage.versionsOutsideListed)}
                  />
                )}
                <ApprovalsStat label={translate('cycles.unallocated')} value={money(budgetPackage.unallocated)} />
                <ApprovalsStat label={translate('cycles.overBy')} value={money(budgetPackage.overBy)} emphasis />
              </ApprovalsStatGrid>
              {Number(budgetPackage.overBy.amount) > 0 && (
                <p role='status' className='text-sm text-danger-ink'>
                  {translate('cycles.overByNotice')}
                </p>
              )}
              {budgetPackage.departmentsTotal > budgetPackage.departments.length && (
                <p role='note' className='text-sm text-muted-foreground'>
                  {translate('cycles.departmentsTruncated', {
                    shown: budgetPackage.departments.length,
                    total: budgetPackage.departmentsTotal
                  })}
                </p>
              )}
              {budgetPackage.proposalsOverAvailable && (
                <p role='status' className='text-sm text-warning-ink'>
                  {translate('cycles.proposalsOverAvailable')}
                </p>
              )}
              <ApprovalsTable
                items={budgetPackage.departments}
                rowKey={(department) => department.departmentId}
                columns={[
                  {
                    key: 'department',
                    label: translate('cycles.department'),
                    render: (department) => <span title={department.departmentCode}>{department.departmentName}</span>
                  },
                  {
                    key: 'head',
                    label: translate('cycles.head'),
                    render: (department) => translate(`cycles.headStatus.${department.headStatus}`)
                  },
                  {
                    key: 'proposal',
                    label: translate('cycles.proposal'),
                    numeric: true,
                    render: (department) =>
                      department.proposal ? (
                        <span className='inline-flex items-center justify-end gap-2'>
                          {money(department.proposal.total)}
                          <ApprovalsStatus value={department.proposal.state} />
                        </span>
                      ) : (
                        translate('cycles.noProposal')
                      )
                  },
                  {
                    key: 'version',
                    label: translate('cycles.version'),
                    numeric: true,
                    render: (department) =>
                      department.version ? (
                        <span className='inline-flex items-center justify-end gap-2'>
                          {money(department.version.total)}
                          <ApprovalsStatus value={department.version.state} />
                        </span>
                      ) : (
                        translate('cycles.noVersion')
                      )
                  }
                ]}
              />
            </div>
          )}
        </ApprovalsQueryState>
      </ApprovalsSection>

      <CycleBudgetOverview year={year} />
      <CycleBaseline year={year} />
    </>
  )
}

/** Company totals and the per-Cost-Center table of the year; both are read-only. */
function CycleBudgetOverview({ year }: { year: number }) {
  const { t: translate, i18n } = useTranslation('approvalsBudget')
  const { formatDateTime } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const summaryQuery = useBudgetSummary({ year })
  const tableQuery = useBudgetTable({ year, page, pageSize: 20 })
  const summary = summaryQuery.data?.data
  const totals = summary ? Object.values(summary.totals)[0] : undefined
  const money = (value: { amount: string; currency: string } | null | undefined) => formatMoney(value, i18n.language)
  return (
    <ApprovalsSection title={translate('cycles.budgetTitle')}>
      <ApprovalsQueryState query={summaryQuery}>
        {summary && (
          <div className='space-y-3'>
            <ApprovalsStatGrid>
              <ApprovalsStat
                label={translate('cycles.effectiveBudget')}
                value={money(totals?.effectiveBudget.total)}
                emphasis
              />
              <ApprovalsStat label={translate('cycles.committed')} value={money(totals?.committed)} />
              <ApprovalsStat label={translate('cycles.spent')} value={money(totals?.spent)} />
              <ApprovalsStat label={translate('cycles.pendingSpend')} value={money(totals?.pendingSpend)} />
              <ApprovalsStat label={translate('cycles.remaining')} value={money(totals?.remaining)} />
              <ApprovalsStat label={translate('cycles.companySpent')} value={money(summary.companySpent)} />
            </ApprovalsStatGrid>
            {summary.sharedPoolUnallocated && (
              <p className='text-sm text-muted-foreground'>
                {translate('cycles.sharedPoolUnallocated', { amount: money(summary.sharedPoolUnallocated) })}
              </p>
            )}
            {summary.seatMonthsWithoutCostCenter && Number(summary.seatMonthsWithoutCostCenter.amount) !== 0 && (
              <p className='text-sm text-muted-foreground'>
                {translate('cycles.seatMonthsWithoutCostCenter', {
                  amount: money(summary.seatMonthsWithoutCostCenter)
                })}
              </p>
            )}
            {summary.lastInvoiceRecordedAt && (
              <p className='text-xs text-muted-foreground'>
                {translate('cycles.lastInvoiceRecordedAt', { time: formatDateTime(summary.lastInvoiceRecordedAt) })}
              </p>
            )}
            {summary.sharedPoolOverReserve && (
              <p role='status' className='text-sm text-warning-ink'>
                {translate('cycles.sharedPoolOverReserve')}
              </p>
            )}
          </div>
        )}
      </ApprovalsQueryState>
      <ApprovalsQueryState query={tableQuery}>
        <ApprovalsTable
          items={tableQuery.data?.data?.items ?? []}
          rowKey={(row) => row.costCenter.id}
          columns={[
            {
              key: 'center',
              label: translate('center'),
              render: (row) => <span title={row.costCenter.code}>{row.costCenter.name}</span>
            },
            { key: 'status', label: translate('state'), render: (row) => <ApprovalsStatus value={row.status} /> },
            {
              key: 'budget',
              label: translate('cycles.effectiveBudget'),
              numeric: true,
              render: (row) => money(row.effectiveBudget?.total)
            },
            {
              key: 'committed',
              label: translate('cycles.committed'),
              numeric: true,
              render: (row) => money(row.committed)
            },
            { key: 'spent', label: translate('cycles.spent'), numeric: true, render: (row) => money(row.spent) },
            {
              key: 'pending',
              label: translate('cycles.pendingSpend'),
              numeric: true,
              render: (row) => money(row.pendingSpend)
            },
            {
              key: 'remaining',
              label: translate('cycles.remaining'),
              numeric: true,
              render: (row) => (
                <span className={row.overBudget || row.overCommitted ? 'text-danger-ink' : undefined}>
                  {money(row.remaining)}
                </span>
              )
            }
          ]}
        />
        <ApprovalsPagination pagination={tableQuery.data?.data?.pagination} onPageChange={setPage} />
      </ApprovalsQueryState>
    </ApprovalsSection>
  )
}

/** The running seats priced for next year, so a version can be read against what the departments already use. */
function CycleBaseline({ year }: { year: number }) {
  const { t: translate, i18n } = useTranslation('approvalsBudget')
  const query = useBudgetCycleBaseline(year)
  const baseline = query.data?.data
  return (
    <ApprovalsSection title={translate('cycles.baselineTitle')}>
      <ApprovalsQueryState query={query}>
        {baseline && (
          <ApprovalsTable
            items={baseline.departments}
            rowKey={(department) => department.departmentId}
            columns={[
              {
                key: 'department',
                label: translate('cycles.department'),
                render: (department) => department.departmentName
              },
              {
                key: 'seats',
                label: translate('cycles.seats'),
                numeric: true,
                align: 'center',
                render: (department) => department.seatsAssigned
              },
              {
                key: 'estimated',
                label: translate('cycles.estimatedAnnualCost'),
                numeric: true,
                render: (department) => formatMoney(department.estimatedAnnualCost, i18n.language)
              },
              {
                key: 'spent',
                label: translate('cycles.spentThisYear'),
                numeric: true,
                render: (department) => formatMoney(department.spentThisYear, i18n.language)
              },
              {
                key: 'carried',
                label: translate('cycles.carriedOver'),
                numeric: true,
                render: (department) => formatMoney(department.carriedOverNextYear, i18n.language)
              }
            ]}
          />
        )}
      </ApprovalsQueryState>
    </ApprovalsSection>
  )
}

/** Cycle states use their own labels: the shared status labels give `OPEN` another meaning. */
function CycleStatus({ value }: { value: 'DRAFT' | 'OPEN' | 'LOCKED' }) {
  const { t: translate } = useTranslation('approvalsBudget')
  return <span className='font-medium'>{translate(`cycles.status.${value}`)}</span>
}
