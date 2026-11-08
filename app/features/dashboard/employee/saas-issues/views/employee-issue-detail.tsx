import { useTranslation } from 'react-i18next'
import { ArrowLeft, Boxes, CheckCircle2, MessageSquare } from 'lucide-react'
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
      <div className='grid items-start gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)]'>
        <div className='min-w-0 xl:order-2'>
          <EmployeeSection title={issue?.plan.applicationName ?? translate('redesign.softwareDetails')}>
            <EmployeeQueryState query={query} empty={!issue} />
            {issue && (
              <div className='space-y-5'>
                {/* Spotlight Banner */}
                <div className='flex items-center gap-3.5 rounded-xl border border-border/60 bg-surface-subtle/50 p-4'>
                  <span
                    aria-hidden='true'
                    className='grid size-12 shrink-0 place-items-center rounded-xl border border-primary/20 bg-primary-soft text-primary-ink'
                  >
                    <Boxes strokeWidth={1.5} className='size-6' />
                  </span>
                  <div className='min-w-0 flex-1'>
                    <div className='flex flex-wrap items-center gap-2'>
                      <h2 className='truncate text-lg font-bold text-foreground' title={issue.plan.applicationName}>
                        {issue.plan.applicationName}
                      </h2>
                      <EmployeeStatus value={issue.state} />
                    </div>
                    <p className='truncate font-mono text-xs text-muted-foreground' title={issue.code}>
                      {issue.code}
                    </p>
                  </div>
                </div>

                {/* Issue Description */}
                <div className='space-y-1.5'>
                  <dt className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                    {translate('reason')}
                  </dt>
                  <dd className='rounded-xl border border-border/60 bg-surface-subtle/50 p-4 text-sm leading-relaxed text-foreground'>
                    <p className='whitespace-pre-wrap [overflow-wrap:anywhere]'>{issue.description}</p>
                  </dd>
                </div>

                {/* Resolution Callout if resolved */}
                {issue.resolution && (
                  <div
                    role='status'
                    className='flex items-start gap-3 rounded-xl border border-success/30 bg-success/10 p-4 text-success-ink'
                  >
                    <CheckCircle2 strokeWidth={1.5} className='mt-0.5 size-5 shrink-0 text-success' />
                    <div className='min-w-0 flex-1 space-y-1'>
                      <h3 className='text-xs font-semibold uppercase tracking-wider text-success'>
                        {translate('resolution')}
                      </h3>
                      <p className='whitespace-pre-wrap text-sm leading-relaxed [overflow-wrap:anywhere]'>
                        {issue.resolution}
                      </p>
                    </div>
                  </div>
                )}

                {/* Issue Details List */}
                <dl className='space-y-3 rounded-xl border border-border/60 bg-surface p-4 text-sm'>
                  <div className='flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-2.5'>
                    <dt className='text-xs text-muted-foreground'>{translate('category')}</dt>
                    <dd className='text-sm font-medium'>
                      {translate(`statuses.${issue.category}`, { defaultValue: translate('noValue') })}
                    </dd>
                  </div>
                  <div className='flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-2.5'>
                    <dt className='text-xs text-muted-foreground'>{translate('impact')}</dt>
                    <dd className='text-sm font-medium'>
                      {translate(`statuses.${issue.impact}`, { defaultValue: translate('noValue') })}
                    </dd>
                  </div>
                  <div className='flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-2.5'>
                    <dt className='text-xs text-muted-foreground'>{translate('occurredAt')}</dt>
                    <dd className='font-mono text-xs tabular-nums text-foreground'>
                      {formatDateTime(issue.occurredAt)}
                    </dd>
                  </div>
                  <div className='flex flex-wrap items-center justify-between gap-2 pb-1'>
                    <dt className='text-xs text-muted-foreground'>{translate('dueOn')}</dt>
                    <dd className='font-mono text-xs tabular-nums text-foreground'>
                      {formatDateTime(issue.responseDueOn)}
                    </dd>
                  </div>
                </dl>
              </div>
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
              {!entries.isError && (
                <div className='space-y-3'>
                  {entries.data?.data?.items.map((entry) => (
                    <article
                      key={entry.id}
                      className='space-y-2.5 rounded-xl border border-border/60 bg-surface p-4 transition-colors'
                    >
                      <div className='flex flex-wrap items-center justify-between gap-2 border-b border-border/30 pb-2'>
                        <div className='flex min-w-0 items-center gap-2'>
                          <span
                            aria-hidden='true'
                            className='grid size-7 shrink-0 place-items-center rounded-full bg-primary-soft text-xs font-bold text-primary-ink'
                          >
                            {(entry.author?.fullName ?? 'U')[0].toUpperCase()}
                          </span>
                          <p
                            className='truncate text-sm font-semibold text-foreground'
                            title={entry.author?.fullName}
                          >
                            {entry.author?.fullName ?? translate('noValue')}
                          </p>
                        </div>
                        <p className='font-mono text-xs text-muted-foreground tabular-nums'>
                          {formatDateTime(entry.createdAt)}
                        </p>
                      </div>
                      {entry.body && (
                        <p className='whitespace-pre-wrap text-sm leading-relaxed text-foreground [overflow-wrap:anywhere]'>
                          {entry.body}
                        </p>
                      )}
                      {entry.toState && (
                        <div className='pt-1'>
                          <EmployeeStatus value={entry.toState} />
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              )}
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
