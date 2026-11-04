import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHandoverDutyGet } from '~/shared/api/generated/operations/handover-duties/handover-duty-get'
import { useHandoverDutyConfirm } from '~/shared/api/generated/operations/handover-duties/handover-duty-confirm'
import { usePlanGet } from '~/shared/api/generated/operations/plans/plan-get'
import { getAssignmentExpiryQueueListQueryKey } from '~/shared/api/generated/operations/assignment-expiry/assignment-expiry-queue-list'
import { ConfirmHandoverBodyDtoValue } from '~/shared/api/generated/model/handover-duties/confirmHandoverBodyDtoValue'
import type { ExpiryQueuePageResponseDtoDataItemsItemHandover } from '~/shared/api/generated/model/assignment-expiry'
import { useDashboardFormat } from '../../../dashboard-ui'
import { ItQueryState } from '../../shared/components/it-query-state'
import { ItFormDialog, itButtonClass } from '../../shared/components/it-form'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
import { HandoverStatus } from '../enums/handover-status'
import { HandoverRole } from '../enums/handover-role'

export function ExpiryHandover({
  handover
}: {
  handover: NonNullable<ExpiryQueuePageResponseDtoDataItemsItemHandover>
}) {
  const { t: translate } = useTranslation('itProvisioning')
  const { formatDate } = useDashboardFormat()
  const [open, setOpen] = useState(false)
  return (
    <div className='space-y-2 border-t border-border/50 pt-3'>
      <p className='text-sm'>
        {translate('handover.title')}
        <span aria-hidden> · </span>
        {translate(`handover.values.${handover.status}`, { defaultValue: translate('unavailable') })}
      </p>
      <p className='text-xs text-muted-foreground'>
        {translate(`handover.values.${handover.role}`, { defaultValue: translate('unavailable') })}
        <span aria-hidden> · </span>
        {formatDate(handover.dueOn)}
      </p>
      <button type='button' className={itButtonClass} onClick={() => setOpen(true)}>
        {translate('handover.details')}
      </button>
      {open && <ExpiryHandoverDialog id={handover.dutyId} onClose={() => setOpen(false)} />}
    </div>
  )
}
export function ExpiryHandoverDialog({ id, onClose }: { id: string; onClose: () => void }) {
  const { t: translate } = useTranslation('itProvisioning')
  const { formatDate } = useDashboardFormat()
  const detail = useHandoverDutyGet(id, { query: { staleTime: 0, refetchOnMount: 'always' } })
  const duty = detail.data?.data
  const plan = usePlanGet(duty?.plan.id ?? '', { query: { enabled: !!duty?.plan.id } })
  const feedback = useItMutationFeedback([detail.queryKey, getAssignmentExpiryQueueListQueryKey()], onClose)
  const mutation = useHandoverDutyConfirm({ mutation: feedback })
  const allowed =
    !!duty?.canConfirm &&
    duty.role === HandoverRole.IT_ADMIN &&
    duty.status === HandoverStatus.OPEN &&
    !detail.isFetching &&
    !detail.isError
  return (
    <ItFormDialog
      title={translate('handover.title')}
      pending={mutation.isPending}
      submitDisabled={!allowed}
      submitLabel={translate('handover.confirm')}
      onClose={onClose}
      onSubmit={(event) => {
        event.preventDefault()
        if (allowed && !mutation.isPending)
          mutation.mutate({ id, data: { value: ConfirmHandoverBodyDtoValue.HANDLED } })
      }}
    >
      <ItQueryState query={detail}>
        {duty && (
          <>
            <dl className='grid gap-3 text-sm sm:grid-cols-2'>
              <div>
                <dt className='text-muted-foreground'>{translate('handover.confirmer')}</dt>
                <dd>{duty.confirmer?.fullName ?? translate('unavailable')}</dd>
              </div>
              <div>
                <dt className='text-muted-foreground'>{translate('handover.dueOn')}</dt>
                <dd className='text-right font-mono tabular-nums'>{formatDate(duty.dueOn)}</dd>
              </div>
            </dl>
            {duty.noticeText && <p className='whitespace-pre-wrap break-words text-sm'>{duty.noticeText}</p>}
            {duty.waitingReason && (
              <p className='text-sm text-warning-ink'>
                {translate(`handover.values.${duty.waitingReason}`, { defaultValue: translate('unavailable') })}
              </p>
            )}
            {!allowed && <p className='text-sm text-muted-foreground'>{translate('handover.notConfirmer')}</p>}
          </>
        )}
      </ItQueryState>
      {duty && (
        <ItQueryState query={plan}>
          {plan.data?.data?.revocationNote && (
            <p className='whitespace-pre-wrap break-words text-sm'>{plan.data.data.revocationNote}</p>
          )}
        </ItQueryState>
      )}
    </ItFormDialog>
  )
}
