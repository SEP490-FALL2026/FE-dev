import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSaasIssueGet, getSaasIssueGetQueryKey } from '~/shared/api/generated/operations/saas-issues/saas-issue-get'
import {
  useSaasIssueEntryList,
  getSaasIssueEntryListQueryKey
} from '~/shared/api/generated/operations/saas-issues/saas-issue-entry-list'
import { getSaasIssueListQueryKey } from '~/shared/api/generated/operations/saas-issues/saas-issue-list'
import { useSaasIssueAddMessage } from '~/shared/api/generated/operations/saas-issues/saas-issue-add-message'
import { useDashboardFormat } from '../../../dashboard-ui'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { ItField, itInputClass, itButtonClass, itPrimaryClass } from '../../shared/components/it-form'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
import { ISSUE_STATE, knownIssueState, nextIssueStates } from '../enums/issue-state'
import { IssueTransitionDialog } from './issue-transition-dialog'
import { ItPendingIcon } from '../../shared/components/it-pending-icon'

export function IssueDetail({ id, onClose }: { id: string; onClose: () => void }) {
  const { t: translate } = useTranslation('itIssues')
  const { formatDateTime } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const [body, setBody] = useState('')
  const [dialog, setDialog] = useState<'transition' | 'duplicate' | null>(null)
  const query = useSaasIssueGet(id)
  const entries = useSaasIssueEntryList(id, { page, pageSize: 20 })
  const issue = query.data?.data
  const queryKeys = [getSaasIssueGetQueryKey(id), getSaasIssueEntryListQueryKey(id), getSaasIssueListQueryKey()]
  const feedback = useItMutationFeedback(queryKeys, () => setBody(''))
  const message = useSaasIssueAddMessage({ mutation: feedback })
  const terminal =
    !issue ||
    !knownIssueState(issue.state) ||
    issue.state === ISSUE_STATE.CLOSED ||
    issue.state === ISSUE_STATE.DUPLICATE
  return (
    <div className='space-y-5'>
      <button type='button' className={itButtonClass} onClick={onClose}>
        {translate('close')}
      </button>
      <ItQueryState query={query}>
        {issue ? (
          <>
            <header>
              <h1 className='text-2xl font-semibold'>{issue.code}</h1>
              <p className='mt-1 text-sm text-muted-foreground'>
                {translate(`states.${knownIssueState(issue.state) ? issue.state : 'UNKNOWN'}`)}
              </p>
            </header>
            <section className='space-y-3 rounded-lg border border-border bg-surface p-5'>
              <p className='truncate font-medium' title={issue.reporter.fullName}>
                {issue.reporter.fullName}
              </p>
              <p className='truncate text-sm' title={issue.plan.applicationName}>
                {issue.plan.applicationName} / {issue.plan.planName}
              </p>
              <h2 className='text-sm font-semibold'>{translate('description')}</h2>
              <p className='text-sm whitespace-pre-wrap'>{issue.description}</p>
              {issue.resolution && <p className='text-sm whitespace-pre-wrap'>{issue.resolution}</p>}
              <div className='flex flex-wrap gap-3'>
                {nextIssueStates(issue.state).length > 0 && (
                  <button className={itButtonClass} type='button' onClick={() => setDialog('transition')}>
                    {translate('transition')}
                  </button>
                )}
                {!terminal && issue.state !== ISSUE_STATE.RESOLVED && (
                  <button className={itButtonClass} type='button' onClick={() => setDialog('duplicate')}>
                    {translate('duplicate')}
                  </button>
                )}
              </div>
            </section>
            <section className='space-y-4 rounded-lg border border-border bg-surface p-5'>
              <h2 className='font-semibold'>{translate('history')}</h2>
              <ItQueryState query={entries}>
                {!entries.data?.data?.items.length ? (
                  <ItEmpty />
                ) : (
                  <ol className='divide-y divide-border/40'>
                    {entries.data.data.items.map((entry) => (
                      <li key={entry.id} className='space-y-1 py-3 text-sm'>
                        <div className='flex flex-wrap justify-between gap-3'>
                          <span className='truncate' title={entry.author?.fullName}>
                            {entry.author?.fullName}
                          </span>
                          <time className='text-right font-mono text-xs tabular-nums'>
                            {formatDateTime(entry.createdAt)}
                          </time>
                        </div>
                        {entry.body && <p className='whitespace-pre-wrap'>{entry.body}</p>}
                        {entry.toState && (
                          <p className='text-xs text-muted-foreground'>
                            {translate(`states.${knownIssueState(entry.toState) ? entry.toState : 'UNKNOWN'}`)}
                          </p>
                        )}
                      </li>
                    ))}
                  </ol>
                )}
                {entries.data?.data && (
                  <ItPagination
                    page={page}
                    total={entries.data.data.pagination.totalItems}
                    pageSize={20}
                    onChange={setPage}
                    disabled={entries.isFetching}
                  />
                )}
              </ItQueryState>
              {!terminal && (
                <form
                  className='space-y-3'
                  onSubmit={(event) => {
                    event.preventDefault()
                    if (!message.isPending && body.trim()) message.mutate({ id, data: { body: body.trim() } })
                  }}
                >
                  <p className='text-xs text-muted-foreground'>{translate('secretHint')}</p>
                  <ItField label={translate('message')}>
                    <textarea
                      required
                      maxLength={2000}
                      className={itInputClass}
                      placeholder={translate('messagePlaceholder')}
                      value={body}
                      onChange={(event) => setBody(event.target.value)}
                      disabled={message.isPending}
                    />
                  </ItField>
                  <button
                    className={itPrimaryClass}
                    type='submit'
                    aria-busy={message.isPending}
                    disabled={message.isPending || !body.trim()}
                  >
                    <ItPendingIcon pending={message.isPending} />
                    {translate('send')}
                  </button>
                </form>
              )}
            </section>
            {dialog && (
              <IssueTransitionDialog
                key={dialog}
                issue={issue}
                mode={dialog}
                queryKeys={queryKeys}
                onClose={() => setDialog(null)}
              />
            )}
          </>
        ) : (
          <ItEmpty />
        )}
      </ItQueryState>
    </div>
  )
}
