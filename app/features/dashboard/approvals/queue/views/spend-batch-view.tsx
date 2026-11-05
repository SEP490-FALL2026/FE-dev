import { ArrowLeft } from 'lucide-react'
import { useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import type { BatchDecisionBodyDtoDecision } from '~/shared/api/generated/model/spend-approvals/batchDecisionBodyDtoDecision'
import type { BatchDecisionResponseDtoDataResultsItem } from '~/shared/api/generated/model/spend-approvals/batchDecisionResponseDtoDataResultsItem'
import { useSpendBatchDecide } from '~/shared/api/generated/operations/spend-approvals/spend-batch-decide'
import { useSpendBatchGet } from '~/shared/api/generated/operations/spend-submission/spend-batch-get'
import { useSpendBatchItemList } from '~/shared/api/generated/operations/spend-submission/spend-batch-item-list'
import { useDashboardFormat } from '../../../dashboard-ui'
import type { ApprovalTabKey } from '../../approvals-nav'
import { isApprovalRelatedKey } from '../../shared/approvals-query-keys'
import { getApprovalsError } from '../../shared/approvals-errors'
import { ApprovalsQueryState } from '../../shared/components/approvals-query-state'
import {
  ApprovalsButton,
  ApprovalsEmpty,
  ApprovalsField,
  ApprovalsPage,
  ApprovalsPagination,
  ApprovalsSection,
  ApprovalsStat,
  ApprovalsStatGrid,
  approvalsInputClass
} from '../../shared/components/approvals-ui'
import { useApprovalsFeedback } from '../../shared/hooks/use-approvals-feedback'
import { SpendBatchDecision } from '../components/spend-batch-decision'
import { SpendBatchItems, isBatchItemEligible } from '../components/spend-batch-items'
import { SpendBatchResults } from '../components/spend-batch-results'
import { BATCH_SELECTION_LIMIT } from '../batch-constraints'
import { BATCH_RESULT_OUTCOME } from '../enums/batch-result-outcome'
import { SPEND_DECISION } from '../enums/spend-decision'

interface ApprovalBatchViewProps {
  itemId?: string
  onSelectTab: (tab: ApprovalTabKey, params?: Record<string, string>) => void
}

const isBatchId = (value: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)

export function ApprovalBatchView({ itemId, onSelectTab }: ApprovalBatchViewProps) {
  const { t: translate } = useTranslation('approvalsSpend')
  return (
    <ApprovalsPage
      title={translate('batch')}
      actions={
        <ApprovalsButton variant='ghost' onClick={() => onSelectTab('queue')}>
          <ArrowLeft aria-hidden className='size-4' strokeWidth={1.5} />
          {translate('batchBack')}
        </ApprovalsButton>
      }
    >
      {itemId && isBatchId(itemId) ? (
        <BatchWorkspace key={itemId} batchId={itemId} onSelectTab={onSelectTab} />
      ) : (
        <BatchLookup key={itemId} initialId={itemId ?? ''} onSelectTab={onSelectTab} />
      )}
    </ApprovalsPage>
  )
}

function BatchLookup({
  initialId,
  onSelectTab
}: {
  initialId: string
  onSelectTab: ApprovalBatchViewProps['onSelectTab']
}) {
  const { t: translate } = useTranslation('approvalsSpend')
  const [batchId, setBatchId] = useState(initialId)
  return (
    <form
      className='flex flex-wrap items-end gap-3'
      onSubmit={(event) => {
        event.preventDefault()
        if (isBatchId(batchId.trim())) onSelectTab('batch', { id: batchId.trim() })
      }}
    >
      <div className='w-full max-w-md'>
        <ApprovalsField label={translate('batchId')} hint={translate('batchIdHint')}>
          <input
            className={`${approvalsInputClass} font-mono text-xs tabular-nums md:text-xs`}
            value={batchId}
            placeholder={translate('batchPlaceholder')}
            onChange={(event) => setBatchId(event.target.value)}
          />
        </ApprovalsField>
      </div>
      <ApprovalsButton type='submit' disabled={!isBatchId(batchId.trim())}>
        {translate('batchOpen')}
      </ApprovalsButton>
    </form>
  )
}

function BatchWorkspace({
  batchId,
  onSelectTab
}: {
  batchId: string
  onSelectTab: ApprovalBatchViewProps['onSelectTab']
}) {
  const { t: translate } = useTranslation('approvalsSpend')
  const { t: translateCommon } = useTranslation('approvals')
  const { formatDate } = useDashboardFormat()
  const queryClient = useQueryClient()
  const feedback = useApprovalsFeedback([])
  const submissionLocked = useRef(false)
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [decision, setDecision] = useState<BatchDecisionBodyDtoDecision>(SPEND_DECISION.APPROVE)
  const [reason, setReason] = useState('')
  const [results, setResults] = useState<BatchDecisionResponseDtoDataResultsItem[] | null>(null)
  const batchQuery = useSpendBatchGet(batchId)
  const itemQuery = useSpendBatchItemList(batchId, { page, pageSize: BATCH_SELECTION_LIMIT })
  const invalidate = () => queryClient.invalidateQueries({ predicate: (query) => isApprovalRelatedKey(query.queryKey) })
  const mutation = useSpendBatchDecide({
    mutation: {
      onSettled: () => {
        submissionLocked.current = false
      },
      onSuccess: async (response, variables) => {
        const returnedResults = response.data?.results
        if (returnedResults) setResults(returnedResults)
        await invalidate()
        const returnedIds = new Set(returnedResults?.map((result) => result.requestId))
        const complete =
          returnedResults &&
          returnedIds.size === variables.data.requestIds.length &&
          returnedResults.length === returnedIds.size &&
          variables.data.requestIds.every((requestId) => returnedIds.has(requestId)) &&
          returnedResults.every((result) => Object.values(BATCH_RESULT_OUTCOME).includes(result.outcome))
        if (!complete) {
          toast.error(translateCommon('errors.ambiguous'), { id: 'approvals-batch' })
          return
        }
        setSelectedIds([])
        setReason('')
        if (returnedResults.some((result) => result.outcome === BATCH_RESULT_OUTCOME.SKIPPED)) {
          toast.warning(translate('batchPartial'), { id: 'approvals-batch' })
        } else toast.success(translateCommon('saved'), { id: 'approvals-batch' })
      },
      onError: async (error) => {
        if (getApprovalsError(error).key !== 'rateLimit') await invalidate()
        await feedback.onError(error)
      }
    }
  })
  const items = itemQuery.data?.data?.items ?? []
  const eligibleIds = items
    .filter((item) => isBatchItemEligible(item) && selectedIds.includes(item.requestId))
    .map((item) => item.requestId)
  const disabled =
    mutation.isPending || itemQuery.isFetching || itemQuery.isError || batchQuery.isFetching || batchQuery.isError
  const batch = batchQuery.data?.data?.batch
  const openRequest = (requestId: string) => onSelectTab('request', { id: requestId })

  function submit() {
    if (
      submissionLocked.current ||
      disabled ||
      !eligibleIds.length ||
      eligibleIds.length > BATCH_SELECTION_LIMIT ||
      (decision === SPEND_DECISION.REJECT && !reason.trim())
    )
      return
    submissionLocked.current = true
    mutation.mutate({
      id: batchId,
      data: {
        decision,
        requestIds: eligibleIds,
        ...(decision === SPEND_DECISION.REJECT ? { reason: reason.trim() } : {})
      }
    })
  }

  return (
    <div className='space-y-6'>
      <ApprovalsQueryState query={batchQuery}>
        {batch ? (
          <>
            <ApprovalsStatGrid>
              <ApprovalsStat label={translate('batchItemCount')} value={batch.itemCount} emphasis />
              <ApprovalsStat label={translate('batchSubmittedAt')} value={formatDate(batch.submittedAt)} />
              <ApprovalsStat label={translate('batchDepartment')} value={batch.department.code} />
            </ApprovalsStatGrid>
            <dl className='grid gap-4 rounded-lg border border-border/70 bg-surface p-4 sm:grid-cols-2'>
              <div className='min-w-0'>
                <dt className='text-xs text-muted-foreground'>{translate('batchSender')}</dt>
                <dd className='mt-1 truncate text-sm' title={batch.submittedBy.fullName}>
                  {batch.submittedBy.fullName}
                </dd>
              </div>
              <div className='min-w-0'>
                <dt className='text-xs text-muted-foreground'>{translate('batchId')}</dt>
                <dd className='mt-1 font-mono text-xs break-all tabular-nums'>{batch.id}</dd>
              </div>
            </dl>
            <ApprovalsSection title={translate('batchItems')}>
              <ApprovalsQueryState query={itemQuery}>
                <SpendBatchItems
                  items={items}
                  selectedIds={eligibleIds}
                  disabled={disabled}
                  onOpen={openRequest}
                  onToggle={(requestId) => {
                    if (disabled || !items.some((item) => item.requestId === requestId && isBatchItemEligible(item)))
                      return
                    setSelectedIds((currentIds) =>
                      currentIds.includes(requestId)
                        ? currentIds.filter((currentId) => currentId !== requestId)
                        : currentIds.length < BATCH_SELECTION_LIMIT
                          ? [...currentIds, requestId]
                          : currentIds
                    )
                  }}
                />
                <ApprovalsPagination
                  pagination={itemQuery.data?.data?.pagination}
                  onPageChange={(nextPage) => {
                    if (mutation.isPending) return
                    setSelectedIds([])
                    setPage(nextPage)
                  }}
                />
                <SpendBatchDecision
                  decision={decision}
                  reason={reason}
                  selectedCount={eligibleIds.length}
                  pending={mutation.isPending}
                  disabled={disabled}
                  onDecision={setDecision}
                  onReason={setReason}
                  onSubmit={submit}
                />
              </ApprovalsQueryState>
            </ApprovalsSection>
          </>
        ) : (
          <ApprovalsEmpty />
        )}
      </ApprovalsQueryState>
      {results && <SpendBatchResults results={results} onOpen={openRequest} />}
    </div>
  )
}
