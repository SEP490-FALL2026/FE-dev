import { ItChoiceSelect } from '../../shared/components/it-choice-select'
import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import {
  grantQueueList,
  getGrantQueueListQueryKey
} from '~/shared/api/generated/operations/grant-queue/grant-queue-list'
import {
  provisioningTaskGrant,
  getProvisioningTaskListQueryKey
} from '~/shared/api/generated/operations/provisioning-tasks'
import {
  subscriptionList,
  getSubscriptionListQueryKey
} from '~/shared/api/generated/operations/subscriptions/subscription-list'
import type { GrantQueueResponseDtoDataItemsItem, GrantBodyDto } from '~/shared/api/generated/model'
import { ItEmpty, ItQueryState } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { ItField, ItFormDialog, itInputClass, itButtonClass } from '../../shared/components/it-form'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
import { ServiceAccountReviewDialog } from './service-account-review-dialog'
import { BoundaryState } from '../enums/boundary-state'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'

function GrantDialog({
  request,
  onClose,
  onCreated,
  ready
}: {
  request: GrantQueueResponseDtoDataItemsItem
  onClose: () => void
  onCreated: (id: string) => void
  ready: boolean
}) {
  const { t: translate } = useTranslation('itProvisioning')
  const { formatNumber } = useWorkspaceFormat()
  const [draft, setDraft] = useState<GrantBodyDto>({
    requestId: request.requestId,
    beneficiaryEmployeeId: request.beneficiary.employeeId
  })
  const [page, setPage] = useState(1)
  const [purchase, setPurchase] = useState(false)
  const [purchaseReason, setPurchaseReason] = useState('')
  const canPurchase = ['SEATS', 'KEYS'].includes(request.stock?.kind) && request.stock.free === 0
  const needsPurchaseReason = canPurchase && request.stock.inRevocation > 0
  const subscriptions = useQuery({
    queryKey: getSubscriptionListQueryKey({ planId: request.plan.planId, status: 'ACTIVE', page, pageSize: 20 }),
    queryFn: () => subscriptionList({ planId: request.plan.planId, status: 'ACTIVE', page, pageSize: 20 })
  })
  const feedback = useItMutationFeedback([
    ['it-provisioning'],
    ['it-grant-queue'],
    ['it-catalog'],
    getGrantQueueListQueryKey(),
    getProvisioningTaskListQueryKey(),
    getSubscriptionListQueryKey()
  ])
  const mutation = useMutation({
    retry: false,
    mutationFn: () =>
      provisioningTaskGrant({
        ...draft,
        ...(canPurchase && purchase ? { purchase: purchaseReason.trim() ? { reason: purchaseReason.trim() } : {} } : {})
      }),
    onError: feedback.onError,
    onSuccess: async (result) => {
      await feedback.onSuccess()
      if (result.data?.task.id) onCreated(result.data.task.id)
      onClose()
    }
  })
  const data = subscriptions.data?.data
  function update(key: keyof GrantBodyDto, value: string) {
    setDraft((previous) => ({ ...previous, [key]: value.trim() || undefined }))
  }
  return (
    <ItFormDialog
      wide
      title={translate('startGrant')}
      onClose={onClose}
      pending={mutation.isPending}
      submitDisabled={!ready || (canPurchase && (!purchase || (needsPurchaseReason && !purchaseReason.trim())))}
      onSubmit={(event) => {
        event.preventDefault()
        if (!mutation.isPending) mutation.mutate()
      }}
      submitLabel={translate('confirm')}
    >
      <p className='text-sm text-muted-foreground'>{translate('grantHint')}</p>
      {!ready && (
        <p role='status' className='text-sm text-warning'>
          {translate('grantQueueChanged')}
        </p>
      )}
      <p className='text-sm'>
        {request.plan.applicationName} · {request.plan.planName} · {request.beneficiary.fullName}
      </p>
      {request.stock && request.stock.kind !== 'NONE' && (
        <p className='text-sm text-muted-foreground'>
          {translate('stockSummary', {
            free: formatNumber(request.stock.free),
            revoking: formatNumber(request.stock.inRevocation)
          })}
        </p>
      )}
      {canPurchase && (
        <>
          <label className='flex min-h-11 items-center gap-3 text-sm'>
            <input type='checkbox' checked={purchase} onChange={(event) => setPurchase(event.target.checked)} />
            {translate('purchaseWhenEmpty')}
          </label>
          {purchase && (
            <ItField
              label={translate('purchaseReason')}
              hint={translate(needsPurchaseReason ? 'purchaseReasonRequired' : 'purchaseReasonOptional')}
            >
              <textarea
                className={itInputClass}
                required={needsPurchaseReason}
                maxLength={500}
                value={purchaseReason}
                onChange={(event) => setPurchaseReason(event.target.value)}
              />
            </ItField>
          )}
        </>
      )}
      <ItQueryState query={subscriptions}>
        <ItChoiceSelect
          label={translate('subscription')}
          value={draft.subscriptionId ?? ''}
          options={[
            { value: '', label: translate('automaticSubscription') },
            ...(data?.items.map((item) => ({ value: item.id, label: item.planName, description: item.id })) ?? [])
          ]}
          onChange={(value) => update('subscriptionId', value)}
        />
        {data && (
          <ItPagination
            page={page}
            pageSize={20}
            total={data.pagination.totalItems}
            onChange={setPage}
            disabled={mutation.isPending}
          />
        )}
      </ItQueryState>
      <ItField label={translate('account')}>
        <input
          className={itInputClass}
          maxLength={254}
          placeholder={translate('placeholders.account')}
          value={draft.accountIdentifier ?? ''}
          onChange={(event) =>
            setDraft((previous) => ({ ...previous, accountIdentifier: event.target.value || undefined }))
          }
        />
      </ItField>
      {request.expectedEndDate && (
        <p className='text-sm'>
          {translate('expectedEndDate')}: {request.expectedEndDate}
        </p>
      )}
      {request.type === 'SERVICE_ACCOUNT' && (
        <ItField label={translate('responsibleEmployeeId')}>
          <input
            className={itInputClass}
            pattern='[0-9a-fA-F-]{36}'
            placeholder={translate('placeholders.employeeId')}
            value={draft.responsibleEmployeeId ?? ''}
            onChange={(event) => update('responsibleEmployeeId', event.target.value)}
          />
        </ItField>
      )}
    </ItFormDialog>
  )
}

export function ProvisioningGrantQueue({ onCreated }: { onCreated: (id: string) => void }) {
  const { t: translate } = useTranslation('itProvisioning')
  const [page, setPage] = useState(1)
  const [employee, setEmployee] = useState('')
  const [filter, setFilter] = useState('')
  const [selected, setSelected] = useState<GrantQueueResponseDtoDataItemsItem | null>(null)
  const [reviewId, setReviewId] = useState<string | null>(null)
  const query = useQuery({
    queryKey: getGrantQueueListQueryKey({ page, pageSize: 20, ...(filter ? { beneficiaryEmployeeId: filter } : {}) }),
    queryFn: () => grantQueueList({ page, pageSize: 20, ...(filter ? { beneficiaryEmployeeId: filter } : {}) })
  })
  const data = query.data?.data
  const selectedRequest = data?.items.find(
    (item) =>
      selected &&
      item.requestId === selected.requestId &&
      item.beneficiary.employeeId === selected.beneficiary.employeeId
  )
  return (
    <div className='space-y-4'>
      <form
        className='flex flex-wrap items-end gap-3'
        onSubmit={(event) => {
          event.preventDefault()
          setFilter(employee.trim())
          setPage(1)
        }}
      >
        <div className='w-full sm:max-w-sm'>
          <ItField label={translate('beneficiaryFilter')}>
            <input
              className={itInputClass}
              value={employee}
              pattern='[0-9a-fA-F-]{36}'
              placeholder={translate('employeeIdHint')}
              onChange={(event) => setEmployee(event.target.value)}
            />
          </ItField>
        </div>
        <button type='submit' className={itButtonClass}>
          {translate('applyFilter')}
        </button>
      </form>
      <ItQueryState query={query}>
        {data?.items.length ? (
          <div className='space-y-3'>
            {data.items.map((item) => (
              <article
                key={`${item.requestId}-${item.beneficiary.employeeId}`}
                className='flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface p-4'
              >
                <div className='min-w-0 flex-1'>
                  <h2 className='truncate font-medium' title={`${item.plan.applicationName} · ${item.plan.planName}`}>
                    {item.plan.applicationName} · {item.plan.planName}
                  </h2>
                  <p className='truncate text-sm text-muted-foreground' title={item.beneficiary.fullName}>
                    {item.beneficiary.fullName} · {translate(`values.${item.type}`)}
                  </p>
                  {item.type === 'SERVICE_ACCOUNT' && item.boundaryState !== BoundaryState.ACCEPTED && (
                    <p className='mt-1 text-sm text-muted-foreground'>{translate('boundaryRequired')}</p>
                  )}
                </div>
                <button
                  className={itButtonClass}
                  disabled={item.type === 'SERVICE_ACCOUNT' && item.boundaryState !== BoundaryState.ACCEPTED}
                  onClick={() => setSelected(item)}
                >
                  {translate('startGrant')}
                </button>
                {item.type === 'SERVICE_ACCOUNT' && item.boundaryState === BoundaryState.PENDING && (
                  <button className={itButtonClass} onClick={() => setReviewId(item.requestId)}>
                    {translate('reviewBoundary')}
                  </button>
                )}
              </article>
            ))}
          </div>
        ) : (
          <ItEmpty />
        )}
      </ItQueryState>
      {data && <ItPagination page={page} pageSize={20} total={data.pagination.totalItems} onChange={setPage} />}
      {selected && (
        <GrantDialog
          request={selectedRequest ?? selected}
          ready={!!selectedRequest && !query.isError && !query.isFetching}
          onCreated={onCreated}
          onClose={() => setSelected(null)}
        />
      )}
      {reviewId && <ServiceAccountReviewDialog requestId={reviewId} onClose={() => setReviewId(null)} />}
    </div>
  )
}
