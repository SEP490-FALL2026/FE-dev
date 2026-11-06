import { AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { useBudgetCommitmentList } from '~/shared/api/generated/operations/budget-commitments/budget-commitment-list'
import type { FinanceTabKey } from '../../enums'
import {
  FinanceDetailPage,
  FinanceEmpty,
  FinancePage,
  FinancePagination,
  FinanceQueryState,
  FinanceStatus
} from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { formatMoney } from '../../shared/finance-money'
import { CommitmentDetail } from '../components/commitment-detail'
import { CommitmentFilters, isValidCommitmentYear, type CommitmentFilterValues } from '../components/commitment-filters'
import { CommitmentState } from '../enums/commitment-state'
import type { Commitment } from '../hooks/use-commitment-actions'

const pageSize = 20

export function FinanceCommitmentsView({
  itemId,
  onSelectTab
}: {
  itemId?: string
  onSelectTab: (tab: FinanceTabKey, extra?: Record<string, string>) => void
}) {
  const { t: translate, i18n } = useTranslation('financeSpend')
  // The detail link carries the request too: commitments are only readable through the list, filtered by request.
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState<CommitmentFilterValues>({
    costCenterId: '',
    year: String(new Date().getFullYear()),
    state: CommitmentState.HELD
  })
  const [page, setPage] = useState(1)
  const yearValid = isValidCommitmentYear(filters.year)
  const commitments = useBudgetCommitmentList(
    {
      costCenterId: filters.costCenterId || undefined,
      year: filters.year ? Number(filters.year) : undefined,
      state: filters.state || undefined,
      page,
      pageSize
    },
    { query: { enabled: !itemId && yearValid } }
  )
  const money = (value: { amount: string; currency: string }) => formatMoney(value, i18n.language)

  if (itemId)
    return (
      <FinanceDetailPage>
        <CommitmentDetail
          key={itemId}
          id={itemId}
          requestId={searchParams.get('requestId')}
          onClose={() => onSelectTab('commitments')}
        />
      </FinanceDetailPage>
    )

  return (
    <FinancePage title={translate('commitments.title')} description={translate('commitments.description')}>
      <CommitmentFilters
        values={filters}
        onChange={(values) => {
          setFilters(values)
          setPage(1)
        }}
      />
      {!yearValid ? (
        <FinanceEmpty message={translate('commitments.invalidYear')} />
      ) : (
        <FinanceQueryState query={commitments}>
          {commitments.data?.data?.items.length ? (
            <FinanceTable<Commitment>
              items={commitments.data.data.items}
              rowKey={(commitment) => commitment.id}
              onOpen={(commitment) =>
                onSelectTab('commitments', { id: commitment.id, requestId: commitment.requestId })
              }
              columns={[
                {
                  key: 'software',
                  label: translate('commitments.columns.software'),
                  render: (commitment) =>
                    commitment.request ? (
                      <span className='block' title={commitment.request.software.name}>
                        <span className='block truncate font-medium'>{commitment.request.software.name}</span>
                        <span className='block truncate text-xs text-muted-foreground'>
                          {commitment.request.plan?.name ?? translate('commitments.noPlan')}
                        </span>
                      </span>
                    ) : (
                      <span className='text-muted-foreground'>{translate('commitments.requestUnavailable')}</span>
                    )
                },
                {
                  key: 'requester',
                  label: translate('commitments.columns.requester'),
                  render: (commitment) =>
                    commitment.request ? (
                      <span
                        title={`${commitment.request.requester.fullName} · ${commitment.request.requester.employeeCode}`}
                      >
                        {commitment.request.requester.fullName}
                      </span>
                    ) : (
                      translate('noValue')
                    )
                },
                {
                  key: 'costCenter',
                  label: translate('commitments.columns.costCenter'),
                  render: (commitment) => (
                    <span title={`${commitment.costCenter.code} · ${commitment.costCenter.name}`}>
                      {commitment.costCenter.name}
                    </span>
                  )
                },
                {
                  key: 'amount',
                  label: translate('commitments.columns.amount'),
                  numeric: true,
                  render: (commitment) => money(commitment.amount)
                },
                {
                  key: 'released',
                  label: translate('commitments.columns.released'),
                  numeric: true,
                  render: (commitment) => money(commitment.released)
                },
                {
                  key: 'held',
                  label: translate('commitments.columns.held'),
                  numeric: true,
                  render: (commitment) => <span className='font-semibold'>{money(commitment.held)}</span>
                },
                {
                  key: 'invoiced',
                  label: translate('commitments.columns.invoiced'),
                  numeric: true,
                  render: (commitment) => money(commitment.invoiced)
                },
                {
                  key: 'invoiceCount',
                  label: translate('commitments.columns.invoiceCount'),
                  numeric: true,
                  render: (commitment) => commitment.invoiceCount
                },
                {
                  key: 'state',
                  label: translate('commitments.columns.state'),
                  render: (commitment) => <FinanceStatus value={commitment.state} />
                },
                {
                  key: 'discrepancy',
                  label: translate('commitments.columns.discrepancy'),
                  render: (commitment) =>
                    commitment.hasDiscrepancy ? (
                      <span className='inline-flex items-center gap-1.5 text-danger-ink'>
                        <AlertTriangle aria-hidden className='size-4 shrink-0' strokeWidth={1.5} />
                        {translate('commitments.discrepancy')}
                      </span>
                    ) : (
                      <span className='text-muted-foreground'>{translate('commitments.noDiscrepancy')}</span>
                    )
                }
              ]}
            />
          ) : (
            <FinanceEmpty message={translate('commitments.empty')} />
          )}
          <FinancePagination pagination={commitments.data?.data?.pagination} onPageChange={setPage} />
        </FinanceQueryState>
      )}
    </FinancePage>
  )
}
