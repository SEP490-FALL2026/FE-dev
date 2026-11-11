import { useTranslation } from 'react-i18next'
import { ArrowLeft, Boxes, CheckCircle2, MessageSquare } from 'lucide-react'
import { useSaasIssueGet, getSaasIssueGetQueryKey } from '~/shared/api/generated/operations/saas-issues/saas-issue-get'
import { useSaasIssueReopen } from '~/shared/api/generated/operations/saas-issues/saas-issue-reopen'
import { getSaasIssueListQueryKey } from '~/shared/api/generated/operations/saas-issues/saas-issue-list'
import { useDashboardFormat } from '../../../dashboard-ui'
import { EmployeePageHeader } from '../../shared/components/employee-page-header'
import {
  EmployeeButton,
  EmployeeField,
  EmployeeQueryState,
  EmployeeSection,
  EmployeeStatus,
  employeeInputClass
} from '../../shared/components/employee-api-ui'
import { useEmployeeFeedback } from '../../shared/hooks/use-employee-feedback'
import { ISSUE_STATE } from '../enums/issue-status'

export function EmployeeIssueDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const { t: translate } = useTranslation('employee')
  const { formatDateTime } = useDashboardFormat()
  const query = useSaasIssueGet(id, { query: { enabled: !!id } })
  const issue = !query.isError ? query.data?.data : undefined
  const feedback = useEmployeeFeedback([getSaasIssueListQueryKey(), getSaasIssueGetQueryKey(id)])
  const reopen = useSaasIssueReopen({ mutation: { ...feedback, retry: false } })
  const canReopen =
    issue?.state === ISSUE_STATE.RESOLVED &&
    !!issue.reopenUntil &&
    new Date(issue.reopenUntil).getTime() > new Date().getTime()

  return (
    <div className='space-y-6'>
      <EmployeePageHeader
        title={translate('issueDetail')}
        icon={MessageSquare}
        actions={
          <EmployeeButton onClick={onBack}>
            <ArrowLeft aria-hidden strokeWidth={1.5} className='size-4' />
            {translate('back')}
          </EmployeeButton>
        }
      />
      <div className='min-w-0 w-full'>
        <EmployeeSection title={translate('issueDetail')}>
          <EmployeeQueryState query={query} empty={!issue} />
          {issue && (
            <div className='space-y-6'>
              <div className='flex flex-wrap items-start gap-4'>
                <span
                  aria-hidden='true'
                  className='grid size-12 shrink-0 place-items-center rounded-lg border border-primary/20 bg-primary-soft text-primary-ink'
                >
                  <Boxes strokeWidth={1.5} className='size-6' />
                </span>
                <div className='min-w-0 flex-1 space-y-1'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <h2 className='break-words text-lg font-semibold text-foreground'>{issue.plan.applicationName}</h2>
                    <EmployeeStatus value={issue.state} />
                  </div>
                  <p className='break-words text-sm text-muted-foreground'>{issue.plan.planName}</p>
                  <p className='break-all font-mono text-xs text-muted-foreground'>{issue.code}</p>
                </div>
              </div>

              <div className='space-y-2 border-t border-border/60 pt-5'>
                <h3 className='text-sm font-medium text-muted-foreground'>{translate('description')}</h3>
                <p className='whitespace-pre-wrap text-sm leading-relaxed text-foreground [overflow-wrap:anywhere]'>
                  {issue.description}
                </p>
              </div>

              <dl className='grid gap-x-8 gap-y-5 border-t border-border/60 pt-5 text-sm sm:grid-cols-2 xl:grid-cols-3'>
                <div className='space-y-1'>
                  <dt className='text-muted-foreground'>{translate('category')}</dt>
                  <dd className='font-medium'>
                    {translate(`statuses.${issue.category}`, { defaultValue: translate('noValue') })}
                  </dd>
                </div>
                <div className='space-y-1'>
                  <dt className='text-muted-foreground'>{translate('impact')}</dt>
                  <dd className='font-medium'>
                    {translate(`statuses.${issue.impact}`, { defaultValue: translate('noValue') })}
                  </dd>
                </div>
                <div className='space-y-1'>
                  <dt className='text-muted-foreground'>{translate('occurredAt')}</dt>
                  <dd className='font-mono tabular-nums'>{formatDateTime(issue.occurredAt)}</dd>
                </div>
                <div className='space-y-1'>
                  <dt className='text-muted-foreground'>{translate('redesign.createdAt')}</dt>
                  <dd className='font-mono tabular-nums'>{formatDateTime(issue.createdAt)}</dd>
                </div>
                <div className='space-y-1'>
                  <dt className='text-muted-foreground'>{translate('dueOn')}</dt>
                  <dd className='font-mono tabular-nums'>{formatDateTime(issue.responseDueOn)}</dd>
                </div>
              </dl>

              {issue.resolution && (
                <div role='status' className='flex items-start gap-3 border-t border-border/60 pt-5 text-success-ink'>
                  <CheckCircle2 aria-hidden='true' strokeWidth={1.5} className='mt-0.5 size-5 shrink-0' />
                  <div className='min-w-0 space-y-1'>
                    <h3 className='text-sm font-medium'>{translate('resolution')}</h3>
                    <p className='whitespace-pre-wrap text-sm leading-relaxed [overflow-wrap:anywhere]'>
                      {issue.resolution}
                    </p>
                  </div>
                </div>
              )}

              {canReopen && (
                <form
                  className='space-y-4 border-t border-border/60 pt-5'
                  onSubmit={async (event) => {
                    event.preventDefault()
                    if (reopen.isPending || feedback.blocked) return
                    const form = event.currentTarget
                    const reason = String(new FormData(form).get('reason') ?? '').trim()
                    if (!reason) return
                    try {
                      await reopen.mutateAsync({ id, data: { reason } })
                      form.reset()
                    } catch {
                      /* Mutation feedback preserves the draft. */
                    }
                  }}
                >
                  <EmployeeField label={translate('reopenReason')}>
                    <textarea
                      required
                      name='reason'
                      maxLength={1000}
                      rows={3}
                      className={employeeInputClass}
                      disabled={reopen.isPending || feedback.blocked}
                    />
                  </EmployeeField>
                  <div className='flex justify-end'>
                    <EmployeeButton primary type='submit' busy={reopen.isPending} disabled={feedback.blocked}>
                      {feedback.retrySeconds
                        ? translate('retryAfter', { seconds: feedback.retrySeconds })
                        : translate('reopen')}
                    </EmployeeButton>
                  </div>
                </form>
              )}
            </div>
          )}
        </EmployeeSection>
      </div>
    </div>
  )
}
