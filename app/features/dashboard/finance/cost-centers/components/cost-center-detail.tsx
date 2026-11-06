import { ArrowUpRight } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { BudgetTablePageResponseDtoDataItemsItem } from '~/shared/api/generated/model/budgets/budgetTablePageResponseDtoDataItemsItem'
import { useBudgetCommitmentList } from '~/shared/api/generated/operations/budget-commitments/budget-commitment-list'
import { useBudgetVersionLineList } from '~/shared/api/generated/operations/budget-versions/budget-version-line-list'
import type { FinanceTabKey } from '../../enums'
import {
  FinanceButton,
  FinanceDrawer,
  FinancePagination,
  FinanceQueryState,
  FinanceSection,
  FinanceStat,
  FinanceStatGrid,
  FinanceStatus
} from '../../shared/components/finance-ui'
import { BudgetUtilization } from '../../shared/components/budget-utilization'
import { FinanceTable } from '../../shared/components/finance-table'
import { formatMoney } from '../../shared/finance-money'
import { useDashboardFormat } from '../../../dashboard-ui'
import { usedShare } from '../budget-usage'

export interface CommitmentTarget {
  id: string
  requestId: string
  backLabel: string
  onClose: () => void
}

/** One department's budget for the year: figures, approved spend (commitments) and the plan lines. */
export function CostCenterDetail({
  row,
  onClose,
  onSelectTab,
  renderCommitment
}: {
  row: BudgetTablePageResponseDtoDataItemsItem
  onClose: () => void
  onSelectTab?: (tab: FinanceTabKey, extraParams?: Record<string, string>) => void
  /** Shows one commitment in place, so reading it never leaves the cost center (supplied by the role screen). */
  renderCommitment?: (target: CommitmentTarget) => ReactNode
}) {
  const { t: translate, i18n } = useTranslation('financeSettings')
  const { formatDate } = useDashboardFormat()
  const [commitmentPage, setCommitmentPage] = useState(1)
  const [linePage, setLinePage] = useState(1)
  const [openCommitment, setOpenCommitment] = useState<{ id: string; requestId: string } | null>(null)
  const commitments = useBudgetCommitmentList({
    costCenterId: row.costCenter.id,
    year: row.year,
    page: commitmentPage,
    pageSize: 10
  })
  const lines = useBudgetVersionLineList(row.versionId, { page: linePage, pageSize: 10 })
  const money = (value: { amount: string; currency: string }) => formatMoney(value, i18n.language)
  // Rendered instead of this page, not inside it, so the commitment reads as its own page and not a slide-over.
  if (openCommitment && renderCommitment)
    return renderCommitment({
      ...openCommitment,
      backLabel: translate('backToCostCenter', { name: row.costCenter.name }),
      onClose: () => setOpenCommitment(null)
    })
  return (
    <FinanceDrawer title={`${row.costCenter.code} · ${row.costCenter.name}`} onClose={onClose}>
      <FinanceSection
        title={translate('budgetOfYear', { year: row.year })}
        actions={
          onSelectTab && (
            <FinanceButton variant='ghost' onClick={() => onSelectTab('budget-negotiation', { id: row.versionId })}>
              {translate('openVersion', { number: row.number })}
              <ArrowUpRight aria-hidden className='size-4' strokeWidth={1.5} />
            </FinanceButton>
          )
        }
      >
        <FinanceStatGrid columns={4}>
          <FinanceStat emphasis label={translate('budgetTotal')} value={money(row.total)} />
          <FinanceStat label={translate('kpis.base')} value={money(row.base)} />
          <FinanceStat label={translate('kpis.reserve')} value={money(row.reserve)} />
          <FinanceStat label={translate('kpis.held')} value={money(row.committed)} />
          <FinanceStat label={translate('kpis.spent')} value={money(row.spent)} />
          <FinanceStat label={translate('budgetRemaining')} value={money(row.remaining)} />
          <div className='min-w-0 space-y-2 bg-surface p-4 sm:col-span-2'>
            <dt className='text-xs font-medium tracking-wider text-muted-foreground uppercase'>
              {translate('budgetUtilization')}
            </dt>
            <dd className='font-mono text-lg font-semibold tabular-nums'>
              <BudgetUtilization share={usedShare(row)} overBudget={row.overCommitted} />
            </dd>
          </div>
        </FinanceStatGrid>
      </FinanceSection>
      <FinanceSection title={translate('approvedSpend')}>
        <FinanceQueryState query={commitments}>
          <FinanceTable
            items={commitments.data?.data?.items ?? []}
            rowKey={(item) => item.id}
            onOpen={
              renderCommitment ? (item) => setOpenCommitment({ id: item.id, requestId: item.requestId }) : undefined
            }
            columns={[
              {
                key: 'software',
                label: translate('software'),
                render: (item) => {
                  const name = item.request
                    ? [item.request.software.name, item.request.plan?.name].filter(Boolean).join(' · ')
                    : translate('unavailable')
                  return <span title={name}>{name}</span>
                }
              },
              {
                key: 'requester',
                label: translate('requester'),
                render: (item) => item.request?.requester.fullName ?? '—'
              },
              {
                key: 'approvedAt',
                label: translate('approvedAt'),
                numeric: true,
                render: (item) => (item.request?.spendApprovedAt ? formatDate(item.request.spendApprovedAt) : '—')
              },
              {
                key: 'amount',
                label: translate('approvedAmount'),
                numeric: true,
                render: (item) => money(item.amount)
              },
              { key: 'held', label: translate('kpis.held'), numeric: true, render: (item) => money(item.held) },
              {
                key: 'invoiced',
                label: translate('kpis.spent'),
                numeric: true,
                render: (item) => money(item.invoiced)
              },
              { key: 'state', label: translate('status'), render: (item) => <FinanceStatus value={item.state} /> }
            ]}
          />
          <FinancePagination pagination={commitments.data?.data?.pagination} onPageChange={setCommitmentPage} />
        </FinanceQueryState>
      </FinanceSection>
      <FinanceSection title={translate('budgetLines')}>
        <FinanceQueryState query={lines}>
          <FinanceTable
            items={lines.data?.data?.items ?? []}
            rowKey={(line) => String(line.position)}
            columns={[
              {
                key: 'description',
                label: translate('lineDescription'),
                render: (line) => <span title={line.description}>{line.description}</span>
              },
              { key: 'seats', label: translate('seats'), numeric: true, render: (line) => line.seats ?? '—' },
              { key: 'amount', label: translate('budgetTotal'), numeric: true, render: (line) => money(line.amount) }
            ]}
          />
          <FinancePagination pagination={lines.data?.data?.pagination} onPageChange={setLinePage} />
        </FinanceQueryState>
      </FinanceSection>
    </FinanceDrawer>
  )
}
