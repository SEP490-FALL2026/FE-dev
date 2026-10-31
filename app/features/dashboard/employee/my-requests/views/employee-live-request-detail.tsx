import { useState } from 'react'
import { ArrowLeft, FileText } from 'lucide-react'
import { EmployeePageHeader } from '../../shared/components/employee-page-header'
import { useTranslation } from 'react-i18next'
import {
  useAccessRequestGet,
  getAccessRequestGetQueryKey
} from '~/shared/api/generated/operations/access-requests/access-request-get'
import { useAccessRequestWithdraw } from '~/shared/api/generated/operations/access-requests/access-request-withdraw'
import { getAccessRequestTimingsGetQueryKey } from '~/shared/api/generated/operations/access-requests/access-request-timings-get'
import { getAccessRequestLineListQueryKey } from '~/shared/api/generated/operations/group-requests/access-request-line-list'
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
    getAccessRequestLineListQueryKey(id)
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
      <div className='grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(280px,0.65fr)]'>
        <EmployeeSection
          title={
            request?.plan?.applicationName ?? request?.proposal?.softwareName ?? translate('redesign.requestSummary')
          }
        >
          <EmployeeQueryState query={query} empty={!request && !draft} />
          {draft && (
            <div className='space-y-3'>
              <h2 className='font-semibold'>{translate('drafts')}</h2>
              <EmployeeStatus value={draft.kind} />
              <p className='truncate text-right font-mono text-xs' title={draft.planId}>
                {translate('planId')}: {draft.planId}
              </p>
              <EmployeeButton onClick={onBack}>{translate('drafts')}</EmployeeButton>
            </div>
          )}
          {request && (
            <>
              <div className='flex flex-wrap items-center justify-between gap-3'>
                <p className='min-w-0 truncate font-mono text-xs' title={request.id}>
                  {request.id}
                </p>
                <EmployeeStatus value={request.state} />
              </div>
              <dl className='grid gap-5 sm:grid-cols-2'>
                {[
                  [translate('requester'), request.requester.fullName],
                  [translate('beneficiary'), request.beneficiary?.fullName ?? translate('group')],
                  [translate('department'), request.department.name],
                  [translate('plan'), request.plan?.planName ?? translate('proposal')],
                  [translate('reason'), request.businessReason],
                  [translate('currentAssignee'), request.needStep.assignee?.fullName ?? translate('awaitingAssignment')]
                ].map(([label, value]) => (
                  <div key={label} className='min-w-0'>
                    <dt className='text-xs text-muted-foreground'>{label}</dt>
                    <dd className='mt-1 break-words text-sm'>{value}</dd>
                  </div>
                ))}
                <div>
                  <dt className='text-right text-xs text-muted-foreground'>{translate('submittedAt')}</dt>
                  <dd className='mt-1 text-right font-mono text-sm tabular-nums'>
                    {formatDateTime(request.submittedAt)}
                  </dd>
                </div>
                <div>
                  <dt className='text-right text-xs text-muted-foreground'>{translate('term')}</dt>
                  <dd className='mt-1 text-right font-mono text-sm tabular-nums'>{formatNumber(request.termMonths)}</dd>
                </div>
              </dl>
              <div className='flex flex-wrap items-center justify-between gap-3 rounded-md bg-surface-subtle p-4'>
                <span className='text-sm text-muted-foreground'>{translate('estimatedCost')}</span>
                <EmployeeMoney value={request.pricing.amount} />
              </div>
              {request.needDecision?.reason && (
                <p className='text-sm'>
                  {translate('rejectionReason')}: {request.needDecision.reason}
                </p>
              )}
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
            </>
          )}
        </EmployeeSection>
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
