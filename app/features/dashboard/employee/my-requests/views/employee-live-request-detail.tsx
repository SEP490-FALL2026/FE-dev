import { useState } from 'react'
import {
  ArrowLeft,
  Boxes,
  Building2,
  Calendar,
  Clock,
  FileText,
  Layers,
  UserCheck,
  UserRound,
  XCircle
} from 'lucide-react'
import { EmployeePageHeader } from '../../shared/components/employee-page-header'
import { useTranslation } from 'react-i18next'
import {
  useAccessRequestGet,
  getAccessRequestGetQueryKey
} from '~/shared/api/generated/operations/access-requests/access-request-get'
import { useAccessRequestWithdraw } from '~/shared/api/generated/operations/access-requests/access-request-withdraw'
import { getAccessRequestTimingsGetQueryKey } from '~/shared/api/generated/operations/access-requests/access-request-timings-get'
import { getAccessRequestLineListQueryKey } from '~/shared/api/generated/operations/group-requests/access-request-line-list'
import { getMeAccessRequestListQueryKey } from '~/shared/api/generated/operations/me/me-access-request-list'
import { Dialog, useDashboardFormat } from '../../../dashboard-ui'
import {
  EmployeeButton,
  EmployeeField,
  EmployeeInput,
  EmployeeQueryState,
  EmployeeSection,
  EmployeeStatus
} from '../../shared/components/employee-api-ui'
import { useEmployeeFeedback } from '../../shared/hooks/use-employee-feedback'
import { canOfferWithdrawal, REQUEST_TYPE } from '../enums/request-actions'
import { LiveRequestLines } from '../components/live-request-lines'
import { LiveRequestTimings } from '../components/live-request-timings'
import { EmployeeMoney } from '../../shared/components/employee-money'
import { LiveRequestAssessment } from '../components/live-request-assessment'

export function EmployeeLiveRequestDetail({
  id,
  employeeId,
  onBack
}: {
  id: string
  employeeId?: string
  onBack: () => void
}) {
  const { t: translate } = useTranslation('employee')
  const { formatDateTime, formatNumber } = useDashboardFormat()
  const query = useAccessRequestGet(id, { query: { enabled: !!id } })
  const result = !query.isError ? query.data?.data : undefined
  const request = result && 'request' in result ? result.request : undefined
  const draft = result && 'draft' in result ? result.draft : undefined
  const [confirming, setConfirming] = useState(false)
  const [reason, setReason] = useState('')
  const feedback = useEmployeeFeedback([
    getAccessRequestGetQueryKey(id),
    getAccessRequestTimingsGetQueryKey(id),
    getAccessRequestLineListQueryKey(id),
    getMeAccessRequestListQueryKey()
  ])
  const mutation = useAccessRequestWithdraw({
    mutation: {
      ...feedback,
      retry: false,
      onSuccess: async () => {
        await feedback.onSuccess()
        setConfirming(false)
      }
    }
  })

  const softwareTitle =
    request?.plan?.applicationName ?? request?.proposal?.softwareName ?? translate('redesign.requestSummary')
  const planSubtitle =
    request?.plan?.planName ?? (request?.proposal ? translate('proposal') : translate('redesign.softwareDetails'))

  return (
    <div className='space-y-6'>
      <EmployeePageHeader
        title={translate('requestDetail')}
        icon={FileText}
        actions={
          <EmployeeButton onClick={onBack}>
            <ArrowLeft aria-hidden strokeWidth={1.5} className='size-4' />
            {translate('back')}
          </EmployeeButton>
        }
      />
      <div className='grid items-start gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]'>
        <div className='space-y-6'>
          <EmployeeSection title={translate('redesign.requestSummary')}>
            <EmployeeQueryState query={query} empty={!request && !draft} />
            {draft && (
              <div className='space-y-3'>
                <h2 className='font-semibold'>{translate('drafts')}</h2>
                <EmployeeStatus value={draft.kind} />
                <EmployeeButton onClick={onBack}>{translate('drafts')}</EmployeeButton>
              </div>
            )}
            {request && (
              <div className='space-y-5'>
                {/* Rejection Alert Callout */}
                {request.needDecision?.reason && (
                  <div
                    role='alert'
                    className='flex items-start gap-3.5 rounded-xl border border-danger/30 bg-danger/10 p-4 text-danger-ink'
                  >
                    <XCircle strokeWidth={1.5} className='mt-0.5 size-5 shrink-0 text-danger' />
                    <div className='min-w-0 flex-1 space-y-1'>
                      <h3 className='text-sm font-semibold'>{translate('rejectionReason')}</h3>
                      <p className='text-sm leading-relaxed [overflow-wrap:anywhere]'>
                        {request.needDecision.reason}
                      </p>
                      {request.needStep.assignee && (
                        <p className='text-xs text-muted-foreground'>
                          {translate('currentAssignee')}: {request.needStep.assignee.fullName}
                        </p>
                      )}
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
                      <h2 className='truncate text-lg font-bold text-foreground' title={softwareTitle}>
                        {softwareTitle}
                      </h2>
                      <EmployeeStatus value={request.state} />
                    </div>
                    <p className='truncate text-xs text-muted-foreground' title={planSubtitle}>
                      {planSubtitle}
                    </p>
                  </div>
                </div>

                {/* Scope & Financial Metrics Strip */}
                <div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
                  <div className='rounded-xl border border-border/60 bg-surface p-3.5'>
                    <dt className='text-xs font-medium text-muted-foreground'>{translate('estimatedCost')}</dt>
                    <dd className='mt-1 font-mono text-base font-bold tabular-nums text-foreground'>
                      <EmployeeMoney value={request.pricing.amount} />
                    </dd>
                  </div>

                  <div className='rounded-xl border border-border/60 bg-surface p-3.5'>
                    <dt className='text-xs font-medium text-muted-foreground'>{translate('term')}</dt>
                    <dd className='mt-1 font-mono text-base font-semibold tabular-nums text-foreground'>
                      {request.termMonths ? `${formatNumber(request.termMonths)} tháng` : '—'}
                    </dd>
                  </div>

                  <div className='col-span-2 rounded-xl border border-border/60 bg-surface p-3.5 sm:col-span-1'>
                    <dt className='text-xs font-medium text-muted-foreground'>{translate('redesign.peopleCount')}</dt>
                    <dd className='mt-1 font-mono text-base font-semibold tabular-nums text-foreground'>
                      {formatNumber(request.lineCount)}
                    </dd>
                  </div>
                </div>

                {/* Personnel & Placement Details */}
                <dl className='grid gap-4 rounded-xl border border-border/60 bg-surface p-4 text-sm sm:grid-cols-2'>
                  <div className='border-b border-border/40 pb-3'>
                    <dt className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                      <UserRound strokeWidth={1.5} className='size-3.5' />
                      {translate('requester')}
                    </dt>
                    <dd className='mt-1 truncate font-medium text-foreground' title={request.requester.fullName}>
                      {request.requester.fullName}
                    </dd>
                    {request.requester.employeeCode && (
                      <dd className='font-mono text-xs text-muted-foreground'>{request.requester.employeeCode}</dd>
                    )}
                  </div>

                  <div className='border-b border-border/40 pb-3'>
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

                  {request.beneficiary && (
                    <div className='border-b border-border/40 pb-3'>
                      <dt className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                        <UserCheck strokeWidth={1.5} className='size-3.5' />
                        {translate('beneficiary')}
                      </dt>
                      <dd className='mt-1 truncate font-medium text-foreground' title={request.beneficiary.fullName}>
                        {request.beneficiary.fullName}
                      </dd>
                      {request.beneficiary.employeeCode && (
                        <dd className='font-mono text-xs text-muted-foreground'>{request.beneficiary.employeeCode}</dd>
                      )}
                    </div>
                  )}

                  <div className='border-b border-border/40 pb-3'>
                    <dt className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                      <Layers strokeWidth={1.5} className='size-3.5' />
                      {translate('plan')}
                    </dt>
                    <dd className='mt-1 truncate font-medium text-foreground'>
                      {request.plan?.planName ?? translate('proposal')}
                    </dd>
                  </div>

                  <div className='border-b border-border/40 pb-3 sm:border-b-0 sm:pb-0'>
                    <dt className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                      <Clock strokeWidth={1.5} className='size-3.5' />
                      {translate('currentAssignee')}
                    </dt>
                    <dd className='mt-1 truncate font-medium text-foreground'>
                      {request.needStep.assignee?.fullName ?? translate('awaitingAssignment')}
                    </dd>
                  </div>

                  <div className='pb-1'>
                    <dt className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                      <Calendar strokeWidth={1.5} className='size-3.5' />
                      {translate('submittedAt')}
                    </dt>
                    <dd className='mt-1 font-mono text-xs tabular-nums text-foreground'>
                      {formatDateTime(request.submittedAt)}
                    </dd>
                  </div>
                </dl>

                {/* Business Reason Callout */}
                <div className='space-y-1.5'>
                  <dt className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                    {translate('reason')}
                  </dt>
                  <dd className='rounded-xl border border-border/60 bg-surface-subtle/50 p-4 text-sm leading-relaxed text-foreground'>
                    <p className='whitespace-pre-wrap [overflow-wrap:anywhere]'>{request.businessReason}</p>
                  </dd>
                </div>

                {request.type === REQUEST_TYPE.GROUP_GRANT && (
                  <LiveRequestLines id={id} isRequester={request.requester.employeeId === employeeId} />
                )}

                {request.requester.employeeId === employeeId && canOfferWithdrawal(request.state) && (
                  <div className='flex justify-end border-t border-border/60 pt-4'>
                    <EmployeeButton disabled={feedback.blocked} onClick={() => setConfirming(true)}>
                      {translate('withdraw')}
                    </EmployeeButton>
                  </div>
                )}
              </div>
            )}
          </EmployeeSection>
          {request?.proposal && <LiveRequestAssessment id={id} />}
        </div>

        {request && (
          <aside className='min-w-0'>
            <LiveRequestTimings id={id} />
          </aside>
        )}
      </div>

      {confirming && (
        <Dialog
          presentation='sheet'
          title={translate('withdrawConfirm')}
          hint={translate('withdrawHint')}
          onClose={() => {
            if (!mutation.isPending) setConfirming(false)
          }}
        >
          <form
            onSubmit={(event) => {
              event.preventDefault()
              if (!mutation.isPending && !feedback.blocked)
                mutation.mutate({ id, data: reason.trim() ? { reason: reason.trim() } : {} })
            }}
          >
            <EmployeeField label={translate('reason')}>
              <EmployeeInput
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                maxLength={1000}
                disabled={mutation.isPending}
              />
            </EmployeeField>
            <div className='mt-5 flex justify-end gap-3'>
              <EmployeeButton type='button' disabled={mutation.isPending} onClick={() => setConfirming(false)}>
                {translate('cancel')}
              </EmployeeButton>
              <EmployeeButton primary type='submit' busy={mutation.isPending} disabled={feedback.blocked}>
                {feedback.retrySeconds
                  ? translate('retryAfter', { seconds: feedback.retrySeconds })
                  : translate('withdraw')}
              </EmployeeButton>
            </div>
          </form>
        </Dialog>
      )}
    </div>
  )
}
