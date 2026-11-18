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
import type {
  GrantQueueResponseDtoDataItemsItem,
  GrantBodyDto,
  GrantQueueListState
} from '~/shared/api/generated/model'
import { ItEmpty, ItQueryState } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { ItField, ItFormDialog, itInputClass, itButtonClass } from '../../shared/components/it-form'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
import { BoundaryState } from '../enums/boundary-state'
import { grantStockDecision } from '../grant-stock'
import { ItDirectoryLookup } from '../../shared/components/it-directory-lookup'
import { allProvisioningPages } from '../hooks/use-provisioning-departments'
import { useAccumulatedOptions } from '../../shared/hooks/use-accumulated-options'

function GrantDialog({
  request,
  onClose,
  onCreated
}: {
  request: GrantQueueResponseDtoDataItemsItem
  onClose: () => void
  onCreated: (id: string) => void
}) {
  const { t: translate } = useTranslation('itProvisioning')
  const { t: translatePlaceholder } = useTranslation('itPlaceholders')
  const [draft, setDraft] = useState<GrantBodyDto>({
    requestId: request.requestId,
    beneficiaryEmployeeId: request.beneficiary.employeeId
  })
  const [page, setPage] = useState(1)
  const [purchaseReason, setPurchaseReason] = useState('')
  const [purchaseConfirmed, setPurchaseConfirmed] = useState(false)
  const needsPurchase = !!request.stock && request.stock.kind !== 'NONE' && request.stock.free === 0
  const decision = request.stock ? grantStockDecision(request.stock, purchaseReason) : { allowed: false as const }
  const canSubmit = decision.allowed && (!needsPurchase || purchaseConfirmed)
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
    mutationFn: () =>
      provisioningTaskGrant({
        ...draft,
        ...(decision.allowed && 'purchase' in decision ? { purchase: decision.purchase } : {})
      }),
    onError: feedback.onError,
    onSuccess: async (result) => {
      await feedback.onSuccess()
      if (result.data?.task.id) onCreated(result.data.task.id)
      onClose()
    }
  })
  const data = subscriptions.data?.data
  const subscriptionOptions = useAccumulatedOptions({
    page,
    items: data?.items,
    resetKey: request.plan.planId,
    onReset: () => setPage(1),
    toOption: (item) => ({ value: item.id, label: item.planName })
  })
  function update(key: keyof GrantBodyDto, value: string) {
    setDraft((previous) => ({ ...previous, [key]: value.trim() || undefined }))
  }
  return (
    <ItFormDialog
      wide
      title={translate('startGrant')}
      onClose={onClose}
      pending={mutation.isPending}
      submitDisabled={!canSubmit}
      onSubmit={(event) => {
        event.preventDefault()
        if (!mutation.isPending && canSubmit) mutation.mutate()
      }}
      submitLabel={translate('confirm')}
    >
      <p className='text-sm text-muted-foreground'>{translate('grantHint')}</p>
      <p className='text-sm'>
        {request.plan.applicationName} · {request.plan.planName} · {request.beneficiary.fullName}
      </p>
      {!request.stock && (
        <p role='status' className='text-sm'>
          {translate('stockUnavailable')}
        </p>
      )}
      {request.stock && request.stock.kind !== 'NONE' && (
        <div className='space-y-3'>
          <p className='text-sm'>
            {translate('stockSummary', { free: request.stock.free, reclaiming: request.stock.inRevocation })}
          </p>
          {needsPurchase && (
            <label className='flex min-h-11 items-center gap-2 text-sm'>
              <input
                type='checkbox'
                checked={purchaseConfirmed}
                onChange={(event) => setPurchaseConfirmed(event.target.checked)}
              />
              {translate('purchaseWhenEmpty')}
            </label>
          )}
          {request.stock.free === 0 && (
            <ItField
              label={translate('purchaseReason')}
              hint={translate(request.stock.inRevocation > 0 ? 'purchaseReasonRequired' : 'purchaseReasonOptional')}
            >
              <input
                placeholder={translatePlaceholder('purchaseReason')}
                className={itInputClass}
                maxLength={500}
                required={request.stock.inRevocation > 0}
                value={purchaseReason}
                onChange={(event) => setPurchaseReason(event.target.value)}
              />
            </ItField>
          )}
        </div>
      )}
      <ItChoiceSelect
        label={translate('subscription')}
        value={draft.subscriptionId ?? ''}
        options={[{ value: '', label: translate('automaticSubscription') }, ...subscriptionOptions]}
        loading={subscriptions.isFetching}
        disabled={subscriptions.isError || mutation.isPending}
        hasMore={!!data && page * 20 < data.pagination.totalItems}
        onLoadMore={() => setPage((current) => current + 1)}
        onChange={(value) => update('subscriptionId', value)}
      />
      <ItField label={translate('account')} hint={translate('accountHint')}>
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
        <ItDirectoryLookup
          mode='employee'
          label={translate('responsibleEmployeeId')}
          hint={translate('responsibleEmployeeHint')}
          value={draft.responsibleEmployeeId ?? ''}
          onSelect={(id) => update('responsibleEmployeeId', id)}
        />
      )}
    </ItFormDialog>
  )
}

export function ProvisioningGrantQueue({
  onCreated,
  context
}: {
  onCreated: (id: string) => void
  context?: { departmentId: string; employeeId: string }
}) {
  const { t: translate } = useTranslation('itProvisioning')
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState('')
  const [state, setState] = useState<GrantQueueListState | undefined>('WAITING')
  const [selected, setSelected] = useState<GrantQueueResponseDtoDataItemsItem | null>(null)
  const params = {
    page,
    pageSize: 20,
    state: context ? undefined : state,
    ...((context?.employeeId ?? filter) ? { beneficiaryEmployeeId: context?.employeeId ?? filter } : {})
  }
  const query = useQuery({
    queryKey: [...getGrantQueueListQueryKey(params), context, page],
    queryFn: async () => {
      if (!context) return grantQueueList(params)
      const items = await allProvisioningPages((nextPage) =>
        grantQueueList({ ...params, page: nextPage, pageSize: 100 })
      )
      const scoped = items.filter((item) => item.department?.id === context.departmentId)
      return { data: { items: scoped.slice((page - 1) * 20, page * 20), pagination: { totalItems: scoped.length } } }
    }
  })
  const data = query.data?.data
  return (
    <div className='space-y-4'>
      {!context && (
        <div className='soft-panel space-y-3 p-4'>
          <div className='grid gap-3 lg:max-w-3xl'>
            <ItDirectoryLookup
              mode='employee'
              clearable
              label={translate('beneficiaryFilter')}
              hint={translate('beneficiaryFilterHint')}
              value={filter}
              onSelect={(id) => {
                setFilter(id)
                setPage(1)
              }}
            />
          </div>
          <div className='flex flex-wrap gap-2' role='group' aria-label={translate('executionFilter')}>
            {([undefined, 'WAITING', 'EXECUTING', 'DONE'] as const).map((value) => (
              <button
                key={value ?? 'all'}
                type='button'
                className={itButtonClass}
                aria-pressed={state === value}
                onClick={() => {
                  setState(value)
                  setPage(1)
                }}
              >
                {translate(value ? `grantStates.${value}` : 'allStatuses')}
              </button>
            ))}
          </div>
        </div>
      )}
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
                  {item.department?.name && <p className='text-sm text-muted-foreground'>{item.department.name}</p>}
                  <p className='text-sm'>
                    {translate(`grantStates.${item.state}`, { defaultValue: translate('unavailable') })}
                  </p>
                  {item.type === 'SERVICE_ACCOUNT' && item.boundaryState !== BoundaryState.ACCEPTED && (
                    <p className='mt-1 text-sm text-muted-foreground'>{translate('boundaryRequired')}</p>
                  )}
                </div>
                <button
                  className={itButtonClass}
                  disabled={
                    item.state !== 'WAITING' ||
                    (item.type === 'SERVICE_ACCOUNT' && item.boundaryState !== BoundaryState.ACCEPTED)
                  }
                  onClick={() => setSelected(item)}
                >
                  {translate('startGrant')}
                </button>
                {item.execution && (
                  <button type='button' className={itButtonClass} onClick={() => onCreated(item.execution!.taskId)}>
                    {translate('viewExecution')}
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
          request={
            data?.items.find(
              (item) =>
                item.requestId === selected.requestId && item.beneficiary.employeeId === selected.beneficiary.employeeId
            ) ?? selected
          }
          onCreated={onCreated}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
