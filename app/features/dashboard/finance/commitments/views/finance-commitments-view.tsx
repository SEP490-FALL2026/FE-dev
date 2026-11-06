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
                  render: (commitment) => (
                    <span className='block' title={`${commitment.costCenter.code} · ${commitment.costCenter.name}`}>
                      <span className='block truncate'>
                        {commitment.request ? commitment.request.requester.fullName : translate('noValue')}
                      </span>
                      <span className='block truncate text-xs text-muted-foreground'>{commitment.costCenter.name}</span>
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
                  key: 'held',
                  label: translate('commitments.columns.held'),
                  numeric: true,
                  render: (commitment) => <span className='font-semibold'>{money(commitment.held)}</span>
                },
                {
                  key: 'invoiced',
                  label: translate('commitments.columns.invoiced'),
                  numeric: true,
                  render: (commitment) => (
                    <span className='block'>
                      <span className='block'>{money(commitment.invoiced)}</span>
                      {commitment.invoiceCount > 0 && (
                        <span className='block text-xs text-muted-foreground'>
                          {translate('commitments.invoiceCountValue', { count: commitment.invoiceCount })}
                        </span>
                      )}
                    </span>
                  )
                },
                {
                  key: 'state',
                  label: translate('commitments.columns.state'),
                  render: (commitment) => (
                    <span className='flex flex-col items-start gap-1'>
                      <FinanceStatus value={commitment.state} />
                      {commitment.hasDiscrepancy && (
                        <span className='inline-flex items-center gap-1 text-xs text-danger-ink'>
                          <AlertTriangle aria-hidden className='size-3.5 shrink-0' strokeWidth={1.5} />
                          {translate('commitments.discrepancy')}
                        </span>
                      )}
                    </span>
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
