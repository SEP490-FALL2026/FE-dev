import { useState } from 'react'
import { ArrowLeft, Undo2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  useReturnRequestGet,
  getReturnRequestGetQueryKey
} from '~/shared/api/generated/operations/return-requests/return-request-get'
import { getReturnRequestListQueryKey } from '~/shared/api/generated/operations/return-requests/return-request-list'
import { returnRequestHandoverConfirm } from '~/shared/api/generated/operations/return-requests/return-request-handover-confirm'
import { Dialog, useDashboardFormat } from '../../../dashboard-ui'
import { useManagerAction } from '../../shared/hooks/use-manager-action'
import { ManagerPageHeader } from '../../shared/components/manager-page-header'
import {
  ManagerActionState,
  ManagerButton,
  ManagerQueryState,
  ManagerSection,
  ManagerStatus
} from '../../shared/components/manager-api-ui'
import { RETURN_STATE } from '../enums/return-state'

export function ManagerReturnDetail({
  id,
  employeeId,
  onBack
}: {
  id: string
  employeeId: string
  onBack: () => void
}) {
  const { t: translate } = useTranslation('manager')
  const { formatDate, formatDateTime } = useDashboardFormat()
  const [confirming, setConfirming] = useState(false)
  const query = useReturnRequestGet(id)
  const request = !query.isError ? query.data?.data?.returnRequest : null
  // The handover is confirmed by the person who sent this return; reading it as head does not confer that action.
  const canConfirm =
    request?.state === RETURN_STATE.AWAITING_REVOCATION &&
    request.handover.required &&
    !request.handover.confirmed &&
    request.requestedBy.employeeId === employeeId
  const action = useManagerAction({
    mutationFn: () => returnRequestHandoverConfirm(id),
    invalidate: [getReturnRequestGetQueryKey(id), getReturnRequestListQueryKey()],
    onSuccess: () => setConfirming(false)
  })
  return (
    <div className='space-y-5'>
      <ManagerPageHeader
        title={translate('integration.returnDetail')}
        icon={Undo2}
        actions={
          <ManagerButton onClick={onBack}>
            <ArrowLeft aria-hidden strokeWidth={1.5} className='size-4' />
            {translate('back')}
          </ManagerButton>
        }
      />
      <ManagerSection title={request?.plan.applicationName}>
        <ManagerQueryState query={query} empty={!request} />
        {request && (
          <>
            <ManagerStatus value={request.state} />
            <dl className='grid gap-4 text-sm sm:grid-cols-2'>
              <div>
                <dt className='text-muted-foreground'>{translate('plan')}</dt>
                <dd>{request.plan.planName}</dd>
              </div>
              <div>
                <dt className='text-muted-foreground'>{translate('employee')}</dt>
                <dd>{request.holder.fullName}</dd>
              </div>
              <div>
                <dt className='text-muted-foreground'>{translate('integration.requester')}</dt>
                <dd>{request.requestedBy.fullName}</dd>
              </div>
              <div className='text-right'>
                <dt className='text-muted-foreground'>{translate('integration.requestedOn')}</dt>
                <dd className='font-mono tabular-nums'>{formatDate(request.requestedOn)}</dd>
              </div>
            </dl>
            <p className='whitespace-pre-wrap break-words text-sm'>{request.reason}</p>
            <p className='text-sm text-muted-foreground'>{translate('integration.returnHint')}</p>
            {request.revocationNote && (
              <p className='whitespace-pre-wrap break-words text-sm'>{request.revocationNote}</p>
            )}
            {request.failureReason && (
              <p className='whitespace-pre-wrap break-words text-sm text-danger'>{request.failureReason}</p>
            )}
            {request.handover.required && (
              <div className='space-y-3 border-t border-border/60 pt-4'>
                <p className='text-sm'>
                  {translate(request.handover.confirmed ? 'integration.handoverDone' : 'integration.handoverNeeded')}
                </p>
                {request.handover.dueOn && (
                  <p className='text-right font-mono text-sm tabular-nums'>{formatDate(request.handover.dueOn)}</p>
                )}
                {request.handoverConfirmedAt && (
                  <p className='text-right font-mono text-xs tabular-nums'>
                    {formatDateTime(request.handoverConfirmedAt)}
                  </p>
                )}
                {request.handover.flagged && (
                  <p className='text-sm text-warning-ink'>{translate('integration.handoverFlagged')}</p>
                )}
                {canConfirm && (
                  <ManagerButton primary disabled={action.blocked} onClick={() => setConfirming(true)}>
                    {translate('integration.confirmHandover')}
                  </ManagerButton>
                )}
              </div>
            )}
            <ManagerActionState action={action} />
          </>
        )}
      </ManagerSection>
      {confirming && (
        <Dialog
          presentation='sheet'
          title={translate('integration.confirmHandover')}
          hint={translate('confirmAction')}
          onClose={() => {
            if (!action.isPending) setConfirming(false)
          }}
        >
          <div className='flex justify-end gap-3'>
            <ManagerButton disabled={action.isPending} onClick={() => setConfirming(false)}>
              {translate('cancel')}
            </ManagerButton>
            <ManagerButton
              primary
              busy={action.isPending}
              disabled={action.blocked || !canConfirm}
              onClick={() => action.mutate()}
            >
              {action.retrySeconds ? translate('retryAfter', { seconds: action.retrySeconds }) : translate('confirm')}
            </ManagerButton>
          </div>
        </Dialog>
      )}
    </div>
  )
}
