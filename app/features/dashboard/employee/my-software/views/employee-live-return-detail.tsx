import { useTranslation } from 'react-i18next'
import {
  AlertTriangle,
  ArrowLeft,
  Boxes,
  Building2,
  Calendar,
  Handshake,
  Undo2,
  UserCheck,
  UserRound,
  XCircle
} from 'lucide-react'
import { EmployeePageHeader } from '../../shared/components/employee-page-header'
import { useReturnRequestGet } from '~/shared/api/generated/operations/return-requests/return-request-get'
import { useDashboardFormat } from '../../../dashboard-ui'
import { EmployeeReturnHandover } from '../components/employee-return-handover'
import { RETURN_STATE } from '../enums/return-state'
import {
  EmployeeButton,
  EmployeeQueryState,
  EmployeeSection,
  EmployeeStatus
} from '../../shared/components/employee-api-ui'

export function EmployeeLiveReturnDetail({
  id,
  onBack,
  employeeId
}: {
  id: string
  onBack: () => void
  employeeId: string
}) {
  const { t: translate } = useTranslation('employee')
  const query = useReturnRequestGet(id, { query: { enabled: !!id } })
  const { formatDate, formatDateTime } = useDashboardFormat()
  const request = !query.isError ? query.data?.data?.returnRequest : undefined

  const appName = request?.plan.applicationName ?? translate('redesign.softwareDetails')
  const planName = request?.plan.planName

  return (
    <div className='space-y-6'>
      <EmployeePageHeader
        title={translate('returnDetail')}
        icon={Undo2}
        actions={
          <EmployeeButton onClick={onBack}>
            <ArrowLeft aria-hidden strokeWidth={1.5} className='size-4' />
            {translate('back')}
          </EmployeeButton>
        }
      />

      <EmployeeSection title={appName}>
        <EmployeeQueryState query={query} empty={!request} />

        {request && (
          <div className='space-y-5'>
            {/* Failure Reason Callout */}
            {request.failureReason && (
              <div
                role='alert'
                className='flex items-start gap-3.5 rounded-xl border border-danger/30 bg-danger/10 p-4 text-danger-ink'
              >
                <XCircle strokeWidth={1.5} className='mt-0.5 size-5 shrink-0 text-danger' />
                <div className='min-w-0 flex-1 space-y-1'>
                  <h3 className='text-sm font-semibold'>{translate('errors.conflict')}</h3>
                  <p className='text-sm leading-relaxed [overflow-wrap:anywhere]'>{request.failureReason}</p>
                </div>
              </div>
            )}

            {/* Software Spotlight Banner */}
            <div className='flex items-center gap-3.5 rounded-xl border border-border/60 bg-surface-subtle/50 p-4'>
              <span
                aria-hidden='true'
                className='grid size-12 shrink-0 place-items-center rounded-xl border border-primary/20 bg-primary-soft text-primary-ink'
              >
                <Boxes strokeWidth={1.5} className='size-6' />
              </span>
              <div className='min-w-0 flex-1'>
                <div className='flex flex-wrap items-center gap-2'>
                  <h2 className='truncate text-lg font-bold text-foreground' title={appName}>
                    {appName}
                  </h2>
                  <EmployeeStatus value={request.state} />
                </div>
                {planName && (
                  <p className='truncate text-xs text-muted-foreground' title={planName}>
                    {planName}
                  </p>
                )}
              </div>
            </div>

            {/* Metadata & Placement Grid */}
            <dl className='grid gap-4 rounded-xl border border-border/60 bg-surface p-4 text-sm sm:grid-cols-2'>
              <div className='border-b border-border/40 pb-3'>
                <dt className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                  <UserRound strokeWidth={1.5} className='size-3.5' />
                  {translate('requester')}
                </dt>
                <dd className='mt-1 truncate font-medium text-foreground' title={request.requestedBy.fullName}>
                  {request.requestedBy.fullName}
                </dd>
                {request.requestedBy.employeeCode && (
                  <dd className='font-mono text-xs text-muted-foreground'>{request.requestedBy.employeeCode}</dd>
                )}
              </div>

              <div className='border-b border-border/40 pb-3'>
                <dt className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                  <UserCheck strokeWidth={1.5} className='size-3.5' />
                  {translate('beneficiary')}
                </dt>
                <dd className='mt-1 truncate font-medium text-foreground' title={request.holder.fullName}>
                  {request.holder.fullName}
                </dd>
                {request.holder.employeeCode && (
                  <dd className='font-mono text-xs text-muted-foreground'>{request.holder.employeeCode}</dd>
                )}
              </div>

              <div className='border-b border-border/40 pb-3 sm:border-b-0 sm:pb-0'>
                <dt className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                  <Building2 strokeWidth={1.5} className='size-3.5' />
                  {translate('department')}
                </dt>
                <dd className='mt-1 truncate font-medium text-foreground' title={request.department.name}>
                  {request.department.name}
                </dd>
                {request.department.code && (
                  <dd className='font-mono text-xs text-muted-foreground'>{request.department.code}</dd>
                )}
              </div>

              <div className='pb-1'>
                <dt className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                  <Calendar strokeWidth={1.5} className='size-3.5' />
                  {translate('submittedAt')}
                </dt>
                <dd className='mt-1 font-mono text-xs tabular-nums text-foreground'>
                  {formatDate(request.requestedOn)}
                </dd>
              </div>
            </dl>

            {/* Return Reason Card */}
            <div className='space-y-1.5'>
              <dt className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                {translate('reason')}
              </dt>
              <dd className='rounded-xl border border-border/60 bg-surface-subtle/50 p-4 text-sm leading-relaxed text-foreground'>
                <p className='whitespace-pre-wrap [overflow-wrap:anywhere]'>{request.reason}</p>
              </dd>
            </div>

            {/* Revocation Note if present */}
            {request.revocationNote && (
              <div className='space-y-1.5'>
                <dt className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                  {translate('assessment.fields.grantMethod')}
                </dt>
                <dd className='rounded-xl border border-border/60 bg-surface-subtle/50 p-4 text-sm leading-relaxed text-foreground'>
                  <p className='whitespace-pre-wrap [overflow-wrap:anywhere]'>{request.revocationNote}</p>
                </dd>
              </div>
            )}

            {/* Handover Duty Card */}
            {request.handover.required && (
              <div className='space-y-3 rounded-xl border border-border/60 bg-surface p-4 text-sm'>
                <div className='flex items-center gap-2 text-foreground font-semibold'>
                  <Handshake strokeWidth={1.5} className='size-4 text-primary-ink' />
                  <h3>
                    {translate(
                      request.handover.confirmed
                        ? 'requestExtras.returnHandover.done'
                        : 'requestExtras.returnHandover.needed'
                    )}
                  </h3>
                </div>

                <div className='grid gap-3 sm:grid-cols-2 text-xs'>
                  {request.handover.dueOn && (
                    <div>
                      <span className='text-muted-foreground'>{translate('dueOn')}: </span>
                      <span className='font-mono font-medium tabular-nums text-foreground'>
                        {formatDate(request.handover.dueOn)}
                      </span>
                    </div>
                  )}

                  {request.handoverConfirmedAt && (
                    <div>
                      <span className='text-muted-foreground'>{translate('statuses.CONFIRMED')}: </span>
                      <span className='font-mono font-medium tabular-nums text-foreground'>
                        {formatDateTime(request.handoverConfirmedAt)}
                      </span>
                    </div>
                  )}
                </div>

                {request.handover.flagged && (
                  <div className='flex items-center gap-2 rounded-lg border border-warning/30 bg-warning/10 p-3 text-xs text-warning-ink'>
                    <AlertTriangle strokeWidth={1.5} className='size-4 shrink-0 text-warning' />
                    <p>{translate('requestExtras.returnHandover.flagged')}</p>
                  </div>
                )}

                {request.state === RETURN_STATE.AWAITING_REVOCATION &&
                  !request.handover.confirmed &&
                  request.requestedBy.employeeId === employeeId && (
                    <div className='pt-2'>
                      <EmployeeReturnHandover id={id} />
                    </div>
                  )}
              </div>
            )}

            <p className='text-xs leading-relaxed text-muted-foreground'>{translate('returnHint')}</p>
          </div>
        )}
      </EmployeeSection>
    </div>
  )
}
