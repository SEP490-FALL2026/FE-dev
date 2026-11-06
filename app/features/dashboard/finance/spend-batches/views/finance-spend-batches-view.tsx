import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSpendBatchList } from '~/shared/api/generated/operations/spend-submission/spend-batch-list'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'
import type { FinanceTabKey } from '../../enums'
import {
  FinanceDetailPage,
  FinanceEmpty,
  FinancePage,
  FinancePagination,
  FinanceQueryState
} from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { SpendBatchAmounts } from '../components/spend-batch-amounts'
import { SpendBatchDetail } from '../components/spend-batch-detail'
import { SpendBatchFilters, type SpendBatchFilterValues } from '../components/spend-batch-filters'
import { submittedWindow } from '../spend-batch-window'

const pageSize = 20

export function FinanceSpendBatchesView({
  itemId,
  onSelectTab
}: {
  itemId?: string
  onSelectTab: (tab: FinanceTabKey, extra?: Record<string, string>) => void
}) {
  const { t: translate } = useTranslation('financeSpend')
  const { formatDateTime } = useWorkspaceFormat()
  const [filters, setFilters] = useState<SpendBatchFilterValues>({ departmentId: '', fromDay: '', toDay: '' })
  const [page, setPage] = useState(1)
  const range = submittedWindow(filters.fromDay, filters.toDay)
  const batches = useSpendBatchList(
    {
      page,
      pageSize,
      departmentId: filters.departmentId || undefined,
      submittedFrom: range.submittedFrom,
      submittedTo: range.submittedTo
    },
    { query: { enabled: !itemId && !range.invalid } }
  )

  if (itemId)
    return (
      <FinanceDetailPage>
        <SpendBatchDetail key={itemId} id={itemId} onClose={() => onSelectTab('spend-batches')} />
      </FinanceDetailPage>
    )

  return (
    <FinancePage title={translate('batches.title')} description={translate('batches.description')}>
      <SpendBatchFilters
        values={filters}
        invalidWindow={range.invalid}
        onChange={(values) => {
          setFilters(values)
          setPage(1)
        }}
      />
      {range.invalid ? (
        <FinanceEmpty message={translate('batches.invalidWindow')} />
      ) : (
        <FinanceQueryState query={batches}>
          {batches.data?.data?.items.length ? (
            <FinanceTable
              items={batches.data.data.items}
              rowKey={(batch) => batch.id}
              onOpen={(batch) => onSelectTab('spend-batches', { id: batch.id })}
              columns={[
                {
                  key: 'department',
                  label: translate('batches.columns.department'),
                  render: (batch) => <span title={batch.department.name}>{batch.department.name}</span>
                },
                {
                  key: 'submittedBy',
                  label: translate('batches.columns.submittedBy'),
                  render: (batch) => (
                    <span title={`${batch.submittedBy.fullName} · ${batch.submittedBy.employeeCode}`}>
                      {batch.submittedBy.fullName}
                    </span>
                  )
                },
                {
                  key: 'submittedAt',
                  label: translate('batches.columns.submittedAt'),
                  numeric: true,
                  render: (batch) => <span className='text-xs'>{formatDateTime(batch.submittedAt)}</span>
                },
                {
                  key: 'itemCount',
                  label: translate('batches.columns.itemCount'),
                  numeric: true,
                  render: (batch) => batch.itemCount
                },
                {
                  key: 'approvedCount',
                  label: translate('batches.columns.approvedCount'),
                  numeric: true,
                  render: (batch) => batch.approvedCount
                },
                {
                  key: 'pendingCount',
                  label: translate('batches.columns.pendingCount'),
                  numeric: true,
                  render: (batch) => batch.pendingCount
                },
                {
                  key: 'approvedAmounts',
                  label: translate('batches.columns.approvedAmounts'),
                  numeric: true,
                  render: (batch) => <SpendBatchAmounts amounts={batch.approvedAmounts} />
                }
              ]}
            />
          ) : (
            <FinanceEmpty message={translate('batches.empty')} />
          )}
          <FinancePagination pagination={batches.data?.data?.pagination} onPageChange={setPage} />
        </FinanceQueryState>
      )}
    </FinancePage>
  )
}
