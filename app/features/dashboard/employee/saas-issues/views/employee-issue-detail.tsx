import { useTranslation } from 'react-i18next'
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
      <EmployeeButton onClick={onBack}>{translate('back')}</EmployeeButton>
      <h1 className='text-2xl font-semibold'>{translate('issueDetail')}</h1>
      <EmployeeSection title={issue?.plan.applicationName ?? translate('issueDetail')}>
        <EmployeeQueryState query={query} empty={!issue} />
        {issue && (
          <>
            <div className='flex flex-wrap justify-between gap-2'>
              <p className='truncate font-mono text-xs' title={issue.code}>
                {issue.code}
              </p>
              <EmployeeStatus value={issue.state} />
            </div>
            <p className='text-sm break-words whitespace-pre-wrap'>{issue.description}</p>
            {issue.resolution && (
              <p className='text-sm'>
                {translate('resolution')}: {issue.resolution}
              </p>
            )}
            <section className='space-y-3 border-t border-border/60 pt-4'>
              <h2 className='font-semibold'>{translate('conversation')}</h2>
              <EmployeeQueryState query={entries} empty={!entries.data?.data?.items.length} />
              {!entries.isError &&
                entries.data?.data?.items.map((entry) => (
                  <article key={entry.id} className='border-b border-border/40 py-3'>
                    <div className='flex flex-wrap justify-between gap-2'>
                      <p className='truncate text-xs font-medium' title={entry.author?.fullName}>
                        {entry.author?.fullName ?? translate('noValue')}
                      </p>
                      <p className='text-right font-mono text-xs tabular-nums'>{formatDateTime(entry.createdAt)}</p>
                    </div>
                    {entry.body && <p className='mt-2 text-sm break-words whitespace-pre-wrap'>{entry.body}</p>}
                    {entry.toState && <EmployeeStatus value={entry.toState} />}
                  </article>
                ))}
              <EmployeePagination
                pagination={entries.data?.data?.pagination}
                onPage={onPage}
                busy={entries.isFetching}
              />
            </section>
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
          </>
        )}
      </EmployeeSection>
    </div>
  )
}
