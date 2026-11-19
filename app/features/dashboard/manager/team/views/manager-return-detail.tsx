import { ArrowLeft, Boxes, Calendar, Undo2, UserCheck, UserRound, XCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useReturnRequestGet } from '~/shared/api/generated/operations/return-requests/return-request-get'
import { useDashboardFormat } from '../../../dashboard-ui'
import { ManagerPageHeader } from '../../shared/components/manager-page-header'
import { ManagerButton, ManagerQueryState, ManagerSection, ManagerStatus } from '../../shared/components/manager-api-ui'

export function ManagerReturnDetail({ id, onBack }: { id: string; employeeId: string; onBack: () => void }) {
  const { t: translate } = useTranslation('manager')
  const { formatDate } = useDashboardFormat()
  const query = useReturnRequestGet(id)
  const request = !query.isError ? query.data?.data?.returnRequest : null
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
        <div className='space-y-6'>
          {/* Main Info Column */}
          <div className='space-y-6'>
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
        </div>
      )}
    </div>
  )
}
