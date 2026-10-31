import { useState } from 'react'
import { ArrowRightLeft } from 'lucide-react'
import { ManagerPageHeader } from '../../shared/components/manager-page-header'
import { ManagerDataTable } from '../../shared/components/manager-data-table'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import type { DecideTransferReviewBodyDto } from '~/shared/api/generated/model/transfer-reviews/decideTransferReviewBodyDto'
import {
  useTransferReviewList,
  getTransferReviewListQueryKey
} from '~/shared/api/generated/operations/transfer-reviews/transfer-review-list'
import {
  useTransferReviewGet,
  getTransferReviewGetQueryKey
} from '~/shared/api/generated/operations/transfer-reviews/transfer-review-get'
import {
  useTransferReviewItemList,
  getTransferReviewItemListQueryKey
} from '~/shared/api/generated/operations/transfer-reviews/transfer-review-item-list'
import { transferReviewDecide } from '~/shared/api/generated/operations/transfer-reviews/transfer-review-decide'
import { useDashboardFormat, Dialog } from '../../../dashboard-ui'
import { useManagerPage } from '../../shared/hooks/use-manager-page'
import { useManagerAction } from '../../shared/hooks/use-manager-action'
import { isResourceId } from '../../shared/manager-identifiers'
import {
  ManagerActionState,
  ManagerButton,
  ManagerField,
  ManagerFormErrors,
  ManagerPagination,
  ManagerQueryState,
  ManagerSection,
  ManagerStatus,
  managerInputClass
} from '../../shared/components/manager-api-ui'
import { TRANSFER_DECISION, TRANSFER_REVIEW_STATUS, TRANSFER_ITEM_DECISION } from '../enums/transfer-review-status'

export function ManagerTransferReviews() {
  const { t: translate } = useTranslation('manager')
  const { formatDate } = useDashboardFormat()
  const paging = useManagerPage()
  const [params, setParams] = useSearchParams()
  const query = useTransferReviewList({ page: paging.page, pageSize: paging.pageSize })
  const id = params.get('reviewId') ?? ''
  return (
    <div className='space-y-6'>
      <ManagerPageHeader title={translate('transfers')} description={translate('transferHint')} icon={ArrowRightLeft} />
      <ManagerSection>
        <ManagerQueryState
          query={query}
          empty={!query.data?.data?.items.length}
          emptyTitle={translate('noTransfers')}
          emptyDescription={translate('noTransfersHint')}
        />
        {!query.isError && (
          <ManagerDataTable
            label={translate('transfers')}
            items={query.data?.data?.items ?? []}
            rowKey={(review) => review.id}
            columns={[
              {
                key: 'employee',
                label: translate('employee'),
                render: (review) => (
                  <p className='max-w-64 truncate font-medium' title={review.employee.fullName}>
                    {review.employee.fullName}
                  </p>
                )
              },
              { key: 'due', label: translate('due'), align: 'right', render: (review) => formatDate(review.dueOn) },
              { key: 'status', label: translate('status'), render: (review) => <ManagerStatus value={review.status} /> }
            ]}
            onOpen={(review) =>
              setParams((previous) => {
                const next = new URLSearchParams(previous)
                next.set('reviewId', review.id)
                next.delete('itemPage')
                return next
              })
            }
          />
        )}
        <ManagerPagination pagination={query.data?.data?.pagination} onPage={paging.onPage} busy={query.isFetching} />
      </ManagerSection>
      {isResourceId(id) && <ReviewDetail key={id} id={id} />}
    </div>
  )
}
function ReviewDetail({ id }: { id: string }) {
  const { t: translate } = useTranslation('manager')
  const query = useTransferReviewGet(id)
  const review = !query.isError ? query.data?.data : null
  return (
    <ManagerSection title={translate('transfers')}>
      <ManagerQueryState query={query} empty={!review} />
      {review && (
        <>
          <h3 className='truncate font-medium' title={review.employee.fullName}>
            {review.employee.fullName}
          </h3>
          <ManagerStatus value={review.status} />
          <ReviewItems id={id} canDecide={review.canDecide && review.status === TRANSFER_REVIEW_STATUS.OPEN} />
        </>
      )}
    </ManagerSection>
  )
}
function ReviewItems({ id, canDecide }: { id: string; canDecide: boolean }) {
  const { t: translate } = useTranslation('manager')
  const paging = useManagerPage('itemPage')
  const query = useTransferReviewItemList(id, { page: paging.page, pageSize: paging.pageSize })
  const [selected, setSelected] = useState<string | null>(null)
  return (
    <div>
      <ManagerQueryState query={query} empty={!query.data?.data?.items.length} />
      {!query.isError &&
        query.data?.data?.items.map((item) => (
          <article
            key={item.assignmentId}
            className='flex flex-wrap items-center justify-between gap-3 border-b border-border/40 py-4'
          >
            <div className='min-w-0'>
              <h3 className='truncate text-sm font-medium' title={item.application.name}>
                {item.application.name}
              </h3>
              <p className='truncate text-xs text-muted-foreground' title={item.plan.name}>
                {item.plan.name}
              </p>
              {item.needsNewRequest && (
                <p className='mt-2 max-w-md text-xs text-warning'>{translate('needsNewRequest')}</p>
              )}
            </div>
            <ManagerStatus value={item.decision} />
            {canDecide && item.decision === TRANSFER_ITEM_DECISION.PENDING && (
              <ManagerButton onClick={() => setSelected(item.assignmentId)}>{translate('decision')}</ManagerButton>
            )}
          </article>
        ))}
      <ManagerPagination pagination={query.data?.data?.pagination} onPage={paging.onPage} busy={query.isFetching} />
      {selected && <Decision id={id} assignmentId={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
function Decision({ id, assignmentId, onClose }: { id: string; assignmentId: string; onClose: () => void }) {
  const { t: translate } = useTranslation('manager')
  const [decision, setDecision] = useState<DecideTransferReviewBodyDto['decision']>(TRANSFER_DECISION.NOT_NEEDED)
  const action = useManagerAction({
    mutationFn: (body: DecideTransferReviewBodyDto) => transferReviewDecide(id, body),
    invalidate: [
      getTransferReviewListQueryKey(),
      getTransferReviewGetQueryKey(id),
      getTransferReviewItemListQueryKey(id)
    ],
    onSuccess: onClose
  })
  return (
    <Dialog
      presentation='sheet'
      title={translate('decision')}
      hint={translate('transferHint')}
      onClose={() => {
        if (!action.isPending) onClose()
      }}
    >
      <ManagerFormErrors fields={action.fields}>
        <form
          className='space-y-4'
          onSubmit={(event) => {
            event.preventDefault()
            if (action.blocked) return
            const note = String(new FormData(event.currentTarget).get('newToolNote') ?? '').trim()
            action.mutate({ assignmentId, decision, ...(note ? { newToolNote: note } : {}) })
          }}
        >
          <fieldset disabled={action.blocked} className='space-y-4'>
            <ManagerField label={translate('decision')}>
              <select
                name='decision'
                className={managerInputClass}
                value={decision}
                onChange={(event) => {
                  const value = Object.values(TRANSFER_DECISION).find((choice) => choice === event.target.value)
                  if (value) setDecision(value)
                }}
              >
                {Object.values(TRANSFER_DECISION).map((choice) => (
                  <option key={choice} value={choice}>
                    {translate(`statuses.${choice}`)}
                  </option>
                ))}
              </select>
            </ManagerField>
            {decision === TRANSFER_DECISION.NEEDS_NEW_TOOL && (
              <ManagerField label={translate('newToolNote')}>
                <textarea className={managerInputClass} name='newToolNote' maxLength={500} required />
              </ManagerField>
            )}
          </fieldset>
          <ManagerActionState action={action} />
          <div className='flex justify-end'>
            <ManagerButton primary type='submit' disabled={action.blocked} busy={action.isPending}>
              {action.retrySeconds ? translate('retryAfter', { seconds: action.retrySeconds }) : translate('confirm')}
            </ManagerButton>
          </div>
        </form>
      </ManagerFormErrors>
    </Dialog>
  )
}
