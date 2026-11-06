import { ArrowLeft, CheckCircle2, Clock, Layers, Users } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FinanceButton,
  FinanceDetailPage,
  FinanceEmpty,
  FinancePagination,
  FinanceQueryState,
  FinanceSection,
  FinanceStat,
  FinanceStatGrid,
  FinanceStatus
} from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { useSpendBatchGet, useSpendBatchItemList } from '../hooks/use-spend-batches'
import type { BatchItemListResponseDtoDataItemsItem } from '~/shared/api/generated/model/spend-submission'

export function SpendBatchDetail({
  batchId,
  onClose
}: {
  batchId: string
  onClose: () => void
}) {
  const { t: translate, i18n } = useTranslation('financeSettings')
  const { t: translateFinance } = useTranslation('finance')
  const [page, setPage] = useState(1)

  const batchQuery = useSpendBatchGet(batchId)
  const itemsQuery = useSpendBatchItemList(batchId, { page, pageSize: 20 })

  const batch = batchQuery.data
  const items = itemsQuery.data?.items ?? []
  const pagination = itemsQuery.data?.pagination

  const outcomeBadge = (outcome: string, stopReason: string | null) => {
    switch (outcome) {
      case 'SENT_TO_APPROVER':
        return (
          <span className='inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success-ink'>
            <CheckCircle2 className='size-3' />
            {translateFinance('outcomes.SENT_TO_APPROVER', { defaultValue: 'Chuyển Người duyệt chi' })}
          </span>
        )
      case 'SENT_TO_FINANCE':
        return (
          <span className='inline-flex items-center gap-1 rounded-full bg-info/15 px-2 py-0.5 text-xs font-medium text-info-ink'>
            <Clock className='size-3' />
            {translateFinance('outcomes.SENT_TO_FINANCE', { defaultValue: 'Chuyển Finance rà soát' })}
          </span>
        )
      case 'STOPPED':
        return (
          <div className='space-y-0.5'>
            <span className='inline-flex items-center rounded-full bg-danger/15 px-2 py-0.5 text-xs font-medium text-danger'>
              {translateFinance('outcomes.STOPPED', { defaultValue: 'Bị dừng' })}
            </span>
            {stopReason && (
              <div className='text-[11px] text-muted-foreground'>
                {translateFinance(`stopReasons.${stopReason}`, { defaultValue: stopReason })}
              </div>
            )}
          </div>
        )
      default:
        return <span className='text-xs text-muted-foreground'>{outcome}</span>
    }
  }

  return (
    <FinanceDetailPage>
      <div className='space-y-6'>
        <div className='flex flex-wrap items-center justify-between gap-4 border-b border-border/70 pb-4'>
          <div className='space-y-1'>
            <div className='flex items-center gap-2'>
              <h1 className='text-xl font-bold tracking-tight text-foreground'>
                {batch?.department ? ((batch.department as any).name ?? batch.department.code) : translateFinance('spendBatches')}
              </h1>
              {batch?.department?.code && (
                <span className='font-mono text-xs text-muted-foreground'>({batch.department.code})</span>
              )}
            </div>
            <p className='text-sm text-muted-foreground'>
              {translateFinance('submittedBy')}:{' '}
              <span className='font-medium text-foreground'>{batch?.submittedBy?.fullName}</span> (
              <span className='font-mono text-xs'>{batch?.submittedBy?.employeeCode}</span>) ·{' '}
              {batch?.submittedAt ? new Date(batch.submittedAt).toLocaleString(i18n.language) : '—'}
            </p>
          </div>
          <FinanceButton variant='ghost' onClick={onClose}>
            <ArrowLeft aria-hidden className='size-4' strokeWidth={1.5} />
            {translate('cancel')}
          </FinanceButton>
        </div>

        <FinanceQueryState query={batchQuery}>
          {batch && (
            <FinanceStatGrid columns={3}>
              <FinanceStat
                label={translateFinance('itemCount')}
                value={batch.itemCount}
              />
              <FinanceStat
                label={translate('department')}
                value={(batch.department as any)?.name ?? batch.department?.code ?? '—'}
              />
              <FinanceStat
                label={translateFinance('submittedAt')}
                value={new Date(batch.submittedAt).toLocaleDateString(i18n.language)}
              />
            </FinanceStatGrid>
          )}
        </FinanceQueryState>

        <FinanceSection title={translateFinance('batchItems')}>
          <FinanceQueryState query={itemsQuery}>
            {items.length > 0 ? (
              <>
                <FinanceTable<BatchItemListResponseDtoDataItemsItem>
                  items={items}
                  rowKey={(item) => `${item.requestId}-${item.position}`}
                  columns={[
                    {
                      key: 'position',
                      label: translateFinance('itemPosition'),
                      numeric: true,
                      render: (item) => <span className='font-mono text-xs font-semibold'>#{item.position}</span>
                    },
                    {
                      key: 'requestId',
                      label: translateFinance('requestId', { value: '' }),
                      render: (item) => (
                        <div className='font-mono text-xs' title={item.requestId}>
                          {item.requestId}
                        </div>
                      )
                    },
                    {
                      key: 'outcome',
                      label: translateFinance('batchOutcome'),
                      render: (item) => outcomeBadge(item.outcome, item.stopReason)
                    },
                    {
                      key: 'requestState',
                      label: translateFinance('requestState'),
                      render: (item) => <FinanceStatus value={item.requestState} />
                    },
                    {
                      key: 'leftReason',
                      label: translate('status'),
                      render: (item) =>
                        item.leftReason ? (
                          <div className='text-xs text-muted-foreground'>
                            <span className='font-medium text-warning-ink'>
                              {translateFinance(`leftReasons.${item.leftReason}`, { defaultValue: item.leftReason })}
                            </span>
                            {item.leftAt && (
                              <div className='text-[10px]'>
                                {new Date(item.leftAt).toLocaleDateString(i18n.language)}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className='text-xs text-muted-foreground'>—</span>
                        )
                    }
                  ]}
                />
                <FinancePagination pagination={pagination} onPageChange={setPage} />
              </>
            ) : (
              <FinanceEmpty message={translateFinance('empty')} />
            )}
          </FinanceQueryState>
        </FinanceSection>
      </div>
    </FinanceDetailPage>
  )
}
