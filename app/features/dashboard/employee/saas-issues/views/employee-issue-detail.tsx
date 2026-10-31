import { useTranslation } from 'react-i18next'
import { ArrowLeft, MessageSquare } from 'lucide-react'
import { EmployeePageHeader } from '../../shared/components/employee-page-header'
import { useSaasIssueGet, getSaasIssueGetQueryKey } from '~/shared/api/generated/operations/saas-issues/saas-issue-get'
import {
  useSaasIssueEntryList,
  getSaasIssueEntryListQueryKey
} from '~/shared/api/generated/operations/saas-issues/saas-issue-entry-list'
import { useSaasIssueAddMessage } from '~/shared/api/generated/operations/saas-issues/saas-issue-add-message'
import { useSaasIssueReopen } from '~/shared/api/generated/operations/saas-issues/saas-issue-reopen'
import { getSaasIssueListQueryKey } from '~/shared/api/generated/operations/saas-issues/saas-issue-list'
import { useDashboardFormat } from '../../../dashboard-ui'
import {
  EmployeeButton,
  EmployeeField,
  EmployeePagination,
  EmployeeQueryState,
  EmployeeSection,
  EmployeeStatus,
  employeeInputClass
} from '../../shared/components/employee-api-ui'
import { useEmployeePage } from '../../shared/hooks/use-employee-page'
import { useEmployeeFeedback } from '../../shared/hooks/use-employee-feedback'
import { ISSUE_STATE } from '../enums/issue-status'

export function EmployeeIssueDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const { t: translate } = useTranslation('employee')
  const { formatDateTime } = useDashboardFormat()
  const { page, pageSize, onPage } = useEmployeePage('entriesPage')
  const query = useSaasIssueGet(id, { query: { enabled: !!id } })
  const issue = !query.isError ? query.data?.data : undefined
  const entries = useSaasIssueEntryList(id, { page, pageSize }, { query: { enabled: !!issue } })
  const feedback = useEmployeeFeedback([
    getSaasIssueListQueryKey(),
    getSaasIssueGetQueryKey(id),
    getSaasIssueEntryListQueryKey(id)
  ])
  const message = useSaasIssueAddMessage({ mutation: { ...feedback, retry: false } })
  const reopen = useSaasIssueReopen({ mutation: { ...feedback, retry: false } })
  const busy = message.isPending || reopen.isPending
  const canMessage =
    !!issue &&
    [ISSUE_STATE.NEW, ISSUE_STATE.IN_PROGRESS, ISSUE_STATE.WAITING_REPORTER, ISSUE_STATE.WAITING_PROVIDER].some(
      (state) => state === issue.state
    )
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
      <div className='grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(300px,0.6fr)]'>
        <div className='min-w-0 xl:order-2'>
          <EmployeeSection title={issue?.plan.applicationName ?? translate('redesign.softwareDetails')}>
            <EmployeeQueryState query={query} empty={!issue} />
            {issue && (
              <>
                <div className='flex flex-wrap items-center justify-between gap-3'>
                  <p className='truncate font-mono text-xs' title={issue.code}>
                    {issue.code}
                  </p>
                  <EmployeeStatus value={issue.state} />
                </div>
                <p className='text-sm leading-relaxed break-words whitespace-pre-wrap'>{issue.description}</p>
                <dl className='space-y-4 border-t border-border/50 pt-4 text-sm'>
                  <div className='flex flex-wrap justify-between gap-2'>
                    <dt className='text-muted-foreground'>{translate('category')}</dt>
                    <dd>{translate(`statuses.${issue.category}`, { defaultValue: translate('noValue') })}</dd>
                  </div>
                  <div className='flex flex-wrap justify-between gap-2'>
                    <dt className='text-muted-foreground'>{translate('impact')}</dt>
                    <dd>{translate(`statuses.${issue.impact}`, { defaultValue: translate('noValue') })}</dd>
                  </div>
                  <div>
                    <dt className='text-muted-foreground'>{translate('occurredAt')}</dt>
                    <dd className='mt-2 text-right font-mono text-xs tabular-nums'>
                      {formatDateTime(issue.occurredAt)}
                    </dd>
                  </div>
                  <div>
                    <dt className='text-muted-foreground'>{translate('dueOn')}</dt>
                    <dd className='mt-2 text-right font-mono text-xs tabular-nums'>
                      {formatDateTime(issue.responseDueOn)}
                    </dd>
                  </div>
                </dl>
                {issue.resolution && (
                  <div className='rounded-md bg-surface-subtle p-3'>
                    <p className='text-xs font-medium text-muted-foreground'>{translate('resolution')}</p>
                    <p className='mt-2 text-sm leading-relaxed break-words whitespace-pre-wrap'>{issue.resolution}</p>
                  </div>
                )}
              </>
            )}
          </EmployeeSection>
        </div>
        {issue && (
          <div className='min-w-0 xl:order-1'>
            <EmployeeSection title={translate('conversation')}>
              <EmployeeQueryState
                query={entries}
                empty={!entries.data?.data?.items.length}
                emptyTitle={translate('redesign.noConversation')}
                emptyDescription={translate('redesign.noConversationHint')}
              />
              {!entries.isError &&
                entries.data?.data?.items.map((entry) => (
                  <article key={entry.id} className='rounded-lg border border-border/50 bg-surface-subtle/30 p-4'>
                    <div className='flex flex-wrap items-center justify-between gap-3'>
                      <p className='max-w-56 truncate text-sm font-medium' title={entry.author?.fullName}>
                        {entry.author?.fullName ?? translate('noValue')}
                      </p>
                      <p className='text-right font-mono text-xs text-muted-foreground tabular-nums'>
                        {formatDateTime(entry.createdAt)}
                      </p>
                    </div>
                    {entry.body && (
                      <p className='mt-3 text-sm leading-relaxed break-words whitespace-pre-wrap'>{entry.body}</p>
                    )}
                    {entry.toState && (
                      <div className='mt-3'>
                        <EmployeeStatus value={entry.toState} />
                      </div>
                    )}
                  </article>
                ))}
              <EmployeePagination
                pagination={entries.data?.data?.pagination}
                onPage={onPage}
                busy={entries.isFetching}
              />
              {(canMessage || canReopen) && (
                <form
                  className='space-y-4 border-t border-border/60 pt-4'
                  onSubmit={async (event) => {
                    event.preventDefault()
                    if (busy || feedback.blocked) return
                    const form = event.currentTarget
                    const body = String(new FormData(form).get('message') ?? '').trim()
                    if (!body) return
                    try {
                      if (canReopen) await reopen.mutateAsync({ id, data: { reason: body } })
                      else await message.mutateAsync({ id, data: { body } })
                      form.reset()
                    } catch {
                      /* Mutation feedback preserves the draft. */
                    }
                  }}
                >
                  <EmployeeField label={translate(canReopen ? 'reopenReason' : 'message')}>
                    <textarea
                      required
                      name='message'
                      maxLength={canReopen ? 1000 : 2000}
                      rows={3}
                      className={employeeInputClass}
                      disabled={busy || feedback.blocked}
                    />
                  </EmployeeField>
                  <div className='flex justify-end'>
                    <EmployeeButton primary type='submit' busy={busy} disabled={feedback.blocked}>
                      {feedback.retrySeconds
                        ? translate('retryAfter', { seconds: feedback.retrySeconds })
                        : translate(canReopen ? 'reopen' : 'sendMessage')}
                    </EmployeeButton>
                  </div>
                </form>
              )}
            </EmployeeSection>
          </div>
        )}
      </div>
    </div>
  )
}
