import { useState } from 'react'
import {
  AlertTriangle,
  ArrowLeft,
  Boxes,
  Calendar,
  CheckCircle2,
  Clock,
  Handshake,
  Undo2,
  UserCheck,
  UserRound,
  XCircle
} from 'lucide-react'
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
    <div className='space-y-6'>
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
      <ManagerQueryState query={query} empty={!request} />
      {request && (
        <div className='grid items-start gap-6 lg:grid-cols-3'>
          {/* Main Info Column */}
          <div className='space-y-6 lg:col-span-2'>
            <ManagerSection title={translate('integration.returnDetail')}>
              {/* Software Spotlight Banner */}
              <div className='flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/60 bg-surface-subtle/50 p-4'>
                <div className='flex items-center gap-3.5 min-w-0'>
                  <span
                    aria-hidden='true'
                    className='grid size-12 shrink-0 place-items-center rounded-xl border border-primary/20 bg-primary-soft text-primary-ink'
                  >
                    <Boxes strokeWidth={1.5} className='size-6' />
                  </span>
                  <div className='min-w-0'>
                    <h2 className='truncate text-lg font-bold text-foreground' title={request.plan.applicationName}>
                      {request.plan.applicationName}
                    </h2>
                    <p className='truncate text-xs text-muted-foreground' title={request.plan.planName}>
                      {request.plan.planName}
                    </p>
                  </div>
                </div>
                <ManagerStatus value={request.state} />
              </div>

              {/* Failure Reason Callout */}
              {request.failureReason && (
                <div
                  role='alert'
                  className='flex items-start gap-3 rounded-xl border border-danger/30 bg-danger/10 p-4 text-xs font-medium text-danger'
                >
                  <XCircle className='size-4 shrink-0 mt-0.5' />
                  <p className='whitespace-pre-wrap break-words [overflow-wrap:anywhere]'>{request.failureReason}</p>
                </div>
              )}

              {/* Personnel & Placement Details */}
              <dl className='grid gap-4 rounded-xl border border-border/60 bg-surface p-4 text-sm sm:grid-cols-2'>
                <div className='border-b border-border/40 pb-3 sm:border-b-0 sm:pb-0'>
                  <dt className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                    <UserRound strokeWidth={1.5} className='size-3.5' />
                    {translate('employee')}
                  </dt>
                  <dd className='mt-1 truncate font-medium text-foreground' title={request.holder.fullName}>
                    {request.holder.fullName}
                  </dd>
                  <dd className='font-mono text-xs text-muted-foreground'>{request.holder.employeeCode}</dd>
                </div>

                <div className='border-b border-border/40 pb-3 sm:border-b-0 sm:pb-0'>
                  <dt className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                    <UserCheck strokeWidth={1.5} className='size-3.5' />
                    {translate('integration.requester')}
                  </dt>
                  <dd className='mt-1 truncate font-medium text-foreground' title={request.requestedBy.fullName}>
                    {request.requestedBy.fullName}
                  </dd>
                  <dd className='font-mono text-xs text-muted-foreground'>{request.requestedBy.employeeCode}</dd>
                </div>

                <div className='col-span-full border-t border-border/40 pt-3'>
                  <dt className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                    <Calendar strokeWidth={1.5} className='size-3.5' />
                    {translate('integration.requestedOn')}
                  </dt>
                  <dd className='mt-1 font-mono text-xs tabular-nums text-foreground'>
                    {formatDate(request.requestedOn)}
                  </dd>
                </div>
              </dl>

              {/* Return Reason Callout */}
              <div className='space-y-1.5'>
                <dt className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                  {translate('reason')}
                </dt>
                <dd className='rounded-xl border border-border/60 bg-surface-subtle/50 p-4 text-sm leading-relaxed text-foreground'>
                  <p className='whitespace-pre-wrap break-words [overflow-wrap:anywhere]'>{request.reason}</p>
                  <p className='mt-2 text-xs text-muted-foreground'>{translate('integration.returnHint')}</p>
                </dd>
              </div>

              {/* Revocation Note */}
              {request.revocationNote && (
                <div className='space-y-1.5'>
                  <dt className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                    {translate('integration.revocationNote')}
                  </dt>
                  <dd className='rounded-xl border border-border/60 bg-surface p-4 text-sm text-foreground'>
                    <p className='whitespace-pre-wrap break-words [overflow-wrap:anywhere]'>{request.revocationNote}</p>
                  </dd>
                </div>
              )}
            </ManagerSection>
          </div>

          {/* Right Column: Handover & Actions */}
          <div className='space-y-6'>
            {request.handover.required && (
              <ManagerSection title={translate('handovers')}>
                <div className='space-y-4'>
                  <div className='flex items-center gap-3'>
                    <span
                      aria-hidden='true'
                      className='grid size-10 shrink-0 place-items-center rounded-xl border border-primary/20 bg-primary-soft text-primary-ink'
                    >
                      <Handshake strokeWidth={1.5} className='size-5' />
                    </span>
                    <div>
                      <p className='text-sm font-semibold text-foreground'>
                        {translate(
                          request.handover.confirmed ? 'integration.handoverDone' : 'integration.handoverNeeded'
                        )}
                      </p>
                      <p className='text-xs text-muted-foreground'>{translate('handoverHint')}</p>
                    </div>
                  </div>

                  <dl className='space-y-2.5 rounded-xl border border-border/60 bg-surface-subtle/40 p-3 text-xs'>
                    {request.handover.dueOn && (
                      <div className='flex items-center justify-between'>
                        <dt className='flex items-center gap-1.5 text-muted-foreground'>
                          <Clock strokeWidth={1.5} className='size-3.5' />
                          {translate('integration.dueOn')}
                        </dt>
                        <dd className='font-mono font-medium text-foreground'>{formatDate(request.handover.dueOn)}</dd>
                      </div>
                    )}
                    {request.handoverConfirmedAt && (
                      <div className='flex items-center justify-between'>
                        <dt className='flex items-center gap-1.5 text-muted-foreground'>
                          <CheckCircle2 strokeWidth={1.5} className='size-3.5 text-success' />
                          {translate('integration.handoverDone')}
                        </dt>
                        <dd className='font-mono font-medium text-foreground'>
                          {formatDateTime(request.handoverConfirmedAt)}
                        </dd>
                      </div>
                    )}
                  </dl>

                  {request.handover.flagged && (
                    <div className='flex items-start gap-2.5 rounded-xl border border-warning/30 bg-warning/10 p-3 text-xs font-medium text-warning-ink'>
                      <AlertTriangle strokeWidth={1.5} className='size-4 shrink-0 mt-0.5' />
                      <span>{translate('integration.handoverFlagged')}</span>
                    </div>
                  )}

                  {canConfirm && (
                    <ManagerButton
                      primary
                      className='w-full'
                      disabled={action.blocked}
                      onClick={() => setConfirming(true)}
                    >
                      {translate('integration.confirmHandover')}
                    </ManagerButton>
                  )}
                </div>
              </ManagerSection>
            )}
            <ManagerActionState action={action} />
          </div>
        </div>
      )}
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
