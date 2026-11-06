import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { BatchItemListResponseDtoDataItemsItem } from '~/shared/api/generated/model/spend-submission'
import { useSpendBatchGet } from '~/shared/api/generated/operations/spend-submission/spend-batch-get'
import { useSpendBatchItemList } from '~/shared/api/generated/operations/spend-submission/spend-batch-item-list'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'
import {
  FinanceDrawer,
  FinanceEmpty,
  FinancePagination,
  FinanceQueryState,
  FinanceSection,
  FinanceStat,
  FinanceStatGrid
} from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { BatchItemOutcome } from '../enums/batch-item-outcome'
import { BatchItemLeftReason } from '../enums/batch-item-left-reason'
import { BatchItemStopReason } from '../enums/batch-item-stop-reason'
import { BatchRequestState } from '../enums/batch-request-state'

const itemsPageSize = 20

const isKnown = <Value extends string>(values: Record<string, Value>, value: string | null): value is Value =>
  value !== null && (Object.values(values) as string[]).includes(value)

export function SpendBatchDetail({ id, onClose }: { id: string; onClose: () => void }) {
  const { t: translate } = useTranslation('financeSpend')
  const { formatDateTime } = useWorkspaceFormat()
  const [page, setPage] = useState(1)
  const batchQuery = useSpendBatchGet(id)
  const itemsQuery = useSpendBatchItemList(id, { page, pageSize: itemsPageSize })
  const batch = batchQuery.data?.data?.batch
  const noValue = translate('noValue')
  const unknown = translate('unknown')

  const outcomeLabel = (item: BatchItemListResponseDtoDataItemsItem) =>
    isKnown(BatchItemOutcome, item.outcome) ? translate(`outcome.${item.outcome}`) : unknown
  const stopLabel = (item: BatchItemListResponseDtoDataItemsItem) => {
    if (item.stopReason === null) return noValue
    return isKnown(BatchItemStopReason, item.stopReason) ? translate(`stopReason.${item.stopReason}`) : unknown
  }
  const leftLabel = (item: BatchItemListResponseDtoDataItemsItem) => {
    if (item.leftReason === null) return translate('batches.detail.notLeft')
    const reason = isKnown(BatchItemLeftReason, item.leftReason) ? translate(`leftReason.${item.leftReason}`) : unknown
    return item.leftAt ? translate('batches.detail.leftAt', { reason, at: formatDateTime(item.leftAt) }) : reason
  }
  const stateLabel = (item: BatchItemListResponseDtoDataItemsItem) =>
    isKnown(BatchRequestState, item.requestState) ? translate(`requestState.${item.requestState}`) : unknown

  return (
    <FinanceDrawer
      title={
        batch
          ? translate('batches.detail.title', { department: batch.department.code })
          : translate('batches.detail.fallbackTitle')
      }
      onClose={onClose}
    >
      <FinanceQueryState query={batchQuery}>
        {batch && (
          <FinanceStatGrid columns={4}>
            <FinanceStat label={translate('batches.detail.department')} value={batch.department.code} />
            <FinanceStat
              label={translate('batches.detail.submittedBy')}
              value={
                <span className='font-sans' title={`${batch.submittedBy.fullName} · ${batch.submittedBy.employeeCode}`}>
                  {batch.submittedBy.fullName}
                </span>
              }
            />
            <FinanceStat label={translate('batches.detail.submittedAt')} value={formatDateTime(batch.submittedAt)} />
            <FinanceStat label={translate('batches.detail.itemCount')} value={batch.itemCount} />
          </FinanceStatGrid>
        )}
      </FinanceQueryState>
      <FinanceSection title={translate('batches.detail.items')}>
        <FinanceQueryState query={itemsQuery}>
          {itemsQuery.data?.data?.items.length ? (
            <FinanceTable
              items={itemsQuery.data.data.items}
              rowKey={(item) => `${item.position}-${item.requestId}`}
              columns={[
                {
                  key: 'position',
                  label: translate('batches.detail.position'),
                  numeric: true,
                  render: (item) => item.position
                },
                {
                  key: 'request',
                  label: translate('batches.detail.request'),
                  render: (item) => (
                    <span className='font-mono text-xs' title={item.requestId}>
                      {item.requestId}
                    </span>
                  )
                },
                {
                  key: 'outcome',
                  label: translate('batches.detail.outcome'),
                  render: (item) => (
                    <span className={item.outcome === BatchItemOutcome.STOPPED ? 'text-danger-ink' : ''}>
                      {outcomeLabel(item)}
                    </span>
                  )
                },
                { key: 'stopReason', label: translate('batches.detail.stopReason'), render: stopLabel },
                { key: 'left', label: translate('batches.detail.left'), render: leftLabel },
                { key: 'state', label: translate('batches.detail.requestState'), render: stateLabel }
              ]}
            />
          ) : (
            <FinanceEmpty message={translate('batches.detail.itemsEmpty')} />
          )}
          <FinancePagination pagination={itemsQuery.data?.data?.pagination} onPageChange={setPage} />
        </FinanceQueryState>
      </FinanceSection>
    </FinanceDrawer>
  )
}
