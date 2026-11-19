import { useTranslation } from 'react-i18next'
import type { BatchItemListResponseDtoDataItemsItem } from '~/shared/api/generated/model/spend-submission/batchItemListResponseDtoDataItemsItem'
import { ApprovalsTable } from '../../shared/components/approvals-table'
import { ApprovalsStatus } from '../../shared/components/approvals-ui'
import { BATCH_ITEM_OUTCOME } from '../enums/batch-item-outcome'
import { BATCH_REQUEST_STATE } from '../enums/batch-request-state'
import { BATCH_SELECTION_LIMIT } from '../batch-constraints'

export function isBatchItemEligible(item: BatchItemListResponseDtoDataItemsItem) {
  return (
    (item.outcome === BATCH_ITEM_OUTCOME.SENT_TO_APPROVER || item.outcome === BATCH_ITEM_OUTCOME.SENT_TO_FINANCE) &&
    item.requestState === BATCH_REQUEST_STATE.AWAITING_SPEND_DECISION &&
    item.leftAt === null &&
    item.leftReason === null &&
    item.stopReason === null
  )
}

export function SpendBatchItems({
  items,
  selectedIds,
  disabled,
  onToggle,
  onOpen
}: {
  items: BatchItemListResponseDtoDataItemsItem[]
  selectedIds: readonly string[]
  disabled: boolean
  onToggle: (requestId: string) => void
  onOpen: (requestId: string) => void
}) {
  const { t: translate } = useTranslation('approvalsSpend')
  const { t: translateCommon } = useTranslation('approvals')
  return (
    <ApprovalsTable
      items={items}
      rowKey={(item) => item.requestId}
      onOpen={(item) => onOpen(item.requestId)}
      columns={[
        {
          key: 'select',
          label: translate('batchSelection'),
          render: (item) => (
            <label className='inline-flex min-h-11 min-w-11 items-center justify-center md:min-h-8 md:min-w-8'>
              <input
                type='checkbox'
                aria-label={translate('selectRequest', { position: item.position })}
                checked={selectedIds.includes(item.requestId)}
                disabled={
                  disabled ||
                  !isBatchItemEligible(item) ||
                  (!selectedIds.includes(item.requestId) && selectedIds.length >= BATCH_SELECTION_LIMIT)
                }
                className='size-5 accent-primary'
                onChange={() => onToggle(item.requestId)}
              />
            </label>
          )
        },
        {
          key: 'position',
          label: translate('batchPosition'),
          numeric: true,
          align: 'center',
          render: (item) => `#${item.position}`
        },
        {
          key: 'outcome',
          label: translate('batchRoute'),
          render: (item) => translateCommon(`status.${item.outcome}`, { defaultValue: translateCommon('unknown') })
        },
        {
          key: 'state',
          label: translate('batchRequestState'),
          render: (item) => <ApprovalsStatus value={item.requestState} />
        },
        {
          key: 'reason',
          label: translate('skippedReason'),
          render: (item) => {
            const reason = item.leftReason ?? item.stopReason
            return reason
              ? translate(`reasons.${reason}`, { defaultValue: translateCommon('unknown') })
              : translate('unavailable')
          }
        }
      ]}
    />
  )
}
