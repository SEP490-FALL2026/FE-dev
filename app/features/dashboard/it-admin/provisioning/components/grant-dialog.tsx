import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { planGet } from '~/shared/api/generated/operations/plans/plan-get'
import {
  subscriptionList,
  getSubscriptionListQueryKey
} from '~/shared/api/generated/operations/subscriptions/subscription-list'
import { subscriptionSeatUsage } from '~/shared/api/generated/operations/subscriptions/subscription-seat-usage'
import {
  provisioningTaskGrant,
  getProvisioningTaskListQueryKey
} from '~/shared/api/generated/operations/provisioning-tasks'
import { getGrantQueueListQueryKey } from '~/shared/api/generated/operations/grant-queue/grant-queue-list'
import type { GrantQueueResponseDtoDataItemsItem, GrantBodyDto } from '~/shared/api/generated/model'
import { ItChoiceSelect } from '../../shared/components/it-choice-select'
import { ItQueryState } from '../../shared/components/it-query-state'
import { ItField, ItFormDialog, itInputClass } from '../../shared/components/it-form'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
import { allProvisioningPages, provisioningMembersQueryOptions } from '../hooks/use-provisioning-departments'

export function GrantDialog({
  request,
  department,
  onClose,
  onCreated
}: {
  request: GrantQueueResponseDtoDataItemsItem
  department: { id: string; name: string }
  onClose: () => void
  onCreated: (id: string) => void
}) {
  const { t: translate, i18n } = useTranslation('itProvisioning')
  const [draft, setDraft] = useState<GrantBodyDto>({
    requestId: request.requestId,
    beneficiaryEmployeeId: request.beneficiary.employeeId
  })
  const members = useQuery({
    ...provisioningMembersQueryOptions(department.id),
    enabled: request.type === 'SERVICE_ACCOUNT'
  })
  const availability = useQuery({
    queryKey: [...getSubscriptionListQueryKey(), 'grant-availability', request.plan.planId, department.id],
    queryFn: async () => {
      const plan = await planGet(request.plan.planId)
      const type = plan.data?.provisioningType
      if (!type) throw new Error('Missing provisioning type')
      if (type === 'K5' || type === 'K3' || type === 'K4') return { type, subscriptions: [] }
      const purchases = await allProvisioningPages((page) =>
        subscriptionList({ planId: request.plan.planId, status: 'ACTIVE', page, pageSize: 100 })
      )
      const subscriptions = await Promise.all(
        purchases
          .filter((item) => item.ownerDepartmentId === department.id)
          .map(async (item) => {
            const usage = await subscriptionSeatUsage(item.id)
            if (!usage.data) throw new Error('Missing seat availability')
            return { ...item, usage: usage.data }
          })
      )
      return {
        type,
        subscriptions: subscriptions.filter((item) => {
          const today = item.usage.asOf
          return (
            item.usage.free !== null &&
            item.usage.free > 0 &&
            !!item.startDate &&
            !!item.endDate &&
            item.startDate <= today &&
            item.endDate >= today
          )
        })
      }
    }
  })
  const feedback = useItMutationFeedback([
    getGrantQueueListQueryKey(),
    getProvisioningTaskListQueryKey(),
    getSubscriptionListQueryKey()
  ])
  const mutation = useMutation({
    mutationFn: () => provisioningTaskGrant(draft),
    onError: async (error) => {
      await feedback.onError(error)
      await availability.refetch()
    },
    onSuccess: async (result) => {
      await feedback.onSuccess()
      if (result.data?.task.id) onCreated(result.data.task.id)
      onClose()
    }
  })
  const internal = availability.data?.type === 'K5'
  const unsupported = availability.data?.type === 'K3' || availability.data?.type === 'K4'
  const eligible = availability.data?.subscriptions ?? []
  const canSubmit =
    availability.isSuccess &&
    !availability.isFetching &&
    !unsupported &&
    (internal || eligible.some((item) => item.id === draft.subscriptionId)) &&
    (request.type !== 'SERVICE_ACCOUNT' ||
      (members.isSuccess &&
        !members.isFetching &&
        !!draft.accountIdentifier?.trim() &&
        (!draft.responsibleEmployeeId ||
          members.data.some(
            (member) => member.id === draft.responsibleEmployeeId && member.employmentStatus === 'WORKING'
          ))))
  const date = (value: string | null) =>
    value
      ? new Intl.DateTimeFormat(i18n.language, { dateStyle: 'medium' }).format(new Date(`${value}T00:00:00`))
      : translate('unavailable')
  return (
    <ItFormDialog
      wide
      title={translate('startGrant')}
      onClose={onClose}
      pending={mutation.isPending}
      submitDisabled={!canSubmit}
      submitLabel={translate('confirm')}
      onSubmit={(event) => {
        event.preventDefault()
        if (canSubmit && !mutation.isPending) mutation.mutate()
      }}
    >
      <p className='text-sm text-muted-foreground'>{translate('grantHint')}</p>
      <dl className='grid gap-3 text-sm sm:grid-cols-2'>
        <div>
          <dt className='text-muted-foreground'>{translate('beneficiary')}</dt>
          <dd className='break-words'>{request.beneficiary.fullName}</dd>
        </div>
        <div>
          <dt className='text-muted-foreground'>{translate('department')}</dt>
          <dd>{department.name}</dd>
        </div>
        <div className='sm:col-span-2'>
          <dt className='text-muted-foreground'>{translate('softwarePlan')}</dt>
          <dd>
            {request.plan.applicationName} · {request.plan.planName}
          </dd>
        </div>
      </dl>
      <ItQueryState query={availability}>
        {internal ? (
          <p className='text-sm text-muted-foreground'>{translate('internalGrant')}</p>
        ) : unsupported ? (
          <p role='status' className='text-sm'>
            {translate('unsupportedGrant')}
          </p>
        ) : eligible.length ? (
          <ItChoiceSelect
            label={translate('subscription')}
            value={draft.subscriptionId ?? ''}
            disabled={mutation.isPending || availability.isFetching}
            options={eligible.map((item, index) => ({
              value: item.id,
              label: translate('subscriptionOption', { name: item.planName, number: index + 1 }),
              description: translate('subscriptionCapacity', {
                free: item.usage.free,
                purchased: item.usage.purchased,
                start: date(item.startDate),
                end: date(item.endDate)
              })
            }))}
            onChange={(subscriptionId) => setDraft((previous) => ({ ...previous, subscriptionId }))}
          />
        ) : (
          <p role='status' className='text-sm'>
            {translate('noAvailableSubscription')}
          </p>
        )}
      </ItQueryState>
      <ItField
        label={translate('account')}
        hint={translate(request.type === 'SERVICE_ACCOUNT' ? 'serviceAccountRequired' : 'accountHint')}
      >
        <input
          className={itInputClass}
          maxLength={254}
          required={request.type === 'SERVICE_ACCOUNT'}
          disabled={mutation.isPending}
          placeholder={translate('placeholders.account')}
          value={draft.accountIdentifier ?? ''}
          onChange={(event) =>
            setDraft((previous) => ({ ...previous, accountIdentifier: event.target.value || undefined }))
          }
        />
      </ItField>
      {request.type === 'SERVICE_ACCOUNT' && (
        <ItQueryState query={members}>
          <ItChoiceSelect
            label={translate('accountOwner')}
            value={draft.responsibleEmployeeId ?? ''}
            disabled={mutation.isPending || members.isFetching}
            options={[
              { value: '', label: translate('approvedResponsible') },
              ...(members.data ?? [])
                .filter((member) => member.employmentStatus === 'WORKING')
                .map((member) => ({ value: member.id, label: member.fullName, description: member.code }))
            ]}
            onChange={(value) => setDraft((previous) => ({ ...previous, responsibleEmployeeId: value || undefined }))}
          />
        </ItQueryState>
      )}
      {request.expectedEndDate && (
        <p className='text-sm'>
          {translate('expectedEndDate')}: {date(request.expectedEndDate)}
        </p>
      )}
    </ItFormDialog>
  )
}
